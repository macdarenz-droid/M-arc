// Reverse curl (standing, overhand bar), side view. T row of CURL (D-LIB15R2-MODES, -EZ; registry parent
// dumbbell_biceps_curl, D-LIB10-PARENTS; lb5/DESIGN.md 17.5-17.6): the parent's plate through templates/CURL.mjs with
// `load.primitive: 'barbell'` (c1, an overhand bar; an EZ bar is drawn the same end-on). Stance and poses are the
// parent's (c2 allows hip- or shoulder-width). The engine fist does not show the overhand grip (no forearm rotation);
// the grip is the hand close-up's job at ship. The Mistake is the template's `swing` builder (c5).
// Form: research card docs/research/howto/cards/reverse_curl.json (research a48b0594): checkpoints c1/c3, c6, c4/c7 are
//  the callouts; plate.mistake c5 (drawable). Tempo 1/2/0 (c15): Curl 1, Lower 2.
// Unsourced numbers: the parent's and the template's (its header): the swing's magnitudes.
import { make } from '../templates/CURL.mjs';

export const facts = {
  id: 'reverse_curl', name: 'Reverse Curl',
  callouts: [
    { key: 'palms', text: 'Palms<br>down', anchor: 'grip.r', box: { left: 270, top: 130 }, cue: 'Hold the bar overhand about shoulder-width and keep that grip all the way up.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', cue: 'Keep a straight line from the hands to the elbows.' },
    { key: 'elbows', text: 'Elbows<br>at sides', anchor: 'elbow.r', box: { left: 80, top: 100 }, cue: 'Keep the upper arms still and the elbows close to the ribs.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    builder: 'swing', dir: 'body',
    tells: [
      { key: 'swing', text: 'Body<br>swings', anchor: { at: 'backUpper', pose: 'mistake' }, cue: 'Your body rocks back to swing the bar up.' },
    ],
  },
  alt: 'Reverse curl, side view. Standing with a bar held overhand at the thighs, the lifter keeps the elbows at the sides and curls the bar up to the shoulders, palms facing down.',
};
export default make({ 'load.primitive': 'barbell' }, facts);
