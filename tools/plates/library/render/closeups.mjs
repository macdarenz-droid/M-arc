// LIB-6 close-up renderer (plan 2.6): one data-driven renderer for the How-to close-ups, fed by an exercise's
// `*.howto.mjs` module and a close-up options record. It returns the API the vendored artifact/howto-layers.mjs reads
// from a golden-B close-up script (handZoom, postureZoom, zoomSection, chipRow, PAGES, CSS/ZCSS, howto), so the page's
// own cleanZoom/prefixIds/scopeCss run unchanged on its output. Two sheet shells exist, as in golden B:
//   'zoom' - the How-to zoom sheet (golden B's howto/render-*.mjs family), closeup/zoom.mjs;
//   'zbox' - the boxed sheet (golden B's exercises/*.howto-render.mjs family), closeup/zbox.mjs.
// The bespoke parts of the 8 are named options (closeups-8.mjs). Engine files are imported, never changed.
import { buildSync } from 'esbuild';
import { existsSync } from 'node:fs';
import { dirname, join, resolve, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { LAYERS_ENGINE } from './closeup/crop.mjs';
import { zoomApi } from './closeup/zoom.mjs';
import { zboxApi } from './closeup/zbox.mjs';

export const SHELLS = { zoom: zoomApi, zbox: zboxApi };

export { LAYERS_ENGINE };

// D-LIB9-ENGINE: a plate's crops and its plate block come from the engine its spec imports. Only the spec file decides
// (a How-to may import golden B's hand engine and landmarksOf whatever its plate uses).
const VENDOR_DIR = `${sep}tools${sep}plates${sep}vendor${sep}engine${sep}`, LAYERS_DIR = `${sep}tools${sep}plates${sep}layers${sep}engine${sep}`;
const closures = new Map(), engines = new Map();
/** { name: 'layers' | 'vendor', vendorDir } of a spec file, from its whole static import closure (esbuild, as layersSpecOf).
 *  `root`: a layers mirror, whose own engine/ is golden B's. Both engines in one closure throw; neither is 'layers'. */
function closureEngine(specFile, root) {
  const key = `${specFile}\0${root ?? ''}`;
  if (closures.has(key)) return closures.get(key);
  const cwd = dirname(specFile);
  const meta = buildSync({ entryPoints: [specFile], bundle: true, platform: 'node', packages: 'external', write: false, metafile: true, format: 'esm', logLevel: 'silent', absWorkingDir: cwd, outdir: 'engine-out' }).metafile;
  const files = Object.keys(meta.inputs).map(p => resolve(cwd, p));
  const v = files.find(p => p.includes(VENDOR_DIR));
  const l = files.some(p => p.includes(LAYERS_DIR) || (root && p.startsWith(join(root, 'engine') + sep)));
  if (v && l) throw new Error(`close-ups: ${specFile}: the spec imports both engines`);
  const out = v ? { name: 'vendor', vendorDir: v.slice(0, v.indexOf(VENDOR_DIR) + VENDOR_DIR.length) } : { name: 'layers' };
  closures.set(key, out);
  return out;
}
/** The plate spec file of howto id `id` in a layers mirror (`root`), or undefined where the card has none (golden B's
 *  lateral raise draws the approved ref-src plate). Card id = howto id except the lateral raise (howto-layers.mjs). */
export function specFileOf(root, id) {
  const f = join(root, 'exercises', `${id === 'dumbbell_lateral_raise' ? 'lateral_raise' : id}.mjs`);
  return existsSync(f) ? f : undefined;
}
/** 'layers' | 'vendor': the engine `specFile` imports. */
export const engineNameOf = (specFile, { root } = {}) => closureEngine(specFile, root).name;
/** The engine object ({ name, renderPlate, landmarksOf, legPressFace }) that draws `specFile`'s plate. A vendor spec gets the
 *  vendor engine files of its own closure (in a mirror, the staged copies, so the spec and its renderer share one
 *  instance); a layers spec gets `layers` (default LAYERS_ENGINE). */
export async function engineOf(specFile, { root, layers = LAYERS_ENGINE } = {}) {
  const c = specFile ? closureEngine(specFile, root) : { name: 'layers' };
  if (c.name === 'layers') return layers;
  if (!engines.has(c.vendorDir)) {
    const [plate, body, eq] = await Promise.all(['plate.mjs', 'body.mjs', 'equipment.mjs'].map(f => import(pathToFileURL(join(c.vendorDir, f)).href)));
    engines.set(c.vendorDir, Object.freeze({ name: 'vendor', renderPlate: plate.renderPlate, landmarksOf: body.landmarksOf, legPressFace: eq.legPressFace }));
  }
  return engines.get(c.vendorDir);
}
/** The engine check: throws, naming the id, when `engine` is not the engine `specFile` imports (with no spec file, only
 *  the layers engine passes). It compares engines, never bytes. */
export function checkEngine(id, what, engine, specFile, { root } = {}) {
  const want = specFile ? engineNameOf(specFile, { root }) : 'layers';
  if (engine?.name !== want) throw new Error(`close-ups: ${id}: ${what} engine ${engine?.name}, but its spec imports the ${want} engine`);
}
/** The plate block's renderPlate for card `id` (D-LIB6PM-PLATE): its spec's engine, checked. */
export async function plateEngine(id, specFile, opts = {}) {
  const engine = await engineOf(specFile, opts);
  checkEngine(id, 'plate', engine, specFile, opts);
  return engine.renderPlate;
}

/** `mod`: the exercise's howto module namespace (default export plus named exports such as THUMB_PAGE, stills).
 *  `engine`/`specFile`: the engine that draws the crops and the spec it must match (D-LIB9-ENGINE); default the layers
 *  engine with no spec file. */
export function closeupApi(mod, options, { engine = LAYERS_ENGINE, specFile, root } = {}) {
  if (!options) throw new Error(`close-ups: ${mod?.default?.id ?? '?'}: no close-up options`);
  const shell = SHELLS[options.shell];
  if (!shell) throw new Error(`close-ups: unknown shell ${options.shell}`);
  checkEngine(mod?.default?.id ?? '?', 'crop', engine, specFile, { root });
  return shell(mod, options, engine);
}
