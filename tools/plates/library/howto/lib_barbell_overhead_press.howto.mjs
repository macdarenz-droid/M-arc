// LIB-SHIP W1: the How-to content of lib_barbell_overhead_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/barbell_overhead_press.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-Q1, D-SHIP-C3): the card's hand zoom `bar-heel-of-palm` (c4) is a push heel-of-palm pair that
// golden B's engine cannot draw (D-LIB7-19); the id is on tools/plates/library/hands/no-zoom.json. Its hand claims
// (bar on the heel of the palm, wrist almost straight, thumb wrapped; c3, c4) live in handling and setup step 2.
// Red flags: the card's redFlags (shoulder, back). The shoulder box is golden B's shared block; the back box is LIB-5's
// (tools/plates/library/shared/back-box.mjs), linked by the low-back row's redFlag: 'back'.
import plateSpec, { ZOOM_WRONG } from '../specs/barbell_overhead_press.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-standing-sp': { cite: 'Standing Shoulder Press (barbell), ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/71/standing-shoulder-press/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'stronglifts-ohp': { cite: 'How to Overhead Press with Proper Form: The Definitive Guide (StrongLifts)', url: 'https://stronglifts.com/overhead-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'nsca-ch15-summary': { cite: 'NSCA CSCS Chapter 15 (Exercise Technique) study summary, PTPioneer', url: 'https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-15/',
    kind: 'secondary', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  saeterbakken2013: { cite: 'Effects of body position and loading modality on muscle activity and strength in shoulder presses', url: 'https://pubmed.ncbi.nlm.nih.gov/23096062/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2013: { cite: 'Characteristics of anterior shoulder instability and hyperlaxity in the weight-training population', url: 'https://pubmed.ncbi.nlm.nih.gov/22836608/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  esenkaya2000: { cite: 'Bilateral anterior shoulder dislocation in a weight lifter', url: 'https://pubmed.ncbi.nlm.nih.gov/20086631/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'WEAK' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: kerr2010 (c19, all weight training; no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'stronglifts-ohp';
const CL = {
  c1: C(['CONSENSUS'], ['ace-standing-sp'], 'c1'),
  c2: C(['CONSENSUS'], [SL], 'c2'),
  c3: C(['CONSENSUS'], [SL], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS', 'WEAK'], [SL], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [SL], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c9: C(['CONSENSUS'], [SL], 'c9'),
  c11: C(['CONSENSUS'], ['nsca-ch15-summary', SL], 'c11'),
  c13: C(['DATA'], ['saeterbakken2013'], 'c13'),
  c14: C(['DATA', 'WEAK'], ['kolber2013', 'esenkaya2000'], 'c14'),
  c16: C(['CONSENSUS'], ['acsm2009'], 'c16'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (bar on the front of the shoulders, forearms vertical, c5) and the start
// pose with the plate's Mistake arm (spec ZOOM_WRONG: bar on the front delts, elbow back under the shoulder and behind
// the bar, forearm tilted ~21 deg; card plate.mistake, c5).
const START = plateSpec.poses.start, WRONG = { reach: ZOOM_WRONG.reach };
export const stills = {
  start: { pose: START },
  end: { pose: plateSpec.poses.end },
  'elbows-back': { pose: { ...START, ...WRONG } },
};
// LIB-PLATEFIX-1 (W2 panel L5 [4,3,3], PR #385 6648438434): the Wrong is the Right's start pose with one change, the
// elbow behind the bar and the forearm tilted (c5), plus the forward-curving bar arrow; no lockout figure. The faulty arm
// lies over the torso in this side view, so the solid pose alone cannot show it; as on the plate, it is outlined dashed
// in the mistake colour (the spec's ZOOM_WRONG outlines: the arm shapes, the bar sleeve and the drift's end ring), and
// the drift is its open dashed path, drawn as a `path` guide with an arrow head. The outlines are drawn only on the
// Wrong crop's pose (the Right crop's grip is 7.5 cm from the faulty bar).
const OUTLINES = ZOOM_WRONG.outlines.map(pts => ({ kind: 'mis', pts }));
const WRONG_GRIP = landmarksOf({ ...START, ...WRONG }, 1.75)['grip.r'];
const onWrong = lm => Math.hypot(...lm['grip.r'].map((v, i) => v - WRONG_GRIP[i])) < 0.02;

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `bar-heel-of-palm` (D-SHIP-Q1, above). The crop window is set on the right
// still; it is wide enough for the start forearm and the Mistake bar in front of the face. Zoom shell shape
// (render/closeup/crop.mjs): crop centre on the right pose's shoulder for both halves; the Wrong is the elbows-back still
// drawn alone (solid), as `stills['elbows-back']`; each callout's anchor dot sits on the elbow, where the forearm starts.
const zooms = [
  {
    key: 'ohp-forearm-vertical', chip: 'Forearms', heading: 'Forearm angle', kind: 'posture',
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [14, -16] }, sizePx: 160 },
    right: 'start',
    wrong: { base: 'start', pose: WRONG, solid: true },
    guides: [{ kind: 'path', role: 'wrong', pts: ZOOM_WRONG.drift }],
    outlines: lm => ({ points: {}, lines: onWrong(lm) ? OUTLINES : [] }),
    callout: {
      right: { text: 'Forearms vertical', anchor: 'elbow.r' },
      wrong: { text: 'Elbows back', anchor: { at: 'elbow.r', pose: 'mistake' } },
    },
    // `cite`: the card claim ids of each half's callout, caption and alt (lint/index.mjs zoomCites; #385 6649353130):
    // Right c5 (elbows under the bar), c2 (forearms vertical at the bottom); Wrong c5 (elbows back, forearms tilted).
    cite: { right: ['c5', 'c2'], wrong: ['c5'] },
    caption: {
      right: 'Elbows under the bar, forearms vertical.',
      wrong: 'Elbows back, forearms tilted.',
    },
    alt: {
      right: 'Side view, bottom of the press. The bar rests on the front of the shoulders. The elbows sit under the bar and the forearms point straight up.',
      wrong: 'Side view, bottom of the press. The elbows sit back, behind the bar, so the forearms tilt. The bar path curves forward, away from the face.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders work in every shoulder press.' },
    { muscleId: 'side_delts', plain: 'The side of the shoulders work too.' },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm works more with a barbell than with dumbbells.' },
  ],
  watch: [],
  feelLine: 'You should feel this in the front and sides of your shoulders. Your triceps help.',
  rows: [
    // D-FEEL-MEANS-CAUSAL (#385 6648438434): the card row's own cause at c8's strength ("can result in back pain").
    { key: 'low-back', where: 'Low-back pain while pressing', at: { muscles: ['lower_back'] },
      means: 'Leaning back by arching the low back hard can cause back pain.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'back', claim: C(['CONSENSUS'], [SL], 'c8, c6') },
    { key: 'front-shoulder', where: 'Pain at the front shoulder', at: { muscles: ['front_delts'] },
      // W2 fix round (#385 6648438434, D-FEEL-MEANS-CAUSAL): c14 is an association, not a cause; c18 names technique.
      // The panel's two sentences joined by a colon: copy lint allows one sentence in a row's means (ROW_MEANS_MAX_SENTENCES).
      means: 'Could be technique: pressing behind the neck is linked to shoulder instability.',
      fix: "Stop and don't train through the pain. Press in front of your head.",
      redFlag: 'shoulder', claim: C(['DATA', 'WEAK'], ['kolber2010', 'kolber2013', 'esenkaya2000'], 'c18, c14') },
  ],
  claim: CL.c13,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'elbows', title: 'Pressing with elbows back', zoom: 'ohp-forearm-vertical', claim: CL.c5,
    fix: 'Move your elbows forward under the bar before you press.' },
  { key: 'arch', title: 'Leaning back, low back arching', claim: CL.c8,
    fix: 'The weight is too heavy: end the set.' },
  { key: 'thumbless', title: 'Thumbless grip', claim: CL.c3,
    fix: 'Wrap the thumbs.' },   // title and fix: c3 (W2 fix round, #385 6648438434)
];
const RISKS = [
  { key: 'thumbless', text: 'Bar falling on the head with a thumbless grip.', claim: CL.c3 },
  { key: 'arch', text: 'Over-arching the low back under a heavy bar can cause back pain.', claim: CL.c8 },
  { key: 'behind-neck', text: 'Pressing behind the neck is linked to shoulder instability.', claim: CL.c14 },
];

export default {
  schema: 1,
  id: 'lib_barbell_overhead_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-Q1: the push heel-of-palm pair cannot be drawn by golden B\'s engine (D-LIB7-19); the grip copy carries c3 and c4.',
    orientation: 'pronated',   // card grip.type: full grip, overhand (c3)
    handle: 'bar-28',          // the spec's 28 mm shaft
    overBody: true,            // c3: the bar is over the head, so a thumbless grip can drop it on the head
    width: { text: 'Grip just outside your shoulders, so your forearms are vertical at the bottom.', claim: CL.c2 },
    thumb: { mode: 'wrapped', claim: CL.c3 },
    contact: 'heel',           // c4: the bar rests on the heel of the palm, close to the wrist
    // c4 gives no degrees ("almost straight, not bent back"). The range is the push hand key's recorded convention
    // (tools/plates/library/hands/pairs.mjs CONVENTIONS 'ga:push-heel': extension 0 to 15), not a card number.
    wrist: { ext: [0, 15], limitText: 'Bar in mid-palm bends your wrist back. Keep it on the heel.',
      claim: C(['CONSENSUS'], [SL], 'c4. The ext range is pairs.mjs CONVENTIONS ga:push-heel, a convention, not a card number.') },
    faults: [
      // card zoom wrong (c4). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Bar in mid-palm, wrist bent back.' },
    ],
    gripLine: 'Full grip, thumbs wrapped, bar on the heel of your palm. Your wrist stays almost straight.',
    gripCite: ['c3', 'c4'],   // the gripLine's card claim ids (#385 6648438434; lint/index.mjs zoomCites, #385 6649353130)
    cue: 'Palm heel, wrist not bent back.',   // PLAN section 4, text B (c4)
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'safety', text: 'In the power rack, set the crossbars. Bar at shoulder height.', claim: C(['CONSENSUS'], ['nsca-ch15-summary', SL, 'ace-standing-sp'], 'c11, c1') },
    { kind: 'grip', text: "Grip just outside the shoulders, thumbs wrapped, bar on the palm's heel.", claim: C(['CONSENSUS'], [SL], 'c2, c3, c4') },
    // D-TEXT-GOLDEN (#385 6637650243): posture 'Hips and knees locked.' (c9) had no visible slot; the forearms stay on the
    // plate label, the zoom caption and the Grip width (c5, c2).
    { kind: 'position', text: 'Feet hip-width and flat. Hips and knees locked, elbows under the bar.', zoom: 'ohp-forearm-vertical', claim: C(['CONSENSUS', 'WEAK'], [SL], 'c10, c9, c5') },
    { kind: 'safety', text: 'Failed rep? Lower the bar to your shoulders, then rack it.', claim: CL.c11 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c16 },
  ],
  posture: [
    { key: 'forearms', label: 'Forearms vertical', detail: 'Elbows under the bar at the bottom, forearms straight up and down.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, zoom: 'ohp-forearm-vertical', claim: CL.c5 },
    // The plate's 'Head through' label and its cue (card plate.checkpoints 'Head clear'): c6, not the bar-in-front c14
    // (W2 panel; W2 fix round, #385 6648438434).
    { key: 'head', label: 'Head clear', detail: 'Lean back slightly from the hips so the bar clears your chin.',
      anchor: { landmark: 'chin', pose: 'start' }, claim: CL.c6 },
    { key: 'back', label: 'Low back neutral', detail: 'Low back neutral. Lean comes from the hips, not the spine.',
      anchor: { landmark: 'lumbar', pose: 'start' }, claim: C(['CONSENSUS'], [SL], 'c8, c6') },
    { key: 'legs', label: 'Legs locked', detail: 'Hips and knees locked.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c9 },
    { key: 'front', label: 'Bar in front', detail: 'Bar in front of the head, never behind the neck.', anchor: { landmark: 'chin', pose: 'start' }, claim: CL.c14 },
    { key: 'midfoot', label: 'Over mid-foot', detail: 'Lockout with the bar over the shoulders and mid-foot.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['ohp-forearm-vertical', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Set the crossbars, bar at shoulder height. Grip just outside the shoulders, elbows forward under the bar.',
    mistakeLine: "Never arch your low back to finish a rep. If it won't stay neutral, the weight is too heavy.",
    cueLine: 'Elbows under the bar.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'back'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/barbell_overhead_press.json', rev: 1 },
};
