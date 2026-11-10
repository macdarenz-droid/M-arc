// LIB-2b (D-LIB4-PINS-2, D-LIB2b-PINS): the registry's shipped rows, for the plugin-output and file-count tests that
// pinned the 8. Each such test keeps its matcher and per-item checks and takes its count from here. The floor is
// checked once, here: at least 8 rows, and the first 8 are plates.json's ids in file order, so no count falls below
// today's and a missing golden id is red.
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export type ShippedRow = { id: string; slug: string; chromeId: string; mode: string; batchFile?: string; pages?: { plates: string; layers: string; layersConfig: string } };
const reg: any = await import(/* @vite-ignore */ new URL('../../tools/plates/library/registry.mjs', import.meta.url).href);
export const SHIPPED: readonly ShippedRow[] = reg.shippedRows();
const EIGHT = Object.keys(JSON.parse(readFileSync(new URL('../../tools/plates/plates.json', import.meta.url), 'utf8')));
if (SHIPPED.length < 8 || JSON.stringify(SHIPPED.slice(0, 8).map(r => r.id)) !== JSON.stringify(EIGHT)) {
  throw new Error(`shipped rows: expected at least the 8, first, in plates.json order; got ${SHIPPED.map(r => r.id)}`);
}
/** The shipped library rows (past the 8). */
export const LIBRARY: readonly ShippedRow[] = SHIPPED.slice(8);
// LIB-SHIP W8a (D-SHIP-TEXTZOOM, F-ZOOM-NONE; #413 6761492481): a shipped row named in text-zooms.json writes no posture
// chunk. TEXT_ZOOM_SHIPPED is exactly the ruled shipped text-zoom rows (red here if the list and the registry disagree);
// POSTURE_SHIPPED and POSTURE_LIBRARY are the rows that carry a posture-<chromeId> chunk.
const TEXT_ZOOMS: string[] = Object.keys(JSON.parse(readFileSync(new URL('../../tools/plates/library/text-zooms.json', import.meta.url), 'utf8')).entries);
export const TEXT_ZOOM_SHIPPED: readonly ShippedRow[] = SHIPPED.filter(r => TEXT_ZOOMS.includes(r.id));
if (JSON.stringify(TEXT_ZOOM_SHIPPED.map(r => r.id)) !== JSON.stringify(['lib_seated_leg_curl'])) {
  throw new Error(`shipped rows: the shipped text-zoom rows are ${TEXT_ZOOM_SHIPPED.map(r => r.id)}, ruled lib_seated_leg_curl (LIB-SHIP W8a)`);
}
export const POSTURE_SHIPPED: readonly ShippedRow[] = SHIPPED.filter(r => !TEXT_ZOOMS.includes(r.id));
export const POSTURE_LIBRARY: readonly ShippedRow[] = LIBRARY.filter(r => !TEXT_ZOOMS.includes(r.id));
