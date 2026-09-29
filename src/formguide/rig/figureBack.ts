// V1-06: the back view's slot (docs/FORM-GUIDE-PRODUCTION.md §3 "Views"). The back figure is drawn by V1-22; until then
// a file drawn in the back view gets this reason from check/view.ts rigFor, so every figure check fails naming it and
// the player refuses the file, instead of either crashing.
import type { ExerciseGuide } from '../model';
import type { Rig } from '../check/view';

export const BACK_REASON = 'back view not drawn yet (V1-22)';

/** The back-view rig for a file, or the reason there is none yet. */
export function backGuideRig(_g: ExerciseGuide): Rig | string {
  return BACK_REASON;
}
