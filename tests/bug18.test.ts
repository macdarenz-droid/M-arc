/**
 * BUG-18: targets come from the straight working sets; implausible sets are held out of
 * e1RM, trends, records and targets until repeated (PROGRESSION-F3/F14/F23, COACHRULES-F3/F19).
 */
import { describe, it, expect } from 'vitest';
import { suggestNext } from '@/brain/progression';
import { allRecords, liveRecordStatus, recordsFor } from '@/brain/prs';
import { exerciseHistory } from '@/brain/history';
import { liftTrend } from '@/brain/trend';
import type { LoggedSet } from '@/core/models';
import { session, sets } from './helpers';

const ex = 'lib_barbell_bench_press';
const today = '2026-09-18';
const s = (kg: number, reps: number, effort: LoggedSet['effort'] = 'ideal'): LoggedSet => ({ kg, reps, effort });

describe('BUG-18 A1: targets come from the straight working load', () => {
  it('one heavy single does not set the load for every set (strength goal)', () => {
    const a = session('2026-09-14', [{ id: ex, sets: [s(100, 1, 'max'), ...sets(80, 5)] }]);
    const next = suggestNext([a], ex, 'strength', today);
    expect(next.kg).toBe(80);
    expect(next.sets.every(x => x.kg === 80)).toBe(true);
  });
  it('a heavier first set does not set the load either (lean goal)', () => {
    const a = session('2026-09-14', [{ id: ex, sets: [s(100, 5), s(90, 8), s(90, 8)] }]);
    const next = suggestNext([a], ex, 'lean', today);
    expect(next.kg).toBe(90);
    expect(next.sets.every(x => x.kg === 90)).toBe(true);
  });
  it('a tie between loads goes to the heavier load', () => {
    const a = session('2026-09-14', [{ id: ex, sets: [s(80, 8), s(80, 8), s(90, 6), s(90, 6)] }]);
    expect(exerciseHistory([a], ex)[0]!.workKg).toBe(90);
    expect(suggestNext([a], ex, 'lean', today).kg).toBe(90);
  });
  it('drop sets never become the working load', () => {
    const a = session('2026-09-14', [{ id: ex, sets: [s(80, 8), { kg: 60, reps: 10, effort: 'max', kind: 'drop' }, { kg: 50, reps: 10, effort: 'max', kind: 'drop' }] }]);
    expect(suggestNext([a], ex, 'lean', today).kg).toBe(80);
  });
});

describe('BUG-18 A2: implausible sets are held until repeated', () => {
  const base = [session('2026-09-01', [{ id: ex, sets: sets(100, 6) }]), session('2026-09-04', [{ id: ex, sets: sets(100, 6) }])];
  const typo = session('2026-09-08', [{ id: ex, sets: [s(130, 6), s(100, 6), s(100, 6)] }]);
  it('a 130 kg typo does not become the next target', () => {
    const next = suggestNext([...base, typo], ex, 'lean', today);
    expect(next.kg).toBe(100);
  });
  it('a typo is not a record, and a 1000 kg typo is not a record either', () => {
    expect(allRecords([...base, typo]).filter(r => r.day === '2026-09-08')).toHaveLength(0);
    const huge = session('2026-09-08', [{ id: ex, sets: [s(1000, 6), s(100, 6), s(100, 6)] }]);
    expect(allRecords([...base, huge]).filter(r => r.day === '2026-09-08')).toHaveLength(0);
  });
  it('a typo is left out of e1RM and trend', () => {
    const hist = exerciseHistory([...base, typo], ex);
    expect(hist[2]!.bestE1rm).toBeCloseTo(100 * (1 + 8 / 30), 5);
    expect(hist[2]!.topKg).toBe(100);
    expect(hist[2]!.held).toHaveLength(1);
    const flat = [0, 3, 7, 10].map(d => session(`2026-09-${String(1 + d).padStart(2, '0')}`, [{ id: ex, sets: sets(100, 6) }]));
    const spiked = [...flat, session('2026-09-14', [{ id: ex, sets: [s(400, 6), s(100, 6), s(100, 6)] }])];
    expect(liftTrend(exerciseHistory(spiked, ex)).direction).toBe('flat');
  });
  it('a record from a held set is returned only as unconfirmed', () => {
    const hist = exerciseHistory([...base, typo], ex);
    const recs = recordsFor(hist[2]!, hist.slice(0, 2), 'weighted', ex, 'Bench', 'kg', { unconfirmed: true });
    expect(recs.find(r => r.kind === 'heaviest')?.unconfirmed).toBe(true);
    expect(recordsFor(hist[2]!, hist.slice(0, 2), 'weighted', ex, 'Bench')).toHaveLength(0);
  });
  it('the live badge reads unconfirmed for a flagged set, and a record for a plausible one', () => {
    expect(liveRecordStatus(base, ex, { kg: 130, reps: 6, effort: 'ideal' })).toBe('unconfirmed');
    expect(liveRecordStatus(base, ex, { kg: 102.5, reps: 6, effort: 'ideal' })).toBe('record');
    // Repeated in the same session: confirmed.
    expect(liveRecordStatus(base, ex, { kg: 130, reps: 6, effort: 'ideal' }, [], [s(130, 6), s(130, 6)])).toBe('record');
  });
  it('repeating the load confirms it: the record and the target come back', () => {
    const repeat = session('2026-09-11', [{ id: ex, sets: sets(130, 5) }]);
    const all = [...base, typo, repeat];
    expect(allRecords(all).some(r => r.day === '2026-09-08' && r.kind === 'heaviest')).toBe(true);
    expect(suggestNext(all, ex, 'lean', today).kg).toBe(130);
    // A later session confirms the earlier held set: the typo session holds nothing any more.
    expect(exerciseHistory(all, ex)[2]!.held).toHaveLength(0);
  });
  it('three sets at the new load in one session confirm each other', () => {
    const jump = session('2026-09-08', [{ id: ex, sets: sets(130, 6) }]);
    expect(exerciseHistory([...base, jump], ex)[2]!.held).toHaveLength(0);
    expect(allRecords([...base, jump]).some(r => r.day === '2026-09-08' && r.kind === 'heaviest')).toBe(true);
  });
  it('implausible reps are held too', () => {
    const reps = session('2026-09-08', [{ id: ex, sets: [s(100, 60), s(100, 6), s(100, 6)] }]);
    expect(exerciseHistory([...base, reps], ex)[2]!.held).toHaveLength(1);
    expect(allRecords([...base, reps]).filter(r => r.day === '2026-09-08')).toHaveLength(0);
  });
  it('a session with only a held set does not zero the target', () => {
    const only = session('2026-09-08', [{ id: ex, sets: [s(1000, 6)] }]);
    expect(suggestNext([...base, only], ex, 'lean', today).kg).toBe(100);
  });
});

