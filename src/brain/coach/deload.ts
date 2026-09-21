/** Apply an accepted easier week to a next-session suggestion. */
import type { CoachState, SessionIntent } from '@/core/models';
import type { Suggestion } from '../progression';

export type Deload = NonNullable<CoachState['deload']>;

export function deloadActive(deload: Deload | null | undefined, today: string): deload is Deload {
  return !!deload && deload.from <= today && today <= deload.to;
}

/**
 * What a NEW session's intent is, captured once at start (docs/escobar-presence
 * P04, 01-ARCHITECTURE.md §5). Easier only exists through an already-accepted
 * active deload at this exact moment — never invented, never a separate
 * easier-day planner. A later deload ending, or a new one starting, cannot
 * retroactively change what was captured here.
 */
export function captureSessionIntent(deload: Deload | null | undefined, today: string, capturedAt: string): SessionIntent {
  return deloadActive(deload, today)
    ? { kind: 'easier', capturedAt, source: 'accepted_deload', effortCap: deload.effortCap }
    : { kind: 'normal', capturedAt, source: 'session_start', effortCap: null };
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
