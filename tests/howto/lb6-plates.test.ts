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
import { otherCards } from './eq-composers';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB6 = ['cable_chest_press', 'machine_pullover', 'machine_crunch'];
const IDS = LB6.map(i => `lib_${i}`);
// The LB6 ids drawn by no LB6 card (DESIGN.md section 2; LIB-16R2 A1: the pilot plates and the T row smith_machine_shrug): never in lb6/rows.json.
const NOT_HERE = ['smith_machine_bench_press', 'smith_machine_shrug', 'cable_fly', 'pec_fly'];
// Held ids (DESIGN.md section 15): drawn and tested, no row. cable_chest_press was held under D-LIB8-shrug (D-LIB16-SIZE,
// -LOCK) until 'LIB-16 resume' drew its zooms (D-LIB16-ZOOMVIEWS); none is held now.
const HELD: string[] = [];
const ROWS = 'tools/plates/library/lb6/rows.json';
const RESEARCH_HEAD = 'a8e66f32e34e1746075ffa4da35ea18c80dd4776';
const COMPOSERS = ['crunchMachine', 'pulloverMachine'];
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const PX = 146.29;

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, crunchEq: any, pullEq: any;
const M: Record<string, any> = {}, S: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, crunchEq, pullEq] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'eq/crunchMachine.mjs', 'eq/pulloverMachine.mjs',
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

/** The one ruled solid red line (panel lb4p R5, #327 6410191598): cable_chest_press's locked-arm axis, the Mistake
 *  shoulder to the Mistake handle centre. Only this exact guide is exempt from the dashed-or-arrow and the 6 px
 *  clearance rules (A15). */
const AXIS: Record<string, string[]> = { cable_chest_press: ['shoulder.r', 'grip.r'] };
const isAxisGuide = (spec: any, g: any) => {
  const a = AXIS[spec.id];
  return !!a && g.kind === 'line' && g.pts.length === 2 && g.pts.every((p: any, i: number) => p.at === a[i] && p.pose === 'mistake');
};
/** The ruled axis line as drawn in the Mistake svg (an m-arrow path from the Mistake shoulder to the Mistake handle
 *  centre, each end within 0.5 px), or null. */
const axisPath = (spec: any, svg: string) => {
  const a = AXIS[spec.id];
  if (!a) return null;
  const cam = camOf(spec), lm = lmOf(spec, 'mistake'), A = cam.P(lm[a[0]!]), B = cam.P(lm[a[1]!]);
  return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].map(m => m[1]!).find(d => {
    const p = xy(d);
    return p.length === 2 && Math.hypot(p[0]![0]! - A[0]!, p[0]![1]! - A[1]!) <= 0.5 && Math.hypot(p[1]![0]! - B[0]!, p[1]![1]! - B[1]!) <= 0.5;
  }) ?? null;
};

