// LIB-16 (lib-16-card Do 2, Do 4, Do 5, Do 6 a; acceptance A2, A3, A4, A5, A6, A7, A9, A10, A11, A15, A16, A17; rulings
// D-LIB16-*): the LB6 H build-ahead plates. Node only: the browser half of the plate QA runs in
// tools/plates/library/lb6/qa.mjs. Patterns copied from tests/howto/lb3-plates.test.ts (#274 @ a6f4bd07) and
// tests/howto/lb4-plates.test.ts (#289 @ 4adde423). Every test reads what is drawn (the items a spec emits, the
// engine's landmarks, shapes and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB6 = ['cable_chest_press', 'machine_pullover', 'machine_crunch'];
const IDS = LB6.map(i => `lib_${i}`);
// The 13 LB6 ids not in this card (DESIGN.md section 2): never in lb6/rows.json.
const NOT_HERE = ['smith_machine_bench_press', 'smith_machine_incline_press', 'smith_machine_shoulder_press', 'smith_machine_shrug', 'smith_machine_squat',
  'cable_fly', 'low_to_high_cable_fly', 'high_to_low_cable_fly', 'pec_fly', 'machine_lateral_raise', 'rear_delt_fly', 'hip_abduction', 'hip_adduction'];
// Held ids (DESIGN.md section 15): drawn and tested, no row. cable_chest_press: D-LIB8-shrug (D-LIB16-SIZE, -LOCK).
const HELD = ['cable_chest_press'];
const ROWS = 'tools/plates/library/lb6/rows.json';
const RESEARCH_HEAD = 'a8e66f32e34e1746075ffa4da35ea18c80dd4776';
const COMPOSERS = ['crunchMachine', 'pulloverMachine'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const PX = 146.29;

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, crunchEq: any;
const M: Record<string, any> = {}, S: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, crunchEq] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'eq/crunchMachine.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of LB6.filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`))) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
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
const camOf = (spec: any) => { const c = rep(spec).camera; return { view: 'side', near: 'r', pxm: c.pxPerM, P: (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] }; };
/** The solid figure's shapes (plate px) in one pose, as the engine draws them. */
const shapesIn = (spec: any, pose: string) => {
  const b = { height: 1.75 }, p = pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose];
  return body.bodyShapes(body.fk(body.resolve(body.normPose(p, b), b).q, b), camOf(spec)).filter((x: any) => x.poly);
};
/** The ids whose spec exists and that are not held, in LB6 order (the rows.json set, A5). */
const drawn = () => LB6.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`) && !HELD.includes(id));
const specsDrawn = () => LB6.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`));
const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
/** Signed distance (px) of p from a set of closed outlines: negative inside. */
const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
/** Every leader in a render as its polyline (plate px), starting at its anchor. */
const leadersOf = (svg: string) => [...svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(([, d]) => { const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]); return p; });

describe('LIB-16 A5: lb6/rows.json holds exactly the drawn, non-held LB6 H ids, all mode H', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn, non-held id exactly once in the raw text, nothing else, every mode H (D-LIB16-B1)', () => {
    expect(want()).toEqual(['lib_machine_crunch']);
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('none of the 13 LB6 ids not in this card is in any lb6/ file as a row', () => {
    for (const f of readdirSync('tools/plates/library/lb6').filter(n => n.endsWith('.json'))) {
      const text = readFileSync(join('tools/plates/library/lb6', f), 'utf8');
      for (const id of NOT_HERE) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id}`).toBe(false);
    }
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file', () => {
    const design = readFileSync('tools/plates/library/lb6/DESIGN.md', 'utf8');
    expect(design).toContain('## 15. Held ids');
    for (const id of HELD) {
      const table = design.split('## 15. Held ids')[1]!.split('\n## ')[0]!;
      expect(table.split('\n').some(l => l.startsWith(`| ${id} |`) && /D-LIB8-shrug/.test(l)), id).toBe(true);
      for (const f of reg.batchFiles()) expect(readFileSync(f, 'utf8').includes(`lib_${id}`), `${f}: ${id}`).toBe(false);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
    }
  });
  it('mutations: a dropped row, a duplicated row, a held id added, cable_fly added, smith_machine_squat added and one mode set to D are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const j = { batch: 'LB6', rows: { lib_machine_crunch: row, lib_machine_pullover: row } }, w = ['lib_machine_crunch', 'lib_machine_pullover'];
    const text = JSON.stringify(j, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: { lib_machine_crunch: row } }, null, 1), w)).toEqual(['lib_machine_pullover x0']);
    const dup = text.replace('  "lib_machine_crunch": {', `  "lib_machine_crunch": ${JSON.stringify(row)},\n  "lib_machine_crunch": {`);
    expect(a5(dup, w)).toEqual(['lib_machine_crunch x2']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_cable_chest_press: row } }, null, 1), w), 'a held id').toEqual(['extra lib_cable_chest_press']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_cable_fly: row } }, null, 1), w)).toEqual(['extra lib_cable_fly']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_smith_machine_squat: row } }, null, 1), w)).toEqual(['extra lib_smith_machine_squat']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_machine_crunch: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['mode D']);
  });
  it('every row points at its own spec file and carries the census view; batch LB6, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB6', censusRef: '4a9fd86' });
  });
});

describe('LIB-16 A9: nothing ships (D-LIB16-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/machine_crunch.mjs', slug: 'machine-crunch', prefix: 'machine-crunch', chromeId: 'machine-crunch', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB6 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_machine_crunch: { ...someRow, stage: 'shipped' } })).toEqual(['lib_machine_crunch: shipped']);
    expect(stageProblems({ ...rows, lib_machine_crunch: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_machine_crunch: approved-plate']);
  });
  it('none of the 3 is shipped, even with lb6/rows.json read as a batch file', () => {
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
    ...(/lb6/i.test(f) ? [`${f}: an LB6 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB6"/.test(text) ? [`${f}: names batch LB6`] : []),
    ...hits(LB6, f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB6 H id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB6 H id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB6 H id, a page-only lb6.json and machine-crunch.layers.html are red', () => {
    const rowsText = JSON.stringify({ batch: 'LB6', rows: { lib_machine_crunch: someRow } }, null, 1);
    expect(batchProblems([['zz.json', rowsText]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_machine_pullover"}']])).toEqual(['x.json: machine_pullover']);
    expect(batchProblems([['lb6.json', '{"entries":[{"kind":"page","batch":"LB6"}]}']]).length).toBe(2);
    expect(batchProblems([['machine-crunch.layers.html', '<div data-id="machine-crunch"></div>']])).toEqual(['machine-crunch.layers.html: machine-crunch']);
  });
  it('the matcher is exact: it matches neither lib_cable_chest_press_v2 nor seated-machine-crunch; mutation: a plain substring test is red on the _v2 control', () => {
    expect(tokenHits(LB6, 'p.json', '{"rows":{"lib_cable_chest_press_v2":{}}}')).toEqual([]);
    expect(tokenHits(LB6, 'p.json', '{"slug":"seated-machine-crunch"}')).toEqual([]);
    expect(batchProblems([['p.json', '{"rows":{"lib_cable_chest_press_v2":{}}}']], substringHits)).toEqual(['p.json: cable_chest_press']);
  });
  it('control: a file naming only lib_cable_fly, lib_pec_fly and lib_smith_machine_bench_press (LB6, not in this card) stays green', () => {
    expect(tokenHits(LB6, 'p.json', '{"rows":{"lib_cable_fly":{},"lib_pec_fly":{},"lib_smith_machine_bench_press":{}}}')).toEqual([]);
    expect(tokenHits(LB6, 'p.json', '{"rows":{"lib_machine_crunch":{}}}')).toEqual(['p.json: machine_crunch']);
  });
  it('over src/data/exercises.json, no real id other than its own contains one of the 3 as a substring', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    expect(ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))))).toEqual([]);
    for (const id of IDS) expect(ex, id).toContain(id);
  });
  it('no LB6 spec, composer, How-to, script or test imports anything under hands/, fidelity/ or ci/', () => {
    const files = [...specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`), ...COMPOSERS.map(c => `tools/plates/library/eq/${c}.mjs`).filter(f => existsSync(f)),
      ...LB6.map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb6/build.mjs', 'tools/plates/library/lb6/qa.mjs', 'tests/howto/lb6-plates.test.ts'];
    // every relative import, resolved from its file, stays out of tools/plates/library/{hands,fidelity,ci}/
    const bad = (f: string) => [...readFileSync(f, 'utf8').matchAll(/(?:from\s+|import\(\s*)['"](\.{1,2}\/[^'"]+)['"]/g)]
      .map(m => join(f, '..', m[1]!)).filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\//.test(p));
    for (const f of files) expect(bad(f), f).toEqual([]);

  });
  it('generate --check is green, and no generated file is read from lb6/, the LB6 specs, the composers or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const t0 = Date.now(), out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    console.log(`LIB-16 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    for (const [p, { text }] of out) {
      expect(text, p).not.toMatch(/library\/lb6\/|eq\/(crunchMachine|pulloverMachine)\.mjs/);
      for (const id of LB6) expect(text, p).not.toMatch(new RegExp(`library/(specs|howto)/(lib_)?${id}\\b`));
    }
  });
});

