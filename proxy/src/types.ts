/**
 * What the app sends. Mirrors src/brain/coach/explainer.ts in the app; the
 * Worker validates shape and size and trusts nothing else.
 */
export interface PayloadFinding {
  id: string;
  kind: string;
  subject: Record<string, string | undefined>;
  metrics: Record<string, number | string | boolean>;
  window: { from: string; to: string; weeks?: number; sessions?: number };
  confidence: 'low' | 'medium' | 'high';
  severity: number;
}

export interface PayloadProposal {
  id: string;
  kind: string;
  subject: Record<string, string | undefined>;
  apply: unknown;
  basedOn: string[];
  confidence: 'low' | 'medium' | 'high';
}

export interface PayloadCard {
  id: string;
  title: string;
  rating: 'strong' | 'moderate' | 'contested' | 'coaching_consensus';
  statement: string;
  disputed: string;
}

/** What every route that reasons about the coach's report shares: the report itself, nothing about the person. */
export interface GroundingPayload {
  goal: string;
  unit: 'kg' | 'lb';
  today: string;
  dataQuality: { sessions: number; weeksOfData: number; effortCoverage: number; insufficientData: boolean };
  findings: PayloadFinding[];
  proposals: PayloadProposal[];
  cards: PayloadCard[];
}

export interface ExplainPayload extends GroundingPayload {
  version: 1;
  kind: 'explain';
  /** Ids (findings and proposals) the app wants an explanation for. */
  explain: string[];
}

export interface Explanation {
  summary: string;
  items: Array<{ id: string; text: string }>;
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallModel = (payload: ExplainPayload, env: WorkerEnv) => Promise<Explanation>;

/** A name typed for a custom exercise, plus whatever equipment word the user already typed, if any. */
export interface TagExercisePayload {
  version: 1;
  kind: 'tag-exercise';
  name: string;
  equipmentHint?: string;
}

export interface TagExerciseReply {
  equipment: string;
  /** Every entry is one of the app's real muscle ids — the schema rejects anything else. */
  primary: string[];
  secondary: string[];
  /** One of the app's real movement patterns. */
  pattern: string;
  mode: 'weighted' | 'bodyweight' | 'assisted' | 'duration' | 'conditioning';
  /** The model's own honest read of how sure it is. "low" means the app must make the person double-check before saving. */
  confidence: 'high' | 'low';
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallTagExercise = (payload: TagExercisePayload, env: WorkerEnv) => Promise<Omit<TagExerciseReply, 'model' | 'usage'> & { model: string; usage: TagExerciseReply['usage'] }>;

/** One session or exercise note, as typed. Nothing else about the session goes with it. */
export interface NotesPayload {
  version: 1;
  kind: 'notes';
  text: string;
}

export interface NoteFlag {
  kind: 'pain_or_discomfort' | 'equipment_issue' | 'fatigue' | 'schedule' | 'form_check' | 'positive';
  /** One of the app's real muscle ids, or null when no muscle was named. */
  muscle: string | null;
}

export interface NotesReply {
  flags: NoteFlag[];
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallNotes = (payload: NotesPayload, env: WorkerEnv) => Promise<Omit<NotesReply, 'model' | 'usage'> & { model: string; usage: NotesReply['usage'] }>;

/** One turn already exchanged in this conversation. */
export interface AskTurn {
  role: 'user' | 'assistant';
  text: string;
}

/** The report, plus the conversation so far and the new question. The Worker holds no state between calls — the app resends the whole thing every time. */
export interface AskPayload extends GroundingPayload {
  version: 1;
  kind: 'ask';
  history: AskTurn[];
  question: string;
}

export interface AskReply {
  answer: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallAsk = (payload: AskPayload, env: WorkerEnv) => Promise<Omit<AskReply, 'model' | 'usage'> & { model: string; usage: AskReply['usage'] }>;

export interface WorkerEnv {
  ANTHROPIC_API_KEY?: string;
  MODEL?: string;
  MAX_DAILY_PER_DEVICE?: string;
  MAX_DAILY_TOTAL?: string;
  ALLOWED_ORIGINS?: string;
  RATE?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
  QUOTA?: KVNamespace;
}
