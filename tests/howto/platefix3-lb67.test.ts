// LIB-PLATEFIX-3 W6 items (PLAN ADDENDUM ruled #405 6683319630; W6 PANEL FIX #393 6683164302): machine_pullover,
// rear_delt_fly, high_to_low_cable_fly, smith_machine_squat. Values are read from the engine's landmarks, shapes and
// drawn svg (the render's own camera), never from the specs' constants. Main's drawings fail every block (recorded on
// the PR).
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let plate: any, body: any, eq: any, qaEng: any, mp: any, mpMod: any, rdf: any, htl: any, sms: any, lth: any;
beforeAll(async () => {
  [plate, body, eq, qaEng] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  mpMod = await import(/* @vite-ignore */ lib('specs/machine_pullover.mjs')); mp = mpMod.default;
  rdf = (await import(/* @vite-ignore */ lib('specs/rear_delt_fly.mjs'))).default;
  htl = (await import(/* @vite-ignore */ lib('specs/high_to_low_cable_fly.mjs'))).default;
  sms = (await import(/* @vite-ignore */ lib('specs/smith_machine_squat.mjs'))).default;
  lth = (await import(/* @vite-ignore */ lib('specs/low_to_high_cable_fly.mjs'))).default;
}, 600_000);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const H = 1.75, B = { height: H };
const probe = { view: 'side', facing: 'right', near: 'r', pxm: 1, P: (w: number[]) => [w[2]!, -w[1]!] };

/** machine_pullover: the largest gap (px at the plate's scale) between the pad face and the back edge of the torso
 *  outline, from the buttock to the upper back, in one pose. */
const backGap = (pose: any, pxm: number) => {
  const pad = mpMod.PM.pad, off = (y: number, z: number) => ((y - pad.point[1]) * pad.normal[1] + (z - pad.point[2]) * pad.normal[2]) * pxm;
  const sk = body.fk(body.resolve(body.normPose(pose, B), B).q, B), lm = body.landmarks(sk);
  const torso = body.bodyShapes(sk, probe).find((s: any) => s.key === 'torso').poly;
  let best = -1e9;
  for (let y = lm.buttock[1] + 0.03; y <= lm.backUpper[1] - 0.03; y += 0.005) {
    let mn = 1e9;
    for (let i = 0; i < torso.length; i++) {
      const a = torso[i], b = torso[(i + 1) % torso.length], ya = -a[1], yb = -b[1];
      if ((ya - y) * (yb - y) > 0 || ya === yb) continue;
      mn = Math.min(mn, off(y, a[0] + (b[0] - a[0]) * (y - ya) / (yb - ya)));
    }
    if (mn < 1e9) best = Math.max(best, mn);
  }
  return { gap: best, backUpper: off(lm.backUpper[1], lm.backUpper[2]), buttock: off(lm.buttock[1], lm.buttock[2]), seat: lm.seat };
};

// machine_pullover: held at main's drawing (D-LIB13-PANEL2, #405 6688665575); its PF3 tests leave with its drawing (kept in history at d8cd3ac7).

// rear_delt_fly: held at main's drawing (D-LIB13-PANEL2, #405 6688665575); its PF3 tests leave with its drawing (kept in history at d8cd3ac7).

// high_to_low_cable_fly: held at main's drawing (D-LIB13-PANEL2, #405 6688665575); its PF3 tests leave with its drawing (kept in history at d8cd3ac7).

describe('PF3 W6 smith_machine_squat: the knees tell names no landmark (c3)', () => {
  it('the knees tell cue is "Your knees travel too far forward."', () => {
    expect(sms.mistake.tells.find((t: any) => t.key === 'knees').cue).toBe('Your knees travel too far forward.');
  });
});