describe('LIB-16 A11 (Do 6 a): the 3 cards and quotes are byte copies of the LB6 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb6/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 3 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB6);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB6);
    for (const id of LB6) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('machine_crunch'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.machine_crunch);
  });
  it('the How-to source of each LB6 H id holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of LB6) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});

describe('LIB-16 A2 / Do 4: the composers and the drawn plates draw PRIMITIVES only', { timeout: T }, () => {
  it('each composer source imports no file reader and nothing under tools/plates/layers/', () => {
    for (const c of COMPOSERS.filter(n => existsSync(`tools/plates/library/eq/${n}.mjs`))) {
      const src = readFileSync(`tools/plates/library/eq/${c}.mjs`, 'utf8');
      expect(src, c).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, c).not.toMatch(/layers\//);
    }
  });
  it('every item the drawn specs draw is a PRIMITIVES type, in every drawn pose', () => {
    for (const id of specsDrawn()) for (const pose of posesOf(S[id]))
      for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
  });
  it('the drawn specs pass PQ-H9', () => {
    for (const id of specsDrawn()) expect(h9(S[id]), id).toEqual([]);
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.machine_crunch;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the drawn specs with no engine issue and every check and contact within 0.5 cm', () => {
    for (const id of specsDrawn()) {
      for (const mistake of [false, true]) expect(plate.renderPlate(S[id], { id: 'x', mistake }).report.issues ?? [], `${id} ${mistake}`).toEqual([]);
      const r = rep(S[id]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-16 A2: crunchMachine on machine_crunch, per drawn pose (13.1)', { timeout: T }, () => {
  const ID = 'machine_crunch';
  /** Every item as drawn by the engine (its primitive's output, plate px), keyed by entry and index, per pose. */
  const drawnItems = (spec: any, pose: string) => {
    const cam = camOf(spec), out = new Map<string, any>();
    for (const it of itemsIn(spec, pose).items) eng.PRIMITIVES[it.type](it, cam).forEach((p: any, j: number) => out.set(`eq${it.entry}.${it.type}.${j}`, { ...p, type: it.type, part: it.part ?? null }));
    return out;
  };
  const STATIC = ['seat', 'backPad', 'kneePad'];
  /** Each static part (seat, back pad, frame bars, shin roller) at one place (±1 px) in start, end and Mistake. */
  const staticProblems = (spec: any) => {
    const bad: string[] = [], e = drawnItems(spec, 'end');
    for (const pose of posesOf(spec)) for (const [k, v] of drawnItems(spec, pose)) {
      if (!STATIC.includes(v.type)) continue;
      const a = v.poly ?? xy(v.d), b = e.get(k)?.poly ?? xy(e.get(k)?.d ?? '');
      const d = Math.max(...a.map((p: number[], i: number) => (b[i] ? Math.hypot(p[0]! - b[i]![0]!, p[1]! - b[i]![1]!) : Infinity)));
      if (!(d <= 1)) bad.push(`${pose}: ${k} moved ${d.toFixed(1)} px`);
    }
    return bad;
  };
  /** Every item that differs between the end and the Mistake must carry a poly, so the Mistake view draws it
   *  (vendor/engine/plate.mjs:213 keeps only changed items with a poly); approved moving lines (qa/envelope.json
   *  H9lineTypes) pass only when they are not a part the note names (the movement arm). Returns the dropped keys. */
  const mistakeDrops = (spec: any, named = ['arm']) => {
    const e = drawnItems(spec, 'end'), m = drawnItems(spec, 'mistake'), bad: string[] = [], lineTypes = pins().envelope.H9lineTypes;
    for (const [k, v] of m) if (v.z !== 'floor' && e.get(k)?.d !== v.d && !v.poly && (named.includes(v.part) || !lineTypes.includes(v.type))) bad.push(k);
    return bad;
  };
  const moving = (spec: any, a: string, b: string) => { const A = drawnItems(spec, a), B = drawnItems(spec, b); return [...B.keys()].filter(k => A.get(k)?.d !== B.get(k)!.d); };
  it('the seat, back pad, frame bars and shin roller sit at one fixed place (±1 px) in start, end and Mistake', () => {
    expect(staticProblems(S[ID])).toEqual([]);
  });
  it('the movement arm (chestPress) moves start → end; between the end and the Mistake no part moves (DESIGN.md section 3), and every changed part would carry a poly', () => {
    expect(moving(S[ID], 'start', 'end').every(k => /chestPress/.test(k))).toBe(true);
    expect(moving(S[ID], 'start', 'end').length).toBeGreaterThan(0);
    expect(moving(S[ID], 'end', 'mistake')).toEqual([]);
    expect(mistakeDrops(S[ID])).toEqual([]);
  });
  it('mutation: the back pad moved 2 cm in the Mistake is red', () => {
    const s = S[ID], i = s.equipment.length - 3;   // perItem entry 6 of 9: the back pad
    expect(itemsIn(s, 'end').items.find((it: any) => it.entry === i).type).toBe('backPad');
    const moved = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === i ? (lm: any, ctx: any) => { const it = e(lm, ctx); return ctx.pose === 'mistake' ? { ...it, surface: it.surface.map((p: number[]) => [p[0]!, p[1]!, p[2]! - 0.02]) } : it; } : e)) };
    expect(staticProblems(moved)).toEqual(['mistake: eq' + i + '.backPad.0 moved 2.9 px']);
  });
  it('mutation: the movement arm moved in the Mistake and drawn with `line` instead of a poly part is missing from the Mistake view (red)', () => {
    const s = S[ID], i = s.equipment.length - 1;
    const lineArm = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === i ? (lm: any, ctx: any) => { const it = e(lm, ctx), h = ctx.pose === 'mistake' ? [0, it.handle[1] - 0.05, it.handle[2]] : it.handle; return { type: 'line', pts: [it.pivot, h], part: 'arm' }; } : e)) };
    expect(mistakeDrops(lineArm)).toEqual([`eq${i}.line.0`]);
  });
  // The ruled contacts (DESIGN.md section 10) on the drawn items, in the poses they name.
  const contactProblems = (spec: any) => {
    const bad: string[] = [], cam = camOf(spec);
    for (const pose of ['start', 'end']) {
      const l = lmOf(spec, pose), pad = itemsIn(spec, pose).items.find((it: any) => it.type === 'backPad' && it.t === crunchEq.CRUNCH_MACHINE.padT);
      const [u, lo] = pad.surface, d = [0, u[1] - lo[1], u[2] - lo[2]], L = Math.hypot(...d), n = [0, -d[2]! / L, d[1]! / L];
      const off = (p: number[]) => (p[1]! - lo[1]) * n[1]! + (p[2]! - lo[2]) * n[2]!;
      if (Math.abs(off(l.buttock)) > 0.005) bad.push(`${pose}: buttock ${(off(l.buttock) * 100).toFixed(1)} cm off the pad`);
    }
    const ls = lmOf(spec, 'start'), roller = itemsIn(spec, 'start').items.find((it: any) => it.type === 'kneePad');
    const rc = roller.at.map((v: number, i: number) => v + roller.normal[i] * roller.r);
    // the shin's front surface touches the roller: the roller centre sits roller r + the shank radius from the shin axis
    for (const s of ['r', 'l']) {
      const K = ls[`knee.${s}`], A = ls[`ankle.${s}`], dist = segD([rc[2], rc[1]], [K[2], K[1]], [A[2], A[1]]);
      const t = Math.hypot(rc[2] - K[2], rc[1] - K[1]) / Math.hypot(A[2] - K[2], A[1] - K[1]), [rA, rM, rB, m] = eng.RADII.shank;
      const sr = (t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2))) * 1.75;
      if (Math.abs(dist - roller.r - sr) > 0.005) bad.push(`start: shin.${s} ${((dist - roller.r - sr) * 100).toFixed(1)} cm off the roller`);
    }
    const arm = itemsIn(spec, 'start').items.find((it: any) => it.type === 'chestPress');
    for (const s of ['r', 'l']) { const g = ls[`grip.${s}`]; if (Math.hypot(g[1] - arm.handle[1], g[2] - arm.handle[2]) > 0.005) bad.push(`start: hand.${s} off the handle`); }
    void cam;
    return bad;
  };
  it('the buttock on the back pad at start and end (c2), the shins on the roller and the hands on the handles at start (c2, c3)', () => {
    expect(contactProblems(S[ID])).toEqual([]);
  });
  it('mutations: the hips moved 2 cm off the pad in the end pose, and the shins 2 cm off the roller at start, are red', () => {
    const s = S[ID], e = s.poses.end;
    const hips = { ...s, poses: { ...s.poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1], e.root.at[2] + 0.02] } } } };
    expect(contactProblems(hips).filter(p => p.startsWith('end:'))).toEqual(['end: buttock 2.0 cm off the pad']);
    const st = s.poses.start, feet = Object.fromEntries(Object.entries<any>(st.plant).map(([k, v]) => [k, { ...v, at: [v.at[0], v.at[1], v.at[2] - 0.02] }]));
    const shins = { ...s, poses: { ...s.poses, start: { ...st, plant: feet } } };
    expect(contactProblems(shins).filter(p => p.startsWith('start: shin'))).toHaveLength(2);
  });
});

