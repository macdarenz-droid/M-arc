/**
 * WATCH-B (Gate B, docs/WATCH-ARCHITECTURE.md 5, 6 and 9): the one entry point for workout
 * commands from the watch. Each command applies at most once, and is answered only after its
 * change and receipt are saved. It is synchronous: JS runs only while M/ARC is open, and a native
 * acknowledgement is never a command result (Gate A probe 2, runs F and J).
 */
import { WATCH_COMMAND_KINDS, type ActiveSession, type AppState, type CommandReceipt, type CommandRejectReason, type CommandResult, type Effort, type LoadUnit, type LoggedSet, type StoredCommandResult, type WatchCommandKind } from '@/core/models';
import { commitNow, state } from '@/core/store';
import { fromNewerBuild, repairCommands } from '@/core/dataVersion';
import { enteredLoad } from '@/core/units';
import { addRestStep, commitStep, finishStep, isCommitted, pauseStep, resumeStep, skipRestStep, withActive, type Step } from './session';

export type { CommandResult } from '@/core/models';

/** Gate A probe 2: 1000 B messages work both ways. */
export const MAX_COMMAND_BYTES = 1000;
export const MAX_RECEIPTS = 500;
/** An action time further ahead of the phone's clock is not believed; Gate C estimates the offset. */
export const FUTURE_SLACK_MS = 5_000;

type Load = { value: number; unit: LoadUnit };
type WatchCommand = { v: 1; commandId: string; sessionId: string; actionAt: number } & (
  | { kind: 'complete_set'; setId: string; expectedRev: number; load?: Load; reps: number; effort?: Effort }
  | { kind: 'rest_add_30' | 'rest_skip'; restId: string }
  | { kind: 'pause' | 'resume' | 'finish' }
);

const COMMAND_ID = /^[A-Za-z0-9_-]{8,64}$/;
const EFFORTS: Effort[] = ['easy', 'ideal', 'max'];
const UNITS: LoadUnit[] = ['kg', 'lb'];
/** A plain object's own fields, copied onto an object without a prototype, so nothing inherited is ever read. Anything else is null. */
function ownFields(v: unknown): Record<string, unknown> | null {
  if (!v || typeof v !== 'object' || Array.isArray(v)) return null;
  const proto: unknown = Object.getPrototypeOf(v);
  return proto === Object.prototype || proto === null ? Object.assign(Object.create(null) as Record<string, unknown>, v) : null;
}
const text = (v: unknown): v is string => typeof v === 'string' && v.length >= 1 && v.length <= 64;
const whole = (v: unknown, min: number, max: number): v is number => typeof v === 'number' && Number.isInteger(v) && v >= min && v <= max;
const isLoad = (v: Record<string, unknown> | null): v is Record<string, unknown> & Load => !!v && typeof v.value === 'number' && v.value >= 0 && v.value <= 1000 && UNITS.includes(v.unit as LoadUnit);
const bytes = (v: unknown): number => { try { return new TextEncoder().encode(JSON.stringify(v)).length; } catch { return Infinity; } };

const rejected = (commandId: string, reason: CommandRejectReason): StoredCommandResult => ({ commandId, status: 'rejected', reason, replayed: false });

