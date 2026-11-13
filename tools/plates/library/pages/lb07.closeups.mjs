// LIB-SHIP W6 (D-SHIP-Q4, D-SHIP-SHAPES): LB7's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb07.layers.json's optionsKey. The shell record as pilot-b.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json: gap-key, gap-ruled D-SHIP-HANDW6 or card-no-zoom), so each takes the plain shell record (D-CROP-NONE, #380).
// Not on this page: renegade_row and bench_dip (held S3, Q-W6-5/6).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
// LIB-PLATEFIX-5 item 1 (W6 panel, D-PLAN-W8C): a sheet whose Wrong is drawn solid over the faded Right takes the fade
// rule (lb01.closeups.mjs assisted_pull_up's form); ZOOM itself is unchanged.
const FADE = r => ({ ...r, css: { ...r.css, fade: true } });
export const CLOSEUP_OPTIONS = {
  cable_lateral_raise: ZOOM,
  dumbbell_front_raise: ZOOM,
  face_pull: ZOOM,
  cable_external_rotation: FADE(ZOOM),   // LIB-PLATEFIX-5 item 1: cer-turn's Wrong over the faded Right (wrong.under)
  resistance_band_pull_apart: ZOOM,
  weighted_dip: ZOOM,
  incline_push_up: ZOOM,
  diamond_push_up: FADE(ZOOM),   // LIB-PLATEFIX-5 item 1: shoulder-blades' Wrong over the faded Right (wrong.under)
  pike_push_up: ZOOM,
};
