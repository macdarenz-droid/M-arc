import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { NOW, twoWeeksState, emptyState, ctxOf } from './fixtures';
import { turnsOf } from '@/escobar/ui/Message';
import { starterChips, dockPromptFor, contextRefFor } from '@/escobar/ui/prompts';
import { decide, canApply } from '@/escobar/apply';
import { buildProposal } from '@/escobar/tools/actions';
import { newConversation } from '@/escobar/store';
import { GOALS } from '@/data/goals';
import type { Conversation, StoredMessage } from '@/escobar/types';

describe('turnsOf', () => {
  it('groups tool steps, repairs and results into one Escobar turn per user message', () => {
    const m: StoredMessage[] = [
      { role: 'user', content: [{ type: 'text', text: 'hi' }] },
      { role: 'system', content: 'brief' },
      { role: 'assistant', content: [{ type: 'tool_use', id: 't1', name: 'get_overview', input: {} }], meta: { rendered: {} } },
      { role: 'user', content: [{ type: 'tool_result', tool_use_id: 't1', content: '{}' }] },
      { role: 'assistant', content: [{ type: 'text', text: 'first' }], meta: { rendered: {} } },
      { role: 'user', content: [{ type: 'text', text: '[app] verification check' }], meta: { repair: true } },
      { role: 'assistant', content: [{ type: 'text', text: 'fixed' }], meta: { rendered: {} } },
      { role: 'user', content: [{ type: 'text', text: 'next' }] },
    ];
    const t = turnsOf(m);
    expect(t.map(x => x.kind)).toEqual(['user', 'escobar', 'user']);
    expect(t[1]).toEqual({ kind: 'escobar', indexes: [2, 3, 4, 5, 6] });
  });
});

describe('prompts', () => {
  it('offers six distinct starter chips, naming the last lift when there is one', () => {
    const s = twoWeeksState();
    const chips = starterChips(s, null);
    expect(chips).toHaveLength(6);
    expect(new Set(chips).size).toBe(6);
    expect(chips.some(c => /^Show my .+ trend$/.test(c))).toBe(true);
    expect(starterChips(emptyState(), null)).toContain('Build me a 4-day programme');
  });
  it('follows the screen for the dock line and the context chip', () => {
    const s = twoWeeksState();
    const ex = s.sessions.at(-1)!.exercises[0]!.exerciseId;
    expect(dockPromptFor({ id: 'history.exercise-stats', details: { exerciseId: ex } }, s, null)).toMatch(/^How is my .+ going\?$/);
    expect(dockPromptFor({ id: 'body.muscle', details: { muscle: 'chest' } }, s, null)).toMatch(/recovered\?$/);
    expect(dockPromptFor(null, s, { band: 'amber' } as never)).toBe('Why is my readiness amber?');
    expect(contextRefFor({ id: 'body.muscle', details: { muscle: 'chest' } }, s)).toMatchObject({ kind: 'muscle', id: 'chest' });
    expect(contextRefFor({ id: 'today.header' }, s)?.kind).toBe('readiness');
    expect(contextRefFor({ id: 'settings.theme' }, s)).toBeNull();
  });
});

describe('apply (EV5 slice)', () => {
  beforeEach(() => { vi.useFakeTimers({ now: NOW, toFake: ['Date'] }); replaceState(twoWeeksState()); });
  afterEach(() => { vi.useRealTimers(); });

  const withGoalProposal = (): Conversation => {
    const other = GOALS.find(g => g.id !== state.value.goal)!.id;
    const p = buildProposal('propose_goal', { goal: other }, ctxOf(state.value), 'p1');
    return { ...newConversation('test', 'chat'), proposals: [{ ...p, status: 'awaiting', messageIndex: 2 }] };
  };

  it('applies a goal change, records the decision, and undoes it', () => {
    const before = state.value.goal;
    const c = withGoalProposal();
    expect(canApply('propose_goal')).toBe(true);
    const a = decide(c, 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    expect(state.value.goal).not.toBe(before);
    expect(a.conversation.pendingDecisions?.[0]).toMatchObject({ proposalId: 'p1', decision: 'applied' });
    const u = decide(a.conversation, 'p1', 'undo', a.result.undo);
    expect(u.result.status).toBe('undone');
    expect(state.value.goal).toBe(before);
  });

  it('refuses a stale proposal when the goal changed since', () => {
    const c = withGoalProposal();
    const third = GOALS.find(g => g.id !== state.value.goal && g.id !== (c.proposals![0]!.input.goal as string))!.id;
    replaceState({ ...state.value, goal: third });
    const r = decide(c, 'p1', 'apply');
    expect(r.result.status).toBe('stale');
    expect(state.value.goal).toBe(third);
  });

  it('dismisses without touching state', () => {
    const before = state.value.goal;
    const r = decide(withGoalProposal(), 'p1', 'dismiss');
    expect(r.result.status).toBe('dismissed');
    expect(r.conversation.proposals?.[0]?.status).toBe('dismissed');
    expect(state.value.goal).toBe(before);
  });
});
