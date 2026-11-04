// LIB-SHIP W2: the How-to content of lib_seated_leg_curl (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/seated_leg_curl.json; its claim ids are named on each field's claim.
// Handling (D-SHIP-GRIP case (b)): the card's grip.thumb, grip.handContact and grip.wrist are all empty (hand archetype
// balance: the hands steady the body), so there is no hand claim to draw or write: NoHandling, and no hand zoom (the
// card has none). The card's grip.type and grip.width (c5) are posture checkpoint `grip` and setup step 5.
// Zooms: none. Both card zooms are text checkpoints (D-SHIP-Q14 precedent, as pec_fly's fly-backpad):
//   knee-pivot (c1): the card's wrong is null (LR-25: no direction for the fault), so there is no Wrong to draw;
//                    posture checkpoint `pivot`.
//   ankle-pad (c3):  its Wrong (pad high on the calves) is an equipment change, not a pose: the spec places the pad at
//                    ANKLE_T of the shank in every pose (specs/seated_leg_curl.mjs anklePadOf), and the crop engine
//                    draws only pose changes; posture checkpoint `ankle-pad`, setup step 3. Not crop.mjs shiftEq
//                    (#379 6627240712): it moves only non-function items, by dy, and the pad is perItem functions
//                    (eq/parts.mjs:35) placed along the shank.
// No variant line (equipment 'Machine').
import plateSpec from '../specs/seated_leg_curl.mjs';
import { RED_FLAG, RED_FLAG_KNEE } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_KNEE };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'sl-slc': { cite: 'How to Do Seated Leg Curl: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/seated-leg-curl/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'bb-legcurl': { cite: 'Master the Leg Curl for Stronger Hamstrings and Heavier Deadlifts (BarBend)', url: 'https://barbend.com/leg-curls/',
    kind: 'coach', access: 'full', checked: '2026-10-02', use: 'CONSENSUS' },
  'maeo-2021': { cite: 'Greater Hamstrings Muscle Hypertrophy but Similar Damage Protection after Training at Long versus Short Muscle Lengths.', url: 'https://pubmed.ncbi.nlm.nih.gov/33009197/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-02', use: 'DATA' },
  // RED_FLAG_KNEE's own source (layers/howto/shared.mjs), as golden B's leg_press lists it: the card's redFlags 'knee'.
  'nhs-knee-pain': { cite: 'NHS, Knee pain', url: 'https://www.nhs.uk/symptoms/knee-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When knee pain needs a check.' },
};
// Not cited: acsm-2009 (c14, load progression; the card's five setup steps fill the setup cap, no field restates it).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const SL = 'sl-slc', BB = 'bb-legcurl';
const CL = {
  c1: C(['CONSENSUS'], [SL], 'c1'),
  c2: C(['CONSENSUS'], [BB], 'c2'),
  c3: C(['CONSENSUS'], [BB], 'c3'),
  c4: C(['CONSENSUS'], [SL], 'c4'),
  c5: C(['CONSENSUS'], [BB], 'c5'),
  c6: C(['CONSENSUS'], [SL], 'c6'),
  c7: C(['CONSENSUS'], [BB, SL], 'c7'),
  c8: C(['CONSENSUS'], [SL], 'c8'),
  c10: C(['CONSENSUS'], [BB], 'c10'),
  c12: C(['CONSENSUS'], [SL], 'c12'),
  pivot: C(['CONSENSUS'], [SL], 'c1, c9'),
};

/* --------------------------------------------------------------------------------------- posture stills --------- */
// No zoom crops; the stills are the plate spec's own poses.
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: plateSpec.poses.end },
};

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'hamstrings', plain: 'The hamstrings, at the back of the thighs, do the work.' }],
  secondary: [{ muscleId: 'calves', plain: 'The calves may try to help on heavy sets.' }],
  watch: [],
  feelLine: 'You should feel this in the back of your thighs.',
  rows: [
    // The card's first row (back of the thighs) has no fix, so it is left out: the feel line says it (D-SHIP-Q16).
    { key: 'calves', where: 'Calves, cramping', at: { muscles: ['calves'] },
      means: 'Your calves are trying to help.',
      fix: 'Lower the weight, or point your toes.',
      claim: CL.c10 },
    { key: 'knee', where: 'Knee', at: { parts: ['knee-left', 'knee-right'] },
      means: 'Knees may be out of line with the pivot.',
      fix: 'Stop and reset the seat so your knees line up.',
      redFlag: 'knee', claim: CL.pivot },
  ],
  claim: C(['CONSENSUS', 'DATA'], [SL, 'maeo-2021'], 'c12 (primary), c11; c10 is the calves secondary'),
};

