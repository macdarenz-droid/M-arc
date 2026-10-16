// WATCH-C (Gate C), acceptance C1 to C3: the phone end of the workout link in src/native/watchLink.ts
// (snapshots, routing, results, Hold and hidden), and the source checks that keep the native ack off
// workout messages. The watch side is native/wear/test/link.test.mjs; both together are
// tests/watch-contract.test.ts.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { readFileSync } from 'node:fs';

const fx = vi.hoisted(() => ({
  target: null as null | { sets: Array<{ kg: number | null; reps: number | null; durationSec: number | null; note: string }> },
}));
vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/native/notifications', async orig => ({ ...(await orig<object>()), scheduleRestDone: vi.fn(async () => undefined), cancelRestDone: vi.fn(async () => undefined) }));
vi.mock('@/native/haptics', async orig => {
  const real = await orig<{ haptic: object }>();
  return { ...real, haptic: { ...real.haptic, confirm: vi.fn(async () => undefined), success: vi.fn(async () => undefined), tick: vi.fn(async () => undefined) } };
});
// The 'l' source needs a target without load or reps; every other test uses Train's real entryTarget.
vi.mock('@/slices/workout/Train', async orig => {
  const real = await orig<typeof import('@/slices/workout/Train')>();
  return { ...real, entryTarget: (...args: Parameters<typeof real.entryTarget>) => (fx.target as ReturnType<typeof real.entryTarget> | null) ?? real.entryTarget(...args) };
});

import { freshState, type CommandResult, type LoggedSet, type Split } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { kgToDisplay } from '@/core/units';
import { setTheme } from '@/theme/engine';
import { entryTarget } from '@/slices/workout/Train';
import { addSet, commitSet, markDone, moveEntry, setSet, skipEntry, startRest, startSession, substituteEntry, pauseSession } from '@/slices/workout/session';
import { profileFor } from '@/slices/workout/units';
import { handleWorkoutCommand } from '@/slices/workout/commands';
import { createLab, type WearEnginePlugin } from '@/native/wearEngine';
import { MAX_SNAP_BYTES, SNAP_GAP_MS, buildSnapshot, createLink, type LinkDeps, type Snap } from '@/native/watchLink';
import { sessionAt } from './helpers';

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(), key: (i: number) => [...map.keys()][i] ?? null, get length() { return map.size; },
  } as Storage;
}

