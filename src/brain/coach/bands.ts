/**
 * Thresholds the detectors and planners use. Each one is a band or a gate,
 * not a law; docs/RESEARCH.md says which card each rests on. Change them
 * here, and the tests that pin them.
 */
import type { Effort } from '@/core/models';
import type { MuscleId } from '@/data/muscles';

/** Weekly effective sets per muscle. Above this we say so (volume_dose_response). Deliberately wide. */
export const WEEKLY_SETS_HIGH = 25;
/** Below this for a muscle the user does train, the volume is thin. Informational only. */
export const WEEKLY_SETS_LOW = 4;
/** A major muscle averaging under this many effective sets a week for four weeks counts as untouched. Half-sets from secondary work count, so one compound's spill-over does not clear it. */
export const UNCOVERED_MAX_SETS = 2;

/** Volume trend: last 3 complete weeks against the median of the 8 before them. */
export const VOLUME_RECENT_WEEKS = 3;
export const VOLUME_BASELINE_WEEKS = 8;
export const VOLUME_DROP_RATIO = 0.75;
export const VOLUME_SPIKE_RATIO = 1.5;
/** Baseline median below this is too small to call a drop. */
export const VOLUME_MIN_BASELINE_SETS = 6;
/** Recent mean below this is too small to call a spike. */
export const VOLUME_MIN_SPIKE_SETS = 10;

/** Minimum history before trend and habit detectors speak. */
export const MIN_WEEKS_OF_DATA = 6;

/** A muscle below this percent recovered is worth mentioning (recovery_time_course). */
export const RECOVERY_FLAG_PCT = 75;
/** Below this, today's plan swaps exercises that target the muscle. */
export const RECOVERY_SWAP_PCT = 60;
/** Volume can widen a recovery window by at most this factor. It never shrinks it. */
export const RECOVERY_VOLUME_FACTOR_MAX = 1.5;

/** Habit learning (habit_formation_and_cues). */
export const HABIT_WINDOW_WEEKS = 12;
export const HABIT_HALF_LIFE_WEEKS = 6;
export const HABIT_MIN_PROBABILITY = 0.6;
export const HABIT_MIN_COUNT = 4;
/** A habitual day with no session for this many weeks is retired. */
export const HABIT_COLD_WEEKS = 3;
/** Nudge this many minutes before the learned start time. */
export const HABIT_NUDGE_LEAD_MINUTES = 60;

/** Short sleep, the cut most sleep-loss studies use (sleep_and_performance). */
export const SLEEP_SHORT_MINUTES = 360;

/**
 * Morning check-in (sleep, soreness, stress; subjective_readiness_monitoring),
 * each 1 (worst) to 5 (best). Average at or below this is a low-readiness day.
 */
export const READINESS_LOW_AVG = 2.5;
/** A low-readiness day widens today's recovery windows like extra volume does, up to this factor. Combined with the volume factor by taking whichever is larger, never multiplied, and still capped by RECOVERY_VOLUME_FACTOR_MAX. */
export const READINESS_RECOVERY_FACTOR_MAX = 1.3;
/** Ten check-ins in four weeks before the coach claims to know this person's normal. */
export const READINESS_BASELINE_WINDOW_DAYS = 28;
export const READINESS_BASELINE_MIN_ENTRIES = 10;
/** A 1–5 scale often has zero spread; this stops a small dip looking like a crisis. */
export const READINESS_MAD_FLOOR = 0.6;
/** Baseline-relative verdict bands, measured in median absolute deviations. */
export const READINESS_Z_RED = -1.5;
export const READINESS_Z_AMBER = -0.75;
export const READINESS_Z_GREEN = 1;
/** One dimension two points below its own median is worth naming even when the average holds. */
export const READINESS_DIM_DROP = 2;
/** A strong absolute morning when no low dimension contradicts it. */
export const READINESS_GOOD_AVG = 4.5;
/** The absolute floor that still applies when someone's own normal is already low. */
export const READINESS_FLOOR_HARD_AVG = 1.5;
/** Consecutive equal check-ins needed before a below-normal dimension counts as drift. */
export const READINESS_DRIFT_MIN_RUN = 3;
/** Halfway to the cap: an amber morning is a real signal, but not the worst one. */
export const READINESS_RECOVERY_FACTOR_AMBER = Math.round((1 + (READINESS_RECOVERY_FACTOR_MAX - 1) / 2) * 100) / 100;
/** One low morning says little on its own (subjective_readiness_monitoring); the coach only speaks up once at least this many of the trailing check-ins, today included, were low. */
export const READINESS_PATTERN_MIN_LOW = 2;
export const READINESS_PATTERN_WINDOW_DAYS = 7;

/**
 * A session note tagged "fatigue" widens that session's own recovery
 * window, the same way a low morning check-in does (subjective_readiness_monitoring
 * applies just as well to a post-session reading as a pre-session one — one
 * reading alone is still a weak signal, so this stays the same size as
 * READINESS_RECOVERY_FACTOR_MAX rather than stacking on top of it). Combined
 * with the volume and readiness factors by taking whichever is largest,
 * never multiplied, and still capped by RECOVERY_VOLUME_FACTOR_MAX.
 */
