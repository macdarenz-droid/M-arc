/**
 * Grounding and verification (§14): the directive grammar (citations, knowledge cards,
 * chips), a stream buffer that never renders half a directive, the numeric check against
 * the fact ledger, and the app-side safety pre-screen (§19).
 */
import { extractNumbers } from './ledger';
import type { Fact } from './types';

const OPEN = '⟦';
const CLOSE = '⟧';

export interface Directive { kind: 'cite'; ids: string[] }
export interface ParsedAnswer {
  /** Text with directives kept only in their canonical forms (unknown ones removed). */
  text: string;
  /** Text with every directive stripped: what the verifier and screen readers see. */
  plain: string;
  citations: string[];
  cards: string[];
  chips: string[];
}

const FACT_LIST = /^f\d+(\s*,\s*f\d+)*$/;
const CARD = /^k:([a-z0-9_]+)$/;
const CHIPS = /^chips:\s*(.+)$/s;

/** Parses the full answer. Unknown directives are removed; chips are only honoured once, at the end. */
export function parseDirectives(raw: string): ParsedAnswer {
  const citations: string[] = [], cards: string[] = [];
  let chips: string[] = [];
  let text = '';
  let plain = '';
  let i = 0;
  while (i < raw.length) {
    const start = raw.indexOf(OPEN, i);
    if (start < 0) { text += raw.slice(i); plain += raw.slice(i); break; }
    text += raw.slice(i, start);
    plain += raw.slice(i, start);
    const end = raw.indexOf(CLOSE, start + 1);
    if (end < 0) break; // an unclosed directive at the end is dropped
    const body = raw.slice(start + 1, end).trim();
    const tail = raw.slice(end + 1).trim();
    if (FACT_LIST.test(body)) {
      const ids = body.split(',').map(s => s.trim());
      citations.push(...ids);
      text += `${OPEN}${ids.join(',')}${CLOSE}`;
    } else if (CARD.test(body)) {
      cards.push(CARD.exec(body)![1]!);
      text += `${OPEN}${body}${CLOSE}`;
    } else if (CHIPS.test(body) && tail === '' && !chips.length) {
      chips = CHIPS.exec(body)![1]!.split('|').map(s => s.trim()).filter(Boolean).slice(0, 3).map(s => s.slice(0, 40));
    }
    i = end + 1;
  }
  return { text: text.replace(/[ \t]+\n/g, '\n').trimEnd(), plain: plain.replace(/\s+([.,;:!?])/g, '$1').trimEnd(), citations, cards, chips };
}

/**
 * Streaming: holds back an unfinished `⟦…` so half a directive is never rendered.
 * `push` returns the text that is safe to show so far.
 */
export class DirectiveBuffer {
  private raw = '';
  push(delta: string): string {
    this.raw += delta;
    return this.safe();
  }
  safe(): string {
    const open = this.raw.lastIndexOf(OPEN);
    const close = this.raw.lastIndexOf(CLOSE);
    const visible = open > close ? this.raw.slice(0, open) : this.raw;
    return parseDirectives(visible).text;
  }
  get full(): string { return this.raw; }
}

// ---------- Numeric grounding (§14.3) ----------

const DATE_ISO = /\b\d{4}-\d{2}-\d{2}\b/g;
const DATE_WORDS = /\b\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\b|\b(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\s+\d{1,2}(st|nd|rd|th)?\b/gi;
const TIME = /\b\d{1,2}:\d{2}\b/g;
const SETS_REPS = /\b\d+\s*[x×]\s*\d+\b/gi;
const QUOTED = /"[^"]*"|“[^”]*”/g;
const KG_PER_LB = 0.45359237;

export interface GroundingInput {
  answer: string;
  ledger: Fact[];
  /** The person's own messages this conversation: their numbers are allowed. */
  userTexts?: string[];
}

export interface GroundingResult {
  ok: boolean;
  ungrounded: number[];
  /** Sentences containing ungrounded numbers (directives stripped). */
  sentences: string[];
}

/** Sentences without a leading list marker, so they compare equal to what the answer renders (ES-16). */
export function sentencesOf(text: string): string[] {
  return text.split(/(?<=[.!?])\s+|\n+/).map(s => s.trim().replace(/^[-•]\s+/, '')).filter(Boolean);
}