const split: Split = {
  id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '',
  exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }, { exerciseId: 'lib_cable_fly', sets: 1 }, { exerciseId: 'lib_plank', sets: 1 }],
};
const T0 = Date.parse('2026-10-16T10:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  fx.target = null;
  initStore(memoryStorage());
  replaceState({ ...freshState(), splits: [split] });
  setTheme('silent-black');
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

const a = () => state.value.active!;
const snap = (wt: number | null = null) => buildSnapshot(state.value, Date.now(), wt);
const ids = (s: Snap) => [s.ex, s.si, s.sn, s.set?.id ?? null];
const committed = (): LoggedSet[] => a().entries.flatMap(e => e.sets).filter(s => s.status === 'committed');

describe('WATCH-C C1 buildSnapshot', () => {
  it('without a session: no session id, no exercise, no set, no rest, and the theme', () => {
    expect(snap(77)).toEqual({ t: 'mw', v: 1, k: 'snap', pt: T0, wt: 77, srev: 0, sid: null, ex: null, si: 0, sn: 0, set: null, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'] });
    setTheme('paper');
    expect(snap().th).toEqual(['#ffffff', '#37352f', '#2383e2']);
  });
  it('picks the first entry in display order that is not done or skipped, and its first set neither committed nor skipped', () => {
    startSession(split);
    const [bench, fly, plank] = a().entries;
    expect(snap().sid).toBe(a().id);
    expect(ids(snap())).toEqual(['Barbell Bench Press', 1, 2, bench!.sets[0]!.id]);
    setSet(0, 0, { kg: 60, entered: { value: 60, unit: 'kg' }, reps: 8 });
    expect(commitSet(0, 0)).toBe(true);
    expect(ids(snap())).toEqual(['Barbell Bench Press', 2, 2, bench!.sets[1]!.id]);
    expect(snap().srev).toBe(a().rev);
    // Reorder: display order wins.
    moveEntry(1, 0);
    expect(ids(snap())).toEqual(['Cable Fly', 1, 1, fly!.sets[0]!.id]);
    skipEntry(0);
    expect(ids(snap())).toEqual(['Barbell Bench Press', 2, 2, bench!.sets[1]!.id]);
    skipEntry(0, false);
    markDone(0);
    expect(snap().ex).toBe('Barbell Bench Press');
    // A skipped set is passed over; an entry with nothing left is too.
    setSet(1, 1, { status: 'skipped' });
    expect(ids(snap())).toEqual(['Plank', 1, 1, null]);
    // Timed: the exercise shows, with no set to complete.
    expect(findExercise('lib_plank')!.mode).toBe('duration');
    expect(snap().set).toBeNull();
    expect(plank!.sets[0]!.id).toBeTruthy();
    // Nothing left at all.
    markDone(2);
    expect(ids(snap())).toEqual([null, 0, 0, null]);
    expect(snap().sid).toBe(a().id);
  });
  it('a substitution gives the new entry and set ids; an unset status counts as a draft', () => {
    startSession(split);
    const old = a().entries[0]!.sets[0]!.id;
    substituteEntry(0, findExercise('lib_dumbbell_bench_press')!);
    const s = snap();
    expect(s.ex).toBe('Dumbbell Bench Press');
    expect(s.set!.id).toBe(a().entries[0]!.sets[0]!.id);
    expect(s.set!.id).not.toBe(old);
    // addSet leaves status unset (WATCH-B B1): after both sets are committed, the added one is next.
    for (const j of [0, 1]) { setSet(0, j, { kg: 20, entered: { value: 20, unit: 'kg' }, reps: 10 }); commitSet(0, j); }
    addSet(0);
    const added = a().entries[0]!.sets[2]!;
    expect(added.status).toBeUndefined();
    expect(ids(snap())).toEqual(['Dumbbell Bench Press', 3, 3, added.id]);
    // It carries the last set's values, so they are its own (d).
    expect(snap().set).toMatchObject({ w: 20, u: 'kg', r: 10, src: 'd' });
  });
  it("values: the draft's own (in its entered unit), else the target, else last time", () => {
    replaceState({ ...state.value, sessions: [sessionAt('2026-10-14T10:00:00.000Z', '2026-10-14T11:00:00.000Z', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 57.5, reps: 9, effort: 'ideal' }, { kg: 55, reps: 7 }] }])] });
    startSession(split);
    const e0 = a().entries[0]!;
    const eu = profileFor('lib_barbell_bench_press', a().gymId).unit;
    const plan = entryTarget(state.value, e0).sets;
    expect(plan[0]!.kg).not.toBeNull();
    expect(snap().set).toEqual({ id: e0.sets[0]!.id, rev: 0, w: kgToDisplay(plan[0]!.kg!, eu), u: eu, r: plan[0]!.reps, e: null, src: 't' });
    setSet(0, 0, { kg: 61.235, entered: { value: 135, unit: 'lb' }, reps: 5, effort: 'max' });
    expect(snap().set).toMatchObject({ w: 135, u: 'lb', r: 5, e: 'max', src: 'd', rev: 1 });
    // No target load or reps: last time's set at the same position.
    fx.target = { sets: [{ kg: null, reps: null, durationSec: null, note: '' }] };
    commitSet(0, 0);
    expect(snap().set).toMatchObject({ id: e0.sets[1]!.id, w: kgToDisplay(55, eu), r: 7, e: null, src: 'l' });
  });
  it('the rest: its id, the time left (held while paused), the total and the pause', () => {
    startSession(split);
    startRest(90);
    expect(snap().rest).toEqual({ id: a().rest!.id, left: 90_000, tot: 90_000, p: false });
    vi.advanceTimersByTime(30_000);
    expect(snap().rest!.left).toBe(60_000);
    pauseSession();
    vi.advanceTimersByTime(45_000);
    expect(snap().rest).toMatchObject({ left: 60_000, p: true });
  });
  it('is at most 700 B and ASCII, with the exercise name folded to at most 24 ASCII characters', () => {
    startSession(split);
    startRest(600);
    const long = 'Développé couché incliné × haltères très long';
    replaceState({ ...state.value, active: { ...a(), id: `s_${'x'.repeat(60)}`, rev: Number.MAX_SAFE_INTEGER, entries: a().entries.map((e, i) => (i ? e : { ...e, name: long, sets: e.sets.map(s => ({ ...s, id: `set_${'y'.repeat(60)}`, rev: Number.MAX_SAFE_INTEGER, kg: 453.59237, entered: { value: 999.75, unit: 'lb' as const }, reps: 100, effort: 'ideal' as const })) })) } });
    const s = snap(8.64e15);
    const text = JSON.stringify(s);
    expect(s.ex).toBe('Developpe couche incline');
    expect(s.ex!.length).toBeLessThanOrEqual(24);
    expect(text).toMatch(/^[\x20-\x7e]+$/);
    expect(new TextEncoder().encode(text).length).toBeLessThanOrEqual(MAX_SNAP_BYTES);
    expect(MAX_SNAP_BYTES).toBe(700);
  });
});

