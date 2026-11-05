// LIB-SHIP W7: the How-to content of lib_jumping_jacks (golden B's HowToContent shape, as lib_plank). Every shown string
// restates a claim of the verified card docs/research/howto/cards/jumping_jacks.json (cited in its field's claim, cN =
// card claim id).
// Handling: none (card archetype.hand none, grip fields all empty, no hand zoom).
// Front-view plate (card plate.view): the posture crop is cut in the plate's own view (F-CROP-FRONT).
// Zoom landing-knees is a text checkpoint (D-SHIP-TEXTZOOM; the LIB-SHIP-DESIGN table's DV could not be drawn cleanly):
// the plate is a front view, where the knees' slight bend cannot show (spec D-LIB22-FRONT, accepted #305 6356763967).
// Straightening the end pose's knees from the spec's KNEE_SOFT to 0 lifts the hips under 1 cm, so a Wrong crop would
// not differ from the Right. Its Right and Wrong are posture 'knees'.
// No red flags (card redFlags []), so no box. No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c5 upright, shoulders over hips   -> posture 'upright'
//   posture c5 knees slightly bent            -> posture 'knees' (T landing-knees: Right and Wrong), setup 4
//   posture c12 toes pointing forward         -> posture 'toes', zoom toes-forward (Right)
//   handlingMistake jerky landings (c6, c14, c5) -> posture 'hm-jerky' (Q-W2-12: label = mistake, detail = fix)
//   handlingMistake straight knees (c6, c5)   -> posture 'hm-knees' (Q-W2-12), mistakeLine
//   handlingMistake rushing (c6, c15)         -> posture 'hm-rush' (Q-W2-12)
//   T landing-knees (c5, c6)                  -> Right: posture 'knees', setup 4; Wrong: posture 'hm-knees', mistakeLine
//   zoom toes-forward Wrong (c12)             -> zoom toes-forward (the plate's Mistake)
// D-TEXT-PROGRESSION: c8 and c10 (easier and harder versions) and c9 (intervals) are not form checkpoints, not on the sheet.
import plateSpec, { turnedFoot } from '../specs/jumping_jacks.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'nasm-jumping-jacks': { cite: 'Jumping Jacks (NASM Exercise Library)', url: 'https://www.nasm.org/resource-center/exercise-library/jumping-jacks',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'el-jj': { cite: 'How to Do Jumping Jacks (Experience Life, Life Time)', url: 'https://experiencelife.lifetime.life/article/break-it-down-the-jumping-jack/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'webmd-jj': { cite: 'How to Do Jumping Jacks (WebMD; medically reviewed by a DPT)', url: 'https://www.webmd.com/fitness-exercise/how-to-do-jumping-jacks',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const NA = 'nasm-jumping-jacks', EL = 'el-jj', WM = 'webmd-jj';
const CL = {
  c1: C(['CONSENSUS'], [NA], 'card c1'),
  c2: C(['CONSENSUS'], [NA], 'card c2'),
  c3: C(['CONSENSUS'], [NA], 'card c3'),
  c5: C(['CONSENSUS'], [EL], 'card c5'),
  c6: C(['CONSENSUS'], [NA], 'card c6'),
  c7: C(['CONSENSUS'], [NA], 'card c7'),
  c11: C(['CONSENSUS'], [WM], 'card c11'),
  c12: C(['CONSENSUS'], [WM], 'card c12'),
  c13: C(['MECH', 'WEAK'], [WM, NA], 'card c13'),
  knees: C(['CONSENSUS'], [EL, NA], 'card c5, c6'),
  land: C(['CONSENSUS'], [NA, EL], 'card c6, c14, c5'),
  pace: C(['CONSENSUS'], [NA, WM], 'card c6, c15'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (landed, feet apart, toes forward, arms overhead; c2, c12) and the spec's
// Mistake merged over it, as the engine draws it (card plate.mistake c12: toes twisted outward). No drawing value added.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
// The plate's own Mistake guide (spec TOE_GUIDES): the turned foot's heel-to-toe axis, since the engine's front-view foot
// is its mid-foot cross-section and hardly changes outline when turned. Drawn on the Wrong crop as a path (lib_crunch).
const TOE_AXIS = ['l', 'r'].map(sd => { const t = turnedFoot(sd); return { kind: 'path', role: 'wrong', pts: [t.heel, t.toe] }; });
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  toesOut: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
const zooms = [
  {
    key: 'toes-forward', chip: 'Toes', heading: 'Toes forward', kind: 'posture',
    // zoom shell: crop centre between the feet, off the right pose's near ankle (front view), both feet in; the Wrong is the spec's Mistake drawn alone (solid).
    crop: { center: { at: 'ankle.r', pose: 'right', off: [22, -22] }, sizePx: 110 },
    guides: TOE_AXIS,
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Toes forward', anchor: 'toe.r' },
      wrong: { text: 'Toes out', anchor: { at: 'toe.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Toes pointed forward.',   // card zoom right (c12)
      wrong: 'Toes twisted outward.',   // card zoom wrong (c12)
    },
    alt: {
      right: 'Front view, landed with the feet apart. Both feet point straight forward.',
      wrong: 'Front view, landed with the feet apart. The toes twist outward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front of the thighs drives each jump.', claim: CL.c7 },
    { muscleId: 'glutes', plain: 'The glutes power the jump.', claim: CL.c7 },
  ],
  secondary: [
    { muscleId: 'side_delts', plain: 'The shoulders lift your arms overhead.', claim: CL.c13 },
  ],
  watch: [],
  // The card's three rows have no fix, so they are left out: the feel line says them.
  feelLine: 'You should feel this in your thighs, glutes and shoulders.',
  rows: [],
  libraryDiff: { add: ['glutes'], why: 'NASM lists the glutes with the quads as the muscles driving the jump (card c7).' },
  claim: C(['CONSENSUS', 'MECH', 'WEAK'], [NA, WM], 'card c7, c13'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'landing', text: 'Stiff-kneed landings add joint stress. Jerky landings add impact stress.', claim: CL.c6 },
  { key: 'surface', text: 'Hard surfaces like cement absorb less shock than rubber or grass.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_jumping_jacks',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'safety', text: 'Use a flat, even surface. Rubber or grass absorbs shock best.', claim: CL.c11 },
    { kind: 'position', text: 'Stand with your feet together and your arms at your sides.', claim: CL.c1 },
    { kind: 'position', text: 'Jump your feet apart as your arms go overhead.', claim: CL.c2 },
    { kind: 'position', text: 'Land softly, knees slightly bent.', claim: CL.c5 },
    { kind: 'finish', text: 'Jump back together as your arms come down, and go again.', claim: CL.c3 },
  ],
  posture: [
    { key: 'upright', label: 'Upright', detail: 'Upright, shoulders over hips.', anchor: { landmark: 'shoulder.l', pose: 'end' }, claim: CL.c5 },
    // D-SHIP-TEXTZOOM (header): the card zoom landing-knees as text (Right here; its Wrong is hm-knees and mistakeLine)
    { key: 'knees', label: 'Soft knees', detail: 'Soft landing, knees slightly bent, never locked.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.knees },
    { key: 'toes', label: 'Toes forward', detail: 'Toes pointing forward.', anchor: { landmark: 'toe.r', pose: 'end' }, zoom: 'toes-forward', claim: CL.c12 },
    // Q-W2-12 (NoHandling): the card's handlingMistakes as checkpoints, label = the mistake, detail = the card's fix
    { key: 'hm-jerky', label: 'Jerky landings', detail: 'Move with control and land softly.', anchor: { landmark: 'ankle.l', pose: 'end' }, claim: CL.land },
    { key: 'hm-knees', label: 'Straight-knee landings', detail: 'Keep a slight bend and land softly.', anchor: { landmark: 'knee.l', pose: 'end' }, claim: CL.knees },
    { key: 'hm-rush', label: 'Rushing the reps', detail: "Don't sacrifice form for speed.", anchor: { landmark: 'hips', pose: 'start' }, claim: CL.pace },
  ],
  feel,
  zooms,
  chips: ['toes-forward', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Feet together, arms at your sides. Jump the feet apart as the arms go overhead.',
    mistakeLine: 'Never land with straight knees: keep a slight bend and land softly.',
    cueLine: 'Soft knees, toes forward.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: [],   // the card's redFlags (none)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/jumping_jacks.json', rev: 1 },
};
