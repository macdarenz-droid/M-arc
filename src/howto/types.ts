// How-to plate types (HT-1). Every string below is an exact slice of the approved gallery
// (tests/howto/golden/technical-plates.html); the app inserts it as is and never re-serializes it.
import type {
  ContactArchetypeId, HandlingSpec, HandlingMistake, HowToContent, NoHandling, PostureCheckpoint, RedFlagBlock,
  Risk, RiskJoint, SetupStep, SourceId, ZoomSpec,
} from './content-types';

/** The "Look closer" chip row needs each zoom's descriptor in S0, before any lazy crop/hand chunk loads (HT-6 on
 *  PR #116; supervisor ruling, same PR): the rendered crop/hand strings stay HT-7's/HT-6's own lazy files. */
export type ZoomDescriptor = Pick<ZoomSpec, 'key' | 'chip' | 'chipCaption' | 'heading' | 'kind' | 'feelRow'>;

/** The 8 library exercises with an approved Technical Plate (golden A, bc0f378). */
export type LibId =
  | 'lib_machine_chest_press'
  | 'lib_dumbbell_bench_press'
  | 'lib_barbell_bench_press'
  | 'lib_smith_machine_bench_press'
  | 'lib_incline_machine_press'
  | 'lib_incline_dumbbell_press'
  | 'lib_incline_barbell_bench_press'
  | 'lib_smith_machine_incline_press'
  | 'lib_decline_bench_press'
  | 'lib_cable_chest_press'
  | 'lib_pec_fly'
  | 'lib_cable_fly'
  | 'lib_low_to_high_cable_fly'
  | 'lib_high_to_low_cable_fly'
  | 'lib_dumbbell_fly'
  | 'lib_push_up'
  | 'lib_incline_push_up'
  | 'lib_weighted_dip'
  | 'lib_shoulder_press'
  | 'lib_dumbbell_shoulder_press'
  | 'lib_barbell_overhead_press'
  | 'lib_smith_machine_shoulder_press'
  | 'lib_arnold_press'
  | 'lib_dumbbell_lateral_raise'
  | 'lib_cable_lateral_raise'
  | 'lib_machine_lateral_raise'
  | 'lib_dumbbell_front_raise'
  | 'lib_rear_delt_fly'
  | 'lib_cable_rear_delt_fly'
  | 'lib_bent_over_dumbbell_rear_delt_fly'
  | 'lib_face_pull'
  | 'lib_cable_external_rotation'
  | 'lib_upright_row'
  | 'lib_triceps_pushdown'
  | 'lib_rope_triceps_pushdown'
  | 'lib_straight_bar_triceps_pushdown'
  | 'lib_single_arm_triceps_pushdown'
  | 'lib_overhead_cable_triceps_extension'
  | 'lib_dumbbell_overhead_triceps_extension'
  | 'lib_skull_crusher'
  | 'lib_close_grip_bench_press'
  | 'lib_bench_dip'
  | 'lib_lat_pulldown'
  | 'lib_close_grip_pulldown'
  | 'lib_underhand_lat_pulldown'
  | 'lib_single_arm_lat_pulldown'
  | 'lib_pull_up'
  | 'lib_chin_up'
  | 'lib_assisted_pull_up'
  | 'lib_chest_supported_row'
  | 'lib_seated_cable_row'
  | 'lib_barbell_row'
  | 'lib_pendlay_row'
  | 'lib_one_arm_dumbbell_row'
  | 'lib_t_bar_row'
  | 'lib_landmine_row'
  | 'lib_straight_arm_pulldown'
  | 'lib_machine_pullover'
  | 'lib_dumbbell_pullover'
  | 'lib_dumbbell_shrug'
  | 'lib_barbell_shrug'
  | 'lib_smith_machine_shrug'
  | 'lib_cable_shrug'
  | 'lib_back_extension'
  | 'lib_dumbbell_biceps_curl'
  | 'lib_alternating_dumbbell_curl'
  | 'lib_barbell_curl'
  | 'lib_ez_bar_curl'
  | 'lib_hammer_curl'
  | 'lib_cross_body_hammer_curl'
  | 'lib_cable_curl'
  | 'lib_bayesian_cable_curl'
  | 'lib_preacher_curl'
  | 'lib_incline_dumbbell_curl'
  | 'lib_concentration_curl'
  | 'lib_reverse_curl'
  | 'lib_wrist_curl'
  | 'lib_leg_extension'
  | 'lib_seated_leg_curl'
  | 'lib_lying_leg_curl'
  | 'lib_standing_leg_curl'
  | 'lib_leg_press'
  | 'lib_horizontal_leg_press'
  | 'lib_hack_squat'
  | 'lib_pendulum_squat'
  | 'lib_barbell_back_squat'
  | 'lib_front_squat'
  | 'lib_goblet_squat'
  | 'lib_smith_machine_squat'
  | 'lib_bulgarian_split_squat'
  | 'lib_walking_lunge'
  | 'lib_reverse_lunge'
  | 'lib_forward_lunge'
  | 'lib_step_up'
  | 'lib_romanian_deadlift'
  | 'lib_dumbbell_romanian_deadlift'
  | 'lib_single_leg_romanian_deadlift'
  | 'lib_conventional_deadlift'
  | 'lib_sumo_deadlift'
  | 'lib_hip_thrust'
  | 'lib_glute_bridge'
  | 'lib_cable_kickback'
  | 'lib_hip_abduction'
  | 'lib_hip_adduction'
  | 'lib_seated_calf_raise'
  | 'lib_standing_calf_raise'
  | 'lib_leg_press_calf_raise'
  | 'lib_crunch'
  | 'lib_cable_crunch'
  | 'lib_machine_crunch'
  | 'lib_resisted_hip_flexion'
  | 'lib_hanging_leg_raise'
  | 'lib_hanging_knee_raise'
  | 'lib_reverse_crunch'
  | 'lib_plank'
  | 'lib_side_plank'
  | 'lib_ab_wheel_rollout'
  | 'lib_russian_twist'
  | 'lib_pallof_press'
  | 'lib_dead_bug'
  | 'lib_sled_push'
  | 'lib_sled_pull'
  | 'lib_farmer_s_carry'
  | 'lib_burpee'
  | 'lib_mountain_climbers'
  | 'lib_jumping_jacks'
  | 'lib_high_knees'
  | 'lib_jump_rope'
  | 'lib_kettlebell_swing'
  | 'lib_box_jump'
  | 'lib_battle_ropes'
  | 'lib_medicine_ball_slam'
  | 'lib_wall_ball'
  | 'lib_bear_crawl'
  | 'lib_renegade_row'
  | 'lib_bodyweight_squat'
  | 'lib_jump_squat'
  | 'lib_bodyweight_lunge'
  | 'lib_bodyweight_split_squat'
  | 'lib_pistol_squat'
  | 'lib_wall_sit'
  | 'lib_bodyweight_calf_raise'
  | 'lib_inverted_row'
  | 'lib_pike_push_up'
  | 'lib_diamond_push_up'
  | 'lib_v_up'
  | 'lib_bicycle_crunch'
  | 'lib_flutter_kicks'
  | 'lib_hollow_body_hold'
  | 'lib_bird_dog'
  | 'lib_superman'
  | 'lib_resistance_band_row'
  | 'lib_resistance_band_pull_apart';

