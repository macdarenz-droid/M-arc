/**
 * Weekly review (6.13 "weekly review" cadence): generated on the first app
 * open of a new week, once at least 5 days were logged in the window.
 * Each function below is one catalogue row; weeklyReviewInsights() assembles
 * the ones with enough evidence into Insight v2 objects.
 */
import type { Exercise, LoadUnit, Profile, Session, WeightEntry } from '@/core/models';
import { kgToDisplay } from '@/core/units';
import type { GoalId } from '@/data/goals';
import { GOAL_BY_ID } from '@/data/goals';
import { MUSCLE_IDS, muscleLabel, type MuscleId } from '@/data/muscles';
import { findExercise } from '@/core/exercises';
import { effectiveSetsByMuscle, isWorkingSet, ROLE_WEIGHT, rolesFor } from '../exposure';
import { exerciseHistory, isActive, modeOf, type ExerciseSessionSummary } from '../history';
import { sinceLastBreak, trend } from '../trend';
import { weekStart, addDays, daysBetween, weekdayOf } from '@/core/dates';
import type { Insight } from './rules';

/** Hard sets per muscle for the calendar week containing `today`: the shared count without easy sets (BR-16). */
export function hardSetsThisWeek(sessions: Session[], today: string, custom: Exercise[] = []): Partial<Record<MuscleId, number>> {
  const start = weekStart(today);
  return effectiveSetsByMuscle(sessions, start, addDays(start, 7), custom, { countEasy: false });
}

export type VolumeBand = 'low' | 'maintenance' | 'productive' | 'high';
export function volumeBand(hardSets: number): VolumeBand {
  if (hardSets < 4) return 'low';
  if (hardSets < 10) return 'maintenance';
  if (hardSets <= 20) return 'productive';
  return 'high';
}

/** Sessions with 2+ primary working sets for a muscle, within the calendar week. */
export function frequencyThisWeek(sessions: Session[], today: string, muscle: MuscleId, custom: Exercise[] = []): number {
  const start = weekStart(today);
  const end = addDays(start, 7);
  let count = 0;
  for (const s of sessions) {
    if (s.day < start || s.day >= end) continue;
    let primarySets = 0;
    for (const ex of s.exercises) {
      const meta = findExercise(ex.exerciseId, custom);
      if (!meta?.primary.includes(muscle)) continue;
      primarySets += ex.sets.filter(isWorkingSet).length;
    }
    if (primarySets >= 2) count++;
  }
  return count;
}

/** Share of working sets rated max, over the given sessions. */
export function failureShare(sessions: Session[]): number {
  const sets = sessions.flatMap(s => s.exercises.flatMap(e => e.sets)).filter(isWorkingSet);
  if (!sets.length) return 0;
  return sets.filter(s => s.effort === 'max').length / sets.length;
}

/** e1RM trend for one exercise, reusing the shared recency-weighted regression. */
export function e1rmTrend(hist: ExerciseSessionSummary[]) {
  return trend(hist.filter(h => h.bestE1rm > 0).map(h => ({ day: h.day, value: h.bestE1rm })));
}

/** Reference monthly progress rate by training age, from Appendix D. */
export function expectedMonthlyRatePct(trainingAgeMonths: number | null): [number, number] {
  if (trainingAgeMonths == null || trainingAgeMonths < 12) return [1, 4];
  if (trainingAgeMonths < 36) return [0.5, 1];
  return [0.2, 0.5];
}

/**
 * Flat means the e1RM moved less than 1.5% in total over the window (BR-04): the fitted
 * weekly slope times the weeks the window spans, not the weekly slope alone.
 */
export function flatOver(recent: ExerciseSessionSummary[]): boolean {
  if (recent.length < 2) return false;
  const t = e1rmTrend(recent);
  const spanWeeks = daysBetween(recent[0]!.day, recent[recent.length - 1]!.day) / 7;
  return t.direction !== 'unknown' && Math.abs(t.slopePerWeek * spanWeeks) < 0.015;
}

