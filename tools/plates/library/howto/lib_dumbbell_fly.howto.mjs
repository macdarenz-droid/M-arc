// LIB-SHIP W2: the How-to content of lib_dumbbell_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/dumbbell_fly.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3, card-no-zoom): the card has no hand zoom; the id is on tools/plates/library/hands/no-zoom.json.
// Its grip claims (closed grip, thumbs wrapped, palms facing, shoulder width at the top, wrists neutral; grip.claims c3,
// c5, and c13) live in handling and setup step 3.
// Plate: FRONT view from the feet (camera.pitch, the card's view); every crop is in the plate's own view.
// Red flag: the card's redFlags (shoulder), golden B's shared shoulder block, linked by the front-shoulder row.
// Tier-A way out: c6 (a spotter behind, hands close to the wrists), setup step 4.
import plateSpec, { makeFly, SIZES } from '../specs/dumbbell_fly.mjs';
import { supine } from '../specs/dumbbell_bench_press.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-lying-fly': { cite: 'Lying Chest Fly, ACE Exercise Library', url: 'https://www.acefitness.org/resources/everyone/exercise-library/21/lying-chest-fly/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  welsch2005: { cite: 'Electromyographic activity of the pectoralis major and anterior deltoid muscles during three upper-body lifts', url: 'https://pubmed.ncbi.nlm.nih.gov/15903389/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kerr2010: { cite: 'Epidemiology of weight training-related injuries presenting to United States emergency departments, 1990 to 2007', url: 'https://pubmed.ncbi.nlm.nih.gov/20139328/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
};
// Not cited: solstad2020 (c8, bench press against fly activity; no field here restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-lying-fly';
const CL = {
  c1: C(['CONSENSUS'], [ACE], 'c1'),
  c2: C(['CONSENSUS'], [ACE], 'c2'),
  c3: C(['CONSENSUS'], [ACE], 'c3'),
  c4: C(['CONSENSUS'], [ACE], 'c4'),
  c5: C(['CONSENSUS'], [ACE], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['DATA'], ['welsch2005'], 'c7'),
  c9: C(['CONSENSUS'], ['acsm2009'], 'c9'),
  c11: C(['DATA'], ['kolber2010'], 'c11'),
  c12: C(['DATA'], ['kerr2010'], 'c12'),
  c13: C(['CONSENSUS'], [ACE], 'c13'),
  wrist: C(['CONSENSUS'], [ACE], 'c3, c5, c13'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
const H = 1.75, R = Math.PI / 180;
const START = plateSpec.poses.start, END = plateSpec.poses.end;
// 'deep' (card zoom fly-depth Wrong, c4: "Dumbbells well below chest level"): the spec's own depth Mistake, the side
// alternate's (makeFly('side'), same poses): the same arc and elbow bend lowered until the grips are under the shoulder
// joints (dumbbell_fly.mjs MIS_BELOW). Not a new drawing value.
const DEEP = makeFly('side', 'dumbbell_fly__alt').mistake.pose;
// 'elbows-bent' (card zoom fly-elbow-bend Wrong, c5: "Elbows bent deeply, pressing"): the end pose with each grip moved
// along its own shoulder-to-grip line until the elbow flexion is BEND deg, the spec's elbow pole kept (as lib_pec_fly's
// bentReach). 'hips-up' (card zoom fly-five-point Wrong, c2: "Hips lifted off the bench"): the start pose laid by the
// spec's own supine() with its `lift` (buttocks LIFT m above the pad, upper back still on it), feet planted, each hand
// target moved with its shoulder so the arms are unchanged.
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and lib_plank's SAG 20 deg): BEND 90 deg and LIFT
// 0.08 m (supine() solves no lift of 0.12 m with the head on the pad) are Wrong-pose sizes no card gives; no number
// from them appears in user copy; the layers panel judges them.
const BEND = 90, LIFT = 0.08;
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
const bentReach = (pose, flex) => {
  const lm = landmarksOf(pose, H), out = {};
  for (const s of ['l', 'r']) {
    const S = lm[`shoulder.${s}`], G = pose.reach[s].at;
    const L1 = dist(S, lm[`elbow.${s}`]), L2 = dist(lm[`elbow.${s}`], lm[`grip.${s}`]), D0 = dist(S, G);
    const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(flex * R));
    out[s] = { ...pose.reach[s], at: G.map((g, i) => S[i] + (g - S[i]) * D / D0) };
  }
  return out;
};
const ELBOWS_BENT = { reach: bentReach(END, BEND) };
const HIPS_UP = (() => {
  const body = supine(SIZES.BENCH_TOP, 0, { lift: LIFT });
  const L0 = landmarksOf(START, H), L1 = landmarksOf({ ...START, ...body }, H), reach = {};
  for (const s of ['l', 'r']) {
    const d = [0, 1, 2].map(i => L1[`shoulder.${s}`][i] - L0[`shoulder.${s}`][i]);
    reach[s] = { ...START.reach[s], at: START.reach[s].at.map((v, i) => v + d[i]) };
  }
  return { ...body, reach };
})();
export const stills = {
  start: { pose: START },
  end: { pose: END },
  deep: { pose: { ...END, ...DEEP } },
  'elbows-bent': { pose: { ...END, ...ELBOWS_BENT } },
  'hips-up': { pose: { ...START, ...HIPS_UP } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. The zoom shell's shape (callout with an anchor at the landmark it names;
// pilot-a.closeups.mjs), as the curl's curl-elbow; each Wrong is drawn alone (solid).
const zooms = [
  {
    key: 'fly-elbow-bend', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',
    crop: { center: { at: 'elbow.l', pose: 'right', off: [0, 0] }, sizePx: 150 },
    right: 'end',
    wrong: { base: 'end', pose: ELBOWS_BENT, solid: true },
    callout: {
      right: { text: 'Slight bend', anchor: 'elbow.l' },
      wrong: { text: 'Bent deeply', anchor: 'elbow.l' },
    },
    caption: {
      right: 'Slight, fixed elbow bend.',
      wrong: 'Elbows bent deeply, pressing.',
    },
    alt: {
      right: 'View from the feet, bottom of the arc. The elbows keep a slight bend, arms open wide.',
      wrong: 'View from the feet, bottom of the arc. The elbows are bent deeply, as in a press.',
    },
  },
  {
    key: 'fly-depth', chip: 'Depth', heading: 'Arc depth', kind: 'posture',
    crop: { center: { at: 'grip.l', pose: 'right', off: [0, 10] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: DEEP, solid: true },
    callout: {
      right: { text: 'Chest level', anchor: 'grip.l' },
      wrong: { text: 'Below chest', anchor: 'grip.l' },
    },
    caption: {
      right: 'Dumbbells level with the chest.',
      wrong: 'Dumbbells well below chest level.',
    },
    alt: {
      right: 'View from the feet, bottom of the arc. The dumbbells stop level with the chest.',
      wrong: 'View from the feet, bottom of the arc. The dumbbells sink well below chest level.',
    },
    feelRow: 'front-shoulder',
  },
  {
    key: 'fly-five-point', chip: 'Hips', heading: 'Bench contact', kind: 'posture',
    crop: { center: { at: 'buttock', pose: 'right', off: [0, 0] }, sizePx: 170 },
    right: 'start',
    wrong: { base: 'start', pose: HIPS_UP, solid: true },
    callout: {
      right: { text: 'On the bench', anchor: 'buttock' },
      wrong: { text: 'Hips lifted', anchor: 'buttock' },
    },
    caption: {
      right: 'Head, shoulders, buttocks on the bench, feet flat.',
      wrong: 'Hips lifted off the bench.',
    },
    alt: {
      right: 'View from the feet, arms up. Head, shoulders and buttocks rest on the bench, feet flat on the floor.',
      wrong: 'View from the feet, arms up. The hips are lifted off the bench.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest works about as hard as in the bench press.' }],
  secondary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders work too.' }],
  watch: [],
  // The card's first row (chest, c7) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this across your chest.',
  rows: [
    { key: 'front-shoulder', where: 'Front-shoulder pain at the bottom', at: { muscles: ['front_delts'] },
      means: 'Fault: lowering the dumbbells past shoulder or chest level.',
      fix: "Stop and don't train through the pain. Stop level with your shoulders or chest.",
      zoom: 'fly-depth', redFlag: 'shoulder', claim: C(['DATA', 'CONSENSUS'], ['kolber2010', ACE], 'c11, c4') },
  ],
  claim: CL.c7,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'wrists', title: 'Wrists bending forward or back', claim: CL.c13,
    fix: 'Keep your wrists neutral.' },
  { key: 'deep', title: 'Going below chest level', zoom: 'fly-depth', claim: CL.c4,
    fix: 'Stop level with the shoulders or chest.' },
  { key: 'elbows', title: 'Elbows bending more going down', zoom: 'fly-elbow-bend', claim: CL.c5,
    fix: 'Keep the same slight bend.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Shoulder injuries are common in lifting and linked to poor technique.', claim: CL.c11 },
  { key: 'dropped', text: 'Dropped weights are the most common way lifters get badly hurt.', claim: CL.c12 },
];

export default {
  schema: 1,
  id: 'lib_dumbbell_fly',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'hold',
    why: 'D-SHIP-C3: card-no-zoom, the card has no hand zoom; the grip copy carries c3, c5 and c13.',
    orientation: 'neutral',    // c3: palms turned to face each other for the arc
    handle: 'dumbbell',
    width: { text: 'Dumbbells shoulder-width apart at the top.', claim: CL.c3 },
    thumb: { mode: 'wrapped', claim: CL.c3 },   // c3: closed grip, thumbs wrapped
    // card grip.handContact: "Handle across the middle of the palm (hold archetype default, not from this card's
    // sources)": not written in user copy.
    contact: 'mid-palm',
    // card grip.wrist: "Neutral throughout" (c3, c5; c13 no flexion or extension). No tolerance given: neutral itself.
    wrist: { ext: [0, 0], limitText: 'Keep the wrists neutral, not bent forward or back.', claim: CL.wrist },
    faults: [
      // c13 (the plate's drawn Mistake bends the wrists back). Not drawn here (no hand zoom), so no pose or marker is
      // set; the labels are the hand modules' words for these keys (radial-rules.mjs, D-LIB7-10).
      { key: 'curled', label: 'Wrist curled', pose: {}, markers: [], alt: 'Wrist bent forward, out of line with the forearm.' },
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Wrist bent back, out of line with the forearm.' },
    ],
    gripLine: 'Thumbs wrapped, palms facing each other. Keep your wrists neutral.',
    cue: 'Thumbs wrapped, wrists neutral.',
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'position', text: 'Lie on a flat bench, feet flat on the floor.', zoom: 'fly-five-point', claim: CL.c1 },
    { kind: 'brace', text: 'Shoulder blades down and back.', claim: CL.c2 },
    { kind: 'grip', text: 'Press up to shoulder-width, thumbs wrapped. Palms in, elbows slightly bent.', claim: CL.c3 },
    { kind: 'safety', text: "A spotter's hands stay near your wrists, not touching.", claim: CL.c6 },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c9 },
  ],
  posture: [
    { key: 'contact', label: 'Five points', detail: 'Head, shoulders, buttocks and feet keep contact throughout.',
      anchor: { landmark: 'buttock', pose: 'start' }, zoom: 'fly-five-point', claim: CL.c2 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Same slight elbow bend throughout.',
      anchor: { landmark: 'elbow.l', pose: 'end' }, zoom: 'fly-elbow-bend', claim: CL.c5 },
    { key: 'depth', label: 'Chest-level stop', detail: 'Lower until the dumbbells are level with the shoulders or chest.',
      anchor: { landmark: 'grip.l', pose: 'end' }, zoom: 'fly-depth', claim: CL.c4 },
    { key: 'parallel', label: 'Dumbbells parallel', detail: 'Dumbbells stay parallel.', anchor: { landmark: 'grip.l', pose: 'start' }, claim: CL.c4 },
    { key: 'wrists', label: 'Wrists neutral', detail: 'Wrists neutral.', anchor: { landmark: 'wrist.r', pose: 'end' }, claim: CL.c3 },
  ],
  feel,
  zooms,
  chips: ['fly-elbow-bend', 'fly-depth', 'fly-five-point', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Lie on a flat bench, feet flat. Shoulder blades down and back.',
    mistakeLine: 'Never lower the dumbbells below chest level. Stop level with the shoulders or chest.',
    cueLine: 'Same slight elbow bend.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/dumbbell_fly.json', rev: 1 },
};
