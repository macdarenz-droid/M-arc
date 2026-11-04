// F-CROP-FRONT (f-crop-front-card, Q-W2-8): a posture crop (render/closeup/crop.mjs engineCrop) projects every world
// point exactly as its plate does, for every view, facing and pitch. Reference: the engine's own makeCamera
// (vendor/engine/plate.mjs, not exported), taken from the vendored source as it stands (as f-zoom-pitch.test.ts does),
// fed the plate's spec and the fitted camera the crops reuse (base.report.camera).
//   A1 parity: every point a crop projects (centre, callout anchors, guides) is within 0.01 px of the engine's projection.
//   A3: the crop's own drawn spec projects as the plate does (front stays front, facing and pitch kept), and the drawn
//       anchor dot sits on the engine's point within the svg's 2-decimal rounding.
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const href = (p: string) => new URL(p, ROOT).href;
const path = (p: string) => new URL(p, ROOT).pathname;

const load = async () => {
  const [crop, cu, geom] = await Promise.all(['tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeups.mjs',
    'tools/plates/vendor/engine/geom.mjs'].map(p => import(/* @vite-ignore */ href(p))));
  const src = readFileSync(path('tools/plates/vendor/engine/plate.mjs'), 'utf8').match(/function makeCamera\([\s\S]*?\n}\n/)![0];
  const makeCamera = new Function('R', `${src}return makeCamera;`)(geom.R);
  return { crop, cu, makeCamera };
};

// The ids and why: the 4 front views of Q-W2-8, a second pitched front, the one library spec facing left, one facing right.
const CASES: [string, string][] = [
  ['cable_fly', 'front'], ['upright_row', 'front'], ['pec_fly', 'front'], ['dumbbell_fly', 'front, pitched'],
  ['bent_over_dumbbell_rear_delt_fly__alt', 'front, pitched'], ['pallof_press', 'side, facing left'], ['cable_crunch', 'side, facing right'],
];
// Fixture zooms: landmark, offset and world-point refs (x and z off zero, so a dropped facing sign or pitch term shows).
const ZOOMS = [
  { key: 'solid', alt: { right: 'r', wrong: 'w' }, right: 'end', wrong: { base: 'start', pose: {}, solid: true },
    crop: { center: 'elbow.r', sizePx: 120 },
    callout: { right: { anchor: 'elbow.r', text: 'a' }, wrong: { anchor: { at: 'wrist.r', off: [1, -2] }, text: 'b' } },
    guides: [{ kind: 'level', at: [0.21, 1.17, 0.33] }, { kind: 'path', role: 'right', pts: [[0.1, 1.0, 0.2], [0.3, 1.2, 0.4]] }] },
  { key: 'over', alt: { right: 'r', wrong: 'w' }, right: 'end', wrong: { base: 'start', pose: {}, parts: [] },
    crop: { center: [0.12, 1.31, 0.27], centerWrong: 'shoulder.l', sizePx: 150 },
    callout: { right: { anchor: 'wrist.l', text: 'a' }, wrong: { anchor: { at: 'elbow.l', pose: 'mistake' }, text: 'b' } },
    guides: [{ kind: 'level', at: 'shoulder.r', own: true }] },
];
const OPTS = { landmarks: 'spec', solidPose: 'own' };

describe('F-CROP-FRONT crops project as the plate', { timeout: 300_000 }, () => {
  it.each(CASES)('%s (%s): every crop anchor is the engine\'s projection (A1) and the crop draws the plate\'s view (A3)', async id => {
    const { crop, cu, makeCamera } = await load();
    const specFile = path(`tools/plates/library/specs/${id}.mjs`);
    const plate = (await import(/* @vite-ignore */ href(`tools/plates/library/specs/${id}.mjs`))).default;
    const engine = await cu.engineOf(specFile);
    expect(engine.name).toBe('vendor');
    const cam = engine.renderPlate(plate, { id: 'base' }).report.camera;
    const ref = makeCamera(plate, cam).P;
    const probe = { points: [] as any[], specs: [] as any[] };
    const cropHalf = crop.engineCrop({ plate, zooms: ZOOMS }, OPTS, engine, probe);
    for (const z of ZOOMS) for (const role of ['right', 'wrong']) {
      const at = probe.points.length, html = cropHalf(z, role);
      // A3: the drawn anchor dot (panel px) mapped back to plate px sits on the engine's point of the callout anchor
      const [vx, vy, s] = html.match(/viewBox="(-?[\d.]+) (-?[\d.]+) (\d+) \d+" class="z-plate"/)!.slice(1).map(Number);
      const [cx, cy] = html.match(/<circle class="z-anchor [a-z]+" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/)!.slice(1).map(Number);
      const k = crop.PANEL / s, anchor = probe.points[at + 1];   // resolveRefs order: the centre, then the callout anchor
      const [dx, dy] = (z.callout as any)[role].anchor.off ?? [0, 0], want = ref(anchor.w);
      expect(Math.abs(vx + cx / k - (want[0] + dx)), `${id} ${z.key}-${role} drawn anchor x`).toBeLessThan(0.02);
      expect(Math.abs(vy + cy / k - (want[1] + dy)), `${id} ${z.key}-${role} drawn anchor y`).toBeLessThan(0.02);
    }
    // A1: every projected point
    expect(probe.points.length).toBe(14);   // 4 crops: centres, anchors, levels and the path points
    for (const { key, w, px } of probe.points) {
      const e = ref(w);
      expect(Math.hypot(px[0] - e[0], px[1] - e[1]), `${id} ${key} [${w.map((v: number) => v.toFixed(3))}]: crop (${px.map((v: number) => v.toFixed(2))}) vs engine (${e.map((v: number) => v.toFixed(2))})`).toBeLessThan(0.01);
    }
    // A3: each crop spec drawn projects as the plate (view, facing, pitch) at the plate's camera
    expect(probe.specs.length).toBe(4);
    const W = [[0.12, 1.31, 0.27], [-0.4, 0.05, -0.33], [0.71, 0.92, 0.58]];
    for (const { key, role, spec } of probe.specs) {
      const P = makeCamera(spec, spec.camera).P;
      for (const w of W) { const a = P(w), b = ref(w); expect(Math.hypot(a[0] - b[0], a[1] - b[1]), `${id} ${key}-${role} drawn view`).toBeLessThan(0.01); }
    }
  });
});
