// Bent-over dumbbell rear delt fly, FRONT view alternative (the census view). Same poses, equipment and checks as
// bent_over_dumbbell_rear_delt_fly.mjs (side view, recommended); only the view, floor, parts and datum change.
// Verdict: NO-GO with this engine. With the trunk at the textbook 80 deg the engine draws the flexed trunk as a
// foreshortened frontal outline (SPEC 8): the torso collapses to a thin band at shoulder height, the head nearly
// vanishes and the legs are drawn over it. With the card's layers (2026-09-30) the arm sweep and its Trace read
// well, but the card's Mistake (shrug, c3) lifts the shoulders toward the camera and moves them about 2 px on
// screen, so the Mistake does not read. Kept for the go/no-go review only; do not ship it.
import base from './bent_over_dumbbell_rear_delt_fly.mjs';

export default {
  ...base,
  id: 'bent_over_dumbbell_rear_delt_fly__alt',
  view: 'front', facing: undefined,
  camera: undefined,
  equipment: [{ type: 'floor', from: -0.55, to: 0.55 }, base.equipment[1]],   // no dashed side-profile start dumbbell
  startParts: ['arm.l', 'arm.r'],
  ghosts: { count: 2, parts: ['arm.l', 'arm.r', 'db'] },
  datum: [{ y: 'shoulder.r', from: 'grip.r', to: 'grip.l' }],   // shoulder level: the hands finish on it
  // Front-view layers. The card's plate facts are written for this view (card plate.view 'front'): its checkpoints,
  // and its drawable Mistake, shrugging (c3; drawable: false because the top fault, the torso swing, needs the side
  // view, flag F7). The arc is the held elbow bend (c2), which faces the camera here. M_ELEV is illustrative.
  measure: { vertex: 'elbow.r', from: 'shoulder.r', to: 'wrist.r', radius: 18, title: 'Elbow', value: 'slight bend, held' },
  callouts: base.callouts.map(c => ({ ...c, prefer: undefined })),
  mistake: {
    pose: { scap: { elev: 5, pro: -3 } },
    guides: [
      { kind: 'arrow', from: { at: 'shoulderTop.l', pose: 'end' }, to: { at: 'shoulderTop.l', pose: 'mistake' } },
      { kind: 'arrow', from: { at: 'shoulderTop.r', pose: 'end' }, to: { at: 'shoulderTop.r', pose: 'mistake' } },
    ],
    tells: [
      { key: 'shrug', text: 'Shoulders<br>shrug', anchor: { at: 'shoulderTop.r', pose: 'mistake' }, cue: 'The shoulders hike up toward the ears as the dumbbells rise.' },   // c3
    ],
  },
  pilot: { drawableFault: 'Top fault (swinging the torso to throw the weights, c4, c5) needs the side view; this front view draws the card\'s drawable fault, shrugging (c3).' },
  alt: 'Bent-over dumbbell rear delt fly, front view. Hinged forward at the hips with a straight spine, the lifter raises two dumbbells from hanging under the chest out to the sides until the arms are about level with the body, elbows slightly bent.',
};
