/**
 * Pure helpers for the "Ask Escobar" conversation's persisted memory — the
 * thread itself, and durable stated constraints ("my elbow is bad, no
 * curls"). Both used to die the moment the sheet closed; see AskThreadTurn
 * and CoachState in core/models.ts for what's persisted and why, and
 * COACH_BRAIN.md's decision log for the audit finding this closes. Kept
 * pure (CoachState in, CoachState out) so AskSheet.tsx's own store glue
 * (`update(s => ({ ...s, coach: appendAskTurn(s.coach, turn) }))`) is the
 * only place touching `update`/`flushSave` — everything here is testable
 * without a store or a component.
 */
import type { AskThreadTurn, CoachState } from '@/core/models';
import { MAX_ASK_THREAD_TURNS, MAX_STATED_CONSTRAINTS, MAX_STATED_CONSTRAINT_CHARS } from '@/core/models';

/** Appends one turn, dropping the oldest once past MAX_ASK_THREAD_TURNS. */
export function appendAskTurn(coach: CoachState, turn: AskThreadTurn): CoachState {
  return { ...coach, askThread: [...coach.askThread, turn].slice(-MAX_ASK_THREAD_TURNS) };
}

/** Patches the turn at `index` in place — used to mark a shown draft/schedule action as applied without touching the rest of the thread. */
export function updateAskTurn(coach: CoachState, index: number, patch: Partial<AskThreadTurn>): CoachState {
  return { ...coach, askThread: coach.askThread.map((t, i) => (i === index ? { ...t, ...patch } : t)) };
}

/** The person's own "start over" action — never automatic. */
export function clearAskThread(coach: CoachState): CoachState {
  return { ...coach, askThread: [] };
}

/**
 * Merges newly stated constraints into the durable list: trimmed, length-capped
 * (matching the proxy's own per-fact cap once these are sent as "preferences"),
 * empty strings dropped, exact-string duplicates bumped to most-recent rather
 * than kept twice, oldest dropped once past MAX_STATED_CONSTRAINTS. A no-op
 * (returns `coach` unchanged) when there's nothing real to add.
 */
export function mergeStatedConstraints(coach: CoachState, newOnes: string[]): CoachState {
  const cleaned = newOnes.map(c => c.trim().slice(0, MAX_STATED_CONSTRAINT_CHARS)).filter(Boolean);
  if (!cleaned.length) return coach;
  const merged = [...coach.statedConstraints.filter(c => !cleaned.includes(c)), ...cleaned].slice(-MAX_STATED_CONSTRAINTS);
  return { ...coach, statedConstraints: merged };
}

/** The person's own "forget what I told you" action — never automatic. */
export function clearStatedConstraints(coach: CoachState): CoachState {
  return { ...coach, statedConstraints: [] };
}

/** Both at once — the Settings "Reset" action for "Ask Escobar" memory, distinct from resetCoachMemory (dismissed/accepted/snoozedUntil) in coach/apply.ts since these are a different kind of memory (a conversation and its stated facts, not suggestion history). */
export function clearAskMemory(coach: CoachState): CoachState {
  return clearStatedConstraints(clearAskThread(coach));
}
