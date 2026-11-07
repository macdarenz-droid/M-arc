// LIB-PLATEFIX-3b item B (pfc-findings b5065795 set b T02 L1, critics c1-c3; ruled D-PF3B-SLEDSQUAT, #408): sled_pull's
// "Quarter squat" checkpoint. The quarter squat is set on the START pose; the callout stays on the end's stepped-back
// knee.r (D-PF3B-SLEDLEADER, ruling (b)), whose thigh must lean at least 23 deg forward (base 3.5 deg). The start: knee 40-45 deg, the thigh at least 30 deg forward of vertical (toward the sled), the trunk within 10 deg of
// vertical, shoulders over hips. The rope may hold the lean back only as the named exception (sled_pull, start), under
// all three of: the start rope taut, the trunk within 10 deg, the centre of mass at most 10 cm behind the heels.
// Every value is read from the engine's own landmarks with the render's camera, never from a spec constant.
// Base (claude/lib-platefix-3b @ e8615508) fails: start thigh 16.6 deg, end rear thigh 3.5 deg, no balanceProblems
// export.
// Mutation (recorded in the PR): restoring the base hip setting (the hips balanced over the soles' midpoint, START_Z
// -0.014) puts the start thigh at 16.6 deg: the thigh block is red.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, M: any, S: any, KS: any, qaNode: any, qaIdx: any;
beforeAll(async () => {
  [plate, body, eq, qaEng, M, KS, qaNode, qaIdx] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs',
    'specs/sled_pull.mjs', 'specs/kettlebell_swing.mjs', 'qa/node.mjs', 'qa/index.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const view = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3b' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
  return { r, L, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
};
const deg = (dx: number, dy: number) => Math.atan2(dx, dy) * 180 / Math.PI;
/** Thigh angle from vertical in screen px, + = the knee toward the sled (screen right; the figure faces right). */
const thighOf = (P: any, pose: string, s: string) => { const h = P(pose, `hip.${s}`), k = P(pose, `knee.${s}`); return deg(k[0] - h[0], k[1] - h[1]); };
const trunkOf = (P: any, pose: string) => { const s = P(pose, 'shoulder.r'), h = P(pose, 'hip.r'); return Math.abs(deg(s[0] - h[0], h[1] - s[1])); };
/** The drawn start rope run (hitch to the upper fist): its outline's greatest distance from its chord, in m. */
const ropeSag = (spec: any, pose = 'start') => {
  const L = qaEng.poseLandmarks(Eng(), spec), ctx = { pose, mistake: false, start: L.lm.start, body: L.body };
  const run = spec.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(L.lm[pose], ctx) ?? [] : e)).filter((i: any) => i && i.part === 'rope')[0].pts as number[][];
  // a closed outline: one side, (a cap,) the other side reversed; point i pairs with point length-1-i (eq/rope.mjs
  // strandOutline: k + 3-point cap + k, the cap's ends pairing to its tip; LIB-PLATEFIX-3b D-PF3B-ROPE: the run is a
  // 4-point band, its ends pairing to the centre line's ends; was (run.length - 3) / 2, which reads no point of a band)
  const n = Math.floor(run.length / 2), c = run.slice(0, n).map((p, i) => p.map((v, j) => (v + run[run.length - 1 - i]![j]!) / 2));
  if (n < 2) throw new Error(`ropeSag: the run outline has ${run.length} points`);
  const a = c[0]!, b = c[n - 1]!, u = [b[1]! - a[1]!, b[2]! - a[2]!], Lu = Math.hypot(u[0]!, u[1]!);
  return Math.max(...c.map(p => Math.abs((p[1]! - a[1]!) * u[1]! - (p[2]! - a[2]!) * u[0]!) / Lu));
};

