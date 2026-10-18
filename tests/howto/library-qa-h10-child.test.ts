// LIB-3c 3c-A4 (D-LIB10-RANGES, D-LIB3c-SHARED) and 3c-A5 (D-LIB10-CHILDPROOF), on the real path (candidateOf ->
// runQa) for the LIB-2b fixture row turned into a D child of lib_pull_up, or a T child of a test template, in memory.
// Test-only templates, sources and family rows are written into the temp tree only. Nothing is written to rows.json,
// batches/, tests/howto/golden/ or the repo's param-ranges.json.
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const T = 300_000;
const REPO = new URL('../../', import.meta.url).pathname;
const LIB = 'tools/plates/library';
const RANGES = `${LIB}/qa/param-ranges.json`;
let F: any, root: string, cand: any, I: any, node: any, der: any, eng: any, golden: any, bp: any, pp: any, mirror: string, E: any, pins: any, base: any[], row: any, html: string;

const TEMPLATE = (name: string) => `// LIB-3c test-only template (temp tree only).
import base from '../specs/cable_lateral_raise.mjs';
export const ALT_TAIL = '';
export const parentParams = { 'bar.kind': 'straight' };
export const parentFacts = {};
export function make(params, facts) {
  const tail = params['bar.kind'] === 'ez' ? ' EZ bar (${name}).' : '';
  return { ...base, alt: base.alt + ALT_TAIL + tail, ...(facts && facts.callouts ? { callouts: facts.callouts } : {}) };
}
`;

beforeAll(async () => {
  F = await import(/* @vite-ignore */ new URL('./fixtures/lib2b/fixture.mjs', import.meta.url).href);
  root = F.fixtureTree();
  const im = (p: string) => import(/* @vite-ignore */ F.url(root, p));
  let bg: any, reg: any;
  [cand, bg, reg, der, golden, eng, I, node, bp, pp] = await Promise.all([`${LIB}/candidate.mjs`, `${LIB}/batch-golden.mjs`, `${LIB}/registry.mjs`,
    `${LIB}/derive.mjs`, 'tools/plates/golden.mjs', `${LIB}/qa/engine.mjs`, `${LIB}/qa/index.mjs`, `${LIB}/qa/node.mjs`, `${LIB}/build-page.mjs`, `${LIB}/plates-page.mjs`].map(im));
  mirror = golden.makeMirror();
  E = await eng.loadEngine(mirror);
  pins = I.loadPins();
  base = reg.rows();
  row = base.find((r: any) => r.id === F.ID);
  html = await bg.platesPage(row, base);
  mkdirSync(join(root, LIB, 'templates'), { recursive: true });
  for (const n of ['BENCH', 'SEATPRESS']) writeFileSync(join(root, LIB, 'templates', `${n}.mjs`), TEMPLATE(n));
}, T);
afterAll(() => { if (mirror) eng.dropMirror(mirror); if (root) F.drop(root); });

const fam = (params: Record<string, unknown[]>, ruling = 'D-LIB3C-TEST') => ({ ruling, params: Object.fromEntries(Object.entries(params).map(([k, range]) => [k, { range, basis: range.map((_, i) => `test basis ${i}`) }])) });
const writeRanges = (families: unknown) => writeFileSync(join(root, RANGES), `${JSON.stringify({ $comment: 'LIB-3c test rows (temp tree only)', families }, null, 2)}\n`);
const loader = () => import(/* @vite-ignore */ F.url(root, `${LIB}/qa/param-ranges.mjs`));
/** A source in the tree's specs/ (relative imports resolve beside the fixture spec); returns the row's `src`. */
const source = (name: string, text: string) => { writeFileSync(join(root, LIB, 'specs', `c_${name}.mjs`), text); return `library/specs/c_${name}.mjs`; };
const tSource = (name: string, tpl: string, params: unknown, tail = 'export default make(PARAMS, facts);', facts = '{}') =>
  source(name, `import { make } from '../templates/${tpl}.mjs';\nconst PARAMS = ${JSON.stringify(params)};\nexport const facts = ${facts};\n${tail}\n`);
