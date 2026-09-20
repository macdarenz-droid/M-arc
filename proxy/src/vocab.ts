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

/**
 * The real exercise library, `"id|Name|primary muscles"` per line, generated
 * from `src/data/exercises.json` (see the generating one-liner in the git
 * history of this file if it needs regenerating). Used only by the
 * split-builder prompt (promptSplitBuilder.ts), so the model composes a
 * split entirely out of real, existing exercises instead of inventing an id
 * that looks plausible but doesn't exist — the same closed-vocabulary idea
 * as MUSCLE_IDS/PATTERNS above, just for a much larger list.
 * `proxy/test/vocab.test.ts` checks this never drifts from the app's copy.
 */
export const EXERCISE_CATALOG: readonly string[] = [
  "lib_machine_chest_press|Machine Chest Press|chest",
  "lib_dumbbell_bench_press|Dumbbell Bench Press|chest",
  "lib_barbell_bench_press|Barbell Bench Press|chest",
  "lib_smith_machine_bench_press|Smith Machine Bench Press|chest",
  "lib_incline_machine_press|Incline Machine Press|upper_chest",
  "lib_incline_dumbbell_press|Incline Dumbbell Press|upper_chest",
  "lib_incline_barbell_bench_press|Incline Barbell Bench Press|upper_chest",
  "lib_smith_machine_incline_press|Smith Machine Incline Press|upper_chest",
  "lib_decline_bench_press|Decline Bench Press|chest",
  "lib_cable_chest_press|Cable Chest Press|chest",
  "lib_pec_fly|Pec Fly|chest",
  "lib_cable_fly|Cable Fly|chest",
  "lib_low_to_high_cable_fly|Low-to-High Cable Fly|upper_chest",
  "lib_high_to_low_cable_fly|High-to-Low Cable Fly|chest",
  "lib_dumbbell_fly|Dumbbell Fly|chest",
  "lib_push_up|Push-Up|chest",
  "lib_incline_push_up|Incline Push-Up|chest",
  "lib_weighted_dip|Weighted Dip|chest,triceps",
  "lib_shoulder_press|Shoulder Press|front_delts,side_delts",
  "lib_dumbbell_shoulder_press|Dumbbell Shoulder Press|front_delts,side_delts",
  "lib_barbell_overhead_press|Barbell Overhead Press|front_delts,side_delts",
  "lib_smith_machine_shoulder_press|Smith Machine Shoulder Press|front_delts,side_delts",
  "lib_arnold_press|Arnold Press|front_delts,side_delts",
  "lib_dumbbell_lateral_raise|Dumbbell Lateral Raise|side_delts",
  "lib_cable_lateral_raise|Cable Lateral Raise|side_delts",
  "lib_machine_lateral_raise|Machine Lateral Raise|side_delts",
  "lib_dumbbell_front_raise|Dumbbell Front Raise|front_delts",
  "lib_rear_delt_fly|Rear Delt Fly|rear_delts",
  "lib_cable_rear_delt_fly|Cable Rear Delt Fly|rear_delts",
  "lib_bent_over_dumbbell_rear_delt_fly|Bent-Over Dumbbell Rear Delt Fly|rear_delts",
  "lib_face_pull|Face Pull|rear_delts",
  "lib_cable_external_rotation|Cable External Rotation|rotator_cuff",
  "lib_upright_row|Upright Row|side_delts,upper_traps",
  "lib_triceps_pushdown|Triceps Pushdown|triceps",
  "lib_rope_triceps_pushdown|Rope Triceps Pushdown|triceps",
  "lib_straight_bar_triceps_pushdown|Straight-Bar Triceps Pushdown|triceps",
  "lib_single_arm_triceps_pushdown|Single-Arm Triceps Pushdown|triceps",
  "lib_overhead_cable_triceps_extension|Overhead Cable Triceps Extension|triceps",
  "lib_dumbbell_overhead_triceps_extension|Dumbbell Overhead Triceps Extension|triceps",
  "lib_skull_crusher|Skull Crusher|triceps",
  "lib_close_grip_bench_press|Close-Grip Bench Press|triceps",
  "lib_bench_dip|Bench Dip|triceps",
  "lib_lat_pulldown|Lat Pulldown|lats",
  "lib_close_grip_pulldown|Close-Grip Pulldown|lats",
  "lib_underhand_lat_pulldown|Underhand Lat Pulldown|lats",
  "lib_single_arm_lat_pulldown|Single-Arm Lat Pulldown|lats",
  "lib_pull_up|Pull-Up|lats",
  "lib_chin_up|Chin-Up|lats,biceps",
  "lib_assisted_pull_up|Assisted Pull-Up|lats",
  "lib_chest_supported_row|Chest-Supported Row|mid_back",
  "lib_seated_cable_row|Seated Cable Row|mid_back",
  "lib_barbell_row|Barbell Row|mid_back",
  "lib_pendlay_row|Pendlay Row|mid_back",
  "lib_one_arm_dumbbell_row|One-Arm Dumbbell Row|lats",
  "lib_t_bar_row|T-Bar Row|mid_back",
  "lib_landmine_row|Landmine Row|mid_back",
  "lib_straight_arm_pulldown|Straight-Arm Pulldown|lats",
  "lib_machine_pullover|Machine Pullover|lats",
  "lib_dumbbell_pullover|Dumbbell Pullover|lats,chest",
  "lib_dumbbell_shrug|Dumbbell Shrug|upper_traps",
  "lib_barbell_shrug|Barbell Shrug|upper_traps",
  "lib_smith_machine_shrug|Smith Machine Shrug|upper_traps",
  "lib_cable_shrug|Cable Shrug|upper_traps",
  "lib_back_extension|Back Extension|lower_back",
  "lib_dumbbell_biceps_curl|Dumbbell Biceps Curl|biceps",
  "lib_alternating_dumbbell_curl|Alternating Dumbbell Curl|biceps",
  "lib_barbell_curl|Barbell Curl|biceps",
  "lib_ez_bar_curl|EZ-Bar Curl|biceps",
  "lib_hammer_curl|Hammer Curl|brachialis,biceps",
  "lib_cross_body_hammer_curl|Cross-Body Hammer Curl|brachialis,biceps",
  "lib_cable_curl|Cable Curl|biceps",
  "lib_bayesian_cable_curl|Bayesian Cable Curl|biceps",
  "lib_preacher_curl|Preacher Curl|biceps",
  "lib_incline_dumbbell_curl|Incline Dumbbell Curl|biceps",
  "lib_concentration_curl|Concentration Curl|biceps",
  "lib_reverse_curl|Reverse Curl|forearms,brachialis",
  "lib_wrist_curl|Wrist Curl|forearms",
  "lib_leg_extension|Leg Extension|quads",
  "lib_seated_leg_curl|Seated Leg Curl|hamstrings",
  "lib_lying_leg_curl|Lying Leg Curl|hamstrings",
  "lib_standing_leg_curl|Standing Leg Curl|hamstrings",
  "lib_leg_press|Leg Press|quads,glutes",
  "lib_horizontal_leg_press|Horizontal Leg Press|quads,glutes",
  "lib_hack_squat|Hack Squat|quads",
  "lib_pendulum_squat|Pendulum Squat|quads",
  "lib_barbell_back_squat|Barbell Back Squat|quads",
  "lib_front_squat|Front Squat|quads",
  "lib_goblet_squat|Goblet Squat|quads",
  "lib_smith_machine_squat|Smith Machine Squat|quads",
  "lib_bulgarian_split_squat|Bulgarian Split Squat|quads,glutes",
  "lib_walking_lunge|Walking Lunge|quads,glutes",
  "lib_reverse_lunge|Reverse Lunge|quads,glutes",
  "lib_forward_lunge|Forward Lunge|quads,glutes",
  "lib_step_up|Step-Up|quads,glutes",
  "lib_romanian_deadlift|Romanian Deadlift|hamstrings",
  "lib_dumbbell_romanian_deadlift|Dumbbell Romanian Deadlift|hamstrings",
  "lib_single_leg_romanian_deadlift|Single-Leg Romanian Deadlift|hamstrings",
  "lib_conventional_deadlift|Conventional Deadlift|hamstrings,glutes,lower_back",
  "lib_sumo_deadlift|Sumo Deadlift|glutes,adductors",
  "lib_hip_thrust|Hip Thrust|glutes",
  "lib_glute_bridge|Glute Bridge|glutes",
  "lib_cable_kickback|Cable Kickback|glutes",
  "lib_hip_abduction|Hip Abduction|glutes,abductors",
  "lib_hip_adduction|Hip Adduction|adductors",
  "lib_seated_calf_raise|Seated Calf Raise|calves",
  "lib_standing_calf_raise|Standing Calf Raise|calves",
  "lib_leg_press_calf_raise|Leg Press Calf Raise|calves",
  "lib_crunch|Crunch|abs",
  "lib_cable_crunch|Cable Crunch|abs",
  "lib_machine_crunch|Machine Crunch|abs",
  "lib_resisted_hip_flexion|Resisted Hip Flexion|hip_flexors",
  "lib_hanging_leg_raise|Hanging Leg Raise|abs",
  "lib_hanging_knee_raise|Hanging Knee Raise|abs",
  "lib_reverse_crunch|Reverse Crunch|abs",
  "lib_plank|Plank|core",
  "lib_side_plank|Side Plank|obliques",
  "lib_ab_wheel_rollout|Ab Wheel Rollout|core,abs",
  "lib_russian_twist|Russian Twist|obliques",
  "lib_pallof_press|Pallof Press|core,obliques",
  "lib_dead_bug|Dead Bug|core,abs",
  "lib_sled_push|Sled Push|quads,glutes",
  "lib_sled_pull|Sled Pull|quads,glutes",
  "lib_farmer_s_carry|Farmer's Carry|forearms,upper_traps",
];

/** Just the ids from EXERCISE_CATALOG, for a zod enum — the split-builder schema rejects an exerciseId outside this list outright, on top of the app's own re-check when the reply comes back. */
export const EXERCISE_IDS: readonly string[] = EXERCISE_CATALOG.map(line => line.split('|', 1)[0]!);
