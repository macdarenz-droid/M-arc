// LIB-4b B5 fixture (D-LIB4-FIXTURE, lib4-cards 11.1 items 3-5 and 14): three source-level scratch library ids built
// IN PLACE in a scratch tree (a worktree with LIB-6, #181, merged; never pushed, never merged). It generalises LIB-2b's
// one-id fixture (tests/howto/fixtures/lib2b/fixture.mjs) to a batch of ids and reuses its `node` runner.
//   - each id copies one of the 8's plate spec and How-to source from the pool {lat pulldown, seated cable row, leg press,
//     machine chest press} (item 5: no inherited Right override or exemption), with every relative import re-pointed at
//     its original target, the How-to's id and research card swapped, and the spec's id and name swapped (D-LIB4b-POSES:
//     a library spec.id is none of the 8's);
//   - one scratch batch file (stage shipped, view, censusRef, pages), its plates and layers configs;
//   - the batch layers page built by LIB-6's builder through LIB-2b's layersSpecOf (`page`);
//   - the batch golden file pinned by appendEntry over the pages built in the tree, a scratch research card per id in
//     LIB-3's shape (plateFacts measured from the clone's own engine report, topFault = its selected mistake tell; item 3,
//     marked scratch) and a pair loader with one key per id, each panel cut from that id's own block of the batch page
//     (item 14: separate keys; the shared-key proof is LIB-7's) (`pin`);
//   - after `vite build`, budgets.json entries for each id's ht-, posture- and feel- chunk at measured + 10 % (item 5,
//     D-LIB4b-SIZE; scratch tree only) (`budgets`);
//   - the runner's --pages file (`pages`).
// CLI (from the repo whose fixture.mjs is run; <tree> is the scratch tree):
//   node tools/plates/library/fidelity/fixture.mjs <tree> stage|page|pin|budgets|pages|all
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';
import { node } from '../../../../tests/howto/fixtures/lib2b/fixture.mjs';

/** The scratch ids: target library id (in exercises.json, no How-to on main), the 8's source it copies, its pair key. */
export const SCRATCH = [
  { id: 'lib_underhand_lat_pulldown', from: 'lat_pulldown', key: 'lib4b-scratch-a' },
  { id: 'lib_chest_supported_row', from: 'seated_cable_row', key: 'lib4b-scratch-b' },
  { id: 'lib_cable_chest_press', from: 'machine_chest_press', key: 'lib4b-scratch-c' },
];
export const POOL = ['lat_pulldown', 'seated_cable_row', 'leg_press', 'machine_chest_press'];
/**
 * Copy edits on a clone's spec, each [from, to] applied exactly once. The 8's copy predates LIB-3's PQ-H8 copy rules
 * (approved mode); a library row is held to them, so a verbatim clone of lat_pulldown or seated_cable_row is refused by
 * the generator's node-half gate (PQ-H8: a 16-word cue; a semicolon). The smallest edits that meet the rule, recorded
 * here; no check is changed. (leg_press needs three semicolon edits and is not used.)
 */
export const COPY_EDITS = {
  lat_pulldown: [["cue: 'Lean back slightly and pull the bar past the face to the top of the chest.'", "cue: 'Lean back slightly and pull the bar past the face to the chest.'"]],
  seated_cable_row: [["cue: 'Sit tall; no rocking, the torso finishes upright.'", "cue: 'Sit tall. No rocking, the torso finishes upright.'"]],
  machine_chest_press: [],
};
export const BATCH = 'tools/plates/library/batches/zz-lib4b.json', BATCH_GOLDEN = 'tests/howto/golden/library/zz-lib4b.json';
export const PAGES = { plates: 'tools/plates/library/pages/zz-lib4b.json', layers: 'tests/howto/golden/library/zz-lib4b.layers.html', layersConfig: 'tools/plates/library/pages/zz-lib4b.layers.json' };
export const OPTIONS = 'tools/plates/library/render/closeups-8.mjs';
export const OUT = 'tests/howto/fixtures/lib4b';   // scratch tree only: the plates page and --pages file the runner reads
export const SET_BY = 'LIB-4b B5 scratch';

