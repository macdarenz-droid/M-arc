// LIB-SHIP W2: the How-to content of lib_box_jump (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/box_jump.json; its claim ids are named on each field's claim.
// Handling: none (card archetype.hand 'none', grip note: arms swing back then up, c2, c3; no hand zoom).
// Zooms: the card's landing-knees (c5) is drawn from the plate's own poses (its Wrong is the plate's drawn Mistake).
// The card's box-height zoom (c7: "Box so high the feet barely clear it") needs a mid-air body over a taller box, which
// the airborne convention does not draw (plate.frames: take-off and landing frames only); it is the text checkpoint
// `box` and setup step 1, as D-SHIP-Q14 keeps pec_fly's fly-backpad (lib_pec_fly.howto.mjs posture 'back').
// Red flags: the card's redFlags (knee, ankle). The knee box is golden B's shared block; the card's ankle box
// (redFlagNote: "a new shared box") has no shared module yet, so riskFlags names it and the ankle row links it.
// Tier-A way out: the card's gap (no source gives a failed-jump way out, LIB-WAYOUT); no line is shown (Q-W2-3).
import plateSpec from '../specs/box_jump.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'nasm-boxjump': { cite: 'NASM Exercise Library, Box Jumps', url: 'https://www.nasm.org/resource-center/exercise-library/box-jumps',
    kind: 'guideline', access: 'full', checked: '2026-10-03', use: 'CONSENSUS' },
  'cat-boxjump': { cite: 'Catalyst Athletics, Box Jump (Exercise Library)', url: 'https://www.catalystathletics.com/exercise/548/Box-Jump/',
    kind: 'coach', access: 'full', checked: '2026-10-03', use: 'CONSENSUS' },
  'nhs-knee': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/conditions/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-03', use: 'CONSENSUS' },
  'nhs-ankle': { cite: 'NHS, Ankle pain (page last reviewed 20 November 2025)', url: 'https://www.nhs.uk/symptoms/foot-pain/ankle-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-03', use: 'CONSENSUS' },
};
// Not cited: dossantos-2024 (c9, take-off performance by box height; no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const NASM = 'nasm-boxjump', CAT = 'cat-boxjump';
const CL = {
  c1: C(['CONSENSUS'], [CAT, NASM], 'c1'),
  c2: C(['CONSENSUS'], [CAT], 'c2'),
  c4: C(['CONSENSUS'], [CAT, NASM], 'c4'),
  c5: C(['CONSENSUS'], [NASM], 'c5'),
  c6: C(['CONSENSUS'], [NASM], 'c6'),
  c7: C(['CONSENSUS'], [CAT, NASM], 'c7'),
  c11: C(['CONSENSUS'], [CAT, NASM], 'c11'),
  c12: C(['CONSENSUS'], [NASM], 'c12'),
  c14: C(['CONSENSUS'], ['nhs-ankle'], 'c14'),
  c15: C(['CONSENSUS'], ['nhs-knee'], 'c15'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the take-off frame (c2), the landing (c4, c5) and the spec's Mistake pose (card
// plate.mistake, c5: straight, stiff knees on the box, same feet), which is the card zoom landing-knees' Wrong.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'straight-knees': { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The zoom shell's shape (callout with an anchor at the landmark it names; pilot-a.closeups.mjs), as the curl's
// curl-elbow. The crop is centred on the landing knee; the Wrong is the plate's Mistake pose drawn alone (solid).
const zooms = [
  {
    key: 'landing-knees', chip: 'Knees', heading: 'Landing knees', kind: 'posture',
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Knees bent', anchor: 'knee.r' },
      wrong: { text: 'Locked knees', anchor: 'knee.r' },
    },
    caption: {
      right: 'Knees and hips bent on landing.',
      wrong: 'Straight, locked knees on landing.',
    },
    alt: {
      right: 'Side view, landing on the box. Both feet are flat on the box top, knees and hips bent.',
      wrong: 'Side view, landing on the box. Both feet are on the box top, the knees straight and locked.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'quads', plain: 'The quads straighten the knees to drive the jump.' }],
  secondary: [
    { muscleId: 'glutes', plain: 'The glutes straighten the hips.' },
    { muscleId: 'calves', plain: 'The calves extend the ankles.' },
  ],
  watch: [],
  // The card's first row (thighs, hips and calves, c12) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in your thighs, hips and calves.',
  rows: [
    { key: 'knee', where: 'Very painful, locking or giving-way knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not a training feeling.',
      fix: 'Stop jumping.',
      redFlag: 'knee', claim: CL.c15 },
    { key: 'ankle', where: "Severe ankle pain, or can't walk", at: { parts: ['foot-left', 'foot-right'] },   // no ankle part: the feet
      means: 'Not a training feeling.',
      fix: 'Stop jumping.',
      redFlag: 'ankle', claim: CL.c14 },
  ],
  claim: CL.c12,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'straight', title: 'Landing with straight knees', zoom: 'landing-knees', claim: CL.c5,
    fix: 'Land with the knees bent.' },
  { key: 'jump-down', title: 'Jumping down off the box', claim: CL.c6,
    fix: 'Step down.' },
  { key: 'tired', title: 'Jumping on tired legs', claim: CL.c11,
    fix: 'Stop the set. Keep reps low with full rest.' },
];
const RISKS = [
  { key: 'box-high', text: 'Box too high: the landing suffers and injury risk rises.', claim: CL.c7 },
  { key: 'landing', text: 'Landing with straight knees or unevenly.', claim: C(['CONSENSUS'], [NASM], 'c5, c13') },
  { key: 'jump-down', text: 'Jumping down, or jumping while fatigued.', claim: C(['CONSENSUS'], [NASM, CAT], 'c6, c11') },
];

export default {
  schema: 1,
  id: 'lib_box_jump',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none' },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Sturdy box well below your maximum. Beginners start at 12-18 inches.',
      claim: C(['CONSENSUS'], [CAT, NASM], 'c1, c7, c8') },
    { kind: 'position', text: 'Stand facing it, feet about hip width.', claim: CL.c1 },
    { kind: 'brace', text: 'Brace, bend knees and hips, swing the arms back.', claim: CL.c2 },
    { kind: 'position', text: 'Drive up, lift the feet, land on both feet, knees bent.', zoom: 'landing-knees',
      claim: C(['CONSENSUS'], [NASM, CAT], 'c3, c4, c5') },
    { kind: 'finish', text: 'Step down, reset, rest between reps.', claim: C(['CONSENSUS'], [NASM], 'c6, c17') },
  ],
  posture: [
    { key: 'brace', label: 'Trunk braced', detail: 'Trunk braced before the jump.',
      anchor: { landmark: 'lumbar', pose: 'start' }, claim: CL.c2 },
    { key: 'feet', label: 'Both feet', detail: 'Both feet land together on the box.',
      anchor: { landmark: 'sole.r', pose: 'end' }, claim: CL.c4 },
    { key: 'knees', label: 'Knees bent', detail: 'Knees bent on landing.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'landing-knees', claim: CL.c5 },
    // card zoom box-height (c7) as a text checkpoint (see the header): the plate draws no mid-air body.
    { key: 'box', label: 'Low box', detail: 'Low box, landing well above it with room to spare.',
      anchor: { landmark: 'sole.r', pose: 'end' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['landing-knees', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Sturdy box well below your maximum. Stand facing it, feet about hip width.',
    mistakeLine: 'Never land with straight knees. Step down, never jump down.',
    cueLine: 'Knees bent on landing.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['knee', 'ankle'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/box_jump.json', rev: 1 },
};
