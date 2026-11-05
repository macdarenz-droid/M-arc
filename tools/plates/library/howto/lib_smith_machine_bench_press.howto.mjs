// LIB-SHIP W4: the How-to content of lib_smith_machine_bench_press (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/smith_machine_bench_press.json; its claim ids are named on each field's claim.
// Family (card parent barbell_bench_press; D-SHIP-FAMILY, INHERIT_MAP lib_smith_machine_bench_press, D-SHIP-W4-GAPZOOM):
// the card's inherit[] delegates grip.thumb, grip.type, grip.handContact, grip.wrist and zooms.bar-low-palm. Those paths
// (handling.thumb.mode, handling.orientation, handling.contact, handling.wrist, handling.faults[key=bent-back]) are
// written leaf-equal to lib_barbell_bench_press.howto.mjs (family.mjs familyRefusal, `===`); each claim cites this
// card's inherit[] entry. grip.type maps to the orientation only: this card claims no handle (the Smith bar runs on
// rails, c8), so handling.handle is not set.
// No hand zoom (D-SHIP-HANDW4, gap-ruled on tools/plates/library/hands/no-zoom.json): bar-low-palm, inherited, is a push
// heel-of-palm pair golden B's engine cannot draw (D-LIB7-19). Its Right words are the gripLine, its Wrong the fault alt.
// Posture zoom `smith-bench-position` (c2, c4, c3, c7): DV, a one-joint drawing value (the lumbar extension, below);
// the plate's own Mistake is the elbow flare (c7, c3), so it is not reused here. The card's arch mistake (c7, c17)
// stays visible in mistakes[1] and the zoom's Wrong caption.
// Way out (c4, c5): the shared equipment-move card docs/research/howto/shared/unrack-rerack.json (smith) covers this id
// (stops, hooks); no W2/W3 sheet imports a shared equipment-move card, so the stops and hook steps are this card's own.
// Red flags: the card's redFlags (shoulder), golden B's shared shoulder box.
import plateSpec, { supine, bisect } from '../specs/smith_machine_bench_press.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-smith-bench': { cite: 'How to Do Smith Machine Bench Press: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/smith-machine-bench-press/',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'motra-smith-bench': { cite: 'Smith Machine Bench Press - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/smithMachineBenchPress',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  'eos-smith': { cite: 'How to Use a Smith Machine: 8 Exercises & Form Tips (EoS Fitness)', url: 'https://www.eosfitness.com/blog/how-to-use-smith-machine',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'CONSENSUS' },
  schick2010: { cite: 'A comparison of muscle activation between a Smith machine and free weight bench press', url: 'https://pubmed.ncbi.nlm.nih.gov/20093960/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  cotterman2005: { cite: 'Comparison of muscle force production using the Smith machine and free weights for bench press and squat exercises', url: 'https://pubmed.ncbi.nlm.nih.gov/15705030/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  acsm2009: { cite: 'American College of Sports Medicine position stand. Progression models in resistance training for healthy adults', url: 'https://pubmed.ncbi.nlm.nih.gov/19204579/',
    kind: 'guideline', access: 'abstract', checked: '2026-10-17', use: 'CONSENSUS' },
  jumbelic2007: { cite: 'Traumatic asphyxia in weightlifters', url: 'https://pubmed.ncbi.nlm.nih.gov/17456099/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  kolber2010: { cite: 'Shoulder injuries attributed to resistance training: a brief review', url: 'https://pubmed.ncbi.nlm.nih.gov/20508476/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-09-30', use: 'DATA' },
  'motra-smith-incline': { cite: 'Smith Machine Incline Bench Press - Exercise Guide (Motra)', url: 'https://www.motra.com/exercises/smithMachineInclineBenchPress',
    kind: 'coach', access: 'full', checked: '2026-09-30', use: 'WEAK' },
  // RED_FLAG_SHOULDER's own source (layers/howto/shared.mjs), as golden B lists it: the card's redFlags 'shoulder'.
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: c8 (the straight rail path; the plate draws it), c9 (side-shoulder EMG; no field restates it), c12, c18
// (tempo, a plate drawing convention).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-smith-bench', MO = 'motra-smith-bench';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c2: C(['CONSENSUS'], [MO], 'c2'),
  c3: C(['CONSENSUS'], [SL, MO], 'c3'),
  c7: C(['CONSENSUS'], [MO], 'c7'),
  c10: C(['DATA'], ['cotterman2005'], 'c10'),
  c11: C(['CONSENSUS'], [SL], 'c11'),
  c13: C(['CONSENSUS'], ['acsm2009'], 'c13'),
  c15: C(['DATA'], ['kolber2010'], 'c15'),
  flare: C(['CONSENSUS'], [MO, SL], 'c7, c3'),
  stops: C(['CONSENSUS'], ['eos-smith', MO, SL], 'c4, c3'),
  // card inherit[]: the field is barbell_bench_press's, true here by the card's own inherit reason (MECH)
  thumb: C(['MECH'], [], 'card inherit grip.thumb (inherit:0): the lifter lies under a loaded bar lowered to the mid-chest (c14); parent c4.'),
  type: C(['MECH'], [], 'card inherit grip.type (inherit:1): the same straight bar pressed lying face up with an overhand grip; parent c4.'),
  hand: C(['MECH'], [], 'card inherit grip.handContact, grip.wrist, zooms.bar-low-palm (inherit:2, 3, 4): the bar sits low in the palm whatever the rails; parent c5.'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the start (bar off the hooks on straight arms, c2, c5), the end (bar on the mid-chest,
// elbows about 45 degrees, c3) and the spec's Mistake merged over the end, as the engine draws it (the elbows flare
// wide, c7). 'arch' is the card zoom smith-bench-position Wrong (c7: "Back arched excessively"), which the plate does not
// draw:
// DRAWING VALUE (D-SHIP-DRAWVAL, #376 6614695581; precedent lib_straight_arm_pulldown ARCH): ARCH, the end pose's lumbar
// (trunk) extended 15 deg past the plate's own (the supine class's slight arch that puts the upper back and buttock on
// the pad), one joint. The spec's own `supine()` holds the buttock, upper back and skull on the pad for it: the pelvis
// tilt is solved so supine's trunk is the plate's minus ARCH, and the lumbar lifts off the pad. The card gives no size,
// so no number from it appears in user copy; the layers panel judges it. BENCH_TOP (0.43 m) and the bench z (0) are the
// spec's own (specs/smith_machine_bench_press.mjs LYING; not exported); the guard below throws if they stop reproducing
// the spec's end pose.
const END = plateSpec.poses.end;
const ARCH = 15, BENCH_TOP = 0.43;
{ const p = supine(BENCH_TOP, 0);
  if (Math.abs(p.trunk - END.trunk) > 1e-9 || p.root.at.some((v, i) => Math.abs(v - END.root.at[i]) > 1e-9))
    throw new Error('lib_smith_machine_bench_press: BENCH_TOP no longer reproduces the spec end pose'); }
const ARCH_TILT = bisect(t => (END.trunk - ARCH) - supine(BENCH_TOP, 0, { tilt: t }).trunk, -90, -75);
const ARCH_POSE = supine(BENCH_TOP, 0, { tilt: ARCH_TILT });   // { root, trunk, neck }
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  flare: { pose: { ...END, ...plateSpec.mistake.pose } },
  arch: { pose: { ...END, ...ARCH_POSE } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `bar-low-palm` (D-SHIP-HANDW4, above). Zoom shell shape (callout with an anchor
// at the landmark it names, no guide mark): crop centre on the right pose's lumbar, wide enough for the bar on the
// mid-chest and the stops; the Wrong is the `arch` still drawn alone (solid).
const zooms = [
  {
    key: 'smith-bench-position', chip: 'Bench', heading: 'Bench position', kind: 'posture',
    crop: { center: { at: 'lumbar', pose: 'right', off: [-10, -20] }, sizePx: 220 },
    right: 'end',
    wrong: { base: 'end', pose: ARCH_POSE, solid: true },
    callout: {
      right: { text: 'Bar on mid-chest', anchor: 'grip.r' },
      wrong: { text: 'Back arched', anchor: { at: 'lumbar', pose: 'mistake' } },
    },
    caption: {
      right: 'Bar lands on the mid-chest. Stops just below that point.',
      wrong: 'Back arched excessively.',
    },
    alt: {
      right: 'Side view, bottom of the press. The bar touches the middle of the chest. The safety stops sit just below it.',
      wrong: 'Side view, bottom of the press. The low back arches high off the bench.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'chest', plain: 'The chest is the main mover.' }],
  secondary: [
    { muscleId: 'front_delts', plain: 'The front of the shoulders help press.' },
    { muscleId: 'triceps', plain: 'The backs of the upper arms help.' },
  ],
  watch: [],
  feelLine: 'You should feel this in your chest, front shoulders and the backs of your arms.',
  rows: [
    // The card's first row (target muscles) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'shoulder', where: 'Any shoulder pain', at: { muscles: ['front_delts'] },
      means: '',   // D-FEEL-NOMEANS: c7 names the fault, but no claim ties it to the pain (SWEEP 1)
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: C(['CONSENSUS', 'WEAK'], ['motra-smith-incline', MO], 'c16, c7') },
  ],
  claim: CL.c11,
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'flare', title: 'Flaring the elbows wide', claim: CL.flare,
    fix: 'Keep the elbows at about 45 degrees.' },
  { key: 'arch', title: 'Arching the back too much', zoom: 'smith-bench-position', claim: C(['CONSENSUS'], [MO], 'c7, c17'),
    fix: "Chest up, ribs down. Don't arch too much." },
  { key: 'bounce', title: 'Bar bouncing off the chest', claim: CL.flare,
    fix: 'Lower with control until the bar just touches.' },
];
const RISKS = [
  { key: 'face', text: 'Bar can slip onto your face, throat or chest: set stops, wrap thumbs.',
    claim: C(['DATA', 'MECH', 'CONSENSUS'], ['jumbelic2007', MO, 'eos-smith'], 'c14, c4, inherit:0') },
  { key: 'load', text: "People lift less on the Smith bench, so a free-bar load doesn't carry over.", claim: CL.c10 },
  { key: 'shoulder', text: 'The shoulder is a common injury site in lifting, linked to poor technique.', claim: CL.c15 },
];

export default {
  schema: 1,
  id: 'lib_smith_machine_bench_press',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'push',
    why: "D-SHIP-C3 no-zoom list, D-SHIP-HANDW4: bar-low-palm, inherited from barbell_bench_press: push heel-of-palm pair not drawable through golden B's engine (D-LIB7-19); no key draws it.",
    orientation: 'pronated',   // inherited (grip.type): closed grip, palms toward the feet
    overBody: true,            // card inherit grip.thumb: the lifter lies under the loaded bar (c14)
    width: { text: 'Hands slightly wider than shoulder-width.', claim: CL.c1 },
    thumb: { mode: 'wrapped', claim: CL.thumb },   // inherited (grip.thumb)
    contact: 'heel',                               // inherited (grip.handContact)
    // inherited (grip.wrist): the parent's ext range (pairs.mjs CONVENTIONS ga:push-heel, a convention) and words.
    wrist: { ext: [0, 15], limitText: 'Bar over the wrist, wrist not bent back.', claim: CL.hand },
    faults: [
      // inherited (zooms.bar-low-palm): the parent's bent-back fault, the card zoom's Wrong. Not drawn.
      { key: 'bent-back', label: 'Wrist bent back', pose: {}, markers: [], alt: 'Bar high toward the fingers, wrist bent back.' },
    ],
    // card zoom bar-low-palm Right (inherit:4), with the inherited grip type. Its "wrist straight" shows as the
    // inherited wrist.limitText's "wrist not bent back", the words parent c5 supports (SWEEP 2, 6).
    gripLine: "Closed grip, palms toward your feet. Bar in the palm's base, not high toward the fingers, thumb wrapped.",
    cue: 'Palm base, wrist not bent back.',   // hint C
  },
  contacts: ['bench-lying'],
  setup: [
    { kind: 'position', text: 'Place the flat bench so the bar lines up with your mid-chest.', zoom: 'smith-bench-position', claim: CL.c2 },
    { kind: 'safety', text: 'Set the safety stops just below where the bar touches your chest.', zoom: 'smith-bench-position', claim: CL.stops },
    { kind: 'grip', text: 'Lie back, feet flat, shoulder blades down. Grip slightly wider than shoulders.',
      claim: C(['CONSENSUS'], [SL, MO], 'c1, c2') },
    { kind: 'get-in', text: 'Start with just the bar. Rotate it off the hooks.', claim: C(['CONSENSUS'], ['eos-smith', MO], 'c6, c5') },
    { kind: 'load', text: 'Beat target by one or two reps? Add 2 to 10 percent.', claim: CL.c13 },
  ],
  posture: [
    { key: 'blades', label: 'Blades together', detail: 'Shoulder blades together and down, chest up.',
      anchor: { landmark: 'backUpper', pose: 'start' }, claim: CL.c1 },
    { key: 'feet', label: 'Feet flat', detail: 'Feet flat on the floor.',
      anchor: { landmark: 'sole.r', pose: 'start' }, claim: CL.c2 },
    { key: 'touch', label: 'Bar over mid-chest', detail: 'Bar comes down to the mid-chest.',
      anchor: { landmark: 'grip.r', pose: 'end' }, zoom: 'smith-bench-position', claim: CL.c3 },
    { key: 'elbows', label: 'Elbows 45', detail: 'Elbows at about 45 degrees, not flared wide.',
      anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.flare },
    { key: 'arch', label: 'No big arch', detail: 'Back not arched excessively.',
      anchor: { landmark: 'lumbar', pose: 'end' }, zoom: 'smith-bench-position', claim: CL.c7 },
  ],
  feel,
  zooms,
  chips: ['smith-bench-position', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Bench placed so the bar meets your mid-chest. Stops just below that point.',
    mistakeLine: "Chest up, ribs down. Don't arch your back too much.",
    cueLine: 'Elbows at about 45 degrees.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/smith_machine_bench_press.json', rev: 1 },
};
