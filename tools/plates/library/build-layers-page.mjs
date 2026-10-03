// LIB-6 layers page builder (plan 2.7): golden B's layers page for any list of exercises, from the approved chrome.
// The vendored artifact/build-page.mjs and artifact/howto-layers.mjs have the 8 written in (GROUPS, HOWTO_IDS, the
// close-up script per id). This builder runs those two files unchanged except for named, exact-once source patches
// that swap the written-in lists for a spec list, on a mirror copy of tools/plates/layers/. So a batch page carries
// golden B's chrome byte for byte and cannot drift from it; with the 8's list it rebuilds the LR-23 page (e7b81413…).
// Each exercise's close-ups come from the library renderer (render/closeups.mjs) or, as plan 2.6's fallback, from its
// frozen golden-B script (render/legacy.mjs). Nothing in tools/plates/layers/ is written to. Build time only (Node 22).
import { spawn } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { cleanupMirror, makeMirror } from '../layers.mjs';
import { LEGACY_SCRIPTS } from './render/legacy.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
export const RENDERER_URL = pathToFileURL(join(HERE, 'render', 'closeups.mjs')).href;
export const REGION_FIX_URL = pathToFileURL(join(HERE, 'render', 'region-fix.mjs')).href;
/** The CSS comment label of a renderer-drawn exercise that has no golden-B label. */
export const RENDERER_LABEL = 'library/render/closeups.mjs';

/** Card id (build-page.mjs) <-> howto id (howto-layers.mjs): only the lateral raise differs, as in howto-layers.mjs. */
export const howtoIdOf = card => (card === 'lateral_raise' ? 'dumbbell_lateral_raise' : card);

/** Golden B's GROUPS. */
export const GOLDEN_B_GROUPS = [
  { id: 'free', title: 'Free weights', ids: ['lateral_raise', 'barbell_back_squat'] },
  { id: 'hanging', title: 'Hanging', ids: ['pull_up', 'hanging_leg_raise'] },
  { id: 'machines', title: 'Machines', ids: ['lat_pulldown', 'seated_cable_row', 'leg_press', 'machine_chest_press'] },
];
/** The 8's close-up sources: the library renderer with the 8's options, each CSS block labelled as golden B labels it. */
export const GOLDEN_B_OPTIONS_URL = pathToFileURL(join(HERE, 'render', 'closeups-8.mjs')).href;
export const GOLDEN_B_CLOSEUPS = Object.fromEntries(Object.entries(LEGACY_SCRIPTS).map(([id, label]) => [id, { optionsKey: id, label }]));
export const GOLDEN_B_SPEC = { groups: GOLDEN_B_GROUPS, closeups: GOLDEN_B_CLOSEUPS, optionsUrl: GOLDEN_B_OPTIONS_URL };
export const GOLDEN_B_JUMP = '  <a class="pg-jump" href="#machine-chest-press-chip-hand">Machine chest press: the wrist fix <span aria-hidden="true">&darr;</span></a>\n';

/** One exact-once source patch; throws, naming it, when the vendored text it expects is not there exactly once. */
export function patchOnce(src, name, from, to) {
  const n = src.split(from).length - 1;
  if (n !== 1) throw new Error(`layers page: patch "${name}" matched ${n} times (the vendored source moved)`);
  return src.replace(from, () => to);
}
const between = (src, name, start, endMark) => {
  const a = src.indexOf(start), b = a < 0 ? -1 : src.indexOf(endMark, a);
  if (a < 0 || b < 0 || src.indexOf(start, a + 1) >= 0) throw new Error(`layers page: patch "${name}" has no single anchor`);
  return src.slice(a, b + endMark.length);
};

/**
 * Validates a spec and returns the per-howto-id plan the patched howto-layers.mjs reads.
 * spec.groups: [{ id, title, ids: [cardId] }]; spec.closeups: { [howtoId]: { legacy: true } | { optionsKey, label? } };
 * spec.optionsUrl: module exporting `CLOSEUP_OPTIONS` (required when any exercise uses the renderer);
 * spec.files: { 'exercises/<id>.mjs': absPath, … } copied into the mirror (a new exercise's plate and howto sources);
 * spec.jump: the header's jump-link line (default golden B's; null drops it); spec.regionFix (default true).
 */
