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
// D-LIB9a-MAIN565 / D-LIBZOOM-HLP: horizontal_leg_press's stage is held, so its row is out of lb1/rows.json until
// LIB-ZOOM (#279) re-adds it with its approved zoom. Its spec, card and tempo stay; it still must never ship.
const HELD = ['lib_horizontal_leg_press'];
const ROW_IDS = IDS.filter(i => !HELD.includes(i));
const ROWS = 'tools/plates/library/lb1/rows.json';
const COMPOSERS = ['assistMachine', 'chestRowMachine', 'band', 'dHandle', 'polybar'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const hyp = (a: number[], b: number[]) => Math.hypot(a[1]! - b[1]!, a[2]! - b[2]!);

let eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, parts: any, golden: any, muts: any;
let assist: any, chestRow: any, band: any, dh: any, apu: any, cgp: any, apuMod: any, build: any, cand: any, closure: any, reg: any;
let pins: any, E: any, mirror = '', html = '', all: any;
let hlp: any, csr: any, csrMod: any, rbrMod: any, ulp: any, sap: any, sapMod: any, sapdMod: any, sapd: any, irMod: any, ir: any;
let cuMod: any, cu: any, hkrMod: any, hkr: any;
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
  hlp = (await import(/* @vite-ignore */ lib('specs/horizontal_leg_press.mjs'))).default;
  csrMod = await import(/* @vite-ignore */ lib('specs/chest_supported_row.mjs'));
  csr = csrMod.default;
  rbrMod = await import(/* @vite-ignore */ lib('specs/resistance_band_row.mjs'));
  ulp = (await import(/* @vite-ignore */ lib('specs/underhand_lat_pulldown.mjs'))).default;
  sapMod = await import(/* @vite-ignore */ lib('specs/single_arm_lat_pulldown.mjs'));
  sap = sapMod.default;
  sapdMod = await import(/* @vite-ignore */ lib('specs/straight_arm_pulldown.mjs'));
  sapd = sapdMod.default;
  irMod = await import(/* @vite-ignore */ lib('specs/inverted_row.mjs'));
  ir = irMod.default;
  cuMod = await import(/* @vite-ignore */ lib('specs/chin_up.mjs'));
  cu = cuMod.default;
  hkrMod = await import(/* @vite-ignore */ lib('specs/hanging_knee_raise.mjs'));
  hkr = hkrMod.default;
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
  it('assisted_pull_up: in start, end and Mistake the knee is one kneecap radius over the drawn pad top (within 1 cm), the kneecap inside the pad front', () => {
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(apu, pose), pad = items.filter(isPad);
      expect(pad.length, pose).toBe(1);
      const top = Math.max(...pad[0].pts.map((p: number[]) => p[1])), zs = pad[0].pts.map((p: number[]) => p[2]);
      expect(Math.abs(lm['knee.r'][1] - top - assist.KNEE_R * 1.75), `${pose} knee over the pad top`).toBeLessThan(0.01);
      expect(lm['knee.r'][2] + assist.KNEE_R * 1.75, `${pose} kneecap inside the pad front`).toBeLessThanOrEqual(Math.max(...zs));
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

  it('incline_machine_press: in every drawn pose the chestPress lever runs from the pivot to the grip, on the lever circle (within 1 mm)', async () => {
    const mod = await import(/* @vite-ignore */ lib('specs/incline_machine_press.mjs')), imp = mod.default;
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(imp, pose, { mistake: pose === 'mistake' });
      const cp = items.filter(it => it.type === 'chestPress');
      expect(cp.length, pose).toBe(1);
      expect(cp[0].pivot, `${pose} pivot`).toEqual(mod.PIVOT);
      const g = lm['grip.r'];
      expect(Math.hypot(cp[0].handle[1] - g[1], cp[0].handle[2] - g[2]), `${pose} handle at the grip`).toBeLessThan(0.001);
      expect(Math.abs(Math.hypot(g[1] - mod.PIVOT[1], g[2] - mod.PIVOT[2]) - mod.L), `${pose} grip on the lever circle`).toBeLessThan(0.001);
    }
  });
  it('incline_machine_press: the start handle is a dashed phantom in the end pose only; the start lever line is not drawn', async () => {
    const imp = (await import(/* @vite-ignore */ lib('specs/incline_machine_press.mjs'))).default;
    const ph = (pose: string) => itemsIn(imp, pose, { mistake: pose === 'mistake' }).items.filter(it => it.cls === 'eq-line m-line');
    const end = ph('end'), lmS = itemsIn(imp, 'start').lm;
    const closed = (it: any) => { const a = it.pts[0], b = it.pts[it.pts.length - 1]; return a.every((v: number, k: number) => v === b[k]); };
    const near = end.filter(it => closed(it) && it.pts.every((p: any) => Math.hypot(p[1] - lmS['grip.r'][1], p[2] - lmS['grip.r'][2]) < 0.09));
    expect(near.length, 'one start handle capsule round the start grip').toBe(1);
    expect(end.some(it => it.pts.some((p: any) => p[1] > lmS['grip.r'][1] + 0.3)), 'no start lever line up to the pivot').toBe(false);
    expect(ph('mistake')).toEqual([]);
  });
  it('incline_machine_press: blades on the pad at start and end (within 1 cm); off it by at least 5 cm in the Mistake, elbows as soft as at the end', async () => {
    const imp = (await import(/* @vite-ignore */ lib('specs/incline_machine_press.mjs'))).default;
    const R = plate.renderPlate(imp, { id: 'x' }).report;
    for (const pose of ['start', 'end']) {
      const c = R.checks.find((k: any) => k.landmark === 'backUpper' && k.pose === pose);
      expect(c?.cm, pose).toBeLessThanOrEqual(1);
    }
    expect(R.checks.some((k: any) => k.landmark === 'backUpper' && k.pose === 'mistake'), 'no backUpper check in the Mistake (card contact fact, H6)').toBe(false);
    const pad = imp.checks.find((k: any) => k.landmark === 'backUpper' && k.pose === 'end').plane;
    const m = itemsIn(imp, 'mistake', { mistake: true }).lm.backUpper, n = pad.normal;
    const gap = (m[1] - pad.point[1]) * n[1] + (m[2] - pad.point[2]) * n[2];
    expect(gap, 'Mistake upper back off the pad').toBeGreaterThanOrEqual(0.05);
    const end = R.angles.end['elbow.r'], mis = R.angles.mistake['elbow.r'];
    expect(Math.abs(mis - end), 'Mistake elbow within 5 deg of the end (no lockout)').toBeLessThanOrEqual(5);
  });
  const spOf = async () => (await import(/* @vite-ignore */ lib('specs/shoulder_press.mjs'))).default;
  it('shoulder_press: in every drawn pose the lever runs from the pivot to the grip at one length, with the handle centred on the grip', async () => {
    const sp = await spOf(), pivot = sp.equipment.find((e: any) => e.type === 'pulley').at;
    let len: number | null = null;
    for (const pose of ['start', 'end']) {   // the via poses carry no landmarks in poseLandmarks
      const { items, lm } = itemsIn(sp, pose), lever = items.filter(it => it.type === 'poly' && it.part === 'lever');
      expect(lever.length, pose).toBe(2);   // lever and handle
      const [a, b] = barEnds(lever[0]), g = [0, lm['grip.r'][1], lm['grip.r'][2]];
      expect(hyp(a, pivot), `${pose} lever at the pivot`).toBeLessThan(0.001);
      expect(hyp(b, g), `${pose} lever end at the grip`).toBeLessThan(0.001);
      len ??= hyp(a, b);
      expect(Math.abs(hyp(a, b) - len), `${pose} lever length`).toBeLessThan(0.002);
      const [h0, h1] = barEnds(lever[1]);
      expect(hyp(h0.map((v, k) => (v + h1[k]!) / 2), g), `${pose} handle centred on the grip`).toBeLessThan(0.001);
    }
    const mis = itemsIn(sp, 'mistake', { mistake: true });   // the arch moves the back only: the handles stay at the top
    const endL = itemsIn(sp, 'end').items.filter(it => it.type === 'poly' && it.part === 'lever');
    const misL = mis.items.filter(it => it.type === 'poly' && it.part === 'lever');
    expect(misL.length).toBe(2);
    misL.forEach((it, i) => it.pts.forEach((p: number[], j: number) => expect(hyp(p, endL[i].pts[j]), 'Mistake lever = end lever').toBeLessThan(1e-6)));
  });
  // Research head 9eaa248 (W2-10, LR-2): the plate draws the close handles with the elbows pointing forward (c7)
  it('shoulder_press: close handles with the elbows pointing forward at the start (c7): elbow at least 15 cm in front of the shoulder, within 6 cm of it sideways', async () => {
    const sp = await spOf(), L = qaEng.poseLandmarks(Eng(), sp).lm.start;
    expect(L['elbow.r'][2] - L['shoulder.r'][2], 'elbow in front of the shoulder (m)').toBeGreaterThanOrEqual(0.15);
    expect(Math.abs(L['elbow.r'][0] - L['shoulder.r'][0]), 'elbow out to the side (m)').toBeLessThanOrEqual(0.06);
    expect(Math.abs(L['grip.r'][0] - L['grip.l'][0]), 'handles closer than shoulder width (m)').toBeLessThan(Math.abs(L['shoulder.r'][0] - L['shoulder.l'][0]));
    // D-LIB9a-DO6: the start elbow bend the header gives (about 130 deg, 132 drawn), pinned within 5 deg
    const bend = plate.renderPlate(sp, { id: 'x' }).report.angles.start['elbow.r'];
    expect(Math.abs(bend - 132), `start elbow bend ${bend}`).toBeLessThanOrEqual(5);
  });
  it('shoulder_press: the start lever and handle are a dashed phantom in the end pose, never in the Mistake pose', async () => {
    const sp = await spOf();
    const start = itemsIn(sp, 'start').items.filter(it => it.part === 'lever' && it.type === 'poly');
    const ph = itemsIn(sp, 'end').items.filter(it => it.part === 'phantom');
    expect(ph.length).toBe(2);
    for (const p of ph) expect(p).toMatchObject({ type: 'line', cls: 'eq-line m-line' });
    expect(ph.map(p => JSON.stringify(p.pts.slice(0, -1)))).toEqual(start.map(s => JSON.stringify(s.pts)));
    expect(itemsIn(sp, 'mistake', { mistake: true }).items.filter(it => it.part === 'phantom')).toEqual([]);
  });
  it('shoulder_press: back on the pad in start and end; in the Mistake the drawn torso never sinks into the pad and the low back leaves it', async () => {
    const sp = await spOf(), r = plate.renderPlate(sp, { id: 'x' });
    expect(r.report.issues).toEqual([]);
    const on = r.report.checks.filter((k: any) => ['backUpper', 'buttock'].includes(k.landmark));
    expect(on.map((k: any) => `${k.landmark}:${k.pose}`).sort()).toEqual(['backUpper:end', 'backUpper:start', 'buttock:end', 'buttock:start']);
    for (const k of on) expect(k.cm, `${k.landmark} ${k.pose}`).toBeLessThanOrEqual(1);
    const pad = sp.checks.find((c: any) => c.landmark === 'backUpper').plane;
    const gap = (p: number[]) => (p[1]! - pad.point[1]) * pad.normal[1] + (p[2]! - pad.point[2]) * pad.normal[2];
    const { lm } = itemsIn(sp, 'mistake', { mistake: true }), b = { height: 1.75 };
    const mpose = { ...sp.poses.end, ...sp.mistake.pose };
    const sk = eng.fk(eng.resolve(eng.normPose(mpose, b), b).q, b);
    const torso = eng.bodyShapes(sk, { view: 'side', facing: 'right', near: 'r', pxm: 1, P: (w: any) => [w[2], -w[1]] }).find((s: any) => s.key === 'torso')!.poly;
    expect(Math.min(...torso.map(([z, ny]: any) => gap([0, -ny, z]))), 'torso into the pad').toBeGreaterThan(-0.005);   // the torso ends below the pad top
    expect(gap(lm.backMid), 'mid back off the pad').toBeGreaterThan(0.05);
    expect(gap(lm.sacrum), 'sacrum off the pad').toBeGreaterThan(0.08);
  });
  it('horizontal_leg_press: in start, end and Mistake the drawn sled plate sits under the feet on a level rail', () => {
    for (const pose of ['start', 'end', 'mistake']) {   // ghost poses carry no landmarks in itemsIn
      const { items, lm } = itemsIn(hlp, pose, { mistake: pose === 'mistake' }), sled = items.filter(it => it.type === 'legPress45');
      expect(sled.length, pose).toBe(1);
      expect(sled[0].rail.angle, `${pose} level rail`).toBe(0);
      const fc = eng.legPressFace(sled[0], sled[0].travel);
      // the sole lies on the drawn plate face (vertical plate: same z), within 1 cm
      expect(Math.abs(lm['sole.r'][2] - fc.at[2]), `${pose} sole on the plate face`).toBeLessThan(0.01);
    }
  });
  it('horizontal_leg_press: knees about 90 at the start, a soft bend at the end, locked in the Mistake; the sled runs on in the Mistake', () => {
    const R = plate.renderPlate(hlp, { id: 'x' }).report;
    expect(Math.abs(R.angles.start['knee.r'] - 90)).toBeLessThan(1);
    expect(Math.abs(R.angles.end['knee.r'] - 15), 'end knee at the approved leg_press top (Q-D5-3)').toBeLessThanOrEqual(2);
    const m = itemsIn(hlp, 'mistake', { mistake: true }).lm, ang = (a: any, b: any, c: any) => {
      const u: any = [a[1] - b[1], a[2] - b[2]], v: any = [c[1] - b[1], c[2] - b[2]];
      return 180 - Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI; };
    expect(ang(m['hip.r'], m['knee.r'], m['ankle.r']), 'Mistake knee locked').toBeLessThan(2);
    // lib4-cards 13.4 must-fix 2: the drawn plate face moves from the end to the Mistake exactly as the sole does (within
    // 1 mm), and that move is at least 7 mm (the card-true 15 deg end locks out over 0.795 cm)
    const E0 = itemsIn(hlp, 'end'), M0 = itemsIn(hlp, 'mistake', { mistake: true });
    const sledOf = (x: any) => x.items.find((it: any) => it.type === 'legPress45');
    const face = (x: any) => eng.legPressFace(sledOf(x), sledOf(x).travel).at[2], dFace = face(M0) - face(E0);
    const dSole = M0.lm['sole.r'][2] - E0.lm['sole.r'][2];
    expect(Math.abs(dFace - dSole), `plate face move ${dFace.toFixed(5)} = sole move ${dSole.toFixed(5)}`).toBeLessThanOrEqual(0.001);
    expect(Math.abs(dFace), 'the sled runs on when the knees lock').toBeGreaterThanOrEqual(0.007);
  });
  it('horizontal_leg_press: the bottom footplate is a thin outline in the end pose only', () => {
    const outl = (pose: string) => itemsIn(hlp, pose, { mistake: pose === 'mistake' }).items.filter(it => it.type === 'line' && it.cls === 'eq-thin');
    expect(outl('end').length).toBe(1);
    expect(outl('start').length + outl('mistake').length).toBe(0);
    const { lm } = itemsIn(hlp, 'start');
    expect(Math.abs(outl('end')[0].pts[0][2] - lm['sole.r'][2]), 'outline at the start plate face').toBeLessThan(0.01);
  });
  it('chest_supported_row: in start, end, Mistake and every ghost the drawn lever runs from the pivot, at its length, to a handle at the hands', () => {
    const M = csrMod.MACHINE, B = Eng().body, hb = { height: 1.75 };
    // ghost landmarks as plate.mjs builds them: the start-to-end pose at t = (i + 1) / (n + 1) (poseLandmarks has none)
    const keys = [csr.poses.start, ...(csr.poses.via ?? []), csr.poses.end].map((p: any) => B.normPose(p, hb)), n = csr.ghosts.count;
    const ghosts = Array.from({ length: n }, (_, i) => [`ghost${i}`, B.landmarks(B.fk(B.poseAt(keys, (i + 1) / (n + 1), hb).q, hb))]);
    const L = qaEng.poseLandmarks(Eng(), csr);
    for (const [pose, lm] of [['start', L.lm.start], ['end', L.lm.end], ['mistake', L.lm.mistake], ...ghosts] as [string, any][]) {
      const ctx = { pose, start: L.lm.start, mistake: pose === 'mistake', body: L.body };
      const items = csr.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)).filter(Boolean);
      const lever = items.filter((x: any) => x.part === 'lever');
      expect(lever.length, pose).toBe(2);                                              // lever and handle
      const [a, b] = barEnds(lever[0]);
      expect(hyp(a, M.pivot), `${pose} lever at the pivot`).toBeLessThan(0.001);
      expect(Math.abs(hyp(a, b) - M.lever), `${pose} lever length`).toBeLessThan(0.001);
      const [g0, g1] = barEnds(lever[1]), hc = g0.map((v: number, k: number) => (v + g1[k]!) / 2);
      expect(hyp(hc, b), `${pose} handle on the lever end`).toBeLessThan(0.001);
      expect(hyp(hc, lm.grips), `${pose} handle at the hands`).toBeLessThan(0.005);   // the hands hold the handle (within 5 mm)
    }
  });
  it('chest_supported_row: the chest is on the drawn pad face at the start and the end (card c2, c4) and off it in the Mistake', () => {
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(csr, pose), pad = items.find((x: any) => x.type === 'poly' && !x.part && x.pts.length === 4);
      const face = Math.min(...pad.pts.map((p: number[]) => p[2]));                    // the pad face (angle 0: its lifter side)
      const gap = face - lm.chest[2];
      if (pose === 'mistake') expect(gap, pose).toBeGreaterThan(0.03);
      else expect(Math.abs(gap), pose).toBeLessThan(0.01);
    }
  });
  it('resistance_band_row: in start, end and Mistake the band runs from the sole loop at the ball to the drawn fists', () => {
    const rbr = rbrMod.default;
    for (const pose of ['start', 'end', 'mistake']) {   // ghosts have no landmark set in itemsIn
      const { items, lm } = itemsIn(rbr, pose), strands = items.filter((it: any) => it.type === 'poly' && it.part === 'band');
      expect(strands.length, `${pose} band parts`).toBe(band.BAND_ITEMS);
      const [loopA] = barEnds(strands[0]);
      expect(hyp(loopA, lm['ball.r']), `${pose} loop on the ball of the foot`).toBeLessThan(0.006);
      for (const [i, side] of [[1, 'l'], [2, 'r']] as const) {
        const [a, b] = barEnds(strands[i]);
        expect(hyp(a, loopA), `${pose} ${side} strand leaves the loop`).toBeLessThan(0.002);
        expect(hyp(b, lm[`grip.${side}`]), `${pose} ${side} strand ends on the fist`).toBeLessThan(0.002);
      }
    }
  });
  it('resistance_band_row: pelvis and heels on the mat in start, end and Mistake; the start strand is a dashed phantom in the end pose only', () => {
    const rbr = rbrMod.default;
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(rbr, pose), ph = items.filter((it: any) => it.part === 'phantom');
      expect(Math.abs(lm.seat[1] - 0.01), `${pose} seat on the mat`).toBeLessThan(0.005);
      expect(Math.abs(lm['heel.r'][1] - 0.01), `${pose} heel on the mat`).toBeLessThan(0.01);
      expect(ph.length, `${pose} phantom`).toBe(pose === 'end' ? 1 : 0);
      if (pose === 'end') {
        const st = itemsIn(rbr, 'start').lm;
        expect(ph[0].cls).toBe('eq-line m-line');
        expect(hyp(ph[0].pts[0], band.bandAnchor(st).leave)).toBeLessThan(0.002);
        expect(hyp(ph[0].pts[1], st['grip.r'])).toBeLessThan(0.002);
      }
    }
  });
  it('underhand_lat_pulldown: in start, end, Mistake and every ghost the drawn bar sits at the grips and its cable runs to the head pulley rim', () => {
    const B = Eng().body, hb = { height: 1.75 }, n = ulp.ghosts.count;
    const keys = [ulp.poses.start, ...(ulp.poses.via ?? []), ulp.poses.end].map((p: any) => B.normPose(p, hb));
    const ghosts = Array.from({ length: n }, (_, i) => [`ghost${i}`, B.landmarks(B.fk(B.poseAt(keys, (i + 1) / (n + 1), hb).q, hb))]);
    const L = qaEng.poseLandmarks(Eng(), ulp);
    const head = itemsIn(ulp, 'start').items.find((x: any) => x.type === 'pulley')!;   // the head pulley is the first pulley
    for (const [pose, lm] of [['start', L.lm.start], ['end', L.lm.end], ['mistake', L.lm.mistake], ...ghosts] as [string, any][]) {
      const ctx = { pose, start: L.lm.start, mistake: pose === 'mistake', body: L.body };
      const items = ulp.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)).filter(Boolean);
      const bar = items.filter((x: any) => x.part === 'bar');
      const lat = bar.find((x: any) => x.type === 'latBar'), cab = bar.find((x: any) => x.type === 'cable');
      expect(hyp(lat.at, lm.grips), `${pose} bar at the grips`).toBeLessThan(0.002);
      expect(hyp(cab.from, lat.at), `${pose} cable leaves the bar`).toBeLessThan(0.002);
      expect(Math.abs(hyp(cab.to, head.at) - head.r), `${pose} cable on the head pulley rim`).toBeLessThan(0.002);
    }
  });
  // LR-31 (research head 9eaa248): the card's Mistake is the past-end pull (c6, c8, c11), drawn with the set lean (c5)
  it('underhand_lat_pulldown: the bar travels on the cable line from the head pulley; the lean is unchanged start, end and Mistake (c5); the Mistake pulls the bar on past the end and the elbows back behind the trunk', () => {
    const L = qaEng.poseLandmarks(Eng(), ulp), head = itemsIn(ulp, 'start').items.find((x: any) => x.type === 'pulley')!;
    const ang = (v: number[]) => Math.atan2(v[1]!, v[2]!) * 180 / Math.PI;
    const dir = (lm: any) => ang([0, lm.grips[1] - head.at[1], lm.grips[2] - head.at[2]]);
    expect(Math.abs(dir(L.lm.start) - dir(L.lm.end)), 'start and end bars on one line through the head pulley').toBeLessThan(0.5);
    const lean = (lm: any) => ang([0, lm.neck[1] - lm['hip.r'][1], lm.neck[2] - lm['hip.r'][2]]);   // hip joint to the neck base: the scapulae do not move it
    expect(Math.abs(lean(L.lm.start) - lean(L.lm.end)), 'lean start = end').toBeLessThan(1);
    expect(Math.abs(lean(L.lm.mistake) - lean(L.lm.end)), 'lean Mistake = end').toBeLessThan(1);
    expect(L.lm.end.grips[1] - L.lm.mistake.grips[1], 'Mistake bar at least 10 cm below the end bar').toBeGreaterThanOrEqual(0.10);
    expect(L.lm.mistake['elbow.r'][2] - L.lm.end.backMid[2], 'Mistake elbow at least 5 cm behind the end backMid').toBeLessThanOrEqual(-0.05);
  });
  it('single_arm_lat_pulldown: in start, end and Mistake the drawn D-handle grip is at the hand, its rails end at the drawn ring, and the cable leaves that ring for the head pulley', () => {
    const { headTangent } = sapMod.HANDLE;
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(sap, pose), h = items.filter(it => it.part === 'handle');
      const polys = h.filter(it => it.type === 'poly'), cable = h.filter(it => it.type === 'cable');
      expect(polys.length, `${pose} D-handle parts`).toBe(dh.D_HANDLE_ITEMS);
      expect(cable.length, `${pose} handle cable`).toBe(1);
      const [g0, g1] = barEnds(polys[0]), gc = g0.map((v, k) => (v + g1[k]!) / 2);
      expect(hyp(gc, lm['grip.r']), `${pose} grip at the hand`).toBeLessThan(0.001);
      const ringPts = polys[3].pts, ring = [0, ringPts.reduce((a: number, p: number[]) => a + p[1]!, 0) / 8, ringPts.reduce((a: number, p: number[]) => a + p[2]!, 0) / 8];
      for (const rail of polys.slice(1, 3)) expect(hyp(barEnds(rail)[1], ring), `${pose} rail ends at the ring`).toBeLessThan(0.001);
      expect(hyp(cable[0].from, ring), `${pose} cable leaves the drawn ring`).toBeLessThan(0.001);
      expect(hyp(cable[0].to, headTangent(cable[0].from)), `${pose} cable meets the head pulley`).toBeLessThan(0.001);
    }
  });
  // lib4-cards 13.4 must-fix 1 (Q-R2-1): the Mistake elbow drives back behind the body (c10, c13), its red cap clear of
  // the solid end figure, and the moving cable drawn from the Mistake handle to the head pulley (DRAWING-GUIDE 4).
  it('single_arm_lat_pulldown: the Mistake elbow ends at least 10 cm behind the end backMid', () => {
    const L = qaEng.poseLandmarks(Eng(), sap).lm;
    expect(L.mistake['elbow.r'][2] - L.end.backMid[2], 'Mistake elbow z - end backMid z').toBeLessThanOrEqual(-0.10);
  });
  it('single_arm_lat_pulldown: the drawn Mistake elbow cap lies at least 6 px outside every trunk and near-side shape of the solid end figure', () => {
    const r = plate.renderPlate(sap, { id: 'x' }), cam = qaEng.cameraOf(sap, r.report), Q = qaEng.poseLandmarks(Eng(), sap);
    expect(cam.pxm, 'the plate scale').toBeGreaterThan(100);
    const shapesOf = (q: any) => eng.bodyShapes(eng.fk(q, Q.body), cam);
    const solid = shapesOf(Q.q.end).filter((s: any) => s.poly && (s.group === 'trunk' || s.group === 'near'));
    const cap = shapesOf(Q.q.mistake).find((s: any) => s.key === 'elbowcap.r');
    expect(solid.length, 'solid trunk and near-side shapes').toBeGreaterThan(5);
    const inside = (p: number[], poly: number[][]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i] as any, [xj, yj] = poly[j] as any; if ((yi > p[1]!) !== (yj > p[1]!) && p[0]! < (xj - xi) * (p[1]! - yi) / (yj - yi) + xi) c = !c; } return c; };
    const dseg = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)); return Math.hypot(p[0]! - a[0]! - t * dx, p[1]! - a[1]! - t * dy); };
    // signed distance of a point to a closed outline: negative inside
    const sd = (p: number[], poly: number[][]) => { let m = Infinity; poly.forEach((a, i) => { m = Math.min(m, dseg(p, a, poly[(i + 1) % poly.length]!)); }); return inside(p, poly) ? -m : m; };
    let min = Infinity, who = '';
    for (const p of cap.poly) for (const s of solid) { const d = sd(p, s.poly); if (d < min) { min = d; who = s.key; } }
    expect(min, `Mistake elbow cap clearance (nearest: ${who})`).toBeGreaterThanOrEqual(6);
  });
  it('single_arm_lat_pulldown: the Mistake view draws the moving cable from the drawn Mistake handle ring to the head pulley', () => {
    const { headTangent } = sapMod.HANDLE, r = plate.renderPlate(sap, { id: 'x', mistake: true }), cam = qaEng.cameraOf(sap, r.report);
    const polys = itemsIn(sap, 'mistake', { mistake: true }).items.filter(it => it.part === 'handle' && it.type === 'poly');
    const rp = polys[3].pts, ring = [0, rp.reduce((a: number, p: number[]) => a + p[1]!, 0) / 8, rp.reduce((a: number, p: number[]) => a + p[2]!, 0) / 8];
    const [a, b] = [cam.P(ring), cam.P(headTangent(ring))];
    const lines = [...r.svg.matchAll(/<path class="m-line" d="M(-?[\d.]+)[ ,](-?[\d.]+)L(-?[\d.]+)[ ,](-?[\d.]+)"/g)].map(m => [[+m[1]!, +m[2]!], [+m[3]!, +m[4]!]]);
    const hit = lines.filter(([p, q]) => Math.hypot(p![0]! - a[0], p![1]! - a[1]) < 1 && Math.hypot(q![0]! - b[0], q![1]! - b[1]) < 1);
    expect(hit.length, 'one dashed Mistake cable, ring to head pulley').toBe(1);
  });

  it('inverted_row: heels on the floor in every drawn pose; arms straight at the start; chest at the drawn bar at the end', () => {
    const G = irMod.GEOM;
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(ir, pose);
      expect(Math.abs(lm['heel.r'][1]), `${pose} heel on the floor`).toBeLessThan(0.005);
      expect(Math.abs(lm['heel.r'][2] - G.HEEL_S[2]), `${pose} heel does not slide`).toBeLessThan(0.005);
      const bar = items.find((it: any) => it.type === 'pullupBar');
      expect(bar.at, `${pose} bar drawn at BAR`).toEqual(G.BAR);
      if (pose === 'start') {
        const s = lm['shoulder.r'], g = lm['grip.r'];
        expect(Math.abs(Math.hypot(s[0] - g[0], s[1] - g[1], s[2] - g[2]) - G.STRAIGHT), 'start arm straight').toBeLessThan(0.01);
      }
      if (pose === 'end') {
        const c = lm.chest;   // chest one bar radius under the drawn bar's centre, straight under it
        expect(Math.hypot(c[1] - (bar.at[1] - G.BAR_R), c[2] - bar.at[2]), 'end chest at the bar').toBeLessThan(0.01);
      }
    }
  });
  it('inverted_row: the body is straight heel to shoulder in start and end; in the Mistake the hips sag off that line', () => {
    const off = (lm: any) => {   // buttock distance from the heel-shoulder line (m), + toward the floor
      const h = lm['heel.r'], s = lm['shoulder.r'], b = lm.buttock, d: any = [s[1] - h[1], s[2] - h[2]], L = Math.hypot(d[0], d[1]);
      return ((b[1] - h[1]) * d[1] - (b[2] - h[2]) * d[0]) / L * Math.sign(d[1]) * -1;
    };
    const st = off(itemsIn(ir, 'start').lm), en = off(itemsIn(ir, 'end').lm), mi = off(itemsIn(ir, 'mistake').lm);
    expect(Math.abs(st - en), 'same straight body line at start and end').toBeLessThan(0.01);
    expect(mi - en, 'Mistake hips at least 8 cm nearer the floor than the straight line').toBeGreaterThan(0.08);
  });
  it('inverted_row: the copied bisect throws when its bracket holds no root (D-LIB9-CLONE b)', () => {
    expect(() => irMod.bisect((x: number) => x * x + 1, -1, 1)).toThrow(/no root/);
    expect(irMod.bisect((x: number) => x - 0.25, 0, 1)).toBeCloseTo(0.25, 9);
    expect(irMod.bisect((x: number) => 0.25 - x, 0, 1)).toBeCloseTo(0.25, 9);   // falling f too
  });

  it('pulldowns: from start to end the elbow falls at every step (t = 0, 1/4, 1/2, 3/4, 1), level with or in front of the shoulder at every ghost', () => {
    const B = Eng().body, hb = { height: 1.75 };
    for (const [id, spec] of [['single_arm_lat_pulldown', sap], ['close_grip_pulldown', cgp], ['underhand_lat_pulldown', ulp]] as [string, any][]) {
      const keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => B.normPose(p, hb));
      const n = spec.ghosts.count, ts = [0, ...Array.from({ length: n }, (_, i) => (i + 1) / (n + 1)), 1];
      const at = ts.map(t => { const lm = B.landmarks(B.fk(B.poseAt(keys, t, hb).q, hb)); return { t, up: lm['elbow.r'][1] - lm['shoulder.r'][1], fwd: lm['elbow.r'][2] - lm['shoulder.r'][2] }; });
      for (let i = 1; i < at.length; i++) expect(at[i]!.up, `${id} elbow height above the shoulder falls from t ${at[i - 1]!.t} to ${at[i]!.t}`).toBeLessThan(at[i - 1]!.up);
      for (const g of at.slice(1, -1)) expect(g.fwd, `${id} ghost t ${g.t}: elbow level with or in front of the shoulder`).toBeGreaterThanOrEqual(0);
    }
  });
