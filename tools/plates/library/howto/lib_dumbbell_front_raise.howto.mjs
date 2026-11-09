// LIB-SHIP W6: the How-to content of lib_dumbbell_front_raise (golden B's HowToContent shape, as
// tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs). Every shown string restates a claim of the verified
// card docs/research/howto/cards/dumbbell_front_raise.json; its claim ids are named on each field's claim.
// Family: a difference card of dumbbell_lateral_raise with inherit [] (card notes: every shown line uses this card's
// own claims), so no field is inherited and no INHERIT_MAP entry applies.
// No hand zoom (D-SHIP-HANDW6, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom `dfr-hand-top`
// (c1, c7, c9; Wrong null) has no pair key. Its hand claims (closed grip, palms down, thumbs around the handles, inside
// edge slightly up near the top, wrist straight) live in handling (gripLine, limitText), with the width (c6).
// GRIP (c) (Q-W6-7, #393 6647923934): grip.handContact reads "Not given by any source read". The contact is golden B's
// hold default, this card's own parent dumbbell_lateral_raise (layers/exercises/dumbbell_lateral_raise.howto.mjs
// handling), DERIVED at import from the copied source line and cited CONVENTION (source hold-default), never shown
// (D-SHIP-CONVCOPY). The thumb is the card's c1, the wrist its c9.
// Card zooms: `dfr-hips` is the plate's own Mistake (topFault `swing`: the hips pushed forward, c12); `dfr-top-height`
// is a drawing value over the end pose (D-SHIP-DRAWVAL, below).
// Red flags: the card's redFlags (shoulder): golden B's shared shoulder box, linked by the two shoulder rows.
// No variant line (equipment 'Dumbbell').
import plateSpec, { SIZES } from '../specs/dumbbell_front_raise.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-front-raise': { cite: 'Front Raise (ACE exercise library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/54/front-raise/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-front-raise': { cite: 'Dumbbell Front Raise: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/dumbbellFrontRaise',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'bb-front-raise': { cite: 'How to Do the Dumbbell Front Raise for a Stronger Front Rack Position (BarBend, Mike Dewar)', url: 'https://barbend.com/dumbbell-front-raise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-front-raise': { cite: 'How to Do Dumbbell Front Raise: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/dumbbell-front-raise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-front-raise': { cite: 'Dumbbell Front Raise: Build Strong Deltoids & Upper Chest (Fitness Volt, Matthew Magnante)', url: 'https://fitnessvolt.com/dumbbell-front-raise/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  coratella2020: { cite: 'An Electromyographic Analysis of Lateral Raise Variations and Frontal Raise in Competitive Bodybuilders', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7503819/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  // golden B's hold archetype default (this card's parent) for the contact the card leaves unsourced: a convention.
  'hold-default': { cite: 'Golden B hold archetype default (dumbbell_lateral_raise handling: contact mid-palm)', url: 'tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c17 (side deltoid role, disputed), c19 and c20 (tempo, plate drawing values), c21 (Fitness Volt's neutral
// grip, not the drawn grip), c22 (the EMG protocol's arm position).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-front-raise', MO = 'mo-front-raise', BB = 'bb-front-raise', SL = 'sl-front-raise';
const CL = {
  c1: C(['CONSENSUS'], [ACE, MO, BB], 'c1'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE, BB], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['CONSENSUS'], [ACE, MO, SL, 'fv-front-raise'], 'c8'),
  c9: C(['CONSENSUS'], [ACE, MO], 'c9'),
  c13: C(['CONSENSUS'], [BB], 'c13'),
  c14: C(['CONSENSUS'], [SL, BB, MO], 'c14'),
  c15: C(['DATA'], ['coratella2020'], 'c15'),
  c18: C(['CONSENSUS'], [BB], 'c18'),
  hold: C(['CONSENSUS'], [ACE, MO], 'c1, c2'),
  move: C(['CONSENSUS'], [ACE, MO, BB], 'c5, c10, c11'),
  width: C(['CONSENSUS'], [BB, ACE, MO], 'c6, c2'),
  swing: C(['CONSENSUS'], [MO, BB], 'c12, c13'),
  hips: C(['CONSENSUS'], [MO, BB, ACE], 'c12, c4'),
  arch: C(['CONSENSUS'], [ACE, MO, BB], 'c9, c4'),
  lower: C(['CONSENSUS'], [ACE, MO, BB], 'c10, c11'),
  grip: C(['CONSENSUS'], [ACE, MO, BB], 'c1, c7'),
  raise: C(['CONSENSUS'], [ACE, BB], 'c4, c5'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c), Q-W6-7: the contact DERIVED at import from golden B's hold row, copied here (not imported: the golden file's
// closure pulls its render-only hand poses) and pinned against the live file by a test.
// dumbbell_lateral_raise.howto.mjs:123 reads `contact: 'mid-palm',`. A copied line that names no known zone throws.
const HOLD_CONTACT = "contact: 'mid-palm',";   // dumbbell_lateral_raise.howto.mjs:123
const CONTACTS = new Set(['heel', 'mid-palm', 'finger-base', 'fingertips', 'palm-flat', 'cupped']);   // content-types.ts HandContact
const CONTACT = HOLD_CONTACT.match(/^contact: '([a-z-]+)',$/)?.[1];
if (!CONTACTS.has(CONTACT)) throw new Error(`lib_dumbbell_front_raise: no hold contact default in ${HOLD_CONTACT}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses. 'swing' (card zoom dfr-hips Wrong, c12): the spec's Mistake merged over the end pose,
// as the engine draws it (the hips pushed forward, the trunk leaning back). 'high' (card zoom dfr-top-height Wrong, c8:
// "Dumbbells raised above shoulder height"): the end pose with the shoulders flexed past level, all else unchanged.
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_dumbbell_shoulder_press MIS_TILT): HIGH_FLEX 120 deg
// sizes the raise above the shoulder line (the end pose is the card's 90, c8); no card gives it, no number from it appears
// in user copy; the layers panel judges it. The arm's rotation and soft elbow are the spec's own (SIZES.ARM_ROT,
// SIZES.ELBOW_BEND), so only the shoulder flexion changes.
const HIGH_FLEX = 120;
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const HIGH = { shoulder: { flex: HIGH_FLEX, rot: SIZES.ARM_ROT }, elbow: SIZES.ELBOW_BEND };
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  swing: { pose: { ...END, ...MIS } },
  high: { pose: { ...END, ...HIGH } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `dfr-hand-top` (D-SHIP-HANDW6, above). The posture zooms are in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'dfr-top-height', chip: 'Top height', heading: 'Arm height', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre ahead of the right pose's shoulder, on the raised arm; the Wrong
    // is `stills.high` dashed over the end pose.
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [40, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: HIGH },
    callout: {
      right: { text: 'Shoulder height', anchor: 'grip.r' },
      wrong: { text: 'Above shoulders', anchor: { at: 'grip.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Arms level with the shoulders, parallel with the floor.',   // c8
      wrong: 'Dumbbells raised above shoulder height.',                   // c8
    },
    alt: {
      right: 'Side view, top of the raise. The arms are level with the shoulders, parallel with the floor.',
      wrong: 'Side view, top of the raise. The dumbbells rise above shoulder height.',
    },
  },
  {
    key: 'dfr-hips', chip: 'Hips', heading: 'Body still', kind: 'posture',
    // crop centre on the right pose's navel; the Wrong is the spec's Mistake dashed over the end pose, as `stills.swing`.
    crop: { center: { at: 'navel', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Hips still', anchor: 'navel' },
      wrong: { text: 'Hips forward', anchor: { at: 'navel', pose: 'mistake' } },
    },
    caption: {
      right: 'Body tall and still as the dumbbells rise.',     // c4, c12
      wrong: 'Hips pushed forward to swing the weights up.',   // c12
    },
    alt: {
      right: 'Side view, top of the raise. The body stands tall and still, hips over the feet.',
      wrong: 'Side view, top of the raise. The hips push forward and the trunk leans back to swing the weights up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders do the work.' }],
  secondary: [{ muscleId: 'upper_chest', plain: 'The upper chest works hard too.' }],
  watch: [],
  // The card's first two rows (front of the shoulders, upper chest; c15, c16) have no fix, so they are left out: the
  // feel line says them (D-SHIP-Q16).
  feelLine: 'You should feel this in the front of your shoulders and your upper chest.',
  rows: [
    { key: 'joints', where: 'Shoulder joints', at: { muscles: ['front_delts'] },
      means: 'Swinging the weights adds stress here.',
      fix: 'Use lighter dumbbells and lift without swinging.',
      zoom: 'dfr-hips', redFlag: 'shoulder', claim: CL.swing },
    // The card row's means is empty, so the row has none (D-FEEL-NOMEANS).
    { key: 'discomfort', where: 'Shoulder discomfort', at: { muscles: ['front_delts'] },
      fix: 'Stop. Go much lighter, or raise slightly out to the sides.',
      redFlag: 'shoulder', claim: CL.c18 },
  ],
  claim: CL.c15,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging the weights up', zoom: 'dfr-hips', claim: CL.swing,
    fix: 'Use lighter dumbbells. Keep your hips still.' },
  { key: 'arch', title: 'Arching the back', claim: CL.arch,
    fix: 'Brace and keep your torso upright.' },
  { key: 'high', title: 'Raising above shoulder height', zoom: 'dfr-top-height', claim: CL.c8,
    fix: 'Stop when your arms are level with your shoulders.' },
];
const RISKS = [
  { key: 'swing', text: 'Shoulder: swinging the weights adds extra stress to the shoulder joints.', claim: CL.c13 },
  { key: 'turn', text: 'Shoulder: a slight outward turn near shoulder height may reduce shoulder pinching.', claim: CL.c7 },
  { key: 'heavy', text: 'It is easy to pick a weight that is too heavy.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_front_raise',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: no pair key draws the card\'s hand zoom; the grip copy carries c1, c6, c7 and c9.',
    orientation: 'pronated',   // c1: closed, pronated grip, palms facing the thighs (palms down as the arms rise)
    handle: 'dumbbell',        // the spec's engine dumbbell primitive
    overBody: false,
    width: { text: 'Dumbbells in front of your thighs, shoulder-width apart as they rise.', claim: CL.width },
    thumb: { mode: 'wrapped', claim: CL.c1 },   // c1: thumbs around the handles
    contact: CONTACT,          // 'mid-palm', CONVENTION (Q-W6-7): golden B's hold default, derived above; never shown
    // c9: "wrists neutral", no flexion or extension. No degrees given; [0, 0] is that straight wrist, not a card number.
    wrist: { ext: [0, 0], limitText: 'Keep your wrists straight, not bent up or down.', claim: CL.c9 },
    faults: [],                // the card zoom's Wrong is null; the card names no hand fault
    // D-TEXT-PRINTED: posture width (c6) is shown here; handling.width.text is not printed.
    gripLine: 'Closed grip, palms down, thumbs around the handles, dumbbells shoulder-width apart. Near the top, turn the inside edge slightly up.',   // c1, c6, c7
    cue: 'Palms down, wrists straight.',   // c1, c9
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: 'Stand with feet slightly wider than hips, or in a split stance.', claim: CL.c3 },
    // D-TEXT-GOLDEN: card setup step 3 (c1, c2) joined to step 2; its thumbs (c1) are also in gripLine.
    { kind: 'grip', text: 'Dumbbells in front of your thighs, palms facing them. Elbows slightly bent.', claim: CL.hold },
    { kind: 'brace', text: 'Brace your torso and pull your shoulders down and back.', zoom: 'dfr-hips', claim: CL.c4 },
    { kind: 'load', text: 'Pick a lighter weight than you think.', claim: CL.c14 },
    // D-TEXT-GOLDEN, D-TEXT-PRINTED: posture raise and lower (c5, c10, c11), unprinted in copy and posture, shown here.
    { kind: 'brace', text: 'Breathe out, raise slowly. Breathe in, lower slowly, not onto your thighs.', claim: CL.move },
  ],
  posture: [
    { key: 'raise', label: 'Raise slowly', detail: 'Breathe out and raise the dumbbells slowly in front of you.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c5 },
    { key: 'width', label: 'Shoulder-width', detail: 'Keep them shoulder-width apart, elbows slightly bent.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.width },
    { key: 'turn', label: 'Edge up', detail: 'Near shoulder height, turn the inside edge of the dumbbells slightly up.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c7 },
    { key: 'height', label: 'Shoulder height', detail: 'Stop when your arms are level with your shoulders.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'dfr-top-height', claim: CL.c8 },
    { key: 'torso', label: 'Torso upright', detail: 'Torso upright, no arch in the low back. Wrists straight.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'dfr-hips', claim: CL.c9 },
    { key: 'lower', label: 'Lower slowly', detail: "Breathe in and lower slowly. Don't rest them on your thighs.",
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.lower },
  ],
  feel,
  zooms,
  chips: ['dfr-top-height', 'dfr-hips', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    // Not printed on the layers page (D-TEXT-PRINTED): posture 'raise' and 'lower' (c5, c10, c11) are in setup step 5.
    setupLine: 'Brace, shoulders down and back. Breathe out and raise the dumbbells slowly in front of you.',
    mistakeLine: "Breathe in and lower slowly. Don't rest the dumbbells on your thighs.",
    cueLine: 'Stop at shoulder height.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_front_raise.json', rev: 1 },
};
