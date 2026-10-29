// Bent-over dumbbell rear delt fly, FRONT view (the census view), a sheet extra only (LIB-8R, D-LIB8R-FLIES). Same
// poses, equipment and checks as bent_over_dumbbell_rear_delt_fly.mjs (the side plate); only the view, camera, floor,
// parts and datum change. With LIB-20's camera.pitch 15 and volume trunk (D-SPIKE-hinge) the hinged trunk and head
// read, but the card's Mistake (shrug, c3) moves the shoulders along the trunk axis, almost at the camera: 1.3 px at
// plate scale and 5.1 px in a k 4 zoom, below H3's 11.39 px at every k (S3), and the card chunk is 180.3 KB (> H7's
// 150 KB). So it is held, never enlarged; the side view carries the same Mistake.
import base, { posesAt } from './bent_over_dumbbell_rear_delt_fly.mjs';

export default {
  ...base,
  id: 'bent_over_dumbbell_rear_delt_fly__alt',
  view: 'front', facing: undefined,
  poses: posesAt(90),                                    // the full sweep to level: the front view shows it
  camera: { x0: 195, y0: 339, pitch: 15 },             // D-SPIKE-hinge
  torso: 'volume',
  zoom: undefined,
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

  alt: 'Bent-over dumbbell rear delt fly, front view. Hinged forward at the hips with a straight spine, the lifter raises two dumbbells from hanging under the chest out to the sides until the arms are about level with the body, elbows slightly bent.',
};
