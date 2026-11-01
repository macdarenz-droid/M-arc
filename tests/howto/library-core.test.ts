// LIB-2 (library plan 5.2, 5.3; design docs/howto/library/LIB-2-DESIGN.md): the scale core. Each block names its
// design acceptance id (L2-A*). Every sweep asserts its count and is shown red on an empty input.
import { cpSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it, onTestFinished } from 'vitest';
import { child } from '../child-test';
import { LIBRARY } from './shipped-rows';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let gen: any, core: any, bodies: any, out: Map<string, { text: string; writers: string[]; hash: string }>;
beforeAll(async () => {
  gen = await import(/* @vite-ignore */ url('tools/plates/generate.mjs'));
  core = await import(/* @vite-ignore */ url('tools/plates/lib/inputs.mjs'));
  bodies = await import(/* @vite-ignore */ url('tools/plates/library/bodies.mjs'));
  out = await gen.render();
}, 180_000);

const fixture = () => JSON.parse(readFileSync('tests/howto/fixtures/generated-bodies.json', 'utf8')) as { count: number; bodies: Record<string, string> };

/** L2-A3: the listed bodies against fresh generator output; returns the problems. Red on an empty list or output. */
export function bodyProblems(want: Record<string, string>, got: Map<string, { text: string }>, bodySha: (t: string) => string, count: number): string[] {
  const keys = Object.keys(want);
  if (keys.length === 0) return ['no fingerprinted files'];
  if (got.size === 0) return ['no generator output'];
  const bad: string[] = [];
  if (keys.length !== count) bad.push(`${keys.length} fingerprints, expected ${count}`);
  for (const p of keys) {
    const o = got.get(p);
    if (!o) bad.push(`${p}: not generated`);
    else if (bodySha(o.text) !== want[p]) bad.push(`${p}: body changed`);
  }
  return bad;
}

describe('L2-A3: the bodies LIB-2 does not rewrite are unchanged', () => {
  it('54 fingerprinted files (all generated files but ids.ts and generated/index.ts) match, header and hashes: line excluded', () => {
    const f = fixture();
    expect(f.count).toBe(54);
    expect(bodyProblems(f.bodies, out, bodies.bodySha, 54)).toEqual([]);
  });

  it('red on an empty list, an empty output, a missing file and one changed byte', () => {
    const f = fixture(), first = Object.keys(f.bodies)[0]!;
    expect(bodyProblems({}, out, bodies.bodySha, 54)).toEqual(['no fingerprinted files']);
    expect(bodyProblems(f.bodies, new Map(), bodies.bodySha, 54)).toEqual(['no generator output']);
    const missing = new Map(out); missing.delete(first);
    expect(bodyProblems(f.bodies, missing, bodies.bodySha, 54)).toEqual([`${first}: not generated`]);
    const changed = new Map(out); changed.set(first, { ...out.get(first)!, text: `${out.get(first)!.text} ` });
    expect(bodyProblems(f.bodies, changed, bodies.bodySha, 54)).toEqual([`${first}: body changed`]);
  });

  it('the header and the hashes: line are the only lines ignored', () => {
    const t = '// GENERATED, do not edit. Written by tools/plates/generate.mjs (x). inputsSha256=' + '0'.repeat(64) + '\nexport default {\n  hashes: { inputsSha256: "' + '1'.repeat(64) + '", golden: "' + '2'.repeat(64) + '" },\n  a: 1,\n};\n';
    expect(bodies.body(t)).toBe('export default {\n  a: 1,\n};\n');
  });
});

