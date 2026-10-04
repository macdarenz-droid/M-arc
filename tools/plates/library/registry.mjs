// LIB-2 (library plan 5.3, design 4-5): the one reader of every How-to row. The approved 8 come from
// tools/plates/plates.json (untouched, so its bytes stay the 8's input); library rows come from
// tools/plates/library/batches/<batch>.json, read in file-name order (batch files are named in checklist order).
// Library rows never go into plates.json, so a new batch changes no input of the 8's generated files.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from '../lib/inputs.mjs';

export const PLATES_JSON = 'tools/plates/plates.json';
export const BATCH_DIR = 'tools/plates/library/batches';
export const EXERCISES_JSON = 'src/data/exercises.json';
/** Library plan section 1: the stage of every id (coverage.ts). `blocked:` and `left-out:` carry a reason/decision. */
export const STAGES = ['queued', 'researching', 'drawing', 'review', 'approved-plate', 'shipped'];
export const MODES = ['H', 'P', 'T', 'D'];
export const isStage = s => STAGES.includes(s) || /^blocked:\S/.test(s) || /^left-out:\S/.test(s);

const read = (root, p) => JSON.parse(readFileSync(join(root, p), 'utf8'));
/** The batch files, repo-relative, in name order. */
export const batchFiles = (root = ROOT) => existsSync(join(root, BATCH_DIR)) ? readdirSync(join(root, BATCH_DIR)).filter(n => n.endsWith('.json')).sort().map(n => `${BATCH_DIR}/${n}`) : [];

/** Every row: the 8 (mode 'golden', stage 'shipped') then the library rows. Throws on any inconsistency. */
export function rows(root = ROOT, { plates = read(root, PLATES_JSON), batches = batchFiles(root).map(p => [p, read(root, p)]), exercises = read(root, EXERCISES_JSON) } = {}) {
  const known = new Set(exercises.map(e => e.id)), out = [], seen = new Map(), chrome = new Map(), prefix = new Map();
  const add = (r, where) => {
    if (!known.has(r.id)) throw new Error(`registry: ${where}: ${r.id} is not in ${EXERCISES_JSON}`);
    for (const [m, k] of [[seen, 'id'], [chrome, 'chromeId'], [prefix, 'prefix']]) {
      if (m.has(r[k])) throw new Error(`registry: ${where}: ${k} ${r[k]} already used by ${m.get(r[k])}`);
      m.set(r[k], `${where} ${r.id}`);
    }
    out.push(r);
  };
  const ids8 = Object.keys(plates);
  if (ids8.length === 0) throw new Error(`registry: ${PLATES_JSON} has no rows`);
  for (const id of ids8) add({ id, ...plates[id], mode: 'golden', stage: 'shipped', batch: 'golden' }, PLATES_JSON);
  for (const [file, b] of batches) {
    if (!b || typeof b.rows !== 'object') throw new Error(`registry: ${file}: no rows object`);
    for (const [id, r] of Object.entries(b.rows)) {
      if (!MODES.includes(r.mode)) throw new Error(`registry: ${file}: ${id}: unknown mode ${r.mode}`);
      if (!isStage(r.stage)) throw new Error(`registry: ${file}: ${id}: unknown stage ${r.stage}`);
      if ((r.mode === 'D' || r.mode === 'T') && !r.parent) throw new Error(`registry: ${file}: ${id}: mode ${r.mode} needs a parent`);
      for (const k of ['src', 'slug', 'prefix', 'chromeId']) if (typeof r[k] !== 'string' || !r[k]) throw new Error(`registry: ${file}: ${id}: no ${k}`);
      add({ id, ...r, batch: b.batch ?? file }, file);
    }
  }
  return out;
}

/** chromeId -> lib id, for every row. */
export const libOf = (all = rows()) => Object.fromEntries(all.map(r => [r.chromeId, r.id]));
/** The ids that ship a How-to (stage 'shipped'), in row order. */
export const shippedIds = (all = rows()) => all.filter(r => r.stage === 'shipped').map(r => r.id);
/** The registry inputs (repo-relative): what a file derived from the rows was made from. */
export const registryInputs = (root = ROOT) => [PLATES_JSON, EXERCISES_JSON, 'tools/plates/library/registry.mjs', ...batchFiles(root)];
