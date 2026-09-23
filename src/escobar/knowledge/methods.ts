/**
 * explain_method (§16.2): how the app computes each number it shows, "the king knows how
 * every room was built". Constants are imported from the code that uses them, never
 * copied, so an explanation can't drift from the behaviour. `personal` holds this
 * person's own calibration values.
 */
import * as REC from '@/data/recovery';
import { VOLUME_BANDS, VOLUME_OFFSET } from '@/data/volume';
import { GOAL_BY_ID } from '@/data/goals';
import { DELOAD_DAYS, DELOAD_LOAD_FACTOR, DELOAD_SET_FACTOR } from '@/data/deload';
import { READINESS_CALIBRATING_DAYS, READINESS_GREEN_AT, READINESS_RED_AT, READINESS_WEIGHTS } from '@/brain/readiness';
import { E1RM_FULL_WEIGHT_REPS, E1RM_MAX_REPS, EPLEY_DIVISOR, RIR_BY_EFFORT } from '@/brain/e1rm';
import { DELOAD_TRIGGER } from '@/brain/deload';
import { ROLE_WEIGHT, SET_WEIGHT, LEVELS, trainingLevels } from '@/brain/exposure';
import { MIN_REST_SEC, REST_RESERVE_PCT, REST_RISE_BPM, TANAKA, ZONE_RESERVE_PCTS, hrMax, restingHr, zones } from '@/brain/heart';
import { BURST_COUNT, COMPRESSED_SEC_PER_SET, LIVE_GAP_SEC } from '@/brain/fidelity';
import { WARMUP_PCTS, WARMUP_REPS } from '@/brain/coach/pre';
import { MAX_INCREASE_SHARE, RECOVERY_HOLD_PCT, REENTRY_DAYS } from '@/brain/progression';
import { PLATEAU_MIN_SESSIONS, PLATEAU_WINDOW } from '@/brain/trend';
import { BALANCE } from '@/brain/balance';
import { WEEKLY_REVIEW_DAYS } from '@/brain/coach/weeklyReview';
import { BIAS_CAP_REPS, BIAS_MIN_OBSERVATIONS, effortBiasByLabel, rirObservations } from '@/brain/effortBias';
import { exerciseHistory } from '@/brain/history';
import { trainingAgeMonths, ageOf } from '@/brain/recovery';
import { volumeBands } from '@/brain/volume';
import { MUSCLE_IDS, muscleLabel } from '@/data/muscles';
import { age as ageFor, bmrKcalPerDay } from '@/brain/energy';
import type { MethodId } from './methodIds';
import type { ToolCtx } from '../tools/context';

export interface MethodExplanation {
  topic: MethodId;
  summary: string;
  inputs: string[];
  constants: Record<string, number>;
  personal: Record<string, number | string>;
}

const r2 = (v: number): number => Math.round(v * 100) / 100;

function mainLiftIds(ctx: ToolCtx): string[] {
  const ids = new Set<string>();
  for (const s of ctx.state.sessions.slice(-20)) for (const e of s.exercises) ids.add(e.exerciseId);
  return [...ids];
}

type Builder = (ctx: ToolCtx) => Omit<MethodExplanation, 'topic'>;

