// LIB-SHIP W6: the How-to content of lib_smith_machine_shoulder_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/smith_machine_shoulder_press.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW6, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `smith-ohp-grip` (c5, c13) is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19). Its hand claims
// (overhand, palms forward, wider than the shoulders, thumbs wrapped; bar on the palm heel, wrist not bent back; c5,
// c13, c18) live in handling and setup step 4.
// GRIP: full from the card (grip.type c5, thumb c13, handContact and wrist c18). c18 gives no degrees, so the wrist
// range is DERIVED from the push key's convention text (pairs.mjs CONVENTIONS['ga:push-heel']), cited CONVENTION, data
// only (D-SHIP-CONVCOPY; barbell_overhead_press's form for the same claim, its c4).
// Card zooms: `smith-ohp-bench` is a text checkpoint (D-SHIP-TEXTZOOM: a bench setting; machine_chest_press's
// "Start depth" precedent), shown in setup step 1, so the sheet has no zoom crop.
// Way-out (Q-W6-8, D-SHIP-W6-WAYOUT): the card's own c7 setup step (setup[1]), cited to this card only.
// Hint: PLAN section 4 text B "Palm heel, wrist not bent back." (c18).
// Red flags: the card's redFlags, in its order (shoulder, back; Q-W6-1 keeps `back`): golden B's shoulder box and LIB-5's
// back box (tools/plates/library/shared/back-box.mjs), linked by the rows' redFlag.
// No variant line (equipment 'Smith Machine').
import plateSpec from '../specs/smith_machine_shoulder_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'fv-smith-ohp': { cite: 'Smith Machine Seated Overhead Press: Build Strong Shoulders! (Fitness Volt)', url: 'https://fitnessvolt.com/24023/smith-machine-seated-overhead-press/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-smith-ohp': { cite: 'Smith Machine Shoulder Press - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/smithMachineShoulderPress',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-smith-ohp': { cite: 'How to Do Seated Smith Machine Shoulder Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/seated-smith-machine-shoulder-press/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'eos-smith': { cite: 'How to Use a Smith Machine: 8 Exercises & Form Tips (EoS Fitness)', url: 'https://www.eosfitness.com/blog/how-to-use-smith-machine',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'stronglifts-ohp': { cite: 'How to Overhead Press with Proper Form: Full Guide (StrongLifts)', url: 'https://stronglifts.com/overhead-press/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  macdougall1985: { cite: 'Arterial blood pressure response to heavy resistance exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // the push key's wrist convention for the range c18 leaves without degrees: a convention.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_overhead_press lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: saeterbakken2013 (c12, free-bar and dumbbell data only), c14 (ACSM speed), c19 (tempo, a plate drawing value).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-smith-ohp', MO = 'motra-smith-ohp', SL = 'sl-smith-ohp', STL = 'stronglifts-ohp';
const CL = {
  c4: C(['CONSENSUS'], [MO, FV], 'c4'),
  c5: C(['CONSENSUS'], [FV, MO], 'c5'),
  c6: C(['CONSENSUS'], [FV, SL, MO], 'c6'),
  c7: C(['CONSENSUS'], ['eos-smith', MO, FV], 'c7'),
  c11: C(['CONSENSUS'], [MO, SL], 'c11'),
  c13: C(['CONSENSUS', 'WEAK'], [STL], 'c13'),
  c15: C(['CONSENSUS'], ['acsm2009'], 'c15'),
  c16: C(['DATA'], ['kolber2010'], 'c16'),
  c17: C(['DATA'], ['macdougall1985'], 'c17'),
  c18: C(['CONSENSUS', 'WEAK'], [STL], 'c18'),
  bench: C(['CONSENSUS'], [FV, MO], 'c1, c2, c3'),
  benchZoom: C(['CONSENSUS'], [FV, MO], 'c1, c3'),
  grip: C(['CONSENSUS', 'WEAK'], [FV, MO, STL, 'eos-smith'], 'c5, c13, c8'),
  gripZoom: C(['CONSENSUS', 'WEAK'], [FV, MO, STL], 'c5, c13'),
  flare: C(['CONSENSUS'], [MO, FV], 'c10, c5'),
  arch: C(['CONSENSUS'], [MO, FV], 'c9, c4'),
  lock: C(['CONSENSUS'], [MO, FV, SL], 'c10, c6'),
  shoulderRow: C(['CONSENSUS'], [MO, FV], 'c9, c10, c5'),
  faceRisk: C(['CONSENSUS', 'WEAK'], [FV, 'eos-smith', MO, STL], 'c3, c7, c13'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The wrist range DERIVED at import from the push key's convention text, so it cannot drift from it. pairs.mjs
// CONVENTIONS['ga:push-heel'] (pairs.mjs:24) reads 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to
// 15'. pairs.mjs is not imported (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot follow); the text
// is copied here and pinned against the live convention by a test (lib_triceps_pushdown's form). The contact is the
// card's own (c18, "on the heel of the hand"); the convention must name the same zone, or this throws.
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!EXT || !PUSH_HEEL.includes('heel of the palm')) throw new Error(`lib_smith_machine_shoulder_press: pairs.mjs CONVENTIONS ga:push-heel has no heel zone or range: ${PUSH_HEEL}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// No zoom crops; the stills are the plate spec's own poses.
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
};

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders is a main mover.' },
    { muscleId: 'side_delts', plain: 'The side of the shoulders is a main mover.' },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps.' },
  ],
  watch: [],
  // The card's first row (front, side shoulders, backs of arms; c11) has no fix, so it is left out: the feel line says it
  // (D-SHIP-Q16). D-TEXT-GOLDEN: posture 'depth' (c6) is shown in the feel line.
  feelLine: 'You should feel this in your front and side shoulders. Lower until upper arms are about parallel to the floor.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'An excessive back arch.',
      fix: 'Press your upper back into the pad.',
      redFlag: 'back', claim: CL.arch },
    { key: 'shoulder', where: 'Any shoulder pain', at: { muscles: ['front_delts', 'side_delts'] },
      means: 'Flaring the elbows wide.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.shoulderRow },
  ],
  claim: C(['CONSENSUS'], [MO, SL, FV], 'c11, c6'),   // the feel line: c11 (muscles), c6 (depth)
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'flare', title: 'Elbows flaring wide', claim: CL.flare,
    fix: 'Keep your elbows in front of your shoulders.' },
  { key: 'arch', title: 'Back arching off the pad', claim: CL.arch,
    fix: 'Press your upper back into the pad, brace, start light.' },
  { key: 'lock', title: 'Elbows locking at the top', claim: CL.lock,
    fix: 'Stop just short of full arm extension.' },
];
const RISKS = [
  { key: 'face', text: 'Bar passes your face: it should just clear your nose. Set stops, wrap thumbs.', claim: CL.faceRisk },
  { key: 'pressure', text: 'Heavy presses send blood pressure very high, partly from holding your breath.', claim: CL.c17 },
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_smith_machine_shoulder_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: the push heel-of-palm pair cannot be drawn by golden B\'s engine (D-LIB7-19); the grip copy carries c5, c13 and c18.',
    orientation: 'pronated',   // c5: overhand, palms forward
    overBody: true,            // c13: the Smith bar passes the face, so thumbs are wrapped round it
    width: { text: 'Wider than shoulder width. How wide depends on your height and arm length.', claim: CL.c5 },
    thumb: { mode: 'wrapped', claim: CL.c13 },
    contact: 'heel',           // c18: the bar on the heel of the hand, close to the wrist
    // c18 gives no degrees ("so the wrists do not bend back"). The range is the push hand key's recorded convention,
    // derived above (pairs.mjs CONVENTIONS 'ga:push-heel': extension 0 to 15), not a card number.
    wrist: { ext: EXT, limitText: 'Bar low on the heel of your hand, so your wrist does not bend back.',   // c18's words (D-SHIP-CONVCOPY)
      claim: C(['CONSENSUS', 'WEAK', 'CONVENTION'], [STL, 'ga-push-heel'], 'c18. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom smith-ohp-grip wrong (c13). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'thumb-off', label: 'Thumb not wrapped', pose: {}, markers: [], alt: 'Thumb not wrapped around the bar.' },
    ],
    gripLine: 'Overhand, palms forward, wider than your shoulders. Thumbs wrapped round the bar.',   // c5, c13
    cue: 'Palm heel, wrist not bent back.',   // PLAN section 4, text B (c18)
  },
  contacts: ['seat-back'],
  setup: [
    // card zoom smith-ohp-bench (D-SHIP-TEXTZOOM): its Right is this step (c1, c3)
    { kind: 'adjust', text: 'Bench at about 70 degrees. The bar should just clear your nose.', claim: CL.bench },
    // way-out (Q-W6-8, D-SHIP-W6-WAYOUT): the card's setup[1], c7. W6 panel SAFETY b (#393): the card has no tierA.wayOut
    // field; its c7 is the way out itself ("rack the bar at any time"; eos-smith "safety stops ... to catch the bar if
    // needed"), so the step also says what ends a failed rep, in eos-smith's own words ("Set the safety stops just below
    // your lowest movement point to catch the bar if needed"). Risks hold at most 3 and a setup step at most 12 words.
    { kind: 'safety', text: 'Set stops just below the lowest point to catch a missed rep.', claim: CL.c7 },
    { kind: 'position', text: 'Sit back, feet flat, upper back pressed into the pad, core braced.', claim: CL.c4 },
    { kind: 'grip', text: 'Grip wider than shoulders, thumbs wrapped. Rotate the bar off the hooks.', claim: CL.grip },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c15 },
  ],
  posture: [
    // card zoom smith-ohp-bench as a text checkpoint (D-SHIP-TEXTZOOM): a bench setting the crop cannot show
    { key: 'bench', label: 'Bar misses nose', detail: 'Bench at about 70 degrees, so the bar just clears your nose.',
      anchor: { landmark: 'head', pose: 'end' }, claim: CL.benchZoom },
    { key: 'back', label: 'Back on pad', detail: 'Upper back on the pad, feet flat.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c4 },
    { key: 'brace', label: 'No back arch', detail: 'Core braced, no excessive back arch.',
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.arch },
    { key: 'elbows', label: 'Elbows forward', detail: 'Elbows in front of the shoulders, not flared wide.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.flare },
    { key: 'depth', label: 'Arms parallel', detail: 'Lower until the upper arms are about parallel to the floor.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c6 },
    { key: 'lockout', label: 'Soft elbows', detail: 'Stop just short of locking the elbows.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.lock },
  ],
  feel,
  zooms: [],
  copy: {
    setupLine: 'Bench at about 70 degrees, bar just clearing your nose. Stops just below the lowest point.',
    mistakeLine: 'Keep your elbows in front of your shoulders, not flared wide.',
    cueLine: 'Elbows in front.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'back'],   // the card's redFlags, in its order (Q-W6-1)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/smith_machine_shoulder_press.json', rev: 1 },
};