// W6b: low_to_high_cable_fly (#393 6683164302 L5 "the tangled press arms and crossed hands"; ruled #405 6683319630)
describe('PF3 W6b low_to_high_cable_fly: the press hands stay apart, clear of the solid meeting hands (c11)', () => {
  const pxOf = (spec: any) => {
    const r = plate.renderPlate(spec, { id: 'pf3' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
    return (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[];
  };
  const d = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
  it('the two Mistake hands are at least 40 px apart (main 12.4: they met over the solid hands)', () => {
    const P = pxOf(lth);
    expect(d(P('mistake', 'grip.r'), P('mistake', 'grip.l'))).toBeGreaterThanOrEqual(40);
  });
  it('each Mistake hand is at least 15 px from both solid hands (main 0.0: on top of them)', () => {
    const P = pxOf(lth);
    for (const s of ['r', 'l']) for (const t of ['r', 'l']) expect(d(P('mistake', `grip.${s}`), P('end', `grip.${t}`)), `${s}->${t}`).toBeGreaterThanOrEqual(15);
  });
  it('the press is kept: elbows at 90 deg (+-1), below the end elbows by at least 15 px', () => {
    const r = plate.renderPlate(lth, { id: 'pf3' }), L = qaEng.poseLandmarks(Eng(), lth), P = pxOf(lth);
    void r;
    for (const s of ['r', 'l']) {
      expect(Math.abs(L.q.mistake.elbow[s] - 90), s).toBeLessThanOrEqual(1);
      expect(P('mistake', `elbow.${s}`)[1]! - P('end', `elbow.${s}`)[1]!, s).toBeGreaterThanOrEqual(15);
    }
  });
  it('mutation: hands meeting again (the old -CLOSE_GAP grip) is red on the first block', () => {
    const m = lth.mistake.pose, g = m.reach.r.at, gap = 0.05, sh = Math.abs(g[0]);
    void sh;
    const old = { ...lth, mistake: { ...lth.mistake, pose: { reach: { r: { ...m.reach.r, at: [-gap, g[1], g[2]] }, l: { ...m.reach.l, at: [gap, g[1], g[2]] } } } } };
    const P = pxOf(old);
    expect(d(P('mistake', 'grip.r'), P('mistake', 'grip.l'))).toBeLessThan(40);
  });
});

// ---- LIB-PLATEFIX-3 round 2 (plates panel pf7, #405 6685743439; D-LIB13-PANEL2) ----
const r2px = (spec: any) => {
  const r = plate.renderPlate(spec, { id: 'pf3r2' }), cam = qaEng.cameraOf(spec, r.report), L = qaEng.poseLandmarks(Eng(), spec);
  return { cam, L, P: (pose: string, k: string) => cam.P(L.lm[pose][k]) as number[] };
};
const r2seg = (p: number[], a: number[], b: number[]) => {
  const ab = [b[0]! - a[0]!, b[1]! - a[1]!], t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * ab[0]! + (p[1]! - a[1]!) * ab[1]!) / (ab[0]! ** 2 + ab[1]! ** 2)));
  return Math.hypot(p[0]! - a[0]! - t * ab[0]!, p[1]! - a[1]! - t * ab[1]!);
};
const r2resolve = (spec: any, ref: any, pose: string) => {
  const { cam, L } = r2px(spec);
  return qaEng.resolvePoint(qaEng.anchorInPose(ref, pose), pose, L.lm, cam) as number[];
};

// machine_pullover: held at main's drawing (D-LIB13-PANEL2, #405 6688665575); its PF3 tests leave with its drawing (kept in history at d8cd3ac7).

// rear_delt_fly: held at main's drawing (D-LIB13-PANEL2, #405 6688665575); its PF3 tests leave with its drawing (kept in history at d8cd3ac7).

// high_to_low_cable_fly: held at main's drawing (D-LIB13-PANEL2, #405 6688665575); its PF3 tests leave with its drawing (kept in history at d8cd3ac7).

