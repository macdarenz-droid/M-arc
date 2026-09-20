/**
 * Ask the coach a real question — grounded in the current report and
 * research cards for anything about this person's own training, or
 * answered from the model's own general knowledge for everything else
 * (anatomy, exercise science, nutrition education). The Worker holds no
 * state, so every call resends the whole exchange so far, capped.
 *
 * The reply is tagged "personal" or "general" (see promptAsk.ts). Only a
 * "personal" answer is checked the way /explain's is: every number in it
 * must already be in the payload, or the whole answer is dropped rather
 * than shown half-trusted. A "general" answer is not a claim about this
 * person's data, so there is nothing in the payload to check it against —
 * checking it anyway is exactly what silently rejected "define biceps
 * scientifically" (its numbers, real facts, just weren't in the report).
 * Anything other than exactly "general" defaults to the strict path.
 */
import type { FindingsReport } from '@/brain/coach/contract';
import { allowedNumbers, cardsFor, LIMITS, trimFindingsAndProposals, validateText, type GroundingPayload, type PayloadProposal } from '@/brain/coach/explainer';
import { postJson } from './client';

export interface AskTurn {
  role: 'user' | 'assistant';
  text: string;
}

export interface AskPayload extends GroundingPayload {
  version: 1;
  kind: 'ask';
  history: AskTurn[];
  question: string;
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

/** The report, the recent conversation, and a new question — trimmed and capped the same way /explain's payload is. */
export function buildAskPayload(report: FindingsReport, history: AskTurn[], question: string, opts: { goal: string; unit: 'kg' | 'lb'; preferenceFacts?: string[] }): AskPayload {
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
  return {
    version: 1, kind: 'ask', goal: opts.goal, unit: opts.unit, today: report.today, dataQuality: report.dataQuality,
    findings, proposals, cards, preferences, history: trimmedHistory, question: question.trim().slice(0, MAX_QUESTION_CHARS),
  };
}

interface AskReply { scope?: unknown; category?: unknown; answer?: unknown; error?: unknown }

/** What an answer is mainly about — purely to pick a small decorative bullet icon; never shown as text. */
export type AskCategory = 'nutrition' | 'body' | 'training' | 'app' | 'general';
const ASK_CATEGORIES: readonly AskCategory[] = ['nutrition', 'body', 'training', 'app', 'general'];

export type AskResult = { ok: true; answer: string; scope: 'personal' | 'general'; category: AskCategory } | { ok: false; error: string };

/** Ask. A "personal" answer is validated the way /explain's is: any number not already in the payload, and the whole answer is dropped rather than shown half-trusted. A "general" answer (ordinary exercise/nutrition knowledge, not a claim about this person) is not checked against the payload — there is nothing in it to check against. */
export async function requestAskAnswer(payload: AskPayload, opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<AskResult> {
  if (!payload.question) return { ok: false, error: 'Type a question first.' };
  const result = await postJson<AskPayload, AskReply>(payload, { url: opts.url, path: '/ask', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 70_000 });
  if (!result.ok) return result;
  const answer = typeof result.body.answer === 'string' ? result.body.answer.trim() : '';
  if (!answer) return { ok: false, error: 'The coach sent back something we could not read.' };
  const scope: 'personal' | 'general' = result.body.scope === 'general' ? 'general' : 'personal';
  const category: AskCategory = (ASK_CATEGORIES as string[]).includes(result.body.category as string) ? (result.body.category as AskCategory) : 'general';
  if (scope === 'personal') {
    const check = validateText(answer, allowedNumbers(payload));
    if (!check.ok) return { ok: false, error: 'The coach\'s answer used a number that is not in your data, so it was not shown. Try asking again.' };
  }
  return { ok: true, answer, scope, category };
}