const dAll = (params: unknown, extra: any = {}) => base.map(r => (r.id === F.ID ? { ...row, mode: 'D', parent: 'lib_pull_up', params, ...extra } : r));
const tAll = (params: unknown, src: string, template: unknown = 'BENCH') => base.map(r => (r.id === F.ID ? { ...row, mode: 'T', parent: 'lib_pull_up', template, params, src } : r));
/** The page built from `all` (the row's own source), as its batch page would be. */
const pageFor = async (all: any[]) => (await bp.buildPlatesPage(await pp.groupsConfig({ groups: [{ id: 'c', title: 'C', ids: [F.ID] }] }, all, 'test page'))).html.toString('utf8');
const keys = (r: any) => I.HARD.flatMap((h: string) => r.hard[h].problems.filter((p: any) => p.key !== 'browser:not-run').map((p: any) => `${h} ${p.key}`));
async function qa(all: any[], ctx: any = {}, edit: (c: any) => void = () => {}, page = html) {
  const c = await cand.candidateOf(F.ID, { platesHtml: page, engine: E, all });
  edit(c);
  const report = cand.nodeHalf(await I.runQa(c, { engine: E, ...ctx }));
  return { report, keys: keys(report), h10: report.hard['PQ-H10'].problems.map((p: any) => p.key) };
}

