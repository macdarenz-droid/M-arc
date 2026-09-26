/**
 * Daily readiness (F2.1, 6.4): a 0-100 score from whichever inputs actually
 * exist today, self-report leading over sensors. Missing inputs renormalise
 * the weights; they never count as zero. Never produces a score from zero
 * inputs — returns null and the UI says so.
 */
import type { CheckIn, DailyHealth, Exercise, Session, Split, Weekday } from '@/core/models';
import type { MuscleId } from '@/data/muscles';
import type { MuscleRecovery } from './recovery';
import { acuteChronicRatio, avg, stddev, clamp } from './recovery';
import { daysBetween, trainedToday, WEEKDAY_LABEL } from '@/core/dates';
import { findExercise } from '@/core/exercises';

function withinDays(day: string, today: string, days: number): boolean {
  const d = daysBetween(day, today);
  return d >= 0 && d < days;
}

function median(xs: number[]): number | null {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s[Math.floor(s.length / 2)]!;
}

export interface ReadinessBaselines {
  restingHr7d: number | null;
  restingHr28d: number | null;
  restingHr28dSd: number | null;
  sleep14dMedian: number | null;
  lnRmssd7dMean: number | null;
  lnRmssd7dSd: number | null;
  /** Coefficient of variation of the 7-day lnRMSSD window, |sd/mean|. */
  cv: number | null;
}

export function readinessBaselines(healthDays: DailyHealth[], today: string): ReadinessBaselines {
  const rhr7 = healthDays.filter(d => withinDays(d.day, today, 7) && d.restingHr != null).map(d => d.restingHr!);
  const rhr28 = healthDays.filter(d => withinDays(d.day, today, 28) && d.restingHr != null).map(d => d.restingHr!);
  const sleep14 = healthDays.filter(d => withinDays(d.day, today, 14) && d.sleepMinutes != null).map(d => d.sleepMinutes!);
  const lnRmssd7 = healthDays.filter(d => withinDays(d.day, today, 7) && d.lnRmssd != null).map(d => d.lnRmssd!);
  const lnMean = lnRmssd7.length ? avg(lnRmssd7) : null;
  return {
    restingHr7d: rhr7.length ? avg(rhr7) : null,
    restingHr28d: rhr28.length ? avg(rhr28) : null,
    restingHr28dSd: rhr28.length >= 2 ? stddev(rhr28) : null,
    sleep14dMedian: median(sleep14),
    lnRmssd7dMean: lnMean,
    lnRmssd7dSd: lnRmssd7.length >= 2 ? stddev(lnRmssd7) : null,
    cv: lnRmssd7.length >= 2 && lnMean ? Math.abs(stddev(lnRmssd7) / lnMean) : null,
  };
}

/** A value's z-score against a series, or null when there isn't enough of the user's own history (n<3) to mean anything. */
function zScore(value: number, series: number[]): number | null {
  if (series.length < 3) return null;
  const sd = stddev(series);
  if (sd <= 0) return 0;
  return (value - avg(series)) / sd;
}

/** How much each input counts toward the score; missing inputs are left out and the rest renormalised. */
export const READINESS_WEIGHTS = { checkIn: 0.35, sleep: 0.25, recovery: 0.15, rhr: 0.10, hrv: 0.10, load: 0.05 } as const;
export const READINESS_GREEN_AT = 67;
export const READINESS_RED_AT = 33;
/** Under this many days of check-ins and sleep, the score reads as calibrating. */
export const READINESS_CALIBRATING_DAYS = 14;

export type LoadAdvice = 'normal' | 'no_increase' | 'reduce';
export type ReadinessBand = 'green' | 'amber' | 'red';

export interface ReadinessResult {
  score: number;
  band: ReadinessBand;
  confidence: 'low' | 'medium' | 'high';
  loadAdvice: LoadAdvice;
  drivers: string[];
  /** Fewer than 14 days of check-ins or sleep history: the score exists but should read as provisional. */
  calibrating: boolean;
  /**
   * QA8-2: set only once today's session is already done (trainedToday). Ready-to-show prose —
   * "Today's session is done..." — so callers (Today card, brief, readinessSummaryText) don't each
   * invent their own pre-workout-vs-done wording. Left out (undefined) otherwise, so the rest of
   * this result stays byte-identical to before this field existed.
   */
  postSessionAdvice?: string;
}

export interface ReadinessInput {
  today: string;
  /** QA8-2/QA8-4: for the shared trainedToday check. */
  now: number;
  healthDays: DailyHealth[];
  /** Today's check-in, if any. */
  checkIn?: CheckIn;
  /** Past check-ins. readiness() itself keeps only the 30 days before `today` (today excluded), so callers may pass the whole list (BR-03). */
  checkInHistory: CheckIn[];
  /** Recovery status for every muscle, from recoveryStatus() (6.11). */
  recovery: MuscleRecovery[];
  scheduledSplit?: Split;
  /** QA8-2: the next scheduled split after today, once today's own session is done. Null/undefined reads as "nothing scheduled soon". */
  next?: { split: Split; weekday: Weekday } | null;
  custom: Exercise[];
  sessions: Session[];
}

