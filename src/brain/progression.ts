/**
 * What to do next session for one exercise. Every answer has a plain-words
 * reason. The rules, in order:
 *  1. Nothing logged yet            → start light.
 *  2. More than 28 days away        → return at the last load, no increase.
 *  3. Effort missing on most sets   → repeat and log effort before changing.
 *  4. Two sessions in a row under the range at max effort → take one step down.
 *  5. Top of the range, no max effort, twice in a row → add one step.
 *  6. Top of the range once          → confirm it once more.
 *  7. Trend clearly down             → keep the load, easier week, then rebuild.
 *  8. Otherwise                      → add a rep.
 */
import type { Deload, EquipmentProfile, Exercise, LoadUnit, LoggedSet, ResistanceMode, Session } from '@/core/models';
import { loadableNear, loadableTopKg } from './units';
import { kgToDisplay } from '@/core/units';
import { GOAL_BY_ID, type GoalId } from '@/data/goals';
import { CARRY_OR_SLED_IDS, findExercise, startingLoadKg } from '@/core/exercises';
import { daysSinceLast, exerciseHistory, modeOf, type ExerciseSessionSummary } from './history';
import { plateauStatus } from './trend';
import { daysBetween } from '@/core/dates';

export type Mode = 'start' | 'reentry' | 'confirm_effort' | 'reduce' | 'increase' | 'confirm' | 'reps' | 'hold' | 'duration' | 'distance' | 'plateau' | 'deload';

export interface Suggestion {
  mode: Mode;
  /** The headline target, e.g. "62.5 kg · 6–8 reps". */
  target: string;
  kg: number | null;
  reps: [number, number] | null;
  reason: string;
  confidence: 'low' | 'medium' | 'high';
  /** Set-by-set targets for the next session. */
  sets: Array<{ kg: number | null; reps: number | null; durationSec: number | null; note: string }>;
  /** With an equipment profile (§25.4): the target in the equipment's own unit, e.g. 55 lb. */
  unit?: LoadUnit;
  value?: number;
}

/** More than this many days away: repeat the last load once. */
export const REENTRY_DAYS = 28;
/** Primary-muscle recovery under this % holds the load. */
export const RECOVERY_HOLD_PCT = 60;
/** A load step never adds more than this share of the current load (from 10 kg up). */
export const MAX_INCREASE_SHARE = 0.1;

export function loadStep(kg: number): number {
  if (kg <= 10) return 1;
  if (kg <= 30) return 2;
  return 2.5;
}

const half = (v: number) => Math.round(v * 2) / 2;

export function repRange(exercise: Exercise | undefined, goal: GoalId): [number, number] {
  const g = GOAL_BY_ID[goal];
  return exercise?.role === 'main' ? g.mainReps : g.accessoryReps;
}

/** True when the max-effort e1RM dropped 5% or more from the prior session at max effort too. */
function e1rmDownAtMax(cur: ExerciseSessionSummary, prior: ExerciseSessionSummary): boolean {
  return cur.hasMax && prior.hasMax && prior.bestE1rm > 0 && cur.bestE1rm > 0 && cur.bestE1rm <= prior.bestE1rm * 0.95;
}

function fmtRange(r: [number, number]): string {
  return `${r[0]}–${r[1]} reps`;
}

function confidenceFrom(n: number): Suggestion['confidence'] {
  return n >= 7 ? 'high' : n >= 4 ? 'medium' : 'low';
}

function setPlan(count: number, kg: number | null, reps: number | null, durationSec: number | null, note: string): Suggestion['sets'] {
  return Array.from({ length: Math.max(1, Math.min(6, count)) }, () => ({ kg, reps, durationSec, note }));
}

