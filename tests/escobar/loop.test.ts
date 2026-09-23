import { describe, it, expect } from 'vitest';
import { EscobarLoop, toRequestMessages, windowMessages, offlineReply, STEP_BUDGET, type LoopDeps } from '@/escobar/loop';
import type { StreamEvent, Transport } from '@/escobar/transport';
import { newConversation } from '@/escobar/store';
import type { Conversation, StoredMessage } from '@/escobar/types';
import type { MemoryEffect } from '@/escobar/tools/executor';
import { sixMonthsState, NOW } from './fixtures';
import { buildManifest } from '@/escobar/context/manifest';

type Step = StreamEvent[] | ((body: { messages: unknown[] }) => StreamEvent[]);
const final = (content: unknown[], stop_reason = 'end_turn'): StreamEvent => ({ t: 'final', content, stop_reason, usage: { input_tokens: 1000, output_tokens: 50, cache_read_input_tokens: 800 }, model: 'claude-opus-5' });
const tools = (...uses: Array<[string, string, unknown]>): StreamEvent[] => [
  { t: 'thinking' },
  ...uses.flatMap(([id, name, input]): StreamEvent[] => [{ t: 'tool', id, name }, { t: 'tool_input', id, input }]),
  final([{ type: 'thinking', thinking: '', signature: 's' }, ...uses.map(([id, name, input]) => ({ type: 'tool_use', id, name, input }))], 'tool_use'),
];
const answer = (text: string): StreamEvent[] => [{ t: 'text', d: text.slice(0, 5) }, { t: 'text', d: text.slice(5) }, final([{ type: 'thinking', thinking: '', signature: 's' }, { type: 'text', text }])];

function scripted(steps: Step[]): Transport & { bodies: Array<{ messages: unknown[]; mode: string }> } {
  const bodies: Array<{ messages: unknown[]; mode: string }> = [];
  return {
    bodies,
    async *turn(body, signal) {
      const b = JSON.parse(JSON.stringify(body));
      bodies.push(b);
      const s = steps[bodies.length - 1];
      if (!s) throw new Error('no more scripted steps');
      for (const e of typeof s === 'function' ? s(b) : s) {
        if (signal.aborted) return;
        await Promise.resolve();
        yield e;
      }
    },
  };
}

function setup(steps: Step[], extra: Partial<LoopDeps> = {}) {
  const transport = scripted(steps);
  const effects: MemoryEffect[] = [];
  const usage: unknown[] = [];
  const saved: Conversation[] = [];
  const state = sixMonthsState();
  const deps: LoopDeps = {
    transport, getState: () => state, now: () => NOW, appVersion: '37.0.0', manifest: () => buildManifest('37.0.0'),
    applyEffect: e => effects.push(e), recordUsage: u => usage.push(u), persist: c => saved.push(c), sleep: async () => {}, ...extra,
  };
  const loop = new EscobarLoop({ ...newConversation('37.0.0', 'chat', new Date(NOW)), id: 'c1' }, deps);
  return { loop, transport, effects, usage, saved };
}

/** Every request must be a valid API history: roles, system placement, tool pairing. */
function assertValidHistory(messages: StoredMessage[]) {
  expect(messages[0]!.role).toBe('user');
  const open = new Set<string>();
  messages.forEach((m, i) => {
    if (m.role === 'system') {
      expect(messages[i - 1]!.role).toBe('user');
      if (i < messages.length - 1) expect(messages[i + 1]!.role).toBe('assistant');
    }
    if (m.role === 'assistant') for (const b of m.content as Array<{ type: string; id: string }>) if (b.type === 'tool_use') open.add(b.id);
    if (m.role === 'user') for (const b of m.content) if (b.type === 'tool_result') { expect(open.has(b.tool_use_id)).toBe(true); open.delete(b.tool_use_id); }
    if (m.role === 'user' && i > 0 && open.size) expect(m.content.every(b => b.type === 'tool_result')).toBe(true);
  });
  expect(open.size).toBe(0);
}

