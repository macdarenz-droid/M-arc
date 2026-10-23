// LIB-18 (lib-18-card Do 2, Do 4, Do 5, Do 6 a; acceptance A2, A3, A4, A5, A7, A9, A10, A11, A15, A16, A17, A18, A19;
// rulings D-LIB18-*): the LB8 H build-ahead plates. Node only: the browser half of the plate QA runs in
// tools/plates/library/lb8/qa.mjs. Patterns copied from tests/howto/lb7-plates.test.ts (#299 @ 5a9f004c). Every test
// reads what is drawn (the items a spec emits, the engine's landmarks, shapes and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { monitorEventLoopDelay } from 'node:perf_hooks';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

// D-LIB18-TESTS (VITEST-RPC; #299 6351689010, 6352726951): most tests here render plates synchronously, and vitest runs
// back-to-back synchronous tests without returning to the event loop, so the worker cannot answer its RPC. One
// macrotask after every test, one per spec in every loop over the specs, and generate and every whole-page render in an
// awaited child process (A19 pins all three).
afterEach(() => new Promise<void>(r => setImmediate(r)));
const tick = () => new Promise<void>(r => setImmediate(r));
// A19's recorded check: the longest event-loop block over the whole file, logged for each milestone post.
const loopDelay = monitorEventLoopDelay({ resolution: 20 });
loopDelay.enable();
afterAll(() => { loopDelay.disable(); console.log(`LIB-18 A19: longest event-loop block ${(loopDelay.max / 1e9).toFixed(2)} s`); });

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
// The 12 LB8 H ids this card draws, in plan order (plan 6.2 :753-755); seated_leg_curl is pilot B's plate (pB).
const LB8 = ['hack_squat', 'pendulum_squat', 'leg_extension', 'lying_leg_curl', 'standing_leg_curl', 'seated_calf_raise', 'standing_calf_raise',
  'bodyweight_calf_raise', 'hip_thrust', 'glute_bridge', 'cable_kickback', 'resisted_hip_flexion'];
const IDS = LB8.map(i => `lib_${i}`);
// The LB8 id not in this card (lib-18-card "LB8 ids").
const NOT_HERE = ['seated_leg_curl'];
// D-LIB18-LEGCURL: drawn only after pilot B is on main and 'LIB-18 resume'.
const LEGCURLS = ['lying_leg_curl', 'standing_leg_curl'];
// DESIGN.md section 15: every held id, with its ruling there.
const HELD = ['leg_extension', 'seated_calf_raise', 'standing_calf_raise', 'bodyweight_calf_raise', 'hip_thrust', 'glute_bridge', 'cable_kickback', 'resisted_hip_flexion'];
// The ids on lb8/rows.json now: drawn and not held (A5).
const ON_ROWS = ['hack_squat'];
// Card facts the held plates' drawings miss (CARD FIELDS fix round, #306 6356303497): recorded with their holds, never hidden.
const FACT_MISSES: Record<string, string[]> = { seated_calf_raise: ['check:start:toe.l:4.2cm', 'check:start:toe.r:4.2cm'], standing_calf_raise: ['check:start:toe.l:2.3cm', 'check:start:toe.r:2.3cm'], bodyweight_calf_raise: ['check:end:toe.l:4.6cm', 'check:end:toe.r:4.6cm'], hip_thrust: ['check:start:seat:4.7cm'] };
// Checks inside PQ-H6's 1 cm but past A2's 0.5 cm, or a back landmark under 1 cm into the floor (no engine issue):
// glute_bridge's tuck at the ruled 25° ceiling (DESIGN.md section 15), recorded with its hold, never hidden.
const NEAR_MISSES: Record<string, string[]> = { glute_bridge: ['check:start:sacrum:0.7cm', 'above:start:backMid:-0.2cm'] };
const H6_MISSES: Record<string, string[]> = { seated_calf_raise: ['H6.fact:5:contact:toe.l', 'H6.fact:6:contact:toe.r'], standing_calf_raise: ['H6.fact:2:contact:toe.l', 'H6.fact:3:contact:toe.r'], bodyweight_calf_raise: ['H6.fact:4:contact:toe.l', 'H6.fact:5:contact:toe.r'], hip_thrust: ['H6.fact:0:contact:seat'] };
// Every spec drawn now (the slice), held or not, in plan order.
const DRAWN_NOW = ['hack_squat', 'leg_extension', 'seated_calf_raise', 'standing_calf_raise', 'bodyweight_calf_raise', 'hip_thrust', 'glute_bridge', 'cable_kickback', 'resisted_hip_flexion'];
const ROWS = 'tools/plates/library/lb8/rows.json';
const RESEARCH_HEAD = '596dbe0748f11d13b431ee11d38d1742771925f1';
const COMPOSERS = ['hackSled', 'pendulum', 'legExtMachine', 'calfMachine', 'ankleCuff'];
// Each composer's exported size constants (A17).
const CONSTS: Record<string, string> = { hackSled: 'HACK_SLED', pendulum: 'PENDULUM', legExtMachine: 'LEG_EXT_MACHINE', calfMachine: 'CALF_MACHINE', ankleCuff: 'CUFF' };
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, markup: any;
const M: Record<string, any> = {}, S: Record<string, any> = {}, CQ: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, markup] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'qa/markup.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const c of COMPOSERS.filter(c => existsSync(`tools/plates/library/eq/${c}.mjs`))) CQ[c] = await import(/* @vite-ignore */ lib(`eq/${c}.mjs`));
  for (const id of DRAWN_NOW) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
}, T);

const pins = () => qaIdx.loadPins();
const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const posesOf = (spec: any) => ['start', 'end', ...(spec.mistake?.pose ? ['mistake'] : [])];
/** Every equipment item a spec draws in one pose (functions called as the engine calls them). */
const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
  const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
  const ctx = { pose, start: L.lm.start, mistake, body: L.body };
  const out: any[] = [];
  spec.equipment.forEach((e: any, i: number) => {
    for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
  });
  return { items: out, lm };
};
const lmOf = (spec: any, pose: string) => qaEng.poseLandmarks(Eng(), spec).lm[pose];
const h9 = (spec: any) => {
  let R: any = null;
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins().envelope }, R).map((p: any) => p.key);
};
const rep = (spec: any) => plate.renderPlate(spec, { id: 'x' }).report;
/** The engine's camera for a spec (front or side view), plate px. */
const camOf = (spec: any) => {
  const c = rep(spec).camera, side = spec.view === 'side';
  return { view: side ? 'side' : 'front', near: side ? 'r' : null, facing: 'right', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + (side ? w[2]! : w[0]!) * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
};
const fullPose = (spec: any, pose: string) => (pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose]);
/** The solid figure's shapes (plate px) in one pose, as the engine draws them. */
const shapesIn = (spec: any, pose: string) => {
  const b = { height: 1.75 };
  return body.bodyShapes(body.fk(body.resolve(body.normPose(fullPose(spec, pose), b), b).q, b), camOf(spec), { armsFront: spec.armsFront, hand: spec.hand }).filter((x: any) => x.poly);
};
/** The ids whose spec exists and that are not held, in LB8 order (the rows.json set, A5). */
// The drawn set is DRAWN_NOW (in plan order); a test below pins it to the LB8 spec files on disk.
const drawn = () => DRAWN_NOW.filter(id => !HELD.includes(id));
const specsDrawn = () => DRAWN_NOW;
const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
/** Signed distance (px) of p from a set of closed outlines: negative inside. */
const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
/** The labels whose leaders a render draws, in svg order: the measure arc's leader (in the accent layer) comes first. */
const listOf = (spec: any, mistake: boolean) => (mistake ? spec.mistake.tells : [...(spec.measure ? [{ key: '_arc' }] : []), ...spec.callouts]);
/** Every leader in a render as its polyline (plate px), starting at its anchor. */
const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
/** How often a leader enters the figure polygons away from its first 8 px at the anchor, and its drawn length (px). */
const entryOf = (polys: number[][][], p: number[][]) => {
  let entries = 0, was = false, len = 0;
  for (const [a, b] of segs(p)) {
    len += Math.hypot(b![0]! - a![0]!, b![1]! - a![1]!);
    for (let k = 0; k <= 40; k++) {
      const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40], inn = Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8 && outside(polys, q) < 0;
      if (inn && !was) entries++;
      was = inn;
    }
  }
  return { entries, len };
};
const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((s, x, i) => s + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });


describe('LIB-18 A5: lb8/rows.json holds exactly the drawn, non-held LB8 H ids, all mode H', () => {
  it('the LB8 spec files on disk are exactly DRAWN_NOW, in plan order', () => {
    expect(LB8.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`))).toEqual(DRAWN_NOW);
  });
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn, non-held id exactly once in the raw text, nothing else, every mode H', () => {
    expect(want()).toEqual(ON_ROWS.map(i => `lib_${i}`));
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('seated_leg_curl (pilot B\'s plate) is in no lb8/ file, and the two leg curls are in no rows file before their spec exists', () => {
    for (const f of readdirSync('tools/plates/library/lb8').filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join('tools/plates/library/lb8', f), 'utf8');
      for (const id of NOT_HERE) expect(/seated_leg_curl|seated-leg-curl/.test(text), `${f}: ${id}`).toBe(false);
    }
    for (const id of LEGCURLS) if (!existsSync(`tools/plates/library/specs/${id}.mjs`)) expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file', () => {
    const design = readFileSync('tools/plates/library/lb8/DESIGN.md', 'utf8');
    expect(design).toContain('## 15. Held ids');
    const table = design.split('## 15. Held ids')[1]!.split('\n## ')[0]!;
    for (const id of HELD) {
      expect(table.split('\n').some(l => l.startsWith(`| ${id} |`) && /D-LIB8-shrug|D-LIB18-CALF|D-LIB8M-CARDTRUE/.test(l)), id).toBe(true);
      for (const f of reg.batchFiles()) expect(readFileSync(f, 'utf8').includes(`lib_${id}`), `${f}: ${id}`).toBe(false);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
    }
  });
  it('mutations: a dropped row, a duplicated row, a held id, seated_leg_curl and lying_leg_curl added, and one mode set to D are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const w = want(), j = { batch: 'LB8', rows: Object.fromEntries(w.map(id => [id, row])) };
    const text = JSON.stringify(j, null, 1), add = (id: string) => JSON.stringify({ ...j, rows: { ...j.rows, [id]: row } }, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: Object.fromEntries(w.slice(1).map(id => [id, row])) }, null, 1), w)).toEqual([`${w[0]} x0`]);
    const dup = text.replace(`  "${w[0]}": {`, `  "${w[0]}": ${JSON.stringify(row)},\n  "${w[0]}": {`);
    expect(a5(dup, w)).toEqual([`${w[0]} x2`]);
    expect(a5(add(`lib_${HELD[0]}`), w), 'a held id').toEqual([`extra lib_${HELD[0]}`]);
    expect(a5(add('lib_seated_leg_curl'), w)).toEqual(['extra lib_seated_leg_curl']);
    expect(a5(add('lib_lying_leg_curl'), w), 'lying_leg_curl with no spec').toEqual(['extra lib_lying_leg_curl']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, [w[0]!]: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['mode D']);
  });
  it('every row points at its own spec file and carries the census view; batch LB8, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view, id).toBe('side');
      expect(readJson(`docs/research/howto/cards/${id.slice(4)}.json`).plate.view, id).toBe(r.view);
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB8', censusRef: '4a9fd86' });
  });
  it('the build\'s held list is this test\'s, each with its census view (side)', async () => {
    const build = await import(/* @vite-ignore */ lib('lb8/build.mjs'));
    expect(build.HELD).toEqual(Object.fromEntries(HELD.map(id => [id, 'side'])));
  });
});


describe('LIB-18 A9: nothing ships (D-LIB18-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/hack_squat.mjs', slug: 'hack-squat', prefix: 'hack-squat', chromeId: 'hack-squat', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB8 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_hack_squat: { ...someRow, stage: 'shipped' } })).toEqual(['lib_hack_squat: shipped']);
    expect(stageProblems({ ...rows, lib_hack_squat: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_hack_squat: approved-plate']);
  });
  it('none of the 12 is shipped, even with lb8/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
    expect(reg.shippedIds().filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  /** An id or its slug as a whole token in a file's name or text (the card's matcher). */
  const tokenHits = (ids: string[], name: string, text: string) => ids.flatMap(id => {
    const slug = id.replace(/_/g, '-'), s = `${name}\n${text}`, out: string[] = [];
    if (new RegExp(`\\b(lib_)?${id}\\b`).test(s)) out.push(`${name}: ${id}`);
    if (new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(s)) out.push(`${name}: ${slug}`);
    return out;
  });
  const substringHits = (ids: string[], name: string, text: string) => ids.filter(id => `${name}\n${text}`.includes(id)).map(id => `${name}: ${id}`);
  const batchProblems = (files: [string, string][], hits = tokenHits) => files.flatMap(([f, text]) => [
    ...(/lb8/i.test(f) ? [`${f}: an LB8 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB8"/.test(text) ? [`${f}: names batch LB8`] : []),
    ...hits(LB8, f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB8 H id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB8 H id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB8 H id, a page-only lb8.json and hip-thrust.layers.html are red', () => {
    expect(batchProblems([['zz.json', readFileSync(ROWS, 'utf8')]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_glute_bridge"}']])).toEqual(['x.json: glute_bridge']);
    expect(batchProblems([['lb8.json', '{"entries":[{"kind":"page","batch":"LB8"}]}']]).length).toBe(2);
    expect(batchProblems([['hip-thrust.layers.html', '<div data-id="hip-thrust"></div>']])).toEqual(['hip-thrust.layers.html: hip-thrust']);
  });
  it('the matcher is exact: it matches neither lib_hip_thrust_v2 nor single-leg-hip-thrust; mutation: a plain substring test is red on the _v2 control', () => {
    expect(tokenHits(LB8, 'p.json', '{"rows":{"lib_hip_thrust_v2":{}}}')).toEqual([]);
    expect(tokenHits(LB8, 'p.json', '{"slug":"single-leg-hip-thrust"}')).toEqual([]);
    expect(batchProblems([['p.json', '{"rows":{"lib_hip_thrust_v2":{}}}']], substringHits)).toEqual(['p.json: hip_thrust']);
  });
  it('control: a file naming only lib_seated_leg_curl (LB8, not in this card) and lib_leg_press_calf_raise (LB1) stays green', () => {
    expect(tokenHits(LB8, 'p.json', '{"rows":{"lib_seated_leg_curl":{},"lib_leg_press_calf_raise":{}}}')).toEqual([]);
    expect(tokenHits(LB8, 'p.json', '{"rows":{"lib_cable_kickback":{}}}')).toEqual(['p.json: cable_kickback']);
  });
  it('over src/data/exercises.json, no real id other than its own contains one of the 12 as a substring', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    expect(ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))))).toEqual([]);
    for (const id of IDS) expect(ex, id).toContain(id);
  });
  it('no LB8 spec, composer, How-to, script or test imports anything under hands/, fidelity/, ci/ or tests/howto/fixtures/', () => {
    const files = [...specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`), ...COMPOSERS.map(c => `tools/plates/library/eq/${c}.mjs`).filter(f => existsSync(f)),
      ...specsDrawn().map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb8/build.mjs', 'tools/plates/library/lb8/qa.mjs', 'tests/howto/lb8-plates.test.ts'];
    const bad = (f: string) => [...readFileSync(f, 'utf8').matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map(m => join(f, '..', m[1]!)).filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\/|^tests\/howto\/fixtures\//.test(p));
    for (const f of files) expect(bad(f), f).toEqual([]);
  });
  it('generate --check is green, and no generated file is read from lb8/, the LB8 specs, composers or How-to sources', async () => {
    // In a child process, awaited (VITEST-RPC ruling A, #276): an in-process render blocks the worker past vitest's 60 s
    // RPC limit on a loaded runner. The child prints the diff and, per output, whether it names an LB8 path.
    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});
const ids = ${JSON.stringify(LB8)}, out = await gen.render(), bad = [];
for (const [p, { text }] of out) { if (/library\\/lb8\\/|eq\\/(hackSled|pendulum|legExtMachine|calfMachine|ankleCuff)\\.mjs/.test(text)) bad.push(p + ': lb8/ or an LB8 composer');
  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\b').test(text)) bad.push(p + ': ' + id); }
console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;
    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    const r = JSON.parse(stdout.trim().split('\n').pop()!);
    console.log(`LIB-18 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);
    expect(r.n).toBeGreaterThan(0);
    expect(r.diff).toEqual([]);
    expect(r.bad).toEqual([]);
  });
});

describe('LIB-18 A11 (Do 6 a): the 12 cards and quotes are byte copies of the LB8 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb8/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 12 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB8);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB8);
    for (const id of LB8) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('hip_thrust'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.hip_thrust);
  });
  it('seated_leg_curl\'s card and quotes are not copied here (pilot B\'s)', () => {
    expect(Object.keys(cardsSha.cards)).not.toContain('seated_leg_curl');
  });
  it('the How-to source of each drawn LB8 H id holds only its id and research card (D-LIB9a-HOWTOID); none for an id not drawn', async () => {
    for (const id of LB8) {
      const f = `tools/plates/library/howto/lib_${id}.howto.mjs`;
      expect(existsSync(f), id).toBe(existsSync(`tools/plates/library/specs/${id}.mjs`));
      if (!existsSync(f)) continue;
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
  it('research/validate.mjs validateCardFile: no problem on any of the 12 cards', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    for (const id of LB8) expect(v.validateCardFile(`${id}.json`), id).toEqual([]);
  });
  it('A11 mutation: a tempo key added to one card without its plateFacts is red in validateCardFile', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    const dir = mkdtempSync(join(tmpdir(), 'lb8-val-'));
    try {
      for (const d of ['cards', 'quotes']) cpSync(`docs/research/howto/${d}`, join(dir, 'docs/research/howto', d), { recursive: true });
      const p = join(dir, 'docs/research/howto/cards', 'lying_leg_curl.json'), c = JSON.parse(readFileSync(p, 'utf8'));
      c.tempo = [{ phase: 'Curl', s: 1, move: true }]; writeFileSync(p, JSON.stringify(c, null, 2));
      expect(v.validateCardFile('lying_leg_curl.json', dir).length).toBeGreaterThan(0);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-18 A2 / Do 4: the LB8 composers and the drawn plates draw PRIMITIVES only', { timeout: T }, () => {
  it('the composer source imports no file reader and nothing under tools/plates/layers/', () => {
    for (const c of Object.keys(CQ)) {
      const src = readFileSync(`tools/plates/library/eq/${c}.mjs`, 'utf8');
      expect(src, c).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, c).not.toMatch(/layers\//);
    }
  });
  it('every item the drawn specs draw is a PRIMITIVES type, in every drawn pose', async () => {
    expect(specsDrawn()).toEqual(DRAWN_NOW);
    for (const id of specsDrawn()) { await tick(); for (const pose of posesOf(S[id]))
      for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type); }
  });
  it('the drawn specs pass PQ-H9', async () => {
    for (const id of specsDrawn()) { await tick(); expect(h9(S[id]), id).toEqual([]); }
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.hack_squat;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the drawn specs with no engine issue and every check and contact within 0.5 cm, but the held plates\' recorded fact misses', async () => {
    for (const id of specsDrawn()) { await tick();
      for (const mistake of [false, true]) expect(plate.renderPlate(S[id], { id: 'x', mistake }).report.issues ?? [], `${id} ${mistake}`).toEqual(FACT_MISSES[id] ?? []);
      const r = rep(S[id]);
      for (const c of r.checks) if ('cm' in c && ![...(FACT_MISSES[id] ?? []), ...(NEAR_MISSES[id] ?? [])].includes(`check:${c.pose}:${c.landmark}:${c.cm}cm`)) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
      for (const c of r.checks) if ('aboveCm' in c && !(NEAR_MISSES[id] ?? []).includes(`above:${c.pose}:${c.landmark}:${c.aboveCm}cm`)) expect(c.aboveCm, `${id} ${c.landmark} ${c.pose}`).toBeGreaterThanOrEqual(0);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});


describe('LIB-18 Mistakes, tells, cues and callouts (DESIGN.md sections 9-10)', { timeout: T }, () => {
  // DESIGN.md section 9: the drawn key per id (the first tell's) and the one-tell ids with their records.
  const KEYS: Record<string, string> = { hack_squat: 'lift', pendulum_squat: 'heels', leg_extension: 'arch', lying_leg_curl: 'arch', standing_leg_curl: 'arch',
    seated_calf_raise: 'range', standing_calf_raise: 'lock', bodyweight_calf_raise: 'part', hip_thrust: 'arch', glute_bridge: 'arch', cable_kickback: 'arch',
    resisted_hip_flexion: 'lean' };
  const ONE_TELL = ['pendulum_squat', 'lying_leg_curl', 'standing_leg_curl', 'seated_calf_raise', 'standing_calf_raise', 'bodyweight_calf_raise', 'glute_bridge', 'cable_kickback'];
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each drawn plate draws its Mistake with 2-3 tells (or one, with its record in DESIGN.md), the first carrying the proposed key', () => {
    const design = readFileSync('tools/plates/library/lb8/DESIGN.md', 'utf8');
    for (const id of specsDrawn()) {
      expect(keyProblems(S[id])).toEqual([]);
      const n = S[id].mistake.tells.length;
      expect(ONE_TELL.includes(id) ? n === 1 : n >= 2 && n <= 3, `${id} ${n}`).toBe(true);
      if (n === 1) expect(design.includes(`**One-tell record** (${id}`), `${id}: one-tell record`).toBe(true);
    }
  });
  it('mutations: the first tell key swapped, and a one-tell spec with no DESIGN.md record, are red', () => {
    const s = S.hack_squat;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['hack_squat: first tell round']);
    expect(readFileSync('tools/plates/library/lb8/DESIGN.md', 'utf8').includes('**One-tell record** (hack_squat')).toBe(false);
  });
  const guideProblems = (spec: any) => (spec.mistake.guides ?? []).filter((g: any) => !['dashed', 'arrow', 'arc-arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('A15: every Mistake guide is dashed or an arrow; mutation: a solid line guide is red', () => {
    for (const id of specsDrawn()) expect(guideProblems(S[id])).toEqual([]);
    const s = S.hack_squat, g0 = s.mistake.guides.find((g: any) => g.pts);
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: g0.pts }] } })).toEqual(['hack_squat: line']);
  });
  /** Q-D5-6 cue table: every callout and tell cue is one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('A15 cue table: every cue is one sentence of 15 words or fewer; mutation: a 16-word cue is red', () => {
    for (const id of specsDrawn()) expect(cueProblems(S[id]), id).toEqual([]);
    const s = S.hack_squat;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Keep your hips and your whole back pressed firmly into the pad on every single rep.' }, ...s.callouts.slice(1)] })).toEqual(['back: 16 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', async () => {
    for (const id of specsDrawn()) { await tick();
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
  /** Each callout's and tell's anchor sits on an item drawn in its pose: within 3 px of the solid figure's outline in
   *  that pose or inside it, of a Mistake guide, of an equipment outline, of a cable or of the datum. */
  const anchorProblems = (spec: any) => {
    const r = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    const lms = qaEng.poseLandmarks(Eng(), spec).lm, cam = camOf(spec), out: string[] = [];
    const guides = (spec.mistake.guides ?? []).filter((g: any) => g.pts).map((g: any) => g.pts.map((p: any) => (Array.isArray(p) && p.length === 3 ? cam.P(p) : null)).filter(Boolean));
    for (const [mode, list] of [['normal', spec.callouts], ['mistake', spec.mistake.tells]] as const) for (const c of list) {
      const named = typeof c.anchor === 'string' && c.anchor.includes(':') ? c.anchor.split(':')[0] : c.anchor?.pose;
      const pose = named ?? (mode === 'mistake' ? 'mistake' : 'end');
      const at = qaEng.resolvePoint(c.anchor, pose, lms, qaEng.cameraOf(spec, r.normal.report));
      const polys = [...shapesIn(spec, pose).map((x: any) => x.poly), ...drawnPolys(spec, pose)];
      const svg = r[mode].svg, lines = [...svg.matchAll(/<path class="(?:eq-cable|datum)[^"]*" d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      const dGuide = Math.min(Infinity, ...guides.flatMap((g: number[][]) => segs(g).map(([p, q]) => segD(at, p!, q!))), ...lines.map(([p, q]) => segD(at, p!, q!)));
      if (!(outside(polys, at) <= 3 || dGuide <= 3)) out.push(`${spec.id} ${c.key}: anchor ${Math.min(Math.abs(outside(polys, at)), dGuide).toFixed(1)} px from any drawn item`);
    }
    return out;
  };
  const drawnPolys = (spec: any, pose: string) => { const cam = camOf(spec), out: number[][][] = []; for (const it of itemsIn(spec, pose).items) for (const p of eng.PRIMITIVES[it.type](it, cam)) if (p.poly) out.push(p.poly); return out; };
  it('A15: every callout and tell anchor sits on an item drawn in its pose (within 3 px)', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { await tick(); out.push(...anchorProblems(S[id])); }
    expect(out).toEqual([]);
  });
  it('mutation: one tell\'s anchor moved to a point with no drawn item is red', () => {
    const s = S.hack_squat, tells = [{ ...s.mistake.tells[0], anchor: [0, 2.3, 0.9] }, ...s.mistake.tells.slice(1)];
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells } }).length).toBe(1);
  });
});


