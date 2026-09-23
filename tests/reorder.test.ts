import { describe, expect, it } from 'vitest';
import { replaceState, state } from '@/core/store';
import { freshState } from '@/core/models';
import { moveEntry } from '@/slices/workout/session';

describe('live session reorder', () => {
  it('moves an exercise up or down and keeps its sets', () => {
    const e = (id: string) => ({ exerciseId: id, name: id, sets: [{ kg: 20, reps: 5 }], done: false, skipped: false });
    replaceState({ ...freshState(), active: { splitId: 's', startedAt: new Date().toISOString(), entries: [e('a'), e('b'), e('c')] } as never });
    moveEntry(0, 2);
    expect(state.value.active!.entries.map(x => x.exerciseId)).toEqual(['b', 'c', 'a']);
    moveEntry(2, 0);
    expect(state.value.active!.entries.map(x => x.exerciseId)).toEqual(['a', 'b', 'c']);
    expect(state.value.active!.entries[0]!.sets).toEqual([{ kg: 20, reps: 5 }]);
    moveEntry(1, 7);
    expect(state.value.active!.entries.map(x => x.exerciseId)).toEqual(['a', 'b', 'c']);
  });
});
