// LIB-PLATEFIX-5 item 1, the W6 close-ups (card D-PF4-W67LATER, D-PLAN-W8C; PLAN #419 6849384938, RULED 6849391955):
// cable_external_rotation `cer-turn`, diamond_push_up `shoulder-blades` (+ the `hip-line` guard), cable_chest_press
// `cable-press-stance`, hip_adduction `add-start`. Each is rendered as its page draws it (pages/lb06, lb07.closeups.mjs) and
// measured from the crop html and the vendor engine's landmarks and body shapes at the plate's camera ("plate px"; "panel
// px" = the 171 px crop). The renderer piece: two crop-only guide kinds `turn` and `width` (render/closeup/crop.mjs, opt-in,
// Wrong only), drawn with rules every non-e1 zoom sheet already has (.z-drop/.z-drop-head, .z-level.m), so no sheet's CSS
// and no other close-up moves: the last describe pins every other posture close-up of every page to main e15e1c65's bytes.
// Red on main e15e1c65: CER under/turn, diamond hump/toes-wrist/under, CCP hollow/mark/under, hip_adduction arrows/width/
// framing. Guards (green on main, ruled as guards): CER posted turn and hips, diamond drop/dot/hip-line, CCP handles,
// hip_adduction amplitude.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000, PANEL = 171;
type V = number[];
let cu: any, vb: any, vp: any, mergeDeep: any, PAGES: any;
beforeAll(async () => {
  [cu, vb, vp] = await Promise.all(['render/closeups.mjs', '../vendor/engine/body.mjs', '../vendor/engine/plate.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  mergeDeep = (await import(/* @vite-ignore */ lib('render/closeup/common.mjs'))).mergeDeep;
  PAGES = { lb06: (await import(/* @vite-ignore */ lib('pages/lb06.closeups.mjs'))).CLOSEUP_OPTIONS, lb07: (await import(/* @vite-ignore */ lib('pages/lb07.closeups.mjs'))).CLOSEUP_OPTIONS };
}, T);

const d2 = (a: V, b: V) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!);
const segDist = (p: V, a: V, b: V) => { const u = [b[0]! - a[0]!, b[1]! - a[1]!], l2 = u[0]! ** 2 + u[1]! ** 2, t = l2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * u[0]! + (p[1]! - a[1]!) * u[1]!) / l2)) : 0;
  return Math.hypot(p[0]! - a[0]! - t * u[0]!, p[1]! - a[1]! - t * u[1]!); };
const nums = (s: string) => (s.match(/-?[\d.]+/g) ?? []).map(Number);
/** Distance from p along unit u to the first crossing of the polygon's edge (as scratch scripts-w6 measure.mjs rayHit). */
const rayHit = (p: V, u: V, poly: V[]) => { let best = NaN; for (let i = 0; i < poly.length; i++) { const a = poly[i]!, b = poly[(i + 1) % poly.length]!, e = [b[0]! - a[0]!, b[1]! - a[1]!], den = u[0]! * e[1]! - u[1]! * e[0]!;
  if (Math.abs(den) < 1e-12) continue; const w = [a[0]! - p[0]!, a[1]! - p[1]!], t = (w[0]! * e[1]! - w[1]! * e[0]!) / den, s = (w[0]! * u[1]! - w[1]! * u[0]!) / den; if (t > 0 && s >= 0 && s <= 1 && !(t >= best)) best = t; } return best; };

