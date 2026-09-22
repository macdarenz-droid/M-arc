import { update } from '@/core/store';
import { todayKey, addDays } from '@/core/dates';
import type { InsightFeedback } from '@/core/models';

/** F3.6: "Helpful" just records interest; "snoozed" hides the insight for 7 days (coachInsights filters it). Newest last, capped at 200 (matches AppState.insightFeedback's own cap). */
export function saveInsightFeedback(id: string, verdict: InsightFeedback['verdict']): void {
  update(s => ({ ...s, insightFeedback: [...s.insightFeedback, { id, day: todayKey(), verdict }].slice(-200) }));
}

/** F3.3: accept the coach's "take a lighter week" offer. Reads as active for 7 days from today; closes itself once endDay passes (deloadOffer/suggestNext both gate on it, no separate cleanup needed). */
export function acceptDeload(reason: string): void {
  const startDay = todayKey();
  update(s => ({ ...s, deload: { startDay, endDay: addDays(startDay, 6), reason, setFactor: 0.6, loadFactor: 0.9 } }));
}
