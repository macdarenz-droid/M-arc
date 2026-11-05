// LIB-SHIP W4 (D-SHIP-Q4, D-SHIP-SHAPES): LB2's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb02.layers.json's optionsKey. The shell record as pilot-b.closeups.mjs; no id here has a hand zoom (no hand
// key draws a W4 id: hands/no-zoom.json, or back_extension's NoHandling), so each takes the plain shell record (D-CROP-NONE, #380).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  barbell_bench_press: ZOOM,
  incline_barbell_bench_press: ZOOM,
  incline_dumbbell_press: ZOOM,
  close_grip_bench_press: ZOOM,
  decline_bench_press: ZOOM,
  arnold_press: ZOOM,
  skull_crusher: ZOOM,
  dumbbell_pullover: ZOOM,
};
