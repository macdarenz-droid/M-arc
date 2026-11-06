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

describe('PF3 W6 machine_pullover: the lower back arches off the pad (c8) and the pivot hub shows at the shoulder (c1)', () => {
  it('the Mistake back edge stands at least 15 px off the pad (main 14.2 px as a slide: the upper back 7.6 px off too); the upper back and the buttock stay within 1 px of the pad', () => {
    const r = plate.renderPlate(mp, { id: 'pf3' }), pxm = r.report.camera.pxPerM;
    const m = backGap({ ...mp.poses.end, ...mp.mistake.pose }, pxm), e = backGap(mp.poses.end, pxm);
    expect(m.gap, `gap ${m.gap.toFixed(2)} px (Right ${e.gap.toFixed(2)})`).toBeGreaterThanOrEqual(15);
    expect(Math.abs(m.backUpper - e.backUpper), 'upper back on the pad').toBeLessThanOrEqual(1);
    expect(Math.abs(m.buttock - e.buttock), 'buttock on the pad').toBeLessThanOrEqual(1);
  });
  it('the Mistake seat stays on the seat top (+-0.5 cm)', () => {
    const lm = qaEng.poseLandmarks(Eng(), mp).lm;
    expect(Math.abs(lm.mistake.seat[1] - lm.end.seat[1]) * 100).toBeLessThanOrEqual(0.5);
  });
  it('the arched back edge is drawn as a dashed guide over the figure', () => {
    expect(mp.mistake.guides.some((g: any) => g.kind === 'dashed' && g.pts.length >= 10)).toBe(true);
  });
  it('the hub rim is drawn in front of the figure in the end pose, centred within 10 px of the shoulder joint (main: hidden behind the figure)', () => {
    const L = qaEng.poseLandmarks(Eng(), mp), items = mp.equipment.flatMap((e: any) => [].concat(typeof e === 'function' ? e(L.lm.end, { pose: 'end', start: L.lm.start, mistake: false, body: L.body }) ?? [] : e));
    const front = items.filter((it: any) => it && it.z === 'front' && it.pts && it.pts.every((p: number[]) => Math.abs(Math.hypot(p[1]! - mpMod.PM.pivot[1], p[2]! - mpMod.PM.pivot[2]) - 0.045) < 1e-6));
    expect(front.length).toBe(1);
    const cam = qaEng.cameraOf(mp, plate.renderPlate(mp, { id: 'pf3' }).report), piv = cam.P(mpMod.PM.pivot), sh = cam.P(L.lm.end['shoulder.r']);
    expect(Math.hypot(piv[0] - sh[0], piv[1] - sh[1])).toBeLessThanOrEqual(10);
  });
});

describe('PF3 W6 rear_delt_fly: the chest pad in front of the chest (c1, c6)', () => {
  it('the chest pad (pecDeck backPad) is drawn at z front, and nothing else of the deck moves layer', () => {
    const L = qaEng.poseLandmarks(Eng(), rdf), ctx = { pose: 'end', start: L.lm.start, mistake: false, body: L.body };
    const items = rdf.equipment.map((e: any) => (typeof e === 'function' ? e(L.lm.end, ctx) : e));
    // entry 0 is the floor; entries 1.. are pecDeck's items in its order, item 1 the chest pad (the 30 cm wide backPad)
    const pad = items[2];
    expect(pad).toMatchObject({ type: 'backPad', width: 0.3, z: 'front' });
    expect(items.flat().filter((it: any) => it && it !== pad && it.z === 'front').length).toBe(0);
  });
});

describe('PF3 W6 high_to_low_cable_fly: the Trace drops first, then sweeps in (c6)', () => {
  it('the drawn Trace bows at least 15 px off its chord (main 2.0 px: a straight diagonal), below-outside of it', () => {
    const d = plate.renderPlate(htl, { id: 'pf3' }).svg.match(/<path class="trace" pathLength="1" d="([^"]*)"/)![1]!;
    const n = d.match(/-?[\d.]+/g)!.map(Number), pts: number[][] = [];
    for (let i = 0; i < n.length; i += 2) pts.push([n[i]!, n[i + 1]!]);
    const a = pts[0]!, b = pts.at(-1)!, ab = [b[0]! - a[0]!, b[1]! - a[1]!], l = Math.hypot(ab[0]!, ab[1]!);
    const dev = Math.max(...pts.map(p => Math.abs((p[0]! - a[0]!) * ab[1]! - (p[1]! - a[1]!) * ab[0]!) / l));
    expect(dev, `${dev.toFixed(1)} px`).toBeGreaterThanOrEqual(15);
    // "down first": at the chord's midpoint height the Trace is still on the open side (left of the chord for the
    // figure's right hand, viewer's left)
    const mid = pts[Math.floor(pts.length / 2)]!, side = (mid[0]! - a[0]!) * ab[1]! - (mid[1]! - a[1]!) * ab[0]!;
    expect(side).toBeLessThan(0);
  });
});

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

