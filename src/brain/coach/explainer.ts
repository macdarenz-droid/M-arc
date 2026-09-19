/**
 * The remote explainer, app side. Builds the payload the proxy accepts
 * (findings, proposals and research cards only: no sessions, no name, no
 * body measurements), validates what comes back so no invented number ever
 * reaches the screen, and caches answers by report content so a screen
 * refresh never costs a call.
 */
import type { Finding, FindingsReport, Proposal } from './contract';
import { PRINCIPLES_VERSION, principlesFor } from './principles';
import { endpoint, newDeviceId, postJson } from '@/ai/client';

export { endpoint, newDeviceId };

export interface PayloadFinding { id: string; kind: string; subject: Finding['subject']; metrics: Finding['metrics']; window: Finding['window']; confidence: Finding['confidence']; severity: number }
export interface PayloadProposal { id: string; kind: string; subject: Proposal['subject']; apply: Proposal['apply']; basedOn: string[]; confidence: Proposal['confidence'] }
export interface PayloadCard { id: string; title: string; rating: string; statement: string; disputed: string }

export interface ExplainPayload {
  version: 1;
  kind: 'explain';
  goal: string;
  unit: 'kg' | 'lb';
  today: string;
  dataQuality: FindingsReport['dataQuality'];
  findings: PayloadFinding[];
  proposals: PayloadProposal[];
  cards: PayloadCard[];
  explain: string[];
}

export const LIMITS = { findings: 24, proposals: 16, cards: 18, explain: 12 } as const;

/** Only what the words layer needs. Evidence (session ids) and profile never leave the device. */
export function buildPayload(report: FindingsReport, opts: { goal: string; unit: 'kg' | 'lb'; explain?: string[] }): ExplainPayload {
  const findings = report.findings.slice(0, LIMITS.findings).map(f => ({ id: f.id, kind: f.kind, subject: f.subject, metrics: f.metrics, window: f.window, confidence: f.confidence, severity: f.severity }));
  const proposals = report.proposals.filter(p => p.kind !== 'load_next').slice(0, LIMITS.proposals).map(p => ({ id: p.id, kind: p.kind, subject: p.subject, apply: p.apply, basedOn: p.basedOn, confidence: p.confidence }));
  const known = new Set([...findings.map(f => f.id), ...proposals.map(p => p.id)]);
  let explain = (opts.explain ?? []).filter(id => known.has(id));
  if (!explain.length) {
    const topProposals = proposals.slice(0, 6).map(p => p.id);
    const topFindings = report.findings.filter(f => f.severity > 0 || f.kind === 'habit_pattern').slice(0, 6).map(f => f.id);
    explain = [...new Set([...topProposals, ...topFindings])];
  }
  explain = explain.slice(0, LIMITS.explain);
  const ids = new Set<string>();
  for (const f of report.findings) if (explain.includes(f.id)) f.principles.forEach(p => ids.add(p));
  for (const p of report.proposals) if (explain.includes(p.id)) p.principles.forEach(x => ids.add(x));
  const cards = principlesFor([...ids]).slice(0, LIMITS.cards).map(c => ({ id: c.id, title: c.title, rating: c.rating, statement: c.statement, disputed: c.disputed }));
  return { version: 1, kind: 'explain', goal: opts.goal, unit: opts.unit, today: report.today, dataQuality: report.dataQuality, findings, proposals, cards, explain };
}

export function extractNumbers(text: string): number[] {
  return (text.match(/-?\d+(?:[.,]\d+)?/g) ?? []).map(n => parseFloat(n.replace(',', '.'))).filter(n => Number.isFinite(n));
}

const dateParts = (day: string): number[] => (/^\d{4}-\d{2}-\d{2}$/.test(day) ? day.split('-').map(Number) : []);

/** Every number the model is allowed to write: anything in the payload, plus dates it contains and the rounded forms of its decimals. */
export function allowedNumbers(payload: ExplainPayload): Set<number> {
  const out = new Set<number>();
  const add = (n: number) => { if (!Number.isFinite(n)) return; out.add(n); out.add(Math.abs(n)); out.add(Math.round(n)); out.add(Math.round(n * 10) / 10); };
  const visit = (v: unknown): void => {
    if (typeof v === 'number') add(v);
    else if (typeof v === 'string') { dateParts(v).forEach(add); if (/^-?\d+(\.\d+)?$/.test(v)) add(parseFloat(v)); }
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v as Record<string, unknown>).forEach(visit);
  };
  for (const f of payload.findings) { visit(f.metrics); visit(f.window); }
  for (const p of payload.proposals) visit(p.apply);
  visit(payload.dataQuality);
  dateParts(payload.today).forEach(add);
  for (const c of payload.cards) [...extractNumbers(c.statement), ...extractNumbers(c.disputed)].forEach(add);
  return out;
}

