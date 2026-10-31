// PILOT-A3 (pilot-a3-card; acceptance A1, A3-A10, A13, D-A3-*): reverse_lunge redrawn on trunk.bow (F-REVLUNGE-ARCH) and
// dumbbell_fly's F-FLY-START fixes, as the batch PILOT-A3. The two ids' assertions moved here from lib8r-pilot-a2.test.ts
// (D-A3-TESTHOME; the map is MOVED below, pinned by A13). Node only: the browser half of the plate QA runs in
// tools/plates/library/pilot-a3/qa.mjs. Every test reads what is drawn (the spec, the engine's landmarks and renders,
// runQa's own report), never a helper's own maths.
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const IDS = ['reverse_lunge', 'dumbbell_fly'];   // PILOT-A3's rows (D-A3-BATCH)
const A2_ROWS = ['box_jump', 'bent_over_dumbbell_rear_delt_fly'];   // PILOT-A2's pinned rows
const STILL_HELD = ['barbell_shrug', 'incline_dumbbell_press'];   // D-LIB8R-SCOPE: routed to LIB-13s and LB2
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const copy = (x: any) => JSON.parse(JSON.stringify(x));
const PRE = 'tools/plates/library/pilot-a3/rows.json', POST = 'tools/plates/library/batches/pilot-a3.json';
const pinned = () => !existsSync(PRE);
const rowsPath = () => (pinned() ? POST : PRE);   // the pin deletes pilot-a3/rows.json (D-A3-BATCH)
const PX = 256 / 1.75;   // the engine's reference px per metre (vendor/engine/plate.mjs:11)

let plate: any, body: any, eng: any, equip: any, geom: any, build: any, strip: any, validate: any, qe: any, Z: any;
const mods: Record<string, any> = {};
beforeAll(async () => {
  [plate, body, eng, equip, geom, build, strip, validate, qe, Z] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs',
    'engine.mjs', '../vendor/engine/equipment.mjs', '../vendor/engine/geom.mjs', 'pilot-a3/build.mjs', 'strip/tempo-strip.mjs',
    'research/validate.mjs', 'qa/engine.mjs', 'zoom/inline.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of [...IDS, 'dumbbell_fly__alt']) mods[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
}, T);
const spec = (id: string) => mods[id].default;
const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
/** A scratch copy of a spec's source with `edit` applied, imported from the specs folder so its imports resolve. */
const variant = async (id: string, edit: (src: string) => string) => {
  const src = readFileSync(`tools/plates/library/specs/${id}.mjs`, 'utf8'), out = edit(src);
  if (out === src) throw new Error(`variant: the edit changed nothing in ${id}`);
  const file = `tools/plates/library/specs/zz_pa3_${id}_${process.pid}_${Date.now()}.mjs`;
  writeFileSync(file, out);
  try { return await import(/* @vite-ignore */ new URL(`../../${file}`, import.meta.url).href); } finally { rmSync(file, { force: true }); }
};
const ENG = () => ({ renderPlate: plate.renderPlate, body, PRIMITIVES: equip.PRIMITIVES });
/** The plate camera and the start, end and Mistake landmarks, as plate.mjs resolves them. */
const camOf = (s: any) => qe.cameraOf(s, plate.renderPlate(s, { id: 'x', mistake: true }).report);
/** Every equipment item one pose draws, in plate px, with its entry index (each entry's items kept, none keyed over). */
const itemsOf = (s: any, pose: string) => {
  const L = qe.poseLandmarks(ENG(), s), cam = camOf(s), ctx = { pose, start: L.lm.start, body: L.body, mistake: true, q: L.q[pose] };
  return (s.equipment ?? []).flatMap((e: any, i: number) => {
    const ent = typeof e === 'function' ? e(L.lm[pose], ctx) : e;
    return ent ? [].concat(ent).flatMap((one: any) => equip.PRIMITIVES[one.type](one, cam).map((x: any) => ({ ...x, i, type: one.type }))) : [];
  });
};
const ptsOf = (d: string) => { const n = [...d.matchAll(/-?\d+(?:\.\d+)?/g)].map(m => +m[0]), o: number[][] = []; for (let k = 0; k + 1 < n.length; k += 2) o.push([n[k]!, n[k + 1]!]); return o; };
const bbox = (ps: number[][]) => { const xs = ps.map(p => p[0]!), ys = ps.map(p => p[1]!); return { x0: Math.min(...xs), x1: Math.max(...xs), y0: Math.min(...ys), y1: Math.max(...ys) }; };
const segD = (p: number[], a: number[], b: number[]) => { const dx = b[0]! - a[0]!, dy = b[1]! - a[1]!, L2 = dx * dx + dy * dy || 1, t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * dx + (p[1]! - a[1]!) * dy) / L2));
  return Math.hypot(p[0]! - a[0]! - t * dx, p[1]! - a[1]! - t * dy); };
const segs = (ps: number[][]) => ps.slice(1).map((q, i) => [ps[i]!, q] as const);
/** The smallest screen gap between two polylines (0 when they cross). */
const gapPx = (A: number[][], B: number[][]) => {
  for (const [a, b] of segs(A)) for (const [c, d] of segs(B)) { const o = (p: number[], q: number[], r: number[]) => Math.sign((q[0]! - p[0]!) * (r[1]! - p[1]!) - (q[1]! - p[1]!) * (r[0]! - p[0]!)); if (o(a, b, c) !== o(a, b, d) && o(c, d, a) !== o(c, d, b)) return 0; }
  return Math.min(...segs(A).flatMap(([a, b]) => B.map(p => segD(p, a, b))), ...segs(B).flatMap(([a, b]) => A.map(p => segD(p, a, b))));
};

