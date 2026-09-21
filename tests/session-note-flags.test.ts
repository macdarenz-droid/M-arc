import { beforeEach, describe, expect, it } from 'vitest';
import { freshState, type NoteFlag, type Session } from '@/core/models';
import { initStore, replaceState, state, update } from '@/core/store';
import { applySessionNoteFlags, setSessionNote } from '@/slices/workout/session';

const PAIN_NOTE = 'Shoulder felt sore';
const NEW_NOTE = 'Equipment was busy';
const PAIN_FLAGS: NoteFlag[] = [{ kind: 'pain_or_discomfort', muscle: 'front_delts' }];
const EQUIPMENT_FLAGS: NoteFlag[] = [{ kind: 'equipment_issue', muscle: null }];
let writes = 0;

describe('asynchronous session note flags', () => {
  beforeEach(() => {
    const saved = new Map<string, string>();
    initStore({ getItem: key => saved.get(key) ?? null, setItem: (key, value) => { writes++; saved.set(key, value); }, removeItem: key => { saved.delete(key); } });
    const session: Session = {
      id: 'saved', splitId: 'push', splitName: 'Push', day: '2026-09-21', startedAt: '2026-09-21T10:00:00.000Z', endedAt: '2026-09-21T11:00:00.000Z', durationSec: 3600,
      exercises: [{ exerciseId: 'lib_barbell_bench_press', name: 'Bench Press', sets: [{ kg: 60, reps: 8 }] }], note: PAIN_NOTE,
    };
    replaceState({ ...freshState(), sessions: [session] });
    writes = 0;
  });

  it('rejects an older response after the note changes and accepts the current response', () => {
    setSessionNote('saved', NEW_NOTE);
    const before = state.value;
    const beforeWrites = writes;
    expect(applySessionNoteFlags('saved', PAIN_NOTE, PAIN_FLAGS)).toBe(false);
    expect(state.value).toBe(before);
    expect(writes).toBe(beforeWrites);
    expect(state.value.sessions[0]!.noteFlags).toBeUndefined();
    expect(applySessionNoteFlags('saved', NEW_NOTE, EQUIPMENT_FLAGS)).toBe(true);
    expect(state.value.sessions[0]!).toMatchObject({ note: NEW_NOTE, noteFlags: EQUIPMENT_FLAGS });
    expect(applySessionNoteFlags('saved', PAIN_NOTE, PAIN_FLAGS)).toBe(false);
    expect(state.value.sessions[0]!.noteFlags).toEqual(EQUIPMENT_FLAGS);
  });

  it('preserves unrelated saved-set edits made while the note response is pending', () => {
    update(s => ({ ...s, sessions: s.sessions.map(session => ({ ...session, exercises: session.exercises.map(exercise => ({ ...exercise, sets: [{ kg: 62.5, reps: 9, effort: 'ideal' as const }] })) })) }));
    expect(applySessionNoteFlags('saved', PAIN_NOTE, PAIN_FLAGS)).toBe(true);
    expect(state.value.sessions[0]!.exercises[0]!.sets).toEqual([{ kg: 62.5, reps: 9, effort: 'ideal' }]);
    expect(state.value.sessions[0]!.noteFlags).toEqual(PAIN_FLAGS);
  });

  it('does not write for cleared notes, deleted sessions, or empty responses', () => {
    expect(applySessionNoteFlags('saved', PAIN_NOTE, [])).toBe(false);
    expect(writes).toBe(0);
    setSessionNote('saved', '');
    const afterClear = writes;
    expect(applySessionNoteFlags('saved', PAIN_NOTE, PAIN_FLAGS)).toBe(false);
    expect(writes).toBe(afterClear);
    replaceState({ ...state.value, sessions: [] });
    const afterDelete = writes;
    expect(applySessionNoteFlags('saved', PAIN_NOTE, PAIN_FLAGS)).toBe(false);
    expect(writes).toBe(afterDelete);
  });
});
