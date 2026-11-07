// LIB-SHIP W6: the How-to content of lib_diamond_push_up (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/diamond_push_up.json; its claim ids are named on each field's claim.
// Family: a child of push_up with inherit [] (the card's own lines throughout), so no family map.
// No hand zoom (D-SHIP-C3 no-zoom list, gap-ruled D-SHIP-HANDW6; Q-W6-12, #393 6647923934): the card zoom `hand`
// (thumbs and first fingers touch to make a diamond, c1) shows two hands, and the palm-flat pair key draws one
// (hand-palm-flat.mjs `floor`), so it cannot show the diamond; no pair is drawn (D-SHIP-PAIR-NOZOOM). The id is on
// tools/plates/library/hands/no-zoom.json. The diamond (c1) is in the setup grip step (setup[1]) and the gripLine.
// Hand values: the card claims the thumb ("thumbs touch to form the bottom of the diamond", c1), the contact ("hands
// flat on the floor with open fingers", c1) and the wrist place ("hands below the upper chest", c1; sore wrists c11).
// The thumb is ThumbMode 'spread' (the thumb held out from the index to meet the other thumb; card c1). The contact is
// 'palm-flat' (c1). The wrist range is the key's (hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null), data only, so
// the wrist is `exempt` (lib_push_up form). The key's two faults (cupped-palm, hand-ahead) claim no line of this card,
// so handling.faults is empty.
// Zooms: hip-line (M, the plate's own Mistake: hips sag, low back arches; c6, c7) and shoulder-blades (DV; c4).
// Red flags: the card's redFlags (shoulder, wrist, elbow), each linked by its feel row.
// No variant line (equipment 'Bodyweight').
import plateSpec from '../specs/diamond_push_up.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_ELBOW };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-diamond': { cite: 'How to Do the Diamond Push-Up (BarBend)', url: 'https://barbend.com/diamond-push-up/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-diamond': { cite: 'Diamond Push-Ups: Tone Your Chest, Arms, and Shoulders (Fitness Volt)', url: 'https://fitnessvolt.com/diamond-push-ups/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'cogley-2005': { cite: 'Comparison of muscle activation using various hand positions during the push-up exercise.', url: 'https://pubmed.ncbi.nlm.nih.gov/16095413/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The palm-flat key's own source for the wrist range (none recorded): a drawing convention, data only.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): no wrist range', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The joint blocks' own sources (layers/howto/shared.mjs): the card's redFlags 'shoulder', 'wrist', 'elbow'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
  'nhs-elbow-pain': { cite: 'NHS, Elbow and arm pain', url: 'https://www.nhs.uk/symptoms/elbow-and-arm-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When elbow pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-diamond', FV = 'fv-diamond';
const CL = {
  c1: C(['CONSENSUS'], [BB, FV], 'c1'),
  c2: C(['CONSENSUS'], [FV, BB], 'c2'),
  c3: C(['CONSENSUS'], [BB, FV], 'c3'),
  c4: C(['CONSENSUS'], [BB], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [BB], 'c6'),
  c7: C(['CONSENSUS'], [FV], 'c7'),
  c8: C(['CONSENSUS'], [BB], 'c8'),
  c10: C(['CONSENSUS'], [FV], 'c10'),
  c11: C(['CONSENSUS', 'WEAK'], [FV], 'c11'),
  line: C(['CONSENSUS'], [FV, BB], 'c2, c3'),
  blades: C(['CONSENSUS'], [BB], 'c4, c9'),
  bladesTop: C(['CONSENSUS'], [BB], 'c4, c9, c5'),
  breathe: C(['CONSENSUS'], [BB, FV], 'c3, c5'),
  hipZoom: C(['CONSENSUS'], [FV, BB], 'c2, c6'),
  grip: C(['CONSENSUS'], [BB, FV], 'c1'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs:27-28 IDS.diamond_push_up, :13-14
// VARIANTS.floor; not importable: its view code reads files at run time and the library closure, C0, refuses it).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm' };   // VARIANTS.floor.archetype, .loadAxis (hand-palm-flat.mjs:14)
const KEY_WRIST_RANGE = null;   // VARIANTS.floor.wristRange (hand-palm-flat.mjs:14): no range, so the wrist is exempt

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec start = card plate.end, the bottom; spec end = card plate.start, the top):
//   sag     (card zoom hip-line Wrong, c6): the spec's Mistake pose, the plate's drawn fault (hips sag, low back arches).
//   pinched (card zoom shoulder-blades Right, c4 "shoulder blades pinched back at the bottom"): the bottom with the
//           shoulder blades drawn back PINCH cm; the hands stay on their grips (the spec's reach), the wrist re-solved
//           so the palm lies level.
//   rolled  (card zoom shoulder-blades Wrong, c4 "shoulders rolled forward at the bottom"): the same, the blades
//           ROLL cm forward.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop): PINCH -3
// is chest_supported_row's spec blade-back value (specs/chest_supported_row.mjs:73: 2 - 5 = -3 at the end, blades back;
// weighted_dip's SCAP_PRO is also -3). ROLL +7 is a Wrong-pose size no card gives (c4 names the roll, no size): W6 panel
// L1/L5 found chest_supported_row's +2 (arms forward) did not read; at +7 the shoulder joint sits 10 cm nearer the
// floor than in the Right (landmarksOf). No number from them appears in user copy; the layers panel judges them.
const H = 1.75, PINCH = -3, ROLL = 7;
const START = plateSpec.poses.start, WY = landmarksOf(START, H)['wrist.r'][1];
function solve(p0, make, res, iters = 40) {   // Newton with finite differences (the spec's own solver, copied); throws
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) return p;
    const J = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => J[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  if (Math.hypot(...f(p)) >= 1e-6) throw new Error('lib_diamond_push_up: a blade still did not converge');
  return p;
}
const bladesPose = pro => { const p = q => ({ ...START, scap: { elev: 0, pro }, wrist: q.w });
  return p(solve({ w: START.wrist }, p, lm => [lm['wrist.r'][1] - WY])); };
const PINCHED_POSE = bladesPose(PINCH), ROLLED_POSE = bladesPose(ROLL);
export const stills = {
  start: { pose: START },
  end: { pose: plateSpec.poses.end },
  sag: { pose: plateSpec.mistake.pose },
  pinched: { pose: PINCHED_POSE },
  rolled: { pose: ROLLED_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per posture card zoom, same keys and kinds (the hand zoom is gap-ruled, see the header). Zoom shell shape
// (callout with an anchor at the landmark it names; pilot-a.closeups.mjs); each Wrong is its still drawn over the Right
// (W6 panel, below); the shoulder-blades Right is its still as a pose override (golden B's pull_up `right: { base, pose }`).
const zooms = [
  {
    key: 'hip-line', chip: 'Hip line', heading: 'Hip line', kind: 'posture',
    // W6 panel L1/L5: the Wrong is not solid: the straight Right body is drawn, the sag dashed red over it with the
    // plate Mistake's own arrow (navel down to the sagged navel), as the plate's Mistake view; the window is wider so
    // the head stays inside (sizePx, off: drawing values).
    crop: { center: { at: 'hip.r', pose: 'right', off: [20, 0] }, sizePx: 210 },
    right: 'end',
    wrong: { base: 'end', pose: plateSpec.mistake.pose },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Body in line', anchor: 'hip.r' },
      wrong: { text: 'Hips sag', anchor: { at: 'hip.r', pose: 'mistake' } },   // c6
    },
    caption: {
      right: 'Torso and legs rigid in one line.',
      wrong: 'Low back and hips sagging toward the floor.',
    },
    alt: {
      right: 'Side view, top of the diamond push-up. Torso and legs rigid in one straight line, arms straight.',
      wrong: 'Side view, top of the diamond push-up. The low back and hips sag toward the floor.',
    },
  },
  {
    key: 'shoulder-blades', chip: 'Shoulder blades', heading: 'Shoulder blades', kind: 'posture',
    // W6 panel L1/L5: the Wrong is not solid: the pinched Right is drawn, the rolled shoulder dashed red over it, and a
    // red drop arrow runs from the Right shoulder down to the rolled one (offsets, plate px, are drawing values).
    crop: { center: { at: 'shoulder.r', pose: 'right', off: [0, 4] }, sizePx: 140 },
    right: { base: 'start', pose: PINCHED_POSE },
    wrong: { base: 'start', pose: ROLLED_POSE },
    guides: [{ kind: 'drop', from: { at: 'shoulder.r', pose: 'right', off: [0, -4] }, to: { at: 'shoulder.r', pose: 'mistake', off: [0, 0] } }],
    callout: {
      right: { text: 'Blades back', anchor: 'shoulder.r' },
      wrong: { text: 'Shoulders forward', anchor: { at: 'shoulder.r', pose: 'mistake' } },   // c4
    },
    caption: {
      right: 'Shoulder blades pinched back at the bottom.',
      wrong: 'Shoulders rolled forward at the bottom.',
    },
    alt: {
      right: 'Side view, bottom of the diamond push-up. The shoulder blades pinch back, chest near the hands.',
      wrong: 'Side view, bottom of the diamond push-up. The shoulders roll forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const HANDS = ['hand-left', 'hand-right'];
const feel = {
  primary: [{ muscleId: 'triceps', plain: 'The back of the upper arm does the pressing.' }],
  secondary: [
    { muscleId: 'chest', plain: 'The chest presses too.' },
    { muscleId: 'front_delts', plain: 'The front of the shoulders helps.' },
  ],
  watch: [],
  // D-TEXT-GOLDEN (#379 6637607604): posture 'breathe' (c3, c5) is shown in the feel line.
  feelLine: 'You should feel this most in your triceps and chest. Breathe in going down, out going up.',
  rows: [
    // The card's first row (back of the arms and chest: the pressing muscles) has no fix, so it is left out: the feel
    // line says it (D-SHIP-Q16).
    { key: 'shoulder', where: 'Shoulder', at: { muscles: ['front_delts'] },
      means: 'Shoulders rolling forward may cause joint discomfort.',
      fix: 'Pull your shoulder blades back as you lower.', zoom: 'shoulder-blades',
      redFlag: 'shoulder', claim: CL.c4 },
    { key: 'wrist', where: 'Wrists', at: { parts: HANDS },
      means: 'The diamond hand position can bother your wrists.',
      fix: 'Use push-up handles or dumbbells to keep wrists straight.',
      redFlag: true, claim: CL.c11 },
    { key: 'elbow', where: 'Elbows', at: { parts: ['elbow-left', 'elbow-right'] },
      means: "Hands this close can hurt some people's elbows.",
      fix: 'Move your hands a little further apart.',
      redFlag: 'elbow', claim: CL.c10 },
  ],
  claim: C(['CONSENSUS', 'DATA', 'MECH'], [BB, FV, 'cogley-2005'], 'c12, c13, c3, c5'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'sag', title: 'Low back sagging', zoom: 'hip-line', claim: CL.c6,
    fix: 'Bend your knees slightly and squeeze your abs and glutes.' },
  // D-TEXT-GOLDEN: posture 'top' (c5: the blades spread fully at the top, the upper back reaching up) is shown in this fix.
  { key: 'rolled', title: 'Shoulders rolling forward', zoom: 'shoulder-blades', claim: CL.bladesTop,
    fix: 'Pinch your shoulder blades back going down. Spread them at the top.' },
  { key: 'hips', title: 'Hips dropping before the chest', claim: CL.c8,
    fix: 'Press your heels against a wall to stay rigid.' },
];
const RISKS = [
  { key: 'close', text: 'The close hand position can cause elbow, shoulder or wrist pain for some.', claim: CL.c10 },
  { key: 'rolled', text: 'Shoulders rolling forward on the way down may cause joint discomfort.', claim: CL.c4 },
  { key: 'arch', text: "Don't let your back arch, to protect your low back.", claim: CL.c7 },
];

export default {
  schema: 1,
  id: 'lib_diamond_push_up',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: the palm-flat pair draws one hand and cannot show the two-hand diamond (c1); the grip copy carries c1.',
    orientation: 'pronated',         // the key's orientation 'over' (hand-palm-flat.mjs:28): palms down on the floor (c1)
    handle: 'floor',                 // the key's variant 'floor' (hand-palm-flat.mjs:28)
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands touching at the thumbs and first fingers.', claim: CL.c1 },
    thumb: { mode: 'spread', claim: C(['CONSENSUS'], [BB, FV], 'card grip.thumb, c1: the thumbs held out to touch and form the bottom of the diamond') },
    contact: 'palm-flat',            // card grip.handContact, c1: hands flat on the floor with open fingers
    // KEY_WRIST_RANGE is null: no range given, so the wrist is exempt (lib_push_up form). Never shown.
    wrist: { exempt: `Palm flat on the floor below the upper chest: the palm-flat key records no wrist range (${KEY_WRIST_RANGE}).`,
      claim: C(['CONSENSUS', 'CONVENTION'], [BB, FV, 'hand-key-palm-flat'], 'card grip.wrist c1 (hands below the upper chest); hand-palm-flat.mjs:14 VARIANTS.floor.wristRange null') },
    faults: [],                      // the key's faults claim no line of this card (see the header)
    gripLine: 'Hands flat and close together under your upper chest. Thumbs and first fingers touch to make a diamond.',
    cue: 'Elbows close to your sides.',   // c3
  },
  contacts: ['floor-body'],   // the card's archetype.contact
  setup: [
    { kind: 'position', text: 'Kneel with your hands flat under your upper chest.', claim: CL.c1 },
    // Q-W6-12: the diamond (c1), the card hand zoom's claim, is shown here and in the gripLine.
    { kind: 'grip', text: 'Touch thumbs and first fingers to make a diamond.', claim: CL.c1 },
    { kind: 'position', text: 'Walk your feet back until your body is straight.', claim: CL.c2 },
    { kind: 'brace', text: 'Brace, tuck your chin, pull your shoulders down and back.', claim: CL.c2 },
    { kind: 'brace', text: 'Keep your torso and legs rigid.', zoom: 'hip-line', claim: CL.c2 },
  ],
  posture: [
    { key: 'elbows', label: 'Elbows tucked', detail: 'Elbows tucked close to your sides.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c3 },
    { key: 'line', label: 'Body in line', detail: "Low back and hips don't sag or arch up.",
      anchor: { landmark: 'hip.r', pose: 'end' }, zoom: 'hip-line', claim: CL.line },
    { key: 'hands', label: 'Hands under chest', detail: 'Hands close together under the upper chest.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c1 },
    { key: 'blades', label: 'Blades back', detail: 'Shoulder blades pinch back as you lower.',
      anchor: { landmark: 'shoulder.r', pose: 'start' }, zoom: 'shoulder-blades', claim: CL.blades },
    { key: 'top', label: 'Reach at top', detail: 'At the top, reach your upper back to the ceiling.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c5 },
    { key: 'breathe', label: 'Breathe', detail: 'Breathe in going down, out going up.', anchor: { landmark: 'chest', pose: 'start' }, claim: CL.breathe },
  ],
  feel,
  zooms,
  chips: ['hip-line', 'shoulder-blades', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Hands flat under your upper chest in a diamond. Body straight and rigid.',
    mistakeLine: 'Never let your low back sag. Bend your knees slightly and squeeze your abs and glutes.',
    cueLine: 'Elbows tucked, body rigid.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder', 'wrist', 'elbow'],   // the card's redFlags, in card order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/diamond_push_up.json', rev: 1 },
};
