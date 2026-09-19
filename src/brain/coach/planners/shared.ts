/** Helpers shared by planners: proposal construction and exercise picking. */
import type { Exercise, Session } from '@/core/models';
import type { MuscleId } from '@/data/muscles';
import { LIBRARY, findExercise } from '@/core/exercises';
import { addDays } from '@/core/dates';
import { equipmentGroup } from '../../coach/cues';
import type { Confidence, Proposal, ProposalApply, ProposalKind, Subject } from '../contract';
import { PRINCIPLES_BY_PROPOSAL, dismissKey } from '../contract';

interface Make {
  kind: ProposalKind;
  subject: Subject;
  apply: ProposalApply;
  basedOn: string[];
  confidence: Confidence;
  expiresOn?: string;
  /** Extra id suffix when several proposals of one kind share a subject. */
  suffix?: string;
}

export function proposal(m: Make): Proposal {
  const key = dismissKey(m.kind, m.subject);
  const p: Proposal = {
    id: m.suffix ? `${key}:${m.suffix}` : key,
    kind: m.kind,
    subject: m.subject,
    apply: m.apply,
    basedOn: m.basedOn,
    principles: PRINCIPLES_BY_PROPOSAL[m.kind],
    confidence: m.confidence,
    dismissKey: key,
  };
  if (m.expiresOn) p.expiresOn = m.expiresOn;
  return p;
}

export interface UsageProfile {
  /** Sessions in which each exercise id appears. */
  useCount: Map<string, number>;
  /** Exercise ids logged in the last eight weeks. */
  recentIds: Set<string>;
  /** Equipment groups the user has actually used. */
  groups: Set<string>;
}

export function usageProfile(sessions: Session[], custom: Exercise[], today: string): UsageProfile {
  const useCount = new Map<string, number>();
  const recentIds = new Set<string>();
  const groups = new Set<string>();
  const recentFrom = addDays(today, -56);
  for (const s of sessions) for (const e of s.exercises) {
    const meta = findExercise(e.exerciseId, custom) ?? findExercise(e.name, custom);
    const id = meta?.id ?? e.exerciseId;
    useCount.set(id, (useCount.get(id) ?? 0) + 1);
    if (s.day >= recentFrom) recentIds.add(id);
    if (meta) groups.add(equipmentGroup(meta.equipment));
  }
  return { useCount, recentIds, groups };
}

export interface PickOptions {
  candidates: Exercise[];
  profile: UsageProfile;
  exclude?: ReadonlySet<string>;
  /** Favour exercises the user knows but has not done lately. */
  preferFresh?: boolean;
  /** Per-id score penalties, e.g. already placed elsewhere in a plan. */
  penalize?: ReadonlyMap<string, number>;
  /** 0–100 readiness per muscle; candidates with any primary muscle below minReady are dropped. */
  readiness?: (m: MuscleId) => number;
  minReady?: number;
}

export function scoreExercise(ex: Exercise, o: PickOptions): number {
  const used = o.profile.useCount.get(ex.id) ?? 0;
  let score = Math.min(used, 5) * 2;
  if (o.profile.groups.size && o.profile.groups.has(equipmentGroup(ex.equipment))) score += 2;
  if (o.preferFresh) {
    if (used > 0 && !o.profile.recentIds.has(ex.id)) score += 3;
    if (o.profile.recentIds.has(ex.id)) score -= 2;
  }
  if (ex.mode === 'weighted') score += 0.5;
  score -= o.penalize?.get(ex.id) ?? 0;
  return score;
}

/** Best candidate by score, ties broken by id for determinism. */
export function pickExercise(o: PickOptions): Exercise | undefined {
  const ok = o.candidates.filter(ex => {
    if (o.exclude?.has(ex.id)) return false;
    if (o.readiness && ex.primary.some(m => o.readiness!(m) < (o.minReady ?? 90))) return false;
    return true;
  });
  return ok
    .map(ex => ({ ex, score: scoreExercise(ex, o) }))
    .sort((a, b) => b.score - a.score || a.ex.id.localeCompare(b.ex.id))[0]?.ex;
}

/** Library plus custom exercises, custom first so they win ties. */
export function allExercises(custom: Exercise[]): Exercise[] {
  return [...custom, ...LIBRARY];
}

/** Candidates for a muscle: primary includes it and the pattern is one of the given ones (any pattern when empty). */
export function candidatesFor(all: Exercise[], muscle: MuscleId, patterns: readonly string[] = []): Exercise[] {
  return all.filter(ex => ex.primary.includes(muscle) && (!patterns.length || patterns.includes(ex.pattern)));
}
