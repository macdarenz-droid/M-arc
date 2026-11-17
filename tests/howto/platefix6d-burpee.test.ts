// LIB-PLATEFIX-6d burpee (W10 #434 T04; F-BURPEE-PLATE: L7 c1, c2, c3; L5 c1, c2, c3; D-PF6C-AMEND (c), D-PF6D-LANDDZ,
// D-PF6D-BURPEECARD). Measured from the engine's render and landmarks at the render's camera (plate px).
//  A15: the solid key pose is the straight-arm plank (spec end: wrists on the palms' floor height, toes down, hip to
//       ankle straight); the standing landing is the one dashed figure (spec start: feet flat, head up); no ghost
//       between them (the squat stays a via key for the motion only); the Mistake is a full standing pose with the
//       knees straight (<= 2 deg), and only its near leg is drawn red; the landing's soft knee stays in the Mistake view.
//       PF4's landing rules hold at the landing: knee 25-35 deg, >= 14 px forward of the hip-ankle line, the Mistake
//       knee >= 12 px from it (platefix4-burpee.test.ts BAR).
//  LAND_DZ (D-PF6D-LANDDZ, c1, c2 "offset so they do not overlap"): no outline point of the landing or the Mistake
//       lies inside the plank (0 %), and every body shape stays >= 16 px inside the plate.
// Red on the base spec (ff75bf0e): the solid figure stands (spec end has the feet flat), 1 squat ghost, the Mistake
// redraws the whole body, the landing knee and the Mistake knee lie inside the plank... (the plank is the dashed start).
// After: see the console line.
import { beforeAll, describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, qaEng: any, body: any, eq: any, M: any, S: any, MG: any;
beforeAll(async () => {
  [plate, qaEng, body, eq, M, MG] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'specs/burpee.mjs', 'mistake-ghosts.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = M.default;
}, 600_000);

type V = number[];
const SIZE = 358, BAR = { kneeMin: 25, kneeMax: 35, forward: 14, straight: 2, apart: 12, margin: 16 };
const inPoly = (poly: V[], [x, y]: V) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!;
  if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };

const measure = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf6' }), rm = plate.renderPlate(spec, { id: 'pf6', mistake: true }), cam = qaEng.cameraOf(spec, r.report);
  const L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec), B = { height: 1.75 };
  const shapes = (pose: string) => body.bodyShapes(body.fk(L.q[pose], B), cam, { hand: 'flat' }).filter((s: any) => s.poly);
  const P = (pose: string, k: string): V => cam.P(L.lm[pose][k]);
  const forward = (pose: string) => { const h = P(pose, 'hip.r'), k = P(pose, 'knee.r'), a = P(pose, 'ankle.r'), dx = a[0]! - h[0]!, dy = a[1]! - h[1]!;
    return ((k[0]! - h[0]!) * dy - (k[1]! - h[1]!) * dx) / Math.hypot(dx, dy); };
  const e = L.lm.end, s = L.lm.start, mi = L.lm.mistake;
  const plankEnd = Math.max(e['wrist.r'][1], e['wrist.l'][1]) < 0.05 && Math.max(e['toe.r'][1], e['toe.l'][1]) < 0.01 && M.kneeOf(e, 'r') <= 2 && e.head[1] < 0.8;
  const standStart = ['heel.r', 'ball.r', 'heel.l', 'ball.l'].every(k => Math.abs(s[k][1]) < 0.01) && s.head[1] > 1.4;
  const standMis = ['heel.r', 'ball.r', 'heel.l', 'ball.l'].every(k => Math.abs(mi[k][1]) < 0.01) && mi.head[1] > 1.4;
  const ghosts = (r.svg.match(/<g class="ghost"/g) ?? []).length;
  const redKeys = [...new Set([...rm.svg.matchAll(/id="pf6-m-([a-z]+\.[lr])"/g)].map(x => x[1]))].sort();
  const softInMistake = /<g class="pose-start"/.test(MG.mistakeSvg(spec, rm.svg));
  const End = shapes('end'), out = [...shapes('start'), ...shapes('mistake')].flatMap((x: any) => x.poly);
  const inside = out.filter((p: V) => End.some((x: any) => inPoly(x.poly, p))).length / out.length;
  const all = ['start', 'end', 'mistake'].flatMap(p => shapes(p).flatMap((x: any) => x.poly)) as V[];
  const margin = Math.min(...all.map(([x, y]) => Math.min(x!, SIZE - x!, y!, SIZE - y!)));
  const ks = P('start', 'knee.r'), km = P('mistake', 'knee.r');
  return { plankEnd, standStart, standMis, ghosts, via: (spec.poses.via ?? []).length, redKeys, softInMistake, inside, margin,
    knee: M.kneeOf(s, 'r'), forward: forward('start'), kneeMis: M.kneeOf(mi, 'r'), apart: Math.hypot(km[0]! - ks[0]!, km[1]! - ks[1]!) };
};
const problems = (m: any) => {
  const out: string[] = [];
  if (!m.plankEnd) out.push('solid key pose is not the plank');
  if (!m.standStart) out.push('dashed figure is not the standing landing');
  if (m.ghosts !== 0) out.push(`${m.ghosts} ghost`);
  if (m.via < 1) out.push('no via key');
  if (!m.standMis) out.push('Mistake is not a full standing pose');
  if (JSON.stringify(m.redKeys) !== JSON.stringify(['foot.r', 'kneecap.r', 'shank.r', 'thigh.r'])) out.push(`red parts ${m.redKeys.join(',')}`);
  if (!m.softInMistake) out.push('landing hidden in the Mistake view');
  if (!(m.knee >= BAR.kneeMin && m.knee <= BAR.kneeMax)) out.push(`landing knee ${m.knee.toFixed(1)} deg`);
  if (!(m.forward >= BAR.forward)) out.push(`knee ${m.forward.toFixed(1)} px forward`);
  if (!(m.kneeMis <= BAR.straight)) out.push(`Mistake knee ${m.kneeMis.toFixed(1)} deg`);
  if (!(m.apart >= BAR.apart)) out.push(`knees ${m.apart.toFixed(1)} px apart`);
  if (!(m.inside === 0)) out.push(`overlap ${(m.inside * 100).toFixed(0)} %`);
  if (!(m.margin >= BAR.margin)) out.push(`margin ${m.margin.toFixed(1)} px`);
  return out;
};
const shift = (p: any, dz: number) => ({ ...p, root: { ...p.root, at: [p.root.at[0], p.root.at[1], p.root.at[2] + dz] },
  plant: Object.fromEntries(Object.entries(p.plant).map(([k, v]: any) => [k, { ...v, at: [v.at[0], v.at[1], v.at[2] + dz] }])) });

