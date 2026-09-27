// Lat Pulldown, side view: the motion of anim-lat-pulldown/gen.mjs at DEMO_COMMIT (makeLP with the fitted LP_OPT that
// fit-motion.mjs wrote, GRIP_Z 14, the bar, the far arm, the front cable and the stack), merged into the one rig (R1-1).
import { LEN } from '../rig/parts';
import { add, bern, deg, dot, mul, n2, n3, n4, norm, progress, rad, solve3, sub, type Solve, type Vec } from '../rig/math';
import { LIM, PHASES, SAMPLES, median } from '../rig/stops';
import type { MoveSpec } from '../rig/api';
import type { Move, Truth } from './types';

export const LP_OPT = {
  DX: -2, IN0: 171, TEND: 26, X1: 157, Y1: 150, B0: 126.0955, SK: 4.706,
  PX: [4.6999, 13.1489, 25.7914, 38.4808, 20.9568],
  PV: [0.062, 0.3134, 0.38007, 0.78897, 0.89265],
  PC: [[1.3869, 0.961, 0.9347], [0.361, 0.1775, 0.9798]] as [number, number, number][],
  TAB: 2000,
};
export type LpOpt = typeof LP_OPT;
export type LpPose = Solve & { p: number; S: Vec; G: Vec; elev: number; behind: number; uaRaw: number; faRaw: number; sc: [number, number]; bar: [number, number]; ua: number; fa: number };