/** The link over a fake radio. */
function rig(over: Partial<LinkDeps> = {}) {
  const sent: string[] = [];
  const rows: string[] = [];
  let hidden = false;
  const deps: LinkDeps = { send: vi.fn(async (t: string) => { sent.push(t); return 207; }), log: t => { rows.push(t); }, hidden: () => hidden, ...over };
  const link = createLink(deps);
  return { link, sent, rows, deps, hide: (h: boolean) => { hidden = h; }, kinds: () => sent.map(t => (JSON.parse(t) as { k: string }).k), last: () => JSON.parse(sent[sent.length - 1]!) as Record<string, unknown> };
}
const mw = (o: Record<string, unknown>) => JSON.stringify({ t: 'mw', v: 1, ...o });
const hello = (wt: number) => mw({ k: 'hello', app: '1.1.0', boot: 'abcd1234', wt, q: 0 });
let n = 0;
const cmd = (o: Record<string, unknown> = {}) => {
  const set = a().entries[0]!.sets[0]!;
  return { t: 'mw', v: 1, k: 'cmd', commandId: `abcd1234-${++n}`, sessionId: a().id, actionAt: Date.now(), kind: 'complete_set', setId: set.id, expectedRev: set.rev ?? 0, load: { value: 60, unit: 'kg' }, reps: 8, ...o };
};

describe('WATCH-C C1 the link sends snaps', () => {
  it("answers a hello with a snap that echoes the hello's wt", async () => {
    const r = rig();
    startSession(split);
    vi.advanceTimersByTime(1234);
    await r.link.receive(hello(T0 + 5));
    expect(r.kinds()).toEqual(['snap']);
    expect(r.last()).toEqual(JSON.parse(JSON.stringify(buildSnapshot(state.value, T0 + 1234, T0 + 5))));
    expect(r.last()).toMatchObject({ pt: T0 + 1234, wt: T0 + 5 });
    expect(r.link.counts.value).toMatchObject({ hello: 1, snap: 1 });
  });
  it('one snap per change, at most one per 300 ms, none when only pt or the rest countdown moved', async () => {
    const doc = { visibilityState: 'visible', addEventListener: vi.fn() };
    const r = rig({ connect: async () => undefined, doc });
    startSession(split);
    startRest(90);
    await r.link.start();
    expect(r.kinds()).toEqual(['snap']);
    await vi.advanceTimersByTimeAsync(5000);
    r.link.changed();
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS);
    expect(r.sent).toHaveLength(1); // the countdown alone is not a change
    setSet(0, 0, { kg: 60, entered: { value: 60, unit: 'kg' }, reps: 8 });
    await vi.advanceTimersByTimeAsync(0);
    expect(r.sent).toHaveLength(2);
    expect((r.last().set as { w: number }).w).toBe(60);
    setSet(0, 0, { reps: 9 });
    setSet(0, 0, { reps: 10 });
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS - 1);
    expect(r.sent).toHaveLength(2); // not within 300 ms of the last one
    await vi.advanceTimersByTimeAsync(1);
    expect(r.sent).toHaveLength(3);
    expect((r.last().set as { r: number }).r).toBe(10);
    await vi.advanceTimersByTimeAsync(2000);
    expect(r.sent).toHaveLength(3);
    setTheme('ember');
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS);
    expect(r.sent).toHaveLength(4);
    // A second start subscribes nothing twice.
    await r.link.start();
    setSet(0, 0, { reps: 11 });
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS);
    expect(r.sent).toHaveLength(6);
    expect(doc.addEventListener).toHaveBeenCalledTimes(1);
  });
  it('sends nothing while M/ARC is hidden, and a fresh snap when it is shown again', async () => {
    const listeners: Array<() => void> = [];
    const doc = { visibilityState: 'visible', addEventListener: (_: string, fn: () => void) => { listeners.push(fn); } };
    const r = rig({ connect: async () => undefined, doc, hidden: () => doc.visibilityState === 'hidden' });
    startSession(split);
    await r.link.start();
    expect(r.sent).toHaveLength(1);
    doc.visibilityState = 'hidden';
    await r.link.receive(hello(T0));
    setSet(0, 0, { reps: 8 });
    await vi.advanceTimersByTimeAsync(1000);
    await r.link.receive(JSON.stringify(cmd()));
    await r.link.refresh();
    expect(r.sent).toHaveLength(1);
    expect(r.link.counts.value).toMatchObject({ hidden: 2, hello: 0, cmd: 0 });
    doc.visibilityState = 'visible';
    for (const fn of listeners) fn();
    await vi.advanceTimersByTimeAsync(0);
    expect(r.kinds()).toEqual(['snap', 'snap']);
  });
});

