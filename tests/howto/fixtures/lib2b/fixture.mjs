// LIB-2b fixture (D-LIB4-FIXTURE, D-LIB2b-FIXTURE, lib4-cards 11.1 items 3-4): one source-level scratch row,
// lib_cable_lateral_raise, in a temporary copy of the repo. Never pinned or shipped in the repo itself.
//   - transformSources(): golden B's pull-up spec and How-to with the id swapped and every relative import re-pointed at
//     its original target under tools/plates/layers/** (the clone's spec for the How-to's plate import). One
//     deterministic transform; provenance.json holds the sha256 of both outputs.
//   - the layers page (cable-lateral-raise.layers.html) was built by LIB-6's builder (#181) through layersSpecOf on a
//     scratch worktree (provenance.json: command, shas, node); here it is only copied.
//   - fixtureTree(): the temp tree: the sources, a batch file (stage shipped, view, censusRef, pages), the plates and
//     layers configs, the committed page, a scratch research card in LIB-3's shape (plateFacts measured from the clone's
//     own engine report, topFault = its selected mistake tell), a hand-pair loader whose panel is the clone's own hand
//     close-up cut from the page, and the batch golden file, pinned by appendEntry over the pages built in the tree.
import { spawnSync } from 'node:child_process';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, posix } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { markScratch, writeScratchStamps } from '../../../../tools/plates/library/research/stamps.mjs';

export const HERE = dirname(fileURLToPath(import.meta.url));
export const REPO = join(HERE, '..', '..', '..', '..');
export const ID = 'lib_cable_lateral_raise', CHROME = 'cable-lateral-raise', CARD = 'cable_lateral_raise', PAIR = 'lib2b-scratch';
export const SPEC = `tools/plates/library/specs/${CARD}.mjs`, HOWTO = `tools/plates/library/howto/${ID}.howto.mjs`;
export const BATCH = 'tools/plates/library/batches/zz-lib2b.json', BATCH_GOLDEN = 'tests/howto/golden/library/zz-lib2b.json';
export const PAGES = { plates: 'tools/plates/library/pages/zz-lib2b.json', layers: 'tests/howto/golden/library/zz-lib2b.layers.html', layersConfig: 'tools/plates/library/pages/zz-lib2b.layers.json' };
export const CARD_FILE = `tests/howto/fixtures/lib2b/research/${ID}.json`;
export const PAGE_FIXTURE = join(HERE, 'cable-lateral-raise.layers.html');
export const PROVENANCE = join(HERE, 'provenance.json');
/** LIB-6's options module (present only where #181 is merged) and the 8's options key the clone reuses. */
export const OPTIONS = 'tools/plates/library/render/closeups-8.mjs';

const SRC_SPEC = 'tools/plates/layers/exercises/pull_up.mjs', SRC_HOWTO = 'tools/plates/layers/exercises/pull_up.howto.mjs';
/** Re-points every relative specifier of `text` (read from `from`, written to `to`, both repo-relative). */
const repoint = (text, from, to, swap = {}) => text.replace(/(\bfrom\s*|\bimport\s*\(\s*|\bimport\s+)(['"])(\.\.?\/[^'"]+)\2/g, (_, pre, q, s) => {
  const target = posix.join(posix.dirname(from), s), dest = swap[target] ?? target;
  let rel = posix.relative(posix.dirname(to), dest);
  if (!rel.startsWith('.')) rel = `./${rel}`;
  return `${pre}${q}${rel}${q}`;
});
/** { spec, howto }: the clone's two source texts (deterministic). */
export function transformSources(root = REPO) {
  const spec = repoint(readFileSync(join(root, SRC_SPEC), 'utf8'), SRC_SPEC, SPEC);
  let howto = repoint(readFileSync(join(root, SRC_HOWTO), 'utf8'), SRC_HOWTO, HOWTO, { [SRC_SPEC]: SPEC });
  const n = howto.split("id: 'lib_pull_up'").length - 1;
  if (n !== 1) throw new Error(`fixture: expected one id line in ${SRC_HOWTO}, found ${n}`);
  howto = howto.replace("id: 'lib_pull_up'", `id: '${ID}'`).replace("research: { card: 'grip/research/pull_up.json', rev: 1 }", `research: { card: '${CARD_FILE}', rev: 1 }`);
  if (!howto.includes(CARD_FILE)) throw new Error('fixture: research card line not found');
  return { spec, howto };
}

export const BATCH_ROW = { src: `library/specs/${CARD}.mjs`, slug: CHROME, prefix: CHROME, chromeId: CHROME, mode: 'H', stage: 'shipped', view: 'side', sources: ['Scratch fixture (LIB-2b): golden B pull-up sources'] };
export const LAYERS_CONFIG = { groups: [{ id: 'scratch', title: 'Scratch', ids: [ID] }], optionsModule: OPTIONS, closeups: { [ID]: { optionsKey: 'pull_up' } }, jump: null };

const COPY = ['index.html', 'vite.config.ts', 'package.json', 'tsconfig.json', 'public', 'src', 'tools', 'tests/howto/golden', 'docs/research/howto'];
const put = (root, p, text) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), text); };
const json = v => `${JSON.stringify(v, null, 2)}\n`;

