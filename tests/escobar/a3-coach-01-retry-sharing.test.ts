/**
 * COACH 01: the busy/timeout retry must not resend body data after body sharing was switched off
 * during the back-off. Scripted transport only; no network.
 */
import { describe, expect, it } from 'vitest';
import { EscobarLoop, toRequestMessages, type LoopDeps } from '@/escobar/loop';
import type { StreamEvent, Transport } from '@/escobar/transport';
import { newConversation } from '@/escobar/store';
import { buildManifest } from '@/escobar/context/manifest';
import type { AppState } from '@/core/models';
import { sixMonthsState, NOW } from './fixtures';

const final = (content: unknown[]): StreamEvent => ({ t: 'final', content, stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 5 }, model: 'm' });
const answer = (text: string): StreamEvent[] => [{ t: 'text', d: text }, final([{ type: 'text', text }])];

function harness(first: StreamEvent[]) {
  let s: AppState = sixMonthsState();
  const bodies: string[] = [];
  const steps = [first, answer('Done.')];
  const transport: Transport = {
    async *turn(body, signal) {
      bodies.push(JSON.stringify(body));
      for (const e of steps[bodies.length - 1] ?? answer('extra')) { if (signal.aborted) return; await Promise.resolve(); yield e; }
    },
  };
  const bodyOff = () => { s = { ...s, escobar: { ...s.escobar, sharing: { ...s.escobar.sharing, body: false } } }; };
  const deps: LoopDeps = { transport, getState: () => s, now: () => NOW, appVersion: '37.0.0', manifest: () => buildManifest('37.0.0'), sleep: async () => { bodyOff(); } };
  const loop = new EscobarLoop({ ...newConversation('37.0.0', 'chat', new Date(NOW)), id: 'c1' }, deps);
  return { loop, bodies };
}

describe('COACH 01: retry after sharing is switched off', () => {
  for (const code of ['upstream_busy', 'timeout'] as const) {
    it(`${code}: first request carries the weight, the retry does not`, async () => {
      const h = harness([{ t: 'error', code, message: code }]);
      await h.loop.send({ text: 'how am I doing' });
      expect(h.bodies.length).toBe(2);
      // Precondition: sharing was on for the first request, so the brief had the weight.
      expect(h.bodies[0]).toMatch(/weight 80\.5/);
      // Correct behaviour: the retry is a new transmission and must honour the current switch.
      expect(h.bodies[1], 'retry body still contains body weight after sharing.body=false').not.toMatch(/weight 80\.5/);
    });
  }

  it('control: rebuilding the same messages under the current switch removes the weight', async () => {
    const h = harness([{ t: 'error', code: 'upstream_busy', message: 'busy' }]);
    await h.loop.send({ text: 'how am I doing' });
    const sent = JSON.parse(h.bodies[0]!).messages as Array<{ role: string; content: unknown }>;
    const stored = sent.map(m => (m.role === 'system' ? { role: 'system', content: m.content } : m)) as never;
    expect(JSON.stringify(toRequestMessages(stored, undefined, { health: true, body: false }))).not.toMatch(/weight 80\.5/);
  });
});
