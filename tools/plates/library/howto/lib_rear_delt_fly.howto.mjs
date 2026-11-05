// LIB-SHIP W6: the How-to content of lib_rear_delt_fly (golden B's HowToContent shape, as
// tools/plates/layers/exercises/machine_chest_press.howto.mjs). Every shown string restates a claim of the verified card
// docs/research/howto/cards/rear_delt_fly.json; its claim ids are named on each field's claim.
// No hand zoom (D-SHIP-HANDW6, #393 6647923934): the card's hand zoom `rdf-grip` (c10, c3; Wrong null) has no pair key
// that draws this machine's handles, and the card gives no pose numbers (ruling 8); the id is on
// tools/plates/library/hands/no-zoom.json. Its claims (neutral grip, palms facing; overhand also fine; c10, c3) live in
// handling.gripLine and limitText and setup step 4.
// GRIP (Q-W6-3, D-SHIP-W6-CONV): the card's grip.thumb, grip.handContact and grip.wrist read "Not given by any source
// read (pull archetype default)". The thumb is DERIVED from golden B's pull default (lat_pulldown and seated_cable_row
// handling: thumb wrapped) and the contact and wrist range from the pull key's convention pairs.mjs
// CONVENTIONS['ga:pull-base'], all cited CONVENTION (cable_fly form), data only, never printed (D-SHIP-CONVCOPY).
// Zooms: `rdf-elbows` is a drawing value (DV, below). `rdf-chestpad` is a text checkpoint (D-SHIP-TEXTZOOM, the
// front-view precedent): the chest leaving the pad moves only in depth, which the card's front plate does not show
// (card plate.viewWhy); posture `chest`, the plate callout `Chest on pad` and mistake `momentum` carry it.
// Red flag: the card's redFlags (shoulder): the shared shoulder box, linked by the front-shoulder row.
// No variant line (equipment 'Machine').
import plateSpec from '../specs/rear_delt_fly.mjs';
import { landmarksOf } from '../engine.mjs';
import { RED_FLAG, RED_FLAG_SHOULDER } from '../../layers/howto/shared.mjs';
export { RED_FLAG, RED_FLAG_SHOULDER };

/* ---------------------------------------------------------------- sources (the card's sources, as the card has them) --
 * `use` is the evidence label for this sheet's use of the source (the card's claim tags). */
