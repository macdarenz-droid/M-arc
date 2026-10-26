// LIB-17 (lib-17-card Do 2, Do 4, Do 5, Do 6 a; acceptance A2, A3, A4, A5, A7, A9, A10, A11, A15, A16, A17; rulings
// D-LIB17-*): the LB7 H build-ahead plates. Node only: the browser half of the plate QA runs in
// tools/plates/library/lb7/qa.mjs. Patterns copied from tests/howto/lb3-plates.test.ts (#274 @ a6f4bd07) and
// tests/howto/lb6-plates.test.ts (#297). Every test reads what is drawn (the items a spec emits, the engine's landmarks,
// shapes and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';
import { otherCards } from './eq-composers';

// Most tests here render plates synchronously, and vitest runs back-to-back synchronous tests without returning to the
// event loop, so the worker could not answer its RPC for 40 s locally (over vitest's 60 s limit on CI: the source-gate's
// "Timeout calling onTaskUpdate"). One macrotask after every test lets the worker reply.
afterEach(() => new Promise<void>(r => setImmediate(r)));

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB7 = ['cable_lateral_raise', 'dumbbell_front_raise', 'cable_rear_delt_fly', 'face_pull', 'cable_external_rotation', 'resistance_band_pull_apart',
  'renegade_row', 'weighted_dip', 'bench_dip'];
const IDS = LB7.map(i => `lib_${i}`);
// The 5 LB7 ids not in this card (lib-17-card "LB7 ids").
const NOT_HERE = ['push_up', 'incline_push_up', 'pike_push_up', 'diamond_push_up', 'bent_over_dumbbell_rear_delt_fly'];
// D-LIB17-SECS: no tempo seconds on these two cards; drawn, never on rows.json until released.
const NOSECS = ['cable_rear_delt_fly', 'renegade_row'];
// DESIGN.md section 14: every held id (the two no-seconds ids; renegade_row also under D-LIB8-shrug; resistance_band_pull_apart
// and bench_dip under D-LIB8-shrug, D-LIB17-SIZE).
const HELD = ['cable_rear_delt_fly', 'renegade_row', 'resistance_band_pull_apart', 'bench_dip'];
const FRONT = ['cable_lateral_raise', 'cable_rear_delt_fly', 'cable_external_rotation', 'resistance_band_pull_apart'];
const ROWS = 'tools/plates/library/lb7/rows.json';
const RESEARCH_HEAD = 'e5ed66ca1c7c7c2f6418001d262d053431b4c67f';
const COMPOSERS = ['dipBars'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, dipEq: any, markup: any;
const M: Record<string, any> = {}, S: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, dipEq, markup] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'eq/dipBars.mjs', 'qa/markup.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of LB7.filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`))) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
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
/** The ids whose spec exists and that are not held, in LB7 order (the rows.json set, A5). */
const drawn = () => LB7.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`) && !HELD.includes(id));
const specsDrawn = () => LB7.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`));
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
const angle3 = (a: number[], v: number[], b: number[]) => { const u = a.map((x, i) => x - v[i]!), w = b.map((x, i) => x - v[i]!); return Math.acos(Math.max(-1, Math.min(1, u.reduce((s, x, i) => s + x * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)))) * 180 / Math.PI; };
const withEq = (spec: any, k: number, f: (e: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any, i: number) => (i === k ? f(e) : e)) });

describe('LIB-17 A5: lb7/rows.json holds exactly the drawn, non-held LB7 H ids with tempo seconds, all mode H', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn, non-held id with seconds exactly once in the raw text, nothing else, every mode H (D-LIB17-B1)', () => {
    expect(want()).toEqual(['lib_cable_lateral_raise', 'lib_dumbbell_front_raise', 'lib_face_pull', 'lib_cable_external_rotation', 'lib_weighted_dip']);
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('none of the 5 LB7 ids not in this card is in any lb7/ file as a row', () => {
    for (const f of readdirSync('tools/plates/library/lb7').filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join('tools/plates/library/lb7', f), 'utf8');
      for (const id of NOT_HERE) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id}`).toBe(false);
    }
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file; the no-seconds ids are held', () => {
    const design = readFileSync('tools/plates/library/lb7/DESIGN.md', 'utf8');
    expect(design).toContain('## 14. Held ids');
    const table = design.split('## 14. Held ids')[1]!.split('\n## ')[0]!;
    for (const id of NOSECS) expect(HELD, id).toContain(id);
    for (const id of HELD) {
      expect(table.split('\n').some(l => l.startsWith(`| ${id} |`) && /D-LIB17-SECS|D-LIB8-shrug/.test(l)), id).toBe(true);
      for (const f of reg.batchFiles()) expect(readFileSync(f, 'utf8').includes(`lib_${id}`), `${f}: ${id}`).toBe(false);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
    }
    expect(table.split('\n').some(l => l.startsWith('| renegade_row |') && /D-LIB8-shrug/.test(l))).toBe(true);
  });
  it('mutations: a dropped row, a duplicated row, a held id, renegade_row, push_up and bent_over_dumbbell_rear_delt_fly added, and one mode set to D are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const w = want(), j = { batch: 'LB7', rows: Object.fromEntries(w.map(id => [id, row])) };
    const text = JSON.stringify(j, null, 1), add = (id: string) => JSON.stringify({ ...j, rows: { ...j.rows, [id]: row } }, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: Object.fromEntries(w.slice(1).map(id => [id, row])) }, null, 1), w)).toEqual([`${w[0]} x0`]);
    const dup = text.replace(`  "${w[0]}": {`, `  "${w[0]}": ${JSON.stringify(row)},\n  "${w[0]}": {`);
    expect(a5(dup, w)).toEqual([`${w[0]} x2`]);
    expect(a5(add('lib_cable_rear_delt_fly'), w), 'a held id').toEqual(['extra lib_cable_rear_delt_fly']);
    expect(a5(add('lib_renegade_row'), w)).toEqual(['extra lib_renegade_row']);
    expect(a5(add('lib_push_up'), w)).toEqual(['extra lib_push_up']);
    expect(a5(add('lib_bent_over_dumbbell_rear_delt_fly'), w)).toEqual(['extra lib_bent_over_dumbbell_rear_delt_fly']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, [w[0]!]: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['mode D']);
  });
  it('every row points at its own spec file and carries the census view; batch LB7, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view, id).toBe(FRONT.includes(id.slice(4)) ? 'front' : 'side');
      expect(readJson(`docs/research/howto/cards/${id.slice(4)}.json`).plate.view, id).toBe(r.view);
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB7', censusRef: '4a9fd86' });
  });
  it('the build\'s held list is this test\'s (D-LIB17-SECS), each with its census view', async () => {
    const build = await import(/* @vite-ignore */ lib('lb7/build.mjs'));
    expect(build.HELD).toEqual({ cable_rear_delt_fly: 'front', renegade_row: 'side', resistance_band_pull_apart: 'front', bench_dip: 'side' });
  });
});

describe('LIB-17 A9: nothing ships (D-LIB17-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/weighted_dip.mjs', slug: 'weighted-dip', prefix: 'weighted-dip', chromeId: 'weighted-dip', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB7 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_weighted_dip: { ...someRow, stage: 'shipped' } })).toEqual(['lib_weighted_dip: shipped']);
    expect(stageProblems({ ...rows, lib_weighted_dip: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_weighted_dip: approved-plate']);
  });
  it('none of the 9 is shipped, even with lb7/rows.json read as a batch file', () => {
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
    ...(/lb7/i.test(f) ? [`${f}: an LB7 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB7"/.test(text) ? [`${f}: names batch LB7`] : []),
    ...hits(LB7, f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB7 H id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB7 H id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB7 H id, a page-only lb7.json and face-pull.layers.html are red', () => {
    expect(batchProblems([['zz.json', readFileSync(ROWS, 'utf8')]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_renegade_row"}']])).toEqual(['x.json: renegade_row']);
    expect(batchProblems([['lb7.json', '{"entries":[{"kind":"page","batch":"LB7"}]}']]).length).toBe(2);
    expect(batchProblems([['face-pull.layers.html', '<div data-id="face-pull"></div>']])).toEqual(['face-pull.layers.html: face-pull']);
  });
  it('the matcher is exact: it matches neither lib_bench_dip_v2 nor incline-bench-dip; mutation: a plain substring test is red on the _v2 control', () => {
    expect(tokenHits(LB7, 'p.json', '{"rows":{"lib_bench_dip_v2":{}}}')).toEqual([]);
    expect(tokenHits(LB7, 'p.json', '{"slug":"incline-bench-dip"}')).toEqual([]);
    expect(batchProblems([['p.json', '{"rows":{"lib_bench_dip_v2":{}}}']], substringHits)).toEqual(['p.json: bench_dip']);
  });
  it('control: a file naming only lib_push_up, lib_incline_push_up and lib_bent_over_dumbbell_rear_delt_fly (LB7, not in this card) stays green', () => {
    expect(tokenHits(LB7, 'p.json', '{"rows":{"lib_push_up":{},"lib_incline_push_up":{},"lib_bent_over_dumbbell_rear_delt_fly":{}}}')).toEqual([]);
    expect(tokenHits(LB7, 'p.json', '{"rows":{"lib_face_pull":{}}}')).toEqual(['p.json: face_pull']);
  });
  it('over src/data/exercises.json, no real id other than its own contains one of the 9 as a substring', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    expect(ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))))).toEqual([]);
    for (const id of IDS) expect(ex, id).toContain(id);
  });
  it('no LB7 spec, composer, How-to, script or test imports anything under hands/, fidelity/, ci/ or tests/howto/fixtures/', () => {
    const files = [...specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`), ...COMPOSERS.map(c => `tools/plates/library/eq/${c}.mjs`).filter(f => existsSync(f)),
      ...LB7.map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb7/build.mjs', 'tools/plates/library/lb7/qa.mjs', 'tests/howto/lb7-plates.test.ts'];
    const bad = (f: string) => [...readFileSync(f, 'utf8').matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map(m => join(f, '..', m[1]!)).filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\/|^tests\/howto\/fixtures\//.test(p));
    for (const f of files) expect(bad(f), f).toEqual([]);
  });
  it('generate --check is green, and no generated file is read from lb7/, the LB7 specs, dipBars or How-to sources', async () => {
    // In a child process, awaited (VITEST-RPC ruling A, #276): an in-process render blocks the worker past vitest's 60 s
    // RPC limit on a loaded runner. The child prints the diff and, per output, whether it names an LB7 path.
    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});
const ids = ${JSON.stringify(LB7)}, out = await gen.render(), bad = [];
for (const [p, { text }] of out) { if (/library\\/lb7\\/|eq\\/dipBars\\.mjs/.test(text)) bad.push(p + ': lb7/ or dipBars');
  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\b').test(text)) bad.push(p + ': ' + id); }
console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;
    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    const r = JSON.parse(stdout.trim().split('\n').pop()!);
    console.log(`LIB-17 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);
    expect(r.n).toBeGreaterThan(0);
    expect(r.diff).toEqual([]);
    expect(r.bad).toEqual([]);
  });
});

