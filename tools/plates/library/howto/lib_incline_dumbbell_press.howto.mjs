// LIB-SHIP W4: the How-to content of lib_incline_dumbbell_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/incline_dumbbell_press.json; its claim ids are named on each field's claim.
// Family (D-SHIP-FAMILY, INHERIT_MAP lib_incline_dumbbell_press): the card's inherit[] delegates grip.thumb, grip.wrist
// and zooms.wrist-neutral-press to dumbbell_bench_press. Those paths (handling.thumb.mode, handling.wrist,
// handling.faults[key=bent-back]) are written leaf-equal to the parent's shipped sheet (family.mjs familyRefusal, `===`);
// each claim cites this card (c3), not the parent.
// No hand zoom (D-SHIP-HANDW2, gap-ruled on tools/plates/library/hands/no-zoom.json): the inherited hand zoom
// `wrist-neutral-press` is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19). Its Right is the grip
// line, its Wrong the bent-back fault's alt.
// Card zoom `incline-angle` (c2): drawn since LIB-PLATEFIX-4 item 20 (zooms below; it was a text checkpoint, D-SHIP-TEXTZOOM).
// Its Right and Wrong also show in setup step 1 and the `angle` checkpoint, which link to it.
// Way out: the spotter (c10) is in the dropped-weight risk; get-in and set-down are the shared dumbbell-kickup card's
// bench variant (docs/research/howto/shared/dumbbell-kickup.json), not repeated here.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec, { reclined } from '../specs/incline_dumbbell_press.mjs';
import { inclineBench } from '../eq/inclineBench.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-incline-press': { cite: 'Incline Chest Press, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/25/incline-chest-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-db-bench': { cite: 'How to perform a dumbbell bench press (Human Kinetics excerpt)', url: 'https://us.humankinetics.com/blogs/excerpt/how-to-perform-a-dumbbell-bench-press',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  rodriguezridao2020: { cite: 'Effect of Five Bench Inclinations on the Electromyographic Activity of the Pectoralis Major, Anterior Deltoid, and Triceps Brachii during the Bench Press Exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/33049982/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'liftosaur-incline-db': { cite: 'Dumbbell Incline Bench Press (Liftosaur exercise guide)', url: 'https://liftosaur.com/exercises/dumbbell-incline-bench-press',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'WEAK' },
  lauver2016: { cite: 'Influence of bench angle on upper extremity muscular activation during bench press exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/25799093/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c5 (lockout height; the plate draws the dumbbells over the shoulders, c17), c11 (breathing), c14 (tempo, a
// plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-incline-press', HK = 'hk-db-bench', RR = 'rodriguezridao2020';
const CL = {
  c2: C(['DATA', 'MECH'], [RR], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c6: C(['CONSENSUS'], [ACE, HK], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['CONSENSUS'], [ACE, 'liftosaur-incline-db'], 'c8'),
  c9: C(['WEAK'], ['liftosaur-incline-db'], 'c9'),
  c12: C(['DATA', 'MECH'], ['lauver2016'], 'c12'),
  c13: C(['CONSENSUS'], ['acsm2009'], 'c13'),
  c16: C(['DATA'], ['kolber2010'], 'c16'),
  c17: C(['CONSENSUS'], [HK], 'c17'),
  inh: C(['CONSENSUS'], [ACE], 'c3; inherited from dumbbell_bench_press (card inherit[], INHERIT_MAP)'),
  angle: C(['CONSENSUS', 'DATA', 'MECH'], [ACE, HK, RR], 'c1, c2'),
  feel: C(['DATA', 'MECH'], [RR, 'lauver2016'], 'c2, c12'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (arms straight, dumbbells over the shoulders, c17) and the end (dumbbells at
// the upper chest, c6). The incline-angle zoom's Wrong is the sheet's own pose (zooms below).
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The hand zoom is on the no-zoom list (D-SHIP-HANDW2). LIB-PLATEFIX-4 item 20 (PF3 item 20, #391 6653791551; PF3 PLAN
// #405 6682819340; W4 panel L7 [4,3,3], #391 6653540190, critics c2, c3: "a bench-angle panel showing a 45-degree pad
// (Right) vs a near-upright pad (Wrong)"): the posture zoom `incline-angle` (c1, c2) is drawn. Right: the plate's start
// (arms straight over the shoulders) on the 45 deg pad. Wrong: the same lifter on the pad set near upright, UPRIGHT deg
// from vertical: the spec's reclined() solves root, trunk and neck on that pad, the bench is the spec's inclineBench at
// that angle (crop option wrong.equipmentList), and each grip keeps its offset from its shoulder, so the arms are the
// Right's. Drawn solid. UPRIGHT is a drawing value for the card's "near upright" (no card number).
const UPRIGHT = 15;                                   // Wrong back pad from vertical (deg)
const BENCH = { seatTilt: 12, seatTop: 0.45, trunk: 0, backLen: 0.84, beamZ: [-0.72, 0.36] };   // the spec's SEAT_TILT, SEAT_TOP, TRUNK, BACK_LEN, BEAM_Z
const H_ = plateSpec.body?.height ?? 1.75;
const UP_REC = reclined({ back: UPRIGHT, seatTilt: BENCH.seatTilt, seatTop: BENCH.seatTop, trunk: BENCH.trunk });
const S0 = plateSpec.poses.start, lmS = landmarksOf(S0, H_), upPose = { ...S0, ...UP_REC.pose }, lmU = landmarksOf({ ...upPose, reach: undefined }, H_);
const shift = (side, r) => ({ ...r, at: r.at.map((v, i) => v + lmU[`shoulder.${side}`][i] - lmS[`shoulder.${side}`][i]) });
export const PAD_UPRIGHT = { ...UP_REC.pose, reach: { l: shift('l', S0.reach.l), r: shift('r', S0.reach.r) } };
const benchOf = (hinge, back) => inclineBench({ hinge, back, seatTilt: BENCH.seatTilt, backLen: BENCH.backLen, beamZ: BENCH.beamZ });
const N_BENCH = benchOf(UP_REC.hinge, UPRIGHT).length;
// the plate's equipment with its inclineBench items (right after the floor, as the spec lists them) at the upright angle,
// less the end layer's 45 deg phantoms (the Mistake's lumbar gap fill, part 'archgap', and the dashed start-dumbbell ring,
// class m-line), which belong to the 45 deg pad and float off the upright one
const noGap = e => typeof e !== 'function' ? e : (lm, ctx) => { const r = e(lm, ctx);
  return Array.isArray(r) ? r.filter(i => i.part !== 'archgap' && !String(i.cls ?? '').includes('m-line')) : r; };
export const UPRIGHT_EQ = [plateSpec.equipment[0], ...benchOf(UP_REC.hinge, UPRIGHT), ...plateSpec.equipment.slice(1 + N_BENCH).map(noGap)];
const zooms = [
  {
    key: 'incline-angle', chip: 'Bench', heading: 'Bench angle', kind: 'posture',
    crop: { center: { at: 'backMid', pose: 'right', off: [0, -14] }, sizePx: 240 },
    right: 'start',
    wrong: { base: 'start', pose: PAD_UPRIGHT, solid: true, equipmentList: UPRIGHT_EQ },
    callout: {
      right: { text: 'Pad about 45°', anchor: 'backMid' },
      wrong: { text: 'Near upright', anchor: { at: 'backMid', pose: 'mistake' } },
    },
    caption: {
      right: 'Back pad at about 45 degrees.',   // card zoom incline-angle Right (c2)
      wrong: 'Back pad near upright.',          // card zoom incline-angle Wrong (c2)
    },
    alt: {
      right: 'Side view, arms straight. The back pad and the back lean back at about 45 degrees.',
      wrong: 'Side view, arms straight. The back pad is set near upright, so the lifter sits almost straight up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'upper_chest', plain: 'The upper chest does the main work.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders help press.' },
    { muscleId: 'chest', plain: 'The rest of the chest works too.' },
    { muscleId: 'triceps', plain: 'The back of the upper arm straightens the elbows.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your upper chest.',
  rows: [
    { key: 'front-shoulders', where: 'Mostly front shoulders, little chest', at: { muscles: ['front_delts'] },
      means: 'A steeper bench can shift work to the front shoulders.',   // c2 is barbell data applied here (MECH)
      fix: 'Lower the bench to about 45 degrees.',
      claim: CL.angle },
    { key: 'shoulder-pain', where: 'Pain at the front shoulder', at: { muscles: ['front_delts'] },
      means: '',   // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c16 },
  ],
  claim: CL.feel,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arch', title: 'Arching the low back', claim: CL.c8,
    fix: 'Keep your back on the bench.' },
  { key: 'bounce', title: 'Bouncing off the chest', claim: CL.c6,
    fix: 'Touch gently.' },
];
const RISKS = [
  { key: 'dropped', text: 'US hospital data: dropped weights hurt lifters most often. A spotter holds your wrists.',
    claim: C(['DATA', 'CONSENSUS'], ['kerr2010', HK], 'c15, c10') },
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting and linked to poor technique.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_incline_dumbbell_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: wrist-neutral-press, inherited from dumbbell_bench_press, is a push heel-of-palm pair golden B\'s engine cannot draw (D-LIB7-19); the grip copy carries c3.',
    orientation: 'pronated',   // c3: closed grip, palms forward
    handle: 'dumbbell',        // the spec's engine dumbbell primitive
    overBody: true,            // c17: the dumbbells are held over the shoulders, in front of the face
    width: { text: 'Keep each dumbbell over its elbow, elbows under the wrists.', claim: CL.c7 },
    thumb: { mode: 'wrapped', claim: CL.inh },   // inherited (grip.thumb)
    // c3: "Handle held firmly in the palm". The card gives no palm zone; heel-of-palm is the push archetype default
    // (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:push-heel'), as on the parent. Not shown.
    contact: 'heel',
    // inherited (grip.wrist), leaf-equal to the parent: the ext range is pairs.mjs CONVENTIONS ga:push-heel, not a card number.
    wrist: { ext: [0, 15], limitText: 'Keep the wrist neutral, not bent forward or back.',
      claim: C(['CONSENSUS'], [ACE], 'c3; inherited grip.wrist. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // inherited zoom wrong (zooms.wrist-neutral-press, c3 here). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Wrist bent back under the dumbbell.' },
    ],
    // c3; the inherited zoom's Right ("Thumb wrapped, wrist straight over the forearm"): the thumb here, the wrist as
    // the grey line under it (inherited wrist.limitText), so the lead does not repeat it (SWEEP 6; the parent's W2 form).
    gripLine: 'Closed grip, palms forward, thumbs wrapped. Handle firm in your palm.',
    cue: 'Handle firm in palm, wrist neutral.',   // hint D (c3)
  },
  contacts: ['bench-lying'],
  setup: [
    // card zoom incline-angle (c2): Right "Back pad at about 45 degrees", Wrong "Back pad near upright" (drawn, PF4 item 20)
    { kind: 'adjust', text: 'Set the back pad to about 45 degrees, not near upright.', zoom: 'incline-angle', claim: CL.angle },
    { kind: 'get-in', text: 'Dumbbells on your thighs, lie back and lift them to shoulder height.', claim: CL.c9 },
    // card posture point c4 (head, shoulders, buttocks and feet keep contact): D-TEXT-PRINTED, posture details are not printed
    { kind: 'brace', text: 'Shoulder blades down and back. Head, shoulders, buttocks and feet keep contact.', claim: CL.c4 },
    { kind: 'position', text: 'Press to straight arms, dumbbells over the shoulders.', claim: CL.c17 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    { key: 'angle', label: 'Bench angle', detail: 'Back pad at about 45 degrees. Steeper can shift work to the front shoulders.',
      anchor: { landmark: 'backUpper', pose: 'start' }, zoom: 'incline-angle', claim: CL.angle },
    { key: 'contact', label: 'Five points', detail: 'Head, shoulders, buttocks and feet keep contact.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c4 },
    { key: 'arch', label: 'No arch', detail: 'No low-back arch.',
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.c8 },
    { key: 'elbows', label: 'Elbows under wrists', detail: 'Elbows under the wrists. Lower to the upper chest, slightly wide.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: C(['CONSENSUS'], [ACE, HK], 'c7, c6') },
    { key: 'wrists', label: 'Wrists neutral', detail: 'Wrists neutral.', anchor: { landmark: 'wrist.r', pose: 'start' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['incline-angle', 'feel'],   // the zoom shell's chip row: the zoom key, then feel
  copy: {
    setupLine: 'Back pad at about 45 degrees. Shoulder blades down and back, feet flat.',
    mistakeLine: 'Keep your low back on the bench, lowering and pressing.',
    cueLine: 'Elbows under the wrists.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/incline_dumbbell_press.json', rev: 1 },
};
