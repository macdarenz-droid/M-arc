// LIB-10 (lib-10-card Do 2 a, Do 4; acceptance A2, A3, A5, A9; rulings lib4-cards section 15): the LB2 build-ahead
// plates. Node only: the browser half of the plate QA runs in tools/plates/library/lb2/qa.mjs once LIB-3c is on main.
// Every test reads what is drawn (the items a spec emits, the engine's landmarks and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { child } from '../child-test';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB2 = ['barbell_bench_press', 'incline_barbell_bench_press', 'close_grip_bench_press', 'decline_bench_press', 'arnold_press',
  'skull_crusher', 'dumbbell_pullover'];
// D-LIB10-IDP and D-LIB10-IDP-A (#265): incline_dumbbell_press comes into LB2 for its Mistake redraw, drawn in its own
// file specs/incline_dumbbell_press__lb2.mjs so pilot A's pinned spec stays byte-identical.
const IDP = 'incline_dumbbell_press';
const IDS = [...LB2, IDP].map(i => `lib_${i}`);
const REUSED = ['dumbbell_bench_press', 'dumbbell_shoulder_press', 'barbell_overhead_press'];
const HELD = 'dumbbell_fly';
const ROWS = 'tools/plates/library/lb2/rows.json';
const COMPOSERS = ['declineBench'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const sub3 = (a: number[], b: number[]) => a.map((x, i) => x - b[i]!);
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);

let eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, reg: any, pins: any;
let dbp: any, dbpMod: any, sc: any, scMod: any, cg: any, cgMod: any, bb: any, bbMod: any, po: any, poMod: any;
let ibp: any, ibpMod: any, ap: any, apMod: any, idp: any, idpMod: any;
beforeAll(async () => {
  [eng, body, qaNode, qaEng, qaIdx, plate, closure, reg] = await Promise.all([
    'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'registry.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  pins = qaIdx.loadPins();
  dbpMod = await import(/* @vite-ignore */ lib('specs/decline_bench_press.mjs'));
  dbp = dbpMod.default;
  scMod = await import(/* @vite-ignore */ lib('specs/skull_crusher.mjs'));
  sc = scMod.default;
  cgMod = await import(/* @vite-ignore */ lib('specs/close_grip_bench_press.mjs'));
  cg = cgMod.default;
  bbMod = await import(/* @vite-ignore */ lib('specs/barbell_bench_press.mjs'));
  bb = bbMod.default;
  poMod = await import(/* @vite-ignore */ lib('specs/dumbbell_pullover.mjs'));
  po = poMod.default;
  ibpMod = await import(/* @vite-ignore */ lib('specs/incline_barbell_bench_press.mjs'));
  ibp = ibpMod.default;
  apMod = await import(/* @vite-ignore */ lib('specs/arnold_press.mjs'));
  ap = apMod.default;
  idpMod = await import(/* @vite-ignore */ lib('specs/incline_dumbbell_press__lb2.mjs'));
  idp = idpMod.default;
}, T);

const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const posesOf = (spec: any) => ['start', 'end', ...(spec.mistake?.pose ? ['mistake'] : [])];
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
  let R: any = null;
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins.envelope }, R).map((p: any) => p.key);
};
/** Landmarks at an even t across the drawn path (start, via keys, end), as the engine samples ghosts and the trace. */
const pathLm = (spec: any, t: number) => {
  const H = { height: 1.75 }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, H));
  return body.landmarks(body.fk(body.poseAt(keys, t, H).q, H));
};
/** A sideBar item's centre line ends (eq/parts.mjs: a backPad in its surface form, the line shifted t/2 along its normal). */
const barLine = (it: any): [number[], number[]] => {
  const [hi, lo] = it.surface, u = [0, hi[1] - lo[1], hi[2] - lo[2]], k = Math.hypot(u[1]!, u[2]!), n = [0, -u[2]! / k, u[1]! / k];
  const o = n.map(v => v * it.t / 2);
  return [lo.map((v: number, i: number) => v - o[i]!), hi.map((v: number, i: number) => v - o[i]!)];
};

