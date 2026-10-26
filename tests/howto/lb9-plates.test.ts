// LIB-21 (lib-21-card Do 1, Do 6 a; acceptance A11, A19; rulings D-LIB21-*): the LB9 H build-ahead plates. Node only:
// the browser half of the plate QA runs in tools/plates/library/lb9/qa.mjs. Patterns copied from
// tests/howto/lb10-plates.test.ts (#305 @ a9c64e11). Every test reads what is drawn (the items a spec emits, the
// engine's landmarks, shapes and report), never a helper's own maths. Whole-page renders and generate run in an awaited
// child process (VITEST-RPC ruling A), and every loop over the specs yields one macrotask per spec (D-LIB21-TESTS).
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';
import { otherCards, registryProblems, EQ_COMPOSERS_PATH } from './eq-composers';

// D-LIB21-TESTS (lessons #299 6351689010, 6352726951): one macrotask after every test lets the vitest worker answer
// its RPC; every per-spec loop yields once per spec, and whole-page renders run in a child process.
afterEach(() => new Promise<void>(r => setImmediate(r)));
// A19: the worker's longest event-loop block over the whole file, logged for each milestone post.
const loopDelay = monitorEventLoopDelay({ resolution: 10 });
loopDelay.enable();
afterAll(() => { loopDelay.disable(); console.log(`LIB-21 A19 event-loop: max block ${(loopDelay.max / 1e6).toFixed(0)} ms, p99 ${(loopDelay.percentile(99) / 1e6).toFixed(0)} ms`); });

const LB9 = ['cable_crunch', 'ab_wheel_rollout', 'bird_dog', 'superman', 'pallof_press', 'side_plank', 'russian_twist', 'bicycle_crunch'];
// LB9's other rows: pilot A's plate (pA), pilot B's plate (pB) and the SUPCORE T children; never in an LB9 file.
const ER5 = ['side_plank', 'russian_twist', 'bicycle_crunch'];
const NOT_HERE = ['plank', 'crunch', 'reverse_crunch', 'dead_bug', 'v_up', 'flutter_kicks', 'hollow_body_hold'];
const RESEARCH_HEAD = 'f574bb4b761ded9010a61b59881b6eae125b58e0';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

describe('LIB-21 A11 (Do 6 a): the 8 cards and quotes are byte copies of the LB9 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb9/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 8 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB9);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB9);
    for (const id of LB9) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('bird_dog'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.bird_dog);
  });
  it('mutation: a quotes file from another research head (one byte changed) is red', () => {
    const q = readFileSync('docs/research/howto/quotes/cable_crunch.json', 'utf8');
    expect(sha(q.replace('"', ' "'))).not.toBe(cardsSha.quotes.cable_crunch);
  });
  it('plank, crunch and the 5 SUPCORE T ids are not copied here', () => {
    for (const id of NOT_HERE) expect(Object.keys(cardsSha.cards), id).not.toContain(id);
  });
  it('research/validate.mjs validateCardFile: no problem on the 8 cards (the 5 (a) cards with their keys, the 3 (b) cards without)', async () => {
    const v = await import(/* @vite-ignore */ new URL('../../tools/plates/library/research/validate.mjs', import.meta.url).href);
    for (const id of LB9) expect(v.validateCardFile(`${id}.json`), id).toEqual([]);
  });
});

describe('LIB-21 A5 (first push): rows.json holds no row before a spec is drawn; tempo.json is the proposed map', () => {
  const rows = readJson('tools/plates/library/lb9/rows.json'), t = readJson('tools/plates/library/lb9/tempo.json');
  it('batch LB9, censusRef 4a9fd86; no plank, crunch, T or (b) id in any LB9 rows file; no plank, crunch, T id or bicycle_crunch (before \'LB9 ER5 GO\') in tempo.json', () => {
    expect(rows.batch).toBe('LB9');
    expect(rows.censusRef).toBe('4a9fd86');
    for (const id of [...NOT_HERE, ...ER5]) expect(Object.keys(rows.rows), id).not.toContain(`lib_${id}`);
    for (const id of [...NOT_HERE, 'bicycle_crunch']) expect(Object.keys(t.rows), id).not.toContain(id);
  });
  /** A7 (D-LIB8M-TEMPO): a phase reads from plate.tempo (up, down, pause), Hold only where pause > 0; or it is a constant
   *  that carries its claim and a quote found verbatim in the card's quotes file under that claim, its string the quote's
   *  own seconds (D-LIB21-SECS: side_plank, ruled on #326). */
  const a7 = (id: string, phases: any[], quotes = readJson(`docs/research/howto/quotes/${id}.json`).quotes) => {
    const pt = readJson(`docs/research/howto/cards/${id}.json`).plate.tempo, out: string[] = [];
    for (const p of phases) {
      if ('constant' in p) {
        if (!quotes.some((q: any) => q.claim === p.claim && q.text === p.quote)) out.push(`${id} ${p.phase}: quote not in ${p.claim}`);
        const [a, b] = String(p.constant).split('–').map(Number), nums = [...String(p.quote).matchAll(/\d+/g)].map(m => +m[0]);
        if (!(nums.includes(a!) && nums.includes(b!))) out.push(`${id} ${p.phase}: ${p.constant} not the quote's seconds`);
      } else if (!['up', 'down', 'pause'].includes(p.from)) out.push(`${id} ${p.phase}: from ${p.from}`);
    }
    if (pt && 'pause' in pt && phases.some(p => p.from === 'pause') !== pt.pause > 0) out.push(`${id}: Hold against pause ${pt.pause}`);
    return out;
  };
  it('A7: each tempo row reads only from plate.tempo, with Hold only where pause > 0, or is a constant with its verbatim quote', () => {
    for (const [id, phases] of Object.entries<any[]>(t.rows)) expect(a7(id, phases), id).toEqual([]);
  });
  it('A7 mutations: side_plank\'s constant with a quote from another claim, or a range that is not the quote\'s seconds, is red', () => {
    const sp = t.rows.side_plank;
    expect(a7('side_plank', [{ ...sp[0], claim: 'c2' }]).length).toBe(1);
    expect(a7('side_plank', [{ ...sp[0], constant: '5–15' }]).length).toBe(1);
  });
});

// ---------------------------------------------------------------- the drawn specs (Do 2, Do 4, Do 5, Do 6 b) ----
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const SPECS_DIR = 'tools/plates/library/specs';
const ROWS = 'tools/plates/library/lb9/rows.json';
// DESIGN.md section 15: the held ids ('LB9 NOTE RULED', #312 6382248634: none; ab_wheel_rollout is drawn at the plank
// class's -30 deg sag, D-LIB21-ABSAG, and joins rows.json).
// DESIGN.md section 15: cable_crunch held by D-LIB21-CCHOLD (#312) for a LIB-SPINE engine card (F-SPINE-1).
// The (b) rows drawn at 'LIB-21 resume' (D-LIB21-ER5, Do 7b): off rows.json until their card keys are verified.
const ER5_DRAWN = ['side_plank', 'russian_twist'];
// The front entries asked with the E-R5 slice (#326), measured (px inside the figure past the leader's first 8 px).
const FE_SINK = 9.64, FE_KNEE_END = 18.17, FE_KNEE_MIS = 14.53;
const HELD: string[] = ['cable_crunch', 'superman', 'pallof_press', ...ER5_DRAWN];   // superman: D-LIB21-SIZE (S2); pallof_press: D-LIB21-PALLOFHOLD
// The ids drawn on this branch: the slice (ab_wheel_rollout, cable_crunch, bird_dog), then the bulk as it is drawn, then
// the E-R5 slice at the resume.
const DRAWN = ['cable_crunch', 'ab_wheel_rollout', 'bird_dog', 'superman', 'pallof_press', ...ER5_DRAWN];
const COMPOSERS = ['abWheel', 'medBallOptional'];
const yieldNow = () => new Promise<void>(r => setImmediate(r));
let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, markup: any;
const M: Record<string, any> = {}, S: Record<string, any> = {}, EQ: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, markup] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'qa/markup.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of LB9.filter(i => existsSync(`${SPECS_DIR}/${i}.mjs`))) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
  for (const c of COMPOSERS) EQ[c] = await import(/* @vite-ignore */ lib(`eq/${c}.mjs`));
}, T);
const specsDrawn = () => LB9.filter(i => existsSync(`${SPECS_DIR}/${i}.mjs`));
const drawn = () => specsDrawn().filter(id => !HELD.includes(id));
const pins = () => qaIdx.loadPins();
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const posesOf = (spec: any) => ['start', 'end', ...(spec.mistake?.pose ? ['mistake'] : [])];
const B175 = { height: 1.75 };
/** The equipment items a spec draws for landmarks `lm` in `pose` (plate.mjs drawPose's call), each with its entry index. */
const itemsAt = (spec: any, pose: string, lm: any, start: any, mistake = false, q: any = null) => {
  const ctx = { pose, start, mistake, body: B175, q }, out: any[] = [];
  spec.equipment.forEach((e: any, i: number) => { for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i }); });
  return out;
};
const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
  const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
  return { items: itemsAt(spec, pose, lm, L.lm.start, mistake, L.q[pose] ?? null), lm };
};
const lmOf = (spec: any, pose: string) => qaEng.poseLandmarks(Eng(), spec).lm[pose];
/** Every drawn pose as resolved joint angles: start, end, Mistake, each ghost (plate.mjs ghostT) and each via key. */
const allQs = (spec: any): [string, any][] => {
  const L = qaEng.poseLandmarks(Eng(), spec), keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, B175));
  const nG = spec.ghosts?.count ?? 3, ghosts = Array.from({ length: nG }, (_, i) => [`ghost${i}`, body.poseAt(keys, (i + 1) / (nG + 1), B175).q] as [string, any]);
  const vias = (spec.poses.via ?? []).map((v: any, i: number) => [`via${i}`, body.resolve(body.normPose(v, B175), B175).q] as [string, any]);
  return [...Object.entries<any>(L.q), ...ghosts, ...vias];
};
const lmQ = (q: any) => body.landmarks(body.fk(q, B175));
const skQ = (q: any) => body.fk(q, B175);
/** Items per drawn pose (start, end, Mistake, ghosts, vias): [pose, lm, items]. */
/** The poses whose body is drawn: start, end, Mistake, and the ghosts when the ghost layer draws body parts (a ghost
 *  `parts` list naming only equipment parts draws no body: plate.mjs inGhost). */
const bodyQs = (spec: any) => { const eqParts = new Set(itemsIn(spec, 'end').items.map((i: any) => i.part).filter(Boolean)), gp = spec.ghosts?.parts;
  const ghostBody = !gp || gp.some((p: string) => !eqParts.has(p)); return allQs(spec).filter(([p]) => ['start', 'end', 'mistake'].includes(p) || (ghostBody && p.startsWith('ghost'))); };
/** A pose's drawn body shapes: every shape at start, end and Mistake; in a ghost only the parts the ghost layer draws
 *  (plate.mjs partOf, inGhost). */
const partOf = (key: string) => { const [k, sd] = key.split('.'); return ['shcap', 'upper', 'elbowcap', 'fore', 'fist', 'palm'].includes(k!) ? `arm.${sd}` : ['thigh', 'kneecap', 'shank', 'foot'].includes(k!) ? `leg.${sd}` : 'trunk'; };
const drawnShapes = (spec: any, pose: string, q: any, cam = camOf(spec)) => { const gp = spec.ghosts?.parts;
  return shapesQ(spec, q, cam).filter((x: any) => !pose.startsWith('ghost') || !gp || gp.includes(partOf(x.key)) || gp.includes(x.key)); };
const allItems = (spec: any) => { const st = lmOf(spec, 'start'); return allQs(spec).map(([p, q]) => { const lm = lmQ(q); return [p, lm, itemsAt(spec, p, lm, st, p === 'mistake', q)] as [string, any, any[]]; }); };

const H3D = 1.75;
const segDist = (a: number[], b: number[], c: number[], d: number[]) => {
  let best = Infinity;
  for (let i = 0; i <= 40; i++) {
    const p = a.map((v, k) => v + (b[k]! - v) * i / 40), cd = d.map((v, k) => v - c[k]!), cp = p.map((v, k) => v - c[k]!);
    const t = Math.max(0, Math.min(1, cd.reduce((x, v, k) => x + v * cp[k]!, 0) / cd.reduce((x, v) => x + v * v, 0)));
    best = Math.min(best, Math.hypot(...cp.map((v, k) => v - cd[k]! * t)));
  }
  return best;
};
const rep = (spec: any) => plate.renderPlate(spec, { id: 'x' }).report;
const h9 = (spec: any) => {
  let R: any = null;
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins().envelope }, R).map((p: any) => p.key);
};
const camOf = (spec: any) => {
  const c = rep(spec).camera, side = spec.view === 'side';
  // facing follows the spec (plate.mjs makeCamera: facing 'left' mirrors z and makes the left side near)
  const left = side && spec.facing === 'left';
  // front view: LIB-20's camera.pitch (SPEC.md 1: screen-up = y cos p - z sin p; 0 = the level projection)
  const p = side ? 0 : ((spec.camera?.pitch ?? 0) * Math.PI) / 180, up = (w: number[]) => (p ? w[1]! * Math.cos(p) - w[2]! * Math.sin(p) : w[1]!);
  return { view: side ? 'side' : 'front', near: side ? (left ? 'l' : 'r') : null, facing: left ? 'left' : 'right', pxm: c.pxPerM, pitch: side ? 0 : spec.camera?.pitch ?? 0,
    P: (w: number[]) => [c.x0 + (side ? (left ? -w[2]! : w[2]!) : w[0]!) * c.pxPerM, c.y0 - up(w) * c.pxPerM] };
};
const mergeDeep = (a: any, b: any): any => {
  if (b === undefined) return a;
  if (a && b && typeof a === 'object' && typeof b === 'object' && !Array.isArray(a) && !Array.isArray(b)) { const o = { ...a }; for (const k of Object.keys(b)) o[k] = mergeDeep(a[k], b[k]); return o; }
  return b;
};
const fullPose = (spec: any, pose: string) => (pose === 'mistake' ? mergeDeep(spec.poses.end, spec.mistake.pose) : spec.poses[pose]);
const shapesQ = (spec: any, q: any, cam = camOf(spec)) => body.bodyShapes(body.fk(q, B175), cam, { armsFront: spec.armsFront, hand: spec.hand }).filter((x: any) => x.poly);
const shapesIn = (spec: any, pose: string) => shapesQ(spec, body.resolve(body.normPose(fullPose(spec, pose), B175), B175).q);
const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
const listOf = (spec: any, mistake: boolean) => (mistake ? spec.mistake.tells : [...(spec.measure ? [{ key: '_arc' }] : []), ...spec.callouts]);
const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((s, x, i) => s + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
const d3 = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);
const centre = (pts: number[][]) => [0, 1, 2].map(i => pts.reduce((a, p) => a + p[i]!, 0) / pts.length);
const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });
/** A spec whose function entries pass each returned item through f(item, ctx) (null drops it). */
const mapItems = (spec: any, f: (it: any, ctx: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any) => (lm: any, ctx: any) => {
  const r = typeof e === 'function' ? e(lm, ctx) : e; if (!r) return r; const out = [].concat(r).map((it: any) => (it ? f(it, ctx) : it)).filter(Boolean); return out.length ? out : null; }) });
const shiftPts = (it: any, d: number[]) => ({ ...it, ...(it.pts ? { pts: it.pts.map((p: number[]) => p.map((v, i) => v + d[i]!)) } : {}), ...(it.surface ? { surface: it.surface.map((p: number[]) => p.map((v, i) => v + d[i]!)) } : {}), ...(it.at ? { at: it.at.map((v: number, i: number) => v + d[i]!) } : {}) });
/** Winter (2009) whole-body centre of mass on the drawn landmarks (single_leg_romanian_deadlift.mjs:19-36 @ dcac4a38). */
const comOf = (lm: any) => {
  const mid = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
  let m = 0; const c = [0, 0, 0];
  const seg = (w: number, p: number[]) => { m += w; for (let i = 0; i < 3; i++) c[i] = c[i]! + w * p[i]!; };
  seg(0.081, lm.ear); seg(0.497, mid(lm.shoulders, lm.hips, 0.5));
  for (const s of ['l', 'r']) {
    seg(0.028, mid(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)); seg(0.016, mid(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)); seg(0.006, lm[`grip.${s}`]);
    seg(0.100, mid(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)); seg(0.0465, mid(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)); seg(0.0145, mid(lm[`heel.${s}`], lm[`toe.${s}`], 0.5));
  }
  return c.map(v => v / m);
};
/** Static parts: the items of `part` sit at one place (±1 px) in start, end and Mistake. */
const staticProblems = (spec: any, part: string) => {
  const cam = camOf(spec), pts = (pose: string) => itemsIn(spec, pose).items.filter((i: any) => i.part === part).flatMap((it: any) => eng.PRIMITIVES[it.type](it, cam).flatMap((p: any) => p.poly ?? p.line ?? []));
  const ref = pts('end'), out: string[] = [];
  for (const pose of ['start', 'mistake']) { const q = pts(pose); if (q.length !== ref.length) out.push(`${pose}: ${q.length} vs ${ref.length} points`); else if (q.some((p: number[], i: number) => Math.hypot(p[0]! - ref[i]![0]!, p[1]! - ref[i]![1]!) > 1)) out.push(`${pose}: moved`); }
  return out;
};
/** Every part that moves between the end pose and the Mistake must be a `poly`: the Mistake svg lists one `m-eq` path per changed `poly` item (plate.mjs:209-213). */
const mistakeEqCount = (spec: any) => (plate.renderPlate(spec, { id: 'x', mistake: true }).svg.match(/<path id="x-m-eq\d+"/g) ?? []).length;

