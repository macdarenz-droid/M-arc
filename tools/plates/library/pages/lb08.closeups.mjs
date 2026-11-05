// LIB-SHIP W7 (D-SHIP-Q4, D-SHIP-SHAPES): LB8's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb08.layers.json's optionsKey. No W7 row draws a hand pair (SHIP W7 PLAN RULED, #394 6647954465): each id is on
// hands/no-zoom.json or has archetype none, so each takes the plain shell record (pilot-b.closeups.mjs form, D-CROP-NONE).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  hack_squat: ZOOM,
  pendulum_squat: ZOOM,
  leg_extension: ZOOM,
  lying_leg_curl: ZOOM,
  standing_leg_curl: ZOOM,
  glute_bridge: ZOOM,
  cable_kickback: ZOOM,
  resisted_hip_flexion: ZOOM,
};