/** True once a lift's load, effort and e1RM have not moved over the last `weeks` weeks, with a session in most of them. */
export function isStale(hist: ExerciseSessionSummary[], today: string, weeks = 6): boolean {
  const recent = hist.filter(h => daysBetween(h.day, today) <= weeks * 7);
  if (recent.length < weeks) return false;
  const sameLoad = new Set(recent.map(r => r.topKg)).size <= 1;
  const effortOk = recent.every(r => r.hasMax || r.effortCoverage > 0);
  return sameLoad && effortOk && flatOver(recent);
}

/** Rolling adherence over the last `days` days: planned days done / planned days that have passed. */
export function adherenceRate(sessions: Session[], schedule: Record<string, string | null>, today: string, days = 28, daysOff: string[] = []): number | null {
  const doneDays = new Set(sessions.map(s => s.day));
  const off = new Set(daysOff);
  let planned = 0, done = 0;
  // Today only counts once it has a session: an unfinished planned day is not a miss yet (BR-15).
  for (let i = doneDays.has(today) ? 0 : 1; i < days; i++) {
    const day = addDays(today, -i);
    const weekday = weekdayOf(day);
    if (!schedule[weekday] || off.has(day)) continue;
    planned++;
    if (doneDays.has(day)) done++;
  }
  return planned > 0 ? done / planned : null;
}

/** Exponentially weighted moving average of a weight log, and its weekly rate as % of body weight. */
/**
 * The weigh-in trend (BR-14): a least-squares line through the last 28 days (7+ entries spanning
 * 14+ days), as % of the mean weight per week. `trendKg` is the line's value on the last day.
 * The old EWMA started at the first entry and lagged, so a real loss read as half of it.
 */
export function weightTrendPctPerWeek(log: WeightEntry[]): { trendKg: number; pctPerWeek: number } | null {
  const sorted = [...log].sort((a, b) => a.day.localeCompare(b.day));
  if (!sorted.length) return null;
  const lastDay = sorted[sorted.length - 1]!.day;
  const recent = sorted.filter(e => daysBetween(e.day, lastDay) < 28);
  if (recent.length < 7) return null;
  const xs = recent.map(e => daysBetween(recent[0]!.day, e.day));
  if (xs[xs.length - 1]! < 14) return null;
  const ys = recent.map(e => e.kg);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i]! - mx) * (ys[i]! - my); den += (xs[i]! - mx) ** 2; }
  if (!den || !my) return null;
  const slopePerDay = num / den;
  const trendKg = my + slopePerDay * (xs[n - 1]! - mx);
  const pctPerWeek = (slopePerDay * 7 / my) * 100;
  return { trendKg: Math.round(trendKg * 10) / 10, pctPerWeek: Math.round(pctPerWeek * 100) / 100 };
}

/** Share of main-lift working sets in each rep band, for the week. */
export function repMixShares(sessions: Session[], today: string, custom: Exercise[] = []): { low: number; mid: number; high: number; n: number; easyHighShare: number } {
  const start = weekStart(today);
  const end = addDays(start, 7);
  const sets = sessions
    .filter(s => s.day >= start && s.day < end)
    .flatMap(s => s.exercises.flatMap(e => (findExercise(e.exerciseId, custom)?.role === 'main' ? e.sets : [])))
    .filter(isWorkingSet)
    .filter(s => isWorkingSet(s) && (s.reps ?? 0) > 0);
  const n = sets.length;
  if (!n) return { low: 0, mid: 0, high: 0, n: 0, easyHighShare: 0 };
  const low = sets.filter(s => s.reps! <= 5).length / n;
  const mid = sets.filter(s => s.reps! >= 6 && s.reps! <= 12).length / n;
  const high = sets.filter(s => s.reps! >= 13).length / n;
  const easyHigh = sets.filter(s => s.reps! >= 13 && s.effort === 'easy').length;
  return { low, mid, high, n, easyHighShare: easyHigh / n };
}

