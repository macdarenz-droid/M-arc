// fit-motion.mjs: refits the Lat Pulldown motion (LP_OPT in gen.mjs) so every drawn angle, the cable and the bar pass
// the numeric smoothness check (../smooth-check.cjs, UPGRADE-BRIEF.md smoothness target 4) with a margin, while the
// path keeps the drawn-geometry checks shoot.cjs makes (docs/COACHING-DECISIONS.md D-L1).
// Usage: node fit-motion.mjs [generations=350] [seed=9]
// It starts from the current LP_OPT, runs a CMA-ES search (about 5 minutes) and prints the new LP_OPT fields. Paste
// them into gen.mjs (IN0 rounded), then run node gen.mjs, node shoot.cjs and node gen.mjs again. Not a deliverable.
//
// Scored with a margin under the check's limits: (a) 0.9 %, (b) 7.5 %, (c) 2.8 x, (d) 3.8 deg (limits 1 %, 8 %, 3 x, 4).
// Kept as penalties, each a proxy of a shoot.cjs check computed from the solved pose (the stops are 0.25-0.5 % apart,
// so the drawn pose between them differs by far less than the margins):
//  - the far fist never under the Grip close-up's inset (margin 0.6 px); no near-arm part within 1.2 of the face's
//    front edge while the grip is between the forehead and the chin; the fist and forearm 0.45 clear of the head
//    (round 3 had 0.21) and 3.6 clear of the face at tile 2; tile 2's forearm within 14 deg of vertical and the elbow
//    31 below the hand;
//  - the truth table: top elbow 169.5-171, top upper arm aimed at 162.3 or more (side view 165.5), upper arm never below
//    0.58 of its length, the elbow closing steadily (opening at most 0.2 at the end), every joint's speed rising once
//    and falling once per phase (dip under 1.2 %).
process.env.LP_NO_WRITE = '1';
const m = await import('./gen.mjs');
const { SIDE, LEN, LP_FIST, FACE } = m;
const GENS = +(process.argv[2] || 350), SEED = +(process.argv[3] || 9);
const LIM = { a: 0.009, b: 0.075, c: 2.8, d: 3.8 };
const rad = d => (d * Math.PI) / 180, deg = r => (r * 180) / Math.PI;

