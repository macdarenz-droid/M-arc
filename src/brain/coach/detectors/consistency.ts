/** Gaps, the very beginning, and changes in logged training weekdays. */
import { daysSinceLastSession, trainingDaysPerWeek } from '../../weekly';
import { WEEKDAYS, type Weekday } from '@/core/models';
import { weekdayOf } from '@/core/dates';
import { isWorkingSet } from '../../exposure';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { DRIFT_DEST_MIN_WEEKS, DRIFT_DEST_SPLIT_WEEKS, DRIFT_HALF_WEEKS, DRIFT_MAX_RECENT, DRIFT_MIN_DROP, DRIFT_MIN_OLDER, DRIFT_WINDOW_WEEKS, FIRST_SESSIONS_COUNT, LONG_GAP_DAYS, REENTRY_GAP_DAYS } from '../bands';
import { evidenceFrom, finding } from './shared';
import type { HabitModel } from './habit';

export function detectGap(ctx: BrainContext): Finding[] {
  const gap = daysSinceLastSession(ctx.sessions, ctx.today);
  if (gap == null || gap < LONG_GAP_DAYS) return [];
  const last = ctx.sessions[ctx.sessions.length - 1]!;
  return [finding({
    kind: 'long_gap', target: 'last', subject: {},
    metrics: { days: gap, reentry: gap > REENTRY_GAP_DAYS, lastDay: last.day },
    from: last.day, to: ctx.today, confidence: 'high', severity: 1, evidence: evidenceFrom([last]),
  })];
}

export function detectFirstSessions(ctx: BrainContext): Finding[] {
  if (ctx.sessions.length >= FIRST_SESSIONS_COUNT) return [];
  return [finding({
    kind: 'first_sessions', target: 'baseline', subject: {},
    metrics: { sessions: ctx.sessions.length, needed: FIRST_SESSIONS_COUNT },
    from: ctx.sessions[0]?.day ?? ctx.today, to: ctx.today, confidence: 'high', severity: 0,
    evidence: evidenceFrom(ctx.sessions),
  })];
}

const working = (ctx: BrainContext) => ctx.sessions.filter(session => session.exercises.some(exercise => exercise.sets.some(isWorkingSet)));

export function consistencyDestination(ctx: BrainContext, source: Weekday, model: HabitModel): { day: Weekday; weeks: number; splitWeeks: number } | null {
  const splitId = ctx.schedule[source];
  if (!splitId || !ctx.splits.some(split => split.id === splitId)) return null;
  const recent = trainingDaysPerWeek(ctx.sessions, ctx.today, DRIFT_HALF_WEEKS);
  const sessions = working(ctx);
  const candidates = WEEKDAYS.filter(day => day !== source && !ctx.schedule[day]).map(day => {
    let weeks = 0, splitWeeks = 0;
    for (const week of recent) {
      const rows = sessions.filter(session => session.day >= week.from && session.day <= week.to && weekdayOf(session.day) === day);
      if (rows.length) weeks++;
      if (rows.some(session => session.splitId === splitId)) splitWeeks++;
    }
    return { day, weeks, splitWeeks };
  }).filter(row => row.weeks >= DRIFT_DEST_MIN_WEEKS && row.splitWeeks >= DRIFT_DEST_SPLIT_WEEKS && model.days[row.day]?.splitId === splitId);
  return candidates.sort((a, b) => b.splitWeeks - a.splitWeeks || b.weeks - a.weeks || WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day))[0] ?? null;
}

export function detectConsistencyDrift(ctx: BrainContext, model?: HabitModel): Finding[] {
  const weeks = trainingDaysPerWeek(ctx.sessions, ctx.today, DRIFT_WINDOW_WEEKS);
  if (weeks.length !== DRIFT_WINDOW_WEEKS) return [];
  const valid = working(ctx).filter(session => session.day <= ctx.today);
  if (!valid.some(session => session.day <= weeks[0]!.from)) return [];
  const older = weeks.slice(0, DRIFT_HALF_WEEKS), recent = weeks.slice(DRIFT_HALF_WEEKS);
  const candidates = WEEKDAYS.map(day => {
    const olderCount = older.filter(week => week.days.includes(day)).length;
    const recentCount = recent.filter(week => week.days.includes(day)).length;
    return { day, olderCount, recentCount, drop: olderCount - recentCount };
  }).filter(row => row.olderCount >= DRIFT_MIN_OLDER && row.recentCount <= DRIFT_MAX_RECENT && row.drop >= DRIFT_MIN_DROP)
    .sort((a, b) => b.drop - a.drop || b.olderCount - a.olderCount || WEEKDAYS.indexOf(a.day) - WEEKDAYS.indexOf(b.day));
  const best = candidates[0];
  if (!best) return [];
  const metrics: Finding['metrics'] = {
    weekday: best.day, olderCount: best.olderCount, recentCount: best.recentCount,
    olderWeeks: DRIFT_HALF_WEEKS, recentWeeks: DRIFT_HALF_WEEKS, dropCount: best.drop,
    olderFrom: older[0]!.from, olderTo: older.at(-1)!.to, recentFrom: recent[0]!.from, recentTo: recent.at(-1)!.to,
  };
  if (model) {
    const destination = consistencyDestination(ctx, best.day, model);
    if (destination) Object.assign(metrics, { destinationWeekday: destination.day, destinationCount: destination.weeks, destinationSplitCount: destination.splitWeeks });
  }
  const evidence = valid.filter(session => session.day >= weeks[0]!.from && session.day <= weeks.at(-1)!.to && weekdayOf(session.day) === best.day);
  return [finding({ kind: 'consistency_drift', target: best.day, subject: {}, metrics, from: weeks[0]!.from, to: weeks.at(-1)!.to, weeks: DRIFT_WINDOW_WEEKS,
    confidence: best.olderCount >= 7 && best.recentCount <= 2 ? 'high' : 'medium', severity: 1, evidence: evidenceFrom(evidence) })];
}
