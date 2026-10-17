// LIB-9a (lib-9a-card Do 3, Do 4, Do 6; acceptance A2-A11; rulings D-LIB9a-NOTE, lib4-cards section 13): the LB1
// build-ahead plates. Node only: the browser half of the plate QA runs in tools/plates/library/lb1/qa.mjs (Chromium is
// not installed when CI runs `npm run check`). Every test reads what is drawn or written, never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB1 = ['chin_up', 'hanging_knee_raise', 'assisted_pull_up', 'inverted_row', 'close_grip_pulldown', 'underhand_lat_pulldown',
  'single_arm_lat_pulldown', 'straight_arm_pulldown', 'chest_supported_row', 'resistance_band_row', 'incline_machine_press',
  'shoulder_press', 'horizontal_leg_press', 'leg_press_calf_raise'];
const IDS = LB1.map(i => `lib_${i}`);
const ROWS = 'tools/plates/library/lb1/rows.json';
const COMPOSERS = ['assistMachine', 'chestRowMachine', 'band', 'dHandle', 'polybar'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const hyp = (a: number[], b: number[]) => Math.hypot(a[1]! - b[1]!, a[2]! - b[2]!);

let eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, parts: any, golden: any, muts: any;
let assist: any, chestRow: any, band: any, dh: any, apu: any, cgp: any, apuMod: any, build: any, cand: any, closure: any, reg: any;
let pins: any, E: any, mirror = '', html = '', all: any;
beforeAll(async () => {
  [eng, body, qaNode, qaEng, qaIdx, plate, parts, assist, chestRow, band, dh, build, cand, closure, reg, muts] = await Promise.all([
    'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs', 'eq/parts.mjs',
    'eq/assistMachine.mjs', 'eq/chestRowMachine.mjs', 'eq/band.mjs', 'eq/dHandle.mjs', 'lb1/build.mjs', 'candidate.mjs', 'inputs-closure.mjs',
    'registry.mjs', 'qa/mutations.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  golden = await import(/* @vite-ignore */ new URL('../../tools/plates/golden.mjs', import.meta.url).href);
  pins = qaIdx.loadPins();
  apuMod = await import(/* @vite-ignore */ lib('specs/assisted_pull_up.mjs'));
  apu = apuMod.default;
  cgp = (await import(/* @vite-ignore */ lib('specs/close_grip_pulldown.mjs'))).default;
  mirror = golden.makeMirror();
  E = await qaEng.loadEngine(mirror);
  all = build.lb1All();
  html = (await build.buildLb1Page({ all })).html.toString('utf8');
}, T);
afterAll(() => { if (mirror) qaEng.dropMirror(mirror); });

// The engine the QA uses on the vendored files (L0 pins them).
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
/** Every equipment item a spec draws in one pose (functions called as the engine calls them). */
const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
  const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
  const ctx = { pose, start: L.lm.start, mistake, body: L.body };
  const out: any[] = [];
  spec.equipment.forEach((e: any, i: number) => {
    for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
  });
  return { items: out, lm };
};
const h9 = (spec: any) => {
  let R: any = null;   // as runQa: a spec the engine refuses to render is still checked on its static entries
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins.envelope }, R).map((p: any) => p.key);
};
/** The two ends of a polyBar outline: a between pts 6/7, b between 2/3 (eq/polybar.mjs). */
const barEnds = (it: any): [number[], number[]] => {
  const p = it.pts, mid = (u: number[], v: number[]) => u.map((x, k) => (x + v[k]!) / 2);
  return [mid(p[6], p[7]), mid(p[2], p[3])];
};
const isPad = (it: any) => it.type === 'poly' && it.part === 'pad' && it.z === 'center';

