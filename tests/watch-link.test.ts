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

import { freshState, freshUnits, newId, type AppState, type CommandResult, type LoadUnit, type LoggedSet, type Split } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import { findExercise } from '@/core/exercises';
import { enteredLoad, kgToDisplay } from '@/core/units';
import { setTheme } from '@/theme/engine';
import { entryTarget, openEntryId } from '@/slices/workout/Train';
import { addSet, commitSet, discardSession, finishSession, logWarmups, markDone, moveEntry, setSet, skipEntry, startRest, startSession, substituteEntry, pauseSession } from '@/slices/workout/session';
import { mergeAskAnswer, profileFor, saveProfile, setExerciseUnit } from '@/slices/workout/units';
import { handleWorkoutCommand } from '@/slices/workout/commands';
import { createLab, watchLab, type WearEnginePlugin } from '@/native/wearEngine';
import { MAX_PLAN_BYTES, MAX_SNAP_BYTES, SNAP_GAP_MS, buildPlan, buildSnapshot, createLink, watchLink, type LinkDeps, type Plan, type Snap } from '@/native/watchLink';
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
    // WATCH-C D1: the exercise of the set logged last comes before display order, also after a reorder
    // (display order without a commit is in the D1 block).
    moveEntry(1, 0); // Cable Fly, Barbell Bench Press, Plank
    expect(ids(snap())).toEqual(['Barbell Bench Press', 2, 2, bench!.sets[1]!.id]);
    // Skipped, it gives way to the first in display order.
    skipEntry(1);
    expect(ids(snap())).toEqual(['Cable Fly', 1, 1, fly!.sets[0]!.id]);
    skipEntry(1, false);
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
    expect(snap().set).toEqual({ id: e0.sets[0]!.id, rev: 0, w: kgToDisplay(plan[0]!.kg!, eu), u: eu, r: plan[0]!.reps, e: null, src: 't', st: 2.5 });
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

describe('WATCH-C red team fixes', () => {
  it('a phone edit while the snap after a result is still sending goes out once that send ends', async () => {
    const sent: string[] = [];
    const link = createLink({ send: t => { sent.push(t); return new Promise(ok => { setTimeout(() => ok(207), 400); }); }, log: () => undefined, connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined } });
    startSession(split);
    void link.start();
    await vi.advanceTimersByTimeAsync(1000);
    const n = sent.length;
    const done = link.receive(JSON.stringify(cmd()));
    await vi.advanceTimersByTimeAsync(450); // res sent, the snap after it in flight
    setSet(0, 1, { kg: 99, entered: { value: 99, unit: 'kg' }, reps: 3 });
    await vi.advanceTimersByTimeAsync(5000);
    await done;
    const snaps = sent.slice(n).map(t => JSON.parse(t) as Snap & { k: string }).filter(m => m.k === 'snap');
    expect(snaps.at(-1)!.set).toMatchObject({ w: 99, r: 3 });
    expect(snaps).toHaveLength(2);
    expect(buildSnapshot(state.value, Date.now(), null).set).toMatchObject({ w: 99, r: 3, rev: snaps.at(-1)!.set!.rev });
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


describe('WATCH-B follow-up: skipping or finishing an exercise on the phone stops a queued watch Complete', () => {
  for (const [name, act] of [['skipEntry', () => skipEntry(0)], ['markDone', () => markDone(0)]] as const) {
    it(`${name} raises the revision of the entry's open sets, so the command gets stale_revision`, () => {
      startSession(split);
      setSet(0, 0, { kg: 60, entered: { value: 60, unit: 'kg' }, reps: 8 });
      commitSet(0, 0);
      const before = a().entries.map(e => e.sets.map(s => s.rev));
      const c = cmd({ setId: a().entries[0]!.sets[1]!.id, expectedRev: a().entries[0]!.sets[1]!.rev });
      act();
      expect(a().entries.map(e => e.sets.map(s => s.rev))).toEqual([[before[0]![0], before[0]![1]! + 1], ...before.slice(1)]);
      expect(handleWorkoutCommand(c, Date.now())).toMatchObject({ status: 'rejected', reason: 'stale_revision' });
      expect(a().entries[0]!.sets[1]!.status).not.toBe('committed');
      expect(committed()).toHaveLength(1);
    });
  }
});

describe('WATCH-C D1: the snapshot follows the exercise in use on the phone', () => {
  const four: Split = { ...split, id: 'sp4', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }, { exerciseId: 'lib_cable_fly', sets: 2 }, { exerciseId: 'lib_dumbbell_bench_press', sets: 1 }] };
  const log = (i: number, j: number) => { setSet(i, j, { kg: 20, entered: { value: 20, unit: 'kg' }, reps: 10 }); expect(commitSet(i, j)).toBe(true); };
  beforeEach(() => { openEntryId.value = null; replaceState({ ...state.value, splits: [four] }); startSession(four); });
  afterEach(() => { openEntryId.value = null; });
  it('the card open on the phone, when it has a set to log', () => {
    openEntryId.value = a().entries[1]!.id!;
    expect(ids(snap())).toEqual(['Cable Fly', 1, 2, a().entries[1]!.sets[0]!.id]);
    log(0, 0);
    expect(snap().ex).toBe('Cable Fly');
  });
  it('else the exercise of the last set logged, when it has a set to log', () => {
    log(1, 0);
    expect(ids(snap())).toEqual(['Cable Fly', 2, 2, a().entries[1]!.sets[1]!.id]);
    vi.advanceTimersByTime(60_000);
    log(0, 0);
    expect(ids(snap())).toEqual(['Barbell Bench Press', 2, 2, a().entries[0]!.sets[1]!.id]);
    // An open card with nothing left gives way to it.
    vi.advanceTimersByTime(1000);
    log(2, 0);
    openEntryId.value = a().entries[2]!.id!;
    expect(snap().ex).toBe('Barbell Bench Press');
  });
  it('else the first exercise in display order with a set to log; done or skipped ones are passed over', () => {
    moveEntry(2, 0); // Dumbbell Bench Press, Barbell Bench Press, Cable Fly
    expect(snap().ex).toBe('Dumbbell Bench Press');
    log(2, 0);
    log(2, 1);
    expect(snap().ex).toBe('Dumbbell Bench Press'); // the last set's exercise has nothing left
    openEntryId.value = a().entries[0]!.id!;
    skipEntry(0);
    expect(snap().ex).toBe('Barbell Bench Press');
    skipEntry(0, false);
    expect(snap().ex).toBe('Dumbbell Bench Press');
    markDone(0);
    expect(snap().ex).toBe('Barbell Bench Press');
    openEntryId.value = 'e_gone';
    expect(snap().ex).toBe('Barbell Bench Press');
  });
  it('Train keeps openEntryId in step with its open card, in memory only, and the link follows it', async () => {
    const train = readFileSync('src/slices/workout/Train.tsx', 'utf8');
    expect(train).toContain('export const openEntryId = signal<string | null>(null);');
    expect(train).toContain('useEffect(() => { openEntryId.value = a.entries[open]?.id ?? null; return () => { openEntryId.value = null; }; }, [open, a.entries[open]?.id]);');
    expect(train.match(/openEntryId/g)).toHaveLength(3);
    const sent: string[] = [];
    const link = createLink({ send: async t => { sent.push(t); return 207; }, log: () => undefined, connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined } });
    await link.start();
    await vi.advanceTimersByTimeAsync(1000);
    expect(sent).toHaveLength(1);
    openEntryId.value = a().entries[1]!.id!;
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS);
    expect(sent).toHaveLength(2);
    expect((JSON.parse(sent[1]!) as Snap).ex).toBe('Cable Fly');
  });
});

