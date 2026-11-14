// LIB-PLATEFIX-4 item 20b (ruling D-PF4-20B, #410 6750587189; W4 L5 critics c2, c3, #391 6653540190): on the lb02 plates
// page (spec specs/incline_dumbbell_press__lb2.mjs) the Mistake's low back reads lifted off the pad. Measured on what the
// engine draws, at the render's camera (plate px). The lb02 plate renders 358 CSS px wide for its 358-unit viewBox at a
// 390-420 px viewport (1.00 CSS px per plate px) and 328 CSS px at 360 px (0.92), so the critics' "15-20 CSS px" gap is
// held as >= 16.5 plate px (15 CSS px on a 360 px phone; the ruling's floor is 12).
//  - The 'Off the pad' leader ends on the red dashed Wrong back line (<= 0.5 px), that point is >= 16.5 px off the pad
//    line, clear of the near upper arm (>= 3 px outside its outline), and the gap from it to the pad is not under the arm.
//  - No point of the dashed Wrong back lies inside the near arm (c3 "keep it clear of the arm").
//  - The gap fill is drawn over the solid trunk and under the near arm, and covers the gap at the leader's end.
//  - The belly (HIPS TIPPING) line: the Mistake torso's front from the hip joint to where it rejoins the solid chest is
//    >= 3 px outside the solid torso outline, away from its two joins (4 px each, along the pad).
//  - Seat, upper back (shoulders), buttock on the pads and the head never inside the pad (the spec's checks).
// Red on the base (claude/lib-platefix-4 fd274f59): the leader ended mid gap marker (8.05 px off the pad, 6.97 px off the
// dashed back), 7 dashed back points lay under the upper arm and the gap fill was drawn over the arm. The belly line was
// already 3.94 px clear on the base (unchanged; held here so the fix cannot lose it). Every other lb02 plate, and every incline_dumbbell_press fragment
// but the Mistake svg and overlay, stay byte-equal to the base page; on the lb02 layers page the card outside its plate
// (its bench-angle close-up included) stays byte-equal.
import { createHash } from 'node:crypto';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { pf4Lb02Spec } from './checks/ship-w8b';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
let plate: any, body: any, eq: any, qe: any, golden: any, M: any, S: any;
beforeAll(async () => {
  [plate, body, eq, qe, golden, M] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs',
    'qa/engine.mjs', '../golden.mjs', 'specs/incline_dumbbell_press__lb2.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, T);

type V = number[];
const GAP_MIN = 16.5, ARM_CLEAR = 3, BELLY_MIN = 3, JOIN = 4, MASK = 1.75;   // MASK: half the engine's 3.5 px Mistake mask stroke
const segD = (p: V, a: V, b: V) => { const u = [b[0]! - a[0]!, b[1]! - a[1]!], l2 = u[0]! ** 2 + u[1]! ** 2, t = l2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * u[0]! + (p[1]! - a[1]!) * u[1]!) / l2)) : 0;
  return Math.hypot(p[0]! - a[0]! - t * u[0]!, p[1]! - a[1]! - t * u[1]!); };
const offPoly = (p: V, t: V[]) => Math.min(...t.map((a, i) => segD(p, a, t[(i + 1) % t.length]!)));
const offLine = (p: V, t: V[]) => Math.min(...t.slice(1).map((b, i) => segD(p, t[i]!, b)));
const inside = (p: V, t: V[]) => { let c = false; for (let i = 0, j = t.length - 1; i < t.length; j = i++) { const a = t[i]!, b = t[j]!;
  if ((a[1]! > p[1]!) !== (b[1]! > p[1]!) && p[0]! < (b[0]! - a[0]!) * (p[1]! - a[1]!) / (b[1]! - a[1]!) + a[0]!) c = !c; } return c; };
const dens = (t: V[], closed = true, n = 10) => (closed ? t : t.slice(0, -1)).flatMap((a, i) => { const b = t[(i + 1) % t.length]!;
  return Array.from({ length: n }, (_, k) => [a[0]! + (b[0]! - a[0]!) * k / n, a[1]! + (b[1]! - a[1]!) * k / n]); });

