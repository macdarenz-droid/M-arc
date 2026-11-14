// F-BSS-REARKNEE (F-HT4-RIGHTPOSE part 2, f-ht4-rightpose-card.md): bulgarian_split_squat's Rear knee close-up. Both
// halves show a full-width floor line well inside the panel, a visible gap under the Right knee, and the Wrong kneecap
// on the floor, with the rear knee, shin and bench still filling the frame (L7). Measured on the built crop svgs
// (render/closeup/crop.mjs engineCrop, lb04's crop options) and on engine landmarks projected with the crop's camera
// (the engineCrop probe: the crop's own projected centre fixes the camera the test uses).
//   C7 floor in view: the floor line >= FLOOR_MIN panel px above the bottom edge; the crop's x range inside the floor's
//      drawn extent.
//   C8 gap and contact: the Right kneecap's lowest point >= GAP_MIN panel px above the floor line; the Wrong's within
//      CONTACT_MAX of it.
//   C9 L7 kept: knee.l and ankle.l of each half's pose, the bench's front top corner and its top edge's height >= EDGE_MIN
//      panel px from every edge.
// Each `red:` case is a card mutation (m9-m13) applied in memory; it must turn its check red.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url);
const href = (p: string) => new URL(p, ROOT).href;
const path = (p: string) => new URL(p, ROOT).pathname;
const SPEC = 'tools/plates/library/specs/bulgarian_split_squat.mjs';
const HOWTO = 'tools/plates/library/howto/lib_bulgarian_split_squat.howto.mjs';

// The card's proposals (C7-C9), as ruled at PLAN.
const FLOOR_MIN = 20, GAP_MIN = 15, CONTACT_MAX = 1, EDGE_MIN = 8;

const load = async () => {
  const [crop, cu, common, opts, mod, body] = await Promise.all([
    'tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeups.mjs', 'tools/plates/library/render/closeup/common.mjs',
    'tools/plates/library/pages/lb04.closeups.mjs', HOWTO, 'tools/plates/vendor/engine/body.mjs',
  ].map(p => import(/* @vite-ignore */ href(p))));
  const engine = await cu.engineOf(path(SPEC));
  return { crop, engine, mergeDeep: common.mergeDeep, OPTS: opts.CLOSEUP_OPTIONS.bulgarian_split_squat.crop, howto: mod.default, RADII: body.RADII };
};

type M = { role: string; floorBottom: number; floorX: [number, number]; vx: number; s: number; gap: number; edges: Record<string, number> };
/** Both halves' numbers for the howto `howto` with its rear-knee zoom `z` (the howto's own when omitted). */
async function measure(over: { zoom?: (z: any) => any; plate?: (p: any) => any } = {}): Promise<M[]> {
  const { crop, engine, mergeDeep, OPTS, howto: h0, RADII } = await load();
  const howto = { ...h0, plate: over.plate ? over.plate(h0.plate) : h0.plate };
  const z0 = howto.zooms.find((z: any) => z.key === 'rear-knee');
  expect(z0, 'the rear-knee zoom').toBeTruthy();
  const z = over.zoom ? over.zoom(z0) : z0;
  const H = howto.plate.body?.height ?? 1.75, KC = RADII.kneeCap * H;
  const poseOf = (ref: any) => typeof ref === 'string' ? howto.plate.poses[ref] : mergeDeep(howto.plate.poses[ref.base], ref.pose);
  const bench = howto.plate.equipment.find((e: any) => e.type === 'bench');
  const out: M[] = [];
  for (const role of ['right', 'wrong']) {
    const probe = { points: [] as any[], specs: [] as any[] };
    const html: string = crop.engineCrop(howto, OPTS, engine, probe)(z, role);
    const [vx, vy, s] = html.match(/viewBox="(-?[\d.]+) (-?[\d.]+) (\d+) \d+" class="z-plate"/)!.slice(1).map(Number);
    const floors = [...html.matchAll(/class="floorline"[^>]*d="M(-?[\d.]+) (-?[\d.]+)H(-?[\d.]+)"|d="M(-?[\d.]+) (-?[\d.]+)H(-?[\d.]+)"[^>]*class="floorline"/g)];
    expect(floors.length, `${role}: one floor line`).toBe(1);
    const [fx0, fy, fx1] = (floors[0]![1] ? floors[0]!.slice(1, 4) : floors[0]!.slice(4, 7)).map(Number);
    // the crop's camera: side view facing right, x = x0 + z ppm, y = y0 - y ppm; fixed from the centre the crop projected
    const c = probe.points[0], w0 = c.w, p0 = c.px;
    const ppm = engine.renderPlate(howto.plate, { id: 'base' }).report.camera.pxPerM;
    const P = (w: number[]) => [p0[0] + (w[2]! - w0[2]) * ppm, p0[1] - (w[1]! - w0[1]) * ppm];
    for (const q of probe.points) { const e = P(q.w); expect(Math.hypot(e[0]! - q.px[0], e[1]! - q.px[1]), `${role}: the test's camera is the crop's`).toBeLessThan(0.01); }
    const k = 171 / s, T = ([x, y]: number[]) => [(x! - vx) * k, (y! - vy) * k];
    const lm = engine.landmarksOf(role === 'right' ? poseOf(z.right) : poseOf(z.wrong), H);
    const knee = lm['knee.l'], low = T(P([0, knee[1] - KC, knee[2]]))[1]!, floorY = T([0, fy])[1]!;
    const front = bench.at[2] + bench.width / 2, corner = T(P([0, bench.at[1], front])), top = corner[1]!;
    const e = (p: number[]) => Math.min(p[0]!, p[1]!, 171 - p[0]!, 171 - p[1]!);
    out.push({ role, floorBottom: 171 - floorY, floorX: [fx0, fx1], vx, s, gap: floorY - low,
      edges: { 'knee.l': e(T(P(knee))), 'ankle.l': e(T(P(lm['ankle.l']))), 'bench corner': e(corner), 'bench top': Math.min(top, 171 - top) } });
  }
  return out;
}
const c7 = (ms: M[]) => ms.flatMap(m => [
  ...(m.floorBottom >= FLOOR_MIN ? [] : [`${m.role}: floor ${m.floorBottom.toFixed(1)} px above the bottom edge < ${FLOOR_MIN}`]),
  ...(m.vx >= m.floorX[0] && m.vx + m.s <= m.floorX[1] ? [] : [`${m.role}: crop x [${m.vx}, ${m.vx + m.s}] outside the floor [${m.floorX.join(', ')}]`])]);
