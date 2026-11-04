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
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B's lateral raise lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
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
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  'elbows-bent': { pose: { ...plateSpec.poses.start, reach: bentReach(plateSpec.poses.start, PAD_FLEX) } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom, same keys and kinds, in the zoom shell's form (callout anchors on the joint each label names).
const zooms = [
  {
    key: 'fly-elbow', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',
    crop: { center: { at: 'elbow.l', pose: 'right', off: [0, 0] }, sizePx: 150 },
    right: 'start',
    wrong: { base: 'start', pose: { reach: stills['elbows-bent'].pose.reach }, solid: true },
    callout: {
      right: { text: 'Soft elbows', anchor: 'elbow.l' },
      wrong: { text: 'Bent sharply', anchor: 'elbow.l' },
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
      means: 'The pec deck puts the front shoulder in a vulnerable position.',   // c8 says it of the pec deck
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c8 },
    { key: 'rocking', where: 'Body rocking on the seat', at: {},   // c14 names no body region
      means: 'The weight is so heavy that your body sways or rocks.',
      fix: 'Lower the weight.',
      claim: CL.c14 },
  ],
  claim: C(['DATA'], [ACE, 'pinto-2025'], 'c10 (primary); c11 is the front-delt secondary (soncin-2014, MECH/WEAK)'),
};

/* ------------------------------------------------------------------------------- risks (card risks) ---------- */
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
    { kind: 'position', text: 'Sit back against the pad, feet flat, shoulder-width or wider.', claim: CL.c1 },
    { kind: 'grip', text: 'Overhand grip, elbows slightly bent. The machine arms set the width.', zoom: 'fly-elbow',   // D-TEXT-GOLDEN: posture grip, width (c3, c4)
      claim: C(['CONSENSUS'], [...new Set([...CL.c3.sources, ...CL.grip.sources])], 'c3, c4') },
    { kind: 'load', text: 'Pick a weight you can take through the full range without rocking.', claim: CL.c14 },
    // c6's fault, shown (W2 panel: the posture checkpoint text is not printed on the sheet)
    { kind: 'brace', text: 'Upper back lifting off the pad? Go lighter.', claim: CL.c6 },
  ],
  posture: [
    // D-SHIP-Q14 (#376 6614695581): the card zoom fly-backpad is a text checkpoint (the front-view plate cannot show the
    // gap), as golden B's machine_chest_press keeps "Start depth" (:165, :285).
    // Q-W2-12 (#379 6628699724): the card's handlingMistakes on this `none` sheet are posture checkpoints: back-off
    // merged here (same claim c6), short merged into 'meet', technique as its own checkpoint.
    { key: 'back', label: 'Back on pad', detail: 'Upper back pressed into the pad as the handles meet. Upper back lifting off the pad to finish the rep? Go lighter.',
      anchor: { landmark: 'backUpper', pose: 'end' }, claim: CL.c6 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Elbows keep the same slight bend.',
      anchor: { landmark: 'elbow.l', pose: 'start' }, zoom: 'fly-elbow', claim: CL.c3 },
    { key: 'height', label: 'Chest height', detail: 'Arms at chest-to-shoulder height.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c2 },
    { key: 'meet', label: 'Hands meet', detail: 'Go lighter until the handles nearly meet every rep.', anchor: { landmark: 'grips', pose: 'end' },
      claim: C(['CONSENSUS'], [ACE, 'vg-pecfly'], 'c5, c6') },
    { key: 'technique', label: 'Changing technique', detail: 'Keep the same technique. Lower the weight.', anchor: { landmark: 'grip.l', pose: 'end' }, claim: CL.c7 },
    { key: 'behind', label: 'Arms in front', detail: "Don't start with the arms behind the body.", anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c9 },
    { key: 'grip', label: 'Overhand grip', detail: 'Overhand on the handles. On the pad version, the forearms rest on the pads.',
      anchor: { landmark: 'grip.l', pose: 'start' }, claim: CL.grip },
    { key: 'width', label: 'Machine-set width', detail: 'The machine arms set the hand width.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.grip },
  ],
  feel,
  zooms,
  chips: ['fly-elbow', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Set the seat so the handles are at chest level. Sit back against the pad, feet flat.',
    mistakeLine: 'Never lift your upper back off the pad to finish a rep. Lower the weight instead.',
    cueLine: 'Handles nearly meet.',
  },
  redFlag: RED_FLAG,
  mistakes: [],
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/pec_fly.json', rev: 1 },
};