describe('PILOT-A3 A1: the rows hold exactly the two ids; no PILOT-A2 file names them (D-A3-BATCH, D-A3-TESTHOME)', () => {
  // moved from lib8r-pilot-a2.test.ts :47 (mode H per row), stricter: the PILOT-A3 rows
  const problems = (text: string) => {
    const j = JSON.parse(text), bad: string[] = [], ids = Object.keys(j.rows);
    if (JSON.stringify(ids) !== JSON.stringify(IDS.map(i => `lib_${i}`))) bad.push(`ids ${ids.join(',')}`);
    for (const id of IDS) if (text.split(`"lib_${id}"`).length !== 2) bad.push(`${id} not exactly once`);
    for (const id of [...STILL_HELD, ...A2_ROWS]) if (new RegExp(`\\b(lib_)?${id}\\b`).test(text)) bad.push(`${id} is not a PILOT-A3 id`);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      if (r.mode !== 'H') bad.push(`${id}: mode ${r.mode}`);
      if (r.src !== `library/specs/${id.slice(4)}.mjs`) bad.push(`${id}: src ${r.src}`);
      if (IDS.includes(id.slice(4)) && r.view !== cardOf(id.slice(4)).plate.view) bad.push(`${id}: view ${r.view} is not the census view`);
      if (r.stage !== (pinned() ? 'approved-plate' : 'drawing')) bad.push(`${id}: stage ${r.stage}`);
    }
    if (j.batch !== 'PILOT-A3' || j.censusRef !== '4a9fd86') bad.push('batch/censusRef');
    return bad;
  };
  const text = () => readFileSync(rowsPath(), 'utf8');
  // moved from :73-74 (the held ids added to the PILOT-A2 rows are red), stricter: either id in any PILOT-A2 file is red
  const A2_FILES = ['tools/plates/library/batches/pilot-a2.json', 'tools/plates/library/pilot-a2/tempo.json', 'tools/plates/library/pilot-a2/sizes.json',
    'tools/plates/library/pilot-a2/cards.sha.json', 'tools/plates/library/pages/pilot-a2.json', 'tests/howto/golden/library/pilot-a2.json'];
  const a2Problems = (files: Record<string, string>) => Object.entries(files).flatMap(([f, t]) => IDS.filter(id => new RegExp(`\\b(lib_)?${id}\\b`).test(t)).map(id => `${f} names ${id}`));
  const a2Files = () => Object.fromEntries(A2_FILES.map(f => [f, readFileSync(f, 'utf8')]));
  it('the rows file: the 2 ids once each, mode H, census view, stage drawing (approved-plate after the pin); no PILOT-A2 file names them', async () => {
    expect(problems(text())).toEqual([]);
    expect(a2Problems(a2Files())).toEqual([]);
    expect(Object.keys((await import(/* @vite-ignore */ lib('pilot-a2/qa.mjs'))).EXPECTED)).toEqual(A2_ROWS.map(i => `lib_${i}`));
  });
  // moved from :61-67 (the held lines): held until the pin, then "moved: pinned in PILOT-A3"
  it('each id keeps its held line in pilot-a/plates.json until the pin, then names PILOT-A3', () => {
    const p = readJson('tools/plates/library/pilot-a/plates.json').plates, held = (id: string) => p.find((x: any) => x.id === id)?.held;
    if (pinned()) for (const id of IDS) expect(held(id), id).toMatch(/^moved: pinned in PILOT-A3/);
    else { expect(held('reverse_lunge')).toMatch(/F-REVLUNGE-ARCH/); expect(held('dumbbell_fly')).toMatch(/F-FLY-START/); }
  });
  it('mutations: box_jump added, a duplicated row, and either id written into batches/pilot-a2.json are red', () => {
    const j = JSON.parse(text()); j.rows.lib_box_jump = { ...j.rows.lib_reverse_lunge, src: 'library/specs/box_jump.mjs' };
    expect(problems(JSON.stringify(j, null, 1)).length).toBeGreaterThan(0);
    expect(problems(text().replace('"lib_dumbbell_fly": {', '"lib_reverse_lunge_dup": { "x": "lib_reverse_lunge" },\n  "lib_dumbbell_fly": {')).length).toBeGreaterThan(0);
    for (const id of IDS) {
      const f = a2Files(), b = JSON.parse(f[A2_FILES[0]!]!); b.rows[`lib_${id}`] = b.rows.lib_box_jump;
      expect(a2Problems({ ...f, [A2_FILES[0]!]: JSON.stringify(b) }).length, id).toBeGreaterThan(0);
    }
  });
});

describe('PILOT-A3 cards, the tempo map and the strip rows (moved from :85-87 and :128)', () => {
  const cardsSha = readJson('tools/plates/library/pilot-a3/cards.sha.json');
  const BLOCK = /,\n( +)"plateFacts": [^\n]*,\n\1"tempo": [^\n]*,\n\1"topFault": [^\n]*\n}\n$/;
  const unkeyed = (text: string) => (BLOCK.test(text) ? text.replace(BLOCK, '\n}\n') : null);
  // D-LIB8R-FACTS2 (CARD FIELDS cfpa2, #340): every contact a quote states for a drawn pose is a contact fact (verbatim).
  const FACTS: Record<string, string[]> = {
    reverse_lunge: ['contact toe.l end end c4'],
    dumbbell_fly: ['contact backUpper start start c2', 'contact buttock start start c2', 'contact backUpper end end c2', 'contact buttock end end c2',
      'contact backUpper start start c1', 'contact buttock start start c1', 'contact wrist.r start start c3', 'contact wrist.l start start c3'],
  };
  it('each card differs from its research copy (0d832e18) only in the three-key block; quotes are byte copies; validateCardFile []', () => {
    expect(cardsSha.researchHead).toBe('0d832e18a2c52ec091a37b654572db5f0468913b');
    expect(Object.keys(cardsSha.cards)).toEqual(IDS);
    for (const id of IDS) {
      const text = readFileSync(`docs/research/howto/cards/${id}.json`, 'utf8');
      expect(sha(unkeyed(text) ?? ''), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
      expect(validate.validateCardFile(`${id}.json`), id).toEqual([]);
      expect(JSON.parse(text).plateFacts.map((f: any) => `${f.kind} ${f.landmark} ${f.pose} ${f.cardPose} ${f.claim}`), id).toEqual(FACTS[id]);
    }
  });
  it('mutation: another card key edited is red', () => {
    const text = readFileSync('docs/research/howto/cards/reverse_lunge.json', 'utf8').replace('"view": "side"', '"view": "front"');
    expect(sha(unkeyed(text) ?? '')).not.toBe(cardsSha.cards.reverse_lunge);
  });
  const stripRows = (id: string) => readJson('tools/plates/library/strip/rows.json').cards.find((c: any) => c.id === id).rows;
  const tempoProblems = (cards: Record<string, any>, specs: Record<string, any>) => {
    const tj = readJson('tools/plates/library/pilot-a3/tempo.json'), bad: string[] = [];
    for (const id of tj.untimed) {
      let want: any = null;
      try { want = strip.tempoOf(stripRows(id)); } catch (e: any) { bad.push(`${id}: ${e.message}`); }
      if (JSON.stringify(cards[id].tempo) !== JSON.stringify(want)) bad.push(`${id}: card tempo != tempoOf(strip rows)`);
    }
    for (const [id, t] of Object.entries<any>(tj.ids)) {
      const pt = cards[id].plate.tempo, want = t.rows.map((r: any) => ({ phase: r.phase, s: pt[r.from], move: true }));
      if (pt.pause !== 0 || JSON.stringify(cards[id].tempo) !== JSON.stringify(want)) bad.push(`${id}: card tempo != the map`);
    }
    if (JSON.stringify([...tj.untimed, ...Object.keys(tj.ids)].sort()) !== JSON.stringify([...IDS].sort())) bad.push('map ids');
    for (const id of IDS) if (JSON.stringify(specs[id].tempo) !== JSON.stringify(cards[id].tempo)) bad.push(`${id}: spec tempo != card tempo`);
    return bad;
  };
  const clean = () => ({ cards: Object.fromEntries(IDS.map(id => [id, cardOf(id)])), specs: Object.fromEntries(IDS.map(id => [id, spec(id)])) as Record<string, any> });
  it('untimed rows equal tempoOf(strip rows); timed rows follow tempo.json; every spec tempo equals its card', () => {
    const { cards, specs } = clean();
    expect(tempoProblems(cards, specs)).toEqual([]);
  });
  it("mutations: seconds added to reverse_lunge's card and spec, and dumbbell_fly's Lower seconds changed, are red", () => {
    const b = clean(); b.cards.reverse_lunge.tempo[0].s = 3; b.specs.reverse_lunge = { ...b.specs.reverse_lunge, tempo: b.cards.reverse_lunge.tempo };
    expect(tempoProblems(b.cards, b.specs).length).toBeGreaterThan(0);
    const c = clean(); c.cards.dumbbell_fly.tempo[0].s = 3; c.specs.dumbbell_fly = { ...c.specs.dumbbell_fly, tempo: c.cards.dumbbell_fly.tempo };
    expect(tempoProblems(c.cards, c.specs).length).toBeGreaterThan(0);
  });
});