/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf4i', mistake: true }), cam = qe.cameraOf(spec, r.report);
  const L = qe.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec);
  const shapes = (pose: string) => body.bodyShapes(body.fk(L.q[pose], { height: 1.75 }), cam);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  // the pad face line (the spec's upper-back check plane), px; padPx > 0 on the body's side
  const pl = spec.checks.find((c: any) => c.landmark === 'backUpper').plane, n = pl.normal;
  const A = cam.P(pl.point), B = cam.P([0, pl.point[1] + n[2], pl.point[2] - n[1]]), u = [B[0] - A[0], B[1] - A[1]], ul = Math.hypot(u[0]!, u[1]!);
  const side = Math.sign(((cam.P(pl.point.map((v: number, i: number) => v + n[i] * 0.1))[0] - A[0]) * u[1]! - (cam.P(pl.point.map((v: number, i: number) => v + n[i] * 0.1))[1] - A[1]) * u[0]!));
  const padPx = (p: V) => side * ((p[0]! - A[0]) * u[1]! - (p[1]! - A[1]) * u[0]!) / ul;
  const along = (p: V) => ((p[0]! - A[0]) * u[0]! + (p[1]! - A[1]) * u[1]!) / ul;
  const foot = (p: V): V => { const d = padPx(p) * side / ul; return [p[0]! - d * u[1]!, p[1]! + d * u[0]!]; };
  // the dashed Wrong back line (the one dashed guide of more than two points) and the 'arch' leader as drawn
  const curves = spec.mistake.guides.filter((g: any) => g.kind === 'dashed' && g.pts.length > 2);
  const back: V[] = curves.length === 1 ? curves[0].pts.map((p: any) => qe.resolvePoint(p, 'mistake', L.lm, cam)) : [];
  const tell = spec.mistake.tells.find((t: any) => t.key === 'arch'), anchor: V = qe.resolvePoint(tell.anchor, 'mistake', L.lm, cam);
  const leaders: V[] = [...r.svg.matchAll(/<path class="leader m" d="M(-?[\d.]+) (-?[\d.]+)/g)].map((m: any) => [+m[1], +m[2]]);
  const end = leaders.reduce((b: V | null, p) => (!b || Math.hypot(p[0]! - anchor[0]!, p[1]! - anchor[1]!) < Math.hypot(b[0]! - anchor[0]!, b[1]! - anchor[1]!) ? p : b), null)!;
  const arm: V[][] = shapes('end').filter((s: any) => s.group === 'near').map((s: any) => s.poly);
  const armOff = (p: V) => (arm.some(t => inside(p, t)) ? -1 : 1) * Math.min(...arm.map(t => offPoly(p, t)));
  const gapSeg = dens([end, foot(end)], false, 20);
  // the gap fill: the end layer's poly from the first back point, between the solid trunk and the near arm in z
  const pe = r.svg.slice(r.svg.indexOf('<g class="pose-end">'), r.svg.indexOf('<g class="m-pose"'));
  const fills = [...pe.matchAll(/<path class="eq" d="(M[^"]+Z)"/g)].map((m: any) => ({ at: m.index, pts: m[1].slice(1, -1).split('L').map((s: string) => s.split(' ').map(Number)) }));
  const fill = fills.find(f => f.pts.length > 10 && Math.min(...back.map(p => offPoly(p, f.pts))) < 0.6);
  const zTorso = pe.indexOf('href="#pf4i-e-torso"'), zArm = pe.indexOf('href="#pf4i-e-upper.r"');
  // the belly: the Mistake torso's front (the side away from the pad), from the hip joint up to where it rejoins the solid chest
  const tM: V[] = shapes('mistake').find((s: any) => s.key === 'torso').poly, tE: V[] = shapes('end').find((s: any) => s.key === 'torso').poly;
  const depth = Math.max(...tM.map(padPx)), hipA = along(P('mistake', 'hip.r')), shA = along(P('mistake', 'shoulder.r')), dirA = Math.sign(shA - hipA);
  const out = (p: V) => (inside(p, tE) ? -1 : 1) * offPoly(p, tE);
  const front = dens(tM).filter(p => padPx(p) > depth / 2 && (along(p) - hipA) * dirA >= 0 && (along(p) - shA) * dirA <= 0)
    .sort((a, b) => (along(a) - along(b)) * dirA);
  const peakI = front.reduce((b, p, i) => (out(p) > out(front[b]!) ? i : b), 0);
  const joinI = front.findIndex((p, i) => i > peakI && out(p) < MASK), joinA = joinI < 0 ? shA : along(front[joinI]!);
  const belly = front.filter(p => (along(p) - hipA) * dirA >= JOIN && (joinA - along(p)) * dirA >= JOIN);
  return { r, end, anchor, back, leaderOnCurve: back.length ? offLine(end, back) : Infinity, gapPx: padPx(end), armOff: armOff(end),
    gapUnderArm: gapSeg.filter(p => arm.some(t => inside(p, t))).length, backUnderArm: back.filter(p => arm.some(t => inside(p, t))).length,
    fill, zTorso, zArm, fillCoversGap: fill ? gapSeg.slice(1, -1).every(p => inside(p, fill.pts) || offPoly(p, fill.pts) < 0.6) : false,
    belly, bellyMin: belly.length ? Math.min(...belly.map(out)) : -Infinity, bellySpan: belly.length ? Math.abs(along(belly[belly.length - 1]!) - along(belly[0]!)) : 0 };
};
const problems = (m: any): string[] => {
  const bad: string[] = [];
  if (m.back.length < 3) bad.push('no single dashed Wrong back line');
  if (!(m.leaderOnCurve <= 0.5)) bad.push(`leader end ${m.leaderOnCurve.toFixed(2)} px off the dashed back`);
  if (!(m.gapPx >= GAP_MIN)) bad.push(`gap at the leader end ${m.gapPx.toFixed(2)} px < ${GAP_MIN}`);
  if (!(m.armOff >= ARM_CLEAR)) bad.push(`leader end ${m.armOff.toFixed(2)} px from the upper arm outline (< ${ARM_CLEAR})`);
  if (m.gapUnderArm) bad.push(`${m.gapUnderArm} gap samples under the arm`);
  if (m.backUnderArm) bad.push(`${m.backUnderArm} dashed back points under the arm`);
  if (!m.fill) bad.push('no gap fill under the dashed back');
  else {
    if (!(m.fill.at > m.zTorso && m.fill.at < m.zArm)) bad.push('gap fill not between the solid trunk and the near arm');
    if (!m.fillCoversGap) bad.push('gap fill does not cover the gap at the leader end');
  }
  if (!(m.bellyMin >= BELLY_MIN)) bad.push(`belly line ${m.bellyMin.toFixed(2)} px from the solid outline (< ${BELLY_MIN})`);
  if (!(m.bellySpan >= 30)) bad.push(`belly line spans ${m.bellySpan.toFixed(1)} px`);
  return bad;
};
const withTell = (spec: any, anchor: any) => ({ ...spec, mistake: { ...spec.mistake, tells: spec.mistake.tells.map((t: any) => (t.key === 'arch' ? { ...t, anchor } : t)) } });
const withBack = (spec: any, pts: any) => ({ ...spec, mistake: { ...spec.mistake, guides: spec.mistake.guides.map((g: any, i: number) => (i === 0 ? { ...g, pts } : g)) } });

describe('PF4 item 20b: incline_dumbbell_press (lb02) Mistake low back lifted off the pad', { timeout: T }, () => {
  let m: any;
  beforeAll(() => {
    m = measure(S);
    console.log(`PF4 20b: leader end ${m.end.map((v: number) => v.toFixed(1))}, on curve ${m.leaderOnCurve.toFixed(2)} px, gap ${m.gapPx.toFixed(2)} px, arm ${m.armOff.toFixed(2)} px; `
      + `belly min ${m.bellyMin.toFixed(2)} px over ${m.bellySpan.toFixed(1)} px; info ${JSON.stringify(M.mistakeInfo())}`);
  }, T);
  it('the leader ends on the dashed Wrong back, >= 16.5 px off the pad, clear of the upper arm; the dashed back and the gap stay off the arm; the fill clears the gap', () => {
    expect(problems(m)).toEqual([]);
  });
  it('seat, upper back and buttock on the pads, the head never inside the pad, no engine issue (c4, c8)', () => {
    const rep = m.r.report;
    expect(rep.issues).toEqual([]);
    for (const k of ['seat', 'backUpper', 'buttock']) expect(rep.checks.find((c: any) => c.landmark === k && c.pose === 'mistake').cm, k).toBeLessThanOrEqual(1);
    expect(Math.abs(M.mistakeInfo().buttockGapCm)).toBeLessThanOrEqual(0.1);
  });
  it('mutation: the base\'s leader (the middle of the gap marker) is red: off the curve and under 16.5 px', () => {
    const [g] = S.mistake.guides.filter((x: any) => x.kind === 'dashed' && x.pts.length === 2), mid = g.pts[0].map((v: number, i: number) => (v + g.pts[1][i]) / 2);
    const p = problems(measure(withTell(S, mid)));
    expect(p.some(b => /off the dashed back/.test(b))).toBe(true);
    expect(p.some(b => /gap at the leader end/.test(b))).toBe(true);
  });
  it('mutation: the leader on the back line near the buttock (on the curve, a small gap) is red on the gap only', () => {
    const pts = S.mistake.guides[0].pts, p = problems(measure(withTell(S, pts[pts.length - 4])));
    expect(p.length).toBeGreaterThan(0);
    expect(p, JSON.stringify(p)).toEqual([expect.stringMatching(/gap at the leader end/)]);
  });
  it('mutation: the whole back outline from the upper back (under the arm), leader at its start, is red on the arm', () => {
    const all = M.archInfo().archPts, p = problems(measure(withTell(withBack(S, all), all[3])));
    expect(p.some(b => /dashed back points under the arm/.test(b))).toBe(true);
    expect(p.some(b => /from the upper arm outline/.test(b))).toBe(true);
  });
  it('mutation: the gap fill drawn in front (over the arm, the base\'s z) is red', () => {
    const eqm = S.equipment.map((it: any) => (typeof it === 'function' ? (lm: any, ctx: any) => { const r = it(lm, ctx);
      return Array.isArray(r) ? r.map((x: any) => (x.part === 'archgap' ? { ...x, z: 'front' } : x)) : r; } : it));
    expect(problems(measure({ ...S, equipment: eqm }))).toEqual(['gap fill not between the solid trunk and the near arm']);
  });
  it('mutation: the Mistake trunk at the Right\'s pelvis, trunk and neck puts the belly on the solid outline (red)', () => {
    const e = S.poses.end, p = problems(measure({ ...S, mistake: { ...S.mistake, pose: { ...S.mistake.pose, root: e.root, trunk: e.trunk, neck: e.neck } } }));
    expect(p.some(b => /belly line/.test(b))).toBe(true);
  });
});

describe('PF4 item 20b: the rest of the lb02 pages is byte-equal to the base', { timeout: T }, () => {
  // golden.mjs fragmentsOf on the base lb02 plates page (claude/lib-platefix-4 fd274f59, `howto-rebuild --page
  // tests/howto/golden/library/lb02.json page`, sha 10fd1ae0…7a7b).
  const BASE: Record<string, Record<string, string>> = {
    'barbell-bench-press': { normalSvg: '9f7d1cdb09324e3735986707a561170300e0d4531ee31cca5c128af3786951a2', normalOverlay: '6f45346858c760270c415964692657b5cf9e5c7836ef1cba7b97c893dc433747', mistakeSvg: '1447faac437a1ae5c8481d24c3c10238d7820e527badd1bd04b275a7c518bc03', mistakeOverlay: 'c7403316df89a677b7448c93c5cfda192265f8c4bfb64e64ff88a26fcdb6e5e3', tells: 'bd868d4278607daeaee09ec6a6447a465e335d085b35f7929d3846f344d8b152', tempo: 'cf63e40e037e0f8d1a9cf327745c129b5c27ce48afc4412b42ae8d2061e8f7db', cues: 'd72f66345992958c68680fc0208ceb4e92864c127f64155a469d052e896ad3a1', alt: '9e2ecf70abd407571cb624f9cec405614f2b83f282f3e50e6eace1d1efbc07dc', mistakeAlt: '73968921ac23260dfc6ff4ed9a0b7c8dfa59a2c999f3b87fa06d3ce08f5a659a' },
    'incline-barbell-bench-press': { normalSvg: 'e0c215d026128efdeaa9b219cfbde20639a731309c6471c05c3d76b64eeb5882', normalOverlay: '3c0d76f6c303a15e4dc07a65dfad39202001bdfd1a4482a968c93b91825a7477', mistakeSvg: '4b57b8b878f22ba17e7d28a2e94df3b98a3a034a8d4c6329dd7884a8d86e81d0', mistakeOverlay: '0b0e5057efa6eae2b07919f1d2a7a69282074883dbf3db6db345ff9405b193e6', tells: 'b33501ba966622809baaa9c887c11cd888feecfba1fdb5573c0a3ba3e7829d0e', tempo: '9af9e6552a529e3708cf8dafa367dc90b5d5d8b5b1f51cedaf88fe48e65d10d8', cues: 'b3ab76c02e9333eb59b20727b35fd925d4edea0f9ecdcd8a106662418b02f8ce', alt: 'c6b17c3ad1fb1ddbf3feed4f72f211f49c5600ddc3106d020186782cab638b1f', mistakeAlt: '2072bc25a161c63c7b003833845afef7194bed9b88098050ab013dbe4cc471f1' },
    'incline-dumbbell-press': { normalSvg: 'fc08cf61a71657c62ef83b989a6103ba5c01be4fb9c932fb4fe21de1c13861c6', normalOverlay: '4c218628d55b709c9be4048c006380778e4d114963c4009823bc2810bfa79a94', tells: '8c5aa86dd3fea225b280a7071583450c25e3fcc715cfe8e250831fbb66ff315c', tempo: '9af9e6552a529e3708cf8dafa367dc90b5d5d8b5b1f51cedaf88fe48e65d10d8', cues: '2ee73dd579633223b173cc9e00f4b5cd27ecdbc0aaa808813e798c753a7f0e3b', alt: 'b4983466e159517be873ff0cbfe04a0dc72ba3cfca0f9ffe05be5291f92b606f', mistakeAlt: '53db254eeb326efd40c65dbcdf02a0596bb083b97168ac5ebcdd2d6722187888' },
    'close-grip-bench-press': { normalSvg: 'eec591ee2b7e346efceae10cfe5915799afb0341459c9dea6299839d2190b5ea', normalOverlay: 'bbdc71a97a86ccaeb2e1fb2b694259ddcf33b8469eadecd7514a59060832a257', mistakeSvg: 'c435a526654fe95f779b050add31a00423075b3665dcdf4171d10a8e5080e337', mistakeOverlay: '5eb11f278003d355d8da3271547937f46e1a4c7ed4aa43b5fa45166589d0bc5e', tells: '17f4e0006cb5f40ffbe8b0e6462ea91e18593fc4ee9526053ec5bf0bde35cfc4', tempo: '9af9e6552a529e3708cf8dafa367dc90b5d5d8b5b1f51cedaf88fe48e65d10d8', cues: '97f4d59f8e0d09bb02083f3c6f4fa1546b66ab4094def83460efdd708169bc82', alt: 'ccc2187c290d3625852c7dc286dc0cf64a477db5a19593616500bebf019cc0ed', mistakeAlt: 'dab9d1be69327bf751ad83e4055e3826c7382145cf840c73cac0d1f9bcb79a5d' },
    'decline-bench-press': { normalSvg: '778e460acbe81ce8d6556f7c8067c458aa9a77460caf68f0213be267cbaf5f33', normalOverlay: '43cd13fdc53adba9c92ee1f2604e3d3532a8e09088dcf880b892f01bc0e55cd8', mistakeSvg: '563b1230aa3bbbe6c8d14c68517e4b24f668bb8d4eb774065bda1c106bb03ce2', mistakeOverlay: 'd89ff0709043ecf0cdc6191e87011b7f7dcfdcd0335554dfce51955b5b1c7368', tells: '8d16995c746deccf14b7239d86641a9bb57dad6e8c3ce47d167ef41ab11767ad', tempo: 'c7b84bd29aff9986297fb581aa2e2f08eacbab46e263262db094b59e480d6e7b', cues: '9a9709f238d1b5af4ba8dbf55927dad4ce67794bd064d51cef93484a88bafc5c', alt: '04b2961cbea3d20814dea2d1bff819429eca240a89354d9e18b8811c662d02a3', mistakeAlt: '38769c94923b9cf1f7b30fe6925369b5f1fa02a65c62f39efa41e61cd08766dd' },
    'arnold-press': { normalSvg: '8d8c3a1a73b9abecee665cee3f2a5b47fad258695559c5a67c1dc33f6f28bc5e', normalOverlay: 'e1c4c212fc691ce0487df1405d2da95c8f79c7c496167395719da96ded6c1864', mistakeSvg: 'a6ce58419b32a0cb50870f4f4bcf63935d56105bc4c74691f3a69cb483de1100', mistakeOverlay: '296dfdbf4545871f4237ff93e2dc9b95573ffb1a1725be7b55ee5d0d6b33ca68', tells: '8043dbf511d1b0e0c9474664c86345f958771550ec1201462fe592e9ff13633c', tempo: '7e32c0e848a9e6ce971b689bf96058ea943956570433e96247d364eb475c7aff', cues: '0dd9930f3d36f2b87ea77d58d29bee845384d6d5a89db000aed4694b67d6394e', alt: '857b3ddf845c3abb8b9499fcd9d2d4bbf2640492f6fada94e35e68de7dce38aa', mistakeAlt: '1b5635f2ae58632d4e449487815ac91159feebd2f4031f2efdf0e2e7a4f67a62' },
    'skull-crusher': { normalSvg: 'b52bcdb5b11e83e820da96745fbf92fc39933e4b6c0b0bdb6d2470eb97f8a63a', normalOverlay: '978a8db0add8ec69d473487b0416849a0a6687ec29f59faaf8447a1be1cd547a', mistakeSvg: 'd1e332d02835bddf5370e2fa1ac669abd2386c89cea6fb6989e16c0d2872639f', mistakeOverlay: '548c678cab26d3976927a5571b509f542f2dba3b240181628ca867f1f093e8b8', tells: '8c8af8a333e0b5835b38074cd83c5f8e1a70d9cc83192d8b0af30468e2eb119f', tempo: '35068615b6ee188a97b21e3ff5e61b750234ce1c6098c76536579ce86e6f34b9', cues: '062ac8fe49adba832dc876ebd8f0f646b1060df6546a398a7cdd51aa6b5711cb', alt: '93c340d28923344a382e1551761eae3d5f98a9cd0fb391b091827c43dedaf18b', mistakeAlt: '8ec38d107cc0443abc293adb8e580c2e6b9b28b6b416ad9404c95c58877986b5' },
    'dumbbell-pullover': { normalSvg: '57f52446bbdee88a4b14dd88b75f452ae4db2f8e038e59a672cf45571838dbb9', normalOverlay: 'da2e86be081bbaeb39d9a2301993698ee635410c1bfb50ee99e3f3466812c88d', mistakeSvg: '949d154e4f4c46d646062ac57e010ec469dd4aed1e84f41702c3bc511a5f7831', mistakeOverlay: 'b3f7a7054235aa1e208aeff99b090916218f9ef86b01cd120f60590ed0d9b9da', tells: 'f96db77cd0c3cf237c5313a865403a843069bf2858d26d5419179abdb52c0fe1', tempo: '6d54e989adeb68a11dee835225371ccc6f605797fdeff858e574210cc4f2b219', cues: '865ab47ce0f0681aa8b4b8a0f59c8af95f57565b0581c9441b1b8cdfdc4e6d81', alt: '89ab1ef768810ff9f301af89e3e100597b3f406bf6c6b89446c80c4c141e58ea', mistakeAlt: 'd9e43d7efbfb550f0e7fd4ab56bec66b6135f2f8a4ec2a6db4f8fbedcc69034a' },
  };
  const BASE_IDP_MISTAKE = { mistakeSvg: '82ca215903e5fc8d7996d4e5b5d7fb3e2ac9af8bc793a2bdbc46822e0157c399', mistakeOverlay: 'afcdd9bac0baca9100f5cf646d9c921301085d3870ab5df5d8c03fd738979eb0' };
  let html = '';
  beforeAll(async () => {
    const { buildPlatesPage } = await import(/* @vite-ignore */ lib('build-page.mjs'));
    const { pageConfig } = await import(/* @vite-ignore */ lib('plates-page.mjs'));
    const { rows, batchGoldenOf } = await import(/* @vite-ignore */ lib('registry.mjs'));
    const all = rows(), row = all.find((r: any) => r.batchFile && batchGoldenOf(r.batchFile) === 'tests/howto/golden/library/lb02.json');
    html = (await buildPlatesPage(await pageConfig(row.pages.plates, all))).html.toString('utf8');
  }, T);
  const fragProblems = (h: string) => {
    const ps = golden.extractPlates(h), bad: string[] = [];
    if (ps.map((p: any) => p.chromeId).sort().join() !== Object.keys(BASE).sort().join()) bad.push(`plates ${ps.map((p: any) => p.chromeId).join()}`);
    for (const [c, want] of Object.entries(BASE)) { const p = ps.find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
      for (const k of Object.keys(want)) if (got[k] !== want[k]) bad.push(`${c} ${k}`); }
    return bad;
  };
  it('the other 7 plates\' fragments and 7 of incline_dumbbell_press\'s equal the base; its Mistake svg and overlay are the ones that moved', () => {
    expect(fragProblems(html)).toEqual([]);
    const f = golden.fragmentsOf(golden.extractPlates(html).find((x: any) => x.chromeId === 'incline-dumbbell-press'));
    expect(f.mistakeSvg).not.toBe(BASE_IDP_MISTAKE.mistakeSvg);
    expect(f.mistakeOverlay).not.toBe(BASE_IDP_MISTAKE.mistakeOverlay);
  });
  it('mutation: one byte changed in arnold_press\'s Mistake alt is red', () => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === 'arnold-press'), alt = p.mistakeAlt ?? '';
    expect(alt.length).toBeGreaterThan(0);
    expect(fragProblems(html.replace(alt, alt.slice(0, -1) + (alt.endsWith('.') ? '!' : '.')))).toContain('arnold-press mistakeAlt');
  });
  it('lb02 layers page: the incline_dumbbell_press card outside its plate (the bench-angle close-up included) = the base bytes', async () => {
    const { buildLayersPage } = await import(/* @vite-ignore */ lib('build-layers-page.mjs'));
    const stageDir = mkdtempSync(join(tmpdir(), 'pf4-20b-'));
    let h: string;
    // LIB-SHIP W8b (Q-W8b-1, #417 6847824876): built from main e15e1c65's 6-id lb02 config (checks/ship-w8b.ts); the pins are unchanged.
    try { h = (await buildLayersPage(await pf4Lb02Spec(stageDir))).toString('utf8'); } finally { rmSync(stageDir, { recursive: true, force: true }); }
    const sha = (s: string) => createHash('sha256').update(s).digest('hex');
    const block = (s: string, open: RegExp, tag: string) => { const m = open.exec(s); if (!m) return '';
      const t = new RegExp(`<${tag}\\b|</${tag}>`, 'g'); t.lastIndex = m.index; let d = 0;
      for (let k; (k = t.exec(s));) { d += k[0] === `</${tag}>` ? -1 : 1; if (!d) return s.slice(m.index, k.index + tag.length + 3); } return ''; };
    const card = block(h, /<article class="sheet-card" id="card-incline-dumbbell-press"/, 'article'), plateDiv = block(card, /<div class="plate-fit" id="incline-dumbbell-press-plate"/, 'div');
    const zoom = block(card, /<div class="zx" id="incline-dumbbell-press-zoom-incline-angle"/, 'div');
    expect(card.length).toBeGreaterThan(0);
    expect(plateDiv.length).toBeGreaterThan(0);
    expect(zoom.length).toBeGreaterThan(0);
    expect({ outsidePlate: sha(card.replace(plateDiv, '')), zoom: sha(zoom) }).toEqual({ outsidePlate: '3f589411282eee6aa17900b1edb93e460298ebe825baf383958f8c0d38cd6dc7', zoom: '74c24a09bfbb4d2b365dff10e44274602a57d00f84bf4854fac87101056dd49b' });
  }, T);
});