describe('LIB-17 A11 (Do 6 a): the 9 cards and quotes are byte copies of the LB7 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb7/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 9 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB7);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB7);
    for (const id of LB7) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('weighted_dip'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.weighted_dip);
  });
  it('the How-to source of each LB7 H id holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of LB7) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
  it('research/validate.mjs validateCardFile: no problem on the 7 cards with seconds, exactly the :216 problem on the two no-seconds cards (D-LIB17-SECS)', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    for (const id of LB7) expect(v.validateCardFile(`${id}.json`), id).toEqual(NOSECS.includes(id) ? [`cards/${id}.json: plateFacts and tempo go in together or not at all`] : []);
  });
  it('A11 mutations: one fact\'s claim id removed, and a tempo key added to renegade_row\'s card, are red in validateCardFile', async () => {
    const v = await import(/* @vite-ignore */ lib('research/validate.mjs'));
    const dir = mkdtempSync(join(tmpdir(), 'lb7-val-'));
    try {
      for (const d of ['cards', 'quotes']) cpSync(`docs/research/howto/${d}`, join(dir, 'docs/research/howto', d), { recursive: true });
      const w = (id: string, f: (c: any) => void) => { const p = join(dir, 'docs/research/howto/cards', `${id}.json`), c = JSON.parse(readFileSync(p, 'utf8')); f(c); writeFileSync(p, JSON.stringify(c, null, 2)); };
      w('weighted_dip', c => { delete c.plateFacts[0].claim; });
      w('renegade_row', c => { c.tempo = [{ phase: 'Row', s: 1, move: true }]; });
      expect(v.validateCardFile('weighted_dip.json', dir).length).toBeGreaterThan(0);
      expect(v.validateCardFile('renegade_row.json', dir)).not.toContain('cards/renegade_row.json: plateFacts and tempo go in together or not at all');
    } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-17 A2 / Do 4: dipBars and the drawn plates draw PRIMITIVES only', { timeout: T }, () => {
  it('the composer source imports no file reader and nothing under tools/plates/layers/', () => {
    for (const c of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${c}.mjs`, 'utf8');
      expect(src, c).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, c).not.toMatch(/layers\//);
    }
  });
  it('every item the drawn specs draw is a PRIMITIVES type, in every drawn pose', () => {
    expect(specsDrawn()).toEqual(['cable_lateral_raise', 'dumbbell_front_raise', 'cable_rear_delt_fly', 'face_pull', 'cable_external_rotation', 'resistance_band_pull_apart', 'renegade_row', 'weighted_dip', 'bench_dip']);
    for (const id of specsDrawn()) for (const pose of posesOf(S[id]))
      for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
  });
  it('the drawn specs pass PQ-H9', () => {
    for (const id of specsDrawn()) expect(h9(S[id]), id).toEqual([]);
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.weighted_dip;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the drawn specs with no engine issue and every check and contact within 0.5 cm', () => {
    for (const id of specsDrawn()) {
      for (const mistake of [false, true]) expect(plate.renderPlate(S[id], { id: 'x', mistake }).report.issues ?? [], `${id} ${mistake}`).toEqual([]);
      const r = rep(S[id]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
      for (const c of r.checks) if ('aboveCm' in c) expect(c.aboveCm, `${id} ${c.landmark} ${c.pose}`).toBeGreaterThanOrEqual(0);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-17 A2: dipBars on weighted_dip, per drawn pose (13.1)', { timeout: T }, () => {
  const D = () => M.weighted_dip.WD;
  /** Each item's drawn outline in a pose, by key (entry.type.index), as the engine keys them. */
  const drawnByKey = (spec: any, pose: string) => {
    const cam = camOf(spec), out = new Map<string, { part: string | null, type: string, d: string, poly?: number[][], cls: string }>();
    for (const it of itemsIn(spec, pose).items) eng.PRIMITIVES[it.type](it, cam).forEach((p: any, j: number) => out.set(`eq${it.entry}.${it.type}.${j}`, { part: it.part ?? null, type: it.type, d: p.d, poly: p.poly, cls: p.cls }));
    return out;
  };
  const STATIC = ['bar', 'frame'], MOVING = ['belt', 'chain', 'plate'];
  /** A2: the station's parts sit at one place (+-1 px) in every drawn pose; the load's parts move between the end and the
   *  Mistake and carry a poly, so the engine draws them in the Mistake view (plate.mjs:213). */
  const stationProblems = (spec: any) => {
    const out: string[] = [], poses = posesOf(spec).map(p => [p, drawnByKey(spec, p)] as const), end = poses.find(([p]) => p === 'end')![1];
    for (const [k, v] of end) {
      if (STATIC.includes(v.part!)) for (const [p, m] of poses) {
        const w = m.get(k);
        if (!w || !v.poly || !w.poly) { out.push(`${k}: missing in ${p}`); continue; }
        const dmax = Math.max(...v.poly.map((q, i) => Math.hypot(q[0]! - w.poly![i]![0]!, q[1]! - w.poly![i]![1]!)));
        if (dmax > 1) out.push(`${k} (${v.part}) moved ${dmax.toFixed(1)} px in ${p}`);
      }
    }
    const mis = poses.find(([p]) => p === 'mistake')![1];
    for (const part of MOVING) {
      const ks = [...end].filter(([, v]) => v.part === part).map(([k]) => k);
      if (!ks.length) out.push(`${part}: not drawn`);
      for (const k of ks) {
        if (mis.get(k)?.d === end.get(k)!.d) out.push(`${part}: does not move end -> Mistake`);
        if (!mis.get(k)?.poly) out.push(`${part}: no poly in the Mistake (not drawn there)`);
      }
    }
    return out;
  };
  /** The Mistake view draws each moving load part: its outline is in the Mistake svg's m-pose defs (matched point by
   *  point within 0.6 px: the report's camera is rounded to 0.01 px/m). */
  const inMistakeView = (spec: any) => {
    const svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg, defs = [...svg.matchAll(/<path id="x-m-eq\d+" d="([^"]+)"\/>/g)].map(m => xy(m[1]!));
    const mis = drawnByKey(spec, 'mistake'), same = (a: number[][], b: number[][]) => a.length === b.length && a.every((p, i) => Math.hypot(p[0]! - b[i]![0]!, p[1]! - b[i]![1]!) <= 0.6);
    return MOVING.map(part => [part, [...mis.values()].filter(v => v.part === part).every(v => !!v.poly && defs.some(d => same(d, v.poly!)))] as const);
  };
  it('the bars, uprights and floor beams sit at one fixed place (+-1 px) in start, end and Mistake; the belt, chain and plate move and carry poly', () => {
    expect(stationProblems(S.weighted_dip)).toEqual([]);
    expect(inMistakeView(S.weighted_dip)).toEqual(MOVING.map(p => [p, true]));
    const types = [...drawnByKey(S.weighted_dip, 'end').values()].filter(v => STATIC.includes(v.part!));
    expect(types.length).toBe(dipEq.DIP_BARS_ITEMS);
  });
  it('mutation: a bar moved 2 cm in the Mistake is red', () => {
    const s = S.weighted_dip, k = s.equipment.findIndex((e: any) => typeof e === 'function' && ([] as any[]).concat(e(lmOf(s, 'end'), { pose: 'end' }))[0]?.part === 'bar');
    const bad = withEq(s, k, (e: any) => (lm: any, ctx: any) => { const it = e(lm, ctx); return ctx.pose === 'mistake' ? { ...it, surface: it.surface.map((p: any) => [p[0], p[1] + 0.02, p[2]]) } : it; });
    expect(stationProblems(bad).some(p => /\(bar\) moved/.test(p))).toBe(true);
  });
  it('mutation: the plate drawn with `line` instead of `poly` is missing from the Mistake view (red); H9 alone passes it', () => {
    const s = S.weighted_dip, k = s.equipment.findIndex((e: any) => typeof e === 'function' && ([] as any[]).concat(e(lmOf(s, 'end'), { pose: 'end' }))[0]?.part === 'plate' && e(lmOf(s, 'end'), { pose: 'end' }).cls === 'eq');
    const bad = withEq(s, k, (e: any) => (lm: any, ctx: any) => { const it = e(lm, ctx); return { type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line', z: it.z, part: 'plate' }; });
    expect(inMistakeView(bad).find(([p]) => p === 'plate')![1]).toBe(false);
    expect(stationProblems(bad)).toContain('plate: no poly in the Mistake (not drawn there)');
    expect(h9(bad).filter((x: string) => x.startsWith('H9.type'))).toEqual([]);
  });
  /** c1, c2: each hand on its bar in every pose (+-1 cm): the grip centre on the bar's centre line. */
  const handProblems = (spec: any) => posesOf(spec).flatMap(pose => ['l', 'r'].flatMap(s => {
    const g = lmOf(spec, pose)[`grip.${s}`], bar = D().grip(s === 'l' ? 1 : -1), d = Math.hypot(g[0] - bar[0], g[1] - bar[1]) * 100;
    return d <= 1 ? [] : [`${pose}: grip.${s} ${d.toFixed(1)} cm off its bar`];
  }));
  it('c1, c2: each hand sits on its bar in every pose (+-1 cm)', () => {
    expect(handProblems(S.weighted_dip)).toEqual([]);
  });
  it('mutation: one hand moved 2 cm off its bar at the end is red', () => {
    const s = S.weighted_dip, e = s.poses.end, reach = { ...e.reach, r: { ...e.reach.r, at: [e.reach.r.at[0], e.reach.r.at[1] + 0.02, e.reach.r.at[2]] } };
    expect(handProblems({ ...s, poses: { ...s.poses, end: { ...e, reach } } })).toEqual(['end: grip.r 2.0 cm off its bar']);
  });
  /** Nothing through the floor: the plate's lowest drawn point on or above the floor line (0.5 px) in every pose. */
  const plateFloor = (spec: any) => posesOf(spec).flatMap(pose => {
    const fy = camOf(spec).P([0, 0, 0])[1], polys = [...drawnByKey(spec, pose).values()].filter(v => v.part === 'plate').map(v => v.poly!);
    const low = Math.max(...polys.flat().map(p => p[1]!));
    return low - fy > 0.5 ? [`${pose}: plate ${(low - fy).toFixed(1)} px under the floor`] : [];
  });
  it('the plate stays above the floor in every pose', () => {
    expect(plateFloor(S.weighted_dip)).toEqual([]);
  });
  it('mutation: the plate 1 px below the floor line at the end is red', () => {
    const s = S.weighted_dip, k = s.equipment.findIndex((e: any) => typeof e === 'function' && ([] as any[]).concat(e(lmOf(s, 'end'), { pose: 'end' }))[0]?.part === 'plate' && e(lmOf(s, 'end'), { pose: 'end' }).cls === 'eq');
    const cam = camOf(s), fy = cam.P([0, 0, 0])[1];
    const low = (it: any) => Math.max(...eng.PRIMITIVES.poly(it, cam)[0].poly.map((p: number[]) => p[1]));
    const bad = withEq(s, k, (e: any) => (lm: any, ctx: any) => { const it = e(lm, ctx); if (ctx.pose !== 'end') return it; const dy = (fy - low(it) + 1.2) / cam.pxm; return { ...it, pts: it.pts.map((p: any) => [p[0], p[1] - dy, p[2]]) }; });
    expect(plateFloor(bad)).toEqual([expect.stringMatching(/^end: plate 1\.\d px under the floor$/)]);
  });
  it('c8: the plate hangs plumb under the belt\'s front on a chain of one length, and its centre is at mid-shin at the top', () => {
    for (const pose of posesOf(S.weighted_dip)) {
      const items = itemsIn(S.weighted_dip, pose).items, chain = items.find((i: any) => i.part === 'chain'), plateIt = items.find((i: any) => i.part === 'plate' && i.cls === 'eq');
      const top = (chain.pts[0][1] + chain.pts[1][1]) / 2, bot = (chain.pts[2][1] + chain.pts[3][1]) / 2;
      expect(Math.abs(chain.pts[0][2] - chain.pts[3][2]), pose).toBeLessThan(0.01);   // plumb
      expect(top - bot, pose).toBeCloseTo(M.weighted_dip.CHAIN_LEN, 6);
      const cy = (Math.max(...plateIt.pts.map((p: number[]) => p[1])) + Math.min(...plateIt.pts.map((p: number[]) => p[1]))) / 2;
      expect(cy, pose).toBeCloseTo(bot, 3);
    }
    const L = lmOf(S.weighted_dip, 'start'), mid = (L['knee.r'][1] + L['ankle.r'][1]) / 2, ch = itemsIn(S.weighted_dip, 'start').items.find((i: any) => i.part === 'chain');
    expect((ch.pts[2][1] + ch.pts[3][1]) / 2).toBeCloseTo(mid, 3);
  });
});

describe('LIB-17 weighted_dip (H; tier A; dipBars anchor): drawn facts and R10 (DESIGN.md section 7)', { timeout: T }, () => {
  const s = () => S.weighted_dip;
  const flex = (pose: string, side = 'r') => { const L = lmOf(s(), pose); return 180 - angle3(L[`shoulder.${side}`], L[`elbow.${side}`], L[`grip.${side}`]); };
  it('c2: arms straight at the top; c4 (D-LIB17-DIPBAL P): the bottom shoulder on the parallel line (+-1 cm) at the balanced elbow END_FLEX; c14: the Mistake shoulder M_DEPTH of the way down', () => {
    const W = M.weighted_dip, E = lmOf(s(), 'end'), Mi = lmOf(s(), 'mistake');
    expect(flex('start')).toBeLessThan(3);
    expect(Math.abs(E['shoulder.r'][1] - W.PAR_Y)).toBeLessThanOrEqual(0.01);
    for (const side of ['r', 'l']) expect(Math.abs(flex('end', side) - W.END_FLEX), side).toBeLessThanOrEqual(0.5);
    expect(W.END_FLEX).toBeGreaterThan(105);
    expect(W.END_FLEX).toBeLessThan(120);
    expect(Math.abs(Mi['shoulder.r'][1] - W.M_Y)).toBeLessThanOrEqual(0.01);
    expect(Mi['shoulder.r'][1]).toBeGreaterThan(W.PAR_Y + 0.05);
    const ua = Math.atan2(E['shoulder.r'][1] - E['elbow.r'][1], Math.abs(E['elbow.r'][2] - E['shoulder.r'][2])) * 180 / Math.PI;
    console.log(`LIB-17 weighted_dip bottom: elbow ${W.END_FLEX.toFixed(1)} deg, upper arm ${ua.toFixed(1)} deg above level, shoulder on the parallel line`);
  });
  /** D-LIB17-DIPBAL condition 3 (amended 6348947992): body plus the drawn plate (PLATE_KG on BODY_KG) at the belt point,
   *  the centre of mass over the grips (+-2 cm, fore and aft) in every pose. The body alone is logged, not tested. */
  const balanceProblems = (spec: any, plateKg = M.weighted_dip.SIZES.PLATE_KG) => ['start', 'end', 'mistake'].flatMap(pose => {
    const L = lmOf(spec, pose), W = M.weighted_dip, bk = W.SIZES.BODY_KG, b = W.bodyCom(L);
    const belt = itemsIn(spec, pose).items.find((i: any) => i.part === 'chain').pts[0];
    const com = b.map((v: number, i: number) => (bk * v + plateKg * belt[i]) / (bk + plateKg)), gz = (L['grip.l'][2] + L['grip.r'][2]) / 2;
    return Math.abs(com[2] - gz) <= 0.02 ? [] : [`${pose}: centre of mass ${((com[2] - gz) * 100).toFixed(1)} cm off the grips`];
  });
  it('balance: body plus plate at the belt point over the grips (+-2 cm) in every pose; the body alone logged', () => {
    expect(balanceProblems(s())).toEqual([]);
    const alone = ['start', 'end', 'mistake'].map(pose => { const L = lmOf(s(), pose); return ((M.weighted_dip.bodyCom(L)[2] - (L['grip.l'][2] + L['grip.r'][2]) / 2) * 100).toFixed(1); });
    console.log(`LIB-17 weighted_dip body-alone offset from the grips (cm): start ${alone[0]}, end ${alone[1]}, Mistake ${alone[2]}`);
  });
  it('balance mutations: the plate weight left out, and the bottom shoulder moved 5 cm forward, are red', () => {
    expect(balanceProblems(s(), 0).length).toBeGreaterThan(0);
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1], e.root.at[2] + 0.05] } } } };
    expect(balanceProblems(bad).some(p => p.startsWith('end:'))).toBe(true);
  });
  /** Slice look item 3: the plate hangs clear in front of the shins in every pose (the drawn plate disc against the
   *  drawn shin outlines, plate px). */
  const shinProblems = (spec: any) => ['start', 'end', 'mistake'].flatMap(pose => {
    const cam = camOf(spec), shins = shapesIn(spec, pose).filter((x: any) => /^(shin|shank|calf|lower)/.test(x.key) || /^(foot|knee)/.test(x.key)).map((x: any) => x.poly);
    const disc = itemsIn(spec, pose).items.filter((i: any) => i.part === 'plate').flatMap((it: any) => eng.PRIMITIVES[it.type](it, cam).map((q: any) => q.poly).filter(Boolean));
    const gap = Math.min(...disc.flat().map((p: number[]) => outside(shins, p)));
    return gap > 0 ? [] : [`${pose}: the plate ${(-gap).toFixed(1)} px into the legs`];
  });
  it('the plate hangs clear of the shins and feet in every pose', () => {
    expect(shapesIn(s(), 'start').some((x: any) => /^(shin|shank|calf|lower)/.test(x.key))).toBe(true);
    expect(shinProblems(s())).toEqual([]);
  });
  it('mutation: the plate hung 12 cm further back (into the shins) is red', () => {
    const k = s().equipment.findIndex((x: any) => typeof x === 'function' && ([] as any[]).concat(x(lmOf(s(), 'end'), { pose: 'end' }))[0]?.part === 'plate');
    const bad = withEq(s(), k, (x: any) => (lm: any, ctx: any) => ([] as any[]).concat(x(lm, ctx)).map((it: any) => ({ ...it, ...(it.at ? { at: [it.at[0], it.at[1], it.at[2] - 0.12] } : {}), ...(it.pts ? { pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! - 0.12]) } : {}) })));
    expect(shinProblems(bad).length).toBeGreaterThan(0);
  });
  it('c4: the elbows go back (the elbow behind the shoulder at the bottom)', () => {
    const E = lmOf(s(), 'end');
    expect(E['elbow.r'][2]).toBeLessThan(E['shoulder.r'][2] - 0.2);
  });
  /** R10 (tier A, D-LIB17-DIP): the right poses never show an unsafe setup. */
  const r10Problems = (spec: any) => {
    const out: string[] = [], d = M.weighted_dip;
    for (const pose of ['start', 'end']) {
      const its = itemsIn(spec, pose).items, pl = its.find((i: any) => i.part === 'plate' && i.cls === 'eq'), ch = its.find((i: any) => i.part === 'chain');
      if (!pl || !ch) { out.push(`${pose}: no plate`); continue; }
      if (Math.abs(ch.pts[0][2] - ch.pts[3][2]) > 0.01) out.push(`${pose}: the plate swings`);
      const L = lmOf(spec, pose);
      const q = body.resolve(body.normPose(fullPose(spec, pose), { height: 1.75 }), { height: 1.75 }).q;
      if (!(q.scap.r.elev <= -2.9 && q.scap.l.elev <= -2.9)) out.push(`${pose}: shoulders not down`);
      if (!(q.tilt <= d.SIZES.BOTTOM_LEAN + 0.01)) out.push(`${pose}: lean ${q.tilt.toFixed(1)}`);
    }
    const sy = lmOf(spec, 'end')['shoulder.r'][1];
    if (sy < d.PAR_Y - 0.01) out.push(`end: bottom deeper than parallel (shoulder ${((d.PAR_Y - sy) * 100).toFixed(1)} cm below the line)`);
    return out;
  };
  it('R10: the plate hangs plumb, the shoulders are down, the lean is at most slight and the bottom no deeper than parallel', () => {
    expect(r10Problems(s())).toEqual([]);
  });
  it('R10 mutations: the shoulders shrugged at the bottom, a deeper bottom (the shoulder 10 cm below the line) and a swinging plate are each red', () => {
    const e = s().poses.end, D = M.weighted_dip.WD;
    expect(r10Problems({ ...s(), poses: { ...s().poses, end: { ...e, scap: { elev: 2, pro: -3 } } } })).toContain('end: shoulders not down');
    expect(r10Problems({ ...s(), poses: { ...s().poses, end: D.poseAtY(D.parY - 0.10) } }).some(p => p.startsWith('end: bottom deeper'))).toBe(true);
    const k = s().equipment.findIndex((x: any) => typeof x === 'function' && ([] as any[]).concat(x(lmOf(s(), 'end'), { pose: 'end' }))[0]?.part === 'chain');
    const bad = withEq(s(), k, (x: any) => (lm: any, ctx: any) => { const it = x(lm, ctx); return { ...it, pts: it.pts.map((p: any, i: number) => (i >= 2 ? [p[0], p[1], p[2] + 0.1] : p)) }; });
    expect(r10Problems(bad)).toContain('start: the plate swings');
  });
  it('phantom (Q2 (c)): the straight start arm\'s covered outline is drawn as hidden lines over the end figure', () => {
    const its = itemsIn(s(), 'end').items.filter((i: any) => i.part === 'startArm');
    expect(its.length).toBeGreaterThan(0);
    expect(its.every((i: any) => i.type === 'line' && /m-line/.test(i.cls) && i.z === 'front')).toBe(true);
  });
});

describe('LIB-17 cable_external_rotation (H; plan 1\'s small-motion check, D-LIB17-ER): drawn facts', { timeout: T }, () => {
  const s = () => S.cable_external_rotation;
  const flex = (spec: any, pose: string) => { const L = lmOf(spec, pose); return 180 - angle3(L['shoulder.l'], L['elbow.l'], L['grip.l']); };
  it('c3: the elbow bent 90 (+-2) at start and end; c10: the forearm level (the grip at the elbow\'s height, +-1 cm); c3, c9: the elbow under the shoulder at start and end', () => {
    for (const pose of ['start', 'end']) {
      const L = lmOf(s(), pose);
      expect(Math.abs(flex(s(), pose) - 90), pose).toBeLessThanOrEqual(2);
      expect(Math.abs(L['grip.l'][1] - L['elbow.l'][1]) * 100, pose).toBeLessThanOrEqual(1);
      expect(Math.abs(L['elbow.l'][0] - L['shoulder.l'][0]) * 100, pose).toBeLessThanOrEqual(1);
    }
  });
  it('c4: the start forearm runs across the body, the fist past the midline and in front of the navel; c6: the end fist outside the upper arm\'s outline', () => {
    const L = lmOf(s(), 'start');
    expect(L['grip.l'][0]).toBeLessThan(0);
    expect(L['grip.l'][2]).toBeGreaterThan(L.navel[2]);
    const E = lmOf(s(), 'end'), arm = shapesIn(s(), 'end').filter((x: any) => /^(upper|shcap|elbowcap)\.l$/.test(x.key)).map((x: any) => x.poly), cam = camOf(s());
    const g = cam.P(E['grip.l']), armRight = Math.max(...arm.flat().map((p: number[]) => p[0]!));
    expect(g[0]).toBeGreaterThan(armRight);
  });
  it('c9 Mistake: only the working shoulder changes: the elbow leaves the side by M_ABD', () => {
    const E = lmOf(s(), 'end'), Mi = lmOf(s(), 'mistake');
    expect(Mi['elbow.l'][0] - E['elbow.l'][0]).toBeGreaterThan(0.1);
    for (const k of ['hips', 'shoulder.r', 'grip.r', 'head']) expect(Math.hypot(...Mi[k].map((v: number, i: number) => v - E[k][i])), k).toBeLessThan(1e-6);
  });
  it('phantoms (Q2 (c)): the start arm and the start handle are redrawn dashed in the end layer', () => {
    const its = itemsIn(s(), 'end').items;
    expect(its.filter((i: any) => i.part === 'startArm').length).toBeGreaterThan(0);
    expect(its.filter((i: any) => i.part === 'startHandle').length).toBe(2);
  });
  /** BULK GO (6349108629): "Elbow flares out" meets the red upper arm's outer edge just above the elbow, never the solid
   *  end handle the Mistake elbow sits on (3 px clear of every end-pose handle outline). */
  const flareProblems = (spec: any) => {
    const cam = camOf(spec), i = spec.mistake.tells.findIndex((t: any) => t.key === 'flare'), out: string[] = [];
    const p = leadersOf(plate.renderPlate(spec, { id: 'x', mistake: true }).svg)[i]![0]!, Mi = lmOf(spec, 'mistake');
    const a = cam.P(Mi['shoulder.l']), b = cam.P(Mi['elbow.l']), dx = b[0] - a[0], dy = b[1] - a[1];
    const t = ((p[0]! - a[0]) * dx + (p[1]! - a[1]) * dy) / (dx * dx + dy * dy);
    if (!(t >= 0.7 && t < 1)) out.push(`flare anchor at t ${t.toFixed(2)} along the upper arm`);
    if (!(segD(p, a, b) <= 12)) out.push(`flare anchor ${segD(p, a, b).toFixed(1)} px off the upper arm`);
    const handles = itemsIn(spec, 'end').items.filter((it: any) => it.part === 'handle').flatMap((it: any) => eng.PRIMITIVES[it.type](it, cam).map((q: any) => q.poly ?? q.line).filter(Boolean));
    if (!(outside(handles, p) >= 3)) out.push(`flare anchor ${outside(handles, p).toFixed(1)} px from the end handle`);
    return out;
  };
  it('the flare leader meets the red upper arm just above the elbow, clear of the end handle', () => {
    expect(flareProblems(s())).toEqual([]);
  });
  it('mutation: the flare anchored at the Mistake elbow itself (on the end handle) is red', () => {
    const bad = { ...s(), mistake: { ...s().mistake, tells: s().mistake.tells.map((t: any) => (t.key === 'flare' ? { ...t, anchor: { at: 'elbow.l', pose: 'mistake' } } : t)) } };
    expect(flareProblems(bad).length).toBeGreaterThan(0);
  });
  it('A15 mutation: the start elbow set to 170 deg (inside) is red on the bent-arm check', () => {
    const st = s().poses.start, bad = { ...s(), poses: { ...s().poses, start: { ...st, elbow: { ...st.elbow, l: 10 } } } };
    expect(bentProblems(bad).some(p => p.startsWith('start: elbow.l'))).toBe(true);
  });
});

/** 6341498444 item 2: a bent arm reads as bent: where the card bends the elbow, the drawn inside angle is at most 150 deg
 *  (flexion at least 30) in the poses listed, and the two elbows never meet in one stub. */
const BENT: Record<string, [string, string[]][]> = { cable_external_rotation: [['start', ['l']], ['end', ['l']]], face_pull: [['end', ['l', 'r']]], weighted_dip: [['end', ['l', 'r']]], bench_dip: [['end', ['l', 'r']]] };
const bentProblems = (spec: any) => (BENT[spec.id] ?? []).flatMap(([pose, sides]) => {
  const l = lmOf(spec, pose), out: string[] = [];
  for (const s of sides) { const inside = angle3(l[`shoulder.${s}`], l[`elbow.${s}`], l[`grip.${s}`]); if (!(inside <= 150)) out.push(`${pose}: elbow.${s} ${inside.toFixed(1)} inside`); }
  if (Math.abs(l['elbow.l'][0] - l['elbow.r'][0]) < 0.2) out.push(`${pose}: elbows meet`);
  return out;
});
/** D-LIB16-LOCK's basis: a "slight bend" elbow is drawn at its sized bend, never straight. */
const SLIGHT: Record<string, [string, string, number][]> = { cable_lateral_raise: [['start', 'l', 18], ['end', 'l', 18]],
  cable_rear_delt_fly: [['start', 'l', 18], ['start', 'r', 18], ['end', 'l', 18], ['end', 'r', 18]],
  resistance_band_pull_apart: [['start', 'l', 18], ['start', 'r', 18], ['end', 'l', 18], ['end', 'r', 18]],
  dumbbell_front_raise: [['start', 'l', 18], ['start', 'r', 18], ['end', 'l', 18], ['end', 'r', 18]] };
const slightProblems = (spec: any) => (SLIGHT[spec.id] ?? []).flatMap(([pose, s, want]) => {
  const l = lmOf(spec, pose), f = 180 - angle3(l[`shoulder.${s}`], l[`elbow.${s}`], l[`grip.${s}`]);
  return Math.abs(f - want) <= 1 ? [] : [`${pose}: elbow.${s} bend ${f.toFixed(1)} != ${want}`];
});

describe('LIB-17 cable_lateral_raise (H; the front-view cable, the single handle, the above-90 size): drawn facts', { timeout: T }, () => {
  const s = () => S.cable_lateral_raise;
  it('c7: the upper arm level at the top (shoulder elevation 90 +-2, the elbow at the shoulder\'s height +-1 cm); c19 Mistake: 90 + M_OVER', () => {
    const a = rep(s()).angles;
    expect(Math.abs(+/elev (-?[\d.]+)/.exec(a.end['sh.l'])![1]! - 90)).toBeLessThanOrEqual(2);
    const E = lmOf(s(), 'end');
    expect(Math.abs(E['elbow.l'][1] - E['shoulder.l'][1]) * 100).toBeLessThanOrEqual(1);
    expect(Math.abs(+/elev (-?[\d.]+)/.exec(a.mistake['sh.l'])![1]! - 90 - M.cable_lateral_raise.SIZES.M_OVER)).toBeLessThanOrEqual(2);
  });
  it('c6, c13: the elbow leads the hand at the top (the forearm trails the upper arm by LEAD on screen, +-1 deg)', () => {
    const cam = camOf(s()), E = lmOf(s(), 'end'), [S0, E0, G0] = ['shoulder.l', 'elbow.l', 'grip.l'].map(k => cam.P(E[k]));
    const trail = (Math.atan2(-(E0![1]! - S0![1]!), E0![0]! - S0![0]!) - Math.atan2(-(G0![1]! - E0![1]!), G0![0]! - E0![0]!)) * 180 / Math.PI;
    expect(Math.abs(trail - M.cable_lateral_raise.SIZES.LEAD)).toBeLessThanOrEqual(1);
  });
  it('c4, c9: the slight elbow bend in start and end (ELBOW_BEND, never straight)', () => {
    expect(slightProblems(s())).toEqual([]);
  });
  it('A15 mutation: the end elbow set to 180 deg (straight) is red', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, elbow: { ...e.elbow, l: 0 } } } };
    expect(slightProblems(bad)).toEqual([expect.stringMatching(/^end: elbow\.l bend 0\.0 != 18$/)]);
  });
  it('c5: the start fist hangs in front of the near thigh', () => {
    const L = lmOf(s(), 'start');
    expect(L['grip.l'][2]).toBeGreaterThan(L['hip.l'][2] + 0.1);
  });
});

describe('LIB-17 cables (D-LIB17-CABLE): pulley to handle in every pose, above the body layer, never through the head', { timeout: T }, () => {
  const CABLED = ['cable_lateral_raise', 'face_pull', 'cable_external_rotation'];
  /** Where each cable ends (the handle's ring, or face_pull's rope ferrule) and its pulley, from the spec's own export. */
  const rigOf = (spec: any, l: any) => (spec.id === 'face_pull' ? { ring: M.face_pull.FP.ferruleOf(l), pulley: M.face_pull.FP.pulley }
    : { ring: M[spec.id][spec.id === 'cable_lateral_raise' ? 'CLR' : 'CER'].handleOf(l['grip.l']).ring, pulley: M[spec.id][spec.id === 'cable_lateral_raise' ? 'CLR' : 'CER'].pulley });
  /** Every pose: the column's cable runs from its pulley to the handle's ring; in the Mistake the twin does. Front view:
   *  the cable is drawn at z center (above the body layer); no cable point lies inside the head outline. */
  const cableProblems = (spec: any) => posesOf(spec).flatMap(pose => {
    const out: string[] = [], items = itemsIn(spec, pose).items, cam = camOf(spec), l = lmOf(spec, pose);
    const col = items.find((i: any) => i.type === 'cableColumn'), { ring } = rigOf(spec, l);
    if (!col || Math.hypot(...col.to.map((v: number, i: number) => v - ring[i])) > 1e-9) out.push(`${pose}: the cable does not reach the handle`);
    const head = shapesIn(spec, pose).filter((x: any) => x.key === 'head').map((x: any) => x.poly);
    for (const it of items) for (const p of eng.PRIMITIVES[it.type](it, cam)) {
      if (p.cls !== 'eq-cable' || !p.line) continue;
      const [a, b] = p.line, pts = Array.from({ length: 81 }, (_, k) => [a[0] + (b[0] - a[0]) * k / 80, a[1] + (b[1] - a[1]) * k / 80]);
      if (pts.some(q => outside(head, q) < 0)) out.push(`${pose}: cable through the head outline`);
    }
    return out;
  });
  /** Slice look item 1 (#299 6348157337): in the Mistake the red cable shows unbroken from the pulley to the Mistake
   *  handle's ring: one dashed Mistake guide (drawn in the mistake layer, above every figure, never masked) whose ends sit
   *  on the pulley's rim and the ring (+-1 px), and no Mistake `poly` stands in for it. */
  const mistakeCableProblems = (spec: any) => {
    const svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg, layer = svg.split('<g class="mistake-layer">')[1] ?? '', cam = camOf(spec);
    const l = lmOf(spec, 'mistake'), { ring, pulley: pul } = rigOf(spec, l);
    const [R0, P0] = [cam.P(ring), cam.P(pul)];
    const hit = [...layer.matchAll(/<path class="m-line" d="([^"]+)"/g)].map(m => xy(m[1]!)).some(p => p.length === 2
      && Math.hypot(p[1]![0]! - R0[0]!, p[1]![1]! - R0[1]!) <= 1 && Math.abs(Math.hypot(p[0]![0]! - P0[0]!, p[0]![1]! - P0[1]!) - 0.045 * cam.pxm) <= 1);
    const out = hit ? [] : ['mistake: no unbroken cable guide from the pulley to the handle'];
    if (itemsIn(spec, 'mistake').items.some((i: any) => i.part === 'cable')) out.push('mistake: a masked cable poly');
    return out;
  };
  it('A15: each cabled plate\'s Mistake shows the cable unbroken from the pulley to the Mistake handle', () => {
    for (const id of CABLED) expect(mistakeCableProblems(S[id]), id).toEqual([]);
  });
  it('A15 mutation: the Mistake cable guide removed (cable_external_rotation) is red', () => {
    const s = S.cable_external_rotation, bad = { ...s, mistake: { ...s.mistake, guides: s.mistake.guides.filter((g: any) => g.kind !== 'dashed') } };
    expect(mistakeCableProblems(bad)).toEqual(['mistake: no unbroken cable guide from the pulley to the handle']);
  });
  it('each cabled plate: the cable reaches the handle in every pose and never crosses the head', () => {
    for (const id of CABLED) expect(cableProblems(S[id]), id).toEqual([]);
  });
  it('A15 mutation: cable_lateral_raise\'s cable drawn through the head outline is red', () => {
    const s = S.cable_lateral_raise, k = s.equipment.findIndex((e: any) => typeof e === 'function' && e(lmOf(s, 'end'), { pose: 'end' })?.type === 'cableColumn');
    const bad = withEq(s, k, (e: any) => (lm: any, ctx: any) => ({ ...e(lm, ctx), pulley: { at: [lm.head[0] - 0.6, lm.head[1] - 0.08, 0.2] } }));
    expect(cableProblems(bad).some(p => /through the head/.test(p))).toBe(true);
  });
  it('the stack stays where the end pose puts it in the Mistake (only the fault changes)', () => {
    for (const id of CABLED) {
      const s = S[id], cam = camOf(s), stackOf = (pose: string) => { const col = itemsIn(s, pose).items.find((i: any) => i.type === 'cableColumn'); return eng.PRIMITIVES.cableColumn(col, cam).filter((p: any) => p.poly && p.cls === 'eq').map((p: any) => p.d).join('|'); };
      expect(stackOf('mistake'), id).toBe(stackOf('end'));
    }
  });
});

describe('LIB-17 renegade_row (H; tier A; the plank class; held: D-LIB17-SECS, D-LIB8-shrug): drawn facts and R10', { timeout: T }, () => {
  const s = () => S.renegade_row;
  const R = () => M.renegade_row.RR;
  it('c1, c2, c6: both hex dumbbells flat on the floor under the shoulders at the start; the far one in every pose', () => {
    const cam = camOf(s()), fy = cam.P([0, 0, 0])[1];
    for (const pose of posesOf(s())) {
      const bells = itemsIn(s(), pose).items.filter((i: any) => i.type === 'dumbbell' && (pose === 'start' || i.part === 'farBell'));
      for (const b of bells) { const hex = eng.PRIMITIVES.dumbbell(b, cam)[0].poly, low = Math.max(...hex.map((p: number[]) => p[1])); expect(Math.abs(low - fy), `${pose} ${b.part}`).toBeLessThan(0.5); }
    }
    const L = lmOf(s(), 'start');
    for (const side of ['l', 'r']) expect(Math.abs(L[`shoulder.${side}`][2] - L[`grip.${side}`][2]) * 100, side).toBeLessThanOrEqual(0.5);
  });
  it('c3: one straight line head to heels (shoulder, hip, knee, ankle on a line, +-1 cm) in every pose', () => {
    for (const pose of posesOf(s())) {
      const L = lmOf(s(), pose), a = L['shoulder.r'], b = L['ankle.r'];
      for (const k of ['hip.r', 'knee.r']) { const p = L[k], t = ((p[1] - a[1]) * (b[1] - a[1]) + (p[2] - a[2]) * (b[2] - a[2])) / ((b[1] - a[1]) ** 2 + (b[2] - a[2]) ** 2); expect(Math.hypot(p[1] - a[1] - t * (b[1] - a[1]), p[2] - a[2] - t * (b[2] - a[2])) * 100, `${pose} ${k}`).toBeLessThanOrEqual(1.5); }
    }
  });
  it('c4, c5: the row ends with the near dumbbell beside the lower ribs, the elbow above the back', () => {
    const E = lmOf(s(), 'end');
    expect(E['grip.r'][2]).toBeLessThan(E['shoulder.r'][2] - 0.15);
    expect(Math.abs(E['grip.r'][1] - E['shoulder.r'][1])).toBeLessThan(0.02);
    expect(E['elbow.r'][1]).toBeGreaterThan(E.backUpper[1]);
  });
  it('c9 Mistake: the near dumbbell lands on a corner (a hex vertex on the floor, turned M_TURN from the flat far one)', () => {
    const items = itemsIn(s(), 'mistake').items, hex = items.find((i: any) => i.type === 'poly' && i.cls === 'disc');
    expect(hex).toBeTruthy();
    const low = Math.min(...hex.pts.map((p: number[]) => p[1]));
    expect(Math.abs(low)).toBeLessThan(1e-9);
    expect(hex.pts.filter((p: any) => Math.abs(p[1] - low) < 1e-6).length).toBe(1);
    expect(items.some((i: any) => i.type === 'dumbbell' && i.part === 'farBell')).toBe(true);
  });
  /** R10 (tier A, DESIGN.md section 7): hex dumbbells flat on a face in the right poses, the wrists neutral, one line. */
  const r10Problems = (spec: any) => {
    const out: string[] = [], cam = camOf(spec), fy = cam.P([0, 0, 0])[1];
    for (const pose of ['start', 'end']) {
      const bells = itemsIn(spec, pose).items.filter((i: any) => i.type === 'dumbbell' || (i.type === 'poly' && i.cls === 'disc'));
      for (const b of bells) {
        const hex = b.type === 'dumbbell' ? eng.PRIMITIVES.dumbbell(b, cam)[0].poly : eng.PRIMITIVES.poly(b, cam)[0].poly;
        if (hex.length !== 6) out.push(`${pose}: not a hex`);
        const low = Math.max(...hex.map((p: any) => p[1])), onFloor = hex.filter((p: any) => Math.abs(p[1] - low) < 0.05);
        if (Math.abs(low - fy) < 0.5 && onFloor.length !== 2) out.push(`${pose}: a dumbbell on a corner`);
      }
      const q = body.resolve(body.normPose(fullPose(spec, pose), { height: 1.75 }), { height: 1.75 }).q;
      if (q.wrist.l !== 0 || q.wrist.r !== 0) out.push(`${pose}: wrist bent`);
    }
    return out;
  };
  it('R10: hex dumbbells flat on a face in start and end, the wrists neutral', () => {
    expect(r10Problems(s())).toEqual([]);
  });
  it('R10 mutation: the corner landing drawn in the start pose (one R10 item removed) is red', () => {
    const bad = { ...s(), poses: { ...s().poses, start: { ...s().poses.start, reach: { ...s().poses.start.reach, r: { at: R().mGrip, pole: [0, 0, 1] } } } },
      equipment: s().equipment.map((e: any, i: number) => (i === 2 ? (lm: any, ctx: any) => (ctx.pose === 'start' ? { type: 'poly', pts: M.renegade_row.M_HEX, cls: 'disc', z: 'front' } : e(lm, ctx)) : e)) };
    expect(r10Problems(bad)).toContain('start: a dumbbell on a corner');
  });
  it('held (D-LIB8-shrug, D-LIB17-SIZE, S2): the card-true corner landing at M_TURN moves the hex corners under deviationMin; the engine deviation with the corner tell is 0', () => {
    const cam = camOf(s()), flat = eng.PRIMITIVES.dumbbell({ type: 'dumbbell', at: R().db.r }, cam)[0].poly;
    const turned = eng.PRIMITIVES.poly({ type: 'poly', pts: M.renegade_row.M_HEX }, cam)[0].poly;
    // the turned hex's vertices against the flat hex's nearest vertices (the visible change of the sign)
    const move = Math.max(...turned.map((p: number[]) => Math.min(...flat.map((q: number[]) => Math.hypot(p[0]! - q[0]!, p[1]! - q[1]!)))));
    const env = pins().envelope, Rr = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), Rr);
    console.log(`LIB-17 renegade_row held: corner sign ${move.toFixed(1)} px, engine deviation ${dev.toFixed(1)} px (min ${env.deviationMin})`);
    expect(move).toBeLessThan(env.deviationMin);
    expect(dev).toBeLessThan(env.deviationMin);
  });
  it('one tell, with its per-id record in DESIGN.md (D-LIB10-SKULL1; #290 6345185694)', () => {
    expect(s().mistake.tells.length).toBe(1);
    const d = readFileSync('tools/plates/library/lb7/DESIGN.md', 'utf8');
    expect(d).toMatch(/One-tell record[^\n]*\n?[^\n]*renegade_row: fault c9/);
    expect(d).toMatch(/no second visible sign stated/);
  });
  it('the spec carries no tempo (D-LIB17-SECS)', () => {
    expect('tempo' in s()).toBe(false);
  });
});

describe('LIB-17 cable_rear_delt_fly (H; front view; held: D-LIB17-SECS and D-LIB8-shrug): drawn facts', { timeout: T }, () => {
  const s = () => S.cable_rear_delt_fly;
  const C = () => M.cable_rear_delt_fly.CRDF;
  /** The two drawn cables (the cableColumns' handle runs, plate px) in one pose, by column side. */
  const cablesIn = (spec: any, pose: string) => {
    const cam = camOf(spec), out: Record<string, number[][]> = {};
    for (const it of itemsIn(spec, pose).items.filter((i: any) => i.type === 'cableColumn')) {
      const side = it.base[0] < 0 ? 'l' : 'r', run = eng.PRIMITIVES.cableColumn(it, cam).find((p: any) => p.cls === 'eq-cable' && p.line);
      out[side] = run.line;
    }
    return out;
  };
  const cross = (a: number[][], b: number[][]) => {
    const [p, q] = a, [r, t] = b, d = (q![0]! - p![0]!) * (t![1]! - r![1]!) - (q![1]! - p![1]!) * (t![0]! - r![0]!);
    const u = ((r![0]! - p![0]!) * (t![1]! - r![1]!) - (r![1]! - p![1]!) * (t![0]! - r![0]!)) / d, v = ((r![0]! - p![0]!) * (q![1]! - p![1]!) - (r![1]! - p![1]!) * (q![0]! - p![0]!)) / d;
    return u > 0 && u < 1 && v > 0 && v < 1 ? [p![0]! + (q![0]! - p![0]!) * u, p![1]! + (q![1]! - p![1]!) * u] : null;
  };
  it('c2: each hand holds the opposite column\'s cable, which runs from its high pulley to that hand\'s handle ring in every pose; the cables cross', () => {
    for (const pose of posesOf(s())) {
      const l = lmOf(s(), pose), cam = camOf(s()), cb = cablesIn(s(), pose);
      for (const side of ['l', 'r']) { const hand = side;
        const ring = cam.P(C().handleOf(l[`grip.${hand}`], side).ring), pul = cam.P(C().pulley[side]);
        expect(Math.sign(pul[0]! - cam.P(l.hips)[0]!), `${pose} ${side}`).toBe(-Math.sign(ring[0]! - cam.P(l.hips)[0]!));
        expect(Math.hypot(cb[side]![0]![0]! - ring[0]!, cb[side]![0]![1]! - ring[1]!), `${pose} ${side} ring`).toBeLessThan(1);
      }
      expect(cross(cb.l!, cb.r!), pose).not.toBeNull();
    }
  });
  it('c4: at the start the drawn cables cross at the ear\'s height (+-2 px), the arms straight ahead with the handles close together', () => {
    const l = lmOf(s(), 'start'), cam = camOf(s()), x = cross(cablesIn(s(), 'start').l!, cablesIn(s(), 'start').r!)!;
    expect(Math.abs(x[1]! - cam.P(l.ear)[1]!)).toBeLessThanOrEqual(2);
    for (const k of ['l', 'r']) expect(l[`grip.${k}`][2] - l[`shoulder.${k}`][2], k).toBeGreaterThan(0.5);
    expect(Math.abs(l['grip.l'][0] - l['grip.r'][0])).toBeLessThan(Math.abs(l['shoulder.l'][0] - l['shoulder.r'][0]));
  });
  it('c6, c7: at the end both arms are out in the body\'s plane, slightly below the shoulder line, the handles wider than at the start', () => {
    const E = lmOf(s(), 'end'), St = lmOf(s(), 'start');
    for (const k of ['l', 'r']) {
      expect(Math.abs(E[`elbow.${k}`][2] - E[`shoulder.${k}`][2]), k).toBeLessThan(0.01);
      expect(E[`elbow.${k}`][1], k).toBeLessThan(E[`shoulder.${k}`][1]);
    }
    expect(Math.abs(E['grip.l'][0] - E['grip.r'][0])).toBeGreaterThan(3 * Math.abs(St['grip.l'][0] - St['grip.r'][0]));
  });
  it('c5 Mistake: only the shoulder girdles change: both shoulders M_ELEV cm up and M_PRO cm forward of the end', () => {
    const E = lmOf(s(), 'end'), Mi = lmOf(s(), 'mistake'), z = M.cable_rear_delt_fly.SIZES;
    for (const k of ['l', 'r']) {
      expect(Mi[`shoulder.${k}`][1] - E[`shoulder.${k}`][1], k).toBeCloseTo(z.M_ELEV / 100, 3);
      expect(Mi[`shoulder.${k}`][2] - E[`shoulder.${k}`][2], k).toBeCloseTo(z.M_PRO / 100, 3);
    }
    for (const k of ['hips', 'head', 'heel.l', 'heel.r']) expect(Math.hypot(...Mi[k].map((v: number, i: number) => v - E[k][i])), k).toBeLessThan(1e-6);
  });
  it('phantoms (Q2 (c)): both start arms and both start handles are redrawn dashed in the end layer', () => {
    const its = itemsIn(s(), 'end').items;
    expect(its.filter((i: any) => i.part === 'startArm').length).toBeGreaterThanOrEqual(2);
    expect(its.filter((i: any) => i.part === 'startHandle').length).toBe(2);
  });
  it('A15 mutation: one end elbow set straight is red on the slight-bend check', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, elbow: { ...e.elbow, r: 0 } } } };
    expect(slightProblems(bad)).toEqual([expect.stringMatching(/^end: elbow\.r bend 0\.0 != 18$/)]);
  });
  it('held (D-LIB8-shrug, D-LIB17-SIZE, S2): the card-true shoulder roll moves the plate under deviationMin', () => {
    const env = pins().envelope, Rr = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), Rr);
    console.log(`LIB-17 cable_rear_delt_fly held: engine deviation ${dev.toFixed(1)} px (min ${env.deviationMin})`);
    expect(dev).toBeLessThan(env.deviationMin);
    expect(readFileSync('tools/plates/library/lb7/DESIGN.md', 'utf8')).toMatch(/\| cable_rear_delt_fly \| D-LIB17-SECS \(D-LIB14-NOSECS\); and D-LIB8-shrug/);
  });
  it('the spec carries no tempo (D-LIB17-SECS)', () => {
    expect(s().tempo).toBeUndefined();
  });
});

describe('LIB-17 bench_dip (H; tier B; the support class, the bench; held: D-LIB8-shrug, S2): drawn facts', { timeout: T }, () => {
  const s = () => S.bench_dip;
  const B = { height: 1.75 };
  /** Every drawn pose of a spec, by name (start, both via poses, end, the Mistake), as full poses. */
  const drawnPoses = (spec: any): [string, any][] => [['start', spec.poses.start], ...spec.poses.via.map((p: any, i: number) => [`via${i + 1}`, p]), ['end', spec.poses.end], ['mistake', fullPose(spec, 'mistake')]];
  const lmP = (p: any) => body.landmarksOf(p, 1.75);
  const shapesP = (spec: any, p: any) => body.bodyShapes(body.fk(body.resolve(body.normPose(p, B), B).q, B), camOf(spec), { hand: spec.hand }).filter((x: any) => x.poly);
  const benchPolys = (spec: any) => eng.PRIMITIVES.bench(spec.equipment.find((e: any) => e.type === 'bench'), camOf(spec)).map((p: any) => p.poly);
  it('c1, c2: both palms flat on the bench pad, fingers forward, at one place in every drawn pose', () => {
    const pad = benchPolys(s())[0], top = Math.min(...pad.map((p: number[]) => p[1]!)), W0 = lmP(s().poses.start);
    for (const [pose, p] of drawnPoses(s())) {
      const L = lmP(p);
      for (const side of ['l', 'r']) {
        const palm = shapesP(s(), p).find((x: any) => x.key === `palm.${side}`);
        expect(palm, `${pose} palm.${side}`).toBeTruthy();
        expect(Math.abs(Math.max(...palm.poly.map((q: number[]) => q[1]!)) - top), `${pose} palm.${side} on the pad`).toBeLessThanOrEqual(1);
        expect(L[`grip.${side}`][2], `${pose} fingers forward`).toBeGreaterThan(L[`wrist.${side}`][2] + 0.05);
        expect(Math.hypot(...L[`wrist.${side}`].map((v: number, i: number) => v - W0[`wrist.${side}`][i])) * 100, `${pose} wrist.${side} fixed`).toBeLessThanOrEqual(0.5);
      }
    }
  });
  it('c3, c6: arms straight at the top; c5: elbows 90 (+-2) at the bottom with the upper arm level (+-1 cm); c3, c4: legs straight in every drawn pose', () => {
    const T0 = lmP(s().poses.start), E = lmP(s().poses.end);
    for (const side of ['l', 'r']) {
      expect(angle3(T0[`shoulder.${side}`], T0[`elbow.${side}`], T0[`wrist.${side}`]), `start elbow.${side}`).toBeGreaterThan(179.5);
      expect(Math.abs(angle3(E[`shoulder.${side}`], E[`elbow.${side}`], E[`wrist.${side}`]) - 90), `end elbow.${side}`).toBeLessThanOrEqual(2);
      expect(Math.abs(E[`shoulder.${side}`][1] - E[`elbow.${side}`][1]) * 100, `end upper arm.${side} level`).toBeLessThanOrEqual(1);
    }
    for (const [pose, p] of drawnPoses(s())) { const L = lmP(p); for (const side of ['l', 'r']) expect(angle3(L[`hip.${side}`], L[`knee.${side}`], L[`ankle.${side}`]), `${pose} knee.${side}`).toBeGreaterThan(179.5); }
  });
  /** c3 (ruled: an end check and this drawn-item test, no end fact): the drawn heels touch the floor line (+-0.5 px) at
   *  the start and the end, the heel points never slide along the floor, and the spec checks the heels at the end. */
  const heelProblems = (spec: any) => {
    const fy = camOf(spec).P([0, 0, 0])[1], out: string[] = [], H0 = lmP(spec.poses.start);
    for (const [pose, p] of drawnPoses(spec)) {
      const feet = shapesP(spec, p).filter((x: any) => /^foot\./.test(x.key));
      for (const f of feet) { const low = Math.max(...f.poly.map((q: number[]) => q[1]!)); if ((pose === 'start' || pose === 'end') && Math.abs(low - fy) > 0.5) out.push(`${pose}: ${f.key} ${(fy - low).toFixed(1)} px off the floor`); }
      const L = lmP(p);
      for (const side of ['l', 'r']) if (Math.abs(L[`heel.${side}`][2] - H0[`heel.${side}`][2]) * 100 > 0.5) out.push(`${pose}: heel.${side} slid`);
    }
    for (const side of ['l', 'r']) if (!spec.checks.some((c: any) => c.landmark === `heel.${side}` && c.pose === 'end')) out.push(`no end check on heel.${side}`);
    return out;
  };
  it('c3 heels: the drawn heels on the floor line at the start and the end, never sliding, with an end check on each heel', () => {
    expect(heelProblems(s())).toEqual([]);
    const r = rep(s()).checks.filter((c: any) => /^heel\./.test(c.landmark) && c.pose === 'end');
    expect(r.length).toBe(4);
  });
  it('mutations: the end pose with the hips flexed 4 deg more (the heels lift) and the heels\' end checks removed are red', () => {
    const e = s().poses.end, lifted = { ...s(), poses: { ...s().poses, end: { ...e, hip: { flex: e.hip.flex + 4 } } } };
    expect(heelProblems(lifted).some(p => /^end: foot\.r .* off the floor$/.test(p))).toBe(true);
    const unchecked = { ...s(), checks: s().checks.filter((c: any) => !(/^heel\./.test(c.landmark) && c.pose === 'end')) };
    expect(heelProblems(unchecked)).toEqual(['no end check on heel.l', 'no end check on heel.r']);
  });
  /** The body's centre of mass (Winter 2009 table 4.1 fractions on the drawn landmarks) lies between the hands and the
   *  heels along the floor in every drawn pose: the support holds the body. */
  const lerp3 = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
  const comOf = (L: any) => {
    const parts: [number, number[]][] = [[0.497, lerp3(L.hips, L.shoulders, 0.5)], [0.081, L.ear]];
    for (const side of ['l', 'r']) parts.push([0.028, lerp3(L[`shoulder.${side}`], L[`elbow.${side}`], 0.436)], [0.016, lerp3(L[`elbow.${side}`], L[`wrist.${side}`], 0.430)],
      [0.006, lerp3(L[`wrist.${side}`], L[`grip.${side}`], 0.5)], [0.100, lerp3(L[`hip.${side}`], L[`knee.${side}`], 0.433)], [0.0465, lerp3(L[`knee.${side}`], L[`ankle.${side}`], 0.433)],
      [0.0145, lerp3(L[`ankle.${side}`], L[`toe.${side}`], 0.5)]);
    const m = parts.reduce((t, [w]) => t + w, 0);
    return parts.reduce((t, [w, p]) => t.map((v, i) => v + w * p[i]! / m), [0, 0, 0]);
  };
  const comProblems = (spec: any) => drawnPoses(spec).flatMap(([pose, p]) => {
    const L = lmP(p), z = comOf(L)[2]!, hands = Math.max(L['wrist.l'][2], L['wrist.r'][2]), heels = Math.min(L['heel.l'][2], L['heel.r'][2]);
    return z > hands && z < heels ? [] : [`${pose}: centre of mass z ${z.toFixed(3)} not between the hands ${hands.toFixed(3)} and the heels ${heels.toFixed(3)}`];
  });
  it('the centre of mass sits between the hands and the heels in every drawn pose', () => {
    for (const [pose, p] of drawnPoses(s())) { const L = lmP(p); console.log(`LIB-17 bench_dip ${pose}: centre of mass z ${comOf(L)[2]!.toFixed(3)} m, hands ${L['wrist.r'][2].toFixed(3)}, heels ${L['heel.r'][2].toFixed(3)}`); }
    expect(comProblems(s())).toEqual([]);
  });
  it('mutation: the end pose with the arms reaching forward (the hands in front of the body) is red', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, shoulder: { flex: 80 }, elbow: 0, wrist: 0 } } };
    expect(comProblems(bad).some(p => p.startsWith('end:'))).toBe(true);
  });
  /** c3, c4: the drawn torso stays off the drawn bench pad in every drawn pose; at the top the buttock is HIP_CLEAR in
   *  front of the bench's front edge (lb7/sizes.json). */
  const padProblems = (spec: any) => {
    const pad = benchPolys(spec)[0], out: string[] = [];
    for (const [pose, p] of drawnPoses(spec)) {
      const torso = shapesP(spec, p).filter((x: any) => x.key === 'torso');
      const min = Math.min(...torso.flatMap((x: any) => x.poly.map((q: number[]) => outside([pad], q))));
      if (min < 0) out.push(`${pose}: torso ${(-min).toFixed(1)} px into the pad`);
    }
    return out;
  };
  it('c4 hips close: the drawn torso off the pad in every drawn pose; the start buttock HIP_CLEAR in front of the edge (+-0.5 cm)', () => {
    expect(padProblems(s())).toEqual([]);
    const pad = benchPolys(s())[0], cam = camOf(s()), edge = (Math.max(...pad.map((q: number[]) => q[0]!)) - cam.P([0, 0, 0])[0]!) / cam.pxm;
    expect(Math.abs(lmP(s().poses.start).buttock[2] - edge - M.bench_dip.SIZES.HIP_CLEAR) * 100).toBeLessThanOrEqual(0.5);
  });
  it('mutation: the start pose 12 cm further back (the hips over the pad) is red', () => {
    const st = s().poses.start, at = st.root.at, bad = { ...s(), poses: { ...s().poses, start: { ...st, root: { ...st.root, at: [at[0], at[1], at[2] - 0.12] } } } };
    expect(padProblems(bad).some(p => p.startsWith('start:'))).toBe(true);
  });
  it('c8 Mistake: the upper arm M_FLEX below level (the shoulder under the elbow), the hips lower than the end\'s, nothing through the floor; tells low and parallel', () => {
    const Ms = lmP(fullPose(s(), 'mistake')), E = lmP(s().poses.end);
    const below = Math.atan2(Ms['elbow.r'][1] - Ms['shoulder.r'][1], Math.abs(Ms['elbow.r'][2] - Ms['shoulder.r'][2])) * 180 / Math.PI;
    expect(Math.abs(below - M.bench_dip.SIZES.M_FLEX)).toBeLessThanOrEqual(1);
    expect(Ms.hips[1]).toBeLessThan(E.hips[1] - 0.05);
    const fy = camOf(s()).P([0, 0, 0])[1];
    expect(Math.max(...shapesP(s(), fullPose(s(), 'mistake')).flatMap((x: any) => x.poly.map((q: number[]) => q[1]!)))).toBeLessThanOrEqual(fy + 0.5);
    expect(s().mistake.tells.map((t: any) => t.key)).toEqual(['low', 'parallel']);
  });
  it('mutation: the Mistake at the proposed 25 deg puts the drawn buttock through the floor (red)', () => {
    const p = M.bench_dip.BD.poseFor(-115, 115), fy = camOf(s()).P([0, 0, 0])[1];
    const torso = shapesP(s(), p).find((x: any) => x.key === 'torso');
    expect(Math.max(...torso.poly.map((q: number[]) => q[1]!))).toBeGreaterThan(fy + 0.5);
  });
  it('held (D-LIB8-shrug, D-LIB17-SIZE, S2): the Trace at the ruled shoulder point is under traceLenMin; the Mistake deviation passes', () => {
    const env = pins().envelope, R = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), R), tr = markup.pathsOf(R.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0);
    console.log(`LIB-17 bench_dip held: Trace ${tr.toFixed(1)} px (min ${env.traceLenMin}), deviation ${dev.toFixed(1)} px (min ${env.deviationMin})`);
    expect(s().trace).toEqual({ point: 'shoulder.r', trim: [10, 12] });
    expect(tr).toBeLessThan(env.traceLenMin);
    expect(dev).toBeGreaterThanOrEqual(env.deviationMin);
  });
});

describe('LIB-17 Mistakes, tells, cues and callouts (DESIGN.md sections 9-10)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { cable_lateral_raise: 'above', dumbbell_front_raise: 'swing', cable_rear_delt_fly: 'roll', face_pull: 'drop', cable_external_rotation: 'flare',
    resistance_band_pull_apart: 'shrug', renegade_row: 'corner', weighted_dip: 'short', bench_dip: 'low' };
  const ONE_TELL = ['renegade_row', 'resistance_band_pull_apart'];
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each drawn plate draws its Mistake with 2-3 tells (or one, with its record), the first carrying the proposed key', () => {
    for (const id of specsDrawn()) {
      expect(keyProblems(S[id])).toEqual([]);
      const n = S[id].mistake.tells.length;
      expect(ONE_TELL.includes(id) ? n === 1 : n >= 2 && n <= 3, `${id} ${n}`).toBe(true);
    }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.weighted_dip;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['weighted_dip: first tell parallel']);
  });
  const guideProblems = (spec: any) => spec.mistake.guides.filter((g: any) => !['dashed', 'arrow', 'arc-arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('A15: every Mistake guide is dashed or an arrow; mutation: a solid line guide is red', () => {
    for (const id of specsDrawn()) expect(guideProblems(S[id])).toEqual([]);
    const s = S.weighted_dip;
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: s.mistake.guides[0].pts }] } })).toEqual(['weighted_dip: line']);
  });
  /** Q-D5-6 cue table: every callout and tell cue is one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('A15 cue table: every cue is one sentence of 15 words or fewer; mutation: a 16-word cue is red', () => {
    for (const id of specsDrawn()) expect(cueProblems(S[id]), id).toEqual([]);
    const s = S.weighted_dip;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Keep your shoulders pulled down and back and well away from your ears on every rep.' }, ...s.callouts.slice(1)] })).toEqual(['shoulders: 16 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of specsDrawn()) {
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
    for (const id of specsDrawn()) { out.push(...anchorProblems(S[id])); await new Promise<void>(r => setImmediate(r)); }   // one spec per macrotask (the RPC note above)
    expect(out).toEqual([]);
  });
  it('mutation: one tell\'s anchor moved to a point with no drawn item is red', () => {
    const s = S.weighted_dip, tells = [{ ...s.mistake.tells[0], anchor: [0, 2.3, 0.9] }, ...s.mistake.tells.slice(1)];
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells } }).length).toBe(1);
  });
});

describe('LIB-17 A15: Mistake clearance, leaders, the floor and bent arms', { timeout: T }, () => {
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
  it('every drawn plate: no solid red part comes within 6 px of the solid end figure', () => {
    for (const id of specsDrawn()) expect(clearance(S[id]), id).toEqual([]);
  });
  it('mutation: an arrow from the end elbow to the Mistake elbow on cable_external_rotation (inside the figure\'s 6 px clearance) is red', () => {
    const s = S.cable_external_rotation, guides = [...s.mistake.guides, { kind: 'arrow', from: { at: 'elbow.l', pose: 'end' }, to: { at: 'elbow.l', pose: 'mistake' } }];
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });
  /** The lines a leader must keep 6 px from (plate px; the card's Do 7 list): the Trace, every cable (the column's and
   *  the Mistake twin), the band, the rope, the dip bars and their frame, the bench and every dumbbell (away from the
   *  leader's first 8 px at its anchor). */
  const AVOID_PARTS = ['bar', 'frame', 'band', 'rope', 'cable', 'farBell', 'arm.r'];
  const avoidOf = (spec: any, mistake: boolean, svg: string) => {
    const cam = camOf(spec), out: number[][][] = [];
    for (const m of svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)) out.push(...segs(xy(m[1]!)));
    for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items) {
      const keep = ['dumbbell', 'bench'].includes(it.type) || (AVOID_PARTS.includes(it.part) && ['backPad', 'poly', 'line'].includes(it.type));
      if (keep) for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) out.push(...segs([...pts, pts[0]])); }
    }
    return out;
  };
  const minGap = (spec: any) => {
    let min = Infinity, at = '';
    for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg, list = listOf(spec, mistake);
      leadersOf(svg).forEach((p, i) => {
        const avoid = avoidOf(spec, mistake, svg);
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) { const d = segD(q, g[0]!, g[1]!); if (d < min) { min = d; at = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`; } }
        }
      });
    }
    return { min, at };
  };
  it('no leader comes within 6 px of the Trace, a cable, a dip bar, the frame, the bench or a dumbbell (away from its first 8 px)', () => {
    for (const id of specsDrawn()) { const g = minGap(S[id]); expect(g.min, `${id} ${g.at}`).toBeGreaterThanOrEqual(6); }
  });
  it('mutation: weighted_dip\'s "Elbows back" box lowered onto the near dip bar (its leader along the bar) is red', () => {
    const s = S.weighted_dip, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'elbows' ? { ...x, box: { left: 200, top: 192 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  it('mutation: resistance_band_pull_apart\'s "Soft elbows" box moved above the arms (its leader across the band) is red', () => {
    const s = S.resistance_band_pull_apart, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'soft' ? { ...x, box: { left: 30, top: 70 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  it('mutation: cable_lateral_raise\'s "Elbow leads" box moved below the cable (its leader across the cable) is red', () => {
    const s = S.cable_lateral_raise, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'elbow' ? { ...x, box: { left: 250, top: 250 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  /** No leader runs across the solid figure: away from its first 8 px at the anchor, a leader stays outside the solid
   *  end figure, on the normal and the Mistake plate. */
  const crossProblems = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), out: string[] = [];
    for (const mistake of [false, true]) {
      const list = listOf(spec, mistake);
      leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
        let inside = 0;
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8 && outside(polys, q) < 0) inside++;
        }
        if (inside) out.push(`${spec.id} ${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: crosses the figure`);
      });
    }
    return out;
  };
  it('no leader crosses the solid figure\'s outline', () => {
    expect(specsDrawn().flatMap(id => crossProblems(S[id]))).toEqual([]);
  });
  it('mutation: weighted_dip\'s "Depth to parallel" box placed behind the figure, so its leader crosses the body, is red', () => {
    const s = S.weighted_dip, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'depth' ? { ...x, box: { left: 30, top: 200 } } : x)) };
    expect(crossProblems(bad)).toContain('weighted_dip normal depth: crosses the figure');
  });
  /** 6341498444 item 1: every drawn foot (heel, ball and toe: the engine's whole foot outline) and every dumbbell on or
   *  above the floor line (0.5 px) in every pose. */
  const floorProblems = (spec: any) => posesOf(spec).flatMap(pose => {
    const cam = camOf(spec), fy = cam.P([0, 0, 0])[1], out: string[] = [];
    for (const x of shapesIn(spec, pose).filter((x: any) => /^foot\./.test(x.key))) { const low = Math.max(...x.poly.map((p: number[]) => p[1]!)); if (low - fy > 0.5) out.push(`${pose}: ${x.key} ${(low - fy).toFixed(1)} px under the floor`); }
    for (const it of itemsIn(spec, pose).items.filter((i: any) => i.type === 'dumbbell' || (i.type === 'poly' && i.cls === 'disc'))) {
      const low = Math.max(...eng.PRIMITIVES[it.type](it, cam).flatMap((p: any) => (p.poly ?? []).map((q: number[]) => q[1])));
      if (low - fy > 0.5) out.push(`${pose}: dumbbell ${(low - fy).toFixed(1)} px under the floor`);
    }
    return out;
  });
  it('no foot or dumbbell through the floor in every drawn pose', () => {
    for (const id of specsDrawn()) expect(floorProblems(S[id]), id).toEqual([]);
  });
  it('mutation: one heel 1 px below the floor line (cable_external_rotation\'s near foot pitched heel-down about the ball) is red', () => {
    const s = S.cable_external_rotation, st = s.poses.start, a = 1.6 * Math.PI / 180, l = lmOf(s, 'start');
    const plant = { ...st.plant, r: { at: l['ball.r'], ref: 'ball', toe: [-0.3 * Math.cos(a), Math.sin(a), Math.cos(a)], normal: [0, Math.cos(a), -Math.sin(a)] } };
    const bad = floorProblems({ ...s, poses: { ...s.poses, start: { ...st, plant } } });
    expect(bad).toEqual([expect.stringMatching(/^start: foot\.r \d\.\d px under the floor$/)]);
  });
  it('mutation: one dumbbell 1 px below the floor line (renegade_row\'s far dumbbell) is red', () => {
    const s = S.renegade_row, cam = camOf(s), k = s.equipment.findIndex((e: any) => e?.part === 'farBell');
    const bad = { ...s, equipment: s.equipment.map((e: any, i: number) => (i === k ? { ...e, at: [e.at[0], e.at[1] - 1.2 / cam.pxm, e.at[2]] } : e)) };
    expect(floorProblems(bad).filter(p => /dumbbell/.test(p)).length).toBe(3);
  });
  it('a bent arm reads as bent (inside angle at most 150 deg, the elbows apart) where the card bends it', () => {
    for (const id of specsDrawn()) expect(bentProblems(S[id]), id).toEqual([]);
  });
  /** F3 and F4: the longest leader inside the 8's range and 2-6 hand-placed labels (qa/envelope.json). */
  const leaderMax = (spec: any) => Math.max(...[false, true].flatMap(mistake => [...plate.renderPlate(spec, { id: 'x', mistake }).svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(m => {
    let x = 0, y = 0, t = 0;
    for (const c of m[1]!.matchAll(/([MLH])(-?[\d.]+)(?:[ ,](-?[\d.]+))?/g)) { const nx = +c[2]!, ny = c[1] === 'H' ? y : +c[3]!; if (c[1] !== 'M') t += Math.hypot(nx - x, ny - y); x = nx; y = ny; }
    return t;
  })));
  it('F3 and F4 measured on every drawn plate (posted; any value outside the 8\'s range is a flag for the ruling, never dodged)', () => {
    for (const id of specsDrawn()) {
      const n = [...S[id].callouts, ...S[id].mistake.tells, ...(S[id].measure ? [S[id].measure] : [])].filter((c: any) => c.box).length;
      console.log(`LIB-17 F3/F4 ${id}: longest leader ${leaderMax(S[id]).toFixed(1)} px, boxed ${n}`);
      expect(Number.isFinite(leaderMax(S[id]))).toBe(true);
    }
  });
});

describe('LIB-17 PQ-H3 measured node-side on the slice (DESIGN.md section 12)', { timeout: T }, () => {
  it('cable_external_rotation, cable_lateral_raise, weighted_dip and face_pull pass at their ruled sizes; values logged', () => {
    const env = pins().envelope;
    for (const id of ['cable_external_rotation', 'cable_lateral_raise', 'weighted_dip', 'face_pull']) {
      const s = S[id], R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
      const dev = qaNode.deviation({ spec: s }, Eng(), R), tr = markup.pathsOf(R.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0);
      console.log(`LIB-17 H3 ${id}: deviation ${dev.toFixed(1)} px, Trace ${tr.toFixed(1)} px, ${R.normal.report.camera.pxPerM} px/m`);
      expect(dev, id).toBeGreaterThanOrEqual(env.deviationMin);
      expect(tr, id).toBeGreaterThanOrEqual(env.traceLenMin);
      expect(R.normal.report.camera.pxPerM, id).toBeGreaterThanOrEqual(env.F1[0]);
      expect(R.normal.report.camera.pxPerM, id).toBeLessThanOrEqual(env.F1[1]);
    }
  });
});

describe('LIB-17 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/vendor/exercises/')),
    ...c.filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\//.test(p)),
    ...c.filter(p => p.startsWith('tests/howto/fixtures/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
  ];
  it('every drawn LB7 spec passes', () => {
    expect(files().length).toBeGreaterThanOrEqual(4);
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb7-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/weighted_dip.mjs';
  it('mutation: readFileSync added to the dipBars composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/dipBars.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/vendor/exercises/pull_up.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../vendor/exercises/pull_up.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root))).toContain('tools/plates/vendor/exercises/pull_up.mjs'); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-17 A16: no other card\'s composer is copied, forked or imported (D-LIB17-COMPOSERS, -HANDLE, -BAND, D-LIB-A16-COMPOSE)', () => {
  // D-LIB-A16-COMPOSE (lib4-cards section 39): main's eq/ at 40f9ea93, this card's composers, and the composers other build-ahead cards own, by exact name.
  const MAIN_EQ = ['assistMachine', 'band', 'chestRowMachine', 'dHandle', 'declineBench', 'inclineBench', 'landmine', 'legCurlMachine', 'parts', 'pecDeck', 'polybar', 'romanChair', 'rope', 'safetyArms', 'smith'].map(c => `${c}.mjs`);
  const OURS = COMPOSERS.map(c => `${c}.mjs`);
  const OTHER_CARDS: Record<string, string[]> = otherCards('LIB-17');   // D-LIB-A16-REGISTRY (#326): the shared registry
  const OTHER = Object.values(OTHER_CARDS).flat().map(c => `${c}.mjs`);
  const eqDir = (): [string, string][] => readdirSync('tools/plates/library/eq').map(n => [n, readFileSync(`tools/plates/library/eq/${n}`, 'utf8')]);
  const eqProblems = (entries: [string, string][]) => {
    const names = entries.map(([n]) => n), ours = entries.filter(([n]) => OURS.includes(n));
    return [
      ...names.filter(n => !MAIN_EQ.includes(n) && !OURS.includes(n) && !OTHER.includes(n)).map(n => `extra ${n}`),
      ...entries.filter(([n]) => !OURS.includes(n)).flatMap(([n, src]) => ours.filter(([, o]) => o === src).map(([o]) => `copy of ${o}: ${n}`)),
      ...[...MAIN_EQ, ...OURS].filter(n => !names.includes(n)).map(n => `missing ${n}`),
    ];
  };
  it('OTHER_CARDS leaves out this card\'s own composers and main\'s', () => {
    expect(OTHER.filter(n => OURS.includes(n) || MAIN_EQ.includes(n))).toEqual([]);
  });
  it('tools/plates/library/eq/ holds main\'s files and dipBars.mjs; any other file is another card\'s composer by name, not a copy of ours', () => {
    expect(eqProblems(eqDir())).toEqual([]);
    expect(readdirSync('tools/plates/library/eq')).toContain('dipBars.mjs');
  });
  it('mutation: a copy of eq/band.mjs added under eq/ under another name is red', () => {
    const d = eqDir();
    expect(eqProblems([...d, ['pullBand.mjs', d.find(([n]) => n === 'band.mjs')![1]]])).toEqual(['extra pullBand.mjs']);
  });
  it('mutation: a file named as another card\'s composer holding a byte copy of eq/dipBars.mjs is red', () => {
    const d = eqDir();
    expect(eqProblems([...d, ['kettlebell.mjs', d.find(([n]) => n === 'dipBars.mjs')![1]]])).toEqual(['copy of dipBars.mjs: kettlebell.mjs']);
  });
  it('mutation: a missing main file or a missing own composer is red', () => {
    expect(eqProblems(eqDir().filter(([n]) => n !== 'rope.mjs' && n !== 'dipBars.mjs'))).toEqual(['missing rope.mjs', 'missing dipBars.mjs']);
  });
});

describe('LIB-17 A10: the LB7 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the LB7 rows are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb7/build.mjs'));
    expect(build.drawnIds()).toEqual(drawn().map(i => `lib_${i}`));
    const a = await build.buildLb7Page(), b = await build.buildLb7Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});

describe('LIB-17 A4: runQa node half on an LB7 plate (lib_weighted_dip), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_weighted_dip', cg = () => S.weighted_dip;
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb7/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb7All();
    html = (await build.buildLb7Page({ all, ids: [ID] })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins: pins() });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb7-mut-')), file = join(dir, 'weighted_dip.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/weighted_dip.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb7', title: 'LB7', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: no node-half problem (H6 passes on the card keys), F7 is not raised (drawable true, topFault = the drawn key)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
    expect(r.flags.F7.raised).toBe(false);
  });
  it('A8 mutation: the card copied with topFault set to its other tell key raises F7, and the expected-set check is red', async () => {
    const qaMod = await import(/* @vite-ignore */ lib('lb7/qa.mjs'));
    const c = await candOf(), r = await qa({ ...c, research: { ...c.research, topFault: 'parallel' } });
    expect(r.flags.F7.raised).toBe(true);
    expect(qaMod.flagProblems([{ ...r, flags: { ...r.flags, F5: { ...r.flags.F5, raised: true, value: 3.57 } } }]).some((p: string) => /F7/.test(p))).toBe(true);
  });
  it('A4 M1 a label 1 px onto the figure (the Depth to parallel callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg().callouts.find((x: any) => x.key === 'depth'), at = (box: any) => ({ ...cg(), callouts: cg().callouts.map((x: any) => (x.key === 'depth' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[-1, 0], [0, -1], [0, 1], [1, 0]]) {
      for (let d = 1; d <= 120 && !hit; d++) {
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
  it('A4 M2 a contact 1 cm off (the near bar\'s grip point moved 1.1 cm) turns PQ-H1 red', async () => {
    const shift = (s: any) => ({ ...s, checks: s.checks.map((k: any) => (k.landmark === 'grip.r' && k.at ? { ...k, at: [k.at[0], k.at[1] + 0.011, k.at[2]] } : k)) });
    const c = { ...(await candOf()), spec: shift(cg()) };
    expect(node(await qa(c)).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A4 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = MUT('M3').prepare(E, cg(), pins().envelope);
    const c = await mutated('(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, mistake: { ...s.mistake, pose: {}, guides: [] } })');
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

describe('LIB-17 A7: the tempo strip follows the card (D-LIB17-SECS, -TEMPO)', { timeout: T }, () => {
  // The proposed tempo table (D-LIB17-TEMPO; DESIGN.md section 8), copied here, never read from tempo.json or a spec.
  const RULED: Record<string, [string, string, boolean][]> = {
    cable_lateral_raise: [['Raise', 'up', true], ['Hold', 'pause', false], ['Lower', 'down', true]],
    dumbbell_front_raise: [['Raise', 'up', true], ['Hold', 'pause', false], ['Lower', 'down', true]],
    face_pull: [['Pull', 'up', true], ['Hold', 'pause', false], ['Return', 'down', true]],
    cable_external_rotation: [['Turn out', 'up', true], ['Hold', 'pause', false], ['Return', 'down', true]],
    resistance_band_pull_apart: [['Pull apart', 'up', true], ['Hold', 'pause', false], ['Return', 'down', true]],
    weighted_dip: [['Lower', 'down', true], ['Press', 'up', true]],
    bench_dip: [['Lower', 'down', true], ['Press', 'up', true], ['Hold', 'pause', false]],
  };
  const WITH_SECS = LB7.filter(id => !NOSECS.includes(id));
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  /** The phase array built only from a tempo.json row set and the card's plate.tempo. */
  const build = (rows: any[], t: any) => rows.map(r => ({ phase: r.phase, s: t[r.from], ...(r.move ? { move: true } : {}) }));
  const tempoProblems = (tj: any, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not the ruled (empty) set');
    if (JSON.stringify(Object.keys(tj.ids)) !== JSON.stringify(WITH_SECS)) bad.push('ids: not the 7 with seconds');
    for (const id of WITH_SECS) {
      const rows = tj.ids[id]?.rows ?? [], t = cardOf(id).plate.tempo;
      if (JSON.stringify(rows.map((r: any) => [r.phase, r.from, !!r.move])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (rows.some((r: any) => r.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (rows.some((r: any) => r.from === 'pause') && !(t.pause > 0)) bad.push(`${id}: Hold with pause 0`);
      if (t.pause > 0 && !rows.some((r: any) => r.from === 'pause')) bad.push(`${id}: no Hold for pause ${t.pause}`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(build(rows, t))) bad.push(`${id}: spec tempo != the built strip`);
    }
    for (const id of NOSECS) {
      if (tj.ids[id]) bad.push(`${id}: a tempo.json row`);
      if (specs[id] && 'tempo' in specs[id]) bad.push(`${id}: the spec carries a tempo`);
      const t = cardOf(id).plate.tempo;
      if (t.up != null || t.down != null) bad.push(`${id}: the card has seconds`);
    }
    return bad;
  };
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  it('tempo.json follows the ruled table, every drawn spec\'s tempo is built from it and the card\'s plate.tempo, and the two no-seconds specs carry none', () => {
    expect(tempoProblems(readJson('tools/plates/library/lb7/tempo.json'), { ...S })).toEqual([]);
    expect(S.cable_external_rotation.tempo).toEqual([{ phase: 'Turn out', s: 2, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Return', s: 2, move: true }]);
  });
  it('mutations: cable_external_rotation\'s Hold removed, a Hold added to weighted_dip, Motra\'s 1 s bottom pause added to cable_lateral_raise, a Rest, and a tempo on renegade_row\'s spec are each red', () => {
    const red = (f: (tj: any, specs: any) => void) => { const tj = copy(readJson('tools/plates/library/lb7/tempo.json')), specs: any = { ...S }; f(tj, specs); return tempoProblems(tj, specs).length > 0; };
    expect(red(tj => { tj.ids.cable_external_rotation.rows.splice(1, 1); }), 'no Hold on cable_external_rotation').toBe(true);
    expect(red(tj => { tj.ids.weighted_dip.rows.splice(1, 0, { phase: 'Hold', from: 'pause' }); }), 'Hold on weighted_dip').toBe(true);
    expect(red((tj, specs) => { specs.cable_lateral_raise = { ...specs.cable_lateral_raise, tempo: [...specs.cable_lateral_raise.tempo, { phase: 'Pause', s: 1 }] }; }), 'bottom pause').toBe(true);
    expect(red(tj => { tj.ids.weighted_dip.rows.push({ phase: 'Rest', from: 'pause' }); }), 'Rest').toBe(true);
    expect(red((tj, specs) => { specs.renegade_row = { ...specs.renegade_row, tempo: [{ phase: 'Row', s: 1, move: true }] }; }), 'tempo on renegade_row').toBe(true);
    expect(red((tj, specs) => { specs.weighted_dip = { ...specs.weighted_dip, tempo: [{ ...specs.weighted_dip.tempo[0], s: 3 }, specs.weighted_dip.tempo[1]] }; }), 'one value off by 1 s').toBe(true);
  });
  it('A6 mutation: the card path removed gives H6:no-card', () => {
    const s = S.weighted_dip, R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
    expect(qaNode.h6({ spec: s, research: null }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key)).toEqual(['H6:no-card']);
  });
});

describe('LIB-17 A17: sizes and trace points are fixed in lb7/sizes.json and never set by PQ-H3 (D-LIB17-SIZE, -TRACE)', () => {
  const sizes = readJson('tools/plates/library/lb7/sizes.json');
  const rowProblems = (table: Record<string, any>) => Object.entries(table).flatMap(([k, r]: [string, any]) => [
    ...(typeof r.basis === 'string' && r.basis.trim() ? [] : [`${k}: empty basis`]),
    ...(/PQ-H3|deviationMin|traceLenMin|\bH3\b/.test(r.basis ?? '') ? [`${k}: basis names PQ-H3`] : []),
  ]);
  /** Both ways: every SIZES number is a row with the same value; every row is a SIZES number, a solved export of the
   *  spec (value 'solved'), or the spec's trace point (`trace`). */
  const sizeProblems = (mod: any, table: Record<string, any>) => {
    const spec = mod.SIZES ?? {}, out: string[] = [];
    for (const k of Object.keys(spec)) if (!(k in table)) out.push(`${k}: not in sizes.json`); else if (table[k].value !== spec[k]) out.push(`${k}: spec ${spec[k]} != sizes.json ${table[k].value}`);
    for (const [k, r] of Object.entries<any>(table)) {
      if (k === 'trace') { if (mod.default?.trace?.point !== r.value) out.push(`trace: spec ${mod.default?.trace?.point} != sizes.json ${r.value}`); continue; }
      if (r.value === 'solved') { if (typeof mod[k] !== 'number') out.push(`${k}: no solved export`); continue; }
      if (!(k in spec)) out.push(`${k}: not in the spec`);
    }
    return [...out, ...rowProblems(table)];
  };
  it('each drawn spec\'s SIZES and trace point equal its sizes.json row, and dipBars\' constants equal theirs, every row with a basis that is not PQ-H3', () => {
    for (const id of specsDrawn()) expect(sizeProblems(M[id], sizes.ids[id]), id).toEqual([]);
    expect(sizeProblems({ SIZES: { ...dipEq.DIP_BARS } }, sizes.ids.dipBars)).toEqual([]);
  });
  it('mutations: one Mistake size changed in its spec only, a row with an empty basis, a row whose basis names PQ-H3 or deviationMin, a spec number missing from sizes.json and one trace point changed in the spec only are red', () => {
    const m = M.cable_external_rotation, t = JSON.parse(JSON.stringify(sizes.ids.cable_external_rotation));
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, M_ABD: 30 } }, t)).toEqual(['M_ABD: spec 30 != sizes.json 20']);
    expect(sizeProblems(m, { ...t, M_ABD: { ...t.M_ABD, basis: '' } })).toEqual(['M_ABD: empty basis']);
    expect(sizeProblems(m, { ...t, M_ABD: { ...t.M_ABD, basis: 'sized so PQ-H3 passes' } })).toEqual(['M_ABD: basis names PQ-H3']);
    expect(sizeProblems(m, { ...t, M_ABD: { ...t.M_ABD, basis: 'above deviationMin' } })).toEqual(['M_ABD: basis names PQ-H3']);
    expect(sizeProblems({ ...m, SIZES: { ...m.SIZES, WRIST_TILT: 5 } }, t)).toEqual(['WRIST_TILT: not in sizes.json']);
    expect(sizeProblems({ ...m, default: { ...m.default, trace: { ...m.default.trace, point: 'elbow.l' } } }, t)).toEqual(['trace: spec elbow.l != sizes.json grip.l']);
  });
});

describe('LIB-17 A11, A6, A8 (Do 6 b): the card fields, the ruled tempo map, the pose map and the plate facts', { timeout: T }, () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const cardsSha = readJson('tools/plates/library/lb7/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  // The ruled pose map (DESIGN.md section 9): identity for all 9.
  const POSE_MAP: Record<string, Record<string, string>> = Object.fromEntries(LB7.map(id => [id, { start: 'start', end: 'end' }]));
  it('each card differs from its research-head copy only in the three keys, written last (the two no-seconds cards: plateFacts and topFault)', () => {
    for (const id of LB7) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(Object.keys(cardOf(id)).slice(NOSECS.includes(id) ? -2 : -3), id).toEqual(NOSECS.includes(id) ? ['plateFacts', 'topFault'] : KEYS);
    }
  });
  it('each card\'s tempo is the strip built from lb7/tempo.json and its plate.tempo, and equals its drawn spec\'s; none on the no-seconds cards', () => {
    const tj = readJson('tools/plates/library/lb7/tempo.json');
    for (const id of LB7) {
      const c = cardOf(id);
      if (NOSECS.includes(id)) { expect('tempo' in c, id).toBe(false); continue; }
      const want = tj.ids[id].rows.filter((r: any) => c.plate.tempo[r.from] > 0).map((r: any) => ({ phase: r.phase, s: c.plate.tempo[r.from], ...(r.move ? { move: true } : {}) }));
      expect(c.tempo, id).toEqual(want);
      if (S[id]) expect(S[id].tempo, id).toEqual(c.tempo);
    }
  });
  it('A11 mutations: any other card key edited, and seconds changed on one card\'s tempo and spec, are red', () => {
    const c = cardOf('weighted_dip'); c.plate.tempo.up = 3;
    expect(sha(canon(c))).not.toBe(cardsSha.cards.weighted_dip);
    const d = cardOf('weighted_dip'); d.tempo[0].s = 3;
    expect(JSON.stringify(d.tempo)).not.toBe(JSON.stringify(S.weighted_dip.tempo));
  });
  // The ruled fault->key map (DESIGN.md section 9; #299 6347885720 Q3): the drawn key, and topFault.
  const DRAWN: Record<string, string> = { cable_lateral_raise: 'above', dumbbell_front_raise: 'swing', cable_rear_delt_fly: 'roll', face_pull: 'drop', cable_external_rotation: 'flare',
    resistance_band_pull_apart: 'shrug', renegade_row: 'corner', weighted_dip: 'short', bench_dip: 'low' };
  const TOP: Record<string, string> = { ...DRAWN, cable_rear_delt_fly: 'swing', cable_external_rotation: 'swing', bench_dip: 'flare' };
  const F7 = ['cable_rear_delt_fly', 'cable_external_rotation', 'bench_dip'];
  /** D-LIB9-CARDFIELDS, D-LIB17-F7: drawable true: topFault is the drawn key; drawable false: it is the ruled key of
   *  handlingMistakes[0] and differs from the drawn key. */
  const topFaultProblems = (id: string, card: any) => {
    const out: string[] = [];
    if (card.topFault !== TOP[id]) out.push(`topFault ${card.topFault} != ruled ${TOP[id]}`);
    if (card.plate.mistake.drawable && card.topFault !== DRAWN[id]) out.push('drawable:true but topFault is not the drawn fault');
    if (!card.plate.mistake.drawable && card.topFault === DRAWN[id]) out.push('drawable:false but topFault is the drawn key');
    if (card.plate.mistake.drawable !== !F7.includes(id)) out.push('drawable does not match the F7 set');
    return out;
  };
  it('A8: each topFault is the ruled key; every drawn first tell carries the drawn key; F7 exactly on the three drawable-false cards', () => {
    for (const id of LB7) expect(topFaultProblems(id, cardOf(id)), id).toEqual([]);
    for (const id of specsDrawn()) expect(S[id].mistake.tells[0].key, id).toBe(DRAWN[id]);
  });
  it('A8 mutations: face_pull\'s card with topFault set to another of its tell keys, and bench_dip\'s card with topFault set to its drawn key, are red', () => {
    const c = cardOf('face_pull'); c.topFault = 'low';
    expect(topFaultProblems('face_pull', c)).toContain('drawable:true but topFault is not the drawn fault');
    const b = cardOf('bench_dip'); b.topFault = 'low';
    expect(topFaultProblems('bench_dip', b)).toContain('drawable:false but topFault is the drawn key');
  });
  /** 14.7 rules 10, 15, D-LIB9-CARDFIELDS and the pose map: kind, one form, a claim of its own card, a pose that is the
   *  map's image of its card pose. */
  const factProblems = (id: string, c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
    ...(f.cardPose && POSE_MAP[id]![f.cardPose] !== (f.pose ?? 'end') ? [`${i}: pose ${f.pose ?? 'end'} is not the map's image of card ${f.cardPose}`] : []),
  ]);
  // The ruled facts (#299 6347885720 Q4), each with its claim id; one per checked landmark.
  const C = (lms: string[], pose: string, claim: string) => lms.map(landmark => ({ kind: 'contact', landmark, pose, cardPose: pose, claim }));
  const A = (joints: string[], pose: string, claim: string, note?: string) => joints.map(joint => ({ kind: 'angle', joint, pose, cardPose: pose, deg: 90, claim, ...(note ? { note } : {}) }));
  const SH = (q: string) => `${q}: the upper arm horizontal, read as shoulder elevation 90 against the upright trunk (PANELS.md 7's sh.r.elev reading)`;
  const FACTS: Record<string, any[]> = {
    cable_lateral_raise: [...C(['wrist.l'], 'start', 'c2'), ...A(['sh.l.elev'], 'end', 'c7', SH('"until your upper arm is horizontal"'))],
    dumbbell_front_raise: [...C(['wrist.l', 'wrist.r'], 'start', 'c1'), ...A(['sh.l.elev', 'sh.r.elev'], 'end', 'c8', SH('"until your arms are level with your shoulders"'))],
    cable_rear_delt_fly: C(['wrist.l', 'wrist.r'], 'start', 'c2'),
    face_pull: C(['wrist.l', 'wrist.r'], 'start', 'c2'),
    cable_external_rotation: [...C(['wrist.l'], 'start', 'c2'), ...A(['elbow.l'], 'start', 'c3')],
    resistance_band_pull_apart: [...C(['wrist.l', 'wrist.r'], 'start', 'c1'), ...A(['sh.l.elev', 'sh.r.elev'], 'start', 'c5', SH('"Start with arms extended forward at shoulder height"')), ...A(['sh.l.elev', 'sh.r.elev'], 'end', 'c4', SH('"Pull band apart horizontally until arms align with shoulders"'))],
    renegade_row: C(['wrist.l', 'wrist.r'], 'start', 'c1'),
    weighted_dip: [...C(['wrist.l', 'wrist.r'], 'start', 'c2'), ...C(['navel'], 'start', 'c8')],   // F-LB7-1 (e5ed66ca): the elbow-90 facts dropped
    bench_dip: [...C(['wrist.l', 'wrist.r'], 'start', 'c2'), ...C(['heel.l', 'heel.r'], 'start', 'c3'), ...A(['elbow.l', 'elbow.r'], 'end', 'c5')],
  };
  it('every card\'s plateFacts is the ruled set, each fact well formed', () => {
    for (const id of LB7) { expect(cardOf(id).plateFacts, id).toEqual(FACTS[id]); expect(factProblems(id, cardOf(id)), id).toEqual([]); }
  });
  it('mutations: a fact with both joint and measure: true, a start fact named with the unmapped pose, and bench_dip\'s heel fact carried to the end, are red', () => {
    const c = cardOf('weighted_dip'); c.plateFacts.push({ kind: 'angle', joint: 'elbow.r', measure: true, deg: 90, claim: 'c4' });
    expect(factProblems('weighted_dip', c)).toEqual([`${c.plateFacts.length - 1}: both joint and measure`]);
    const p = cardOf('cable_external_rotation'); p.plateFacts.push({ kind: 'contact', landmark: 'wrist.l', pose: 'end', cardPose: 'start', claim: 'c2' });
    expect(factProblems('cable_external_rotation', p)).toEqual([`${p.plateFacts.length - 1}: pose end is not the map's image of card start`]);
    const b = cardOf('bench_dip'); b.plateFacts.push(...C(['heel.l'], 'end', 'c3'));
    expect(b.plateFacts).not.toEqual(FACTS.bench_dip);
  });
  const h6 = (spec: any, research: any) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key);
  };
  const research = (id: string) => { const c = cardOf(id); return { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault }; };
  it('A6: PQ-H6 is green on every drawn spec with seconds against its card; the two no-seconds specs pass every fact (their tempo waits)', () => {
    for (const id of specsDrawn()) {
      const keys = h6(S[id], research(id));
      expect(keys, id).toEqual([]);
    }
  });
  // Every numeric triple named `at` in a pose (root, reach and plant targets) moved by v: the whole body moves rigidly.
  const shiftPose = (p: any, v: number[]): any => Array.isArray(p) ? p.map(x => shiftPose(x, v)) : p && typeof p === 'object'
    ? Object.fromEntries(Object.entries(p).map(([k, x]: [string, any]) => [k, k === 'at' && Array.isArray(x) && x.length === 3 && x.every((n: any) => typeof n === 'number') ? x.map((n: number, i: number) => n + v[i]!) : shiftPose(x, v)])) : p;
  it('A6 mutation: for each contact fact, its pose\'s body moved 2 cm turns that fact red and no fact of another pose', () => {
    for (const id of specsDrawn()) FACTS[id]!.forEach((f, i) => {
      if (f.kind !== 'contact') return;
      const s = S[id], v = [0, 0.02, 0.02];
      const red = h6({ ...s, poses: { ...s.poses, [f.pose]: shiftPose(s.poses[f.pose], v) } }, research(id)).filter((x: string) => x.includes(':contact:'));
      expect(red, `${id} ${f.pose} ${f.landmark}`).toContain(`H6.fact:${i}:contact:${f.landmark}`);
      const others = FACTS[id]!.flatMap((g, j) => (g.kind === 'contact' && g.pose !== f.pose ? [`H6.fact:${j}:contact:${g.landmark}`] : []));
      expect(red.filter((x: string) => others.includes(x)), `${id} ${f.pose} ${f.landmark}`).toEqual([]);
    });
  });
  it('A6 mutations: an angle fact 3 deg off (dumbbell_front_raise\'s end sh.r.elev 93), and the card path removed, are red', () => {
    const s = S.dumbbell_front_raise, r = research('dumbbell_front_raise'), k = r.plateFacts.findIndex((f: any) => f.joint === 'sh.r.elev');
    expect(h6(s, { ...r, plateFacts: r.plateFacts.map((f: any, i: number) => (i === k ? { ...f, deg: 93 } : f)) })).toEqual([`H6.fact:${k}:angle:sh.r.elev`]);
    expect(h6(s, null)).toEqual(['H6:no-card']);
  });
  it('weighted_dip c8: the navel point lies inside the drawn start belt band (the contact fact\'s binding)', () => {
    const s = S.weighted_dip, cam = camOf(s), belt = itemsIn(s, 'start').items.find((i: any) => i.part === 'belt');
    const poly = eng.PRIMITIVES.poly(belt, cam)[0].poly, n = cam.P(lmOf(s, 'start').navel);
    expect(outside([poly], n)).toBeLessThanOrEqual(0.5);
    const lifted = { ...belt, pts: belt.pts.map((p: number[]) => [p[0], p[1]! + 0.06, p[2]]) };
    expect(outside([eng.PRIMITIVES.poly(lifted, cam)[0].poly], n)).toBeGreaterThan(0.5);
  });
});

describe('LIB-17 resistance_band_pull_apart (H; the band from poly, D-LIB17-BAND; held: D-LIB8-shrug, D-LIB17-SIZE): drawn facts', { timeout: T }, () => {
  const s = () => S.resistance_band_pull_apart;
  const elev = (a: any, pose: string, sd: string) => +/elev (-?[\d.]+)/.exec(a[pose][`sh.${sd}`])![1]!;
  it('c5, c4: both upper arms at shoulder elevation 90 (+-2) at start and end; c1, c7: the fists at shoulder height (+-1 cm); c1: hands wider than the shoulders at the start', () => {
    const a = rep(s()).angles;
    for (const pose of ['start', 'end']) for (const sd of ['l', 'r']) {
      expect(Math.abs(elev(a, pose, sd) - 90), `${pose} ${sd}`).toBeLessThanOrEqual(2);
      const l = lmOf(s(), pose);
      expect(Math.abs(l[`grip.${sd}`][1] - l[`shoulder.${sd}`][1]) * 100, `${pose} ${sd}`).toBeLessThanOrEqual(1);
    }
    const st = lmOf(s(), 'start');
    for (const sd of ['l', 'r']) expect(Math.abs(st[`grip.${sd}`][0]), sd).toBeGreaterThan(Math.abs(st[`shoulder.${sd}`][0]));
    // start: the arms straight ahead (the fists in front of the shoulders); end: out to the sides (the fists outside the elbows)
    for (const sd of ['l', 'r']) expect(st[`grip.${sd}`][2] - st[`shoulder.${sd}`][2], sd).toBeGreaterThan(0.5);
    const en = lmOf(s(), 'end');
    for (const sd of ['l', 'r']) expect(Math.abs(en[`grip.${sd}`][0]), sd).toBeGreaterThan(Math.abs(en[`elbow.${sd}`][0]));
  });
  it('c1, c5: the slight elbow bend in start and end on both arms (ELBOW_BEND, never straight)', () => {
    expect(slightProblems(s())).toEqual([]);
  });
  it('A15 mutation: the end right elbow set to 180 deg (straight) is red', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, elbow: { ...e.elbow, r: 0 } } } };
    expect(slightProblems(bad)).toEqual([expect.stringMatching(/^end: elbow\.r bend 0\.0 != 18$/)]);
  });
  const bandIn = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((i: any) => i.part === 'band');
  it('D-LIB17-BAND: one band in every pose, a `poly` of class eq-solid, BAND_T thick, its two ends at the two fists (+-1 px on screen)', () => {
    const cam = camOf(s()), T0 = M.resistance_band_pull_apart.SIZES.BAND_T;
    for (const pose of posesOf(s())) {
      const b = bandIn(s(), pose);
      expect(b.length, pose).toBe(1);
      expect([b[0].type, b[0].cls], pose).toEqual(['poly', 'eq-solid']);
      const l = lmOf(s(), pose), P = b[0].pts.map((p: number[]) => cam.P(p)), mid = (i: number, j: number) => [(P[i]![0]! + P[j]![0]!) / 2, (P[i]![1]! + P[j]![1]!) / 2];
      const [gr, gl] = [cam.P(l['grip.r']), cam.P(l['grip.l'])];
      expect(Math.hypot(mid(0, 3)[0]! - gr![0]!, mid(0, 3)[1]! - gr![1]!), `${pose} grip.r`).toBeLessThanOrEqual(1);
      expect(Math.hypot(mid(1, 2)[0]! - gl![0]!, mid(1, 2)[1]! - gl![1]!), `${pose} grip.l`).toBeLessThanOrEqual(1);
      expect(Math.abs(Math.hypot(P[0]![0]! - P[3]![0]!, P[0]![1]! - P[3]![1]!) - T0 * cam.pxm), pose).toBeLessThanOrEqual(0.1);
    }
  });
  it('the band moves into the Mistake with the shrug and is drawn there (a `poly`, PQ-H9); mutation: the band as a `line` is missing from the Mistake view', () => {
    const cam = camOf(s()), want = eng.PRIMITIVES.poly(bandIn(s(), 'mistake')[0], cam)[0].poly as number[][];
    const drawnInMistake = (spec: any) => [...plate.renderPlate(spec, { id: 'x', mistake: true }).svg.matchAll(/<path id="x-m-eq\d+" d="([^"]+)"\/>/g)]
      .map(m => xy(m[1]!)).some(d => d.length === want.length && d.every((p, i) => Math.hypot(p[0]! - want[i]![0]!, p[1]! - want[i]![1]!) <= 0.6));
    expect(drawnInMistake(s())).toBe(true);
    const asLine = withEq(s(), 1, () => (lm: any) => { const it = M.resistance_band_pull_apart.bandOf(lm); return { type: 'line', pts: [...it.pts, it.pts[0]], cls: 'eq-line', z: it.z, part: 'band' }; });
    expect(drawnInMistake(asLine)).toBe(false);
  });
  it('c5 (D-LIB17-ORCHOICE: near the chest, not a contact): the end band runs in front of the chest, not through it', () => {
    const l = lmOf(s(), 'end'), b = bandIn(s(), 'end')[0];
    expect(b.pts[0][2] - l.chest[2]).toBeGreaterThan(0);
  });
  it('c8 Mistake: only the scapulae change: both shoulders M_SHRUG cm higher (+-0.2 cm), the arm angles, hips and feet unchanged', () => {
    const E = lmOf(s(), 'end'), Mi = lmOf(s(), 'mistake'), k = M.resistance_band_pull_apart.SIZES.M_SHRUG;
    expect(Object.keys(s().mistake.pose)).toEqual(['scap']);
    for (const sd of ['l', 'r']) expect(Math.abs((Mi[`shoulder.${sd}`][1] - E[`shoulder.${sd}`][1]) * 100 - k), sd).toBeLessThanOrEqual(0.2);
    for (const key of ['hips', 'heel.l', 'heel.r']) expect(Math.hypot(...Mi[key].map((v: number, i: number) => v - E[key][i])), key).toBeLessThan(1e-6);
    const a = rep(s()).angles;
    for (const sd of ['l', 'r']) { expect(a.mistake[`sh.${sd}`]).toBe(a.end[`sh.${sd}`]); expect(a.mistake[`elbow.${sd}`]).toBe(a.end[`elbow.${sd}`]); }
  });
  it('the shrug tell sits on the Mistake shoulder\'s top outline (+-1.5 px), its arrow from the end shoulder upward', () => {
    const cam = camOf(s()), t = s().mistake.tells[0], l = lmOf(s(), 'mistake'), p = cam.P(l['shoulder.l']), at = [p[0]! + t.anchor.off[0], p[1]! + t.anchor.off[1]];
    expect(Math.abs(outside(shapesIn(s(), 'mistake').map((x: any) => x.poly), at))).toBeLessThanOrEqual(1.5);
    const g = s().mistake.guides[0];
    expect([g.kind, g.from.pose, g.to.pose]).toEqual(['arrow', 'end', 'mistake']);
  });
  it('held (D-LIB8-shrug, D-LIB17-SIZE, S2): the card-true shrug at M_SHRUG moves the figure under deviationMin; the Trace passes traceLenMin', () => {
    const env = pins().envelope, Rr = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), Rr), tr = markup.pathsOf(Rr.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0);
    console.log(`LIB-17 resistance_band_pull_apart held: engine deviation ${dev.toFixed(1)} px (min ${env.deviationMin}), Trace ${tr.toFixed(1)} px (min ${env.traceLenMin})`);
    expect(M.resistance_band_pull_apart.SIZES.M_SHRUG).toBe(5);
    expect(dev).toBeLessThan(env.deviationMin);
    expect(tr).toBeGreaterThanOrEqual(env.traceLenMin);
  });
  it('one tell, with its per-id record in DESIGN.md (D-LIB10-SKULL1; #290 6345185694)', () => {
    expect(s().mistake.tells.length).toBe(1);
    const d = readFileSync('tools/plates/library/lb7/DESIGN.md', 'utf8');
    expect(d).toMatch(/resistance_band_pull_apart \(bulk\): fault c8 \(the shrug\)[^\n]*\n?[^\n]*\n?[^\n]*no second visible sign stated, so one tell/);
  });
  it('phantoms (Q2 (c)): both start arms and the start band are redrawn dashed in the end layer, and only there', () => {
    const its = itemsIn(s(), 'end').items, arms = its.filter((i: any) => i.part === 'startArm');
    expect(arms.some((i: any) => i.pts[0][0] > 0) && arms.some((i: any) => i.pts[0][0] < 0)).toBe(true);
    expect(its.filter((i: any) => i.part === 'startBand').length).toBe(1);
    for (const i of [...arms, ...its.filter((x: any) => x.part === 'startBand')]) expect([i.type, i.cls]).toEqual(['line', 'eq-line m-line']);
    for (const pose of ['start', 'mistake']) expect(itemsIn(s(), pose).items.filter((i: any) => /^start/.test(i.part ?? '')).length, pose).toBe(0);
  });
  it('the elbow callouts meet the arm\'s lower outline from below (+-1.5 px), under the band', () => {
    const cam = camOf(s()), l = lmOf(s(), 'end'), polys = shapesIn(s(), 'end').map((x: any) => x.poly), P = bandIn(s(), 'end')[0].pts.map((p: number[]) => cam.P(p));
    for (const key of ['level', 'soft']) {
      const c = s().callouts.find((x: any) => x.key === key), p = cam.P(l[c.anchor.at]), at = [p[0]! + c.anchor.off[0], p[1]! + c.anchor.off[1]];
      expect(Math.abs(outside(polys, at)), key).toBeLessThanOrEqual(1.5);
      expect(at[1]!, key).toBeGreaterThan(Math.max(...P.map((q: number[]) => q[1]!)));
      expect(c.box.top, key).toBeGreaterThan(at[1]!);
    }
  });
});

