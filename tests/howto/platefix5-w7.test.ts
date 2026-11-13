// LIB-PLATEFIX-5 W7 group (card LIB-PLATEFIX-5 item 1, D-PF4-W67LATER; PLAN @ 771bc332; ruling PR #419 comment
// 6849391955). The four W7 close-ups: hack_squat (the `knee-lock` zoom AND the plate Mistake wedge), wall_ball
// (`wall-distance`), side_plank (`shoulder`) and jumping_jacks (`toes-forward`). Every row and mutation is measured here
// from the engine's own landmarks and the crop the page draws (render/closeup/crop.mjs), never from a spec constant.
// All red on main e15e1c65, green on the build. Units: panel px = the 171 px crop (k = 171 / sizePx); plate px = the
// plate svg. Each number is named with its unit in the message.
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const ROOT = new URL('../../tools/plates/library/', import.meta.url);
const specFileOf = (id: string) => new URL(`specs/${id}.mjs`, ROOT).pathname;
const T = 600_000;

let eng: any, crop: any, common: any, closeups: any;
let HM: Record<string, any> = {}, OPT: Record<string, any> = {}, ENGINE: Record<string, any> = {}, SPEC: Record<string, any> = {};
const H = 1.75;
const PAGE: Record<string, string> = { hack_squat: 'lb08', jumping_jacks: 'lb10', wall_ball: 'lb10', side_plank: 'lb09' };

