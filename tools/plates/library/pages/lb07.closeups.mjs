// LIB-SHIP W6 (D-SHIP-Q4, D-SHIP-SHAPES): LB7's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb07.layers.json's optionsKey. The shell record as pilot-b.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json: gap-key, gap-ruled D-SHIP-HANDW6 or card-no-zoom), so each takes the plain shell record (D-CROP-NONE, #380).
// Not on this page: renegade_row and bench_dip (held S3, Q-W6-5/6).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  cable_lateral_raise: ZOOM,
  dumbbell_front_raise: ZOOM,
  face_pull: ZOOM,
  cable_external_rotation: ZOOM,
  resistance_band_pull_apart: ZOOM,
  weighted_dip: ZOOM,
  incline_push_up: ZOOM,
  diamond_push_up: ZOOM,
  pike_push_up: ZOOM,
};
