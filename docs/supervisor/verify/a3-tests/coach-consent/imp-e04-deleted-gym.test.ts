/**
 * IMP-E04: an equipment proposal for a gym deleted before Apply must not save under the missing gym
 * id, report success, or change another gym's bench profile.
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { replaceState, state } from '@/core/store';
import { decide } from '@/escobar/apply';
import { buildProposal, fingerprint } from '@/escobar/tools/actions';
import { memoryStorage, newConversation, setEscobarStorage } from '@/escobar/store';
import { addGym, deleteGym } from '@/slices/workout/units';
import { resolveProfile } from '@/brain/units';
import type { Conversation } from '@/escobar/types';
import { NOW, ctxOf, twoWeeksState } from '../../escobar/fixtures';

const BENCH = 'lib_barbell_bench_press';

beforeEach(() => { vi.useFakeTimers({ now: NOW, toFake: ['Date'] }); replaceState(twoWeeksState()); setEscobarStorage(memoryStorage()); });
afterEach(() => { vi.useRealTimers(); });

describe('IMP-E04: Apply rechecks the referenced gym', () => {
  it('gym deleted while the proposal is pending: not applied, no orphan, other gym unchanged', () => {
    const firstGym = state.value.units.gyms[0]!.id;
    const second = addGym('Second', 'lb')!;
    expect(state.value.units.byExercise[second]).toBeUndefined();
    const p = buildProposal('propose_equipment_profile', { scope: 'exercise', exerciseId: BENCH, gymId: second, profile: { unit: 'lb', step: 2.5 } }, ctxOf(state.value), 'p1');
    const c: Conversation = { ...newConversation('test', 'chat'), proposals: [{ ...p, status: 'awaiting', messageIndex: 1 }] };
    const benchAtFirstBefore = resolveProfile(BENCH, firstGym, state.value.units, { equipment: 'Barbell' });
    deleteGym(second);
    expect(state.value.units.gyms.some(g => g.id === second)).toBe(false);
    // Premise: the fingerprint does not see the deletion.
    expect(fingerprint(p.kind, p.input, state.value)).toBe(p.fingerprint);
    const r = decide(c, 'p1', 'apply');
    expect.soft(r.result.status, 'Apply reported success for a deleted gym').not.toBe('applied');
    expect.soft(state.value.units.byExercise[second], 'profile saved under the deleted gym id').toBeUndefined();
    expect.soft(resolveProfile(BENCH, firstGym, state.value.units, { equipment: 'Barbell' }), "orphan changed the remaining gym's bench profile").toEqual(benchAtFirstBefore);
  });
});
