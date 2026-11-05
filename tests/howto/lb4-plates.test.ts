// LIB-14 (lib-14-card Do 2, Do 4, Do 5, Do 6 a; acceptance A2, A3, A4, A5, A8, A9, A10, A11, A15; rulings D-LIB14-*):
// the LB4 build-ahead plates. Node only: the browser half of the plate QA runs in tools/plates/library/lb4/qa.mjs.
// Patterns copied from tests/howto/lb3-plates.test.ts (#274 @ a6f4bd07). Every test reads what is drawn (the items a
// spec emits, the engine's landmarks and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { promisify } from 'node:util';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
// F-VITEST-RPC (the LIB-22 A19 form in lb10-plates): one macrotask between tests, so runs of synchronous tests never
// block this worker's RPC to the runner for their summed time.
const yieldNow = () => new Promise<void>(r => setImmediate(r));
afterEach(yieldNow);
const LB4 = ['front_squat', 'goblet_squat', 'bodyweight_squat', 'wall_sit', 'step_up', 'pistol_squat', 'jump_squat',   // jump_squat: LIB-SMALL (LB4 resume 2)
  'forward_lunge', 'walking_lunge', 'bodyweight_lunge', 'bodyweight_split_squat', 'bulgarian_split_squat'];   // LIB-SPLIT (D-SPLIT-MODES)
const SPLIT = ['forward_lunge', 'walking_lunge', 'bodyweight_lunge', 'bodyweight_split_squat', 'bulgarian_split_squat'];
const IDS = LB4.map(i => `lib_${i}`);
// The LB4 ids not drawn here (DESIGN.md section 2; jump_squat left at LIB-SMALL, section 16; the 5 SPLIT rows left at
// LIB-SPLIT, section 17): the two pilot A plates, never in lb4/rows.json.
const NOT_HERE = ['reverse_lunge', 'box_jump'];
// Held: drawn and tested, no row (DESIGN.md section 13). LIB-STRIP (#309, main bec24ebd) released the other four of
// D-LIB14-NOSECS ('LIB-14 resume'); LIB-SPLIT released step_up (D-SPLIT-STEPUP) once reverse_lunge was pinned. None.
const HELD: string[] = [];
// The released no-seconds ids: their tempo is tempoOf(LIB-STRIP's verified rows), D-STRIP-B / D-STRIP-AFALL.
const RELEASED = ['front_squat', 'goblet_squat', 'bodyweight_squat', 'pistol_squat', 'jump_squat',   // jump_squat: LIB-SMALL (strip cards row, j9 and j7)
  'step_up', ...SPLIT];   // LIB-SPLIT: the strip cards rows (D-STRIP-ROWS)
// LIB-SHIP W5 (D-SHIP-MOVE): the LB4 rows moved into batches/lb04.json; lb4/rows.json is gone.
const ROWS = 'tools/plates/library/batches/lb04.json';
const RESEARCH_HEAD = '3812989f59c000705731f7944d7a1a275e86045d';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const SLICE = ['wall_sit', 'pistol_squat', 'front_squat'];
const TIER_A = ['front_squat', 'goblet_squat', 'pistol_squat'];

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, wallEq: any;
const M: Record<string, any> = {}, S: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, wallEq] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'eq/wall.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of LB4.filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`))) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
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
/** The ids whose spec exists and that are not held, in LB4 order (the rows.json set, A5). */
const drawn = () => LB4.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`) && !HELD.includes(id));
const specsDrawn = () => LB4.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`));

describe('LIB-14 A5: lb4/rows.json holds exactly the drawn, non-held LB4 ids, all mode H', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn, non-held id exactly once in the raw text, nothing else, every mode H (D-LIB14-MODES)', () => {
    expect(want()).toEqual(['lib_front_squat', 'lib_goblet_squat', 'lib_bodyweight_squat', 'lib_wall_sit', 'lib_step_up', 'lib_pistol_squat', 'lib_jump_squat',
      'lib_forward_lunge', 'lib_walking_lunge', 'lib_bodyweight_lunge', 'lib_bodyweight_split_squat', 'lib_bulgarian_split_squat']);
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('none of the 8 LB4 ids not drawn here is in any lb4/ file as a row', () => {
    for (const f of readdirSync('tools/plates/library/lb4').filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join('tools/plates/library/lb4', f), 'utf8');
      for (const id of NOT_HERE) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id}`).toBe(false);
    }
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file', () => {
    const design = readFileSync('tools/plates/library/lb4/DESIGN.md', 'utf8'), table = design.slice(design.indexOf('## 13. Held ids'));
    const lines = table.split('\n').filter(l => l.startsWith('| ') && /D-LIB14-(NOSECS|STEPUP)/.test(l));
    for (const id of HELD) {
      expect(lines.some(l => l.split('|')[1]!.split(',').map(x => x.trim()).includes(id)), id).toBe(true);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
      for (const f of reg.batchFiles()) expect(readFileSync(f, 'utf8').includes(`lib_${id}`), `${f}: ${id}`).toBe(false);
    }
  });
  it('mutations: a dropped row, a duplicated row, a held id added, box_jump added and one mode set to D are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const j = { batch: 'LB4', rows: { lib_wall_sit: row, lib_bodyweight_squat: row } }, w = ['lib_wall_sit', 'lib_bodyweight_squat'];
    const text = JSON.stringify(j, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: { lib_wall_sit: row } }, null, 1), w)).toEqual(['lib_bodyweight_squat x0']);
    const dup = text.replace('  "lib_wall_sit": {', `  "lib_wall_sit": ${JSON.stringify(row)},\n  "lib_wall_sit": {`);
    expect(a5(dup, w)).toEqual(['lib_wall_sit x2']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_pistol_squat: row } }, null, 1), w)).toEqual(['extra lib_pistol_squat']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_box_jump: row } }, null, 1), w)).toEqual(['extra lib_box_jump']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_wall_sit: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['mode D']);
  });
  it('LIB-SPLIT A1 mutations: step_up left in HELD with its row added, reverse_lunge added, one row set to T and a row duplicated are red', () => {
    const text = readFileSync(ROWS, 'utf8'), wantHeld = (held: string[]) => LB4.filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`) && !held.includes(i)).map(i => `lib_${i}`);
    expect(a5(text, wantHeld(['step_up']))).toEqual(['extra lib_step_up']);
    const j = readJson(ROWS), row = j.rows.lib_forward_lunge;
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_reverse_lunge: row } }, null, 1), want())).toEqual(['extra lib_reverse_lunge']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_walking_lunge: { ...row, mode: 'T' } } }, null, 1), want())).toEqual(['mode T']);
    expect(a5(text.replace('  "lib_bodyweight_lunge": {', `  "lib_bodyweight_lunge": ${JSON.stringify(row)},\n  "lib_bodyweight_lunge": {`), want())).toEqual(['lib_bodyweight_lunge x2']);
  });
  it('every row points at its own spec file and carries the census view; batch LB4, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB4', censusRef: '4a9fd86' });
  });
});

describe('LIB-14 A9: nothing ships (D-LIB14-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/wall_sit.mjs', slug: 'wall-sit', prefix: 'wall-sit', chromeId: 'wall-sit', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB4 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_wall_sit: { ...someRow, stage: 'shipped' } })).toEqual(['lib_wall_sit: shipped']);
    expect(stageProblems({ ...rows, lib_wall_sit: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_wall_sit: approved-plate']);
  });
  it('none of the 6 is shipped, even with lb4/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
    expect(reg.shippedIds().filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  /** An id or its slug as a whole token in a file's name or text. */
  const tokenHits = (ids: string[], name: string, text: string) => ids.flatMap(id => {
    const slug = id.replace(/_/g, '-'), s = `${name}\n${text}`, out: string[] = [];
    if (new RegExp(`\\b(lib_)?${id}\\b`).test(s)) out.push(`${name}: ${id}`);
    if (new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(s)) out.push(`${name}: ${slug}`);
    return out;
  });
  const batchProblems = (files: [string, string][]) => files.flatMap(([f, text]) => [
    ...(/lb4/i.test(f) ? [`${f}: an LB4 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB4"/.test(text) ? [`${f}: names batch LB4`] : []),
    ...tokenHits(LB4, f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB4 id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB4 id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB4 id, a page-only lb4.json and front-squat.layers.html are red', () => {
    const rowsText = JSON.stringify({ batch: 'LB4', rows: { lib_wall_sit: someRow } }, null, 1);
    expect(batchProblems([['zz.json', rowsText]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_pistol_squat"}']])).toEqual(['x.json: pistol_squat']);
    expect(batchProblems([['lb4.json', '{"entries":[{"kind":"page","batch":"LB4"}]}']]).length).toBe(2);
    expect(batchProblems([['front-squat.layers.html', '<div data-id="front-squat"></div>']])).toEqual(['front-squat.layers.html: front-squat']);
  });
  it('control: a file naming only lib_box_jump and lib_reverse_lunge (pilot A, not drawn here) stays green against the 6 drawn ids', () => {
    expect(tokenHits(LB4, 'p.json', '{"rows":{"lib_box_jump":{},"lib_reverse_lunge":{}}}')).toEqual([]);
    expect(tokenHits(LB4, 'p.json', '{"rows":{"lib_step_up":{}}}')).toEqual(['p.json: step_up']);
  });
  it('over exercises.json, no real id other than lib_<id> contains any of the 6', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    expect(ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))))).toEqual([]);
    for (const id of IDS) expect(ex, id).toContain(id);
  });
  it('no LB4 spec, composer, How-to or test imports anything under hands/', () => {
    const files = [...specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`), 'tools/plates/library/eq/wall.mjs',
      ...LB4.map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb4/build.mjs', 'tools/plates/library/lb4/qa.mjs', 'tests/howto/lb4-plates.test.ts'];
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/from\s+['"][^'"]*\/hands\/|import\(\s*[^)]*\/hands\//);
  });
  it('generate --check is green, and no generated file is read from lb4/, the LB4 specs, the wall composer or How-to sources (awaited child process)', async () => {
    // F-VITEST-RPC (#358 6552271304, the D-LIB13S-RPC form): generate's render runs in an awaited child process; the
    // same two checks per output, reported as one problem list.
    const script = `const gen = await import(${JSON.stringify(new URL('../../tools/plates/generate.mjs', import.meta.url).href)});
const ids = ${JSON.stringify(LB4)}, out = await gen.render(), bad = [];
for (const [p, { text }] of out) { if (/library\\/lb4\\/|eq\\/wall\\.mjs/.test(text)) bad.push(p + ': lb4/ or eq/wall.mjs');
  for (const id of ids) if (new RegExp('library/(specs|howto)/(lib_)?' + id + '\\\\b').test(text)) bad.push(p + ': ' + id); }
console.log(JSON.stringify({ diff: gen.diff(out), bad, n: out.size }));`;
    const t0 = Date.now(), { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
    const r = JSON.parse(stdout.trim().split('\n').pop()!);
    console.log(`LIB-14 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s (${r.n} outputs)`);
    expect(r.n).toBeGreaterThan(0);
    expect(r.diff).toEqual([]);
    expect(r.bad).toEqual([]);
  });
});

describe('LIB-14 A11 (Do 6 a): the 6 cards and quotes are byte copies of the LB4 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb4/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 6 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB4);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB4);
    for (const id of LB4) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('wall_sit'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.wall_sit);
  });
  it('the How-to source of each LB4 id holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of LB4) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});

describe('LIB-14 A2 / Do 4: the wall composer and the slice plates draw PRIMITIVES only', { timeout: T }, () => {
  it('the composer source imports no file reader and nothing under tools/plates/layers/', () => {
    const src = readFileSync('tools/plates/library/eq/wall.mjs', 'utf8');
    expect(src).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
    expect(src).not.toMatch(/layers\//);
  });
  it('every item the drawn specs draw is a PRIMITIVES type, in every drawn pose', () => {
    for (const id of specsDrawn()) for (const pose of posesOf(S[id]))
      for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
  });
  it('the drawn specs pass PQ-H9', () => {
    for (const id of specsDrawn()) expect(h9(S[id]), id).toEqual([]);
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.wall_sit;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the drawn specs with no engine issue and every check and contact within 0.5 cm', () => {
    for (const id of specsDrawn()) {
      const r = rep(S[id]);
      expect(r.issues ?? [], id).toEqual([]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-14 A2: the wall on wall_sit, per drawn pose (13.1)', { timeout: T }, () => {
  const PX = 146.29;
  /** The wall slab's face z in one pose: the backPad item the composer draws (its surface line is the face). */
  const faceOf = (spec: any, pose: string) => {
    const w = itemsIn(spec, pose).items.filter(it => it.type === 'backPad');
    expect(w.length, pose).toBe(1);
    const zs = w[0].surface.map((p: number[]) => p[2]);
    expect(Math.abs(zs[0] - zs[1]), `${pose}: face not vertical`).toBeLessThan(1e-9);
    return zs[0];
  };
  const wallProblems = (spec: any) => {
    const bad: string[] = [], f0 = faceOf(spec, 'end');
    for (const pose of posesOf(spec)) if (Math.abs(faceOf(spec, pose) - f0) * PX > 1) bad.push(`${pose}: wall face moved ${((faceOf(spec, pose) - f0) * PX).toFixed(1)} px`);
    return bad;
  };
  /** w4, w5 (D-LIB13-FACTS2): backUpper and buttock on the wall face (within 0.5 cm) in entry, held and Mistake. */
  const backProblems = (spec: any) => {
    const bad: string[] = [];
    for (const pose of posesOf(spec)) {
      const l = lmOf(spec, pose), f = faceOf(spec, pose);
      for (const k of ['backUpper', 'buttock']) if (Math.abs(l[k][2] - f) > 0.005) bad.push(`${pose}: ${k} ${((l[k][2] - f) * 100).toFixed(1)} cm off the wall`);
    }
    return bad;
  };
  it('the wall face sits at one fixed x (±1 px) in entry, held and Mistake; it stands on the floor, 1.9 m tall', () => {
    expect(wallProblems(S.wall_sit)).toEqual([]);
    expect(faceOf(S.wall_sit, 'end')).toBeCloseTo(M.wall_sit.WALL_Z, 9);
    const w = itemsIn(S.wall_sit, 'end').items.find(it => it.type === 'backPad'), ys = w.surface.map((p: number[]) => p[1]).sort();
    expect(ys[0]).toBeCloseTo(0, 9); expect(ys[1]).toBeCloseTo(wallEq.WALL.h, 9);
  });
  it('the back and buttocks touch the wall in every drawn pose (w4, w5)', () => {
    expect(backProblems(S.wall_sit)).toEqual([]);
  });
  it('mutation: the wall moved 2 cm in the Mistake is red', () => {
    const s = S.wall_sit, i = s.equipment.findIndex((e: any) => e.type === 'backPad');
    const moved = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === i ? (_: any, ctx: any) => wallEq.wall({ face: M.wall_sit.WALL_Z + (ctx.pose === 'mistake' ? 0.02 : 0) }) : e)) };
    expect(wallProblems(moved)).toEqual(['mistake: wall face moved 2.9 px']);
  });
  it('mutation: the back moved 2 cm off the wall in the held pose is red', () => {
    const s = S.wall_sit, e = s.poses.end, moved = { ...s, poses: { ...s.poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1], e.root.at[2] + 0.02] } } } };
    expect(backProblems(moved).filter(p => p.startsWith('end:'))).toEqual(['end: backUpper 2.0 cm off the wall', 'end: buttock 2.0 cm off the wall']);
  });
});

describe('LIB-14 wall_sit (H; hold convention): drawn facts', { timeout: T }, () => {
  const A = () => rep(S.wall_sit).angles;
  it('w2: in the held pose the knee is 90 deg and the hip flexion 90 deg (±2)', () => {
    expect(Math.abs(A().end['knee.r'] - 90)).toBeLessThanOrEqual(2);
    expect(Math.abs(+/flex (-?[\d.]+)/.exec(A().end['hip.r'])![1]! - 90)).toBeLessThanOrEqual(2);
  });
  it('w4: in the held pose the knee sits straight over the ankle (±1 cm), the shin vertical', () => {
    const l = lmOf(S.wall_sit, 'end');
    expect(Math.abs(l['knee.r'][2] - l['ankle.r'][2])).toBeLessThanOrEqual(0.01);
  });
  it('w2, w5 entry: standing (knee soft, at most 20 deg), the feet on the same floor spot as the held pose', () => {
    expect(A().start['knee.r']).toBeLessThanOrEqual(20);
    const a = lmOf(S.wall_sit, 'start'), b = lmOf(S.wall_sit, 'end');
    for (const k of ['heel.r', 'ball.r']) expect(Math.abs(a[k][2] - b[k][2]), k).toBeLessThanOrEqual(0.005);
  });
  it('w8 Mistake: the feet at least 20 cm nearer the wall, the hips held, the knee past the toes', () => {
    const e = lmOf(S.wall_sit, 'end'), m = lmOf(S.wall_sit, 'mistake');
    expect(e['heel.r'][2] - m['heel.r'][2]).toBeGreaterThanOrEqual(0.2);
    expect(Math.hypot(e['hip.r'][1] - m['hip.r'][1], e['hip.r'][2] - m['hip.r'][2])).toBeLessThanOrEqual(0.005);
    expect(m['knee.r'][2]).toBeGreaterThan(m['toe.r'][2]);
    expect(e['knee.r'][2]).toBeLessThan(e['toe.r'][2]);
  });
  it('the knee-over-ankle plumb datum runs through the held ankle, on the correct plate only', () => {
    const d = S.wall_sit.datum[0], l = lmOf(S.wall_sit, 'end');
    expect(d.x[2]).toBeCloseTo(l['ankle.r'][2], 9);
    expect(d.mistake).toBe(false);
  });
  it('w2: the knee arc is drawn at 90 deg (measure expect 90, drawn within 2 deg)', () => {
    const r = rep(S.wall_sit);
    expect(S.wall_sit.measure.expect).toBe(90);
    expect(Math.abs(r.measure.drawnDeg - 90)).toBeLessThanOrEqual(2);
  });
});

describe('LIB-14 pistol_squat (H; single leg; drawable false): drawn facts', { timeout: T }, () => {
  const A = () => rep(S.pistol_squat).angles;
  it('p3: the standing (near) foot flat on the floor at the start and the bottom (checks within 0.5 cm)', () => {
    const r = rep(S.pistol_squat);
    for (const pose of ['start', 'end']) for (const k of ['heel.r', 'ball.r']) {
      const c = r.checks.find((x: any) => x.landmark === k && x.pose === pose);
      expect(c?.cm, `${pose} ${k}`).toBeLessThanOrEqual(0.5);
    }
  });
  it('p2, p5: the free leg straight (knee 0) and off the floor in start, end and Mistake', () => {
    for (const p of ['start', 'end', 'mistake']) {
      expect(A()[p]['knee.l'], p).toBeLessThanOrEqual(0.5);
      const l = lmOf(S.pistol_squat, p);
      expect(Math.min(l['heel.l'][1], l['toe.l'][1]), p).toBeGreaterThan(0.02);
    }
  });
  it('p3: the standing knee deeply bent at the bottom (at least 130 deg), the hips back behind the heel', () => {
    expect(A().end['knee.r']).toBeGreaterThanOrEqual(130);
    const l = lmOf(S.pistol_squat, 'end');
    expect(l['hip.r'][2]).toBeLessThan(l['heel.r'][2]);
  });
  it('p1: the arms reach forward, level (wrist within 4 cm of shoulder height, ahead of the shoulder) in start and end', () => {
    for (const p of ['start', 'end']) {
      const l = lmOf(S.pistol_squat, p);
      expect(Math.abs(l['wrist.r'][1] - l['shoulder.r'][1]), p).toBeLessThanOrEqual(0.04);
      expect(l['wrist.r'][2] - l['shoulder.r'][2], p).toBeGreaterThan(0.4);
    }
  });
  it('p8 Mistake: the standing heel up, the knee at least 5 cm further forward (the weight over the ball)', () => {
    const e = lmOf(S.pistol_squat, 'end'), m = lmOf(S.pistol_squat, 'mistake');
    expect(m['heel.r'][1] - e['heel.r'][1]).toBeGreaterThanOrEqual(0.03);
    expect(m['knee.r'][2] - e['knee.r'][2]).toBeGreaterThanOrEqual(0.05);
  });
  /** The Mistake's standing foot outline (the engine's bodyShapes): its lowest point in px below the floor line. */
  const footSink = (spec: any) => {
    const b = { height: 1.75 }, c = rep(spec).camera, cam = { view: 'side', near: 'r', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
    const pose = { ...spec.poses.end, ...spec.mistake.pose };
    const foot = body.bodyShapes(body.fk(body.resolve(body.normPose(pose, b), b).q, b), cam).find((x: any) => x.key === 'foot.r');
    return Math.max(...foot.poly.map((q: number[]) => q[1]!)) - c.y0;
  };
  it('p8 Mistake (the slice look\'s item 1): the lifted foot\'s toe pad touches the floor line (±0.5 px), never under it; the heel rises 3.5 cm', () => {
    expect(Math.abs(footSink(S.pistol_squat))).toBeLessThanOrEqual(0.5);
    expect(lmOf(S.pistol_squat, 'mistake')['heel.r'][1]).toBeCloseTo(0.035, 4);
  });
  it('mutation: the slice\'s pitch with no toe lift (25 deg about the ball on the floor) sinks the toes through the floor (red)', () => {
    const s = S.pistol_squat, a = 25 * Math.PI / 180, r = s.mistake.pose.plant.r;
    const sunk = { ...s, mistake: { ...s.mistake, pose: { ...s.mistake.pose, plant: { r: { ...r, at: [r.at[0], 0, r.at[2]], normal: [0, Math.cos(a), Math.sin(a)], toe: [0, -Math.sin(a), Math.cos(a)] } } } } };
    expect(footSink(sunk)).toBeGreaterThan(0.5);
  });
  it('drawable false: the spec names the drawable-fault convention (F7 expected); tempo is the strip\'s word tempo, no seconds (D-STRIP-B)', () => {
    expect(S.pistol_squat.pilot.drawableFault).toMatch(/bouncing/);
    expect(S.pistol_squat.tempo).toEqual([{ phase: 'Lower', move: true, word: 'Slow' }, { phase: 'Drive up', move: true, word: 'Slow' }]);
  });
});

describe('LIB-14 front_squat (H; the 8\'s squat clone, the rack): drawn facts', { timeout: T }, () => {
  const bar = (p: string) => itemsIn(S.front_squat, p).items.find(it => it.type === 'barbell').at;
  it('c10: the bar over mid-foot (|z| ≤ 5 mm) in start and end', () => {
    for (const p of ['start', 'end']) expect(Math.abs(bar(p)[2]), p).toBeLessThanOrEqual(0.005);
  });
  it('c2, c3: the bar in the front rack, in front of the throat and over the front of the shoulders, in start and end', () => {
    for (const p of ['start', 'end']) {
      const l = lmOf(S.front_squat, p), b = bar(p);
      expect(b[2], p).toBeGreaterThan(l['shoulder.r'][2]);
      expect(b[1], p).toBeGreaterThan(l['shoulder.r'][1]);
      expect(b[1], p).toBeLessThan(l.chin[1]);
    }
  });
  it('c11: at the bottom the hip joint centre is below the knee centre', () => {
    const l = lmOf(S.front_squat, 'end');
    expect(l['hip.r'][1]).toBeLessThan(l['knee.r'][1]);
  });
  it('mutation (c11): the bottom hip 6 cm higher is red', () => {
    const s = S.front_squat, e = s.poses.end, up = { ...s, poses: { ...s.poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1] + 0.06, e.root.at[2]] } } } };
    const l = lmOf(up, 'end');
    expect(l['hip.r'][1] < l['knee.r'][1]).toBe(false);
  });
  it('c14: the spotter arm\'s top is 3-8 cm below the bar\'s underside at the bottom, and runs past the lifter front and back', () => {
    // sideBar draws a horizontal bar as a backPad whose surface line is its underside and whose body rises t above it
    const sb = itemsIn(S.front_squat, 'end').items.find(it => it.type === 'backPad');
    const top = Math.max(...sb.surface.map((p: number[]) => p[1])) + sb.t;
    const under = bar('end')[1] - 0.014;
    expect(under - top).toBeGreaterThanOrEqual(0.03);
    expect(under - top).toBeLessThanOrEqual(0.08);
    const zs = sb.surface.map((p: number[]) => p[2]), l = lmOf(S.front_squat, 'end');
    expect(Math.min(...zs)).toBeLessThan(l.buttock[2]);
    expect(Math.max(...zs)).toBeGreaterThan(l['knee.r'][2]);
  });
  it('c7 Mistake: the trunk tips at least 3 deg further forward, the elbow drops at least 10 cm, the hips held (no part the card does not name moves)', () => {
    const e = lmOf(S.front_squat, 'end'), m = lmOf(S.front_squat, 'mistake');
    const incl = (l: any) => Math.atan2(l.shoulders[2] - l.hips[2], l.shoulders[1] - l.hips[1]) * 180 / Math.PI;
    expect(incl(m) - incl(e)).toBeGreaterThanOrEqual(3);
    expect(e['elbow.r'][1] - m['elbow.r'][1]).toBeGreaterThanOrEqual(0.10);
    expect(Math.hypot(e['hip.r'][1] - m['hip.r'][1], e['hip.r'][2] - m['hip.r'][2])).toBeLessThanOrEqual(0.005);
  });
  it('c7 Mistake: the chest falls as far as the set safety allows (the bar 2 cm above the spotter arm, ±1 mm)', () => {
    const sb = itemsIn(S.front_squat, 'end').items.find(it => it.type === 'backPad'), top = Math.max(...sb.surface.map((p: number[]) => p[1])) + sb.t;
    expect(Math.abs(bar('mistake')[1] - 0.014 - top - 0.02)).toBeLessThanOrEqual(0.001);
  });
  /** The slice look's item 2: each elbow bent at most 150 deg and the two elbows apart, at least shoulder width. */
  const armProblems = (spec: any, poses: string[]) => poses.flatMap(p => {
    const a = rep(spec).angles[p], l = lmOf(spec, p), out: string[] = [];
    for (const s of ['l', 'r']) if (a[`elbow.${s}`] > 150) out.push(`${p}: elbow.${s} ${a[`elbow.${s}`]}`);
    if (Math.abs(l['elbow.l'][0] - l['elbow.r'][0]) < Math.abs(l['shoulder.l'][0] - l['shoulder.r'][0])) out.push(`${p}: elbows closer than the shoulders`);
    return out;
  });
  it('c3-c5 fingertip rack: each elbow bends at most 150 deg and the elbows sit at least shoulder width apart, in start and end', () => {
    expect(armProblems(S.front_squat, ['start', 'end'])).toEqual([]);
  });
  it('mutation: the slice\'s closed-grip rack (elbows folded 177 deg at the midline) is red', () => {
    const s = S.front_squat, fold = (p: any) => ({ ...p, hand: undefined, wrist: -70, reach: { l: { at: [0.25, p.reach.l.at[1], p.reach.l.at[2]], pole: [0, 0.3, 1] }, r: { at: [-0.25, p.reach.r.at[1], p.reach.r.at[2]], pole: [0, 0.3, 1] } } });
    expect(armProblems({ ...s, poses: { ...s.poses, start: fold(s.poses.start), end: fold(s.poses.end) } }, ['start', 'end']).length).toBeGreaterThan(0);
  });
  it('R2: the bar never passes through the spotter arm (its underside at least 1 cm above the arm\'s top in every pose)', () => {
    const sb = itemsIn(S.front_squat, 'end').items.find(it => it.type === 'backPad'), top = Math.max(...sb.surface.map((p: number[]) => p[1])) + sb.t;
    for (const p of ['start', 'end', 'mistake']) expect(bar(p)[1] - 0.014 - top, p).toBeGreaterThanOrEqual(0.01);
  });
  it('the start bar is redrawn as a dashed phantom in the end pose only (13 Q2 (c))', () => {
    const ph = (p: string) => itemsIn(S.front_squat, p).items.filter(it => it.part === 'startbar');
    expect(ph('end').length).toBe(1);
    expect(ph('start').length + ph('mistake').length).toBe(0);
  });
  it('tempo is the strip\'s word tempo, no seconds (D-STRIP-B; released from D-LIB14-NOSECS)', () => {
    expect(S.front_squat.tempo).toEqual([{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true }]);
  });
});

