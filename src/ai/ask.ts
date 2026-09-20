/**
 * Ask the coach — one chat, grounded in the current report and research
 * cards for anything about this person's own training, answered from the
 * model's own general knowledge for everything else (anatomy, exercise
 * science, nutrition education), and the one place the coach may also
 * design or adjust a real split by conversation (see promptAsk.ts). The
 * Worker holds no state, so every call resends the whole exchange so far,
 * capped.
 *
 * This used to be two separate routes/chats — this general one and a
 * standalone /build-split with no report access — merged into one so a
 * conversation can move between "why has my bench stalled" and "build me a
 * split for that" without switching chats, and so split-building can use
 * real findings the standalone version never had access to. See
 * COACH_BRAIN.md's decision log.
 *
 * The reply is tagged "personal" or "general" (see promptAsk.ts). Only a
 * "personal" answer is checked the way /explain's is: every number in it
 * must already be in the payload, or the whole answer is dropped rather
 * than shown half-trusted. A "general" answer is not a claim about this
 * person's data, so there is nothing in the payload to check it against —
 * checking it anyway is exactly what silently rejected "define biceps
 * scientifically" (its numbers, real facts, just weren't in the report).
 * Anything other than exactly "general" defaults to the strict path. A
 * splitDraft is a design choice, not a claim about this person's history,
 * so it is never checked against the report the way "personal" prose is —
 * it is instead re-validated against the app's real exercise catalog
 * (below), the same idea as src/ai/tagExercise.ts's knownMuscles.
 */
import type { Exercise, Split, Weekday } from '@/core/models';
import { WEEKDAYS } from '@/core/models';
import { findExercise } from '@/core/exercises';
import { isMuscleId, type MuscleId } from '@/data/muscles';
import type { FindingsReport } from '@/brain/coach/contract';
import { allowedNumbers, cardsFor, LIMITS, trimFindingsAndProposals, validateText, type GroundingPayload, type PayloadProposal } from '@/brain/coach/explainer';
import { postJson } from './client';

export interface AskTurn {
  role: 'user' | 'assistant';
  text: string;
}

/** One split as the app actually has it today, so a splitDraft can propose a sensible change to it or avoid duplicating it. */
export interface KnownSplit {
  id: string;
  name: string;
  focus: string[];
  exercises: Array<{ exerciseId: string; name: string; sets: number }>;
}

/** The person's real weekly schedule today — which split id, if any, trains on which day. Mirrors the app's own `AppState.schedule`. */
export type WeekSchedule = Record<Weekday, string | null>;

export interface AskPayload extends GroundingPayload {
  version: 1;
  kind: 'ask';
  history: AskTurn[];
  question: string;
  splits: KnownSplit[];
  schedule: WeekSchedule;
}

export const MAX_QUESTION_CHARS = 300;
/** Kept turns, most recent first before reversing back to chronological order — an old exchange falls off rather than growing the payload without bound. */
export const MAX_HISTORY_TURNS = 12;

/**
 * `load_next` (this exercise's recommended next weight and reps, from the
 * person's own progression) is deliberately excluded from
 * `trimFindingsAndProposals` — it never shows as a Suggestions card either
 * (words.ts's `suggestionsFrom`), since Train already shows it live, per
 * exercise, the moment you look at a split. But a real "what should I lift
 * today for bench" question needs exactly this, and there was nothing in
 * the payload to ground an answer in — so /ask (not /explain, which has no
 * use for it) adds it back locally, capped the same way `planLoad` already
 * bounds it (today's split, at most 8 exercises).
 */
const MAX_LOAD_NEXT = 8;

/** The report, the recent conversation, the person's real splits and schedule today, and a new question — trimmed and capped the same way /explain's payload is. */
export function buildAskPayload(
  report: FindingsReport,
  history: AskTurn[],
  question: string,
  opts: { goal: string; unit: 'kg' | 'lb'; preferenceFacts?: string[]; splits: Split[]; customExercises: Exercise[]; schedule: WeekSchedule },
): AskPayload {
  const { findings, proposals: trimmed } = trimFindingsAndProposals(report);
  const loadNext: PayloadProposal[] = report.proposals
    .filter(p => p.kind === 'load_next')
    .slice(0, MAX_LOAD_NEXT)
    .map(p => ({ id: p.id, kind: p.kind, subject: p.subject, apply: p.apply, basedOn: p.basedOn, confidence: p.confidence }));
  // The proxy refuses a payload with more than LIMITS.proposals proposals — this stays under that
  // hard cap even in the rare case where trimmed proposals already used up most of the budget.
  const proposals = [...trimmed, ...loadNext].slice(0, LIMITS.proposals);
  const ids = [...findings.map(f => f.id), ...proposals.map(p => p.id)];
  const cards = cardsFor(report, ids);
  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS).map(h => ({ role: h.role, text: h.text.trim().slice(0, 700) }));
  const preferences = (opts.preferenceFacts ?? []).slice(0, LIMITS.preferences);
  const splits: KnownSplit[] = opts.splits.map(sp => ({
    id: sp.id,
    name: sp.name,
    focus: sp.focus,
    exercises: sp.exercises.map(e => ({ exerciseId: e.exerciseId, name: findExercise(e.exerciseId, opts.customExercises)?.name ?? e.exerciseId, sets: e.sets })),
  }));
  return {
    version: 1, kind: 'ask', goal: opts.goal, unit: opts.unit, today: report.today, dataQuality: report.dataQuality,
    findings, proposals, cards, preferences, history: trimmedHistory, question: question.trim().slice(0, MAX_QUESTION_CHARS),
    splits, schedule: opts.schedule,
  };
}