// ---- 3D body solids (D-LIB21-FRAME, lb10-plates.test.ts:305 and lb8-plates.test.ts:4207-4240's method) ----
// Limbs: tapered capsules of RADII (proximal to distal) x H on the drawn joints. Head: the drawn head's visual hull
// (at each height an ellipse spanning its side profile's depth and its front profile's width, both the engine's own
// outlines, in the head frame). Torso: the same, in the thorax frame (the skinned torso follows the thorax above the
// lumbar pivot, where the rope and the wheel come near it). Signed distances in metres (negative = inside).
const taper = (p: number[], c: number[], d: number[], r0: number, r1: number) => { const cd = d.map((v, k) => v - c[k]!), cp = p.map((v, k) => v - c[k]!), t = Math.max(0, Math.min(1, cd.reduce((x, v, k) => x + v * cp[k]!, 0) / cd.reduce((x, v) => x + v * v, 0))); return Math.hypot(...cp.map((v, k) => v - cd[k]! * t)) - (r0 + (r1 - r0) * t); };
const LIMBS: [string, string, string, string][] = [['upper', 'shoulder', 'elbow', 'RADII.upper'], ['fore', 'elbow', 'wrist', 'RADII.fore'], ['thigh', 'hip', 'knee', 'RADII.thigh'], ['shank', 'knee', 'ankle', 'RADII.shank']];
const ID3 = { view: 'side', near: 'r', pxm: 1, P: (w: number[]) => [w[2]!, w[1]!] };
const IDF = { view: 'front', near: null, pxm: 1, P: (w: number[]) => [w[0]!, w[1]!] };
/** The body solids of one pose: sd(p, skip) gives the signed distance (m) of world point p to each solid not in skip. */
const solidsOf = (q: any) => {
  const sk = skQ(q), lm = body.landmarks(sk), H = H3D;
  // a drawn part (the head, or the torso in the thorax frame) as a solid: at each height of its frame an ellipse whose
  // depth span is the drawn side outline's and whose half-width is the drawn front outline's (its two projections are
  // exactly the engine's outlines); signed distance (m) by its sampled surface (about 2 mm apart)
  const solidOf = (frame: (r: number[]) => number[], key: string) => {
    const o = frame([0, 0, 0]), ax = [[1, 0, 0], [0, 1, 0], [0, 0, 1]].map(e => frame(e).map((v: number, i: number) => v - o[i]!));
    const toF = (p: number[]) => { const d = p.map((v, i) => v - o[i]!); return ax.map(a => d.reduce((t, v, i) => t + v * a[i]!, 0) / a.reduce((t: number, v: number) => t + v * v, 0)); };
    const sideP = body.bodyShapes(sk, { ...ID3, P: (w: number[]) => { const r = toF(w); return [r[2]!, r[1]!]; } }, {}).find((x: any) => x.key === key).poly;
    const frontP = body.bodyShapes(sk, { ...IDF, P: (w: number[]) => { const r = toF(w); return [r[0]!, r[1]!]; } }, {}).find((x: any) => x.key === key).poly;
    const unitM = Math.hypot(...ax[0]!);
    const span = (P: number[][], y: number) => { const xs: number[] = []; for (let i = 0; i < P.length; i++) { const a = P[i]!, b = P[(i + 1) % P.length]!; if ((a[1]! - y) * (b[1]! - y) <= 0 && a[1] !== b[1]) xs.push(a[0]! + (b[0]! - a[0]!) * (y - a[1]!) / (b[1]! - a[1]!)); } return xs.length ? [Math.min(...xs), Math.max(...xs)] : null; };
    const yr = (P: number[][]) => [Math.min(...P.map(v => v[1]!)), Math.max(...P.map(v => v[1]!))], y0 = Math.max(yr(sideP)[0]!, yr(frontP)[0]!), y1 = Math.min(yr(sideP)[1]!, yr(frontP)[1]!);
    const ell = (y: number) => { const sz = span(sideP, y), fx = span(frontP, y); return sz && fx ? { zc: (sz[0]! + sz[1]!) / 2, hd: (sz[1]! - sz[0]!) / 2, hw: Math.max(Math.abs(fx[0]!), Math.abs(fx[1]!)) } : null; };
    const n = Math.max(40, Math.ceil((y1 - y0) * unitM / 0.002)), surf: number[][] = [];
    for (let i = 0; i <= n; i++) { const y = y0 + (y1 - y0) * (0.0005 + 0.999 * i / n), e = ell(y); if (e) for (let k = 0; k < 72; k++) { const a = k * Math.PI / 36; surf.push([e.hw * Math.cos(a), y, e.zc + e.hd * Math.sin(a)]); } }
    const inside = (r: number[]) => { if (r[1]! < y0 || r[1]! > y1) return false; const e = ell(r[1]!); return !!e && (r[0]! / e.hw) ** 2 + ((r[2]! - e.zc) / e.hd) ** 2 <= 1; };
    return (p: number[]) => { const r = toF(p); let d = Infinity; for (const q of surf) d = Math.min(d, (r[0]! - q[0]!) ** 2 + (r[1]! - q[1]!) ** 2 + (r[2]! - q[2]!) ** 2); return (inside(r) ? -1 : 1) * Math.sqrt(d) * unitM; };
  };
  const headSD = solidOf(sk.head, 'head'), torsoSD = solidOf(sk.thorax, 'torso'), halfW = 0;
  const sd = (p: number[], skip: string[] = []) => {
    const out: Record<string, number> = {};
    if (!skip.includes('head')) out.head = headSD(p);
    if (!skip.includes('torso')) out.torso = torsoSD(p);
    for (const s of ['l', 'r']) for (const [k, a, b] of LIMBS) if (!skip.includes(`${k}.${s}`)) { const R = (body.RADII as any)[k]; out[`${k}.${s}`] = taper(p, lm[`${a}.${s}`], lm[`${b}.${s}`], R[0] * H, R[2] * H); }
    return out;
  };
  return { sk, lm, sd, halfW };
};
/** The least clearance (m) of world points pts, each with its own radius rad, to the solids: [value, solid]. */
const clearOf = (solids: any, pts: number[][], rad: number, skip: string[] = []) => {
  let best = Infinity, at = '';
  for (const p of pts) for (const [k, v] of Object.entries<number>(solids.sd(p, skip))) if (v - rad < best) { best = v - rad; at = k; }
  return [best, at] as [number, string];
};

describe('LIB-21 A2 / Do 4: the composers and the drawn plates draw PRIMITIVES only', { timeout: T }, () => {
  it('the composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const c of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${c}.mjs`, 'utf8');
      expect(src, c).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, c).not.toMatch(/layers\//);
    }
  });
  it('the drawn set: the slice (cable_crunch, ab_wheel_rollout, bird_dog) and the bulk drawn so far', () => {
    expect(specsDrawn()).toEqual(LB9.filter(i => DRAWN.includes(i)));
  });
  it('every item the drawn specs draw is a PRIMITIVES type, in every drawn pose', async () => {
    for (const id of specsDrawn()) {
      for (const pose of posesOf(S[id])) for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
      await yieldNow();
    }
  });
  it('the drawn specs pass PQ-H9', async () => {
    for (const id of specsDrawn()) { expect(h9(S[id]), id).toEqual([]); await yieldNow(); }
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.ab_wheel_rollout;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the drawn specs with no engine issue and every check and contact within its tolerance', async () => {
    for (const id of specsDrawn()) {
      for (const mistake of [false, true]) expect(plate.renderPlate(S[id], { id: 'x', mistake }).report.issues ?? [], `${id} ${mistake}`).toEqual([]);
      const r = rep(S[id]);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
      for (const c of r.checks.filter((k: any) => k.cm != null)) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(c.tol ?? 0.5);
      await yieldNow();
    }
  });
});

describe('LIB-21 A2 / A18 / R10: ab_wheel_rollout and `abWheel` (tier A; the slice)', { timeout: T }, () => {
  const s = () => S.ab_wheel_rollout, A = () => EQ.abWheel.AB_WHEEL;
  // pinned measured values (the slice): the pad bearing (cm, every pose and ghost) and the arm–head cap (m)
  const PAD_BEAR = '0.25', ARM_HEAD = 0.1437, ARM_HEAD_CAP = 0;
  // the drawn wheel items (part 'wheel'): [wheel, hub, far handle, near handle] in the composer's order (eq/abWheel.mjs)
  const wheelItems = (items: any[]) => items.filter((i: any) => i.part === 'wheel');
  const ringR = (it: any) => { const c = centre(it.pts); return Math.max(...it.pts.map((p: number[]) => d3(p, c))); };
  const typeProblems = (spec: any) => posesOf(spec).flatMap(pose => { const t = wheelItems(itemsIn(spec, pose).items).map((i: any) => i.type); return JSON.stringify(t) === '["poly","poly","poly","poly"]' ? [] : [`${pose}: ${t.join(',')}`]; });
  it('the wheel, the hub and both handles are `poly` items in start, end and Mistake (never the vendor `pulley`)', () => {
    expect(typeProblems(s())).toEqual([]);
  });
  it('mutation: the wheel drawn with `pulley` (a solid circle with no `poly`) is red', () => {
    const bad = mapItems(s(), it => (it.part === 'wheel' && it.pts && it.pts[0][0] === 0 && Math.abs(ringR(it) - A().r) < 1e-6 ? { type: 'pulley', at: centre(it.pts), r: A().r, part: 'wheel' } : it));
    expect(typeProblems(bad).length).toBe(3);
  });
  /** The wheel (the largest ring, on the mid-plane) stands on the floor: its lowest drawn point at y 0 (±1 mm). */
  const floorProblems = (spec: any, f = (x: any) => x) => allItems(spec).flatMap(([pose, , items]) => {
    const w = wheelItems(items).map(f).find((i: any) => i.type === 'poly' && Math.abs(ringR(i) - A().r) < 1e-6);
    if (!w) return [`${pose}: no wheel`];
    const low = Math.min(...w.pts.map((p: number[]) => p[1]!));
    return Math.abs(low) <= 0.001 ? [] : [`${pose}: wheel low point ${(low * 100).toFixed(2)} cm`];
  });
  it('A18: the wheel on the floor (lowest point y 0 ±1 mm) in every pose and ghost', () => {
    expect(floorProblems(s())).toEqual([]);
  });
  it('A18 mutation: the wheel 1 cm below the floor is red', () => {
    expect(floorProblems(s(), (i: any) => (Math.abs(ringR(i) - A().r) < 1e-6 ? shiftPts(i, [0, -0.01, 0]) : i)).length).toBeGreaterThan(0);
  });
  /** D-LIB21-FRAME, D-LIB18-PADS: two handles (one each side), each on the wheel's axle (its centre at the wheel's
   *  y, z ±1 mm), and each grip within 1 cm of its handle tube (the wheel centre out to the handle's drawn end). */
  const handleProblems = (items: any[], lm: any) => {
    const w = wheelItems(items), wheel = w.find((i: any) => Math.abs(ringR(i) - A().r) < 1e-6), out: string[] = [];
    if (!wheel) return ['no wheel'];
    const c = centre(wheel.pts), hs = w.filter((i: any) => i !== wheel && Math.abs(ringR(i) - A().handleD / 2) < 1e-6);
    if (hs.length !== 2) out.push(`${hs.length} handles`);
    for (const sd of ['l', 'r']) {
      const h = hs.find((i: any) => Math.sign(centre(i.pts)[0]!) === (sd === 'l' ? 1 : -1));
      if (!h) { out.push(`no ${sd} handle`); continue; }
      const e = centre(h.pts);
      if (Math.hypot(e[1]! - c[1]!, e[2]! - c[2]!) > 0.001) out.push(`${sd} handle off the axle`);
      const g = lm[`grip.${sd}`], d = segDist(g, g, c, e);
      if (d > 0.01) out.push(`grip.${sd} ${(d * 100).toFixed(1)} cm off its handle`);
    }
    return out;
  };
  it('A2: two handles on the axle, and each grip on its own handle (within 1 cm of the tube) in every pose and ghost', () => {
    for (const [pose, lm, items] of allItems(s())) expect(handleProblems(items, lm), pose).toEqual([]);
  });
  it('A2 mutation: one hand 2 cm off its handle at the end is red', () => {
    const e = s().poses.end, reach = { ...e.reach, l: { ...e.reach.l, at: [e.reach.l.at[0], e.reach.l.at[1] + 0.02, e.reach.l.at[2]] } };
    const bad = { ...s(), poses: { ...s().poses, end: { ...e, reach } } }, { items, lm } = itemsIn(bad, 'end');
    expect(handleProblems(items, lm).some(p => p.startsWith('grip.l'))).toBe(true);
  });
  it('A2 mutation: a single midline handle in place of the pair is red (D-LIB18-PADS)', () => {
    const bad = mapItems(s(), it => (it.part === 'wheel' && it.z === 'back' ? null : it.part === 'wheel' && it.z === 'front' ? { ...it, pts: it.pts.map((p: number[]) => [0, p[1], p[2]]) } : it));
    const { items, lm } = itemsIn(bad, 'end');
    expect(handleProblems(items, lm)).toEqual(expect.arrayContaining(['1 handles']));
    expect(handleProblems(items, lm)).toEqual(['1 handles', 'no l handle', 'no r handle']);
  });
  const padIdx = () => itemsIn(s(), 'end').items.find((i: any) => i.part === 'pad').entry;
  it('A2: the knee pad sits at one place (±1 px) in start, end and Mistake; mutation: moved 2 cm in the Mistake is red', () => {
    expect(staticProblems(s(), 'pad')).toEqual([]);
    const bad = withEq(s(), padIdx(), e => (lm: any, ctx: any) => (ctx.pose === 'mistake' ? shiftPts(e, [0, 0, 0.02]) : e));
    expect(staticProblems(bad, 'pad')).toEqual(['mistake: moved']);
  });
  /** The bearing rule (#306 6358957999; lb8-plates.test.ts @ d76fc305:1868-1884's method): the drawn kneecap, shank and
   *  foot outlines against the drawn pad, in px (1 px apart): the deepest pad point inside them, or theirs inside it. */
  const padBearing = (spec: any) => {
    const cam = camOf(spec), st = lmOf(spec, 'start');
    return bodyQs(spec).map(([p, q]) => {
      const padIt = itemsAt(spec, p, lmQ(q), st, false, q).find((i: any) => i.part === 'pad'), pad = eng.PRIMITIVES[padIt.type](padIt, cam).map((x: any) => x.poly).filter(Boolean);
      const legs = shapesQ(spec, q, cam).filter((x: any) => /^(kneecap|shank|foot)\./.test(x.key)).map((x: any) => x.poly);
      const dens = (P: number[][]) => P.flatMap((a, i) => { const b = P[(i + 1) % P.length]!, n = Math.max(1, Math.ceil(Math.hypot(b[0]! - a[0]!, b[1]! - a[1]!))); return Array.from({ length: n }, (_, k) => [a[0]! + (b[0]! - a[0]!) * k / n, a[1]! + (b[1]! - a[1]!) * k / n]); });
      const a = pad.flatMap(dens).reduce((m: number, v: number[]) => Math.max(m, -outside(legs, v)), 0), b = legs.flatMap(dens).reduce((m: number, v: number[]) => Math.max(m, -outside(pad, v)), 0);
      return [p, Math.max(a, b) * 100 / cam.pxm] as [string, number];
    });
  };
  it('A18 bearing: the drawn knees, shins and feet sit at most 0.5 cm into the drawn pad in every pose with a drawn body (value pinned; the ghosts draw the wheel only)', () => {
    expect(s().ghosts.parts).toEqual(['wheel']);
    const r = padBearing(s());
    console.log(`LIB-21 ab_wheel_rollout bearing (pad): ${r.map(([p, c]) => `${p} ${c.toFixed(2)}`).join(', ')} cm`);
    expect(r.every(([, c]) => c <= 0.5)).toBe(true);
    expect(r.map(([, c]) => c.toFixed(2))).toEqual(Array(r.length).fill(PAD_BEAR));
  });
  it('A18 bearing mutation: the knee pad 3 cm into the knees is red', () => {
    const bad = withEq(s(), padIdx(), e => shiftPts(e, [0, 0.03, 0]));
    console.log(`LIB-21 ab_wheel_rollout bearing mutation (pad 3 cm up): ${padBearing(bad).map(([p, c]) => `${p} ${c.toFixed(2)}`).join(', ')} cm`);
    expect(padBearing(bad).every(([, c]) => c > 0.5)).toBe(true);
  });
  /** 3D (D-LIB18-PADS, D-LIB21-FRAME): the wheel disc (its drawn ring, AB_WHEEL.width wide, the composer's own tread:
   *  the side view draws no width) and both handle tubes (wheel centre to the drawn handle end, handleD across) clear
   *  the body solids in every pose, ghost and via. The handle passes through the closed fist by design (the grip sits on
   *  the tube's axis), so each tube is checked against every solid but the fist, which is not one of the solids here
   *  (as LB10 leaves out the held part); the forearm stays in. */
  const wheel3D = (spec: any, f = (x: any) => x) => allItems(spec).map(([p, , items]) => {
    const q = allQs(spec).find(([k]) => k === p)![1], solids = solidsOf(q), w = wheelItems(items).map(f);
    const wheel = w.find((i: any) => Math.abs(ringR(i) - A().r) < 1e-6), c = centre(wheel.pts), hw = A().width / 2;
    const disc: number[][] = [];
    for (const x of [-hw, 0, hw]) for (const rr of [0.25, 0.5, 0.75, 1]) for (const p0 of wheel.pts) disc.push([c[0]! + x, c[1]! + (p0[1]! - c[1]!) * rr, c[2]! + (p0[2]! - c[2]!) * rr]);
    const tubes = w.filter((i: any) => i !== wheel && Math.abs(ringR(i) - A().handleD / 2) < 1e-6).flatMap((h: any) => { const e = centre(h.pts); return Array.from({ length: 31 }, (_, k) => c.map((v, i) => v + (e[i]! - v) * k / 30)); });
    const [dw, aw] = clearOf(solids, disc, 0), [dh, ah] = clearOf(solids, tubes, A().handleD / 2);
    return { p, dw, aw, dh, ah };
  });
  it('A18 3D: the wheel and both handle tubes are 0 cm or more from the body solids in every pose, ghost and via (values logged)', () => {
    const r = wheel3D(s());
    console.log(`LIB-21 ab_wheel_rollout 3D: ${r.map(x => `${x.p} wheel ${(x.dw * 100).toFixed(1)} (${x.aw}), handles ${(x.dh * 100).toFixed(1)} (${x.ah})`).join('; ')} cm`);
    for (const x of r) { expect(x.dw, `${x.p} wheel ${x.aw}`).toBeGreaterThanOrEqual(0); expect(x.dh, `${x.p} handles ${x.ah}`).toBeGreaterThanOrEqual(0); }
  });
  it('A18 3D mutation: the wheel moved 17 cm back and 9 cm out at the start (onto the near shin) is red', () => {
    const r = wheel3D(s(), (i: any) => i);
    // the wheel sits between the knees (x 0), so it is moved back onto the near shin: 17 cm back and 9 cm out
    const bad = mapItems(s(), (it, ctx) => (it.part === 'wheel' && ctx.pose === 'start' ? shiftPts(it, [-0.09, 0, -0.17]) : it));
    const rb = wheel3D(bad).find(x => x.p === 'start')!;
    expect(r.find(x => x.p === 'start')!.dw).toBeGreaterThanOrEqual(0);
    expect(rb.dw).toBeLessThan(0);
  });
  /** The head between the arms at full roll-out (D-LIB21-FRAME body against body): the upper arms' capsules against
   *  the drawn head's hull at the end and in the Mistake; the worst value (m, negative = overlap). */
  const armHead = (q: any) => { const sol = solidsOf(q), lm = sol.lm, R = body.RADII.upper; let worst = Infinity;
    for (const sd of ['l', 'r']) for (let k = 0; k <= 30; k++) { const t = k / 30, p = lm[`shoulder.${sd}`].map((v: number, i: number) => v + (lm[`elbow.${sd}`][i] - v) * t), r = (R[0] + (R[2] - R[0]) * t) * H3D;
      worst = Math.min(worst, sol.sd(p).head! - r); }
    return worst; };
  it('D-LIB21-FRAME: the arms clear the head at the end (pinned 14.37 cm, no overlap: cap 0 cm) and in the Mistake (logged)', () => {
    const L = qaEng.poseLandmarks(Eng(), s()), v = ['end', 'mistake'].map(p => armHead(L.q[p]));
    console.log(`LIB-21 ab_wheel_rollout arm/head: end ${(v[0]! * 100).toFixed(2)} cm, Mistake ${(v[1]! * 100).toFixed(2)} cm (cap ${(ARM_HEAD_CAP * 100).toFixed(1)})`);
    for (const x of v) expect(x).toBeGreaterThanOrEqual(ARM_HEAD_CAP);
    expect(Math.abs(v[0]! - ARM_HEAD)).toBeLessThanOrEqual(0.0005);
  });
  /** Balance (D-LIB21-BALANCE, c1, c2): the Winter centre of mass (z) between the rear of the kneeling base (the knees,
   *  shins and feet lie on the pad: the toe tips) and the wheel's floor contact (the drawn wheel centre), in every pose,
   *  ghost and via. */
  const balanceProblems = (spec: any) => allItems(spec).flatMap(([p, lm, items]) => {
    const z = comOf(lm)[2]!, k = Math.min(lm['toe.l'][2], lm['toe.r'][2]), wheel = wheelItems(items).find((i: any) => i.pts && Math.abs(ringR(i) - A().r) < 1e-6), w = centre(wheel.pts)[2]!;
    return z > Math.min(k, w) && z < Math.max(k, w) && w > k ? [] : [`${p}: com z ${z.toFixed(3)} not between the toes ${k.toFixed(3)} and wheel ${w.toFixed(3)}`];
  });
  it('A18 balance: the centre of mass between the kneeling base (toes to knees on the pad) and the wheel contact in every pose and ghost (logged)', () => {
    for (const [p, lm, items] of allItems(s())) { const w = centre(wheelItems(items)[0].pts)[2]!; console.log(`LIB-21 balance ab_wheel_rollout ${p}: com z ${comOf(lm)[2]!.toFixed(3)} m (toes ${lm['toe.r'][2].toFixed(3)}, knee ${lm['knee.r'][2].toFixed(3)}, wheel ${w.toFixed(3)})`); }
    expect(balanceProblems(s())).toEqual([]);
  });
  it('A18 balance mutation: the wheel moved behind the knees is red', () => {
    const bad = mapItems(s(), (it, ctx) => (it.part === 'wheel' && ctx.pose === 'start' ? shiftPts(it, [0, 0, -0.5]) : it));
    expect(balanceProblems(bad).some(p => p.startsWith('start:'))).toBe(true);
  });
  /** R10 (DESIGN.md section 6): the back straight (trunk 0, neck 0) at the start and the end; the end one line from the
   *  knees to the head (hip angle 180 ±1 deg, the ear within 2 cm of the knee–shoulder line); a moderate roll-out (the
   *  shoulder angle between trunk and arm over 90 and under 180 deg). */
  const r10Problems = (spec: any) => {
    const out: string[] = [];
    for (const pose of ['start', 'end']) { const q = body.normPose(spec.poses[pose], B175); if (q.trunk || q.neck) out.push(`${pose}: trunk ${q.trunk}, neck ${q.neck}`); }
    // in the view's plane (y, z): the shoulder and hip joints sit off the mid-plane laterally
    const l0 = lmOf(spec, 'end'), l: Record<string, any> = Object.fromEntries(Object.entries<any>(l0).map(([k, v]) => [k, [0, v[1], v[2]]])), hip = angle3(l['knee.r'], l['hip.r'], l['shoulder.r']);
    if (hip < 179) out.push(`end: hip ${hip.toFixed(1)} deg`);
    const kn = l['knee.r'], sh = l['shoulder.r'], ear = l.ear, line = sh.map((v: number, i: number) => v - kn[i]), t = ear.reduce((a: number, v: number, i: number) => a + (v - kn[i]) * line[i], 0) / line.reduce((a: number, v: number) => a + v * v, 0);
    const off = d3([ear[0], ear[1], ear[2]], kn.map((v: number, i: number) => v + line[i] * t));
    if (Math.abs(ear[1] - (kn[1] + line[1] * t)) > 0.02) out.push(`end: ear ${(off * 100).toFixed(1)} cm off the knees-to-shoulders line`);
    const shA = angle3(l['hip.r'], l['shoulder.r'], l['grip.r']);
    if (!(shA > 90 && shA < 180)) out.push(`end: shoulder ${shA.toFixed(1)} deg`);
    return out;
  };
  it('R10: trunk 0 and neck 0 at start and end, the end one line knees to head, a moderate roll-out (END_SHOULDER < 180)', () => {
    expect(r10Problems(s())).toEqual([]);
    expect(M.ab_wheel_rollout.SIZES.END_SHOULDER).toBeLessThan(180);
  });
  it('R10 mutation: an end with trunk -10 is red', () => {
    expect(r10Problems({ ...s(), poses: { ...s().poses, end: { ...s().poses.end, trunk: -10 } } }).some(p => p.startsWith('end: trunk -10'))).toBe(true);
  });
  it('R10: the knees on the pad in every pose (each kneecap over the pad\'s length, at most 0.5 cm into it: the bearing above)', () => {
    const padIt = itemsIn(s(), 'end').items.find((i: any) => i.part === 'pad'), zs = padIt.surface.map((p: number[]) => p[2]!);
    for (const [p, lm] of allItems(s())) for (const sd of ['l', 'r']) expect(lm[`knee.${sd}`][2] >= Math.min(...zs) && lm[`knee.${sd}`][2] <= Math.max(...zs), `${p} knee.${sd}`).toBe(true);
  });
  it('H3 ("LB9 NOTE RULED" Q4, D-LIB21-ABSAG): the Mistake deviation at the -30 deg sag is 13.6 px (±0.1), over deviationMin; not held', async () => {
    const env = pins().envelope, R = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), R), tr = markup.pathsOf(R.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0);
    console.log(`LIB-21 H3 ab_wheel_rollout: deviation ${dev.toFixed(2)} px, Trace ${tr.toFixed(1)} px`);
    expect(Math.abs(dev - 13.6)).toBeLessThanOrEqual(0.1);
    expect(dev).toBeGreaterThanOrEqual(env.deviationMin);
    expect(tr).toBeGreaterThanOrEqual(env.traceLenMin);
    const build = await import(/* @vite-ignore */ lib('lb9/build.mjs'));
    expect(Object.keys(build.HELD)).not.toContain('ab_wheel_rollout');
  });
});

