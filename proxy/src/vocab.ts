/**
 * The closed vocabularies the model must pick from, so a reply is either a
 * real category the app understands or rejected by the schema — never an
 * invented muscle or movement pattern. Mirrors the app's source of truth:
 * `src/data/muscles.ts` (MUSCLE_IDS) and the `pattern` values used across
 * `src/data/exercises.json`. `proxy/test/vocab.test.ts` checks these two
 * copies never drift apart.
 */
export const MUSCLE_IDS = [
  'chest', 'upper_chest', 'front_delts', 'side_delts', 'rear_delts', 'rotator_cuff',
  'biceps', 'triceps', 'brachialis', 'forearms',
  'lats', 'mid_back', 'upper_traps', 'lower_back',
  'abs', 'obliques', 'core', 'hip_flexors',
  'quads', 'hamstrings', 'glutes', 'adductors', 'abductors', 'calves',
] as const;

export const PATTERNS = [
  'anti_extension', 'anti_lateral_flexion', 'anti_rotation', 'carry', 'chest_adduction', 'conditioning',
  'elbow_extension', 'elbow_flexion', 'hip_abduction', 'hip_adduction', 'hip_extension', 'hip_flexion',
  'hip_hinge', 'horizontal_abduction', 'horizontal_pull', 'horizontal_push', 'incline_push', 'knee_extension',
  'knee_flexion', 'lunge', 'plantar_flexion', 'rotation', 'scapular_elevation', 'shoulder_abduction',
  'shoulder_extension', 'shoulder_external_rotation', 'shoulder_flexion', 'single_leg_squat', 'spinal_flexion',
  'squat', 'vertical_pull', 'vertical_push', 'wrist_flexion',
] as const;

export const MODES = ['weighted', 'bodyweight', 'assisted', 'duration', 'conditioning'] as const;

/** What a session or exercise note may be tagged with. Never a diagnosis, never a severity, never a cause. */
export const NOTE_FLAG_KINDS = ['pain_or_discomfort', 'equipment_issue', 'fatigue', 'schedule', 'form_check', 'positive'] as const;
