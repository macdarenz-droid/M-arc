/**
 * The 24-muscle vocabulary shared by the exercise library, the recovery
 * model, the coach and the muscle map. Keys never change; labels are the
 * plain words shown to the user.
 */
export type MuscleId =
  | 'chest' | 'upper_chest' | 'front_delts' | 'side_delts' | 'rear_delts' | 'rotator_cuff'
  | 'biceps' | 'triceps' | 'brachialis' | 'forearms'
  | 'lats' | 'mid_back' | 'upper_traps' | 'lower_back'
  | 'abs' | 'obliques' | 'core' | 'hip_flexors'
  | 'quads' | 'hamstrings' | 'glutes' | 'adductors' | 'abductors' | 'calves';

/** Coarse groups used for balance checks and the map legend. */
export type MuscleGroup = 'chest' | 'shoulders' | 'arms' | 'back' | 'core' | 'legs';
/** Push / pull / lower buckets used by the training-balance rule. */
export type BalanceBucket = 'push' | 'pull' | 'lower' | 'neutral';

export interface Muscle {
  id: MuscleId;
  label: string;
  group: MuscleGroup;
  bucket: BalanceBucket;
  /** Which side of the body map draws it. */
  view: 'front' | 'back';
  /** Recovery-model prior: relative time-to-recover vs quads (1.0). Small; calibration does the rest. */
  recoveryFactor: number;
}

export const MUSCLES: Muscle[] = [
  { id: 'chest', label: 'Chest', group: 'chest', bucket: 'push', view: 'front', recoveryFactor: 1.1 },
  { id: 'upper_chest', label: 'Upper chest', group: 'chest', bucket: 'push', view: 'front', recoveryFactor: 1.1 },
  { id: 'front_delts', label: 'Front shoulders', group: 'shoulders', bucket: 'push', view: 'front', recoveryFactor: 1.0 },
  { id: 'side_delts', label: 'Side shoulders', group: 'shoulders', bucket: 'push', view: 'front', recoveryFactor: 1.0 },
  { id: 'rear_delts', label: 'Rear shoulders', group: 'shoulders', bucket: 'pull', view: 'back', recoveryFactor: 1.0 },
  { id: 'rotator_cuff', label: 'Rotator cuff', group: 'shoulders', bucket: 'neutral', view: 'back', recoveryFactor: 1.0 },
  { id: 'biceps', label: 'Biceps', group: 'arms', bucket: 'pull', view: 'front', recoveryFactor: 1.1 },
  { id: 'triceps', label: 'Triceps', group: 'arms', bucket: 'push', view: 'back', recoveryFactor: 1.1 },
  { id: 'brachialis', label: 'Brachialis', group: 'arms', bucket: 'pull', view: 'front', recoveryFactor: 1.1 },
  { id: 'forearms', label: 'Forearms', group: 'arms', bucket: 'pull', view: 'front', recoveryFactor: 0.8 },
  { id: 'lats', label: 'Lats', group: 'back', bucket: 'pull', view: 'back', recoveryFactor: 1.1 },
  { id: 'mid_back', label: 'Mid back', group: 'back', bucket: 'pull', view: 'back', recoveryFactor: 1.0 },
  { id: 'upper_traps', label: 'Upper traps', group: 'back', bucket: 'pull', view: 'back', recoveryFactor: 1.0 },
  { id: 'lower_back', label: 'Lower back', group: 'back', bucket: 'neutral', view: 'back', recoveryFactor: 1.1 },
  { id: 'abs', label: 'Abs', group: 'core', bucket: 'neutral', view: 'front', recoveryFactor: 0.8 },
  { id: 'obliques', label: 'Obliques', group: 'core', bucket: 'neutral', view: 'front', recoveryFactor: 0.8 },
  { id: 'core', label: 'Deep core', group: 'core', bucket: 'neutral', view: 'front', recoveryFactor: 0.8 },
  { id: 'hip_flexors', label: 'Hip flexors', group: 'core', bucket: 'neutral', view: 'front', recoveryFactor: 0.8 },
  { id: 'quads', label: 'Quads', group: 'legs', bucket: 'lower', view: 'front', recoveryFactor: 1.0 },
  { id: 'hamstrings', label: 'Hamstrings', group: 'legs', bucket: 'lower', view: 'back', recoveryFactor: 1.2 },
  { id: 'glutes', label: 'Glutes', group: 'legs', bucket: 'lower', view: 'back', recoveryFactor: 1.0 },
  { id: 'adductors', label: 'Inner thighs', group: 'legs', bucket: 'lower', view: 'front', recoveryFactor: 1.2 },
  { id: 'abductors', label: 'Outer hips', group: 'legs', bucket: 'lower', view: 'front', recoveryFactor: 1.0 },
  { id: 'calves', label: 'Calves', group: 'legs', bucket: 'lower', view: 'back', recoveryFactor: 0.8 },
];

export const MUSCLE_BY_ID: Record<MuscleId, Muscle> = Object.fromEntries(
  MUSCLES.map(m => [m.id, m]),
) as Record<MuscleId, Muscle>;

export const MUSCLE_IDS = MUSCLES.map(m => m.id);

export function isMuscleId(value: unknown): value is MuscleId {
  return typeof value === 'string' && value in MUSCLE_BY_ID;
}

export function muscleLabel(id: string): string {
  return isMuscleId(id) ? MUSCLE_BY_ID[id].label : id.replace(/_/g, ' ');
}

/** Free-text muscle labels (from custom exercises or old data) to a key. */
export function classifyMuscleText(raw: string): MuscleId | null {
  const q = raw.toLowerCase().trim();
  // ST-12: an exact label ("Mid back", "Rear delts") wins before any pattern.
  const exact = MUSCLES.find(m => m.label.toLowerCase() === q || m.id === q.replace(/\s+/g, '_'));
  if (exact) return exact.id;
  const rules: Array<[RegExp, MuscleId]> = [
    [/upper chest|incline/, 'upper_chest'],
    [/chest|pec/, 'chest'],
    [/serratus/, 'core'],
    [/rear delt|posterior delt|rear shoulder/, 'rear_delts'],
    [/front delt|anterior delt|front shoulder/, 'front_delts'],
    [/side delt|lateral delt|shoulder/, 'side_delts'],
    [/rotator/, 'rotator_cuff'],
    [/tricep/, 'triceps'],
    [/brachialis/, 'brachialis'],
    [/bicep/, 'biceps'],
    [/forearm|grip|wrist|brachioradialis/, 'forearms'],
    [/\blat\b|lats|latissimus/, 'lats'],
    // Lower back before mid back, or "lower back" would match the generic \bback\b.
    [/lower back|erector|spinal/, 'lower_back'],
    [/mid back|rhomboid|upper back|\bback\b/, 'mid_back'],
    [/trap/, 'upper_traps'],
    [/oblique/, 'obliques'],
    [/abs|abdominal/, 'abs'],
    [/core/, 'core'],
    [/hip flexor/, 'hip_flexors'],
    [/quad/, 'quads'],
    [/hamstring/, 'hamstrings'],
    [/glute/, 'glutes'],
    [/adductor|inner thigh/, 'adductors'],
    [/abductor|outer hip/, 'abductors'],
    [/calf|calves/, 'calves'],
  ];
  for (const [rx, id] of rules) if (rx.test(q)) return id;
  return null;
}
