// V1-11 fixture, not a shipped exercise (V1-13 authors the real file from research): the hanging pose on the side rig,
// the grip on the bar, legs raised to 90° at the hip. Numbers are illustrative, inside AAOS.
import type { ExerciseGuide } from '@/formguide/model';

export const lib_hanging_leg_raise: ExerciseGuide = {
  id: 'lib_hanging_leg_raise', kind: 'rep', order: 'lift_first',
  camera: { full: 'hangingSide', zoom: 'upperFront', subject: 'hip_r' }, pose: 'hanging',
  equipment: { kind: 'pull_up_bar', grip: 'overhand, shoulder width', attach: ['hand_l', 'hand_r'], loadFrom: 'bodyweight' },
  tempo: { lift: 1.2, hold: 0.4, lower: 1.8, rest: 0.6 }, symmetric: true,
  joints: { shoulder_flex: 175, hip_flex: [0, 90], knee_flex: [5, 10], ankle_flex: -10, torso_lean: [0, -8] },
  movement: { breathe: 'out on lift', leanDeg: 0.4 },
  muscles: { target: ['abs', 'hip_flexors'], helps: ['obliques'], keepQuiet: ['lower_back'], effort: { model: 'torque', chain: ['hip_r'] } },
  cues: ['Hang still, shoulders set.', 'Raise the legs to hip height.'],
  mistake: { name: 'Swing the legs', joints: { sway: { keys: [[0, 0], [0.2, 6], [0.5, 0]] }, knee_flex: { keys: [[0, 0], [0.2, 40], [0.5, 0]] } },
    tells: [{ text: 'The body swings.', joint: 'sway' }, { text: 'The knees bend to cheat.', joint: 'knee_flex' }] },
  sources: ['V1-11 fixture'],
};