describe('WATCH-C C2 commands', () => {
  it("a cmd gets exactly the handler's result as res, then a fresh snap, also when by is native", async () => {
    const result: CommandResult = { commandId: 'abcd1234-9', status: 'rejected', reason: 'stale_revision', replayed: true };
    const handle = vi.fn(() => result);
    const r = rig({ handle });
    const plugin = { send: vi.fn(async (o: { text: string }) => { r.sent.push(o.text); return { code: 207 }; }) } as unknown as WearEnginePlugin;
    const lab = createLab(plugin, () => T0 + 50);
    const link = createLink({ ...r.deps, send: lab.post, log: lab.note });
    lab.route(link.receive);
    startSession(split);
    const c = cmd({ commandId: 'abcd1234-9' });
    const text = JSON.stringify(c);
    await lab.receive({ type: 1, data: text, desc: '', dataLen: text.length, descLen: 0, rxAt: T0 + 7, by: 'native', dup: false });
    expect(handle).toHaveBeenCalledTimes(1);
    expect(handle).toHaveBeenCalledWith(c, T0 + 7);
    expect(r.kinds()).toEqual(['res', 'snap']);
    const res = JSON.parse(r.sent[0]!) as Record<string, unknown>;
    expect(Object.keys(res).slice(0, 3)).toEqual(['t', 'v', 'k']);
    const { t: _t, v: _v, k: _k, ...rest } = res;
    expect(rest).toEqual(result);
    expect(new TextEncoder().encode(r.sent[0]!).length).toBeLessThanOrEqual(200);
    // Workout messages never reach the lab's own counters or acknowledgement.
    expect(lab.counts.value).toEqual({ rx: 0, hr: 0, ack: 0, dup: 0, bad: 0 });
    expect(lab.rows.value[0]).toMatch(/^mw cmd abcd1234-9 complete_set set_\S+ rejected stale_revision replayed$/);
  });
  it('every result kind fits 200 B', async () => {
    const id = 'x'.repeat(64);
    for (const result of [
      { commandId: id, status: 'applied', sessionRev: Number.MAX_SAFE_INTEGER, replayed: true, finish: 'discarded' },
      { commandId: id, status: 'rejected', reason: 'already_committed', replayed: false },
      { commandId: id, status: 'not_saved', reason: 'storage_failed' },
    ] as CommandResult[]) {
      const r = rig({ handle: () => result });
      startSession(split);
      await r.link.receive(JSON.stringify(cmd()));
      expect(new TextEncoder().encode(r.sent[0]!).length).toBeLessThanOrEqual(200);
    }
  });
  it('a duplicate gives one stored set and replayed', async () => {
    const r = rig();
    startSession(split);
    const c = JSON.stringify(cmd());
    await r.link.receive(c, T0 + 3000);
    await r.link.receive(c, T0 + 9000);
    const res = r.sent.filter(t => JSON.parse(t).k === 'res').map(t => JSON.parse(t) as { status: string; replayed: boolean; sessionRev: number });
    expect(res.map(x => [x.status, x.replayed])).toEqual([['applied', false], ['applied', true]]);
    expect(res[0]!.sessionRev).toBe(res[1]!.sessionRev);
    expect(committed()).toHaveLength(1);
    expect(committed()[0]).toMatchObject({ kg: 60, reps: 8, at: new Date(T0).toISOString(), receivedAt: new Date(T0 + 3000).toISOString() });
    const at = new Date(T0).toTimeString().slice(0, 8);
    expect(r.rows.filter(x => x.startsWith('mw cmd'))).toEqual([expect.stringMatching(new RegExp(` applied rev \\d+ at ${at}$`)), expect.stringMatching(new RegExp(` replayed at ${at}$`))]);
  });
  it('a cmd that arrives while M/ARC is hidden is not handled; its resend applies once', async () => {
    const handle = vi.fn(handleWorkoutCommand);
    const r = rig({ handle });
    startSession(split);
    const c = JSON.stringify(cmd());
    r.hide(true);
    await r.link.receive(c);
    expect(handle).not.toHaveBeenCalled();
    expect(committed()).toHaveLength(0);
    expect(r.sent).toHaveLength(0);
    r.hide(false);
    await r.link.receive(c);
    await r.link.receive(c);
    expect(committed()).toHaveLength(1);
    expect(r.sent.filter(t => JSON.parse(t).k === 'res').map(t => (JSON.parse(t) as { replayed: boolean }).replayed)).toEqual([false, true]);
  });
  it('Hold results: the command applies, and nothing at all is sent until it is off', async () => {
    const r = rig({ connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined } });
    startSession(split);
    expect(r.link.hold.value).toBe(false);
    r.link.hold.value = true;
    await r.link.start();
    const c = JSON.stringify(cmd());
    await r.link.receive(c);
    await r.link.receive(hello(T0));
    setSet(0, 1, { reps: 3 });
    await vi.advanceTimersByTimeAsync(1000);
    expect(committed()).toHaveLength(1);
    expect(r.sent).toHaveLength(0);
    expect(r.link.counts.value).toMatchObject({ cmd: 1, held: 1, res: 0, snap: 0 });
    expect(r.rows.find(x => x.startsWith('mw cmd'))).toMatch(/ applied rev \d+ at \d\d:\d\d:\d\d held$/);
    r.link.hold.value = false;
    await r.link.receive(c);
    expect(r.kinds()).toEqual(['res', 'snap']);
    expect(r.last()).toMatchObject({ k: 'snap' });
    expect(JSON.parse(r.sent[0]!)).toMatchObject({ status: 'applied', replayed: true });
    expect(committed()).toHaveLength(1);
  });
  it('another version stops the link until the next start; unknown kinds and non-mw text are ignored', async () => {
    const r = rig({ connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined } });
    startSession(split);
    await r.link.receive(mw({ k: 'later' }));
    await r.link.receive('{"t":"marc-a2","v":1,"k":"req","id":"a-1"}');
    await r.link.receive('nope');
    expect(r.sent).toHaveLength(0);
    await r.link.receive(JSON.stringify({ t: 'mw', v: 2, k: 'hello', wt: 1 }));
    await r.link.receive(hello(T0));
    expect(r.sent).toHaveLength(0);
    expect(r.rows).toContain('mw v2: update needed');
    await r.link.start();
    await r.link.receive(hello(T0));
    expect(r.kinds()).toEqual(['snap', 'snap']);
  });
});