describe('WATCH-C 1.1.2 device run: the clock sample leaves out the phone JS delay', () => {
  it("a hello seen by JS late is answered with pt at the midpoint of its native receipt and the send", async () => {
    const r = rig();
    startSession(split);
    startRest(90);
    vi.advanceTimersByTime(14_000);
    const t = Date.now();
    await r.link.receive(hello(T0 + 5), t - 14_000);
    expect(r.last()).toMatchObject({ k: 'snap', pt: t - 7_000, wt: T0 + 5 });
    expect(r.rows).toContain('mw hello abcd1234 q0 js +14000ms');
    // the rest countdown is still taken at the send
    expect(r.last().rest).toEqual(JSON.parse(JSON.stringify(buildSnapshot(state.value, t, T0 + 5))).rest);
    expect(r.last().rest).toMatchObject({ left: 76_000 });
  });
  it('without a usable receipt time, and in snaps that answer no hello, pt is the send time', async () => {
    const r = rig();
    startSession(split);
    vi.advanceTimersByTime(5_000);
    const t = Date.now();
    for (const rxAt of [t + 50, Number.NaN, t]) await r.link.receive(hello(T0 + 5), rxAt);
    await r.link.refresh();
    expect(r.sent.map(x => (JSON.parse(x) as Snap).pt)).toEqual([t, t, t, t]);
  });
  it("the lab row of a first answer shows the watch's lead over the native receipt; a replay shows none", async () => {
    const r = rig();
    startSession(split);
    const c = cmd();
    await r.link.receive(JSON.stringify(c), (c.actionAt as number) - 7_100);
    await r.link.receive(JSON.stringify(c), (c.actionAt as number) + 400);
    const rows = r.rows.filter(x => x.startsWith('mw cmd'));
    expect(rows[0]).toMatch(/ set_\S+ lead \+7\.1s applied rev \d+ at \d\d:\d\d:\d\d future_time$/);
    expect(rows[1]).toMatch(/ set_\S+ replayed at \d\d:\d\d:\d\d future_time$/);
  });
  it('a lead behind the receipt shows its minus sign', async () => {
    const r = rig();
    startSession(split);
    const c = cmd();
    await r.link.receive(JSON.stringify(c), (c.actionAt as number) + 400);
    expect(r.rows.find(x => x.startsWith('mw cmd'))).toMatch(/ set_\S+ lead -0\.4s applied rev \d+ at \d\d:\d\d:\d\d$/);
  });
});