export const makeLP = (Z: number, o: LpOpt = LP_OPT) => {
  const H: [number, number] = [150, 206];        // hip on the stage (spec 3.2)
  const LEAN = 10;                               // torso leaned back 10 deg, fixed: rotate(-10) about the hip
  const cL = Math.cos(rad(-LEAN)), sL = Math.sin(rad(-LEAN));
  const rotL = ([x, y]: readonly number[]): [number, number] => [x! * cL - y! * sL, x! * sL + y! * cL];   // SVG rotate(-10deg)
  const TD = [Math.sin(rad(LEAN)), Math.cos(rad(LEAN)), 0];      // torso "down" axis (hip side)
  const TF = [Math.cos(rad(LEAN)), -Math.sin(rad(LEAN)), 0];     // torso forward axis (chest side)
  const TZ = [0, 0, 1];                                          // out to the lifter's side, toward the camera
  // Shoulder blades (spec truth table): slightly raised at the top stretch, pulled down and back first.
  const SC0: [number, number] = [0.5, -2.5], SC1: [number, number] = [-1.5, 1.5];
  const scap = (p: number): [number, number] => { const w = 1 - (1 - Math.min(1, Math.max(0, p))) ** o.SK; return [SC0[0] + (SC1[0] - SC0[0]) * w, SC0[1] + (SC1[1] - SC0[1]) * w]; };
  const shoulder = (p: number): Vec => { const d = scap(p), r = rotL([d[0], -62 + d[1]]); return [H[0] + r[0], H[1] + r[1], 0]; };
  const S0 = shoulder(0), R0 = Math.sqrt(38 * 38 + 40 * 40 - 2 * 38 * 40 * Math.cos(rad(o.IN0)));
  const X0 = S0[0]! + o.DX, Y0 = S0[1]! - Math.sqrt(R0 * R0 - o.DX * o.DX - Z * Z);
  const TRAVEL = o.Y1 - Y0;
  const BX = [X0, ...o.PX.map(v => X0 + v), o.X1], BY = [Y0, ...o.PV.map(v => Y0 + TRAVEL * v), o.Y1];
  const gripAt = (p: number): Vec => [bern(BX, p), bern(BY, p), Z];
  // the hand path as a polyline (even steps of p), with its arc length, for the guide and the "still to go" line
  const PN = 96, pathPts = Array.from({ length: PN + 1 }, (_, i) => gripAt(i / PN));
  const cum = [0]; for (let i = 1; i <= PN; i++) cum.push(cum[i - 1]! + Math.hypot(pathPts[i]![0]! - pathPts[i - 1]![0]!, pathPts[i]![1]! - pathPts[i - 1]![1]!));
  const pathLen = cum[PN]!;
  const arcAt = (p: number) => { const f = p * PN, i = Math.max(0, Math.min(PN - 1, Math.floor(f))); return (cum[i]! + (cum[i + 1]! - cum[i]!) * (f - i)) / cum[PN]!; };
  // Poles (which way the elbow bends): at the top out to the side and B0 - 90 degrees forward; at the end the chosen end
  // elbow; in between one smooth curve.
  const pole = (f: number, s: number, d: number) => norm(add(add(mul(TF, f), mul(TZ, s)), mul(TD, d)));
  const poleTop = pole(-Math.cos(rad(o.B0)), Math.sin(rad(o.B0)), 0);
  const S1 = shoulder(1), G1 = gripAt(1);
  const endElbow = (() => {
    const D = sub(G1, S1), d = Math.hypot(...D), ax = mul(D, 1 / d), along = (38 * 38 - 40 * 40 + d * d) / (2 * d), rc = Math.sqrt(38 * 38 - along * along);
    const u = norm(sub(TD, mul(ax, dot(TD, ax)))), v = [ax[1]! * u[2]! - ax[2]! * u[1]!, ax[2]! * u[0]! - ax[0]! * u[2]!, ax[0]! * u[1]! - ax[1]! * u[0]!];
    const E = add(add(S1, mul(ax, along)), add(mul(u, rc * Math.cos(rad(o.TEND))), mul(v, rc * Math.sin(rad(o.TEND)))));
    return { E };
  })();
  const poleEnd = norm(sub(endElbow.E, S1));
  const PCV = [poleTop, ...o.PC.map(([f, s, d]) => add(add(mul(TF, f), mul(TZ, s)), mul(TD, d))), poleEnd];
  const poleAt = (p: number) => norm([0, 1, 2].map(k => bern(PCV.map(v => v[k]!), p)));
  const raw = (p: number) => {
    const S = shoulder(p), G = gripAt(p), r = solve3(S, G, LEN.upperArm, LEN.forearm, poleAt(p));
    const es = sub(r.E, S);
    return { p, S, G, ...r, elev: deg(Math.acos(dot(es, TD) / 38)), behind: -dot(es, TF), uaRaw: -r.phi + LEAN, faRaw: -(r.psi - r.phi), sc: scap(p), bar: [G[0]! - X0, G[1]! - Y0] as [number, number] };
  };
  // unwrap the two rotations along p, so keyframes never spin the long way round
  const N = o.TAB, tab: { ua: number; fa: number }[] = [];
  for (let i = 0; i <= N; i++) {
    const q = raw(i / N);
    if (i) { const pr = tab[i - 1]!; while (q.uaRaw - pr.ua > 180) q.uaRaw -= 360; while (q.uaRaw - pr.ua < -180) q.uaRaw += 360; while (q.faRaw - pr.fa > 180) q.faRaw -= 360; while (q.faRaw - pr.fa < -180) q.faRaw += 360; }
    tab.push({ ua: q.uaRaw, fa: q.faRaw });
  }
  const pose = (p: number): LpPose => {
    const q = raw(p), ref = tab[Math.round(p * N)]!;
    let ua = q.uaRaw, fa = q.faRaw;
    while (ua - ref.ua > 180) ua -= 360; while (ua - ref.ua < -180) ua += 360;
    while (fa - ref.fa > 180) fa -= 360; while (fa - ref.fa < -180) fa += 360;
    return { ...q, ua, fa };
  };
  return { H, LEAN, rotL, TD, TF, Z, X0, Y0, Y1: o.Y1, X1: o.X1, TRAVEL, SC0, SC1, scap, shoulder, gripAt, pathPts, arcAt, pathLen, pose, o };
};
export type LP = ReturnType<typeof makeLP>;

export const GRIP_Z = 14;
export const SHOULDER_OUT = 22, SHOULDER_OUTSIDE = 30.2;  // front view: shoulder joint 22 from the centre line; outside of the deltoid 30.2
export const gripTimes = (Z: number) => 2 * (SHOULDER_OUT + Z) / (2 * SHOULDER_OUTSIDE);
// Bar: drawn with the rig's slight view from the front and above: one unit of depth moves a point (0.25, -0.15).
export const DEPTH_K = [0.25, -0.15] as const;
export const NEAR_Z = SHOULDER_OUT + GRIP_Z, BAR_HALF = 75, BAR_BEND = 48, BAR_DROP = 6;
export const barPt = (z: number): [number, number] => { const d = NEAR_Z - z, drop = BAR_DROP * Math.max(0, (Math.abs(z) - BAR_BEND) / (BAR_HALF - BAR_BEND)); return [DEPTH_K[0] * d, DEPTH_K[1] * d + drop]; };
export const BAR_PTS = [BAR_HALF, BAR_BEND, -BAR_BEND, -BAR_HALF].map(barPt);
export const BAR_MID = barPt(0), FAR_GRIP = barPt(-NEAR_Z);
export const HAND_HALF = 5;
export const TILE2 = 0.125;
export const angTo = (v: Vec, w: Vec) => deg(Math.acos(dot(v, w) / (Math.hypot(...v) * Math.hypot(...w))));

