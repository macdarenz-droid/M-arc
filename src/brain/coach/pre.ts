/**
 * Pre-session brief (6.13, cadence 'pre'): shown as a sheet when a session
 * starts. Each function is one catalogue row; preSessionInsights()
 * assembles the ones with enough evidence for the exercises in the split.
 */
import type { Exercise, Profile, Split } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { exerciseHistory } from '../history';
import { e1rmTrend } from './weeklyReview';
import { loadForReps, roundToStep } from '../e1rm';
import { loadableNear } from '../units';
import type { EquipmentProfile } from '@/core/models';
import type { Insight } from './rules';

export interface PreSessionInput {
  sessions: import('@/core/models').Session[];
  custom: Exercise[];
  today: string;
  split: Split;
  profile: Profile;
  age: number | null;
}

/** `load = e1RM_trend / (1 + (targetReps + 2) / 30)`, the ideal-effort assumption, ± 2.5%. */
export function workingLoadTarget(hist: ReturnType<typeof exerciseHistory>, exerciseId: string, exerciseName: string, targetReps: number): Insight | null {
  const withE1rm = hist.filter(h => h.bestE1rm > 0);
  if (withE1rm.length < 3) return null;
  const t = e1rmTrend(hist);
  if (t.direction === 'unknown') return null;
  const last = withE1rm[withE1rm.length - 1]!.bestE1rm;
  const load = roundToStep(loadForReps(last, targetReps + 2));
  const band = Math.round(load * 0.025 * 2) / 2;
  return {
    id: `pre:load-target:${exerciseId}`, category: 'progress', priority: 260, cadence: 'pre', kind: 'plan', exerciseId,
    title: `${exerciseName}: today's target load`,
    noticed: `${exerciseName} e1RM trending toward about ${Math.round(last)} kg.`,
    means: `For ${targetReps} at ideal effort, ${load - band} to ${load + band} kg should land right.`,
    action: `Start around ${load} kg.`,
    evidence: { n: withE1rm.length, window: `${withE1rm.length} sessions`, confidence: withE1rm.length >= 6 ? 'medium' : 'low' },
  };
}

export const WARMUP_PCTS = [0.5, 0.7, 0.85];
export const WARMUP_REPS = [8, 5, 2];

/** F3.4: 50% x 8, 70% x 5, 85% x 2 of the trend e1RM, rounded to a load step. Shared by the pre-session brief's text and Train's collapsed warm-up rows. */
export function warmupSets(e1rm: number, equipment?: EquipmentProfile): Array<{ kg: number; reps: number }> {
  return WARMUP_PCTS.map((p, i) => ({ kg: equipment ? loadableNear(e1rm * p, equipment, 'nearest').kg : roundToStep(e1rm * p), reps: WARMUP_REPS[i]! }));
}

export function warmupRamp(hist: ReturnType<typeof exerciseHistory>, exerciseId: string, exerciseName: string): Insight | null {
  const last = hist[hist.length - 1];
  if (!last || last.bestE1rm <= 0) return null;
  const steps = warmupSets(last.bestE1rm);
  return {
    id: `pre:warmup:${exerciseId}`, category: 'progress', priority: 120, cadence: 'pre', kind: 'tip', exerciseId,
    title: `${exerciseName}: warm-up ramp`,
    noticed: 'A short ramp before your working sets.',
    means: 'A gradual ramp readies the lift without adding real fatigue.',
    action: `${steps[0]!.kg} x ${steps[0]!.reps}, ${steps[1]!.kg} x ${steps[1]!.reps}, ${steps[2]!.kg} x ${steps[2]!.reps}, then your working sets.`,
    evidence: { n: 1, window: 'today', confidence: 'high' },
  };
}

/** Fixed copy for a 60+ profile, shown once per session start. */
export function mastersDefaults(age: number | null): Insight | null {
  if (age == null || age < 60) return null;
  return {
    id: 'pre:masters', category: 'data', priority: 110, cadence: 'pre', kind: 'data',
    title: 'A note for your age group',
    noticed: 'Guidelines for lifters 60 and over.',
    means: '2 to 3 sessions a week, 2 to 3 sets per muscle group, about 2 minutes rest, load steps of 5% or less.',
    action: 'About 1.0 to 1.2 g protein per kg a day, 1.6 if building muscle.',
    evidence: { n: 1, window: 'profile', confidence: 'high' },
  };
}

export function preSessionInsights(input: PreSessionInput, limit = 3): Insight[] {
  const { sessions, custom, split, profile, age } = input;
  const out: Insight[] = [];
  const masters = mastersDefaults(age ?? (profile.birthYear ? new Date().getFullYear() - profile.birthYear : null));
  if (masters) out.push(masters);

  let warmupShown = false;
  for (const se of split.exercises) {
    const meta = findExercise(se.exerciseId, custom);
    if (!meta || meta.mode !== 'weighted') continue;
    const hist = exerciseHistory(sessions, se.exerciseId, custom);
    if (!hist.length) continue;
    if (meta.role === 'main') {
      const target = workingLoadTarget(hist, se.exerciseId, meta.name, 8);
      if (target) out.push(target);
      if (!warmupShown) {
        const warmup = warmupRamp(hist, se.exerciseId, meta.name);
        if (warmup) { out.push(warmup); warmupShown = true; }
      }
    }
  }
  return out.sort((a, b) => b.priority - a.priority).slice(0, limit);
}
