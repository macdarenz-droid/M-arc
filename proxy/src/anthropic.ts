/** The one place the Anthropic SDK is used. */
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import { z } from 'zod';
import { SYSTEM_PROMPT, userMessage } from './prompt';
import type { CallModel } from './types';

const ExplanationSchema = z.object({
  summary: z.string(),
  items: z.array(z.object({ id: z.string(), text: z.string() })),
});

export const DEFAULT_MODEL = 'claude-haiku-4-5';

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
  if (response.stop_reason === 'refusal') throw Object.assign(new Error('refused'), { status: 502 });
  const parsed = response.parsed_output;
  if (!parsed) throw Object.assign(new Error('unparseable'), { status: 502 });
  return {
    summary: parsed.summary,
    items: parsed.items,
    model: response.model,
    usage: {
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
      cacheReadTokens: response.usage.cache_read_input_tokens ?? 0,
    },
  };
};
