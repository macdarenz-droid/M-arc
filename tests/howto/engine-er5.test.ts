// LIB-20: the E-R5 engine fields (root.roll, root.yaw, trunk.yaw, trunk.lat, camera.pitch, torso 'volume') in the
// vendored golden-A engine. The L1 rebuild of golden A is the gate's HT-2 block and the default-path front-view pin
// is the _test_er5.n reference fixture (golden.test.ts HT1-A4); these tests pin each field's maths and prove that every
// field set explicitly to 0 or off draws exactly what the field absent draws. Renders run in an awaited child process,
// never in the vitest worker (D-LIB8M-RPC (b)); the kinematics checks are cheap and run here.
import { writeFileSync, rmSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const GOLDEN_URL = new URL('../../tools/plates/golden.mjs', import.meta.url).href;
type V3 = [number, number, number];
type Shape = { key: string; group: string; d: string; poly: [number, number][] };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let body: any, mirror: string, facts: any;
const H = 1.75, PXM = 256 / H, b = { height: H };
const px = (w: number[]) => [w[0]! * PXM, -w[1]! * PXM];   // the level front view, in plate px
const frontCam = { view: 'front', near: null, pxm: PXM, P: (w: number[]) => px(w) };
const sideCam = { view: 'side', near: 'r', pxm: PXM, P: (w: number[]) => [w[2]! * PXM, -w[1]! * PXM] };
const dist = (a: number[], c: number[]) => Math.hypot(...a.map((v, i) => v - c[i]!));

// The renders: each vendored spec with its fields absent and set explicitly to 0 / off; the pitch, side-view, depth-order
// and Mistake-merge renders. Prints one JSON object of facts.
const CHILD = `
import { renderPlate } from './engine/plate.mjs';
import { readdirSync } from 'node:fs';
const specs = {};
for (const f of readdirSync('exercises').filter(f => f.endsWith('.mjs')).sort()) specs[f.slice(0, -4)] = (await import('./exercises/' + f)).default;
const html = (spec, o) => { const r = renderPlate(spec, o); return r.svg + r.overlay; };
const tobj = t => (t && typeof t === 'object' ? { yaw: 0, lat: 0, ...t } : { flex: t ?? 0, yaw: 0, lat: 0 });
const robj = r => (Array.isArray(r) ? { at: r, roll: 0, yaw: 0 } : { ...(r ?? {}), roll: 0, yaw: 0 });
const pose0 = p => ({ ...p, root: robj(p.root), trunk: tobj(p.trunk) });
const mis0 = m => ({ ...m, ...(m.root !== undefined ? { root: robj(m.root) } : {}), ...(m.trunk !== undefined ? { trunk: tobj(m.trunk) } : {}) });
const explicit = s => ({ ...s, camera: { ...(s.camera ?? {}), pitch: 0 },
  poses: { start: pose0(s.poses.start), end: pose0(s.poses.end), ...(s.poses.via ? { via: s.poses.via.map(pose0) } : {}) },
  ...(s.mistake?.pose ? { mistake: { ...s.mistake, pose: mis0(s.mistake.pose) } } : {}) });
const out = { defaults: {}, sideSame: null, pitch: {}, order: {}, merge: {} };
const safe = fn => { try { return fn(); } catch (e) { return 'threw: ' + e.message; } };   // a fact that throws is recorded, not fatal
for (const [k, s] of Object.entries(specs)) {
  const e = explicit(s);
  out.defaults[k] = safe(() => ({ n: html(s, { id: 'p-n' }) === html(e, { id: 'p-n' }), m: !s.mistake || html(s, { id: 'p-m', mistake: true }) === html(e, { id: 'p-m', mistake: true }), mistake: !!s.mistake }));
}
// trunk 20 and { flex: 20 } draw the same plate
{ const s = specs._test_front, w = p => ({ ...p, trunk: 20 }), o = p => ({ ...p, trunk: { flex: 20 } });
  out.trunk20 = safe(() => html({ ...s, poses: { start: w(s.poses.start), end: w(s.poses.end) } }, { id: 'p' }) === html({ ...s, poses: { start: o(s.poses.start), end: o(s.poses.end) } }, { id: 'p' })); }
// side view ignores pitch
{ const s = specs._test_side, p = { ...s, camera: { ...(s.camera ?? {}), pitch: 30 } };
  out.sideSame = html(s, { id: 'p-n' }) === html(p, { id: 'p-n' }) && html(s, { id: 'p-m', mistake: true }) === html(p, { id: 'p-m', mistake: true }); }
// a world line through the projection: its two ends, as drawn
for (const pitch of specs._test_er5 ? [0, 30] : []) {
  const s = { ...specs._test_er5, camera: { pxPerM: 100, x0: 179, y0: 300, pitch }, datum: [{ x: 0, from: 0, to: 0, line: [[0.2, 1.1, 0.4], [-0.3, 0.5, -0.2]] }] };
  const m = safe(() => renderPlate(s, { id: 'p' }).svg).match(/<path class="datum" d="M([-0-9.]+) ([-0-9.]+)L([-0-9.]+) ([-0-9.]+)"/);
  out.pitch[pitch] = m ? m.slice(1, 5).map(Number) : null;
}
// depth order in the front view: first <use> of a thigh, the volume trunk and its head in the end layer
if (specs._test_pitch) { const svg = renderPlate(specs._test_pitch, { id: 'p' }).svg, end = svg.slice(svg.indexOf('<g class="pose-end">'));
  out.order = { thigh: end.indexOf('<use href="#p-e-thigh.l"/>'), torso: end.indexOf('<use href="#p-e-torso.0"/>'), head: end.search(/<use href="#p-e-head\\.\\d+"\\/>/) }; }
// the Mistake merge never drops a trunk field
const tryMerge = (endTrunk, misTrunk) => { const s = specs._test_front;
  try { renderPlate({ ...s, poses: { ...s.poses, end: { ...s.poses.end, trunk: endTrunk } }, mistake: { ...s.mistake, pose: { ...s.mistake.pose, trunk: misTrunk } } }, { id: 'p', mistake: true }); return 'ok'; }
  catch (e) { return String(e.message); } };
out.merge = { numObj: tryMerge(10, { yaw: 15 }), objNum: tryMerge({ flex: 10, yaw: 15 }, 5), objObj: tryMerge({ flex: 10 }, { yaw: 15 }), numNum: tryMerge(10, 5) };
process.stdout.write(JSON.stringify(out));
`;

const runChild = (cwd: string, file: string) => new Promise<string>((resolve, reject) => {
  const c = spawn(process.execPath, [file], { cwd, stdio: ['ignore', 'pipe', 'pipe'] });
  const out: Buffer[] = [], err: Buffer[] = [];
  c.stdout.on('data', d => out.push(d)); c.stderr.on('data', d => err.push(d));
  c.on('error', reject);
  c.on('close', code => (code === 0 ? resolve(Buffer.concat(out).toString('utf8')) : reject(new Error(`${file} exited ${code}: ${Buffer.concat(err).toString().slice(0, 2000)}`))));
});

beforeAll(async () => {
  const g = await import(/* @vite-ignore */ GOLDEN_URL);
  mirror = g.makeMirror();
  body = await import(/* @vite-ignore */ `${mirror}/engine/body.mjs`);
  writeFileSync(join(mirror, '_er5_child.mjs'), CHILD);
  facts = JSON.parse(await runChild(mirror, '_er5_child.mjs'));
}, 120_000);
afterAll(() => rmSync(mirror, { recursive: true, force: true }));

const skOf = (pose: object) => body.fk(body.resolve(body.normPose(pose, b), b).q, b);
const lmOf = (pose: object) => body.landmarks(skOf(pose));
const ROOT: V3 = [0, 0.53 * H - 0.02, 0];
const FEET = { l: { at: [0.07 * H, 0, 0.044 * H] }, r: { at: [-0.07 * H, 0, 0.044 * H] } };
const BONES = [['hip.l', 'knee.l'], ['knee.l', 'ankle.l'], ['hip.r', 'knee.r'], ['knee.r', 'ankle.r'], ['shoulder.l', 'elbow.l'], ['elbow.l', 'wrist.l'],
  ['shoulder.r', 'elbow.r'], ['elbow.r', 'wrist.r'], ['hip.l', 'hip.r'], ['shoulder.l', 'shoulder.r'], ['lumbar', 'neck'], ['hips', 'head']];

describe('20-A5 defaults keep today\'s output', () => {
  it('each of the 11 vendored specs renders byte-identical with every field set to 0 / off and absent (normal and Mistake)', () => {
    const ids = Object.keys(facts.defaults).filter(k => !['_test_er5', '_test_pitch'].includes(k));
    expect(ids).toHaveLength(11);
    for (const k of ids) expect({ k, ...facts.defaults[k] }).toEqual({ k, n: true, m: true, mistake: facts.defaults[k].mistake });
    expect(facts.defaults._test_er5.n).toBe(true);
  });

  it('trunk 20 draws what { flex: 20 } draws; trunk null, 0 and absent are one pose', () => {
    expect(facts.trunk20).toBe(true);
    const base = { root: { at: ROOT }, plant: FEET };
    const ref = body.normPose(base, b);
    for (const trunk of [null, 0, { flex: 0 }, { flex: null }, {}]) expect(body.normPose({ ...base, trunk }, b)).toEqual(ref);
    expect(ref).toMatchObject({ trunk: 0, roll: 0, yaw: 0, trunkYaw: 0, lat: 0 });
    expect(body.normPose({ ...base, trunk: 20 }, b)).toEqual(body.normPose({ ...base, trunk: { flex: 20 } }, b));
  });
});

describe('20-A6 root.roll', () => {
  const pose = (roll: number) => ({ root: { at: [0, 1, 0], roll }, shoulder: { abd: 10 } });
  it('at roll 90 in the front view the shoulder line and the hip line are vertical, the head toward the figure\'s right', () => {
    const a = lmOf(pose(0)), c = lmOf(pose(90));
    const w = px(a['shoulder.l'])[0]! - px(a['shoulder.r'])[0]!, hw = px(a['hip.l'])[0]! - px(a['hip.r'])[0]!;
    const sl = px(c['shoulder.l']), sr = px(c['shoulder.r']), hl = px(c['hip.l']), hr = px(c['hip.r']);
    expect(Math.abs(sl[0]! - sr[0]!)).toBeLessThan(1);
    expect(Math.abs(Math.abs(sl[1]! - sr[1]!) - w)).toBeLessThan(1);
    expect(Math.abs(hl[0]! - hr[0]!)).toBeLessThan(1);
    expect(Math.abs(Math.abs(hl[1]! - hr[1]!) - hw)).toBeLessThan(1);
    expect(c.head[0]).toBeLessThan(-0.5);                     // + roll tips the head toward the figure's right (x < 0)
    expect(sl[1]).toBeLessThan(sr[1]!);                       // the left shoulder is the upper one (screen y down)
  });
  it('is a rigid turn: every bone length is unchanged', () => {
    const a = lmOf(pose(0)), c = lmOf(pose(90));
    for (const [p, q] of BONES) expect(Math.abs(dist(c[p!], c[q!]) - dist(a[p!], a[q!]))).toBeLessThan(1e-9);
  });
});

describe('20-A7 trunk.yaw', () => {
  const pose = (yaw: number) => ({ root: { at: ROOT }, plant: FEET, trunk: { yaw } });
  it('at yaw 90 the shoulder line foreshortens to under 10 % of its width at 0; the pelvis does not move', () => {
    const a = lmOf(pose(0)), c = lmOf(pose(90));
    const w = (l: Record<string, number[]>) => Math.abs(px(l['shoulder.l']!)[0]! - px(l['shoulder.r']!)[0]!);
    expect(w(c)).toBeLessThan(0.1 * w(a));
    expect(c['shoulder.l'][2]).toBeLessThan(c['shoulder.r'][2]);   // + yaw turns the chest toward the figure's left
    for (const k of ['hip.l', 'hip.r', 'hips', 'lumbar', 'knee.l', 'knee.r', 'navel', 'sacrum']) expect(dist(c[k], a[k])).toBeLessThan(1e-12);
  });
});

describe('20-A8 trunk.lat', () => {
  it('at lat 20 the shoulders\' midpoint moves toward the figure\'s right of the pelvis midpoint; pelvis and planted feet stay', () => {
    const p = (lat: number) => ({ root: { at: ROOT }, plant: FEET, trunk: { lat } });
    const a = lmOf(p(0)), c = lmOf(p(20));
    expect(a.shoulders[0] - a.hips[0]).toBeCloseTo(0, 9);
    expect(px(c.shoulders)[0]! - px(c.hips)[0]!).toBeLessThan(-10);
    for (const k of ['hip.l', 'hip.r', 'hips', 'lumbar', 'knee.l', 'knee.r', 'sole.l', 'sole.r', 'toe.l', 'heel.r']) expect(dist(c[k], a[k])).toBeLessThan(1e-12);
  });
  it('the side bend comes after the flex: thorax = rotZ(lat) · rotX(flex) on the pelvis frame', () => {
    const sk = skOf({ root: { at: [0, 1, 0] }, trunk: { flex: 30, lat: 20 } }), R = Math.PI / 180;
    const v = [0, (0.855 - 0.62) * H, (-0.02 + 0.04) * H];   // lumbar pivot to the neck pivot (REF), metres
    const fx = [v[0]!, v[1]! * Math.cos(30 * R) - v[2]! * Math.sin(30 * R), v[1]! * Math.sin(30 * R) + v[2]! * Math.cos(30 * R)];
    const want = [fx[0]! * Math.cos(20 * R) - fx[1]! * Math.sin(20 * R), fx[0]! * Math.sin(20 * R) + fx[1]! * Math.cos(20 * R), fx[2]!];
    const got = sk.N.map((x: number, i: number) => x - sk.L[i]);
    for (let i = 0; i < 3; i++) expect(got[i]).toBeCloseTo(want[i]!, 12);
  });
});

describe('20-A9 root.yaw (D-ER5-YAW)', () => {
  const pose = (yaw: number) => ({ root: { at: ROOT, yaw }, plant: FEET });
  it('standing, feet planted: at yaw 30 the hips\' front-view width is cos 30 x the width at 0, the hips turn about the vertical', () => {
    const a = lmOf(pose(0)), c = lmOf(pose(30));
    const w0 = px(a['hip.l'])[0]! - px(a['hip.r'])[0]!, w = px(c['hip.l'])[0]! - px(c['hip.r'])[0]!;
    expect(Math.abs(w - Math.cos(Math.PI / 6) * w0)).toBeLessThan(1);
    expect(Math.abs(px(c['hip.l'])[1]! - px(c['hip.r'])[1]!)).toBeLessThan(0.01);                     // level: a vertical axis
    expect((c['hip.l'][2] - c['hip.r'][2]) * PXM).toBeCloseTo(-Math.sin(Math.PI / 6) * w0, 6);         // + yaw: the left hip goes back
  });
  it('the knees move and the feet stay within 0.5 px', () => {
    const a = skOf(pose(0)), c = skOf(pose(30)), la = body.landmarks(a), lc = body.landmarks(c);
    for (const sd of ['l', 'r']) {
      expect(dist(c.K[sd], a.K[sd]) * PXM).toBeGreaterThan(2);
      for (const k of ['heel', 'ball', 'toe', 'sole']) expect(dist(lc[`${k}.${sd}`], la[`${k}.${sd}`]) * PXM).toBeLessThan(0.5);
      const fa = body.bodyShapes(a, frontCam).find((s: Shape) => s.key === `foot.${sd}`).poly, fc = body.bodyShapes(c, frontCam).find((s: Shape) => s.key === `foot.${sd}`).poly;
      fa.forEach((p: number[], i: number) => expect(dist(fc[i], p)).toBeLessThan(0.5));
    }
  });
});

describe('20-A10 camera.pitch', () => {
  it('front view: a world point lands at screen-up y cos p - z sin p (to 0.01 px); pitch 0 is the level projection', () => {
    const R = Math.PI / 180, at = (w: number[], p: number) => [179 + w[0]! * 100, 300 - (w[1]! * Math.cos(p * R) - w[2]! * Math.sin(p * R)) * 100];
    for (const p of [0, 30]) {
      const want = [...at([0.2, 1.1, 0.4], p), ...at([-0.3, 0.5, -0.2], p)];
      expect(facts.pitch[p]).toHaveLength(4);
      facts.pitch[p].forEach((v: number, i: number) => expect(Math.abs(v - want[i]!)).toBeLessThanOrEqual(0.01));
    }
  });
  it('a side-view spec renders byte-identical at pitch 0 and pitch 30', () => {
    expect(facts.sideSame).toBe(true);
  });
});

describe('20-A11 volume trunk and depth order', () => {
  const hinge = { root: { at: [0, 0.86, -0.12], tilt: 75 }, trunk: 5, plant: { l: { at: [0.11, 0, 0] }, r: { at: [-0.11, 0, 0] } } };
  it('the trunk and head are closed hull paths; a trunk nearer the camera than the knees goes in chest, its head in headF', () => {
    const sk = skOf(hinge), sh: Shape[] = body.bodyShapes(sk, frontCam, { torso: 'volume' });
    const torso = sh.filter(s => s.key.startsWith('torso.')), head = sh.filter(s => s.key.startsWith('head.'));
    expect(torso.length).toBeGreaterThan(20);
    expect(head.length).toBeGreaterThan(5);
    for (const s of [...torso, ...head]) expect(s.d).toMatch(/^M[^Z]+Z$/);
    expect(new Set(torso.map(s => s.group))).toEqual(new Set(['chest']));
    expect(new Set(head.map(s => s.group))).toEqual(new Set(['headF']));
    expect(sh.some(s => s.key === 'torso' || s.key === 'head')).toBe(false);
  });
  it('standing, and in the side view, the volume trunk stays in the body / trunk group', () => {
    const st = body.bodyShapes(skOf({ root: { at: ROOT }, plant: FEET }), frontCam, { torso: 'volume' }).filter((s: Shape) => /^(torso|head)\./.test(s.key));
    expect(new Set(st.map((s: Shape) => s.group))).toEqual(new Set(['body']));
    const sd = body.bodyShapes(skOf(hinge), sideCam, { torso: 'volume' }).filter((s: Shape) => /^(torso|head)\./.test(s.key));
    expect(new Set(sd.map((s: Shape) => s.group))).toEqual(new Set(['trunk']));
  });
  it('_test_pitch: the end layer draws the legs, then the chest, then the head', () => {
    const { thigh, torso, head } = facts.order;
    expect(thigh).toBeGreaterThanOrEqual(0);
    expect(torso).toBeGreaterThan(thigh);
    expect(head).toBeGreaterThan(torso);
  });
});

describe('20-A12 the Mistake merge (D-LIB20-TRUNK)', () => {
  it('a numeric trunk merged with { flex, yaw, lat } throws, naming the spec; same kinds merge as before', () => {
    const msg = /^_test_front: poses\.end\.trunk and mistake\.pose\.trunk mix a number and \{ flex, yaw, lat \}/;
    expect(facts.merge.numObj).toMatch(msg);
    expect(facts.merge.objNum).toMatch(msg);
    expect(facts.merge.objObj).toBe('ok');
    expect(facts.merge.numNum).toBe('ok');
  });
});
