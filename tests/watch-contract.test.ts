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
    await vi.advanceTimersByTimeAsync(4000);
    watch.tick();
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
    const value = store.map.get('mc_q0')!;
    // commandId "<boot>-1" here; a run's sequence can reach 99999 (4 more characters) and keep the margin.
    const worst = value.length + 4;
    console.log(`[WATCH-C 1.1.2] longest stored Complete ${worst} characters of 119: margin ${119 - worst}`);
    expect(worst).toBeLessThanOrEqual(119 - 10);
  });
});
