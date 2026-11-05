// LIB-SHIP W7: the How-to content of lib_cable_kickback (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/cable_kickback.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: the hands hold the machine for support), so there is no hand claim to draw: NoHandling, no hand zoom (the
// card has none). The card's grip.type (c2, c4) is setup step 2.
// No variant line (equipment 'Cable').
// Red flags: the card's redFlags (back): LIB-5's back box (shared/back-box.mjs), linked by the lower-back row.
//
// D-TEXT-GOLDEN (claim -> slot):
//   posture c4 brace, body still                 -> setup step 3
//   posture c8 belly button in, back flat        -> feel row 'low-back' fix, posture 'back', zoom braced-back
//   posture c5 leg long, knee slightly bent      -> setup step 4 (D-TEXT-PRINTED), plate label 'Leg long', posture 'leg'
//   posture c6/c13 drive back as far as you can  -> setup step 5 (D-TEXT-PRINTED), posture 'drive'
//   posture c6 squeeze, pause a second           -> setup step 5 (D-TEXT-PRINTED), tempo 'Hold 1 s', posture 'squeeze'
//   posture c6 return slowly                     -> setup step 5 (D-TEXT-PRINTED), posture 'return'
//   zoom hips-square (a rotation unseen in the side view) -> T: Right setup step 4, Wrong risk 'twist' (D-TEXT-PRINTED); posture 'hips' (D-SHIP-TEXTZOOM)
//   handlingMistakes (Q-W2-12): arching (c7) -> zoom braced-back Wrong, posture 'back'; swinging (c9, c8) -> risk 'swing', posture 'swing'; twisting (c10) -> risk 'twist', posture 'hips'
import plateSpec from '../specs/cable_kickback.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'bb-gk': { cite: 'How to Do Glute Kickbacks to Build Your Butt (BarBend)', url: 'https://barbend.com/glute-kickbacks/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-ck': { cite: 'Cable Kickbacks (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/glutes/glute-kickbacks/cable-kickbacks/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-ck': { cite: 'How to Do Cable Glute Kickback: Muscled Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/cable-glute-kickback/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'fb-che': { cite: 'Cable Hip Extension (also known as Cable Kickback): Form, Muscles Worked (Fitbod)', url: 'https://fitbod.me/exercises/cable-hip-extension',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'pg-gkhub': { cite: 'Glute Kickback Variations (PureGym exercise guide)', url: 'https://www.puregym.com/exercises/glutes/glute-kickbacks/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'WEAK' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_rope_triceps_pushdown lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};
// Not cited: c3 (Fitbod's upright stance, which differs from the drawn hinge), c14 (tempo, plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const BB = 'bb-gk', PG = 'pg-ck', SL = 'sl-ck', FB = 'fb-che';
const CL = {
  c1: C(['CONSENSUS'], [BB, PG, SL], 'card c1'),
  c4: C(['CONSENSUS'], [BB, SL, FB], 'card c4'),
  c5: C(['CONSENSUS'], [BB, FB], 'card c5'),
  c6: C(['CONSENSUS'], [PG, SL, BB], 'card c6'),
  c10: C(['CONSENSUS'], [FB], 'card c10'),
  c11: C(['CONSENSUS'], [BB], 'card c11'),
  legHips: C(['CONSENSUS'], [BB, FB], 'card c5, c10'),
  hold: C(['CONSENSUS'], [PG, BB, SL, FB], 'card c2, c4'),
  drive: C(['CONSENSUS', 'WEAK'], [PG, SL, BB, 'pg-gkhub'], 'card c6, c13'),
  swing: C(['CONSENSUS'], [BB, PG], 'card c9, c8'),
  back: C(['CONSENSUS'], [PG, BB], 'card c8, c7'),
  lowBack: C(['CONSENSUS'], [PG, BB], 'card c8, c7'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: the end (leg driven back, back flat; c6, c7) and the spec's Mistake merged over it,
// as the engine draws it (the lower back arching as the leg kicks back; card plate.mistake, c7, c8). The card zoom
// braced-back Wrong is that drawn fault, so no drawing value is added here.
const MIS = plateSpec.mistake.pose, END = plateSpec.poses.end;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  arch: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// braced-back (M): the zoom shell (render/closeup/crop.mjs); the Wrong is the plate's own Mistake dashed red over the
// right pose, with the plate's Mistake guides (the dashed cable and arched back). The crop window (centre offset,
// sizePx) is a drawing value.
const zooms = [
  {
    key: 'braced-back', chip: 'Back', heading: 'Braced back', kind: 'posture',
    // claims: Right (callout, caption, alt) card c2, c8, c4; Wrong card c7, c8
    crop: { center: { at: 'lumbar', pose: 'right', off: [0, 0] }, sizePx: 190 },
    right: 'end',
    wrong: { base: 'end', pose: MIS },
    guides: plateSpec.mistake.guides,
    callout: {
      right: { text: 'Back flat', anchor: 'backMid' },
      wrong: { text: 'Back arches', anchor: { at: 'sacrum', pose: 'mistake' } },
    },
    caption: {
      right: 'Hinged forward, back flat, core braced.',
      wrong: 'Lower back arching as the leg kicks back.',
    },
    alt: {
      right: 'Side view, leg driven back on the cable. Hinged forward at the hips, the back flat and the core braced.',
      wrong: 'Side view. The lower back arches as the leg kicks back. Drawn dashed over the right position.',
    },
    feelRow: 'low-back',
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'glutes', plain: 'The glute of the working leg does the work.' }],
  secondary: [{ muscleId: 'hamstrings', plain: 'The hamstrings help.' }],
  watch: [{ muscleId: 'lower_back', plain: 'Poor form can bring in the lower back.' }],   // card c8 (its strength)
  feelLine: 'You should feel this in the glute of your working leg.',
  rows: [
    // The card's first row (glute of the working leg) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Poor form can bring in the lower back.',
      fix: 'Pull your belly button in and flatten your back.',
      zoom: 'braced-back', redFlag: 'back', claim: CL.lowBack },
  ],
  claim: C(['CONSENSUS'], [SL, PG, BB, FB], 'card c12'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'heavy', text: 'Heavy loading breaks your form down quickly on this long lever.', claim: CL.c11 },
  // D-TEXT-PRINTED: the handlingMistakes swinging (c9) and twisting (c10, the hips-square Wrong) as printed faults.
  { key: 'swing', text: "Can't lift without swinging the leg? Drop the weight.", claim: CL.swing },
  { key: 'twist', text: 'Twisting your hips lifts the leg higher but makes it less effective.', claim: CL.c10 },
];

