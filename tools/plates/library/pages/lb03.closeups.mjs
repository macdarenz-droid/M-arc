// LIB-SHIP W4 (D-SHIP-Q4, D-SHIP-SHAPES): LB3's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb03.layers.json's optionsKey. The shell record as pilot-b.closeups.mjs; no id here has a hand zoom (no hand
// key draws a W4 id: hands/no-zoom.json, or back_extension's NoHandling), so each takes the plain shell record (D-CROP-NONE, #380).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  pendlay_row: ZOOM,
  landmine_row: ZOOM,
  one_arm_dumbbell_row: ZOOM,
  dumbbell_romanian_deadlift: ZOOM,
  conventional_deadlift: ZOOM,
  sumo_deadlift: ZOOM,
  back_extension: ZOOM,
  t_bar_row: ZOOM,
  barbell_shrug: ZOOM,
  cable_shrug: ZOOM,
  dumbbell_shrug: ZOOM,
  smith_machine_shrug: ZOOM,
};
