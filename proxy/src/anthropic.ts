/** The one place the Anthropic SDK is used. */
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { SYSTEM_PROMPT, userMessage } from './prompt';
import { TAG_SYSTEM_PROMPT, userMessage as tagUserMessage } from './promptTag';
import { NOTES_SYSTEM_PROMPT, userMessage as notesUserMessage } from './promptNotes';
import { ASK_SYSTEM_PROMPT, askMessages } from './promptAsk';
import { IDENTIFY_SYSTEM_PROMPT, identifyMessage } from './promptIdentify';
import { IMPORT_SYSTEM_PROMPT, importMessage } from './promptImport';
import { EXERCISE_IDS, MODES, MUSCLE_IDS, NOTE_FLAG_KINDS, PATTERNS } from './vocab';
import type { CallAsk, CallIdentifyExercise, CallImportProgramme, CallModel, CallNotes, CallTagExercise, WorkerEnv } from './types';

const ExplanationSchema = z.object({
  summary: z.string(),
  items: z.array(z.object({ id: z.string(), text: z.string() })),
});

const MuscleIdSchema = z.enum(MUSCLE_IDS);
const ExerciseIdSchema = z.enum(EXERCISE_IDS as [string, ...string[]]);
/** One concrete split proposal — see promptAsk.ts's split-building rules for when this is used. Every exerciseId is re-validated against the real catalog app-side too before it can ever be applied. */
const SplitDraftSchema = z.object({
  action: z.enum(['create', 'modify']),
  splitId: z.string().nullable(),
  name: z.string(),
  focus: z.array(MuscleIdSchema).max(2),
  exercises: z.array(z.object({ exerciseId: ExerciseIdSchema, sets: z.number().int().min(1).max(6) })).min(1).max(10),
});
/**
 * At most this many splits proposed in one reply — a person describing
 * several splits at once (a full weekly plan) still gets one entry per
 * split, not just the first. 6 covers a genuine 5- or 6-day bro split (a
 * different muscle focus named per day) without being so high that a
 * misread "N-day" request (see promptAsk.ts's day-count-vs-split-count
 * rule) could still balloon the reply past max_tokens.
 */
const MAX_SPLIT_DRAFTS = 6;

/**
 * A proposed rearrangement of the whole week — every day, not just the
 * ones that change, since the app replaces the whole schedule with
 * exactly what's here (the same "full replacement, not a diff" contract
 * splitDraft's "modify" exercises list already uses). `null` on a day
 * means rest; anything else must be a real split id from the payload's
 * own `splits` — re-validated app-side, same as every other id here.
 */
const ScheduleDraftSchema = z.object({
  sun: z.string().nullable(), mon: z.string().nullable(), tue: z.string().nullable(), wed: z.string().nullable(),
  thu: z.string().nullable(), fri: z.string().nullable(), sat: z.string().nullable(),
});

const AskSchema = z.object({
  scope: z.enum(['personal', 'general']),
  category: z.enum(['nutrition', 'body', 'training', 'app', 'general']),
  answer: z.string(),
  /** Present only when this reply actually proposes designing or adjusting one or more splits — most replies leave this empty. */
  splitDrafts: z.array(SplitDraftSchema).max(MAX_SPLIT_DRAFTS),
  /** Present only when this reply actually proposes rearranging the weekly schedule — most replies leave this null. */
  scheduleDraft: ScheduleDraftSchema.nullable(),
  /** Set by the model itself (promptAsk.ts rule 17) when the question carries a crisis or disordered-eating signal — null for nearly every reply. The app renders a fixed resource card whenever this isn't null; it is a safety flag, not a finding about the person, so it is never checked against the report. */
  concern: z.enum(['crisis', 'disordered_eating']).nullable(),
});

const TagSchema = z.object({
  equipment: z.string(),
  primary: z.array(MuscleIdSchema).max(3),
  secondary: z.array(MuscleIdSchema).max(4),
  pattern: z.enum(PATTERNS),
  mode: z.enum(MODES),
  confidence: z.enum(['high', 'low']),
});

