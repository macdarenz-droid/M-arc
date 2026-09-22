/**
 * The only place coach.presence changes — mirrors apply.ts's pattern for
 * proposal dismissals. Explicit only: rendering, opening a panel and
 * selecting a moment never call these (see selectMoment in
 * src/brain/coach/moments.ts, which is pure and writes nothing).
 */
import type { CoachTone } from '@/core/models';
import { MAX_PRESENCE_DISMISSALS } from '@/core/models';
import { update } from '@/core/store';
import type { CoachingMoment } from '@/brain/coach/moments';
import { presenceMoment, report, suggestions, today } from '@/app/selectors';
import { dismissProposal } from './apply';
import type { Suggestion } from '@/brain/coach/words';

export type PresenceDismissalTarget = { kind: 'suggestion'; suggestion: Suggestion } | { kind: 'insight'; moment: CoachingMoment };

/** Pure freshness/ownership resolution used before any dismissal write. */
export function presenceDismissalTarget(expected: CoachingMoment, current: CoachingMoment | null, candidates: readonly Suggestion[]): PresenceDismissalTarget | null {
  if (!current || current.id !== expected.id || current.evidenceKey !== expected.evidenceKey) return null;
  if (current.kind === 'suggestion') {
    const suggestion = candidates.find(candidate => candidate.id === current.sourceIds[0]);
    return suggestion ? { kind: 'suggestion', suggestion } : null;
  }
  return { kind: 'insight', moment: current };
}

/** Dismiss one moment. Same (id, evidenceKey) stays hidden until the evidence itself changes. */
export function dismissPresenceMoment(moment: CoachingMoment): void {
  update(s => {
    const prior = s.coach.presence?.dismissed ?? [];
    const tone = s.coach.presence?.tone ?? 'steady';
    const dismissed = [...prior, { id: moment.id, evidenceKey: moment.evidenceKey, dismissedAt: new Date().toISOString() }]
      .slice(-MAX_PRESENCE_DISMISSALS);
    return { ...s, coach: { ...s.coach, presence: { version: 1, tone, dismissed } } };
  });
}

/** Dismiss a launcher cue through its canonical owner after re-resolving the current evidence. */
export function dismissPresenceLauncher(expected: CoachingMoment): boolean {
  const target = presenceDismissalTarget(expected, presenceMoment.value, suggestions.value);
  if (!target) return false;
  if (target.kind === 'suggestion') dismissProposal(target.suggestion.proposal, today.value, report.value);
  else dismissPresenceMoment(target.moment);
  return true;
}

/** Steady/Direct — wording only, set explicitly by the person. */
export function setPresenceTone(tone: CoachTone): void {
  update(s => ({ ...s, coach: { ...s.coach, presence: { version: 1, tone, dismissed: s.coach.presence?.dismissed ?? [] } } }));
}
