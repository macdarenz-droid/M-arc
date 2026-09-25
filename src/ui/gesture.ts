// Gesture constants shared by every touch interaction. Values are cited in
// docs/UI-POLISH-PLAN.md §2/§8 (AOSP ViewConfiguration, AndroidX ItemTouchHelper, Vaul, Sonner).
// EDGE_IGNORE_PX, AXIS_RATIO and SCRUB_HOLD_MS are M/ARC tuning choices (unverified).
// `track()` (the shared pointer-drag helper) arrives in A3; this file is constants only.

export const SLOP_PX = 8;
export const AXIS_RATIO = 1.2;
export const VELOCITY_WINDOW_MS = 100;
export const FLING_PX_PER_MS = 0.4;
export const SHEET_CLOSE_FRACTION = 0.25;
export const SCROLL_LOCK_MS = 100;
export const RUBBER_MAX_PX = 24;
export const LONG_PRESS_MS = 400;
export const REORDER_HOLD_MS = 320;
export const SWIPE_COMMIT_FRACTION = 0.5;
export const SWIPE_FLING_MIN_PX = 32;
export const AUTOSCROLL_EDGE_PX = 72;
export const AUTOSCROLL_MAX_PX = 20;
export const TOAST_SWIPE_PX = 45;
export const TOAST_FLING_PX_PER_MS = 0.11;
export const EDGE_IGNORE_PX = 32;
export const HOLD_CONFIRM_MS = 800;
export const SCRUB_HOLD_MS = 150;
