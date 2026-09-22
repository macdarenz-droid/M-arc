/**
 * The remote explainer, app side. Builds the payload the proxy accepts
 * (findings, proposals and research cards: no sessions, no name, no raw
 * body measurements), validates what comes back so no invented number ever
 * reaches the screen, and caches answers by report content so a screen
 * refresh never costs a call. One narrow, deliberate exception to "no body
 * measurements": `bmi` (see below) — a single derived ratio, never the raw
 * weight or height it came from.
 */
import type { Finding, FindingsReport, Proposal } from './contract';
import { PRINCIPLES_VERSION, principlesFor } from './principles';
import { endpoint, newDeviceId, postJson } from '@/ai/client';
import type { AskStats } from '../stats';

export { endpoint, newDeviceId };

export interface PayloadFinding { id: string; kind: string; subject: Finding['subject']; metrics: Finding['metrics']; window: Finding['window']; confidence: Finding['confidence']; severity: number }
export interface PayloadProposal { id: string; kind: string; subject: Proposal['subject']; apply: Proposal['apply']; basedOn: string[]; confidence: Proposal['confidence'] }
export interface PayloadCard { id: string; title: string; rating: string; statement: string; disputed: string }

/** What every route that reasons about the coach's report sends: the report, nothing about the person. Shared with src/ai/ask.ts. */
export interface GroundingPayload {
  goal: string;
  unit: 'kg' | 'lb';
  today: string;
  dataQuality: FindingsReport['dataQuality'];
  findings: PayloadFinding[];
  proposals: PayloadProposal[];
  cards: PayloadCard[];
  /** Short, plain-word facts about how this person responds to the coach's own suggestions (see brain/coach/preferences.ts). Optional so an older or hand-built payload is still valid. */
  preferences?: string[];
  /**
   * The person's current BMI, computed on-device from `profile.bodyWeightKg`/`heightCm`
   * (see `computeBmi` below) — never the raw weight or height themselves, which still never
   * leave the device. Null when either figure isn't set in Settings. Optional so an older
   * or hand-built payload is still valid. Requested directly, after "what's my BMI, what
   * weight should I get to" kept needing to ask for figures already sitting in Settings.
   */
  bmi?: number | null;
  /** A precomputed "how things stand right now" snapshot — see src/brain/stats.ts. Optional so an older or hand-built payload is still valid; only /ask sets it today. */
  stats?: AskStats;
}

/** BMI = kg / (m^2), one decimal place, standard formula. Null when weight or height isn't set — never a guess. */
export function computeBmi(profile: { bodyWeightKg?: number; heightCm?: number }): number | null {
  const { bodyWeightKg: kg, heightCm: cm } = profile;
  if (!kg || !cm || kg <= 0 || cm <= 0) return null;
  const m = cm / 100;
  return Math.round((kg / (m * m)) * 10) / 10;
}

export interface ExplainPayload extends GroundingPayload {
  version: 1;
  kind: 'explain';
  explain: string[];
}

export const LIMITS = { findings: 24, proposals: 16, cards: 18, explain: 12, preferences: 6 } as const;
/** At most this many findings of any one kind count toward LIMITS.findings. A kind that fires once per muscle (under_recovered can fire for all 24) would otherwise fill the whole budget by itself on a heavy training day and crowd out everything else — including records, which are exactly what a person asking "why" wants explained. */
export const MAX_FINDINGS_PER_KIND = 6;

/** Findings and proposals trimmed to the limits every grounded route shares. No cards yet — those depend on which ids are actually in view. */
export function trimFindingsAndProposals(report: FindingsReport): { findings: PayloadFinding[]; proposals: PayloadProposal[] } {
  const perKind = new Map<string, number>();
  const findings: PayloadFinding[] = [];
  for (const f of report.findings) {
    const n = perKind.get(f.kind) ?? 0;
    if (n >= MAX_FINDINGS_PER_KIND) continue;
    perKind.set(f.kind, n + 1);
    findings.push({ id: f.id, kind: f.kind, subject: f.subject, metrics: f.metrics, window: f.window, confidence: f.confidence, severity: f.severity });
    if (findings.length >= LIMITS.findings) break;
  }
  const proposals = report.proposals.filter(p => p.kind !== 'load_next').slice(0, LIMITS.proposals).map(p => ({ id: p.id, kind: p.kind, subject: p.subject, apply: p.apply, basedOn: p.basedOn, confidence: p.confidence }));
  return { findings, proposals };
}

/** The research cards behind a set of finding/proposal ids, capped. */
export function cardsFor(report: FindingsReport, ids: string[]): PayloadCard[] {
  const chosen = new Set(ids);
  const principleIds = new Set<string>();
  for (const f of report.findings) if (chosen.has(f.id)) f.principles.forEach(p => principleIds.add(p));
  for (const p of report.proposals) if (chosen.has(p.id)) p.principles.forEach(x => principleIds.add(x));
  return principlesFor([...principleIds]).slice(0, LIMITS.cards).map(c => ({ id: c.id, title: c.title, rating: c.rating, statement: c.statement, disputed: c.disputed }));
}

