// LIB-15 (lib-15-card Do 2, Do 4, Do 5, Do 6 a; acceptance A2, A3, A5, A7-A11, A15, A16; rulings D-LIB15-* and
// lib4-cards 12-31): the LB5 build-ahead plates. Node only: the browser half of the plate QA runs in
// tools/plates/library/lb5/qa.mjs. Every test reads what is drawn (the items a spec emits, the engine's landmarks and
// report), never a helper's own maths.
import { cpSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const LB5 = ['overhead_cable_triceps_extension', 'dumbbell_overhead_triceps_extension', 'cross_body_hammer_curl', 'cable_curl', 'bayesian_cable_curl',
  'preacher_curl', 'incline_dumbbell_curl', 'concentration_curl', 'wrist_curl'];
const IDS = LB5.map(i => `lib_${i}`);
// The 10 LB5 ids not in this card (plan 6.2 :739-743): never an LB5 row here.
const OTHER = ['triceps_pushdown', 'rope_triceps_pushdown', 'straight_bar_triceps_pushdown', 'single_arm_triceps_pushdown', 'dumbbell_biceps_curl',
  'alternating_dumbbell_curl', 'barbell_curl', 'ez_bar_curl', 'hammer_curl', 'reverse_curl'];
const ROWS = 'tools/plates/library/lb5/rows.json';
const RESEARCH_HEAD = 'baf2ff09cf2e91232f536cfc6c766fdf68925217';   // F-LB5-2 (#302): concentration_curl's c14 and notes
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const SLICE = ['overhead_cable_triceps_extension', 'preacher_curl', 'wrist_curl', 'cross_body_hammer_curl'];
const F7_IDS = ['cross_body_hammer_curl', 'incline_dumbbell_curl', 'wrist_curl'];
const F2_IDS = ['concentration_curl', 'wrist_curl'];
// Held ids (DESIGN.md section 13; #290 6340022161, 6340075388): drawn as is, in no rows file and on no QA'd page.
const HELD = ['wrist_curl', 'cross_body_hammer_curl', 'overhead_cable_triceps_extension', 'dumbbell_overhead_triceps_extension'];
/** The LB5 ids whose spec file exists (drawn or held). */
const specced = () => LB5.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`));
/** The LB5 ids whose spec file exists and that are not held (drawn), in LB5 order. */
const drawn = () => LB5.filter(id => existsSync(`tools/plates/library/specs/${id}.mjs`) && !HELD.includes(id));
const pilotAOnMain = () => existsSync('tools/plates/library/eq/inclineBench.mjs');

let reg: any, eng: any, body: any, qaNode: any, qaEng: any, qaIdx: any, plate: any, closure: any, pad: any;
const M: Record<string, any> = {}, S: Record<string, any> = {};
beforeAll(async () => {
  [reg, eng, body, qaNode, qaEng, qaIdx, plate, closure, pad] = await Promise.all([
    'registry.mjs', 'engine.mjs', '../vendor/engine/body.mjs', 'qa/node.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../vendor/engine/plate.mjs',
    'inputs-closure.mjs', 'eq/preacherPad.mjs',
  ].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of specced()) { M[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`)); S[id] = M[id].default; }
}, T);

const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eng.PRIMITIVES, body });
const posesOf = (spec: any) => ['start', 'end', ...(spec.mistake?.pose ? ['mistake'] : [])];
/** Every equipment item a spec draws in one pose (functions called as the engine calls them). */
const itemsIn = (spec: any, pose: string, { mistake = false } = {}) => {
  const L = qaEng.poseLandmarks(Eng(), spec), lm = L.lm[pose] ?? null;
  const ctx = { pose, start: L.lm.start, mistake: mistake || pose === 'mistake', body: L.body };
  const out: any[] = [];
  spec.equipment.forEach((e: any, i: number) => {
    for (const one of [].concat(typeof e === 'function' ? e(lm, ctx) ?? [] : e)) if (one) out.push({ ...(one as any), entry: i });
  });
  return { items: out, lm };
};
const h9 = (spec: any) => {
  let R: any = null;
  try { R = { normal: plate.renderPlate(spec, { id: 'x-n' }), mistake: plate.renderPlate(spec, { id: 'x-m', mistake: true }) }; } catch { R = null; }
  return qaNode.h9({ spec, plate: { prefix: 'x' } }, { engine: Eng(), envelope: qaIdx.loadPins().envelope }, R).map((p: any) => p.key);
};
/** The plate camera as drawn (fit cameras are solved by the engine): world -> plate px. */
const camOf = (spec: any) => {
  const c = plate.renderPlate(spec, { id: 'x' }).report.camera;
  const P = spec.view === 'front' ? (w: number[]) => [c.x0 + w[0]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM] : (w: number[]) => [c.x0 + w[2]! * c.pxPerM, c.y0 - w[1]! * c.pxPerM];
  return { view: spec.view, near: 'r', pxm: c.pxPerM, P };
};
const poseObj = (spec: any, pose: string) => (pose === 'mistake' ? { ...spec.poses.end, ...spec.mistake.pose } : spec.poses[pose]);
const shapesIn = (spec: any, pose: string, cam = camOf(spec)) => {
  const b = { height: 1.75 };
  return body.bodyShapes(body.fk(body.resolve(body.normPose(poseObj(spec, pose), b), b).q, b), cam).filter((x: any) => x.poly);
};
const inPoly = (poly: number[][], [x, y]: number[]) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i]!, [xj, yj] = poly[j]!; if ((yi! > y!) !== (yj! > y!) && x! < (xj! - xi!) * (y! - yi!) / (yj! - yi!) + xi!) c = !c; } return c; };
const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy, t = L2 ? Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2)) : 0; return Math.hypot(p[0]! - a[0]! - dx * t, p[1]! - a[1]! - dy * t); };
/** Signed px distance of a screen point from a set of polygons: > 0 outside. */
const outside = (polys: number[][][], p: number[]) => { let d = Infinity, inn = false; for (const P of polys) { if (inPoly(P, p)) inn = true; for (let i = 0; i < P.length; i++) d = Math.min(d, segD(p, P[i]!, P[(i + 1) % P.length]!)); } return inn ? -d : d; };

describe('LIB-15 A5: lb5/rows.json holds exactly the drawn, non-held LB5 ids', () => {
  const rowKeys = (text: string) => [...text.matchAll(/^ {2}"(lib_[a-z0-9_]+)": \{/gm)].map(m => m[1]);
  const a5 = (text: string, want: string[]) => {
    const keys = rowKeys(text), bad: string[] = [];
    for (const id of want) if (keys.filter(k => k === id).length !== 1) bad.push(`${id} x${keys.filter(k => k === id).length}`);
    for (const k of keys) if (!want.includes(k!)) bad.push(`extra ${k}`);
    const j = JSON.parse(text);
    for (const [id, r] of Object.entries<any>(j.rows)) if (r.mode !== 'H') bad.push(`${id}: mode ${r.mode}`);
    if (!pilotAOnMain() && keys.includes('lib_incline_dumbbell_curl')) bad.push('incline_dumbbell_curl before pilot A is on main');
    return bad;
  };
  const want = () => drawn().map(i => `lib_${i}`);
  it('each drawn id exactly once in the raw text, nothing else, every row H; none of the 10 other LB5 ids in any lb5/ file', () => {
    expect(a5(readFileSync(ROWS, 'utf8'), want())).toEqual([]);
    for (const f of readdirSync('tools/plates/library/lb5')) {
      const text = readFileSync(join('tools/plates/library/lb5', f), 'utf8');
      for (const id of OTHER) expect(new RegExp(`"lib_${id}"\\s*:`).test(text), `${f}: ${id} as a row`).toBe(false);
    }
  });
  it('incline_dumbbell_curl is drawn only once pilot A is on main (D-LIB15-INCLINE)', () => {
    if (!pilotAOnMain()) expect(existsSync('tools/plates/library/specs/incline_dumbbell_curl.mjs')).toBe(false);
  });
  it('mutations: a dropped row, a duplicated row, a held id, rope_triceps_pushdown, incline_dumbbell_curl without pilot A and a D row are red', () => {
    const row = { src: 'library/specs/x.mjs', mode: 'H', stage: 'drawing', view: 'side' };
    const j = { batch: 'LB5', rows: { lib_preacher_curl: row, lib_wrist_curl: row } }, w = ['lib_preacher_curl', 'lib_wrist_curl'];
    const text = JSON.stringify(j, null, 1);
    expect(a5(text, w)).toEqual([]);
    expect(a5(JSON.stringify({ ...j, rows: { lib_preacher_curl: row } }, null, 1), w)).toEqual(['lib_wrist_curl x0']);
    const dup = text.replace('  "lib_preacher_curl": {', `  "lib_preacher_curl": ${JSON.stringify(row)},\n  "lib_preacher_curl": {`);
    expect(a5(dup, w)).toEqual(['lib_preacher_curl x2']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_cable_curl: row } }, null, 1), w)).toEqual(['extra lib_cable_curl']);   // as if held
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_rope_triceps_pushdown: row } }, null, 1), w)).toEqual(['extra lib_rope_triceps_pushdown']);
    if (!pilotAOnMain()) expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_incline_dumbbell_curl: row } }, null, 1), [...w, 'lib_incline_dumbbell_curl'])).toEqual(['incline_dumbbell_curl before pilot A is on main']);
    expect(a5(JSON.stringify({ ...j, rows: { ...j.rows, lib_wrist_curl: { ...row, mode: 'D' } } }, null, 1), w)).toEqual(['lib_wrist_curl: mode D']);
  });
  it('every row points at its own spec file and carries the census view; batch LB5, censusRef 4a9fd86', () => {
    const j = readJson(ROWS);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      expect(r.src).toBe(`library/specs/${id.slice(4)}.mjs`);
      expect(r.chromeId).toBe(id.slice(4).replace(/_/g, '-'));
      expect(r.view).toBe(id === 'lib_cross_body_hammer_curl' ? 'front' : 'side');
      expect([r.parent, r.template, r.params], id).toEqual([undefined, undefined, undefined]);
    }
    expect(j).toMatchObject({ batch: 'LB5', censusRef: '4a9fd86' });
  });
  it('each held id is in DESIGN.md\'s held table with its ruling and in no rows file', () => {
    const table = readFileSync('tools/plates/library/lb5/DESIGN.md', 'utf8').split('## 13. Held ids')[1]!.split('\n## ')[0]!;
    for (const id of HELD) {
      expect(new RegExp(`^\\| ${id} \\| [^|]*D-LIB[^|]+ \\|`, 'm').test(table), id).toBe(true);
      expect(readFileSync(ROWS, 'utf8').includes(`lib_${id}`), id).toBe(false);
    }
  });
});