// Mutation (the e035bdf state): tools/plates/library/specs/single_arm_lat_pulldown.mjs
//   old "  poses: { start, via, end }," new "  poses: { start, end },"
//   red: "single_arm_lat_pulldown elbow height above the shoulder falls from t 0.5 to 0.75" (0.241 -> 0.246) and,
//   with that line removed, "ghost t 0.5: elbow level with or in front of the shoulder" (-0.072).
  it('chest_supported_row: the end elbow is at least 3 cm behind the upper back (c4, c5: just behind the body)', () => {
    const { lm } = itemsIn(csr, 'end');
    expect(lm['elbow.r'][2], 'end elbow.r z vs backUpper z').toBeLessThanOrEqual(lm.backUpper[2] - 0.03);
  });
  it('chest_supported_row: the drawn start handle spans the shoulder joint height (c1, c2: handles at about shoulder height)', () => {
    // start-pose equipment is computed from the start landmarks, as the engine draws it
    const { items, lm } = itemsIn(csr, 'start');
    const handle = items.find((x: any) => x.type === 'poly' && x.part === 'lever' && x.cls === 'eq-solid');
    expect(handle, 'drawn start handle').toBeTruthy();
    const ys = handle.pts.map((p: any) => p[1]);
    expect(Math.min(...ys), 'handle bottom below the shoulder joint').toBeLessThanOrEqual(lm['shoulder.r'][1]);
    expect(Math.max(...ys), 'handle top above the shoulder joint').toBeGreaterThanOrEqual(lm['shoulder.r'][1]);
  });
  it('chest_supported_row: the Mistake gap mark runs from the chest to the pad face, clear of the drawn end handle', () => {
    const gap = csr.mistake.guides.find((g: any) => g.kind === 'line' && g.pts.length === 2 && g.pts[0][1] === g.pts[1][1]);
    expect(gap, 'gap line').toBeTruthy();
    const y = gap.pts[0][1], { items } = itemsIn(csr, 'end');
    const handle = items.find((x: any) => x.type === 'poly' && x.part === 'lever' && x.cls === 'eq-solid');
    const ys = handle.pts.map((p: any) => p[1]);
    expect(y < Math.min(...ys) - 0.01 || y > Math.max(...ys) + 0.01, `gap y ${y.toFixed(3)} vs handle ${Math.min(...ys).toFixed(3)}-${Math.max(...ys).toFixed(3)}`).toBe(true);
    expect(gap.pts[1][2], 'gap ends on the pad face').toBeCloseTo(csrMod.MACHINE.pad.face[2], 6);
  });
