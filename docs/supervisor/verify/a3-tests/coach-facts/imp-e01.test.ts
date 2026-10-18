/**
 * IMP-E01: Escobar's next target must use the same load factor as the live workout (Train).
 * Train reads the active entry's stored loadFactor (Train.tsx:166 entryTarget); Escobar reads only
 * today's global override (escobar/tools/context.ts:102, :115) and never checks the override's split.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const remindersMock = vi.hoisted(() => ({ resyncReminders: vi.fn(async () => undefined) }));
vi.mock('@/slices/settings/reminders', () => remindersMock);

import { replaceState, state, update } from '@/core/store';
import { freshState, type Split } from '@/core/models';
import { dayKey } from '@/core/dates';
import { startSession } from '@/slices/workout/session';
import { entryTarget } from '@/slices/workout/Train';
import { refreshClock } from '@/app/clock';
import { makeCtx, progressionCtxFor } from '@/escobar/tools/context';
import { getNextTarget } from '@/escobar/tools/read';
import { session, sets } from '../../helpers';

const BENCH = 'lib_barbell_bench_press';
const A: Split = { id: 'sp_a', name: 'Push A', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };
const B: Split = { id: 'sp_b', name: 'Push B', color: '#fff', focus: [], createdAt: '', exercises: [{ exerciseId: BENCH, sets: 3 }] };
// Local wall-clock times, so the midnight case is a real local midnight in every TZ.
const D_2350 = new Date(2026, 8, 22, 23, 50).getTime();
const D1_0010 = new Date(2026, 8, 23, 0, 10).getTime();
const D_1000 = new Date(2026, 8, 22, 10, 0).getTime();
const D = dayKey(new Date(D_2350));

const at = (ms: number) => { vi.setSystemTime(ms); refreshClock(ms); };
const history = [
  session('2026-09-15', [{ id: BENCH, sets: sets(100, 6, 'ideal', 3) }]),
  session('2026-09-18', [{ id: BENCH, sets: sets(100, 6, 'ideal', 3) }]),
];
const coachKg = (now: number) => (getNextTarget({ exerciseId: BENCH, plannedSets: 3 }, makeCtx(state.value, now)) as { kg: number | null }).kg;

beforeEach(() => { vi.useFakeTimers(); });
afterEach(() => { vi.useRealTimers(); });

describe('IMP-E01 coach and live target use the same active factor', () => {
  it('control: no override, Train and Escobar agree', () => {
    at(D_1000);
    replaceState({ ...freshState(), splits: [A, B], sessions: history });
    startSession(A);
    const trainKg = entryTarget(state.value, state.value.active!.entries[0]!).kg;
    expect(coachKg(D_1000)).toBe(trainKg);
  });

  it('a session started at 23:50 with a 0.8 factor still gets 0.8 from Escobar at 00:10', () => {
    at(D_2350);
    replaceState({ ...freshState(), splits: [A, B], sessions: history });
    update(s => ({ ...s, escobar: { ...s.escobar, todayOverride: { day: D, splitId: A.id, reason: 'lighter', changes: [{ kind: 'load', exerciseId: BENCH, factor: 0.8 }] } } }));
    startSession(A);
    expect(state.value.active!.entries[0]!.loadFactor).toBe(0.8);
    at(D1_0010);
    const trainKg = entryTarget(state.value, state.value.active!.entries[0]!).kg;
    expect.soft(progressionCtxFor(makeCtx(state.value, D1_0010), BENCH, state.value.active!.gymId).loadFactor).toBe(0.8);
    expect.soft(coachKg(D1_0010), `Train ${trainKg} kg`).toBe(trainKg);
  });

  it('an override for split A does not change split B\'s live target in Escobar', () => {
    at(D_1000);
    replaceState({ ...freshState(), splits: [A, B], sessions: history });
    update(s => ({ ...s, escobar: { ...s.escobar, todayOverride: { day: dayKey(new Date(D_1000)), splitId: A.id, reason: 'lighter', changes: [{ kind: 'load', exerciseId: BENCH, factor: 0.8 }] } } }));
    startSession(B);
    expect(state.value.active!.entries[0]!.loadFactor).toBeUndefined();
    const trainKg = entryTarget(state.value, state.value.active!.entries[0]!).kg;
    expect.soft(progressionCtxFor(makeCtx(state.value, D_1000), BENCH, state.value.active!.gymId).loadFactor).toBeUndefined();
    expect.soft(coachKg(D_1000), `Train ${trainKg} kg`).toBe(trainKg);
  });
});