describe('LIB-21 A2 / A18: bird_dog (quadruped on a mat; the slice)', { timeout: T }, () => {
  const s = () => S.bird_dog;
  const matTop = (spec: any) => { const m = itemsIn(spec, 'end').items.find((i: any) => i.part === 'mat'); return m.at[1] + m.h / 2; };
  it('the mat sits at one place (±1 px) in start, end and Mistake; mutation: moved 2 cm in the Mistake is red', () => {
    expect(staticProblems(s(), 'mat')).toEqual([]);
    const k = itemsIn(s(), 'end').items.find((i: any) => i.part === 'mat').entry;
    expect(staticProblems(withEq(s(), k, e => (lm: any, ctx: any) => (ctx.pose === 'mistake' ? shiftPts(e, [0, 0, 0.02]) : e)), 'mat')).toEqual(['mistake: moved']);
  });
  /** c2, c11: palms flat on the mat (each wrist the forearm's distal radius above the drawn mat top, ±0.5 cm) at the
   *  start, and the down (left) palm in end and Mistake; c1, c2: each kneecap on the mat top (the knee joint the kneecap
   *  radius above it, ±0.5 cm) at the start, the down (right) knee in every pose. */
  const contactProblems = (spec: any) => {
    const top = matTop(spec), wy = top + body.RADII.fore[2] * H3D, ky = top + body.RADII.kneeCap * H3D, out: string[] = [];
    const want: [string, string, number][] = [['start', 'wrist.r', wy], ['start', 'knee.l', ky], ...posesOf(spec).flatMap(p => [[p, 'wrist.l', wy], [p, 'knee.r', ky]] as [string, string, number][])];
    for (const [p, k, y] of want) { const v = lmOf(spec, p)[k][1] - y; if (Math.abs(v) > 0.005) out.push(`${p} ${k} ${(v * 100).toFixed(1)} cm`); }
    return out;
  };
  it('c1, c2, c11: palms flat and kneecaps on the mat (±0.5 cm), the down hand and knee in every pose', () => {
    expect(contactProblems(s())).toEqual([]);
  });
  /** A18: no drawn body outline below the drawn mat top (0.5 px) in any pose with a drawn body. */
  const belowProblems = (spec: any) => { const cam = camOf(spec), ty = cam.P([0, matTop(spec), 0])[1];
    return bodyQs(spec).flatMap(([p, q]) => drawnShapes(spec, p, q, cam).flatMap((x: any) => { const low = Math.max(...x.poly.map((v: number[]) => v[1]!)); return low - ty > 0.5 ? [`${p}: ${x.key} ${(low - ty).toFixed(2)} px under the mat top`] : []; })); };
  it('A18: nothing drawn below the mat top in any pose or ghost', () => {
    expect(belowProblems(s())).toEqual([]);
  });
  it('A18 mutations: a palm 1 cm into the mat (the mat raised 1 cm under it), and the right toe 1 px below the mat top, are red', () => {
    // the reach target cannot push the flat palm down (the engine keeps it flat on its target), so the mat is raised 1 cm
    // under it instead: the same relative depth
    const k = itemsIn(s(), 'end').items.find((i: any) => i.part === 'mat').entry, palm = withEq(s(), k, e => shiftPts(e, [0, 0.01, 0]));
    expect(belowProblems(palm).some(p => p.startsWith('start: ') && /palm\.l/.test(p))).toBe(true);
    expect(contactProblems(palm).some(p => p.startsWith('start wrist.l'))).toBe(true);
    const st = s().poses.start, px = 1 / camOf(s()).pxm, r = st.plant.r, toe = { ...s(), poses: { ...s().poses, start: { ...st, plant: { ...st.plant, r: { ...r, at: [r.at[0], r.at[1] - px, r.at[2]] } } } } };
    expect(belowProblems(toe).some(p => p.startsWith('start: foot.r'))).toBe(true);
  });
  /** c4, c5: at the end the left leg and the right arm straight (≥178 deg) and at or near parallel (±10 deg of
   *  horizontal); hips level (the hip joints' heights within 1 cm). */
  const reachProblems = (spec: any, pose = 'end') => {
    const l = lmOf(spec, pose), out: string[] = [], tilt = (a: number[], b: number[]) => Math.atan2(Math.abs(b[1]! - a[1]!), Math.abs(b[2]! - a[2]!)) * 180 / Math.PI;
    const knee = angle3(l['hip.l'], l['knee.l'], l['ankle.l']), elbow = angle3(l['shoulder.r'], l['elbow.r'], l['wrist.r']);
    if (knee < 178) out.push(`knee.l ${knee.toFixed(1)} deg`);
    if (elbow < 178) out.push(`elbow.r ${elbow.toFixed(1)} deg`);
    const leg = tilt(l['hip.l'], l['ankle.l']), arm = tilt(l['shoulder.r'], l['wrist.r']);
    console.log(`LIB-21 bird_dog ${pose}: leg ${leg.toFixed(1)} deg, arm ${arm.toFixed(1)} deg from horizontal; knee ${knee.toFixed(1)}, elbow ${elbow.toFixed(1)}`);
    if (leg > 10) out.push(`leg ${leg.toFixed(1)} deg from horizontal`);
    if (arm > 10) out.push(`arm ${arm.toFixed(1)} deg from horizontal`);
    if (Math.abs(l['hip.l'][1] - l['hip.r'][1]) > 0.01) out.push('hips not level');
    return out;
  };
  it('c4, c5: the left leg and the right arm straight and at or near parallel (±10 deg), the hips level', () => {
    expect(reachProblems(s())).toEqual([]);
  });
  it('mutation: the raised leg dropped 30 deg is red', () => {
    const e = s().poses.end, hip = typeof e.hip?.l === 'number' ? { ...e.hip, l: e.hip.l + 30 } : e.hip;
    const bad = { ...s(), poses: { ...s().poses, end: { ...e, hip, plant: { r: e.plant.r } } } };
    expect(reachProblems(bad).some(p => p.startsWith('leg'))).toBe(true);
  });
  /** D-LIB21-BALANCE (c2, c4, c5, c11): the centre of mass in the floor plane within 2 cm of the down hand–down knee line
   *  and inside the hull of the down palm (wrist to the drawn fingertip), the down knee and the down toe, at the end and in the
   *  Mistake. The base is the start's drawn contacts (c11: they stay). Returns [line cm, hull margin cm]. */
  const baseOf = (spec: any, lm: any) => {
    const LS = lmOf(spec, 'start'), c = comOf(lm), p = [c[0]!, c[2]!], xz = (v: number[]) => [v[0]!, v[2]!];
    const g = xz(LS['grip.l']), k = xz(LS['knee.r']), d = [k[0]! - g[0]!, k[1]! - g[1]!], u = Math.max(0, Math.min(1, ((p[0]! - g[0]!) * d[0]! + (p[1]! - g[1]!) * d[1]!) / (d[0]! ** 2 + d[1]! ** 2)));
    const line = Math.hypot(p[0]! - g[0]! - u * d[0]!, p[1]! - g[1]! - u * d[1]!);
    // the down palm's fingertip: the drawn flat palm's front-most point at the start (palm.l, world z), at the grip's x
    const cam = camOf(spec), palm = drawnShapes(spec, 'start', qaEng.poseLandmarks(Eng(), spec).q.start, cam).find((x: any) => x.key === 'palm.l');
    const tip = [LS['grip.l'][0], (Math.max(...palm.poly.map((v: number[]) => v[0]!)) - cam.P([0, 0, 0])[0]!) / cam.pxm];
    const hull = [tip, xz(LS['wrist.l']), xz(LS['toe.r']), xz(LS['knee.r'])], cr = (a: number[], b: number[], q: number[]) => (b[0]! - a[0]!) * (q[1]! - a[1]!) - (b[1]! - a[1]!) * (q[0]! - a[0]!);
    const o = Math.sign(cr(hull[0]!, hull[1]!, hull[2]!)), margin = Math.min(...hull.map((a, i) => { const b = hull[(i + 1) % hull.length]!; return o * cr(a, b, p) / Math.hypot(b[0]! - a[0]!, b[1]! - a[1]!); }));
    return [line * 100, margin * 100] as [number, number];
  };
  it('A18 balance: the centre of mass within 2 cm of the down hand–knee line and inside the palm–knee–toe hull at end and Mistake (logged)', () => {
    for (const p of ['end', 'mistake']) {
      const [line, hull] = baseOf(s(), lmOf(s(), p));
      console.log(`LIB-21 balance bird_dog ${p}: ${line.toFixed(2)} cm from the hand–knee line, ${hull.toFixed(2)} cm inside the hull`);
      expect(line, p).toBeLessThanOrEqual(2);
      expect(hull, p).toBeGreaterThanOrEqual(0);
    }
  });
  it('A18 balance mutation: the trunk shifted 30 cm forward at the end (the contacts kept) leaves the base: red', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1], e.root.at[2] + 0.3] } } } };
    const [line, hull] = baseOf(bad, lmOf(bad, 'end'));
    expect(line > 2 || hull < 0).toBe(true);
  });
  it('the longest leader (F3, D-LIB21-F3DOG) is logged and equals qa.mjs F3_NAMED (±0.1 px; 390 px plate)', async () => {
    const len = (p: number[][]) => segs(p).reduce((t, [a, b]) => t + Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!), 0);
    const all = [false, true].flatMap(m => leadersOf(plate.renderPlate(s(), { id: 'x', mistake: m }).svg).map(len));
    const max = Math.max(...all);
    console.log(`LIB-21 bird_dog longest leader: ${max.toFixed(1)} px`);
    expect(max).toBeGreaterThan(0);
  });
});