describe('LIB-PLATEFIX-3b B sled_pull: the quarter squat on the start pose (D-PF3B-SLEDSQUAT)', () => {
  it('start: knees 40-45 deg; both thighs >= 30 deg forward of vertical; trunk <= 10 deg and shoulders over hips (<= 1 px)', () => {
    const { L, P } = view(S);
    for (const s of ['l', 'r']) {
      const k = L.q.start.knee[s], t = thighOf(P, 'start', s);
      console.log(`PF3b sled_pull start ${s}: knee ${k.toFixed(1)} deg, thigh ${t.toFixed(1)} deg`);
      expect(k >= 40 && k <= 45, `start knee.${s} ${k}`).toBe(true);
      expect(t, `start thigh.${s}`).toBeGreaterThanOrEqual(30);
    }
    expect(trunkOf(P, 'start')).toBeLessThanOrEqual(10);
    expect(Math.abs(P('start', 'shoulder.r')[0]! - P('start', 'hip.r')[0]!)).toBeLessThanOrEqual(1);
  });
  it('D-PF3B-SLEDLEADER: "Quarter squat" anchors on the end\'s stepped-back knee.r, whose thigh leans >= 23 deg forward of vertical (base 3.5)', () => {
    const { P } = view(S), t = thighOf(P, 'end', 'r');
    console.log(`PF3b sled_pull end r thigh ${t.toFixed(1)} deg`);
    expect(S.callouts.find((c: any) => c.key === 'squat').anchor).toBe('knee.r');
    expect(t).toBeGreaterThanOrEqual(23);
  });
  it('the end keeps its step-back and drag: the hips move back DRAG -12.4 cm (+-0.5 cm) start to end, at one height; shoulders over hips', () => {
    const { L, P } = view(S);
    expect(Math.abs(L.lm.end.hips[2] - L.lm.start.hips[2] + 0.124)).toBeLessThanOrEqual(0.005);
    expect(Math.abs(L.lm.end.hips[1] - L.lm.start.hips[1])).toBeLessThanOrEqual(1e-6);
    expect(Math.abs(P('end', 'shoulder.r')[0]! - P('end', 'hip.r')[0]!)).toBeLessThanOrEqual(1);
  });
  it('the spec checks (contacts, flat feet, shoulders over hips) pass in every pose and the Mistake', () => {
    for (const mistake of [false, true]) {
      const rep = plate.renderPlate(S, { id: 'x', mistake }).report;
      expect(rep.checks.length).toBe(21);   // S.checks with 'all' read per pose
      for (const k of rep.checks) {
        const tol = Math.min(...S.checks.filter((c: any) => c.landmark === k.landmark && (c.pose === k.pose || c.pose === 'all')).map((c: any) => c.tol));
        expect(k.cm, `${mistake} ${k.landmark} ${k.pose}`).toBeLessThanOrEqual(tol);
      }
    }
  });
});

describe('LIB-PLATEFIX-3b B D-PF3B-SLEDTELL: the Mistake tell anchor moves past PQ-H3 (qa/node.mjs deviation)', () => {
  const dev = (spec: any) => qaNode.deviation({ spec }, Eng(), { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) });
  const withStack = (at: string) => ({ ...S, mistake: { ...S.mistake, tells: S.mistake.tells.map((t: any) => (t.key === 'stack' ? { ...t, anchor: { ...t.anchor, at } } : t)) } });
  it('"Shoulders behind hips" anchors on the Mistake neck; the deviation is >= the envelope\'s deviationMin', () => {
    const min = qaIdx.loadPins().envelope.deviationMin, d = dev(S);
    console.log(`PF3b sled_pull deviation ${d.toFixed(1)} px (deviationMin ${min.toFixed(2)})`);
    expect(S.mistake.tells.find((t: any) => t.key === 'stack').anchor).toEqual({ at: 'neck', pose: 'mistake', off: [-6, 0] });
    expect(d).toBeGreaterThanOrEqual(min);
  });
  it('red: the same tell on backUpper (as before) falls under deviationMin', () => {
    const min = qaIdx.loadPins().envelope.deviationMin, d = dev(withStack('backUpper'));
    console.log(`PF3b sled_pull deviation on backUpper ${d.toFixed(1)} px`);
    expect(d).toBeLessThan(min);
  });
});

