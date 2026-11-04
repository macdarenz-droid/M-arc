// LIB-SHAPES (#377, PLAN RULED): test-only fixtures for the two library sheet shapes, made from two of golden B's 8
// in memory. Nothing under tools/plates/layers/ is written: the layers-page fixtures are wrapper modules that the
// builder copies into its mirror (spec.files), and the app fixtures are the same edit applied to generated content.
//   F-NONE   leg_press as `archetype: 'none'` (D-SHIP-GRIP): no hand zoom, no grip line, no handling mistakes.
//   F-NOZOOM machine_chest_press (push, Hand first) with no hand zoom and `why` naming D-SHIP-C3, on a test no-zoom list.
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
export const NONE_ID = 'leg_press', NOZOOM_ID = 'machine_chest_press';
export const NONE_WHY = 'D-SHIP-GRIP (b): fixture', NOZOOM_WHY = 'D-SHIP-C3: fixture';
export const NOZOOM_LIST = [NOZOOM_ID];

/** The one edit, as a self-contained function (its source also runs in the gate's browser wrapper): drops every
 *  hand-kind zoom, every `zoom` link to one and the Hand chip; then the shape's own handling. */
export function shapeOf(d, shape) {
  const hand = new Set((d.zooms ?? []).filter(z => z.kind === 'hand').map(z => z.key));
  const strip = x => Array.isArray(x) ? x.map(strip)
    : x && typeof x === 'object' && Object.getPrototypeOf(x) === Object.prototype
      ? Object.fromEntries(Object.entries(x).filter(([k, v]) => !(k === 'zoom' && hand.has(v))).map(([k, v]) => [k, strip(v)]))
      : x;
  const out = { ...d };
  for (const k of ['setup', 'posture', 'mistakes', 'feel']) if (k in d) out[k] = strip(d[k]);
  out.zooms = d.zooms.filter(z => !hand.has(z.key));
  if (d.chips) out.chips = d.chips.filter(k => !hand.has(k));
  if (shape === 'none') { out.handling = { archetype: 'none', why: 'D-SHIP-GRIP (b): fixture' }; out.mistakes = []; }
  else if (shape === 'nozoom') out.handling = { ...d.handling, why: 'D-SHIP-C3: fixture' };
  else throw new Error(`lib-shapes fixture: unknown shape ${shape}`);
  return out;
}

const vendored = id => pathToFileURL(join(ROOT, 'tools/plates/layers/exercises', `${id}.howto.mjs`)).href;
const wrapper = (id, shape, extra) => `// LIB-SHAPES test fixture (generated): ${id} as the ${shape} shape\n`
  + `import * as V from ${JSON.stringify(vendored(id))};\n`
  + `import { shapeOf } from ${JSON.stringify(import.meta.url)};\n`
  + `export * from ${JSON.stringify(vendored(id))};\n`
  + `const S = shapeOf(V.default, ${JSON.stringify(shape)}), X = ${JSON.stringify(extra ?? {})};\n`
  + 'export default { ...S, ...X, handling: { ...S.handling, ...(X.handling ?? {}) } };\n';

/** Writes the wrapper modules into `dir`; returns the spec.files map that puts them over the mirror's copies.
 *  `extra[id]`: fields laid over the shaped sheet (`handling` merged), for the refusal tests. */
export function writeShapeFiles(dir, shapes = { [NONE_ID]: 'none', [NOZOOM_ID]: 'nozoom' }, extra = {}) {
  mkdirSync(dir, { recursive: true });
  const files = {};
  for (const [id, shape] of Object.entries(shapes)) {
    const p = join(dir, `${id}.howto.mjs`);
    writeFileSync(p, wrapper(id, shape, extra[id]));
    files[`exercises/${id}.howto.mjs`] = p;
  }
  return files;
}