/** D-LIB4d-OWNROWS: a temp repo copy that holds the 8 and no batch row. With no batch .json file it is the plain copy;
 *  else each batch file, its batch golden file and its pages are removed, and the generated files are rewritten for the
 *  8 alone (stale ones removed), so no shipped batch row can collide with a fixture's own row. */
export function ownRowsTree({ src = REPO } = {}) {
  const root = mkdtempSync(join(tmpdir(), 'lib2b-'));
  for (const p of COPY) if (existsSync(join(src, p))) cpSync(join(src, p), join(root, p), { recursive: true });
  symlinkSync(join(src, 'node_modules'), join(root, 'node_modules'), 'dir');
  const dir = join(root, 'tools/plates/library/batches');
  const files = existsSync(dir) ? readdirSync(dir).filter(n => n.endsWith('.json')) : [];
  if (files.length === 0) return root;
  for (const n of files) {
    const b = JSON.parse(readFileSync(join(dir, n), 'utf8'));
    rmSync(join(dir, n), { force: true });
    rmSync(join(root, 'tests/howto/golden/library', n), { force: true });
    for (const p of Object.values(b.pages ?? {})) rmSync(join(root, p), { force: true });
  }
  node(root, `
    import { rmSync, writeFileSync } from 'node:fs';
    import { diff, render } from './tools/plates/generate.mjs';
    const out = await render();
    for (const b of diff(out)) if (b.why.startsWith('stale')) rmSync(b.path);
    for (const [p, { text }] of out) writeFileSync(p, text);
  `);
  return root;
}

/** A temp repo copy with the sources, configs and page, but no batch golden file and no research card yet. */
export function stageTree({ row = BATCH_ROW, page = readFileSync(PAGE_FIXTURE), src = REPO } = {}) {
  const root = ownRowsTree({ src });
  const { spec, howto } = transformSources(src);
  put(root, SPEC, spec); put(root, HOWTO, howto);
  put(root, BATCH, json({ batch: 'LB-LIB2B', censusRef: '48153c4', pages: PAGES, rows: { [ID]: row } }));
  put(root, PAGES.plates, json({ groups: [{ id: 'scratch', title: 'Scratch', ids: [ID] }] }));
  put(root, PAGES.layersConfig, json(LAYERS_CONFIG));
  if (page) put(root, PAGES.layers, page);
  markScratch(root);
  return root;
}

/** Runs a Node script in `root` (its own modules, so ROOT is the tree); returns stdout, or throws with stderr. */
export function node(root, code) {
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: root, encoding: 'utf8', maxBuffer: 1 << 26 });
  if (r.status !== 0) throw new Error(r.stderr || r.stdout);
  return r.stdout;
}

