// LIB-SUPCORE wave 1 (lib-supcore-card; acceptance A1-A6, A9; D-SUPCORE-*): pilot B's held crunch redrawn on LIB-SPINE's
// spine segments (the curl at T12 only) with two zooms, as the one-row batch PILOT-B2. Every test reads what is drawn
// (the spec, the engine's landmarks, shapes and renders, runQa's own report). Whole-page builds and runQa run in awaited
// child processes (D-LIB13S-RPC, F-VITEST-RPC); the browser half of the plate QA runs in pilot-b2/qa.mjs.
import { execFile } from 'node:child_process';
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { afterEach, beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const ROWS = 'tools/plates/library/pilot-b2/rows.json';   // batches/pilot-b2.json after the pin (Do 4)
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const H = 1.75, FLOOR_Y = 339, BAR_TRACE = 22.11, BAR_DEV = 11.39, LADDER = [1.5, 2, 2.5, 3, 3.5, 4];
afterEach(() => new Promise<void>(r => setImmediate(r)));

let plate: any, body: any, geom: any, qe: any, Z: any, QZ: any, mod: any;
beforeAll(async () => {
  [plate, body, geom, qe, Z, QZ, mod] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/geom.mjs',
    'qa/engine.mjs', 'zoom/inline.mjs', 'qa/zoom.mjs', 'specs/crunch.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
}, T);
const spec = () => mod.default;
const ENG = () => ({ renderPlate: plate.renderPlate, body });
/** A scratch copy of crunch.mjs with `edit` applied, imported from the specs folder so its imports resolve. */
const variant = async (edit: (src: string) => string) => {
  const src = readFileSync('tools/plates/library/specs/crunch.mjs', 'utf8'), out = edit(src);
  if (out === src) throw new Error('variant: the edit changed nothing');
  const file = `tools/plates/library/specs/zz_pb2_crunch_${process.pid}_${Date.now()}.mjs`;
  writeFileSync(file, out);
  try { return (await import(/* @vite-ignore */ new URL(`../../${file}`, import.meta.url).href)).default; } finally { rmSync(file, { force: true }); }
};
const camOf = (s: any) => qe.cameraOf(s, plate.renderPlate(s, { id: 'x', mistake: false }).report);
const posesOf = (s: any) => { const L = qe.poseLandmarks(ENG(), s); return { L, q: L.q as Record<string, any> }; };
const sk = (q: any) => body.fk(q, { height: H });

/** Run `script` (an ES module body that prints one JSON line last) in an awaited child process. */
const child = async (script: string) => {
  const { stdout } = await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 26 });
  return JSON.parse(stdout.trim().split('\n').pop()!);
};
/** runQa (node half) on crunch, optionally on a mutated spec (`fn` source: spec => spec), in a child process. */
const qaNode = (fn: string | null = null) => child(`
const L = p => new URL(p, ${JSON.stringify(lib(''))}).href, { mkdtempSync, writeFileSync, rmSync } = await import('node:fs'), { tmpdir } = await import('node:os'), { join } = await import('node:path');
const [b, cand, qaEng, qaIdx, G, pp, bp] = await Promise.all(['pilot-b2/build.mjs', 'candidate.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../golden.mjs', 'plates-page.mjs', 'build-page.mjs'].map(f => import(L(f))));
const all = b.pb2All(), mirror = G.makeMirror(), E = await qaEng.loadEngine(mirror), pins = qaIdx.loadPins();
let html = (await b.buildPb2Page({ all })).html.toString('utf8'), spec = null;
const fn = ${fn ?? 'null'};
if (fn) {
  const dir = mkdtempSync(join(tmpdir(), 'pb2-mut-')), file = join(dir, 'crunch.mjs');
  writeFileSync(file, 'import s from ' + JSON.stringify(L('specs/crunch.mjs')) + ';\\nconst fn = ' + fn.toString() + ';\\nexport default fn(s);\\n');
  const cid = pp.cardIdOf(all.find(r => r.id === 'lib_crunch'));
  html = (await bp.buildPlatesPage({ groups: [{ id: 'pilot-b2', title: 'Pilot B2', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } })).html.toString('utf8');
  spec = (await import('file://' + file)).default; rmSync(dir, { recursive: true, force: true });
}
const c = await cand.candidateOf('lib_crunch', { all, platesHtml: html, engine: E, authoring: true });
const r = await qaIdx.runQa(spec ? { ...c, spec } : c, { engine: E, pins });
qaEng.dropMirror(mirror);
console.log(JSON.stringify({ keys: qaIdx.HARD.flatMap(h => r.hard[h].problems.map(p => p.key)).filter(k => k !== 'browser:not-run'),
  flags: Object.fromEntries(qaIdx.FLAGS.filter(f => r.flags[f].raised).map(f => [f, r.flags[f].value])), zoom: r.metrics.zoom ?? null }));`);