/** One callout or tell: its key and the cue text shown in the cue line (decoded, not HTML). */
export interface PlateCue {
  readonly key: string;
  readonly cue: string;
}

/** One drawn state of a plate: the SVG, its tagged callout overlay, and the callout that starts selected. */
export interface PlateFigure {
  /** The `<svg>` element; for the normal figure, with the hidden `data-guide` paths spliced in. */
  readonly svg: string;
  /** The callout buttons, tagged with id, data-key, data-cue and aria-pressed as in the gallery. */
  readonly overlay: string;
  readonly firstKey: string;
  readonly cues: readonly PlateCue[];
}

/** Everything the plate block of one exercise needs, from plate top to tempo bottom. */
export interface BuiltPlate {
  readonly view: 'front' | 'side';
  readonly normal: PlateFigure;
  readonly mistake: PlateFigure;
  /** The `<div class="tells" hidden>…</div>` block. */
  readonly tells: string;
  /** The `<div class="tempo" role="img" …>…</div>` strip. */
  readonly tempo: string;
  /** The normal figcaption text (decoded). */
  readonly alt: string;
  /** The mistake figcaption text (decoded). */
  readonly mistakeAlt: string;
}

/** The fragments hashed per exercise in GOLDEN.json (sha256 hex of the exact UTF-8 string). */
export type GoldenFragment =
  | 'normalSvg'
  | 'normalOverlay'
  | 'mistakeSvg'
  | 'mistakeOverlay'
  | 'tells'
  | 'tempo'
  | 'cues'
  | 'alt'
  | 'mistakeAlt';