describe('LIB-3c 3c-A4 PARAMS ranges (D-LIB10-RANGES, D-LIB3c-SHARED)', { timeout: T }, () => {
  it('premise: envelope.json names no PARAMS key', () => {
    expect(Object.keys(der.PARAMS).filter(k => k in pins.envelope)).toEqual([]);
  });
  it('a value outside its family\'s range gives H10.value; a value inside gives no H10 problem (pinned envelope)', async () => {
    const L = await loader();
    writeRanges({ 'D:lib_pull_up': fam({ 'camera.maxScale': [0.9, 1.1] }) });
    const ok = await qa(dAll({ 'camera.maxScale': 1 }));
    expect([ok.keys, ok.report.ok]).toEqual([[], true]);
    const bad = await qa(dAll({ 'camera.maxScale': 99 }));
    expect(bad.keys).toEqual(['PQ-H10 H10.value:camera.maxScale']);
    expect(bad.report.hard['PQ-H10'].problems[0].text).toBe(der.paramProblems({ 'camera.maxScale': 99 }, { 'camera.maxScale': [0.9, 1.1] })[0]);
    expect(typeof L.loadRanges).toBe('function');
  });
  it('a value ruled only for SEATPRESS, used on a BENCH row, is red', async () => {
    writeRanges({ SEATPRESS: fam({ 'camera.maxScale': [0.9, 1.1], 'bar.kind': ['straight'] }), BENCH: fam({ 'bar.kind': ['straight'] }) });
    const params = { 'camera.maxScale': 1, 'bar.kind': 'straight' }, all = tAll(params, tSource('seat_on_bench', 'BENCH', params));
    const r = await qa(all, {}, () => {}, await pageFor(all));
    expect(r.keys).toEqual(['PQ-H10 H10.envelope:camera.maxScale']);
  });
  it('pinned envelope: no family, no key or no file gives H10.envelope; a test envelope that names the key is the fallback', async () => {
    for (const fams of [{}, { 'D:lib_pull_up': fam({ 'bar.kind': ['straight'] }) }, { BENCH: fam({ 'camera.maxScale': [0.9, 1.1] }) }]) {
      writeRanges(fams);
      expect([fams, (await qa(dAll({ 'camera.maxScale': 1 }))).keys]).toEqual([fams, ['PQ-H10 H10.envelope:camera.maxScale']]);
    }
    rmSync(join(root, RANGES));
    expect((await qa(dAll({ 'camera.maxScale': 1 }))).keys).toEqual(['PQ-H10 H10.envelope:camera.maxScale']);
    const env = { ...pins.envelope, 'camera.maxScale': [0.9, 1.1] };
    expect((await qa(dAll({ 'camera.maxScale': 1 }), { envelope: env })).keys).toEqual([]);
    expect((await qa(dAll({ 'camera.maxScale': 99 }), { envelope: env })).keys).toEqual(['PQ-H10 H10.value:camera.maxScale']);
    writeRanges({});
  });
  it('the loader throws on a family row without a ruling id, a bound without a basis, a key outside PARAMS or a malformed range', async () => {
    const L = await loader();
    const good = fam({ 'camera.maxScale': [0.9, 1.1] });
    writeRanges({ X: good });
    expect(Object.keys(L.loadRanges())).toEqual(['X']);
    const bad: [string, unknown][] = [
      ['no ruling', { params: good.params }],
      ['ruling not an id', { ...good, ruling: 'yes' }],
      ['bound without a basis', { ...good, params: { 'camera.maxScale': { range: [0.9, 1.1], basis: ['only one'] } } }],
      ['empty basis', { ...good, params: { 'camera.maxScale': { range: [0.9, 1.1], basis: ['a', ''] } } }],
      ['key outside PARAMS', fam({ gripWidth: [0.4, 0.5] })],
      ['inherited name', fam({ constructor: [0.4, 0.5] })],
      ['malformed range', fam({ 'camera.maxScale': [1.1, 0.9] })],
      ['value not allowed', fam({ 'bar.kind': ['banana'] })],
    ];
    for (const [why, f] of bad) {
      writeRanges({ X: f });
      expect(() => L.loadRanges(), why).toThrow(/param-ranges/);
    }
    writeRanges({ X: { ...good, extra: 1 } });
    expect(() => L.loadRanges()).toThrow(/param-ranges/);
    writeRanges({});
  });
  it('one object: H10\'s value check and the child rebuild read the same object (family row first, then ctx.envelope)', async () => {
    const env = { ...pins.envelope, 'camera.maxScale': [5, 6], handedness: ['both'] }, params = { 'camera.maxScale': 1, handedness: 'both' };
    const run = async (range: number[]) => {
      writeRanges({ 'D:lib_pull_up': fam({ 'camera.maxScale': range }) });
      const seen: any[] = [];
      const r = await qa(dAll(params), { envelope: env }, c => { const f = c.derivation.rebuildChild; c.derivation.rebuildChild = (o: any) => { seen.push(o); return f(o); }; });
      return { ...r, seen };
    };
    const a = await run([0.9, 1.1]);
    expect([a.keys, a.seen.length]).toEqual([[], 1]);
    expect(a.seen[0]['camera.maxScale']).toEqual([0.9, 1.1]);
    expect(a.seen[0].handedness).toEqual(['both']);
    expect(node.paramEnvelopeProblems(params, [], a.seen[0])).toEqual([]);
    const b = await run([0.8, 1.2]);
    expect([b.keys, b.seen.length, b.seen[0]['camera.maxScale']]).toEqual([[], 1, [0.8, 1.2]]);
    const c = await run([2, 3]);
    expect([c.keys, c.seen.length]).toEqual([['PQ-H10 H10.value:camera.maxScale'], 0]);
    writeRanges({});
  });
  it('a T row with no template, or one naming no file under templates/, makes candidateOf throw', async () => {
    const params = { 'bar.kind': 'straight' }, src = tSource('tcheck', 'BENCH', params);
    for (const t of [undefined, 'NOPE', '../derive', 'BEN/CH', 7]) {
      await expect(cand.candidateOf(F.ID, { platesHtml: html, engine: E, all: tAll(params, src, t) }), String(t)).rejects.toThrow(/template/);
    }
  });
  it('no spec, template or eq file names param-ranges (repo and tree)', () => {
    const hits: string[] = [];
    const walk = (dir: string) => { if (!existsSync(dir)) return; for (const n of readdirSync(dir)) { const p = join(dir, n); if (statSync(p).isDirectory()) walk(p); else if (readFileSync(p, 'utf8').includes('param-ranges')) hits.push(p); } };
    for (const r of [REPO, root]) for (const d of ['specs', 'templates', 'eq']) walk(join(r, LIB, d));
    expect(hits).toEqual([]);
  });
});

