// Barbell curl (standing, underhand bar), side view. T row of CURL (D-LIB15R2-MODES; lb5/DESIGN.md 17.5-17.6): the parent
// lib_dumbbell_biceps_curl's plate through templates/CURL.mjs with `load.primitive: 'barbell'` (c1, a bar in both hands)
// and `stance.width: 0.22` (c2, feet hip width; the value is triceps_pushdown's hip-width stance). Poses are the
// parent's. The Mistake is the template's `elbows` builder, dir 'back' (c4 "must not travel back", c5 "elbows moving
// back let you cheat the weight up").
// Form: research card docs/research/howto/cards/barbell_curl.json (research a48b0594): checkpoints c4, c8, c3/c9 are the
//  callouts; plate.mistake c5/c4, drawable false: the top fault, the wrists bending (c8), cannot be seen side-on, so the
//  plate draws the next fault (F7, D-LIB15R2-F7). Tempo 1/2/0 (c13): Curl 1, Lower 2.
// Unsourced numbers: the parent's and the template's (its header): the bar's plate size, the back drift (30 deg).
import { make } from '../templates/CURL.mjs';

export const facts = {
  id: 'barbell_curl', name: 'Barbell Curl',
  callouts: [
    { key: 'elbows', text: 'Elbows<br>at sides', anchor: 'elbow.r', box: { left: 80, top: 140 }, cue: 'Keep the upper arms by your body. Never let them travel back.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', cue: 'Keep the hands in line with the forearms, not bent up or down.' },
    { key: 'still', text: 'Still<br>body', anchor: 'backUpper', box: { left: 96, top: 60 }, cue: 'Keep the chest and body still, so only the arms move.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    builder: 'elbows', dir: 'back',
    tells: [
      { key: 'elbows', text: 'Elbows<br>back', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your elbows travel back behind you to cheat the bar up.' },
    ],
  },
  pilot: { drawableFault: 'top fault: the wrists bending (c8) cannot be seen side-on; drawn: the next fault, the elbows moving back (c5, c4)' },
  alt: 'Barbell curl, side view. Standing with the feet hip-width and a bar held underhand at the thighs, the lifter keeps the elbows at the sides and curls the bar up to the shoulders.',
};
export default make({ 'load.primitive': 'barbell', 'stance.width': 0.22 }, facts);
