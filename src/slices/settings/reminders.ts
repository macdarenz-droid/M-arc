import { signal } from '@preact/signals';
import { state } from '@/core/store';
import { syncTrainingReminders, type ReminderHealth } from '@/native/notifications';
import { readinessSummaryText } from '@/brain/readiness';
import { todayReadiness } from '@/app/selectors';

export const reminderHealth = signal<ReminderHealth>({ status: 'Not checked yet', queued: 0, ok: true });

/**
 * Re-schedule reminders from the current preference and schedule. Safe to call often.
 * F3.8: today's readiness (the only day resync can actually know) feeds today's body text
 * when the readiness-summary toggle is on; every day beyond today keeps the plain body.
 */
export async function resyncReminders(): Promise<void> {
  const s = state.value;
  // A day taken off gets no training reminder either (RG-19).
  const completed = new Set([...s.sessions.map(x => x.day), ...s.daysOff]);
  const r = todayReadiness.value;
  reminderHealth.value = await syncTrainingReminders(s.preferences.reminders, s.schedule, id => s.splits.find(sp => sp.id === id)?.name ?? 'Training', completed, r ? readinessSummaryText(r) : null);
}
