/**
 * Muscle recovery: an impulse-response model (plan 6.11). Every set leaves
 * an impulse sized by role, effort, volume, load, exercise damage and
 * novelty; impulses decay fast-then-slow and stack across the last 7 days;
 * the percentage compares today's leftover fatigue against the muscle's
 * own typical session dose. Heart rate never touches this file — only the
 * systemic (whole-body) factor, from sleep, resting heart rate and training
 * load, which slows every muscle a little without ever being the reason a
 * specific muscle looks unrecovered.
 */
import type { CheckIn, DailyHealth, Exercise, FreshMark, Profile, RecoveryModel, Session } from '@/core/models';
import { MUSCLE_BY_ID, MUSCLE_IDS, type MuscleId } from '@/data/muscles';
import { findExercise, setDamage } from '@/core/exercises';
import { ROLE_WEIGHT, effortLabel, isWorkingSet, rolesFor } from './exposure';
import { exerciseHistory, type ExerciseSessionSummary } from './history';
import { daysBetween, dayKey } from '@/core/dates';
import {
  EFFORT_IMPULSE, EFFORT_STRETCH, repFactor, HARD_SET_DIMINISH_AFTER, HARD_SET_DIMINISH_FACTOR,
  LOAD_FACTOR_MIN, LOAD_FACTOR_MAX, NOVELTY_FIRST_EXPOSURE, NOVELTY_SECOND_EXPOSURE, NOVELTY_LAYOFF_DAYS, NOVELTY_LAYOFF_FACTOR,
  VOLUME_STRETCH_MIN, VOLUME_STRETCH_MAX, VOLUME_STRETCH_DIVISOR,
  TRAINING_AGE_PRIOR, TRAINING_AGE_NOVICE_MONTHS, TRAINING_AGE_INTERMEDIATE_MONTHS,
  AGE_PRIOR_PER_DECADE, AGE_PRIOR_START, AGE_PRIOR_CAP,
  SYSTEMIC_SLEEP_HOURS, SYSTEMIC_SLEEP_FACTOR, SYSTEMIC_RHR_SD, SYSTEMIC_RHR_FACTOR, SYSTEMIC_LOAD_RATIO, SYSTEMIC_LOAD_FACTOR_MAX, SYSTEMIC_CAP,
  TAU_BASE_HOURS, FAST_TAU_HOURS, FAST_SHARE, SLOW_SHARE,
  IMPULSE_LOOKBACK_DAYS, FLOOR_DAYS, READY_TO_HOURS_CAP, READY_PCT, FULL_PCT,
  F_REF_FLOOR, F_REF_SESSION_LOOKBACK,
  SORENESS_CAP_PCT, SORENESS_CAP_MIN_RATING,
  TAU_SCALE_MIN, TAU_SCALE_MAX, TAU_SCALE_UP, TAU_SCALE_DOWN, CALIBRATION_PREDICTED_HIGH, CALIBRATION_PREDICTED_LOW, CALIBRATION_PERFORMANCE_DROP,
} from '@/data/recovery';

export interface MuscleRecovery {
  muscle: MuscleId;
  /** 0-100. 100 means fully recovered. */
  pct: number;
  /** Hours remaining until "ready for hard work" (90%), 0 once past it. */
  hoursLeft: number;
  /** The solved hours-since-training to reach "ready", before the ± display band. */
  windowHours: number;
  lastTrainedAt: string | null;
  lastDay: string | null;
  /** True when the window was widened from the user's own history (calibration observed this muscle needing more, or fewer, hours). */
  personalized: boolean;
  /** True while below "ready for hard work" (under 90%). */
  recovering: boolean;
  ready: boolean;
  readyInHours: [number, number] | null;
  fullInHours: number | null;
  confidence: 'low' | 'medium' | 'high';
  drivers: Array<{ text: string; hours: number }>;
  systemicFactor: number;
  /** QA-R3a-9: today's soreness rating holds this muscle below ready; no clock time can say when that eases. */
  soreToday?: boolean;
}

export const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

export function avg(xs: number[]): number { return xs.reduce((a, b) => a + b, 0) / xs.length; }
export function stddev(xs: number[]): number {
  if (xs.length < 2) return 0;
  const m = avg(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / xs.length);
}

function monthsBetween(fromDay: string, toMs: number): number {
  return Math.max(0, daysBetween(fromDay, dayKey(new Date(toMs))) / 30.44);
}

