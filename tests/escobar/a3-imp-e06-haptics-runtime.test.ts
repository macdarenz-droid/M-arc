/**
 * IMP-E06: a coach "Haptic feedback" Apply/Undo must change the runtime switch too, as the Settings
 * toggle does. Web path with a stubbed navigator.vibrate; no native plugin (isNative() is false).
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { decide } from '@/escobar/apply';
import { buildProposal } from '@/escobar/tools/actions';
import { memoryStorage, newConversation, setEscobarStorage } from '@/escobar/store';
import { haptic, setHapticsEnabled } from '@/native/haptics';
import type { Conversation } from '@/escobar/types';
import { NOW, ctxOf, twoWeeksState } from './fixtures';

const vibrate = vi.fn();
const proposal = (value: boolean): Conversation => {
  const p = buildProposal('propose_setting', { setting: { key: 'haptics', value } }, ctxOf(state.value), 'p1');
  return { ...newConversation('test', 'chat'), proposals: [{ ...p, status: 'awaiting', messageIndex: 1 }] };
};
const start = (on: boolean) => {
  const s = twoWeeksState();
  replaceState({ ...s, preferences: { ...s.preferences, haptics: on } });
  setHapticsEnabled(on); // as main.tsx does at startup
};

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  setEscobarStorage(memoryStorage());
  vibrate.mockReset();
  vi.stubGlobal('navigator', { vibrate });
});
afterEach(() => { vi.useRealTimers(); vi.unstubAllGlobals(); setHapticsEnabled(true); });

describe('IMP-E06: coach haptics setting reaches the runtime switch', () => {
  it('Apply "off" while on: the next haptic is silent', async () => {
    start(true);
    await haptic.alert();
    expect(vibrate).toHaveBeenCalledTimes(1); // control: the web path vibrates while on
    vibrate.mockReset();
    expect(decide(proposal(false), 'p1', 'apply').result.status).toBe('applied');
    expect(state.value.preferences.haptics).toBe(false);
    await haptic.alert();
    expect(vibrate, 'vibrated after the saved preference became off').not.toHaveBeenCalled();
  });

  it('Apply "on" while off: the next haptic plays without a restart', async () => {
    start(false);
    const a = decide(proposal(true), 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    expect(state.value.preferences.haptics).toBe(true);
    await haptic.alert();
    expect(vibrate, 'silent although the saved preference is on').toHaveBeenCalledTimes(1);
  });

  it('Undo of "off" re-enables runtime haptics', async () => {
    start(true);
    const a = decide(proposal(false), 'p1', 'apply');
    setHapticsEnabled(state.value.preferences.haptics); // simulate a correct Apply-side sync, then test Undo alone
    decide(a.conversation, 'p1', 'undo', a.result.undo);
    expect(state.value.preferences.haptics).toBe(true);
    await haptic.alert();
    expect(vibrate, 'Undo restored the preference but not the runtime switch').toHaveBeenCalledTimes(1);
  });
});
