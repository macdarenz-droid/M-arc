// LIB-SHIP W4: the How-to content of lib_arnold_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/arnold_press.json; its claim ids are named on each field's claim.
// Family (D-SHIP-FAMILY, INHERIT_MAP lib_arnold_press): the card's inherit[] delegates grip.thumb, grip.wrist,
// setup.spotter and zooms.seat-back-contact to dumbbell_shoulder_press. Those paths (handling.thumb.mode, handling.wrist,
// setup[kind=safety], and the seat-back-contact zoom's key, kind, chip, heading, callout texts and captions; D-SHIP-W4-
// PADZOOM) are written leaf-equal to the parent's shipped sheet (family.mjs familyRefusal, `===`); each claim cites this
// card (c10, c15, c3), not the parent. The zoom's crop, poses, anchors and alt are this plate's own: its Wrong is this
// plate's own Mistake (key `arch`, the card's topFault), never the parent's built arch.
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `arnold-palm-turn` (c1) is a palm turn during the rep; no key draws a rotating grip and no card gives the turn angles.
// It is a placement zoom, so both halves are text: Right in setup step 3, Wrong in the grip line (c1).
// Way out (tier A): the spotter line (c10, setup[kind=safety]) is shown; the set-down is the shared dumbbell-kickup card's
// seated variant (docs/research/howto/shared/dumbbell-kickup.json), not repeated here.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec from '../specs/arnold_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'strengthlog-arnold': { cite: 'How to Do Arnold Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/arnold-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'gymgroup-arnold': { cite: 'How to Do an Arnold Press (The Gym Group)', url: 'https://www.thegymgroup.com/exercises/arms-and-shoulders-exercises/how-to-do-an-arnold-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'fitfather-arnold': { cite: 'Arnold Press: Video Tutorial and Exercise Guide (The Fit Father Project, Stuart Carter)', url: 'https://www.fitfatherproject.com/arnold-press-tutorial',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-seated-ohp': { cite: 'Seated Overhead Press (dumbbell), ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/45/seated-overhead-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  saeterbakken2013: { cite: 'Effects of body position and loading modality on muscle activity and strength in shoulder presses', url: 'https://pubmed.ncbi.nlm.nih.gov/23096062/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c12 (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'strengthlog-arnold', GG = 'gymgroup-arnold', FF = 'fitfather-arnold', ACE = 'ace-seated-ohp';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c3: C(['CONSENSUS'], [GG], 'c3'),
  c4: C(['CONSENSUS'], [FF], 'c4'),
  c5: C(['CONSENSUS'], [FF], 'c5'),
  c6: C(['CONSENSUS'], [FF], 'c6'),
  c7: C(['CONSENSUS'], [GG], 'c7'),
  c10: C(['CONSENSUS', 'MECH'], [ACE], 'c10; inherited setup.spotter (card inherit[], INHERIT_MAP)'),
  c11: C(['CONSENSUS'], ['acsm2009'], 'c11'),
  c13: C(['DATA'], ['kolber2010'], 'c13'),
  c14: C(['DATA'], ['kerr2010'], 'c14'),
  c15: C(['CONSENSUS', 'MECH'], [ACE], 'c15; inherited grip.thumb, grip.wrist (card inherit[], INHERIT_MAP)'),
  grip: C(['CONSENSUS', 'MECH'], [SL, ACE, FF], 'c1, c15, c16'),
  bench: C(['CONSENSUS'], [GG, FF], 'c2, c3'),
  feel: C(['CONSENSUS', 'WEAK', 'MECH'], [SL, FF, 'saeterbakken2013'], 'c8, c9'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (arms straight overhead, c1) and the spec's Mistake merged over it, as the
// engine draws it (card plate.mistake, c3: the back raised off the pad as the dumbbells go up). The card zoom
// seat-back-contact Wrong ("Low back arched off the pad") is this plate's drawn fault, so no drawing value is added.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `arnold-palm-turn` (D-SHIP-HANDW4, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    // key, kind, chip, heading, callout texts and captions: dumbbell_shoulder_press's, leaf-equal (D-SHIP-W4-PADZOOM).
    key: 'seat-back-contact', chip: 'Back', heading: 'Back contact', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's mid back for both halves; the Wrong is this
    // spec's Mistake dashed over the end pose, as `stills.arch`. Anchors: the plate's callout `back` (backUpper) and the
    // low back the arch bends (the plate's Mistake arches the lumbar spine).
    crop: { center: { at: 'backMid', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Back on pad', anchor: 'backUpper' },
      wrong: { text: 'Low back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Head, shoulders and buttocks on the pad.',   // inherited (c3 here)
      wrong: 'Low back arched off the pad.',              // inherited (c3 here)
    },
    alt: {
      right: 'Side view, top of the press. Back on the upright pad, arms straight overhead, palms forward.',   // c1, c3
      wrong: 'Side view, top of the press. The low back arches and the upper back lifts off the pad.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders work.' },
    { muscleId: 'side_delts', plain: 'The side of the shoulders work too.' },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps press.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the front and sides of your shoulders.',
  rows: [
    // The card's first row (front and sides of the shoulders) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'pain', where: 'Any pain', at: { muscles: ['front_delts', 'side_delts'] },
      means: '',   // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c7 },
  ],
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arch', title: 'Back arching off the bench', zoom: 'seat-back-contact', claim: CL.c3,
    fix: 'Keep your back on the pad.' },
  { key: 'heavy', title: 'Using your shoulder-press weight', claim: CL.c6,
    fix: 'Go a little lighter than your shoulder press.' },
  { key: 'pain', title: 'Pressing through shoulder pain', claim: CL.c7,
    fix: "Stop the set. Don't train through the pain." },
];
const RISKS = [
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting and linked to poor technique.', claim: CL.c13 },
  { key: 'dropped', text: 'Weights dropping on the lifter is the most common weight-room injury mechanism.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_arnold_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: arnold-palm-turn is a palm turn during the rep; no key draws a rotating grip and no card gives the turn angles; Right and Wrong are text checkpoints (c1).',
    // No orientation: the grip turns during the rep, palms toward you at the bottom, forward at the top (c1).
    handle: 'dumbbell',        // the spec's engine dumbbell primitive
    overBody: true,            // c1: the dumbbells are pressed overhead
    width: { text: 'Dumbbells in front of your chest at the bottom.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.c15 },   // inherited (grip.thumb)
    // c16: "Handle squeezed tight in the hand". The card gives no palm zone; heel-of-palm is the push archetype default
    // (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:push-heel'), as on the parent. Not shown.
    contact: 'heel',
    // inherited (grip.wrist), leaf-equal to the parent: the ext range is pairs.mjs CONVENTIONS ga:push-heel, not a card number.
    wrist: { ext: [0, 15], limitText: 'Keep your wrists neutral throughout.',
      claim: C(['CONSENSUS', 'MECH'], [ACE], 'c15; inherited grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [],   // the card's hand zoom is a placement zoom (no wrist or thumb fault): its Wrong is the grip line's last sentence
    // c16, c15; c1 (card zoom arnold-palm-turn Wrong, a text checkpoint). The wrists are the grey line under it.
    gripLine: 'Closed grip, thumbs wrapped, handle squeezed tight. Palms already forward at the bottom means no turn.',
    cue: 'Squeeze the handle, wrist neutral.',   // hint G (c16, c15)
  },
  contacts: ['seat-back'],
  setup: [
    // card posture point c4 (D-TEXT-PRINTED: posture details are not printed)
    { kind: 'adjust', text: 'Bench upright, back on pad. Upper arms about level with the floor.', zoom: 'seat-back-contact',
      claim: C(['CONSENSUS'], [GG, FF], 'c2, c3, c4') },
    { kind: 'get-in', text: 'Sit with the dumbbells on your knees, then kick them up.', claim: CL.c5 },
    // card zoom arnold-palm-turn Right (c1), a text checkpoint
    { kind: 'grip', text: 'Palms facing you at bottom, turning forward as you press.', claim: CL.c1 },
    { kind: 'safety', text: 'If using a spotter, they stand behind you, hands near your wrists.', claim: CL.c10 },   // inherited (setup.spotter)
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c11 },
  ],
  posture: [
    { key: 'back', label: 'Back on pad', detail: 'Back on the pad for the whole press.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'seat-back-contact', claim: CL.c3 },
    { key: 'palms', label: 'Palms in', detail: 'Palms face you at the bottom, forward at the top.',
      anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c1 },
    { key: 'arms', label: 'Upper arms level', detail: 'Upper arms about level with the floor at the bottom.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c4 },
    { key: 'top', label: 'Arms straight up', detail: 'Straight arms overhead at the top.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c1 },
    { key: 'wrists', label: 'Wrists neutral', detail: 'Wrists neutral through the turn.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c15 },
  ],
  feel,
  zooms,
  chips: ['seat-back-contact', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Bench upright, back on the pad. Dumbbells in front of your chest, palms facing you.',
    mistakeLine: 'Keep your back on the pad as you press.',
    cueLine: 'Turn the palms as you press.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/arnold_press.json', rev: 1 },
};
