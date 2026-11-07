// LIB-SHIP W5 (D-SHIP-Q4, D-SHIP-SHAPES): LB4's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb04.layers.json's optionsKey; the shell record as pilot-a.closeups.mjs. Pair-key ids draw their hand zoom
// here only for the build; the page swaps that block for the pair panel (LIB-7b). rightNote is every curl/ez words file's
// right note ('Middle of palm', hands/words/*.json) and the panel height is the W1 curl's. Every other id has no hand
// zoom (hands/no-zoom.json, NoHandling or archetype none) and takes the shell record with no `hand`. goblet_squat is held
// (SHIP W5 PLAN RULED, Q-W5-7) and is not on this page.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  front_squat: ZOOM,
  bodyweight_squat: ZOOM,
  wall_sit: ZOOM,
  pistol_squat: ZOOM,
  jump_squat: ZOOM,
  step_up: ZOOM,
  forward_lunge: ZOOM,
  walking_lunge: ZOOM,
  bodyweight_lunge: ZOOM,
  bodyweight_split_squat: ZOOM,
  bulgarian_split_squat: ZOOM,
};