function grounded(n: number, values: number[], lbValues: number[]): boolean {
  const a = Math.abs(n);
  for (const v of values) {
    const x = Math.abs(v);
    if (a === x || a === Math.round(x) || a === Math.round(x * 10) / 10) return true;
  }
  for (const lb of lbValues) if (Math.abs(a - lb) <= 1) return true;
  return false;
}

/** Card ids cited in a sentence ground the numbers of that card's facts (§14.4). */
export function checkGrounding(inp: GroundingInput): GroundingResult {
  const { plain } = parseDirectives(inp.answer);
  const factValues = inp.ledger.map(f => f.value);
  const kgFacts = inp.ledger.filter(f => f.unit === 'kg' || /\bkg\b/.test(f.label)).map(f => f.value / KG_PER_LB);
  const userNums = (inp.userTexts ?? []).flatMap(extractNumbers);
  const bad: number[] = [];
  const badSentences: string[] = [];
  // The trailing chips directive is not a sentence (its options would read as numbers).
  const rawSentences = sentencesOf(inp.answer.replace(/⟦chips:[^⟧]*⟧\s*$/, ''));
  for (const rawSentence of rawSentences) {
    const cardIds = [...rawSentence.matchAll(/⟦k:([a-z0-9_]+)⟧/g)].map(m => m[1]!);
    const cardValues = inp.ledger.filter(f => cardIds.some(id => f.label.startsWith(`k:${id}`))).map(f => f.value);
    const s = parseDirectives(rawSentence).plain;
    const scrubbed = s.replace(QUOTED, ' ').replace(DATE_ISO, ' ').replace(DATE_WORDS, ' ').replace(TIME, ' ').replace(SETS_REPS, ' ');
    // Ranges: "12–15 reps" → both endpoints checked separately.
    const nums = extractNumbers(scrubbed.replace(/(\d)\s*[–-]\s*(\d)/g, '$1 $2'));
    const offending = nums.filter(n => {
      if (Number.isInteger(n) && n >= 0 && n <= 10) return false; // small counts
      if (userNums.includes(n)) return false;
      return !grounded(n, [...factValues, ...cardValues], kgFacts);
    });
    if (offending.length) { bad.push(...offending); badSentences.push(s); }
  }
  return { ok: bad.length === 0, ungrounded: [...new Set(bad)], sentences: badSentences };
}

export const repairInstruction = (nums: number[]): string =>
  `These numbers are not from your tools, cards or the brief: ${nums.join(', ')}. Recompute them with tools or remove them, then restate the answer.`;

// ---------- Safety pre-screen (§19) ----------

export type SafetySignal = 'crisis' | 'pain_mentioned' | 'medical' | 'disordered_eating';

/**
 * ES-14: "end it after 3 sets" and "I hurt myself on squats" are not crises; ongoing self-harm
 * ("I've been hurting myself") still is.
 */
const CRISIS = /\b(kill(ing)? myself|suicid\w*|end my life|end it all|want to die|don'?t want to (live|be here)|self[- ]?harm\w*|(want|going|trying) to hurt myself|harm(ing)? myself|hurt(ing)? myself on purpose|(been|keep|kept|started) hurting myself(?!\s+(on|at|during|doing|with|in|lifting|squatting|benching|training))|no reason to live|better off dead)\b/i;
const MEDICAL = /\b(chest pain|chest (hurts|tight)|faint(ed|ing)?|passed out|black(ed)? out|dizz(y|iness)|heart (racing|palpitations)|palpitations|can'?t breathe)\b/i;
const PAIN = /\b(sharp pain|shooting pain|stabbing|numb(ness)?|tingl\w*|pins and needles|radiat\w*|pain|hurts?|injur\w*|strain(ed)?|sprain(ed)?|tweak(ed)?|pulled (a|my))\b/i;
const EATING = /\b(starv\w*|not eating|stop(ped)? eating|purg\w*|throw(ing)? up after|binge\w*|500 calories|800 calories|lose \d{2,} ?(kg|lb|pounds|kilos) in (a|one|two|\d) (week|month)|laxatives?|skip(ping)? (all )?meals|burn off (what|everything) i ate)\b/i;

export function safetySignals(text: string): SafetySignal[] {
  const out: SafetySignal[] = [];
  if (CRISIS.test(text)) out.push('crisis');
  if (MEDICAL.test(text)) out.push('medical');
  if (PAIN.test(text)) out.push('pain_mentioned');
  if (EATING.test(text)) out.push('disordered_eating');
  return out;
}
