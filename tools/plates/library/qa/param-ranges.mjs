// LIB-3c (D-LIB10-RANGES, D-LIB3c-SHARED): the approved PARAMS ranges per family, read only by PQ-H10 (node.mjs h10) for
// a D or T row. param-ranges.json: { $comment, families: { <family>: { ruling, params: { <PARAMS key>: { range, basis } } } } }
// where a family is a T row's template name or `D:<parent id>`, `range` is exactly the envelope row derive.mjs reads
// ([min, max] or [allowed values]) and `basis` holds one non-empty string per bound or value. Only the supervisor adds
// rows, each by a ruling. pin.mjs, selftest.mjs and loadPins never read this file.
import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { PARAMS } from '../derive.mjs';
import { rowOk } from './node.mjs';

export const RANGES_FILE = fileURLToPath(new URL('./param-ranges.json', import.meta.url));
const bad = why => { throw new Error(`param-ranges: ${why}`); };
const isObj = v => !!v && typeof v === 'object' && !Array.isArray(v);
const only = (o, keys, where) => { for (const k of Object.keys(o)) if (!keys.includes(k)) bad(`${where}: unknown field ${k}`); };

/** { family: { key: range } }, read on every call (no cache). A missing file has no family; a malformed one throws. */
export function loadRanges(file = RANGES_FILE) {
  if (!existsSync(file)) return {};
  const data = JSON.parse(readFileSync(file, 'utf8'));
  if (!isObj(data) || !isObj(data.families)) bad('the file is not { families: {...} }');
  only(data, ['$comment', 'families'], 'the file');
  const out = {};
  for (const [fam, row] of Object.entries(data.families)) {
    if (!isObj(row)) bad(`${fam}: not an object`);
    only(row, ['ruling', 'params'], fam);
    if (typeof row.ruling !== 'string' || !/^D-[A-Z0-9-]+$/.test(row.ruling)) bad(`${fam}: no ruling id`);
    if (!isObj(row.params) || Object.keys(row.params).length === 0) bad(`${fam}: no params`);
    out[fam] = {};
    for (const [k, v] of Object.entries(row.params)) {
      if (!Object.hasOwn(PARAMS, k)) bad(`${fam}: ${k} is not a PARAMS key`);
      if (!isObj(v)) bad(`${fam}: ${k}: not { range, basis }`);
      only(v, ['range', 'basis'], `${fam}: ${k}`);
      if (!rowOk(PARAMS[k], v.range)) bad(`${fam}: ${k}: the range ${JSON.stringify(v.range)} is malformed`);
      if (!Array.isArray(v.basis) || v.basis.length !== v.range.length || !v.basis.every(b => typeof b === 'string' && b.trim())) bad(`${fam}: ${k}: each bound or value needs its basis`);
      out[fam][k] = v.range;
    }
  }
  return out;
}

/** The one object a row's PQ-H10 value check and child rebuild read: for each PARAMS key, the family's range when the
 *  family names it, else the envelope's row (on the real path envelope.json, which names no PARAMS key: fail closed). */
export function familyObject(family, envelope, ranges) {
  const f = typeof family === 'string' && Object.hasOwn(ranges, family) ? ranges[family] : {};
  const out = {};
  for (const k of Object.keys(PARAMS)) {
    if (Object.hasOwn(f, k)) out[k] = f[k];
    else if (envelope && Object.hasOwn(envelope, k)) out[k] = envelope[k];
  }
  return out;
}
