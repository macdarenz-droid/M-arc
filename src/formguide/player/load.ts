// FG-4: the load the figure holds (docs/FORM-GUIDE-PRODUCTION.md §6 "Load readout"): the last logged set, read only.
// The live session's latest committed working set first, else the last working set of the last session with this
// exercise. Warm-ups never count (F2). Nothing is written.
import type { AppState, Exercise, LoadUnit } from '@/core/models';
import { exerciseHistory } from '@/brain/history';
import { isWorkingSet } from '@/brain/exposure';
import { formatLoad } from '@/core/units';
import { isCommitted } from '@/slices/workout/session';
import type { ExerciseGuide } from '../model';

type Src = Pick<AppState, 'sessions' | 'active'> & { customExercises: Exercise[] };
const loaded = (kg: number | undefined): kg is number => kg != null && Number.isFinite(kg) && kg > 0;

/** kg of the last logged working set of `exerciseId`, or null when none has a load. */
export function lastLoggedKg(s: Src, exerciseId: string): number | null {
  const live = (s.active?.entries ?? []).filter(e => e.exerciseId === exerciseId).flatMap(e => e.sets)
    .filter(x => isCommitted(x) && isWorkingSet(x) && loaded(x.kg));
  if (live.length) return live[live.length - 1]!.kg!;
  const hist = exerciseHistory(s.sessions, exerciseId, s.customExercises);
  for (let i = hist.length - 1; i >= 0; i--) {
    const sets = hist[i]!.sets.filter(x => loaded(x.kg));
    if (sets.length) return sets[sets.length - 1]!.kg!;
  }
  return null;
}

/** The load the figure shows, by the guide's `loadFrom` rule: `kg` for the equipment (FG-1's dumbbell is marked KG,
 * to 0.1), `text` in the user's unit for the readout; null draws no label. `bodyweight` waits for a bodyweight guide (D-FG4). */
export function loadOf(g: ExerciseGuide, s: Src, unit: LoadUnit): { kg: number; text: string } | null {
  const kg = g.equipment.loadFrom === 'lastSet' ? lastLoggedKg(s, g.id) : g.equipment.loadFrom === 'fixed' ? g.equipment.kg ?? null : null;
  return kg == null ? null : { kg: +kg.toFixed(1), text: formatLoad(kg, unit) };
}
