// LIB-SHIP W3: the How-to content of lib_inverted_row (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/inverted_row.json; its claim ids are named on each field's claim.
// Hand zoom (D-SHIP-GRIP case (a)): the card zoom `hand` is drawn by the approved `bar` pair key, variant 'row',
// orientation 'over' (tools/plates/library/hands/hand-bar.mjs:38 IDS.inverted_row; pullVariant, radial-rules.mjs:43-55,
// handle BAR32). The card leaves grip.handContact to the shared pull archetype ("not re-sourced on this card"): the
// contact is the key's convention 'ga:pull-base' (hands/pairs.mjs CONVENTIONS), cited CONVENTION, never DATA. The key
// module is not imported (D-LIB7FIX-PERKEY closure, W2 form): its record is copied here and pinned against the live key
// by tests/howto/lib-ship.test.ts. The Right/Wrong notes are the pair panel's words (hands/words/bar-row-over.json).
// Red flags: the card's redFlags (back): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by the
// lower-back row's redFlag: 'back'.
import plateSpec from '../specs/inverted_row.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'strengthlog-inverted-row': { cite: 'How to Do Inverted Row: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/inverted-row/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'ace-best-back': { cite: 'ACE-Sponsored Research: What Is the Best Back Exercise? (Edelburg, Porcari, Camic, Kovacs, Foster, with Green; ACE Certified, December 2018)', url: 'https://www.acefitness.org/continuing-education/certified/december-2018/7138/ace-sponsored-research-what-is-the-best-back-exercise/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'catalyst-inverted-row': { cite: 'Inverted Row (Catalyst Athletics exercise library)', url: 'https://catalystathletics.com/exercise/852/Inverted-Row/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'catalyst-ring-row': { cite: 'Ring Row (Catalyst Athletics exercise library)', url: 'https://catalystathletics.com/exercise/879/Ring-Row',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'youdas-2016': { cite: 'Activation of Spinal Stabilizers and Shoulder Complex Muscles During an Inverted Row Using a Portable Pull-up Device and Body Weight Resistance (Youdas et al., J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/26422610/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'fenwick-2009': { cite: 'Comparison of different rowing exercises: trunk muscle activation and lumbar spine motion, load, and stiffness (Fenwick, Brown, McGill, J Strength Cond Res)', url: 'https://pubmed.ncbi.nlm.nih.gov/19620925/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'youdas-2020': { cite: 'Scapular muscle balance and spinal stabilizer recruitment during an inverted row (Youdas et al., Physiother Theory Pract)', url: 'https://pubmed.ncbi.nlm.nih.gov/29944029/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'hk-baechle-grip': { cite: 'Grip selection and location, excerpt from Weight Training: Steps to Success, 5th ed. (Baechle and Earle, Human Kinetics)', url: 'https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location',
    kind: 'textbook', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'odriscoll-1992': { cite: "The relationship between wrist position, grasp size, and grip strength (O'Driscoll et al., J Hand Surg Am)", url: 'https://pubmed.ncbi.nlm.nih.gov/1538102/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'MECH' },
  // The bar key's own source for the hand contact (the card leaves it to the pull archetype): a drawing convention.
  'hand-key-bar': { cite: 'LIB-7c hand pair key bar (row), CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm; extension 0 to 25', url: 'tools/plates/library/hands/hand-bar.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c6 (tempo, plate only), c10 (kept on the card only to stop a claim on which grip works the lats more).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'strengthlog-inverted-row', ACE = 'ace-best-back', CAT = 'catalyst-inverted-row', KEYSRC = 'hand-key-bar';
const CL = {
  c1: C(['CONSENSUS'], [SL, ACE], 'c1'),
  c3: C(['CONSENSUS'], [CAT, ACE], 'c3'),
  c4: C(['CONSENSUS'], [SL, ACE], 'c4'),
  c5: C(['CONSENSUS'], [CAT, SL], 'c5'),
  c7: C(['CONSENSUS'], [SL, 'catalyst-ring-row', CAT], 'c7'),
  c13: C(['CONSENSUS'], ['catalyst-ring-row'], 'c13'),
  thumb: C(['CONSENSUS'], ['hk-baechle-grip'], 'c14'),
  grip: C(['CONSENSUS'], [ACE, 'youdas-2016', SL, 'hk-baechle-grip'], 'c2, c14'),
  hang: C(['CONSENSUS'], [CAT, ACE, SL], 'c3, c1'),
  sag: C(['CONSENSUS'], [CAT, ACE, SL], 'c3, c7'),
  short: C(['CONSENSUS'], [SL, ACE], 'c4, c7'),
  conv: C(['CONVENTION'], [KEYSRC], 'the bar key\'s ga:pull-base (the card leaves grip.handContact to the pull archetype)'),
  wrist: C(['MECH', 'CONVENTION'], ['odriscoll-1992', KEYSRC], 'c15. The ext range is the bar key\'s row wristRange (ga:pull-base), a convention, not a card number.'),
  backRow: C(['DATA', 'CONSENSUS'], ['youdas-2020', CAT, ACE, 'nhs-back'], 'c12, c3. The referral is LIB-5\'s back box (NHS).'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The bar key's record for this id and its variant, copied (hand-bar.mjs:38 IDS.inverted_row; VARIANTS.row =
// pullVariant, radial-rules.mjs:43-55).
const KEYED = { variant: 'row', orientation: 'over', faults: ['curled'] };   // IDS.inverted_row
const V = {                                                               // VARIANTS.row
  archetype: 'pull', loadAxis: 'across', wristRange: [0, 25], contact: 'base',
  right: { view: 'radial', forearm: 180, wrist: { ext: 5, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
  rightNote: 'Base of fingers',
  faults: { curled: { label: 'Wrist curled', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], alt: 'Wrist curled forward toward the forearm.' } },
};
const RIGHT_POSE = V.right;
const FAULTS = KEYED.faults.map(key => {
  const f = V.faults[key];
  return { key, label: f.label, pose: { ...f.pose, wrist: { dev: RIGHT_POSE.wrist.dev, ...f.pose.wrist } }, markers: f.markers, alt: f.alt };
});
// CONVENTION (D-SHIP-GRIP (a)): the key's contact 'base' (ga:pull-base) is HandContact 'finger-base'; an unmapped key
// word throws.
const CONTACT = { base: 'finger-base' }[V.contact];
if (!CONTACT) throw new Error('lib_inverted_row: the bar key no longer records this sheet\'s contact');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: start (straight arms under the bar, c3), end (chest to the bar, c4) and the spec's
// Mistake merged over the end (hips sagging; card plate.mistake, c3), which is the card zoom body line's Wrong.
// DRAWING VALUES (D-SHIP-DRAWVAL; precedent D-LIB7-2): the card zoom `top position` Wrong (chest well short of the bar,
// c4) is the end pose with the body half-way between the plate's start and end (root position and tilt averaged; the
// hands stay on the bar through the plate's reach). No card gives a distance; no number appears in user copy; the
// layers panel judges it.
const S = plateSpec.poses.start, E = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
const mid = (a, b) => +((a + b) / 2).toFixed(4);
const SHORT = { root: { at: E.root.at.map((v, i) => mid(S.root.at[i], v)), tilt: mid(S.root.tilt, E.root.tilt) } };
export const stills = {
  start: { pose: S },
  end: { pose: E },
  sag: { pose: { ...E, ...MIS } },
  short: { pose: { ...E, ...SHORT } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same kinds; the hand zoom's key is 'hand' and its heading the shared pair heading (D-SHIP-Q3,
// hands/words/bar-row-over.json). The posture zooms are in the zoom shell's shape (render/closeup/crop.mjs).
const zooms = [
  {
    key: 'hand', chip: 'Hand', heading: 'Hand: right and wrong', kind: 'hand',   // card zoom key: hand
    hand: {
      right: RIGHT_POSE,
      wrong: FAULTS,
      camera: 'side',               // pairs.mjs ORIENTATIONS.over
      // CONVENTION (D-SHIP-GRIP (a)): 'Base of fingers' is the bar key's ga:pull-base note, source hand-key-bar.
      notes: { right: V.rightNote, wrong: FAULTS[0].label },   // words/bar-row-over.json
    },
    caption: {
      right: 'Overhand, bar across the fingers, thumb wrapped.',
      wrong: 'Wrist curled forward.',
    },
    // the key's alt (pullVariant), split in two sentences for the 15-word sentence cap
    // CONVENTION (D-SHIP-GRIP (a)): the contact in this alt is the bar key's ga:pull-base, source hand-key-bar.
    alt: { right: 'Bar across the base of the fingers, thumb wrapped. Back of the hand in line with the forearm.', wrong: FAULTS[0].alt },
  },
  {
    key: 'body-line', chip: 'Body line', heading: 'Body line', kind: 'posture',   // card zoom key: body line
    // zoom shell: crop centre on the right pose's buttock; the Wrong is the spec's Mistake dashed over the end pose, as
    // `stills.sag`.
    crop: { center: { at: 'buttock', pose: 'right', off: [0, 0] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Body straight', anchor: 'buttock' },
      wrong: { text: 'Hips sag', anchor: { at: 'buttock', pose: 'mistake' } },
    },
    caption: {
      right: 'Heels, hips and shoulders in one straight line.',
      wrong: 'Hips sagging toward the floor.',
    },
    alt: {
      right: 'Side view, top of the row. Heels, hips and shoulders in one straight line under the bar.',
      wrong: 'Side view. The hips sag toward the floor, so the body bends at the hips.',
    },
    feelRow: 'low-back',
  },
  {
    key: 'top', chip: 'Top', heading: 'Top position', kind: 'posture',   // card zoom key: top position
    // zoom shell: crop centre on the right pose's chest; the Wrong is the short pull dashed over the end pose.
    crop: { center: { at: 'chest', pose: 'right', off: [0, 10] }, sizePx: 180 },
    right: 'end',
    wrong: { base: 'end', pose: SHORT },
    callout: {
      right: { text: 'Chest to bar', anchor: 'chest' },
      wrong: { text: 'Short of bar', anchor: { at: 'chest', pose: 'mistake' } },
    },
    caption: {
      right: 'Chest touching the bar, shoulder blades squeezed back.',
      wrong: 'Chest well short of the bar.',
    },
    alt: {
      right: 'Side view, top of the row. The chest touches the bar, shoulder blades squeezed back and down.',
      wrong: 'Side view. The pull stops with the chest well short of the bar.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'mid_back', plain: 'The middle back, between the shoulder blades, is a main target.' },
    { muscleId: 'lats', plain: 'The lats work hard too.' },
  ],
  secondary: [
    { muscleId: 'biceps', plain: 'The biceps work very hard in this row.' },
    { muscleId: 'rear_delts', plain: 'The rear delts work very hard too.' },
  ],
  watch: [
    { muscleId: 'lower_back', plain: 'The lower back works to hold the straight line.' },
  ],
  // The card's rows "Between and around the shoulder blades" and "Front of your upper arms" are expected feelings with
  // nothing to fix, so they are left off the rows (D-SHIP-Q16); the feel line says them.
  feelLine: 'You should feel this between your shoulder blades and down the sides of your back.',
  rows: [
    { key: 'low-back', where: 'Lower back and trunk', at: { muscles: ['lower_back'] },
      means: 'Usually means the trunk is working hard to hold the line.',
      fix: 'Keep the body rigid. Raise the bar if the line breaks.',
      zoom: 'body-line', redFlag: 'back', claim: CL.backRow },
  ],
  libraryDiff: { add: ['rear_delts'], why: 'The rear deltoid worked over 61 percent of max in every version (card c9); the lats move to primary (c8, c9).' },
  claim: C(['DATA'], [ACE, 'fenwick-2009', 'youdas-2016'], 'c11, c8, c9'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'sag', title: 'Hips sagging', zoom: 'body-line', claim: CL.sag,
    fix: "Keep your whole body rigid. Can't? Raise the bar." },
  { key: 'short', title: 'Stopping short of the bar', zoom: 'top', claim: CL.short,
    fix: 'Pull until your chest touches the bar.' },
  { key: 'drop', title: 'Dropping back down fast', claim: CL.c5,
    fix: 'Lower yourself with control to straight arms.' },
];
const RISKS = [
  { key: 'joints', text: 'Stiff shoulders or arms? Rings let them move more freely than a bar.', claim: CL.c13 },
];

export default {
  schema: 1,
  id: 'lib_inverted_row',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'pull'
    orientation: 'pronated',         // c2, grip.type: overhand drawn; the key's orientation 'over'
    handle: 'bar-32',                // the key's BAR32 (hand-bar.mjs:10)
    loadAxis: V.loadAxis,            // 'across'
    width: { text: 'Slightly wider than shoulder width.', claim: C(['CONSENSUS'], [ACE, 'youdas-2016', SL], 'c2') },
    thumb: { mode: RIGHT_POSE.thumb, claim: CL.thumb },   // 'wrapped' (c14; the key's right pose)
    contact: CONTACT,                // 'finger-base', CONVENTION: the key's ga:pull-base (source hand-key-bar); the card gives none
    wrist: { ext: V.wristRange, limitText: 'Keep your wrist level, not curled forward.', claim: CL.wrist },
    pose: RIGHT_POSE,
    faults: FAULTS,
    // CONVENTION (D-SHIP-GRIP (a)): 'across the base of your fingers' is the bar key's ga:pull-base, source hand-key-bar;
    // overhand c2, thumbs c14, wrists c15.
    gripLine: 'Overhand, bar across the base of your fingers, thumbs wrapped. Wrists not curled.',
    cue: 'Overhand, thumbs wrapped.',   // c2, c14
  },
  contacts: ['hang-support'],
  setup: [
    { kind: 'adjust', text: 'Set a bar in a rack at about waist height.', claim: CL.c1 },
    { kind: 'grip', text: 'Overhand, slightly wider than your shoulders, thumbs wrapped.', zoom: 'hand', claim: CL.grip },
    { kind: 'position', text: 'Hang under it, body straight from head to heels.', zoom: 'body-line', claim: CL.hang },
    { kind: 'brace', text: 'Pull your shoulder blades back and down as you row.', claim: CL.c3 },
    { kind: 'load', text: 'Too hard? Raise the bar. Too easy? Feet on a box.', claim: CL.c7 },
  ],
  posture: [
    { key: 'line', label: 'Body rigid', detail: 'Body rigid and straight, heels to head.',
      anchor: { landmark: 'buttock', pose: 'end' }, zoom: 'body-line', claim: CL.c3 },
    { key: 'arms', label: 'Straight arms', detail: 'Arms fully straight at the bottom.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c3 },
    { key: 'chest', label: 'Chest to bar', detail: 'Chest to the bar at the top.',
      anchor: { landmark: 'chest', pose: 'end' }, zoom: 'top', claim: CL.c4 },
    { key: 'blades', label: 'Blades back', detail: 'Shoulder blades back and down at the top.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c3 },
    { key: 'lower', label: 'Slow lowering', detail: 'Lower slowly, under control.',
      anchor: { landmark: 'hip.r', pose: 'start' }, claim: CL.c5 },
    { key: 'wrists', label: 'Wrists level', detail: 'Wrists not curled forward.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, zoom: 'hand', claim: CL.wrist },
  ],
  feel,
  zooms,
  chips: ['hand', 'body-line', 'top', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hang under a waist-high bar, body straight from head to heels. Pull your chest to the bar.',
    mistakeLine: "Don't let your hips sag. Raise the bar if you can't hold the line.",
    cueLine: 'Body rigid, chest to bar.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/inverted_row.json', rev: 1 },
};