export function trainingAgeMonths(profile: Profile, sessions: Session[], atMs: number): number | null {
  const since = profile.trainingSince ? `${profile.trainingSince}-01` : sessions[0]?.day;
  return since ? monthsBetween(since, atMs) : null;
}

function trainingAgePrior(months: number | null): number {
  if (months == null || months < TRAINING_AGE_NOVICE_MONTHS) return TRAINING_AGE_PRIOR.novice;
  if (months < TRAINING_AGE_INTERMEDIATE_MONTHS) return TRAINING_AGE_PRIOR.intermediate;
  return TRAINING_AGE_PRIOR.established;
}

export function ageOf(profile: Profile, atMs: number): number | null {
  return profile.birthYear ? new Date(atMs).getFullYear() - profile.birthYear : null;
}

function agePrior(age: number | null): number {
  if (age == null || age <= AGE_PRIOR_START) return 1.0;
  const decades = (age - AGE_PRIOR_START) / 10;
  return clamp(1 + decades * AGE_PRIOR_PER_DECADE, 1.0, AGE_PRIOR_CAP);
}

/** Session-RPE proxy load (no heart rate needed): effort-weighted minutes. */
export function sessionRpeLoad(session: Session): number {
  const sets = session.exercises.flatMap(e => e.sets).filter(isWorkingSet);
  if (!sets.length) return 0;
  const weight = { easy: 4, ideal: 7, max: 10 } as const;
  const avgWeight = avg(sets.map(s => weight[effortLabel(s) ?? 'ideal']));
  return avgWeight * (session.durationSec / 60);
}

/**
 * 7-day over 28-day session load (ATL/CTL), one definition for recovery and readiness (BR-19).
 * Null until training has spanned most of the window: 3+ sessions in the 28 days, the oldest at
 * least 14 days back. A fixed 28-day divisor would otherwise spike the ratio for a new account.
 */
export function acuteChronicRatio(sessions: Session[], refDay: string): number | null {
  const ago = (day: string) => daysBetween(day, refDay);
  const chronic = sessions.filter(s => { const d = ago(s.day); return d >= 0 && d < 28; });
  if (chronic.length < 3 || Math.max(...chronic.map(s => ago(s.day))) < 14) return null;
  const ctl = chronic.reduce((a, s) => a + sessionRpeLoad(s), 0) / 28;
  if (!(ctl > 0)) return null;
  const atl = chronic.filter(s => ago(s.day) < 7).reduce((a, s) => a + sessionRpeLoad(s), 0) / 7;
  return atl / ctl;
}

/** Whole-body slowdown from multi-day sleep debt, resting-HR deviation and acute training load. Never from one bad night. Capped. */
export function systemicFactor(healthDays: DailyHealth[], sessions: Session[], atMs: number): number {
  let factor = 1.0;
  // One day key for the reference time; per-item dayKey() calls made this O(n) in Date work per session.
  const ref = dayKey(new Date(atMs));
  const within = (day: string, days: number): boolean => { const d = daysBetween(day, ref); return d >= 0 && d < days; };
  const sleep7 = healthDays.filter(d => within(d.day, 7) && d.sleepMinutes != null).map(d => d.sleepMinutes! / 60);
  if (sleep7.length && avg(sleep7) < SYSTEMIC_SLEEP_HOURS) factor *= SYSTEMIC_SLEEP_FACTOR;

  const rhr7 = healthDays.filter(d => within(d.day, 7) && d.restingHr != null).map(d => d.restingHr!);
  const rhr28 = healthDays.filter(d => within(d.day, 28) && d.restingHr != null).map(d => d.restingHr!);
  if (rhr7.length && rhr28.length >= 2) {
    const sd = stddev(rhr28);
    if (sd > 0 && Math.abs(avg(rhr7) - avg(rhr28)) / sd > SYSTEMIC_RHR_SD) factor *= SYSTEMIC_RHR_FACTOR;
  }

  const ratio = acuteChronicRatio(sessions, ref);
  if (ratio != null && ratio > SYSTEMIC_LOAD_RATIO) factor *= clamp(1 + (ratio - SYSTEMIC_LOAD_RATIO) * 0.5, 1.0, SYSTEMIC_LOAD_FACTOR_MAX);
  return Math.min(SYSTEMIC_CAP, factor);
}

export interface Dose { sessionId: string; muscle: MuscleId; at: number; day: string; A: number; tau: number; drivers: Array<{ text: string; hours: number }> }

