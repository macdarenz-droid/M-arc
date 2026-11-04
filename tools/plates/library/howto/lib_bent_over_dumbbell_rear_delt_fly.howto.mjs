// LIB-SHIP W2: the How-to content of lib_bent_over_dumbbell_rear_delt_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/bent_over_dumbbell_rear_delt_fly.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW2, Q-W2-5): the card's hand zoom `rdfly-grip` has no pair key variant that draws its neutral
// dumbbell hold, and no per-id pose is drawn without every number (ruling 8); the id is on
// tools/plates/library/hands/no-zoom.json. The card's grip claims (palms facing, thumb wrapped, handle across the middle
// of the palm, light grip, wrist neutral; grip.claims c12, c7) live in handling and setup step 4. The hand zoom's Wrong
// ("Elbow bending more as the weight rises", c2) is an elbow fault, not a hand one: it is posture checkpoint `elbows`,
// so no hand fault is listed.
// Plate: the spec draws the SIDE view (F6, D-LIB8R-FLIES: the card's front view does not read); the crop is in the
// plate's own view. Red flag: the card's redFlags (back), LIB-5's back box (shared/back-box.mjs), linked by the
// lower-back row's redFlag: 'back'.
import plateSpec from '../specs/bent_over_dumbbell_rear_delt_fly.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-reverse-fly': { cite: 'How to Do Reverse Dumbbell Flyes: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/reverse-dumbbell-flyes/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  schoenfeld2013: { cite: 'Effect of hand position on EMG activity of the posterior shoulder musculature during a horizontal abduction exercise.', url: 'https://pubmed.ncbi.nlm.nih.gov/23302754/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'ace-incline-reverse-fly': { cite: 'ACE Exercise Library: Incline Reverse Fly', url: 'https://www.acefitness.org/resources/everyone/exercise-library/34/incline-reverse-fly/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: zhu2025 (c8, model study), acsm2009 (c10 tempo, c11 load steps; no field here restates them).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-reverse-fly', ACE = 'ace-incline-reverse-fly';
const CL = {
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c12: C(['CONSENSUS', 'MECH'], [ACE], 'c12'),
  swing: C(['CONSENSUS'], [SL], 'c5, c4'),
  grip: C(['CONSENSUS', 'MECH', 'DATA'], [ACE, 'schoenfeld2013'], 'card grip (type, width, thumb, handContact, wrist), grip.claims c12, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// 'rounded' (card zoom rdfly-hinge Wrong, c2/c4/c5: "Rounded back"): the spec's start pose with the lumbar spine flexed
// ROUND deg more and the pelvis tilted ROUND deg less, so the thorax keeps the spec's own inclination and only the back
// shape changes; the feet stay planted and each hand target moves with its shoulder, so the arms still hang the same.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's SAG 20 deg): ROUND 20 deg is a
// Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, ROUND = 20;
const START = plateSpec.poses.start;
const rounded = (() => {
  const body = { root: { ...START.root, tilt: START.root.tilt - ROUND }, trunk: START.trunk + ROUND };
  const L0 = landmarksOf(START, H), L1 = landmarksOf({ ...START, ...body }, H), reach = {};
  for (const s of ['l', 'r']) {
    const d = [0, 1, 2].map(i => L1[`shoulder.${s}`][i] - L0[`shoulder.${s}`][i]);
    reach[s] = { ...START.reach[s], at: START.reach[s].at.map((v, i) => v + d[i]) };
  }
  return { ...body, reach };
})();
export const stills = {
  start: { pose: START },
  end: { pose: plateSpec.poses.end },
  rounded: { pose: { ...START, ...rounded } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `rdfly-grip` (D-SHIP-HANDW2, above). The zoom shell's shape (callout with an
// anchor at the landmark it names; pilot-a.closeups.mjs), as the curl's curl-elbow; the Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'rdfly-hinge', chip: 'Back', heading: 'Hip hinge', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'start',
    wrong: { base: 'start', pose: rounded, solid: true },
    callout: {
      right: { text: 'Spine straight', anchor: 'backMid' },
      wrong: { text: 'Rounded back', anchor: 'backMid' },
    },
    caption: {
      right: 'Hinged at the hips, spine straight, torso still.',
      wrong: 'Rounded back, torso bobbing up each rep.',
    },
    alt: {
      right: 'Side view, arms hanging. The lifter is hinged forward at the hips, spine straight, knees soft.',
      wrong: 'Side view, arms hanging. The back is rounded, the spine curved instead of straight.',
    },
    feelRow: 'lower-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'rear_delts', plain: 'The rear delts, at the back of the shoulders, are the main movers.' }],
  secondary: [
    { muscleId: 'mid_back', plain: 'The trapezius between the shoulder blades helps.' },
    { muscleId: 'rotator_cuff', plain: 'The rotator cuff also moves the arm.' },   // text only (C2 NO_REGION, card libraryDiff)
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Swinging stresses the lower back.' }],
  // The card's first row (back of the shoulders, c6) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in the back of your shoulders.',
  rows: [
    { key: 'top-shoulders', where: 'Top of the shoulders', at: { muscles: ['upper_traps'] },
      means: 'Shrugging the shoulders.',
      fix: 'Keep the shoulders down.',
      claim: CL.c3 },
    { key: 'lower-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Fault: swinging from the hips adds stress here.',
      fix: 'Go lighter and keep the torso still.',
      zoom: 'rdfly-hinge', redFlag: 'back', claim: CL.swing },
  ],
  claim: CL.c6,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging the torso', zoom: 'rdfly-hinge', claim: CL.swing,
    fix: 'Go lighter and move slowly.' },
  { key: 'shrug', title: 'Shrugging the shoulders', claim: CL.c3,
    fix: 'Keep them down and squeeze the shoulder blades together.' },
  { key: 'past', title: 'Raising past body level', claim: C(['CONSENSUS', 'MECH'], [SL, ACE], 'c3, c9'),
    fix: 'Stop at about body level.' },
];
const RISKS = [
  { key: 'swing', text: 'Swinging the weights up can stress the lower back and shoulders.', claim: CL.c5 },
];

export default {
  schema: 1,
  id: 'lib_bent_over_dumbbell_rear_delt_fly',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-HANDW2: no pair key variant draws this card\'s neutral dumbbell hold; the grip copy carries the card\'s grip claims (c12, c7).',
    orientation: 'neutral',    // card grip.type: palms facing each other (c12, c7)
    handle: 'dumbbell',        // card grip.type: one dumbbell per hand
    width: { text: 'Arms hang under the shoulders.', claim: CL.grip },
    thumb: { mode: 'wrapped', claim: CL.grip },   // card grip.thumb: wrapped around the handle
    contact: 'mid-palm',       // card grip.handContact: handle across the middle of the palm, light grip
    // card grip.wrist: "Neutral, in line with the forearm". The card gives no tolerance, so the range is neutral itself.
    wrist: { ext: [0, 0], limitText: 'Wrist neutral, in line with the forearm.', claim: CL.grip },
    faults: [],                // the card zoom's Wrong is an elbow fault (posture 'elbows'); no hand fault is drawn
    gripLine: 'Palms facing, handle across the middle of the palm, light grip. Wrist in line with the forearm.',
    cue: 'Palms facing, elbows slightly bent.',   // card zoom rdfly-grip right (c2, c12)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'load', text: 'Pick light dumbbells.', claim: CL.c4 },
    { kind: 'position', text: 'Feet about hip width.', claim: CL.c2 },
    { kind: 'brace', text: 'Hinge forward at the hips, spine straight, core braced.', zoom: 'rdfly-hinge', claim: CL.c2 },
    { kind: 'grip', text: 'Let the arms hang, elbows slightly bent, palms facing.', claim: CL.c12 },
  ],
  posture: [
    { key: 'torso', label: 'Torso still', detail: 'Keep the torso still. No swing from the hips or lower back.',
      anchor: { landmark: 'backUpper', pose: 'start' }, zoom: 'rdfly-hinge', claim: CL.c4 },
    // card zoom rdfly-grip (c2, c12), Wrong "Elbow bending more as the weight rises": no hand zoom (header)
    { key: 'elbows', label: 'Same elbow bend', detail: 'Same elbow bend all set. It never bends more as the weight rises.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: C(['CONSENSUS', 'MECH'], [SL, ACE], 'c2, c12') },
    { key: 'level', label: 'Body level', detail: 'Stop at about body level.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c3 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down. Squeeze the shoulder blades.',
      anchor: { landmark: 'shoulderTop.r', pose: 'end' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['rdfly-hinge', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Hinge forward at the hips, spine straight. Let the arms hang, elbows slightly bent, palms facing.',
    mistakeLine: 'Never swing the torso to throw the weights up. Go lighter and move slowly.',
    cueLine: 'Stop at about body level.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/bent_over_dumbbell_rear_delt_fly.json', rev: 1 },
};