describe('BUG-18 A3/A5: effort labels alone never make a strength record', () => {
  it('the same load and reps with a new effort label is not a record', () => {
    const a = session('2026-09-01', [{ id: ex, sets: sets(100, 5, 'max') }]);
    const b = session('2026-09-04', [{ id: ex, sets: sets(100, 5, 'ideal') }]);
    expect(allRecords([a, b]).filter(r => r.kind === 'strength')).toHaveLength(0);
    const c = session('2026-09-04', [{ id: ex, sets: sets(100, 5, 'easy') }]);
    const d = session('2026-09-01', [{ id: ex, sets: sets(100, 5, 'ideal') }]);
    expect(allRecords([d, c]).filter(r => r.kind === 'strength')).toHaveLength(0);
  });
  it('easy-rated sets make no e1RM record', () => {
    const a = session('2026-09-01', [{ id: ex, sets: sets(100, 5, 'ideal') }]);
    const b = session('2026-09-04', [{ id: ex, sets: sets(102.5, 5, 'easy') }]);
    const kinds = allRecords([a, b]).map(r => r.kind);
    expect(kinds).toContain('heaviest');
    expect(kinds).not.toContain('strength');
  });
  it('a real gain at ideal effort still is a strength record', () => {
    const a = session('2026-09-01', [{ id: ex, sets: sets(100, 5, 'ideal') }]);
    const b = session('2026-09-04', [{ id: ex, sets: sets(105, 5, 'ideal') }]);
    expect(allRecords([a, b]).map(r => r.kind)).toContain('strength');
  });
});

describe('BUG-18 A4: an increase needs the working sets at the top of the range', () => {
  it('only the best set at the top: no increase', () => {
    const a = session('2026-09-11', [{ id: ex, sets: [s(60, 12), s(60, 8), s(60, 7)] }]);
    const b = session('2026-09-14', [{ id: ex, sets: [s(60, 12), s(60, 8), s(60, 7)] }]);
    expect(suggestNext([a, b], ex, 'lean', today).mode).not.toBe('increase');
  });
  it('a lighter unmarked last set neither blocks nor earns the increase', () => {
    const a = session('2026-09-11', [{ id: ex, sets: [s(60, 12), s(60, 12), s(50, 10)] }]);
    const b = session('2026-09-14', [{ id: ex, sets: [s(60, 12), s(60, 12), s(50, 10)] }]);
    expect(suggestNext([a, b], ex, 'lean', today).mode).toBe('increase');
  });
  it('every working set at the top twice: increase', () => {
    const a = session('2026-09-11', [{ id: ex, sets: sets(60, 12) }]);
    const b = session('2026-09-14', [{ id: ex, sets: sets(60, 12) }]);
    expect(suggestNext([a, b], ex, 'lean', today).mode).toBe('increase');
  });
});

describe('BUG-18 A2: the post-session debrief holds a typo too', () => {
  it('recordsInsight does not praise a 130 kg typo after 100 kg sessions', async () => {
    const { recordsInsight } = await import('@/brain/coach/post');
    const base = [session('2026-09-01', [{ id: ex, sets: sets(100, 6) }]), session('2026-09-04', [{ id: ex, sets: sets(100, 6) }])];
    const typo = session('2026-09-08', [{ id: ex, sets: [s(130, 6), s(100, 6), s(100, 6)] }]);
    expect(recordsInsight(typo, base)).toHaveLength(0);
    const real = session('2026-09-08', [{ id: ex, sets: sets(105, 6) }]);
    expect(recordsInsight(real, base).length).toBeGreaterThan(0);
  });
});