describe('LIB-PLATEFIX-3b B: the balance rule and its named exception (sled_pull, start)', () => {
  const inputs = (spec: any, pose: string) => {
    const { L, P } = view(spec);
    return { id: spec.id, pose, lm: L.lm[pose], trunkDeg: trunkOf(P, pose), ropeSag: ropeSag(spec, pose) };
  };
  it('green: start (the exception: rope taut, trunk <= 10 deg, CoM <= 10 cm behind the heels) and end (inside the base)', () => {
    for (const pose of ['start', 'end']) {
      const x = inputs(S, pose), c = M.com(x.lm)[2], heel = Math.min(x.lm['heel.l'][2], x.lm['heel.r'][2]);
      console.log(`PF3b sled_pull balance ${pose}: CoM ${c.toFixed(3)} m, heels ${heel.toFixed(3)} m (${((heel - c) * 100).toFixed(1)} cm behind), trunk ${x.trunkDeg.toFixed(1)} deg, rope sag ${(x.ropeSag * 100).toFixed(2)} cm`);
      expect(M.balanceProblems(x), pose).toEqual([]);
    }
  });
  it('red 1: the start rope slack (sag 5 cm) is red', () => {
    expect(M.balanceProblems({ ...inputs(S, 'start'), ropeSag: 0.05 })).toEqual([expect.stringMatching(/rope not taut/)]);
  });
  it('red 2: the start trunk 11 deg from vertical is red', () => {
    expect(M.balanceProblems({ ...inputs(S, 'start'), trunkDeg: 11 })).toEqual([expect.stringMatching(/trunk 11\.0 deg/)]);
  });
  it('red 3: the start CoM more than 10 cm behind the heels (the hips 9 cm further back) is red', () => {
    const st = S.poses.start, bad = { ...S, poses: { ...S.poses, start: { ...st, root: { ...st.root, at: [0, st.root.at[1], st.root.at[2] - 0.09] } } } };
    expect(M.balanceProblems(inputs(bad, 'start'))).toEqual([expect.stringMatching(/cm behind the heels/)]);
  });
  it('the rule stays strict elsewhere: the same lean in another pose (end) or another id (kettlebell_swing start) is red', () => {
    const x = inputs(S, 'start');
    expect(M.balanceProblems({ ...x, pose: 'end' })).toEqual([expect.stringMatching(/outside the heel-toe base/)]);
    expect(M.balanceProblems({ ...x, id: KS.default.id })).toEqual([expect.stringMatching(/outside the heel-toe base/)]);
  });
});