describe('LIB-16 A5: lb6/rows.json holds exactly the drawn, non-held LB6 H ids, all mode H', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    for (const m of text.matchAll(/"mode":\s*"([A-Z]+)"/g)) if (m[1] !== 'H') bad.push(`mode ${m[1]}`);
    return bad;
  };
  // LIB-16R2 (lib-16r2-card A1): the resume 2 rows join once drawn and not held (DESIGN.md section 19).
  const R2_ROWS = ['low_to_high_cable_fly', 'high_to_low_cable_fly', 'smith_machine_squat', 'smith_machine_shoulder_press', 'smith_machine_incline_press'];
  const R2_HELD: string[] = [];
  const want = () => [...drawn(), ...R2_ROWS.filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`) && !R2_HELD.includes(i))].map(i => `lib_${i}`);
  it('each drawn, non-held id exactly once in the raw text, nothing else, every mode H (D-LIB16-B1)', () => {
    expect(want()).toEqual(['lib_cable_chest_press', 'lib_machine_pullover', 'lib_machine_crunch', 'lib_low_to_high_cable_fly', 'lib_high_to_low_cable_fly',
      'lib_smith_machine_squat', 'lib_smith_machine_shoulder_press', 'lib_smith_machine_incline_press']);
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
  });
  it('none of the LB6 ids drawn by no LB6 card is in any lb6/ file as a row', () => {
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
    // LIB-16R2 A1: smith_machine_shrug added, a row set to T
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_smith_machine_shrug: row } }, null, 1), w)).toEqual(['extra lib_smith_machine_shrug']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_machine_crunch: { ...row, mode: 'T' } } }, null, 1), w)).toEqual(['mode T']);
    expect(NOT_HERE.some(id => new RegExp(`"lib_${id}"\\s*:`).test(JSON.stringify({ rows: { lib_smith_machine_shrug: row } }))), 'NOT_HERE sees smith_machine_shrug').toBe(true);
  });
  it('every row points at its own spec file and carries the census view; batch LB6, censusRef 4a9fd86', () => {
    const j = readJson(ROWS), FRONT = ['low_to_high_cable_fly', 'high_to_low_cable_fly', 'machine_lateral_raise', 'rear_delt_fly', 'hip_abduction', 'hip_adduction'];
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view, id).toBe(FRONT.includes(id.slice(4)) ? 'front' : 'side');
      expect(r.view, id).toBe(readJson(`docs/research/howto/cards/${id.slice(4)}.json`).plate.view);
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
    // the arm moves; the start fist and grip phantom (a dashed line set drawn in the end pose only) is its own entry
    const ph = S[ID].equipment.length - 1, mv = moving(S[ID], 'start', 'end').filter(k => !k.startsWith(`eq${ph}.`));
    expect(mv.every(k => /chestPress/.test(k))).toBe(true);
    expect(moving(S[ID], 'start', 'end').length).toBeGreaterThan(0);
    expect(moving(S[ID], 'end', 'mistake')).toEqual([]);
    expect(mistakeDrops(S[ID])).toEqual([]);
  });
  it('mutation: the back pad moved 2 cm in the Mistake is red', () => {
    const s = S[ID], i = s.equipment.findIndex((e: any, k: number) => itemsIn(s, 'end').items.some((it: any) => it.entry === k && it.type === 'backPad' && it.t === crunchEq.CRUNCH_MACHINE.padT));
    expect(itemsIn(s, 'end').items.find((it: any) => it.entry === i).type).toBe('backPad');
    const moved = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === i ? (lm: any, ctx: any) => { const it = e(lm, ctx); return ctx.pose === 'mistake' ? { ...it, surface: it.surface.map((p: number[]) => [p[0]!, p[1]!, p[2]! - 0.02]) } : it; } : e)) };
    expect(staticProblems(moved)).toEqual(['mistake: eq' + i + '.backPad.0 moved 2.9 px']);
  });
  it('mutation: the movement arm moved in the Mistake and drawn with `line` instead of a poly part is missing from the Mistake view (red)', () => {
    const s = S[ID], i = s.equipment.findIndex((e: any, k: number) => itemsIn(s, 'end').items.some((it: any) => it.entry === k && it.type === 'chestPress'));
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

describe('LIB-16 A2: pulloverMachine on machine_pullover, per drawn pose (13.1)', { timeout: T }, () => {
  const ID = 'machine_pullover';
  const drawnItems = (spec: any, pose: string) => {
    const cam = camOf(spec), out = new Map<string, any>();
    for (const it of itemsIn(spec, pose).items) eng.PRIMITIVES[it.type](it, cam).forEach((p: any, j: number) => out.set(`eq${it.entry}.${it.type}.${j}`, { ...p, type: it.type, part: it.part ?? null }));
    return out;
  };
  /** Each static part (seat, back pad, belt, foot bar, frame, hub) at one place (±1 px) in start, end and Mistake. */
  const staticProblems = (spec: any) => {
    const bad: string[] = [], e = drawnItems(spec, 'end');
    for (const pose of posesOf(spec)) for (const [k, v] of drawnItems(spec, pose)) {
      if (v.part === 'arm' || v.type === 'line' || v.type === 'floor') continue;
      const a = v.poly ?? xy(v.d), b = e.get(k)?.poly ?? xy(e.get(k)?.d ?? '');
      const d = Math.max(...a.map((p: number[], i: number) => (b[i] ? Math.hypot(p[0]! - b[i]![0]!, p[1]! - b[i]![1]!) : Infinity)));
      if (!(d <= 1)) bad.push(`${pose}: ${k} moved ${d.toFixed(1)} px`);
    }
    return bad;
  };
  const moving = (spec: any, a: string, b: string) => { const A = drawnItems(spec, a), B = drawnItems(spec, b); return [...B.entries()].filter(([k, v]) => A.get(k)?.d !== v.d && v.type !== 'line').map(([k, v]) => ({ k, v })); };
  it('the seat, back pad, belt, foot bar, frame and hub sit at one fixed place (±1 px) in start, end and Mistake', () => {
    expect(staticProblems(S[ID])).toEqual([]);
  });
  it('only the movement arm (tube, elbow pad, strut, crossbar) moves start → end, every part of it a poly; between the end and the Mistake nothing moves', () => {
    const mv = moving(S[ID], 'start', 'end');
    expect(mv.length).toBe(4);
    expect(mv.every(({ v }) => v.part === 'arm' && v.poly)).toBe(true);
    expect(moving(S[ID], 'end', 'mistake')).toEqual([]);
  });
  it('mutation: the back pad moved 2 cm in the Mistake is red', () => {
    const s = S[ID], i = s.equipment.findIndex((e: any, k: number) => itemsIn(s, 'end').items.some((it: any) => it.entry === k && it.type === 'backPad' && it.t === pullEq.PULLOVER_MACHINE.padT));
    const moved = { ...s, equipment: s.equipment.map((e: any, k: number) => (k === i ? (lm: any, ctx: any) => { const it = e(lm, ctx); return ctx.pose === 'mistake' ? { ...it, surface: it.surface.map((p: number[]) => [p[0]!, p[1]!, p[2]! - 0.02]) } : it; } : e)) };
    expect(staticProblems(moved)).toEqual([`mistake: eq${i}.backPad.0 moved 2.9 px`]);
  });
  // The ruled contacts (Q3) on the drawn items: back and buttock on the pad (c7), the elbows on the elbow pads (c3, c4),
  // the hands on the bar (c3); c1 the shoulders just below the pivot; c7 the back of the head on the pad (no landmark).
  const PX_ = (spec: any) => camOf(spec).pxm;
  const contactProblems = (spec: any) => {
    const bad: string[] = [], pad = M[ID].PM.pad, off = (p: number[]) => (p[1]! - pad.point[1]) * pad.normal[1] + (p[2]! - pad.point[2]) * pad.normal[2];
    for (const pose of ['start', 'end']) {
      const l = lmOf(spec, pose);
      for (const k of ['backUpper', 'buttock']) if (Math.abs(off(l[k])) > 0.005) bad.push(`${pose}: ${k} ${(off(l[k]) * 100).toFixed(1)} cm off the pad`);
      const ep = itemsIn(spec, pose).items.filter((it: any) => it.type === 'poly' && it.part === 'arm')[0], [f0, f1] = ep.pts;
      for (const s2 of ['r', 'l']) { const e = l[`elbow.${s2}`], d = segD([e[2], e[1]], [f0[2], f0[1]], [f1[2], f1[1]]) - eng.RADII.elbowCap * 1.75; if (Math.abs(d) > 0.005) bad.push(`${pose}: elbow.${s2} ${(d * 100).toFixed(1)} cm off the pad`); }
    }
    const ls = lmOf(spec, 'start'), bar = itemsIn(spec, 'start').items.find((it: any) => it.type === 'poly' && it.part === 'arm' && it.pts.length === 16);
    const bc = bar.pts.reduce((a: number[], p: number[]) => a.map((v, i) => v + p[i]! / bar.pts.length), [0, 0, 0]);
    for (const s2 of ['r', 'l']) { const g = ls[`grip.${s2}`]; if (Math.hypot(g[1] - bc[1], g[2] - bc[2]) > 0.05) bad.push(`start: hand.${s2} ${(Math.hypot(g[1] - bc[1], g[2] - bc[2]) * 100).toFixed(1)} cm from the bar`); }
    const sh = ls['shoulder.r'], pv = M[ID].PIVOT;
    if (!(pv[1] - sh[1] > 0 && pv[1] - sh[1] <= 0.05)) bad.push('c1: the shoulder is not just below the pivot');
    // the head's rearmost outline point on the pad face line (within 0.5 cm), measured in plate px across the line
    const c = camOf(spec), A = c.P(M[ID].PM.padL), Bp = c.P(pad.point), L = Math.hypot(Bp[0]! - A[0]!, Bp[1]! - A[1]!), nx = -(Bp[1]! - A[1]!) / L, ny = (Bp[0]! - A[0]!) / L;
    for (const pose of ['start', 'end']) {
      const h = shapesIn(spec, pose).find((x: any) => x.key === 'head').poly, d = Math.min(...h.map((p: number[]) => Math.abs((p[0]! - A[0]!) * nx + (p[1]! - A[1]!) * ny) * Math.sign((p[0]! - A[0]!) * nx + (p[1]! - A[1]!) * ny)));
      if (Math.abs(d) > 0.005 * PX_(spec)) bad.push(`${pose}: head ${d.toFixed(1)} px off the pad`);
    }
    return bad;
  };
  it('c7 back and buttock on the pad, c3/c4 elbows on the pads, c3 hands on the bar (start), c1 shoulders just below the pivot, c7 the back of the head on the pad', () => {
    expect(contactProblems(S[ID])).toEqual([]);
  });
  it('mutations: the back moved 2 cm off the pad in the end pose, and the head 2 cm off the pad at start, are red', () => {
    const s = S[ID], e = s.poses.end;
    expect(contactProblems({ ...s, poses: { ...s.poses, end: { ...e, root: { ...e.root, at: [e.root.at[0], e.root.at[1], e.root.at[2] + 0.02] } } } }).some(p => p.startsWith('end: backUpper'))).toBe(true);
    const st = s.poses.start;
    expect(contactProblems({ ...s, poses: { ...s.poses, start: { ...st, neck: st.neck + 8 } } }).some(p => p.startsWith('start: head'))).toBe(true);
  });
  it('c8 Mistake: the low back, upper back and head forward of the pad (at least 2 cm), the arm at the end', () => {
    const l = lmOf(S[ID], 'mistake'), pad = M[ID].PM.pad, off = (p: number[]) => (p[1]! - pad.point[1]) * pad.normal[1] + (p[2]! - pad.point[2]) * pad.normal[2];
    for (const k of ['backMid', 'backUpper']) expect(off(l[k]), k).toBeGreaterThan(0.02);
    expect(lmOf(S[ID], 'mistake').head[2] - lmOf(S[ID], 'end').head[2]).toBeGreaterThan(0.04);
  });
  /** Panel fix (#297 6353020731, R2): the seat cushion and the back pad each join the frame through drawn parts. Two
   *  static shapes join when their outlines come within 1 px or one holds a point of the other; the seat pad (the seat
   *  item's first shape) must reach the floor beam (the first static shape, the composer's first item) without passing through the back pad, and
   *  the back pad without passing through the seat pad, in the end pose (the two pads touch, so neither holds the other up). */
  const inPoly = (P: number[][], q: number[]) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const [xi, yi] = P[i]!, [xj, yj] = P[j]!; if ((yi! > q[1]!) !== (yj! > q[1]!) && q[0]! < (xj! - xi!) * (q[1]! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const joined = (A: number[][], B: number[][]) => inPoly(A, B[0]!) || inPoly(B, A[0]!)
    || A.some(p => segs([...B, B[0]!]).some(([a, b]) => segD(p, a!, b!) <= 1)) || B.some(p => segs([...A, A[0]!]).some(([a, b]) => segD(p, a!, b!) <= 1));
  const floating = (spec: any) => {
    const shapes = [...drawnItems(spec, 'end').entries()].filter(([, v]) => v.part !== 'arm' && v.type !== 'line' && v.type !== 'floor')
      .map(([k, v]) => ({ k, type: v.type, pts: (v.poly ?? xy(v.d)) as number[][] })).filter(x => x.pts.length > 2);
    const reach = (skip: number) => { const r = new Set([0]); let grew = true;
      while (grew) { grew = false; shapes.forEach((x, i) => { if (i !== skip && !r.has(i) && [...r].some(j => joined(shapes[j]!.pts, x.pts))) { r.add(i); grew = true; } }); }
      return r; };
    const seatPad = shapes.findIndex(x => x.k === `eq${entryOf(spec, 'seat')}.seat.0`), pad = shapes.findIndex(x => x.k === `eq${entryOf(spec, 'backPad')}.backPad.0`);
    if (seatPad < 0 || pad < 0) return ['no seat or back pad'];
    return [...(reach(pad).has(seatPad) ? [] : ['seat']), ...(reach(seatPad).has(pad) ? [] : ['back pad'])];
  };
  const entryOf = (s: any, type: string) => itemsIn(s, 'end').items.find((it: any) => it.type === type && (type !== 'backPad' || it.t === pullEq.PULLOVER_MACHINE.padT)).entry;
  it('the seat stands on its post and the back pad is bracketed to the upright: both join the frame', () => {
    expect(floating(S[ID])).toEqual([]);
  });
  it('mutations: the seat without its post, and the frame without the back-pad bracket, are red', () => {
    const s = S[ID], i = entryOf(s, 'seat');
    expect(floating({ ...s, equipment: s.equipment.filter((_: any, k: number) => k !== i + 1) })).toEqual(['seat']);
    const noBracket = { ...s, equipment: s.equipment.filter((_: any, k: number) => k !== i + 2) };
    expect(floating(noBracket)).toEqual(['back pad']);
  });
});

describe('LIB-16 hidden start parts: dashed phantoms in the end pose (slice look item 2; DRAWING-GUIDE section 4)', { timeout: T }, () => {
  /** The phantom lines (class m-line) drawn in the end pose, all within r of the hidden start part they redraw (the start
   *  layer under the end head and lever hides it, slice look #297 6346404542 item 2): machine_crunch's fist and grip,
   *  around the start grip; machine_pullover's palm, forearm and bar, along the start forearm (elbow to grip). */
  const PHANTOM_FROM: Record<string, string> = { machine_crunch: 'grip.r', machine_pullover: 'elbow.r' };
  const phantomProblems = (spec: any, r = 0.12) => {
    const items = itemsIn(spec, 'end').items.filter((it: any) => it.type === 'line' && /m-line/.test(it.cls ?? ''));
    if (!items.length) return [`${spec.id}: no phantom`];
    const L = lmOf(spec, 'start'), a = L[PHANTOM_FROM[spec.id]!], b = L['grip.r'];
    const d = (p: number[]) => {
      const ux = b[1] - a[1], uy = b[2] - a[2], uu = ux * ux + uy * uy;
      const t = uu ? Math.max(0, Math.min(1, ((p[1]! - a[1]) * ux + (p[2]! - a[2]) * uy) / uu)) : 0;
      return Math.hypot(p[1]! - a[1] - t * ux, p[2]! - a[2] - t * uy);
    };
    return items.flatMap((it: any) => it.pts.filter((p: number[]) => d(p) > r).length ? [`${spec.id}: phantom point far from the hidden start part`] : []);
  };
  it('machine_crunch\'s start fist and grip, and machine_pullover\'s start hand and bar, are redrawn as dashed phantoms around the start grip', () => {
    for (const id of ['machine_crunch', 'machine_pullover']) {
      expect(phantomProblems(S[id]), id).toEqual([]);
    }
  });
  it('mutation: the phantom entry removed is red', () => {
    const s = S.machine_crunch;
    expect(phantomProblems({ ...s, equipment: s.equipment.slice(0, -1) })).toEqual(['machine_crunch: no phantom']);
  });
  it('mutation: machine_pullover\'s phantom moved 15 cm off the start forearm is red', () => {
    const s = S.machine_pullover, shift = (it: any) => ({ ...it, pts: it.pts.map((p: number[]) => [p[0], p[1]! + 0.15, p[2]]) });
    const equipment = [...s.equipment.slice(0, -1), (lm: any, ctx: any) => (s.equipment.at(-1)(lm, ctx) ?? null)?.map(shift) ?? null];
    expect(phantomProblems({ ...s, equipment }).length).toBeGreaterThan(0);
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
  // One tell only where a D-LIB10-SKULL1 per-id record rules it (slice look #297 6346404542 item 3; DESIGN.md section 18).
  const ONE_TELL = ['cable_chest_press'];
  it('each drawn plate draws its Mistake with 2-3 tells (1 for a SKULL1 per-id record), the first carrying the proposed key', () => {
    for (const id of specsDrawn()) {
      expect(keyProblems(S[id])).toEqual([]);
      if (ONE_TELL.includes(id)) { expect(S[id].mistake.tells.length, id).toBe(1); continue; }
      expect(S[id].mistake.tells.length, id).toBeGreaterThanOrEqual(2); expect(S[id].mistake.tells.length, id).toBeLessThanOrEqual(3);
    }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.machine_crunch;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['machine_crunch: first tell upright']);
  });
  const guideProblems = (spec: any) => spec.mistake.guides.filter((g: any) => !['dashed', 'arrow', 'arc-arrow'].includes(g.kind) && !isAxisGuide(spec, g)).map((g: any) => `${spec.id}: ${g.kind}`);
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
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg, axis = axisPath(spec, svg);
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].filter(m => m[1] !== axis).flatMap(m => {
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
  const PAD_CONTACT: Record<string, string[]> = { machine_crunch: ['hips', 'upright'], machine_pullover: ['pad', 'arch'] };
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
  /** No leader runs across a figure: away from its first 8 px at the anchor (a joint-centre anchor sits inside its limb),
   *  a leader stays outside the solid end figure on the normal plate, and outside both the end figure and the Mistake
   *  pose's figure (its red dashed outline) on the Mistake plate (slice look #297 6346404542 item 1). */
  const crossProblems = (spec: any) => {
    const out: string[] = [];
    for (const mistake of [false, true]) {
      const list = mistake ? spec.mistake.tells : spec.callouts;
      const polys = [...shapesIn(spec, 'end'), ...(mistake ? shapesIn(spec, 'mistake') : [])].map((x: any) => x.poly);
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
  it('mutation: the slice\'s "Arms pull" tell (anchored on the faulty upper arm by the neck, boxed top left) crosses the Mistake figure (red)', () => {
    const s = S.machine_crunch, tells = s.mistake.tells.map((x: any) => (x.key === 'arms' ? { ...x, anchor: { along: ['mistake:shoulder.r', 'mistake:elbow.r'], t: 0.15, pose: 'mistake' }, box: { left: 40, top: 112 } } : x));
    expect(crossProblems({ ...s, mistake: { ...s.mistake, tells } })).toContain('machine_crunch mistake arms: crosses the figure');
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
  const BENT: Record<string, string[]> = { machine_crunch: ['start', 'end'], machine_pullover: ['start', 'end'] };
  const armProblems = (spec: any) => (BENT[spec.id] ?? []).flatMap(pose => {
    const a = rep(spec).angles[pose], l = lmOf(spec, pose), out: string[] = [];
    // the report gives elbow flexion (0 = straight); the lesson's angle is the inside angle, 180 - flexion: a bent arm
    // is at most 150 deg inside (flexion >= 30) and not folded shut (flexion <= 150)
    for (const s of ['r', 'l']) if (!(a[`elbow.${s}`] >= 30 && a[`elbow.${s}`] <= 150)) out.push(`${pose}: elbow.${s} flexion ${a[`elbow.${s}`].toFixed(1)} (inside ${(180 - a[`elbow.${s}`]).toFixed(1)})`);
    if (Math.abs(l['elbow.l'][0] - l['elbow.r'][0]) < Math.abs(l['shoulder.l'][0] - l['shoulder.r'][0])) out.push(`${pose}: elbows inside shoulder width`);
    return out;
  });
  it('a bent arm reads as bent (elbow at most 150 deg inside and not folded shut, the elbows apart) on every drawn bent-arm plate', () => {
    for (const id of specsDrawn()) expect(armProblems(S[id]), id).toEqual([]);
  });
  it('mutation: machine_crunch\'s hands 5 cm from the shoulders (the elbow folded past 150 deg) is red', () => {
    const s = S.machine_crunch, st = s.poses.start, sh = lmOf(s, 'start')['shoulder.r'];
    const reach = { ...st.reach, r: { ...st.reach.r, at: [st.reach.r.at[0], sh[1] + 0.03, sh[2] + 0.04] } };
    expect(armProblems({ ...s, poses: { ...s.poses, start: { ...st, reach } } }).some(p => p.startsWith('start: elbow.r'))).toBe(true);
  });
  it('mutation (the card\'s A15): machine_pullover\'s start elbow at 170 deg inside (flexion 10) is red', () => {
    const s = S.machine_pullover, st = s.poses.start, l = lmOf(s, 'start'), sh = l['shoulder.r'];
    // the hand target pushed out along the shoulder → target line until the solved elbow opens to 170 deg inside
    const withK = (k: number) => ({ ...s, poses: { ...s.poses, start: { ...st, reach: { ...st.reach, r: { ...st.reach.r, at: st.reach.r.at.map((v: number, i: number) => sh[i]! + (v - sh[i]!) * k) } } } } });
    let lo = 1, hi = 2;
    for (let n = 0; n < 30; n++) { const m = (lo + hi) / 2; if (rep(withK(m)).angles.start['elbow.r'] > 10) lo = m; else hi = m; }
    const bad = withK((lo + hi) / 2);
    expect(rep(bad).angles.start['elbow.r']).toBeCloseTo(10, 0);
    expect(armProblems(bad).some(p => p.startsWith('start: elbow.r'))).toBe(true);
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
  it('card-true sizes (D-LIB8-shrug, D-LIB16-SIZE, -LOCK): cable_chest_press is below both PQ-H3 bars at plate scale, so each view carries a zoom (D-LIB16-ZOOMVIEWS)', () => {
    const s = S.cable_chest_press, R = { normal: plate.renderPlate(s, { id: 'x' }), mistake: plate.renderPlate(s, { id: 'x', mistake: true }) };
    const m = qaNode.nodeMetrics({ spec: s, plate: { normal: R.normal, mistake: R.mistake, alt: s.alt, mistakeAlt: '' } }, { engine: Eng() }, R), env = pins().envelope;
    expect(s.zoom.map((z: any) => z.view)).toEqual(['normal', 'mistake']);
    console.log(`LIB-16 cable_chest_press at plate scale: traceLen ${m.traceLen.toFixed(1)} px, deviation ${m.deviation.toFixed(1)} px`);
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

describe('LIB-16 A16: no other card\'s composer is copied, forked or imported (D-LIB16-COMPOSERS, -HANDLE, D-LIB-A16-COMPOSE)', () => {
  // D-LIB-A16-COMPOSE (lib4-cards section 39): MAIN_EQ is main's eq/ at 40f9ea93; OTHER_CARDS are the composers other build-ahead cards own.
  const MAIN_EQ = ['assistMachine', 'band', 'chestRowMachine', 'dHandle', 'declineBench', 'inclineBench', 'landmine', 'legCurlMachine', 'parts', 'pecDeck',
    'polybar', 'romanChair', 'rope', 'safetyArms', 'smith'].map(c => `${c}.mjs`);
  const OURS = COMPOSERS.map(c => `${c}.mjs`);
  const OTHER_CARDS: Record<string, string[]> = otherCards('LIB-16');   // D-LIB-A16-REGISTRY (#326): the shared registry
  const OTHER = Object.values(OTHER_CARDS).flat().map(c => `${c}.mjs`);
  const EQ = 'tools/plates/library/eq';
  const eqFiles = (): [string, string][] => readdirSync(EQ).map(n => [n, readFileSync(join(EQ, n), 'utf8')]);
  const eqProblems = (files: [string, string][]) => {
    const names = files.map(([n]) => n), ours = files.filter(([n]) => OURS.includes(n)).map(([, b]) => b);
    return [
      ...names.filter(n => !MAIN_EQ.includes(n) && !OURS.includes(n) && !OTHER.includes(n)).map(n => `extra ${n}`),
      ...files.filter(([n, b]) => OTHER.includes(n) && ours.includes(b)).map(([n]) => `copy of ours ${n}`),
      ...[...MAIN_EQ, ...OURS].filter(n => !names.includes(n)).map(n => `missing ${n}`),
    ];
  };
  it('tools/plates/library/eq/ holds main\'s files, this card\'s composers, and only named composers of other build-ahead cards', () => {
    expect(eqProblems(eqFiles())).toEqual([]);
    expect(OTHER.filter(n => OURS.includes(n))).toEqual([]);
  });
  it('mutation: a copy of #245\'s eq/dHandle.mjs added under eq/ under another name is red', () => {
    const files = eqFiles(), d = files.find(([n]) => n === 'dHandle.mjs')![1];
    expect(eqProblems([...files, ['singleHandle.mjs', d]])).toEqual(['extra singleHandle.mjs']);
  });
  it('mutation: a file named as another card\'s composer holding a byte copy of one of ours is red', () => {
    const files = eqFiles(), c = files.find(([n]) => n === 'crunchMachine.mjs')![1];
    expect(eqProblems([...files, ['dipBars.mjs', c]])).toEqual(['copy of ours dipBars.mjs']);
  });
  it('mutation: a missing main file or own composer is red', () => {
    expect(eqProblems(eqFiles().filter(([n]) => n !== 'smith.mjs' && n !== 'pulloverMachine.mjs'))).toEqual(['missing smith.mjs', 'missing pulloverMachine.mjs']);
  });
});

describe('LIB-16 A10: the LB6 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the LB6 rows are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb6/build.mjs'));
    // LIB-16R2: the resume 2 rows follow the 3 in rows.json order (wave 1, then wave 2)
    const R2_ORDER = ['low_to_high_cable_fly', 'high_to_low_cable_fly', 'smith_machine_squat', 'smith_machine_shoulder_press', 'smith_machine_incline_press',
      'hip_abduction', 'hip_adduction', 'machine_lateral_raise', 'rear_delt_fly'].filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`));
    expect(build.drawnIds()).toEqual([...drawn(), ...R2_ORDER].map(i => `lib_${i}`));
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
    expect(sizeProblems({ ...pullEq.PULLOVER_MACHINE }, sizes.composers.pulloverMachine)).toEqual([]);
    expect(Object.keys(sizes.ids).sort()).toEqual([...LB6].sort());
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

