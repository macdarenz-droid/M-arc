// LIB-SHIP W2 (D-SHIP-Q4, D-SHIP-SHAPES): pilot B's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as pilot-b.layers.json's optionsKey. The shell record as pilot-a.closeups.mjs; no id here has a hand zoom
// (hands/no-zoom.json, or archetype none), so each takes the plain shell record (D-CROP-NONE, #380).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  cable_fly: ZOOM,
  seated_leg_curl: ZOOM,   // LIB-SHIP W8a (Q-W8a-4, #413): back on the page; its posture zooms are text checkpoints (D-SHIP-TEXTZOOM)
  push_up: ZOOM,
};