export type Far = { S: number[]; E: number[]; G: number[]; au: number; af: number; fu: number; ff: number };
// the front cable and the far arm as functions of the pose p
export function extrasOf(L: LP, PF: { x: number; y: number; r: number }) {
  const { pose, X0, Y0 } = L;
  const C0 = [X0 + BAR_MID[0], Y0 + BAR_MID[1]];          // bar middle (cable hook) at the top
  const cab = (p: number, q: LpPose = pose(p)) => { const c = [C0[0]! + q.bar[0], C0[1]! + q.bar[1]], dx = c[0]! - PF.x, dy = c[1]! - (PF.y + PF.r); return { len: Math.hypot(dx, dy), ang: deg(Math.atan2(-dx, dy)) }; };
  // far forearm: from the far grip it aims at the near elbow, so it tucks in behind the near arm (or behind the chest)
  const farJ = (p: number, q: LpPose = pose(p)): Far => { const zE = SHOULDER_OUT + q.E[2]!;
    const S = [q.S[0]! + DEPTH_K[0] * 2 * SHOULDER_OUT, q.S[1]! + DEPTH_K[1] * 2 * SHOULDER_OUT], E = [q.E[0]! + DEPTH_K[0] * 2 * zE, q.E[1]! + DEPTH_K[1] * 2 * zE], G = [q.G[0]! + FAR_GRIP[0], q.G[1]! + FAR_GRIP[1]];
    const au = deg(Math.atan2(-(E[0]! - S[0]!), E[1]! - S[1]!)), af = deg(Math.atan2(-(G[0]! - E[0]!), G[1]! - E[1]!));
    return { S, E, G, au, af, fu: Math.hypot(E[0]! - S[0]!, E[1]! - S[1]!) / LEN.upperArm, ff: Math.hypot(G[0]! - E[0]!, G[1]! - E[1]!) / LEN.forearm }; };
  const FS0 = farJ(0).S;
  // the far arm's two screen angles, unwrapped along p against a table
  const FN = L.o.TAB, farTab: Far[] = []; for (let i = 0; i <= FN; i++) { const f = farJ(i / FN); if (i) { const pr = farTab[i - 1]!; while (f.au - pr.au > 180) f.au -= 360; while (f.au - pr.au < -180) f.au += 360; while (f.af - pr.af > 180) f.af -= 360; while (f.af - pr.af < -180) f.af += 360; } farTab.push(f); }
  const far = (p: number, q?: LpPose) => { const f = farJ(p, q), r = farTab[Math.round(p * FN)]!;
    while (f.au - r.au > 180) f.au -= 360; while (f.au - r.au < -180) f.au += 360; while (f.af - r.af > 180) f.af -= 360; while (f.af - r.af < -180) f.af += 360;
    return f; };
  return { C0, cab, far, FS0 };
}
export type Extras = ReturnType<typeof extrasOf>;

