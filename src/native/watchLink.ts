/**
 * WATCH-C (Gate C, docs/watch-cards/WATCH-C.md): the phone end of the workout link with the GT 6
 * companion (native/wear/app). Protocol "mw" v1, JSON of at most 1000 B each way:
 * - watch to phone: hello {t,v,k,app,boot,wt,q}, and cmd (WATCH-B's command with t and k);
 * - phone to watch: snap (buildSnapshot: at most 700 B, ASCII; WATCH-C4: fin, a finished workout's highlights), plan
 *   (buildPlan, WATCH-C2: at most 1000 B, ASCII), and res {t,v,k} plus the CommandResult.
 * Debug APK only: the lab's Connect starts it. While M/ARC is hidden it neither handles nor sends, and
 * the watch sends again. Every cmd goes to handleWorkoutCommand and its result goes back whatever the
 * plugin's "by" says: Wire.requestId in WearEnginePlugin.java accepts only marc-a2, so Java never
 * answers a workout message, and this file never switches its acknowledgement on. Hold results and
 * the counters live in memory only. Tests: tests/watch-link.test.ts, tests/watch-contract.test.ts.
 */
import { h } from 'preact';
import { signal, type Signal } from '@preact/signals';
import type { ActiveSession, AppState, CommandResult, Effort, LoadUnit, Session } from '@/core/models';
import { state } from '@/core/store';
import { repairCommands } from '@/core/dataVersion';
import { findExercise } from '@/core/exercises';
import { kgToDisplay, setLoadIn } from '@/core/units';
import { previousSet } from '@/brain/progression';
import { workingIndex } from '@/brain/exposure';
import { loadableValues } from '@/brain/units';
import { exerciseHistory, modeOf } from '@/brain/history';
import { effectiveOneRm } from '@/brain/e1rm';
import { workingTotals } from '@/brain/weekly';
import { DEFAULT_THEME, THEMES, type ThemeId } from '@/theme/themes';
import { themeId } from '@/theme/engine';
import { Row, Toggle } from '@/ui/primitives';
import { entryTarget, openEntryId } from '@/slices/workout/Train';
import { REST_MAX, REST_MIN, isCommitted } from '@/slices/workout/session';
import { activeGymId, profileFor } from '@/slices/workout/units';
import { handleWorkoutCommand } from '@/slices/workout/commands';
import { SEND_OK, watchLab } from './wearEngine';

const MW = 'mw';
const MW_VERSION = 1;
export const MAX_SNAP_BYTES = 700;
export const MAX_PLAN_BYTES = 1000;
export const MAX_PLAN_ROWS = 4;
export const MAX_EX_CHARS = 24;
/** Snaps and plans for changes go at most this often; a hello's answer and the snap after a result go at once. */
export const SNAP_GAP_MS = 300;

/** WATCH-C3: the most next open sets a snap carries (nx). */
export const MAX_NEXT_SETS = 3;
/** WATCH-C4: fin goes while the newest closed session was finished at most this long ago. */
export const FIN_MS = 15 * 60_000;
/** WATCH-C4: the most highlight lines fin carries, and the most of them that are new bests. */
export const MAX_HL = 4;
const MAX_HL_BESTS = 2;

/**
 * The set the watch shows: load w in unit u (null: none), reps r, effort e, and where they came from (src).
 * st (WATCH-C3): the load step in u at w (loadStep); left out without a load or when u is not the profile's unit.
 */
