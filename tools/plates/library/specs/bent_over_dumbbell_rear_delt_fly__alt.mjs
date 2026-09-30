// Bent-over dumbbell rear delt fly, FRONT view alternative (the census view). Same poses, equipment and checks as
// bent_over_dumbbell_rear_delt_fly.mjs (side view, recommended); only the view, floor, parts and datum change.
// Verdict: NO-GO with this engine. With the trunk at the textbook 80 deg the engine draws the flexed trunk as a
// foreshortened frontal outline (SPEC 8): the torso collapses to a thin band at shoulder height, the head nearly
// vanishes and the legs are drawn over it. Kept for the go/no-go review only; do not ship it.
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
  alt: 'Bent-over dumbbell rear delt fly, front view. Hinged forward with soft knees, the lifter raises two dumbbells from hanging under the chest out to the sides until the arms are level with the shoulders, elbows slightly bent.',
};