describe('PILOT-B2 A1: the rows hold exactly lib_crunch; crunch is in no pilot B or LB9 rows file (D-SUPCORE-PIN)', () => {
  const a1 = (text: string) => {
    const j = JSON.parse(text), ids = [...text.matchAll(/^ {2}"(lib_[a-z_]+)": \{/gm)].map(m => m[1]), out: string[] = [];
    if (JSON.stringify(ids) !== '["lib_crunch"]') out.push(`ids ${ids.join(',')}`);
    if (j.batch !== 'PILOT-B2' || j.censusRef !== '4a9fd86') out.push('batch or censusRef');
    for (const [id, r] of Object.entries<any>(j.rows)) {
      if (r.mode !== 'H' || r.view !== 'side') out.push(`${id}: mode ${r.mode} view ${r.view}`);
      for (const k of ['parent', 'template', 'params']) if (k in r) out.push(`${id}: ${k}`);
      if (r.src !== 'library/specs/crunch.mjs') out.push(`${id}: src`);
    }
    return out;
  };
  it('lib_crunch once, mode H, view side, no parent, template or params; batch PILOT-B2, censusRef 4a9fd86', () => {
    expect(a1(readFileSync(ROWS, 'utf8'))).toEqual([]);
  });
  it('crunch is in neither batches/pilot-b.json nor lb9/rows.json', () => {
    for (const f of ['tools/plates/library/batches/pilot-b.json', 'tools/plates/library/lb9/rows.json']) expect(/"lib_crunch"/.test(readFileSync(f, 'utf8')), f).toBe(false);
  });
  it('mutations: a duplicated row, a row set to T and a second id are red', () => {
    const text = readFileSync(ROWS, 'utf8'), j = readJson(ROWS);
    expect(a1(text.replace('  "lib_crunch": {', `  "lib_crunch": ${JSON.stringify(j.rows.lib_crunch)},\n  "lib_crunch": {`)).length).toBeGreaterThan(0);
    expect(a1(JSON.stringify({ ...j, rows: { lib_crunch: { ...j.rows.lib_crunch, mode: 'T', parent: 'lib_plank' } } }, null, 1))).toEqual(['lib_crunch: mode T view side', 'lib_crunch: parent']);
    expect(a1(JSON.stringify({ ...j, rows: { ...j.rows, lib_plank: j.rows.lib_crunch } }, null, 1))).toEqual(['ids lib_crunch,lib_plank']);
  });
});

describe('PILOT-B2 A3: crunch on spine segments, the curl at T12 only (D-SUPCORE-SPLIT)', { timeout: T }, () => {
  const isFlex = (t: any) => t && typeof t === 'object' && Object.keys(t).join() === 'flex' && Array.isArray(t.flex) && t.flex.length === 4;
  /** The outline under the start pose's backMid: the lowest point of the drawn torso path at that plate x, cm above the floor. */
  const under = (s: any): Record<string, number> & { start: number; end: number; mistake: number } => {
    const { L, q } = posesOf(s), cam = camOf(s), xs = cam.P(L.lm.start.backMid)[0];
    return Object.fromEntries(['start', 'end', 'mistake'].map(k => {
      const d: string = body.bodyShapes(sk(q[k]), cam).find((x: any) => x.key === 'torso').d, pts = QZ.pathPoints(d).filter(Boolean);
      let best = -Infinity;
      for (let i = 0; i < pts.length; i++) { const a = pts[i], b = pts[(i + 1) % pts.length]; if ((a[0] - xs) * (b[0] - xs) > 0 || a[0] === b[0]) continue; best = Math.max(best, a[1] + (b[1] - a[1]) * (xs - a[0]) / (b[0] - a[0])); }
      return [k, (FLOOR_Y - best) / cam.pxm * 100];
    })) as any;
  };
  const a3 = (s: any) => {
    const out: string[] = [], { L } = posesOf(s), u = under(s);
    for (const [k, p] of [['start', s.poses.start], ['end', s.poses.end], ['mistake', s.mistake.pose]] as const) if (!isFlex(p.trunk)) out.push(`${k}: trunk ${JSON.stringify(p.trunk)}`);
    if (out.length) return out;
    const st = s.poses.start.trunk.flex, en = s.poses.end.trunk.flex;
    if (!(st[0] === 0 && st[2] === 0 && st[3] === 0 && en[0] === 0 && en[1] === st[1] && en[2] === mod.END_CURL && en[3] === 0)) out.push(`flex start ${st} end ${en}`);
    if (u.end - u.start > 1) out.push(`outline under start backMid +${(u.end - u.start).toFixed(2)} cm`);
    for (const lm of ['lumbar', 'sacrum', 'buttock']) { const d = Math.hypot(...[0, 1, 2].map(i => L.lm.end[lm][i] - L.lm.start[lm][i])) * 100; if (d > 0.1) out.push(`${lm} moves ${d.toFixed(2)} cm`); }
    if (!(L.lm.end.backUpper[1] > 0)) out.push('backUpper on the floor at the end');
    return out;
  };
  it('every key pose and the Mistake write { flex: [4] }; the end is [0, arch, END_CURL 25, 0]; outline +0.94 cm; lumbar, sacrum, buttock still; blades up', () => {
    expect(mod.END_CURL).toBe(25);
    expect(mod.SPLIT).toEqual([0, 0, 1, 0]);
    expect(a3(spec())).toEqual([]);
    const u = under(spec());
    expect(+(u.end - u.start).toFixed(2)).toBe(0.94);
    expect(+(posesOf(spec()).L.lm.end.backUpper[1] * 100).toFixed(2)).toBe(5.62);
  });
  it('SPLIT equals pilot-b2/DESIGN.md section 2', () => {
    expect(readFileSync('tools/plates/library/pilot-b2/DESIGN.md', 'utf8')).toContain('`trunk: { flex: [L5/S1, L3, T12, T7] }` (D-SPINE-MIX). SPLIT = [0, 0, 1, 0]:');
  });
  it('mutations: SPLIT [0, 1, 0, 0] (main\'s L3 pivot) lifts the outline 4.58 cm; a number trunk in the Mistake throws (D-SPINE-MIX)', async () => {
    const l3 = await variant(src => src.replace('export const SPLIT = Object.freeze([0, 0, 1, 0]);', 'export const SPLIT = Object.freeze([0, 1, 0, 0]);'));
    expect(a3(l3)).toContain('outline under start backMid +4.58 cm');
    expect(() => a3({ ...spec(), mistake: { ...spec().mistake, pose: { ...spec().mistake.pose, trunk: 7 } } })).toThrow(/D-SPINE-MIX/);
  });
});

describe('PILOT-B2 A4: the two zooms (D-LIBZOOM-EXTEND, D-LIB16-ZOOMVIEWS)', { timeout: T }, () => {
  /** Per view: the value inside the circle at each ladder k (Trace for normal, the tell move for the Mistake) and whether the source ring closes inside the 358 px frame. */
  const rung = (s: any, view: string, k: number) => {
    const z = Z.zoomOf({ ...s, zoom: [{ view, k }] }, { E: ENG(), view }), r = z.src;
    return { v: view === 'normal' ? QZ.clippedTrace(z.svg, z.circle) : z.fault.d * k, fits: r.c[0] - r.r >= 0 && r.c[0] + r.r <= 358 && r.c[1] - r.r >= 0 && r.c[1] + r.r <= 358, svg: z.svg };
  };
  const bar = (view: string) => (view === 'normal' ? BAR_TRACE : BAR_DEV);
  const passes = (s: any, view: string, k: number) => { let r; try { r = rung(s, view, k); } catch { return false; } return r.fits && r.v >= bar(view); };
  const a4 = (s: any) => {
    const out: string[] = [];
    if (JSON.stringify(s.zoom) !== JSON.stringify([{ view: 'normal', k: 3 }, { view: 'mistake', k: 2 }])) return [`zoom ${JSON.stringify(s.zoom)}`];
    for (const { view, k } of s.zoom) {
      if (!passes(s, view, k)) out.push(`${view} k ${k} fails`);
      for (const lo of LADDER.filter(x => x < k)) if (passes(s, view, lo)) out.push(`${view}: k ${lo} also passes`);
      if (/<(text|foreignObject|tspan)\b|°/.test(rung(s, view, k).svg)) out.push(`${view}: text in the zoom`);
    }
    return out;
  };
  it('[normal k 3, Mistake k 2]: 23.24 px and 15.11 px inside the circles, rings inside the frame, no smaller ladder k passes', () => {
    expect(a4(spec())).toEqual([]);
    expect(+rung(spec(), 'normal', 3).v.toFixed(2)).toBe(23.24);
    expect(+rung(spec(), 'mistake', 2).v.toFixed(2)).toBe(15.11);
  });
  it('no angle in either zoom (qa/zoom.mjs ANGLE); mutation: a planted "15°" matches', () => {
    for (const { view, k } of spec().zoom) expect(QZ.ANGLE.test(rung(spec(), view, k).svg), view).toBe(false);
    expect(QZ.ANGLE.test(`${rung(spec(), 'normal', 3).svg}<text>15°</text>`)).toBe(true);
  });
  it('the plate is byte-identical outside the zoom (each view, with and without the field)', () => {
    for (const mistake of [false, true]) expect(plate.renderPlate(spec(), { id: 'x', mistake }).svg).toBe(plate.renderPlate({ ...spec(), zoom: undefined }, { id: 'x', mistake }).svg);
  });
  it('mutations: normal k 2.5 is 17.61 px; Mistake k 1.5 is 11.34 px with its ring outside the frame', () => {
    expect(+rung(spec(), 'normal', 2.5).v.toFixed(2)).toBe(17.61);
    const m = rung(spec(), 'mistake', 1.5);
    expect([+m.v.toFixed(2), m.fits]).toEqual([11.34, false]);
    expect(a4({ ...spec(), zoom: [{ view: 'normal', k: 2.5 }, { view: 'mistake', k: 2 }] }).length).toBeGreaterThan(0);
  });
});

describe('PILOT-B2 A5: layout (D-SUPCORE-LAYOUT)', { timeout: T }, () => {
  const box = (s: any, key: string) => s.callouts.find((c: any) => c.key === key);
  it('the blades box at {56, 216}; "Chin set" on one line at {24, 160}; the engine reports no issue in either view', () => {
    expect(box(spec(), 'blades').box).toEqual({ left: 56, top: 216 });
    expect([box(spec(), 'chin').text, box(spec(), 'chin').box]).toEqual(['Chin set', { left: 24, top: 160 }]);
    for (const mistake of [false, true]) expect(plate.renderPlate(spec(), { id: 'x', mistake }).report.issues).toEqual([]);
  });
  it('mutation: the blades box back at {8, 300} is an engine issue on the figure', () => {
    const s = { ...spec(), callouts: spec().callouts.map((c: any) => (c.key === 'blades' ? { ...c, box: { left: 8, top: 300 } } : c)) };
    expect(plate.renderPlate(s, { id: 'x', mistake: false }).report.issues.length).toBeGreaterThan(0);
  });
});

describe('PILOT-B2 A6: 2 px clearance (D-SUPCORE-CLEAR)', { timeout: T }, () => {
  // the quoted contacts per pose (pilot-b2/DESIGN.md section 6): torso (buttock, back), head (start only), feet
  const CONTACTS: Record<string, string[]> = { start: ['torso', 'head', 'foot.l', 'foot.r'], end: ['torso', 'foot.l', 'foot.r'], mistake: ['torso', 'foot.l', 'foot.r'] };
  const floorProblems = (s: any, contacts = CONTACTS) => {
    const { q } = posesOf(s), cam = camOf(s), out: string[] = [];
    for (const [k, cs] of Object.entries(contacts)) for (const sh of body.bodyShapes(sk(q[k]), cam)) {
      const gap = FLOOR_Y - Math.max(...sh.poly.map((p: number[]) => p[1]));
      if (cs.includes(sh.key) ? gap < -1 || gap > 1 : gap < 2) out.push(`${k} ${sh.key} ${gap.toFixed(2)} px`);
    }
    return out;
  };
  /** 3D gap (cm) between two limb capsules with the drawn taper (geom.mjs limbR on RADII, in H). */
  const cap = (A: number[], B: number[], R: number[]) => { const r = geom.limbR(R[0]! * H, R[1]! * H, R[2]! * H, R[3]); return Array.from({ length: 121 }, (_, i) => [A.map((v, j) => v + (B[j]! - v) * i / 120), r(i / 120)] as [number[], number]); };
  const gap = (c1: any[], c2: any[]) => { let b = Infinity; for (const [p, r] of c1) for (const [q, s] of c2) b = Math.min(b, Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]) - r - s); return b * 100; };
  const depthGaps = (s: any): Record<string, { fore: number; thigh: number; foreThigh: number }> => {
    const { q } = posesOf(s), R = body.RADII;
    return Object.fromEntries(['start', 'end', 'mistake'].map(k => {
      const b = sk(q[k]), f = (sd: string) => cap(b.E[sd], b.W[sd], R.fore), t = (sd: string) => cap(b.hip[sd], b.K[sd], R.thigh);
      return [k, { fore: gap(f('l'), f('r')), thigh: gap(t('l'), t('r')), foreThigh: Math.min(gap(f('l'), t('l')), gap(f('r'), t('r')), gap(f('l'), t('r')), gap(f('r'), t('l'))) }];
    }));
  };
  it('floor: every non-contact part >= 2 px above y 339 in every drawn pose; the quoted contacts within 1 px of it', () => {
    expect(floorProblems(spec())).toEqual([]);
  });
  it('in depth: the forearms (+0.19 / +0.09 / +0.09 cm), the thighs (0.70) and forearm|thigh pairs all >= 0 cm', () => {
    const g = depthGaps(spec());
    for (const k of ['start', 'end', 'mistake']) for (const v of Object.values<number>(g[k]!)) expect(v, k).toBeGreaterThanOrEqual(0);
    expect(['start', 'end', 'mistake'].map(k => +g[k]!.fore.toFixed(2))).toEqual([0.19, 0.09, 0.09]);
    expect(mod.NEAR_OFF).toBe(0.12);
  });
  it('mutations: the near hand back at 0.035 m passes the forearms through each other (-7.21 cm); the start head not a named contact is red', async () => {
    const v = await variant(src => src.replace('export const NEAR_OFF = 0.12;', 'export const NEAR_OFF = 0.035;'));
    expect(+depthGaps(v).end!.fore.toFixed(2)).toBe(-7.21);
    expect(floorProblems(spec(), { ...CONTACTS, start: ['torso', 'foot.l', 'foot.r'] })).toEqual(['start head -0.16 px']);
  });
});

