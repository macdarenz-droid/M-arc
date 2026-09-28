// The Lateral Raise Lab's SPEC re-keyed (docs/FORM-GUIDE-PRODUCTION.md §2). Keys fitted to the lab's motion model;
// the cited numbers are in ../research/lib_dumbbell_lateral_raise.json.
import type { ExerciseGuide } from '../model';

export const lib_dumbbell_lateral_raise: ExerciseGuide = {
  id: 'lib_dumbbell_lateral_raise', kind: 'rep', order: 'lift_first',
  camera: { full: 'standingFront', zoom: 'upperFront', subject: 'shoulder_r' }, pose: 'standing',
  equipment: { kind: 'dumbbell', grip: 'neutral, kept level', attach: ['hand_l', 'hand_r'], loadFrom: 'lastSet' },
  tempo: { lift: 1, hold: 0.5, lower: 2, rest: 0.5 }, symmetric: true,
  joints: { shoulder_abd: [10, 88], elbow_flex: 14, elbow_lead: { keys: [[0.0958, 0], [0.21, 8], [0.455, 8], [0.6835, 0]] }, knee_flex: 6 },
  movement: { breathe: 'out on lift', leanDeg: 0.6, tremorDeg: 0.35, slowdown: [1, 1.08, 1.18], bladeRhythm: '1° of blade per 2° of arm above 30°' },
  muscles: { target: ['side_delts'], helps: ['front_delts'], keepQuiet: ['upper_traps'], effort: { model: 'torque', chain: ['shoulder_r'] } },
  cues: ['The elbows lead, the hands follow.', 'The upper traps stay quiet. No shrug.', 'The load peaks at shoulder height.'],
  mistake: { name: 'Dip, shrug and drop', tempo: { lift: 0.8, hold: 0.2, lower: 0.9, rest: 2.1 },
    joints: {
      shoulder_abd: { keys: [[0, 0], [0.0344, -3.01], [0.0536, -8.08], [0.0672, -11.01], [0.0849, -11.54], [0.1, -8.41], [0.1354, 7.2], [0.1542, 15.25], [0.1776, 20.43], [0.225, 20], [0.2859, 19.97], [0.3187, 24.15], [0.3354, 27.94], [0.3958, 38.26], [0.4313, 30.21], [0.4417, 24.88], [0.4698, 4.48], [0.4745, 0.45], [0.5016, -4.3], [0.5823, 1.54], [0.6599, -0.54], [0.7365, 0.19], [1, 0]] },
      elbow_lead: { keys: [[0, 0], [0.0823, -0.02], [0.1057, -1.08], [0.1359, 1.38], [0.1599, 0.05], [0.225, 0], [0.2964, 0.07], [0.3276, 2.6], [0.3688, 7.07], [0.3896, 5.54], [0.437, 0]] },
      wrist_pron: { keys: [[0, 0], [0.0786, 0.09], [0.0906, 2.87], [0.1281, 33.52], [0.1385, 38.94], [0.225, 40], [0.3615, 39.16], [0.4161, 19.63], [0.4609, 0.08], [1, 0]] },
      knee_flex: { keys: [[0, 0], [0.0026, 1.63], [0.0339, 13.98], [0.0385, 13.82], [0.0667, 2.09], [0.0703, 0]] },
      shrug_cm: { keys: [[0, 0], [0.1161, 0.06], [0.1266, 1.02], [0.1339, 2.06], [0.1536, 4.39], [0.1672, 4.93], [0.225, 5], [0.2854, 4.97], [0.3339, 4.18], [0.3766, 1.87], [0.4141, 0]] },
      torso_lean: { keys: [[0, 0], [0.0109, 1.96], [0.088, 10], [0.1651, 1.58], [0.174, 0], [0.1995, 0], [0.2, 2], [0.225, 2], [0.475, 0]] },
      sway: { keys: [[0, 0], [0.0661, 0.04], [0.1229, -0.44], [0.1693, -0.88], [0.225, -0.91], [0.3745, -0.81], [0.4677, -0.1], [0.475, 0]] },
      breath: [-0.5, 0.5] },
    tells: [{ text: 'The knees dip to swing it up.', joint: 'knee_flex' }, { text: 'The shoulders shrug toward the ears.', joint: 'shrug_cm' }, { text: 'Thumbs turn down at the top.', joint: 'wrist_pron' }] },
  sources: ['ACE Lateral Raise', 'Physiopedia scapulohumeral rhythm', 'EMG study 2020 (PMC7503819)', 'Dumbbell vs cable study (PMC12277279)', 'AAOS ROM chart'],
};