export interface ProgressionContext {
  /** From brain/readiness.ts's readiness(). Red skips increases and drops a set; amber only blocks the increase. */
  readiness?: { loadAdvice: 'normal' | 'no_increase' | 'reduce'; reason?: string } | null;
  /** From brain/recovery.ts's recoveryStatus() for the exercise's primary muscle, 0-100. */
  recoveryPct?: number;
  /** Active lighter week (F3.3). Takes priority over readiness and recovery: it's a whole-week call, not a single day's. */
  deload?: Deload | null;
  /** What the equipment really loads (§25.4). Targets snap to it: up for increases, down for reductions and deloads. */
  equipment?: EquipmentProfile;
  /** Today's load change from an applied Escobar adjustment (§10.4), applied like a deload's loadFactor. */
  loadFactor?: number;
}

const SNAP_DIRECTION: Partial<Record<Mode, 'up' | 'down'>> = { increase: 'up', reduce: 'down', deload: 'down' };

/**
 * Restates a suggestion's loads as loads the equipment can make, in its own unit.
 * QA3-11b: `force` overrides the mode-based direction. A carry/sled (mode 'distance'/'duration')
 * has no direction of its own in SNAP_DIRECTION, so without a genuine reduction in effect it snaps
 * 'nearest' like anything else - blanket 'down' rounded a normal-week 32 kg carry down to 30 for no
 * reason, and swallowed an Escobar increase entirely.
 */
function snapToEquipment(s: Suggestion, profile: EquipmentProfile, conditioning = false, force?: 'up' | 'down'): Suggestion {
  if (s.kg == null) return s;
  // QA3-3: a conditioning load above the ladder's range keeps the logged weight. A heavier
  // trap-bar carry must not be capped down to the dumbbell rack's top just because the equipment
  // field groups them together.
  // QA3-3b: still restated in the profile's own unit, or an lb user sees a rounded-kg conversion
  // (225 lb read back as "224.9 lb") instead of their own clean number.
  if (conditioning && s.kg > loadableTopKg(profile) + 0.01) {
    const value = kgToDisplay(s.kg, profile.unit);
    const oldLabel = `${s.kg} kg`;
    return { ...s, unit: profile.unit, value, target: s.target.includes(oldLabel) ? s.target.replace(oldLabel, `${value} ${profile.unit}`) : s.target };
  }
  const dir = force ?? SNAP_DIRECTION[s.mode] ?? 'nearest';
  const snap = loadableNear(s.kg, profile, dir);
  const oldLabel = `${s.kg} kg`;
  return {
    ...s,
    kg: snap.kg,
    unit: snap.unit,
    value: snap.value,
    target: s.target.includes(oldLabel) ? s.target.replace(oldLabel, `${snap.value} ${snap.unit}`) : s.target,
    sets: s.sets.map(x => (x.kg == null ? x : { ...x, kg: loadableNear(x.kg, profile, dir).kg })),
  };
}

/** Scales a suggestion's loads by today's adjustment factor (§10.4), rounding down like a deload. */
function applyLoadFactor(s: Suggestion, f: number): Suggestion {
  if (s.kg == null || !(f > 0) || f === 1) return s;
  const down = half(s.kg * f);
  const oldLabel = `${s.kg} kg`;
  return { ...s, kg: down, target: s.target.replace(oldLabel, `${down} kg`), reason: `${s.reason} Adjusted for today.`, sets: s.sets.map(x => (x.kg == null ? x : { ...x, kg: half(x.kg * f) })) };
}

export function suggestNext(sessions: Session[], exerciseId: string, goal: GoalId, today: string, plannedSets = 3, custom: Exercise[] = [], ctx?: ProgressionContext): Suggestion {
  let s = suggestRaw(sessions, exerciseId, goal, today, plannedSets, custom, ctx);
  if (ctx?.loadFactor != null) s = applyLoadFactor(s, ctx.loadFactor);
  // QA2-FE-2, QA2-FE-7: a loaded carry's target snaps to the gym's equipment too (70 lb, not 31.751 kg).
  const mode = modeOf(exerciseId, custom);
  if (ctx?.equipment && (mode === 'weighted' || (mode === 'conditioning' && s.kg != null))) {
    // QA3-11b: force the snap down only for a genuine reduction (a lighter week, or an Escobar
    // cut factor below 1) - never up, and never at all in a normal week.
    const force = ctx.deload || (ctx.loadFactor != null && ctx.loadFactor > 0 && ctx.loadFactor < 1) ? 'down' : undefined;
    s = snapToEquipment(s, ctx.equipment, mode === 'conditioning', force);
  }
  return s;
}