describe('LIB-18 A15: Mistake clearance, leaders, the floor and bent arms', { timeout: T }, () => {
  /** 13.1, 13.4 must-fix 1: every solid red part (a Mistake arrow, as drawn in the Mistake svg) clears the solid end
   *  figure by at least 6 px; the Mistake figure and the other guides are dashed. */
  const clearance = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
      const pts = xy(m[1]!), samp: number[][] = [];
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      return min >= 6 ? [] : [`${spec.id}: arrow ${min.toFixed(1)} px from the end figure`];
    });
  };
  it('every drawn plate: no solid red part comes within 6 px of the solid end figure', async () => {
    for (const id of specsDrawn()) { await tick(); expect(clearance(S[id]), id).toEqual([]); }
  });
  it('mutation: an arrow from the end knee to the Mistake knee on hack_squat (inside the figure\'s 6 px clearance) is red', () => {
    const s = S.hack_squat, guides = [...s.mistake.guides, { kind: 'arrow', from: { at: 'buttock', pose: 'end' }, to: { at: 'buttock', pose: 'mistake' } }];
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });
  /** The lines a leader must keep 6 px from (plate px; Do 7): the Trace, every cable (the column's and the dashed
   *  Mistake cable), and every equipment outline: pads, seats, platforms, rails, the bench and the bar (every item but
   *  the floor and the dashed phantoms), away from the leader's first 8 px at its anchor. */
  const avoidOf = (spec: any, mistake: boolean, svg: string) => {
    const cam = camOf(spec), out: number[][][] = [];
    for (const m of svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)) out.push(...segs(xy(m[1]!)));
    for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items) {
      if (it.type === 'floor' || /m-line/.test(it.cls ?? '') || it.part === 'phantom') continue;
      for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) out.push(...segs([...pts, pts[0]])); }
    }
    return out;
  };
  /** Each leader's nearest approach (px) to the avoid lines, by `<mode> <key>`. */
  const gaps = (spec: any) => {
    const out: Record<string, number> = {};
    for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg, list = listOf(spec, mistake), avoid = avoidOf(spec, mistake, svg);
      leadersOf(svg).forEach((p, i) => {
        let min = Infinity;
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) min = Math.min(min, segD(q, g[0]!, g[1]!));
        }
        out[`${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`] = min;
      });
    }
    return out;
  };
  // Named-nit candidates posted for a ruling (D-LIB15-NIT1; #290 6351401878): no placement clears them without breaking
  // another rule (the scan is in DESIGN.md). Every other leader must clear 6 px.
  const NITS: Record<string, string[]> = { hack_squat: ['normal soft'], hip_thrust: ['normal crease', 'mistake arch'], leg_extension: ['normal back'] };   // leg_extension's "Back on pad" crosses the pad once (D-LIB18-BACKPAD's allowed named nit)
  const gapProblems = (spec: any) => Object.entries(gaps(spec)).filter(([k, v]) => v < 6 && !(NITS[spec.id] ?? []).includes(k)).map(([k, v]) => `${spec.id} ${k}: ${v.toFixed(1)} px`);
  it('no leader comes within 6 px of the Trace, a cable, a pad, a seat, a platform, a rail, the bench or the bar (away from its first 8 px), but the named-nit candidates', async () => {
    for (const id of specsDrawn()) { await tick(); expect(gapProblems(S[id]), id).toEqual([]); }
  });
  it('mutation: hack_squat\'s "Back on pad" box moved behind the back pad (its leader across the pad and rails) is red', () => {
    const s = S.hack_squat, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'back' ? { ...x, box: { left: 12, top: 200 } } : x)) };
    expect(gapProblems(bad).length).toBeGreaterThan(0);
  });
  /** No leader runs across a figure: away from its first 8 px at the anchor, a normal leader stays outside the solid end
   *  figure, and a Mistake leader outside both the end figure and the Mistake-pose figure (#297 6348852288 item 1). */
  const crossProblems = (spec: any) => {
    const out: string[] = [];
    for (const mistake of [false, true]) {
      const polys = [...shapesIn(spec, 'end'), ...(mistake ? shapesIn(spec, 'mistake') : [])].map((x: any) => x.poly), list = listOf(spec, mistake);
      leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
        const tag = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`, { entries, len } = entryOf(polys, p);
        // D-LIB18-LIFT: a Mistake leader may enter the figure once, at most 81.9 px long (equipment: the gap test above)
        const lift = mistake && entries === 1 && len <= 81.9;
        if (entries && !lift && !(CROSS_NITS[spec.id] ?? []).includes(tag)) out.push(`${spec.id} ${tag}: crosses the figure`);
      });
    }
    return out;
  };
  // Named-nit candidates (D-LIB15-NIT1, posted with their scans): hip_thrust's knee arc sits in the closed angle under
  // the thigh, and every short leader from it crosses the thigh (the clean boxes need leaders over 130 px, past F3).
  const CROSS_NITS: Record<string, string[]> = { hip_thrust: ['normal _arc'], hack_squat: ['normal back'], resisted_hip_flexion: ['normal back'] };   // the normal back callouts: D-LIB18-BACKPAD's sacrum or lumbar contour reached only through the figure (scans in DESIGN.md)
  it('no leader crosses the solid figure\'s outline, nor a Mistake leader the Mistake figure\'s, but the named-nit candidates', async () => {
    const out: string[] = [];
    for (const id of specsDrawn()) { await tick(); out.push(...crossProblems(S[id])); }
    expect(out).toEqual([]);
  });
  it('mutation: hack_squat\'s "Hips off pad" box moved far above the figure (a Mistake leader past 81.9 px through the figure) is red', () => {
    const s = S.hack_squat, bad = { ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((x: any) => (x.key === 'lift' ? { ...x, box: { left: 252, top: 40 } } : x)) } };
    expect(crossProblems(bad)).toContain('hack_squat mistake lift: crosses the figure');
  });
  it('mutation: hack_squat\'s "Thighs to parallel" box placed under the seat side of the figure, so its leader crosses the body, is red', () => {
    const s = S.hack_squat, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'parallel' ? { ...x, box: { left: 60, top: 150 } } : x)) };
    expect(crossProblems(bad)).toContain('hack_squat normal parallel: crosses the figure');
  });
  /** Every drawn foot (heel, ball and toe: the engine's whole foot outline) on or above the floor line (0.5 px) in every
   *  pose (6341498444 item 1; A18). */
  const floorProblems = (spec: any) => posesOf(spec).flatMap(pose => {
    const cam = camOf(spec), fy = cam.P([0, 0, 0])[1], out: string[] = [];
    for (const x of shapesIn(spec, pose).filter((x: any) => /^foot\./.test(x.key))) { const low = Math.max(...x.poly.map((p: number[]) => p[1]!)); if (low - fy > 0.5) out.push(`${pose}: ${x.key} ${(low - fy).toFixed(1)} px under the floor`); }
    return out;
  });
  it('no foot through the floor in every drawn pose', async () => {
    for (const id of specsDrawn()) { await tick(); expect(floorProblems(S[id]), id).toEqual([]); }
  });
  it('mutation: one heel 1 px below the floor line (cable_kickback\'s standing foot pitched heel-down about the ball) is red', () => {
    const s = S.cable_kickback, st = s.poses.start, a = 1.6 * Math.PI / 180, l = lmOf(s, 'start');
    const plant = { ...st.plant, l: { at: l['ball.l'], ref: 'ball', toe: [0, Math.sin(a), Math.cos(a)], normal: [0, Math.cos(a), -Math.sin(a)] } };
    const bad = floorProblems({ ...s, poses: { ...s.poses, start: { ...st, plant } } });
    expect(bad).toEqual([expect.stringMatching(/^start: foot\.l \d\.\d px under the floor$/)]);
  });
  /** F3 and F4: the longest leader inside the 8's range and 2-6 hand-placed labels (qa/envelope.json). */
  const leaderMax = (spec: any) => Math.max(...[false, true].flatMap(mistake => [...plate.renderPlate(spec, { id: 'x', mistake }).svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(m => {
    let x = 0, y = 0, t = 0;
    for (const c of m[1]!.matchAll(/([MLH])(-?[\d.]+)(?:[ ,](-?[\d.]+))?/g)) { const nx = +c[2]!, ny = c[1] === 'H' ? y : +c[3]!; if (c[1] !== 'M') t += Math.hypot(nx - x, ny - y); x = nx; y = ny; }
    return t;
  })));
  it('F3 and F4 measured on every drawn plate (posted; any value outside the 8\'s range is a flag for the ruling, never dodged)', async () => {
    for (const id of specsDrawn()) { await tick();
      const n = [...S[id].callouts, ...S[id].mistake.tells, ...(S[id].measure ? [S[id].measure] : [])].filter((c: any) => c.box).length;
      console.log(`LIB-18 F3/F4 ${id}: longest leader ${leaderMax(S[id]).toFixed(1)} px, boxed ${n}`);
      expect(Number.isFinite(leaderMax(S[id]))).toBe(true);
    }
  });
});

describe('LIB-18 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/vendor/exercises/')),
    ...c.filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\//.test(p)),
    ...c.filter(p => p.startsWith('tests/howto/fixtures/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
  ];
  it('every drawn LB8 spec passes', () => {
    expect(files().length).toBeGreaterThanOrEqual(4);
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb8-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/hip_thrust.mjs';
  it('mutation: readFileSync added to the calfMachine composer makes closureOf throw', () => {
    const CF = 'tools/plates/library/specs/seated_calf_raise.mjs';
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/calfMachine.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([CF], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/vendor/exercises/leg_press.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../vendor/exercises/leg_press.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root))).toContain('tools/plates/vendor/exercises/leg_press.mjs'); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-18 A16: no other card\'s composer is copied, forked or imported (D-LIB18-COMPOSERS, -LEGCURL)', () => {
  // main's eq/ at 1ffd0dac: parts.mjs and rope.mjs; this card adds the five LB8 composers only (legCurlMachine is pilot B's).
  const MAIN_EQ = ['parts.mjs', 'rope.mjs'], OURS = COMPOSERS.map(c => `${c}.mjs`);
  const eqProblems = (names: string[]) => [...names.filter(n => !MAIN_EQ.includes(n) && !OURS.includes(n)).map(n => `extra ${n}`), ...MAIN_EQ.filter(n => !names.includes(n)).map(n => `missing ${n}`)];
  it('tools/plates/library/eq/ holds exactly main\'s files plus the LB8 composers', () => {
    expect(eqProblems(readdirSync('tools/plates/library/eq'))).toEqual([]);
    for (const c of ['hackSled', 'calfMachine', 'ankleCuff']) expect(readdirSync('tools/plates/library/eq')).toContain(`${c}.mjs`);
  });
  it('mutation: a copy of #278\'s eq/legCurlMachine.mjs added under eq/ under another name is red', () => {
    expect(eqProblems([...readdirSync('tools/plates/library/eq'), 'curlMachine.mjs'])).toEqual(['extra curlMachine.mjs']);
  });
  it('no LB8 spec draws or imports a leg curl machine of its own before pilot B is on main (D-LIB18-LEGCURL)', () => {
    for (const id of specsDrawn()) expect(readFileSync(`tools/plates/library/specs/${id}.mjs`, 'utf8'), id).not.toMatch(/legCurlMachine/);
    for (const id of LEGCURLS) expect(existsSync(`tools/plates/library/specs/${id}.mjs`), id).toBe(existsSync('tools/plates/library/eq/legCurlMachine.mjs'));
  });
});

describe('LIB-18 A10: the LB8 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  /** Two whole-page builds in one awaited child process (D-LIB18-TESTS): their sha256 values and the ids on the page. */
  const twoBuilds = async () => {
    const script = `const b = await import(${JSON.stringify(lib('lb8/build.mjs'))});
const { createHash } = await import('node:crypto'); const h = x => createHash('sha256').update(x).digest('hex');
const a = await b.buildLb8Page(), c = await b.buildLb8Page(); console.log(JSON.stringify({ ids: b.drawnIds(), a: h(a.html), c: h(c.html) }));`;
    const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    return JSON.parse(stdout.trim().split('\n').pop()!);
  };
  it('two builds of the LB8 rows are byte-identical (in a child process)', async () => {
    const r = await twoBuilds();
    expect(r.ids).toEqual(drawn().map(i => `lib_${i}`));
    expect(r.a).toBe(r.c);
  });
});

describe('LIB-18 A4: runQa node half on an LB8 plate (lib_hack_squat), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_hack_squat', cg = () => S.hack_squat;
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  /** A one-card page built in an awaited child process (D-LIB18-TESTS), from the row's real spec or a scratch spec. */
  const pageInChild = async (specFile: string | null) => {
    const out = join(mkdtempSync(join(tmpdir(), 'lb8-page-')), 'p.html');
    const script = `const b = await import(${JSON.stringify(lib('lb8/build.mjs'))}), fs = await import('node:fs');
const all = b.lb8All(), file = ${JSON.stringify(specFile)};
let h;
if (!file) h = (await b.buildLb8Page({ all, ids: [${JSON.stringify(ID)}] })).html;
else { const cid = (await import(${JSON.stringify(lib('plates-page.mjs'))})).cardIdOf(all.find(r => r.id === ${JSON.stringify(ID)}));
  h = (await (await import(${JSON.stringify(lib('build-page.mjs'))})).buildPlatesPage({ groups: [{ id: 'lb8', title: 'LB8', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } })).html; }
fs.writeFileSync(${JSON.stringify(out)}, h);`;
    await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    try { return readFileSync(out, 'utf8'); } finally { rmSync(join(out, '..'), { recursive: true, force: true }); }
  };
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb8/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb8All();
    html = await pageInChild(null);
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins: pins() });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb8-mut-')), file = join(dir, 'hack_squat.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/hack_squat.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      return { ...(await candOf(await pageInChild(file))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: no node-half problem (H6 passes on the card keys), F7 is not raised (drawable true, topFault = the drawn key)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
    expect(r.flags.F7.raised).toBe(false);
  });
  it('A8 mutation: the card copied with topFault set to its other tell key raises F7, and the expected-set check is red', async () => {
    const qaMod = await import(/* @vite-ignore */ lib('lb8/qa.mjs'));
    const c = await candOf(), r = await qa({ ...c, research: { ...c.research, topFault: 'round' } });
    expect(r.flags.F7.raised).toBe(true);
    expect(qaMod.flagProblems([{ ...r, flags: { ...r.flags, F5: { ...r.flags.F5, raised: true, value: 3.57 } } }]).some((p: string) => /F7/.test(p))).toBe(true);
  });
  it('A4 M1 a label 1 px onto the figure (the Thighs to parallel callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg().callouts.find((x: any) => x.key === 'parallel'), at = (box: any) => ({ ...cg(), callouts: cg().callouts.map((x: any) => (x.key === 'parallel' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[-1, 0], [0, -1], [0, 1], [1, 0]]) {
      for (let d = 1; d <= 120 && !hit; d++) {
        await tick();   // one render per macrotask (D-LIB18-TESTS)
        const box = { left: c0.box.left + dx! * d, top: c0.box.top + dy! * d }, is = plate.renderPlate(at(box), { id: 'm' }).report.issues;
        if (is.some((i: string) => !i.startsWith(`figure:${c0.text}`))) break;
        if (is.length) hit = { box, clean: { left: box.left - dx!, top: box.top - dy! } };
      }
      if (hit) break;
    }
    expect(hit).toBeTruthy();
    expect(plate.renderPlate(at(hit.clean), { id: 'm' }).report.issues).toEqual([]);
    const c = { ...(await candOf()), spec: at(hit.box) };
    expect(node(await qa(c)).some((k: string) => k.startsWith('H1.engine:normal:figure:'))).toBe(true);
  });
  it('A4 M2 a contact 1 cm off (the near heel\'s foot-plate plane moved 1.1 cm along its normal) turns PQ-H1 red', async () => {
    const shift = (s: any) => ({ ...s, checks: s.checks.map((k: any) => { if (k.landmark !== 'heel.r' || !k.plane) return k; const n = k.plane.normal, L = Math.hypot(...n); return { ...k, plane: { ...k.plane, point: k.plane.point.map((v: number, q: number) => v + n[q] / L * 0.011) } }; }) });
    const c = { ...(await candOf()), spec: shift(cg()) };
    expect(node(await qa(c)).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A4 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = MUT('M3').prepare(E, cg(), pins().envelope);
    const c = await mutated('(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, mistake: { ...s.mistake, pose: {}, guides: [], parts: undefined } })');
    expect(node(await qa(c))).toContain('H3.mistake-outline');
  });
  it('A4 M5 the start equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] } })');
    expect(node(await qa(c))).toContain('H3.start-is-end');
  });
  it('A4 M6 an unapproved type (rackUpright) as a moving line part turns PQ-H9 red', async () => {
    const extra = (lm: any, ctx: any) => ({ type: 'rackUpright', at: [0.5, 0, ctx.pose === 'mistake' ? -1.3 : -1.22], h: 0.5 });
    const c = { ...(await candOf()), spec: { ...cg(), equipment: [...cg().equipment, extra] } };
    expect(node(await qa(c)).some((k: string) => k.startsWith(`H9.moving-line:eq${cg().equipment.length}.rackUpright.`))).toBe(true);
  });
  it('A4 M7 an unknown equipment type turns PQ-H9 red', async () => {
    const c = { ...(await candOf()), spec: { ...cg(), equipment: [...cg().equipment, { type: 'rope3d', at: [0, 0, 0] }] } };
    expect(node(await qa(c)).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('A4 a colour literal turns PQ-H2 red (H2.colour)', async () => {
    const m = muts.CANDIDATE_MUTATIONS.find((x: any) => x.id.startsWith('M9 '));
    expect(node(await qa(m.apply(await candOf()))).some((k: string) => k.startsWith('H2.colour:'))).toBe(true);
  });
});

describe('LIB-18 A7: the tempo strip follows the card (D-LIB18-SECS, -TEMPO)', { timeout: T }, () => {
  // The proposed tempo table (D-LIB18-TEMPO; DESIGN.md section 8), copied here, never read from tempo.json or a spec.
  const U = (p: string): [string, string, boolean] => [p, 'up', true], D = (p: string): [string, string, boolean] => [p, 'down', true];
  const HOLD: [string, string, boolean] = ['Hold', 'pause', false];
  const RULED: Record<string, [string, string, boolean][]> = {
    hack_squat: [D('Lower'), U('Push'), HOLD], pendulum_squat: [D('Lower'), U('Push')], leg_extension: [U('Extend'), HOLD, D('Lower')],
    lying_leg_curl: [U('Curl'), HOLD, D('Lower')], standing_leg_curl: [U('Curl'), HOLD, D('Lower')], seated_calf_raise: [U('Raise'), HOLD, D('Lower')],
    standing_calf_raise: [U('Raise'), HOLD, D('Lower')], bodyweight_calf_raise: [U('Raise'), HOLD, D('Lower')], hip_thrust: [U('Lift'), HOLD, D('Lower')],
    glute_bridge: [U('Lift'), HOLD, D('Lower')], cable_kickback: [U('Kick back'), HOLD, D('Return')], resisted_hip_flexion: [U('Lift'), HOLD, D('Lower')],
  };
  // D-LIB18-SECS: the card seconds as read at 596dbe07 (up/down/pause).
  const SECS: Record<string, number[]> = { hack_squat: [1, 3, 1], pendulum_squat: [1, 3, 0], leg_extension: [2, 2, 1], lying_leg_curl: [1, 3, 1],
    standing_leg_curl: [1, 2, 1], seated_calf_raise: [2, 2, 1], standing_calf_raise: [2, 2, 1], bodyweight_calf_raise: [2, 2, 1], hip_thrust: [1, 2, 1],
    glute_bridge: [1, 2, 1], cable_kickback: [1, 2, 1], resisted_hip_flexion: [2, 2, 2] };
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  /** The phase array built only from a tempo.json row set and the card's plate.tempo. */
  const build = (rows: any[], t: any) => rows.map(r => ({ phase: r.phase, s: t[r.from], ...(r.move ? { move: true } : {}) }));
  const tempoProblems = (tj: any, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not the ruled (empty) set');
    if (JSON.stringify(Object.keys(tj.ids)) !== JSON.stringify(LB8)) bad.push('ids: not the 12');
    for (const id of LB8) {
      const rows = tj.ids[id]?.rows ?? [], t = cardOf(id).plate.tempo;
      if (JSON.stringify([t.up, t.down, t.pause]) !== JSON.stringify(SECS[id])) bad.push(`${id}: card seconds changed`);
      if (JSON.stringify(rows.map((r: any) => [r.phase, r.from, !!r.move])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (rows.some((r: any) => r.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (rows.some((r: any) => r.from === 'pause') && !(t.pause > 0)) bad.push(`${id}: Hold with pause 0`);
      if (t.pause > 0 && !rows.some((r: any) => r.from === 'pause')) bad.push(`${id}: no Hold for pause ${t.pause}`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(build(rows, t))) bad.push(`${id}: spec tempo != the built strip`);
    }
    return bad;
  };
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  const TJ = 'tools/plates/library/lb8/tempo.json';
  it('tempo.json follows the ruled table, and every drawn spec\'s tempo is built from it and the card\'s plate.tempo', () => {
    expect(tempoProblems(readJson(TJ), { ...S })).toEqual([]);
    expect(S.hip_thrust.tempo).toEqual([{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]);
  });
  it('mutations: resisted_hip_flexion\'s Hold set to 1, a Hold added to pendulum_squat, Motra\'s 1 s bottom pause added to leg_extension, a Rest, and hip_thrust\'s lowering set to 3 s are each red', () => {
    const red = (f: (tj: any, specs: any, secs: any) => void) => { const tj = copy(readJson(TJ)), specs: any = { ...S }, sec = copy(SECS); f(tj, specs, sec); return tempoProblems(tj, specs).length > 0; };
    const rhf = (s: number) => ({ id: 'resisted_hip_flexion', tempo: [{ phase: 'Lift', s: 2, move: true }, { phase: 'Hold', s }, { phase: 'Lower', s: 2, move: true }] });
    expect(red((tj, specs) => { specs.resisted_hip_flexion = rhf(2); }), 'control: the ruled strip').toBe(false);
    expect(red((tj, specs) => { specs.resisted_hip_flexion = rhf(1); }), 'Hold 1 on resisted_hip_flexion').toBe(true);
    expect(red(tj => { tj.ids.pendulum_squat.rows.push({ phase: 'Hold', from: 'pause' }); }), 'Hold on pendulum_squat').toBe(true);
    expect(red(tj => { tj.ids.leg_extension.rows.splice(1, 0, { phase: 'Pause', from: 'pause' }); }), 'bottom pause on leg_extension').toBe(true);
    expect(red(tj => { tj.ids.hack_squat.rows.push({ phase: 'Rest', from: 'pause' }); }), 'Rest').toBe(true);
    expect(red((tj, specs) => { specs.hip_thrust = { ...specs.hip_thrust, tempo: [specs.hip_thrust.tempo[0], specs.hip_thrust.tempo[1], { ...specs.hip_thrust.tempo[2], s: 3 }] }; }), 'hip_thrust lowering 3 s').toBe(true);
  });
  it('A6 mutation: the card path removed gives H6:no-card', () => {
    const s = S.hip_thrust, R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
    expect(qaNode.h6({ spec: s, research: null }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key)).toEqual(['H6:no-card']);
  });
});

describe('LIB-18 A17: sizes and trace points are fixed in lb8/sizes.json and never set by PQ-H3 (D-LIB18-SIZE, -TRACE)', () => {
  const sizes = readJson('tools/plates/library/lb8/sizes.json');
  const rowProblems = (table: Record<string, any>) => Object.entries(table).flatMap(([k, r]: [string, any]) => [
    ...(typeof r.basis === 'string' && r.basis.trim() ? [] : [`${k}: empty basis`]),
    ...(/PQ-H3|deviationMin|traceLenMin|\bH3\b/.test(r.basis ?? '') ? [`${k}: basis names PQ-H3`] : []),
  ]);
  /** Both ways: every SIZES number is a row with the same value; every row is a SIZES number, a solved export of the
   *  spec (value 'solved'), or the spec's trace point (`trace`). */
  const sizeProblems = (mod: any, table: Record<string, any>) => {
    const spec = mod.SIZES ?? {}, out: string[] = [];
    const eq = (a: any, b: any) => JSON.stringify(a) === JSON.stringify(b);
    for (const k of Object.keys(spec)) if (!(k in table)) out.push(`${k}: not in sizes.json`); else if (!eq(table[k].value, spec[k])) out.push(`${k}: spec ${spec[k]} != sizes.json ${table[k].value}`);
    for (const [k, r] of Object.entries<any>(table)) {
      if (k === 'trace') {
        if (mod.default?.trace?.point !== r.value) out.push(`trace: spec ${mod.default?.trace?.point} != sizes.json ${r.value}`);
        // D-LIB18-TRIM: the trim is the trace row's, its basis the clone source's trim (file:line) or [10, 12]
        if (!mod.default?.trace || JSON.stringify(mod.default.trace.trim) !== JSON.stringify(r.trim)) out.push(`trace trim: spec ${JSON.stringify(mod.default?.trace?.trim)} != sizes.json ${JSON.stringify(r.trim)}`);
        else if (!/trim \[[\d, ]+\]: the clone source's trim, \w+\.mjs:\d+|trim \[10, 12\]/.test(r.basis)) out.push('trace trim: no clone-source basis');
        continue;
      }
      if (r.value === 'solved') { if (typeof mod[k] !== 'number') out.push(`${k}: no solved export`); continue; }
      if (!(k in spec) && !eq(mod[k], r.value)) out.push(`${k}: not in the spec`);   // a named export of the spec counts
    }
    return [...out, ...rowProblems(table)];
  };
  it('each drawn spec\'s SIZES and trace point equal its sizes.json row, and each LB8 composer\'s constants equal theirs, every row with a basis that is not PQ-H3', () => {
    for (const id of specsDrawn()) expect(sizeProblems(M[id], sizes.ids[id]), id).toEqual([]);
    for (const [c, mod] of Object.entries<any>(CQ)) expect(sizeProblems({ SIZES: { ...mod[CONSTS[c]!] } }, sizes.ids[c] ?? {}), c).toEqual([]);
  });
  it('mutations: one Mistake size changed in its spec only, a row with an empty basis, a row whose basis names PQ-H3 or deviationMin, a spec number missing from sizes.json and one trace point changed in the spec only are red', () => {
    const m = M.hip_thrust, t = JSON.parse(JSON.stringify(sizes.ids.hip_thrust));
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, M_ARCH: 20 } }, t)).toEqual(['M_ARCH: spec 20 != sizes.json 12']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: '' } })).toEqual(['M_ARCH: empty basis']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: 'sized so PQ-H3 passes' } })).toEqual(['M_ARCH: basis names PQ-H3']);
    expect(sizeProblems(m, { ...t, M_ARCH: { ...t.M_ARCH, basis: 'above deviationMin' } })).toEqual(['M_ARCH: basis names PQ-H3']);
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, BAR_TILT: 5 } }, t)).toEqual(['BAR_TILT: not in sizes.json']);
    const c = M.seated_calf_raise;
    expect(sizeProblems({ ...c, default: { ...c.default, trace: { ...c.default.trace, point: 'toe.r' } } }, sizes.ids.seated_calf_raise)).toEqual(['trace: spec toe.r != sizes.json heel.r']);
    expect(sizeProblems({ ...m, default: { ...m.default, trace: { ...m.default.trace, trim: [10, 12] } } }, t)).toEqual(['trace trim: spec [10,12] != sizes.json [6,8]']);
  });
});

describe('LIB-18 A19: test manners (D-LIB18-TESTS; VITEST-RPC ruling A)', () => {
  const SRC = readFileSync('tests/howto/lb8-plates.test.ts', 'utf8');
  /** The three manners, read off the source: an afterEach awaiting one setImmediate; every `for (const id of
   *  specsDrawn())` / `drawn()` loop that renders yields once per spec (tick()); generate and the whole page never run
   *  in the worker (only inside a child-process script string). */
  const mannerProblems = (src: string) => {
    const out: string[] = [];
    if (!/afterEach\(\(\) => new Promise<void>\(r => setImmediate\(r\)\)\);/.test(src)) out.push('no afterEach macrotask');
    const code = src.replace(/const script = `[\s\S]*?`;/g, '');   // child-process scripts are allowed to render
    if (/\bgen\.render\(\)/.test(code)) out.push('generate.render() in the worker');
    if (/buildLb8Page\(/.test(code)) out.push('whole-page build in the worker');
    for (const m of code.matchAll(/for \(const id of (?:specsDrawn|drawn)\(\)\) \{([^\n]*)/g)) if (/renderPlate|Problems\(|minGap\(|leaderMax\(/.test(m[1]!) && !/await tick\(\)/.test(m[1]!)) out.push(`no yield: ${m[0].slice(0, 60)}`);
    return out;
  };
  it('the file keeps all three manners', () => {
    expect(mannerProblems(SRC)).toEqual([]);
  });
  it('mutations: the afterEach removed, and generate.render() called in the worker, are red', () => {
    expect(mannerProblems(SRC.split('afterEach(() => new Promise<void>(r => setImmediate(r)));').join(''))).toContain('no afterEach macrotask');
    expect(mannerProblems(`${SRC}\nconst x = async (gen: any) => gen.${'render'}();\n`)).toContain('generate.render() in the worker');
  });
});

// ---- cable_kickback (slice; eq/ankleCuff.mjs) ----
{
  // cable_kickback (LB8 slice, eq/ankleCuff.mjs) tests, for lb8-plates.test.ts. Helpers ASSUMED from LB7's test file
  // (lb7-plates.test.ts lines 1-94, copied into lb8-plates.test.ts): reg, eng, body, plate, M, S (with LB8 ids), itemsIn,
  // lmOf, rep, camOf, shapesIn, fullPose, outside, leadersOf, segD, angle3, withEq, h9, T. `ck` below = M.cable_kickback.
  // Every test reads drawn items (what the spec's entries emit, as the engine calls them), the engine's landmarks and
  // shapes, or the render; never the spec's own solver. Each mutation is shown inline and must turn the assertion red.
  // Equipment entries: 0 floor, 1 cableColumn, 2-4 ankleCuff parts (perItem), 5 start phantoms (end pose only).

  const CK = 'cable_kickback';
  const ck = () => M[CK];
  const POSES = ['start', 'end', 'mistake'];
  const W = 1.75;
  const cmOf = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!) * 100;
  /** The cableColumn item a spec draws in one pose. */
  const colIn = (spec: any, pose: string, o = {}) => itemsIn(spec, pose, o).items.find((it: any) => it.type === 'cableColumn');
  /** The drawn D-ring outline (world points) in one pose: the third cuff entry's poly. */
  const ringIn = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((it: any) => it.part === 'cuff')[2];
  /** Winter 2009 Table 4.1 centre of mass on drawn landmarks (copied from lb7-plates.test.ts:428-442). */
  const comOf = (lm: any) => {
    const L3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const parts: [number, number[]][] = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)]];
    for (const s of ['l', 'r']) parts.push(
      [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
      [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
    const m = parts.reduce((a, p) => a + p[0], 0);
    return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i]!, 0) / m);
  };
  /** Landmarks of the drawn ghosts (the engine's poseAt at the ghost times). */
  const ghostLms = (spec: any) => {
    const b = { height: W }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts.count;
    return Array.from({ length: n }, (_, i) => body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (n + 1), b).q, b)));
  };
  const lmsAll = (spec: any) => [...POSES.map(p => lmOf(spec, p)), ...ghostLms(spec)];
  const mutEnd = (spec: any, patch: any) => ({ ...spec, poses: { ...spec.poses, end: { ...spec.poses.end, ...patch } } });

  describe('cable_kickback: A2 ankleCuff and the cable column per pose', () => {
    it('ankleCuff emits PRIMITIVES types only, every part a poly, in every pose', () => {
      const cuff = (s: any, p: string) => itemsIn(s, p).items.filter((it: any) => it.part === 'cuff');
      for (const p of POSES) { const c = cuff(S[CK], p); expect(c).toHaveLength(3); for (const it of c) { expect(eng.PRIMITIVES[it.type]).toBeTypeOf('function'); expect(it.type).toBe('poly'); } }
      // mutation: the cuff strap drawn as a `line` (H9 alone passes a moving line) -> red
      const bad = withEq(S[CK], 2, (f: any) => (lm: any, ctx: any) => ({ ...f(lm, ctx), type: 'line' }));
      expect(cuff(bad, 'mistake').every((it: any) => it.type === 'poly')).toBe(false);
    });
    it('the column frame and pulley sit at one fixed place (±1 px) in start, end and Mistake; the stack keeps the end lift in the Mistake', () => {
      const drawn = (s: any, p: string) => eng.PRIMITIVES.cableColumn(colIn(s, p, { mistake: p === 'mistake' }), camOf(s));
      const frame = (s: any, p: string) => drawn(s, p).filter((it: any) => it.cls !== 'eq-cable').map((it: any) => it.d);
      const xyOf = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
      const near = (a: string[], b: string[]) => a.length === b.length && a.every((d, i) => xyOf(d).every((q, k) => Math.hypot(q[0]! - xyOf(b[i]!)[k]![0]!, q[1]! - xyOf(b[i]!)[k]![1]!) <= 1));
      // the stack is part of the frame list: it moves start -> end, so compare frame-only items start/end, and all of them end/Mistake
      const stat = (s: any, p: string) => frame(s, p).filter((_: any, i: number) => i < 3 || i >= frame(s, p).length - 4);
      expect(near(stat(S[CK], 'start'), stat(S[CK], 'end'))).toBe(true);
      expect(near(frame(S[CK], 'end'), frame(S[CK], 'mistake'))).toBe(true);
      // mutation: the column moved 2 cm in the Mistake -> red
      const bad = withEq(S[CK], 1, (f: any) => (lm: any, ctx: any) => { const it = f(lm, ctx); return ctx.pose === 'mistake' ? { ...it, base: [0, 0, it.base[2] + 0.02] } : it; });
      expect(near(frame(bad, 'end'), frame(bad, 'mistake'))).toBe(false);
    });
    it('both hands hold the near upright (grip centre on its centre line ±1 cm, within its height) in start, end and Mistake', () => {
      for (const p of POSES) {
        const col = colIn(S[CK], p), postZ = col.base[2] - 0.17 + 0.025, lm = lmOf(S[CK], p);
        for (const s of ['l', 'r']) { expect(Math.abs(lm[`grip.${s}`][2] - postZ) * 100).toBeLessThanOrEqual(1); expect(lm[`grip.${s}`][1]).toBeGreaterThan(0); expect(lm[`grip.${s}`][1]).toBeLessThan(2.1); }
      }
      // mutation: the end hands 2 cm off the post -> red
      const g = S[CK].poses.end.reach, bad = mutEnd(S[CK], { reach: { l: { ...g.l, at: [g.l.at[0], g.l.at[1], g.l.at[2] - 0.02] }, r: { ...g.r, at: [g.r.at[0], g.r.at[1], g.r.at[2] - 0.02] } } });
      expect(Math.abs(lmOf(bad, 'end')['grip.r'][2] - (colIn(bad, 'end').base[2] - 0.145)) * 100).toBeGreaterThan(1);
    });
    it('the standing foot is flat on the floor (heel and ball ±1 cm) and the cuff is on the working ankle in every pose', () => {
      for (const p of POSES) {
        const lm = lmOf(S[CK], p);
        expect(Math.abs(lm['heel.l'][1]) * 100).toBeLessThanOrEqual(1); expect(Math.abs(lm['ball.l'][1]) * 100).toBeLessThanOrEqual(1);
        const band = itemsIn(S[CK], p).items.filter((it: any) => it.part === 'cuff')[0].pts, c = [0, 1, 2].map(i => band.reduce((a: number, q: number[]) => a + q[i]!, 0) / 4);
        // band centre on the shank axis, 4-7 cm above the ankle joint
        const k = lm['knee.r'], a = lm['ankle.r'], u = k.map((v: number, i: number) => v - a[i]), L = Math.hypot(...u), t = u.reduce((s: number, v: number, i: number) => s + v * (c[i]! - a[i]), 0) / L;
        expect(t).toBeGreaterThan(0.04); expect(t).toBeLessThan(0.07);
        expect(cmOf(c, a.map((v: number, i: number) => v + u[i] / L * t))).toBeLessThanOrEqual(1);
      }
      // mutation: the cuff drawn at the knee -> red
      const bad = withEq(S[CK], 2, () => (lm: any) => ({ type: 'poly', part: 'cuff', pts: [lm['knee.r'], lm['hip.r'], lm['knee.l']] }));
      const pts = itemsIn(bad, 'end').items.filter((it: any) => it.part === 'cuff')[0].pts, lm = lmOf(bad, 'end');
      expect(cmOf(pts[0], lm['ankle.r'])).toBeGreaterThan(7);
    });
    it('the cable runs from the low pulley to the drawn D-ring in every pose (D-LIB18-CABLE)', () => {
      for (const p of ['start', 'end']) {
        const col = colIn(S[CK], p), ring = ringIn(S[CK], p).pts, far = ring[Math.floor(ring.length / 2)];
        expect(cmOf(col.to, far)).toBeLessThanOrEqual(1);
        expect(col.pulley.at[1]).toBeLessThanOrEqual(0.15);                 // c1 lowest setting: pulley centre at most 15 cm up
      }
      // mutation: the cable end left at the start ring in the end pose -> red
      const bad = withEq(S[CK], 1, (f: any) => (lm: any, ctx: any) => ({ ...f(lm, ctx), to: f(ctx.start, ctx).to }));
      const r = ringIn(bad, 'end').pts; expect(cmOf(colIn(bad, 'end').to, r[Math.floor(r.length / 2)])).toBeGreaterThan(1);
    });
  });

  describe('cable_kickback: A18 physics on drawn items', () => {
    it('every heel, ball and toe is on or above the floor line in start, end, Mistake and the ghosts', () => {
      const ok = (s: any) => lmsAll(s).every(lm => ['heel', 'ball', 'toe'].every(k => ['l', 'r'].every(sd => lm[`${k}.${sd}`][1] >= -0.0005)));
      expect(ok(S[CK])).toBe(true);
      // mutation: the standing heel 1 px below the floor (root lowered 1 px, the foot re-planted 1 px down) -> red
      const px = 1 / rep(S[CK]).camera.pxPerM, pl = S[CK].poses.end.plant;
      expect(ok(mutEnd(S[CK], { plant: { l: { ...pl.l, at: [pl.l.at[0], -px, pl.l.at[2]] } } }))).toBe(false);
    });
    it('the frame stands on the floor and the pulley sits on the near upright (joined, D-LIB18-FRAME)', () => {
      const col = colIn(S[CK], 'end');
      expect(col.base[1]).toBe(0);
      expect(Math.abs(col.pulley.at[2] - (col.base[2] - 0.17))).toBeLessThanOrEqual(0.03);   // pulley centre within the post's width band
      const bad = withEq(S[CK], 1, (f: any) => (lm: any, ctx: any) => { const it = f(lm, ctx); return { ...it, pulley: { ...it.pulley, at: [it.pulley.at[0], it.pulley.at[1], it.pulley.at[2] - 0.2] } }; });
      expect(Math.abs(colIn(bad, 'end').pulley.at[2] - (colIn(bad, 'end').base[2] - 0.17))).toBeGreaterThan(0.03);
    });
    it('the centre of mass lies over the standing foot in every drawn pose (D-LIB18-BALANCE, c2): within ±2 cm of mid-sole (point base) and inside heel to toe; hands steady only', () => {
      const ok = (s: any) => lmsAll(s).every(lm => { const c = comOf(lm)[2]!; return Math.abs(c - lm['sole.l'][2]) <= 0.02 && c >= lm['heel.l'][2] && c <= lm['toe.l'][2]; });
      expect(ok(S[CK])).toBe(true);
      // mutation (card A18): the end trunk moved 10 cm forward -> end COM about +7 cm -> red
      const at = S[CK].poses.end.root.at;
      expect(ok(mutEnd(S[CK], { root: { ...S[CK].poses.end.root, at: [at[0], at[1], at[2] + 0.10] } }))).toBe(false);
    });
  });

  describe('cable_kickback: card facts and sized numbers on the drawn body', () => {
    it('hinge about 45 degrees (c2, PureGym; a choice): thorax (pelvis tilt + lumbar) 45 ±2 from vertical in start and end, the torso unchanged (c7, c8, c10)', () => {
      const inc = (s: any, p: string) => { const a = rep(s).angles[p]; return a.tilt + a.trunk; };
      expect(Math.abs(inc(S[CK], 'start') - 45)).toBeLessThanOrEqual(2); expect(Math.abs(inc(S[CK], 'end') - 45)).toBeLessThanOrEqual(2);
      const S0 = lmOf(S[CK], 'start'), E0 = lmOf(S[CK], 'end');
      for (const k of ['shoulder.r', 'lumbar', 'sacrum', 'head', 'grip.r']) expect(cmOf(S0[k], E0[k])).toBeLessThanOrEqual(1);
      const bad = mutEnd(S[CK], { root: { ...S[CK].poses.end.root, tilt: S[CK].poses.end.root.tilt + 3 } });   // mutation: +3 deg -> red
      expect(Math.abs(inc(bad, 'end') - 45)).toBeGreaterThan(2);
    });
    it('working knee slightly bent (c5): off the hip-ankle line by >= 90 % of the KNEE_SOFT offset in start, end and Mistake, in the sagittal plane', () => {
      const k0 = ck().SIZES.KNEE_SOFT, a = 0.245 * W, b = 0.246 * W, Lc = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k0 * Math.PI / 180));
      const off0 = a * b * Math.sin(k0 * Math.PI / 180) / Lc;    // the knee's distance from the hip-ankle line at the sized bend
      const off = (lm: any) => segD([lm['knee.r'][2], lm['knee.r'][1]], [lm['hip.r'][2], lm['hip.r'][1]], [lm['ankle.r'][2], lm['ankle.r'][1]]);
      for (const p of POSES) { const lm = lmOf(S[CK], p); expect(off(lm)).toBeGreaterThanOrEqual(0.9 * off0); expect(Math.abs(lm['knee.r'][0] - lm['hip.r'][0])).toBeLessThan(0.005); }
      expect(off(lmOf(mutEnd(S[CK], { knee: { r: 0 } }), 'end'))).toBeLessThan(0.9 * off0);   // mutation: knee 0 -> red
    });
    it('the toe points straight down at the end (c10): heel-to-toe within 2 degrees of vertical', () => {
      const tilt = (lm: any) => Math.abs(Math.atan2(lm['toe.r'][2] - lm['heel.r'][2], lm['heel.r'][1] - lm['toe.r'][1]) * 180 / Math.PI);
      expect(tilt(lmOf(S[CK], 'end'))).toBeLessThanOrEqual(2);
      expect(tilt(lmOf(mutEnd(S[CK], { ankle: { r: S[CK].poses.end.ankle.r + 5 } }), 'end'))).toBeGreaterThan(2);
    });
    it('the working leg goes back only by the hip (END_HIP_EXT past neutral, pelvis held): hip-knee angle to the pelvis axis', () => {
      const a = rep(S[CK]).angles.end['hip.r'];
      expect(+/flex (-?[\d.]+)/.exec(a)![1]!).toBeCloseTo(-ck().SIZES.END_HIP_EXT, 0);
    });
    it('every unsourced number is in SIZES, and the trace point is the working ankle (D-LIB18-TRACE, c5)', () => {
      expect(Object.keys(ck().SIZES).sort()).toEqual(['ELBOW_SOFT', 'END_HIP_EXT', 'FLOOR_BACK', 'FLOOR_FRONT', 'KNEE_SOFT', 'M_ARCH', 'PULLEY_Y', 'STANCE_KNEE', 'STANCE_X', 'START_ANKLE', 'START_TOE_CLEAR']);
      expect(S[CK].trace.point).toBe('ankle.r');
      expect(rep(S[CK]).angles.mistake.trunk).toBe(-ck().SIZES.M_ARCH);          // the arch drawn at its size (hanging_leg_raise.mjs:69)
    });
    it('tempo strip = lb8/tempo.json row + card plate.tempo (Kick back 1, Hold 1, Return 2)', () => {
      expect(S[CK].tempo).toEqual([{ phase: 'Kick back', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }]);
    });
  });

  describe('cable_kickback: A15 drawing lessons (each check run on the real spec and on a mutated spec)', () => {
    /** The dashed Mistake cable: unbroken from the pulley rim to the drawn Mistake D-ring, in the Mistake layer above the
     *  end figure. Reads the drawn svg (the guide's path) and the drawn ring. */
    const cableProblems = (spec: any) => {
      const cam = camOf(spec), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg, out: string[] = [];
      const g = (spec.mistake.guides ?? []).find((x: any) => x.kind === 'dashed' && x.pts?.length === 2);
      if (!g) return ['no dashed Mistake cable'];
      const ring = ringIn(spec, 'mistake').pts.map(cam.P), pul = colIn(spec, 'end').pulley, pc = cam.P(pul.at), [a, b] = g.pts.map(cam.P);
      if (Math.min(...ring.map((q: number[]) => Math.hypot(q[0]! - b![0]!, q[1]! - b![1]!))) > cam.pxm * 0.01) out.push('the cable stops short of the Mistake ring');
      if (Math.abs(Math.hypot(a![0]! - pc[0]!, a![1]! - pc[1]!) - pul.r * cam.pxm) > cam.pxm * 0.005) out.push('the cable does not start at the pulley rim');
      if (!(svg.indexOf('class="mistake-layer"') > svg.indexOf('class="pose-end"'))) out.push('not drawn above the end figure');
      return out;
    };
    it('the dashed Mistake cable runs unbroken from the pulley rim to the Mistake D-ring, drawn on top', () => {
      expect(cableProblems(S[CK])).toEqual([]);
    });
    it('mutations: the Mistake cable cut to half its length, and the cable guide removed, are red', () => {
      const g = S[CK].mistake.guides[0], half = { ...g, pts: [g.pts[0], g.pts[0].map((v: number, i: number) => (v + g.pts[1][i]) / 2)] };
      expect(cableProblems({ ...S[CK], mistake: { ...S[CK].mistake, guides: [half, ...S[CK].mistake.guides.slice(1)] } })).toContain('the cable stops short of the Mistake ring');
      expect(cableProblems({ ...S[CK], mistake: { ...S[CK].mistake, guides: S[CK].mistake.guides.slice(1) } })).toEqual(['no dashed Mistake cable']);
    });
    /** Every red Mistake leg point drawn outside the end figure clears it by >= 6 px (the engine masks the rest). */
    const legClear = (spec: any) => {
      const endPolys = shapesIn(spec, 'end').map((x: any) => x.poly);
      const outPts = shapesIn(spec, 'mistake').filter((x: any) => ['thigh.r', 'shank.r', 'foot.r'].includes(x.key)).flatMap((x: any) => x.poly).filter((q: number[]) => outside(endPolys, q) > 0);
      return outPts.length ? Math.max(...outPts.map((q: number[]) => outside(endPolys, q))) : 0;
    };
    it('the red Mistake leg clears the solid end figure by >= 6 px where it is drawn outside it', () => {
      expect(legClear(S[CK])).toBeGreaterThanOrEqual(6);
    });
    it('mutation: the Mistake equal to the end pose (no red leg outside the end figure) is red', () => {
      expect(legClear({ ...S[CK], mistake: { ...S[CK].mistake, pose: {} } })).toBeLessThan(6);
    });
    /** The hidden start leg and cuff are dashed phantoms in the end layer only, and the Trace starts at the start ankle. */
    const phantomProblems = (spec: any) => {
      const out: string[] = [], ph = itemsIn(spec, 'end').items.filter((it: any) => it.part === 'startLeg' || it.part === 'startCuff');
      if (!ph.length) out.push('no start phantom');
      if (!ph.every((it: any) => it.type === 'line' && it.cls === 'eq-line m-line')) out.push('a phantom is not a dashed line');
      if (itemsIn(spec, 'start').items.some((it: any) => it.part === 'startLeg')) out.push('a phantom in the start layer');
      const cam = camOf(spec), svg = plate.renderPlate(spec, { id: 'x' }).svg, tr = xy(/<path class="trace"[^>]*? d="([^"]+)"/.exec(svg)![1]!), a0 = cam.P(lmOf(spec, 'start')['ankle.r']);
      if (Math.hypot(tr[0]![0]! - a0[0]!, tr[0]![1]! - a0[1]!) > 12) out.push('the Trace does not start at the start ankle');
      return out;
    };
    it('the hidden start leg and cuff are redrawn as dashed phantoms in the end layer; the Trace starts at the start ankle (within its 10 px trim)', () => {
      expect(phantomProblems(S[CK])).toEqual([]);
    });
    it('mutation: the phantom entry removed is red', () => {
      const k = S[CK].equipment.findIndex((e: any, i: number) => typeof e === 'function' && itemsIn({ ...S[CK], equipment: [e] }, 'end').items.some((it: any) => it.part === 'startLeg'));
      expect(k).toBeGreaterThanOrEqual(0);
      expect(phantomProblems(withEq(S[CK], k, () => () => null))).toContain('no start phantom');
    });
    /** The tell anchor sits on the dashed arch guide (the drawn faulty back contour), within 1 px. */
    const tellOnGuide = (spec: any) => {
      const cam = camOf(spec), L = qaEng.poseLandmarks(Eng(), spec).lm, at = qaEng.resolvePoint(spec.mistake.tells[0].anchor, 'mistake', L, cam);
      const g = spec.mistake.guides[1].pts.map(cam.P);
      return Math.min(...g.slice(1).map((q: number[], i: number) => segD(at, g[i]!, q)));
    };
    it('the tell anchor sits on a drawn item: the Mistake sacrum on the dashed arch guide (within 1 px)', () => {
      expect(tellOnGuide(S[CK])).toBeLessThanOrEqual(1);
    });
    it('mutation: the tell anchor moved 20 px off the guide is red', () => {
      const t0 = S[CK].mistake.tells[0], bad = { ...S[CK], mistake: { ...S[CK].mistake, tells: [{ ...t0, anchor: { at: 'sacrum', pose: 'mistake', off: [-20, 0] } }, ...S[CK].mistake.tells.slice(1)] } };
      expect(tellOnGuide(bad)).toBeGreaterThan(1);
    });
    /** No leader within 6 px of a cable (the column's and the dashed Mistake cable), nor inside the figure of its render. */
    const leaderProblems = (spec: any) => {
      const cam = camOf(spec), out: string[] = [];
      for (const mistake of [false, true]) {
        const R = plate.renderPlate(spec, { id: 'x', mistake });
        const cab = eng.PRIMITIVES.cableColumn(colIn(spec, mistake ? 'mistake' : 'end', { mistake }), cam).filter((it: any) => it.line).map((it: any) => it.line);
        if (mistake) cab.push(spec.mistake.guides[0].pts.map(cam.P));
        const figure = shapesIn(spec, mistake ? 'mistake' : 'end').map((x: any) => x.poly);
        leadersOf(R.svg).forEach((ld, i) => {
          // sampled along the leader, away from its first 8 px at the anchor
          const samp = segs(ld).flatMap(([a, b]) => Array.from({ length: 21 }, (_, k) => [a![0]! + (b![0]! - a![0]!) * k / 20, a![1]! + (b![1]! - a![1]!) * k / 20])).filter(q => Math.hypot(q[0]! - ld[0]![0]!, q[1]! - ld[0]![1]!) >= 8);
          for (const c of cab) for (const q of samp) if (segD(q, c[0], c[c.length - 1]) <= 6) out.push(`${mistake ? 'mistake' : 'normal'} ${i}: near a cable`);
          for (const q of samp) if (outside(figure, q) <= 0) out.push(`${mistake ? 'mistake' : 'normal'} ${i}: inside the figure`);
        });
      }
      return [...new Set(out)];
    };
    it('no leader runs within 6 px of a cable, nor crosses the end figure (normal) or the Mistake figure (Mistake)', () => {
      expect(leaderProblems(S[CK])).toEqual([]);
    });
    it('mutation: the "Leg long" box moved below the cable (its leader across the cable) is red', () => {
      const bad = { ...S[CK], callouts: S[CK].callouts.map((c: any) => (c.key === 'leg' ? { ...c, box: { left: 100, top: 300 } } : c)) };
      expect(leaderProblems(bad).length).toBeGreaterThan(0);
    });
    const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].filter((c: any) => c.cue.split(/\s+/).length > 15 || /;/.test(c.cue) || (c.cue.match(/[.?]/g) ?? []).length !== 1).map((c: any) => c.key);
    it('cues: one sentence each, 15 words or fewer, no semicolon; mutation: a 16-word cue is red', () => {
      expect(cueProblems(S[CK])).toEqual([]);
      expect(cueProblems({ ...S[CK], callouts: S[CK].callouts.map((c: any) => (c.key === 'leg' ? { ...c, cue: 'Keep the working leg long, with only a slight bend at the knee, and keep it there.' } : c)) })).toEqual(['leg']);
    });
    it('report.mjs engine checks: no issue in the normal and the Mistake render; mutation: a box on the figure is red', () => {
      expect(rep(S[CK]).issues).toEqual([]); expect(plate.renderPlate(S[CK], { id: 'm', mistake: true }).report.issues).toEqual([]);
      const bad = { ...S[CK], callouts: S[CK].callouts.map((c: any) => (c.key === 'back' ? { ...c, box: { left: 230, top: 200 } } : c)) };
      expect(rep(bad).issues.length).toBeGreaterThan(0);
    });
  });
}

// ---- hack_squat (slice; eq/hackSled.mjs): its own copy of the LB7 helpers, scoped to this block ----
{
  let eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, sledEq: any, HQ: any, s0: any;
  beforeAll(async () => {
    [eng, body, qaNode, qaEng, qaIdx, plate, sledEq, HQ] = await Promise.all([
      'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs', 'eq/hackSled.mjs', 'specs/hack_squat.mjs',
    ].map(f => import(/* @vite-ignore */ lib(f))));
    s0 = HQ.default;
  }, T);
  const s = () => s0;
  const HS = () => HQ.HS;

  // ---- LB7 helpers (lb7-plates.test.ts:36-94), unchanged ----
  const pins = () => qaIdx.loadPins();
  const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
  const posesOf = (spec: any) => ['start', 'end', ...(spec.mistake?.pose ? ['mistake'] : [])];
  const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
    const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
    const ctx = { pose, start: L.lm.start, mistake, body: L.body };
    const out: any[] = [];
    spec.equipment.forEach((e: any, i: number) => {
      for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
    });
    return { items: out, lm };
  };
  const lmOf = (spec: any, pose: string) => qaEng.poseLandmarks(Eng(), spec).lm[pose];
  const h9 = (spec: any) => {
    let R: any = null;
    try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
    return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins().envelope }, R).map((p: any) => p.key);
  };
  const rep = (spec: any) => plate.renderPlate(spec, { id: 'x' }).report;
  const camOf = (spec: any) => {
    const c = rep(spec).camera, side = spec.view === 'side';
    return { view: side ? 'side' : 'front', near: side ? 'r' : null, facing: 'right', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + (side ? w[2]! : w[0]!) * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
  };
  const fullPose = (spec: any, pose: string) => (pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose]);
  const shapesIn = (spec: any, pose: string) => {
    const b = { height: 1.75 };
    return body.bodyShapes(body.fk(body.resolve(body.normPose(fullPose(spec, pose), b), b).q, b), camOf(spec), { armsFront: spec.armsFront, hand: spec.hand }).filter((x: any) => x.poly);
  };
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
  const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
  const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
  const listOf = (spec: any, mistake: boolean) => (mistake ? spec.mistake.tells : [...(spec.measure ? [{ key: '_arc' }] : []), ...spec.callouts]);
  const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
  const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });
  // ---- hack_squat helpers ----
  const sub = (a: number[], b: number[]) => a.map((v, i) => v - b[i]!), dot = (a: number[], b: number[]) => a.reduce((t, v, i) => t + v * b[i]!, 0);
  /** Each sled/frame item's drawn outline in a pose, by key (entry.type.index), as the engine keys them. */
  const drawnByKey = (spec: any, pose: string) => {
    const cam = camOf(spec), out = new Map<string, { part: string | null, type: string, d: string, poly?: number[][], cls: string }>();
    for (const it of itemsIn(spec, pose).items) eng.PRIMITIVES[it.type](it, cam).forEach((p: any, j: number) => out.set(`eq${it.entry}.${it.type}.${j}`, { part: it.part ?? null, type: it.type, d: p.d, poly: p.poly, cls: p.cls }));
    return out;
  };
  /** The composer's items in a pose, in its documented order (eq/hackSled.mjs: floor beam, rear post, front post, rail,
   *  rail bracket, foot plate, fail-safe stop, carriage, back pad, shoulder pad, handle bracket, handle grip). */
  const NAMES = ['beam', 'rearPost', 'frontPost', 'rail', 'railBracket', 'plate', 'stop', 'carriage', 'backPad', 'shoulderPad', 'handleBracket', 'grip'];
  let ENTRY: Map<number, string> | null = null;   // composer item name by equipment entry, read once from the real spec
  const sledItems = (spec: any, pose: string) => {
    if (!ENTRY) { ENTRY = new Map(); itemsIn(s0, 'end').items.filter((i: any) => ['frame', 'plate', 'stop', 'sled'].includes(i.part)).forEach((it: any, k: number) => ENTRY!.set(it.entry, NAMES[k]!)); }
    const out: Record<string, any> = {};
    for (const it of itemsIn(spec, pose).items) if (ENTRY.has(it.entry)) out[ENTRY.get(it.entry)!] = it;
    return out;
  };
  /** A drawn item's outline (plate px). */
  const outlineOf = (spec: any, it: any) => eng.PRIMITIVES[it.type](it, camOf(spec)).map((p: any) => p.poly ?? p.line).find(Boolean) as number[][];
  const allPoses = (spec: any) => {
    const b = { height: 1.75 }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts?.count ?? 3;
    return [...posesOf(spec).map(p => [p, lmOf(spec, p)] as const),
      ...Array.from({ length: n }, (_, i) => [`ghost${i}`, body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (n + 1), b).q, b))] as const)];
  };

  describe('LIB-18 hack_squat A2: hackSled per drawn pose (13.1)', { timeout: T }, () => {
    const STATIC = ['frame', 'plate', 'stop'];
    /** Static parts sit at one place (+-1 px) in start, end and Mistake; every sled part carries a poly in every pose
     *  (so the engine draws it in the Mistake view, plate.mjs:213) and moves between the start and the end. */
    const sledProblems = (spec: any) => {
      const out: string[] = [], poses = posesOf(spec).map(p => [p, drawnByKey(spec, p)] as const), end = poses.find(([p]) => p === 'end')![1], st = poses[0]![1];
      for (const [k, v] of end) {
        if (STATIC.includes(v.part!)) for (const [p, m] of poses) {
          const w = m.get(k);
          if (!w || !v.poly || !w.poly) { out.push(`${k}: missing or no poly in ${p}`); continue; }
          const dmax = Math.max(...v.poly.map((q, i) => Math.hypot(q[0]! - w.poly![i]![0]!, q[1]! - w.poly![i]![1]!)));
          if (dmax > 1) out.push(`${k} (${v.part}) moved ${dmax.toFixed(1)} px in ${p}`);
        }
        if (v.part === 'sled') {
          for (const [p, m] of poses) if (!m.get(k)?.poly) out.push(`${k} (sled): no poly in ${p}`);
          if (st.get(k)?.d === v.d) out.push(`${k} (sled): does not move start -> end`);
        }
      }
      if (![...end.values()].some(v => v.part === 'sled')) out.push('no sled drawn');
      return out;
    };
    const typeProblems = (spec: any) => posesOf(spec).flatMap(p => itemsIn(spec, p).items.filter((it: any) => !eng.PRIMITIVES[it.type]).map((it: any) => `${p}: eq${it.entry} ${it.type}`));
    it('PRIMITIVES types only; static parts fixed; every sled part a poly that rides with the body', () => {
      expect(typeProblems(s())).toEqual([]);
      expect(h9(s())).toEqual([]);
      expect(sledProblems(s())).toEqual([]);
    });
    it('mutation: {type: "wedge"} turns H9.type red (a static item) and the per-pose type test red (in the composer output)', () => {
      expect(h9({ ...s(), equipment: [...s().equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
      const k = sledItems(s(), 'end').shoulderPad.entry;
      expect(typeProblems(withEq(s(), k, e => (lm: any, ctx: any) => ({ ...e(lm, ctx), type: 'wedge' }))).length).toBe(3);
    });
    it('mutation: the rail moved 2 cm in the Mistake is red', () => {
      const k = sledItems(s(), 'end').rail.entry;
      const bad = withEq(s(), k, e => (lm: any, ctx: any) => { const it = e(lm, ctx); return ctx.pose === 'mistake' ? { ...it, surface: it.surface.map((p: number[]) => [p[0]!, p[1]! + 0.02, p[2]!]) } : it; });
      expect(sledProblems(bad).some(p => /moved/.test(p))).toBe(true);
    });
    it('mutation: the back pad drawn as a `line` (no poly) is red', () => {
      const k = sledItems(s(), 'end').backPad.entry;
      const bad = withEq(s(), k, e => (lm: any, ctx: any) => { const it = e(lm, ctx); return { type: 'line', pts: it.surface, part: 'sled' }; });
      expect(sledProblems(bad).some(p => /no poly/.test(p))).toBe(true);
    });
    /** Contacts (c1, c2, c6, c14, c18) on the drawn items, +-1 cm: heel and ball on the plate's top face in every pose;
     *  the upper back on the back pad's face in every pose and the buttock at the start and the end; the shoulders (trap)
     *  on the shoulder pad's lower face at the start and the end; each grip on the handle grip's centre. */
    const contactProblems = (spec: any) => posesOf(spec).flatMap(pose => {
      const L = lmOf(spec, pose), it = sledItems(spec, pose), cam = camOf(spec), out: string[] = [], px = 100 / cam.pxm;   // px -> cm
      const top = outlineOf(spec, it.plate).slice(0, 2), padF = (() => { const o = outlineOf(spec, it.backPad); return [o[0]!, o[1]!]; })();
      const lineD = (w: number[], ab: number[][]) => { const p = cam.P(w), [a, b] = ab, n = [-(b![1]! - a![1]!), b![0]! - a![0]!], l = Math.hypot(n[0]!, n[1]!); return Math.abs((p[0]! - a![0]!) * n[0]! + (p[1]! - a![1]!) * n[1]!) / l * px; };
      for (const k of ['heel.l', 'heel.r', 'ball.l', 'ball.r']) { const d = lineD(L[k], top); if (d > 1) out.push(`${pose}: ${k} ${d.toFixed(1)} cm off the plate`); }
      const pad = it.backPad.surface, padLine = [cam.P(pad[0]), cam.P(pad[1])];
      for (const k of ['backUpper', ...(pose === 'mistake' ? [] : ['buttock'])]) { const d = lineD(L[k], padLine); if (d > 1) out.push(`${pose}: ${k} ${d.toFixed(1)} cm off the back pad`); }
      void padF;
      if (pose !== 'mistake') { const sp = outlineOf(spec, it.shoulderPad); for (const k of ['trap.l', 'trap.r']) { const d = lineD(L[k], [sp[0]!, sp[1]!]); if (d > 1) out.push(`${pose}: ${k} ${d.toFixed(1)} cm off the shoulder pad`); } }
      const g = it.grip.pts, gc = g.reduce((a: number[], q: number[]) => a.map((v, i) => v + q[i]! / g.length), [0, 0, 0]);
      for (const k of ['grip.l', 'grip.r']) { const d = Math.hypot(L[k][1] - gc[1], L[k][2] - gc[2]) * 100; if (d > 1) out.push(`${pose}: ${k} ${d.toFixed(1)} cm off the handle`); }
      return out;
    });
    it('every foot, back, shoulder and hand contact holds on its drawn item (+-1 cm)', () => {
      expect(contactProblems(s())).toEqual([]);
    });
    it('mutation: one foot 2 cm off the plate at the end is red', () => {
      const e = s().poses.end, pl = e.plant, bad = { ...s(), poses: { ...s().poses, end: { ...e, plant: { ...pl, r: { ...pl.r, at: [pl.r.at[0], pl.r.at[1] + 0.02, pl.r.at[2]] } } } } };
      expect(contactProblems(bad).some(p => /^end: (heel|ball)\.r .* off the plate$/.test(p))).toBe(true);
    });
  });

  describe('LIB-18 hack_squat A18: physics on drawn items, every drawn pose and ghost', { timeout: T }, () => {
    /** Feet (whole outline) and the machine's base on or above the floor line (0.5 px). */
    const floorProblems = (spec: any) => {
      const cam = camOf(spec), fy = cam.P([0, 0, 0])[1], out: string[] = [];
      for (const pose of posesOf(spec)) {
        for (const x of shapesIn(spec, pose).filter((x: any) => /^foot\./.test(x.key))) { const low = Math.max(...x.poly.map((p: number[]) => p[1]!)); if (low - fy > 0.5) out.push(`${pose}: ${x.key} ${(low - fy).toFixed(1)} px under the floor`); }
        const beam = outlineOf(spec, sledItems(spec, pose).beam); if (Math.max(...beam.map(p => p[1]!)) - fy > 0.5) out.push(`${pose}: floor beam under the floor`);
      }
      return out;
    };
    it('no foot or machine base through the floor', () => { expect(floorProblems(s())).toEqual([]); });
    it('mutation: the near foot planted 1 px below the floor line at the end is red', () => {
      const e = s().poses.end, pl = e.plant, cam = camOf(s()), dy = (pl.r.at[1] + 1 / cam.pxm);
      const bad = { ...s(), poses: { ...s().poses, end: { ...e, plant: { ...pl, r: { ...pl.r, at: [pl.r.at[0], pl.r.at[1] - dy, pl.r.at[2]] } } } } };
      expect(floorProblems(bad).some(p => /^end: foot\.r/.test(p))).toBe(true);
    });
    /** No body landmark more than 1 cm inside the item it rests on (signed distance to the drawn face, plate px -> cm):
     *  the back pad (backUpper, backMid, sacrum, buttock), the foot plate (heel, ball, toe), the shoulder pad (trap). */
    const insideProblems = (spec: any) => allPoses(spec).flatMap(([pose, L]) => {
      const it = sledItems(spec, ['start', 'end', 'mistake'].includes(pose) ? pose : 'end'), cam = camOf(spec), out: string[] = [];
      if (/^ghost/.test(pose)) return out;   // ghost sled places differ; the ghost feet are tested on the fixed plate below
      const sd = (w: number[], a: number[], b: number[]) => { const p = cam.P(w), n = [-(b[1]! - a[1]!), b[0]! - a[0]!], l = Math.hypot(n[0]!, n[1]!); return ((p[0]! - a[0]!) * n[0]! + (p[1]! - a[1]!) * n[1]!) / l * 100 / cam.pxm; };
      const pad = it.backPad.surface.map(cam.P);                                  // face line, upper -> lower
      for (const k of ['backUpper', 'backMid', 'sacrum', 'buttock']) { const d = sd(L[k], pad[1], pad[0]); if (d < -1) out.push(`${pose}: ${k} ${(-d).toFixed(1)} cm inside the back pad`); }
      const top = outlineOf(spec, it.plate);
      for (const k of ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r']) { const d = sd(L[k], top[0]!, top[1]!); if (d > 1) out.push(`${pose}: ${k} ${d.toFixed(1)} cm inside the plate`); }
      return out;
    }).concat(allPoses(spec).filter(([p]) => /^ghost/.test(p)).flatMap(([pose, L]) => {
      const fy = s0.poses.end.plant.r.at[1];
      return ['heel.r', 'ball.r', 'toe.r'].filter(k => L[k][1] < fy - 0.01).map(k => `${pose}: ${k} inside the plate`);
    }));
    it('no body landmark more than 1 cm inside the back pad or the foot plate', () => { expect(insideProblems(s())).toEqual([]); });
    it('mutation: the end hips pushed 3 cm into the back pad is red', () => {
      const e = s().poses.end, N = HS().N, bad = { ...s(), poses: { ...s().poses, end: { ...e, root: { ...e.root, at: e.root.at.map((v: number, i: number) => v - N[i] * 0.03) } } } };
      expect(insideProblems(bad).some(p => /^end: buttock .* inside the back pad$/.test(p))).toBe(true);
    });
    /** D-LIB18-FRAME: every pad, plate, rail and post touches what carries it (outlines within 1 px). */
    const JOINS: [string, string][] = [['backPad', 'carriage'], ['carriage', 'rail'], ['shoulderPad', 'backPad'], ['handleBracket', 'shoulderPad'], ['grip', 'handleBracket'],
      ['plate', 'railBracket'], ['railBracket', 'rail'], ['rail', 'rearPost'], ['frontPost', 'railBracket'], ['rearPost', 'beam'], ['frontPost', 'beam'], ['stop', 'rail']];
    const polyGap = (a: number[][], b: number[][]) => { if (a.some(p => inPoly(b, p)) || b.some(p => inPoly(a, p))) return 0; let d = Infinity; for (const p of a) for (const [u, v] of segs([...b, b[0]!])) d = Math.min(d, segD(p, u!, v!)); for (const p of b) for (const [u, v] of segs([...a, a[0]!])) d = Math.min(d, segD(p, u!, v!)); return d; };
    const frameProblems = (spec: any) => posesOf(spec).flatMap(pose => {
      const it = sledItems(spec, pose);
      return JOINS.flatMap(([a, b]) => { if (!it[a] || !it[b]) return [`${pose}: ${!it[a] ? a : b} not drawn`]; const g = polyGap(outlineOf(spec, it[a]), outlineOf(spec, it[b])); return g <= 1 ? [] : [`${pose}: ${a} ${g.toFixed(1)} px off ${b}`]; });
    });
    it('every pad, the plate, the rail and the posts are joined to the frame', () => { expect(frameProblems(s())).toEqual([]); });
    it('mutation: hackSled\'s foot-plate bracket removed is red', () => {
      const k = sledItems(s(), 'end').railBracket.entry;
      expect(frameProblems(withEq(s(), k, () => () => null)).some(p => /railBracket not drawn/.test(p))).toBe(true);
    });
    /** D-LIB18-BALANCE: the machine-held body: its centre of mass (Winter 2009 table 4.1 fractions on the drawn landmarks)
     *  lies between its rearmost pad contact (the upper back on the back pad) and its front support (the toes on the
     *  plate) in every drawn pose and ghost. */
    const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const comOf = (L: any) => {
      const parts: [number, number[]][] = [[0.497, lerp3(L.hips, L.shoulders, 0.5)], [0.081, L.ear]];
      for (const side of ['l', 'r']) parts.push([0.028, lerp3(L[`shoulder.${side}`], L[`elbow.${side}`], 0.436)], [0.016, lerp3(L[`elbow.${side}`], L[`wrist.${side}`], 0.430)],
        [0.006, lerp3(L[`wrist.${side}`], L[`grip.${side}`], 0.5)], [0.100, lerp3(L[`hip.${side}`], L[`knee.${side}`], 0.433)], [0.0465, lerp3(L[`knee.${side}`], L[`ankle.${side}`], 0.433)],
        [0.0145, lerp3(L[`ankle.${side}`], L[`toe.${side}`], 0.5)]);
      const m = parts.reduce((t, [w]) => t + w, 0);
      return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i]! / m), [0, 0, 0]);
    };
    const comProblems = (spec: any) => allPoses(spec).flatMap(([pose, L]) => {
      const z = comOf(L)[2]!, back = L.backUpper[2], toe = Math.max(L['toe.l'][2], L['toe.r'][2]);
      return z > back && z < toe ? [] : [`${pose}: centre of mass z ${z.toFixed(3)} not between the upper back ${back.toFixed(3)} and the toes ${toe.toFixed(3)}`];
    });
    it('the centre of mass lies between the back-pad contact and the toes in every drawn pose and ghost (offsets logged)', () => {
      for (const [pose, L] of allPoses(s())) { const z = comOf(L)[2]!; console.log(`LIB-18 hack_squat ${pose}: centre of mass ${((z - L.backUpper[2]) * 100).toFixed(1)} cm ahead of the upper back, ${((L['toe.r'][2] - z) * 100).toFixed(1)} cm behind the toes`); }
      expect(comProblems(s())).toEqual([]);
    });
    it('mutation: the end body moved 90 cm forward off the machine is red', () => {
      const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1], e.root.at[2] + 0.9] } } } };
      expect(comProblems(bad).some(p => p.startsWith('end:'))).toBe(true);
    });
  });

  describe('LIB-18 hack_squat A15: Mistake clearance, leaders, phantom, soft knee, tells, cues, report', { timeout: T }, () => {
    const clearance = (spec: any) => {
      const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
      return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
        const pts = xy(m[1]!), samp: number[][] = [];
        for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
        const min = Math.min(...samp.map(p => outside(polys, p)));
        return min >= 6 ? [] : [`arrow ${min.toFixed(1)} px from the end figure`];
      });
    };
    it('no solid red part within 6 px of the solid end figure (the faulty back contour is a dashed guide)', () => { expect(clearance(s())).toEqual([]); });
    it('mutation: an arrow from the end buttock to the Mistake buttock (inside the figure) is red', () => {
      const guides = [...s().mistake.guides, { kind: 'arrow', from: { at: 'buttock', pose: 'end' }, to: { at: 'buttock', pose: 'mistake' } }];
      expect(clearance({ ...s(), mistake: { ...s().mistake, guides } }).length).toBe(1);
    });
    /** Lines a leader keeps 6 px from (away from its first 8 px): the Trace and every drawn equipment outline (pads, the
     *  plate, the rail, the frame, the stop, the handle and the start phantom). */
    const NIT_PENDING = ['back', 'soft'];   // D-LIB15-NIT1 candidates: the start knee sits in a closed pocket (header; LB8 note); "Back on pad" ends on the sacrum at the pad (D-LIB18-BACKPAD)
    const gaps = (spec: any) => {
      const out: { key: string, mistake: boolean, min: number }[] = [], cam = camOf(spec);
      for (const mistake of [false, true]) {
        const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg, list = listOf(spec, mistake), avoid: number[][][] = [];
        for (const m of svg.matchAll(/<path class="trace"[^>]*? d="([^"]+)"/g)) avoid.push(...segs(xy(m[1]!)));
        for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items) if (it.type !== 'floor') for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) avoid.push(...segs(it.type === 'line' ? pts : [...pts, pts[0]])); }
        leadersOf(svg).forEach((p, i) => {
          let min = Infinity;
          for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) { const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40]; if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) min = Math.min(min, segD(q, g[0]!, g[1]!)); }
          out.push({ key: list[i]?.key, mistake, min });
        });
      }
      return out;
    };
    it('no leader within 6 px of the Trace or any equipment, but the ruling-pending ones; the pending list is exactly the failing leaders', () => {
      const g = gaps(s());
      for (const x of g) console.log(`LIB-18 hack_squat leader ${x.mistake ? 'mistake' : 'normal'} ${x.key}: ${x.min.toFixed(1)} px from the nearest Trace or equipment line`);
      expect(g.filter(x => x.min < 6).map(x => x.key).sort()).toEqual([...NIT_PENDING].sort());
    });
    it('mutation: the "Thighs to parallel" box moved under the plate (its leader across the plate edge) is red', () => {
      const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'parallel' ? { ...x, box: { left: 200, top: 318 } } : x)) };
      expect(gaps(bad).some(x => x.key === 'parallel' && x.min < 6)).toBe(true);
    });
    /** No leader runs across the solid end figure (both plates) or, on the Mistake plate, across the Mistake figure. */
    const crossProblems = (spec: any) => {
      const out: string[] = [];
      for (const mistake of [false, true]) {
        const polys = [...shapesIn(spec, 'end'), ...(mistake ? shapesIn(spec, 'mistake') : [])].map((x: any) => x.poly), list = listOf(spec, mistake);
        leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
          const { entries, len } = entryOf(polys, p), tag = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`;
          // D-LIB18-LIFT: a Mistake leader may enter the figure once, at most 81.9 px long; the pending normal "Back on
          // pad" is held to the same bound
          if (entries > 1 || len > 81.9) out.push(`${tag}: enters ${entries} times, ${len.toFixed(1)} px`);
          else if (entries && !mistake) out.push(`${tag}: crosses the figure`);
        });
      }
      return out;
    };
    // The two tells enter the end figure once, from the front (D-LIB18-LIFT). "Back on pad" on the sacrum
    // (D-LIB18-BACKPAD): no box reaches it without crossing the sled or entering the figure (scan in DESIGN.md section
    // 13), so its single front entry is the one pending named-nit candidate.
    it('no leader crosses the figure, but the Mistake tells once each (at most 81.9 px) and the pending "Back on pad"', () => { expect(crossProblems(s())).toEqual(['normal back: crosses the figure']); });
    it('mutation: the "Back on pad" box placed behind the rail (its leader across the body) is red', () => {
      const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'back' ? { ...x, box: { left: 20, top: 200 } } : x)) };
      expect(crossProblems(bad).filter(x => x.startsWith('normal back:') && x !== 'normal back: crosses the figure').length).toBeGreaterThan(0);
    });
    it('mutation: the "Hips off pad" box moved far above the figure (its leader past 81.9 px) is red', () => {
      const bad = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((x: any) => (x.key === 'lift' ? { ...x, box: { left: 252, top: 40 } } : x)) } };
      expect(crossProblems(bad).some(x => x.startsWith('mistake lift: enters'))).toBe(true);
    });
    /** No leader crosses another label's text box (report ink boxes). */
    const textProblems = (spec: any) => [false, true].flatMap(mistake => {
      const R = plate.renderPlate(spec, { id: 'x', mistake }), list = listOf(spec, mistake), boxes = R.report.labels.filter((l: any) => l.key !== 'meta');
      return leadersOf(R.svg).flatMap((p, i) => boxes.filter((b: any) => b.key !== list[i]?.key).flatMap((b: any) => {
        const hit = segs(p).some(([a, c]) => { for (let k = 0; k <= 40; k++) { const q = [a![0]! + (c![0]! - a![0]!) * k / 40, a![1]! + (c![1]! - a![1]!) * k / 40]; if (q[0]! > b.ink.x0 && q[0]! < b.ink.x1 && q[1]! > b.ink.y0 && q[1]! < b.ink.y1) return true; } return false; });
        return hit ? [`${list[i]?.key} crosses ${b.key}`] : [];
      }));
    });
    it('no leader crosses another label\'s text', () => { expect(textProblems(s())).toEqual([]); });
    it('mutation: the "Lower back rounds" box moved across the "Hips off pad" leader is red', () => {
      const bad = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((x: any) => (x.key === 'round' ? { ...x, box: { left: 300, top: 226 } } : x)) } };
      expect(textProblems(bad).length).toBeGreaterThan(0);
    });
    /** D-LIB18-DRAW: the start sled (dropped by the start layer) is redrawn dashed in the end layer, on the start sled's
     *  drawn back pad and shoulder pad (+-1 px). */
    const phantomProblems = (spec: any) => {
      const ph = itemsIn(spec, 'end').items.filter((i: any) => i.part === 'startSled'), st = sledItems(spec, 'start'), out: string[] = [];
      for (const [name, k] of [['backPad', 0], ['shoulderPad', 1]] as const) {
        const p = ph[k], ref = outlineOf(spec, st[name]);
        if (!p || !/\bm-line\b/.test(p.cls)) { out.push(`${name}: no dashed phantom`); continue; }
        const pts = outlineOf(spec, p), far = Math.max(...pts.map(q => Math.min(...segs([...ref, ref[0]!]).map(([a, b]) => segD(q, a!, b!)))));
        if (far > 1.5) out.push(`${name}: phantom ${far.toFixed(1)} px off the start sled`);
      }
      if (itemsIn(spec, 'start').items.some((i: any) => i.part === 'startSled')) out.push('phantom drawn in the start pose');
      return out;
    };
    it('the start sled is redrawn as a dashed phantom in the end layer', () => { expect(phantomProblems(s())).toEqual([]); });
    it('mutation: the phantom removed is red', () => {
      const ks = itemsIn(s(), 'end').items.filter((i: any) => i.part === 'startSled').map((i: any) => i.entry);
      const bad = { ...s(), equipment: s().equipment.map((e: any, i: number) => (ks.includes(i) ? () => null : e)) };
      expect(phantomProblems(bad).length).toBe(2);
    });
    /** c7 slight knee bend (KNEE_TOP, leg_press.mjs:13/:23): the drawn start knee sits off the hip-ankle line, in the view's
     *  plane, by at least 90 % of the offset its sized bend gives (the dumbbell_front_raise test, 6352396714). */
    const softProblems = (spec: any) => {
      const cam = camOf(spec), L = lmOf(spec, 'start'), [h, k, a] = ['hip.r', 'knee.r', 'ankle.r'].map(n => cam.P(L[n])), H = 1.75;
      const lt = 0.245 * H * cam.pxm, ls = 0.246 * H * cam.pxm, b = HQ.SIZES.KNEE_TOP * Math.PI / 180;
      const ha = Math.sqrt(lt * lt + ls * ls + 2 * lt * ls * Math.cos(b)), want = lt * ls * Math.sin(Math.PI - b) / ha;   // sized offset (px)
      const off = segD(k!, h!, a!);
      return off >= 0.9 * want ? [] : [`start knee ${off.toFixed(1)} px off the hip-ankle line < 90 % of ${want.toFixed(1)} px`];
    };
    it('the slight knee bend shows in the side view', () => { expect(softProblems(s())).toEqual([]); });
    it('mutation: the start knee drawn straight (the sled 5 cm higher than the bend) is red', () => {
      const st = s().poses.start, U = HS().U, bad = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: st.root.at.map((v: number, i: number) => v + U[i] * 0.05) } } } };
      expect(softProblems(bad).length).toBe(1);
    });
    /** Each tell's anchor sits on the Mistake figure's drawn outline (within 1.5 px) and outside the solid end figure. */
    const tellProblems = (spec: any) => {
      const cam = camOf(spec), L = qaEng.poseLandmarks(Eng(), spec).lm, mp = shapesIn(spec, 'mistake').map((x: any) => x.poly), ep = shapesIn(spec, 'end').map((x: any) => x.poly);
      return spec.mistake.tells.flatMap((t: any) => {
        const p = qaEng.resolvePoint(t.anchor, 'mistake', L, cam), onM = Math.abs(outside(mp, p)), offE = outside(ep, p);
        // or on a dashed Mistake guide drawn on top (the faulty back contour), which the engine never masks
        const gs = (spec.mistake.guides ?? []).filter((g: any) => g.kind === 'dashed' && g.pts).map((g: any) => g.pts.map((q: any) => qaEng.resolvePoint(q, 'mistake', L, cam)));
        const onG = Math.min(Infinity, ...gs.flatMap((g: number[][]) => segs(g).map(([a, b]) => segD(p, a!, b!))));
        return (onM <= 1.5 && offE >= -0.5) || onG <= 1.5 ? [] : [`${t.key}: anchor ${onM.toFixed(1)} px from the Mistake outline, ${offE.toFixed(1)} px from the end figure, ${onG.toFixed(1)} px from a dashed guide`];
      });
    };
    it('each tell anchor sits on the drawn Mistake outline, outside the end figure', () => { expect(tellProblems(s())).toEqual([]); });
    it('mutation: one tell\'s anchor moved to open space is red', () => {
      const bad = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((x: any, i: number) => (i === 0 ? { ...x, anchor: { at: 'knee.r', pose: 'mistake', off: [40, -60] } } : x)) } };
      expect(tellProblems(bad).length).toBe(1);
    });
    /** Q-D5-6 cue table: each callout cue (card `what`) and tell cue is one sentence of at most 15 words, no semicolon; the
     *  callout labels are the card's checkpoint labels. */
    const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
      const w = c.cue.trim().split(/\s+/).length, sentences = c.cue.split(/[.!?](\s|$)/).filter((x: string) => x && x.trim()).length;
      return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(sentences !== 1 ? [`${c.key}: ${sentences} sentences`] : [])];
    });
    it('cues: one sentence, at most 15 words, no semicolon; labels from the card', () => {
      expect(cueProblems(s())).toEqual([]);
      const card = JSON.parse(readFileSync('docs/research/howto/cards/hack_squat.json', 'utf8'));
      expect(s().callouts.map((c: any) => c.text.replace('<br>', ' '))).toEqual(card.plate.checkpoints.map((c: any) => c.label));
    });
    it('mutation: the card\'s two-sentence c7 cue (16 words with a period inside) is red', () => {
      const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'soft' ? { ...x, cue: 'Extend fully without locking the knees. Keep a slight bend at the very top of each rep.' } : x)) };
      expect(cueProblems(bad).length).toBeGreaterThan(0);
    });
    it('the engine report is clean on the normal and the Mistake plate', () => {
      expect(plate.renderPlate(s(), { id: 'x' }).report.issues).toEqual([]);
      expect(plate.renderPlate(s(), { id: 'x', mistake: true }).report.issues).toEqual([]);
    });
    it('mutation: the "Thighs to parallel" box moved onto the figure gives an engine issue', () => {
      const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'parallel' ? { ...x, box: { left: 160, top: 200 } } : x)) };
      expect(plate.renderPlate(bad, { id: 'x' }).report.issues.length).toBeGreaterThan(0);
    });
  });

  describe('LIB-18 hack_squat card facts, tempo, trace and PQ-H3 (drawn items)', { timeout: T }, () => {
    const R2D = 180 / Math.PI;
    /** c4: the knee bends about 90 at the bottom: the engine's 3D knee angle and the drawn arc, +-2 deg. */
    const kneeProblems = (spec: any) => {
      const r = rep(spec), k = r.angles.end['knee.r'], arc = r.measure.drawnDeg;
      return [...(Math.abs(k - 90) > 2 ? [`end knee ${k}`] : []), ...(Math.abs(arc - 90) > 2 ? [`arc ${arc}`] : [])];
    };
    it('c4: knee 90 at the bottom (+-2 deg), drawn arc 90 (+-2 deg)', () => { expect(kneeProblems(s())).toEqual([]); });
    it('mutation: the end feet 6 cm nearer the hips (the knee bends more) is red', () => {
      const e = s().poses.end, pl = e.plant, mv = (f: any) => ({ ...f, at: [f.at[0], f.at[1], f.at[2] - 0.06] });
      expect(kneeProblems({ ...s(), poses: { ...s().poses, end: { ...e, plant: { l: mv(pl.l), r: mv(pl.r) } } } }).length).toBeGreaterThan(0);
    });
    /** c5, plate.end: the thighs about parallel to the plate at the bottom: the drawn thigh (hip -> knee, side view)
     *  against the drawn plate's top face, +-2 deg. */
    const parallelProblems = (spec: any) => {
      const cam = camOf(spec), L = lmOf(spec, 'end'), [h, k] = [cam.P(L['hip.r']), cam.P(L['knee.r'])], top = outlineOf(spec, sledItems(spec, 'end').plate);
      const a = Math.atan2(k[1]! - h[1]!, k[0]! - h[0]!) * R2D, b = Math.atan2(top[1]![1]! - top[0]![1]!, top[1]![0]! - top[0]![0]!) * R2D;
      return Math.abs(a - b) <= 2 ? [] : [`thigh ${(a - b).toFixed(1)} deg off the plate`];
    };
    it('c5: thighs parallel to the plate at the bottom (+-2 deg)', () => { expect(parallelProblems(s())).toEqual([]); });
    it('mutation: the end hips 6 cm higher on the pad (thighs sloping down to the knee) is red', () => {
      const e = s().poses.end, U = HS().U, bad = { ...s(), poses: { ...s().poses, end: { ...e, root: { ...e.root, at: e.root.at.map((v: number, i: number) => v + U[i] * 0.06) } } } };
      expect(parallelProblems(bad).length).toBe(1);
    });
    it('c7: the top knee is bent its sized KNEE_TOP (+-2 deg) and never 0', () => {
      const k = rep(s()).angles.start['knee.r'];
      expect(Math.abs(k - HQ.SIZES.KNEE_TOP)).toBeLessThanOrEqual(2);
      expect(k).toBeGreaterThan(5);
    });
    /** D-LIB18-TEMPO: the strip is built from lb8/tempo.json's row and the card's plate.tempo only. */
    const tempoOf = () => {
      const row = JSON.parse(readFileSync('tools/plates/library/lb8/tempo.json', 'utf8')).ids.hack_squat.rows, card = JSON.parse(readFileSync('docs/research/howto/cards/hack_squat.json', 'utf8')).plate.tempo;
      return row.map((r: any) => ({ phase: r.phase, s: card[r.from], ...(r.move ? { move: true } : {}) }));
    };
    it('the tempo strip follows the card (Lower 3, Push 1, Hold 1)', () => { expect(s().tempo).toEqual(tempoOf()); });
    it('mutation: a Rest phase added is red', () => { expect([...s().tempo, { phase: 'Rest', s: 1 }]).not.toEqual(tempoOf()); });
    it('D-LIB18-TRACE: the Trace follows the knee (plate.frames)', () => {
      expect(s().trace.point).toBe('knee.r');
      expect(JSON.parse(readFileSync('docs/research/howto/cards/hack_squat.json', 'utf8')).plate.frames).toMatch(/Trace follows the knee/);
    });
    /** PQ-H3 node-side (qa/node.mjs nodeMetrics), against qa/envelope.json; values posted. */
    it('PQ-H3: Trace length and Mistake deviation measured (posted beside the size table)', () => {
      const R = { normal: plate.renderPlate(s(), { id: 'x-n' }), mistake: plate.renderPlate(s(), { id: 'x-m', mistake: true }) };
      const c = { spec: s(), plate: { normal: R.normal, mistake: R.mistake, alt: s().alt, mistakeAlt: '' } };
      const m = qaNode.nodeMetrics(c, { engine: Eng(), envelope: pins().envelope }, R), env = pins().envelope;
      console.log(`LIB-18 hack_squat PQ-H3: Trace ${m.traceLen.toFixed(1)} px (min ${env.traceLenMin}), deviation ${m.deviation.toFixed(1)} px (min ${env.deviationMin}), ${m.pxPerM.toFixed(2)} px/m`);
      expect(m.traceLen).toBeGreaterThanOrEqual(env.traceLenMin);
      expect(m.deviation).toBeGreaterThanOrEqual(env.deviationMin);
    });
    /** A17: every unsourced number equals its lb8/sizes.json row (both ways; the builder writes the rows from the note). */
    it('A17: SIZES, the solved values and hackSled\'s constants equal lb8/sizes.json (both ways), the trace point its `trace` row', () => {
      const p = 'tools/plates/library/lb8/sizes.json';
      expect(existsSync(p)).toBe(true);
      const J = JSON.parse(readFileSync(p, 'utf8')).ids, row = J.hack_squat, comp = J.hackSled, SOLVED = ['TILT', 'SOLE_Z', 'TRAVEL', 'RAIL_LO'];
      for (const [k, v] of Object.entries(HQ.SIZES)) expect(row[k]?.value, k).toEqual(v);
      for (const k of SOLVED) { expect(row[k]?.basis, k).toMatch(/^solved/); expect(row[k].value, k).toBe('solved'); expect(+/solves to (-?[\d.]+)/.exec(row[k].basis)![1]!, k).toBeCloseTo(HQ[k], 3); }
      for (const k of Object.keys(row).filter(k => k !== 'trace')) expect(k in HQ.SIZES || SOLVED.includes(k), k).toBe(true);
      for (const [k, v] of Object.entries(sledEq.HACK_SLED)) expect(comp[k]?.value, `hackSled.${k}`).toEqual(v);
      for (const k of Object.keys(comp)) expect(k in sledEq.HACK_SLED, `hackSled.${k}`).toBe(true);
      for (const v of [...Object.values(row), ...Object.values(comp)] as any[]) { expect(v.basis).toMatch(/\S/); expect(v.basis).not.toMatch(/PQ-H3|deviationMin|traceLenMin/); }
      expect(row.trace.value).toBe(s().trace.point);
    });
  });
}