describe('PILOT-B2 A9 (node half), A2 (part): runQa, the expected flags, the page builds (awaited child processes)', { timeout: T }, () => {
  it('runQa node: every hard check passes with zero exemptions; node flags F1 191.76 and F3 161.2 (named); zooms k 3 / k 2', async () => {
    const r = await qaNode();
    expect(r.keys).toEqual([]);
    // the node-computed flags (F2 and F5 are the browser half's: pilot-b2/qa.mjs EXPECTED)
    expect(Object.keys(r.flags).filter(f => ['F1', 'F3', 'F4', 'F6', 'F7'].includes(f)).sort()).toEqual(['F1', 'F3']);
    expect([+r.flags.F1.toFixed(2), +r.flags.F3.toFixed(1)]).toEqual([191.76, 161.2]);
    expect([r.zoom.normal.k, +r.zoom.normal.trace.toFixed(2), r.zoom.mistake.k, +r.zoom.mistake.deviation.toFixed(2)]).toEqual([3, 23.24, 2, 15.11]);
  });
  // H4.small ("Chin<br>set") is the browser half's: its mutation runs through pilot-b2/qa.mjs (listed in the PR)
  it('mutation: the Mistake zoom removed gives H3.deviation', async () => {
    expect((await qaNode("s => ({ ...s, zoom: [{ view: 'normal', k: 3 }] })")).keys).toContain('H3.deviation');
  });
  it('A9 mutation: the Mistake tell keyed \'pelvis\' first (the card topFault \'lowback\' not the drawn key) raises F7', async () => {
    const r = await qaNode("s => ({ ...s, mistake: { ...s.mistake, tells: s.mistake.tells.filter(t => t.key !== 'lowback') } })");
    expect(Object.keys(r.flags)).toContain('F7');
  });
  it('the PILOT-B2 page is deterministic, and pilot B\'s page is unchanged (ff3e017c, 409,765 B)', async () => {
    const r = await child(`const { createHash } = await import('node:crypto'), sha = x => createHash('sha256').update(x).digest('hex');
const [b2, b] = await Promise.all([${JSON.stringify(lib('pilot-b2/build.mjs'))}, ${JSON.stringify(lib('pilot-b/build.mjs'))}].map(f => import(f)));
const x = await b2.buildPb2Page(), y = await b2.buildPb2Page(), p = await b.buildPbPage();
console.log(JSON.stringify({ x: sha(x.html), y: sha(y.html), ids: b2.drawnIds(), pb: [sha(p.html), p.html.length] }));`);
    expect(r.x).toBe(r.y);
    expect(r.ids).toEqual(['lib_crunch']);
    expect(r.pb).toEqual(['ff3e017c98f73b6d049808a6ffea057a7fa350eed764d9ceedb9a582fa22583f', 409765]);
    console.log(`PILOT-B2 page sha256 ${r.x}`);
  });
  it('the pre-pin rows file exists and the pin files do not yet', () => {
    expect(existsSync(ROWS)).toBe(true);
    for (const f of ['tools/plates/library/batches/pilot-b2.json', 'tools/plates/library/pages/pilot-b2.json', 'tests/howto/golden/library/pilot-b2.json']) expect(existsSync(f), f).toBe(false);
  });
});