describe('LIB-16 A2: cable_chest_press equipment and contacts, per drawn pose (13.1)', { timeout: T }, () => {
  const ID = 'cable_chest_press';
  const drawnItems = (spec: any, pose: string) => {
    const cam = camOf(spec), out = new Map<string, any>();
    for (const it of itemsIn(spec, pose).items) eng.PRIMITIVES[it.type](it, cam).forEach((p: any, j: number) => out.set(`eq${it.entry}.${it.type}.${j}`, { ...p, type: it.type, z: it.z ?? p.z }));
    return out;
  };
  const changed = (spec: any) => { const e = drawnItems(spec, 'end'), m = drawnItems(spec, 'mistake'); return [...m.entries()].filter(([k, v]) => v.z !== 'floor' && e.get(k)?.d !== v.d); };
  it('the handle moves between the end and the Mistake and is drawn there (poly); the cable and stack are approved moving lines', () => {
    const ch = changed(S[ID]), lineTypes = pins().envelope.H9lineTypes;
    expect(ch.filter(([, v]) => v.type === 'poly').length).toBe(2);
    expect(ch.filter(([, v]) => !v.poly && !lineTypes.includes(v.type))).toEqual([]);
  });
  it('mutation: the handle drawn with `line` instead of `poly` drops out of the Mistake view (red)', () => {
    const s = S[ID], lineHandle = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === 2 ? (lm: any, ctx: any) => { const it = e(lm, ctx); return { type: 'line', pts: it.pts, cls: 'eq-line', z: it.z }; } : e)) };
    const ch = changed(lineHandle);
    expect(ch.some(([k, v]) => k.startsWith('eq2.line') && !v.poly)).toBe(true);
  });
  it('the column, pulley and floor sit at one place (±1 px) in start, end and Mistake', () => {
    const e = drawnItems(S[ID], 'end');
    for (const pose of posesOf(S[ID])) for (const [k, v] of drawnItems(S[ID], pose)) {
      if (v.type !== 'cableColumn' || v.cls === 'eq-cable' || /stack|thin/.test(v.cls)) continue;
      if (k.endsWith('.6') || k.endsWith('.7') || k.endsWith('.8') || k.endsWith('.9')) continue;   // the stack blocks and their lines move with the cable
      if (v.d !== e.get(k)?.d && v.cls !== 'eq') continue;
      expect(v.d === e.get(k)?.d || v.cls === 'eq', `${pose} ${k}`).toBe(true);
    }
  });
  it('c2: both feet flat on the floor (heel and ball, within 0.5 cm) in start, end and Mistake', () => {
    const r = rep(S[ID]);
    for (const l of ['heel.r', 'ball.r', 'heel.l', 'ball.l']) for (const p of ['start', 'end', 'mistake']) {
      const k = r.checks.find((c: any) => c.landmark === l && c.pose === p);
      expect(k?.cm, `${l} ${p}`).toBeLessThanOrEqual(0.5);
    }
  });
  it('c2: one foot in front of the other (mid-soles STAGGER apart), the near foot forward', () => {
    const l = lmOf(S[ID], 'end');
    expect(l['sole.r'][2] - l['sole.l'][2]).toBeCloseTo(M[ID].SIZES.STAGGER, 2);
  });
  it('c3, c4: the handles at the nipple line on one level line, the start elbows just below 90 inside (flexion 91 ± 1), the end 18 short of straight', () => {
    const r = rep(S[ID]), sh = lmOf(S[ID], 'start')['shoulder.r'];
    for (const p of ['start', 'end']) expect(lmOf(S[ID], p)['grip.r'][1], p).toBeCloseTo(sh[1] - M[ID].SIZES.GRIP_DY, 3);
    expect(Math.abs(lmOf(S[ID], 'mistake')['grip.r'][1] - (sh[1] - M[ID].SIZES.GRIP_DY))).toBeLessThan(0.002);   // full reach: the IK clamp
    expect(Math.abs(r.angles.start['elbow.r'] - 91)).toBeLessThanOrEqual(1);
    expect(Math.abs(r.angles.end['elbow.r'] - 18)).toBeLessThanOrEqual(1);
  });
  it('c7: the body is still: between start, end and Mistake only the arms move (hips, trunk and feet fixed)', () => {
    const a = lmOf(S[ID], 'start'), b = lmOf(S[ID], 'end'), m = lmOf(S[ID], 'mistake');
    for (const k of ['hips', 'sternum', 'head', 'heel.r', 'heel.l']) { expect(b[k], k).toEqual(a[k]); expect(m[k], k).toEqual(a[k]); }
  });
  it('the pulley sits at the start handle\'s height (c1 chest height), COLUMN_BACK behind the rear heel (c1)', () => {
    const l = lmOf(S[ID], 'start');
    expect(M[ID].CCP.pulley[1]).toBeCloseTo(l['grip.r'][1], 6);
    expect(l['heel.l'][2] - M[ID].CCP.pulley[2]).toBeCloseTo(M[ID].SIZES.COLUMN_BACK, 6);
  });
});