// ---- seated_calf_raise (slice; eq/calfMachine.mjs; held S2, S4): its own helper copies, scoped to this block ----
{
  let eng: any, body: any, qaEng: any, plate: any, calf: any, M: any;
  beforeAll(async () => {
    [eng, body, qaEng, plate, calf, M] = await Promise.all(['engine.mjs', '../vendor/engine/body.mjs', 'qa/engine.mjs', '../vendor/engine/plate.mjs',
      'eq/calfMachine.mjs', 'specs/seated_calf_raise.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  }, T);

  // ---- helpers (lb7test.ts:44-94, unchanged) ----
  const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
  const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
    const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
    const ctx = { pose, start: L.lm.start, mistake, body: L.body };
    const out: any[] = [];
    spec.equipment.forEach((e: any, i: number) => {
      for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
    });
    return { items: out, lm };
  };
  const lmOf = (spec: any, pose: string) => qaEng.poseLandmarks(Eng(), spec).lm[pose];
  const rep = (spec: any, mistake = false) => plate.renderPlate(spec, { id: 'x', mistake }).report;
  const CAMS = new WeakMap<object, any>();
  const camOf = (spec: any) => {
    if (CAMS.has(spec)) return CAMS.get(spec);
    const c = rep(spec).camera, side = spec.view === 'side';
    const cam = { view: side ? 'side' : 'front', near: side ? 'r' : null, facing: 'right', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + (side ? w[2]! : w[0]!) * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
    CAMS.set(spec, cam); return cam;
  };
  const fullPose = (spec: any, pose: string) => (pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose]);
  const shapesOfQ = (spec: any, q: any) => body.bodyShapes(body.fk(q, { height: 1.75 }), camOf(spec), { armsFront: spec.armsFront, hand: spec.hand }).filter((x: any) => x.poly);
  const shapesIn = (spec: any, pose: string) => { const b = { height: 1.75 }; return shapesOfQ(spec, body.resolve(body.normPose(fullPose(spec, pose), b), b).q); };
  /** Ghost poses as the engine draws them (plate.mjs:69-76: evenly spaced along start -> end). */
  const ghostQs = (spec: any) => { const b = { height: 1.75 }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts?.count ?? 3;
    return Array.from({ length: n }, (_, i) => body.poseAt(keys, (i + 1) / (n + 1), b).q); };
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
  const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
  const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
  const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((s, x, i) => s + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
  const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });

  // ---- this plate ----
  const s = () => M.default;
  const POSES = ['start', 'end', 'mistake'];
  // composer slot order (eq/calfMachine.mjs calfMachine's return): entry 1 + slot
  const SLOT = { beam: 0, platPost: 1, platform: 2, seatPost: 3, seat: 4, tower: 5, hub: 6, arm: 7, pad: 8, handlePost: 9, grip: 10, safety: 11 } as const;
  const E = (slot: number) => 1 + slot;
  /** The drawn polygons (plate px) of every composer item in one pose, keyed by entry index. */
  const drawnEq = (spec: any, pose: string) => { const cam = camOf(spec), out: Record<number, any> = {};
    for (const it of itemsIn(spec, pose, { mistake: pose === 'mistake' }).items) { const d = eng.PRIMITIVES[it.type](it, cam); out[it.entry] = { ...it, polys: d.filter((x: any) => x.poly).map((x: any) => x.poly), lines: d.filter((x: any) => x.line).map((x: any) => x.line) }; }
    return out; };
  const polyGap = (A: number[][][], B: number[][][]) => Math.min(...A.flatMap(P => P.map(p => outside(B, p))), ...B.flatMap(P => P.map(p => outside(A, p))));
  const shiftItem = (it: any, dz: number) => (it?.surface ? { ...it, surface: it.surface.map((p: number[]) => [p[0], p[1], p[2]! + dz]) } : it?.pts ? { ...it, pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! + dz]) } : it);
  /** A spec whose end (or start) foot plant is turned to toe-down angle d about the same ball (the spec's own plant form). */
  const turnFoot = (spec: any, pose: 'start' | 'end', d: number, dy = 0) => {
    const a = d * Math.PI / 180, n = [0, Math.cos(a), Math.sin(a)], t = [0, -Math.sin(a), Math.cos(a)], P = spec.poses[pose].plant;
    const side = (c: any) => ({ ...c, at: [c.at[0], c.at[1] + dy, c.at[2]], normal: n, toe: t });
    return { ...spec, poses: { ...spec.poses, [pose]: { ...spec.poses[pose], plant: { l: side(P.l), r: side(P.r) } } } };
  };

  describe('LB8 seated_calf_raise: calfMachine composer (A2, A18 frame)', () => {
    const typeProblems = (spec: any) => POSES.flatMap(p => itemsIn(spec, p).items.filter((i: any) => !eng.PRIMITIVES[i.type]).map((i: any) => `${p}: ${i.type}`));
    it('returns PRIMITIVES types only; a {type: "wedge"} is red', () => {
      expect(typeProblems(s())).toEqual([]);
      expect(typeProblems(withEq(s(), E(SLOT.safety), () => () => ({ type: 'wedge', part: 'lever' })))).toEqual(['start: wedge', 'end: wedge', 'mistake: wedge']);
    });
    /** Static parts (frame, platform, seat) draw the same polygon (+-1 px) in start, end and Mistake; every part that
     *  moves between the end and the Mistake carries a polygon (`poly` or the sideBar backPad), so the Mistake draws it. */
    const a2Problems = (spec: any) => {
      const D: Record<string, any> = Object.fromEntries(POSES.map(p => [p, drawnEq(spec, p)])), out: string[] = [];
      for (const k of Object.keys(D.end).map(Number)) {
        const it = D.end[k], same = (p: string) => D[p][k] && D[p][k].polys.length === it.polys.length && D[p][k].polys.every((P: number[][], i: number) => P.every((q, j) => Math.hypot(q[0]! - it.polys[i][j][0], q[1]! - it.polys[i][j][1]) <= 1));
        if (['frame', 'platform', 'seat'].includes(it.part)) { for (const p of ['start', 'mistake']) if (!same(p)) out.push(`static ${it.part} entry ${k} moves in ${p}`); }
        else if (it.part === 'lever') {
          if (!['poly', 'backPad'].includes(it.type) || !it.polys.length) out.push(`moving entry ${k} is a ${it.type} without a polygon`);
          if (same('mistake')) out.push(`lever entry ${k} does not move between the end and the Mistake`);
        }
      }
      return out;
    };
    it('A2: static parts fixed (+-1 px) in start, end and Mistake; the lever parts carry poly and move', () => {
      expect(a2Problems(s())).toEqual([]);
    });
    it('A2 mutations: the platform moved 2 cm in the Mistake, and the lever arm drawn with `line`, are red', () => {
      const moved = withEq(s(), E(SLOT.platform), e => (lm: any, ctx: any) => (ctx.pose === 'mistake' ? shiftItem(e(lm, ctx), 0.02) : e(lm, ctx)));
      expect(a2Problems(moved)).toContain(`static platform entry ${E(SLOT.platform)} moves in mistake`);
      const asLine = withEq(s(), E(SLOT.arm), e => (lm: any, ctx: any) => { const it = e(lm, ctx), u = it.surface; return { type: 'line', pts: u, part: 'lever', z: 'back' }; });
      expect(a2Problems(asLine)).toContain(`moving entry ${E(SLOT.arm)} is a line without a polygon`);
    });
    /** D-LIB18-FRAME: each pad, seat, platform and lever joins its frame (touching or overlapping polygons, <= 0.5 px). */
    const JOINS: [keyof typeof SLOT, keyof typeof SLOT][] = [['platform', 'platPost'], ['platPost', 'beam'], ['seat', 'seatPost'], ['seatPost', 'beam'], ['tower', 'beam'],
      ['hub', 'tower'], ['arm', 'hub'], ['arm', 'pad'], ['handlePost', 'pad'], ['grip', 'handlePost'], ['safety', 'arm']];
    const frameProblems = (spec: any) => POSES.flatMap(p => { const D = drawnEq(spec, p);
      return JOINS.filter(([a, b]) => !D[E(SLOT[a])] || !D[E(SLOT[b])] || polyGap(D[E(SLOT[a])].polys, D[E(SLOT[b])].polys) > 0.5).map(([a, b]) => `${p}: ${a} not joined to ${b}`); });
    it('A18: every pad, seat, platform and lever part is joined to the frame in every pose', () => {
      expect(frameProblems(s())).toEqual([]);
    });
    it('A18 mutation: the platform post removed is red', () => {
      expect(frameProblems(withEq(s(), E(SLOT.platPost), () => () => null))).toContain('end: platform not joined to platPost');
    });
    it('the standing form (standing_calf_raise, later) draws PRIMITIVES only, joined, with its shoulder pad a poly', () => {
      const p = { form: 'standing', floorZ: [-0.6, 0.5], platform: { top: 0.12, z: [0.05, 0.2], postZ: 0.12 }, pivot: [0, 1.2, -0.5], arm: 0.5, angle: 5, toward: 1, towerZ: -0.5 };
      const items = calf.calfMachine(p), cam = camOf(s());
      expect(items.length).toBe(calf.CALF_MACHINE_ITEMS);
      expect(items.filter(Boolean).every((i: any) => eng.PRIMITIVES[i.type])).toBe(true);
      expect(items[SLOT.seat]).toBeNull();
      expect(items[SLOT.pad].type).toBe('poly');
      const poly = (k: number) => eng.PRIMITIVES[items[k].type](items[k], cam).filter((x: any) => x.poly).map((x: any) => x.poly);
      expect(polyGap(poly(SLOT.arm), poly(SLOT.pad))).toBeLessThanOrEqual(0.5);
      expect(polyGap(poly(SLOT.tower), poly(SLOT.beam))).toBeLessThanOrEqual(0.5);
    });
  });

  describe('LB8 seated_calf_raise: contacts and physics (A2, A18)', () => {
    const cm = (spec: any) => camOf(spec).pxm / 100;                // px per cm
    /** Each contact the card places, on its drawn item (+-1 cm): balls on the platform's top (c3), hands on the grip
     *  (c5), the pelvis on the seat pad, the roller pad on the drawn thighs (c1, c2). */
    const contactProblems = (spec: any) => POSES.flatMap(p => {
      const L = lmOf(spec, p), D = drawnEq(spec, p), cam = camOf(spec), k = cm(spec), out: string[] = [];
      const plat = D[E(SLOT.platform)].polys[0], top = Math.min(...plat.map((q: number[]) => q[1])), x0 = Math.min(...plat.map((q: number[]) => q[0])), x1 = Math.max(...plat.map((q: number[]) => q[0]));
      for (const sd of ['l', 'r']) { const b = cam.P(L[`ball.${sd}`]); if (Math.abs(b[1]! - top) > k || b[0]! < x0 || b[0]! > x1) out.push(`${p}: ball.${sd} off the platform`); }
      const g = D[E(SLOT.grip)].polys[0], gc = [g.reduce((a: number, q: number[]) => a + q[0]!, 0) / g.length, g.reduce((a: number, q: number[]) => a + q[1]!, 0) / g.length];
      for (const sd of ['l', 'r']) { const w = cam.P(L[`grip.${sd}`]); if (Math.hypot(w[0]! - gc[0]!, w[1]! - gc[1]!) > k) out.push(`${p}: grip.${sd} off the handle`); }
      const seat = D[E(SLOT.seat)].polys[0], st = Math.min(...seat.map((q: number[]) => q[1])), sp = cam.P(L.seat);
      if (Math.abs(sp[1]! - st) > k) out.push(`${p}: seat point ${((sp[1]! - st) / k).toFixed(1)} cm off the pad`);
      const thigh = shapesIn(spec, p).filter((x: any) => /^(thigh|kneecap)\./.test(x.key)).map((x: any) => x.poly), pad = D[E(SLOT.pad)].polys;
      const gap = polyGap(pad, thigh), deep = Math.min(...thigh.flatMap((P: number[][]) => P.map(q => outside(pad, q))));
      if (gap > k) out.push(`${p}: pad ${(gap / k).toFixed(1)} cm off the thighs`);
      if (deep < -k) out.push(`${p}: thigh ${(-deep / k).toFixed(1)} cm inside the pad`);
      return out;
    });
    it('A2: balls on the platform, hands on the grip, pelvis on the seat, pad on the thighs (+-1 cm) in every pose', () => {
      expect(contactProblems(s())).toEqual([]);
    });
    it('A2 mutation: one foot 2 cm off its platform at the end is red', () => {
      const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, plant: { ...e.plant, r: { ...e.plant.r, at: [e.plant.r.at[0], e.plant.r.at[1] + 0.02, e.plant.r.at[2]] } } } } };
      expect(contactProblems(bad)).toContain('end: ball.r off the platform');
    });
    /** Every drawn pose: start, end, Mistake and the ghosts. */
    const allQs = (spec: any) => { const b = { height: 1.75 };
      return [...POSES.map(p => [p, body.resolve(body.normPose(fullPose(spec, p), b), b).q]), ...ghostQs(spec).map((q: any, i: number) => [`ghost${i}`, q])] as [string, any][]; };
    const floorProblems = (spec: any) => { const floorY = camOf(spec).P([0, 0, 0])[1]!;
      return allQs(spec).flatMap(([p, q]) => shapesOfQ(spec, q).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => x.poly.some((v: number[]) => v[1]! > floorY) ? [`${p}: ${x.key} below the floor`] : [])); };
    it('A18: every drawn foot on or above the floor line in every pose, ghosts included', () => {
      expect(floorProblems(s())).toEqual([]);
    });
    it('A18 mutation: the start heel 1 px below the floor line is red', () => {
      const st = s().poses.start, cam = camOf(s()), floorY = cam.P([0, 0, 0])[1]!;
      const lowest = Math.max(...shapesIn(s(), 'start').filter((x: any) => x.key === 'foot.r').flatMap((x: any) => x.poly.map((v: number[]) => v[1]!)));
      const drop = (floorY - lowest + 1) / cam.pxm;                                // the whole start body 1 px lower than the foot touching the floor
      const low = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [0, st.root.at[1] - drop, 0] }, plant: { l: { ...st.plant.l, at: [st.plant.l.at[0], st.plant.l.at[1] - drop, st.plant.l.at[2]] }, r: { ...st.plant.r, at: [st.plant.r.at[0], st.plant.r.at[1] - drop, st.plant.r.at[2]] } } } } };
      expect(floorProblems(low)).toContain('start: foot.r below the floor');
    });
    /** The deepest drawn foot point under the platform's top face, inside its front-to-back span (cm; + = inside). */
    const toeDepth = (spec: any, q: any) => { const D = drawnEq(spec, 'start'), plat = D[E(SLOT.platform)].polys[0], k = cm(spec);
      const top = Math.min(...plat.map((v: number[]) => v[1])), x0 = Math.min(...plat.map((v: number[]) => v[0])), x1 = Math.max(...plat.map((v: number[]) => v[0]));
      return Math.max(-99, ...shapesOfQ(spec, q).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => x.poly.filter((v: number[]) => v[0]! >= x0 && v[0]! <= x1).map((v: number[]) => (v[1]! - top) / k))); };
    /** No body point more than 1 cm inside the seat pad or the platform it rests on. */
    const supportProblems = (spec: any, poses = allQs(spec)) => poses.flatMap(([p, q]) => {
      const D = drawnEq(spec, 'start'), seat = D[E(SLOT.seat)].polys, k = cm(spec), out: string[] = [];
      const inSeat = Math.min(...shapesOfQ(spec, q).flatMap((x: any) => x.poly.map((v: number[]) => outside(seat, v))));
      if (inSeat < -k) out.push(`${p}: body ${(-inSeat / k).toFixed(1)} cm inside the seat`);
      const t = toeDepth(spec, q); if (t > 1) out.push(`${p}: foot ${t.toFixed(1)} cm inside the platform`);
      return out;
    });
    it('A18: nothing more than 1 cm inside the seat in any pose; the start foot clear of the platform', { timeout: T }, () => {
      expect(supportProblems(s()).filter(x => / seat$/.test(x))).toEqual([]);
      expect(supportProblems(s(), allQs(s()).filter(([p]) => p === 'start'))).toEqual([]);
    });
    it('S4 (HELD, D-LIB18-CALF): the rigid foot puts the toe inside the platform at the card-true top; the numbers', { timeout: T }, () => {
      // Recorded, not passed: the end (ankle END_PF) and the Mistake show the toe inside the platform. This test pins the
      // measured depths so a change to the range or the platform shows here; the plate stays held until the owner rules.
      const qs = Object.fromEntries(allQs(s()));
      const end = toeDepth(s(), qs.end), mis = toeDepth(s(), qs.mistake);
      console.log(`LIB-18 seated_calf_raise S4: toe ${end.toFixed(2)} cm inside the platform at the end, ${mis.toFixed(2)} cm in the Mistake`);
      expect(end).toBeGreaterThan(1);
      expect(supportProblems(s())).toContain(`end: foot ${end.toFixed(1)} cm inside the platform`);
    });
    it('A18 mutation: a toe 2 cm inside the platform at the start is red', () => {
      expect(supportProblems(turnFoot(s(), 'start', 30), allQs(turnFoot(s(), 'start', 30)).filter(([p]) => p === 'start')).some(x => /start: foot .* inside the platform/.test(x))).toBe(true);
    });
    /** D-LIB18-BALANCE: the centre of mass (Winter 2009 table 4.1 fractions on the drawn landmarks, lb7test.ts:862-868)
     *  lies over the base the card's contacts give: between the pelvis on the seat and the balls on the platform. */
    const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const comOf = (L: any) => {
      const parts: [number, number[]][] = [[0.497, lerp3(L.hips, L.shoulders, 0.5)], [0.081, L.ear]];
      for (const side of ['l', 'r']) parts.push([0.028, lerp3(L[`shoulder.${side}`], L[`elbow.${side}`], 0.436)], [0.016, lerp3(L[`elbow.${side}`], L[`wrist.${side}`], 0.430)],
        [0.006, lerp3(L[`wrist.${side}`], L[`grip.${side}`], 0.5)], [0.100, lerp3(L[`hip.${side}`], L[`knee.${side}`], 0.433)], [0.0465, lerp3(L[`knee.${side}`], L[`ankle.${side}`], 0.433)],
        [0.0145, lerp3(L[`ankle.${side}`], L[`toe.${side}`], 0.5)]);
      const m = parts.reduce((t, [w]) => t + w, 0);
      return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i]! / m), [0, 0, 0]);
    };
    const balanceProblems = (spec: any) => allQs(spec).flatMap(([p, q]) => { const L = body.landmarks(body.fk(q, { height: 1.75 })), z = comOf(L)[2]!, seat = L.seat[2], ball = Math.min(L['ball.l'][2], L['ball.r'][2]);
      return z > seat && z < ball ? [] : [`${p}: centre of mass z ${z.toFixed(3)} not between the seat ${seat.toFixed(3)} and the balls ${ball.toFixed(3)}`]; });
    it('A18: the centre of mass between the seat contact and the balls in every pose (offsets logged)', () => {
      for (const p of POSES) { const L = lmOf(s(), p); console.log(`LIB-18 seated_calf_raise ${p}: centre of mass z ${comOf(L)[2]!.toFixed(3)} m, seat ${L.seat[2].toFixed(3)}, balls ${L['ball.r'][2].toFixed(3)}`); }
      expect(balanceProblems(s())).toEqual([]);
    });
    it('A18 mutation: the balls planted under the hips (base behind the centre of mass) is red', () => {
      const e = s().poses.end, back = (c: any) => ({ ...c, at: [c.at[0], c.at[1], 0] });
      expect(balanceProblems({ ...s(), poses: { ...s().poses, end: { ...e, plant: { l: back(e.plant.l), r: back(e.plant.r) } } } }).some(x => x.startsWith('end:'))).toBe(true);
    });
  });

  describe('LB8 seated_calf_raise: card facts, Mistake, labels (A6 candidates, A15, A17)', () => {
    /** Facts candidates (D-LIB18-FACTS): knee 90 at the start (c1, setup) and the end (c13, which plate.end cites), +-2;
     *  the shin vertical at the start (c4, a check: no model joint maps it), +-2; the trunk upright (c5, c13), +-2. */
    const factProblems = (spec: any) => ['start', 'end'].flatMap(p => { const L = lmOf(spec, p), out: string[] = [];
      const knee = angle3(L['hip.r'], L['knee.r'], L['ankle.r']); if (Math.abs(knee - 90) > 2) out.push(`${p}: knee ${knee.toFixed(1)}`);
      const trunk = Math.atan2(L.shoulders[2] - L.hips[2], L.shoulders[1] - L.hips[1]) * 180 / Math.PI; if (Math.abs(trunk) > 2) out.push(`${p}: trunk ${trunk.toFixed(1)} from upright`);
      if (p === 'start') { const sh = Math.atan2(L['ankle.r'][2] - L['knee.r'][2], L['knee.r'][1] - L['ankle.r'][1]) * 180 / Math.PI; if (Math.abs(sh) > 2) out.push(`start: shin ${sh.toFixed(1)} from vertical`); }
      return out; });
    it('knee 90 (+-2) at the start and the end, shin vertical at the start, trunk upright', () => {
      for (const p of ['start', 'end']) { const L = lmOf(s(), p); console.log(`LIB-18 seated_calf_raise ${p}: knee ${angle3(L['hip.r'], L['knee.r'], L['ankle.r']).toFixed(1)}`); }
      expect(factProblems(s())).toEqual([]);
    });
    it('fact mutation: the end foot turned so the knee reads 3+ degrees off 90 is red', () => {
      expect(factProblems(turnFoot(s(), 'end', 15)).some(x => x.startsWith('end: knee'))).toBe(true);
    });
    /** The red Mistake reads outside the solid end figure: some red foot point clears the end figure by >= 6 px (13.1). */
    const mistakeClear = (spec: any) => { const endS = shapesIn(spec, 'end').map((x: any) => x.poly), mf = shapesIn(spec, 'mistake').filter((x: any) => /^foot\./.test(x.key));
      return Math.max(...mf.flatMap((x: any) => x.poly.map((v: number[]) => outside(endS, v)))); };
    it('A15: the red Mistake foot clears the end figure by at least 6 px; the Mistake equal to the end is red', () => {
      console.log(`LIB-18 seated_calf_raise Mistake foot clearance ${mistakeClear(s()).toFixed(1)} px`);
      expect(mistakeClear(s())).toBeGreaterThanOrEqual(6);
      expect(mistakeClear({ ...s(), mistake: { ...s().mistake, pose: s().poses.end } })).toBeLessThan(6);
    });
    /** One tell (D-LIB10-SKULL1), its anchor on the drawn Mistake figure (within 2 px of its outline). */
    const tellProblems = (spec: any) => { const cam = camOf(spec), L = { mistake: lmOf(spec, 'mistake'), end: lmOf(spec, 'end') }, mS = shapesIn(spec, 'mistake').map((x: any) => x.poly);
      return spec.mistake.tells.flatMap((t: any) => { const a = t.anchor, w = cam.P(L[(a.pose ?? 'end') as 'mistake' | 'end'][a.at]), o = a.off ?? [0, 0], p = [w[0]! + o[0], w[1]! + o[1]];
        return Math.abs(outside(mS, p)) <= 2 ? [] : [`${t.key}: anchor ${outside(mS, p).toFixed(1)} px from the Mistake figure`]; }); };
    it('A15: one tell, key "range", anchored on the red heel; the anchor moved off the figure is red', () => {
      expect(s().mistake.tells.map((t: any) => t.key)).toEqual(['range']);
      expect(tellProblems(s())).toEqual([]);
      const off = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((t: any) => ({ ...t, anchor: { ...t.anchor, off: [40, 0] } })) } };
      expect(tellProblems(off).length).toBe(1);
    });
    /** Leaders (Do 7): after 4 px from the anchor, a leader never enters the solid figure, the start phantom, the ghosts
     *  (or, for a Mistake leader, the Mistake figure) and never runs within 6 px of the Trace, the pad, the seat or the
     *  platform's edges; it never crosses another label's text. */
    const leaderProblems = (spec: any, mistake: boolean) => {
      const R = plate.renderPlate(spec, { id: 'x', mistake }), out: string[] = [];
      const bodyPolys = [...shapesIn(spec, 'end'), ...shapesIn(spec, 'start'), ...ghostQs(spec).flatMap((q: any) => shapesOfQ(spec, q).filter((x: any) => /\.r$/.test(x.key) && /^(thigh|kneecap|shank|foot)/.test(x.key))),
        ...(mistake ? shapesIn(spec, 'mistake') : [])].map((x: any) => x.poly);
      const D = drawnEq(spec, 'end'), keepOff = [E(SLOT.pad), E(SLOT.seat), E(SLOT.platform)].flatMap(k => D[k].polys);
      const trace = mistake ? [] : [...R.svg.matchAll(/<path class="trace"[^>]* d="([^"]+)"/g)].flatMap(([, d]) => xy(d!));
      const labels = R.report.labels.filter((l: any) => l.key !== 'meta');
      leadersOf(R.svg).forEach((pts, i) => {
        const a = pts[0]!, samples: number[][] = [];
        for (let j = 1; j < pts.length; j++) { const p = pts[j - 1]!, q = pts[j]!, n = Math.ceil(Math.hypot(q[0]! - p[0]!, q[1]! - p[1]!)); for (let t = 0; t <= n; t++) samples.push([p[0]! + (q[0]! - p[0]!) * t / n, p[1]! + (q[1]! - p[1]!) * t / n]); }
        const far = samples.filter(p => Math.hypot(p[0]! - a[0]!, p[1]! - a[1]!) > 4), farther = samples.filter(p => Math.hypot(p[0]! - a[0]!, p[1]! - a[1]!) > 8);
        if (far.some(p => outside(bodyPolys, p) < 0)) out.push(`leader ${i} enters a figure`);
        if (farther.some(p => outside(keepOff, p) < 6)) out.push(`leader ${i} runs within 6 px of a pad, seat or platform`);
        if (trace.length && farther.some(p => trace.some(t => Math.hypot(t[0]! - p[0]!, t[1]! - p[1]!) < 6))) out.push(`leader ${i} runs within 6 px of the Trace`);
        if (far.some(p => labels.some((l: any, k: number) => k !== i && p[0]! > l.ink.x0 && p[0]! < l.ink.x1 && p[1]! > l.ink.y0 && p[1]! < l.ink.y1)) && labels.length > 1) {
          const own = labels.filter((l: any) => far.some(p => p[0]! > l.ink.x0 - 2 && p[0]! < l.ink.x1 + 2 && p[1]! > l.ink.y0 - 2 && p[1]! < l.ink.y1 + 2));
          if (own.length > 1) out.push(`leader ${i} crosses another label's text`);
        }
      });
      return out;
    };
    it('A15: no leader enters a figure, the start phantom or the ghosts, or runs near the Trace, a pad, the seat or the platform', () => {
      expect(leaderProblems(s(), false)).toEqual([]);
      expect(leaderProblems(s(), true)).toEqual([]);
    });
    it('A15 mutations: the "Balls of feet" box moved left (leader through the shins) and its anchor put on the platform edge are red', () => {
      const moved = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'balls' ? { ...c, box: { left: 100, top: 300 } } : c)) };
      expect(leaderProblems(moved, false).some(x => /enters a figure/.test(x))).toBe(true);
      const onEdge = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'balls' ? { ...c, box: { left: 214, top: 298 } } : c)) };
      expect(leaderProblems(onEdge, false).some(x => /within 6 px of a pad, seat or platform/.test(x))).toBe(true);
    });
    const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => { const w = c.cue.trim().split(/\s+/).length;
      return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...((c.cue.match(/[.!?](\s|$)/g) ?? []).length !== 1 ? [`${c.key}: not one sentence`] : [])]; });
    it('Q-D5-6: every cue is one sentence of 15 words or fewer, no semicolon; a 16-word cue is red', () => {
      expect(cueProblems(s())).toEqual([]);
      const long = { ...s(), callouts: s().callouts.map((c: any, i: number) => (i === 0 ? { ...c, cue: 'Keep the pad snug across both of your thighs just above the knees for the set.' } : c)) };
      expect(cueProblems(long)).toEqual(['pad: 16 words']);
    });
    it('callouts are the card\'s 3 checkpoints, with the knee arc expecting 90', () => {
      expect(s().callouts.map((c: any) => c.text.replace('<br>', ' '))).toEqual(['Pad above knees', 'Knees at 90', 'Balls of feet']);
      expect(rep(s()).measure).toEqual({ drawnDeg: expect.any(Number), expect: 90 });
      expect(Math.abs(rep(s()).measure.drawnDeg - 90)).toBeLessThanOrEqual(2);
    });
    /** A17: the trace point is the heel (D-LIB18-CALF, -TRACE), with its sized trim; SIZES matches lb8/sizes.json both
     *  ways once that file holds the row (the builder's). */
    const traceProblems = (spec: any, sizes = M.SIZES) => [...(spec.trace.point !== 'heel.r' ? [`trace at ${spec.trace.point}`] : []), ...(JSON.stringify(spec.trace.trim) !== JSON.stringify(sizes.TRACE_TRIM) ? ['trim not TRACE_TRIM'] : [])];
    it('A17: the Trace follows the heel with TRACE_TRIM; traced at the toe is red', () => {
      expect(traceProblems(s())).toEqual([]);
      expect(traceProblems({ ...s(), trace: { ...s().trace, point: 'toe.r' } })).toEqual(['trace at toe.r']);
      const f = 'tools/plates/library/lb8/sizes.json';
      if (existsSync(f)) { const row = JSON.parse(readFileSync(f, 'utf8')).seated_calf_raise;
        if (row) { const names = Object.keys(row).filter(k => k !== 'trace'); expect(names.sort()).toEqual(Object.keys(M.SIZES).sort());
          for (const k of names) expect(row[k].value).toEqual(M.SIZES[k]); expect(row.trace.value).toBe('heel.r'); } }
    });
    it('A7: the tempo strip is the ruled row (Raise up 2, Hold pause 1, Lower down 2); a 2 s Hold is red', () => {
      const want = [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }];
      expect(s().tempo).toEqual(want);
      expect({ ...s(), tempo: s().tempo.map((t: any) => (t.phase === 'Hold' ? { ...t, s: 2 } : t)) }.tempo).not.toEqual(want);
    });
    it('report.mjs engine checks: ok in the plate and the Mistake; a box moved onto the figure is red', () => {
      expect(rep(s()).issues).toEqual(['check:start:toe.l:4.2cm', 'check:start:toe.r:4.2cm']);   // the S4 fact miss (CARD FIELDS fix 2)
      expect(rep(s(), true).issues).toEqual(['check:start:toe.l:4.2cm', 'check:start:toe.r:4.2cm']);
      const onFig = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'knees' ? { ...c, box: { left: 60, top: 190 } } : c)) };
      expect(rep(onFig).issues.length).toBeGreaterThan(2);
    });
    it('F7: drawable false, the drawn fault named in pilot.drawableFault (bouncing is the top fault, speed only)', () => {
      expect(s().pilot.drawableFault).toMatch(/bouncing/);
      expect(s().mistake.tells[0].key).not.toBe('bounce');
    });
  });
}

