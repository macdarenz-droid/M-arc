import { describe, it, expect, beforeEach } from 'vitest';
import { initStore, replaceState, state } from '@/core/store';
import { freshState, type AppState } from '@/core/models';
import { applySplitDraft, createSplit, MAX_SPLITS } from '@/slices/workout/splits';

const memory = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k) }; };

function seed(): AppState {
  return freshState(new Date('2026-06-01T00:00:00Z'));
}

describe('applySplitDraft', () => {
  beforeEach(() => { initStore(memory()); replaceState(seed()); });

  it('creates a new split with the draft\'s name, focus and exercises when splitId is null', () => {
    const created = applySplitDraft(null, { name: 'Arms', focus: ['biceps', 'triceps'], exercises: [{ exerciseId: 'lib_hammer_curl', sets: 3 }] });
    expect(created).not.toBeNull();
    expect(state.value.splits).toHaveLength(1);
    const split = state.value.splits[0]!;
    expect(split.name).toBe('Arms');
    expect(split.focus).toEqual(['biceps', 'triceps']);
    expect(split.exercises).toEqual([{ exerciseId: 'lib_hammer_curl', sets: 3 }]);
    expect(created).toMatchObject({ name: 'Arms', focus: ['biceps', 'triceps'] });
  });

  it('replaces an existing split\'s name, focus and exercises wholesale when splitId names a real split', () => {
    const push = createSplit('Push', [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }])!;
    const updated = applySplitDraft(push.id, { name: 'Push Day', focus: ['chest'], exercises: [{ exerciseId: 'lib_barbell_bench_press', sets: 3 }, { exerciseId: 'lib_face_pull', sets: 3 }] });
    expect(updated).toMatchObject({ id: push.id, name: 'Push Day', focus: ['chest'] });
    const split = state.value.splits.find(s => s.id === push.id)!;
    expect(split.exercises.map(e => e.exerciseId)).toEqual(['lib_barbell_bench_press', 'lib_face_pull']);
    // The split's id and color are untouched by a modify — only what the draft actually describes changes.
    expect(split.id).toBe(push.id);
    expect(state.value.splits).toHaveLength(1);
  });

  it('returns null and changes nothing when splitId no longer names a real split (deleted mid-conversation)', () => {
    const before = state.value.splits;
    const result = applySplitDraft('split_deleted_already', { name: 'x', focus: [], exercises: [{ exerciseId: 'lib_leg_press', sets: 3 }] });
    expect(result).toBeNull();
    expect(state.value.splits).toBe(before);
  });

  it('respects the split cap on create, same as createSplit itself', () => {
    for (let i = 0; i < MAX_SPLITS; i++) createSplit(`Split ${i}`);
    expect(state.value.splits).toHaveLength(MAX_SPLITS);
    const result = applySplitDraft(null, { name: 'One too many', focus: [], exercises: [{ exerciseId: 'lib_leg_press', sets: 3 }] });
    expect(result).toBeNull();
    expect(state.value.splits).toHaveLength(MAX_SPLITS);
  });
});
