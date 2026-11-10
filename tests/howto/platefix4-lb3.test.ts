// LIB-PLATEFIX-4 item 16 (PF3 item 16, #391 6653791551 and 6682615402 "the Wrong pad must move above the hip"; PF3 PLAN
// #405 6682819340: "Wrong pad above the hip on the belly, >= 8 px above hip.r"; W4 panel L5 [3,3,4], #391 6653540190, c2:
// "Redraw the Wrong pad higher: its top edge above the hip-joint marker, under the lower belly ... Keep the Right pad below
// the hip bones"): back_extension's `bext-pad` Wrong crop draws the Roman chair with the hip pad on the belly.
// Red on main de91dd21: the Wrong crop draws the plate's pad (11.3 plate px below hip.r).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let B: any, BS: any, eng: any, plate: any, crop: any;
beforeAll(async () => {
  [B, BS, eng, plate, crop] = await Promise.all(['howto/lib_back_extension.howto.mjs', 'specs/back_extension.mjs', 'engine.mjs', '../vendor/engine/plate.mjs', 'render/closeup/crop.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
}, 600_000);

const OPTS = { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' };   // lb03.closeups.mjs's crop
const zp = () => B.default.zooms.find((z: any) => z.key === 'bext-pad');
/** The crops' specs, as the zoom shell draws them. */
const specsOf = (z: any) => {
  const probe = { points: [], specs: [] as any[] }, cut = crop.engineCrop(B.default, OPTS, { name: 'vendor', ...eng, renderPlate: plate.renderPlate }, probe);
  cut(z, 'right'); cut(z, 'wrong');
  return probe.specs.map((s: any) => s.spec);
};
/** The drawn hip pad's contact, along BX.pad.along (m): the pad is the chair's first `poly` (eq/romanChair.mjs); its face
 *  edge (the vertices nearest the thigh along the face normal) ends padAbove (6 cm) headward of the contact. */
const padContact = (eq: any[], L: any) => {
  const items = eq.flatMap((e: any) => typeof e === 'function' ? [].concat(e(L, { pose: 'end', mistake: true }) ?? []) : [e]).filter(Boolean);
  const pad = items.find((i: any) => i.type === 'poly');
  const { along, normal } = BS.BX.pad, face = (p: number[]) => p[1]! * normal[1] + p[2]! * normal[2];
  const fmin = Math.min(...pad.pts.map(face)), top = pad.pts.filter((p: number[]) => Math.abs(face(p) - fmin) < 1e-6);
  const head = Math.max(...top.map((p: number[]) => p[1]! * along[1] + p[2]! * along[2]));
  return head - 0.06;   // padAbove (eq/romanChair.mjs ROMAN_CHAIR)
};
const headwardPx = (eq: any[], z: any) => {
  const sp = B.default.plate, L = eng.landmarksOf(sp.poses.end, 1.75), { along } = BS.BX.pad;
  const ppm = plate.renderPlate(sp, { id: 'pf4b' }).report.camera.pxPerM, k = crop.PANEL / z.crop.sizePx;
  return (padContact(eq, L) - (L['hip.r'][1] * along[1] + L['hip.r'][2] * along[2])) * ppm * k;
};

describe('PF4 item 16: back_extension bext-pad Wrong pad sits on the belly, above the hip', () => {
  it('the rebuilt plate chair equals the spec\'s own (same items at the end pose), so only the pad moves', () => {
    const sp = B.default.plate, L = eng.landmarksOf(sp.poses.end, 1.75), ev = (eq: any[]) => eq.map((e: any) => e(L, { pose: 'end', mistake: false }));
    expect(ev(B.CHAIR_EQ.plate)).toEqual(ev(sp.equipment.slice(1)));
    const hi = ev(B.CHAIR_EQ.high), pl = ev(B.CHAIR_EQ.plate);
    expect(hi.filter((x: any, i: number) => JSON.stringify(x) !== JSON.stringify(pl[i])).length).toBeGreaterThan(0);
  });
  it('Wrong crop: the pad contact is >= 8 crop px above (headward of) hip.r; Right crop: the plate\'s pad, below the hip', () => {
    const z = zp(), [r, w] = specsOf(z);
    const pr = headwardPx(r.equipment, z), pw = headwardPx(w.equipment, z);
    console.log(`PF4 16: pad contact vs hip.r (crop px, + = above): Right ${pr.toFixed(2)}, Wrong ${pw.toFixed(2)}`);
    expect(pw).toBeGreaterThanOrEqual(8);
    expect(pr).toBeLessThan(0);
    expect(w.equipment).toBe(z.wrong.equipmentList);
    expect(z.wrong.pose).toBe(B.default.plate.mistake.pose);   // the curled back stays the plate's Mistake, dashed over the Right
    expect(z.wrong.solid).toBeUndefined();
  });
  it('mutation: the Wrong crop without equipmentList draws the plate pad, below the hip', () => {
    const z = { ...zp(), wrong: { ...zp().wrong, equipmentList: undefined } }, [, w] = specsOf(z);
    expect(headwardPx(w.equipment, z)).toBeLessThan(8);
  });
});
