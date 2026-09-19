/**
 * Small edits to what the user already does: swap a stalled lift for a
 * sibling, add an exercise for a muscle nobody is training, drop a
 * near-duplicate. Rests on exercise_variation, volume_dose_response and
 * push_pull_balance.
 */
import type { Split } from '@/core/models';
import { MUSCLE_BY_ID, type BalanceBucket, type MuscleId } from '@/data/muscles';
import { findExercise } from '@/core/exercises';
import type { Finding, Proposal } from '../contract';
import type { BrainContext } from '../context';
import { COMPOUND_PATTERN, MAX_SWAPS_PER_REPORT } from '../bands';
import { CONFIDENCE_RANK } from '../detectors/shared';
import type { AdjustedRecovery } from '../detectors/recovery';
import { allExercises, candidatesFor, pickExercise, proposal, recentPainMuscles, usageProfile, type UsageProfile } from './shared';

function splitContaining(ctx: BrainContext, exerciseId: string): Split | undefined {
  return ctx.splits.find(s => s.exercises.some(e => e.exerciseId === exerciseId));
}

/** A stall over weeks is not explained by yesterday's session, so recovery does not hide swaps; `recovery` is kept for callers. */
export function planSwaps(ctx: BrainContext, findings: Finding[], _recovery: AdjustedRecovery[], profile = usageProfile(ctx.sessions, ctx.custom, ctx.today)): Proposal[] {
  const out: Proposal[] = [];
  // Compounds first, then confidence, then name: a stalled main lift matters more than a stalled curl.
  const plateaus = findings
    .filter(f => f.kind === 'plateau' && f.confidence !== 'low' && f.subject.exerciseId)
    .map(f => ({ f, meta: findExercise(f.subject.exerciseId!, ctx.custom) }))
    .sort((a, b) => Number(COMPOUND_PATTERN.test(b.meta?.pattern ?? '')) - Number(COMPOUND_PATTERN.test(a.meta?.pattern ?? ''))
      || CONFIDENCE_RANK[b.f.confidence] - CONFIDENCE_RANK[a.f.confidence] || (a.meta?.name ?? '').localeCompare(b.meta?.name ?? ''));
  for (const { f, meta } of plateaus) {
    if (out.length >= MAX_SWAPS_PER_REPORT) break;
    if (!meta || meta.custom || meta.pattern === 'other' || !meta.primary[0]) continue;
    const split = splitContaining(ctx, meta.id);
    if (!split) continue; // no longer part of any split: nothing to swap
    const exclude = new Set([meta.id, ...split.exercises.map(e => e.exerciseId)]);
    const candidates = allExercises(ctx.custom).filter(x => x.pattern === meta.pattern && x.primary[0] === meta.primary[0]);
    const pick = pickExercise({ candidates, profile, exclude, preferFresh: true });
    if (!pick) continue;
    const apply: Proposal['apply'] = { kind: 'exercise_swap', fromExerciseId: meta.id, toExerciseId: pick.id, splitId: split.id };
    out.push(proposal({
      kind: 'exercise_swap', subject: { exerciseId: meta.id, exerciseName: meta.name, splitId: split.id, splitName: split.name },
      apply, basedOn: [f.id], confidence: f.confidence,
    }));
  }
  return out;
}

const BUCKET_TARGET: Record<string, { muscle: MuscleId; patterns: string[] }> = {
  Pull: { muscle: 'lats', patterns: ['vertical_pull', 'horizontal_pull'] },
  Push: { muscle: 'chest', patterns: ['horizontal_push', 'incline_push'] },
  'Lower body': { muscle: 'glutes', patterns: ['hip_extension', 'lunge', 'single_leg_squat', 'squat', 'hip_hinge'] },
  'Upper body': { muscle: 'lats', patterns: ['vertical_pull', 'horizontal_pull', 'horizontal_push'] },
};

/** "primary|pattern" keys already present in a split, so additions never create a near-duplicate. */
function patternKeys(split: Split, ctx: BrainContext): Set<string> {
  const keys = new Set<string>();
  for (const e of split.exercises) {
    const m = findExercise(e.exerciseId, ctx.custom);
    if (m?.primary[0]) keys.add(`${m.primary[0]}|${m.pattern}`);
  }
  return keys;
}

function bucketShare(split: Split, ctx: BrainContext, bucket: BalanceBucket): number {
  let total = 0, hit = 0;
  for (const e of split.exercises) {
    const m = findExercise(e.exerciseId, ctx.custom)?.primary[0];
    if (!m) continue;
    total++;
    if (MUSCLE_BY_ID[m].bucket === bucket) hit++;
  }
  return total ? hit / total : 0;
}

