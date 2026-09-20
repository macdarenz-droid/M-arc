/**
 * A compact, precomputed snapshot of "how things stand right now" — as
 * opposed to `FindingsReport`, which is exceptions only (a muscle is in the
 * report exactly when it's under-recovered, a lift only when it broke a
 * record). A real question like "which muscles are still sore" or "what's
 * my squat PR" has a normal, unremarkable answer most of the time, and an
 * exceptions-only report has nothing to ground that in — see
 * COACH_BRAIN.md's decision log entry for this module. Built once per /ask
 * call from the same BrainContext buildReport already has, reusing the
 * existing per-muscle recovery, PR and weekly-volume computations rather
 * than adding a second implementation of any of them.
 */
import type { BrainContext } from './coach/context';
import { deloadActive, type Deload } from './coach/deload';
import { allRecords, type PrKind } from './prs';
import { recoveryStatus, recoveryTier } from './recovery';
import { weeklyVolumeHistory } from './weekly';
import type { MuscleId } from '@/data/muscles';

export interface StatsRecovery {
  muscle: MuscleId;
  /** 0–100, 100 = fully recovered. */
  pct: number;
  tier: 'low' | 'mid' | 'high' | 'ready';
  hoursLeft: number;
}

export interface StatsPr {
  exerciseId: string;
  exerciseName: string;
  kind: PrKind;
  /** Plain words, e.g. "60 kg × 8" — same rendering prs.ts already uses. */
  detail: string;
  day: string;
}

export interface StatsWeek {
  start: string;
  end: string;
  sets: number;
  volumeKg: number;
}

export interface StatsDeload {
  from: string;
  to: string;
  loadFactor: number;
  effortCap: Deload['effortCap'];
}

export interface AskStats {
  version: 1;
  /** All 24 muscles, not just the ones currently flagged — a "ready" 100 is itself the answer to "have I recovered from legs". */
  recovery: StatsRecovery[];
  /** Current standing only — the latest record of each kind per exercise, not the full history of every record ever broken. */
  prs: StatsPr[];
  /** Oldest first, including the current (still in progress) week — mirrors History's own volume trend chart. */
  weeklyVolume: StatsWeek[];
  /** Only when an accepted easier week is active today; null otherwise — mirrors what Train/Live actually show right now. */
  deload: StatsDeload | null;
}

/** At most this many current PRs — the most recently set ones, one entry per (exercise, kind) pair. A lifetime of training can break the same handful of records many times over; only the current standing is a real answer to "what's my PR". */
export const MAX_STATS_PRS = 20;
/** Matches the app's own default "History" volume-trend window. */
export const STATS_WEEKS = 8;

export function buildAskStats(ctx: BrainContext): AskStats {
  const recovery: StatsRecovery[] = recoveryStatus(ctx.sessions, ctx.custom, ctx.now)
    .map(r => ({ muscle: r.muscle, pct: r.pct, tier: recoveryTier(r.pct), hoursLeft: Math.round(r.hoursLeft) }));

  const seen = new Set<string>();
  const prs: StatsPr[] = [];
  for (const r of allRecords(ctx.sessions, ctx.custom)) {
    const key = `${r.exerciseId}:${r.kind}`;
    if (seen.has(key)) continue;
    seen.add(key);
    prs.push({ exerciseId: r.exerciseId, exerciseName: r.exerciseName, kind: r.kind, detail: r.detail, day: r.day });
    if (prs.length >= MAX_STATS_PRS) break;
  }

  const weeklyVolume: StatsWeek[] = weeklyVolumeHistory(ctx.sessions, ctx.today, STATS_WEEKS)
    .map(w => ({ start: w.start, end: w.end, sets: w.sets, volumeKg: w.volumeKg }));

  const deload: StatsDeload | null = deloadActive(ctx.deload, ctx.today)
    ? { from: ctx.deload.from, to: ctx.deload.to, loadFactor: ctx.deload.loadFactor, effortCap: ctx.deload.effortCap }
    : null;

  return { version: 1, recovery, prs, weeklyVolume, deload };
}
