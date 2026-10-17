// LIB-2b (lib4-cards 11.1 item 2, D-LIB2b-QA, D-LIB4b-QACAND): the one QA candidate builder. candidateOf(id, { root,
// platesHtml, engine }) returns LIB-3's candidate shape (qa/index.mjs:4-10) for one registry row:
//   - one of the 8: exactly approved.mjs candidatesOf's entry (mode 'approved');
//   - a library row (H, D, T; 'P' throws until ruled): spec from row.src, imported in place; plate and article cut
//     from `platesHtml` (the row's batch plates page); census view from the row's required `view` (the batch file records
//     its census source in `censusRef`); research (plateFacts, tempo, topFault) from the card file the How-to names in
//     research.card (repo-relative), never defaulted: a missing card gives research null and a missing field stays
//     missing, so runQa reports it (PQ-H6, F7); mistakeFault is the plate's selected mistake tell (its first tell key);
//     derivation for D and T rows (params, the PARAMS schema, the parent rebuilt alone, the parent's pinned fragments:
//     GOLDEN.json for one of the 8, else the one batch golden file that holds the parent's plate entry); exemptions are
//     the batch golden plate entry's `exemptions` (flag names, D-LIB3-flags).
// The generator (gen/plates.mjs) gates the node half before it emits a library row; LIB-4b's PQH rows gate the full report.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { GOLDEN_JSON, extractPlates, fragmentsOf, latestEntries, verifyBatchChain } from '../golden.mjs';
import { articlesOf, candidatesOf } from './qa/approved.mjs';
import { buildPlatesPage } from './build-page.mjs';
import { PARAMS } from './derive.mjs';
import { groupsConfig } from './plates-page.mjs';
import { LIBRARY_GOLDEN_DIR, rows, sourceOf } from './registry.mjs';
import { pinOf } from './batch-golden.mjs';

const fail = (row, why) => { throw new Error(`candidate: ${row.id}${row.batchFile ? ` (${row.batchFile})` : ''}: ${why}`); };

/** The latest `plate` entry of a parent id: GOLDEN.json for one of the 8, else the one batch golden file holding it. */
export function parentEntry(parent, root = ROOT) {
  const golden = JSON.parse(readFileSync(GOLDEN_JSON, 'utf8')).entries;
  const g = latestEntries(golden).get(parent.id);
  if (parent.mode === 'golden') { if (!g) throw new Error(`candidate: ${parent.id}: no GOLDEN.json plate entry`); return g; }
  const dir = join(root, LIBRARY_GOLDEN_DIR), hits = [];
  for (const f of existsSync(dir) ? readdirSync(dir).filter(n => n.endsWith('.json')).sort() : []) {
    const data = JSON.parse(readFileSync(join(dir, f), 'utf8')), bad = verifyBatchChain(data, golden);
    if (bad.length) throw new Error(`candidate: ${LIBRARY_GOLDEN_DIR}/${f}:\n${bad.join('\n')}`);
    const e = latestEntries(data.entries).get(parent.id);
    if (e?.kind === 'plate') hits.push(e);
  }
  if (hits.length !== 1) throw new Error(`candidate: plate entry for ${parent.id} in ${hits.length} files`);
  return hits[0];
}

/** The research facts a How-to's card names, or null when it names none or the file is missing. */
export function researchOf(howto, root = ROOT) {
  const card = howto.research?.card;
  if (typeof card !== 'string' || !existsSync(join(root, card))) return null;
  const c = JSON.parse(readFileSync(join(root, card), 'utf8'));
  return Object.fromEntries(['plateFacts', 'tempo', 'topFault'].filter(k => k in c).map(k => [k, c[k]]));
}

/** D-LIB9-AUTHORQA: authoring-time QA of a row still in drawing or review. `authoring: true` returns the same candidate
 *  with exemptions [] and reads no pin; it is refused at stage approved-plate or shipped. The generator, LIB-4b's PQH rows
 *  and LIB-4c never pass it. */
export const AUTHORING_REFUSED = ['approved-plate', 'shipped'];
/** The How-to source of a row in the injected `all`: registry sourceOf's rule for a library row, applied to `all`.
 *  (registry.mjs is an input of every generated file, so it is not edited: D-LIB9-AUTHORQA asks for an `all` parameter
 *  on sourceOf; this keeps generate --check unchanged. Ruling asked on #245.) */
