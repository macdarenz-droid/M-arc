// LIB-PLATEFIX-3 (docs/supervisor/verify/lib-platefix-3-card.md; plan ruled on #405 6682844211): the lb4 plate fixes,
// items 3-7. Each block reads what is drawn (the engine's landmarks, report and svg of the spec), and each is red on the
// spec as it stood on main 5023f5c6 (proof listed in the PR).
import { readFileSync } from 'node:fs';
import { describe, expect, it, beforeAll } from 'vitest';

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
/* eslint-disable @typescript-eslint/no-explicit-any */
let plate: any, body: any, eq: any, qaEng: any, env: any;
const S: Record<string, any> = {}, M: Record<string, any> = {};
const IDS = ['bulgarian_split_squat', 'step_up', 'pistol_squat', 'jump_squat', 'wall_sit'];
beforeAll(async () => {
  [plate, body, eq, qaEng] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  env = (await import(/* @vite-ignore */ lib('qa/index.mjs'))).loadPins().envelope;
  for (const id of IDS) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
}, T);
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const lmOf = (id: string) => qaEng.poseLandmarks(Eng(), S[id]).lm;
const camOf = (id: string) => qaEng.cameraOf(S[id], plate.renderPlate(S[id], { id: 'x' }).report);
const H = 1.75, KNEECAP = 0.028 * H;
const kneeIn = (l: any) => { const a = [0, 1, 2].map(i => l['hip.r'][i] - l['knee.r'][i]), b = [0, 1, 2].map(i => l['ankle.r'][i] - l['knee.r'][i]);
  return Math.acos((a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!) / Math.hypot(...a) / Math.hypot(...b)) * 180 / Math.PI; };

describe('LIB-PLATEFIX-3 item 3: bulgarian_split_squat (D-SPLIT-BSSHOVER amended to 0.069)', () => {
  it('the end holds the rear kneecap 6.9 cm above the floor; the Mistake rests it on the floor, the hips lower by the same drop', () => {
    const L = lmOf('bulgarian_split_squat');
    expect(L.end['knee.l'][1] - KNEECAP).toBeCloseTo(0.069, 3);
    expect(Math.abs(L.mistake['knee.l'][1] - KNEECAP)).toBeLessThanOrEqual(0.005);
    const kneeDrop = L.end['knee.l'][1] - L.mistake['knee.l'][1], hipDrop = L.end['hip.r'][1] - L.mistake['hip.r'][1];
    expect(Math.abs(hipDrop - kneeDrop), `hip drop ${hipDrop.toFixed(4)} m vs kneecap drop ${kneeDrop.toFixed(4)} m`).toBeLessThanOrEqual(0.002);
    // the front foot stays where it was (flat, same heel and ball)
    for (const k of ['heel.r', 'ball.r']) expect(Math.hypot(...[0, 1, 2].map(i => L.mistake[k][i] - L.end[k][i]))).toBeLessThanOrEqual(0.005);
  });
  it('the shorter Trace (under the bar at plate scale) gets the k 1.5 normal zoom, the smallest half-step k', () => {
    expect(S.bulgarian_split_squat.zoom).toEqual({ view: 'normal', k: 1.5 });
  });
});

describe('LIB-PLATEFIX-3 item 4: step_up (start at the bottom, end on the box; Mistake mid-rise)', () => {
  it('the Trace runs from the start hip up onto the box: start = the step position, end = standing tall', () => {
    const L = lmOf('step_up'), boxTop = 0.45;
    expect(L.end['hip.r'][1] - L.start['hip.r'][1], 'end hip above start hip').toBeGreaterThan(0.3);
    expect(Math.abs(L.start['heel.l'][1]), 'start: the trailing heel on the floor').toBeLessThanOrEqual(0.005);
    expect(Math.min(L.end['heel.l'][1], L.end['toe.l'][1]) - boxTop, 'end: the trailing foot clear of the box').toBeGreaterThan(0);
    expect(kneeIn(L.end), 'end: the lead knee 5 deg soft').toBeGreaterThan(174);
    const cam = camOf('step_up'), a = cam.P(L.start['hip.r']), b = cam.P(L.end['hip.r']);
    expect(b[1], 'the Trace arrow points up on the plate').toBeLessThan(a[1] - 40);
  });
  it('the Mistake is mid-rise: the lead knee 90 deg, the trunk thrown forward, the trailing heel up on the toe pad', () => {
    const L = lmOf('step_up'), m = L.mistake;
    expect(180 - kneeIn(m)).toBeCloseTo(90, 0);
    const lean = Math.atan2(m.backUpper[2] - m.sacrum[2], m.backUpper[1] - m.sacrum[1]) * 180 / Math.PI;
    expect(lean, 'trunk forward of vertical (deg)').toBeGreaterThan(30);
    expect(m['heel.l'][1]).toBeGreaterThan(0.03);
    expect(m['hip.r'][1], 'above the start hip').toBeGreaterThan(L.start['hip.r'][1]);
  });
});

