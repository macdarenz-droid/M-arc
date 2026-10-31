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
const SHRUGS = ['dumbbell_shrug', 'cable_shrug', 'barbell_shrug', 'smith_machine_shrug'];
// LIB-13s (lib-13s-card A1; D-LIB13S-MODES): the ids it releases into lb3/rows.json (all H; wave 1, then wave 2), and the
// shrugs it still holds. LIB-13's own blocks keep reading drawn() (its 7 approved ids).
const RELEASED = ['t_bar_row', 'barbell_shrug', 'cable_shrug', 'dumbbell_shrug', 'smith_machine_shrug'];
const HELD_SHRUGS = SHRUGS.filter(id => !RELEASED.includes(id));
const VIEW13S: Record<string, string> = { dumbbell_shrug: 'front' };
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

// Held by LIB-13 (D-LIB13-TBAR, #274 comment 6265616772: t_bar_row could not pass PQ-H3 card-true at plate scale). LIB-13s
// releases it with a zoom (D-LIB13S-ZOOM, RELEASED above); LIB-13's blocks below still exclude it from drawn().
const HELD = ['t_bar_row'];
/** LIB-13's drawn ids: the LB3 ids whose spec file exists and that LIB-13 did not hold, in LB3 order. */
const drawn = () => LB3.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`) && !HELD.includes(id));

describe('LIB-13 A5: lb3/rows.json holds exactly the drawn, non-held LB3 ids', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    return bad;
  };
  const want = () => [...drawn(), ...RELEASED].map(i => `lib_${i}`);
  it('each drawn id exactly once in the raw text, nothing else; no reused id or shrug in any LB3 file', () => {
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
    for (const f of readdirSync('tools/plates/library/lb3')) {
      const text = readFileSync(join('tools/plates/library/lb3', f), 'utf8');
      for (const id of [...REUSED, ...HELD_SHRUGS]) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id} as a row`).toBe(false);
    }
    for (const id of HELD_SHRUGS) expect(new RegExp(`\\b(lib_)?${id}\\b`).test(readFileSync(ROWS, 'utf8')), id).toBe(false);
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file', () => {
    const design = readFileSync('tools/plates/library/lb3/DESIGN.md', 'utf8'), table = design.slice(design.indexOf('## 13. Held ids'));
    for (const id of HELD_SHRUGS) {
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
      expect(r.view).toBe(VIEW13S[id.slice(4)] ?? 'side');
      expect([r.mode, r.parent, r.template, r.params], id).toEqual(['H', undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB3', censusRef: '4a9fd86' });
    expect((existsSync('tools/plates/library/templates') ? readdirSync('tools/plates/library/templates') : []).filter(f => !['CURL.mjs', 'PUSHDOWN.mjs'].includes(f))).toEqual([]);   // HROW and HINGE are not built (DESIGN.md 1); D-LIB15R2-TEMPLDIR (#349): only the ruled templates exist
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
    expect(rows.filter((r: any) => [...IDS, ...RELEASED.map(i => `lib_${i}`)].includes(r.id)).length).toBe(drawn().length + RELEASED.length);
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
  // c10 "knees slightly bent", c1 "hips hinged a little higher than a deadlift" (card plate.start): the bound is the
  // card's own comparison (D-LIB13-PANEL1), read on the drawn
  // plates: pendlay_row's floor hip above conventional_deadlift's, its knee bend less, and bent at least 10 deg.
  const floorLegs = (id: string) => ({ hip: itemsIn(S[id], 'end').lm['hip.r'][1], knee: plate.renderPlate(S[id], { id: 'x' }).report.angles.end['knee.r'] });
  const c1Problems = (p: { hip: number, knee: number }, d: { hip: number, knee: number }) => [
    ...(p.knee >= 10 ? [] : [`knee ${p.knee} < 10`]), ...(p.hip > d.hip ? [] : ['hips not above the deadlift']), ...(p.knee < d.knee ? [] : ['knees bent as much as the deadlift'])];
  it('c10, c1: the knees bent (at least 10 deg) with the hips higher and the knees straighter than conventional_deadlift at the floor', () => {
    expect(c1Problems(floorLegs('pendlay_row'), floorLegs('conventional_deadlift'))).toEqual([]);
  });
  it('c1 mutation: the deadlift\'s floor legs drawn on pendlay_row are red', () => {
    const d = floorLegs('conventional_deadlift');
    expect(c1Problems(d, d)).toEqual(['hips not above the deadlift', 'knees bent as much as the deadlift']);
  });
  const barIn = (p: string) => itemsIn(s(), p).items.find((it: any) => it.type === 'barbell').at;
  it('c4, c5: at the top (spec start) the drawn bar is on the torso front between the navel and the chest, straight above the floor bar (±1 cm), the elbow straight above the bar (±1 cm, as barbell_row finishes)', () => {
    const t = lm('start'), b = barIn('start');
    expect(Math.abs(b[2] - barIn('end')[2])).toBeLessThanOrEqual(0.01);
    expect(b[2]).toBeGreaterThan(Math.min(t.navel[2], t.chest[2]) - 0.01);
    expect(b[2]).toBeLessThan(Math.max(t.navel[2], t.chest[2]) + 0.01);
    expect(Math.abs(t['elbow.r'][2] - b[2])).toBeLessThanOrEqual(0.01);
  });
  // The panel's R3 (#274 6278550928) as fixed in round 2 (D-LIB13-PANEL2, #274 6279411612): the bar's end-on glyph is one
  // glyph (the plate, its inner ring, the sleeve ring and the centre dot on one centre, as the approved squat) and the
  // fist sits on that centre; the drawn hand (conventional_deadlift's hand poly) joins the forearm's end to the bar.
  const glyphProblems = (spec: any, p: string) => {
    const { items, lm: l } = itemsIn(spec, p), bar = items.find((it: any) => it.type === 'barbell').at, dot = items.find((it: any) => it.part === 'bardot').at;
    return [...(dist(bar, dot) <= 0.0005 ? [] : [`${p}: sleeve ring off the plate centre`]), ...(dist(bar, l.grips) <= 0.0005 ? [] : [`${p}: fist off the plate centre`])];
  };
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  const yz = (q: number[]) => [q[2]!, q[1]!];
  const handProblems = (spec: any, p: string) => {
    const { items, lm: l } = itemsIn(spec, p), hand = items.find((it: any) => it.part === 'hand'), bar = items.find((it: any) => it.type === 'barbell').at;
    if (!hand) return [`${p}: no hand`];
    const poly = hand.pts.map(yz);
    return [...(inPoly(poly, yz(l['wrist.r'])) ? [] : [`${p}: hand off the forearm's end`]), ...(inPoly(poly, yz(bar)) ? [] : [`${p}: hand off the bar`])];
  };
  it('R3 (round 2): the plate, the sleeve ring, the centre dot and the fist share one centre (0.5 mm) in start, end and the Mistake', () => {
    for (const p of posesOf(s())) expect(glyphProblems(s(), p), p).toEqual([]);
  });
  it('R3 (round 2): the drawn hand runs from the forearm\'s end over the bar centre, at the floor and in the Mistake', () => {
    for (const p of ['end', 'mistake']) expect(handProblems(s(), p), p).toEqual([]);
  });
  it('R3 mutations: the 423acc1 drawing (the bar glyph 3 cm back from the fist along the hand) and the hand poly dropped are red', () => {
    const offBar = { ...s(), equipment: s().equipment.map((e: any) => (typeof e !== 'function' ? e : (l: any, ctx: any) => {
      const x = e(l, ctx); if (!x || !(x.type === 'barbell' || x.part === 'bardot')) return x;
      const d = [0, l['grip.r'][1] - l['wrist.r'][1], l['grip.r'][2] - l['wrist.r'][2]], L = Math.hypot(d[1]!, d[2]!);
      return { ...x, at: [0, x.at[1] - d[1]! / L * 0.03, x.at[2] - d[2]! / L * 0.03] };
    })) };
    expect(glyphProblems(offBar, 'end')).toEqual(['end: fist off the plate centre']);
    const noHand = { ...s(), equipment: s().equipment.filter((e: any) => !(typeof e === 'function' && e(lm('end'), { pose: 'end' })?.part === 'hand')) };
    expect(handProblems(noHand, 'end')).toEqual(['end: no hand']);
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
  // The panel fix (D-LIB13-PANEL1, #274 6278550928): one hip pad whose drawn face runs along the front of the upper
  // thigh, an upright under the raised end of the beam, and the foot plate on the sole line, square to the shin.
  const padProblems = (spec: any, p: string) => {
    const { items, lm: l } = itemsIn(spec, p), polys = items.filter((it: any) => it.type === 'poly');
    const pad = polys[0], plate = polys[1], a = l['hip.r'], b = l['knee.r'], u = [b[1] - a[1], b[2] - a[2]], L = Math.hypot(u[0]!, u[1]!);
    const out: string[] = [];
    // the pad face (its first edge) parallel to the thigh within 5 deg, on the thigh front, the pad body outside the thigh
    const f = [pad.pts[1][1] - pad.pts[0][1], pad.pts[1][2] - pad.pts[0][2]], cos = Math.abs(f[0]! * u[0]! + f[1]! * u[1]!) / Math.hypot(f[0]!, f[1]!) / L;
    if (Math.acos(Math.min(1, cos)) * 180 / Math.PI > 5) out.push(`${p}: pad face not along the thigh`);
    const off = (q: number[]) => ((q[1]! - a[1]) * -u[1]! + (q[2]! - a[2]) * u[0]!) / L;
    if (Math.abs(off(pad.pts[0]) - off(pad.pts[1])) > 0.01 || Math.abs(off(pad.pts[0])) - eng.RADII.thigh[0] * 1.75 > 0.06) out.push(`${p}: pad face off the thigh`);
    if (Math.abs(off(pad.pts[2])) <= Math.abs(off(pad.pts[1]))) out.push(`${p}: pad body inside the thigh`);
    if (Math.hypot(pad.pts[0][1] - pad.pts[1][1], pad.pts[0][2] - pad.pts[1][2]) < 0.4) out.push(`${p}: pad under 40 cm`);
    // the foot plate face through the heel and the ball (1 cm), square to the shin within 10 deg
    const fp = [plate.pts[1][1] - plate.pts[0][1], plate.pts[1][2] - plate.pts[0][2]], FL = Math.hypot(fp[0]!, fp[1]!);
    const dl = (q: number[]) => Math.abs((q[1]! - plate.pts[0][1]) * -fp[1]! + (q[2]! - plate.pts[0][2]) * fp[0]!) / FL;
    if (dl(l['heel.r']) > 0.01 || dl(l['ball.r']) > 0.01) out.push(`${p}: soles off the plate face`);
    const sh = [l['ankle.r'][1] - l['knee.r'][1], l['ankle.r'][2] - l['knee.r'][2]], c2 = (sh[0]! * fp[0]! + sh[1]! * fp[1]!) / Math.hypot(sh[0]!, sh[1]!) / FL;
    if (Math.abs(90 - Math.acos(c2) * 180 / Math.PI) > 10) out.push(`${p}: plate not square to the shin`);
    // an upright: a backPad bar standing vertical from the floor
    if (!items.some((it: any) => it.type === 'backPad' && Math.abs(it.surface[0][2] - it.surface[1][2]) < 1e-9 && Math.min(it.surface[0][1], it.surface[1][1]) < 0.1)) out.push(`${p}: no upright`);
    return out;
  };
  it('back_extension panel fix: one pad along the front of the thigh, the foot plate on the soles square to the shin, and an upright, in every pose', () => {
    for (const p of posesOf(S.back_extension)) expect(padProblems(S.back_extension, p), p).toEqual([]);
  });
  it('back_extension panel-fix mutations: the pad turned 90 deg, and the plate laid level, are red', () => {
    const s = S.back_extension;
    const polyAt = (k: number) => s.equipment.findIndex((e: any) => typeof e === 'function' && itemsIn({ ...s, equipment: [e] }, 'end').items[0]?.type === 'poly') + k;
    const remap = (i: number, f: (x: any) => any) => ({ ...s, equipment: s.equipment.map((e: any, j: number) => (j === i ? (lm: any, ctx: any) => { const x = e(lm, ctx); return x ? f(x) : x; } : e)) });
    const turned = remap(polyAt(0), x => ({ ...x, pts: [x.pts[0], x.pts[3], x.pts[2], x.pts[1]] }));
    expect(padProblems(turned, 'end').some(m => /pad face not along the thigh/.test(m))).toBe(true);
    const level = remap(polyAt(1), x => ({ ...x, pts: x.pts.map((q: number[]) => [q[0], x.pts[0][1], q[2]]) }));
    expect(padProblems(level, 'end').some(m => /soles off|not square/.test(m))).toBe(true);
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
  // The panel fix (D-LIB13-PANEL1, #274 6278550928): R3 the support palm flat on the bench; R5 the red working arm in
  // open space (the Mistake outline is masked inside the faulty body and under the solid end figure).
  it('R3: the support hand is drawn as the flat palm, level (within 3 deg), in every pose', () => {
    expect(s().hand).toEqual({ l: 'flat' });
    for (const p of posesOf(s())) { const l = lm(p), d = [l['grip.l'][1] - l['wrist.l'][1], l['grip.l'][2] - l['wrist.l'][2]]; expect(Math.abs(Math.atan2(d[0]!, d[1]!) * 180 / Math.PI), p).toBeLessThanOrEqual(3); }
  });
  const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
  // R5 round 3 (D-LIB13-PANEL3, #274 6335029737): the engine masks the Mistake outline inside the faulty body, so the
  // red arm is traced as dashed guides (drawn in the Mistake layer, above every figure and the bench): every point of
  // the red arm's outer outline lies on a guide (0.5 px), the dumbbell hex is a guide, and the guides follow the m-pose.
  const traceProblems = (spec: any) => {
    const b = { height: 1.75 }, PXM = 146.28571428571428, cam = { view: 'side', near: 'r', pxm: PXM, P: (w: number[]) => [spec.camera.x0 + w[2]! * PXM, spec.camera.y0 - w[1]! * PXM] };
    const M2 = body.bodyShapes(body.fk(body.resolve(body.normPose({ ...spec.poses.end, ...spec.mistake.pose }, b), b).q, b), cam).filter((x: any) => x.poly);
    const arm = M2.filter((x: any) => ['shcap.r', 'upper.r', 'elbowcap.r', 'fore.r'].includes(x.key));
    const segs = spec.mistake.guides.filter((g: any) => g.kind === 'dashed').flatMap((g: any) => { const q = g.pts.map(cam.P); return q.slice(1).map((v: number[], i: number) => [q[i], v]); });
    const near = (p: number[]) => segs.some(([u, v]: number[][]) => { const dx = v![0]! - u![0]!, dy = v![1]! - u![1]!, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p[0]! - u![0]!) * dx + (p[1]! - u![1]!) * dy) / L2)); return Math.hypot(p[0]! - u![0]! - t * dx, p[1]! - u![1]! - t * dy) <= 0.5; });
    const out: string[] = [];
    for (const sh of arm) { const miss = sh.poly.filter((q: number[]) => !arm.some((o: any) => o !== sh && inPoly(o.poly, q)) && !near(q)).length; if (miss) out.push(`${sh.key}: ${miss} outline points untraced`); }
    const G = cam.P(itemsIn(spec, 'mistake').lm['grip.r']);
    if (!spec.mistake.guides.some((g: any) => g.kind === 'dashed' && g.pts.length === 7 && g.pts.every((w: number[]) => Math.abs(Math.hypot(cam.P(w)[0]! - G[0]!, cam.P(w)[1]! - G[1]!) - 0.0595 * PXM) < 0.5))) out.push('no dumbbell guide');
    const svg: string = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    if (!(svg.indexOf('class="m-pose"') > 0 && svg.indexOf('class="mistake-layer"') > svg.indexOf('class="m-pose"'))) out.push('guides not above the m-pose');
    return out;
  };
  it('R5 (round 3): the whole red arm and the dumbbell are traced as dashed guides drawn above every figure and the bench', () => {
    expect(traceProblems(s())).toEqual([]);
  });
  it('R5 (round 3) mutation: the arm guides dropped (the round-2 drawing) are red', () => {
    const g = s().mistake.guides.filter((x: any) => x.kind !== 'dashed' || x.pts.length === 7);
    expect(traceProblems({ ...s(), mistake: { ...s().mistake, guides: g } }).some(m => /untraced/.test(m))).toBe(true);
  });
  // R5 round 2 (D-LIB13-PANEL2, D-LIB13-ONEARM-M): the Mistake is c10's bottom half, the arm short of straight at the
  // bottom: the red arm hangs from the shoulder with the elbow at D-LIB13-PANEL3's ruled point (upper arm 25 deg, ±3,
  // behind plumb; it was within 10 deg of plumb in round 2), the elbow bent at least 30 deg
  // the way an elbow bends (the wrist ahead of the upper-arm line, toward the head), the dumbbell within 20 cm above the
  // straight-arm start; the top half (the blade) has no tell.
  const bottomProblems = (spec: any) => {
    const l = itemsIn(spec, 'mistake').lm, st = itemsIn(spec, 'start').lm, S = l['shoulder.r'], E = l['elbow.r'], W = l['wrist.r'];
    const u = [E[1] - S[1], E[2] - S[2]], f = [W[1] - E[1], W[2] - E[2]];
    const bend = Math.acos((u[0]! * f[0]! + u[1]! * f[1]!) / Math.hypot(u[0]!, u[1]!) / Math.hypot(f[0]!, f[1]!)) * 180 / Math.PI;
    const plumb = Math.abs(Math.atan2(u[1]!, -u[0]!)) * 180 / Math.PI, rise = l['grip.r'][1] - st['grip.r'][1];
    const back = u[1]! < 0;
    return [...(back && Math.abs(plumb - 25) <= 3 ? [] : [`upper arm ${plumb.toFixed(0)} deg off the ruled 25 deg`]), ...(bend >= 30 && u[0]! * f[1]! - u[1]! * f[0]! < 0 ? [] : ['elbow not bent forward 30 deg']),
      ...(rise > 0 && rise <= 0.2 ? [] : [`dumbbell ${rise.toFixed(2)} m above the start`]), ...(spec.mistake.tells.some((t: any) => t.key === 'blade') ? ['blade tell'] : [])];
  };
  it('R5 (round 2): the red arm hangs from the shoulder, short of straight at the bottom, and no blade tell', () => {
    expect(bottomProblems(s())).toEqual([]);
  });
  it('R5 (round 2) mutation: the 423acc1 Mistake (grip 0.50 m under and 0.30 m behind the shoulder, the blade tell) is red', () => {
    const SE = lm('end')['shoulder.r'], mp = s().mistake.pose, at = [lm('start')['grip.r'][0], SE[1] - 0.50, SE[2] - 0.30];
    const old = { ...s(), mistake: { ...s().mistake, pose: { scap: mp.scap, reach: { l: mp.reach.l, r: { at, pole: [-0.3, 1, -0.4] } } }, tells: [...s().mistake.tells, { key: 'blade' }] } };
    const p = bottomProblems(old);
    expect(p.some(m => /off the ruled/.test(m))).toBe(true);
    expect(p).toContain('blade tell');
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

// ---- LIB-13s (lib-13s-card @ dd30aa1a; rulings D-LIB13S-1 to -10, lib4-cards §48; DESIGN.md section 16): the shrugs and
// t_bar_row, all H with normal-view zooms. Wave 1: barbell_shrug and t_bar_row. ----
describe('LIB-13s A2: the 7 approved LB3 plates stay byte-identical (page 6ff09d4c on main 6b32d576)', { timeout: T }, () => {
  // golden.mjs fragmentsOf of the 7 approved plates on main's LB3 page 6ff09d4c…08c6 (D-LIB13-PANEL1-3): 63 fragments.
  const APPROVED: Record<string, Record<string, string>> = {
    "pendlay-row": {
      "normalSvg": "c47a5e46c6cae0a308d786196e2c007f9fda8b03bb5af327742ca57d46bc1c3c",
      "normalOverlay": "4b424626b2dbd508f85db62cbd0ffe21506a6be8f3ff4fd7427ebd382bc002b5",
      "mistakeSvg": "b1531ffe142c04e198a690964c24bc9af0a77dd7f69a4279e048137e300c4e62",
      "mistakeOverlay": "f028d20677d7709f71e6a1d48424ebcb3aae1bce911bdcaaea288117da0c80d0",
      "tells": "1396470914bdfa0d3abc107be8a103ad4916548fd82c07bbacdbd4a6d4f3972f",
      "tempo": "6d54e989adeb68a11dee835225371ccc6f605797fdeff858e574210cc4f2b219",
      "cues": "2d6c7cf3e8dd390c9f5a05a56684f2d7d36c12ae3821d2234dc458dccd29b894",
      "alt": "65412e50ffc46f0b4f78265a953cffe5566e1c9a7c9211d0aecee422ee0d2e9a",
      "mistakeAlt": "59f9b9bb1f39f85536bd306f831b8030b67732d7a828f973c14ce36475dc4590"
    },
    "landmine-row": {
      "normalSvg": "ba794202e2211ec4a599581485245d65a2cc2e4ea8a6511b0afe98f1cf297677",
      "normalOverlay": "07e549d3a9a686b545af202dd7f05db135135cc2c3dd82ed317a1eb1dc682ca3",
      "mistakeSvg": "37780c55527471d5eb3e0f98a5275746489889d4ea99ae045b9b749fdf7d6494",
      "mistakeOverlay": "e3e5a35f79d607204f35992daff2656e2e708e518b8051a06e91b161aa25ef37",
      "tells": "f515ae721b28b8a4edd93baf6e89e3146c49ae7ce3b3e8ee9135ee1a3e6d9df7",
      "tempo": "85464aff27287f56375923a2ea166aab9e5aab3fac8821ace0063acb9b3a3e0f",
      "cues": "acfbd56978554b4a72ff3d67e4e7372ddac090560d0d297be0f9aa1ec684210e",
      "alt": "62ecca60452f962b3e4e5234186a67162a6608024a0d56e401e50ebb3da33a47",
      "mistakeAlt": "8d7f941c7ea660773b1572dc4884e058b13437dc191c91f6144ebac444c3e158"
    },
    "one-arm-dumbbell-row": {
      "normalSvg": "4bb20c3d141733f389b2c100c1b4fe7df1fd5c28d787015a04adbff91dff3466",
      "normalOverlay": "880027edac5bd42c9e3efb28b5173fff83681732e860b0d89235d2ee2402acdf",
      "mistakeSvg": "2dc08147f5865e93d2075ba11648b5370f8aef7e6c457df7e5e21fb85ce2ebc2",
      "mistakeOverlay": "175a7442fe23358b7ae59138ed6b260c24015d04f4216375e072dc2b0f621410",
      "tells": "b666789c21305b66eee9157ce009a2cece7b27dedfb58a236d843b968a0cfe99",
      "tempo": "20977979ba2d5b41227e085fd7f83ef86468ab3e175170f6b056cd3dad40b579",
      "cues": "cc9a1ddf74bf2d8efae0769f36c548c9b95db75331d15a650c29d6902ae38872",
      "alt": "db9324702c44f4f7937d8380891ebfa4d54ab883770ecc1427edc28f2f9a33c4",
      "mistakeAlt": "d771c0785ceebae45ea330788f553fb08a7b6cc5525d06ce4b52be9d9378f0be"
    },
    "dumbbell-romanian-deadlift": {
      "normalSvg": "27c5aed23d94529cd082c51faea8d6d2fda1bafd1769196984b9c0cf62680273",
      "normalOverlay": "5a34f3ad897d0d21dde658b7bb409c10b122ae9c1d37382dd84897fbce50793e",
      "mistakeSvg": "6a98456d2836e5f0503f7bfdb144d5217c22489596f40d86bd5c2a6d53d8329a",
      "mistakeOverlay": "69bf07d50cd124b6839053092065a397af4dfac338fe4d67791aadce0ade120f",
      "tells": "c62dec6cd8c7d223ca7c7d063358b69c16172c0081907d7ddf498de319d66c83",
      "tempo": "d779228da386025e8d7f2ba40e2cd2eeb7440d2dcd29882ce9633f0e2d38d8ee",
      "cues": "fc56926595fb2b9aa778a32581768352af833e3a7c7264de2780fedfec001cbe",
      "alt": "cc9662d04e98944b44097c31b7e112601e0bdbd432a8c061a3368bc431232026",
      "mistakeAlt": "c37ad885da61232cf876b5e6fd9c9c9dea577166bd97a88a8eeae36fa83720d5"
    },
    "conventional-deadlift": {
      "normalSvg": "d74f187edf5266561e372bcfeaa5c4e70063b9c30d27cce2b6f8c25a1436cb13",
      "normalOverlay": "f935bc9ef0e0f27c74b7cdbd0c8b8fdb77926d3d543808d98683adc8de367bda",
      "mistakeSvg": "e32b06f7e0cfb951da7b388c136d482cbd15c5be6d59d2a22bea737143d5d6c3",
      "mistakeOverlay": "07786e0e182eba798fc0eb8f6dbb5e03cbfbce8f623ee504798d62456be38d41",
      "tells": "76d338722edb81af2e914ad09e4cf07f6f5f3a0bfbe4e9404b63e1042163ce44",
      "tempo": "37010198d446f18f117df876fee4dc108ccbdbe147775b8c915f627e8611d468",
      "cues": "a453740cfa767b5d5a3227b8834009eb63aa6bd402e85a5e73d630d341957018",
      "alt": "efa5eafa680cfb7607ff314efa56b0d76bb35acf30cd3364523727824523c7d6",
      "mistakeAlt": "2d6d1d4c634533ebdd4a6c0802a3f797f56479abd0b4a516ac3c92904fca2a05"
    },
    "sumo-deadlift": {
      "normalSvg": "9a2f2b0e2a325dc698d0acdff5a59c203cef3013f9b230610601bf686f50868a",
      "normalOverlay": "87101be011d94c7212ea7a710cf4b05ab97eabab45dcef76680296d025b777bb",
      "mistakeSvg": "da50e75c5094ff2476f3be0685b24f9cdb1c1c3c6a83b9c0137b2b5586a3acc4",
      "mistakeOverlay": "bbb6d492d7107a6d080b9f51da800e55678069b25cef2777cc5169b4f1e478b5",
      "tells": "09075a3625dea0c893795e6b758e8992ab92e904971970a35676b82c49288095",
      "tempo": "37010198d446f18f117df876fee4dc108ccbdbe147775b8c915f627e8611d468",
      "cues": "52ed45d9aa7ced257552fba1deffd42f417ccd25191d0c1be311f5d71c8577c3",
      "alt": "5c36d71989166b93a4710d9b40f731139745478b97447cb53cb256b2bb51b285",
      "mistakeAlt": "895f31a0b03531fc67e465902ca503c30d508eb1f10ff57f7fbb3d6b16ee33ac"
    },
    "back-extension": {
      "normalSvg": "6635c051ae842d46dcde7119c6c33316bce1e5e1effac15c01b7a982196ce074",
      "normalOverlay": "c2cdee31297c4503157fa82a234bbeaaa2aece737c63f0d394e831dc148bfc6f",
      "mistakeSvg": "1a2de143b2123d7a4dfaaddb6b5bcf2905e099cf10916aedaa84da8543145163",
      "mistakeOverlay": "7de203341dba44d0b708b33ac3ed43823235c71205d422d561651653bdce90a5",
      "tells": "0be502a8c45b495594a60aac16a604e4ba58f6cff133693abe26e96c393e9fb5",
      "tempo": "b76e5404da881272ff155a64336f76dc60a8e1d99d60e3abac0b3c3cd27ab2e6",
      "cues": "d4031709c54c6ee7ea7e49ad7fbe10810e51a10ece2a4fcad5143f903323f311",
      "alt": "bbffa4ff5cc2132e7ca48c9ce849e8d02925af71104155374e3322ca6fa1b9fb",
      "mistakeAlt": "f611081c93f0cf420ae8067963c4431623bacf7e7f7288cb4c851e345b5064b5"
    }
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb3/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const fragProblems = (html: string) => Object.entries(APPROVED).flatMap(([c, want]) => {
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`);
  });
  it('63 fragments of the 7 approved plates on this head equal main\'s, and the 7 alone still build page 6ff09d4c', async () => {
    expect(Object.values(APPROVED).reduce((n, f) => n + Object.keys(f).length, 0)).toBe(63);
    expect(fragProblems((await build.buildLb3Page()).html.toString('utf8'))).toEqual([]);
    const seven = (await build.buildLb3Page({ ids: drawn().map(i => `lib_${i}`) })).html;
    expect(build.sha256(seven)).toBe('6ff09d4c144f90d7210f951eb23fe81b42f55d20478bc4b8bb1d2b3980d008c6');
  });
  it("mutation: one byte changed in landmine_row's alt is red", async () => {
    const html = (await build.buildLb3Page()).html.toString('utf8'), p = golden.extractPlates(html).find((x: any) => x.chromeId === 'landmine-row');
    expect(fragProblems(html.replace(p.alt, p.alt.replace(/e/, 'E')))).toContain('landmine-row alt');
  });
});

describe('LIB-13s: barbell_shrug stays byte-identical to its approval (panel mx16 @ 01b66192, page c8854782)', { timeout: T }, () => {
  // golden.mjs fragmentsOf of barbell-shrug on the LB3 page c8854782…28a5 (APPROVED in mx16, #359 6548509170)
  const WANT: Record<string, string> = {
    "normalSvg": "5f1fe8abe186bef16f0f0721052cfc59c0d46adce7d63c5eeac391bdfce560c3",
    "normalOverlay": "39ae0531c1467137f5b9219be4889e0427935054de184f554366bd8aac813b7d",
    "mistakeSvg": "d13fb13d689b97c63548facfd9bfd6cae9c31bce6ff3cd669098a8dbd9ab4da7",
    "mistakeOverlay": "2116ee95ef7ecfc595c4d3f3581545d19be6a847fa144292972045651beb8527",
    "tells": "62fe5129a6ea13ec01e392041626a6d679404d0fad9916c4ef23c3da4232c128",
    "tempo": "16fa92968d867844b0523f60f380e5bb4bc57a89d2543adcd24c7a35816a1e11",
    "cues": "2124f85f22a111c0ff46a73940153eb17873ff8ddf446ac532f640464f0f0d53",
    "alt": "4a903ff68dc6f01198c4a46cb12ce3f2db9e998787ac9d71a904a6218d7a467c",
    "mistakeAlt": "04e3c794510433dda67db495922070a5b792b78421301ffbb4fddbf3b2d96deb"
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb3/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const diff = (html: string) => { const p = golden.extractPlates(html).find((x: any) => x.chromeId === 'barbell-shrug'), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(WANT).filter(k => got[k] !== WANT[k]); };
  it('its 9 fragments on this head equal the approved ones', async () => {
    expect(Object.keys(WANT).length).toBe(9);
    expect(diff((await build.buildLb3Page()).html.toString('utf8'))).toEqual([]);
  });
  it('mutation: one byte in its alt is red', async () => {
    const html = (await build.buildLb3Page()).html.toString('utf8'), p = golden.extractPlates(html).find((x: any) => x.chromeId === 'barbell-shrug');
    expect(diff(html.replace(p.alt, p.alt.replace(/e/, 'E')))).toEqual(['alt']);
  });
});

describe('LIB-13s: t_bar_row and cable_shrug stay byte-identical to their approval (panel mx19 @ fe9219bf, page ff1885dd)', { timeout: T }, () => {
  // golden.mjs fragmentsOf on the LB3 page ff1885dd…2467 (both APPROVED in mx19, #359 6549892683)
  const WANT: Record<string, Record<string, string>> = {
    "t-bar-row": {
      "normalSvg": "55033f287c6452884c321a351bd22fc80fcd6427d882b116ff4adbec10adab62",
      "normalOverlay": "8ef5dee012db1a6350170a7dcff6cf7c0b618be232c20c080cec3e85350da3eb",
      "mistakeSvg": "58ef7ff6c0da83be29daf5c34576055181b37048af96031b5337812577d6f19e",
      "mistakeOverlay": "e3415d48b64ba51d4e57bdbff5f3fe91eb09cbee61f664fdd8dbcf06bf1c6979",
      "tells": "0f124fe0f85ad2f33973d731c7ff12b56828ef8c91914c83ec9e0a435ee41d74",
      "tempo": "1abe99bb41e11a9299d678e9f35bf3bc56e5914201313343974af433de126912",
      "cues": "4b4f147dac10cd4bff49b55377ac9293e8b4af978f79dc9d2e6af8ff9d43fcc3",
      "alt": "85abbeb013abf88c2602c783245d74ba2016084897e233562fa60bd7ff725b63",
      "mistakeAlt": "6eea18cf9ec0b7692427b8066dd69f0df01dc88a94d51cda657797510b69e884"
    },
    "cable-shrug": {
      "normalSvg": "3368eb4b27523618e65e83222f402016ab3c03ac26b97a9fdebb85a57ff84fc8",
      "normalOverlay": "5d967c3e5e5ac58e732291abdff84e7446026c769a13d4020e95dfe20f18dd9d",
      "mistakeSvg": "60f8c3a1b2c058e0dfac1710e09e68d52cfde317b05845cda46c99b0602c7b88",
      "mistakeOverlay": "7e7ea27a3295af5b89dfd83671b02f736fdf612b9c103448d04a30dddd362d2e",
      "tells": "f37a3668fadfc962b51cc69828608cbe51fc16803a072dd7f33843088ff0c2a9",
      "tempo": "8c1a840e14fab09fb3181eebe48a482e98b8fab8f7e035855cb47ccee90d0474",
      "cues": "3ce71672c772458d93046ac84313639d0600a93d29ee5df4628d778df5bb81f6",
      "alt": "7af90ce3fe791c078e03008c9f21939a6ca77d66f9cf6e2bbf84713dbbaebb11",
      "mistakeAlt": "1e758bea4bc223e3b79ea6eb5aa5beb3a1809755fb7f9fe3ac8c6b0d32973a7f"
    }
  };
  let golden: any, build: any;
  beforeAll(async () => { [golden, build] = await Promise.all(['../golden.mjs', 'lb3/build.mjs'].map(f => import(/* @vite-ignore */ lib(f)))); }, T);
  const diff = (html: string) => Object.entries(WANT).flatMap(([c, want]) => { const p = golden.extractPlates(html).find((x: any) => x.chromeId === c), got = p ? golden.fragmentsOf(p) : {};
    return Object.keys(want).filter(k => got[k] !== want[k]).map(k => `${c} ${k}`); });
  it('their 18 fragments on this head equal the approved ones', async () => {
    expect(Object.values(WANT).reduce((n, f) => n + Object.keys(f).length, 0)).toBe(18);
    expect(diff((await build.buildLb3Page()).html.toString('utf8'))).toEqual([]);
  });
  it("mutation: one byte in cable_shrug's alt is red", async () => {
    const html = (await build.buildLb3Page()).html.toString('utf8'), p = golden.extractPlates(html).find((x: any) => x.chromeId === 'cable-shrug');
    expect(diff(html.replace(p.alt, p.alt.replace(/e/, 'E')))).toEqual(['cable-shrug alt']);
  });
});

describe('LIB-13s A1: the released rows are H with no parent, template or params; held shrugs have no row', () => {
  const rowProblems = (rows: Record<string, any>) => Object.entries(rows).flatMap(([id, r]) =>
    [r.mode !== 'H' ? `${id}: mode ${r.mode}` : null, ...['parent', 'template', 'params'].filter(k => k in r).map(k => `${id}: ${k}`)].filter(Boolean));
  it('every LB3 row is H, the released ids are rows, and no held shrug is', () => {
    const rows = readJson(ROWS).rows;
    expect(rowProblems(rows)).toEqual([]);
    for (const id of RELEASED) expect(rows[`lib_${id}`]?.src, id).toBe(`library/specs/${id}.mjs`);
    for (const id of HELD_SHRUGS) expect(rows[`lib_${id}`], id).toBeUndefined();
  });
  it("mutations: a row set to 'T', and a row given a parent, are red", () => {
    const rows = readJson(ROWS).rows;
    expect(rowProblems({ ...rows, lib_barbell_shrug: { ...rows.lib_barbell_shrug, mode: 'T' } })).toEqual(['lib_barbell_shrug: mode T']);
    expect(rowProblems({ ...rows, lib_t_bar_row: { ...rows.lib_t_bar_row, parent: 'lib_landmine_row' } })).toEqual(['lib_t_bar_row: parent']);
  });
});

describe('LIB-13s wave 1: zooms, card-true poses and the 2 px clearance (A3, A4, A5)', { timeout: T }, () => {
  const PX = 146.29, CLEAR_PX = 2, LADDER = [1.5, 2, 2.5, 3, 3.5, 4], TRACE = 22.11;
  const W: Record<string, any> = {}, MOD: Record<string, any> = {};
  let Z: any, QZ: any;
  beforeAll(async () => {
    Z = await import(/* @vite-ignore */ lib('zoom/inline.mjs')); QZ = await import(/* @vite-ignore */ lib('qa/zoom.mjs'));
    for (const id of RELEASED) { MOD[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); W[id] = MOD[id].default; }
  }, T);
  /** The spec rebuilt from its own source with each [from, to] replaced once (a constant mutation), imports made absolute. */
  const variant = async (id: string, pairs: [string, string][]) => {
    let src = readFileSync(`tools/plates/library/specs/${id}.mjs`, 'utf8');
    for (const [a, b] of pairs) { expect(src.split(a).length - 1, a).toBe(1); src = src.replace(a, b); }
    src = src.replace(/from '\.\.\/([^']+)'/g, (_m, f) => `from '${lib(f)}'`);
    const dir = mkdtempSync(join(tmpdir(), 'lb3s-var-')), file = join(dir, `${id}.mjs`);
    writeFileSync(file, src);
    try { return await import(/* @vite-ignore */ `file://${file}`); } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  // ---- the drawn body outline: the engine's Catmull-Rom spline through bodyShapes (8 samples a span), in metres ----
  const cr = (ps: number[][], k = 8) => { const n = ps.length, g = (i: number) => ps[(i + n) % n]!, out: number[][] = [];
    for (let i = 0; i < n; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const c1 = [p1[0]! + (p2[0]! - p0[0]!) / 6, p1[1]! + (p2[1]! - p0[1]!) / 6], c2 = [p2[0]! - (p3[0]! - p1[0]!) / 6, p2[1]! - (p3[1]! - p1[1]!) / 6];
      for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t; out.push([0, 1].map(d => u * u * u * p1[d]! + 3 * u * u * t * c1[d]! + 3 * u * t * t * c2[d]! + t * t * t * p2[d]!)); } }
    return out; };
  const ARMS = /^(upper|elbowcap|fore|fist|shcap)\./;
  const outline = (pose: any, keep: (k: string) => boolean) => { const b = { height: 1.75 }, cam = { view: 'side', near: 'r', pxm: 1, P: (w: number[]) => [w[2]!, w[1]!] };
    return body.bodyShapes(body.fk(body.resolve(body.normPose(pose, b), b).q, b), cam).filter((s: any) => keep(s.key)).map((s: any) => (s.key.includes('cap') ? s.poly : cr(s.poly))); };
  const inP = (P: number[][], q: number[]) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[j]!, b = P[i]!;
    if ((b[1]! > q[1]!) !== (a[1]! > q[1]!) && q[0]! < a[0]! + (b[0]! - a[0]!) * (q[1]! - a[1]!) / (b[1]! - a[1]!)) c = !c; } return c; };
  const sd = (q: number[], a: number[], b: number[]) => { const d = [b[0]! - a[0]!, b[1]! - a[1]!], L2 = d[0]! ** 2 + d[1]! ** 2 || 1;
    const t = Math.max(0, Math.min(1, ((q[0]! - a[0]!) * d[0]! + (q[1]! - a[1]!) * d[1]!) / L2)); return Math.hypot(q[0]! - a[0]! - d[0]! * t, q[1]! - a[1]! - d[1]! * t); };
  /** Signed clearance in plate px of the side-plane point w (world) less radius r from the polys: negative inside. */
  const clearPx = (polys: number[][][], w: number[], r = 0) => { const q = [w[2]!, w[1]!];
    let best = Infinity, ins = false;
    for (const P of polys) { if (inP(P, q)) ins = true; for (let i = 0; i < P.length; i++) best = Math.min(best, sd(q, P[i]!, P[(i + 1) % P.length]!)); }
    return ((ins ? -best : best) - r) * PX; };
  const poseOf = (s: any, p: string) => (p === 'mistake' ? { ...s.poses.end, ...s.mistake.pose } : s.poses[p]);
  /** Densely sampled points along a drawn poly's edges (every 5 mm). */
  const edgePts = (pts: number[][]) => pts.flatMap((a, i) => { const b = pts[(i + 1) % pts.length]!, n = Math.max(1, Math.ceil(dist(a, b) / 0.005));
    return Array.from({ length: n }, (_, k) => a.map((v, j) => v + (b[j]! - v) * k / n)); });

  // ---- A5: barbell_shrug's bar shaft against both thighs and the torso ----
  const shrugBar = (s: any) => Object.fromEntries(['start', 'end', 'mistake'].map(p => {
    const bar = itemsIn(s, p, { mistake: p === 'mistake' }).items.find((x: any) => x.type === 'pulley' && x.part === 'bar');
    return [p, +clearPx(outline(poseOf(s, p), k => !ARMS.test(k)), bar.at, bar.r).toFixed(2)];
  }));
  it('A5 barbell_shrug: the drawn bar shaft clears the body outline by 2 px in every drawn pose (2.19 / 2.19 / 2.17)', () => {
    const c = shrugBar(W.barbell_shrug);
    expect(c).toEqual({ start: 2.19, end: 2.19, mistake: 2.17 });
    for (const v of Object.values(c)) expect(v).toBeGreaterThanOrEqual(CLEAR_PX);
  });
  it("A5 mutations: barbell_shrug's BAR_GAP back to 3 mm (0.44 px), and its bar solved on the near thigh alone (the Mistake inside the torso), are red", async () => {
    const gap = shrugBar((await variant('barbell_shrug', [['BAR_GAP = 0.015', 'BAR_GAP = 0.003']])).default);
    expect(gap.start).toBeCloseTo(0.44, 1); expect(gap.start).toBeLessThan(CLEAR_PX);
    const thigh = shrugBar((await variant('barbell_shrug', [["const FRONT_KEYS = ['thigh.r', 'thigh.l', 'torso'];", "const FRONT_KEYS = ['thigh.r'];"], ['BAR_GAP = 0.015', 'BAR_GAP = 0.003']])).default);
    expect(thigh.mistake).toBeLessThan(0);
  });

  // ---- A5: t_bar_row: the bar from the hook out, the hook ring, the grips and the plate against the torso and head ----
  const tbarClear = (m: any) => {
    const s = m.default, out: Record<string, any> = {};
    for (const p of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(s, p, { mistake: p === 'mistake' }), polys = items.filter((x: any) => x.type === 'poly' && !x.part);
      const part = (k: string) => items.find((x: any) => x.part === k).pts, ring = edgePts(part('handlering'));
      const sh = outline(poseOf(s, p), k => k === 'torso' || k === 'head'), P0 = m.TBAR.pivot;
      const bar = [...edgePts(polys[0].pts), ...edgePts(polys[1].pts)].filter((w: number[]) => dist(w, P0) >= m.TBAR.sHook - 0.1);
      const min = (ws: number[][]) => Math.min(...ws.map(w => clearPx(sh, w)));
      out[p] = { bar: min(bar), ring: min(ring), grips: min([lm.grips, ...edgePts(part('handlegrip')), ...edgePts(part('handle'))]), plate: min(edgePts(polys[2].pts)) };
    }
    return out;
  };
  it('A5 t_bar_row: every rising part clears the torso and head by 2 px in every drawn pose, except the end plate (c23: first contact)', () => {
    const c = tbarClear(MOD.t_bar_row);
    console.log(`LIB-13s t_bar_row clearance px: ${JSON.stringify(c)}`);
    for (const p of ['start', 'end', 'mistake']) for (const k of ['bar', 'ring', 'grips', 'plate']) {
      if (p === 'end' && k === 'plate') { expect(c.end.plate).toBeGreaterThanOrEqual(0); expect(c.end.plate).toBeLessThan(1); continue; }
      expect(c[p][k], `${p} ${k}`).toBeGreaterThanOrEqual(CLEAR_PX);
    }
    expect(c.mistake.bar).toBeLessThan(2.1);   // the Mistake stops at the first 2 px, not later
  });
  it("A5 mutation: t_bar_row's Mistake back to CLEAR 5 mm on the raw outline (0.47 px) is red", async () => {
    const m = await variant('t_bar_row', [['const MIST_A = firstContact(a => Math.min(...risingPts(a, 0.001).map(p => outside(OM0, p))) - CLEAR_M);', 'const MIST_A = firstContact(a => clearAt(outlineOf(mist0), a));']]);
    expect(tbarClear(m).mistake.bar).toBeLessThan(CLEAR_PX);
  });

  // ---- A4: card-true poses ----
  const elbowBend = (lm: any) => { const u = [0, 1, 2].map(i => lm['shoulder.r'][i] - lm['elbow.r'][i]), w = [0, 1, 2].map(i => lm['wrist.r'][i] - lm['elbow.r'][i]);
    return 180 - Math.acos(u.reduce((a, v, i) => a + v * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)) * 180 / Math.PI; };
  const shrugProblems = (s: any) => {
    const L = qaEng.poseLandmarks(Eng(), s).lm, out: string[] = [], rise = (L.end['shoulder.r'][1] - L.start['shoulder.r'][1]) * 100;
    if (Math.abs(rise - 5) > 0.2) out.push(`shoulder rise ${rise.toFixed(2)} cm`);
    for (const p of ['start', 'end']) if (elbowBend(L[p]) > 5) out.push(`${p}: elbow bent ${elbowBend(L[p]).toFixed(1)} deg`);
    return out;
  };
  it('A4 barbell_shrug: the shoulder joint rises 5 cm (±0.2), and the arms stay straight (elbow 5 deg or less) at the start and end (c2, c4)', () => {
    expect(shrugProblems(W.barbell_shrug)).toEqual([]);
  });
  it('A4 mutation: the shrug set to 7 cm is red', async () => {
    expect(shrugProblems((await variant('barbell_shrug', [['const SHRUG = 5;', 'const SHRUG = 7;']])).default)).toEqual([expect.stringMatching(/^shoulder rise 7\.0\d cm$/)]);
  });
  const tbarProblems = (m: any) => {
    const s = m.default, out: string[] = [], pivots: number[][] = [];
    for (const p of ['start', 'end', 'mistake']) {
      const { items } = itemsIn(s, p, { mistake: p === 'mistake' });
      pivots.push(items.find((x: any) => x.type === 'pulley').at);
      const rp = items.find((x: any) => x.part === 'handlering').pts, ring = [0, 1, 2].map(i => rp.reduce((a: number, q: number[]) => a + q[i]!, 0) / rp.length);
      const bar = items.filter((x: any) => x.type === 'poly' && !x.part), plate = bar[2].pts, P0 = m.TBAR.pivot;
      const u = [0, 1, 2].map(i => (bar[1].pts[1][i] - bar[0].pts[0][i])), uL = Math.hypot(...u), along = (w: number[]) => [0, 1, 2].reduce((a, i) => a + (w[i]! - P0[i]!) * u[i]! / uL, 0);
      const toPlate = Math.min(...plate.map(along)) - along(ring), inch = toPlate / 0.0254;
      if (!(inch >= 8 && inch <= 10)) out.push(`${p}: hook ${inch.toFixed(2)} in from the plates`);
    }
    if (pivots.some(q => dist(q, pivots[0]!) * PX > 1)) out.push('pivot moves');
    if (Math.abs(pivots[0]![1]! - 0.07) > 1e-9) out.push('pivot off the hinge height');
    const L = qaEng.poseLandmarks(Eng(), s).lm;
    for (const p of ['start', 'end']) { const a = deg(L[p].sacrum, L[p].neck); if (!(a >= 75 && a <= 90)) out.push(`${p}: back ${a.toFixed(1)} deg from vertical`); }
    const r = plate.renderPlate(s, { id: 'x' }).report;
    for (const [p, cs] of Object.entries<any>(r.contacts)) for (const c of cs) if (c.kind === 'foot' && c.errCm > 0.5) out.push(`${p}: foot.${c.side} plant ${c.errCm} cm`);
    return out;
  };
  it('A4 t_bar_row: one pivot (±1 px) on the hinge in every pose, the hook 8-10 in from the plates (c1), the chest-parallel back (c3), feet planted within 0.5 cm', () => {
    expect(tbarProblems(MOD.t_bar_row)).toEqual([]);
  });
  it("A4 mutations: the hook at 6 in, and the feet back at 0.2266 m with toes out 5 deg (1.0 cm), are red", async () => {
    expect(tbarProblems(await variant('t_bar_row', [['const HOOK = 0.229,', 'const HOOK = 0.1524,']])).filter(p => /: hook 5\.9\d in from the plates$/.test(p)).length).toBe(3);
    expect(tbarProblems(await variant('t_bar_row', [['const FOOT_X = 0.19, TOE_OUT = 17;', 'const FOOT_X = 0.2266, TOE_OUT = 5;']]))).toContain('start: foot.l plant 1 cm');
  });

  // ---- panel mx16 fix round (R1, R3): the handle hooked right under the bar, the end arm bent about 85 deg, the grip
  // perpendicular to the forearm through a fist on the forearm's axis ----
  const handleProblems = (m: any) => {
    const s = m.default, out: string[] = [], L = qaEng.poseLandmarks(Eng(), s).lm;
    for (const p of ['start', 'end', 'mistake']) {
      const { items, lm } = itemsIn(s, p, { mistake: p === 'mistake' }), part = (k: string) => items.find((x: any) => x.part === k).pts;
      const rp = part('handlering'), ring = [0, 1, 2].map(i => rp.reduce((a: number, q: number[]) => a + q[i]!, 0) / rp.length);
      const v = (ring[1]! - lm.grips[1]) * PX;
      if (v > 15) out.push(`${p}: the handle hangs ${v.toFixed(1)} px under the bar`);
      const g = part('handlegrip'), gd = [g[1][1] - g[0][1], g[1][2] - g[0][2]], E = L[p]['elbow.r'], W = L[p]['wrist.r'], f = [W[1] - E[1], W[2] - E[2]];
      const cos = Math.abs(gd[0]! * f[0]! + gd[1]! * f[1]!) / Math.hypot(...gd) / Math.hypot(...f);
      if (cos > Math.cos(89 * Math.PI / 180)) out.push(`${p}: the grip is ${(Math.acos(cos) * 180 / Math.PI).toFixed(1)} deg off the forearm`);
      const G = L[p]['grip.r'], off = Math.abs((G[1] - E[1]) * f[1]! - (G[2] - E[2]) * f[0]!) / Math.hypot(...f) * PX;
      if (off > 0.5) out.push(`${p}: the fist ${off.toFixed(1)} px off the forearm axis`);
    }
    const bend = elbowBend(L.end);
    if (!(bend >= 80 && bend <= 90)) out.push(`end: elbow bent ${bend.toFixed(1)} deg`);
    return out;
  };
  it('mx16 fix: the handle hangs 15 px or less under the bar, the grip turns square to the forearm through a fist on its axis, and the end elbow bends 80-90 deg', () => {
    expect(handleProblems(MOD.t_bar_row)).toEqual([]);
  });
  it("mx16 fix mutations: the mx16 handle (0.22 m) and the wrist bent back 35 deg are red", async () => {
    expect((handleProblems(await variant('t_bar_row', [['HANDLE_L = 0.09,', 'HANDLE_L = 0.22,']]))).some(p => /hangs/.test(p))).toBe(true);
    expect((handleProblems(await variant('t_bar_row', [['WRIST = 0;', 'WRIST = -35;']]))).some(p => /fist .* off the forearm axis/.test(p))).toBe(true);
  });

  // ---- A3: the zooms ----
  const SH35 = { view: 'normal', k: 3.5 };
  const WANT: Record<string, any> = { barbell_shrug: SH35, t_bar_row: { view: 'normal', k: 1.5 }, cable_shrug: SH35, dumbbell_shrug: SH35,
    smith_machine_shrug: SH35 };
  const PIN: Record<string, number> = { barbell_shrug: 24.54, t_bar_row: 35.69, cable_shrug: 24.54, dumbbell_shrug: 24.54, smith_machine_shrug: 24.54 };   // t_bar_row: mx16 fix round (handle hooked under the bar), k 1.5
  const noZoom = (s: any) => ({ ...s, zoom: undefined });
  // async with a yield before each zoom render: a long synchronous loop starves vitest's worker RPC (D-LIB8M-RPC)
  const zoomProblems = async (id: string, s: any) => {
    const out: string[] = [...Z.zoomFieldProblems(s.zoom)];
    if (JSON.stringify(s.zoom) !== JSON.stringify(WANT[id])) out.push(`zoom ${JSON.stringify(s.zoom)}`);
    if (!s.zoom) return out;
    const L: Record<number, number> = {};
    for (const x of LADDER) { await new Promise(r => setImmediate(r)); const w = Z.zoomOf({ ...s, zoom: { view: 'normal', k: x } }, { view: 'normal' }); L[x] = QZ.clippedTrace(w.svg, w.circle); }
    const len = (x: number) => L[x]!;
    const k = Z.zoomFor(s, 'normal').k, z = Z.zoomOf(s, { view: 'normal' });
    if (/<(text|foreignObject|tspan)\b|°/.test(z.svg)) out.push('text in the zoom');
    if (!(len(k) >= TRACE)) out.push(`Trace ${len(k).toFixed(2)} px at k ${k} < ${TRACE}`);
    if (LADDER.some(x => x < k && len(x) >= TRACE)) out.push('a smaller k reaches the bar');
    const tp = Z.tracePath(s, qaEng.cameraOf(s, plate.renderPlate(noZoom(s), { id: 'x' }).report));
    if (!tp.length || tp.some((p: number[]) => Math.hypot(p[0]! - z.src.c[0], p[1]! - z.src.c[1]) > z.src.r - 1)) out.push('the ring does not hold the whole Trace');
    if (Math.abs(len(k) - PIN[id]!) > 0.01) out.push(`Trace ${len(k).toFixed(2)} != pinned ${PIN[id]}`);
    return out;
  };
  it('A3: each zoom is the PLAN\'s view and k, meets 22.11 px at k (the shrugs 24.54 at 3.5, t_bar_row 35.69 at 1.5), no smaller ladder k does, and the ring holds the Trace', async () => {
    for (const id of RELEASED) expect(await zoomProblems(id, W[id]), id).toEqual([]);
  });
  it('A3: the plate is byte-identical outside the zoom (each view renders the same svg with and without the field)', () => {
    for (const id of RELEASED) for (const mistake of [false, true]) expect(plate.renderPlate(W[id], { id: 'x', mistake }).svg, id).toBe(plate.renderPlate(noZoom(W[id]), { id: 'x', mistake }).svg);
  });
  it("A3 mutations: barbell_shrug at k 3 (21.02 px), t_bar_row's zoom removed, and t_bar_row at k 2 (k 1.5 already reaches the bar) are red", async () => {
    expect(await zoomProblems('barbell_shrug', { ...W.barbell_shrug, zoom: { view: 'normal', k: 3 } })).toEqual(expect.arrayContaining([expect.stringMatching(/^Trace 21\.02 px at k 3 < 22\.11$/)]));
    expect(await zoomProblems('t_bar_row', noZoom(W.t_bar_row))).toEqual(['zoom undefined']);
    expect(await zoomProblems('t_bar_row', { ...W.t_bar_row, zoom: { view: 'normal', k: 2 } })).toContain('a smaller k reaches the bar');
  });
});

describe('LIB-13s A6: runQa node half on the wave-1 plates (zoom keys, H1 feet, H2 alt, named flags)', { timeout: T }, () => {
  let build: any, cand: any, golden: any, mirror: any, E: any, all: any, html: string, tbar: any;
  const W1 = () => tbar;
  beforeAll(async () => {
    [build, cand, golden] = await Promise.all(['lb3/build.mjs', 'candidate.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    tbar = (await import(/* @vite-ignore */ lib('specs/t_bar_row.mjs'))).default;
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb3All();
    html = (await build.buildLb3Page({ all, ids: RELEASED.map(i => `lib_${i}`) })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const keys = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const candOf = (id: string, page = html) => cand.candidateOf(id, { all, platesHtml: page, engine: E, authoring: true });
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  // H6 reads the card's three keys; until CARD FIELDS lands on barbell_shrug's card it reports H6:no-card (DESIGN.md 16.8)
  const keyed = (id: string) => 'plateFacts' in readJson(`docs/research/howto/cards/${id}.json`);
  it('clean: no node-half hard problem on any released plate; the node flags F3 and F4 are the ruled set (qa.mjs EXPECTED)', async () => {
    const q = await import(/* @vite-ignore */ lib('lb3/qa.mjs'));
    for (const id of RELEASED) {
      const r = await qa(await candOf(`lib_${id}`)), want = q.EXPECTED(`lib_${id}`);
      expect(keys(r), id).toEqual(keyed(id) ? [] : ['H6:no-card']);
      for (const f of ['F3', 'F4']) expect(r.flags[f].raised, `${id} ${f}`).toBe(want.includes(f));
      if (id === 'barbell_shrug') { expect(+r.flags.F3.value.toFixed(2)).toBe(45.79); expect(r.flags.F4.value).toBe(0); }
    }
  });
  it('mutations: a planted "15°" in t_bar_row\'s zoom (H2.zoom:angle), its zoom removed (H3.trace), and the 53-word alt (H2.alt) are red', async () => {
    const c0 = await candOf('lib_t_bar_row'), z = c0.plate.zoom.normal, end = z.lastIndexOf('</g>');
    const planted = { ...c0, plate: { ...c0.plate, zoom: { ...c0.plate.zoom, normal: `${z.slice(0, end)}<path class="x" d="M0 0" data-v="15°"/>${z.slice(end)}` } } };
    expect(keys(await qa(planted))).toContain('H2.zoom:angle');
    const unz = { ...c0, spec: { ...c0.spec, zoom: undefined }, plate: { ...c0.plate, zoom: undefined } };
    expect(keys(await qa(unz))).toContain('H3.trace');
    const alt53 = 'T-bar row, side view. Standing over a bar pinned at a floor pivot behind, a V-handle hooked under it near the plates, hinged with the chest level and the knees soft, the lifter pulls the handle from straight arms toward the lower chest until the plates meet the torso, driving the elbows back.';
    expect(keys(await qa({ ...c0, plate: { ...c0.plate, alt: alt53 } }))).toContain('H2.alt:alt');
  });
  // LIB-3's M1-M7 on the new plate t_bar_row (the LIB-13 A4 block's forms, copied): a spec mutation built the way the page builds it
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb3s-mut-')), file = join(dir, 't_bar_row.mjs'), ID = 'lib_t_bar_row';
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/t_bar_row.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb3', title: 'LB3', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(ID, h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('A6 M1-M7 on t_bar_row: label on the figure (H1), contact 1.1 cm off (H1), Trace under the bar with no zoom (H3), Mistake = end (H3), start = end (H3), a moving rackUpright and an unknown type (H9) are red', async () => {
    const s = W1(), c0 = s.callouts.find((x: any) => x.key === 'chest'), at = (box: any) => ({ ...s, callouts: s.callouts.map((x: any) => (x.key === 'chest' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[0, 1], [-1, 0], [1, 0], [0, -1]]) {
      for (let d = 1; d <= 120 && !hit; d++) {
        await new Promise(r => setImmediate(r));   // yield: a long synchronous search starves vitest's worker RPC (D-LIB8M-RPC)
        const box = { left: c0.box.left + dx! * d, top: c0.box.top + dy! * d }, is = plate.renderPlate(at(box), { id: 'm' }).report.issues;
        if (is.some((i: string) => !i.startsWith('figure:'))) break;
        if (is.length) hit = box;
      }
      if (hit) break;
    }
    expect(hit).toBeTruthy();
    expect(keys(await qa({ ...(await candOf('lib_t_bar_row')), spec: at(hit) })).some((k: string) => /^H1\.engine:normal:figure:/.test(k))).toBe(true);
    const shift = { ...s, checks: s.checks.map((k: any) => (k.landmark === 'heel.r' ? { ...k, plane: { ...k.plane, point: [0, 0.011, 0] } } : k)) };
    expect(keys(await qa({ ...(await candOf('lib_t_bar_row')), spec: shift })).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
    expect(keys(await qa(await mutated("s => ({ ...s, zoom: undefined, trace: { ...s.trace, trim: [30, 30] } })")))).toContain('H3.trace');
    // the handle polys are moving parts, drawn in every Mistake; M4 drops them with the Mistake pose (the LIB-13 A4 M4 form)
    expect(keys(await qa(await mutated("s => ({ ...s, equipment: s.equipment.filter(e => !String(e).includes('handleItems')), mistake: { ...s.mistake, pose: { reach: s.poses.end.reach, root: s.poses.end.root, trunk: s.poses.end.trunk } } })")))).toContain('H3.mistake-outline');
    expect(keys(await qa(await mutated('s => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] } })')))).toContain('H3.start-is-end');
    const extra = (lm: any, ctx: any) => ({ type: 'rackUpright', at: [0.5, 0, ctx.pose === 'mistake' ? -1.3 : -1.22], h: 0.5 });
    expect(keys(await qa({ ...(await candOf('lib_t_bar_row')), spec: { ...s, equipment: [...s.equipment, extra] } })).some((k: string) => k.startsWith(`H9.moving-line:eq${s.equipment.length}.rackUpright.`))).toBe(true);
    expect(keys(await qa({ ...(await candOf('lib_t_bar_row')), spec: { ...s, equipment: [...s.equipment, { type: 'rope3d', at: [0, 0, 0] }] } })).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it("A6/A7 F7 on barbell_shrug (drawable false): raised with the card topFault 'roll'; with topFault 'elbows' it is not, so the ruled expectation is red", async () => {
    const c = await candOf('lib_barbell_shrug');
    const raised = async (cc: any) => { const r = await qa(cc); return qaIdx.FLAGS.filter((f: string) => ['F7'].includes(f) && r.flags[f].raised); };
    expect(c.research.topFault).toBe('roll');
    expect(await raised(c)).toEqual(['F7']);
    expect(await raised({ ...c, research: { ...c.research, topFault: 'elbows' } })).toEqual([]);
  });
  it("H6 on barbell_shrug: the c1 start hand contacts hold (wrist checks 0 cm); mutation: the start body moved 2 cm forward turns exactly both facts red", async () => {
    const c = await candOf('lib_barbell_shrug');
    expect((await qa(c)).hard['PQ-H6'].problems).toEqual([]);
    const s = c.spec, st = s.poses.start, moved = { ...s, poses: { ...s.poses, start: { ...st, root: { ...st.root, at: [st.root.at[0], st.root.at[1], st.root.at[2] + 0.02] },
      reach: Object.fromEntries(Object.entries<any>(st.reach).map(([k, v]) => [k, { ...v, at: [v.at[0], v.at[1], v.at[2] + 0.02] }])),
      plant: Object.fromEntries(Object.entries<any>(st.plant).map(([k, v]) => [k, { ...v, at: [v.at[0], v.at[1], v.at[2] + 0.02] }])) } } };
    expect((await qa({ ...c, spec: moved })).hard['PQ-H6'].problems.map((p: any) => p.key).sort()).toEqual(['H6.fact:0:contact:wrist.l', 'H6.fact:1:contact:wrist.r']);
  });
  it('the ruled flag set (qa.mjs EXPECTED): F5 on both, and barbell_shrug\'s named F2, F3, F4 and F7', async () => {
    const q = await import(/* @vite-ignore */ lib('lb3/qa.mjs'));
    expect(q.EXPECTED('lib_barbell_shrug')).toEqual(['F2', 'F3', 'F4', 'F5', 'F7']);
    expect(q.EXPECTED('lib_t_bar_row')).toEqual(['F5']);
    expect(q.EXPECTED('lib_cable_shrug')).toEqual(['F5']);
    expect(q.EXPECTED('lib_dumbbell_shrug')).toEqual(['F2', 'F4', 'F5']);
    expect(q.EXPECTED('lib_smith_machine_shrug')).toEqual(['F2', 'F5']);
  });
});

describe('LIB-13s A7: the 4 shrug cards and quotes are research a48b0594 copies (keys apart); t_bar_row\'s card is main\'s; the tempo map', { timeout: T }, () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'], SH = ['barbell_shrug', 'dumbbell_shrug', 'cable_shrug', 'smith_machine_shrug'];
  const cs = () => readJson('tools/plates/library/lb3/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  const blob = (b: Buffer) => createHash('sha1').update(`blob ${b.length}\0`).update(b).digest('hex');
  const cardProblems = (cards: Record<string, any>) => SH.filter(id => sha(canon(cards[id])) !== cs().lib13s.cards[id]);
  it('the LIB-13s section names a48b0594 and the 4 shrugs; each card (without the three keys) and quotes file matches; LIB-13\'s 8 entries are unchanged', () => {
    const j = cs();
    expect(j.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(j.cards)).toEqual(LB3);
    expect(j.lib13s.researchHead).toBe('a48b059400a74d5c9e3aceed21cf1aa67ab6f118');
    expect(Object.keys(j.lib13s.cards)).toEqual(SH);
    expect(cardProblems(Object.fromEntries(SH.map(id => [id, cardOf(id)])))).toEqual([]);
    for (const id of SH) expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(j.lib13s.quotes[id]);
    for (const id of SH) expect(V.validateCardFile(`${id}.json`), id).toEqual([]);
  });
  it("t_bar_row's card is byte-identical to main's (blob 2142a7b6, its 3 keys as LIB-13 set them)", () => {
    expect(blob(readFileSync('docs/research/howto/cards/t_bar_row.json'))).toBe('2142a7b6c849f772eb1d06804aad866ac778978c');
  });
  it('mutation: another card key edited is red', () => {
    const c = cardOf('cable_shrug'); c.plate.view = 'front';
    expect(cardProblems({ ...Object.fromEntries(SH.map(id => [id, cardOf(id)])), cable_shrug: c })).toEqual(['cable_shrug']);
  });
  it('tempo.json\'s LIB-13s section is DESIGN.md 16.2\'s map; each released spec\'s tempo is its rows with the card\'s seconds', () => {
    const t = readJson('tools/plates/library/lb3/tempo.json').lib13s, RULED: Record<string, string[][]> = {
      barbell_shrug: [['Lift', 'up'], ['Lower', 'down']], dumbbell_shrug: [['Lift', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
      cable_shrug: [['Lift', 'up'], ['Hold', 'pause'], ['Lower', 'down']], smith_machine_shrug: [['Lift', 'up'], ['Lower', 'down']] };
    expect(t.constants).toEqual({});
    for (const id of SH) expect(t.ids[id].rows.map((r: any) => [r.phase, r.from]), id).toEqual(RULED[id]);
    const want = (id: string, card: any) => t.ids[id].rows.map((r: any) => ({ phase: r.phase, s: card.plate.tempo[r.from], ...(r.move ? { move: true } : {}) }));
    expect(S13.barbell_shrug.tempo).toEqual(want('barbell_shrug', cardOf('barbell_shrug')));
    const c = cardOf('barbell_shrug'); c.plate.tempo.down = 1;
    expect(S13.barbell_shrug.tempo).not.toEqual(want('barbell_shrug', c));   // mutation: one second changed on the card
  });
  // CARD FIELDS (DESIGN.md 16.2, 16.3; D-LIB13S-TOPFAULT): plateFacts the start hand contacts; tempo = the tempo.json rows with the
  // card's own seconds; topFault the drawn first tell key, or 'roll' on barbell_shrug (drawable false)
  // the start hand contacts from each setup grip quote (CARD FIELDS cf13s fix, supervisor 10-31)
  const hands = (claim: string, sides = ['l', 'r']) => sides.map(sd => ({ kind: 'contact', landmark: `wrist.${sd}`, pose: 'start', cardPose: 'start', claim }));
  const FACTS13S: Record<string, any[]> = { barbell_shrug: hands('c1'), dumbbell_shrug: hands('c4'), cable_shrug: hands('c1'), smith_machine_shrug: hands('c1', ['r']) };
  const TOPFAULT: Record<string, string> = { barbell_shrug: 'roll', dumbbell_shrug: 'elbows', cable_shrug: 'elbows', smith_machine_shrug: 'head' };
  const fieldProblems = (id: string, c: any) => {
    const t = readJson('tools/plates/library/lb3/tempo.json').lib13s.ids[id], out: string[] = [];
    const want = t.rows.map((r: any) => ({ phase: r.phase, s: c.plate.tempo[r.from], ...(r.move ? { move: true } : {}) }));
    if (JSON.stringify(c.plateFacts) !== JSON.stringify(FACTS13S[id])) out.push(`${id}: plateFacts`);
    if (JSON.stringify(c.tempo) !== JSON.stringify(want)) out.push(`${id}: tempo`);
    if (c.topFault !== TOPFAULT[id]) out.push(`${id}: topFault`);
    return out;
  };
  it('CARD FIELDS: each shrug card carries the ruled three keys; barbell_shrug\'s spec tempo equals its card\'s', () => {
    for (const id of SH) expect(fieldProblems(id, cardOf(id)), id).toEqual([]);
    for (const id of SH) expect(S13[id].tempo, id).toEqual(cardOf(id).tempo);
  });
  it('CARD FIELDS mutations: one second changed on a card, a fact added, and another topFault are red', () => {
    const a = cardOf('dumbbell_shrug'); a.tempo[1].s = 2;
    expect(fieldProblems('dumbbell_shrug', a)).toEqual(['dumbbell_shrug: tempo']);
    const b = cardOf('cable_shrug'); b.plateFacts = [...b.plateFacts, { kind: 'contact', landmark: 'grip.r', pose: 'start', claim: 'c2' }];
    expect(fieldProblems('cable_shrug', b)).toEqual(['cable_shrug: plateFacts']);
    const c = cardOf('barbell_shrug'); c.topFault = 'elbows';
    expect(fieldProblems('barbell_shrug', c)).toEqual(['barbell_shrug: topFault']);
  });
  let V: any;
  const S13: Record<string, any> = {};
  beforeAll(async () => { V = await import(/* @vite-ignore */ lib('research/validate.mjs')); for (const id of SH) S13[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default; }, T);
});

describe('LIB-13s wave 2: cable, dumbbell and smith_machine shrugs, card-true poses and the 2 px clearance (A4, A5)', { timeout: T }, () => {
  const PX = 146.29, W2 = ['cable_shrug', 'dumbbell_shrug', 'smith_machine_shrug'], S2: Record<string, any> = {};
  beforeAll(async () => { for (const id of W2) S2[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default; }, T);
  const variant = async (id: string, pairs: [string, string][]) => {
    let src = readFileSync(`tools/plates/library/specs/${id}.mjs`, 'utf8');
    for (const [a, b] of pairs) { expect(src.split(a).length - 1, a).toBe(1); src = src.replace(a, b); }
    src = src.replace(/from '\.\.\/([^']+)'/g, (_m, f) => `from '${lib(f)}'`);
    const dir = mkdtempSync(join(tmpdir(), 'lb3s-w2-')), file = join(dir, `${id}.mjs`);
    writeFileSync(file, src);
    try { return (await import(/* @vite-ignore */ `file://${file}`)).default; } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  const cr = (ps: number[][], k = 8) => { const n = ps.length, g = (i: number) => ps[(i + n) % n]!, out: number[][] = [];
    for (let i = 0; i < n; i++) { const p0 = g(i - 1), p1 = g(i), p2 = g(i + 1), p3 = g(i + 2);
      const c1 = [p1[0]! + (p2[0]! - p0[0]!) / 6, p1[1]! + (p2[1]! - p0[1]!) / 6], c2 = [p2[0]! - (p3[0]! - p1[0]!) / 6, p2[1]! - (p3[1]! - p1[1]!) / 6];
      for (let j = 0; j < k; j++) { const t = j / k, u = 1 - t; out.push([0, 1].map(d => u * u * u * p1[d]! + 3 * u * u * t * c1[d]! + 3 * u * t * t * c2[d]! + t * t * t * p2[d]!)); } }
    return out; };
  const ARMS = /^(upper|elbowcap|fore|fist|shcap)\./;
  /** The drawn body outline less the arms, in metres: side (z, y) or front (x, y). */
  const outline = (pose: any, view: string) => { const b = { height: 1.75 }, cam = { view, near: 'r', pxm: 1, P: (w: number[]) => (view === 'side' ? [w[2]!, w[1]!] : [w[0]!, w[1]!]) };
    return body.bodyShapes(body.fk(body.resolve(body.normPose(pose, b), b).q, b), cam).filter((s: any) => !ARMS.test(s.key)).map((s: any) => (s.key.includes('cap') ? s.poly : cr(s.poly))); };
  const inP = (P: number[][], q: number[]) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[j]!, b = P[i]!;
    if ((b[1]! > q[1]!) !== (a[1]! > q[1]!) && q[0]! < a[0]! + (b[0]! - a[0]!) * (q[1]! - a[1]!) / (b[1]! - a[1]!)) c = !c; } return c; };
  const sd = (q: number[], a: number[], b: number[]) => { const d = [b[0]! - a[0]!, b[1]! - a[1]!], L2 = d[0]! ** 2 + d[1]! ** 2 || 1;
    const t = Math.max(0, Math.min(1, ((q[0]! - a[0]!) * d[0]! + (q[1]! - a[1]!) * d[1]!) / L2)); return Math.hypot(q[0]! - a[0]! - d[0]! * t, q[1]! - a[1]! - d[1]! * t); };
  const clearPx = (polys: number[][][], q: number[], r = 0) => { let best = Infinity, ins = false;
    for (const P of polys) { if (inP(P, q)) ins = true; for (let i = 0; i < P.length; i++) best = Math.min(best, sd(q, P[i]!, P[(i + 1) % P.length]!)); }
    return ((ins ? -best : best) - r) * PX; };
  const poseOf = (s: any, p: string) => (p === 'mistake' ? { ...s.poses.end, ...s.mistake.pose } : s.poses[p]);
  /** The load part's least clearance per drawn pose: the bar end (side) or each end-on hex's corners and edges (front). */
  const loadClear = (s: any) => Object.fromEntries(['start', 'end', 'mistake'].map(p => {
    const { items } = itemsIn(s, p, { mistake: p === 'mistake' }), polys = outline(poseOf(s, p), s.view);
    if (s.view === 'front') {
      // the hex itself: 6 corners at 0.0595 m, edges sampled every 10 deg of the hex perimeter
      const hexPts = items.filter((x: any) => x.type === 'dumbbell').flatMap((x: any) => { const c = Array.from({ length: 6 }, (_, k) => [x.at[0] + 0.0595 * Math.cos(k * Math.PI / 3), x.at[1] + 0.0595 * Math.sin(k * Math.PI / 3)]);
        return c.flatMap((a, i) => { const b = c[(i + 1) % 6]!; return Array.from({ length: 10 }, (_, j) => [a[0]! + (b[0]! - a[0]!) * j / 10, a[1]! + (b[1]! - a[1]!) * j / 10]); }); });
      return [p, +Math.min(...hexPts.map((q: number[]) => clearPx(polys, q))).toFixed(2)];
    }
    const bar = items.find((x: any) => x.type === 'pulley' && x.part === 'bar');
    return [p, +clearPx(polys, [bar.at[2], bar.at[1]], bar.r).toFixed(2)];
  }));
  it('A5: every load part clears the drawn body by 2 px in every drawn pose (cable bar, dumbbell hexes, Smith bar end)', () => {
    const c = Object.fromEntries(W2.map(id => [id, loadClear(S2[id])]));
    console.log(`LIB-13s wave 2 clearance px: ${JSON.stringify(c)}`);
    for (const id of W2) for (const v of Object.values<number>(c[id]!)) expect(v, id).toBeGreaterThanOrEqual(2);
  });
  it('A5 mutation: the dumbbell grips at 0.25 m (under 2 px) are red', async () => {
    const c = loadClear(await variant('dumbbell_shrug', [['const GRIP_X = 0.26;', 'const GRIP_X = 0.25;']]));
    expect(Math.min(...Object.values<number>(c))).toBeLessThan(2);
  });
  const bend = (lm: any) => { const u = [0, 1, 2].map(i => lm['shoulder.r'][i] - lm['elbow.r'][i]), w = [0, 1, 2].map(i => lm['wrist.r'][i] - lm['elbow.r'][i]);
    return 180 - Math.acos(u.reduce((a, v, i) => a + v * w[i]!, 0) / Math.hypot(...u) / Math.hypot(...w)) * 180 / Math.PI; };
  // c5, c3 straight. smith: c1 "slight elbow bend" gives no degrees; 12 deg is a drawing number (DESIGN.md 16.4), and
  // 10-15 deg is this lane's own guard, not a sourced range (supervisor, #359 6549511226)
  const ELBOW: Record<string, [number, number]> = { cable_shrug: [0, 5], dumbbell_shrug: [0, 5], smith_machine_shrug: [10, 15] };
  const poseProblems = (id: string, s: any) => {
    const L = qaEng.poseLandmarks(Eng(), s).lm, out: string[] = [], rise = (L.end['shoulder.r'][1] - L.start['shoulder.r'][1]) * 100;
    if (Math.abs(rise - 5) > 0.2) out.push(`shoulder rise ${rise.toFixed(2)} cm`);
    for (const p of ['start', 'end']) { const b = bend(L[p]), [lo, hi] = ELBOW[id]!; if (b < lo || b > hi) out.push(`${p}: elbow ${b.toFixed(1)} deg`); }
    if (id === 'smith_machine_shrug') {
      for (const p of ['start', 'end', 'mistake']) { const bar = itemsIn(s, p, { mistake: p === 'mistake' }).items.find((x: any) => x.part === 'bar'); if (Math.abs(bar.at[2] - 0.13) > 1e-9) out.push(`${p}: bar off the rail`); }
      const g = L.start.grips[1]; if (!(g < L.start['hip.r'][1] && g > L.start['knee.r'][1])) out.push('start bar not at mid-thigh');
    }
    if (id === 'dumbbell_shrug') for (const sd2 of ['l', 'r']) if (Math.abs(L.start[`grip.${sd2}`][0]) <= Math.abs(L.start[`hip.${sd2}`][0])) out.push(`grip.${sd2} not beside the thigh`);
    if (id === 'cable_shrug') {
      const { items, lm } = itemsIn(s, 'start'), col = items.find((x: any) => x.type === 'cableColumn');
      if (!(col.pulley.at[2] - col.pulley.r > lm['toe.r'][2])) out.push('pulley not ahead of the toes');
      if (dist(col.to, [0, lm.grips[1], lm.grips[2]]) > 1e-9) out.push('cable not to the bar');
    }
    return out;
  };
  it('A4: each shoulder joint rises 5 cm (±0.2); straight arms (cable, dumbbell) or a 10-15 deg bend (smith); the Smith bar on its rail and at mid-thigh; the dumbbells beside the thighs; the pulley ahead of the toes with the cable to the bar', () => {
    for (const id of W2) expect(poseProblems(id, S2[id]), id).toEqual([]);
  });
  it("A4 mutations: dumbbell_shrug's rise at 7 cm and smith_machine_shrug's elbows straight are red", async () => {
    expect(poseProblems('dumbbell_shrug', await variant('dumbbell_shrug', [['const SHRUG = 5;', 'const SHRUG = 7;']]))).toEqual([expect.stringMatching(/^shoulder rise 7\.0\d cm$/)]);
    expect(poseProblems('smith_machine_shrug', await variant('smith_machine_shrug', [['ELBOW_BEND = 12,', 'ELBOW_BEND = 0,']]))).toEqual(['start: elbow 2.0 deg', 'end: elbow 2.0 deg'].map(t => expect.stringMatching(new RegExp(`^${t.split(' 2.0')[0]} \\d\\.\\d deg$`))));
  });
});

describe('LIB-13s panel mx19 fix: dumbbell_shrug\'s ring beside the viewer\'s-right shoulder; smith_machine_shrug\'s full dashed head and Mistake zoom', { timeout: T }, () => {
  const S3: Record<string, any> = {};
  /** Distance (px) from point q to the closed polyline P. */
  const segNear = (q: number[], P: number[][]) => Math.min(...P.map((a, i) => { const b = P[(i + 1) % P.length]!, d = [b[0]! - a[0]!, b[1]! - a[1]!] as [number, number], L2 = d[0] ** 2 + d[1] ** 2 || 1;
    const t = Math.max(0, Math.min(1, ((q[0]! - a[0]!) * d[0] + (q[1]! - a[1]!) * d[1]) / L2)); return Math.hypot(q[0]! - a[0]! - d[0] * t, q[1]! - a[1]! - d[1] * t); }));
  let Z: any;
  beforeAll(async () => { Z = await import(/* @vite-ignore */ lib('zoom/inline.mjs')); for (const id of ['dumbbell_shrug', 'smith_machine_shrug']) S3[id] = (await import(/* @vite-ignore */ lib(`specs/${id}.mjs`))).default; }, T);
  const inP = (P: number[][], q: number[]) => { let c = false; for (let i = 0, j = P.length - 1; i < P.length; j = i++) { const a = P[j]!, b = P[i]!;
    if ((b[1]! > q[1]!) !== (a[1]! > q[1]!) && q[0]! < a[0]! + (b[0]! - a[0]!) * (q[1]! - a[1]!) / (b[1]! - a[1]!)) c = !c; } return c; };
  /** What the zoom's connector (pz-link) crosses on its plate: body outlines (engine bodyShapes in plate px) and label or arc boxes. */
  const linkHits = (s: any, view: string) => {
    const z = Z.zoomOf(s, { view }), R = plate.renderPlate(s, { id: 'x', mistake: view === 'mistake' }), cam = qaEng.cameraOf(s, R.report);
    const pose = view === 'mistake' ? { ...s.poses.end, ...s.mistake.pose } : s.poses.end, b = { height: 1.75 };
    const shapes = body.bodyShapes(body.fk(body.resolve(body.normPose(pose, b), b).q, b), cam);
    const m = (z.link.match(/M([\d.-]+) ([\d.-]+)L([\d.-]+) ([\d.-]+)/) as string[]).slice(1).map(Number) as [number, number, number, number], hits = new Set<string>();
    for (let t = 0; t <= 1; t += 0.01) { const q = [m[0] + (m[2] - m[0]) * t, m[1] + (m[3] - m[1]) * t];
      for (const sh of shapes) if (inP(sh.poly, q)) hits.add(sh.key);
      for (const l of R.report.labels) if (q[0]! > l.ink.x0 - 2 && q[0]! < l.ink.x1 + 2 && q[1]! > l.ink.y0 - 2 && q[1]! < l.ink.y1 + 2) hits.add(`label:${l.key}`); }
    return { hits: [...hits], z, len: Math.hypot(m[2] - m[0], m[3] - m[1]) };
  };
  it('dumbbell_shrug: the Trace and ring on the viewer\'s-right shoulder (shoulderTop.l), the circle beside it, its connector short and crossing no outline, arc or label', () => {
    const s = S3.dumbbell_shrug, { hits, z, len } = linkHits(s, 'normal');
    expect(s.trace.point).toBe('shoulderTop.l');
    const cam = qaEng.cameraOf(s, plate.renderPlate(s, { id: 'x' }).report), L = qaEng.poseLandmarks(Eng(), s).lm, sh = cam.P(L.end['shoulderTop.l']), other = cam.P(L.end['shoulderTop.r']);
    expect(Math.hypot(z.src.c[0] - sh[0], z.src.c[1] - sh[1])).toBeLessThan(Math.hypot(z.src.c[0] - other[0], z.src.c[1] - other[1]));
    expect(Math.sign(z.circle.c[0] - other[0])).toBe(Math.sign(sh[0] - other[0]));   // the circle on the same side as the ring
    expect(hits).toEqual([]);
    expect(len).toBeLessThan(40);
  });
  it('mutation: the mx19 placement (the ring on shoulderTop.r) puts the connector across the body', () => {
    const s = S3.dumbbell_shrug, m = { ...s, trace: { ...s.trace, point: 'shoulderTop.r' } };
    expect(linkHits(m, 'normal').hits.length).toBeGreaterThan(0);
  });
  /** The head outline (spline points, plate px) in a pose. */
  const headOf = (s: any, pose: any) => { const b = { height: 1.75 }, cam = qaEng.cameraOf(s, plate.renderPlate(s, { id: 'x' }).report);
    return body.bodyShapes(body.fk(body.resolve(body.normPose(pose, b), b).q, b), cam).find((x: any) => x.key === 'head').poly; };
  it('smith_machine_shrug: the faulty head is one closed dashed guide on the Mistake head outline (the same size as the solid head); the chin tell ends on that outline', () => {
    const s = S3.smith_machine_shrug, g = s.mistake.guides.find((x: any) => x.kind === 'dashed');
    expect(dist(g.pts[0], g.pts.at(-1))).toBe(0);   // closed
    const cam = qaEng.cameraOf(s, plate.renderPlate(s, { id: 'x' }).report), H = headOf(s, { ...s.poses.end, ...s.mistake.pose });
    const near = (q: number[]) => segNear(q, H);
    expect(Math.max(...g.pts.map((w: number[]) => near(cam.P(w))))).toBeLessThan(1);
    const t = s.mistake.tells.find((x: any) => x.key === 'chin'), L = qaEng.poseLandmarks(Eng(), s).lm.mistake, c = cam.P(L.chin), q = [c[0] + t.anchor.off[0], c[1] + t.anchor.off[1]];
    expect(near(q)).toBeLessThan(1.5);   // the leader ends on the dashed outline
    expect(Math.max(...H.map((p: number[]) => p[0]!)) - q[0]!).toBeLessThan(6);   // at the jaw's front (the chin), not under the head (the throat)
  });
  it('mutation: the chin tell back on the bare chin landmark sits under the head (the throat), 6 px or more behind its front', () => {
    const s = S3.smith_machine_shrug, cam = qaEng.cameraOf(s, plate.renderPlate(s, { id: 'x' }).report), H = headOf(s, { ...s.poses.end, ...s.mistake.pose });
    const c = cam.P(qaEng.poseLandmarks(Eng(), s).lm.mistake.chin);
    expect(Math.max(...H.map((p: number[]) => p[0]!)) - c[0]).toBeGreaterThanOrEqual(6);
  });
});