describe('LIB-9a Do 3 / A2: composers draw what they claim', { timeout: T }, () => {
  it('composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const f of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${f}.mjs`, 'utf8');
      expect(src, f).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, f).not.toMatch(/layers\//);
    }
  });

  it('every item the slice plates draw is a PRIMITIVES type, in every pose', () => {
    for (const spec of [apu, cgp]) for (const pose of ['start', 'end', 'mistake'])
      for (const it of itemsIn(spec, pose).items) expect(Object.keys(eng.PRIMITIVES), `${spec.id} ${pose}`).toContain(it.type);
  });

  it('the slice plates pass PQ-H9 (every part that moves between the end and the Mistake is poly or a pinned line type)', () => {
    expect(h9(apu)).toEqual([]);
    expect(h9(cgp)).toEqual([]);
  });

  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    expect(h9({ ...cgp, equipment: [...cgp.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });

  // D-LIB9a-NOTE Q4. The swap replaces exactly one item, the z 'center' poly with part 'pad', in exactly one entry.
  const swapPad = (to: (it: any) => any) => {
    const hits = new Set<number>();
    const spec = { ...apu, equipment: apu.equipment.map((e: any, i: number) => (typeof e !== 'function' ? e
      : (lm: any, ctx: any) => [].concat(e(lm, ctx) ?? []).map((it: any) => (it && isPad(it) ? (hits.add(i), to(it)) : it)))) };
    return { spec, hits };
  };
  const PAD_ENTRY = () => { const i = itemsIn(apu, 'end').items.filter(isPad).map(it => it.entry); expect(i.length).toBe(1); return i[0]; };
  it('a moving box pad keeps a closed outline, so the Mistake still draws it and H9 is green (premise asserted)', () => {
    const { spec, hits } = swapPad(it => ({ type: 'box', at: [0, it.pts[0][1] - 0.04, (it.pts[0][2] + it.pts[1][2]) / 2], w: 0.32, h: 0.08, part: 'pad' }));
    const i = PAD_ENTRY(), R = plate.renderPlate(spec, { id: 'x-n' });
    const it = qaEng.equipmentItems(Eng(), spec, R.report), key = `eq${i}.box.0`;
    expect([...hits]).toEqual([i]);
    for (const pose of ['end', 'mistake']) expect(it[pose].get(key)?.poly, `${pose} ${key}`).toBeTruthy();
    expect(it.end.get(key).d).not.toBe(it.mistake.get(key).d);
    expect(h9(spec)).toEqual([]);
  });
  it('mutation: the real knee pad drawn as a moving rackUpright (no poly, not an H9 line type) gives exactly H9.moving-line:eq<i>.rackUpright.1', () => {
    // rackUpright's hole marks (j=1) are a moving item with no poly whose type is not in H9lineTypes: LIB-3's M6 key family
    const i = PAD_ENTRY();
    const { spec } = swapPad(it => ({ type: 'rackUpright', at: [0, it.pts[0][1] - 0.5, it.pts[0][2]], h: 0.5, part: 'pad' }));
    expect(h9(spec)).toEqual([`H9.moving-line:eq${i}.rackUpright.1`]);
    const still = swapPad(() => ({ type: 'rackUpright', at: [0, 0.2, -0.3], h: 0.5, part: 'pad' })).spec;
    expect(h9(still)).toEqual([]);
  });

  it('assistMachine: in every pose the drawn lever runs from the pivot to the lever end at its length (within 1 mm)', () => {
    const M = apuMod.MACHINE;
    for (const pose of ['start', 'end', 'mistake', 'ghost0', 'ghost1']) {
      const its = itemsIn(apu, pose).items, lever = its.filter(it => it.type === 'poly' && it.part === 'pad' && it.z === 'back');
      expect(lever.length, pose).toBe(2);   // lever and bracket
      const [a, b] = barEnds(lever[0]);
      expect(hyp(a, M.pivot), `${pose} lever at the pivot`).toBeLessThan(0.001);
      expect(Math.abs(hyp(a, b) - M.lever), `${pose} lever length`).toBeLessThan(0.001);
      const [c] = barEnds(lever[1]);
      expect(hyp(b, c), `${pose} bracket on the lever end`).toBeLessThan(0.001);
    }
  });
  it('assisted_pull_up: in start, end and Mistake the knee is one kneecap radius over the drawn pad top (within 1 cm) and over the pad', () => {
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(apu, pose), pad = items.filter(isPad);
      expect(pad.length, pose).toBe(1);
      const top = Math.max(...pad[0].pts.map((p: number[]) => p[1])), zs = pad[0].pts.map((p: number[]) => p[2]);
      expect(Math.abs(lm['knee.r'][1] - top - assist.KNEE_R * 1.75), `${pose} knee over the pad top`).toBeLessThan(0.01);
      expect(lm['knee.r'][2], `${pose} knee behind the pad front`).toBeLessThanOrEqual(Math.max(...zs));
      expect(lm['knee.r'][2], `${pose} knee in front of the pad rear`).toBeGreaterThanOrEqual(Math.min(...zs));
    }
  });
  it('assisted_pull_up: the knee-on-pad checks pass in all three poses', () => {
    const r = plate.renderPlate(apu, { id: 'x' });
    const knee = r.report.checks.filter((k: any) => k.landmark === 'knee.r');
    expect(knee.map((k: any) => k.pose).sort()).toEqual(['end', 'mistake', 'start']);
    for (const k of knee) expect(k.cm).toBeLessThanOrEqual(1);
    expect(r.report.issues).toEqual([]);
  });
  it('assisted_pull_up: the start pad, bracket and lever are a dashed phantom in the end pose, never in the Mistake pose', () => {
    const start = itemsIn(apu, 'start').items.filter(it => it.part === 'pad' && it.type === 'poly');
    const ph = itemsIn(apu, 'end').items.filter(it => it.part === 'phantom');
    expect(ph.length).toBe(3);
    for (const p of ph) expect(p).toMatchObject({ type: 'line', cls: 'eq-line m-line' });
    expect(ph.map(p => JSON.stringify(p.pts.slice(0, -1)))).toEqual(start.map(s => JSON.stringify(s.pts)));
    expect(itemsIn(apu, 'mistake', { mistake: true }).items.filter(it => it.part === 'phantom')).toEqual([]);
  });

  it('chestRowMachine: the drawn lever runs from the pivot to a handle on its circle; dHandle rails end at the ring', () => {
    const cfg = { seat: [0, 0.45, 0], pad: { face: [0, 1.2, 0.3] }, pivot: [0, 1.6, 0.5], lever: 0.55, column: 0.7, footBar: [0, 0.1, 0.5], floor: [-0.5, 1] };
    for (const grips of [[0, 1.15, 0.35], [0, 1.2, 0.1]]) {
      const its = chestRow.chestRowMachine(cfg)({ grips }, {}), lever = its.filter((x: any) => x.part === 'lever');
      const [a, b] = barEnds(lever[0]);
      expect(hyp(a, cfg.pivot)).toBeLessThan(0.001);
      expect(Math.abs(hyp(a, b) - cfg.lever)).toBeLessThan(0.001);
      const [g0, g1] = barEnds(lever[1]), hc = g0.map((v, k) => (v + g1[k]!) / 2);
      expect(hyp(hc, b)).toBeLessThan(0.001);
    }
    const lm = itemsIn(apu, 'end').lm, toward = () => [0, 0.6, 0.8];
    const its = dh.dHandle({ grip: (l: any) => l['grip.r'], toward })(lm, {}), ring = dh.dHandleRing(lm['grip.r'], toward(), 0.13);
    for (const rail of its.slice(1, 3)) expect(hyp(barEnds(rail)[1], ring)).toBeLessThan(0.001);
    expect(hyp(lm['grip.r'], ring)).toBeCloseTo(0.13, 9);
  });

  it('band: both strands end on the fists and start on the sole loop', () => {
    const { lm } = itemsIn(apu, 'end'), out = band.band()(lm, {}), A = band.bandAnchor(lm, 'r', 0.008);
    for (const [i, side] of [[1, 'l'], [2, 'r']] as const) {
      const [a, b] = barEnds(out[i]);
      expect(hyp(a, A.leave)).toBeLessThan(0.002);
      expect(hyp(b, lm[`grip.${side}`])).toBeLessThan(0.002);
    }
  });

  it('close_grip_pulldown: the stack rises as the handle comes down, and its cable ends on the stack top (end and Mistake)', () => {
    const LIFT0 = 0.03;
    for (const pose of ['end', 'mistake']) {
      const its = itemsIn(cgp, pose).items, st = its.find(it => it.type === 'stack'), cab = its.find(it => it.type === 'cable' && it.part === 'stack');
      expect(st.lift, `${pose} lift`).toBeGreaterThan(LIFT0);
      expect(cab.to[1], `${pose} cable end`).toBeGreaterThanOrEqual(0.06 + st.plates * 0.025 + st.lift - 1e-9);
    }
  });

  it('each composer returns exactly its *_ITEMS parts at most, so perItem() drops none', () => {
    const ends = { start: itemsIn(apu, 'start').lm, end: itemsIn(apu, 'end').lm };
    const full = assist.assistMachine(apuMod.MACHINE)(ends.end, { pose: 'end', start: ends.start });
    expect(full.length).toBe(assist.ASSIST_ITEMS);
    const cfgC = { seat: [0, 0.45, 0], pad: { face: [0, 1.2, 0.3] }, pivot: [0, 1.6, 0.5], lever: 0.5, column: 0.7, footBar: [0, 0.1, 0.5], floor: [-0.5, 1] };
    expect(chestRow.chestRowMachine(cfgC)(ends.end, {}).length).toBe(chestRow.CHEST_ROW_ITEMS);
    expect(band.band()(ends.end, {}).length).toBe(band.BAND_ITEMS);
    expect(dh.dHandle({ grip: (l: any) => l['grip.r'], toward: () => [0, 1, 0] })(ends.end, {}).length).toBe(dh.D_HANDLE_ITEMS);
    expect(parts.perItem(() => [1, 2], 3).length).toBe(3);
  });
});