describe('LIB-15 A9: nothing ships (D-LIB15-AHEAD)', { timeout: T }, () => {
  const stageProblems = (rows: Record<string, any>) => Object.entries(rows).filter(([, r]) => !['drawing', 'review'].includes(r.stage)).map(([id, r]) => `${id}: ${r.stage}`);
  const someRow = { src: 'library/specs/preacher_curl.mjs', slug: 'preacher-curl', prefix: 'preacher-curl', chromeId: 'preacher-curl', mode: 'H', stage: 'drawing', view: 'side' };
  it('every LB5 row is at stage drawing or review', () => {
    expect(stageProblems(readJson(ROWS).rows)).toEqual([]);
  });
  it('mutations: one row set to shipped and one to approved-plate are red', () => {
    const rows = { ...readJson(ROWS).rows, lib_preacher_curl: someRow };
    expect(stageProblems({ ...rows, lib_preacher_curl: { ...someRow, stage: 'shipped' } })).toEqual(['lib_preacher_curl: shipped']);
    expect(stageProblems({ ...rows, lib_preacher_curl: { ...someRow, stage: 'approved-plate' } })).toEqual(['lib_preacher_curl: approved-plate']);
  });
  it('no LB5 id is shipped, even with lb5/rows.json read as a batch file', () => {
    const rows = reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, readJson(ROWS)]] });
    expect(rows.filter((r: any) => IDS.includes(r.id)).length).toBe(drawn().length);
    expect(reg.shippedIds(rows).filter((i: string) => IDS.includes(i))).toEqual([]);
  });
  /** An id or its slug as a whole token in a file's name or text. */
  const tokenHits = (ids: string[], name: string, text: string, { substring = false } = {}) => ids.flatMap(id => {
    const slug = id.replace(/_/g, '-'), s = `${name}\n${text}`, out: string[] = [];
    if (substring ? s.includes(id) : new RegExp(`\\b(lib_)?${id}\\b`).test(s)) out.push(`${name}: ${id}`);
    if (substring ? s.includes(slug) : new RegExp(`(^|[^a-z0-9-])${slug}([^a-z0-9-]|$)`).test(s)) out.push(`${name}: ${slug}`);
    return out;
  });
  const batchProblems = (files: [string, string][]) => files.flatMap(([f, text]) => [
    ...(/lb5/i.test(f) ? [`${f}: an LB5 batch file name`] : []),
    ...(/"batch"\s*:\s*"LB5"/.test(text) ? [`${f}: names batch LB5`] : []),
    ...tokenHits(LB5, f, text),
  ]);
  const dirFiles = (dir: string): [string, string][] => (existsSync(dir) ? readdirSync(dir).map(f => [f, readFileSync(join(dir, f), 'utf8')]) : []);
  it('no LB5 H id, slug or batch is in any tools/plates/library/batches/ file', () => {
    expect(batchProblems(dirFiles('tools/plates/library/batches'))).toEqual([]);
  });
  it('no LB5 H id, slug or batch is in tests/howto/golden/library/', () => {
    expect(batchProblems(dirFiles('tests/howto/golden/library'))).toEqual([]);
  });
  it('mutations: rows.json copied into batches/, a golden file naming an LB5 H id, a page-only lb5.json and preacher-curl.layers.html are red', () => {
    const rowsText = JSON.stringify({ batch: 'LB5', rows: { lib_preacher_curl: someRow } }, null, 1);
    expect(batchProblems([['zz.json', rowsText]]).length).toBeGreaterThanOrEqual(2);
    expect(batchProblems([['x.json', '{"id":"lib_concentration_curl"}']])).toEqual(['x.json: concentration_curl']);
    expect(batchProblems([['lb5.json', '{"entries":[{"kind":"page","batch":"LB5"}]}']]).length).toBe(2);
    expect(batchProblems([['preacher-curl.layers.html', '<div data-id="preacher-curl"></div>']])).toEqual(['preacher-curl.layers.html: preacher-curl']);
  });
  it('control: a file naming only lib_dumbbell_biceps_curl, lib_rope_triceps_pushdown and lib_hammer_curl (LB5, not in this card) stays green', () => {
    expect(batchProblems([['p.json', '{"rows":{"lib_dumbbell_biceps_curl":{},"lib_rope_triceps_pushdown":{},"lib_hammer_curl":{}}}']])).toEqual([]);
  });
  it('the matcher is exact: over exercises.json only lib_bayesian_cable_curl contains one of the 9 (cable_curl) besides its own id; the cable_curl matcher misses it; a plain substring test does not', () => {
    const ex = readJson('src/data/exercises.json').map((e: any) => e.id as string);
    const hits = ex.flatMap((e: string) => LB5.filter(id => e !== `lib_${id}` && e.includes(id)).map(id => `${e} ⊃ ${id}`));
    expect(hits).toEqual(['lib_bayesian_cable_curl ⊃ cable_curl']);
    for (const id of IDS) expect(ex, id).toContain(id);
    expect(tokenHits(['cable_curl'], 'p.json', '{"lib_bayesian_cable_curl":1,"x":"bayesian-cable-curl"}')).toEqual([]);
    // mutation: the cable_curl matcher swapped for a plain substring test turns the bayesian row red
    expect(tokenHits(['cable_curl'], 'p.json', '{"lib_bayesian_cable_curl":1}', { substring: true })).toEqual(['p.json: cable_curl']);
  });
  it('no LB5 spec, composer, How-to, script or test imports anything under hands/', () => {
    const files = [...specced().map(i => `tools/plates/library/specs/${i}.mjs`), 'tools/plates/library/eq/preacherPad.mjs',
      ...LB5.map(i => `tools/plates/library/howto/lib_${i}.howto.mjs`), 'tools/plates/library/lb5/build.mjs', 'tools/plates/library/lb5/qa.mjs', 'tests/howto/lb5-plates.test.ts'];
    for (const f of files) expect(readFileSync(f, 'utf8'), f).not.toMatch(/from\s+['"][^'"]*\/hands\/|import\(\s*[^)]*\/hands\//);
  });
  it('generate --check is green, and no generated file is read from lb5/, the LB5 specs, the composer or How-to sources', async () => {
    const gen = await import(/* @vite-ignore */ new URL('../../tools/plates/generate.mjs', import.meta.url).href);
    const t0 = Date.now(), out = await gen.render();
    expect(gen.diff(out)).toEqual([]);
    console.log(`LIB-15 A9: generate --check render took ${((Date.now() - t0) / 1000).toFixed(1)} s`);
    for (const [p, { text }] of out) {
      expect(text, p).not.toMatch(/library\/lb5\/|preacherPad/);
      for (const id of LB5) expect(text, p).not.toMatch(new RegExp(`library/(specs|howto)/(lib_)?${id}\\b`));
    }
  });
});

