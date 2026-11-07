// LIB-5 (D-LIB5-FAMILY, D-LIB5-FAULTKEYS 4): family consistency. Rule (a) is one label per fault.key. A row that
// declares inheritance goes through LIB-9's comparator (D-LIB5-FAMILY 6, D-LIB9a-MAP), which stays fail-closed. The reader
// collects faults from three sources: the 8's handling.faults, the shared modules' faults and every
// tools/plates/library/hands/hand-*.mjs VARIANTS[*].faults (an object keyed by fault key, LIB-7's shape).
import { existsSync, readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const HANDS_DIR = 'tools/plates/library/hands';
const v = (out, path, rule, detail = '') => out.push({ path, rule, detail });

const UNRULED = (id, field) => `${id}: family: ${field}: inherited-string map not ruled (D-LIB5-FAMILY)`;

/** D-LIB9a-MAP (#245 6393424755): each LB1 child's inherit[] field, exactly as its card names it, to the paths of the
 *  parent's shipped How-to content that must match. A field missing here is unmapped and refused; shoulder_press's
 *  setup['Pick the weight…'] left inherit[] in F-LB1-SETUP (#318): machine_chest_press ships no such line. */
const THUMB = ['handling.thumb.mode', 'handling.pose.thumb'];
// LIB-SHIP W3 amendments (SHIP W3 PLAN RULED Q-W3-1/Q-W3-2; layers fix rounds #384 6648454032, 6649416891, 6653062201,
// accepted with reds in this table): a child keeps the parent's leaves except the ones its own card or a panel fix
// changed. TXT: a posture checkpoint's label, detail and anchor; PAD: the parent's knee-pad zoom leaves; HANDLING: the
// parent's handling leaves; WRIST: the parent's wrist range (the child's own limitText).
const TXT = k => [`posture[key=${k}].label`, `posture[key=${k}].detail`, `posture[key=${k}].anchor`];
const PAD = ['key', 'chip', 'heading', 'kind', 'crop', 'right', 'wrong', 'guides', 'callout', 'caption', 'alt'].map(k => `zooms[key=pad].${k}`);
const HANDLING = ['archetype', 'handle', 'loadAxis', 'width', 'thumb', 'contact', 'wrist', 'pose', 'faults', 'gripLine', 'cue'].map(k => `handling.${k}`);
const WRIST = ['handling.wrist.ext', 'handling.wrist.dev'];
// LIB-SHIP W4 D-SHIP-FAMILY W4 (SHIP W4 PLAN RULED, #391 6647760116): the W4 path lists.
const THUMB_NOPOSE = ['handling.thumb.mode'];                 // D-SHIP-W4-THUMB: only where the parent has no handling.pose
const BENCH_ZOOM = ['handling.thumb.mode', 'handling.contact', 'handling.wrist', 'handling.faults[key=bent-back]'];   // D-SHIP-W4-GAPZOOM
const SEAT_PAD = ['key', 'kind', 'chip', 'heading', 'callout.right.text', 'callout.wrong.text', 'caption.right', 'caption.wrong'].map(l => `zooms[key=seat-back-contact].${l}`);   // D-SHIP-W4-PADZOOM (SEAT_PAD: renamed from W4's PAD at the W3 merge, since W3's PAD names the knee-pad zoom)
const ROW = ['label', 'detail', 'anchor'];

export const INHERIT_MAP = {
  // W3 (Q-W3-1): the hand zoom's own leaves differ (underhand pair, card c1/c3); the inherited claim is the wrapped thumb
  lib_chin_up: { 'grip.thumb (wrapped, never thumbless by default)': THUMB, 'zooms.hand (full grip, thumb around the bar, is the only grip shown)': ['zooms[key=hand].hand.right.thumb'] },
  // W3 (#384 6648733957, 6653343780): the pad halves' caption and alt are the child's own (a V-handle; no hips-lifting claim)
  lib_close_grip_pulldown: { 'zooms: seat height / thigh pad crop': PAD.filter(p => !p.endsWith('.alt') && !p.endsWith('.caption')) },
  lib_hanging_knee_raise: { 'grip.thumb (wrapped every set)': THUMB },
  // incline_machine_press and shoulder_press are staged off W3 (D-SHIP-W3-NOPAIR, #384 6681221802): their entries stay as
  // ruled for D-LIB9a-MAP; the W3-ruled amendments (grip.wrist: WRIST; shoulder_press zooms['hand'] minus feelRow) land
  // with the wave that ships them, since the family check runs only on shipped rows.
  lib_incline_machine_press: { 'grip.type': ['handling.handle'], 'grip.thumb': THUMB, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'],
    "posture['Straight wrist, forearm behind the handle']": ['posture[key=wrist]'], "posture['Feet flat, hips back']": ['posture[key=feet]'], "zooms['hand']": ['zooms[key=hand]'] },
  lib_shoulder_press: { 'grip.thumb': THUMB, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'], "zooms['hand']": ['zooms[key=hand]'] },
  // D-SHIP-FAMILY (LIB-SHIP W2, #379 6625803515): the dumbbell child of romanian_deadlift, parent first in the same head. Neither RDL ships in W2: both ship through #385.
  lib_single_leg_romanian_deadlift: { 'grip.thumb': THUMB, 'grip.wrist': ['handling.wrist'] },
  // W3 (#384 6648454032 L2, accepted 6648753200): the card's own setup steps replace the inherited lean (upright torso, c7,
  // c11), so the field maps to no path
  lib_single_arm_lat_pulldown: { 'setup: lean back only slightly (about 30 degrees at most), no extra lean during the pull': [] },
  lib_underhand_lat_pulldown: { 'posture: bar comes down in front of the face, never behind the head': ['posture[key=path]'], 'zooms: seat height / thigh pad crop': ['zooms[key=pad]'] },
  // W3 (Q-W3-1/Q-W3-9; #384 6649416891): the grip line is c2 only and the wrist note is dropped; checkpoints keep the
  // parent's label/detail/anchor (the soft-knee anchor is the child's own pose)
  lib_horizontal_leg_press: { grip: [...HANDLING.filter(p => p !== 'handling.gripLine' && p !== 'handling.wrist'), ...WRIST],
    "posture['Tailbone and lower back flat on the pad']": TXT('back'), "posture['Whole foot flat, mid-platform']": TXT('feet'),
    "posture['Soft knees at the top']": ['posture[key=soft].label', 'posture[key=soft].detail'], "posture['Hands light on the side handles']": TXT('hands') },
  lib_leg_press_calf_raise: { grip: ['handling'], "setup['After the last rep, pause at the top, turn the handles back in, and let the sled settle on the catches before you take your feet off or let go.']": ['setup[kind=finish]'],
    "posture['Hands light on the side handles']": ['posture[key=hands]'] },
  // LIB-SHIP W4: every entry from here to the end is D-SHIP-FAMILY W4 (SHIP W4 PLAN RULED, #391 6647760116), each child
  // against its card parent.
  lib_arnold_press: { 'grip.thumb': THUMB_NOPOSE, 'grip.wrist': ['handling.wrist'], 'setup.spotter': ['setup[kind=safety]'], 'zooms.seat-back-contact': SEAT_PAD },
  lib_close_grip_bench_press: { 'grip.thumb': THUMB_NOPOSE, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'],
    'setup.safety-pins': ['setup[kind=safety]'], 'setup.spotter': ['setup[kind=get-in]'], 'zooms.bar-low-palm': BENCH_ZOOM },
  lib_decline_bench_press: { 'grip.thumb': THUMB_NOPOSE, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'], 'zooms.bar-low-palm': BENCH_ZOOM },
  lib_incline_barbell_bench_press: { 'grip.thumb': THUMB_NOPOSE, 'grip.handContact': ['handling.contact'],
    'zooms.bar-low-palm': ['handling.thumb.mode', 'handling.contact', 'handling.wrist.ext', 'handling.faults[key=bent-back]'], 'setup.safety-pins': ['setup[kind=safety]'] },
  lib_incline_dumbbell_press: { 'grip.thumb': THUMB_NOPOSE, 'grip.wrist': ['handling.wrist'], 'zooms.wrist-neutral-press': ['handling.thumb.mode', 'handling.wrist', 'handling.faults[key=bent-back]'] },
  lib_smith_machine_bench_press: { 'grip.thumb': THUMB_NOPOSE, 'grip.type': ['handling.orientation'], 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'], 'zooms.bar-low-palm': BENCH_ZOOM },
  // cable_shrug grip.wrist / grip.width and dumbbell_shrug grip.wrist (D-SHIP-W4-ROUTE): dropped from the cards by F-W4-INHERIT (e00a7036)
  lib_cable_shrug: { 'grip.thumb': THUMB_NOPOSE, 'risks[breath]': ['risks[key=breath]'], redFlags: ['riskFlags'], 'grip.type': ['handling.orientation'] },
  lib_dumbbell_shrug: { 'grip.thumb': THUMB_NOPOSE, 'risks[breath]': ['risks[key=breath]'], redFlags: ['riskFlags'] },
  lib_smith_machine_shrug: { 'grip.thumb': THUMB_NOPOSE, 'grip.handContact': ['handling.contact'], 'zooms.shrug-grip': ['handling.thumb.mode', 'handling.faults[key=thumbless]'] },
  lib_conventional_deadlift: { 'grip.thumb': THUMB, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'], 'archetype.contact': ['contacts'] },
  lib_dumbbell_romanian_deadlift: { 'grip.wrist': ['handling.wrist'], 'posture: knees fixed at a slight bend, movement at the hips (parent c4)': ROW.map(l => `posture[key=knees].${l}`) },
  // sumo plate.equipment (D-SHIP-W4-ROUTE, Q-W4-9): dropped from the card by F-W4-INHERIT (e00a7036)
  lib_sumo_deadlift: { 'grip.thumb': THUMB, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'], 'archetype.contact': ['contacts'] },
  lib_landmine_row: { 'grip.type': ['handling.orientation'], 'grip.thumb': THUMB_NOPOSE, 'posture[back neutral]': ['posture[key=back]'], 'risks[breath]': ['risks[key=breath]'], redFlags: ['riskFlags'] },
  lib_pendlay_row: { 'grip.type': ['handling.orientation', 'handling.handle'], 'grip.thumb': THUMB_NOPOSE, 'grip.handContact': ['handling.contact'], 'risks[breath]': ['risks[key=breath]'], redFlags: ['riskFlags'] },
  lib_t_bar_row: { 'posture[trunk angle stays the same]': ROW.map(l => `posture[key=trunk].${l}`), 'grip.thumb': THUMB_NOPOSE, 'risks[breath]': ['risks[key=breath]'], redFlags: ['riskFlags'] },
};

/** The inherit[] fields of `card` that `id` has no ruled mapping for. */
export const unmappedFields = (id, card) => (Array.isArray(card?.inherit) ? card.inherit : []).map(e => e?.field).filter(f => typeof f !== 'string' || !Object.hasOwn(INHERIT_MAP[id] ?? {}, f));

/** The value at a map path: dot segments, each optionally `name[k=v,...]`, which picks the one array item matching
 *  every pair. Throws when a segment is missing or a selector matches no item or more than one. */
export function atPath(obj, path) {
  let cur = obj;
  for (const seg of path.split('.')) {
    const m = /^([^[]+)(?:\[(.+)\])?$/.exec(seg);
    if (!m || cur === null || typeof cur !== 'object' || !Object.hasOwn(cur, m[1])) throw new Error(`no ${path} (at ${seg})`);
    cur = cur[m[1]];
    if (m[2]) {
      const pairs = m[2].split(',').map(p => p.split('='));
      const hits = Array.isArray(cur) ? cur.filter(x => x && pairs.every(([k, val]) => x[k] === val)) : [];
      if (hits.length !== 1) throw new Error(`${path}: [${m[2]}] matches ${hits.length} items`);
      cur = hits[0];
    }
  }
  return cur;
}

/** C1 (D-LIB9a-MAP): every leaf under `v` as [path, value], `claim` subtrees left out (each child cites its own card). */
export function leaves(v, at = '', out = []) {
  if (v === null || typeof v !== 'object') out.push([at, v]);
  else for (const [k, x] of Array.isArray(v) ? v.entries() : Object.entries(v)) if (Array.isArray(v) || k !== 'claim') leaves(x, `${at}${Array.isArray(v) ? `[${k}]` : `.${k}`}`, out);
  return out;
}

/** D-LIB5-FAMILY (2, 6): the family check of one shipped row. `readCard(path)` reads the card the How-to's research.card
 *  names (as candidate.mjs researchOf reads it), or returns null. `shipped(id)` returns a shipped row's How-to content
 *  (loadContent's), or undefined for a row that is not shipped in this head. Returns null or the refusal:
 *  - `extends` is refused, and named as disagreeing when the card's `parent` is another row;
 *  - an inherit[] other than absent or [] needs the card's parent, every field mapped in INHERIT_MAP, a `shipped`
 *    resolver, the parent shipped, and each mapped path's leaves `===` between child and parent (C1). */
export function familyRefusal(id, content, readCard, shipped) {
  const cardPath = typeof content.research?.card === 'string' ? content.research.card : null, card = cardPath ? readCard(cardPath) : null;
  if (content.extends !== undefined) {
    if (typeof card?.parent === 'string' && content.extends !== `lib_${card.parent}`) return `${id}: family: extends: ${JSON.stringify(content.extends)} disagrees with the card's parent ${JSON.stringify(card.parent)} (D-LIB5-FAMILY)`;
    return UNRULED(id, 'extends');
  }
  if (!card || card.inherit === undefined || (Array.isArray(card.inherit) && card.inherit.length === 0)) return null;
  const field = `${cardPath}#inherit`;
  if (!Array.isArray(card.inherit) || unmappedFields(id, card).length) return UNRULED(id, field);
  if (typeof card.parent !== 'string') return `${id}: family: ${field}: inherit[] with no card parent (D-LIB5-FAMILY)`;
  if (typeof shipped !== 'function') return `${id}: family: ${field}: no shipped-content resolver (D-LIB5-FAMILY)`;
  const pid = `lib_${card.parent}`, parent = shipped(pid);
  if (parent === undefined) return `${id}: family: ${field}: parent ${pid} is not shipped in this head (D-LIB5-FAMILY)`;
  for (const { field: f } of card.inherit) for (const path of INHERIT_MAP[id][f]) {
    let want, got;
    try { want = leaves(atPath(parent, path)); } catch (e) { return `${id}: family: ${f}: parent ${pid}: ${e.message} (D-LIB5-FAMILY)`; }
    if (!want.length) return `${id}: family: ${f}: parent ${pid}: ${path} holds nothing to compare (D-LIB5-FAMILY)`;
    try { got = leaves(atPath(content, path)); } catch (e) { return `${id}: family: ${f}: ${e.message} (D-LIB5-FAMILY)`; }
    const g = new Map(got), w = new Map(want);
    for (const [k, x] of want) if (!g.has(k) || g.get(k) !== x) return `${id}: family: ${f}: ${path}${k} ${JSON.stringify(g.get(k))} !== parent ${pid}'s ${JSON.stringify(x)} (D-LIB5-FAMILY)`;
    for (const [k, x] of got) if (!w.has(k)) return `${id}: family: ${f}: ${path}${k} ${JSON.stringify(x)} is not in parent ${pid} (D-LIB5-FAMILY)`;
  }
  return null;
}

/** Rule (a): one label per fault.key across `sources` = [{ src, faults: [{ key, label }] }]. */
export function familyLabels(sources) {
  const seen = new Map(), out = [];
  for (const { src, faults } of sources) for (const f of faults) {
    const at = seen.get(f.key);
    if (!at) seen.set(f.key, { label: f.label, src });
    else if (at.label !== f.label) v(out, `fault ${f.key}`, 'one label per fault key (content.md 4, family consistency)', `"${f.label}" (${src}) vs "${at.label}" (${at.src})`);
  }
  return out;
}

/** The hand modules under `dir`: [{ src, M }] for every hand-*.mjs, sorted by name ([] when the folder is absent). */
export async function handModules(dir = join(ROOT, HANDS_DIR)) {
  if (!existsSync(dir)) return [];
  const names = readdirSync(dir).filter(n => /^hand-.+\.mjs$/.test(n)).sort();
  return Promise.all(names.map(async n => ({ src: n, M: await import(pathToFileURL(join(dir, n)).href) })));
}

/** One source per hand module: its VARIANTS[*].faults as [{ key, label }]. */
export const handSources = mods => mods.map(({ src, M }) => ({ src,
  faults: Object.values(M.VARIANTS ?? {}).flatMap(va => Object.entries(va.faults ?? {}).map(([key, f]) => ({ key, label: f.label }))) }));

/** One source per shared module export that carries faults: [{ key, label }] from its faults[]. */
export const sharedSources = mods => mods.flatMap(({ src, M }) => Object.entries(M)
  .filter(([, e]) => Array.isArray(e?.faults))
  .map(([name, e]) => ({ src: `${src}#${name}`, faults: e.faults.map(f => ({ key: f.key, label: f.label })) })));

/** One source per How-to module of the 8: its handling.faults objects. */
export const eightSources = mods => mods.map(({ src, M }) => ({ src,
  faults: ((M.default ?? M).handling?.faults ?? []).filter(f => typeof f === 'object').map(f => ({ key: f.key, label: f.label })) }));

/** The fault entries hand modules export, counted straight from VARIANTS (the reader's check). */
export const exportedHandFaults = mods => mods.reduce((a, { M }) => a + Object.values(M.VARIANTS ?? {}).reduce((b, va) => b + Object.keys(va.faults ?? {}).length, 0), 0);

const countOf = sources => sources.reduce((a, s) => a + s.faults.length, 0);

/** Rule (a) over the three sources, with the reader's three count checks. Returns { counts, problems }. */
export function familyCheck({ eight, shared, hands, handMods }) {
  const counts = { eight: countOf(eight), shared: countOf(shared), hands: countOf(hands) }, problems = [];
  const exported = exportedHandFaults(handMods);
  if (counts.eight === 0) v(problems, 'family reader', 'the 8\'s fault count is 0');
  if (counts.shared === 0) v(problems, 'family reader', 'the shared modules\' fault count is 0');
  if (counts.hands !== exported) v(problems, 'family reader', 'hand faults read differ from the faults the hand modules export', `${counts.hands} read, ${exported} exported`);
  if (exported > 0 && counts.hands === 0) v(problems, 'family reader', 'the hand modules export faults but none were read');
  problems.push(...familyLabels([...eight, ...shared, ...hands]));
  return { counts, problems };
}

/** LIB-5's shared modules that may export faults, under tools/plates/library/shared/. */
export const SHARED_MODULES = ['hands', 'implements', 'exemptions', 'moves', 'checkpoints'].map(m => `tools/plates/library/shared/${m}.mjs`);

/** Rule (a) over a tree: `rows` = [{ src, M }] (every shipped row's How-to module), LIB-5's shared modules and the
 *  hand modules under `root`. */
export async function treeFamily(rows, root = ROOT) {
  const shared = await Promise.all(SHARED_MODULES.map(async p => ({ src: p.split('/').pop(), M: await import(pathToFileURL(join(root, p)).href) })));
  const handMods = await handModules(join(root, HANDS_DIR));
  return familyCheck({ eight: eightSources(rows), shared: sharedSources(shared), hands: handSources(handMods), handMods });
}