/** Every session's per-muscle dose and time constant, chronological. Pure over plain data. */
function sessionMuscleDoses(sessions: Session[], custom: Exercise[], profile: Profile, healthDays: DailyHealth[], recoveryModel: RecoveryModel): Record<MuscleId, Dose[]> {
  const out = Object.fromEntries(MUSCLE_IDS.map(m => [m, [] as Dose[]])) as Record<MuscleId, Dose[]>;
  const exposureCount = new Map<string, number>();
  const lastTopKg = new Map<string, number>();
  const lastMuscleTouch = new Map<MuscleId, number>();
  const sorted = [...sessions].sort((a, b) => a.startedAt.localeCompare(b.startedAt));
  // systemicFactor depends on the time only through its day (BR-23): one evaluation per day.
  const systemicByDay = new Map<string, number>();
  let lo = 0, hi = 0;

  for (const session of sorted) {
    const at = new Date(session.logging?.trainedEndAt || session.endedAt || session.startedAt).getTime();
    const perMuscle = new Map<MuscleId, { total: number; effortWeighted: number; roleWeightSum: number; topL: number; topDriver: { text: string; hours: number } | null }>();
    const hardSetIndex = new Map<MuscleId, number>();
    const seenExerciseThisSession = new Set<string>();

    for (const ex of session.exercises) {
      const meta = findExercise(ex.exerciseId, custom) ?? findExercise(ex.name, custom);
      if (!meta) continue;
      const working = ex.sets.filter(isWorkingSet);
      if (!working.length) continue;
      const priorExposure = exposureCount.get(meta.id) ?? 0;
      const exerciseNovelty = priorExposure === 0 ? NOVELTY_FIRST_EXPOSURE : priorExposure === 1 ? NOVELTY_SECOND_EXPOSURE : 1.0;
      const recentTop = lastTopKg.get(meta.id) ?? null;
      const sessionTopKg = Math.max(0, ...working.map(s => s.kg ?? 0));

      for (const set of working) {
        const reps = set.reps ?? 0;
        const rF = reps > 0 ? repFactor(reps) : 1.0;
        const loadFactor = meta.mode === 'weighted' && recentTop && recentTop > 0 && (set.kg ?? 0) > 0
          ? clamp((set.kg ?? 0) / recentTop, LOAD_FACTOR_MIN, LOAD_FACTOR_MAX) : 1.0;
        const effort = effortLabel(set) ?? 'ideal';
        const e = EFFORT_IMPULSE[effort];
        const damage = setDamage({ id: meta.id, name: meta.name, role: meta.role }, reps);
        for (const r of rolesFor(meta)) {
          const roleW = ROLE_WEIGHT[r.role];
          const idx = (hardSetIndex.get(r.muscle) ?? 0) + 1;
          hardSetIndex.set(r.muscle, idx);
          const diminish = idx > HARD_SET_DIMINISH_AFTER ? HARD_SET_DIMINISH_FACTOR : 1.0;
          const layoffDays = lastMuscleTouch.has(r.muscle) ? (at - lastMuscleTouch.get(r.muscle)!) / 86_400_000 : Infinity;
          const layoffNovelty = layoffDays >= NOVELTY_LAYOFF_DAYS ? NOVELTY_LAYOFF_FACTOR : 1.0;
          const novelty = Math.max(exerciseNovelty, layoffNovelty);
          const L = roleW * e * rF * loadFactor * diminish * damage * novelty;
          const cur = perMuscle.get(r.muscle) ?? { total: 0, effortWeighted: 0, roleWeightSum: 0, topL: 0, topDriver: null };
          cur.total += L;
          cur.effortWeighted += EFFORT_STRETCH[effort] * L;
          cur.roleWeightSum += roleW;
          // BR-31: the driver is the set with the biggest dose, and the set count is this exercise's own.
          if (!cur.topDriver || L > cur.topL) {
            cur.topL = L;
            const reason = effort === 'max' ? `${meta.name}: max effort` : layoffNovelty > 1 ? `${meta.name}: first time in a while` : exerciseNovelty > 1 ? `${meta.name}: new exercise` : `${meta.name}: ${working.length} set${working.length === 1 ? '' : 's'}`;
            cur.topDriver = { text: reason, hours: 0 };
          }
          perMuscle.set(r.muscle, cur);
        }
      }
      exposureCount.set(meta.id, priorExposure + 1);
      seenExerciseThisSession.add(meta.id);
      if (sessionTopKg > 0) lastTopKg.set(meta.id, sessionTopKg);
    }

    const atDay = dayKey(new Date(at));
    let systemic = systemicByDay.get(atDay);
    if (systemic === undefined) {
      // systemicFactor only reads sessions from the 28 days up to this day: pass that window
      // (with a 2-day margin either side for day/start ordering) instead of the whole history.
      while (lo < sorted.length && daysBetween(sorted[lo]!.day, atDay) > 30) lo++;
      while (hi < sorted.length && daysBetween(atDay, sorted[hi]!.day) <= 2) hi++;
      systemic = systemicFactor(healthDays, sorted.slice(lo, hi), at);
      systemicByDay.set(atDay, systemic);
    }
    const trainingAge = trainingAgePrior(trainingAgeMonths(profile, sorted, at));
    const age = agePrior(ageOf(profile, at));

    for (const [muscle, agg] of perMuscle) {
      if (agg.total <= 0) continue;
      const effortStretch = agg.effortWeighted / agg.total;
      const volumeStretch = clamp(Math.sqrt(agg.roleWeightSum / VOLUME_STRETCH_DIVISOR), VOLUME_STRETCH_MIN, VOLUME_STRETCH_MAX);
      const tauScale = recoveryModel.tauScale[muscle] ?? 1.0;
      const tau = TAU_BASE_HOURS * MUSCLE_BY_ID[muscle].recoveryFactor * effortStretch * volumeStretch * trainingAge * age * systemic * tauScale;
      out[muscle].push({ sessionId: session.id, muscle, at, day: session.day, A: agg.total, tau, drivers: agg.topDriver ? [agg.topDriver] : [] });
    }
    for (const m of perMuscle.keys()) lastMuscleTouch.set(m, at);
  }
  return out;
}

