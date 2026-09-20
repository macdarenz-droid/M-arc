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
  /** Short, plain-word facts the app has learned about how this person responds to its suggestions. Optional so an older client is still accepted. */
  preferences?: string[];
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

/** What an answer is mainly about, purely to pick a small decorative bullet icon client-side — never shown as text, never used for grounding or validation. */
export type AskCategory = 'nutrition' | 'body' | 'training' | 'app' | 'general';

export interface AskReply {
  /** "personal" states something about this person's own logged data (grounded, number-checked by the app); "general" is ordinary exercise/nutrition knowledge that does not depend on their data and is not checked against the report. */
  scope: 'personal' | 'general';
  category: AskCategory;
  answer: string;
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallAsk = (payload: AskPayload, env: WorkerEnv) => Promise<Omit<AskReply, 'model' | 'usage'> & { model: string; usage: AskReply['usage'] }>;

/** One photo, already downscaled and compressed by the app, plus whatever equipment word the person already typed, if any. Nothing else about them. */
export interface IdentifyExercisePayload {
  version: 1;
  kind: 'identify-exercise';
  image: { mediaType: 'image/jpeg' | 'image/png' | 'image/webp'; data: string };
  equipmentHint?: string;
}

export interface IdentifyExerciseReply {
  /** False when the photo does not clearly show a strength-training exercise or piece of gym equipment. Every other field is still present but should be treated as a weak guess when this is false. */
  visible: boolean;
  name: string;
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

export type CallIdentifyExercise = (payload: IdentifyExercisePayload, env: WorkerEnv) => Promise<Omit<IdentifyExerciseReply, 'model' | 'usage'> & { model: string; usage: IdentifyExerciseReply['usage'] }>;

/** One photo of a whole written workout plan — a handout, a whiteboard, a printed program. Nothing else about the person. */
export interface ImportProgrammePayload {
  version: 1;
  kind: 'import-programme';
  image: { mediaType: 'image/jpeg' | 'image/png' | 'image/webp'; data: string };
}

export interface ImportedExercise {
  name: string;
  /** How many sets the page specifies, or a reasonable default when it only shows reps. Never a weight or load. */
  sets: number;
  equipment: string;
  primary: string[];
  secondary: string[];
  pattern: string;
  mode: 'weighted' | 'bodyweight' | 'assisted' | 'duration' | 'conditioning';
  confidence: 'high' | 'low';
}

export interface ImportedDay {
  name: string;
  exercises: ImportedExercise[];
}

export interface ImportProgrammeReply {
  /** False when the photo does not clearly show a written workout plan. "days" is empty when this is false. */
  readable: boolean;
  days: ImportedDay[];
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallImportProgramme = (payload: ImportProgrammePayload, env: WorkerEnv) => Promise<Omit<ImportProgrammeReply, 'model' | 'usage'> & { model: string; usage: ImportProgrammeReply['usage'] }>;

/** One split as the app actually has it today, so the model can propose a sensible change to it or avoid duplicating it — never sent for the general /ask route, only here. */
export interface KnownSplit {
  id: string;
  name: string;
  /** Muscle ids, at most 2 — mirrors the app's own Split.focus. */
  focus: string[];
  exercises: Array<{ exerciseId: string; name: string; sets: number }>;
}

/** Build or modify one split by conversation. No report, no findings — this is a design task (which real exercises, how many sets), not a claim about the person's history, so it does not go through the number-grounding used by /ask and /explain. */
export interface BuildSplitPayload {
  version: 1;
  kind: 'build-split';
  goal: string;
  unit: 'kg' | 'lb';
  splits: KnownSplit[];
  history: AskTurn[];
  message: string;
}

/** Present only once the conversation has enough to propose something concrete; absent (null) while the model is still asking a clarifying question. Every exerciseId must be re-validated against the real catalog client-side before it can be applied — this reply is trusted no further than any other model output in this app. */
export interface SplitDraftReply {
  action: 'create' | 'modify';
  /** Must name an id from the payload's own `splits` when action is "modify"; null when action is "create". */
  splitId: string | null;
  name: string;
  focus: string[];
  exercises: Array<{ exerciseId: string; sets: number }>;
}

export interface BuildSplitReply {
  answer: string;
  splitDraft: SplitDraftReply | null;
  model: string;
  usage: { inputTokens: number; outputTokens: number; cacheReadTokens: number };
}

export type CallBuildSplit = (payload: BuildSplitPayload, env: WorkerEnv) => Promise<Omit<BuildSplitReply, 'model' | 'usage'> & { model: string; usage: BuildSplitReply['usage'] }>;

export interface WorkerEnv {
  ANTHROPIC_API_KEY?: string;
  /** Default model for every route. A route's own MODEL_* below overrides this for just that route. */
  MODEL?: string;
  MODEL_EXPLAIN?: string;
  MODEL_TAG_EXERCISE?: string;
  MODEL_NOTES?: string;
  MODEL_ASK?: string;
  MODEL_IDENTIFY_EXERCISE?: string;
  MODEL_IMPORT_PROGRAMME?: string;
  MODEL_BUILD_SPLIT?: string;
  MAX_DAILY_PER_DEVICE?: string;
  MAX_DAILY_TOTAL?: string;
  ALLOWED_ORIGINS?: string;
  RATE?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
  QUOTA?: KVNamespace;
}