export interface SnapSet { id: string; rev: number; w: number | null; u: LoadUnit; r: number | null; e: Effort | null; src: 'd' | 't' | 'l' | null; st?: number }
/** WATCH-C3: an open set after the shown one: id, rev, load w in the shown set's unit and reps r (null: none). */
export type NextSet = [id: string, rev: number, w: number | null, r: number | null, n: number];
/** Last time's set at the same position, in the unit the set shows: load w and reps r (null: none). */
export interface SnapLast { w: number | null; u: LoadUnit; r: number | null }
/** left: ms to go, held while paused; tot: the rest's length in ms; p: paused. */
export interface SnapRest { id: string; left: number; tot: number; p: boolean }
export interface Snap {
  t: typeof MW; v: typeof MW_VERSION; k: 'snap'; pt: number; wt: number | null; srev: number; sid: string | null;
  ex: string | null; si: number; sn: number; set: SnapSet | null; rest: SnapRest | null; th: [string, string, string];
  /** WATCH-C2: the shown exercise's entry id, and last time for set. The snap without a session has neither (C1 pins it). */
  eid?: string | null; lt?: SnapLast | null;
  /**
   * WATCH-C3, also only with a session: nx, up to MAX_NEXT_SETS open sets after set in the shown entry (none without a
   * set), each with its set number n (red team: sets done in between keep the watch's numbering), dropped from the end to keep the snap within 700 B; rs, the rest in seconds the phone starts after a live set (0: none).
   */
  nx?: NextSet[]; rs?: number;
  /**
   * WATCH-C4, only without a session: when the newest closed session was finished at most FIN_MS ago, its id and up to
   * MAX_HL highlight lines (highlights), each ASCII and at most MAX_EX_CHARS characters. The watch adds its own heart rate.
   */
  fin?: [sessionId: string, hl: string[]];
}
/** An Up next row: entry id, name, sets committed (d) and not skipped (n), its open set as in snap, and last time for it. */
export interface PlanRow { id: string; ex: string; d: number; n: number; set: SnapSet | null; lt: SnapLast | null }
export interface Plan { t: typeof MW; v: typeof MW_VERSION; k: 'plan'; sid: string | null; srev: number; sd: number; st: number; rows: PlanRow[] }
type Entry = ActiveSession['entries'][number];

/** An exercise name the watch can show: ASCII, at most MAX_EX_CHARS characters. */
const asciiName = (name: string): string => name.normalize('NFD').replace(/[^\x20-\x7e]/g, '').replace(/\s+/g, ' ').trim().slice(0, MAX_EX_CHARS).trim() || 'Exercise';

/** A rest's time left at `now`, held while paused (commands.ts restLeftMs). */
const restLeftMs = (a: ActiveSession, now: number): number => (a.pausedAt
  ? (a.rest!.pausedRemainingSec ?? Math.round((a.rest!.endsAt - a.pausedAt) / 1000)) * 1000
  : a.rest!.endsAt - now);

/**
 * The set j of entry as the watch shows it, field by field: the draft's own values (its load in the
 * unit it was entered in), else today's target (Train's entryTarget, the live card's), else last time's
 * set at the same position. Effort is the draft's only. Null for anything but a plain load: the
 * protocol has no load meaning yet (bodyweight added load, assistance) and a timed set has no reps.
 * lt (WATCH-C2): last time's set, in the unit the set shows. `unit` (WATCH-C3, nx): show the load in this
 * unit instead, a draft in another unit converted from its kg; `targets`: the entry's target sets when already known.
 */
function snapSet(s: AppState, a: ActiveSession, entry: Entry, j: number, unit?: LoadUnit, targets?: ReturnType<typeof entryTarget>['sets']): { set: SnapSet; lt: SnapLast | null } | null {
  const set = entry.sets[j]!;
  if ((findExercise(entry.exerciseId, s.customExercises)?.mode ?? 'weighted') !== 'weighted' || !set.id) return null;
  const profile = profileFor(entry.exerciseId, a.gymId ?? activeGymId());
  const eu = profile.unit;
  const wj = workingIndex(entry.sets, j);
  const plan = wj == null ? [] : targets ?? entryTarget(s, entry).sets;
  const target = wj == null ? undefined : plan[Math.min(wj, plan.length - 1)];
  const prev = wj == null ? null : previousSet(s.sessions, entry.exerciseId, wj, s.customExercises);
  const own = set.kg != null || set.reps != null || set.effort != null;
  const kg = set.kg ?? target?.kg ?? prev?.kg ?? null;
  const u = unit ?? set.entered?.unit ?? eu;
  const w = set.entered && set.entered.unit === u ? set.entered.value : kg == null ? null : kgToDisplay(kg, u);
  const src = own ? 'd' : target && (target.kg != null || target.reps != null) ? 't' : prev ? 'l' : null;
  const lt = prev && (prev.kg != null || prev.reps != null) ? { w: prev.kg == null ? null : kgToDisplay(prev.kg, u), u, r: prev.reps ?? null } : null;
  const st = w == null || u !== eu ? undefined : loadStep(loadableValues(profile), w);
  return { set: { id: set.id, rev: set.rev ?? 0, w, u, r: set.reps ?? target?.reps ?? prev?.reps ?? null, e: set.effort ?? null, src, ...(st === undefined ? {} : { st }) }, lt };
}

