/**
 * Pure selector for the one Escobar presence cue to show right now.
 *
 * This never recomputes findings or proposals — it only chooses among and
 * phrases the Insight/Suggestion lists the words layer (words.ts) already
 * rendered from the current FindingsReport. Steady/Direct change the `cue`
 * line only; they can never change which moment wins, its priority, its
 * target, or its confidence (docs/escobar-presence/01-ARCHITECTURE.md §3).
 *
 * A moment's `id` and `evidenceKey` are derived only from the underlying
 * finding/proposal identity and its meaningful facts — never from tone,
 * the active tab, or a clock/rest-timer tick — so the same real situation
 * keeps the same identity everywhere, and a dismissal of it stays a
 * dismissal of it (see selectMoment's dismissed filter below).
 */
import type { Confidence } from './contract';
import type { Insight, Suggestion } from './words';

export type CoachTone = 'steady' | 'direct';

/** The shape a caller's persisted `coach.presence.dismissed` entries must match. */
export interface PresenceDismissal {
  id: string;
  evidenceKey: string;
}

export type CoachingMomentKind = 'suggestion' | 'insight';

export interface CoachingMoment {
  /** Stable observation identity — independent of tab, tone and time ticks. */
  id: string;
  /** Hash of meaningful supporting facts only; local, never transmitted. */
  evidenceKey: string;
  kind: CoachingMomentKind;
  /** Existing finding/proposal ids this moment rests on. */
  sourceIds: string[];
  priority: number;
  reasonCodes: string[];
  /** Tone-flavored one-line cue. The only field that varies with tone. */
  cue: string;
  title: string;
  noticed: string;
  action: string;
}

export interface SelectMomentInput {
  suggestions: Suggestion[];
  insights: Insight[];
  tone: CoachTone;
  /** Prior explicit dismissals — same (id, evidenceKey) pair stays hidden. */
  dismissed: readonly PresenceDismissal[];
}

/** Same FNV-1a variant words.ts uses for its own deterministic rotation — kept private and separate so neither module's hash choice constrains the other. */
function fnv(s: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}

/** A stable hash of the given facts, in base 36. Order matters; callers own picking meaningful-only fields. */
export function evidenceKeyFor(parts: ReadonlyArray<string | number>): string {
  return fnv(parts.join('|')).toString(36);
}

/** Suggestions (an actionable next step) always outrank plain insights (an observation), matching the architecture's "relevant existing proposal" tier sitting above general finding evidence. */
const SUGGESTION_PRIORITY_FLOOR = 1_000;
const CONFIDENCE_WEIGHT: Record<Confidence, number> = { low: 0, medium: 10, high: 20 };

function suggestionMoment(s: Suggestion, tone: CoachTone): CoachingMoment {
  const evidenceKey = evidenceKeyFor(['suggestion', s.kind, s.dismissKey, s.confidence, s.changes.join(',')]);
  return {
    id: `suggestion:${s.dismissKey}`,
    evidenceKey,
    kind: 'suggestion',
    sourceIds: [s.id],
    priority: SUGGESTION_PRIORITY_FLOOR + CONFIDENCE_WEIGHT[s.confidence],
    reasonCodes: [s.kind],
    cue: tone === 'direct' ? s.acceptLabel : s.title,
    title: s.title,
    noticed: s.summary,
    action: s.acceptLabel,
  };
}

function insightMoment(i: Insight, tone: CoachTone): CoachingMoment {
  const evidenceKey = evidenceKeyFor(['insight', i.kind, i.id, i.severity, i.confidence]);
  return {
    id: `insight:${i.id}`,
    evidenceKey,
    kind: 'insight',
    sourceIds: [i.id],
    priority: i.priority,
    reasonCodes: [i.kind],
    cue: tone === 'direct' ? i.means : i.noticed,
    title: i.title,
    noticed: i.noticed,
    action: i.action,
  };
}

function isDismissed(m: CoachingMoment, dismissed: readonly PresenceDismissal[]): boolean {
  return dismissed.some(d => d.id === m.id && d.evidenceKey === m.evidenceKey);
}

/**
 * Picks one eligible cue, or null when nothing qualifies — never a filler
 * message. Deterministic: equal priority ties break on the stable id, so
 * repeated calls against the same report/tone/dismissal state always
 * agree, from any surface.
 *
 * Deliberately silent on UI-owned priority (an open rest timer, a
 * confirmation dialog, an in-workout live-adjustment cue): those retain
 * control at the caller's mount point (see P02), not here — this
 * function only ever ranks among report-derived evidence.
 */
export function selectMoment(input: SelectMomentInput): CoachingMoment | null {
  const candidates: CoachingMoment[] = [
    ...input.suggestions.map(s => suggestionMoment(s, input.tone)),
    ...input.insights.map(i => insightMoment(i, input.tone)),
  ].filter(m => !isDismissed(m, input.dismissed));
  if (!candidates.length) return null;
  candidates.sort((a, b) => b.priority - a.priority || a.id.localeCompare(b.id));
  return candidates[0]!;
}
