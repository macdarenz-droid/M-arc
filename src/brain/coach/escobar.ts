/**
 * What Escobar (the online coach) is allowed to know: this brain's own
 * output, turned into the grounding shape the deployed proxy accepts
 * (grounding.ts). Every rule in RULES, readiness, the deload state, weekly
 * volume against its band, recovery for every muscle, current records, eight
 * weeks of volume and today's next-session targets. Escobar reads the brain;
 * he never replaces it. Session ids, raw heart-rate series, names and raw
 * body measurements never go out. Pure.
 */
import type { Exercise, Profile, Session, Split } from '@/core/models';
import { addDays, daysBetween } from '@/core/dates';
import { findExercise } from '@/core/exercises';
import { isWorkingSet } from '../exposure';
import { allRecords } from '../prs';
import { recoveryTier, type MuscleRecovery } from '../recovery';
import { weeklyVolumeHistory } from '../weekly';
import type { ReadinessResult } from '../readiness';
import type { MuscleVolumeStatus } from '../volume';
import type { DeloadSuggestion } from '../deload';
import type { Suggestion } from '../progression';
import { coachInsights, type CoachContext, type Insight } from './rules';
import { computeBmi, extractNumbers, LIMITS, type AskStats, type DataQuality, type GroundingPayload, type PayloadFinding, type PayloadProposal } from './grounding';

export interface EscobarInput {
  ctx: CoachContext;
  goal: string;
  unit: 'kg' | 'lb';
  profile: Profile;
  /** Stated constraints first: an injury to work around outranks anything else if the cap has to drop something. */
  preferences: string[];
  readiness: ReadinessResult | null;
  recovery: MuscleRecovery[];
  volume: MuscleVolumeStatus[];
  deloadOffer: DeloadSuggestion;
  todaySplit?: Split;
  /** Next-session targets for today's split, from suggestNext (already deload-aware). */
  nextTargets: Array<{ exerciseId: string; suggestion: Suggestion }>;
}

const MAX_INSIGHTS = 14;
const MAX_VOLUME = 5;
const MAX_LOAD_NEXT = 8;

function severityOf(priority: number): PayloadFinding['severity'] {
  return priority >= 300 ? 3 : priority >= 150 ? 2 : priority >= 90 ? 1 : 0;
}

/** Numbers inside the insight's prose, each as its own metric, so an answer that repeats "up 12%" passes the grounding check. */
function numberMetrics(texts: string[]): Record<string, number> {
  const out: Record<string, number> = {};
  const seen = new Set<number>();
  let i = 0;
  for (const t of texts) for (const n of extractNumbers(t)) {
    if (seen.has(n)) continue;
    seen.add(n);
    out[`n${++i}`] = n;
    if (i >= 12) return out;
  }
  return out;
}

function insightFinding(i: Insight, today: string, custom: Exercise[]): PayloadFinding {
  const numbers = i.numbers ?? [];
  const texts = [i.title, i.noticed, i.means, i.action, ...numbers.map(n => n.value), ...(i.drivers ?? [])];
  const metrics: PayloadFinding['metrics'] = {
    title: i.title, noticed: i.noticed, means: i.means, action: i.action,
    ...(i.evidence ? { evidenceWindow: i.evidence.window, evidenceCount: i.evidence.n } : {}),
    ...(numbers.length ? { figures: numbers.map(n => `${n.label}: ${n.value}`).join('; ') } : {}),
    ...(i.drivers?.length ? { drivers: i.drivers.join('; ') } : {}),
    ...numberMetrics(texts),
  };
  const exerciseName = i.exerciseId ? findExercise(i.exerciseId, custom)?.name : undefined;
  return {
    id: `insight:${i.id}`,
    kind: `coach_${i.category}`,
    subject: { ...(i.exerciseId ? { exerciseId: i.exerciseId, ...(exerciseName ? { exerciseName } : {}) } : {}), ...(i.muscle ? { muscle: i.muscle } : {}) },
    metrics,
    window: { from: today, to: today, ...(i.evidence ? { sessions: i.evidence.n } : {}) },
    confidence: i.evidence?.confidence ?? 'medium',
    severity: severityOf(i.priority),
  };
}

function dataQuality(sessions: Session[], today: string): DataQuality {
  const first = sessions.reduce<string | null>((min, s) => (!min || s.day < min ? s.day : min), null);
  const weeksOfData = first ? Math.max(0, Math.floor(daysBetween(first, today) / 7)) : 0;
  const since = addDays(today, -28);
  let working = 0, rated = 0;
  for (const s of sessions) {
    if (s.day < since) continue;
    for (const e of s.exercises) for (const x of e.sets) {
      if (!isWorkingSet(x)) continue;
      working++;
      if (x.effort) rated++;
    }
  }
  return { sessions: sessions.length, weeksOfData, effortCoverage: working ? Math.round((rated / working) * 100) / 100 : 0, insufficientData: sessions.length < 3 };
}

