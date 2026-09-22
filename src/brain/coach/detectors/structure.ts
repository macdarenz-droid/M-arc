/**
 * Programme structure: near-duplicate exercises inside a split, and the
 * push/pull and upper/lower balance over three weeks.
 */
import { findExercise } from '@/core/exercises';
import { isMuscleId } from '@/data/muscles';
import { trainingBalance } from '../../balance';
import type { Finding } from '../contract';
import type { BrainContext } from '../context';
import { addDays, weekStart } from '@/core/dates';
import { evidenceFrom, finding, round1 } from './shared';

export function detectRedundant(ctx: BrainContext): Finding[] {
  const out: Finding[] = [];
  for (const split of ctx.splits) {
    const groups = new Map<string, string[]>();
    for (const e of split.exercises) {
      const meta = findExercise(e.exerciseId, ctx.custom);
      if (!meta || !meta.pattern || meta.pattern === 'other' || !meta.primary[0]) continue;
      const key = `${meta.primary[0]}|${meta.pattern}`;
      groups.set(key, [...(groups.get(key) ?? []), meta.id]);
    }
    for (const [key, ids] of groups) {
      if (ids.length < 2) continue;
      const [muscle, pattern] = key.split('|') as [string, string];
      out.push(finding({
        kind: 'redundant_exercises', target: `${split.id}:${key}`,
        subject: { splitId: split.id, splitName: split.name, ...(isMuscleId(muscle) ? { muscle } : {}) },
        metrics: { count: ids.length, exerciseIds: ids.join(','), pattern },
        from: ctx.today, to: ctx.today, confidence: 'high', severity: ids.length >= 3 ? 1 : 0,
        evidence: { sessionIds: [], days: [] },
      }));
    }
  }
  return out;
}

export function detectBalance(ctx: BrainContext): Finding[] {
  const focus = ctx.splits.flatMap(s => s.focus);
  const b = trainingBalance(ctx.sessions, ctx.today, ctx.custom, focus);
  if (!b) return [];
  const from = addDays(weekStart(ctx.today), -14);
  const recent = ctx.sessions.filter(s => s.day >= from && s.day <= ctx.today);
  return [finding({
    kind: 'balance_imbalance', target: b.pair, subject: {},
    metrics: { pair: b.pair, strong: b.strong, weak: b.weak, ratio: round1(Math.min(b.ratio, 99)), ratioLabel: b.ratioLabel, weeks: b.weeks, severityScore: round1(b.severity) },
    from, to: ctx.today, weeks: 3,
    confidence: b.weeks >= 3 ? 'high' : 'medium', severity: b.ratio >= 3 ? 2 : 1,
    evidence: evidenceFrom(recent),
  })];
}