describe('WATCH-C review fixes', () => {
  it('only a plain load gets a set: bodyweight, assisted and conditioning show the exercise without one', () => {
    const other: Split = { ...split, id: 'sp2', exercises: [{ exerciseId: 'lib_push_up', sets: 1 }, { exerciseId: 'lib_assisted_pull_up', sets: 1 }, { exerciseId: 'lib_farmer_s_carry', sets: 1 }] };
    replaceState({ ...state.value, splits: [other] });
    startSession(other);
    expect(['lib_push_up', 'lib_assisted_pull_up', 'lib_farmer_s_carry'].map(id => findExercise(id)!.mode)).toEqual(['bodyweight', 'assisted', 'conditioning']);
    for (let i = 0; i < 3; i++) {
      setSet(i, 0, { kg: 10, entered: { value: 10, unit: 'kg' }, reps: 8 });
      expect(ids(snap())).toEqual([a().entries[i]!.name, 1, 1, null]);
      markDone(i);
    }
  });
  it('a change while a command is answered waits for its result: res first, then one snap', async () => {
    const sent: string[] = [];
    let release: () => void = () => undefined;
    const link = createLink({
      send: async t => { sent.push(t); if ((JSON.parse(t) as { k: string }).k === 'res') await new Promise<void>(ok => { release = ok; }); return 207; },
      log: () => undefined, connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined },
    });
    const kinds = () => sent.map(t => (JSON.parse(t) as { k: string }).k);
    startSession(split);
    await link.start();
    vi.advanceTimersByTime(1000);
    const done = link.receive(JSON.stringify(cmd()));
    await vi.advanceTimersByTimeAsync(1000);
    expect(kinds()).toEqual(['snap', 'res']);
    release();
    await done;
    await vi.advanceTimersByTimeAsync(1000);
    expect(kinds()).toEqual(['snap', 'res', 'snap']);
    expect((JSON.parse(sent[2]!) as Snap).si).toBe(2);
  });
  it('a snapshot that throws is logged; no rejection escapes (RG-01)', async () => {
    const rows: string[] = [];
    const link = createLink({ send: async () => 207, log: t => { rows.push(t); }, snapshot: () => { throw new Error('boom'); }, connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined } });
    await expect(link.refresh()).resolves.toBeUndefined();
    await expect(link.receive(hello(T0))).resolves.toBeUndefined();
    await expect(link.start()).resolves.toBeUndefined();
    link.changed();
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS);
    expect(rows.filter(r => r === 'mw snap boom').length).toBeGreaterThanOrEqual(3);
  });
});