describe('agent loop (§13)', () => {
  it('runs a full 6-step conversation: parallel reads, a chart, a proposal, a memory write and a repair round', async () => {
    const { loop, transport, effects, usage } = setup([
      tools(['t1', 'get_overview', {}], ['t2', 'get_readiness', { historyDays: 7 }]),
      tools(['t3', 'show', { component: 'lift_trend', params: { exerciseId: 'lib_barbell_bench_press', weeks: 12 } }]),
      tools(['t4', 'propose_goal', { goal: 'strength' }]),
      tools(['t5', 'remember', { kind: 'preference', text: 'Likes short sessions' }]),
      answer('Readiness is amber today. Your bench could reach 187.5 kg by spring.'),
      answer('Readiness is amber today, so keep loads steady. ⟦chips: Why amber? | Plan tomorrow⟧'),
    ]);
    const r = await loop.send({ text: 'How am I doing, and should I change my goal?' });
    expect(r.outcome).toBe('done');
    expect(transport.bodies).toHaveLength(6);
    const c = loop.conversation;
    assertValidHistory(c.messages);
    // user, brief, then (assistant, tool results) × 4, then a repaired answer
    expect(c.messages.map(m => m.role).slice(0, 4)).toEqual(['user', 'system', 'assistant', 'user']);
    const firstResults = c.messages[3] as Extract<StoredMessage, { role: 'user' }>;
    expect(firstResults.content.map(b => (b as { tool_use_id: string }).tool_use_id)).toEqual(['t1', 't2']);
    expect(c.proposals!.map(p => [p.id, p.kind, p.status])).toEqual([['p1', 'propose_goal', 'awaiting']]);
    expect(effects.map(e => e.type)).toEqual(['remember']);
    expect(r.outcomes.find(o => o.show)!.show!.component).toBe('lift_trend');
    // the repair round
    const repair = c.messages.find(m => m.role === 'user' && m.meta?.repair);
    expect(repair).toBeTruthy();
    const sys = c.messages.filter(m => m.role === 'system').map(m => m.content as string);
    expect(sys.at(-1)).toContain('187.5');
    expect(r.revised).toBe(true);
    expect(r.answer!.chips).toEqual(['Why amber?', 'Plan tomorrow']);
    const answers = c.messages.filter(m => m.role === 'assistant' && m.meta.rendered.answer);
    expect(answers).toHaveLength(1);
    expect(c.messages.filter(m => m.role === 'assistant' && m.meta.rendered.revised)).toHaveLength(1);
    expect(c.userTurns).toBe(1);
    expect(c.ledger.length).toBeGreaterThan(10);
    expect(usage).toEqual([{ turns: 1, inputTokens: 6000, outputTokens: 300, cacheReadTokens: 4800 }]);
    expect(c.title).toBe('How am I doing, and should I change my goal?'.slice(0, 40));
  });

  it('never sends app-only fields and puts the brief right after the user message', async () => {
    const { loop, transport } = setup([answer('Hi.')]);
    await loop.send({ text: 'hello', contextRefs: [{ kind: 'exercise', id: 'lib_barbell_bench_press', label: 'Bench press' }] });
    const msgs = transport.bodies[0]!.messages as Array<{ role: string; content: unknown; meta?: unknown }>;
    expect(msgs.map(m => m.role)).toEqual(['user', 'system']);
    expect(msgs.some(m => 'meta' in m)).toBe(false);
    expect(JSON.stringify(msgs[0])).toContain('[about: exercise lib_barbell_bench_press \\"Bench press\\"] hello');
    expect(String(msgs[1]!.content)).toMatch(/^now: /m);
  });

  it('stops at the step budget and closes orphaned tool calls', async () => {
    const steps = Array.from({ length: STEP_BUDGET.chat }, (_, i) => tools([`t${i}`, 'get_overview', {}]));
    const { loop } = setup(steps);
    const r = await loop.send({ text: 'loop forever' });
    expect(r.outcome).toBe('step_limit');
    assertValidHistory(loop.conversation.messages);
  });

  it('never runs tools from a max_tokens cut-off; closes them as not run', async () => {
    const cut: StreamEvent[] = [{ t: 'tool', id: 'x', name: 'propose_goal' }, final([{ type: 'tool_use', id: 'x', name: 'propose_goal', input: { goal: 'strength' } }], 'max_tokens')];
    const { loop } = setup([cut]);
    const r = await loop.send({ text: 'switch goal' });
    expect(r.outcome).toBe('cut_off');
    expect(loop.conversation.proposals ?? []).toEqual([]);
    const last = loop.conversation.messages.at(-1) as Extract<StoredMessage, { role: 'user' }>;
    expect(last.content[0]).toMatchObject({ type: 'tool_result', tool_use_id: 'x', is_error: true, content: 'not run: cut_off' });
    assertValidHistory(loop.conversation.messages);
  });

  it('a refusal or a quota error before any reply leaves history untouched (Not sent · Retry)', async () => {
    const a = setup([[{ t: 'text', d: 'Hmm' }, { t: 'refusal', category: 'cyber' }]]);
    const r = await a.loop.send({ text: 'x' });
    expect(r).toMatchObject({ outcome: 'refusal', notSent: true, refusal: { category: 'cyber' } });
    expect(a.loop.conversation.messages).toEqual([]);
    expect(a.loop.view.text).toBe('');
    const b = setup([[{ t: 'error', code: 'quota', message: 'resting', retryAfter: 60 }]]);
    const q = await b.loop.send({ text: 'x' });
    expect(q).toMatchObject({ outcome: 'error', notSent: true, error: { code: 'quota' } });
    expect(b.loop.conversation.messages).toEqual([]);
  });

  it('retries once on a busy upstream before anything was shown, never on invalid', async () => {
    const a = setup([[{ t: 'error', code: 'upstream_busy', message: 'busy' }], answer('Done.')]);
    expect((await a.loop.send({ text: 'x' })).outcome).toBe('done');
    expect(a.transport.bodies).toHaveLength(2);
    const b = setup([[{ t: 'error', code: 'invalid', message: 'bad' }], answer('Done.')]);
    expect((await b.loop.send({ text: 'x' })).outcome).toBe('error');
    expect(b.transport.bodies).toHaveLength(1);
  });

  it('Stop during a later step drops the stream and closes orphans; a stale generation is ignored', async () => {
    let loopRef: EscobarLoop | null = null;
    const { loop } = setup([
      tools(['t1', 'get_overview', {}]),
      () => { loopRef!.stop(); return answer('late text'); },
    ]);
    loopRef = loop;
    const r = await loop.send({ text: 'x' });
    expect(r.outcome).toBe('aborted');
    assertValidHistory(loop.conversation.messages);
    expect(loop.conversation.messages.some(m => m.role === 'assistant' && JSON.stringify(m.content).includes('late text'))).toBe(false);
  });

  it('keeps unverified sentences muted when the repair still has invented numbers', async () => {
    const { loop } = setup([answer('Add 12.5 kg next week.'), answer('Add 12.5 kg next week, trust me.')]);
    const r = await loop.send({ text: 'x' });
    expect(r.outcome).toBe('done');
    expect(r.unverified).toEqual(['Add 12.5 kg next week, trust me.']);
    const rendered = loop.conversation.messages.filter(m => m.role === 'assistant').at(-1)!;
    expect(rendered.role === 'assistant' && rendered.meta.rendered.unverified).toEqual(['Add 12.5 kg next week, trust me.']);
  });

  it('offline answers navigation questions from the palace without sending', async () => {
    const { loop, transport } = setup([], { online: () => false });
    const r = await loop.send({ text: 'where is my recovery?' });
    expect(r.outcome).toBe('offline');
    expect(r.local!.entries.length).toBeGreaterThan(0);
    expect(transport.bodies).toHaveLength(0);
    expect(offlineReply('zzqx').entries).toEqual([]);
  });

  it('flags crisis at once, even before the network', async () => {
    const seen: string[] = [];
    const { loop } = setup([], { online: () => false, onSafety: s => seen.push(s) });
    await loop.send({ text: 'I want to kill myself' });
    expect(seen).toEqual(['crisis']);
  });

  it('decisions reach the next brief once, then clear', async () => {
    const { loop, transport } = setup([answer('Noted.'), answer('Ok.')]);
    await loop.send({ text: 'hi' });
    loop.conversation = { ...loop.conversation, pendingDecisions: [{ proposalId: 'p1', decision: 'applied', at: 'now', title: 'Switch goal' }] };
    await loop.send({ text: 'thanks' });
    const secondBrief = (transport.bodies[1]!.messages as Array<{ role: string; content: string }>).filter(m => m.role === 'system').at(-1)!.content;
    expect(secondBrief).toContain('decisions: proposal p1 "Switch goal" → applied');
    expect(loop.conversation.pendingDecisions).toEqual([]);
  });

  it('photos are sent once, then as a stub', async () => {
    const { loop, transport } = setup([answer('A rack.'), answer('Ok.')], { imageData: id => (id === 'img1' ? { mediaType: 'image/jpeg', data: 'QUJD' } : null) });
    await loop.send({ text: 'what is this', images: [{ type: 'image_ref', id: 'img1', mediaType: 'image/jpeg', description: 'dumbbell rack' }] });
    await loop.send({ text: 'and now?' });
    expect(JSON.stringify(transport.bodies[0]!.messages)).toContain('"type":"image"');
    expect(JSON.stringify(transport.bodies[1]!.messages)).not.toContain('"type":"image"');
    expect(JSON.stringify(transport.bodies[1]!.messages)).toContain('[photo shared earlier: dumbbell rack]');
  });
});