describe('LIB-15 A11 (Do 6 a): the 9 cards and quotes are byte copies of the LB5 research head', () => {
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardsSha = readJson('tools/plates/library/lb5/cards.sha.json');
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it(`cards.sha.json names research head ${RESEARCH_HEAD.slice(0, 8)} and the 9 ids; each card (without the three keys) and each quotes file matches`, () => {
    expect(cardsSha.researchHead).toBe(RESEARCH_HEAD);
    expect(Object.keys(cardsSha.cards)).toEqual(LB5);
    expect(Object.keys(cardsSha.quotes)).toEqual(LB5);
    for (const id of LB5) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
    }
  });
  it('mutation: any other card key edited is red', () => {
    const c = cardOf('preacher_curl'); c.plate.view = 'front';
    expect(sha(canon(c))).not.toBe(cardsSha.cards.preacher_curl);
  });
  it('the How-to source of each LB5 id holds only its id and research card (D-LIB9a-HOWTOID)', async () => {
    for (const id of LB5) {
      const h = (await import(/* @vite-ignore */ lib(`howto/lib_${id}.howto.mjs`))).default;
      expect(h, id).toEqual({ id: `lib_${id}`, research: { card: `docs/research/howto/cards/${id}.json` } });
    }
  });
});

describe('LIB-15 A2 / Do 4: the preacherPad composer and the drawn plates draw PRIMITIVES only', { timeout: T }, () => {
  it('the composer source imports no file reader and nothing under tools/plates/layers/', () => {
    const src = readFileSync('tools/plates/library/eq/preacherPad.mjs', 'utf8');
    expect(src).not.toMatch(/node:fs|readFileSync|require\(|fetch\(/);
    expect(src).not.toMatch(/layers\//);
  });
  it('every item each drawn plate draws is a PRIMITIVES type, in every drawn pose', () => {
    for (const id of specced()) for (const pose of posesOf(S[id]))
      for (const it of itemsIn(S[id], pose).items) expect(Object.keys(eng.PRIMITIVES), `${id} ${pose}`).toContain(it.type);
  });
  it('the drawn plates pass PQ-H9', () => {
    for (const id of specced()) expect(h9(S[id]), id).toEqual([]);
  });
  it('mutation: an item of an unknown type ({type: wedge}) turns H9.type red', () => {
    const s = S.preacher_curl;
    expect(h9({ ...s, equipment: [...s.equipment, { type: 'wedge', at: [0, 0, 0] }] }).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
  it('the engine draws each drawn plate with no engine issue and every check and contact within its tolerance', () => {
    for (const id of specced()) {
      const r = plate.renderPlate(S[id], { id: 'x' }).report;
      expect(r.issues ?? [], id).toEqual([]);
      for (const c of r.checks) if ('cm' in c) expect(c.cm, `${id} ${c.landmark} ${c.pose}`).toBeLessThanOrEqual(0.5);
      for (const p of Object.values<any>(r.contacts)) for (const c of p) expect(c.errCm, `${id} ${c.kind}`).toBeLessThanOrEqual(0.5);
    }
  });
});

describe('LIB-15 A2: the preacherPad on preacher_curl, per drawn pose (13.1, D-LIB13-FACTS2)', { timeout: T }, () => {
  const padOf = (spec: any, pose: string) => itemsIn(spec, pose).items.find((it: any) => it.type === 'poly' && it.entry === spec.equipment.findIndex((e: any, i: number) => typeof e === 'function' && [].concat(e(itemsIn(spec, pose).lm, { pose }) ?? []).some((x: any) => x?.type === 'poly')));
  /** The arm face: the pad poly's first edge (top edge -> the face's low end). */
  const faceOf = (spec: any, pose: string) => { const p = padOf(spec, pose); return { top: p.pts[0], lo: p.pts[1], pts: p.pts }; };
  const ARM_R = () => eng.RADII.elbowCap * 1.75;
  /** The elbow joint's distance (m, side plane) from the drawn arm face line, less the elbow cap radius: 0 = the back of the arm on the pad. */
  const gap = (spec: any, pose: string) => {
    const { top, lo } = faceOf(spec, pose), e = itemsIn(spec, pose).lm['elbow.r'];
    const u = [lo[1] - top[1], lo[2] - top[2]], L = Math.hypot(u[0]!, u[1]!), w = [e[1] - top[1], e[2] - top[2]];
    return Math.abs(u[0]! * w[1]! - u[1]! * w[0]!) / L - ARM_R();
  };
  const problems = (spec: any) => {
    const bad: string[] = [], cam = camOf(spec), p0 = faceOf(spec, 'end').pts.map(cam.P);
    for (const pose of posesOf(spec)) {
      const p = faceOf(spec, pose).pts.map(cam.P);
      if (p.some((q: number[], i: number) => Math.hypot(q[0]! - p0[i]![0]!, q[1]! - p0[i]![1]!) > 1)) bad.push(`${pose}: pad moved`);
    }
    for (const pose of ['start', 'end']) if (Math.abs(gap(spec, pose)) > 0.005) bad.push(`${pose}: upper arm ${(gap(spec, pose) * 100).toFixed(1)} cm off the pad`);
    if (!(gap(spec, 'mistake') >= 0.04)) bad.push(`mistake: upper arm only ${(gap(spec, 'mistake') * 100).toFixed(1)} cm off the pad`);
    return bad;
  };
  it('the pad sits at one fixed place (±1 px) in start, end and Mistake; the back of the upper arm is on its face in start and end (c1, c4) and off it in the Mistake (c5)', () => {
    expect(problems(S.preacher_curl)).toEqual([]);
  });
  it('the chest touches the pad\'s back face at the start, and the pad top sits under the armpit (c1, c2)', () => {
    const s = S.preacher_curl, { pts } = faceOf(s, 'start'), lm = itemsIn(s, 'start').lm, top = pts[0], back = pts[3];
    const u = [back[1] - top[1], back[2] - top[2]], L = Math.hypot(u[0]!, u[1]!), w = [lm.chest[1] - top[1], lm.chest[2] - top[2]];
    expect(Math.abs(u[0]! * w[1]! - u[1]! * w[0]!) / L).toBeLessThanOrEqual(0.005);
    // under the armpit: in the side view the top edge sits where the upper arm leaves the drawn torso outline (within
    // 1 cm of the torso's front contour), below the shoulder joint, under the upper arm's shoulder half
    const cam = camOf(s), torso = shapesIn(s, 'start', cam).filter((x: any) => x.key === 'torso').map((x: any) => x.poly);
    expect(Math.abs(outside(torso, cam.P(top)))).toBeLessThanOrEqual(cam.pxm * 0.01);
    const S0 = lm['shoulder.r'], E0 = lm['elbow.r'], v = [E0[1] - S0[1], E0[2] - S0[2]], Lv = Math.hypot(v[0]!, v[1]!);
    const along = ((top[1] - S0[1]) * v[0]! + (top[2] - S0[2]) * v[1]!) / Lv;
    expect(top[1]).toBeLessThan(S0[1]);
    expect(along / Lv).toBeGreaterThanOrEqual(0);
    expect(along / Lv).toBeLessThanOrEqual(0.5);
  });
  it('mutations: the pad moved 2 cm in the Mistake, and the upper arm moved 2 cm off the pad in the end pose, are red', () => {
    const s = S.preacher_curl, k = s.equipment.findIndex((e: any) => typeof e === 'function' && [].concat(e(itemsIn(s, 'end').lm, { pose: 'end' }) ?? []).some((x: any) => x?.type === 'poly'));
    const moved = { ...s, equipment: s.equipment.map((e: any, i: number) => (i !== k ? e : (lm: any, ctx: any) => [].concat(e(lm, ctx) ?? []).map((x: any) => (ctx.pose === 'mistake' && x.type === 'poly' ? { ...x, pts: x.pts.map((q: number[]) => [q[0], q[1], q[2]! + 0.02]) } : x)))) };
    expect(problems(moved)).toEqual(['mistake: pad moved']);
    // the shoulder flexed so the elbow rises about 2 cm off the face: 2 cm over the upper arm's 32.6 cm is ~3.5 deg
    const end = { ...s.poses.end, shoulder: { ...s.poses.end.shoulder, flex: s.poses.end.shoulder.flex + 3.5 } };
    expect(problems({ ...s, poses: { ...s.poses, end } }).some(p => p.startsWith('end: upper arm'))).toBe(true);
  });
});

describe('LIB-15 A3: spec and composer closures are pure and drawn by the vendor engine', { timeout: T }, () => {
  const files = () => specced().map(i => `tools/plates/library/specs/${i}.mjs`);
  const problems = (f: string, c: string[]) => [
    ...(c.includes('tools/plates/vendor/MANIFEST.json') ? [] : ['no vendor MANIFEST']),
    ...c.filter(p => p.startsWith('tools/plates/layers/')),
    ...c.filter(p => p.startsWith('tools/plates/library/specs/') && p !== f),
    ...c.filter(p => p.startsWith('tools/plates/library/templates/')),
  ];
  it('every drawn LB5 spec passes', () => {
    expect(files().length).toBeGreaterThanOrEqual(2);
    for (const f of files()) expect(problems(f, closure.closureOf([f])), f).toEqual([]);
  });
  const scratch = (edit: (root: string) => void) => {
    const root = mkdtempSync(join(tmpdir(), 'lb5-closure-'));
    for (const d of ['tools/plates/library', 'tools/plates/vendor', 'tools/plates/layers', 'tools/plates/lib']) cpSync(d, join(root, d), { recursive: true });
    edit(root);
    return root;
  };
  const F = 'tools/plates/library/specs/preacher_curl.mjs';
  it('mutation: readFileSync added to the preacherPad composer makes closureOf throw', () => {
    const root = scratch(r => { const p = join(r, 'tools/plates/library/eq/preacherPad.mjs'); writeFileSync(p, `import { readFileSync } from 'node:fs';\nexport const X = () => readFileSync('x');\n${readFileSync(p, 'utf8')}`); });
    try { expect(() => closure.closureOf([F], root)).toThrow(/reads a file/); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing tools/plates/layers/engine/body.mjs is red', () => {
    const root = scratch(r => { const p = join(r, F); writeFileSync(p, `import '../../layers/engine/body.mjs';\n${readFileSync(p, 'utf8')}`); });
    try { expect(problems(F, closure.closureOf([F], root)).some(p => p.startsWith('tools/plates/layers/'))).toBe(true); } finally { rmSync(root, { recursive: true, force: true }); }
  });
  it('mutation: a spec importing a pilot A spec (another specs/ file) is red', () => {
    const root = scratch(r => {
      writeFileSync(join(r, 'tools/plates/library/specs/dumbbell_biceps_curl.mjs'), 'export const X = 1;\nexport default {};\n');
      const p = join(r, F); writeFileSync(p, `import { X as _x } from './dumbbell_biceps_curl.mjs';\n${readFileSync(p, 'utf8')}`);
    });
    try { expect(problems(F, closure.closureOf([F], root))).toEqual(['tools/plates/library/specs/dumbbell_biceps_curl.mjs']); } finally { rmSync(root, { recursive: true, force: true }); }
  });
});

describe('LIB-15 A16: no pilot A composer is copied or forked (D-LIB15-INCLINE; D-LIB10-NOTE Q2 2)', () => {
  // main's eq/ files at 5158609c, plus this card's composer; inclineBench.mjs arrives only with pilot A on main
  const MAIN_EQ = ['parts.mjs', 'rope.mjs'], OURS = ['preacherPad.mjs'];
  const eqProblems = (files: string[], texts: Record<string, string>) => {
    const want = [...MAIN_EQ, ...OURS, ...(pilotAOnMain() ? ['inclineBench.mjs'] : [])], bad: string[] = [];
    for (const f of files) if (!want.includes(f) && !(pilotAOnMain() && !OURS.includes(f) && !MAIN_EQ.includes(f) && f !== 'inclineBench.mjs' && !/inclineBench/.test(texts[f] ?? '') && !/export function inclineBench/.test(texts[f] ?? ''))) bad.push(`extra ${f}`);
    for (const [f, t] of Object.entries(texts)) if (f !== 'inclineBench.mjs' && /export function inclineBench|composer `inclineBench`/i.test(t)) bad.push(`${f}: a copy of inclineBench`);
    return bad;
  };
  const read = () => { const fs = readdirSync('tools/plates/library/eq'); return { fs, texts: Object.fromEntries(fs.map(f => [f, readFileSync(join('tools/plates/library/eq', f), 'utf8')])) }; };
  it('eq/ holds exactly main\'s files plus eq/preacherPad.mjs (and, once pilot A is on main, its own composers)', () => {
    const { fs, texts } = read();
    if (!pilotAOnMain()) expect([...fs].sort()).toEqual([...MAIN_EQ, ...OURS].sort());
    expect(eqProblems(fs, texts)).toEqual([]);
  });
  it('mutation: a copy of #109\'s inclineBench.mjs added under eq/ under another name is red', () => {
    const { fs, texts } = read();
    const copy = '// Composer `inclineBench` (pilot A)\nexport function inclineBench() { return []; }\n';
    expect(eqProblems([...fs, 'benchIncline.mjs'], { ...texts, 'benchIncline.mjs': copy }).length).toBeGreaterThan(0);
  });
  it('once pilot A is on main, incline_dumbbell_curl\'s spec imports ../eq/inclineBench.mjs', () => {
    const f = 'tools/plates/library/specs/incline_dumbbell_curl.mjs';
    if (existsSync(f)) expect(readFileSync(f, 'utf8')).toMatch(/from '\.\.\/eq\/inclineBench\.mjs'/);
  });
});

describe('LIB-15 A10: the LB5 plates page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds of the drawn LB5 ids are byte-identical', async () => {
    const build = await import(/* @vite-ignore */ lib('lb5/build.mjs'));
    expect(build.drawnIds().length).toBeGreaterThanOrEqual(2);
    const a = await build.buildLb5Page(), b = await build.buildLb5Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});

describe('LIB-15 A7: the tempo strips follow the cards (D-LIB15-SECS; DESIGN.md section 8, proposed)', () => {
  // The proposed table (DESIGN.md section 8), copied here, never read from tempo.json or a spec: phase name and source.
  const TABLE: Record<string, [string, string][]> = {
    overhead_cable_triceps_extension: [['Extend', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    dumbbell_overhead_triceps_extension: [['Press', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    cross_body_hammer_curl: [['Curl', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    cable_curl: [['Lower', 'down'], ['Curl', 'up']],
    bayesian_cable_curl: [['Curl', 'up'], ['Lower', 'down']],
    preacher_curl: [['Curl', 'up'], ['Lower', 'down']],
    incline_dumbbell_curl: [['Curl', 'up'], ['Lower', 'down']],
    concentration_curl: [['Curl', 'up'], ['Hold', 'pause'], ['Lower', 'down']],
    wrist_curl: [['Curl', 'up'], ['Lower', 'down']],
  };
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  const built = (rows: [string, string][], pt: any) => rows.flatMap(([phase, from]) => (from === 'pause' ? (pt.pause > 0 ? [{ phase, s: pt.pause }] : []) : [{ phase, s: pt[from], move: true }]));
  const problems = (tj: any, specs: Record<string, any>, table = TABLE) => {
    const bad: string[] = [];
    if (Object.keys(tj.constants).length) bad.push('constants: not empty');
    if (JSON.stringify(Object.keys(tj.ids).sort()) !== JSON.stringify([...LB5].sort())) bad.push('ids: not the 9');
    for (const id of LB5) {
      const t = tj.ids[id], pt = cardOf(id).plate.tempo;
      if (JSON.stringify(t?.rows?.map((r: any) => [r.phase, r.from])) !== JSON.stringify(table[id])) bad.push(`${id}: tempo.json rows != the table`);
      if (JSON.stringify(t?.claim) !== JSON.stringify(pt.claim)) bad.push(`${id}: claim`);
      const s = specs[id];
      if (!s) continue;
      if (JSON.stringify(s.tempo) !== JSON.stringify(built(table[id]!, pt))) bad.push(`${id}: spec tempo != the array built from the table and plate.tempo`);
      if (s.tempo.some((p: any) => p.phase === 'Rest')) bad.push(`${id}: Rest`);
      if (s.tempo.some((p: any) => p.phase === 'Hold') !== pt.pause > 0) bad.push(`${id}: Hold vs pause ${pt.pause}`);
    }
    return bad;
  };
  const tj = () => readJson('tools/plates/library/lb5/tempo.json');
  it('every card gives up and down in seconds (D-LIB15-SECS); tempo.json and every drawn spec follow the table', () => {
    for (const id of LB5) { const pt = cardOf(id).plate.tempo; expect([typeof pt.up, typeof pt.down, typeof pt.pause], id).toEqual(['number', 'number', 'number']); }
    expect(problems(tj(), { ...S })).toEqual([]);
  });
  it('mutations: a Hold added to a pause-0 card, overhead_cable_triceps_extension\'s Hold removed, wrist_curl\'s up set to 1 and a Rest phase are each red', () => {
    const red = (id: string, tempo: any[]) => problems(tj(), { ...S, [id]: { ...(S[id] ?? { id }), tempo } }).length > 0;
    expect(red('cable_curl', [{ phase: 'Lower', s: 2, move: true }, { phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }])).toBe(true);
    expect(red('overhead_cable_triceps_extension', S.overhead_cable_triceps_extension.tempo.filter((p: any) => p.phase !== 'Hold'))).toBe(true);
    expect(red('wrist_curl', S.wrist_curl.tempo.map((p: any) => (p.phase === 'Curl' ? { ...p, s: 1 } : p)))).toBe(true);
    expect(red('preacher_curl', [...S.preacher_curl.tempo, { phase: 'Rest', s: 1 }])).toBe(true);
  });
});

describe('LIB-15 A8: the drawable-fault ids (D-LIB15-F7)', { timeout: T }, () => {
  it('each drawn F7 id carries pilot.drawableFault, and the QA expectation names F7 for exactly these ids', async () => {
    const qa = await import(/* @vite-ignore */ lib('lb5/qa.mjs'));
    for (const id of specced()) {
      expect(typeof S[id].pilot?.drawableFault === 'string', id).toBe(F7_IDS.includes(id));
      expect(qa.EXPECTED(`lib_${id}`), id).toEqual(['F5', ...(F7_IDS.includes(id) ? ['F7'] : []), ...(F2_IDS.includes(id) ? ['F2'] : [])].sort());
    }
  });
  it('D-LIB15-F2: F2 is expected on exactly concentration_curl and wrist_curl (#290 6345185694, 6340022161); mutation: F2 raised on an id without the ruling (cable_curl) is red', async () => {
    const qa = await import(/* @vite-ignore */ lib('lb5/qa.mjs'));
    expect(qa.F2_IDS).toEqual(F2_IDS.map(i => `lib_${i}`));
    const report = (id: string, raised: string[]) => ({ id, flags: Object.fromEntries(['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7'].map(f => [f, { raised: raised.includes(f), value: f === 'F5' ? 3.57 : 0 }])) });
    expect(qa.flagProblems([report('lib_concentration_curl', ['F2', 'F5'])])).toEqual([]);
    expect(qa.flagProblems([report('lib_cable_curl', ['F2', 'F5'])])).toEqual(['lib_cable_curl: flags F2,F5 != ruled F5']);
  });
});

describe('LIB-15 A15: Mistakes, tells, cues, leaders and the R10 items, on drawn items (DESIGN.md sections 7, 9)', { timeout: T }, () => {
  const KEYS: Record<string, string> = { overhead_cable_triceps_extension: 'arch', dumbbell_overhead_triceps_extension: 'arch', cross_body_hammer_curl: 'shrug',
    cable_curl: 'straight', bayesian_cable_curl: 'swing', preacher_curl: 'lift', incline_dumbbell_curl: 'elbows', concentration_curl: 'knee', wrist_curl: 'lean' };
  const keyProblems = (spec: any) => (spec.mistake?.tells?.[0]?.key === KEYS[spec.id] ? [] : [`${spec.id}: first tell ${spec.mistake?.tells?.[0]?.key}`]);
  // One-tell plates: a second tell is drawn only if a claim states it (#290 6343211054 item 2); per-id ruling asked on #290.
  const ONE_TELL = ['overhead_cable_triceps_extension', 'dumbbell_overhead_triceps_extension', 'cable_curl', 'bayesian_cable_curl', 'concentration_curl'];
  /** #290 6349640307 R7: the Trace is one smooth arc: no turn between its consecutive sample chords over 6 deg or 2.5x their median. */
  const traceKinks = (spec: any) => {
    const d = /<path class="trace"[^>]* d="([^"]+)"/.exec(plate.renderPlate(spec, { id: 'x' }).svg)![1]!, n = [...d.matchAll(/-?[\d.]+/g)].map(m => +m[0]);
    const pts = [[n[0]!, n[1]!]]; for (let i = 2; i + 5 < n.length; i += 6) pts.push([n[i + 4]!, n[i + 5]!]);
    const turn: number[] = []; for (let i = 1; i + 1 < pts.length; i++) { const a = Math.atan2(pts[i]![1]! - pts[i - 1]![1]!, pts[i]![0]! - pts[i - 1]![0]!), b = Math.atan2(pts[i + 1]![1]! - pts[i]![1]!, pts[i + 1]![0]! - pts[i]![0]!); turn.push(Math.abs((((b - a) * 180 / Math.PI) + 540) % 360 - 180)); }
    const med = [...turn].sort((x, y) => x - y)[turn.length >> 1]!, max = Math.max(...turn);
    return max <= 6 && max <= 2.5 * med ? [] : [`${spec.id}: Trace turn ${max.toFixed(1)} deg (median ${med.toFixed(1)})`];
  };
  it('every Trace on a row is a smooth arc, no kinks (#290 6349640307 R7); mutation: concentration_curl\'s grip keys cut to 6 chords is red', () => {
    for (const id of drawn()) expect(traceKinks(S[id]), id).toEqual([]);   // rows only: held cross_body_hammer_curl's Trace (10.8 deg) is redrawn when it resumes
    const s = S.concentration_curl, v = s.poses.via, six = [8, 16, 24, 32, 40].map(i => v[i - 1]);
    expect(traceKinks({ ...s, poses: { ...s.poses, via: six } })).toHaveLength(1);
  });
  it('each ONE_TELL id has its D-LIB10-SKULL1 record in DESIGN.md section 9: fault, claim ids, "no second sign stated" (#290 6345185694)', () => {
    const sec = readFileSync('tools/plates/library/lb5/DESIGN.md', 'utf8').split('## 9.')[1]!.split('\n## ')[0]!;
    const rec = (text: string) => ONE_TELL.filter(id => !new RegExp(`^\\| ${id}(?: \\(held\\))? \\| [^|]+ \\| [^|]*c\\d+[^|]* \\| no second sign stated[^|]* \\|$`, 'm').test(text));
    expect(rec(sec)).toEqual([]);
    expect(rec(sec.replace('| cable_curl | arms fully extended at the bottom, the biceps', '| cable_curl_x | arms fully extended at the bottom, the biceps'))).toEqual(['cable_curl']);
  });
  it('each drawn plate has 2-3 tells (one on the ONE_TELL ids), the first carrying the proposed key; mutation: the tells swapped is red', () => {
    for (const id of specced()) { expect(keyProblems(S[id])).toEqual([]); expect(S[id].mistake.tells.length, id).toBeGreaterThanOrEqual(ONE_TELL.includes(id) ? 1 : 2); expect(S[id].mistake.tells.length, id).toBeLessThanOrEqual(ONE_TELL.includes(id) ? 1 : 3); }
    const s = S.preacher_curl;
    expect(keyProblems({ ...s, mistake: { ...s.mistake, tells: [...s.mistake.tells].reverse() } })).toEqual(['preacher_curl: first tell heave']);
  });
  /** Q-D5-6 cue table: every callout and tell cue is one sentence of at most 15 words with no semicolon. */
  const cueProblems = (spec: any) => [...spec.callouts, ...spec.mistake.tells].flatMap((c: any) => {
    const w = c.cue.split(/\s+/).filter(Boolean).length;
    return [...(w > 15 ? [`${c.key}: ${w} words`] : []), ...(/;/.test(c.cue) ? [`${c.key}: semicolon`] : [])];
  });
  it('cue table: every cue is 15 words or fewer, no semicolon; mutation: a 16-word cue is red', () => {
    for (const id of specced()) expect(cueProblems(S[id]), id).toEqual([]);
    const s = S.preacher_curl;
    expect(cueProblems({ ...s, callouts: [{ ...s.callouts[0], cue: 'Sit down with the top of the pad right under both of your armpits and chest on it.' }, ...s.callouts.slice(1)] })).toEqual(['armpits: 18 words']);
  });
  it('each callout is one of the card\'s 3 checkpoints, in the card order (labels may wrap with <br>)', () => {
    for (const id of specced()) {
      const c = readJson(`docs/research/howto/cards/${id}.json`);
      expect(S[id].callouts.map((x: any) => x.text.replace(/<br>/g, ' ').toLowerCase()), id).toEqual(c.plate.checkpoints.map((x: any) => x.label.toLowerCase()));
    }
  });
  /** 13.1, 13.4 must-fix 1: every solid red part (the Mistake arrows, as drawn in the Mistake svg) clears the solid end figure by >= 6 px. */
  const clearance = (spec: any) => {
    const polys = shapesIn(spec, 'end').map((x: any) => x.poly), svg = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
    return [...svg.matchAll(/<path class="m-arrow[^"]*" d="([^"]+)"/g)].flatMap(m => {
      const pts = [...m[1]!.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(x => [+x[1]!, +x[2]!]), samp: number[][] = [];
      for (let i = 0; i + 1 < pts.length; i++) for (let k = 0; k <= 20; k++) samp.push(pts[i]!.map((v, j) => v + (pts[i + 1]![j]! - v) * k / 20));
      const min = Math.min(...samp.map(p => outside(polys, p)));
      return min >= 6 ? [] : [`${spec.id}: arrow ${min.toFixed(1)} px from the end figure`];
    });
  };
  it('every Mistake arrow stays at least 6 px clear of the solid end figure; other Mistake guides are dashed', () => {
    for (const id of specced()) {
      expect(clearance(S[id]), id).toEqual([]);
      expect(S[id].mistake.guides.filter((g: any) => !['dashed', 'arrow'].includes(g.kind)).map((g: any) => g.kind), id).toEqual([]);
    }
  });
  it('mutation: a red Mistake arrow moved onto the end wrist (inside the 6 px clearance) is red', () => {
    const s = S.wrist_curl, guides = s.mistake.guides.map((g: any) => (g.kind === 'arrow' ? { ...g, from: { at: 'wrist.r', pose: 'end' } } : g));
    expect(clearance({ ...s, mistake: { ...s.mistake, guides } }).length).toBe(1);
  });
  // Leaders: no leader comes within 6 px of the Trace, a cable or the pad, away from its anchor end (8 px).
  const xy = (d: string) => [...d.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map(m => [+m[1]!, +m[2]!]);
  const segs = (p: number[][]) => p.slice(1).map((q, i) => [p[i]!, q]);
  const leaderGap = (spec: any) => {
    let min = Infinity;
    for (const mistake of [false, true]) {
      const r = plate.renderPlate(spec, { id: 'x', mistake }), svg: string = r.svg, cam = camOf(spec);
      const avoid = [...svg.matchAll(/<path class="(?:trace|eq-cable)[^"]*"[^>]*? d="([^"]+)"/g)].flatMap(m => segs(xy(m[1]!)));
      if (spec.id === 'preacher_curl') { const p = itemsIn(spec, mistake ? 'mistake' : 'end').items.find((it: any) => it.type === 'poly' && it.z === 'mid'); const q = p.pts.map(cam.P); avoid.push(...segs([...q, q[0]])); }
      for (const [, d] of svg.matchAll(/<path class="leader[^"]*" d="([^"]+)"/g)) {
        const p = xy(d!), h = /H(-?[\d.]+)$/.exec(d!); if (h) p.push([+h[1]!, p[p.length - 1]![1]!]);
        for (const [a, b] of segs(p)) for (let k = 0; k <= 40; k++) {
          const q = [a![0]! + (b![0]! - a![0]!) * k / 40, a![1]! + (b![1]! - a![1]!) * k / 40];
          if (Math.hypot(q[0]! - p[0]![0]!, q[1]! - p[0]![1]!) >= 8) for (const [g0, g1] of avoid) min = Math.min(min, segD(q, g0!, g1!));
        }
      }
    }
    return min;
  };
  it('no leader comes within 6 px of the Trace, a cable or the pad; mutation: a leader boxed across the pad is red', () => {
    for (const id of drawn()) expect(leaderGap(S[id]), id).toBeGreaterThanOrEqual(6);
    const s = S.preacher_curl, cam = camOf(s), p = itemsIn(s, 'end').items.find((it: any) => it.type === 'poly' && it.z === 'mid'), c = cam.P(p.pts[2]);
    const bad = { ...s, callouts: [{ ...s.callouts[0], anchor: 'heel.r', box: { left: Math.round(c[0]! + 10), top: Math.round(c[1]! - 40) } }, ...s.callouts.slice(1)] };
    expect(leaderGap(bad)).toBeLessThan(6);
  });
  /** The cable from the low pulley to the rope's ferrule: its min px gap to the torso and head outline in each pose (side view). */
  const cableGap = (spec: any) => Object.fromEntries(posesOf(spec).map(pose => {
    const cam = camOf(spec), cab = itemsIn(spec, pose).items.find((it: any) => it.type === 'cable' && it.part === 'rope');
    const a = cam.P(cab.from), b = cam.P(cab.to), polys = shapesIn(spec, pose, cam).filter((x: any) => ['torso', 'head'].includes(x.key)).map((x: any) => x.poly);
    let min = Infinity;
    for (let k = 0; k <= 200; k++) min = Math.min(min, outside(polys, [a[0]! + (b[0]! - a[0]!) * k / 200, a[1]! + (b[1]! - a[1]!) * k / 200]));
    return [pose, min];
  }));
  it('overhead_cable_triceps_extension: the cable runs from the low pulley to the rope clear of the trunk, neck and head in every pose (plate.equipment)', () => {
    for (const [pose, g] of Object.entries(cableGap(S.overhead_cable_triceps_extension))) expect(g, pose).toBeGreaterThanOrEqual(6);
  });
  it('mutation: the low pulley moved under the hips draws the cable through the body, and the test is red', () => {
    const s = S.overhead_cable_triceps_extension, k = s.equipment.length - 5;   // the rope composer's first item: the cable
    const fn = s.equipment[k], hip = itemsIn(s, 'end').lm.hips;
    const moved = { ...s, equipment: s.equipment.map((e: any, i: number) => (i !== k ? e : (lm: any, ctx: any) => [].concat(fn(lm, ctx) ?? []).map((x: any) => (x.type === 'cable' ? { ...x, from: [0, 0.1, hip[2]] } : x)))) };
    expect(Math.min(...Object.values<number>(cableGap(moved)))).toBeLessThan(6);
  });
  // R10 (DESIGN.md section 7): one drawn-item check per tier-A item, in the table's order.
  const rep = (id: string) => plate.renderPlate(S[id], { id: 'x' }).report;
  const lm = (id: string, p: string) => itemsIn(S[id], p).lm;
  const deg = (a: number[], b: number[]) => Math.atan2(b[2]! - a[2]!, b[1]! - a[1]!) * 180 / Math.PI;   // forward of vertical, side plane
  const onCheck = (id: string, landmarks: string[], pose: string, cm = 0.5) => landmarks.flatMap(l => {
    const k = rep(id).checks.filter((c: any) => c.landmark === l && c.pose === pose && c.cm != null);
    return k.length && k.every((c: any) => c.cm <= cm) ? [] : [`${pose}: ${l} ${k.map((c: any) => c.cm).join('/') || 'unchecked'}`];
  });
  const R10: Record<string, [string, () => string[]][]> = {
    overhead_cable_triceps_extension: [
      ['low pulley behind the lifter, cable clear of the trunk, neck and head', () => {
        const pul = itemsIn(S.overhead_cable_triceps_extension, 'end').items.filter((it: any) => it.type === 'pulley').sort((a: any, b: any) => a.at[1] - b.at[1])[0];
        const heel = lm('overhead_cable_triceps_extension', 'end')['heel.r'];
        return [...(pul.at[1] <= 0.3 && pul.at[2] < heel[2] - 0.3 ? [] : ['no low pulley behind the heels']), ...Object.entries(cableGap(S.overhead_cable_triceps_extension)).filter(([, g]) => g < 6).map(([p]) => `${p}: cable through the body`)];
      }],
      ['rope in both hands behind the head at the start', () => { const l = lm('overhead_cable_triceps_extension', 'start'); return l.grips[2] < l.ear[2] && l.grips[1] > l['shoulder.r'][1] ? [] : ['hands not behind the head']; }],
      ['upper arms by the ears in start and end', () => ['start', 'end'].flatMap(p => { const l = lm('overhead_cable_triceps_extension', p), a = deg(l['shoulder.r'], l['elbow.r']); return Math.abs(a) <= 15 && l['elbow.r'][1] > l.ear[1] - 0.05 ? [] : [`${p}: upper arm ${a.toFixed(0)} deg off vertical`]; })],
      ['slight forward lean from the hips with a straight back', () => ['start', 'end'].flatMap(p => { const a = rep('overhead_cable_triceps_extension').angles[p]; return a.tilt > 0 && a.tilt <= 20 && a.trunk === 0 ? [] : [`${p}: tilt ${a.tilt} trunk ${a.trunk}`]; })],
      ['arms straight overhead at the end, elbows not locked', () => { const e = rep('overhead_cable_triceps_extension').angles.end['elbow.r']; return e > 0 && e <= 15 ? [] : [`elbow ${e}`]; }],
      ['feet flat on the floor', () => posesOf(S.overhead_cable_triceps_extension).flatMap(p => onCheck('overhead_cable_triceps_extension', ['sole.r', 'sole.l'], p))],
    ],
    dumbbell_overhead_triceps_extension: [
      ['split stance, both feet flat', () => { const D = 'dumbbell_overhead_triceps_extension', l = lm(D, 'end'); return [...(l['sole.l'][2] - l['sole.r'][2] >= 0.3 ? [] : ['feet not split']), ...posesOf(S[D]).flatMap(p => onCheck(D, ['sole.r', 'sole.l'], p))]; }],
      ['one dumbbell held vertically in both hands', () => ['start', 'end'].flatMap(p => {
        const { items, lm: l } = itemsIn(S.dumbbell_overhead_triceps_extension, p), db = items.filter((it: any) => it.type === 'dumbbell');
        return db.length === 1 && db[0].axis.join() === '0,1,0' && Math.abs(db[0].at[2] - l.grips[2]) < 1e-9 && Math.abs(l['grip.l'][2] - l['grip.r'][2]) < 0.01 && Math.abs(l['grip.l'][1] - l['grip.r'][1]) < 0.01 ? [] : [`${p}: not one vertical dumbbell in both hands`];
      })],
      ['upper arms vertical in both poses', () => ['start', 'end'].flatMap(p => { const l = lm('dumbbell_overhead_triceps_extension', p), a = deg(l['shoulder.r'], l['elbow.r']); return Math.abs(a) <= 5 ? [] : [`${p}: upper arm ${a.toFixed(1)} deg off vertical`]; })],
      ['about 90 deg at the elbow at the bottom, the dumbbell behind and clear of the head', () => {
        const D = 'dumbbell_overhead_triceps_extension', s = S[D], cam = camOf(s), e = rep(D).angles.start['elbow.r'], { items, lm: l } = itemsIn(s, 'start'), c = items.find((it: any) => it.type === 'dumbbell').at;
        const head = shapesIn(s, 'start', cam).filter((x: any) => x.key === 'head').map((x: any) => x.poly), pts: number[][] = [];
        for (let k = 0; k <= 20; k++) for (const [y, z] of [[-0.135 + 0.27 * k / 20, -0.0595], [-0.135 + 0.27 * k / 20, 0.0595], [-0.135, -0.0595 + 0.119 * k / 20], [0.135, -0.0595 + 0.119 * k / 20]]) pts.push(cam.P([0, c[1] + y!, c[2] + z!]));
        const gap = Math.min(...pts.map(p => outside(head, p)));
        return [...(e === 90 ? [] : [`elbow ${e}`]), ...(c[2] < l.ear[2] ? [] : ['dumbbell not behind the head']), ...(head.length && gap >= 6 ? [] : [`dumbbell ${gap.toFixed(1)} px from the head`])];
      }],
      ['elbows not locked at the top', () => { const e = rep('dumbbell_overhead_triceps_extension').angles.end['elbow.r']; return e > 0 && e <= 15 ? [] : [`elbow ${e}`]; }],
      ['braced torso, head in line', () => ['start', 'end'].flatMap(p => { const a = rep('dumbbell_overhead_triceps_extension').angles[p]; return a.tilt === 0 && a.trunk === 0 && a.neck === 0 ? [] : [`${p}: tilt ${a.tilt} trunk ${a.trunk} neck ${a.neck}`]; })],
    ],
  };
  /** The tier-A rows of DESIGN.md section 7 (drawn ids), each with its number of items (split on '; '). */
  const tableItems = () => {
    const sec = readFileSync('tools/plates/library/lb5/DESIGN.md', 'utf8').split('## 7. R10')[1]!.split('\n## ')[0]!;
    return Object.fromEntries([...sec.matchAll(/^\| (\w+) \| (.+) \|$/gm)].filter(m => specced().includes(m[1]!)).map(m => [m[1]!, m[2]!.split('; ').length]));
  };
  const r10Problems = (regs: Record<string, [string, () => string[]][]>) => {
    const want = tableItems(), out: string[] = [];
    for (const [id, n] of Object.entries(want)) {
      if ((regs[id] ?? []).length !== n) out.push(`${id}: ${(regs[id] ?? []).length} checks for ${n} items`);
      for (const [name, f] of regs[id] ?? []) for (const p of f()) out.push(`${id} ${name}: ${p}`);
    }
    return out;
  };
  it('every drawn tier-A spec (held ones included) has one passing drawn-item check per R10 item', () => {
    expect(Object.keys(tableItems()).sort()).toEqual(specced().filter(id => ['overhead_cable_triceps_extension', 'dumbbell_overhead_triceps_extension'].includes(id)).sort());
    expect(r10Problems(R10)).toEqual([]);
  });
  it('mutation: one tier-A R10 item removed is red', () => {
    expect(r10Problems({ ...R10, overhead_cable_triceps_extension: R10.overhead_cable_triceps_extension!.slice(1) })).toEqual(['overhead_cable_triceps_extension: 5 checks for 6 items']);
  });
});

describe('LIB-15 D-LIB9-CLONE b: each copied root finder throws on a bracket with no root', () => {
  it('wrist_curl\'s elbow-on-the-thigh bisection solves to the recorded value, and throws when the shoulder cannot reach the line', async () => {
    expect(M.wrist_curl.WRIST_PAST).toBeGreaterThan(0);
    const dir = mkdtempSync(join(tmpdir(), 'lb5-root-')), f = join(dir, 'wrist_curl.mjs');
    writeFileSync(f, readFileSync('tools/plates/library/specs/wrist_curl.mjs', 'utf8').replace(/^const TILT = \d+;/m, 'const TILT = 10;').replace(/from '\.\.\//g, `from '${lib('')}`));
    try { await expect(import(/* @vite-ignore */ `file://${f}`)).rejects.toThrow(/cannot reach the thigh line/); } finally { rmSync(dir, { recursive: true, force: true }); }
  });
});

describe('LIB-15 A4: runQa node half on an LB5 plate (lib_preacher_curl), LIB-3 M1-M7 and a colour literal', { timeout: T }, () => {
  const ID = 'lib_preacher_curl', cg = () => S.preacher_curl;
  let build: any, cand: any, muts: any, golden: any, mirror: any, E: any, all: any, html: string, pins: any;
  beforeAll(async () => {
    [build, cand, muts, golden] = await Promise.all(['lb5/build.mjs', 'candidate.mjs', 'qa/mutations.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    pins = qaIdx.loadPins(); mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.lb5All();
    html = (await build.buildLb5Page({ all, ids: [ID] })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run' && k !== 'H6:no-card');
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  const candOf = (page = html) => cand.candidateOf(ID, { all, platesHtml: page, engine: E, authoring: true });
  const MUT = (id: string) => muts.SPEC_MUTATIONS.find((m: any) => m.id.startsWith(`${id} `));
  // A spec mutation built the way the page builds it: a scratch module that imports the real spec and applies fn.
  const mutated = async (fn: string, arg: any = null) => {
    const dir = mkdtempSync(join(tmpdir(), 'lb5-mut-')), file = join(dir, 'preacher_curl.mjs');
    writeFileSync(file, `import s from ${JSON.stringify(lib('specs/preacher_curl.mjs'))};\nconst fn = ${fn};\nexport default fn(s, ${JSON.stringify(arg)});\n`);
    try {
      const spec = (await import(/* @vite-ignore */ `file://${file}`)).default;
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === ID));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'lb5', title: 'LB5', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(h.toString('utf8'))), spec };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  it('clean: no node-half problem but the expected H6:no-card (before Do 6 b)', async () => {
    const r = await qa(await candOf());
    expect(node(r)).toEqual([]);
  });
  it('A4 M1 a label 1 px onto the figure (the boxed "Arms on pad" callout) turns PQ-H1 red; 1 px back is clean', async () => {
    const c0 = cg().callouts.find((x: any) => x.key === 'arms'), at = (box: any) => ({ ...cg(), callouts: cg().callouts.map((x: any) => (x.key === 'arms' ? { ...x, box } : x)) });
    let hit: any = null;
    for (const [dx, dy] of [[0, -1], [-1, 0], [1, 0], [0, 1]]) {
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
    expect(node(await qa({ ...(await candOf()), spec: shift(cg()) })).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A4 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    const a = MUT('M3').prepare(E, cg(), pins.envelope);
    const c = await mutated('(s, a) => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim?.[0] ?? 8, a.t] } })', a);
    expect(node(await qa(c))).toContain('H3.trace');
  });
  it('A4 M4 the Mistake equal to the end pose turns PQ-H3 red', async () => {
    const c = await mutated('s => ({ ...s, mistake: { ...s.mistake, pose: {}, parts: undefined } })');
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

describe('LIB-15 A11, A6, A8 (Do 6 b): the card fields, the ruled maps and the plate facts (#290 6340022161)', { timeout: T }, () => {
  // The cards whose fields are written now: the 9 less incline_dumbbell_curl (written when drawn).
  const FIELDED = LB5.filter(id => id !== 'incline_dumbbell_curl');
  const KEYS = ['plateFacts', 'tempo', 'topFault'];
  const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
  // The ruled pose map (D-LIB15-POSE; DESIGN.md section 9): the spec pose each card pose is drawn as.
  const POSE_MAP: Record<string, Record<string, string>> = Object.fromEntries(LB5.map(id => [id,
    ['dumbbell_overhead_triceps_extension', 'cable_curl'].includes(id) ? { start: 'end', end: 'start' } : { start: 'start', end: 'end' }]));
  // The ruled fault->key map (D-LIB15-FAULTKEY): the drawn key and topFault.
  // cross_body_hammer_curl: the shrug after F-LB5-1 (research a8e66f32, #290 6340713424); its top fault, the straight arm, keys `straight`.
  const DRAWN: Record<string, string> = { overhead_cable_triceps_extension: 'arch', dumbbell_overhead_triceps_extension: 'arch', cross_body_hammer_curl: 'shrug',
    cable_curl: 'straight', bayesian_cable_curl: 'swing', preacher_curl: 'lift', concentration_curl: 'knee', wrist_curl: 'lean' };
  const TOP: Record<string, string> = { ...DRAWN, wrist_curl: 'grip', cross_body_hammer_curl: 'straight' };
  // The ruled facts (D-LIB15-FACTS), copied from the ruling, never read from a card or a spec.
  const C = (landmark: string, pose: string, cardPose: string, claim: string) => ({ kind: 'contact', landmark, pose, cardPose, claim });
  // The plate-fact fix round (#290 6349063103): each side of a plural paired part, the hands on the implement at the
  // card's start (checked at the wrist), and no fact from an 'or' stop point or a setup quote's end pose.
  const W2 = (pose: string, cp: string, cl: string) => [C('wrist.r', pose, cp, cl), C('wrist.l', pose, cp, cl)];
  const FACTS: Record<string, any[]> = {
    overhead_cable_triceps_extension: W2('start', 'start', 'c3'),
    dumbbell_overhead_triceps_extension: W2('end', 'start', 'c1'),
    cross_body_hammer_curl: W2('start', 'start', 'c1'),
    cable_curl: W2('end', 'start', 'c1'),
    bayesian_cable_curl: [{ kind: 'angle', measure: true, deg: 45, pose: 'start', cardPose: 'start', claim: 'c2' }, C('wrist.r', 'start', 'start', 'c1')],
    preacher_curl: [C('elbow.r', 'start', 'start', 'c1'), C('elbow.l', 'start', 'start', 'c1'), C('chest', 'start', 'start', 'c1'), C('heel.r', 'start', 'start', 'c2'), C('heel.l', 'start', 'start', 'c2'),
      C('ball.r', 'start', 'start', 'c2'), C('ball.l', 'start', 'start', 'c2'), C('wrist.r', 'start', 'start', 'c1'), C('elbow.r', 'end', 'end', 'c4'), C('elbow.l', 'end', 'end', 'c4')],
    concentration_curl: [C('elbow.r', 'start', 'start', 'c1'), C('seat', 'start', 'start', 'c1'),
      ...['start', 'end'].flatMap(p => ['heel.r', 'heel.l', 'ball.r', 'ball.l'].map(l => C(l, p, p, 'c5'))), C('wrist.r', 'start', 'start', 'c1')],   // D-LIB15-MIRROR, c14
    wrist_curl: [C('wrist.r', 'start', 'start', 'c1')],
  };
  const tj = () => readJson('tools/plates/library/lb5/tempo.json');
  const built = (rows: any[], pt: any) => rows.flatMap((r: any) => (r.from === 'pause' ? (pt.pause > 0 ? [{ phase: r.phase, s: pt.pause }] : []) : [{ phase: r.phase, s: pt[r.from], move: true }]));
  const cardsSha = readJson('tools/plates/library/lb5/cards.sha.json');
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  it('each fielded card differs from its research-head copy only in the three keys, written last; the others carry none', () => {
    for (const id of LB5) {
      expect(sha(canon(cardOf(id))), id).toBe(cardsSha.cards[id]);
      if (FIELDED.includes(id)) expect(Object.keys(cardOf(id)).slice(-3), id).toEqual(KEYS);
      else for (const k of KEYS) expect(k in cardOf(id), `${id} ${k}`).toBe(false);
    }
  });
  /** Each card's tempo is built only from the ruled lb5/tempo.json row and its plate.tempo; a drawn spec carries the same. */
  const tempoProblems = (cards: Record<string, any>, specs: Record<string, any>) => FIELDED.flatMap(id => {
    const c = cards[id], out: string[] = [];
    if (JSON.stringify(c.tempo) !== JSON.stringify(built(tj().ids[id].rows, c.plate.tempo))) out.push(`${id}: card tempo`);
    if (specs[id] && JSON.stringify(specs[id].tempo) !== JSON.stringify(c.tempo)) out.push(`${id}: spec tempo != card tempo`);
    return out;
  });
  it('A11 tempo: every card tempo and every spec tempo come from the ruled table and plate.tempo; mutation: seconds changed on one card and spec are red', () => {
    const cards = Object.fromEntries(FIELDED.map(id => [id, cardOf(id)]));
    expect(tempoProblems(cards, S)).toEqual([]);
    const c = JSON.parse(JSON.stringify(cards)); c.preacher_curl.tempo[0].s = 2;
    expect(tempoProblems(c, { ...S, preacher_curl: { ...S.preacher_curl, tempo: c.preacher_curl.tempo } })).toEqual(['preacher_curl: card tempo']);
  });
  const topFaultProblems = (card: any, drawnKey: string) => (card.plate.mistake.drawable
    ? (card.topFault === drawnKey ? [] : ['drawable:true but topFault is not the drawn fault'])
    : (card.topFault !== drawnKey ? [] : ['drawable:false but topFault equals the drawn fault']));
  it('Q1 / A8: each topFault follows the ruled map; wrist_curl is drawable:false with topFault grip, unlike its drawn key; every spec\'s first tell carries the drawn key', () => {
    for (const id of FIELDED) { expect(cardOf(id).topFault, id).toBe(TOP[id]); expect(topFaultProblems(cardOf(id), DRAWN[id]!), id).toEqual([]); }
    expect([cardOf('wrist_curl').plate.mistake.drawable, cardOf('wrist_curl').topFault]).toEqual([false, 'grip']);
    for (const id of FIELDED.filter(i => S[i])) expect(S[id].mistake.tells[0].key, id).toBe(DRAWN[id]);
  });
  it('A8 mutation: wrist_curl\'s card copied with drawable true and topFault equal to the drawn key is red against the F7 expectation', () => {
    const c = cardOf('wrist_curl'); c.topFault = 'lean';
    expect(topFaultProblems(c, 'lean')).toEqual(['drawable:false but topFault equals the drawn fault']);
    c.plate.mistake.drawable = true;   // the F7 id's expectation is drawable false: a true field is itself the red
    expect(c.plate.mistake.drawable === false && c.topFault !== 'lean').toBe(false);
  });
  const factProblems = (id: string, c: any) => c.plateFacts.flatMap((f: any, i: number) => [
    ...(['contact', 'angle', 'height'].includes(f.kind) ? [] : [`${i}: kind`]),
    ...(f.joint && f.measure === true ? [`${i}: both joint and measure`] : []),
    ...(c.claims.some((x: any) => x.id === f.claim) ? [] : [`${i}: claim ${f.claim}`]),
    ...(f.cardPose && POSE_MAP[id]![f.cardPose] !== (f.pose ?? 'end') ? [`${i}: pose ${f.pose ?? 'end'} is not the map's image of card ${f.cardPose}`] : []),
  ]);
  it('A6 / D-LIB15-FACTS: every fielded card\'s plateFacts is the ruled set, one form each, its pose the pose map\'s image', () => {
    for (const id of FIELDED) { expect(cardOf(id).plateFacts, id).toEqual(FACTS[id]); expect(factProblems(id, cardOf(id)), id).toEqual([]); }
  });
  it('mutations: a fact with both joint and measure: true, and a start fact named with the unmapped pose, are red', () => {
    const c = cardOf('cable_curl'); c.plateFacts.push({ kind: 'angle', joint: 'elbow.r', measure: true, deg: 20, claim: 'c13' });
    expect(factProblems('cable_curl', c)).toEqual([`${c.plateFacts.length - 1}: both joint and measure`]);
    const d = cardOf('dumbbell_overhead_triceps_extension'); d.plateFacts[0].pose = 'start';
    expect(factProblems('dumbbell_overhead_triceps_extension', d)).toEqual(["0: pose start is not the map's image of card start"]);
  });
  it('D-LIB15-POSE: the pose map is pinned on the drawn swapped specs (cable_curl ends at the bottom; the dumbbell extension ends at the top)', () => {
    if (S.cable_curl) { const a = plate.renderPlate(S.cable_curl, { id: 'x' }).report.angles; expect(a.end['elbow.r']).toBeLessThan(a.start['elbow.r']); }
    if (S.dumbbell_overhead_triceps_extension) { const a = plate.renderPlate(S.dumbbell_overhead_triceps_extension, { id: 'x' }).report.angles; expect(a.end['elbow.r']).toBeLessThan(a.start['elbow.r']); }
    expect(POSE_MAP.cable_curl).toEqual({ start: 'end', end: 'start' });
    expect(POSE_MAP.preacher_curl).toEqual({ start: 'start', end: 'end' });
  });
  const h6 = (spec: any, research: any) => {
    const R = { normal: plate.renderPlate(spec, { id: 'x' }), mistake: plate.renderPlate(spec, { id: 'x', mistake: true }) };
    return qaNode.h6({ spec, research }, { engine: Eng(), pins: qaIdx.loadPins() }, R).map((p: any) => p.key);
  };
  const research = (id: string) => { const c = cardOf(id); return { plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault }; };
  it('A6: PQ-H6 is green on every drawn row against its card', () => {
    for (const id of drawn().filter(i => FIELDED.includes(i))) expect(h6(S[id], research(id)), id).toEqual([]);
  });
  it('A6 mutations: an angle fact 3 deg off the drawn one, and the card path removed, are red', () => {
    const s = S.preacher_curl, r = research('preacher_curl'), drawnElbow = plate.renderPlate(s, { id: 'x' }).report.angles.end['elbow.r'];
    expect(h6(s, { ...r, plateFacts: [{ kind: 'angle', joint: 'elbow.r', pose: 'end', deg: drawnElbow, claim: 'c4' }] })).toEqual([]);
    expect(h6(s, { ...r, plateFacts: [{ kind: 'angle', joint: 'elbow.r', pose: 'end', deg: drawnElbow + 3, claim: 'c4' }] })).toEqual(['H6.fact:0:angle:elbow.r']);
    expect(h6(s, null)).toEqual(['H6:no-card']);
  });
  it('D-LIB13-FACTS2 mutation: preacher_curl\'s end upper arm lifted 2 cm off the pad turns its end elbow contact red', () => {
    const s = S.preacher_curl, end = { ...s.poses.end, shoulder: { ...s.poses.end.shoulder, flex: s.poses.end.shoulder.flex + 3.5 } };
    expect(h6({ ...s, poses: { ...s.poses, end } }, research('preacher_curl'))).toEqual(['H6.fact:8:contact:elbow.r', 'H6.fact:9:contact:elbow.l']);
  });
});