// ---- the smoothness numbers shoot.cjs measures in the browser, computed from the solved poses as the page draws them ----
function drawnAt(L: LP, X: Extras, p: number) {
  const q = L.pose(p), f = X.far(p, q), c = X.cab(p, q);
  return { sc: [+n3(q.sc[0]), +n3(q.sc[1])], tfa: +n3(-(1 - q.fu) * LEN.upperArm), thd: +n3(-(1 - q.ff) * LEN.forearm),
    ang: { 'lp-ua': +n4(q.ua), 'lp-fa': +n4(q.fa), 'lp-bar': +n4(L.LEAN - q.ua - q.fa), 'lp-fua': +n4(f.au), 'lp-ffa': +n4(f.af - f.au), 'lp-fbar': +n4(-f.af), 'lp-cable-f': +n4(c.ang) } as Record<string, number> };
}
type Drawn = ReturnType<typeof drawnAt>;
function drawnGrip(L: LP, d: Drawn): [number, number] {
  const R = (a: number, [x, y]: readonly number[]) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [x! * c - y! * s, x! * s + y! * c]; };
  const f = R(d.ang['lp-fa']!, [0, LEN.forearm + d.thd]);
  const u = R(d.ang['lp-ua']!, [f[0]!, LEN.upperArm + d.tfa + f[1]!]);
  const t = L.rotL([d.sc[0]! + u[0]!, -62 + d.sc[1]! + u[1]!]);
  return [L.H[0] + t[0], L.H[1] + t[1]];
}
export type LpRow = { name: string; a: number; b: number; travel: number | null; c: number | null; cu?: number | null; gate: boolean };
export type LpSmooth = { d: { v: number; k?: string; u?: number }; phases: Record<string, { a: number; b: number; c: number; rows: LpRow[] }>; worst: number };
export function lpSmoothNumbers(L: LP, X: Extras, stops: number[] = SAMPLES): LpSmooth {
  const N = 480, DT = 4 / N;
  const st = stops.map(pc => ({ u: pc / 100, d: drawnAt(L, X, progress(pc / 100)) }));
  const names = Object.keys(st[0]!.d.ang);
  const lerpD = (a: Drawn, b: Drawn, w: number): Drawn => ({ sc: [a.sc[0]! + (b.sc[0]! - a.sc[0]!) * w, a.sc[1]! + (b.sc[1]! - a.sc[1]!) * w], tfa: a.tfa + (b.tfa - a.tfa) * w, thd: a.thd + (b.thd - a.thd) * w, ang: Object.fromEntries(names.map(k => [k, a.ang[k]! + (b.ang[k]! - a.ang[k]!) * w])) });
  const smp: Drawn[] = []; let j = 0;
  for (let i = 0; i <= N; i++) { const u = i / N; while (j < st.length - 2 && st[j + 1]!.u <= u) j++; const w = (u - st[j]!.u) / (st[j + 1]!.u - st[j]!.u); smp.push(lerpD(st[j]!.d, st[j + 1]!.d, Math.min(1, w))); }
  const grip = smp.map(d => drawnGrip(L, d)), ser = Object.fromEntries(names.map(k => [k, smp.map(d => d.ang[k]!)]));
  const stats = (s: (number | number[])[], i0: number, i1: number, vec: boolean) => {
    const vel: (number | number[])[] = [];
    for (let i = i0; i < i1; i++) vel.push(vec ? [((s[i + 1] as number[])[0]! - (s[i] as number[])[0]!) / DT, ((s[i + 1] as number[])[1]! - (s[i] as number[])[1]!) / DT] : ((s[i + 1] as number) - (s[i] as number)) / DT);
    const mag = (v: number | number[]) => (vec ? Math.hypot((v as number[])[0]!, (v as number[])[1]!) : Math.abs(v as number)), peak = Math.max(...vel.map(mag));
    let jump = 0; for (let i = 1; i < vel.length; i++) jump = Math.max(jump, vec ? Math.hypot((vel[i] as number[])[0]! - (vel[i - 1] as number[])[0]!, (vel[i] as number[])[1]! - (vel[i - 1] as number[])[1]!) : Math.abs((vel[i] as number) - (vel[i - 1] as number)));
    const seg = s.slice(i0, i1 + 1) as number[];
    return { a: peak ? Math.max(mag(vel[0]!), mag(vel[vel.length - 1]!)) / peak : 0, b: peak ? jump / peak : 0, travel: vec ? null : Math.max(...seg) - Math.min(...seg) };
  };
  const stopJerk = (k: string, a: number, b: number) => {
    const s = st.filter(x => x.u >= a - 1e-9 && x.u <= b + 1e-9).map(x => [x.u * 4, x.d.ang[k]!] as const);
    const vv: number[] = [], tm: number[] = []; for (let i = 1; i < s.length; i++) { vv.push((s[i]![1] - s[i - 1]![1]) / (s[i]![0] - s[i - 1]![0])); tm.push((s[i]![0] + s[i - 1]![0]) / 2); }
    const acc: number[] = []; for (let i = 1; i < vv.length; i++) acc.push((vv[i]! - vv[i - 1]!) / (tm[i]! - tm[i - 1]!));
    const jk: number[] = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i]! - acc[i - 1]!));
    const med = median(jk), mx = Math.max(...jk);
    return { r: med > 0 ? mx / med : Infinity, u: s[jk.indexOf(mx) + 2]![0] / 4 };
  };
  let d: LpSmooth['d'] = { v: 0 }; for (const k of names) for (let i = 0; i < N; i++) { const v = Math.abs(ser[k]![i + 1]! - ser[k]![i]!); if (v > d.v) d = { v, k, u: i / N }; }
  const out: LpSmooth = { d, phases: {}, worst: 0 };
  for (const [ph, a, b] of PHASES) {
    const i0 = Math.round(a * N), i1 = Math.round(b * N);
    const rows: LpRow[] = [{ name: 'near hand (grip)', ...stats(grip, i0, i1, true), c: null, gate: true }];
    for (const k of names) { const r = stats(ser[k]!, i0, i1, false), gate = r.travel! >= LIM.travel, jj = gate ? stopJerk(k, a, b) : null; rows.push({ name: k, ...r, c: jj ? jj.r : null, cu: jj ? jj.u : null, gate }); }
    const g = rows.filter(r => r.gate), cc = rows.filter(r => r.c !== null);
    out.phases[ph] = { a: Math.max(...g.map(r => r.a)), b: Math.max(...g.map(r => r.b)), c: Math.max(...cc.map(r => r.c!)), rows };
  }
  const P = out.phases as Record<'lift' | 'return', { a: number; b: number; c: number }>;
  out.worst = Math.max(P.lift.a / LIM.a, P.return.a / LIM.a, P.lift.b / LIM.b, P.return.b / LIM.b, P.lift.c / LIM.c, P.return.c / LIM.c, d.v / LIM.d);
  return out;
}