/* ---------------------------------------------------------------- risks (card risks; handlingMistakes are posture, Q-W2-12) */
const RISKS = [
  { key: 'pivot', text: 'Knees out of line with the pivot can hurt.', claim: CL.c1 },
  { key: 'swing', text: 'Too much weight turns the curl into a swing.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_seated_leg_curl',
  rev: 1,
  plate: plateSpec,
  handling: { archetype: 'none', why: 'D-SHIP-GRIP: the card gives no thumb, contact or wrist claim.' },
  contacts: ['seat-back', 'pivot-pad'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: 'Set the seat so your knees line up with the pivot.', claim: CL.c1 },
    // card setup steps 2 and 3 in one, so c6's range cue fits the five-step cap (W2 panel: it was only posture text)
    { kind: 'adjust', text: 'Thigh pad snug above your knees, ankle pad just above your shoes.', claim: C(['CONSENSUS'], [BB], 'c2, c3') },
    { kind: 'position', text: 'Back flat against the back pad.', claim: CL.c4 },
    { kind: 'grip', text: 'Grip the handles and press your hips into the seat.', claim: CL.c5 },
    { kind: 'position', text: 'Brace your trunk. Curl as far as you can, slow and controlled.', claim: CL.c6 },
  ],
  posture: [
    // D-SHIP-Q14: the card zoom knee-pivot as a text checkpoint (its wrong is null, LR-25)
    // Q-W2-12: handlingMistake 'Machine not adjusted' (c1, c9) merged here, its fix added
    { key: 'pivot', label: 'Knees at pivot', detail: 'Knees stay in line with the pivot. Set the seat and leg pad.',
      anchor: { landmark: 'knee.r', pose: 'start' }, claim: CL.pivot },
    // D-SHIP-Q14: the card zoom ankle-pad as a text checkpoint (its Wrong moves the pad, which the crop cannot draw)
    { key: 'ankle-pad', label: 'Pad above shoes', detail: 'Ankle pad just above the shoes, never high on the calves.',
      anchor: { landmark: 'ankle.r', pose: 'start' }, claim: CL.c3 },
    { key: 'hips', label: 'Hips down', detail: 'Hips stay down in the seat.', anchor: { landmark: 'seat', pose: 'end' }, claim: CL.c5 },
    { key: 'grip', label: 'Hands on handles', detail: 'Hands on the side handles, squeezed.', anchor: { landmark: 'grip.r', pose: 'start' }, claim: CL.c5 },
    { key: 'curl', label: 'Full curl', detail: 'Curl as far as you can, slow and controlled.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c6 },
    { key: 'breathe', label: 'Breathe out', detail: 'Breathe out as you curl.', anchor: { landmark: 'chest', pose: 'end' }, claim: CL.c5 },
    // Q-W2-12: handlingMistakes 'Pushing with your calves' (c10) and 'Swinging a weight that's too heavy' (c8)
    { key: 'calves', label: 'Pushing with calves', detail: 'Point your toes, or lower the weight.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c10 },
    { key: 'swing', label: 'Swinging heavy weight', detail: 'Lower the weight. Keep it slow.', anchor: { landmark: 'ankle.r', pose: 'end' }, claim: CL.c8 },
    { key: 'return', label: 'Slow return', detail: "Straighten slowly. Don't let the weights clang.", anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c7 },
  ],
  feel,
  zooms: [],
  copy: {
    setupLine: 'Set the seat so your knees line up with the pivot. Thigh pad snug just above your knees.',
    mistakeLine: "Point your toes, don't push with your calves. If they cramp, lower the weight.",
    cueLine: 'Knees in line with the pivot.',
  },
  redFlag: RED_FLAG,
  mistakes: [],   // Q-W2-12 (#379 6628699724): the card's handlingMistakes are posture checkpoints above
  risks: RISKS,
  riskFlags: ['knee'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/seated_leg_curl.json', rev: 1 },
};
