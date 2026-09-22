import { describe, expect, it } from 'vitest';
import { selectSessionFeedback } from '@/brain/coach/sessionFeedback';
import type { Session, WorkoutPlanSnapshot } from '@/core/models';

function workout(id: string, startedAt: string, reps = 8): Session {
  const day = startedAt.slice(0, 10);
  const plan: WorkoutPlanSnapshot = {
    version: 1,
    capturedAt: startedAt,
    goal: 'growth',
    deload: null,
    entries: [{ id: `${id}-entry`, exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', mode: 'weighted', origin: 'start', plannedSets: 1, targetSource: 'history', allowIncrease: true, targets: [{ kg: 60, reps: 8, durationSec: null }] }],
    assessment: { version: 1, intent: { kind: 'normal', capturedAt: startedAt, source: 'session_start', effortCap: null }, changes: [], invalidatedEntryIds: [], seenWorkingRows: [{ entryId: `${id}-entry`, setIndices: [0] }] },
  };
  return { id, splitId: 'push', splitName: `Push ${id}`, day, startedAt, endedAt: startedAt, durationSec: 60, exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', planEntryId: `${id}-entry`, actualSetIndices: [0], sets: [{ kg: 60, reps }] }], plan };
}

describe('latest session feedback selection', () => {
  it('selects only the latest completed workout from the requested day', () => {
    const prior = workout('prior', '2026-09-21T08:00:00.000Z');
    const early = workout('early', '2026-09-22T08:00:00.000Z');
    const latest = workout('latest', '2026-09-22T18:00:00.000Z');
    expect(selectSessionFeedback([latest, prior, early], '2026-09-22', [], 'steady')).toMatchObject({ sessionId: 'latest', splitName: 'Push latest' });
    expect(selectSessionFeedback([latest], '2026-09-23', [], 'steady')).toBeNull();
  });

  it('tone changes only copy while classification and achievements stay equal', () => {
    const prior = workout('prior', '2026-09-21T08:00:00.000Z');
    const current = workout('current', '2026-09-22T08:00:00.000Z', 9);
    const steady = selectSessionFeedback([prior, current], '2026-09-22', [], 'steady')!;
    const direct = selectSessionFeedback([prior, current], '2026-09-22', [], 'direct')!;
    expect(direct.fit).toEqual(steady.fit);
    expect(direct.achievements).toEqual(steady.achievements);
    expect(direct.copy.headline).toBe(steady.copy.headline);
    expect(direct.copy.details).toEqual(steady.copy.details);
    expect(direct.copy.summary).not.toBe(steady.copy.summary);
  });
});
