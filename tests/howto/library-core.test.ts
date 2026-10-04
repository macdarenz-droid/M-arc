// LIB-2 (library plan 5.2, 5.3; design docs/howto/library/LIB-2-DESIGN.md): the scale core. Each block names its
// design acceptance id (L2-A*). Every sweep asserts its count and is shown red on an empty input.
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

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
    expect(g.verifyVendor(undefined, bad)).toContain(`${k}: source abc1234:docs/howto/technical-plate/x is not a bc0f378 blob, the ref-src commit or a golden update (7859292, de00174, 48153c4: LIB-25 poly; f214700: LIB-26 flat palm)`);
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
    const all = reg.rows();
    expect(all).toHaveLength(8);
    expect(all.map((r: any) => r.id)).toEqual(Object.keys(plates()));
    expect(reg.shippedIds(all)).toHaveLength(8);
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
