/** A3 verify UI-R02: two custom exercises with the same name but distinct IDs keep separate history. */
import { describe, it, expect } from 'vitest';
import { exerciseHistory } from '@/brain/history';
import { makeCustomExercise } from '@/core/exercises';
import { session, sets } from './helpers';

describe('UI-R02: known exercise IDs are authoritative', () => {
  it('a session logged for B does not appear in A history', () => {
    // The manual picker path: makeCustomExercise + saveCustomExercise, no duplicate-name check (ExercisePicker.tsx:18-22).
    const a = makeCustomExercise({ id: 'custom_a', name: 'Chest Press', equipment: 'Machine', primary: ['chest'] });
    const b = makeCustomExercise({ id: 'custom_b', name: 'Chest Press', equipment: 'Dumbbell', primary: ['chest'] });
    const custom = [a, b];
    const onlyB = [session('2026-09-20', [{ id: b.id, name: b.name, sets: sets(20, 10) }])];
    expect(exerciseHistory(onlyB, b.id, custom).length, 'premise: B sees its own session').toBe(1);
    expect(exerciseHistory(onlyB, a.id, custom).length, 'A inherited B session through name fallback').toBe(0);
  });

  it('a legacy record with an unresolved ID still resolves by name', () => {
    const a = makeCustomExercise({ id: 'custom_a', name: 'Chest Press', equipment: 'Machine', primary: ['chest'] });
    const legacy = [session('2026-09-20', [{ id: 'old_deleted_id', name: 'Chest Press', sets: sets(20, 10) }])];
    expect(exerciseHistory(legacy, a.id, [a]).length).toBe(1);
  });
});
