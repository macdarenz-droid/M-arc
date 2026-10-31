// EZ-bar curl (standing, underhand on the angled sections), side view. T row of CURL (D-LIB15R2-MODES, -EZ; lb5/DESIGN.md
// 17.5-17.6): the parent lib_dumbbell_biceps_curl's plate through templates/CURL.mjs with `load.primitive: 'barbell'`
// (c1; the EZ bar is the vendor barbell end-on, its camber frontal, D-LIB15R2-EZ). Stance and poses are the parent's
// (c3 allows hip- to shoulder-width). The Mistake is the parent's builder: elbows drifting forward at the top (c4, c5).
// Form: research card docs/research/howto/cards/ez_bar_curl.json (research a48b0594): checkpoints c4, c1, c8 are the
//  callouts; plate.mistake c4/c5, drawable false: the top fault, the wrists bending (c8), cannot be seen side-on (F7,
//  D-LIB15R2-F7). Tempo 1/2/1 (c14): Curl 1, Hold 1, Lower 2.
// Unsourced numbers: the parent's and the template's (its header).
import { make } from '../templates/CURL.mjs';

export const facts = {
  id: 'ez_bar_curl', name: 'EZ-Bar Curl',
  callouts: [
    { key: 'elbows', text: 'Elbows<br>at sides', anchor: 'elbow.r', cue: 'Keep the elbows close to your body. Do not let them drift forward on top.' },
    { key: 'grip', text: 'Angled<br>grip', anchor: 'grip.r', box: { left: 240, top: 140 }, cue: 'Hold the bar underhand on its angled sections.' },
    { key: 'wrists', text: 'Straight<br>wrists', anchor: 'wrist.r', cue: 'Keep the hands in line with the forearms.' },
  ],
  tempo: [{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }],
  mistake: {
    builder: 'elbows', dir: 'forward',
    tells: [
      { key: 'elbows', text: 'Elbows<br>forward', anchor: { at: 'elbow.r', pose: 'mistake', off: [0, 7] }, cue: 'Your elbows drift forward as the bar reaches the top.' },
    ],
  },
  pilot: { drawableFault: 'top fault: the wrists bending (c8) cannot be seen side-on; drawn: the next fault, the elbows drifting forward at the top (c4, c5)' },
  alt: 'EZ-bar curl, side view. Standing with an EZ bar held underhand on its angled sections, the lifter keeps the elbows close to the body and curls the bar up toward the chest.',
};
export default make({ 'load.primitive': 'barbell' }, facts);
