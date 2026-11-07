// LIB-SHIP W5: the How-to content of lib_straight_bar_triceps_pushdown (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/straight_bar_triceps_pushdown.json (cited in its field's claim, cN = card claim id).
// Parent: triceps_pushdown (card parent; staged sheet lib_triceps_pushdown.howto.mjs). Inherited fields per INHERIT_MAP
// (tools/plates/library/lint/family.mjs, SHIP W5 PLAN RULED #392 6647901307): handling.thumb.mode, the whole
// handling.wrist, the pushdown-elbow zoom's chip, heading, caption, callout texts and alt, and riskFlags are `===` the
// parent's; plate.view and plate.equipment are plate-only (`[]`, D-SHIP-W5-PLATEONLY). The pushdown-elbow zoom crops this
// row's OWN plate (stills from specs/straight_bar_triceps_pushdown.mjs, the parent's poses through templates/PUSHDOWN.mjs;
// anchors at the same landmarks, Q-W3-3).
// No hand zoom (D-SHIP-C3 no-zoom list, D-SHIP-HANDW5, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's
// hand zoom `pushdown-wrist` (c9, c2) is a push heel-of-palm pair that golden B's engine cannot draw (D-LIB7-19), as on
// the parent (D-SHIP-HANDW2). Its right line ("Overhand full grip, thumbs wrapped, hands in line with forearms", c9, c2;
// Q-W5-3) is this row's own Grip copy (handling.gripLine, wrist.limitText) and setup step 2. Its wrong is null (LR-25).
// GRIP (c) (D-SHIP-GRIP, Q-W5-7): the card leaves grip.handContact empty. The contact and the wrist range are read at
// import from the push key's convention, tools/plates/library/hands/pairs.mjs CONVENTIONS['ga:push-heel'], cited as
// CONVENTION (source ga-push-heel), data only, never printed (D-SHIP-CONVCOPY).
// Red flags: the card's redFlags (elbow, back). The elbow box is golden B's shared block; the back box is LIB-5's
// (tools/plates/library/shared/back-box.mjs), linked by the lower-back row's redFlag: 'back'.
// No variant line (exercises.json equipment 'Cable').
import plateSpec from '../specs/straight_bar_triceps_pushdown.mjs';
import { RED_FLAG, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'ace-pressdown': { cite: 'How To Do a Tricep Pressdown (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/333/tricep-pressdown/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-pushdown': { cite: 'How to Do Tricep Pushdown With Bar: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/tricep-pushdown-with-bar/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hussain-2020': { cite: 'Muscle Fatigue in the Three Heads of Triceps Brachii During Intensity and Speed Variations of Triceps Push-Down Exercise', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC7047337/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-10-22', use: 'DATA' },
  'ace-pushdown': { cite: 'Triceps Pushdowns (ACE Exercise Library)', url: 'https://www.acefitness.org/resources/everyone/exercise-library/185/triceps-pushdowns/',
    kind: 'guideline', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'acsm-2009': { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  // The push key's own source for the hand contact (the card has no grip.handContact): a drawing convention.
  'ga-push-heel': { cite: 'LIB-7 push hand convention, pairs.mjs CONVENTIONS ga:push-heel: heel of the palm, extension 0 to 15', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // RED_FLAG_ELBOW's own source (layers/howto/shared.mjs), as golden B's machine_chest_press lists it: the card's redFlags 'elbow'.
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
  // The back box's own source (shared/back-box.mjs, docs/research/howto/shared/back-pain-box.json sources): the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c12 (tempo, a plate drawing convention), c13 (breathing), c18 (load progression). c20 and c21 (the card's
// NHS data-only lines, R-LB5-2) are carried by the shared back and elbow boxes, whose own sources are listed below, as
// on the parent sheet; their card source ids are not listed (the 'Back pain' cite would name the box's own heading).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-pushdown', SL = 'sl-pushdown', HU = 'hussain-2020';
const CL = {
  c1: C(['CONSENSUS'], ['ace-pressdown'], 'card c1'),
  c2: C(['CONSENSUS'], [SL, HU, ACE], 'card c2'),
  c3: C(['CONSENSUS'], [ACE, SL], 'card c3, c2'),
  c5: C(['CONSENSUS'], [ACE, SL], 'card c5'),
  c6: C(['CONSENSUS'], [ACE], 'card c6, c5'),
  c7: C(['CONSENSUS'], [SL, ACE], 'card c7'),
  c8: C(['CONSENSUS'], [SL, ACE], 'card c8'),
  c9: C(['CONSENSUS'], [ACE], 'card c9'),
  c11: C(['CONSENSUS'], [SL], 'card c11'),
  c14: C(['CONSENSUS'], [SL, HU], 'card c14'),
  c15: C(['DATA'], [HU], 'card c15'),
  c16: C(['CONSENSUS'], [SL], 'card c16'),
  c17: C(['CONSENSUS'], [SL], 'card c17'),
  c19: C(['CONSENSUS'], [ACE], 'card c19'),
  torso: C(['CONSENSUS'], [SL, ACE], 'card c4, c3'),
  clear: C(['CONSENSUS'], [SL, HU], 'card c10, c4'),
  lean: C(['CONSENSUS'], [SL, ACE], 'card c11, c3, c4'),
  elbows: C(['CONSENSUS'], [ACE, SL], 'card c6, c5, c7'),
  brace: C(['CONSENSUS'], [SL, ACE], 'card c7, c19'),
  press: C(['CONSENSUS'], [SL, ACE, HU], 'card c8, c10, c4'),
  backRow: C(['CONSENSUS'], [SL], 'card c11, c4 (c20: the back box)'),
  elbowRow: C(['CONSENSUS'], [SL], 'card c17 (c21: the elbow box)'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the contact and wrist range DERIVED at import from the push key's convention text, as lib_triceps_pushdown
// does (Q-W2-2 form), so they cannot drift from it. HandContact names the palm zone 'heel of the palm' as 'heel'
// (src/howto/content-types.ts HandContact); a convention that names no mapped zone throws. pairs.mjs is not imported
// (its closure pulls howto-layers.mjs, which the MANIFEST closure cannot follow); the text is copied here.
const PUSH_HEEL = 'GA 3.1 push: heel of the palm, low, over the forearm; extension 0 to 15';   // CONVENTIONS['ga:push-heel']
const CONTACT_OF_ZONE = { 'heel of the palm': 'heel' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PUSH_HEEL.includes(zone))?.[1];
const EXT = PUSH_HEEL.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
if (!CONTACT || !EXT) throw new Error(`lib_straight_bar_triceps_pushdown: pairs.mjs CONVENTIONS ga:push-heel has no mapped contact or range: ${PUSH_HEEL}`);

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From this row's own plate spec poses (the parent's, through templates/PUSHDOWN.mjs). 'elbows-forward' (card zoom
// pushdown-elbow Wrong, c6: "Elbows drifted forward, upper arms swung up"): the start pose with the arm of the spec's own
// Mistake pose (upper arm swung forward, elbow bend), the trunk left as at the start, so only the elbows move.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2, golden B's machine_chest_press seatDrop and
// lib_triceps_pushdown's elbows-forward): the spec's Mistake shoulder flex (25) and elbow (75) size the elbows-forward
// Wrong; no card gives them, no number appears in user copy; the layers panel judges them.
const { start: START, end: END } = plateSpec.poses, MIS = plateSpec.mistake.pose;
const ELBOWS_FORWARD = { reach: null, shoulder: { flex: MIS.shoulder.flex }, elbow: MIS.elbow, wrist: 0 };
export const stills = {
  start: { pose: START },
  end: { pose: END },
  'elbows-forward': { pose: { ...START, ...ELBOWS_FORWARD } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `pushdown-wrist` (D-SHIP-HANDW5, above). chip, heading, caption, callout texts
// and alt are the parent's, `===` (INHERIT_MAP; card zooms[1] is the parent's straight-bar picture, c6). Crop and anchors
// on this row's own plate, at the parent's landmarks (elbow.r).
const zooms = [
  {
    key: 'pushdown-elbow', chip: 'Elbows', heading: 'Elbow position', kind: 'posture',
    crop: { center: { at: 'elbow.r', pose: 'right', off: [10, 0] }, sizePx: 140 },
    right: 'start',
    wrong: { base: 'start', pose: ELBOWS_FORWARD, solid: true },
    callout: {
      right: { text: 'Elbows at sides', anchor: 'elbow.r' },
      wrong: { text: 'Drifted forward', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Elbows against the sides at the top of the return.',   // card zooms[1] right (c6)
      wrong: 'Elbows drifted forward, upper arms swung up.',         // card zooms[1] wrong (c6)
    },
    alt: {
      right: 'Side view, top of the pushdown. Upper arms hang down against the sides, bar at upper-chest level.',   // c5, c7
      wrong: 'Side view, top of the pushdown. The upper arms swing forward and up, so the elbows leave the sides.',  // c6
    },
    feelRow: 'lats',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'All three heads of the triceps work.' }],
  secondary: [],   // the card names none (its libraryDiff: the library's forearms are kept but unsourced, so not shown)
  watch: [],
  feelLine: 'You should feel this in the back of your upper arms.',
  rows: [
    // The card's first row (back of the upper arm) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'lats', where: 'Sides of the back', at: { muscles: ['lats'] },
      means: 'Your elbows drift forward, which brings in the lats.',
      fix: 'Pin the elbows to your sides.',
      zoom: 'pushdown-elbow', claim: CL.c6 },
    { key: 'lower-back', where: 'Lower back pain', at: { muscles: ['lower_back'] },
      means: '',   // D-FEEL-NOMEANS: the card's row means is a question with no cause (audit6 issue 1)
      fix: "Stop and don't train through the pain. Stand taller, tilt only from the hips.",
      redFlag: 'back', claim: CL.backRow },
    { key: 'elbows', where: 'Elbow discomfort or pain', at: { parts: ['elbow-left', 'elbow-right'] },
      means: '',   // D-FEEL-NOMEANS: the card's row means is a question with no cause (audit6 issue 1)
      fix: "Stop and don't train through the pain. Use lighter weights for more reps.",
      redFlag: 'elbow', claim: CL.elbowRow },
  ],
  claim: CL.c15,
};

/* ------------------------------------------------------------------------------------------------ mistakes, risks */
const MISTAKES = [
  { key: 'lean', title: 'Leaning over or arching back', claim: CL.lean,
    fix: 'Stand taller. Tilt only from the hips.' },
  { key: 'elbows-forward', title: 'Elbows drifting forward', zoom: 'pushdown-elbow', claim: CL.elbows,
    fix: 'Keep the elbows at your sides. Stop the return at upper-chest level.' },
  { key: 'heavy', title: 'Too heavy, moved with momentum', claim: CL.c16,
    fix: 'Go lighter and move with control.' },
];
const RISKS = [
  { key: 'lean', text: 'Leaning or arching can strain the lower back.', claim: CL.c11 },
  { key: 'elbows', text: 'Heavy loads feel uncomfortable in the elbows for many people.', claim: CL.c17 },
  { key: 'weight', text: 'Too much weight moved with momentum can lead to injury.', claim: CL.c16 },
];

export default {
  schema: 1,
  id: 'lib_straight_bar_triceps_pushdown',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW5: the push heel-of-palm pair cannot be drawn by golden B\'s engine (D-LIB7-19), as on its parent triceps_pushdown; the grip copy carries c2 and c9.',
    orientation: 'pronated',   // c2: overhand, palms down
    handle: 'bar-28',          // the spec's straight bar (the parent's bar, templates/PUSHDOWN.mjs)
    overBody: false,
    // No width text: the Grip line says 'hands about shoulder-width' (c2; audit6 issue 6).
    thumb: { mode: 'wrapped', claim: CL.c2 },   // `===` the parent's mode (INHERIT_MAP grip.thumb)
    contact: CONTACT,          // 'heel', DERIVED from pairs.mjs CONVENTIONS ga:push-heel (CONVENTION, above); never printed
    // `===` the parent's handling.wrist (INHERIT_MAP grip.wrist): c9 gives no degrees ("neutral, in line with the
    // forearms"); EXT is the push key's convention range, read above, data only.
    wrist: { ext: EXT, limitText: 'Keep the wrists in line with the forearms.',
      claim: C(['CONSENSUS', 'CONVENTION'], [ACE, 'ga-push-heel'], 'card c9. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    // The card's hand zoom wrong is null (LR-25: no read source names wrists bent back over the bar), so this row has
    // no hand fault; the parent's 'bent-back' alt is not carried over.
    faults: [],
    // card zooms[0] right (c9, c2; Q-W5-3): overhand full grip, thumbs wrapped (here); hands in line with the forearms
    // (wrist.limitText, the grey line under it, so the lead does not repeat it: audit6 issue 6).
    gripLine: 'Overhand full grip, hands about shoulder-width, thumbs wrapped.',
    cue: 'Wrist in line with the forearm.',   // hint F (grip.wrist, c9)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the pulley at the top position and attach a straight bar.', claim: CL.c1 },
    { kind: 'grip', text: 'Grip the bar overhand, hands shoulder-width, thumbs wrapped.', claim: CL.c2 },
    { kind: 'position', text: 'Stand facing the machine, feet hip- to shoulder-width or staggered, core braced.', claim: CL.c3 },
    // D-TEXT-GOLDEN: posture shoulders (c19) placed here with the card's setup step 4 (c7)
    { kind: 'brace', text: 'Bar at upper chest, elbows at sides, shoulders down and back.',
      zoom: 'pushdown-elbow', claim: CL.brace },
    // D-TEXT-GOLDEN: posture lockout (c8; 'not locked' is the plate's own elbow measure) and clear (c10, c4) placed here.
    // The card's setup step 5 (c16, pick a weight you can move with control) stays visible as mistake 3's fix and risk 3.
    { kind: 'position', text: 'Press down to straight arms, hips tilted slightly so the bar clears.', claim: CL.press },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows pinned', detail: 'Elbows stay close to your sides.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'pushdown-elbow', claim: CL.c5 },
    { key: 'torso', label: 'Hip lean only', detail: 'Back straight. Any lean comes from the hips, not an arched back.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.torso },
    { key: 'wrists', label: 'Neutral wrists', detail: 'Wrists neutral throughout.',
      anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c9 },
    { key: 'shoulders', label: 'Shoulders down', detail: 'Shoulders down and back.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c19 },
    { key: 'lockout', label: 'No hard lockout', detail: 'Push the bar straight down to straight arms without locking the elbows.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c8 },
    { key: 'clear', label: 'Bar clears body', detail: 'Lean slightly from the hips so the bar clears your body.',
      anchor: { landmark: 'hips', pose: 'end' }, claim: CL.clear },
  ],
  feel,
  zooms,
  chips: ['pushdown-elbow', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Straight bar on the top pulley, overhand grip. Elbows at your sides, shoulders down and back.',
    mistakeLine: 'Keep your elbows at your sides. Lean only from the hips, never by arching your back.',
    cueLine: 'Elbows pinned to your sides.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['elbow', 'back'],   // the card's redFlags, in its order; `===` the parent's (INHERIT_MAP redFlags)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/straight_bar_triceps_pushdown.json', rev: 1 },
};
