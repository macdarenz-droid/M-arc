import { describe, it, expect } from 'vitest';
import { freshState, type AppState, type CommandReceipt } from '@/core/models';
import { loadState } from '@/core/store';
import { sessionAt } from './helpers';

/** WATCH-B B13: the v0 to v1 data migration, through the same load path the app boots with. */
function storageWith(raw: unknown) {
  const map = new Map([['marc.state.v1', JSON.stringify(raw)]]);
  return { getItem: (k: string) => map.get(k) ?? null, setItem: (k: string, v: string) => { map.set(k, v); }, removeItem: (k: string) => { map.delete(k); } };
}
const load = (raw: unknown): AppState => loadState(storageWith(raw)).state;

const T = Date.parse('2026-09-22T10:00:00.000Z');
const history = [sessionAt('2026-09-20T10:00:00.000Z', '2026-09-20T11:00:00.000Z', [{ id: 'lib_barbell_bench_press', sets: [{ kg: 60, reps: 8, at: '2026-09-20T10:05:00.000Z', fidelity: 'live', restSec: 80 }] }])];
const v0Active = {
  id: 's_live', splitId: 'sp', startedAt: '2026-09-22T09:50:00.000Z', pausedMs: 12_000, pausedAt: T - 30_000, gymId: 'gym_default',
  entries: [{ id: 'e1', exerciseId: 'lib_barbell_bench_press', name: 'Bench', done: false, skipped: false, sets: [
    { id: 'set_a', kg: 60, reps: 8, at: '2026-09-22T09:55:00.000Z', restSec: 90, fidelity: 'live' },
    { id: 'set_b', kg: 60, reps: 8 },
    { id: 'set_c', at: '2026-09-22T09:57:00.000Z' },
    { id: 'set_d', kg: 60, reps: 8, status: 'skipped' },
    { id: 'set_e', durationSec: 30, at: '2026-09-22T09:59:00.000Z', status: 'draft' },
  ] }],
  rest: { endsAt: T + 45_000, totalSec: 90, pausedRemainingSec: 75, effort: 'ideal' },
};
/** A save from before WATCH-B: no dataVersion, no command log. */
function v0(): AppState {
  const { dataVersion: _v, commands: _c, ...rest } = freshState(new Date('2026-09-01T00:00:00.000Z'));
  return JSON.parse(JSON.stringify({ ...rest, sessions: history, active: v0Active })) as AppState;
}
/** Every time field the migration could touch, as text, so "unchanged" means byte-identical. */
const times = (s: AppState): string => JSON.stringify({
  createdAt: s.createdAt, startedAt: s.active!.startedAt, pausedAt: s.active!.pausedAt, pausedMs: s.active!.pausedMs,
  sets: s.active!.entries.flatMap(e => e.sets.map(x => [x.at ?? null, x.restSec ?? null, x.receivedAt ?? null])),
  rest: [s.active!.rest!.endsAt, s.active!.rest!.totalSec, s.active!.rest!.pausedRemainingSec], sessions: s.sessions,
});

describe('WATCH-B B13: data version 0 to 1', () => {
  it('derives each set\'s state, starts revisions at 0, gives the rest an id and starts the command log empty', () => {
    const s = load(v0());
    expect(s.dataVersion).toBe(1);
    expect(s.active!.rev).toBe(0);
    expect(s.active!.entries[0]!.sets.map(x => [x.id, x.status, x.rev])).toEqual([
      ['set_a', 'committed', 0], ['set_b', 'draft', 0], ['set_c', 'draft', 0], ['set_d', 'skipped', 0], ['set_e', 'draft', 0],
    ]);
    expect(s.active!.rest).toEqual({ ...v0Active.rest, id: expect.stringMatching(/^rest_/), rev: 0 });
    expect(s.commands).toEqual({ receipts: [], closed: [] });
  });
  it('creates or changes no time field and leaves history untouched', () => {
    const raw = v0();
    const s = load(raw);
    expect(times(s)).toBe(times(raw));
    expect(JSON.stringify(s.sessions)).toBe(JSON.stringify(history));
    expect('at' in s.active!.entries[0]!.sets[1]!).toBe(false);
    expect(s.active!.entries[0]!.sets.some(x => 'receivedAt' in x)).toBe(false);
  });
  it('a second run changes nothing', () => {
    const once = load(v0());
    const twice = load(once);
    expect(twice).toEqual(once);
    expect(times(twice)).toBe(times(once));
    // The v0 step itself, run again on its own output, changes nothing either.
    const { dataVersion: _v, ...unversioned } = once;
    expect(load(unversioned)).toEqual(once);
  });
  it('a dataVersion 2 save is left alone', () => {
    const v2 = { ...v0(), dataVersion: 2, commands: { receipts: [{ from: 'a newer build' }], closed: [], cursor: 7 } };
    const s = load(v2);
    expect(s.dataVersion).toBe(2);
    expect(s.commands).toEqual(v2.commands);
    expect(s.active!.rev).toBeUndefined();
    expect(s.active!.entries[0]!.sets).toEqual(v0Active.entries[0]!.sets);
    expect(s.active!.rest).toEqual(v0Active.rest);
  });
  it('a broken command log is repaired', () => {
    const closed = (i: number) => ({ sessionId: `s_${i}`, status: 'finished', at: T + i });
    const receipt: CommandReceipt = { commandId: 'cmd-00001', sessionId: 's_1', kind: 'pause', fp: '0a1b2c3d', result: { commandId: 'cmd-00001', status: 'applied', sessionRev: 3, replayed: false }, actionAt: T, receivedAt: T };
    const cases: Array<[unknown, unknown]> = [
      ['x', { receipts: [], closed: [] }],
      [null, { receipts: [], closed: [] }],
      [{ receipts: 'nope', closed: [null, closed(1), { sessionId: 3 }, { ...closed(2), status: 'lost' }] }, { receipts: [], closed: [closed(1)] }],
      [{ receipts: [receipt, { commandId: 'cmd-00002' }, { ...receipt, result: null }, 4], closed: Array.from({ length: 60 }, (_, i) => closed(i)) }, { receipts: [receipt], closed: Array.from({ length: 50 }, (_, i) => closed(i + 10)) }],
      [{ receipts: [receipt], closed: [closed(1)] }, { receipts: [receipt], closed: [closed(1)] }],
    ];
    for (const [commands, want] of cases) expect(load({ ...freshState(), commands }).commands, JSON.stringify(commands).slice(0, 60)).toEqual(want);
  });
});