function suggestRaw(sessions: Session[], exerciseId: string, goal: GoalId, today: string, plannedSets = 3, custom: Exercise[] = [], ctx?: ProgressionContext): Suggestion {
  const meta = findExercise(exerciseId, custom);
  const mode: ResistanceMode = modeOf(exerciseId, custom);
  const range = repRange(meta, goal);
  const hist = exerciseHistory(sessions, exerciseId, custom);
  const last = hist[hist.length - 1];
  const setCount = last?.sets.length || plannedSets;

  if (!last) {
    const start = startingLoadKg(meta?.equipment ?? '');
    if (mode === 'duration') return { mode: 'start', target: 'Hold 20–30s', kg: null, reps: null, reason: 'First time. Hold for a comfortable 20 to 30 seconds and note how it felt.', confidence: 'low', sets: setPlan(setCount, null, null, 30, 'Start here') };
    if (mode === 'bodyweight' || start.kg == null) return { mode: 'start', target: `Start light · ${fmtRange(range)}`, kg: null, reps: range, reason: start.note, confidence: 'low', sets: setPlan(setCount, null, range[0], null, 'Start here') };
    return { mode: 'start', target: `${start.kg} kg · ${fmtRange(range)}`, kg: start.kg, reps: range, reason: start.note, confidence: 'low', sets: setPlan(setCount, start.kg, range[0], null, 'Start here') };
  }

  const conf = confidenceFrom(hist.length);
  const gap = daysSinceLast(hist, today) ?? 0;

  if (mode === 'duration') {
    const best = last.bestDurationSec || 20;
    const next = last.hasMax ? best : best + 5;
    return { mode: 'duration', target: `Hold ${next}s`, kg: null, reps: null, reason: last.hasMax ? 'Last hold was max effort. Repeat it before adding time.' : 'Add five seconds to your best hold.', confidence: conf, sets: setPlan(setCount, null, null, next, last.hasMax ? 'Repeat' : 'Add 5s') };
  }

  // QA-R6-5: a carry or sled logged by distance or time progresses by distance or time, never "1 reps".
  // QA2-FE-8: only a carry or sled; a rep-based conditioning move (a burpee) logged with a time keeps its rep goal.
  // QA3-12: decided by which exercise this is (CARRY_OR_SLED_IDS), not by which fields were filled -
  // a timed carry or sled logged with reps too still gets its distance/time goal, never a rep one.
  if (mode === 'conditioning' && CARRY_OR_SLED_IDS.has(exerciseId) && (last.bestDistanceM > 0 || last.bestDurationSec > 0)) {
    const byDistance = last.bestDistanceM > 0;
    const best = byDistance ? last.bestDistanceM : last.bestDurationSec;
    // QA3-3b: with an equipment profile to restate against later, keep the raw kg so an lb entry
    // (already stored to 3 decimals) round-trips to its own clean number instead of a half-kg one.
    const kg = last.topKg > 0 ? (ctx?.deload ? half(last.topKg * ctx.deload.loadFactor) : ctx?.equipment ? last.topKg : half(last.topKg)) : null;
    const load = kg != null ? `${kg} kg · ` : '';
    const u = byDistance ? ' m' : 's';
    const step = byDistance ? (best >= 100 ? 10 : 5) : 5;
    const repeat = !!ctx?.deload || gap > REENTRY_DAYS || last.hasMax;
    const next = repeat ? best : best + step;
    const reason = ctx?.deload ? 'Lighter week: the same distance at a lighter load, kept easy.'
      : gap > REENTRY_DAYS ? `It has been ${gap} days. Repeat your last ${byDistance ? 'distance' : 'time'} once before adding anything.`
      : last.hasMax ? `Last one was max effort. Match it before going ${byDistance ? 'further' : 'longer'}.`
      : byDistance ? `Go ${step} m further at the same load.` : 'Add five seconds at the same load.';
    const note = repeat ? (ctx?.deload ? 'Deload' : 'Match it') : `+${step}${u}`;
    return { mode: byDistance ? 'distance' : 'duration', target: `${load}${next}${u}`, kg, reps: null, reason, confidence: gap > REENTRY_DAYS ? 'low' : conf, sets: setPlan(setCount, kg, null, byDistance ? null : next, note) };
  }

  if (gap > REENTRY_DAYS) {
    return { mode: 'reentry', target: mode === 'weighted' ? `${last.topKg} kg · ${fmtRange(range)}` : `${fmtRange(range)}`, kg: last.topKg || null, reps: range, reason: `It has been ${gap} days. Repeat your last load once before adding anything.`, confidence: 'low', sets: setPlan(setCount, last.topKg || null, range[0], null, 'Return session') };
  }

  if (ctx?.deload) {
    const d = ctx.deload;
    const dayN = Math.min(7, Math.max(1, daysBetween(d.startDay, today) + 1));
    const reason = `Lighter week, day ${dayN} of 7.`;
    const deloadSets = Math.max(1, Math.round(setCount * d.setFactor));
    if (mode === 'bodyweight' || mode === 'assisted' || mode === 'conditioning') {
      const reps = last.bestReps;
      return { mode: 'deload', target: `${reps} reps · easy`, kg: null, reps: [reps, reps], reason, confidence: conf, sets: setPlan(deloadSets, null, reps, null, 'Deload') };
    }
    const down = half(last.topKg * d.loadFactor);
    return { mode: 'deload', target: `${down} kg · ${fmtRange(range)}`, kg: down, reps: range, reason, confidence: conf, sets: setPlan(deloadSets, down, range[0], null, 'Deload') };
  }

  const recent = hist.slice(-3);
  const coverage = recent.reduce((a, r) => a + r.effortCoverage, 0) / recent.length;

  if (mode === 'bodyweight' || mode === 'assisted' || mode === 'conditioning') {
    const reps = last.bestReps;
    const nextReps = last.hasMax ? reps : reps + 1;
    return { mode: 'reps', target: `${nextReps} reps`, kg: null, reps: [nextReps, nextReps], reason: last.hasMax ? 'Last set was max effort. Match it before adding a rep.' : 'Add one rep to your best set.', confidence: conf, sets: setPlan(setCount, null, nextReps, null, last.hasMax ? 'Match it' : 'Add a rep') };
  }

  const topKg = last.topKg;
  const holdSets = (note: string, reps = Math.min(range[1], Math.max(range[0], last.topReps + 1))) => setPlan(setCount, topKg, reps, null, note);
  const holdTarget = `${topKg} kg · ${fmtRange(range)}`;

  if (ctx?.readiness?.loadAdvice === 'reduce') {
    const fewer = Math.max(1, setCount - 1);
    return { mode: 'hold', target: holdTarget, kg: topKg, reps: range, reason: ctx.readiness.reason ?? 'Readiness is low today. Keep the load and drop a set.', confidence: conf, sets: setPlan(fewer, topKg, range[0], null, 'Readiness: one fewer set') };
  }

  if (coverage < 0.5 && hist.length >= 2) {
    return { mode: 'confirm_effort', target: holdTarget, kg: topKg, reps: range, reason: 'Most recent sets have no effort rating. Keep the load and rate each set so the coach can judge the next step.', confidence: 'low', sets: holdSets('Log effort') };
  }

  const prev = hist[hist.length - 2];
  const prev2 = hist[hist.length - 3];
  // A range starting at 1-2 reps can never see "reps under the range" at max effort, so a
  // falling e1RM over two consecutive max-effort sessions is the step-down signal instead.
  const belowAtMax = (r: ExerciseSessionSummary) => r.hasMax && r.topReps < range[0];
  const stepDown = range[0] <= 2
    ? !!prev && !!prev2 && e1rmDownAtMax(last, prev) && e1rmDownAtMax(prev, prev2)
    : !!prev && belowAtMax(last) && belowAtMax(prev);
  if (stepDown) {
    const down = Math.max(0, half(topKg - loadStep(topKg)));
    const reason = range[0] <= 2
      ? 'Your estimated one-rep max has dropped at max effort for two sessions running. Take one step down and rebuild.'
      : 'Two sessions in a row under the rep range at max effort. Take one step down and rebuild reps.';
    return { mode: 'reduce', target: `${down} kg · ${fmtRange(range)}`, kg: down, reps: range, reason, confidence: conf, sets: setPlan(setCount, down, range[0], null, 'Ease one step') };
  }

  const plateau = plateauStatus(hist);
  if (plateau.status === 'declining' && plateau.confidence !== 'low') {
    return { mode: 'plateau', target: `${topKg} kg · ${range[0]}–${range[0] + 2} reps`, kg: topKg, reps: [range[0], range[0] + 2], reason: 'Progress has slipped over recent sessions. Keep this load, stop short of max effort for a week, then build back up.', confidence: plateau.confidence, sets: holdSets('Lighter week', range[0]) };
  }
  const cleanTop = (r: ExerciseSessionSummary) => r.topReps >= range[1] && !r.hasMax && r.effortCoverage > 0;
  if (cleanTop(last)) {
    const twoForTwo = !!prev && cleanTop(prev) && prev.topKg === topKg;
    const fastTrack = last.allEasy && hist.length >= 4;
    const readinessBlocksIncrease = ctx?.readiness?.loadAdvice === 'no_increase' || (ctx?.recoveryPct != null && ctx.recoveryPct < RECOVERY_HOLD_PCT);
    if ((twoForTwo || fastTrack) && plateau.status !== 'declining' && !readinessBlocksIncrease) {
      const step = loadStep(topKg);
      const capped = topKg >= 10 ? Math.min(step, topKg * MAX_INCREASE_SHARE) : step;
      const up = half(topKg + Math.max(0.5, capped));
      return { mode: 'increase', target: `${up} kg · ${fmtRange(range)}`, kg: up, reps: range, reason: twoForTwo ? 'Top of the range two sessions running without max effort. Add one step.' : 'All sets felt easy at the top of the range. Add one step.', confidence: conf, sets: setPlan(setCount, up, range[0], null, 'Small load increase') };
    }
    if ((twoForTwo || fastTrack) && plateau.status !== 'declining' && readinessBlocksIncrease) {
      return { mode: 'confirm', target: holdTarget, kg: topKg, reps: [range[1], range[1]], reason: ctx?.readiness?.reason ?? 'Recovery is under 60% for this muscle, so the load holds for now.', confidence: conf, sets: holdSets('Hold for now', range[1]) };
    }
    return { mode: 'confirm', target: holdTarget, kg: topKg, reps: [range[1], range[1]], reason: 'You reached the top of the range once. Do it again at this load and the next step unlocks.', confidence: conf, sets: holdSets('Confirm', range[1]) };
  }

  if (plateau.status === 'plateaued' && plateau.confidence !== 'low') {
    return { mode: 'plateau', target: holdTarget, kg: topKg, reps: range, reason: 'This lift has not moved for a while. Try a different rep range or one lighter week, then rebuild.', confidence: plateau.confidence, sets: holdSets('Change it up') };
  }

  const nextReps = Math.min(range[1], Math.max(range[0], last.topReps + 1));
  return { mode: 'hold', target: `${topKg} kg · ${nextReps} reps`, kg: topKg, reps: [nextReps, nextReps], reason: last.hasMax ? 'Last set was max effort. Keep the load and aim for one more clean rep.' : 'Keep the load and add a rep. Reps first, then load.', confidence: conf, sets: holdSets('Build reps', nextReps) };
}

/** The previous set at the same position, for the "last time" hint while logging. */
export function previousSet(sessions: Session[], exerciseId: string, setIndex: number, custom: Exercise[] = []): LoggedSet | null {
  const hist = exerciseHistory(sessions, exerciseId, custom);
  const last = hist[hist.length - 1];
  if (!last) return null;
  return last.sets[Math.min(setIndex, last.sets.length - 1)] ?? null;
}
