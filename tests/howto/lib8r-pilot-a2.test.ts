// LIB-8R (lib-8r-card; acceptance A1, A5-A10, D-LIB8R-BJTELL, D-LIB17-SIZE rows): pilot A's held rows as the new batch
// PILOT-A2. Node only: the browser half of the plate QA runs in tools/plates/library/pilot-a2/qa.mjs. Every test reads
// what is drawn (the spec, the engine's landmarks and renders, runQa's own report), never a helper's own maths.
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const IDS = ['box_jump', 'reverse_lunge', 'dumbbell_fly', 'bent_over_dumbbell_rear_delt_fly'];
const STILL_HELD = ['barbell_shrug', 'incline_dumbbell_press'];   // D-LIB8R-SCOPE: routed to LIB-13s and LB2
const readJson = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (t: string | Buffer) => createHash('sha256').update(t).digest('hex');
const copy = (x: any) => JSON.parse(JSON.stringify(x));

let plate: any, body: any, eng: any, build: any, strip: any, validate: any;
const mods: Record<string, any> = {};
beforeAll(async () => {
  [plate, body, eng, build, strip, validate] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', 'engine.mjs',
    'pilot-a2/build.mjs', 'strip/tempo-strip.mjs', 'research/validate.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
  for (const id of [...IDS, 'dumbbell_fly__alt', 'bent_over_dumbbell_rear_delt_fly__alt']) mods[id] = await import(/* @vite-ignore */ lib(`specs/${id}.mjs`));
}, T);
const spec = (id: string) => mods[id].default;
const cardOf = (id: string) => readJson(`docs/research/howto/cards/${id}.json`);
const rowsPath = () => `tools/plates/library/pilot-a2/rows.json`;
/** A scratch copy of a spec's source with `edit` applied, imported from the specs folder so its imports resolve. */
const variant = async (id: string, edit: (src: string) => string) => {
  const src = readFileSync(`tools/plates/library/specs/${id}.mjs`, 'utf8'), out = edit(src);
  if (out === src) throw new Error(`variant: the edit changed nothing in ${id}`);
  const file = `tools/plates/library/specs/zz_lib8r_${id}_${process.pid}_${Date.now()}.mjs`;
  writeFileSync(file, out);
  try { return await import(/* @vite-ignore */ new URL(`../../${file}`, import.meta.url).href); } finally { rmSync(file, { force: true }); }
};

describe('LIB-8R A1: the PILOT-A2 rows hold exactly the drawn, unheld ids (D-LIB8R-SCOPE)', () => {
  const problems = (text: string) => {
    const j = JSON.parse(text), bad: string[] = [], ids = Object.keys(j.rows);
    if (JSON.stringify(ids) !== JSON.stringify(IDS.map(i => `lib_${i}`))) bad.push(`ids ${ids.join(',')}`);
    for (const id of IDS) if (text.split(`"lib_${id}"`).length !== 2) bad.push(`${id} not exactly once`);
    for (const id of STILL_HELD) if (text.includes(id)) bad.push(`${id} is still held`);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      if (r.mode !== 'H') bad.push(`${id}: mode ${r.mode}`);
      if (r.src !== `library/specs/${id.slice(4)}.mjs`) bad.push(`${id}: src ${r.src}`);
      if (IDS.includes(id.slice(4)) && r.view !== cardOf(id.slice(4)).plate.view) bad.push(`${id}: view ${r.view} is not the census view`);
      if (!['drawing', 'review'].includes(r.stage)) bad.push(`${id}: stage ${r.stage} before the pin`);
    }
    if (j.batch !== 'PILOT-A2' || j.censusRef !== '4a9fd86') bad.push('batch/censusRef');
    return bad;
  };
  const text = () => readFileSync(rowsPath(), 'utf8');
  it('rows.json: the 4 ids once each, mode H, census view, stage drawing or review; no still-held id in any PILOT-A2 file', () => {
    expect(problems(text())).toEqual([]);
    for (const f of ['rows.json', 'tempo.json', 'sizes.json', 'cards.sha.json']) for (const id of STILL_HELD) expect(readFileSync(`tools/plates/library/pilot-a2/${f}`, 'utf8'), `${f} ${id}`).not.toContain(id);
  });
  it('each still-held id keeps its held line in pilot-a/plates.json with its route', () => {
    const p = readJson('tools/plates/library/pilot-a/plates.json').plates;
    for (const id of STILL_HELD) expect(p.find((x: any) => x.id === id)?.held, id).toBeTruthy();
  });
  it('mutations: barbell_shrug added, incline_dumbbell_press added and a duplicated row are red', () => {
    const add = (id: string) => { const j = JSON.parse(text()); j.rows[`lib_${id}`] = { ...j.rows.lib_box_jump, src: `library/specs/${id}.mjs` }; return JSON.stringify(j, null, 1); };
    expect(problems(add('barbell_shrug')).length).toBeGreaterThan(0);
    expect(problems(add('incline_dumbbell_press')).length).toBeGreaterThan(0);
    expect(problems(text().replace('"lib_reverse_lunge": {', '"lib_box_jump_dup": { "x": "lib_box_jump" },\n  "lib_reverse_lunge": {')).length).toBeGreaterThan(0);
  });
});

