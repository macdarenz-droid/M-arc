/** The one place the Anthropic SDK is used. */
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { SYSTEM_PROMPT, userMessage } from './prompt';
import { TAG_SYSTEM_PROMPT, userMessage as tagUserMessage } from './promptTag';
import { NOTES_SYSTEM_PROMPT, userMessage as notesUserMessage } from './promptNotes';
import { MODES, MUSCLE_IDS, NOTE_FLAG_KINDS, PATTERNS } from './vocab';
import type { CallModel, CallNotes, CallTagExercise } from './types';

const ExplanationSchema = z.object({
  summary: z.string(),
  items: z.array(z.object({ id: z.string(), text: z.string() })),
});

const MuscleIdSchema = z.enum(MUSCLE_IDS);
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

/** A response the SDK refused to parse, or the model declined outright, is never silently swallowed. */
function requireParsed<T>(response: { stop_reason: string | null; parsed_output: T | null | undefined }): T {
  if (response.stop_reason === 'refusal') throw Object.assign(new Error('refused'), { status: 502 });
  const parsed = response.parsed_output;
  if (!parsed) throw Object.assign(new Error('unparseable'), { status: 502 });
  return parsed;
}

const usageOf = (response: { usage: { input_tokens: number; output_tokens: number; cache_read_input_tokens?: number | null } }) => ({
  inputTokens: response.usage.input_tokens,
  outputTokens: response.usage.output_tokens,
  cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
});

export const callAnthropic: CallModel = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 45_000 });
  const model = env.MODEL || DEFAULT_MODEL;
  const response = await client.messages.parse({
    model,
    max_tokens: 1500,
    system: [{ type: 'text', text: SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: userMessage(payload) }],
    output_config: { format: zodOutputFormat(ExplanationSchema) },
  });
  const parsed = requireParsed(response);
  return { summary: parsed.summary, items: parsed.items, model: response.model, usage: usageOf(response) };
};

export const callTagExercise: CallTagExercise = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 30_000 });
  const model = env.MODEL || DEFAULT_MODEL;
  const response = await client.messages.parse({
    model,
    max_tokens: 400,
    system: [{ type: 'text', text: TAG_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: tagUserMessage(payload) }],
    output_config: { format: zodOutputFormat(TagSchema) },
  });
  const parsed = requireParsed(response);
  return { ...parsed, model: response.model, usage: usageOf(response) };
};

export const callNotes: CallNotes = async (payload, env) => {
  const client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY, maxRetries: 1, timeout: 30_000 });
  const model = env.MODEL || DEFAULT_MODEL;
  const response = await client.messages.parse({
    model,
    max_tokens: 300,
    system: [{ type: 'text', text: NOTES_SYSTEM_PROMPT, cache_control: { type: 'ephemeral' } }],
    messages: [{ role: 'user', content: notesUserMessage(payload) }],
    output_config: { format: zodOutputFormat(NotesSchema) },
  });
  const parsed = requireParsed(response);
  return { flags: parsed.flags, model: response.model, usage: usageOf(response) };
};
