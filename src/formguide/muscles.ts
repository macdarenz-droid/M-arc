// GU-7a-3: the muscle info shown when a muscle is tapped (spec 2.10, R1-15).
// Roles come from the exercise row: target = primary, helps = secondary.
import type { Exercise } from '../core/models';
import { findExercise } from '../core/exercises';
import { MUSCLE_BY_ID, type MuscleId } from '../data/muscles';
import type { MuscleRole } from './rig/api';
import { MUSCLE_NOTES, type MuscleNotes } from './muscleNotes';

export type MuscleInfo = {
  id: MuscleId;
  common: string;
  anatomical: string;
  role: MuscleRole;
  /** The sentence after "<b>Common</b> (anatomical), role." */
  line: string;
  colorVar: 'var(--muscle-main)' | 'var(--muscle-help)';
};

/**
 * Target first, then helpers, in the row's order. `exercise` is a library id or an
 * Exercise object (custom exercises live in AppState.customExercises). Unknown id -> [].
 * Written lines come from `notes`, else MUSCLE_NOTES for a library exercise; custom
 * exercises and unwritten muscles get the muscle's generic `action`.
 */
export function muscleInfo(exercise: string | Exercise, notes?: MuscleNotes): MuscleInfo[] {
  const ex = typeof exercise === 'string' ? findExercise(exercise) : exercise;
  if (!ex || (typeof exercise === 'string' && ex.id !== exercise)) return [];
  const written: MuscleNotes = notes ?? (ex.custom ? {} : MUSCLE_NOTES[ex.id] ?? {});
  const seen = new Set<MuscleId>();
  const out: MuscleInfo[] = [];
  const add = (id: MuscleId, role: MuscleRole) => {
    const m = MUSCLE_BY_ID[id];
    if (!m || seen.has(id)) return;
    seen.add(id);
    out.push({
      id, common: m.common, anatomical: m.anatomical, role,
      line: written[id] ?? m.action,
      colorVar: role === 'target' ? 'var(--muscle-main)' : 'var(--muscle-help)',
    });
  };
  ex.primary.forEach(id => add(id, 'target'));
  ex.secondary.forEach(id => add(id, 'helps'));
  return out;
}

/** The bubble text without markup: "Chest (pectoralis major), target. Pushes ..." */
export function muscleText(m: MuscleInfo): string {
  return `${m.common} (${m.anatomical}), ${m.role}. ${m.line}`;
}
