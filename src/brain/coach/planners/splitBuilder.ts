/**
 * A deterministic split builder. Picks a structure by days per week, fills
 * each day by movement pattern so every major muscle is covered, keeps
 * weekly effective sets per muscle inside the band, gives focus muscles
 * extra sets spread over at least two days, and prefers the equipment and
 * exercises the user already uses. The language model never designs this;
 * it only explains it. Rests on volume_dose_response and
 * frequency_secondary_to_volume.
 */
import type { Exercise, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import type { GoalId } from '@/data/goals';
import { MUSCLE_BY_ID, MUSCLE_IDS, type MuscleId } from '@/data/muscles';
import { findExercise } from '@/core/exercises';
import { SET_WEIGHT, rolesFor } from '../../exposure';
import type { Finding, Proposal, SplitDraft } from '../contract';
import type { BrainContext } from '../context';
import { WEEKLY_SETS_HIGH } from '../bands';
import type { HabitModel } from '../detectors/habit';
import { allExercises, candidatesFor, pickExercise, usageProfile, proposal, type UsageProfile } from './shared';

interface Slot { muscle: MuscleId; patterns: string[]; sets: number }
interface DayTemplate { key: string; name: string; slots: Slot[]; lower: boolean }

const slot = (muscle: MuscleId, sets: number, ...patterns: string[]): Slot => ({ muscle, sets, patterns });

const PUSH: DayTemplate = { key: 'push', name: 'Push', lower: false, slots: [
  slot('chest', 3, 'horizontal_push'), slot('upper_chest', 3, 'incline_push'), slot('front_delts', 3, 'vertical_push'),
  slot('side_delts', 3, 'shoulder_abduction'), slot('triceps', 3, 'elbow_extension'), slot('chest', 2, 'chest_adduction'),
] };
const PULL: DayTemplate = { key: 'pull', name: 'Pull', lower: false, slots: [
  slot('lats', 3, 'vertical_pull'), slot('mid_back', 3, 'horizontal_pull'), slot('rear_delts', 3, 'horizontal_abduction'),
  slot('biceps', 3, 'elbow_flexion'), slot('upper_traps', 2, 'scapular_elevation'), slot('brachialis', 2, 'elbow_flexion'),
] };
const LEGS: DayTemplate = { key: 'legs', name: 'Legs', lower: true, slots: [
  slot('quads', 3, 'squat'), slot('hamstrings', 3, 'hip_hinge'), slot('quads', 2, 'knee_extension'), slot('hamstrings', 2, 'knee_flexion'),
  slot('glutes', 2, 'hip_extension'), slot('calves', 3, 'plantar_flexion'), slot('abs', 3, 'spinal_flexion'),
] };
const UPPER: DayTemplate = { key: 'upper', name: 'Upper', lower: false, slots: [
  slot('chest', 3, 'horizontal_push'), slot('lats', 3, 'vertical_pull'), slot('front_delts', 3, 'vertical_push'), slot('mid_back', 3, 'horizontal_pull'),
  slot('side_delts', 2, 'shoulder_abduction'), slot('biceps', 2, 'elbow_flexion'), slot('triceps', 2, 'elbow_extension'),
] };
const LOWER: DayTemplate = { key: 'lower', name: 'Lower', lower: true, slots: [
  slot('quads', 3, 'squat'), slot('hamstrings', 3, 'hip_hinge'), slot('glutes', 2, 'lunge', 'single_leg_squat', 'hip_extension'),
  slot('hamstrings', 2, 'knee_flexion'), slot('calves', 3, 'plantar_flexion'), slot('abs', 3, 'spinal_flexion', 'hip_flexion'),
] };
const FULL_A: DayTemplate = { key: 'full_a', name: 'Full body A', lower: true, slots: [
  slot('quads', 3, 'squat'), slot('chest', 3, 'horizontal_push'), slot('mid_back', 3, 'horizontal_pull'),
  slot('side_delts', 2, 'shoulder_abduction'), slot('biceps', 2, 'elbow_flexion'), slot('calves', 2, 'plantar_flexion'),
] };
const FULL_B: DayTemplate = { key: 'full_b', name: 'Full body B', lower: true, slots: [
  slot('hamstrings', 3, 'hip_hinge'), slot('front_delts', 3, 'vertical_push'), slot('lats', 3, 'vertical_pull'),
  slot('rear_delts', 2, 'horizontal_abduction'), slot('triceps', 2, 'elbow_extension'), slot('abs', 3, 'spinal_flexion'),
] };

/** Patterns that target each muscle directly, for focus accessories. */
export const PATTERNS_FOR_MUSCLE: Record<MuscleId, string[]> = {
  chest: ['horizontal_push', 'chest_adduction', 'incline_push'], upper_chest: ['incline_push', 'chest_adduction'],
  front_delts: ['vertical_push', 'shoulder_flexion'], side_delts: ['shoulder_abduction', 'vertical_push'], rear_delts: ['horizontal_abduction', 'horizontal_pull'],
  rotator_cuff: ['shoulder_external_rotation'], biceps: ['elbow_flexion'], triceps: ['elbow_extension'], brachialis: ['elbow_flexion'], forearms: ['wrist_flexion', 'carry'],
  lats: ['vertical_pull', 'shoulder_extension', 'horizontal_pull'], mid_back: ['horizontal_pull'], upper_traps: ['scapular_elevation'], lower_back: ['hip_hinge'],
  abs: ['spinal_flexion', 'hip_flexion'], obliques: ['anti_lateral_flexion', 'rotation', 'anti_rotation'], core: ['anti_extension', 'anti_rotation'], hip_flexors: ['hip_flexion'],
  quads: ['squat', 'knee_extension', 'lunge', 'single_leg_squat'], hamstrings: ['hip_hinge', 'knee_flexion'], glutes: ['hip_extension', 'hip_hinge', 'lunge', 'single_leg_squat', 'hip_abduction'],
  adductors: ['hip_adduction'], abductors: ['hip_abduction'], calves: ['plantar_flexion'],
};

function structureFor(days: number): Array<{ template: DayTemplate; variant: 'A' | 'B'; name: string }> {
  const d = Math.max(1, Math.min(6, days));
  const a = (t: DayTemplate, name = t.name) => ({ template: t, variant: 'A' as const, name });
  const b = (t: DayTemplate, name: string) => ({ template: t, variant: 'B' as const, name });
  switch (d) {
    case 1: return [a(FULL_A, 'Full body')];
    case 2: return [a(FULL_A), a(FULL_B)];
    case 3: return [a(PUSH), a(PULL), a(LEGS)];
    case 4: return [a(UPPER, 'Upper A'), a(LOWER, 'Lower A'), b(UPPER, 'Upper B'), b(LOWER, 'Lower B')];
    case 5: return [a(PUSH), a(PULL), a(LEGS), a(UPPER), a(LOWER)];
    default: return [a(PUSH, 'Push A'), a(PULL, 'Pull A'), a(LEGS, 'Legs A'), b(PUSH, 'Push B'), b(PULL, 'Pull B'), b(LEGS, 'Legs B')];
  }
}

const DEFAULT_DAYS: Record<number, Weekday[]> = {
  1: ['wed'], 2: ['mon', 'thu'], 3: ['mon', 'wed', 'fri'], 4: ['mon', 'tue', 'thu', 'fri'], 5: ['mon', 'tue', 'wed', 'fri', 'sat'], 6: ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'],
};

export interface SplitBuilderInput {
  goal: GoalId;
  daysPerWeek: number;
  focus: MuscleId[];
  custom: Exercise[];
  profile: UsageProfile;
  /** Weekdays to place the splits on, in order. Defaults by day count. */
  days?: Weekday[];
}

export interface BuiltPlan {
  splits: SplitDraft[];
  weeklySetsByMuscle: Partial<Record<MuscleId, number>>;
  daysPerWeek: number;
}

function weeklySets(splits: SplitDraft[], custom: Exercise[]): Partial<Record<MuscleId, number>> {
  const out: Partial<Record<MuscleId, number>> = {};
  for (const s of splits) for (const e of s.exercises) {
    const meta = findExercise(e.exerciseId, custom);
    if (!meta) continue;
    for (const r of rolesFor(meta)) {
      const w = SET_WEIGHT[r.role];
      if (w) out[r.muscle] = Math.round(((out[r.muscle] ?? 0) + e.sets * w) * 2) / 2;
    }
  }
  return out;
}

export function buildSplits(input: SplitBuilderInput): BuiltPlan {
  const daysPerWeek = Math.max(1, Math.min(6, Math.round(input.daysPerWeek) || 3));
  const structure = structureFor(daysPerWeek);
  const all = allExercises(input.custom);
  const focus = input.focus.slice(0, 2);
  const placed = new Map<string, number>();
  const drafts: Array<{ name: string; template: DayTemplate; exercises: Array<{ exerciseId: string; sets: number; muscle: MuscleId }> }> = [];

  for (const day of structure) {
    const chosen = new Set<string>();
    const exercises: Array<{ exerciseId: string; sets: number; muscle: MuscleId }> = [];
    for (const s of day.template.slots) {
      const cands = candidatesFor(all, s.muscle, s.patterns);
      const pick = pickExercise({ candidates: cands.length ? cands : candidatesFor(all, s.muscle), profile: input.profile, exclude: chosen, penalize: placed })
        ?? pickExercise({ candidates: all.filter(x => s.patterns.includes(x.pattern)), profile: input.profile, exclude: chosen, penalize: placed });
      if (!pick) continue;
      chosen.add(pick.id);
      placed.set(pick.id, (placed.get(pick.id) ?? 0) + (day.variant === 'B' ? 4 : 1.5));
      const sets = s.sets + (focus.includes(s.muscle) ? 1 : 0);
      exercises.push({ exerciseId: pick.id, sets: Math.min(5, sets), muscle: s.muscle });
    }
    drafts.push({ name: day.name, template: day.template, exercises });
  }

  // Focus muscles get direct work on at least two days when the week allows it.
  if (daysPerWeek >= 2) {
    for (const m of focus) {
      const hits = (d: typeof drafts[number]) => d.exercises.some(e => findExercise(e.exerciseId, input.custom)?.primary.includes(m));
      let daysHit = drafts.filter(hits).length;
      const lower = MUSCLE_BY_ID[m].bucket === 'lower';
      const hosts = drafts.filter(d => !hits(d) && (lower ? d.template.lower : true)).sort((a, b) => a.exercises.length - b.exercises.length);
      for (const host of hosts) {
        if (daysHit >= 2) break;
        const chosen = new Set(host.exercises.map(e => e.exerciseId));
        const pick = pickExercise({ candidates: candidatesFor(all, m, PATTERNS_FOR_MUSCLE[m]), profile: input.profile, exclude: chosen, penalize: placed });
        if (!pick) continue;
        host.exercises.push({ exerciseId: pick.id, sets: 3, muscle: m });
        placed.set(pick.id, (placed.get(pick.id) ?? 0) + 1.5);
        daysHit++;
      }
    }
  }

  const days = input.days && input.days.length >= daysPerWeek ? input.days.slice(0, daysPerWeek) : (DEFAULT_DAYS[daysPerWeek] ?? DEFAULT_DAYS[3]!);
  const toDraft = (): SplitDraft[] => drafts.map((d, i) => ({
    name: d.name,
    focus: focus.filter(m => d.exercises.some(e => findExercise(e.exerciseId, input.custom)?.primary.includes(m))).slice(0, 2),
    exercises: d.exercises.map(e => ({ exerciseId: e.exerciseId, sets: e.sets })),
    days: [days[i] ?? WEEKDAYS[(i * 2) % 7]!],
  }));

  // Keep every muscle under the weekly band by trimming accessory sets, last day first.
  let totals = weeklySets(toDraft(), input.custom);
  for (let guard = 0; guard < 40; guard++) {
    const over = MUSCLE_IDS.find(m => (totals[m] ?? 0) > WEEKLY_SETS_HIGH);
    if (!over) break;
    let trimmed = false;
    for (const d of [...drafts].reverse()) {
      const target = [...d.exercises].reverse().find(e => e.sets > 2 && findExercise(e.exerciseId, input.custom)?.primary.includes(over));
      if (target) { target.sets--; trimmed = true; break; }
    }
    if (!trimmed) break;
    totals = weeklySets(toDraft(), input.custom);
  }

  return { splits: toDraft(), weeklySetsByMuscle: totals, daysPerWeek };
}

/** Days per week: the schedule if set, else learned habit days, else sessions per week, else three. */
export function inferDaysPerWeek(ctx: BrainContext, habit: HabitModel): { days: number; weekdays: Weekday[] } {
  const scheduled = WEEKDAYS.filter(d => ctx.schedule[d]);
  if (scheduled.length) return { days: scheduled.length, weekdays: scheduled };
  const learned = WEEKDAYS.filter(d => habit.days[d]);
  if (learned.length) return { days: learned.length, weekdays: learned };
  if (habit.sessionsPerWeek >= 1) return { days: Math.round(habit.sessionsPerWeek), weekdays: [] };
  return { days: 3, weekdays: [] };
}

/** Automatic proposal: only when the user has no usable split, or their programme leaves several major muscles untouched. */
export function planSplitNew(ctx: BrainContext, findings: Finding[], habit: HabitModel): Proposal | null {
  const usable = ctx.splits.filter(s => s.exercises.length);
  const uncovered = findings.filter(f => f.kind === 'uncovered_muscle');
  if (usable.length && uncovered.length < 3) return null;
  const { days, weekdays } = inferDaysPerWeek(ctx, habit);
  const input: SplitBuilderInput = { goal: ctx.goal, daysPerWeek: days, focus: ctx.splits.flatMap(s => s.focus).slice(0, 2), custom: ctx.custom, profile: usageProfile(ctx.sessions, ctx.custom, ctx.today) };
  if (weekdays.length) input.days = weekdays;
  const plan = buildSplits(input);
  if (!plan.splits.length) return null;
  return proposal({
    kind: 'split_new', subject: {},
    apply: { kind: 'split_new', splits: plan.splits, weeklySetsByMuscle: plan.weeklySetsByMuscle, daysPerWeek: plan.daysPerWeek },
    basedOn: uncovered.map(f => f.id), confidence: usable.length ? 'medium' : 'low',
  });
}
