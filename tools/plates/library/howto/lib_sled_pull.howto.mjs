// LIB-SHIP W7: the How-to content of lib_sled_pull (backward drag, hand over hand), golden B's HowToContent shape
// (layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the research card
// docs/research/howto/cards/sled_pull.json (cited in its field's claim, cN = card claim id).
// No hand zoom (D-SHIP-C3, gap-key): the implement key lists sled_pull in GAPS (tools/plates/library/hands/
// hand-implement.mjs:7: the card hand zoom rope-grip has no Wrong, and no source places the thumb); the id is on
// tools/plates/library/hands/no-zoom.json. The hand zoom's Right (c1, c4) is the grip line.
// GRIP (Q-W3-4 form, as lib_chest_supported_row): the card gives no thumb or hand contact. Contact 'finger-base' and the
// wrist range ext [0, 25] are the pull key's convention pairs.mjs CONVENTIONS['ga:pull-base'] (hands/pairs.mjs:25), the
// thumb golden B's pull default (lat_pulldown and seated_cable_row handling: thumb wrapped); all cited CONVENTION,
// data only, never printed. The card's own wrist claim (c4, wrists firm) is the grip grey line (limitText) and posture[elbows].
// Feel (D-SHIP-Q7): the card's secondary `core` is text only (feel.textOnly), as lib_plank. Back box: card redFlags
// ['back'], linked by the low-back row.
// No variant line (equipment 'Sled').
//
// D-TEXT-GOLDEN claim -> slot:
//   posture c2 shoulders over hips      -> posture stack (zoom torso-stack)
//   posture c2 knees soft, quarter squat-> posture squat, setup step 3
//   posture c6 chin level, eyes forward -> posture head
//   posture c4 elbows tucked, wrists firm -> posture elbows, handling.wrist.limitText (grip grey line)
//   handlingMistake leaning back c8, c2, c9 -> mistakes[lean] (zoom torso-stack), feel row low-back, risks[lean]
//   handlingMistake yanking c6          -> mistakes[yank]
//   handlingMistake rope piled c5       -> mistakes[pile], setup step 5, risks[slack]
//   hand zoom rope-grip Right c1, c4    -> gripLine (c1), wrist.limitText (c4), setup step 1
// D-TEXT-PRINTED (W7, #394): posture c6 chin level, eyes forward -> setup step 2.
// Left off (D-TEXT-PROGRESSION): c14 (starting load), c9's lighter loads and shorter distances as progression.
import plateSpec from '../specs/sled_pull.mjs';
import { RED_FLAG } from '../../layers/howto/shared.mjs';
export { RED_FLAG };

