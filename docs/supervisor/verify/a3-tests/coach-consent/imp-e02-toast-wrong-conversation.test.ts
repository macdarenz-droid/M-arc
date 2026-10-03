/**
 * IMP-E02: A's Undo toast, tapped while B (with its own applied p1) is visible, must not undo B's p1.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { onProposal } from '@/escobar/apply';
import { buildProposal } from '@/escobar/tools/actions';
import { memoryStorage, newConversation, setEscobarStorage } from '@/escobar/store';
import { activeConversation } from '@/escobar/session';
import { toast } from '@/app/toast';
import type { Conversation } from '@/escobar/types';
import { NOW, ctxOf, twoWeeksState } from '../../escobar/fixtures';

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
afterEach(() => { vi.useRealTimers(); activeConversation.value = null; });

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
});