describe('LIB-18 A11, A6, A8 (Do 6 b): the card fields, the ruled tempo map, the pose map and the plate facts', { timeout: T }, () => {
  const KEYS3 = ['plateFacts', 'tempo', 'topFault'];
  const WITH_KEYS = LB8.filter(id => !LEGCURLS.includes(id));
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  // The ruled facts (LB8 NOTE RULED Q5; DESIGN.md sections 8 and 11), copied here: [landmark|joint, pose, claim, deg?].
  // Pose map identity for all 12, so each fact's pose is its cardPose.
  const LRs = (b: string, p: string, c: string) => [[`${b}.l`, p, c], [`${b}.r`, p, c]];
  const KNs = (p: string, c: string) => [['knee.l', p, c, 90], ['knee.r', p, c, 90]];
  const RULED: Record<string, any[][]> = {
    hack_squat: [...LRs('trap', 'start', 'c1'), ...LRs('heel', 'start', 'c1'), ...LRs('ball', 'start', 'c1'), ['backUpper', 'start', 'c2'], ['buttock', 'start', 'c2'],
      ['backUpper', 'end', 'c2'], ['buttock', 'end', 'c2'], ...LRs('wrist', 'start', 'c18'), ...KNs('end', 'c4'), ...LRs('heel', 'end', 'c6'), ...LRs('ball', 'end', 'c6')],
    pendulum_squat: [...LRs('heel', 'start', 'c1'), ...LRs('ball', 'start', 'c1'), ['backUpper', 'start', 'c3'], ['buttock', 'start', 'c3'], ['backUpper', 'end', 'c3'],
      ['buttock', 'end', 'c3'], ...LRs('wrist', 'start', 'c16'), ...LRs('heel', 'end', 'c5')],
    leg_extension: [['seat', 'start', 'c1'], ['backUpper', 'start', 'c4'], ['buttock', 'start', 'c4'], ['backUpper', 'end', 'c4'], ['buttock', 'end', 'c4'],
      ...LRs('ankle', 'start', 'c2'), ...LRs('wrist', 'start', 'c3'), ...KNs('start', 'c3')],
    seated_calf_raise: [['seat', 'start', 'c1'], ...LRs('thighTop', 'start', 'c1'), ...KNs('start', 'c1'), ...LRs('toe', 'start', 'c1'), ...LRs('ball', 'start', 'c3'), ...LRs('wrist', 'start', 'c6'),
      ...LRs('ball', 'end', 'c8'), ...KNs('end', 'c13')],
    standing_calf_raise: [...LRs('ball', 'start', 'c1'), ...LRs('toe', 'start', 'c1'), ...LRs('shoulderTop', 'start', 'c1'), ...LRs('wrist', 'start', 'c2'), ...LRs('ball', 'end', 'c7')],
    bodyweight_calf_raise: [...LRs('ball', 'start', 'c3'), ...LRs('ball', 'end', 'c4'), ...LRs('toe', 'end', 'c4')],
    hip_thrust: [['seat', 'start', 'c1'], ...LRs('heel', 'start', 'c1'), ...LRs('ball', 'start', 'c1'), ['backUpper', 'start', 'c2'], ['backUpper', 'end', 'c9'], ...LRs('wrist', 'start', 'c3'),
      ...LRs('wrist', 'end', 'c3'), ...LRs('heel', 'end', 'c15'), ...KNs('end', 'c8')],
    glute_bridge: [['backUpper', 'start', 'c1'], ['buttock', 'start', 'c1'], ...LRs('heel', 'start', 'c1'), ...LRs('ball', 'start', 'c1'), ['sacrum', 'start', 'c2'],
      ...LRs('heel', 'end', 'c3'), ['knee.r', 'end', 'c4', 90]],
    cable_kickback: [['ankle.r', 'start', 'c1'], ...LRs('wrist', 'start', 'c4'), ['heel.l', 'start', 'c2'], ['ball.l', 'start', 'c2'], ...LRs('wrist', 'end', 'c7')],
    resisted_hip_flexion: [['ankle.r', 'start', 'c2'], ['wrist.r', 'start', 'c2']],
  };
  const TOP: Record<string, string> = { hack_squat: 'lift', pendulum_squat: 'drop', leg_extension: 'arch', seated_calf_raise: 'bounce', standing_calf_raise: 'bounce',
    bodyweight_calf_raise: 'bounce', hip_thrust: 'arch', glute_bridge: 'arch', cable_kickback: 'arch', resisted_hip_flexion: 'lean' };
  const DRAWN_KEY: Record<string, string> = { hack_squat: 'lift', pendulum_squat: 'heels', leg_extension: 'arch', seated_calf_raise: 'range', standing_calf_raise: 'lock',
    bodyweight_calf_raise: 'part', hip_thrust: 'arch', glute_bridge: 'arch', cable_kickback: 'arch', resisted_hip_flexion: 'lean' };
  const factProblems = (id: string, card: any) => {
    const got = (card.plateFacts ?? []).map((f: any) => [f.joint ?? f.landmark, f.pose, f.claim, ...(f.kind === 'angle' ? [f.deg] : [])]), out: string[] = [];
    if (JSON.stringify(got) !== JSON.stringify(RULED[id])) out.push(`${id}: plateFacts != the ruled set`);
    for (const f of card.plateFacts ?? []) {
      if (f.pose !== f.cardPose) out.push(`${id}: ${f.joint ?? f.landmark} pose ${f.pose} is not the pose map's image of ${f.cardPose}`);
      if (!card.claims.some((c: any) => c.id === f.claim)) out.push(`${id}: ${f.claim} is no claim`);
    }
    return out;
  };
  it('each card differs from its research-head copy only in the three keys; the 10 drawn-or-planned cards carry them, the two leg curls not yet', () => {
    for (const id of LB8) {
      const c = cardOf(id);
      expect(KEYS3.every(k => k in c), id).toBe(WITH_KEYS.includes(id));
    }
  });
  it('every card\'s plateFacts is the ruled set, each pose the pose map\'s image (identity), each claim on the card', () => {
    for (const id of WITH_KEYS) expect(factProblems(id, cardOf(id)), id).toEqual([]);
  });
  it('mutations: a setup quote\'s contact moved to the end pose, and a start fact named with the end pose only, are red', () => {
    const c = JSON.parse(JSON.stringify(cardOf('cable_kickback')));
    c.plateFacts[0].pose = 'end'; c.plateFacts[0].cardPose = 'end';
    expect(factProblems('cable_kickback', c).length).toBeGreaterThan(0);
    const d = JSON.parse(JSON.stringify(cardOf('hip_thrust'))); d.plateFacts[0].pose = 'end';
    expect(factProblems('hip_thrust', d)).toContain('hip_thrust: seat pose end is not the pose map\'s image of start');
  });
  it('each card\'s tempo is the strip built from lb8/tempo.json and its plate.tempo, and equals its drawn spec\'s', () => {
    const tj = readJson('tools/plates/library/lb8/tempo.json');
    for (const id of WITH_KEYS) {
      const t = cardOf(id).plate.tempo, built = tj.ids[id].rows.map((r: any) => ({ phase: r.phase, s: t[r.from], ...(r.move ? { move: true } : {}) }));
      expect(cardOf(id).tempo, id).toEqual(built);
      if (S[id]) expect(S[id].tempo, id).toEqual(built);
    }
  });
  /** A8: drawable true → topFault is the drawn key (the first tell's); drawable false → the ruled key of handlingMistakes[0],
   *  which differs from the drawn key (F7 raised). */
  const topProblems = (id: string, card: any) => {
    const t = card.topFault, drawable = card.plate.mistake.drawable;
    if (t !== TOP[id]) return [`${id}: topFault ${t} != ruled ${TOP[id]}`];
    if (drawable && t !== DRAWN_KEY[id]) return [`${id}: drawable, but topFault ${t} != drawn ${DRAWN_KEY[id]}`];
    if (!drawable && t === DRAWN_KEY[id]) return [`${id}: drawable false, but topFault equals the drawn key`];
    if (S[id] && S[id].mistake.tells[0].key !== DRAWN_KEY[id]) return [`${id}: first tell ${S[id].mistake.tells[0].key}`];
    return [];
  };
  it('A8: each topFault is the ruled key; F7 exactly on the six drawable-false cards (four with keys now)', () => {
    for (const id of WITH_KEYS) expect(topProblems(id, cardOf(id)), id).toEqual([]);
    expect(WITH_KEYS.filter(id => !cardOf(id).plate.mistake.drawable)).toEqual(['pendulum_squat', 'seated_calf_raise', 'standing_calf_raise', 'bodyweight_calf_raise']);
  });
  it('A8 mutations: hip_thrust\'s card with topFault set to its other tell key, and seated_calf_raise\'s with topFault set to its drawn key, are red', () => {
    expect(topProblems('hip_thrust', { ...cardOf('hip_thrust'), topFault: 'ribs' }).length).toBe(1);
    expect(topProblems('seated_calf_raise', { ...cardOf('seated_calf_raise'), topFault: 'range' }).length).toBe(1);
  });
  const h6Of = (id: string, card: any, spec = S[id]) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research: card }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key);
  };
  it('A6: PQ-H6 is green on every drawn spec against its card, but the held plates\' recorded fact misses', async () => {
    for (const id of specsDrawn()) { await tick(); expect(h6Of(id, cardOf(id)), id).toEqual(H6_MISSES[id] ?? []); }
  });
  it('A6 mutations: an angle fact 3° off (hip_thrust\'s end knee.r 93), and a fact with both joint and measure: true, are red', async () => {
    const c = JSON.parse(JSON.stringify(cardOf('hip_thrust'))), k = c.plateFacts.findIndex((f: any) => f.joint === 'knee.r');
    c.plateFacts[k].deg = 93;
    expect(h6Of('hip_thrust', c).some((x: string) => x.startsWith('H6.fact:'))).toBe(true);
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    const dir = mkdtempSync(join(tmpdir(), 'lb8-val6-'));
    try {
      for (const d of ['cards', 'quotes']) cpSync(`docs/research/howto/${d}`, join(dir, 'docs/research/howto', d), { recursive: true });
      const p = join(dir, 'docs/research/howto/cards/hip_thrust.json'), j = JSON.parse(readFileSync(p, 'utf8'));
      j.plateFacts[k].measure = true; writeFileSync(p, JSON.stringify(j, null, 2));
      expect(v.validateCardFile('hip_thrust.json', dir).some((x: string) => /both joint and measure/.test(x))).toBe(true);
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
  it('A6 mutation: for each contact fact of hip_thrust, its pose\'s body moved 2 cm turns that fact red', () => {
    const s = S.hip_thrust, c = cardOf('hip_thrust');
    for (const pose of ['start', 'end']) {
      const p = s.poses[pose], moved = { ...s, poses: { ...s.poses, [pose]: { ...p, root: { ...p.root, at: [p.root.at[0], p.root.at[1] + 0.02, p.root.at[2]] }, reach: undefined, plant: undefined } } };
      const keys = h6Of('hip_thrust', c, moved);
      expect(keys.some((x: string) => /H6\.fact:\d+:contact:/.test(x)), pose).toBe(true);
    }
  });
});

// ---- hip_thrust (slice; held S2): A2, A18, R10 and balance on drawn items (slice look item 5) ----
describe('LIB-18 hip_thrust (H; tier A; the bridge class; held: D-LIB8-shrug): A2, A18, R10 and balance', { timeout: T }, () => {
  const HT = () => M.hip_thrust.HT, s = () => S.hip_thrust;
  const POSES3 = ['start', 'end', 'mistake'];
  const W = 1.75;
  /** Every drawn pose with its landmarks: start, end, Mistake and the engine's ghosts. */
  const allLms = (spec: any) => {
    const b = { height: W }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts?.count ?? 3;
    return [...POSES3.map(p => [p, lmOf(spec, p)]), ...Array.from({ length: n }, (_, i) => [`ghost${i}`, body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (n + 1), b).q, b))])] as [string, any][];
  };
  /** The drawn bar items (plate ring, pad, sleeve) of a pose, as world points. */
  const barItems = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((it: any) => it.type === 'poly' && it.pts?.length >= 16);
  const centre = (pts: number[][]) => [0, 1, 2].map(i => pts.reduce((a, p) => a + p[i]!, 0) / pts.length);
  // A2: the bench sits at one place in every pose; the bar's parts move and are `poly` (drawn in the Mistake view).
  const a2Problems = (spec: any) => {
    const out: string[] = [], bench = (p: string) => itemsIn(spec, p).items.find((it: any) => it.type === 'bench');
    for (const p of ['end', 'mistake']) if (JSON.stringify(bench(p)) !== JSON.stringify(bench('start'))) out.push(`bench moves in ${p}`);
    for (const p of POSES3) { const b = barItems(spec, p); if (b.length !== 3) out.push(`${p}: ${b.length} bar polys`); }
    return out;
  };
  it('A2: the bench is static in start, end and Mistake; the plate ring, pad and sleeve are three polys in every pose', () => {
    expect(a2Problems(s())).toEqual([]);
  });
  it('A2 mutations: the bench moved 2 cm in the Mistake, and the bar drawn as a `line`, are red', () => {
    const k = s().equipment.findIndex((e: any) => e?.type === 'bench');
    const moved = withEq(s(), k, (e: any) => (lm: any, ctx: any) => ({ ...e, at: ctx.pose === 'mistake' ? [e.at[0], e.at[1], e.at[2] - 0.02] : e.at }));
    expect(a2Problems(moved)).toContain('bench moves in mistake');
    const kb = s().equipment.findIndex((e: any) => typeof e === 'function' && barItems({ ...s(), equipment: [e] }, 'end').length === 1);
    const asLine = withEq(s(), kb, (f: any) => (lm: any, ctx: any) => ({ ...f(lm, ctx), type: 'line' }));
    expect(a2Problems(asLine).length).toBeGreaterThan(0);
  });
  // A18: the plates on or above the floor, the feet on it, nothing through the bench, the bench on its legs.
  const a18Problems = (spec: any) => {
    const out: string[] = [];
    for (const p of POSES3) {
      const ring = barItems(spec, p)[0]!.pts, low = Math.min(...ring.map((q: number[]) => q[1]!));
      if (low < -0.0005) out.push(`${p}: plate ${(low * 100).toFixed(1)} cm below the floor`);
    }
    const bench = itemsIn(spec, 'end').items.find((it: any) => it.type === 'bench'), top = bench.at[1], edge = bench.at[2] + bench.width / 2;
    for (const [p, l] of allLms(spec)) {
      for (const n of ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r']) if (l[n][1] < -0.005) out.push(`${p}: ${n} under the floor`);
      // the upper back rests on the edge: no back landmark more than 1 cm into the bench's top (over the bench's span)
      for (const n of ['backUpper', 'backMid', 'shoulder.r']) if (l[n][2] <= edge + 0.001 && l[n][1] < top - 0.01) out.push(`${p}: ${n} ${((top - l[n][1]) * 100).toFixed(1)} cm into the bench`);
    }
    return out;
  };
  it('A18: plates on or above the floor, feet on it, the back never more than 1 cm into the bench, in every pose and ghost', () => {
    expect(a18Problems(s())).toEqual([]);
  });
  it('A18 mutations: the plate 1 cm below the floor at the bottom, and the bench 3 cm into the upper back, are red', () => {
    const kb = s().equipment.findIndex((e: any) => typeof e === 'function' && barItems({ ...s(), equipment: [e] }, 'end').length === 1);
    const low = withEq(s(), kb, (f: any) => (lm: any, ctx: any) => { const it = f(lm, ctx); return ctx.pose === 'start' ? { ...it, pts: it.pts.map((q: number[]) => [q[0], q[1]! - (Math.min(...it.pts.map((r: number[]) => r[1])) + 0.01), q[2]]) } : it; });
    expect(a18Problems(low)).toEqual([expect.stringMatching(/^start: plate -1\.0 cm below the floor$/)]);
    const k = s().equipment.findIndex((e: any) => e?.type === 'bench');
    const up = withEq(s(), k, (e: any) => ({ ...e, at: [e.at[0], e.at[1] + 0.03, e.at[2]] }));
    expect(a18Problems(up).some(p => /into the bench/.test(p))).toBe(true);
  });
  // R10 (DESIGN.md 7): the bar padded and centred over the hips, both hands on it, the upper back on the edge.
  const r10Problems = (spec: any) => {
    const out: string[] = [];
    for (const p of POSES3) {
      const b = barItems(spec, p), l = lmOf(spec, p), c = centre(b[0]!.pts);
      if (!b.some((it: any) => it.cls === 'eq')) out.push(`${p}: no pad round the bar`);
      for (const sd of ['l', 'r']) if (Math.hypot(l[`grip.${sd}`][1] - c[1]!, l[`grip.${sd}`][2] - c[2]!) > 0.005) out.push(`${p}: grip.${sd} off the bar`);
      if (Math.hypot(l.backUpper[1] - HT().edge[1], l.backUpper[2] - HT().edge[2]) > 0.005) out.push(`${p}: the upper back off the bench edge`);
      const bar = HT().barOf(l); if (Math.hypot(bar[1] - c[1]!, bar[2] - c[2]!) > 0.005) out.push(`${p}: the bar off the hip crease`);
    }
    return out;
  };
  it('R10: the bar padded, in the crease and held by both hands, the upper back on the bench edge, in start, end and Mistake', () => {
    expect(r10Problems(s())).toEqual([]);
  });
  it('R10 mutation: the pad removed (one R10 item) is red', () => {
    const kp = s().equipment.findIndex((e: any) => typeof e === 'function' && barItems({ ...s(), equipment: [e] }, 'end')[0]?.cls === 'eq');
    expect(r10Problems(withEq(s(), kp, () => () => null)).length).toBeGreaterThan(0);
  });
  /** Balance (D-LIB18-BALANCE): body (Winter 2009 fractions on the drawn landmarks) plus the bar's load at the crease lies
   *  between the upper back's contact on the bench edge and the heels, in every drawn pose and ghost. */
  const comZ = (spec: any, l: any, withLoad = true) => {
    const L3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const parts: [number, number[]][] = [[0.081, l.ear], [0.497, L3(l.shoulders, l.hips, 0.5)]];
    for (const sd of ['l', 'r']) parts.push([0.028, L3(l[`shoulder.${sd}`], l[`elbow.${sd}`], 0.436)], [0.016, L3(l[`elbow.${sd}`], l[`wrist.${sd}`], 0.430)], [0.006, l[`grip.${sd}`]],
      [0.100, L3(l[`hip.${sd}`], l[`knee.${sd}`], 0.433)], [0.0465, L3(l[`knee.${sd}`], l[`ankle.${sd}`], 0.433)], [0.0145, L3(l[`heel.${sd}`], l[`toe.${sd}`], 0.5)]);
    const m = parts.reduce((a, p) => a + p[0], 0), z = parts.reduce((a, p) => a + p[0] * p[1][2]!, 0) / m;
    if (!withLoad) return z;
    const kg = M.hip_thrust.SIZES, bar = HT().barOf(l);
    return (z * kg.BODY_KG + bar[2] * kg.LOAD_KG) / (kg.BODY_KG + kg.LOAD_KG);
  };
  const balance = (spec: any, withLoad = true) => allLms(spec).map(([p, l]) => [p, comZ(spec, l, withLoad), HT().edge[2], (l['heel.l'][2] + l['heel.r'][2]) / 2] as [string, number, number, number]);
  it('balance: body plus load inside the base (bench edge to heels) in every pose and ghost; offsets logged', () => {
    const rows = balance(s());
    console.log(`LIB-18 hip_thrust balance (cm ahead of the edge / behind the heels): ${rows.map(([p, z, e, h]) => `${p} ${((z - e) * 100).toFixed(1)}/${((h - z) * 100).toFixed(1)}`).join(', ')}`);
    console.log(`LIB-18 hip_thrust balance, body alone: ${balance(s(), false).map(([p, z, e]) => `${p} ${((z - e) * 100).toFixed(1)}`).join(', ')}`);
    for (const [p, z, e, h] of rows) { expect(z, p).toBeGreaterThan(e); expect(z, p).toBeLessThan(h); }
  });
  it('balance mutation: the load placed 60 cm in front of the heels (a carried load off its contact) is red', () => {
    const real = HT().barOf;
    try {
      HT().barOf = (l: any) => { const b = real(l); return [b[0], b[1], (l['heel.r'][2] as number) + 0.6]; };
      expect(balance(s()).some(([, z, , h]) => z >= h)).toBe(true);
    } finally { HT().barOf = real; }
  });
});

