/** Split (workout template) management. */
import type { Exercise, Split, Weekday } from '@/core/models';
import { newId, WEEKDAYS } from '@/core/models';
import { state, update } from '@/core/store';
import { SPLIT_TEMPLATES } from '@/data/templates';
import type { MuscleId } from '@/data/muscles';

export const SPLIT_COLORS = ['#4d9dff', '#7fc44b', '#ffc845', '#a061ff', '#ff7a59', '#2fd4c0', '#f25fa0'];
export const MAX_SPLITS = 7;

export function createSplit(name: string, exercises: Split['exercises'] = []): Split | null {
  if (state.value.splits.length >= MAX_SPLITS) return null;
  const used = new Set(state.value.splits.map(s => s.color));
  const color = SPLIT_COLORS.find(c => !used.has(c)) ?? SPLIT_COLORS[state.value.splits.length % SPLIT_COLORS.length]!;
  const split: Split = { id: newId('split'), name: name.trim().slice(0, 28) || 'Workout', color, exercises, focus: [], createdAt: new Date().toISOString() };
  update(s => ({ ...s, splits: [...s.splits, split] }));
  return split;
}

export function addTemplates(): void {
  for (const t of SPLIT_TEMPLATES) {
    if (state.value.splits.some(s => s.name.toLowerCase() === t.name.toLowerCase())) continue;
    createSplit(t.name, t.exercises.map(e => ({ ...e })));
  }
}

export function renameSplit(id: string, name: string): void {
  update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === id ? { ...sp, name: name.trim().slice(0, 28) || sp.name } : sp)) }));
}

export function deleteSplit(id: string): void {
  update(s => ({
    ...s,
    splits: s.splits.filter(sp => sp.id !== id),
    schedule: Object.fromEntries(Object.entries(s.schedule).map(([d, v]) => [d, v === id ? null : v])) as typeof s.schedule,
    active: s.active?.splitId === id ? null : s.active,
  }));
}

export function setFocus(id: string, focus: MuscleId[]): void {
  update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === id ? { ...sp, focus: focus.slice(0, 2) } : sp)) }));
}

export function addExerciseToSplit(id: string, ex: Exercise, sets = ex.defaultSets): boolean {
  const split = state.value.splits.find(s => s.id === id);
  if (!split || split.exercises.some(e => e.exerciseId === ex.id)) return false;
  update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === id ? { ...sp, exercises: [...sp.exercises, { exerciseId: ex.id, sets }] } : sp)) }));
  return true;
}

export function removeExerciseFromSplit(id: string, exerciseId: string): void {
  update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === id ? { ...sp, exercises: sp.exercises.filter(e => e.exerciseId !== exerciseId) } : sp)) }));
}

export function setSplitSets(id: string, exerciseId: string, sets: number): void {
  update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === id ? { ...sp, exercises: sp.exercises.map(e => (e.exerciseId === exerciseId ? { ...e, sets: Math.max(1, Math.min(10, sets)) } : e)) } : sp)) }));
}

export function moveExercise(id: string, from: number, to: number): void {
  update(s => ({ ...s, splits: s.splits.map(sp => {
    if (sp.id !== id) return sp;
    const list = [...sp.exercises];
    const [item] = list.splice(from, 1);
    if (!item) return sp;
    list.splice(Math.max(0, Math.min(list.length, to)), 0, item);
    return { ...sp, exercises: list };
  }) }));
}

export function saveCustomExercise(ex: Exercise): void {
  update(s => ({ ...s, customExercises: [...s.customExercises.filter(c => c.id !== ex.id), ex] }));
}

/**
 * Apply a split draft from the coach chat (see src/ai/ask.ts's SplitDraft):
 * create a new split, or replace an existing one's name/focus/exercises
 * wholesale. Every exerciseId in `draft.exercises` must already be a real,
 * validated id — this trusts its caller exactly as much as accepting a
 * coach proposal does, no more. Returns null if `splitId` no longer names a
 * real split (e.g. deleted mid-conversation) or the split cap is reached.
 */
export function applySplitDraft(splitId: string | null, draft: { name: string; focus: MuscleId[]; exercises: Split['exercises'] }): Split | null {
  if (!splitId) {
    const created = createSplit(draft.name, draft.exercises);
    if (created && draft.focus.length) setFocus(created.id, draft.focus);
    return created ? { ...created, focus: draft.focus.slice(0, 2) } : null;
  }
  if (!state.value.splits.some(sp => sp.id === splitId)) return null;
  update(s => ({ ...s, splits: s.splits.map(sp => (sp.id === splitId ? { ...sp, name: draft.name.trim().slice(0, 28) || sp.name, focus: draft.focus.slice(0, 2), exercises: draft.exercises } : sp)) }));
  return state.value.splits.find(sp => sp.id === splitId) ?? null;
}

/**
 * Apply a schedule draft from the coach chat (see src/ai/ask.ts's
 * WeekSchedule): replace the whole weekly schedule with exactly what's
 * given, one whole-record swap, never a per-day merge. `draft` was already
 * validated against the splits the payload named at request time; this
 * re-checks every non-rest day against the real, current splits before
 * writing, the same "trust nothing further" posture `applySplitDraft`
 * above uses — a split referenced in the draft may have been renamed or
 * deleted since the reply arrived. Returns false, applying nothing at all,
 * if any day now names a split that isn't real; true on success.
 */
export function applyScheduleDraft(draft: Record<Weekday, string | null>): boolean {
  const realIds = new Set(state.value.splits.map(sp => sp.id));
  if (WEEKDAYS.some(d => draft[d] !== null && !realIds.has(draft[d]!))) return false;
  update(s => ({ ...s, schedule: { ...draft } }));
  return true;
}