/**
 * WATCH-C3: the load step at w, in the unit of the loadable values (ascending): the gap from the value at or below w
 * (within half a hundredth) to the next one; the first gap below the lowest, the last at or above the highest.
 * Undefined with fewer than two values.
 */
function loadStep(values: number[], w: number): number | undefined {
  if (values.length < 2) return undefined;
  let i = 0;
  while (i < values.length - 2 && values[i + 1]! <= w + 0.005) i++;
  return Math.round((values[i + 1]! - values[i]!) * 1000) / 1000;
}

/** WATCH-C3: up to MAX_NEXT_SETS open sets after set j of the entry, as snapSet shows them in unit u; up to the first it cannot show. */
function nextSets(s: AppState, a: ActiveSession, entry: Entry, j: number, u: LoadUnit): NextSet[] {
  const out: NextSet[] = [];
  const targets = entryTarget(s, entry).sets;
  for (let k = j + 1; k < entry.sets.length && out.length < MAX_NEXT_SETS; k++) {
    const x = entry.sets[k]!;
    if (isCommitted(x) || x.status === 'skipped') continue;
    const v = snapSet(s, a, entry, k, u, targets)?.set;
    if (!v) break;
    out.push([v.id, v.rev, v.w, v.r, k + 1]);
  }
  return out;
}

/** The entry's first set that is neither committed nor skipped (an unset status counts as a draft), or -1; -1 for an entry done or skipped. */
const openSet = (e: Entry): number => (e.done || e.skipped ? -1 : e.sets.findIndex(x => !isCommitted(x) && x.status !== 'skipped'));

/** The entry's open set and last time for it, as the watch shows them. */
const shown = (s: AppState, a: ActiveSession, e: Entry): { set: SnapSet | null; lt: SnapLast | null } => snapSet(s, a, e, openSet(e)) ?? { set: null, lt: null };

/** The exercise in use on the phone with a set to log (WATCH-C D1): the card open on the phone, else the exercise of the set logged last, else the first in display order. */
function shownEntry(a: ActiveSession, openId: string | null): Entry | undefined {
  const last = a.entries.flatMap(e => e.sets.filter(x => x.at).map(x => ({ e, t: Date.parse(x.at!) }))).sort((p, q) => q.t - p.t)[0]?.e;
  return [a.entries.find(e => e.id === openId), last, ...a.entries].find(e => e && openSet(e) >= 0);
}

/**
 * WATCH-C4: a finished session's highlight lines, the first MAX_HL of, in order:
 * - up to 2 new bests, in workout order: a plain load (as snapSet) whose best e1RM here beats the best of every earlier
 *   session, held sets left out as in its history; it needs an earlier estimate to beat (a first session, or earlier
 *   sets over 10 reps only, is none). "Best: <name> <w> <u> x <r>" with that set, in the snap's unit, the name shortened
 *   to fit; a best whose numbers alone do not fit is left out;
 * - its minutes and sets, as the finish screen counts them;
 * - kg x reps of its working sets (workingTotals) in its loaded exercises' profile unit (the app's unit when they
 *   differ), as a whole number; none when nothing was lifted, as the share card;
 * - its exercises.
 */