// ---- resisted_hip_flexion (bulk; eq/ankleCuff.mjs, the slice's composer, unchanged) ----
{
  // resisted_hip_flexion tests, for lb8-plates.test.ts. Helpers ASSUMED from the file's top (LB7's lines 1-94 as copied
  // there): eng, body, plate, qaEng, qaNode, itemsIn, lmOf, rep, camOf, shapesIn, fullPose, outside, leadersOf, segD,
  // segs, xy, withEq, tick, lib, T, readJson. The spec module is loaded here (RQ), so this block does not need DRAWN_NOW.
  // Every test reads drawn items (what the spec's entries emit, as the engine calls them), the engine's landmarks and
  // shapes, the report or the render; never the spec's own solver. Each mutation is a mutated spec run through the same
  // check, and must turn it red.
  // Equipment entries: 0 floor, 1 cableColumn, 2-4 ankleCuff parts (perItem), 5 start phantoms (end pose only).
  let RQ: any, s0: any;
  beforeAll(async () => { RQ = await import(/* @vite-ignore */ lib('specs/resisted_hip_flexion.mjs')); s0 = RQ.default; }, T);
  const s = () => s0;
  const POSES = ['start', 'end', 'mistake'];
  const W = 1.75;
  const CARD = 'docs/research/howto/cards/resisted_hip_flexion.json';
  const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
  const cmOf = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!) * 100;
  const colIn = (spec: any, pose: string, o = {}) => itemsIn(spec, pose, o).items.find((it: any) => it.type === 'cableColumn');
  const cuffIn = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((it: any) => it.part === 'cuff');
  const ringIn = (spec: any, pose: string) => cuffIn(spec, pose)[2];
  const postZ = (col: any) => col.base[2] + 0.17 - 0.025;   // the near upright's centre line (the vendor column: width 0.34, post 0.05)
  const faceZ = (col: any) => col.base[2] + 0.17;            // the column's near face, toward the lifter
  /** Winter 2009 Table 4.1 centre of mass on drawn landmarks (copied from lb7-plates.test.ts:428-442). */
  const comOf = (lm: any) => {
    const L3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const parts: [number, number[]][] = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)]];
    for (const sd of ['l', 'r']) parts.push(
      [0.028, L3(lm[`shoulder.${sd}`], lm[`elbow.${sd}`], 0.436)], [0.016, L3(lm[`elbow.${sd}`], lm[`wrist.${sd}`], 0.430)], [0.006, lm[`grip.${sd}`]],
      [0.100, L3(lm[`hip.${sd}`], lm[`knee.${sd}`], 0.433)], [0.0465, L3(lm[`knee.${sd}`], lm[`ankle.${sd}`], 0.433)], [0.0145, L3(lm[`heel.${sd}`], lm[`toe.${sd}`], 0.5)]);
    const m = parts.reduce((a, p) => a + p[0], 0);
    return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i]!, 0) / m);
  };
  /** Landmarks of the drawn ghosts (the engine's poseAt at the ghost times). */
  const ghostLms = (spec: any) => {
    const b = { height: W }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts.count;
    return Array.from({ length: n }, (_, i) => body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (n + 1), b).q, b)));
  };
  const lmsAll = (spec: any) => [...POSES.map(p => lmOf(spec, p)), ...ghostLms(spec)];
  const mutEnd = (spec: any, patch: any) => ({ ...spec, poses: { ...spec.poses, end: { ...spec.poses.end, ...patch } } });
  const mutMistake = (spec: any, patch: any) => ({ ...spec, mistake: { ...spec.mistake, pose: { ...spec.mistake.pose, ...patch } } });
  const knee = (lm: any, sd: string) => 180 - angle3(lm[`hip.${sd}`], lm[`knee.${sd}`], lm[`ankle.${sd}`]);
  const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((q, x, i) => q + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };

  describe('resisted_hip_flexion: A2 ankleCuff and the cable column per pose', () => {
    it('ankleCuff emits PRIMITIVES types only, every part a poly, in every pose; mutation: the strap as a `line` is red', () => {
      for (const p of POSES) { const c = cuffIn(s(), p); expect(c).toHaveLength(3); for (const it of c) { expect(eng.PRIMITIVES[it.type]).toBeTypeOf('function'); expect(it.type).toBe('poly'); } }
      const bad = withEq(s(), 2, (f: any) => (lm: any, ctx: any) => ({ ...f(lm, ctx), type: 'line' }));
      expect(cuffIn(bad, 'mistake').every((it: any) => it.type === 'poly')).toBe(false);
    });
    it('the column frame and pulley sit at one fixed place (±1 px) in start, end and Mistake; the stack keeps the end lift in the Mistake', () => {
      const frame = (sp: any, p: string) => eng.PRIMITIVES.cableColumn(colIn(sp, p, { mistake: p === 'mistake' }), camOf(sp)).filter((it: any) => it.cls !== 'eq-cable').map((it: any) => it.d);
      const near = (a: string[], b: string[]) => a.length === b.length && a.every((d, i) => xy(d).every((q, k) => Math.hypot(q[0]! - xy(b[i]!)[k]![0]!, q[1]! - xy(b[i]!)[k]![1]!) <= 1));
      const stat = (sp: any, p: string) => frame(sp, p).filter((_: any, i: number) => i < 3 || i >= frame(sp, p).length - 4);
      expect(near(stat(s(), 'start'), stat(s(), 'end'))).toBe(true);
      expect(near(frame(s(), 'end'), frame(s(), 'mistake'))).toBe(true);
      // mutation: the column moved 2 cm in the Mistake -> red
      const bad = withEq(s(), 1, (f: any) => (lm: any, ctx: any) => { const it = f(lm, ctx); return ctx.pose === 'mistake' ? { ...it, base: [0, 0, it.base[2] + 0.02] } : it; });
      expect(near(frame(bad, 'end'), frame(bad, 'mistake'))).toBe(false);
    });
    it('the right fist holds the near upright (grip centre on its centre line ±1 cm, within its height) in start, end and Mistake (c2)', () => {
      const ok = (sp: any) => POSES.every(p => { const g = lmOf(sp, p)['grip.r'], col = colIn(sp, p); return Math.abs(g[2] - postZ(col)) * 100 <= 1 && g[1] > 0 && g[1] < 2.1; });
      expect(ok(s())).toBe(true);
      const r = s().poses.end.reach, bad = mutEnd(s(), { reach: { ...r, r: { ...r.r, at: [r.r.at[0], r.r.at[1], r.r.at[2] + 0.02] } } });   // mutation: the end fist 2 cm off the post
      expect(ok(bad)).toBe(false);
    });
    it('the standing foot is flat on the floor (heel and ball ±1 cm) and the cuff is on the working ankle in every pose; mutation: the cuff at the knee is red', () => {
      const cuffOk = (sp: any, p: string) => {
        const lm = lmOf(sp, p), band = cuffIn(sp, p)[0].pts, c = [0, 1, 2].map(i => band.reduce((a: number, q: number[]) => a + q[i]!, 0) / band.length);
        const k = lm['knee.r'], a = lm['ankle.r'], u = k.map((v: number, i: number) => v - a[i]), L = Math.hypot(...u), t = u.reduce((q: number, v: number, i: number) => q + v * (c[i]! - a[i]), 0) / L;
        return t > 0.04 && t < 0.07 && cmOf(c, a.map((v: number, i: number) => v + u[i] / L * t)) <= 1;   // band centre on the shank axis, 4-7 cm above the ankle
      };
      for (const p of POSES) {
        const lm = lmOf(s(), p);
        expect(Math.abs(lm['heel.l'][1]) * 100).toBeLessThanOrEqual(1); expect(Math.abs(lm['ball.l'][1]) * 100).toBeLessThanOrEqual(1);
        expect(cuffOk(s(), p)).toBe(true);
      }
      const bad = withEq(s(), 2, () => (lm: any) => ({ type: 'poly', part: 'cuff', pts: [lm['knee.r'], lm['hip.r'], lm['knee.l'], lm['hip.l']] }));
      expect(cuffOk(bad, 'end')).toBe(false);
    });
    it('the cable runs back from the drawn D-ring to the low pulley behind the lifter in every pose (D-LIB18-CABLE, c1, c2)', () => {
      const ok = (sp: any) => ['start', 'end'].every(p => {
        const col = colIn(sp, p), ring = ringIn(sp, p).pts, far = ring[Math.floor(ring.length / 2)], lm = lmOf(sp, p);
        return cmOf(col.to, far) <= 1 && col.pulley.at[1] <= 0.15                       // c1 "low cable": pulley centre at most 15 cm up
          && col.pulley.at[2] < lm['heel.r'][2] && col.pulley.at[2] < lm.sacrum[2]       // behind the lifter (c2 "Face away from the machine")
          && lm['toe.l'][2] > lm['heel.l'][2];                                           // facing away: the standing toes point away from it
      });
      expect(ok(s())).toBe(true);
      // mutation: the cable end left at the start ring in the end pose -> red
      expect(ok(withEq(s(), 1, (f: any) => (lm: any, ctx: any) => ({ ...f(lm, ctx), to: f(ctx.start, ctx).to })))).toBe(false);
    });
  });

  describe('resisted_hip_flexion: A18 physics on drawn items', () => {
    it('every heel, ball and toe is on or above the floor line in start, end, Mistake and the ghosts; mutation: the standing heel 1 px down is red', () => {
      const ok = (sp: any) => lmsAll(sp).every(lm => ['heel', 'ball', 'toe'].every(k => ['l', 'r'].every(sd => lm[`${k}.${sd}`][1] >= -0.0005)));
      expect(ok(s())).toBe(true);
      const px = 1 / rep(s()).camera.pxPerM, pl = s().poses.end.plant;
      expect(ok(mutEnd(s(), { plant: { l: { ...pl.l, at: [pl.l.at[0], -px, pl.l.at[2]] } } }))).toBe(false);
    });
    it('the frame stands on the floor and the pulley sits on the near upright (joined, D-LIB18-FRAME); mutation: the pulley 20 cm off the post is red', () => {
      const ok = (sp: any) => { const col = colIn(sp, 'end'); return col.base[1] === 0 && Math.abs(col.pulley.at[2] - faceZ(col)) <= 0.03; };
      expect(ok(s())).toBe(true);
      expect(ok(withEq(s(), 1, (f: any) => (lm: any, ctx: any) => { const it = f(lm, ctx); return { ...it, pulley: { ...it.pulley, at: [it.pulley.at[0], it.pulley.at[1], it.pulley.at[2] + 0.2] } }; }))).toBe(false);
    });
    it('no part of the working leg or its cuff passes into the column (every heel, toe and D-ring point in front of its near face, every pose and ghost); mutation: the column 15 cm nearer is red', () => {
      const ok = (sp: any) => {
        const f = faceZ(colIn(sp, 'end'));
        return lmsAll(sp).every(lm => ['heel.r', 'toe.r', 'ankle.r', 'knee.r'].every(k => lm[k][2] > f))
          && POSES.every(p => cuffIn(sp, p).every((it: any) => it.pts.every((q: number[]) => q[2]! > f + 0.045)));   // clear of the pulley's 4.5 cm rim
      };
      expect(ok(s())).toBe(true);
      expect(ok(withEq(s(), 1, (fn: any) => (lm: any, ctx: any) => { const it = fn(lm, ctx); return { ...it, base: [0, 0, it.base[2] + 0.15] }; }))).toBe(false);
    });
    it('the centre of mass lies over the standing foot in every drawn pose and ghost (D-LIB18-BALANCE, c12): within ±2 cm of mid-sole and inside heel to toe; the hand steadies only', () => {
      const ok = (sp: any) => lmsAll(sp).every(lm => { const c = comOf(lm)[2]!; return Math.abs(c - lm['sole.l'][2]) <= 0.02 && c >= lm['heel.l'][2] && c <= lm['toe.l'][2]; });
      expect(ok(s())).toBe(true);
      // mutation (card A18 form): the end trunk moved 10 cm forward -> red
      const at = s().poses.end.root.at;
      expect(ok(mutEnd(s(), { root: { ...s().poses.end.root, at: [at[0], at[1], at[2] + 0.10] } }))).toBe(false);
      // mutation: the Mistake drawn without its balance counter-move (the end root kept under the leaning trunk) -> red
      expect(ok(mutMistake(s(), { root: s().poses.end.root }))).toBe(false);
    });
  });

  describe('resisted_hip_flexion: card facts and sized numbers on the drawn body', () => {
    const card = () => readJson(CARD);
    const h6 = (sp: any) => qaNode.h6({ spec: sp, research: card() }, { engine: Eng() }, { normal: plate.renderPlate(sp, { id: 'x' }) }).map((p: any) => p.key);
    it('PQ-H6: the card facts (ankle.r and wrist.r contacts at the start, c2) and the card tempo hold; mutations: the wrist check removed, the tempo changed', () => {
      expect(h6(s())).toEqual([]);
      expect(h6({ ...s(), checks: s().checks.filter((c: any) => c.landmark !== 'wrist.r') })).toContain('H6.fact:1:contact:wrist.r');
      expect(h6({ ...s(), tempo: [{ phase: 'Lift', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }] })).toContain('H6.tempo');
    });
    it('the frame hand is the near (right) wrist, beside its fist on the upright, at the start (card plateFacts wrist.r); mutation: the right hand let go is red', () => {
      const ok = (sp: any) => { const lm = lmOf(sp, 'start'), col = colIn(sp, 'start'); return cmOf(lm['wrist.r'], lm['grip.r']) < 12 && Math.abs(lm['grip.r'][2] - postZ(col)) * 100 <= 1; };
      expect(ok(s())).toBe(true);
      const st = s().poses.start, bad = { ...s(), poses: { ...s().poses, start: { ...st, reach: { ...st.reach, r: { ...st.reach.r, at: [st.reach.r.at[0], st.reach.r.at[1] - 0.25, st.reach.r.at[2] + 0.3] } } } } };
      expect(ok(bad)).toBe(false);
    });
    it('torso upright, hips level (c3, c6): pelvis tilt 0 and thorax (tilt + lumbar) 0 ±2 in start and end; mutation: +3 deg tilt is red', () => {
      const ok = (sp: any) => ['start', 'end'].every(p => { const a = rep(sp).angles[p]; return Math.abs(a.tilt) <= 2 && Math.abs(a.tilt + a.trunk) <= 2; });
      expect(ok(s())).toBe(true);
      expect(ok(mutEnd(s(), { root: { ...s().poses.end.root, tilt: 3 } }))).toBe(false);
    });
    it('end: the strapped thigh level (c5 "thigh parallel", the drawn option) and the shank plumb (c3 "bending knee"), each ±2 deg; mutation: the end hip at 80 is red', () => {
      const deg = (a: number[], b: number[]) => Math.atan2(Math.abs(b[1]! - a[1]!), Math.abs(b[2]! - a[2]!)) * 180 / Math.PI;   // 0 = level, 90 = plumb
      const ok = (sp: any) => { const lm = lmOf(sp, 'end'); return deg(lm['hip.r'], lm['knee.r']) <= 2 && Math.abs(deg(lm['knee.r'], lm['ankle.r']) - 90) <= 2; };
      expect(ok(s())).toBe(true);
      expect(ok(mutEnd(s(), { hip: { ...s().poses.end.hip, r: 80 } }))).toBe(false);
    });
    it('start: the strapped hip extended behind the body (c5) by START_HIP_EXT, the knee and ankle behind the hip; mutation: hip at 0 is red', () => {
      const ok = (sp: any) => { const a = rep(sp).angles.start['hip.r'], lm = lmOf(sp, 'start'); return Math.abs(+/flex (-?[\d.]+)/.exec(a)![1]! + RQ.SIZES.START_HIP_EXT) <= 1 && lm['knee.r'][2] < lm['hip.r'][2] && lm['ankle.r'][2] < lm['knee.r'][2]; };
      expect(ok(s())).toBe(true);
      const st = s().poses.start;
      expect(ok({ ...s(), poses: { ...s().poses, start: { ...st, hip: { ...st.hip, r: 0 } } } })).toBe(false);
    });
    it('the standing knee at its sized bend (STANCE_KNEE 5, "Stand tall", barbell_back_squat.mjs:30) in every pose, in the sagittal plane; mutation: the end root 1 cm higher (knee locked) is red', () => {
      const k0 = RQ.SIZES.STANCE_KNEE, a = 0.245 * W, b = 0.246 * W, Lc = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k0 * Math.PI / 180)), off0 = a * b * Math.sin(k0 * Math.PI / 180) / Lc;
      const off = (lm: any) => segD([lm['knee.l'][2], lm['knee.l'][1]], [lm['hip.l'][2], lm['hip.l'][1]], [lm['ankle.l'][2], lm['ankle.l'][1]]);
      const ok = (sp: any) => POSES.every(p => { const lm = lmOf(sp, p); return Math.abs(knee(lm, 'l') - k0) <= 2 && off(lm) >= 0.9 * off0 && Math.abs(lm['knee.l'][0] - lm['hip.l'][0]) < 0.01; });
      expect(ok(s())).toBe(true);
      const at = s().poses.end.root.at;
      expect(ok(mutEnd(s(), { root: { ...s().poses.end.root, at: [at[0], at[1] + 0.01, at[2]] } }))).toBe(false);
    });
    it('every unsourced number is in SIZES; the trace point is the knee (plate.frames, D-LIB18-TRACE) with the clone trim [10, 12] (hanging_leg_raise.mjs:124); the lean drawn at M_LEAN', () => {
      expect(Object.keys(RQ.SIZES).sort()).toEqual(['ARM_BACK', 'ELBOW_SOFT', 'END_ANKLE', 'END_HIP', 'END_KNEE', 'FLOOR_BACK', 'FLOOR_FRONT', 'M_LEAN', 'PULLEY_Y', 'STANCE_KNEE', 'STANCE_X', 'START_HIP_EXT', 'START_KNEE', 'START_TOE_CLEAR']);
      const traceOk = (sp: any) => sp.trace.point === 'knee.r' && JSON.stringify(sp.trace.trim) === '[10,12]';
      expect(traceOk(s())).toBe(true);
      expect(traceOk({ ...s(), trace: { ...s().trace, point: 'ankle.r' } })).toBe(false);   // mutation: traced at the ankle -> red
      expect(rep(s()).angles.mistake.trunk).toBe(-RQ.SIZES.M_LEAN);                           // hanging_leg_raise.mjs:69
      expect(rep(mutMistake(s(), { trunk: -6 })).angles.mistake.trunk).not.toBe(-RQ.SIZES.M_LEAN);
    });
    it('tempo strip = lb8/tempo.json row + card tempo (Lift 2, Hold 2, Lower 2)', () => {
      expect(s().tempo).toEqual([{ phase: 'Lift', s: 2, move: true }, { phase: 'Hold', s: 2 }, { phase: 'Lower', s: 2, move: true }]);
      expect(s().tempo).toEqual(card().tempo);
    });
  });

  describe('resisted_hip_flexion: A15 drawing lessons (each check run on the real spec and on a mutated spec)', () => {
    /** The dashed Mistake cable: unbroken from the pulley rim to the drawn Mistake D-ring, in the Mistake layer above the end figure. */
    const cableProblems = (spec: any) => {
      const cam = camOf(spec), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg, out: string[] = [];
      const g = (spec.mistake.guides ?? []).find((x: any) => x.kind === 'dashed' && x.pts?.length === 2);
      if (!g) return ['no dashed Mistake cable'];
      const ring = ringIn(spec, 'mistake').pts.map(cam.P), pul = colIn(spec, 'end').pulley, pc = cam.P(pul.at), [a, b] = g.pts.map(cam.P);
      if (Math.min(...ring.map((q: number[]) => Math.hypot(q[0]! - b![0]!, q[1]! - b![1]!))) > cam.pxm * 0.01) out.push('the cable stops short of the Mistake ring');
      if (Math.abs(Math.hypot(a![0]! - pc[0]!, a![1]! - pc[1]!) - pul.r * cam.pxm) > cam.pxm * 0.005) out.push('the cable does not start at the pulley rim');
      if (!(svg.indexOf('class="mistake-layer"') > svg.indexOf('class="pose-end"'))) out.push('not drawn above the end figure');
      return out;
    };
    it('the dashed Mistake cable runs unbroken from the pulley rim to the Mistake D-ring, drawn on top; mutations: cut to half, removed', () => {
      expect(cableProblems(s())).toEqual([]);
      const g = s().mistake.guides[0], half = { ...g, pts: [g.pts[0], g.pts[0].map((v: number, i: number) => (v + g.pts[1][i]) / 2)] };
      expect(cableProblems({ ...s(), mistake: { ...s().mistake, guides: [half, ...s().mistake.guides.slice(1)] } })).toContain('the cable stops short of the Mistake ring');
      expect(cableProblems({ ...s(), mistake: { ...s().mistake, guides: s().mistake.guides.slice(1) } })).toEqual(['no dashed Mistake cable']);
    });
    /** The red Mistake trunk (head and torso) drawn outside the end figure clears it by >= 6 px at its farthest (the engine masks the rest; the faulty back is a dashed guide). */
    const trunkClear = (spec: any) => {
      const endPolys = shapesIn(spec, 'end').map((x: any) => x.poly);
      const outPts = shapesIn(spec, 'mistake').filter((x: any) => ['head', 'torso'].includes(x.key)).flatMap((x: any) => x.poly).filter((q: number[]) => outside(endPolys, q) > 0);
      return outPts.length ? Math.max(...outPts.map((q: number[]) => outside(endPolys, q))) : 0;
    };
    it('the red leaning trunk clears the solid end figure by >= 6 px; mutation: the Mistake equal to the end pose is red', () => {
      expect(trunkClear(s())).toBeGreaterThanOrEqual(6);
      expect(trunkClear({ ...s(), mistake: { ...s().mistake, pose: {} } })).toBeLessThan(6);
    });
    /** The hidden start leg and cuff are dashed phantoms in the end layer only, and the Trace starts at the start knee. */
    const phantomProblems = (spec: any) => {
      const out: string[] = [], ph = itemsIn(spec, 'end').items.filter((it: any) => it.part === 'startLeg' || it.part === 'startCuff');
      if (!ph.length) out.push('no start phantom');
      if (!ph.every((it: any) => it.type === 'line' && it.cls === 'eq-line m-line')) out.push('a phantom is not a dashed line');
      if (itemsIn(spec, 'start').items.some((it: any) => it.part === 'startLeg')) out.push('a phantom in the start layer');
      const cam = camOf(spec), svg = plate.renderPlate(spec, { id: 'x' }).svg, tr = xy(/<path class="trace"[^>]*? d="([^"]+)"/.exec(svg)![1]!), k0 = cam.P(lmOf(spec, 'start')['knee.r']);
      if (Math.hypot(tr[0]![0]! - k0[0]!, tr[0]![1]! - k0[1]!) > 12) out.push('the Trace does not start at the start knee');
      return out;
    };
    it('the hidden start leg and cuff are dashed phantoms in the end layer; the Trace starts at the start knee (within its trim); mutation: the phantom entry removed is red', () => {
      expect(phantomProblems(s())).toEqual([]);
      expect(phantomProblems(withEq(s(), 5, () => () => null))).toContain('no start phantom');
    });
    /** Each tell's anchor sits on a drawn item: the dashed faulty-back guide (within 1 px); the first tell is the card's topFault. */
    const tellProblems = (spec: any) => {
      const cam = camOf(spec), L = qaEng.poseLandmarks(Eng(), spec).lm, g = spec.mistake.guides[1].pts.map(cam.P), out: string[] = [];
      for (const t of spec.mistake.tells) { const at = qaEng.resolvePoint(t.anchor, 'mistake', L, cam); if (Math.min(...g.slice(1).map((q: number[], i: number) => segD(at, g[i]!, q))) > 1) out.push(`${t.key} off the back guide`); }
      if (spec.mistake.tells[0].key !== readJson(CARD).topFault) out.push('first tell is not the topFault');
      return out;
    };
    it('both tells (lean, arch) sit on the drawn faulty back, lean first (topFault); mutations: the lean anchor 20 px off, the tells swapped', () => {
      expect(tellProblems(s())).toEqual([]);
      const [t0, t1] = s().mistake.tells;
      expect(tellProblems({ ...s(), mistake: { ...s().mistake, tells: [{ ...t0, anchor: { at: 'backMid', pose: 'mistake', off: [20, 0] } }, t1] } })).toContain('lean off the back guide');
      expect(tellProblems({ ...s(), mistake: { ...s().mistake, tells: [t1, t0] } })).toContain('first tell is not the topFault');
    });
    /** Leaders: none within 6 px of a cable or the Trace (away from the anchor's first 8 px), none across the column; a
     *  leader enters the figure of its render (end figure, or the Mistake figure) at most once, from the front, and is
     *  then at most 81.9 px long (D-LIB18-ROUND). NIT: the normal 'back' leader enters once from the front (a named-nit
     *  candidate, D-LIB15-NIT1: the lower back sits in a pocket closed by the frame arm, the upright and the cable). */
    const leaderProblems = (spec: any) => {
      const cam = camOf(spec), out: string[] = [];
      for (const mistake of [false, true]) {
        const R = plate.renderPlate(spec, { id: 'x', mistake }), tag = mistake ? 'mistake' : 'normal';
        const colItems = eng.PRIMITIVES.cableColumn(colIn(spec, mistake ? 'mistake' : 'end', { mistake }), cam);
        const lines = colItems.filter((it: any) => it.line).map((it: any) => it.line);
        if (mistake) lines.push(spec.mistake.guides[0].pts.map(cam.P));
        const tr = /<path class="trace"[^>]*? d="([^"]+)"/.exec(R.svg); if (tr && !mistake) { const p = xy(tr[1]!); segs(p).forEach(sg => lines.push(sg)); }
        const colX = [cam.P([0, 0, colIn(spec, 'end').base[2] - 0.17])[0]!, cam.P([0, 0, faceZ(colIn(spec, 'end'))])[0]!];
        const figure = shapesIn(spec, mistake ? 'mistake' : 'end').map((x: any) => x.poly), endFig = shapesIn(spec, 'end').map((x: any) => x.poly);
        // the ghosts' drawn legs (ghosts.parts) and the dashed start phantoms, as plate-px outlines and polylines
        const b = { height: W }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b));
        const ghostPolys = Array.from({ length: spec.ghosts.count }, (_, g) => body.bodyShapes(body.fk(body.poseAt(keys, (g + 1) / (spec.ghosts.count + 1), b).q, b), cam).filter((x: any) => x.poly && ['thigh.r', 'kneecap.r', 'shank.r', 'foot.r'].includes(x.key)).map((x: any) => x.poly)).flat();
        const phantom = itemsIn(spec, 'end').items.filter((it: any) => it.part === 'startLeg' || it.part === 'startCuff').map((it: any) => it.pts.map(cam.P));
        const cross = (p: number[], q: number[], r: number[], t: number[]) => { const o = (a: number[], c: number[], d: number[]) => Math.sign((c[0]! - a[0]!) * (d[1]! - a[1]!) - (c[1]! - a[1]!) * (d[0]! - a[0]!)); return o(p, q, r) * o(p, q, t) < 0 && o(r, t, p) * o(r, t, q) < 0; };
        leadersOf(R.svg).forEach((ld, i) => {
          const samp = segs(ld).flatMap(([a, b]) => Array.from({ length: 41 }, (_, k) => [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40]));
          const away = samp.filter(q => Math.hypot(q[0]! - ld[0]![0]!, q[1]! - ld[0]![1]!) >= 8);
          for (const c of lines) for (const q of away) if (segD(q, c[0], c[c.length - 1]) <= 6) out.push(`${tag} ${i}: near a cable or the Trace`);
          if (samp.some(q => q[0]! >= colX[0]! - 2 && q[0]! <= colX[1]! + 2)) out.push(`${tag} ${i}: across the column`);
          if (away.some(q => outside(ghostPolys, q) <= 0)) out.push(`${tag} ${i}: across a ghost`);
          if (segs(ld).some(([p, q]) => phantom.some((pl: number[][]) => segs(pl).some(([r, t]) => cross(p!, q!, r!, t!))))) out.push(`${tag} ${i}: across the start phantom`);
          // walk from the box end to the anchor: entries into the figure (both the render's figure and the end figure)
          for (const fig of mistake ? [figure, endFig] : [figure]) {
            const walk = [...samp].reverse().filter(q => Math.hypot(q[0]! - ld[0]![0]!, q[1]! - ld[0]![1]!) >= 3);
            let inside = false, entries = 0; for (const q of walk) { const now = outside(fig, q) <= 0; if (now && !inside) entries++; inside = now; }
            const len = segs(ld).reduce((a, [p, q]) => a + Math.hypot(q![0]! - p![0]!, q![1]! - p![1]!), 0);
            if (entries > 1) out.push(`${tag} ${i}: enters the figure ${entries} times`);
            if (entries === 1 && !(ld[ld.length - 1]![0]! > ld[0]![0]!)) out.push(`${tag} ${i}: enters from behind`);
            if (entries === 1 && len > 81.9) out.push(`${tag} ${i}: ${len.toFixed(1)} px inside-route leader over 81.9 px`);
          }
        });
      }
      return [...new Set(out)];
    };
    it('no leader near a cable or the Trace, none across the column; a leader that enters the figure does so once, from the front, within 81.9 px', () => {
      expect(leaderProblems(s())).toEqual([]);
    });
    it('mutations: the "No back arch" box left of the column (its leader across the frame) is red; behind the figure no box fits (the pocket box lands on the figure and frame: report red); the "Leans back" box behind the head is red', () => {
      const back = (box: any) => ({ ...s(), callouts: s().callouts.map((c: any) => (c.key === 'back' ? { ...c, box } : c)) });
      expect(leaderProblems(back({ left: 20, top: 200 }))).toContain('normal 2: across the column');
      expect(rep(back({ left: 90, top: 200 })).issues.length).toBeGreaterThan(0);
      const lean = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((t: any) => (t.key === 'lean' ? { ...t, box: { left: 150, top: 200 } } : t)) } };
      expect(leaderProblems(lean).some(p => p.startsWith('mistake')) || plate.renderPlate(lean, { id: 'm', mistake: true }).report.issues.length > 0).toBe(true);
    });
    const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].filter((c: any) => c.cue.split(/\s+/).length > 15 || /;/.test(c.cue) || (c.cue.match(/[.?]/g) ?? []).length !== 1).map((c: any) => c.key);
    it('cues: one sentence each, 15 words or fewer, no semicolon; mutation: a 16-word cue is red', () => {
      expect(cueProblems(s())).toEqual([]);
      expect(cueProblems({ ...s(), callouts: s().callouts.map((c: any) => (c.key === 'thigh' ? { ...c, cue: 'Drive the knee up and forward until the thigh is about parallel to the floor below.' } : c)) })).toEqual(['thigh']);
    });
    it('report.mjs engine checks: no issue in the normal and the Mistake render; mutation: a box on the figure is red', () => {
      expect(rep(s()).issues).toEqual([]); expect(plate.renderPlate(s(), { id: 'm', mistake: true }).report.issues).toEqual([]);
      const bad = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'back' ? { ...c, box: { left: 175, top: 170 } } : c)) };
      expect(rep(bad).issues.length).toBeGreaterThan(0);
    });
  });
}

