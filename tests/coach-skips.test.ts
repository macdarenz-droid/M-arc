import { describe, expect, it } from 'vitest';
import { detectChronicSkip, skipEvidence } from '@/brain/coach/detectors/skips';
import { findExercise } from '@/core/exercises';
import type { Session, WorkoutPlanEntry } from '@/core/models';
import { addDays } from '@/core/dates';
import { ctx, LEGS_EX, LEGS_ID, TODAY } from './coach-helpers';

const calf = 'lib_standing_calf_raise';
const legPress = 'lib_leg_press';
const skipCtx = (sessions: Session[]) => ctx(sessions, {
  splits: [{ id: LEGS_ID, name: 'Legs', color: '#000', focus: [], createdAt: '2026-01-01T00:00:00.000Z', exercises: [{ exerciseId: legPress, sets: 3 }, { exerciseId: calf, sets: 3 }] }],
});

function captured(id: string, origin: WorkoutPlanEntry['origin'] = 'start'): WorkoutPlanEntry {
  const exercise = findExercise(id)!;
  return {
    id: `pe_${id}`,
    exerciseId: id,
    name: exercise.name,
    mode: exercise.mode,
    origin,
    plannedSets: 3,
    targetSource: 'history',
    allowIncrease: true,
    targets: Array.from({ length: 3 }, () => ({ kg: 40, reps: 8, durationSec: null })),
  };
}

function session(index: number, calfSet: Record<string, number> | null = null, plan: 'saved' | 'legacy' = 'saved'): Session {
  const day = addDays(TODAY, -28 + index * 5);
  return {
    id: `s${index}`,
    splitId: LEGS_ID,
    splitName: 'Legs',
    day,
    startedAt: `${day}T10:00:00.000Z`,
    endedAt: `${day}T11:00:00.000Z`,
    durationSec: 3600,
    exercises: [
      { exerciseId: legPress, name: 'Leg Press', sets: [{ kg: 80, reps: 8 }] },
      ...(calfSet ? [{ exerciseId: calf, name: 'Standing Calf Raise', sets: [calfSet] }] : []),
    ],
    plan: plan === 'saved' ? { version: 1, capturedAt: `${day}T10:00:00.000Z`, goal: 'lean', deload: null, entries: LEGS_EX.map(id => captured(id)) } : undefined,
  };
}

describe('chronic skip evidence', () => {
  it('turns four of five saved expectations into one confirmed omission', () => {
    const sessions = [session(0, { kg: 40, reps: 8 }), session(1), session(2), session(3), session(4)];
    const row = skipEvidence(skipCtx(sessions)).find(item => item.exerciseId === calf)!;
    expect(row).toMatchObject({ basis: 'saved_plan', sessions: 5, missingSessions: 4, sessionIds: ['s0', 's1', 's2', 's3', 's4'], missingSessionIds: ['s1', 's2', 's3', 's4'] });
    expect(detectChronicSkip(skipCtx(sessions)).find(f => f.subject.exerciseId === calf)).toMatchObject({
      confidence: 'medium', severity: 1, metrics: { sessions: 5, missingSessions: 4, presentSessions: 1, basis: 'saved_plan', exerciseName: 'Standing Calf Raise', splitName: 'Legs' },
    });
  });

  it('keeps three missing sessions and only four total sessions quiet', () => {
    expect(detectChronicSkip(skipCtx([session(0, { kg: 40, reps: 8 }), session(1, { kg: 40, reps: 8 }), session(2), session(3), session(4)]))).toEqual([]);
    expect(detectChronicSkip(skipCtx([session(0), session(1), session(2), session(3)]))).toEqual([]);
  });

  it('counts any real working set as present, including duration and distance', () => {
    const duration = [session(0, { durationSec: 20 }), session(1), session(2), session(3), session(4)];
    const distance = [session(0, { distanceM: 100 }), session(1), session(2), session(3), session(4)];
    expect(skipEvidence(skipCtx(duration)).find(row => row.exerciseId === calf)?.missingSessions).toBe(4);
    expect(skipEvidence(skipCtx(distance)).find(row => row.exerciseId === calf)?.missingSessions).toBe(4);
  });

  it('labels legacy comparison and refuses to blend mixed snapshot quality', () => {
    const legacy = Array.from({ length: 5 }, (_, i) => session(i, i === 0 ? { kg: 40, reps: 8 } : null, 'legacy'));
    expect(detectChronicSkip(skipCtx(legacy)).find(f => f.subject.exerciseId === calf)).toMatchObject({ confidence: 'low', metrics: { basis: 'current_template' } });
    legacy[4] = session(4);
    expect(detectChronicSkip(skipCtx(legacy))).toEqual([]);
  });

  it('does not call replacements, additions, removed splits or unknown aliases skipped work', () => {
    for (const origin of ['added', 'replacement'] as const) {
      const sessions = Array.from({ length: 5 }, (_, i) => session(i));
      sessions[0]!.plan!.entries.find(entry => entry.exerciseId === calf)!.origin = origin;
      expect(detectChronicSkip(skipCtx(sessions)).some(f => f.subject.exerciseId === calf)).toBe(false);
    }
    const replaced = Array.from({ length: 5 }, (_, i) => session(i));
    replaced[0]!.plan!.entries.find(entry => entry.exerciseId === calf)!.excluded = 'replaced';
    expect(detectChronicSkip(skipCtx(replaced)).some(f => f.subject.exerciseId === calf)).toBe(false);
    const removedSplit = ctx(Array.from({ length: 5 }, (_, i) => session(i)), { splits: [] });
    expect(detectChronicSkip(removedSplit)).toEqual([]);
    const unknown = ctx(Array.from({ length: 5 }, (_, i) => session(i)), { splits: [{ ...ctx([]).splits.find(split => split.id === LEGS_ID)!, exercises: [{ exerciseId: 'missing_alias', sets: 3 }] }] });
    expect(detectChronicSkip(unknown)).toEqual([]);
  });

  it('recomputes immediately after a history edit or delete', () => {
    const sessions = Array.from({ length: 5 }, (_, i) => session(i, i === 0 ? { kg: 40, reps: 8 } : null));
    expect(detectChronicSkip(skipCtx(sessions)).some(f => f.subject.exerciseId === calf)).toBe(true);
    sessions[1]!.exercises.push({ exerciseId: calf, name: 'Standing Calf Raise', sets: [{ kg: 40, reps: 8 }] });
    expect(detectChronicSkip(skipCtx(sessions)).some(f => f.subject.exerciseId === calf)).toBe(false);
    sessions.splice(1, 1);
    expect(detectChronicSkip(skipCtx(sessions))).toEqual([]);
  });
});