describe('WATCH-C the lab routes workout messages to the link', () => {
  it('mw messages go to the link, everything else to the lab as before', async () => {
    const sent: string[] = [];
    const plugin = { send: vi.fn(async (o: { text: string }) => { sent.push(o.text); return { code: 207 }; }) } as unknown as WearEnginePlugin;
    const lab = createLab(plugin, () => 0);
    const seen: Array<[string, number]> = [];
    lab.route(async (text, rxAt) => { seen.push([text, rxAt]); });
    const work = mw({ k: 'hello', wt: 1 });
    await lab.receive({ type: 1, data: work, desc: '', dataLen: 9, descLen: 0, rxAt: 42 });
    await lab.receive({ type: 1, data: '', desc: work, dataLen: 0, descLen: 9 });
    const req = '{"t":"marc-a2","v":1,"k":"req","id":"k3x9qa-1"}';
    await lab.receive({ type: 1, data: req, desc: '', dataLen: req.length, descLen: 0 });
    expect(seen).toEqual([[work, 42], [work, 0]]);
    expect(lab.counts.value).toMatchObject({ rx: 1, ack: 1, bad: 0 });
    expect(sent).toHaveLength(1);
    expect(await lab.post('x')).toBe(207);
    lab.note('row');
    expect(lab.rows.value[0]).toBe('row');
    // Without a route the lab reads a workout message as before: not one of its own.
    const plain = createLab(plugin, () => 0);
    await plain.receive({ type: 1, data: work, desc: '', dataLen: 9, descLen: 0 });
    expect(plain.counts.value.bad).toBe(1);
  });
  it('the lab panel names: Connect starts the link, a Hold results switch and the mw counters', () => {
    const lab = readFileSync('src/slices/settings/WatchLab.tsx', 'utf8');
    expect(lab).toContain('<Button onClick={() => void watchLink().start()}>Connect</Button>');
    expect(lab).toContain('<WatchLinkPanel />');
    const src = readFileSync('src/native/watchLink.ts', 'utf8');
    expect([...src.matchAll(/label: '([^']*)'/g)].map(m => m[1])).toEqual(['Hold results']);
    expect(src).toContain("h('span', { class: 'small' }, 'Hold results')");
    expect(src).toContain('`mw hello ${c.hello} cmd ${c.cmd} res ${c.res} snap ${c.snap} held ${c.held} hidden ${c.hidden} bad ${c.bad}`');
  });
});

describe('WATCH-C C3 the native ack never answers a workout message', () => {
  it("WearEnginePlugin.java's Wire.requestId accepts only marc-a2, and nothing in the link calls setNativeAck", () => {
    const java = readFileSync('native/wear/android/WearEnginePlugin.java', 'utf8');
    expect(java).toContain('static final String TAG = "marc-a2";');
    const body = java.slice(java.indexOf('static String requestId(String text) {'), java.indexOf('static boolean remember('));
    expect(body).toContain('if (!TAG.equals(o.opt("t")) || !isNumber(o.opt("v"), 1) || !("req".equals(k) || "hr".equals(k))) return null;');
    expect(java.match(/Wire\.requestId\(/g)).toHaveLength(1);
    expect(java).toContain('String id = Wire.requestId(text);\n        // An invalid message gets no answer; JS logs why it is bad.\n        if (id == null || p2p == null || device == null) return;');
    const link = readFileSync('src/native/watchLink.ts', 'utf8');
    expect(link).not.toMatch(/setNativeAck|nativeAck/);
    const lab = readFileSync('src/slices/settings/WatchLab.tsx', 'utf8');
    expect(lab.match(/setNativeAck/g)).toHaveLength(1);
  });
});

