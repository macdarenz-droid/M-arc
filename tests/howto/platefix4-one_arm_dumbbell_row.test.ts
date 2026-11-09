// LIB-PLATEFIX-4 one_arm_dumbbell_row (batch lb03), held after pf8 (#405 6688665575: "R1 [4,3,3] (support arm bent
// about 90 deg) and R5 [3,3,2]"; pf8 tile T05). Measured from the engine's landmarks at the render's camera (plate px):
//  R1 (pf8 c2, c3; pf7 c1-c3): the support arm straight or nearly straight (elbow flexion <= 15 deg) with the wrist under
//   the shoulder (the spec's 0.5 cm check tolerance), the trunk rotated head end up (the arm is longer than the thigh) with
//   the back still flat (spine 0, the back line straight and rising 10-25 deg toward the head; the critics: about 20-23).
//  R5 (pf8 c1, c2, c3; pf7 c1-c3): the red "Arm not straight" arm hangs from the drawn shoulder joint (<= 3 px), its
//   elbow at c3's point (50 px behind and 77 px below the shoulder at the critics' 2x, so 25 and 38.5 px here, +-4 px),
//   the red elbow and dumbbell >= 20 px from the support arm's elbow, wrist and palm, and the red dumbbell clear of the
//   correct bottom (straight-arm) dumbbell: the two hexes do not touch (>= 2 r + 4 px between centres).
// Red on the base spec (de91dd21): support elbow 87.8 deg; back rise 0 deg; red shoulder 8.7 px from the drawn joint;
// red elbow (-20, +43) px from the shoulder; red elbow 11.9 px from the support elbow.
// Every other plate on the lb03 plates page stays byte-equal to the base page (fragment digests pinned below).
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
let plate: any, qaEng: any, body: any, golden: any, S: any;
beforeAll(async () => {
  [plate, qaEng, body, golden, S] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../golden.mjs', 'specs/one_arm_dumbbell_row.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = S.default;
}, T);

type V = number[];
const POSES = ['start', 'end', 'mistake'] as const;
const d2 = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const clone = (x: any) => JSON.parse(JSON.stringify(x));

/** Everything the checks read, for one spec. */
const measure = (spec: any) => {
  const n = plate.renderPlate(spec, { id: 'pf4' }), m = plate.renderPlate(spec, { id: 'pf4', mistake: true });
  const cam = qaEng.cameraOf(spec, n.report), L = qaEng.poseLandmarks({ body }, spec);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  // the drawn shoulder joint: the first joint mark of the solid (end) figure in the Mistake plate (marks: shoulder, elbow, hip, knee)
  const endLayer = m.svg.slice(Math.max(0, m.svg.indexOf('<g class="pose-end">')));
  const mk = /<circle class="joint" cx="([-\d.]+)" cy="([-\d.]+)"/.exec(endLayer);
  const joint: V = mk ? [+mk[1]!, +mk[2]!] : [NaN, NaN];
  const backDeg = (p: string) => { const a = P(p, 'sacrum'), b = P(p, 'backUpper'); return Math.atan2(a[1]! - b[1]!, b[0]! - a[0]!) * 180 / Math.PI; };   // + = head end up
  const supFlex = Math.max(...POSES.map(p => n.report.angles[p]['elbow.l']));
  const underCm = Math.max(...POSES.map(p => Math.abs(L.lm[p]['wrist.l'][2] - L.lm[p]['shoulder.l'][2]) * 100));
  const spine = Math.max(...POSES.map(p => Math.abs(n.report.angles[p].trunk)));
  const rise = POSES.map(backDeg);
  const sh = P('mistake', 'shoulder.r'), el = P('mistake', 'elbow.r'), gr = P('mistake', 'grip.r');
  const sup = [P('end', 'elbow.l'), P('end', 'wrist.l'), P('end', 'grip.l')];
  const clear = Math.min(...[el, gr].flatMap(r => sup.map(q => d2(r, q))));
  const bellR = 0.119 / 2 * cam.pxPerM, bottomGap = d2(gr, P('start', 'grip.r'));
  return { supFlex, underCm, spine, rise, joint, jointOff: d2(sh, joint), elbowRel: [el[0]! - sh[0]!, el[1]! - sh[1]!], clear, bottomGap, bellR };
};