// ---- drawn geometry, as the page draws it (2D affine: [a, b, c, d, e, f]) ----
const mul = (p, q) => [p[0] * q[0] + p[2] * q[1], p[1] * q[0] + p[3] * q[1], p[0] * q[2] + p[2] * q[3], p[1] * q[2] + p[3] * q[3], p[0] * q[4] + p[2] * q[5] + p[4], p[1] * q[4] + p[3] * q[5] + p[5]];
const T = (x, y) => [1, 0, 0, 1, x, y], R = d => { const c = Math.cos(rad(d)), s = Math.sin(rad(d)); return [c, s, -s, c, 0, 0]; }, S = (x, y) => [x, 0, 0, y, 0, 0];
const ap = (t, [x, y]) => [t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5]];
const about = (o, ...ts) => mul(ts.reduce(mul, T(o[0], o[1])), T(-o[0], -o[1]));   // CSS transform with transform-origin o
const pip = (pt, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c; } return c; };
const seg = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
const edge = (P, closed = true) => { const o = [], n = closed ? P.length : P.length - 1; for (let i = 0; i < n; i++) { const a = P[i], b = P[(i + 1) % P.length]; for (let k = 0; k < 8; k++) o.push([a[0] + ((b[0] - a[0]) * k) / 8, a[1] + ((b[1] - a[1]) * k) / 8]); } if (!closed) o.push(P[P.length - 1]); return o; };
const pd = (P, Q) => { let mn = 1e9; for (let i = 0; i < P.length; i++) { const a = P[i], b = P[(i + 1) % P.length]; for (let k = 0; k < 16; k++) { const s = [a[0] + ((b[0] - a[0]) * k) / 16, a[1] + ((b[1] - a[1]) * k) / 16]; for (let j = 0; j < Q.length; j++) mn = Math.min(mn, seg(s, Q[j], Q[(j + 1) % Q.length])); } } return mn; };
const headPoly = L => { const t = mul(T(L.H[0], L.H[1]), R(-L.LEAN)); return SIDE.head.base.map(p => ap(t, p)); };
const nearParts = (L, q) => {   // .figure-arm: translate(H) rotate(-10) > lp-ua > (lp-ul, deltoid, lp-fa > (elbow, lp-fl, lp-hd))
  const ua = mul(mul(T(L.H[0], L.H[1]), R(-L.LEAN)), about([0, -62], T(q.sc[0], q.sc[1]), R(q.ua)));
  const fa = mul(ua, about([0, -24], T(0, -(1 - q.fu) * LEN.upperArm), R(q.fa)));
  const tp = (t, poly) => poly.map(p => ap(t, p));
  return { upper: tp(mul(ua, about([0, -62], S(1, q.fu))), SIDE.upperArm.base), delt: tp(ua, SIDE.deltoid.base), elbow: tp(fa, SIDE.elbowCap.base),
    fore: tp(mul(fa, about([0, -24], S(1, q.ff))), SIDE.forearm.base), fist: tp(mul(fa, T(0, -(1 - q.ff) * LEN.forearm)), LP_FIST.base) };
};
// shoot.cjs 3b4: no near-arm part over the face's front edge (brow to chin, FACE.edge) while the grip passes the face
const faceClear = (L, q) => { const prof = edge(headPoly(L).slice(FACE.edge[0], FACE.edge[1] + 1), false); let mn = 1e9;
  for (const poly of Object.values(nearParts(L, q))) { if (prof.some(s => pip(s, poly))) return -1; for (const s of prof) for (let j = 0; j < poly.length; j++) mn = Math.min(mn, seg(s, poly[j], poly[(j + 1) % poly.length])); } return mn; };
// shoot.cjs 3b4: fist and forearm vs the whole head shape (0 when they overlap)
const headGap = (L, q) => { const H = headPoly(L), P = nearParts(L, q);
  if ([...edge(P.fist), ...edge(P.fore)].some(s => pip(s, H)) || edge(H).some(s => pip(s, P.fist) || pip(s, P.fore))) return 0;
  return Math.min(pd(P.fist, H), pd(H, P.fist), pd(P.fore, H), pd(H, P.fore)); };
// shoot.cjs "Grip close-up over 41 phases": the far fist in the zoom-1 camera vs the inset (x 214-348, y 10-110.1)
const insetOverlap = (L, X, p, q) => { const f = X.far(p, q), F = X.FS0;
  const t = mul(mul(about(F, T(f.S[0] - F[0], f.S[1] - F[1]), R(f.au)), about([F[0], F[1] + 38], T(0, -(1 - f.fu) * LEN.upperArm), R(f.af - f.au))), T(0, -(1 - f.ff) * LEN.forearm));
  const z = SIDE.fist.base.map(([x, y]) => ap(t, [x + F[0], y + F[1] + 62])).map(([x, y]) => [179 + 1.55 * (x - 163), 138 + 1.55 * (y - 119)]);
  const xs = z.map(v => v[0]), ys = z.map(v => v[1]);
  return Math.min(Math.min(Math.max(...xs), 348) - Math.max(Math.min(...xs), 214), Math.min(Math.max(...ys), 110.125) - Math.max(Math.min(...ys), 10)); };

// ---- the parameter vector: PX (5), PV as 6 positive increments, IN0, B0, SK, PC (2 x 3) ----
const base = m.LP_OPT, nI = base.PX.length, nW = nI + 1;
const encode = o => { const inc = o.PV.map((v, i) => v - (i ? o.PV[i - 1] : 0)).concat(1 - o.PV[nI - 1]); return [...o.PX, ...inc, o.IN0, o.B0, o.SK, ...o.PC.flat()]; };
const decode = v => { const w = v.slice(nI, nI + nW).map(x => Math.abs(x) + 1e-4), tot = w.reduce((a, b) => a + b, 0); let c = 0; const PV = [];
  for (let k = 0; k < nI; k++) { c += w[k] / tot; PV.push(c); }
  const [IN0, B0, SK, ...pc] = v.slice(nI + nW); return { ...base, PX: v.slice(0, nI), PV, IN0, B0, SK, PC: [pc.slice(0, 3), pc.slice(3, 6)], TAB: 400 }; };