const METHODS: Record<MethodId, Builder> = {
  recovery: ctx => {
    const s = ctx.state;
    const tau: Record<string, number> = {};
    for (const [m, v] of Object.entries(s.recoveryModel.tauScale)) if (v != null && v !== 1) tau[`tauScale ${muscleLabel(m)}`] = r2(v);
    const months = trainingAgeMonths(s.profile, s.sessions, ctx.now);
    return {
      summary: `Each set adds fatigue to the muscles it works (primary fully, secondary ${ROLE_WEIGHT.secondary}), scaled by effort, reps, load and how unusual the exercise is for you. Fatigue fades on a fast and a slow curve (base ${REC.TAU_BASE_HOURS} h). A muscle is ready for hard work at ${REC.READY_PCT}% and fully recovered at ${REC.FULL_PCT}%. Poor sleep, a raised resting heart rate or a heavy week slow everything a little. Your own history widens or narrows each muscle's window, within limits.`,
      inputs: ['every logged set in the last 7 days (load, reps, effort)', 'exercise damage profile', 'training age and age', 'sleep and resting heart rate (health data)', 'soreness check-ins and "mark as fresh"', 'your per-muscle calibration'],
      constants: {
        readyPct: REC.READY_PCT, fullPct: REC.FULL_PCT, tauBaseHours: REC.TAU_BASE_HOURS, fastTauHours: REC.FAST_TAU_HOURS, fastShare: REC.FAST_SHARE, slowShare: REC.SLOW_SHARE,
        effortImpulseEasy: REC.EFFORT_IMPULSE.easy, effortImpulseIdeal: REC.EFFORT_IMPULSE.ideal, effortImpulseMax: REC.EFFORT_IMPULSE.max,
        secondaryWeight: ROLE_WEIGHT.secondary, noviceFirstExposure: REC.NOVELTY_FIRST_EXPOSURE, systemicCap: REC.SYSTEMIC_CAP, sleepHoursThreshold: REC.SYSTEMIC_SLEEP_HOURS,
        sorenessCapPct: REC.SORENESS_CAP_PCT, tauScaleMin: REC.TAU_SCALE_MIN, tauScaleMax: REC.TAU_SCALE_MAX, maxHoursToReady: REC.READY_TO_HOURS_CAP,
      },
      personal: { trainingAgeMonths: months ?? 'unknown', calibratedMuscles: Object.keys(tau).length, ...tau },
    };
  },
  readiness: ctx => {
    const days = new Set(ctx.state.checkIns.map(c => c.day)).size;
    const rhr = restingHr(ctx.state.healthDays, ctx.state.profile, ctx.today);
    return {
      summary: `A 0–100 score from what is available today: your check-in (${READINESS_WEIGHTS.checkIn}), sleep against your own need (${READINESS_WEIGHTS.sleep}), recovery of today's muscles (${READINESS_WEIGHTS.recovery}), resting heart rate against your baseline (${READINESS_WEIGHTS.rhr}), HRV (${READINESS_WEIGHTS.hrv}) and recent load (${READINESS_WEIGHTS.load}). Missing inputs are left out and the rest re-weighted. Green from ${READINESS_GREEN_AT}, red at ${READINESS_RED_AT} or below. Amber blocks load increases; red also drops a set. Under ${READINESS_CALIBRATING_DAYS} days of history it says "calibrating".`,
      inputs: ['check-in (sleep quality, mood, soreness)', 'sleep minutes', 'resting heart rate', 'HRV when a device sends it', 'recovery of the scheduled muscles', '7-day vs 28-day training load'],
      constants: { ...Object.fromEntries(Object.entries(READINESS_WEIGHTS).map(([k, v]) => [`weight_${k}`, v])), greenAt: READINESS_GREEN_AT, redAt: READINESS_RED_AT, calibratingDays: READINESS_CALIBRATING_DAYS },
      personal: { checkInDays: days, restingHrBaseline: rhr ?? 'none', healthDaysLogged: ctx.state.healthDays.length },
    };
  },
  progression: ctx => {
    const g = GOAL_BY_ID[ctx.state.goal];
    return {
      summary: `Reps first, then load. You add a rep until you reach the top of your goal's range (${g.mainReps[0]}–${g.mainReps[1]} for main lifts, ${g.accessoryReps[0]}–${g.accessoryReps[1]} for accessories), hit it twice without max effort, then take one small step up. Two sessions under the range at max effort means one step down. After more than ${REENTRY_DAYS} days away you repeat your last load once. Missing effort ratings lower confidence instead of counting as easy or hard. Amber readiness or a muscle under ${RECOVERY_HOLD_PCT}% recovered holds the load.`,
      inputs: ['your last sessions of the exercise', 'effort ratings', 'goal rep range', "today's readiness", 'recovery of the primary muscle', 'a lighter week or today’s adjustment', 'the equipment’s loadable steps'],
      constants: { mainRepsLow: g.mainReps[0], mainRepsHigh: g.mainReps[1], accessoryRepsLow: g.accessoryReps[0], accessoryRepsHigh: g.accessoryReps[1], reentryDays: REENTRY_DAYS, recoveryHoldPct: RECOVERY_HOLD_PCT, maxIncreaseShare: MAX_INCREASE_SHARE },
      personal: { goal: g.name },
    };
  },
  volume_bands: ctx => {
    const levels = trainingLevels(ctx.state.sessions, ctx.state.customExercises);
    const personal: Record<string, string> = {};
    for (const m of MUSCLE_IDS) if (levels[m].levelIndex > 0) { const b = volumeBands(levels[m].levelIndex, m); personal[muscleLabel(m)] = `${levels[m].level}: ${b[0]}–${b[1]} sets/week`; }
    return {
      summary: `Weekly effective sets per muscle: a set counts ${SET_WEIGHT.primary} for the main muscle and ${SET_WEIGHT.secondary} for a helper. Each muscle's band depends on its training level (how much you have trained it overall), from ${VOLUME_BANDS[0]![0]}–${VOLUME_BANDS[0]![1]} for new up to ${VOLUME_BANDS[VOLUME_BANDS.length - 1]![0]}–${VOLUME_BANDS[VOLUME_BANDS.length - 1]![1]}. Side delts and calves sit ${VOLUME_OFFSET.side_delts} higher, lower back ${-VOLUME_OFFSET.lower_back} lower. Under the band is a nudge; over it for two weeks can trigger a lighter week.`,
      inputs: ['every working set this week', 'each exercise’s primary and secondary muscles', 'your per-muscle training level'],
      constants: { primarySetWeight: SET_WEIGHT.primary, secondarySetWeight: SET_WEIGHT.secondary, ...Object.fromEntries(VOLUME_BANDS.flatMap((b, i) => [[`level${i}Low`, b[0]], [`level${i}High`, b[1]]])), sideDeltOffset: VOLUME_OFFSET.side_delts, calvesOffset: VOLUME_OFFSET.calves, lowerBackOffset: VOLUME_OFFSET.lower_back },
      personal,
    };
  },
  deload_trigger: () => ({
    summary: `A lighter week is offered when ${DELOAD_TRIGGER.stalledLifts} or more main lifts have plateaued or slipped, when effort drifts harder on ${DELOAD_TRIGGER.driftLifts} lifts while weekly volume keeps climbing, when a muscle runs above its band ${DELOAD_TRIGGER.overBandWeeks} weeks in a row while a lift has stalled, or when readiness was red on ${DELOAD_TRIGGER.readinessRedDays} of the last ${DELOAD_TRIGGER.readinessWindowDays} days. Accepted, it lasts ${DELOAD_DAYS} days with sets × ${DELOAD_SET_FACTOR} and loads × ${DELOAD_LOAD_FACTOR}, then closes itself.`,
    inputs: ['plateau status of main lifts', 'effort drift', 'weekly volume', 'readiness over the last 5 days'],
    constants: { plateauedLifts: DELOAD_TRIGGER.stalledLifts, readinessRedDays: DELOAD_TRIGGER.readinessRedDays, readinessWindowDays: DELOAD_TRIGGER.readinessWindowDays, overBandWeeks: DELOAD_TRIGGER.overBandWeeks, deloadDays: DELOAD_DAYS, setFactor: DELOAD_SET_FACTOR, loadFactor: DELOAD_LOAD_FACTOR },
    personal: {},
  }),
  e1rm: () => ({
    summary: `The strength estimate uses Epley with the effort label as reps in reserve: load × (1 + (reps + reps left) / ${EPLEY_DIVISOR}), where easy counts ${RIR_BY_EFFORT.easy} reps left, ideal ${RIR_BY_EFFORT.ideal} and max ${RIR_BY_EFFORT.max}. Only sets of ${E1RM_MAX_REPS} reps or fewer count, and sets of ${E1RM_FULL_WEIGHT_REPS + 1}–${E1RM_MAX_REPS} weigh half in trends. It's a guide, not a test.`,
    inputs: ['load', 'reps', 'effort'],
    constants: { epleyDivisor: EPLEY_DIVISOR, rirEasy: RIR_BY_EFFORT.easy, rirIdeal: RIR_BY_EFFORT.ideal, rirMax: RIR_BY_EFFORT.max, maxReps: E1RM_MAX_REPS, halfWeightAboveReps: E1RM_FULL_WEIGHT_REPS },
    personal: {},
  }),
  plateau: () => ({
    summary: `Looks at the last ${PLATEAU_WINDOW} sessions of a lift (needs at least ${PLATEAU_MIN_SESSIONS}). If the top load trends up, or holds while volume rises, it is progressing. A flat load with flat volume is a plateau; a falling load is declining. Confidence grows with more points.`,
    inputs: ['top load per session', 'session volume'],
    constants: { sessionsLooked: PLATEAU_WINDOW, sessionsNeeded: PLATEAU_MIN_SESSIONS },
    personal: {},
  }),
  effort_calibration: ctx => {
    const obs = mainLiftIds(ctx).flatMap(id => rirObservations(exerciseHistory(ctx.state.sessions, id, ctx.state.customExercises)));
    const bias = effortBiasByLabel(obs);
    return {
      summary: `When a later max-effort set shows how many reps you really had left, the app compares it with how you rated earlier sets at that load. After ${BIAS_MIN_OBSERVATIONS} such observations per label it learns your bias (capped at ±${BIAS_CAP_REPS} reps) and points it out in a coach tip. Strength estimates keep the standard reps-left values.`,
      inputs: ['sets rated easy or ideal', 'later max-effort sets at the same load'],
      constants: { assumedRirEasy: RIR_BY_EFFORT.easy, assumedRirIdeal: RIR_BY_EFFORT.ideal, observationsNeeded: BIAS_MIN_OBSERVATIONS, biasCap: BIAS_CAP_REPS },
      personal: Object.fromEntries(bias.map(b => [`${b.effort} bias (reps)`, r2(b.bias)])),
    };
  },
  warmup: () => ({
    summary: `Before a main lift: ${WARMUP_PCTS.map((p, i) => `${Math.round(p * 100)}% × ${WARMUP_REPS[i]}`).join(', ')} of your first working set, snapped to loads the equipment has; a step at or above the working load is left out.`,
    inputs: ['your first working set for the lift', 'equipment profile'],
    constants: Object.fromEntries(WARMUP_PCTS.flatMap((p, i) => [[`set${i + 1}Pct`, p], [`set${i + 1}Reps`, WARMUP_REPS[i]!]])),
    personal: {},
  }),
  hr_rest: ctx => {
    const rhr = restingHr(ctx.state.healthDays, ctx.state.profile, ctx.today);
    return {
      summary: `With a live watch and heart-rate rest on, rest ends when heart rate falls to the lower of (pre-set bpm + ${REST_RISE_BPM}) and (resting + ${REST_RESERVE_PCT} × reserve), but never before ${MIN_REST_SEC.easy} s after an easy set, ${MIN_REST_SEC.ideal} s ideal or ${MIN_REST_SEC.max} s max. A stale signal falls back to the timer.`,
      inputs: ['live heart rate', 'bpm before the set', 'resting heart rate', 'max heart rate', 'the set’s effort'],
      constants: { riseBpm: REST_RISE_BPM, reservePct: REST_RESERVE_PCT, minEasySec: MIN_REST_SEC.easy, minIdealSec: MIN_REST_SEC.ideal, minMaxSec: MIN_REST_SEC.max },
      personal: { restingHr: rhr ?? 'unknown', restMode: ctx.state.preferences.rest.mode },
    };
  },
  hr_zones: ctx => {
    const max = hrMax(ctx.state.profile, null, ctx.now);
    const rhr = restingHr(ctx.state.healthDays, ctx.state.profile, ctx.today);
    const z = rhr != null ? zones(max.bpm, rhr) : null;
    return {
      summary: `Zones use heart-rate reserve (max minus resting): zone floors at ${ZONE_RESERVE_PCTS.map(p => `${Math.round(p * 100)}%`).join(', ')} of reserve above resting. Max heart rate is your own setting, else your highest observed, else ${TANAKA.intercept} − ${TANAKA.perYear} × age.`,
      inputs: ['max heart rate (setting, observed or age-based)', 'resting heart rate'],
      constants: { ...Object.fromEntries(ZONE_RESERVE_PCTS.map((p, i) => [`zone${i + 1}Floor`, p])), tanakaIntercept: TANAKA.intercept, tanakaPerYear: TANAKA.perYear },
      personal: { hrMax: max.bpm, hrMaxSource: max.source, restingHr: rhr ?? 'unknown', ...(z ? Object.fromEntries(z.map((b, i) => [`zone${i + 1}FromBpm`, b])) : {}) },
    };
  },
  energy: ctx => {
    const bmr = bmrKcalPerDay(ctx.state.profile, ctx.today);
    return {
      summary: 'Session calories come from Health Connect when it has them, else the watch’s energy, else a heart-rate estimate using your weight, age and sex. Active calories subtract your resting metabolism (Mifflin-St Jeor) for the same minutes. Each session freezes the profile used, so history does not shift when your weight changes.',
      inputs: ['Health Connect active calories', 'watch energy', 'heart rate', 'weight, age, sex, height'],
      constants: {},
      personal: { restingKcalPerDay: bmr != null ? Math.round(bmr) : 'needs weight, height, age and sex', age: ageFor(ctx.state.profile, ctx.today) ?? 'unknown' },
    };
  },
  fidelity: ctx => {
    const recent = ctx.state.sessions.slice(-10);
    const live = recent.filter(s => s.logging?.mode === 'live').length;
    return {
      summary: `Each set is "live" when logged ${LIVE_GAP_SEC[0]}–${LIVE_GAP_SEC[1]} s after the previous one; ${BURST_COUNT}+ sets within 15 s are a burst, logged after the fact. A session logged faster than ${COMPRESSED_SEC_PER_SET} s per set asks when you really trained. Timing insights (rest, density) only use sessions whose timing can be trusted; content (loads, reps, records) counts either way.`,
      inputs: ['time between set commits', 'session length vs sets'],
      constants: { liveGapMinSec: LIVE_GAP_SEC[0], liveGapMaxSec: LIVE_GAP_SEC[1], burstCount: BURST_COUNT, compressedSecPerSet: COMPRESSED_SEC_PER_SET },
      personal: { liveSessionsOfLast10: live, sessionsLooked: recent.length },
    };
  },
  records: () => ({
    summary: 'A record is the heaviest load, best strength estimate, more reps at a load, most reps, longest hold or furthest carry for an exercise, beating everything logged before it. Records start from the second session of an exercise.',
    inputs: ['every working set per exercise'],
    constants: { firstSessionCounts: 0 },
    personal: {},
  }),
  balance: () => ({
    summary: `Over the last ${BALANCE.weeks} weeks the app compares effective sets for pushing vs pulling muscles, and upper vs lower body. It speaks up only when one side is at least ${BALANCE.ratio}× the other with enough total work (${BALANCE.minTotalSets}+ sets) and it persisted in ${BALANCE.persistWeeks} of ${BALANCE.weeks} weeks; muscles you chose to focus on soften it.`,
    inputs: ['weekly effective sets per muscle', 'split focus muscles'],
    constants: { ...BALANCE },
    personal: {},
  }),
  weekly_review: ctx => ({
    summary: `Shown after ${WEEKLY_REVIEW_DAYS} or more training days in a calendar week: hard sets per muscle against productive ranges, frequency, failure share, rep mix for your goal, strength trend against what is typical for your training age, stale lifts, adherence to your schedule, and your weight trend against your goal’s rate.`,
    inputs: ['this week’s sessions', 'goal', 'training age', 'schedule', 'weigh-ins'],
    constants: { daysNeeded: WEEKLY_REVIEW_DAYS, levels: LEVELS.length },
    personal: { goal: GOAL_BY_ID[ctx.state.goal].name, age: ageOf(ctx.state.profile, ctx.now) ?? 'unknown' },
  }),
};