describe('LIB-18 glute_bridge (C; the bridge class; held: D-LIB8-shrug): A2, A18, facts, balance, A15', { timeout: T }, () => {
  const s = () => S.glute_bridge, GB = () => M.glute_bridge.GB;
  const POSES3 = ['start', 'end', 'mistake'];
  const W = 1.75;
  const allLms = (spec: any) => {
    const b = { height: W }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts?.count ?? 3;
    return [...POSES3.map(p => [p, lmOf(spec, p)]), ...Array.from({ length: n }, (_, i) => [`ghost${i}`, body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (n + 1), b).q, b))])] as [string, any][];
  };
  const withPose = (spec: any, pose: string, f: (p: any) => any) => ({ ...spec, poses: { ...spec.poses, [pose]: f(spec.poses[pose]) } });
  const shiftRoot = (p: any, dy: number, dz = 0) => ({ ...p, root: { ...p.root, at: [p.root.at[0], p.root.at[1] + dy, p.root.at[2] + dz] } });
  const movePlant = (p: any, dy: number, dz = 0) => ({ ...p, plant: Object.fromEntries(Object.entries(p.plant).map(([k, v]: [string, any]) => [k, { ...v, at: [v.at[0], v.at[1] + dy, v.at[2] + dz] }])) });

  // ---- A2: the floor is the only equipment, static in start, end and Mistake; PRIMITIVES only ----
  const a2Problems = (spec: any) => {
    const out: string[] = [], fl = (p: string) => itemsIn(spec, p).items.filter((it: any) => it.type === 'floor');
    for (const p of POSES3) {
      const its = itemsIn(spec, p).items;
      for (const it of its) if (!eng.PRIMITIVES[it.type]) out.push(`${p}: ${it.type} not a primitive`);
      if (fl(p).length !== 1) out.push(`${p}: ${fl(p).length} floors`);
      if (JSON.stringify(fl(p)) !== JSON.stringify(fl('start'))) out.push(`floor moves in ${p}`);
    }
    return out;
  };
  it('A2: one static floor in start, end and Mistake; H9 clean', () => {
    expect(a2Problems(s())).toEqual([]);
    expect(h9(s())).toEqual([]);
  });
  it('A2 mutations: the floor moved 2 cm in the Mistake, and a {type: "wedge"} item, are red', () => {
    const moved = withEq(s(), 0, (e: any) => (lm: any, ctx: any) => ({ ...e, from: ctx.pose === 'mistake' ? e.from - 0.02 : e.from }));
    expect(a2Problems(moved)).toContain('floor moves in mistake');
    const wedge = { ...s(), equipment: [...s().equipment, { type: 'wedge', at: [0, 0, 0] }] };
    expect(a2Problems(wedge).some(p => /not a primitive/.test(p))).toBe(true);
    expect(h9(wedge).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });

  // ---- A18: nothing through the floor (feet, hands on or above it; no body landmark or drawn outline > 1 cm into it) ----
  const a18Problems = (spec: any) => {
    const out: string[] = [], cam = camOf(spec), floorY = cam.P([0, 0, 0])[1]!, cm = 100 / cam.pxm;
    for (const [p, l] of allLms(spec)) {
      for (const n of ['heel.l', 'heel.r', 'ball.l', 'ball.r', 'toe.l', 'toe.r']) if (l[n][1] < -0.0005) out.push(`${p}: ${n} ${(l[n][1] * 100).toFixed(1)} cm under the floor`);
      for (const n of ['backUpper', 'backMid', 'sacrum', 'buttock', 'head', 'shoulder.r', 'wrist.l', 'wrist.r']) if (l[n][1] < -0.01) out.push(`${p}: ${n} ${(-l[n][1] * 100).toFixed(1)} cm into the floor`);
    }
    for (const p of POSES3) for (const sh of shapesIn(spec, p)) {
      const low = Math.max(...sh.poly.map((q: number[]) => q[1]!));
      if ((low - floorY) * cm > 1) out.push(`${p}: ${sh.key} outline ${((low - floorY) * cm).toFixed(1)} cm under the floor`);
    }
    return out;
  };
  it('A18: feet on or above the floor, no landmark or outline more than 1 cm into it, every pose and ghost', () => {
    expect(a18Problems(s())).toEqual([]);
  });
  it('A18 mutations: the top body lowered 2 cm (the back through the floor), and the feet 1 px below the floor, are red', () => {
    expect(a18Problems(withPose(s(), 'end', p => shiftRoot(p, -0.02))).some(x => /^end: .* into the floor|^end: .* under the floor/.test(x))).toBe(true);
    const px = 1 / camOf(s()).pxm;
    expect(a18Problems(withPose(s(), 'end', p => movePlant(p, -px))).some(x => /^end: heel\.[lr] .* under the floor/.test(x))).toBe(true);
  });

  // ---- card facts (plateFacts): contacts on the floor plane (a real plane check), knee.r 90 at the end ----
  const FACTS: [string, string][] = [['backUpper', 'start'], ['buttock', 'start'], ['heel.l', 'start'], ['heel.r', 'start'], ['ball.l', 'start'], ['ball.r', 'start'],
    ['sacrum', 'start'], ['heel.l', 'end'], ['heel.r', 'end']];
  const factProblems = (spec: any) => {
    const out: string[] = [], r = rep(spec);
    for (const [n, p] of FACTS) {
      const y = lmOf(spec, p)[n][1];
      if (Math.abs(y) > 0.01) out.push(`${p}: ${n} ${(y * 100).toFixed(1)} cm off the floor`);
      const ck = spec.checks.find((c: any) => c.landmark === n && c.pose === p && c.plane);
      if (!ck || ck.plane.point[1] !== 0 || ck.plane.normal[1] !== 1) out.push(`${p}: ${n} has no floor-plane check`);
      if (!r.checks.some((c: any) => c.landmark === n && c.pose === p && c.cm != null && c.cm <= 1)) out.push(`${p}: ${n} check not within 1 cm`);
    }
    const knee = r.angles?.end?.['knee.r'];
    if (typeof knee !== 'number' || Math.abs(knee - 90) > 2) out.push(`end knee.r ${knee}`);
    if (Math.abs(r.measure.drawnDeg - 90) > 2) out.push(`drawn knee arc ${r.measure.drawnDeg}`);
    return out;
  };
  it('facts: backUpper, buttock, sacrum, heels and balls on the floor at the start, heels at the end (+-1 cm), knee.r 90 +-2 deg', () => {
    const r = rep(s());
    console.log(`LIB-18 glute_bridge facts: ${FACTS.map(([n, p]) => `${p} ${n} ${(lmOf(s(), p)[n][1] * 100).toFixed(2)} cm`).join(', ')}; end knee.r ${r.angles.end['knee.r']}`);
    expect(factProblems(s())).toEqual([]);
  });
  it('fact mutations: the sacrum check removed, the start feet 2 cm up, and the top feet 6 cm nearer (knee off 90), are red', () => {
    expect(factProblems({ ...s(), checks: s().checks.filter((c: any) => c.landmark !== 'sacrum') })).toContain('start: sacrum has no floor-plane check');
    expect(factProblems(withPose(s(), 'start', p => movePlant(p, 0.02))).some(x => /^start: heel/.test(x))).toBe(true);
    expect(factProblems(withPose(s(), 'end', p => movePlant(p, 0, -0.06))).some(x => /knee/.test(x))).toBe(true);
  });

  // ---- c4: shoulders, hips and knees in one straight line at the top (side view, +-1 cm) ----
  const lineOff = (spec: any) => { const l = lmOf(spec, 'end'), [a, h, k] = ['shoulder.r', 'hip.r', 'knee.r'].map(n => [l[n][2], l[n][1]]); return segD(h!, a!, k!); };
  it('c4: the hip lies on the shoulder-knee line at the top (+-1 cm)', () => { expect(lineOff(s())).toBeLessThanOrEqual(0.01); });
  it('c4 mutation: the top hips 4 cm higher (feet and shoulders kept) is red', () => {
    expect(lineOff(withPose(s(), 'end', p => ({ ...shiftRoot(p, 0.04), hip: undefined })))).toBeGreaterThan(0.01);
  });

  // ---- balance (D-LIB18-BALANCE): the centre of mass between the shoulders' floor contact and the heels ----
  const comZ = (l: any) => {
    const L3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const parts: [number, number[]][] = [[0.081, l.ear], [0.497, L3(l.shoulders, l.hips, 0.5)]];
    for (const sd of ['l', 'r']) parts.push([0.028, L3(l[`shoulder.${sd}`], l[`elbow.${sd}`], 0.436)], [0.016, L3(l[`elbow.${sd}`], l[`wrist.${sd}`], 0.430)], [0.006, l[`grip.${sd}`]],
      [0.100, L3(l[`hip.${sd}`], l[`knee.${sd}`], 0.433)], [0.0465, L3(l[`knee.${sd}`], l[`ankle.${sd}`], 0.433)], [0.0145, L3(l[`heel.${sd}`], l[`toe.${sd}`], 0.5)]);
    const m = parts.reduce((a, p) => a + p[0], 0);
    return parts.reduce((a, p) => a + p[0] * p[1][2]!, 0) / m;
  };
  const balance = (spec: any) => allLms(spec).map(([p, l]) => [p, comZ(l), l['shoulder.r'][2], Math.min(l['heel.l'][2], l['heel.r'][2])] as [string, number, number, number]);
  it('balance: the centre of mass between the shoulders and the heels in every pose and ghost; offsets logged', () => {
    const rows = balance(s());
    console.log(`LIB-18 glute_bridge balance (cm ahead of the shoulders / behind the heels): ${rows.map(([p, z, a, h]) => `${p} ${((z - a) * 100).toFixed(1)}/${((h - z) * 100).toFixed(1)}`).join(', ')}`);
    for (const [p, z, a, h] of rows) { expect(z, p).toBeGreaterThan(a); expect(z, p).toBeLessThan(h); }
  });
  // A supine body folds its legs before its centre of mass leaves the base (feet 55-65 cm nearer, or the trunk 30-40 cm
  // shifted, all stay inside), so the red case is the heels drawn behind the centre of mass: the feet planted 1.2 m back.
  it('balance mutation: the top feet planted 1.2 m back (heels behind the centre of mass) is red', () => {
    expect(balance(withPose(s(), 'end', p => movePlant(p, 0, -1.2))).some(([p, z, , h]) => p === 'end' && z >= h)).toBe(true);
  });

  // ---- A15: leaders, tells, cues, the report ----
  const crossProblems = (spec: any) => {
    const out: string[] = [];
    for (const mistake of [false, true]) {
      const polys = [...shapesIn(spec, 'end'), ...shapesIn(spec, 'start'), ...(mistake ? shapesIn(spec, 'mistake') : [])].map((x: any) => x.poly), list = listOf(spec, mistake);
      leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
        let inside = 0;
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) { const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40]; if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8 && outside(polys, q) < 0) inside++; }
        if (inside) out.push(`${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: crosses the figure`);
      });
    }
    return out;
  };
  it('no leader crosses the solid end figure, the start figure or (Mistake plate) the Mistake figure', () => { expect(crossProblems(s())).toEqual([]); });
  it('mutation: the "Straight line" box placed under the bridge (its leader across the body) is red', () => {
    const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'line' ? { ...x, box: { left: 150, top: 318 } } : x)) };
    expect(crossProblems(bad).some(p => /normal line/.test(p))).toBe(true);
  });
  const traceGap = (spec: any) => {
    const svg: string = plate.renderPlate(spec, { id: 'x' }).svg, tr: number[][][] = [];
    for (const m of svg.matchAll(/<path class="trace"[^>]*? d="([^"]+)"/g)) tr.push(...segs(xy(m[1]!)));
    return leadersOf(svg).map((p, i) => {
      let min = Infinity;
      for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) { const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40]; if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of tr) min = Math.min(min, segD(q, g[0]!, g[1]!)); }
      return [listOf(spec, false)[i]?.key, min] as [string, number];
    });
  };
  it('no leader within 6 px of the Trace', () => { for (const [k, d] of traceGap(s())) expect(d, k).toBeGreaterThanOrEqual(6); });
  it('mutation: the "Pelvis tucked" anchor moved onto the hip joint (its leader along the Trace) is red', () => {
    const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'tuck' ? { ...x, anchor: { at: 'hip.r', pose: 'start', off: [0, -2] } } : x)) };
    expect(traceGap(bad).some(([k, d]) => k === 'tuck' && d < 6)).toBe(true);
  });
  const textProblems = (spec: any) => [false, true].flatMap(mistake => {
    const R = plate.renderPlate(spec, { id: 'x', mistake }), list = listOf(spec, mistake), boxes = R.report.labels.filter((l: any) => l.key !== 'meta');
    return leadersOf(R.svg).flatMap((p, i) => boxes.filter((b: any) => b.key !== list[i]?.key).flatMap((b: any) => {
      const hit = segs(p).some(([a, c]) => { for (let k = 0; k <= 40; k++) { const q = [a![0]! + (c![0]! - a![0]!) * k / 40, a![1]! + (c![1]! - a![1]!) * k / 40]; if (q[0]! > b.ink.x0 && q[0]! < b.ink.x1 && q[1]! > b.ink.y0 && q[1]! < b.ink.y1) return true; } return false; });
      return hit ? [`${list[i]?.key} crosses ${b.key}`] : [];
    }));
  });
  it('no leader crosses another label\'s text', () => { expect(textProblems(s())).toEqual([]); });
  // one tell (record: notes "One-tell record"; `high` is not a tell, ruled); its key is the card's topFault; the anchor on
  // the drawn Mistake outline, outside the end figure
  const tellProblems = (spec: any) => {
    const cam = camOf(spec), L = qaEng.poseLandmarks(Eng(), spec).lm, mp = shapesIn(spec, 'mistake').map((x: any) => x.poly), ep = shapesIn(spec, 'end').map((x: any) => x.poly), out: string[] = [];
    const card = JSON.parse(readFileSync('docs/research/howto/cards/glute_bridge.json', 'utf8'));
    if (spec.mistake.tells.length !== 1) out.push(`${spec.mistake.tells.length} tells`);
    if (spec.mistake.tells[0]?.key !== card.topFault) out.push(`first tell ${spec.mistake.tells[0]?.key} != topFault ${card.topFault}`);
    for (const t of spec.mistake.tells) {
      const p = qaEng.resolvePoint(t.anchor, 'mistake', L, cam), onM = Math.abs(outside(mp, p)), offE = outside(ep, p);
      if (!(onM <= 1.5 && offE >= -0.5)) out.push(`${t.key}: anchor ${onM.toFixed(1)} px from the Mistake outline, ${offE.toFixed(1)} px from the end figure`);
    }
    return out;
  };
  it('one tell, key arch = topFault, its anchor on the drawn Mistake outline outside the end figure', () => { expect(tellProblems(s())).toEqual([]); });
  it('tell mutations: the anchor moved to open space, and a second `high` tell added, are red', () => {
    const t0 = s().mistake.tells[0];
    expect(tellProblems({ ...s(), mistake: { ...s().mistake, tells: [{ ...t0, anchor: { at: 'knee.r', pose: 'mistake', off: [40, -60] } }] } }).length).toBe(1);
    expect(tellProblems({ ...s(), mistake: { ...s().mistake, tells: [t0, { key: 'high', text: 'Hips<br>too high', anchor: { at: 'hip.r', pose: 'mistake' }, cue: 'The hips push too high.' }] } })).toContain('2 tells');
  });
  // D-LIB18-ROUND: no solid red guide inside the figure (the arch contour is a dashed guide)
  const clearance = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
      const pts = xy(m[1]!), samp: number[][] = [];
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      return min >= 6 ? [] : [`arrow ${min.toFixed(1)} px from the end figure`];
    });
  };
  it('no solid red part within 6 px of the end figure; the arched back is a dashed guide', () => {
    expect(clearance(s())).toEqual([]);
    expect(s().mistake.guides.some((g: any) => g.kind === 'dashed')).toBe(true);
  });
  it('mutation: an arrow from the end sacrum to the Mistake sacrum (inside the figure) is red', () => {
    const guides = [...s().mistake.guides, { kind: 'arrow', from: { at: 'sacrum', pose: 'end' }, to: { at: 'sacrum', pose: 'mistake' } }];
    expect(clearance({ ...s(), mistake: { ...s().mistake, guides } }).length).toBe(1);
  });
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.trim().split(/\s+/).length, sentences = c.cue.split(/[.!?](\s|$)/).filter((x: string) => x && x.trim()).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(sentences !== 1 ? [`${c.key}: ${sentences} sentences`] : [])];
  });
  it('cues: one sentence, at most 15 words, no semicolon; labels are the card\'s checkpoint labels', () => {
    expect(cueProblems(s())).toEqual([]);
    const card = JSON.parse(readFileSync('docs/research/howto/cards/glute_bridge.json', 'utf8'));
    expect(s().callouts.map((c: any) => c.text.replace('<br>', ' '))).toEqual(card.plate.checkpoints.map((c: any) => c.label));
  });
  it('mutation: a 17-word cue is red', () => {
    const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'line' ? { ...x, cue: 'At the very top of the lift your shoulders, hips and knees all form one straight line.' } : x)) };
    expect(cueProblems(bad)).toEqual(['line: 17 words']);
  });
  it('the engine report is clean on the normal and the Mistake plate; tempo and trace as ruled', async () => {
    expect(plate.renderPlate(s(), { id: 'x' }).report.issues).toEqual([]);
    await tick();
    expect(plate.renderPlate(s(), { id: 'x', mistake: true }).report.issues).toEqual([]);
    expect(s().tempo).toEqual([{ phase: 'Lift', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]);
    expect(s().trace).toEqual({ point: 'hip.r', trim: [6, 8] });
  });
  it('mutation: the "Straight line" box moved onto the figure gives an engine issue', () => {
    const bad = { ...s(), callouts: s().callouts.map((x: any) => (x.key === 'line' ? { ...x, box: { left: 160, top: 290 } } : x)) };
    expect(plate.renderPlate(bad, { id: 'x' }).report.issues.length).toBeGreaterThan(0);
  });
});