/** One id's zoom as its page draws it, with the crop camera and the engine's landmarks and body shapes. */
async function ctxOf(page: 'lb06' | 'lb07', id: string, key: string) {
  const specFile = join(process.cwd(), `tools/plates/library/specs/${id}.mjs`);
  const mod = await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`)), howto = mod.default, z = howto.zooms.find((q: any) => q.key === key);
  const engine = await cu.engineOf(specFile), opt = PAGES[page][id];
  const CAM = vp.renderPlate(howto.plate, { id: 'base' }).report.camera, H = howto.plate.body?.height ?? 1.75, sp = howto.plate;
  const side = sp.view === 'side', left = sp.facing === 'left', pitch = side ? 0 : (sp.camera?.pitch ?? 0), pc = Math.cos(pitch * Math.PI / 180), ps = Math.sin(pitch * Math.PI / 180);
  const sx = side ? (left ? (w: V) => -w[2]! : (w: V) => w[2]!) : (w: V) => w[0]!;
  const P = (w: V): V => [CAM.x0 + sx(w) * CAM.pxPerM, CAM.y0 - (w[1]! * pc - w[2]! * ps) * CAM.pxPerM];
  const poseOf = (ref: any) => typeof ref === 'string' ? sp.poses[ref] : mergeDeep(sp.poses[ref.base], ref.pose);
  const lm = (pose: any) => vb.landmarksOf(pose, H);
  const shapes = (pose: any) => { const body = { height: H }, sk = vb.fk(vb.resolve(vb.normPose(pose, body), body).q, body), facing = sp.facing ?? 'right';
    const cam = { view: side ? 'side' : 'front', facing, near: side ? (facing === 'left' ? 'l' : 'r') : null, P, pxm: CAM.pxPerM };
    return vb.bodyShapes(sk, cam, { armsFront: sp.armsFront, hand: sp.hand, torso: sp.torso, ...(sp.depth ? { depth: sp.depth, pitch: sp.camera?.pitch ?? 0 } : {}) }); };
  const shape = (pose: any, k: string): V[] => shapes(pose).find((s: any) => s.key === k).poly;
  /** The zoom rendered with these options: html, its two panels and each panel's plate px -> panel px map. */
  const render = (zz: any = z, o: any = opt) => {
    const api = cu.closeupApi(mod, o, { engine, specFile }), html = api.postureZoom(zz);
    const [R, W] = html.split('<div class="plate z-wrap">').slice(1) as string[];
    const map = (s: string) => { const [vx, vy, sz] = nums(/viewBox="([^"]*)" class="z-plate"/.exec(s)![1]!), k = PANEL / sz!; return { k, to: (q: V): V => [(q[0]! - vx!) * k, (q[1]! - vy!) * k] }; };
    return { html, R: R!, W: W!, css: api.CSS as string, mR: map(R!), mW: map(W!) };
  };
  /** The pose the Wrong panel shows: its own pose when solid, else merged over the Right (as crop.mjs). */
  const wrongOf = (zz: any) => zz.wrong.solid ? poseOf(zz.wrong) : mergeDeep(poseOf(zz.right), poseOf(zz.wrong));
  return { mod, howto, z, opt, P, poseOf, lm, shape, render, wrongOf, floor: P([0, 0, 0])[1]! };
}
const FADE_CSS = '.z-crop .z-fade { opacity: .35; }';
/** wrong.under drawn: the Wrong panel holds the Right's plate in a z-fade group, no dashed mistake layer, the fade rule on. */
const underOf = (r: any, key: string) => ({ fade: r.W.includes('<g class="z-fade">') && r.W.includes(`${key}-under`), dashed: r.W.includes('m-pose'), css: r.css.includes(FADE_CSS), rightFade: r.R.includes('z-fade') });
const underOk = (u: any) => u.fade && !u.dashed && u.css && !u.rightFade;

describe('PF5 W6 cable_external_rotation cer-turn: shoulder line turned against square hips, solid Wrong over the faded Right, curved red arrow', () => {
  let c: any, m: any;
  const TURN = { r: 24, a0: 155 };   // the zoom's TURN_R and TURN_A[0] (plate px, screen deg), the PLAN's values
  const measure = (z: any) => {
    const R = c.poseOf(z.right), W = c.wrongOf(z), lR = c.lm(R), lW = c.lm(W), r = c.render(z);
    const sl = lW['shoulder.l'], sr = lW['shoulder.r'], hl = lW['hip.l'], hr = lW['hip.r'];
    const yaw = Math.abs(Math.atan2(sl[2] - sr[2], sl[0] - sr[0]) * 180 / Math.PI), hipYaw = Math.abs(Math.atan2(hl[2] - hr[2], hl[0] - hr[0]) * 180 / Math.PI);
    const st = c.P(lW.sternum), far = Math.abs(c.P(sl)[0] - st[0]), near = Math.abs(c.P(sr)[0] - st[0]);
    const hipShift = Math.max(...['hip.l', 'hip.r', 'hips', 'sacrum'].map(k => d2(c.P(lR[k]), c.P(lW[k]))));
    const turns = [...r.W.matchAll(/<g class="z-turn"><path class="z-drop" d="M([-\d.]+) ([-\d.]+)A([\d.]+) [\d.]+ 0 [01] [01] [-\d.]+ [-\d.]+"\/><path class="z-drop-head" d="[^"]+Z"\/><\/g>/g)]
      .map(q => { const [x, y, rr] = [+q[1]!, +q[2]!, +q[3]!], a = TURN.a0 * Math.PI / 180; return { r: rr, c: [x - rr * Math.cos(a), y - rr * Math.sin(a)] }; });
    const chest = r.mW.to(c.P(lW.chest));
    return { yaw, hipYaw, farNear: far / near, farZ: sl[2], nearZ: sr[2], hipShift, under: underOf(r, z.key),
      turn: { n: turns.length, nRight: (r.R.match(/z-turn/g) ?? []).length, off: turns[0] ? d2(turns[0].c, chest) : NaN, r: turns[0]?.r ?? NaN, want: TURN.r * r.mW.k } };
  };
  const postedOk = (q: any) => q.yaw >= 30 && q.farNear <= 0.6 && q.farZ < q.nearZ;
  const hipsOk = (q: any) => q.hipShift <= 1 && q.hipYaw <= 0.5;
  const turnOk = (q: any) => q.turn.n === 1 && q.turn.nRight === 0 && q.turn.off <= 1 && Math.abs(q.turn.r - q.turn.want) <= 0.05;
  beforeAll(async () => { c = await ctxOf('lb07', 'cable_external_rotation', 'cer-turn'); m = measure(c.z); console.log('PF5 W6 cer-turn', JSON.stringify(m, (k, v) => typeof v === 'number' ? +v.toFixed(3) : v)); }, T);
  it('guard (posted): the Wrong shoulder line is turned >= 30 deg in the world, the far shoulder behind the near one and its half-width <= 0.6 of the near one', () => {
    expect(m.yaw).toBeGreaterThanOrEqual(30);
    expect(m.farZ).toBeLessThan(m.nearZ);
    expect(m.farNear).toBeLessThanOrEqual(0.6);
  });
  it('guard: the hips stay square (hip.l, hip.r, hips, sacrum within 1 plate px of the Right; hip line yaw <= 0.5 deg)', () => {
    expect(m.hipShift).toBeLessThanOrEqual(1);
    expect(m.hipYaw).toBeLessThanOrEqual(0.5);
  });
  it('wrong.under: the twisted torso is drawn solid over the faded square Right (z-fade holding the Right, no dashed layer, the fade rule on)', () => {
    expect(m.under).toEqual({ fade: true, dashed: false, css: true, rightFade: false });
  });
  it('one curved red arrow (crop guide turn) in the Wrong only, centred on the Wrong chest within 1 panel px, radius 24 plate px', () => {
    expect(m.turn.n).toBe(1);
    expect(m.turn.nRight).toBe(0);
    expect(m.turn.off).toBeLessThanOrEqual(1);
    expect(Math.abs(m.turn.r - m.turn.want)).toBeLessThanOrEqual(0.05);
    expect(turnOk(m)).toBe(true);
  });
  it('mutations turn each row red', { timeout: T }, () => {
    const z = c.z, wr = (w: any) => ({ ...z, wrong: { ...z.wrong, ...w } });
    expect(underOk(measure(wr({ under: false })).under)).toBe(false);                                   // under removed
    expect(turnOk(measure({ ...z, guides: [] }))).toBe(false);                                            // turn removed
    expect(turnOk(measure({ ...z, guides: z.guides.map((g: any) => ({ ...g, kind: 'arc-arrow' })) }))).toBe(false);   // arc-arrow kept: not drawn when solid
    expect(hipsOk(measure(wr({ pose: mergeDeep(z.wrong.pose, { root: { yaw: 35 } }) })))).toBe(false); // hips turned too
    expect(postedOk(measure(wr({ pose: mergeDeep(z.wrong.pose, { trunk: { yaw: 0 } }) })))).toBe(false); // the turn removed
  });
});

describe('PF5 W6 diamond_push_up shoulder-blades: rolled shoulder, rounded upper back, solid Wrong over the faded Right; hip-line guard', () => {
  let c: any, m: any, h: any;
  const measure = (z: any) => {
    const R = c.poseOf(z.right), W = c.wrongOf(z), lR = c.lm(R), lW = c.lm(W), r = c.render(z), Pw = (k: string) => c.P(lW[k]), Pr = (k: string) => c.P(lR[k]);
    const hump = (pose: any, l: any) => { const t = c.shape(pose, 'torso'), A = c.P(l.sacrum), B = c.P(l.neck), L = d2(A, B), n = [(B[1] - A[1]) / L, -(B[0] - A[0]) / L];
      return Math.max(...t.map((q: V) => (q[0]! - A[0]) * n[0]! + (q[1]! - A[1]) * n[1]!)); };
    const low = (k: string) => c.floor - Math.max(...c.shape(W, k).map((q: V) => q[1]!));
    const dot = /<circle class="z-anchor m" cx="([-\d.]+)" cy="([-\d.]+)"/.exec(r.W);
    return { humpR: hump(R, lR), humpW: hump(W, lW), headLow: low('head'), torsoLow: low('torso'),
      toes: Math.max(...['toe.r', 'toe.l'].flatMap(k => [Math.abs(Pw(k)[1] - c.floor), d2(Pw(k), Pr(k))])),
      grip: d2(Pw('grip.r'), Pr('grip.r')), wristY: Math.abs(Pw('wrist.r')[1] - Pr('wrist.r')[1]),
      drop: Pw('shoulder.r')[1] - Pr('shoulder.r')[1], ahead: Pw('shoulder.r')[0] - Pw('wrist.r')[0],
      dot: dot ? d2([+dot[1]!, +dot[2]!], r.mW.to(Pw('shoulder.r'))) : NaN, under: underOf(r, z.key), drops: (r.W.match(/class="z-drop"/g) ?? []).length,
      // PF5 fix round (#419 6851987591 L5): the shoulder carried forward past the wrist line, a forward-pointing arrow
      aheadR: Pr('shoulder.r')[0] - Pr('wrist.r')[0], fwd: forwardOf(r, Pw('shoulder.r'), Pr('wrist.r')) };
  };
  /** The Wrong crop's turn arrows (tip direction, centre offset from the Wrong shoulder) and wrist lines, the Right's counts. */
  const forwardOf = (r: any, sh: V, wr: V) => {
    const turns = [...r.W.matchAll(/<g class="z-turn"><path class="z-drop" d="M([-\d.]+) ([-\d.]+)A([\d.]+) [\d.]+ 0 [01] [01] ([-\d.]+) ([-\d.]+)"\/><path class="z-drop-head" d="M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)Z"\/><\/g>/g)].map(q => q.slice(1).map(Number));
    const t = turns[0], tip = t ? [t[7]!, t[8]!] : [NaN, NaN], base = t ? [(t[5]! + t[9]!) / 2, (t[6]! + t[10]!) / 2] : [NaN, NaN];
    const wd = [...r.W.matchAll(/<path class="z-width z-level m" d="M([-\d.]+) 4V/g)].map(q => +q[1]!);
    return { n: turns.length, nRight: (r.R.match(/z-turn|z-width/g) ?? []).length, dx: tip[0]! - base[0]!, dy: tip[1]! - base[1]!,
      off: t ? Math.abs(d2([t[0]!, t[1]!], r.mW.to(sh)) - t[2]!) : NaN, wrist: wd.length === 1 ? Math.abs(wd[0]! - r.mW.to(wr)[0]!) : NaN, nWidth: wd.length,
      plainDrops: (r.W.replace(/<g class="z-turn">[\s\S]*?<\/g>/g, '').match(/class="z-drop"/g) ?? []).length };
  };
  /** hip-line: the shoulder joint's place across the thorax (to the back and front edges of the torso, along the normal of
   *  backUpper -> neck) in the Right and the Wrong, and the head's box in each panel. */
  const hipLine = (z: any) => {
    const r = c.render(z), out: any = {};
    for (const [n, pose, map] of [['R', c.poseOf(z.right), r.mR], ['W', c.wrongOf(z), r.mW]] as const) {
      const l = c.lm(pose), S = c.P(l['shoulder.r']), A = c.P(l.backUpper), B = c.P(l.neck), L = d2(A, B), up = [(B[1] - A[1]) / L, -(B[0] - A[0]) / L], torso = c.shape(pose, 'torso');
      const head = c.shape(pose, 'head').map((q: V) => (map as any).to(q));
      out[n] = { dor: rayHit(S, up, torso), ven: rayHit(S, [-up[0]!, -up[1]!], torso), head: [Math.min(...head.map((q: V) => q[0]!)), Math.min(...head.map((q: V) => q[1]!)), Math.max(...head.map((q: V) => q[0]!)), Math.max(...head.map((q: V) => q[1]!))] };
    }
    return out;
  };
  const humpOk = (q: any) => q.humpW >= q.humpR + 3;
  const clearOk = (q: any) => q.headLow > 0 && q.torsoLow > 0 && q.toes <= 0.5;
  const handsOk = (q: any) => q.grip <= 0.5 && q.wristY <= 0.1;
  const shoulderOk = (q: any) => q.drop >= 10 && q.ahead > 0 && q.dot <= 1;
  const forwardOk = (q: any) => q.ahead >= q.aheadR + 6;
  const arrowOk = (q: any) => q.fwd.n === 1 && q.fwd.nRight === 0 && q.fwd.plainDrops === 0 && q.fwd.dx > 0 && q.fwd.dx > 2 * Math.abs(q.fwd.dy) && q.fwd.off <= 1;
  const wristOk = (q: any) => q.fwd.nWidth === 1 && q.fwd.wrist <= 1;
  const hipOk = (q: any) => Math.abs(q.R.dor - q.W.dor) <= 1 && Math.abs(q.R.ven - q.W.ven) <= 1 && [q.R, q.W].every((s: any) => s.head[0] >= 0 && s.head[1] >= 0 && s.head[2] <= PANEL && s.head[3] <= PANEL);
  beforeAll(async () => {
    c = await ctxOf('lb07', 'diamond_push_up', 'shoulder-blades'); m = measure(c.z); h = hipLine(c.howto.zooms.find((q: any) => q.key === 'hip-line'));
    console.log('PF5 W6 diamond', JSON.stringify({ m, h }, (k, v) => typeof v === 'number' ? +v.toFixed(3) : v));
  }, T);
  it('the Wrong upper back is rounded: the torso hump above the sacrum -> neck chord is >= 3 plate px over the Right\'s', () => {
    expect(m.humpW).toBeGreaterThanOrEqual(m.humpR + 3);
  });
  it('guard (ruled, green on main, held by the new pose): the Wrong head and torso stay above the floor, both toe tips on the floor at the Right\'s spot (0.5 px)', () => {
    expect(m.headLow).toBeGreaterThan(0);
    expect(m.torsoLow).toBeGreaterThan(0);
    expect(m.toes).toBeLessThanOrEqual(0.5);
  });
  it('guard (ruled, green on main, held by the new pose): the hands stay on their grips (0.5 px), the wrist re-solved so the palm lies level (wrist height within 0.1 px)', () => {
    expect(m.grip).toBeLessThanOrEqual(0.5);
    expect(m.wristY).toBeLessThanOrEqual(0.1);
  });
  it('guard (ruled): the rolled shoulder is >= 10 px nearer the floor than the Right\'s and ahead of the wrist line, the red dot on it within 1 panel px', () => {
    expect(m.drop).toBeGreaterThanOrEqual(10);
    expect(m.ahead).toBeGreaterThan(0);
    expect(m.dot).toBeLessThanOrEqual(1);
  });
  it('wrong.under: the Wrong is drawn solid over the faded Right', () => {
    expect(m.under).toEqual({ fade: true, dashed: false, css: true, rightFade: false });
  });
  it('fix round L5: the Wrong shoulder is carried forward, >= 6 plate px further ahead of the wrist than the Right\'s', () => {
    expect(m.ahead - m.aheadR).toBeGreaterThanOrEqual(6);
  });
  it('fix round L5: one red arrow rolls over the Wrong shoulder (crop turn, on a circle round it within 1 panel px) and ends pointing forward (dx > 0, |dx| > 2|dy|); no straight drop arrow; none in the Right', () => {
    expect(arrowOk(m)).toBe(true);
  });
  it('fix round L5: one grey dashed wrist line (crop width) in the Wrong at the wrist\'s x within 1 panel px', () => {
    expect(wristOk(m)).toBe(true);
  });
  it('guard hip-line: the shoulder joint sits at the same place on the trunk in the Right and the Wrong (1 px), the head inside both panels', () => {
    expect(Math.abs(h.R.dor - h.W.dor)).toBeLessThanOrEqual(1);
    expect(Math.abs(h.R.ven - h.W.ven)).toBeLessThanOrEqual(1);
    expect(hipOk(h)).toBe(true);
  });
  it('mutations turn each row red', { timeout: T }, () => {
    const z = c.z, P0 = z.wrong.pose, wr = (w: any) => ({ ...z, wrong: { ...z.wrong, ...w } });
    const asRight = measure(wr({ pose: z.right.pose }));                                                  // the Right pose as Wrong
    expect(humpOk(asRight)).toBe(false);
    expect(shoulderOk(asRight)).toBe(false);
    expect(humpOk(measure(wr({ pose: { ...P0, trunk: 0 } })))).toBe(false);                             // flex removed
    expect(clearOk(measure(wr({ pose: { ...P0, root: { ...P0.root, at: [P0.root.at[0], P0.root.at[1] + 0.05, P0.root.at[2]], tilt: c.mod.stills.rolled.pose.root.tilt } } })))).toBe(false);   // root lifted, toes not re-solved
    expect(handsOk(measure(wr({ pose: { ...P0, wrist: c.mod.stills.rolled.pose.wrist } })))).toBe(false); // wrist not re-solved
    expect(underOk(measure(wr({ under: false })).under)).toBe(false);                                   // under removed
    const stillRolled = measure(wr({ pose: { ...P0, scap: { elev: 0, pro: c.mod.stills.rolled.pose.scap.pro }, ankle: 0 } }));   // fix round: no forward carry
    expect(forwardOk(stillRolled)).toBe(false);
    const drop = [{ kind: 'drop', from: { at: 'shoulder.r', pose: 'right', off: [0, -4] }, to: { at: 'shoulder.r', pose: 'mistake', off: [0, 0] } }];
    expect(arrowOk(measure({ ...z, guides: drop }))).toBe(false);                                         // the round's drop arrow
    expect(arrowOk(measure({ ...z, guides: z.guides.map((g: any) => g.kind === 'turn' ? { ...g, a1: 30 } : g) }))).toBe(false);   // arrow ends pointing down
    expect(wristOk(measure({ ...z, guides: z.guides.filter((g: any) => g.kind !== 'width') }))).toBe(false);   // no wrist line
    const hz = c.howto.zooms.find((q: any) => q.key === 'hip-line');
    expect(hipOk(hipLine({ ...hz, wrong: { ...hz.wrong, pose: mergeDeep(hz.wrong.pose, { scap: { elev: 10 } }) } }))).toBe(false);   // shoulder off the trunk
    expect(hipOk(hipLine({ ...hz, crop: { ...hz.crop, sizePx: 150 } }))).toBe(false);                   // hip-line crop back to 150
  });
});

describe('PF5 W6 cable_chest_press cable-press-stance: a clear lumbar arch, handles at the collarbone, red low-back line, solid Wrong over the faded Right', () => {
  let c: any, m: any;
  const measure = (z: any) => {
    const R = c.poseOf(z.right), W = c.wrongOf(z), lR = c.lm(R), lW = c.lm(W), r = c.render(z);
    /** The torso's back edge (its min x, facing right) hollow: max depth in from its own chord at the sacrum and backUpper heights. */
    const hollow = (pose: any, l: any) => { const t = c.shape(pose, 'torso'), A = c.P(l.sacrum), B = c.P(l.backUpper);
      const edgeAt = (y: number): V => { let x = Infinity; for (let i = 0; i < t.length; i++) { const a = t[i]!, b = t[(i + 1) % t.length]!; if ((a[1]! - y) * (b[1]! - y) > 0 || a[1] === b[1]) continue; x = Math.min(x, a[0]! + (b[0]! - a[0]!) * (y - a[1]!) / (b[1]! - a[1]!)); } return [x, y]; };
      const e0 = edgeAt(A[1]), e1 = edgeAt(B[1]), L = d2(e0, e1), n = [-(e1[1]! - e0[1]!) / L, (e1[0]! - e0[0]!) / L];
      let best = -Infinity; for (let y = Math.min(e0[1]!, e1[1]!); y <= Math.max(e0[1]!, e1[1]!); y += 0.5) { const q = edgeAt(y); best = Math.max(best, (q[0]! - e0[0]!) * n[0]! + (q[1]! - e0[1]!) * n[1]!); }
      return best; };
    const mark = /<path class="z-ol low-back m" d="M([^"]+)"\/>/.exec(r.W), pts: V[] = mark ? mark[1]!.split('L').map(nums) : [];
    const lum = r.mW.to(c.P(lW.lumbar));
    return { hollowR: hollow(R, lR), hollowW: hollow(W, lW), gripToSternum: Math.abs(c.P(lW['grip.r'])[1] - c.P(lW.sternum)[1]), gripRise: c.P(lR['grip.r'])[1] - c.P(lW['grip.r'])[1],
      mark: pts.length > 1 ? Math.min(...pts.slice(1).map((b, i) => segDist(lum, pts[i]!, b))) : NaN,
      markCss: r.css.includes('.z-ol.m { stroke: var(--mistake); stroke-dasharray: 3 2; }'), under: underOf(r, z.key) };
  };
  const archOk = (q: any) => q.hollowW >= 2 * q.hollowR && q.hollowW >= q.hollowR + 4;
  const handsOk = (q: any) => q.gripToSternum <= 1 && q.gripRise >= 15;
  const markOk = (q: any) => q.mark <= 3 && q.markCss;
  beforeAll(async () => { c = await ctxOf('lb06', 'cable_chest_press', 'cable-press-stance'); m = measure(c.z); console.log('PF5 W6 cable-press-stance', JSON.stringify(m, (k, v) => typeof v === 'number' ? +v.toFixed(3) : v)); }, T);
  it('the Wrong back outline hollows clearly: >= 2x the Right\'s and >= 4 plate px more', () => {
    expect(m.hollowW).toBeGreaterThanOrEqual(2 * m.hollowR);
    expect(m.hollowW).toBeGreaterThanOrEqual(m.hollowR + 4);
  });
  it('guard: the Wrong handles are at the collarbone (grip within 1 px of the sternum height) and >= 15 px above the Right\'s', () => {
    expect(m.gripToSternum).toBeLessThanOrEqual(1);
    expect(m.gripRise).toBeGreaterThanOrEqual(15);
  });
  it('a red dashed low-back line in the Wrong (z-ol m, the --mistake dashed rule on) runs within 3 panel px of the Wrong lumbar', () => {
    expect(m.mark).toBeLessThanOrEqual(3);
    expect(m.markCss).toBe(true);
  });
  it('wrong.under: the Wrong is drawn solid over the faded Right', () => {
    expect(m.under).toEqual({ fade: true, dashed: false, css: true, rightFade: false });
  });
  it('mutations turn each row red', { timeout: T }, () => {
    const z = c.z, P0 = z.wrong.pose, wr = (w: any) => ({ ...z, wrong: { ...z.wrong, ...w } }), S0 = c.howto.plate.poses.start;
    expect(archOk(measure(wr({ pose: { reach: P0.reach } })))).toBe(false);                             // arch removed
    expect(handsOk(measure(wr({ pose: { ...P0, reach: S0.reach } })))).toBe(false);                    // handles at the Right's height
    expect(underOk(measure(wr({ under: false })).under)).toBe(false);                                   // under removed
    expect(markOk(measure({ ...z, outlines: undefined }))).toBe(false);                                 // the low-back line removed
  });
});

describe('PF5 W6 hip_adduction add-start: amplitude kept, red outward arrows, grey dashed Right width, legs fill the panel', () => {
  let c: any, m: any;
  const measure = (z: any) => {
    const R = c.poseOf(z.right), W = c.wrongOf(z), lR = c.lm(R), lW = c.lm(W), r = c.render(z);
    const span = (l: any) => Math.abs(c.P(l['knee.l'])[0] - c.P(l['knee.r'])[0]), cx = c.P(lR.hips)[0];
    const arrows = (s: string) => [...s.matchAll(/<path class="m-arrow" d="M([-\d.]+) ([-\d.]+)L([-\d.]+) ([-\d.]+)M/g)].map(q => q.slice(1).map(Number));
    const xs = [...r.W.matchAll(/<path class="z-width z-level m" d="M([-\d.]+) 4V167"\/>/g)].map(q => +q[1]!), want = ['knee.r', 'knee.l'].map(k => r.mW.to(c.P(lR[k]))[0]!);
    const LEGS = ['thigh', 'kneecap', 'shank', 'foot'].flatMap(k => [`${k}.r`, `${k}.l`]);
    const box = (pose: any, map: any) => { const ps = LEGS.flatMap(k => c.shape(pose, k)).map((q: V) => map.to(q)); return [Math.min(...ps.map((q: V) => q[0]!)), Math.min(...ps.map((q: V) => q[1]!)), Math.max(...ps.map((q: V) => q[0]!)), Math.max(...ps.map((q: V) => q[1]!))]; };
    const aW = arrows(r.W);
    return { ratio: span(lW) / span(lR), abd: W.hip?.abd, arrows: aW.length, arrowsRight: arrows(r.R).length, outward: aW.filter(a => Math.abs(a[2]! - cx) > Math.abs(a[0]! - cx)).length,
      widths: xs.length, widthsRight: (r.R.match(/z-width/g) ?? []).length, widthOff: xs.length === 2 ? Math.max(...want.map(w => Math.min(...xs.map(x => Math.abs(x - w))))) : NaN,
      widthCss: r.css.includes('.z-level { fill: none; stroke-width: 1; stroke-dasharray: 3 3; }') && r.css.includes('.z-level.m { stroke: var(--text-3); }'),
      boxW: box(W, r.mW), boxR: box(R, r.mR) };
  };
  const ampOk = (q: any) => Math.abs(q.ratio - 1.294) <= 0.005 && q.abd === 45;
  const arrowsOk = (q: any) => q.arrows === 2 && q.outward === 2 && q.arrowsRight === 0;
  const widthOk = (q: any) => q.widths === 2 && q.widthOff <= 1 && q.widthsRight === 0 && q.widthCss;
  const frameOk = (q: any) => q.boxW[2] - q.boxW[0] >= 0.8 * PANEL && [q.boxW, q.boxR].every((b: V) => b[0]! >= 0 && b[1]! >= 0 && b[2]! <= PANEL && b[3]! <= PANEL);
  beforeAll(async () => { c = await ctxOf('lb06', 'hip_adduction', 'add-start'); m = measure(c.z); console.log('PF5 W6 add-start', JSON.stringify(m, (k, v) => typeof v === 'number' ? +v.toFixed(3) : v)); }, T);
  it('guard: the amplitude is unchanged (Wrong/Right knee span 1.294 +- 0.005, abduction 45)', () => {
    expect(Math.abs(m.ratio - 1.294)).toBeLessThanOrEqual(0.005);
    expect(m.abd).toBe(45);
  });
  it('two red arrows in the Wrong, each running outward from the midline; none in the Right', () => {
    expect(m.arrows).toBe(2);
    expect(m.outward).toBe(2);
    expect(m.arrowsRight).toBe(0);
  });
  it('one grey dashed line per side (crop guide width) in the Wrong at the Right knee\'s x within 1 panel px; none in the Right', () => {
    expect(m.widths).toBe(2);
    expect(m.widthOff).toBeLessThanOrEqual(1);
    expect(m.widthsRight).toBe(0);
    expect(m.widthCss).toBe(true);
  });
  it('the legs fill the panel: the Wrong legs\' box >= 0.8 of 171 px wide, both panels\' legs inside', () => {
    expect(m.boxW[2] - m.boxW[0]).toBeGreaterThanOrEqual(0.8 * PANEL);
    expect(frameOk(m)).toBe(true);
  });
  it('mutations turn each row red', { timeout: T }, () => {
    const z = c.z, wr = (w: any) => ({ ...z, wrong: { ...z.wrong, ...w } });
    expect(ampOk(measure(wr({ pose: mergeDeep(z.wrong.pose, { hip: { abd: 55 } }) })))).toBe(false);   // amplitude widened
    expect(arrowsOk(measure({ ...z, guides: z.guides.filter((g: any) => g.kind !== 'arrow') }))).toBe(false);   // arrows removed
    expect(widthOk(measure({ ...z, guides: z.guides.filter((g: any) => g.kind !== 'width') }))).toBe(false);    // width removed
    expect(frameOk(measure({ ...z, crop: { ...z.crop, sizePx: 260 } }))).toBe(false);                 // main's size 260
  });
});

describe('PF5 W6 renderer kinds: every other posture close-up is byte-equal to main e15e1c65', { timeout: T }, () => {
  // Every posture close-up of every pages/*.closeups.mjs option (engine crops of the zoom shell) and each sheet's CSS, the
  // ids PF5 changes left out (the eight close-up sheets, and the specs PF5 moves: their crops follow the plate), hashed as
  // scratch scripts-w6/allzooms.mjs; main e15e1c65 gives 156 zooms and this digest.
  const EX = new Set(['cable_external_rotation', 'diamond_push_up', 'cable_chest_press', 'hip_adduction',
    'hack_squat', 'jumping_jacks', 'wall_ball', 'side_plank', 'pendulum_squat', 'cable_curl', 'underhand_lat_pulldown']);
  it('156 zooms and every sheet\'s CSS hash to main\'s digest', async () => {
    const root = join(process.cwd(), 'tools/plates/library'), all = createHash('sha256'), skipped: string[] = [];
    let n = 0;
    for (const pf of readdirSync(join(root, 'pages')).filter(f => f.endsWith('.closeups.mjs')).sort()) {
      const { CLOSEUP_OPTIONS } = await import(/* @vite-ignore */ pathToFileURL(join(root, 'pages', pf)).href);
      for (const [key, opt] of Object.entries<any>(CLOSEUP_OPTIONS ?? {}).sort()) {
        const hf = join(root, `howto/lib_${key}.howto.mjs`), sf = join(root, `specs/${key}.mjs`);
        if (!existsSync(hf) || opt.shell !== 'zoom' || opt.crop?.source !== 'engine') { skipped.push(`${pf}:${key}`); continue; }
        if (EX.has(key)) continue;
        const mod = await import(/* @vite-ignore */ pathToFileURL(hf).href), engine = await cu.engineOf(existsSync(sf) ? sf : undefined);
        const api = cu.closeupApi(mod, opt, { engine, specFile: existsSync(sf) ? sf : undefined });
        for (const z of mod.default.zooms.filter((q: any) => q.kind === 'posture')) { all.update(`${pf}:${key}:${z.key}:${createHash('sha256').update(api.postureZoom(z)).digest('hex')}\n`); n++; }
        all.update(`${pf}:${key}:css:${createHash('sha256').update(api.CSS).digest('hex')}\n`);
      }
    }
    expect(skipped).toEqual([]);
    expect(n).toBe(156);
    expect(all.digest('hex')).toBe('27ace3fb56ff7ef1c6eb4429ba4a278ad8d23930c8bddff2d7bcc70486ae3f58');
  });
});

// PF5 fix round (#419 6851987591, cable_chest_press L4 [3,3,4]): each red-flag feel row marks its pain region in the
// D-PFR-L4 form (tests/howto/lib-ship.test.ts W7 block: the regions are bodyMuscles.ts parts): back -> the four lower-back
// parts, shoulder -> both front shoulders; the map draws them as pain. Red on f487c797 (the rows named muscles only).
describe('PF5 fix round cable_chest_press feel: red-flag rows mark their pain region (D-PFR-L4 form)', { timeout: T }, () => {
  const REGIONS: Record<string, string[]> = {
    back: ['lower-back-erectors-left', 'lower-back-ql-left', 'lower-back-erectors-right', 'lower-back-ql-right'],
    shoulder: ['shoulder-front-left', 'shoulder-front-right'],
  };
  let F: any, fm: any;
  beforeAll(async () => {
    F = (await import(/* @vite-ignore */ lib('howto/lib_cable_chest_press.howto.mjs'))).default.feel;
    fm = await import(/* @vite-ignore */ new URL('../../tools/plates/layers/engine/feelmap.mjs', import.meta.url).href);
  });
  const problems = (rows: any[]) => rows.filter(r => r.redFlag).flatMap(r => {
    const want = REGIONS[String(r.redFlag)], got = r.at?.parts ?? [];
    if (!want) return [`${r.key}: red flag ${r.redFlag} has no region`];
    const pain = fm.renderFeelMap({ primary: F.primary, secondary: F.secondary, pain: got, views: ['front', 'back'], id: `ccp-${r.key}`, shimmer: false }).html;
    const drawn = [...pain.matchAll(/<g class="feel-pain">([\s\S]*?)<\/g>/g)].flatMap(q => q[1]!.match(/<path /g) ?? []).length;   // pain paths, both views
    return [...(want.every(p => got.includes(p)) ? [] : [`${r.key} (${r.redFlag}) does not mark ${want.join('+')}`]), ...(drawn >= want.length ? [] : [`${r.key}: ${drawn} pain paths drawn`])];
  });
  it('both red-flag rows (lower-back: back, shoulder: shoulder) name their region parts and the map draws them as pain', () => {
    expect(F.rows.filter((r: any) => r.redFlag).map((r: any) => `${r.key}:${r.redFlag}`)).toEqual(['lower-back:back', 'shoulder:shoulder']);
    expect(problems(F.rows)).toEqual([]);
  });
  it('mutation: dropping either row\'s parts (f487c797) is red', () => {
    for (const k of ['lower-back', 'shoulder']) expect(problems(F.rows.map((r: any) => r.key === k ? { ...r, at: { muscles: r.at.muscles } } : r)), k).not.toEqual([]);
  });
});