export function planOf(spec) {
  const cards = spec.groups.flatMap(g => g.ids), ids = cards.map(howtoIdOf);
  if (!cards.length) throw new Error('layers page: no exercises');
  if (new Set(cards).size !== cards.length) throw new Error('layers page: an exercise is listed twice');
  const legacy = {}, labels = {}, keys = {};
  for (const id of ids) {
    const c = spec.closeups?.[id];
    if (!c) throw new Error(`layers page: ${id}: no close-up source`);
    if (c.legacy) {
      if (!LEGACY_SCRIPTS[id]) throw new Error(`layers page: ${id}: no frozen golden-B script to fall back to`);
      legacy[id] = LEGACY_SCRIPTS[id]; labels[id] = LEGACY_SCRIPTS[id];
    } else {
      if (!c.optionsKey || !spec.optionsUrl) throw new Error(`layers page: ${id}: renderer close-ups need optionsUrl and optionsKey`);
      keys[id] = c.optionsKey; labels[id] = c.label ?? RENDERER_LABEL;
    }
  }
  return { ids, legacy, labels, keys, optionsUrl: spec.optionsUrl ?? null, regionFix: spec.regionFix !== false };
}

/** The patched howto-layers.mjs source. */
export function patchHowtoLayers(src, plan) {
  src = patchOnce(src, 'HOWTO_IDS', between(src, 'HOWTO_IDS', 'export const HOWTO_IDS = [', '];\n'),
    `export const HOWTO_IDS = ${JSON.stringify(plan.ids)};\n`);
  src = patchOnce(src, 'RENDERER', between(src, 'RENDERER', 'const RENDERER = {', '};\n'),
    `const RENDERER = ${JSON.stringify(plan.labels)};   // LIB-6: the close-up CSS comment label per id\n`
    + `const LEGACY = ${JSON.stringify(plan.legacy)};   // LIB-6: frozen golden-B scripts (plan 2.6 fallback)\n`);
  src = patchOnce(src, 'legacy path', 'const file = join(root, RENDERER[id]), url', 'const file = join(root, LEGACY[id]), url');
  src = patchOnce(src, 'renderer dispatch', '  for (const id of HOWTO_IDS) apis[id] = await loadRenderer(id);',
    `  const __lib = await import(${JSON.stringify(RENDERER_URL)}), __opts = ${plan.optionsUrl ? `(await import(${JSON.stringify(plan.optionsUrl)})).CLOSEUP_OPTIONS` : '{}'};\n`
    + `  const __keys = ${JSON.stringify(plan.keys)};\n`
    + `  for (const id of HOWTO_IDS) apis[id] = LEGACY[id] ? await loadRenderer(id)\n`
    + `    : __lib.closeupApi((await import(pathToFileURL(join(root, 'exercises', \`\${id}.howto.mjs\`)).href)), __opts[__keys[id]], { root });\n`
    + (plan.regionFix ? `  (await import(${JSON.stringify(REGION_FIX_URL)})).applyRegionFix((await import('../engine/bodymap-parts.mjs')).FRONT_PARTS);\n` : ''));
  return src;
}

/** The patched build-page.mjs source. */
export function patchBuildPage(src, spec) {
  src = patchOnce(src, 'GROUPS', between(src, 'GROUPS', 'const GROUPS = [', '];\n'), `const GROUPS = ${JSON.stringify(spec.groups)};\n`);
  if (spec.jump !== undefined) src = patchOnce(src, 'jump link', GOLDEN_B_JUMP, spec.jump ?? '');
  return src;
}

const runNode = (cwd, file) => new Promise((resolve, reject) => {
  const c = spawn(process.execPath, [file], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  const err = [];
  c.stdout.resume(); c.stderr.on('data', d => err.push(d));
  c.on('error', reject);
  c.on('close', code => (code === 0 ? resolve() : reject(new Error(`${file} exited ${code}: ${Buffer.concat(err).toString().slice(0, 4000)}`))));
});

/** Builds the layers page for `spec`; resolves to its bytes (the page the owner's sheet and CI golden use). */
export async function buildLayersPage(spec) {
  const plan = planOf(spec), mirror = makeMirror();
  try {
    for (const [rel, abs] of Object.entries(spec.files ?? {})) { mkdirSync(dirname(join(mirror, rel)), { recursive: true }); copyFileSync(abs, join(mirror, rel)); }
    const hl = join(mirror, 'artifact', 'howto-layers.mjs'), bp = join(mirror, 'artifact', 'build-page.mjs');
    writeFileSync(hl, patchHowtoLayers(readFileSync(hl, 'utf8'), plan));
    writeFileSync(bp, patchBuildPage(readFileSync(bp, 'utf8'), spec));
    await runNode(mirror, 'artifact/build-page.mjs');
    return readFileSync(join(mirror, 'artifact', 'technical-plates.html'));
  } finally { cleanupMirror(mirror); }
}
