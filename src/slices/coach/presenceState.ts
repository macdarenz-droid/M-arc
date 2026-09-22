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

/** Steady/Direct — wording only, set explicitly by the person. */
export function setPresenceTone(tone: CoachTone): void {
  update(s => ({ ...s, coach: { ...s.coach, presence: { version: 1, tone, dismissed: s.coach.presence?.dismissed ?? [] } } }));
}