export interface WeeklyReviewInput {
  sessions: Session[];
  today: string;
  custom: Exercise[];
  schedule: Record<string, string | null>;
  goal: GoalId;
  profile: Profile;
  weightLog: WeightEntry[];
  trainingAgeMonths: number | null;
  exerciseIds: Array<{ id: string; name: string }>;
  /** RG-19: days taken off count as unscheduled. */
  daysOff?: string[];
  /** QA-R3b-5: body weight in the person's unit. */
  unit?: LoadUnit;
}

/** Days logged in a calendar week before the weekly review appears. */
export const WEEKLY_REVIEW_DAYS = 5;

/** True once >=5 distinct days were logged within the calendar week containing `today`. */
export function weekHasEnoughData(sessions: Session[], today: string): boolean {
  const start = weekStart(today);
  const end = addDays(start, 7);
  const days = new Set(sessions.filter(s => s.day >= start && s.day < end).map(s => s.day));
  return days.size >= WEEKLY_REVIEW_DAYS || sessions.filter(s => s.day >= start && s.day < end).length >= WEEKLY_REVIEW_DAYS;
}

export function weeklyReviewInsights(input: WeeklyReviewInput, limit = 6): Insight[] {
  const { sessions, today, custom, schedule, goal, weightLog, trainingAgeMonths, exerciseIds } = input;
  const out: Insight[] = [];
  const start = weekStart(today);
  const weekSessions = sessions.filter(s => s.day >= start && s.day < addDays(start, 7));
  const g = GOAL_BY_ID[goal];

  // Sets per muscle vs band
  const hardSets = hardSetsThisWeek(sessions, today, custom);
  const trained = MUSCLE_IDS.filter(m => (hardSets[m] ?? 0) > 0).sort((a, b) => (hardSets[b] ?? 0) - (hardSets[a] ?? 0));
  if (trained.length && weekSessions.length >= 3) {
    const low = trained.filter(m => volumeBand(hardSets[m]!) === 'low');
    if (low.length) {
      const m = low[0]!;
      out.push({
        id: `weekly:volume:${m}`, category: 'consistency', priority: 220, cadence: 'weekly', kind: 'plan',
        title: `${muscleLabel(m)} is under its usual range`,
        noticed: `${trained.map(x => `${muscleLabel(x)} ${Math.round(hardSets[x]!)}`).join(', ')} hard sets this week.`,
        means: `${muscleLabel(m)} sits under the range that tends to drive growth for most lifters.`,
        action: `Add one more hard set for ${muscleLabel(m).toLowerCase()} on your next session that trains it.`,
        muscle: m,
        evidence: { n: weekSessions.length, window: 'this week', confidence: weekSessions.length >= 4 ? 'medium' : 'low' },
      });
    }
  }

  // Frequency per muscle (strength goal: goal lift with high weekly sets but freq 1)
  for (const m of trained) {
    const freq = frequencyThisWeek(sessions, today, m, custom);
    const sets = hardSets[m] ?? 0;
    const threshold = g.id === 'strength' ? 8 : 12;
    if (freq === 1 && sets >= threshold) {
      out.push({
        id: `weekly:frequency:${m}`, category: 'consistency', priority: 180, cadence: 'weekly', kind: 'tip',
        title: `${muscleLabel(m)} all landed on one day`,
        noticed: `All ${Math.round(sets)} ${muscleLabel(m).toLowerCase()} sets this week were in a single session.`,
        means: 'Splitting the same volume across two sessions usually keeps set quality higher late in the session.',
        action: `Move some ${muscleLabel(m).toLowerCase()} work to a second day next week.`,
        muscle: m,
        evidence: { n: 1, window: 'this week', confidence: 'low' },
      });
      break;
    }
  }

  // Failure share
  const fShare = failureShare(weekSessions);
  const workingCount = weekSessions.flatMap(s => s.exercises.flatMap(e => e.sets)).filter(isWorkingSet).length;
  if (workingCount >= 12 && fShare > 0.5) {
    out.push({
      id: 'weekly:failure-share', category: 'progress', priority: 170, cadence: 'weekly', kind: 'tip',
      title: `About ${Math.round(fShare * 100)}% of sets were max effort`,
      noticed: `${Math.round(fShare * 100)}% of your working sets this week were rated max.`,
      means: 'Training to failure adds at most a little extra growth and no extra strength, for a lot more fatigue.',
      action: 'Save max effort for the last set of an exercise, not every set.',
      evidence: { n: workingCount, window: 'this week', confidence: 'medium' },
    });
  }

  // e1RM trend and progress vs training age, and staleness, per exercise the user actually does
  for (const { id, name } of exerciseIds) {
    // QA2-FC-2: a comeback is judged only on the sessions since the break, as in plateauStatus.
    const hist = sinceLastBreak(exerciseHistory(sessions, id, custom));
    if (hist.length < 4 || !isActive(hist, today)) continue;
    // e1RM says nothing for assisted, body-weight or timed work (BR-06).
    if (modeOf(id, custom) !== 'weighted') continue;
    const t = e1rmTrend(hist);
    if (t.direction === 'unknown') continue;
    const meta = findExercise(id, custom);
    if (meta?.role !== 'main') continue;

    if (t.confidence !== 'low') {
      const pctPerWeek = Math.round(t.slopePerWeek * 1000) / 10;
      out.push({
        id: `weekly:e1rm:${id}`, category: 'progress', priority: 200, cadence: 'weekly', kind: 'progress', exerciseId: id,
        title: `${name}: ${t.direction === 'up' ? 'rising' : t.direction === 'down' ? 'falling' : 'flat'}`,
        noticed: t.direction === 'flat' ? `${name} has not moved in recent sessions.` : `${name} is trending ${t.direction} at about ${Math.abs(pctPerWeek)}% a week.`,
        means: t.direction === 'up' ? 'Keep doing what you are doing.' : t.direction === 'down' ? 'Worth a lighter week before pushing again.' : 'The stimulus has stopped changing.',
        action: t.direction === 'up' ? 'No change needed.' : t.direction === 'down' ? 'Ease off max effort for a week, then rebuild.' : 'Add a set, add load, or change the rep range for two weeks.',
        evidence: { n: hist.length, window: `${hist.length} sessions`, confidence: t.confidence },
      });

      const [lo, hi] = expectedMonthlyRatePct(trainingAgeMonths);
      const pctPerMonth = pctPerWeek * 4.33;
      // BR-13: a pace comparison only makes sense for a lift that is actually rising.
      if (t.direction === 'up' && t.confidence === 'high' && hist.length >= 6) {
        const pace = pctPerMonth > hi ? 'faster than typical' : pctPerMonth < lo && pctPerMonth >= 0 ? 'slower than typical' : 'a typical pace';
        out.push({
          id: `weekly:pace:${id}`, category: 'progress', priority: 190, cadence: 'weekly', kind: 'data', exerciseId: id,
          title: `${name}: ${pace} for your training age`,
          noticed: `${name} e1RM is moving about ${Math.abs(pctPerMonth).toFixed(1)}% a month.`,
          means: `That is ${pace} compared with lifters at a similar training age (about ${lo} to ${hi}% a month).`,
          action: pace === 'a typical pace' ? 'Keep the current approach.' : 'No change needed either way; expect the rate to settle over time.',
          evidence: { n: hist.length, window: `${hist.length} sessions`, confidence: 'medium' },
        });
      }
    }

    if (isStale(hist, today)) {
      out.push({
        id: `weekly:stale:${id}`, category: 'progress', priority: 160, cadence: 'weekly', kind: 'tip', exerciseId: id,
        title: `${name}: same load for weeks`,
        noticed: `${name} has used the same load for 6 sessions running.`,
        means: 'Nothing about the stimulus has changed, so progress has nowhere to come from.',
        action: 'Add a rep, add load, or swap in a similar exercise for a block.',
        evidence: { n: 6, window: '6 sessions', confidence: 'medium' },
      });
    }
  }

  // Adherence
  const adherence = adherenceRate(sessions, schedule, today, 28, input.daysOff ?? []);
  if (adherence != null) {
    if (adherence < 0.6) {
      out.push({
        id: 'weekly:adherence', category: 'consistency', priority: 210, cadence: 'weekly', kind: 'plan',
        title: 'Fewer planned sessions than usual',
        noticed: `${Math.round(adherence * 100)}% of planned sessions over the last 4 weeks.`,
        means: 'A schedule that keeps getting missed is a scheduling problem, not a willpower one.',
        action: 'Worth moving the hardest day to a slot that keeps working, even if it means fewer days.',
        evidence: { n: 28, window: 'last 4 weeks', confidence: 'medium' },
      });
    } else if (adherence >= 0.85) {
      out.push({
        id: 'weekly:adherence-good', category: 'consistency', priority: 140, cadence: 'weekly', kind: 'praise',
        title: 'Sticking to the plan',
        noticed: `${Math.round(adherence * 100)}% of planned sessions over the last 4 weeks.`,
        means: 'Consistency is doing most of the work here.',
        action: 'Keep going.',
        evidence: { n: 28, window: 'last 4 weeks', confidence: 'medium' },
      });
    }
  }

  // Rep-range mix vs goal
  const mix = repMixShares(sessions, today, custom);
  if (mix.n >= 8) {
    if (g.id === 'strength' && mix.low < 0.15) {
      out.push({
        id: 'weekly:rep-mix', category: 'progress', priority: 150, cadence: 'weekly', kind: 'tip',
        title: 'Few heavy sets this week',
        noticed: `Only ${Math.round(mix.low * 100)}% of main-lift sets were 1 to 5 reps.`,
        means: 'Heavy sets are what drives 1RM most directly for a strength goal.',
        action: 'Add one 3 to 5 rep top set on each main lift.',
        evidence: { n: mix.n, window: 'this week', confidence: 'medium' },
      });
    } else if (g.id !== 'strength' && g.id !== 'strength_muscle' && mix.high > 0.7 && mix.easyHighShare / Math.max(mix.high, 0.001) > 0.5) {
      out.push({
        id: 'weekly:rep-mix', category: 'progress', priority: 150, cadence: 'weekly', kind: 'tip',
        title: 'Mostly high-rep, easy sets this week',
        noticed: `${Math.round(mix.high * 100)}% of main-lift sets were 13+ reps, and most of those were rated easy.`,
        means: 'High reps work fine for growth, but sets need to be closer to effort to count fully.',
        action: 'Push the last set or two of each main lift closer to ideal or max effort.',
        evidence: { n: mix.n, window: 'this week', confidence: 'medium' },
      });
    }
  }

  // Body-weight trend vs goal
  const wt = weightTrendPctPerWeek(weightLog);
  if (wt) {
    const [lo, hi] = g.weightRatePctPerWeek ?? [-1, 1];
    const dir = wt.pctPerWeek < 0 ? 'down' : wt.pctPerWeek > 0 ? 'up' : 'flat';
    const inRange = wt.pctPerWeek >= Math.min(lo, hi) && wt.pctPerWeek <= Math.max(lo, hi);
    out.push({
      id: 'weekly:weight-trend', category: 'data', priority: 130, cadence: 'weekly', kind: inRange ? 'praise' : 'tip',
      title: `Trend weight ${Math.round(kgToDisplay(wt.trendKg, input.unit ?? 'kg') * 10) / 10} ${input.unit ?? 'kg'}, ${dir} ${Math.abs(wt.pctPerWeek)}% a week`,
      noticed: `Weight trend is ${dir} about ${Math.abs(wt.pctPerWeek)}% a week.`,
      means: inRange ? `That is inside the range that fits a ${g.name.toLowerCase()} goal.` : `That is outside the usual range for a ${g.name.toLowerCase()} goal (${lo} to ${hi}% a week).`,
      action: inRange ? 'No change needed.' : 'Worth a small adjustment to food if this keeps up for a few more weeks.',
      evidence: { n: weightLog.length, window: 'recent weigh-ins', confidence: weightLog.length >= 14 ? 'medium' : 'low' },
    });
  }

  return out.sort((a, b) => b.priority - a.priority).slice(0, limit);
}