const NotesSchema = z.object({
  flags: z.array(z.object({ kind: z.enum(NOTE_FLAG_KINDS), muscle: MuscleIdSchema.nullable() })).max(3),
});

const IdentifySchema = z.object({
  visible: z.boolean(),
  name: z.string(),
  equipment: z.string(),
  primary: z.array(MuscleIdSchema).max(3),
  secondary: z.array(MuscleIdSchema).max(4),
  pattern: z.enum(PATTERNS),
  mode: z.enum(MODES),
  confidence: z.enum(['high', 'low']),
});

const ImportedExerciseSchema = z.object({
  name: z.string(),
  sets: z.number().int().min(1).max(10),
  equipment: z.string(),
  primary: z.array(MuscleIdSchema).max(3),
  secondary: z.array(MuscleIdSchema).max(4),
  pattern: z.enum(PATTERNS),
  mode: z.enum(MODES),
  confidence: z.enum(['high', 'low']),
});
const ImportProgrammeSchema = z.object({
  readable: z.boolean(),
  days: z.array(z.object({ name: z.string(), exercises: z.array(ImportedExerciseSchema).max(12) })).max(7),
});

/**
 * Sonnet 5 for every route. Considered per route: `/explain` weaves several
 * findings into one coherent, well-hedged paragraph; `/tag-exercise` and
 * `/notes` are closed-vocabulary classification, but the vocabulary being
 * closed only stops an invented answer, not a wrong one, and the judgment
 * call underneath (which muscles are truly secondary; pain versus ordinary
 * fatigue) is exactly where a stronger model earns its keep. No route here
 * found a genuine capability reason to prefer Haiku.
 */
export const DEFAULT_MODEL = 'claude-sonnet-5';

/**
 * Every route defaults to DEFAULT_MODEL via env.MODEL, same as always. A
 * route's own env var (e.g. MODEL_TAG_EXERCISE) overrides just that route,
 * so one route can be tuned — to a cheaper model, once a real live
 * comparison justifies it — without touching the others or waiting on a
 * code change. Nothing here changes behavior until an operator sets one.
 */
export function modelFor(env: WorkerEnv, routeOverride: string | undefined): string {
  return routeOverride || env.MODEL || DEFAULT_MODEL;
}

/** What each route would actually call right now, for the health check. */
export function modelsByRoute(env: WorkerEnv): Record<string, string> {
  return {
    explain: modelFor(env, env.MODEL_EXPLAIN),
    tagExercise: modelFor(env, env.MODEL_TAG_EXERCISE),
    notes: modelFor(env, env.MODEL_NOTES),
    ask: modelFor(env, env.MODEL_ASK),
    identifyExercise: modelFor(env, env.MODEL_IDENTIFY_EXERCISE),
    importProgramme: modelFor(env, env.MODEL_IMPORT_PROGRAMME),
  };
}

/** A response the SDK refused to parse, or the model declined outright, is never silently swallowed. */
function requireParsed<T>(response: { stop_reason: string | null; parsed_output: T | null | undefined }): T {
  if (response.stop_reason === 'refusal') throw Object.assign(new Error('refused'), { status: 502 });
  const parsed = response.parsed_output;
  if (!parsed) throw Object.assign(new Error('unparseable'), { status: 502 });
  return parsed;
}

/**
 * Seen live: a prose field inside a JSON-schema response can end with a
 * stray quote-then-brace (`..."}`) — the model briefly "closing" the JSON
 * object it's implicitly composing, leaking into the string's own content
 * even under structured outputs. The prompt now says not to do this
 * (prompt.ts, promptAsk.ts); this is the safety net for when it happens
 * anyway.
 *
 * Requires an actual `}` or `]` in the trailing run before trimming
 * anything — an earlier version matched a bare trailing quote or bracket on
 * its own, which also silently ate a legitimate sentence ending in a quoted
 * term (`...called "muscle confusion"`) or a unit mark (`...chest level,
 * 45"`), neither of which is a formatting leak. A trailing `}`/`]` alone is
 * never legitimate prose, so requiring one keeps this narrow to the actual
 * bug.
 */