describe('LIB-PLATEFIX-3 item 5: pistol_squat (the knee tell dropped, a heel zoom)', () => {
  it('one tell, the heel; no knee plumb guide', () => {
    expect(S.pistol_squat.mistake.tells.map((t: any) => t.key)).toEqual(['heel']);
    expect(JSON.stringify(S.pistol_squat.mistake.guides)).not.toContain('knee.r');
  });
  it('the heel moves under the bar at plate scale; k 2.5 is the smallest half-step k that reaches it', () => {
    const L = lmOf('pistol_squat'), cam = camOf('pistol_squat'), a = cam.P(L.end['heel.r']), b = cam.P(L.mistake['heel.r']);
    const d = Math.hypot(a[0] - b[0], a[1] - b[1]);
    expect(d).toBeLessThan(env.deviationMin);
    expect(S.pistol_squat.zoom).toEqual({ view: 'mistake', k: 2.5 });
    expect(d * 2.5).toBeGreaterThanOrEqual(env.deviationMin);
    expect(d * 2).toBeLessThan(env.deviationMin);
  });
});

describe('LIB-PLATEFIX-3 item 6: jump_squat (one open hip path, back then down)', () => {
  it('the drawn hip path never rises and moves back before it moves down; its ends are apart', () => {
    const s = S.jump_squat, B = { height: H }, keys = [s.poses.start, ...(s.poses.via ?? []), s.poses.end].map((p: any) => body.normPose(p, B));
    const hip = (t: number) => body.landmarks(body.fk(body.poseAt(keys, t, B).q, B))['hip.r'];
    const pts = Array.from({ length: 49 }, (_, i) => hip(i / 48));
    for (let i = 1; i < pts.length; i++) expect(pts[i]![1], `hip rises at sample ${i}`).toBeLessThanOrEqual(pts[i - 1]![1] + 1e-4);
    const dz = (a: any, b: any) => Math.abs(b[2] - a[2]), dy = (a: any, b: any) => Math.abs(b[1] - a[1]);
    const half = pts[24]!, first = pts[0]!, last = pts.at(-1)!;
    expect(dz(first, half) / dz(first, last), 'share of the back travel in the first half').toBeGreaterThan(0.6);
    expect(dy(first, half) / dy(first, last), 'share of the down travel in the first half').toBeLessThan(0.5);
    const cam = camOf('jump_squat'), a = cam.P(first), b = cam.P(last);
    expect(Math.hypot(a[0] - b[0], a[1] - b[1]), 'open: the ends apart (px)').toBeGreaterThan(30);
  });
  it('one tell, "Knees straight" ("Hips high" is j5-unsupported)', () => {
    expect(S.jump_squat.mistake.tells.map((t: any) => t.key)).toEqual(['straight']);
  });
});