export function makeLatPulldown(L: LP = makeLP(GRIP_Z)) {
  const { H, LEAN, X0, Y0, TRAVEL, pose, arcAt } = L;
  // Front pulley: r 5.2, straight above the cable hook at the top of the rep.
  const PF = { x: Math.round((L.X0 + BAR_MID[0]) * 10) / 10, y: 39.2, r: 5.2 };
  const X = extrasOf(L, PF);
  const { cab, far, FS0 } = X;
  // one solve per stop: sampleMove visits every channel at one stop before the next, so the channels share the last
  // stop's pose, far arm and cable (a one-entry cache; nothing is kept between stops or calls)
  let last: { p: number; q: LpPose; f: Far; c: { len: number; ang: number } } | null = null;
  const at = (p: number) => {
    if (!last || last.p !== p) { const q = pose(p); last = { p, q, f: far(p, q), c: cab(p, q) }; }
    return last;
  };
  const CAB0 = cab(0).len, lift = (p: number) => 0.5 * (at(p).c.len - CAB0);   // 2:1: the stack rises half as far as the cable pays out
  const BEAM = 36, REAR_TOP = BEAM + 11, REAR_RUN = 106 - REAR_TOP;
  // the "still to go" line starts 16 units below the grip
  const TOGO_GAP = 16 / L.pathLen;
  // analytic checks between baked samples, at 1/4, 1/2 and 3/4 of each gap: far fist vs far grip, cable end vs hook,
  // drawn near hand vs the solved path
  const drift = (stops: number[] = SAMPLES) => {
    const dr = { far: 0, cable: 0, nearPath: 0 };
    const lerp = (x: number, y: number, w: number) => x + (y - x) * w;
    for (let i = 0; i < stops.length - 1; i++) {
      const p0 = progress(stops[i]! / 100), p1 = progress(stops[i + 1]! / 100);
      const a = pose(p0), b = pose(p1), fa0 = far(p0), fb = far(p1), ca = cab(p0), cb = cab(p1);
      for (const w of [0.25, 0.5, 0.75]) {
        const m = (k: 'ua' | 'fa' | 'fu' | 'ff') => lerp(a[k], b[k], w);
        const sc = [lerp(a.sc[0], b.sc[0], w), lerp(a.sc[1], b.sc[1], w)];
        const Sx = L.rotL([sc[0]!, -62 + sc[1]!]);
        const phi = -(m('ua') - LEAN), psi = phi - m('fa');
        const hand = [H[0] + Sx[0] + LEN.upperArm * m('fu') * Math.sin(rad(phi)) + LEN.forearm * m('ff') * Math.sin(rad(psi)), H[1] + Sx[1] + LEN.upperArm * m('fu') * Math.cos(rad(phi)) + LEN.forearm * m('ff') * Math.cos(rad(psi))];
        dr.nearPath = Math.max(dr.nearPath, Math.min(...Array.from({ length: 41 }, (_, k) => { const g = pose(lerp(p0, p1, k / 40)).G; return Math.hypot(hand[0]! - g[0]!, hand[1]! - g[1]!); })));
        const fm = (k: 'au' | 'af' | 'fu' | 'ff') => lerp(fa0[k], fb[k], w);
        const fS = [lerp(fa0.S[0]!, fb.S[0]!, w), lerp(fa0.S[1]!, fb.S[1]!, w)], au = fm('au'), af = fm('af');
        const fHand = [fS[0]! - LEN.upperArm * fm('fu') * Math.sin(rad(au)) - LEN.forearm * fm('ff') * Math.sin(rad(af)), fS[1]! + LEN.upperArm * fm('fu') * Math.cos(rad(au)) + LEN.forearm * fm('ff') * Math.cos(rad(af))];
        dr.far = Math.max(dr.far, Math.hypot(fHand[0]! - hand[0]! - FAR_GRIP[0], fHand[1]! - hand[1]! - FAR_GRIP[1]));
        const cAng = lerp(ca.ang, cb.ang, w), cLen = lerp(ca.len, cb.len, w);
        const cEnd = [PF.x - cLen * Math.sin(rad(cAng)), PF.y + PF.r + cLen * Math.cos(rad(cAng))];
        dr.cable = Math.max(dr.cable, Math.hypot(cEnd[0]! - hand[0]! - BAR_MID[0], cEnd[1]! - hand[1]! - BAR_MID[1]));
      }
    }
    return dr;
  };
  const row = (q: LpPose) => ({ p: n2(q.p), shoulder: [n2(q.S[0]!), n2(q.S[1]!)], grip: q.G.map(n2), elbow: q.E.map(n2), ua: n2(q.ua), fu: n3(q.fu), fa: n2(q.fa), ff: n3(q.ff), inside: n2(q.inside), elev: n2(q.elev), behind: n2(q.behind), bar: n2(q.G[1]! - Y0), lift: n2(lift(q.p)) });
  const keyTable = () => [0, 0.25, 0.5, 0.75, 1].map(p => row(pose(p)));
  const smooth = (stops?: number[]) => lpSmoothNumbers(L, X, stops);
  // spec 3.2 truth table, with the ranges anim-lat-pulldown/shoot.cjs checks
  const truth = (): Truth[] => {
    const a = pose(0), b = pose(1);
    let minFu = 9; for (let i = 0; i <= 100; i++) minFu = Math.min(minFu, pose(i / 100).fu);
    const topElev2D = angTo([a.E[0]! - a.S[0]!, a.E[1]! - a.S[1]!], [L.TD[0]!, L.TD[1]!]);
    const endBehind2D = deg(Math.atan2(b.S[0]! - b.E[0]!, b.E[1]! - b.S[1]!)) + LEAN;
    return [
      { name: 'top elbow inside angle', value: a.inside, min: 160, max: 175 },
      { name: 'top upper arm from the torso line', value: a.elev, min: 160, max: 180 },
      { name: 'top upper arm drawn from the torso line', value: topElev2D, min: 165, max: 180 },
      { name: 'end upper arm from the torso line', value: b.elev, min: 20, max: 30.5 },
      { name: 'end elbow behind the shoulder joint', value: b.behind, min: 1e-9, max: Infinity },
      { name: 'end upper arm drawn behind the torso line', value: endBehind2D, min: 1e-9, max: 30.5 },
      { name: 'end elbow inside angle', value: b.inside, min: 30, max: 45 },
      { name: 'upper arm drawn length (min)', value: minFu, min: 0.55, max: 1 },
    ];
  };
  const channels: Move['channels'] = [
    { className: 'lp-ua', kind: 'composite', at: p => { const q = at(p).q; return `translate(${n3(q.sc[0])}px,${n3(q.sc[1])}px) rotate(${n4(q.ua)}deg)`; } },
    { className: 'lp-ul', kind: 'scaleY', at: p => `scaleY(${n4(at(p).q.fu)})` },
    { className: 'lp-fa', kind: 'composite', at: p => { const q = at(p).q; return `translateY(${n3(-(1 - q.fu) * LEN.upperArm)}px) rotate(${n4(q.fa)}deg)`; } },
    { className: 'lp-fl', kind: 'scaleY', at: p => `scaleY(${n4(at(p).q.ff)})` },
    { className: 'lp-hd', kind: 'translateY', at: p => `translateY(${n3(-(1 - at(p).q.ff) * LEN.forearm)}px)` },
    { className: 'lp-bar', kind: 'rotate', at: p => { const q = at(p).q; return `rotate(${n4(LEAN - q.ua - q.fa)}deg)`; } },
    { className: 'lp-fua', kind: 'composite', at: p => { const f = at(p).f; return `translate(${n3(f.S[0]! - FS0[0]!)}px,${n3(f.S[1]! - FS0[1]!)}px) rotate(${n4(f.au)}deg)`; } },
    { className: 'lp-ful', kind: 'scaleY', at: p => `scaleY(${n4(at(p).f.fu)})` },
    { className: 'lp-ffa', kind: 'composite', at: p => { const f = at(p).f; return `translateY(${n3(-(1 - f.fu) * LEN.upperArm)}px) rotate(${n4(f.af - f.au)}deg)`; } },
    { className: 'lp-ffl', kind: 'scaleY', at: p => `scaleY(${n4(at(p).f.ff)})` },
    { className: 'lp-fhd', kind: 'translateY', at: p => `translateY(${n3(-(1 - at(p).f.ff) * LEN.forearm)}px)`, alias: 'lp-fbh' },
    { className: 'lp-stack', kind: 'translateY', at: p => `translateY(${n3(-lift(p))}px)` },
    { className: 'lp-cable-f', kind: 'composite', at: p => { const c = at(p).c; return `rotate(${n4(c.ang)}deg) scaleY(${n4(c.len)})`; } },
    { className: 'lp-cable-r', kind: 'scaleY', at: p => `scaleY(${n4((REAR_RUN - lift(p)) / REAR_RUN)})` },
    { className: 'lp-togo', kind: 'dashoffset', at: p => n3(-Math.min(arcAt(p) + TOGO_GAP, 0.999)) },
    { className: 'lp-eff', kind: 'opacity', at: p => n3(0.75 + 0.25 * p) },
    { className: 'lp-ten', kind: 'opacity', at: p => n3(p) },
    { className: 'lp-flare', kind: 'scaleX', at: p => `scaleX(${n4(0.02 + 0.98 * p)})` },
    { className: 'lp-fbar', kind: 'rotate', at: p => `rotate(${n4(-at(p).f.af)}deg)` },
  ];
  return { L, H, LEAN, X0, Y0, TRAVEL, PF, X, FS0, CAB0, lift, BEAM, REAR_TOP, REAR_RUN, drift, keyTable, smooth, truth, channels };
}

