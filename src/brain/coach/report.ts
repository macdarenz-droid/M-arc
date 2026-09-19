/**
 * Run every detector and planner over one context and assemble the
 * FindingsReport. Each detector runs in isolation so one failure never
 * hides the rest. Low-confidence findings are dropped except where the
 * gate itself is the confidence. Proposals the user has dismissed twice
 * are suppressed.
 */
import { CONTRACT_VERSION, type Finding, type FindingKind, type FindingsReport, type Proposal, type ProposalKind } from './contract';
import type { BrainContext } from './context';
import { FIRST_SESSIONS_COUNT } from './bands';
import {
  CONFIDENCE_RANK, adjustedRecovery, detectBalance, detectEffortDrift, detectEffortMismatch, detectEffortMissing, detectFirstSessions, detectGap,
  detectHabit, detectProgress, detectRecords, detectRedundant, detectRepRangeMismatch, detectSetsOutOfBand, detectSleep, detectUncovered,
  detectUnderRecovered, detectVolumeTrend, effortCoverage, learnHabits, weeksOfData,
} from './detectors';
import { planAdditions, planDeload, planLoad, planRedundancy, planRest, planSchedule, planSplitNew, planSwaps, planToday, usageProfile } from './planners';

/** Kinds whose gate is the confidence, so a low value is still worth reporting. */
const LOW_OK: ReadonlySet<FindingKind> = new Set<FindingKind>(['first_sessions', 'long_gap', 'record', 'effort_missing', 'habit_pattern']);

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
    ...safe('habit', () => detectHabit(ctx, habit)),
  ];
  const seen = new Set<string>();
  const findings = raw
    .filter(f => f.confidence !== 'low' || LOW_OK.has(f.kind))
    .filter(f => { if (seen.has(f.id)) return false; seen.add(f.id); return true; })
    .sort((a, b) => b.severity - a.severity || CONFIDENCE_RANK[b.confidence] - CONFIDENCE_RANK[a.confidence] || a.id.localeCompare(b.id));

  const habitFinding = findings.find(f => f.kind === 'habit_pattern');
  const today = safe('today', () => { const p = planToday(ctx, recovery, findings); return p ? [p] : []; })[0] ?? null;
  const candidates: Proposal[] = [
    ...(today ? [today] : []),
    ...safe('schedule', () => { const p = planSchedule(ctx, habit, habitFinding); return p ? [p] : []; }),
    ...safe('deload', () => { const p = planDeload(ctx, findings); return p ? [p] : []; }),
    ...safe('swaps', () => planSwaps(ctx, findings, recovery, profile)),
    ...safe('additions', () => planAdditions(ctx, findings, profile)),
    ...safe('redundancy', () => planRedundancy(ctx, findings, profile)),
    ...safe('split-new', () => { const p = planSplitNew(ctx, findings, habit); return p ? [p] : []; }),
    ...safe('rest', () => { const p = planRest(ctx); return p ? [p] : []; }),
    ...safe('load', () => planLoad(ctx, findings, today)),
  ];
  const seenP = new Set<string>();
  const proposals = candidates
    .filter(p => (ctx.dismissed[p.dismissKey] ?? 0) < 2)
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
