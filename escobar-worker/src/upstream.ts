/**
 * One model step, run either here or in the US relay (PL-20). Both paths return the same plain,
 * serialisable result, so the handler's retry, quota and logging logic does not care which ran.
 */
import Anthropic from '@anthropic-ai/sdk';
import type { MessageCreateParamsStreaming, BetaMessage } from '@anthropic-ai/sdk/resources/beta/messages/messages';
import { isSystemRoleRejection, mapError, runStep, type ClientLike, type Env, type ErrorCode, type SseEvent } from './anthropic';

export interface StepResult {
  final: BetaMessage | null;
  emittedAny: boolean;
  timedOut?: boolean;
  aborted?: boolean;
  /** The model refused mid-conversation system messages: retry with <situation> blocks. */
  systemRole?: boolean;
  error?: { code: ErrorCode; message: string; retryAfter?: number; detail?: string };
}

/** The internal last event of a relay stream: never forwarded to the app. */
export const RESULT_EVENT = '_step';

export async function localStep(client: ClientLike, params: MessageCreateParamsStreaming, emit: (e: SseEvent) => void, opts: { idleMs?: number; signal?: AbortSignal }): Promise<StepResult> {
  const r = await runStep(client, params, emit, opts);
  if (!r.error) return { final: r.final, emittedAny: r.emittedAny };
  const aborted = r.error instanceof Anthropic.APIUserAbortError || !!opts.signal?.aborted;
  if (r.timedOut || aborted) return { final: null, emittedAny: r.emittedAny, timedOut: r.timedOut, aborted };
  return { final: null, emittedAny: r.emittedAny, systemRole: isSystemRoleRejection(r.error), error: mapError(r.error) };
}

/** Runs the step in the UpstreamRelay pinned to eastern North America and relays its events. */
export async function relayStep(env: Env, params: MessageCreateParamsStreaming, emit: (e: SseEvent) => void, opts: { idleMs?: number; signal?: AbortSignal }): Promise<StepResult> {
  const ns = env.UPSTREAM!;
  const stub = ns.get(ns.idFromName('us'), { locationHint: 'enam' });
  const unavailable: StepResult = { final: null, emittedAny: false, error: { code: 'upstream', message: 'The coach is unavailable right now.' } };
  let res: Response;
  try {
    res = await stub.fetch('https://relay.internal/step', { method: 'POST', body: JSON.stringify({ params, idleMs: opts.idleMs }), signal: opts.signal });
  } catch (err) {
    if (opts.signal?.aborted) return { final: null, emittedAny: false, aborted: true };
    console.error('relay unreachable:', String(err));
    return unavailable;
  }
  if (!res.ok || !res.body) return unavailable;
  const reader = res.body.getReader();
  opts.signal?.addEventListener('abort', () => { void reader.cancel().catch(() => {}); });
  const dec = new TextDecoder();
  let buf = '';
  let result: StepResult | null = null;
  let emittedAny = false;
  try {
    for (;;) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += dec.decode(value, { stream: true });
      let i: number;
      while ((i = buf.indexOf('\n\n')) >= 0) {
        const chunk = buf.slice(0, i);
        buf = buf.slice(i + 2);
        if (!chunk.startsWith('data: ')) continue;
        const ev = JSON.parse(chunk.slice(6)) as SseEvent | { t: typeof RESULT_EVENT; result: StepResult };
        if (ev.t === RESULT_EVENT) { result = (ev as { result: StepResult }).result; continue; }
        if (ev.t === 'text' || ev.t === 'tool') emittedAny = true;
        emit(ev as SseEvent);
      }
    }
  } catch (err) {
    if (opts.signal?.aborted) return { final: null, emittedAny, aborted: true };
    console.error('relay stream broke:', String(err));
  }
  if (opts.signal?.aborted) return { final: null, emittedAny, aborted: true };
  return result ?? { ...unavailable, emittedAny };
}