describe('LIB-14 bulk (LB4 BULK GO, 6341498444): bodyweight_squat, goblet_squat, step_up drawn facts', { timeout: T }, () => {
  const A = (id: string) => rep(S[id]).angles;
  const fromV = (a: number[], b: number[]) => Math.atan2(b[2]! - a[2]!, b[1]! - a[1]!) * 180 / Math.PI;
  /** The Mistake's foot outline (bodyShapes) lowest point, px below the floor line. */
  const sink = (spec: any, key: string) => {
    const b = { height: 1.75 }, c = rep(spec).camera, cam = { view: 'side', near: 'r', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
    const f = body.bodyShapes(body.fk(body.resolve(body.normPose({ ...spec.poses.end, ...spec.mistake.pose }, b), b).q, b), cam).find((x: any) => x.key === key);
    return Math.max(...f.poly.map((q: number[]) => q[1]!)) - c.y0;
  };
  it('bodyweight_squat b4, b6: thighs parallel at the bottom (hip and knee centres level, ±1 cm); the torso parallel to the shin (±2 deg)', () => {
    const l = lmOf(S.bodyweight_squat, 'end');
    expect(Math.abs(l['hip.r'][1] - l['knee.r'][1])).toBeLessThanOrEqual(0.01);
    expect(Math.abs(fromV(l['hip.r'], l['shoulder.r']) - fromV(l['ankle.r'], l['knee.r']))).toBeLessThanOrEqual(2);
  });
  it('bodyweight_squat b6 mutation: the bottom thorax 10 deg further forward breaks the parallel (red)', () => {
    const s = S.bodyweight_squat, e = s.poses.end, tipped = { ...s, poses: { ...s.poses, end: { ...e, root: { ...e.root, tilt: e.root.tilt + 10 } } } };
    const l = lmOf(tipped, 'end');
    expect(Math.abs(fromV(l['hip.r'], l['shoulder.r']) - fromV(l['ankle.r'], l['knee.r']))).toBeGreaterThan(2);
  });
  it('bodyweight_squat b4 Mistake: both heels 3.5 cm up, the toe pads on the floor line (±0.5 px), the knee forward', () => {
    const e = lmOf(S.bodyweight_squat, 'end'), m = lmOf(S.bodyweight_squat, 'mistake');
    expect(m['heel.r'][1]).toBeCloseTo(0.035, 4);
    expect(Math.abs(sink(S.bodyweight_squat, 'foot.r'))).toBeLessThanOrEqual(0.5);
    expect(m['knee.r'][2] - e['knee.r'][2]).toBeGreaterThanOrEqual(0.03);
  });
  it('goblet_squat g4: at the bottom the hip joint centre is below the knee centre', () => {
    const l = lmOf(S.goblet_squat, 'end');
    expect(l['hip.r'][1]).toBeLessThan(l['knee.r'][1]);
  });
  const db = (p: string) => itemsIn(S.goblet_squat, p).items.find((it: any) => it.type === 'dumbbell');
  it('goblet_squat g1, g2, g5: the dumbbell upright, directly in front of the chest (its back face 0-2 cm off), at chest height, in start and end', () => {
    for (const p of ['start', 'end']) {
      const d = db(p), l = lmOf(S.goblet_squat, p), back = d.at[2] - 0.119 * 0.866 / 2;
      expect(d.axis, p).toEqual([0, 1, 0]);
      expect(back - l.chest[2], p).toBeGreaterThanOrEqual(0);
      expect(back - l.chest[2], p).toBeLessThanOrEqual(0.02);
      expect(d.at[1], p).toBeGreaterThan(l.navel[1]);
      expect(d.at[1], p).toBeLessThan(l['shoulder.r'][1]);
    }
  });
  /** Elbow bend at most 150 deg (the slice look's item 2, carried to goblet_squat) and the elbows by the ribs (g2): apart, never at the midline, and within 15 cm of the shoulders' width. */
  const gobletArms = (spec: any) => ['start', 'end'].flatMap(p => {
    const a = rep(spec).angles[p], l = lmOf(spec, p), sp = Math.abs(l['elbow.l'][0] - l['elbow.r'][0]), sh = Math.abs(l['shoulder.l'][0] - l['shoulder.r'][0]), out: string[] = [];
    for (const k of ['l', 'r']) if (a[`elbow.${k}`] > 150) out.push(`${p}: elbow.${k} ${a[`elbow.${k}`]}`);
    if (sp < 0.30 || sp > sh + 0.15) out.push(`${p}: elbow spacing ${sp.toFixed(3)}`);
    if (l['elbow.r'][1] > l['shoulder.r'][1] - 0.2) out.push(`${p}: elbow not down by the ribs`);
    return out;
  });
  it('goblet_squat g2: each elbow bends at most 150 deg and the elbows hang down by the ribs, apart', () => {
    expect(gobletArms(S.goblet_squat)).toEqual([]);
  });
  it('goblet_squat mutation: the hands cupped at the midline with the elbows pulled in (pole straight down and in) is red', () => {
    const s = S.goblet_squat, pin = (p: any) => ({ ...p, reach: { l: { ...p.reach.l, pole: [-1, -0.2, 0] }, r: { ...p.reach.r, pole: [1, -0.2, 0] } } });
    expect(gobletArms({ ...s, poses: { ...s.poses, start: pin(s.poses.start), end: pin(s.poses.end) } }).length).toBeGreaterThan(0);
  });
  it('goblet_squat g6 Mistake: the thorax at least 15 deg further forward, the dumbbell at least 8 cm further from the chest, the hips held', () => {
    const e = lmOf(S.goblet_squat, 'end'), m = lmOf(S.goblet_squat, 'mistake');
    expect(fromV(m.hips, m.shoulders) - fromV(e.hips, e.shoulders)).toBeGreaterThanOrEqual(15);
    expect((db('mistake').at[2] - m.chest[2]) - (db('end').at[2] - e.chest[2])).toBeGreaterThanOrEqual(0.08);
    expect(Math.hypot(e['hip.r'][1] - m['hip.r'][1], e['hip.r'][2] - m['hip.r'][2])).toBeLessThanOrEqual(0.005);
  });
  it('step_up c1, c6: the whole lead foot on the box top in both poses; the trailing foot flat on the floor at the step position and clear of the box when standing tall', () => {
    const r = rep(S.step_up);
    for (const [k, p] of [['heel.r', 'start'], ['ball.r', 'start'], ['heel.r', 'end'], ['ball.r', 'end'], ['heel.l', 'end'], ['ball.l', 'end']]) {
      const c = r.checks.find((x: any) => x.landmark === k && x.pose === p && x.cm != null);
      expect(c?.cm, `${p} ${k}`).toBeLessThanOrEqual(0.5);
    }
    const l = lmOf(S.step_up, 'start');
    expect(Math.min(l['heel.l'][1], l['toe.l'][1])).toBeGreaterThan(0.45);
  });
  it('step_up c6, c7: the torso upright in both poses (hip-to-shoulder line within 10 deg of vertical)', () => {
    for (const p of ['start', 'end']) { const l = lmOf(S.step_up, p); expect(Math.abs(fromV(l.hips, l.shoulders)), p).toBeLessThanOrEqual(10); }
  });
  it('step_up c1 Mistake: the trunk at least 25 deg further forward with the hips held; the trailing heel up 3.5 cm on its toe pad (±0.5 px)', () => {
    const e = lmOf(S.step_up, 'end'), m = lmOf(S.step_up, 'mistake');
    expect(fromV(m.hips, m.shoulders) - fromV(e.hips, e.shoulders)).toBeGreaterThanOrEqual(25);
    expect(Math.hypot(e['hip.r'][1] - m['hip.r'][1], e['hip.r'][2] - m['hip.r'][2])).toBeLessThanOrEqual(0.005);
    expect(m['heel.l'][1]).toBeCloseTo(0.035, 4);
    expect(Math.abs(sink(S.step_up, 'foot.l'))).toBeLessThanOrEqual(0.5);
  });
});

describe('LIB-14 A8: the hold (D-LIB14-STEPUP; D-LIB14-NOSECS released for the other four; LIB-SPLIT released step_up)', { timeout: T }, () => {
  // LIB-SPLIT (D-SPLIT-STEPUP): no id is held, so the held-row page mutation (a held spec has no tempo, so its card
  // fails the extractor) has no subject; the A5 mutation 'step_up left in HELD with its row added' replaces it.
  it('no id is held: the test list and build.mjs HELD are empty, and every LB4 spec that exists has its row', async () => {
    const build = await import(/* @vite-ignore */ lib('lb4/build.mjs'));
    expect(HELD).toEqual([]);
    expect(build.HELD).toEqual([]);
    expect(build.heldData().rows).toEqual({});
    const keys = Object.keys(readJson(ROWS).rows);
    for (const id of specsDrawn()) expect(keys.filter(k => k === `lib_${id}`).length, id).toBe(1);
  });
  it('D-SPLIT-HELDEMPTY: held-pairing.json lists no id; mutation (e) on the empty list still gives exactly one ruling-less problem (the barbell_row stand-in)', async () => {
    const hp = await import('./held-pairing');
    expect(hp.HELD).toEqual([]);
    expect(hp.E_ID).toBe('barbell_row');
    expect(hp.mutationE([])).toEqual(['held[0] (barbell_row) has no ruling']);
    expect(hp.mutationE([{ id: 'step_up', ruling: 'x' }])).toEqual(['held[0] (step_up) has no ruling']);   // a listed id: its own entry, as before
  });
  it('every row resolves through candidateOf on the page built from rows.json (awaited child process)', async () => {
    const [build, cand, golden] = await Promise.all(['lb4/build.mjs', 'candidate.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    const mirror = golden.makeMirror(), E = await qaEng.loadEngine(mirror);
    try {
      const ids = Object.keys(readJson(ROWS).rows), clean = await lb4BuildInChild(`return (await b.buildLb4Page({ all: b.lb4All(), ids: ${JSON.stringify(ids)} })).html;`);
      for (const id of ids) await expect(cand.candidateOf(id, { all: build.lb4All(), platesHtml: clean, engine: E, authoring: true }), id).resolves.toBeTruthy();
    } finally { qaEng.dropMirror(mirror); }
  });
});

describe('LIB-14 slice Mistakes, tells, cues, callouts and tempo (DESIGN.md sections 8-9)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { front_squat: 'elbows', goblet_squat: 'lean', bodyweight_squat: 'heels', wall_sit: 'feet', step_up: 'lean', pistol_squat: 'heel', jump_squat: 'straight',
    forward_lunge: 'knee', walking_lunge: 'chest', bodyweight_lunge: 'knee', bodyweight_split_squat: 'knee', bulgarian_split_squat: 'knee' };   // LIB-SPLIT (DESIGN.md 17.2; bulgarian 17.11)
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each drawn plate draws its Mistake with 2-3 tells, the first carrying the proposed key', () => {
    const ONE_TELL = ['bulgarian_split_squat'];   // D-SPLIT-BSSHOVER (#364 6592673388): one tell, on the resting rear knee, exactly 1
    for (const id of specsDrawn()) { expect(keyProblems(S[id])).toEqual([]); if (ONE_TELL.includes(id)) { expect(S[id].mistake.tells.length, id).toBe(1); continue; } expect(S[id].mistake.tells.length, id).toBeGreaterThanOrEqual(2); expect(S[id].mistake.tells.length, id).toBeLessThanOrEqual(3); }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.wall_sit;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['wall_sit: first tell knees']);
  });
  const guideProblems = (spec: any) => spec.mistake.guides.filter((g: any) => !['dashed', 'arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('A15: every Mistake guide is dashed or an arrow; mutation: a solid line guide is red', () => {
    for (const id of specsDrawn()) expect(guideProblems(S[id])).toEqual([]);
    const s = S.wall_sit;
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: s.mistake.guides[0].pts }] } })).toEqual(['wall_sit: line']);
  });
  it('tempo: wall_sit carries the one Hold row \'30-60\' (w6, ASCII hyphen); every held spec carries none; no released spec carries seconds', () => {
    expect(S.wall_sit.tempo).toEqual([{ phase: 'Hold', s: '30-60' }]);
    expect(S.wall_sit.tempo[0].s).toBe('30-60');
    for (const id of HELD.filter(i => S[i])) expect(S[id].tempo, id).toBeUndefined();
    const phases: Record<string, number> = { forward_lunge: 3, bodyweight_lunge: 3 };   // LIB-SPLIT: Step, Lower, Rise (their strip rows)
    for (const id of RELEASED) { expect(S[id].tempo.length, id).toBe(phases[id] ?? 2); for (const t of S[id].tempo) expect('s' in t, id).toBe(false); }
    const q = readJson('docs/research/howto/quotes/wall_sit.json').quotes.filter((x: any) => x.claim === 'w6').map((x: any) => x.text).join(' ');
    expect(q).toContain(`${S.wall_sit.tempo[0].s}-second holds`);
  });
  /** Q-D5-6 cue table: every callout and tell cue is one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('A15 cue table: every cue is one sentence of 15 words or fewer; mutation: a 16-word cue is red', () => {
    for (const id of specsDrawn()) expect(cueProblems(S[id]), id).toEqual([]);
    const s = S.wall_sit;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Keep your whole back and both buttocks flat on the wall for the entire long hold.' }, ...s.callouts.slice(1)] })).toEqual(['back: 16 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of specsDrawn()) {
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
});

describe('LIB-14 A15: Mistake clearance, leaders clear of the wall and the Trace, and the tier-A R10 items (DESIGN.md section 7)', { timeout: T }, () => {
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
  const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
  /** 13.1, 13.4 must-fix 1: every solid red part (a Mistake arrow, as drawn in the Mistake svg) clears the solid end
   *  figure (the engine's bodyShapes at the plate's camera) by at least 6 px; the Mistake figure and other guides are dashed. */
  const clearance = (spec: any) => {
    const b = { height: 1.75 }, c = rep(spec).camera, cam = { view: 'side', near: 'r', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
    const polys = body.bodyShapes(body.fk(body.resolve(body.normPose(spec.poses.end, b), b).q, b), cam).filter((x: any) => x.poly).map((x: any) => x.poly);
    const svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
      const pts = [...m[1]!.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map(x => [+x[1]!, +x[2]!]), samp: number[][] = [];
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      return min >= 6 ? [] : [`${spec.id}: arrow ${min.toFixed(1)} px from the end figure`];
    });
  };
  it('every drawn plate: no solid red part comes within 6 px of the solid end figure (the slice draws dashed guides only)', () => {
    for (const id of specsDrawn()) expect(clearance(S[id]), id).toEqual([]);
  });
  it('mutation: an arrow from the held knee to the faulty knee on wall_sit (inside the figure\'s 6 px clearance) is red', () => {
    const s = S.wall_sit, guides = [...s.mistake.guides, { kind: 'arrow', from: { at: 'knee.r', pose: 'end' }, to: { at: 'knee.r', pose: 'mistake' } }];
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });

  const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
  /** The smallest gap (px) between any leader, away from its first 8 px, and the Trace, a drawn cable/line, or the wall face. */
  const minGap = (spec: any) => {
    let min = Infinity;
    for (const mistake of [false, true]) {
      const r = plate.renderPlate(spec, { id: 'x', mistake }), svg: string = r.svg, cam = r.report.camera;
      const P = (w: number[]) => [cam.x0 + w[2]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
      const avoid = [...svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      // the wall face, and the spotter arm's two long edges (its surface line and the line t above it)
      for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items.filter(i => i.type === 'backPad')) {
        avoid.push(it.surface.map(P));
        if (Math.abs(it.surface[0][1] - it.surface[1][1]) < 1e-9) avoid.push(it.surface.map((q: number[]) => P([q[0]!, q[1]! + it.t, q[2]!])));
      }
      for (const [, d] of svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)) {
        const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]);
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) min = Math.min(min, segD(q, g[0]!, g[1]!));
        }
      }
    }
    return min;
  };
  it('wall_sit and front_squat: no leader comes within 6 px of the wall face, the spotter arm or the Trace; mutation: a leader within 6 px of the wall is red', () => {
    expect(minGap(S.wall_sit)).toBeGreaterThanOrEqual(6);
    expect(minGap(S.front_squat)).toBeGreaterThanOrEqual(6);
    const s = S.wall_sit, c = rep(s).camera, x = c.x0 + M.wall_sit.WALL_Z * c.pxPerM;
    const bad = { ...s, callouts: [{ ...s.callouts[0], anchor: 'backUpper', box: { left: Math.round(x + 2), top: 60 } }, ...s.callouts.slice(1)] };
    expect(minGap(bad)).toBeLessThan(6);
  });

  /** The longest leader (its whole path, the label tail included) in the normal and Mistake renders, as PQ's leaderMax. */
  const leaderMax = (spec: any) => Math.max(...[false, true].flatMap(mistake => [...plate.renderPlate(spec, { id: 'x', mistake }).svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(m => {
    let x = 0, y = 0, t = 0;
    for (const c of m[1]!.matchAll(/([MLH])(-?[\d.]+)(?:[ ,](-?[\d.]+))?/g)) { const nx = +c[2]!, ny = c[1] === 'H' ? y : +c[3]!; if (c[1] !== 'M') t += Math.hypot(nx - x, ny - y); x = nx; y = ny; }
    return t;
  })));
  it('F3 (the slice look: no flag is planned): every drawn spec\'s longest leader sits inside the 8\'s range', () => {
    const [lo, hi] = pins().envelope.F3;
    for (const id of specsDrawn()) { const v = leaderMax(S[id]); expect(v >= lo && v <= hi, `${id} ${v.toFixed(1)}`).toBe(true); }
  });
  it('mutation: pistol_squat\'s "Free leg straight" label moved to the far top left (a leader past the 8\'s longest) is red', () => {
    // (At the slice, auto placement gave 84 px; after panel lb4p's via change auto placement lands inside the range, so the
    // mutation now moves the box itself.)
    const s = S.pistol_squat, moved = { ...s, callouts: s.callouts.map((c: any) => (c.key === 'leg' ? { ...c, box: { left: 20, top: 60 } } : c)) };
    expect(leaderMax(moved)).toBeGreaterThan(pins().envelope.F3[1]);
  });

  // R10 (DESIGN.md section 7): one drawn-item check per tier-A item, in the table's order.
  const lm = (id: string, p: string) => lmOf(S[id], p);
  const onCheck = (id: string, landmarks: string[], pose: string, cm = 0.5) => landmarks.flatMap(l => {
    const k = rep(S[id]).checks.filter((c: any) => c.landmark === l && c.pose === pose && c.cm != null);
    return k.length && k.every((c: any) => c.cm <= cm) ? [] : [`${pose}: ${l} ${k.map((c: any) => c.cm).join('/') || 'unchecked'}`];
  });
  const fsBar = (p: string) => itemsIn(S.front_squat, p).items.find((it: any) => it.type === 'barbell').at;
  const R10: Record<string, [string, () => string[]][]> = {
    front_squat: [
      ['rack upright with the safety bar just below the bottom bar height', () => {
        const it = itemsIn(S.front_squat, 'end').items, up = it.find((i: any) => i.type === 'rackUpright'), sb = it.find((i: any) => i.type === 'backPad');
        const gap = fsBar('end')[1] - 0.014 - (Math.max(...(sb?.surface ?? [[0, 9, 0]]).map((p: number[]) => p[1])) + (sb?.t ?? 0));
        return [...(up ? [] : ['no upright']), ...(gap >= 0.03 && gap <= 0.08 ? [] : [`safety gap ${gap.toFixed(3)} m`])];
      }],
      ['bar on the shoulders, not held up by the hands', () => ['start', 'end'].flatMap(p => { const l = lm('front_squat', p), b = fsBar(p); return b[1] > l['shoulder.r'][1] && b[2] > l['shoulder.r'][2] ? [] : [`${p}: bar not over the front of the shoulder`]; })],
      ['elbows high at the start and the bottom', () => ['start', 'end'].flatMap(p => { const l = lm('front_squat', p); return Math.abs(l['elbow.r'][1] - l['shoulder.r'][1]) <= 0.06 && l['elbow.r'][2] > l['shoulder.r'][2] + 0.15 ? [] : [`${p}: elbow not high and forward`]; })],
      ['whole foot down, heels on the floor', () => [...onCheck('front_squat', ['heel.r', 'ball.r'], 'start'), ...onCheck('front_squat', ['heel.r', 'ball.r'], 'end')]],
    ],
    goblet_squat: [
      ['dumbbell upright against the chest at the start and the bottom', () => ['start', 'end'].flatMap(p => { const d = itemsIn(S.goblet_squat, p).items.find((it: any) => it.type === 'dumbbell'), l = lm('goblet_squat', p), gap = d.at[2] - 0.119 * 0.866 / 2 - l.chest[2]; return JSON.stringify(d.axis) === '[0,1,0]' && gap >= 0 && gap <= 0.02 ? [] : [`${p}: dumbbell not upright at the chest`]; })],
      ['elbows close to the ribs', () => ['start', 'end'].flatMap(p => { const l = lm('goblet_squat', p); return l['elbow.r'][1] < l['shoulder.r'][1] - 0.2 && Math.abs(l['elbow.r'][0]) <= Math.abs(l['shoulder.r'][0]) + 0.075 ? [] : [`${p}: elbow not by the ribs`]; })],
      ['chest up', () => { const l = lm('goblet_squat', 'end'); return Math.atan2(l.shoulders[2] - l.hips[2], l.shoulders[1] - l.hips[1]) * 180 / Math.PI <= 35 ? [] : ['chest down']; }],
      ['heels on the floor', () => [...onCheck('goblet_squat', ['heel.r', 'ball.r'], 'start'), ...onCheck('goblet_squat', ['heel.r', 'ball.r'], 'end')]],
    ],
    pistol_squat: [
      ['free leg straight and off the floor in every pose', () => ['start', 'end', 'mistake'].flatMap(p => { const a = rep(S.pistol_squat).angles[p], l = lm('pistol_squat', p); return a['knee.l'] <= 0.5 && l['heel.l'][1] > 0.02 ? [] : [`${p}: free leg`]; })],
      ['standing foot flat at the bottom', () => onCheck('pistol_squat', ['heel.r', 'ball.r'], 'end')],
      ['arms forward for balance', () => ['start', 'end'].flatMap(p => { const l = lm('pistol_squat', p); return l['wrist.r'][2] - l['shoulder.r'][2] > 0.4 ? [] : [`${p}: arms not forward`]; })],
    ],
  };
  /** The tier-A rows of DESIGN.md section 7 whose spec exists, each with its number of items (split on '; '). */
  const tableItems = () => {
    const sec = readFileSync('tools/plates/library/lb4/DESIGN.md', 'utf8').split('## 7. R10')[1]!.split('\n## ')[0]!;
    return Object.fromEntries([...sec.matchAll(/^\| (\w+) \| (.+) \|$/gm)].filter(m => specsDrawn().includes(m[1]!)).map(m => [m[1]!, m[2]!.split('; ').length]));
  };
  const r10Problems = (reg: Record<string, [string, () => string[]][]>) => {
    const want = tableItems(), out: string[] = [];
    for (const [id, n] of Object.entries(want)) {
      if ((reg[id] ?? []).length !== n) out.push(`${id}: ${(reg[id] ?? []).length} checks for ${n} items`);
      for (const [name, f] of reg[id] ?? []) for (const p of f()) out.push(`${id} ${name}: ${p}`);
    }
    return out;
  };
  it('every tier-A drawn id has one passing drawn-item check per R10 item', () => {
    expect(Object.keys(tableItems()).sort()).toEqual(specsDrawn().filter(id => TIER_A.includes(id)).sort());
    expect(r10Problems(R10)).toEqual([]);
  });
  it('mutation: one tier-A R10 item removed is red', () => {
    expect(r10Problems({ ...R10, pistol_squat: R10.pistol_squat!.slice(1) })).toEqual(['pistol_squat: 2 checks for 3 items']);
  });
});