describe('LIB-10 A2 / Do 4: declineBench and the H slice plates draw PRIMITIVES only', { timeout: T }, () => {
  it('composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const f of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${f}.mjs`, 'utf8');
      expect(src, f).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, f).not.toMatch(/layers\//);
    }
  });
  it('every item the slice plates draw is a PRIMITIVES type, in every drawn pose', () => {
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) for (const pose of posesOf(spec))
      for (const it of itemsIn(spec, pose).items) expect(Object.keys(eng.PRIMITIVES), `${spec.id} ${pose}`).toContain(it.type);
  });
  it('the slice plates pass PQ-H9', () => {
    expect(h9(dbp)).toEqual([]);
    expect(h9(sc)).toEqual([]);
    expect(h9(cg)).toEqual([]);
    expect(h9(bb)).toEqual([]);
    expect(h9(po)).toEqual([]);
    expect(h9(ibp)).toEqual([]);
    expect(h9(ap)).toEqual([]);
    expect(h9(idp)).toEqual([]);
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    expect(h9({ ...dbp, equipment: [...dbp.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws both slice plates with no engine issue and every check within its tolerance', () => {
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) {
      const r = plate.renderPlate(spec, { id: 'x' }).report;
      expect(r.issues ?? [], spec.id).toEqual([]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${spec.id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(1);
      for (const c of r.checks) if ('aboveCm' in c) expect(c.aboveCm, `${spec.id} ${c.landmark} ${c.pose}`).toBeGreaterThan(0);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${spec.id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-10 Do 4: declineBench on decline_bench_press, per drawn pose (13.1)', { timeout: T }, () => {
  const R = Math.PI / 180;
  const ofType = (spec: any, pose: string, type: string) => itemsIn(spec, pose).items.filter(it => it.type === type);
  it('the drawn pad falls toward the head at the card angle (c2: about -15 deg), under backUpper and buttock in every pose', () => {
    for (const pose of posesOf(dbp)) {
      const { items, lm } = itemsIn(dbp, pose);
      const pads = items.filter(it => it.type === 'backPad' && it.t === 0.07);
      expect(pads.length, pose).toBe(1);
      const [a, b] = barLine(pads[0]), slope = Math.atan2(b[1]! - a[1]!, b[2]! - a[2]!) / R;
      expect(slope, pose).toBeCloseTo(15, 6);
      // the pad's top face (centre line + half its thickness along its normal) passes through the lifter's back contacts
      const n = [0, Math.cos(15 * R), -Math.sin(15 * R)], face = a.map((v, i) => v + n[i]! * 0.035);
      for (const k of ['backUpper', 'buttock']) {
        const d = (lm[k][1] - face[1]!) * n[1]! + (lm[k][2] - face[2]!) * n[2]!;
        expect(Math.abs(d), `${pose} ${k}`).toBeLessThan(0.01);
      }
      expect(a[2]!, `${pose}: the head end lies past the skull`).toBeLessThan(lm.head[2]);
      expect(a[1]!, `${pose}: the head end is the low end`).toBeLessThan(b[1]!);
    }
  });
  it('the feet hook under the drawn rollers at the high end (c1): each ankle touches its roller in every pose', () => {
    for (const pose of posesOf(dbp)) {
      const { items, lm } = itemsIn(dbp, pose);
      const rollers = items.filter(it => it.type === 'kneePad');
      expect(rollers.length, pose).toBe(1);
      const r = rollers[0], c = [0, r.at[1] + r.r, r.at[2]];
      const gap = Math.hypot(lm['ankle.r'][1] - c[1]!, lm['ankle.r'][2] - c[2]!) - r.r - body.RADII.shank[2] * 1.75;
      expect(Math.abs(gap), pose).toBeLessThan(0.002);
      expect(c[2]!, `${pose}: the rollers are at the high end`).toBeGreaterThan(lm.buttock[2]);
      expect(lm['ball.r'][1], `${pose}: the foot runs under the roller`).toBeLessThan(c[1]!);
    }
  });
  it('the rack stands slightly behind the lifter (c1): headward of the start bar, over the head; its J-hook is reachable with the elbows still bent (c7)', () => {
    const { items, lm } = itemsIn(dbp, 'start');
    const up = items.filter(it => it.type === 'rackUpright');
    expect(up.length).toBe(1);
    const u = up[0];
    expect(u.at[2]).toBeLessThan(lm.grips[2] - 0.10);
    expect(u.at[2]).toBeGreaterThan(lm.head[2] - 0.10);
    const bar = [-0.30, u.hook + 0.014, u.at[2]], arm = 1.75 * (body.WINTER.upperArm + body.WINTER.forearm + body.REF.gripOff);
    expect(dist(lm['shoulder.r'], bar)).toBeLessThan(arm - 0.01);
    expect(u.h).toBeGreaterThan(u.hook + 0.1);
  });
  it('the safety arm (c6) sits under the bar at the touch and runs from the rack past the touch point', () => {
    const { items, lm } = itemsIn(dbp, 'end');
    const arms = items.filter(it => it.type === 'backPad' && it.t === 0.05 && Math.abs(it.surface[0][1] - it.surface[1][1]) < 1e-9 && it.surface[0][1] > 0.2);
    expect(arms.length).toBe(1);
    const [a, b] = barLine(arms[0]), top = a[1]! + 0.025, bar = lm.grips;
    expect(top).toBeLessThan(bar[1] - 0.014);
    expect(top).toBeGreaterThan(bar[1] - 0.014 - 0.06);
    expect(Math.min(a[2]!, b[2]!)).toBeLessThan(bar[2]);
    expect(Math.max(a[2]!, b[2]!)).toBeGreaterThan(bar[2]);
  });
  it('the bar touches the lower chest at the end (c5): footward of the shoulder and of the chest landmark, toward the navel', () => {
    const lm = itemsIn(dbp, 'end').lm;
    expect(lm.grips[2]).toBeGreaterThan(lm.chest[2]);
    expect(lm.grips[2]).toBeLessThan(lm.navel[2]);
    const lmS = itemsIn(dbp, 'start').lm;
    expect(lmS['elbow.r'][1] - lmS['shoulder.r'][1]).toBeGreaterThan(0.3);   // locked arms up at the start (c7)
  });
  it('every bench and rack part is the same item in start and end (static: no Mistake twin is needed)', () => {
    const key = (it: any) => JSON.stringify({ ...it, entry: undefined });
    const s = ofType(dbp, 'start', 'backPad').concat(ofType(dbp, 'start', 'kneePad'), ofType(dbp, 'start', 'rackUpright')).map(key);
    const e = ofType(dbp, 'end', 'backPad').concat(ofType(dbp, 'end', 'kneePad'), ofType(dbp, 'end', 'rackUpright')).map(key);
    expect(s.length).toBeGreaterThanOrEqual(8);
    expect(e).toEqual(s);
  });
});

describe('LIB-10 Do 2 a: skull_crusher draws the elbow-only arm', { timeout: T }, () => {
  const L1 = 1.75 * 0.186;
  it('at t = 0..1 in tenths (start, via keys, end) the upper arm stays vertical within 2 deg (c5), the elbow over the shoulder', () => {
    for (let k = 0; k <= 10; k++) {
      const lm = pathLm(sc, k / 10);
      const tilt = Math.atan2(Math.abs(lm['elbow.r'][2] - lm['shoulder.r'][2]), lm['elbow.r'][1] - lm['shoulder.r'][1]) * 180 / Math.PI;
      expect(tilt, `t ${k / 10}: upper arm off vertical (deg), H6's 2 deg`).toBeLessThan(2);
      expect(lm['elbow.r'][1] - lm['shoulder.r'][1], `t ${k / 10}`).toBeGreaterThan(L1 * 0.98);
    }
  });
  it('the end bar sits just above the forehead (c5): over the brow, the grip centre 3-6 cm above it; the start elbow is straight (c2)', () => {
    const i = scMod.info();
    expect(i.endGripVsBrowCm.up).toBeGreaterThanOrEqual(3);
    expect(i.endGripVsBrowCm.up).toBeLessThanOrEqual(6);
    expect(Math.abs(i.endGripVsBrowCm.headward)).toBeLessThan(3);
    const lm = pathLm(sc, 0), e = lm['elbow.r'], s = lm['shoulder.r'], g = lm['grip.r'];
    const ang = Math.acos(((e[1] - s[1]) * (g[1] - e[1]) + (e[2] - s[2]) * (g[2] - e[2])) / (Math.hypot(e[1] - s[1], e[2] - s[2]) * Math.hypot(g[1] - e[1], g[2] - e[2]))) * 180 / Math.PI;
    expect(ang).toBeLessThan(10);
  });
  it('the head lies near the bench end (c10): the drawn pad ends 0-5 cm past the top of the skull', () => {
    const { items } = itemsIn(sc, 'end'), b = items.filter(it => it.type === 'bench');
    expect(b.length).toBe(1);
    const headEnd = b[0].at[2] - b[0].len / 2;
    expect(scMod.info().headTopZ - headEnd).toBeGreaterThanOrEqual(0);
    expect(scMod.info().headTopZ - headEnd).toBeLessThanOrEqual(0.05);
  });
});

describe('LIB-10 H slice Mistakes (research 2b6747f8; D-LIB10-NOTE section 10)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { decline_bench_press: 'high', skull_crusher: 'drift', close_grip_bench_press: 'flare', barbell_bench_press: 'path', dumbbell_pullover: 'bend', incline_barbell_bench_press: 'flare', arnold_press: 'arch', incline_dumbbell_press: 'arch' };
  /** The ruled first-tell key check (13 Q1(a)): tells[0].key is the card's ruled key. */
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each slice plate draws its Mistake, and its first tell carries the ruled key', () => {
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) expect(keyProblems(spec)).toEqual([]);
  });
  it('mutation: the first tell key swapped is red', () => {
    expect(keyProblems({ ...dbp, mistake: { ...dbp.mistake, tells: [...dbp.mistake.tells].reverse() } })).toEqual(['decline_bench_press: first tell neck']);
  });
  it('2-3 tells on decline_bench_press and close_grip_bench_press; skull_crusher has one (D-LIB10-SKULL1, Q-D5-4)', () => {
    expect(dbp.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(cg.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(bb.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(po.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(ibp.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(ap.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(idp.mistake.tells.length).toBeGreaterThanOrEqual(2);
    expect(sc.mistake.tells.length).toBe(1);
  });
  it('decline: the Mistake bar touches the chest at least 15 cm headward of the end touch and nearer the chin (c5, c12)', () => {
    const i = dbpMod.mistakeInfo();
    expect(i.touchMovedHeadwardCm).toBeGreaterThanOrEqual(15);
    expect(i.barToChinCm.mistake).toBeLessThan(i.barToChinCm.end - 10);
    const e = itemsIn(dbp, 'end').lm, m = itemsIn(dbp, 'mistake').lm;
    expect(m.grips[2]).toBeLessThan(e.grips[2] - 0.15);
    expect(m.buttock).toEqual(e.buttock);   // only the bar and arms move
  });
  it('skull_crusher: in the Mistake the upper arm tips back at least 20 deg from vertical; the bar stays clear of the head', () => {
    const lm = itemsIn(sc, 'mistake').lm, tilt = Math.atan2(lm['shoulder.r'][2] - lm['elbow.r'][2], lm['elbow.r'][1] - lm['shoulder.r'][1]) * 180 / Math.PI;
    expect(tilt).toBeGreaterThanOrEqual(20);
    expect(scMod.mistakeInfo().barClearsCrownCm).toBeGreaterThan(5);
  });
  it('every Mistake guide is dashed or an arrow (red parts over the solid end figure are dashed, 13.1)', () => {
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) for (const g of spec.mistake.guides) expect(['dashed', 'arrow'], spec.id).toContain(g.kind);
  });
  it('the tempo strips are the ruled arrays (D-LIB10-NOTE sections 6 and 9)', () => {
    expect(dbp.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Pause', s: 1 }, { phase: 'Press', s: 1, move: true }]);
    expect(sc.tempo).toEqual([{ phase: 'Lower', s: 3, move: true }, { phase: 'Extend', s: 1, move: true }]);
    expect(cg.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }]);
    expect(bb.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }, { phase: 'Hold', s: 1 }]);
    expect(po.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Pull', s: 1, move: true }]);
    expect(ibp.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }]);
    expect(ap.tempo).toEqual([{ phase: 'Press', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }]);
    expect(idp.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Press', s: 1, move: true }]);
  });
  it('mutation (A2, Q4 (a)-(b)): the moving bar swapped for a rackUpright gives exactly H9.moving-line:eq<i>.rackUpright.1', () => {
    // premise: exactly one item (the barbell) is swapped, in one entry, and it moves between the end and the Mistake
    const hits = new Set<number>();
    const spec = { ...dbp, equipment: dbp.equipment.map((e: any, i: number) => (typeof e !== 'function' ? e
      : (lm: any, ctx: any) => [].concat(e(lm, ctx) ?? []).map((it: any) => (it && it.type === 'barbell' ? (hits.add(i), { type: 'rackUpright', at: [0, it.at[1] - 0.5, it.at[2]], h: 0.5, part: 'plate' }) : it)))) };
    const keys = h9(spec);
    expect(hits.size).toBe(1);
    const i = [...hits][0];
    const e = itemsIn(dbp, 'end').items.find(it => it.type === 'barbell'), m = itemsIn(dbp, 'mistake').items.find(it => it.type === 'barbell');
    expect(e.at).not.toEqual(m.at);
    expect(keys).toEqual([`H9.moving-line:eq${i}.rackUpright.1`]);
  });
  it('every drawn LB2 plate: no leader comes within 6 px of the trace, a cable or a bar sleeve, away from its anchor', () => {
    const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
    const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
    const dseg = (p: number[], [a, b]: number[][]) => { const dx = b![0]! - a![0]!, dy = b![1]! - a![1]!, L2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((p[0]! - a![0]!) * dx + (p[1]! - a![1]!) * dy) / L2)); return Math.hypot(p[0]! - a![0]! - t * dx, p[1]! - a![1]! - t * dy); };
    const leaderOk = (d: string) => /^ML*H?$/.test(d.replace(/[\d.\s,-]/g, ''));
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg;
      const avoid = [...svg.matchAll(/<path class="(?:trace|eq-cable|eq-solid)[^"]*"[^>]*? d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      // premise: something to avoid; only a Mistake plate with no bar or cable (arnold_press's dumbbells) has none
      const barOrCable = itemsIn(spec, 'end').items.some(it => it.type === 'barbell' || it.type === 'cable');
      if (!mistake || barOrCable) expect(avoid.length, spec.id).toBeGreaterThan(0);
      for (const [, d] of svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)) {
        if (!leaderOk(d!)) throw new Error(`${spec.id}: leader path has a command other than M, L or H: ${d}`);
        const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]);
        let min = Infinity;
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) min = Math.min(min, dseg(q, g));
        }
        expect(min, `${spec.id}${mistake ? ' Mistake' : ''} leader ${d}`).toBeGreaterThanOrEqual(6);
      }
    }
  });
  it('decline (Q7): the rack upright is drawn behind the figure; the hidden safety span is redrawn dashed in the end pose only (13 Q2 (c))', () => {
    const up = itemsIn(dbp, 'end').items.filter(it => it.type === 'rackUpright');
    expect(up.map(u => u.z)).toEqual(['back']);
    const ph = (pose: string, mistake = false) => itemsIn(dbp, pose, { mistake }).items.filter(it => it.part === 'safety' && it.type === 'line');
    expect(ph('end').length).toBe(2);
    for (const l of ph('end')) { expect(l.cls).toMatch(/m-line/); expect(Math.max(...l.pts.map((q: number[]) => q[2]))).toBeGreaterThan(itemsIn(dbp, 'end').lm.grips[2]); }
    expect(ph('start').length).toBe(0);
    expect(ph('end', true).length).toBe(0);
  });
});

