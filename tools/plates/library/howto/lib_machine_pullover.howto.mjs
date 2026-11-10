// LIB-SHIP W6: the How-to content of lib_machine_pullover (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/machine_pullover.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-C3 no-zoom list, gap-ruled D-SHIP-HANDW6, #393 6647923934): the card's hand zoom
// `pullover-hands` (c6) has no pair key that draws an open hand on a pullover arm, and the card gives no pose numbers
// (ruling 8); the id is on tools/plates/library/hands/no-zoom.json. Its hand claims (no grip, open hands on the bar,
// fingers extended, the elbows doing the push; c3, c6) live in handling (gripLine) and the plate's
// 'Push with elbows' label.
// GRIP (Q-W6-4): thumb `spread` from the card's grip.thumb "Not wrapped; fingers extended" (c3, c6); contact `palm-flat`
// from grip.handContact "Palms open against the bar" (c6); `handle` omitted (grip.type "No grip"). The card's grip.wrist
// reads "Not given by any source read (balance archetype default)": the wrist is exempt (D-SHIP-W6-WRISTEXEMPT, #393
// 6648157060), cited CONVENTION (source balance-default); no range is taken and nothing is printed.
// Zooms: none. pullover-pivot (c1) is a text checkpoint (D-SHIP-TEXTZOOM, the machine_chest_press 'Start depth'
// precedent): its Wrong is a seat setting; posture checkpoint `pivot`, setup step 1 and the plate's 'Shoulders at
// pivot' label.
// Red flags: none (the card's redFlags is empty). Variant line: none on the sheet (equipment 'Machine', one kind); the
// card's variantLine (handle-only machines) stays on the plate.
import plateSpec from '../specs/machine_pullover.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'mq-pullover': { cite: 'Pullover (Marquette University Athletics, strength and conditioning exercise description)', url: 'https://gomarquette.com/news/2006/5/8/pullover.aspx',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'pf-pullover': { cite: 'Pullover Machine (Back Target): How to Do, Proper Form, Tips & Alternatives (Planfit)', url: 'https://planfit.ai/en/exercise/pullover-machine-back-target',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'vg-pullover': { cite: 'Pullover Machine Video Exercise Guide (Virtuagym)', url: 'https://exercises.virtuagym.com/exercise/pullover-machine/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'difonza-2026': { cite: 'Electromyographic Analysis of Latissimus Dorsi Activation During Common Resistance Training Exercises: A Narrative Review', url: 'https://pubmed.ncbi.nlm.nih.gov/42647355/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'bull-2007': { cite: 'Electromyographic validation of the deltoideus (anterior portion) and pectoralis major (clavicular portion) muscles in pull-over exercises', url: 'https://pubmed.ncbi.nlm.nih.gov/18051626/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // golden B's `balance` archetype default, which the card's grip.wrist delegates to: a convention (no range taken).
  'balance-default': { cite: 'Golden B balance archetype default (leg_press handling)', url: 'tools/plates/layers/exercises/leg_press.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
};
// Not cited: acsm-2009 (c14 tempo, c15 load progression; the plate carries the tempo, and the five setup steps carry the
// card's own steps and its hold at the belt).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const MQ = 'mq-pullover', PF = 'pf-pullover', VG = 'vg-pullover';
const CL = {
  c1: C(['CONSENSUS'], [MQ], 'c1'),
  c2: C(['CONSENSUS'], [MQ], 'c2'),
  c3: C(['CONSENSUS'], [MQ], 'c3'),
  c4: C(['CONSENSUS'], [MQ], 'c4'),
  c5: C(['CONSENSUS'], [MQ], 'c5'),
  c6: C(['CONSENSUS'], [MQ], 'c6'),
  c8: C(['CONSENSUS'], [PF], 'c8'),
  c9: C(['CONSENSUS'], [PF, VG], 'c9'),
  c10: C(['CONSENSUS'], [PF], 'c10'),
  grip: C(['CONSENSUS'], [MQ], 'c3, c6'),
  arch: C(['CONSENSUS'], [PF, MQ], 'c8, c7'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// D-SHIP-W6-WRISTEXEMPT: the card's grip.wrist delegates to the balance archetype default; no range is taken.
const CONV_WRIST = C(['CONVENTION'], ['balance-default'], 'card grip.wrist: balance archetype default only; no source gives a wrist range, so none is taken and nothing is shown (D-SHIP-W6-WRISTEXEMPT)');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// No zoom crops; the stills are the plate spec's own poses.
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
};

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'lats', plain: 'The lats, along the sides of your back, do the work.' }],
  secondary: [
    { muscleId: 'rear_delts', plain: 'The backs of the shoulders help.' },
    { muscleId: 'chest', plain: 'The chest may also work.' },
  ],
  watch: [{ muscleId: 'lower_back', plain: 'Arching puts too much pressure on your lower back.' }],   // c8
  feelLine: 'You should feel this along the sides of your back.',
  rows: [
    // The card's first row (along the sides of the back) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Arching puts too much pressure on your lower back.',   // c8
      fix: 'Keep your back on the pad.',
      claim: CL.arch },
    { key: 'neck', where: 'Neck and tops of the shoulders', at: { parts: ['neck-left', 'neck-right'] },
      means: 'Tense shoulders let tension build up in your neck.',
      fix: 'Relax your shoulders down.',
      claim: CL.c10 },
  ],
  libraryDiff: { add: ['rear_delts', 'chest'], remove: ['triceps'],
    why: 'The posterior deltoid is listed for this machine and pullovers work the chest (card c12, c13); the hands stay open and the force is at the elbows, so the triceps are removed (c6).' },
  claim: C(['CONSENSUS', 'DATA', 'WEAK'], [MQ, PF, 'difonza-2026', 'bull-2007', VG], 'c12 (primary, rear_delts), c13 (chest), c8 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'arch', title: 'Back arching off the pad', claim: CL.arch,
    fix: 'Keep your back and head on the pad.' },
  { key: 'exit', title: 'Arms off the pads first', claim: CL.c5,
    fix: 'Feet on the bar first, then lower the stack with your legs.' },
  { key: 'heavy', title: 'Too much weight', claim: CL.c9,
    fix: 'Lower the weight until you feel your lats.' },
];
const RISKS = [
  { key: 'arch', text: 'Arching the back puts too much pressure on the lower back.', claim: CL.c8 },
  { key: 'heavy', text: 'Too much weight makes the lats harder to feel.', claim: CL.c9 },
];