describe('LIB-14 D-LIB9-CLONE: each copied root finder throws on a bracket with no root', () => {
  it('the drawn slice specs', () => {
    for (const [id, f] of [['wall_sit', 'bracket'], ['pistol_squat', 'solve'], ['front_squat', 'solve']] as const) {
      expect(() => M[id][f]((x: number) => x - 5, 0, 1), id).toThrow(/no solution/);
      expect(M[id][f]((x: number) => x - 0.25, 0, 1), id).toBeCloseTo(0.25, 7);
    }
    expect(() => M.wall_sit.solve({ a: 0 }, (p: any) => [p.a * p.a + 1])).toThrow(/no solution/);
  });
});

describe('LIB-14 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
    ...c.filter(p => p.startsWith('tools/plates/library/templates/')),
  ];
  it('every drawn LB4 spec passes', () => {
    expect(files().length).toBeGreaterThanOrEqual(3);
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb4-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/wall_sit.mjs';
  it('mutation: readFileSync added to the wall composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/wall.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing a pilot A spec (another specs/ file) is red', () => {
    const root = scratch(r => {
      writeFileSync(join(r, 'tools/plates/library/specs/plank.mjs'), "export const solve = () => null;\nexport default {};\n");
      const p = join(r, F); writeFileSync(p, `import { solve as _s } from './plank.mjs';\n${readFileSync(p, 'utf8')}`);
    });
    try { expect(problems(F, closure.closureOf([F], root))).toEqual(['tools/plates/library/specs/plank.mjs']); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-14 A10: the LB4 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the LB4 rows are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb4/build.mjs'));
    expect(build.drawnIds()).toEqual(['lib_front_squat', 'lib_goblet_squat', 'lib_bodyweight_squat', 'lib_wall_sit', 'lib_pistol_squat', 'lib_jump_squat',
      'lib_step_up', 'lib_forward_lunge', 'lib_walking_lunge', 'lib_bodyweight_lunge', 'lib_bodyweight_split_squat', 'lib_bulgarian_split_squat']);   // LIB-SPLIT
    const a = await lb4BuildInChild('return (await b.buildLb4Page()).html;'), b = await lb4BuildInChild('return (await b.buildLb4Page()).html;');
    expect(sha(a)).toBe(sha(b));
  });
});

describe('LIB-14 A4: runQa node half on an LB4 plate (lib_wall_sit), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_wall_sit', cg = () => S.wall_sit;
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb4/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb4All();
    html = await lb4BuildInChild(`return (await b.buildLb4Page({ all: b.lb4All(), ids: [${JSON.stringify(ID)}] })).html;`);
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins: pins() });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb4-mut-')), file = join(dir, 'wall_sit.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/wall_sit.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const h = await lb4BuildInChild(`const bp = await import(lib('build-page.mjs')), cid = ${JSON.stringify(cid)};
        return (await bp.buildPlatesPage({ groups: [{ id: 'lb4', title: 'LB4', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: ${JSON.stringify(file)} } })).html;`);
      return { ...(await candOf(h)), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('A4: pistol_squat (in rows.json since the strip release) raises F7 on its node half; its topFault set to its drawn key drops F7, so the ruled expected set fails', async () => {
    const lb4qa = await import(/* @vite-ignore */ lib('lb4/qa.mjs'));
    const P = 'lib_pistol_squat', ph = await lb4BuildInChild(`return (await b.buildLb4Page({ all: b.lb4All(), ids: [${JSON.stringify(P)}] })).html;`);
    const c = await cand.candidateOf(P, { all, platesHtml: ph, engine: E, authoring: true });
    const asReport = (r: any) => ({ id: P, flags: { ...r.flags, F2: { raised: false }, F5: { raised: true, value: 3.57 } } });
    const clean = await qa(c);
    expect([node(clean), clean.flags.F7.raised]).toEqual([[], true]);
    expect(lb4qa.flagProblems([asReport(clean)])).toEqual([]);
    const bad = await qa({ ...c, research: { ...c.research, topFault: 'heel' } });
    expect(bad.flags.F7.raised).toBe(false);
    expect(lb4qa.flagProblems([asReport(bad)])).toEqual(['lib_pistol_squat: flags F5 != expected F5,F7']);
  });
  it('D-LIB14-F2: F2 is expected only on front_squat (0.141) and goblet_squat (0.174), at exactly those values', async () => {
    const lb4qa = await import(/* @vite-ignore */ lib('lb4/qa.mjs'));
    const r = (id: string, f2: number | null, f7 = false) => ({ id, flags: Object.fromEntries(qaIdx.FLAGS.map((f: string) => [f, { raised: false }])) as any, f2, f7 });
    const rep = (id: string, f2: number | null) => { const x = r(id, f2); x.flags.F5 = { raised: true, value: 3.57 }; if (f2 != null) x.flags.F2 = { raised: true, value: f2 }; return x; };
    expect(lb4qa.flagProblems([rep('lib_front_squat', 0.1408), rep('lib_goblet_squat', 0.1741), rep('lib_wall_sit', null)])).toEqual([]);
    expect(lb4qa.flagProblems([rep('lib_front_squat', null)])).toEqual(['lib_front_squat: flags F5 != expected F2,F5']);
    expect(lb4qa.flagProblems([rep('lib_wall_sit', 0.15)])).toEqual(['lib_wall_sit: flags F2,F5 != expected F5']);
    expect(lb4qa.flagProblems([rep('lib_goblet_squat', 0.16)])).toEqual(['lib_goblet_squat: F2 0.160 != the named 0.174']);
  });
  it('clean: no node-half problem, and the only raised flags wait on the browser half (F2, F5)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
    expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5'].includes(f))).toEqual([]);
  });
  it('A4 M1 a label 1 px onto the figure (the Back on wall callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg().callouts.find((x: any) => x.key === 'back'), at = (box: any) => ({ ...cg(), callouts: cg().callouts.map((x: any) => (x.key === 'back' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[-1, 0], [0, 1], [0, -1], [1, 0]]) {
      for (let d = 1; d <= 80 && !hit; d++) {
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
  it('A4 M2 a contact 1 cm off (the floor plane under the near heel moved 1.1 cm along its normal) turns PQ-H1 red', async () => {
    const shift = (s: any) => ({ ...s, checks: s.checks.map((k: any) => {
      if (k.landmark !== 'heel.r' || !k.plane) return k;
      const n = k.plane.normal, L = Math.hypot(...n);
      return { ...k, plane: { ...k.plane, point: k.plane.point.map((v: number, i: number) => v + n[i] / L * 0.011) } };
    }) });
    const c = { ...(await candOf()), spec: shift(cg()) };
    expect(node(await qa(c)).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A4 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = MUT('M3').prepare(E, cg(), pins().envelope);
    const c = await mutated('(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, mistake: { ...s.mistake, pose: {} } })');
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

describe('LIB-14 A11 and A6 (Do 6 b): the card fields, the ruled tempo map, the pose map and the plate facts', { timeout: T }, () => {
  // The ruled tempo table (D-LIB14-TEMPO, #289 6338977366; DESIGN.md section 8), copied from the ruling, never read from
  // tempo.json or a spec: wall_sit's one Hold row is w6's quote string. The four released no-seconds cards take
  // tempoOf(LIB-STRIP's verified rows) (D-STRIP-B, -AFALL; DESIGN.md section 8's released table), copied here from those
  // rows at main bec24ebd and also checked against them; step_up (held, D-LIB14-STEPUP) has no tempo key.
  const RULED_CONST = { wall_sit: { phase: 'Hold', constant: '30-60', claim: 'w6' } };
  const RULED_STRIP: Record<string, any[]> = {
    front_squat: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true }],
    goblet_squat: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true, word: 'Controlled' }],
    bodyweight_squat: [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }],
    pistol_squat: [{ phase: 'Lower', move: true, word: 'Slow' }, { phase: 'Drive up', move: true, word: 'Slow' }],
    jump_squat: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Jump', move: true, word: 'Explosive' }],   // LIB-SMALL
    // LIB-SPLIT (DESIGN.md 17.2): copied from strip/rows.json's verified cards rows on main
    step_up: [{ phase: 'Rise', move: true }, { phase: 'Lower', move: true, word: 'Controlled' }],
    forward_lunge: [{ phase: 'Step', move: true, word: 'Slow' }, { phase: 'Lower', move: true, word: 'Smooth' }, { phase: 'Rise', move: true }],
    walking_lunge: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Rise', move: true }],
    bodyweight_lunge: [{ phase: 'Step', move: true, word: 'Slow' }, { phase: 'Lower', move: true }, { phase: 'Rise', move: true }],
    bodyweight_split_squat: [{ phase: 'Lower', move: true, word: 'Smooth' }, { phase: 'Rise', move: true, word: 'Smooth' }],
    bulgarian_split_squat: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Stand', move: true }],
  };
  // The ruled pose map (D-LIB14-STEPUP-POSE; DESIGN.md section 9): the spec pose each card pose is drawn as.
  const POSE_MAP: Record<string, Record<string, string>> = Object.fromEntries(LB4.map(id => [id, id === 'step_up' ? { start: 'end', end: 'start' } : { start: 'start', end: 'end' }]));
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const quoteText = (id: string, claim: string) => readJson(`docs/research/howto/quotes/${id}.json`).quotes.filter((q: any) => q.claim === claim).map((q: any) => q.text).join(' ');
  const tempoProblems = (tj: any, cards: Record<string, any>, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not the ruled (empty) set');
    if (JSON.stringify(Object.keys(tj.ids)) !== JSON.stringify(['wall_sit'])) bad.push('ids: not wall_sit alone');
    const t = tj.ids.wall_sit, r = RULED_CONST.wall_sit;
    if (JSON.stringify(t?.rows?.map((x: any) => [x.phase, x.constant, x.claim])) !== JSON.stringify([[r.phase, r.constant, r.claim]])) bad.push('wall_sit: tempo.json rows != the ruled table');
    for (const x of t?.rows ?? []) {
      if (!quoteText('wall_sit', x.claim).includes(x.quote)) bad.push(`wall_sit: ${x.phase} quote is not w6's`);
      if (!x.quote.includes(`${x.constant}-second`)) bad.push(`wall_sit: ${x.phase} constant ${x.constant} is not the quote's string`);
    }
    for (const id of LB4) {
      const c = cards[id];
      if (id === 'wall_sit') {
        const want = (t?.rows ?? []).map((x: any) => ({ phase: x.phase, s: x.constant }));
        if (JSON.stringify(c.tempo) !== JSON.stringify(want)) bad.push('wall_sit: card tempo != the ruled row');
      } else if (RULED_STRIP[id]) {
        if (JSON.stringify(c.tempo) !== JSON.stringify(RULED_STRIP[id])) bad.push(`${id}: card tempo != the strip's ruled word tempo`);
      } else if ('tempo' in c) bad.push(`${id}: a tempo key while held`);
      if ((c.tempo ?? []).some((p: any) => ['Rest', 'Set'].includes(p.phase))) bad.push(`${id}: Set or Rest`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(c.tempo)) bad.push(`${id}: spec tempo != card tempo`);
    }
    return bad;
  };
  const clean = () => ({ tj: readJson('tools/plates/library/lb4/tempo.json'), cards: Object.fromEntries(LB4.map(id => [id, cardOf(id)])), specs: { ...S } as Record<string, any> });
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  it('tempo.json, every card tempo and every drawn spec tempo follow the ruled map', () => {
    const { tj, cards, specs } = clean();
    expect(tempoProblems(tj, cards, specs)).toEqual([]);
  });
  it('the released word tempos are tempoOf(strip/rows.json) for each id (cards, or fallbackA for bodyweight_squat), and each validates', async () => {
    const [strip, V] = await Promise.all(['strip/tempo-strip.mjs', 'research/validate.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    const R = readJson('tools/plates/library/strip/rows.json'), rowsOf = (id: string) => [...R.cards, ...R.fallbackA].find((c: any) => c.id === id)?.rows;
    for (const id of RELEASED) expect(strip.tempoOf(rowsOf(id)), id).toEqual(RULED_STRIP[id]);
    expect(R.fallbackA.map((c: any) => c.id)).toContain('bodyweight_squat');
    for (const id of LB4) expect(V.validateCardFile(`${id}.json`), id).toEqual([]);   // LIB-SPLIT: step_up's pairing marker retired with its hold
  });
  it('mutations: a Set or a Rest phase added to wall_sit (card and spec), the Hold constant as \'30–60\' (en dash), and seconds added to a no-seconds card and spec are each red', () => {
    const red = (f: (s: any) => void) => { const s: any = copy({ tj: clean().tj, cards: clean().cards }); s.specs = { ...clean().specs }; f(s); return tempoProblems(s.tj, s.cards, s.specs).length > 0; };
    const both = (s: any, id: string, tempo: any[]) => { s.cards[id].tempo = tempo; if (s.specs[id]) s.specs[id] = { ...s.specs[id], tempo }; };
    expect(red(s => both(s, 'wall_sit', [...s.cards.wall_sit.tempo, { phase: 'Rest', s: 30 }])), 'Rest').toBe(true);
    expect(red(s => both(s, 'wall_sit', [{ phase: 'Set', s: 5 }, ...s.cards.wall_sit.tempo])), 'Set').toBe(true);
    expect(red(s => { s.tj.ids.wall_sit.rows[0].constant = '30–60'; both(s, 'wall_sit', [{ phase: 'Hold', s: '30–60' }]); }), 'en dash').toBe(true);
    expect(red(s => both(s, 'pistol_squat', [{ phase: 'Lower', s: 3, move: true }, { phase: 'Stand', s: 1, move: true }])), 'seconds on a no-seconds card').toBe(true);
    expect(red(s => { s.specs.front_squat = { ...s.specs.front_squat, tempo: [{ phase: 'Lower', s: 2, move: true }] }; }), 'seconds on a no-seconds spec').toBe(true);
    expect(red(s => both(s, 'front_squat', [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true, word: 'Controlled' }])), 'word moved to the other phase').toBe(true);
    expect(red(s => both(s, 'goblet_squat', [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }])), 'words dropped').toBe(true);
    expect(red(s => both(s, 'step_up', [{ phase: 'Rise', move: true }, { phase: 'Lower', move: true, word: 'Slow' }])), 'step_up\'s word changed (card and spec)').toBe(true);   // LIB-SPLIT: replaces the held-tempo mutation
    expect(red(s => both(s, 'forward_lunge', [{ phase: 'Lower', move: true, word: 'Smooth' }, { phase: 'Rise', move: true }])), 'forward_lunge\'s Step row dropped').toBe(true);
    expect(red(s => { s.specs.pistol_squat = { ...s.specs.pistol_squat, tempo: [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true, word: 'Slow' }] }; }), 'spec word != card word').toBe(true);
  });
  const cardsSha = readJson('tools/plates/library/lb4/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it('each card differs from its research-head copy only in the three keys, written last (LIB-SPLIT: step_up now carries all three)', () => {
    for (const id of LB4) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(Object.keys(cardOf(id)).slice(-3), id).toEqual(KEYS);
    }
  });
  const DRAWN: Record<string, string> = { front_squat: 'elbows', goblet_squat: 'lean', bodyweight_squat: 'heels', wall_sit: 'feet', step_up: 'lean', pistol_squat: 'heel', jump_squat: 'straight',
    forward_lunge: 'knee', walking_lunge: 'chest', bodyweight_lunge: 'knee', bodyweight_split_squat: 'knee', bulgarian_split_squat: 'knee' };   // LIB-SPLIT (DESIGN.md 17.3; bulgarian 17.11)
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable
    ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault'])
    : (card.topFault !== drawnKey ? [] : ['drawable:false but topFault equals the drawn fault']));
  it('Q1 (D-LIB14-FAULTKEY): each topFault follows the ruled map; pistol_squat is drawable:false with topFault bounce; every drawn first tell carries the drawn key', () => {
    for (const id of LB4) expect(topFaultProblems(cardOf(id), DRAWN[id]!), id).toEqual([]);
    expect([cardOf('pistol_squat').plate.mistake.drawable, cardOf('pistol_squat').topFault]).toEqual([false, 'bounce']);
    for (const id of specsDrawn()) expect(S[id].mistake.tells[0].key, id).toBe(DRAWN[id]);
  });
  it('Q1 mutations: pistol_squat\'s topFault set to its drawn key, and a drawable:true card with another key, are red', () => {
    const c = cardOf('pistol_squat'); c.topFault = 'heel';
    expect(topFaultProblems(c, 'heel')).toEqual(['drawable:false but topFault equals the drawn fault']);
    const d = cardOf('wall_sit'); d.topFault = 'knees';
    expect(topFaultProblems(d, 'feet')).toEqual(['drawable:true but topFault is not the drawn fault']);
  });
  it('D-LIB14-STEPUP-POSE: step_up\'s card start is the step position (not standing on the box) and its end is standing tall on the box (c1, c6), so the map swaps them', () => {
    const p = cardOf('step_up').plate;
    expect(p.start).toMatch(/on the box, the other on the floor/);
    expect(p.end).toMatch(/^Standing tall on the box/);
    expect(POSE_MAP.step_up).toEqual({ start: 'end', end: 'start' });
  });
  /** 14.7 rules 10, 15, D-LIB9-CARDFIELDS and the pose map: kind, one form, a claim of its own card, and a pose that is
   *  the map's image of a card pose. */
  const factProblems = (id: string, c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
    ...(f.cardPose && POSE_MAP[id]![f.cardPose] !== (f.pose ?? 'end') ? [`${i}: pose ${f.pose ?? 'end'} is not the map's image of card ${f.cardPose}`] : []),
  ]);
  // D-LIB14-FACTS (#289 6338977366) with the verify's fix rounds (6341470610, 6342086947), each with its claim id; one per checked
  // landmark, its pose the map's image.
  const C = (lms: string[], pose: string, cardPose: string, claim: string) => lms.map(landmark => ({ kind: 'contact', landmark, pose, cardPose, claim }));
  const FACTS: Record<string, any[]> = {
    front_squat: [...C(['shoulderTop.r', 'shoulderTop.l'], 'start', 'start', 'c3'), ...C(['shoulderTop.r', 'shoulderTop.l'], 'end', 'end', 'c3'), ...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c4')],   // .l: cflb4s fix (#289 6537412975)
    goblet_squat: [...C(['wrist.r', 'wrist.l'], 'start', 'start', 'g1'), ...C(['heel.r', 'ball.r', 'heel.l', 'ball.l'], 'end', 'end', 'g4')],
    bodyweight_squat: C(['heel.r', 'ball.r', 'heel.l', 'ball.l'], 'end', 'end', 'b7'),
    wall_sit: [{ kind: 'angle', joint: 'knee.r', pose: 'end', cardPose: 'end', deg: 90, claim: 'w2' }, { kind: 'angle', joint: 'hip.r.flex', pose: 'end', cardPose: 'end', deg: 90, claim: 'w2' },
      ...C(['backUpper', 'buttock'], 'start', 'start', 'w5'), ...C(['backUpper', 'buttock'], 'end', 'end', 'w5')],
    step_up: [...C(['heel.r', 'ball.r'], 'end', 'start', 'c6'), ...C(['heel.l', 'ball.l'], 'end', 'start', 'c1'), ...C(['wrist.r', 'wrist.l'], 'end', 'start', 'c5'), ...C(['heel.r', 'ball.r'], 'start', 'end', 'c1')],
    pistol_squat: C(['heel.r', 'ball.r'], 'end', 'end', 'p3'),
    jump_squat: [...C(['heel.l', 'heel.r'], 'start', 'start', 'j2'), ...C(['sole.r'], 'end', 'end', 'j4')],   // LIB-SMALL PLAN (lb4/DESIGN.md 16); cfsmall: j4 names one mid-foot, so the near side only (#358 6547988428)
    // LIB-SPLIT facts plan (lb4/DESIGN.md 17.3): setup hand quotes at the start, kneecap contacts at the end
    // cfsp D-SPLIT-FRONTFOOT (#364 6584536292): the front foot pressed into the floor at the bottom, heel.r and ball.r at the end
    forward_lunge: [...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c5'), ...C(['heel.r', 'ball.r'], 'end', 'end', 'c1')],
    walking_lunge: [...C(['knee.l'], 'end', 'end', 'c2'), ...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c12'), ...C(['heel.r', 'ball.r'], 'end', 'end', 'c4')],
    bodyweight_lunge: [],
    bodyweight_split_squat: C(['knee.l'], 'end', 'end', 'c1'),
    // D-SPLIT-BSSHOVER (#364 6592673388): knee.l's end fact is the kneecap 3 cm above the floor (joint centre 0.049 + 0.03 m)
    bulgarian_split_squat: [{ kind: 'height', landmark: 'knee.l', pose: 'end', cardPose: 'end', m: 0.079, claim: 'c3' }, ...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c9'), ...C(['heel.r', 'ball.r'], 'end', 'end', 'c3')],
  };
  it('every card\'s plateFacts is the ruled set (D-LIB14-FACTS)', () => {
    for (const id of LB4) { expect(cardOf(id).plateFacts, id).toEqual(FACTS[id]); expect(factProblems(id, cardOf(id)), id).toEqual([]); }
  });
  it('D-SPLIT-FRONTFOOT mutations: each card with its front-foot facts removed is red', () => {
    for (const id of ['forward_lunge', 'walking_lunge', 'bulgarian_split_squat']) {
      const c = cardOf(id), cut = c.plateFacts.filter((f: any) => !(f.pose === 'end' && ['heel.r', 'ball.r'].includes(f.landmark)));
      expect(cut.length, id).toBe(c.plateFacts.length - 2);
      expect(cut, id).not.toEqual(FACTS[id]);
    }
  });
  it('mutations: a fact with both joint and measure: true, and a start fact named with the unmapped pose, are red', () => {
    const c = cardOf('wall_sit'); c.plateFacts.push({ kind: 'angle', joint: 'knee.r', measure: true, deg: 90, claim: 'w2' });
    expect(factProblems('wall_sit', c)).toEqual([`${c.plateFacts.length - 1}: both joint and measure`]);
    const p = cardOf('step_up'); p.plateFacts.push({ kind: 'contact', landmark: 'heel.r', pose: 'start', cardPose: 'start', claim: 'c6' });
    expect(factProblems('step_up', p)).toEqual([`${p.plateFacts.length - 1}: pose start is not the map's image of card start`]);
  });
  const h6 = (spec: any, research: any) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key);
  };
  // The card's research keys as QA reads them: candidate.mjs researchOf (with LIB-STRIP's tempoText / tempoFallbackA).
  let researchOf: any;
  beforeAll(async () => { ({ researchOf } = await import(/* @vite-ignore */ lib('candidate.mjs'))); }, T);
  const research = (id: string) => researchOf({ research: { card: `docs/research/howto/cards/${id}.json` } });
  it('A6: PQ-H6 is green on every drawn spec against its card (held specs included, read off the page)', () => {
    for (const id of specsDrawn()) expect(h6(S[id], research(id)), id).toEqual([]);
  });
  // Every numeric triple named `at` in a pose (root, reach and plant targets) moved by v: the whole body moves rigidly.
  const shiftPose = (p: any, v: number[]): any => Array.isArray(p) ? p.map(x => shiftPose(x, v)) : p && typeof p === 'object'
    ? Object.fromEntries(Object.entries(p).map(([k, x]: [string, any]) => [k, k === 'at' && Array.isArray(x) && x.length === 3 && x.every((n: any) => typeof n === 'number') ? x.map((n: number, i: number) => n + v[i]!) : shiftPose(x, v)])) : p;
  it('A6 mutation: for each contact fact, its pose\'s body moved 2 cm along that fact\'s plane normal turns that fact red and no fact of another pose', async () => {
    for (const id of specsDrawn()) { await yieldNow(); FACTS[id]!.forEach((f, i) => {   // F-VITEST-RPC: one macrotask per spec
      if (f.kind !== 'contact') return;
      const s = S[id], k = s.checks.find((c: any) => c.landmark === f.landmark && c.plane && (c.pose === f.pose || c.pose === 'all'));
      const n = k.plane.normal, L = Math.hypot(...n), v = n.map((x: number) => x / L * 0.02);
      const red = h6({ ...s, poses: { ...s.poses, [f.pose]: shiftPose(s.poses[f.pose], v) } }, research(id)).filter((x: string) => x.includes(':contact:'));
      expect(red, `${id} ${f.pose} ${f.landmark}`).toContain(`H6.fact:${i}:contact:${f.landmark}`);
      const others = FACTS[id]!.flatMap((g, j) => (g.kind === 'contact' && g.pose !== f.pose ? [`H6.fact:${j}:contact:${g.landmark}`] : []));
      expect(red.filter((x: string) => others.includes(x)), `${id} ${f.pose} ${f.landmark}`).toEqual([]);
    }); }
  });
  it('A6 mutations: an angle fact +3 deg (wall_sit\'s knee 93), and the card path removed, are red', () => {
    const s = S.wall_sit, r = research('wall_sit');
    expect(h6(s, { ...r, plateFacts: r.plateFacts.map((f: any) => (f.joint === 'knee.r' ? { ...f, deg: 93 } : f)) })).toEqual(['H6.fact:0:angle:knee.r']);
    expect(h6(s, null)).toEqual(['H6:no-card']);
  });
});