describe('LIB-10 close_grip_bench_press (H, D-LIB10-BENCH-H): drawn facts', { timeout: T }, () => {
  it('c1: the grips sit in line with the shoulder joints, recomputed from engine landmarks (|Δ| ≤ 0.5 mm), in start and end', () => {
    for (const pose of ['start', 'end']) {
      const lm = itemsIn(cg, pose).lm;
      expect(Math.abs(Math.abs(lm['grip.r'][0]) - Math.abs(lm['shoulder.r'][0])), pose).toBeLessThanOrEqual(0.0005);
    }
    expect(Math.round(2 * cgMod.GRIP_X * 1000) / 1000).toBe(0.453);
  });
  it('c4: the end bar sits on the chest where the ribs end: footward of the chest landmark, headward of the navel', () => {
    const lm = itemsIn(cg, 'end').lm;
    expect(lm.grips[2]).toBeGreaterThan(lm.chest[2] + 0.05);
    expect(lm.grips[2]).toBeLessThan(lm.navel[2]);
  });
  it('c2: at the end the elbow stays by the ribs (within 8 cm of the shoulder line sideways, below the shoulder); the Mistake swings it at least 15 cm out', () => {
    const e = itemsIn(cg, 'end').lm, m = itemsIn(cg, 'mistake').lm;
    expect(Math.abs(e['elbow.r'][0]) - Math.abs(e['shoulder.r'][0])).toBeLessThan(0.08);
    expect(e['elbow.r'][1]).toBeLessThan(e['shoulder.r'][1]);
    expect(Math.abs(m['elbow.r'][0]) - Math.abs(e['elbow.r'][0])).toBeGreaterThanOrEqual(0.15);
    expect(cgMod.info().misTouchHeadwardCm).toBeGreaterThanOrEqual(15);
    expect(cgMod.info().misBarToChinCm).toBeGreaterThan(8);   // high on the chest, never at the neck
  });
  it('rack (parent c6, Q2): the head-side J-hook opens toward the feet, into the rack, holding the bar headward of the start bar and in reach; the safety pin runs under the touch and below the bar in every pose', () => {
    const { items, lm } = itemsIn(cg, 'start');
    const ups = items.filter(it => it.type === 'rackUpright').sort((a, b) => a.at[2] - b.at[2]);
    expect(ups.length).toBe(2);
    const head = ups[0], hip = ups[1];
    expect(head.hook).toBeGreaterThan(0);
    expect(hip.hook ?? null).toBe(null);
    expect(cg.facing).toBe('right');                        // the vendor hook points the way the figure faces: +z, into the rack
    const bar = [0, head.hook + 0.014, head.at[2] + 0.038 + 0.055];
    expect(bar[2]).toBeLessThan(lm.grips[2] - 0.10);
    const arm = 1.75 * (body.WINTER.upperArm + body.WINTER.forearm + body.REF.gripOff);
    expect(Math.hypot(lm['shoulder.r'][1] - bar[1], lm['shoulder.r'][2] - bar[2], lm['shoulder.r'][0] + cgMod.GRIP_X)).toBeLessThan(arm - 0.01);
    const pin = items.filter(it => it.type === 'backPad' && it.t === 0.05);
    expect(pin.length).toBe(1);
    const [a, b] = barLine(pin[0]), top = a[1]! + 0.025;
    for (const pose of ['start', 'end', 'mistake']) expect(itemsIn(cg, pose).lm.grips[1] - 0.014, pose).toBeGreaterThan(top);
    const e = itemsIn(cg, 'end').lm;
    expect(top).toBeGreaterThan(e.grips[1] - 0.014 - 0.06);
    expect(Math.min(a[2]!, b[2]!)).toBeLessThan(e.grips[2]);
    expect(Math.max(a[2]!, b[2]!)).toBeGreaterThan(e.grips[2]);
  });
});

describe('LIB-10 barbell_bench_press (H, D-LIB10-BBELBOW): drawn facts', { timeout: T }, () => {
  it('c2: the end bar sits at mid-chest (thorax 0.74 H) and the forearm is vertical in the side view (within 1 deg)', () => {
    const lm = itemsIn(bb, 'end').lm, nipple = body.fk(body.resolve(body.normPose(bb.poses.end, { height: 1.75 }), { height: 1.75 }).q, { height: 1.75 }).thorax([0, 0.74, 0.072]);
    expect(Math.abs(lm.grips[2] - nipple[2])).toBeLessThan(0.01);
    const tilt = Math.atan2(Math.abs(lm['grip.r'][2] - lm['elbow.r'][2]), lm['grip.r'][1] - lm['elbow.r'][1]) * 180 / Math.PI;
    expect(tilt).toBeLessThan(1);
  });
  it('the upper arm at the end is 75 ± 2 deg from the torso axis (c2 StrongLifts "about 75°", the card fact; c3 is no fact, D-LIB10-BBELBOW); no label names c3', () => {
    const a = bbMod.info().upperArmFromTorsoDeg;
    expect(a).toBeGreaterThanOrEqual(73);
    expect(a).toBeLessThanOrEqual(77);
    for (const c of [...bb.callouts, ...bb.mistake.tells]) expect(c.text + c.cue).not.toMatch(/45|60|degree/i);
  });
  it('c8: the start bar is over the shoulder joints; the Trace runs the diagonal from there to mid-chest (footward and down)', () => {
    const s = itemsIn(bb, 'start').lm, e = itemsIn(bb, 'end').lm;
    expect(Math.abs(s.grips[2] - s['shoulder.r'][2])).toBeLessThan(0.01);
    expect(e.grips[2] - s.grips[2]).toBeGreaterThan(0.08);
  });
  it('c25 Mistake `path`: the faulty bar is straight above the touch (same z within 1 cm), at least 20 cm up, never back over the shoulders', () => {
    const e = itemsIn(bb, 'end').lm, m = itemsIn(bb, 'mistake').lm;
    expect(Math.abs(m.grips[2] - e.grips[2])).toBeLessThan(0.01);
    expect(m.grips[1] - e.grips[1]).toBeGreaterThanOrEqual(0.20);
    expect(m.grips[2] - m['shoulder.r'][2]).toBeGreaterThan(0.08);
  });
  it('D-LIB10-BBELBOW 1: the rack is close_grip_bench_press\'s rig (the same uprights, hook and pin construction)', () => {
    const kind = (spec: any) => itemsIn(spec, 'start').items.filter(it => it.type === 'rackUpright').map(u => [u.h, u.hook != null, +(u.at[2] - itemsIn(spec, 'start').items.filter(v => v.type === 'rackUpright')[0].at[2]).toFixed(3)]);
    expect(kind(bb)).toEqual(kind(cg));
  });
});