function highlights(s: AppState, session: Session): string[] {
  const unitOf = (exerciseId: string) => profileFor(exerciseId, session.gymId ?? activeGymId()).unit;
  const bests: string[] = [];
  for (const e of session.exercises.filter((x, i, all) => all.findIndex(y => y.exerciseId === x.exerciseId) === i)) {
    if (bests.length === MAX_HL_BESTS) break;
    if (modeOf(e.exerciseId, s.customExercises) !== 'weighted') continue;
    const hist = exerciseHistory(s.sessions, e.exerciseId, s.customExercises);
    const i = hist.findIndex(h => h.sessionId === session.id);
    const cur = hist[i];
    const prev = Math.max(0, ...hist.slice(0, i).map(h => h.bestE1rm));
    if (!cur || !(prev > 0 && cur.bestE1rm > prev)) continue;
    const set = cur.sets.find(x => !cur.held.includes(x) && effectiveOneRm(x.kg ?? 0, x.reps ?? 0, x.effort) === cur.bestE1rm);
    if (!set) continue;
    const u = set.entered?.unit ?? unitOf(e.exerciseId);
    const tail = ` ${setLoadIn(set, u)} ${u} x ${set.reps}`;
    const room = MAX_EX_CHARS - 'Best: '.length - tail.length;
    if (room > 0) bests.push(`Best: ${asciiName(e.name).slice(0, room).trim()}${tail}`);
  }
  const sets = session.exercises.reduce((n, e) => n + e.sets.length, 0);
  const n = session.exercises.length;
  const units = new Set(session.exercises.filter(e => workingTotals([e], s.customExercises).volumeKg > 0).map(e => unitOf(e.exerciseId)));
  const u = units.size === 1 ? [...units][0]! : s.preferences.weightUnit;
  const lifted = Math.round(kgToDisplay(workingTotals(session.exercises, s.customExercises).volumeKg, u));
  return [
    ...bests,
    `${Math.round(session.durationSec / 60)} min, ${sets} set${sets === 1 ? '' : 's'}`,
    ...(lifted > 0 ? [`${lifted} ${u} lifted`] : []),
    `${n} exercise${n === 1 ? '' : 's'}`,
  ].slice(0, MAX_HL);
}

/** WATCH-C4: fin for the newest closed session, when it was finished at most FIN_MS before `now` and is in history. */
function finished(s: AppState, now: number): Snap['fin'] {
  const closed = repairCommands(s.commands).closed;
  const last = closed[closed.length - 1];
  const session = last?.status === 'finished' && now - last.at <= FIN_MS ? s.sessions.find(x => x.id === last.sessionId) : undefined;
  return session && [session.id, highlights(s, session)];
}

/**
 * What the watch shows: the shown exercise (shownEntry) and its entry id, that set and last time for it,
 * the next open sets (WATCH-C3), the rest and the rest the phone starts after a live set (commitStep's
 * newRest, WATCH-C3), and the theme's background, text and accent. `wt` echoes the hello this answers.
 * Without a session, fin (WATCH-C4): the highlights of a workout finished at most 15 minutes ago.
 */
export function buildSnapshot(s: AppState, now: number, wt: number | null, theme: ThemeId = themeId.value, openId: string | null = openEntryId.value): Snap {
  const tk = (THEMES[theme] ?? THEMES[DEFAULT_THEME]).tokens;
  const base = { t: MW, v: MW_VERSION, k: 'snap', pt: now, wt } as const;
  const th: Snap['th'] = [tk.bg, tk.text, tk.accent];
  const a = s.active;
  if (!a?.id) {
    // an active session without an id (older saves) is still a session: no fin
    const fin = a ? undefined : finished(s, now);
    return { ...base, srev: 0, sid: null, ex: null, si: 0, sn: 0, set: null, rest: null, th, ...(fin ? { fin } : {}) };
  }
  const rest = a.rest?.id ? { id: a.rest.id, left: Math.max(0, restLeftMs(a, now)), tot: a.rest.totalSec * 1000, p: !!a.pausedAt } : null;
  const rs = s.preferences.autoRest ? Math.max(REST_MIN, Math.min(REST_MAX, s.preferences.restDefaultSec)) : 0;
  const head = { ...base, srev: a.rev ?? 0, sid: a.id };
  const entry = shownEntry(a, openId);
  if (!entry) return { ...head, eid: null, ex: null, si: 0, sn: 0, set: null, lt: null, nx: [], rest, rs, th };
  const j = openSet(entry);
  const cur = shown(s, a, entry);
  const nx = cur.set ? nextSets(s, a, entry, j, cur.set.u) : [];
  const snap: Snap = { ...head, eid: entry.id ?? null, ex: asciiName(entry.name), si: j + 1, sn: entry.sets.length, ...cur, nx, rest, rs, th };
  while (nx.length && new TextEncoder().encode(JSON.stringify(snap)).length > MAX_SNAP_BYTES) nx.pop();
  return snap;
}

