// Straight-bar triceps pushdown (straight bar, high pulley, overhand grip), side view. T row of PUSHDOWN
// (D-LIB15R2-MODES; lb5/DESIGN.md 17.5-17.6): the parent lib_triceps_pushdown's plate through templates/PUSHDOWN.mjs with
// `bar.kind: 'straight'` (c1, the parent's own bar). Poses, rig and the lean-and-arch Mistake are the parent's: this
// card's c3, c4 and c11 state the parent's stance, lean and fault. Only the facts below are this card's own.
// Form: research card docs/research/howto/cards/straight_bar_triceps_pushdown.json (research a48b0594): checkpoints c5/c14,
//  c4/c3, c9 are the callouts; plate.mistake c11 (drawable); tempo 1/2/1 (c12): Press 1, Hold 1, Return 2.
// Unsourced numbers: none of its own; the parent's (templates/PUSHDOWN.mjs header).
import { make } from '../templates/PUSHDOWN.mjs';

export const facts = {
  id: 'straight_bar_triceps_pushdown', name: 'Straight-Bar Triceps Pushdown',
  callouts: [
    { key: 'elbows', text: 'Elbows<br>pinned', anchor: 'elbow.r', cue: 'Keep the upper arms close to your sides. Only the forearms move.' },
    { key: 'hips', text: 'Hip lean<br>only', anchor: 'backUpper', box: { left: 56, top: 124 }, cue: 'Keep the back straight, or tilt slightly from the hips without arching.' },
    { key: 'wrists', text: 'Neutral<br>wrists', anchor: 'wrist.r', cue: 'Keep the hands in line with the forearms from top to bottom.' },
  ],
  tempo: [{ phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }],
  mistake: {
    builder: 'lean',
    tells: [
      { key: 'lean', text: 'Leaning<br>over', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'You lean far over the bar or arch your back to push it down.' },
    ],
  },
  alt: 'Straight-bar triceps pushdown, side view. Standing at a high cable with a slight lean from the hips, upper arms at the sides, the lifter pushes a straight bar from upper-chest level down to straight arms in front of the thighs.',
};
export default make({ 'bar.kind': 'straight' }, facts);
