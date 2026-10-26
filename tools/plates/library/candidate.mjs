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
// LIB-3c (D-LIB3b-H7, D-LIB10-RANGES, D-LIB10-CHILDPROOF): a library candidate also carries freshSpec() (row.src imported
// afresh) and rebuild() (its plate built alone in its own process) for PQ-H7; a D/T derivation also carries its family,
// rebuildChild(obj) (the child rebuilt alone from its derivation: D derive(parent, params, obj), T make(params, facts))
// and, for T, rebuildTemplateParent() (make(parentParams, parentFacts)). Rebuild modules live under os.tmpdir() only.
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { ROOT } from '../lib/inputs.mjs';
import { GOLDEN_JSON, extractPlates, fragmentsOf, latestEntries, makeMirror, verifyBatchChain } from '../golden.mjs';
import { articlesOf, candidatesOf } from './qa/approved.mjs';
import { buildPlatesPage } from './build-page.mjs';
import { PARAMS } from './derive.mjs';
import { cardIdOf, groupsConfig, specIdOf } from './plates-page.mjs';
import { LIBRARY_GOLDEN_DIR, rows, sourceOf } from './registry.mjs';
import { pinOf } from './batch-golden.mjs';
import { plateZooms } from './zoom/inline.mjs';
import { isUntimed } from './strip/tempo-strip.mjs';   // LIB-STRIP
import { fallbackAIds } from './research/validate.mjs';   // LIB-STRIP

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

/** The fragments of `id`'s plate on a page built for `id` alone from `all`; `module` (text, written under os.tmpdir()
 *  and removed after the build) replaces the spec under `key` when given. `mirror` is set when the module imports a
 *  spec of the 8 (its engine needs the mirror's font); it is kept until the build returns. */
async function plateAlone(id, all, where, module = null, key = null, { mirror = null } = {}) {
  const dir = module ? mkdtempSync(join(tmpdir(), 'lib3c-rebuild-')) : null;
  try {
    const cfg = await groupsConfig({ groups: [{ id: 'one', title: 'One', ids: [id] }] }, all, where);
    if (module) { const f = join(dir, 'spec.mjs'); writeFileSync(f, module); cfg.specs = { ...cfg.specs, [key]: f }; }
    const row = all.find(r => r.id === id), { html } = await buildPlatesPage(cfg);
    const p = extractPlates(html.toString('utf8')).find(x => x.chromeId === row.chromeId);
    return p ? fragmentsOf(p) : null;
  } finally {
    if (dir) rmSync(dir, { recursive: true, force: true });
    if (mirror) rmSync(mirror, { recursive: true, force: true });
  }
}
const href = p => JSON.stringify(pathToFileURL(p).href);
const TEMPLATE_NAME = /^[A-Za-z0-9_-]+$/;
let fresh = 0;

/** The research facts a How-to's card names, or null when it names none or the file is missing. */
export function researchOf(howto, root = ROOT) {
  const card = howto.research?.card;
  if (typeof card !== 'string' || !existsSync(join(root, card))) return null;
  const c = JSON.parse(readFileSync(join(root, card), 'utf8'));
  const r = Object.fromEntries(['plateFacts', 'tempo', 'topFault'].filter(k => k in c).map(k => [k, c[k]]));
  if (isUntimed(c.tempo)) r.tempoText = c.plate?.tempo?.text ?? null;   // LIB-STRIP (D-STRIP-H6): untimed cards only
  if (isUntimed(c.tempo) && fallbackAIds().has(c.id)) r.tempoFallbackA = true;   // LIB-STRIP (D-STRIP-AFALL)
  return r;
}

/** D-LIB9-AUTHORQA: authoring-time QA of a row still in drawing or review. `authoring: true` returns the same candidate
 *  with exemptions [] and reads no pin; it is refused at stage approved-plate or shipped. The generator, LIB-4b's PQH rows
 *  and LIB-4c never pass it. */