describe('PILOT-B2 A10: crunch\'s card fields (Do 3; D-LIB8M-CARDS)', () => {
  const cardsSha = readJson('tools/plates/library/pilot-b2/cards.sha.json');
  const BLOCK = /,\n( +)"plateFacts": [^\n]*,\n\1"tempo": [^\n]*,\n\1"topFault": [^\n]*\n}\n$/;
  const unkeyed = (text: string) => (BLOCK.test(text) ? text.replace(BLOCK, '\n}\n') : null);
  const CARD = 'docs/research/howto/cards/crunch.json';
  let V: any;
  beforeAll(async () => { V = await import(/* @vite-ignore */ lib('research/validate.mjs')); }, T);
  it('the card differs from its research copy (a48b0594, 8e45ee15…) only in the three-key block; the quotes file is a byte copy; validateCard []', () => {
    expect(cardsSha.researchHead).toBe('a48b059400a74d5c9e3aceed21cf1aa67ab6f118');
    const text = readFileSync(CARD, 'utf8');
    expect(sha(unkeyed(text) ?? '')).toBe(cardsSha.cards.crunch);
    expect(cardsSha.cards.crunch).toBe(readJson('tools/plates/library/pilot-b/cards.sha.json').cards.crunch);
    expect(sha(readFileSync('docs/research/howto/quotes/crunch.json'))).toBe(cardsSha.quotes.crunch);
    expect(Object.keys(JSON.parse(text)).slice(-3)).toEqual(['plateFacts', 'tempo', 'topFault']);
    expect(V.validateCard(JSON.parse(text), readJson('docs/research/howto/quotes/crunch.json'), { file: 'crunch.json' })).toEqual([]);
  });
  it('tempo = the pilot-b2/tempo.json row built from plate.tempo (Curl 1, Hold 1, Lower 2) = the spec tempo; topFault = the drawn Mistake key', () => {
    const c = readJson(CARD), tj = readJson('tools/plates/library/pilot-b2/tempo.json');
    expect(tj.ids.crunch.claim).toEqual(c.plate.tempo.claim);
    expect(c.tempo).toEqual(V.buildTempo('crunch', tj.ids.crunch.rows, c.plate.tempo));
    expect(c.tempo).toEqual([{ phase: 'Curl', s: 1, move: true }, { phase: 'Hold', s: 1 }, { phase: 'Lower', s: 2, move: true }]);
    expect(spec().tempo).toEqual(c.tempo);
    expect([c.topFault, spec().mistake.tells[0].key, c.plate.mistake.drawable]).toEqual(['lowback', 'lowback', true]);
  });
  it('every contact fact has a spec check on its landmark in its pose (H6); facts name the ruled set', () => {
    const c = readJson(CARD), s = spec();
    expect(c.plateFacts.map((f: any) => `${f.landmark}@${f.pose}`)).toEqual(['buttock@start', 'backUpper@start', 'sole.r@start', 'sole.l@start', 'buttock@end', 'sole.r@end', 'sole.l@end']);
    for (const f of c.plateFacts) expect(s.checks.some((k: any) => k.landmark === f.landmark && k.plane && (k.pose === f.pose || k.pose === 'all')), `${f.landmark}@${f.pose}`).toBe(true);
  });
  it('mutations: another card key edited, one second changed on the card and the spec, and a fact on a landmark with no check are red', () => {
    const text = readFileSync(CARD, 'utf8');
    expect(sha(unkeyed(text.replace('"view": "side"', '"view": "front"')) ?? '')).not.toBe(cardsSha.cards.crunch);
    const c = readJson(CARD), tj = readJson('tools/plates/library/pilot-b2/tempo.json');
    expect({ ...c, tempo: [{ phase: 'Curl', s: 2, move: true }, ...c.tempo.slice(1)] }.tempo).not.toEqual(V.buildTempo('crunch', tj.ids.crunch.rows, c.plate.tempo));
    expect(spec().checks.some((k: any) => k.landmark === 'backUpper' && k.plane && (k.pose === 'end' || k.pose === 'all'))).toBe(false);
  });
});

