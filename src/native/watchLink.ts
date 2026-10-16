/**
 * WATCH-C (Gate C, docs/watch-cards/WATCH-C.md): the phone end of the workout link with the GT 6
 * companion (native/wear/app). Protocol "mw" v1, JSON of at most 1000 B each way:
 * - watch to phone: hello {t,v,k,app,boot,wt,q}, and cmd (WATCH-B's command with t and k);
 * - phone to watch: snap (buildSnapshot: at most 700 B, ASCII), and res {t,v,k} plus the CommandResult.
 * Debug APK only: the lab's Connect starts it. While M/ARC is hidden it neither handles nor sends, and
 * the watch sends again. Every cmd goes to handleWorkoutCommand and its result goes back whatever the
 * plugin's "by" says: Wire.requestId in WearEnginePlugin.java accepts only marc-a2, so Java never
 * answers a workout message, and this file never switches its acknowledgement on. Hold results and
 * the counters live in memory only. Tests: tests/watch-link.test.ts, tests/watch-contract.test.ts.
 */
import { h } from 'preact';
import { signal, type Signal } from '@preact/signals';
import type { ActiveSession, AppState, CommandResult, Effort, LoadUnit } from '@/core/models';
import { state } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { kgToDisplay } from '@/core/units';
import { previousSet } from '@/brain/progression';
import { workingIndex } from '@/brain/exposure';
import { DEFAULT_THEME, THEMES, type ThemeId } from '@/theme/themes';
import { themeId } from '@/theme/engine';
import { Row, Toggle } from '@/ui/primitives';
import { entryTarget } from '@/slices/workout/Train';
import { isCommitted } from '@/slices/workout/session';
import { activeGymId, profileFor } from '@/slices/workout/units';
import { handleWorkoutCommand } from '@/slices/workout/commands';
import { SEND_OK, watchLab } from './wearEngine';

const MW = 'mw';
const MW_VERSION = 1;
export const MAX_SNAP_BYTES = 700;
export const MAX_EX_CHARS = 24;
/** Snaps for changes go at most this often; a hello's answer and the snap after a result go at once. */
export const SNAP_GAP_MS = 300;

/** The set the watch shows: load w in unit u (null: none), reps r, effort e, and where they came from (src). */
export interface SnapSet { id: string; rev: number; w: number | null; u: LoadUnit; r: number | null; e: Effort | null; src: 'd' | 't' | 'l' | null }
/** left: ms to go, held while paused; tot: the rest's length in ms; p: paused. */
export interface SnapRest { id: string; left: number; tot: number; p: boolean }
export interface Snap {
  t: typeof MW; v: typeof MW_VERSION; k: 'snap'; pt: number; wt: number | null; srev: number; sid: string | null;
  ex: string | null; si: number; sn: number; set: SnapSet | null; rest: SnapRest | null; th: [string, string, string];
}
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
 */
function snapSet(s: AppState, a: ActiveSession, entry: Entry, j: number): SnapSet | null {
  const set = entry.sets[j]!;
  if ((findExercise(entry.exerciseId, s.customExercises)?.mode ?? 'weighted') !== 'weighted' || !set.id) return null;
  const eu = profileFor(entry.exerciseId, a.gymId ?? activeGymId()).unit;
  const wj = workingIndex(entry.sets, j);
  const plan = wj == null ? [] : entryTarget(s, entry).sets;
  const target = wj == null ? undefined : plan[Math.min(wj, plan.length - 1)];
  const prev = wj == null ? null : previousSet(s.sessions, entry.exerciseId, wj, s.customExercises);
  const own = set.kg != null || set.reps != null || set.effort != null;
  const kg = set.kg ?? target?.kg ?? prev?.kg ?? null;
  const w = set.entered ? set.entered.value : kg == null ? null : kgToDisplay(kg, eu);
  const src = own ? 'd' : target && (target.kg != null || target.reps != null) ? 't' : prev ? 'l' : null;
  return { id: set.id, rev: set.rev ?? 0, w, u: set.entered?.unit ?? eu, r: set.reps ?? target?.reps ?? prev?.reps ?? null, e: set.effort ?? null, src };
}

/**
 * What the watch shows: the first entry in display order that is neither done nor skipped and still
 * has a set that is neither committed nor skipped (an unset status counts as a draft), that set, the
 * rest, and the theme's background, text and accent. `wt` echoes the hello this answers.
 */