describe('LIB-16 resume: cable_chest_press slice item 3 (#297 6346404542)', { timeout: T }, () => {
  /** Every equipment item (the floor included) in every pose sits at least 8 px inside the plate's left and right edges
   *  (358 px; the zoom margin): nothing is cut off at the edge. */
  const edgeProblems = (spec: any) => {
    const cam = camOf(spec), out: string[] = [];
    for (const pose of posesOf(spec)) for (const it of itemsIn(spec, pose).items) for (const p of eng.PRIMITIVES[it.type](it, cam))
      for (const q of (p.poly ?? p.line ?? [])) if (q[0] < 8 || q[0] > 350) { out.push(`${spec.id} ${pose} ${it.type} x ${q[0].toFixed(1)}`); break; }
    return [...new Set(out)];
  };
  it('every drawn plate: the equipment and the floor sit 8 px inside the plate edges in every pose', () => {
    for (const id of specsDrawn()) expect(edgeProblems(S[id]), id).toEqual([]);
  });
  it('mutation: cable_chest_press at the slice\'s camera (x0 170: the column and the floor\'s back end cut off) is red', () => {
    const s = S.cable_chest_press;
    expect(edgeProblems({ ...s, camera: { ...s.camera, x0: 170 } }).length).toBeGreaterThan(0);
  });
  /** Away from its anchor (its first 12 px), a leader keeps at least 4 px from the solid end figure: it never runs along
   *  the body's outline. The approved plates measure 4.7 px and more. */
  const hugProblems = (spec: any, min = 4) => {
    const out: string[] = [], polys = shapesIn(spec, 'end').map((x: any) => x.poly);
    for (const mistake of [false, true]) {
      const list = mistake ? spec.mistake.tells : spec.callouts;
      leadersOf(plate.renderPlate(spec, { id: 'x', mistake }).svg).forEach((p, i) => {
        let g = Infinity;
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 12) g = Math.min(g, outside(polys, q));
        }
        if (g < min) out.push(`${spec.id} ${mistake ? 'mistake' : 'normal'} ${list[i]?.key}: ${g.toFixed(1)} px from the figure`);
      });
    }
    return out;
  };
  it('every drawn plate: no leader runs along the figure (4 px); cable_chest_press keeps 6 px', () => {
    expect(specsDrawn().flatMap(id => hugProblems(S[id]))).toEqual([]);
    expect(hugProblems(S.cable_chest_press, 6)).toEqual([]);
  });
  it('mutation: the slice\'s "Spine neutral" box (left 68, top 176 at x0 170: the leader 2.7 px along the low back) is red', () => {
    const s = S.cable_chest_press, bad = { ...s, camera: { ...s.camera, x0: 170 }, callouts: s.callouts.map((x: any) => (x.key === 'spine' ? { ...x, box: { left: 68, top: 176 } } : x)) };
    expect(hugProblems(bad)).toEqual(['cable_chest_press normal spine: 2.7 px from the figure']);
  });
  /** D-LIB10-SKULL1 per id: c17 and c5 name one sign of the fault (the elbow locked straight) and no second one, so the
   *  plate has one tell, `lock`, recorded in DESIGN.md section 18. */
  const tellProblems = (spec: any) => (JSON.stringify(spec.mistake.tells.map((t: any) => t.key)) === '["lock"]' ? [] : [`tells ${spec.mistake.tells.map((t: any) => t.key)}`]);
  it('cable_chest_press has one tell, lock, with its per-id record', () => {
    expect(tellProblems(S.cable_chest_press)).toEqual([]);
    expect(readFileSync('tools/plates/library/lb6/DESIGN.md', 'utf8')).toMatch(/D-LIB10-SKULL1 per id: cable_chest_press/);
  });
  it('mutation: the slice\'s second tell (line, "No bend left") added back is red', () => {
    const s = S.cable_chest_press, line = { key: 'line', text: 'No bend<br>left', anchor: { along: ['mistake:elbow.r', 'mistake:wrist.r'], t: 0.5, pose: 'mistake' }, box: { left: 276, top: 72 }, cue: 'x' };
    expect(tellProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells, line] } })).toEqual(['tells lock,line']);
  });
});