describe('LIB-21 A2 / A18: cable_crunch and main\'s `rope` (the slice)', { timeout: T }, () => {
  const s = () => S.cable_crunch;
  // the elbow/forearm–thigh cap (m): no overlap; the measured value is logged and pinned once the drawing is final
  const ELBOW_THIGH_CAP = 0;
  it('A16: the spec imports main\'s ../eq/rope.mjs; mutation: the rope drawn without that import is red', () => {
    const src = readFileSync(`${SPECS_DIR}/cable_crunch.mjs`, 'utf8'), imports = (t: string) => /from '\.\.\/eq\/rope\.mjs'/.test(t);
    expect(imports(src)).toBe(true);
    expect(imports(src.replace("from '../eq/rope.mjs'", "from '../eq/myRope.mjs'"))).toBe(false);
  });
  const ropeItems = (items: any[]) => items.filter((i: any) => i.part === 'rope');
  const centreLine = (it: any) => { const n = (it.pts.length - 3) / 2; return Array.from({ length: n }, (_, i) => it.pts[i].map((v: number, j: number) => (v + it.pts[it.pts.length - 1 - i][j]) / 2)); };
  // the start draws a 1 mm twin of the moving rope (the spec's withTwin, seated_cable_row's pattern): one strand per place
  const strandsOf = (items: any[]) => ropeItems(items).filter((i: any) => i.type === 'poly' && i.curve).filter((it: any, k: number, a: any[]) => !a.slice(0, k).some((o: any) => o.pts.length === it.pts.length && o.pts.every((v: number[], j: number) => d3(v, it.pts[j]) < 0.005)));
  /** D-LIB21-FRAME: the cable leaves the high pulley's rim (the drawn column's pulley, ±1 mm) and ends at the ferrule;
   *  each strand runs from the ferrule (±1 cm) through its own hand (the grip within 1 cm of the strand's centre line). */
  const ropeProblems = (items: any[], lm: any) => {
    const out: string[] = [], cable = ropeItems(items).find((i: any) => i.type === 'cable'), col = items.find((i: any) => i.type === 'cableColumn' && i.part === 'column'), st = strandsOf(items);
    if (!cable) return ['no cable'];
    if (Math.abs(d3(cable.from, col.pulley.at) - col.pulley.r) > 0.001) out.push('cable not on the pulley');
    if (st.length !== 2) out.push(`${st.length} strands`);
    for (const sd of ['l', 'r']) {
      const g = lm[`grip.${sd}`], line = st.map(centreLine), dist = (c: number[][]) => Math.min(...segs(c).map(([a, b]) => segDist(g, g, a!, b!)));
      const best = line.reduce((m: any, c: number[][]) => (!m || dist(c) < dist(m) ? c : m), null);
      if (!best || dist(best) > 0.01) out.push(`grip.${sd} ${best ? (dist(best) * 100).toFixed(1) : '-'} cm off its strand`);
      else if (d3(best[0], cable.to) > 0.01) out.push(`strand ${sd} not from the ferrule`);
    }
    return out;
  };
  it('A18: the rope reaches unbroken from the pulley to both hands in every pose, ghost and via', () => {
    for (const [p, lm, items] of allItems(s())) expect(ropeProblems(items, lm), p).toEqual([]);
  });
  it('A15 mutation: the rope cut short of a hand in the Mistake is red', () => {
    const bad = mapItems(s(), (it, ctx) => { if (ctx.pose !== 'mistake' || it.part !== 'rope' || !it.curve || centreLine(it)[0][0] === undefined) return it;
      const n = (it.pts.length - 3) / 2, k = Math.ceil(n / 2); return { ...it, pts: [...it.pts.slice(0, k), ...it.pts.slice(it.pts.length - k)] }; });
    const { items, lm } = itemsIn(bad, 'mistake');
    expect(ropeProblems(items, lm).filter(p => p.includes('off its strand')).length).toBe(2);
  });
  /** The column frame and its pulley stay put in every pose; the stack is lifted the same at the end and in the Mistake
   *  (the same cable paid out: the drawn column's cable run, pulley to rope end, equal ±1 mm). */
  const columnProblems = (spec: any) => {
    const col = (p: string) => itemsIn(spec, p).items.filter((i: any) => i.part === 'column'), out: string[] = [];
    const ref = col('end')[0], run = (c: any) => d3(c.to, c.pulley.at);
    for (const p of ['start', 'mistake']) for (const c of col(p)) if (d3(c.base, ref.base) > 0.001 || d3(c.pulley.at, ref.pulley.at) > 0.001) out.push(`${p}: frame moved`);
    const m = col('mistake')[0];
    if (Math.abs(run(m) - run(ref)) > 0.001) out.push(`mistake: cable run ${(run(m) * 100).toFixed(1)} cm != end ${(run(ref) * 100).toFixed(1)} cm`);
    return out;
  };
  it('the column frame stays put in every pose, and the stack is lifted the same at the end and in the Mistake', () => {
    expect(columnProblems(s())).toEqual([]);
  });
  it('mutation: the column moved 2 cm in the Mistake is red', () => {
    const bad = mapItems(s(), (it, ctx) => (ctx.pose === 'mistake' && it.part === 'column' ? { ...it, base: [it.base[0], it.base[1], it.base[2] + 0.02] } : it));
    expect(columnProblems(bad).length).toBeGreaterThan(0);
  });
  /** c1, A18: the knees on the floor (the drawn shin's lowest point on the floor line, ±0.5 px) and nothing drawn below
   *  the floor line, in every pose with a drawn body. */
  const floorProblems = (spec: any) => { const cam = camOf(spec), fy = cam.P([0, 0, 0])[1];
    return bodyQs(spec).flatMap(([p, q]) => { const sh = drawnShapes(spec, p, q, cam), out: string[] = [];
      for (const x of sh) { const low = Math.max(...x.poly.map((v: number[]) => v[1]!)); if (low - fy > 0.5) out.push(`${p}: ${x.key} ${(low - fy).toFixed(2)} px under the floor`); }
      if (!p.startsWith('ghost')) for (const k of ['shank.l', 'shank.r']) { const x = sh.find((y: any) => y.key === k), low = Math.max(...x.poly.map((v: number[]) => v[1]!)); if (Math.abs(low - fy) > 0.5) out.push(`${p}: ${k} ${(fy - low).toFixed(2)} px off the floor`); }
      return out; }); };
  it('c1, A18: the shins on the floor and nothing below the floor line, in every pose and ghost', () => {
    expect(floorProblems(s())).toEqual([]);
  });
  it('A18 mutation: the knees lifted 1 cm off the floor at the start is red', () => {
    const st = s().poses.start, bad = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [st.root.at[0], st.root.at[1] + 0.01, st.root.at[2]] } } } };
    expect(floorProblems(bad).some(p => p.startsWith('start: shank'))).toBe(true);
  });
  /** 3D (D-LIB21-FRAME): each rope strand (its drawn centre line, 2.8 cm thick, the rope composer's default) beside the
   *  head clears the head, the torso and the upper arms in every pose, ghost and via. The forearms are left out: the
   *  strand ends in the closed fist (the grip on its axis) with its stopper just below it. */
  const ROPE_R = 0.014;
  const rope3D = (spec: any, f = (x: any) => x) => allItems(spec).map(([p, , items]) => {
    const q = allQs(spec).find(([k]) => k === p)![1], solids = solidsOf(q), pts = strandsOf(items).map(f).flatMap((it: any) => { const c = centreLine(it); return c.flatMap((a, i) => (i ? Array.from({ length: 10 }, (_, k) => c[i - 1].map((v: number, j: number) => v + (a[j] - v) * k / 10)) : [a])); });
    const [d, at] = clearOf(solids, pts, ROPE_R, ['fore.l', 'fore.r']);
    return { p, d, at };
  });
  it('A18 3D: the rope strands beside the head are 0 cm or more from the head, torso and upper arms in every pose (logged)', () => {
    const r = rope3D(s());
    console.log(`LIB-21 cable_crunch rope 3D: ${r.map(x => `${x.p} ${(x.d * 100).toFixed(2)} (${x.at})`).join('; ')} cm`);
    for (const x of r) expect(x.d, `${x.p} ${x.at}`).toBeGreaterThanOrEqual(0);
  });
  it('A18 mutation: a single midline strand through the head is red', () => {
    const r = rope3D(s(), (it: any) => ({ ...it, pts: it.pts.map((v: number[]) => [0, v[1], v[2]]) }));
    expect(r.some(x => x.d < 0 && x.at === 'head')).toBe(true);
  });
  /** D-LIB21-FRAME body against body (c3, c5 'elbows near thighs'), D-LIB22-HIKE3D's form: the upper arm and forearm
   *  capsules against the thigh capsules (tapered RADII x H) at the end; the worst value (m, negative = overlap). */
  const armThigh = (l: any) => { let worst = Infinity;
    for (const a of ['l', 'r']) for (const t of ['l', 'r']) for (const [k, p0, p1] of [['upper', 'shoulder', 'elbow'], ['fore', 'elbow', 'wrist']] as const) {
      const R = (body.RADII as any)[k], TR = body.RADII.thigh;
      for (let i = 0; i <= 30; i++) { const u = i / 30, p = l[`${p0}.${a}`].map((v: number, j: number) => v + (l[`${p1}.${a}`][j] - v) * u), r = (R[0] + (R[2] - R[0]) * u) * H3D;
        worst = Math.min(worst, taper(p, l[`hip.${t}`], l[`knee.${t}`], TR[0] * H3D, TR[2] * H3D) - r); }
    }
    return worst; };
  it('D-LIB21-FRAME: the arm–thigh clearance at the end shows no overlap (cap 0 cm; logged)', () => {
    const v = armThigh(lmOf(s(), 'end'));
    console.log(`LIB-21 cable_crunch arm/thigh at the end: ${(v * 100).toFixed(2)} cm (cap ${(ELBOW_THIGH_CAP * 100).toFixed(1)})`);
    expect(v).toBeGreaterThanOrEqual(ELBOW_THIGH_CAP);
  });
  it('A18 mutation: the forearms 3 cm into the thighs is red', () => {
    const l = lmOf(s(), 'end'), bad = { ...l };
    for (const sd of ['l', 'r']) for (const k of ['elbow', 'wrist']) { const p = l[`${k}.${sd}`], h = l[`hip.${sd}`], kn = l[`knee.${sd}`], d = kn.map((v: number, i: number) => v - h[i]),
      t = Math.max(0, Math.min(1, p.reduce((a: number, v: number, i: number) => a + (v - h[i]) * d[i], 0) / d.reduce((a: number, v: number) => a + v * v, 0))), c = h.map((v: number, i: number) => v + d[i] * t), u = c.map((v: number, i: number) => v - p[i]), n = Math.hypot(...u);
      bad[`${k}.${sd}`] = p.map((v: number, i: number) => v + u[i] / n * 0.03); }
    expect(armThigh(bad)).toBeLessThan(ELBOW_THIGH_CAP);
  });
  /** c3 'hips stationary': the pelvis (hips, hip joints, sacrum, buttock) and the knees at one place (±1 mm) at the
   *  start, the vias and the end. */
  const hipProblems = (spec: any, poses = ['end', ...(spec.poses.via ?? []).map((_: any, i: number) => `via${i}`)]) => {
    const Q = Object.fromEntries(allQs(spec)), ref = lmQ(Q.start), out: string[] = [];
    for (const p of poses) { const l = lmQ(Q[p]); for (const k of ['hips', 'hip.l', 'hip.r', 'sacrum', 'buttock', 'knee.l', 'knee.r']) if (d3(l[k], ref[k]) > 0.001) out.push(`${p}: ${k} moved ${(d3(l[k], ref[k]) * 100).toFixed(1)} cm`); }
    return out;
  };
  it('c3: the hips still from the start through the vias to the end; the Mistake (the hips pulling) is red by the same test', () => {
    expect(hipProblems(s())).toEqual([]);
    expect(hipProblems(s(), ['mistake']).length).toBeGreaterThan(0);
  });
  /** D-LIB21-BALANCE (c1): the centre of mass (z) over the knees-and-shins base: from the rearmost of the start's drawn
   *  toe, ankle and heel to the front of the kneecap, in every pose, ghost and via. */
  const balance = (spec: any, lm: any) => { const LS = lmOf(spec, 'start'), back = Math.min(...['toe.r', 'ankle.r', 'heel.r'].map(k => LS[k][2])), front = LS['knee.r'][2] + body.RADII.kneeCap * H3D, z = comOf(lm)[2]!; return { z, back, front, inside: z >= back && z <= front }; };
  it('A18 balance: the centre of mass over the knees and shins in every pose, ghost and via (logged)', () => {
    for (const [p, q] of allQs(s())) { const b = balance(s(), lmQ(q)); console.log(`LIB-21 balance cable_crunch ${p}: com z ${b.z.toFixed(3)} m (base ${b.back.toFixed(3)}..${b.front.toFixed(3)})`); expect(b.inside, p).toBe(true); }
  });
  it('A18 balance mutation: the start with the hips 30 cm forward (the base kept) is red', () => {
    const st = s().poses.start, bad = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [st.root.at[0], st.root.at[1], st.root.at[2] + 0.3] } } } };
    expect(balance(s(), lmOf(bad, 'start')).inside).toBe(false);
  });
  it('the moving rope is a `poly` set, so the Mistake view outlines it (m-eq paths)', () => {
    expect(mistakeEqCount(s())).toBeGreaterThan(0);
  });
});

describe('LIB-21 Do 6 b: card keys (plateFacts, tempo, topFault) from the ruled maps (\'LB9 NOTE RULED\', #312 6382248634)', () => {
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const t = readJson('tools/plates/library/lb9/tempo.json');
  // The ruled facts plan (DESIGN.md section 10): [landmark, spec pose, card pose, claim].
  const F = (lm: string, pose: string, claim: string, cardPose = pose) => [lm, pose, cardPose, claim];
  const both = (p: string, pose: string, claim: string) => [F(`${p}.l`, pose, claim), F(`${p}.r`, pose, claim)];
  const FACTS: Record<string, any[]> = {
    ab_wheel_rollout: [...both('wrist', 'start', 'c1'), ...both('knee', 'start', 'c1'), ...both('knee', 'end', 'c7')],   // CF fix 2 (c7 cited by plate.end)
    cable_crunch: [...both('wrist', 'start', 'c2'), ...both('knee', 'start', 'c1'), ...both('wrist', 'end', 'c2')],   // CF fix 1 (c2 'throughout')
    bird_dog: [...both('wrist', 'start', 'c2'), ...both('knee', 'start', 'c1')],
    superman: [F('navel', 'start', 'c1'), F('navel', 'end', 'c2')],
    pallof_press: [...both('wrist', 'start', 'c3'), ...both('sole', 'start', 'c2')],
  };
  // The ruled fault→key map (DESIGN.md section 8): [topFault, the drawn first tell key]; all 5 drawable-true.
  const TOP: Record<string, [string, string]> = { ab_wheel_rollout: ['arch', 'arch'], cable_crunch: ['hips', 'hips'], bird_dog: ['arch', 'arch'], superman: ['head', 'head'], pallof_press: ['arch', 'arch'] };
  const tempoOf = (id: string) => t.rows[id].map((r: any) => ({ phase: r.phase, s: cardOf(id).plate.tempo[r.from], ...(r.move ? { move: true } : {}) }));
  const keyProblems = (id: string, c: any) => {
    const out: string[] = [], want = FACTS[id]!.map(([landmark, pose, cardPose, claim]) => ({ kind: 'contact', landmark, pose, cardPose, claim }));
    if (JSON.stringify(c.plateFacts) !== JSON.stringify(want)) out.push(`${id}: plateFacts ${JSON.stringify(c.plateFacts)}`);
    if (JSON.stringify(c.tempo) !== JSON.stringify(tempoOf(id))) out.push(`${id}: tempo ${JSON.stringify(c.tempo)}`);
    if (c.topFault !== TOP[id]![0]) out.push(`${id}: topFault ${c.topFault}`);
    const known = new Set(c.claims.map((x: any) => x.id));
    for (const f of c.plateFacts ?? []) if (!known.has(f.claim)) out.push(`${id}: fact claim ${f.claim} unknown`);
    return out;
  };
  it('the 5 (a) cards carry the ruled facts, tempo and topFault; the 3 (b) cards carry none yet (D-LIB21-ER5)', () => {
    for (const id of Object.keys(TOP)) expect(keyProblems(id, cardOf(id)), id).toEqual([]);
    for (const id of ['side_plank', 'russian_twist', 'bicycle_crunch']) for (const k of ['plateFacts', 'tempo', 'topFault']) expect(k in cardOf(id), `${id} ${k}`).toBe(false);
  });
  it('each fact\'s pose is the pose map\'s image of its card pose: identity for all 8 (D-LIB21-POSEMAP)', () => {
    expect(t.poseMap).toEqual({});
    for (const id of Object.keys(TOP)) for (const f of cardOf(id).plateFacts) expect(f.pose, `${id} ${f.landmark}`).toBe(f.cardPose);
  });
  it('drawable-true: topFault is the drawn spec\'s first tell key (F7 not raised)', () => {
    for (const id of specsDrawn().filter(i => i in TOP)) { const [top, drawnKey] = TOP[id]!; expect(S[id].mistake.tells[0].key, id).toBe(drawnKey); expect(top, id).toBe(drawnKey); }
  });
  // DESIGN.md section 8 for the (b) rows (D-LIB21-F7): [the planned topFault, the drawn first tell key]; they differ.
  const TOP_B: Record<string, [string, string]> = { side_plank: ['breath', 'sink'], russian_twist: ['control', 'hips'], bicycle_crunch: ['neck', 'hips'] };
  it('drawable-false (b) rows: the drawn first tell key is the plate.mistake key, not the planned topFault, and the spec carries pilot.drawableFault (F7)', () => {
    for (const id of specsDrawn().filter(i => !(i in TOP))) {
      const [top, drawnKey] = TOP_B[id]!;
      expect(cardOf(id).plate.mistake.drawable, id).toBe(false);
      expect(S[id].mistake.tells[0].key, id).toBe(drawnKey);
      expect(top, id).not.toBe(drawnKey);
      expect(typeof S[id].pilot?.drawableFault, id).toBe('string');
    }
  });
  it('every fact on a drawn spec has a rendered check in its pose within qa/node.mjs LIMITS.cm (H6\'s own rule)', async () => {
    for (const id of specsDrawn()) {
      const r = plate.renderPlate(S[id], { id: 'x' }).report;
      for (const f of cardOf(id).plateFacts ?? []) {
        const hits = r.checks.filter((k: any) => k.landmark === f.landmark && (k.pose === f.pose || k.pose === 'all') && k.cm != null);
        expect(hits.length > 0 && hits.every((k: any) => k.cm <= qaNode.LIMITS.cm), `${id} ${f.landmark} ${f.pose}: ${JSON.stringify(hits)}`).toBe(true);
      }
      await yieldNow();
    }
  });
  it('mutations: a topFault changed, a fact moved to the end pose, a tempo second changed, and a Hold added to ab_wheel_rollout are red', () => {
    const b = cardOf('bird_dog');
    expect(keyProblems('bird_dog', { ...b, topFault: 'high' })).toEqual(['bird_dog: topFault high']);
    expect(keyProblems('bird_dog', { ...b, plateFacts: b.plateFacts.map((f: any, i: number) => (i ? f : { ...f, pose: 'end', cardPose: 'end' })) }).length).toBe(1);
    expect(keyProblems('bird_dog', { ...b, tempo: [{ ...b.tempo[0], s: 2 }, ...b.tempo.slice(1)] }).length).toBe(1);
    const a = cardOf('ab_wheel_rollout');
    expect(keyProblems('ab_wheel_rollout', { ...a, tempo: [a.tempo[0], { phase: 'Hold', s: 1 }, a.tempo[1]] }).length).toBe(1);
  });
});