/** The split where an exercise for `muscle` fits best: most same-bucket work, then fewest exercises. */
function hostSplit(ctx: BrainContext, muscle: MuscleId): Split | undefined {
  const bucket = MUSCLE_BY_ID[muscle].bucket;
  const splits = ctx.splits.filter(s => s.exercises.length < 10);
  return [...splits].sort((a, b) => bucketShare(b, ctx, bucket) - bucketShare(a, ctx, bucket) || a.exercises.length - b.exercises.length || a.name.localeCompare(b.name))[0];
}

export function planAdditions(ctx: BrainContext, findings: Finding[], profile: UsageProfile = usageProfile(ctx.sessions, ctx.custom, ctx.today)): Proposal[] {
  if (!ctx.splits.length) return [];
  const out: Proposal[] = [];
  const all = allExercises(ctx.custom);
  const seen = new Set<MuscleId>();
  const avoid = recentPainMuscles(findings);
  const programmeHas = (muscle: MuscleId) => ctx.splits.some(s => s.exercises.some(e => findExercise(e.exerciseId, ctx.custom)?.primary.includes(muscle)));
  const add = (muscle: MuscleId, patterns: string[], basedOn: string[], confidence: Proposal['confidence']) => {
    if (seen.has(muscle) || programmeHas(muscle) || avoid.has(muscle)) return; // already programmed, or recently flagged painful — never pile more direct work on it automatically
    const split = hostSplit(ctx, muscle);
    if (!split) return;
    const exclude = new Set(split.exercises.map(e => e.exerciseId));
    const taken = patternKeys(split, ctx);
    const fresh = (list: typeof all) => list.filter(x => !taken.has(`${x.primary[0]}|${x.pattern}`));
    const pick = pickExercise({ candidates: fresh(candidatesFor(all, muscle, patterns)), profile, exclude }) ?? pickExercise({ candidates: fresh(candidatesFor(all, muscle)), profile, exclude });
    if (!pick) return;
    seen.add(muscle);
    out.push(proposal({
      kind: 'add_exercise', subject: { muscle, muscleGroup: MUSCLE_BY_ID[muscle].group, splitId: split.id, splitName: split.name },
      apply: { kind: 'add_exercise', splitId: split.id, exerciseId: pick.id, sets: pick.defaultSets, muscle },
      basedOn, confidence,
    }));
  };
  for (const f of findings) {
    if (f.kind === 'uncovered_muscle' && f.subject.muscle) add(f.subject.muscle, [], [f.id], f.confidence);
  }
  for (const f of findings) {
    if (f.kind !== 'balance_imbalance') continue;
    const weak = String(f.metrics.weak ?? '');
    const target = BUCKET_TARGET[weak];
    if (target) add(target.muscle, target.patterns, [f.id], f.confidence);
  }
  return out;
}

export function planRedundancy(ctx: BrainContext, findings: Finding[], profile: UsageProfile = usageProfile(ctx.sessions, ctx.custom, ctx.today)): Proposal[] {
  const out: Proposal[] = [];
  const bySplit = new Map<string, string[]>();
  for (const f of findings) {
    if (f.kind !== 'redundant_exercises' || !f.subject.splitId) continue;
    const ids = String(f.metrics.exerciseIds ?? '').split(',').filter(Boolean);
    if (ids.length < 2) continue;
    const split = ctx.splits.find(s => s.id === f.subject.splitId);
    if (!split) continue;
    const order = new Map(split.exercises.map((e, i) => [e.exerciseId, i]));
    const drop = [...ids].sort((a, b) => (profile.useCount.get(a) ?? 0) - (profile.useCount.get(b) ?? 0) || (order.get(b) ?? 0) - (order.get(a) ?? 0))[0]!;
    bySplit.set(split.id, [...(bySplit.get(split.id) ?? []), drop]);
  }
  for (const [splitId, remove] of bySplit) {
    const split = ctx.splits.find(s => s.id === splitId)!;
    const basedOn = findings.filter(f => f.kind === 'redundant_exercises' && f.subject.splitId === splitId).map(f => f.id);
    out.push(proposal({
      kind: 'split_modify', subject: { splitId, splitName: split.name },
      apply: { kind: 'split_modify', splitId, add: [], remove, setChanges: [] },
      basedOn, confidence: 'high',
    }));
  }
  return out;
}