describe('PF4 one_arm_dumbbell_row: support arm straight (R1), red arm from the shoulder and clear of it (R5)', { timeout: T }, () => {
  let m: any;
  beforeAll(() => {
    m = measure(S);
    console.log(`PF4 one_arm_dumbbell_row: support elbow ${m.supFlex.toFixed(1)} deg, wrist off the shoulder ${m.underCm.toFixed(2)} cm, spine ${m.spine}, back rise ${m.rise.map((v: number) => v.toFixed(1))} deg; red shoulder ${m.jointOff.toFixed(2)} px from the joint ${m.joint}, red elbow ${m.elbowRel.map((v: number) => v.toFixed(1))} px, clear of the support arm ${m.clear.toFixed(1)} px, from the bottom dumbbell ${m.bottomGap.toFixed(1)} px (2r+4 = ${(2 * m.bellR + 4).toFixed(1)})`);
  }, T);

  const r1Problems = (x: any) => [
    ...(x.supFlex <= 15 ? [] : [`support elbow ${x.supFlex.toFixed(1)} deg > 15`]),
    ...(x.underCm <= 0.5 ? [] : [`wrist ${x.underCm.toFixed(2)} cm off under the shoulder`]),
    ...(x.spine === 0 ? [] : [`spine ${x.spine} deg (the back not flat)`]),
    ...(x.rise.every((v: number) => v >= 10 && v <= 25) ? [] : [`back rise ${x.rise.map((v: number) => v.toFixed(1))} deg outside 10-25`]),
  ];
  const r5Problems = (x: any) => [
    ...(x.jointOff <= 3 ? [] : [`red shoulder ${x.jointOff.toFixed(1)} px from the drawn joint`]),
    ...(Math.abs(x.elbowRel[0] + 25) <= 4 && Math.abs(x.elbowRel[1] - 38.5) <= 4 ? [] : [`red elbow at ${x.elbowRel.map((v: number) => v.toFixed(1))} px, not c3's (-25, 38.5)`]),
    ...(x.clear >= 20 ? [] : [`red elbow or dumbbell ${x.clear.toFixed(1)} px from the support arm`]),
    ...(x.bottomGap >= 2 * x.bellR + 4 ? [] : [`red dumbbell ${x.bottomGap.toFixed(1)} px from the bottom dumbbell`]),
  ];

  it('R1: support elbow <= 15 deg, wrist under the shoulder (<= 0.5 cm), spine 0, the flat back rising 10-25 deg toward the head, in every pose', () => {
    expect(r1Problems(m)).toEqual([]);
  });
  it('R5: the red arm from the drawn shoulder joint (<= 3 px), elbow at c3\'s point (+-4 px), >= 20 px clear of the support arm, the dumbbell clear of the bottom one', () => {
    expect(r5Problems(m)).toEqual([]);
  });

  // Mutations: each threshold turned red by one change to the spec's poses.
  const mut = (f: (s: any) => void) => { const s = { ...S, poses: clone(S.poses), mistake: { ...S.mistake, pose: clone(S.mistake.pose) } }; f(s); return measure(s); };
  it('mutation: the support elbow bent 30 deg is red', () => {
    expect(r1Problems(mut(s => { for (const p of [s.poses.start, s.poses.end, s.mistake.pose]) p.elbow.l = 30; })).some(x => /support elbow/.test(x))).toBe(true);
  });
  it('mutation: the support shoulder flexed 10 deg more (the wrist off under the shoulder) is red', () => {
    expect(r1Problems(mut(s => { for (const p of [s.poses.start, s.poses.end, s.mistake.pose]) p.shoulder.l.flex += 10; })).some(x => /wrist .* off/.test(x))).toBe(true);
  });
  it('mutation: the spine flexed 15 deg (a rounded back) is red', () => {
    expect(r1Problems(mut(s => { s.poses.start.trunk = 15; s.poses.end.trunk = 15; })).some(x => /spine/.test(x))).toBe(true);
  });
  it('mutation: the trunk tilted back to level (the base tilt 94.85 deg) is red on the back rise', () => {
    expect(r1Problems(mut(s => { for (const p of [s.poses.start, s.poses.end]) { p.root.tilt = 94.85; p.hip.l = 94.85; } })).some(x => /back rise/.test(x))).toBe(true);
  });
  it('mutation: the red arm\'s shoulder blade forward as at the start (pro 2 cm, the base) is red on the joint', () => {
    expect(r5Problems(mut(s => { s.mistake.pose.scap.r.pro = 2; })).some(x => /drawn joint/.test(x))).toBe(true);
  });
  it('mutation: the base red arm (upper arm 25 deg behind plumb, elbow 70) is red on c3\'s point and on the clearance', () => {
    const p = r5Problems(mut(s => { s.mistake.pose.shoulder.r.flex += 35 - 25; s.mistake.pose.elbow.r = 70; }));
    expect(p.some(x => /c3's/.test(x))).toBe(true);
    expect(p.some(x => /support arm/.test(x))).toBe(true);
  });
  it('mutation: the red arm hanging nearly straight (upper arm plumb, elbow 15) is red on the bottom dumbbell', () => {
    expect(r5Problems(mut(s => { s.mistake.pose.shoulder.r.flex += 35; s.mistake.pose.elbow.r = 15; })).some(x => /bottom dumbbell/.test(x))).toBe(true);
  });
});

// The other 11 plates of the lb03 plates page: sha256 of JSON.stringify(golden.fragmentsOf(plate)) on the base page
// (main de91dd21, page sha256 5a2c55c0682da6b37ff637b9ab9b94746209321e0212e998b607b63ac9ca4b2e).
const BASE: Record<string, string> = {
  'pendlay-row': 'ccee896c6812aad7a5d7aac1be69bf6bdc8595660ffbcc05fe26794cd189c265',
  'landmine-row': '5524ba08c723ec76028574f7b49cab962fd9ef5f532bba84263c8760e0824bd7',
  'dumbbell-romanian-deadlift': 'b0f26136dda0fc9443df26afa3f1a9173906b1e8103109bada050316dcbb4eb4',
  'conventional-deadlift': '5c2f715192cf80ef8fbcdf9fb467eb8c88ef681aad7cd71d15edff6273834e15',
  'sumo-deadlift': '8acd394e560341395211d1026b2083fbb77c0248a575ffb9d6851aee0e573a65',
  'back-extension': '9133f7578272fedddca5f8647b43c035f0099262985d5a20672e6f176893f5fd',
  't-bar-row': '57958dafb0be5233a9535a89cdc82203ae6aceb9ef395ce0663620ce3a0d9b09',
  'barbell-shrug': '9809aa149abad1ca3499128488eb67d2a4164fc49e449ae4c01d5670f7a94ea1',
  'cable-shrug': 'd870a4afd4e9cc6417884af8a64d574941f428fa3105ae7393a2d571e5e6481d',
  'dumbbell-shrug': 'c969e5c2bfafd0c93ec9e5385b63988f562242b076c5b55758c3bdfd72b8ab30',
  'smith-machine-shrug': '19f42b073729b8db30a567defae2e64b4593a7bcbb4729ac503662dca953c0b9',
};
describe('PF4 one_arm_dumbbell_row: every other lb03 plate is byte-equal to the base page', { timeout: T }, () => {
  let html = '';
  beforeAll(() => {
    const dir = mkdtempSync(join(tmpdir(), 'pf4-oadr-')), out = join(dir, 'lb03.plates.html');
    try { execFileSync(process.execPath, ['scripts/howto-rebuild.mjs', '--page', 'tests/howto/golden/library/lb03.json', 'page', out], { stdio: 'pipe' }); html = readFileSync(out, 'utf8'); }
    finally { rmSync(dir, { recursive: true, force: true }); }
  }, T);
  const digests = (h: string) => Object.fromEntries(golden.extractPlates(h).filter((p: any) => p.chromeId !== 'one-arm-dumbbell-row')
    .map((p: any) => [p.chromeId, createHash('sha256').update(JSON.stringify(golden.fragmentsOf(p))).digest('hex')]));
  it('the 11 other plates\' fragments equal the base page\'s', () => {
    expect(digests(html)).toEqual(BASE);
  });
  it('mutation: one byte changed in pendlay_row\'s plate is red', () => {
    const i = html.indexOf('id="pendlay-row-plate"'), bad = html.slice(0, i) + html.slice(i).replace('<path ', '<path  ');
    expect(digests(bad)).not.toEqual(BASE);
  });
});
