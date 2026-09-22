/** marc-coach Worker entry: Escobar v2 (protocol 2). The Anthropic key lives in the ANTHROPIC_API_KEY secret. */
import Anthropic from '@anthropic-ai/sdk';
import { handle } from './handler';
import type { ClientLike, Env } from './anthropic';

export default {
  async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    return handle(req, env, {
      makeClient: e => new Anthropic({ apiKey: e.ANTHROPIC_API_KEY, maxRetries: 1 }) as unknown as ClientLike,
      now: () => Date.now(),
      requestId: () => crypto.randomUUID(),
      waitUntil: p => ctx.waitUntil(p),
    });
  },
};
