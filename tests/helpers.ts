import type { LoggedSet, Session, SessionLogging } from '@/core/models';
import { newId } from '@/core/models';

export function liveLogging(trainedAt: string, trainedEndAt: string): SessionLogging {
  return { mode: 'live', trainedAt, trainedEndAt, loggedAt: trainedEndAt, timeSource: 'timer', liveShare: 1, timingTrusted: true, contentConfidence: 'high', flags: [] };
}

export function session(day: string, exercises: Array<{ id: string; name?: string; sets: LoggedSet[] }>, splitId = 'split_push'): Session {
  const startedAt = `${day}T17:00:00.000Z`;
  const endedAt = `${day}T18:00:00.000Z`;
  return {
    id: newId('s'),
    splitId,
    splitName: 'Push',
    day,
    startedAt,
    endedAt,
    durationSec: 3600,
    exercises: exercises.map(e => ({ exerciseId: e.id, name: e.name ?? e.id, sets: e.sets })),
    logging: liveLogging(startedAt, endedAt),
  };
}

/** Pass `null` for effort to leave it unrated. */
export const sets = (kg: number, reps: number, effort: LoggedSet['effort'] | null = 'ideal', n = 3): LoggedSet[] =>
  Array.from({ length: n }, () => (effort ? { kg, reps, effort } : { kg, reps }));