export function stripFormattingLeak(text: string): string {
  return text.replace(/[\s"',]*[\]}][\s"',]*$/, '');
}

const usageOf = (response: { usage: { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null } }) => ({
  inputTokens: response.usage.input_tokens,
  outputTokens: response.usage.output_tokens,
  cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
});

/**
 * Sonnet 5 turns on adaptive thinking whenever `thinking` is left unset —
 * unlike Haiku, which never thought at all. Left at its own default effort,
 * that thinking pushed real requests past our timeouts (seen live: "the
 * proxy took too long to answer", then a plain failure on retry). "medium"
 * keeps real reasoning depth for these bounded tasks while keeping answers
 * fast enough to actually arrive. This is a reliability fix, not a cost cut:
 * an answer that never completes is worse than one produced with less
 * throat-clearing.
 */
const EFFORT = 'medium' as const;

/**
 * /ask alone gets a higher effort than every other route. Its prompt now
 * carries real judgment calls with safety weight — a stated-minor age, a
 * pregnancy question, a named chronic condition that may or may not be the
 * individualized case, a crisis or disordered-eating signal to set neither
 * too eagerly nor too rarely — and EFFORT (medium, tuned for the other
 * routes' latency) trades away exactly the reasoning depth those calls
 * need. "high" is the next step, not "xhigh"/"max": this is still a
 * bounded chat reply against a fixed, short schema, not an open-ended
 * agentic task, so the extra depth buys judgment quality, not more output
 * length — and /ask already budgets the longest timeout of any route
 * (70s) for exactly this kind of longer reasoning turn.
 */
const ASK_EFFORT = 'high' as const;

export const callAnthropic: CallModel = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 55_000 });
  const model = modelFor(env, env.MODEL_EXPLAIN);
  const response = await client.messages.parse({
    model,
    max_tokens: 3000,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMessage(payload) }],
    output_config: { format: zodOutputFormat(ExplanationSchema), effort: EFFORT },
  });
  const parsed = requireParsed(response);
  return { summary: stripFormattingLeak(parsed.summary), items: parsed.items.map(i => ({ ...i, text: stripFormattingLeak(i.text) })), model: response.model, usage: usageOf(response) };
};

export const callTagExercise: CallTagExercise = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 40_000 });
  const model = modelFor(env, env.MODEL_TAG_EXERCISE);
  const response = await client.messages.parse({
    model,
    max_tokens: 1200,
    system: [{ type: 'text', text: TAG_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: tagUserMessage(payload) }],
    output_config: { format: zodOutputFormat(TagSchema), effort: EFFORT },
  });
  const parsed = requireParsed(response);
  return { ...parsed, model: response.model, usage: usageOf(response) };
};

export const callNotes: CallNotes = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 40_000 });
  const model = modelFor(env, env.MODEL_NOTES);
  const response = await client.messages.parse({
    model,
    max_tokens: 1000,
    system: [{ type: 'text', text: NOTES_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: notesUserMessage(payload) }],
    output_config: { format: zodOutputFormat(NotesSchema), effort: EFFORT },
  });
  const parsed = requireParsed(response);
  return { flags: parsed.flags, model: response.model, usage: usageOf(response) };
};

export const callIdentifyExercise: CallIdentifyExercise = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 45_000 });
  const model = modelFor(env, env.MODEL_IDENTIFY_EXERCISE);
  const response = await client.messages.parse({
    model,
    max_tokens: 1200,
    system: [{ type: 'text', text: IDENTIFY_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: identifyMessage(payload) }],
    output_config: { format: zodOutputFormat(IdentifySchema), effort: EFFORT },
  });
  const parsed = requireParsed(response);
  return { ...parsed, model: response.model, usage: usageOf(response) };
};