describe('LIB-8R A6: the cards, the tempo map and the strip rows', () => {
  const cardsSha = readJson('tools/plates/library/pilot-a2/cards.sha.json');
  const BLOCK = /,\n( +)"plateFacts": [^\n]*,\n\1"tempo": [^\n]*,\n\1"topFault": [^\n]*\n}\n$/;
  const unkeyed = (text: string) => (BLOCK.test(text) ? text.replace(BLOCK, '\n}\n') : null);
  it('each card differs from its research copy (0d832e18) only in the three-key block; quotes are byte copies; validateCardFile []', () => {
    expect(cardsSha.researchHead).toBe('0d832e18a2c52ec091a37b654572db5f0468913b');
    for (const id of IDS) {
      const text = readFileSync(`docs/research/howto/cards/${id}.json`, 'utf8');
      expect(sha(unkeyed(text) ?? ''), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
      expect(validate.validateCardFile(`${id}.json`), id).toEqual([]);
      expect(JSON.parse(text).plateFacts, id).toEqual([]);   // D-LIB8M-NOFACTS: no number with a claim in plate.start or plate.end
    }
  });
  it('mutation: another card key edited is red', () => {
    const text = readFileSync('docs/research/howto/cards/box_jump.json', 'utf8').replace('"view": "side"', '"view": "front"');
    expect(sha(unkeyed(text) ?? '')).not.toBe(cardsSha.cards.box_jump);
  });
  const stripRows = (id: string) => readJson('tools/plates/library/strip/rows.json').cards.find((c: any) => c.id === id).rows;
  const tempoProblems = (cards: Record<string, any>, specs: Record<string, any>) => {
    const tj = readJson('tools/plates/library/pilot-a2/tempo.json'), bad: string[] = [];
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
  it("mutations: box_jump's Take-off word changed and seconds added to reverse_lunge's card and spec are red", () => {
    const a = clean(); a.cards.box_jump.tempo[0].word = 'Fast'; a.specs.box_jump = { ...a.specs.box_jump, tempo: a.cards.box_jump.tempo };
    expect(tempoProblems(a.cards, a.specs).length).toBeGreaterThan(0);
    const b = clean(); b.cards.reverse_lunge.tempo[0].s = 3; b.specs.reverse_lunge = { ...b.specs.reverse_lunge, tempo: b.cards.reverse_lunge.tempo };
    expect(tempoProblems(b.cards, b.specs).length).toBeGreaterThan(0);
  });
});

describe('LIB-8R A7, D-LIB8R-BJTELL: card truth, one tell per Mistake', () => {
  const RULED: Record<string, string> = { box_jump: 'straight', reverse_lunge: 'flare', dumbbell_fly: 'wrists', bent_over_dumbbell_rear_delt_fly: 'swing' };
  const tellProblems = (id: string, s: any, card: any) => {
    const bad: string[] = [], tells = s.mistake.tells;
    if (tells.length !== 1) bad.push(`${id}: ${tells.length} tells (one fault, one tell: D-LIB8R-BJTELL)`);
    if (card.topFault !== RULED[id]) bad.push(`${id}: topFault ${card.topFault}`);
    if (card.plate.mistake.drawable ? tells[0].key !== card.topFault : tells[0].key === card.topFault) bad.push(`${id}: first tell ${tells[0].key} vs topFault ${card.topFault}`);
    return bad;
  };
  it('each Mistake has exactly one tell; drawable cards: it is the topFault key; the rear-delt fly: drawable false, topFault swing, drawn shrug', () => {
    for (const id of IDS) expect(tellProblems(id, spec(id), cardOf(id)), id).toEqual([]);
    expect(cardOf('bent_over_dumbbell_rear_delt_fly').plate.mistake.drawable).toBe(false);
    expect(spec('bent_over_dumbbell_rear_delt_fly').mistake.tells[0].key).toBe('shrug');
  });
  it("reverse_lunge's tell names c18's fault; dumbbell_fly's names c13's", () => {
    expect(cardOf('reverse_lunge').plate.mistake.claim).toBe('c18');
    expect(spec('reverse_lunge').mistake.tells[0].text).toMatch(/Ribs flare/);
    expect(cardOf('reverse_lunge').claims.find((c: any) => c.id === 'c18').text).toMatch(/flaring the ribcage/);
    expect(cardOf('dumbbell_fly').plate.mistake.claim).toBe('c13');
    expect(spec('dumbbell_fly').mistake.tells[0].text).toMatch(/Wrists bend/);
  });
  it('mutations: a second tell on the same fault (box_jump stiff), the old deep tell first on dumbbell_fly, and topFault = shrug are red', () => {
    const bj = spec('box_jump');
    expect(tellProblems('box_jump', { ...bj, mistake: { ...bj.mistake, tells: [...bj.mistake.tells, { key: 'stiff', text: 'Stiff landing', anchor: 'buttock' }] } }, cardOf('box_jump')).length).toBeGreaterThan(0);
    const fl = spec('dumbbell_fly');
    expect(tellProblems('dumbbell_fly', { ...fl, mistake: { ...fl.mistake, tells: [{ key: 'deep', text: 'Below<br>the chest', anchor: 'grip.r' }, ...fl.mistake.tells] } }, cardOf('dumbbell_fly')).length).toBeGreaterThan(0);
    const rd = cardOf('bent_over_dumbbell_rear_delt_fly'); rd.topFault = 'shrug';
    expect(tellProblems('bent_over_dumbbell_rear_delt_fly', spec('bent_over_dumbbell_rear_delt_fly'), rd).length).toBeGreaterThan(0);
  });
  // D-LIB8R-REVLUNGE: the export minus mistake, tempo, pilot and zoom (a Mistake-view zoom: the zoom field draws only on
  // the Mistake view) is main c7bdad7a's; the normal render's svg and overlay are main's bytes (measured at c7bdad7a).
  const exportSha = (s: any) => { const { mistake, tempo, pilot, zoom, ...rest } = s; return sha(JSON.stringify(rest)); };
  const NORMAL = { svg: '0744dcf3b2b2ffaae46452a9921adfe09ff45f61f268f98353791e63998b2df9', overlay: 'cbf84381abccc3ff48d647c82c3e691717d347dfbc561ef2c2ee3d65027888c3' };
  it("reverse_lunge's normal plate is main's: export sha, a Mistake-view zoom only, and the normal render bytes", () => {
    const s = spec('reverse_lunge');
    expect(exportSha(s)).toBe('026964f91f030268d49bc52cf1adf46c265d9fcd27349e01e30c6f3bc87cc0dd');
    expect(s.zoom).toEqual({ view: 'mistake', k: 1.5 });
    const n = plate.renderPlate(s, { id: 'x-n' });
    expect({ svg: sha(n.svg), overlay: sha(n.overlay) }).toEqual(NORMAL);
  });
  it('mutation: REAR_HEEL 45 -> 46 moves the export sha and the normal render', async () => {
    const m = await variant('reverse_lunge', src => src.replace('const REAR_HEEL = 45;', 'const REAR_HEEL = 46;'));
    expect(exportSha(m.default)).not.toBe('026964f91f030268d49bc52cf1adf46c265d9fcd27349e01e30c6f3bc87cc0dd');
    expect(sha(plate.renderPlate(m.default, { id: 'x-n' }).svg)).not.toBe(NORMAL.svg);
  });
});

describe('LIB-8R A8: the airborne convention on box_jump (D-LIB8R-AIR)', () => {
  const H = 1.75, BOX_H = 0.45;
  const supported = (lm: any, side: string) => ['heel', 'ball'].some(p => Math.abs(lm[`${p}.${side}`][1]) < 0.005 || Math.abs(lm[`${p}.${side}`][1] - BOX_H) < 0.005);
  const airProblems = (s: any) => {
    const bad: string[] = [], via = s.poses.via, ghost = via[(via.length - 1) / 2];
    if (s.ghosts.count !== 1 || via.length % 2 !== 1) bad.push('the one ghost is not the middle via pose');
    const g = eng.landmarksOf(ghost, H);
    for (const sd of ['l', 'r']) if (Math.abs(g[`ball.${sd}`][1]) > 0.005) bad.push(`ghost ball.${sd} ${(g[`ball.${sd}`][1] * 100).toFixed(2)} cm off the floor`);
    const st = eng.landmarksOf(s.poses.start, H), en = eng.landmarksOf(s.poses.end, H);
    for (const sd of ['l', 'r']) {
      if (Math.abs(st[`heel.${sd}`][1]) > 0.005 || Math.abs(st[`ball.${sd}`][1]) > 0.005) bad.push(`start ${sd} foot off the floor`);
      if (Math.abs(en[`heel.${sd}`][1] - BOX_H) > 0.005 || Math.abs(en[`ball.${sd}`][1] - BOX_H) > 0.005) bad.push(`end ${sd} foot off the box`);
    }
    const drawn: [string, any][] = [['start', s.poses.start], ['end', s.poses.end], ['ghost', ghost], ['mistake', { ...s.poses.end, ...s.mistake.pose }]];
    for (const [k, p] of drawn) { const lm = eng.landmarksOf(p, H); if (!supported(lm, 'l') && !supported(lm, 'r')) bad.push(`${k}: both feet off every support`); }
    return bad;
  };
  it('start feet on the floor, end feet on the box, the full-extension ghost on the balls, no drawn pose off every support', () => {
    expect(airProblems(spec('box_jump'))).toEqual([]);
  });
  it('mutation: the ghost root raised 2 cm is red', () => {
    const s = spec('box_jump'), via = s.poses.via.slice(), i = (via.length - 1) / 2;
    via[i] = { ...via[i], plant: undefined, root: { ...via[i].root, at: [via[i].root.at[0], via[i].root.at[1] + 0.02, via[i].root.at[2]] } };
    expect(airProblems({ ...s, poses: { ...s.poses, via } }).length).toBeGreaterThan(0);
  });
});

describe('LIB-8R A9: the views (D-LIB8R-FLIES)', () => {
  const viewProblems = (fly: any, rd: any, rdAlt: any) => {
    const bad: string[] = [];
    if (fly.view !== 'front' || fly.camera?.pitch !== 45 || fly.torso !== 'volume') bad.push('dumbbell_fly: not the census front view at pitch 45 with the volume trunk');
    if (rdAlt.view !== 'front' || rdAlt.camera?.pitch !== 15 || rdAlt.torso !== 'volume') bad.push('rear-delt front view: not pitch 15 with the volume trunk');
    if (rd.view !== 'side' || rd.mistake.tells[0].key !== 'shrug' || JSON.stringify(rd.mistake.pose) !== JSON.stringify(rdAlt.mistake.pose)) bad.push('rear-delt fallback: not the side view with the card\'s own Mistake unchanged');
    return bad;
  };
  it("dumbbell_fly is the census front view; the rear-delt plate is the side fallback with the front view's own Mistake; the alts import", () => {
    expect(viewProblems(spec('dumbbell_fly'), spec('bent_over_dumbbell_rear_delt_fly'), spec('bent_over_dumbbell_rear_delt_fly__alt'))).toEqual([]);
    expect(spec('dumbbell_fly__alt').view).toBe('side');
    expect(typeof mods.bent_over_dumbbell_rear_delt_fly.posesAt).toBe('function');
  });
  it('mutations: the pitch removed is red; makeFly renamed breaks the alt import', async () => {
    const fl = spec('dumbbell_fly');
    expect(viewProblems({ ...fl, camera: { ...fl.camera, pitch: undefined } }, spec('bent_over_dumbbell_rear_delt_fly'), spec('bent_over_dumbbell_rear_delt_fly__alt')).length).toBeGreaterThan(0);
    await expect(variant('dumbbell_fly', src => src.replace('export function makeFly(', 'export function makeFly2('))).rejects.toThrow(/makeFly/);
  });
});

describe('LIB-8R sizes (D-LIB17-SIZE form): each spec SIZES equals its pilot-a2/sizes.json row', () => {
  const sizes = readJson('tools/plates/library/pilot-a2/sizes.json').ids;
  const sizeProblems = (id: string, S: any) => {
    const want = Object.fromEntries(Object.entries<any>(sizes[id]).map(([k, v]) => [k, v.value])), bad: string[] = [];
    if (JSON.stringify(S) !== JSON.stringify(want)) bad.push(`${id}: SIZES ${JSON.stringify(S)}`);
    for (const [k, v] of Object.entries<any>(sizes[id])) if (!v.basis || /PQ-H3/.test(v.basis.replace('PQ-H3 is never', ''))) bad.push(`${id}.${k}: basis`);
    return bad;
  };
  it('both ways, every row with a basis', () => {
    expect(Object.keys(sizes).sort()).toEqual([...IDS].sort());
    for (const id of IDS) expect(sizeProblems(id, mods[id].SIZES), id).toEqual([]);
  });
  it('mutations: M_WRIST changed in the spec and a row dropped are red', () => {
    expect(sizeProblems('dumbbell_fly', { ...mods.dumbbell_fly.SIZES, M_WRIST: 31 }).length).toBeGreaterThan(0);
    const { M_ARCH, ...rest } = mods.reverse_lunge.SIZES;
    expect(sizeProblems('reverse_lunge', rest).length).toBeGreaterThan(0);
  });
});

describe('LIB-8R A5, A10: runQa node half on each PILOT-A2 plate, the zooms, LIB-3 M3-M5', { timeout: T }, () => {
  let cand: any, qaEng: any, qaIdx: any, golden: any, mirror: any, E: any, all: any, html: string, pins: any;
  beforeAll(async () => {
    [cand, qaEng, qaIdx, golden] = await Promise.all(['candidate.mjs', 'qa/engine.mjs', 'qa/index.mjs', '../golden.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    mirror = golden.makeMirror(); E = await qaEng.loadEngine(mirror); all = build.pa2All(); pins = qaIdx.loadPins();
    html = (await build.buildPa2Page({ all })).html.toString('utf8');
    return () => qaEng.dropMirror(mirror);
  }, T);
  const node = (r: any) => qaIdx.HARD.flatMap((h: string) => r.hard[h].problems.map((p: any) => p.key)).filter((k: string) => k !== 'browser:not-run');
  const candOf = (id: string) => cand.candidateOf(`lib_${id}`, { all, platesHtml: html, engine: E, authoring: true });
  const qa = async (c: any) => qaIdx.runQa(c, { engine: E, pins });
  // A spec mutation built the way the page builds it (lb7-plates.test.ts's pattern): a scratch module that imports the
  // real spec and applies fn, drawn on its own page, so the candidate's plate and zoom come from the mutated spec.
  const mutated = async (id: string, fn: string) => {
    const dir = mkdtempSync(join(tmpdir(), 'lib8r-mut-')), file = join(dir, `${id}.mjs`);
    writeFileSync(file, `import s from ${JSON.stringify(lib(`specs/${id}.mjs`))};\nconst fn = ${fn};\nexport default fn(s);\n`);
    try {
      const cid = (await import(/* @vite-ignore */ lib('plates-page.mjs'))).cardIdOf(all.find((r: any) => r.id === `lib_${id}`));
      const { html: h } = await (await import(/* @vite-ignore */ lib('build-page.mjs'))).buildPlatesPage({
        groups: [{ id: 'pilot-a2', title: 'Pilot A2', ids: [cid] }], sources: { [cid]: ['mutation'] }, specs: { [cid]: file } });
      return { ...(await cand.candidateOf(`lib_${id}`, { all, platesHtml: h.toString('utf8'), engine: E, authoring: true })), spec: (await import(/* @vite-ignore */ `file://${file}`)).default };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  // F7 is raised only on the drawable-false rear-delt fly (decision 9); F6 only on its side fallback (D-LIB8R-FLIES).
  const RULED_NODE: Record<string, string[]> = { box_jump: [], reverse_lunge: [], dumbbell_fly: [], bent_over_dumbbell_rear_delt_fly: ['F6', 'F7'] };
  const ruledProblems = (id: string, r: any) => ['F6', 'F7'].filter(f => r.flags[f].raised !== RULED_NODE[id]!.includes(f)).map(f => `${id}: ${f}`);
  it.each(IDS)('%s: every node hard check passes with zero exemptions; F6 and F7 are the ruled set', async id => {
    const r = await qa(await candOf(id));
    expect(node(r)).toEqual([]);
    expect(ruledProblems(id, r)).toEqual([]);
  });
  it('A5 mutation: the rear-delt card with topFault set to the drawn key turns the expected set red', async () => {
    const c = await candOf('bent_over_dumbbell_rear_delt_fly'), r = await qa({ ...c, research: { ...c.research, topFault: 'shrug' } });
    expect(ruledProblems('bent_over_dumbbell_rear_delt_fly', r).length).toBeGreaterThan(0);
  });
  it('A10: each zoom is the planned Mistake-view zoom, at the smallest passing k', () => {
    expect(spec('reverse_lunge').zoom).toEqual({ view: 'mistake', k: 1.5 });
    expect(spec('dumbbell_fly').zoom).toEqual({ view: 'mistake', k: 2 });
    expect(spec('bent_over_dumbbell_rear_delt_fly').zoom).toEqual({ view: 'mistake', k: 2 });
    expect(spec('box_jump').zoom).toBeUndefined();
  });
  it('A10 mutations: k below the bar on dumbbell_fly and the rear-delt fly turns H3 red', async () => {
    for (const id of ['dumbbell_fly', 'bent_over_dumbbell_rear_delt_fly']) {
      const c = await mutated(id, 's => ({ ...s, zoom: { ...s.zoom, k: 1.5 } })');
      expect(node(await qa(c)), id).toContain('H3.zoom:deviation');
    }
  });
  it('A5 M4 the Mistake equal to the end pose, and M5 the start equal to the end, turn PQ-H3 red (reverse_lunge, box_jump)', async () => {
    expect(node(await qa(await mutated('reverse_lunge', 's => ({ ...s, mistake: { ...s.mistake, pose: {}, guides: [] }, zoom: undefined })')))).toContain('H3.mistake-outline');
    expect(node(await qa(await mutated('box_jump', 's => ({ ...s, poses: { ...s.poses, start: s.poses.end, via: [] }, checks: s.checks.filter(k => k.pose !== "start") })')))).toContain('H3.start-is-end');
  });
});

describe('LIB-8R A3 (pre-pin part): the PILOT-A2 page is deterministic (PQ-H7)', { timeout: T }, () => {
  it('two builds give the same sha256', async () => {
    const a = await build.buildPa2Page(), b = await build.buildPa2Page();
    expect(sha(a.html)).toBe(sha(b.html));
  });
});
void body; void copy;