describe('LIB-3c 3c-A5 the child proof (D-LIB10-CHILDPROOF)', { timeout: T }, () => {
  it('control: a clean D child and a clean T child, with test family rows present, give no H10 problem', async () => {
    writeRanges({ 'D:lib_pull_up': fam({ 'camera.maxScale': [0.9, 1.1] }), BENCH: fam({ 'bar.kind': ['straight', 'ez'] }) });
    expect((await qa(dAll({ 'camera.maxScale': 1 }))).h10).toEqual([]);
    const params = { 'bar.kind': 'straight' }, all = tAll(params, tSource('t_clean', 'BENCH', params));
    expect((await qa(all, {}, () => {}, await pageFor(all))).h10).toEqual([]);
    const ez = { 'bar.kind': 'ez' }, allEz = tAll(ez, tSource('t_clean_ez', 'BENCH', ez));
    expect((await qa(allEz, {}, () => {}, await pageFor(allEz))).h10).toEqual([]);
  });
  it('a D source that derives and then sets tempo gives H10.child:tempo', async () => {
    writeRanges({ 'D:lib_pull_up': fam({ 'camera.maxScale': [0.9, 1.1] }) });
    const src = source('d_tempo', `import parent from './${F.CARD}.mjs';\nimport { derive } from '../derive.mjs';\nconst d = derive(parent, { 'camera.maxScale': 1 }, { 'camera.maxScale': [1, 1] });\nexport default { ...d, tempo: d.tempo.map((t, i) => (i === 0 ? { ...t, s: t.s + 1 } : t)) };\n`);
    const all = dAll({ 'camera.maxScale': 1 }, { src });
    expect((await qa(all, {}, () => {}, await pageFor(all))).h10).toEqual(['H10.child:tempo']);
  });
  it('a T source that calls make and then moves one callout gives H10.child', async () => {
    writeRanges({ BENCH: fam({ 'bar.kind': ['straight'] }) });
    const params = { 'bar.kind': 'straight' };
    const all = tAll(params, tSource('t_moved', 'BENCH', params, "const s = make(PARAMS, facts);\nexport default { ...s, callouts: s.callouts.map((c, i) => (i === 0 ? { ...c, box: { ...c.box, left: c.box.left + 4 } } : c)) };"));
    const h = (await qa(all, {}, () => {}, await pageFor(all))).h10;
    expect(h.length).toBeGreaterThan(0);
    expect(h.every((k: string) => k.startsWith('H10.child:'))).toBe(true);
    expect(h).toContain('H10.child:normalOverlay');
  });
  it('a T default export with params other than row.params gives H10.child', async () => {
    writeRanges({ BENCH: fam({ 'bar.kind': ['straight', 'ez'] }) });
    const all = tAll({ 'bar.kind': 'straight' }, tSource('t_other', 'BENCH', { 'bar.kind': 'ez' }));
    expect((await qa(all, {}, () => {}, await pageFor(all))).h10).toEqual(['H10.child:alt']);
  });
  it('one byte of a template constant gives H10.byte on the template parent proof', async () => {
    writeRanges({ SEATPRESS: fam({ 'bar.kind': ['straight'] }) });
    const t = join(root, LIB, 'templates', 'SEATPRESS.mjs');
    writeFileSync(t, TEMPLATE('SEATPRESS').replace("export const ALT_TAIL = '';", "export const ALT_TAIL = 'x';"));
    try {
      const params = { 'bar.kind': 'straight' }, all = tAll(params, tSource('t_byte', 'SEATPRESS', params), 'SEATPRESS');
      expect((await qa(all, {}, () => {}, await pageFor(all))).h10).toEqual(['H10.byte:alt']);
    } finally { writeFileSync(t, TEMPLATE('SEATPRESS')); }
  });
  it('a rebuild that throws gives H10.child:threw; a derivation with clean params and no child rebuild too', async () => {
    writeRanges({ 'D:lib_pull_up': fam({ 'camera.maxScale': [0.9, 1.1] }) });
    const threw = await qa(dAll({ 'camera.maxScale': 1 }), {}, c => { c.derivation.rebuildChild = async () => { throw new Error('child test: rebuild refused'); }; });
    expect(threw.h10).toEqual(['H10.child:threw']);
    const none = await qa(dAll({ 'camera.maxScale': 1 }), {}, c => { delete c.derivation.rebuildChild; });
    expect(none.h10).toEqual(['H10.child:threw']);
    writeRanges({});
  });
});
