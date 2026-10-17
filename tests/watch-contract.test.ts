// WATCH-C (Gate C), acceptance X1: the watch's own common/link.js against the phone's buildSnapshot,
// createLink and handleWorkoutCommand. The watch builds its command from a real snapshot, the phone
// applies it once, and a resend gets the replay.
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { pathToFileURL, fileURLToPath } from 'node:url';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/native/notifications', async orig => ({ ...(await orig<object>()), scheduleRestDone: vi.fn(async () => undefined), cancelRestDone: vi.fn(async () => undefined) }));
vi.mock('@/native/haptics', async orig => {
  const real = await orig<{ haptic: object }>();
  return { ...real, haptic: { ...real.haptic, confirm: vi.fn(async () => undefined), success: vi.fn(async () => undefined) } };
});

import { freshState, newId, type Split } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import { setTheme } from '@/theme/engine';
import { setSet, startRest, startSession } from '@/slices/workout/session';
import { handleWorkoutCommand } from '@/slices/workout/commands';
import { buildSnapshot, createLink } from '@/native/watchLink';
import { createLab, type WearEnginePlugin } from '@/native/wearEngine';

const LINK = fileURLToPath(new URL('../native/wear/app/entry/src/main/js/default/common/link.js', import.meta.url));
interface WatchView { l1: string; l2: string; st: string; eff: string; can: boolean; rest: string }
interface WatchLink { start(): void; rx(text: string): void; tick(): void; view(): WatchView; complete(): void; rest(kind: string): void; effort(): void; show(): void }
type LinkFactory = (io: Record<string, unknown>, boot: string) => WatchLink;
const loadWatch = async () => (await import(/* @vite-ignore */ pathToFileURL(LINK).href) as { Link: LinkFactory }).Link;
/**
 * 1.1.2: the watch link starts each storage call and callback through io.defer (setTimeout 0 on the
 * watch). Here they queue, and the queue runs after each call into the link.
 */
const tasks: Array<() => void> = [];
const drain = () => { while (tasks.length) tasks.shift()!(); };
function onWatch(Link: LinkFactory, io: Record<string, unknown>, boot: string): WatchLink {
  const l = Link({ connect: () => undefined, paint: () => undefined, defer: (fn: () => void) => { tasks.push(fn); }, ...io }, boot);
  const out = {} as Record<string, (...a: unknown[]) => unknown>;
  for (const [k, fn] of Object.entries(l)) out[k] = (...a: unknown[]) => { const r = (fn as (...b: unknown[]) => unknown)(...a); drain(); return r; };
  return out as unknown as WatchLink;
}

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); },
    clear: () => map.clear(), key: (i: number) => [...map.keys()][i] ?? null, get length() { return map.size; },
  } as Storage;
}
/** @system.storage on the watch: values must be under 128 bytes (WATCH-C D1; the fake before D1 took any length). */
function watchStore() {
  const map = new Map<string, string>();
  return {
    map,
    set: (o: { key: string; value: string; success(): void; fail(): void }) => { if (new TextEncoder().encode(o.value).length >= 128) return o.fail(); map.set(o.key, o.value); o.success(); },
    get: (o: { key: string; default: string; success(v: string): void }) => { o.success(map.get(o.key) ?? o.default); },
  };
}

