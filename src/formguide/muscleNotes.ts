// GU-7a-3: the written muscle lines for the three demo exercises (spec 2.10, own words).
// Keyed by library exercise id, then muscle id. Exercises without an entry use each muscle's generic `action`.
import type { MuscleId } from '../data/muscles';

export type MuscleNotes = Partial<Record<MuscleId, string>>;

export const MUSCLE_NOTES: Record<string, MuscleNotes> = {
  lib_machine_chest_press: {
    chest: 'Pushes the handles away; hardest as the arms straighten.',
    front_delts: 'Lifts the upper arms forward with the chest.',
    triceps: 'Straightens the elbows at the end of the press.',
  },
  lib_dumbbell_lateral_raise: {
    side_delts: 'Lifts the arms out to the sides; hardest near shoulder height.',
    upper_traps: 'Steadies the shoulder blades. Keep them down: a shrug means the traps take over.',
  },
  lib_lat_pulldown: {
    lats: 'Pulls the elbows down and back to bring the bar to your chest; hardest at the bottom.',
    biceps: 'Bends the elbows as the bar comes down.',
    mid_back: 'Squeezes the shoulder blades together at the bottom.',
  },
};
