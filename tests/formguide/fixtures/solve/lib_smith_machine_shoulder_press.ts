// V1-04 fixture (not a shipped guide): a front two-hand press on a machine whose handles slide on two vertical rails.
// The follow rule of D-FG7 (b): shoulder_abd drives as one minimum-jerk curve (A0 names it for the front overhead press),
// each elbow_lead is solved to keep its hand on its rail, and the handles follow the hands. Inside A0's envelope: a
// 15° lockout bend at the top, the start at 0.45 of the reach.
import type { ExerciseGuide } from '@/formguide/model';

export const lib_smith_machine_shoulder_press: ExerciseGuide = {
  id: 'lib_smith_machine_shoulder_press', kind: 'rep', order: 'lift_first', view: 'front', viewWhy: 'the V1-04 solver fixture reads the front chain',
  camera: { full: 'standingFront', zoom: 'upperFront', subject: 'shoulder_r' }, pose: 'seated',
  equipment: { kind: 'none', attach: ['hand_l', 'hand_r'], loadFrom: 'lastSet' },
  machine: { id: 'fx_press', settings: {}, drive: [{ part: 'bar_r', follow: 'hand_r' }, { part: 'bar_l', follow: 'hand_l' }] },
  contacts: [{ at: 'hand_r', on: 'bar_r', solve: 'elbow_lead', range: [-170, -5] }, { at: 'hand_l', on: 'bar_l', solve: 'elbow_lead', range: [-170, -5] }],
  tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { shoulder_abd: [101, 165], hip_flex: 90, knee_flex: 90 },
  movement: { breathe: 'out on lift', leanDeg: 0.6, bladeRhythm: '1° of blade per 2° of arm above 30°' },
  muscles: { target: ['front_delts'], helps: ['side_delts'], keepQuiet: ['upper_traps'], effort: { front_delts: [0.3, 0.9], side_delts: [0.2, 0.6], upper_traps: [0.06, 0.15] } },
  cues: ['Press the handles straight up.', 'The shoulders stay down.'],
  mistake: { name: 'Shrug and lean back', tempo: { lift: 0.7, hold: 0.3, lower: 1.5, rest: 1.5 },
    joints: { shrug_cm: { keys: [[0, 0], [0.2, 6], [0.5, 6], [0.8, 0]] }, torso_lean: { keys: [[0, 0], [0.2, 8], [0.5, 8], [0.8, 0]] } },
    muscles: { upper_traps: [0.1, 0.45] },
    tells: [{ text: 'The shoulders shrug to the ears.', joint: 'shrug_cm' }, { text: 'The trunk leans back.', joint: 'torso_lean' }] },
  sources: ['V1-04 fixture'],
};