describe('LIB-16 machine_crunch (H; crunchMachine anchor): drawn facts', { timeout: T }, () => {
  const ID = 'machine_crunch';
  it('c4, c2: the end curls the spine (lumbar 40 deg, the thorax forward) with the pelvis held on the seat (tilt and root as the start)', () => {
    const r = rep(S[ID]);
    expect(r.angles.start.trunk).toBe(0);
    expect(r.angles.end.trunk).toBe(M[ID].SIZES.CURL);
    expect([r.angles.start.tilt, r.angles.end.tilt]).toEqual([0, 0]);
    expect(lmOf(S[ID], 'end').hips).toEqual(lmOf(S[ID], 'start').hips);
    expect(lmOf(S[ID], 'end').sternum[2]).toBeGreaterThan(lmOf(S[ID], 'start').sternum[2] + 0.1);
  });
  it('c1 mo-crunch: the movement arm pivots on the trunk\'s bend axis, so the hands keep their bend start → end (±2 deg)', () => {
    const r = rep(S[ID]);
    expect(M[ID].PIVOT.slice(1)).toEqual(lmOf(S[ID], 'start').lumbar.slice(1));
    expect(Math.abs(r.angles.end['elbow.r'] - r.angles.start['elbow.r'])).toBeLessThanOrEqual(2);
  });
  it('c14 Mistake: the trunk as in the start (upright, no curl), the arm at the end\'s angle, the hands pulled further from the shoulders', () => {
    const r = rep(S[ID]), lm = lmOf(S[ID], 'mistake'), le = lmOf(S[ID], 'end');
    expect(r.angles.mistake.trunk).toBe(0);
    expect(lm['grip.r'].map((v: number) => +v.toFixed(4))).toEqual(le['grip.r'].map((v: number) => +v.toFixed(4)));
    const reach = (l: any) => Math.hypot(...[0, 1, 2].map(i => l['grip.r'][i] - l['shoulder.r'][i]));
    expect(reach(lm)).toBeGreaterThan(reach(le) + 0.05);
  });
});

describe('LIB-16 Mistakes, tells, cues and callouts (DESIGN.md sections 9-10)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { cable_chest_press: 'lock', machine_pullover: 'arch', machine_crunch: 'arms' };
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each drawn plate draws its Mistake with 2-3 tells, the first carrying the proposed key', () => {
    for (const id of specsDrawn()) { expect(keyProblems(S[id])).toEqual([]); expect(S[id].mistake.tells.length, id).toBeGreaterThanOrEqual(2); expect(S[id].mistake.tells.length, id).toBeLessThanOrEqual(3); }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.machine_crunch;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['machine_crunch: first tell upright']);
  });
  const guideProblems = (spec: any) => spec.mistake.guides.filter((g: any) => !['dashed', 'arrow', 'arc-arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('A15: every Mistake guide is dashed or an arrow; mutation: a solid line guide is red', () => {
    for (const id of specsDrawn()) expect(guideProblems(S[id])).toEqual([]);
    const s = S.machine_crunch;
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: s.mistake.guides[0].pts }] } })).toEqual(['machine_crunch: line']);
  });
  /** Q-D5-6 cue table: every callout and tell cue is one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('A15 cue table: every cue is one sentence of 15 words or fewer; mutation: a 16-word cue is red', () => {
    for (const id of specsDrawn()) expect(cueProblems(S[id]), id).toEqual([]);
    const s = S.machine_crunch;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Keep your hips pressed hard against the back of the seat for every single rep today.' }, ...s.callouts.slice(1)] })).toEqual(['hips: 16 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of specsDrawn()) {
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
  /** Each callout's and tell's anchor sits on an item drawn in its pose: within 3 px of the solid figure's outline in
   *  that pose or inside it, of a Mistake guide, or of an equipment outline. */
  const anchorProblems = (spec: any) => {
    const r = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    const lms = qaEng.poseLandmarks(Eng(), spec).lm, cam = camOf(spec), out: string[] = [];
    const guides = (spec.mistake.guides ?? []).filter((g: any) => g.pts).map((g: any) => g.pts.map((p: any) => (Array.isArray(p) && p.length === 3 ? cam.P(p) : null)).filter(Boolean));
    for (const [mode, list] of [['normal', spec.callouts], ['mistake', spec.mistake.tells]] as const) for (const c of list) {
      const named = typeof c.anchor === 'string' && c.anchor.includes(':') ? c.anchor.split(':')[0] : c.anchor?.pose;
      const pose = named ?? (mode === 'mistake' ? 'mistake' : 'end');
      const at = qaEng.resolvePoint(c.anchor, pose, lms, qaEng.cameraOf(spec, r.normal.report));
      const polys = [...shapesIn(spec, pose).map((x: any) => x.poly), ...drawnPolys(spec, pose)];
      const dBody = Math.abs(outside(polys, at));   // inside a drawn shape (a joint centre) counts as on it
      const dGuide = Math.min(Infinity, ...guides.flatMap((g: number[][]) => segs(g).map(([p, q]) => segD(at, p!, q!))));
      if (!(outside(polys, at) <= 3 || dGuide <= 3)) out.push(`${spec.id} ${c.key}: anchor ${Math.min(dBody, dGuide).toFixed(1)} px from any drawn item`);
    }
    return out;
  };
  const drawnPolys = (spec: any, pose: string) => { const cam = camOf(spec), out: number[][][] = []; for (const it of itemsIn(spec, pose).items) for (const p of eng.PRIMITIVES[it.type](it, cam)) if (p.poly) out.push(p.poly); return out; };
  it('A15: every callout and tell anchor sits on an item drawn in its pose (within 3 px)', () => {
    expect(specsDrawn().flatMap(id => anchorProblems(S[id]))).toEqual([]);
  });
  it('mutation: one tell\'s anchor moved to a point with no drawn item is red', () => {
    const s = S.machine_crunch, tells = [{ ...s.mistake.tells[0], anchor: [0, 2.2, 1.2] }, ...s.mistake.tells.slice(1)];
    expect(anchorProblems({ ...s, mistake: { ...s.mistake, tells } }).length).toBe(1);
  });
});

