// LIB-9a (lib-9a-card Do 3, A2, A5, A9): the LB1 build-ahead plates. Node only; the browser half of the plate QA runs in
// tools/plates/library/lb1/qa.mjs (Chromium is not installed when CI runs `npm run check`).
//   - Composers return PRIMITIVES types only, read no file, keep their linkages rigid, and every part that moves between
//     the end pose and the Mistake is `poly` or one of the envelope's pinned H9 line types (A2).
//   - lb1/rows.json holds exactly the 14 plan 6.2 LB1 ids, each once (A5).
//   - Nothing ships (A9, D-LIB4-ENTRY-2): every LB1 row is at stage drawing or review; no LB1 id is shipped, in a
//     batches/ file or in tests/howto/golden/library/; `generate --check` is green and no generated file reads lb1/.
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 180_000;
const LB1 = ['chin_up', 'hanging_knee_raise', 'assisted_pull_up', 'inverted_row', 'close_grip_pulldown', 'underhand_lat_pulldown',
  'single_arm_lat_pulldown', 'straight_arm_pulldown', 'chest_supported_row', 'resistance_band_row', 'incline_machine_press',
  'shoulder_press', 'horizontal_leg_press', 'leg_press_calf_raise'];
const ROWS = 'tools/plates/library/lb1/rows.json';
const COMPOSERS = ['assistMachine', 'chestRowMachine', 'band', 'dHandle', 'polybar'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));

