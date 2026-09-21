/**
 * Run every detector and planner over one context and assemble the
 * FindingsReport. Each detector runs in isolation so one failure never
 * hides the rest. Low-confidence findings are dropped except where the
 * gate itself is the confidence. Proposals the user has dismissed twice
 * are suppressed.
 */
import { CONTRACT_VERSION, type Finding, type FindingKind, type FindingsReport, type Proposal, type ProposalKind } from './contract';
import type { BrainContext } from './context';
import { FIRST_SESSIONS_COUNT, MAX_SWAPS_PER_REPORT } from './bands';
import { daysBetween } from '@/core/dates';
import {
  CONFIDENCE_RANK, adjustedRecovery, detectBalance, detectEffortDrift, detectEffortMismatch, detectEffortMissing, detectFirstSessions, detectGap,
  detectChronicSkip, detectFocus, detectHabit, detectNoteFlags, detectProgress, detectReadiness, detectRecords, detectRedundant, detectRepRangeMismatch, detectSetsOutOfBand,
  detectSleep, detectUncovered, detectUnderRecovered, detectVolumeTrend, effortCoverage, learnHabits, weeksOfData,
} from './detectors';
import { planAdditions, planDeload, planLoad, planRedundancy, planRest, planSchedule, planSkips, planSplitNew, planSwaps, planToday, usageProfile } from './planners';

/** Kinds whose gate is the confidence, so a low value is still worth reporting. */
const LOW_OK: ReadonlySet<FindingKind> = new Set<FindingKind>(['first_sessions', 'long_gap', 'record', 'effort_missing', 'habit_pattern', 'chronic_skip']);

/** After accepting a suggestion, the same one stays away for this many days. */
export const ACCEPT_COOLDOWN_DAYS: Record<ProposalKind, number> = {
  today_plan: 1, schedule: 14, exercise_swap: 28, add_exercise: 28, split_modify: 28, split_new: 28, load_next: 0, rest_default: 60, deload_week: 42,
};

const PROPOSAL_ORDER: ProposalKind[] = ['today_plan', 'schedule', 'deload_week', 'exercise_swap', 'add_exercise', 'split_modify', 'split_new', 'rest_default', 'load_next'];

function safe<T>(label: string, fn: () => T[]): T[] {
  try { return fn(); } catch (err) { console.warn(`coach: ${label} failed`, err); return []; }
}

export function dataQuality(ctx: BrainContext): FindingsReport['dataQuality'] {
  const weeks = weeksOfData(ctx.sessions, ctx.today);
  const { coverage } = effortCoverage(ctx.sessions, 3);
  return {
    sessions: ctx.sessions.length,
    weeksOfData: weeks,
    effortCoverage: Math.round(coverage * 100) / 100,
    insufficientData: ctx.sessions.length < FIRST_SESSIONS_COUNT || weeks < 2,
  };
}

export function buildReport(ctx: BrainContext): FindingsReport {
  const recovery = adjustedRecovery(ctx);
  const habit = learnHabits(ctx.sessions, ctx.splits, ctx.today);
  const profile = usageProfile(ctx.sessions, ctx.custom, ctx.today);

  const raw: Finding[] = [
    ...safe('volume', () => detectVolumeTrend(ctx)),
    ...safe('band', () => detectSetsOutOfBand(ctx)),
    ...safe('uncovered', () => detectUncovered(ctx)),
    ...safe('progress', () => detectProgress(ctx)),
    ...safe('records', () => detectRecords(ctx)),
    ...safe('recovery', () => detectUnderRecovered(ctx, recovery)),
    ...safe('effort-missing', () => detectEffortMissing(ctx)),
    ...safe('effort-drift', () => detectEffortDrift(ctx)),
    ...safe('effort-mismatch', () => detectEffortMismatch(ctx)),
    ...safe('rep-range', () => detectRepRangeMismatch(ctx)),
    ...safe('redundant', () => detectRedundant(ctx)),
    ...safe('balance', () => detectBalance(ctx)),
    ...safe('gap', () => detectGap(ctx)),
    ...safe('first', () => detectFirstSessions(ctx)),
    ...safe('sleep', () => detectSleep(ctx)),
    ...safe('readiness', () => detectReadiness(ctx)),
    ...safe('habit', () => detectHabit(ctx, habit)),
    ...safe('focus', () => detectFocus(ctx)),
    ...safe('notes', () => detectNoteFlags(ctx)),
    ...safe('chronic-skip', () => detectChronicSkip(ctx)),
  ];
  const seen = new Set<string>();
  const findings = raw
    .filter(f => f.confidence !== 'low' || LOW_OK.has(f.kind))
    .filter(f => { if (seen.has(f.id)) return false; seen.add(f.id); return true; })
    .sort((a, b) => b.severity - a.severity || CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence] || a.id.localeCompare(b.id));

  const habitFinding = findings.find(f => f.kind === 'habit_pattern');
  const today = safe('today', () => { const p = planToday(ctx, recovery, findings); return p ? [p] : []; })[0] ?? null;
  const swaps = safe('swaps', () => planSwaps(ctx, findings, recovery, profile));
  const redundancy = safe('redundancy', () => planRedundancy(ctx, findings, profile));
  const alreadyRemoved = new Set(redundancy.flatMap(item => item.apply.kind === 'split_modify' ? item.apply.remove : []));
  const swapped = new Set(swaps.flatMap(item => item.apply.kind === 'exercise_swap' ? [item.apply.fromExerciseId] : []));
  const skips = safe('skip-plans', () => planSkips(ctx, findings, profile, Math.max(0, MAX_SWAPS_PER_REPORT - swaps.length)))
    .filter(item => item.apply.kind === 'exercise_swap' ? !swapped.has(item.apply.fromExerciseId)
      : item.apply.kind !== 'split_modify' || !item.apply.remove.some(id => alreadyRemoved.has(id)));
  const candidates: Proposal[] = [
    ...(today ? [today] : []),
    ...safe('schedule', () => { const p = planSchedule(ctx, habit, habitFinding); return p ? [p] : []; }),
    ...safe('deload', () => { const p = planDeload(ctx, findings); return p ? [p] : []; }),
    ...swaps,
    ...skips,
    ...safe('additions', () => planAdditions(ctx, findings, profile)),
    ...redundancy,
    ...safe('split-new', () => { const p = planSplitNew(ctx, findings, habit); return p ? [p] : []; }),
    ...safe('rest', () => { const p = planRest(ctx); return p ? [p] : []; }),
    ...safe('load', () => planLoad(ctx, findings, today)),
  ];
  const seenP = new Set<string>();
  const proposals = candidates
    .filter(p => (ctx.dismissed[p.dismissKey] ?? 0) < 2)
    .filter(p => { const day = ctx.accepted[p.dismissKey]; return !day || daysBetween(day, ctx.today) >= ACCEPT_COOLDOWN_DAYS[p.kind]; })
    .filter(p => { if (seenP.has(p.id)) return false; seenP.add(p.id); return true; })
    .sort((a, b) => PROPOSAL_ORDER.indexOf(a.kind) - PROPOSAL_ORDER.indexOf(b.kind) || a.id.localeCompare(b.id));

  return {
    version: CONTRACT_VERSION,
    generatedAt: new Date(ctx.now).toISOString(),
    today: ctx.today,
    dataQuality: dataQuality(ctx),
    findings,
    proposals,
  };
}