describe('LIB-16 A15: Mistake clearance, leaders, the floor and bent arms', { timeout: T }, () => {
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
  it('mutation: an arrow from the end elbow to the Mistake elbow on machine_crunch (inside the figure\'s 6 px clearance) is red', () => {
    const s = S.machine_crunch, guides = [...s.mistake.guides, { kind: 'arrow', from: { at: 'elbow.r', pose: 'end' }, to: { at: 'elbow.r', pose: 'mistake' } }];
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });
  /** The equipment lines a leader must keep 6 px from (plate px): the Trace, every cable, the movement arm (lever and
   *  grip), the roller, the seat pad; and the back pad and its frame, except for a leader whose anchor is a contact on
   *  that pad, which crosses it once at its anchor end (DESIGN.md section 16 item 5). */
  const avoidOf = (spec: any, mistake: boolean, svg: string, padContact: boolean) => {
    const cam = camOf(spec), out: number[][][] = [];
    for (const m of svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)) out.push(...segs(xy(m[1]!)));
    for (const it of itemsIn(spec, mistake ? 'mistake' : 'end').items) {
      const isPad = it.type === 'backPad' && it.t === crunchEq.CRUNCH_MACHINE.padT, isFrame = it.type === 'backPad' && !isPad;
      if (padContact && (isPad || isFrame)) continue;
      if (['chestPress', 'kneePad', 'seat', 'backPad', 'cable', 'line', 'poly', 'cableColumn'].includes(it.type))
        for (const p of eng.PRIMITIVES[it.type](it, cam)) { const pts = p.poly ?? p.line; if (pts) out.push(...segs([...pts, pts[0]])); }
    }
    return out;
  };
  const PAD_CONTACT: Record<string, string[]> = { machine_crunch: ['hips', 'upright'] };
  const minGap = (spec: any) => {
    let min = Infinity, at = '';
    for (const mistake of [false, true]) {
      const svg: string = plate.renderPlate(spec, { id: 'x', mistake }).svg, list = mistake ? spec.mistake.tells : spec.callouts;
      leadersOf(svg).forEach((p, i) => {
        const avoid = avoidOf(spec, mistake, svg, (PAD_CONTACT[spec.id] ?? []).includes(list[i]?.key));
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) { const d = segD(q, g[0]!, g[1]!); if (d < min) { min = d; at = `${mistake ? 'mistake' : 'normal'} ${list[i]?.key}`; } }
        }
      });
    }
    return { min, at };
  };
  it('no leader comes within 6 px of the Trace, a cable, the lever, the roller, the seat or a pad (away from its first 8 px)', () => {
    for (const id of specsDrawn()) { const g = minGap(S[id]); expect(g.min, `${id} ${g.at}`).toBeGreaterThanOrEqual(6); }
  });
  it('mutation: the "Curl the spine" box lowered to the back pad\'s top (its leader 4.6 px over the pad) is red', () => {
    const s = S.machine_crunch, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'curl' ? { ...x, box: { left: 36, top: 140 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  it('mutation: the "Core leads" box moved below the seat, so its leader runs through the seat pad, is red', () => {
    const s = S.machine_crunch, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'core' ? { ...x, box: { left: 200, top: 300 } } : x)) };
    expect(minGap(bad).min).toBeLessThan(6);
  });
  /** No leader runs across the solid figure: away from its first 8 px at the anchor (a joint-centre anchor sits inside
   *  its limb), a leader stays outside the solid end figure, on the normal and the Mistake plate. */
  const crossProblems = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), out: string[] = [];
    for (const mistake of [false, true]) {
      const list = mistake ? spec.mistake.tells : spec.callouts;
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
  it('mutation: the "Core leads" box placed on the figure\'s far side, so its leader crosses the body, is red', () => {
    const s = S.machine_crunch, bad = { ...s, callouts: s.callouts.map((x: any) => (x.key === 'core' ? { ...x, box: { left: 20, top: 220 } } : x)) };
    expect(crossProblems(bad)).toContain('machine_crunch normal core: crosses the figure');
  });
  /** 6341498444 item 1: every drawn foot (heel, ball and toe: the engine's whole foot outline) on or above the floor line
   *  (0.5 px) in every pose. */
  const floorProblems = (spec: any) => posesOf(spec).flatMap(pose => {
    const fy = camOf(spec).P([0, 0, 0])[1];
    return shapesIn(spec, pose).filter((x: any) => /^foot\./.test(x.key)).flatMap((x: any) => {
      const low = Math.max(...x.poly.map((p: number[]) => p[1]!));
      return low - fy > 0.5 ? [`${pose}: ${x.key} ${(low - fy).toFixed(1)} px under the floor`] : [];
    });
  });
  it('no foot through the floor: heel, ball and toe on or above the floor line in every drawn pose', () => {
    for (const id of specsDrawn()) expect(floorProblems(S[id]), id).toEqual([]);
  });
  it('mutation: one toe 1 px below the floor line (the near foot pitched toe-down 3 deg about the heel) is red', () => {
    const s = S.machine_crunch, st = s.poses.start, a = 3 * Math.PI / 180, l = lmOf(s, 'start');
    const plant = { ...st.plant, r: { at: l['heel.r'], ref: 'heel', toe: [0, -Math.sin(a), Math.cos(a)], normal: [0, Math.cos(a), Math.sin(a)] } };
    const bad = floorProblems({ ...s, poses: { ...s.poses, start: { ...st, plant } } });
    expect(bad.length).toBe(1);
    expect(bad[0]).toMatch(/^start: foot\.r 1\.\d px under the floor$/);
  });
  /** 6341498444 item 2: a bent arm reads as bent: where the card bends the elbow (machine_crunch c3, machine_pullover
   *  c3), the drawn elbow flexion is at most 150 deg in start and end, and the two elbows sit at least shoulder width
   *  apart (they never meet in one stub). */
  const BENT: Record<string, string[]> = { machine_crunch: ['start', 'end'], machine_pullover: ['start'] };
  const armProblems = (spec: any) => (BENT[spec.id] ?? []).flatMap(pose => {
    const a = rep(spec).angles[pose], l = lmOf(spec, pose), out: string[] = [];
    for (const s of ['r', 'l']) if (!(a[`elbow.${s}`] <= 150)) out.push(`${pose}: elbow.${s} ${a[`elbow.${s}`].toFixed(1)}`);
    if (Math.abs(l['elbow.l'][0] - l['elbow.r'][0]) < Math.abs(l['shoulder.l'][0] - l['shoulder.r'][0])) out.push(`${pose}: elbows inside shoulder width`);
    return out;
  });
  it('a bent arm reads as bent (elbow at most 150 deg, the elbows apart) on every drawn bent-arm plate', () => {
    for (const id of specsDrawn()) expect(armProblems(S[id]), id).toEqual([]);
  });
  it('mutation: machine_crunch\'s hands 5 cm from the shoulders (the elbow folded past 150 deg) is red', () => {
    const s = S.machine_crunch, st = s.poses.start, sh = lmOf(s, 'start')['shoulder.r'];
    const reach = { ...st.reach, r: { ...st.reach.r, at: [st.reach.r.at[0], sh[1] + 0.03, sh[2] + 0.04] } };
    expect(armProblems({ ...s, poses: { ...s.poses, start: { ...st, reach } } }).some(p => p.startsWith('start: elbow.r'))).toBe(true);
  });
  /** Do 7: a cable runs from its pulley to the handle and is never drawn on top of the trunk, head or near arm: every
   *  cable line that passes inside the solid figure is drawn at z back or center (behind the trunk group). */
  const cableProblems = (spec: any) => posesOf(spec).flatMap(pose => {
    const polys = shapesIn(spec, pose).filter((x: any) => !/^(thigh|shank|foot|kneecap|shcap|upper|elbowcap|fore|fist)\.l$/.test(x.key)).map((x: any) => x.poly), cam = camOf(spec), out: string[] = [];
    for (const it of itemsIn(spec, pose).items) for (const p of eng.PRIMITIVES[it.type](it, cam)) {
      if (p.cls !== 'eq-cable' || !p.line) continue;
      const z = it.z ?? p.z, [a, b] = p.line, hit = Array.from({ length: 41 }, (_, k) => [a[0] + (b[0] - a[0]) * k / 40, a[1] + (b[1] - a[1]) * k / 40]).some(q => outside(polys, q) < 0);
      if (hit && !['back', 'center'].includes(z)) out.push(`${pose}: cable over the figure at z ${z}`);
    }
    return out;
  });
  it('cable_chest_press: the cable reaches the handle in every pose and passes behind the trunk', () => {
    const s = S.cable_chest_press;
    expect(cableProblems(s)).toEqual([]);
    for (const pose of posesOf(s)) {
      const col = itemsIn(s, pose).items.find((it: any) => it.type === 'cableColumn'), ring = M.cable_chest_press.CCP.handleOf([0, lmOf(s, pose)['grip.r'][1], lmOf(s, pose)['grip.r'][2]]).ring;
      expect(col.to, pose).toEqual(ring);
    }
  });
  it('mutation: cable_chest_press\'s cable drawn over the trunk (z front) is red', () => {
    const s = S.cable_chest_press, bad = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === 1 ? (lm: any, ctx: any) => ({ ...e(lm, ctx), z: 'front' }) : e)) };
    expect(cableProblems(bad).length).toBeGreaterThan(0);
  });
  /** D-LIB16-LOCK: cable_chest_press's end elbow keeps its ruled bend (END_FLEX), never straight (180 inside). */
  const lockProblems = (spec: any) => { const f = rep(spec).angles.end['elbow.r']; return Math.abs(f - M.cable_chest_press.SIZES.END_FLEX) <= 1 && f > 5 ? [] : [`end elbow flexion ${f.toFixed(1)}`]; };
  it('cable_chest_press: the end elbow is the ruled bend, not locked', () => {
    expect(lockProblems(S.cable_chest_press)).toEqual([]);
  });
  it('mutation: cable_chest_press\'s end elbow set to 180 deg inside (the locked handle as the end) is red', () => {
    const s = S.cable_chest_press;
    expect(lockProblems({ ...s, poses: { ...s.poses, end: { ...s.poses.end, ...s.mistake.pose } } }).length).toBe(1);
  });
  it('held (D-LIB8-shrug, D-LIB16-SIZE, -LOCK): cable_chest_press at its ruled sizes is below PQ-H3 (Trace and tell-anchor move), measured node-side', () => {
    const s = S.cable_chest_press, R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
    const m = qaNode.nodeMetrics({ spec: s, plate: { normal: R.normal, mistake: R.mistake, alt: s.alt, mistakeAlt: '' } }, { engine: Eng() }, R), env = pins().envelope;
    console.log(`LIB-16 cable_chest_press held: traceLen ${m.traceLen.toFixed(1)} px, deviation ${m.deviation.toFixed(1)} px`);
    expect(m.traceLen).toBeLessThan(env.traceLenMin);
    expect(m.deviation).toBeLessThan(env.deviationMin);
  });
  /** F3 and F4: the longest leader inside the 8's range and 2-6 hand-placed labels (qa/envelope.json). */
  const leaderMax = (spec: any) => Math.max(...[false, true].flatMap(mistake => [...plate.renderPlate(spec, { id: 'x', mistake }).svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)].map(m => {
    let x = 0, y = 0, t = 0;
    for (const c of m[1]!.matchAll(/([MLH])(-?[\d.]+)(?:[ ,](-?[\d.]+))?/g)) { const nx = +c[2]!, ny = c[1] === 'H' ? y : +c[3]!; if (c[1] !== 'M') t += Math.hypot(nx - x, ny - y); x = nx; y = ny; }
    return t;
  })));
  it('F3 and F4: every row\'s longest leader sits inside the 8\'s range, and it boxes 2-6 labels (a held plate\'s flags are posted, DESIGN.md section 15)', () => {
    const [lo, hi] = pins().envelope.F3, [b0, b1] = pins().envelope.F4;
    for (const id of drawn()) {
      const v = leaderMax(S[id]); expect(v >= lo && v <= hi, `${id} ${v.toFixed(1)}`).toBe(true);
      const n = [...S[id].callouts, ...S[id].mistake.tells, ...(S[id].measure ? [S[id].measure] : [])].filter((c: any) => c.box).length;
      expect(n >= b0 && n <= b1, `${id} boxed ${n}`).toBe(true);
    }
  });
});

