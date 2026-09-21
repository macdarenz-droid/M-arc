/**
 * Brain work for the live session: questions the person asks mid-workout,
 * about the workout they are in. Pure and synchronous like the rest of
 * src/brain/ — plain data in, plain data out. It must never import from
 * @/app, @/slices, @/ui, @/native or @/core/store. Adjusted recovery and
 * the recent-pain muscle set are computed in the app layer and passed in
 * as `readiness` and `avoid`, not fetched from a selector.
 */
import type { ActiveSession, Effort, Exercise, ResistanceMode } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from './exposure';
import type { GoalId } from '@/data/goals';
import type { MuscleId } from '@/data/muscles';
import { suggestNext, type Suggestion } from './progression';
import { applyDeload } from './coach/deload';
import { equipmentGroup } from './coach/cues';
import type { BrainContext } from './coach/context';
import { allExercises, scoreExercise, usageProfile, type UsageProfile } from './coach/planners/shared';
import {
  COMPOUND_PATTERN,
  MAX_SUBSTITUTES,
  REST_CEIL_SEC,
  REST_COMPOUND_MULT,
  REST_EFFORT_MULT,
  REST_FLOOR_SEC,
  REST_ROUND_SEC,
  REST_STRENGTH_SEC,
  SUBSTITUTE_MIN_READY,
} from './coach/bands';

/**
 * Progress means the same thing inside this set of modes (more load, more
 * reps, less help), so they substitute for one another. A timed hold or a
 * conditioning drill does not stand in for a weighted press: the target
 * would be a different kind of number.
 */
const REP_PROGRESS_MODES: ReadonlySet<ResistanceMode> = new Set(['weighted', 'bodyweight', 'assisted']);
const sameModeFamily = (a: Exercise, b: Exercise): boolean =>
  a.mode === b.mode || (REP_PROGRESS_MODES.has(a.mode) && REP_PROGRESS_MODES.has(b.mode));

export interface Substitute {
  exerciseId: string;
  name: string;
  /** The library's own equipment string, shown verbatim. */
  equipment: string;
  /** Coarse equipment group used for spreading results and filtering occupied kit. */
  equipmentGroup: string;
  /** Whether movement pattern and lead muscle both match the original. */
  samePattern: boolean;
  /** Primary muscles shared with the original, in the original's order. */
  sharedPrimary: MuscleId[];
  /** The candidate's own next-session target, including an active easier week. */
  target: Suggestion;
  /** Number of sessions in which this exercise appears. */
  useCount: number;
}

export interface SubstituteOptions {
  mode?: 'any' | 'different_equipment';
  readiness?: (muscle: MuscleId) => number;
  minReady?: number;
  avoid?: ReadonlySet<MuscleId>;
  exclude?: ReadonlySet<string>;
  profile?: UsageProfile;
  max?: number;
}

export function substitutes(
  ctx: BrainContext,
  exerciseId: string,
  plannedSets: number,
  o: SubstituteOptions = {},
): Substitute[] {
  const origin = findExercise(exerciseId, ctx.custom);
  if (!origin || !origin.primary.length) return [];

  const mode = o.mode ?? 'any';
  const minReady = o.minReady ?? SUBSTITUTE_MIN_READY;
  const max = o.max ?? MAX_SUBSTITUTES;
  const originGroup = equipmentGroup(origin.equipment);
  const profile = o.profile ?? usageProfile(ctx.sessions, ctx.custom, ctx.today);
  const eligible = allExercises(ctx.custom).filter(ex => {
    if (ex.id === origin.id || o.exclude?.has(ex.id) || !ex.primary.length) return false;
    if (!ex.primary.some(muscle => origin.primary.includes(muscle))) return false;
    if (!sameModeFamily(origin, ex)) return false;
    if (o.avoid && ex.primary.some(muscle => o.avoid!.has(muscle))) return false;
    if (o.readiness && ex.primary.some(muscle => o.readiness!(muscle) < minReady)) return false;
    return mode !== 'different_equipment' || equipmentGroup(ex.equipment) !== originGroup;
  });

  const isTier1 = (ex: Exercise): boolean =>
    ex.pattern === origin.pattern && !!ex.primary[0] && ex.primary[0] === origin.primary[0];
  const rank = (pool: Exercise[]): Exercise[] => pool
    .map(ex => ({ ex, score: scoreExercise(ex, { candidates: pool, profile, preferFresh: false }) }))
    .sort((a, b) => b.score - a.score || a.ex.id.localeCompare(b.ex.id))
    .map(row => row.ex);
  const ordered = [
    ...rank(eligible.filter(isTier1)),
    ...rank(eligible.filter(ex => !isTier1(ex))),
  ];

  const chosen: Exercise[] = [];
  const groups = new Set<string>();
  for (const ex of ordered) {
    if (chosen.length >= max) break;
    const group = equipmentGroup(ex.equipment);
    if (groups.has(group)) continue;
    chosen.push(ex);
    groups.add(group);
  }
  for (const ex of ordered) {
    if (chosen.length >= max) break;
    if (!chosen.includes(ex)) chosen.push(ex);
  }
  chosen.sort((a, b) => ordered.indexOf(a) - ordered.indexOf(b));

  return chosen.map(ex => ({
    exerciseId: ex.id,
    name: ex.name,
    equipment: ex.equipment,
    equipmentGroup: equipmentGroup(ex.equipment),
    samePattern: isTier1(ex),
    sharedPrimary: origin.primary.filter(muscle => ex.primary.includes(muscle)),
    target: applyDeload(
      suggestNext(ctx.sessions, ex.id, ctx.goal, ctx.today, plannedSets, ctx.custom),
      ctx.deload,
      ctx.today,
    ),
    useCount: profile.useCount.get(ex.id) ?? 0,
  }));
}