function fRefFor(doses: Dose[], atMs: number): number {
  const prior = doses.filter(d => d.at <= atMs).slice(-F_REF_SESSION_LOOKBACK).map(d => d.A);
  if (!prior.length) return F_REF_FLOOR;
  const sorted = [...prior].sort((a, b) => a - b);
  const median = sorted[Math.floor(sorted.length / 2)]!;
  return Math.max(median, F_REF_FLOOR);
}

function residualOf(dose: Dose, atMs: number): number {
  const hours = (atMs - dose.at) / 3_600_000;
  if (hours < 0) return 0;
  return dose.A * (FAST_SHARE * Math.exp(-hours / FAST_TAU_HOURS) + SLOW_SHARE * Math.exp(-hours / dose.tau));
}

function stackedResidual(doses: Dose[], atMs: number): number {
  const cutoff = atMs - IMPULSE_LOOKBACK_DAYS * 86_400_000;
  return doses.filter(d => d.at >= cutoff && d.at <= atMs).reduce((a, d) => a + residualOf(d, atMs), 0);
}

function pctAt(doses: Dose[], fRef: number, atMs: number, lastTouchAt: number): number {
  if ((atMs - lastTouchAt) / 3_600_000 >= FLOOR_DAYS * 24) return 100;
  const f = stackedResidual(doses, atMs);
  return clamp(Math.round((1 - f / fRef) * 100), 0, 100);
}

/** Smallest hours-since-`fromMs`, up to the cap, where pct first reaches `targetPct`. Null if never within the cap. */
function solveHours(doses: Dose[], fRef: number, lastTouchAt: number, fromMs: number, targetPct: number): number | null {
  const fromHours = Math.max(0, (fromMs - lastTouchAt) / 3_600_000);
  if (pctAt(doses, fRef, fromMs, lastTouchAt) >= targetPct) return fromHours;
  let lo = fromHours, hi = READY_TO_HOURS_CAP;
  if (pctAt(doses, fRef, lastTouchAt + hi * 3_600_000, lastTouchAt) < targetPct) return null;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    const p = pctAt(doses, fRef, lastTouchAt + mid * 3_600_000, lastTouchAt);
    if (p >= targetPct) hi = mid; else lo = mid;
  }
  return hi;
}

function confidenceFor(observations: number): MuscleRecovery['confidence'] {
  if (observations >= 8) return 'high';
  if (observations >= 3) return 'medium';
  return 'low';
}