export const howtoOf = (id, root, all) => (all.some(r => r.id === id && r.mode !== 'golden') ? `tools/plates/library/howto/${id}.howto.mjs` : sourceOf(id, root));
export async function candidateOf(id, { root = ROOT, platesHtml, engine, all = rows(root), authoring = false } = {}) {
  const row = all.find(r => r.id === id);
  if (!row) throw new Error(`candidate: no registry row for ${id}`);
  if (authoring && AUTHORING_REFUSED.includes(row.stage)) fail(row, `authoring QA is refused at stage ${row.stage} (D-LIB9-AUTHORQA)`);
  if (typeof platesHtml !== 'string') fail(row, 'no plates page');
  if (row.mode === 'golden') {
    const c = (await candidatesOf(platesHtml, engine)).find(x => x.id === id);
    if (!c) fail(row, 'not in the plates page');
    return c;
  }
  if (row.mode === 'P') fail(row, "mode 'P' has no candidate rule yet (unruled)");
  const plate = extractPlates(platesHtml).find(p => p.chromeId === row.chromeId);
  if (!plate) fail(row, `card-${row.chromeId} is not in its plates page`);
  if (!row.view) fail(row, 'no census view (batch row field `view`)');
  if (typeof row.censusRef !== 'string' || !/^[0-9a-f]{7,40}$/.test(row.censusRef)) fail(row, 'its batch file records no census source (`censusRef`)');
  for (const f of [`tools/plates/${row.src}`, howtoOf(id, root, all)]) if (!existsSync(join(root, f))) fail(row, `no source file ${f}`);
  const spec = (await import(pathToFileURL(join(root, 'tools/plates', row.src)).href)).default;
  const howto = (await import(pathToFileURL(join(root, howtoOf(id, root, all))).href)).default;
  let derivation = null;
  if (row.mode === 'D' || row.mode === 'T') {
    const parent = all.find(r => r.id === row.parent);
    if (!parent) fail(row, `parent ${row.parent} has no registry row`);
    const entry = parentEntry(parent, root);
    derivation = {
      params: row.params, schema: PARAMS, parentFragments: entry.fragments,
      rebuildParent: async () => {
        const { html } = await buildPlatesPage(await groupsConfig({ groups: [{ id: 'parent', title: 'Parent', ids: [parent.id] }] }, all, `${row.id}'s parent`));
        const p = extractPlates(html.toString('utf8')).find(x => x.chromeId === parent.chromeId);
        return p ? fragmentsOf(p) : null;
      },
    };
  }
  return {
    id, chromeId: row.chromeId, mode: row.mode, spec, plate, article: articlesOf(platesHtml).get(row.chromeId),
    research: researchOf(howto, root), census: { view: row.view }, mistakeFault: plate.mistake.firstKey, derivation,
    exemptions: authoring ? [] : pinOf(row, 'plate', root).exemptions ?? [],
  };
}

/** The node-half problems runQa reports when no browser half ran (qa/index.mjs:47-48), and only those. */
export const isBrowserNotRun = (hard, p) => ['PQ-H1', 'PQ-H4', 'PQ-H5'].includes(hard) && p.key === 'browser:not-run';
export const isFlagNotRun = (f, v) => ['F2', 'F5'].includes(f) && v.why === 'browser checks not run';
/** The report with the browser-half problems removed and `ok` recomputed: what the generator gates (D-LIB2b-QA (3)). */
export function nodeHalf(report) {
  const hard = Object.fromEntries(Object.entries(report.hard).map(([h, v]) => {
    const problems = v.problems.filter(p => !isBrowserNotRun(h, p));
    return [h, { ...v, problems, pass: problems.length === 0 }];
  }));
  const flags = Object.fromEntries(Object.entries(report.flags).map(([f, v]) => [f, isFlagNotRun(f, v) ? { ...v, blocks: false } : v]));
  return { ...report, hard, flags, ok: Object.values(hard).every(v => v.pass) && Object.values(flags).every(v => !v.blocks) };
}