// ---- standing_calf_raise and bodyweight_calf_raise (bulk; held S2, S4): their own helper copies, scoped to this block ----
{
  let eng: any, body: any, qaEng: any, plate: any, calf: any, SC: any, BW: any;
  beforeAll(async () => {
    [eng, body, qaEng, plate, calf, SC, BW] = await Promise.all(['engine.mjs', '../vendor/engine/body.mjs', 'qa/engine.mjs', '../vendor/engine/plate.mjs',
      'eq/calfMachine.mjs', 'specs/standing_calf_raise.mjs', 'specs/bodyweight_calf_raise.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  }, T);

  // ---- helpers (lb7test.ts:44-94 and the seated_calf_raise block's copies, unchanged) ----
  const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
  const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
    const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
    const ctx = { pose, start: L.lm.start, mistake, body: L.body };
    const out: any[] = [];
    spec.equipment.forEach((e: any, i: number) => {
      for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
    });
    return { items: out, lm };
  };
  const lmOf = (spec: any, pose: string) => qaEng.poseLandmarks(Eng(), spec).lm[pose];
  const rep = (spec: any, mistake = false) => plate.renderPlate(spec, { id: 'x', mistake }).report;
  const CAMS = new WeakMap<object, any>();
  const camOf = (spec: any) => {
    if (CAMS.has(spec)) return CAMS.get(spec);
    const c = rep(spec).camera, side = spec.view === 'side';
    const cam = { view: side ? 'side' : 'front', near: side ? 'r' : null, facing: 'right', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + (side ? w[2]! : w[0]!) * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
    CAMS.set(spec, cam); return cam;
  };
  const fullPose = (spec: any, pose: string) => (pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose]);
  const shapesOfQ = (spec: any, q: any) => body.bodyShapes(body.fk(q, { height: 1.75 }), camOf(spec), { armsFront: spec.armsFront, hand: spec.hand }).filter((x: any) => x.poly);
  const qOf = (spec: any, pose: string) => { const b = { height: 1.75 }; return body.resolve(body.normPose(fullPose(spec, pose), b), b).q; };
  const shapesIn = (spec: any, pose: string) => shapesOfQ(spec, qOf(spec, pose));
  /** Ghost poses as the engine draws them (plate.mjs:69-76: evenly spaced along start -> end). */
  const ghostQs = (spec: any) => { const b = { height: 1.75 }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts?.count ?? 3;
    return Array.from({ length: n }, (_, i) => body.poseAt(keys, (i + 1) / (n + 1), b).q); };
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
  const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
  const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });
  const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((s, x, i) => s + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
  const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });
  /** The drawn polygons (plate px) of every equipment item in one pose, keyed by entry index. */
  const drawnEq = (spec: any, pose: string) => { const cam = camOf(spec), out: Record<number, any> = {};
    for (const it of itemsIn(spec, pose, { mistake: pose === 'mistake' }).items) { const d = eng.PRIMITIVES[it.type](it, cam); out[it.entry] = { ...it, polys: d.filter((x: any) => x.poly).map((x: any) => x.poly), lines: d.filter((x: any) => x.line).map((x: any) => x.line) }; }
    return out; };
  const polyGap = (A: number[][][], B: number[][][]) => Math.min(...A.flatMap(P => P.map(p => outside(B, p))), ...B.flatMap(P => P.map(p => outside(A, p))));
  const shiftItem = (it: any, dz: number) => (it?.surface ? { ...it, surface: it.surface.map((p: number[]) => [p[0], p[1], p[2]! + dz]) } : it?.pts ? { ...it, pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! + dz]) } : it?.at ? { ...it, at: [it.at[0], it.at[1], it.at[2] + dz] } : it);
  const cm = (spec: any) => camOf(spec).pxm / 100;                // px per cm
  const POSES = ['start', 'end', 'mistake'];
  /** Every drawn pose: start, end, Mistake and the ghosts. */
  const allQs = (spec: any) => [...POSES.map(p => [p, qOf(spec, p)]), ...ghostQs(spec).map((q: any, i: number) => [`ghost${i}`, q])] as [string, any][];
  /** A spec whose start or end foot plant is turned to toe-down angle d about the same ball (the spec's own plant form). */
  const turnFoot = (spec: any, pose: 'start' | 'end', d: number, dy = 0) => {
    const a = d * Math.PI / 180, n = [0, Math.cos(a), Math.sin(a)], t = [0, -Math.sin(a), Math.cos(a)], P = spec.poses[pose].plant;
    const side = (c: any) => ({ ...c, at: [c.at[0], c.at[1] + dy, c.at[2]], normal: n, toe: t });
    return { ...spec, poses: { ...spec.poses, [pose]: { ...spec.poses[pose], plant: { l: side(P.l), r: side(P.r) } } } };
  };
  /** A spec whose pose (start, end) has its hips moved by dz (m) front-to-back, the feet left where they are. */
  const moveHips = (spec: any, pose: 'start' | 'end', dz: number) => { const p = spec.poses[pose];
    return { ...spec, poses: { ...spec.poses, [pose]: { ...p, root: { ...p.root, at: [p.root.at[0], p.root.at[1], p.root.at[2] + dz] } } } }; };
  /** Whole-body centre of mass, Winter (2009) table 4.1 fractions on the drawn landmarks (lb7test.ts:862-868). */
  const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
  const comOf = (L: any) => {
    const parts: [number, number[]][] = [[0.497, lerp3(L.hips, L.shoulders, 0.5)], [0.081, L.ear]];
    for (const side of ['l', 'r']) parts.push([0.028, lerp3(L[`shoulder.${side}`], L[`elbow.${side}`], 0.436)], [0.016, lerp3(L[`elbow.${side}`], L[`wrist.${side}`], 0.430)],
      [0.006, lerp3(L[`wrist.${side}`], L[`grip.${side}`], 0.5)], [0.100, lerp3(L[`hip.${side}`], L[`knee.${side}`], 0.433)], [0.0465, lerp3(L[`knee.${side}`], L[`ankle.${side}`], 0.433)],
      [0.0145, lerp3(L[`ankle.${side}`], L[`toe.${side}`], 0.5)]);
    const m = parts.reduce((t, [w]) => t + w, 0);
    return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i]! / m), [0, 0, 0]);
  };
  const lmQ = (q: any) => body.landmarks(body.fk(q, { height: 1.75 }));
  const kneeBend = (L: any) => 180 - angle3(L['hip.r'], L['knee.r'], L['ankle.r']);
  const trunkLean = (L: any) => Math.atan2(L.shoulders[2] - L.hips[2], L.shoulders[1] - L.hips[1]) * 180 / Math.PI;
  /** The deepest drawn foot point under a support's top face, inside its front-to-back span (cm; + = inside). */
  const toeDepthIn = (spec: any, support: number[][], q: any) => { const k = cm(spec), top = Math.min(...support.map(v => v[1]!)), x0 = Math.min(...support.map(v => v[0]!)), x1 = Math.max(...support.map(v => v[0]!));
    return Math.max(-99, ...shapesOfQ(spec, q).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => x.poly.filter((v: number[]) => v[0]! >= x0 && v[0]! <= x1).map((v: number[]) => (v[1]! - top) / k))); };
  /** The end pose with both balls lifted dy (m) off the support (reverse_lunge.mjs:19-22's method). */
  const liftEnd = (spec: any, dy: number) => { const e = spec.poses.end, up = (c: any) => ({ ...c, at: [c.at[0], c.at[1] + dy, c.at[2]] });
    return { ...spec, poses: { ...spec.poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1] + dy, e.root.at[2]] }, plant: { l: up(e.plant.l), r: up(e.plant.r) } } } }; };
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => { const w = c.cue.trim().split(/\s+/).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...((c.cue.match(/[.!?](\s|$)/g) ?? []).length !== 1 ? [`${c.key}: not one sentence`] : [])]; });
  /** Leaders (Do 7, D-LIB18-ROUND): after 4 px from the anchor a leader never enters the solid figure, the start layer,
   *  the ghosts or the dashed start phantom, nor (Mistake) the red figure; a Mistake leader may enter the end figure
   *  once, from the front, at most 81.9 px long. None runs within 6 px of the Trace or of the `keepOff` equipment, and
   *  none crosses another label's text. */
  const leaderProblems = (spec: any, mistake: boolean, keepOff: (D: any) => number[][][]) => {
    const R = plate.renderPlate(spec, { id: 'x', mistake }), out: string[] = [];
    const sp = spec.startParts, inStart = (x: any) => !sp || sp.includes(x.key) || sp.includes(x.key.replace(/^(thigh|kneecap|shank|foot)\./, 'leg.'));
    const gp = spec.ghosts?.parts, inGhost = (x: any) => !gp || gp.includes(x.key) || gp.includes(x.key.replace(/^(thigh|kneecap|shank|foot)\./, 'leg.'));
    const endPolys = shapesIn(spec, 'end').map((x: any) => x.poly);
    const others = [...shapesIn(spec, 'start').filter(inStart), ...ghostQs(spec).flatMap((q: any) => shapesOfQ(spec, q).filter(inGhost)), ...(mistake ? shapesIn(spec, 'mistake') : [])].map((x: any) => x.poly);
    const phantom = itemsIn(spec, 'end').items.filter((i: any) => /m-line/.test(i.cls ?? '')).map((i: any) => i.pts.map((p: number[]) => camOf(spec).P(p)));
    const D = drawnEq(spec, 'end'), off = keepOff(D);
    const trace = mistake ? [] : [...R.svg.matchAll(/<path class="trace"[^>]* d="([^"]+)"/g)].flatMap(([, d]) => xy(d!));
    const labels = R.report.labels.filter((l: any) => l.key !== 'meta');
    leadersOf(R.svg).forEach((pts, i) => {
      const a = pts[0]!, samples: number[][] = [];
      for (let j = 1; j < pts.length; j++) { const p = pts[j - 1]!, q = pts[j]!, n = Math.ceil(Math.hypot(q[0]! - p[0]!, q[1]! - p[1]!)); for (let t = 0; t <= n; t++) samples.push([p[0]! + (q[0]! - p[0]!) * t / n, p[1]! + (q[1]! - p[1]!) * t / n]); }
      const far = samples.filter(p => Math.hypot(p[0]! - a[0]!, p[1]! - a[1]!) > 4), farther = samples.filter(p => Math.hypot(p[0]! - a[0]!, p[1]! - a[1]!) > 8);
      const inEnd = (p: number[]) => outside(endPolys, p) < 0;
      if (!mistake && far.some(inEnd)) out.push(`leader ${i} enters the figure`);
      if (mistake) {
        const len = samples.length ? pts.slice(1).reduce((s, q, j) => s + Math.hypot(q[0]! - pts[j]![0]!, q[1]! - pts[j]![1]!), 0) : 0;
        let entries = 0; for (let j = 1; j < samples.length; j++) if (inEnd(samples[j]!) !== inEnd(samples[j - 1]!)) entries++;
        if (entries > 2) out.push(`leader ${i} enters the end figure more than once`);
        if (samples.some(inEnd) && (pts[pts.length - 1]![0]! < a[0]! || len > 81.9)) out.push(`leader ${i} enters the end figure from the back or runs ${len.toFixed(1)} px`);
      }
      if (far.some(p => outside(others, p) < 0 && !(mistake && inEnd(p)))) out.push(`leader ${i} enters the start layer, a ghost or the red figure`);
      if (far.some(p => phantom.some((L: number[][]) => L.some((q, j) => j > 0 && segD(p, L[j - 1]!, q) < 1)))) out.push(`leader ${i} crosses the start phantom`);
      if (farther.some(p => outside(off, p) < 6)) out.push(`leader ${i} runs within 6 px of the equipment`);
      if (trace.length && farther.some(p => trace.some(t => Math.hypot(t[0]! - p[0]!, t[1]! - p[1]!) < 6))) out.push(`leader ${i} runs within 6 px of the Trace`);
      const own = labels.filter((l: any) => far.some(p => p[0]! > l.ink.x0 - 2 && p[0]! < l.ink.x1 + 2 && p[1]! > l.ink.y0 - 2 && p[1]! < l.ink.y1 + 2));
      if (own.length > 1) out.push(`leader ${i} crosses another label's text`);
    });
    return out;
  };
  /** The start phantom (DRAWING-GUIDE 4): end-layer dashed lines that lie on the start limb's drawn outline (<= 1 px). */
  const phantomProblems = (spec: any, keys: string[]) => {
    const lines = itemsIn(spec, 'end').items.filter((i: any) => /m-line/.test(i.cls ?? '') && i.type === 'line'), cam = camOf(spec);
    const foot = shapesIn(spec, 'start').filter((x: any) => keys.includes(x.key)).map((x: any) => x.poly);
    if (!lines.length) return ['no start phantom'];
    const off = Math.max(...lines.flatMap((l: any) => l.pts.map((p: number[]) => Math.abs(outside(foot, cam.P(p))))));
    const startOnly = itemsIn(spec, 'start').items.some((i: any) => /m-line/.test(i.cls ?? ''));
    return [...(off > 1 ? [`phantom ${off.toFixed(1)} px off the start foot outline`] : []), ...(startOnly ? ['phantom drawn outside the end layer'] : [])];
  };
  const tellProblems = (spec: any) => { const cam = camOf(spec), L: any = { mistake: lmOf(spec, 'mistake'), end: lmOf(spec, 'end') }, mS = shapesIn(spec, 'mistake').map((x: any) => x.poly);
    return spec.mistake.tells.flatMap((t: any) => { const a = t.anchor, w = cam.P(L[a.pose ?? 'end'][a.at]), o = a.off ?? [0, 0], p = [w[0]! + o[0], w[1]! + o[1]];
      return Math.abs(outside(mS, p)) <= 2 ? [] : [`${t.key}: anchor ${outside(mS, p).toFixed(1)} px from the Mistake figure`]; }); };
  const TEMPO = [{ phase: 'Raise', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }];

  // =============================== standing_calf_raise ===============================
  const s = () => SC.default;
  // composer slot order (eq/calfMachine.mjs calfMachine's return): entry 1 + slot; seat, seat post and safety lever are null standing
  const SLOT = { beam: 0, platPost: 1, platform: 2, seatPost: 3, seat: 4, tower: 5, hub: 6, arm: 7, pad: 8, handlePost: 9, grip: 10, safety: 11 } as const;
  const E = (slot: number) => 1 + slot;

  describe('LB8 standing_calf_raise: calfMachine standing form (A2, A18 frame)', () => {
    const typeProblems = (spec: any) => POSES.flatMap(p => itemsIn(spec, p).items.filter((i: any) => !eng.PRIMITIVES[i.type]).map((i: any) => `${p}: ${i.type}`));
    it('returns PRIMITIVES types only, no seat and no safety lever; a {type: "wedge"} is red', () => {
      expect(typeProblems(s())).toEqual([]);
      const D = drawnEq(s(), 'end');
      expect([SLOT.seatPost, SLOT.seat, SLOT.safety].map(k => D[E(k)])).toEqual([undefined, undefined, undefined]);
      expect(typeProblems(withEq(s(), E(SLOT.grip), () => () => ({ type: 'wedge', part: 'lever' })))).toEqual(['start: wedge', 'end: wedge', 'mistake: wedge']);
    });
    /** Static parts (frame, platform) draw the same polygon (+-1 px) in start, end and Mistake; every lever
     *  part carries a polygon (`poly` or the sideBar backPad), so the Mistake draws whichever moves (plate.mjs:205-218). */
    const a2Problems = (spec: any) => {
      const D: any = Object.fromEntries(POSES.map(p => [p, drawnEq(spec, p)])), out: string[] = [];
      for (const k of Object.keys(D.end).map(Number)) {
        const it = D.end[k], same = (p: string) => D[p][k] && D[p][k].polys.length === it.polys.length && D[p][k].polys.every((P: number[][], i: number) => P.every((q, j) => Math.hypot(q[0]! - it.polys[i][j][0], q[1]! - it.polys[i][j][1]) <= 1));
        if (['frame', 'platform'].includes(it.part)) { for (const p of ['start', 'mistake']) if (!same(p)) out.push(`static ${it.part} entry ${k} moves in ${p}`); }
        else if (it.part === 'lever') {
          if (!['poly', 'backPad'].includes(it.type) || !it.polys.length) out.push(`moving entry ${k} is a ${it.type} without a polygon`);
        }
      }
      return out;
    };
    it('A2: static parts fixed (+-1 px) in start, end and Mistake; the lever parts carry poly (the arm and grip move in the Mistake)', () => {
      expect(a2Problems(s())).toEqual([]);
      const D = drawnEq(s(), 'end'), Dm = drawnEq(s(), 'mistake'), moved = (k: number) => D[k].polys[0].some((q: number[], j: number) => Math.hypot(q[0]! - Dm[k].polys[0][j][0], q[1]! - Dm[k].polys[0][j][1]) > 1);
      expect([SLOT.arm, SLOT.grip].map(k => moved(E(k)))).toEqual([true, true]);
    });
    it('A2 mutations: the platform moved 2 cm in the Mistake, and the lever arm drawn with `line`, are red', () => {
      const moved = withEq(s(), E(SLOT.platform), e => (lm: any, ctx: any) => (ctx.pose === 'mistake' ? shiftItem(e(lm, ctx), 0.02) : e(lm, ctx)));
      expect(a2Problems(moved)).toContain(`static platform entry ${E(SLOT.platform)} moves in mistake`);
      const asLine = withEq(s(), E(SLOT.arm), e => (lm: any, ctx: any) => ({ type: 'line', pts: e(lm, ctx).surface, part: 'lever', z: 'back' }));
      expect(a2Problems(asLine)).toContain(`moving entry ${E(SLOT.arm)} is a line without a polygon`);
    });
    /** D-LIB18-FRAME: each pad, platform and lever part joins its frame (touching or overlapping polygons, <= 0.5 px). */
    const JOINS: [keyof typeof SLOT, keyof typeof SLOT][] = [['platform', 'platPost'], ['platPost', 'beam'], ['tower', 'beam'], ['hub', 'tower'], ['arm', 'hub'], ['arm', 'pad'], ['handlePost', 'arm'], ['grip', 'handlePost']];
    const frameProblems = (spec: any) => POSES.flatMap(p => { const D = drawnEq(spec, p);
      return JOINS.filter(([a, b]) => !D[E(SLOT[a])] || !D[E(SLOT[b])] || polyGap(D[E(SLOT[a])].polys, D[E(SLOT[b])].polys) > 0.5).map(([a, b]) => `${p}: ${a} not joined to ${b}`); });
    it('A18: every pad, platform and lever part is joined to the frame in every pose', () => {
      expect(frameProblems(s())).toEqual([]);
    });
    it('A18 mutations: the platform post removed, and the handle post 3 cm off the arm, are red', () => {
      expect(frameProblems(withEq(s(), E(SLOT.platPost), () => () => null))).toContain('end: platform not joined to platPost');
      const off = withEq(s(), E(SLOT.handlePost), e => (lm: any, ctx: any) => shiftItem(e(lm, ctx), 0.4));
      expect(frameProblems(off)).toContain('end: handlePost not joined to arm');
    });
  });

  describe('LB8 standing_calf_raise: contacts and physics (A2, A18, D-LIB18-BALANCE)', () => {
    /** Each contact the card places, on its drawn item (+-1 cm): balls on the platform's top (c1, c7), hands on the
     *  handle grip (c2, c3), the shoulder tops on the shoulder pad's lower face (c1), and no landmark of the shoulder line
     *  (shoulder top, trap, shoulder joint), the part that rests on the pads, more than 1 cm inside it. */
    const contactProblems = (spec: any) => POSES.flatMap(p => {
      const L = lmOf(spec, p), D = drawnEq(spec, p), cam = camOf(spec), k = cm(spec), out: string[] = [];
      const plat = D[E(SLOT.platform)].polys[0], top = Math.min(...plat.map((q: number[]) => q[1])), x0 = Math.min(...plat.map((q: number[]) => q[0])), x1 = Math.max(...plat.map((q: number[]) => q[0]));
      for (const sd of ['l', 'r']) { const b = cam.P(L[`ball.${sd}`]); if (Math.abs(b[1]! - top) > k || b[0]! < x0 || b[0]! > x1) out.push(`${p}: ball.${sd} off the platform`); }
      const g = D[E(SLOT.grip)].polys[0], gc = [g.reduce((a: number, q: number[]) => a + q[0]!, 0) / g.length, g.reduce((a: number, q: number[]) => a + q[1]!, 0) / g.length];
      for (const sd of ['l', 'r']) { const w = cam.P(L[`grip.${sd}`]); if (Math.hypot(w[0]! - gc[0]!, w[1]! - gc[1]!) > k) out.push(`${p}: grip.${sd} off the handle`); }
      const pad = D[E(SLOT.pad)].polys;
      for (const sd of ['l', 'r']) { const d = outside(pad, cam.P(L[`shoulderTop.${sd}`])); if (Math.abs(d) > k) out.push(`${p}: shoulderTop.${sd} ${(d / k).toFixed(1)} cm off the pad`); }
      for (const n of ['shoulderTop.l', 'shoulderTop.r', 'trap.l', 'trap.r', 'shoulder.l', 'shoulder.r']) { const d = outside(pad, cam.P(L[n])); if (d < -k) out.push(`${p}: ${n} ${(-d / k).toFixed(1)} cm inside the pad`); }
      return out;
    });
    it('A2: balls on the platform, hands on the grip, shoulder tops on the pad (+-1 cm) in every pose', () => {
      expect(contactProblems(s())).toEqual([]);
    });
    it('A2 mutation: one foot 2 cm off its platform at the end is red', () => {
      const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, plant: { ...e.plant, r: { ...e.plant.r, at: [e.plant.r.at[0], e.plant.r.at[1] + 0.02, e.plant.r.at[2]] } } } } };
      expect(contactProblems(bad)).toContain('end: ball.r off the platform');
    });
    it('A2/A18 mutation: the shoulder pad left at its start place (the lever not riding on the shoulders) is red', () => {
      const stuck = withEq(s(), E(SLOT.pad), e => (lm: any, ctx: any) => e(ctx.start, ctx));
      expect(contactProblems(stuck).some(x => /^end: shoulderTop\.r .* (off|inside) the pad/.test(x))).toBe(true);
    });
    const floorProblems = (spec: any) => { const floorY = camOf(spec).P([0, 0, 0])[1]!;
      return allQs(spec).flatMap(([p, q]) => shapesOfQ(spec, q).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => x.poly.some((v: number[]) => v[1]! > floorY) ? [`${p}: ${x.key} below the floor`] : [])); };
    it('A18: every drawn foot on or above the floor line in every pose, ghosts included; a start foot 1 px under is red', () => {
      expect(floorProblems(s())).toEqual([]);
      const cam = camOf(s()), floorY = cam.P([0, 0, 0])[1]!, lowest = Math.max(...shapesIn(s(), 'start').filter((x: any) => x.key === 'foot.r').flatMap((x: any) => x.poly.map((v: number[]) => v[1]!)));
      const st = s().poses.start, drop = (floorY - lowest + 1) / cam.pxm, dn = (c: any) => ({ ...c, at: [c.at[0], c.at[1] - drop, c.at[2]] });
      const low = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [st.root.at[0], st.root.at[1] - drop, st.root.at[2]] }, plant: { l: dn(st.plant.l), r: dn(st.plant.r) } } } };
      expect(floorProblems(low)).toContain('start: foot.r below the floor');
    });
    const platOf = (spec: any) => drawnEq(spec, 'start')[E(SLOT.platform)].polys[0];
    it('A18: the start foot (and the start-side ghost) clear of the platform; a start toe 2 cm inside is red', () => {
      expect(toeDepthIn(s(), platOf(s()), qOf(s(), 'start'))).toBeLessThanOrEqual(1);
      const bad = turnFoot(s(), 'start', 30);
      expect(toeDepthIn(bad, platOf(bad), qOf(bad, 'start'))).toBeGreaterThan(1);
    });
    it('S4 (HELD, D-LIB18-CALF): the rigid toe inside the platform at the card-true top; the reverse_lunge lift instead takes the balls off it', () => {
      // Recorded, not passed: pins the measured depths so a change to the range or the platform shows here; the plate stays
      // held until the owner rules. The reverse_lunge method (the ball lifted until the toe pad just touches) is measured too.
      const end = toeDepthIn(s(), platOf(s()), qOf(s(), 'end')), mis = toeDepthIn(s(), platOf(s()), qOf(s(), 'mistake'));
      let lo = 0, hi = 0.2; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2, x = liftEnd(s(), m); if (toeDepthIn(x, platOf(x), qOf(x, 'end')) > 0) lo = m; else hi = m; }
      console.log(`LIB-18 standing_calf_raise S4: toe ${end.toFixed(2)} cm inside the platform at the end, ${mis.toFixed(2)} cm in the Mistake; the balls ${(hi * 100).toFixed(2)} cm off it with the toe pad just touching`);
      expect(end).toBeGreaterThan(1);
      expect(hi * 100).toBeGreaterThan(1);
    });
    /** D-LIB18-BALANCE: the base is the forefoot on the platform edge (c1), a point base: the centre of mass within 2 cm
     *  of the balls front-to-back in every drawn pose; the shoulder-pad load sits on the shoulder tops (c1, c2), so the sum
     *  with any load stays inside when the shoulder tops are within 2 cm of the same plumb line too (a load equal to the
     *  body weight is checked). */
    const balanceProblems = (spec: any) => allQs(spec).flatMap(([p, q]) => { const L = lmQ(q), ball = L['ball.r'][2], c = comOf(L)[2]!, st = L['shoulderTop.r'][2], out: string[] = [];
      if (Math.abs(c - ball) > 0.02) out.push(`${p}: centre of mass ${((c - ball) * 100).toFixed(1)} cm from the balls`);
      if (Math.abs((c + st) / 2 - ball) > 0.02) out.push(`${p}: with a body-weight load on the shoulders ${(((c + st) / 2 - ball) * 100).toFixed(1)} cm from the balls`);
      return out; });
    it('A18: the centre of mass (and with the shoulder load) over the balls in every pose and ghost (offsets logged)', () => {
      for (const [p, q] of allQs(s())) { const L = lmQ(q); console.log(`LIB-18 standing_calf_raise ${p}: centre of mass ${((comOf(L)[2]! - L['ball.r'][2]) * 100).toFixed(2)} cm, shoulder tops ${((L['shoulderTop.r'][2] - L['ball.r'][2]) * 100).toFixed(2)} cm from the balls`); }
      expect(balanceProblems(s())).toEqual([]);
    });
    it('A18 mutation: the trunk and hips 5 cm back at the top (the load moved off the base) is red', () => {
      expect(balanceProblems(moveHips(s(), 'end', -0.05)).some(x => x.startsWith('end:'))).toBe(true);
    });
  });

  describe('LB8 standing_calf_raise: card facts, sizes, Mistake, labels (A6, A15, A17)', () => {
    /** The sized numbers on the drawn body: knees KNEE_SOFT 15 (c5 "slightly bent", leg_press.mjs:13/:23) in the start
     *  and the end, +-2, in the sagittal plane; trunk upright (c2, c11), +-2; the ankle START_DF 20 dorsiflexed at the
     *  start (c10) and END_PF 50 plantar flexed at the end (c7), +-2 (engine report angles); the Mistake knee locked
     *  (M_LOCK 0, c6), <= 2. */
    const factProblems = (spec: any) => { const out: string[] = [], A = rep(spec).angles, Am = rep(spec, true);
      for (const p of ['start', 'end']) { const L = lmOf(spec, p);
        if (Math.abs(kneeBend(L) - 15) > 2) out.push(`${p}: knee ${kneeBend(L).toFixed(1)}`);
        if (Math.abs(L['knee.r'][0] - L['hip.r'][0]) > 0.005) out.push(`${p}: knee out of the sagittal plane`);
        if (Math.abs(trunkLean(L)) > 2) out.push(`${p}: trunk ${trunkLean(L).toFixed(1)} from upright`); }
      if (Math.abs(A.start['ankle.r'] - 20) > 2) out.push(`start: ankle ${A.start['ankle.r']}`);
      if (Math.abs(A.end['ankle.r'] + 50) > 2) out.push(`end: ankle ${A.end['ankle.r']}`);
      const Lm = lmOf(spec, 'mistake'); if (kneeBend(Lm) > 2) out.push(`mistake: knee ${kneeBend(Lm).toFixed(1)} not locked`);
      void Am; return out; };
    it('knees 15 (+-2) at start and end, trunk upright, ankle 20 / -50, Mistake knee locked', () => {
      for (const p of POSES) { const L = lmOf(s(), p); console.log(`LIB-18 standing_calf_raise ${p}: knee ${kneeBend(L).toFixed(1)}, trunk ${trunkLean(L).toFixed(1)}, ankle ${rep(s()).angles[p === 'mistake' ? 'end' : p]['ankle.r']}`); }
      expect(factProblems(s())).toEqual([]);
    });
    it('fact mutations: the end foot turned 30 deg toe-down (ankle off), and the Mistake knee left at the end\'s bend, are red', () => {
      expect(factProblems(turnFoot(s(), 'end', 30)).some(x => x.startsWith('end: ankle') || x.startsWith('end: knee'))).toBe(true);
      expect(factProblems({ ...s(), mistake: { ...s().mistake, pose: { root: s().poses.end.root } } })).toContain(`mistake: knee ${kneeBend(lmOf(s(), 'end')).toFixed(1)} not locked`);
    });
    /** PQ-H6 (CARD FIELDS): each contact fact has a check on its landmark and pose on the surface it touches: the balls
     *  and toes on the platform's drawn top face, the shoulder tops on the drawn pad's lower face (its plane point on the
     *  pad's outline, +-1 px); the wrists at the drawn grip (the hand fact form, as seated_calf_raise and hack_squat). */
    const FACTS: [string, string][] = [['ball.l', 'start'], ['ball.r', 'start'], ['toe.l', 'start'], ['toe.r', 'start'], ['shoulderTop.l', 'start'], ['shoulderTop.r', 'start'], ['wrist.l', 'start'], ['wrist.r', 'start'], ['ball.l', 'end'], ['ball.r', 'end']];
    const h6Problems = (spec: any) => { const cam = camOf(spec), out: string[] = [];
      for (const [lmk, pose] of FACTS) {
        const c = spec.checks.find((x: any) => x.landmark === lmk && (x.pose === pose || x.pose === 'all') && (x.plane || x.at));
        if (!c) { out.push(`${lmk} ${pose}: no check`); continue; }
        if (/^(ball|toe)/.test(lmk)) { const top = Math.min(...drawnEq(spec, pose)[E(SLOT.platform)].polys[0].map((q: number[]) => q[1])); if (!c.plane || Math.abs(cam.P(c.plane.point)[1]! - top) > 1) out.push(`${lmk} ${pose}: not on the platform's top`); }
        if (/^shoulderTop/.test(lmk)) { const pad = drawnEq(spec, pose)[E(SLOT.pad)].polys; if (!c.plane || Math.abs(outside(pad, cam.P(c.plane.point))) > 1) out.push(`${lmk} ${pose}: not on the pad's face`); }
      }
      return out; };
    it('PQ-H6: every card contact fact has a real-surface check; the toe miss is the S4 hold (2.3 cm, logged)', () => {
      expect(h6Problems(s())).toEqual([]);
      const misses = rep(s()).checks.filter((c: any) => c.cm > 0.5).map((c: any) => `${c.pose}:${c.landmark}:${c.cm}cm`);
      console.log(`LIB-18 standing_calf_raise fact misses: ${misses.join(', ')}`);
      expect(misses).toEqual(['start:toe.l:2.3cm', 'start:toe.r:2.3cm']);
    });
    it('PQ-H6 mutation: the shoulder checks moved 3 cm up off the pad face is red', () => {
      const up = { ...s(), checks: s().checks.map((c: any) => (/^shoulderTop/.test(c.landmark) ? { ...c, plane: { ...c.plane, point: [c.plane.point[0], c.plane.point[1] + 0.03, c.plane.point[2]] } } : c)) };
      expect(h6Problems(up)).toContain('shoulderTop.l start: not on the pad\'s face');
    });
    it('A15: the start phantom is the start foot\'s outline, in the end layer; removed is red', () => {
      expect(phantomProblems(s(), ['foot.r'])).toEqual([]);
      const n = s().equipment.length, gone = { ...s(), equipment: s().equipment.slice(0, 1 + calf.CALF_MACHINE_ITEMS) };
      expect(n).toBeGreaterThan(1 + calf.CALF_MACHINE_ITEMS);
      expect(phantomProblems(gone, ['foot.r'])).toEqual(['no start phantom']);
    });
    /** The red Mistake reads outside the solid end figure (13.1): some red leg point (the locked knee's back) clears the
     *  end figure by >= 6 px. */
    it('A15: the red Mistake leg clears the end figure by >= 6 px; the Mistake equal to the end is red', () => {
      const clear = (spec: any) => { const endS = shapesIn(spec, 'end').map((x: any) => x.poly);
        return Math.max(...shapesIn(spec, 'mistake').filter((x: any) => /^(thigh|kneecap|shank)\.r/.test(x.key)).flatMap((x: any) => x.poly.map((v: number[]) => outside(endS, v)))); };
      console.log(`LIB-18 standing_calf_raise Mistake leg clearance ${clear(s()).toFixed(1)} px`);
      expect(clear(s())).toBeGreaterThanOrEqual(6);
      expect(clear({ ...s(), mistake: { ...s().mistake, pose: { root: s().poses.end.root, plant: s().poses.end.plant, reach: s().poses.end.reach } } })).toBeLessThan(6);
    });
    it('A15: one tell, key "lock", anchored on the red knee; the anchor moved off the figure is red', () => {
      expect(s().mistake.tells.map((t: any) => t.key)).toEqual(['lock']);
      expect(tellProblems(s())).toEqual([]);
      const off = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((t: any) => ({ ...t, anchor: { ...t.anchor, off: [40, 0] } })) } };
      expect(tellProblems(off).length).toBe(1);
    });
    const keepOff = (D: any) => [SLOT.pad, SLOT.platform, SLOT.tower, SLOT.arm, SLOT.handlePost, SLOT.grip].flatMap(k => D[E(k)].polys);
    it('A15: no leader enters a figure, a ghost or the phantom, or runs near the Trace or the machine; the Mistake leader enters the end figure once, from the front', () => {
      expect(["normal", ...leaderProblems(s(), false, keepOff)]).toEqual(["normal"]);
      expect(leaderProblems(s(), true, keepOff)).toEqual([]);
    });
    it('A15 mutations: "Upright" boxed beyond the tower (leader across it) and "Knees soft" boxed left of the legs are red', () => {
      const behind = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'upright' ? { ...c, box: { left: 40, top: 124 } } : c)) };
      expect(leaderProblems(behind, false, keepOff).some(x => /within 6 px of the equipment/.test(x))).toBe(true);
      const left = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'knees' ? { ...c, box: { left: 130, top: 214 } } : c)) };
      expect(leaderProblems(left, false, keepOff).some(x => /enters the figure|start layer, a ghost/.test(x))).toBe(true);
    });
    it('Q-D5-6: every cue is one sentence of 15 words or fewer, no semicolon; a 16-word cue is red', () => {
      expect(cueProblems(s())).toEqual([]);
      const long = { ...s(), callouts: s().callouts.map((c: any, i: number) => (i === 0 ? { ...c, cue: 'Put the balls of both your feet on the platform edge with the heels hanging off.' } : c)) };
      expect(cueProblems(long)).toEqual(['balls: 16 words']);
    });
    it('callouts are the card\'s 3 checkpoints with its cues; tempo the ruled row; a 2 s Hold is red', () => {
      expect(s().callouts.map((c: any) => [c.text.replace('<br>', ' '), c.cue])).toEqual([['Balls of feet', 'Balls of the feet on the platform edge, heels hanging off.'],
        ['Knees soft', 'Knees slightly bent and stable, never locked.'], ['Upright', 'Stand upright under the pads, back straight.']]);
      expect(s().tempo).toEqual(TEMPO);
      expect(s().tempo.map((t: any) => (t.phase === 'Hold' ? { ...t, s: 2 } : t))).not.toEqual(TEMPO);
    });
    /** A17: the trace point is the heel (D-LIB18-CALF, -TRACE), trim [10, 12] (barbell_back_squat.mjs:117, D-LIB18-TRIM). */
    const traceProblems = (spec: any) => [...(spec.trace.point !== 'heel.r' ? [`trace at ${spec.trace.point}`] : []), ...(JSON.stringify(spec.trace.trim) !== JSON.stringify([10, 12]) || JSON.stringify(SC.SIZES.TRACE_TRIM) !== JSON.stringify([10, 12]) ? ['trim not [10, 12]'] : [])];
    it('A17: the Trace follows the heel with trim [10, 12]; traced at the toe is red', () => {
      expect(traceProblems(s())).toEqual([]);
      expect(traceProblems({ ...s(), trace: { ...s().trace, point: 'toe.r' } })).toEqual(['trace at toe.r']);
    });
    it('report.mjs engine checks: only the S4 toe misses in the plate and the Mistake; a box moved onto the figure is red', () => {
      const want = ['check:start:toe.l:2.3cm', 'check:start:toe.r:2.3cm'];
      expect(rep(s()).issues).toEqual(want);
      expect(rep(s(), true).issues).toEqual(want);
      const onFig = { ...s(), callouts: s().callouts.map((c: any) => (c.key === 'knees' ? { ...c, box: { left: 196, top: 160 } } : c)) };
      expect(rep(onFig).issues.length).toBeGreaterThan(want.length);
    });
    it('F7: drawable false, the drawn fault named in pilot.drawableFault (bouncing is the top fault, speed only)', () => {
      expect(s().pilot.drawableFault).toMatch(/bouncing/);
      expect(s().mistake.tells[0].key).not.toBe('bounce');
    });
  });

  // =============================== bodyweight_calf_raise ===============================
  const b = () => BW.default;
  const STEP_E = 1;                                               // equipment entry of the step (vendor box)
  const stepOf = (spec: any, pose = 'start') => drawnEq(spec, pose)[STEP_E].polys[0];

  describe('LB8 bodyweight_calf_raise: the step, contacts and physics (A2, A18, D-LIB18-BALANCE)', () => {
    /** The step is static (the same polygon +-1 px in start, end and Mistake) and stands on the floor line (+-0.5 px). */
    const stepProblems = (spec: any) => { const out: string[] = [], floorY = camOf(spec).P([0, 0, 0])[1]!, s0 = stepOf(spec, 'end');
      for (const p of ['start', 'mistake']) { const q = stepOf(spec, p); if (!q || q.length !== s0.length || q.some((v: number[], i: number) => Math.hypot(v[0]! - s0[i]![0]!, v[1]! - s0[i]![1]!) > 1)) out.push(`step moves in ${p}`); }
      if (Math.abs(Math.max(...s0.map((v: number[]) => v[1]!)) - floorY) > 0.5) out.push('step not on the floor');
      return out; };
    it('A2/A18: the step is static and stands on the floor; moved 2 cm in the Mistake, or lifted 2 cm, is red', () => {
      expect(b().equipment.filter((e: any) => typeof e !== 'function').map((e: any) => e.type)).toEqual(['floor', 'box']);
      expect(stepProblems(b())).toEqual([]);
      const moved = withEq(b(), STEP_E, e => (lm: any, ctx: any) => (ctx.pose === 'mistake' ? shiftItem(e, 0.02) : e));
      expect(stepProblems(moved)).toContain('step moves in mistake');
      const up = withEq(b(), STEP_E, e => ({ ...e, at: [e.at[0], e.at[1] + 0.02, e.at[2]] }));
      expect(stepProblems(up)).toContain('step not on the floor');
    });
    /** The balls on the step's drawn top face (+-1 cm, inside its span) in every pose (c3, c4); the heels hang off its rear edge. */
    const contactProblems = (spec: any) => POSES.flatMap(p => { const L = lmOf(spec, p), st = stepOf(spec, p), cam = camOf(spec), k = cm(spec), out: string[] = [];
      const top = Math.min(...st.map((q: number[]) => q[1])), x0 = Math.min(...st.map((q: number[]) => q[0])), x1 = Math.max(...st.map((q: number[]) => q[0]));
      for (const sd of ['l', 'r']) { const bb = cam.P(L[`ball.${sd}`]); if (Math.abs(bb[1]! - top) > k || bb[0]! < x0 || bb[0]! > x1) out.push(`${p}: ball.${sd} off the step`); }
      if (cam.P(L['heel.r'])[0]! >= x0) out.push(`${p}: heel over the step`);
      return out; });
    it('A2: the balls on the step and the heels off its edge in every pose; one foot 2 cm up at the end is red', () => {
      expect(contactProblems(b())).toEqual([]);
      const e = b().poses.end, bad = { ...b(), poses: { ...b().poses, end: { ...e, plant: { ...e.plant, r: { ...e.plant.r, at: [e.plant.r.at[0], e.plant.r.at[1] + 0.02, e.plant.r.at[2]] } } } } };
      expect(contactProblems(bad)).toContain('end: ball.r off the step');
    });
    it('c2 "slightly below": the start heel under the step\'s top (depth logged); the start foot turned level is red', () => {
      const below = (spec: any) => (camOf(spec).P(lmOf(spec, 'start')['heel.r'])[1]! - Math.min(...stepOf(spec).map((q: number[]) => q[1]!))) / cm(spec);
      console.log(`LIB-18 bodyweight_calf_raise start heel ${below(b()).toFixed(1)} cm below the step top`);
      expect(below(b())).toBeGreaterThan(0.5);
      expect(below(turnFoot(b(), 'start', 0))).toBeLessThanOrEqual(0.5);
    });
    const floorProblems = (spec: any) => { const floorY = camOf(spec).P([0, 0, 0])[1]!;
      return allQs(spec).flatMap(([p, q]) => shapesOfQ(spec, q).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => x.poly.some((v: number[]) => v[1]! > floorY) ? [`${p}: ${x.key} below the floor`] : [])); };
    it('A18: every drawn foot on or above the floor line in every pose, ghosts included; a start foot 1 px under is red', () => {
      expect(floorProblems(b())).toEqual([]);
      const cam = camOf(b()), floorY = cam.P([0, 0, 0])[1]!, lowest = Math.max(...shapesIn(b(), 'start').filter((x: any) => x.key === 'foot.r').flatMap((x: any) => x.poly.map((v: number[]) => v[1]!)));
      const st = b().poses.start, drop = (floorY - lowest + 1) / cam.pxm, dn = (c: any) => ({ ...c, at: [c.at[0], c.at[1] - drop, c.at[2]] });
      const low = { ...b(), poses: { ...b().poses, start: { ...st, root: { ...st.root, at: [st.root.at[0], st.root.at[1] - drop, st.root.at[2]] }, plant: { l: dn(st.plant.l), r: dn(st.plant.r) } } } };
      expect(floorProblems(low)).toContain('start: foot.r below the floor');
    });
    it('A18: the start foot clear of the step; a start toe 2 cm inside is red', () => {
      expect(toeDepthIn(b(), stepOf(b()), qOf(b(), 'start'))).toBeLessThanOrEqual(1);
      const bad = turnFoot(b(), 'start', 30);
      expect(toeDepthIn(bad, stepOf(bad), qOf(bad, 'start'))).toBeGreaterThan(1);
    });
    it('S4 (HELD, D-LIB18-CALF): the rigid toe inside the step at the card-true top; the reverse_lunge lift instead takes the balls off it', () => {
      const end = toeDepthIn(b(), stepOf(b()), qOf(b(), 'end')), mis = toeDepthIn(b(), stepOf(b()), qOf(b(), 'mistake'));
      let lo = 0, hi = 0.2; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2, x = liftEnd(b(), m); if (toeDepthIn(x, stepOf(x), qOf(x, 'end')) > 0) lo = m; else hi = m; }
      console.log(`LIB-18 bodyweight_calf_raise S4: toe ${end.toFixed(2)} cm inside the step at the end, ${mis.toFixed(2)} cm in the Mistake; the balls ${(hi * 100).toFixed(2)} cm off it with the toe pad just touching`);
      expect(end).toBeGreaterThan(1);
      expect(hi * 100).toBeGreaterThan(1);
    });
    /** D-LIB18-BALANCE: the forefoot on the step edge (c3, c4), a point base: the centre of mass within 2 cm of the balls. */
    const balanceProblems = (spec: any) => allQs(spec).flatMap(([p, q]) => { const L = lmQ(q), d = comOf(L)[2]! - L['ball.r'][2];
      return Math.abs(d) <= 0.02 ? [] : [`${p}: centre of mass ${(d * 100).toFixed(1)} cm from the balls`]; });
    it('A18: the centre of mass over the balls in every pose and ghost (offsets and the body lean logged)', () => {
      for (const [p, q] of allQs(b())) { const L = lmQ(q), lean = Math.atan2(L['hip.r'][2] - L['ankle.r'][2], L['hip.r'][1] - L['ankle.r'][1]) * 180 / Math.PI;
        console.log(`LIB-18 bodyweight_calf_raise ${p}: centre of mass ${((comOf(L)[2]! - L['ball.r'][2]) * 100).toFixed(2)} cm from the balls; ankle-hip line ${lean.toFixed(1)} deg forward of vertical, trunk ${trunkLean(L).toFixed(1)}`); }
      expect(balanceProblems(b())).toEqual([]);
    });
    it('A18 mutation: the body tipped 5 cm back at the top is red', () => {
      expect(balanceProblems(moveHips(b(), 'end', -0.05)).some(x => x.startsWith('end:'))).toBe(true);
    });
  });

  describe('LB8 bodyweight_calf_raise: card facts, sizes, Mistake, labels (A6, A15, A17)', () => {
    /** Knees KNEE_SOFT 5 (c7 "straight but unlocked", barbell_back_squat.mjs:30), +-2, sagittal; trunk upright (c1
     *  "standing tall"), +-2; the ankle START_DF 20 (c2 "for stretch") and END_PF 50 (c4), +-2; the Mistake ankle half way,
     *  20 - 0.5 x 70 = -15 (M_PART 0.5), +-2; arms hanging by the sides (c1's first option: elbows straight, wrists under the
     *  shoulders within 3 cm front-to-back). */
    const factProblems = (spec: any) => { const out: string[] = [], A = rep(spec).angles, Am = rep(spec, true).angles;
      for (const p of ['start', 'end']) { const L = lmOf(spec, p);
        if (Math.abs(kneeBend(L) - 5) > 2) out.push(`${p}: knee ${kneeBend(L).toFixed(1)}`);
        if (Math.abs(L['knee.r'][0] - L['hip.r'][0]) > 0.005) out.push(`${p}: knee out of the sagittal plane`);
        if (Math.abs(trunkLean(L)) > 2) out.push(`${p}: trunk ${trunkLean(L).toFixed(1)} from upright`);
        if (Math.abs(L['wrist.r'][2] - L['shoulder.r'][2]) > 0.03) out.push(`${p}: arm not by the side`); }
      if (Math.abs(A.start['ankle.r'] - 20) > 2) out.push(`start: ankle ${A.start['ankle.r']}`);
      if (Math.abs(A.end['ankle.r'] + 50) > 2) out.push(`end: ankle ${A.end['ankle.r']}`);
      if (Math.abs(Am.mistake['ankle.r'] + 15) > 2) out.push(`mistake: ankle ${Am.mistake['ankle.r']}`);
      return out; };
    it('knees 5 (+-2), trunk upright, arms by the sides, ankle 20 / -50, Mistake ankle -15', () => {
      for (const p of ['start', 'end']) { const L = lmOf(b(), p); console.log(`LIB-18 bodyweight_calf_raise ${p}: knee ${kneeBend(L).toFixed(1)}, trunk ${trunkLean(L).toFixed(1)}, ankle ${rep(b()).angles[p]['ankle.r']}`); }
      expect(factProblems(b())).toEqual([]);
    });
    it('fact mutations: the end foot turned 30 deg toe-down, and the Mistake at the end\'s foot, are red', () => {
      expect(factProblems(turnFoot(b(), 'end', 30)).some(x => x.startsWith('end:'))).toBe(true);
      expect(factProblems({ ...b(), mistake: { ...b().mistake, pose: { root: b().poses.end.root, plant: b().poses.end.plant } } }).some(x => x.startsWith('mistake: ankle'))).toBe(true);
    });
    const FACTS: [string, string][] = [['ball.l', 'start'], ['ball.r', 'start'], ['ball.l', 'end'], ['ball.r', 'end'], ['toe.l', 'end'], ['toe.r', 'end']];
    const h6Problems = (spec: any) => { const cam = camOf(spec), out: string[] = [];
      for (const [lmk, pose] of FACTS) { const c = spec.checks.find((x: any) => x.landmark === lmk && (x.pose === pose || x.pose === 'all') && x.plane);
        const top = Math.min(...stepOf(spec, pose).map((q: number[]) => q[1]!));
        if (!c || Math.abs(cam.P(c.plane.point)[1]! - top) > 1) out.push(`${lmk} ${pose}: no check on the step's top`); }
      return out; };
    it('PQ-H6: every card contact fact has a check on the step\'s drawn top; the end toe miss is the S4 hold (4.6 cm, logged)', () => {
      expect(h6Problems(b())).toEqual([]);
      const misses = rep(b()).checks.filter((c: any) => c.cm > 0.5).map((c: any) => `${c.pose}:${c.landmark}:${c.cm}cm`);
      console.log(`LIB-18 bodyweight_calf_raise fact misses: ${misses.join(', ')}`);
      expect(misses).toEqual(['end:toe.l:4.6cm', 'end:toe.r:4.6cm']);
    });
    it('PQ-H6 mutation: the toe checks moved 3 cm above the step is red', () => {
      const up = { ...b(), checks: b().checks.map((c: any) => (/^toe/.test(c.landmark) ? { ...c, plane: { ...c.plane, point: [c.plane.point[0], c.plane.point[1] + 0.03, c.plane.point[2]] } } : c)) };
      expect(h6Problems(up)).toContain('toe.l end: no check on the step\'s top');
    });
    it('A15: the start phantom is the start foot\'s outline, in the end layer; removed is red', () => {
      expect(phantomProblems(b(), ['foot.r'])).toEqual([]);
      expect(phantomProblems({ ...b(), equipment: b().equipment.slice(0, 2) }, ['foot.r'])).toEqual(['no start phantom']);
    });
    /** The red Mistake foot clears the solid end figure by >= 6 px (13.1), and the one tell sits on the red heel. */
    const mistakeClear = (spec: any) => { const endS = shapesIn(spec, 'end').map((x: any) => x.poly);
      return Math.max(...shapesIn(spec, 'mistake').filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => x.poly.map((v: number[]) => outside(endS, v)))); };
    it('A15: the red Mistake foot clears the end figure by >= 6 px; the Mistake equal to the end is red', () => {
      console.log(`LIB-18 bodyweight_calf_raise Mistake foot clearance ${mistakeClear(b()).toFixed(1)} px`);
      expect(mistakeClear(b())).toBeGreaterThanOrEqual(6);
      expect(mistakeClear({ ...b(), mistake: { ...b().mistake, pose: { root: b().poses.end.root, plant: b().poses.end.plant } } })).toBeLessThan(6);
    });
    it('A15: one tell, key "part", anchored on the red heel; the anchor moved off the figure is red', () => {
      expect(b().mistake.tells.map((t: any) => t.key)).toEqual(['part']);
      expect(tellProblems(b())).toEqual([]);
      const off = { ...b(), mistake: { ...b().mistake, tells: b().mistake.tells.map((t: any) => ({ ...t, anchor: { ...t.anchor, off: [-40, 0] } })) } };
      expect(tellProblems(off).length).toBe(1);
    });
    const keepOff = (D: any) => D[STEP_E].polys;
    it('A15: no leader enters a figure, the start foot, a ghost or the phantom, or runs near the Trace or the step', () => {
      expect(["normal", ...leaderProblems(b(), false, keepOff)]).toEqual(["normal"]);
      expect(leaderProblems(b(), true, keepOff)).toEqual([]);
    });
    it('A15 mutations: "Heels dip" boxed onto the step\'s edge and "Knees soft" boxed left of the legs are red', () => {
      const onStep = { ...b(), callouts: b().callouts.map((c: any) => (c.key === 'dip' ? { ...c, box: { left: 210, top: 306 } } : c)) };
      expect(leaderProblems(onStep, false, keepOff).length).toBeGreaterThan(0);
      const left = { ...b(), callouts: b().callouts.map((c: any) => (c.key === 'knees' ? { ...c, box: { left: 90, top: 214 } } : c)) };
      expect(leaderProblems(left, false, keepOff).some(x => /enters the figure/.test(x))).toBe(true);
    });
    it('Q-D5-6: every cue is one sentence of 15 words or fewer, no semicolon; a 16-word cue is red', () => {
      expect(cueProblems(b())).toEqual([]);
      const long = { ...b(), callouts: b().callouts.map((c: any, i: number) => (i === 0 ? { ...c, cue: 'Rise onto the balls of both feet until your heels are as high as they go.' } : c)) };
      expect(cueProblems(long)).toEqual(['high: 16 words']);
    });
    it('callouts are the card\'s 3 checkpoints with its cues; tempo the ruled row; a 2 s Hold is red', () => {
      expect(b().callouts.map((c: any) => [c.text.replace('<br>', ' '), c.cue])).toEqual([['Heels high', 'Heels as high as possible at the top.'],
        ['Knees soft', 'Knees straight but unlocked.'], ['Heels dip', 'On a step, heels slightly below it at the bottom.']]);
      expect(b().tempo).toEqual(TEMPO);
      expect(b().tempo.map((t: any) => (t.phase === 'Hold' ? { ...t, s: 2 } : t))).not.toEqual(TEMPO);
    });
    const traceProblems = (spec: any) => [...(spec.trace.point !== 'heel.r' ? [`trace at ${spec.trace.point}`] : []), ...(JSON.stringify(spec.trace.trim) !== JSON.stringify([10, 12]) || JSON.stringify(BW.SIZES.TRACE_TRIM) !== JSON.stringify([10, 12]) ? ['trim not [10, 12]'] : [])];
    it('A17: the Trace follows the heel with trim [10, 12]; traced at the toe is red', () => {
      expect(traceProblems(b())).toEqual([]);
      expect(traceProblems({ ...b(), trace: { ...b().trace, point: 'toe.r' } })).toEqual(['trace at toe.r']);
    });
    it('report.mjs engine checks: only the S4 toe misses in the plate and the Mistake; a box moved onto the figure is red', () => {
      const want = ['check:end:toe.l:4.6cm', 'check:end:toe.r:4.6cm'];
      expect(rep(b()).issues).toEqual(want);
      expect(rep(b(), true).issues).toEqual(want);
      const onFig = { ...b(), callouts: b().callouts.map((c: any) => (c.key === 'knees' ? { ...c, box: { left: 150, top: 150 } } : c)) };
      expect(rep(onFig).issues.length).toBeGreaterThan(want.length);
    });
    it('F7: drawable false, the drawn fault named in pilot.drawableFault (bouncing is the top fault, speed only)', () => {
      expect(b().pilot.drawableFault).toMatch(/bouncing/);
      expect(b().mistake.tells[0].key).not.toBe('bounce');
    });
  });
}

