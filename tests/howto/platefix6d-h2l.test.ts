// LIB-PLATEFIX-6d high_to_low_cable_fly (F-H2L-ENDPOSE; card lib-platefix-6c-card.md Row 5, A11, A12, m13, m14;
// rulings D-PF6D-H2LR5 route C, D-PF6D-SIDEVIEW). W10 round 1 (#434): c1 T04 L1 "the hands meet at chest height ...
// the arms are short folded stubs", c3 T04 L1 "the cables end at the elbows/forearms", c1/c2/c3 T04 L5 "the Trunk
// zoom is a front view, where a forward tip cannot be seen". Measured from the engine's render, landmarks and the
// equipment it draws at the render's camera ("plate px"), never from the spec's constants.
//  A11: each end grip >= 0.2 m below the chest landmark and within 5 cm of the navel's height (c5, c1 "around navel
//       height"); the ELBOW rule unchanged (the 20 deg fixed bend: 160 deg at the elbow in start and end, lb6/sizes.json
//       r2 ELBOW 20 with its basis); the drawn end arm (shoulder-elbow-grip) >= 80 % of the drawn start arm; each cable
//       ends on its handle (1 px) and runs >= 8 px clear of its elbow (so it no longer reads as tied to the elbow).
//  A12: the Trunk close-up is drawn in side view (the zoom's own view: 'side', render/closeup/crop.mjs): the Right trunk
//       (hip centre to shoulder centre, as the crop projects it) within 3 deg of vertical, the Wrong tipped >= 15 deg,
//       the arms the same in both (trunk-to-reach and elbow angles within 0.5 deg); no cable column is drawn in it.
// Red on the base (ff75bf0e): grips 0.100 m under the chest, 0.119 m above the navel; drawn arm 35.8 / 81.8 px (0.44);
// the right cable 0.04 px off the elbow; the Trunk crop in front view, the Wrong 0.0 deg on screen.
// Mistake (D-PF6D-H2LR5B): red fists 14 cm past the midline (was 3 cm, the fists touching), apart and off the solid arms.
// After (END_DROP 0.22, camera pitch 20): 0.220 m under the chest, 0.001 m off the navel; 65.4 / 78.4 px (0.83);
// cable 12.1 px off the elbow, on the handle (0 px); Trunk crop side view, Right 0.0 deg, Wrong 30.0 deg.
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const SPEC = fileURLToPath(lib('specs/high_to_low_cable_fly.mjs'));
const T = 600_000, H = 1.75;
let plate: any, qaEng: any, body: any, eq: any, crop: any, cu: any, S: any, howto: any, OPT: any;
const tmp: string[] = [];
beforeAll(async () => {
  [plate, qaEng, body, eq, crop, cu, S, howto, OPT] = await Promise.all(['../vendor/engine/plate.mjs', 'qa/engine.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs',
    'render/closeup/crop.mjs', 'render/closeups.mjs', 'specs/high_to_low_cable_fly.mjs', 'howto/lib_high_to_low_cable_fly.howto.mjs', 'pages/lb06.closeups.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  S = S.default; howto = howto.default; OPT = OPT.CLOSEUP_OPTIONS.high_to_low_cable_fly;
}, T);
afterAll(() => { for (const d of tmp) rmSync(d, { recursive: true, force: true }); });

/** The spec module with its source text edited (m13), imported from a scratch copy whose engine import is the library's. */
const specWith = async (edit: (s: string) => string) => {
  const src = readFileSync(SPEC, 'utf8'), out = edit(src);
  expect(out, 'the edit must change the spec').not.toBe(src);
  const d = mkdtempSync(join(tmpdir(), 'pf6d-h2l-')); tmp.push(d);
  writeFileSync(join(d, 'spec.mjs'), out.replace("from '../engine.mjs'", `from ${JSON.stringify(lib('engine.mjs'))}`));
  return (await import(/* @vite-ignore */ pathToFileURL(join(d, 'spec.mjs')).href)).default;
};

type V = number[];
const segD = (p: V, a: V, b: V) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0;
  return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
const sub = (a: V, b: V) => a.map((v, i) => v - b[i]!), mid = (a: V, b: V) => a.map((v, i) => (v + b[i]!) / 2);
const ang = (a: V, b: V) => Math.acos(a.reduce((s, v, i) => s + v * b[i]!, 0) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI;
const d2 = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);

/** A11's numbers for one spec. */
const endPose = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf6d' }), cam = qaEng.cameraOf(spec, r.report), E = { renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body };
  const L = qaEng.poseLandmarks(E, spec), P = (pose: string, k: string): V => cam.P(L.lm[pose][k]), e = L.lm.end;
  const drawn = (pose: string, sd: string) => d2(P(pose, `shoulder.${sd}`), P(pose, `elbow.${sd}`)) + d2(P(pose, `elbow.${sd}`), P(pose, `grip.${sd}`));
  const elbowDeg = (pose: string, sd: string) => { const l = L.lm[pose]; return ang(sub(l[`shoulder.${sd}`], l[`elbow.${sd}`]), sub(l[`grip.${sd}`], l[`elbow.${sd}`])); };
  const items = [...qaEng.equipmentItems(E, spec, r.report, ['end']).end.values()];
  const handles = items.filter((x: any) => x.type === 'line').map((x: any) => x.line as V[]), cables = items.filter((x: any) => x.type === 'cable').map((x: any) => x.line as V[]);
  const sides = ['r', 'l'];
  return {
    belowChest: sides.map(sd => e.chest[1] - e[`grip.${sd}`][1]), offNavel: sides.map(sd => Math.abs(e[`grip.${sd}`][1] - e.navel[1])),
    elbowDeg: sides.flatMap(sd => ['start', 'end'].map(p => elbowDeg(p, sd))), ratio: sides.map(sd => drawn('end', sd) / drawn('start', sd)),
    drawn: sides.map(sd => [drawn('start', sd), drawn('end', sd)]),
    // each cable's end on a handle polyline (plate px), and the elbow of its side off the cable's line
    onHandle: cables.map(c => Math.min(...handles.map(h => Math.min(...h.slice(1).map((q, i) => segD(c[c.length - 1]!, h[i]!, q)))))),
    elbowOff: cables.map(c => { const end = c[c.length - 1]!, sd = end[0]! < cam.P([0, 0, 0])[0]! ? 'r' : 'l'; return segD(P('end', `elbow.${sd}`), c[0]!, end); }),
    cables: cables.length, handles: handles.length,
  };
};
/** A11 problems. */
const a11 = (m: any) => [
  ...(m.belowChest.every((v: number) => v >= 0.2) ? [] : ['not 0.2 m below the chest']),
  ...(m.offNavel.every((v: number) => v <= 0.05) ? [] : ['not at navel height']),
  ...(m.elbowDeg.every((v: number) => Math.abs(v - 160) <= 0.5) ? [] : ['elbow not the fixed 20 deg bend']),
  ...(m.ratio.every((v: number) => v >= 0.8) ? [] : ['drawn end arm < 80 %']),
  ...(m.cables === 2 && m.handles === 2 && m.onHandle.every((v: number) => v <= 1) ? [] : ['cable off its handle']),
  ...(m.elbowOff.every((v: number) => v >= 8) ? [] : ['cable on the elbow']),
];

describe('PF6d h2l A11: the end pose (long arms, hands at navel height, cables to the handles)', { timeout: T }, () => {
  let m: any;
  beforeAll(() => { m = endPose(S);
    console.log(`PF6d h2l A11: ${m.belowChest.map((v: number) => v.toFixed(3))} m under the chest, ${m.offNavel.map((v: number) => v.toFixed(3))} m off the navel; drawn arm ${m.drawn.map((d: number[]) => d.map(v => v.toFixed(1)).join(' -> '))} px (${m.ratio.map((v: number) => v.toFixed(3))}); elbow ${m.elbowDeg.map((v: number) => v.toFixed(1))}; cable on handle ${m.onHandle.map((v: number) => v.toFixed(2))} px, ${m.elbowOff.map((v: number) => v.toFixed(1))} px off the elbow`); }, T);
  it('each grip >= 0.2 m under the chest, at navel height (5 cm); ELBOW rule unchanged; drawn end arm >= 80 %; each cable ends on its handle (1 px), >= 8 px off its elbow', () => {
    expect(a11(m)).toEqual([]);
    const row = JSON.parse(readFileSync('tools/plates/library/lb6/sizes.json', 'utf8')).r2.ids.high_to_low_cable_fly.ELBOW;
    expect(row).toEqual({ value: 20, unit: 'deg', basis: 'convention: cable_fly.mjs:40 (pilot B), the fixed slight elbow bend (c4, c6 / c3)' });
  });
  it('m13: END_DROP back at 0.1 is red (the hands at chest height, short arms, the cable on the elbow)', async () => {
    const m13 = await specWith(s => s.replace('END_DROP: 0.22,', 'END_DROP: 0.1,'));
    expect(a11(endPose(m13))).toEqual(expect.arrayContaining(['not 0.2 m below the chest', 'not at navel height']));
  });
});

describe('PF6d h2l Mistake (D-PF6D-H2LR5B): the hands cross well over, distinct from the solid arms', { timeout: T }, () => {
  /** Each red fist's centre past the midline on the far side (m), the two red fists apart (plate px, centre distance less
   *  two FIST_R rings), and each red elbow off its solid elbow (plate px). */
  const cross = (spec: any) => {
    const r = plate.renderPlate(spec, { id: 'pf6d-m' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body }, spec).lm;
    const m = L.mistake, e = L.end, P = (w: V) => cam.P(w);
    return { past: [m['grip.r'][0], -m['grip.l'][0]], apart: d2(P(m['grip.r']), P(m['grip.l'])) - 2 * 0.035 * cam.pxm, elbowOff: ['r', 'l'].map(sd => d2(P(m[`elbow.${sd}`]), P(e[`elbow.${sd}`]))) };
  };
  const problems = (c: any) => [...(c.past.every((v: number) => v >= 0.1) ? [] : ['not 10 cm past the midline']), ...(c.apart >= 8 ? [] : ['red fists touch']),
    ...(c.elbowOff.every((v: number) => v >= 8) ? [] : ['red arms on the solid ones'])];
  it('each red fist >= 10 cm past the midline on the far side, the red fists >= 8 px apart, each red elbow >= 8 px off the solid one; H2LR5\'s drawing (MIS_X 0.03, MIS_DROP 0.22, MIS_SWIVEL 45) is red', async () => {
    const c = cross(S);
    console.log(`PF6d h2l Mistake: ${c.past.map((v: number) => v.toFixed(3))} m past the midline, fists ${c.apart.toFixed(1)} px apart, elbows ${c.elbowOff.map((v: number) => v.toFixed(1))} px off the solid ones`);
    expect(problems(c)).toEqual([]);
    const was = await specWith(t => t.replace('MIS_X: 0.14, MIS_DROP: -0.08, MIS_SWIVEL: -30', 'MIS_X: 0.03, MIS_DROP: 0.22, MIS_SWIVEL: 45'));
    expect(problems(cross(was))).toEqual(expect.arrayContaining(['not 10 cm past the midline', 'red fists touch']));
  });
});

describe('PF6d h2l A12: the Trunk close-up in side view (D-PF6D-SIDEVIEW)', { timeout: T }, () => {
  /** Each half of the Trunk zoom as the page crops it: the drawn spec, its view, its trunk tilt on screen, its arm angles. */
  const halves = async (z: any) => {
    const specFile = SPEC, engine = await cu.engineOf(specFile), probe = { points: [] as any[], specs: [] as any[] };
    const cropHalf = crop.engineCrop(howto, OPT.crop, engine, probe);
    return ['right', 'wrong'].map(role => {
      cropHalf(z, role);
      const { spec } = probe.specs[probe.specs.length - 1], cam = qaEng.cameraOf(spec, engine.renderPlate(spec, { id: 'pf6d-t' }).report);
      const lm = engine.landmarksOf(spec.poses.end, H), sh = mid(lm['shoulder.r'], lm['shoulder.l']), hp = mid(lm['hip.r'], lm['hip.l']);
      const a = cam.P(sh), b = cam.P(hp), tilt = Math.abs(Math.atan2(a[0]! - b[0]!, b[1]! - a[1]!) * 180 / Math.PI);
      const arms = ['r', 'l'].flatMap(sd => [ang(sub(sh, hp), sub(lm[`grip.${sd}`], lm[`shoulder.${sd}`])), ang(sub(lm[`shoulder.${sd}`], lm[`elbow.${sd}`]), sub(lm[`grip.${sd}`], lm[`elbow.${sd}`]))]);
      return { role, view: spec.view, tilt, arms, columns: spec.equipment.some((e: any) => typeof e === 'function') };
    });
  };
  const zoom = () => howto.zooms.find((z: any) => z.key === 'htl-trunk');
  it('both halves in side view: Right within 3 deg of vertical, Wrong tipped >= 15 deg, the arms the same, no column drawn', async () => {
    expect(zoom().view).toBe('side');
    const [R, W] = await halves(zoom());
    console.log(`PF6d h2l A12: ${R!.view}/${W!.view}, Right ${R!.tilt.toFixed(2)} deg, Wrong ${W!.tilt.toFixed(2)} deg, arms ${R!.arms.map((v: number) => v.toFixed(2))} / ${W!.arms.map((v: number) => v.toFixed(2))}`);
    expect([R!.view, W!.view]).toEqual(['side', 'side']);
    expect(R!.tilt).toBeLessThanOrEqual(3);
    expect(W!.tilt).toBeGreaterThanOrEqual(15);
    R!.arms.forEach((v: number, i: number) => expect(Math.abs(v - W!.arms[i]!)).toBeLessThanOrEqual(0.5));
    expect([R!.columns, W!.columns]).toEqual([false, false]);
  });
  it('m14: the Trunk zoom in front view (its view removed) is red: the Wrong reads upright on screen', async () => {
    const { view, ...front } = zoom(); void view;
    const [R, W] = await halves(front);
    expect([R!.view, W!.view]).toEqual(['front', 'front']);
    expect(W!.tilt).toBeLessThan(15);
  });
});
