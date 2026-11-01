// LIB-4d (card LIB-4d; D-LIB4d-READ, D-LIB4d-OWNROWS): the two helpers the scale fixes rest on.
//   R1: readHowTo returns what import() returns, every shipped id has its one loader line, and any other shape throws.
//   R2: ownRowsTree holds the 8 and no batch row: a plain copy when there is no batch file, else the batches, their
//       golden files, their pages and the files only they had are gone, and the rest is the generator's output for the 8.
import { appendFileSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { describe, expect, it, onTestFinished } from 'vitest';
import { ownRowsTreeInChild } from '../child-test';
import { readHowTo } from './generated-module';
import { SHIPPED } from './shipped-rows';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */

describe('LIB-4d R1: readHowTo', () => {
  it('deep-equals import() for each of the 8', async () => {
    for (const { id, slug } of SHIPPED.slice(0, 8)) {
      const m = (await import(/* @vite-ignore */ url(`src/howto/generated/ht-${slug}.ts`))).default;
      expect(readHowTo(slug), id).toEqual(m);
    }
  });
  it('every shipped id has exactly one loader line to its ht-<slug>, and readHowTo gives that id', () => {
    const loaders = readFileSync('src/howto/generated/loaders.ts', 'utf8').split('\n');
    expect(SHIPPED.length).toBeGreaterThanOrEqual(8);
    for (const { id, slug } of SHIPPED) {
      expect(loaders.filter(l => l.startsWith(`  ${id}: `)), id).toEqual([`  ${id}: () => import('./ht-${slug}'),`]);
      expect(readHowTo(slug).id, id).toBe(id);
    }
  });
  it('refuses a file with no header, an extra import line, an extra export line or no satisfies tail', () => {
    const root = mkdtempSync(join(tmpdir(), 'lib4d-')), text = readFileSync('src/howto/generated/ht-pull-up.ts', 'utf8');
    onTestFinished(() => rmSync(root, { recursive: true, force: true }));
    mkdirSync(join(root, 'src/howto/generated'), { recursive: true });
    const put = (slug: string, t: string) => { writeFileSync(join(root, `src/howto/generated/ht-${slug}.ts`), t); return () => readHowTo(slug, root); };
    const nl = text.indexOf('\n') + 1;
    expect(put('ok', text)().id).toBe('lib_pull_up');
    expect(put('no-header', text.slice(nl))).toThrow(/no GENERATED header/);
    expect(put('extra-import', text.replace("from '../types';\n", "from '../types';\nimport x from './x';\n"))).toThrow(/module shape/);
    expect(put('extra-export', text.replace('export default {\n', 'export default {\nexport const x = 1;\n'))).toThrow(/import or export line/);
    expect(put('no-tail', text.replace('} satisfies BuiltHowTo;\n', '};\n'))).toThrow(/module shape/);
  });
});

describe('LIB-4d R2: ownRowsTree', () => {
  const DIRS = ['tools/plates/library/batches', 'src/howto', 'src/howto/generated', 'src/slices/howto/css', 'tests/howto/golden/library', 'tools/plates/library/pages'];
  const list = (root: string, d: string) => (existsSync(join(root, d)) ? readdirSync(join(root, d)).sort() : []);
  const plant = (root: string, p: string, t: string) => { mkdirSync(dirname(join(root, p)), { recursive: true }); writeFileSync(join(root, p), t); };
  it('drops every batch row, its golden file, its pages and the files only it had; else it is the plain copy', async () => {
    const F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    const core = await import(/* @vite-ignore */ url('tools/plates/lib/inputs.mjs'));
    const trees: string[] = [];
    onTestFinished(() => { for (const t of trees) F.drop(t); });
    const eight = await ownRowsTreeInChild(); trees.push(eight);
    expect(list(eight, 'tools/plates/library/batches').filter(n => n.endsWith('.json'))).toEqual([]);
    const copy = await ownRowsTreeInChild({ src: eight }); trees.push(copy);
    for (const d of DIRS) expect(list(copy, d), d).toEqual(list(eight, d));
    const src = mkdtempSync(join(tmpdir(), 'lib4d-')); trees.push(src);
    cpSync(eight, src, { recursive: true, verbatimSymlinks: true });
    const pages = { plates: 'tools/plates/library/pages/lb-test.json', layers: 'tests/howto/golden/library/lb-test.layers.html', layersConfig: 'tools/plates/library/pages/lb-test.layers.json' };
    const lb = JSON.parse(readFileSync('tests/howto/fixtures/batches/lb-test.json', 'utf8'));
    plant(src, 'tools/plates/library/batches/lb-test.json', `${JSON.stringify({ ...lb, pages }, null, 2)}\n`);
    for (const p of Object.values(pages)) plant(src, p, '{}');
    plant(src, 'tests/howto/golden/library/lb-test.json', '{}');
    const stale = 'src/howto/generated/ht-zz-stale.ts';
    plant(src, stale, core.header(stale, ['tools/plates/gen/plates.mjs'], '0'.repeat(64)) + 'export default {};');
    appendFileSync(join(src, 'src/howto/ids.ts'), ' ');
    const own = await ownRowsTreeInChild({ src }); trees.push(own);
    for (const d of DIRS) expect(list(own, d), d).toEqual(list(eight, d));
    expect(readFileSync(join(own, 'src/howto/ids.ts'), 'utf8')).toBe(readFileSync(join(eight, 'src/howto/ids.ts'), 'utf8'));
  }, 300_000);
});