describe('LIB-9a A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const drawn = () => Object.values<any>(readJson(ROWS).rows).filter(r => existsSync(`tools/plates/${r.src}`)).map(r => `tools/plates/${r.src}`);
  it('every drawn LB1 spec: closureOf passes, holds the vendor MANIFEST, and nothing under tools/plates/layers/', () => {
    expect(drawn().length).toBeGreaterThanOrEqual(2);
    for (const f of drawn()) {
      const c = closure.closureOf([f]);
      expect(c, f).toContain('tools/plates/vendor/MANIFEST.json');
      expect(c.filter((p: string) => p.startsWith('tools/plates/layers/')), f).toEqual([]);
    }
  });
  // A scratch copy of the library and vendor trees, so a planted edit never touches the repo.
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb1-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  it('mutation: readFileSync added to a composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/assistMachine.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf(['tools/plates/library/specs/assisted_pull_up.mjs'], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs puts a layers path in its closure (red)', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/specs/close_grip_pulldown.mjs'); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try {
      const c = closure.closureOf(['tools/plates/library/specs/close_grip_pulldown.mjs'], root);
      expect(c.filter((p: string) => p.startsWith('tools/plates/layers/')).length).toBeGreaterThan(0);
    } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-9a A5: lb1/rows.json holds exactly the 14 LB1 ids, all mode H', () => {
  /** Row keys counted in the raw text, so a duplicated key (which JSON.parse would merge) is seen. */
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of IDS) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!IDS.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  it('each plan 6.2 LB1 id exactly once in the raw text, nothing else', () => {
    expect(a5(readFileSync(ROWS, 'utf8'))).toEqual([]);
  });
  it('mutations: a dropped row and a duplicated row are both red', () => {
    const text = readFileSync(ROWS, 'utf8'), j = readJson(ROWS);
    const drop = { ...j, rows: { ...j.rows } }; delete drop.rows.lib_chin_up;
    expect(a5(JSON.stringify(drop, null, 1))).toEqual(['lib_chin_up x0']);
    const dup = text.replace('  "lib_chin_up": {', `  "lib_chin_up": ${JSON.stringify(j.rows.lib_chin_up)},\n  "lib_chin_up": {`);
    expect(a5(dup)).toEqual(['lib_chin_up x2']);
  });
  it('every row points at its own spec file, carries the census view, and is mode H (14 H, 0 D; the guard for the H10 gap)', () => {
    const rows = readJson(ROWS).rows;
    for (const [id, r] of Object.entries<any>(rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
    }
    expect(Object.values<any>(rows).map(r => r.mode)).toEqual(Array(14).fill('H'));
    expect(readJson(ROWS)).toMatchObject({ batch: 'LB1', censusRef: '4a9fd86' });
  });
});

