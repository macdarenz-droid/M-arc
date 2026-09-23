/**
 * The gate's mock Worker (§23 EV5): loaded by dynamic import only when `marc.dev === '1'`,
 * never touches the network. It plays a fixed conversation shape (a preamble, two reads, a
 * lift_trend chart, a proposal, then an answer citing a real fact with chips) whose tool
 * calls run through the real executor, so citations and cards are genuine.
 */
import type { AppState } from '@/core/models';
import { GOALS } from '@/data/goals';
import type { StreamEvent, Transport } from '../transport';

const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

function latestExercise(s: AppState): string {
  for (const sess of [...s.sessions].reverse()) for (const e of sess.exercises) if (e.sets.some(x => (x.kg ?? 0) > 0)) return e.exerciseId;
  return 'lib_barbell_bench_press';
}

interface Msg { role: string; content: unknown }

export function mockTransport(getState: () => AppState, delayMs = 25): Transport {
  return {
    async *turn(body, signal) {
      const b = body as { messages: Msg[]; mode: string };
      // Steps since the last real user message decide what comes next.
      let step = 0;
      for (let i = b.messages.length - 1; i >= 0; i--) {
        const m = b.messages[i]!;
        if (m.role === 'assistant') step++;
        if (m.role === 'user' && Array.isArray(m.content) && !m.content.some(x => (x as { type: string }).type === 'tool_result') && !JSON.stringify(m.content).includes('[app] verification check')) break;
      }
      const s = getState();
      const ex = latestExercise(s);
      const events: StreamEvent[] = [{ t: 'start', requestId: `mock_${Date.now()}` }, { t: 'thinking' }];
      const toolStep = (preamble: string, uses: Array<{ id: string; name: string; input: unknown }>): StreamEvent[] => [
        ...(preamble ? [{ t: 'text' as const, d: preamble }] : []),
        ...uses.flatMap((u): StreamEvent[] => [{ t: 'tool', id: u.id, name: u.name }, { t: 'tool_input', id: u.id, input: u.input }]),
        { t: 'final', content: [{ type: 'thinking', thinking: '', signature: 'mock' }, ...(preamble ? [{ type: 'text', text: preamble }] : []), ...uses.map(u => ({ type: 'tool_use', ...u }))], stop_reason: 'tool_use', usage: { input_tokens: 1200, output_tokens: 60, cache_read_input_tokens: 9000 }, model: 'claude-opus-5' },
      ];
      if (step === 0) {
        events.push(...toolStep('Let me look at your recent lifting.', [
          { id: `m_${Date.now()}_1`, name: 'get_exercise_history', input: { exerciseId: ex, weeks: 12 } },
          { id: `m_${Date.now()}_2`, name: 'show', input: { component: 'lift_trend', params: { exerciseId: ex, weeks: 12, metric: 'e1rm' }, caption: 'Strength estimate, last 12 weeks' } },
        ]));
      } else if (step === 1) {
        const goal = GOALS.find(g => g.id !== s.goal)!.id;
        events.push(...toolStep('', [{ id: `m_${Date.now()}_3`, name: 'propose_goal', input: { goal } }]));
      } else {
        // Cite the best e1RM fact from the history tool result.
        let cite = '';
        for (const m of b.messages) {
          if (m.role !== 'user' || !Array.isArray(m.content)) continue;
          for (const blk of m.content as Array<{ type: string; content?: string }>) {
            if (blk.type !== 'tool_result' || !blk.content) continue;
            try {
              const facts = (JSON.parse(blk.content) as { facts?: Record<string, string> }).facts ?? {};
              const hit = Object.entries(facts).reverse().find(([, v]) => / e1rm = /.test(v));
              if (hit) { const value = hit[1].split(' = ')[1]!.split(' ')[0]!; cite = `Your latest strength estimate is ${value} kg ⟦${hit[0]}⟧, and the line above shows where it came from.`; }
            } catch { /* not JSON */ }
          }
        }
        const text = `${cite || 'Your recent sessions look steady.'} Keep adding a rep before adding load, and tap Apply if you want the goal change. ⟦chips: Why is my readiness amber? | Plan tomorrow | Show my records⟧`;
        for (let i = 0; i < text.length; i += 18) events.push({ t: 'text', d: text.slice(i, i + 18) });
        events.push({ t: 'final', content: [{ type: 'thinking', thinking: '', signature: 'mock' }, { type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 1500, output_tokens: 90, cache_read_input_tokens: 9000 }, model: 'claude-opus-5' });
      }
      for (const e of events) {
        if (signal.aborted) return;
        await wait(delayMs);
        yield e;
      }
    },
  };
}
