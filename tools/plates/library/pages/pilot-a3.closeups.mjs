// LIB-SHIP W2 (D-SHIP-Q4, D-SHIP-SHAPES): pilot A3's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as pilot-a3.layers.json's optionsKey. The shell record as pilot-a.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json, or archetype none), so each takes the plain shell record (D-CROP-NONE, #380).
// LIB-PLATEFIX-1: back with reverse_lunge only; dumbbell_fly is held (#385 6637650243).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  reverse_lunge: ZOOM,
};