describe('LIB-9a A9: nothing ships (D-LIB4-ENTRY-2)', { timeout: T }, () => {
  it('every LB1 row is at stage drawing or review', () => {
    for (const [id, r] of Object.entries<any>(readJson(ROWS).rows)) expect(['drawing', 'review'], id).toContain(r.stage);
  });
  it('no LB1 id is shipped, even with lb1/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(14);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  it('no LB1 id is in any tools/plates/library/batches/ file', () => {
    const dir = 'tools/plates/library/batches';
    for (const f of readdirSync(dir).filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join(dir, f), 'utf8');
      for (const id of IDS) expect(text, `${f} names ${id}`).not.toMatch(new RegExp(`\\b${id}\\b`));
    }
  });
  /** Problems of a golden/library listing [[name, text]]: an LB1 id or slug as a whole token, an LB1 batch file name,
   *  or text naming batch LB1. */
  const goldenProblems = (files: [string, string][]) => {
    const bad: string[] = [];
    for (const [name, text] of files) {
      if (/lb1/i.test(name)) bad.push(`${name}: an LB1 batch file name`);
      if (/"batch"\s*:\s*"LB1"/.test(text)) bad.push(`${name}: names batch LB1`);
      for (const id of LB1) {
        const slug = id.replace(/_/g, '-');
        if (new RegExp(`\\b(lib_)?${id}\\b`).test(`${name}\n${text}`)) bad.push(`${name}: ${id}`);
        if (new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(`${name}\n${text}`)) bad.push(`${name}: ${slug}`);
      }
    }
    return bad;
  };
  it('no LB1 id, slug or batch is in tests/howto/golden/library/', () => {
    const dir = 'tests/howto/golden/library';
    const files: [string, string][] = existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : [];
    expect(goldenProblems(files)).toEqual([]);
  });
  it('mutations: a page-only lb1.json and chin-up.layers.html are red; a file naming only lib_dumbbell_shoulder_press stays green', () => {
    expect(goldenProblems([['lb1.json', '{"entries":[{"kind":"page","batch":"LB1"}]}']]).length).toBeGreaterThan(0);
    expect(goldenProblems([['chin-up.layers.html', '<div data-id="chin-up"></div>']]).length).toBeGreaterThan(0);
    expect(goldenProblems([['lb2.json', '{"id":"lib_dumbbell_shoulder_press"}']])).toEqual([]);
  });
  it('generate --check is green, and no generated file is read from lb1/, the LB1 specs or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    for (const [p, { text }] of out) expect(text, p).not.toMatch(/library\/(lb1|specs|howto)\//);
  });
});