export function buildStats(input: EscobarInput): AskStats {
  const { ctx } = input;
  const recovery = input.recovery.map(r => ({ muscle: r.muscle, pct: Math.max(0, Math.min(100, Math.round(r.pct))), tier: recoveryTier(r.pct), hoursLeft: Math.max(0, Math.round(r.hoursLeft)) }));
  const seen = new Set<string>();
  const prs: AskStats['prs'] = [];
  for (const r of allRecords(ctx.sessions, ctx.custom)) {
    const key = `${r.exerciseId}:${r.kind}`;
    if (seen.has(key) || !Number.isFinite(r.value) || !Number.isFinite(r.previous) || r.previous < 0) continue;
    seen.add(key);
    prs.push({ exerciseId: r.exerciseId, exerciseName: r.exerciseName, kind: r.kind, detail: r.detail, value: r.value, previous: r.previous, day: r.day });
    if (prs.length >= LIMITS.statsPrs) break;
  }
  const weeklyVolume = weeklyVolumeHistory(ctx.sessions, ctx.today, LIMITS.statsWeeks);
  // This brain's deload carries set and load factors but no effort cap, which the proxy's stats.deload requires; it travels as a finding instead of inventing a cap.
  return { version: 1, recovery, prs, weeklyVolume, deload: null };
}

export function buildFindings(input: EscobarInput): PayloadFinding[] {
  const { ctx } = input;
  const today = ctx.today;
  const out: PayloadFinding[] = [];

  const r = input.readiness;
  if (r) {
    out.push({
      id: 'readiness:today', kind: 'readiness', subject: {},
      metrics: { score: r.score, band: r.band, loadAdvice: r.loadAdvice, calibrating: r.calibrating, drivers: r.drivers.join('; '), ...numberMetrics(r.drivers) },
      window: { from: today, to: today }, confidence: r.confidence, severity: r.band === 'red' ? 3 : r.band === 'amber' ? 2 : 0,
    });
  }

  const d = ctx.deload && ctx.deload.endDay >= today ? ctx.deload : null;
  if (d) {
    out.push({
      id: 'deload:active', kind: 'deload_active', subject: {},
      metrics: { reason: d.reason, dayOfWeek: daysBetween(d.startDay, today) + 1, lengthDays: daysBetween(d.startDay, d.endDay) + 1, setFactor: d.setFactor, loadFactor: d.loadFactor },
      window: { from: d.startDay, to: d.endDay }, confidence: 'high', severity: 1,
    });
  } else if (input.deloadOffer.suggest) {
    out.push({
      id: 'deload:offer', kind: 'deload_offer', subject: {},
      metrics: { reason: input.deloadOffer.reason, accepted: false, ...numberMetrics([input.deloadOffer.reason]) },
      window: { from: today, to: today }, confidence: 'medium', severity: 2,
    });
  }

  if (input.todaySplit) {
    out.push({
      id: `today:${input.todaySplit.id}`, kind: 'today_scheduled', subject: { splitId: input.todaySplit.id, splitName: input.todaySplit.name },
      metrics: { exercises: input.todaySplit.exercises.length, plannedSets: input.todaySplit.exercises.reduce((n, e) => n + e.sets, 0) },
      window: { from: today, to: today }, confidence: 'high', severity: 0,
    });
  }

  const insights = coachInsights(ctx, 50).slice(0, MAX_INSIGHTS);
  out.push(...insights.map(i => insightFinding(i, today, ctx.custom)));

  const volume = input.volume.filter(v => v.status === 'under' || v.status === 'over')
    .sort((a, b) => Math.abs(b.thisWeekSets - b.medianSets) - Math.abs(a.thisWeekSets - a.medianSets))
    .slice(0, MAX_VOLUME);
  for (const v of volume) {
    out.push({
      id: `volume:${v.muscle}`, kind: 'weekly_sets_out_of_band', subject: { muscle: v.muscle },
      metrics: { status: v.status, thisWeekSets: v.thisWeekSets, medianSets: v.medianSets, bandLow: v.band[0], bandHigh: v.band[1] },
      window: { from: addDays(today, -27), to: today, weeks: 4 }, confidence: 'medium', severity: 1,
    });
  }

  return out.slice(0, LIMITS.findings);
}

export function buildProposals(input: EscobarInput): PayloadProposal[] {
  const out: PayloadProposal[] = [];
  for (const t of input.nextTargets.slice(0, MAX_LOAD_NEXT)) {
    const name = findExercise(t.exerciseId, input.ctx.custom)?.name;
    out.push({
      id: `load_next:${t.exerciseId}`, kind: 'load_next', subject: { exerciseId: t.exerciseId, ...(name ? { exerciseName: name } : {}) },
      apply: { kind: 'load_next', exerciseId: t.exerciseId, kg: t.suggestion.kg, reps: t.suggestion.reps, mode: t.suggestion.mode, target: t.suggestion.target, reason: t.suggestion.reason },
      basedOn: [], confidence: t.suggestion.confidence,
    });
  }
  return out.slice(0, LIMITS.proposals);
}

/** The whole grounding payload for one question. */
export function buildGrounding(input: EscobarInput): GroundingPayload {
  const preferences = input.preferences.map(p => p.trim().slice(0, LIMITS.preferenceChars)).filter(Boolean).slice(0, LIMITS.preferences);
  return {
    goal: input.goal,
    unit: input.unit,
    today: input.ctx.today,
    dataQuality: dataQuality(input.ctx.sessions, input.ctx.today),
    findings: buildFindings(input),
    proposals: buildProposals(input),
    cards: [],
    preferences,
    bmi: computeBmi(input.profile),
    stats: buildStats(input),
  };
}