describe('LIB-16 resume: one zoom per view (D-LIB16-ZOOMVIEWS, #327 6405117790), runQa node half on lib_cable_chest_press', { timeout: T }, () => {
  const ID = 'lib_cable_chest_press';
  let build: any, cand: any, golden: any, zoom: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, golden, zoom] = await Promise.all(['lb6/build.mjs', 'candidate.mjs', '../golden.mjs', 'zoom/inline.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb6All();
    html = (await build.buildLb6Page({ all, ids: [ID] })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins: pins() });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  // The spec with a different zoom field, built the way the page builds it (a scratch module importing the real spec).
  const withZoom = async (z: any) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb6-zoom-')), file = join(dir, 'cable_chest_press.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/cable_chest_press.mjs'))};\nexport default { ...s, zoom: ${JSON.stringify(z)} };\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb6', title: 'LB6', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: both views carry their zoom, each meets its own bar at its own k (Trace at k 3, deviation at k 4: 11.91 px), no node-half problem', async () => {
    const c = await candOf(), r = await qa(c), z = r.metrics.zoom, env = pins().envelope;
    expect(node(r)).toEqual([]);
    expect(Object.keys(c.plate.zoom).filter(v => c.plate.zoom[v])).toEqual(['normal', 'mistake']);
    expect([z.normal.k, z.mistake.k]).toEqual([3, 4]);
    expect(z.normal.trace).toBeGreaterThanOrEqual(env.traceLenMin);
    expect(z.mistake.deviation).toBeGreaterThanOrEqual(env.deviationMin);
    expect(+z.mistake.deviation.toFixed(2)).toBe(11.91);
  });
  it('no angle text and no text at all in either zoom (lib-zoom-card rules)', async () => {
    const c = await candOf();
    for (const v of ['normal', 'mistake']) { expect(c.plate.zoom[v]).not.toMatch(/<(text|foreignObject|tspan)\b/); expect(c.plate.zoom[v]).not.toMatch(/\d\s*°|degree/i); }
  });
  it('mutation: a list with one entry below its view\'s bar (Mistake k 3.8: 11.31 px) is red on H3.zoom:deviation only', async () => {
    const r = await qa(await withZoom([{ view: 'normal', k: 3 }, { view: 'mistake', k: 3.8 }]));
    expect(node(r)).toEqual(['H3.zoom:deviation']);
  });
  it('mutation: only the Mistake zoom listed leaves the normal view at plate scale: H3.trace is red', async () => {
    const r = await qa(await withZoom([{ view: 'mistake', k: 4 }]));
    expect(node(r)).toContain('H3.trace');
    expect(node(r)).not.toContain('H3.deviation');
  });
  it('mutations: two zooms on the same view, three entries and an unknown view name are each red (field)', () => {
    expect(zoom.zoomFieldProblems([{ view: 'normal', k: 3 }, { view: 'normal', k: 2 }])).toEqual(['zoom: two entries for the normal view']);
    expect(zoom.zoomFieldProblems([{ view: 'normal', k: 3 }, { view: 'mistake', k: 4 }, { view: 'mistake', k: 2 }])).toEqual(['zoom: a list holds 1 or 2 entries, not 3']);
    expect(zoom.zoomFieldProblems([{ view: 'normal', k: 3 }, { view: 'side', k: 4 }])).toEqual(["zoom[1]: zoom.view \"side\" is not 'normal' or 'mistake'"]);
    expect(zoom.zoomFieldProblems([])).toEqual(['zoom: a list holds 1 or 2 entries, not 0']);
    expect(zoom.zoomFieldProblems([{ view: 'normal', k: 3 }, { view: 'mistake', k: 4 }])).toEqual([]);
  });
  it('mutation: the same two field errors in the page build are red in QA (H3.zoom:field), and the build refuses them', async () => {
    await expect(withZoom([{ view: 'normal', k: 3 }, { view: 'normal', k: 2 }])).rejects.toThrow(/two entries for the normal view/);
    const c = await candOf(), r = await qa({ ...c, spec: { ...c.spec, zoom: [{ view: 'normal', k: 3 }, { view: 'side', k: 4 }] } });
    expect(node(r)).toContain('H3.zoom:field');
  });
  it('a single { view, k } behaves exactly as before: the same field messages and the same one-entry list', () => {
    expect(zoom.zoomFieldProblems({ view: 'mistake', k: 4.5 })).toEqual(['zoom.k 4.5 is outside 1.5-4']);
    expect(zoom.zoomFieldProblems('x')).toEqual(['zoom must be { view, k }']);
    expect(zoom.zoomList({ view: 'mistake', k: 2 })).toEqual([{ view: 'mistake', k: 2 }]);
    expect(zoom.zoomList(undefined)).toEqual([]);
  });
});

