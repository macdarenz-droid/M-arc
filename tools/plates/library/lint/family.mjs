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
 *  setup['Pick the weight…'] stays unmapped because machine_chest_press ships no such line (F-LB1-SETUP). */
const THUMB = ['handling.thumb.mode', 'handling.pose.thumb'];
export const INHERIT_MAP = {
  lib_chin_up: { 'grip.thumb (wrapped, never thumbless by default)': THUMB, 'zooms.hand (full grip, thumb around the bar, is the only grip shown)': ['zooms[key=hand]'] },
  lib_close_grip_pulldown: { 'zooms: seat height / thigh pad crop': ['zooms[key=pad]'] },
  lib_hanging_knee_raise: { 'grip.thumb (wrapped every set)': THUMB },
  lib_incline_machine_press: { 'grip.type': ['handling.handle'], 'grip.thumb': THUMB, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'],
    "posture['Straight wrist, forearm behind the handle']": ['posture[key=wrist]'], "posture['Feet flat, hips back']": ['posture[key=feet]'], "zooms['hand']": ['zooms[key=hand]'] },
  lib_shoulder_press: { 'grip.thumb': THUMB, 'grip.handContact': ['handling.contact'], 'grip.wrist': ['handling.wrist'], "zooms['hand']": ['zooms[key=hand]'] },
  lib_single_arm_lat_pulldown: { 'setup: lean back only slightly (about 30 degrees at most), no extra lean during the pull': ['setup[kind=position,zoom=path].text'] },
  lib_underhand_lat_pulldown: { 'posture: bar comes down in front of the face, never behind the head': ['posture[key=path]'], 'zooms: seat height / thigh pad crop': ['zooms[key=pad]'] },
  lib_horizontal_leg_press: { grip: ['handling'], "posture['Tailbone and lower back flat on the pad']": ['posture[key=back]'], "posture['Whole foot flat, mid-platform']": ['posture[key=feet]'],
    "posture['Soft knees at the top']": ['posture[key=soft]'], "posture['Hands light on the side handles']": ['posture[key=hands]'] },
  lib_leg_press_calf_raise: { grip: ['handling'], "setup['After the last rep, pause at the top, turn the handles back in, and let the sled settle on the catches before you take your feet off or let go.']": ['setup[kind=finish]'],
    "posture['Hands light on the side handles']": ['posture[key=hands]'] },
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