// Red at e035bdf (mutation = the whole e035bdf spec, $S/do5/chest_supported_row/e035bdf.mjs, copied over the new one):
//   all three new tests red (elbow, start handle, gap mark); the two older chest_supported_row tests stay green.
// Each check alone (old -> new in specs/chest_supported_row.mjs):
//   m2 'const END_G = [0, 0.85, 0.16];' -> 'const END_G = [0, 0.85, 0.24];' (handles in front of the pad face): elbow test red.
//   m3 'const START_G = [0, 0.98, 0.728];' -> 'const START_G = [0, 0.88, 0.70];': start-handle test red.
//   m4 'const GAP_Y = lmM.chest[1]' -> 'const GAP_Y = END_G[1]': gap-mark test red.
  it('inverted_row: part of the J-hook outline lies outside the solid end figure (13.3 fix 5: the bar must not float)', () => {
    const b = { height: 1.75 };
    const sk = eng.fk(eng.resolve(eng.normPose(ir.poses.end, b), b).q, b);
    const shapes = eng.bodyShapes(sk, { view: 'side', facing: 'right', near: 'r', pxm: 1, P: (w: any) => [w[2], -w[1]] }).map((s: any) => s.poly).filter(Boolean);
    const inside = (p: number[], poly: number[][]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i] as any, [xj, yj] = poly[j] as any; if ((yi > p[1]!) !== (yj > p[1]!) && p[0]! < (xj - xi) * (p[1]! - yi) / (yj - yi) + xi) c = !c; } return c; };
    const drawn = itemsIn(ir, 'end').items.filter((it: any) => it.type === 'poly' && JSON.stringify(it.pts) === JSON.stringify(irMod.HOOK));
    expect(drawn.length, 'the J-hook is drawn').toBe(1);
    const hook: number[][] = drawn[0].pts, pts: number[][] = [];
    hook.forEach((a: any, i: number) => { const c: any = hook[(i + 1) % hook.length]; for (let k = 0; k < 10; k++) pts.push([a[2] + (c[2] - a[2]) * k / 10, -(a[1] + (c[1] - a[1]) * k / 10)]); });
    const out = pts.filter(p => !shapes.some((s: number[][]) => inside(p, s)));
    // at least 1 cm of the hook's outline (here: a 10-sample stretch, about 1-1.3 cm) shows outside the body
    expect(out.length, 'hook outline points outside the end figure').toBeGreaterThanOrEqual(10);
  });
  it('inverted_row: rule a (D-LIB9-CLONE): closureOf lists no specs/ file but its own', () => {
    const c = closure.closureOf(['tools/plates/library/specs/inverted_row.mjs']);
    expect(c.filter((p: string) => p.includes('/specs/'))).toEqual(['tools/plates/library/specs/inverted_row.mjs']);
  });
