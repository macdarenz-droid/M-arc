import { signal } from '@preact/signals';
import type { Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { state } from '@/core/store';
import { syncTrainingReminders, type ReminderHealth, type ReminderOptions } from '@/native/notifications';
import { HABIT_NUDGE_LEAD_MINUTES } from '@/brain/coach/bands';
import { clock, nudgeBody } from '@/brain/coach/words';

export const reminderHealth = signal<ReminderHealth>({ status: 'Not checked yet', queued: 0, ok: true });

/** An hour before a learned HH:MM start, never earlier than 05:00. */
export function nudgeTime(start: string): string {
  const [h, m] = start.split(':').map(Number);
  const total = Math.max(5 * 60, (h ?? 17) * 60 + (m ?? 30) - HABIT_NUDGE_LEAD_MINUTES);
  return clock(Math.floor(total / 60), total % 60);
}

/** Smart reminders follow the start times learned from history, for the days that have one. */
export function smartReminderOptions(learnedStarts: Partial<Record<Weekday, string>>, enabled: boolean): ReminderOptions {
  if (!enabled) return {};
  const timeByDay: Partial<Record<Weekday, string>> = {};
  for (const d of WEEKDAYS) { const s = learnedStarts[d]; if (s) timeByDay[d] = nudgeTime(s); }
  if (!Object.keys(timeByDay).length) return {};
  return {
    timeByDay,
    body: (split, day) => {
      const s = learnedStarts[day];
      if (!s) return nudgeBody(split);
      const [h, m] = s.split(':').map(Number);
      return nudgeBody(split, day, { hour: h ?? 17, minute: m ?? 30 });
    },
  };
}

/** Re-schedule reminders from the current preference and schedule. Safe to call often. */
export async function resyncReminders(): Promise<void> {
  const s = state.value;
  const completed = new Set(s.sessions.map(x => x.day));
  const opts = smartReminderOptions(s.coach.learnedStarts, s.coach.smartReminders);
  reminderHealth.value = await syncTrainingReminders(s.preferences.reminders, s.schedule, id => s.splits.find(sp => sp.id === id)?.name ?? 'Training', completed, opts);
}
