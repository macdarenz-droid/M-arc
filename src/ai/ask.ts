/**
 * Ask the coach a real question, grounded only in the current report and
 * the research cards behind it — the same data /explain sees, nothing
 * about sessions, name or body measurements. Keeps a short conversation:
 * the Worker holds no state, so every call resends the whole exchange so
 * far, capped, and the reply is checked the same way /explain's is —
 * every number in the answer must already be in the payload, or the
 * answer is not shown.
 */
import type { FindingsReport } from '@/brain/coach/contract';
import { allowedNumbers, cardsFor, trimFindingsAndProposals, validateText, type GroundingPayload } from '@/brain/coach/explainer';
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

/** The report, the recent conversation, and a new question — trimmed and capped the same way /explain's payload is. */
export function buildAskPayload(report: FindingsReport, history: AskTurn[], question: string, opts: { goal: string; unit: 'kg' | 'lb' }): AskPayload {
  const { findings, proposals } = trimFindingsAndProposals(report);
  const ids = [...findings.map(f => f.id), ...proposals.map(p => p.id)];
  const cards = cardsFor(report, ids);
  const trimmedHistory = history.slice(-MAX_HISTORY_TURNS).map(h => ({ role: h.role, text: h.text.trim().slice(0, 700) }));
  return {
    version: 1, kind: 'ask', goal: opts.goal, unit: opts.unit, today: report.today, dataQuality: report.dataQuality,
    findings, proposals, cards, history: trimmedHistory, question: question.trim().slice(0, MAX_QUESTION_CHARS),
  };
}

interface AskReply { answer?: unknown; error?: unknown }

export type AskResult = { ok: true; answer: string } | { ok: false; error: string };

/** Ask, and validate the reply the same way /explain's is validated: any number not already in the payload, and the whole answer is dropped rather than shown half-trusted. */
export async function requestAskAnswer(payload: AskPayload, opts: { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }): Promise<AskResult> {
  if (!payload.question) return { ok: false, error: 'Type a question first.' };
  const result = await postJson<AskPayload, AskReply>(payload, { url: opts.url, path: '/ask', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 45_000 });
  if (!result.ok) return result;
  const answer = typeof result.body.answer === 'string' ? result.body.answer.trim() : '';
  if (!answer) return { ok: false, error: 'The coach sent back something we could not read.' };
  const check = validateText(answer, allowedNumbers(payload));
  if (!check.ok) return { ok: false, error: 'The coach\'s answer used a number that is not in your data, so it was not shown. Try asking again.' };
  return { ok: true, answer };
}
