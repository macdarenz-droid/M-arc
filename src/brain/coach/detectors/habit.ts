/**
 * When does this person actually train? Per-weekday probability and typical
 * start time over the last twelve weeks, recent weeks weighted more, with
 * cold days retired. Rests on habit_formation_and_cues.
 */
import type { Session, Split, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { addDays, daysBetween, weekStart, weekdayOf } from '@/core/dates';
import type { Finding, LearnedDay } from '../contract';
import type { BrainContext } from '../context';
import { HABIT_COLD_WEEKS, HABIT_HALF_LIFE_WEEKS, HABIT_MIN_COUNT, HABIT_MIN_PROBABILITY, HABIT_WINDOW_WEEKS, MIN_WEEKS_OF_DATA } from '../bands';
import { evidenceFrom, finding, quantile, round2, weeksOfData } from './shared';

export interface HabitDay extends LearnedDay {
  count: number;
  /** Weight-normalised probability over the older part of the window only. */
  olderProbability: number;
  recentCount: number;
}

export interface HabitModel {
  weeksObserved: number;
  /** Days that clear the probability and count gates and are not cold. */
  days: Partial<Record<Weekday, HabitDay>>;
  /** Days that used to be habitual and have gone cold. */
  retired: Weekday[];
  /** Mean training days per week over the last eight complete weeks. */
  sessionsPerWeek: number;
  /** Per-weekday detail for every weekday, gated or not. */
  all: Record<Weekday, HabitDay>;
}

/** Minutes after local midnight the session started. */
export function minutesOfDay(iso: string): number {
  const d = new Date(iso);
  return d.getHours() * 60 + d.getMinutes();
}

function weightedMedian(values: Array<{ v: number; w: number }>): number {
  if (!values.length) return 0;
  const s = [...values].sort((a, b) => a.v - b.v);
  const total = s.reduce((a, x) => a + x.w, 0);
  let acc = 0;
  for (const x of s) { acc += x.w; if (acc >= total / 2) return x.v; }
  return s[s.length - 1]!.v;
}

export function learnHabits(sessions: Session[], splits: Split[], today: string): HabitModel {
  const empty = (): HabitDay => ({ splitId: null, probability: 0, startHour: 0, startMinute: 0, spreadMinutes: 0, count: 0, olderProbability: 0, recentCount: 0 });
  const all = Object.fromEntries(WEEKDAYS.map(d => [d, empty()])) as Record<Weekday, HabitDay>;
  const model: HabitModel = { weeksObserved: 0, days: {}, retired: [], sessionsPerWeek: 0, all };
  const first = sessions[0]?.day;
  if (!first) return model;
  const byDay = new Map<string, Session[]>();
  for (const s of sessions) byDay.set(s.day, [...(byDay.get(s.day) ?? []), s]);
  const weeks = Math.min(HABIT_WINDOW_WEEKS, weeksOfData(sessions, today));
  model.weeksObserved = weeks;
  const start = weekStart(today);
  const splitIds = new Set(splits.map(s => s.id));
  const num: Record<string, number> = {}, den: Record<string, number> = {}, oldNum: Record<string, number> = {}, oldDen: Record<string, number> = {};
  const starts: Record<string, Array<{ v: number; w: number }>> = {};
  const splitVotes: Record<string, Map<string, number>> = {};
  let trainedDaysLast8 = 0, weeksLast8 = 0;
  for (let k = 0; k < weeks; k++) {
    const monday = addDays(start, -7 * k);
    const w = 0.5 ** (k / HABIT_HALF_LIFE_WEEKS);
    if (k >= 1 && k <= 8) weeksLast8++;
    for (let i = 0; i < 7; i++) {
      const date = addDays(monday, i);
      // Today is left out: the session may still happen later today.
      if (date >= today || date < first) continue;
      const wd = weekdayOf(date);
      den[wd] = (den[wd] ?? 0) + w;
      // "Recent" is the current partial week plus the last HABIT_COLD_WEEKS complete weeks.
      if (k > HABIT_COLD_WEEKS) oldDen[wd] = (oldDen[wd] ?? 0) + w;
      const list = byDay.get(date);
      if (!list?.length) continue;
      num[wd] = (num[wd] ?? 0) + w;
      all[wd].count++;
      if (k <= HABIT_COLD_WEEKS) all[wd].recentCount++;
      else oldNum[wd] = (oldNum[wd] ?? 0) + w;
      if (k >= 1 && k <= 8) trainedDaysLast8++;
      for (const s of list) {
        (starts[wd] ??= []).push({ v: minutesOfDay(s.startedAt), w });
        if (splitIds.has(s.splitId)) {
          const votes = (splitVotes[wd] ??= new Map());
          votes.set(s.splitId, (votes.get(s.splitId) ?? 0) + w);
        }
      }
    }
  }
  for (const wd of WEEKDAYS) {
    const d = all[wd];
    d.probability = den[wd] ? round2((num[wd] ?? 0) / den[wd]!) : 0;
    d.olderProbability = oldDen[wd] ? round2((oldNum[wd] ?? 0) / oldDen[wd]!) : 0;
    const st = starts[wd] ?? [];
    const med = weightedMedian(st);
    d.startHour = Math.floor(med / 60);
    d.startMinute = Math.round(med % 60);
    const raw = st.map(x => x.v);
    d.spreadMinutes = raw.length >= 2 ? Math.round(quantile(raw, 0.75) - quantile(raw, 0.25)) : 0;
    const votes = splitVotes[wd];
    if (votes) d.splitId = [...votes.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]![0];
    const cold = d.olderProbability >= HABIT_MIN_PROBABILITY && d.count >= 3 && d.recentCount === 0 && weeks > HABIT_COLD_WEEKS && daysBetween(first, today) >= 7 * (HABIT_COLD_WEEKS + 3);
    if (cold) model.retired.push(wd);
    else if (d.probability >= HABIT_MIN_PROBABILITY && d.count >= HABIT_MIN_COUNT) model.days[wd] = d;
  }
  model.sessionsPerWeek = weeksLast8 ? round2(trainedDaysLast8 / weeksLast8) : 0;
  return model;
}

export const pad2 = (n: number): string => String(n).padStart(2, '0');

export function detectHabit(ctx: BrainContext, model = learnHabits(ctx.sessions, ctx.splits, ctx.today)): Finding[] {
  if (weeksOfData(ctx.sessions, ctx.today) < MIN_WEEKS_OF_DATA) return [];
  const days = Object.keys(model.days) as Weekday[];
  if (!days.length && !model.retired.length) return [];
  const metrics: Finding['metrics'] = {
    days: days.join(','), retired: model.retired.join(','), weeksObserved: model.weeksObserved, sessionsPerWeek: model.sessionsPerWeek,
  };
  let minProb = 1;
  for (const wd of days) {
    const d = model.days[wd]!;
    minProb = Math.min(minProb, d.probability);
    metrics[`${wd}_probability`] = d.probability;
    metrics[`${wd}_start`] = `${pad2(d.startHour)}:${pad2(d.startMinute)}`;
    metrics[`${wd}_spreadMinutes`] = d.spreadMinutes;
    metrics[`${wd}_count`] = d.count;
    if (d.splitId) metrics[`${wd}_splitId`] = d.splitId;
  }
  const from = addDays(weekStart(ctx.today), -7 * (model.weeksObserved - 1));
  const recent = ctx.sessions.filter(s => s.day >= from);
  return [finding({
    kind: 'habit_pattern', target: 'week', subject: {}, metrics,
    from, to: ctx.today, weeks: model.weeksObserved,
    confidence: model.weeksObserved >= 10 && minProb >= 0.75 && days.length > 0 ? 'high' : 'medium',
    severity: 0, evidence: evidenceFrom(recent),
  })];
}
