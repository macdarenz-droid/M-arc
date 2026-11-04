// LIB-SHIP W2: the How-to content of lib_crunch (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/crunch.json; its claim ids are named on each field's claim. Its row stays in
// tools/plates/library/pilot-b2/rows.json.
// Handling: none (card grip note: hand archetype none, no hand zoom). The card's grip.handContact (the hand options,
// c2) is setup step 2.
// No variant line (equipment 'Bodyweight').
import plateSpec from '../specs/crunch.mjs';
import { fk, resolve, normPose } from '../engine.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-crunch': { cite: 'Crunch, Exercise Library (ACE)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/52/crunch/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'sl-crunch': { cite: 'How to Do Crunches: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/crunch/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'bb-crunch': { cite: 'How to Do Crunches: Proper Form, Variations, & Benefits (BarBend)', url: 'https://barbend.com/crunches/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'juker-1998': { cite: 'Quantitative intramuscular myoelectric activity of lumbar portions of psoas and the abdominal wall during a wide variety of tasks.', url: 'https://pubmed.ncbi.nlm.nih.gov/9502361/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-02', use: 'DATA' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-crunch', SL = 'sl-crunch', BB = 'bb-crunch';
const CL = {
  c1: C(['CONSENSUS'], [ACE, BB], 'c1'),
  c2: C(['CONSENSUS'], [BB, SL, ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [BB], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], [BB], 'c7'),
  c8: C(['CONSENSUS'], [BB], 'c8'),
  hips: C(['CONSENSUS', 'DATA'], [ACE, 'juker-1998'], 'c6, c10'),
  jerk: C(['CONSENSUS'], [ACE], 'c6, c3'),
  chin: C(['CONSENSUS'], [BB, SL, ACE], 'c2, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses:
//   lowback (card zoom low-back Wrong, c3, c6): the spec's Mistake pose (the plate's drawn fault: the pelvis tips forward
//            and the low back lifts as the hip flexors jerk the trunk up).
//   pulled  (card zoom chin Wrong, c2, c7 "hands pulling the head forward"): the end pose with the neck flexed NECK_PULL
//            deg further (the head pulled forward) and both hands behind the head, at HEAD_BACK in the head's own frame
//            (beside the spec's OCCIPUT point), elbows out to the sides (reach IK).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): NECK_PULL 20 deg
// (lib_plank's SAG 20 deg Wrong size), HEAD_BACK and HAND_POLE size the chin Wrong; no card gives them, no number from
// them appears in user copy; the layers panel judges them.
const H = 1.75, BODY = { height: H }, END = plateSpec.poses.end;
const NECK_PULL = 20, HEAD_BACK = [0.04, 0.94, -0.075], HAND_POLE = [1, 0.3, 0.3];
const headOf = p => fk(resolve(normPose(p, BODY), BODY).q, BODY).head;
const PULLED = (() => {
  const p = { ...END, neck: END.neck + NECK_PULL }, head = headOf(p), at = s => head([s * HEAD_BACK[0], HEAD_BACK[1], HEAD_BACK[2]]);
  return { neck: p.neck, reach: { l: { at: at(1), pole: HAND_POLE }, r: { at: at(-1), pole: [-HAND_POLE[0], HAND_POLE[1], HAND_POLE[2]] } } };
})();
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  lowback: { pose: { ...END, ...MIS } },
  pulled: { pose: { ...END, ...PULLED } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. Zoom shell shape (callout with an anchor at the landmark it names, no guide
// mark; pilot-a.closeups.mjs); each Wrong is its still drawn alone (solid).
const zooms = [
  {
    key: 'low-back', chip: 'Low back', heading: 'Low back', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, -30] }, sizePx: 140 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Back down', anchor: 'lumbar' },
      wrong: { text: 'Back lifts', anchor: 'lumbar' },
    },
    caption: {
      right: 'Low back and tailbone on the mat, upper back lifted.',
      wrong: 'Pelvis tipped forward, low back lifting.',
    },
    alt: {
      right: 'Side view, top of the crunch. The shoulder blades are off the floor. The low back and tailbone stay on the mat.',
      wrong: 'Side view, top of the crunch. The pelvis tips forward and the low back lifts off the mat.',
    },
    feelRow: 'hips',
  },
  {
    key: 'chin', chip: 'Chin', heading: 'Chin position', kind: 'posture',
    crop: { center: { at: 'chin', pose: 'right', off: [0, 0] }, sizePx: 140 },
    right: 'end',
    wrong: { base: 'end', pose: PULLED, solid: true },
    callout: {
      right: { text: 'Chin set', anchor: 'chin' },
      wrong: { text: 'Head pulled', anchor: 'chin' },
    },
    caption: {
      right: 'Chin slightly tucked, hands light or arms crossed.',
      wrong: 'Hands pulling the head forward.',
    },
    alt: {
      right: 'Side view, top of the crunch. Arms crossed over the chest, chin slightly tucked and held.',
      wrong: 'Side view, top of the crunch. Hands behind the head pull it forward, chin pressed down.',
    },
    feelRow: 'neck',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'abs', plain: 'The abs at the front of the belly do the curl.' }],
  secondary: [{ muscleId: 'obliques', plain: 'The sides of the belly may help.' }],
  watch: [{ muscleId: 'hip_flexors', plain: 'The hip flexors help when you curl up fast.' }],
  feelLine: 'You should feel this in the front of your belly.',
  rows: [
    // The card's first row (front of the belly) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'hips', where: 'Front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'Your hip flexors are helping.',
      fix: 'Slow down. Keep your low back on the mat.',
      zoom: 'low-back', claim: CL.hips },
    { key: 'neck', where: 'Neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Your neck or arms are pulling.',
      fix: 'Set your chin once. Cross your arms.',
      zoom: 'chin', claim: CL.c7 },
    { key: 'low-back', where: 'Low back', at: { muscles: ['lower_back'] },
      means: 'Pelvis tipping forward from a fast, hip-led curl.',
      fix: 'Slow down. Keep your low back on the mat.',
      redFlag: 'back', claim: CL.c6 },
  ],
  libraryDiff: { add: ['obliques'], why: 'StrengthLog lists the obliques as secondary (card c9).' },
  claim: C(['CONSENSUS'], [SL, BB], 'c9'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'low-back', text: 'A fast, hip-led crunch adds stress on the low back.', claim: CL.c6 },
];

export default {
  schema: 1,
  id: 'lib_crunch',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b2): the card archetype.hand is none; its handContact (c2) is on the setup line.' },
  contacts: ['floor-body'],
  setup: [
    { kind: 'position', text: 'Lie on your back, knees bent, feet flat and hip-width apart.', claim: CL.c1 },
    { kind: 'position', text: 'Arms crossed on your chest, or fingertips light by your ears.', zoom: 'chin', claim: CL.c2 },
    { kind: 'position', text: 'Tuck your chin slightly and keep it there.', zoom: 'chin', claim: CL.c7 },
  ],
  posture: [
    { key: 'curl', label: 'Ribs to hips', detail: 'Breathe out and curl your ribs toward your hips.', anchor: { landmark: 'sternum', pose: 'end' }, claim: CL.c3 },
    // Q-W2-12: handlingMistake 'Sitting all the way up' (c4) merged here; its fix is this detail and its claim is this claim
    { key: 'blades', label: 'Shoulder blades up', detail: 'Stop once your shoulder blades leave the floor.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c4 },
    // Q-W2-12: handlingMistake 'Jerking up fast with the hip flexors' (c6, c3) merged here, its fix added
    { key: 'low-back', label: 'Low back down', detail: 'Low back, tailbone and feet stay on the mat. Curl slowly.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'low-back', claim: CL.jerk },   // CL.jerk (c6, c3) covers c3
    // Q-W2-12: handlingMistake 'Pulling on your head' (c7) merged here, its fix added
    { key: 'chin', label: 'Chin set', detail: "Chin slightly tucked and held. The neck doesn't pull. Cross your arms over your chest.",
      anchor: { landmark: 'chin', pose: 'end' }, zoom: 'chin', claim: CL.c7 },
    { key: 'shoulders', label: 'Shoulders relaxed', detail: 'Shoulders relaxed. Only your abs curl.', anchor: { landmark: 'shoulder.r', pose: 'end' }, claim: CL.c8 },
    { key: 'uncurl', label: 'Slow uncurl', detail: 'Breathe in and uncurl slowly.', anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c5 },
  ],
  feel,
  zooms,
  chips: ['low-back', 'chin', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie on your back, knees bent, feet flat. Cross your arms over your chest.',
    mistakeLine: "Curl slowly and keep your low back on the mat. Don't jerk up with your hips.",
    cueLine: 'Ribs toward your hips.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/crunch.json', rev: 1 },
};