export type RestReasonKind =
  | 'ungraded'
  | 'base'
  | 'easy'
  | 'max'
  | 'compound'
  | 'easy_compound'
  | 'max_compound'
  | 'strength_floor';

export interface RestGrade {
  seconds: number;
  deltaSec: number;
  reasonKind: RestReasonKind;
}

export interface RestInput {
  base: number;
  effort?: Effort;
  pattern: string;
  mode: ResistanceMode;
  goal: GoalId;
}

const clampRest = (seconds: number): number =>
  Math.max(REST_FLOOR_SEC, Math.min(REST_CEIL_SEC, Math.round(seconds)));

export function restFor(input: RestInput): RestGrade {
  const base = clampRest(input.base);
  if (!input.effort) return { seconds: base, deltaSec: 0, reasonKind: 'ungraded' };

  const compound = !!input.pattern && COMPOUND_PATTERN.test(input.pattern);
  const graded = base * REST_EFFORT_MULT[input.effort] * (compound ? REST_COMPOUND_MULT : 1);
  const strengthGoal = input.goal === 'strength' || input.goal === 'strength_muscle';
  const floored = strengthGoal && compound && input.mode === 'weighted'
    ? Math.max(graded, REST_STRENGTH_SEC)
    : graded;
  const seconds = clampRest(Math.round(floored / REST_ROUND_SEC) * REST_ROUND_SEC);

  let reasonKind: RestReasonKind;
  if (seconds === base) reasonKind = 'base';
  else if (floored > graded) reasonKind = 'strength_floor';
  else if (compound && input.effort === 'ideal') reasonKind = 'compound';
  else if (compound && input.effort === 'easy') reasonKind = 'easy_compound';
  else if (compound && input.effort === 'max') reasonKind = 'max_compound';
  else reasonKind = input.effort === 'easy' ? 'easy' : 'max';

  return { seconds, deltaSec: seconds - base, reasonKind };
}

export type RestNext =
  | { kind: 'set'; setNumber: number; kg: number | null; reps: number | null; durationSec: number | null }
  | { kind: 'next_exercise'; name: string }
  | { kind: 'session_end' };

export function nextAfterRest(
  entries: ActiveSession['entries'],
  from: { entry: number; set: number },
  suggestion: Suggestion | null,
): RestNext | null {
  if (!Number.isInteger(from.entry) || !Number.isInteger(from.set) || from.entry < 0 || from.set < 0) return null;
  const entry = entries[from.entry];
  if (!entry || entry.done || entry.skipped || from.set >= entry.sets.length) return null;
  const nextIndex = from.set + 1;
  if (nextIndex < entry.sets.length) {
    if (isWorkingSet(entry.sets[nextIndex]!)) return null;
    const target = suggestion?.sets[Math.min(nextIndex, suggestion.sets.length - 1)] ?? null;
    return {
      kind: 'set',
      setNumber: nextIndex + 1,
      kg: target?.kg ?? null,
      reps: target?.reps ?? null,
      durationSec: target?.durationSec ?? null,
    };
  }
  const upcoming = entries.slice(from.entry + 1).find(candidate => !candidate.done && !candidate.skipped);
  return upcoming ? { kind: 'next_exercise', name: upcoming.name } : { kind: 'session_end' };
}