describe('history window (§11.4)', () => {
  it('replaces the oldest half with the rolling summary in the request only', () => {
    const conv = newConversation('37.0.0');
    // ES-16: the window now checks the size again after the cut, so the data leaves the kept half under the limit.
    const big = 'x'.repeat(4500);
    const msgs: StoredMessage[] = [];
    for (let i = 0; i < 60; i++) { msgs.push({ role: 'user', content: [{ type: 'text', text: `${i} ${big}` }] }); msgs.push({ role: 'assistant', content: [{ type: 'text', text: 'ok' }], meta: { rendered: {} } }); }
    const trimmed = windowMessages(conv, msgs);
    expect(trimmed.length).toBeLessThan(msgs.length);
    expect(JSON.stringify(trimmed[0])).toContain('[earlier conversation trimmed]');
    const withSummary = windowMessages({ ...conv, rollingSummary: { text: 'We planned a PPL.', upTo: 40 } }, msgs);
    expect(JSON.stringify(withSummary[0])).toContain('[summary of earlier conversation] We planned a PPL.');
    expect(withSummary.length).toBe(msgs.length - 40 + 1);
    expect(toRequestMessages(withSummary).length).toBe(withSummary.length);
  });
  it('keeps trimming at clean user turns until the request fits (ES-16)', () => {
    const conv = newConversation('37.0.0');
    const big = 'x'.repeat(9000);
    const msgs: StoredMessage[] = [];
    for (let i = 0; i < 60; i++) { msgs.push({ role: 'user', content: [{ type: 'text', text: `${i} ${big}` }] }); msgs.push({ role: 'assistant', content: [{ type: 'text', text: 'ok' }], meta: { rendered: {} } }); }
    const w = windowMessages({ ...conv, rollingSummary: { text: 'Earlier.', upTo: 40 } }, msgs);
    expect(Math.ceil(JSON.stringify(toRequestMessages(w)).length / 4)).toBeLessThanOrEqual(60_000);
    expect(JSON.stringify(w[0])).toContain('[later messages trimmed]');
    expect((w[1] as { role: string }).role).toBe('user');
  });
});