describe('PILOT-A3 card truth, one tell per Mistake (moved from :134, :147-153, :157-158)', () => {
  const RULED: Record<string, string> = { reverse_lunge: 'flare', dumbbell_fly: 'wrists' };
  const tellProblems = (id: string, s: any, card: any) => {
    const bad: string[] = [], tells = s.mistake.tells;
    if (tells.length !== 1) bad.push(`${id}: ${tells.length} tells (one fault, one tell: D-LIB8R-BJTELL)`);
    if (card.topFault !== RULED[id]) bad.push(`${id}: topFault ${card.topFault}`);
    if (!card.plate.mistake.drawable || tells[0].key !== card.topFault) bad.push(`${id}: first tell ${tells[0].key} vs topFault ${card.topFault}`);
    return bad;
  };
  it('each Mistake has exactly one tell, the topFault key of a drawable card', () => {
    for (const id of IDS) expect(tellProblems(id, spec(id), cardOf(id)), id).toEqual([]);
  });
  it("reverse_lunge's tell names c18's fault on the low back (D-A3-REVTELL); dumbbell_fly's names c13's", () => {
    const rl = spec('reverse_lunge').mistake.tells[0];
    expect(cardOf('reverse_lunge').plate.mistake.claim).toBe('c18');
    expect(rl.text).toMatch(/Low back arches/);
    expect(rl.anchor).toEqual({ at: 'lumbar', pose: 'mistake' });
    expect(rl.cue).toBe('The ribcage flares and the pelvis stays untucked, arching the low back.');
    expect(cardOf('reverse_lunge').claims.find((c: any) => c.id === 'c18').text).toMatch(/flaring the ribcage/);
    expect(cardOf('dumbbell_fly').plate.mistake.claim).toBe('c13');
    expect(spec('dumbbell_fly').mistake.tells[0].text).toMatch(/Wrists bend/);
  });
  it("mutations: the old deep tell first on dumbbell_fly, and reverse_lunge's topFault set to another key, are red", () => {
    const fl = spec('dumbbell_fly');
    expect(tellProblems('dumbbell_fly', { ...fl, mistake: { ...fl.mistake, tells: [{ key: 'deep', text: 'Below<br>the chest', anchor: 'grip.r' }, ...fl.mistake.tells] } }, cardOf('dumbbell_fly')).length).toBeGreaterThan(0);
    const rc = cardOf('reverse_lunge'); rc.topFault = 'lean';
    expect(tellProblems('reverse_lunge', spec('reverse_lunge'), rc).length).toBeGreaterThan(0);
  });
});

describe('PILOT-A3 A5: reverse_lunge normal plate (moved from :162-174; D-A3-REVEXPORT)', () => {
  // D-LIB8R-REVLUNGE: the export minus mistake, tempo, pilot and zoom is main c7bdad7a's; the normal render's svg and
  // overlay are main's bytes. D-A3-REVEXPORT: a trunk that is exactly { flex: x } is hashed as x (D-SPINE-MIX made every
  // key pose write the object form); any other trunk shape still moves the sha.
  const flexOnly = (t: any) => (t && typeof t === 'object' && !Array.isArray(t) && Object.keys(t).length === 1 && 'flex' in t ? t.flex : t);
  const normPose = (p: any) => ('trunk' in p ? { ...p, trunk: flexOnly(p.trunk) } : p);
  const exportSha = (s: any) => {
    const { mistake, tempo, pilot, zoom, ...rest } = s;
    void mistake; void tempo; void pilot; void zoom;
    const poses = Object.fromEntries(Object.entries<any>(rest.poses).map(([k, v]) => [k, Array.isArray(v) ? v.map(normPose) : normPose(v)]));
    return sha(JSON.stringify({ ...rest, poses }));
  };
  const EXPORT = '026964f91f030268d49bc52cf1adf46c265d9fcd27349e01e30c6f3bc87cc0dd';
  const NORMAL = { svg: '0744dcf3b2b2ffaae46452a9921adfe09ff45f61f268f98353791e63998b2df9', overlay: 'cbf84381abccc3ff48d647c82c3e691717d347dfbc561ef2c2ee3d65027888c3' };
  it("reverse_lunge's normal plate is main's: export sha (normalised), a Mistake-view zoom only, and the normal render bytes", () => {
    const s = spec('reverse_lunge');
    for (const p of [s.poses.start, ...s.poses.via, s.poses.end]) expect(p.trunk).toEqual({ flex: 0 });
    expect(exportSha(s)).toBe(EXPORT);
    expect(s.zoom).toEqual({ view: 'mistake', k: 3 });
    const n = plate.renderPlate(s, { id: 'x-n' });
    expect({ svg: sha(n.svg), overlay: sha(n.overlay) }).toEqual(NORMAL);
  });
  it('mutation: REAR_HEEL 45 -> 46 moves the export sha and the normal render', async () => {
    const m = await variant('reverse_lunge', src => src.replace('const REAR_HEEL = 45;', 'const REAR_HEEL = 46;'));
    expect(exportSha(m.default)).not.toBe(EXPORT);
    expect(sha(plate.renderPlate(m.default, { id: 'x-n' }).svg)).not.toBe(NORMAL.svg);
  });
  it('mutations: a trunk that is not exactly { flex: x } ({ flex: 0, bow: 1 } or { flex: 0, yaw: 0 } in one key pose) moves the export sha', () => {
    const s = spec('reverse_lunge');
    for (const trunk of [{ flex: 0, bow: 1 }, { flex: 0, yaw: 0 }]) {
      expect(exportSha({ ...s, poses: { ...s.poses, end: { ...s.poses.end, trunk } } }), JSON.stringify(trunk)).not.toBe(EXPORT);
      expect(exportSha({ ...s, poses: { ...s.poses, via: [{ ...s.poses.via[0], trunk }, s.poses.via[1]] } }), JSON.stringify(trunk)).not.toBe(EXPORT);
    }
  });
});

