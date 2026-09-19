/** Propose the schedule the user already keeps, so reminders and streaks can follow it. */
import type { Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { addDays } from '@/core/dates';
import type { Finding, LearnedDay, Proposal } from '../contract';
import type { BrainContext } from '../context';
import type { HabitModel } from '../detectors/habit';
import { proposal } from './shared';

export function planSchedule(ctx: BrainContext, model: HabitModel, habitFinding: Finding | undefined): Proposal | null {
  if (!habitFinding) return null;
  const days: Partial<Record<Weekday, LearnedDay | null>> = {};
  for (const wd of WEEKDAYS) {
    const learned = model.days[wd];
    const scheduled = ctx.schedule[wd];
    if (learned && !scheduled) {
      days[wd] = { splitId: learned.splitId, probability: learned.probability, startHour: learned.startHour, startMinute: learned.startMinute, spreadMinutes: learned.spreadMinutes };
      continue;
    }
    const detail = model.all[wd];
    if (scheduled && model.weeksObserved >= 8 && detail.count === 0) days[wd] = null;
  }
  if (!Object.keys(days).length) return null;
  return proposal({
    kind: 'schedule', subject: {}, apply: { kind: 'schedule', days },
    basedOn: [habitFinding.id], confidence: habitFinding.confidence, expiresOn: addDays(ctx.today, 7),
  });
}