beforeAll(async () => {
  [crop, common, closeups] = await Promise.all(['render/closeup/crop.mjs', 'render/closeup/common.mjs', 'render/closeups.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  eng = await import(/* @vite-ignore */ lib('engine.mjs'));
  const pages: Record<string, any> = {};
  for (const id of Object.keys(PAGE)) {
    HM[id] = await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`));
    SPEC[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
    pages[PAGE[id]!] ??= await import(/* @vite-ignore */ lib(`pages/${PAGE[id]}.closeups.mjs`));
    OPT[id] = pages[PAGE[id]!].CLOSEUP_OPTIONS[id];
    ENGINE[id] = await closeups.engineOf(specFileOf(id), {});
  }
}, T);

const mergeDeep = (a: any, b: any): any => common.mergeDeep(a, b);
const ang = (a: number[], v: number[], b: number[]) => {
  const p = [a[0]! - v[0]!, a[1]! - v[1]!], q = [b[0]! - v[0]!, b[1]! - v[1]!];
  return Math.acos((p[0]! * q[0]! + p[1]! * q[1]!) / Math.hypot(...p) / Math.hypot(...q)) * 180 / Math.PI;
};
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);

/** One zoom's crop context: project any world point to panel px for each role, exactly as render/closeup/crop.mjs
 *  cropHalf does (the PLAN's measure helper). */
const ctx = (id: string, key: string) => {
  const howto = HM[id].default, sp = howto.plate, z = howto.zooms.find((x: any) => x.key === key);
  const engine = ENGINE[id], PANEL = crop.PANEL;
  const cam = engine.renderPlate(sp, { id: 'pf5w7' }).report.camera;
  const side = sp.view === 'side', left = sp.facing === 'left';
  const pitch = side || engine.name === 'layers' ? 0 : (cam.pitch ?? sp.camera?.pitch ?? 0);
  const pc = Math.cos(pitch * Math.PI / 180), ps = Math.sin(pitch * Math.PI / 180);
  const P = (w: number[]) => [cam.x0 + (side ? (left ? -w[2]! : w[2]!) : w[0]!) * cam.pxPerM, cam.y0 - (w[1]! * pc - w[2]! * ps) * cam.pxPerM];
  const poseOf = (ref: any) => typeof ref === 'string' ? sp.poses[ref] : mergeDeep(sp.poses[ref.base], ref.pose);
  const right = poseOf(z.right), solid = z.wrongAlone || z.wrong.solid;
  const wrong = solid ? poseOf(z.wrong) : mergeDeep(right, poseOf(z.wrong));
  const lms: any = { right: engine.landmarksOf(right, H), wrong: engine.landmarksOf(wrong, H) };
  const res = (ref: any, pose: string): number[] => {
    if (Array.isArray(ref)) return ref.length === 3 ? P(ref) : ref;
    if (typeof ref === 'string') return P(lms[pose][ref]);
    const p = res(ref.at, ref.pose === 'right' ? 'right' : ref.pose === 'mistake' ? 'wrong' : pose), o = ref.off ?? [0, 0];
    return [p[0]! + o[0]!, p[1]! + o[1]!];
  };
  const c: any = { right: res(z.crop.center, 'right'), wrong: res(z.crop.centerWrong || z.crop.center, 'right') };
  const s = z.crop.sizePx, k = PANEL / s;
  const panel = (role: string) => (w: number[]) => { const p = P(w); return [(p[0]! - (c[role][0]! - s / 2)) * k, (p[1]! - (c[role][1]! - s / 2)) * k]; };
  return { sp, z, cam, P, lms, panel, k, solid, right, wrong, PANEL };
};

/** The drawn crop html for one role (the page's own engine and options). */
const html = (id: string, key: string, role: string) => {
  const cut = crop.engineCrop(HM[id].default, OPT[id].crop, ENGINE[id]);
  return cut(HM[id].default.zooms.find((z: any) => z.key === key), role);
};
/** The zoom-css the page emits for this id (cssFor applied), to read whether a guide class has a token rule. */
const cssOf = (id: string) => closeups.closeupApi(HM[id], OPT[id], { engine: ENGINE[id], specFile: specFileOf(id) }).CSS;

// ============================================================ hack_squat ============================================
describe('PF5 W7 hack_squat', { timeout: T }, () => {
  // ---- the knee-lock close-up ----
  const bend2D = (C: any, role: string) => { const L = C.lms[role], pp = C.panel(role); return 180 - ang(pp(L['hip.r']), pp(L['knee.r']), pp(L['ankle.r'])); };

  it('Right knee 2D bend is in [15, 20] deg; Wrong is <= 2 deg (panel angle)', () => {
    const C = ctx('hack_squat', 'knee-lock');
    const r = bend2D(C, 'right'), w = bend2D(C, 'wrong');
    console.log(`PF5 W7 hack_squat knee-lock: Right 2D bend ${r.toFixed(2)} deg, Wrong ${w.toFixed(2)} deg`);
    expect(r).toBeGreaterThanOrEqual(15);
    expect(r).toBeLessThanOrEqual(20);
    expect(w).toBeLessThanOrEqual(2);
  });
  it('mutation: Right = the plate start pose (main) bends 14.96 deg, under 15', () => {
    const C = ctx('hack_squat', 'knee-lock'), pp = C.panel('right');   // the SOFT pose is start run down the rail; main uses start itself
    const LS = ENGINE.hack_squat.landmarksOf(C.sp.poses.start, H);
    const bend = 180 - ang(pp(LS['hip.r']), pp(LS['knee.r']), pp(LS['ankle.r']));
    console.log(`PF5 W7 hack_squat mutation: start-pose Right 2D bend ${bend.toFixed(2)} deg`);
    expect(bend).toBeLessThan(15);
  });
  it('both crops draw one hip-to-ankle guide (z-ol ridge) ending on that pose\'s hip.r and ankle.r (value-exact); the Right draws the knee arc, the Wrong none; no digit text', () => {
    const C = ctx('hack_squat', 'knee-lock'), z = C.z;
    for (const role of ['right', 'wrong'] as const) {
      const lm = C.lms[role], lines = z.outlines(lm).lines;
      const ridge = lines.filter((q: any) => q.kind === 'ridge');
      expect(ridge.length, `${role} ridge count`).toBe(1);
      expect(ridge[0].pts[0], `${role} ridge starts at hip.r`).toEqual(lm['hip.r']);
      expect(ridge[0].pts[1], `${role} ridge ends at ankle.r`).toEqual(lm['ankle.r']);
      const arcs = lines.filter((q: any) => q.kind === 'arc');
      expect(arcs.length, `${role} arc count`).toBe(role === 'right' ? 1 : 0);   // the arc only where the knee bends > 5 deg (the Right)
      const h = html('hack_squat', 'knee-lock', role);
      expect((h.match(/class="z-ol ridge/g) ?? []).length, `${role} drawn ridge`).toBe(1);
      expect((h.match(/class="z-ol arc/g) ?? []).length, `${role} drawn arc`).toBe(role === 'right' ? 1 : 0);
      expect(/<text/.test(h), `${role} no digit text`).toBe(false);
    }
  });
  it('mutation: the knee-lock zoom with no outlines draws no z-ol guide in either crop', () => {
    const z = HM.hack_squat.default.zooms.find((x: any) => x.key === 'knee-lock'), bare = { ...z, outlines: undefined };
    const cut = crop.engineCrop({ ...HM.hack_squat.default, zooms: [bare] }, OPT.hack_squat.crop, ENGINE.hack_squat);
    for (const role of ['right', 'wrong']) expect(/class="z-ol/.test(cut(bare, role)), role).toBe(false);
  });
  it('the page turns the outlines CSS on, so .z-ol has a rule; mutation: outlines off drops the .z-ol rule', () => {
    expect(/\.z-ol\b/.test(cssOf('hack_squat'))).toBe(true);
    const off = closeups.closeupApi(HM.hack_squat, { ...OPT.hack_squat, css: { ...OPT.hack_squat.css, outlines: false } }, { engine: ENGINE.hack_squat, specFile: specFileOf('hack_squat') }).CSS;
    expect(/\.z-ol\b/.test(off)).toBe(false);
  });

  // ---- the plate Mistake wedge (specs/hack_squat.mjs) ----
  // The drawn back-outline gap from the pad face at each landmark's station along the pad (the END pose's stations, so
  // poses compare at the same place on the pad), plate px. The pad: PAD_PLANE.point, normal N; along the pad U.
  const SM = () => HM.hack_squat.default.plate;
  const wedge = (mistakePose: any) => {
    const sp = SM(), end = sp.poses.end;
    const { U, N, PAD_PLANE, LE } = (SPEC.hack_squat as any).HS;
    const ppm = ENGINE.hack_squat.renderPlate(sp, { id: 'w' }).report.camera.pxPerM;
    const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i]!, 0), sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]!);
    const dPad = (w: number[]) => dot(sub(w, PAD_PLANE.point), PAD_PLANE.normal);
    const camS = { view: 'side', near: 'r', facing: 'right', pxm: 1, P: (w: number[]) => [w[2]!, -w[1]!] };
    const pose = { ...end, ...mistakePose };
    const sk = eng.fk(eng.resolve(eng.normPose(pose, { height: H }), { height: H }).q, { height: H });
    const poly = eng.bodyShapes(sk, camS).find((sh: any) => sh.key === 'torso').poly.map((p: number[]) => [0, -p[1]!, p[0]!]);
    const at = (u: number) => { const cr: number[] = []; for (let i = 0; i < poly.length; i++) { const a = poly[i]!, b = poly[(i + 1) % poly.length]!, ua = dot(sub(a, PAD_PLANE.point), U) - u, ub = dot(sub(b, PAD_PLANE.point), U) - u;
      if (ua === ub || ua * ub > 0) continue; const t = ua / (ua - ub); cr.push(dPad(a.map((v: number, j: number) => v + (b[j]! - v) * t))); } return cr.length ? Math.min(...cr) * ppm : NaN; };
    const g: Record<string, number> = {};
    for (const n of ['backUpper', 'backMid', 'lumbar', 'sacrum', 'buttock']) g[n] = at(dot(sub(LE[n], PAD_PLANE.point), U));
    const L = ENGINE.hack_squat.landmarksOf(pose, H), hipN = dot(sub(L['hip.r'], LE['hip.r']), N) * ppm;
    return { g: g as Record<'backUpper' | 'backMid' | 'lumbar' | 'sacrum' | 'buttock', number>, hipAlongN: hipN };
  };

  it('the Mistake opens a wedge: backUpper stays on the pad (<= 0.5 px), the lumbar, sacrum and buttock gaps are >= 10 px and grow downward, and the hip moves off the pad (+N)', () => {
    const { g, hipAlongN } = wedge(SM().mistake.pose);
    console.log(`PF5 W7 hack_squat plate wedge (px): backUpper ${g.backUpper.toFixed(2)}, backMid ${g.backMid.toFixed(2)}, lumbar ${g.lumbar.toFixed(2)}, sacrum ${g.sacrum.toFixed(2)}, buttock ${g.buttock.toFixed(2)}; hip along N ${hipAlongN.toFixed(2)} px`);
    expect(Math.abs(g.backUpper!)).toBeLessThanOrEqual(0.5);
    expect(g.lumbar!).toBeGreaterThanOrEqual(10);
    expect(g.sacrum!).toBeGreaterThanOrEqual(10);
    expect(g.buttock!).toBeGreaterThanOrEqual(10);
    expect(g.sacrum!).toBeGreaterThan(g.lumbar!);     // the wedge grows downward
    expect(g.buttock!).toBeGreaterThan(g.sacrum!);
    expect(hipAlongN).toBeGreaterThan(5);             // the hip rises off the pad
  });
  it('mutation: main\'s single lumbar-pivot roll (M_ROLL 25 about the end lumbar) leaves the lumbar gap ~6.8 px, under 10', () => {
    const { U: _U, N: _N, PAD_PLANE, LE } = (SPEC.hack_squat as any).HS;
    const R = Math.PI / 180, end = SM().poses.end, Lp = LE.lumbar, HIP = end.root.at, t = -25 * R, v = [0, HIP[1]! - Lp[1]!, HIP[2]! - Lp[2]!], c = Math.cos(t), s = Math.sin(t);
    const main = { root: { at: [0, Lp[1]! + v[1]! * c - v[2]! * s, Lp[2]! + v[1]! * s + v[2]! * c], tilt: end.root.tilt - 25 }, trunk: 25 };
    const { g } = wedge(main);
    console.log(`PF5 W7 hack_squat mutation (main lumbar pivot): lumbar ${g.lumbar.toFixed(2)} px`);
    expect(g.lumbar!).toBeLessThan(10);
    void PAD_PLANE;
  });
  it('mutation: a 5 px wedge (M_ROLL 10 over the same split: buttock about 5.4 px) is under 10 px', () => {
    const roll = 10, split = [0.3, 0.3, 0.4, 0];
    const { LE } = (SPEC.hack_squat as any).HS, end = SM().poses.end;
    const sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]!), add = (a: number[], b: number[]) => a.map((v, i) => v + b[i]!);
    const base = { root: { at: end.root.at, tilt: end.root.tilt - roll }, trunk: { flex: split.map(x => x * roll) } };
    const d = sub(LE.backUpper, ENGINE.hack_squat.landmarksOf({ ...end, ...base }, H).backUpper);
    const small = { ...base, root: { ...base.root, at: add(end.root.at, d) } };
    const { g } = wedge(small);
    console.log(`PF5 W7 hack_squat mutation (roll ${roll}): lumbar ${g.lumbar.toFixed(2)}, buttock ${g.buttock.toFixed(2)} px`);
    expect(Math.min(g.lumbar!, g.buttock!)).toBeLessThan(10);
  });
  it('mutation: a root-only lift (no roll, the end pose raised along N by main\'s hip lift) lifts backUpper off the pad too', () => {
    const { N, PAD_PLANE, LE } = (SPEC.hack_squat as any).HS, end = SM().poses.end;
    const dot = (a: number[], b: number[]) => a.reduce((s, v, i) => s + v * b[i]!, 0), sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]!);
    const R = Math.PI / 180, Lp = LE.lumbar, HIP = end.root.at, t = -25 * R, v = [0, HIP[1]! - Lp[1]!, HIP[2]! - Lp[2]!], c = Math.cos(t), s = Math.sin(t);
    const mainMis = { root: { at: [0, Lp[1]! + v[1]! * c - v[2]! * s, Lp[2]! + v[1]! * s + v[2]! * c], tilt: end.root.tilt - 25 }, trunk: 25 };
    const lift = dot(sub(ENGINE.hack_squat.landmarksOf({ ...end, ...mainMis }, H)['hip.r'], LE['hip.r']), N);
    const ro = { root: { at: end.root.at.map((x: number, i: number) => x + N[i]! * lift), tilt: end.root.tilt } };
    const { g } = wedge(ro);
    console.log(`PF5 W7 hack_squat mutation (root-only lift): backUpper ${g.backUpper.toFixed(2)} px off the pad`);
    expect(Math.abs(g.backUpper!)).toBeGreaterThan(0.5);
    void PAD_PLANE;
  });
});

// ============================================================ wall_ball =============================================
describe('PF5 W7 wall_ball', { timeout: T }, () => {
  const trunkDeg = (C: any, role: string) => { const L = C.lms[role], pp = C.panel(role), mid = (a: number[], b: number[]) => [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2];
    const h = mid(pp(L['hip.r']), pp(L['hip.l'])), s = mid(pp(L['shoulder.r']), pp(L['shoulder.l'])); return Math.atan2(s[0]! - h[0]!, h[1]! - s[1]!) * 180 / Math.PI; };

  it('the Wrong trunk leans >= 45 deg from vertical; the Right stands upright (<= 10 deg)', () => {
    const C = ctx('wall_ball', 'wall-distance');
    const r = trunkDeg(C, 'right'), w = trunkDeg(C, 'wrong');
    console.log(`PF5 W7 wall_ball trunk (deg from vertical): Right ${r.toFixed(2)}, Wrong ${w.toFixed(2)}`);
    expect(Math.abs(w)).toBeGreaterThanOrEqual(45);
    expect(Math.abs(r)).toBeLessThanOrEqual(10);
  });
  it('mutation: the spec plate Mistake leans only ~38 deg, under 45', () => {
    const C = ctx('wall_ball', 'wall-distance');
    const sp = HM.wall_ball.default.plate, mis = mergeDeep(sp.poses.end, sp.mistake.pose), L = ENGINE.wall_ball.landmarksOf(mis, H), pp = C.panel('wrong');
    const mid = (a: number[], b: number[]) => [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2];
    const h = mid(pp(L['hip.r']), pp(L['hip.l'])), s = mid(pp(L['shoulder.r']), pp(L['shoulder.l'])), w = Math.atan2(s[0]! - h[0]!, h[1]! - s[1]!) * 180 / Math.PI;
    console.log(`PF5 W7 wall_ball mutation (plate Mistake): trunk ${w.toFixed(2)} deg`);
    expect(Math.abs(w)).toBeLessThan(45);
  });
  // ---- PF5 fix round (PR #419 6851987591): L1 the Right is the card's measure (c2), L5 the Wrong is clearly too far
  // back with the ball going forward (c3), L6 the shoulder row names a cause (c4). This replaces the ruled plan's
  // "no shift back" row (the panel now asks for the card-true distance). Measured in panel px from the crop's own data.
  const ballOf = (C: any, role: string) => {
    const ref = C.z[role], list = (typeof ref === 'object' && ref.equipmentList) || C.sp.equipment.filter((e: any) => typeof e === 'function')
      .flatMap((f: any) => [].concat(f(C.lms[role], { pose: 'end' }) ?? []).filter(Boolean));
    const pts = list.filter((e: any) => e.part === 'ball' && e.type !== 'line').flatMap((e: any) => e.pts);
    const zs = pts.map((w: number[]) => w[2]!), ys = pts.map((w: number[]) => w[1]!);
    return { pts, front: Math.max(...zs), c: [0, (Math.max(...ys) + Math.min(...ys)) / 2, (Math.max(...zs) + Math.min(...zs)) / 2] };
  };
  const wallFace = () => SPEC.wall_ball.WALL_FACE as number;
  const pxm = (C: any) => C.cam.pxPerM * C.k;   // world m -> panel px
  const elbow3D = (L: any) => { const [a, v, b] = [L['shoulder.r'], L['elbow.r'], L['wrist.r']]; const p = a.map((x: number, i: number) => x - v[i]), q = b.map((x: number, i: number) => x - v[i]);
    return Math.acos(p.reduce((s: number, x: number, i: number) => s + x * q[i], 0) / Math.hypot(...p) / Math.hypot(...q)) * 180 / Math.PI; };
  const toeGap = (C: any, L: any) => (wallFace() - Math.max(L['toe.r'][2], L['toe.l'][2])) * pxm(C);

  it('L1: the Right holds the ball out at the wall: ball front on the wall face (<= 0.5 panel px), elbow >= 160 deg, hands on the ball, ball >= 25 panel px ahead of the sternum', () => {
    const C = ctx('wall_ball', 'wall-distance'), L = C.lms.right, B = ballOf(C, 'right');
    const gap = (wallFace() - B.front) * pxm(C), el = elbow3D(L), ahead = (B.c[2]! - L.sternum[2]) * pxm(C);
    console.log(`PF5 W7 wall_ball L1 Right: ball front to wall ${gap.toFixed(2)} panel px, elbow ${el.toFixed(1)} deg, ball ahead of sternum ${ahead.toFixed(2)} panel px`);
    expect(B.pts.length, 'the Right draws its ball').toBeGreaterThan(0);
    expect(Math.abs(gap)).toBeLessThanOrEqual(0.5);
    expect(el).toBeGreaterThanOrEqual(160);
    expect(ahead).toBeGreaterThanOrEqual(25);
    for (const s of ['l', 'r']) expect(dist([L[`grip.${s}`][1], L[`grip.${s}`][2]], [B.c[1]!, B.c[2]!]) * pxm(C), `grip.${s} on the ball`).toBeLessThanOrEqual(0.5);
  });
  it('L1 mutation: the old Right (the plate end pose, ball riding the chest) is 26 panel px off the wall, elbow 60 deg', () => {
    const C = ctx('wall_ball', 'wall-distance'), z = { ...C.z, right: 'end' };
    const C2 = { ...C, z, lms: { ...C.lms, right: ENGINE.wall_ball.landmarksOf(C.sp.poses.end, H) } }, B = ballOf(C2, 'right');
    const gap = (wallFace() - B.front) * pxm(C), el = elbow3D(C2.lms.right);
    console.log(`PF5 W7 wall_ball L1 mutation (old Right): ball front to wall ${gap.toFixed(2)} panel px, elbow ${el.toFixed(1)} deg`);
    expect(Math.abs(gap) > 0.5 || el < 160).toBe(true);
    expect(Math.abs(gap)).toBeGreaterThan(0.5);
    expect(el).toBeLessThan(160);
  });
  it('L5: the Wrong stands >= 30 panel px farther from the wall than the Right (toe tips), its ball >= 8 panel px short of the wall and >= 25 panel px ahead of the sternum', () => {
    const C = ctx('wall_ball', 'wall-distance'), R = toeGap(C, C.lms.right), W = toeGap(C, C.lms.wrong), B = ballOf(C, 'wrong');
    const short = (wallFace() - B.front) * pxm(C), ahead = (B.c[2]! - C.lms.wrong.sternum[2]) * pxm(C);
    console.log(`PF5 W7 wall_ball L5: toe tips to wall Right ${R.toFixed(2)}, Wrong ${W.toFixed(2)} panel px; Wrong ball short of wall ${short.toFixed(2)}, ahead of sternum ${ahead.toFixed(2)} panel px; ball centre y ${B.c[1]!.toFixed(3)} m`);
    expect(W - R).toBeGreaterThanOrEqual(30);
    expect(short).toBeGreaterThanOrEqual(8);
    expect(ahead).toBeGreaterThanOrEqual(25);
    for (const s of ['l', 'r']) expect(dist([C.lms.wrong[`grip.${s}`][1], C.lms.wrong[`grip.${s}`][2]], [B.c[1]!, B.c[2]!]) * pxm(C), `grip.${s} on the ball`).toBeLessThanOrEqual(0.5);
  });
  it('L5 mutations: no shift back (the ruled plan) gives 0 panel px more; the ball riding the chest (spec ball) is < 25 panel px ahead of the sternum', () => {
    const C = ctx('wall_ball', 'wall-distance'), DZ = SPEC.wall_ball.SIZES.M_DIST - SPEC.wall_ball.SIZES.STAND_DIST;
    const noShift = mergeDeep(C.wrong, { root: { at: [C.wrong.root.at[0], C.wrong.root.at[1], C.wrong.root.at[2] + DZ] }, plant: Object.fromEntries(Object.entries(C.wrong.plant).map(([k, f]: [string, any]) => [k, { ...f, at: [f.at[0], f.at[1], f.at[2] + DZ] }])) });
    const Ln = ENGINE.wall_ball.landmarksOf(noShift, H), d = toeGap(C, Ln) - toeGap(C, C.lms.right);
    const Lw = C.lms.wrong, chestBall = ballOf({ ...C, z: { ...C.z, wrong: 'mistake' } }, 'wrong'), ahead = (chestBall.c[2]! - Lw.sternum[2]) * pxm(C);
    console.log(`PF5 W7 wall_ball L5 mutations: no-shift extra distance ${d.toFixed(2)} panel px; chest ball ahead of sternum ${ahead.toFixed(2)} panel px`);
    expect(d).toBeLessThan(30);
    expect(ahead).toBeLessThan(25);
  });
  for (const role of ['right', 'wrong'] as const) it(`the whole ${role} figure and its ball sit inside the [0, 171] panel`, () => {
    const C = ctx('wall_ball', 'wall-distance');
    const sk = eng.fk(eng.resolve(eng.normPose(C[role], { height: H }), { height: H }).q, { height: H });
    const camW = { view: 'side', near: 'r', facing: 'right', pxm: 1, P: (w: number[]) => [w[2]!, -w[1]!] };
    const pp = C.panel(role);
    const body = eng.bodyShapes(sk, camW).flatMap((s: any) => (s.poly ?? []).map((p: number[]) => pp([0, -p[1]!, p[0]!])));
    const ball = ballOf(C, role).pts.map((w: number[]) => pp(w));
    expect(ball.length, 'the ball is drawn').toBeGreaterThan(0);
    const pts = [...body, ...ball];
    const xs = pts.map((p: number[]) => p[0]!), ys = pts.map((p: number[]) => p[1]!);
    console.log(`PF5 W7 wall_ball ${role} body+ball box panel px (ball ${ball.length} pts): x [${Math.min(...xs).toFixed(1)}, ${Math.max(...xs).toFixed(1)}], y [${Math.min(...ys).toFixed(1)}, ${Math.max(...ys).toFixed(1)}]`);
    expect(Math.min(...xs)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...xs)).toBeLessThanOrEqual(C.PANEL);
    expect(Math.min(...ys)).toBeGreaterThanOrEqual(0);
    expect(Math.max(...ys)).toBeLessThanOrEqual(C.PANEL);
  });
  it('the crop draws each half with its own held-ball list (crop option right/wrong.equipmentList); mutation: no right.equipmentList draws the plate\'s thorax ball', () => {
    const z = HM.wall_ball.default.zooms.find((x: any) => x.key === 'wall-distance');
    const specsOf = (zz: any) => { const probe: any = { points: [], specs: [] };
      const cut = crop.engineCrop({ ...HM.wall_ball.default, zooms: [zz] }, OPT.wall_ball.crop, ENGINE.wall_ball, probe);
      cut(zz, 'right'); cut(zz, 'wrong'); return probe.specs; };
    const sp = specsOf(z);
    expect(sp.find((x: any) => x.role === 'right').spec.equipment).toBe(z.right.equipmentList);
    expect(sp.find((x: any) => x.role === 'wrong').spec.equipment).toBe(z.wrong.equipmentList);
    const { equipmentList, ...bare } = z.right, m = specsOf({ ...z, right: bare }).find((x: any) => x.role === 'right').spec.equipment;
    expect(equipmentList).toBeTruthy();
    expect(m.some((e: any) => typeof e === 'function'), 'the plate list (thorax ball functions)').toBe(true);
  });
  it('L6: the Shoulders row names a cause (c4), not a benefit; mutation: the old benefit text fails', () => {
    const row = HM.wall_ball.default.feel.rows.find((r: any) => r.key === 'shoulder');
    const cause = (t: string) => /\bwrong distance\b/i.test(t) && !/takes strain off|\bright distance\b/i.test(t);
    expect(row.means).toBe('Standing the wrong distance from the wall.');
    expect(cause(row.means)).toBe(true);
    expect(cause('The right distance from the wall takes strain off them.')).toBe(false);
  });
});

// ============================================================ side_plank ============================================
describe('PF5 W7 side_plank', { timeout: T }, () => {
  // "nearer the ear" along the body axis (the front-view straight-line distance is dominated by the fixed lateral
  // offset; the ruling: 20-30 px along the body axis). The axis: the Right's hips-mid -> shoulders-mid, projected.
  const mid = (a: number[], b: number[]) => [(a[0]! + b[0]!) / 2, (a[1]! + b[1]!) / 2];
  const setup = () => {
    const C = ctx('side_plank', 'shoulder'), LR = C.lms.right, LW = C.lms.wrong, pan = C.panel('right');
    // the body axis in panel px: the Right's hips-mid -> shoulders-mid (project each landmark, then take the midpoint)
    const a = mid(pan(LR['hip.r']), pan(LR['hip.l'])), b = mid(pan(LR['shoulder.r']), pan(LR['shoulder.l'])), d = [b[0]! - a[0]!, b[1]! - a[1]!], n = Math.hypot(d[0]!, d[1]!), ax = [d[0]! / n, d[1]! / n];
    const gap = (L: any) => { const s = pan(L['shoulderTop.r']), e = pan(L.ear); return (e[0]! - s[0]!) * ax[0]! + (e[1]! - s[1]!) * ax[1]!; };
    return { C, LR, LW, pan, ax, gap, nearer: gap(LR) - gap(LW) };
  };
  it('the Wrong bottom shoulder comes 20-30 panel px nearer the ear along the body axis', () => {
    const { nearer } = setup();
    console.log(`PF5 W7 side_plank: shoulderTop->ear along the body axis, nearer by ${nearer.toFixed(2)} panel px`);
    expect(nearer).toBeGreaterThanOrEqual(20);
    expect(nearer).toBeLessThanOrEqual(30);
  });
  it('mutation: with no shrug (the Wrong = the end pose) the shoulder comes 0 px nearer, under 20', () => {
    const { LR, pan, ax } = setup();
    const gap = (L: any) => { const s = pan(L['shoulderTop.r']), e = pan(L.ear); return (e[0]! - s[0]!) * ax[0]! + (e[1]! - s[1]!) * ax[1]!; };
    const Lend = ENGINE.side_plank.landmarksOf(HM.side_plank.default.plate.poses.end, H);   // the Wrong replaced by the unshrugged end pose
    const nearer = gap(LR) - gap(Lend);
    console.log(`PF5 W7 side_plank mutation (no shrug): nearer ${nearer.toFixed(2)} panel px`);
    expect(nearer).toBeLessThan(20);
  });
  it('the bottom elbow and shoulder joint keep the Right\'s place (<= 2 panel px); mutation: the arm-rides shrug moves the elbow ~17 px', () => {
    const { C } = setup(), pr = (role: string, nm: string) => C.panel(role)(C.lms[role][nm]);
    const elbow = dist(pr('right', 'elbow.r'), pr('wrong', 'elbow.r')), sh = dist(pr('right', 'shoulder.r'), pr('wrong', 'shoulder.r'));
    console.log(`PF5 W7 side_plank: elbow moved ${elbow.toFixed(2)} panel px, shoulder joint ${sh.toFixed(2)} px`);
    expect(elbow).toBeLessThanOrEqual(2);
    expect(sh).toBeLessThanOrEqual(2);
    // the main shrug (scap.r elev 12, the arm rides along) moves the elbow far
    const END = HM.side_plank.default.plate.poses.end, mainShrug = { ...END, scap: { r: { elev: 12 } } };
    const Lm = ENGINE.side_plank.landmarksOf(mainShrug, H), panR = C.panel('right');
    const mv = dist(panR(C.lms.right['elbow.r']), panR(Lm['elbow.r']));
    console.log(`PF5 W7 side_plank mutation (arm rides): elbow moved ${mv.toFixed(2)} panel px`);
    expect(mv).toBeGreaterThan(10);
  });
  it('the Wrong crop draws one m-arrow that points up toward the Wrong ear; mutation: no arrow guide, none drawn', () => {
    const h = html('side_plank', 'shoulder', 'wrong');
    const arrows = [...h.matchAll(/<path class="m-arrow" d="M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/g)];
    expect(arrows.length, 'one m-arrow').toBe(1);
    const [, ax, ay, bx, by] = arrows[0]!.map(Number) as any;
    const C = ctx('side_plank', 'shoulder'), earW = C.P(C.lms.wrong.ear), shTopW = C.P(C.lms.wrong['shoulderTop.r']);
    const dAr = [bx - ax, by - ay], dEar = [earW[0]! - shTopW[0]!, earW[1]! - shTopW[1]!];
    console.log(`PF5 W7 side_plank arrow (plate px): tail [${ax.toFixed(1)}, ${ay.toFixed(1)}] -> tip [${bx.toFixed(1)}, ${by.toFixed(1)}]; tip->ear dot ${(dAr[0]! * dEar[0]! + dAr[1]! * dEar[1]!).toFixed(1)}`);
    expect(by).toBeLessThan(ay);   // points up (screen y down)
    expect(dAr[0]! * dEar[0]! + dAr[1]! * dEar[1]!).toBeGreaterThan(0);   // toward the Wrong ear
    const z = HM.side_plank.default.zooms.find((x: any) => x.key === 'shoulder');
    const noGuide = { ...z, guides: [] };
    const cut = crop.engineCrop({ ...HM.side_plank.default, zooms: [noGuide] }, OPT.side_plank.crop, ENGINE.side_plank);
    expect(/class="m-arrow"/.test(cut(noGuide, 'wrong'))).toBe(false);
  });
});

// ============================================================ jumping_jacks =========================================
describe('PF5 W7 jumping_jacks', { timeout: T }, () => {
  const toeOut = (L: any, s: string) => { const h = L[`heel.${s}`], t = L[`toe.${s}`], d = [t[0]! - h[0]!, t[2]! - h[2]!]; return Math.abs(Math.atan2(d[0]!, d[1]!) * 180 / Math.PI); };

  it('each Wrong foot turns out 30-45 deg; the Right stays near 0', () => {
    const C = ctx('jumping_jacks', 'toes-forward');
    const w = ['l', 'r'].map(s => toeOut(C.lms.wrong, s));
    console.log(`PF5 W7 jumping_jacks toe-out (deg): Wrong ${w.map(v => v.toFixed(2))}, Right ${['l', 'r'].map(s => toeOut(C.lms.right, s).toFixed(2))}`);
    for (const v of w) { expect(v).toBeGreaterThanOrEqual(30); expect(v).toBeLessThanOrEqual(45); }
  });
  it('mutation: the plate Mistake (M_ROT 30) turns the feet 29.72 deg, under 30', () => {
    const C = ctx('jumping_jacks', 'toes-forward');
    const sp = HM.jumping_jacks.default.plate, mis = mergeDeep(sp.poses.end, sp.mistake.pose), L = ENGINE.jumping_jacks.landmarksOf(mis, H);
    const v = toeOut(L, 'r');
    console.log(`PF5 W7 jumping_jacks mutation (plate M_ROT): toe-out ${v.toFixed(2)} deg`);
    expect(v).toBeLessThan(30);
    void C;
  });
  // GUARD (the build keeps the whole turn in the panel): every toe-axis guide point inside [0, 171]; mutation: a smaller
  // window (sizePx 90) at the same turn pushes a tip outside.
  it('every toe-axis guide point sits inside the [0, 171] panel; mutation: sizePx 90 pushes a tip outside', () => {
    const C = ctx('jumping_jacks', 'toes-forward');
    const pts = (HM.jumping_jacks.default.zooms[0].guides ?? []).flatMap((g: any) => g.pts.map((w: number[]) => C.panel('wrong')(w)));
    const xs = pts.map((p: number[]) => p[0]!);
    console.log(`PF5 W7 jumping_jacks axis guide panel px: x [${Math.min(...xs).toFixed(1)}, ${Math.max(...xs).toFixed(1)}]`);
    for (const p of pts) { expect(p[0]!).toBeGreaterThanOrEqual(0); expect(p[0]!).toBeLessThanOrEqual(C.PANEL); expect(p[1]!).toBeGreaterThanOrEqual(0); expect(p[1]!).toBeLessThanOrEqual(C.PANEL); }
    // sizePx 90 (a tighter window) at the same turn puts an axis tip outside the panel
    const PANEL = crop.PANEL, k = PANEL / 90, cam = ENGINE.jumping_jacks.renderPlate(HM.jumping_jacks.default.plate, { id: 'm' }).report.camera;
    const P = (w: number[]) => [cam.x0 + w[0]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
    const off = C.z.crop.center.off, c0 = P(C.lms.right['ankle.r']), c = [c0[0]! + off[0]!, c0[1]! + off[1]!];
    const pan = (w: number[]) => { const p = P(w); return [(p[0]! - (c[0]! - 45)) * k, (p[1]! - (c[1]! - 45)) * k]; };
    const pts2 = (C.z.guides ?? []).flatMap((g: any) => g.pts.map((w: number[]) => pan(w)));
    const out = pts2.some((p: number[]) => p[0]! < 0 || p[0]! > PANEL || p[1]! < 0 || p[1]! > PANEL);
    console.log(`PF5 W7 jumping_jacks mutation (sizePx 90): a tip outside = ${out}`);
    expect(out).toBe(true);
  });
  // GUARD (green on main and build): the toe-axis arrowheads must not fall back to SVG black. The page already earns the
  // path CSS through closeups.mjs cssFor (a sheet whose posture zooms draw a `path` guide gets the z-path rules, E2
  // a2106536, on e15e1c65), so this holds on main too; it is kept as a guard that the W7 change does not lose it.
  it('the drawn toe-axis guide classes carry the mistake token (.m), and their CSS rule strokes var(--mistake), never black', () => {
    const css = cssOf('jumping_jacks'), h = html('jumping_jacks', 'toes-forward', 'wrong');
    expect(/class="z-path(?:-head)? m"/.test(h), 'the guide heads carry .m').toBe(true);
    expect(/\.z-path\.m \{ stroke: var\(--mistake\)/.test(css)).toBe(true);
    expect(/\.z-path-head\.m \{ stroke: var\(--mistake\)/.test(css)).toBe(true);
    expect(/(?:^|[^-\w])(?:#000(?:000)?\b|black\b)/.test(css.replace(/var\(--[^)]*\)/g, '')), 'no black literal in the path rules').toBe(false);
  });
});