export const AUTHORING_REFUSED = ['approved-plate', 'shipped'];
/** The How-to source of a row in the injected `all`: registry sourceOf's rule for a library row, applied to `all`.
 *  (registry.mjs is an input of every generated file, so it is not edited: D-LIB9-AUTHORQA asks for an `all` parameter
 *  on sourceOf; this keeps generate --check unchanged: ruling Q-A, #245 comment 6242372604.) */
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
  const found = extractPlates(platesHtml).find(p => p.chromeId === row.chromeId);
  if (!found) fail(row, `card-${row.chromeId} is not in its plates page`);
  const plate = plateZooms(found);   // LIB-ZOOM: plate-scale checks read the svg without its zoom circle (plate.zoom)
  if (!row.view) fail(row, 'no census view (batch row field `view`)');
  if (typeof row.censusRef !== 'string' || !/^[0-9a-f]{7,40}$/.test(row.censusRef)) fail(row, 'its batch file records no census source (`censusRef`)');
  for (const f of [`tools/plates/${row.src}`, howtoOf(id, root, all)]) if (!existsSync(join(root, f))) fail(row, `no source file ${f}`);
  const spec = (await import(pathToFileURL(join(root, 'tools/plates', row.src)).href)).default;
  const howto = (await import(pathToFileURL(join(root, howtoOf(id, root, all))).href)).default;
  let derivation = null;
  if (row.mode === 'D' || row.mode === 'T') {
    const parent = all.find(r => r.id === row.parent);
    if (!parent) fail(row, `parent ${row.parent} has no registry row`);
    const tpl = row.mode === 'T' ? join(root, 'tools/plates/library/templates', `${row.template}.mjs`) : null;
    if (tpl && (typeof row.template !== 'string' || !TEMPLATE_NAME.test(row.template) || !existsSync(tpl))) fail(row, `template ${JSON.stringify(row.template)} names no tools/plates/library/templates/<name>.mjs`);
    const entry = parentEntry(parent, root);
    const parentKey = parent.mode === 'golden' ? specIdOf(parent) : cardIdOf(parent);
    derivation = {
      params: row.params, schema: PARAMS, parentFragments: entry.fragments,
      rebuildParent: async () => {
        const { html } = await buildPlatesPage(await groupsConfig({ groups: [{ id: 'parent', title: 'Parent', ids: [parent.id] }] }, all, `${row.id}'s parent`));
        const p = extractPlates(html.toString('utf8')).find(x => x.chromeId === parent.chromeId);
        return p ? fragmentsOf(p) : null;
      },
      family: row.mode === 'T' ? row.template : `D:${parent.id}`,
      rebuildChild: async obj => {
        if (tpl) return plateAlone(id, all, `${id}'s child`, `import { make } from ${href(tpl)};\nimport { facts } from ${href(join(root, 'tools/plates', row.src))};\nexport default make(${JSON.stringify(row.params)}, facts);\n`, cardIdOf(row));
        const mirror = parent.mode === 'golden' ? makeMirror() : null;
        const src = mirror ? join(mirror, 'exercises', `${parentKey}.mjs`) : join(root, 'tools/plates', parent.src);
        return plateAlone(id, all, `${id}'s child`, `import parent from ${href(src)};\nimport { derive } from ${href(fileURLToPath(new URL('./derive.mjs', import.meta.url)))};\nexport default derive(parent, ${JSON.stringify(row.params)}, ${JSON.stringify(obj)});\n`, cardIdOf(row), { mirror });
      },
      ...(tpl ? { rebuildTemplateParent: () => plateAlone(parent.id, all, `${id}'s parent through ${row.template}`, `import { make, parentParams, parentFacts } from ${href(tpl)};\nexport default make(parentParams, parentFacts);\n`, parentKey) } : {}),
    };
  }
  return {
    id, chromeId: row.chromeId, mode: row.mode, spec, freshSpec: async () => (await import(`${pathToFileURL(join(root, 'tools/plates', row.src)).href}?h7=${++fresh}`)).default, rebuild: () => plateAlone(id, all, `${id} alone`).then(f => JSON.stringify(f)), plate, article: articlesOf(platesHtml).get(row.chromeId),
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
