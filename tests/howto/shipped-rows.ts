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
