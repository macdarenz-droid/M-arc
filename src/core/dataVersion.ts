/**
 * WATCH-B: the saved data's own version, kept apart from `version` (isState requires 1). Absent
 * means 0. Version 1 adds set states and revisions, a rest id and the watch command log. Called
 * from store.ts `fill`, so boot, restore and other tabs all upgrade the same way.
 */
import { newId, WATCH_COMMAND_KINDS, type ActiveSession, type AppState, type ClosedSession, type CommandLog, type CommandReceipt, type LoggedSet } from './models';

export const DATA_VERSION = 1;
export const MAX_CLOSED = 50;

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === 'object' && !Array.isArray(v);
const str = (v: unknown): v is string => typeof v === 'string';
const finite = (v: unknown): v is number => typeof v === 'number' && Number.isFinite(v);

/** The version a save was written with: a whole number 0 or above, else 0. */
export const savedVersion = (v: unknown): number => (typeof v === 'number' && Number.isInteger(v) && v >= 0 ? v : 0);

/** A newer build's save: its command log is that build's to read and extend, never this one's. */
export const fromNewerBuild = (s: Pick<AppState, 'dataVersion'>): boolean => savedVersion(s.dataVersion) > DATA_VERSION;

/** Filled in, as brain/exposure `hasEntry` reads it (core does not import brain). */
const filled = (s: LoggedSet): boolean => (s.reps ?? 0) > 0 || (s.durationSec ?? 0) > 0 || (s.distanceM ?? 0) > 0;

const isReceipt = (r: unknown): r is CommandReceipt => isObj(r) && str(r.commandId) && str(r.sessionId) && WATCH_COMMAND_KINDS.includes(r.kind as never)
  && str(r.fp) && isObj(r.result) && str(r.result.commandId) && (r.result.status === 'applied' || r.result.status === 'rejected') && finite(r.actionAt) && finite(r.receivedAt);
const isClosed = (c: unknown): c is ClosedSession => isObj(c) && str(c.sessionId) && (c.status === 'finished' || c.status === 'discarded') && finite(c.at);

/** The command log with anything malformed dropped and at most MAX_CLOSED closed sessions. A sound log comes back as the same object. */
export function repairCommands(v: unknown): CommandLog {
  const log = isObj(v) ? v : {};
  const receiptsIn = Array.isArray(log.receipts) ? log.receipts : [];
  const closedIn = Array.isArray(log.closed) ? log.closed : [];
  const receipts = receiptsIn.filter(isReceipt);
  const closed = closedIn.filter(isClosed).slice(-MAX_CLOSED);
  if (isObj(v) && receipts.length === receiptsIn.length && closed.length === closedIn.length && receiptsIn === log.receipts && closedIn === log.closed) return v as unknown as CommandLog;
  return { receipts, closed };
}

/**
 * v0 to v1: a set keeps its state, or is committed when it has a time and is filled in, else a
 * draft. Revisions start at 0 and a rest gets an id. No time field is created or changed.
 */
function v1Active(a: ActiveSession | null): ActiveSession | null {
  if (!a || !Array.isArray(a.entries)) return a;
  return {
    ...a,
    rev: 0,
    entries: a.entries.map(e => ({ ...e, sets: e.sets.map(set => ({ ...set, status: set.status ?? (set.at && filled(set) ? 'committed' : 'draft'), rev: 0 })) })),
    ...(isObj(a.rest) ? { rest: { ...a.rest, id: a.rest.id ?? newId('rest'), rev: 0 } } : {}),
  };
}

/**
 * Brings a filled-in state up to DATA_VERSION. `from` is the version it was saved with. A save
 * from a newer build is left alone. Running it again changes nothing.
 */
export function upgradeData(s: AppState, from: unknown): AppState {
  const v = savedVersion(from);
  if (v > DATA_VERSION) return s;
  if (v === 0) return { ...s, dataVersion: DATA_VERSION, active: v1Active(s.active), commands: { receipts: [], closed: [] } };
  const commands = repairCommands(s.commands);
  return commands === s.commands && s.dataVersion === v ? s : { ...s, dataVersion: v, commands };
}