// Mutations (tools/plates/library/specs/inverted_row.mjs):
//  M5 (the e035bdf state, hook only under the fist): replace
//    "export const HOOK = [[0.95, FACE], [1.10, FACE], [1.10, FACE + 0.025], [0.975, FACE + 0.025], [0.975, BAR[2]],\n  [0.95, BAR[2]]]"
//    with the e035bdf rackUpright hook outline (y BAR-0.03 .. BAR+0.02, z FACE .. FACE+0.07):
//    "export const HOOK = [[0.97, FACE], [0.97, FACE + 0.07], [1.02, FACE + 0.07], [1.02, FACE + 0.055], [0.985, FACE + 0.055], [0.985, FACE]]"
//    -> the hook test is red (outline points outside < 10).
//  (M5 is also the 'hook back under the forearm' case: the e035bdf hook sat wholly under the end fist and forearm.)
  it('resistance_band_row: rescaled under D-LIB8-floor (fit above 146.29 px/m, at most x1.35, floor line at y 339)', () => {
    const rbr = rbrMod.default;
    expect(rbr.camera).toEqual({ fit: true, maxScale: 1.35, y0: 339 });
    const r = plate.renderPlate(rbr, { id: 'x' }), pxm = r.report.camera.pxPerM;
    expect(pxm, 'scale above the F1 cap (the floor sit fills the plate)').toBeGreaterThan(146.29 * 1.05);
    expect(pxm, 'within D-LIB8-floor x1.35').toBeLessThanOrEqual(146.29 * 1.35 + 0.01);
    // lib4-cards 13.4 Q-R2-3: the named F1 exemption states 159.02 px/m (x1.087), so a floor or camera change is red
    expect(Math.abs(pxm - 159.02), `scale ${pxm} px/m pinned to the F1 exemption's 159.02`).toBeLessThanOrEqual(0.5);
    expect(r.report.camera.y0, 'floor line at y 339').toBe(339);
  });