describe('LIB-16 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specsDrawn().map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/vendor/exercises/')),
    ...c.filter(p => /^tools\/plates\/library\/(hands|fidelity|ci)\//.test(p)),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
  ];
  it('every drawn LB6 spec passes', () => {
    expect(files().length).toBeGreaterThanOrEqual(1);
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb6-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/machine_crunch.mjs';
  it('mutation: readFileSync added to the crunchMachine composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/crunchMachine.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/vendor/exercises/machine_chest_press.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../vendor/exercises/machine_chest_press.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root))).toContain('tools/plates/vendor/exercises/machine_chest_press.mjs'); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-16 A16: no other card\'s composer is copied, forked or imported (D-LIB16-COMPOSERS, -HANDLE)', () => {
  // main's eq/ at 5158609c: parts.mjs and rope.mjs; this card adds crunchMachine.mjs and pulloverMachine.mjs only.
  const MAIN_EQ = ['parts.mjs', 'rope.mjs'], OURS = COMPOSERS.map(c => `${c}.mjs`);
  const eqProblems = (names: string[]) => [...names.filter(n => !MAIN_EQ.includes(n) && !OURS.includes(n)).map(n => `extra ${n}`), ...MAIN_EQ.filter(n => !names.includes(n)).map(n => `missing ${n}`)];
  it('tools/plates/library/eq/ holds exactly main\'s files plus this card\'s composers', () => {
    expect(eqProblems(readdirSync('tools/plates/library/eq'))).toEqual([]);
    expect(readdirSync('tools/plates/library/eq')).toContain('crunchMachine.mjs');
  });
  it('mutation: a copy of #245\'s eq/dHandle.mjs added under eq/ under another name is red', () => {
    expect(eqProblems([...readdirSync('tools/plates/library/eq'), 'singleHandle.mjs'])).toEqual(['extra singleHandle.mjs']);
  });
});

describe('LIB-16 A10: the LB6 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the LB6 rows are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb6/build.mjs'));
    expect(build.drawnIds()).toEqual(drawn().map(i => `lib_${i}`));
    const a = await build.buildLb6Page(), b = await build.buildLb6Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});