export const FATIGUE_RECOVERY_FACTOR = READINESS_RECOVERY_FACTOR_MAX;

export const LONG_GAP_DAYS = 7;
export const REENTRY_GAP_DAYS = 28;
export const FIRST_SESSIONS_COUNT = 4;

/** The app's three effort levels as reps-in-reserve bands (effort_rir_scale). */
export const RIR_BAND: Record<Effort, [number, number]> = { easy: [4, 6], ideal: [1, 3], max: [0, 1] };

/** Rest default the app suggests for strength goals, in seconds (rest_intervals). */
export const REST_STRENGTH_SEC = 150;
export const REST_SHORT_SEC = 120;

/**
 * Live rest grading (rest_intervals). The person's own restDefaultSec is the
 * base and is never overridden — these only bend it, and only once they have
 * actually rated the set. Harder sets and compound lifts get longer rests;
 * an easy set gets a shorter one.
 */
export const REST_EFFORT_MULT: Record<Effort, number> = { easy: 0.8, ideal: 1, max: 1.25 };
/** A compound earns a longer rest than an isolation at the same effort. */
export const REST_COMPOUND_MULT = 1.2;
/** Graded rests round to this, keeping the multiplier more accurate than the 15-second UI step. */
export const REST_ROUND_SEC = 5;
/** Hard bounds on any rest timer, in seconds. */
export const REST_FLOOR_SEC = 15;
export const REST_CEIL_SEC = 600;
/** Remaining-time floor used by the later timer integration. */
export const REST_MIN_REMAINING_SEC = 5;

/** Maximum number of mid-session substitutes offered at once. */
export const MAX_SUBSTITUTES = 3;
/** Minimum adjusted muscle recovery required for a substitute. */
export const SUBSTITUTE_MIN_READY = 75;

/** Live autoregulation only treats loads within this tolerance as the captured target. */
export const LIVE_TARGET_LOAD_EPS_KG = 0.01;
/** A max-effort set must miss by at least this many reps before offering one load step down. */
export const LIVE_MISS_REPS = 2;
/** An easy set must clear its target by this many reps to count toward an upward offer. */
export const LIVE_SURPLUS_REPS = 2;
/** Two easy surplus sets are required before adding one rep to remaining rows. */
export const LIVE_UP_MIN_SETS = 2;

/** Warm-up ramps stay hidden for lighter working targets where the three-step card adds little value. */
export const WARMUP_MIN_WORKING_KG = 20;
/** Fractions and reps for the read-only three-step preparation ramp. */
export const WARMUP_FRACTIONS = [0.4, 0.6, 0.8] as const;
export const WARMUP_REPS = [8, 5, 3] as const;
/** Always round down to this load increment; equipment availability is unknown. */
export const WARMUP_ROUND_KG = 0.5;
export const WARMUP_MIN_STEPS = 2;

/** Chronic-skip comparisons require five comparable split sessions inside eight weeks. */
export const SKIP_LOOKBACK_DAYS = 56;
export const SKIP_WINDOW_SESSIONS = 5;
export const SKIP_MIN_MISSING = 4;
export const SKIP_MAX_FINDINGS = 2;

export const REVIEW_BASELINE_WEEKS = 8;
export const REVIEW_MIN_BASELINE_WEEKS = 4;
export const REVIEW_SIMILAR_RATIO = 0.1;
export const REVIEW_MIN_MUSCLE_DELTA = 1;

export const TRAJECTORY_POINTS = 12;
export const TRAJECTORY_MIN_POINTS = 7;
export const TRAJECTORY_MIN_SPAN_DAYS = 28;
export const TRAJECTORY_MAX_HORIZON_DAYS = 84;
export const TRAJECTORY_EXPIRY_DAYS = 21;
export const TRAJECTORY_MAX_LAST_GAP_DAYS = 28;

/** Muscles a general programme is expected to cover. Used by uncovered_muscle. */
export const MAJOR_MUSCLES: MuscleId[] = [
  'chest', 'lats', 'mid_back', 'rear_delts', 'side_delts', 'biceps', 'triceps',
  'quads', 'hamstrings', 'glutes', 'calves', 'abs',
];

export const COMPOUND_PATTERN = /squat|hip_hinge|horizontal_push|vertical_push|vertical_pull|horizontal_pull|incline_push|lunge|single_leg_squat/;

/** Swap at most this many stalled lifts per report. When most lifts stall at once the problem is the programme, not the exercise. */
export const MAX_SWAPS_PER_REPORT = 2;

/** Deload signal: at least this many lifts declining together. */
export const DELOAD_MIN_DECLINES = 2;
export const DELOAD_MIN_RECENT_SESSIONS = 6;
export const DELOAD_LOAD_FACTOR = 0.85;