let eng: any, body: any, qaNode: any, qaEng: any, pins: any, plate: any, parts: any;
let assist: any, chestRow: any, band: any, dh: any, apu: any, cgp: any;
beforeAll(async () => {
  [eng, body, qaNode, qaEng, plate, parts, assist, chestRow, band, dh] = await Promise.all([
    'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', '../vendor/engine/plate.mjs', 'eq/parts.mjs',
    'eq/assistMachine.mjs', 'eq/chestRowMachine.mjs', 'eq/band.mjs', 'eq/dHandle.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  pins = (await import(/* @vite-ignore */ lib('qa/index.mjs'))).loadPins();
  apu = (await import(/* @vite-ignore */ lib('specs/assisted_pull_up.mjs'))).default;
  cgp = (await import(/* @vite-ignore */ lib('specs/close_grip_pulldown.mjs'))).default;
}, T);

// The engine the QA uses (qa/engine.mjs loadEngine reads a mirror; the vendored files are the same bytes, L0).
const E = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const items = (spec: any, pose: 'end' | 'mistake') => {
  const L = qaEng.poseLandmarks(E(), spec), out: any[] = [];
  for (const e of spec.equipment) out.push(...[].concat(typeof e === 'function' ? e(L.lm[pose], { pose, start: L.lm.start, mistake: true }) ?? [] : e).filter(Boolean));
  return { items: out, lm: L.lm[pose] };
};
const h9 = (spec: any) => {
  const c = { spec, plate: { prefix: 'x' } };
  let R: any = null;   // as runQa: a spec the engine refuses to render is still checked on its static entries
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9(c, { engine: E(), envelope: pins.envelope }, R).map((p: any) => p.key);
};

describe('LIB-9a Do 3 / A2: composers', { timeout: T }, () => {
  it('composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const f of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${f}.mjs`, 'utf8');
      expect(src, f).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, f).not.toMatch(/layers\//);
    }
  });

  it('every item a composer returns is a PRIMITIVES type, in every pose of the slice plates', () => {
    for (const spec of [apu, cgp]) for (const pose of ['end', 'mistake'] as const)
      for (const it of items(spec, pose).items) expect(Object.keys(eng.PRIMITIVES), `${spec.id} ${pose}`).toContain(it.type);
    const { lm } = items(apu, 'end');
    const cr = chestRow.chestRowMachine({ seat: [0, 0.45, 0], pad: { face: [0, 1.2, 0.3] }, pivot: [0, 1.6, 0.5], lever: 0.5, column: 0.7, footBar: [0, 0.1, 0.5], floor: [-0.5, 1] });
    for (const f of [cr, band.band(), dh.dHandle({ grip: (l: any) => l['grip.r'], toward: () => [0, 1, 0] })])
      for (const it of f(lm, {})) expect(Object.keys(eng.PRIMITIVES)).toContain(it.type);
  });

  it('the slice plates pass PQ-H9: every part that moves between the end and the Mistake is poly or a pinned line type', () => {
    expect(h9(apu)).toEqual([]);
    expect(h9(cgp)).toEqual([]);
  });

  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const bad = { ...cgp, equipment: [...cgp.equipment, { type: 'wedge', at: [0, 0, 0] }] };
    expect(h9(bad).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });

  // The card's wording ("a knee pad that moves in the Mistake as a box with no poly"): a `box` carries a closed outline
  // (vendor geom.mjs bar() returns { d, poly }), so plate.mjs draws it in the Mistake and H9 accepts it. The first test
  // pins that fact; the second is the mutation that bites: the pad drawn by a part type with no closed outline that the
  // 8 never move (rackUpright, as LIB-3's M6), which drops out of the Mistake view.
  const swapPad = (to: (it: any) => any) => ({ ...apu, equipment: apu.equipment.map((e: any) => (typeof e !== 'function' ? e
    : (lm: any, ctx: any) => [].concat(e(lm, ctx) ?? []).map((it: any) => (it?.type === 'poly' && it.part === 'pad' && it.z === 'center' ? to(it) : it)))) });
  it('a knee pad drawn as a moving box keeps a closed outline, so the Mistake still draws it (H9 green)', () => {
    expect(h9(swapPad(it => ({ type: 'box', at: [0, it.pts[0][1] - 0.04, (it.pts[0][2] + it.pts[1][2]) / 2], w: 0.32, h: 0.08, part: 'pad' })))).toEqual([]);
  });
  it('mutation: the knee pad drawn with no closed outline (a moving rackUpright) turns H9.moving-line red', () => {
    const keys = h9(swapPad(it => ({ type: 'rackUpright', at: [0, it.pts[0][1] - 0.5, it.pts[0][2]], h: 0.5, part: 'pad' })));
    expect(keys.some((k: string) => /^H9\.moving-line:eq\d+\.rackUpright\./.test(k))).toBe(true);
  });

  it('assistMachine: the lever keeps its length and the pad sits one kneecap radius under the knee in every pose', () => {
    const L = qaEng.poseLandmarks(E(), apu), H = 1.75;
    const cfg = { pivot: null as any, lever: 0.62, bracket: 0.06, pad: [0.32, 0.08], padBack: 0.16, attach: 0.05 };
    const lever = items(apu, 'end').items.find((it: any) => it.type === 'pulley' && it.r === 0.03);   // the pivot hub
    cfg.pivot = lever.at;
    for (const pose of ['start', 'end', 'mistake']) {
      const k = L.lm[pose]['knee.r'], g = assist.assistGeometry(cfg, k, H);
      expect(Math.hypot(g.leverEnd[1] - cfg.pivot[1], g.leverEnd[2] - cfg.pivot[2])).toBeCloseTo(0.62, 9);
      expect(k[1] - g.padTop[0][1]).toBeCloseTo(assist.KNEE_R * H, 9);
    }
    expect(() => assist.assistGeometry(cfg, [0, 5, 0], H)).toThrow(/out of the lever's reach/);
  });

  it('chestRowMachine: the handle lies on the lever circle', () => {
    const cfg = { pivot: [0, 1.6, 0.5], lever: 0.55 };
    for (const deg of [-20, 0, 35]) {
      const h = chestRow.leverHandle(cfg, deg);
      expect(Math.hypot(h[1] - 1.6, h[2] - 0.5)).toBeCloseTo(0.55, 12);
      expect(chestRow.leverAngle(cfg, h)).toBeCloseTo(deg, 9);
    }
  });

  it('band: both strands end on the fists and start on the sole loop', () => {
    const { lm } = items(apu, 'end'), out = band.band()(lm, {}), A = band.bandAnchor(lm, 'r', 0.008);
    const ends = (it: any) => { const p = it.pts; return [[(p[6][1] + p[7][1]) / 2, (p[6][2] + p[7][2]) / 2], [(p[2][1] + p[3][1]) / 2, (p[2][2] + p[3][2]) / 2]]; };   // polyBar: a between pts 6/7, b between 2/3
    for (const [i, side] of [[1, 'l'], [2, 'r']] as const) {
      const [a, b] = ends(out[i]);
      expect(Math.hypot(a[0] - A.leave[1], a[1] - A.leave[2])).toBeLessThan(0.002);
      expect(Math.hypot(b[0] - lm[`grip.${side}`][1], b[1] - lm[`grip.${side}`][2])).toBeLessThan(0.002);
    }
  });

  it('dHandle: the ring sits `reach` from the grip along the cable direction', () => {
    const r = dh.dHandleRing([0, 1, 0.2], [0, 0.6, 0.8], 0.13);
    expect(r[1]).toBeCloseTo(1.078, 12);
    expect(r[2]).toBeCloseTo(0.304, 12);
  });

  it('each composer returns exactly its *_ITEMS parts, so perItem() drops none (each part keeps its own engine key)', () => {
    const { lm } = items(apu, 'end'), ctx = { pose: 'end', start: qaEng.poseLandmarks(E(), apu).lm.start };
    const cfgA = { pivot: [0, 0.6, 0.4], lever: 0.62, bracket: 0.06, pad: [0.32, 0.08], padBack: 0.16, attach: 0.05, tower: [0.43, 0.83], bar: [0, 2.07, 0], floor: [-0.6, 1], stack: { lift0: 0.3 } };
    const cfgC = { seat: [0, 0.45, 0], pad: { face: [0, 1.2, 0.3] }, pivot: [0, 1.6, 0.5], lever: 0.5, column: 0.7, footBar: [0, 0.1, 0.5], floor: [-0.5, 1] };
    expect(assist.assistMachine(cfgA)(lm, ctx).length).toBe(assist.ASSIST_ITEMS);
    expect(chestRow.chestRowMachine(cfgC)(lm, ctx).length).toBe(chestRow.CHEST_ROW_ITEMS);
    expect(band.band()(lm, ctx).length).toBe(band.BAND_ITEMS);
    expect(dh.dHandle({ grip: (l: any) => l['grip.r'], toward: () => [0, 1, 0] })(lm, ctx).length).toBe(dh.D_HANDLE_ITEMS);
    expect(plate.renderPlate(apu, { id: 't' }).report.issues).toEqual([]);
    expect(parts.perItem(() => [1, 2], 3).length).toBe(3);
  });
});

