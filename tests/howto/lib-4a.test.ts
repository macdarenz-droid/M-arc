// LIB-4a (card LIB-4a; D-LIB4-CTRL, D-LIB4-A9, D-LIB4-A4, D-SUP-ERRLIST, D-LIB4-FIXTURE): the existing checks at scale.
//   A1: in a write-ids copy at 153 shipped ids the copy's harness has no library control (null) and HT_ORDER is the 8
//       and the custom exercise; an empty exercises.json still throws.
//   A2: the tripwire, null <=> every exercises.json id ships, at the 8 (false/false) and at 153 (true/true).
//   A4/A5: the exact chunk sets of HT-2 A9 and HT-10 A4 (tools/plates/library/chunk-set.mjs) and their mutations.
//   A6: the gate's error list prints every item.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../..', import.meta.url).pathname;
const exerciseIds = (root: string) => (JSON.parse(readFileSync(join(root, 'src/data/exercises.json'), 'utf8')) as { id: string }[]).map(e => e.id);
/** The tripwire's two sides for one tree: [the control is null, every exercises.json id ships]. */
async function tripwire(root: string, tag: string): Promise<[boolean, boolean]> {
  const h = await import(/* @vite-ignore */ `${new URL(`file://${join(root, 'tools/plates/fidelity/harness.mjs')}`).href}?${tag}`);
  const reg = await import(/* @vite-ignore */ `${new URL(`file://${join(root, 'tools/plates/library/registry.mjs')}`).href}?${tag}`);
  const shipped = new Set(reg.shippedIds(reg.rows(root)));
  return [h.firstWithoutHowTo() === null, exerciseIds(root).every(id => shipped.has(id))];
}

describe('A1/A2: the no-How-to control at full coverage (D-LIB4-CTRL)', () => {
  let copy: { root: string; ids: string[] } | null = null;
  beforeAll(async () => {
    const w = await import(/* @vite-ignore */ url('tools/plates/library/scale/write-ids.mjs'));
    copy = await w.writeIds(ROOT, 153);
  }, 240_000);
  afterAll(() => { if (copy) rmSync(copy.root, { recursive: true, force: true }); });

  it('A2 at the 8: the control exists and not every id ships (false/false)', async () => {
    expect(await tripwire(ROOT, 'eight')).toEqual([false, false]);
  });
  it('A1 + A2 at 153: firstWithoutHowTo() is null, HT_ORDER is the 8 then the custom exercise, and every id ships (true/true)', async () => {
    const root = copy!.root;
    expect(copy!.ids).toHaveLength(153);
    expect(await tripwire(root, 'full')).toEqual([true, true]);
    const h = await import(/* @vite-ignore */ `${new URL(`file://${join(root, 'tools/plates/fidelity/harness.mjs')}`).href}?full`);
    expect(h.HT_NO_HOWTO).toBeNull();
    expect(h.HT_ORDER).toEqual([...h.HT_PLATES.map((p: string[]) => p[1]), h.HT_CUSTOM.id]);
    // the copy is whole: the Node twin, the app's ids.ts and loaders.ts agree on 153
    const node = await import(/* @vite-ignore */ `${new URL(`file://${join(root, 'tools/plates/library/ids-node.mjs')}`).href}?full`);
    expect(exerciseIds(root).filter(id => node.hasHowTo(id))).toHaveLength(153);
    const loaders = readFileSync(join(root, 'src/howto/generated/loaders.ts'), 'utf8');
    expect(loaders.match(/^ {2}lib_\w+: \(\) => import\('\.\/ht-[a-z0-9-]+'\),$/gm)).toHaveLength(153);
    expect(loaders).toContain("import('./handpair-");
    expect(JSON.parse(readFileSync(join(root, 'tests/howto/budgets.json'), 'utf8')).perId[0].n).toBe(153);
  });
  it('A1: an empty exercises.json still throws at import', async () => {
    const root = copy!.root, f = join(root, 'src/data/exercises.json'), keep = readFileSync(f, 'utf8');
    writeFileSync(f, '[]');
    try {
      await expect(import(/* @vite-ignore */ `${new URL(`file://${join(root, 'tools/plates/fidelity/harness.mjs')}`).href}?empty`)).rejects.toThrow(/has no ids/);
    } finally { writeFileSync(f, keep); }
  });
});

describe('A4: HT-2 A9\'s exact ht- set (D-LIB4-A9)', () => {
  let cs: any, rows: { id: string; slug: string }[], files: string[];
  beforeAll(async () => {
    cs = await import(/* @vite-ignore */ url('tools/plates/library/chunk-set.mjs'));
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    rows = reg.rows().filter((r: any) => reg.shippedIds().includes(r.id));
    files = rows.map((r, i) => `ht-${r.slug}-${String(i).padStart(8, 'A')}.js`).concat(['index-ABCDEFGH.js', 'loaders-ABCDEFGH.js', 'handpair-x-ABCDEFGH.js']);
  });
  it('one anchored chunk per shipped row passes', () => {
    expect(rows).toHaveLength(8);
    expect(cs.htChunkProblems(files, rows)).toEqual([]);
  });
  it('mutations: a stray chunk, a row with no chunk, a prefix-credited stray, two rows with one slug, a bad slug, an ht- css file: each red', () => {
    expect(cs.htChunkProblems([...files, 'ht-zzz-ABCDEFGH.js'], rows).join()).toMatch(/unexpected How-to chunk ht-zzz-ABCDEFGH\.js/);
    expect(cs.htChunkProblems(files.filter(f => !f.startsWith('ht-pull-up-')), rows).join()).toMatch(/lib_pull_up: expected one ht-pull-up-\*\.js chunk, found none/);
    const prefix = files.filter(f => !f.startsWith('ht-leg-press-')).concat('ht-leg-press-calf-raise-ABCDEFGH.js');
    const p = cs.htChunkProblems(prefix, rows).join();
    expect(p).toMatch(/lib_leg_press: expected one ht-leg-press-\*\.js chunk, found none/);
    expect(p).toMatch(/unexpected How-to chunk ht-leg-press-calf-raise-ABCDEFGH\.js/);
    expect(cs.htChunkProblems(files, [...rows, { id: 'lib_x', slug: rows[0].slug }]).join()).toMatch(/slug dumbbell-lateral-raise is also lib_dumbbell_lateral_raise's/);
    expect(cs.htChunkProblems(files, [...rows, { id: 'lib_y', slug: 'Bad_Slug' }]).join()).toMatch(/lib_y: slug "Bad_Slug" is not/);
    expect(cs.htChunkProblems([...files, 'ht-pull-up-ABCDEFGH.css'], rows).join()).toMatch(/unexpected How-to file ht-pull-up-ABCDEFGH\.css/);
    expect(cs.htChunkProblems([...files, `ht-${rows[0].slug}-ZZZZZZZZ.js`], rows).join()).toMatch(/expected one ht-dumbbell-lateral-raise-\*\.js chunk, found ht-/);
  });
  it('the old prefix filter is the hole this closes: it credits ht-leg-press-calf-raise-* to leg press', () => {
    const old = (fs: string[]) => fs.filter(f => /^ht-/.test(f) && !rows.some(r => f.startsWith(`ht-${r.slug}-`)));
    expect(old([...files, 'ht-leg-press-calf-raise-ABCDEFGH.js'])).toEqual([]);
    expect(cs.htChunkProblems([...files, 'ht-leg-press-calf-raise-ABCDEFGH.js'], rows)).not.toEqual([]);
  });
});

describe('A5: HT-10 A4\'s exact hand- set (D-LIB4-A4 b)', () => {
  let cs: any, chrome: string[], files: string[];
  beforeAll(async () => {
    cs = await import(/* @vite-ignore */ url('tools/plates/library/chunk-set.mjs'));
    chrome = Object.values(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8'))).map((r: any) => r.chromeId);
    files = chrome.map(c => `hand-${c}-ABCDEFGH.js`).concat(['handpair-pec-fly-ABCDEFGH.js', 'ht-x-ABCDEFGH.js']);
  });
  it('one anchored hand- chunk per chromeId of the 8 passes; handpair- is not hand-', () => {
    expect(chrome).toHaveLength(8);
    expect(cs.handChunkProblems(files, chrome)).toEqual([]);
  });
  it('mutations: A7\'s prefix case hand-leg-press-x-*, a missing hand chunk, a duplicate, a hand- css file: each red', () => {
    expect(cs.handChunkProblems([...files, 'hand-leg-press-x-ABCDEFGH.js'], chrome).join()).toMatch(/unexpected hand chunk hand-leg-press-x-ABCDEFGH\.js/);
    expect(cs.handChunkProblems(files.filter(f => !f.startsWith('hand-pull-up-')), chrome).join()).toMatch(/pull-up: expected one hand-pull-up-\*\.js chunk, found none/);
    expect(cs.handChunkProblems([...files, 'hand-pull-up-ZZZZZZZZ.js'], chrome).join()).toMatch(/pull-up: expected one hand-pull-up-\*\.js chunk, found hand-pull-up-/);
    expect(cs.handChunkProblems([...files, 'hand-pull-up-ABCDEFGH.css'], chrome).join()).toMatch(/unexpected hand file/);
  });
});

describe('A6: the error list is complete (D-SUP-ERRLIST)', () => {
  it('155 errors print a count line and 155 numbered lines; [] prints nothing', async () => {
    const { formatErrors } = await import(/* @vite-ignore */ url('scripts/error-list.mjs'));
    const errs = Array.from({ length: 155 }, (_, i) => `e${i}`);
    const out = formatErrors(errs);
    expect(out).toHaveLength(156);
    expect(out[0]).toBe('Page errors (155):');
    expect(out[1]).toBe('[1/155] e0');
    expect(out[155]).toBe('[155/155] e154');
    expect(formatErrors([])).toEqual([]);
  });
});

describe('D-LIB4-FIXTURE: write-ids re-sets the copy\'s budgets at n by LIB-2\'s rule (L2-A23)', () => {
  it('the How-to total and the loaders perId follow the per-id rule; at 8 they equal the committed file', async () => {
    const w = await import(/* @vite-ignore */ url('tools/plates/library/scale/write-ids.mjs'));
    const { totalCeiling } = await import(/* @vite-ignore */ url('tools/plates/library/budgets/total.mjs'));
    const src = readFileSync('tests/howto/budgets.json', 'utf8');
    expect(JSON.parse(w.budgetsAt(src, 8))).toEqual(JSON.parse(src));
    const b = JSON.parse(w.budgetsAt(src, 153)), t = b.totals.find((x: any) => x.chunk === 'How-to total');
    expect(t.rawMax).toBe(totalCeiling(t.measuredRaw, 153));
    expect(t.gzMax).toBe(totalCeiling(t.measuredGz, 153));
    expect(b.perId[0]).toMatchObject({ n: 153, rawMax: totalCeiling(b.perId[0].measuredRaw, 153), gzMax: totalCeiling(b.perId[0].measuredGz, 153) });
  });
});