describe('LIB-10 dumbbell_pullover (H): drawn facts', { timeout: T }, () => {
  it('c6: the elbow bend is the same (within 2 deg) at t = 0..1 in tenths; c4: the start arm is vertical over the upper chest', () => {
    const bends = Array.from({ length: 11 }, (_, k) => poMod.elbowBend(pathLm(po, k / 10)));
    for (const b of bends) expect(Math.abs(b - bends[0])).toBeLessThan(2);
    const s = pathLm(po, 0);
    expect(Math.abs(s['grip.r'][2] - s['shoulder.r'][2])).toBeLessThan(0.01);
    expect(s['grip.r'][1]).toBeGreaterThan(s['shoulder.r'][1] + 0.5);
  });
  it('c5: at the end the arms are back past the head, the grips under shoulder height; c2: the bench ends at the crown', () => {
    const e = itemsIn(po, 'end').lm;
    expect(e['grip.r'][2]).toBeLessThan(e.head[2]);
    expect(e['grip.r'][1]).toBeLessThan(e['shoulder.r'][1]);
    const i = poMod.info();
    expect(Math.abs(i.headTopZ - i.benchHeadEndZ)).toBeLessThan(0.005);
  });
  it('c3, c13: one dumbbell, axis vertical, hanging under the grips in every drawn pose', () => {
    for (const pose of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(po, pose), db = items.filter(it => it.type === 'dumbbell');
      expect(db.length, pose).toBe(1);
      expect(db[0].axis, pose).toEqual([0, 1, 0]);
      expect(db[0].at[1], pose).toBeLessThan(lm.grips[1]);
      expect(Math.abs(db[0].at[2] - lm.grips[2]), pose).toBeLessThan(0.001);
    }
  });
  it('c7 Mistake `bend`: the elbow bends at least 60 deg more, the weight comes in at least 10 cm, and the dumbbell clears the bench end', () => {
    const i = poMod.info(), d = poMod.misDb();
    expect(i.misElbowDeg - i.endElbowDeg).toBeGreaterThanOrEqual(60);
    expect(i.misGripNearerShoulderCm).toBeGreaterThanOrEqual(10);
    expect(d.dbClearOfBenchEndCm).toBeGreaterThan(0);
  });
});

describe('LIB-10 incline_barbell_bench_press (H, D-LIB10-BENCH-H): drawn facts', { timeout: T }, () => {
  const deg = (u: number[], v: number[]) => Math.acos((u[1]! * v[1]! + u[2]! * v[2]! + u[0]! * v[0]!) / (Math.hypot(...u) * Math.hypot(...v))) * 180 / Math.PI;
  const sub = (a: number[], b: number[]) => a.map((x, i) => x - b[i]!);
  it('c1: the measure arc reads the back pad at 30 deg from horizontal, and the drawn report agrees within 2 deg', () => {
    const r = plate.renderPlate(ibp, { id: 'x' }).report;
    expect(ibp.measure.value).toBe('30°');
    expect(Math.abs(r.measure.drawnDeg - 30)).toBeLessThanOrEqual(2);
  });
  it('c5: at the start the arms are straight and the bar is over the shoulder joints (side view, within 1 cm)', () => {
    const s = itemsIn(ibp, 'start').lm;
    expect(Math.abs(s.grips[2] - s['shoulder.r'][2])).toBeLessThan(0.01);
    expect(deg(sub(s['shoulder.r'], s['elbow.r']), sub(s['wrist.r'], s['elbow.r']))).toBeGreaterThan(170);
  });
  it('c7: at the end the bar is on the upper chest (between the shoulder joint and the chest point), the forearm vertical, the upper arm 60 ± 2 deg from the torso', () => {
    const e = itemsIn(ibp, 'end').lm, r = plate.renderPlate(ibp, { id: 'x' }).report;
    expect(e.grips[2]).toBeGreaterThan(e['shoulder.r'][2]);
    expect(e.grips[2]).toBeLessThan(e.chest[2]);
    expect(Math.abs(e['elbow.r'][2] - e['grip.r'][2])).toBeLessThan(0.01);
    const elev = +/elev (-?[\d.]+)/.exec(r.angles.end['sh.r'])![1]!;
    expect(Math.abs(elev - 60)).toBeLessThanOrEqual(2);
    expect(Math.hypot(e.grips[1] - e.chin[1], e.grips[2] - e.chin[2])).toBeGreaterThan(0.15);   // R10: clear of the neck
  });
  it('c6, R10: one upright with its J-hook behind the figure; the safety catch top is under the bar in every pose and runs past the touch', () => {
    const up = itemsIn(ibp, 'start').items.filter(it => it.type === 'rackUpright');
    expect(up.length).toBe(1);
    expect(up[0].hook).toBeGreaterThan(0);
    expect(up[0].z).toBe('back');
    const { lm } = itemsIn(ibp, 'start'), bar = [0, up[0].hook + 0.014, up[0].at[2] + 0.038 + 0.055];
    const arm = 1.75 * (body.WINTER.upperArm + body.WINTER.forearm + body.REF.gripOff);
    expect(Math.hypot(lm['shoulder.r'][1] - bar[1], lm['shoulder.r'][2] - bar[2], lm['shoulder.r'][0] + 0.30)).toBeLessThan(arm - 0.01);   // the racked bar is in reach
    const pin = itemsIn(ibp, 'end').items.filter(it => it.type === 'backPad' && it.t === 0.05 && Math.abs(it.surface[0][1] - it.surface[1][1]) < 1e-9 && it.surface[0][1] > 0.2);
    expect(pin.length).toBe(1);
    const [a, b] = barLine(pin[0]), top = a[1]! + 0.025;
    for (const pose of ['start', 'end', 'mistake']) expect(itemsIn(ibp, pose).lm.grips[1] - 0.014, pose).toBeGreaterThan(top);
    const e = itemsIn(ibp, 'end').lm;
    expect(top).toBeGreaterThan(e.grips[1] - 0.014 - 0.06);
    expect(Math.min(a[2]!, b[2]!)).toBeLessThan(e.grips[2]);
    expect(Math.max(a[2]!, b[2]!)).toBeGreaterThan(e.grips[2] + 0.1);
    expect(itemsIn(ibp, 'end').items.filter(it => it.part === 'safety' && it.type === 'line').length).toBe(2);
    expect(itemsIn(ibp, 'end', { mistake: true }).items.filter(it => it.part === 'safety' && it.type === 'line').length).toBe(0);
  });
  it('c8, c9 Mistake `flare`: the upper arm goes out at least 85 deg from the torso, the elbow at least 10 cm headward, the bar where it was', () => {
    const e = itemsIn(ibp, 'end').lm, m = itemsIn(ibp, 'mistake').lm, r = plate.renderPlate(ibp, { id: 'x', mistake: true }).report;
    expect(+/elev (-?[\d.]+)/.exec(r.angles.mistake['sh.r'])![1]!).toBeGreaterThanOrEqual(85);
    expect(dist(m.grips, e.grips)).toBeLessThan(0.001);
    expect(dist(m['elbow.r'], e['elbow.r'])).toBeGreaterThan(0.10);
    expect(m['elbow.r'][1]).toBeGreaterThan(e['elbow.r'][1]);
    expect(m.buttock).toEqual(e.buttock);   // only the arms move
  });
});