describe('PILOT-B2 A1 (files), A13: crunch is in exactly the PILOT-B2 files and never shipped', () => {
  const FILES = ['tools/plates/library/batches', 'tools/plates/library/pages', 'tests/howto/golden/library'];
  const NAMES = /"lib_crunch"|"library\/specs\/crunch\.mjs"|"chromeId": "crunch"/;
  /** Every batch, page or golden file that names crunch, less the PILOT-B2 ones (none before the pin). */
  const hits = (extra: [string, string][] = []) => [...FILES.flatMap(d => readdirSync(d).filter(n => n.endsWith('.json')).map(n => [`${d}/${n}`, readFileSync(`${d}/${n}`, 'utf8')] as [string, string])), ...extra]
    .filter(([n, t]) => NAMES.test(t) && !/\/pilot-b2\.json$/.test(n)).map(([n]) => n);
  it('no other batch, page or golden file names crunch; pilot-b/DESIGN.md keeps its held row (D-LIB11-SMALL) until the pin', () => {
    expect(hits()).toEqual([]);
    const design = readFileSync('tools/plates/library/pilot-b/DESIGN.md', 'utf8'), held = design.slice(design.indexOf('## 13. Held'));
    expect(/^\| crunch \| .+\| D-LIB11-SMALL/m.test(held)).toBe(true);
  });
  it('mutation: a lib_crunch entry in pilot B\'s golden file is red', () => {
    const g = readJson('tests/howto/golden/library/pilot-b.json'); g.entries.push({ ...g.entries[1], id: 'lib_crunch' });
    expect(hits([['tests/howto/golden/library/pilot-b.json', JSON.stringify(g)]])).toEqual(['tests/howto/golden/library/pilot-b.json']);
  });
  it('crunch is not shipped; mutation: its row at shipped is caught', async () => {
    const reg = await import(/* @vite-ignore */ lib('registry.mjs')), b2 = await import(/* @vite-ignore */ lib('pilot-b2/build.mjs'));
    expect(reg.shippedIds(b2.pb2All()).includes('lib_crunch')).toBe(false);
    const j = readJson(ROWS); j.rows.lib_crunch.stage = 'shipped';
    expect(reg.shippedIds(reg.rows(undefined, { batches: [...reg.batchFiles().map((p: string) => [p, readJson(p)]), [ROWS, j]] })).includes('lib_crunch')).toBe(true);
  });
});

