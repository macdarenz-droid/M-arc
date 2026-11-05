// LIB-SHIP W3: the How-to content of lib_chin_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/chin_up.json; its claim ids are named on each field's claim.
// Family (D-SHIP-FAMILY, SHIP W3 PLAN RULED Q-W3-1): the card's parent is pull_up. Its inherit[] maps to THUMB
// (handling.thumb.mode, handling.pose.thumb) and zooms[key=hand].hand.right.thumb only: 'wrapped' in both sheets. The
// card wins over inheritance, so the hand zoom is this card's own (c3 wrist straight, c20 not curled), not pull_up's.
// Hand zoom (D-SHIP-GRIP full; Q-W3-1): drawn by the approved `bar` pair key, variant 'hang', orientation 'under'
// (tools/plates/library/hands/hand-bar.mjs:34 IDS.chin_up; VARIANTS.hang from hangVariant, hand-bar.mjs:13-27). Its
// values match the card field by field: thumb 'wrapped' (c1, c21), contact 'base' = bar just below the base of the
// fingers (c25), wrist in line with the forearm (c3; the key records c3 for its wrist), Wrong 'curled' (c20). The key
// module is not imported (D-LIB7FIX-PERKEY closure, W2 form): its record is copied here and pinned against the live key
// by tests/howto/lib-ship.test.ts. The Right/Wrong notes are the pair panel's words (hands/words/bar-hang-under.json).
// Red flags: the card's redFlags (shoulder, elbow): golden B's shared blocks, linked by the rows' redFlag.
// Tier-A way out: the card records a gap (no sourced way to get down from the bar or fail a rep safely), so no way-out
// line is written; the W3 safety checker rules on it (Q-W2-3 form).
import plateSpec from '../specs/chin_up.mjs';
import { landmarksOf } from '../engine.mjs';   // W3 LAYERS FIX: the blade outlines' rib level (the plate's own engine)
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-chin-ups': { cite: 'Chin-ups (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/190/chin-ups/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-chin-up': { cite: 'How to Do Chin-Up: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/chin-up/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nasm-chin-pull': { cite: "Chin-Ups vs. Pull-Ups: A Trainer's Guide to Programming Both (NASM blog)", url: 'https://www.nasm.org/resource-center/blog/training/chin-ups-vs-pull-ups-the-difference-the-benefits-muscles-worked',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'barbend-chin-up': { cite: 'Chin-up exercise guide (BarBend)', url: 'https://barbend.com/chin-up/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-best-back': { cite: 'ACE-Sponsored Research: What Is the Best Back Exercise? (Edelburg, Porcari, Camic, Kovacs, Foster, with Green; ACE Certified, December 2018)', url: 'https://www.acefitness.org/continuing-education/certified/december-2018/7138/ace-sponsored-research-what-is-the-best-back-exercise/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'DATA' },
  'youdas-2010': { cite: 'Surface electromyographic activation patterns and elbow joint motion during a pull-up, chin-up, or perfect-pullup rotational exercise (Youdas et al., J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/21068680/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'prinold-2016': { cite: 'Scapula kinematics of pull-up techniques: Avoiding impingement risk with training changes (Prinold and Bull, J Sci Med Sport)', url: 'https://pubmed.ncbi.nlm.nih.gov/26383875/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'mcgill-2014': { cite: 'Muscle activity and spine load during pulling exercises: influence of stable and labile contact surfaces and technique coaching (McGill, Cannon, Andersen, J Electromyogr Kinesiol)', url: 'https://pubmed.ncbi.nlm.nih.gov/25066518/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'odriscoll-1992': { cite: "The relationship between wrist position, grasp size, and grip strength (O'Driscoll et al., J Hand Surg Am)", url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'hk-baechle-grip': { cite: 'Grip selection and location, excerpt from Weight Training: Steps to Success, 5th ed. (Baechle and Earle, Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'bullbar-assist-beginner': { cite: "How to Use a Pull-Up Assist Machine Correctly (Beginner's Guide) (Bullbar Fit, manufacturer blog)", url: 'https://bullbarfit.com/blogs/q-as/how-to-use-a-pull-up-assist-machine-correctly-for-beginners-at-the-gym',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'WEAK' },
  'bullbar-calluses': { cite: 'How to Grip the Bar Without Getting Calluses (Bullbar Fit, manufacturer blog)', url: 'https://bullbarfit.com/blogs/q-as/what-is-the-correct-way-to-grip-the-bar-to-avoid-calluses',
    kind: 'coach', access: 'full', checked: '2026-10-18', use: 'WEAK' },
  // The bar key's own source for the drawn hang pose and the wrist range (GA 3.1 hang, ga:hang-base): a drawing convention.
  'hand-key-bar': { cite: 'LIB-7c hand pair key bar (hang), CONVENTIONS ga:hang-base: top of the palm where the fingers start; extension 0 to 35', url: 'tools/plates/library/hands/hand-bar.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's and RED_FLAG_ELBOW's own sources (layers/howto/shared.mjs), as golden B's pull_up lists them.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};
// Not cited: c8 (tempo, plate only), c13 (palm-direction rotation, folded into the shoulder risk's c14), c22 (head in
// line, plate only); no field here restates them.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-chin-ups', NASM = 'nasm-chin-pull', KEYSRC = 'hand-key-bar';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], ['strengthlog-chin-up', NASM], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE, NASM], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE, NASM], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c9: C(['CONSENSUS'], [ACE], 'c9'),
  c15: C(['DATA'], ['mcgill-2014'], 'c15'),
  c16: C(['CONSENSUS'], [NASM], 'c16'),
  c17: C(['CONSENSUS'], [NASM], 'c17'),
  c18: C(['CONSENSUS'], ['barbend-chin-up'], 'c18'),
  c25: C(['MECH', 'WEAK'], ['bullbar-calluses'], 'c25'),
  thumb: C(['CONSENSUS', 'WEAK'], [ACE, 'hk-baechle-grip'], 'c1, c21; inherited from pull_up (THUMB, parent c3)'),
  shrug: C(['MECH', 'WEAK', 'CONSENSUS'], ['bullbar-assist-beginner', ACE, NASM], 'c24, c4'),
  shoulder: C(['MECH', 'CONSENSUS'], ['prinold-2016', NASM, 'nhs-shoulder-pain'], 'c14, c13, c16. The referral is the shared shoulder red flag (NHS).'),
  elbow: C(['CONSENSUS'], [NASM, 'nhs-elbow-pain'], 'c16. The referral is the shared elbow red flag (NHS).'),
  wrist: C(['CONSENSUS', 'MECH', 'CONVENTION'], [ACE, 'odriscoll-1992', KEYSRC], 'c3, c20. The ext range is the bar key\'s hang wristRange (ga:hang-base), a convention, not a card number.'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The bar key's record for this id and its variant, copied (hand-bar.mjs:34 IDS.chin_up; hangVariant, hand-bar.mjs:13-27).
const KEYED = { variant: 'hang', orientation: 'under', faults: ['curled'] };   // IDS.chin_up
const V = {                                                                 // VARIANTS.hang
  archetype: 'hang', loadAxis: 'across', wristRange: [0, 35], contact: 'base',
  right: { view: 'radial', forearm: 180, wrist: { ext: 10, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'gravity' } },
  rightNote: 'Base of fingers',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  // HandFault.pose.wrist needs dev: the key's fault sets ext only and the engine merges it over the right pose, so dev
  // is the right pose's own value (0), written out for the type (as lib_dumbbell_biceps_curl).
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// The key's contact 'base' (ga:hang-base) is the card's own contact (c25: just below the base of the fingers):
// HandContact 'finger-base'. An unmapped key word throws.
const CONTACT = { base: 'finger-base' }[V.contact];
if (!CONTACT) throw new Error('lib_chin_up: the bar key no longer records this sheet\'s contact');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (free hang, c18) and the end (chin level with the bar, c7). The spec's
// Mistake pose (legs kick, body arcs; card plate.mistake, c6) merged over the end pose is the card zoom body line's
// Wrong, so no new pose is made for it.
// DRAWING VALUES (D-SHIP-DRAWVAL; precedent golden B pull_up.howto.mjs:162 SHRUG_HANG): the shrug for the card zoom
// `shoulders` (c24) is golden B's own shrug offsets (scap elev 8, pro 1, neck 10, the body 7 cm lower on straight arms)
// over this plate's start. No card gives a size; no number appears in user copy; the layers panel judges it.
const S = plateSpec.poses.start, MIS = plateSpec.mistake.pose;
const SHRUG = { root: { at: [S.root.at[0], S.root.at[1] - 0.07, S.root.at[2]], tilt: S.root.tilt }, scap: { elev: 8, pro: 1 }, neck: 10 };
export const stills = {
  start: { pose: S },
  end: { pose: plateSpec.poses.end },
  shrug: { pose: { ...S, ...SHRUG } },
  kip: { pose: { ...plateSpec.poses.end, ...MIS } },
};

// Shoulder blades seen from behind (W3 LAYERS FIX, L5): golden B's bladeOutlines (layers/exercises/pull_up.howto.mjs:172)
// and its drawing values, in cm from each shoulder joint centre: [toward the spine, up]. The blades ride on the shoulder
// joints, so in the shrug the ribcage and head sink under them. ribLevel: a fixed level on the ribcage, at the right
// hang's lower blade corners.
const BLADE = [[13, 2], [5, 3.2], [0.5, 4], [1, -1], [3, -6], [7.5, -13.5], [11.5, -8], [13.8, -2.5]];
const BLADE_SPINE = [[13.6, -1.5], [1, 3.6]];
const RIB_D = (() => { const lm = landmarksOf(S); return lm['shoulder.l'][1] + BLADE[5][1] / 100 - lm.backMid[1]; })();
function bladeOutlines(lm) {
  const lines = [], points = {};
  for (const sd of ['l', 'r']) {
    const Sj = lm[`shoulder.${sd}`], sg = Math.sign(Sj[0]);
    const w = ([m, up]) => [Sj[0] - sg * m / 100, Sj[1] + up / 100, Sj[2] - 0.08];
    lines.push({ pts: [...BLADE, BLADE[0]].map(w), kind: 'outline' }, { pts: BLADE_SPINE.map(w), kind: 'ridge' });
    points[`bladeLow.${sd}`] = w(BLADE[5]);
    points[`bladeTop.${sd}`] = w(BLADE[0]);
  }
  points.ribLevel = [0, lm.backMid[1] + RIB_D, lm.backMid[2]];
  return { lines, points };
}

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' and its heading the shared pair heading (D-SHIP-Q3,
// hands/words/bar-hang-under.json). The posture zooms are in the zoom shell's shape (callout with an anchor at the
// landmark it names; render/closeup/crop.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,                // handling.faults (golden B's shape: fault objects)
      camera: 'side',               // pairs.mjs ORIENTATIONS.under
      notes: { right: V.rightNote, wrong: FAULTS[0].label },   // words/bar-hang-under.json
    },
    caption: {
      right: 'Palm facing you, thumb wrapped, wrist straight.',
      wrong: 'Wrist curled forward.',
    },
    // the key's alt (hangVariant), split in two sentences for the 15-word sentence cap; the bar is the card's (c25)
    alt: { right: 'Bar across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'shoulders', chip: 'Shoulders', heading: 'Shoulder set', kind: 'posture',   // card zoom key: shoulders
    // W3 LAYERS FIX (#384 6648454032, L5): from the side the near arm hides the shrug, so both crops are drawn from
    // behind, golden B's hanging_leg_raise/pull_up "Seen from behind" form (view 'back', both solid, blades outlined, a
    // level at the right hang's head and an arrow down to the sunk head). c24.
    view: 'back', camLabel: 'Seen from behind',
    outlines: bladeOutlines,
    crop: { center: { at: 'shoulderTop.r', pose: 'right', off: [0, 8] }, sizePx: 150 },
    right: 'start',
    wrong: { base: 'start', pose: SHRUG, solid: true },
    guides: [{ kind: 'level', at: { at: 'head', pose: 'right' } }, { kind: 'level', at: 'ribLevel', tone: 'neutral' },
      { kind: 'drop', from: { at: 'head', pose: 'right' }, to: { at: 'head' } }],
    callout: {
      right: { text: 'Shoulders down', anchor: 'shoulderTop.r' },
      wrong: { text: 'Shrugged', anchor: 'shoulderTop.r' },
    },
    caption: {
      right: 'Shoulder blades down and back before the arms bend.',
      wrong: 'Shoulders shrugged to the ears at the start.',
    },
    alt: {
      right: 'Seen from behind, free hang with straight arms. Shoulders pulled down, a clear gap to the ears.',
      wrong: 'Seen from behind, the same hang shrugged. Shoulders up at the ears, the head sunk between the arms.',
    },
    feelRow: 'traps',
  },
  {
    key: 'body-line', chip: 'Body line', heading: 'Body line', kind: 'posture',   // card zoom key: body line
    // zoom shell: crop centre on the right pose's hip; the Wrong is the spec's Mistake dashed over the end pose, as
    // `stills.kip`.
    crop: { center: { at: 'hip.r', pose: 'right', off: [0, 20] }, sizePx: 210 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Body vertical', anchor: 'knee.r' },
      wrong: { text: 'Legs kick', anchor: { at: 'knee.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Legs crossed and still, body vertical under the bar.',
      wrong: 'Legs kicking forward to throw the chin up.',
    },
    alt: {
      right: 'Side view, top of the chin-up. Legs crossed and still, body vertical under the bar.',
      wrong: 'Side view. The legs kick forward and the body swings to throw the chin up.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'lats', plain: 'The lats, down the sides of your back, work hardest.' },
    { muscleId: 'biceps', plain: 'The biceps work harder here than in a pull-up.' },
  ],
  secondary: [
    { muscleId: 'mid_back', plain: 'The lower trapezius, between the shoulder blades, helps.' },
    { muscleId: 'forearms', plain: 'The forearms hold the bar for the whole set.' },
  ],
  watch: [
    { muscleId: 'upper_traps', plain: 'The tops of the shoulders should not take over.' },
  ],
  // The card's row "Front of your upper arms" has no fix ("Nothing to fix."), so it is left off the rows
  // (D-SHIP-Q16); the feel line says it.
  feelLine: 'You should feel this in the sides of your back and your biceps.',
  rows: [
    { key: 'traps', where: 'Tops of the shoulders and neck', at: { muscles: ['upper_traps'] },
      means: 'You start the pull with your shoulders up by your ears.',
      fix: 'Set your shoulders down and back before each rep.',
      zoom: 'shoulders', claim: CL.shrug },
    { key: 'shoulder', where: 'Shoulder', at: {},   // pain, not a muscle taking over: no map mark (golden B pull_up)
      means: 'Arms high overhead narrow the space under the shoulder roof.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.shoulder },
    { key: 'elbow', where: 'Elbow', at: { parts: ['elbow-left', 'elbow-right'] },
      means: 'Too much pulling volume, too soon.',
      fix: "Add sets slowly. Don't train through the pain.",
      redFlag: 'elbow', claim: CL.elbow },
  ],
  libraryDiff: { add: ['forearms'], why: 'Holding full body weight on the bar loads the grip (card c19).' },
  claim: C(['DATA', 'CONSENSUS'], ['ace-best-back', 'youdas-2010', 'barbend-chin-up'], 'c12, c10, c11, c19'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'kip', title: 'Swinging or kicking up', zoom: 'body-line', claim: C(['CONSENSUS'], [ACE, NASM], 'c9, c6'),
    fix: 'Cross your legs, brace and keep your body vertical.' },
  { key: 'half', title: 'Half reps', claim: CL.c7,
    fix: 'Straight arms at the bottom, chin to the bar every rep.' },
  { key: 'shrug', title: 'Shoulders up at the start', zoom: 'shoulders', claim: CL.shrug,
    fix: 'Pull your shoulders down and back, then bend your arms.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Arms high overhead narrow the space under the shoulder roof.', claim: C(['MECH'], ['prinold-2016'], 'c14, c13') },
  { key: 'spine', text: 'Of the pulls tested, chin-ups and pull-ups loaded the spine most.', claim: CL.c15 },
  { key: 'elbow', text: 'Elbows can get overused when pulling volume rises too fast.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_chin_up',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'hang'
    orientation: 'supinated',        // c1: palms facing you; the key's orientation 'under'
    handle: 'bar-32',                // the key's BAR32 (pullupBar, hand-bar.mjs:10)
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Hands about shoulder-width apart, or slightly closer.', claim: CL.c2 },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // 'wrapped' (c1, c21); THUMB === pull_up's
    contact: CONTACT,                // 'finger-base' (c25; the key's ga:hang-base)
    wrist: { ext: V.wristRange, limitText: 'Keep your wrist straight, in line with your forearm, not curled.', claim: CL.wrist },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Palms facing you, bar just below the base of your fingers, thumbs wrapped.',   // the wrist line is limitText, c3
    gripCite: ['c1', 'c21', 'c25'],
    cue: 'Thumbs wrapped, wrists straight.',   // c1, c3
  },
  contacts: ['hang-support'],
  setup: [
    { kind: 'grip', text: 'Palms facing you, full grip, thumbs wrapped round the bar.', zoom: 'hand', claim: CL.thumb },
    { kind: 'position', text: 'Hands about shoulder-width apart, or slightly closer.', claim: CL.c2 },
    { kind: 'brace', text: 'Hang, cross one leg over the other and brace your abs.', claim: CL.c9 },
    { kind: 'position', text: 'Pull your shoulders down and back before you bend your arms.', zoom: 'shoulders', claim: CL.c4 },
    { kind: 'load', text: "Can't do a full rep yet? Use band or machine help.", claim: CL.c17 },
  ],
  posture: [
    { key: 'hang', label: 'Free hang', detail: 'Elbows fully straight at the bottom, head between the arms.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c18 },
    { key: 'shoulders', label: 'Shoulders set', detail: 'Shoulder blades down and back, held for the whole set.',
      anchor: { landmark: 'shoulderTop.r', pose: 'start' }, zoom: 'shoulders', claim: CL.c4 },
    { key: 'wrists', label: 'Straight wrists', detail: 'Wrists straight, in line with the forearms.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, zoom: 'hand', claim: CL.c3 },
    { key: 'elbows', label: 'Elbows in front', detail: 'Elbows drive down toward the floor, in front of the body.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c5 },
    { key: 'line', label: 'Body still', detail: 'Body vertical and still: no swing, no kip.',
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'body-line', claim: CL.c6 },
    { key: 'chin', label: 'Chin to bar', detail: 'Chin level with the bar at the top.',
      anchor: { landmark: 'chin', pose: 'end' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['hand', 'shoulders', 'body-line', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Palms facing you, thumbs wrapped. Hang with straight arms, legs crossed and still.',
    mistakeLine: "Don't swing or kick to get your chin over the bar.",
    cueLine: 'Shoulders down, then pull.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'elbow'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/chin_up.json', rev: 1 },
};
