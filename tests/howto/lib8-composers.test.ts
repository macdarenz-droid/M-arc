// LIB-8-FIX (review 6243689943, finding 2): pilot A's three equipment composers, drawn by the vendored primitives.
// Run: npx vitest run tests/howto/lib8-composers.test.ts
import { beforeAll, describe, expect, it } from 'vitest';

type V = number[];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Item = any;
const LIB = '../../tools/plates/library/';
const imp = (p: string) => import(/* @vite-ignore */ new URL(LIB + p, import.meta.url).href);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let PRIMITIVES: any, bench: any, deck: any, arms: any;
beforeAll(async () => {
  ({ PRIMITIVES } = await imp('engine.mjs'));
  [bench, deck, arms] = await Promise.all(['eq/inclineBench.mjs', 'eq/pecDeck.mjs', 'eq/safetyArms.mjs'].map(imp));
});

const PXM = 146.29;
const sideCam = { view: 'side', facing: 'right', near: 'r', pxm: PXM, pxPerM: PXM, P: (w: V) => [100 + w[2]! * PXM, 400 - w[1]! * PXM] };
const frontCam = { view: 'front', facing: 'right', near: null, pxm: PXM, pxPerM: PXM, P: (w: V) => [200 + w[0]! * PXM, 400 - w[1]! * PXM] };
const sub = (a: V, b: V) => a.map((v, i) => v - b[i]!), dot = (a: V, b: V) => a.reduce((s, v, i) => s + v * b[i]!, 0);
const norm = (a: V) => { const L = Math.hypot(...a) || 1; return a.map(v => v / L); };
const close = (a: V, b: V) => a.forEach((v, i) => expect(v).toBeCloseTo(b[i]!, 9));
// The centre line [a, b] of a parts.mjs sideBar: its surface is [b + o, a + o], o = t/2 along [0, -u.z, u.y].
const centreLine = (it: Item): [V, V] => {
  const [hi, lo] = it.surface as [V, V], u = norm(sub(hi, lo)), o = [0, -u[2]!, u[1]!].map(v => v * it.t / 2);
  return [sub(lo, o), sub(hi, o)];
};
const drawsWith = (items: Item[], cam: object) => {
  for (const it of items) {
    expect(Object.keys(PRIMITIVES)).toContain(it.type);
    const paths = PRIMITIVES[it.type](it, cam);
    expect(paths.length).toBeGreaterThan(0);
    for (const p of paths) expect(p.d).not.toMatch(/NaN/);
  }
};

describe('LIB-8 inclineBench (side view)', () => {
  const p = { hinge: [0, 0.48, -0.04], back: 45, seatTilt: 12, backLen: 0.84, beamZ: [-0.72, 0.36] };
  it('draws 7 primitive items, the same on every call', () => {
    const items = bench.inclineBench(p);
    expect(items).toHaveLength(7);
    drawsWith(items, sideCam);
    expect(bench.inclineBench(p)).toEqual(items);
  });
  it('each pad centre line sits pad/2 inside its face at the hinge', () => {
    const items = bench.inclineBench(p), F = bench.inclineFaces(p), pad = 0.07;
    const [seatA] = centreLine(items[6]), [backA] = centreLine(items[5]);
    expect(dot(sub(seatA, p.hinge), F.seat.normal)).toBeCloseTo(-pad / 2, 9);
    expect(dot(sub(backA, p.hinge), F.back.normal)).toBeCloseTo(-pad / 2, 9);
    expect(items[6].t).toBe(pad);
    expect(items[5].t).toBe(pad);
  });
  it('the seat post runs from the seat pad underside down to the floor beam height', () => {
    const items = bench.inclineBench(p), F = bench.inclineFaces(p);
    const [top, foot] = centreLine(items[3]), [beamA, beamB] = centreLine(items[0]);
    expect(dot(sub(top, p.hinge), F.seat.normal)).toBeCloseTo(-0.07, 9);
    expect(foot[1]).toBeCloseTo(beamA[1]!, 9);
    expect(beamB[1]).toBeCloseTo(beamA[1]!, 9);
    expect(foot[2]).toBeCloseTo(top[2]!, 9);
  });
});

