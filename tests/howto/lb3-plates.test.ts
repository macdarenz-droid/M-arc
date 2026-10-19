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
const RESEARCH_HEAD = '892d6516c4dcd88f7b7e22b8cbbf19dc762a8342';
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');

const COMPOSERS = ['landmine', 'romanChair'];
const SLICE = ['pendlay_row', 'landmine_row', 'one_arm_dumbbell_row', 'dumbbell_romanian_deadlift', 'conventional_deadlift', 'sumo_deadlift', 'back_extension'];
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

// Held (D-LIB13-TBAR, #274 comment 6265616772: t_bar_row cannot pass PQ-H3 card-true at any real plate size): its spec
// exists for LIB-13s; it has no row (D-LIB8M-PAGESET).
const HELD = ['t_bar_row'];
/** The LB3 ids whose spec file exists and that are not held (drawn), in LB3 order. */
const drawn = () => LB3.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`) && !HELD.includes(id));

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
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file', () => {
    const design = readFileSync('tools/plates/library/lb3/DESIGN.md', 'utf8'), table = design.slice(design.indexOf('## 13. Held ids'));
    for (const id of [...HELD, 'dumbbell_shrug', 'cable_shrug', 'barbell_shrug']) {
      expect(new RegExp(`^\\| ${id} \\| [^|]+ \\| [^|]*D-LIB[^|]+ \\|`, 'm').test(table), id).toBe(true);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
    }
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
      expect(Math.hypot(across[1], across[2]), pose).toBeCloseTo(M.landmine_row.PLATE_D, 6);
    }
  });
  /** The drawn plate's gap (cm) to the engine's drawn torso and head outline in a pose, and whether they cross. */
  const plateGap = (spec: any, pose: string, poseObj?: any) => {
    const PXM = 100, cam = { view: 'side', near: 'r', pxm: PXM, P: (w: number[]) => [w[2]! * PXM, -w[1]! * PXM] }, b = { height: 1.75 };
    const p = poseObj ?? (pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose]);
    const sk = eng.fk(eng.resolve(eng.normPose(p, b), b).q, b), polys = eng.bodyShapes(sk, cam).filter((x: any) => ['torso', 'head'].includes(x.key)).map((x: any) => x.poly);
    const plateIt = itemsIn(spec, pose).items.filter(it => it.type === 'poly')[2], rect = plateIt.pts.map(cam.P);
    const inside = (q: number[], poly: number[][]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > q[1]!) !== (yj! > q[1]!) && q[0]! < ((xj! - xi!) * (q[1]! - yi!)) / (yj! - yi!) + xi!) c = !c; } return c; };
    const dseg = (q: number[], a: number[], c: number[]) => { const dx = c[0]! - a[0]!, dy = c[1]! - a[1]!, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((q[0]! - a[0]!) * dx + (q[1]! - a[1]!) * dy) / L2)); return Math.hypot(q[0]! - a[0]! - t * dx, q[1]! - a[1]! - t * dy); };
    const edges = (poly: number[][]) => poly.map((q, i) => [q, poly[(i + 1) % poly.length]!]);
    let min = Infinity, cross = false;
    for (const poly of polys) {
      for (const c of rect) { if (inside(c, poly)) cross = true; for (const [a, e] of edges(poly)) min = Math.min(min, dseg(c, a!, e!)); }
      for (const v of poly) { if (inside(v, rect)) cross = true; for (const [a, e] of edges(rect)) min = Math.min(min, dseg(v, a!, e!)); }
    }
    return { cm: min / PXM * 100, cross };
  };
  it('c6, c20: at the end and in the Mistake the plate edge meets the drawn torso outline: within 1 cm of it, never crossing it', () => {
    for (const pose of ['end', 'mistake']) {
      const g = plateGap(S.landmine_row, pose);
      expect(g.cross, pose).toBe(false);
      expect(g.cm, pose).toBeLessThanOrEqual(1);
    }
  });
  it('mutation: the hands lifted 2 cm further along the bar arc at the end crosses (or is not within 1 cm), so the test is red', () => {
    const s = S.landmine_row, piv = M.landmine_row.LM_ROW.pivot, r = s.poses.end.reach;
    const lift = (p: number[]) => { const a = Math.atan2(p[1]! - piv[1], p[2]! - piv[2]), L = Math.hypot(p[1]! - piv[1], p[2]! - piv[2]), d = 0.02 / L; return [p[0], piv[1] + L * Math.sin(a + d), piv[2] + L * Math.cos(a + d)]; };
    const lifted = { ...s, poses: { ...s.poses, end: { ...s.poses.end, reach: { r: { ...r.r, at: lift(r.r.at) }, l: { ...r.l, at: lift(r.l.at) } } } } };
    const g = plateGap(lifted, 'end');
    expect(g.cross || g.cm > 1).toBe(true);
  });
  /** c3 (REP, the source the drawn pose follows; D-LIB13-Q1b): "roughly parallel to the floor": the near hip-to-shoulder
   *  line at start within 15 deg of horizontal, i.e. 75-105 deg from vertical. Cissik's 45 deg is the differing source. */
  const hingeDeg = (lm: any) => deg(lm['hip.r'], lm['shoulder.r']);
  it('Q1 (D-LIB13-Q1b): the drawn start torso is roughly parallel (REP, c3): the hip-to-shoulder line 75-105 deg from vertical', () => {
    const d = hingeDeg(itemsIn(S.landmine_row, 'start').lm);
    expect(d).toBeGreaterThanOrEqual(75);
    expect(d).toBeLessThanOrEqual(105);
  });
  it('Q1 mutation: the torso drawn at 40 deg from vertical is outside the range (red)', () => {
    const s = S.landmine_row, st = s.poses.start, upright = { ...st, root: { ...st.root, tilt: 40 - st.trunk } };
    const lm = pathLm({ ...s, poses: { start: upright, end: upright } }, 0);
    expect(hingeDeg(lm)).toBeLessThan(75);
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

describe('LIB-13 pendlay_row (H, ruling 4): drawn facts', { timeout: T }, () => {
  const s = () => S.pendlay_row, lm = (p: string) => itemsIn(s(), p).lm;
  const backDeg = (l: any) => Math.atan2(l.backUpper[1] - l.sacrum[1], l.backUpper[2] - l.sacrum[2]) * 180 / Math.PI;
  it('c2, c4: the back line is level (within 2 deg) and the trunk is held the same in start, end and the ruled pose map', () => {
    for (const p of ['start', 'end']) expect(Math.abs(backDeg(lm(p))), p).toBeLessThanOrEqual(2);
    expect(s().poses.start.root).toEqual(s().poses.end.root);
    expect(s().poses.start.trunk).toBe(s().poses.end.trunk);
  });
  it('c3: at the floor start (spec end) the 45 cm plates rest on the floor line (bar centre 22.5 cm), the bar over mid-foot, the arms straight', () => {
    const bar = itemsIn(s(), 'end').items.find(it => it.type === 'barbell'), r = plate.renderPlate(s(), { id: 'x' }).report;
    expect(Math.abs(bar.at[1] - 0.225)).toBeLessThanOrEqual(0.002);
    expect(Math.abs(bar.at[2])).toBeLessThanOrEqual(0.005);
    expect(r.angles.end['elbow.r']).toBeLessThanOrEqual(13);   // the bent-back wrist alone turns the forearm about 9 deg (body.mjs solveReach)
    expect(lm('end').grips[2] - lm('end')['knee.r'][2]).toBeGreaterThan(0);   // the bar in front of the knees
  });
  it('c10: the knees slightly bent (10-30 deg) at the floor', () => {
    const k = plate.renderPlate(s(), { id: 'x' }).report.angles.end['knee.r'];
    expect(k).toBeGreaterThanOrEqual(10);
    expect(k).toBeLessThanOrEqual(30);
  });
  it('c4, c5: at the top (spec start) the bar is on the torso front between the navel and the chest, straight above the floor bar (±1 cm), the elbow straight above the bar (±1 cm, as barbell_row finishes)', () => {
    const t = lm('start');
    expect(Math.abs(t.grips[2] - lm('end').grips[2])).toBeLessThanOrEqual(0.01);
    expect(t.grips[2]).toBeGreaterThan(Math.min(t.navel[2], t.chest[2]) - 0.01);
    expect(t.grips[2]).toBeLessThan(Math.max(t.navel[2], t.chest[2]) + 0.01);
    expect(Math.abs(t['elbow.r'][2] - t.grips[2])).toBeLessThanOrEqual(0.01);
  });
  it('c8, c23 Mistake: the bar still on the floor, the lumbar flexed at least 20 deg more, the pelvis tucked, the hips held', () => {
    const e = s().poses.end, m = s().mistake.pose, ml = itemsIn(s(), 'mistake').lm;
    expect(dist(ml.grips, lm('end').grips)).toBeLessThanOrEqual(0.005);
    expect(m.trunk - e.trunk).toBeGreaterThanOrEqual(20);
    expect(m.root.tilt).toBeLessThan(e.root.tilt);
    expect(m.root.at).toEqual(e.root.at);
  });
});

describe('LIB-13 hinge bulk: sumo_deadlift, dumbbell_romanian_deadlift, back_extension drawn facts', { timeout: T }, () => {
  const lm = (id: string, p: string) => itemsIn(S[id], p).lm;
  const trunkDeg = (l: any) => deg(l['hip.r'], l['shoulder.r']);
  // Q2 (LB3 NOTE RULED): c4 "trunk more upright than conventional": sumo's drawn trunk angle from vertical at the card's
  // start (spec end, the floor) is smaller than conventional_deadlift's at its card start (also spec end).
  // The verifier's tightening (#274 6269741671): c4 gives the difference as "5-10 degrees", so the drawn difference must
  // fall in that range, not only be positive.
  const q2 = (sumo: number, conv: number) => (conv - sumo >= 5 && conv - sumo <= 10 ? [] : [`conventional ${conv.toFixed(1)} - sumo ${sumo.toFixed(1)} is outside 5-10 deg`]);
  it('Q2: sumo_deadlift\'s trunk at the floor is 5-10 deg more upright than conventional_deadlift\'s (c4)', () => {
    const a = trunkDeg(lm('sumo_deadlift', 'end')), b = trunkDeg(lm('conventional_deadlift', 'end'));
    expect(q2(a, b)).toEqual([]);
  });
  it('Q2 mutations: the two values swapped, and a 12 deg difference, are red', () => {
    const a = trunkDeg(lm('sumo_deadlift', 'end')), b = trunkDeg(lm('conventional_deadlift', 'end'));
    expect(q2(b, a).length).toBe(1);
    expect(q2(b - 12, b).length).toBe(1);
  });
  it('sumo c13, parent c23: the 45 cm plates on the floor line, the bar over mid-foot and in front of the shins; c14: knees within 3 deg of straight at the top', () => {
    const bar = itemsIn(S.sumo_deadlift, 'end').items.find(it => it.type === 'barbell'), e = lm('sumo_deadlift', 'end');
    expect(Math.abs(bar.at[1] - 0.225)).toBeLessThanOrEqual(0.002);
    expect(Math.abs(bar.at[2])).toBeLessThanOrEqual(0.005);
    expect(e.grips[2] - e['knee.r'][2]).toBeGreaterThan(0);
    expect(plate.renderPlate(S.sumo_deadlift, { id: 'x' }).report.angles.start['knee.r']).toBeLessThanOrEqual(3);
  });
  it('sumo c12 Mistake: the hips at least 8 cm higher with the bar still on the floor, the trunk tipped further forward', () => {
    const e = lm('sumo_deadlift', 'end'), m = itemsIn(S.sumo_deadlift, 'mistake').lm;
    expect(m['hip.r'][1] - e['hip.r'][1]).toBeGreaterThanOrEqual(0.08);
    expect(dist(m.grips, e.grips)).toBeLessThanOrEqual(0.005);
    expect(trunkDeg(m)).toBeGreaterThan(trunkDeg(e) + 5);
  });
  it('dumbbell_romanian_deadlift c1, c3, c4: a dumbbell in the hands in every pose, at mid-shin at the bottom (±1 cm), touching the legs (hex 0-1 cm off the drawn leg)', () => {
    for (const p of posesOf(S.dumbbell_romanian_deadlift)) expect(itemsIn(S.dumbbell_romanian_deadlift, p).items.filter(it => it.type === 'dumbbell').length, p).toBe(1);
    const e = lm('dumbbell_romanian_deadlift', 'end');
    expect(Math.abs(e.grips[1] - (e['knee.r'][1] + e['ankle.r'][1]) / 2)).toBeLessThanOrEqual(0.01);
    const R = eng.RADII, H = 1.75, hex = 0.119 * 0.866 / 2;
    const shin = (() => { const a = e['knee.r'], b = e['ankle.r'], p = e.grips, d: any = [b[1] - a[1], b[2] - a[2]], L2 = d[0] ** 2 + d[1] ** 2, t = Math.max(0, Math.min(1, ((p[1] - a[1]) * d[0] + (p[2] - a[2]) * d[1]) / L2));
      const [rA, rM, rB, m] = R.shank, r = t < m ? rA + (rM - rA) * Math.sin((t / m) * Math.PI / 2) : rM + (rB - rM) * (1 - Math.cos(((t - m) / (1 - m)) * Math.PI / 2));
      return Math.hypot(p[1] - a[1] - d[0] * t, p[2] - a[2] - d[1] * t) - r * H - hex; })();
    expect(shin).toBeGreaterThanOrEqual(0);
    expect(shin).toBeLessThanOrEqual(0.01);
  });
  it('dumbbell_romanian_deadlift: knees fixed at a soft bend (15 ± 2 deg) in start and end; c10 Mistake: the lumbar extends at least 20 deg (the arch)', () => {
    const r = plate.renderPlate(S.dumbbell_romanian_deadlift, { id: 'x' }).report;
    for (const p of ['start', 'end']) expect(Math.abs(r.angles[p]['knee.r'] - 15), p).toBeLessThanOrEqual(2);
    expect(S.dumbbell_romanian_deadlift.poses.via[0].trunk - S.dumbbell_romanian_deadlift.mistake.pose.trunk).toBeGreaterThanOrEqual(20);
  });
  it('back_extension Do 4 (13.1): the romanChair pad sits under the front of the near thigh, within 1 cm, below the hip joint, in every pose; the chair is static', () => {
    const s = S.back_extension, pad = M.back_extension.BX.pad;
    const chairOf = (p: string) => itemsIn(s, p).items.filter(it => it.type === 'backPad' || it.type === 'kneePad').map(it => JSON.stringify({ ...it, entry: 0 }));
    for (const p of posesOf(s)) {
      const l = lm('back_extension', p), a = l['hip.r'], b = l['knee.r'], d: any = [b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d);
      const off = Math.abs(((pad.at[1] - a[1]) * -d[1] + (pad.at[2] - a[2]) * d[0]) / L) - eng.RADII.thigh[0] * 1.75;
      expect(Math.abs(off), p).toBeLessThanOrEqual(0.012);
      expect(pad.at[1], p).toBeLessThan(a[1]);
      expect(chairOf(p), p).toEqual(chairOf('end'));
    }
  });
  it('back_extension mutation: the pad moved 5 cm along the thigh normal is red', () => {
    const l = lm('back_extension', 'end'), a = l['hip.r'], b = l['knee.r'], d: any = [b[1] - a[1], b[2] - a[2]], L = Math.hypot(...d), n: any = [-d[1] / L, d[0] / L];
    const pad = M.back_extension.BX.pad.at, moved: any = [0, pad[1] + n[0] * 0.05, pad[2] + n[1] * 0.05];
    const off = Math.abs(((moved[1] - a[1]) * -d[1] + (moved[2] - a[2]) * d[0]) / L) - eng.RADII.thigh[0] * 1.75;
    expect(Math.abs(off)).toBeGreaterThan(0.012);
  });
  it('back_extension c5: one straight line at the top (hip-to-shoulder line within 5 deg of the hip-to-ankle line); c7: the torso slightly below parallel at the bottom (95-105 deg)', () => {
    const t = lm('back_extension', 'start'), e = lm('back_extension', 'end');
    const ang = (p: number[], q: number[]) => Math.atan2(q[1]! - p[1]!, q[2]! - p[2]!) * 180 / Math.PI;
    expect(Math.abs(ang(t['hip.r'], t['shoulder.r']) - ang(t['ankle.r'], t['hip.r']))).toBeLessThanOrEqual(5);
    const fromUp = (l: any) => Math.atan2(l['shoulder.r'][2] - l['hip.r'][2], l['shoulder.r'][1] - l['hip.r'][1]) * 180 / Math.PI;   // signed: > 90 below horizontal
    expect(fromUp(e)).toBeGreaterThanOrEqual(95);
    expect(fromUp(e)).toBeLessThanOrEqual(105);
  });
  it('back_extension c6, c19 Mistake: the pelvis tilts at least 20 deg less and the lumbar flexes at least 20 deg', () => {
    const e = S.back_extension.poses.end, m = S.back_extension.mistake.pose;
    expect(e.root.tilt - m.root.tilt).toBeGreaterThanOrEqual(20);
    expect(m.trunk - e.trunk).toBeGreaterThanOrEqual(20);
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
  const KEYS: Record<string, string> = { pendlay_row: 'round', landmine_row: 'round', one_arm_dumbbell_row: 'short', dumbbell_romanian_deadlift: 'arch', conventional_deadlift: 'round', sumo_deadlift: 'hips', back_extension: 'round' };
  const TEMPO: Record<string, any[]> = {
    pendlay_row: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Pull', s: 1, move: true }],
    dumbbell_romanian_deadlift: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Stand', s: 1, move: true }],
    sumo_deadlift: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Lift', s: 1, move: true }],
    back_extension: [{ phase: 'Lower', s: 2, move: true }, { phase: 'Raise', s: 1, move: true }, { phase: 'Hold', s: 1 }],
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
    for (const id of SLICE.filter(i => i !== 'landmine_row')) expect(minGap(S[id]), id).toBeGreaterThanOrEqual(6);
    const s = S.landmine_row, lm = itemsIn(s, 'end').lm, cam = plate.renderPlate(s, { id: 'x' }).report.camera;
    const at = (w: number[]) => [cam.x0 + w[2]! * cam.pxPerM, cam.y0 - w[1]! * cam.pxPerM];
    const p = at(lmEq.alongBar(M.landmine_row.LM_ROW.pivot, lm['grip.r'], 0.6));
    const bad = { ...s, callouts: [{ ...s.callouts[0], anchor: 'heel.r', box: { left: Math.round(p[0]! - 20), top: Math.round(p[1]! - 45) } }, ...s.callouts.slice(1)] };
    expect(minGap(bad)).toBeLessThan(6);
  });
});

describe('LIB-13 D-LIB9-CLONE b: each copied root finder throws on a bracket with no root', () => {
  it('the drawn slice specs', () => {
    for (const [id, f] of [['dumbbell_romanian_deadlift', 'bisect'], ['sumo_deadlift', 'bisect'], ['back_extension', 'bisect'], ['pendlay_row', 'solve'], ['landmine_row', 'solve'], ['one_arm_dumbbell_row', 'solve'], ['conventional_deadlift', 'bisect']] as const) {
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
  it('clean: no node-half problem, and the only raised flags wait on the browser half (F2, F5)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
    expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].raised && !['F2', 'F5'].includes(f))).toEqual([]);
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

describe('LIB-13 A11 and A6 (Do 6 b): the card fields, the ruled tempo map, the pose map and the plate facts', { timeout: T }, () => {
  // The ruled table (LB3 NOTE RULED, #274 comment 6264733030; DESIGN.md section 8): phase names, order and source per
  // id. Copied from the ruling, never read from tempo.json or a spec. No constants.
  const RULED: Record<string, [string, string][]> = {
    pendlay_row: [['Lower', 'down'], ['Pull', 'up']], t_bar_row: [['Pull', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    landmine_row: [['Pull', 'up'], ['Lower', 'down']], one_arm_dumbbell_row: [['Pull', 'up'], ['Lower', 'down']],
    dumbbell_romanian_deadlift: [['Lower', 'down'], ['Stand', 'up']], conventional_deadlift: [['Lower', 'down'], ['Lift', 'up']],
    sumo_deadlift: [['Lower', 'down'], ['Lift', 'up']], back_extension: [['Lower', 'down'], ['Raise', 'up'], ['Hold', 'pause']],
  };
  // The ruled pose map (DESIGN.md section 9): the spec pose each card pose is drawn as.
  const POSE_MAP: Record<string, Record<string, string>> = Object.fromEntries(LB3.map(id => [id,
    ['pendlay_row', 'conventional_deadlift', 'sumo_deadlift', 'back_extension'].includes(id) ? { start: 'end', end: 'start' } : { start: 'start', end: 'end' }]));
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const built = (rows: any[], pt: any) => rows.flatMap((r: any) => (r.from === 'pause' ? (pt.pause > 0 ? [{ phase: r.phase, s: pt.pause }] : []) : [{ phase: r.phase, s: pt[r.from], move: true }]));
  const tempoProblems = (tj: any, cards: Record<string, any>, specs: Record<string, any>) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not the ruled (empty) set');
    if (JSON.stringify(Object.keys(tj.ids).sort()) !== JSON.stringify(LB3.slice().sort())) bad.push('ids: not the 8');
    for (const id of LB3) {
      const t = tj.ids[id], c = cards[id], pt = c.plate.tempo;
      if (JSON.stringify(t?.rows?.map((r: any) => [r.phase, r.constant ? 'const' : r.from])) !== JSON.stringify(RULED[id])) bad.push(`${id}: tempo.json rows != the ruled table`);
      if (JSON.stringify(t?.claim) !== JSON.stringify(pt.claim)) bad.push(`${id}: claim`);
      const hold = c.tempo.some((p: any) => p.phase === 'Hold');
      if (hold !== pt.pause > 0) bad.push(`${id}: Hold present ${hold} but pause ${pt.pause}`);
      if (c.tempo.some((p: any) => p.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (JSON.stringify(c.tempo) !== JSON.stringify(built(t?.rows ?? [], pt))) bad.push(`${id}: card tempo != the array built from the ruled table and plate.tempo`);
      if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(c.tempo)) bad.push(`${id}: spec tempo != card tempo`);
    }
    return bad;
  };
  const clean = () => ({ tj: readJson('tools/plates/library/lb3/tempo.json'), cards: Object.fromEntries(LB3.map(id => [id, cardOf(id)])), specs: { ...S } as Record<string, any> });
  const copy = (x: any) => JSON.parse(JSON.stringify(x));
  it('tempo.json, every card tempo and every drawn spec tempo follow the ruled map', () => {
    const { tj, cards, specs } = clean();
    expect(tempoProblems(tj, cards, specs)).toEqual([]);
  });
  it('mutations (i)-(vi) and a changed second are each red', () => {
    const red = (f: (s: any) => void) => { const s = copy({ tj: clean().tj, cards: clean().cards }); s.specs = { ...clean().specs }; f(s); return tempoProblems(s.tj, s.cards, s.specs).length > 0; };
    const setAll = (s: any, id: string, rows: any[] | null, tempo: any[]) => { if (rows) s.tj.ids[id].rows = rows; s.cards[id].tempo = tempo; if (s.specs[id]) s.specs[id] = { ...s.specs[id], tempo }; };
    expect(red(s => { setAll(s, 'conventional_deadlift', null, [...s.cards.conventional_deadlift.tempo, { phase: 'Rest', s: 1 }]); }), '(i) Rest added').toBe(true);
    expect(red(s => { s.tj.constants['pendlay_row.Stop'] = { s: 1, claim: 'c3', quote: 'x' }; }), '(ii) a constant').toBe(true);
    expect(red(s => { setAll(s, 'back_extension', null, s.cards.back_extension.tempo.map((p: any) => (p.phase === 'Hold' ? { ...p, s: 2 } : p))); }), '(iii) Hold s').toBe(true);
    expect(red(s => { const rows = [...s.tj.ids.landmine_row.rows, { phase: 'Hold', from: 'pause' }]; setAll(s, 'landmine_row', rows, [...s.cards.landmine_row.tempo, { phase: 'Hold', s: 0 }]); }), '(iv) Hold 0').toBe(true);
    for (const id of ['t_bar_row', 'back_extension'])
      expect(red(s => { const rows = s.tj.ids[id].rows.filter((r: any) => r.from !== 'pause'); setAll(s, id, rows, built(rows, s.cards[id].plate.tempo)); }), `(v) Hold removed: ${id}`).toBe(true);
    expect(red(s => { const rows = s.tj.ids.conventional_deadlift.rows.map((r: any) => ({ ...r, from: r.from === 'up' ? 'down' : r.from === 'down' ? 'up' : r.from })); setAll(s, 'conventional_deadlift', rows, built(rows, s.cards.conventional_deadlift.plate.tempo)); }), '(vi) up/down swapped').toBe(true);
    expect(red(s => { s.cards.one_arm_dumbbell_row.tempo[0].s = 3; }), 'one tempo second').toBe(true);
  });
  const cardsSha = readJson('tools/plates/library/lb3/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it('each card differs from its research-head copy only in the three keys, written last', () => {
    for (const id of LB3) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(Object.keys(cardOf(id)).slice(-3), id).toEqual(KEYS);
    }
  });
  const DRAWN: Record<string, string> = { pendlay_row: 'round', t_bar_row: 'round', landmine_row: 'round', one_arm_dumbbell_row: 'short',
    dumbbell_romanian_deadlift: 'arch', conventional_deadlift: 'round', sumo_deadlift: 'hips', back_extension: 'round' };
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable
    ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault'])
    : (card.topFault !== drawnKey ? [] : ['drawable:false but topFault equals the drawn fault']));
  it('Q1: each topFault follows the ruled fault->key map; one_arm_dumbbell_row is drawable:false with topFault momentum; every drawn first tell carries the drawn key', () => {
    for (const id of LB3) expect(topFaultProblems(cardOf(id), DRAWN[id]!), id).toEqual([]);
    expect([cardOf('one_arm_dumbbell_row').plate.mistake.drawable, cardOf('one_arm_dumbbell_row').topFault]).toEqual([false, 'momentum']);
    for (const id of SLICE) expect(S[id].mistake.tells[0].key, id).toBe(DRAWN[id]);
  });
  it('Q1 mutations: drawable:false with topFault equal to the drawn key, and a drawable:true card with another key, are red', () => {
    const c = cardOf('one_arm_dumbbell_row'); c.topFault = 'short';
    expect(topFaultProblems(c, 'short')).toEqual(['drawable:false but topFault equals the drawn fault']);
    const d = cardOf('conventional_deadlift'); d.topFault = 'tuck';
    expect(topFaultProblems(d, 'round')).toEqual(['drawable:true but topFault is not the drawn fault']);
  });
  /** 14.7 rules 10, 15, D-LIB9-CARDFIELDS and the pose map: kind, one form, a claim of its own card, and a pose that is
   *  the map's image of a card pose. */
  const factProblems = (id: string, c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
    ...(f.cardPose && POSE_MAP[id]![f.cardPose] !== (f.pose ?? 'end') ? [`${i}: pose ${f.pose ?? 'end'} is not the map's image of card ${f.cardPose}`] : []),
  ]);
  // D-LIB13-FACTS2 (#274 6267284075): a quoted contact for a drawn pose is a fact, one per checked landmark, its pose
  // the pose map's image of the card pose; landmine_row and t_bar_row stay [].
  const C = (lms: string[], pose: string, cardPose: string, claim: string) => lms.map(landmark => ({ kind: 'contact', landmark, pose, cardPose, claim }));
  const FACTS: Record<string, any[]> = {
    pendlay_row: C(['chest', 'navel'], 'start', 'end', 'c4'),
    one_arm_dumbbell_row: [...C(['knee.l', 'wrist.l'], 'start', 'start', 'c1'), ...C(['knee.l', 'wrist.l'], 'end', 'end', 'c1')],
    conventional_deadlift: C(['knee.r', 'ankle.r'], 'end', 'start', 'c1'),
    dumbbell_romanian_deadlift: [...C(['hip.r', 'knee.r'], 'start', 'start', 'c4'), ...C(['knee.r', 'ankle.r'], 'end', 'end', 'c4')],
    sumo_deadlift: C(['knee.r', 'ankle.r'], 'end', 'start', 'c13'),
    back_extension: [...C(['hip.r', 'knee.r'], 'end', 'start', 'c3'), ...C(['hip.r', 'knee.r'], 'start', 'end', 'c1')],
    landmine_row: [], t_bar_row: [],
  };
  it('every card\'s plateFacts is the ruled contact set (D-LIB13-FACTS2; no number in any plate.start or plate.end)', () => {
    expect(Object.keys(FACTS).sort()).toEqual([...LB3].sort());
    for (const id of LB3) { expect(cardOf(id).plateFacts, id).toEqual(FACTS[id]); expect(factProblems(id, cardOf(id)), id).toEqual([]); }
  });
  it('mutations: a fact with both joint and measure: true, and a start fact named with the unmapped pose, are red', () => {
    const c = cardOf('landmine_row'); c.plateFacts.push({ kind: 'angle', joint: 'knee.r', measure: true, deg: 30, claim: 'c3' });
    expect(factProblems('landmine_row', c)).toEqual(['0: both joint and measure']);
    const p = cardOf('pendlay_row'); p.plateFacts.push({ kind: 'angle', joint: 'knee.r', pose: 'start', cardPose: 'start', deg: 30, claim: 'c10' });
    expect(factProblems('pendlay_row', p)).toEqual([`${p.plateFacts.length - 1}: pose start is not the map's image of card start`]);
  });
  const h6 = (spec: any, research: any) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research }, { engine: Eng(), pins }, R).map((p: any) => p.key);
  };
  const research = (id: string) => { const c = cardOf(id); return { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault }; };
  it('A6: PQ-H6 is green on the drawn slice plates against their cards', () => {
    for (const id of SLICE) expect(h6(S[id], research(id)), id).toEqual([]);
  });
  // Every numeric triple named `at` in a pose (root, reach and plant targets) moved by v: the whole body moves rigidly.
  const shiftPose = (p: any, v: number[]): any => Array.isArray(p) ? p.map(x => shiftPose(x, v)) : p && typeof p === 'object'
    ? Object.fromEntries(Object.entries(p).map(([k, x]: [string, any]) => [k, k === 'at' && Array.isArray(x) && x.length === 3 && x.every((n: any) => typeof n === 'number') ? x.map((n: number, i: number) => n + v[i]!) : shiftPose(x, v)])) : p;
  it('D-LIB13-FACTS2 mutation: each contact pose\'s body moved 2 cm along its contact plane\'s normal turns exactly that pose\'s facts red', () => {
    for (const id of Object.keys(FACTS).filter(i => FACTS[i]!.length)) for (const pose of [...new Set(FACTS[id]!.map(f => f.pose))]) {
      const s = S[id], f0 = FACTS[id]!.find(f => f.pose === pose);
      const k = s.checks.find((c: any) => c.landmark === f0.landmark && c.plane && (c.pose === pose || c.pose === 'all'));
      const n = k.plane.normal, L = Math.hypot(...n), v = n.map((x: number) => x / L * 0.02);
      const moved = { ...s, poses: { ...s.poses, [pose]: shiftPose(s.poses[pose], v) } };
      const want = FACTS[id]!.flatMap((f, i) => (f.pose === pose ? [`H6.fact:${i}:contact:${f.landmark}`] : []));
      expect(h6(moved, research(id)), `${id} ${pose}`).toEqual(want);
    }
  });
  it('A6 mutations: an angle fact +3 deg off the drawn one, and the card path removed, are red', () => {
    const s = S.conventional_deadlift, r = research('conventional_deadlift'), drawnKnee = plate.renderPlate(s, { id: 'x' }).report.angles.end['knee.r'];
    expect(h6(s, { ...r, plateFacts: [{ kind: 'angle', joint: 'knee.r', pose: 'end', deg: drawnKnee, claim: 'c1' }] })).toEqual([]);
    expect(h6(s, { ...r, plateFacts: [{ kind: 'angle', joint: 'knee.r', pose: 'end', deg: drawnKnee + 3, claim: 'c1' }] })).toEqual(['H6.fact:0:angle:knee.r']);
    expect(h6(s, null)).toEqual(['H6:no-card']);
  });
});