/** Only what the words layer needs. Evidence (session ids) and profile never leave the device. */
export function buildPayload(report: FindingsReport, opts: { goal: string; unit: 'kg' | 'lb'; explain?: string[]; preferenceFacts?: string[] }): ExplainPayload {
  const { findings, proposals } = trimFindingsAndProposals(report);
  const known = new Set([...findings.map(f => f.id), ...proposals.map(p => p.id)]);
  let explain = (opts.explain ?? []).filter(id => known.has(id));
  if (!explain.length) {
    const topProposals = proposals.slice(0, 6).map(p => p.id);
    const topFindings = report.findings.filter(f => f.severity > 0 || f.kind === 'habit_pattern').slice(0, 6).map(f => f.id);
    explain = [...new Set([...topProposals, ...topFindings])];
  }
  explain = explain.slice(0, LIMITS.explain);
  const cards = cardsFor(report, explain);
  const preferences = (opts.preferenceFacts ?? []).slice(0, LIMITS.preferences);
  return { version: 1, kind: 'explain', goal: opts.goal, unit: opts.unit, today: report.today, dataQuality: report.dataQuality, findings, proposals, cards, explain, preferences };
}

/**
 * A comma after digits is ambiguous: "11,9" (a European-style decimal) and
 * "1,500" (an English thousands separator) both match the same shape. Digit
 * count settles it — a thousands group is always exactly three digits, a
 * decimal comma essentially never is (nobody writes "11,900" meaning 11.9).
 * Getting this wrong silently mis-parses "1,500 kg" as 1.5, which then
 * happens to pass the grounding check as a small, commonly-allowed number
 * instead of being checked as the real value.
 */
export function extractNumbers(text: string): number[] {
  return (text.match(/-?\d+(?:[.,]\d+)?/g) ?? []).map(raw => {
    const grouped = /^(-?\d+),(\d{3})$/.exec(raw);
    return parseFloat(grouped ? raw.replace(',', '') : raw.replace(',', '.'));
  }).filter(n => Number.isFinite(n));
}

/**
 * Every number the model is allowed to write: anything in the payload, plus
 * the rounded forms of its decimals. Deliberately does NOT split a YYYY-MM-DD
 * date string (a window's `from`/`to`, or `today`) into its year/month/day
 * components as separately-allowed numbers — an earlier version did, and
 * since a report can carry up to `LIMITS.findings` windows, that let a
 * fabricated small number (a rep count, a set count, a week count — exactly
 * the range coaching answers use most) slip through as "grounded" for no
 * reason other than some finding's window happening to start or end on a
 * matching day-of-month. The prompt already tells the model never to invent
 * a date, so there is no legitimate case that needs this.
 */
export function allowedNumbers(payload: GroundingPayload): Set<number> {
  const out = new Set<number>();
  const add = (n: number) => { if (!Number.isFinite(n)) return; out.add(n); out.add(Math.abs(n)); out.add(Math.round(n)); out.add(Math.round(n * 10) / 10); };
  const visit = (v: unknown): void => {
    if (typeof v === 'number') add(v);
    else if (typeof v === 'string') { if (/^-?\d+(\.\d+)?$/.test(v)) add(parseFloat(v)); }
    else if (Array.isArray(v)) v.forEach(visit);
    else if (v && typeof v === 'object') Object.values(v as Record<string, unknown>).forEach(visit);
  };
  for (const f of payload.findings) { visit(f.metrics); visit(f.window); }
  for (const p of payload.proposals) visit(p.apply);
  visit(payload.dataQuality);
  for (const c of payload.cards) [...extractNumbers(c.statement), ...extractNumbers(c.disputed)].forEach(add);
  for (const p of payload.preferences ?? []) extractNumbers(p).forEach(add);
  if (payload.bmi != null) add(payload.bmi);
  // Recovery %/hours, PR values, weekly volume and deload numbers — visit() already skips
  // YYYY-MM-DD strings (a date never parses as a bare number), so stats' own `day`/`from`/`to`
  // fields don't leak in as false positives the way an earlier version of this function let
  // window dates do (see the comment on visit() above).
  if (payload.stats) visit(payload.stats);
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
    pf: payload.preferences ?? [],
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
  // Sonnet 5 thinks before answering; this weaves several findings into one paragraph, the biggest of the three calls.
  const result = await postJson<ExplainPayload, ProxyReply>(payload, { url: opts.url, path: '/explain', deviceId: opts.deviceId, fetchImpl: opts.fetchImpl, timeoutMs: opts.timeoutMs ?? 45_000 });
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
