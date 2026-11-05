// LIB-SHIP W6: the How-to content of lib_smith_machine_squat (golden B's HowToContent shape, as
// tools/plates/layers/exercises/barbell_back_squat.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/smith_machine_squat.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW6, gap-ruled on tools/plates/library/hands/no-zoom.json): the card's hand zoom
// `smith-squat-hands` (c5, Wrong null) has no on-body pair key variant to draw it. Its hand claims (overhand, hands just
// outside the shoulders, wrists neutral, elbows under the bar; c5) live in handling (gripLine) and setup step 5.
// GRIP (c) (SHIP W6 PLAN RULED, #393 6647923934, LIB-SHIP-DESIGN.md section 14): grip.thumb and grip.handContact read
// "Not given by any Smith squat source read (on-body archetype default)". The thumb and contact below are golden B's
// on-body default (layers/exercises/barbell_back_squat.howto.mjs handling), DERIVED at import from the copied source
// lines and cited CONVENTION (source on-body-default), never shown (D-SHIP-CONVCOPY). The wrist is the card's own c5.
// Way-out (Q-W6-8, D-SHIP-W6-WAYOUT): the card's own c8 setup step (setup[1]) and c21 (risks), cited to this card only.
// Card zooms: `smith-squat-feet` is the plate's own Mistake (topFault `under`: feet directly under the bar, c3).
// Red flags: the card's redFlags (back, knee): LIB-5's back box (tools/plates/library/shared/back-box.mjs), linked by
// the low-back row's redFlag: 'back'; golden B's shared knee box, linked by the knee row.
// No variant line (equipment 'Smith Machine').
import plateSpec from '../specs/smith_machine_squat.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'golds-smith-squat': { cite: "How to Do Smith Machine Squats Safely and Effectively (Gold's Gym)", url: 'https://www.goldsgym.com/blog/how-to-do-smith-machine-squats/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'motra-smith-squat': { cite: 'Smith Machine Squat - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/smithMachineSquat',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-smith-squat': { cite: 'How to Do Smith Machine Squat: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/smith-machine-squat/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-22', use: 'CONSENSUS' },
  cotterman2005: { cite: 'Comparison of muscle force production using the Smith machine and free weights for bench press and squat exercises', url: 'https://pubmed.ncbi.nlm.nih.gov/15705030/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  macdougall1985: { cite: 'Arterial blood pressure response to heavy resistance exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/3980383/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  'eos-smith': { cite: 'How to Use a Smith Machine: 8 Exercises & Form Tips (EoS Fitness)', url: 'https://www.eosfitness.com/blog/how-to-use-smith-machine',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  // golden B's on-body archetype default for the hand values the card leaves unsourced (thumb, contact): a convention.
  'on-body-default': { cite: 'Golden B on-body archetype default (barbell_back_squat handling: thumb wrapped, contact heel)', url: 'tools/plates/layers/exercises/barbell_back_squat.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_barbell_overhead_press lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: abelbeck2002 (c4, a model of foot position; no field here restates it), schwanbeck2009 (c16, an EMG
// comparison), c14 (ACSM speed), c22 (tempo, a plate drawing value).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const GG = 'golds-smith-squat', MO = 'motra-smith-squat', SL = 'sl-smith-squat';
const CL = {
  c1: C(['CONSENSUS'], [GG], 'c1'),
  c2: C(['CONSENSUS'], [GG, MO, SL], 'c2'),
  c5: C(['CONSENSUS'], [GG], 'c5'),
  c6: C(['CONSENSUS'], [GG], 'c6'),
  c7: C(['CONSENSUS'], [GG], 'c7'),
  c8: C(['CONSENSUS'], [GG, MO], 'c8'),
  c10: C(['CONSENSUS'], [GG], 'c10'),
  c11: C(['CONSENSUS'], [GG], 'c11'),
  c15: C(['CONSENSUS'], [SL, MO], 'c15'),
  c18: C(['DATA', 'WEAK'], ['macdougall1985'], 'c18'),
  c19: C(['CONSENSUS'], [GG], 'c19'),
  feet: C(['CONSENSUS'], [GG, MO, SL], 'c3, c2'),
  back: C(['CONSENSUS'], [GG], 'c11, c12'),
  neck: C(['CONSENSUS'], [GG], 'c1, c9'),
  unrack: C(['CONSENSUS'], [GG, SL], 'c5, c20'),
  wayout: C(['CONSENSUS'], [GG, MO, 'eos-smith'], 'c8, c21'),
  load: C(['DATA', 'CONSENSUS'], ['cotterman2005', 'acsm2009'], 'c17, c13'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (c): the thumb and contact DERIVED at import from golden B's on-body rows, copied here (not imported: the golden
// file's closure pulls its render-only hand poses) and pinned against the live file by a test.
// barbell_back_squat.howto.mjs:346 reads `thumb: { mode: 'wrapped', options: [...]` and :347 reads `contact: 'heel',`.
// A copied line that names no known thumb mode or contact zone throws.
const ON_BODY_THUMB = "thumb: { mode: 'wrapped', options: [{ mode: 'beside', when: 'If wrapping bends your wrist back, rest your thumb over the bar.' }], claim: CL.thumb },";   // barbell_back_squat.howto.mjs:346
const ON_BODY_CONTACT = "contact: 'heel',";   // barbell_back_squat.howto.mjs:347
const THUMBS = new Set(['wrapped', 'wrapped-light', 'beside', 'over', 'hook', 'cupped', 'spread', 'loose']);   // content-types.ts ThumbMode
const CONTACTS = new Set(['heel', 'mid-palm', 'finger-base', 'fingertips', 'palm-flat', 'cupped']);         // content-types.ts HandContact
const THUMB = ON_BODY_THUMB.match(/^thumb: \{ mode: '([a-z-]+)'/)?.[1];
const CONTACT = ON_BODY_CONTACT.match(/^contact: '([a-z-]+)',$/)?.[1];
if (!THUMBS.has(THUMB) || !CONTACTS.has(CONTACT)) throw new Error(`lib_smith_machine_squat: no on-body thumb or contact default in ${ON_BODY_THUMB} / ${ON_BODY_CONTACT}`);
const CONV = C(['CONVENTION'], ['on-body-default'], 'card grip.thumb and grip.handContact: no Smith squat source gives them (on-body archetype default); golden B\'s on-body default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (thighs parallel, feet ahead of the bar; c2, c6) and the spec's Mistake pose
// merged over it, as the engine draws it (card plate.mistake c3: the feet back under the bar, the knees far forward).
// The card zoom `smith-squat-feet` Wrong is that drawn fault, so no drawing value is added.
const MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
  under: { pose: { ...plateSpec.poses.end, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `smith-squat-hands` (D-SHIP-HANDW6, above). The posture zoom is in the zoom
// shell's shape (callout with an anchor at the landmark it names, no guide mark; pilot-a.closeups.mjs).
const zooms = [
  {
    key: 'smith-squat-feet', chip: 'Feet', heading: 'Foot position', kind: 'posture',
    // zoom shell (render/closeup/crop.mjs): crop centre on the right pose's knee, low enough to hold the feet; the Wrong
    // is the spec's Mistake dashed over the end pose, as `stills.under`.
    crop: { center: { at: 'knee.r', pose: 'right', off: [0, 30] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    callout: {
      right: { text: 'Feet ahead', anchor: 'ball.r' },
      wrong: { text: 'Feet under bar', anchor: { at: 'ball.r', pose: 'mistake' } },
    },
    caption: {
      right: 'Feet a few inches ahead of the bar, heels down.',   // c2, c6
      wrong: 'Feet directly under the bar, knees far forward.',   // c3
    },
    alt: {
      right: 'Side view, bottom of the squat. The feet stand a few inches ahead of the bar, heels flat.',
      wrong: 'Side view, bottom of the squat. The feet sit directly under the bar, so the knees travel far forward.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The front of the thighs is a main mover.' },
    { muscleId: 'glutes', plain: 'The glutes are a main mover.' },
  ],
  secondary: [
    { muscleId: 'adductors', plain: 'The inner thighs help.' },
    { muscleId: 'hamstrings', plain: 'The backs of the thighs help.' },
    { muscleId: 'lower_back', plain: 'The lower back helps.' },
  ],
  watch: [],
  // The card's first row (front of the thighs and glutes, c15) has no fix, so it is left out: the feel line says it
  // (D-SHIP-Q16). D-TEXT-GOLDEN: posture 'lockout' (c7) is shown in the feel line.
  feelLine: 'You should feel this in the front of your thighs and your glutes. Stop just short of locking your knees.',
  rows: [
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Poor back posture puts more stress on your lower back.',
      fix: 'Brace and keep your spine neutral. Use a manageable weight.',
      redFlag: 'back', claim: CL.back },
    { key: 'knee', where: 'Sharp pain in the knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Not the normal dull pain 12 to 24 hours later.',
      fix: "Stop the workout at once. Don't train through the pain.",
      redFlag: 'knee', claim: CL.c19 },
    { key: 'neck', where: 'Pressure on the neck', at: { parts: ['neck-left', 'neck-right'] },
      means: 'The bar on your neck puts pressure on a vulnerable area.',
      fix: 'Stop, rack the bar, then move it onto your upper traps.',
      claim: CL.neck },
  ],
  claim: C(['CONSENSUS'], [SL, MO, GG], 'c15, c7'),   // the feel line: c15 (muscles), c7 (stop short of lockout)
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'under', title: 'Feet directly under the bar', zoom: 'smith-squat-feet', claim: CL.feet,
    fix: 'Move your feet a few inches in front of the bar.' },
  { key: 'knees', title: 'Knees caving in', claim: CL.c10,
    fix: 'Reduce the weight and reset. Knees in line with the toes.' },
  { key: 'back', title: 'Rounding or over-arching the back', claim: CL.back,
    fix: 'Brace and keep your chest forward. Use a manageable weight.' },
];
const RISKS = [
  { key: 'pressure', text: 'Heavy reps with a held breath send blood pressure very high.', claim: CL.c18 },
  // way-out (Q-W6-8): c8 and c21, this card's own claims
  { key: 'wayout', text: 'Missed rep? Let the stops catch the bar, or rack it any time.', claim: CL.wayout },
  { key: 'load', text: 'Smith loads differ from free-bar loads. Add weight in small steps.', claim: CL.load },
];

export default {
  schema: 1,
  id: 'lib_smith_machine_squat',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'on-body',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: no on-body pair key variant draws the card\'s hand zoom; the grip copy carries c5.',
    orientation: 'pronated',   // c5: overhand on the bar (card grip.type)
    overBody: false,           // the bar sits on the upper traps; a missed rep lands on the stops (c8, c21)
    width: { text: 'Hands just outside your shoulders.', claim: CL.c5 },
    thumb: { mode: THUMB, claim: CONV },   // CONVENTION: golden B's on-body default, derived above ('wrapped')
    contact: CONTACT,          // 'heel', CONVENTION: golden B's on-body default, derived above; never shown
    // c5: "wrists neutral". No degrees given; [0, 0] is the card's straight wrist (chest_supported_row's form), not a number.
    wrist: { ext: [0, 0], limitText: 'Keep your wrists neutral.', claim: CL.c5 },
    faults: [],                // the card zoom's Wrong is null; the card names no hand fault
    gripLine: 'Overhand, hands just outside your shoulders. Elbows under the bar, chest lifted.',   // c5
    cue: 'Elbows under the bar.',   // c5
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'adjust', text: 'Set the bar just below shoulder level.', claim: CL.c1 },
    // way-out (Q-W6-8, D-SHIP-W6-WAYOUT): the card's setup[1], c8
    { kind: 'safety', text: 'Set the stops just below squat depth. Test with a light rep.', claim: CL.c8 },
    { kind: 'position', text: 'Step under, bar across the upper traps, not the neck.', claim: CL.c1 },
    { kind: 'position', text: 'Feet shoulder-width, a few inches in front of the bar.', zoom: 'smith-squat-feet', claim: CL.c2 },
    { kind: 'grip', text: 'Hands outside the shoulders. Brace, then rotate the bar off the hooks.', claim: CL.unrack },
  ],
  posture: [
    { key: 'bar', label: 'Bar on traps', detail: 'Bar on the upper traps, never the neck.',
      anchor: { landmark: 'trap.r', pose: 'start' }, claim: CL.c1 },
    { key: 'elbows', label: 'Elbows under bar', detail: 'Elbows under the bar, wrists neutral, chest lifted.',
      anchor: { landmark: 'elbow.r', pose: 'start' }, claim: CL.c5 },
    { key: 'spine', label: 'Spine neutral', detail: 'Spine neutral, not rounded or over-arched.',
      anchor: { landmark: 'lumbar', pose: 'end' }, claim: CL.c11 },
    { key: 'knees', label: 'Knees over toes', detail: 'Knees track in line with the toes.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c10 },
    { key: 'heels', label: 'Heels down', detail: 'Heels stay down.',
      anchor: { landmark: 'heel.r', pose: 'end' }, zoom: 'smith-squat-feet', claim: CL.c6 },
    { key: 'lockout', label: 'Soft knees', detail: 'Stop just short of locking the knees.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['smith-squat-feet', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Set the stops first. Bar across your upper traps, feet a few inches ahead of it.',
    mistakeLine: 'Keep your feet a few inches in front of the bar, not under it.',
    cueLine: 'Feet ahead of the bar.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back', 'knee'],   // the card's redFlags, in its order
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/smith_machine_squat.json', rev: 1 },
};