/** Rule 1: the command as sent, or why it is refused. Fields a later watch adds are ignored. */
function parse(input: unknown): WatchCommand | { commandId: string; reason: 'unsupported' | 'invalid' } {
  const raw = ownFields(input);
  const commandId = raw && typeof raw.commandId === 'string' ? raw.commandId.slice(0, 64) : '';
  const no = (reason: 'unsupported' | 'invalid') => ({ commandId, reason });
  if (!raw || typeof raw.v !== 'number' || typeof raw.kind !== 'string') return no('invalid');
  if (raw.v !== 1 || !WATCH_COMMAND_KINDS.includes(raw.kind as WatchCommandKind)) return no('unsupported');
  if (bytes(raw) > MAX_COMMAND_BYTES || typeof raw.commandId !== 'string' || !COMMAND_ID.test(raw.commandId) || !text(raw.sessionId) || !whole(raw.actionAt, 1, 8.64e15)) return no('invalid');
  const base = { v: 1 as const, commandId: raw.commandId, sessionId: raw.sessionId, actionAt: raw.actionAt };
  const kind = raw.kind as WatchCommandKind;
  if (kind === 'complete_set') {
    const { setId, expectedRev, reps, effort } = raw;
    if (!text(setId) || !whole(expectedRev, 0, Number.MAX_SAFE_INTEGER) || !whole(reps, 1, 100)) return no('invalid');
    if (effort !== undefined && !EFFORTS.includes(effort as Effort)) return no('invalid');
    let load: Load | undefined;
    if (raw.load !== undefined) {
      const l = ownFields(raw.load);
      if (!isLoad(l)) return no('invalid');
      load = { value: l.value, unit: l.unit };
    }
    return { ...base, kind, setId, expectedRev, reps, ...(load ? { load } : {}), ...(effort ? { effort: effort as Effort } : {}) };
  }
  if (kind === 'rest_add_30' || kind === 'rest_skip') return text(raw.restId) ? { ...base, kind, restId: raw.restId } : no('invalid');
  return { ...base, kind };
}

/** FNV-1a, 64-bit, as 16 hex characters. The 32-bit one collides among the loads and reps one set allows. */
function fnv64(s: string): string {
  let h = 0xcbf29ce484222325n;
  for (let i = 0; i < s.length; i++) h = ((h ^ BigInt(s.charCodeAt(i))) * 0x100000001b3n) & 0xffffffffffffffffn;
  return h.toString(16).padStart(16, '0');
}

/** Everything the command says, its session included (QA-W-2), in a fixed order. */
function fingerprint(c: WatchCommand): string {
  const body = c.kind === 'complete_set' ? [c.setId, c.expectedRev, c.load?.value ?? null, c.load?.unit ?? null, c.reps, c.effort ?? null] : 'restId' in c ? [c.restId] : [];
  return fnv64(JSON.stringify([c.v, c.sessionId, c.kind, c.actionAt, body]));
}

/** Rule 4 and the change: why the target refuses it, or the state it leads to and the effects for after the save. */
type Outcome = { reason: CommandRejectReason } | { state: AppState; effects: () => void; finish?: 'saved' | 'discarded' };

/** A rest's time left at `now`, held while paused. */
const restLeftMs = (a: ActiveSession, now: number): number => (a.pausedAt
  ? (a.rest!.pausedRemainingSec ?? Math.round((a.rest!.endsAt - a.pausedAt) / 1000)) * 1000
  : a.rest!.endsAt - now);

function outcome(s: AppState, a: ActiveSession, c: WatchCommand, receivedAt: number): Outcome {
  const applied = (step: Step): Outcome => ({ state: withActive(s, step.active), effects: step.effects });
  switch (c.kind) {
    case 'complete_set': {
      const set = a.entries.flatMap(e => e.sets).find(x => x.id === c.setId);
      if (!set) return { reason: 'target_missing' };
      // QA-W-6: a committed set is reported as such, before its revision is compared.
      if (isCommitted(set)) return { reason: 'already_committed' };
      if ((set.rev ?? 0) !== c.expectedRev) return { reason: 'stale_revision' };
      // The earlier of the watch's action time and the receive time. One before the session or
      // too far ahead cannot be right, so the receive time is used; ahead is flagged.
      const future = c.actionAt > receivedAt + FUTURE_SLACK_MS;
      const at = future || c.actionAt < Date.parse(a.startedAt) ? receivedAt : Math.min(c.actionAt, receivedAt);
      // Saved as a typed set is (enteredLoad), to 0.01 (WATCH-C3: a float leftover of the watch's steps is not kept); no load means none.
      const values: Partial<LoggedSet> = {
        ...(c.load ? enteredLoad(Math.round(c.load.value * 100) / 100, c.load.unit) : { kg: undefined, entered: undefined }),
        reps: c.reps,
        effort: c.effort,
        receivedAt: new Date(receivedAt).toISOString(),
        ...(future ? { flags: [...new Set([...(set.flags ?? []), 'future_time' as const])] } : {}),
      };
      return applied(commitStep(a, c.setId, at, s.preferences, values, true));
    }
    case 'rest_add_30':
      // An ended rest is never restarted because its +30 s arrived late (WATCH-ARCHITECTURE 6).
      return a.rest?.id === c.restId && restLeftMs(a, receivedAt) > 0 ? applied(addRestStep(a, 30, receivedAt)) : { reason: 'stale_rest' };
    case 'rest_skip':
      return a.rest?.id === c.restId ? applied(skipRestStep(a)) : { reason: 'stale_rest' };
    case 'pause':
      return a.pausedAt ? { reason: 'invalid_state' } : applied(pauseStep(a, receivedAt));
    case 'resume':
      return a.pausedAt ? applied(resumeStep(a, receivedAt)) : { reason: 'invalid_state' };
    case 'finish':
      return finishStep(s, a, receivedAt);
  }
}