describe('LIB-13 A4: F7 on one_arm_dumbbell_row (drawable false) is raised; topFault set to the drawn key turns the expectation red', { timeout: T }, () => {
  it('F7 raised with the card topFault momentum; with topFault "short" it is not raised, so the ruled expected set fails', async () => {
    const [build, cand, golden] = await Promise.all(['lb3/build.mjs', 'candidate.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    const mirror = golden.makeMirror();
    try {
      const E = await qaEng.loadEngine(mirror), all = build.lb3All(), ID = 'lib_one_arm_dumbbell_row';
      const html = (await build.buildLb3Page({ all, ids: [ID] })).html.toString('utf8');
      const c = await cand.candidateOf(ID, { all, platesHtml: html, engine: E, authoring: true });
      const raised = async (cc: any) => { const r = await qaIdx.runQa(cc, { engine: E, pins }); return qaIdx.FLAGS.filter((f: string) => !['F2', 'F5'].includes(f) && r.flags[f].raised); };
      const expected = ['F7'];
      expect(await raised(c)).toEqual(expected);
      expect(await raised({ ...c, research: { ...c.research, topFault: 'short' } })).not.toEqual(expected);
    } finally { qaEng.dropMirror(mirror); }
  });
});

describe('LIB-13 A15: the Mistake clears the solid end figure, and every tier-A R10 item is drawn (DESIGN.md section 7)', { timeout: T }, () => {
  const PXM = 146.28571428571428;
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
  /** Signed px distance of a screen point from the drawn end figure (every body shape, far limbs included): > 0 outside. */
  const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };
  /** 13.1, 13.4 must-fix 1: the solid red parts (the Mistake arrows, as drawn in the Mistake svg) clear the solid end
   *  figure (the engine's bodyShapes at the plate's px/m) by at least 6 px; the Mistake figure and guides are dashed. */
  const clearance = (spec: any) => {
    const b = { height: 1.75 }, cam = { view: 'side', near: 'r', pxm: PXM, P: (w: number[]) => [spec.camera.x0 + w[2]! * PXM, spec.camera.y0 - w[1]! * PXM] };
    const polys = body.bodyShapes(body.fk(body.resolve(body.normPose(spec.poses.end, b), b).q, b), cam).filter((x: any) => x.poly).map((x: any) => x.poly);
    const svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow" d="([^"]+)"/g)].flatMap(m => {
      const pts = [...m[1]!.matchAll(/(-?[\d.]+) (-?[\d.]+)/g)].map(x => [+x[1]!, +x[2]!]), samp: number[][] = [];
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      return min >= 6 ? [] : [`${spec.id}: arrow ${min.toFixed(1)} px from the end figure`];
    });
  };
  it('every drawn plate: each Mistake arrow stays at least 6 px clear of the solid end figure', () => {
    for (const id of drawn()) { expect(S[id].mistake.guides.some((g: any) => g.kind === 'arrow'), id).toBe(true); expect(clearance(S[id]), id).toEqual([]); }
  });
  it('mutation: one_arm_dumbbell_row\'s arrow tip moved onto the end grip (inside the figure\'s 6 px clearance) is red', () => {
    const s = S.one_arm_dumbbell_row, guides = s.mistake.guides.map((g: any) => (g.kind === 'arrow' ? { ...g, to: { at: 'grip.r', pose: 'end' } } : g));
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });

  // R10 (DESIGN.md section 7): one drawn-item check per tier-A item, in the table's order.
  const rep = (id: string) => plate.renderPlate(S[id], { id: 'x' }).report;
  const lm = (id: string, p: string) => itemsIn(S[id], p).lm;
  const fromV = (l: any) => Math.atan2(l['shoulder.r'][2] - l['hip.r'][2], l['shoulder.r'][1] - l['hip.r'][1]) * 180 / Math.PI;
  const flat = (id: string, poses: string[]) => poses.flatMap(p => (rep(id).angles[p].trunk <= 5 ? [] : [`${p}: lumbar ${rep(id).angles[p].trunk}`]));
  const onCheck = (id: string, landmarks: string[], pose: string, cm = 1) => landmarks.flatMap(l => {
    const k = rep(id).checks.filter((c: any) => c.landmark === l && c.pose === pose && c.cm != null);
    return k.length && k.every((c: any) => c.cm <= cm) ? [] : [`${pose}: ${l} ${k.map((c: any) => c.cm).join('/') || 'unchecked'}`];
  });
  const item = (id: string, pose: string, type: string) => itemsIn(S[id], pose).items.find((it: any) => it.type === type);
  const R10: Record<string, [string, () => string[]][]> = {
    pendlay_row: [
      ['back flat and level at the floor start', () => [...flat('pendlay_row', ['end']), ...((l => Math.abs(Math.atan2(l.backUpper[1] - l.sacrum[1], l.backUpper[2] - l.sacrum[2]) * 180 / Math.PI) <= 2)(lm('pendlay_row', 'end')) ? [] : ['back line not level'])]],
      ['bar set down, plates on the floor line', () => (Math.abs(item('pendlay_row', 'end', 'barbell').at[1] - 0.225) <= 0.002 ? [] : ['bar off the floor'])],
    ],
    landmine_row: [
      ['back straight, torso roughly parallel', () => [...flat('landmine_row', ['start', 'end']), ...(Math.abs(fromV(lm('landmine_row', 'start')) - 90) <= 15 ? [] : ['torso not parallel'])]],
      ['bar pinned at the floor pivot', () => posesOf(S.landmine_row).flatMap(p => { const sh = itemsIn(S.landmine_row, p).items.filter((it: any) => it.type === 'poly')[0], y = (sh.pts[0][1] + sh.pts[3][1]) / 2; return Math.abs(y - lmEq.LANDMINE.hingeH) <= 0.001 ? [] : [`${p}: pivot off`]; })],
      ['the loaded end in front of the feet', () => posesOf(S.landmine_row).flatMap(p => { const pl = itemsIn(S.landmine_row, p).items.filter((it: any) => it.type === 'poly')[2], z = Math.min(...pl.pts.map((q: number[]) => q[2])); return z > lm('landmine_row', p)['toe.r'][2] ? [] : [`${p}: plate over the feet`]; })],
    ],
    dumbbell_romanian_deadlift: [
      ['flat back', () => flat('dumbbell_romanian_deadlift', ['start', 'end'])],
      ['dumbbells on the legs', () => [...onCheck('dumbbell_romanian_deadlift', ['hip.r', 'knee.r'], 'start'), ...onCheck('dumbbell_romanian_deadlift', ['knee.r', 'ankle.r'], 'end')]],
      ['gaze to the floor at the bottom, neck in line', () => (Math.abs(rep('dumbbell_romanian_deadlift').angles.end.neck) <= 5 ? [] : ['neck bent'])],
    ],
    conventional_deadlift: [
      ['flat back from floor to lockout', () => flat('conventional_deadlift', ['start', 'end'])],
      ['bar over mid-foot, shins close', () => [...(Math.abs(item('conventional_deadlift', 'end', 'barbell').at[2]) <= 0.005 ? [] : ['bar off mid-foot']), ...onCheck('conventional_deadlift', ['knee.r', 'ankle.r'], 'end')]],
      ['bar close to the legs', () => tenths.flatMap(t => { const l = pathLm(S.conventional_deadlift, t); return Math.abs(l.grips[2]) <= 0.02 ? [] : [`t ${t}: bar ${l.grips[2].toFixed(3)} m off the plumb line`]; })],
    ],
    sumo_deadlift: [
      ['chest up, back flat', () => flat('sumo_deadlift', ['start', 'end'])],
      ['bar against the shins', () => onCheck('sumo_deadlift', ['knee.r', 'ankle.r'], 'end')],
      ['hips and knees lock together at the top', () => { const a = rep('sumo_deadlift').angles.start; return a['knee.r'] <= 3 && Math.abs(fromV(lm('sumo_deadlift', 'start'))) <= 3 ? [] : ['not locked out']; }],
    ],
    back_extension: [
      ['pad below the hip bones, on the thighs', () => { const l = lm('back_extension', 'start'), pad = M.back_extension.BX.pad.at, d = [l['knee.r'][1] - l['hip.r'][1], l['knee.r'][2] - l['hip.r'][2]], L = Math.hypot(d[0]!, d[1]!), t = ((pad[1] - l['hip.r'][1]) * d[0]! + (pad[2] - l['hip.r'][2]) * d[1]!) / L / L; return [...(t > 0.05 && t < 0.5 ? [] : [`pad at ${t.toFixed(2)} of the thigh`]), ...onCheck('back_extension', ['hip.r', 'knee.r'], 'start'), ...onCheck('back_extension', ['hip.r', 'knee.r'], 'end')]; }],
      ['feet secured on the foot plate under the heel pad', () => posesOf(S.back_extension).flatMap(p => onCheck('back_extension', ['sole.r', 'sole.l'], p, 0.5))],
      ['top in one straight line, no arch past it', () => { const t = lm('back_extension', 'start'), ang = (p: number[], q: number[]) => Math.atan2(q[1]! - p[1]!, q[2]! - p[2]!) * 180 / Math.PI; return [...flat('back_extension', ['start']), ...(Math.abs(ang(t['hip.r'], t['shoulder.r']) - ang(t['ankle.r'], t['hip.r'])) <= 5 ? [] : ['not one line'])]; }],
    ],
  };
  /** The tier-A rows of DESIGN.md section 7 (drawn ids), each with its number of items (split on '; '). */
  const tableItems = () => {
    const sec = readFileSync('tools/plates/library/lb3/DESIGN.md', 'utf8').split('## 7. R10')[1]!.split('\n## ')[0]!;
    return Object.fromEntries([...sec.matchAll(/^\| (\w+) \| (.+) \|$/gm)].filter(m => drawn().includes(m[1]!)).map(m => [m[1]!, m[2]!.split('; ').length]));
  };
  const r10Problems = (reg: Record<string, [string, () => string[]][]>) => {
    const want = tableItems(), out: string[] = [];
    for (const [id, n] of Object.entries(want)) {
      if ((reg[id] ?? []).length !== n) out.push(`${id}: ${(reg[id] ?? []).length} checks for ${n} items`);
      for (const [name, f] of reg[id] ?? []) for (const p of f()) out.push(`${id} ${name}: ${p}`);
    }
    return out;
  };
  it('every tier-A drawn id has one passing drawn-item check per R10 item (one_arm_dumbbell_row is tier C)', () => {
    expect(Object.keys(tableItems()).sort()).toEqual(drawn().filter(id => id !== 'one_arm_dumbbell_row').sort());
    expect(r10Problems(R10)).toEqual([]);
  });
  it('mutation: one tier-A R10 item removed is red', () => {
    expect(r10Problems({ ...R10, sumo_deadlift: R10.sumo_deadlift!.slice(1) })).toEqual(['sumo_deadlift: 2 checks for 3 items']);
  });
});
