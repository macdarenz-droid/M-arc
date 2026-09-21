import { describe, expect, it } from 'vitest';
import { effortCalibration, effortRepair, effortSetFingerprint, unratedSets } from '@/brain/debrief';
import { RIR_BAND } from '@/brain/coach/bands';
import type { LoggedSet, Session } from '@/core/models';
import { freshState } from '@/core/models';
import { initStore, replaceState, state } from '@/core/store';
import { setSessionEffort } from '@/slices/workout/session';

const saved = (sets: LoggedSet[]): Session => ({
  id: 'saved', splitId: 'push', splitName: 'Push', day: '2026-09-21', startedAt: '2026-09-21T10:00:00.000Z', endedAt: '2026-09-21T11:00:00.000Z', durationSec: 3600,
  exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', planEntryId: 'pe_bench', sets }],
});

describe('effort repair brain', () => {
  it('never offers for zero work or weight-only placeholders', () => {
    expect(effortRepair(saved([]))).toEqual({ workingSets: 0, ratedSets: 0, missingSets: 0, coverage: 0, offer: false, missing: [] });
    expect(effortRepair(saved([{ kg: 60 }, {}, { effort: 'max' }]))).toMatchObject({ workingSets: 0, missingSets: 0, offer: false });
  });

  it('offers below half coverage and returns every missing working row', () => {
    const half = effortRepair(saved([{ kg: 60, reps: 8, effort: 'ideal' }, { kg: 60, reps: 8 }]));
    expect(half).toMatchObject({ workingSets: 2, ratedSets: 1, missingSets: 1, coverage: 0.5, offer: false });
    const third = effortRepair(saved([{ kg: 60, reps: 8, effort: 'ideal' }, { kg: 60, reps: 8 }, { kg: 60, reps: 7 }]));
    expect(third).toMatchObject({ workingSets: 3, ratedSets: 1, missingSets: 2, coverage: 1 / 3, offer: true });
    expect(third.missing.map(row => [row.exerciseIndex, row.setIndex, row.setNumber])).toEqual([[0, 1, 2], [0, 2, 3]]);
  });

  it('treats imported invalid effort strings as unknown without rewriting the set', () => {
    const set = { kg: 60, reps: 8, effort: 'medium' as never };
    const missing = unratedSets(saved([set]));
    expect(missing).toHaveLength(1);
    expect(missing[0]!.actual).toEqual(set);
    expect(missing[0]!.actual).not.toBe(set);
  });

  it('fingerprints exact saved identity and values, including plan and effort', () => {
    const session = saved([{ kg: 60, reps: 8 }]);
    expect(effortSetFingerprint(session, 0, 0)).toBe(JSON.stringify(['saved', session.startedAt, 0, 'lib_barbell_bench_press', 'pe_bench', 0, 60, 8, null, null, null]));
    expect(effortSetFingerprint(session, -1, 0)).toBeNull();
    expect(effortSetFingerprint(session, 0, 1)).toBeNull();
    const changed = saved([{ kg: 60, reps: 8, effort: 'easy' }]);
    expect(effortSetFingerprint(changed, 0, 0)).not.toBe(effortSetFingerprint(session, 0, 0));
  });

  it('copies the existing RIR bands into the three calibrated choices', () => {
    const calibration = effortCalibration();
    expect(calibration).toEqual([
      { effort: 'easy', label: 'Easy', rir: RIR_BAND.easy },
      { effort: 'ideal', label: 'Ideal', rir: RIR_BAND.ideal },
      { effort: 'max', label: 'Max', rir: RIR_BAND.max },
    ]);
    expect(calibration[0]!.rir).not.toBe(RIR_BAND.easy);
  });
});

describe('saved effort mutation', () => {
  const setup = (session: Session) => {
    const writeCounts = new Map<string, number>();
    const values = new Map<string, string>();
    const storage = { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => { writeCounts.set(key, (writeCounts.get(key) ?? 0) + 1); values.set(key, value); }, removeItem: (key: string) => { values.delete(key); } };
    initStore(storage);
    replaceState({ ...freshState(new Date('2026-09-21T00:00:00.000Z')), sessions: [session] });
    return { writes: (key = 'marc.state.v1') => writeCounts.get(key) ?? 0 };
  };

  it('changes exactly one effort field and flushes once', () => {
    const session = saved([{ kg: 60, reps: 8 }, { kg: 60, reps: 7 }]);
    const storage = setup(session);
    const beforeWrites = storage.writes();
    const fingerprint = effortSetFingerprint(state.value.sessions[0]!, 0, 1)!;
    expect(setSessionEffort(session.id, 0, 1, fingerprint, 'max')).toBe(true);
    expect(storage.writes()).toBe(beforeWrites + 1);
    expect(state.value.sessions[0]!.exercises[0]!.sets).toEqual([{ kg: 60, reps: 8 }, { kg: 60, reps: 7, effort: 'max' }]);
    expect(state.value.active).toBeNull();
    expect(state.value.sessions).toHaveLength(1);
    expect(state.value.sessions[0]!.noteFlags).toBeUndefined();
  });

  it('rejects deleted, edited, moved, nonworking, already-rated and invalid choices without a write', () => {
    const session = saved([{ kg: 60, reps: 8 }, { kg: 60 }, { kg: 60, reps: 7, effort: 'easy' }]);
    const storage = setup(session);
    const current = state.value.sessions[0]!;
    const first = effortSetFingerprint(current, 0, 0)!;
    const placeholder = effortSetFingerprint(current, 0, 1)!;
    const rated = effortSetFingerprint(current, 0, 2)!;
    const beforeWrites = storage.writes();
    expect(setSessionEffort('missing', 0, 0, first, 'ideal')).toBe(false);
    expect(setSessionEffort(session.id, 0, 0, `${first}:edited`, 'ideal')).toBe(false);
    expect(setSessionEffort(session.id, 0, 1, placeholder, 'ideal')).toBe(false);
    expect(setSessionEffort(session.id, 0, 2, rated, 'max')).toBe(false);
    expect(setSessionEffort(session.id, 0, 0, first, 'invalid' as never)).toBe(false);
    expect(storage.writes()).toBe(beforeWrites);
    const moved = { ...current, exercises: [{ ...current.exercises[0]!, sets: [current.exercises[0]!.sets[1]!, current.exercises[0]!.sets[0]!, current.exercises[0]!.sets[2]!] }] };
    replaceState({ ...state.value, sessions: [moved] });
    const afterMoveSetup = storage.writes();
    expect(setSessionEffort(session.id, 0, 0, first, 'ideal')).toBe(false);
    expect(storage.writes()).toBe(afterMoveSetup);
    expect(beforeWrites).toBeLessThanOrEqual(afterMoveSetup);
  });

  it('allows an explicit valid choice to replace an imported invalid label', () => {
    const session = saved([{ kg: 60, reps: 8, effort: 'medium' as never }]);
    setup(session);
    const current = state.value.sessions[0]!;
    expect(setSessionEffort(session.id, 0, 0, effortSetFingerprint(current, 0, 0)!, 'ideal')).toBe(true);
    expect(state.value.sessions[0]!.exercises[0]!.sets[0]!.effort).toBe('ideal');
  });
});
