/**
 * Durable preferences the coach infers from how this person has actually
 * responded to its own suggestions over time — never from a single day,
 * and nothing about their body. A Finding is this week's facts and a
 * Proposal is a still-open suggestion; a suggestion dismissed twice drops
 * out of both, so without this the remote coach would have no memory that
 * it ever happened. Recomputed at most weekly (shouldRefreshPreferences)
 * and cached in state, so including it in a remote call costs nothing and
 * never triggers one on its own.
 */
import type { CoachState } from '@/core/models';
import type { ProposalKind } from './contract';
import { daysBetween } from '@/core/dates';

export const PREFERENCE_FACTS_MAX = 6;
export const PREFERENCE_REFRESH_DAYS = 7;
/** A kind dismissed, or accepted for this many distinct suggestions, is a real preference rather than noise. */
export const PREFERENCE_MIN_COUNT = 2;

const KIND_ORDER: ProposalKind[] = ['deload_week', 'exercise_swap', 'schedule', 'today_plan', 'add_exercise', 'split_modify', 'split_new', 'rest_default', 'load_next'];

const KIND_LABEL: Record<ProposalKind, string> = {
  schedule: 'schedule changes', today_plan: "today's-plan swaps", exercise_swap: 'exercise swaps', add_exercise: 'added exercises',
  split_modify: 'split changes', split_new: 'new split plans', load_next: 'load targets', rest_default: 'rest-time changes', deload_week: 'easier weeks',
};

function kindOf(dismissKey: string): ProposalKind | null {
  const k = dismissKey.split(':')[0];
  return (KIND_ORDER as string[]).includes(k as string) ? (k as ProposalKind) : null;
}

/** How many distinct dismissKeys of each kind appear in a dismissed/accepted map. */
function tallyByKind(keys: Iterable<string>): Partial<Record<ProposalKind, number>> {
  const out: Partial<Record<ProposalKind, number>> = {};
  for (const key of keys) {
    const kind = kindOf(key);
    if (!kind) continue;
    out[kind] = (out[kind] ?? 0) + 1;
  }
  return out;
}

/**
 * Short, plain-word facts about how this person tends to respond to the
 * coach, most telling first. Never a diagnosis, never a body measurement,
 * never a count invented beyond "more than once".
 */
export function computePreferenceFacts(coach: CoachState): string[] {
  const dismissed = tallyByKind(Object.keys(coach.dismissed).filter(k => coach.dismissed[k]! >= PREFERENCE_MIN_COUNT));
  const accepted = tallyByKind(Object.keys(coach.accepted));
  const facts: string[] = [];
  for (const kind of KIND_ORDER) if (dismissed[kind]) facts.push(`Has turned down ${KIND_LABEL[kind]} more than once; do not push the same kind of suggestion again unprompted.`);
  for (const kind of KIND_ORDER) if ((accepted[kind] ?? 0) >= PREFERENCE_MIN_COUNT) facts.push(`Usually accepts ${KIND_LABEL[kind]} when the coach offers them.`);
  if (coach.smartReminders) facts.push('Has accepted a learned training schedule and turned on time-matched reminders.');
  return facts.slice(0, PREFERENCE_FACTS_MAX);
}

/** True when preferenceFacts has never been computed, or it has been at least PREFERENCE_REFRESH_DAYS since it was. */
export function shouldRefreshPreferences(coach: CoachState, today: string): boolean {
  if (!coach.preferencesUpdatedAt) return true;
  return daysBetween(coach.preferencesUpdatedAt.slice(0, 10), today) >= PREFERENCE_REFRESH_DAYS;
}