const SCALE = [...Array(nI).fill(3), ...Array(nW).fill(0.2), 1.5, 4, 0.3, ...Array(6).fill(0.15)];
const HS = (() => { const H = headPoly(m.LP); return { yTop: Math.min(...H.slice(FACE.top[0], FACE.top[1] + 1).map(p => p[1])), yChin: H[FACE.chin][1] }; })();
const dip = s => { const mx = Math.max(...s); let w = 0, pre = -1; const suf = []; let mm = -1; for (let i = s.length - 1; i >= 0; i--) { mm = Math.max(mm, s[i]); suf[i] = mm; } for (let j = 0; j < s.length; j++) { if (j > 0 && j < s.length - 1) w = Math.max(w, Math.min(pre, suf[j + 1]) - s[j]); pre = Math.max(pre, s[j]); } return mx ? w / mx : 0; };

function score(v) {
  const o = decode(v);
  if (o.IN0 < 169.5 || o.IN0 > 171 || o.B0 < 92 || o.B0 > 130 || o.SK < 1.5 || o.SK > 6) return { u: 1e9 };
  let L; try { L = m.makeLP(14, o); } catch (e) { return { u: 1e9 }; }
  let pen = 0; const why = {};
  const X = m.extrasOf(L);
  let wi = -9, wf = 9, wh = 9;
  for (let i = 0; i <= 160; i++) { const p = i / 160, q = L.pose(p);
    if (q.G[0] > 166 || q.G[0] < L.X0 - 0.5) pen += 1;
    const ov = insetOverlap(L, X, p, q); wi = Math.max(wi, ov); if (ov > -0.6) pen += (ov + 0.6) * 0.5;
    if (q.G[1] >= HS.yTop - 0.5 && q.G[1] <= HS.yChin + 0.5) { const fc = faceClear(L, q); wf = Math.min(wf, fc); if (fc < 1.2) pen += (1.2 - fc) * 0.5; }
    if (i % 2 === 0 && p < 0.7) { const hg = headGap(L, q); wh = Math.min(wh, hg); if (hg < 0.45) pen += (0.45 - hg) * 0.5; } }
  Object.assign(why, { inset: +wi.toFixed(2), face: +wf.toFixed(2), head: +wh.toFixed(2) });
  const q0 = L.pose(0), t2 = L.pose(0.5), ins = [], fus = [];
  for (let i = 0; i <= 100; i++) { const q = L.pose(i / 100); ins.push(q.inside); fus.push(q.fu); }
  for (let i = 1; i < 95; i++) if (ins[i] > ins[i - 1]) pen += (ins[i] - ins[i - 1]) * 2;
  const net = ins[100] - Math.min(...ins); if (net > 0.2) pen += (net - 0.2) * 5;
  if (q0.elev < 162.3) pen += (162.3 - q0.elev) * 0.3;
  const top2d = deg(Math.acos(((q0.E[0] - q0.S[0]) * L.TD[0] + (q0.E[1] - q0.S[1]) * L.TD[1]) / Math.hypot(q0.E[0] - q0.S[0], q0.E[1] - q0.S[1]) / Math.hypot(L.TD[0], L.TD[1])));
  if (top2d < 165.5) pen += (165.5 - top2d) * 0.2;
  const fv = Math.abs(deg(Math.atan2(t2.G[0] - t2.E[0], t2.E[1] - t2.G[1]))), eb = t2.E[1] - t2.G[1], t2g = headGap(L, t2);
  if (fv > 14) pen += (fv - 14) * 0.1; if (eb < 31) pen += (31 - eb) * 0.1; if (t2g < 3.6) pen += (3.6 - t2g) * 0.5;
  if (Math.min(...fus) < 0.58) pen += (0.58 - Math.min(...fus)) * 5;
  // every joint's speed per keyframe gap rises once and falls once per phase (gen.mjs smoothness, shoot.cjs checks it)
  const st = m.SAMPLES.map(pc => { const p = m.progressOf(pc / 100), q = L.pose(p), f = X.far(p, q), a = [q.S[0] - q.E[0], q.S[1] - q.E[1]], b = [q.G[0] - q.E[0], q.G[1] - q.E[1]];
    return { pc, v: [q.ua, q.fa, f.au, f.af - f.au, deg(Math.acos((a[0] * b[0] + a[1] * b[1]) / Math.hypot(...a) / Math.hypot(...b)))], pts: [q.E, f.E, q.G] }; });
  let wd = 0;
  for (const [a, b] of [[0, 25], [37.5, 87.5]]) { const idx = st.map((s, i) => i).filter(i => i > 0 && st[i].pc > a + 1e-9 && st[i].pc <= b + 1e-9);
    for (let k = 0; k < 5; k++) wd = Math.max(wd, dip(idx.map(i => Math.abs(st[i].v[k] - st[i - 1].v[k]) / (st[i].pc - st[i - 1].pc))));
    for (let k = 0; k < 3; k++) wd = Math.max(wd, dip(idx.map(i => Math.hypot(st[i].pts[k][0] - st[i - 1].pts[k][0], st[i].pts[k][1] - st[i - 1].pts[k][1]) / (st[i].pc - st[i - 1].pc)))); }
  if (wd > 0.012) pen += (wd - 0.012) * 20;
  // the smoothness numbers themselves, as the browser measures them
  const r = m.smoothNumbers(L, X), P = r.phases, terms = [r.d.v / LIM.d];
  for (const ph of ['lift', 'return']) for (const row of P[ph].rows) if (row.gate) { terms.push(row.a / LIM.a, row.b / LIM.b); if (row.c !== null) terms.push(row.c / LIM.c); }
  const worst = Math.max(...terms), soft = Math.pow(terms.reduce((s, t) => s + t ** 12, 0), 1 / 12);
  return { u: soft + pen, worst, pen, why, o, r };
}