const split: Split = { id: 'sp', name: 'Push', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 2 }] };
const T0 = Date.parse('2026-10-16T10:00:00.000Z');

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(T0);
  vi.spyOn(console, 'warn').mockImplementation(() => undefined);
  initStore(memoryStorage());
  replaceState({ ...freshState(), splits: [split] });
  setTheme('silent-black');
});
afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe('WATCH-C X1 the watch and the phone agree', () => {
  it("link.js builds a command from buildSnapshot; handleWorkoutCommand applies it, then returns the replay", async () => {
    const Link = await loadWatch();
    startSession(split);
    setSet(0, 0, { kg: 61.235, entered: { value: 135, unit: 'lb' }, reps: 6, effort: 'ideal' });
    const sent: string[] = [];
    const watch = onWatch(Link, { store: watchStore(), send: (t: string, done: (c: number) => void) => { sent.push(t); done(207); }, keep: () => undefined, now: () => Date.now() }, 'k3x9qa00');
    watch.start();
    const hello = JSON.parse(sent[0]!) as { wt: number };
    watch.rx(JSON.stringify(buildSnapshot(state.value, Date.now(), hello.wt)));
    expect(watch.view()).toMatchObject({ l1: 'Barbell Bench Press 1/2', l2: '135 lb x 6', eff: 'Ideal', can: true });
    watch.complete();
    const text = sent[sent.length - 1]!;
    const cmd = JSON.parse(text) as Record<string, unknown>;
    expect(cmd).toMatchObject({ k: 'cmd', kind: 'complete_set', sessionId: state.value.active!.id, setId: state.value.active!.entries[0]!.sets[0]!.id, expectedRev: 1, load: { value: 135, unit: 'lb' }, reps: 6, effort: 'ideal' });
    vi.advanceTimersByTime(2000);
    const first = handleWorkoutCommand(cmd, Date.now());
    expect(first).toMatchObject({ commandId: 'k3x9qa00-1', status: 'applied', replayed: false });
    const set = state.value.active!.entries[0]!.sets[0]!;
    expect(set).toMatchObject({ status: 'committed', kg: 61.235, entered: { value: 135, unit: 'lb' }, reps: 6, effort: 'ideal', at: new Date(T0).toISOString(), receivedAt: new Date(T0 + 2000).toISOString() });
    expect(handleWorkoutCommand(JSON.parse(text), Date.now() + 5000)).toEqual({ ...first, replayed: true });
  });

  it('end to end over a fake radio: Pending, then Saved, one set, a rest command, and the replay after a lost result', async () => {
    const Link = await loadWatch();
    startSession(split);
    let drop = false;
    let watch: WatchLink | null = null;
    const toPhone: string[] = [];
    const phone = createLink({
      send: async t => { if (!drop) watch!.rx(t); return 207; },
      log: () => undefined,
    });
    watch = onWatch(Link, { store: watchStore(), send: (t: string, done: (c: number) => void) => { toPhone.push(t); void phone.receive(t, Date.now()); done(207); }, keep: () => undefined, now: () => Date.now() }, 'k3x9qa01');
    watch.start();
    await vi.advanceTimersByTimeAsync(0);
    expect(watch.view()).toMatchObject({ l1: 'Barbell Bench Press 1/2', can: true, st: '' });
    // The result is lost once: the watch stays Pending, and its resend gets the replay.
    drop = true;
    watch.complete();
    await vi.advanceTimersByTimeAsync(0);
    expect(watch.view().st).toMatch(/^Pending \d\d:\d\d:\d\d$/);
    expect(state.value.active!.entries[0]!.sets.filter(s => s.status === 'committed')).toHaveLength(1);
    drop = false;
    // 1.1.2: the watch's resend clock is its 1 s tick
    for (let i = 0; i < 4; i++) { await vi.advanceTimersByTimeAsync(1000); watch.tick(); }
    await vi.advanceTimersByTimeAsync(0);
    expect(watch.view()).toMatchObject({ st: 'Saved', l1: 'Barbell Bench Press 2/2', can: true });
    expect(state.value.active!.entries[0]!.sets.filter(s => s.status === 'committed')).toHaveLength(1);
    const cmds = toPhone.filter(t => JSON.parse(t).k === 'cmd');
    expect(cmds).toHaveLength(2);
    expect(cmds[1]).toBe(cmds[0]);
    // A rest command from the watch moves the phone's rest by 30 s.
    startRest(60);
    await phone.refresh();
    await vi.advanceTimersByTimeAsync(400);
    const endsAt = state.value.active!.rest!.endsAt;
    expect(watch.view().rest).toBe('Rest 1:00');
    watch.rest('rest_add_30');
    await vi.advanceTimersByTimeAsync(0);
    expect(state.value.active!.rest!.endsAt).toBe(endsAt + 30_000);
    expect(watch.view()).toMatchObject({ st: 'Saved', rest: 'Rest 1:30' });
  });
});