const c8 = (ms: M[]) => ms.flatMap(m => m.role === 'right'
  ? (m.gap >= GAP_MIN ? [] : [`right: kneecap ${m.gap.toFixed(1)} px above the floor < ${GAP_MIN}`])
  : (Math.abs(m.gap) <= CONTACT_MAX ? [] : [`wrong: kneecap ${m.gap.toFixed(1)} px off the floor > ${CONTACT_MAX}`]));
const c9 = (ms: M[]) => ms.flatMap(m => Object.entries(m.edges).filter(([, v]) => !(v >= EDGE_MIN)).map(([n, v]) => `${m.role}: ${n} ${v.toFixed(1)} px from an edge < ${EDGE_MIN}`));
const withCrop = (crop: any) => ({ zoom: (z: any) => ({ ...z, crop: { ...z.crop, ...crop, center: { ...z.crop.center, ...crop.center } } }) });

describe('F-BSS-REARKNEE: the Rear knee close-up', { timeout: 120_000 }, () => {
  it('C7: the floor line is well inside both halves and spans their full width', async () => { expect(c7(await measure())).toEqual([]); });
  it('C8: a gap under the Right kneecap; the Wrong kneecap on the floor', async () => { expect(c8(await measure())).toEqual([]); });
  it('C9: knee, ankle and bench top stay inside both halves (L7)', async () => { expect(c9(await measure())).toEqual([]); });
  it('red m9: main\'s crop window (off [-40, -24]) fails C7', async () => {
    expect(c7(await measure(withCrop({ center: { off: [-40, -24] } })))).toEqual([
      expect.stringMatching(/^right: floor 3\.1 px above the bottom edge < 20$/), expect.stringMatching(/^wrong: floor 3\.1 px above the bottom edge < 20$/)]);
  });
  it('red m10: the Right drawn at the Wrong\'s pose fails C8 (gap)', async () => {
    expect(c8(await measure({ zoom: z => ({ ...z, right: z.wrong }) }))).toEqual([expect.stringMatching(/^right: kneecap .* px above the floor < 15$/)]);
  });
  it('red m11: the Wrong kneecap lifted 1 cm fails C8 (contact)', async () => {
    expect(c8(await measure({ zoom: z => ({ ...z, wrong: { ...z.wrong, pose: { ...z.wrong.pose, root: { ...z.wrong.pose.root, at: [z.wrong.pose.root.at[0], z.wrong.pose.root.at[1] + 0.01, z.wrong.pose.root.at[2]] } } } }) })))
      .toEqual([expect.stringMatching(/^wrong: kneecap .* px off the floor > 1$/)]);
  });
  it('red m12: a floor that stops inside the panel fails C7 (width)', async () => {
    const short = (p: any) => ({ ...p, equipment: p.equipment.map((e: any) => e.type === 'floor' ? { ...e, to: -0.4 } : e) });
    expect(c7(await measure({ plate: short }))).toEqual([expect.stringMatching(/^right: crop x .* outside the floor/), expect.stringMatching(/^wrong: crop x .* outside the floor/)]);
  });
  it('red m13: a crop moved so the ankle and bench top leave the frame fails C9', async () => {
    expect(c9(await measure(withCrop({ center: { off: [-40, 30] } })))).toEqual(expect.arrayContaining([expect.stringMatching(/^right: ankle\.l /), expect.stringMatching(/^wrong: bench top /)]));
  });
});
