// LIB-6-PM PM-A6 (D-LIB6PM-L0): the L0-lib set of a pinned row whose batch has a back-flagged sheet holds the back box's
// inputs (back-box.mjs, every repo module it imports statically, docs/research/howto/shared/back-pain-box.json), because
// the layers page loads back-box.mjs by URL only then. On LIB-2b's fixtureTree, with tests/howto/fixtures/lib5/
// back-page.mjs applied before pinTree, and on E1's unflagged fixtureTree, which lists none of them.
import { spawn } from 'node:child_process';
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const tmps: string[] = [];
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });
const at = (cwd: string, code: string) => new Promise<any>((resolve, reject) => {
  const env = Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST'));
  const c = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd, env });
  let out = '';
  c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
  c.on('close', () => { const line = out.split('\n').find(l => l.startsWith('@@')); if (line) resolve(JSON.parse(line.slice(2))); else reject(new Error(out)); });
});
const pin = (tree: string) => at(tree, "import { manifestOf, manifestText, MANIFEST } from './tools/plates/library/ci/manifest.mjs'; import { writeFileSync } from 'node:fs'; const m = await manifestOf(); writeFileSync(MANIFEST, manifestText(m)); console.log('@@' + JSON.stringify(m));");
const problemsIn = (tree: string) => at(tree, "import { manifestProblems } from './tools/plates/library/ci/manifest.mjs'; console.log('@@' + JSON.stringify(await manifestProblems()));");
const closureOfBox = (tree: string) => at(tree, "import { importClosure, BACK_BOX } from './tools/plates/library/ci/manifest.mjs'; console.log('@@' + JSON.stringify(await importClosure([BACK_BOX])));");
/** Repo-relative paths of the modules the patched layers page loads by URL (build-layers-page.mjs's *_URL exports). */
const byUrl = (tree: string) => at(tree, "import * as B from './tools/plates/library/build-layers-page.mjs'; console.log('@@' + JSON.stringify(Object.entries(B).filter(([k, v]) => k.endsWith('_URL') && typeof v === 'string').map(([k, v]) => [k, v])));")
  .then((e: [string, string][]) => Object.fromEntries(e.map(([k, v]) => [k, relative(tree, fileURLToPath(v)).split('\\').join('/')])));

const BOX = 'tools/plates/library/shared/back-box.mjs', RESEARCH = 'docs/research/howto/shared/back-pain-box.json';

describe('LIB-6-PM L0-lib back line (D-LIB6PM-L0)', { timeout: 300_000 }, () => {
  let F: any, B: any, flagged = '', plain = '', MF: any, MP: any;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
    B = await import(/* @vite-ignore */ new URL('./fixtures/lib5/back-page.mjs', import.meta.url).href);
    flagged = F.stageTree(); tmps.push(flagged);
    B.toBackPage(flagged, F.HOWTO);
    F.pinTree(flagged);
    plain = F.fixtureTree(); tmps.push(plain);
    [MF, MP] = await Promise.all([pin(flagged), pin(plain)]);
  }, 300_000);

  it('a pinned row in a back-flagged batch lists back-box.mjs, its static imports and back-pain-box.json', async () => {
    const files = Object.keys(MF.rows[F.ID].files), box = await closureOfBox(flagged);
    expect(box).toContain(BOX);
    for (const p of [...box, RESEARCH]) expect(files).toContain(p);
    expect(await problemsIn(flagged)).toEqual([]);
  });

  it('E1\'s unflagged batch lists none of them', async () => {
    const files = Object.keys(MP.rows[F.ID].files);
    for (const p of [...await closureOfBox(plain), RESEARCH]) expect(files).not.toContain(p);
    expect(await problemsIn(plain)).toEqual([]);
  });

  it('every module the patched page loads by URL is in the row\'s set: the builders for every row, back-box.mjs only where the batch is flagged', async () => {
    const urls = await byUrl(flagged), { BACK_BOX_URL, ...always } = urls;
    expect(BACK_BOX_URL).toBe(BOX);
    expect(Object.keys(always).sort()).toEqual(['GOLDEN_B_OPTIONS_URL', 'REGION_FIX_URL', 'RENDERER_URL']);
    const optionsModule = JSON.parse(readFileSync(join(plain, F.PAGES.layersConfig), 'utf8')).optionsModule;
    for (const M of [MF, MP]) for (const p of [always.RENDERER_URL, always.REGION_FIX_URL, optionsModule]) expect(Object.keys(M.rows[F.ID].files)).toContain(p);
    expect(Object.keys(MF.rows[F.ID].files)).toContain(BACK_BOX_URL);
    expect(Object.keys(MP.rows[F.ID].files)).not.toContain(BACK_BOX_URL);
  });

  it('mutation: one byte of the tree\'s back-pain-box.json is red in C0, naming the file', async () => {
    const f = join(flagged, RESEARCH), s = readFileSync(f, 'utf8');
    writeFileSync(f, `${s} `);
    try { expect((await problemsIn(flagged)).join('\n')).toMatch(/docs\/research\/howto\/shared\/back-pain-box\.json sha256/); } finally { writeFileSync(f, s); }
    expect(await problemsIn(flagged)).toEqual([]);
  });
});