export interface Validation { ok: boolean; offending: number[] }

/** A reply may only contain numbers the payload contains. Anything else is treated as invented. */
export function validateText(text: string, allowed: Set<number>): Validation {
  const offending = extractNumbers(text).filter(n => !allowed.has(n) && !allowed.has(Math.abs(n)));
  return { ok: offending.length === 0, offending };
}

function fnv(s: string): string {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h.toString(16).padStart(8, '0');
}

/** Same report content, same key: a screen refresh never costs a call. */
export function explanationKey(payload: ExplainPayload): string {
  const body = JSON.stringify({
    v: PRINCIPLES_VERSION, goal: payload.goal, unit: payload.unit,
    f: payload.findings.map(f => [f.id, f.metrics]), p: payload.proposals.map(p => [p.id, p.apply]), c: payload.cards.map(c => c.id), e: payload.explain,
  });
  return `${fnv(body)}${fnv(body.split('').reverse().join(''))}`;
}

export interface Explanation {
  key: string;
  at: string;
  model: string;
  summary: string | null;
  items: Record<string, string>;
  /** Replies dropped because they contained a number not in the report. */
  rejected: number;
}

type Storagelike = Pick<Storage, 'getItem' | 'setItem'>;
export const CACHE_KEY = 'marc.coach.explanations';
export const CACHE_SIZE = 24;

export function readCache(storage: Storagelike | null): Explanation[] {
  try {
    const raw = storage?.getItem(CACHE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? (parsed as Explanation[]).filter(e => e && typeof e.key === 'string') : [];
  } catch { return []; }
}

export function getCached(key: string, storage: Storagelike | null): Explanation | null {
  return readCache(storage).find(e => e.key === key) ?? null;
}

export function putCached(explanation: Explanation, storage: Storagelike | null): void {
  try {
    const rest = readCache(storage).filter(e => e.key !== explanation.key);
    storage?.setItem(CACHE_KEY, JSON.stringify([explanation, ...rest].slice(0, CACHE_SIZE)));
  } catch { /* storage full or unavailable: the answer is still returned, just not remembered */ }
}

export interface FetchOptions { url: string; deviceId: string; fetchImpl?: typeof fetch; timeoutMs?: number }
export type FetchResult = { ok: true; explanation: Explanation } | { ok: false; error: string };

interface ProxyReply { summary?: unknown; items?: unknown; model?: unknown; error?: unknown }

/** POST the payload to the user's proxy and keep only the sentences that pass the number check. */
export async function fetchExplanation(payload: ExplainPayload, opts: FetchOptions): Promise<FetchResult> {
  const result = await postJson<ExplainPayload, ProxyReply>(payload, { url: opts.url, path: '/explain', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs });
  if (!result.ok) return result;
  const body = result.body;
  const allowed = allowedNumbers(payload);
  const items: Record<string, string> = {};
  let rejected = 0;
  const wanted = new Set(payload.explain);
  for (const item of Array.isArray(body.items) ? (body.items as Array<{ id?: unknown; text?: unknown }>) : []) {
    if (typeof item.id !== 'string' || typeof item.text !== 'string' || !wanted.has(item.id)) continue;
    if (validateText(item.text, allowed).ok) items[item.id] = item.text.trim();
    else rejected++;
  }
  let summary: string | null = typeof body.summary === 'string' ? body.summary.trim() : null;
  if (summary && !validateText(summary, allowed).ok) { summary = null; rejected++; }
  return { ok: true, explanation: { key: explanationKey(payload), at: new Date().toISOString(), model: typeof body.model === 'string' ? body.model : 'unknown', summary, items, rejected } };
}

/** GET /health on the proxy, for the Settings check button. */
export async function checkProxy(url: string, fetchImpl: typeof fetch = globalThis.fetch): Promise<{ ok: boolean; message: string }> {
  try {
    const res = await fetchImpl(endpoint(url, '/health'));
    const body = (await res.json()) as { ok?: boolean; model?: string };
    if (res.ok && body.ok) return { ok: true, message: `Proxy is up, model ${body.model ?? 'unknown'}.` };
    return { ok: false, message: `The proxy answered ${res.status}.` };
  } catch {
    return { ok: false, message: 'Could not reach the proxy. Check the address.' };
  }
}