describe('LIB-8 pecDeck (front view)', () => {
  const p = {
    pivot: { l: [0.22, 1.42, -0.1], r: [-0.22, 1.42, -0.1] }, grips: { l: [0.55, 1.15, 0.2], r: [-0.55, 1.15, 0.2] },
    seat: [0, 0.48, 0.02], back: { at: [0, 0.9, -0.2], len: 0.7 }, top: 1.45, pxPerM: PXM,
  };
  it('draws PEC_DECK_ITEMS items (+2 with uprights, -2 with direct), the same on every call', () => {
    const items = deck.pecDeck(p);
    expect(deck.PEC_DECK_ITEMS).toBe(10);
    expect(items).toHaveLength(10);
    expect(deck.pecDeck({ ...p, uprights: 0.29 })).toHaveLength(12);
    expect(deck.pecDeck({ ...p, direct: true })).toHaveLength(8);
    for (const o of [{}, { uprights: 0.29 }, { direct: true }, { direct: true, uprights: 0.29 }]) drawsWith(deck.pecDeck({ ...p, ...o }), frontCam);
    expect(deck.pecDeck(p)).toEqual(items);
  });
  it('per side: boss at the pivot, level arm to a corner at pivot height, drop from that corner, handle at the grip', () => {
    const items = deck.pecDeck(p);
    for (const [k, s] of [[4, 'l'], [7, 'r']] as const) {
      const pv = p.pivot[s], g = p.grips[s], [boss, arm, drop] = items.slice(k, k + 3);
      expect(boss).toMatchObject({ type: 'pulley' });
      close(boss.at, pv);
      expect(arm.type).toBe('backPad');
      close(arm.at, [(pv[0]! + g[0]!) / 2, pv[1]!, (pv[2]! + g[2]!) / 2]);
      expect(arm.width).toBeCloseTo(Math.abs(g[0]! - pv[0]!), 9);
      expect(drop.type).toBe('chestPress');
      close(drop.pivot, [g[0]!, pv[1]!, g[2]!]);
      close(drop.handle, g);
    }
  });
});

describe('LIB-8 safetyArms (side view)', () => {
  const p = { front: 0.5, back: -0.5, armY: 1.3771, h: 2.4 };
  it('draws 4 items, 5 with hookY, the same on every call', () => {
    const items = arms.safetyArms(p), hooked = arms.safetyArms({ ...p, hookY: 1.43 });
    expect(items).toHaveLength(4);
    expect(hooked).toHaveLength(5);
    drawsWith(hooked, sideCam);
    expect(arms.safetyArms(p)).toEqual(items);
    expect(arms.safetyArms({ ...p, hookY: 1.43 })).toEqual(hooked);
  });
  it('the arm top is at armY', () => {
    const it0 = arms.safetyArms(p)[3], [a, b] = centreLine(it0);
    expect(a[1]! + it0.t / 2).toBeCloseTo(p.armY, 9);
    expect(b[1]! + it0.t / 2).toBeCloseTo(p.armY, 9);
  });
  it('the hook sits on the front upright rear face and points back into the rack (-z)', () => {
    const hook = arms.safetyArms({ ...p, hookY: 1.43 })[4], face = p.front - 0.076 / 2;
    expect(hook.type).toBe('poly');
    const zs = hook.pts.map((q: V) => q[2]!);
    expect(Math.max(...zs)).toBeCloseTo(face, 9);
    for (const z of zs) expect(z).toBeLessThanOrEqual(face + 1e-9);
    expect(Math.min(...zs)).toBeLessThan(face - 0.05);
    expect(Math.max(...hook.pts.map((q: V) => q[1]!))).toBeGreaterThan(1.43);
  });
  it('hookY: null gives the same output as no hookY', () => {
    expect(arms.safetyArms({ ...p, hookY: null })).toEqual(arms.safetyArms(p));
  });
});