/**
 * WATCH-C2 Up next: up to 4 exercises with a set to log, the shown one first, then in display order,
 * wrapping round; rows go from the end until the JSON fits 1000 B. sd: sets committed in the session;
 * st: those and every set still to log, so a done or skipped exercise's unlogged sets do not count.
 */
export function buildPlan(s: AppState, openId: string | null = openEntryId.value): Plan {
  const base = { t: MW, v: MW_VERSION, k: 'plan' } as const;
  const a = s.active;
  if (!a?.id) return { ...base, sid: null, srev: 0, sd: 0, st: 0, rows: [] };
  const d = (e: Entry) => e.sets.filter(isCommitted).length;
  const n = (e: Entry) => d(e) + (e.done || e.skipped ? 0 : e.sets.filter(x => !isCommitted(x) && x.status !== 'skipped').length);
  const first = shownEntry(a, openId);
  const i = first ? a.entries.indexOf(first) : -1;
  const rows = (i < 0 ? [] : [...a.entries.slice(i), ...a.entries.slice(0, i)])
    // a row without an id cannot be picked
    .filter(e => e.id && openSet(e) >= 0).slice(0, MAX_PLAN_ROWS)
    .map(e => ({ id: e.id!, ex: asciiName(e.name), d: d(e), n: n(e), ...shown(s, a, e) }));
  const plan: Plan = { ...base, sid: a.id, srev: a.rev ?? 0, sd: a.entries.reduce((t, e) => t + d(e), 0), st: a.entries.reduce((t, e) => t + n(e), 0), rows };
  while (plan.rows.length && new TextEncoder().encode(JSON.stringify(plan)).length > MAX_PLAN_BYTES) plan.rows.pop();
  return plan;
}

/** A snap without what moves by itself (pt, wt and the rest's countdown): a new one goes only when this differs. */
const projection = (snap: Snap): string => JSON.stringify({ ...snap, pt: 0, wt: 0, rest: snap.rest && { ...snap.rest, left: 0 } });

/** How a result reads in the lab log; an applied set adds the time it is saved at (device runs D2 to D6). */
function word(r: CommandResult, m: Record<string, unknown>): string {
  if (r.status === 'rejected') return `rejected ${r.reason}${r.replayed ? ' replayed' : ''}`;
  if (r.status !== 'applied') return 'not_saved';
  const set = m.kind === 'complete_set' ? state.value.active?.entries.flatMap(e => e.sets).find(x => x.id === m.setId) : undefined;
  const at = set?.at ? ` at ${new Date(set.at).toTimeString().slice(0, 8)}${set.flags?.includes('future_time') ? ' future_time' : ''}` : '';
  return `${r.replayed ? 'replayed' : `applied rev ${r.sessionRev}`}${at}`;
}

/** The watch's action time minus the phone's native receipt, for a first answer: positive means the watch's clock offset runs ahead. */
function lead(r: CommandResult, m: Record<string, unknown>, rxAt: number): string {
  if ('replayed' in r && r.replayed) return '';
  const d = typeof m.actionAt === 'number' && Number.isFinite(m.actionAt) ? m.actionAt - rxAt : NaN;
  return Number.isFinite(d) ? `lead ${d < 0 ? '-' : '+'}${(Math.abs(d) / 1000).toFixed(1)}s ` : '';
}

export interface LinkCounts { hello: number; cmd: number; res: number; snap: number; held: number; hidden: number; bad: number }
interface Doc { visibilityState: string; addEventListener(type: 'visibilitychange', fn: () => void): void }
export interface LinkDeps {
  /** Sends one text to the watch; resolves the send result code, or why the call failed. */
  send(text: string): Promise<number | string>;
  log(text: string): void;
  /** Whether M/ARC is hidden (document.visibilityState). */
  hidden?: () => boolean;
  now?: () => number;
  handle?: (cmd: unknown, rxAt: number) => CommandResult;
  snapshot?: (now: number, wt: number | null) => Snap;
  /** WATCH-C2: the plan for Up next (buildPlan). Without it the link sends snaps only, as in WATCH-C. */
  plan?: () => Plan;
  /** The lab's Connect (listeners first, then the plugin's connect). */
  connect?: () => Promise<void>;
  doc?: Doc | null;
}
export interface Link {
  counts: Signal<LinkCounts>;
  /** Hold results (memory only, off at start): commands still apply, but nothing at all is sent. */
  hold: Signal<boolean>;
  /** Handles one workout message from the watch. rxAt: the plugin's native receipt time. */
  receive(text: string, rxAt?: number): Promise<void>;
  /** The workout or the theme changed. */
  changed(): void;
  /** Sends a fresh snap now. */
  refresh(): Promise<void>;
  /** Connect, then follow the workout, the theme and the screen; clears "Update needed". */
  start(): Promise<void>;
}