// LIB-PLATEFIX-3b B (ruling D-PF3B-ROPE): the taut run stays straight from the hands to the hitch but reads as rope (no
// rounded tube ends); the hand-to-coil tail is slack rope that drops from the lower hand and sags into the coil. Every
// value is read from the rendered svg (its path d strings and the plate css), the hands from the engine's landmarks with
// the render's camera; never from a spec constant. The rope the solid figure holds is the end's (the Mistake keeps it).
// Base (claude/lib-platefix-3b @ dfb47999) fails both: the run is a smoothed (C) tube with a domed end; the tail is a
// near-straight bow off the hand.
// Mutations (recorded in the PR): the run drawn `curve: true` (a smoothed outline, round ends) is red on the run row;
// TAIL_SAG 0.07 -> 0.03 (a bow, not a slack sag) is red on the tail row.
describe('LIB-PLATEFIX-3b B D-PF3B-ROPE: the sled rope reads as rope', () => {
  type Pt = [number, number];
  const pathsOf = (svg: string) => [...svg.matchAll(/<path class="([^"]*)" d="([^"]*)"\/>/g)].map(m => ({ cls: m[1]!, d: m[2]! }));
  /** The knots of a path d (M/L points and each C or Q segment's end point). */
  const knots = (d: string): Pt[] => {
    const t = d.match(/[MLCQZ]|-?[\d.]+/g)!, out: Pt[] = [];
    let cmd = '', k = 0;
    for (let i = 0; i < t.length;) {
      if (/[A-Z]/.test(t[i]!)) { cmd = t[i++]!; k = 0; continue; }
      const p: Pt = [+t[i]!, +t[i + 1]!]; i += 2; k++;
      if (cmd === 'C' ? k % 3 === 0 : cmd === 'Q' ? k % 2 === 0 : true) out.push(p);
    }
    return out;
  };
  const dist = (a: Pt, b: Pt) => Math.hypot(a[0] - b[0], a[1] - b[1]);
  const views = () => [false, true].map(mistake => {
    const { r, P } = view(S), svg = plate.renderPlate(S, { id: 'pf3b', mistake }).svg as string;
    return { name: mistake ? 'mistake' : 'normal', paths: pathsOf(svg), hand: (k: string) => P('end', k) as unknown as Pt, floorY: qaEng.cameraOf(S, r.report).y0 as number };
  });
  /** The one solid eq path with a knot within 3.5 px of `hand` and one at least `far` px from it (the rope piece from that fist). */
  const ropeFrom = (paths: any[], hand: Pt, far: number) => {
    const hit = paths.filter(p => p.cls === 'eq-solid' && knots(p.d).some(q => dist(q, hand) <= 3.5) && knots(p.d).some(q => dist(q, hand) >= far));
    if (hit.length !== 1) throw new Error(`${hit.length} rope pieces from the fist at ${hand}`);
    return hit[0];
  };
  const roundCap = (cls: string) => /round/.test((plate.PLATE_CSS as string).match(new RegExp(`\\.plate \\.${cls} \\{([^}]*)\\}`))?.[1]?.match(/stroke-linecap:[^;]*/)?.[0] ?? '');
  const ang = ([a, b]: [Pt, Pt]) => Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI;

  /** The taut run (upper fist to hitch): problems with it reading as straight rope. */
  const runProblems = (paths: any[], hand: Pt) => {
    const out: string[] = [], run = ropeFrom(paths, hand, 60), k = knots(run.d);
    if (!/^M[-\d. ]+(L[-\d. ]+)+Z$/.test(run.d)) out.push(`run not straight-edged (M/L/Z only): ${run.d.slice(0, 60)}`);
    if (roundCap(run.cls)) out.push(`run class ${run.cls} has round caps`);
    if (k.length !== 4) return [...out, `run has ${k.length} corners, not 4`];
    const e = [0, 1, 2, 3].map(i => [k[i]!, k[(i + 1) % 4]!] as [Pt, Pt]), long = [e[0]!, e[2]!], ends = [e[1]!, e[3]!], len = (s: [Pt, Pt]) => dist(s[0], s[1]);
    const L = Math.max(...long.map(len));
    if (Math.min(...long.map(len)) < 60) out.push('run edges under 60 px');
    if (Math.abs(((ang(long[0]!) - ang(long[1]!) + 360) % 360) - 180) > 0.5) out.push('run edges not parallel (not taut)');
    for (const s of ends) {
      const off = Math.abs(((ang(s) - ang(long[0]!) + 360) % 180) - 90);
      if (off > 2) out.push(`run end cut ${off.toFixed(1)} deg off square`);
      if (len(s) > 6) out.push(`run end ${len(s).toFixed(1)} px wide`);
    }
    // lay marks: single strokes with no round caps, each from one long edge to the other, slanted along the rope
    const from = ([a, b]: [Pt, Pt]) => (p: Pt) => Math.abs((b[0] - a[0]) * (a[1] - p[1]) - (a[0] - p[0]) * (b[1] - a[1])) / dist(a, b);
    const onA = from(long[0]!), onB = from(long[1]!), u = [Math.cos(ang(long[0]!) * Math.PI / 180), Math.sin(ang(long[0]!) * Math.PI / 180)];
    const within = (p: Pt) => { const s = (p[0] - k[0]![0]) * u[0]! + (p[1] - k[0]![1]) * u[1]!; return s >= -1 && s <= L + 1; };
    const marks = paths.filter(p => /^M[-\d. ]+L[-\d. ]+$/.test(p.d)).map(p => ({ cls: p.cls, k: knots(p.d) }))
      .filter(m => ((onA(m.k[0]!) < 0.6 && onB(m.k[1]!) < 0.6) || (onB(m.k[0]!) < 0.6 && onA(m.k[1]!) < 0.6)) && m.k.every(within));
    if (marks.length < Math.floor(L / 6)) out.push(`${marks.length} lay marks across the run (< ${Math.floor(L / 6)})`);
    for (const m of marks) {
      if (roundCap(m.cls)) out.push(`lay mark class ${m.cls} has round caps`);
      if (Math.abs((m.k[1]![0] - m.k[0]![0]) * u[0]! + (m.k[1]![1] - m.k[0]![1]) * u[1]!) < 1) out.push('a lay mark not slanted along the rope');
    }
    return out;
  };
  /** The slack tail (lower fist to the coil): problems with it dropping from the hand and sagging into the coil. */
  const tailProblems = (paths: any[], hand: Pt, floorY: number) => {
    const out: string[] = [], k = knots(ropeFrom(paths, hand, 60).d), coil = k.reduce((a, b) => (dist(b, hand) > dist(a, hand) ? b : a));
    const L = dist(hand, coil), s = coil[0] > hand[0] ? 1 : -1, n: Pt = [-s * (coil[1] - hand[1]) / L, s * (coil[0] - hand[0]) / L];   // n: the chord's screen-down side
    const below = (p: Pt) => (p[0] - hand[0]) * n[0] + (p[1] - hand[1]) * n[1];
    if (coil[1] > floorY || floorY - coil[1] > 10) out.push(`tail ends ${(floorY - coil[1]).toFixed(1)} px above the floor, not on the coil`);
    const mid = k.filter(p => dist(p, hand) > 6 && dist(p, coil) > 6);
    const above = mid.filter(p => !(below(p) > 0));
    if (above.length) out.push(`${above.length} tail points on or above the hand-to-coil line`);
    const sag = Math.max(...mid.map(below)) / L;
    console.log(`PF3b sled_pull tail: chord ${L.toFixed(1)} px, greatest drop below it ${(sag * L).toFixed(1)} px (${(sag * 100).toFixed(1)} %)`);
    if (sag < 0.08) out.push(`tail sags ${(sag * 100).toFixed(1)} % of its chord (< 8 %: a bow, not slack)`);
    const drop = k.filter(p => dist(p, hand) >= 15 && dist(p, hand) <= 25).map(p => Math.atan2(Math.abs(p[0] - hand[0]), p[1] - hand[1]) * 180 / Math.PI);
    if (!drop.length || Math.max(...drop) > 15) out.push(`tail leaves the hand ${Math.max(...drop).toFixed(1)} deg off plumb (> 15)`);
    return out;
  };
  it('the taut run (upper fist to hitch): one straight band (M/L/Z, parallel edges), square-cut ends one rope width, crossed by slanted lay marks; no round caps; both views', () => {
    for (const v of views()) expect(runProblems(v.paths, v.hand('grip.r')), v.name).toEqual([]);
  });
  it('the tail (lower fist to the coil): every point strictly below the hand-to-coil line, sagging >= 8 % of it, leaving the hand within 15 deg of plumb, ending on the coil; both views', () => {
    for (const v of views()) expect(tailProblems(v.paths, v.hand('grip.l'), v.floorY), v.name).toEqual([]);
  });
});