describe('PILOT-A3 A3, A4: reverse_lunge bow true at true size, and the ring on the low back (were R5/R11, :176-217)', () => {
  const H = 1.75;
  const STILL = ['head', 'chin', 'neck', 'shoulder.r', 'shoulderTop.r', 'elbow.r', 'grip.r', 'sternum', 'chest', 'backUpper',
    'hips', 'hip.r', 'hip.l', 'knee.r', 'knee.l', 'ankle.r', 'ankle.l', 'toe.l', 'heel.r'];
  const MOVES: Record<string, number> = { lumbar: 4.10, sacrum: 4.28, buttock: 4.30, navel: 4.65 };
  const pxMove = (a: number[], b: number[]) => Math.hypot(b[1]! - a[1]!, b[2]! - a[2]!) * PX;   // side view: z across, y up
  const bowProblems = (s: any, S: any, end = s.poses.end) => {
    const bad: string[] = [], m = { ...s.poses.end, ...s.mistake.pose };
    if (JSON.stringify(m.trunk) !== JSON.stringify({ flex: 0, bow: S.M_ARCH }) || S.M_ARCH !== 12 || S.M_TILT !== 12) bad.push(`trunk ${JSON.stringify(m.trunk)}, M_ARCH ${S.M_ARCH}, M_TILT ${S.M_TILT}: not the true 12° bow`);
    const a = eng.landmarksOf(end, H), b = eng.landmarksOf(m, H);
    for (const k of STILL) if (Math.hypot(...b[k].map((v: number, i: number) => v - a[k][i])) > 1e-9) bad.push(`${k} moved ${pxMove(a[k], b[k]).toFixed(2)} px`);
    for (const [k, px] of Object.entries(MOVES)) if (Math.abs(pxMove(a[k], b[k]) - px) > 0.05) bad.push(`${k} moved ${pxMove(a[k], b[k]).toFixed(2)} px, not ${px}`);
    return bad;
  };
  it('A3: bow = M_ARCH = M_TILT = 12; upper landmarks, hips and legs still; lumbar 4.10, sacrum 4.28, buttock 4.30, navel 4.65 px; the same against { flex: 0, bow: 0 }', () => {
    const s = spec('reverse_lunge');
    expect(bowProblems(s, mods.reverse_lunge.SIZES)).toEqual([]);
    expect(bowProblems(s, mods.reverse_lunge.SIZES, { ...s.poses.end, trunk: { flex: 0, bow: 0 } })).toEqual([]);
  });
  it('A3 mutations: the held #340 Mistake (tilt 15, trunk -12), a 16° bow, and a number trunk in the end pose are red', () => {
    const s = spec('reverse_lunge'), e = s.poses.end;
    const held = { ...e, root: { ...e.root, tilt: e.root.tilt + 12 }, trunk: { flex: -12 }, shoulder: { flex: e.root.tilt } };
    expect(bowProblems({ ...s, mistake: { ...s.mistake, pose: held } }, mods.reverse_lunge.SIZES).some((p: string) => /^head moved 5\.2\d px/.test(p))).toBe(true);
    expect(bowProblems({ ...s, mistake: { ...s.mistake, pose: { ...s.mistake.pose, trunk: { flex: 0, bow: 16 } } } }, { ...mods.reverse_lunge.SIZES, M_ARCH: 16 }).length).toBeGreaterThan(0);
    expect(() => plate.renderPlate({ ...s, poses: { ...s.poses, end: { ...e, trunk: 0 } } }, { id: 'x' })).toThrow(/trunk\.bow needs the object form .*D-SPINE-MIX/);
  });
  // A4: zoomOf's own fault and source ring: 12.31 px inside the zoom; the ring holds lumbar, sacrum and backMid in both
  // poses, and the end pose's elbow dot (the hanging arm overlaps the waist in the side view).
  const zoomProblems = (s: any) => {
    const z = Z.zoomOf(s, { prefix: 'x' }), cam = camOf(s), L = qe.poseLandmarks(ENG(), s), bad: string[] = [];
    if (z.fault.key !== 'flare' || !(z.fault.d * z.k >= 11.39)) bad.push(`deviation in the zoom ${(z.fault.d * z.k).toFixed(2)} px < 11.39`);
    const pts: [string, number[]][] = [['elbow.r end', L.lm.end['elbow.r']], ...['lumbar', 'sacrum', 'backMid'].flatMap(k => (['end', 'mistake'] as const).map(p => [`${k} ${p}`, L.lm[p][k]] as [string, number[]]))];
    for (const [k, w] of pts) { const p = cam.P(w); if (Math.hypot(p[0] - z.src.c[0], p[1] - z.src.c[1]) > z.src.r) bad.push(`${k} outside the ring`); }
    return { bad, dev: z.fault.d * z.k };
  };
  it('A4: { view: mistake, k: 3 }, 12.31 px inside the zoom, the ring holds lumbar, sacrum and backMid in both poses and the elbow dot', () => {
    const s = spec('reverse_lunge'), r = zoomProblems(s);
    expect(s.zoom).toEqual({ view: 'mistake', k: 3 });
    expect(r.bad).toEqual([]);
    expect(r.dev).toBeCloseTo(12.31, 2);
  });
  it('A4 mutations: k 2.5 (10.26 px) and the held anchor (sternum -> lumbar t 0.7) at k 3 (8.62 px) are red', () => {
    const s = spec('reverse_lunge');
    const k25 = zoomProblems({ ...s, zoom: { view: 'mistake', k: 2.5 } });
    expect(k25.bad.length).toBeGreaterThan(0); expect(k25.dev).toBeCloseTo(10.26, 2);
    const held = zoomProblems({ ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((t: any) => ({ ...t, anchor: { along: ['sternum', 'lumbar'], t: 0.7, pose: 'mistake' } })) } });
    expect(held.bad.length).toBeGreaterThan(0); expect(held.dev).toBeCloseTo(8.62, 2);
  });
  it('the chest arrow is gone: the Mistake draws no guide (the chest moves 0 px)', () => {
    expect(spec('reverse_lunge').mistake.guides ?? []).toEqual([]);
  });
});

