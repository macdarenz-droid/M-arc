/** A3 verify ENG-05: after insert or retime, the stored recovery model must equal a clean replay. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/slices/settings/reminders', () => ({ resyncReminders: vi.fn(async () => undefined) }));

import { replaceState, state } from '@/core/store';
import { freshState, type LoggedSet, type Session } from '@/core/models';
import { logPastSession, rebuildRecoveryModel, resolveSessionTiming } from '@/slices/workout/session';
import { establishedProfile, sessionAt } from '../helpers';

const BENCH = 'lib_barbell_bench_press';
const max = (kg: number, n = 3): LoggedSet[] => Array.from({ length: n }, () => ({ kg, reps: 8, effort: 'max' as const }));
const at = (day: string, ex: LoggedSet[]): Session => sessionAt(`${day}T17:00:00.000Z`, `${day}T18:00:00.000Z`, [{ id: BENCH, name: 'Bench', sets: ex }]);

beforeEach(() => { vi.useFakeTimers(); vi.setSystemTime(Date.parse('2026-10-01T12:00:00.000Z')); });
afterEach(() => { vi.useRealTimers(); });

function seed(sessions: Session[]) {
  const base = { ...freshState(), profile: establishedProfile, sessions };
  // Start consistent: the stored model is exactly what a clean replay gives.
  replaceState({ ...base, recoveryModel: rebuildRecoveryModel(base) });
}

describe('ENG-05: recovery calibration after history mutations', () => {
  it('retiming a session across the 7-day comparison window rebuilds the model', () => {
    const a = at('2026-09-20', max(100));
    const b = { ...at('2026-09-26', max(90)), logging: { ...at('2026-09-26', []).logging, flags: ['compressed'] } };
    seed([a, b]);
    const before = state.value.recoveryModel;
    expect(Object.keys(before.tauScale).length, 'precondition: Sep 26 calibrated against Sep 20').toBeGreaterThan(0);
    expect(resolveSessionTiming(b.id, '2026-09-29T17:00', 60, 'user')).toBe(true);
    expect(state.value.recoveryModel).toEqual(rebuildRecoveryModel(state.value));
  });

  it('inserting a past session between two sessions rebuilds the model', () => {
    seed([at('2026-09-20', max(100)), at('2026-09-26', max(100))]);
    expect(state.value.recoveryModel, 'precondition: equal sessions learn nothing').toEqual({ tauScale: {}, observations: {} });
    const r = logPastSession({ splitId: 'x', trainedAtLocal: '2026-09-21T17:00', durationMin: 60, entries: [{ exerciseId: BENCH, name: 'Bench', sets: max(120) }] });
    expect(r).not.toBeNull();
    const clean = rebuildRecoveryModel(state.value);
    expect(Object.keys(clean.tauScale).length, 'precondition: replay with the insert learns something').toBeGreaterThan(0);
    expect(state.value.recoveryModel).toEqual(clean);
  });
});