describe('LIB-17 dumbbell_front_raise (H; the engine dumbbell, side view; Mistake: the hip swing, c12): drawn facts', { timeout: T }, () => {
  const s = () => S.dumbbell_front_raise, Z = () => M.dumbbell_front_raise.SIZES;
  /** Panel R1 (#299): the soft bend reads in the side view: at the top the drawn grip lies below the drawn
   *  shoulder-elbow line by at least 90% of the bend's offset (forearm-to-grip length x sin ELBOW_BEND), so the arm is
   *  never collinear and the elbow leads; at the start the bend shows the same way, forward of the upper arm's line. */
  const bendProblems = (spec: any) => (['start', 'end'] as const).flatMap(pose => {
    const cam = camOf(spec), l = lmOf(spec, pose), [a, e, g] = ['shoulder.r', 'elbow.r', 'grip.r'].map(k => cam.P(l[k]));
    const ux = e![0]! - a![0]!, uy = e![1]! - a![1]!, L = Math.hypot(ux, uy), side = ((g![0]! - a![0]!) * uy - (g![1]! - a![1]!) * ux) / L;
    const want = 0.9 * Math.hypot(g![0]! - e![0]!, g![1]! - e![1]!) * Math.sin(M.dumbbell_front_raise.SIZES.ELBOW_BEND * Math.PI / 180);
    const sign = pose === 'end' ? -1 : 1;   // end: the grip below the line (screen y down); start: forward of it
    return sign * side >= want ? [] : [`${pose}: the grip ${side.toFixed(1)} px off the shoulder-elbow line (want ${sign > 0 ? '' : '-'}${want.toFixed(1)})`];
  });
  it('R1: the soft bend is drawn in the side-view plane, the end arm never collinear, the elbow leading', () => {
    expect(bendProblems(s())).toEqual([]);
  });
  it('R1 mutation: the old across-the-body bend (ARM_ROT -90) makes the end arm collinear (red)', () => {
    const e = s().poses.end, bad = { ...s(), poses: { ...s().poses, end: { ...e, shoulder: { ...e.shoulder, rot: -90 } } } };
    expect(bendProblems(bad).some(p => p.startsWith('end:'))).toBe(true);
  });
  it('c8: both upper arms level at the top (shoulder elevation 90 +-2, the elbow at the shoulder\'s height +-1 cm) against the upright trunk', () => {
    const a = rep(s()).angles, E = lmOf(s(), 'end');
    for (const k of ['l', 'r']) {
      expect(Math.abs(+/elev (-?[\d.]+)/.exec(a.end[`sh.${k}`])![1]! - 90), k).toBeLessThanOrEqual(2);
      expect(Math.abs(E[`elbow.${k}`][1] - E[`shoulder.${k}`][1]) * 100, k).toBeLessThanOrEqual(1);
    }
    expect(a.end.tilt).toBe(0);
    expect(a.end.trunk).toBe(0);
  });
  it('c5: the elbows lead: the hand never above the elbow at the top', () => {
    const E = lmOf(s(), 'end');
    for (const k of ['l', 'r']) expect(E[`grip.${k}`][1], k).toBeLessThanOrEqual(E[`elbow.${k}`][1]);
  });
  it('c2: the soft elbow bend in start and end on both arms (ELBOW_BEND, never straight)', () => {
    expect(slightProblems(s())).toEqual([]);
  });
  it('A15 mutation: the end elbows set to 180 deg (straight) is red', () => {
    const bad = { ...s(), poses: { ...s().poses, end: { ...s().poses.end, elbow: 0 } } };
    expect(slightProblems(bad)).toEqual([expect.stringMatching(/^end: elbow\.l bend 0\.0 != 18$/), expect.stringMatching(/^end: elbow\.r bend 0\.0 != 18$/)]);
  });
  /** c1, c2 (DESIGN.md section 10): the drawn start dumbbell's back edge on the near thigh's drawn front outline at the
   *  dumbbell's height, within 1 cm (plate px). The start dumbbell is the end layer's dashed hex (the start layer drops
   *  moving equipment). */
  const thighLine = (spec: any) => {
    const cam = camOf(spec), hex = itemsIn(spec, 'end').items.find((it: any) => it.part === 'startDb');
    if (!hex) return ['no start dumbbell drawn'];
    const pts = hex.pts.map((w: number[]) => cam.P(w)), back = Math.min(...pts.map((p: number[]) => p[0]!));
    const cy = pts.slice(0, -1).reduce((a: number, p: number[]) => a + p[1]!, 0) / (pts.length - 1);
    const thigh = shapesIn(spec, 'start').find((x: any) => x.key === 'thigh.r').poly;
    let front = -Infinity;
    for (const [a, b] of segs([...thigh, thigh[0]])) if ((a![1]! - cy) * (b![1]! - cy) <= 0 && a![1] !== b![1]) front = Math.max(front, a![0]! + (b![0]! - a![0]!) * (cy - a![1]!) / (b![1]! - a![1]!));
    const gapCm = (back - front) / cam.pxm * 100;
    return Math.abs(gapCm) <= 1 ? [] : [`start dumbbell ${gapCm.toFixed(1)} cm off the front thigh line`];
  };
  it('c1, c2: the start dumbbell sits against the front of the near thigh (its back edge on the thigh line, +-1 cm), in front of the thigh', () => {
    expect(thighLine(s())).toEqual([]);
    const L = lmOf(s(), 'start');
    for (const k of ['l', 'r']) expect(L[`grip.${k}`][2], k).toBeGreaterThan(L[`hip.${k}`][2]);
  });
  it('mutation: the start shoulders flexed 6 deg more (the dumbbell off the thigh) is red', () => {
    const st = s().poses.start, bad = { ...s(), poses: { ...s().poses, start: { ...st, shoulder: { ...st.shoulder, flex: st.shoulder.flex + 6 } } } };
    expect(thighLine(bad)).toEqual([expect.stringMatching(/cm off the front thigh line$/)]);
  });
  /** c12 Mistake on drawn items: the hips M_HIP forward over planted feet, the trunk leaning back, and the drawn
   *  Mistake dumbbell above the end one (the swing). */
  const swingProblems = (spec: any) => {
    const E = lmOf(spec, 'end'), Mi = lmOf(spec, 'mistake'), out: string[] = [];
    if (Math.abs((Mi.hips[2] - E.hips[2]) - Z().M_HIP) > 0.005) out.push(`hips ${((Mi.hips[2] - E.hips[2]) * 100).toFixed(1)} cm forward`);
    for (const k of ['heel.l', 'ball.l', 'heel.r', 'ball.r']) if (Math.hypot(...Mi[k].map((v: number, i: number) => v - E[k][i])) > 0.005) out.push(`${k} moved`);
    if (!(Mi.shoulders[2] < Mi.hips[2])) out.push('no lean back');
    const cam = camOf(spec), db = (pose: string) => itemsIn(spec, pose).items.find((it: any) => it.type === 'dumbbell');
    if (!(cam.P(db('mistake').at)[1]! < cam.P(db('end').at)[1]! - 6)) out.push('the Mistake dumbbell not above the end one');
    return out;
  };
  it('c12, c13 Mistake: the hips pushed forward M_HIP over planted feet, the trunk back, the dumbbells swung above the end pose', () => {
    expect(swingProblems(s())).toEqual([]);
  });
  it('mutation: the Mistake with the hips not pushed forward (the root at the end pose) is red', () => {
    const m = s().mistake, bad = { ...s(), mistake: { ...m, pose: { root: { ...m.pose.root, at: s().poses.end.root.at } } } };
    expect(swingProblems(bad)).toContain('hips 0.0 cm forward');
  });
  it('PQ-H3 at the ruled sizes: the Mistake and the Trace pass; values logged', () => {
    const R = { normal: plate.renderPlate(s(), { id: 'x' }), mistake: plate.renderPlate(s(), { id: 'x', mistake: true }) };
    const dev = qaNode.deviation({ spec: s() }, Eng(), R), tr = markup.pathsOf(R.normal.svg, 'trace').reduce((a: number, d: string) => a + markup.pathLength(d), 0);
    console.log(`dumbbell_front_raise: deviation ${dev.toFixed(1)} px, trace ${tr.toFixed(1)} px`);
    expect(dev).toBeGreaterThanOrEqual(11.39);
    expect(tr).toBeGreaterThanOrEqual(22.11);
  });
});