{
  const LX = 'leg_extension';
  const lx = () => M[LX];
  const POSES = ['start', 'end', 'mistake'];
  const W = 1.75, CM = (s: any) => camOf(s).pxm / 100;      // px per cm
  const E = { beam: 1, post: 2, seat: 3, pad: 4, bracket: 5, upright: 6, stack: 7, pivotBr: 8, handlePost: 9, lever: 10, roller: 11, boss: 12, grip: 13 };
  const STATIC = ['beam', 'post', 'seat', 'pad', 'bracket', 'upright', 'pivotBr', 'handlePost', 'boss', 'grip'] as const;
  const cmOf = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!) * 100;
  const yzCm = (a: number[], b: number[]) => Math.hypot(a[1]! - b[1]!, a[2]! - b[2]!) * 100;
  const mean = (ps: number[][]) => [0, 1].map(i => ps.reduce((s, p) => s + p[i]!, 0) / ps.length);
  /** The item one equipment entry draws in a pose (as the engine calls it). */
  const itemAt = (spec: any, pose: string, k: number, o = {}) => itemsIn(spec, pose, o).items.find((it: any) => it.entry === k);
  /** What the vendor primitive draws for that item (plate px): [{ d, poly?, line? }]. */
  const drawnOf = (spec: any, pose: string, k: number, cam: any, o = {}) => { const it = itemAt(spec, pose, k, o); return it ? eng.PRIMITIVES[it.type](it, cam) : []; };
  const polysOf = (spec: any, pose: string, k: number, cam: any, o = {}) => drawnOf(spec, pose, k, cam, o).filter((d: any) => d.poly).map((d: any) => d.poly);
  const ptsOf = (spec: any, pose: string, k: number, cam: any, o = {}) => drawnOf(spec, pose, k, cam, o).flatMap((d: any) => xy(d.d));
  const same = (a: number[][], b: number[][]) => a.length === b.length && a.every((p, i) => Math.hypot(p[0]! - b[i]![0]!, p[1]! - b[i]![1]!) <= 1);
  /** Smallest gap (px) between two sets of closed outlines; negative when they overlap. */
  const gapOf = (A: number[][][], B: number[][][]) => Math.min(...A.flat().map(p => outside(B, p)), ...B.flat().map(p => outside(A, p)));
  /** Winter 2009 Table 4.1 centre of mass on drawn landmarks (copied from lb7-plates.test.ts:428-442). */
  const comOf = (lm: any) => {
    const L3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
    const parts: [number, number[]][] = [[0.081, lm.ear], [0.497, L3(lm.shoulders, lm.hips, 0.5)]];
    for (const s of ['l', 'r']) parts.push(
      [0.028, L3(lm[`shoulder.${s}`], lm[`elbow.${s}`], 0.436)], [0.016, L3(lm[`elbow.${s}`], lm[`wrist.${s}`], 0.430)], [0.006, lm[`grip.${s}`]],
      [0.100, L3(lm[`hip.${s}`], lm[`knee.${s}`], 0.433)], [0.0465, L3(lm[`knee.${s}`], lm[`ankle.${s}`], 0.433)], [0.0145, L3(lm[`heel.${s}`], lm[`toe.${s}`], 0.5)]);
    const m = parts.reduce((a, p) => a + p[0], 0);
    return [0, 1, 2].map(i => parts.reduce((a, p) => a + p[0] * p[1][i]!, 0) / m);
  };
  /** Landmarks of the drawn ghosts (the engine's poseAt at the ghost times). */
  const ghostLms = (spec: any) => {
    const b = { height: W }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts.count;
    return Array.from({ length: n }, (_, i) => body.landmarks(body.fk(body.poseAt(keys, (i + 1) / (n + 1), b).q, b)));
  };
  const lmsAll = (spec: any) => [...POSES.map(p => lmOf(spec, p)), ...ghostLms(spec)];
  const mutPose = (spec: any, pose: string, patch: any) => ({ ...spec, poses: { ...spec.poses, [pose]: { ...spec.poses[pose], ...patch } } });
  const moveRoot = (spec: any, pose: string, d: number[]) => { const r = spec.poses[pose].root; return mutPose(spec, pose, { root: { ...r, at: r.at.map((v: number, i: number) => v + d[i]!) } }); };
  /** An entry's item shifted by d (world m) in the poses `poses` (every point-valued field). */
  const shifted = (spec: any, k: number, d: number[], poses = POSES) => withEq(spec, k, (f: any) => (lm: any, ctx: any) => {
    const it = typeof f === 'function' ? f(lm, ctx) : f; if (!it || !poses.includes(ctx.pose)) return it;
    const mv = (p: number[]) => p.map((v, i) => v + d[i]!);
    return { ...it, ...(it.pts ? { pts: it.pts.map(mv) } : {}), ...(it.surface ? { surface: it.surface.map(mv) } : {}), ...(it.at ? { at: mv(it.at) } : {}), ...(it.base ? { base: mv(it.base) } : {}) };
  });
  // the drawn shank (front outline) of a pose, plate px
  const shankPoly = (spec: any, pose: string) => shapesIn(spec, pose).find((x: any) => x.key === 'shank.r').poly;

  describe('leg_extension: A2 legExtMachine per pose', { timeout: T }, () => {
    it('legExtMachine emits PRIMITIVES types only; the moving lever arm and roller draw a poly in every pose', () => {
      const cam = camOf(S[LX]);
      const leverOk = (s: any) => POSES.every(p => [E.lever, E.roller].every(k => { const d = drawnOf(s, p, k, cam); return d.length > 0 && d.every((x: any) => x.poly); }));
      for (const p of POSES) for (let k = 1; k <= 13; k++) { const it = itemAt(S[LX], p, k); expect(it, `entry ${k} ${p}`).toBeTruthy(); expect(eng.PRIMITIVES[it.type]).toBeTypeOf('function'); }
      expect(itemAt(S[LX], 'end', E.lever).part).toBe('lever'); expect(itemAt(S[LX], 'end', E.roller).part).toBe('lever');
      expect(leverOk(S[LX])).toBe(true);
      // mutation: the roller drawn as a `line` (the census's line lever: not drawn in the Mistake view) -> red
      const bad = withEq(S[LX], E.roller, (f: any) => (lm: any, ctx: any) => ({ type: 'line', pts: f(lm, ctx).pts, part: 'lever' }));
      expect(leverOk(bad)).toBe(false);
    });
    it('static parts stay fixed (±1 px) in start, end and Mistake; the stack keeps the end lift in the Mistake; the lever moves start -> end', () => {
      const cam = camOf(S[LX]);
      const fixed = (s: any) => STATIC.every(n => same(ptsOf(s, 'start', E[n], cam), ptsOf(s, 'end', E[n], cam)) && same(ptsOf(s, 'end', E[n], cam), ptsOf(s, 'mistake', E[n], cam, { mistake: true })));
      expect(fixed(S[LX])).toBe(true);
      expect(same(ptsOf(S[LX], 'end', E.stack, cam, { mistake: true }), ptsOf(S[LX], 'mistake', E.stack, cam, { mistake: true }))).toBe(true);
      expect(same(ptsOf(S[LX], 'start', E.stack, cam), ptsOf(S[LX], 'end', E.stack, cam))).toBe(false);
      expect(same(ptsOf(S[LX], 'start', E.roller, cam), ptsOf(S[LX], 'end', E.roller, cam))).toBe(false);
      // mutation: the seat pad 2 cm forward in the Mistake -> red
      expect(fixed(shifted(S[LX], E.seat, [0, 0, 0.02], ['mistake']))).toBe(false);
    });
    it('contacts on drawn items (±1 cm): seat on the seat pad top; upper back and buttock on the back pad face (start, end); grips on the handle', () => {
      const cam = camOf(S[LX]), cm = CM(S[LX]);
      const seatOk = (s: any) => POSES.every(p => { const top = Math.min(...polysOf(s, p, E.seat, cam).flat().map((q: number[]) => q[1]!)); return Math.abs(cam.P(lmOf(s, p).seat)[1]! - top) <= cm; });
      const padOk = (s: any) => ['start', 'end'].every(p => ['backUpper', 'buttock'].every(k => Math.abs(outside(polysOf(s, p, E.pad, cam), cam.P(lmOf(s, p)[k]))) <= cm));
      const gripOk = (s: any) => POSES.every(p => { const g = mean(polysOf(s, p, E.grip, cam)[0]), q = cam.P(lmOf(s, p)['grip.r']); return Math.hypot(g[0]! - q[0]!, g[1]! - q[1]!) <= cm; });
      expect(seatOk(S[LX])).toBe(true); expect(padOk(S[LX])).toBe(true); expect(gripOk(S[LX])).toBe(true);
      // mutations: the start body 3 cm lower (into the seat); the back pad 3 cm back; the end hands 3 cm off the grip -> red
      expect(seatOk(moveRoot(S[LX], 'start', [0, -0.03, 0]))).toBe(false);
      expect(padOk(shifted(S[LX], E.pad, [0, 0, -0.03]))).toBe(false);
      const r = S[LX].poses.end.reach;
      expect(gripOk(mutPose(S[LX], 'end', { reach: { ...r, r: { ...r.r, at: [r.r.at[0], r.r.at[1], r.r.at[2] + 0.03] } } }))).toBe(false);
    });
    it('the roller rests on the drawn shin (gap within ±1 cm) just above the ankle (contact 5-11 cm up the shank, c2) in start and end', () => {
      const cam = camOf(S[LX]), cm = CM(S[LX]);
      const ok = (s: any) => ['start', 'end'].every(p => {
        const roll = polysOf(s, p, E.roller, cam), sh = shankPoly(s, p), lm = lmOf(s, p);
        if (Math.abs(gapOf(roll, [sh])) > cm) return false;
        const c = mean(roll[0]), k = cam.P(lm['knee.r']), a = cam.P(lm['ankle.r']), u = [a[0]! - k[0]!, a[1]! - k[1]!], L = Math.hypot(u[0]!, u[1]!);
        const up = (L - ((c[0]! - k[0]!) * u[0]! + (c[1]! - k[1]!) * u[1]!) / L) / cam.pxm;     // the roller's foot on the shank axis, metres above the ankle
        return up >= 0.05 && up <= 0.11;
      });
      expect(ok(S[LX])).toBe(true);
      expect(ok(shifted(S[LX], E.roller, [0, 0.03, 0], ['end']))).toBe(false);   // mutation: the end roller 3 cm off the shin -> red
    });
    it('the knees sit at the pivot boss (c1): knee joint within 1 cm of the drawn boss centre at the start and the end', () => {
      const ok = (s: any) => ['start', 'end'].every(p => yzCm(itemAt(s, p, E.boss).at, lmOf(s, p)['knee.r']) <= 1);
      expect(ok(S[LX])).toBe(true);
      expect(ok(shifted(S[LX], E.boss, [0, 0, 0.03]))).toBe(false);          // mutation: the boss 3 cm forward -> red
    });
  });

  describe('leg_extension: A18 physics on drawn items', { timeout: T }, () => {
    it('every heel, ball and toe is above the floor in every pose and ghost; the floor beam and the stack stand on the floor', async () => {
      const cam = camOf(S[LX]), floorY = cam.P([0, 0, 0])[1]!;
      const feet = (s: any) => lmsAll(s).every(lm => ['heel', 'ball', 'toe'].every(k => ['l', 'r'].every(sd => lm[`${k}.${sd}`][1] >= 0)));
      expect(feet(S[LX])).toBe(true);
      expect(Math.abs(Math.max(...polysOf(S[LX], 'end', E.beam, cam).flat().map((q: number[]) => q[1]!)) - floorY)).toBeLessThanOrEqual(1);
      expect(itemAt(S[LX], 'end', E.stack).base[1]).toBeGreaterThanOrEqual(0);
      await tick();
      // mutation: the start body lowered until the heel is 1 px below the floor -> red
      const lowest = Math.min(...['heel.r', 'sole.r', 'toe.r'].map(k => lmOf(S[LX], 'start')[k][1]));
      expect(feet(moveRoot(S[LX], 'start', [0, -lowest - 1 / cam.pxm, 0]))).toBe(false);
    });
    it('no body point is more than 1 cm inside the seat pad, the back pad or the roller in any pose or ghost', async () => {
      const cam = camOf(S[LX]), cm = CM(S[LX]);
      const ok = (s: any) => {
        const seat = polysOf(s, 'end', E.seat, cam), pad = polysOf(s, 'end', E.pad, cam);
        const bodyOk = lmsAll(s).every(lm => ['seat', 'buttock', 'thighUnder.l', 'thighUnder.r', 'backUpper', 'backMid', 'sacrum'].every(k => outside(seat, cam.P(lm[k])) >= -cm && outside(pad, cam.P(lm[k])) >= -cm));
        return bodyOk && POSES.every(p => gapOf(polysOf(s, p, E.roller, cam), [shankPoly(s, p)]) >= -cm);
      };
      expect(ok(S[LX])).toBe(true);
      await tick();
      expect(ok(shifted(S[LX], E.pad, [0, 0, 0.03]))).toBe(false);           // mutation: the back pad 3 cm into the back -> red
    });
    it('every pad, seat and lever joins the frame (drawn outlines touch, D-LIB18-FRAME)', () => {
      const cam = camOf(S[LX]);
      const P = (s: any, n: keyof typeof E) => polysOf(s, 'end', E[n], cam);
      const pairs: [keyof typeof E, keyof typeof E][] = [['seat', 'post'], ['post', 'beam'], ['pad', 'bracket'], ['bracket', 'upright'], ['upright', 'beam'], ['pivotBr', 'boss'],
        ['pivotBr', 'seat'], ['lever', 'boss'], ['lever', 'roller'], ['handlePost', 'seat'], ['handlePost', 'grip'], ['stack', 'beam']];
      const ok = (s: any) => pairs.every(([a, b]) => { const A = P(s, a), B = P(s, b); return A.length > 0 && B.length > 0 && gapOf(A, B) <= 1; });
      expect(ok(S[LX])).toBe(true);
      expect(ok(withEq(S[LX], E.pivotBr, () => () => null))).toBe(false);   // mutation: the pivot bracket removed -> red
    });
    it('the centre of mass lies over the seat in every drawn pose (D-LIB18-BALANCE: within the seat and back pad contacts, c1, c4): between the back pad face and the seat front edge', async () => {
      const cam = camOf(S[LX]);
      const ok = (s: any) => {
        const padFace = Math.max(...polysOf(s, 'end', E.pad, cam).flat().filter((q: number[]) => q[1]! > cam.P([0, 0.6, 0])[1]!).map((q: number[]) => q[0]!));   // the pad's face at seat level
        const front = Math.max(...polysOf(s, 'end', E.seat, cam).flat().map((q: number[]) => q[0]!));
        return lmsAll(s).every(lm => { const x = cam.P(comOf(lm))[0]!; return x > padFace && x < front; });
      };
      expect(ok(S[LX])).toBe(true);
      await tick();
      expect(ok(moveRoot(S[LX], 'end', [0, 0, 0.30]))).toBe(false);          // mutation (A18): the end body 30 cm forward -> red
    });
  });

  describe('leg_extension: card facts and sized numbers on the drawn body', { timeout: T }, () => {
    it('knees 90 at the start (c3): engine angles and the drawn hip-knee-ankle angle within ±2°', () => {
      const ok = (s: any) => ['l', 'r'].every(sd => Math.abs(rep(s).angles.start[`knee.${sd}`] - 90) <= 2 && Math.abs(angle3(lmOf(s, 'start')[`hip.${sd}`], lmOf(s, 'start')[`knee.${sd}`], lmOf(s, 'start')[`ankle.${sd}`]) - 90) <= 2);
      expect(ok(S[LX])).toBe(true);
      expect(ok(mutPose(S[LX], 'start', { knee: 93 }))).toBe(false);         // mutation: 93 -> red
    });
    it('knees straight but not locked at the end (c7, c8): the knee off the hip-ankle line by >= 90 % of the KNEE_END offset, in the sagittal plane', () => {
      const k0 = lx().SIZES.KNEE_END, a = 0.245 * W, b = 0.246 * W, Lc = Math.sqrt(a * a + b * b + 2 * a * b * Math.cos(k0 * Math.PI / 180));
      const off0 = a * b * Math.sin(k0 * Math.PI / 180) / Lc;
      const off = (lm: any) => segD([lm['knee.r'][2], lm['knee.r'][1]], [lm['hip.r'][2], lm['hip.r'][1]], [lm['ankle.r'][2], lm['ankle.r'][1]]);
      for (const p of ['end', 'mistake']) { const lm = lmOf(S[LX], p); expect(off(lm)).toBeGreaterThanOrEqual(0.9 * off0); expect(Math.abs(lm['knee.r'][0] - lm['hip.r'][0])).toBeLessThan(0.005); }
      expect(off(lmOf(mutPose(S[LX], 'end', { knee: 0 }), 'end'))).toBeLessThan(0.9 * off0);   // mutation: knee 0 -> red
    });
    it('the shins end about level (c7 "parallel with the ground"): knee-to-ankle within 5° of level at the end', () => {
      const tilt = (lm: any) => Math.abs(Math.atan2(lm['ankle.r'][1] - lm['knee.r'][1], lm['ankle.r'][2] - lm['knee.r'][2]) * 180 / Math.PI);
      expect(tilt(lmOf(S[LX], 'end'))).toBeLessThanOrEqual(5);
      expect(tilt(lmOf(mutPose(S[LX], 'end', { knee: 12 }), 'end'))).toBeGreaterThan(5);   // mutation: knee 12 -> red
    });
    it('every card plateFact is met: each contact has a report check on its landmark and pose within 1 cm; each angle within ±2°', () => {
      const card = JSON.parse(readFileSync('docs/research/howto/cards/leg_extension.json', 'utf8'));
      const ok = (s: any) => { const r = rep(s); return card.plateFacts.every((f: any) => f.kind === 'angle' ? Math.abs(r.angles[f.pose][f.joint] - f.deg) <= 2
        : (() => { const h = r.checks.filter((c: any) => c.landmark === f.landmark && c.pose === f.pose && c.cm != null); return h.length > 0 && h.every((c: any) => c.cm <= 1); })()); };
      expect(card.plateFacts).toHaveLength(11);
      expect(ok(S[LX])).toBe(true);
      expect(ok({ ...S[LX], checks: S[LX].checks.filter((c: any) => !c.landmark.startsWith('ankle')) })).toBe(false);   // mutation: the roller contact checks dropped -> red
    });
    it('the Mistake is drawn at its size (M_ARCH 12, hanging_leg_raise.mjs:69): the back leaves the drawn pad by >= 4 cm, the seat stays on the seat pad, the thighs stay level', () => {
      const cam = camOf(S[LX]), cm = CM(S[LX]);
      const ok = (s: any) => { const lm = lmOf(s, 'mistake'), pad = polysOf(s, 'mistake', E.pad, cam, { mistake: true }), top = Math.min(...polysOf(s, 'mistake', E.seat, cam, { mistake: true }).flat().map((q: number[]) => q[1]!));
        const th = Math.atan2(lm['knee.r'][1] - lm['hip.r'][1], lm['knee.r'][2] - lm['hip.r'][2]) * 180 / Math.PI;
        return outside(pad, cam.P(lm.backUpper)) >= 4 * cm && Math.abs(cam.P(lm.seat)[1]! - top) <= cm && Math.abs(th) <= 1; };
      const a = rep(S[LX]).angles.mistake;
      expect(a.trunk).toBe(-lx().SIZES.M_ARCH); expect(a.tilt).toBe(lx().SIZES.TILT + lx().SIZES.M_ARCH);
      expect(ok(S[LX])).toBe(true);
      const e = S[LX].poses.end;                                              // mutation: no arch (the end torso) -> red
      expect(ok({ ...S[LX], mistake: { ...S[LX].mistake, pose: { root: e.root, trunk: 0, hip: e.hip } } })).toBe(false);
    });
    it('every unsourced number is in SIZES; the Trace is the ankle (D-LIB18-TRACE, c7) at the clone source trim (leg_press.mjs:132)', () => {
      expect(Object.keys(lx().SIZES).sort()).toEqual(['BRACKET_AT', 'CAM_R', 'FLOOR_BACK', 'FLOOR_FRONT', 'FOOT_CLEAR', 'HANDLE', 'KNEE_END', 'M_ARCH', 'PAD_BELOW', 'PAD_LEN',
        'ROLL_UP', 'SEAT_BACK', 'SEAT_GAP', 'STACK_GAP', 'TILT', 'TOWER_GAP', 'TRACE_TRIM']);
      expect(S[LX].trace).toEqual({ point: 'ankle.r', trim: [6, 8] });
    });
    it('tempo strip = lb8/tempo.json row + card plate.tempo (Extend 2, Hold 1, Lower 2); no bottom pause phase', () => {
      const card = JSON.parse(readFileSync('docs/research/howto/cards/leg_extension.json', 'utf8'));
      const ok = (s: any) => JSON.stringify(s.tempo) === JSON.stringify(card.tempo);
      expect(S[LX].tempo).toEqual([{ phase: 'Extend', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]);
      expect(ok(S[LX])).toBe(true);
      expect(ok({ ...S[LX], tempo: [...S[LX].tempo, { phase: 'Pause', s: 1 }] })).toBe(false);   // mutation (A7): Motra's 1 s bottom pause added -> red
    });
  });

  describe('leg_extension: A15 drawing lessons', { timeout: T }, () => {
    it('the red Mistake trunk and head clear the solid end figure by >= 6 px where drawn outside it', () => {
      const clear = (s: any) => { const endP = shapesIn(s, 'end').map((x: any) => x.poly), mP = shapesIn(s, 'mistake').filter((x: any) => ['torso', 'head'].includes(x.key)).flatMap((x: any) => x.poly);
        const o = mP.map((q: number[]) => outside(endP, q)).filter((d: number) => d > 0); return o.length > 0 && Math.max(...o) >= 6; };
      expect(S[LX].mistake.parts).toEqual(['torso', 'head']);
      expect(clear(S[LX])).toBe(true);
      const m = S[LX].mistake.pose, k = 4;                                     // mutation: a 4° arch (the red trunk inside the clearance) -> red
      const e = S[LX].poses.end, small = { ...m, root: { at: body.rootOnSeat([0, lx().LX.SEAT_TOP, 0], e.root.tilt + k, W), tilt: e.root.tilt + k }, trunk: -k, hip: { flex: e.hip.flex + k } };
      expect(clear({ ...S[LX], mistake: { ...S[LX].mistake, pose: small } })).toBe(false);
    });
    it('the faulty back contour is a red dashed guide, and each tell anchor sits on it (within 1 px) on the part its label names', () => {
      const cam = camOf(S[LX]), lm = lmOf(S[LX], 'mistake'), g = S[LX].mistake.guides[0];
      expect(g.kind).toBe('dashed');
      const path = g.pts.map((p: any) => cam.P(lm[p.at]));
      const onIt = (t: any) => { const a = cam.P(lmOf(S[LX], 'mistake')[t.anchor.at]); return Math.min(...path.slice(1).map((q: number[], i: number) => segD(a, path[i]!, q))) <= 1; };
      expect(S[LX].mistake.tells.map((t: any) => [t.key, t.anchor.at])).toEqual([['arch', 'sacrum'], ['off', 'backUpper']]);   // c6 lower back; the pad contact (D-LIB18-BACKPAD)
      expect(S[LX].mistake.tells.every(onIt)).toBe(true);
      expect(onIt({ anchor: { at: 'navel' } })).toBe(false);                  // mutation: an anchor on the navel -> red
    });
    it('the first tell carries the card topFault key (arch); a second tell names the c6 sign (off)', () => {
      const card = JSON.parse(readFileSync('docs/research/howto/cards/leg_extension.json', 'utf8'));
      expect(S[LX].mistake.tells[0].key).toBe(card.topFault);
      const swapped = [...S[LX].mistake.tells].reverse();                      // mutation: the tells swapped -> red
      expect(swapped[0].key).not.toBe(card.topFault);
    });
    it('the start lever and roller (dropped by the start layer) are redrawn as dashed phantoms in the end layer only', () => {
      const ph = (s: any, p: string) => itemsIn(s, p).items.filter((it: any) => it.part === 'startLever');
      expect(ph(S[LX], 'end')).toHaveLength(3);
      expect(ph(S[LX], 'end').every((it: any) => it.type === 'line' && it.cls === 'eq-line m-line')).toBe(true);
      expect(ph(S[LX], 'start')).toHaveLength(0);
      expect(ph(withEq(withEq(withEq(S[LX], 14, () => () => null), 15, () => () => null), 16, () => () => null), 'end')).toHaveLength(0);   // mutation: removed -> red
    });
    it('leaders: bends outside the figure; none within 6 px of the Trace or any machine part but the back pad, which a leader crosses at most once (D-LIB18-BACKPAD nit); Mistake leaders enter the end figure once, from the front, <= 81.9 px', async () => {
      const cam = camOf(S[LX]);
      const check = (s: any) => {
        for (const mistake of [false, true]) {
          const R = plate.renderPlate(s, { id: 'x', mistake }), L = leadersOf(R.svg);
          const fig = shapesIn(s, mistake ? 'mistake' : 'end').map((x: any) => x.poly), endFig = shapesIn(s, 'end').map((x: any) => x.poly);
          const trace = [...R.svg.matchAll(/<path class="trace"[^>]* d="([^"]+)"/g)].flatMap(([, d]) => xy(d!));
          const eqP = [E.beam, E.post, E.seat, E.bracket, E.upright, E.stack, E.pivotBr, E.handlePost, E.lever, E.roller, E.boss, E.grip].flatMap(k => polysOf(s, 'end', k, cam, { mistake }));
          const padP = polysOf(s, 'end', E.pad, cam, { mistake });
          for (const ld of L) {
            for (const q of ld.slice(1, -1)) if (outside(fig, q) <= 0) return false;
            const samples = ld.slice(1).flatMap((q: number[], i: number) => Array.from({ length: 20 }, (_, k) => [ld[i]![0]! + (q[0]! - ld[i]![0]!) * k / 20, ld[i]![1]! + (q[1]! - ld[i]![1]!) * k / 20]))
              .filter((p: number[]) => Math.hypot(p[0]! - ld[0]![0]!, p[1]! - ld[0]![1]!) > 8);
            if (samples.some((p: number[]) => trace.some((t: number[]) => Math.hypot(p[0]! - t[0]!, p[1]! - t[1]!) < 6) || outside(eqP, p) < 6)) return false;
            const inPad = samples.map((p: number[]) => outside(padP, p) <= 0);
            if (inPad.filter((v: boolean, i: number) => v && (i === 0 || !inPad[i - 1])).length > 1) return false;
            if (mistake) {
              const len = ld.slice(1).reduce((a: number, q: number[], i: number) => a + Math.hypot(q[0]! - ld[i]![0]!, q[1]! - ld[i]![1]!), 0);
              const ins = samples.map((p: number[]) => outside(endFig, p) <= 0), entries = ins.filter((v: boolean, i: number) => v && (i === 0 || !ins[i - 1])).length;
              if (len > 81.9 || entries > 1 || ld[ld.length - 1]![0]! < ld[0]![0]!) return false;   // the box lies in front (screen right) of the anchor
            }
          }
        }
        return true;
      };
      expect(check(S[LX])).toBe(true);
      await tick();
      // mutation: the 'Knees unlocked' box moved below the legs, so its leader runs through the ghosts and the Trace -> red
      expect(check({ ...S[LX], callouts: S[LX].callouts.map((c: any) => (c.key === 'soft' ? { ...c, box: { left: 250, top: 330 } } : c)) })).toBe(false);
    });
    it('cues: one sentence each, 15 words or fewer, no semicolon', () => {
      const ok = (c: any) => c.cue.split(/\s+/).length <= 15 && !/;/.test(c.cue) && (c.cue.match(/[.?!]/g) ?? []).length === 1;
      expect([...S[LX].callouts, ...S[LX].mistake.tells].every(ok)).toBe(true);
      expect(ok({ cue: 'Back pressed into the pad. Don\'t arch.' })).toBe(false);   // mutation: the card's two-sentence `what` -> red
    });
    it('report.mjs engine checks: no issue in the normal and the Mistake render', () => {
      expect(rep(S[LX]).issues).toEqual([]); expect(plate.renderPlate(S[LX], { id: 'm', mistake: true }).report.issues).toEqual([]);
      const moved = { ...S[LX], callouts: S[LX].callouts.map((c: any) => (c.key === 'pivot' ? { ...c, box: { left: 150, top: 230 } } : c)) };   // mutation: a box on the figure -> red
      expect(rep(moved).issues.length).toBeGreaterThan(0);
    });
  });
}