describe('LIB-14 panel lb4p fix round (#289 6410190090): items 1-7 on drawn items', { timeout: T }, () => {
  const b = { height: 1.75 };
  // F-VITEST-RPC (D-LIB13S-RPC form, as lb6-plates' r2Cam): the camera is memoised per spec object, since renderPlate is
  // costly and item 2 called it per point (53 s of synchronous work in the worker; now under 2 s).
  const CAMS = new WeakMap<object, any>();
  const camOf = (spec: any) => { if (CAMS.has(spec)) return CAMS.get(spec);
    const c = rep(spec).camera, cam = { view: 'side', near: 'r', pxm: c.pxPerM, y0: c.y0, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] };
    CAMS.set(spec, cam); return cam; };
  const qOf = (pose: any) => body.resolve(body.normPose(pose, b), b).q;
  const shapes = (spec: any, q: any) => body.bodyShapes(body.fk(q, b), camOf(spec));
  const px = (spec: any, pose: string, k: string) => camOf(spec).P(lmOf(spec, pose)[k]);
  const misPose = (spec: any) => ({ ...spec.poses.end, ...spec.mistake.pose });
  /** Items 5 and 7: the lifted heel sits over the solid heel (±1.5 px) and the foot outline keeps its length (±1.5 px). */
  const heelOver = (spec: any) => {
    const e = shapes(spec, qOf(spec.poses.end)).find((x: any) => x.key === 'foot.r').poly, m = shapes(spec, qOf(misPose(spec))).find((x: any) => x.key === 'foot.r').poly;
    const len = (p: number[][]) => Math.max(...p.map(q => q[0]!)) - Math.min(...p.map(q => q[0]!));
    const he = camOf(spec).P(body.landmarks(body.fk(qOf(spec.poses.end), b))['heel.r']), hm = camOf(spec).P(body.landmarks(body.fk(qOf(misPose(spec)), b))['heel.r']);
    return { dx: Math.abs(hm[0]! - he[0]!), dLen: Math.abs(len(m) - len(e)) };
  };
  const unpinned = (spec: any) => { const p = spec.mistake.pose.plant, sh = (f: any) => ({ ...f, at: [f.at[0], f.at[1], 0] });
    return { ...spec, mistake: { ...spec.mistake, pose: { ...spec.mistake.pose, plant: Object.fromEntries(Object.entries(p).map(([k, f]) => [k, sh(f)])) } } }; };
  it('items 5 and 7: pistol_squat and bodyweight_squat lift the heel about the flat foot\'s ball: the dashed heel over the solid heel, the foot its own length; mutation: the ball back at mid-sole (the old plant) is red', () => {
    for (const id of ['pistol_squat', 'bodyweight_squat']) {
      const h = heelOver(S[id]);
      expect(h.dx, id).toBeLessThanOrEqual(1.5);
      expect(h.dLen, id).toBeLessThanOrEqual(1.5);
      expect(heelOver(unpinned(S[id])).dx, `${id} mutation`).toBeGreaterThan(5);
      expect(lmOf(S[id], 'mistake')['heel.r'][1], id).toBeCloseTo(0.035, 4);   // the lift stays the same
    }
  });
  /** Item 4: the lowest point of the free foot in each descent ghost, px above the floor (positive = clear). */
  const ghostClear = (spec: any) => {
    const keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, b)), n = spec.ghosts.count;
    return Array.from({ length: n }, (_, i) => { const poly = shapes(spec, body.poseAt(keys, (i + 1) / (n + 1), b).q).find((x: any) => x.key === 'foot.l').poly;
      return camOf(spec).y0 - Math.max(...poly.map((q: number[]) => q[1]!)); });
  };
  it('item 4: pistol_squat\'s descent ghosts hold the free foot at least 4 px above the floor; mutation: the via free hip back at 55 is red', () => {
    for (const g of ghostClear(S.pistol_squat)) expect(g).toBeGreaterThanOrEqual(4);
    const s = S.pistol_squat, v = s.poses.via[0], low = { ...s, poses: { ...s.poses, via: [{ ...v, hip: { ...v.hip, l: 55 } }] } };
    expect(Math.min(...ghostClear(low))).toBeLessThan(4);
  });
  it('item 6: bodyweight_squat\'s WEIGHT ON TOES leader ends on the forefoot of the lifted foot, its label right of the foot; mutation: the knee anchor is red', () => {
    const s = S.bodyweight_squat, t = s.mistake.tells.find((x: any) => x.key === 'toes');
    const end = (spec: any) => { const tt = spec.mistake.tells.find((x: any) => x.key === 'toes'); return px(spec, 'mistake', tt.anchor.at); };
    const ball = px(s, 'mistake', 'ball.r'), toe = px(s, 'mistake', 'toe.r');
    expect(Math.hypot(end(s)[0]! - ball[0]!, end(s)[1]! - ball[1]!)).toBeLessThanOrEqual(1);
    expect(t.box.left).toBeGreaterThan(toe[0]!);
    const bad = { ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((x: any) => (x.key === 'toes' ? { ...x, anchor: { at: 'knee.r', pose: 'mistake' } } : x)) } };
    expect(Math.hypot(end(bad)[0]! - ball[0]!, end(bad)[1]! - ball[1]!)).toBeGreaterThan(20);
  });
  it('item 7: bodyweight_squat carries a Mistake zoom on the heels at the smallest 0.5 step that reaches H3\'s deviation bar; pistol_squat none (its knee tell already passes H3, H3.zoom:not-needed)', async () => {
    const z = await import(/* @vite-ignore */ lib('zoom/inline.mjs')), bar = pins().envelope.deviationMin, s = S.bodyweight_squat;
    expect(s.zoom).toEqual({ view: 'mistake', k: 2.5, tell: 'heels' });
    const d = z.zoomOf(s).fault.d;
    expect(d * s.zoom.k).toBeGreaterThanOrEqual(bar);
    expect(d * (s.zoom.k - 0.5)).toBeLessThan(bar);
    expect(S.pistol_squat.zoom).toBeUndefined();
  });
  /** Items 1 and 3: a callout's anchor point (end pose, px) and whether it lies on the chest front: forward of the shoulder joint. */
  const anchorPx = (spec: any, key: string) => { const c = spec.callouts.find((x: any) => x.key === key), L = lmOf(spec, 'end'), a = c.anchor;
    const w = typeof a === 'string' ? L[a] : L[a.along[0]].map((v: number, i: number) => v + (L[a.along[1]][i] - v) * a.t);
    return camOf(spec).P(w); };
  it('items 1 and 3: CHEST TALL and CHEST UP end on the chest front (forward of the shoulder joint, below the chin), the labels on the right; mutation: the old backUpper anchor is red', () => {
    for (const [id, top] of [['front_squat', 'shoulder.r'], ['goblet_squat', 'chin']] as const) {
      const s = S[id], a = anchorPx(s, 'chest'), sh = px(s, 'end', 'shoulder.r'), lim = px(s, 'end', top);
      expect(a[0]!, id).toBeGreaterThan(sh[0]!);
      expect(a[1]!, id).toBeGreaterThan(lim[1]!);
      expect(s.callouts.find((x: any) => x.key === 'chest').box.left, id).toBeGreaterThanOrEqual(220);
      const bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'chest' ? { ...x, anchor: 'backUpper' } : x)) };
      expect(anchorPx(bad, 'chest')[0]!, `${id} mutation`).toBeLessThan(sh[0]!);
    }
    // goblet: between the chin and the dumbbell's top head
    const g = anchorPx(S.goblet_squat, 'chest'), db = itemsIn(S.goblet_squat, 'end').items, dbTop = Math.min(...db.filter((i: any) => (i.part === 'db' || /dumbbell/.test(i.type)) && i.at).map((i: any) => camOf(S.goblet_squat).P(i.at)[1]!));
    expect(Number.isFinite(dbTop)).toBe(true);
    expect(g[1]!).toBeLessThan(dbTop);
  });
  it('item 2: front_squat\'s dropped arm is the drawn arm (its end outlines, every drawn length kept) rotated about the faulty shoulder to the Mistake elbow\'s direction, with a dashed elbow joint circle and a red arrow along the drop; mutations: the arrow or the joint circle removed, or the copy not rotated, are red', () => {
    const s = S.front_squat, cam = camOf(s), mod = M.front_squat;
    const perim = (p: number[][]) => p.slice(1).reduce((a, q, i) => a + Math.hypot(q[0]! - p[i]![0]!, q[1]! - p[i]![1]!), 0);
    const problems = (spec: any, arm = mod.DROP_ARM) => {
      const out: string[] = [], g = spec.mistake.guides, de = mod.DROP_ELBOW;
      const ends = shapes(spec, qOf(spec.poses.end)).filter((x: any) => ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'].includes(x.key)).map((x: any) => perim([...x.poly, x.poly[0]]));
      const drawn = g.filter((x: any) => x.kind === 'dashed' && arm.includes(x.pts)).map((x: any) => perim(x.pts.map(cam.P)));
      if (drawn.length !== 4 || drawn.some((v: number, i: number) => Math.abs(v - ends[i]!) > 0.5)) out.push('arm outlines are not the drawn arm\'s');
      const ms = px(spec, 'mistake', 'shoulder.r'), me = px(spec, 'mistake', 'elbow.r'), es = px(spec, 'end', 'shoulder.r'), ee = px(spec, 'end', 'elbow.r');
      const dir = (a: number[], b: number[]) => Math.atan2(b[1]! - a[1]!, b[0]! - a[0]!);
      if (Math.abs(Math.hypot(de[0] - ms[0]!, de[1] - ms[1]!) - Math.hypot(ee[0]! - es[0]!, ee[1]! - es[1]!)) > 0.5) out.push('upper arm length');
      if (Math.abs(dir(ms, de) - dir(ms, me)) > 0.01) out.push('not rotated to the drop');
      const circle = g.find((x: any) => x.kind === 'dashed' && x.pts.length === 13 && x.pts.every((p: number[]) => Math.abs(Math.hypot(...cam.P(p).map((v: number, i: number) => v - de[i])) - 2.25) < 0.05));
      if (!circle) out.push('no joint circle at the dropped elbow');
      const arrow = g.find((x: any) => x.kind === 'arrow');
      if (!arrow) out.push('no drop arrow');
      else { const a = cam.P(arrow.from), z = cam.P(arrow.to), d = [de[0] - ee[0]!, de[1] - ee[1]!], v = [z[0]! - a[0]!, z[1]! - a[1]!];
        if ((d[0]! * v[0]! + d[1]! * v[1]!) / (Math.hypot(d[0]!, d[1]!) * Math.hypot(v[0]!, v[1]!)) < 0.98) out.push('arrow not along the drop'); }
      return out;
    };
    expect(problems(s)).toEqual([]);
    expect(problems({ ...s, mistake: { ...s.mistake, guides: s.mistake.guides.filter((x: any) => x.kind !== 'arrow') } })).toContain('no drop arrow');
    expect(problems({ ...s, mistake: { ...s.mistake, guides: s.mistake.guides.filter((x: any) => x.pts?.length !== 13) } })).toContain('no joint circle at the dropped elbow');
    const x0 = rep(s).camera.x0;   // F-VITEST-RPC: read once, not once per outline point (the same value)
    const unrot = shapes(s, qOf(s.poses.end)).filter((x: any) => ['upper.r', 'elbowcap.r', 'fore.r', 'fist.r'].includes(x.key)).map((x: any) => [...x.poly, x.poly[0]].map((q: number[]) => [0, (cam.y0 - q[1]!) / cam.pxm, (q[0]! - x0) / cam.pxm]));
    expect(problems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides.filter((x: any) => !mod.DROP_ARM.includes(x.pts)), ...unrot.map((pts: any) => ({ kind: 'dashed', pts }))] } }, unrot)).toEqual([]);
    expect(unrot.map((p: any) => cam.P(p[0])).some((q: number[], i: number) => Math.hypot(q[0]! - cam.P(mod.DROP_ARM[i][0])[0]!, q[1]! - cam.P(mod.DROP_ARM[i][0])[1]!) > 5)).toBe(true);
  });

});