// Mutation (state at e035bdf, red): tools/plates/library/specs/resistance_band_row.mjs
//   old: "  camera: { fit: true, maxScale: 1.35, y0: 339 },"  new: "  camera: { fit: true },"
//   red: "expected { fit: true } to deeply equal { fit: true, maxScale: 1.35, y0: 339 }" (and, with the camera assertion
//   removed, "scale above the F1 cap: expected 146.29 to be greater than 153.6").
  it('chin_up: free hang with straight arms at the start; at the end the chin is level with the bar (0-4 cm over its top) and the elbows are below the shoulders and in front of them', () => {
    const bend = (lm: any) => { const u = [0, 1, 2].map(i => lm['elbow.r'][i] - lm['shoulder.r'][i]), f = [0, 1, 2].map(i => lm['wrist.r'][i] - lm['elbow.r'][i]);
      const d = u.reduce((a, v, i) => a + v * f[i]!, 0) / (Math.hypot(...u) * Math.hypot(...f)); return Math.acos(Math.max(-1, Math.min(1, d))) * 180 / Math.PI; };
    const s = itemsIn(cu, 'start').lm, e = itemsIn(cu, 'end').lm, barTop = 2.25 + 0.016;
    expect(bend(s), 'start elbow bend (deg)').toBeLessThanOrEqual(8);
    expect(e.chin[1] - barTop, 'end chin over the bar top (m)').toBeGreaterThanOrEqual(0);
    expect(e.chin[1] - barTop, 'end chin over the bar top (m)').toBeLessThanOrEqual(0.04);
    expect(e['elbow.r'][1], 'end elbow below the shoulder').toBeLessThan(e['shoulder.r'][1]);
    expect(e['elbow.r'][2] - e['shoulder.r'][2], 'end elbow in front of the shoulder (m)').toBeGreaterThan(0.05);
  });
  it('chin_up: the legs stay still (same hip, knee and ankle at start and end), the hang is redrawn as hidden lines in the end pose only, and the Mistake kicks the knees forward of the end knees', () => {
    for (const k of ['hip', 'knee', 'ankle']) expect(cuMod.start[k], k).toEqual(cuMod.end[k]);
    const hang = (pose: string) => itemsIn(cu, pose).items.filter((it: any) => it.part === 'hang').length;
    expect(hang('start')).toBe(0); expect(hang('end')).toBeGreaterThan(0); expect(hang('mistake')).toBe(0);
    const m = itemsIn(cu, 'mistake').lm, e = itemsIn(cu, 'end').lm;
    expect(m['knee.r'][2] - e['knee.r'][2], 'Mistake knee forward of the end knee (m)').toBeGreaterThan(0.15);
  });
// Source mutations (file tools/plates/library/specs/chin_up.mjs), each red on the named test:
//  M1 elbows behind:  "END_POLE = [0.2, -1, 0.05]" -> "END_POLE = [0, -1, -1]"          -> test 1 (elbow in front)
//  M2 chin short:     "root: { at: [0, 1.65, -0.06], tilt: -2 }" -> "root: { at: [0, 1.60, -0.06], tilt: -2 }" -> test 1 (chin)
//  M3 bent hang:      "const START_Y = 1.128" -> "const START_Y = 1.16"                       -> test 1 (start bend)
//  M4 hang dropped:   "ctx.pose === 'end' ? HANG" -> "ctx.pose === 'never' ? HANG"            -> test 2
//  M5 legs move:      "...LEGS, reach: grip(END_POLE)" -> "...LEGS, knee: 20, reach: grip(END_POLE)" -> test 2
  it('hanging_knee_raise: still hang at start and end (centre of mass on the bar line, grips on the bar), knees above the hips only at the end, the Mistake swung back at least 15 cm', () => {
    const lm = (p: any) => eng.landmarksOf(p, 1.75);
    const S = lm(hkr.poses.start), E = lm(hkr.poses.end), M = lm({ ...hkr.poses.end, ...hkr.mistake.pose });
    for (const [n, L] of [['start', S], ['end', E]] as [string, any][]) {
      expect(Math.abs(hkrMod.comZ(L) - hkrMod.BAR[2]), `${n} centre of mass on the bar line`).toBeLessThan(0.005);
      expect(Math.hypot(L['grip.r'][1] - hkrMod.BAR[1], L['grip.r'][2] - hkrMod.BAR[2]), `${n} grip on the bar`).toBeLessThan(0.005);
    }
    expect(S['knee.r'][1], 'start: knees below the hips (straight hang)').toBeLessThan(S['hip.r'][1] - 0.3);
    expect(E['knee.r'][1] - E['hip.r'][1], 'end: knees at least 10 cm above the hip joint (c5)').toBeGreaterThan(0.10);
    expect(hkrMod.comZ(M) - hkrMod.BAR[2], 'Mistake: centre of mass swung at least 15 cm behind the bar (c4)').toBeLessThan(-0.15);
    expect(S['toe.r'][1], 'feet clear the floor (c1)').toBeGreaterThan(0.05);
  });
  it('hanging_knee_raise: two Mistake tells about the swing, the first = topFault; no parent "Knees only" tell or "Legs straight" callout', () => {
    const keys = hkr.mistake.tells.map((t: any) => t.key);
    expect(keys).toEqual(['swing', 'kick']);
    expect(hkr.callouts.map((c: any) => c.key)).toEqual(['still', 'knees', 'curl']);
    expect(JSON.stringify(hkr)).not.toMatch(/Knees only|Legs straight/);
  });
// Source mutations (tools/plates/library/specs/hanging_knee_raise.mjs), each red on the named test:
//  m1 end knees not above the hips: "hip: 100, knee: 100, ankle: -25 };" -> "hip: 60, knee: 100, ankle: -25 };"  (test 1, end knees)
//  m2 no swing: "export const SWING_OFF = -0.20;" -> "export const SWING_OFF = 0;"                              (test 1, Mistake swung back)
//  m3 parent's tell back: "{ key: 'kick', text: 'Legs<br>kicked up'" -> "{ key: 'knees', text: 'Knees only'"  (test 2)
  // LR-31 (research head 9eaa248): the card is drawable:false (its top fault, the handles dropping, is a speed fault), so
  // topFault is that fault's key and differs from the drawn `arch`
  it('shoulder_press: two Mistake tells, `arch` (plate.mistake, drawn) first, `gap` anchored on the drawn pad gap mark', async () => {
    const sp = (await import(/* @vite-ignore */ lib('specs/shoulder_press.mjs'))).default;
    const card = JSON.parse(readFileSync(new URL('../../docs/research/howto/cards/shoulder_press.json', import.meta.url), 'utf8'));
    const keys = sp.mistake.tells.map((t: any) => t.key);
    expect(keys).toEqual(['arch', 'gap']);
    expect(card.plate.mistake.drawable).toBe(false);
    expect(keys[0], 'drawable:false: the drawn key differs from topFault').not.toBe(card.topFault);
    const gapLine = sp.mistake.guides.find((g: any) => g.kind === 'line' && g.pts.length === 2 && Array.isArray(g.pts[0]));
    const mid: number[] = [0, (gapLine.pts[0][1] + gapLine.pts[1][1]) / 2, (gapLine.pts[0][2] + gapLine.pts[1][2]) / 2];
    const a = sp.mistake.tells[1].anchor;
    expect(Math.hypot(a[1] - mid[1]!, a[2] - mid[2]!)).toBeLessThan(1e-9);
  });
  // lib4-cards 13.4 must-fix 5 (Q-R2-2): the forward roll (c5) is the second sign; its tell sits on the red handle, which
  // the roll carries past the solid one, on the open side outside the solid end figure
  it('incline_machine_press: two Mistake tells, `blades` (topFault) first, `roll` anchored on the red handle outside the solid end figure', async () => {
    const ip = (await import(/* @vite-ignore */ lib('specs/incline_machine_press.mjs'))).default;
    const card = JSON.parse(readFileSync(new URL('../../docs/research/howto/cards/incline_machine_press.json', import.meta.url), 'utf8'));
    const keys = ip.mistake.tells.map((t: any) => t.key);
    expect(keys).toEqual(['blades', 'roll']);
    expect(keys[0]).toBe(card.topFault);
    const r = plate.renderPlate(ip, { id: 'x', mistake: true }), cam = qaEng.cameraOf(ip, r.report), Q = qaEng.poseLandmarks(Eng(), ip);
    expect(r.report.issues).toEqual([]);
    expect(Q.lm.mistake['grip.r'][2] - Q.lm.end['grip.r'][2], 'the red handle past the solid one').toBeGreaterThan(0.05);
    const a = qaEng.resolvePoint(ip.mistake.tells[1].anchor, 'mistake', Q.lm, cam), g = cam.P(Q.lm.mistake['grip.r']);
    expect(Math.hypot(a[0] - g[0], a[1] - g[1]), 'anchor on the red handle (px)').toBeLessThanOrEqual(10);
    const inside = (p: number[], poly: number[][]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i] as any, [xj, yj] = poly[j] as any; if ((yi > p[1]!) !== (yj > p[1]!) && p[0]! < (xj - xi) * (p[1]! - yi) / (yj - yi) + xi) c = !c; } return c; };
    const solid = eng.bodyShapes(eng.fk(Q.q.end, Q.body), cam).filter((s: any) => s.poly);
    expect(solid.filter((s: any) => inside(a, s.poly)).map((s: any) => s.key), 'anchor outside the solid end figure').toEqual([]);
  });
// Mutation (reproduces e035bdf, one tell): tools/plates/library/specs/shoulder_press.mjs
//   old: "\n      { key: 'gap', text: 'Off<br>the pad'," ... (delete the whole `gap` tell line)
//   red: "expected [ 'arch' ] to deeply equal [ 'arch', 'gap' ]"

  // Every drawn LB1 spec that has a weight stack (D-LIB9a-SLICE: one loop over all stack specs). Everything is read from
  // the drawn plate (px): the stack blocks, the cable run down to the stack, the rods. lib4-cards 13.4 must-fix 3: the
  // "drawn stack top" is the top edge of a drawn block at least one plate high, and the lifted block holds at least one
  // plate, so a zero-height block (`load: 0`) can never stand in for the top; the lift is read off the drawn blocks (no
  // copy of the vendor formula). A spec edit can part the cable from the stack (a cableColumn spreads its `stack`
  // options after `base` into stack(), equipment.mjs:93, while its cable end uses the column's own base, :99).
