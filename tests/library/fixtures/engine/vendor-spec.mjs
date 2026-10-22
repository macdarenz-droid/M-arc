// LIB-6-PM (PM-A2, D-LIB9-ENGINE): a vendor-engine plate spec for engine-per-plate tests. In a LIB-2b staged tree
// (tests/howto/fixtures/lib2b/fixture.mjs stageTree), the scratch row's spec, a clone of golden B's pull-up, is rewritten
// to import tools/plates/library/engine.mjs (the vendor engine) and to use the two things only that engine draws: a flat
// palm (vendor body.mjs opts.hand 'flat') and a `poly` part (vendor equipment.mjs). The How-to keeps golden B's hand
// engine, as a library How-to may. Each replacement is exact-once or it throws.
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/** A small poly part next to the bar: three points in world metres (side view uses z, y). */
export const POLY = "{ type: 'poly', pts: [[0, 2.36, -0.12], [0, 2.36, 0.12], [0, 2.44, 0]], cls: 'eq' },   // LIB-6-PM: vendor-only primitive";
const EDITS = [
  ["import { normPose, resolve, fk, landmarksOf } from '../../layers/engine/index.mjs';", "import { normPose, resolve, fk, landmarksOf } from '../engine.mjs';"],
  ["import { bodyShapes } from '../../layers/engine/body.mjs';", "import { bodyShapes } from '../engine.mjs';"],
  ['  equipment: [\n', `  hand: 'flat',\n  equipment: [\n    ${POLY}\n`],
];

/** The vendor spec text from the clone's text. */
export function vendorSpecText(text) {
  for (const [from, to] of EDITS) {
    const n = text.split(from).length - 1;
    if (n !== 1) throw new Error(`engine fixture: expected one ${JSON.stringify(from)}, found ${n}`);
    text = text.replace(from, () => to);
  }
  return text;
}

/** Rewrites the staged tree's spec (`spec`: repo-relative, LIB-2b fixture SPEC) in place; returns its absolute path. */
export function toVendor(root, spec) {
  const file = join(root, spec);
  writeFileSync(file, vendorSpecText(readFileSync(file, 'utf8')));
  return file;
}
