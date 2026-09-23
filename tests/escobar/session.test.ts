import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadStore, memoryStorage, setEscobarStorage } from '@/escobar/store';
import { activeConversation, resetConversations, send, setTransport, startNewConversation, stop } from '@/escobar/session';
import { escobarUi } from '@/escobar/state';
import type { StreamEvent, Transport } from '@/escobar/transport';

const answer = (text: string): StreamEvent[] => [{ t: 'text', d: text }, { t: 'final', content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 5 }, model: 'm' }];

/** A transport whose turns wait for `release()` (or their abort signal) before answering. */
function gated() {
  let calls = 0;
  const waiting: Array<() => void> = [];
  const aborted: boolean[] = [];
  const t: Transport = {
    async *turn(_body, signal) {
      const n = calls++;
      aborted[n] = false;
      await new Promise<void>(resolve => { waiting.push(resolve); signal.addEventListener('abort', () => { aborted[n] = true; resolve(); }, { once: true }); });
      if (signal.aborted) return;
      for (const e of answer(`answer ${n}`)) yield e;
    },
  };
  return { t, calls: () => calls, aborted, release: () => { for (const r of waiting.splice(0)) r(); } };
}
const tick = () => new Promise(r => setTimeout(r, 0));

beforeEach(() => { setEscobarStorage(memoryStorage()); resetConversations(); escobarUi.value = { ...escobarUi.value, mode: 'chat', draft: '' }; });
afterEach(() => { vi.useRealTimers(); setTransport(null); });

describe('Escobar session ownership (ES-05, ES-06, ES-07)', () => {
  it('a new conversation started mid-turn stays active', async () => {
    const g = gated();
    setTransport(g.t);
    const first = send({ text: 'first question' });
    await tick();
    startNewConversation();
    const fresh = activeConversation.value!.id;
    g.release();
    await first;
    expect(activeConversation.value?.id).toBe(fresh);
    expect(loadStore().activeId).toBe(fresh);
  });

  it('a reset mid-turn leaves nothing stored', async () => {
    const g = gated();
    setTransport(g.t);
    const first = send({ text: 'first question' });
    await tick();
    resetConversations();
    g.release();
    await first;
    expect(loadStore().conversations).toHaveLength(0);
  });
});

describe('Escobar session flow (ES-09, ES-10)', () => {
  it('after a network error, a send 61 s later reaches the transport again', async () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    let calls = 0;
    setTransport({ async *turn() { calls++; if (calls === 1) { yield { t: 'error', code: 'network', message: 'offline' } as StreamEvent; return; } for (const e of answer('back')) yield e; } });
    expect((await send({ text: 'one' })).error?.code).toBe('network');
    const soon = await send({ text: 'two' });
    expect(soon.outcome).toBe('offline');
    expect(calls).toBe(1);
    vi.setSystemTime(Date.now() + 61_000);
    expect((await send({ text: 'three' })).outcome).toBe('done');
    expect(calls).toBe(2);
  });

  it('two sends, then Stop, aborts the second', async () => {
    const g = gated();
    setTransport(g.t);
    const one = send({ text: 'one' });
    await tick();
    g.release();
    expect((await one).outcome).toBe('done');
    const two = send({ text: 'two' });
    await tick();
    stop();
    expect((await two).outcome).toBe('aborted');
    expect(g.aborted).toEqual([false, true]);
  });

  it('a send while answering is refused and the text stays in the composer', async () => {
    const g = gated();
    setTransport(g.t);
    const one = send({ text: 'one' });
    await tick();
    const busy = await send({ text: 'second thought' });
    expect(busy.error).toMatchObject({ code: 'invalid', message: 'Escobar is still answering.' });
    expect(escobarUi.value.draft).toBe('second thought');
    expect(g.calls()).toBe(1);
    g.release();
    expect((await one).outcome).toBe('done');
  });
});