// Mutations (13.4 must-fix 3; each green at 4257648 and red here; all restored):
//  M-load0 straight_arm_pulldown.mjs `const STACK = { plates: 14, load: 6 };` -> `load: 0`
//  M-load0 close_grip_pulldown.mjs `plates: 16, load: 8,` -> `load: 0,`
//  M-base  straight_arm_pulldown.mjs `stack: { ...STACK, rods: false }` -> `stack: { ...STACK, rods: false, base: [0, 0.03, SZ] }`
//          (13.3 must-fix 9's proof; red at 4257648 too: `3.9208 < 1`)
//  M-via   spec `poses: { start, end, via },` -> `poses: { start, end },` (the e035bdf state): red in the ghost-elbow test
//  M-rods  spec `...[-0.05, 0.05].map(dz => ({ type: 'line', cls: 'eq-thin'` -> `...[].map(dz => …`: red in the rods test
  const STACK_SPECS = () => [['close_grip_pulldown', cgp, 0.03], ['assisted_pull_up', apu, apuMod.MACHINE.stack.lift0],
    ['underhand_lat_pulldown', ulp, 0.03], ['single_arm_lat_pulldown', sap, sapMod.LIFT0], ['straight_arm_pulldown', sapd, 0]] as [string, any, number][];
  // drawn [key, item] pairs of a pose, the column's stack plates renamed `.stack.` and its run down to the stack given
  // as a `.cable.` line (its last segment, top pulley -> stack top)
  const stackDrawn = (pairs: [string, any][]) => {
    const col = pairs.filter(([k]) => /\.cableColumn\./.test(k)), rest = pairs.filter(([k]) => !/\.cableColumn\./.test(k));
    if (!col.length) return pairs;
    const run = col.map(([, v]) => v).filter((v: any) => v.cls === 'eq-cable' && !v.line);
    expect(run.length, 'one column run').toBeGreaterThan(0);
    const xy = [...run[0].d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
    const end = xy[xy.length - 1]!, from = xy[xy.length - 2]!;
    const plates = col.filter(([, v]) => v.poly && v.poly.length === 4 && v.poly.every((p: number[]) => Math.abs(p[0]! - end[0]!) < 15 && p[1]! > from[1]! + 1));
    return [...rest, ...plates.map(([k, v], i) => [`${k.split('.')[0]}.stack.${i}`, v] as [string, any]), ['col.cable.0', { line: [from, end] }] as [string, any]];
  };
  /** The drawn stack of one pose (plate px): its blocks top first, the stack top, the lift, the centre line, the half width. */
  const stackOf = (spec: any, pose: string) => {
    const R = plate.renderPlate(spec, { id: 'x' }), cam = qaEng.cameraOf(spec, R.report);
    const its = stackDrawn([...qaEng.equipmentItems(Eng(), spec, R.report, [pose])[pose].entries()]);
    const blocks: any[] = its.filter(([k, v]) => /\.stack\./.test(k) && v.poly && v.poly.length === 4).map(([, v]) => {
      const ys = v.poly.map((p: number[]) => p[1]!), xs = v.poly.map((p: number[]) => p[0]!);
      return { top: Math.min(...ys), bot: Math.max(...ys), x0: Math.min(...xs), x1: Math.max(...xs) };
    }).sort((u: any, v: any) => u.top - v.top);
    const plateH = 0.025 * cam.pxm, full = blocks.filter((b: any) => b.bot - b.top >= plateH - 0.05);
    const x0 = Math.min(...blocks.map((b: any) => b.x0)), x1 = Math.max(...blocks.map((b: any) => b.x1));
    return { its, cam, blocks, plateH, top: Math.min(...full.map((b: any) => b.top)), cx: (x0 + x1) / 2, half: (x1 - x0) / 2,
      lift: blocks.length >= 2 ? (blocks[1].top - blocks[0].bot) / cam.pxm : NaN };   // gap between the lifted and the resting block (m)
  };
  it('every stack spec: the stack rises off its rest pose (end and Mistake), and its cable ends on the drawn stack top', () => {
    for (const [id, spec, lift0] of STACK_SPECS()) {
      // every stack sits at lift0 in the spec's start pose and rises from it (the pulldowns pull; the assist hang pushes the pad down)
      for (const pose of ['start', 'end', 'mistake']) {
        const S = stackOf(spec, pose);
        expect(S.blocks.length, `${id} ${pose} stop bar, resting and lifted blocks`).toBe(3);
        if (pose === 'start') expect(Math.abs(S.lift - lift0) * S.cam.pxm, `${id} start lift ${S.lift.toFixed(4)} (px off lift0)`).toBeLessThan(0.5);
        else {
          expect((S.lift - lift0) * S.cam.pxm, `${id} ${pose} lift ${S.lift.toFixed(4)} above lift0 (px)`).toBeGreaterThan(0.5);
          expect(S.blocks[0].bot - S.blocks[0].top, `${id} ${pose} the lifted block holds at least one plate (px)`).toBeGreaterThanOrEqual(S.plateH - 0.05);
        }
        expect(S.blocks[0].top, `${id} ${pose} the stack top is the lifted block's top`).toBe(S.top);
        const low = (l: number[][]) => (l[0]![1]! > l[1]![1]! ? l[0]! : l[1]!);
        const cable = S.its.filter(([k, v]) => /\.cable\./.test(k) && v.line && Math.abs(low(v.line)[0]! - S.cx) < 1).map(([, v]) => v.line);
        // the stack cable is the vertical run down to the stack (the top run between the pulleys also ends over cx)
        expect(cable.length, `${id} ${pose} cables over the stack`).toBeGreaterThan(0);
        const lowEnd = Math.max(...cable.map((l: number[][]) => low(l)[1]!));
        expect(Math.abs(lowEnd - S.top), `${id} ${pose} cable end on the drawn stack top`).toBeLessThan(1);
      }
    }
  });
  it('every stack spec: two static guide rods run through the resting and the lifted plates, drawn as close_grip draws them', () => {
    for (const [id, spec] of STACK_SPECS()) for (const pose of ['start', 'end', 'mistake']) {
      const its = itemsIn(spec, pose).items, S = stackOf(spec, pose), stops = S.cam.P([0, 0.06, 0])[1];
      const rods = its.filter(it => it.type === 'line' && it.cls === 'eq-thin');
      expect(rods.length, `${id} ${pose} rods`).toBe(2);
      for (const r of rods) {
        const [a, b] = r.pts.map((w: number[]) => S.cam.P(w));
        expect(Math.abs(a[0] - S.cx), `${id} rod inside the stack`).toBeLessThan(S.half);
        expect(Math.max(a[1], b[1]), `${id} ${pose} rod from the stops`).toBeGreaterThanOrEqual(stops - 0.01);
        expect(Math.min(a[1], b[1]), `${id} ${pose} rod through the lifted plates`).toBeLessThan(S.top);
      }
      expect(rods.every(r => JSON.stringify(r.pts) === JSON.stringify(itemsIn(spec, 'start').items.filter(x => x.type === 'line' && x.cls === 'eq-thin')[rods.indexOf(r)].pts)), `${id} rods static`).toBe(true);
    }
  });
  // straight_arm_pulldown (lib4-cards 13.3 must-fix 1): every ghost keeps the 15 deg elbow of the start and the end
  // (the in-between keys put the bar on the shoulder arc; without them the ghost elbows bend 98-120 deg)
  it('straight_arm_pulldown: every ghost elbow keeps the 15 deg bend (within 2 deg, H6 tolerance)', () => {
    const B = { height: 1.75 }, keys = [sapd.poses.start, ...(sapd.poses.via ?? []), sapd.poses.end].map((p: any) => body.normPose(p, B));
    const n = sapd.ghosts.count, el = (lm: any) => { const a = [0, 1, 2].map(i => lm['shoulder.r'][i] - lm['elbow.r'][i]), b = [0, 1, 2].map(i => lm['wrist.r'][i] - lm['elbow.r'][i]);
      return 180 - Math.acos((a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI; };
    expect(n).toBe(3);
    for (let i = 1; i <= n; i++) {
      const lm = body.landmarks(body.fk(body.poseAt(keys, i / (n + 1), B).q, B));
      expect(Math.abs(el(lm) - 15), `ghost ${i - 1} elbow ${el(lm).toFixed(1)}`).toBeLessThanOrEqual(2);
    }
  });
  // D-LIB9a-SLICE: no leader runs within 6 px of the trace or a cable (8 px round its anchor excepted: the anchor may sit
  // on the trace). Every drawn LB1 spec, normal and Mistake views.
  it('every drawn LB1 spec: no leader comes within 6 px of the trace or a cable, away from its anchor', async () => {
    const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
    const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
    const dseg = (p: number[], [a, b]: number[][]) => { const dx = b![0]! - a![0]!, dy = b![1]! - a![1]!, L2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((p[0]! - a![0]!) * dx + (p[1]! - a![1]!) * dy) / L2)); return Math.hypot(p[0]! - a![0]! - t * dx, p[1]! - a![1]! - t * dy); };
    const leaderOk = (d: string) => /^ML*H?$/.test(d.replace(/[\d.\s,-]/g, ''));
    expect([leaderOk('M1 2L3 4H5'), leaderOk('M1 2L3 4'), leaderOk('M0 0Q1 1 2 2'), leaderOk('M0 0C1 1 2 2 3 3'), leaderOk('M0 0V5')]).toEqual([true, true, false, false, false]);
    const ids = build.drawnIds();
    expect(ids.length).toBeGreaterThan(1);
    for (const id of ids) for (const mistake of [false, true]) {
      const spec = (await import(/* @vite-ignore */ lib(`specs/${id.replace(/^lib_/, '')}.mjs`))).default;
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg;
      const avoid = [...svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      for (const [, d] of svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)) {
        // leaders are M, L and a closing H only; any other command would be misread, so it fails here (13.3 must-fix 13)
        if (!leaderOk(d!)) throw new Error(`${id}: leader path has a command other than M, L or H: ${d}`);
        const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]);
        let min = Infinity;
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) min = Math.min(min, dseg(q, g));
        }
        expect(min, `${id}${mistake ? ' Mistake' : ''} leader ${d}`).toBeGreaterThanOrEqual(6);
      }
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