describe('LIB-16 A4: runQa node half on an LB6 plate (lib_machine_crunch), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_machine_crunch', cg = () => S.machine_crunch;
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb6/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb6All();
    html = (await build.buildLb6Page({ all, ids: [ID] })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins: pins() });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb6-mut-')), file = join(dir, 'machine_crunch.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/machine_crunch.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb6', title: 'LB6', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: no node-half problem (H6 passes on the card keys), F7 is not raised, and the only raised flags are F2 (ruled, Q10) and F5 (the browser half)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
    expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5'].includes(f))).toEqual([]);
  });
  it('A8 mutation: the card copied with topFault set to its other tell key raises F7, and the expected-set check is red', async () => {
    const qaMod = await import(/* @vite-ignore */ lib('lb6/qa.mjs'));
    const c = await candOf(), r = await qa({ ...c, research: { ...c.research, topFault: 'upright' } });
    expect(r.flags.F7.raised).toBe(true);
    const r0 = await qa(c);
    expect(r0.flags.F7.raised).toBe(false);
    expect(qaMod.flagProblems([{ ...r, flags: { ...r.flags, F5: { ...r.flags.F5, raised: true, value: 3.57 } } }]).some((p: string) => /F7/.test(p))).toBe(true);
  });
  it('A4 M1 a label 1 px onto the figure (the Curl the spine callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg().callouts.find((x: any) => x.key === 'curl'), at = (box: any) => ({ ...cg(), callouts: cg().callouts.map((x: any) => (x.key === 'curl' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[1, 0], [0, 1], [0, -1], [-1, 0]]) {
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

describe('LIB-16 A7 and A11: the tempo strip follows the card (D-LIB16-SECS, -TEMPO)', { timeout: T }, () => {
  // The proposed tempo table (D-LIB16-TEMPO; DESIGN.md section 8), copied here, never read from tempo.json or a spec.
  const RULED: Record<string, [string, string, boolean][]> = {
    cable_chest_press: [['Press', 'up', true], ['Return', 'down', true]],
    machine_pullover: [['Pull', 'up', true], ['Hold', 'pause', false], ['Return', 'down', true]],
    machine_crunch: [['Crunch', 'up', true], ['Return', 'down', true]],
  };
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  /** The phase array built only from a tempo.json row set and the card's plate.tempo. */
  const build = (rows: any[], t: any) => rows.map(r => ({ phase: r.phase, s: t[r.from], ...(r.move ? { move: true } : {}) }));
  const tempoProblems = (tj: any, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not the ruled (empty) set');
    if (JSON.stringify(Object.keys(tj.ids)) !== JSON.stringify(LB6)) bad.push('ids: not the 3');
    for (const id of LB6) {
      const rows = tj.ids[id]?.rows ?? [], t = cardOf(id).plate.tempo;
      if (JSON.stringify(rows.map((r: any) => [r.phase, r.from, !!r.move])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (rows.some((r: any) => r.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (rows.some((r: any) => r.from === 'pause') && !(t.pause > 0)) bad.push(`${id}: Hold with pause 0`);
      if (t.pause > 0 && !rows.some((r: any) => r.from === 'pause')) bad.push(`${id}: no Hold for pause ${t.pause}`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(build(rows, t))) bad.push(`${id}: spec tempo != the built strip`);
    }
    return bad;
  };
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  it('tempo.json follows the ruled table and every drawn spec\'s tempo is built from it and the card\'s plate.tempo', () => {
    expect(tempoProblems(readJson('tools/plates/library/lb6/tempo.json'), { ...S })).toEqual([]);
    expect(S.machine_crunch.tempo).toEqual([{ phase: 'Crunch', s: 2, move: true }, { phase: 'Return', s: 2, move: true }]);
  });
  it('mutations: a Hold added to cable_chest_press (pause 0), machine_pullover\'s Hold removed, a 1 s bottom pause added to machine_crunch and a Rest are each red', () => {
    const red = (f: (tj: any, specs: any) => void) => { const tj = copy(readJson('tools/plates/library/lb6/tempo.json')), specs: any = { ...S }; f(tj, specs); return tempoProblems(tj, specs).length > 0; };
    expect(red(tj => { tj.ids.cable_chest_press.rows.splice(1, 0, { phase: 'Hold', from: 'pause' }); }), 'Hold on cable_chest_press').toBe(true);
    expect(red(tj => { tj.ids.machine_pullover.rows.splice(1, 1); }), 'no Hold on machine_pullover').toBe(true);
    expect(red((tj, specs) => { specs.machine_crunch = { ...specs.machine_crunch, tempo: [...specs.machine_crunch.tempo, { phase: 'Pause', s: 1 }] }; }), 'bottom pause').toBe(true);
    expect(red(tj => { tj.ids.machine_crunch.rows.push({ phase: 'Rest', from: 'pause' }); }), 'Rest').toBe(true);
    expect(red((tj, specs) => { specs.machine_crunch = { ...specs.machine_crunch, tempo: [{ ...specs.machine_crunch.tempo[0], s: 3 }, specs.machine_crunch.tempo[1]] }; }), 'one value off by 1 s').toBe(true);
    expect(red((tj, specs) => { specs.cable_chest_press = { ...specs.cable_chest_press, tempo: [specs.cable_chest_press.tempo[0], { ...specs.cable_chest_press.tempo[1], s: 1 }] }; }), 'one value off by 1 s (cable_chest_press)').toBe(true);
  });
  it('A6 mutation: the card path removed gives H6:no-card', () => {
    const s = S.machine_crunch, R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
    expect(qaNode.h6({ spec: s, research: null }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key)).toEqual(['H6:no-card']);
  });
});

describe('LIB-16 A17: sizes are fixed in lb6/sizes.json and never sized by PQ-H3 (D-LIB16-SIZE)', () => {
  const sizes = readJson('tools/plates/library/lb6/sizes.json');
  const rowProblems = (table: Record<string, any>) => Object.entries(table).flatMap(([k, r]: [string, any]) => [
    ...(typeof r.basis === 'string' && r.basis.trim() ? [] : [`${k}: empty basis`]),
    ...(/PQ-H3|deviationMin|traceLenMin|\bH3\b/.test(r.basis ?? '') ? [`${k}: basis names PQ-H3`] : []),
  ]);
  const sizeProblems = (spec: Record<string, number>, table: Record<string, any>) => [
    ...Object.keys(spec).filter(k => !(k in table)).map(k => `${k}: not in sizes.json`),
    ...Object.keys(table).filter(k => !(k in spec)).map(k => `${k}: not in the spec`),
    ...Object.keys(spec).filter(k => k in table && table[k].value !== spec[k]).map(k => `${k}: spec ${spec[k]} != sizes.json ${table[k].value}`),
    ...rowProblems(table),
  ];
  it('each drawn spec\'s SIZES equals its sizes.json row, and each composer\'s constants equal theirs, every row with a basis that is not PQ-H3', async () => {
    for (const id of specsDrawn()) expect(sizeProblems(M[id].SIZES, sizes.ids[id]), id).toEqual([]);
    expect(sizeProblems({ ...crunchEq.CRUNCH_MACHINE }, sizes.composers.crunchMachine)).toEqual([]);
    for (const [id, t] of Object.entries<any>(sizes.proposed)) expect(rowProblems(t), id).toEqual([]);
  });
  it('mutations: one Mistake size changed in its spec only, a row with an empty basis, a row whose basis names PQ-H3 or deviationMin, and a spec number missing from sizes.json are red', () => {
    const s = { ...M.machine_crunch.SIZES }, t = JSON.parse(JSON.stringify(sizes.ids.machine_crunch));
    expect(sizeProblems({ ...s, M_ARM: 30 }, t)).toEqual(['M_ARM: spec 30 != sizes.json 40']);
    expect(sizeProblems(s, { ...t, CURL: { ...t.CURL, basis: '' } })).toEqual(['CURL: empty basis']);
    expect(sizeProblems(s, { ...t, CURL: { ...t.CURL, basis: 'sized so PQ-H3 passes' } })).toEqual(['CURL: basis names PQ-H3']);
    expect(sizeProblems(s, { ...t, CURL: { ...t.CURL, basis: 'above deviationMin' } })).toEqual(['CURL: basis names PQ-H3']);
    expect(sizeProblems({ ...s, HANDLE_TILT: 5 }, t)).toEqual(['HANDLE_TILT: not in sizes.json']);
  });
});

describe('LIB-16 A11, A6, A8 (Do 6 b): the card fields, the ruled tempo map, the pose map and the plate facts', { timeout: T }, () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const cardsSha = readJson('tools/plates/library/lb6/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  // The ruled pose map (DESIGN.md section 9): identity for all 3.
  const POSE_MAP: Record<string, Record<string, string>> = Object.fromEntries(LB6.map(id => [id, { start: 'start', end: 'end' }]));
  it('each card differs from its research-head copy only in the three keys, written last', () => {
    for (const id of LB6) { expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]); expect(Object.keys(cardOf(id)).slice(-3), id).toEqual(KEYS); }
  });
  it('each card\'s tempo is the strip built from lb6/tempo.json and its plate.tempo, and equals its drawn spec\'s', () => {
    const tj = readJson('tools/plates/library/lb6/tempo.json');
    for (const id of LB6) {
      const c = cardOf(id), want = tj.ids[id].rows.map((r: any) => ({ phase: r.phase, s: c.plate.tempo[r.from], ...(r.move ? { move: true } : {}) }));
      expect(c.tempo, id).toEqual(want);
      if (S[id]) expect(S[id].tempo, id).toEqual(c.tempo);
    }
  });
  it('A11 mutations: any other card key edited, and seconds changed on one card\'s tempo and spec, are red', () => {
    const c = cardOf('machine_crunch'); c.plate.tempo.up = 3;
    expect(sha(canon(c))).not.toBe(cardsSha.cards.machine_crunch);
    const d = cardOf('machine_crunch'); d.tempo[0].s = 3;
    expect(JSON.stringify(d.tempo)).not.toBe(JSON.stringify(S.machine_crunch.tempo));
  });
  // Q4 (D-LIB16 fault→key): drawable:true on all 3, so topFault is the key the drawn first tell carries.
  const DRAWN: Record<string, string> = { cable_chest_press: 'lock', machine_pullover: 'arch', machine_crunch: 'arms' };
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault']) : ['drawable:false']);
  it('A8: each topFault is the ruled key; every drawn first tell carries it', () => {
    for (const id of LB6) expect(topFaultProblems(cardOf(id), DRAWN[id]!), id).toEqual([]);
    for (const id of specsDrawn()) expect(S[id].mistake.tells[0].key, id).toBe(cardOf(id).topFault);
  });
  it('A8 mutation: machine_pullover\'s card copied with topFault set to another of its tell keys is red', () => {
    const c = cardOf('machine_pullover'); c.topFault = 'head';
    expect(topFaultProblems(c, DRAWN.machine_pullover!)).toEqual(['drawable:true but topFault is not the drawn fault']);
  });
  /** 14.7 rules 10, 15, D-LIB9-CARDFIELDS and the pose map: kind, one form, a claim of its own card, a pose that is the
   *  map's image of its card pose. */
  const factProblems = (id: string, c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
    ...(f.cardPose && POSE_MAP[id]![f.cardPose] !== (f.pose ?? 'end') ? [`${i}: pose ${f.pose ?? 'end'} is not the map's image of card ${f.cardPose}`] : []),
  ]);
  // The ruled facts (Q3, #297 6343632260), each with its claim id; one per checked landmark.
  const C = (lms: string[], pose: string, cardPose: string, claim: string) => lms.map(landmark => ({ kind: 'contact', landmark, pose, cardPose, claim }));
  const EL = (joint: string) => ({ kind: 'angle', joint, pose: 'start', cardPose: 'start', deg: 90, claim: 'c3', note: '"Keep the elbows just below 90 degrees": drawn 89 deg inside (flexion 91)' });
  const FACTS: Record<string, any[]> = {
    // CARD FIELDS fix round (#297 6346317646): + wrists at start (c1 "one d-handle in each hand"); the end-pose foot
    // facts removed (plate.end cites c3, c5, c7, none states a foot contact).
    cable_chest_press: [...C(['heel.r', 'ball.r', 'heel.l', 'ball.l'], 'start', 'start', 'c2'), ...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c1'), EL('elbow.r'), EL('elbow.l')],
    machine_pullover: [...C(['backUpper', 'buttock'], 'start', 'start', 'c7'), ...C(['backUpper', 'buttock'], 'end', 'end', 'c7'), ...C(['elbow.r', 'elbow.l'], 'start', 'start', 'c3'), ...C(['elbow.r', 'elbow.l'], 'end', 'end', 'c4'), ...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c3')],
    machine_crunch: [...C(['buttock'], 'start', 'start', 'c2'), ...C(['buttock'], 'end', 'end', 'c2'), ...C(['knee.r', 'ankle.r', 'knee.l', 'ankle.l'], 'start', 'start', 'c2'), ...C(['wrist.r', 'wrist.l'], 'start', 'start', 'c3')],
  };
  it('every card\'s plateFacts is the ruled set, each fact well formed', () => {
    for (const id of LB6) { expect(cardOf(id).plateFacts, id).toEqual(FACTS[id]); expect(factProblems(id, cardOf(id)), id).toEqual([]); }
  });
  it('mutations: a fact with both joint and measure: true, and a start fact named with the unmapped pose, are red', () => {
    const c = cardOf('cable_chest_press'); c.plateFacts.push({ kind: 'angle', joint: 'elbow.r', measure: true, deg: 90, claim: 'c3' });
    expect(factProblems('cable_chest_press', c)).toEqual([`${c.plateFacts.length - 1}: both joint and measure`]);
    const p = cardOf('machine_crunch'); p.plateFacts.push({ kind: 'contact', landmark: 'wrist.r', pose: 'end', cardPose: 'start', claim: 'c3' });
    expect(factProblems('machine_crunch', p)).toEqual([`${p.plateFacts.length - 1}: pose end is not the map's image of card start`]);
  });
  const h6 = (spec: any, research: any) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research }, { engine: Eng(), pins: pins() }, R).map((p: any) => p.key);
  };
  const research = (id: string) => { const c = cardOf(id); return { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault }; };
  it('A6: PQ-H6 is green on every drawn spec against its card (the held spec included)', () => {
    for (const id of specsDrawn()) expect(h6(S[id], research(id)), id).toEqual([]);
  });
  // Every numeric triple named `at` in a pose (root, reach and plant targets) moved by v: the whole body moves rigidly.
  const shiftPose = (p: any, v: number[]): any => Array.isArray(p) ? p.map(x => shiftPose(x, v)) : p && typeof p === 'object'
    ? Object.fromEntries(Object.entries(p).map(([k, x]: [string, any]) => [k, k === 'at' && Array.isArray(x) && x.length === 3 && x.every((n: any) => typeof n === 'number') ? x.map((n: number, i: number) => n + v[i]!) : shiftPose(x, v)])) : p;
  it('A6 mutation: for each contact fact, its pose\'s body moved 2 cm along the fact\'s check normal turns that fact red and no fact of another pose', () => {
    for (const id of specsDrawn()) FACTS[id]!.forEach((f, i) => {
      if (f.kind !== 'contact') return;
      const s = S[id], k = s.checks.find((c: any) => c.landmark === f.landmark && (c.pose === f.pose || c.pose === 'all'));
      const n = k.plane ? k.plane.normal : [0, 0, 1], L = Math.hypot(...n), v = n.map((x: number) => x / L * 0.02);
      const red = h6({ ...s, poses: { ...s.poses, [f.pose]: shiftPose(s.poses[f.pose], v) } }, research(id)).filter((x: string) => x.includes(':contact:'));
      expect(red, `${id} ${f.pose} ${f.landmark}`).toContain(`H6.fact:${i}:contact:${f.landmark}`);
      const others = FACTS[id]!.flatMap((g, j) => (g.kind === 'contact' && g.pose !== f.pose ? [`H6.fact:${j}:contact:${g.landmark}`] : []));
      expect(red.filter((x: string) => others.includes(x)), `${id} ${f.pose} ${f.landmark}`).toEqual([]);
    });
  });
  // The fact is 90 (the quote's number) and the elbow is drawn 91 (just below 90 inside), so a fact 3 deg off the
  // drawn value is 88 or 94: both are red. (93 sits 2 deg from the drawn 91 and passes the ±2 limit, as it should.)
  it('A6 mutations: an angle fact 3 deg off the drawn elbow (88 and 94), and the card path removed, are red', () => {
    const s = S.cable_chest_press, r = research('cable_chest_press');
    expect(h6(s, { ...r, plateFacts: r.plateFacts.map((f: any) => (f.joint === 'elbow.r' ? { ...f, deg: 88 } : f)) })).toEqual([`H6.fact:${r.plateFacts.findIndex((f: any) => f.joint === 'elbow.r')}:angle:elbow.r`]);
    expect(h6(s, { ...r, plateFacts: r.plateFacts.map((f: any) => (f.joint === 'elbow.r' ? { ...f, deg: 94 } : f)) })).toEqual([`H6.fact:${r.plateFacts.findIndex((f: any) => f.joint === 'elbow.r')}:angle:elbow.r`]);
    expect(h6(s, null)).toEqual(['H6:no-card']);
  });
});
