import type { Weekday } from '@/core/models';
import { addDays, formatDay, weekStart, weekdayOf } from '@/core/dates';
import { formatLoad } from '@/core/units';
import { MUSCLE_IDS, muscleLabel, type MuscleId } from '@/data/muscles';
import { isWorkingSet, weeklyMuscleSets } from '@/brain/exposure';
import { weeklyVolumeHistory } from '@/brain/weekly';
import type { BrainContext } from './context';
import { REVIEW_BASELINE_WEEKS, REVIEW_MIN_BASELINE_WEEKS, REVIEW_MIN_MUSCLE_DELTA, REVIEW_SIMILAR_RATIO } from './bands';
import { median, round1 } from './detectors/shared';

export interface WeekReview {
  start: string; end: string;
  workouts: number; activeDays: string[]; activeDayCount: number;
  sets: number; volumeKg: number;
  baselineWeeks: number; baselineSets: number | null; baselineVolumeKg: number | null;
  setsDelta: number | null; volumeDeltaKg: number | null;
  direction: 'more' | 'similar' | 'less' | 'insufficient';
  scheduledDays: number; alignedDays: number;
  scheduleBasis: 'current' | 'none';
  muscle: { id: MuscleId; sets: number; baselineSets: number; deltaSets: number } | null;
}

const validDay = (day: string): boolean => /^\d{4}-\d{2}-\d{2}$/.test(day)
  && !Number.isNaN(Date.parse(`${day}T00:00:00Z`)) && new Date(`${day}T00:00:00Z`).toISOString().slice(0, 10) === day;
const hasWork = (session: BrainContext['sessions'][number]): boolean => session.exercises.some(entry => entry.sets.some(isWorkingSet));

export function weekReview(ctx: BrainContext): WeekReview | null {
  const start = addDays(weekStart(ctx.today), -7);
  const end = addDays(start, 6);
  const unique = new Map<string, BrainContext['sessions'][number]>();
  for (const session of ctx.sessions) if (session.id && !unique.has(session.id) && validDay(session.day) && session.day <= end && hasWork(session)) unique.set(session.id, session);
  const sessions = [...unique.values()].sort((a, b) => a.startedAt.localeCompare(b.startedAt) || a.id.localeCompare(b.id));
  if (!sessions.length) return null;

  const history = weeklyVolumeHistory(sessions, end, REVIEW_BASELINE_WEEKS + 1);
  const closed = history[history.length - 1]!;
  const firstWorkingDay = sessions[0]!.day;
  const baseline = history.slice(0, -1).filter(row => row.start >= firstWorkingDay);
  const enough = baseline.length >= REVIEW_MIN_BASELINE_WEEKS;
  const baselineSets = enough ? round1(median(baseline.map(row => row.sets))) : null;
  const baselineVolumeKg = enough ? round1(median(baseline.map(row => row.volumeKg))) : null;
  const setsDelta = baselineSets === null ? null : round1(closed.sets - baselineSets);
  const volumeDeltaKg = baselineVolumeKg === null ? null : round1(closed.volumeKg - baselineVolumeKg);
  const direction: WeekReview['direction'] = baselineSets === null ? 'insufficient'
    : baselineSets === 0 ? (closed.sets > 0 ? 'more' : 'similar')
      : closed.sets > baselineSets * (1 + REVIEW_SIMILAR_RATIO) ? 'more'
        : closed.sets < baselineSets * (1 - REVIEW_SIMILAR_RATIO) ? 'less' : 'similar';

  const closedSessions = sessions.filter(session => session.day >= start && session.day <= end);
  const activeDays = [...new Set(closedSessions.map(session => session.day))].sort();
  const muscleRows = weeklyMuscleSets(sessions, end, REVIEW_BASELINE_WEEKS + 1, ctx.custom);
  const eligibleStarts = new Set(baseline.map(row => row.start));
  const baselineMuscles = muscleRows.slice(1).filter(row => eligibleStarts.has(row.week));
  let muscle: WeekReview['muscle'] = null;
  if (enough) for (const id of [...MUSCLE_IDS].sort()) {
    const sets = round1(muscleRows[0]?.sets[id] ?? 0);
    const base = round1(median(baselineMuscles.map(row => row.sets[id] ?? 0)));
    const delta = round1(sets - base);
    if (Math.abs(delta) < REVIEW_MIN_MUSCLE_DELTA) continue;
    if (!muscle || Math.abs(delta) > Math.abs(muscle.deltaSets)) muscle = { id, sets, baselineSets: base, deltaSets: delta };
  }

  const scheduled = (Object.entries(ctx.schedule) as Array<[Weekday, string | null]>)
    .filter(([, splitId]) => !!splitId && ctx.splits.some(split => split.id === splitId)).map(([day]) => day);
  const activeWeekdays = new Set(activeDays.map(weekdayOf));
  return {
    start, end, workouts: closedSessions.length, activeDays, activeDayCount: activeDays.length,
    sets: closed.sets, volumeKg: closed.volumeKg, baselineWeeks: baseline.length,
    baselineSets, baselineVolumeKg, setsDelta, volumeDeltaKg, direction,
    scheduledDays: scheduled.length, alignedDays: scheduled.filter(day => activeWeekdays.has(day)).length,
    scheduleBasis: scheduled.length ? 'current' : 'none', muscle,
  };
}

export function weekReviewCopy(review: WeekReview, unit: 'kg' | 'lb') {
  const title = `Last week · ${formatDay(review.start)}–${formatDay(review.end)}`;
  const summary = `${review.workouts} workouts on ${review.activeDayCount} days; ${review.sets} working sets.`;
  const detail = review.baselineSets === null || review.baselineVolumeKg === null
    ? 'A few more complete weeks are needed for a personal comparison.'
    : `Your prior ${review.baselineWeeks} complete weeks had a median of ${review.baselineSets} sets. ${formatLoad(review.volumeKg, unit)} total logged load × reps, compared with a prior median of ${formatLoad(review.baselineVolumeKg, unit)}.${review.muscle ? ` ${muscleLabel(review.muscle.id)}: ${review.muscle.sets} effective sets; prior median ${review.muscle.baselineSets}.` : ''}`;
  const schedule = review.scheduleBasis === 'current' ? `${review.alignedDays} of the ${review.scheduledDays} weekdays on your current schedule had logs last week. This compares with today's schedule.` : '';
  return { title, summary, detail, schedule };
}
