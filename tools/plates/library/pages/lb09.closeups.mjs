// LIB-SHIP W7 (D-SHIP-Q4, D-SHIP-SHAPES): LB9's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb09.layers.json's optionsKey. No W7 row draws a hand pair (SHIP W7 PLAN RULED, #394 6647954465): each id is on
// hands/no-zoom.json or has archetype none, so each takes the plain shell record (pilot-b.closeups.mjs form, D-CROP-NONE).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  ab_wheel_rollout: ZOOM,
  bird_dog: ZOOM,
  side_plank: ZOOM,
  superman: ZOOM,
  cable_crunch: ZOOM,
  hollow_body_hold: ZOOM,
  reverse_crunch: ZOOM,
  dead_bug: ZOOM,
  v_up: ZOOM,
};
