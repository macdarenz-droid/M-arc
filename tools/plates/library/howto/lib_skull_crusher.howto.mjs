// LIB-SHIP W4: the How-to content of lib_skull_crusher (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/skull_crusher.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, gap-key): the card's hand zoom `wrist-neutral-ez` (c3) belongs to the `ez` key, which lists
// skull_crusher in GAPS (tools/plates/library/hands/hand-ez.mjs:21: the engine cannot seat a heel push low and over the
// forearm, D-LIB7-19a); the id is on tools/plates/library/hands/no-zoom.json. Its Right is the grip line, its Wrong the
// bent-back fault's alt (c3).
// GRIP (c) (D-SHIP-GRIP, D-SHIP-CONVCOPY): the card states no hand placement (grip.handContact). The contact and the wrist
// range are read at import from the push key's convention, tools/plates/library/hands/pairs.mjs CONVENTIONS
// ['ga:push-heel'], cited as CONVENTION (source ga-push-heel), never DATA, and never printed.
// Card zoom `upper-arm-vertical` (c5, c7): its Wrong is the plate's own Mistake (`drift`, the card's topFault).
// Way out (tier A): the card's only way out, a spotter for a first-time lifter (c16), is setup step 4 and the bar risk.
// Variant line (D-LIB5-VARIANT): exercises.json lists 'EZ Bar / Barbell'; the card's plate.variantLine says the setup, arm
// path and wrist rules (c1-c6) hold for both bars.
// Red flags: the card's redFlags (elbow), golden B's shared elbow box.
import plateSpec from '../specs/skull_crusher.mjs';
import { RED_FLAG, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-lying-tri-ext': { cite: 'Lying Barbell Triceps Extensions, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/36/lying-barbell-triceps-extensions/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-lte': { cite: 'How to Do Lying Triceps Extension with EZ bar (StrengthLog)', url: 'https://www.strengthlog.com/lying-triceps-extension/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthshop-skull': { cite: 'The complete skull crushers guide: how to do them right and which bar to use (Strength Shop blog; equipment retailer)', url: 'https://strengthshop.eu/blogs/news/the-complete-skull-crushers-guide-how-to-do-them-right-and-which-bar-to-use',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'WEAK' },
  gaviria2020: { cite: 'Triceps Tendon Ruptures: Risk Factors, Treatment, and Rehabilitation', url: 'https://pubmed.ncbi.nlm.nih.gov/32539261/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  'fitfather-skull': { cite: 'Skull Crushers Exercise Tutorial (Form, Variations, and Benefits) (The Fit Father Project, Stuart Carter)', url: 'https://www.fitfatherproject.com/skull-crushers/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  // The push key's own source for the hand contact (the card states none): a drawing convention.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_ELBOW's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'elbow'.
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c13 and c17 (tempo, a plate drawing convention), c14 (all weight training; the bar risk carries the way out).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-lying-tri-ext', SL = 'strengthlog-lte', SS = 'strengthshop-skull';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE, SL], 'c6'),
  c7: C(['CONSENSUS', 'WEAK'], [SS], 'c7'),
  c9: C(['CONSENSUS', 'WEAK'], [SS], 'c9'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c12: C(['CONSENSUS'], ['acsm2009'], 'c12'),
  c15: C(['DATA'], ['gaviria2020'], 'c15'),
  c16: C(['CONSENSUS'], ['fitfather-skull'], 'c16'),
  lie: C(['CONSENSUS'], [SL, ACE], 'c10, c1'),
  press: C(['CONSENSUS'], [ACE], 'c2, c5'),
  drift: C(['CONSENSUS', 'WEAK'], [ACE, SS], 'c5, c7'),
  grip: C(['CONSENSUS', 'MECH', 'WEAK'], [ACE, SS], 'c1, c3, c8'),
  width: C(['CONSENSUS'], [SL, ACE], 'c10, c6'),
  bar: C(['CONSENSUS'], [ACE, 'fitfather-skull'], 'c2, c1, c4, c16'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact and wrist range DERIVED at import from the push key's convention text (as lib_triceps_pushdown),
// so they cannot drift from it. pairs.mjs CONVENTIONS['ga:push-heel'] reads 'GA 3.1 push: heel of the palm, low, over
// the forearm; extension 0 to 15'. HandContact names the palm zone 'heel of the palm' as 'heel' (src/howto/
// content-types.ts HandContact); a convention that names no mapped zone throws. pairs.mjs is not imported (its closure
// pulls howto-layers.mjs, which the MANIFEST closure cannot follow); the text is copied here.
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_skull_crusher: pairs.mjs CONVENTIONS ga:push-heel has no mapped contact or range: ${PUSH_HEEL}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (arms straight, bar above the face, c2), the end (bar just above the
// forehead, c4, c5) and the spec's Mistake merged over the end, as the engine draws it (card plate.mistake, c7: the upper
// arms drift back). The card zoom upper-arm-vertical Wrong is the plate's drawn fault, so no drawing value is added.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  drift: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `wrist-neutral-ez` (D-SHIP-C3, above). The posture zoom is in the zoom shell's
// shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'upper-arm-vertical', chip: 'Upper arms', heading: 'Upper-arm angle', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's elbow for both halves; the Wrong is the
    // spec's Mistake dashed over the end pose, as `stills.drift`. Anchors: the plate's callout `upper` and tell `drift`.
    crop: { center: { at: 'elbow.r', pose: 'right', off: [0, 0] }, sizePx: 160 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Arms vertical', anchor: 'elbow.r' },
      wrong: { text: 'Drifted back', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Upper arms vertical, only the forearms move.',   // c5
      wrong: 'Upper arms drifted back toward the head.',      // c5, c7
    },
    alt: {
      right: 'Side view, bottom of the rep. Upper arms upright over the shoulders, bar just above the forehead.',
      wrong: 'Side view, bottom of the rep. The elbows swing back toward the head, carrying the bar back.',
    },
    feelRow: 'shoulders',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'The back of the upper arm straightens the elbow.' }],
  secondary: [],   // the card names none
  watch: [],
  feelLine: 'You should feel this in the backs of your upper arms.',
  rows: [
    // The card's first row (backs of the upper arms) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'shoulders', where: 'Mostly the shoulders', at: { muscles: ['front_delts'] },
      means: 'Your upper arms drift back, shifting the load onto the shoulder.',
      fix: 'Keep the upper arms vertical.',
      zoom: 'upper-arm-vertical', claim: CL.c7 },
    { key: 'elbow', where: 'Back-of-elbow pain', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'You are lowering the bar forcefully.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'elbow', claim: CL.c15 },
  ],
  claim: CL.c11,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'drift', title: 'Upper arms drifting back', zoom: 'upper-arm-vertical', claim: CL.c5,
    fix: 'Keep them vertical. Stop the descent when they start to move.' },
  { key: 'heavy', title: 'Too heavy: elbows wander', claim: CL.c9,
    fix: 'Reduce the load until every rep is clean.' },
  { key: 'wrists', title: 'Wrists bent back or curled', claim: CL.c3,
    fix: 'Keep the wrists neutral.' },
];
const RISKS = [
  { key: 'bar', text: 'Bar over the face: wrap the thumbs, lower slowly, have a spotter when new.', claim: CL.bar },
  { key: 'tendon', text: 'Triceps tendon rupture is rare, often from forceful lowering or lifting against resistance.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_skull_crusher',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3: the ez key lists skull_crusher in GAPS (hand-ez.mjs:21: the engine cannot seat a heel push low and over the forearm, D-LIB7-19a); the grip copy carries c1, c3 and c8.',
    orientation: 'pronated',   // c1: palms toward the feet
    handle: 'ez-bend',         // the spec's EZ bar (census ezBar); the hands on its angled inner grips (c8)
    overBody: true,            // c2: the bar sits above the face
    width: { text: 'Close grip, elbows shoulder-width apart.', claim: CL.width },
    thumb: { mode: 'wrapped', claim: CL.c1 },
    contact: CONTACT,          // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (CONVENTION, above); never printed
    // c3 gives no degrees ("neutral, neither bent forward nor back"). EXT is the push key's convention range, read above.
    wrist: { ext: EXT, limitText: 'Keep the wrists neutral, not bent forward or back.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, 'ga-push-heel'], 'c3. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom wrong (c3). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Wrists bent back under the bar.' },
    ],
    // c1, c8; the card zoom's Right ("Thumbs wrapped, wrists straight on the EZ grips", c3).
    gripLine: 'Closed grip, palms toward your feet. Thumbs wrapped, wrists straight on the EZ grips.',
    cue: 'Wrist neutral.',   // hint K (c3)
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'position', text: 'Lie on a flat bench, head near the end, feet flat.', claim: CL.lie },
    { kind: 'grip', text: 'Grip the bar closed, thumbs wrapped, palms toward your feet.', claim: CL.c1 },
    { kind: 'position', text: 'Press to straight arms above your face. Upper arms vertical.', zoom: 'upper-arm-vertical', claim: CL.press },
    { kind: 'safety', text: 'When new to the lift, have a spotter and start light.', claim: CL.c16 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c12 },
  ],
  posture: [
    { key: 'upper', label: 'Upper arms vertical', detail: 'Upper arms vertical throughout. Only the forearms move.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, zoom: 'upper-arm-vertical', claim: CL.c5 },
    { key: 'forehead', label: 'Bar to forehead', detail: 'Lower slowly to just above the forehead or slightly behind the head.',
      anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c4 },
    { key: 'elbows', label: 'Elbow width', detail: 'Elbows shoulder-width apart.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c6 },
    { key: 'wrists', label: 'Wrists neutral', detail: 'Wrists neutral.', anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c3 },
    { key: 'feet', label: 'Feet flat', detail: 'Feet flat on the floor.', anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.c1 },
  ],
  feel,
  zooms,
  chips: ['upper-arm-vertical', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Head near the bench end, feet flat. Arms straight, bar above your face.',
    mistakeLine: 'Keep your upper arms vertical. Stop the descent when they start to drift back.',
    cueLine: 'Only the forearms move.',
    // D-LIB5-VARIANT: the card's plate.variantLine: c1-c6 hold for both bars.
    variantLine: 'Same form with a straight barbell.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['elbow'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/skull_crusher.json', rev: 1 },
};
