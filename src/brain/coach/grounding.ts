/**
 * The shape the online coach's proxy accepts, and the check that keeps an
 * answer honest: a reply about this person may only use numbers the payload
 * already carries. Ported from the Escobar line's explainer.ts so the wire
 * contract of the deployed Worker stays exactly the same (see
 * docs/COACHING-DECISIONS.md, Phase E). Pure: no store, no network.
 */
import type { MuscleId } from '@/data/muscles';
import type { PrKind } from '../prs';

export type Confidence = 'low' | 'medium' | 'high';

export interface PayloadFinding {
  id: string;
  kind: string;
  subject: { exerciseId?: string; exerciseName?: string; muscle?: MuscleId; splitId?: string; splitName?: string };
  metrics: Record<string, number | string | boolean>;
  window: { from: string; to: string; weeks?: number; sessions?: number };
  confidence: Confidence;
  severity: 0 | 1 | 2 | 3;
}

export interface PayloadProposal {
  id: string;
  kind: string;
  subject: PayloadFinding['subject'];
  apply: Record<string, unknown>;
  basedOn: string[];
  confidence: Confidence;
}

export interface PayloadCard { id: string; title: string; rating: string; statement: string; disputed: string }

export interface DataQuality {
  sessions: number;
  weeksOfData: number;
  /** 0–1 share of recent working sets with an effort rating. */
  effortCoverage: number;
  insufficientData: boolean;
}

export interface AskStats {
  version: 1;
  recovery: Array<{ muscle: MuscleId; pct: number; tier: 'low' | 'mid' | 'high' | 'ready'; hoursLeft: number }>;
  prs: Array<{ exerciseId: string; exerciseName: string; kind: PrKind; detail: string; value: number; previous: number; day: string }>;
  weeklyVolume: Array<{ start: string; end: string; sets: number; volumeKg: number }>;
  deload: { from: string; to: string; loadFactor: number; effortCap: 'easy' | 'ideal' } | null;
}

export interface GroundingPayload {
  goal: string;
  unit: 'kg' | 'lb';
  today: string;
  dataQuality: DataQuality;
  findings: PayloadFinding[];
  proposals: PayloadProposal[];
  cards: PayloadCard[];
  preferences?: string[];
  /** A single derived ratio; raw weight and height never leave the phone. */
  bmi?: number | null;
  stats?: AskStats;
}

/** The proxy's own hard caps (proxy/src/handler.ts). */
export const LIMITS = { findings: 24, proposals: 16, cards: 18, preferences: 6, preferenceChars: 160, statsPrs: 20, statsWeeks: 8 } as const;

/** BMI = kg / m², one decimal. Null when weight or height isn't set. */
export function computeBmi(profile: { bodyWeightKg?: number; heightCm?: number }): number | null {
  const { bodyWeightKg: kg, heightCm: cm } = profile;
  if (!kg || !cm || kg <= 0 || cm <= 0) return null;
  const m = cm / 100;
  return Math.round((kg / (m * m)) * 10) / 10;
}

/** "1,500" is a thousands group, "11,9" a decimal comma. */
export function extractNumbers(text: string): number[] {
  return (text.match(/-?\d+(?:[.,]\d+)?/g) ?? []).map(raw => {
    const grouped = /^(-?\d+),(\d{3})$/.exec(raw);
    return parseFloat(grouped ? raw.replace(',', '') : raw.replace(',', '.'));
  }).filter(n => Number.isFinite(n));
}

/** Every number the model may write: anything in the payload, plus rounded forms. Date strings are never split into parts. */
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
  if (payload.stats) visit(payload.stats);
  return out;
}

export interface Validation { ok: boolean; offending: number[] }

export function validateText(text: string, allowed: Set<number>): Validation {
  const offending = extractNumbers(text).filter(n => !allowed.has(n) && !allowed.has(Math.abs(n)));
  return { ok: offending.length === 0, offending };
}
