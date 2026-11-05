// LIB-SHIP W7: the How-to content of lib_burpee, golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/burpee.json (cited in its field's claim, cN = card claim id).
// No hand zoom (D-SHIP-C3 no-zoom list, D-SHIP-HANDW7 gap-ruled; tools/plates/library/hands/no-zoom.json): the palm-flat
// key's faults (cupped-palm, hand-ahead) cite no claim of this card, and the card's hand zoom `hands` has no Wrong. Its
// Right (c2) is the grip line.
// Hand values (D-SHIP-GRIP case (a), lib_push_up's form): the card gives grip.handContact (c2, whole hand flat) and no
// thumb or wrist. The other values come from the approved `palm-flat` pair key (tools/plates/library/hands/
// hand-palm-flat.mjs IDS.burpee: variant 'floor', orientation 'over'), copied with each value's key line (the key module
// is not importable here, see lib_push_up's header). The key records no ThumbMode: its drawing lays the thumb on the
// floor beside the index (hands/view-palm-flat.mjs:52), golden B's 'beside', cited CONVENTION (source
// hand-key-palm-flat), never printed. The key's faults are not copied (no card claim supports them, no-zoom.json note).
// Red flags: the card's redFlags knee and wrist; the knee row links RED_FLAG_KNEE, the wrist row the wrist RED_FLAG.
// No variant line (equipment 'Bodyweight').
//
// D-TEXT-GOLDEN claim -> slot:
//   posture c6 straight head to heels     -> posture line (zoom plank)
//   posture c6, c18 brace, no sag         -> posture brace, mistakes[sag]
//   posture c15 neck neutral              -> posture neck
//   posture c16 knees track over toes     -> posture knees
//   posture c11 land softly               -> posture landing (zoom landing), mistakes[landing]
//   posture c19 keep breathing            -> posture breathe
//   handlingMistake rushing c9            -> mistakes[rush], risks[rush]
//   handlingMistake hard landing c11      -> mistakes[landing] (zoom landing)
//   handlingMistake back sagging c6, c18  -> mistakes[sag] (zoom plank), copy.mistakeLine
//   hand zoom hands Right c2              -> handling.gripLine, setup step 2
// D-TEXT-PRINTED (W7, #394): c19 breathing -> setup step 1; c15 neck neutral -> setup step 4 (and plate label);
//   c16 knees over toes -> setup step 5.
// Left off (D-TEXT-PROGRESSION): c23 (easier versions, progression).
import plateSpec from '../specs/burpee.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'bb-burpee': { cite: 'How to Do Burpees: Proper Form & Benefits (CPT-Approved) | BarBend', url: 'https://barbend.com/burpees/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fv-burpee': { cite: 'Ultimate Burpees Workout: Target Every Key Muscle Group! – Fitness Volt', url: 'https://fitnessvolt.com/burpees/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-burpee': { cite: 'Burpee - Exercise Guide | Motra', url: 'https://www.motra.com/exercises/burpee',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'hl-burpee': { cite: 'How to Do a Burpee: Step-by-Step Guide, Benefits, Variations', url: 'https://www.healthline.com/health/how-to-do-a-burpee',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-burpee': { cite: 'How To Do a Burpee | Burpees Video Workouts | PureGym', url: 'https://www.puregym.com/exercises/plyometrics/burpees/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // The palm-flat key's own source for the thumb (the card has no grip.thumb): a drawing convention.
  'hand-key-palm-flat': { cite: 'LIB-12 hand pair key palm-flat (floor): the thumb lies on the floor beside the index', url: 'tools/plates/library/hands/hand-palm-flat.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as lib_hack_squat lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
  // RED_FLAG's own source (layers/howto/shared.mjs), as lib_mountain_climbers lists it: the card's redFlags 'wrist'.
  'nhs-wrist-pain': { cite: 'NHS, Wrist pain', url: 'https://www.nhs.uk/conditions/hand-pain/wrist-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When wrist pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['pg-burpee','hl-burpee','motra-burpee','fv-burpee'], 'card c1'),
  c2: C(['CONSENSUS'], ['fv-burpee','motra-burpee','bb-burpee'], 'card c2'),
  c3: C(['CONSENSUS'], ['pg-burpee','bb-burpee','motra-burpee'], 'card c3'),
  c4: C(['CONSENSUS'], ['bb-burpee','fv-burpee'], 'card c4'),
  c5: C(['CONSENSUS'], ['bb-burpee','fv-burpee','motra-burpee'], 'card c5'),
  c6: C(['CONSENSUS'], ['hl-burpee','bb-burpee','motra-burpee','fv-burpee'], 'card c6'),
  c7: C(['CONSENSUS'], ['bb-burpee'], 'card c7'),
  c8: C(['CONSENSUS'], ['motra-burpee'], 'card c8'),
  c9: C(['CONSENSUS'], ['motra-burpee'], 'card c9'),
  c10: C(['CONSENSUS'], ['fv-burpee'], 'card c10'),
  c11: C(['CONSENSUS'], ['fv-burpee','motra-burpee','hl-burpee'], 'card c11'),
  c12: C(['CONSENSUS'], ['fv-burpee','hl-burpee'], 'card c12'),
  c13: C(['CONSENSUS'], ['fv-burpee'], 'card c13'),
  c14: C(['CONSENSUS'], ['fv-burpee'], 'card c14'),
  c15: C(['CONSENSUS'], ['fv-burpee'], 'card c15'),
  c16: C(['CONSENSUS'], ['motra-burpee'], 'card c16'),
  c17: C(['CONSENSUS'], ['bb-burpee','fv-burpee','pg-burpee'], 'card c17'),
  c18: C(['CONSENSUS'], ['motra-burpee','bb-burpee'], 'card c18'),
  c19: C(['CONSENSUS'], ['pg-burpee','motra-burpee'], 'card c19'),
  c20: C(['CONSENSUS'], ['bb-burpee','motra-burpee','fv-burpee'], 'card c20'),
  c21: C(['CONSENSUS'], ['bb-burpee','motra-burpee'], 'card c21'),
  c22: C(['CONSENSUS'], ['motra-burpee','pg-burpee'], 'card c22'),
  c23: C(['CONSENSUS'], ['hl-burpee','bb-burpee'], 'card c23'),
  c24: C(['WEAK'], ['motra-burpee','fv-burpee'], 'card c24'),
};
const J = (...ids) => C([...new Set(ids.flatMap(i => CL[i].tags))], [...new Set(ids.flatMap(i => CL[i].sources))], `card ${ids.join(', ')}`);

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// The key's record for this id and its variant, copied (hand-palm-flat.mjs IDS.burpee, VARIANTS.floor; not importable).
const V = { archetype: 'palm-flat', loadAxis: 'along-forearm' };   // VARIANTS.floor.archetype, .loadAxis
const THUMB = 'beside';   // CONVENTION (D-SHIP-GRIP (a)): the key's drawn thumb (view-palm-flat.mjs:52), source hand-key-palm-flat

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses (spec start = the straight-arm plank, end = standing after the landing):
//   stiff (card zoom landing Wrong, c11): the spec's Mistake over the end (the knees straight on landing).
//   sag   (card zoom plank Wrong, c6 "lower back sagging"): the plank with the trunk joint bent SAG deg so the hips drop
//         below the head-to-heel line; root height, depth and pelvis tilt solved so each shoulder joint stays on its
//         spot and the hand stays under it (the arm keeps the start's angle on the thorax); the feet stay on their
//         planted spots (the spec's plant targets). Solver: lib_plank's Newton with finite differences.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's SAG): SAG 25 deg is a Wrong-pose
// size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, SAG = 25;
const START = plateSpec.poses.start, END = plateSpec.poses.end, MIS = plateSpec.mistake.pose, LS = landmarksOf(START, H);
function solve(p0, make, res, iters = 30) {   // Newton with finite differences (lib_plank's solver)
  const keys = Object.keys(p0); const p = { ...p0 };
  const f = q => res(landmarksOf(make(q), H));
  for (let it = 0; it < iters; it++) {
    const r = f(p); if (Math.hypot(...r) < 1e-6) break;
    const Jm = keys.map(k => { const d = 1e-5, q = { ...p, [k]: p[k] + d }; return f(q).map((v, i) => (v - r[i]) / d); });
    const n = keys.length, A = Array.from({ length: n }, (_, i) => [...keys.map((_, j) => Jm[j][i]), -r[i]]);
    for (let c = 0; c < n; c++) {
      let m = c; for (let i = c + 1; i < n; i++) if (Math.abs(A[i][c]) > Math.abs(A[m][c])) m = i;
      [A[c], A[m]] = [A[m], A[c]];
      for (let i = 0; i < n; i++) if (i !== c) { const k = A[i][c] / A[c][c]; for (let j = c; j <= n; j++) A[i][j] -= k * A[c][j]; }
    }
    keys.forEach((k, i) => { p[k] += A[i][n] / A[i][i]; });
  }
  return p;
}
const sagPose = q => ({ ...START, root: { at: [0, q.y, q.z], tilt: q.tilt }, trunk: SAG });
const SQ = solve({ y: START.root.at[1], z: START.root.at[2], tilt: START.root.tilt }, sagPose,
  lm => [lm['shoulder.r'][1] - LS['shoulder.r'][1], lm['shoulder.r'][2] - LS['shoulder.r'][2], lm['wrist.r'][2] - LS['wrist.r'][2]]);
const SAG_POSE = sagPose(SQ);
export const stills = {
  start: { pose: START },
  end: { pose: END },
  stiff: { pose: { ...END, ...MIS } },
  sag: { pose: SAG_POSE },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The two card posture zooms in the zoom shell's shape (pilot-a.closeups.mjs), each Wrong drawn alone (solid). The card
// hand zoom `hands` is not drawn (header).
const zooms = [
  {
    key: 'landing', chip: 'Landing', heading: 'Landing', kind: 'posture',
    // zoom shell: a tight crop on the knee so the slight bend reads; `spine` is the straight hip-to-ankle reference on
    // the RIGHT pose (the closeup css option `spine`, as lib_plank's hip-line): the bent knee sits off it, the locked leg on it.
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 0] }, sizePx: 110 },
    guides: [{ kind: 'spine', from: { at: 'ankle.r', pose: 'right' }, to: { at: 'hip.r', pose: 'right' }, extend: [0.04, 0.04] }],
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Knees bent', anchor: 'knee.r' },
      wrong: { text: 'Knees locked', anchor: { at: 'knee.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Soft landing, knees slightly bent.',
      wrong: 'Hard landing, knees not bent.',
    },
    alt: {
      right: 'Side view, after the jump. Feet flat, knees slightly bent to absorb the landing.',
      wrong: 'Side view, after the jump. The legs land straight, knees not bent.',
    },
  },
  {
    key: 'plank', chip: 'Plank', heading: 'Plank line', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [10, 0] }, sizePx: 220 },
    right: 'start',
    wrong: { base: 'start', pose: SAG_POSE, solid: true },
    callout: {
      right: { text: 'Straight line', anchor: 'hip.r' },
      wrong: { text: 'Back sags', anchor: { at: 'hip.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Straight from head to heels.',
      wrong: 'Lower back sagging.',
    },
    alt: {
      right: 'Side view, straight-arm plank. Head, hips and heels on one line, hands under the shoulders.',
      wrong: 'Side view, straight-arm plank. The lower back sags, so the hips drop below the line.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'chest', plain: 'The chest works in the push-up half.', claim: CL.c20 },
    { muscleId: 'quads', plain: 'The front of the thighs launches the jump.', claim: CL.c21 },
    { muscleId: 'glutes', plain: 'The glutes launch the jump.', claim: CL.c21 },
  ],
  secondary: [
    { muscleId: 'triceps', plain: 'The back of the upper arm helps the push-up.', claim: CL.c20 },
    { muscleId: 'front_delts', plain: 'The front of the shoulders helps the push-up.', claim: CL.c20 },
    { muscleId: 'hamstrings', plain: 'The backs of the thighs help the jump.', claim: CL.c21 },
    { muscleId: 'calves', plain: 'The calves help the jump.', claim: CL.c21 },
  ],
  watch: [],
  feelLine: 'You should feel this in your chest, the front of your thighs and your glutes.',
  rows: [
    // The card's first two rows (chest; front of the thighs and glutes) have no fix, so they are left out: the feel
    // line says them.
    { key: 'knees', where: 'Knees', at: { muscles: ['quads'] },
      means: 'A hard landing: the impact could hurt them.',
      fix: 'Land softly on slightly bent knees. Stop if pain occurs.',
      redFlag: 'knee', claim: J('c11', 'c22') },
    { key: 'wrists', where: 'Wrists', at: { muscles: ['forearms'] },
      means: 'Diving onto your hands may hurt your wrists.',
      fix: 'Place your hands on the floor first. Stop if you feel pain.',
      redFlag: true, claim: J('c12', 'c3', 'c22') },   // true = the shared wrist RED_FLAG
  ],
  claim: J('c20', 'c21'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'rush', title: 'Rushing the transitions', claim: CL.c9,
    fix: 'Control your movements.' },
  { key: 'landing', title: 'Hard landing on the jump', zoom: 'landing', claim: CL.c11,
    fix: 'Land softly on slightly bent knees.' },
  { key: 'sag', title: 'Lower back sagging', zoom: 'plank', claim: J('c6', 'c18'),
    fix: 'Brace your trunk. Keep your body straight from head to heels.' },
];
const RISKS = [
  { key: 'landing', text: 'Landing on straight knees, the impact could hurt feet, ankles, knees, hips or back.', claim: CL.c11 },
  { key: 'wrists', text: 'Diving onto your hands may hurt your wrists.', claim: CL.c12 },
  { key: 'rush', text: 'Rushing the transitions can stress your joints.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_burpee',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: V.archetype,          // 'palm-flat'
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW7: the palm-flat key\'s faults cite no claim of this card and its hand zoom has no Wrong; the grip copy carries c2.',
    orientation: 'pronated',         // the key's orientation 'over': palms down on the floor (c2)
    handle: 'floor',
    loadAxis: V.loadAxis,            // 'along-forearm'
    overBody: false,
    width: { text: 'Hands shoulder-width apart.', claim: CL.c2 },
    thumb: { mode: THUMB, claim: C(['CONVENTION'], ['hand-key-palm-flat'], 'The card has no grip.thumb: the palm-flat key\'s drawn thumb, beside the index on the floor (view-palm-flat.mjs:52).') },
    contact: 'palm-flat',            // c2: the whole hand flat on the floor (card grip.handContact)
    // The card and the key give no wrist range (VARIANTS.floor.wristRange null): the floor sets the wrist under the flat palm.
    wrist: { exempt: 'Palm flat on the floor: no source gives a wrist position or range.', claim: CL.c2 },
    faults: [],                      // the key's faults cite no claim of this card (no-zoom.json note)
    gripLine: 'Hands flat on the floor, shoulder-width apart.',   // card hand zoom `hands` Right (c2)
    cue: 'Hands down first.',        // c3
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'position', text: "Stand with feet about shoulder-width apart. Don't hold your breath.", claim: J('c1', 'c19') },
    { kind: 'grip', text: 'Squat down. Hands flat on the floor, shoulder-width apart.', claim: CL.c2 },
    { kind: 'position', text: 'Hands down first, then kick your feet back into a plank.', zoom: 'plank', claim: CL.c3 },
    { kind: 'position', text: 'Lower your chest to the floor, neck neutral, then push back up.', claim: J('c4', 'c15') },
    { kind: 'finish', text: 'Jump your feet under you, knees over toes, then jump up.', zoom: 'landing', claim: J('c5', 'c16') },
  ],
  posture: [
    { key: 'line', label: 'Straight plank', detail: 'Body straight from head to heels in the plank.',
      anchor: { landmark: 'hip.r', pose: 'start' }, zoom: 'plank', claim: CL.c6 },
    { key: 'brace', label: 'Braced trunk', detail: "Brace your trunk so your lower back doesn't sag.",
      anchor: { landmark: 'lumbar', pose: 'start' }, claim: J('c6', 'c18') },
    { key: 'neck', label: 'Neck neutral', detail: "Neck neutral. Don't lower your head toward the floor.",
      anchor: { landmark: 'neck', pose: 'start' }, claim: CL.c15 },
    { key: 'knees', label: 'Knees over toes', detail: 'Knees track over your toes.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c16 },
    { key: 'landing', label: 'Soft landing', detail: 'Land softly on slightly bent knees.',
      anchor: { landmark: 'knee.r', pose: 'end' }, zoom: 'landing', claim: CL.c11 },
    { key: 'breathe', label: 'Breathing', detail: "Keep breathing. Don't hold your breath.", anchor: { landmark: 'chest', pose: 'start' }, claim: CL.c19 },
  ],
  feel,
  zooms,
  chips: ['landing', 'plank', 'feel'],
  copy: {
    setupLine: 'Squat down, hands flat on the floor, shoulder-width apart. Kick back into a plank.',
    mistakeLine: "Don't let your lower back sag in the plank. Keep your body straight.",
    cueLine: 'Land softly, knees bent.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['knee', 'wrist'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/burpee.json', rev: 1 },
};