describe('LIB-14 panel mx1 second round (#289 6414220426, D-LIB13-PANEL2): goblet_squat draw order, pistol_squat heel', { timeout: T }, () => {
  /** goblet_squat item 1: in the end layer the near hand (fist.r) is drawn after the dumbbell's discs, so it shows over them. */
  // The end layer's order: the dumbbell's discs come after the trunk and the far hand, and before the near hand (z 'mid').
  const handOverDb = (spec: any) => { const v = plate.renderPlate(spec, { id: 'x' }).svg, disc = v.lastIndexOf('class="disc"');
    return disc > v.lastIndexOf('<use href="#x-e-torso"/>') && disc > v.lastIndexOf('<use href="#x-e-fist.l"/>') && v.lastIndexOf('<use href="#x-e-fist.r"/>') > disc; };
  it('item 1: goblet_squat draws the near hand and forearm over the dumbbell (draw order only: no joint moves); mutations: the dumbbell at z front, or at z back, is red', () => {
    const s = S.goblet_squat;
    expect(handOverDb(s)).toBe(true);
    const front = { ...s, equipment: s.equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && r.part === 'db' ? { ...r, z: 'front' } : r; } : e)) };
    expect(handOverDb(front)).toBe(false);
    const back = { ...s, equipment: s.equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && r.part === 'db' ? { ...r, z: 'back' } : r; } : e)) };
    expect(handOverDb(back)).toBe(false);   // review Low (6537218246): the dumbbell behind the trunk is red
  });
  /** pistol_squat item 2: the lifted foot's whole outline as a dashed guide (over the solid foot), and a red arrow from
   *  the floor up to the lifted heel's height, standing behind the heel. */
  const heelProblems = (spec: any) => {
    const c = rep(spec).camera, P = (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM], b = { height: 1.75 };
    const cam = { view: 'side', near: 'r', pxm: c.pxPerM, P };
    const foot = body.bodyShapes(body.fk(body.resolve(body.normPose({ ...spec.poses.end, ...spec.mistake.pose }, b), b).q, b), cam).find((x: any) => x.key === 'foot.r').poly;
    const g = spec.mistake.guides, out: string[] = [];
    const dashedFoot = g.find((x: any) => x.kind === 'dashed' && Array.isArray(x.pts) && x.pts.length === foot.length + 1
      && x.pts.slice(0, -1).every((p: any, i: number) => Math.hypot(P(p)[0]! - foot[i][0], P(p)[1]! - foot[i][1]) < 0.1));
    if (!dashedFoot) out.push('no dashed outline of the lifted foot');
    const heel = P(lmOf(spec, 'mistake')['heel.r']), a = g.find((x: any) => x.kind === 'arrow');
    if (!a) out.push('no heel arrow');
    else {
      const f = P(a.from), t = P(a.to);
      if (Math.abs(f[1]! - c.y0) > 0.5) out.push('the arrow does not start at the floor');
      if (Math.abs(t[1]! - heel[1]!) > 0.5) out.push('the arrow does not end at the lifted heel\'s height');
      if (Math.abs(f[0]! - t[0]!) > 0.5 || !(heel[0]! - f[0]! > 0 && heel[0]! - f[0]! < 15)) out.push('the arrow is not upright just behind the heel');
    }
    if (Math.abs(lmOf(spec, 'mistake')['heel.r'][1] - 0.035) > 1e-4) out.push('the lift is not 3.5 cm');
    return out;
  };
  it('item 2: pistol_squat draws the lifted foot dashed over the solid foot and a red arrow from the floor up to the lifted heel; the lift stays 3.5 cm and there is no zoom; mutations: the dashed foot removed, or the arrow pointing down, are red', () => {
    const s = S.pistol_squat;
    expect(heelProblems(s)).toEqual([]);
    expect(s.zoom).toBeUndefined();
    const noFoot = { ...s, mistake: { ...s.mistake, guides: s.mistake.guides.filter((x: any) => !(x.kind === 'dashed' && x.pts.length > 3)) } };
    expect(heelProblems(noFoot)).toContain('no dashed outline of the lifted foot');
    const down = { ...s, mistake: { ...s.mistake, guides: s.mistake.guides.map((x: any) => (x.kind === 'arrow' ? { ...x, from: x.to, to: x.from } : x)) } };
    expect(heelProblems(down)).toContain('the arrow does not start at the floor');
  });
});

/** F-VITEST-RPC (#358 6552271304, the D-LIB13S-RPC form): any whole-page build in an awaited child process. `body` runs there with `b` (lb4/build.mjs), `lib`
 *  (a path to a library file URL) and `fs`, and returns the page html (Buffer or string). */
const lb4BuildInChild = async (body: string) => {
  const script = `const b = await import(${JSON.stringify(lib('lb4/build.mjs'))}); const fs = await import('node:fs'); const lib = f => new URL(f, ${JSON.stringify(lib(''))}).href;
const html = await (async () => { ${body} })(); process.stdout.write(Buffer.from(html).toString('base64'));`;
  const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 27 });
  return Buffer.from(stdout, 'base64').toString('utf8');
};
const lb4PageInChild = async () => {
  const script = `const b = await import(${JSON.stringify(lib('lb4/build.mjs'))}); const { html } = await b.buildLb4Page(); process.stdout.write(html.toString('base64'));`;
  const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 27 });
  return Buffer.from(stdout, 'base64').toString('utf8');
};