describe('WATCH-C2 P1: the snap names its entry and last time, and the plan feeds Up next', () => {
  const six: Split = {
    ...split, id: 'sp6', exercises: [
      { exerciseId: 'lib_barbell_bench_press', sets: 2 }, { exerciseId: 'lib_cable_fly', sets: 2 }, { exerciseId: 'lib_plank', sets: 1 },
      { exerciseId: 'lib_dumbbell_bench_press', sets: 1 }, { exerciseId: 'lib_push_up', sets: 1 }, { exerciseId: 'lib_farmer_s_carry', sets: 1 },
    ],
  };
  // Last time: the bench on 14 October, the fly on the 15th (its load is the argument).
  const before = (fly: number) => [
    sessionAt('2026-10-14T10:00:00.000Z', '2026-10-14T11:00:00.000Z', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 57.5, reps: 9 }, { kg: 55, reps: 7 }] }]),
    sessionAt('2026-10-15T10:00:00.000Z', '2026-10-15T11:00:00.000Z', [{ id: 'lib_cable_fly', sets: [{ kg: fly, reps: 12 }] }]),
  ];
  const plan = () => buildPlan(state.value);
  const order = (p: Plan) => p.rows.map(x => x.id);
  const e = (i: number) => a().entries[i]!;
  const log = (i: number, j: number) => { setSet(i, j, { kg: 20, entered: { value: 20, unit: 'kg' }, reps: 10 }); expect(commitSet(i, j)).toBe(true); };
  const bytes = (t: string) => new TextEncoder().encode(t).length;
  const sentPlan = () => JSON.parse(JSON.stringify(plan())) as Plan;
  beforeEach(() => { openEntryId.value = null; replaceState({ ...state.value, splits: [six], sessions: before(20) }); startSession(six); });
  afterEach(() => { openEntryId.value = null; });

  it('snap: eid is the shown entry; lt is last time at the same working position, in the unit the set shows', () => {
    const eu = profileFor('lib_barbell_bench_press', a().gymId).unit;
    expect(eu).toBe('kg');
    expect(snap()).toMatchObject({ eid: e(0).id, si: 1, lt: { w: 57.5, u: 'kg', r: 9 } });
    // A warm-up has no last time; the working set after it gets last time's first set.
    logWarmups(0, [{ kg: 20, entered: { value: 20, unit: 'kg' }, reps: 10 }]);
    expect(snap()).toMatchObject({ si: 1, lt: null });
    expect(snap().set).not.toBeNull();
    expect(commitSet(0, 0)).toBe(true);
    expect(snap()).toMatchObject({ si: 2, lt: { w: 57.5, u: 'kg', r: 9 } });
    // Entered in lb: last time in lb too, as the set's own values.
    setSet(0, 1, { kg: 61.235, entered: { value: 135, unit: 'lb' }, reps: 5 });
    expect(snap().set).toMatchObject({ w: 135, u: 'lb' });
    expect(snap().lt).toEqual({ w: kgToDisplay(57.5, 'lb'), u: 'lb', r: 9 });
    expect(snap().lt!.w).toBe(126.8);
    expect(commitSet(0, 1)).toBe(true);
    expect(snap()).toMatchObject({ eid: e(0).id, si: 3, lt: { w: 55, u: 'kg', r: 7 } });
    // No history: no last time. Timed: no set and no last time.
    openEntryId.value = e(3).id!;
    expect(snap()).toMatchObject({ eid: e(3).id, ex: 'Dumbbell Bench Press', lt: null });
    expect(snap().set).not.toBeNull();
    openEntryId.value = e(2).id!;
    expect(snap()).toMatchObject({ eid: e(2).id, ex: 'Plank', set: null, lt: null });
    // Nothing left: no entry. Without a session the snap stays as C1 pins it, with neither field.
    for (let i = 0; i < 6; i++) markDone(i);
    expect(snap()).toMatchObject({ sid: a().id, eid: null, ex: null, set: null, lt: null });
    const none = buildSnapshot(freshState(), Date.now(), null);
    expect('eid' in none || 'lt' in none).toBe(false);
  });

  it('plan rows: the shown one first, then display order, wrapping round, at most 4; done and skipped left out; counts', () => {
    expect(plan()).toMatchObject({ t: 'mw', v: 1, k: 'plan', sid: a().id, srev: a().rev, sd: 0, st: 8 });
    expect(order(plan())).toEqual([0, 1, 2, 3].map(i => e(i).id));
    // The card open on the phone first, then round the end.
    openEntryId.value = e(3).id!;
    expect(order(plan())).toEqual([3, 4, 5, 0].map(i => e(i).id));
    // Done and skipped exercises are left out, and their unlogged sets leave st.
    markDone(4);
    skipEntry(5);
    expect(order(plan())).toEqual([3, 0, 1, 2].map(i => e(i).id));
    expect(plan()).toMatchObject({ sd: 0, st: 6 });
    // A committed set counts in d and sd; a skipped one leaves n and st.
    log(0, 0);
    setSet(1, 1, { status: 'skipped' });
    expect(snap().eid).toBe(e(3).id);
    expect(plan()).toMatchObject({ srev: a().rev, sd: 1, st: 5 });
    expect(plan().rows.map(x => [x.id, x.ex, x.d, x.n])).toEqual([[e(3).id, 'Dumbbell Bench Press', 0, 1], [e(0).id, 'Barbell Bench Press', 1, 2], [e(1).id, 'Cable Fly', 0, 1], [e(2).id, 'Plank', 0, 1]]);
    // Each row's set and last time as the snap shows them for that exercise; a set only for a plain load.
    const rows = plan().rows;
    expect(rows[0]).toMatchObject({ set: { id: e(3).sets[0]!.id }, lt: null });
    expect(rows[1]).toMatchObject({ set: { id: e(0).sets[1]!.id, src: 't' }, lt: { w: 55, u: 'kg', r: 7 } });
    expect(rows[2]).toMatchObject({ set: { id: e(1).sets[0]!.id }, lt: { w: kgToDisplay(20, profileFor('lib_cable_fly', a().gymId).unit), r: 12 } });
    expect(rows[3]).toMatchObject({ set: null, lt: null });
    for (const [k, i] of [[0, 3], [1, 0], [2, 1], [3, 2]] as const) {
      openEntryId.value = e(i).id!;
      expect({ set: rows[k]!.set, lt: rows[k]!.lt }).toEqual({ set: snap().set, lt: snap().lt });
    }
    // Bodyweight has no set either.
    openEntryId.value = e(3).id!;
    markDone(4, false);
    expect(plan().rows[1]).toMatchObject({ id: e(4).id, set: null, lt: null });
    // Nothing left: no rows. No session: no session id and no rows.
    for (let i = 0; i < 6; i++) markDone(i);
    expect(plan()).toMatchObject({ sid: a().id, sd: 1, st: 1, rows: [] });
    expect(buildPlan(freshState())).toEqual({ t: 'mw', v: 1, k: 'plan', sid: null, srev: 0, sd: 0, st: 0, rows: [] });
  });

  it('at most 1000 B and ASCII with long names and ids: rows go from the end until it fits', () => {
    const long = 'Développé couché incliné × haltères très long';
    const big = (p: string, i: number) => `${p}_${i}${'q'.repeat(60)}`;
    startRest(600);
    replaceState({ ...state.value, active: { ...a(), id: `s_${'x'.repeat(60)}`, rev: Number.MAX_SAFE_INTEGER, entries: a().entries.map((x, i) => ({ ...x, id: big('e', i), exerciseId: 'lib_barbell_bench_press', name: long, sets: x.sets.map((y, j) => ({ ...y, id: big(`set${j}`, i), rev: Number.MAX_SAFE_INTEGER, kg: 453.59237, entered: { value: 999.75, unit: 'lb' as const }, reps: 100, effort: 'ideal' as const })) })) } });
    // The snap with both new fields still fits.
    const s = snap(8.64e15);
    expect(s).toMatchObject({ eid: big('e', 0), lt: { w: 126.8, u: 'lb', r: 9 } });
    expect(bytes(JSON.stringify(s))).toBeLessThanOrEqual(MAX_SNAP_BYTES);
    const p = plan();
    const text = JSON.stringify(p);
    expect(text).toMatch(/^[\x20-\x7e]+$/);
    expect(bytes(text)).toBeLessThanOrEqual(MAX_PLAN_BYTES);
    expect(MAX_PLAN_BYTES).toBe(1000);
    expect(p.rows.map(x => x.ex)).toEqual(p.rows.map(() => 'Developpe couche incline'));
    // The rows are all one size: the first ones stay, in order, and one more would not fit.
    expect(p.rows.length).toBeGreaterThan(0);
    expect(p.rows.length).toBeLessThan(4);
    expect(order(p)).toEqual(p.rows.map((_, i) => big('e', i)));
    expect(bytes(text) + 1 + bytes(JSON.stringify(p.rows[0]))).toBeGreaterThan(MAX_PLAN_BYTES);
    // With the app's own ids, 4 rows of 24-character names fit.
    replaceState({ ...state.value, active: { ...a(), entries: a().entries.map(x => ({ ...x, id: newId('e'), sets: x.sets.map(y => ({ ...y, id: newId('set') })) })) } });
    expect(plan().rows).toHaveLength(4);
    expect(bytes(JSON.stringify(plan()))).toBeLessThanOrEqual(MAX_PLAN_BYTES);
  });

  it('the link sends the plan after each hello answer, and on change only, under the snap limit', async () => {
    const r = rig({ connect: async () => undefined, doc: { visibilityState: 'visible', addEventListener: () => undefined }, plan });
    await r.link.start();
    expect(r.kinds()).toEqual(['snap', 'plan']);
    expect(r.last()).toEqual(sentPlan());
    // A hello answer: the snap, then the plan, also when nothing changed.
    await vi.advanceTimersByTimeAsync(1000);
    await r.link.receive(hello(T0));
    await r.link.receive(hello(T0 + 1));
    expect(r.kinds()).toEqual(['snap', 'plan', 'snap', 'plan', 'snap', 'plan']);
    // The theme changes the snap only; the countdown changes neither.
    startRest(90);
    await vi.advanceTimersByTimeAsync(1000);
    expect(r.kinds().slice(6)).toEqual(['snap', 'plan']);
    setTheme('ember');
    await vi.advanceTimersByTimeAsync(5000);
    r.link.changed();
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS);
    expect(r.kinds().slice(8)).toEqual(['snap']);
    // Last time for the fly changes the plan only; a second change within 300 ms waits.
    replaceState({ ...state.value, sessions: before(25) });
    await vi.advanceTimersByTimeAsync(0);
    expect(r.kinds().slice(9)).toEqual(['plan']);
    expect((r.last() as unknown as Plan).rows[1]).toMatchObject({ id: e(1).id, lt: { w: kgToDisplay(25, profileFor('lib_cable_fly', a().gymId).unit), r: 12 } });
    replaceState({ ...state.value, sessions: before(30) });
    await vi.advanceTimersByTimeAsync(SNAP_GAP_MS - 1);
    expect(r.sent).toHaveLength(10);
    await vi.advanceTimersByTimeAsync(1);
    expect(r.kinds().slice(10)).toEqual(['plan']);
    expect(r.last()).toEqual(sentPlan());
    // After a result: res, the snap, then at once the plan with the set counted, and nothing twice.
    await r.link.receive(JSON.stringify(cmd()));
    expect(r.kinds().slice(11)).toEqual(['res', 'snap', 'plan']);
    await vi.advanceTimersByTimeAsync(1000);
    expect(r.sent).toHaveLength(14);
    expect(r.last()).toMatchObject({ k: 'plan', sd: 1 });
    expect(r.last()).toEqual(sentPlan());
  });

  it('never while hidden, held or stopped; a hello owed from then gets its plan', async () => {
    const listeners: Array<() => void> = [];
    const doc = { visibilityState: 'visible', addEventListener: (_: string, fn: () => void) => { listeners.push(fn); } };
    const r = rig({ connect: async () => undefined, doc, hidden: () => doc.visibilityState === 'hidden', plan });
    await r.link.start();
    expect(r.kinds()).toEqual(['snap', 'plan']);
    const show = async (hide: () => Promise<void>) => {
      doc.visibilityState = 'hidden';
      await hide();
      await vi.advanceTimersByTimeAsync(1000);
      await r.link.refresh();
      expect(r.sent).toHaveLength(n);
      doc.visibilityState = 'visible';
      for (const fn of listeners) fn();
      await vi.advanceTimersByTimeAsync(0);
      return r.kinds().slice(n);
    };
    let n = 2;
    // Hidden: nothing. Shown again: the snap, and the plan when a hello is owed or it changed.
    expect(await show(async () => { await r.link.receive(hello(T0)); })).toEqual(['snap', 'plan']);
    n = 4;
    expect(await show(async () => { markDone(2); })).toEqual(['snap', 'plan']);
    expect(r.last()).toEqual(sentPlan());
    n = 6;
    expect(await show(async () => undefined)).toEqual(['snap']);
    // Held: nothing; off again, the replay's res, the snap and the plan.
    r.link.hold.value = true;
    const c = JSON.stringify(cmd());
    await r.link.receive(c);
    await r.link.receive(hello(T0 + 1));
    markDone(3);
    await vi.advanceTimersByTimeAsync(1000);
    expect(r.sent).toHaveLength(7);
    r.link.hold.value = false;
    await r.link.receive(c);
    expect(r.kinds().slice(7)).toEqual(['res', 'snap', 'plan']);
    expect(r.last()).toMatchObject({ sd: 1 });
    expect(r.last()).toEqual(sentPlan());
    // Stopped by another version: nothing until the next start.
    await vi.advanceTimersByTimeAsync(1000);
    await r.link.receive(JSON.stringify({ t: 'mw', v: 2, k: 'hello', wt: 1 }));
    await r.link.receive(hello(T0 + 2));
    markDone(4);
    await vi.advanceTimersByTimeAsync(1000);
    await r.link.refresh();
    expect(r.sent).toHaveLength(10);
    await r.link.start();
    expect(r.kinds().slice(10)).toEqual(['snap', 'plan']);
  });

  it("the app's link sends the plan after the hello answer, and logs a failed send", async () => {
    const lab = watchLab();
    watchLink();
    const text = hello(T0);
    await lab.receive({ type: 1, data: text, desc: '', dataLen: text.length, descLen: 0, rxAt: T0 });
    // Off the phone the plugin is missing, so each send fails and is logged, newest first.
    expect(lab.rows.value.slice(0, 3)).toEqual(['mw plan unavailable', 'mw snap unavailable', 'mw hello abcd1234 q0 js +0ms']);
  });

  // WATCH-C2 review: a plan that did not reach the watch goes again; a plan without a session does not go.
  it('a plan whose send failed goes again with the next sync, though it did not change', async () => {
    let fail = true;
    const r = rig({ connect: async () => undefined, plan, send: vi.fn(async (t: string) => { const k = (JSON.parse(t) as { k: string }).k; if (k === 'plan' && fail) { fail = false; return 206; } r.sent.push(t); return 207; }) });
    await r.link.start();
    expect(r.kinds()).toEqual(['snap']);
    // A rejected command changes nothing, so only the failed send makes the plan go again.
    await r.link.receive(JSON.stringify(cmd({ expectedRev: 99 })));
    expect((JSON.parse(r.sent[1]!) as { status: string }).status).toBe('rejected');
    expect(r.kinds()).toEqual(['snap', 'res', 'snap', 'plan']);
    expect(r.last()).toEqual(sentPlan());
    expect(r.rows).toContain('mw plan 206');
  });
  it('no session: the hello answer is the snap alone', async () => {
    discardSession();
    const r = rig({ plan });
    await r.link.receive(hello(T0));
    expect(r.kinds()).toEqual(['snap']);
    expect(buildPlan(state.value).sid).toBeNull();
  });
});