export default {
  schema: 1,
  id: 'lib_cable_kickback',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP (b): the card gives no thumb, contact or wrist claim; its grip type (c2, c4) is setup step 2.' },
  contacts: ['standing-feet'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the pulley lowest. Strap the cuff around your working ankle.', claim: CL.c1 },
    { kind: 'grip', text: 'Face and hold the machine. Hinge forward, weight on the other leg.', claim: CL.hold },
    { kind: 'brace', text: 'Brace your trunk. Use your hands and free leg to stay still.', zoom: 'braced-back', claim: CL.c4 },
    { kind: 'position', text: 'Leg long, knee slightly bent. Hips level, toe pointing straight down.', claim: CL.legHips },
    { kind: 'position', text: 'Drive back as far as you can. Squeeze, pause, return slowly.', claim: CL.drive },
  ],
  posture: [
    // Q-W2-12: handlingMistake 'Not bracing, lower back arching' (c7) merged here, its fix added
    { key: 'back', label: 'Back flat', detail: 'Pull your belly button in to keep your back flat. Brace against the machine. Only your glute moves the leg.',
      anchor: { landmark: 'backMid', pose: 'end' }, zoom: 'braced-back', claim: CL.back },
    // D-SHIP-TEXTZOOM: the card zoom hips-square as a text checkpoint (a rotation the side view cannot show)
    // Q-W2-12: handlingMistake 'Twisting the hips' (c10) merged here, its fix added
    { key: 'hips', label: 'Hips square', detail: "Don't twist your hips. Keep them level, toe pointing straight down.",
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c10 },
    { key: 'leg', label: 'Leg long', detail: 'Keep the working leg long, knee only slightly bent.',
      anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c5 },
    { key: 'drive', label: 'Full kick', detail: 'Drive the leg back as far as you can, hips not rotating.',
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.drive },
    { key: 'squeeze', label: 'Top pause', detail: 'Squeeze your glute and pause for a second at the top.',
      anchor: { landmark: 'buttock', pose: 'end' }, claim: CL.c6 },
    // Q-W2-12: handlingMistake 'Swinging the leg' (c9, c8)
    { key: 'swing', label: 'Swinging the leg', detail: "If you can't move it without swinging, drop the weight.",
      anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.swing },
    { key: 'return', label: 'Slow return', detail: 'Return slowly.',
      anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.c6 },
  ],
  feel,
  zooms,
  chips: ['braced-back', 'feel'],   // the zoom shell's chip row; the same keys and order as the default
  copy: {
    setupLine: 'Cuff on your working ankle, pulley low. Hinge forward and hold the machine.',   // card c1, c2
    mistakeLine: "Don't let your lower back arch. Only your glute moves the leg.",   // card c7
    cueLine: 'Back flat, hips square.',   // card c8, c10
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/cable_kickback.json', rev: 1 },
};