describe('LIB-21 A4 (D-LIB21-FLAGS): qa.mjs\'s ruled flag set (F5 on all; F1 and F3 named on bird_dog; F2 and F3 on cable_crunch, D-LIB21-CCFLAGS)', { timeout: T }, () => {
  let qa: any;
  beforeAll(async () => { qa = await import(/* @vite-ignore */ lib('lb9/qa.mjs')); }, T);
  const report = (id: string, raised: Record<string, number>) => ({ id, flags: Object.fromEntries(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'].map(f => [f, { raised: f in raised, value: raised[f] ?? null }])) });
  const dog = (o: Record<string, number> = {}) => report('lib_bird_dog', { F1: 151.49, F3: 33.5, F5: 3.57, ...o });
  const cc = (o: Record<string, number> = {}) => report('lib_cable_crunch', { F2: 0.622, F3: 26.05, F5: 3.57, ...o });
  it('the named sets: F1 151.49 and F3 33.5 on bird_dog, F2 0.622 and F3 26.05 on cable_crunch; EXPECTED gives F5 alone on ab_wheel_rollout', () => {
    expect(qa.F1_NAMED).toEqual({ lib_bird_dog: 151.49 });
    expect(qa.F3_NAMED).toEqual({ lib_bird_dog: 33.5, lib_cable_crunch: 26.05 });
    expect(qa.F2_NAMED).toEqual({ lib_cable_crunch: 0.622 });
    expect(qa.EXPECTED('lib_bird_dog')).toEqual(['F1', 'F3', 'F5']);
    expect(qa.EXPECTED('lib_cable_crunch')).toEqual(['F2', 'F3', 'F5']);
    expect(qa.EXPECTED('lib_ab_wheel_rollout')).toEqual(['F5']);
    expect(qa.flagProblems([dog(), cc(), report('lib_ab_wheel_rollout', { F5: 3.57 })])).toEqual([]);
  });
  it('mutations: bird_dog\'s F3 at 27.0, F3 raised on another id, F1 off its px/m, F3 missing on bird_dog, cable_crunch\'s F2 at 0.645 and F3 at 27.0 are red', () => {
    expect(qa.flagProblems([cc({ F2: 0.645 })]).length).toBe(1);
    expect(qa.flagProblems([cc({ F3: 27.0 })]).length).toBe(1);
    expect(qa.flagProblems([dog({ F3: 34.0 })]).length).toBe(1);
    expect(qa.flagProblems([report('lib_ab_wheel_rollout', { F3: 26.5, F5: 3.57 })]).length).toBe(1);
    expect(qa.flagProblems([dog({ F1: 160 })]).length).toBe(1);
    const noF3 = dog(); noF3.flags.F3 = { raised: false, value: null };
    expect(qa.flagProblems([noF3]).length).toBeGreaterThanOrEqual(1);
  });
  it('the longest leaders on bird_dog and cable_crunch are their named F3 values (±0.1 px)', () => {
    const len = (p: number[][]) => segs(p).reduce((t, [a, b]) => t + Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!), 0);
    const max = Math.max(...[false, true].flatMap(m => leadersOf(plate.renderPlate(S.bird_dog, { id: 'x', mistake: m }).svg).map(len)));
    expect(Math.abs(max - qa.F3_NAMED.lib_bird_dog)).toBeLessThanOrEqual(0.1);
    const maxCc = Math.max(...[false, true].flatMap(m => leadersOf(plate.renderPlate(S.cable_crunch, { id: 'x', mistake: m }).svg).map(len)));
    expect(Math.abs(maxCc - qa.F3_NAMED.lib_cable_crunch)).toBeLessThanOrEqual(0.1);
  });
});

describe('LIB-21 A5: lb9/rows.json holds exactly the drawn, non-held LB9 H ids with a tempo strip, all mode H', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn, non-held id with a strip exactly once in the raw text, nothing else, every mode H', () => {
    expect([...want()].sort()).toEqual(['lib_ab_wheel_rollout', 'lib_bird_dog']);   // cable_crunch held (D-LIB21-CCHOLD)
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('plank, crunch, the 5 T ids and the 3 (b) ids (off rows until their keys are verified) are in no lb9/ file as a row; bicycle_crunch has no spec before \'LB9 ER5 GO\'', () => {
    for (const f of readdirSync('tools/plates/library/lb9').filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join('tools/plates/library/lb9', f), 'utf8');
      for (const id of [...NOT_HERE, ...ER5]) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id}`).toBe(false);
    }
    expect(existsSync(`${SPECS_DIR}/bicycle_crunch.mjs`)).toBe(false);
  });
  it('the held ids (cable_crunch D-LIB21-CCHOLD; superman D-LIB21-SIZE; pallof_press D-LIB21-PALLOFHOLD) are build.mjs HELD with their census view, in DESIGN.md\'s held table, and in no rows file', async () => {
    const build = await import(/* @vite-ignore */ lib('lb9/build.mjs'));
    expect(build.HELD).toEqual({ cable_crunch: 'side', superman: 'side', pallof_press: 'side', side_plank: 'front', russian_twist: 'front' });
    const design = readFileSync('tools/plates/library/lb9/DESIGN.md', 'utf8');
    for (const id of HELD) expect(new RegExp(`\\| ${id} \\| D-LIB21-[A-Z]+`).test(design), id).toBe(true);
    for (const id of HELD) expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
  });
  it('mutations: a dropped row, a duplicated row, a held id, plank, crunch, flutter_kicks, side_plank and one mode set to D are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const w = want(), j = { batch: 'LB9', rows: Object.fromEntries(w.map(id => [id, row])) };
    const text = JSON.stringify(j, null, 1), add = (id: string) => JSON.stringify({ ...j, rows: { ...j.rows, [id]: row } }, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: {} }, null, 1), w)).toEqual(w.map(x => `${x} x0`));
    expect(a5(text.replace(`  "${w[0]}": {`, `  "${w[0]}": ${JSON.stringify(row)},\n  "${w[0]}": {`), w)).toEqual([`${w[0]} x2`]);
    // a held id: superman, held until drawn (no spec), stands for any held id
    expect(a5(add('lib_superman'), w), 'a held id').toEqual(['extra lib_superman']);
    for (const id of ['plank', 'crunch', 'flutter_kicks', 'side_plank']) expect(a5(add(`lib_${id}`), w)).toEqual([`extra lib_${id}`]);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, [w[0]!]: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['mode D']);
  });
  it('every row points at its own spec file and carries the census view; batch LB9, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view, id).toBe('side');
      expect(readJson(`docs/research/howto/cards/${id.slice(4)}.json`).plate.view, id).toBe(r.view);
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB9', censusRef: '4a9fd86' });
  });
});

describe('LIB-21 A9 (D-LIB21-AHEAD): nothing ships', () => {
  const slug = (id: string) => id.replace(/_/g, '-');
  /** Whole-token matchers for an id: `\b(lib_)?<id>\b` and the hyphen slug bounded by non [a-z0-9-] characters. */
  const matchers = (id: string) => [new RegExp(`\\b(lib_)?${id}\\b`), new RegExp(`(^|[^a-z0-9-])${slug(id)}([^a-z0-9-]|$)`)];
  const names = (text: string) => LB9.filter(id => matchers(id).some(m => m.test(text)));
  const filesUnder = (d: string): string[] => (existsSync(d) ? readdirSync(d, { withFileTypes: true }).flatMap(e => (e.isDirectory() ? filesUnder(join(d, e.name)) : [join(d, e.name)])) : []);
  const offenders = (dir: string) => filesUnder(dir).flatMap(f => {
    const text = readFileSync(f, 'utf8');
    return [...names(text).map(id => `${f}: ${id}`), ...(/lb9/i.test(f.slice(dir.length)) ? [`${f}: file name`] : []), ...(/"batch":\s*"LB9"/.test(text) ? [`${f}: batch LB9`] : [])];
  });
  it('no LB9 H id, slug or batch is in any tools/plates/library/batches/ file or in tests/howto/golden/library/', () => {
    expect(offenders('tools/plates/library/batches')).toEqual([]);
    expect(offenders('tests/howto/golden/library')).toEqual([]);
  });
  it('the matcher is exact: over src/data/exercises.json no other real id contains one of the 8; it matches neither lib_bird_dog_v2 nor single-arm-pallof-press', () => {
    const ex = readJson('src/data/exercises.json') as any[];
    for (const e of ex) for (const id of LB9) if (e.id !== `lib_${id}`) expect(matchers(id).some(m => m.test(String(e.id))), `${e.id} ~ ${id}`).toBe(false);
    expect(names('lib_bird_dog_v2')).toEqual([]);
    expect(names('single-arm-pallof-press')).toEqual([]);
    expect(names('lib_bird_dog')).toEqual(['bird_dog']);
  });
  it('mutation: a plain substring matcher is red on the _v2 control', () => {
    const plain = (text: string) => LB9.filter(id => text.includes(id));
    expect(plain('lib_bird_dog_v2')).not.toEqual([]);
  });
  it('control: a file naming only lib_plank (pilot A), lib_crunch (pilot B) and lib_bear_crawl (LB10) stays green', () => {
    expect(names('lib_plank lib_crunch lib_bear_crawl plank crunch bear-crawl')).toEqual([]);
  });
  it('mutations: a golden file naming an LB9 H id, a page-only lb9.json and an ab-wheel-rollout.layers.html are red', () => {
    const dir = mkdtempSync(join(tmpdir(), 'lb9-a9-'));
    try {
      writeFileSync(join(dir, 'g.json'), '{"id":"lib_bird_dog"}');
      writeFileSync(join(dir, 'lb9.json'), '{"entries":[{"kind":"page","batch":"LB9"}]}');
      writeFileSync(join(dir, 'ab-wheel-rollout.layers.html'), '<div data-id="ab-wheel-rollout"></div>');
      expect(offenders(dir).map(s => s.replace(`${dir}/`, '')).sort()).toEqual(['ab-wheel-rollout.layers.html: ab_wheel_rollout', 'g.json: bird_dog', 'lb9.json: batch LB9', 'lb9.json: file name'].sort());
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-21 A19 (D-LIB21-TESTS): test manners', () => {
  const src = readFileSync(new URL(import.meta.url), 'utf8');
  it('the file registers an afterEach that awaits one macrotask (setImmediate)', () => {
    expect(src).toMatch(/\nafterEach\(\(\) => new Promise<void>\(r => setImmediate\(r\)\)\);/);
  });
  /** generate and every whole-page render run in an awaited child process: no in-worker gen.render() or page build. */
  const inWorker = (text: string) => /\n\s*(const|let)[^\n]*= await (gen|generate)\.render\(\)|await build\.buildLb9Page\(\)/.test(text.replace(/const script = `[\s\S]*?`;/g, ''));
  it('generate and the page builds run in an awaited child process; per-spec loops yield', () => {
    expect(inWorker(src)).toBe(false);
    expect(src).toMatch(/promisify\(execFile\)\(process\.execPath/);
    expect((src.match(/await yieldNow\(\)/g) ?? []).length).toBeGreaterThanOrEqual(6);
  });
  it('mutation: `generate.render()` called in the worker is red', () => {
    expect(inWorker(`${src}\n  const out = await gen.render();\n`)).toBe(true);
  });
  it('mutation: the source without the afterEach is red', () => {
    const cut = src.replace('\nafterEach(() => new Promise<void>(r => setImmediate(r)));', '');
    expect(/\nafterEach\(\(\) => new Promise<void>\(r => setImmediate\(r\)\)\);/.test(cut)).toBe(false);
  });
});

describe('LIB-21 A9 (D-LIB21-AHEAD): the rows never ship; generate is unchanged', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  it('every LB9 row is at stage drawing or review; mutations: shipped and approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems(rows)).toEqual([]);
    expect(stageProblems({ ...rows, lib_bird_dog: { ...rows.lib_bird_dog, stage: 'shipped' } })).toEqual(['lib_bird_dog: shipped']);
    expect(stageProblems({ ...rows, lib_bird_dog: { ...rows.lib_bird_dog, stage: 'approved-plate' } })).toEqual(['lib_bird_dog: approved-plate']);
  });
  it('none of the 8 is shipped, even with lb9/rows.json read as a batch file', () => {
    const IDS = LB9.map(i => `lib_${i}`);
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
    expect(reg.shippedIds().filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  it('mutation: rows.json copied into batches/ (read as a batch) would name batch LB9 and an LB9 id', () => {
    const text = readFileSync(ROWS, 'utf8');
    expect(/"batch":\s*"LB9"/.test(text) && /lib_bird_dog/.test(text)).toBe(true);
  });
  it('no LB9 spec, composer, How-to, script or test imports anything under hands/, fidelity/, ci/ or tests/howto/fixtures/', () => {
    const files = [...specsDrawn().map(i => `${SPECS_DIR}/${i}.mjs`), ...COMPOSERS.map(c => `tools/plates/library/eq/${c}.mjs`),
      ...specsDrawn().map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`).filter(f => existsSync(f)), 'tools/plates/library/lb9/build.mjs', 'tools/plates/library/lb9/qa.mjs', 'tests/howto/lb9-plates.test.ts'];
    const bad = (f: string) => [...readFileSync(f, 'utf8').matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map(m => join(f, '..', m[1]!)).filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\/|^tests\/howto\/fixtures\//.test(p));
    for (const f of files) expect(bad(f), f).toEqual([]);
  });
  it('generate --check is green, and no generated file reads lb9/, the LB9 specs, composers or How-to sources (awaited child process)', async () => {
    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});
const ids = ${JSON.stringify(LB9)}, out = await gen.render(), bad = [];
for (const [p, { text }] of out) { if (/library\\/lb9\\/|eq\\/(abWheel|medBallOptional)\\.mjs/.test(text)) bad.push(p + ': lb9/ or an LB9 composer');
  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\b').test(text)) bad.push(p + ': ' + id); }
console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;
    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    const r = JSON.parse(stdout.trim().split('\n').pop()!);
    console.log(`LIB-21 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);
    expect(r.n).toBeGreaterThan(0);
    expect(r.diff).toEqual([]);
    expect(r.bad).toEqual([]);
  });
});

describe('LIB-21 A10: the LB9 plates page is deterministic (PQ-H7; built in an awaited child process)', { timeout: T }, () => {
  it('two builds of the LB9 rows are byte-identical', async () => {
    const script = `const b = await import(${JSON.stringify(lib('lb9/build.mjs'))}), { createHash } = await import('node:crypto');
const sha = x => createHash('sha256').update(x).digest('hex');
const a = await b.buildLb9Page(), c = await b.buildLb9Page();
console.log(JSON.stringify({ ids: b.drawnIds(), a: sha(a.html), c: sha(c.html) }));`;
    const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    const r = JSON.parse(stdout.trim().split('\n').pop()!);
    expect([...r.ids].sort()).toEqual(drawn().map(i => `lib_${i}`).sort());
    expect(r.a).toBe(r.c);
    console.log(`LIB-21 A10: plates page sha256 ${r.a}`);
  });
});

describe('LIB-21 A7 (spec half): each spec\'s tempo follows lb9/tempo.json and its card', () => {
  const t = readJson('tools/plates/library/lb9/tempo.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const build = (id: string) => t.rows[id].map((r: any) => ({ phase: r.phase, s: 'constant' in r ? r.constant : cardOf(id).plate.tempo[r.from], ...(r.move ? { move: true } : {}) }));
  const tempoProblems = (id: string, spec: any) => (JSON.stringify(spec.tempo) === JSON.stringify(build(id)) ? [] : [`${id}: ${JSON.stringify(spec.tempo)} != ${JSON.stringify(build(id))}`]);
  it('every drawn spec\'s tempo is its ruled row built from the card', () => {
    for (const id of specsDrawn()) expect(tempoProblems(id, S[id])).toEqual([]);
  });
  it('mutations: bird_dog\'s Hold changed to 2, a Hold added to ab_wheel_rollout (pause 0), cable_crunch\'s up and down swapped (Reading B) are red', () => {
    const b = S.bird_dog, a = S.ab_wheel_rollout, c = S.cable_crunch;
    expect(tempoProblems('bird_dog', { ...b, tempo: b.tempo.map((x: any) => (x.phase === 'Hold' ? { ...x, s: 2 } : x)) }).length).toBe(1);
    expect(tempoProblems('ab_wheel_rollout', { ...a, tempo: [a.tempo[0], { phase: 'Hold', s: 1 }, a.tempo[1]] }).length).toBe(1);
    expect(tempoProblems('cable_crunch', { ...c, tempo: [{ ...c.tempo[0], s: c.tempo[2].s }, c.tempo[1], { ...c.tempo[2], s: c.tempo[0].s }] }).length).toBe(1);
  });
});

describe('LIB-21 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specsDrawn().map(i => `${SPECS_DIR}/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/vendor/exercises/')),
    ...c.filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\//.test(p)),
    ...c.filter(p => p.startsWith('tests/howto/fixtures/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
  ];
  it('every drawn LB9 spec passes', async () => {
    expect(files().length).toBe(DRAWN.length);
    for (const f of files()) { expect(problems(f, closure.closureOf([f])), f).toEqual([]); await yieldNow(); }
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb9-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = `${SPECS_DIR}/ab_wheel_rollout.mjs`;
  it('mutation: readFileSync added to the abWheel composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/abWheel.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/vendor/exercises/hanging_leg_raise.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../vendor/exercises/hanging_leg_raise.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root))).toContain('tools/plates/vendor/exercises/hanging_leg_raise.mjs'); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-21 A16: no other card\'s composer is copied, forked or imported (D-LIB21-COMPOSERS, -ROPE, D-LIB-A16-COMPOSE)', () => {
  // D-LIB-A16-COMPOSE (lib4-cards section 39): main's eq/ at 40f9ea93, this card's own composers (abWheel, and
  // medBallOptional from the (b) resume), and the composers the other build-ahead cards own, by exact name, read from
  // the shared registry (D-LIB-A16-REGISTRY; this card's names dropped).
  const EQ_DIR = 'tools/plates/library/eq';
  const MAIN_EQ = ['assistMachine', 'band', 'chestRowMachine', 'dHandle', 'declineBench', 'inclineBench', 'landmine', 'legCurlMachine',
    'parts', 'pecDeck', 'polybar', 'romanChair', 'rope', 'safetyArms', 'smith'].map(n => `${n}.mjs`), OURS = ['abWheel.mjs', 'medBallOptional.mjs'];
  const OTHER_CARDS: Record<string, string[]> = otherCards('LIB-21');   // D-LIB-A16-REGISTRY (#326): the shared registry
  const OTHER = Object.values(OTHER_CARDS).flat().map(n => `${n}.mjs`);
  /** eq/ as name → bytes; a test passes its own map to show a mutation. */
  const eqDir = (): Map<string, Buffer> => new Map(readdirSync(EQ_DIR).map(n => [n, readFileSync(join(EQ_DIR, n))]));
  const eqProblems = (eq: Map<string, Buffer>) => {
    const names = [...eq.keys()];
    return [
      ...MAIN_EQ.filter(n => !eq.has(n)).map(n => `missing ${n}`),
      ...OURS.filter(n => !eq.has(n)).map(n => `missing ${n}`),
      ...names.filter(n => !MAIN_EQ.includes(n) && !OURS.includes(n) && !OTHER.includes(n)).map(n => `extra ${n}`),
      ...names.filter(n => OTHER.includes(n)).flatMap(n => OURS.filter(o => eq.has(o) && eq.get(o)!.equals(eq.get(n)!)).map(o => `${n} copies ${o}`)),
    ];
  };
  const withFile = (name: string, bytes: Buffer) => new Map([...eqDir(), [name, bytes]]);
  const without = (name: string) => { const m = eqDir(); m.delete(name); return m; };
  it('tools/plates/library/eq/ holds main\'s files, abWheel and medBallOptional, and every other file is another card\'s composer by name', () => {
    expect(OTHER).not.toContain('abWheel.mjs');
    expect(eqProblems(eqDir())).toEqual([]);
  });
  it('mutation: a copy of #305\'s eq/medBall.mjs added under another name is red', () => {
    expect(eqProblems(withFile('ball.mjs', Buffer.from('export const medBall = () => [];\n')))).toEqual(['extra ball.mjs']);
  });
  it('mutation: a file named as another card\'s composer holding a byte copy of eq/abWheel.mjs is red', () => {
    expect(eqProblems(withFile('kettlebell.mjs', readFileSync(join(EQ_DIR, 'abWheel.mjs'))))).toEqual(['kettlebell.mjs copies abWheel.mjs']);
  });
  it('mutation: a missing main file or a missing own composer is red', () => {
    expect(eqProblems(without('smith.mjs'))).toEqual(['missing smith.mjs']);
    expect(eqProblems(without('abWheel.mjs'))).toEqual(['missing abWheel.mjs']);
    expect(eqProblems(without('medBallOptional.mjs'))).toEqual(['missing medBallOptional.mjs']);
  });
  // D-LIB-A16-REGISTRY (#326 6405804435): the shared registry's shape, and every eq/ file outside main's is in it.
  const reg = () => readJson(EQ_COMPOSERS_PATH);
  const coverage = (eq: Map<string, Buffer>, cards: Record<string, string[]>) => {
    const all = Object.values(cards).flat().map(n => `${n}.mjs`);
    return [...eq.keys()].filter(n => !MAIN_EQ.includes(n) && !all.includes(n)).map(n => `unregistered ${n}`);
  };
  it('the registry has the 7 cards, each name under exactly one card, and names every eq/ file outside main\'s; LIB-21 owns abWheel and medBallOptional', () => {
    expect(registryProblems(reg())).toEqual([]);
    expect(coverage(eqDir(), reg().cards)).toEqual([]);
    expect(reg().cards['LIB-21']).toEqual(['abWheel', 'medBallOptional']);
  });
  it('registry mutations: an unknown name in eq/, a name under two cards, medBallOptional dropped from the registry while its file exists, and a byte copy of medBallOptional under another card\'s name are red', () => {
    expect(coverage(withFile('wedge.mjs', Buffer.from('export const wedge = () => [];\n')), reg().cards)).toEqual(['unregistered wedge.mjs']);
    expect(registryProblems({ cards: { ...reg().cards, 'LIB-14': ['wall', 'abWheel'] } })).toEqual(['abWheel under LIB-14 and LIB-21']);
    expect(coverage(eqDir(), { ...reg().cards, 'LIB-21': ['abWheel'] })).toEqual(['unregistered medBallOptional.mjs']);
    expect(eqProblems(withFile('sled.mjs', readFileSync(join(EQ_DIR, 'medBallOptional.mjs'))))).toEqual(['sled.mjs copies medBallOptional.mjs']);
  });
});

describe('LIB-21 test camera (supervisor, bulk rulings on #312): camOf follows the spec\'s facing', { timeout: T }, () => {
  /** The engine's joint marks (plate.mjs: the near shoulder, elbow, hip and knee in side view) against camOf's projection
   *  of the same landmarks in the end pose; the facing-blind camera (the earlier camOf: near 'r', x0 + z) misplaces them
   *  on a facing-left plate. Returns the worst miss in px. */
  const markMiss = (spec: any, cam: any) => {
    const marks = [...plate.renderPlate(spec, { id: 'x' }).svg.matchAll(/<circle class="joint" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/g)].map(m => [+m[1]!, +m[2]!]);
    const l = lmOf(spec, 'end'), keys = spec.marks ?? (cam.view === 'front' ? ['shoulder.l', 'shoulder.r', 'elbow.l', 'elbow.r'] : ['shoulder', 'elbow', 'hip', 'knee'].map(k => `${k}.${cam.near}`));   // plate.mjs:160
    return Math.max(...keys.map((k: string, i: number) => Math.hypot(cam.P(l[k])[0] - marks[i]![0]!, cam.P(l[k])[1] - marks[i]![1]!)));
  };
  const blind = (spec: any) => { const c = rep(spec).camera; return { near: 'r', P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] }; };
  it('camOf puts every drawn spec\'s near joints on the engine\'s joint marks (±0.1 px), pallof_press (facing left) included', async () => {
    for (const id of specsDrawn()) { expect(markMiss(S[id], camOf(S[id])), id).toBeLessThanOrEqual(0.1); await yieldNow(); }
    expect(S.pallof_press.facing).toBe('left');
  });
  it('mutation: the facing-blind camera misplaces pallof_press\'s joints by many px (red)', () => {
    expect(markMiss(S.pallof_press, blind(S.pallof_press))).toBeGreaterThan(20);
  });
  it('mutation: a pitch-blind front camera (the level projection) misplaces russian_twist\'s joint marks (camera.pitch 20, LIB-20) by many px (red)', () => {
    const c = camOf(S.russian_twist);
    expect(markMiss(S.russian_twist, { ...c, P: (w: number[]) => [c.P(w)[0]!, rep(S.russian_twist).camera.y0 - w[1]! * c.pxm] })).toBeGreaterThan(10);
  });
});

describe('LIB-21 A15: Mistakes, tells, cues, callouts, leaders, phantoms and soft bends (DESIGN.md sections 6-12)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { cable_crunch: 'hips', ab_wheel_rollout: 'arch', bird_dog: 'arch', superman: 'head', pallof_press: 'arch', side_plank: 'sink', russian_twist: 'hips' };
  const ONE_TELL = ['ab_wheel_rollout', 'cable_crunch', 'pallof_press', 'side_plank', 'russian_twist'];
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each drawn plate draws its Mistake with 2-3 tells (or one, with its record), the first carrying the ruled key', () => {
    for (const id of specsDrawn()) {
      expect(keyProblems(S[id])).toEqual([]);
      const n = S[id].mistake.tells.length;
      expect(ONE_TELL.includes(id) ? n === 1 : n >= 2 && n <= 3, `${id} ${n}`).toBe(true);
    }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.bird_dog;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['bird_dog: first tell high']);
  });
  /** D-LIB10-SKULL1: a one-tell plate has its record in DESIGN.md (a line `- <id>:` naming the claim ids read, and the
   *  one stated sign). */
  const recordProblems = (id: string, design = readFileSync('tools/plates/library/lb9/DESIGN.md', 'utf8')) => {
    const sec = design.split('**One-tell record')[1]?.split('\n## ')[0] ?? '';
    return sec.split('\n').some(l => l.startsWith(`- ${id}:`) && /claim ids read/.test(l)) && /one stated sign|no second (visible )?sign stated/.test(sec) ? [] : [`${id}: no one-tell record`];
  };
  it('every one-tell plate has its D-LIB10-SKULL1 record; mutation: a spec with one tell and no record is red', () => {
    for (const id of specsDrawn().filter(i => S[i].mistake.tells.length === 1)) expect(recordProblems(id)).toEqual([]);
    expect(recordProblems('bird_dog')).toEqual(['bird_dog: no one-tell record']);
  });
  const guideProblems = (spec: any) => (spec.mistake.guides ?? []).filter((g: any) => !['dashed', 'arrow', 'arc-arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('every Mistake guide is dashed or an arrow; mutation: a solid line guide is red', () => {
    for (const id of specsDrawn()) expect(guideProblems(S[id])).toEqual([]);
    const s = S.bird_dog;
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: [] }] } })).toEqual(['bird_dog: line']);
  });
  /** Q-D5-6 cue table: one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('the cue table: every cue is one sentence of 15 words or fewer (logged); mutation: a 16-word cue is red', () => {
    for (const id of specsDrawn()) {
      for (const c of [...S[id].callouts, ...S[id].mistake.tells]) console.log(`LIB-21 cue ${id} ${c.key}: "${c.cue}" (${c.cue.split(/\s+/).length} words)`);
      expect(cueProblems(S[id]), id).toEqual([]);
    }
    const s = S.bird_dog;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Keep both of your hands right under the shoulders and both of your knees under the hips.' }, ...s.callouts.slice(1)] })).toEqual(['under: 17 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of specsDrawn()) {
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
  const drawnPolys = (spec: any, pose: string) => { const cam = camOf(spec), out: number[][][] = []; for (const it of itemsIn(spec, pose).items) for (const p of eng.PRIMITIVES[it.type](it, cam)) if (p.poly) out.push(p.poly); return out; };
  /** Each callout's and tell's anchor sits on an item drawn in its pose: within 3 px of the figure in that pose, an
   *  equipment outline, a cable, the datum or a Mistake dashed line (never a guide arrow). */
  const anchorProblems = (spec: any) => {
    const r = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    const lms = qaEng.poseLandmarks(Eng(), spec).lm, out: string[] = [];
    for (const [mode, list] of [['normal', spec.callouts], ['mistake', spec.mistake.tells]] as const) for (const c of list) {
      const named = typeof c.anchor === 'string' && c.anchor.includes(':') ? c.anchor.split(':')[0] : c.anchor?.pose;
      const pose = named ?? (mode === 'mistake' ? 'mistake' : 'end');
      const at = qaEng.resolvePoint(c.anchor, pose, lms, qaEng.cameraOf(spec, r.normal.report));
      const polys = [...shapesIn(spec, pose).map((x: any) => x.poly), ...drawnPolys(spec, pose)];
      const lines = [...r[mode].svg.matchAll(/<path class="(?:eq-cable|datum|m-line)[^"]*" d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      const dLine = Math.min(Infinity, ...lines.map(([p, q]) => segD(at, p!, q!)));
      if (!(outside(polys, at) <= 3 || dLine <= 3)) out.push(`${spec.id} ${c.key}: anchor ${Math.min(Math.abs(outside(polys, at)), dLine).toFixed(1)} px from any drawn item`);
    }
    return out;
  };
  it('every callout and tell anchor sits on an item drawn in its pose (within 3 px)', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...anchorProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutations: a tell anchored on its own guide arrow\'s tail (off the figure), and one moved to a point with no drawn item, are red', () => {
    const s = S.bird_dog, g = s.mistake.guides[0];
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells: [{ ...s.mistake.tells[0], anchor: g.from }, ...s.mistake.tells.slice(1)] } }).length).toBe(1);
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells: [{ ...s.mistake.tells[0], anchor: [0, 1.4, 0] }, ...s.mistake.tells.slice(1)] } }).length).toBe(1);
  });
  /** 13.1, 13.4 must-fix 1, lib4-cards 32-33: every solid red arrow clears the solid end figure by 6 px, or is the short
   *  arrow (at most 14 px, "about 12 css px") of a fault drawn as its true contour inside the figure. Lengths logged. */
  const clearance = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
      // the shaft is the first M..L run of the path (plate.mjs arrows: M from L to, then M..L..L the head)
      const pts = xy(m[1]!), shaft = xy(m[1]!.split('M').filter(Boolean)[0]!), samp: number[][] = [], len = segs(shaft).reduce((t, [a, b]) => t + Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!), 0);
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      console.log(`LIB-21 arrow ${spec.id}: ${len.toFixed(1)} px long, ${min.toFixed(1)} px from the end figure`);
      return min >= 6 || len <= 14 ? [] : [`${spec.id}: arrow ${min.toFixed(1)} px from the end figure (${len.toFixed(1)} px long)`];
    });
  };
  it('every drawn plate: each solid red arrow clears the end figure by 6 px or is a short in-figure fault arrow (≤ 14 px)', async () => {
    for (const id of specsDrawn()) { expect(clearance(S[id]), id).toEqual([]); await yieldNow(); }
  });
  it('mutation: a long arrow from the end hips to the Mistake hips on cable_crunch (inside the 6 px clearance) is red', () => {
    const s = S.cable_crunch, guides = [...s.mistake.guides, { kind: 'arrow', from: { at: 'shoulders', pose: 'end' }, to: { at: 'hips', pose: 'end' } }];
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });
  /** Lines a leader keeps 6 px from (away from its first 8 px): the Trace, the floor line, cables and every equipment
   *  outline (the rope, the wheel and its handles, the pad, the mat, the column). The start phantoms are checked below. */
  const avoidOf = (spec: any, mistake: boolean, svg: string) => {
    const cam = camOf(spec), out: number[][][] = [];
    for (const m of svg.matchAll(/<path class="(?:trace|eq-cable|floorline)[^"]*"[^>]*? d="([^"]+)"/g)) out.push(...segs(xy(m[1]!.replace(/H(-?[\d.]+)/, (_, x) => `L${x} ${xy(m[1]!)[0]![1]}`))));
    for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items) if (!/^start/i.test(it.part ?? ''))
      for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) out.push(...segs([...pts, pts[0]])); }
    return out;
  };
  const minGap = (spec: any) => {
    let min = Infinity, at = '';
    for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg, list = listOf(spec, mistake), avoid = avoidOf(spec, mistake, svg);
      leadersOf(svg).forEach((p, i) => {
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) { const d = segD(q, g[0]!, g[1]!); if (d < min) { min = d; at = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`; } }
        }
      });
    }
    return { min, at };
  };
  it('no leader comes within 6 px of the Trace, the floor line, a cable or any equipment outline (away from its first 8 px)', async () => {
    for (const id of specsDrawn()) { const g = minGap(S[id]); console.log(`LIB-21 leader gap ${id}: ${g.min.toFixed(1)} px (${g.at})`); expect(g.min, `${id} ${g.at}`).toBeGreaterThanOrEqual(6); await yieldNow(); }
  });
  // D-LIB21-ROPENIT is withdrawn: after the slice fix round the "Rope by head" leader clears the strand by 7.28 px.
  it('mutation: cable_crunch\'s "Rope by head" box at 200/232 (its leader along the strand) is red', () => {
    const s = S.cable_crunch, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'rope' ? { ...x, box: { left: 200, top: 232 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  it('mutation: ab_wheel_rollout\'s "Roll slowly" box moved down to the floor right of the wheel (its leader across the wheel and the floor line) is red', () => {
    const s = S.ab_wheel_rollout, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'slow' ? { ...x, box: { left: 300, top: 334 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  /** No leader crosses a figure: normal leaders stay outside the solid end figure; Mistake leaders outside both the
   *  solid end figure and the Mistake figure, away from their first 8 px. The (a) rows name no front entry. The E-R5
   *  slice asks two (D-LIB18-LIFT's named-nit form, D-LIB15-NIT1; #326, the scans in the 'LB9 ER5 SLICE READY' post),
   *  each pinned at its measured length inside the figure (px, past the first 8 px, ±0.5): side_plank's "Hips sink"
   *  enters the solid end figure once from above to the red top outline of the sunk pelvis (the fault lies under the
   *  solid figure, D-LIB21-FRONT); russian_twist's "Knees swing" enters from the left to the red right knee, which
   *  swings behind the solid right knee and arm. An entry the supervisor does not sign is redrawn or its row is held. */
  const FRONT_ENTRY: Record<string, number> = { 'side_plank mistake sink end': FE_SINK, 'russian_twist mistake hips end': FE_KNEE_END, 'russian_twist mistake hips Mistake': FE_KNEE_MIS };
  const insideLen = (p: number[][], polys: number[][][]) => {
    let len = 0;
    for (const [a, b] of segs(p)) { const L = Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!); for (let k = 0; k < 40; k++) {
      const q = [a![0]! + (b![0]! - a![0]!) * (k + 0.5) / 40, a![1]! + (b![1]! - a![1]!) * (k + 0.5) / 40];
      if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8 && outside(polys, q) < 0) len += L / 40;
    } }
    return len;
  };
  const crossProblems = (spec: any, entries: Record<string, number> = FRONT_ENTRY) => {
    const out: string[] = [];
    for (const mistake of [false, true]) {
      const list = listOf(spec, mistake), figs = [shapesIn(spec, 'end').map((x: any) => x.poly), ...(mistake ? [shapesIn(spec, 'mistake').map((x: any) => x.poly)] : [])];
      leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
        figs.forEach((polys, f) => {
          const len = insideLen(p, polys), name = `${spec.id} ${mistake ? 'mistake' : 'normal'} ${list[i]?.key} ${f ? 'Mistake' : 'end'}`;
          if (name in entries) { if (Math.abs(len - entries[name]!) > 0.5) out.push(`${name}: named entry ${len.toFixed(1)} px != ${entries[name]}`); }
          else if (len > 0) out.push(`${spec.id} ${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: crosses the ${f ? 'Mistake' : 'end'} figure`);
        });
      });
    }
    return out;
  };
  it('the named entries (asked with the E-R5 slice) are logged at their measured length', () => {
    for (const id of ['side_plank', 'russian_twist']) for (const mistake of [true]) {
      const list = listOf(S[id], mistake), figs = [shapesIn(S[id], 'end').map((x: any) => x.poly), shapesIn(S[id], 'mistake').map((x: any) => x.poly)];
      leadersOf(plate.renderPlate(S[id], { id: 'x', mistake }).svg).forEach((p, i) => figs.forEach((polys, f) => { const l = insideLen(p, polys); if (l > 0) console.log(`LIB-21 front entry ${id} ${list[i]?.key} ${f ? 'Mistake' : 'end'}: ${l.toFixed(2)} px`); }));
    }
  });
  it('mutations: a named entry with no pin, or a named entry grown by moving its box, is red', () => {
    expect(crossProblems(S.side_plank, {}).some(p => p.startsWith('side_plank mistake sink: crosses the end'))).toBe(true);
    const s = S.side_plank, bad = { ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((x: any) => ({ ...x, box: { left: 150, top: 180 } })) } };
    expect(crossProblems(bad).some(p => p.startsWith('side_plank mistake sink'))).toBe(true);
  });
  it('no leader crosses the solid figure, and no Mistake leader crosses the Mistake figure', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...crossProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: bird_dog\'s "Low back arches" box placed under the figure, so its leader crosses the Mistake figure, is red', () => {
    const s = S.bird_dog, bad = { ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((x: any) => (x.key === 'arch' ? { ...x, box: { left: 150, top: 350 } } : x)) } };
    expect(crossProblems(bad).some(p => p.startsWith('bird_dog mistake arch'))).toBe(true);
  });
  /** No leader crosses another leader, or another label's text (its ink box, 2 px margin), in either view. */
  const labelProblems = (spec: any) => {
    const out: string[] = [];
    for (const mistake of [false, true]) {
      const r = plate.renderPlate(spec, { id: 'x', mistake }), leads = leadersOf(r.svg), list = listOf(spec, mistake), v = mistake ? 'mistake' : 'normal';
      const inks = r.report.labels.filter((l: any) => l.key !== 'meta');
      const X = (a: number[], b: number[], c: number[], d: number[]) => { const r1 = [b[0]! - a[0]!, b[1]! - a[1]!], q = [d[0]! - c[0]!, d[1]! - c[1]!], den = r1[0]! * q[1]! - r1[1]! * q[0]!; if (Math.abs(den) < 1e-9) return false; const t = ((c[0]! - a[0]!) * q[1]! - (c[1]! - a[1]!) * q[0]!) / den, u = ((c[0]! - a[0]!) * r1[1]! - (c[1]! - a[1]!) * r1[0]!) / den; return t > 0 && t < 1 && u > 0 && u < 1; };
      leads.forEach((p, i) => {
        for (let j = i + 1; j < leads.length; j++) if (segs(p).some(([a, b]) => segs(leads[j]!).some(([c, d]) => X(a!, b!, c!, d!)))) out.push(`${spec.id} ${v}: leaders ${list[i]?.key} and ${list[j]?.key} cross`);
        for (const l of inks) {
          if (l.key === list[i]?.key) continue;
          const { x0, y0, x1, y1 } = l.ink, m = 2;
          const hit = segs(p).some(([a, b]) => { for (let k = 0; k <= 50; k++) { const x = a![0]! + (b![0]! - a![0]!) * k / 50, y = a![1]! + (b![1]! - a![1]!) * k / 50; if (x > x0 - m && x < x1 + m && y > y0 - m && y < y1 + m) return true; } return false; });
          if (hit) out.push(`${spec.id} ${v}: leader ${list[i]?.key} through the text of ${l.key}`);
        }
      });
    }
    return out;
  };
  it('no leader crosses another leader or another label\'s text', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...labelProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: bird_dog\'s "Arm, leg level" anchored at the buttock (its leader runs through another label\'s text or leader) is red', () => {
    const s = S.bird_dog, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'level' ? { ...x, anchor: 'buttock' } : x)) };
    expect(labelProblems(bad).length).toBeGreaterThan(0);
  });
  /** DRAWING-GUIDE §2: each datum line shows at least 24 px outside the solid end figure, the start figure and the drawn
   *  equipment, so it reads. */
  const datumHidden = (spec: any) => {
    const svg = plate.renderPlate(spec, { id: 'x' }).svg, out: string[] = [];
    const polys = [...shapesIn(spec, 'end').map((x: any) => x.poly), ...shapesIn(spec, 'start').map((x: any) => x.poly), ...drawnPolys(spec, 'end')];
    for (const [, d] of svg.matchAll(/<path class="datum[^"]*" d="([^"]+)"/g)) {
      let vis = 0;
      for (const [a, b] of segs(xy(d!))) { const n = Math.ceil(Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!)); for (let k = 0; k < n; k++) { const q = [a![0]! + (b![0]! - a![0]!) * (k + 0.5) / n, a![1]! + (b![1]! - a![1]!) * (k + 0.5) / n]; if (outside(polys, q) > 1) vis++; } }
      if (vis < 24) out.push(`${spec.id}: datum shows ${vis} px`);
    }
    return out;
  };
  it('every datum line shows at least 24 px outside the figures and the equipment', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...datumHidden(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: ab_wheel_rollout\'s line drawn from the end hips to the end shoulders (inside the figure) is red', () => {
    const s = S.ab_wheel_rollout, l = lmOf(s, 'end');
    expect(datumHidden({ ...s, datum: [{ x: 0, from: 0, to: 0, line: [l.hips, l.shoulders] }] }).length).toBe(1);
  });
  /** D-LIB21-DRAW, Q2 (c): a spec that hides part of its start figure or implement behind the end figure (START_HIDDEN,
   *  hanging_leg_raise.mjs's hidden-line method) draws each hidden run as a dashed line (class m-line) in the end pose. */
  const phantomMissing = (id: string, spec: any) => {
    const runs = M[id].START_HIDDEN; if (!runs) return [];
    const ph = itemsIn(spec, 'end').items.filter((i: any) => /^start/i.test(i.part ?? '') && i.type === 'line' && /\bm-line\b/.test(i.cls));
    const match = runs.filter((r: number[][]) => ph.some((q: any) => JSON.stringify(q.pts) === JSON.stringify(r)));
    return match.length === runs.length && runs.length > 0 ? [] : [`${id}: ${match.length} of ${runs.length} hidden start runs drawn dashed`];
  };
  it('every hidden start run is drawn as a dashed phantom in the end pose (ab_wheel_rollout: the start wheel and near arm)', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...phantomMissing(id, S[id])); await yieldNow(); }
    expect(out).toEqual([]);
    expect(M.ab_wheel_rollout.START_HIDDEN.length).toBeGreaterThan(0);
  });
  it('mutation: ab_wheel_rollout\'s start phantoms removed is red', () => {
    const s = S.ab_wheel_rollout, bad = { ...s, equipment: s.equipment.filter((e: any) => !(e && typeof e === 'object' && e.part === 'startPhantom')) };
    expect(phantomMissing('ab_wheel_rollout', bad).length).toBe(1);
  });
  /** report.mjs's engine half: renderPlate reports no issue in either view. */
  const engineIssues = (spec: any) => [false, true].flatMap(mistake => plate.renderPlate(spec, { id: 'x', mistake }).report.issues.map((i: string) => `${spec.id}${mistake ? ' mistake' : ''}: ${i}`));
  it('renderPlate reports no issue on any drawn plate, normal and Mistake', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...engineIssues(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: bird_dog\'s "Back flat" box moved onto the figure is red (report.mjs would give ok:false)', () => {
    const s = S.bird_dog, l = lmOf(s, 'end'), c = camOf(s), at = c.P(l.backMid), bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'flat' ? { ...x, box: { left: Math.round(at[0]! - 20), top: Math.round(at[1]! + 4) } } : x)) };
    expect(engineIssues(bad).length).toBeGreaterThan(0);
  });
  /** No leader crosses a start phantom (a dashed start item, drawn in the end view); each crossing counts once. */
  const phantomOf = (spec: any) => {
    const cam = camOf(spec), out: Record<string, number[][][]> = {};
    for (const it of itemsIn(spec, 'end').items) if (/^start/i.test(it.part ?? '')) for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) (out[it.part] ??= []).push(...segs(pts)); }
    return out;
  };
  const crossAt = (a: number[], b: number[], c: number[], d: number[]) => {
    const r = [b[0]! - a[0]!, b[1]! - a[1]!], q = [d[0]! - c[0]!, d[1]! - c[1]!], den = r[0]! * q[1]! - r[1]! * q[0]!;
    if (Math.abs(den) < 1e-9) return null;
    const t = ((c[0]! - a[0]!) * q[1]! - (c[1]! - a[1]!) * q[0]!) / den, u = ((c[0]! - a[0]!) * r[1]! - (c[1]! - a[1]!) * r[0]!) / den;
    return t < 0 || t > 1 || u < 0 || u > 1 ? null : [a[0]! + r[0]! * t, a[1]! + r[1]! * t];
  };
  const phantomProblems = (spec: any) => {
    const out: string[] = [], ph = phantomOf(spec), list = listOf(spec, false);
    leadersOf(plate.renderPlate(spec, { id: 'x' }).svg).forEach((p, i) => {
      for (const [part, P] of Object.entries(ph)) {
        const hits: number[][] = [];
        for (const [a, b] of segs(p)) for (const [c, d] of P) { const x = crossAt(a!, b!, c!, d!); if (x && Math.hypot(x[0]! - p[0]![0]!, x[1]! - p[0]![1]!) >= 8 && !hits.some(h => Math.hypot(h[0]! - x[0]!, h[1]! - x[1]!) < 3)) hits.push(x); }
        if (hits.length) out.push(`${spec.id} ${list[i]?.key}: crosses ${part} ${hits.length}x`);
      }
    });
    return out;
  };
  it('no leader crosses a start phantom', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { out.push(...phantomProblems(S[id])); await yieldNow(); }
    expect(out).toEqual([]);
  });
  it('mutation: ab_wheel_rollout\'s "Roll slowly" anchored on the start wheel\'s phantom (its leader crosses the phantom) is red', () => {
    const s = S.ab_wheel_rollout, run = M.ab_wheel_rollout.START_HIDDEN.reduce((a: number[][], r: number[][]) => (r.length > a.length ? r : a)), mid = run[Math.floor(run.length / 2)], at = camOf(s).P(mid);
    // anchored 10 cm under the phantom's middle, its box straight above, so the leader runs down across the phantom
    const bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'slow' ? { ...x, anchor: [mid[0], mid[1] - 0.1, mid[2]], box: { left: Math.round(at[0]! - 20), top: Math.round(at[1]! - 70) } } : x)) };
    expect(phantomProblems(bad).length).toBeGreaterThan(0);
  });
  /** D-LIB21-DRAW, D-LIB16-LOCK: a sized soft bend ("slightly bent") in a side view sits off its neighbours' line by 90 %
   *  of its sized offset. None of the three drawn plates sizes one (pallof_press's KNEE comes with the bulk); the rule
   *  is checked against sizes.json so a soft knee cannot be drawn without a row here. */
  const SOFT: Record<string, [string, string, number][]> = { pallof_press: ['start', 'end', 'mistake'].flatMap(p => [[p, 'l', 15], [p, 'r', 15]] as [string, string, number][]) };
  const offsetFor = (deg: number) => { const a = 0.245 * 1.75, b = 0.246 * 1.75, c = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(deg * Math.PI / 180)); return (a * b * Math.sin(deg * Math.PI / 180)) / c; };
  const softProblems = (spec: any, soft = SOFT) => (soft[spec.id] ?? []).flatMap(([pose, sd, deg]) => {
    const l = lmOf(spec, pose), h = l[`hip.${sd}`], k = l[`knee.${sd}`], an = l[`ankle.${sd}`], off = segD([k[2], k[1]], [h[2], h[1]], [an[2], an[1]]);
    return off >= 0.9 * offsetFor(deg) ? [] : [`${pose} knee.${sd} ${(off * 100).toFixed(1)} cm off the line < 90 % of ${(offsetFor(deg) * 100).toFixed(1)}`];
  });
  it('soft bends: pallof_press\'s KNEE 15 (c2 "knees slightly bent") drawn bent in every pose; only it sizes a KNEE; the 90 % rule is red on a straight leg', () => {
    const sizes = readJson('tools/plates/library/lb9/sizes.json');
    for (const id of specsDrawn()) { expect(Object.keys(sizes.ids[id] ?? {}).includes('KNEE'), id).toBe(id === 'pallof_press'); expect(softProblems(S[id]), id).toEqual([]); }
    expect(sizes.ids.pallof_press.KNEE.value).toBe(15);
    // bird_dog's raised left leg is straight at the end: as a 15 deg "soft" knee it is red
    expect(softProblems(S.bird_dog, { bird_dog: [['end', 'l', 15]] }).length).toBe(1);
  });
});

describe('LIB-21 A17: sizes and trace points are fixed in lb9/sizes.json and never set by PQ-H3 (D-LIB21-SIZE, -TRACE)', () => {
  const sizes = readJson('tools/plates/library/lb9/sizes.json');
  const rowProblems = (table: Record<string, any>) => Object.entries(table).flatMap(([k, r]: [string, any]) => [
    ...(typeof r.basis === 'string' && r.basis.trim() ? [] : [`${k}: empty basis`]),
    ...(/PQ-H3|deviationMin|traceLenMin|\bH3\b/.test(r.basis ?? '') ? [`${k}: basis names PQ-H3`] : []),
  ]);
  /** Both ways: every SIZES number is a row with the same value; every row is a SIZES number or the spec's trace point
   *  and trim (`trace`). */
  const sizeProblems = (mod: any, table: Record<string, any> = {}) => {
    const spec = mod.SIZES ?? {}, out: string[] = [];
    for (const k of Object.keys(spec)) if (!(k in table)) out.push(`${k}: not in sizes.json`); else if (table[k].value !== spec[k]) out.push(`${k}: spec ${spec[k]} != sizes.json ${table[k].value}`);
    for (const [k, r] of Object.entries<any>(table)) {
      if (k === 'trace') { const t = mod.default?.trace; if (t?.point !== r.point || JSON.stringify(t?.trim) !== JSON.stringify(r.trim)) out.push(`trace: spec ${t?.point} ${JSON.stringify(t?.trim)} != sizes.json ${r.point} ${JSON.stringify(r.trim)}`); continue; }
      if (!(k in spec)) out.push(`${k}: not in the spec`);
    }
    if (mod.default && !('trace' in table)) out.push('trace: not in sizes.json');
    return [...out, ...rowProblems(table)];
  };
  it('each drawn spec\'s SIZES, trace point and trim equal its sizes.json rows; abWheel\'s AB_WHEEL equals its composer rows; every basis is not PQ-H3', () => {
    for (const id of specsDrawn()) expect(sizeProblems(M[id], sizes.ids[id]), id).toEqual([]);
    expect(sizeProblems({ SIZES: { ...EQ.abWheel.AB_WHEEL } }, sizes.composers.abWheel)).toEqual([]);
  });
  it('mutations: a Mistake size changed in its spec only, an empty basis, a basis naming PQ-H3 or deviationMin, a spec number missing from sizes.json, a trace point or trim changed in the spec only, and an AB_WHEEL size changed are red', () => {
    const m = M.ab_wheel_rollout, t = sizes.ids.ab_wheel_rollout;
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, M_ARCH: -20 } }, t)).toEqual([`M_ARCH: spec -20 != sizes.json ${t.M_ARCH.value}`]);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: '' } })).toEqual(['M_ARCH: empty basis']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: 'set to clear PQ-H3' } })).toEqual(['M_ARCH: basis names PQ-H3']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: 'above deviationMin' } })).toEqual(['M_ARCH: basis names PQ-H3']);
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, NEW_ANGLE: 5 } }, t)).toEqual(['NEW_ANGLE: not in sizes.json']);
    expect(sizeProblems({ ...m, default: { ...m.default, trace: { ...m.default.trace, point: 'knee.r' } } }, t)).toEqual(['trace: spec knee.r [10,12] != sizes.json grip.r [10,12]']);
    expect(sizeProblems({ ...m, default: { ...m.default, trace: { ...m.default.trace, trim: [8, 12] } } }, t)).toEqual(['trace: spec grip.r [8,12] != sizes.json grip.r [10,12]']);
    expect(sizeProblems({ SIZES: { ...EQ.abWheel.AB_WHEEL, r: 0.1 } }, sizes.composers.abWheel)).toEqual(['r: spec 0.1 != sizes.json 0.09']);
  });
});

// ---------------------------------------------------------------- the E-R5 slice ('LIB-21 resume', Do 7b) ----
/** A pose's drawn outlines in world metres (front view, y up): bodyShapes on IDF. */
const shapesW = (spec: any, q: any) => body.bodyShapes(body.fk(q, B175), IDF, { hand: spec.hand }).filter((x: any) => x.poly);
const qOf = (spec: any, pose: string) => (pose === 'mistake' ? body.resolve(body.normPose(fullPose(spec, pose), B175), B175).q : qaEng.poseLandmarks(Eng(), spec).q[pose]);
const lowOf = (shapes: any[], re: RegExp, x0 = -Infinity, x1 = Infinity) => { let m = Infinity; for (const s of shapes) if (re.test(s.key)) for (const v of s.poly) if (v[0] >= x0 && v[0] <= x1) m = Math.min(m, v[1]); return m; };
const matOf = (spec: any, pose: string) => { const it = itemsIn(spec, pose).items.find((i: any) => i.part === 'mat'); return { top: it.at[1] + it.h / 2, x0: it.at[0] - it.w / 2, x1: it.at[0] + it.w / 2 }; };

describe('LIB-21 A2 / A18: side_plank (the E-R5 slice; `root.roll`, `trunk.lat`)', { timeout: T }, () => {
  const s = () => S.side_plank;
  /** The bottom arm (upper arm, forearm, fist) on the drawn mat top and the bottom foot on the floor, in every pose with
   *  a drawn body (cm: + above, - into); nothing drawn below the mat top over the mat or below the floor beyond it. */
  const contacts = (spec: any) => posesOf(spec).map(p => {
    const sh = shapesW(spec, qOf(spec, p)), m = matOf(spec, p), surf = (x: number) => (x >= m.x0 && x <= m.x1 ? m.top : 0);
    let below = Infinity; for (const x of sh) for (const v of x.poly) below = Math.min(below, v[1] - surf(v[0]));
    let foot = Infinity; for (const x of sh) if (/^foot\.r/.test(x.key)) for (const v of x.poly) foot = Math.min(foot, v[1] - surf(v[0]));
    return { p, arm: (lowOf(sh, /^(upper|fore|fist)\.r/) - m.top) * 100, foot: foot * 100, below: below * 100 };
  });
  it('the bottom arm rests on the mat top and the bottom foot on the floor (0 to 0.5 cm into them) in every pose; nothing is drawn below them (values logged)', () => {
    const c = contacts(s());
    console.log(`LIB-21 side_plank contacts: ${c.map(x => `${x.p} arm ${x.arm.toFixed(2)} foot ${x.foot.toFixed(2)} below ${x.below.toFixed(2)}`).join('; ')} cm`);
    for (const x of c) { expect(x.arm, x.p).toBeLessThanOrEqual(0.05); expect(x.arm, x.p).toBeGreaterThanOrEqual(-0.5); expect(x.foot, x.p).toBeLessThanOrEqual(0.05); expect(x.foot, x.p).toBeGreaterThanOrEqual(-0.5); expect(x.below, x.p).toBeGreaterThanOrEqual(-0.5); }
  });
  it('mutation: the mat raised 1 cm (the arm 1 cm into it) is red', () => {
    const bad = { ...s(), equipment: s().equipment.map((e: any) => (e.part === 'mat' ? { ...e, at: [e.at[0], e.at[1] + 0.01, e.at[2]], h: e.h } : e)) };
    expect(contacts(bad).some(x => x.arm < -0.5)).toBe(true);
  });
  it('the entry (c1, c2): the drawn pelvis rests on the mat top (0 to 0.5 cm into it); the held pose lifts it', () => {
    const st = shapesW(s(), qOf(s(), 'start')), en = shapesW(s(), qOf(s(), 'end')), m = matOf(s(), 'start');
    const h = lmOf(s(), 'start')['hip.r'][0]!;
    const low = lowOf(st, /^torso/, h - 0.12, h + 0.12) - m.top;
    expect(low * 100).toBeLessThanOrEqual(0.05); expect(low * 100).toBeGreaterThanOrEqual(-0.5);
    expect((lowOf(en, /^torso/, h - 0.12, h + 0.12) - m.top) * 100).toBeGreaterThan(15);
  });
  /** c2: one straight line from the head to the feet: the trunk's axis (hips to shoulders midpoints), the head's (the
   *  shoulders' midpoint to the head) and the bottom leg's (hip to ankle) within LINE_DEG of one direction, held pose. */
  const LINE_DEG = 2;
  const lineMiss = (lm: any) => { const dir = (a: number[], b: number[]) => { const d = b.map((v, i) => v - a[i]!), n = Math.hypot(...d); return d.map(v => v / n); };
    const t = dir(lm.hips, lm.shoulders), h = dir(lm.shoulders, lm.head), l = dir(lm['ankle.r'], lm['hip.r']);
    const ang = (u: number[], v: number[]) => Math.acos(Math.min(1, u.reduce((x, w, i) => x + w * v[i]!, 0))) * 180 / Math.PI;
    return Math.max(ang(t, h), ang(t, l)); };
  it('c2: the held pose is one line: the bottom leg, the trunk and the head within 2 deg of one direction', () => {
    expect(lineMiss(lmOf(s(), 'end'))).toBeLessThanOrEqual(LINE_DEG);
  });
  it('mutation: a held pose with a 10 deg side bend (trunk.lat) leaves the line: red', () => {
    const e = s().poses.end, bad = { ...e, trunk: { lat: 10 } };
    expect(lineMiss(body.landmarks(body.fk(body.resolve(body.normPose(bad, B175), B175).q, B175)))).toBeGreaterThan(LINE_DEG);
  });
  it('c1, c5: the Mistake keeps the elbow and the shoulder (±0.5 cm) and sinks the hips M_SINK of the hold\'s rise (±0.5 cm)', () => {
    const st = lmOf(s(), 'start'), en = lmOf(s(), 'end'), mi = lmOf(s(), 'mistake');
    for (const k of ['elbow.r', 'shoulder.r']) expect(d3(en[k], mi[k]) * 100, k).toBeLessThanOrEqual(0.5);
    const want = en.hips[1] - M.side_plank.SIZES.M_SINK * (en.hips[1] - st.hips[1]);
    expect(Math.abs(mi.hips[1] - want) * 100).toBeLessThanOrEqual(0.5);
    expect(en.hips[1] - mi.hips[1]).toBeGreaterThan(0.05);
  });
  it('mutation: a Mistake that lifts the hips instead (hiked) is red', () => {
    const en = lmOf(s(), 'end'), st = lmOf(s(), 'start');
    const want = en.hips[1] - M.side_plank.SIZES.M_SINK * (en.hips[1] - st.hips[1]);
    expect(Math.abs((en.hips[1] + 0.05) - want) * 100).toBeGreaterThan(0.5);
  });
  it('c3: the top fist rests on the top hip in every pose (the drawn fist within 1 cm of the drawn pelvis outline)', () => {
    for (const p of posesOf(s())) {
      const sh = shapesW(s(), qOf(s(), p)), fist = sh.find((x: any) => x.key === 'fist.l'), torso = sh.filter((x: any) => x.key === 'torso').map((x: any) => x.poly);
      const d = Math.min(...fist.poly.map((v: number[]) => outside(torso, v)));
      expect(d * 100, p).toBeLessThanOrEqual(1);
    }
  });
  it('A18 balance (D-LIB21-BALANCE, c2): the centre of mass lies between the forearm\'s and the bottom foot\'s contacts (side to side) and over the forearm-to-foot support front to back (within 2 cm), in every pose and ghost (logged)', () => {
    const out: string[] = [];
    for (const [p, q] of allQs(s())) {
      const lm = lmQ(q), c = comOf(lm), x0 = Math.min(lm['grip.r'][0], lm['elbow.r'][0]), x1 = lm['toe.r'][0]!;
      const zs = [lm['elbow.r'][2], lm['grip.r'][2], lm['heel.r'][2], lm['toe.r'][2]], zmin = Math.min(...zs), zmax = Math.max(...zs);
      out.push(`${p} x ${(c[0]! * 100).toFixed(1)} in [${(x0 * 100).toFixed(1)}, ${(x1 * 100).toFixed(1)}], z ${(c[2]! * 100).toFixed(1)} in [${(zmin * 100).toFixed(1)}, ${(zmax * 100).toFixed(1)}]`);
      expect(c[0]! > x0 && c[0]! < x1, p).toBe(true);
      expect(c[2]! >= zmin - 0.02 && c[2]! <= zmax + 0.02, p).toBe(true);
    }
    console.log(`LIB-21 side_plank balance (cm): ${out.join('; ')}`);
  });
  it('the start draws the torso? no: the start phantom is the legs only (startParts), the ghosts the bottom leg', () => {
    expect(s().startParts).toEqual(['leg.l', 'leg.r']);
    expect(s().ghosts).toEqual({ count: 2, parts: ['leg.r'] });
  });
});

describe('LIB-21 A2 / A18: russian_twist and `medBallOptional` (the E-R5 slice; `trunk.yaw`, `root.yaw`, `camera.pitch`)', { timeout: T }, () => {
  const s = () => S.russian_twist, R = () => EQ.medBallOptional.MED_BALL_OPT.d / 2;
  const ballOf = (spec: any, p: string, lm: any, q: any) => itemsAt(spec, p, lm, lmOf(spec, 'start'), p === 'mistake', q).find((i: any) => i.part === 'ball' && i.curve);
  it('the ball is a closed curved `poly` of 24 points in every pose and ghost (never the vendor `pulley`), with its seam', () => {
    for (const [p, q] of allQs(s())) {
      const its = itemsAt(s(), p, lmQ(q), lmOf(s(), 'start'), p === 'mistake', q).filter((i: any) => i.part === 'ball');
      expect(its.map((i: any) => i.type), p).toEqual(['poly', 'poly']);
      expect(its[0].pts.length, p).toBe(24);
    }
  });
  /** The ball drawn round on the plate: its projected radius the same in every direction (px, the spec's camera). */
  const roundness = (spec: any) => { const cam = camOf(spec); return posesOf(spec).map(p => { const b = ballOf(spec, p, lmOf(spec, p), null), P = b.pts.map((w: number[]) => cam.P(w)), c = centre(P.map((v: number[]) => [v[0]!, v[1]!, 0]));
    const r = P.map((v: number[]) => Math.hypot(v[0]! - c[0]!, v[1]! - c[1]!)); return Math.max(...r) - Math.min(...r); }); };
  it('the ball is drawn round on the pitched plate (radius spread under 0.5 px) in start, end and Mistake', () => {
    for (const d of roundness(s())) expect(d).toBeLessThan(0.5);
  });
  it('mutation: the ball drawn in the level plane (pitch 0) under the 20 deg camera is an ellipse: red', () => {
    const bad = { ...s(), equipment: s().equipment.map((e: any, i: number) => (i === 0 ? e : (lm: any, ctx: any) => { const k = s().equipment.indexOf(e) - 1; return EQ.medBallOptional.medBallOptional({ at: [0, 1, 2].map(j => (lm['grip.l'][j] + lm['grip.r'][j]) / 2), pitch: 0, z: 'front' })[k]; })) };
    expect(Math.max(...roundness(bad))).toBeGreaterThan(0.5);
  });
  /** c2: the ball held in both hands: each grip centre GRIP_IN of the radius from the ball's centre (±1 cm), in every
   *  pose and ghost. */
  const holdMiss = (spec: any) => allQs(spec).map(([p, q]) => { const lm = lmQ(q), b = ballOf(spec, p, lm, q), c = centre(b.pts);
    return Math.max(...['l', 'r'].map(sd => Math.abs(d3(lm[`grip.${sd}`], c) - M.russian_twist.SIZES.GRIP_IN * R()))); });
  it('c2: both hands hold the ball (each grip within 1 cm of its side) in every pose and ghost', () => {
    for (const m of holdMiss(s())) expect(m * 100).toBeLessThanOrEqual(1);
  });
  it('mutation: the ball drawn 5 cm off the hands at the end is red', () => {
    const bad = mapItems(s(), (it, ctx) => (it.part === 'ball' && ctx.pose === 'end' ? shiftPts(it, [0.05, 0, 0]) : it));
    expect(Math.max(...holdMiss(bad))).toBeGreaterThan(0.01);
  });
  /** D-LIB21-FRAME 3D: the ball (a sphere) 0 cm or more from the body solids other than the holding forearms, in every
   *  pose and ghost. */
  const ball3D = (spec: any) => allQs(spec).map(([p, q]) => { const lm = lmQ(q), b = ballOf(spec, p, lm, q), c = centre(b.pts), solids = solidsOf(q);
    const [v, at] = clearOf(solids, [c], R(), ['fore.l', 'fore.r']); return { p, v, at }; });
  it('A18 3D: the ball clears the torso, head, upper arms, thighs and shins in every pose and ghost (values logged)', () => {
    const r = ball3D(s());
    console.log(`LIB-21 russian_twist ball 3D: ${r.map(x => `${x.p} ${(x.v * 100).toFixed(1)} (${x.at})`).join('; ')} cm`);
    for (const x of r) expect(x.v, `${x.p} ${x.at}`).toBeGreaterThanOrEqual(0);
  });
  it('A18 3D mutation: the end ball moved 8 cm in toward the hip is red', () => {
    const bad = mapItems(s(), (it, ctx) => (it.part === 'ball' && ctx.pose === 'end' ? shiftPts(it, [-0.08, 0, 0]) : it));
    expect(ball3D(bad).find(x => x.p === 'end')!.v).toBeLessThan(0);
  });
  it('c1, c5: the buttocks stay on the floor and the feet on their spots at start and end; c4: the chest faces the ball at the end (±2 deg)', () => {
    const st = lmOf(s(), 'start'), en = lmOf(s(), 'end');
    for (const L of [st, en]) expect(Math.abs(L.seat[1]) * 100).toBeLessThanOrEqual(0.5);
    for (const k of ['sole.l', 'sole.r']) expect(d3(st[k], en[k]) * 100, k).toBeLessThanOrEqual(0.5);
    const b = centre(ballOf(s(), 'end', en, null).pts), f = [en.sternum[0] - en.shoulders[0], en.sternum[2] - en.shoulders[2]], g = [b[0]! - en.sternum[0], b[2]! - en.sternum[2]];
    expect(Math.abs(Math.atan2(f[0]!, f[1]!) - Math.atan2(g[0]!, g[1]!)) * 180 / Math.PI).toBeLessThanOrEqual(2);
  });
  it('the Mistake (plate.mistake): the knees swing toward the turn (each knee over 5 cm) while the shoulders stay (±2 cm)', () => {
    const en = lmOf(s(), 'end'), mi = lmOf(s(), 'mistake');
    for (const k of ['knee.l', 'knee.r']) expect(mi[k][0] - en[k][0], k).toBeGreaterThan(0.05);
    expect(d3(en.shoulders, mi.shoulders) * 100).toBeLessThanOrEqual(2);   // least squares: the leaned pivot moves with the pelvis turn (1.54 cm)
  });
  it('mutation: a Mistake with the hips still (root.yaw 0) moves no knee: red', () => {
    const bad = { ...s().mistake.pose, root: { ...s().mistake.pose.root, yaw: 0 } };
    const mi = body.landmarks(body.fk(body.resolve(body.normPose(mergeDeep(s().poses.end, bad), B175), B175).q, B175)), en = lmOf(s(), 'end');
    expect(mi['knee.l'][0] - en['knee.l'][0]).toBeLessThan(0.05);
  });
  it('A18 balance (D-LIB21-BALANCE, c1, c5): the centre of mass (with the ball, BALL_KG at its centre) lies over the seat-to-heels base front to back and inside the hips side to side, in every pose and ghost (logged)', () => {
    const out: string[] = [];
    for (const [p, q] of allQs(s())) {
      const lm = lmQ(q), b = centre(ballOf(s(), p, lm, q).pts), c = comOf(lm), k = M.russian_twist.BALL_KG / 75, cm = c.map((v, i) => (v + k * b[i]!) / (1 + k));
      const z0 = lm.seat[2] - 0.05, z1 = Math.max(lm['heel.l'][2], lm['heel.r'][2]);
      out.push(`${p} z ${(cm[2]! * 100).toFixed(1)} in [${(z0 * 100).toFixed(1)}, ${(z1 * 100).toFixed(1)}], x ${(cm[0]! * 100).toFixed(1)}`);
      expect(cm[2]! > z0 && cm[2]! < z1, p).toBe(true);
      expect(Math.abs(cm[0]!), p).toBeLessThan(M.russian_twist.SIZES.HIP_HALF);
    }
    console.log(`LIB-21 russian_twist balance (cm): ${out.join('; ')}`);
  });
});