describe('LIB-16 resume: the approved LB6 plates stay byte-identical (page 2668c838 on main 9c3287cd)', { timeout: T }, () => {
  // golden.mjs fragmentsOf of machine_pullover and machine_crunch on main's LB6 page 2668c838…e84e (both approved, #297).
  const APPROVED: Record<string, Record<string, string>> = {
    "machine-pullover": {
      "normalSvg": "90b18786547aede0c06fa694bbf48a91868721bf17f37625fea5b04760a867a6",
      "normalOverlay": "9716f8050db626def56b9342914e5d38fefa2a6fe7978f29066605dc62cfcc80",
      "mistakeSvg": "a452764ab7f5f89dfa7dc223c9ee4397f08313358d0407549f1151f529d65d11",
      "mistakeOverlay": "742c20ff35b94de8f842dc7e2aa0d8ddc32bbb1c1bb35e6ec18ae7fcf47175ca",
      "tells": "491dfaa9fec824f16a2290510510b6fa5d9a4f4c9ea8f38a9e4d3f0a0359ed3a",
      "tempo": "b37933c8afd15cb27a7c24b8a5c3ffb7b724043f9f941f02556437dcc468f05c",
      "cues": "59c4002969a558f75c224b1af3682a555fbc0c6c73ee981e9640354810010be3",
      "alt": "11812bcb66d9aca001d755e1aca82d34992fcd313475948ba06c316ec1de2ea3",
      "mistakeAlt": "085e0256b6100a80433467822c8a375eb546239d5f548ba74126c05d54a056ac"
    },
    "machine-crunch": {
      "normalSvg": "84f40fef5f3bf085d60ac7783d5314c8286373b611ed756e3eac89392a9df853",
      "normalOverlay": "73d7918d7860536593f5104b1ad8b7645b795f039959695a294183afda8410b9",
      "mistakeSvg": "00cde1d6d101b079604b9d8e86ddbf2062b933a31f9c71eea88e87052b514b33",
      "mistakeOverlay": "e7629c1233f50b12af83b27868f6064432e59763ddc48b2354448e98a3fbd1fa",
      "tells": "8723fbfb79cd1a8c214a9cecebd4e51b75d69daecf44efa14b59dacf522be00e",
      "tempo": "930c82bc67ced3119730716a7e154f7bfa89efeaf93786a7c00424619b4b2e6e",
      "cues": "01a21499b2a008b2d5f575ba3c9861549abc5410760404cd1b9135e3e6229841",
      "alt": "d5726f6f297755b1e91f223a9dfff432675cbb654a727b1b46c3943d5586a9f4",
      "mistakeAlt": "303808b6a230987ae4b78692056f7bc35cdf255012ebd4a4b9b8236c336ac54f"
    }
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb6/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const fragProblems = (html: string) => Object.entries(APPROVED).flatMap(([c, want]) => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`);
  });
  it("machine_pullover and machine_crunch fragments on this head equal main's approved ones", async () => {
    expect(fragProblems((await build.buildLb6Page()).html.toString('utf8'))).toEqual([]);
  });
  it("mutation: one byte changed in machine_crunch's Mistake alt is red", async () => {
    const html = (await build.buildLb6Page()).html.toString('utf8'), p = golden.extractPlates(html).find((x: any) => x.chromeId === 'machine-crunch');
    expect(fragProblems(html.replace(p.mistakeAlt, p.mistakeAlt.replace(/e/, 'E')))).toContain('machine-crunch mistakeAlt');
  });
});

describe('LIB-16 resume: cable_chest_press panel lb4p R5, the locked-arm axis line (#327 6410191598)', { timeout: T }, () => {
  it('the Mistake plate draws one solid red line along the locked arm, Mistake shoulder to handle centre', () => {
    const s = S.cable_chest_press;
    expect(s.mistake.guides.filter((g: any) => isAxisGuide(s, g)).length).toBe(1);
    expect(axisPath(s, plate.renderPlate(s, { id: 'x', mistake: true }).svg)).not.toBeNull();
  });
  it('the line runs through the Mistake zoom: the zoom render draws it inside the circle', async () => {
    const zoom = await import(/* @vite-ignore */ lib('zoom/inline.mjs'));
    const z = zoom.zoomOf(S.cable_chest_press, { prefix: 'x', view: 'mistake' }), C = z.circle.c, r = z.circle.r;
    const ins = [...z.svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].map(m => xy(m[1]!)).filter(p => p.length === 2);
    // the magnified axis crosses the circle: some point of it lies inside
    const hit = ins.some(([a, b]) => [...Array(41)].some((_, k) => Math.hypot(a![0]! + (b![0]! - a![0]!) * k / 40 - C[0], a![1]! + (b![1]! - a![1]!) * k / 40 - C[1]) < r));
    expect(hit).toBe(true);
  });
  it('mutation: the line removed is red', () => {
    const s = S.cable_chest_press, bad = { ...s, mistake: { ...s.mistake, guides: [] } };
    expect(bad.mistake.guides.filter((g: any) => isAxisGuide(bad, g)).length).toBe(0);
    expect(axisPath(bad, plate.renderPlate(bad, { id: 'x', mistake: true }).svg)).toBeNull();
  });
  it('mutation: the exemption is exact: an elbow-to-handle solid line, or the axis on machine_crunch, is still red under A15', () => {
    const s = S.cable_chest_press, other = { kind: 'line', pts: [{ at: 'elbow.r', pose: 'mistake' }, { at: 'grip.r', pose: 'mistake' }] };
    expect(isAxisGuide(s, other)).toBe(false);
    const c = S.machine_crunch;
    expect(isAxisGuide(c, { kind: 'line', pts: [{ at: 'shoulder.r', pose: 'mistake' }, { at: 'grip.r', pose: 'mistake' }] })).toBe(false);
  });
});

// ======================================================================================================================
// LIB-16R2 (lib-16r2-card; rulings D-LIB16R2-1 to -9, PLAN RULED #354 6543628951): the resume 2 rows, drawn H.
// Each block reads what is drawn (the spec's poses through the engine, its items, the engine's shapes) and carries
// its own mutations.
// ======================================================================================================================
const R2_ALL = ['low_to_high_cable_fly', 'high_to_low_cable_fly', 'machine_lateral_raise', 'rear_delt_fly', 'hip_abduction', 'hip_adduction',
  'smith_machine_squat', 'smith_machine_shoulder_press', 'smith_machine_incline_press'];
const R2_W1 = ['low_to_high_cable_fly', 'high_to_low_cable_fly', 'smith_machine_squat', 'smith_machine_shoulder_press', 'smith_machine_incline_press'];
const R2_HEAD = 'a48b059400a74d5c9e3aceed21cf1aa67ab6f118';
const R2M: Record<string, any> = {}, R2S: Record<string, any> = {};
const r2Drawn = () => R2_ALL.filter(i => existsSync(`tools/plates/library/specs/${i}.mjs`));
/** The plate camera in either view, from the engine's own report. */
const r2Cam = (spec: any) => { const c = plate.renderPlate(spec, { id: 'x' }).report.camera, side = spec.view === 'side';
  return { view: side ? 'side' : 'front', near: side ? 'r' : null, pxm: c.pxPerM, P: (w: number[]) => [c.x0 + (side ? w[2]! : w[0]!) * c.pxPerM, c.y0 - w[1]! * c.pxPerM] }; };
const r2Shapes = (spec: any, pose: string) => {
  const b = { height: 1.75 }, p = pose === 'mistake' ? (() => { const m: any = JSON.parse(JSON.stringify(spec.poses.end)); for (const [k, v] of Object.entries<any>(spec.mistake.pose)) m[k] = (v && typeof v === 'object' && !Array.isArray(v) && m[k] && typeof m[k] === 'object') ? { ...m[k], ...v } : v; return m; })() : spec.poses[pose];
  return body.bodyShapes(body.fk(body.resolve(body.normPose(p, b), b).q, b), r2Cam(spec)).filter((x: any) => x.poly);
};
/** Clearance (px) of a screen polyline of half-width r from the outlines whose key matches `re`; negative inside. */
const r2Clear = (pts: number[][], shapes: any[], re: RegExp, r = 0) => {
  const polys = shapes.filter((x: any) => re.test(x.key)).map((x: any) => x.poly);
  let d = Infinity;
  for (const P of polys) {
    if (pts.some(p => inPoly(P, p))) return -1;
    for (let i = 0; i < P.length; i++) for (let j = 0; j < Math.max(1, pts.length - 1); j++) {
      const a = pts[j]!, b = pts[Math.min(j + 1, pts.length - 1)]!, q0 = P[i]!, q1 = P[(i + 1) % P.length]!;
      d = Math.min(d, segD(q0, a, b), segD(q1, a, b), segD(a, q0, q1), segD(b, q0, q1));
    }
  }
  return d - r;
};
/** The neck: the torso outline beyond the `neck` landmark along the lumbar→neck axis (PLAN RULED point 1). */
const r2Neck = (spec: any, pose: string, shapes: any[]) => {
  const cam = r2Cam(spec), lm = lmOf(spec, pose), n = cam.P(lm.neck), l = cam.P(lm.lumbar), k = Math.hypot(n[0]! - l[0]!, n[1]! - l[1]!), u = [(n[0]! - l[0]!) / k, (n[1]! - l[1]!) / k];
  return shapes.find((x: any) => x.key === 'torso').poly.filter((q: number[]) => (q[0]! - n[0]!) * u[0]! + (q[1]! - n[1]!) * u[1]! > 0);
};
const r2PtsClear = (pts: number[][], c: number[], r: number) => Math.min(...pts.map(q => Math.hypot(q[0]! - c[0]!, q[1]! - c[1]!))) - r;

describe('LIB-16R2 setup', { timeout: T }, () => {
  beforeAll(async () => { for (const id of r2Drawn()) { R2M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); R2S[id] = R2M[id].default; } }, T);
  it('wave 1 is drawn', () => { expect(r2Drawn().filter(i => R2_W1.includes(i))).toEqual(R2_W1); });
});

describe('LIB-16R2 A8: the 9 cards and quotes are byte copies of research a48b0594 (cards.sha.json r2)', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'], j = readJson('tools/plates/library/lb6/cards.sha.json').r2;
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  it('r2 names the head and the 9 ids; each card without the three keys and each quotes file matches', () => {
    expect(j.researchHead).toBe(R2_HEAD);
    expect(Object.keys(j.cards)).toEqual(R2_ALL);
    expect(Object.keys(j.quotes)).toEqual(R2_ALL);
    for (const id of R2_ALL) {
      expect(sha(canon(cardOf(id))), id).toBe(j.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(j.quotes[id]);
    }
  });
  it('mutation: another card key edited is red', () => {
    const c = cardOf('rear_delt_fly'); c.plate.view = 'side';
    expect(sha(canon(c))).not.toBe(j.cards.rear_delt_fly);
  });
  it('each drawn row\'s How-to source holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of r2Drawn()) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});

describe('LIB-16R2 A9: nothing ships', { timeout: T }, () => {
  const ids = () => r2Drawn().map(i => `lib_${i}`);
  const stageProblems = (rows: Record<string, any>) => ids().filter(id => !['drawing', 'review'].includes(rows[id]?.stage)).map(id => `${id}: ${rows[id]?.stage}`);
  it('every drawn R2 row is in rows.json at stage drawing or review, mode H, no parent, template or params', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems(rows)).toEqual([]);
    for (const id of ids()) expect([rows[id].mode, rows[id].parent, rows[id].template, rows[id].params], id).toEqual(['H', undefined, undefined, undefined]);
  });
  it('mutation: one row set to shipped is red', () => {
    const rows = readJson(ROWS).rows;
    expect(stageProblems({ ...rows, lib_smith_machine_squat: { ...rows.lib_smith_machine_squat, stage: 'shipped' } })).toEqual(['lib_smith_machine_squat: shipped']);
  });
  it('none is shipped with rows.json read as a batch file, and no R2 id or slug is in batches/ or the golden files', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(reg.shippedIds(rows).filter((i: string) => ids().includes(i))).toEqual([]);
    for (const dir of ['tools/plates/library/batches', 'tests/howto/golden/library']) for (const f of readdirSync(dir)) {
      const text = readFileSync(join(dir, f), 'utf8');
      for (const id of R2_ALL) {
        expect(new RegExp(`\\b(lib_)?${id}\\b`).test(text), `${f}: ${id}`).toBe(false);
        expect(new RegExp(`(^|[^a-z0-9-])${id.replace(/_/g, '-')}([^a-z0-9-]|$)`).test(text), `${f}: slug ${id}`).toBe(false);
      }
    }
  });
});

describe('LIB-16R2 A7: tempo strips follow the cards (tempo.json r2, D-LIB8M-TEMPO)', { timeout: T }, () => {
  beforeAll(async () => { for (const id of r2Drawn()) if (!R2S[id]) { R2M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); R2S[id] = R2M[id].default; } }, T);
  // The ruled table (DESIGN.md 19.2), copied here, never read from tempo.json or a spec.
  const RULED: Record<string, [string, string, boolean][]> = {
    low_to_high_cable_fly: [['Close', 'up', true], ['Hold', 'pause', false], ['Open', 'down', true]],
    high_to_low_cable_fly: [['Close', 'up', true], ['Hold', 'pause', false], ['Open', 'down', true]],
    smith_machine_squat: [['Lower', 'down', true], ['Drive up', 'up', true]],
    smith_machine_shoulder_press: [['Lower', 'down', true], ['Press', 'up', true]],
    smith_machine_incline_press: [['Lower', 'down', true], ['Press', 'up', true]],
  };
  const build = (rows: any[], t: any) => rows.map(r => ({ phase: r.phase, s: t[r.from], ...(r.move ? { move: true } : {}) }));
  const problems = (tj: any, specs: Record<string, any>) => Object.keys(RULED).flatMap(id => {
    const rows = tj.r2.ids[id]?.rows ?? [], t = readJson(`docs/research/howto/cards/${id}.json`).plate.tempo, bad: string[] = [];
    if (JSON.stringify(rows.map((r: any) => [r.phase, r.from, !!r.move])) !== JSON.stringify(RULED[id])) bad.push(`${id}: rows != ruled`);
    if (rows.some((r: any) => r.phase === 'Rest')) bad.push(`${id}: Rest`);
    if ((t.pause > 0) !== rows.some((r: any) => r.from === 'pause')) bad.push(`${id}: Hold and pause disagree`);
    if (JSON.stringify(tj.r2.ids[id]?.claim) !== JSON.stringify(t.claim)) bad.push(`${id}: claim`);
    if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(build(rows, t))) bad.push(`${id}: spec tempo != the built strip`);
    return bad;
  });
  const tj = () => readJson('tools/plates/library/lb6/tempo.json');
  it('tempo.json r2 follows the ruled table and each drawn spec\'s tempo is built from it and its card', () => {
    expect(problems(tj(), R2S)).toEqual([]);
    expect(R2S.smith_machine_squat.tempo).toEqual([{ phase: 'Lower', s: 3, move: true }, { phase: 'Drive up', s: 1, move: true }]);
  });
  it('mutations: a Hold on the squat (pause 0), the fly Hold removed, a bottom pause drawn and one second changed are red', () => {
    const red = (f: (t: any, s: any) => void) => { const t = tj(), s: any = { ...R2S }; f(t, s); return problems(t, s).length > 0; };
    expect(red(t => { t.r2.ids.smith_machine_squat.rows.splice(1, 0, { phase: 'Hold', from: 'pause' }); })).toBe(true);
    expect(red(t => { t.r2.ids.low_to_high_cable_fly.rows.splice(1, 1); })).toBe(true);
    expect(red((t, s) => { s.smith_machine_incline_press = { ...s.smith_machine_incline_press, tempo: [...s.smith_machine_incline_press.tempo, { phase: 'Pause', s: 1 }] }; })).toBe(true);
    expect(red((t, s) => { s.high_to_low_cable_fly = { ...s.high_to_low_cable_fly, tempo: [{ ...s.high_to_low_cable_fly.tempo[0], s: 3 }, ...s.high_to_low_cable_fly.tempo.slice(1)] }; })).toBe(true);
  });
});

describe('LIB-16R2 A17: sizes fixed in lb6/sizes.json r2, never sized by PQ-H3', { timeout: T }, () => {
  beforeAll(async () => { for (const id of r2Drawn()) if (!R2S[id]) { R2M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); R2S[id] = R2M[id].default; } }, T);
  const table = () => readJson('tools/plates/library/lb6/sizes.json').r2.ids;
  const problems = (spec: Record<string, number>, t: Record<string, any>) => [
    ...Object.keys(spec).filter(k => !(k in t)).map(k => `${k}: not in sizes.json`),
    ...Object.keys(t).filter(k => !(k in spec)).map(k => `${k}: not in the spec`),
    ...Object.keys(spec).filter(k => k in t && t[k].value !== spec[k]).map(k => `${k}: spec ${spec[k]} != sizes.json ${t[k].value}`),
    ...Object.entries(t).flatMap(([k, r]: [string, any]) => [...(typeof r.basis === 'string' && r.basis.trim() ? [] : [`${k}: empty basis`]),
      ...(/PQ-H3|deviationMin|traceLenMin|\bH3\b/.test(r.basis ?? '') ? [`${k}: basis names PQ-H3`] : [])]),
  ];
  it('each drawn spec\'s SIZES equals its row, every row with a basis that is not PQ-H3', () => {
    for (const id of r2Drawn()) expect(problems(R2M[id].SIZES, table()[id]), id).toEqual([]);
  });
  it('mutations: a Mistake size changed in the spec only, an empty basis and a PQ-H3 basis are red', () => {
    const s = { ...R2M.high_to_low_cable_fly.SIZES }, t = table().high_to_low_cable_fly;
    expect(problems({ ...s, MIS_CROSS: 0.12 }, t)).toEqual(['MIS_CROSS: spec 0.12 != sizes.json 0.08']);
    expect(problems(s, { ...t, MIS_CROSS: { ...t.MIS_CROSS, basis: ' ' } })).toEqual(['MIS_CROSS: empty basis']);
    expect(problems(s, { ...t, MIS_CROSS: { ...t.MIS_CROSS, basis: 'sized to clear deviationMin' } })).toEqual(['MIS_CROSS: basis names PQ-H3']);
  });
});

describe('LIB-16R2 A4: card-true poses on the drawn items (wave 1)', { timeout: T }, () => {
  beforeAll(async () => { for (const id of r2Drawn()) if (!R2S[id]) { R2M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); R2S[id] = R2M[id].default; } }, T);
  const pulleyYs = (spec: any, pose: string) => itemsIn(spec, pose).items.filter((x: any) => x.type === 'cableColumn').map((x: any) => x.pulley.at[1]);
  /** low_to_high: pulleys between knee and hip (c1); the hands meet above the chest, at the midline (c5). */
  const lowHigh = (spec: any) => { const s = lmOf(spec, 'start'), e = lmOf(spec, 'end'), ys = pulleyYs(spec, 'start'), bad: string[] = [];
    if (!(ys.length === 2 && ys.every((y: number) => y > s['knee.r'][1] && y < s['hip.r'][1]))) bad.push('pulleys not between knee and hip');
    if (!(e['grip.r'][1] > e.chest[1] && e['grip.l'][1] > e.chest[1])) bad.push('hands not above the chest');
    if (!(Math.abs(e['grip.r'][0] - e['grip.l'][0]) <= 0.12)) bad.push('hands do not meet');
    return bad; };
  /** high_to_low: pulleys at about the crown (c1, within 5 cm); hands meet below the chest (c5). */
  const highLow = (spec: any) => { const s = lmOf(spec, 'start'), e = lmOf(spec, 'end'), ys = pulleyYs(spec, 'start'), bad: string[] = [];
    if (!(ys.length === 2 && ys.every((y: number) => Math.abs(y - s.head[1]) <= 0.05))) bad.push('pulleys not at the crown');
    if (!(e['grip.r'][1] < e.chest[1] && e['grip.l'][1] < e.chest[1])) bad.push('hands not below the chest');
    if (!(Math.abs(e['grip.r'][0] - e['grip.l'][0]) <= 0.12)) bad.push('hands do not meet');
    if (!(s['grip.r'][1] < ys[0])) bad.push('start hands above the pulleys');
    return bad; };
  /** Each smith bar centre on its rail in every drawn pose (c8 of the anchor; smith.mjs throws otherwise). */
  const onRail = (spec: any, rail: number) => posesOf(spec).filter(p => Math.abs(lmOf(spec, p).grips[2] - rail) > 1e-6);
  /** smith_machine_squat: mid-soles 7.6-15.2 cm ahead of the rail (c2); thighs at least parallel (c6). */
  const squat = (spec: any, rail: number) => { const e = lmOf(spec, 'end'), bad: string[] = [];
    for (const sd of ['r', 'l']) { const ahead = lmOf(spec, 'start')[`sole.${sd}`][2] - rail; if (!(ahead >= 0.076 && ahead <= 0.152)) bad.push(`sole.${sd} ${(ahead * 100).toFixed(1)} cm ahead`); }
    if (!(e['hip.r'][1] <= e['knee.r'][1] + 0.005)) bad.push('thighs above parallel');
    return bad; };
  const fromVertical = (lm: any) => Math.atan2(-(lm.backUpper[2] - lm.buttock[2]), lm.backUpper[1] - lm.buttock[1]) * 180 / Math.PI;
  it('low_to_high_cable_fly (c1, c5) and high_to_low_cable_fly (c1, c5)', () => {
    expect(lowHigh(R2S.low_to_high_cable_fly)).toEqual([]);
    expect(highLow(R2S.high_to_low_cable_fly)).toEqual([]);
  });
  it('mutation: the low-to-high pulleys at shoulder height are red', () => {
    const s = R2S.low_to_high_cable_fly, y = lmOf(s, 'start')['shoulder.r'][1];
    const m = { ...s, equipment: s.equipment.map((e: any) => (typeof e === 'function' ? (lm: any, ctx: any) => { const it = e(lm, ctx); return it?.type === 'cableColumn' ? { ...it, pulley: { ...it.pulley, at: [it.pulley.at[0], y, it.pulley.at[2]] } } : it; } : e)) };
    expect(lowHigh(m)).toContain('pulleys not between knee and hip');
  });
  it('the smith bars stay on their rails in every pose; the squat feet are 7.6-15.2 cm ahead with thighs parallel (c2, c6)', () => {
    for (const id of ['smith_machine_squat', 'smith_machine_shoulder_press', 'smith_machine_incline_press']) expect(onRail(R2S[id], R2M[id].RAIL_Z), id).toEqual([]);
    expect(squat(R2S.smith_machine_squat, R2M.smith_machine_squat.RAIL_Z)).toEqual([]);
  });
  it('mutation: the squat feet under the rail are red', () => {
    const s = R2S.smith_machine_squat, rail = R2M.smith_machine_squat.RAIL_Z, plant = s.poses.start.plant;
    const m = { ...s, poses: { ...s.poses, start: { ...s.poses.start, plant: { l: { ...plant.l, at: [plant.l.at[0], 0, rail] }, r: { ...plant.r, at: [plant.r.at[0], 0, rail] } } } } };
    expect(squat(m, rail).length).toBeGreaterThan(0);
  });
  it('the benches at the card angles (shoulder press about 70° from the floor, c1; incline 30°, card equipment) and the arms at the end (c5, c6; c3)', () => {
    const sp = R2S.smith_machine_shoulder_press, ip = R2S.smith_machine_incline_press;
    for (const p of posesOf(sp)) expect(fromVertical(lmOf(sp, p)), `shoulder press ${p}`).toBeCloseTo(20, 0);
    for (const p of posesOf(ip)) expect(fromVertical(lmOf(ip, p)), `incline ${p}`).toBeCloseTo(60, 0);
    const e = lmOf(sp, 'end'), lvl = Math.atan2(e['elbow.r'][1] - e['shoulder.r'][1], Math.hypot(e['elbow.r'][0] - e['shoulder.r'][0], e['elbow.r'][2] - e['shoulder.r'][2])) * 180 / Math.PI;
    expect(lvl).toBeGreaterThanOrEqual(-15); expect(lvl).toBeLessThanOrEqual(0);                 // about parallel or slightly below (c6)
    expect(e['elbow.r'][2] - e['shoulder.r'][2]).toBeGreaterThan(0.05);                           // elbows in front of the shoulders (c5)
    expect(R2M.smith_machine_incline_press.info().endArmFromTorsoDeg).toBeCloseTo(60, 0);           // c3 45-75
  });
});

describe('LIB-16R2 A5: load and machine parts clear the body by 2 px (D-LIB16R2-CLEAR; wave 1)', { timeout: T }, () => {
  beforeAll(async () => { for (const id of r2Drawn()) if (!R2S[id]) { R2M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); R2S[id] = R2M[id].default; } }, T);
  // Listed, not tested (PLAN RULED point 1-2): side-view rods, hook rails, frames, plates and stops; front-view columns;
  // the cables where they pass in front of the torso or arms. Contacts excepted: the handles in the hands (c3 / c1).
  const cables = (spec: any, pose: string) => { const cam = r2Cam(spec);
    return itemsIn(spec, pose, { mistake: pose === 'mistake' }).items.filter((x: any) => x.type === 'cable').map((x: any) => [cam.P(x.from), cam.P(x.to)]); };
  const flyClear = (spec: any) => posesOf(spec).flatMap(p => { const sh = r2Shapes(spec, p);
    return cables(spec, p).flatMap((c, i) => [['head', /^head$/], ['legs', /^(thigh|kneecap|shank|foot)\./]].map(([k, re]) => [`${p} cable${i} ${k}`, r2Clear(c, sh, re as RegExp)] as [string, number])); });
  it('each cable clears the head and the legs by 2 px in every pose', () => {
    for (const id of ['low_to_high_cable_fly', 'high_to_low_cable_fly']) { const rows = flyClear(R2S[id]); expect(rows.length, id).toBe(posesOf(R2S[id]).length * 4); for (const [k, d] of rows) expect(d, `${id} ${k}`).toBeGreaterThanOrEqual(2); }
  });
  it('mutation: a cable run to the nose (the end grip at the face) is red', () => {
    const s = R2S.low_to_high_cable_fly, cam = r2Cam(s), sh = r2Shapes(s, 'end'), [c] = cables(s, 'end'), chin = cam.P(lmOf(s, 'end').chin);
    expect(r2Clear([c![0]!, [chin[0]!, chin[1]! - 12]], sh, /^head$/)).toBeLessThan(2);
  });
  /** A smith bar shaft (r BAR_R) against the head and the neck, along its whole path (1 cm steps start → end) and at the Mistake. */
  const barClear = (id: string, rail = R2M[id].RAIL_Z) => { const s = R2S[id], cam = r2Cam(s), r = R2M[id].SIZES.BAR_R * cam.pxm, out: [string, number][] = [];
    for (const p of posesOf(s)) { const sh = r2Shapes(s, p), neck = r2Neck(s, p, sh), lm = lmOf(s, p);
      const ys = p === 'start' ? (() => { const a = lmOf(s, 'start').grips[1], b = lmOf(s, 'end').grips[1], n = Math.ceil(Math.abs(a - b) / 0.01); return Array.from({ length: n + 1 }, (_, i) => a + (b - a) * i / n); })() : [lm.grips[1]];
      for (const y of ys) { const c = cam.P([0, y, rail]); out.push([`${p} head`, r2Clear([c], sh, /^head$/, r)], [`${p} neck`, r2PtsClear(neck, c, r)]); } }
    return out; };
  it('each smith bar shaft clears the head and the neck by 2 px along its path (the squat bar on the traps, c1; the shoulder press bar past the nose, c3)', () => {
    for (const id of ['smith_machine_squat', 'smith_machine_shoulder_press', 'smith_machine_incline_press']) for (const [k, d] of barClear(id)) expect(d, `${id} ${k}`).toBeGreaterThanOrEqual(2);
    expect(Math.min(...barClear('smith_machine_squat').filter(([k]) => /neck/.test(k)).map(([, d]) => d))).toBeCloseTo(5.06, 1);   // PLAN 19.5
  });
  it('mutations (the clearance-setting value at 0): the shoulder press rail on the nose line and the squat bar at the neck landmark are red', () => {
    const sp = R2M.smith_machine_shoulder_press;
    expect(Math.min(...barClear('smith_machine_shoulder_press', sp.HEAD_FRONT[0]).map(([, d]) => d))).toBeLessThan(2);
    // the squat bar moved onto the neck: its centre on the neck outline point nearest the drawn bar
    const s = R2S.smith_machine_squat, cam = r2Cam(s), sh = r2Shapes(s, 'end'), neck = r2Neck(s, 'end', sh), b = cam.P([0, lmOf(s, 'end').grips[1], R2M.smith_machine_squat.RAIL_Z]);
    const c = neck.reduce((a: number[], q: number[]) => (Math.hypot(q[0]! - b[0]!, q[1]! - b[1]!) < Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!) ? q : a));
    expect(r2PtsClear(neck, c, R2M.smith_machine_squat.SIZES.BAR_R * cam.pxm)).toBeLessThan(2);
  });
});

describe('LIB-16R2 A2: nothing else moves', { timeout: T }, () => {
  // golden.mjs fragmentsOf of cable_chest_press on main 6d34542c's LB6 page e4260472…6848 (approved, #327).
  const CCP: Record<string, string> = {
    normalSvg: '68eb24a330219cf370d5aa55b7467452e4ce98aec6a93520ce92ee4bc82f6b25', normalOverlay: '571208660a04cfc7428a87fbbde495f3ea46935ddfcf17b20a70b827b5616d8f',
    mistakeSvg: 'ea8c790503843ecc945ce75b507dc8df3248da3eed48b6661b79449c36dae413', mistakeOverlay: '6b907ed879c9e764145ce07565321596c3a4f01e5820f7f51af09945b72b3525',
    tells: '758aead6ba01fd41188eb408036a7a99f728f43ed9bcb32fbe0ceb02883a7270', tempo: '073ad782e26734e85a2eae2df1e5d162e9241f58c132f620f389edd7f9931f45',
    cues: '6fbadd342422baf4239267b6479cead05a32adfdcf205f93790c6746b4c586d1', alt: '4d5a5e052c095e422e5fcda3618092c01ed2031b3e78e06445335cd8bd56027f',
    mistakeAlt: 'e398c48e2a4080f9938231a33627dbbd22028b6f13f043c8ef050c52f46cd759',
  };
  // The composers this card imports and never edits (main 6d34542c bytes; all four are in pinned closures).
  const EQ: Record<string, string> = {
    'eq/smith.mjs': '34f188f1ba5075dc12e0f52f383b386a5a4985f0467f031e6837aa0081ad4cde', 'eq/pecDeck.mjs': '577a33a11794598dbafa72a3ef19b623d5ccc6e4379575b7a328b86b6f6d5ddd',
    'eq/inclineBench.mjs': '00d3f16f7ff7b3a0d96e6765363f6631d0e095e3de2dbe0a85980a68dd37a128', 'eq/parts.mjs': '50c007664e6fb56bbbb96d06701151123040e494c33bceef0c25288d39290ae0',
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb6/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const ccpProblems = (html: string) => { const p = golden.extractPlates(html).find((x: any) => x.chromeId === 'cable-chest-press'), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(CCP).filter(k => got[k] !== CCP[k]); };
  it("cable_chest_press's 9 fragments on this head equal main's approved ones", async () => {
    expect(ccpProblems((await build.buildLb6Page()).html.toString('utf8'))).toEqual([]);
  });
  it("mutation: one byte in cable_chest_press's alt is red", async () => {
    const html = (await build.buildLb6Page()).html.toString('utf8'), p = golden.extractPlates(html).find((x: any) => x.chromeId === 'cable-chest-press');
    expect(ccpProblems(html.replace(p.alt, p.alt.replace(/e/, 'E')))).toContain('alt');
  });
  it('eq/smith, pecDeck, inclineBench and parts are byte-identical to main; mutation: one byte changed is red', () => {
    for (const [f, h] of Object.entries(EQ)) expect(sha(readFileSync(`tools/plates/library/${f}`)), f).toBe(h);
    expect(sha(readFileSync('tools/plates/library/eq/smith.mjs', 'utf8').replace('RAIL_T = 0.03', 'RAIL_T = 0.04'))).not.toBe(EQ['eq/smith.mjs']);
  });
});

describe('LIB-16R2 A3: the resume 2 spec closures are pure (D-LIB9-CLONE: copied, never imported)', { timeout: T }, () => {
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/vendor/exercises/')),
    ...c.filter(p => /^tools\/plates\/library\/(hands|fidelity|ci|templates)\//.test(p)),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
  ];
  it('every drawn R2 spec imports no other spec, no vendor exercise and no layer, and reads no file', () => {
    for (const id of r2Drawn()) { const f = `tools/plates/library/specs/${id}.mjs`; expect(problems(f, closure.closureOf([f])), f).toEqual([]); }
  });
  it('mutation: the shoulder press importing its clone source (`reclined` from incline_dumbbell_press) is red', () => {
    const f = 'tools/plates/library/specs/smith_machine_shoulder_press.mjs', root = mkdtempSync(join(tmpdir(), 'lb6r2-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    writeFileSync(join(root, f), `import { reclined as R0 } from './incline_dumbbell_press.mjs';\nexport const _R0 = R0;\n${readFileSync(f, 'utf8')}`);
    try { expect(problems(f, closure.closureOf([f], root))).toContain('tools/plates/library/specs/incline_dumbbell_press.mjs'); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});
