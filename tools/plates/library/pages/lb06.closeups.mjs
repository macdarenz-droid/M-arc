// LIB-SHIP W6 (D-SHIP-Q4, D-SHIP-SHAPES): LB6's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb06.layers.json's optionsKey. The shell record as pilot-b.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json: gap-key, gap-ruled D-SHIP-HANDW6 or card-no-zoom), so each takes the plain shell record (D-CROP-NONE, #380).
// Not on this page: smith_machine_incline_press (written from W4's head, Q-W6-9).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  cable_chest_press: ZOOM,
  machine_pullover: ZOOM,
  machine_crunch: ZOOM,
  low_to_high_cable_fly: ZOOM,
  high_to_low_cable_fly: ZOOM,
  smith_machine_squat: ZOOM,
  smith_machine_shoulder_press: ZOOM,
  hip_abduction: ZOOM,
  hip_adduction: ZOOM,
  machine_lateral_raise: ZOOM,
  rear_delt_fly: ZOOM,
};
