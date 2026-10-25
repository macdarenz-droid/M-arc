// LIB-12 gap key: implement ids that have no drawable pair yet (supervisor ruling 11:26, D-LIB12-3).
export const KEY = 'implement', OWNER = 'LIB-12', VIEW = 'none';
export const IDS = {};
export const GAPS = {
  kettlebell_swing: 'the radial view always draws the thumb and no claim places it (shared/implement-kettlebell-swing.json#c5 only says "not thumbs up", by inference)',
  jump_rope: 'thumb-and-index grip (shared/implement-jump-rope.json#c2) is not a golden-B hand.mjs thumb mode',
  sled_pull: 'cards/sled_pull.json hand zoom has no Wrong, and no source places the thumb',
};
/** Census scope: census.json aggregates handZoomsNeeded implement 5 = battle_ropes (hand-battle-rope), wall_ball and
 *  medicine_ball_slam (hand-ball-contact), kettlebell_swing and jump_rope (here); sled_pull (census pull) per LIB-7. */
export const CENSUS = { source: 'census.json implement 5 (2 here) + sled_pull from LIB-7 §2', count: 3 };
