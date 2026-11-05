// LIB-SHIP W3: the How-to content of lib_hanging_knee_raise (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/hanging_knee_raise.json; its claim ids are named on each field's claim.
// Family (D-SHIP-FAMILY, D-LIB9a-MAP): the card's parent is hanging_leg_raise; its one inherit[] field, the thumb, maps
// to THUMB (handling.thumb.mode, handling.pose.thumb): 'wrapped' in both sheets.
// Hand zoom (D-SHIP-GRIP full): drawn by the approved `bar` pair key, variant 'hang', orientation 'over'
// (tools/plates/library/hands/hand-bar.mjs:35 IDS.hanging_knee_raise; hangVariant, hand-bar.mjs:13-27). The key module
// is not imported (D-LIB7FIX-PERKEY closure, W2 form): its record is copied here and pinned against the live key by
// tests/howto/lib-ship.test.ts. The Right/Wrong notes are the pair panel's words (hands/words/bar-hang-over.json).
// Red flags: the card's redFlags (back, shoulder): LIB-5's back box (tools/plates/library/shared/back-box.mjs) and golden
// B's shared shoulder block, linked by the rows' redFlag.
// Tier-A way out: the card records a gap (no sourced way to get down from the bar safely), so no way-out line is
// written; the W3 safety checker rules on it (Q-W2-3 form).
import plateSpec from '../specs/hanging_knee_raise.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'yessis-hanging-knee-leg-raise': { cite: 'Hanging Knee Leg Raise (Dr. Michael Yessis)', url: 'https://doctoryessis.com/2013/01/01/hanging-knee-leg-raise/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'strengthlog-hanging-knee-raise': { cite: 'How to Do Hanging Knee Raise: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/hanging-knee-raise/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hk-baechle-grip': { cite: 'Grip selection and location, excerpt from Weight Training: Steps to Success, 5th ed. (Baechle and Earle, Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'workman-2008': { cite: 'Influence of pelvis position on the activation of abdominal and hip flexor muscles (Workman et al., J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/18714231/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'escamilla-2006': { cite: 'Electromyographic analysis of traditional and nontraditional abdominal exercises: implications for rehabilitation and training (Escamilla et al., Phys Ther)', url: 'https://pubmed.ncbi.nlm.nih.gov/16649890/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'mcgill-2015': { cite: 'Muscle activity and spine load during anterior chain whole body linkage exercises: the body saw, hanging leg raise and walkout from a push-up (McGill, Andersen, Cannon, J Sports Sci)', url: 'https://pubmed.ncbi.nlm.nih.gov/25111163/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'odriscoll-1992': { cite: "The relationship between wrist position, grasp size, and grip strength (O'Driscoll et al., J Hand Surg Am)", url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'prinold-2016': { cite: 'Scapula kinematics of pull-up techniques: Avoiding impingement risk with training changes (Prinold and Bull, J Sci Med Sport)', url: 'https://pubmed.ncbi.nlm.nih.gov/26383875/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  'bullbar-calluses': { cite: 'How to Grip the Bar Without Getting Calluses (Bullbar Fit, manufacturer blog)', url: 'https://bullbarfit.com/blogs/q-as/what-is-the-correct-way-to-grip-the-bar-to-avoid-calluses',
    kind: 'coach', access: 'full', checked: '2026-10-18', use: 'WEAK' },
  'nasm-chin-pull': { cite: "Chin-Ups vs. Pull-Ups: A Trainer's Guide to Programming Both (NASM blog)", url: 'https://www.nasm.org/resource-center/blog/training/chin-ups-vs-pull-ups-the-difference-the-benefits-muscles-worked',
    kind: 'guideline', access: 'full', checked: '2026-10-18', use: 'MECH' },
  // The bar key's own source for the drawn hang pose and the wrist range (GA 3.1 hang, ga:hang-base): a drawing convention.
  'hand-key-bar': { cite: 'LIB-7c hand pair key bar (hang), CONVENTIONS ga:hang-base: top of the palm where the fingers start; extension 0 to 35', url: 'tools/plates/library/hands/hand-bar.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c9 (tempo, plate only), c11 (low lower-back activity: the watch row's muscle only), c13 is the load step.

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const YS = 'yessis-hanging-knee-leg-raise', SL = 'strengthlog-hanging-knee-raise', KEYSRC = 'hand-key-bar';
const CL = {
  c1: C(['CONSENSUS'], [YS, SL], 'c1'),
  c4: C(['CONSENSUS'], [SL, YS], 'c4'),
  c5: C(['CONSENSUS'], [YS], 'c5'),
  c6: C(['MECH', 'WEAK'], [YS], 'c6'),
  c8: C(['CONSENSUS'], [SL, YS], 'c8'),
  c10: C(['DATA'], ['escamilla-2006'], 'c10'),
  c13: C(['CONSENSUS'], [YS, SL], 'c13'),
  c14: C(['MECH', 'WEAK'], ['mcgill-2015'], 'c14'),
  c15: C(['MECH'], ['prinold-2016'], 'c15'),
  c17: C(['MECH', 'WEAK'], ['bullbar-calluses'], 'c17'),
  c19: C(['MECH', 'WEAK'], ['bullbar-calluses'], 'c19'),
  grip: C(['CONSENSUS', 'MECH', 'WEAK'], [YS, 'hk-baechle-grip', 'bullbar-calluses'], 'c2, c18, c3; thumb inherited from hanging_leg_raise (THUMB)'),
  thumb: C(['CONSENSUS', 'WEAK'], ['hk-baechle-grip'], 'c3; inherited from hanging_leg_raise (THUMB)'),
  curl: C(['MECH', 'WEAK'], ['workman-2008', YS], 'c7, c6'),
  swing: C(['CONSENSUS'], [SL, YS], 'c4, c8'),
  backRow: C(['MECH', 'WEAK'], ['mcgill-2015', 'nhs-back'], 'c14. The referral is LIB-5\'s back box (NHS).'),
  shoulderRow: C(['MECH', 'WEAK'], ['prinold-2016', 'bullbar-calluses', 'nasm-chin-pull', 'nhs-shoulder-pain'], 'c15, c19, c20. The referral is the shared shoulder red flag (NHS).'),
  wrist: C(['MECH', 'CONVENTION'], ['odriscoll-1992', KEYSRC], 'c16. The ext range is the bar key\'s hang wristRange (ga:hang-base), a convention, not a card number.'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The bar key's record for this id and its variant, copied (hand-bar.mjs:35 IDS.hanging_knee_raise; hangVariant,
// hand-bar.mjs:13-27).
const KEYED = { variant: 'hang', orientation: 'over', faults: ['curled'] };   // IDS.hanging_knee_raise
const V = {                                                                // VARIANTS.hang
  archetype: 'hang', loadAxis: 'across', wristRange: [0, 35], contact: 'base',
  right: { view: 'radial', forearm: 180, wrist: { ext: 10, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'gravity' } },
  rightNote: 'Base of fingers',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// The key's contact 'base' (ga:hang-base) is the card's own contact (c17: just below the base of the fingers).
const CONTACT = { base: 'finger-base' }[V.contact];
if (!CONTACT) throw new Error('lib_hanging_knee_raise: the bar key no longer records this sheet\'s contact');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (still hang, c4), end (knees above hip height, pelvis curled, c5, c6) and the
// spec's Mistake (body swinging, legs kicked up; card plate.mistake, c4), which is the card zoom body line's Wrong.
// DRAWING VALUES (D-SHIP-DRAWVAL; precedent D-LIB7-2): the card zoom `top position` Wrong (knees stopped at hip height,
// pelvis not curled, c6) is the start hang (no pelvis curl: tilt 0, trunk 0) with the thighs level (hip 90, the drawn
// meaning of "at hip height") and the end pose's knee (100). No card gives an angle; no number appears in user copy;
// the layers panel judges it.
const S = plateSpec.poses.start, E = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const SHORT = { root: S.root, trunk: S.trunk, neck: S.neck, hip: 90, knee: E.knee };
export const stills = {
  start: { pose: S },
  end: { pose: E },
  short: { pose: { ...E, ...SHORT } },
  swing: { pose: { ...E, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' and its heading the shared pair heading (D-SHIP-Q3,
// hands/words/bar-hang-over.json). The posture zooms are in the zoom shell's shape (render/closeup/crop.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,
      camera: 'side',               // pairs.mjs ORIENTATIONS.over
      notes: { right: V.rightNote, wrong: FAULTS[0].label },   // words/bar-hang-over.json
    },
    caption: {
      right: 'Overhand, thumb wrapped, wrist not curled.',
      wrong: 'Wrist curled forward.',
    },
    // the key's alt (hangVariant), split in two sentences for the 15-word sentence cap; the bar is the card's (c17)
    alt: { right: 'Bar across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'top', chip: 'Top', heading: 'Top position', kind: 'posture',   // card zoom key: top position
    // zoom shell: crop centre on the right pose's hip; the Wrong is the short lift dashed over the end pose.
    crop: { center: { at: 'hip.r', pose: 'right', off: [10, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: SHORT },
    callout: {
      right: { text: 'Knees above hips', anchor: 'knee.r' },
      wrong: { text: 'Stopped at hips', anchor: { at: 'knee.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Knees above hip height, pelvis curled up.',
      wrong: 'Knees stopped at hip height, pelvis not curled.',
    },
    alt: {
      right: 'Side view, top of the rep. Knees above hip height, pelvis curled up, lower back gently rounded.',
      wrong: 'Side view. The knees stop level with the hips and the pelvis stays flat.',
    },
    feelRow: 'hips',
  },
  {
    key: 'body-line', chip: 'Body line', heading: 'Body line', kind: 'posture',   // card zoom key: body line
    // zoom shell: crop centre on the right pose's hip. W3 LAYERS FIX (#384 6648454032, L5): the Wrong draws the still
    // pose solid with the spec's Mistake (the whole body swung back under the bar) as a dashed ghost over it, and the
    // plate Mistake's own curved arrow (specs/hanging_knee_raise.mjs mistake.guides: arc-arrow about the grips), so the
    // swing reads as movement, not a static tilt. c4 (card plate.mistake).
    crop: { center: { at: 'hip.r', pose: 'right', off: [-5, -40] }, sizePx: 230 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: [{ kind: 'arc-arrow', center: 'grips', r: 100, a0: 118, a1: 140 }],
    callout: {
      right: { text: 'Body still', anchor: 'hip.r' },
      wrong: { text: 'Body swings', anchor: { at: 'hip.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Body still under the bar on every rep.',
      wrong: 'Body swinging to kick the legs up.',
    },
    alt: {
      right: 'Side view. The body hangs still under the bar as the knees lift.',
      wrong: 'Side view. The body swings back under the bar to kick the legs up. Drawn dashed over the still position.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'abs', plain: 'The abs, down the front of the belly, are the target.' },
  ],
  secondary: [
    { muscleId: 'hip_flexors', plain: 'The hip flexors do the leg lifting.' },
    { muscleId: 'obliques', plain: 'The obliques, at the sides of the belly, work hard too.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'The lower back stays quiet in this exercise.' },
  ],
  feelLine: 'You should feel this in your belly and the front of your hips.',
  rows: [
    { key: 'hips', where: 'Mostly the front of the hips', at: { muscles: ['hip_flexors'] },
      means: 'Knees stop near hip height, so the hip flexors do the lifting.',
      fix: 'Lift the knees higher and curl the pelvis up at the top.',
      zoom: 'top', claim: CL.c6 },
    { key: 'grip', where: 'Forearms give out first', at: { muscles: ['forearms'] },
      means: 'The arm-strap version showed some of the highest ab activity.',
      fix: 'Use arm straps (ab slings), the version with some of the highest ab activity.',
      claim: CL.c10 },
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Straight legs measured about 3000 N spine load, bent knees likely less.',
      fix: 'Keep the knees bent.',
      zoom: 'body-line', redFlag: 'back', claim: CL.backRow },
    { key: 'shoulder', where: 'Shoulder', at: {},   // pain, not a muscle taking over: no map mark (golden B pull_up)
      means: 'Arms high overhead narrow the space under the shoulder roof.',
      fix: 'Pull your shoulder blades down and back. If it hurts, stop the set.',
      redFlag: 'shoulder', claim: CL.shoulderRow },
  ],
  libraryDiff: { add: ['obliques'], why: 'Oblique activity was among the highest in the strapped hanging knee-up (card c10).' },
  claim: C(['DATA', 'CONSENSUS'], ['escamilla-2006', YS, SL], 'c10, c12'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'swing', title: 'Swinging the body', zoom: 'body-line', claim: CL.swing,
    fix: 'Start each rep from a still hang. Lower with control.' },
  { key: 'short', title: 'Knees stop at hip height', zoom: 'top', claim: CL.c6,
    fix: 'Lift past hip height and roll your hips up.' },
  { key: 'drop', title: 'Dropping the legs fast', claim: CL.c8,
    fix: 'Lower the legs with control.' },
];
const RISKS = [
  { key: 'spine', text: 'The straight-leg version measured about 3000 N of spine compression.', claim: CL.c14 },
  { key: 'shoulder', text: 'A long hang with arms overhead narrows the space under the shoulder roof.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_hanging_knee_raise',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'hang'
    orientation: 'pronated',         // c2: overhand, palms away; the key's orientation 'over'
    handle: 'bar-32',                // the key's BAR32 (pullupBar, hand-bar.mjs:10)
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Hands about shoulder width.', claim: C(['MECH', 'WEAK'], ['bullbar-calluses'], 'c18') },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // 'wrapped' (c3); THUMB === hanging_leg_raise's
    contact: CONTACT,                // 'finger-base' (c17; the key's ga:hang-base)
    wrist: { ext: V.wristRange, limitText: 'Keep your wrist from curling forward.', claim: CL.wrist },
    pose: RIGHT_POSE,
    faults: FAULTS,
    gripLine: 'Overhand, bar just below the base of your fingers, thumbs wrapped. Arms fully straight.',   // c2, c17, c3
    cue: 'Overhand, thumbs wrapped.',   // c2, c3
  },
  contacts: ['hang-support'],
  setup: [
    { kind: 'adjust', text: 'Use a bar high enough that you hang with straight legs.', claim: CL.c1 },
    { kind: 'grip', text: 'Take the bar overhand, hands shoulder width, thumbs wrapped.', zoom: 'hand', claim: CL.grip },
    { kind: 'position', text: 'Hang with straight arms and let your body go still.', zoom: 'body-line', claim: CL.c4 },
    { kind: 'brace', text: 'Pull your shoulder blades down and back as you hang.', claim: CL.c19 },
    { kind: 'load', text: 'New to it? Keep the knees bent until this is easy.', claim: CL.c13 },
  ],
  posture: [
    { key: 'still', label: 'Still start', detail: 'Still hang, arms straight, before every rep.',
      anchor: { landmark: 'knee.r', pose: 'start' }, zoom: 'body-line', claim: CL.c4 },
    { key: 'knees', label: 'Knees above hips', detail: 'Knees lift above hip height, with a brief hold.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'top', claim: CL.c5 },
    { key: 'curl', label: 'Pelvis curls', detail: 'Pelvis curls back at the top.',
      anchor: { landmark: 'sacrum', pose: 'end' }, zoom: 'top', claim: CL.curl },
    { key: 'lower', label: 'Controlled lowering', detail: 'Legs lowered under control.',
      anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.c8 },
    { key: 'wrists', label: 'Wrists level', detail: 'Wrists not curled forward.',
      anchor: { landmark: 'wrist.r', pose: 'start' }, zoom: 'hand', claim: CL.wrist },
  ],
  feel,
  zooms,
  chips: ['hand', 'top', 'body-line', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hang overhand with straight arms and a still body. Lift the knees above your hips.',
    mistakeLine: "Don't swing to kick the legs up. Start each rep still.",
    cueLine: 'Knees up, pelvis curls.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back', 'shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/hanging_knee_raise.json', rev: 1 },
};
