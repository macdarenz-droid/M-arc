/**
 * IMP-E03: profile Undo must not leave a false "Weight updated" insight, and must not overwrite a
 * newer same-day weigh-in or create two rows for one day.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { decide } from '@/escobar/apply';
import { buildProposal } from '@/escobar/tools/actions';
import { memoryStorage, newConversation, setEscobarStorage } from '@/escobar/store';
import { coachCtx, makeCtx } from '@/escobar/tools/context';
import { runInsightRules } from '@/brain/coach/rules';
import { logWeight } from '@/slices/profile/profile';
import type { Conversation } from '@/escobar/types';
import { NOW, TODAY, ctxOf, twoWeeksState } from './fixtures';
import { addDays } from '@/core/dates';

const proposal = (input: Record<string, unknown>): Conversation => {
  const p = buildProposal('propose_profile', input, ctxOf(state.value), 'p1');
  return { ...newConversation('test', 'chat'), proposals: [{ ...p, status: 'awaiting', messageIndex: 1 }] };
};
const weightInsights = () => runInsightRules(coachCtx(makeCtx(state.value, Date.now()))).filter(i => i.id.startsWith('profile-changed:weight'));

beforeEach(() => {
  vi.useFakeTimers({ now: NOW, toFake: ['Date'] });
  const s = twoWeeksState();
  replaceState({ ...s, profile: { ...s.profile, bodyWeightKg: 80 }, weightLog: [{ day: TODAY, kg: 80 }], profileHistory: [] });
  setEscobarStorage(memoryStorage());
});
afterEach(() => { vi.useRealTimers(); });

describe('IMP-E03: profile Undo', () => {
  it('80 -> apply 82 -> Undo: no insight says 82 was saved', () => {
    const a = decide(proposal({ field: 'bodyWeightKg', value: 82 }), 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    expect(weightInsights().map(i => i.title)).toContain('Weight updated to 82 kg');
    const u = decide(a.conversation, 'p1', 'undo', a.result.undo);
    expect(u.result.status).toBe('undone');
    expect(state.value.profile.bodyWeightKg).toBe(80);
    expect(weightInsights().map(i => i.title), 'insight still claims the undone 82 kg is current').not.toContain('Weight updated to 82 kg');
  });

  it('80 -> apply 82 -> manual 81 same day -> Undo: 81 stays and today has one row', () => {
    const a = decide(proposal({ field: 'bodyWeightKg', value: 82 }), 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    logWeight(81);
    decide(a.conversation, 'p1', 'undo', a.result.undo);
    const todayRows = state.value.weightLog.filter(w => w.day === TODAY).map(w => w.kg);
    expect.soft(todayRows, 'duplicate same-day weight rows after Undo').toEqual([81]);
    expect.soft(state.value.profile.bodyWeightKg, 'Undo overwrote the newer manual weigh-in').toBe(81);
  });

  it('80 -> apply 82 -> manual 81 next day -> Undo: 81 stays current and only the row Apply wrote is reverted', () => {
    const a = decide(proposal({ field: 'bodyWeightKg', value: 82 }), 'p1', 'apply');
    expect(a.result.status).toBe('applied');
    vi.setSystemTime(NOW + 86_400_000);
    logWeight(81);
    expect(decide(a.conversation, 'p1', 'undo', a.result.undo).result.status).toBe('undone');
    expect(state.value.profile.bodyWeightKg, 'Undo overwrote the newer weigh-in').toBe(81);
    expect(state.value.weightLog.filter(w => w.day === TODAY).map(w => w.kg)).toEqual([80]);
    expect(state.value.weightLog.find(w => w.day === addDays(TODAY, 1))?.kg).toBe(81);
  });
});