describe('LIB-9a A8 (Do 4, D-LIB9-AUTHORQA): the authoring option', { timeout: T }, () => {
  it('returns the candidate with exemptions [] and reads no pin; the default path with no pin still throws', async () => {
    const c = await cand.candidateOf('lib_close_grip_pulldown', { all, platesHtml: html, engine: E, authoring: true });
    expect(c.exemptions).toEqual([]);
    expect(c.research.topFault).toBe('low');
    await expect(cand.candidateOf('lib_close_grip_pulldown', { all, platesHtml: html, engine: E })).rejects.toThrow(/batch golden|golden file|pin/i);
  });
  it('mutations: authoring on a shipped row and on an approved-plate row both throw', async () => {
    for (const stage of ['shipped', 'approved-plate']) {
      const data = build.lb1Data(); data.rows.lib_close_grip_pulldown = { ...data.rows.lib_close_grip_pulldown, stage };
      await expect(cand.candidateOf('lib_close_grip_pulldown', { all: build.lb1All(undefined, data), platesHtml: html, engine: E, authoring: true }))
        .rejects.toThrow(/authoring QA is refused/);
    }
  });
});

describe('LIB-9a A4, A6 and Q1: runQa node half on the LB1 slice', { timeout: T }, () => {
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  const candOf = (id: string, page = html, a = all) => cand.candidateOf(id, { all: a, platesHtml: page, engine: E, authoring: true });
  it('clean: both slice plates have no node-half problem; F7 is down and only F5 waits on the browser half', async () => {
    for (const id of ['lib_close_grip_pulldown', 'lib_assisted_pull_up']) {
      const r = await qa(await candOf(id));
      expect(node(r), id).toEqual([]);
      expect(r.flags.F7.raised, id).toBe(false);
      expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5'].includes(f)), id).toEqual([]);
    }
  });
  // A spec mutation, built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const pageWith = async (id: string, fn: string, arg: any) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb1-mut-')), file = join(dir, `${id}.mjs`);
    writeFileSync(file, `import s from ${JSON.stringify(pathToFileURL(join(process.cwd(), `tools/plates/library/specs/${id}.mjs`)).href)};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    const spec = (await import(/* @vite-ignore */ pathToFileURL(file).href)).default;
    const data = build.lb1Data(); data.rows[`lib_${id}`] = { ...data.rows[`lib_${id}`] };
    const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
      groups: [{ id: 'lb1', title: 'LB1', ids: [id] }], sources: { [id]: ['mutation'] }, specs: { [id]: file } });
    rmSync(dir, { recursive: true, force: true });
    return { spec, page: h.toString('utf8') };
  };
  const mutated = async (id: string, fn: string, arg: any = null) => {
    const { spec, page } = await pageWith(id, fn, arg);
    return { ...(await candOf(`lib_${id}`, page)), spec };
  };
  const M = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(id));
  it('A4 M1 a label 1 px onto the figure (LIB-3 M1 on the chin callout) turns PQ-H1 red', async () => {
    const a = M('M1').prepare(E, cgp);
    const c = { ...(await candOf('lib_close_grip_pulldown')), spec: M('M1').fn(cgp, a) };
    expect(node(await qa(c)).some((k: string) => k.startsWith('H1.engine:normal:figure:'))).toBe(true);
  });
  it('A4 M2 a contact 1 cm off (the thigh-pad plane moved 1 cm) turns PQ-H1 red', async () => {
    const shift = (s: any) => ({ ...s, checks: s.checks.map((k: any) => (k.landmark === 'thighTop.r' ? { ...k, plane: { ...k.plane, point: [k.plane.point[0], k.plane.point[1] + 0.011, k.plane.point[2]] } } : k)) });
    const c = { ...(await candOf('lib_close_grip_pulldown')), spec: shift(cgp) };
    expect(node(await qa(c)).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A4 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = M('M3').prepare(E, cgp, pins.envelope);
    const c = await mutated('close_grip_pulldown', '(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    // as LIB-3's M4, plus the plate's own `mistake.parts` list dropped: a listed part is outlined even when it equals the end
    const c = await mutated('close_grip_pulldown', 's => ({ ...s, mistake: { ...s.mistake, pose: {}, parts: undefined } })');
    expect(node(await qa(c))).toContain('H3.mistake-outline');
  });
  it('A4 M5 the start equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('close_grip_pulldown', 's => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] } })');
    expect(node(await qa(c))).toContain('H3.start-is-end');
  });
  it('A4 M6 an unapproved type (rackUpright) as a moving line part turns PQ-H9 red', async () => {
    const extra = (lm: any, ctx: any) => ({ type: 'rackUpright', at: [0, 0, ctx.pose === 'mistake' ? 1.3 : 1.22], h: 0.5 });
    const c = { ...(await candOf('lib_close_grip_pulldown')), spec: { ...cgp, equipment: [...cgp.equipment, extra] } };
    expect(node(await qa(c)).some((k: string) => k.startsWith(`H9.moving-line:eq${cgp.equipment.length}.rackUpright.`))).toBe(true);
  });
  it('A4 M7 an unknown equipment type turns PQ-H9 red', async () => {
    const c = { ...(await candOf('lib_close_grip_pulldown')), spec: { ...cgp, equipment: [...cgp.equipment, { type: 'rope3d', at: [0, 0, 0] }] } };
    expect(node(await qa(c)).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('A4 a colour literal turns PQ-H2 red (H2.colour)', async () => {
    const c = await candOf('lib_close_grip_pulldown');
    const m = muts.CANDIDATE_MUTATIONS.find((x: any) => x.id.startsWith('M9 '));
    expect(node(await qa(m.apply(c))).some((k: string) => k.startsWith('H2.colour:'))).toBe(true);
  });
  it('A6: a fact +3° turns H6 red (the same fact at the drawn value is green); the card path removed gives H6:no-card', async () => {
    const c = await candOf('lib_close_grip_pulldown');
    const drawn = plate.renderPlate(cgp, { id: 'x' }).report.angles.end['knee.r'];
    const at = (deg: number) => ({ ...c, research: { ...c.research, plateFacts: [...c.research.plateFacts, { kind: 'angle', joint: 'knee.r', pose: 'end', deg, claim: 'test' }] } });
    expect(node(await qa(at(drawn))).filter((k: string) => k.startsWith('H6'))).toEqual([]);
    expect(node(await qa(at(drawn + 3))).some((k: string) => k.startsWith('H6.fact:'))).toBe(true);
    expect(node(await qa({ ...c, research: null }))).toContain('H6:no-card');
  });
  it('Q1: one spec\'s first Mistake tell key changed (real page rebuild) raises F7', async () => {
    const c = await mutated('close_grip_pulldown', 's => ({ ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((t, i) => (i === 0 ? { ...t, key: "under" } : t)) } })');
    const r = await qa(c);
    expect(c.mistakeFault).toBe('under');
    expect(r.flags.F7.raised).toBe(true);
  });
});

describe('LIB-9a Q5 / A7 and A4 (H10): the D path on an in-memory D copy of lib_close_grip_pulldown', { timeout: T }, () => {
  const dAll = (params: any) => {
    const data = build.lb1Data(), r = data.rows.lib_close_grip_pulldown;
    data.rows.lib_close_grip_pulldown = { ...r, mode: 'D', parent: 'lib_lat_pulldown', params };   // replaced, not added
    return build.lb1All(undefined, data);
  };
  const h10 = async (params: any, change?: (c: any) => any) => {
    let c = await cand.candidateOf('lib_close_grip_pulldown', { all: dAll(params), platesHtml: html, engine: E, authoring: true });
    if (change) c = change(c);
    return (await qaNode.h10(c)).map((p: any) => p.key);
  };
  it('clean: the plan parent lib_lat_pulldown rebuilt alone matches its GOLDEN.json fragments (H10\'s checks bite; not "a valid D")', async () => {
    expect(await h10({ 'camera.maxScale': 1 })).toEqual([]);
    expect(readJson(ROWS).rows.lib_close_grip_pulldown.mode).toBe('H');   // nothing written
  });
  it('mutation A7: a key outside PARAMS gives H10.unknown', async () => {
    expect(await h10({ gripWidth: 0.5 })).toEqual(['H10.unknown:gripWidth']);
  });
  it('mutation A4: a raw-spec key gives H10.raw', async () => {
    expect(await h10({ tempo: [] })).toEqual(['H10.raw:tempo']);
  });
  it('mutation: one byte of one parent fragment changed in memory gives H10.byte', async () => {
    const keys = await h10({ 'camera.maxScale': 1 }, c => ({ ...c, derivation: { ...c.derivation, parentFragments: { ...c.derivation.parentFragments, tempo: `0${c.derivation.parentFragments.tempo.slice(1)}` } } }));
    expect(keys).toEqual(['H10.byte:tempo']);
  });
});

describe('LIB-9a A10: the LB1 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds are byte-identical', async () => {
    expect(sha((await build.buildLb1Page({ all })).html)).toBe(sha(html));
  });
});

describe('LIB-9a A11 and Q3: the card fields and the ruled tempo map', () => {
  // The ruled table (D-LIB9a-NOTE Q3, lib4-cards section 13 @ 8669e21): phase names, order and source field per id.
  // Copied from the ruling, never read from tempo.json or a spec. The ruled constant set is empty.
  const RULED: Record<string, [string, string][]> = {
    chin_up: [['Pull', 'up'], ['Hold', 'pause'], ['Lower', 'down']], hanging_knee_raise: [['Lift', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    assisted_pull_up: [['Lower', 'down'], ['Pull', 'up'], ['Hold', 'pause']], inverted_row: [['Pull', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    close_grip_pulldown: [['Pull', 'up'], ['Return', 'down']], underhand_lat_pulldown: [['Pull', 'up'], ['Return', 'down']],
    single_arm_lat_pulldown: [['Pull', 'up'], ['Hold', 'pause'], ['Return', 'down']], straight_arm_pulldown: [['Pull', 'up'], ['Hold', 'pause'], ['Return', 'down']],
    chest_supported_row: [['Pull', 'up'], ['Hold', 'pause'], ['Return', 'down']], resistance_band_row: [['Pull', 'up'], ['Return', 'down']],
    incline_machine_press: [['Press', 'up'], ['Hold', 'pause'], ['Return', 'down']], shoulder_press: [['Press', 'up'], ['Hold', 'pause'], ['Return', 'down']],
    horizontal_leg_press: [['Press', 'up'], ['Hold', 'pause'], ['Return', 'down']], leg_press_calf_raise: [['Raise', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
  };
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const built = (rows: any[], pt: any) => rows.map((r: any) => (r.from === 'pause' ? { phase: r.phase, s: pt.pause } : { phase: r.phase, s: pt[r.from], move: true }));
  /** Every problem of (tempo.json, cards, drawn specs) against the ruling. */
  const tempoProblems = (tj: any, cards: Record<string, any>, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (JSON.stringify(tj.constants) !== '{}') bad.push('constants: the ruled set is empty');
    if (JSON.stringify(Object.keys(tj.ids).sort()) !== JSON.stringify(LB1.slice().sort())) bad.push('ids: not the 14');
    for (const id of LB1) {
      const t = tj.ids[id], c = cards[id], pt = c.plate.tempo;
      if (JSON.stringify(t?.rows?.map((r: any) => [r.phase, r.from])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (JSON.stringify(t?.claim) !== JSON.stringify(pt.claim)) bad.push(`${id}: claim`);
      const hold = c.tempo.some((p: any) => p.phase === 'Hold');
      if (hold !== pt.pause > 0) bad.push(`${id}: Hold present ${hold} but pause ${pt.pause}`);
      if (JSON.stringify(c.tempo) !== JSON.stringify(built(t?.rows ?? [], pt))) bad.push(`${id}: card tempo != the array built from tempo.json and plate.tempo`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(c.tempo)) bad.push(`${id}: spec tempo != card tempo`);
    }
    return bad;
  };
  const clean = () => ({ tj: readJson('tools/plates/library/lb1/tempo.json'), cards: Object.fromEntries(LB1.map(id => [id, cardOf(id)])), specs: { assisted_pull_up: apu, close_grip_pulldown: cgp } as Record<string, any> });
  const copy = (x: any) => JSON.parse(JSON.stringify(x));

  it('tempo.json, every card tempo and every drawn spec tempo follow the ruled map', () => {
    const { tj, cards, specs } = clean();
    expect(tempoProblems(tj, cards, specs)).toEqual([]);
  });
  it('mutations (i)-(vi) and a changed second are each red', () => {
    const red = (f: (s: any) => void) => { const s = copy({ tj: clean().tj, cards: clean().cards }); s.specs = { ...clean().specs }; f(s); return tempoProblems(s.tj, s.cards, s.specs).length > 0; };
    const setAll = (s: any, id: string, rows: any[] | null, tempo: any[]) => { if (rows) s.tj.ids[id].rows = rows; s.cards[id].tempo = tempo; if (s.specs[id]) s.specs[id] = { ...s.specs[id], tempo }; };
    expect(red(s => { const t = [...s.cards.close_grip_pulldown.tempo, { phase: 'Rest', s: 0.5 }]; setAll(s, 'close_grip_pulldown', null, t); }), '(i) Rest added').toBe(true);
    expect(red(s => { s.tj.constants = { Rest: { s: 0.5, ruling: 'x' } }; }), '(ii) a constant').toBe(true);
    expect(red(s => { const t = s.cards.chin_up.tempo.map((p: any) => (p.phase === 'Hold' ? { ...p, s: 2 } : p)); setAll(s, 'chin_up', null, t); }), '(iii) Hold s').toBe(true);
    expect(red(s => { const rows = [{ phase: 'Pull', from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', from: 'down' }]; setAll(s, 'close_grip_pulldown', rows, [{ phase: 'Pull', s: 2, move: true }, { phase: 'Hold', s: 0 }, { phase: 'Return', s: 2, move: true }]); }), '(iv) Hold 0').toBe(true);
    expect(red(s => { const rows = s.tj.ids.chin_up.rows.filter((r: any) => r.from !== 'pause'); setAll(s, 'chin_up', rows, built(rows, s.cards.chin_up.plate.tempo)); }), '(v) Hold removed').toBe(true);
    expect(red(s => { const rows = s.tj.ids.assisted_pull_up.rows.map((r: any) => ({ ...r, from: r.from === 'up' ? 'down' : r.from === 'down' ? 'up' : r.from })); setAll(s, 'assisted_pull_up', rows, built(rows, s.cards.assisted_pull_up.plate.tempo)); }), '(vi) up/down swapped').toBe(true);
    expect(red(s => { s.cards.close_grip_pulldown.tempo[0].s = 3; }), 'one tempo second').toBe(true);
  });

  const cardsSha = readJson('tools/plates/library/lb1/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it('each card differs from its research-head copy only in the three keys; each quotes file is a byte copy', () => {
    expect(cardsSha.researchHead).toMatch(/^[0-9a-f]{40}$/);
    for (const id of LB1) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
      expect(Object.keys(cardOf(id)).slice(-3), id).toEqual(KEYS);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('chin_up'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.chin_up);
  });
  it('Q1: topFault is the key of plate.mistake through the ruled map (drawable:true), and the drawn first tell carries it', () => {
    const MAP: Record<string, string> = { chin_up: 'kip', hanging_knee_raise: 'swing', assisted_pull_up: 'partial', inverted_row: 'sag', close_grip_pulldown: 'low',
      underhand_lat_pulldown: 'rock', single_arm_lat_pulldown: 'past', straight_arm_pulldown: 'bend', chest_supported_row: 'lean', resistance_band_row: 'slump',
      incline_machine_press: 'blades', shoulder_press: 'arch', horizontal_leg_press: 'lock', leg_press_calf_raise: 'lock' };
    for (const id of LB1) {
      const c = cardOf(id);
      expect(c.plate.mistake.drawable, id).toBe(true);
      expect(c.topFault, id).toBe(MAP[id]);
    }
    expect(apu.mistake.tells[0].key).toBe(cardOf('assisted_pull_up').topFault);
    expect(cgp.mistake.tells[0].key).toBe(cardOf('close_grip_pulldown').topFault);
  });
  // Q1's two cases, as the content verifier checks them: drawable:true needs topFault = the drawn fault's key;
  // drawable:false needs a topFault that differs from it (so F7 is raised).
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable
    ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault'])
    : (card.topFault !== drawnKey ? [] : ['drawable:false but topFault equals the drawn fault']));
  it('Q1 mutation: a card set to drawable:false with topFault equal to the drawn key is red (and the clean cards are green)', () => {
    expect(topFaultProblems(cardOf('close_grip_pulldown'), cgp.mistake.tells[0].key)).toEqual([]);
    const c = cardOf('close_grip_pulldown'); c.plate.mistake.drawable = false;
    expect(topFaultProblems(c, cgp.mistake.tells[0].key)).toEqual(['drawable:false but topFault equals the drawn fault']);
  });
  it('every plate fact names a claim of its card, and the How-to of each LB1 id names its card', async () => {
    for (const id of LB1) {
      const c = cardOf(id), claims = new Set(c.claims.map((x: any) => x.id));
      for (const f of c.plateFacts) expect(claims.has(f.claim), `${id} ${f.claim}`).toBe(true);
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      // `id` too: the synthetic N = 153 measurement (library/scale/synthetic.mjs) reads any existing How-to source and checks its id
      expect(h).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});