describe('WATCH-C 1.1.2 the ids the phone sends keep the watch slot under 120 B', () => {
  it('newId lengths for session, set and rest ids, and the longest stored Complete with them', async () => {
    const longest = (p: string) => Math.max(...Array.from({ length: 2000 }, () => newId(p).length));
    // newId: prefix, "_", Date.now() in base 36 (8 characters from 1997 to 2059), "_", up to 6 random characters.
    expect([longest('s'), longest('set'), longest('rest')]).toEqual([17, 19, 20]);
    const Link = await loadWatch();
    const store = watchStore();
    const watch = onWatch(Link, { store, send: (_t: string, done: (c: number) => void) => { done(207); }, keep: () => undefined, now: () => Date.now() }, 'k3x9qa02');
    watch.start();
    const sid = `s_${'z'.repeat(8)}_${'z'.repeat(6)}`, setId = `set_${'z'.repeat(8)}_${'z'.repeat(6)}`;
    // the longest values a set carries: rev 99999, a load of 999.75, 100 reps, Ideal
    watch.rx(JSON.stringify({ t: 'mw', v: 1, k: 'snap', pt: Date.now(), wt: null, srev: 1, sid, ex: 'Bench', si: 1, sn: 3, set: { id: setId, rev: 99999, w: 999.75, u: 'kg', r: 100, e: 'ideal' }, rest: null, th: null }));
    watch.complete();
    expect(watch.view().st).toMatch(/^Pending /);
    const value = store.map.get('m2q0')!;
    // commandId "<boot>-1" here; a run's sequence can reach 99999 (4 more characters) and keep the margin.
    const worst = value.length + 4;
    console.log(`[WATCH-C 1.1.2] longest stored Complete ${worst} characters of 119: margin ${119 - worst}`);
    expect(worst).toBeLessThanOrEqual(119 - 10);
  });
});

describe('WATCH-C 1.1.2 device run: a hello the phone JS sees late still gives the right clock', () => {
  it('watch clock 37 s behind, JS sees the hello 20 s after Java, the cmd arrives 3 s after the tap: the set keeps the tap time', async () => {
    const Link = await loadWatch();
    startSession(split);
    let watch: WatchLink | null = null;
    const cmds: string[] = [];
    const phone = createLink({ send: async t => { watch!.rx(t); return 207; }, log: () => undefined });
    const send = (t: string, done: (c: number) => void) => {
      const rxAt = Date.now();
      if (JSON.parse(t).k === 'hello') setTimeout(() => { void phone.receive(t, rxAt); }, 20_000);
      else cmds.push(t);
      done(207);
    };
    watch = onWatch(Link, { store: watchStore(), send, keep: () => undefined, now: () => Date.now() - 37_000 }, 'k3x9qa03');
    watch.start();
    await vi.advanceTimersByTimeAsync(20_000);
    expect(watch.view()).toMatchObject({ l1: 'Barbell Bench Press 1/2', can: true });
    const tap = Date.now();
    watch.complete();
    expect(cmds).toHaveLength(1);
    await vi.advanceTimersByTimeAsync(3_000);
    await phone.receive(cmds[0]!, Date.now());
    const set = state.value.active!.entries[0]!.sets[0]!;
    expect(set.status).toBe('committed');
    expect(set.flags ?? []).not.toContain('future_time');
    expect(Math.abs(Date.parse(set.at!) - tap)).toBeLessThanOrEqual(1_000);
  });
});

