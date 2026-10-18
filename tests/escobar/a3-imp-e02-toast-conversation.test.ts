/**
 * IMP-E02: A's Undo toast, tapped while B (with its own applied p1) is visible, must not undo B's p1.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { onProposal } from '@/escobar/apply';
import { buildProposal } from '@/escobar/tools/actions';
import { memoryStorage, newConversation, setEscobarStorage } from '@/escobar/store';
import { activeConversation, send, setTransport, storeSig } from '@/escobar/session';
import type { StreamEvent, Transport } from '@/escobar/transport';
import { toast } from '@/app/toast';
import type { Conversation } from '@/escobar/types';
import { NOW, ctxOf, twoWeeksState } from './fixtures';

const conv = (id: string, name: string, input: Record<string, unknown>): Conversation => {
  const p = buildProposal(name, input, ctxOf(state.value), 'p1');
  return { ...newConversation('test', 'chat'), id, proposals: [{ ...p, status: 'awaiting', messageIndex: 1 }] };
};
const flush = async () => { for (let i = 0; i < 5; i++) await new Promise(r => setTimeout(r, 0)); };

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  replaceState(twoWeeksState());
  setEscobarStorage(memoryStorage());
  toast.value = null;
});
afterEach(() => { vi.useRealTimers(); setTransport(null); activeConversation.value = null; });

describe('IMP-E02: the Undo toast is bound to its own conversation', () => {
  it("A's toast tapped while B is visible leaves B's applied p1 alone", async () => {
    expect(state.value.preferences.showSpark).toBe(true);
    expect(state.value.preferences.autoRest).toBe(true);
    // B: p1 turns the daily quote off, applied.
    activeConversation.value = conv('c_B', 'propose_setting', { setting: { key: 'showSpark', value: false } });
    expect((await onProposal('p1', 'apply')).status).toBe('applied');
    const bApplied = activeConversation.value!;
    // A: its own p1 (built after B applied, so its fingerprint is current) turns automatic rest off.
    activeConversation.value = conv('c_A', 'propose_setting', { setting: { key: 'autoRest', value: false } });
    expect((await onProposal('p1', 'apply')).status).toBe('applied');
    const aToast = toast.value!;
    expect(aToast.action).toBe('Undo');
    // Back to B within the 8 s window; tap A's still-visible toast.
    activeConversation.value = bApplied;
    aToast.onAction!();
    await flush();
    // Correct: B's change and B's record are untouched (A's change is undone, or the toast does nothing).
    expect(state.value.preferences.showSpark, "B's daily-quote change was reversed by A's toast").toBe(false);
    expect(activeConversation.value!.proposals!.find(p => p.id === 'p1')!.status, "B's p1 was marked undone").toBe('applied');
  });

  it("A's toast tapped while B is visible undoes A's own change and B stays visible", async () => {
    replaceState({ ...state.value, escobar: { ...state.value.escobar, enabled: true } });
    const answer = (text: string): StreamEvent[] => [{ t: 'text', d: text }, { t: 'final', content: [{ type: 'text', text }], stop_reason: 'end_turn', usage: { input_tokens: 10, output_tokens: 5 }, model: 'm' }];
    const transport: Transport = { async *turn() { for (const e of answer('ok')) yield e; } };
    setTransport(transport);
    // B: p1 turns the daily quote off, applied.
    activeConversation.value = conv('c_B2', 'propose_setting', { setting: { key: 'showSpark', value: false } });
    expect((await onProposal('p1', 'apply')).status).toBe('applied');
    const bApplied = activeConversation.value!;
    // A: p1 turns automatic rest off; then a turn runs, so the session's loop holds A.
    activeConversation.value = conv('c_A2', 'propose_setting', { setting: { key: 'autoRest', value: false } });
    expect((await onProposal('p1', 'apply')).status).toBe('applied');
    expect(state.value.preferences.autoRest).toBe(false);
    const aToast = toast.value!;
    await send({ text: 'hello' });
    expect(activeConversation.value!.id).toBe('c_A2');
    expect(activeConversation.value!.messages.length).toBeGreaterThan(0);
    // B is visible again (the loop still holds A); A's toast is tapped.
    activeConversation.value = bApplied;
    aToast.onAction!();
    await flush();
    expect(state.value.preferences.autoRest, "A's own change was not undone").toBe(true);
    expect(state.value.preferences.showSpark, "B's change was touched").toBe(false);
    expect(activeConversation.value!.id, 'the visible chat switched').toBe('c_B2');
    const storedA = () => storeSig.value.conversations.find(c => c.id === 'c_A2')!;
    expect(storedA().proposals!.find(p => p.id === 'p1')!.status).toBe('undone');
    // The loop's own copy of A keeps the decision: its next save does not bring "applied" back.
    activeConversation.value = storedA();
    await send({ text: 'again' });
    expect(storedA().proposals!.find(p => p.id === 'p1')!.status, "the loop's next save dropped the Undo").toBe('undone');
  });
});
