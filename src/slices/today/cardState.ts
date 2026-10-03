/** BUG-38: the Today session card's state, from the plan (D-BUG38). Pure, so it is tested without rendering. */
import type { Split } from '@/core/models';
import { WEEKDAY_LABEL, weekdayOf } from '@/core/dates';
import type { SplitPlan } from '@/brain/splitPlan';

export type CardStatus = 'live' | 'done' | 'ready' | 'off' | 'early' | 'rest';
export interface CardState { status: CardStatus; eyebrow: string; split?: Split }

export function sessionCardState({ live, doneCount, plan }: { live: boolean; doneCount: number; plan: SplitPlan }): CardState {
  if (live) return { status: 'live', eyebrow: 'Session in progress' };
  if (doneCount > 0) return { status: 'done', eyebrow: 'Today' };
  const t = plan.today;
  if (t?.off) return { status: 'off', eyebrow: 'Day off', split: t.split };
  if (t) return { status: 'ready', eyebrow: t.movedFrom ? `Moved from ${WEEKDAY_LABEL[weekdayOf(t.movedFrom)]}` : 'Scheduled today', split: t.split };
  if (plan.doneEarly) return { status: 'early', eyebrow: `Done ${WEEKDAY_LABEL[weekdayOf(plan.doneEarly.on)]}`, split: plan.doneEarly.split };
  return { status: 'rest', eyebrow: 'Rest day' };
}