// ---- CMA-ES (full covariance) ----
function cmaes(f, n, sigma, gens, seed, log) {
  const lambda = 14, mu = 7; let w = Array.from({ length: mu }, (_, i) => Math.log(mu + 0.5) - Math.log(i + 1)); const ws = w.reduce((a, b) => a + b, 0); w = w.map(x => x / ws);
  const mueff = 1 / w.reduce((a, b) => a + b * b, 0), cc = (4 + mueff / n) / (n + 4 + (2 * mueff) / n), cs = (mueff + 2) / (n + mueff + 5), c1 = 2 / ((n + 1.3) ** 2 + mueff);
  const cmu = Math.min(1 - c1, (2 * (mueff - 2 + 1 / mueff)) / ((n + 2) ** 2 + mueff)), damps = 1 + 2 * Math.max(0, Math.sqrt((mueff - 1) / (n + 1)) - 1) + cs, chiN = Math.sqrt(n) * (1 - 1 / (4 * n) + 1 / (21 * n * n));
  let r = seed; const rand = () => (r = (r * 16807) % 2147483647) / 2147483647, randn = () => Math.sqrt(-2 * Math.log(Math.max(1e-12, rand()))) * Math.cos(2 * Math.PI * rand());
  const I = () => Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)));
  let mean = Array(n).fill(0), pc = Array(n).fill(0), ps = Array(n).fill(0), C = I(), B = I(), D = Array(n).fill(1), best = { ...f(mean), x: [...mean] };   // never worse than the start
  const eig = () => { const A = C.map(row => [...row]), V = I();
    for (let sw = 0; sw < 50; sw++) { let off = 0; for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) off += A[p][q] ** 2; if (off < 1e-20) break;
      for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) { if (Math.abs(A[p][q]) < 1e-15) continue;
        const th = (A[q][q] - A[p][p]) / (2 * A[p][q]), t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1)), c = 1 / Math.sqrt(t * t + 1), s = t * c;
        for (let k = 0; k < n; k++) { const x = A[k][p], y = A[k][q]; A[k][p] = c * x - s * y; A[k][q] = s * x + c * y; }
        for (let k = 0; k < n; k++) { const x = A[p][k], y = A[q][k]; A[p][k] = c * x - s * y; A[q][k] = s * x + c * y; }
        for (let k = 0; k < n; k++) { const x = V[k][p], y = V[k][q]; V[k][p] = c * x - s * y; V[k][q] = s * x + c * y; } } }
    B = V; D = A.map((row, i) => Math.sqrt(Math.max(1e-20, row[i]))); };
  for (let g = 0; g < gens; g++) {
    const pop = [];
    for (let k = 0; k < lambda; k++) { const z = Array.from({ length: n }, randn), y = B.map(row => row.reduce((s, b, j) => s + b * D[j] * z[j], 0)), x = mean.map((v, i) => v + sigma * y[i]), e = f(x);
      pop.push({ x, y, u: e.u }); if (e.u < best.u) best = { ...e, x }; }
    pop.sort((a, b) => a.u - b.u);
    const old = mean; mean = Array(n).fill(0); for (let i = 0; i < mu; i++) for (let j = 0; j < n; j++) mean[j] += w[i] * pop[i].x[j];
    const yw = mean.map((x, j) => (x - old[j]) / sigma), bt = B[0].map((_, j) => B.reduce((s, row, i) => s + row[j] * yw[i], 0) / D[j]), ci = B.map(row => row.reduce((s, b, j) => s + b * bt[j], 0));
    ps = ps.map((p, i) => (1 - cs) * p + Math.sqrt(cs * (2 - cs) * mueff) * ci[i]);
    const psn = Math.hypot(...ps), hs = psn / Math.sqrt(1 - (1 - cs) ** (2 * (g + 1))) / chiN < 1.4 + 2 / (n + 1) ? 1 : 0;
    pc = pc.map((p, i) => (1 - cc) * p + hs * Math.sqrt(cc * (2 - cc) * mueff) * yw[i]);
    for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { let rk = 0; for (let k = 0; k < mu; k++) rk += w[k] * pop[k].y[i] * pop[k].y[j]; C[i][j] = (1 - c1 - cmu) * C[i][j] + c1 * (pc[i] * pc[j] + (1 - hs) * cc * (2 - cc) * C[i][j]) + cmu * rk; }
    sigma = Math.min(3, sigma * Math.exp((cs / damps) * (psn / chiN - 1))); eig();
    if (g % 25 === 0) log(g, best, sigma);
  }
  return best;
}