export const SOURCES = {
  'fv-rev-pecdeck': { cite: 'Reverse Pec Deck Fly: Target Your Upper Back Muscles Effectively (Fitness Volt)', url: 'https://fitnessvolt.com/reverse-pec-deck-fly/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'mo-rear-delt': { cite: 'Machine Rear Delt (Reverse) Fly: Exercise Guide (Motra, formerly Train Fitness)', url: 'https://motra.com/exercises/machineRearDeltFly',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'sl-rev-fly': { cite: 'How to Do Reverse Machine Fly: Muscles Worked & Proper Form (StrengthLog)', url: 'https://www.strengthlog.com/reverse-machine-fly/',
    kind: 'coach', access: 'full', checked: '2026-10-22', use: 'CONSENSUS' },
  'schoenfeld-2013': { cite: 'Effect of hand position on EMG activity of the posterior shoulder musculature during a horizontal abduction exercise', url: 'https://pubmed.ncbi.nlm.nih.gov/23302754/',
    kind: 'peer-reviewed', access: 'abstract', checked: '2026-10-22', use: 'DATA' },
  // The pull key's own source for the hand contact and wrist range (the card delegates both to the archetype): a convention.
  'ga-pull-base': { cite: 'LIB-7 pull hand convention, pairs.mjs CONVENTIONS ga:pull-base: base of the fingers and top edge of the palm', url: 'tools/plates/library/hands/pairs.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  // golden B's pull archetype default for the thumb the card delegates: a convention.
  'pull-default': { cite: 'Golden B pull archetype default (lat_pulldown and seated_cable_row handling: thumb wrapped)', url: 'tools/plates/layers/exercises/lat_pulldown.howto.mjs',
    kind: 'secondary', access: 'full', checked: '2026-11-05', use: 'CONVENTION' },
  'nhs-shoulder-pain': { cite: 'NHS, Shoulder pain', url: 'https://www.nhs.uk/conditions/shoulder-pain/',
    kind: 'guideline', access: 'full', checked: '2026-09-30', use: 'CONSENSUS', note: 'When shoulder pain needs a check.' },
};
// Not cited: acsm-2009 (c14 tempo, c16 load steps; plate only or no field here); c4, c15, c17, c18 (plate only).

const C = (tags, sources, note) => ({ tags, sources, ...(note ? { note } : {}) });
const FV = 'fv-rev-pecdeck', MO = 'mo-rear-delt', SL = 'sl-rev-fly', SCH = 'schoenfeld-2013';
const CL = {
  c1: C(['CONSENSUS'], [FV, MO], 'c1'),
  c2: C(['CONSENSUS'], [SL, FV], 'c2'),
  c3: C(['CONSENSUS'], [FV, MO], 'c3'),
  c5: C(['CONSENSUS'], [MO, FV], 'c5'),
  c6: C(['CONSENSUS'], [MO, FV], 'c6'),
  c7: C(['CONSENSUS'], [FV], 'c7'),
  c8: C(['CONSENSUS'], [MO, FV], 'c8'),
  c9: C(['CONSENSUS'], [MO], 'c9'),
  c13: C(['CONSENSUS'], [FV], 'c13'),
  c19: C(['CONSENSUS'], [FV], 'c19'),
  sit: C(['CONSENSUS'], [FV, MO], 'c1, c7'),
  grip: C(['DATA', 'CONSENSUS'], [SCH, FV, MO], 'c10, c3'),
  momentum: C(['CONSENSUS'], [MO, FV], 'c6, c8'),
};

/* ------------------------------------------------------------------------------------------------ hand ---------- */
// GRIP (Q-W6-3): the contact and wrist range DERIVED at import from the pull key's convention text, so they cannot
// drift from it. pairs.mjs:25 CONVENTIONS['ga:pull-base'] reads 'GA 3.1 pull: base of the fingers and top edge of the
// palm; extension 0 to 25'. HandContact names that zone 'finger-base' (src/howto/content-types.ts HandContact); a
// convention that names no mapped zone or range throws. pairs.mjs is not imported (its closure pulls howto-layers.mjs,
// which the MANIFEST closure cannot follow); the text is copied here and pinned against the live convention by a test.
const PULL_BASE = 'GA 3.1 pull: base of the fingers and top edge of the palm; extension 0 to 25';   // CONVENTIONS['ga:pull-base']
const CONTACT_OF_ZONE = { 'base of the fingers': 'finger-base' };   // convention zone words -> HandContact
const CONTACT = Object.entries(CONTACT_OF_ZONE).find(([zone]) => PULL_BASE.includes(zone))?.[1];
const EXT = PULL_BASE.match(/extension (\d+) to (\d+)/)?.slice(1).map(Number);
// The thumb DERIVED from golden B's pull rows (lat_pulldown.howto.mjs:174, seated_cable_row.howto.mjs:174: thumb.mode
// 'wrapped'), copied and pinned against the live files by a test; the two must agree, or this throws.
const PULL_THUMBS = { lat_pulldown: 'wrapped', seated_cable_row: 'wrapped' };
const THUMB = new Set(Object.values(PULL_THUMBS)).size === 1 ? Object.values(PULL_THUMBS)[0] : undefined;
if (!CONTACT || !EXT || !THUMB) throw new Error(`lib_rear_delt_fly: no mapped pull contact, range or one pull thumb default: ${PULL_BASE}`);
const CONV_THUMB = C(['CONVENTION'], ['pull-default'], 'card grip.thumb: the pull archetype default, no exercise-specific source; golden B\'s pull default, not a card claim, never shown');
// limitText is the card's own words (c3: an overhand grip is also used); the ext range is the convention, never shown.
const WRIST = C(['CONSENSUS', 'CONVENTION'], [FV, MO, 'ga-pull-base'], 'c3; card grip.wrist is the pull archetype default: the ext range is pairs.mjs CONVENTIONS ga:pull-base, not a card number');

/* --------------------------------------------------------------------------------------- posture stills --------- */
// 'bent' (card zoom `rdf-elbows` Wrong, c3: "Elbows bent sharply as the arms open"): the spec's end pose with each grip
// target pulled in toward its shoulder to BENT_REACH of the end's shoulder-to-grip distance, so only the elbow bend
// changes (the handles follow the grips, as the spec's deckOf draws them). At 0.8 the right elbow's inside angle is
// about 104 deg against the end's 160 deg, and the grip moves about 19 px in on the plate (landmarksOf, REF_CAMERA).
// DRAWING VALUES (D-SHIP-DRAWVAL, #376 6614695581; precedent D-LIB7-2 and golden B's machine_chest_press seatDrop):
// BENT_REACH 0.8 is a Wrong-pose size no card gives; no number from it appears in user copy; the layers panel judges it.
const H = 1.75, BENT_REACH = 0.8, END = plateSpec.poses.end;
const bent = (() => {
  const L = landmarksOf(END, H), reach = {};
  for (const s of ['l', 'r']) {
    const sh = L[`shoulder.${s}`], at = END.reach[s].at.map((v, i) => sh[i] + (v - sh[i]) * BENT_REACH);
    reach[s] = { ...END.reach[s], at };
  }
  return { reach };
})();
export const stills = {
  start: { pose: plateSpec.poses.start },
  end: { pose: END },
  bent: { pose: { ...END, ...bent } },
};

/* ------------------------------------------------------------------------------------------------ zooms --------- */
// One per card zoom except the hand zoom `rdf-grip` (D-SHIP-HANDW6) and `rdf-chestpad` (D-SHIP-TEXTZOOM, header).
// Zoom shell form (render/closeup/crop.mjs): callouts anchored at the landmark they name, no guide mark; the Wrong is
// drawn alone (solid).
const zooms = [
  {
    key: 'rdf-elbows', chip: 'Elbows', heading: 'Elbow bend', kind: 'posture',   // card zoom key: rdf-elbows
    crop: { center: { at: 'elbow.l', pose: 'right', off: [10, 0] }, sizePx: 170 },
    right: 'end',
    wrong: { base: 'end', pose: bent, solid: true },
    callout: {
      right: { text: 'Fixed bend', anchor: 'elbow.l' },
      wrong: { text: 'Bent sharply', anchor: 'elbow.l' },
    },
    caption: {
      right: 'Slight, fixed elbow bend as the arms open.',
      wrong: 'Elbows bent sharply as the arms open.',
    },
    alt: {
      right: 'Front view, end of the pull. The arms are out to the sides at shoulder height, elbows slightly bent.',
      wrong: 'Front view. The elbows bend sharply and the hands come in toward the shoulders.',
    },
  },
];

/* ------------------------------------------------------------------------------------------------ feel ---------- */
const feel = {
  primary: [{ muscleId: 'rear_delts', plain: 'The rear delts, at the backs of the shoulders, do the work.' }],
  secondary: [
    { muscleId: 'mid_back', plain: 'The muscles between the shoulder blades help.' },
    { muscleId: 'rotator_cuff', plain: 'The rotator cuff also works.' },   // text only (C2 NO_REGION, card libraryDiff)
  ],
  watch: [{ muscleId: 'upper_traps', plain: 'Too heavy, and the traps take over.' }],
  // The card's first row (backs of the shoulders, c11) has no fix, so it is left off the rows (D-SHIP-Q16).
  feelLine: 'You should feel this in the backs of your shoulders.',
  rows: [
    { key: 'blades', where: 'Between the shoulder blades', at: { muscles: ['mid_back'] },
      means: 'Other upper-back muscles are doing more than the rear delts.',
      fix: 'Shorten the range. Stop at the shoulder line.',
      claim: CL.c5 },
    { key: 'shoulder', where: 'Sharp pain, front of the shoulder', at: {},   // pain, not a muscle taking over: no map mark (golden B lat_pulldown)
      means: '',   // the card's row has no means; D-FEEL-NOMEANS prints no label
      fix: "Stop the set. Don't train through the pain.",
      redFlag: 'shoulder', claim: CL.c9 },
  ],
  libraryDiff: { add: ['rotator_cuff'], why: 'card libraryDiff: infraspinatus activity was measured on this machine (c10, DATA; text-only).' },
  claim: C(['DATA', 'CONSENSUS'], [SCH, FV, MO], 'c11 (primary), c12, c10 (secondary), c8 (watch)'),
};

/* ---------------------------------------------------------------- handling mistakes, risks (card handlingMistakes, risks) */
const MISTAKES = [
  { key: 'rush', title: 'Rushing the reps', claim: CL.c19,
    fix: 'Slow down your rep tempo.' },
  { key: 'momentum', title: 'Momentum, chest off the pad', claim: CL.momentum,
    fix: 'Lower the weight and keep your chest on the pad.' },
  { key: 'heavy', title: 'Too heavy, traps take over', claim: CL.c8,
    fix: 'Lower the weight.' },
];
const RISKS = [
  { key: 'shoulder', text: 'Sharp pain at the front of the shoulder means stop.', claim: CL.c9 },
  { key: 'heavy', text: 'Going too heavy lets the traps take over.', claim: CL.c8 },
];

export default {
  schema: 1,
  id: 'lib_rear_delt_fly',
  rev: 1,
  plate: plateSpec,
  handling: {
    archetype: 'pull',
    why: 'D-SHIP-C3 no-zoom list, D-SHIP-HANDW6: no pair key draws this machine\'s handles and the card gives no pose numbers; the grip copy carries c3 and c10.',
    orientation: 'neutral',    // card grip.type: neutral preferred (c10, c3); the spec's handles
    handle: 'machine-grip',    // card grip.width: set by the machine handles
    width: { text: 'Set by the machine handles.', claim: CL.c2 },
    thumb: { mode: THUMB, claim: CONV_THUMB },   // CONVENTION: golden B's pull default, derived above
    contact: CONTACT,          // 'finger-base', DERIVED from pairs.mjs CONVENTIONS ga:pull-base (CONVENTION, above)
    wrist: { ext: EXT, limitText: 'An overhand grip also works.', claim: WRIST },   // ext [0, 25] DERIVED, data only
    faults: [],                // the card's hand zoom has no Wrong
    gripLine: 'Neutral grip, palms facing each other, elbows slightly bent.',   // c10, c3
    cue: 'Chest on the pad, soft elbows.',   // c6, c3
  },
  contacts: ['seat-back'],   // the card's archetype.contact
  setup: [
    { kind: 'adjust', text: "Set the machine's handles to the reverse-fly position.", claim: CL.c1 },
    { kind: 'adjust', text: 'Set the chest pad and handles so you grip at shoulder height.', claim: CL.c2 },
    // D-TEXT-GOLDEN: posture tall and neck (c7)
    { kind: 'position', text: 'Chest pressed on the pad. Sit tall, neck neutral, eyes ahead.', claim: CL.sit },
    { kind: 'grip', text: 'Take the handles with a neutral grip, elbows slightly bent.', claim: CL.grip },
    // D-TEXT-GOLDEN: posture stack (c13)
    { kind: 'load', text: "Don't let the weight stack rest between reps.", claim: CL.c13 },
  ],
  posture: [
    // D-SHIP-TEXTZOOM: the card zoom `rdf-chestpad` as a text checkpoint (header)
    { key: 'chest', label: 'Chest on pad', detail: 'Chest stays on the pad for every rep.', anchor: { at: 'chest', pose: 'end' }, claim: CL.c6 },
    { key: 'tall', label: 'Sit tall', detail: 'Sit tall, no hunching.', anchor: { at: 'backUpper', pose: 'start' }, claim: CL.c7 },
    { key: 'neck', label: 'Neck neutral', detail: 'Neck neutral, eyes straight ahead.', anchor: { at: 'head', pose: 'start' }, claim: CL.c7 },
    { key: 'elbows', label: 'Soft elbows', detail: 'Elbows keep a slight, fixed bend.',
      anchor: { at: 'elbow.l', pose: 'end' }, zoom: 'rdf-elbows', claim: CL.c3 },
    { key: 'line', label: 'Stop at shoulders', detail: 'Stop when the arms line up with the shoulders.', anchor: { at: 'grip.r', pose: 'end' }, claim: CL.c5 },
    { key: 'stack', label: 'Stack off rest', detail: "Don't let the stack rest between reps.", anchor: { at: 'grip.r', pose: 'start' }, claim: CL.c13 },
  ],
  feel,
  zooms,
  chips: ['rdf-elbows', 'feel'],   // the zoom shell's chip row: the zoom keys, then feel
  copy: {
    setupLine: 'Set the handles to reverse fly at shoulder height. Sit with your chest on the pad.',
    mistakeLine: 'Keep your chest on the pad. Lower the weight rather than swing it.',
    cueLine: 'Chest on the pad, soft elbows.',
  },
  redFlag: RED_FLAG,
  mistakes: MISTAKES,
  risks: RISKS,
  riskFlags: ['shoulder'],   // the card's redFlags
  sources: Object.keys(SOURCES),
  research: { card: 'docs/research/howto/cards/rear_delt_fly.json', rev: 1 },
};