/* ---------------------------------------------------------------- sources (the card's sources) ------------------- */
export const SOURCES = {
  'gs-sled': { cite: 'Sled Pull Guide: How To Improve Your Technique, Training & Full-Body Strength | Gymshark Central', url: 'https://row.gymshark.com/blog/article/how-to-sled-pull',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'west-2014': { cite: 'The metabolic, hormonal, biochemical, and neuromuscular function responses to a backward sled drag training session', url: 'https://pubmed.ncbi.nlm.nih.gov/23575361/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The pull key's convention for the contact and wrist range the card leaves unsourced (Q-W3-4): a convention.
  'ga-pull-base': { cite: 'LIB-7 pull hand convention, pairs.mjs CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // golden B's pull archetype default for the thumb the card leaves unsourced: a convention.
  'pull-default': { cite: 'Golden B pull archetype default (lat_pulldown and seated_cable_row handling: thumb wrapped)', url: 'tools/plates/layers/exercises/seated_cable_row.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-04', use: 'CONVENTION' },
  // The back box's own source (shared/back-box.mjs boxClaim), as lib_plank lists it: the card's redFlags 'back'.
  'nhs-back': { cite: 'NHS, Back pain', url: 'https://www.nhs.uk/conditions/back-pain/',
    kind: 'guideline', access: 'full', checked: '2026-10-02', use: 'CONSENSUS', note: 'When back pain needs a check.' },
};

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const CL = {
  c1: C(['CONSENSUS'], ['gs-sled'], 'card c1'),
  c2: C(['CONSENSUS'], ['gs-sled'], 'card c2'),
  c3: C(['CONSENSUS'], ['gs-sled'], 'card c3'),
  c4: C(['CONSENSUS'], ['gs-sled'], 'card c4'),
  c5: C(['CONSENSUS'], ['gs-sled'], 'card c5'),
  c6: C(['CONSENSUS'], ['gs-sled'], 'card c6'),
  c7: C(['CONSENSUS'], ['gs-sled'], 'card c7'),
  c8: C(['CONSENSUS'], ['gs-sled'], 'card c8'),
  c9: C(['CONSENSUS'], ['gs-sled'], 'card c9'),
  c10: C(['CONSENSUS'], ['gs-sled'], 'card c10'),
  c11: C(['CONSENSUS','WEAK'], ['gs-sled'], 'card c11'),
  c12: C(['DATA'], ['west-2014'], 'card c12'),
  c13: C(['CONSENSUS'], ['gs-sled'], 'card c13'),
  c14: C(['CONSENSUS'], ['gs-sled'], 'card c14'),
};
const J = (...ids) => C([...new Set(ids.flatMap(i => CL[i].tags))], [...new Set(ids.flatMap(i => CL[i].sources))], `card ${ids.join(', ')}`);

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP, Q-W3-4 (as lib_chest_supported_row): the contact and wrist range DERIVED from the pull key's convention text,
// copied (pairs.mjs is not importable here: its closure pulls howto-layers.mjs). A convention naming no mapped zone or
// no range throws.
const PULL_BASE = 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25';   // CONVENTIONS['ga:pull-base']
const CONTACT_OF_ZONE = { 'base of the fingers': 'finger-base' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PULL_BASE.includes(zone))?.[1];
const EXT = PULL_BASE.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
const PULL_THUMBS = { lat_pulldown: 'wrapped', seated_cable_row: 'wrapped' };   // golden B pull rows' thumb.mode
const THUMB = new Set(Object.values(PULL_THUMBS)).size === 1 ? Object.values(PULL_THUMBS)[0] : undefined;
if (!CONTACT || !EXT || !THUMB) throw new Error(`lib_sled_pull: no mapped pull contact, range or one pull thumb default: ${PULL_BASE}`);
const CONV_THUMB = C(['CONVENTION'], ['pull-default'], 'card grip.thumb is empty: golden B\'s pull default, not a card claim, never shown');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// From the plate spec's own poses: `pitched` (card zoom torso-stack Wrong, c8) is the spec's Mistake (the torso pitched
// back, the shoulders behind the hips; the rope keeps the end's lay). No new geometry, so no drawing values.
const END = plateSpec.poses.end, MIS = plateSpec.mistake.pose;
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  pitched: { pose: { ...END, ...MIS } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// The card posture zoom in the zoom shell's shape (pilot-a.closeups.mjs), the Wrong drawn alone (solid). The card hand
// zoom rope-grip is not drawn (D-SHIP-C3 gap-key, header).
const zooms = [
  {
    key: 'torso-stack', chip: 'Torso', heading: 'Torso stack', kind: 'posture',
    crop: { center: { at: 'hip.r', pose: 'right', off: [-10, -35] }, sizePx: 240 },
    right: 'end',
    wrong: { base: 'end', pose: MIS, solid: true },
    callout: {
      right: { text: 'Over hips', anchor: 'shoulder.r' },
      wrong: { text: 'Pitched back', anchor: { at: 'backUpper', pose: 'mistake' } },
    },
    caption: {
      right: 'Shoulders over hips in a quarter squat.',
      wrong: 'Torso pitched back, lower back loaded.',
    },
    alt: {
      right: 'Side view, stepping back. Shoulders stack over the hips, knees soft in a quarter squat.',
      wrong: 'Side view. The torso pitches back behind the hips, so the lower back takes the load.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [
    { muscleId: 'quads', plain: 'The drag lights up the front of the thighs.', claim: CL.c7 },
    { muscleId: 'glutes', plain: 'The drag lights up the glutes.', claim: CL.c7 },
  ],
  secondary: [
    { muscleId: 'calves', plain: 'The calves help drive each step.', claim: J('c7', 'c3') },
    { muscleId: 'mid_back', plain: 'The back works to steady you.', claim: CL.c7 },
  ],
  textOnly: [   // named in the text, never painted (D-SHIP-Q7, as lib_plank)
    { muscleId: 'core', plain: 'The trunk stays braced so the torso stays tall.', claim: CL.c8 },
  ],
  watch: [],
  feelLine: 'You should feel this in the front of your thighs and your glutes.',
  rows: [
    // The card's first two rows (front of the thighs; glutes) have no fix, so they are left out: the feel line says them.
    { key: 'low-back', where: 'Lower back', at: { muscles: ['lower_back'] },
      means: 'Torso pitched back, lower back taking the load.',
      fix: 'Brace, keep shoulders over hips, and use a lighter sled.',
      redFlag: 'back', claim: J('c8', 'c2', 'c9') },
  ],
  claim: J('c7', 'c8'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'lean', title: 'Leaning back', zoom: 'torso-stack', claim: J('c8', 'c2', 'c9'),
    fix: 'Keep your torso braced, shoulders over hips. Go lighter.' },
  { key: 'yank', title: 'Yanking with the arms', claim: CL.c6,
    fix: 'Lead with your legs.' },
  { key: 'pile', title: 'Rope piled at your feet', claim: CL.c5,
    fix: 'Flick or step it aside between steps.' },
];
const RISKS = [
  { key: 'lean', text: 'Leaning back puts the load on your lower back.', claim: CL.c8 },
  { key: 'slack', text: 'Slack rope at your feet can trip you.', claim: J('c5', 'c9') },
  { key: 'round', text: 'A rounded back can strain your lower spine.', claim: CL.c11 },
];

export default {
  schema: 1,
  id: 'lib_sled_pull',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list (gap-key hand-implement.mjs:7): the rope-grip zoom has no Wrong; the grip copy carries c1 and c4.',
    handle: 'rope',            // c1: the sled rope, both hands
    width: { text: 'Hands together on the rope, one over the other.', claim: CL.c1 },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION (Q-W3-4): golden B's pull default, derived above
    contact: CONTACT,          // 'finger-base', DERIVED from pairs.mjs CONVENTIONS ga:pull-base (CONVENTION, above)
    // card grip.wrist (c4): wrists firm. The range is the pull convention (data only, never printed).
    wrist: { ext: EXT, limitText: 'Keep your wrists firm and your elbows tucked.',
      claim: C(['CONSENSUS'], ['gs-sled'], 'card c4. The ext range is pairs.mjs CONVENTIONS ga:pull-base, a convention, not a card number.') },
    faults: [],                // the card hand zoom has no Wrong
    // card zoom rope-grip Right (c1, c4): the wrists are the grey line under it (wrist.limitText), so the lead does not
    // repeat them (W2 panel form, as lib_dumbbell_bench_press).
    gripLine: 'Both hands on the rope, one over the other.',
    cue: 'Shoulders over hips.',   // c2
  },
  contacts: ['standing-feet'],
  setup: [
    { kind: 'grip', text: 'Face the sled, rope in both hands, one hand over the other.', claim: CL.c1 },
    { kind: 'position', text: 'Step back for light tension in the rope. Chin level, eyes forward.', claim: J('c1', 'c6') },
    { kind: 'brace', text: 'Feet shoulder-width, sink into a quarter squat, chest up, trunk braced.', claim: CL.c2 },
    { kind: 'position', text: 'Step back one foot at a time, short and quick.', claim: CL.c3 },
    { kind: 'position', text: 'Feed the rope through your hands. Flick the piled rope aside.', claim: J('c4', 'c5') },
  ],
  posture: [
    { key: 'stack', label: 'Shoulders over hips', detail: 'Shoulders over hips, not leaning far back.',
      anchor: { landmark: 'shoulder.r', pose: 'end' }, zoom: 'torso-stack', claim: CL.c2 },
    { key: 'squat', label: 'Quarter squat', detail: 'Knees soft, quarter squat.', anchor: { landmark: 'knee.r', pose: 'end' }, claim: CL.c2 },
    { key: 'head', label: 'Head level', detail: 'Chin level, eyes forward.', anchor: { landmark: 'head', pose: 'end' }, claim: CL.c6 },
    { key: 'elbows', label: 'Elbows tucked', detail: 'Elbows tucked, wrists firm.', anchor: { landmark: 'elbow.r', pose: 'end' }, claim: CL.c4 },
  ],
  feel,
  zooms,
  chips: ['torso-stack', 'feel'],
  copy: {
    setupLine: 'Face the sled, rope in both hands. Quarter squat, chest up, shoulders over hips.',
    mistakeLine: "Don't lean back so your lower back takes the load. Stay braced.",
    cueLine: 'Shoulders over hips.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['back'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/sled_pull.json', rev: 1 },
};
