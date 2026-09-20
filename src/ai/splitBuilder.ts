/**
 * Build or adjust a split by conversation — /build-split, the one
 * deliberate place the coach is allowed to propose real exercises and set
 * counts, separate from the general "Ask the coach" chat, which explicitly
 * declines to build plans in chat (see COACH_BRAIN.md's decision log for
 * why the two differ on purpose). Every exercise the model proposes is
 * re-validated here against the app's real catalog before it can ever be
 * shown as something the person could add — an id the schema somehow let
 * through but the app doesn't recognize is dropped, never trusted, the
 * same idea as src/ai/tagExercise.ts's knownMuscles.
 */
import type { Exercise, Split } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { isMuscleId, type MuscleId } from '@/data/muscles';
import { postJson } from './client';

export interface SplitBuilderTurn {
  role: 'user' | 'assistant';
  text: string;
}

export const MAX_SPLIT_MESSAGE_CHARS = 300;
/** Kept turns, most recent first before reversing back to chronological order — an old exchange falls off rather than growing the payload without bound. Same cap as src/ai/ask.ts. */
export const MAX_SPLIT_HISTORY_TURNS = 12;

export interface BuildSplitPayload {
  version: 1;
  kind: 'build-split';
  goal: string;
  unit: 'kg' | 'lb';
  splits: Array<{ id: string; name: string; focus: string[]; exercises: Array<{ exerciseId: string; name: string; sets: number }> }>;
  history: SplitBuilderTurn[];
  message: string;
}

/** The report never goes with this — see promptSplitBuilder.ts for why a split's exercises and set counts are a design task, not a claim about the person's history. */
export function buildSplitPayload(splits: Split[], custom: Exercise[], history: SplitBuilderTurn[], message: string, opts: { goal: string; unit: 'kg' | 'lb' }): BuildSplitPayload {
  return {
    version: 1,
    kind: 'build-split',
    goal: opts.goal,
    unit: opts.unit,
    splits: splits.map(sp => ({
      id: sp.id,
      name: sp.name,
      focus: sp.focus,
      exercises: sp.exercises.map(e => ({ exerciseId: e.exerciseId, name: findExercise(e.exerciseId, custom)?.name ?? e.exerciseId, sets: e.sets })),
    })),
    history: history.slice(-MAX_SPLIT_HISTORY_TURNS).map(h => ({ role: h.role, text: h.text.trim().slice(0, 700) })),
    message: message.trim().slice(0, MAX_SPLIT_MESSAGE_CHARS),
  };
}

export interface SplitDraft {
  action: 'create' | 'modify';
  /** An id from the payload's own `splits`, only when action is "modify". */
  splitId: string | null;
  name: string;
  focus: MuscleId[];
  exercises: Array<{ exerciseId: string; sets: number }>;
}

interface SplitDraftReply { action?: unknown; splitId?: unknown; name?: unknown; focus?: unknown; exercises?: unknown }
interface BuildSplitReply { answer?: unknown; splitDrafts?: unknown; error?: unknown }

export type BuildSplitResult = { ok: true; answer: string; drafts: SplitDraft[] } | { ok: false; error: string };

/** Keeps only exercises the app actually recognizes, silently — never shown as real when the app can't find it. */
function knownExercises(v: unknown, custom: Exercise[]): Array<{ exerciseId: string; sets: number }> {
  if (!Array.isArray(v)) return [];
  const out: Array<{ exerciseId: string; sets: number }> = [];
  for (const item of v) {
    if (!item || typeof item !== 'object') continue;
    const exerciseId = (item as { exerciseId?: unknown }).exerciseId;
    const sets = (item as { sets?: unknown }).sets;
    if (typeof exerciseId !== 'string' || !findExercise(exerciseId, custom)) continue;
    const n = typeof sets === 'number' && Number.isFinite(sets) ? Math.round(sets) : 3;
    out.push({ exerciseId, sets: Math.max(1, Math.min(6, n)) });
  }
  return out;
}

/** A draft that fails validation in a way that leaves nothing real to apply becomes null — a half-drawn action isn't shown as one the person can accept. */
function parseDraft(raw: unknown, knownSplitIds: Set<string>, custom: Exercise[]): SplitDraft | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as SplitDraftReply;
  const action = r.action === 'modify' ? 'modify' as const : r.action === 'create' ? 'create' as const : null;
  if (!action) return null;
  const splitId = typeof r.splitId === 'string' && knownSplitIds.has(r.splitId) ? r.splitId : null;
  if (action === 'modify' && !splitId) return null;
  const name = typeof r.name === 'string' && r.name.trim() ? r.name.trim().slice(0, 28) : 'New split';
  const focus = Array.isArray(r.focus) ? r.focus.filter(isMuscleId).slice(0, 2) : [];
  const exercises = knownExercises(r.exercises, custom);
  if (!exercises.length) return null;
  return { action, splitId: action === 'create' ? null : splitId, name, focus, exercises };
}

/** Ask. Each splitDraft in the reply is re-validated against the app's own catalog and the splits this exact payload named — nothing from the network is trusted further than that. A single message can describe several splits at once, so this is a list: usually one entry, sometimes several, each independently actionable (and independently droppable if it doesn't hold up to validation). */
export async function requestSplitBuilderAnswer(payload: BuildSplitPayload, custom: Exercise[], opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<BuildSplitResult> {
  if (!payload.message) return { ok: false, error: 'Type a message first.' };
  const result = await postJson<BuildSplitPayload, BuildSplitReply>(payload, { url: opts.url, path: '/build-split', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 45_000 });
  if (!result.ok) return result;
  const answer = typeof result.body.answer === 'string' ? result.body.answer.trim() : '';
  if (!answer) return { ok: false, error: 'The coach sent back something we could not read.' };
  const knownSplitIds = new Set(payload.splits.map(s => s.id));
  const raw = Array.isArray(result.body.splitDrafts) ? result.body.splitDrafts : [];
  const drafts = raw.map(d => parseDraft(d, knownSplitIds, custom)).filter((d): d is SplitDraft => d !== null);
  return { ok: true, answer, drafts };
}