describe('PILOT-A3 A6, A7: dumbbell_fly start dumbbells side-on and the faulty hands (D-A3-FLYSTART, -FLYHAND)', () => {
  const PHANTOM = 'eq-line m-line';
  /** The start silhouettes (screen polylines), the end dumbbells' boxes, the pad poly and the drawn (trimmed) trace. */
  const drawn = (s: any) => {
    const end = itemsOf(s, 'end'), cam = camOf(s), L = qe.poseLandmarks(ENG(), s);
    const sil = end.filter((x: any) => x.cls === PHANTOM).map((x: any) => x.line ?? ptsOf(x.d));
    const dbIdx = [...new Set(end.filter((x: any) => x.type === 'dumbbell').map((x: any) => x.i))][0];
    const dbs = end.filter((x: any) => x.type === 'dumbbell' && x.i === dbIdx), endBoxes = [0, 1].map(k => bbox(dbs.slice(k * 3, k * 3 + 3).flatMap((x: any) => ptsOf(x.d))));
    const pad = end.filter((x: any) => x.type === 'poly' && x.cls === 'eq').map((x: any) => x.poly).find((p: any) => bbox(p).y1 - bbox(p).y0 > 100);
    const tp = Z.tracePath(s, cam), acc = [0];
    for (let k = 1; k < tp.length; k++) acc.push(acc[k - 1]! + Math.hypot(tp[k][0] - tp[k - 1][0], tp[k][1] - tp[k - 1][1]));
    const [t0, t1] = s.trace.trim, trace = tp.filter((_: any, k: number) => acc[k]! >= t0 && acc[k]! <= acc.at(-1)! - t1);
    return { sil, endBoxes, pad: [...pad, pad[0]], trace, grips: ['l', 'r'].map(sd => cam.P(L.lm.start[`grip.${sd}`])) };
  };
  const startProblems = (d: any) => {
    const bad: string[] = [], [eb] = d.endBoxes, W = eb.x1 - eb.x0, Hh = eb.y1 - eb.y0;
    if (d.sil.length !== 2) bad.push(`${d.sil.length} start silhouettes`);
    if (Math.abs(W - 15.1) > 0.2 || Math.abs(Hh - 28.0) > 0.2) bad.push(`end dumbbell ${W.toFixed(2)} x ${Hh.toFixed(2)}`);
    for (const p of d.sil) {
      const b = bbox(p), c = [(b.x0 + b.x1) / 2, (b.y0 + b.y1) / 2];
      if (p.length !== 13 || JSON.stringify(p[0]) !== JSON.stringify(p.at(-1))) bad.push(`not a closed 13-point outline (${p.length})`);
      if (Math.abs(b.x1 - b.x0 - W) > 0.2 || Math.abs(b.y1 - b.y0 - Hh) > 0.2) bad.push(`silhouette ${(b.x1 - b.x0).toFixed(2)} x ${(b.y1 - b.y0).toFixed(2)} != the end dumbbell`);
      if (!d.grips.some((g: number[]) => Math.hypot(g[0]! - c[0]!, g[1]! - c[1]!) < 0.5)) bad.push(`silhouette at (${c.map(v => v.toFixed(1))}) not on a start grip`);
      // D-A3-CLEAR: in the body's plane, 2 px from the bench pad and the drawn Trace
      if (!(gapPx(p, d.pad) >= 2)) bad.push(`pad gap ${gapPx(p, d.pad).toFixed(2)} px`);
      if (!(gapPx(p, d.trace) >= 2)) bad.push(`trace gap ${gapPx(p, d.trace).toFixed(2)} px`);
    }
    return bad;
  };
  it('A6, A9: two dashed closed side-on silhouettes, each 15.1 x 28.0 px = the end dumbbell, on the start grips, >= 2 px from the pad (3.4) and the Trace (8.0)', () => {
    const d = drawn(spec('dumbbell_fly'));
    expect(startProblems(d)).toEqual([]);
    expect(Math.min(...d.sil.map((p: any) => gapPx(p, d.pad)))).toBeCloseTo(3.43, 1);
    expect(Math.min(...d.sil.map((p: any) => gapPx(p, d.trace)))).toBeCloseTo(8.04, 1);
  });
  it('A6 mutations: the hex ring restored (17.4 x 10.7 px) and the silhouette at the end grip are red', () => {
    const d = drawn(spec('dumbbell_fly')), cam = camOf(spec('dumbbell_fly')), L = qe.poseLandmarks(ENG(), spec('dumbbell_fly'));
    const hex = (c: number[], r: number) => Array.from({ length: 7 }, (_, i) => cam.P([c[0]! + r * Math.cos(i * Math.PI / 3), c[1]! - r * Math.sin(i * Math.PI / 3), c[2]!]));
    const ring = { ...d, sil: ['l', 'r'].map(sd => hex(L.lm.start[`grip.${sd}`], 0.119 / 2)) }, rb = bbox(ring.sil[0]!);
    expect(startProblems(ring).length).toBeGreaterThan(0);
    expect([rb.x1 - rb.x0, rb.y1 - rb.y0].map(v => +v.toFixed(1))).toEqual([17.4, 10.7]);
    const atEnd = { ...d, sil: d.sil.map((p: any, k: number) => { const g = d.grips[k], e = cam.P(L.lm.end[`grip.${['l', 'r'][k]}`]), c = [(bbox(p).x0 + bbox(p).x1) / 2, (bbox(p).y0 + bbox(p).y1) / 2];
      void g; return p.map((q: number[]) => [q[0]! + e[0] - c[0]!, q[1]! + e[1] - c[1]!]); }) };
    expect(startProblems(atEnd).length).toBeGreaterThan(0);
  });
  it('A9 mutation [designed]: a silhouette moved 1.5 px toward the pad (3.4 -> 1.9 px) is red', () => {
    const d = drawn(spec('dumbbell_fly')), k = d.sil.findIndex((p: any) => bbox(p).x1 < bbox(d.pad).x0);
    const moved = { ...d, sil: d.sil.map((p: any, j: number) => (j === k ? p.map((q: number[]) => [q[0]! + 1.5, q[1]!]) : p)) };
    expect(startProblems(moved).some((p: string) => /^pad gap 1\.9/.test(p))).toBe(true);
  });
  /** A7: each side's Mistake guide is the closed outline of the Mistake pose's own hand poly, bent 23.0° on screen. */
  const handProblems = (s: any) => {
    const bad: string[] = [], cam = camOf(s), L = qe.poseLandmarks(ENG(), s), z = Z.zoomOf(s, { prefix: 'x' });
    const hands = itemsOf(s, 'mistake').filter((x: any) => x.cls === 'eq-solid' && x.type === 'poly').map((x: any) => x.poly);
    const gs = (s.mistake.guides ?? []).filter((g: any) => g.kind === 'dashed');
    if (gs.length !== 2) bad.push(`${gs.length} dashed guides`);
    let inRing = 0;
    for (const g of gs) {
      const P = g.pts.map(cam.P);
      if (g.pts.length !== 5 || JSON.stringify(g.pts[0]) !== JSON.stringify(g.pts[4])) bad.push('not a closed 4-corner outline');
      if (!hands.some((h: number[][]) => h.length === 4 && h.every((q, i) => Math.hypot(q[0]! - P[i][0], q[1]! - P[i][1]) < 1e-6))) bad.push('not the Mistake pose hand poly');
      const w = [(P[0][0] + P[3][0]) / 2, (P[0][1] + P[3][1]) / 2], gr = [(P[1][0] + P[2][0]) / 2, (P[1][1] + P[2][1]) / 2];
      const sd = ['l', 'r'].find(x => { const W = cam.P(L.lm.mistake[`wrist.${x}`]); return Math.hypot(W[0] - w[0]!, W[1] - w[1]!) < 1e-6; });
      if (!sd) { bad.push('guide not at a Mistake wrist'); continue; }
      const El = cam.P(L.lm.mistake[`elbow.${sd}`]), W = cam.P(L.lm.mistake[`wrist.${sd}`]);
      let a = (Math.atan2(gr[1]! - w[1]!, gr[0]! - w[0]!) - Math.atan2(W[1] - El[1], W[0] - El[0])) * 180 / Math.PI; a = ((a + 540) % 360) - 180;
      if (Math.abs(Math.abs(a) - 23.0) > 0.5) bad.push(`${sd}: ${Math.abs(a).toFixed(2)}° on screen, not 23.0`);
      if (P.every((p: number[]) => Math.hypot(p[0]! - z.src.c[0], p[1]! - z.src.c[1]) <= z.src.r)) inRing++;
    }
    if (inRing < 1) bad.push('no hand guide inside the source ring');
    if (!(z.fault.d * z.k >= 11.39)) bad.push(`deviation in the zoom ${(z.fault.d * z.k).toFixed(2)}`);
    return bad;
  };
  it('A7: two closed dashed guides = the Mistake hand polys, 23.0° on screen from the forearm (30° in 3D), one inside the ring; zoom k 2.5, 12.42 px', () => {
    const s = spec('dumbbell_fly'), z = Z.zoomOf(s, { prefix: 'x' });
    expect(handProblems(s)).toEqual([]);
    expect(mods.dumbbell_fly.SIZES.M_WRIST).toBe(30);
    expect(s.zoom).toEqual({ view: 'mistake', k: 2.5 });
    expect(z.fault.d * z.k).toBeCloseTo(12.42, 2);
  });
  it('A7 mutations: the guides on the end hand (0°) are red; k 2 gives 9.94 px', () => {
    const s = spec('dumbbell_fly'), cam = camOf(s);
    const endHands = itemsOf(s, 'end').filter((x: any) => x.cls === 'eq-solid' && x.type === 'poly');
    expect(endHands.length).toBe(2);
    const L = qe.poseLandmarks(ENG(), s), hp = (sd: string) => s.equipment.map((e: any) => (typeof e === 'function' ? e(L.lm.end, { pose: 'end' }) : null)).flat().find((x: any) => x?.part === `hand.${sd}`).pts;
    const onEnd = { ...s, mistake: { ...s.mistake, guides: ['l', 'r'].map(sd => ({ kind: 'dashed', pts: [...hp(sd), hp(sd)[0]] })) } };
    expect(handProblems(onEnd).length).toBeGreaterThan(0);
    void cam;
    const z2 = Z.zoomOf({ ...s, zoom: { view: 'mistake', k: 2 } }, { prefix: 'x' });
    expect(z2.fault.d * z2.k).toBeCloseTo(9.94, 2);
  });
});