describe('LIB-10 incline_barbell_bench_press panel 2 fix (#265 6396940823: R4 and R5)', { timeout: T }, () => {
  /** World point to plate px (side view facing right, the plate's 146.29 px/m reference scale). */
  const px = (spec: any, w: number[]) => [spec.camera.x0 + w[2]! * 146.29, spec.camera.y0 - w[1]! * 146.29];
  const segDist = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy || 1;
    const t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)); return Math.hypot(p[0]! - a[0]! - t * dx, p[1]! - a[1]! - t * dy); };
  const nums = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  /** R4: the 'Back on pad' dot lies on the pad face, at least 25 px from the end elbow and 6 px from the buttock, and its
   *  leader keeps 6 px from every point of the measure arc's wedge. */
  const padProblems = (spec: any) => {
    const out: string[] = [], c = spec.callouts.find((x: any) => x.key === 'pad'), e = itemsIn(spec, 'end').lm, a = px(spec, c.anchor);
    if (dist(a.concat(0), px(spec, e['elbow.r']).concat(0)) < 25) out.push('dot within 25 px of the elbow');
    if (dist(a.concat(0), px(spec, e.buttock).concat(0)) < 6) out.push('dot on the hip');
    const svg: string = plate.renderPlate(spec, { id: 'x' }).svg;
    const wedge = nums(/<path class="arc measure" d="([^"]+)"/.exec(svg)![1]!);
    const lead = [...svg.matchAll(/<path class="leader" d="([^"]+)"/g)].map(m => nums(m[1]!)).find(p => Math.abs(p[0]![0]! - a[0]!) < 0.05 && Math.abs(p[0]![1]! - a[1]!) < 0.05)!;
    const L = lead.length > 1 ? lead : [lead[0]!, lead[0]!];
    for (let i = 0; i + 1 < L.length; i++) for (const w of wedge) if (segDist(w, L[i]!, L[i + 1]!) < 6) { out.push('leader within 6 px of the arc'); i = L.length; break; }
    return out;
  };
  it('R4: the Back on pad dot is on the trunk\'s back on the pad, clear of the arm, the hip and the measure arc', () => {
    expect(padProblems(ibp)).toEqual([]);
    const c = ibp.callouts.find((x: any) => x.key === 'pad');
    const padN = [0, Math.sin(60 * Math.PI / 180), Math.cos(60 * Math.PI / 180)], seat = itemsIn(ibp, 'end').lm.backUpper;
    expect(Math.abs((c.anchor[1] - seat[1]) * padN[1]! + (c.anchor[2] - seat[2]) * padN[2]!)).toBeLessThan(0.011);   // on the pad face (backUpper lies on it within 1 cm)
  });
  it('R4 mutation: the dot back at the elbow (0.30 up the pad) is red', () => {
    const c = ibp.callouts.find((x: any) => x.key === 'pad'), B = 60 * Math.PI / 180, d = 0.27;
    const moved = { ...ibp, callouts: ibp.callouts.map((x: any) => (x === c ? { ...x, anchor: [0, c.anchor[1] + Math.cos(B) * d, c.anchor[2] - Math.sin(B) * d] } : x)) };
    expect(padProblems(moved)).toContain('dot within 25 px of the elbow');
  });
  /** R5: a dashed joint ring (2.25 px) at the flared elbow; the arrow from the correct elbow to the ring's edge; the level
   *  tell on the shoulder joint and the flare tell on the ring, their dots apart; the red marks paint after the solid figure. */
  const r5Problems = (spec: any) => {
    const out: string[] = [], e = itemsIn(spec, 'end').lm, m = itemsIn(spec, 'mistake').lm, me = px(spec, m['elbow.r']), ee = px(spec, e['elbow.r']);
    const ring = spec.mistake.guides.find((g: any) => g.kind === 'dashed' && g.pts.length >= 12 && g.pts.every((q: number[]) => Math.abs(dist(px(spec, q).concat(0), me.concat(0)) - 2.25) < 0.05));
    if (!ring) out.push('no 2.25 px ring at the flared elbow');
    const arrow = spec.mistake.guides.find((g: any) => g.kind === 'arrow');
    if (!arrow || !Array.isArray(arrow.from) || dist(px(spec, arrow.from).concat(0), ee.concat(0)) > 0.05) out.push('arrow does not start at the correct elbow');
    if (!arrow || !Array.isArray(arrow.to) || Math.abs(dist(px(spec, arrow.to).concat(0), me.concat(0)) - 2.25) > 0.05) out.push('arrow does not end on the ring');
    const t = (k: string) => spec.mistake.tells.find((x: any) => x.key === k);
    if (JSON.stringify(t('level')?.anchor) !== JSON.stringify({ at: 'shoulder.r', pose: 'mistake' })) out.push('level not on the shoulder joint');
    if (JSON.stringify(t('flare')?.anchor) !== JSON.stringify({ at: 'elbow.r', pose: 'mistake' })) out.push('flare not on the ring');
    const svg: string = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    if (!(svg.indexOf('class="mistake-layer"') > svg.lastIndexOf('pose-end'))) out.push('red marks under the solid figure');
    const ends = [...svg.matchAll(/<path class="leader m" d="M(-?[\d.]+) (-?[\d.]+)/g)].map(x => [+x[1]!, +x[2]!]);
    if (ends.length !== 2 || Math.hypot(ends[0]![0]! - ends[1]![0]!, ends[0]![1]! - ends[1]![1]!) < 6) out.push('leader dots not apart');
    return out;
  };
  it('R5: the flared elbow has its joint ring, the arrow runs the full way to it, the two tells end on separate joints', () => {
    expect(r5Problems(ibp)).toEqual([]);
  });
  it('R5 mutations: no ring, the old short arrow, and the level tell back on the upper arm are each red', () => {
    const ringless = { ...ibp, mistake: { ...ibp.mistake, guides: ibp.mistake.guides.filter((g: any) => !(g.kind === 'dashed' && g.pts.length === 13)) } };
    expect(r5Problems(ringless)).toContain('no 2.25 px ring at the flared elbow');
    const short = { ...ibp, mistake: { ...ibp.mistake, guides: ibp.mistake.guides.map((g: any) => (g.kind === 'arrow' ? { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-4, -4] }, to: { at: 'elbow.r', pose: 'mistake', off: [3, 3] } } : g)) } };
    expect(r5Problems(short)).toEqual(expect.arrayContaining(['arrow does not start at the correct elbow', 'arrow does not end on the ring']));
    const m = itemsIn(ibp, 'mistake').lm, mid = [0, (m['shoulder.r'][1] + m['elbow.r'][1]) / 2, (m['shoulder.r'][2] + m['elbow.r'][2]) / 2];
    const level = { ...ibp, mistake: { ...ibp.mistake, tells: ibp.mistake.tells.map((x: any) => (x.key === 'level' ? { ...x, anchor: mid } : x)) } };
    expect(r5Problems(level)).toContain('level not on the shoulder joint');
  });
});

describe('LIB-10 arnold_press (H, D-LIB10-NOTE Q6): drawn facts', { timeout: T }, () => {
  it('c1, c4: at the start the upper arm is within 20 deg of level, the dumbbell in front of the chin and face by at least 15 cm, the forearm vertical', () => {
    const s = itemsIn(ap, 'start').lm, ua = sub3(s['elbow.r'], s['shoulder.r']);
    expect(Math.abs(Math.atan2(ua[1]!, ua[2]!) * 180 / Math.PI)).toBeLessThanOrEqual(20);
    expect(ua[2]).toBeGreaterThan(0);   // the elbow in front of the shoulder
    expect(s['grip.r'][2] - s.chin[2]).toBeGreaterThanOrEqual(0.15);
    expect(Math.abs(s['grip.r'][2] - s['elbow.r'][2])).toBeLessThan(0.01);
  });
  it('c1: at the end the arms are straight and the dumbbell is over the shoulder joint (side view, within 1 cm)', () => {
    const e = itemsIn(ap, 'end').lm, a = sub3(e['shoulder.r'], e['elbow.r']), b = sub3(e['wrist.r'], e['elbow.r']);
    expect(Math.acos((a[1]! * b[1]! + a[2]! * b[2]! + a[0]! * b[0]!) / (Math.hypot(...a) * Math.hypot(...b))) * 180 / Math.PI).toBeGreaterThan(175);
    expect(Math.abs(e['grip.r'][2] - e['shoulder.r'][2])).toBeLessThan(0.01);
  });
  it('c3: the back is on the pad at the start and the end; in the Mistake the upper back stands at least 6 cm (8.8 px) off it, the buttocks stay', () => {
    const r = plate.renderPlate(ap, { id: 'x', mistake: true }).report, ck = (lmk: string, pose: string) => r.checks.find((c: any) => c.landmark === lmk && c.pose === pose && 'cm' in c);
    for (const pose of ['start', 'end']) expect(ck('backUpper', pose).cm, pose).toBeLessThanOrEqual(1);
    for (const pose of ['start', 'end', 'mistake']) expect(ck('buttock', pose).cm, pose).toBeLessThanOrEqual(1);
    expect(apMod.info().misBackUpperGapCm).toBeGreaterThanOrEqual(6);
    const m = r.checks.find((c: any) => c.landmark === 'backUpper' && c.pose === 'mistake' && 'aboveCm' in c);
    expect(m.aboveCm).toBeGreaterThan(0);
  });
  it('c3 Mistake `arch`: the gap dimension is drawn dashed from the pad face to the faulty back, and the faulty back is at least 6 px from the end back', () => {
    const e = itemsIn(ap, 'end').lm, m = itemsIn(ap, 'mistake').lm;
    expect(Math.hypot(m.backUpper[1] - e.backUpper[1], m.backUpper[2] - e.backUpper[2]) * 146.29).toBeGreaterThanOrEqual(6);
    const dims = ap.mistake.guides.filter((g: any) => g.kind === 'dashed' && g.pts.length === 2);
    expect(dims.length).toBe(3);   // the gap line and its two ticks
    expect(dist(dims[0].pts[1], m.backMid)).toBeLessThan(0.001);
  });
});

