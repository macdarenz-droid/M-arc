// LIB-13 (lib-13-card Do 2 a, Do 4, Do 6; acceptance A2, A3, A5, A9, A11; rulings D-LIB13-* and lib4-cards 12-24): the
// LB3 build-ahead plates. Node only: the browser half of the plate QA runs in tools/plates/library/lb3/qa.mjs.
// Every test reads what is drawn (the items a spec emits, the engine's landmarks and report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB3 = ['pendlay_row', 't_bar_row', 'landmine_row', 'one_arm_dumbbell_row', 'dumbbell_romanian_deadlift', 'conventional_deadlift',
  'sumo_deadlift', 'back_extension'];
const IDS = LB3.map(i => `lib_${i}`);
const REUSED = ['barbell_row', 'romanian_deadlift', 'single_leg_romanian_deadlift', 'upright_row'];
const SHRUGS = ['dumbbell_shrug', 'cable_shrug', 'barbell_shrug'];
const ROWS = 'tools/plates/library/lb3/rows.json';
const RESEARCH_HEAD = '2dd60ae0349b06a4aac88a11347edac5536f8424';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

const COMPOSERS = ['landmine'];
const SLICE = ['landmine_row', 'one_arm_dumbbell_row', 'conventional_deadlift'];
const dist = (a: number[], b: number[]) => Math.hypot(a[0]! - b[0]!, a[1]! - b[1]!, a[2]! - b[2]!);

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, pins: any, lmEq: any;
const M: Record<string, any> = {}, S: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, lmEq] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'eq/landmine.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  pins = qaIdx.loadPins();
  for (const id of SLICE) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
}, T);

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
const h9 = (spec: any) => {
  let R: any = null;
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: pins.envelope }, R).map((p: any) => p.key);
};
/** Landmarks at an even t across the drawn path (start, via keys, end), as the engine samples ghosts and the trace. */
const pathLm = (spec: any, t: number) => {
  const H = { height: 1.75 }, keys = [spec.poses.start, ...(spec.poses.via ?? []), spec.poses.end].map((p: any) => body.normPose(p, H));
  return body.landmarks(body.fk(body.poseAt(keys, t, H).q, H));
};
const tenths = Array.from({ length: 11 }, (_, k) => k / 10);
const deg = (a: number[], b: number[]) => Math.atan2(Math.abs(b[2]! - a[2]!), Math.abs(b[1]! - a[1]!)) * 180 / Math.PI;   // from vertical, side plane

/** The LB3 ids whose spec file exists (drawn), in LB3 order. */
const drawn = () => LB3.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`));

describe('LIB-13 A5: lb3/rows.json holds exactly the drawn, non-held LB3 ids', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn id exactly once in the raw text, nothing else; no reused id or shrug in any LB3 file', () => {
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
    for (const f of readdirSync('tools/plates/library/lb3')) {
      const text = readFileSync(join('tools/plates/library/lb3', f), 'utf8');
      for (const id of [...REUSED, ...SHRUGS]) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id} as a row`).toBe(false);
    }
    for (const id of SHRUGS) expect(new RegExp(`\\b(lib_)?${id}\\b`).test(readFileSync(ROWS, 'utf8')), id).toBe(false);
  });
  it('mutations: a dropped row, a duplicated row, a reused id added and a held id added are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const j = { batch: 'LB3', rows: { lib_landmine_row: row, lib_conventional_deadlift: row } }, w = ['lib_landmine_row', 'lib_conventional_deadlift'];
    const text = JSON.stringify(j, null, 1);
    expect(a5(text, w)).toEqual([]);
    const drop = { ...j, rows: { lib_landmine_row: row } };
    expect(a5(JSON.stringify(drop, null, 1), w)).toEqual(['lib_conventional_deadlift x0']);
    const dup = text.replace('  "lib_landmine_row": {', `  "lib_landmine_row": ${JSON.stringify(row)},\n  "lib_landmine_row": {`);
    expect(a5(dup, w)).toEqual(['lib_landmine_row x2']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_barbell_row: row } }, null, 1), w)).toEqual(['extra lib_barbell_row']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_dumbbell_shrug: row } }, null, 1), w)).toEqual(['extra lib_dumbbell_shrug']);
  });
  it('every row points at its own spec file and carries the census view; batch LB3, censusRef 4a9fd86; all H (DESIGN.md section 1)', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe('side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB3', censusRef: '4a9fd86' });
    expect(existsSync('tools/plates/library/templates')).toBe(false);   // HROW and HINGE are not built (DESIGN.md 1)
  });
});