// WATCH-C3 P3 (docs/watch-cards/WATCH-C3.md): the load step st on each set the watch shows, the next open sets nx and
// the rest length rs in the snap, and plan rows with st within 1000 B. The 0.01 rounding of a watch load is in
// tests/workout/watch-commands.test.ts.
describe('WATCH-C3 P3: the snap carries the load step, the next open sets and the rest length', () => {
  const bytes = (t: string) => new TextEncoder().encode(t).length;
  const e = (i: number) => a().entries[i]!;
  const show = (i: number) => { openEntryId.value = e(i).id!; };
  const load = (i: number, j: number, value: number, unit: LoadUnit = 'kg', reps = 8) => setSet(i, j, { ...enteredLoad(value, unit), reps });
  const prefs = (p: Partial<AppState['preferences']>) => replaceState({ ...state.value, preferences: { ...state.value.preferences, ...p } });
  const begin = (sp: Split) => { replaceState({ ...state.value, splits: [sp] }); startSession(sp); };
  afterEach(() => { openEntryId.value = null; });

  it('st: the gap in u from the loadable value at or below w to the next one; none in another unit or without a load', () => {
    begin({ ...split, id: 'sp_gear', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 1 }, { exerciseId: 'lib_machine_chest_press', sets: 1 }, { exerciseId: 'lib_dumbbell_bench_press', sets: 1 }] });
    const st = () => snap().set!.st;
    // No load: no step.
    fx.target = { sets: [{ kg: null, reps: 10, durationSec: null, note: '' }] };
    expect(snap().set).toMatchObject({ w: null, r: 10 });
    expect('st' in snap().set!).toBe(false);
    // kg barbell: a 20 kg bar and 1.25 kg plates a side.
    expect(profileFor('lib_barbell_bench_press', a().gymId)).toMatchObject({ unit: 'kg', barKg: 20 });
    load(0, 0, 60);
    expect(st()).toBe(2.5);
    // lb on a kg profile: no step.
    load(0, 0, 135, 'lb');
    expect(snap().set).toMatchObject({ w: 135, u: 'lb' });
    expect('st' in snap().set!).toBe(false);
    // lb barbell: a 45 lb bar and 2.5 lb plates a side.
    setExerciseUnit('lib_barbell_bench_press', 'lb');
    expect(st()).toBe(5);
    // Machine: a 5 kg stack; then a learned step (the ask chip: 43.5 after 40).
    show(1);
    load(1, 0, 40);
    expect(st()).toBe(5);
    saveProfile('exercise', 'lib_machine_chest_press', mergeAskAnswer(profileFor('lib_machine_chest_press', a().gymId), 40, 43.5));
    load(1, 0, 42);
    expect(st()).toBe(3.5);
    // kg dumbbells: by 2 to 10, then by 2.5 (at 10 the gap above it); below the lightest the first gap, above the heaviest the last.
    show(2);
    for (const [w, step] of [[8, 2], [10, 2.5], [20, 2.5], [1, 2], [70, 2.5]] as const) { load(2, 0, w); expect([w, st()]).toEqual([w, step]); }
    // The plan row's set carries the same step.
    expect(buildPlan(state.value).rows[0]!.set).toEqual(snap().set);
    expect(buildPlan(state.value).rows[0]!.set!.st).toBe(2.5);
  });

  it('nx: up to 3 open sets after set in the shown entry, each [id, rev, w, r] in set.u by the snap set rules', () => {
    begin({ ...split, id: 'sp_nx', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 6 }, { exerciseId: 'lib_plank', sets: 1 }] });
    // Today's target for the sets without a draft.
    fx.target = { sets: [{ kg: 50, reps: 12, durationSec: null, note: '' }] };
    const x = (j: number) => e(0).sets[j]!;
    const row = (j: number, w: number | null, r: number | null) => [x(j).id, x(j).rev ?? 0, w, r, j + 1];
    for (const j of [1, 2, 3, 5]) load(0, j, 60 + 2.5 * j, 'kg', 10 - j);
    expect(snap().set).toMatchObject({ id: x(0).id, w: 50, u: 'kg', r: 12, src: 't' });
    expect(snap().nx).toEqual([row(1, 62.5, 9), row(2, 65, 8), row(3, 67.5, 7)]);
    // Committed and skipped sets are passed over; a set without a draft shows the target.
    setSet(0, 2, { status: 'skipped' });
    expect(commitSet(0, 3)).toBe(true);
    expect(snap().set!.id).toBe(x(0).id);
    expect(snap().nx).toEqual([row(1, 62.5, 9), row(4, 50, 12), row(5, 72.5, 5)]);
    // In the unit of the set shown: kg drafts and targets converted, an lb draft as typed.
    load(0, 0, 135, 'lb');
    expect(snap().nx).toEqual([row(1, kgToDisplay(62.5, 'lb'), 9), row(4, kgToDisplay(50, 'lb'), 12), row(5, kgToDisplay(72.5, 'lb'), 5)]);
    load(0, 1, 140, 'lb', 9);
    expect(snap().nx![0]).toEqual(row(1, 140, 9));
    // The last open set has none after it.
    load(0, 4, 70);
    for (const j of [0, 1, 4]) { vi.advanceTimersByTime(120_000); expect(commitSet(0, j)).toBe(true); }
    expect(snap().set!.id).toBe(x(5).id);
    expect(snap().nx).toEqual([]);
    // A timed set has no set to show, so no next sets; nothing left: none; no session: no nx.
    vi.advanceTimersByTime(120_000);
    expect(commitSet(0, 5)).toBe(true);
    expect(snap()).toMatchObject({ ex: 'Plank', set: null, nx: [] });
    markDone(1);
    expect(snap()).toMatchObject({ eid: null, set: null, nx: [] });
    expect('nx' in buildSnapshot(freshState(), Date.now(), null)).toBe(false);
  });

  it('nx goes from the end until the snap fits 700 B; with the app ids all 3 fit, with st', () => {
    begin({ ...split, id: 'sp_nx', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 6 }] });
    prefs({ restDefaultSec: 600 });
    startRest(600);
    const long = 'Développé couché incliné × haltères très long';
    const big = (j: number) => `set_${j}${'y'.repeat(59)}`;
    const fill = (eid: string, sid: string, id: (j: number) => string) => replaceState({ ...state.value, active: { ...a(), id: sid, rev: Number.MAX_SAFE_INTEGER, entries: a().entries.map((y, i) => (i ? y : { ...y, id: eid, name: long, sets: y.sets.map((z, j) => ({ ...z, id: id(j), rev: Number.MAX_SAFE_INTEGER, kg: 999.75, entered: { value: 999.75, unit: 'kg' as const }, reps: 100, effort: 'ideal' as const })) })) } });
    fill(`e_${'q'.repeat(62)}`, `s_${'x'.repeat(62)}`, big);
    const s = snap(8.64e15);
    const text = JSON.stringify(s);
    expect(s).toMatchObject({ set: { id: big(0), w: 999.75, u: 'kg', st: 2.5 }, rs: 600 });
    expect(text).toMatch(/^[\x20-\x7e]+$/);
    expect(bytes(text)).toBeLessThanOrEqual(MAX_SNAP_BYTES);
    const all = [1, 2, 3].map(j => [big(j), Number.MAX_SAFE_INTEGER, 999.75, 100, j + 1]);
    expect(s.nx!.length).toBeGreaterThan(0);
    expect(s.nx!.length).toBeLessThan(3);
    expect(s.nx).toEqual(all.slice(0, s.nx!.length));
    expect(bytes(text) + 1 + bytes(JSON.stringify(all[s.nx!.length]))).toBeGreaterThan(MAX_SNAP_BYTES);
    fill(newId('e'), newId('s'), () => newId('set'));
    const t = snap(8.64e15);
    expect(t.nx!.map(v => v[0])).toEqual([1, 2, 3].map(j => e(0).sets[j]!.id));
    expect(t.set!.st).toBe(2.5);
    expect(bytes(JSON.stringify(t))).toBeLessThanOrEqual(MAX_SNAP_BYTES);
  });

  it("rs: the rest the phone starts after a live set (its default with auto rest on, in the phone's bounds), else 0", () => {
    begin(split);
    expect(state.value.preferences).toMatchObject({ autoRest: true, restDefaultSec: 90 });
    expect(snap().rs).toBe(90);
    prefs({ restDefaultSec: 150 });
    expect(snap().rs).toBe(150);
    expect(handleWorkoutCommand(cmd())).toMatchObject({ status: 'applied' });
    expect(a().rest!.totalSec).toBe(150);
    prefs({ restDefaultSec: 5 });
    expect(snap().rs).toBe(15);
    vi.advanceTimersByTime(120_000);
    const next = e(0).sets[1]!;
    expect(handleWorkoutCommand(cmd({ setId: next.id, expectedRev: next.rev ?? 0 }))).toMatchObject({ status: 'applied' });
    expect(a().rest!.totalSec).toBe(15);
    // Auto rest off: no rest after a set, and rs 0; with nothing left to log, rs still goes.
    prefs({ autoRest: false });
    expect(snap().rs).toBe(0);
    vi.advanceTimersByTime(120_000);
    const fly = e(1).sets[0]!;
    const rest = a().rest;
    expect(handleWorkoutCommand(cmd({ setId: fly.id, expectedRev: fly.rev ?? 0 }))).toMatchObject({ status: 'applied' });
    expect(a().rest).toEqual(rest);
    prefs({ autoRest: true });
    markDone(2);
    expect(snap()).toMatchObject({ eid: null, rs: 15 });
    expect('rs' in buildSnapshot(freshState(), Date.now(), null)).toBe(false);
  });

  it('plan rows carry st, and 4 rows fit 1000 B with the app ids, the longest names and the largest revs', () => {
    const six: Split = { ...split, id: 'sp6', exercises: ['lib_barbell_bench_press', 'lib_cable_fly', 'lib_plank', 'lib_dumbbell_bench_press', 'lib_push_up', 'lib_farmer_s_carry'].map(exerciseId => ({ exerciseId, sets: 2 })) };
    replaceState({ ...state.value, sessions: [sessionAt('2026-10-14T10:00:00.000Z', '2026-10-14T11:00:00.000Z', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 187.25, reps: 100 }, { kg: 187.25, reps: 100 }] }])] });
    begin(six);
    const long = 'Développé couché incliné × haltères très long';
    replaceState({ ...state.value, active: { ...a(), id: newId('s'), rev: Number.MAX_SAFE_INTEGER, entries: a().entries.map(x => ({ ...x, id: newId('e'), exerciseId: 'lib_barbell_bench_press', name: long, sets: x.sets.map(y => ({ ...y, id: newId('set'), rev: Number.MAX_SAFE_INTEGER, kg: 999.75, entered: { value: 999.75, unit: 'kg' as const }, reps: 100, effort: 'ideal' as const })) })) } });
    const p = buildPlan(state.value);
    const text = JSON.stringify(p);
    expect(p.rows).toHaveLength(4);
    expect(p.rows.map(x => [x.set!.st, x.set!.w, x.lt])).toEqual(p.rows.map(() => [2.5, 999.75, { w: 187.25, u: 'kg', r: 100 }]));
    expect(text).toMatch(/^[\x20-\x7e]+$/);
    expect(bytes(text)).toBeLessThanOrEqual(MAX_PLAN_BYTES);
  });
});