/** L2-A4: the header and `hashes:` lines of `paths` in `a` and `b`; returns the problems. Red on an empty list. */
export function hashLineProblems(paths: string[], a: Map<string, { text: string }>, b: Map<string, { text: string }>): string[] {
  if (paths.length === 0) return ['no files compared'];
  const lines = (t: string) => [t.split('\n')[0], (t.match(/^ *hashes: \{ inputsSha256: .*$/m) ?? [''])[0]];
  const bad: string[] = [];
  for (const p of paths) {
    const x = a.get(p), y = b.get(p);
    if (!x || !y) { bad.push(`${p}: not generated`); continue; }
    if (JSON.stringify(lines(x.text)) !== JSON.stringify(lines(y.text))) bad.push(`${p}: header or hashes: line changed`);
  }
  return bad;
}

describe('L2-A4: a new library batch row stales none of the 8\'s generated files', () => {
  child.it('with a synthetic batch row, the 54 fingerprinted files keep their header and the 8 ht- modules their hashes: line; the id files see the row', async () => {
    const F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    const t = F.ownRowsTree(), LB = 'tests/howto/fixtures/batches/lb-test.json';
    onTestFinished(() => F.drop(t));
    cpSync(LB, join(t, LB));
    const ID_FILES = ['src/howto/ids.ts', 'tools/plates/library/ids-node.mjs', 'src/howto/generated/loaders.ts', 'src/howto/coverage.ts'];
    const reg = await import(/* @vite-ignore */ F.url(t, 'tools/plates/library/registry.mjs'));
    const tgen = await import(/* @vite-ignore */ F.url(t, 'tools/plates/generate.mjs'));
    const paths = Object.keys(fixture().bodies);
    expect(paths).toHaveLength(54);
    expect(paths.filter(p => /\/ht-[a-z-]+\.ts$/.test(p))).toHaveLength(8);
    const before = reg.rows().length;   // LIB-2b: the registry's rows (the 8 on main), never fewer
    expect(before).toBeGreaterThanOrEqual(8);
    const base = new Map([...paths, ...ID_FILES].map(p => [p, { text: readFileSync(join(t, p), 'utf8') }]));
    reg.__setExtraBatches([LB]);
    let withRow: Map<string, { text: string }>;
    try {
      expect(reg.rows()).toHaveLength(before + 1);
      withRow = await tgen.render();
    } finally { reg.__setExtraBatches([]); }
    expect(hashLineProblems(paths, base, withRow)).toEqual([]);
    for (const p of ID_FILES) expect(withRow.get(p)!.text.split('\n')[0], p).not.toBe(base.get(p)!.text.split('\n')[0]);
    expect(hashLineProblems([], base, withRow)).toEqual(['no files compared']);
  }, 180_000);
});

describe('L2-A4 core: per-output inputs (HT-2 core, design 6.1)', () => {
  const P = 'tests/howto/fixtures/gen-per-output/plugin.mjs';
  it('an output with its own inputs is hashed over those only, in its header and through hashFor; one without keeps the plugin-wide list', async () => {
    const o = await gen.render([P]);
    expect(o.size).toBe(2);
    const own = core.inputsSha256([P], ['src/data/exercises.json']), wide = core.inputsSha256([P], ['tools/plates/plates.json']);
    expect(own).not.toBe(wide);
    expect(o.get('fixture/own.ts').hash).toBe(own);
    expect(o.get('fixture/own.ts').text).toContain(`export const h = "${own}";`);
    expect(o.get('fixture/wide.ts').hash).toBe(wide);
    expect(o.get('fixture/wide.ts').text).toContain(`export const h = "${wide}";`);
  });
  it('an empty per-output input list is refused', async () => {
    process.env.LIB2_EMPTY_INPUTS = '1';
    try { await expect(gen.render([P])).rejects.toThrow(/needs a non-empty list of input paths/); } finally { delete process.env.LIB2_EMPTY_INPUTS; }
  });
});

describe('L2-A1, L2-A18, L2-A20: the 8 as data (pins.json, LIB_OF, HT_PLATES)', () => {
  let g: any, platesGen: any;
  beforeAll(async () => {
    g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    platesGen = await import(/* @vite-ignore */ url('tools/plates/gen/plates.mjs'));
  });
  it('PINS read from tools/plates/pins.json hold golden A and the font; verifyVendor passes', () => {
    expect(g.PINS).toEqual({
      refSrcMd5: { 'ref-src/plate.mjs': '31e7bfe3555c0c456ed4417f503dc93f', 'ref-src/themes.mjs': '37495b3d37d1a6a284a380c9e517fb18' },
      fontSha256: '3100e775e8616cd2611beecfa23a4263d7037586789b43f035236a2e6fbd4c62',
      pageSha256: 'e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48',
      pageBytes: 860766,
    });
    expect(g.verifyVendor()).toEqual([]);
  });
  it('a vendored file from a commit not in pins.json vendorSources is refused, with the same message as before', () => {
    const m = g.readManifest(), k = Object.keys(m.files)[0]!;
    const bad = structuredClone(m); bad.files[k].source = 'abc1234:docs/howto/technical-plate/x';
    expect(g.verifyVendor(undefined, bad)).toContain(`${k}: source abc1234:docs/howto/technical-plate/x is not a bc0f378 blob, the ref-src commit or a golden update (7859292, de00174, 48153c4: LIB-25 poly; f214700: LIB-26 flat palm; c35e0a4: LIB-20 E-R5; 80be674, d8d4b2e: LIB-SPINE)`);
  });
  it('LIB_OF, now read from plates.json, equals the literal it replaced, key for key and in order (8 pairs)', () => {
    const was = [['lateral-raise', 'lib_dumbbell_lateral_raise'], ['barbell-back-squat', 'lib_barbell_back_squat'], ['pull-up', 'lib_pull_up'],
      ['hanging-leg-raise', 'lib_hanging_leg_raise'], ['lat-pulldown', 'lib_lat_pulldown'], ['seated-cable-row', 'lib_seated_cable_row'],
      ['leg-press', 'lib_leg_press'], ['machine-chest-press', 'lib_machine_chest_press']];
    expect(Object.entries(g.LIB_OF)).toEqual(was);
    expect(Object.entries(g.LIB_OF)).toHaveLength(8);
  });
  it('L2-A20: pins.json is an input of the plates plugin, so a pin edit stales the 8 plate modules', () => {
    expect(platesGen.inputs()).toContain('tools/plates/pins.json');
    const css = out.get('src/slices/howto/css/plate.css')!;
    expect(css.writers).toEqual(['tools/plates/gen/plates.mjs']);
    expect(css.hash).toBe(core.inputsSha256(css.writers, platesGen.inputs()));
  });
});

describe('L2-A12: the registry', () => {
  let reg: any;
  beforeAll(async () => { reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs')); });
  const ex = () => JSON.parse(readFileSync('src/data/exercises.json', 'utf8')) as { id: string }[];
  const plates = () => JSON.parse(readFileSync('tools/plates/plates.json', 'utf8'));
  const row = (o = {}) => ({ src: 'library/specs/x.mjs', slug: 'x', prefix: 'x', chromeId: 'x', mode: 'H', stage: 'drawing', ...o });
  it('reads the 8 from plates.json, all shipped, in file order', () => {
    const all = reg.rows(), eight = Object.keys(plates());
    // LIB-4a (D-LIB4-PINS-2): the 8 first, in file order, then every batch row (none today)
    const batchRows = reg.batchFiles().reduce((a: number, f: string) => a + Object.keys(JSON.parse(readFileSync(f, 'utf8')).rows).length, 0);
    expect(eight).toHaveLength(8);
    expect(all).toHaveLength(8 + batchRows);
    expect(all.slice(0, 8).map((r: any) => r.id)).toEqual(eight);
    for (const id of eight) expect(reg.shippedIds(all), id).toContain(id);
    const batchShipped = reg.batchFiles().reduce((a: number, f: string) => a + Object.values(JSON.parse(readFileSync(f, 'utf8')).rows).filter((r: any) => r.stage === 'shipped').length, 0);
    expect(reg.shippedIds(all)).toHaveLength(8 + batchShipped);
    expect(reg.shippedIds(all).slice(0, 8)).toEqual(eight);
  });
  it('adds a batch row and refuses a duplicate id, a chromeId or prefix clash, an unknown id, mode or stage, a D row with no parent, and zero rows', () => {
    const base = { plates: plates(), exercises: ex() };
    expect(reg.rows(undefined, { ...base, batches: [['b.json', { rows: { lib_barbell_row: row() } }]] })).toHaveLength(9);
    const refuse = (rows: object, re: RegExp) => expect(() => reg.rows(undefined, { ...base, batches: [['b.json', { rows }]] })).toThrow(re);
    refuse({ lib_pull_up: row() }, /id lib_pull_up already used/);
    refuse({ lib_barbell_row: row({ chromeId: 'pull-up' }) }, /chromeId pull-up already used/);
    refuse({ lib_barbell_row: row({ prefix: 'lr' }) }, /prefix lr already used/);
    refuse({ lib_not_an_exercise: row() }, /is not in src\/data\/exercises.json/);
    refuse({ lib_barbell_row: row({ mode: 'X' }) }, /unknown mode X/);
    refuse({ lib_barbell_row: row({ stage: 'done' }) }, /unknown stage done/);
    refuse({ lib_barbell_row: row({ mode: 'D' }) }, /mode D needs a parent/);
    expect(() => reg.rows(undefined, { ...base, plates: {}, batches: [] })).toThrow(/has no rows/);
  });
  it('stages are the plan section 1 vocabulary', () => {
    for (const s of ['queued', 'researching', 'drawing', 'review', 'approved-plate', 'shipped', 'blocked:no-source', 'left-out:D-LIB-1']) expect(reg.isStage(s), s).toBe(true);
    for (const s of ['approved', 'pending', 'held', 'blocked:', 'left-out:']) expect(reg.isStage(s), s).toBe(false);
  });
});

describe('L2-A11: D/T derive with PARAMS and an injected envelope', () => {
  let d: any;
  beforeAll(async () => { d = await import(/* @vite-ignore */ url('tools/plates/library/derive.mjs')); });
  // Synthetic D row: lib_leg_press_calf_raise from lib_leg_press with a camera scale (plan 1: keeps it derived).
  const parent = { id: 'leg_press', view: 'side', camera: { x0: 170, y0: 339 }, poses: { start: { knee: 90 } }, equipment: [() => null] };
  const envelope = { 'camera.maxScale': [1, 1.4], 'bar.kind': ['straight', 'ez'] };
  const diff = (a: any, b: any, p = ''): string[] => {
    if (a === b) return [];
    if (typeof a !== 'object' || typeof b !== 'object' || !a || !b) return [p];
    return [...new Set([...Object.keys(a), ...Object.keys(b)])].flatMap(k => diff(a[k], b[k], p ? `${p}.${k}` : k));
  };
  it('the child differs from the parent in exactly the params key; the parent is not mutated', () => {
    const child = d.derive(parent, { 'camera.maxScale': 1.2 }, envelope);
    expect(diff(parent, child)).toEqual(['camera.maxScale']);
    expect(child.camera).toEqual({ x0: 170, y0: 339, maxScale: 1.2 });
    expect(parent.camera).toEqual({ x0: 170, y0: 339 });
    expect(child.equipment[0]).toBe(parent.equipment[0]);
  });
  it('refuses an unknown key, an out-of-envelope value, a key the envelope does not name, a view change and no params', () => {
    expect(() => d.derive(parent, { 'camera.zoom': 2 }, envelope)).toThrow(/camera.zoom: not a PARAMS key/);
    expect(() => d.derive(parent, { 'camera.maxScale': 1.6 }, envelope)).toThrow(/outside the envelope 1..1.4/);
    expect(() => d.derive(parent, { 'grip.width': 0.5 }, envelope)).toThrow(/the envelope does not name it/);
    expect(() => d.derive(parent, { 'bar.kind': 'rope' }, envelope)).toThrow(/rope is not an allowed value/);
    expect(() => d.derive(parent, { view: 'front' }, envelope)).toThrow(/never changes the view/);
    expect(() => d.derive(parent, {}, envelope)).toThrow(/none given/);
  });
  it('PARAMS includes the camera scale', () => expect(d.PARAMS['camera.maxScale']).toEqual({ type: 'number' }));
});

describe('L2-A14: per-batch golden files (verifyBatchChain)', () => {
  let g: any;
  beforeAll(async () => { g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs')); });
  const golden = () => JSON.parse(readFileSync('tests/howto/golden/GOLDEN.json', 'utf8')).entries as object[];
  const sha = (x: string) => g.sha256(x);
  const batch = (entries: object[], n = 3) => {
    const es: any[] = [];
    for (let i = 0; i < n; i++) es.push({ kind: `plate`, id: `lib_x${i}`, why: 'synthetic', approvedBy: 'owner', date: '2026-10-04', prev: sha(JSON.stringify(es)) });
    const index = entries.length - 1;
    return { base: { index, hash: g.prefixHash(entries, index) }, entries: es };
  };
  it('a well-formed file (3 entries) passes; appending to GOLDEN.json keeps it green', () => {
    const gl = golden(), f = batch(gl);
    expect(f.entries).toHaveLength(3);
    expect(g.verifyBatchChain(f, gl)).toEqual([]);
    const appended = [...gl, { kind: 'page', why: 'a later golden update', approvedBy: 'owner', date: '2026-10-05' }];
    expect(g.verifyBatchChain(f, appended)).toEqual([]);
  });
  it('red on: no entries, an edited entry, an edited older GOLDEN entry, base past the end', () => {
    const gl = golden(), f = batch(gl);
    expect(g.verifyBatchChain({ ...f, entries: [] }, gl)).toEqual(['batch file: no entries']);
    const edited = structuredClone(f); edited.entries[0].why = 'changed';
    expect(g.verifyBatchChain(edited, gl).some((p: string) => /entry 1 .*prev does not match/.test(p))).toBe(true);
    const old = structuredClone(gl) as any[]; old[0].why = 'changed';
    expect(g.verifyBatchChain(f, old).some((p: string) => /base.hash does not match/.test(p))).toBe(true);
    expect(g.verifyBatchChain({ ...f, base: { index: gl.length, hash: f.base.hash } }, gl).some((p: string) => /is not a GOLDEN.json entry/.test(p))).toBe(true);
  });
});

describe('L2-A6..A9, A13, A16, A17: ids, loaders, coverage (gen/ids.mjs)', () => {
  let idsGen: any, node: any, reg: any, h: any;
  const exerciseIds = () => (JSON.parse(readFileSync('src/data/exercises.json', 'utf8')) as { id: string }[]).map(e => e.id);
  beforeAll(async () => {
    idsGen = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
    node = await import(/* @vite-ignore */ url('tools/plates/library/ids-node.mjs'));
    reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    h = await import(/* @vite-ignore */ url('tools/plates/fidelity/harness.mjs'));
  });

  it('the generator writes 61 files: the 54 fingerprinted, the 2 it rewrites, and ids-node.mjs, lib-id.ts, loaders.ts, coverage.ts, red-flag-back.ts', async () => {
    // LIB-2b (D-LIB2b-PINS (10)): 61 for the 8's set (60 plus red-flag-back.ts), plus for each shipped library row its ht-, feel-, posture-, zoom- css and
    // research card, plus one handpair-<key>.ts per distinct key the shipped rows use
    const hp = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
    const { keys } = hp.pairsOf(await hp.loadPairs(), reg.shippedIds());
    expect(out.size).toBe(61 + 5 * LIBRARY.length + new Set(keys).size);
    for (const p of ['src/howto/ids.ts', 'src/howto/generated/index.ts', 'tools/plates/library/ids-node.mjs', 'src/howto/lib-id.ts', 'src/howto/generated/loaders.ts', 'src/howto/coverage.ts', 'src/howto/red-flag-back.ts']) expect(out.has(p), p).toBe(true);
  });

  /** L2-A6: hasHowTo (both twins) against the LOADERS keys and the shipped rows, over every exercises.json id. */
  async function idProblems(ids: string[]): Promise<string[]> {
    if (ids.length === 0) return ['no exercise ids'];
    const { hasHowTo } = await import('@/howto/ids');
    const { LOADERS, HOWTO_IDS } = await import('@/howto/generated/loaders');
    const shipped = new Set(reg.shippedIds()), bad: string[] = [];
    for (const id of ids) {
      const want = shipped.has(id);
      if (hasHowTo(id) !== want) bad.push(`${id}: hasHowTo ${hasHowTo(id)}, shipped ${want}`);
      if (node.hasHowTo(id) !== want) bad.push(`${id}: Node twin ${node.hasHowTo(id)}, shipped ${want}`);
      if ((id in LOADERS) !== want) bad.push(`${id}: in LOADERS ${id in LOADERS}, shipped ${want}`);
    }
    if (JSON.stringify([...HOWTO_IDS]) !== JSON.stringify([...shipped])) bad.push('HOWTO_IDS != shipped rows in order');
    return bad;
  }
  it('L2-A6/A17: for all 153 exercises.json ids, hasHowTo (ids.ts and its Node twin) is true exactly for the shipped ids, which are exactly the LOADERS keys', async () => {
    expect(exerciseIds()).toHaveLength(153);
    expect(await idProblems(exerciseIds())).toEqual([]);
    expect(await idProblems([])).toEqual(['no exercise ids']);
  });
  it('L2-A7: unknown and custom ids are false in both twins', async () => {
    const { hasHowTo } = await import('@/howto/ids');
    for (const id of ['custom_1727000000000', 'lib_', '', 'LIB_PULL_UP', 'lib_pull_up ', 'lib_not_an_exercise', 'custom_lib_pull_up']) {
      expect(hasHowTo(id), id).toBe(false);
      expect(node.hasHowTo(id), id).toBe(false);
    }
  });
  it('L2-A17: ids.ts and ids-node.mjs carry byte-identical S, H and O literals, and both decode every id the same', async () => {
    const ts = readFileSync('src/howto/ids.ts', 'utf8'), js = readFileSync('tools/plates/library/ids-node.mjs', 'utf8');
    const lit = (s: string, k: string) => s.match(new RegExp(`^const ${k} = (.*);$`, 'm'))?.[1];
    for (const k of ['S', 'H', 'O']) { expect(lit(ts, k), k).toBeTruthy(); expect(lit(ts, k), k).toBe(lit(js, k)); }
    expect(JSON.parse(lit(ts, 'S')!).length).toBe(4 * reg.shippedIds().length);
    const { howToHint } = await import('@/howto/ids');
    for (const id of exerciseIds()) {
      expect(node.hasHowTo(id), id).toBe(reg.shippedIds().includes(id));
      expect(node.howToHint(id), id).toBe(howToHint(id));
    }
  });
  it('L2-A8: a hash collision between a shipped id and any other id is refused; no shipped ids is refused', () => {
    const real = idsGen.idHash;
    expect(idsGen.setOf(['lib_pull_up'], exerciseIds())).toBe(real('lib_pull_up'));
    expect(() => idsGen.setOf([], exerciseIds())).toThrow(/no shipped ids/);
    expect(() => idsGen.setOf(['lib_nope'], exerciseIds())).toThrow(/is not in src\/data\/exercises.json/);
    // two ids that collide under the real hash are searched for among synthetic names, so the refusal is real
    const seen = new Map<string, string>(); let pair: [string, string] | null = null;   // 24-bit hash: found fast
    for (let i = 0; !pair && i < 200000; i++) { const id = `lib_x${i}`, t = real(id); if (seen.has(t)) pair = [seen.get(t)!, id]; else seen.set(t, id); }
    expect(pair).not.toBeNull();
    expect(() => idsGen.setOf([pair![0]], [...exerciseIds(), ...pair!])).toThrow(/hash collision/);
  }, 60_000);
  /** L2-A9 worst case (ruling D-LIB2-hints-2): every exercises.json id ships and all its push ids are hinted, the first
   *  `distinct` - 1 with their own 29-character text and the rest sharing the 8's text. */
  const worst = async (distinct: number) => {
    const enc = await import(/* @vite-ignore */ url('tools/plates/library/ids-encoding.mjs'));
    const arch = JSON.parse(readFileSync('tools/plates/library/coverage-archetypes.json', 'utf8')).archetypes;
    const ids = exerciseIds(), push = ids.filter(id => arch[id] === 'push' || id === 'lib_machine_chest_press');
    const T = 'Heel of palm, wrist straight.';
    const hints = Object.fromEntries(push.map((id, i) => [id, i < distinct - 1 ? `${T.slice(0, -2)}${String.fromCharCode(97 + i)}.` : T]));
    return { push, hints, run: () => enc.hintsOutputs(hints, ids, ids) as { ids: string; node: string } };
  };
  const HEAD = 200;   // the core's header line for ids.ts, its newline included (its length does not depend on the hash)
  it('L2-A9: the header line the budget counts is the real one', () => {
    expect(readFileSync('src/howto/ids.ts', 'utf8').indexOf('\n') + 1).toBe(HEAD);
  });
  it('L2-A9 (i), (ii): 153 shipped, all 26 push ids hinted: one shared text fits (1,693 B), and so do 12 distinct 29-character texts (2,045 B); both decode', async () => {
    for (const [distinct, size] of [[1, 1693], [12, 2045]] as const) {
      const w = await worst(distinct);
      expect(w.push).toHaveLength(26);
      expect(new Set(Object.values(w.hints)).size).toBe(distinct);
      const o = w.run();
      expect(HEAD + Buffer.byteLength(o.ids), String(distinct)).toBe(size);
      expect(HEAD + Buffer.byteLength(o.ids) + readFileSync('src/slices/howto/lazy.tsx', 'utf8').length).toBeLessThanOrEqual(3072);
      const twin = await import(/* @vite-ignore */ `data:text/javascript,${encodeURIComponent(o.node)}`);
      for (const id of exerciseIds()) expect(twin.howToHint(id), id).toBe(w.hints[id]);
      expect(exerciseIds().every(id => twin.hasHowTo(id))).toBe(true);
    }
  });
  it('L2-A9 (iii): 13 distinct 29-character texts are refused by the generator, with the size, the count and the fix', async () => {
    expect((await worst(13)).run).toThrow(/^ids: src\/howto\/ids\.ts would be 2077 B raw, over its 2048 B limit \(plan 2\.9\), with 13 distinct hint text\(s\); share the hint text per archetype, or shorten it \(D-LIB2-hints\)$/);
    expect((await worst(27)).run).toThrow(/would be 2493 B raw, over its 2048 B limit .* with 26 distinct hint text/);   // each push id its own text
  });
  it('L2-A13: coverage stages map one rule: approved <=> shipped, every other id pending with an archetype; c6 passes', async () => {
    const { COVERAGE } = await import('../../src/howto/coverage');
    const { checkC6 } = await import('./checks/c6');
    const entries = Object.entries(COVERAGE) as [string, any][];
    expect(entries).toHaveLength(153);
    const shipped = new Set(reg.shippedIds());
    for (const [id, e] of entries) {
      if (shipped.has(id)) expect(e, id).toEqual({ status: 'approved', stage: 'shipped' });
      else { expect(e.status, id).toBe('pending'); expect(e.archetype, id).toBeTruthy(); expect(reg.isStage(e.stage) && e.stage !== 'shipped', id).toBe(true); }
    }
    expect(checkC6(exerciseIds(), COVERAGE)).toEqual([]);
    expect(() => idsGen.coverageEntries({}, reg.rows(), exerciseIds())).toThrow(/must hold every exercises.json id once/);
    const arch = JSON.parse(readFileSync('tools/plates/library/coverage-archetypes.json', 'utf8')).archetypes;
    const own = reg.rows(undefined, { batches: [] });
    const withShip = [...own, { id: 'lib_barbell_row', stage: 'shipped' }];
    expect(idsGen.coverageEntries(arch, withShip, exerciseIds()).find(([id]: [string]) => id === 'lib_barbell_row')[1]).toEqual({ status: 'approved' });
    const plated = [...own, { id: 'lib_barbell_row', stage: 'approved-plate' }];
    expect(idsGen.coverageEntries(arch, plated, exerciseIds()).find(([id]: [string]) => id === 'lib_barbell_row')[1]).toEqual({ status: 'pending', archetype: arch.lib_barbell_row, stage: 'approved-plate' });
    expect(reg.shippedIds(plated)).not.toContain('lib_barbell_row');
    expect(() => idsGen.coverageEntries({ ...arch, lib_barbell_row: null }, own, exerciseIds())).toThrow(/no archetype/);
  });
  it('L2-A16: the gate\'s no-How-to control is the first exercises.json id that does not ship, and moves on when it ships', () => {
    expect(h.firstWithoutHowTo()).toBe(exerciseIds().find(id => !reg.shippedIds().includes(id)) ?? null);
    // LIB-4a (D-LIB4-PINS-2): the literal is the 8's answer; past the 8 the registry line above decides
    if (reg.shippedIds().length === 8) expect(h.firstWithoutHowTo()).toBe('lib_dumbbell_bench_press');
    const first = exerciseIds().find(id => !node.hasHowTo(id)) ?? null;
    expect(first).toBe(h.HT_NO_HOWTO);
  });
  it('L2-A18: HT_PLATES, now read from plates.json, equals the literal pairs it replaced, in order (8 pairs)', () => {
    expect(h.HT_PLATES).toEqual([['lateral-raise', 'lib_dumbbell_lateral_raise'], ['barbell-back-squat', 'lib_barbell_back_squat'], ['pull-up', 'lib_pull_up'],
      ['hanging-leg-raise', 'lib_hanging_leg_raise'], ['lat-pulldown', 'lib_lat_pulldown'], ['seated-cable-row', 'lib_seated_cable_row'],
      ['leg-press', 'lib_leg_press'], ['machine-chest-press', 'lib_machine_chest_press']]);
  });
});

describe('L2-A15: the How-to total ceiling is a per-id rule (plan 5.1)', () => {
  it('both totals equal the rule at the shipped count, and a batch over its N fails', async () => {
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const rule = (await import(/* @vite-ignore */ url('tools/plates/library/budgets/total.mjs'))).totalCeiling as (m: number, n: number) => number;
    const t = JSON.parse(readFileSync('tests/howto/budgets.json', 'utf8')).totals.find((x: any) => x.chunk === 'How-to total');
    const n = reg.shippedIds().length;
    expect(reg.shippedIds().slice(0, 8)).toEqual(Object.keys(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8'))));   // LIB-4a (D-LIB4-PINS-2): N is the registry's, the 8 first
    expect(t.gzMax).toBe(rule(t.measuredGz, n));
    expect(t.rawMax).toBe(rule(t.measuredRaw, n));
    expect(rule(t.measuredGz, n + 1)).toBeGreaterThan(t.gzMax);
    expect(Math.ceil(t.measuredGz / 8 * 1.1) * n).not.toBe(t.gzMax);   // rounding per id would drift
  });
});

describe('L2-A19: moduleText, which LIB-3 H7 sizes chunks with, is byte-stable for the 8', () => {
  it('sha256(moduleText(id, plate, entry, "0" x 64)) equals the committed value for each of the 8', async () => {
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const pl = await import(/* @vite-ignore */ url('tools/plates/gen/plates.mjs'));
    const want = JSON.parse(readFileSync('tests/howto/fixtures/moduletext-shas.json', 'utf8'));
    const latest = g.latestEntries(JSON.parse(readFileSync(g.GOLDEN_JSON, 'utf8')).entries);
    const plates = g.extractPlates(readFileSync(g.FIXTURE, 'utf8'));
    expect(plates).toHaveLength(8);
    expect(want.count).toBe(8);
    for (const p of plates) { const id = g.LIB_OF[p.chromeId]; expect(g.sha256(pl.moduleText(id, p, latest.get(id), '0'.repeat(64))), id).toBe(want.shas[id]); }
  });
});

describe('L2-A21: hand-pair chunks (gen/handpairs.mjs, design 12, D-LIB7-1)', () => {
  let hp: any, idsGen: any, reg: any;
  const FIX = 'tests/howto/fixtures/handpairs/pairs.mjs';
  beforeAll(async () => {
    hp = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
    idsGen = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
    reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
  });
  it('with the repo\'s own pair loader (or none): the written pairs and HAND\'s pair imports follow the shipped rows\' keys', async () => {
    const pairs = await hp.loadPairs(), written = [...out.keys()].filter(p => p.includes('/handpair-'));
    const loaders = readFileSync('src/howto/generated/loaders.ts', 'utf8');
    if (pairs) {   // LIB-2b: a tree with a pair loader (LIB-7, or a fixture): the written pairs follow the shipped rows' keys
      const { keys } = hp.pairsOf(pairs, reg.shippedIds());
      expect(Object.keys(pairs.HAND_OF_ID).length).toBeGreaterThan(0);   // D-LIB7FIX-A21: LIB-7's loader lands before any row ships a key, so keys may be []; a shipped row that needs a pair and has none is refused by gen/ids.mjs missingChunks in this file's beforeAll render
      expect(hp.pairProblems(pairs, reg.shippedIds(), written, keys)).toEqual([]);
      expect([...new Set([...loaders.matchAll(/import\('\.\/handpair-([a-z0-9-]+)'\)/g)].map(m => m[1]))].sort()).toEqual([...new Set(keys)].sort());   // LIB-7b (D-LIB7b-SCRATCH2 P3): sets on both sides; two ids on one key import its chunk twice
      return;
    }
    expect(written).toEqual([]);
    expect(loaders).not.toMatch(/handpair-/);
    expect(hp.pairProblems(null, reg.shippedIds(), [], [])).toEqual([]);
  });
  it('with a pair loader: one handpair-<key>.ts per key a shipped id uses, each hashed over its own key\'s inputs only; HAND maps each pair exercise to its key\'s chunk', async () => {
    const pairs = await hp.loadPairs(FIX);
    const o = await hp.outputs({ pairsFile: FIX });
    expect(o.map((x: any) => x.path)).toEqual(['src/howto/generated/handpair-bar-grip.ts', 'src/howto/generated/handpair-d-handle.ts']);
    expect(o[0].inputs).toContain('tests/howto/fixtures/handpairs/bar-grip.json');
    expect(o[0].inputs).not.toContain('tests/howto/fixtures/handpairs/d-handle.json');
    expect(o[0].text).toContain('export const panel = "<div class=\\"zx\\" id=\\"pair-bar-grip\\"');
    const { pairOf, keys } = hp.pairsOf(pairs, reg.shippedIds());
    expect(pairOf).toEqual({ 'pull-up': 'bar-grip', 'lat-pulldown': 'bar-grip', 'leg-press': 'd-handle' });
    expect(keys).toEqual(['bar-grip', 'd-handle']);
    // with no per-id hand chunk (has = false), every pair exercise's HAND entry is its key's shared chunk
    const text = idsGen.htIndexText([], idsGen.chunkMaps(reg.rows().filter((r: any) => reg.shippedIds().includes(r.id)), () => false, pairOf));
    // D-LIB2b-HANDCSS: each pair line loads that exercise's zoom-<chromeId>.css first (the shared chunk imports no CSS)
    expect([...text.matchAll(/^ {2}"([a-z-]+)": \(\) => import\('\.\.\/\.\.\/slices\/howto\/css\/zoom-\1\.css'\)\.then\(\(\) => import\('\.\/handpair-([a-z-]+)'\)\),$/gm)].map(m => [m[1], m[2]])).toEqual([['pull-up', 'bar-grip'], ['lat-pulldown', 'bar-grip'], ['leg-press', 'd-handle']]);
    const loaderKeys = [...new Set([...text.matchAll(/import\('\.\/handpair-([a-z-]+)'\)/g)].map(m => m[1]))];
    expect(hp.pairProblems(pairs, reg.shippedIds(), o.map((x: any) => x.path), loaderKeys)).toEqual([]);
  });
  it('red on an empty pair registry, a missing file and a key missing from PAIR_LOADERS; the name never matches HT-6\'s hand-*.ts', async () => {
    const pairs = await hp.loadPairs(FIX), files = ['src/howto/generated/handpair-bar-grip.ts', 'src/howto/generated/handpair-d-handle.ts'];
    expect(hp.pairProblems({ HAND_OF_ID: {} }, reg.shippedIds(), [], [])).toEqual(['empty pair registry']);
    expect(hp.pairProblems(pairs, reg.shippedIds(), files.slice(1), ['bar-grip', 'd-handle'])).toHaveLength(1);
    expect(hp.pairProblems(pairs, reg.shippedIds(), files, ['bar-grip'])).toHaveLength(1);
    expect(hp.pairPath('curl')).not.toMatch(/\/hand-/);
  });
});

describe('L2-A2: the plates page builder (2.7, taken byte for byte from LIB-8 #109) rebuilds golden A from the 8', () => {
  it('golden A e2bea90c…, 860,766 B, from the vendored builder\'s 8 groups, which are exactly the registry\'s 8 rows', async () => {
    const bp = await import(/* @vite-ignore */ url('tools/plates/library/build-page.mjs'));
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const cfg = await bp.goldenAConfig();
    const ids = cfg.groups.flatMap((x: any) => x.ids) as string[];
    expect(ids).toHaveLength(8);
    // LIB-4a (D-LIB4-PINS-2): golden A is the registry's 8 (goldenRows), whatever the batches add
    expect([...ids].sort()).toEqual(Object.values(reg.goldenRows()).map((r: any) => r.src === 'ref-src' ? 'lateral_raise' : r.src.replace(/^exercises\//, '').replace(/\.mjs$/, '')).sort());
    const { html } = await bp.buildPlatesPage(cfg);
    expect(html.length).toBe(g.PINS.pageBytes);
    expect(g.sha256(html)).toBe(g.PINS.pageSha256);
    const swapped = { ...cfg, groups: cfg.groups.map((x: any) => ({ ...x, ids: [...x.ids].reverse() })) };
    expect(g.sha256((await bp.buildPlatesPage(swapped)).html)).not.toBe(g.PINS.pageSha256);
  }, 120_000);
});

describe('L2-A2 (registry): the plates page config comes from the registry, in order', () => {
  it('pages/golden-a.json through the registry gives golden A\'s groups exactly (order and content) and rebuilds e2bea90c…', async () => {
    const pp = await import(/* @vite-ignore */ url('tools/plates/library/plates-page.mjs'));
    const bp = await import(/* @vite-ignore */ url('tools/plates/library/build-page.mjs'));
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const cfg = await pp.pageConfig('tools/plates/library/pages/golden-a.json'), want = await bp.goldenAConfig();
    expect(cfg.groups.flatMap((x: any) => x.ids)).toHaveLength(8);
    expect(cfg.groups).toEqual(want.groups);
    expect(Object.entries(cfg.sources)).toEqual(Object.entries(want.sources));
    const { html } = await bp.buildPlatesPage(cfg);
    expect(g.sha256(html)).toBe(g.PINS.pageSha256);
    expect(html.length).toBe(g.PINS.pageBytes);
  }, 120_000);
  it('refuses a page with no ids and an id with no registry row', async () => {
    const pp = await import(/* @vite-ignore */ url('tools/plates/library/plates-page.mjs'));
    await expect(pp.pageConfig('tests/howto/fixtures/batches/lb-test.json')).rejects.toThrow(/names no ids/);
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    await expect(pp.pageConfig('tools/plates/library/pages/golden-a.json', reg.rows().slice(1))).rejects.toThrow(/lib_dumbbell_lateral_raise has no registry row/);
  });
});

describe('L2-A5: exercises.json is an input of ids.ts and its twin', () => {
  it('a new exercises.json id stales ids.ts and ids-node.mjs (their per-output inputs name it)', async () => {
    const idsGen = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs'));
    for (const p of ['src/howto/ids.ts', 'tools/plates/library/ids-node.mjs', 'src/howto/lib-id.ts', 'src/howto/coverage.ts']) expect(idsGen.inputsFor(p), p).toContain('src/data/exercises.json');
    const ids = out.get('src/howto/ids.ts')!;
    expect(ids.writers).toEqual(['tools/plates/gen/content.mjs', 'tools/plates/gen/ids.mjs']);
  });
});

describe('D-LIB2-layers: content.mjs narrows inputs per exercise', () => {
  it('each of the 8 modules and research cards is hashed over its own exercise source only (8 ids)', async () => {
    const content = await import(/* @vite-ignore */ url('tools/plates/gen/content.mjs'));
    const reg = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const rows = reg.goldenRows() as Record<string, { slug: string }>;
    const ids = Object.keys(rows);
    expect(ids).toHaveLength(8);
    const sources = ids.map(id => reg.sourceOf(id));
    const { closureOf } = await import(/* @vite-ignore */ url('tools/plates/library/inputs-closure.mjs'));
    for (const id of ids) {
      const own = reg.sourceOf(id);
      // LIB-2b (D-LIB2b-CLOSURE): its own source's import closure; another exercise's source only when its own imports it
      // (hanging_leg_raise.howto.mjs imports pull_up.howto.mjs)
      const mine = (closureOf([own]) as string[]).filter(p => sources.includes(p));
      expect(mine).toContain(own);
      for (const path of [`src/howto/generated/ht-${rows[id]!.slug}.ts`, `docs/research/howto/${id}.json`]) {
        const ins = content.inputsFor(path) as string[];
        expect(ins, path).toContain(own);
        expect(ins.filter(p => sources.includes(p)).sort(), path).toEqual([...mine].sort());
      }
    }
  });
});
