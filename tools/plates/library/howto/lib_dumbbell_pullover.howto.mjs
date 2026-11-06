// LIB-SHIP W4: the How-to content of lib_dumbbell_pullover (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_pullover.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `cupped-dumbbell` (c3, c13) has no key: hand-cupped.mjs has no pullover variant and no card gives a number for the
// cradle pose. Its Right is the grip line and setup step 4, its Wrong the `tilted-flat` fault's alt (c13).
// The card's grip claims are full (c3, c13): thumb, contact and width come from c3; the wrist is `exempt` (c13 says let the
// dumbbell hang naturally and gives no range).
// Card zoom `elbow-bend-constant` (c6, c7): its Wrong is the plate's own Mistake (`bend`, the card's topFault).
// Way out (tier A): the card's way out (c10: a spotter takes the dumbbell, or it comes back to the thigh, held until it
// rests there) is the letting-go mistake; the spotter over the face is the first risk.
// Red flags: the card's redFlags (shoulder, elbow), golden B's shared boxes.
import plateSpec from '../specs/dumbbell_pullover.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bm-pullover': { cite: 'How to Do the Dumbbell Pullover for Upper Body Muscle and Mobility (Breaking Muscle, Dr. Merrick Lincoln)', url: 'https://breakingmuscle.com/dumbbell-pullover/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-pullover': { cite: 'How to Do Dumbbell Pullover: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-pullover/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  // The shared boxes' own sources (layers/howto/shared.mjs), as golden B lists them: the card's redFlags.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c15 and c17 (chest/lat balance, barbell data and how-it-is-done; no field restates them), c18 (tempo, a plate
// drawing convention). marchetti2011 and teixeira2022 are cited only by those claims, so they are not listed.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BM = 'bm-pullover';
const CL = {
  c1: C(['CONSENSUS'], [BM], 'c1'),
  c3: C(['CONSENSUS'], [BM], 'c3'),
  c4: C(['CONSENSUS'], [BM], 'c4'),
  c5: C(['CONSENSUS'], [BM, 'strengthlog-pullover'], 'c5'),
  c6: C(['CONSENSUS'], [BM], 'c6'),
  c7: C(['CONSENSUS'], [BM], 'c7'),
  c8: C(['CONSENSUS'], [BM], 'c8'),
  c9: C(['CONSENSUS'], [BM], 'c9'),
  c10: C(['CONSENSUS'], [BM], 'c10'),
  c13: C(['CONSENSUS'], [BM], 'c13'),
  c14: C(['CONSENSUS', 'WEAK'], [BM], 'c14'),
  c16: C(['CONSENSUS'], [BM], 'c16'),
  c19: C(['DATA'], ['kerr2010'], 'c19'),
  c21: C(['CONSENSUS'], [BM], 'c21'),
  head: C(['CONSENSUS'], [BM], 'c2, c1'),
  cradle: C(['CONSENSUS'], [BM], 'c3, c11'),
  grip: C(['CONSENSUS'], [BM], 'c3, c13'),
  face: C(['CONSENSUS'], [BM], 'c10, c11'),
  jumps: C(['CONSENSUS'], [BM, 'acsm2009'], 'c12'),
  bend: C(['CONSENSUS'], [BM], 'c6, c7'),
  shoulder: C(['DATA', 'CONSENSUS'], ['kolber2010', BM, 'strengthlog-pullover'], 'c20, c5'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (dumbbell over the upper chest, c4), the end (arms back over the head at the
// same bend, c5, c6) and the spec's Mistake merged over the end, as the engine draws it (card plate.mistake, c7: the
// elbows bend a lot). The card zoom elbow-bend-constant Wrong is the plate's drawn fault, so no drawing value is added.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  bend: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `cupped-dumbbell` (D-SHIP-HANDW4, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'elbow-bend-constant', chip: 'Elbow bend', heading: 'Elbow bend', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake dashed over the end pose, as `stills.bend`. Anchors: the plate's callout and tell `bend`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Same bend', anchor: 'elbow.r' },
      wrong: { text: 'Elbows bend', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Arms nearly straight, same slight bend all the way.',   // c6
      wrong: 'Elbows deeply bent, like a skull crusher.',            // c7
    },
    alt: {
      right: 'Side view, bottom of the rep. Arms back over the head, nearly straight, at the starting elbow bend.',
      wrong: 'Side view, bottom of the rep. The elbows bend a lot and the dumbbell comes in close to the head.',
    },
    feelRow: 'triceps',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats work through a stretch.' },
    { muscleId: 'chest', plain: 'The lower chest works too.' },
  ],
  secondary: [{ muscleId: 'triceps', plain: 'The long head of the triceps helps.' }],
  watch: [],
  feelLine: 'You should feel this as a stretch in your lats and lower chest.',
  rows: [
    // The card's first row (lats and lower chest, side stretch) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'triceps', where: 'Mostly the backs of the arms', at: { muscles: ['triceps'] },
      means: 'Bending and straightening the elbows can move work to the triceps.',
      fix: 'Keep the elbow bend the same.',
      zoom: 'elbow-bend-constant', claim: CL.c6 },
    { key: 'elbow', where: 'Pain inside the elbow', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Too much bend with flared elbows may stress the inner elbow.',
      fix: "Stop and don't train through the pain. Keep elbows pointing forward or up.",
      redFlag: 'elbow', claim: CL.c14 },
    { key: 'shoulder', where: 'Shoulder pain at the bottom', at: { muscles: ['front_delts'] },
      means: '',   // D-FEEL-NOMEANS: c5 and c20 give no cause for this pain at the card's strength (SWEEP 1)
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.shoulder },
  ],
  claim: CL.c16,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'bend', title: 'Elbows bending into triceps extension', zoom: 'elbow-bend-constant', claim: CL.c7,
    fix: 'Keep the same slight bend all the way.' },
  { key: 'hips', title: 'Hips rising off the bench', claim: CL.c8,
    fix: 'Dig your heels in, brace, stop where shoulder range ends.' },
  { key: 'let-go', title: 'Letting go too early', claim: CL.c10,
    fix: 'Grip until the spotter has it or it rests on your thigh.' },
];
const RISKS = [
  { key: 'face', text: 'Dumbbell over the face: grip it securely and use a spotter.', claim: CL.face },
  { key: 'dropped', text: 'In US hospital data, dropped weights are the top cause of lifting injuries.', claim: CL.c19 },
  { key: 'jumps', text: 'Small weight jumps load the shoulders hard. Start light, add weight in small steps.', claim: CL.jumps },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_pullover',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: cupped-dumbbell has no key (hand-cupped.mjs has no pullover variant) and no card number for the cradle pose; the grip copy carries c3 and c13.',
    // No orientation: both palms cradle the top plate (c3), neither pronated nor supinated.
    handle: 'dumbbell',        // the spec's engine dumbbell primitive
    overBody: true,            // c10: the dumbbell passes over the face
    width: { text: 'Both hands on one dumbbell, one palm each side.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: CL.c3 },   // c3: a closed grip, thumbs overlapping behind the handle
    contact: 'cupped',         // c3: the handle between the base of the thumbs and the body of the hands, palms cradling
    // c13: let the dumbbell hang naturally; no source gives a wrist range or angle.
    wrist: { exempt: 'c13: the dumbbell hangs naturally; no source gives a wrist range.', claim: CL.c13 },
    faults: [
      // card zoom wrong (c13). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'tilted-flat', label: 'Dumbbell tilted', pose: {}, markers: [], alt: 'Dumbbell tilted flat, held by the wrists.' },
    ],
    // c3, c13; the card zoom's Right ("Palms cradle the top plate, thumbs overlapping, dumbbell hanging vertically").
    gripLine: 'Palms cradle the top plate, thumbs overlapping behind the handle. Let it hang vertically, not tilted flat by the wrists.',
    cue: 'Cradle the plate, grip securely.',   // c3, c11
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'position', text: 'Head as far up the bench as possible, feet flat.', claim: CL.head },
    // card posture point c9 (D-TEXT-PRINTED: posture details are not printed)
    { kind: 'brace', text: 'Keep five points of contact. Head neutral, eyes on the ceiling.', claim: C(['CONSENSUS'], [BM], 'c1, c9') },
    { kind: 'get-in', text: 'Take the dumbbell from a spotter, or lift it from your thigh.', claim: CL.c21 },
    { kind: 'grip', text: 'Cradle the top plate, thumbs overlapping behind the handle. Grip it securely.', claim: CL.cradle },
    { kind: 'position', text: 'Dumbbell above your upper chest, arms vertical, elbows slightly bent.', zoom: 'elbow-bend-constant', claim: CL.c4 },
  ],
  posture: [
    { key: 'contact', label: 'Five points', detail: 'Head, shoulder blades and buttocks on the bench, both feet on the floor.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c1 },
    { key: 'bend', label: 'Same elbow bend', detail: 'Same slight elbow bend throughout.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'elbow-bend-constant', claim: CL.c6 },
    { key: 'hips', label: 'Hips down', detail: 'Hips on the bench, heels down, abs braced.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c8 },
    { key: 'head', label: 'Head neutral', detail: 'Head neutral, eyes on the ceiling.',
      anchor: { landmark: 'head', pose: 'end' }, claim: CL.c9 },
    { key: 'hang', label: 'Dumbbell hangs', detail: 'Dumbbell hangs naturally. Lower only to a stretch you control.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: C(['CONSENSUS'], [BM, 'strengthlog-pullover'], 'c13, c5') },
  ],
  feel,
  zooms,
  chips: ['elbow-bend-constant', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Head high on the bench, five points of contact. Dumbbell above your upper chest.',
    mistakeLine: 'Keep the same slight elbow bend. Never turn it into a triceps extension.',
    cueLine: 'Same elbow bend.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'elbow'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_pullover.json', rev: 1 },
};