export interface RecoveryInputs {
  sessions: Session[];
  custom?: Exercise[];
  now?: number;
  profile?: Profile;
  healthDays?: DailyHealth[];
  checkIns?: CheckIn[];
  freshMarks?: FreshMark[];
  recoveryModel?: RecoveryModel;
  /** Only `pct` is needed (calibration): skip solving the ready/full times. */
  pctOnly?: boolean;
}

export type MuscleDoses = Record<MuscleId, Dose[]>;

/** The per-muscle doses for a session list: build once, then evaluate at several times with recoveryAt. */
export function muscleDoses(input: RecoveryInputs): MuscleDoses {
  const { sessions, custom = [], profile = { name: '' }, healthDays = [], recoveryModel = { tauScale: {}, observations: {} } } = input;
  return sessionMuscleDoses(sessions, custom, profile, healthDays, recoveryModel);
}

export function recoveryStatus(input: RecoveryInputs): MuscleRecovery[] {
  return recoveryAt(muscleDoses(input), input);
}

/** Recovery at `input.now` from doses already built for the same sessions. */
export function recoveryAt(doses: MuscleDoses, input: RecoveryInputs): MuscleRecovery[] {
  const { sessions, now = Date.now(), healthDays = [], checkIns = [], freshMarks = [], recoveryModel = { tauScale: {}, observations: {} } } = input;
  const today = dayKey(new Date(now));
  const systemicNow = Math.round(systemicFactor(healthDays, sessions, now) * 100) / 100;

  return MUSCLE_IDS.map(muscle => {
    const list = doses[muscle];
    const last = list[list.length - 1];
    const fresh = freshMarks.filter(f => f.muscle === muscle).sort((a, b) => a.at.localeCompare(b.at)).pop();
    const freshOverridesLast = fresh && last && new Date(fresh.at).getTime() >= last.at;

    if (!last || freshOverridesLast) {
      return {
        muscle, pct: 100, hoursLeft: 0, windowHours: 0,
        lastTrainedAt: last ? new Date(last.at).toISOString() : null, lastDay: last?.day ?? null,
        personalized: false, recovering: false, ready: true, readyInHours: null, fullInHours: null,
        confidence: 'low', drivers: [], systemicFactor: 1,
      };
    }

    const fRef = fRefFor(list, now);
    let pct = pctAt(list, fRef, now, last.at);

    // Soreness caps today's pct; it never raises it, and no soreness never implies ready either.
    const todaySoreness = checkIns.find(c => c.day === today)?.soreness?.[muscle];
    const modelPct = pct;
    if (todaySoreness != null && todaySoreness >= SORENESS_CAP_MIN_RATING) pct = Math.min(pct, SORENESS_CAP_PCT);
    const soreToday = pct < modelPct && pct < READY_PCT;

    const tReady = input.pctOnly ? null : solveHours(list, fRef, last.at, now, READY_PCT);
    const tFull = input.pctOnly ? null : solveHours(list, fRef, last.at, now, FULL_PCT);
    // solveHours counts from the last session; ready/full times are shown from now (BR-02).
    const r1 = (x: number) => Math.round(x * 10) / 10;
    const elapsedH = Math.max(0, (now - last.at) / 3_600_000);
    // Sore but past the model's own ready time: the soreness decides, not the clock.
    const soreOnly = soreToday && tReady != null && tReady <= elapsedH;
    const readyInHours: [number, number] | null = pct >= READY_PCT || tReady == null || soreOnly ? null : [r1(Math.max(0, tReady - elapsedH) * 0.85), Math.min(READY_TO_HOURS_CAP, r1(Math.max(0, tReady - elapsedH) * 1.15))];
    const observations = recoveryModel.observations[muscle] ?? 0;
    const tauScale = recoveryModel.tauScale[muscle] ?? 1.0;

    return {
      muscle,
      pct,
      hoursLeft: tReady == null ? 0 : Math.max(0, Math.round((tReady - Math.max(0, (now - last.at) / 3_600_000)) * 10) / 10),
      windowHours: tReady == null ? READY_TO_HOURS_CAP : Math.round(tReady * 10) / 10,
      lastTrainedAt: new Date(last.at).toISOString(),
      lastDay: last.day,
      personalized: Math.abs(tauScale - 1) > 0.01,
      recovering: pct < READY_PCT,
      ready: pct >= READY_PCT,
      readyInHours,
      fullInHours: tFull == null ? null : r1(Math.max(0, tFull - elapsedH)),
      confidence: confidenceFor(observations),
      drivers: last.drivers,
      systemicFactor: systemicNow,
      ...(soreToday ? { soreToday } : {}),
    };
  });
}