export const LP_SPEC: MoveSpec = {
  id: 'lp', exerciseId: 'lib_lat_pulldown', view: 'side', cam: 'Side view', rep: 4,
  caps: ['Pull to your chest, 1 s', 'Squeeze, chest up', 'Up slowly, 2 s', 'Arms long, reset'],
  tempo: '1 s down · 2 s up', picsLine: 'Pull down 1 s, squeeze, up 2 s',
  srText: 'One rep: pull the bar down in front of your face to the top of your chest for 1 second, squeeze, let it up slowly for 2 seconds, reset with your arms long overhead.',
  chips: [
    { id: 'grip', label: 'Grip', caption: 'Hands a little wider than your shoulders, thumbs around the bar.' },
    { id: 'path', label: 'Path', caption: 'The bar comes down in front of your face to the top of your chest.' },
    { id: 'pad', label: 'Pad', caption: 'Thigh pad snug on your thighs, feet flat. It stops you lifting off.' },
  ],
  pics: ['Thighs under the pad, arms long', 'Drive your elbows down', 'Bar to the top of your chest', 'Up slowly, 2 s'],
  picsAt: [0, TILE2, 0.31, 0.625],
  roles: { lats: 'lats', biceps: 'biceps', midBack: 'mid_back' },
};

export const latPulldownRig = makeLatPulldown();
export const latPulldown: Move = { spec: LP_SPEC, stops: { lift: 0.25, return: 0.5 }, channels: latPulldownRig.channels, glow: 'lp-ten' };