describe('PF3 round 2 machine_pullover R5, R11: the low back is the tell and the zoom (c8)', () => {
  const archAt = () => r2resolve(mp, mp.mistake.tells.find((t: any) => t.key === 'arch').anchor, 'mistake');
  it('R5: the "Back arches" leader ends on the dashed bow (within 1 px), at least 25 px under the upper back (main: on the upper back)', () => {
    const { cam, P } = r2px(mp), bow = mp.mistake.guides.find((g: any) => g.kind === 'dashed').pts.map((w: number[]) => cam.P(w)), a = archAt();
    expect(Math.min(...bow.slice(1).map((q: number[], i: number) => r2seg(a, bow[i], q)))).toBeLessThanOrEqual(1);
    expect(a[1]! - P('mistake', 'backUpper')[1]!).toBeGreaterThanOrEqual(25);
  });
  it('R11: the Mistake zoom shows the arch tell (the low back), not the largest move (the head), at k 2.5', () => {
    expect(mp.zoom).toEqual({ view: 'mistake', k: 2.5, tell: 'arch' });
  });
  it('mutation: the old upper-back anchor is red on the R5 block', () => {
    const at = r2resolve(mp, { at: 'backUpper', pose: 'mistake' }, 'mistake'), { P } = r2px(mp);
    expect(at[1]! - P('mistake', 'backUpper')[1]!).toBeLessThan(25);
  });
});

describe('PF3 round 2 rear_delt_fly R5, R11: the shrug drawn at the neck (c17)', () => {
  const traps = () => rdf.mistake.guides.filter((g: any) => g.kind === 'dashed' && g.pts.length === 2);
  it('R5: no changed-parts outline along the arms (parts: torso only)', () => {
    expect(rdf.mistake.parts).toEqual(['torso']);
  });
  it('R5: one red trapezius line per side, from the raised shoulder cap up at least 8 px to beside the head (within 13 px of the mid-line)', () => {
    const { cam, P } = r2px(rdf), mid = cam.P([0, 0, 0])[0]!;
    expect(traps().length).toBe(2);
    for (const g of traps()) {
      const a = r2resolve(rdf, g.pts[0], 'mistake'), b = cam.P(g.pts[1]), sd = g.pts[0].at.slice(-1);
      expect(Math.hypot(a[0]! - P('mistake', `shoulderTop.${sd}`)[0]!, a[1]! - P('mistake', `shoulderTop.${sd}`)[1]!)).toBeLessThanOrEqual(0.01);
      expect(a[1]! - b[1]!, sd).toBeGreaterThanOrEqual(8);
      expect(Math.abs(b[0]! - mid), sd).toBeLessThanOrEqual(13);
    }
  });
  it('R11: the shrug tell sits half-way up the trapezius line, and the zoom is at k 3 (the smallest rung over the bar)', () => {
    const t = rdf.mistake.tells[0], a = r2resolve(rdf, t.anchor, 'mistake'), { cam, P } = r2px(rdf);
    const g = traps().find((x: any) => x.pts[0].at === 'shoulderTop.r'), n = cam.P(g.pts[1]), s = P('mistake', 'shoulderTop.r');
    expect(Math.hypot(a[0]! - (s[0]! + n[0]!) / 2, a[1]! - (s[1]! + n[1]!) / 2)).toBeLessThanOrEqual(0.01);
    expect(rdf.zoom).toEqual({ view: 'mistake', k: 3 });
  });
});

describe('PF3 round 2 high_to_low_cable_fly R5: only the crossed forearms and hands are red (c8)', () => {
  it('the Mistake outlines the forearms and fists only, and no dashed upper-arm capsule is drawn', () => {
    expect(htl.mistake.parts).toEqual(['fore.r', 'fore.l', 'fist.r', 'fist.l']);
    expect(htl.mistake.guides.filter((g: any) => g.kind === 'dashed').length).toBe(4);   // 2 forearm capsules + 2 hand rings (main: 4 capsules + 2 rings)
  });
  it('both crossing arrows run under the hands, at least 10 px below them', () => {
    const { P } = r2px(htl);
    for (const g of htl.mistake.guides.filter((x: any) => x.kind === 'arrow')) {
      const a = r2resolve(htl, g.from, 'end'), b = r2resolve(htl, g.to, 'mistake'), sd = g.to.at.slice(-1);
      expect(a[1]! - P('end', `grip.${sd}`)[1]!).toBeGreaterThanOrEqual(10);
      expect(b[1]! - P('mistake', `grip.${sd}`)[1]!).toBeGreaterThanOrEqual(10);
    }
  });
});

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