export const callImportProgramme: CallImportProgramme = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 55_000 });
  const model = modelFor(env, env.MODEL_IMPORT_PROGRAMME);
  const response = await client.messages.parse({
    model,
    max_tokens: 4000,
    system: [{ type: 'text', text: IMPORT_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: importMessage(payload) }],
    output_config: { format: zodOutputFormat(ImportProgrammeSchema), effort: EFFORT },
  });
  const parsed = requireParsed(response);
  return { ...parsed, model: response.model, usage: usageOf(response) };
};

/**
 * At most a couple of searches, and only when the prompt says it's worth
 * one (current or specific factual claims) — most questions this route
 * gets are stable knowledge a search would only slow down. Each search is
 * $10/1,000 (about a cent), plus normal token cost for what it reads;
 * capped here so one question can't run up an unbounded bill.
 */
const ASK_WEB_SEARCH_MAX_USES = 3;

/**
 * This app's whole design principle is grounding claims in real evidence
 * (see docs/RESEARCH.md, principles.json) — an unrestricted web search
 * would let one open question pull from whatever ranks highest that day,
 * including a low-quality blog, for exactly the kind of nutrition or
 * training claim the rest of the app is careful about. Scoped instead to
 * research and public-health bodies plus one respected research-summary
 * site (examine.com), the same evidence bar `/ask`'s own prompt already
 * asks the model to hold itself to (rule 5: say when something is
 * contested rather than reciting a single source as settled). Subdomains
 * are covered automatically, so "nih.gov" also covers pubmed.ncbi.nlm.nih.gov.
 * Extended with medlineplus.gov (NIH's own consumer health encyclopedia —
 * exactly the register a broadened, general-health "what does X mean"
 * question needs), sleepfoundation.org (sleep-specific, well-regarded) and
 * apa.org (American Psychological Association, for stress and mental
 * wellbeing) when the scope broadened past training-only topics.
 */
export const ASK_WEB_SEARCH_ALLOWED_DOMAINS = ['nih.gov', 'cdc.gov', 'health.gov', 'who.int', 'mayoclinic.org', 'examine.com', 'acsm.org', 'nsca.com', 'bjsm.bmj.com', 'jissn.biomedcentral.com', 'medlineplus.gov', 'sleepfoundation.org', 'apa.org'];

export const callAsk: CallAsk = async (payload, env) => {
  // Streaming, not client.messages.parse()'s plain (buffered) request: a compound turn — a
  // real answer, several splitDrafts, and a scheduleDraft, all at once, at ASK_EFFORT ("high")'s
  // larger adaptive-thinking allotment — has real room to run long. Seen live: "check my current
  // split and suggest another workout for next days and scheduling" 502'd outright (the same
  // "cut short, parsed_output empty" failure the day-count fix addressed earlier, now reachable
  // again by a different combination — a bigger max_tokens on a *non*-streaming call just risks
  // trading a truncation failure for an HTTP-timeout one). Streaming removes that tradeoff:
  // client.messages.stream(...).finalMessage() still yields the same parsed_output/stop_reason
  // shape requireParsed() already expects, so nothing downstream changes.
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 120_000 });
  const model = modelFor(env, env.MODEL_ASK);
  const stream = client.messages.stream({
    model,
    // Raised alongside the move to streaming, for the same compound-turn reason above — no
    // longer constrained by keeping a single buffered response under the HTTP timeout.
    max_tokens: 8000,
    system: [{ type: 'text', text: ASK_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: askMessages(payload),
    tools: [{ type: 'web_search_20260209', name: 'web_search', max_uses: ASK_WEB_SEARCH_MAX_USES, allowed_domains: ASK_WEB_SEARCH_ALLOWED_DOMAINS }],
    output_config: { format: zodOutputFormat(AskSchema), effort: ASK_EFFORT },
  });
  const response = await stream.finalMessage();
  const parsed = requireParsed(response);
  return { scope: parsed.scope, category: parsed.category, answer: stripFormattingLeak(parsed.answer), splitDrafts: parsed.splitDrafts, scheduleDraft: parsed.scheduleDraft, concern: parsed.concern, model: response.model, usage: usageOf(response) };
};
