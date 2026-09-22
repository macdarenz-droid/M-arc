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

/** One muscle's current recovery standing — see src/brain/recovery.ts in the app. */
export interface StatsRecovery {
  muscle: string;
  /** 0–100, 100 = fully recovered. */
  pct: number;
  tier: 'low' | 'mid' | 'high' | 'ready';
  hoursLeft: number;
}

/** The current standing (most recent) record of one kind for one exercise — see src/brain/prs.ts in the app. */
export interface StatsPr {
  exerciseId: string;
  exerciseName: string;
  kind: string;
  /** Plain words, e.g. "60 kg × 8". */
  detail: string;
  /** The record's own number as a real field, not just embedded in `detail`'s free text — see src/brain/stats.ts in the app. */
  value: number;
  /** The record this one beat, when there was a prior one — 0 for a first-ever record. */
  previous: number;
  day: string;
}

export interface StatsWeek {
  start: string;
  end: string;
  sets: number;
  volumeKg: number;
}

export interface StatsDeload {
  from: string;
  to: string;
  loadFactor: number;
  effortCap: 'easy' | 'ideal';
}

/**
 * A compact, precomputed snapshot of "how things stand right now" —
 * everything the exceptions-only findings/proposals above deliberately
 * leave out: a muscle's current recovery even when it isn't flagged, an
 * exercise's current PR even when it wasn't just broken, the recent weekly
 * volume trend, and today's deload state. Mirrors src/brain/stats.ts
 * (`buildAskStats`) in the app. Optional so an older client is still
 * accepted.
 */
export interface AskStats {
  version: 1;
  /** All 24 muscles, not just the ones currently under-recovered. */
  recovery: StatsRecovery[];
  prs: StatsPr[];
  /** Oldest first, including the current (still in progress) week. */
  weeklyVolume: StatsWeek[];
  /** Only when an accepted easier week is active today; null otherwise. */
  deload: StatsDeload | null;
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
  /**
   * The person's current BMI, computed on-device from their weight/height in
   * Settings — never the raw weight or height, which never leave the device.
   * Null when either isn't set. Optional so an older client is still
   * accepted. The one deliberate, narrow exception to "nothing about the
   * person" this route's grounding otherwise holds to — requested directly
   * after "what's my BMI" kept needing to ask for figures already sitting
   * in Settings.
   */
  bmi?: number | null;
  /** See AskStats above. Optional so an older client is still accepted. */
  stats?: AskStats;
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

/** A day of the week, as the app's own `Weekday` type keys it. */
export type WeekdayKey = 'sun' | 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat';
export const WEEKDAY_KEYS: readonly WeekdayKey[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

/** The person's real weekly schedule today — which split id trains on which day, or null for a rest day. Mirrors the app's own `AppState.schedule`. */
export type WeekSchedule = Record<WeekdayKey, string | null>;

/** Every day null — the fallback askMessages() (promptAsk.ts) sends the model when an older app build's payload has no `schedule` field at all, rather than treating the whole request as malformed. */
export const EMPTY_WEEK_SCHEDULE: WeekSchedule = Object.fromEntries(WEEKDAY_KEYS.map(k => [k, null])) as WeekSchedule;

/**
 * The report, plus the conversation so far and the new question. The
 * Worker holds no state between calls — the app resends the whole thing
 * every time. `splits` is the person's real splits today (name, focus,
 * exercises) and `schedule` is which split trains on which day today —
 * neither is part of GroundingPayload since /explain has no use for them,
 * but /ask does: this is the one route that may also design or adjust a
 * split (using the real exercise catalog) or rearrange the weekly
 * schedule when asked (see promptAsk.ts).
 */
export interface AskPayload extends GroundingPayload {
  version: 1;
  kind: 'ask';
  history: AskTurn[];
  question: string;
  splits: KnownSplit[];
  /** Optional so an app build from before scheduleDraft shipped (which never sends this) still gets a valid, if schedule-unaware, answer — see EMPTY_WEEK_SCHEDULE and validateAskPayload. The current app always sends a real one. */
  schedule?: WeekSchedule;
}

/** What an answer is mainly about, purely to pick a small decorative bullet icon client-side — never shown as text, never used for grounding or validation. */
export type AskCategory = 'nutrition' | 'body' | 'training' | 'app' | 'general';

/** One of the app's real training goal ids — see src/data/goals.ts (app) and GOAL_IDS (vocab.ts). */
export type GoalId = 'lean' | 'growth' | 'strength_muscle' | 'strength';

/** A proposal to switch the person's training goal — the first (and so far only) member of the "actions" envelope; see the doc comment on AskActionSchema in anthropic.ts for why this is a discriminated union rather than its own top-level field. */
export interface GoalChangeAction {
  kind: 'goal_change';
  goal: GoalId;
}

/** The general typed-action envelope — currently just GoalChangeAction, designed so a real future kind (reminders, session control) is a new union member here, not a schema rewrite. */
export type AskAction = GoalChangeAction;

export interface AskReply {
  /** "personal" states something about this person's own logged data (grounded, number-checked by the app); "general" is ordinary exercise/nutrition knowledge that does not depend on their data and is not checked against the report. */
  scope: 'personal' | 'general';
  category: AskCategory;
  answer: string;
  /** One entry per split this reply actually proposes designing or adjusting — empty for an ordinary answer, several when the person described several splits at once. */
  splitDrafts: SplitDraftReply[];
  /** Present only when this reply actually proposes rearranging the weekly schedule — the full week, every day, since the app replaces the whole thing with exactly what's here. Null for an ordinary answer. */
  scheduleDraft: WeekSchedule | null;
  /** Set by the model when the question carries a crisis or disordered-eating signal (promptAsk.ts rule 17) — null for nearly every reply. A safety flag, not a finding about the person; the app shows a fixed resource card whenever this isn't null. */
  concern: 'crisis' | 'disordered_eating' | null;
  /** Durable facts the model itself flagged about this person's own body, equipment or preferences (promptAsk.ts rule 23) — empty for most replies. The app persists these and merges them back into "preferences" on every future call, mirroring how "concern" is a flag the model sets rather than something the app guesses from the raw chat text. */
  constraints: string[];
  /** The general typed-action envelope (promptAsk.ts rule 24) — empty for nearly every reply. See AskAction below; splitDrafts/scheduleDraft stay their own fields rather than folding into this, at least for now (see the doc comment on AskActionSchema in anthropic.ts). */
  actions: AskAction[];
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

/** One split as the app actually has it today, so /ask can propose a sensible change to it or avoid duplicating it when asked to design or adjust one. */
export interface KnownSplit {
  id: string;
  name: string;
  /** Muscle ids, at most 2 — mirrors the app's own Split.focus. */
  focus: string[];
  exercises: Array<{ exerciseId: string; name: string; sets: number }>;
}

/** One concrete split proposal — present in an AskReply only when the conversation actually calls for designing or adjusting a split. Every exerciseId must be re-validated against the real catalog client-side before it can be applied — this reply is trusted no further than any other model output in this app. */
export interface SplitDraftReply {
  action: 'create' | 'modify';
  /** Must name an id from the payload's own `splits` when action is "modify"; null when action is "create". */
  splitId: string | null;
  name: string;
  focus: string[];
  exercises: Array<{ exerciseId: string; sets: number }>;
}

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
  MAX_DAILY_PER_DEVICE?: string;
  MAX_DAILY_TOTAL?: string;
  ALLOWED_ORIGINS?: string;
  RATE?: { limit: (opts: { key: string }) => Promise<{ success: boolean }> };
  QUOTA?: KVNamespace;
}