// Do 8 fix round (lb1-critic-findings @ 0ec6e424, D-CRITIC-CAL3): the marks the critics named sit off the solid figure.
describe('LIB-9a Do 8 fix round', { timeout: T }, () => {
  const inside = (p: number[], poly: number[][]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i] as any, [xj, yj] = poly[j] as any; if ((yi > p[1]!) !== (yj > p[1]!) && p[0]! < (xj - xi) * (p[1]! - yi) / (yj - yi) + xi) c = !c; } return c; };
  const solidOf = (spec: any, mistake: boolean) => {
    const r = plate.renderPlate(spec, { id: 'x', mistake }), cam = qaEng.cameraOf(spec, r.report), Q = qaEng.poseLandmarks(Eng(), spec);
    return { r, cam, Q, shapes: eng.bodyShapes(eng.fk(Q.q.end, Q.body), cam).filter((x: any) => x.poly) };
  };
  it('chest_supported_row: the `arch` tell ends on the red low back, outside the solid end figure and clear of its elbow', () => {
    const { cam, Q, shapes } = solidOf(csr, true);
    const a = qaEng.resolvePoint(csr.mistake.tells.find((t: any) => t.key === 'arch').anchor, 'mistake', Q.lm, cam);
    expect(shapes.filter((x: any) => inside(a, x.poly)).map((x: any) => x.key), 'anchor inside the solid end figure').toEqual([]);
    const tor = eng.bodyShapes(eng.fk(Q.q.mistake, Q.body), cam).find((x: any) => x.key === 'torso').poly;
    const dseg = (p: number[], u: number[], v: number[]) => { const dx = v[0]! - u[0]!, dy = v[1]! - u[1]!, L2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((p[0]! - u[0]!) * dx + (p[1]! - u[1]!) * dy) / L2)); return Math.hypot(p[0]! - u[0]! - t * dx, p[1]! - u[1]! - t * dy); };
    const d = Math.min(...tor.map((u: number[], i: number) => dseg(a, u, tor[(i + 1) % tor.length]!)));
    expect(d, 'anchor on the red torso outline (px)').toBeLessThanOrEqual(2);
    const el = cam.P(Q.lm.end['elbow.r']);
    expect(Math.hypot(a[0] - el[0], a[1] - el[1]), 'anchor clear of the solid elbow (px)').toBeGreaterThanOrEqual(12);
  });
  it('inverted_row: the start arm\'s hidden middle is redrawn as hidden lines in the end pose only, reaching the bar (D-LIB9a-FIX1, R3)', () => {
    const hid = (pose: string) => itemsIn(ir, pose, { mistake: pose === 'mistake' }).items.filter((it: any) => it.part === 'hidden' && it.type === 'line');
    expect(hid('end').length, 'end pose hidden lines').toBeGreaterThan(0);
    expect(hid('start').length + hid('mistake').length, 'never in the start or Mistake pose').toBe(0);
    const pts = hid('end').flatMap((it: any) => it.pts), bar = [0, 1.0, 0], sh = itemsIn(ir, 'start').lm['shoulder.r'];
    expect(Math.min(...pts.map((q: number[]) => hyp(q, bar))), 'hidden arm reaches the bar (m)').toBeLessThan(0.04);
    expect(Math.max(...pts.map((q: number[]) => hyp(q, sh))), 'hidden arm spans most of the straight arm (m)').toBeGreaterThan(0.45);
  });
  // lb1-critic-findings round 3 (lib4-cards 13.7) R5: the low bar and its arm are drawn above the solid figure
  it('underhand_lat_pulldown: the Mistake draws its arm and the low bar as dashed lines, the arrow and the `past` tell end on the low bar', () => {
    const r = plate.renderPlate(ulp, { id: 'x', mistake: true }), cam = qaEng.cameraOf(ulp, r.report), Q = qaEng.poseLandmarks(Eng(), ulp);
    const P = (k: string) => cam.P(Q.lm.mistake[k]), S = P('shoulder.r'), E = P('elbow.r'), G = P('grip.r');
    const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
    const lines = [...r.svg.matchAll(/<path class="m-line" d="([^"]+)"/g)].map(m => xy(m[1]!));
    const near = (a: number[], b: number[], tol = 1) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!) <= tol;
    expect(lines.some(l => l.length === 3 && near(l[0]!, S) && near(l[1]!, E) && near(l[2]!, G)), 'dashed arm shoulder-elbow-grip').toBe(true);
    const fist = 0.02 * 1.75 * cam.pxm;
    expect(lines.some(l => l.length >= 16 && l.every(q => Math.abs(Math.hypot(q[0]! - G[0], q[1]! - G[1]) - fist) < 0.6)), 'dashed fist-sized ring round the low bar').toBe(true);
    const arrow = [...r.svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].map(m => xy(m[1]!));
    expect(arrow.some(a => Math.hypot(a[1]![0]! - G[0], a[1]![1]! - G[1]) <= fist + 2), 'arrow tip (its first segment end) on the low bar').toBe(true);
    const t = qaEng.resolvePoint(ulp.mistake.tells.find((x: any) => x.key === 'past').anchor, 'mistake', Q.lm, cam);
    expect(Math.hypot(t[0] - G[0], t[1] - G[1]), '`past` anchor on the low bar ring (px)').toBeLessThanOrEqual(fist + 1);
    const endGrip = cam.P(Q.lm.end['grip.r']);
    expect(G[1] - endGrip[1], 'low bar well below the end bar (px)').toBeGreaterThan(25);
  });
  it('close_grip and underhand: the lean arc lies behind the back, outside the solid end figure', () => {
    for (const spec of [cgp, ulp]) {
      const { r, shapes } = solidOf(spec, false);
      const m = /<path class="arc-line" d="M(-?[\d.]+)[ ,](-?[\d.]+)A[\d.]+ [\d.]+ 0 0 [01] (-?[\d.]+)[ ,](-?[\d.]+)"/.exec(r.svg);
      expect(m, `${spec.id} arc drawn`).toBeTruthy();
      const a = [+m![1]!, +m![2]!], b = [+m![3]!, +m![4]!], mid = [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2];
      for (const p of [a, b, mid]) expect(shapes.filter((x: any) => inside(p, x.poly)).map((x: any) => x.key), `${spec.id} arc point ${p}`).toEqual([]);
    }
  });
});