interface GoldenEntryBase {
  /** Commit on claude/howto-options that holds the approved sources. */
  readonly ref: string;
  readonly approvedBy: 'owner';
  /** YYYY-MM-DD. */
  readonly date: string;
  readonly why: string;
  /** Index in GOLDEN.json `entries` of the entry this one replaces, or null for a first approval. */
  readonly supersedes: number | null;
  /** Decision id (COACHING-DECISIONS.md); required when `supersedes` is set. */
  readonly decision?: string;
  /** sha256 hex of JSON.stringify(entries before this one): the hash chain. */
  readonly prev: string;
}

/** The whole gallery page. */
export interface GoldenPageEntry extends GoldenEntryBase {
  readonly kind: 'page';
  readonly pageSha256: string;
  readonly bytes: number;
}

/** One exercise's approved plate. */
export interface GoldenPlateEntry extends GoldenEntryBase {
  readonly kind: 'plate';
  readonly id: LibId;
  /** The id without `lib_`, `_` as `-` (the chunk slug). */
  readonly slug: string;
  /** The spec the gallery built it from: 'ref-src' or 'exercises/<file>.mjs'. */
  readonly src: string;
  /** The id prefix inside its SVG (e.g. `lr` for `lr-n-…`). */
  readonly prefix: string;
  /** The id used by its gallery chrome (e.g. `lateral-raise` for `card-lateral-raise`). */
  readonly chromeId: string;
  readonly fragments: Readonly<Record<GoldenFragment, string>>;
}

export type GoldenEntry = GoldenPageEntry | GoldenPlateEntry;

export interface GoldenFile {
  readonly schema: 1;
  readonly entries: readonly GoldenEntry[];
}

/**
 * One generated How-to module (HT-2): `src/howto/generated/ht-<slug>.ts` default-exports this, ending in
 * `satisfies BuiltHowTo`, so tsc checks the generator's output. The layer fields stay `never` (absent) until the
 * card that builds each layer defines its type (critic fix 6). HT-5 (content.mjs, sequential writer after
 * plates.mjs) is the card that builds handling/contacts/setup/posture/mistakes/risks/sources/copy, so those
 * fields are broadened here to `HowToContent`'s real shapes; `zooms` and `feel` stay `never` for HT-7/HT-8.
 */
export interface BuiltHowTo {
  readonly schema: 1;
  readonly id: LibId;
  readonly name: string;
  readonly hashes: {
    /** The file's own inputsSha256, equal to its GENERATED header. */
    readonly inputsSha256: string;
    /** sha256 of JSON.stringify(the latest GOLDEN.json plate entry it was generated from). */
    readonly golden: string;
  };
  readonly plate: BuiltPlate;
  readonly zooms?: readonly ZoomDescriptor[];
  readonly feel?: never;
  readonly rev?: number;
  readonly extends?: LibId;
  readonly handling?: HandlingSpec | NoHandling;
  readonly contacts?: readonly ContactArchetypeId[];
  readonly setup?: readonly SetupStep[];
  readonly posture?: readonly PostureCheckpoint[];
  readonly chips?: readonly string[];
  readonly copy?: HowToContent['copy'];
  readonly mistakes?: readonly HandlingMistake[];
  readonly risks?: readonly Risk[];
  readonly riskFlags?: readonly RiskJoint[];
  readonly redFlag?: RedFlagBlock;
  readonly sources?: readonly SourceId[];
  readonly research?: HowToContent['research'];
}
