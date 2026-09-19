/**
 * Focus muscles the user chose on a split: is this week's direct work on
 * track against their own usual week? A small bump over baseline is the
 * target; big jumps do not help (volume_dose_response).
 */
import type { MuscleId } from '@/data/muscles';
import { MUSCLE_BY_ID } from '@/data/muscles';
import { addDays, weekStart } from '@/core/dates';
import { weeklyMuscleSets } from '../../exposure';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { evidenceFrom, finding, median, round1 } from './shared';

export function focusTarget(baseline: number): number {
  const step = Math.min(3, Math.max(1, baseline * 0.15));
  return Math.round(Math.min(baseline * 1.2, baseline + step) * 2) / 2;
}

export function detectFocus(ctx: BrainContext): Finding[] {
  const focus = [...new Set(ctx.splits.flatMap(s => s.focus))] as MuscleId[];
  if (!focus.length) return [];
  const weeks = weeklyMuscleSets(ctx.sessions, ctx.today, 5, ctx.custom);
  const current = weeks[0]?.sets ?? {};
  const start = weekStart(ctx.today);
  const evidence = evidenceFrom(ctx.sessions.filter(s => s.day >= start && s.day <= ctx.today));
  const out: Finding[] = [];
  for (const m of focus) {
    const prior = weeks.slice(1).map(w => w.sets[m] ?? 0).filter(v => v > 0);
    if (prior.length < 3) continue;
    const baseline = median(prior);
    const target = focusTarget(baseline);
    const now = current[m] ?? 0;
    if (now >= target) continue;
    out.push(finding({
      kind: 'focus_behind', target: m, subject: { muscle: m, muscleGroup: MUSCLE_BY_ID[m].group },
      metrics: { currentSets: round1(now), targetSets: target, baselineSets: round1(baseline), daysLeft: Math.max(0, 6 - Math.round((new Date(ctx.today).getTime() - new Date(start).getTime()) / 86_400_000)) },
      from: start, to: addDays(start, 6), weeks: 1, confidence: prior.length >= 4 ? 'high' : 'medium', severity: 1, evidence,
    }));
  }
  return out;
}