describe('LIB-9a Do 5(d): straight_arm_pulldown (D-LIB9-CLONE)', { timeout: T }, () => {
  it('rule a: the clone copies its anchor code; closureOf lists no specs/ file but its own', () => {
    const c = closure.closureOf(['tools/plates/library/specs/straight_arm_pulldown.mjs']);
    expect(c.filter((p: string) => p.includes('/specs/'))).toEqual(['tools/plates/library/specs/straight_arm_pulldown.mjs']);
  });
  it('rule b: the copied root finder throws when its bracket holds no root, and solves inside its bracket', () => {
    expect(() => sapdMod.solve((x: number) => x + 1, 0, 1)).toThrow(/no solution/);
    expect(sapdMod.solve((x: number) => x - 0.3, 0, 1)).toBeCloseTo(0.3, 6);
  });
  it('the elbows keep one 15 deg bend at the start and the end (c4); bent past 60 deg in the Mistake (c6)', () => {
    const el = (lm: any) => { const a = [0, 1, 2].map(i => lm['shoulder.r'][i] - lm['elbow.r'][i]), b = [0, 1, 2].map(i => lm['wrist.r'][i] - lm['elbow.r'][i]);
      return 180 - Math.acos((a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI; };
    const L = qaEng.poseLandmarks(Eng(), sapd).lm;
    expect(Math.abs(el(L.start) - 15)).toBeLessThan(0.5);
    expect(Math.abs(el(L.end) - 15)).toBeLessThan(0.5);
    expect(el(L.mistake)).toBeGreaterThan(60);
  });
  // lib4-cards 13.4 must-fix 4: the `close` tell says what is drawn (c6, "a bent-arm pulldown"): the red bar comes in
  // close to the body, not to the chest
  it('the drawn Mistake bar sits at least 15 cm nearer the shoulder than the solid bar path at its own height', () => {
    const B = { height: 1.75 }, keys = [sapd.poses.start, ...(sapd.poses.via ?? []), sapd.poses.end].map((p: any) => body.normPose(p, B));
    const M = itemsIn(sapd, 'mistake', { mistake: true }), bar = M.items.find((it: any) => it.type === 'latBar').at;
    const path = Array.from({ length: 401 }, (_, i) => body.landmarks(body.fk(body.poseAt(keys, i / 400, B).q, B)));
    let solid = NaN;
    for (let i = 1; i < path.length; i++) {
      const a = path[i - 1], b = path[i], ya = a.grips[1], yb = b.grips[1];
      if ((ya - bar[1]) * (yb - bar[1]) <= 0 && ya !== yb) {
        const t = (bar[1] - ya) / (yb - ya), g = [0, bar[1], a.grips[2] + (b.grips[2] - a.grips[2]) * t];
        const sh = [0, a['shoulder.r'][1] + (b['shoulder.r'][1] - a['shoulder.r'][1]) * t, a['shoulder.r'][2] + (b['shoulder.r'][2] - a['shoulder.r'][2]) * t];
        solid = hyp(g, sh); break;
      }
    }
    const mis = hyp(bar, M.lm['shoulder.r']);
    expect(solid, 'the solid bar path crosses the Mistake bar height').toBeGreaterThan(0);
    expect(solid - mis, `Mistake bar ${mis.toFixed(3)} m from the shoulder, the solid path ${solid.toFixed(3)} m`).toBeGreaterThanOrEqual(0.15);
  });
  it('the `close` tell text and cue do not name the chest', () => {
    const t = sapd.mistake.tells.find((x: any) => x.key === 'close');
    expect(t, 'the close tell').toBeTruthy();
    expect(`${t.text} ${t.cue}`).not.toMatch(/chest/i);
  });
  it('cableColumn stack: the drawn stack rises off its start (end and Mistake), its cable ends on the drawn stack top, and two static rods run through the lifted plates', () => {
    const R = plate.renderPlate(sapd, { id: 'x' }), drawn = qaEng.equipmentItems(Eng(), sapd, R.report, ['start', 'end', 'mistake']);
    const tops: Record<string, number> = {};
    for (const pose of ['start', 'end', 'mistake']) {
      const its = [...drawn[pose].entries()].filter(([k]) => /^eq\d+\.cableColumn\./.test(k));
      const runs = its.map(([, v]) => v).filter((v: any) => v.cls === 'eq-cable' && !v.line);   // the column run: inner -> top pulley -> stack top
      expect(runs.length, pose).toBe(1);
      const xy = [...runs[0].d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]), end = xy[xy.length - 1]!, topPulleyY = xy[xy.length - 2]![1]!;
      const stack = its.map(([, v]) => v).filter((v: any) => v.poly && v.poly.every((p: number[]) => Math.abs(p[0]! - end[0]!) < 15 && p[1]! > topPulleyY + 1));
      tops[pose] = Math.min(...stack.flatMap((v: any) => v.poly.map((p: number[]) => p[1])));
      expect(Math.abs(end[1]! - tops[pose]!), `${pose} cable end on the drawn stack top`).toBeLessThan(1);
      const rods = [...drawn[pose].entries()].filter(([k, v]) => /\.line\./.test(k) && v.cls === 'eq-thin').map(([, v]) => v.line);
      expect(rods.length, `${pose} rods`).toBe(2);
      for (const r of rods) {
        expect(Math.abs(r[0][0] - end[0]!), `${pose} rod inside the stack`).toBeLessThan(15);
        expect(Math.min(r[0][1], r[1][1]), `${pose} rod above the lifted plates`).toBeLessThan(tops[pose]!);
      }
    }
    for (const pose of ['end', 'mistake']) expect(tops[pose]!, `${pose} stack above its start`).toBeLessThan(tops.start! - 5);
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

describe('LIB-9a A5: lb1/rows.json holds exactly the 13 LB1 ids not held, all mode H', () => {
  /** Row keys counted in the raw text, so a duplicated key (which JSON.parse would merge) is seen. */
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of ROW_IDS) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!ROW_IDS.includes(k!)) bad.push(`extra ${k}`);
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
    const held = { ...j, rows: { ...j.rows, lib_horizontal_leg_press: j.rows.lib_leg_press_calf_raise } };
    expect(a5(JSON.stringify(held, null, 1))).toEqual(['extra lib_horizontal_leg_press']);
  });
  it('every row points at its own spec file, carries the census view, and is mode H (13 H, 0 D; the guard for the H10 gap)', () => {
    const rows = readJson(ROWS).rows;
    for (const [id, r] of Object.entries<any>(rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
    }
    expect(Object.values<any>(rows).map(r => r.mode)).toEqual(Array(13).fill('H'));
    expect(readJson(ROWS)).toMatchObject({ batch: 'LB1', censusRef: '4a9fd86' });
  });
});

describe('LIB-9a A9: nothing ships (D-LIB4-ENTRY-2)', { timeout: T }, () => {
  it('every LB1 row is at stage drawing or review', () => {
    for (const [id, r] of Object.entries<any>(readJson(ROWS).rows)) expect(['drawing', 'review'], id).toContain(r.stage);
  });
  it('no LB1 id is shipped, even with lb1/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(13);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  /** Problems of a batches/ listing [[name, text]]: an LB1 id as a whole token. */
  const batchProblems = (files: [string, string][]) => files.flatMap(([f, text]) => IDS.filter(id => new RegExp(`\\b${id}\\b`).test(text)).map(id => `${f}: ${id}`));
  it('no LB1 id is in any tools/plates/library/batches/ file', () => {
    const dir = 'tools/plates/library/batches';
    expect(batchProblems(readdirSync(dir).filter(n => n.endsWith('.json')).map(f => [f, readFileSync(join(dir, f), 'utf8')]))).toEqual([]);
  });
  it('mutations: a batches/ file naming lib_chin_up is red; one naming only lib_dumbbell_shoulder_press stays green', () => {
    expect(batchProblems([['zz.json', '{"rows":{"lib_chin_up":{}}}']])).toEqual(['zz.json: lib_chin_up']);
    expect(batchProblems([['zz.json', '{"rows":{"lib_dumbbell_shoulder_press":{}}}']])).toEqual([]);
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

describe('LIB-9a Q-A (#245): candidate.mjs resolves the How-to source exactly as registry sourceOf does', () => {
  // registry.mjs stays byte-identical (it is an input of every generated file); candidateOf resolves the source of a row
  // in the injected rows itself. It must equal sourceOf for every main row and, with lb1/rows.json read as an extra
  // batch file through the registry's own test hook, for the 13 LB1 rows.
  it('equal to sourceOf for every main row and the 13 LB1 rows', () => {
    for (const r of reg.rows()) expect(cand.howtoOf(r.id, undefined, all), r.id).toBe(reg.sourceOf(r.id));
    reg.__setExtraBatches([ROWS]);
    try { for (const id of ROW_IDS) expect(cand.howtoOf(id, undefined, all), id).toBe(reg.sourceOf(id)); } finally { reg.__setExtraBatches([]); }
  });
  // The changed-path mutation is a source mutation (candidate.mjs howto/ -> how-to/), listed red on the PR.
  it('an unknown id throws', () => {
    expect(() => cand.howtoOf('lib_no_such_id', undefined, all)).toThrow(/no row/);
  });
});

describe('LIB-9a A4, A6 and Q1: runQa node half on the LB1 slice', { timeout: T }, () => {
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  const candOf = (id: string, page = html, a = all) => cand.candidateOf(id, { all: a, platesHtml: page, engine: E, authoring: true });
  // F7 is raised exactly where the card is drawable:false (lib4-cards 13 Q1(a)): assisted_pull_up at research head 9eaa248 (LR-31)
  it('clean: both slice plates have no node-half problem; F7 is raised only on a drawable:false card, and only F5 waits on the browser half', async () => {
    for (const id of ['lib_close_grip_pulldown', 'lib_assisted_pull_up']) {
      const r = await qa(await candOf(id)), f7 = readJson(`docs/research/howto/cards/${id.replace(/^lib_/, '')}.json`).plate.mistake.drawable === false;
      expect(node(r), id).toEqual([]);
      expect(r.flags.F7.raised, id).toBe(f7);
      expect(f7, id).toBe(id === 'lib_assisted_pull_up');
      expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5', ...(f7 ? ['F7'] : [])].includes(f)), id).toEqual([]);
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
  // LIB-3c fails closed when neither the family (param-ranges.json) nor ctx.envelope names a PARAMS key, so the D copy
  // carries a test-only envelope row for camera.maxScale, LIB-3b/3c's TEST_ENV row; nothing is written.
  const TEST_ENV = { 'camera.maxScale': [0.9, 1.1] };
  const h10 = async (params: any, change?: (c: any) => any, ctx: any = { envelope: TEST_ENV }) => {
    let c = await cand.candidateOf('lib_close_grip_pulldown', { all: dAll(params), platesHtml: html, engine: E, authoring: true });
    if (change) c = change(c);
    if (ctx.keepChild !== true && c.derivation) {   // the copy is close_grip's own H drawing, so LIB-3c's child proof is pinned on its own below
      const own = golden.fragmentsOf(c.plate);
      c = { ...c, derivation: { ...c.derivation, rebuildChild: async () => own } };
    }
    return (await qaNode.h10(c, ctx)).map((p: any) => p.key);
  };
  it('clean: the plan parent lib_lat_pulldown rebuilt alone matches its GOLDEN.json fragments (H10\'s checks bite; not "a valid D")', async () => {
    expect(await h10({ 'camera.maxScale': 1 })).toEqual([]);
    expect(readJson(ROWS).rows.lib_close_grip_pulldown.mode).toBe('H');   // nothing written
  });
  it('LIB-3c child proof: the copy, close_grip\'s own drawing, is not lat_pulldown derived, so every fragment gives H10.child', async () => {
    expect(await h10({ 'camera.maxScale': 1 }, undefined, { envelope: TEST_ENV, keepChild: true })).toEqual(qaNode.FRAG_KEYS.map((k: string) => `H10.child:${k}`));
  });
  it('mutation: no envelope row for camera.maxScale fails closed with H10.envelope (LIB-3c)', async () => {
    expect(await h10({ 'camera.maxScale': 1 }, undefined, {})).toEqual(['H10.envelope:camera.maxScale']);
  });
  it('mutation: camera.maxScale outside the envelope row gives H10.value', async () => {
    expect(await h10({ 'camera.maxScale': 1.2 })).toEqual(['H10.value:camera.maxScale']);
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
  // Q1 (lib4-cards 13 Q1(a)) on the research head named in #245 6246213504 (LR-31): DRAWN maps each card's plate.mistake
  // to its key (the spec's first Mistake tell); a drawable:false card's topFault is the key of the top fault the card
  // names, TOP_FALSE (keys proposed for the supervisor's ruling), so F7 is raised for exactly those ids.
  const DRAWN: Record<string, string> = { chin_up: 'kip', hanging_knee_raise: 'swing', assisted_pull_up: 'partial', inverted_row: 'sag', close_grip_pulldown: 'low',
    underhand_lat_pulldown: 'past', single_arm_lat_pulldown: 'past', straight_arm_pulldown: 'bend', chest_supported_row: 'lean', resistance_band_row: 'slump',
    incline_machine_press: 'blades', shoulder_press: 'arch', horizontal_leg_press: 'lock', leg_press_calf_raise: 'lock' };
  const TOP_FALSE: Record<string, string> = { assisted_pull_up: 'fast', resistance_band_row: 'snap', shoulder_press: 'drop' };
  it('Q1: topFault is the drawn key on a drawable:true card and the card\'s own top-fault key on a drawable:false card; every drawn first tell carries the drawn key', async () => {
    for (const id of LB1) {
      const c = cardOf(id);
      expect(c.plate.mistake.drawable, id).toBe(!(id in TOP_FALSE));
      expect(c.topFault, id).toBe(TOP_FALSE[id] ?? DRAWN[id]);
      expect(topFaultProblems(c, DRAWN[id]!), id).toEqual([]);
    }
    for (const id of build.drawnIds().map((i: string) => i.replace(/^lib_/, ''))) {
      const spec = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default;
      expect(spec.mistake.tells[0].key, `${id} first tell`).toBe(DRAWN[id]);
    }
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