describe('PILOT-A3 A9: 3D gaps of the parts beside the body in depth (D-A3-CLEAR, listed)', () => {
  const H = 1.75;
  // each dumbbell head as its circumscribed cylinder (r 0.0595 m, 0.07 m long, axis z, the primitive's sizes); the thigh
  // as the engine's limb radius profile along hip -> knee (RADII.thigh, geom.mjs limbR); the forearm axis elbow -> wrist
  const lerp = (a: number[], b: number[], t: number) => a.map((v, i) => v + (b[i]! - v) * t);
  const headGap = (G: number[], A: number[], B: number[], r: (t: number) => number) => {
    let best = Infinity;
    for (const sg of [-1, 1]) {
      const c = [G[0]!, G[1]!, G[2]! + sg * (0.065 + 0.035)];
      for (let k = 0; k <= 400; k++) {
        const q = lerp(A, B, k / 400), rad = Math.hypot(q[0]! - c[0]!, q[1]! - c[1]!), ax = Math.abs(q[2]! - c[2]!);
        best = Math.min(best, Math.hypot(Math.max(rad - 0.0595, 0), Math.max(ax - 0.035, 0)) - r(k / 400));
      }
    }
    return best;
  };
  const rlListing = (s: any, dx = 0) => {
    const thR = geom.limbR(...eng.RADII.thigh);
    return [s.poses.start, ...s.poses.via, s.poses.end].map((p: any) => {
      const lm = eng.landmarksOf(p, H);
      return ['l', 'r'].map(sd => { const G = lm[`grip.${sd}`], toward = Math.sign(lm[`hip.${sd}`][0] - G[0]);
        return +(headGap(sd === 'l' ? [G[0] + toward * dx, G[1], G[2]] : G, lm[`hip.${sd}`], lm[`knee.${sd}`], (t: number) => thR(t) * H) * 100).toFixed(2); });
    });
  };
  // [start, via 1, via 2, end] x [db.l (rear thigh), db.r (front thigh)], cm, measured on this head with the model above
  const LISTED = [[1.47, 1.47], [0.27, 0.36], [0.23, 3.72], [0.11, 9.7]];
  it('reverse_lunge: the dumbbells clear the thighs in every drawn pose (cm, listed)', () => {
    const got = rlListing(spec('reverse_lunge'));
    got.forEach((row, i) => row.forEach((v, j) => { expect(v).toBeGreaterThan(0); expect(v).toBeCloseTo(LISTED[i]![j]!, 1); }));
  });
  it('mutation: db.l moved 2 cm toward the rear thigh turns the listing negative', () => {
    expect(rlListing(spec('reverse_lunge'), 0.02).some(row => row[0]! < 0)).toBe(true);
  });
  it('dumbbell_fly: the start heads clear the start forearm axis by >= 6.3 cm (forearm radius <= 4.55 cm): depth, not contact', () => {
    const s = spec('dumbbell_fly'), lm = eng.landmarksOf(s.poses.start, H);
    expect(Math.max(...eng.RADII.fore.slice(0, 3)) * H).toBeLessThanOrEqual(0.0455 + 1e-9);
    for (const sd of ['l', 'r']) expect(headGap(lm[`grip.${sd}`], lm[`elbow.${sd}`], lm[`wrist.${sd}`], () => 0), sd).toBeGreaterThanOrEqual(0.063);
  });
});

describe('PILOT-A3 views and sizes (moved from :246-264 and :266-283)', () => {
  const viewProblems = (fly: any) => (fly.view !== 'front' || fly.camera?.pitch !== 45 || fly.torso !== 'volume' ? ['dumbbell_fly: not the census front view at pitch 45 with the volume trunk'] : []);
  it('dumbbell_fly is the census front view; the alt imports', () => {
    expect(viewProblems(spec('dumbbell_fly'))).toEqual([]);
    expect(spec('dumbbell_fly__alt').view).toBe('side');
  });
  it('mutations: the pitch removed is red; makeFly renamed breaks the alt import', async () => {
    const fl = spec('dumbbell_fly');
    expect(viewProblems({ ...fl, camera: { ...fl.camera, pitch: undefined } }).length).toBeGreaterThan(0);
    await expect(variant('dumbbell_fly', src => src.replace('export function makeFly(', 'export function makeFly2('))).rejects.toThrow(/makeFly/);
  });
  const sizes = readJson('tools/plates/library/pilot-a3/sizes.json').ids;
  const sizeProblems = (id: string, S: any) => {
    const want = Object.fromEntries(Object.entries<any>(sizes[id]).map(([k, v]) => [k, v.value])), bad: string[] = [];
    if (JSON.stringify(S) !== JSON.stringify(want)) bad.push(`${id}: SIZES ${JSON.stringify(S)}`);
    for (const [k, v] of Object.entries<any>(sizes[id])) if (!v.basis || /PQ-H3/.test(v.basis.replace('PQ-H3 is never', ''))) bad.push(`${id}.${k}: basis`);
    return bad;
  };
  it('each spec SIZES equals its pilot-a3/sizes.json row, both ways, every row with a basis; M_TILT is the bow', () => {
    expect(Object.keys(sizes)).toEqual(IDS);
    for (const id of IDS) expect(sizeProblems(id, mods[id].SIZES), id).toEqual([]);
    expect(sizes.reverse_lunge.M_TILT.basis).toMatch(/trunk\.bow/);
    expect(sizes.reverse_lunge.M_TILT.basis).not.toMatch(/rib front forward/);
  });
  it('mutations: M_WRIST 31 in the spec and a row dropped are red', () => {
    expect(sizeProblems('dumbbell_fly', { ...mods.dumbbell_fly.SIZES, M_WRIST: 31 }).length).toBeGreaterThan(0);
    const { M_ARCH, ...rest } = mods.reverse_lunge.SIZES;
    void M_ARCH;
    expect(sizeProblems('reverse_lunge', rest).length).toBeGreaterThan(0);
  });
});