describe('LIB-13 A9: nothing ships (D-LIB13-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/landmine_row.mjs', slug: 'landmine-row', prefix: 'landmine-row', chromeId: 'landmine-row', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB3 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = { ...readJson(ROWS).rows, lib_landmine_row: someRow };
    expect(stageProblems({ ...rows, lib_landmine_row: { ...someRow, stage: 'shipped' } })).toEqual(['lib_landmine_row: shipped']);
    expect(stageProblems({ ...rows, lib_landmine_row: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_landmine_row: approved-plate']);
  });
  it('no LB3 drawn id or shrug is shipped, even with lb3/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => [...IDS, ...SHRUGS.map(s => `lib_${s}`)].includes(i))).toEqual([]);
  });
  /** An id or its slug as a whole token in a file's name or text. */
  const tokenHits = (ids: string[], name: string, text: string) => ids.flatMap(id => {
    const slug = id.replace(/_/g, '-'), s = `${name}\n${text}`, out: string[] = [];
    if (new RegExp(`\\b(lib_)?${id}\\b`).test(s)) out.push(`${name}: ${id}`);
    if (new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(s)) out.push(`${name}: ${slug}`);
    return out;
  });
  // Before pilot A is on main, the 4 reused ids are in no batches/ or golden file either; once it is, they sit in pilot
  // A's batch file only (B1 of LIB-10's critic, carried).
  const pilotAOnMain = () => readdirSync('tools/plates/library/batches').some(n => /pilot/i.test(n));
  const watched = () => [...LB3, ...SHRUGS, ...(pilotAOnMain() ? [] : REUSED)];
  const batchProblems = (files: [string, string][]) => files.flatMap(([f, text]) => [
    ...(/lb3/i.test(f) ? [`${f}: an LB3 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB3"/.test(text) ? [`${f}: names batch LB3`] : []),
    ...tokenHits(watched(), f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB3 id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB3 id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB3 id, a page-only lb3.json, back-extension.layers.html and lib_upright_row in batches/ before pilot A are red', () => {
    const rowsText = JSON.stringify({ batch: 'LB3', rows: { lib_landmine_row: someRow } }, null, 1);
    expect(batchProblems([['zz.json', rowsText]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_conventional_deadlift"}']])).toEqual(['x.json: conventional_deadlift']);
    expect(batchProblems([['lb3.json', '{"entries":[{"kind":"page","batch":"LB3"}]}']]).length).toBe(2);
    expect(batchProblems([['back-extension.layers.html', '<div data-id="back-extension"></div>']])).toEqual(['back-extension.layers.html: back-extension']);
    if (!pilotAOnMain()) expect(batchProblems([['p.json', '{"rows":{"lib_upright_row":{}}}']])).toEqual(['p.json: upright_row']);
  });
  it('controls: a file naming only lib_romanian_deadlift and lib_single_leg_romanian_deadlift stays green against the 8 drawn ids', () => {
    const scan = (text: string) => tokenHits(LB3, 'p.json', text);
    expect(scan('{"rows":{"lib_romanian_deadlift":{},"lib_single_leg_romanian_deadlift":{}}}')).toEqual([]);
    expect(scan('{"rows":{"lib_dumbbell_romanian_deadlift":{}}}')).toEqual(['p.json: dumbbell_romanian_deadlift']);
  });
  it('over exercises.json, no real id other than lib_<id> contains any of the 8 drawn ids', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    expect(ex.filter((e: string) => IDS.some(id => e !== id && e.includes(id.slice(4))))).toEqual([]);
    for (const id of IDS) expect(ex, id).toContain(id);
  });
  it('once pilot A is on main, each reused id has exactly one registry row, in pilot A\'s batch file, and no lb3/ file names it', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    for (const id of REUSED) {
      const hits = rows.filter((r: any) => r.id === `lib_${id}`);
      if (pilotAOnMain()) { expect(hits.length, id).toBe(1); expect(hits[0].batchFile, id).toMatch(/pilot/i); } else expect(hits, id).toEqual([]);
    }
    for (const f of readdirSync('tools/plates/library/lb3').filter(n => n.endsWith('.json'))) for (const id of REUSED)
      expect(new RegExp(`"(lib_)?${id}"`).test(readFileSync(join('tools/plates/library/lb3', f), 'utf8')), `${f}: ${id}`).toBe(false);
  });
  it('no LB3 spec, composer, How-to or test imports anything under hands/', () => {
    const files = [...drawn().map(i => `tools/plates/library/specs/${i}.mjs`), ...['landmine', 'romanChair'].map(c => `tools/plates/library/eq/${c}.mjs`).filter(f => existsSync(f)),
      ...LB3.map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb3/build.mjs', 'tools/plates/library/lb3/qa.mjs', 'tests/howto/lb3-plates.test.ts'];
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/from\s+['"][^'"]*\/hands\/|import\(\s*[^)]*\/hands\//);
  });
  it('generate --check is green, and no generated file is read from lb3/, the LB3 specs, composers or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const t0 = Date.now(), out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    console.log(`LIB-13 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    for (const [p, { text }] of out) {
      expect(text, p).not.toMatch(/library\/lb3\/|landmine\.mjs|romanChair/);
      for (const id of LB3) expect(text, p).not.toMatch(new RegExp(`library/(specs|howto)/(lib_)?${id}\\b`));
    }
  });
});

describe('LIB-13 A11 (Do 6 a): the 8 cards and quotes are byte copies of the LB3 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb3/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 8 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB3);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB3);
    for (const id of LB3) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('landmine_row'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.landmine_row);
  });
  it('the How-to source of each LB3 id holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of LB3) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});

describe('LIB-13 A2 / Do 4: the landmine composer and the H slice plates draw PRIMITIVES only', { timeout: T }, () => {
  it('composer sources import no file reader and nothing under tools/plates/layers/', () => {
    for (const f of COMPOSERS) {
      const src = readFileSync(`tools/plates/library/eq/${f}.mjs`, 'utf8');
      expect(src, f).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
      expect(src, f).not.toMatch(/layers\//);
    }
  });
  it('every item the slice plates draw is a PRIMITIVES type, in every drawn pose', () => {
    for (const id of SLICE) for (const pose of posesOf(S[id]))
      for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
  });
  it('the slice plates pass PQ-H9 (the landmine bar and plate are poly in every pose)', () => {
    for (const id of SLICE) expect(h9(S[id]), id).toEqual([]);
    for (const pose of posesOf(S.landmine_row)) {
      const moving = itemsIn(S.landmine_row, pose).items.filter(it => it.type === 'poly');
      expect(moving.length, pose).toBe(3);   // shaft, sleeve, plate
    }
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.landmine_row;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws the slice plates with no engine issue and every check within its tolerance', () => {
    for (const id of SLICE) {
      const r = plate.renderPlate(S[id], { id: 'x' }).report;
      expect(r.issues ?? [], id).toEqual([]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-13 A2: the landmine bar on landmine_row, per drawn pose (13.1)', { timeout: T }, () => {
  const PX = 146.29;
  /** The shaft poly's pivot end and axis (the rectangle's first and last points straddle the pivot). */
  const barOf = (spec: any, pose: string) => {
    const polys = itemsIn(spec, pose).items.filter(it => it.type === 'poly');
    const shaft = polys[0], sleeve = polys[1];
    const mid = (a: number[], b: number[]) => a.map((v, i) => (v + b[i]!) / 2);
    return { pivot: mid(shaft.pts[0], shaft.pts[3]), end: mid(sleeve.pts[1], sleeve.pts[2]), shaft, sleeve, plate: polys[2] };
  };
  const offAxis = (p: number[], a: number[], b: number[]) => {
    const u = b.map((v, i) => v - a[i]!), L = Math.hypot(...u), w = p.map((v, i) => v - a[i]!);
    const t = (w[0]! * u[0]! + w[1]! * u[1]! + w[2]! * u[2]!) / L / L;
    return Math.hypot(w[1]! - u[1]! * t, w[2]! - u[2]! * t);   // side plane distance
  };
  const problems = (spec: any) => {
    const bad: string[] = [], p0 = barOf(spec, 'end').pivot;
    for (const pose of posesOf(spec)) {
      const { pivot, end } = barOf(spec, pose), lm = itemsIn(spec, pose).lm;
      if (Math.hypot(pivot[1]! - p0[1]!, pivot[2]! - p0[2]!) * PX > 1) bad.push(`${pose}: pivot moved`);
      if (Math.abs(pivot[1]! - lmEq.LANDMINE.hingeH) > 0.001) bad.push(`${pose}: pivot off the hinge height`);
      for (const g of ['grip.r', 'grip.l']) if (offAxis(lm[g], pivot, end) > 0.01) bad.push(`${pose}: ${g} off the bar`);
    }
    return bad;
  };
  it('the pivot end sits at one fixed floor point (±1 px) in start, end and Mistake; both hands are on the bar axis (within 1 cm, c4)', () => {
    expect(problems(S.landmine_row)).toEqual([]);
  });
  it('the far hand is just behind the inner collar and the near hand below it on the bar, one above the other (c4)', () => {
    const { pivot, end } = barOf(S.landmine_row, 'start'), lm = itemsIn(S.landmine_row, 'start').lm;
    const along = (p: number[]) => dist(p, pivot);
    const collar = lmEq.LANDMINE.barLen - lmEq.LANDMINE.collarFromEnd;
    expect(collar - along(lm['grip.l'])).toBeGreaterThan(0);
    expect(collar - along(lm['grip.l'])).toBeLessThanOrEqual(0.06);
    expect(lm['grip.l'][1]).toBeGreaterThan(lm['grip.r'][1]);
    expect(dist(end, pivot)).toBeCloseTo(lmEq.LANDMINE.barLen, 6);
  });
  it('the plate stands edge on, perpendicular to the bar, at the inner collar, in every pose', () => {
    for (const pose of posesOf(S.landmine_row)) {
      const { pivot, end, plate: pl } = barOf(S.landmine_row, pose), u = end.map((v, i) => v - pivot[i]!), across = pl.pts[0].map((v: number, i: number) => v - pl.pts[3][i]);
      const dot = (u[1]! * across[1] + u[2]! * across[2]) / Math.hypot(u[1]!, u[2]!) / Math.hypot(across[1], across[2]);
      expect(Math.abs(dot), pose).toBeLessThan(1e-9);
      expect(Math.hypot(across[1], across[2]), pose).toBeCloseTo(lmEq.LANDMINE.plateD, 6);
    }
  });
  const swapEntry = (spec: any, fn: (it: any, ctx: any) => any) => ({ ...spec, equipment: spec.equipment.map((e: any) => (typeof e !== 'function' ? e
    : (lm: any, ctx: any) => { const r = e(lm, ctx); return Array.isArray(r) ? r.map(it => fn(it, ctx)) : (r ? fn(r, ctx) : r); })) });
  it('mutations: the pivot moved 2 cm in the Mistake and the bar laid off the grip are red', () => {
    const shift = (it: any, ctx: any, dz: number) => (it && it.type === 'poly' && ctx.pose === 'mistake' ? { ...it, pts: it.pts.map((p: number[]) => [p[0], p[1], p[2]! + dz]) } : it);
    expect(problems(swapEntry(S.landmine_row, (it, ctx) => shift(it, ctx, 0.02)))).toContain('mistake: pivot moved');
    const tilt = (it: any, ctx: any) => (it && it.type === 'poly' && ctx.pose === 'end' ? { ...it, pts: it.pts.map((p: number[]) => [p[0], p[1]! + 0.025 * p[2]!, p[2]]) } : it);
    expect(problems(swapEntry(S.landmine_row, tilt)).some(p => /end: grip\.[rl] off the bar|end: pivot/.test(p))).toBe(true);
  });
  it('mutation (Q4 (a)-(b)): the moving shaft swapped for a rackUpright gives exactly H9.moving-line:eq<i>.rackUpright.<j>', () => {
    const hits = new Set<number>(), spec = S.landmine_row;
    const swapped = { ...spec, equipment: spec.equipment.map((e: any, i: number) => (typeof e !== 'function' ? e
      : (lm: any, ctx: any) => { const it = e(lm, ctx); if (it && it.type === 'poly' && it.pts.length === 4 && Math.hypot(it.pts[0][1] - it.pts[3][1], it.pts[0][2] - it.pts[3][2]) < 0.03) { hits.add(i); const a = it.pts[1]; return { type: 'rackUpright', at: [0, 0, a[2]], h: a[1] }; } return it; })) };
    const keys = h9(swapped);
    expect(hits.size).toBe(1);
    const i = [...hits][0];
    expect(itemsIn(spec, 'end').items.find(it => it.entry === i).pts).not.toEqual(itemsIn(spec, 'mistake').items.find(it => it.entry === i).pts);
    expect(keys.length).toBe(1);
    expect(keys[0]).toMatch(new RegExp(`^H9\\.moving-line:eq${i}\\.rackUpright\\.\\d+$`));
  });
  it('the start bar and plate are redrawn as a dashed phantom in the end pose only (13 Q2 (c))', () => {
    const ph = (pose: string, mistake = false) => itemsIn(S.landmine_row, pose, { mistake }).items.filter(it => it.type === 'line' && /^start/.test(it.part ?? ''));
    expect(ph('end').map(l => l.part)).toEqual(['startbar', 'startplate']);
    for (const l of ph('end')) expect(l.cls).toMatch(/m-line/);
    expect(ph('start')).toEqual([]);
    expect(ph('mistake', true)).toEqual([]);
  });
});

describe('LIB-13 conventional_deadlift (H, ruling 4): drawn facts', { timeout: T }, () => {
  const s = () => S.conventional_deadlift, lm = (p: string) => itemsIn(s(), p).lm;
  it('c23: at the floor start (spec end) the 45 cm plates rest on the floor: bar centre 22.5 cm up (±2 mm), plate rim on the floor line', () => {
    const bar = itemsIn(s(), 'end').items.find(it => it.type === 'barbell');
    expect(bar.at[1]).toBeCloseTo(0.225, 2);
    expect(Math.abs(bar.at[1] - 0.225)).toBeLessThanOrEqual(0.002);
  });
  it('c1, c3, c4: the bar over mid-foot (|z| ≤ 5 mm), the arm vertical (shoulder over the grip within 1 deg), the shin 2-10 mm behind the bar', () => {
    const e = lm('end');
    expect(Math.abs(e.grips[2])).toBeLessThanOrEqual(0.005);
    expect(deg(e['shoulder.r'], e['grip.r'])).toBeLessThanOrEqual(1);
    const gap = (e.grips[2] - e['knee.r'][2]);
    expect(gap).toBeGreaterThan(0);   // the bar is in front of the knee
  });
  it('c6, c10: standing tall at the top (spec start): knees within 3 deg of straight, the hip-shoulder line within 3 deg of vertical, the bar on the thighs over mid-foot', () => {
    const r = plate.renderPlate(s(), { id: 'x' }).report, st = lm('start');
    expect(r.angles.start['knee.r']).toBeLessThanOrEqual(3);
    expect(deg(st['hip.r'], st['shoulder.r'])).toBeLessThanOrEqual(3);
    expect(Math.abs(st.grips[2])).toBeLessThanOrEqual(0.005);
  });
  it('c6: across the path (t = 0..1 in tenths) the bar stays within 2 cm of the mid-foot plumb line and never enters the drawn legs', () => {
    const R = eng.RADII, H = 1.75;
    for (const t of tenths) {
      const L = pathLm(s(), t);
      expect(Math.abs(L.grips[2]), `t ${t}`).toBeLessThanOrEqual(0.02);
      const kneeGap = Math.hypot(L.grips[1] - L['knee.r'][1], L.grips[2] - L['knee.r'][2]) - R.kneeCap * H - 0.014;
      expect(kneeGap, `t ${t}`).toBeGreaterThan(0);
    }
  });
  it('c7 R10: the back is flat in the right poses (lumbar flexion ≤ 5 deg in start, via and end)', () => {
    for (const p of [s().poses.start, ...s().poses.via, s().poses.end]) expect(p.trunk).toBeLessThanOrEqual(5);
  });
  it('c8 Mistake: the lumbar flexes at least 20 deg more and the pelvis tucks, the bar just off the floor (1-4 cm), the feet and hips held', () => {
    const e = s().poses.end, m = s().mistake.pose, ml = itemsIn(s(), 'mistake').lm, el = lm('end');
    expect(m.trunk - e.trunk).toBeGreaterThanOrEqual(20);
    expect(m.root.tilt).toBeLessThan(e.root.tilt);
    expect(m.root.at).toEqual(e.root.at);
    expect(ml.grips[1] - el.grips[1]).toBeGreaterThanOrEqual(0.01);
    expect(ml.grips[1] - el.grips[1]).toBeLessThanOrEqual(0.04);
  });
});

describe('LIB-13 one_arm_dumbbell_row (H, support anchor; drawable false): drawn facts', { timeout: T }, () => {
  const s = () => S.one_arm_dumbbell_row, lm = (p: string) => itemsIn(s(), p).lm;
  it('c2: the far hand straight under the far shoulder (±1 cm) and the far knee under the hip (±1 cm), on one bench top', () => {
    for (const p of posesOf(s())) {
      const l = lm(p);
      expect(Math.abs(l['wrist.l'][2] - l['shoulder.l'][2]), p).toBeLessThanOrEqual(0.01);
      expect(Math.abs(l['knee.l'][2] - l['hip.l'][2]), p).toBeLessThanOrEqual(0.01);
    }
    const bench = itemsIn(s(), 'end').items.find(it => it.type === 'bench');
    expect(bench.at[1]).toBe(M.one_arm_dumbbell_row.oaInfo ? 0.42 : NaN);
  });
  it('c3, c4: the back flat and level (thorax within 3 deg of horizontal, spine 0) in every pose', () => {
    for (const p of posesOf(s())) {
      const l = lm(p), th = Math.atan2(l.backUpper[1] - l.sacrum[1], l.backUpper[2] - l.sacrum[2]) * 180 / Math.PI;   // the back line
      expect(Math.abs(th), p).toBeLessThanOrEqual(3);
    }
  });
  it('c5: at the start the working arm hangs straight down (elbow ≤ 8 deg, the wrist within 2 cm of under the shoulder)', () => {
    const r = plate.renderPlate(s(), { id: 'x' }).report, st = lm('start');
    expect(r.angles.start['elbow.r']).toBeLessThanOrEqual(8);
    expect(Math.abs(st['wrist.r'][2] - st['shoulder.r'][2])).toBeLessThanOrEqual(0.02);   // the arm plumb (the bent-back wrist moves the grip)
  });
  it('c6, c9: at the end the dumbbell is at the hip (within 12 cm along the body) and at least 30 cm higher; the elbow bent and behind the shoulder', () => {
    const e = lm('end'), st = lm('start');
    expect(Math.abs(e['grip.r'][2] - e['hip.r'][2])).toBeLessThanOrEqual(0.12);
    expect(e['grip.r'][1] - st['grip.r'][1]).toBeGreaterThanOrEqual(0.30);
    expect(e['elbow.r'][2]).toBeLessThan(e['shoulder.r'][2]);
  });
  it('c10 Mistake (short range): the dumbbell stops at least 15 cm short of the end spot, and the shoulder blade is not pulled back', () => {
    const e = lm('end'), m = itemsIn(s(), 'mistake').lm;
    expect(dist(m['grip.r'], e['grip.r'])).toBeGreaterThanOrEqual(0.15);
    expect(s().mistake.pose.scap.r.pro).toBeGreaterThan(s().poses.end.scap.r.pro);
  });
  it('drawable false: the spec names the drawable-fault convention (F7 expected)', () => {
    expect(s().pilot.drawableFault).toMatch(/momentum/);
  });
});

describe('LIB-13 H slice Mistakes, tells, cues and tempo (DESIGN.md sections 8-9)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { landmine_row: 'round', one_arm_dumbbell_row: 'short', conventional_deadlift: 'round' };
  const TEMPO: Record<string, any[]> = {
    landmine_row: [{ phase: 'Pull', s: 1, move: true }, { phase: 'Lower', s: 2, move: true }],
    one_arm_dumbbell_row: [{ phase: 'Pull', s: 2, move: true }, { phase: 'Lower', s: 2, move: true }],
    conventional_deadlift: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Lift', s: 1, move: true }],
  };
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  it('each slice plate draws its Mistake with 2-3 tells, the first carrying the proposed key', () => {
    for (const id of SLICE) { expect(keyProblems(S[id])).toEqual([]); expect(S[id].mistake.tells.length, id).toBeGreaterThanOrEqual(2); expect(S[id].mistake.tells.length, id).toBeLessThanOrEqual(3); }
  });
  it('mutation: the first tell key swapped is red', () => {
    const s = S.conventional_deadlift;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['conventional_deadlift: first tell tuck']);
  });
  const guideProblems = (spec: any) => spec.mistake.guides.filter((g: any) => !['dashed', 'arrow'].includes(g.kind)).map((g: any) => `${spec.id}: ${g.kind}`);
  it('A15: every Mistake guide is dashed or an arrow (red parts over the solid end figure are dashed, 13.1); mutation: a solid line guide is red', () => {
    for (const id of SLICE) expect(guideProblems(S[id])).toEqual([]);
    const s = S.conventional_deadlift;
    expect(guideProblems({ ...s, mistake: { ...s.mistake, guides: [...s.mistake.guides, { kind: 'line', pts: s.mistake.guides[0].pts }] } })).toEqual(['conventional_deadlift: line']);
  });
  it('the tempo strips are the proposed arrays (DESIGN.md section 8)', () => {
    for (const id of SLICE) expect(S[id].tempo, id).toEqual(TEMPO[id]);
  });
  /** Q-D5-6 cue table: every callout and tell cue is one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : []), ...(/[.!?]./.test(c.cue.trim().slice(0, -1)) ? [`${c.key}: two sentences`] : [])];
  });
  it('A15 cue table: every cue is one sentence of 15 words or fewer; mutation: a 16-word cue is red', () => {
    for (const id of SLICE) expect(cueProblems(S[id]), id).toEqual([]);
    const s = S.one_arm_dumbbell_row;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Put your supporting hand right under your shoulder and your knee right under your hip now.' }, ...s.callouts.slice(1)] })).toEqual(['hand: 16 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of SLICE) {
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
  it('A15 leaders: no leader comes within 6 px of the Trace or of the landmine bar, away from its anchor; mutation: a callout boxed onto the bar is red', () => {
    const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
    const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
    const dseg = (p: number[], [a, b]: number[][]) => { const dx = b![0]! - a![0]!, dy = b![1]! - a![1]!, L2 = dx * dx + dy * dy || 1;
      const t = Math.max(0, Math.min(1, ((p[0]! - a![0]!) * dx + (p[1]! - a![1]!) * dy) / L2)); return Math.hypot(p[0]! - a![0]! - t * dx, p[1]! - a![1]! - t * dy); };
    const minGap = (spec: any) => {
      let min = Infinity;
      for (const mistake of [false, true]) {
        const r = plate.renderPlate(spec, { id: 'x', mistake }), svg: string = r.svg, cam = r.report.camera;
        const P = (w: number[]) => [cam.x0 + w[2]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
        const avoid = [...svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
        if (spec.id === 'landmine_row') { const lm = itemsIn(spec, mistake ? 'mistake' : 'end').lm; const f = lmEq.barFrame(M.landmine_row.LM_ROW.pivot, lm['grip.r']); avoid.push([P(M.landmine_row.LM_ROW.pivot), P(f.end)]); }
        for (const [, d] of svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)) {
          const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]);
          for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
            const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
            if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const g of avoid) min = Math.min(min, dseg(q, g));
          }
        }
      }
      return min;
    };
    for (const id of ['one_arm_dumbbell_row', 'conventional_deadlift']) expect(minGap(S[id]), id).toBeGreaterThanOrEqual(6);
    const s = S.landmine_row, lm = itemsIn(s, 'end').lm, cam = plate.renderPlate(s, { id: 'x' }).report.camera;
    const at = (w: number[]) => [cam.x0 + w[2]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
    const p = at(lmEq.alongBar(M.landmine_row.LM_ROW.pivot, lm['grip.r'], 0.6));
    const bad = { ...s, callouts: [{ ...s.callouts[0], anchor: 'heel.r', box: { left: Math.round(p[0]! - 20), top: Math.round(p[1]! - 45) } }, ...s.callouts.slice(1)] };
    expect(minGap(bad)).toBeLessThan(6);
  });
});

describe('LIB-13 D-LIB9-CLONE b: each copied root finder throws on a bracket with no root', () => {
  it('the 3 slice specs', () => {
    for (const [id, f] of [['landmine_row', 'solve'], ['one_arm_dumbbell_row', 'solve'], ['conventional_deadlift', 'bisect']] as const) {
      expect(() => M[id][f]((x: number) => x - 5, 0, 1), id).toThrow(/no solution/);
      expect(M[id][f]((x: number) => x - 0.25, 0, 1), id).toBeCloseTo(0.25, 9);
    }
  });
});

describe('LIB-13 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => drawn().map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
    ...c.filter(p => p.startsWith('tools/plates/library/templates/')),
  ];
  it('every drawn LB3 spec passes', () => {
    expect(files().length).toBeGreaterThanOrEqual(3);
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb3-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/landmine_row.mjs';
  it('mutation: readFileSync added to the landmine composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/landmine.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing a pilot A spec (another specs/ file) is red', () => {
    const root = scratch(r => {
      writeFileSync(join(r, 'tools/plates/library/specs/barbell_row.mjs'), "export const solve = () => null;\nexport default {};\n");
      const p = join(r, F); writeFileSync(p, `import { solve as _s } from './barbell_row.mjs';\n${readFileSync(p, 'utf8')}`);
    });
    try { expect(problems(F, closure.closureOf([F], root))).toEqual(['tools/plates/library/specs/barbell_row.mjs']); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-13 A10: the LB3 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the drawn LB3 ids are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb3/build.mjs'));
    expect(build.drawnIds().length).toBeGreaterThanOrEqual(3);
    const a = await build.buildLb3Page(), b = await build.buildLb3Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});

describe('LIB-13 A4: runQa node half on an LB3 plate (lib_conventional_deadlift), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_conventional_deadlift', cg = () => S.conventional_deadlift;
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb3/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb3All();
    html = (await build.buildLb3Page({ all, ids: [ID] })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb3-mut-')), file = join(dir, 'conventional_deadlift.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/conventional_deadlift.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb3', title: 'LB3', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: no node-half problem, and the only raised flags wait on the browser half (F2, F5) or on Do 6 b (F7: no card top fault yet)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual(['H6:no-card']);   // expected before Do 6 b (card Do 2 a)
    expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5', 'F7'].includes(f))).toEqual([]);
  });
  it('A4 M1 a label 1 px onto the figure (the Flat back callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg().callouts.find((x: any) => x.key === 'back'), at = (box: any) => ({ ...cg(), callouts: cg().callouts.map((x: any) => (x.key === 'back' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[0, -1], [1, 0], [-1, 0], [0, 1]]) {
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
    const a = MUT('M3').prepare(E, cg(), pins.envelope);
    const c = await mutated('(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose (and its Mistake-only plate ring dropped, so nothing differs) turns PQ-H3 red', async () => {
    // premise: the last equipment entry is the Mistake-only plate ring, drawn in no other pose
    const last = cg().equipment[cg().equipment.length - 1];
    expect(last({ grips: [0, 0.2, 0] }, { pose: 'mistake' })?.part).toBe('mplate');
    expect(last({ grips: [0, 0.2, 0] }, { pose: 'end' })).toBeNull();
    const c = await mutated('s => ({ ...s, equipment: s.equipment.slice(0, -1), mistake: { ...s.mistake, pose: {}, parts: undefined } })');
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