describe('LIB-17 face_pull (H; the rope on main\'s eq/rope.mjs, the eye-height pulley, side view): drawn facts', { timeout: T }, () => {
  const s = () => S.face_pull, F = () => M.face_pull.FP;
  it('c3: the start arms extended toward the pulley (elbow bend START_ELBOW +-1), the grips on the shoulder-to-pulley line (+-2 cm); the cable CABLE_START from the pulley to the rope', () => {
    const l = lmOf(s(), 'start'), P = F().pulley;
    for (const side of ['l', 'r']) expect(180 - angle3(l[`shoulder.${side}`], l[`elbow.${side}`], l[`grip.${side}`]), side).toBeCloseTo(M.face_pull.SIZES.START_ELBOW, 0);
    const sh = l['shoulder.r'], g = l['grip.r'], u = [P[1]! - sh[1], P[2]! - sh[2]], k = Math.hypot(...u), v = [g[1] - sh[1], g[2] - sh[2]];
    expect(Math.abs(u[0]! * v[1]! - u[1]! * v[0]!) / k).toBeLessThanOrEqual(0.02);
    const col = itemsIn(s(), 'start').items.find((i: any) => i.type === 'cableColumn');
    expect(Math.hypot(...col.to.map((x: number, i: number) => x - P[i]!))).toBeCloseTo(M.face_pull.SIZES.CABLE_START, 2);
  });
  it('c1: the pulley at eye height (the ear landmark, +-1 cm)', () => {
    expect(Math.abs(F().pulley[1] - lmOf(s(), 'end').ear[1])).toBeLessThanOrEqual(0.01);
  });
  it('c5, c7: at the end the hands are by the ears at eye level (+-1 cm in height, within 5 cm front to back), the rope ends apart', () => {
    const l = lmOf(s(), 'end');
    for (const side of ['l', 'r']) {
      expect(Math.abs(l[`grip.${side}`][1] - l.ear[1]), side).toBeLessThanOrEqual(0.01);
      expect(Math.abs(l[`grip.${side}`][2] - l.ear[2]), side).toBeLessThanOrEqual(0.05);
    }
    expect(Math.abs(l['grip.l'][0] - l['grip.r'][0])).toBeGreaterThan(2 * M.face_pull.SIZES.GRIP_X0 + 0.1);
  });
  /** c5, c9: the elbows high (above the shoulder line) and wide (out past the shoulders) at the end. */
  const highProblems = (spec: any) => {
    const l = lmOf(spec, 'end'), out: string[] = [];
    for (const side of ['l', 'r']) {
      if (!(l[`elbow.${side}`][1] > l[`shoulder.${side}`][1])) out.push(`elbow.${side} not above the shoulder`);
      if (!(Math.abs(l[`elbow.${side}`][0]) > Math.abs(l[`shoulder.${side}`][0]))) out.push(`elbow.${side} not wide`);
    }
    return out;
  };
  it('c5, c9: the end elbows high and wide; mutation: the end drawn with the Mistake\'s arms (elbows dropped) is red', () => {
    expect(highProblems(s())).toEqual([]);
    const bad = { ...s(), poses: { ...s().poses, end: { ...s().poses.end, ...s().mistake.pose } } };
    expect(highProblems(bad).filter(p => /not above/.test(p)).length).toBe(2);
  });
  it('Do 7: the end elbows read as bent (inside 150 or less); mutation: the end arms straightened toward the pulley is red', () => {
    expect(bentProblems(s())).toEqual([]);
    const e = s().poses.end, st = s().poses.start;
    expect(bentProblems({ ...s(), poses: { ...s().poses, end: { ...e, reach: { l: { ...st.reach.l, at: st.reach.l.at.map((v: number, i: number) => v + [0, 0, 0.05][i]!) }, r: { ...st.reach.r, at: st.reach.r.at.map((v: number, i: number) => v + [0, 0, 0.05][i]!) } } } } }).length).toBeGreaterThan(0);
  });
  it('c9, c10 Mistake: only the arms change; the elbows M_DROP below the end shoulder line (+-1 cm) and the hands at the chin\'s height (+-1 cm)', () => {
    expect(Object.keys(s().mistake.pose)).toEqual(['reach']);
    const l = lmOf(s(), 'mistake'), e = lmOf(s(), 'end');
    for (const side of ['l', 'r']) {
      expect(Math.abs(l[`elbow.${side}`][1] - (e[`shoulder.${side}`][1] - M.face_pull.SIZES.M_DROP)), side).toBeLessThanOrEqual(0.01);
      expect(Math.abs(l[`grip.${side}`][1] - e.chin[1]), side).toBeLessThanOrEqual(0.01);
    }
  });
  it('c4: the body still: root, trunk, neck and feet the same in start, end and Mistake', () => {
    const pick = (p: any) => JSON.stringify([p.root, p.trunk, p.neck, p.plant]);
    expect(pick(fullPose(s(), 'start'))).toBe(pick(s().poses.end));
    expect(pick(fullPose(s(), 'mistake'))).toBe(pick(s().poses.end));
  });
  it('the rope: two strands from the ferrule, each ending at its fist (stopper within 7 cm of the grip), in every pose; poly, so drawn in the Mistake', () => {
    for (const pose of posesOf(s())) {
      const { items, lm } = itemsIn(s(), pose), strands = items.filter((i: any) => i.part === 'rope' && i.type === 'poly' && i.curve);
      expect(strands.length, pose).toBe(2);
      for (const side of ['l', 'r']) expect(Math.min(...strands.map((st: any) => Math.min(...st.pts.map((q: number[]) => Math.hypot(...q.map((v, i) => v - lm[`grip.${side}`][i]!)))))), `${pose} ${side}`).toBeLessThanOrEqual(0.07);
    }
  });
  it('phantom (Q2 (c)): the start rope (dropped from the start layer) is redrawn dashed in the end layer only', () => {
    expect(itemsIn(s(), 'end').items.filter((i: any) => i.part === 'startRope' && i.cls === 'eq-line m-line').length).toBe(1);
    expect(itemsIn(s(), 'mistake').items.some((i: any) => i.part === 'startRope')).toBe(false);
  });
});