const card = s => s.id.replace(/^lib_/, ''), chrome = s => card(s).replace(/_/g, '-');
export const paths = s => ({ spec: `tools/plates/library/specs/${card(s)}.mjs`, howto: `tools/plates/library/howto/${s.id}.howto.mjs`, research: `${OUT}/research/${s.id}.json`, chromeId: chrome(s), card: card(s) });
const put = (root, p, text) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), text); };
const json = v => `${JSON.stringify(v, null, 2)}\n`;
const once = (text, from, to, what) => {
  const n = text.split(from).length - 1;
  if (n !== 1) throw new Error(`fixture: expected one ${what} (${from}), found ${n}`);
  return text.replace(from, to);
};
/** Re-points every relative specifier of `text` (read from `from`, written to `to`, both repo-relative). */
const repoint = (text, from, to, swap = {}) => text.replace(/(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"]+)\2/g, (_, pre, q, sp) => {
  const target = posix.join(posix.dirname(from), sp), dest = swap[target] ?? target;
  let rel = posix.relative(posix.dirname(to), dest);
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return `${pre}${q}${rel}${q}`;
});

/** { spec, howto }: one clone's two source texts (deterministic), from `src`'s sources of the 8. */
export function transformSources(s, src) {
  if (!POOL.includes(s.from)) throw new Error(`fixture: ${s.from} is not in the B5 pool`);
  const P = paths(s), SRC_SPEC = `tools/plates/layers/exercises/${s.from}.mjs`, SRC_HOWTO = `tools/plates/layers/exercises/${s.from}.howto.mjs`;
  const ex = JSON.parse(readFileSync(join(src, 'src/data/exercises.json'), 'utf8'));
  const name = ex.find(e => e.id === s.id)?.name;
  if (!name) throw new Error(`fixture: ${s.id} is not in src/data/exercises.json`);
  let spec = repoint(readFileSync(join(src, SRC_SPEC), 'utf8'), SRC_SPEC, P.spec);
  const idLine = spec.match(new RegExp(`\\bid: '${s.from}', name: '[^'\\n]*'`, 'g')) ?? [];
  if (idLine.length !== 1) throw new Error(`fixture: expected one spec id line in ${SRC_SPEC}, found ${idLine.length}`);
  spec = spec.replace(idLine[0], `id: '${P.card}', name: '${name}'`);
  for (const [a, b] of COPY_EDITS[s.from] ?? []) spec = once(spec, a, b, `copy edit in ${SRC_SPEC}`);
  let howto = repoint(readFileSync(join(src, SRC_HOWTO), 'utf8'), SRC_HOWTO, P.howto, { [SRC_SPEC]: P.spec });
  howto = once(howto, `id: 'lib_${s.from}'`, `id: '${s.id}'`, `How-to id line in ${SRC_HOWTO}`);
  howto = once(howto, `research: { card: 'grip/research/${s.from}.json', rev: 1 }`, `research: { card: '${P.research}', rev: 1 }`, `research line in ${SRC_HOWTO}`);
  return { spec, howto };
}

export const batchRow = s => ({ src: `library/specs/${card(s)}.mjs`, slug: chrome(s), prefix: chrome(s), chromeId: chrome(s), mode: 'H', stage: 'shipped', view: 'side', sources: [`Scratch fixture (LIB-4b B5): golden B ${s.from} sources`] });
const ids = scratch => scratch.map(s => s.id);

/** Writes the sources, the batch file and the two page configs into `root`. */
export function stage(root, { scratch = SCRATCH, src = root } = {}) {
  for (const s of scratch) { const t = transformSources(s, src), P = paths(s); put(root, P.spec, t.spec); put(root, P.howto, t.howto); }
  put(root, BATCH, json({ batch: 'LB-LIB4B', censusRef: '48153c4', pages: PAGES, rows: Object.fromEntries(scratch.map(s => [s.id, batchRow(s)])) }));
  put(root, PAGES.plates, json({ groups: [{ id: 'scratch', title: 'Scratch', ids: ids(scratch) }] }));
  put(root, PAGES.layersConfig, json({ groups: [{ id: 'scratch', title: 'Scratch', ids: ids(scratch) }], optionsModule: OPTIONS, closeups: Object.fromEntries(scratch.map(s => [s.id, { optionsKey: s.from }])), jump: null }));
}