describe('WATCH-C 1.1.2 review and red team: clock samples over a lab-like route, the watch ticking each second', () => {
  const split12: Split = { ...split, exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 12 }] };
  interface Run {
    /** phone clock minus watch clock, ms */
    theta: number;
    /** Java stamps rxAt on arrival; JS sees nothing before this phone time (probe 2 run F) */
    jsFrozenUntil?: number;
    /** JS hands queued events over newest first */
    reverse?: boolean;
    /** M/ARC hidden until this phone time; then the visibilitychange snap goes */
    hiddenUntil?: number;
    /** the first n hello answers fail to send (206); then a set is edited on the phone, so a change snap goes */
    failHelloAnswers?: number;
  }
  /** Radio 150 ms each way. Returns, per saved set, its time minus the tap and whether it was flagged. */
  async function run(o: Run, openAt: number, taps: number[]) {
    const Link = await loadWatch();
    let watch: WatchLink | null = null;
    let failed = 0;
    const rows: string[] = [];
    const queue: Record<string, unknown>[] = [];
    let pumping = false;
    const pump = () => {
      if (pumping) return;
      pumping = true;
      setTimeout(() => {
        pumping = false;
        const evs = queue.splice(0);
        if (o.reverse) evs.reverse();
        for (const ev of evs) void lab.receive(ev);
      }, Math.max(5, (o.jsFrozenUntil ?? 0) - Date.now()));
    };
    const plugin = {
      send: async ({ text }: { text: string }) => {
        const answer = (JSON.parse(text) as { wt: unknown }).wt != null;
        if (answer && o.failHelloAnswers && failed < o.failHelloAnswers) {
          failed++;
          if (failed === o.failHelloAnswers) setTimeout(() => setSet(0, 0, { reps: 9 }), 500);
          return { code: 206 };
        }
        setTimeout(() => watch?.rx(text), 150);
        return { code: 207 };
      },
    } as unknown as WearEnginePlugin;
    const lab = createLab(plugin);
    let vis = 'visible';
    const listeners: Array<() => void> = [];
    const doc = { get visibilityState() { return vis; }, addEventListener: (_t: string, fn: () => void) => { listeners.push(fn); } };
    const phone = createLink({ send: lab.post, log: t => { rows.push(t); }, doc, hidden: () => vis === 'hidden' });
    lab.route(phone.receive);
    await phone.start();
    if (o.hiddenUntil) { vis = 'hidden'; setTimeout(() => { vis = 'visible'; for (const f of listeners) f(); }, o.hiddenUntil - Date.now()); }
    const send = (t: string, done: (c: number) => void) => {
      setTimeout(() => { queue.push({ type: 1, data: t, desc: '', dataLen: t.length, descLen: 0, rxAt: Date.now() }); pump(); }, 150);
      done(207);
    };
    await vi.advanceTimersByTimeAsync(openAt - Date.now());
    watch = onWatch(Link, { store: watchStore(), send, keep: () => undefined, now: () => Date.now() - o.theta }, 'k3x9qa04');
    watch.start();
    watch.show(); // registerReceiver's onSuccess: the second start hello
    setInterval(() => watch!.tick(), 1000);
    const tapAt: number[] = [];
    for (const t of taps) {
      await vi.advanceTimersByTimeAsync(t - Date.now());
      if (watch.view().can) { tapAt.push(Date.now()); watch.complete(); }
    }
    await vi.advanceTimersByTimeAsync(10_000);
    const sets = state.value.active!.entries[0]!.sets.filter(x => x.at);
    return { rows, sets: sets.map((x, i) => ({ err: Date.parse(x.at!) - tapAt[i]!, future: (x.flags ?? []).includes('future_time') })) };
  }
  const every5 = (from: number, n: number) => Array.from({ length: n }, (_, i) => from + i * 5_000);
  const atTap = (sets: Array<{ err: number; future: boolean }>, n: number) => {
    expect(sets).toHaveLength(n);
    for (const x of sets) expect(x.future || Math.abs(x.err) > 300 ? x : 'ok').toBe('ok');
  };

  it('the device run: watch app opened first, JS sees the start hellos 15.6 s late, then 11 Completes', async () => {
    startSession(split12);
    const r = await run({ theta: 0, jsFrozenUntil: T0 + 75_600 }, T0 + 60_000, every5(T0 + 80_000, 11));
    atTap(r.sets, 11);
    expect(r.rows.filter(x => x.startsWith('mw hello')).every(x => /js \+15\d{3}ms$/.test(x))).toBe(true);
  });
  for (const reverse of [false, true]) {
    it(`JS frozen 35 s holds three hellos, handed over ${reverse ? 'newest first' : 'in order'}; watch clock 37 s behind`, async () => {
      startSession(split12);
      const r = await run({ theta: 37_000, jsFrozenUntil: T0 + 95_000, reverse }, T0 + 60_000, every5(T0 + 100_000, 6));
      expect(r.rows.filter(x => x.startsWith('mw hello'))).toHaveLength(3);
      atTap(r.sets, 6);
    });
  }
  it('hellos seen while M/ARC is hidden are answered by the snap that goes when it shows; watch 8 s behind', async () => {
    startSession(split12);
    const r = await run({ theta: 8_000, hiddenUntil: T0 + 70_000 }, T0 + 60_000, every5(T0 + 75_000, 3));
    expect(r.rows.filter(x => x === 'mw hidden hello')).toHaveLength(2);
    atTap(r.sets, 3);
  });
  it('both start hello answers fail to send; the next change snap answers them; watch 8 s behind', async () => {
    startSession(split12);
    const r = await run({ theta: 8_000, failHelloAnswers: 2 }, T0 + 60_000, every5(T0 + 63_000, 3));
    expect(r.rows.filter(x => x === 'mw snap 206')).toHaveLength(2);
    atTap(r.sets, 3);
  });
});