/** Writes the scratch QA card, the pair loader and the batch golden file into a staged tree (pins from its own builds). */
export function pinTree(root, { card = true } = {}) {
  const out = node(root, `
    import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
    import { dirname } from 'node:path';
    import { buildPlatesPage } from './tools/plates/library/build-page.mjs';
    import { pageConfig } from './tools/plates/library/plates-page.mjs';
    import { appendEntry, extractPlates, fragmentsOf, prefixHash, makeMirror, sha256 } from './tools/plates/golden.mjs';
    import { loadEngine, dropMirror } from './tools/plates/library/qa/engine.mjs';
    const { html } = await buildPlatesPage(await pageConfig(${JSON.stringify(PAGES.plates)}));
    const p = extractPlates(html.toString('utf8')).find(x => x.chromeId === ${JSON.stringify(CHROME)});
    const layers = readFileSync(${JSON.stringify(PAGES.layers)});
    const golden = JSON.parse(readFileSync('tests/howto/golden/GOLDEN.json', 'utf8')).entries, index = golden.length - 1;
    const meta = { approvedBy: 'owner', date: '2026-10-17' };
    let e = [];
    e = appendEntry(e, { kind: 'page', pageSha256: sha256(html), bytes: html.length, ...meta });
    e = appendEntry(e, { kind: 'layers-page', pageSha256: sha256(layers), bytes: layers.length, ...meta });
    e = appendEntry(e, { kind: 'plate', id: ${JSON.stringify(ID)}, src: ${JSON.stringify(BATCH_ROW.src)}, slug: ${JSON.stringify(CHROME)}, prefix: p.prefix, chromeId: ${JSON.stringify(CHROME)}, fragments: fragmentsOf(p), ...meta });
    mkdirSync(dirname(${JSON.stringify(BATCH_GOLDEN)}), { recursive: true });
    writeFileSync(${JSON.stringify(BATCH_GOLDEN)}, JSON.stringify({ base: { index, hash: prefixHash(golden, index) }, entries: e }, null, 2) + '\\n');
    const mirror = makeMirror(), E = await loadEngine(mirror);
    const spec = (await import('./${SPEC}')).default, rep = E.renderPlate(spec, { id: 'x-n' }).report;
    dropMirror(mirror);
    console.log(JSON.stringify({ angles: rep.angles, tempo: spec.tempo, topFault: p.mistake.firstKey }));
  `);
  const m = JSON.parse(out.trim().split('\n').pop());
  if (card) {
    const elbow = m.angles.end['elbow.r'];
    if (typeof elbow !== 'number') throw new Error(`fixture: no end elbow.r angle in the clone's report (${JSON.stringify(m.angles.end)})`);
    put(root, CARD_FILE, json({ $comment: 'LIB-2b scratch QA card (D-LIB4-FIXTURE-3): measured from the clone\'s own engine report; never pinned or shipped.', plateFacts: [{ kind: 'angle', joint: 'elbow.r', pose: 'end', deg: elbow }], tempo: m.tempo, topFault: m.topFault }));
  }
  const panelCode = `const page = readFileSync(new URL('../../../../${PAGES.layers}', import.meta.url), 'utf8');`;
  put(root, 'tools/plates/library/hands/pairs.mjs', `// LIB-2b scratch pair loader (lib4-cards 11.1 item 4): the clone's own hand close-up, cut from its fixture page.
import { readFileSync } from 'node:fs';
import { divAt } from '../../gen/hands.mjs';
export const HAND_OF_ID = { ${ID}: '${PAIR}' };
export const inputsFor = () => ['${PAGES.layers}'];
export async function pairPanel() {
  ${panelCode}
  const open = '<div class="zx" id="${CHROME}-zoom-hand" data-zoom="hand"', a = page.indexOf(open);
  if (a < 0) throw new Error('pairs: no hand close-up for ${CHROME}');
  return divAt(page, a);
}
`);
  writeScratchStamps(root, [ID]);
  return m;
}

/** stageTree + pinTree. */
export function fixtureTree(opts = {}) {
  const root = stageTree(opts);
  pinTree(root, opts);
  return root;
}
export const drop = root => rmSync(root, { recursive: true, force: true });
export const url = (root, p) => pathToFileURL(join(root, p)).href;
