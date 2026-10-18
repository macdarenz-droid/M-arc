// LIB-10 (lib-10-card Do 2 a, Do 4; acceptance A2, A3, A5, A9; rulings lib4-cards section 15): the LB2 build-ahead
// plates. Node only: the browser half of the plate QA runs in tools/plates/library/lb2/qa.mjs once LIB-3c is on main.
// Every test reads what is drawn (the items a spec emits, the engine's landmarks and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB2 = ['barbell_bench_press', 'incline_barbell_bench_press', 'close_grip_bench_press', 'decline_bench_press', 'arnold_press',
  'skull_crusher', 'dumbbell_pullover'];
const IDS = LB2.map(i => `lib_${i}`);
const REUSED = ['dumbbell_bench_press', 'dumbbell_shoulder_press', 'incline_dumbbell_press', 'barbell_overhead_press'];
const HELD = 'dumbbell_fly';
const ROWS = 'tools/plates/library/lb2/rows.json';
const COMPOSERS = ['declineBench'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);

let eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, reg: any, pins: any;
let dbp: any, dbpMod: any, sc: any, scMod: any;
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
    for (const spec of [dbp, sc]) for (const pose of posesOf(spec))
      for (const it of itemsIn(spec, pose).items) expect(Object.keys(eng.PRIMITIVES), `${spec.id} ${pose}`).toContain(it.type);
  });
  it('the slice plates pass PQ-H9', () => {
    expect(h9(dbp)).toEqual([]);
    expect(h9(sc)).toEqual([]);
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    expect(h9({ ...dbp, equipment: [...dbp.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws both slice plates with no engine issue and every check within its tolerance', () => {
    for (const spec of [dbp, sc]) {
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
  const KEYS: Record<string, string> = { decline_bench_press: 'high', skull_crusher: 'drift' };
  /** The ruled first-tell key check (13 Q1(a)): tells[0].key is the card's ruled key. */
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each slice plate draws its Mistake, and its first tell carries the ruled key', () => {
    for (const spec of [dbp, sc]) expect(keyProblems(spec)).toEqual([]);
  });
  it('mutation: the first tell key swapped is red', () => {
    expect(keyProblems({ ...dbp, mistake: { ...dbp.mistake, tells: [...dbp.mistake.tells].reverse() } })).toEqual(['decline_bench_press: first tell neck']);
  });
  it('2-3 tells on decline_bench_press; skull_crusher has the one tell its single-sign fault allows (ruled per id, Q-D5-4)', () => {
    expect(dbp.mistake.tells.length).toBeGreaterThanOrEqual(2);
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
    for (const spec of [dbp, sc]) for (const g of spec.mistake.guides) expect(['dashed', 'arrow'], spec.id).toContain(g.kind);
  });
  it('the tempo strips are the ruled arrays (D-LIB10-NOTE sections 6 and 9)', () => {
    expect(dbp.tempo).toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Pause', s: 1 }, { phase: 'Press', s: 1, move: true }]);
    expect(sc.tempo).toEqual([{ phase: 'Lower', s: 3, move: true }, { phase: 'Extend', s: 1, move: true }]);
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
    for (const spec of [dbp, sc]) for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg;
      const avoid = [...svg.matchAll(/<path class="(?:trace|eq-cable|eq-solid)[^"]*"[^>]*? d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      expect(avoid.length, spec.id).toBeGreaterThan(0);
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

describe('LIB-10 D-LIB9-CLONE b: each copied root finder throws on a bracket with no root', () => {
  it('decline_bench_press and skull_crusher', () => {
    for (const m of [dbpMod, scMod]) {
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

describe('LIB-10 A5: lb2/rows.json holds exactly the 7 LB2 ids drawn here', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of IDS) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!IDS.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  it('each of the 7 exactly once in the raw text, nothing else; the 4 reused ids and dumbbell_fly in no LB2 file', () => {
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
  it('every row points at its own spec file and carries the census view; batch LB2, censusRef 4a9fd86; T rows name BENCH and a plate parent', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
      if (r.mode === 'T') expect([r.template, r.parent], id).toEqual(['BENCH', 'lib_dumbbell_bench_press']);
    }
    expect(j).toMatchObject({ batch: 'LB2', censusRef: '4a9fd86' });
    expect(j.rows.lib_decline_bench_press.mode).toBe('H');   // D-LIB10-DECLINE
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
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(7);
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
  const watched = () => [...LB2, ...(pilotAOnMain() ? [] : [...REUSED, HELD])];
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
  it('generate --check is green, and no generated file is read from lb2/, the LB2 specs, composers or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    for (const [p, { text }] of out) {
      expect(text, p).not.toMatch(/library\/lb2\/|declineBench/);
      for (const id of LB2) expect(text, p).not.toMatch(new RegExp(`library/(specs|howto)/(lib_)?${id}\\b`));
    }
  });
});