export default {
  schema: 1,
  id: 'lib_machine_pullover',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'balance',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: no pair key draws an open hand on a pullover arm and the card gives no pose numbers (ruling 8); the grip copy carries c3 and c6.',
    // handle omitted (Q-W6-4): the card's grip.type is "No grip"
    loadAxis: 'across',        // golden B's balance default (leg_press.howto.mjs:327)
    width: { text: 'Set by the machine arm.', claim: CL.c3 },
    thumb: { mode: 'spread', claim: CL.grip },   // c3, c6: not wrapped, fingers extended
    contact: 'palm-flat',      // c6: palms open against the bar
    // D-SHIP-W6-WRISTEXEMPT: the card delegates grip.wrist; no range, nothing printed. c6 stays in gripLine and the cue.
    wrist: { exempt: 'Card grip.wrist: balance archetype default only; no source gives a wrist range for this exercise.', claim: CONV_WRIST },
    faults: [
      // card zoom pullover-hands wrong (c6). Not drawn (no hand zoom), so no pose or marker is set.
      { key: 'fist', label: 'Fist gripping', pose: {}, markers: [], alt: 'A fist grips the bar and the hands pull.' },
    ],
    gripLine: 'No grip: open hands on the bar, fingers extended. Push with your elbows.',   // c3, c6
    cue: 'Push with your elbows.',   // c6
  },
  contacts: ['seat-back'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: "Set the seat so your shoulders are just below the machine's pivot.", claim: CL.c1 },
    { kind: 'position', text: 'Fasten the belt, back flat on the pad, feet on the bar.', claim: CL.c2 },
    // card setup steps 3 and 4 in one (both c3), so card posture 'Hold the bar close to the belt' (c4) fits the cap
    { kind: 'get-in', text: 'Push the foot bar down, arms on the pads, then feet off.', claim: CL.c3 },
    // D-TEXT-GOLDEN: card posture 'Hold the bar close to the belt for a moment at the bottom' (c4)
    { kind: 'position', text: 'Pull the bar down to your belt. Hold it there a moment.', claim: CL.c4 },
    { kind: 'get-out', text: 'To finish: feet on the bar, arms off, legs lower the stack.', claim: CL.c5 },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom pullover-pivot as a text checkpoint (its Wrong is a seat setting)
    { key: 'pivot', label: 'Shoulders at pivot', detail: "Seat set so the shoulders sit just below the machine's pivot.",
      anchor: { landmark: 'shoulder.r', pose: 'start' }, claim: CL.c1 },
    { key: 'pad', label: 'Back on pad', detail: 'Torso and head stay on the back pad.', anchor: { landmark: 'backUpper', pose: 'end' }, claim: C(['CONSENSUS'], [MQ], 'c7') },
    { key: 'arch', label: 'No arch', detail: "Lower back doesn't arch away from the pad.", anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.c8 },
    { key: 'elbows', label: 'Push with elbows', detail: 'Hands open, push through the elbows.', anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c6 },
    { key: 'shoulders', label: 'Shoulders relaxed', detail: 'Shoulders relaxed, neck loose.', anchor: { landmark: 'neck', pose: 'end' }, claim: CL.c10 },
    { key: 'hold', label: 'Hold at belt', detail: 'Hold the bar close to the belt for a moment at the bottom.', anchor: { landmark: 'grip.r', pose: 'end' }, claim: CL.c4 },
  ],
  feel,
  zooms: [],
  copy: {
    setupLine: "Set the seat so your shoulders are just below the machine's pivot. Fasten the belt.",
    mistakeLine: 'Keep your back and head on the pad. Push with your elbows.',
    cueLine: 'Push with your elbows.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: [],   // the card's redFlags (none)
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/machine_pullover.json', rev: 1 },
};