/** ES-12: personal numbers that come from health or body data leave the answer when that sharing is off. */
const HEALTH_KEYS = new Set(['restingHrBaseline', 'healthDaysLogged', 'restingHr']);
const BODY_KEYS = new Set(['restingKcalPerDay']);

export function explainMethod(topic: MethodId, ctx: ToolCtx): MethodExplanation {
  const b = METHODS[topic](ctx);
  const { health, body } = ctx.state.escobar.sharing;
  if (health && body) return { topic, ...b };
  const personal = Object.fromEntries(Object.entries(b.personal ?? {}).filter(([k]) => {
    if (!health && (HEALTH_KEYS.has(k) || /^zone\d+FromBpm$/.test(k))) return false;
    if (!health && k === 'hrMax' && b.personal?.hrMaxSource !== 'tanaka') return false;
    if (!body && BODY_KEYS.has(k)) return false;
    return true;
  }));
  return { topic, ...b, personal };
}

/** The method index sent in the manifest (§7.3): topic → one line. */
export const METHOD_INDEX: Record<MethodId, string> = {
  recovery: 'Per-muscle recovery % and hours until ready',
  readiness: "Today's readiness score and band",
  progression: 'Next-session targets: reps first, then load',
  volume_bands: 'Weekly effective sets per muscle and the band',
  deload_trigger: 'When a lighter week is offered and what it does',
  e1rm: 'The strength estimate from a set',
  plateau: 'Progressing, plateaued or declining',
  effort_calibration: 'Learning your effort-rating bias',
  warmup: 'Warm-up ramp',
  hr_rest: 'Rest that ends by heart rate',
  hr_zones: 'Heart-rate zones and max heart rate',
  energy: 'Session calories',
  fidelity: 'Live vs after-the-fact logging',
  records: 'Personal records',
  balance: 'Push/pull and upper/lower balance',
  weekly_review: 'The weekly review',
};