describe('LIB-PLATEFIX-3 item 7: wall_sit (the hip checkpoint on the hip crease)', () => {
  it('"Hips about 90°", its leader on the thigh\'s top outline at the belly, not near the knee', () => {
    const c = S.wall_sit.callouts.find((x: any) => x.key === 'deg');
    expect(c.text).toBe('Hips<br>about 90°');
    const r = plate.renderPlate(S.wall_sit, { id: 'x' }), L = lmOf('wall_sit'), cam = camOf('wall_sit');
    const hip = cam.P(L.end['hip.r']), knee = cam.P(L.end['knee.r']), top = cam.P(L.end['thighTop.r']);
    const p = qaEng.resolvePoint(c.anchor, 'end', L, cam);
    const ends = [...r.svg.matchAll(/<path class="leader[^"]*" d="M(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
    expect(ends.some(e => Math.hypot(e[0]! - p[0], e[1]! - p[1]) <= 1), 'a leader ends on the anchor').toBe(true);
    const t = ((p[0] - hip[0]) * (knee[0] - hip[0]) + (p[1] - hip[1]) * (knee[1] - hip[1])) / ((knee[0] - hip[0]) ** 2 + (knee[1] - hip[1]) ** 2);
    expect(t, 'along the thigh from the hip').toBeLessThan(0.4);
    // the thigh's top outline: thighTop.r's offset from the hip-knee axis
    const off = (q: number[]) => { const ux = knee[0] - hip[0], uy = knee[1] - hip[1], n = Math.hypot(ux, uy); return ((q[0]! - hip[0]) * uy - (q[1]! - hip[1]) * ux) / n; };
    expect(Math.abs(off(p) - off(top)), 'on the thigh top outline (px)').toBeLessThanOrEqual(0.5);
  });
});

// LIB-PLATEFIX-3 (ruled #405 6683313760 "lb4 H6 reds from card facts"): plateFacts is a machine key (lb4/cards.sha.json
// hashes each card with plateFacts, tempo and topFault removed), so the card facts move with the specs (D-SHIP-W4-TEMPO
// form). Each fact must hold on the drawn pose it names.
describe('LIB-PLATEFIX-3 lb4 card facts follow the re-posed plates', () => {
  const card = (id: string) => JSON.parse(readFileSync(`docs/research/howto/cards/${id}.json`, 'utf8'));
  /** Each plateFacts row checked on the drawn landmarks: contact = on the floor or the box top (y 0 or 0.45 m, 0.5 cm),
   *  height = its m within 0.5 cm. */
  const factProblems = (id: string, facts: any[]) => {
    const L = lmOf(id), bad: string[] = [];
    for (const f of facts) {
      const y = L[f.pose]?.[f.landmark]?.[1];
      if (y == null) { bad.push(`${f.landmark} has no ${f.pose} pose`); continue; }
      if (f.kind === 'height' && Math.abs(y - f.m) > 0.005) bad.push(`${f.landmark} ${f.pose} ${y.toFixed(3)} m, fact ${f.m}`);
      if (f.kind === 'contact' && f.landmark.match(/heel|ball|sole/) && Math.min(Math.abs(y), Math.abs(y - 0.45)) > 0.005) bad.push(`${f.landmark} ${f.pose} ${y.toFixed(3)} m off its support`);
    }
    return bad;
  };
  it('bulgarian: the knee.l height fact is the drawn 6.9 cm gap (0.118 m; was 0.079, the 3 cm gap)', () => {
    const f = card('bulgarian_split_squat').plateFacts;
    expect(f.find((x: any) => x.landmark === 'knee.l').m).toBe(0.118);
    expect(factProblems('bulgarian_split_squat', f)).toEqual([]);
    expect(factProblems('bulgarian_split_squat', f.map((x: any) => (x.landmark === 'knee.l' ? { ...x, m: 0.079 } : x))).length).toBe(1);   // mutation: main's value
  });
  it('step_up: every fact names the spec pose that now draws its card pose (start = card start)', () => {
    const f = card('step_up').plateFacts;
    expect(f.every((x: any) => x.pose === x.cardPose)).toBe(true);
    expect(factProblems('step_up', f)).toEqual([]);
    // mutation: main's pose names (swapped) are red
    const old = f.map((x: any) => ({ ...x, pose: x.cardPose === 'start' ? 'end' : 'start' }));
    expect(factProblems('step_up', old).length).toBeGreaterThan(0);
  });
  it('jump_squat: no heels-down fact at the start (the touchdown is on the balls; the take-off crouch is not drawn)', () => {
    const f = card('jump_squat').plateFacts;
    expect(f.some((x: any) => x.pose === 'start' && /^heel/.test(x.landmark))).toBe(false);
    expect(factProblems('jump_squat', f)).toEqual([]);
    const old = [{ kind: 'contact', landmark: 'heel.l', pose: 'start', cardPose: 'start', claim: 'j2' }, ...f];   // mutation: main's j2 fact
    expect(factProblems('jump_squat', old).length).toBe(1);
  });
});