describe('LIB-SMALL A2: the 5 approved LB4 plates stay byte-identical (page 9a2b7881 on main 6b32d576)', { timeout: T }, () => {
  // golden.mjs fragmentsOf of the 5 approved LB4 plates on main's LB4 page 9a2b7881…6a9e (45 fragments; the form of
  // lb6-plates.test.ts's LIB-16 resume block).
  const APPROVED: Record<string, Record<string, string>> = {
    "front-squat": {
      "normalSvg": "4ecab78ebaa9560defbf68bf50f199c83339b26196ad1715029b4ed672ac36cd",
      "normalOverlay": "d4e84ee29a56ed2bd196631d50fd3728d6d3fedfddb72a60947eb0791f370f9a",
      "mistakeSvg": "f5ffd80e96e5a57235ed766885753be6b027dfb88580c0117bd7b20c3c436ce2",
      "mistakeOverlay": "b12ff6c71ac8e90aea48c4175c4d0be6d2da6cba7b5326100f562ef9a312c3c6",
      "tells": "aaf021b59385c48e494f47a871038f0aa058d1514f6a8297f32a87357e7e0940",
      "tempo": "ab0f21665e3f48d9501897698a06532e4abdd7a9e0744a6eda115cc9060e213f",
      "cues": "f1a46945fe5d23311af32726d480f31fd1ee8b136277a624149b23d9b0c72992",
      "alt": "82f041276be1d2d5045804f9d7433fe2ef937db6a690a678ea0e873f1e3a2225",
      "mistakeAlt": "587f1ce3d22bea399a1923efedcdff97dce800fee6d75465a436d5a40e3c1c29"
    },
    "goblet-squat": {
      "normalSvg": "54bb87d119a41a81d2f0426eb28b8e1fedaa5d0947b4f8f0b9ae2bc9695d7c69",
      "normalOverlay": "e0e1e1045ee1765b0e05afcca6282124d7e9ee9d8f912a820c825f964359cc33",
      "mistakeSvg": "d07a85f48199339a188e3c11d4dbe67620ab2dc3f758813e78831ab9770553bc",
      "mistakeOverlay": "a20b880f96315a18317131314f56ac55308a0b6e91ec9e8387f7b0e9dfc7128b",
      "tells": "2728938e9ef38aa6bda15c1d41e57180162907aeb213f2da6bf713e6fb830b10",
      "tempo": "c7d316b8f804c6564a61dcb7ccf44290678345327b95b64fb5c7379ef09f6d18",
      "cues": "020cfc2602fe9c32f85f8ff5a6ffce2fafdc4253ecffcfb8e9e663326ce6e54b",
      "alt": "12087c14b3350ad6a6dd804e2f990c1bf4ce54d30cd795cf84caa910a731c7a3",
      "mistakeAlt": "764a892b1231a24969f3e1f6bc0656a407709497c61bc28b04fe961bce165b48"
    },
    "bodyweight-squat": {
      "normalSvg": "f5bd3ef7fb18ba31663063c1e6ced029486cf21552e33039d481d6385d4a8cac",
      "normalOverlay": "80b017e1346e628f0ad0969759581f40549b4b5e4e5523f34aeae08d18a43641",
      "mistakeSvg": "df91547d0cc5798ed76e995241a7dcd5604a252b3e6537ba2440871519f4a660",
      "mistakeOverlay": "6186af86472fbf338cae0afd3036e247868e8f92674bec9981129b9f9f2001a2",
      "tells": "e4006ed757a1deba831c97957576280a54eea493650da158da401adffda56d9d",
      "tempo": "cbfe12f8d00e9f7f873f9ff54cb9761ab4c152e35bb37cc24173c902ed51031a",
      "cues": "bdef5c5dd2ade929569f37945b396f97f9f6bac425e7fdc871dc75d01b6a8b00",
      "alt": "5ed34d890682fe74f67c7fd47e92355062064b60affa7e5ebf5ebd7046e479a1",
      "mistakeAlt": "4c1080c5d586575992fc5f2335502870ce17d710b6523f43201370aaae2b44ec"
    },
    "wall-sit": {
      "normalSvg": "d6faa81fdefb536e723412e0603a74dc1032298138380e6b87e37bf7142046a1",
      "normalOverlay": "852988543a8323793fe7f3e9012d8ee0e0549a93a181d51e282802d9e93f5914",
      "mistakeSvg": "b404d79c3eceed9cf9f457142f5efbcfca5951cfd4f804102f9a0874a273c94e",
      "mistakeOverlay": "3de65ebc6d6c6aaf5be2ea15ce77a0effe3d2cd967d0a05c6892491efe6ca52c",
      "tells": "f0ad3f0505aac7d01987d6ca5c1ed1cdfa7de61e2da200efffbc9f12a6f14a55",
      "tempo": "eebaf59717deecae2c30e72ce5b9cf8e30052b4ae3769e01b2ad37051e4ac315",
      "cues": "36732e74c14311911917050d93b6ac99fb97d68b273550fc32fea433aa7e54f8",
      "alt": "a9774fdedc11998fef452e9edf89a8abc55b90152306f7a14701417dd9e4e482",
      "mistakeAlt": "ee942445316b3d6fa75f806b209d24fe20f5453ea5a4617d3f6055c141494a97"
    },
    "pistol-squat": {
      "normalSvg": "51de53e3dfd2b0203eb326147fa442a580606073484564abce36ec60ac276d98",
      "normalOverlay": "699fb9e05a0bbbbed8e456368ef7bc3bb8b9cacd7754f220ff7b88bbe41c1170",
      "mistakeSvg": "c22880be11bb10c0411e4347449b5a5fb84e6af401dfb845c6c6e96a7fc3f48a",
      "mistakeOverlay": "4a380d2cd466a1b10b02c5730ce331ada3f472ef06fb5b09e0a7735cc141c155",
      "tells": "b40836900804079ba12aa800b24966a5200143226487d83a91bd2864cebcf034",
      "tempo": "084d452f3c34dde94f33b3f5dab5818fabd0787de9efc3c137121848c1fb6473",
      "cues": "1e3786aaa540f36af51990152086657abcb611c2b36737fa9dd678e6d3cbb69c",
      "alt": "26daf096ae0c52b1e9f61c567c30ae3b8d4b6f238fa12855d0f22dca9065d4d9",
      "mistakeAlt": "125a86e4557fcbb4f9b352bac40d3e99cc096883bcad8c54290441ff075dc2b3"
    }
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb4/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const fragProblems = (html: string) => Object.entries(APPROVED).flatMap(([c, want]) => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`);
  });
  it('the 5 approved plates\' 45 fragments on this head equal main\'s', async () => {
    expect(Object.values(APPROVED).reduce((a, f) => a + Object.keys(f).length, 0)).toBe(45);
    expect(fragProblems(await lb4PageInChild())).toEqual([]);
  });
  it('mutation: one byte changed in goblet_squat\'s alt is red', async () => {
    const html = await lb4PageInChild(), alt = S.goblet_squat.alt;
    expect(html.includes(alt)).toBe(true);
    expect(fragProblems(html.replace(alt, alt.replace('Goblet squat', 'Goblet squaT')))).toContain('goblet-squat alt');
  });
});

describe('LIB-SMALL A4 and A6: jump_squat\'s drawn poses are card-true and airborne-convention true (D-SMALL-JSAIR, D-LIB8R-AIR)', { timeout: T }, () => {
  const H = 1.75, R = 180 / Math.PI;
  const kneeOf = (l: any) => { const a = [0, 1, 2].map(i => l['hip.r'][i] - l['knee.r'][i]), b = [0, 1, 2].map(i => l['ankle.r'][i] - l['knee.r'][i]);
    return 180 - Math.acos((a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!) / Math.hypot(...a) / Math.hypot(...b)) * R; };
  const hipOf = (l: any) => { const a = [0, 1, 2].map(i => l['knee.r'][i] - l['hip.r'][i]), b = [0, 1, 2].map(i => l.shoulders[i] - l['hip.r'][i]);
    return Math.acos((a[0]! * b[0]! + a[1]! * b[1]! + a[2]! * b[2]!) / Math.hypot(...a) / Math.hypot(...b)) * R; };
  /** The thorax's lean from vertical (deg; + forward). "Back flat" (j2, j8): the resolved lumbar flexion the engine draws
   *  (body.resolve q.trunk) is at most 10 deg; the engine's back outline barely bends with it, so the joint is the measure. */
  const leanOf = (l: any) => Math.atan2(l.neck[2] - l.hips[2], l.neck[1] - l.hips[1]) * R;
  const lumbarOf = (p: any) => body.resolve(body.normPose(p, { height: H }), { height: H }).q.trunk;
  const cm = (v: number) => Math.abs(v) * 100;
  const FEET = ['heel.l', 'heel.r', 'ball.l', 'ball.r'];
  /** The drawn poses: start, the one ghost (the key pose at t 0.5, via's middle), end, and the Mistake over the end. */
  const drawn = (s: any) => ({ start: s.poses.start, ghost: s.poses.via[(s.poses.via.length - 1) / 2], end: s.poses.end, mistake: { ...s.poses.end, ...s.mistake.pose } });
  const problems = (s: any) => {
    const D = drawn(s), L = Object.fromEntries(Object.entries(drawn(s)).map(([k, p]) => [k, eng.landmarksOf(p, H)])) as Record<string, any>, out: string[] = [];
    // A6: no drawn pose has both feet off every support (the floor is the only support)
    for (const [k, l] of Object.entries(L)) if (!FEET.some(f => cm(l[f][1]) <= 0.5)) out.push(`${k}: both feet off the floor`);
    // start (j2): heels and balls on the floor at the take-off crouch, knees bent past 90, back flat
    for (const f of FEET) if (cm(L.start[f][1]) > 0.5) out.push(`start ${f} ${cm(L.start[f][1]).toFixed(2)} cm off the floor`);
    if (!(kneeOf(L.start) > 90)) out.push(`start knee ${kneeOf(L.start).toFixed(1)}`);
    for (const k of ['start', 'end'] as const) if (!(Math.abs(lumbarOf(D[k])) <= 10)) out.push(`${k} back bend ${lumbarOf(D[k])}`);
    // ghost (j3): on the balls (each within 0.5 cm), heels up, knees straight, hips extended
    for (const f of ['ball.l', 'ball.r']) if (cm(L.ghost[f][1]) > 0.5) out.push(`ghost ${f} ${cm(L.ghost[f][1]).toFixed(2)} cm`);
    for (const f of ['heel.l', 'heel.r']) if (!(L.ghost[f][1] > 0.03)) out.push(`ghost ${f} not up`);
    if (!(kneeOf(L.ghost) < 10)) out.push(`ghost knee ${kneeOf(L.ghost).toFixed(1)}`);
    if (!(hipOf(L.ghost) > 160)) out.push(`ghost hip ${hipOf(L.ghost).toFixed(1)}`);
    // end (j4, j8): mid-foot (and heel, ball) on the floor, knees bent, hips back of the ankles, trunk slightly forward
    for (const f of [...FEET, 'sole.l', 'sole.r']) if (cm(L.end[f][1]) > 0.5) out.push(`end ${f} off the floor`);
    if (!(kneeOf(L.end) > 45)) out.push(`end knee ${kneeOf(L.end).toFixed(1)}`);
    if (!(L.end['hip.r'][2] < L.end['ankle.r'][2])) out.push('end hips not back');
    if (!(leanOf(L.end) > 5 && leanOf(L.end) < 45)) out.push(`end lean ${leanOf(L.end).toFixed(1)}`);
    // j10 (panel mx15 R1): the hands loosely at the chest in the crouch, the ghost and the landing: each grip within 15 cm
    // of the sternum and in front of the chest (beyond the sternum along the back-to-sternum direction)
    for (const k of ['start', 'ghost', 'end']) for (const sd of ['l', 'r']) {
      const l = L[k], g = l[`grip.${sd}`], n = [0, 1, 2].map(i => l.sternum[i] - l.backUpper[i]), d = [0, 1, 2].map(i => g[i] - l.sternum[i]);
      if (!(Math.hypot(d[1]!, d[2]!) < 0.15 && d[1]! * n[1]! + d[2]! * n[2]! > 0)) out.push(`${k} grip.${sd} not at the chest`);
    }
    // Mistake (j5): knees near locked, the same feet as the end
    if (!(kneeOf(L.mistake) < 15)) out.push(`Mistake knee ${kneeOf(L.mistake).toFixed(1)}`);
    for (const f of FEET) if (cm(Math.hypot(...[0, 1, 2].map(i => L.mistake[f][i] - L.end[f][i]))) > 0.5) out.push(`Mistake ${f} moved`);
    return out;
  };
  const shift = (p: any, v: number[]) => ({ ...p, root: { ...p.root, at: p.root.at.map((x: number, i: number) => x + v[i]!) } });
  it('start, ghost, end and Mistake hold every card fact and the airborne rule', () => {
    expect(problems(S.jump_squat)).toEqual([]);
    const L = eng.landmarksOf(drawn(S.jump_squat).ghost, H);
    console.log(`LIB-SMALL jump_squat: ghost balls ${cm(L['ball.l'][1]).toFixed(3)} / ${cm(L['ball.r'][1]).toFixed(3)} cm`);
  });
  it('mutations: the ghost root raised 2 cm, the start heels 2 cm up, the landing knees straight, a rounded start back and the arms swung back (no j10) are red', () => {
    const s = S.jump_squat, mid = (s.poses.via.length - 1) / 2;
    const ghostUp = { ...s, poses: { ...s.poses, via: s.poses.via.map((p: any, i: number) => (i === mid ? { ...p, plant: undefined, root: { ...p.root, at: p.root.at.map((x: number, k: number) => x + (k === 1 ? 0.02 : 0)) } } : p)) } };
    expect(problems(ghostUp).some(x => x.startsWith('ghost ball'))).toBe(true);
    const startUp = { ...s, poses: { ...s.poses, start: { ...shift(s.poses.start, [0, 0.02, 0]), plant: undefined } } };
    expect(problems(startUp).some(x => x.startsWith('start heel'))).toBe(true);
    const stiff = { ...s, poses: { ...s.poses, end: { ...s.poses.end, ...s.mistake.pose } } };
    expect(problems(stiff).some(x => x.startsWith('end knee'))).toBe(true);
    const swing = { ...s, poses: { ...s.poses, start: { ...s.poses.start, reach: undefined, shoulder: { ext: 25 }, elbow: 5 } } };
    expect(problems(swing)).toContain('start grip.r not at the chest');
    const round = { ...s, poses: { ...s.poses, start: { ...s.poses.start, trunk: 30 } } };
    expect(problems(round)).toContain('start back bend 30');
  });
});

describe('LIB-SMALL: jump-squat as approved in panel mx17 (#358, head c176723d) stays byte-identical', { timeout: T }, () => {
  // golden.mjs fragmentsOf of the approved plate (9 fragments) on its lb4 page at c176723d.
  const APPROVED: Record<string, Record<string, string>> = {
    "jump-squat": {
      "normalSvg": "261fdd1fc5dae187d4b23675e6b3036ad4c5a6e298c1dcc80c56fdccfae11d27",
      "normalOverlay": "bb63e83356ad6d587f14cae6bd8c7c1c29de2770af6825474913d5c6a6e386eb",
      "mistakeSvg": "1ea9bbb067b48cf8ea9f8eab43555bf289c5f22b7b126f806ae09c4fb44a5fcc",
      "mistakeOverlay": "e32160ac1318bee2bffcce5cb95c16b187bb89d54866b7539a4b01e0d3d91762",
      "tells": "e2b1b056c56b5416c8e119610e95cd7ae522c05efbe265ca5b87150fdcba0a87",
      "tempo": "23b25a80e39f1ca89dfc529fddc2a9c0ea19947ecd0b2237521e26b15592f452",
      "cues": "703146d98c5acf26e14a51cd93c3f774a83de22a4e1433b8e2af743ea3991f0f",
      "alt": "c68932b65e7726c17b92fdfd8d853cc7a1af86e8e9dcc54c1a70b3db17a7c5f1",
      "mistakeAlt": "c1a9d7a7c34aa82a265ead272d52372f300b2fdf079249332705458f10c59351"
    }
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb4/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const pageOf = lb4PageInChild;
  const fragProblems = (html: string) => Object.entries(APPROVED).flatMap(([c, want]) => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`);
  });
  it('its 9 fragments on this head equal the approved ones', async () => {
    expect(Object.keys(APPROVED['jump-squat']!).length).toBe(9);
    expect(fragProblems(await pageOf())).toEqual([]);
  });
  it('mutation: one byte changed in its alt is red', async () => {
    const html = await pageOf(), alt = S.jump_squat.alt;
    expect(html.includes(alt)).toBe(true);
    expect(fragProblems(html.replace(alt, `${alt.slice(0, -1)}!`))).toContain('jump-squat alt');
  });
});

describe('LIB-SMALL: no whole-page build in the worker (F-VITEST-RPC, #358 6552271304; the D-LIB13S-RPC guard form)', () => {
  const src = readFileSync(new URL(import.meta.url), 'utf8');
  /** A whole-page build outside an awaited child process: any mention of a page builder (called or aliased) or of
   *  generate's render, once the child scripts' `const script = \`...\`;` text and lb4BuildInChild's body arguments, the guards' own lines (`const
   *  inWorker =`, `expect(inWorker(`, `it('mutation`) and the comments that start a line are cut. */
  const inWorker = (text: string) => /\bbuild(Lb4|Held|Plates)Page\b|\b(gen|generate)\.render\b/.test(text
    .replace(/const script = `[\s\S]*?`;/g, '').replace(/lb4BuildInChild\(('[^'\n]*'|`[\s\S]*?`)\)/g, '').replace(/^[ \t]*(const inWorker =|expect\(inWorker\(|it\('mutation)[^\n]*$/gm, '')
    .replace(/^[ \t]*\/\/[^\n]*$/gm, '').replace(/^[ \t]*\/\*[\s\S]*?\*\/[ \t]*$/gm, ''));
  it('every LB4 page build and generate render runs in an awaited child process', () => {
    expect(inWorker(src)).toBe(false);
    expect(src).toMatch(/promisify\(execFile\)\(process\.execPath/);
  });
  it('mutations: a page build in the worker, an aliased one, one after a `//` inside a string, a held or plates page and a generate render are red', () => {
    const P = `${'buildLb4'}Page`;
    expect(inWorker(`${src}\n  const page = await build.${P}();\n`)).toBe(true);
    expect(inWorker(`${src}\n  const make = build.${P};\n  const page = await make();\n`)).toBe(true);
    expect(inWorker(`${src}\n  const u = 'https://x'; const page = await build.${P}();\n`)).toBe(true);
    expect(inWorker(`${src}\n  const page = await build.${'buildHeld'}Page();\n`)).toBe(true);
    expect(inWorker(`${src}\n  const page = await bp.${'buildPlates'}Page({});\n`)).toBe(true);
    expect(inWorker(`${src}\n  const out = await gen.${'ren'}der();\n`)).toBe(true);
  });
});

// LIB-SPLIT (lib-split-card A3, A5; lb4/DESIGN.md 17): step_up's resume and the 5 SPLIT rows, read off the drawn
// landmarks (the engine's own solve) and outlines.
const LANDMARK_KEYS = (lm: any) => Object.keys(lm).filter(k => Array.isArray(lm[k]) && lm[k].length === 3);
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);
/** Whole-body rigid move of one pose (every numeric `at` triple: root, reach and plant targets). */
const movePose = (p: any, v: number[]): any => Array.isArray(p) ? p.map(x => movePose(x, v)) : p && typeof p === 'object'
  ? Object.fromEntries(Object.entries(p).map(([k, x]: [string, any]) => [k, k === 'at' && Array.isArray(x) && x.length === 3 && x.every((n: any) => typeof n === 'number') ? x.map((n: number, i: number) => n + v[i]!) : movePose(x, v)])) : p;