/** The scheduled split's primary muscles. Empty when nothing is scheduled — there is no "today's target muscle" to speak of, and falling back to every muscle would pad the recovery/soreness subscores with untrained muscles sitting at 100%. */
function targetMuscles(split: Split | undefined, custom: Exercise[]): MuscleId[] {
  if (!split) return [];
  const set = new Set<MuscleId>();
  for (const se of split.exercises) findExercise(se.exerciseId, custom)?.primary.forEach(m => set.add(m));
  return [...set];
}

interface Weighted { key: string; weight: number; score: number | null; }

export function readiness(input: ReadinessInput): ReadinessResult | null {
  const { today, healthDays, checkIn, recovery, scheduledSplit, custom, sessions } = input;
  const checkInHistory = input.checkInHistory.filter(c => { const d = daysBetween(c.day, today); return d > 0 && d <= 30; });
  const baselines = readinessBaselines(healthDays, today);
  // QA8-2: once today's own session is done, "today's target muscles" means the NEXT scheduled
  // split's, not the one already trained — advice about "today" no longer makes sense otherwise.
  const isDoneToday = trainedToday(sessions, today, input.now);
  const next = input.next ?? null;
  const activeSplit = isDoneToday ? next?.split : scheduledSplit;
  const muscles = targetMuscles(activeSplit, custom);
  const drivers: string[] = [];

  // Check-in (0.35): soreness of today's target muscles, sleep quality, mood — each a z-score
  // against the user's own last-14-days distribution of that same field (6.4 names the three
  // components; combining them as an equal-weight average is this build's reading, undocumented
  // by the plan beyond naming them — see COACHING-DECISIONS.md).
  let checkInScore: number | null = null;
  if (checkIn) {
    const priorSoreness = checkInHistory.map(c => {
      const vals: number[] = muscles.map(m => c.soreness?.[m]).filter(v => v != null) as number[];
      return vals.length ? avg(vals) : null;
    }).filter(v => v != null) as number[];
    const todaySoreness = (() => {
      const vals: number[] = muscles.map(m => checkIn.soreness?.[m]).filter(v => v != null) as number[];
      return vals.length ? avg(vals) : null;
    })();
    const sorenessZ = todaySoreness != null ? zScore(todaySoreness, priorSoreness) : null;
    const sleepQZ = checkIn.sleepQuality != null ? zScore(checkIn.sleepQuality, checkInHistory.map(c => c.sleepQuality).filter(v => v != null) as number[]) : null;
    const moodZ = checkIn.mood != null ? zScore(checkIn.mood, checkInHistory.map(c => c.mood).filter(v => v != null) as number[]) : null;
    // Before there's enough history for a z-score (n<3), fall back to the raw 1-5 rating against
    // its own midpoint (3) — still "calibrating", per 6.4, but a first-ever check-in should count
    // for something rather than vanishing entirely for lack of a personal baseline.
    const rawFallback = (raw: number | undefined, invert: boolean) => raw == null ? null : clamp(invert ? 0.5 - (raw - 3) / 4 : 0.5 + (raw - 3) / 4, 0, 1);
    // Soreness is inverted (higher = worse); sleep quality and mood are not.
    const parts = [
      sorenessZ != null ? clamp(0.5 - sorenessZ / 3, 0, 1) : rawFallback(todaySoreness ?? undefined, true),
      sleepQZ != null ? clamp(0.5 + sleepQZ / 3, 0, 1) : rawFallback(checkIn.sleepQuality, false),
      moodZ != null ? clamp(0.5 + moodZ / 3, 0, 1) : rawFallback(checkIn.mood, false),
    ].filter((v): v is number => v != null);
    if (parts.length) {
      checkInScore = avg(parts);
      if (checkInScore < 0.4) drivers.push('how you feel today (soreness, sleep quality or mood)');
    }
  }

  // Sleep hours (0.25): last night vs the 14-night need, and a 3-night debt. Bedtime regularity
  // (6.4's third component) has no source anywhere in this app yet, so the other two are
  // renormalised to fill the full 0.25 rather than leaving it permanently short — see decisions.
  let sleepScore: number | null = null;
  if (baselines.sleep14dMedian != null) {
    const need = baselines.sleep14dMedian;
    const lastNight = healthDays.find(d => withinDays(d.day, today, 1) && d.sleepMinutes != null)?.sleepMinutes ?? null;
    const last3 = healthDays.filter(d => withinDays(d.day, today, 3) && d.sleepMinutes != null).map(d => d.sleepMinutes!);
    const lastNightScore = lastNight != null ? clamp(lastNight / need, 0, 1) : null;
    const debtMinutes = last3.length ? last3.reduce((a, m) => a + Math.max(0, need - m), 0) : null;
    const debtScore = debtMinutes != null ? clamp(1 - debtMinutes / (need * 1.5), 0, 1) : null;
    const w1 = 60 / 85, w2 = 25 / 85;
    if (lastNightScore != null && debtScore != null) sleepScore = w1 * lastNightScore + w2 * debtScore;
    else if (lastNightScore != null) sleepScore = lastNightScore;
    else if (debtScore != null) sleepScore = debtScore;
    if (sleepScore != null && sleepScore < 0.5) drivers.push('sleep has been short recently');
  }

  // Recovery of today's target muscles (0.15), from 6.11.
  let recoveryScore: number | null = null;
  const targetRecovery = recovery.filter(r => muscles.includes(r.muscle));
  if (targetRecovery.length) {
    recoveryScore = clamp(avg(targetRecovery.map(r => r.pct)) / 100, 0, 1);
    if (recoveryScore < 0.6) {
      drivers.push(isDoneToday && next
        ? `the muscles for ${next.split.name} on ${WEEKDAY_LABEL[next.weekday]} are not fully recovered`
        : 'the muscles you would train today are not fully recovered');
    }
  }

  // Resting-HR deviation (0.10): s = clamp(1 - delta/10, 0, 1).
  let rhrScore: number | null = null;
  if (baselines.restingHr7d != null && baselines.restingHr28d != null) {
    const delta = baselines.restingHr7d - baselines.restingHr28d;
    rhrScore = clamp(1 - delta / 10, 0, 1);
    if (delta >= 5) drivers.push('resting heart rate is up over your usual');
  }

  // HRV z-score (0.10): only with clean RR data and >=14 values. Dormant on the GT6 (Appendix E).
  let hrvScore: number | null = null;
  if (baselines.lnRmssd7dMean != null && baselines.lnRmssd7dSd != null) {
    const recentLn = healthDays.filter(d => withinDays(d.day, today, 1) && d.lnRmssd != null).map(d => d.lnRmssd!);
    if (recentLn.length) {
      const z = baselines.lnRmssd7dSd > 0 ? (avg(recentLn) - baselines.lnRmssd7dMean) / baselines.lnRmssd7dSd : 0;
      hrvScore = clamp(0.5 + z / 3, 0, 1);
      if (hrvScore < 0.4) drivers.push('HRV is below your usual range');
    }
  }

  // Acute load (0.05): 7-day session load vs the 28-day mean, reusing the same ATL/CTL pattern
  // as the systemic recovery factor (6.11/F2.4).
  const ratio = acuteChronicRatio(sessions, today);
  const loadScore: number | null = ratio == null ? null : clamp(1 - Math.max(0, ratio - 1) / 0.5, 0, 1);

  const W = READINESS_WEIGHTS;
  const weighted: Weighted[] = [
    { key: 'checkIn', weight: W.checkIn, score: checkInScore },
    { key: 'sleep', weight: W.sleep, score: sleepScore },
    { key: 'recovery', weight: W.recovery, score: recoveryScore },
    { key: 'rhr', weight: W.rhr, score: rhrScore },
    { key: 'hrv', weight: W.hrv, score: hrvScore },
    { key: 'load', weight: W.load, score: loadScore },
  ];
  const present = weighted.filter(w => w.score != null);
  if (!present.length) return null;

  const totalWeight = present.reduce((a, w) => a + w.weight, 0);
  const score = Math.round(100 * present.reduce((a, w) => a + w.weight * w.score!, 0) / totalWeight);
  const band: ReadinessBand = score >= READINESS_GREEN_AT ? 'green' : score <= READINESS_RED_AT ? 'red' : 'amber';
  const loadAdvice: LoadAdvice = band === 'red' ? 'reduce' : band === 'amber' ? 'no_increase' : 'normal';
  const confidence = present.length >= 4 ? 'high' : present.length >= 2 ? 'medium' : 'low';
  const distinctCheckInDays = new Set(checkInHistory.map(c => c.day)).size;
  const sleepDays = healthDays.filter(d => d.sleepMinutes != null).length;
  const calibrating = distinctCheckInDays < READINESS_CALIBRATING_DAYS && sleepDays < READINESS_CALIBRATING_DAYS;
  const postSessionAdvice = isDoneToday
    ? `Today's session is done. Recover well${next ? `; ${next.split.name} is next on ${WEEKDAY_LABEL[next.weekday]}` : ''}.`
    : undefined;

  return { score, band, confidence, loadAdvice, drivers: drivers.slice(0, 3), calibrating, ...(postSessionAdvice ? { postSessionAdvice } : {}) };
}

/** F3.8: a one-line summary for the optional morning notification. */
export function readinessSummaryText(r: ReadinessResult): string {
  // QA8-2: once today's session is done, "ease off today" no longer makes sense.
  if (r.postSessionAdvice) return `Readiness: ${r.band} (${r.score}). ${r.postSessionAdvice}`;
  const advice = r.loadAdvice === 'reduce' ? ' Ease off today.' : r.loadAdvice === 'no_increase' ? ' Keep loads steady today.' : '';
  return `Readiness: ${r.band} (${r.score}).${advice}`;
}
