// LIB-SHIP W1: the How-to content of lib_pec_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/pec_fly.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty, so there is no
// hand claim to draw or write: NoHandling, and no hand zoom (the card has none). The card's grip.type and grip.width
// (claims c3, c4) are posture checkpoints `grip` and `width`, and setup step 3. No variant line (equipment 'Machine').
import plateSpec from '../specs/pec_fly.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'ace-top3-chest': { cite: 'What are the Top 3 Most Effective Chest Exercises? (Schanke, Porcari et al., ACE Certified News)', url: 'https://www.acefitness.org/certifiednewsarticle/3003/what-are-the-top-3-most-effective-chest-exercises/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'vg-pecfly': { cite: 'Pectoral Fly Machine Video Exercise Guide (Virtuagym)', url: 'https://exercises.virtuagym.com/exercise/pectoral-fly-machine/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'hl-pecdeck': { cite: 'How and Why to Use a Pec Deck Machine', url: 'https://www.healthline.com/health/pec-deck',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'pinto-2025': { cite: 'Pectoralis Clavicular and Sternocostal Thicknesses Increase Similarly in Response to One and Three Sets of Pec Deck Resistance Training in Untrained Young Men', url: 'https://pubmed.ncbi.nlm.nih.gov/40266636/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'soncin-2014': { cite: 'Influence of exercise order on electromyographic activity during upper body resistance training', url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC4327372/',
    kind: 'peer-reviewed', access: 'full', checked: '2026-09-30', use: 'WEAK' },
};
// Not cited: acsm-2009 (c12, c15: tempo and load steps; no field here restates them).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const ACE = 'ace-top3-chest';
const CL = {
  c1: C(['CONSENSUS'], [ACE, 'vg-pecfly'], 'c1'),
  c2: C(['CONSENSUS'], ['vg-pecfly', ACE, 'hl-pecdeck'], 'c2'),
  c3: C(['CONSENSUS'], ['vg-pecfly', 'hl-pecdeck'], 'c3'),
  c5: C(['CONSENSUS'], [ACE, 'vg-pecfly'], 'c5'),
  c6: C(['CONSENSUS'], [ACE], 'c6'),
  c7: C(['CONSENSUS'], [ACE], 'c7'),
  c8: C(['MECH', 'CONSENSUS'], [ACE], 'c8. ACE says it of the pec deck; applying it to the handle machine is by reasoning (card).'),
  c9: C(['MECH', 'WEAK'], [ACE], 'c9. Inferred from ACE\'s cable crossover advice (card).'),
  c14: C(['CONSENSUS'], ['hl-pecdeck'], 'c14'),
  grip: C(['CONSENSUS'], ['vg-pecfly', 'hl-pecdeck', ACE], 'card grip.type and grip.width, claims c3, c4'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
const H = 1.75, R = Math.PI / 180;
// 'elbows-bent' (card zoom fly-elbow wrong: "elbows bent sharply, as on the elbow-pad machine"; c4: 75-90 deg on the
// pad version): the spec's start pose with each grip moved along its own shoulder-to-grip line until the elbow flexion
// is 82.5 deg (the middle of c4's range), the spec's elbow pole kept. The spec holds 20 deg the same way (D at ELBOW).
const bentReach = (pose, flex) => {
  const lm = landmarksOf(pose, H), d = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]), out = {};
  for (const s of ['l', 'r']) {
    const S = lm[`shoulder.${s}`], E = lm[`elbow.${s}`], G = pose.reach[s].at;
    const L1 = d(S, E), L2 = d(E, lm[`grip.${s}`]), D0 = d(S, G);
    const D = Math.sqrt(L1 * L1 + L2 * L2 + 2 * L1 * L2 * Math.cos(flex * R));
    out[s] = { ...pose.reach[s], at: G.map((g, i) => S[i] + (g - S[i]) * D / D0) };
  }
  return out;
};
const PAD_FLEX = (75 + 90) / 2;
// 'back-off-pad' (card zoom fly-backpad wrong, c6: "upper back peeled off the pad to finish the rep"): the spec's end
// pose with the trunk bent forward off the pad. OPEN ITEM: the card gives no angle, and the plate is a front view, which
// cannot show the gap (card plate.viewWhy: "needs a side view"); BACK_OFF is a drawing value for the close-ups review.
const BACK_OFF = 15;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-bent': { pose: { ...plateSpec.poses.start, reach: bentReach(plateSpec.poses.start, PAD_FLEX) } },
  'back-off-pad': { pose: { ...plateSpec.poses.end, trunk: BACK_OFF } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds. `guide` names the crop mark the close-ups page defines (pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'fly-backpad', chip: 'Back pad', heading: 'Back pad', kind: 'posture',
    crop: { center: { landmark: 'backUpper', pose: 'end', dx: 0, dy: 0 }, sizePx: 150 },
    right: 'end',
    wrong: { still: 'back-off-pad' },
    callouts: {
      right: { text: 'On the pad', guide: 'pad-contact' },
      wrong: { text: 'Off the pad', guide: 'pad-gap' },
    },
    caption: {
      right: 'Upper back pressed into the pad as the handles meet.',
      wrong: 'Upper back peeled off the pad to finish the rep.',
    },
    alt: {
      right: 'End of the fly. The upper back stays pressed into the pad. The handles nearly meet in front of the chest.',
      wrong: 'End of the fly. The upper back has peeled off the pad to finish the rep.',
    },
  },
  {
    key: 'fly-elbow', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',
    crop: { center: { landmark: 'elbow.l', pose: 'start', dx: 0, dy: 0 }, sizePx: 150 },
    right: 'start',
    wrong: { still: 'elbows-bent' },
    callouts: {
      right: { text: 'Soft elbows', guide: 'elbow-angle' },
      wrong: { text: 'Bent sharply', guide: 'elbow-angle' },
    },
    caption: {
      right: 'Slight, fixed elbow bend with the arms at chest height.',
      wrong: 'Elbows bent sharply, as on the elbow-pad machine.',
    },
    alt: {
      right: 'Front view, arms open. The elbows keep a slight bend, hands on the handles at chest height.',
      wrong: 'Front view, arms open. The elbows are bent sharply, as on the elbow-pad pec deck.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest works about as hard as in the bench press, upper and lower parts alike.' }],
  secondary: [{ muscleId: 'front_delts', plain: 'The front of the shoulders also work hard in a chest fly.' }],
  watch: [],
  feelLine: 'You should feel this across your chest.',
  rows: [
    { key: 'shoulder', where: 'Shoulder pain', at: { muscles: ['front_delts'] },
      means: 'This machine puts the front of the shoulder in a vulnerable position.',
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c8 },
    { key: 'rocking', where: 'Body rocking on the seat', at: {},   // c14 names no body region
      means: 'The weight is so heavy that your body sways or rocks.',
      fix: 'Lower the weight.',
      claim: CL.c14 },
  ],
  claim: C(['DATA'], [ACE, 'pinto-2025'], 'c10 (primary); c11 is the front-delt secondary (soncin-2014, MECH/WEAK)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'short', title: 'Stopping short of full range', claim: CL.c6,
    fix: 'Go lighter until the handles nearly meet every rep.' },
  { key: 'back-off', title: 'Upper back lifting off pad', zoom: 'fly-backpad', claim: CL.c6,
    fix: 'Go lighter. Keep the back on the pad.' },
  { key: 'technique', title: 'Changing technique for more weight', claim: CL.c7,
    fix: 'Lower the weight.' },
];
const RISKS = [
  { key: 'shoulder', text: 'The pec deck puts the front of the shoulder in a vulnerable position.', claim: CL.c8 },
  { key: 'technique', text: 'Changing the technique to lift more weight can cause injury.', claim: CL.c7 },
  { key: 'behind', text: 'Starting with the arms behind the body may strain the shoulder.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_pec_fly',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['seat-back'],
  setup: [
    { kind: 'adjust', text: 'Set the seat so the handles are at chest level.', claim: CL.c2 },
    { kind: 'position', text: 'Sit back against the pad, feet flat, shoulder-width or wider.', zoom: 'fly-backpad', claim: CL.c1 },
    { kind: 'grip', text: 'Take the handles with the elbows slightly bent.', zoom: 'fly-elbow', claim: CL.c3 },
    { kind: 'load', text: 'Pick a weight you can take through the full range without rocking.', claim: CL.c14 },
  ],
  posture: [
    { key: 'back', label: 'Back on pad', detail: 'Back stays pressed into the pad for every rep.',
      anchor: { landmark: 'backUpper', pose: 'end' }, zoom: 'fly-backpad', claim: CL.c1 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Elbows keep the same slight bend.',
      anchor: { landmark: 'elbow.l', pose: 'start' }, zoom: 'fly-elbow', claim: CL.c3 },
    { key: 'height', label: 'Chest height', detail: 'Arms at chest-to-shoulder height.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c2 },
    { key: 'meet', label: 'Hands meet', detail: 'Bring the handles together until they nearly meet.', anchor: { landmark: 'grips', pose: 'end' }, claim: CL.c5 },
    { key: 'behind', label: 'Arms in front', detail: "Don't start with the arms behind the body.", anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c9 },
    { key: 'grip', label: 'Overhand grip', detail: 'Overhand on the handles. On the pad version, the forearms rest on the pads.',
      anchor: { landmark: 'grip.l', pose: 'start' }, claim: CL.grip },
    { key: 'width', label: 'Machine-set width', detail: 'The machine arms set the hand width.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.grip },
  ],
  feel,
  zooms,
  copy: {
    setupLine: 'Set the seat so the handles are at chest level. Sit back against the pad, feet flat.',
    mistakeLine: 'Never lift your upper back off the pad to finish a rep. Lower the weight instead.',
    cueLine: 'Handles nearly meet.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/pec_fly.json', rev: 1 },
};