export function createLink(deps: LinkDeps): Link {
  const now = deps.now ?? Date.now;
  const hidden = deps.hidden ?? (() => false);
  const handle = deps.handle ?? handleWorkoutCommand;
  const snapshot = deps.snapshot ?? ((t: number, wt: number | null) => buildSnapshot(state.value, t, wt));
  const counts = signal<LinkCounts>({ hello: 0, cmd: 0, res: 0, snap: 0, held: 0, hidden: 0, bad: 0 });
  const hold = signal(false);
  const bump = (k: keyof LinkCounts) => { counts.value = { ...counts.value, [k]: counts.value[k] + 1 }; };
  let lastKey = '';
  let lastPlan = '';
  let lastAt = -Infinity;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let busy = 0;
  let stopped = false;
  let following = false;
  const quiet = () => hidden() || hold.value || stopped;

  /** The latest hello still unanswered (seen while hidden or held, or its answer failed to send): the next snap answers it. */
  let owed: { wt: number; rxAt: number } | null = null;

  /**
   * Never rejects: the timer and the screen event do not wait for it, and an unhandled rejection shows the crash screen (RG-01).
   * A snap that answers a hello carries as `pt` the midpoint of the hello's native receipt (rxAt) and this send, so the
   * watch's offset, pt - (wt + arrival) / 2, leaves out the time the phone's JS took to see the hello, however late the
   * answer goes. The likely cause of 8 of 11 sets coming out future_time in the 1.1.2 device run (README).
   * Resolves whether it sent a snap that answers a hello.
   */
  async function sendSnap(wt: number | null, onlyIfChanged = false, rxAt?: number): Promise<boolean> {
    try {
      const ans = wt !== null ? { wt, rxAt: rxAt ?? NaN } : owed;
      if (quiet()) { if (wt !== null) owed = ans; return false; }
      const t = now();
      const built = snapshot(t, ans ? ans.wt : null);
      const snap = ans && Number.isFinite(ans.rxAt) && ans.rxAt < t ? { ...built, pt: Math.round((ans.rxAt + t) / 2) } : built;
      const key = projection(snap);
      if (onlyIfChanged && key === lastKey) return false;
      lastKey = key;
      lastAt = now();
      bump('snap');
      const r = await deps.send(JSON.stringify(snap));
      if (r !== SEND_OK) { deps.log(`mw snap ${r}`); if (ans) owed = ans; }
      else if (ans && owed && !(owed.rxAt > ans.rxAt)) owed = null;
      return ans !== null;
    } catch (e) {
      deps.log(`mw snap ${e instanceof Error ? e.message : String(e)}`);
      return false;
    }
  }

  /**
   * WATCH-C2: the plan, quiet as the snap and under its 300 ms limit; only when it changed, unless forced. Nothing in
   * it moves by itself, so its text is its projection. Never rejects.
   */
  async function sendPlan(onlyIfChanged: boolean): Promise<void> {
    try {
      if (!deps.plan || quiet()) return;
      const plan = deps.plan();
      // the watch reads only a session's plan
      if (plan.sid === null) return;
      const text = JSON.stringify(plan);
      if (onlyIfChanged && text === lastPlan) return;
      lastPlan = text;
      lastAt = now();
      const r = await deps.send(text);
      // a plan that did not reach the watch goes again with the next sync
      if (r !== SEND_OK) { lastPlan = ''; deps.log(`mw plan ${r}`); }
    } catch (e) {
      lastPlan = '';
      deps.log(`mw plan ${e instanceof Error ? e.message : String(e)}`);
    }
  }

  /** A snap, then the plan: always after a snap that answers a hello, else only when it changed. */
  const sync = async (wt: number | null, onlyIfChanged = false, rxAt?: number): Promise<void> => sendPlan(!(await sendSnap(wt, onlyIfChanged, rxAt)));

  function changed(): void {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      // While a command is being answered, the snap after its result carries the change.
      if (!busy) void sync(null, true);
    }, Math.max(0, lastAt + SNAP_GAP_MS - now()));
  }

  async function receive(text: string, rxAt = now()): Promise<void> {
    let m: Record<string, unknown> | null = null;
    try {
      const v: unknown = JSON.parse(text);
      if (v && typeof v === 'object' && !Array.isArray(v)) m = v as Record<string, unknown>;
    } catch { /* counted as bad below */ }
    if (!m || m.t !== MW) { bump('bad'); deps.log('mw bad'); return; }
    if (hidden()) {
      bump('hidden');
      deps.log(`mw hidden ${String(m.k)}`);
      if (m.k === 'hello' && m.v === MW_VERSION && typeof m.wt === 'number') owed = { wt: m.wt, rxAt };
      return;
    }
    if (m.v !== MW_VERSION) { stopped = true; bump('bad'); deps.log(`mw v${String(m.v)}: update needed`); return; }
    if (stopped) return;
    if (m.k === 'hello') {
      bump('hello');
      // js: from the native receipt to this code, as the lab's own rows show it (Gate A question 4)
      deps.log(`mw hello ${String(m.boot)} q${String(m.q)}${Number.isFinite(rxAt) ? ` js +${now() - rxAt}ms` : ''}`);
      await sync(typeof m.wt === 'number' ? m.wt : null, false, rxAt);
      return;
    }
    // A kind a later watch adds is ignored.
    if (m.k !== 'cmd') return;
    busy++;
    try {
      const result = handle(m, rxAt);
      bump('cmd');
      deps.log(`mw cmd ${result.commandId} ${String(m.kind)} ${String(m.setId ?? m.restId ?? '-')} ${lead(result, m, rxAt)}${word(result, m)}${hold.value ? ' held' : ''}`);
      if (hold.value) { bump('held'); return; }
      const r = await deps.send(JSON.stringify({ t: MW, v: MW_VERSION, k: 'res', ...result }));
      if (r === SEND_OK) bump('res');
      else deps.log(`mw res ${result.commandId} ${r}`);
      await sync(null);
    } finally {
      // A change made while this answer was sending was skipped above; the changed-only check stops a duplicate.
      if (--busy === 0) changed();
    }
  }

  return {
    counts,
    hold,
    receive,
    changed,
    refresh: () => sync(null),
    async start() {
      if (deps.connect) await deps.connect();
      if (!following) {
        following = true;
        state.subscribe(changed);
        themeId.subscribe(changed);
        openEntryId.subscribe(changed);
        const doc = deps.doc;
        doc?.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'visible') void sync(null); });
      }
      stopped = false;
      await sync(null);
    },
  };
}

let link: Link | null = null;
/** The app's one link, over the lab's plugin session. */
export function watchLink(): Link {
  if (link) return link;
  const lab = watchLab();
  const doc = typeof document === 'undefined' ? null : document;
  link = createLink({ send: lab.post, log: lab.note, connect: lab.connect, doc, hidden: () => doc?.visibilityState === 'hidden', plan: () => buildPlan(state.value) });
  lab.route(link.receive);
  return link;
}

/** The link's part of the Watch lab: the Hold results switch and the counters. */
export function WatchLinkPanel() {
  const l = watchLink();
  const c = l.counts.value;
  return h('div', { class: 'stack-sm' },
    h(Row, { trailing: h(Toggle, { checked: l.hold.value, onChange: (on: boolean) => { l.hold.value = on; }, label: 'Hold results' }) }, h('span', { class: 'small' }, 'Hold results')),
    h('p', { class: 'small num' }, `mw hello ${c.hello} cmd ${c.cmd} res ${c.res} snap ${c.snap} held ${c.held} hidden ${c.hidden} bad ${c.bad}`));
}