describe('PILOT-B2 A12: the moved assertions (D-SUPCORE-TESTHOME map)', () => {
  // lib11-pilot-b.test.ts @ 5bcbddcf line(s) -> the test here that carries it (verbatim or the named stricter form)
  const MOVED: [string, string][] = [
    [':13 PILOT_B lists crunch (its shipped check, :309)', 'crunch is not shipped; mutation: its row at shipped is caught'],
    [':15 HELD = [crunch] (the held markers; the spec checks keep reading it there)', 'no other batch, page or golden file names crunch'],
    [':251-254 the held id is in DESIGN.md\'s held table', 'pilot-b/DESIGN.md keeps its held row (D-LIB11-SMALL) until the pin'],
    [':305-309 "the held crunch has no row" (stricter: lib_crunch once, in pilot-b2 only)', 'lib_crunch once, mode H, view side, no parent, template or params'],
    [':326-330 the held crunch is in no batch, page or golden file (stricter: exactly the PILOT-B2 files)', 'no other batch, page or golden file names crunch'],
    [':331, :338-339 a crunch entry in pilot B\'s golden file is red', 'mutation: a lib_crunch entry in pilot B\'s golden file is red'],
    [':439 the held card is a byte copy (stricter: only the three-key block differs)', 'the card differs from its research copy (a48b0594, 8e45ee15…) only in the three-key block'],
  ];
  // the titles of this file's tests (it('...'), escapes undone)
  const titles = [...readFileSync(new URL(import.meta.url), 'utf8').matchAll(/\bit(?:\.each\([^)]*\))?\('((?:[^'\\]|\\.)*)'/g)].map(m => m[1]!.replace(/\\'/g, "'"));
  const missing = (m: [string, string][]) => m.filter(([, t]) => !titles.some(x => x.includes(t))).map(([l]) => l);
  it('each moved line maps to a test in this file', () => {
    expect(missing(MOVED)).toEqual([]);
  });
  it('mutation: a mapped test renamed away is red', () => {
    expect(missing([...MOVED, [':999 dropped', 'a test that is not here']])).toEqual([':999 dropped']);
  });
  it('lib11-pilot-b.test.ts no longer carries the moved crunch markers', () => {
    const old = readFileSync('tests/howto/lib11-pilot-b.test.ts', 'utf8');
    expect(/the held crunch|held table|id: 'lib_crunch'|for \(const id of HELD\) expect\(sha/.test(old)).toBe(false);
  });
});