describe('LIB-10 incline_dumbbell_press (D-LIB10-IDP, D-LIB10-IDP-A): the Mistake redraw in its own file', { timeout: T }, () => {
  const OLD = 'tools/plates/library/specs/incline_dumbbell_press.mjs';
  /** Pilot A's spec is byte-identical to main: its sha256 equals the one MANIFEST.json pins in pilot A's rows. */
  const oldProblems = (bytes: Buffer) => { const pinned = readJson('tools/plates/library/MANIFEST.json').rows.lib_dumbbell_shoulder_press.files[OLD];
    return sha(bytes) === pinned ? [] : [`${OLD} differs from main`]; };
  it("pilot A's specs/incline_dumbbell_press.mjs is byte-identical to main (MANIFEST.json's pinned sha256)", () => {
    expect(oldProblems(readFileSync(OLD))).toEqual([]);
  });
  it('mutation: one byte appended to the old spec is red', () => {
    expect(oldProblems(Buffer.concat([readFileSync(OLD), Buffer.from('\n')]))).toEqual([`${OLD} differs from main`]);
  });
  it('the LB2 page draws incline_dumbbell_press from the __lb2 spec (its row, and the redrawn tell on the built page)', async () => {
    const build = await import(/* @vite-ignore */ lib('lb2/build.mjs'));
    const row = build.lb2All().find((r: any) => r.id === `lib_${IDP}`);
    expect(row.src).toBe('library/specs/incline_dumbbell_press__lb2.mjs');
    expect(build.drawnIds()).toContain(`lib_${IDP}`);
    const html = (await build.buildLb2Page({ ids: [`lib_${IDP}`] })).html.toString('utf8');
    expect(html).toMatch(/id="incline-dumbbell-press-m-arch"[^>]*>Off<br>the pad</);
    expect(html).not.toMatch(/Low back<br>arches/);
  });
  it('the normal plate is unchanged: the __lb2 spec renders the same normal SVG and overlay as pilot A\'s', async () => {
    const old = (await import(/* @vite-ignore */ lib('specs/incline_dumbbell_press.mjs'))).default;
    const a = plate.renderPlate(old, { id: 'x' }), b = plate.renderPlate(idp, { id: 'x' });
    expect(b.svg).toBe(a.svg);
    expect(b.overlay).toBe(a.overlay);
  });
  it('c8 Mistake `arch`: one dashed back curve off the pad, at least 10 cm at its peak, and the gap marker runs from the pad face to that peak', () => {
    const i = idpMod.mistakeInfo();
    expect(i.lowBackGapCm).toBeGreaterThanOrEqual(10);
    expect(i.buttockGapCm).toBeLessThanOrEqual(1);
    const dashed = idp.mistake.guides.filter((g: any) => g.kind === 'dashed');
    const curves = dashed.filter((g: any) => g.pts.length > 2);
    expect(curves.length).toBe(1);   // the one back curve
    const marker = dashed.filter((g: any) => g.pts.length === 2);
    expect(marker.length).toBe(3);   // the gap line and its two ticks
    expect(curves[0].pts.some((p: number[]) => dist(p, marker[0].pts[1]) < 1e-9)).toBe(true);   // the marker ends on the curve
    expect(dist(marker[0].pts[0], marker[0].pts[1]) * 100).toBeGreaterThanOrEqual(10);
  });
  it('the engine outlines only the legs in the Mistake (the trunk\'s arch is the one back curve); seat, upper back and buttocks stay on the pads', () => {
    expect(idp.mistake.parts).toEqual(['leg.r', 'leg.l']);
    const r = plate.renderPlate(idp, { id: 'x', mistake: true }).report;
    for (const lmk of ['seat', 'backUpper', 'buttock']) expect(r.checks.find((c: any) => c.landmark === lmk && c.pose === 'mistake').cm, lmk).toBeLessThanOrEqual(1);
  });
  it("its card is pilot A's verified copy byte for byte; without the three keys it is the research copy at 0d832e18; the quotes are a byte copy", () => {
    const cs = readJson('tools/plates/library/lb2/cards.sha.json'), KEYS3 = ['plateFacts', 'tempo', 'topFault'];
    const raw = readFileSync(`docs/research/howto/cards/${IDP}.json`), card = JSON.parse(raw.toString('utf8')), o = { ...card };
    for (const k of KEYS3) delete o[k];
    expect(cs.researchHeads[IDP]).toBe('0d832e18a2c52ec091a37b654572db5f0468913b');
    expect(sha(`${JSON.stringify(o, null, 2)}\n`)).toBe(cs.cards[IDP]);
    expect(sha(raw)).toBe(cs.pilotACards[IDP]);
    expect(sha(readFileSync(`docs/research/howto/quotes/${IDP}.json`))).toBe(cs.quotes[IDP]);
    expect(Object.keys(card).slice(-3)).toEqual(KEYS3);
    expect(idp.mistake.tells[0].key).toBe(card.topFault);
  });
  it('its How-to source names only its id and card (D-LIB9a-HOWTOID)', async () => {
    const h = (await import(/* @vite-ignore */ lib(`howto/lib_${IDP}.howto.mjs`))).default;
    expect(h).toEqual({ id: `lib_${IDP}`, research: { card: `docs/research/howto/cards/${IDP}.json` } });
  });
  it('A6: PQ-H6 is green on the redrawn plate against its card', () => {
    const c = readJson(`docs/research/howto/cards/${IDP}.json`);
    const R = { normal: plate.renderPlate(idp, { id: 'x' }), mistake: plate.renderPlate(idp, { id: 'x', mistake: true }) };
    expect(qaNode.h6({ spec: idp, research: { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault } }, { engine: Eng(), pins }, R).map((p: any) => p.key)).toEqual([]);
  });
});

describe('LIB-10 D-LIB9-CLONE b: each copied root finder throws on a bracket with no root', () => {
  it('decline_bench_press and skull_crusher', () => {
    for (const m of [dbpMod, scMod, cgMod, bbMod, poMod, ibpMod, apMod, idpMod]) {
      expect(() => m.bisect((x: number) => x - 5, 0, 1)).toThrow(/no solution/);
      expect(m.bisect((x: number) => x - 0.25, 0, 1)).toBeCloseTo(0.25, 9);
    }
  });
});