describe('LIB-PLATEFIX-6d burpee (W10 T04): the plank solid, the landing the one ghost, the stiff landing a red straight leg', { timeout: 600_000 }, () => {
  let m: any;
  beforeAll(() => { m = measure(S);
    console.log(`PF6d burpee: ghosts ${m.ghosts}, red ${m.redKeys.join(',')}; landing knee ${m.knee.toFixed(1)} deg, ${m.forward.toFixed(1)} px forward; Mistake knee ${m.kneeMis.toFixed(1)} deg, ${m.apart.toFixed(1)} px apart; overlap ${(m.inside * 100).toFixed(1)} %, margin ${m.margin.toFixed(1)} px`); }, 600_000);
  it('A15: the key pose and the ghosts as ruled; the Mistake a full standing pose with one red straight leg; PF4\'s landing rules; LAND_DZ', () => {
    expect(problems(m)).toEqual([]);
    expect(M.SIZES.KNEE_SOFT).toBe(30);
  });
  it('m17: the crouch ghost back (one ghost) is red', () => {
    expect(problems(measure({ ...S, ghosts: { ...S.ghosts, count: 1 } }))).toEqual(['1 ghost']);
  });
  it('mutations: the landing and the Mistake at the plank\'s hands (LAND_DZ 0) overlap; the camera at main\'s x0 250 leaves the plate', () => {
    const dz = -M.SIZES.LAND_DZ, back = { ...S, poses: { ...S.poses, start: shift(S.poses.start, dz) }, mistake: { ...S.mistake, pose: shift(S.mistake.pose, dz) } };
    expect(problems(measure(back)).some(p => p.startsWith('overlap'))).toBe(true);
    expect(problems(measure({ ...S, camera: { ...S.camera, x0: 250 } })).some(p => p.startsWith('margin'))).toBe(true);
  });
  it('mutations: the whole body red, the landing hidden in the Mistake view, a 15 deg landing are red', () => {
    expect(problems(measure({ ...S, mistake: { ...S.mistake, parts: undefined } })).some(p => p.startsWith('red parts'))).toBe(true);
    expect(problems(measure({ ...S, mistakeGhosts: false }))).toContain('landing hidden in the Mistake view');
    const st = S.poses.start, at = (y: number) => ({ ...st, root: { ...st.root, at: [st.root.at[0], y, st.root.at[2]] } });
    const y15 = M.bisect((y: number) => M.kneeOf(body.landmarksOf(at(y), 1.75), 'r') - 15, st.root.at[1], S.mistake.pose.root.at[1], 'mutation');
    expect(problems(measure({ ...S, poses: { ...S.poses, start: at(y15) } })).some(p => p.startsWith('landing knee 15.0'))).toBe(true);
  });
});

describe('LIB-PLATEFIX-6d D-PF6D-BURPEECARD: only the plateFacts wrist poses move; the lb10 cards.sha pin is unchanged', () => {
  const read = (f: string) => JSON.parse(readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8'));
  const card = () => read('docs/research/howto/cards/burpee.json'), pin = () => read('tools/plates/library/lb10/cards.sha.json').cards.burpee;
  const sha = (c: any) => { const o = { ...c }; for (const k of ['plateFacts', 'tempo', 'topFault']) delete o[k]; return createHash('sha256').update(JSON.stringify(o, null, 2) + '\n').digest('hex'); };
  it('the wrist facts are on the spec end (the plank), card pose plate.end; the card without its machine keys hashes to the pin', () => {
    expect(card().plateFacts).toEqual(['wrist.l', 'wrist.r'].map(landmark => ({ kind: 'contact', landmark, pose: 'end', cardPose: 'end', claim: 'c2' })));
    expect(sha(card())).toBe(pin());
    expect(pin()).toBe('2bf516c29133360666bd942bb0d9612a83158fa61f5d2d68788c9ae5c6cd509c');
  });
  it('mutation: any other card key changed moves the hash (red)', () => {
    expect(sha({ ...card(), notes: ['x'] })).not.toBe(pin());
  });
});