/** Builds the batch layers page with LIB-6's builder (needs #181 in `root`) through layersSpecOf; returns its bytes. */
export function page(root) {
  if (!existsSync(join(root, 'tools/plates/library/build-layers-page.mjs'))) throw new Error('fixture: LIB-6 (#181) is not in the scratch tree');
  return +node(root, `
    import { mkdtempSync, writeFileSync, mkdirSync } from 'node:fs';
    import { tmpdir } from 'node:os'; import { join, dirname } from 'node:path';
    import { layersSpecOf } from './tools/plates/library/layers-spec.mjs';
    import { buildLayersPage } from './tools/plates/library/build-layers-page.mjs';
    const spec = layersSpecOf(${JSON.stringify(BATCH)}, { stageDir: mkdtempSync(join(tmpdir(), 'lib4b-stage-')) });
    const html = await buildLayersPage(spec);
    mkdirSync(dirname(${JSON.stringify(PAGES.layers)}), { recursive: true });
    writeFileSync(${JSON.stringify(PAGES.layers)}, html);
    console.log(html.length);
  `).trim().split('\n').pop();
}

/** Pins the batch golden file, writes the scratch QA cards (unless card=false) and the pair loader. */
export function pin(root, { scratch = SCRATCH, card: withCard = true } = {}) {
  const out = node(root, `
    import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
    import { dirname } from 'node:path';
    import { buildPlatesPage } from './tools/plates/library/build-page.mjs';
    import { pageConfig } from './tools/plates/library/plates-page.mjs';
    import { appendEntry, extractPlates, fragmentsOf, prefixHash, makeMirror, sha256 } from './tools/plates/golden.mjs';
    import { loadEngine, dropMirror } from './tools/plates/library/qa/engine.mjs';
    const S = ${JSON.stringify(scratch.map(s => ({ id: s.id, chromeId: paths(s).chromeId, spec: paths(s).spec, src: batchRow(s).src })))};
    const { html } = await buildPlatesPage(await pageConfig(${JSON.stringify(PAGES.plates)}));
    mkdirSync(${JSON.stringify(OUT)}, { recursive: true });
    writeFileSync(${JSON.stringify(`${OUT}/zz-lib4b.plates.html`)}, html);
    const plates = extractPlates(html.toString('utf8')), layers = readFileSync(${JSON.stringify(PAGES.layers)});
    const golden = JSON.parse(readFileSync('tests/howto/golden/GOLDEN.json', 'utf8')).entries, index = golden.length - 1;
    const meta = { approvedBy: 'owner', date: '2026-10-17' };
    let e = [];
    e = appendEntry(e, { kind: 'page', pageSha256: sha256(html), bytes: html.length, ...meta });
    e = appendEntry(e, { kind: 'layers-page', pageSha256: sha256(layers), bytes: layers.length, ...meta });
    const mirror = makeMirror(), E = await loadEngine(mirror), facts = {};
    for (const s of S) {
      const p = plates.find(x => x.chromeId === s.chromeId);
      if (!p) throw new Error('fixture: no plate ' + s.chromeId + ' on the plates page');
      e = appendEntry(e, { kind: 'plate', id: s.id, src: s.src, slug: s.chromeId, prefix: p.prefix, chromeId: s.chromeId, fragments: fragmentsOf(p), ...meta });
      const spec = (await import('./' + s.spec)).default, rep = E.renderPlate(spec, { id: 'x-n' }).report;
      facts[s.id] = { angles: rep.angles, tempo: spec.tempo, topFault: p.mistake.firstKey };
    }
    dropMirror(mirror);
    mkdirSync(dirname(${JSON.stringify(BATCH_GOLDEN)}), { recursive: true });
    writeFileSync(${JSON.stringify(BATCH_GOLDEN)}, JSON.stringify({ base: { index, hash: prefixHash(golden, index) }, entries: e }, null, 2) + '\\n');
    console.log(JSON.stringify(facts));
  `);
  const facts = JSON.parse(out.trim().split('\n').pop());
  if (withCard) for (const s of scratch) {
    const m = facts[s.id], elbow = m.angles.end['elbow.r'];
    if (typeof elbow !== 'number') throw new Error(`fixture: ${s.id}: no end elbow.r angle in the clone's report (${JSON.stringify(m.angles.end)})`);
    put(root, paths(s).research, json({ $comment: 'LIB-4b B5 scratch QA card (D-LIB4-FIXTURE-3): measured from the clone\'s own engine report; never pinned or shipped.', plateFacts: [{ kind: 'angle', joint: 'elbow.r', pose: 'end', deg: elbow }], tempo: m.tempo, topFault: m.topFault }));
  }
  put(root, 'tools/plates/library/hands/pairs.mjs', `// LIB-4b B5 scratch pair loader (lib4-cards 11.1 items 4, 14): one key per scratch id, each panel that id's own hand
// close-up, cut from the batch's fixture layers page. Scratch tree only.
import { readFileSync } from 'node:fs';
import { divAt } from '../../gen/hands.mjs';
export const HAND_OF_ID = ${JSON.stringify(Object.fromEntries(scratch.map(s => [s.id, s.key])))};
const CHROME_OF_KEY = ${JSON.stringify(Object.fromEntries(scratch.map(s => [s.key, paths(s).chromeId])))};
export const inputsFor = () => ['${PAGES.layers}'];
export async function pairPanel(key) {
  const page = readFileSync(new URL('../../../../${PAGES.layers}', import.meta.url), 'utf8'), id = CHROME_OF_KEY[key];
  if (!id) throw new Error('pairs: unknown key ' + key);
  const open = '<div class="zx" id="' + id + '-zoom-hand" data-zoom="hand"', a = page.indexOf(open);
  if (a < 0) throw new Error('pairs: no hand close-up for ' + id);
  return divAt(page, a);
}
`);
  return facts;
}

