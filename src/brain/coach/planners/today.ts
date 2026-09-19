/**
 * Which split fits today, given recovery, the schedule, this week's volume
 * against the user's own baseline, and focus muscles. Offers a swap or a
 * modified version of the scheduled split. Rests on recovery_time_course
 * and frequency_secondary_to_volume.
 */
import type { Split } from '@/core/models';
import { MUSCLE_BY_ID, type MuscleId } from '@/data/muscles';
import { findExercise } from '@/core/exercises';
import { weekdayOf } from '@/core/dates';
import { weeklyMuscleSets } from '../../exposure';
import type { ExerciseChange, Finding, Proposal, SplitOption } from '../contract';
import type { BrainContext } from '../context';
import { RECOVERY_FLAG_PCT, RECOVERY_SWAP_PCT } from '../bands';
import type { AdjustedRecovery } from '../detectors/recovery';
import { median } from '../detectors/shared';
import { allExercises, pickExercise, proposal, recentPainMuscles, usageProfile } from './shared';

function primaries(split: Split, ctx: BrainContext): MuscleId[] {
  const out = new Set<MuscleId>();
  for (const e of split.exercises) for (const m of findExercise(e.exerciseId, ctx.custom)?.primary ?? []) out.add(m);
  return [...out];
}

export function planToday(ctx: BrainContext, recovery: AdjustedRecovery[], findings: Finding[]): Proposal | null {
  if (ctx.sessions.some(s => s.day === ctx.today)) return null;
  const splits = ctx.splits.filter(s => s.exercises.length);
  if (!splits.length) return null;
  const pct = new Map<MuscleId, number>(recovery.map(r => [r.muscle, r.adjustedPct]));
  const ready = (m: MuscleId) => pct.get(m) ?? 100;
  const weeks = weeklyMuscleSets(ctx.sessions, ctx.today, 5, ctx.custom);
  const current = weeks[0]?.sets ?? {};
  const prior = weeks.slice(1);
  const scheduledId = ctx.schedule[weekdayOf(ctx.today)];
  const avoid = recentPainMuscles(findings);

  const options: SplitOption[] = splits.map(split => {
    const ms = primaries(split, ctx);
    if (!ms.length) return { splitId: split.id, score: 0, readyMuscles: [], recoveringMuscles: [] };
    const readiness = ms.reduce((a, m) => a + Math.min(100, ready(m)), 0) / ms.length / 100;
    const recovering = ms.filter(m => ready(m) < RECOVERY_FLAG_PCT);
    let score = readiness - 0.5 * (recovering.length / ms.length);
    if (split.id === scheduledId) score += 0.2;
    for (const m of split.focus) {
      const vals = prior.map(w => w.sets[m] ?? 0).filter(v => v > 0);
      if (vals.length < 2) continue;
      const base = median(vals);
      const target = Math.min(base * 1.2, base + 3);
      if ((current[m] ?? 0) < target) { score += 0.15; break; }
    }
    const groups = new Set(ms.map(m => MUSCLE_BY_ID[m].group));
    for (const g of groups) {
      const sum = (sets: Partial<Record<MuscleId, number>>) => (Object.entries(sets) as Array<[MuscleId, number]>).filter(([m]) => MUSCLE_BY_ID[m].group === g).reduce((a, [, v]) => a + v, 0);
      const base = median(prior.map(w => sum(w.sets)));
      if (base >= 4 && sum(current) < base * 0.5) { score += 0.1; break; }
    }
    return { splitId: split.id, score: Math.round(score * 100) / 100, readyMuscles: ms.filter(m => ready(m) >= RECOVERY_FLAG_PCT), recoveringMuscles: recovering };
  }).sort((a, b) => b.score - a.score || a.splitId.localeCompare(b.splitId));

  const recommended = options[0]!;
  const likely = splits.find(s => s.id === scheduledId) ?? splits.find(s => s.id === recommended.splitId)!;
  const profile = usageProfile(ctx.sessions, ctx.custom, ctx.today);
  const inSplit = new Set(likely.exercises.map(e => e.exerciseId));
  const modifications: ExerciseChange[] = [];
  for (const e of likely.exercises) {
    const meta = findExercise(e.exerciseId, ctx.custom);
    const main = meta?.primary[0];
    if (!meta || !main) continue;
    const painFlagged = avoid.has(main);
    if (!painFlagged && ready(main) >= RECOVERY_SWAP_PCT) continue;
    const bucket = MUSCLE_BY_ID[main].bucket;
    // A candidate must not still land on an avoided muscle — pain isn't part of the readiness
    // model, so a muscle can read fully recovered by volume/time while still being the thing a
    // recent note flagged as hurting, and pickExercise's own readiness gate would not catch that.
    const candidates = allExercises(ctx.custom).filter(x => x.pattern !== 'other' && x.primary[0] && MUSCLE_BY_ID[x.primary[0]].bucket === bucket && x.id !== meta.id && !avoid.has(x.primary[0]));
    const pick = pickExercise({ candidates, profile, exclude: inSplit, readiness: ready, minReady: 90 });
    const change: ExerciseChange = { removeExerciseId: meta.id, reason: painFlagged ? 'note_flag' : 'under_recovered' };
    if (pick) change.replaceWithExerciseId = pick.id;
    modifications.push(change);
  }

  const differs = scheduledId ? recommended.splitId !== scheduledId : true;
  if (!differs && !modifications.length) return null;
  const involved = new Set<MuscleId>([...primaries(likely, ctx), ...recovery.filter(r => r.adjustedPct < RECOVERY_FLAG_PCT).map(r => r.muscle), ...avoid]);
  const basedOn = findings.filter(f => (f.kind === 'under_recovered' || f.kind === 'note_flag') && f.subject.muscle && involved.has(f.subject.muscle)).map(f => f.id);
  const personalized = recovery.some(r => involved.has(r.muscle) && r.personalized && r.adjustedPct < RECOVERY_FLAG_PCT);
  return proposal({
    kind: 'today_plan', subject: { splitId: likely.id, splitName: likely.name },
    apply: { kind: 'today_plan', recommendedSplitId: recommended.splitId, options, modifications },
    basedOn, confidence: personalized ? 'high' : 'medium', expiresOn: ctx.today,
  });
}