describe('LIB-10 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const drawn = () => Object.values<any>(readJson(ROWS).rows).filter(r => existsSync(`tools/plates/${r.src}`)).map(r => `tools/plates/${r.src}`);
  /** Rule A3: the vendor MANIFEST in, nothing under layers/, no specs/ file but its own, no template but its own. */
  const problems = (f: string, c: string[], template: string | null = null) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
    ...c.filter(p => p.startsWith('tools/plates/library/templates/') && p !== template),
  ];
  it('every drawn LB2 spec passes', () => {
    expect(drawn().length).toBeGreaterThanOrEqual(2);
    for (const f of drawn()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb2-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/decline_bench_press.mjs';
  it('mutation: readFileSync added to a composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/declineBench.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing a pilot A spec (another specs/ file) is red', () => {
    const root = scratch(r => {
      writeFileSync(join(r, 'tools/plates/library/specs/dumbbell_bench_press.mjs'), "export const supine = () => null;\nexport default {};\n");
      const p = join(r, F); writeFileSync(p, `import { supine as _s } from './dumbbell_bench_press.mjs';\n${readFileSync(p, 'utf8')}`);
    });
    try { expect(problems(F, closure.closureOf([F], root))).toEqual(['tools/plates/library/specs/dumbbell_bench_press.mjs']); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-10 A5: lb2/rows.json holds exactly the 7 LB2 ids drawn here and incline_dumbbell_press (D-LIB10-IDP)', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of IDS) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!IDS.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  it('each of the 8 exactly once in the raw text, nothing else; the 3 other reused ids and dumbbell_fly in no LB2 file', () => {
    expect(a5(readFileSync(ROWS, 'utf8'))).toEqual([]);
    for (const f of readdirSync('tools/plates/library/lb2')) {
      const text = readFileSync(join('tools/plates/library/lb2', f), 'utf8');
      for (const id of [...REUSED, HELD]) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id} as a row`).toBe(false);
    }
    expect(new RegExp(`\\b(lib_)?${HELD}\\b`).test(readFileSync(ROWS, 'utf8'))).toBe(false);
  });
  it('mutations: a dropped row, a duplicated row and a reused id added are red', () => {
    const text = readFileSync(ROWS, 'utf8'), j = readJson(ROWS);
    const drop = { ...j, rows: { ...j.rows } }; delete drop.rows.lib_skull_crusher;
    expect(a5(JSON.stringify(drop, null, 1))).toEqual(['lib_skull_crusher x0']);
    const dup = text.replace('  "lib_skull_crusher": {', `  "lib_skull_crusher": ${JSON.stringify(j.rows.lib_skull_crusher)},\n  "lib_skull_crusher": {`);
    expect(a5(dup)).toEqual(['lib_skull_crusher x2']);
    const reused = { ...j, rows: { ...j.rows, lib_dumbbell_bench_press: { ...j.rows.lib_skull_crusher } } };
    expect(a5(JSON.stringify(reused, null, 1))).toEqual(['extra lib_dumbbell_bench_press']);
  });
  it('every row points at its own spec file and carries the census view; batch LB2, censusRef 4a9fd86; all 8 H (D-LIB10-BENCH-H, D-LIB10-IDP)', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}${id === `lib_${IDP}` ? '__lb2' : ''}.mjs`);   // D-LIB10-IDP-A: its own file
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB2', censusRef: '4a9fd86' });
    expect((existsSync('tools/plates/library/templates') ? readdirSync('tools/plates/library/templates') : []).filter(f => !['CURL.mjs', 'PUSHDOWN.mjs'].includes(f))).toEqual([]);   // BENCH is not built in LB2; D-LIB15R2-TEMPLDIR (#349): only the ruled templates exist
  });
});

describe('LIB-10 A9: nothing ships (D-LIB10-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  it('every LB2 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_skull_crusher: { ...rows.lib_skull_crusher, stage: 'shipped' } })).toEqual(['lib_skull_crusher: shipped']);
    expect(stageProblems({ ...rows, lib_skull_crusher: { ...rows.lib_skull_crusher, stage: 'approved-plate' } })).toEqual(['lib_skull_crusher: approved-plate']);
  });
  it('no LB2 id is shipped, even with lb2/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(8);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  /** An id or its slug as a whole token in a file's name or text. */
  const tokenHits = (ids: string[], name: string, text: string) => ids.flatMap(id => {
    const slug = id.replace(/_/g, '-'), s = `${name}\n${text}`, out: string[] = [];
    if (new RegExp(`\\b(lib_)?${id}\\b`).test(s)) out.push(`${name}: ${id}`);
    if (new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(s)) out.push(`${name}: ${slug}`);
    return out;
  });
  // Before pilot A is on main, the 4 reused ids and dumbbell_fly are in no batches/ or golden file either.
  const pilotAOnMain = () => readdirSync('tools/plates/library/batches').some(n => /pilot/i.test(n));
  const watched = () => [...LB2, IDP, ...(pilotAOnMain() ? [] : [...REUSED, HELD])];
  const batchProblems = (files: [string, string][]) => files.flatMap(([f, text]) => tokenHits(watched(), f, text));
  it('no LB2 id is in any tools/plates/library/batches/ file', () => {
    const dir = 'tools/plates/library/batches';
    expect(batchProblems(readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/ is red; a file naming only lib_smith_machine_bench_press (LB6) stays green', () => {
    expect(batchProblems([['lb2.json', readFileSync(ROWS, 'utf8')]]).length).toBeGreaterThanOrEqual(7);
    expect(batchProblems([['zz.json', '{"rows":{"lib_smith_machine_bench_press":{}}}']])).toEqual([]);
  });
  const goldenProblems = (files: [string, string][]) => files.flatMap(([name, text]) => [
    ...(/lb2/i.test(name) ? [`${name}: an LB2 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB2"/.test(text) ? [`${name}: names batch LB2`] : []),
    ...tokenHits(watched(), name, text),
  ]);
  it('no LB2 id, slug or batch is in tests/howto/golden/library/', () => {
    const dir = 'tests/howto/golden/library';
    const files: [string, string][] = existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : [];
    expect(goldenProblems(files)).toEqual([]);
  });
  it('mutations: a golden file naming an LB2 id, a page-only lb2.json and skull-crusher.layers.html are red; lib_smith_machine_bench_press stays green', () => {
    expect(goldenProblems([['x.json', '{"id":"lib_decline_bench_press"}']])).toEqual(['x.json: decline_bench_press']);
    expect(goldenProblems([['lb2.json', '{"entries":[{"kind":"page","batch":"LB2"}]}']]).length).toBe(2);
    expect(goldenProblems([['skull-crusher.layers.html', '<div data-id="skull-crusher"></div>']])).toEqual(['skull-crusher.layers.html: skull-crusher']);
    expect(goldenProblems([['lb6x.json', '{"id":"lib_smith_machine_bench_press"}']])).toEqual([]);
  });
  it('lib_incline_barbell_bench_press names incline_barbell_bench_press, never barbell_bench_press (the one real id holding an LB2 id)', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    const holders = ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))));
    expect(holders).toEqual(['lib_incline_barbell_bench_press']);
    expect(tokenHits(['barbell_bench_press'], 'x', '"lib_incline_barbell_bench_press" incline-barbell-bench-press')).toEqual([]);
    expect(tokenHits(['incline_barbell_bench_press'], 'x', '"lib_incline_barbell_bench_press"')).toEqual(['x: incline_barbell_bench_press']);
  });
  child.it('generate --check is green, and no generated file is read from lb2/, the LB2 specs, composers or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    for (const [p, { text }] of out) {
      expect(text, p).not.toMatch(/library\/lb2\/|declineBench/);
      for (const id of LB2) expect(text, p).not.toMatch(new RegExp(`library/(specs|howto)/(lib_)?${id}\\b`));
    }
  });
});

describe('LIB-10 A10: the LB2 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the drawn LB2 ids are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb2/build.mjs'));
    expect(build.drawnIds().length).toBeGreaterThanOrEqual(5);
    const a = await build.buildLb2Page(), b = await build.buildLb2Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});

describe('LIB-10 A11 and A6 (Do 6): the card fields, the ruled tempo map and the plate facts', { timeout: T }, () => {
  // The ruled table (D-LIB10-NOTE section 9 and Q5, #265 comment 6255216039): phase names, order and source per id, and
  // the one ruled constant (decline's bottom Pause, c8 "Pause for a count of one."). Copied from the ruling, never read
  // from tempo.json or a spec.
  const RULED: Record<string, [string, string][]> = {
    barbell_bench_press: [['Lower', 'down'], ['Press', 'up'], ['Hold', 'pause']], incline_barbell_bench_press: [['Lower', 'down'], ['Press', 'up']],
    close_grip_bench_press: [['Lower', 'down'], ['Press', 'up']], decline_bench_press: [['Lower', 'down'], ['Pause', 'const'], ['Press', 'up']],
    arnold_press: [['Press', 'up'], ['Lower', 'down']], skull_crusher: [['Lower', 'down'], ['Extend', 'up']], dumbbell_pullover: [['Lower', 'down'], ['Pull', 'up']],
  };
  const CONST = { 'decline_bench_press.Pause': { s: 1, claim: 'c8', quote: 'Pause for a count of one.' } };
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const built = (rows: any[], pt: any, consts: any) => rows.flatMap((r: any) => (r.constant ? [{ phase: r.phase, s: consts[r.constant].s }]
    : r.from === 'pause' ? (pt.pause > 0 ? [{ phase: r.phase, s: pt.pause }] : []) : [{ phase: r.phase, s: pt[r.from], move: true }]));
  const tempoProblems = (tj: any, cards: Record<string, any>, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (JSON.stringify(Object.keys(tj.constants)) !== JSON.stringify(Object.keys(CONST))) bad.push('constants: not the ruled set');
    for (const [k, v] of Object.entries<any>(CONST)) if (tj.constants[k]?.s !== v.s || tj.constants[k]?.claim !== v.claim || tj.constants[k]?.quote !== v.quote) bad.push(`constant ${k}`);
    if (JSON.stringify(Object.keys(tj.ids).sort()) !== JSON.stringify(LB2.slice().sort())) bad.push('ids: not the 7');
    for (const id of LB2) {
      const t = tj.ids[id], c = cards[id], pt = c.plate.tempo;
      if (JSON.stringify(t?.rows?.map((r: any) => [r.phase, r.constant ? 'const' : r.from])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (JSON.stringify(t?.claim) !== JSON.stringify(pt.claim)) bad.push(`${id}: claim`);
      const hold = c.tempo.some((p: any) => p.phase === 'Hold');
      if (hold !== pt.pause > 0) bad.push(`${id}: Hold present ${hold} but pause ${pt.pause}`);
      if (c.tempo.some((p: any) => p.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (JSON.stringify(c.tempo) !== JSON.stringify(built(t?.rows ?? [], pt, CONST))) bad.push(`${id}: card tempo != the array built from the ruled table and plate.tempo`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(c.tempo)) bad.push(`${id}: spec tempo != card tempo`);
    }
    return bad;
  };
  const clean = () => ({ tj: readJson('tools/plates/library/lb2/tempo.json'), cards: Object.fromEntries(LB2.map(id => [id, cardOf(id)])),
    specs: { decline_bench_press: dbp, skull_crusher: sc, close_grip_bench_press: cg, barbell_bench_press: bb, dumbbell_pullover: po } as Record<string, any> });
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  it('tempo.json, every card tempo and every drawn spec tempo follow the ruled map', () => {
    const { tj, cards, specs } = clean();
    expect(tempoProblems(tj, cards, specs)).toEqual([]);
  });
  it('mutations (i)-(vi) and a changed second are each red', () => {
    const red = (f: (s: any) => void) => { const s = copy({ tj: clean().tj, cards: clean().cards }); s.specs = { ...clean().specs }; f(s); return tempoProblems(s.tj, s.cards, s.specs).length > 0; };
    const setAll = (s: any, id: string, rows: any[] | null, tempo: any[]) => { if (rows) s.tj.ids[id].rows = rows; s.cards[id].tempo = tempo; if (s.specs[id]) s.specs[id] = { ...s.specs[id], tempo }; };
    expect(red(s => { setAll(s, 'skull_crusher', null, [...s.cards.skull_crusher.tempo, { phase: 'Rest', s: 1 }]); }), '(i) Rest added').toBe(true);
    expect(red(s => { s.tj.constants['skull_crusher.Rest'] = { s: 1, claim: 'c13', quote: 'x' }; }), '(ii) a constant').toBe(true);
    expect(red(s => { setAll(s, 'barbell_bench_press', null, s.cards.barbell_bench_press.tempo.map((p: any) => (p.phase === 'Hold' ? { ...p, s: 2 } : p))); }), '(iii) Hold s').toBe(true);
    expect(red(s => { const rows = [{ phase: 'Lower', from: 'down' }, { phase: 'Extend', from: 'up' }, { phase: 'Hold', from: 'pause' }];
      setAll(s, 'skull_crusher', rows, [...s.cards.skull_crusher.tempo, { phase: 'Hold', s: 0 }]); }), '(iv) Hold 0').toBe(true);
    expect(red(s => { const rows = s.tj.ids.barbell_bench_press.rows.filter((r: any) => r.from !== 'pause'); setAll(s, 'barbell_bench_press', rows, built(rows, s.cards.barbell_bench_press.plate.tempo, CONST)); }), '(v) Hold removed').toBe(true);
    expect(red(s => { const rows = s.tj.ids.decline_bench_press.rows.filter((r: any) => !r.constant); delete s.tj.constants['decline_bench_press.Pause'];
      setAll(s, 'decline_bench_press', rows, built(rows, s.cards.decline_bench_press.plate.tempo, CONST)); }), '(v) constant Pause removed').toBe(true);
    expect(red(s => { const rows = s.tj.ids.skull_crusher.rows.map((r: any) => ({ ...r, from: r.from === 'up' ? 'down' : r.from === 'down' ? 'up' : r.from })); setAll(s, 'skull_crusher', rows, built(rows, s.cards.skull_crusher.plate.tempo, CONST)); }), '(vi) up/down swapped').toBe(true);
    expect(red(s => { s.cards.close_grip_bench_press.tempo[0].s = 3; }), 'one tempo second').toBe(true);
  });
  const cardsSha = readJson('tools/plates/library/lb2/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it('each card differs from its research-head copy (7d7c52e1) only in the three keys; each quotes file is a byte copy', () => {
    expect(cardsSha.researchHead).toBe('7d7c52e1a69debb0735dc6bb4a3d73ea46740ed5');
    for (const id of LB2) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
      expect(Object.keys(cardOf(id)).slice(-3), id).toEqual(KEYS);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('skull_crusher'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.skull_crusher);
  });
  // The ruled fault->key map (D-LIB10-NOTE section 10 at 2b6747f8; unchanged at 7d7c52e1). All 7 cards are drawable:true.
  const DRAWN: Record<string, string> = { barbell_bench_press: 'path', incline_barbell_bench_press: 'flare', close_grip_bench_press: 'flare', decline_bench_press: 'high',
    arnold_press: 'arch', skull_crusher: 'drift', dumbbell_pullover: 'bend' };
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable
    ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault'])
    : (card.topFault !== drawnKey ? [] : ['drawable:false but topFault equals the drawn fault']));
  it('Q1: every card is drawable:true and its topFault is the ruled key; every drawn first tell carries it', () => {
    for (const id of LB2) { const c = cardOf(id); expect(c.plate.mistake.drawable, id).toBe(true); expect(topFaultProblems(c, DRAWN[id]!), id).toEqual([]); }
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) expect(spec.mistake.tells[0].key, spec.id).toBe(cardOf(spec.id).topFault);
  });
  it('Q1 mutation: drawable:false with topFault equal to the drawn key is red', () => {
    const c = cardOf('skull_crusher'); c.plate.mistake.drawable = false;
    expect(topFaultProblems(c, 'drift')).toEqual(['drawable:false but topFault equals the drawn fault']);
  });
  /** 14.7 rules 10, 15 and D-LIB9-CARDFIELDS: kind on every fact, one form per fact, a claim of the card's own. */
  const factProblems = (c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
  ]);
  it('every plate fact has a kind, one form and a claim of its own card; the How-to of each LB2 id names its card', async () => {
    for (const id of LB2) {
      expect(factProblems(cardOf(id)), id).toEqual([]);
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
  it('mutation: a fact with both joint and measure: true is red', () => {
    const c = cardOf('incline_barbell_bench_press'); c.plateFacts.push({ kind: 'angle', joint: 'knee.r', measure: true, deg: 30, claim: 'c1' });
    expect(factProblems(c)).toEqual([`${c.plateFacts.length - 1}: both joint and measure`]);
  });
  // A6 on the node path the QA uses: PQ-H6 against each drawn plate's engine report, its card's facts and tempo.
  const h6 = (spec: any, research: any) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research }, { engine: Eng(), pins }, R).map((p: any) => p.key);
  };
  const research = (id: string) => { const c = cardOf(id); return { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault }; };
  it('A6: PQ-H6 is green on all 8 drawn plates against their cards', () => {
    for (const spec of [dbp, sc, cg, bb, po, ibp, ap, idp]) expect(h6(spec, research(spec.id)), spec.id).toEqual([]);
  });
  it('A6 mutations: a contact fact on a landmark the plate does not check, an angle +3°, and the card path removed are red', () => {
    const r = research('close_grip_bench_press');
    expect(h6(cg, { ...r, plateFacts: [...r.plateFacts, { kind: 'contact', landmark: 'chest', claim: 'c2' }] }).some((k: string) => k.startsWith('H6.fact:'))).toBe(true);
    const drawn = plate.renderPlate(cg, { id: 'x' }).report.angles.end['knee.r'];
    expect(h6(cg, { ...r, plateFacts: [{ kind: 'angle', joint: 'knee.r', pose: 'end', deg: drawn, claim: 'c3' }] })).toEqual([]);
    expect(h6(cg, { ...r, plateFacts: [{ kind: 'angle', joint: 'knee.r', pose: 'end', deg: drawn + 3, claim: 'c3' }] }).some((k: string) => k.startsWith('H6.fact:'))).toBe(true);
    expect(h6(cg, null)).toEqual(['H6:no-card']);
  });
  it('fields fix (verify @ 2bd89d0): the BB c2 75° tuck is matched on the joint path and red at 72°; incline holds c7 at 60°; pullover cites no c8', () => {
    const r = research('barbell_bench_press'), f = r.plateFacts.find((x: any) => x.claim === 'c2');
    expect(f).toEqual({ kind: 'angle', joint: 'sh.r.elev', pose: 'end', deg: 75, claim: 'c2' });
    expect(h6(bb, { ...r, plateFacts: r.plateFacts.map((x: any) => (x === f ? { ...x, deg: 72 } : x)) })).toEqual(['H6.fact:2:angle:sh.r.elev']);
    expect(cardOf('incline_barbell_bench_press').plateFacts.find((x: any) => x.claim === 'c7')).toMatchObject({ kind: 'angle', joint: 'sh.r.elev', pose: 'end', deg: 60 });
    expect(cardOf('dumbbell_pullover').plateFacts.some((x: any) => x.claim === 'c8')).toBe(false);
  });
});

describe('LIB-10 A4: runQa node half on an LB2 plate (lib_close_grip_bench_press), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_close_grip_bench_press';
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb2/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb2All();
    html = (await build.buildLb2Page({ all, ids: [ID] })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const M = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb2-mut-')), file = join(dir, 'close_grip_bench_press.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/close_grip_bench_press.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb2', title: 'LB2', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: no node-half problem, and the only raised flags wait on the browser half (F2, F5)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
    expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5'].includes(f))).toEqual([]);
  });
  it('A4 M1 a label 1 px onto the figure (the ribs callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg.callouts.find((x: any) => x.key === 'ribs'), at = (box: any) => ({ ...cg, callouts: cg.callouts.map((x: any) => (x.key === 'ribs' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[0, -1], [1, 0], [-1, 0], [0, 1]]) {
      for (let d = 1; d <= 80 && !hit; d++) {
        const box = { left: c0.box.left + dx! * d, top: c0.box.top + dy! * d }, is = plate.renderPlate(at(box), { id: 'm' }).report.issues;
        if (is.some((i: string) => !i.startsWith(`figure:${c0.text}`))) break;
        if (is.length) hit = { box, clean: { left: box.left - dx!, top: box.top - dy! } };
      }
      if (hit) break;
    }
    expect(hit).toBeTruthy();
    expect(plate.renderPlate(at(hit.clean), { id: 'm' }).report.issues).toEqual([]);
    const c = { ...(await candOf()), spec: at(hit.box) };
    expect(node(await qa(c)).some((k: string) => k.startsWith('H1.engine:normal:figure:'))).toBe(true);
  });
  it('A4 M2 a contact 1 cm off (the bench-pad plane under the buttock moved 1.1 cm along its normal) turns PQ-H1 red', async () => {
    const shift = (s: any) => ({ ...s, checks: s.checks.map((k: any) => {
      if (k.landmark !== 'buttock' || !k.plane) return k;
      const n = k.plane.normal, L = Math.hypot(...n);
      return { ...k, plane: { ...k.plane, point: k.plane.point.map((v: number, i: number) => v + n[i] / L * 0.011) } };
    }) });
    const c = { ...(await candOf()), spec: shift(cg) };
    expect(node(await qa(c)).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A4 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = M('M3').prepare(E, cg, pins.envelope);
    const c = await mutated('(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, mistake: { ...s.mistake, pose: {}, parts: undefined } })');
    expect(node(await qa(c))).toContain('H3.mistake-outline');
  });
  it('A4 M5 the start equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] } })');
    expect(node(await qa(c))).toContain('H3.start-is-end');
  });
  it('A4 M6 an unapproved type (rackUpright) as a moving line part turns PQ-H9 red', async () => {
    const extra = (lm: any, ctx: any) => ({ type: 'rackUpright', at: [0.5, 0, ctx.pose === 'mistake' ? -1.3 : -1.22], h: 0.5 });
    const c = { ...(await candOf()), spec: { ...cg, equipment: [...cg.equipment, extra] } };
    expect(node(await qa(c)).some((k: string) => k.startsWith(`H9.moving-line:eq${cg.equipment.length}.rackUpright.`))).toBe(true);
  });
  it('A4 M7 an unknown equipment type turns PQ-H9 red', async () => {
    const c = { ...(await candOf()), spec: { ...cg, equipment: [...cg.equipment, { type: 'rope3d', at: [0, 0, 0] }] } };
    expect(node(await qa(c)).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('A4 a colour literal turns PQ-H2 red (H2.colour)', async () => {
    const m = muts.CANDIDATE_MUTATIONS.find((x: any) => x.id.startsWith('M9 '));
    expect(node(await qa(m.apply(await candOf()))).some((k: string) => k.startsWith('H2.colour:'))).toBe(true);
  });
});