export function buildSnapshot(s: AppState, now: number, wt: number | null, theme: ThemeId = themeId.value): Snap {
  const tk = (THEMES[theme] ?? THEMES[DEFAULT_THEME]).tokens;
  const base = { t: MW, v: MW_VERSION, k: 'snap', pt: now, wt } as const;
  const th: Snap['th'] = [tk.bg, tk.text, tk.accent];
  const a = s.active;
  if (!a?.id) return { ...base, srev: 0, sid: null, ex: null, si: 0, sn: 0, set: null, rest: null, th };
  const rest = a.rest?.id ? { id: a.rest.id, left: Math.max(0, restLeftMs(a, now)), tot: a.rest.totalSec * 1000, p: !!a.pausedAt } : null;
  const head = { ...base, srev: a.rev ?? 0, sid: a.id };
  for (const entry of a.entries) {
    if (entry.done || entry.skipped) continue;
    const j = entry.sets.findIndex(x => !isCommitted(x) && x.status !== 'skipped');
    if (j >= 0) return { ...head, ex: asciiName(entry.name), si: j + 1, sn: entry.sets.length, set: snapSet(s, a, entry, j), rest, th };
  }
  return { ...head, ex: null, si: 0, sn: 0, set: null, rest, th };
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
  let lastAt = -Infinity;
  let timer: ReturnType<typeof setTimeout> | null = null;
  let busy = 0;
  let stopped = false;
  let following = false;
  const quiet = () => hidden() || hold.value || stopped;

  async function sendSnap(wt: number | null, onlyIfChanged = false): Promise<void> {
    if (quiet()) return;
    const snap = snapshot(now(), wt);
    const key = projection(snap);
    if (onlyIfChanged && key === lastKey) return;
    lastKey = key;
    lastAt = now();
    bump('snap');
    const r = await deps.send(JSON.stringify(snap));
    if (r !== SEND_OK) deps.log(`mw snap ${r}`);
  }

  function changed(): void {
    if (timer) return;
    timer = setTimeout(() => {
      timer = null;
      // While a command is being answered, the snap after its result carries the change.
      if (!busy) void sendSnap(null, true);
    }, Math.max(0, lastAt + SNAP_GAP_MS - now()));
  }

  async function receive(text: string, rxAt = now()): Promise<void> {
    let m: Record<string, unknown> | null = null;
    try {
      const v: unknown = JSON.parse(text);
      if (v && typeof v === 'object' && !Array.isArray(v)) m = v as Record<string, unknown>;
    } catch { /* counted as bad below */ }
    if (!m || m.t !== MW) { bump('bad'); deps.log('mw bad'); return; }
    if (hidden()) { bump('hidden'); deps.log(`mw hidden ${String(m.k)}`); return; }
    if (m.v !== MW_VERSION) { stopped = true; bump('bad'); deps.log(`mw v${String(m.v)}: update needed`); return; }
    if (stopped) return;
    if (m.k === 'hello') {
      bump('hello');
      deps.log(`mw hello ${String(m.boot)} q${String(m.q)}`);
      await sendSnap(typeof m.wt === 'number' ? m.wt : null);
      return;
    }
    // A kind a later watch adds is ignored.
    if (m.k !== 'cmd') return;
    busy++;
    try {
      const result = handle(m, rxAt);
      bump('cmd');
      deps.log(`mw cmd ${result.commandId} ${String(m.kind)} ${String(m.setId ?? m.restId ?? '-')} ${word(result, m)}${hold.value ? ' held' : ''}`);
      if (hold.value) { bump('held'); return; }
      const r = await deps.send(JSON.stringify({ t: MW, v: MW_VERSION, k: 'res', ...result }));
      if (r === SEND_OK) bump('res');
      else deps.log(`mw res ${result.commandId} ${r}`);
      await sendSnap(null);
    } finally {
      busy--;
    }
  }

  return {
    counts,
    hold,
    receive,
    changed,
    refresh: () => sendSnap(null),
    async start() {
      if (deps.connect) await deps.connect();
      if (!following) {
        following = true;
        state.subscribe(changed);
        themeId.subscribe(changed);
        const doc = deps.doc;
        doc?.addEventListener('visibilitychange', () => { if (doc.visibilityState === 'visible') void sendSnap(null); });
      }
      stopped = false;
      await sendSnap(null);
    },
  };
}

let link: Link | null = null;
/** The app's one link, over the lab's plugin session. */
export function watchLink(): Link {
  if (link) return link;
  const lab = watchLab();
  const doc = typeof document === 'undefined' ? null : document;
  link = createLink({ send: lab.post, log: lab.note, connect: lab.connect, doc, hidden: () => doc?.visibilityState === 'hidden' });
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