interface AskReply { scope?: unknown; category?: unknown; answer?: unknown; splitDrafts?: unknown; scheduleDraft?: unknown; concern?: unknown; error?: unknown }

/** A crisis or disordered-eating signal the model flagged in the question itself (promptAsk.ts rule 17) — null for nearly every reply. Not a finding about the person; the UI shows a fixed, pre-written resource whenever this isn't null. */
export type AskConcern = 'crisis' | 'disordered_eating' | null;
const ASK_CONCERNS: readonly Exclude<AskConcern, null>[] = ['crisis', 'disordered_eating'];

/** What an answer is mainly about — purely to pick a small decorative bullet icon; never shown as text. */
export type AskCategory = 'nutrition' | 'body' | 'training' | 'app' | 'general';
const ASK_CATEGORIES: readonly AskCategory[] = ['nutrition', 'body', 'training', 'app', 'general'];

/** One concrete split proposal from a reply. Every exerciseId has already been re-validated against the app's real catalog by the time this is returned — nothing from the network is trusted further than that. */
export interface SplitDraft {
  action: 'create' | 'modify';
  /** An id from the payload's own `splits`, only when action is "modify". */
  splitId: string | null;
  name: string;
  focus: MuscleId[];
  exercises: Array<{ exerciseId: string; sets: number }>;
}

interface SplitDraftReply { action?: unknown; splitId?: unknown; name?: unknown; focus?: unknown; exercises?: unknown }

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

/**
 * A proposed rearrangement of the whole week. Any day naming a split id
 * the payload didn't actually list, or missing a day entirely, invalidates
 * the whole draft rather than applying a partial week — unlike splitDrafts
 * (an independent list where one bad entry is just dropped), a schedule is
 * one object; a week with an unrecognized day silently reassigned isn't
 * something the person can meaningfully review before accepting.
 */
function parseScheduleDraft(raw: unknown, knownSplitIds: Set<string>): WeekSchedule | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const schedule = {} as WeekSchedule;
  for (const day of WEEKDAYS) {
    const v = r[day];
    if (v === null) { schedule[day] = null; continue; }
    if (typeof v !== 'string' || !knownSplitIds.has(v)) return null;
    schedule[day] = v;
  }
  return schedule;
}

export type AskResult =
  | { ok: true; answer: string; scope: 'personal' | 'general'; category: AskCategory; drafts: SplitDraft[]; scheduleDraft: WeekSchedule | null; concern: AskConcern }
  | { ok: false; error: string };

/**
 * Ask. A "personal" answer is validated the way /explain's is: any number
 * not already in the payload, and the whole answer is dropped rather than
 * shown half-trusted. A "general" answer (ordinary exercise/nutrition
 * knowledge, not a claim about this person) is not checked against the
 * payload — there is nothing in it to check against. Each splitDraft in the
 * reply is re-validated against the app's own catalog and the splits this
 * exact payload named — a single message can describe several splits at
 * once, so this is a list: usually empty, sometimes one, sometimes several,
 * each independently actionable (and independently droppable if it doesn't
 * hold up to validation). scheduleDraft is re-validated the same way, but
 * as one object, not a list — any day naming an unrecognized split (or a
 * missing day) invalidates the whole week rather than a partial reorder.
 *
 * Once a reply actually proposes a splitDraft or a scheduleDraft, "answer"
 * skips the personal number check too — describing a fresh split or a new
 * arrangement necessarily cites its own numbers (a rep range, "twice a
 * week"), which are a design choice, not a claim about this person's
 * history (see promptAsk.ts rule 1), and were never going to be "in the
 * report" to begin with. Rejecting the whole reply over them would drop a
 * real, valid draft along with it — seen live: "create a 5-day full body
 * split" always cites its own set/rep numbers in "answer" and was silently
 * dropped every time.
 */
export async function requestAskAnswer(payload: AskPayload, customExercises: Exercise[], opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<AskResult> {
  if (!payload.question) return { ok: false, error: 'Type a question first.' };
  const result = await postJson<AskPayload, AskReply>(payload, { url: opts.url, path: '/ask', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 70_000 });
  if (!result.ok) return result;
  const answer = typeof result.body.answer === 'string' ? result.body.answer.trim() : '';
  if (!answer) return { ok: false, error: 'The coach sent back something we could not read.' };
  const scope: 'personal' | 'general' = result.body.scope === 'general' ? 'general' : 'personal';
  const category: AskCategory = (ASK_CATEGORIES as string[]).includes(result.body.category as string) ? (result.body.category as AskCategory) : 'general';
  const knownSplitIds = new Set(payload.splits.map(s => s.id));
  const rawDrafts = Array.isArray(result.body.splitDrafts) ? result.body.splitDrafts : [];
  const drafts = rawDrafts.map(d => parseDraft(d, knownSplitIds, customExercises)).filter((d): d is SplitDraft => d !== null);
  const scheduleDraft = result.body.scheduleDraft != null ? parseScheduleDraft(result.body.scheduleDraft, knownSplitIds) : null;
  const concern: AskConcern = (ASK_CONCERNS as string[]).includes(result.body.concern as string) ? (result.body.concern as Exclude<AskConcern, null>) : null;
  if (scope === 'personal' && drafts.length === 0 && !scheduleDraft) {
    const check = validateText(answer, allowedNumbers(payload));
    if (!check.ok) return { ok: false, error: 'The coach\'s answer used a number that is not in your data, so it was not shown. Try asking again.' };
  }
  return { ok: true, answer, scope, category, drafts, scheduleDraft, concern };
}