export function recoveryTier(pct: number): 'low' | 'mid' | 'high' | 'ready' {
  if (pct >= READY_PCT) return 'ready';
  if (pct >= 75) return 'high';
  if (pct >= 40) return 'mid';
  return 'low';
}

/** Two-sided, bounded calibration (6.11 point 8): run once per primary muscle after a session finishes. */
export function calibrateTauScale(currentScale: number, predictedPct: number, performanceDeltaPct: number | null): number {
  if (performanceDeltaPct == null) return currentScale;
  let next = currentScale;
  if (performanceDeltaPct <= -CALIBRATION_PERFORMANCE_DROP * 100 && predictedPct >= CALIBRATION_PREDICTED_HIGH) next = currentScale * TAU_SCALE_UP;
  else if (performanceDeltaPct >= 0 && predictedPct <= CALIBRATION_PREDICTED_LOW) next = currentScale * TAU_SCALE_DOWN;
  return clamp(next, TAU_SCALE_MIN, TAU_SCALE_MAX);
}

/**
 * Runs once, right after a session finishes: for each primary muscle of an exercise rated max
 * effort with a matched-effort prior session, compares the predicted recovery at session start
 * against the e1RM change and nudges that muscle's tauScale. Pure: `priorSessions` must not yet
 * include `newSession`.
 */
/**
 * `prevSummary`, when given, returns the exercise's last summary before this session, so a
 * full rebuild (UI-12) can pass a recent window as `priorSessions` without an O(n²) history scan.
 */
export function calibrateAfterSession(priorSessions: Session[], newSession: Session, custom: Exercise[], profile: Profile, healthDays: DailyHealth[], recoveryModel: RecoveryModel, prevSummary?: (exerciseId: string) => ExerciseSessionSummary | undefined): RecoveryModel {
  const startedAtMs = new Date(newSession.logging?.trainedAt ?? newSession.startedAt).getTime();
  // Only computed when some exercise has a max-effort comparison to learn from (most sessions have none).
  let predictedMemo: MuscleRecovery[] | null = null;
  const predicted = (): MuscleRecovery[] => (predictedMemo ??= recoveryStatus({ sessions: priorSessions, custom, now: startedAtMs, profile, healthDays, checkIns: [], freshMarks: [], recoveryModel, pctOnly: true }));
  const tauScale = { ...recoveryModel.tauScale };
  const observations = { ...recoveryModel.observations };
  const touched = new Set<MuscleId>();

  for (const ex of newSession.exercises) {
    const meta = findExercise(ex.exerciseId, custom);
    if (!meta) continue;
    const curHist = exerciseHistory([newSession], ex.exerciseId, custom);
    const cur = curHist[curHist.length - 1];
    if (!cur?.hasMax || cur.bestE1rm <= 0) continue;
    const prev = prevSummary ? prevSummary(ex.exerciseId) : (() => { const h = exerciseHistory(priorSessions, ex.exerciseId, custom); return h[h.length - 1]; })();
    if (!prev?.hasMax || prev.bestE1rm <= 0) continue;
    const deltaPct = ((cur.bestE1rm - prev.bestE1rm) / prev.bestE1rm) * 100;
    for (const muscle of meta.primary) {
      if (touched.has(muscle)) continue;
      touched.add(muscle);
      const predictedPct = predicted().find(r => r.muscle === muscle)?.pct ?? 50;
      const before = tauScale[muscle] ?? 1.0;
      const after = calibrateTauScale(before, predictedPct, deltaPct);
      if (after !== before) {
        tauScale[muscle] = after;
        observations[muscle] = (observations[muscle] ?? 0) + 1;
      }
    }
  }
  return { tauScale, observations };
}

/** The lowest recovery % among an exercise's primary muscles (F2.1's progression hook). Moved from Train.tsx so Escobar's tools share it. */
export function recoveryPctFor(exerciseId: string, custom: Exercise[], recovery: Array<Pick<MuscleRecovery, 'muscle' | 'pct'>>): number | undefined {
  const meta = findExercise(exerciseId, custom);
  if (!meta) return undefined;
  const pcts = meta.primary.map(m => recovery.find(r => r.muscle === m)?.pct).filter((v): v is number => v != null);
  return pcts.length ? Math.min(...pcts) : undefined;
}
