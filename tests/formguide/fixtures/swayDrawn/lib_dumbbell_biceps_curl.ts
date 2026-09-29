// V1-11 fixture for swayDrawn (A6), not a shipped exercise: a seated side-view curl. FG-6's side frame drew the sway only
// when standing (pose.ts sideFrame before V1-11), so this file's figure sat still while `secondaryMotion` read a sway
// channel in band; V1-11 turns its trunk about the hips. Numbers are illustrative, inside AAOS.
import type { ExerciseGuide } from '@/formguide/model';

export const lib_dumbbell_biceps_curl: ExerciseGuide = {
  id: 'lib_dumbbell_biceps_curl', kind: 'rep', order: 'lift_first',
  camera: { full: 'seatedSide', zoom: 'upperFront', subject: 'elbow_r' }, pose: 'seated',
  equipment: { kind: 'dumbbell', grip: 'underhand', attach: ['hand_l', 'hand_r'], loadFrom: 'lastSet' },
  tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { elbow_flex: [10, 130], shoulder_flex: [0, 10], hip_flex: 90, knee_flex: 90 },
  movement: { breathe: 'out on lift', leanDeg: 0.4 },
  muscles: { target: ['biceps'], helps: ['forearms'], keepQuiet: ['front_delts'], effort: { model: 'torque', chain: ['elbow_r'] } },
  cues: ['Elbows stay by your sides.', 'Curl up, lower slowly.'],
  mistake: { name: 'Swing the trunk', joints: { torso_lean: { keys: [[0, 0], [0.2, 10], [0.5, 0]] }, shoulder_flex: { keys: [[0, 0], [0.2, 20], [0.5, 0]] } },
    tells: [{ text: 'The trunk rocks back.', joint: 'torso_lean' }, { text: 'The elbows drift forward.', joint: 'shoulder_flex' }] },
  sources: ['V1-11 fixture'],
};
