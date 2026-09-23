import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { addDays } from '@/core/dates';
import { decide, hasUndo, onProposal, undoOpen, UNDO_WINDOW_MS } from '@/escobar/apply';
import { buildAction, buildProposal } from '@/escobar/tools/actions';
import { memoryStorage, newConversation, setEscobarStorage } from '@/escobar/store';
import { activeConversation } from '@/escobar/session';
import { commitSet, setSet } from '@/slices/workout/session';
import { logWeight } from '@/slices/profile/profile';
import { GOALS } from '@/data/goals';
import { PPL6 } from '../fixtures/plans';
import type { Conversation } from '@/escobar/types';
import { NOW, TODAY, ctxOf, twoWeeksState } from './fixtures';

const proposal = (name: string, input: Record<string, unknown>, id = 'p1'): Conversation => {
  const p = buildProposal(name, input, ctxOf(state.value), id);
  return { ...newConversation('test', 'chat'), proposals: [{ ...p, status: 'awaiting', messageIndex: 1 }] };
};
const otherGoal = () => GOALS.find(g => g.id !== state.value.goal)!.id;

beforeEach(() => { vi.useFakeTimers({ now: NOW, toFake: ['Date'] }); replaceState(twoWeeksState()); setEscobarStorage(memoryStorage()); });
afterEach(() => { vi.useRealTimers(); activeConversation.value = null; });

describe('undo inverses (ES-02)', () => {
  it('start session → a set logged → undo leaves the session alone', () => {
    const splitId = state.value.splits[0]!.id;
    const a = decide(proposal('propose_start_session', { splitId }), 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    const started = state.value.active!;
    setSet(0, 0, { kg: 60, reps: 8 });
    commitSet(0, 0);
    const u = decide(a.conversation, 'p1', 'undo', a.result.undo);
    expect(u.result).toMatchObject({ ok: false, message: 'Undo is no longer available.' });
    expect(state.value.active?.id).toBe(started.id);
    expect(u.conversation).toBe(a.conversation);
  });

  it('start session → untouched → undo discards it', () => {
    const a = decide(proposal('propose_start_session', { splitId: state.value.splits[0]!.id }), 'p1', 'apply');
    expect(state.value.active).toBeTruthy();
    expect(decide(a.conversation, 'p1', 'undo', a.result.undo).result.status).toBe('undone');
    expect(state.value.active).toBeNull();
  });

  it('profile undo keeps a later weigh-in', () => {
    const a = decide(proposal('propose_profile', { field: 'bodyWeightKg', value: 82 }), 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    vi.setSystemTime(NOW + 86_400_000);
    logWeight(81);
    decide(a.conversation, 'p1', 'undo', a.result.undo);
    const tomorrow = addDays(TODAY, 1);
    expect(state.value.weightLog.find(w => w.day === tomorrow)?.kg).toBe(81);
    expect(state.value.weightLog.some(w => w.day === TODAY && w.kg === 82)).toBe(false);
  });
});

describe('undo window (ES-03, ES-04)', () => {
  it('after 8 s Undo is no longer offered or honoured', async () => {
    const before = state.value.goal;
    activeConversation.value = proposal('propose_goal', { goal: otherGoal() });
    const c = activeConversation.value;
    expect((await onProposal('p1', 'apply')).status).toBe('applied');
    const p = () => activeConversation.value!.proposals!.find(x => x.id === 'p1')!;
    expect(undoOpen(c.id, p())).toBe(true);
    vi.setSystemTime(NOW + UNDO_WINDOW_MS + 1);
    expect(undoOpen(c.id, p())).toBe(false);
    const r = await onProposal('p1', 'undo');
    expect(r).toMatchObject({ ok: false, message: 'Undo is no longer available.' });
    expect(state.value.goal).not.toBe(before);
  });

  it('after a reload (no inverse held) undo is no longer available and records nothing', () => {
    const a = decide(proposal('propose_goal', { goal: otherGoal() }), 'p1', 'apply');
    const u = decide(a.conversation, 'p1', 'undo');
    expect(u.result.message).toBe('Undo is no longer available.');
    expect(u.conversation.pendingDecisions).toHaveLength(1);
  });

  it('p1 in two conversations keeps separate inverses', async () => {
    const before = state.value.goal;
    const one = proposal('propose_goal', { goal: otherGoal() });
    const two = { ...proposal('propose_goal', { goal: otherGoal() }), id: 'c_other' };
    activeConversation.value = one;
    await onProposal('p1', 'apply');
    const applied = activeConversation.value!;
    expect(hasUndo(one.id, 'p1')).toBe(true);
    expect(hasUndo(two.id, 'p1')).toBe(false);
    activeConversation.value = two;
    expect((await onProposal('p1', 'undo')).message).toBe('Undo is no longer available.');
    expect(state.value.goal).not.toBe(before);
    activeConversation.value = applied;
    expect((await onProposal('p1', 'undo')).status).toBe('undone');
    expect(state.value.goal).toBe(before);
  });
});

describe('programme during a session', () => {
  it('is refused while a session runs', () => {
    decide(proposal('propose_start_session', { splitId: state.value.splits[0]!.id }), 'p1', 'apply');
    expect(() => buildAction('propose_program', { draft: PPL6, replaceExisting: true }, ctxOf(state.value))).toThrow(/session is running/);
  });
});