describe('PF3 round 2 low_to_high_cable_fly R5: the press elbows drop outside the body (c11)', () => {
  it('each Mistake elbow is at least 15 px outside its shoulder (main 8.7), the forearm upright over it (hand within 2 px of the elbow vertical)', () => {
    const { P } = r2px(lth);
    for (const sd of ['r', 'l']) {
      const out = (sd === 'r' ? -1 : 1) * (P('mistake', `elbow.${sd}`)[0]! - P('end', `shoulder.${sd}`)[0]!);
      expect(out, sd).toBeGreaterThanOrEqual(15);
      expect(Math.abs(P('mistake', `grip.${sd}`)[0]! - P('mistake', `elbow.${sd}`)[0]!), sd).toBeLessThanOrEqual(2);
    }
  });
  it('the two arrows are short and sit outside the Mistake elbows (not across the arms)', () => {
    const { P } = r2px(lth);
    for (const g of lth.mistake.guides.filter((x: any) => x.kind === 'arrow')) {
      const a = r2resolve(lth, g.from, 'mistake'), b = r2resolve(lth, g.to, 'mistake'), sd = g.to.at.slice(-1), e = P('mistake', `elbow.${sd}`);
      expect(Math.hypot(b[0]! - a[0]!, b[1]! - a[1]!)).toBeLessThanOrEqual(16);
      expect((sd === 'r' ? -1 : 1) * (b[0]! - e[0]!)).toBeGreaterThanOrEqual(8);
    }
  });
});

describe('PF3 round 2 smith_machine_squat R3: the stop is drawn behind the lifter (c8)', () => {
  it('the safety stop is behind the trunk and the near limbs in the start and end poses (main: front, over the traps and the arm)', () => {
    const L = qaEng.poseLandmarks(Eng(), sms);
    for (const pose of ['start', 'end']) {
      const ctx = { pose, start: L.lm.start, mistake: false, body: L.body };
      const items = sms.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(L.lm[pose], ctx) ?? [] : e)).filter(Boolean);
      // LIB-PLATEFIX-3 last recheck (#405 6688665575 R2): the stop is now the arm on the rail, in the center level (behind
      // the trunk and the near limbs, as R3 asks); was the 25 x 5 cm box in the back level
      const stop = items.find((it: any) => it.type === 'box' && Math.abs(it.h - 0.025) < 1e-9);
      expect(stop, pose).toBeTruthy();
      expect(stop.z, pose).toBe('center');
      expect(items.some((it: any) => it.z === 'front' && it.type === 'box'), pose).toBe(false);
    }
  });
});

describe('PF3 last recheck smith_machine_squat R2, R5 (#405 6688665575; D-SHIP-W5-NEWFIND)', () => {
  const itemsOf = (pose: string) => {
    const L = qaEng.poseLandmarks(Eng(), sms), ctx = { pose, start: L.lm.start, mistake: false, body: L.body };
    return sms.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(L.lm[pose], ctx) ?? [] : e)).filter(Boolean);
  };
  it('R2: the rod and the hook rail are drawn in the end layer (center level), not the static back level the start figure covers', () => {
    const items = itemsOf('end');
    // equipment order: floor, then smith()'s [carriage, hook, stop, rod, hook rail, top member, floor beam]
    const rod = items[4], upright = items[5], member = items[6];
    expect(upright.type).toBe('rackUpright');
    expect(member.z).toBe('back');
    expect(upright?.z).toBe('center');
    expect(rod?.z).toBe('center');
  });
  it('R2: the stop is a horizontal arm on the rail, top just under the bar, reaching at least 15 px behind the rod and at most 5 px tall', () => {
    const r = plate.renderPlate(sms, { id: 'pf3s' }), cam = qaEng.cameraOf(sms, r.report), stop = itemsOf('end').find((it: any) => it.type === 'box' && it.z === 'center');
    const back = cam.P([0, stop.at[1], stop.at[2] - stop.w / 2]), rail = cam.P([0, stop.at[1], -0.11]);
    expect(rail[0]! - back[0]!).toBeGreaterThanOrEqual(15);
    expect(stop.h * cam.pxm).toBeLessThanOrEqual(5);
    expect(stop.w).toBeGreaterThan(stop.h * 4);
  });
  it('R5: the faulty near leg is drawn whole as dashed outlines over the solid figure, its foot under the bar line', () => {
    expect(sms.mistake.parts).not.toContain('leg.r');
    const dashed = sms.mistake.guides.filter((g: any) => g.kind === 'dashed');
    expect(dashed.length).toBe(5);   // thigh, kneecap, shank, foot + the bar's line
    const foot = dashed[3].pts, zs = foot.map((p: number[]) => p[2]!);
    expect(Math.min(...zs)).toBeLessThanOrEqual(-0.11);   // the foot reaches the rail's line (z -0.11) under the bar
    expect(Math.max(...zs)).toBeGreaterThanOrEqual(-0.11);
  });
});