// WATCH-C4 P5 (add-only block): after a finish, the snap without a session carries fin, the finished session's id and
// its highlight lines, for the watch's done screen.
describe('WATCH-C4 P5: fin, the highlights of the workout just finished', () => {
  const bytes = (t: string) => new TextEncoder().encode(t).length;
  const four: Split = { ...split, id: 'sp_fin', exercises: ['lib_barbell_bench_press', 'lib_cable_fly', 'lib_dumbbell_bench_press', 'lib_plank'].map(exerciseId => ({ exerciseId, sets: 1 })) };
  type Load = [kg: number, reps: number] | null;
  /** A session two days ago with one set per exercise (null: not trained). */
  const before = (bench: Load, fly: Load, db: Load = null) => sessionAt('2026-10-14T10:00:00.000Z', '2026-10-14T11:00:00.000Z',
    ([['lib_barbell_bench_press', bench], ['lib_cable_fly', fly], ['lib_dumbbell_bench_press', db]] as const).filter(([, l]) => l).map(([id, l]) => ({ id, sets: [{ kg: l![0], reps: l![1], effort: 'ideal' as const }] })));
  /** Today: one set per weighted exercise in `unit` (2 min apart), then a 60 s plank, then Finish on the phone. */
  const train = (loads: Load[], unit: LoadUnit = 'kg') => {
    startSession(four);
    loads.forEach((l, i) => { if (!l) return; vi.advanceTimersByTime(120_000); setSet(i, 0, { ...enteredLoad(l[0], unit), reps: l[1], effort: 'ideal' }); expect(commitSet(i, 0)).toBe(true); });
    vi.advanceTimersByTime(120_000);
    setSet(3, 0, { durationSec: 60 });
    expect(commitSet(3, 0)).toBe(true);
    const id = a().id!;
    const done = finishSession(false);
    expect(done?.session.id).toBe(id);
    return id;
  };

  it('3 new bests: the first 2 in workout order, then minutes and sets (the finish screen counts the warm-up), then kg lifted; at most 4 lines', () => {
    replaceState({ ...state.value, sessions: [before([60, 8], [20, 10], [24, 8])] });
    startSession(four);
    logWarmups(0, [{ kg: 20, reps: 10 }]);
    const id = a().id!;
    [[62.5, 8], [22.5, 10], [26, 8]].forEach(([kg, reps], i) => { vi.advanceTimersByTime(120_000); setSet(i, i ? 0 : 1, { ...enteredLoad(kg!, 'kg'), reps, effort: 'ideal' }); expect(commitSet(i, i ? 0 : 1)).toBe(true); });
    vi.advanceTimersByTime(120_000);
    setSet(3, 0, { durationSec: 60 });
    commitSet(3, 0);
    const session = finishSession(false)!.session;
    expect([session.durationSec, session.exercises.reduce((n, e) => n + e.sets.length, 0), session.exercises.length]).toEqual([480, 5, 4]);
    // 62.5 x 8 + 22.5 x 10 + 26 x 8 = 933 kg; the 20 kg warm-up and the plank lift nothing.
    expect(snap().fin).toEqual([id, ['Best: Barbel 62.5 kg x 8', 'Best: Cable 22.5 kg x 10', '8 min, 5 sets', '933 kg lifted']]);
    // Nothing else changes in the snap without a session.
    const { fin: _fin, ...rest } = snap(77);
    expect(rest).toEqual({ t: 'mw', v: 1, k: 'snap', pt: Date.now(), wt: 77, srev: 0, sid: null, ex: null, si: 0, sn: 0, set: null, rest: null, th: ['#08090a', '#f7f8f8', '#5e6ad2'] });
  });

  it('1 new best; an exercise with no earlier session, or one only matched, is none', () => {
    replaceState({ ...state.value, sessions: [before([60, 8], [20, 10])] });
    const id = train([[60, 9], [20, 10], [26, 8]]);
    expect(snap().fin).toEqual([id, ['Best: Barbell 60 kg x 9', '8 min, 4 sets', '948 kg lifted', '4 exercises']]);
  });

  it('0 new bests: lighter, first time, and an earlier session with no estimate (over 10 reps) is nothing to beat', () => {
    replaceState({ ...state.value, sessions: [before([60, 8], [20, 12])] });
    const id = train([[57.5, 8], [20, 10], [24, 8]]);
    expect(snap().fin).toEqual([id, ['8 min, 4 sets', '852 kg lifted', '4 exercises']]);
  });

  it('a set of 1, an exercise of 1, nothing lifted: the singular words and no lifted line', () => {
    startSession(four);
    const id = a().id!;
    setSet(3, 0, { durationSec: 60 });
    commitSet(3, 0);
    vi.advanceTimersByTime(30_000);
    finishSession(false);
    expect(snap().fin).toEqual([id, ['1 min, 1 set', '1 exercise']]);
  });

  it('the lb profile: the best and the load lifted in lb, whatever unit the app shows; mixed profiles fall back to it', () => {
    replaceState({ ...state.value, units: freshUnits('lb'), preferences: { ...state.value.preferences, weightUnit: 'kg' }, sessions: [before([enteredLoad(135, 'lb').kg, 8], [enteredLoad(40, 'lb').kg, 10])] });
    const id = train([[140, 8], [40, 10]], 'lb');
    expect(profileFor('lib_barbell_bench_press').unit).toBe('lb');
    // 140 x 8 + 40 x 10 = 1520 lb
    expect(snap().fin).toEqual([id, ['Best: Barbell 140 lb x 8', '6 min, 3 sets', '1520 lb lifted', '3 exercises']]);
    // A set saved without its typed unit shows in the profile unit.
    replaceState({ ...state.value, sessions: state.value.sessions.map(x => (x.id !== id ? x : { ...x, exercises: x.exercises.map(e => ({ ...e, sets: e.sets.map(({ entered: _e, ...set }) => set) })) })) });
    expect(snap().fin![1][0]).toBe('Best: Barbell 140 lb x 8');
    // Profiles in kg and lb: the load lifted in the unit the app shows (kg).
    setExerciseUnit('lib_cable_fly', 'kg');
    expect(snap().fin![1][2]).toBe(`${Math.round(kgToDisplay(enteredLoad(140, 'lb').kg * 8 + enteredLoad(40, 'lb').kg * 10, 'kg'))} kg lifted`);
  });

  it('only after a finish: not after a discard or an empty finish, not with a session, not after 15 minutes', () => {
    replaceState({ ...state.value, sessions: [before([60, 8], [20, 10])] });
    const id = train([[60, 8]]);
    expect(snap().fin![0]).toBe(id);
    // An active session without an id (the store gives one on load) is still a session.
    // The log decides: a session in history whose newest closed entry reads discarded sends none.
    const closed = state.value.commands.closed;
    expect('fin' in buildSnapshot({ ...state.value, commands: { ...state.value.commands, closed: [...closed.slice(0, -1), { ...closed[closed.length - 1]!, status: 'discarded' }] } }, Date.now(), null)).toBe(false);
    const idless = buildSnapshot({ ...state.value, active: { splitId: four.id, startedAt: new Date().toISOString(), pausedMs: 0, entries: [] } }, Date.now(), null);
    expect(idless).toMatchObject({ sid: null, set: null });
    expect('fin' in idless).toBe(false);
    // A new session: the snap is the session's, without fin.
    startSession(four);
    expect(snap().sid).toBe(a().id);
    expect('fin' in snap()).toBe(false);
    // Discarded: the newest closed session is the discard, so no fin, though the finish was a minute ago.
    discardSession();
    expect(state.value.commands.closed.map(c => c.status)).toEqual(['finished', 'discarded']);
    expect('fin' in snap()).toBe(false);
    // Finish with nothing logged ends the session like a discard.
    startSession(four);
    expect(finishSession(false)).toBeNull();
    expect('fin' in snap()).toBe(false);
    // The watch's own Finish: fin for 15 minutes, then none.
    startSession(four);
    const watched = a().id!;
    vi.advanceTimersByTime(120_000);
    expect(handleWorkoutCommand(cmd())).toMatchObject({ status: 'applied' });
    expect(handleWorkoutCommand(cmd({ kind: 'finish' }))).toMatchObject({ status: 'applied', finish: 'saved' });
    expect(snap().fin![0]).toBe(watched);
    vi.advanceTimersByTime(15 * 60_000);
    expect(snap().fin![0]).toBe(watched);
    vi.advanceTimersByTime(1);
    expect('fin' in snap()).toBe(false);
  });

  it('names fold to ASCII and shorten to fit 24 characters; with the longest names, numbers and ids the snap is at most 700 B', () => {
    const long = 'Développé couché incliné × haltères très long';
    // 487.75 kg: as long as a load gets under the 500 kg a typo starts at (the next test).
    replaceState({ ...state.value, sessions: [before([400, 10], [9, 5], [400, 10])] });
    startSession(four);
    replaceState({ ...state.value, active: { ...a(), id: `s_${'x'.repeat(62)}`, entries: a().entries.map(e => ({ ...e, name: long })) } });
    ([[487.75, 10], [10, 5], [487.75, 10]] as const).forEach(([kg, reps], i) => { vi.advanceTimersByTime(120_000); setSet(i, 0, { ...enteredLoad(kg, 'kg'), reps, effort: 'ideal' }); expect(commitSet(i, 0)).toBe(true); });
    vi.advanceTimersByTime(120_000);
    setSet(3, 0, { durationSec: 60 });
    commitSet(3, 0);
    finishSession(false);
    const s = snap(8.64e15);
    const text = JSON.stringify(s);
    // The longer the numbers, the less of the name: 3 characters beside 487.75 kg x 10, 8 beside 10 kg x 5.
    expect(s.fin).toEqual([`s_${'x'.repeat(62)}`, ['Best: Dev 487.75 kg x 10', 'Best: Developp 10 kg x 5', '8 min, 4 sets', '9805 kg lifted']]);
    expect(s.fin![1].map(l => l.length)).toEqual([24, 24, 13, 14]);
    expect(text).toMatch(/^[\x20-\x7e]+$/);
    expect(bytes(text)).toBeLessThanOrEqual(MAX_SNAP_BYTES);
  });

  it('a set held as a typo (over 500 kg, never repeated) is not a best, as no record counts it', () => {
    replaceState({ ...state.value, sessions: [before([400, 10], [20, 10])] });
    const id = train([[600, 10], [22.5, 10]]);
    expect(snap().fin).toEqual([id, ['Best: Cable 22.5 kg x 10', '6 min, 3 sets', '6225 kg lifted', '3 exercises']]);
  });

  it('more assistance, or added load on a body-weight exercise, is not a plain load, so never a best', () => {
    const pull: Split = { ...split, id: 'sp_pull', exercises: [{ exerciseId: 'lib_assisted_pull_up', sets: 1 }, { exerciseId: 'lib_pull_up', sets: 1 }] };
    replaceState({ ...state.value, splits: [pull], sessions: [sessionAt('2026-10-14T10:00:00.000Z', '2026-10-14T11:00:00.000Z', [{ id: 'lib_assisted_pull_up', sets: [{ kg: 30, reps: 8, effort: 'ideal' }] }, { id: 'lib_pull_up', sets: [{ kg: 5, reps: 8, effort: 'ideal' }] }])] });
    startSession(pull);
    const id = a().id!;
    [[40, 8], [10, 8]].forEach(([kg, reps], i) => { vi.advanceTimersByTime(120_000); setSet(i, 0, { kg, reps, effort: 'ideal' }); expect(commitSet(i, 0)).toBe(true); });
    finishSession(false);
    expect(snap().fin).toEqual([id, ['4 min, 2 sets', '80 kg lifted', '2 exercises']]);
  });
});