const v0 = encode(base), act = SCALE.map((s, i) => i), full = z => v0.map((v, i) => v + z[i] * SCALE[i]);
const start = score(v0);
console.log(`start: score ${start.u.toFixed(3)}, worst ${start.worst.toFixed(3)} of the margined limits, penalty ${start.pen.toFixed(3)} ${JSON.stringify(start.why)}`);
const best = cmaes(z => score(full(z)), act.length, 0.3, GENS, SEED, (g, b, s) => console.log(`generation ${g}: score ${b.u.toFixed(3)}, worst ${b.worst.toFixed(3)}, penalty ${b.pen.toFixed(3)} ${JSON.stringify(b.why)}, sigma ${s.toFixed(3)}`));
const r4 = x => +x.toFixed(4), o = best.o;
console.log(`best: score ${best.u.toFixed(3)}, worst ${best.worst.toFixed(3)} of the margined limits, penalty ${best.pen.toFixed(3)} ${JSON.stringify(best.why)}`);
console.log(m.smLine(best.r));
console.log(`LP_OPT fields: IN0: ${r4(o.IN0)}, B0: ${r4(o.B0)}, SK: ${r4(o.SK)},\n  PX: [${o.PX.map(r4).join(', ')}],\n  PV: [${o.PV.map(v => +v.toFixed(5)).join(', ')}],\n  PC: [[${o.PC[0].map(r4).join(', ')}], [${o.PC[1].map(r4).join(', ')}]],`);