describe('PILOT-A3 A8, A10: runQa node half on each plate, the zooms, the fly chunk, LIB-3 M1-M7 (moved from :330-331)', { timeout: T }, () => {
  let cand: any, qaEng: any, qaIdx: any, golden: any, mirror: any, E: any, all: any, html: string, pins: any, node7: any;
  beforeAll(async () => {
    [cand, qaEng, qaIdx, golden, node7] = await Promise.all(['candidate.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../golden.mjs', 'qa/node.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.pa3All(); pins = qaIdx.loadPins();
    html = (await build.buildPa3Page({ all })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  // before the pin: the authoring path, zero exemptions; after it the default path, where the pinned exemptions apply
  const candOf = (id: string, page = html) => cand.candidateOf(`lib_${id}`, { all, platesHtml: page, engine: E, ...(pinned() ? {} : { authoring: true }) });
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  const mutated = async (id: string, fn: string) => {
    const dir = mkdtempSync(join(tmpdir(), 'pa3-mut-')), file = join(dir, `${id}.mjs`);
    writeFileSync(file, `import s from ${JSON.stringify(lib(`specs/${id}.mjs`))};\nimport { landmarksOf } from ${JSON.stringify(lib('engine.mjs'))};\nconst fn = ${fn};\nexport default fn(s, landmarksOf);\n`);
    try {
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === `lib_${id}`));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'pilot-a3', title: 'Pilot A3', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await candOf(id, h.toString('utf8'))), spec: (await import(/* @vite-ignore */ `file://${file}`)).default };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  // the node-computed flags (F2 and F5 are the browser half's, pilot-a3/qa.mjs EXPECTED)
  const NODE_FLAGS: Record<string, string[]> = { reverse_lunge: ['F3', 'F4'], dumbbell_fly: ['F3'] };
  const flagProblems = (id: string, r: any) => ['F1', 'F3', 'F4', 'F6', 'F7'].filter(f => r.flags[f].raised !== NODE_FLAGS[id]!.includes(f)).map(f => `${id}: ${f} ${r.flags[f].raised}`);
  it.each(IDS)('%s: every node hard check passes with zero exemptions; the node flags are the expected set', async id => {
    const r = await qa(await candOf(id));
    expect(node(r)).toEqual([]);
    expect(flagProblems(id, r)).toEqual([]);
  });
  it('A10 mutation: reverse_lunge\'s card with topFault set to another key raises F7 (the expected set red)', async () => {
    const c = await candOf('reverse_lunge'), r = await qa({ ...c, research: { ...c.research, topFault: 'lean' } });
    expect(flagProblems('reverse_lunge', r).length).toBeGreaterThan(0);
  });
  it('A8: the fly chunk is 153,494 B raw, inside H7 (153,600)', async () => {
    const c = await candOf('dumbbell_fly');
    expect(node7.chunkBytes(c).raw).toBe(153494);
  });
  it('A8 mutation: three rectangles per start dumbbell (the side alt\'s outlines) give H7.chunk-raw', async () => {
    const fn = `(s, landmarksOf) => { const st = landmarksOf(s.poses.start, 1.75), h = 0.119 * 0.866 / 2;
      const rect = (c, z0, z1, w) => [[c[0] - w, c[1], c[2] + z0], [c[0] + w, c[1], c[2] + z0], [c[0] + w, c[1], c[2] + z1], [c[0] - w, c[1], c[2] + z1], [c[0] - w, c[1], c[2] + z0]];
      const three = c => [rect(c, -0.135, -0.065, h), rect(c, 0.065, 0.135, h), rect(c, -0.065, 0.065, 0.008)];
      const i = s.equipment.findIndex(e => typeof e === 'function' && [].concat(e(st, { pose: 'end' }) ?? []).some(x => x?.cls === 'eq-line m-line'));
      return { ...s, equipment: s.equipment.map((e, j) => (j === i ? (lm, ctx) => (ctx.pose === 'end' ? ['l', 'r'].flatMap(sd => three(st['grip.' + sd])).map(pts => ({ type: 'line', pts, cls: 'eq-line m-line', z: 'front' })) : null) : e)) }; }`;
    expect(node(await qa(await mutated('dumbbell_fly', fn)))).toContain('H7.chunk-raw');
  });
  it('A4, A7 mutations: the next k down (reverse_lunge 2.5, dumbbell_fly 2) turns H3 red', async () => {
    for (const [id, k] of [['reverse_lunge', 2.5], ['dumbbell_fly', 2]] as const) {
      expect(node(await qa(await mutated(id, `s => ({ ...s, zoom: { ...s.zoom, k: ${k} } })`))), id).toContain('H3.zoom:deviation');
    }
  });
  it('A10 M1 a label 1 px onto the figure (the fly\'s Soft elbows box) turns PQ-H1 red; 1 px back is clean', async () => {
    const s = spec('dumbbell_fly'), c0 = s.callouts.find((x: any) => x.key === 'elbows'), at = (box: any) => ({ ...s, callouts: s.callouts.map((x: any) => (x.key === 'elbows' ? { ...x, box } : x)) });
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
    expect(node(await qa({ ...(await candOf('dumbbell_fly')), spec: at(hit.box) })).some((k: string) => k.startsWith('H1.engine:normal:figure:'))).toBe(true);
  });
  it('A10 M2 a contact 1 cm off (the fly\'s start wrist.r check moved 1.1 cm) turns PQ-H1 red', async () => {
    const s = spec('dumbbell_fly'), shift = { ...s, checks: s.checks.map((k: any) => (k.landmark === 'wrist.r' && k.at ? { ...k, at: [k.at[0], k.at[1] + 0.011, k.at[2]] } : k)) };
    expect(node(await qa({ ...(await candOf('dumbbell_fly')), spec: shift })).some((k: string) => /^H1\.engine:normal:check:/.test(k))).toBe(true);
  });
  it('A10 M3 a Trace below the minimum turns PQ-H3 red', async () => {
    expect(node(await qa(await mutated('reverse_lunge', 's => ({ ...s, trace: { ...s.trace, trim: [s.trace.trim[0], 60] } })')))).toContain('H3.trace');
  });
  it('A10 M4 the Mistake equal to the end pose, and M5 the start equal to the end, turn PQ-H3 red', async () => {
    expect(node(await qa(await mutated('reverse_lunge', 's => ({ ...s, mistake: { ...s.mistake, pose: {}, guides: [] } })')))).toContain('H3.mistake-outline');
    // M5 on the fly: reverse_lunge's selected shin guide cannot be spliced into a page whose start equals its end
    expect(node(await qa(await mutated('dumbbell_fly', 's => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] }, checks: s.checks.filter(k => k.pose !== "start") })')))).toContain('H3.start-is-end');
  });
  it('A10 M6 an unapproved type (rackUpright) as a moving line part, and M7 an unknown type, turn PQ-H9 red', async () => {
    const s = spec('reverse_lunge'), n = s.equipment.length;
    const extra = (lm: any, ctx: any) => ({ type: 'rackUpright', at: [0.5, 0, ctx.pose === 'mistake' ? -1.3 : -1.22], h: 0.5 });
    expect(node(await qa({ ...(await candOf('reverse_lunge')), spec: { ...s, equipment: [...s.equipment, extra] } })).some((k: string) => k.startsWith(`H9.moving-line:eq${n}.rackUpright.`))).toBe(true);
    expect(node(await qa({ ...(await candOf('reverse_lunge')), spec: { ...s, equipment: [...s.equipment, { type: 'rope3d', at: [0, 0, 0] }] } })).some((k: string) => k.startsWith('H9.type:'))).toBe(true);
  });
});

describe('PILOT-A3 A2 (part), A3 (pre-pin part): PILOT-A2 rebuilds to its pin; the PILOT-A3 page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('the PILOT-A2 page and its 2 x 9 fragments equal golden/library/pilot-a2.json (3e225bc1, 280,533 B)', async () => {
    const [G, b2] = await Promise.all(['../golden.mjs', 'pilot-a2/build.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    const g = readJson('tests/howto/golden/library/pilot-a2.json'), html = (await b2.buildPa2Page()).html, page = g.entries.find((e: any) => e.kind === 'page');
    expect([sha(html), html.length]).toEqual([page.pageSha256, page.bytes]);
    expect(page.pageSha256).toBe('3e225bc12531e6c395e5a532a77736ebaeb9cdc276c55709d8ac4c73ef78bb0b');
    const plates = G.extractPlates(html.toString('utf8'));
    let n = 0;
    for (const e of g.entries.filter((x: any) => x.kind === 'plate')) for (const [k, v] of Object.entries(G.fragmentsOf(plates.find((x: any) => x.chromeId === e.chromeId)))) { expect(v, `${e.id} ${k}`).toBe(e.fragments[k]); n++; }
    expect(n).toBe(18);
  });
  it('two builds of the PILOT-A3 page give the same sha256', async () => {
    const a = await build.buildPa3Page(), b = await build.buildPa3Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});

describe('PILOT-A3 A13: the moved assertions (D-A3-TESTHOME map)', () => {
  // lib8r-pilot-a2.test.ts @ bf4b8d4d line(s) -> the test here that carries it (verbatim or the named stricter form)
  const MOVED: [string, string][] = [
    [':13-15 IDS / ROWS / HELD_HERE', 'the rows file: the 2 ids once each, mode H, census view'],
    [':47 mode H per row', 'the rows file: the 2 ids once each, mode H, census view'],
    [':61-67 the held lines', 'each id keeps its held line in pilot-a/plates.json until the pin'],
    [':73-74 held ids added to PILOT-A2 rows are red (stricter: any PILOT-A2 file)', 'mutations: box_jump added, a duplicated row, and either id written into batches/pilot-a2.json are red'],
    [':85-87 the two ids\' plate facts', 'each card differs from its research copy (0d832e18) only in the three-key block'],
    [':128 seconds added to reverse_lunge\'s card and spec', "mutations: seconds added to reverse_lunge's card and spec, and dumbbell_fly's Lower seconds changed, are red"],
    [':134 RULED topFault keys', 'each Mistake has exactly one tell, the topFault key of a drawable card'],
    [':147-153 the tells name c18\'s / c13\'s fault', "reverse_lunge's tell names c18's fault on the low back (D-A3-REVTELL); dumbbell_fly's names c13's"],
    [':157-158 the old deep tell first on the fly', "mutations: the old deep tell first on dumbbell_fly, and reverse_lunge's topFault set to another key, are red"],
    [':162-170 normal plate and export sha (D-A3-REVEXPORT)', "reverse_lunge's normal plate is main's: export sha (normalised), a Mistake-view zoom only, and the normal render bytes"],
    [':171-174 REAR_HEEL mutation', 'mutation: REAR_HEEL 45 -> 46 moves the export sha and the normal render'],
    [':176-196 R5 the flare -> A3 the bow', 'A3: bow = M_ARCH = M_TILT = 12'],
    [':197-202 R5 mutations -> A3 mutations', 'A3 mutations: the held #340 Mistake (tilt 15, trunk -12), a 16° bow, and a number trunk in the end pose are red'],
    [':203-212 R11 the ring -> A4', 'A4: { view: mistake, k: 3 }, 12.31 px inside the zoom'],
    [':213-216 R11 mutation -> A4 mutations', 'A4 mutations: k 2.5 (10.26 px) and the held anchor'],
    [':246-264 the fly\'s views; makeFly', 'dumbbell_fly is the census front view; the alt imports'],
    [':259-263 the pitch and makeFly mutations', 'mutations: the pitch removed is red; makeFly renamed breaks the alt import'],
    [':266-278 sizes rows', 'each spec SIZES equals its pilot-a3/sizes.json row, both ways'],
    [':279-283 sizes mutations', 'mutations: M_WRIST 31 in the spec and a row dropped are red'],
    [':330-331 the zoom k', 'A4, A7 mutations: the next k down (reverse_lunge 2.5, dumbbell_fly 2) turns H3 red'],
  ];
  const mapProblems = (src: string) => MOVED.filter(([, t]) => !src.includes(`it('${t}`) && !src.includes(`it("${t}`)).map(([o]) => `${o}: no test here`);
  const own = () => readFileSync('tests/howto/lib8r-pilot-a3.test.ts', 'utf8');
  it('every moved line has its test here', () => {
    expect(mapProblems(own())).toEqual([]);
  });
  it('mutation: a moved assertion deleted from this file is red', () => {
    const src = own(), t = MOVED[11]![1];
    expect(mapProblems(src.replace(`it('${t}`, "it('gone")).length).toBeGreaterThan(0);
  });
  it('lib8r-pilot-a2.test.ts no longer names either id', () => {
    const a2 = readFileSync('tests/howto/lib8r-pilot-a2.test.ts', 'utf8');
    for (const id of IDS) expect(new RegExp(`\\b(lib_)?${id}\\b`).test(a2), id).toBe(false);
  });
});
void copy;
