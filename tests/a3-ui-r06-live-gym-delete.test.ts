/** A3 verify UI-R06: deleting the gym a live workout uses must not silently change that workout's entry context. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { replaceState, state } from '@/core/store';
import { freshState, newId } from '@/core/models';
import { addGym, deleteGym, profileFor, setExerciseUnit } from '@/slices/workout/units';

const BENCH = 'lib_barbell_bench_press';

beforeEach(() => { vi.useFakeTimers({ now: Date.parse('2026-10-01T12:00:00.000Z'), toFake: ['Date'] }); replaceState(freshState()); });
afterEach(() => { vi.useRealTimers(); });

describe('UI-R06: live gym deletion', () => {
  it('bench stays lb and the live gym stays resolvable after Settings deletes the in-use gym', () => {
    const lbGym = addGym('Home', 'lb')!;
    setExerciseUnit(BENCH, 'lb', 'user', lbGym);
    // The state startSession writes (session.ts:83): the live session is anchored to the active gym.
    replaceState({ ...state.value, active: { id: newId('s'), splitId: 'split_push', startedAt: new Date().toISOString(), pausedMs: 0, entries: [], gymId: state.value.units.activeGymId } });
    expect(state.value.active!.gymId, 'premise: live session at the lb gym').toBe(lbGym);
    expect(profileFor(BENCH, state.value.active!.gymId).unit, 'premise: bench entered in lb').toBe('lb');

    deleteGym(lbGym); // Gyms.tsx:46 offers this whenever more than one gym exists.

    const liveGym = state.value.active!.gymId!;
    expect.soft(state.value.units.gyms.some(g => g.id === liveGym), 'live session points at a gym that no longer exists').toBe(true);
    expect.soft(profileFor(BENCH, liveGym).unit, 'live bench entry unit silently changed').toBe('lb');
  });
});
