/** Apply an accepted easier week to a next-session suggestion. */
import type { CoachState } from '@/core/models';
import type { Suggestion } from '../progression';

export type Deload = NonNullable<CoachState['deload']>;

export function deloadActive(deload: Deload | null | undefined, today: string): deload is Deload {
  return !!deload && deload.from <= today && today <= deload.to;
}

const half = (v: number) => Math.round(v * 2) / 2;

export function applyDeload(s: Suggestion, deload: Deload | null | undefined, today: string): Suggestion {
  if (!deloadActive(deload, today) || s.kg == null || s.kg <= 0) return s;
  const kg = half(s.kg * deload.loadFactor);
  const reps = s.reps ? `${s.reps[0] === s.reps[1] ? s.reps[0] : `${s.reps[0]}–${s.reps[1]}`} reps` : '';
  return {
    ...s,
    mode: 'hold',
    kg,
    target: `${kg} kg${reps ? ` · ${reps}` : ''}`,
    reason: `Easier week: about ${Math.round(deload.loadFactor * 100)}% of your usual load. Stop at ${deload.effortCap} effort, no max sets.`,
    confidence: s.confidence,
    sets: s.sets.map(x => ({ ...x, kg: x.kg != null ? half(x.kg * deload.loadFactor) : x.kg, note: 'Easier week' })),
  };
}
