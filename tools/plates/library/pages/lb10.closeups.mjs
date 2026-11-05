// LIB-SHIP W7 (D-SHIP-Q4, D-SHIP-SHAPES): LB10's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb10.layers.json's optionsKey. No W7 row draws a hand pair (SHIP W7 PLAN RULED, #394 6647954465): each id is on
// hands/no-zoom.json or has archetype none, so each takes the plain shell record (pilot-b.closeups.mjs form, D-CROP-NONE).
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
export const CLOSEUP_OPTIONS = {
  kettlebell_swing: ZOOM,
  high_knees: ZOOM,
  jump_rope: ZOOM,
  battle_ropes: ZOOM,
  sled_pull: ZOOM,
  burpee: ZOOM,
  bear_crawl: ZOOM,
  sled_push: ZOOM,
  medicine_ball_slam: ZOOM,
  farmer_s_carry: ZOOM,
  jumping_jacks: ZOOM,
  wall_ball: ZOOM,
};