/**
 * Applies one watch command at most once and answers it. `applied` and `rejected` answers are
 * kept as receipts (rules 1 to 3 refuse without keeping one); `not_saved` keeps nothing, so the
 * watch may send the same command again.
 */
export function handleWorkoutCommand(cmd: unknown, receivedAt = Date.now()): CommandResult {
  // A receive time that cannot be read is the phone's clock now.
  const received = typeof receivedAt === 'number' && Number.isFinite(receivedAt) ? receivedAt : Date.now();
  const c = parse(cmd);
  if ('reason' in c) return rejected(c.commandId, c.reason);
  const s = state.value;
  // A newer build's save: its log is not this build's to read or extend (upgradeData leaves it).
  if (fromNewerBuild(s)) return rejected(c.commandId, 'unsupported');
  const log = repairCommands(s.commands);
  const fp = fingerprint(c);
  // Rule 2: by id alone, so the same id for another session or payload is a conflict, never a new command.
  const prior = log.receipts.find(r => r.commandId === c.commandId);
  if (prior) {
    const same = prior.fp === fp && prior.sessionId === c.sessionId && prior.kind === c.kind && prior.actionAt === c.actionAt;
    return same ? { ...prior.result, replayed: true } : rejected(c.commandId, 'id_conflict');
  }
  // Rule 3: a command never creates, reopens or crosses into a session.
  if (log.closed.some(x => x.sessionId === c.sessionId) || s.sessions.some(x => x.id === c.sessionId)) return rejected(c.commandId, 'session_closed');
  const a = s.active;
  if (!a) return rejected(c.commandId, 'no_session');
  if (a.id !== c.sessionId) return rejected(c.commandId, 'wrong_session');
  // Rule 5: a session's full log refuses instead of dropping a receipt a resend may still need.
  // Only this session's count; the last closed session's receipts are kept beside them.
  if (log.receipts.filter(r => r.sessionId === a.id).length >= MAX_RECEIPTS) return rejected(c.commandId, 'limit_reached');
  const out = outcome(s, a, c, received);
  const result: StoredCommandResult = 'reason' in out
    ? rejected(c.commandId, out.reason)
    : { commandId: c.commandId, status: 'applied', sessionRev: (a.rev ?? 0) + 1, replayed: false, ...(out.finish ? { finish: out.finish } : {}) };
  const receipt: CommandReceipt = { commandId: c.commandId, sessionId: c.sessionId, kind: c.kind, fp, result, actionAt: c.actionAt, receivedAt: received };
  const next = 'reason' in out ? s : out.state;
  // One save holds the change, its revisions and the receipt; nothing is answered or felt before it.
  if (!commitNow(() => ({ ...next, commands: { ...repairCommands(next.commands), receipts: [...log.receipts, receipt] } }))) {
    return { commandId: c.commandId, status: 'not_saved', reason: 'storage_failed' };
  }
  if (!('reason' in out)) out.effects();
  return result;
}