describe('LIB-SPLIT A3: card-true poses (DESIGN.md 17.2, 17.6; PLAN RULED Q1, Q2)', { timeout: T }, () => {
  const H = 1.75, KC = 0.028 * H, REAR_LIFT = 0.0360;
  const FWD = ['forward_lunge', 'walking_lunge', 'bodyweight_lunge'];
  /** D-SPLIT-FWD and Q1: start on the rear foot's spot (the rear ball's x and z within 0.5 cm, y up by REAR_LIFT ± 0.5 cm, the
   *  toe pad's lift), and the near (r) foot steps forward at least half a metre. */
  const fwdProblems = (s: any) => {
    const a = lmOf(s, 'start'), b = lmOf(s, 'end'), d = [0, 1, 2].map(i => b['ball.l'][i] - a['ball.l'][i]), bad: string[] = [];
    if (Math.abs(d[0]!) > 0.005) bad.push(`ball.l x ${d[0]!.toFixed(4)}`);
    if (Math.abs(d[2]!) > 0.005) bad.push(`ball.l z ${d[2]!.toFixed(4)}`);
    if (Math.abs(d[1]! - REAR_LIFT) > 0.005) bad.push(`ball.l y ${d[1]!.toFixed(4)}`);
    if (b['heel.r'][2] - a['heel.r'][2] < 0.5) bad.push('the near foot does not step forward');
    return bad;
  };
  it('forward_lunge, walking_lunge, bodyweight_lunge: start on the rear foot\'s spot, the near foot steps forward, the rear foot pivots on its ball', () => {
    for (const id of FWD) expect(fwdProblems(S[id]), id).toEqual([]);
  });
  it('mutations: forward_lunge stepping back (reverse_lunge\'s start) and the start 1 cm across in x are red', async () => {
    const rl = (await import(/* @vite-ignore */ lib('specs/reverse_lunge.mjs'))).default, s = S.forward_lunge;
    expect(fwdProblems({ ...s, poses: { ...s.poses, start: rl.poses.start } }).length).toBeGreaterThan(0);
    expect(fwdProblems({ ...s, poses: { ...s.poses, start: movePose(s.poses.start, [0.01, 0, 0]) } })).toEqual([expect.stringMatching(/^ball\.l x /)]);
  });
  /** The end kneecap: on the floor (the knee joint centre one kneecap radius up, ±0.5 cm) or, for forward_lunge (c1
   *  "without touching"), clear of it by more than 0.5 cm. */
  const kneeProblems = (s: any, on: boolean) => { const g = lmOf(s, 'end')['knee.l'][1] - KC;
    return (on ? Math.abs(g) <= 0.005 : g > 0.005) ? [] : [`${s.id}: end kneecap gap ${(g * 100).toFixed(2)} cm`]; };
  it('walking_lunge and bodyweight_split_squat end with the kneecap on the floor; forward_lunge\'s stays off it', () => {
    for (const id of ['walking_lunge', 'bodyweight_split_squat']) expect(kneeProblems(S[id], true)).toEqual([]);
    expect(kneeProblems(S.forward_lunge, false)).toEqual([]);
  });
  it('mutations: walking_lunge\'s end 3.6 cm up, and forward_lunge\'s end kneecap put on the floor, are red', () => {
    const w = S.walking_lunge;
    expect(kneeProblems({ ...w, poses: { ...w.poses, end: movePose(w.poses.end, [0, 0.036, 0]) } }, true).length).toBe(1);
    expect(kneeProblems(w, false).length).toBe(1);
  });
  /** Front knee flexion (deg) from the drawn hip, knee and ankle. */
  const kneeFlex = (lm: any, sd: string) => { const u = [0, 1, 2].map(i => lm[`hip.${sd}`][i] - lm[`knee.${sd}`][i]), v = [0, 1, 2].map(i => lm[`ankle.${sd}`][i] - lm[`knee.${sd}`][i]);
    return 180 - Math.acos(u.reduce((a, x, i) => a + x * v[i]!, 0) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI; };
  const fixedProblems = (s: any) => { const e = lmOf(s, 'end'), bad: string[] = [];
    for (const p of posesOf(s)) for (const k of ['heel.r', 'ball.r', 'toe.r', 'ball.l', 'toe.l']) if (dist(lmOf(s, p)[k], e[k]) > 0.005) bad.push(`${p} ${k}`);
    if (kneeFlex(lmOf(s, 'start'), 'r') > 10) bad.push('start front knee over 10 deg');
    return bad; };
  it('bodyweight_split_squat: both feet fixed in every pose (0.5 cm), the start front knee about straight (8 deg, at most 10; c3)', () => {
    expect(fixedProblems(S.bodyweight_split_squat)).toEqual([]);
    expect(kneeFlex(lmOf(S.bodyweight_split_squat, 'start'), 'r')).toBeCloseTo(8, 0);
  });
  it('mutation: bodyweight_split_squat\'s start as forward_lunge\'s (a step, the knee straight under the hips) is red', () => {
    const s = S.bodyweight_split_squat;
    expect(fixedProblems({ ...s, poses: { ...s.poses, start: S.forward_lunge.poses.start } }).length).toBeGreaterThan(0);
  });
  const shinDeg = (lm: any) => Math.atan2(lm['knee.r'][2] - lm['ankle.r'][2], lm['knee.r'][1] - lm['ankle.r'][1]) * 180 / Math.PI;
  const trunkDeg = (lm: any) => Math.atan2(lm.shoulders[2] - lm.hips[2], lm.shoulders[1] - lm.hips[1]) * 180 / Math.PI;
  it('bodyweight_lunge: the end front shin slightly forward of vertical (12 deg, c4) and the trunk 20 deg forward from the hips with a flat back (c5)', () => {
    const s = S.bodyweight_lunge, e = lmOf(s, 'end');
    expect(shinDeg(e)).toBeCloseTo(12, 1);
    expect(trunkDeg(e)).toBeCloseTo(20, 1);
    expect([s.poses.end.trunk, M.bodyweight_lunge.SIZES.TRUNK_LEAN]).toEqual([{ flex: 0 }, 20]);
  });
  /** The rear foot laces-down on the bench (c2): its lowest outline points sit on the bench top (±0.5 cm) and span the
   *  instep to the toe dorsum (at least 15 cm), the sole faces up (heel and mid-sole at least 3 cm above the top); the
   *  front foot flat on the floor; the bench top at the ruled 0.42 m (D-SPLIT-BSSBENCH). */
  const bssCam = (s: any) => { const c = plate.renderPlate(s, { id: 'x' }).report.camera; return { view: 'side', near: 'r', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM], c }; };
  const footPoly = (s: any, p: any, cam: any) => { const b = { height: H };
    return body.bodyShapes(body.fk(body.resolve(body.normPose(p, b), b).q, b), cam).find((x: any) => x.key === 'foot.l' && x.poly)?.poly; };
  const plantProblems = (s: any) => {
    const cam = bssCam(s), bench = s.equipment.find((e: any) => e?.type === 'bench'), top = bench?.at?.[1], bad: string[] = [];
    if (top !== 0.42) bad.push(`bench top ${top}`);
    const yTop = cam.c.y0 - 0.42 * cam.pxm, tol = 0.005 * cam.pxm;
    const poses: [string, any][] = [['start', s.poses.start], ['end', s.poses.end], ['mistake', { ...s.poses.end, ...s.mistake.pose }]];
    for (const [name, p] of poses) {
      const poly = footPoly(s, p, cam), low = Math.max(...poly.map((q: number[]) => q[1]!)), band = poly.filter((q: number[]) => q[1]! >= yTop - tol);
      if (Math.abs(low - yTop) > tol) bad.push(`${name}: lowest foot point ${((yTop - low) / cam.pxm * 100).toFixed(2)} cm off the top`);
      const xs = band.map((q: number[]) => q[0]!);
      if (!xs.length || (Math.max(...xs) - Math.min(...xs)) / cam.pxm < 0.15) bad.push(`${name}: the foot does not rest instep to toe`);
      const lm = lmOf(s, name);
      for (const k of ['heel.l', 'sole.l']) if (lm[k][1] - 0.42 < 0.03) bad.push(`${name}: ${k} not facing up`);
      for (const k of ['heel.r', 'ball.r']) if (Math.abs(lm[k][1]) > 0.005) bad.push(`${name}: ${k} off the floor`);
    }
    return bad;
  };
  it('bulgarian_split_squat: the rear foot laces-down on the 0.42 m bench (instep to toe dorsum) in every pose, the front foot flat', () => {
    expect(plantProblems(S.bulgarian_split_squat)).toEqual([]);
  });
  it('mutation: the rear foot sole-down on the bench is red', () => {
    const s = S.bulgarian_split_squat, rear = s.poses.end.plant.l;
    const sole = (p: any) => ({ ...p, plant: { ...p.plant, l: { at: [rear.at[0], 0.42, rear.at[2]] } } });
    expect(plantProblems({ ...s, poses: { ...s.poses, start: sole(s.poses.start), end: sole(s.poses.end) }, mistake: { ...s.mistake, pose: sole(s.mistake.pose) } }).length).toBeGreaterThan(0);
  });
  // cfsp D-SPLIT-DIRWORDS (#364 6584536292): the direction words are card-true pose tests, not plate facts.
  const thighDeg = (lm: any) => Math.atan2(lm['knee.r'][1] - lm['hip.r'][1], lm['knee.r'][2] - lm['hip.r'][2]) * 180 / Math.PI;
  it('direction words: the end front thigh parallel to the floor (forward_lunge, bodyweight_lunge: 0 deg ±1) and the front shin about vertical (forward_lunge, walking_lunge, bodyweight_split_squat, bulgarian_split_squat: 6 deg ±1)', () => {
    for (const id of ['forward_lunge', 'bodyweight_lunge']) expect(Math.abs(thighDeg(lmOf(S[id], 'end'))), id).toBeLessThanOrEqual(1);
    for (const id of ['forward_lunge', 'walking_lunge', 'bodyweight_split_squat', 'bulgarian_split_squat']) expect(Math.abs(shinDeg(lmOf(S[id], 'end')) - 6), id).toBeLessThanOrEqual(1);
  });
  it('mutation: bodyweight_lunge\'s end hips 5 cm higher breaks the parallel thigh (red)', () => {
    const s = S.bodyweight_lunge, e = s.poses.end, up = { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1] + 0.05, e.root.at[2]] } };
    expect(Math.abs(thighDeg(eng.landmarksOf(up, H)))).toBeGreaterThan(1);
  });
  /** bulgarian c2 "3 foot-lengths" (a distance no fact kind states): the front toe tip 3 engine foot lengths (3 × 0.266 m)
   *  ahead of the bench's front edge, in every pose. */
  const stanceOf = (s: any, p: string) => lmOf(s, p)['toe.r'][2] - (s.equipment.find((e: any) => e?.type === 'bench').at[2] + s.equipment.find((e: any) => e?.type === 'bench').width / 2);
  it('bulgarian_split_squat c2: the front toe 3 foot-lengths (0.798 m ±0.5 cm) ahead of the bench edge; mutation: the bench 10 cm forward is red', () => {
    for (const p of posesOf(S.bulgarian_split_squat)) expect(Math.abs(stanceOf(S.bulgarian_split_squat, p) - 0.798), p).toBeLessThanOrEqual(0.005);
    const b = S.bulgarian_split_squat, moved = { ...b, equipment: b.equipment.map((e: any) => (e?.type === 'bench' ? { ...e, at: [e.at[0], e.at[1], e.at[2] + 0.1] } : e)) };
    expect(Math.abs(stanceOf(moved, 'end') - 0.798)).toBeGreaterThan(0.005);
  });
  /** D-SPLIT-BSSHOVER (#364 6592673388): the end kneecap 3 cm above the floor (±0.5 cm; the height fact), the Mistake's
   *  kneecap resting on the floor, one tell on the resting rear knee, no zoom (the knee's move passes the bar). */
  const hoverProblems = (s: any) => { const e = lmOf(s, 'end')['knee.l'][1] - KC, m = lmOf(s, 'mistake')['knee.l'][1] - KC, t = s.mistake.tells, bad: string[] = [];
    if (Math.abs(e - 0.03) > 0.005) bad.push(`end kneecap gap ${(e * 100).toFixed(2)} cm`);
    if (Math.abs(m) > 0.005) bad.push(`Mistake kneecap gap ${(m * 100).toFixed(2)} cm`);
    if (t.length !== 1 || t[0].key !== 'knee' || t[0].anchor?.at !== 'knee.l' || t[0].anchor?.pose !== 'mistake') bad.push('not one tell on the Mistake rear knee');
    if (s.zoom) bad.push('a zoom');
    return bad; };
  it('bulgarian_split_squat: the end kneecap 3 cm above the floor, the Mistake kneecap resting on it, one rear-knee tell', () => {
    expect(hoverProblems(S.bulgarian_split_squat)).toEqual([]);
  });
  it('mutations: the end kneecap at 0 cm (on the floor) and at +1 cm (4 cm), and the mx30 tells (front knee, shin) with the zoom, are red', () => {
    const b = S.bulgarian_split_squat, at = (dy: number) => ({ ...b, poses: { ...b.poses, end: { ...b.poses.end, root: { ...b.poses.end.root, at: [b.poses.end.root.at[0], b.poses.end.root.at[1] + dy, b.poses.end.root.at[2]] } } } });
    expect(hoverProblems({ ...b, poses: { ...b.poses, end: b.mistake.pose } }).filter(x => x.startsWith('end kneecap gap')).length).toBe(1);
    expect(hoverProblems(at(0.01)).some(x => x.startsWith('end kneecap gap'))).toBe(true);
    const old = { ...b, zoom: { view: 'mistake', k: 1.5, tell: 'knee' }, mistake: { ...b.mistake, tells: [{ key: 'knee', text: 'Front knee forward', anchor: { at: 'knee.r', pose: 'mistake' } }, { key: 'shin', text: 'Shin tips forward', anchor: { along: ['knee.r', 'ankle.r'], t: 0.5, pose: 'mistake' } }] } };
    expect(hoverProblems(old)).toEqual(['not one tell on the Mistake rear knee', 'a zoom']);
  });
  /** R3 (mx30): the near hand and forearm drawn over the near dumbbell (draw order only; the goblet_squat item 1 form). */
  const handOverDbR = (spec: any) => { const v = plate.renderPlate(spec, { id: 'x' }).svg, db = v.lastIndexOf('class="disc"');
    return db > v.lastIndexOf('<use href="#x-e-torso"/>') && v.lastIndexOf('<use href="#x-e-fist.r"/>') > db && v.lastIndexOf('<use href="#x-e-fore.r"/>') > db; };
  it('bulgarian_split_squat R3: the near fist and forearm over the near dumbbell; mutation: the dumbbell at z front is red', () => {
    const b = S.bulgarian_split_squat;
    expect(handOverDbR(b)).toBe(true);
    const front = { ...b, equipment: b.equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const r = e(lm, ctx); return r && r.z === 'mid' ? { ...r, z: 'front' } : r; } : e)) };
    expect(handOverDbR(front)).toBe(false);
  });
  // The Mistakes at the PLAN's sizes (17.2, 17.6), with the landmarks each leaves in place unmoved (≤ 1e-9 m); the rear
  // foot planted on its ball moves only by the plant solve (≤ 0.05 cm).
  const STILL: Record<string, string[]> = {
    forward_lunge: ['ankle.r', 'heel.r', 'ball.r', 'toe.r', 'sole.r'], bodyweight_lunge: ['ankle.r', 'heel.r', 'ball.r', 'toe.r', 'sole.r'],
    bodyweight_split_squat: ['ankle.r', 'heel.r', 'ball.r', 'toe.r', 'sole.r'],
    walking_lunge: ['hips', ...['hip', 'knee', 'ankle', 'heel', 'ball', 'toe', 'sole', 'thighTop', 'thighUnder'].flatMap(k => [`${k}.l`, `${k}.r`])],
    bulgarian_split_squat: ['ankle.l', 'heel.l', 'ball.l', 'toe.l', 'sole.l', 'ankle.r'],   // D-SPLIT-BSSHOVER: the rear knee swings down
  };
  const PLANTED: Record<string, string[]> = { forward_lunge: ['heel.l', 'ball.l', 'toe.l'], bodyweight_lunge: ['heel.l', 'ball.l', 'toe.l'], bodyweight_split_squat: ['heel.l', 'ball.l', 'toe.l'], walking_lunge: [], bulgarian_split_squat: ['heel.r', 'ball.r', 'toe.r'] };
  // the front knee holds within 1 mm (the engine's leg solve against the analytic hip: 0.93 mm, 0.14 px)
  const NEAR: Record<string, string[]> = { bulgarian_split_squat: ['knee.r'] };
  const stillProblems = (s: any) => { const e = lmOf(s, 'end'), m = lmOf(s, 'mistake');
    return [...STILL[s.id]!.filter(k => dist(e[k], m[k]) > 1e-9), ...PLANTED[s.id]!.filter(k => dist(e[k], m[k]) > 0.0005), ...(NEAR[s.id] ?? []).filter(k => dist(e[k], m[k]) > 0.001)]; };
  it('each Mistake moves only what its card names: the listed landmarks unmoved', () => {
    for (const id of SPLIT) { expect(stillProblems(S[id]), id).toEqual([]); expect(LANDMARK_KEYS(lmOf(S[id], 'end')).length, id).toBeGreaterThan(20); }
  });
  it('the Mistake sizes: the front shin at 29.2 deg (forward_lunge, bodyweight_lunge, bodyweight_split_squat), the trunk at 26.9 deg (walking_lunge), the kneecap down onto the floor (bulgarian_split_squat)', () => {
    for (const id of ['forward_lunge', 'bodyweight_lunge', 'bodyweight_split_squat']) expect(shinDeg(lmOf(S[id], 'mistake')), id).toBeCloseTo(29.2, 1);
    expect(trunkDeg(lmOf(S.walking_lunge, 'mistake'))).toBeCloseTo(26.9, 1);
    const b = S.bulgarian_split_squat, e = lmOf(b, 'end'), m = lmOf(b, 'mistake');
    expect(e['knee.l'][1] - m['knee.l'][1]).toBeCloseTo(0.03, 6);   // D-SPLIT-BSSHOVER: the kneecap drops its 3 cm gap
    expect(m['knee.l'][1] - KC).toBeCloseTo(0, 3);
    expect(shinDeg(m)).toBeCloseTo(6, 0);
  });
  it('mutation: forward_lunge\'s Mistake moving the front foot 2 cm is red', () => {
    const s = S.forward_lunge, m = s.mistake.pose;
    expect(stillProblems({ ...s, mistake: { ...s.mistake, pose: { ...m, plant: { ...m.plant, r: { at: [m.plant.r.at[0], 0, 0.02] } } } } })).toContain('heel.r');
  });
});

