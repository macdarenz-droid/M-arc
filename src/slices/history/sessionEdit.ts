import type { Session } from '@/core/models';
import { update } from '@/core/store';

export type SessionEditResult = 'saved' | 'changed' | 'deleted';

/** Remove blank rows while preserving comparison metadata for value-only edits. */
export function cleanSessionEdit(draft: Session, note: string, noteChanged: boolean): Session {
  return {
    ...draft,
    note: note || undefined,
    noteFlags: noteChanged ? undefined : draft.noteFlags,
    exercises: draft.exercises.map(exercise => {
      const sets = exercise.sets.filter(set => (set.reps ?? 0) > 0 || (set.durationSec ?? 0) > 0 || (set.distanceM ?? 0) > 0);
      return { ...exercise, sets, actualSetIndices: sets.length === exercise.sets.length ? exercise.actualSetIndices : undefined };
    }).filter(exercise => exercise.sets.length),
  };
}

/** Save only while the exact session object used to open the editor is current. */
export function replaceSessionIfCurrent(source: Session, replacement: Session): SessionEditResult {
  let result: SessionEditResult = 'deleted';
  update(state => {
    const current = state.sessions.find(session => session.id === source.id);
    if (!current) return state;
    if (current !== source) { result = 'changed'; return state; }
    result = 'saved';
    return { ...state, sessions: state.sessions.map(session => session === source ? replacement : session) };
  });
  return result;
}

/** Delete only while the editor still represents the current saved session. */
export function removeSessionIfCurrent(source: Session): SessionEditResult {
  let result: SessionEditResult = 'deleted';
  update(state => {
    const current = state.sessions.find(session => session.id === source.id);
    if (!current) return state;
    if (current !== source) { result = 'changed'; return state; }
    result = 'saved';
    return { ...state, sessions: state.sessions.filter(session => session !== source) };
  });
  return result;
}