/** After `vite build` in `root`: budgets.json entries for each id's ht-, posture- and feel- chunk at measured + 10 %. */
export function budgets(root, { scratch = SCRATCH } = {}) {
  const file = join(root, 'tests/howto/budgets.json'), B = JSON.parse(readFileSync(file, 'utf8')), assets = readdirSync(join(root, 'www/assets')), added = [];
  for (const s of scratch) for (const kind of ['ht', 'posture', 'feel']) {
    const prefix = `${kind}-${paths(s).chromeId}`, f = assets.filter(n => new RegExp(`^${prefix}-[\\w-]{8}\\.js$`).test(n));
    if (f.length > 1) throw new Error(`fixture: ${f.length} ${prefix} chunks`);
    if (!f.length) continue;
    const b = readFileSync(join(root, 'www/assets', f[0])), raw = b.length, gz = gzipSync(b).length;
    const entry = { chunk: `${prefix}-*.js`, rawMax: Math.ceil(raw * 1.1), gzMax: Math.ceil(gz * 1.1), measuredRaw: raw, measuredGz: gz, setBy: SET_BY, reason: 'scratch fixture id, measured + 10 % (lib4-cards 11.1 item 5); never merged' };
    B.budgets = B.budgets.filter(x => x.chunk !== entry.chunk).concat(entry);
    added.push(`${entry.chunk} ${raw}/${gz}`);
  }
  writeFileSync(file, json(B));
  return added;
}

/** The runner's --pages file: { id: { plates, layers } } (absolute paths in `root`). */
export function pagesFile(root, { scratch = SCRATCH } = {}) {
  const f = join(root, OUT, 'pages.json');
  put(root, `${OUT}/pages.json`, json(Object.fromEntries(scratch.map(s => [s.id, { plates: join(root, OUT, 'zz-lib4b.plates.html'), layers: join(root, PAGES.layers) }]))));
  return f;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [root, step = 'all'] = process.argv.slice(2);
  if (!root) throw new Error('usage: fixture.mjs <tree> stage|page|pin|budgets|pages|all');
  if (step === 'stage' || step === 'all') stage(root);
  if (step === 'page' || step === 'all') console.log('layers page bytes', page(root));
  if (step === 'pin' || step === 'all') console.log('facts', JSON.stringify(pin(root)));
  if (step === 'budgets') console.log('budgets', budgets(root));
  if (step === 'pages' || step === 'all') console.log('pages', pagesFile(root));
}