describe('LIB-SPLIT A5: clearance (D-SPLIT-CLEAR; DESIGN.md 17.4)', { timeout: T }, () => {
  const H = 1.75;
  let equip: any, geomM: any;
  beforeAll(async () => { [equip, geomM] = await Promise.all(['../vendor/engine/equipment.mjs', '../vendor/engine/geom.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const camOf = (s: any) => { const c = plate.renderPlate(s, { id: 'x' }).report.camera;
    return { view: 'side', facing: s.facing ?? 'right', near: 'r', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] }; };
  const inP = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const sD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
  /** Gap (px) between two closed outlines; negative when one holds a vertex of the other. */
  const polyGap = (A: number[][], B: number[][]) => {
    if (A.some(p => inP(B, p)) || B.some(p => inP(A, p))) return -1;
    let d = Infinity;
    for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) { const a0 = A[i]!, a1 = A[(i + 1) % A.length]!, b0 = B[j]!, b1 = B[(j + 1) % B.length]!; d = Math.min(d, sD(a0, b0, b1), sD(a1, b0, b1), sD(b0, a0, a1), sD(b1, a0, a1)); }
    return d;
  };
  const poseOf = (s: any, p: string) => (p === 'mistake' ? { ...s.poses.end, ...s.mistake.pose } : s.poses[p]);
  const shapes = (s: any, p: string, cam: any) => { const b = { height: H }; return body.bodyShapes(body.fk(body.resolve(body.normPose(poseOf(s, p), b), b).q, b), cam).filter((x: any) => x.poly); };
  /** The equipment outlines of one type (the vendor primitive's own polygons) against every body outline but the excepted
   *  contacts, per pose: [pose, part, px]. */
  const clear = (s: any, type: string, except: RegExp) => { const cam = camOf(s), item = s.equipment.find((e: any) => e?.type === type), out: [string, string, number][] = [];
    const eqPolys = equip[type](item, cam).map((x: any) => x.poly).filter(Boolean);
    for (const p of posesOf(s)) for (const sh of shapes(s, p, cam)) if (!except.test(sh.key)) out.push([p, sh.key, Math.min(...eqPolys.map((q: number[][]) => polyGap(q, sh.poly)))]);
    return out; };
  const minOf = (rows: [string, string, number][], pose?: string) => Math.min(...rows.filter(r => !pose || r[0] === pose).map(r => r[2]));
  it('step_up: the box clears every body outline but the lead foot (the c6 contact) by 2 px or more in every pose; the trailing foot standing tall 2.42 px', () => {
    const rows = clear(S.step_up, 'box', /^foot\.r$/);
    expect(rows.length).toBeGreaterThan(30);
    for (const [p, k, d] of rows) expect(d, `${p} ${k}`).toBeGreaterThanOrEqual(2);
    expect(minOf(rows.filter(r => r[1] === 'foot.l'), 'start')).toBeCloseTo(2.42, 1);
  });
  it('mutation: step_up\'s start trailing hip back at 15 (main\'s) is red', () => {
    const s = S.step_up, st = { ...s.poses.start, hip: { ...s.poses.start.hip, l: 15 } };
    expect(minOf(clear({ ...s, poses: { ...s.poses, start: st } }, 'box', /^foot\.r$/), 'start')).toBeLessThan(2);
  });
  it('bulgarian_split_squat: the bench clears every body outline but the rear foot (the c2 contact) by 2 px or more in every pose (end 3.09, Mistake 2.26 px)', () => {
    const rows = clear(S.bulgarian_split_squat, 'bench', /^foot\.l$/);
    for (const [p, k, d] of rows) expect(d, `${p} ${k}`).toBeGreaterThanOrEqual(2);
    expect(minOf(rows, 'end')).toBeCloseTo(3.09, 1);
    expect(minOf(rows, 'mistake')).toBeCloseTo(2.26, 1);
  });
  it('mutation: the Bulgarian rear foot 2 cm back (the instep on the bench edge) is red', () => {
    const s = S.bulgarian_split_squat, back = (p: any) => ({ ...p, plant: { ...p.plant, l: { ...p.plant.l, at: [p.plant.l.at[0], p.plant.l.at[1], p.plant.l.at[2] - 0.02] } } });
    const m = { ...s, poses: { ...s.poses, start: back(s.poses.start), end: back(s.poses.end) }, mistake: { ...s.mistake, pose: back(s.mistake.pose) } };
    expect(Math.min(minOf(clear(m, 'bench', /^foot\.l$/), 'end'), minOf(clear(m, 'bench', /^foot\.l$/), 'mistake'))).toBeLessThan(2);
  });
  // The dumbbells beside the body (the PILOT-A3 A9 model, lib8r-pilot-a3.test.ts): each head its circumscribed cylinder
  // (r 0.0595 m, 0.07 m long, axis z), the thigh the engine's radius profile; listed in cm, each ≥ 0.
  const lerp = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
  const headGap = (G: number[], A: number[], B: number[], r: (t: number) => number) => {
    let best = Infinity;
    for (const sg of [-1, 1]) { const c = [G[0]!, G[1]!, G[2]! + sg * (0.065 + 0.035)];
      for (let k = 0; k <= 400; k++) { const q = lerp(A, B, k / 400), rad = Math.hypot(q[0]! - c[0]!, q[1]! - c[1]!), ax = Math.abs(q[2]! - c[2]!);
        best = Math.min(best, Math.hypot(Math.max(rad - 0.0595, 0), Math.max(ax - 0.035, 0)) - r(k / 400)); } }
    return best;
  };
  const dbListing = (s: any, dx = 0) => { const thR = geomM.limbR(...eng.RADII.thigh);
    return [s.poses.start, ...(s.poses.via ?? []), s.poses.end, poseOf(s, 'mistake')].map((p: any) => { const lm = eng.landmarksOf(p, H);
      return ['l', 'r'].map(sd => { const G = lm[`grip.${sd}`], toward = Math.sign(lm[`hip.${sd}`][0] - G[0]);
        return +(headGap(sd === 'l' ? [G[0] + toward * dx, G[1], G[2]] : G, lm[`hip.${sd}`], lm[`knee.${sd}`], (t: number) => thR(t) * H) * 100).toFixed(2); }); }); };
  // [start, via..., end, Mistake] x [db.l, db.r], cm, measured on this head (DESIGN.md 17.4)
  const LISTED: Record<string, number[][]> = {
    step_up: [[0.91, 1.14], [0.42, 10.15], [11.85, 20.63]],
    forward_lunge: [[1.47, 1.47], [1.52, 0.38], [0.85, 1.78], [0.11, 9.7], [1.74, 8.59]],
    walking_lunge: [[1.47, 1.47], [1.52, 0.39], [0.9, 1.88], [0.09, 9.7], [10.56, 15.18]],
    bulgarian_split_squat: [[0.73, 0.3], [0.98, 9.7], [0.43, 9.7]],   // D-SPLIT-BSSHOVER
  };
  it('every dumbbell clears the thighs in 3D in every drawn pose (listed, each ≥ 0)', () => {
    for (const [id, want] of Object.entries(LISTED)) { const got = dbListing(S[id]);
      expect(got.length, id).toBe(want.length);
      got.forEach((row, i) => row.forEach((v, j) => { expect(v, `${id} ${i} ${j}`).toBeGreaterThanOrEqual(0); expect(v, `${id} ${i} ${j}`).toBeCloseTo(want[i]![j]!, 1); })); }
  });
  it('mutation: the Bulgarian far dumbbell 2 cm toward the rear thigh turns the listing negative', () => {
    expect(dbListing(S.bulgarian_split_squat, 0.02).some(row => row[0]! < 0)).toBe(true);
  });
});

describe('LIB-SPLIT A4 and A6: runQa node half on the 6 plates, H3 pinned at the PLAN sizes, the Bulgarian zoom, LIB-3 M1-M7 on forward_lunge', { timeout: T }, () => {
  const IDS6 = ['step_up', ...SPLIT].map(i => `lib_${i}`);
  // traceLen and deviation (px) at the PLAN sizes, from runQa's metrics on this head (DESIGN.md 17.10)
  const PIN: Record<string, [number, number]> = {
    lib_step_up: [59.07, 30.24], lib_forward_lunge: [86.14, 25.32], lib_walking_lunge: [91.06, 42.36], lib_bodyweight_lunge: [91.1, 18.83],
    lib_bodyweight_split_squat: [32.12, 25.32], lib_bulgarian_split_squat: [24, 11.63],   // D-SPLIT-BSSHOVER: the rear knee's drop
  };
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb4/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb4All();
    html = await lb4BuildInChild(`return (await b.buildLb4Page({ all: b.lb4All(), ids: ${JSON.stringify(IDS6)} })).html;`);
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins: pins() });
  const candOf = (id: string, page = html) => cand.candidateOf(id, { all, platesHtml: page, engine: E, authoring: true });
  /** A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn. */
  const mutated = async (id: string, fn: string, arg: any = null) => {
    const name = id.slice(4), dir = mkdtempSync(join(tmpdir(), 'lb4-split-mut-')), file = join(dir, `${name}.mjs`);
    writeFileSync(file, `import s, * as mod from ${JSON.stringify(lib(`specs/${name}.mjs`))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)}, mod);\n`);
    try {
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === id));
      const h = await lb4BuildInChild(`const bp = await import(lib('build-page.mjs')), cid = ${JSON.stringify(cid)};
        return (await bp.buildPlatesPage({ groups: [{ id: 'lb4', title: 'LB4', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: ${JSON.stringify(file)} } })).html;`);
      return { ...(await candOf(id, h)), spec: (await import(/* @vite-ignore */ `file://${file}`)).default };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: every hard check\'s node half passes on all 6; Trace and deviation pinned; only the Bulgarian plate carries a zoom (Mistake, k 1.5)', async () => {
    const got: Record<string, [number, number]> = {};
    for (const id of IDS6) { const r = await qa(await candOf(id)); expect(node(r), id).toEqual([]); got[id] = [+r.metrics.traceLen.toFixed(2), +r.metrics.deviation.toFixed(2)]; }
    for (const id of IDS6) { expect(got[id]![0], id).toBeGreaterThanOrEqual(22.11); expect(got[id]![1], id).toBeGreaterThanOrEqual(11.39); }
    for (const [id, [t, d]] of Object.entries(PIN)) { expect(got[id]![0], `${id} trace`).toBeCloseTo(t, 2); expect(got[id]![1], `${id} deviation`).toBeCloseTo(d, 2); }
    expect(Object.keys(PIN).sort(), JSON.stringify(got)).toEqual([...IDS6].sort());
    for (const id of SPLIT) expect(S[id].zoom ?? null, id).toEqual(null);   // D-SPLIT-BSSHOVER: bulgarian's knee move passes the bar
  });
  it('mutations: a Mistake zoom added to bulgarian_split_squat (D-SPLIT-BSSHOVER) and to bodyweight_split_squat (H3.zoom:not-needed:mistake; walking_lunge\'s Mistake plate has no zoom place at all), are red', async () => {
    const b = await mutated('lib_bulgarian_split_squat', '(s) => ({ ...s, zoom: { view: \'mistake\', k: 1.5 } })');
    expect(node(await qa(b))).toContain('H3.zoom:not-needed:mistake');
    const w = await mutated('lib_bodyweight_split_squat', '(s) => ({ ...s, zoom: { view: \'mistake\', k: 1.5 } })');
    expect(node(await qa(w))).toContain('H3.zoom:not-needed:mistake');
  });
  it('mutations: forward_lunge\'s Mistake shin at 12 deg and walking_lunge\'s trunk at 9 deg (3 + 6) turn H3.deviation red', async () => {
    const f = await mutated('lib_forward_lunge', '(s, a, mod) => ({ ...s, mistake: { ...s.mistake, pose: mod.mistakeAt(a) } })', 12);
    expect(node(await qa(f))).toContain('H3.deviation');
    const w = await mutated('lib_walking_lunge', '(s, a, mod) => ({ ...s, mistake: { ...s.mistake, pose: mod.mistakeAt(a) } })', 9);
    expect(node(await qa(w))).toContain('H3.deviation');
  });
  const ID = 'lib_forward_lunge', fl = () => S.forward_lunge;
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  it('A6 M1 a label 1 px onto the figure (the Back straight callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = fl().callouts.find((x: any) => x.key === 'back'), at = (box: any) => ({ ...fl(), callouts: fl().callouts.map((x: any) => (x.key === 'back' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[-1, 0], [0, 1], [0, -1], [1, 0]]) {
      for (let d = 1; d <= 120 && !hit; d++) {
        const box = { left: c0.box.left + dx! * d, top: c0.box.top + dy! * d }, is = plate.renderPlate(at(box), { id: 'm' }).report.issues;
        if (is.some((i: string) => !i.startsWith(`figure:${c0.text}`))) break;
        if (is.length) hit = { box, clean: { left: box.left - dx!, top: box.top - dy! } };
      }
      if (hit) break;
    }
    expect(hit).toBeTruthy();
    expect(plate.renderPlate(at(hit.clean), { id: 'm' }).report.issues).toEqual([]);
    expect(node(await qa({ ...(await candOf(ID)), spec: at(hit.box) })).some((k: string) => k.startsWith('H1.engine:normal:figure:'))).toBe(true);
  });
  it('A6 M2 a contact 1 cm off (the floor plane under the front heel moved 1.1 cm along its normal) turns PQ-H1 red', async () => {
    const shift = (s: any) => ({ ...s, checks: s.checks.map((k: any) => (k.landmark !== 'heel.r' || !k.plane ? k : { ...k, plane: { ...k.plane, point: k.plane.point.map((v: number, i: number) => v + k.plane.normal[i] / Math.hypot(...k.plane.normal) * 0.011) } })) });
    expect(node(await qa({ ...(await candOf(ID)), spec: shift(fl()) })).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A6 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = MUT('M3').prepare(E, fl(), pins().envelope);
    expect(node(await qa(await mutated(ID, '(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a)))).toContain('H3.trace');
  });
  it('A6 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    expect(node(await qa(await mutated(ID, 's => ({ ...s, mistake: { ...s.mistake, pose: {} } })')))).toContain('H3.mistake-outline');
  });
  it('A6 M5 the start equal to the end pose turns PQ-H3 red', async () => {
    expect(node(await qa(await mutated(ID, 's => ({ ...s, poses: { ...s.poses, start: s.poses.end } })')))).toContain('H3.start-is-end');
  });
  it('A6 M6 an unapproved type (rackUpright) as a moving line part turns PQ-H9 red', async () => {
    const extra = (lm: any, ctx: any) => ({ type: 'rackUpright', at: [0.5, 0, ctx.pose === 'mistake' ? -1.3 : -1.22], h: 0.5 });
    expect(node(await qa({ ...(await candOf(ID)), spec: { ...fl(), equipment: [...fl().equipment, extra] } })).some((k: string) => k.startsWith(`H9.moving-line:eq${fl().equipment.length}.rackUpright.`))).toBe(true);
  });
  it('A6 M7 an unknown equipment type turns PQ-H9 red', async () => {
    expect(node(await qa({ ...(await candOf(ID)), spec: { ...fl(), equipment: [...fl().equipment, { type: 'rope3d', at: [0, 0, 0] }] } })).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('A6 flags: F4 is named at 1 on step_up and bodyweight_split_squat only (PLAN RULED Q3); F4 2 on step_up, or 1 elsewhere, is red', async () => {
    const lb4qa = await import(/* @vite-ignore */ lib('lb4/qa.mjs'));
    const rep = (id: string, f4: number | null) => { const x: any = { id, flags: Object.fromEntries(qaIdx.FLAGS.map((f: string) => [f, { raised: false }])) }; x.flags.F5 = { raised: true, value: 3.57 }; if (f4 != null) x.flags.F4 = { raised: true, value: f4 }; return x; };
    expect(lb4qa.flagProblems([rep('lib_step_up', 1), rep('lib_bodyweight_split_squat', 1), rep('lib_forward_lunge', null)])).toEqual([]);
    expect(lb4qa.flagProblems([rep('lib_step_up', 2)])).toEqual(['lib_step_up: F4 2 != the named 1']);
    expect(lb4qa.flagProblems([rep('lib_forward_lunge', 1)])).toEqual(['lib_forward_lunge: flags F4,F5 != expected F5']);
    expect(lb4qa.flagProblems([rep('lib_step_up', null)])).toEqual(['lib_step_up: flags F5 != expected F4,F5']);
  });
});

describe('LIB-SPLIT A2: the 5 rows approved in panel mx28 (#364 6585103107, head 9f772a09) stay byte-identical', { timeout: T }, () => {
  // golden.mjs fragmentsOf of step_up, forward_lunge, walking_lunge, bodyweight_lunge and bodyweight_split_squat on the
  // LB4 page a3d8098e…f366 built at 9f772a09 (45 fragments; the LIB-SMALL A2 form).
  const APPROVED: Record<string, Record<string, string>> = {
    "step-up": {
      "normalSvg": "9bffea48f5e857b37e7ae199d9dabe0d4d26115fac1250ca0291ffb1a2f86324",
      "normalOverlay": "1f4d76a592d00187cdfdcffb67e8f6a4e1563c57aae988a4df40be2427315eea",
      "mistakeSvg": "4fa8a2a236aeaaaa59245089c9105bcd22ab3478c78dde1b4cc60f74158e9fc5",
      "mistakeOverlay": "18fd4b60ff86004583339b2c0fa95ff89130559bcf4518de6fea4166fe8de979",
      "tells": "8fdf4a24934b50822201a42f062bbfcfa873afa15727fcc42a54eaac84cc017f",
      "tempo": "cfa4a0ab2667ca0875d0232447ce76260179fb165b22bf6932aa7cdc38ca9970",
      "cues": "134191d38096b80886c14e3c9de6a67f13aa924cc3422dc4c755a61a21642eed",
      "alt": "2b7a89b088e00be3a4d7d2eece0288433d2b448ee0ddf34a76bac6c01ba2eb64",
      "mistakeAlt": "3e23df00e6153acda6b1919000667b70c9745d0e62ef2b79b6063d7a34682625"
    },
    "forward-lunge": {
      "normalSvg": "397d5d8760d45fb95218f84bd7b3f836967478b77cc446163a096403c207a172",
      "normalOverlay": "f837eaa304167645cd85e865fd84f3994fadb64cd47598ca8d2e64b46da65b05",
      "mistakeSvg": "c8bdd35591de246d5ce2371321000ef54d18b55bdbcebb87fe910886569ce3ef",
      "mistakeOverlay": "ac269346c5ceebf873779293043be1c3ef22f4e1b46f0e96963b9595ec82f6f6",
      "tells": "a7017e3051dbe13d57596d99b3e21b6e8b17994be791a2e206c29c5dec5d3038",
      "tempo": "7bb4525ced07b239847fa65721dcb1105745f498e178246dd223bc3de40c81fa",
      "cues": "025f16cdb5f7da9e29dba05dbc34c548eb205ba7a1b8c8d9d38bc545c5534a3e",
      "alt": "606b11fe23466ab09e74207f576e1070ef2bf792c4ae86a839befbd396209f28",
      "mistakeAlt": "f373dc5ae08e7fe058d888006c743d13c1a45ec2ff1ddc55ba906970f9023b8e"
    },
    "walking-lunge": {
      "normalSvg": "225043a316db6ea4cacfbad7918d6c60f011d34fbae2f3cc3304e2a50981cd4d",
      "normalOverlay": "ade4813a7985c93d4d2e155370023f2f5212266ea79f00b1a47cf339b817bdae",
      "mistakeSvg": "e7fcab3fae26c8b269787d35c0cfea03afb7e0e48c3f8e61b32b505f56504195",
      "mistakeOverlay": "5403ae2aa179b34a36998c4197b64161794796022048259c6371ad959390f766",
      "tells": "13748f245a328bc32feba4fc0343136d66bbe0e35c41682acea909810697f440",
      "tempo": "5be2b84ec4eb55f9a8bae12552d0194298af05d03f9a6099ca4524660c1a0e5d",
      "cues": "0908549aaaee69cce627d7ef0a4d64194bcd677d0e784d3b8dddedd7b6ec2407",
      "alt": "42c5a2f8812ad35841c21e940bc13b504db9928b6cede1474fdf6050c3b9747b",
      "mistakeAlt": "cc9d9faf06b2e4c55e3f6bec39cf6b159274d9e102c92ac08a0feabf72f37eee"
    },
    "bodyweight-lunge": {
      "normalSvg": "6c3ce14bf43527130456107938341c03e869888ade1badf9db2f0a982a66b7b2",
      "normalOverlay": "84b431a7e5f36b880761f8d0c833086d615fe23a69f41af6b82a5f7664651b47",
      "mistakeSvg": "6961bc1bbdae7fa3140c195ebda0ba283e462dc19904de796dc97e6288d086a6",
      "mistakeOverlay": "ffe30a46452711bad24d95c7f1e1061f5a97d0af2b633b7651e21bc3c2899c00",
      "tells": "a7017e3051dbe13d57596d99b3e21b6e8b17994be791a2e206c29c5dec5d3038",
      "tempo": "52d36f0a4dbecdf89a0ca6c54a6231bd731998818468da0e17bfceac30615eef",
      "cues": "841871aca4d1fc3e742ce35fb917ac6dafdf181c23d3960fc9dce8a44946051e",
      "alt": "77a929da36e03e0f778b3424828ca3e6bbbdd39d5b91e199517de2a8b3aed647",
      "mistakeAlt": "9e54baf15b72f997c5b8599aebe6ddd598e34812251626cc474e8c9e2cae7864"
    },
    "bodyweight-split-squat": {
      "normalSvg": "ed74798f818a70f3ceb9b89c451632678b885579d4bf79c70c7964958732e0d6",
      "normalOverlay": "9916b82b111da83bfe6568981e168784ebb73a509c6218e29cfe76dbe5006812",
      "mistakeSvg": "c52888e75843bc1e76e5e63de54ae9ebf8132721efd2546e40fa143873f85421",
      "mistakeOverlay": "96dd2540bee7f098643816ef474281d05ef35b3d274e35c4eb99210937042584",
      "tells": "74bcab68829d90f431aea0471490cde87fb216a9844ecd29d21195f9fd94b8d7",
      "tempo": "88229cbe363b3a7de7ddd1c67addcadf7b85cad1cf602121147bf73462a63a2d",
      "cues": "a3ce996975a39a8dd6b7a1c146188b260db0c1a57dafa51ee34c15ca1b317400",
      "alt": "1dfc876b56caf7c1256f0137bafad7a44e01ed0c88148b8c2dc95e41bfa06c27",
      "mistakeAlt": "f167659a4d7be13f31dc195b19920996863c0d616973bd09c125d3074991b404"
    }
  };
  let golden: any;
  beforeAll(async () => { golden = await import(/* @vite-ignore */ lib('../golden.mjs')); }, T);
  const fragProblems = (html: string) => Object.entries(APPROVED).flatMap(([c, want]) => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`);
  });
  it('their 45 fragments on this head equal the approved ones', async () => {
    expect(Object.values(APPROVED).reduce((n, x) => n + Object.keys(x).length, 0)).toBe(45);
    expect(fragProblems(await lb4PageInChild())).toEqual([]);
  });
  it('mutation: one byte changed in walking_lunge\'s alt is red', async () => {
    const html = await lb4PageInChild(), alt = S.walking_lunge.alt;
    expect(html.includes(alt)).toBe(true);
    expect(fragProblems(html.replace(alt, alt.replace('Walking lunge', 'Walking lungE')))).toContain('walking-lunge alt');
  });
});

describe('LIB-SPLIT A2: bulgarian_split_squat as approved in panel mx31 (#364 6595403393, head 7f8afd68) stays byte-identical', { timeout: T }, () => {
  // golden.mjs fragmentsOf of bulgarian_split_squat on the LB4 page 38750fee…67e4 built at 7f8afd68 (9 fragments).
  const APPROVED: Record<string, Record<string, string>> = {
    "bulgarian-split-squat": {
      "normalSvg": "fbd896b85d8bf04d32185ff85e6cd802e29e61d10615f58e7454e9c214a01946",
      "normalOverlay": "d5f3b567f68d8fe33c9001a17707fb81bd67d4986d72548ad280861ef845ee40",
      "mistakeSvg": "268dca12faffd1fa6b92bd340737073ef038c9473cb1aa32923d77e685c60d29",
      "mistakeOverlay": "f6aca0d82dfc5e31dd0fe3b608745a3028cb60bdcadde81dd7bbd954c9f275e5",
      "tells": "c7aaf7b87df630811b7faf9bbb63bb8fcf6323e6fc7fb4a453e8663af7751887",
      "tempo": "a50b50e7ec7b35d22bc21c16497750d5d5ee1a1096921e8fed7a370cf92e305a",
      "cues": "b2eabfacf9a601cfefb7a02c4414189e7675edd2417683cdddb69ad5b15e26ff",
      "alt": "125ed79b6854cea07c42177a7c601d487035d825e6cd84b0ddcbcd682d23a786",
      "mistakeAlt": "b7b6a8a37b969a44eadb3ba34811da5c34bce618a7dc5f0c270a4bee40df5477"
    }
  };
  let golden: any;
  beforeAll(async () => { golden = await import(/* @vite-ignore */ lib('../golden.mjs')); }, T);
  const fragProblems = (html: string) => Object.entries(APPROVED).flatMap(([c, want]) => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`);
  });
  it('its 9 fragments on this head equal the approved ones', async () => {
    expect(Object.values(APPROVED).reduce((n, x) => n + Object.keys(x).length, 0)).toBe(9);
    expect(fragProblems(await lb4PageInChild())).toEqual([]);
  });
  it('mutation: one byte changed in its alt is red', async () => {
    const html = await lb4PageInChild(), alt = S.bulgarian_split_squat.alt;
    expect(html.includes(alt)).toBe(true);
    expect(fragProblems(html.replace(alt, alt.replace('Bulgarian split squat', 'Bulgarian split squaT')))).toContain('bulgarian-split-squat alt');
  });
});
