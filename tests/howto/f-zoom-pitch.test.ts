// F-ZOOM-PITCH (f-zoom-pitch-card; ruling D-ZOOM-PITCH): the QA's camera (qa/engine.mjs cameraOf) and the zoom
// circle's camera (zoom/inline.mjs zoomOf) carry LIB-20's `camera.pitch`, so a pitched plate's ring and circle sit on
// the drawn ink. With no pitch both are the unpitched projection, byte for byte (A3 is the PR's before/after proof).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const vendor = (f: string) => new URL(`../../tools/plates/vendor/engine/${f}`, import.meta.url);
const load = async () => {
  const [qe, zoom, plate, body, geom] = await Promise.all([lib('qa/engine.mjs'), lib('zoom/inline.mjs'),
    vendor('plate.mjs').href, vendor('body.mjs').href, vendor('geom.mjs').href].map(f => import(/* @vite-ignore */ f)));
  // the engine's own makeCamera (plate.mjs:38-47, not exported), taken from the vendored source as it stands
  const src = readFileSync(vendor('plate.mjs'), 'utf8').match(/function makeCamera\([\s\S]*?\n}\n/)![0];
  const makeCamera = new Function('R', `${src}return makeCamera;`)(geom.R);
  return { qe, zoom, plate, body, makeCamera };
};
const W = [[0.12, 1.31, 0.27], [-0.4, 0.05, -0.33], [0.71, 0.92, 0.58]];
const CAM = { pxPerM: 197.49, x0: 170.3, y0: 331.8 };

describe('F-ZOOM-PITCH A1: cameraOf is the engine projection', () => {
  it('3 world points at pitch 0, 15 and 45, front and side, equal makeCamera to 1e-9', async () => {
    const { qe, makeCamera } = await load();
    for (const view of ['front', 'side']) for (const pitch of [0, 15, 45]) for (const facing of ['left', 'right']) {
      const spec = { view, facing, camera: { fit: true, pitch } }, want = makeCamera(spec, CAM);
      const got = qe.cameraOf(spec, { view, camera: CAM });
      for (const w of W) {
        const a = got.P(w), b = want.P(w);
        expect(Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]), `${view} ${facing} ${pitch}° ${w}`).toBeLessThan(1e-9);
      }
    }
  });
  it('no pitch keeps the unpitched numbers exactly; a pitch-blind projection is off by px at 15° and 45° (the mutation bites)', async () => {
    const { qe } = await load();
    const flat = (w: number[]) => [CAM.x0 + w[0]! * CAM.pxPerM, CAM.y0 - w[1]! * CAM.pxPerM];
    for (const camera of [undefined, {}, { pitch: 0 }]) for (const w of W) expect(qe.cameraOf({ view: 'front', camera }, { view: 'front', camera: CAM }).P(w)).toEqual(flat(w));
    for (const pitch of [15, 45]) {
      const P = qe.cameraOf({ view: 'front', camera: { pitch } }, { view: 'front', camera: CAM }).P;
      expect(Math.max(...W.map(w => Math.abs(P(w)[1]! - flat(w)[1]!))), `${pitch}°`).toBeGreaterThan(5);
    }
  });
});

describe('F-ZOOM-PITCH A2: the circle copies its ring on a pitched plate', () => {
  // fixture: main's russian_twist (front, camera fit, pitch 20) raised to pitch 45 with a Mistake zoom at k 3
  const LMS = ['knee.l', 'wrist.r', 'head', 'toe.r'];
  const run = async (pitch: number, k: number) => {
    const { qe, zoom, plate, body, makeCamera } = await load();
    const rt = (await import(/* @vite-ignore */ lib('specs/russian_twist.mjs'))).default;
    const spec = { ...rt, camera: { ...rt.camera, pitch }, zoom: { view: 'mistake', k } };
    const calls: any[] = [], E = { body, renderPlate: (s: any, o: any) => { calls.push(s); return plate.renderPlate(s, o); } };
    const z = zoom.zoomOf(spec, { E }), zs = calls[1];
    const cam = qe.cameraOf(spec, plate.renderPlate(spec, { id: 'x', mistake: true }).report);
    const drawn = makeCamera(zs, { ...plate.REF_CAMERA, ...zs.camera });   // the engine's camCfg with no fit (plate.mjs:94, :111)
    const lm = qe.poseLandmarks({ body }, spec).lm.mistake;
    return { z, zs, miss: LMS.map(n => { const p = cam.P(lm[n]), want = [z.circle.c[0] + k * (p[0] - z.focus[0]), z.circle.c[1] + k * (p[1] - z.focus[1])], d = drawn.P(lm[n]);
      return Math.hypot(d[0] - want[0], d[1] - want[1]); }) };
  };
  it('4 landmarks in the circle sit at circle centre + k × (plate position − ring centre), within 0.05 px', async () => {
    const { z, zs, miss } = await run(45, 3);
    expect(zs.camera.pitch).toBe(45);
    expect('fit' in zs.camera).toBe(false);
    expect(zs.camera.pxPerM).toBeCloseTo(197.49 * 3, 9);
    expect(z.k).toBe(3);
    for (const [i, m] of miss.entries()) expect(m, LMS[i]).toBeLessThan(0.05);
  }, 120_000);
});