describe('LIB-9a A5: lb1/rows.json holds exactly the 14 LB1 ids', () => {
  it('each plan 6.2 LB1 id once, nothing else', () => {
    const ids = Object.keys(readJson(ROWS).rows);
    expect([...ids].sort()).toEqual(LB1.map(i => `lib_${i}`).sort());
    expect(new Set(ids).size).toBe(14);
  });
  it('every row points at its own spec file and carries the census view', () => {
    for (const [id, r] of Object.entries<any>(readJson(ROWS).rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
    }
    expect(readJson(ROWS)).toMatchObject({ batch: 'LB1', censusRef: '4a9fd86' });
  });
});

describe('LIB-9a A9: nothing ships (D-LIB4-ENTRY-2)', { timeout: T }, () => {
  const ids = LB1.map(i => `lib_${i}`);
  it('every LB1 row is at stage drawing or review', () => {
    for (const [id, r] of Object.entries<any>(readJson(ROWS).rows)) expect(['drawing', 'review'], id).toContain(r.stage);
  });
  it('no LB1 id is shipped, even with lb1/rows.json read as a batch file', async () => {
    const reg = await import(/* @vite-ignore */ lib('registry.mjs'));
    const all = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(all.filter((r: any) => ids.includes(r.id)).length).toBe(14);
    expect(reg.shippedIds(all).filter((i: string) => ids.includes(i))).toEqual([]);
  });
  it('no LB1 id is in any tools/plates/library/batches/ file', () => {
    const dir = 'tools/plates/library/batches';
    for (const f of readdirSync(dir).filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join(dir, f), 'utf8');
      for (const id of ids) expect(text, `${f} names ${id}`).not.toContain(id);
    }
  });
  it('no LB1 id is in tests/howto/golden/library/', () => {
    const dir = 'tests/howto/golden/library';
    if (!existsSync(dir)) return;
    for (const f of readdirSync(dir)) {
      const text = `${f}\n${readFileSync(join(dir, f), 'utf8')}`;
      for (const id of ids) expect(text, `${f} names ${id}`).not.toContain(id.slice(4));
    }
  });
  it('generate --check is green, and no generated file is read from lb1/ or the LB1 specs', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    for (const [p, { text }] of out) expect(text, p).not.toMatch(/library\/(lb1|specs)\//);
  });
});
