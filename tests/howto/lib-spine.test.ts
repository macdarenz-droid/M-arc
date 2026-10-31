// LIB-SPINE: the spine fields in the vendored golden-A engine (card docs/supervisor/verify/lib-spine-card.md): array
// trunk.flex / yaw / lat over the SPINE_PIV pivots (D-SPINE-SEGS), trunk.bow (D-SPINE-BOW), the top-level
// depth: 'view' (D-SPINE-VIEW) and the D-SPINE-MIX throws. The default path's bytes are pinned by golden A (L1), the
// reference fixtures (golden.test.ts HT1-A4) and the library pages (C0); these tests pin each field's maths. Renders run
// in an awaited child process, never in the vitest worker (D-LIB8M-RPC (b)); the kinematics checks run here.
import { readFileSync, rmSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const GOLDEN_URL = new URL('../../tools/plates/golden.mjs', import.meta.url).href;
const FIXTURES = new URL('./golden/ref-fixtures/', import.meta.url).pathname;
type Shape = { key: string; group: string };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let body: any, mirror: string, facts: any, spine: any;
const H = 1.75, b = { height: H };
const frontCam = { view: 'front', near: null, pxm: 100, P: (w: number[]) => [w[0]! * 100, -w[1]! * 100] };
const dist = (a: number[], c: number[]) => Math.hypot(...a.map((v, i) => v - c[i]!));

// The renders: the fixture pair against renders with one field removed, _test_pitch with and without depth 'view',
// the end layer's draw order of _test_spine, and the D-SPINE-MIX throws. Prints one JSON object of facts.
const CHILD = `
import { renderPlate } from './engine/plate.mjs';
const S = (await import('./exercises/_test_spine.mjs')).default, P = (await import('./exercises/_test_pitch.mjs')).default;
const html = (spec, o) => { const r = renderPlate(spec, o); return r.svg + r.overlay; };
const n = s => html(s, { id: '_test_spine-n' }), m = s => html(s, { id: '_test_spine-m', mistake: true });
const sum = t => ({ flex: t.flex.reduce((x, y) => x + y, 0) });
const single = p => ({ ...p, trunk: sum(p.trunk) });
const out = {};
out.spine = { n: n(S), m: m(S), noDepth: n({ ...S, depth: undefined }), single: n({ ...S, poses: { start: single(S.poses.start), end: single(S.poses.end) }, mistake: { ...S.mistake, pose: { trunk: { ...sum(S.mistake.pose.trunk), bow: S.mistake.pose.trunk.bow } } } }),
  noBow: m({ ...S, mistake: { ...S.mistake, pose: { trunk: { flex: S.mistake.pose.trunk.flex } } } }) };
out.pitch = { n: html(P, { id: '_test_pitch-n' }), m: html(P, { id: '_test_pitch-m', mistake: true }), viewN: html({ ...P, depth: 'view' }, { id: '_test_pitch-n' }), viewM: html({ ...P, depth: 'view' }, { id: '_test_pitch-m', mistake: true }) };
const svg = renderPlate(S, { id: 'p' }).svg, end = svg.slice(svg.indexOf('<g class="pose-end">'));
out.order = { torso: end.indexOf('<use href="#p-e-torso.0"/>'), thigh: end.indexOf('<use href="#p-e-thigh.l"/>') };
out.order.ownGroup = out.order.torso >= 0 && out.order.thigh > out.order.torso && end.slice(out.order.torso, out.order.thigh).includes('</g>');
const tryR = (spec, mistake = false) => { try { renderPlate(spec, { id: 'p', mistake }); return 'ok'; } catch (e) { return String(e.message); } };
const A = { flex: [0, 5, 5, 0] };
const at = (start, end, mp, via) => ({ ...S, poses: { start: { ...S.poses.start, trunk: start }, end: { ...S.poses.end, trunk: end }, ...(via ? { via: [{ ...S.poses.end, trunk: via }] } : {}) }, mistake: { ...S.mistake, pose: { trunk: mp } } });
out.mix = {
  startNum: tryR(at(10, A, A)), viaNum: tryR(at(A, A, A, { flex: 5 })), mistakeNum: tryR(at(A, A, { flex: 5 }), true), absent: tryR(at(undefined, A, A)),
  bowNum: tryR(at(10, 10, { bow: 12 }), true), bowNumStart: tryR(at(10, { flex: 10 }, { flex: 10, bow: 12 }), true),
  inPose: tryR(at({ flex: [0, 5, 5, 0], yaw: 10 }, A, A)), length: tryR(at({ flex: [0, 5, 5] }, A, A)),
  allArrays: tryR(at(A, A, { flex: [0, 5, 5, 0], bow: 12 }, A), true), objBow: tryR(at({ flex: 10 }, { flex: 10 }, { bow: 12 }), true),
};
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
  spine = (await import(/* @vite-ignore */ `${mirror}/exercises/_test_spine.mjs`)).default;
  writeFileSync(join(mirror, '_spine_child.mjs'), CHILD);
  facts = JSON.parse(await runChild(mirror, '_spine_child.mjs'));
}, 120_000);
afterAll(() => rmSync(mirror, { recursive: true, force: true }));

const skOf = (pose: object) => body.fk(body.resolve(body.normPose(pose, b), b).q, b);
const lmOf = (pose: object) => body.landmarks(skOf(pose));
const BASE = { root: { at: [0, 0.93, 0], tilt: 10 }, hip: { l: 30, r: -10 }, knee: { l: 40, r: 5 }, shoulder: { l: { flex: 40 }, r: { abd: 30 } }, elbow: 30, neck: 5 };
const PELVIS_BODY = ['navel', 'sacrum', 'buttock', 'seat'];

describe('LIB-SPINE A1 the fields are opt-in', () => {
  it('_test_pitch renders its committed fixtures without depth, and differs with depth \'view\' (so the flag, not the pitch, turns it on)', () => {
    const fx = (k: string) => readFileSync(join(FIXTURES, `${k}.html`), 'utf8');
    expect(facts.pitch.n).toBe(fx('_test_pitch.n'));
    expect(facts.pitch.m).toBe(fx('_test_pitch.m'));
    expect(facts.pitch.viewN === facts.pitch.n && facts.pitch.viewM === facts.pitch.m).toBe(false);
  });
  it('a number trunk and no bow normalise without the new keys', () => {
    const q = body.normPose({ ...BASE, trunk: { flex: 20, yaw: 5 } }, b);
    expect('spine' in q || 'bow' in q).toBe(false);
    expect(skOf({ ...BASE, trunk: 20 }).spine).toBeUndefined();
  });
});

describe('LIB-SPINE A2 segments reduce to the single pivot', () => {
  it('flex [0, θ, 0, 0] and yaw [0, ψ, 0, 0] put every thorax, arm, head and leg landmark within 1e-9 m of { flex: θ, yaw: ψ }', () => {
    expect(body.SPINE_PIV[1]).toBe(body.REF.lumbar[1]);
    let worst = 0, n = 0;
    for (const th of [-30, 12, 45, 90]) for (const ps of [0, 30]) {
      const a = lmOf({ ...BASE, trunk: { flex: th, yaw: ps } }), c = lmOf({ ...BASE, trunk: { flex: [0, th, 0, 0], yaw: [0, ps, 0, 0] } });
      for (const k of Object.keys(a)) if (!PELVIS_BODY.includes(k)) { worst = Math.max(worst, dist(a[k], c[k])); n++; }
    }
    expect(n).toBeGreaterThan(8 * 40);
    expect(worst).toBeLessThan(1e-9);
  });
  it('the sums stay numbers, and thorax(r) = L + Rt·H·(r − REF.lumbar) holds for a spread curl with yaw and lat', () => {
    const q = body.normPose({ ...BASE, trunk: { flex: [10, 15, 25, 30], yaw: [0, 5, 10, 0], lat: [0, 0, 5, 5] } }, b);
    expect([q.trunk, q.trunkYaw, q.lat]).toEqual([80, 15, 10]);
    const sk = skOf({ ...BASE, trunk: { flex: [10, 15, 25, 30], yaw: [0, 5, 10, 0], lat: [0, 0, 5, 5], bow: 8 } });
    for (const r of [[0, 0.8, 0.07], [0.12, 0.83, 0], [0, 0.66, -0.06], body.REF.neck]) {
      const d = r.map((v: number, i: number) => (v - body.REF.lumbar[i]!) * H), w = [0, 1, 2].map(i => sk.L[i] + sk.Rt[i].reduce((s: number, m: number, j: number) => s + m * d[j]!, 0));
      expect(dist(sk.thorax(r), w)).toBeLessThan(1e-12);
    }
  });
});

describe('LIB-SPINE A3 the bow holds the thorax', () => {
  const p0 = { ...BASE, trunk: { flex: 20 } }, p1 = { ...BASE, trunk: { flex: 20, bow: 12 } };
  it('hips, knees and feet, and the head, shoulders, sternum, chest and backUpper move at most 1e-9 m', () => {
    const a = lmOf(p0), c = lmOf(p1);
    const held = ['hips', 'hip.l', 'hip.r', 'knee.l', 'knee.r', 'ankle.l', 'ankle.r', 'heel.l', 'toe.r', 'head', 'ear', 'neck', 'shoulder.l', 'shoulder.r', 'grip.l', 'sternum', 'chest', 'backUpper'];
    for (const k of held) expect({ k, d: dist(a[k], c[k]) < 1e-9 }).toEqual({ k, d: true });
    for (const k of ['sacrum', 'buttock', 'navel', 'lumbar']) expect(dist(a[k], c[k])).toBeGreaterThan(0.01);
  });
  it('with planted feet (IK through the pelvis frame) the knees and feet stay too', () => {
    const feet = { plant: { l: { at: [0.1, 0, 0.35] }, r: { at: [-0.1, 0, -0.45] } } }, root = { root: { at: [0, 0.62, -0.05], tilt: 15 } };
    const a = lmOf({ ...root, ...feet, trunk: { flex: 0 } }), c = lmOf({ ...root, ...feet, trunk: { flex: 0, bow: 12 } });
    for (const k of ['hips', 'knee.l', 'knee.r', 'ankle.l', 'ankle.r', 'toe.l', 'toe.r', 'head', 'chest']) expect({ k, d: dist(a[k], c[k]) < 1e-9 }).toEqual({ k, d: true });
  });
  it('the sacrum and buttock turn b about the hip axis', () => {
    const a = lmOf(p0), c = lmOf(p1), h = a.hips;
    const ang = (p: number[], q: number[]) => { const u = [p[1]! - h[1], p[2]! - h[2]], v = [q[1]! - h[1], q[2]! - h[2]];
      return Math.abs(Math.atan2(u[0]! * v[1]! - u[1]! * v[0]!, u[0]! * v[0]! + u[1]! * v[1]!)) * 180 / Math.PI; };
    for (const k of ['sacrum', 'buttock', 'seat']) { expect(Math.abs(ang(a[k], c[k]) - 12)).toBeLessThan(1e-9); expect(Math.abs(c[k][0] - a[k][0])).toBeLessThan(1e-12); }
  });
  it('the back outline is continuous: no gap and no crossing between neighbouring section samples, and no kink from the bow blend (bow 6, 12, 20)', () => {
    const step = 0.0025;
    for (const bow of [6, 12, 20]) for (const flex of [0, 20, [5, 5, 5, 5]]) {
      const sk = skOf({ ...BASE, trunk: { flex, bow } }), P: number[][] = [];
      for (let y = 0.45; y <= 0.84; y += step) P.push(sk.skin([0, y, -0.06]));
      const axis = [0, 1, 2].map(i => sk.Rt[i][1]);   // the thorax long axis
      let turn = 0;
      for (let i = 1; i < P.length; i++) {
        const u = [0, 1, 2].map(k => P[i]![k]! - P[i - 1]![k]!);
        expect(Math.hypot(...u)).toBeLessThan(2 * step * H);                        // no gap
        if (i > 1) { const w = [0, 1, 2].map(k => P[i - 1]![k]! - P[i - 2]![k]!);
          turn = Math.max(turn, Math.acos(Math.min(1, (u[0]! * w[0]! + u[1]! * w[1]! + u[2]! * w[2]!) / Math.hypot(...u) / Math.hypot(...w))) * 180 / Math.PI);
          expect(u[0]! * w[0]! + u[1]! * w[1]! + u[2]! * w[2]!).toBeGreaterThan(0); }  // no crossing back
      }
      expect(axis.some(v => v !== 0)).toBe(true);
      // smooth: at most about 0.19 deg per deg of bow per step; a linear blend kinks 1.35-1.5 deg per deg of bow
      if (!Array.isArray(flex)) expect({ bow, flex, turn: turn < 0.25 * bow }).toEqual({ bow, flex, turn: true });   // segments turn linearly at each pivot, as the default .60-.66 blend does
    }
  });
  it('interpolates a key without a bow as 0', () => {
    const a = body.normPose({ ...BASE, trunk: { flex: 10 } }, b), c = body.normPose({ ...BASE, trunk: { flex: 10, bow: 12 } }, b);
    expect(body.lerpPose(a, c, 0.5, b).bow).toBe(6);
    expect(body.lerpPose(c, a, 0.25, b).bow).toBe(9);
  });
});

describe('LIB-SPINE A4 view depth', () => {
  const groups = (pitch: number, depth?: string) => {
    const sh = body.bodyShapes(skOf(spine.poses.end), frontCam, { torso: 'volume', depth, pitch });
    const g = (k: string) => [...new Set(sh.filter((s: Shape) => s.key.startsWith(k)).map((s: Shape) => s.group))];
    return { thigh: g('thigh.l'), torso: g('torso.'), fist: g('fist.') };
  };
  it('_test_spine at pitch 75, 80 and 88: with depth \'view\' the bent thigh is in legs, the volume torso and the fists in body', () => {
    for (const p of [75, 80, 88]) expect({ p, ...groups(p, 'view') }).toEqual({ p, thigh: ['legs'], torso: ['body'], fist: ['body'] });
  });
  it('without the flag the bent thigh is in body, as before', () => {
    for (const p of [75, 80, 88]) expect({ p, ...groups(p) }).toEqual({ p, thigh: ['body'], torso: ['body'], fist: ['body'] });
  });
  it('through renderPlate at its fit camera, the end layer draws the trunk, then the bent thigh over it in its own group', () => {
    expect(facts.order.ownGroup).toBe(true);   // the spec's camera.pitch reaches bodyShapes although the fit rebuilds the camera
  });
  it('a side view ignores depth', () => {
    const side = { view: 'side', near: 'r', pxm: 100, P: (w: number[]) => [w[2]! * 100, -w[1]! * 100] }, sk = skOf(spine.poses.end);
    expect(body.bodyShapes(sk, side, { torso: 'volume', depth: 'view', pitch: 80 })).toEqual(body.bodyShapes(sk, side, { torso: 'volume' }));
  });
});

describe('LIB-SPINE A5 D-SPINE-MIX', () => {
  it('a number and the array form across start, via, end and the Mistake throw, naming the spec and D-SPINE-MIX', () => {
    const msg = /^_test_spine: the trunk mixes the array form .* \(D-SPINE-MIX\)$/;
    for (const k of ['startNum', 'viaNum', 'mistakeNum', 'absent']) expect({ k, m: facts.mix[k] }).toEqual({ k, m: expect.stringMatching(msg) });
  });
  it('a bow with a number trunk throws, naming D-SPINE-MIX', () => {
    for (const k of ['bowNum', 'bowNumStart']) expect({ k, m: facts.mix[k] }).toEqual({ k, m: expect.stringMatching(/^_test_spine: trunk\.bow needs the object form .*\(D-SPINE-MIX\)$/) });
  });
  it('inside one trunk, a number next to an array or an array of another length throws', () => {
    expect(facts.mix.inPose).toMatch(/trunk\.yaw: .*\(D-SPINE-MIX\)$/);
    expect(facts.mix.length).toMatch(/trunk\.flex: .*\(D-SPINE-MIX\)$/);
  });
  it('one form throughout renders', () => {
    expect(facts.mix.allArrays).toBe('ok');
    expect(facts.mix.objBow).toBe('ok');
  });
});

describe('LIB-SPINE A6 the fixture pair pins all three fields', () => {
  it('_test_spine.n and .m are the fresh renders; removing depth, the segments or the bow changes them', () => {
    const fx = (k: string) => readFileSync(join(FIXTURES, `${k}.html`), 'utf8');
    expect(facts.spine.n).toBe(fx('_test_spine.n'));
    expect(facts.spine.m).toBe(fx('_test_spine.m'));
    expect(facts.spine.noDepth).not.toBe(facts.spine.n);
    expect(facts.spine.single).not.toBe(facts.spine.n);
    expect(facts.spine.noBow).not.toBe(facts.spine.m);
  });
});
