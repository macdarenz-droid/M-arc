// LIB-8R (lib-8r-card; acceptance A1, A5-A10, D-LIB8R-BJTELL, D-LIB17-SIZE rows): pilot A's held rows as the new batch
// PILOT-A2. Node only: the browser half of the plate QA runs in tools/plates/library/pilot-a2/qa.mjs. Every test reads
// what is drawn (the spec, the engine's landmarks and renders, runQa's own report), never a helper's own maths.
import { createHash } from 'node:crypto';
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
const IDS = ['box_jump', 'reverse_lunge', 'dumbbell_fly', 'bent_over_dumbbell_rear_delt_fly'];   // the 4 drawn specs and cards
const ROWS = ['box_jump', 'bent_over_dumbbell_rear_delt_fly'];   // PILOT-A2's pinned rows: reverse_lunge (F-REVLUNGE-ARCH) and dumbbell_fly (F-FLY-START) are held (#340 6540319537)
const HELD_HERE = ['reverse_lunge', 'dumbbell_fly'];
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
const rowsPath = () => `tools/plates/library/batches/pilot-a2.json`;   // the pin (Do 7) deleted pilot-a2/rows.json
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
    if (JSON.stringify(ids) !== JSON.stringify(ROWS.map(i => `lib_${i}`))) bad.push(`ids ${ids.join(',')}`);
    for (const id of ROWS) if (text.split(`"lib_${id}"`).length !== 2) bad.push(`${id} not exactly once`);
    for (const id of [...STILL_HELD, ...HELD_HERE]) if (new RegExp(`\\b${id}\\b`).test(text)) bad.push(`${id} is still held`);
    for (const [id, r] of Object.entries<any>(j.rows)) {
      if (r.mode !== 'H') bad.push(`${id}: mode ${r.mode}`);
      if (r.src !== `library/specs/${id.slice(4)}.mjs`) bad.push(`${id}: src ${r.src}`);
      if (IDS.includes(id.slice(4)) && r.view !== cardOf(id.slice(4)).plate.view) bad.push(`${id}: view ${r.view} is not the census view`);
      if (r.stage !== 'approved-plate') bad.push(`${id}: stage ${r.stage}, not approved-plate after the pin`);
    }
    if (j.batch !== 'PILOT-A2' || j.censusRef !== '4a9fd86') bad.push('batch/censusRef');
    return bad;
  };
  const text = () => readFileSync(rowsPath(), 'utf8');
  it('batches/pilot-a2.json: the 2 pinned ids once each, mode H, census view, approved-plate; no still-held id in any PILOT-A2 file', () => {
    expect(problems(text())).toEqual([]);
    for (const f of ['tempo.json', 'sizes.json', 'cards.sha.json']) for (const id of STILL_HELD) expect(readFileSync(`tools/plates/library/pilot-a2/${f}`, 'utf8'), `${f} ${id}`).not.toContain(id);
    expect(existsSync('tools/plates/library/pilot-a2/rows.json')).toBe(false);
  });
  it('each still-held id keeps its held line in pilot-a/plates.json with its route; reverse_lunge names F-REVLUNGE-ARCH', () => {
    const p = readJson('tools/plates/library/pilot-a/plates.json').plates;
    for (const id of STILL_HELD) expect(p.find((x: any) => x.id === id)?.held, id).toBeTruthy();
    expect(p.find((x: any) => x.id === 'reverse_lunge')?.held).toMatch(/F-REVLUNGE-ARCH/);
    expect(p.find((x: any) => x.id === 'dumbbell_fly')?.held).toMatch(/F-FLY-START/);
    for (const id of ROWS) expect(p.find((x: any) => x.id === id)?.held, id).toMatch(/^moved: pinned in PILOT-A2/);
  });
  it('mutations: barbell_shrug added, incline_dumbbell_press added and a duplicated row are red', () => {
    const add = (id: string) => { const j = JSON.parse(text()); j.rows[`lib_${id}`] = { ...j.rows.lib_box_jump, src: `library/specs/${id}.mjs` }; return JSON.stringify(j, null, 1); };
    expect(problems(add('barbell_shrug')).length).toBeGreaterThan(0);
    expect(problems(add('incline_dumbbell_press')).length).toBeGreaterThan(0);
    expect(problems(text().replace('"lib_bent_over_dumbbell_rear_delt_fly": {', '"lib_box_jump_dup": { "x": "lib_box_jump" },\n  "lib_bent_over_dumbbell_rear_delt_fly": {')).length).toBeGreaterThan(0);
    expect(problems(add('reverse_lunge')).length, 'the held reverse_lunge added').toBeGreaterThan(0);
    expect(problems(add('dumbbell_fly')).length, 'the held dumbbell_fly added').toBeGreaterThan(0);
  });
});

describe('LIB-8R A6: the cards, the tempo map and the strip rows', () => {
  const cardsSha = readJson('tools/plates/library/pilot-a2/cards.sha.json');
  const BLOCK = /,\n( +)"plateFacts": [^\n]*,\n\1"tempo": [^\n]*,\n\1"topFault": [^\n]*\n}\n$/;
  const unkeyed = (text: string) => (BLOCK.test(text) ? text.replace(BLOCK, '\n}\n') : null);
  // D-LIB8R-FACTS2 (CARD FIELDS cfpa2, #340): every contact a quote states for a drawn pose is a contact fact.
  const FACTS: Record<string, string[]> = {
    box_jump: ['contact sole.l start start c2', 'contact sole.r start start c2', 'contact sole.l end end c4', 'contact sole.r end end c4'],
    reverse_lunge: ['contact toe.l end end c4'],
    dumbbell_fly: ['contact backUpper start start c2', 'contact buttock start start c2', 'contact backUpper end end c2', 'contact buttock end end c2',
      'contact backUpper start start c1', 'contact buttock start start c1', 'contact wrist.r start start c3', 'contact wrist.l start start c3'],
    bent_over_dumbbell_rear_delt_fly: ['contact wrist.r start start c1', 'contact wrist.l start start c1'],
  };
  it('each card differs from its research copy (0d832e18) only in the three-key block; quotes are byte copies; validateCardFile []', () => {
    expect(cardsSha.researchHead).toBe('0d832e18a2c52ec091a37b654572db5f0468913b');
    for (const id of IDS) {
      const text = readFileSync(`docs/research/howto/cards/${id}.json`, 'utf8');
      expect(sha(unkeyed(text) ?? ''), id).toBe(cardsSha.cards[id]);
      expect(sha(readFileSync(`docs/research/howto/quotes/${id}.json`)), id).toBe(cardsSha.quotes[id]);
      expect(validate.validateCardFile(`${id}.json`), id).toEqual([]);
      expect(JSON.parse(text).plateFacts.map((f: any) => `${f.kind} ${f.landmark} ${f.pose} ${f.cardPose} ${f.claim}`), id).toEqual(FACTS[id]);
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
    expect(s.zoom).toEqual({ view: 'mistake', k: 2.5 });
    const n = plate.renderPlate(s, { id: 'x-n' });
    expect({ svg: sha(n.svg), overlay: sha(n.overlay) }).toEqual(NORMAL);
  });
  it('mutation: REAR_HEEL 45 -> 46 moves the export sha and the normal render', async () => {
    const m = await variant('reverse_lunge', src => src.replace('const REAR_HEEL = 45;', 'const REAR_HEEL = 46;'));
    expect(exportSha(m.default)).not.toBe('026964f91f030268d49bc52cf1adf46c265d9fcd27349e01e30c6f3bc87cc0dd');
    expect(sha(plate.renderPlate(m.default, { id: 'x-n' }).svg)).not.toBe(NORMAL.svg);
  });
});

describe('LIB-8R reverse_lunge panel mx5: a true rib flare at true size, and a ring on the waist and lower ribs', () => {
  const H = 1.75;
  // The flare (R5): the lumbar extension is exactly M_ARCH (12°, true size), the thorax keeps the end pose's angle, the
  // rib front (chest) and the lower back (backMid) move forward of the end pose's (the low back concave, the ribs out).
  const flareProblems = (s: any, S: any) => {
    const bad: string[] = [], e = s.poses.end, m = { ...e, ...s.mistake.pose };
    if (m.trunk !== -S.M_ARCH || S.M_ARCH !== 12) bad.push(`lumbar extension ${-m.trunk} is not the true 12°`);
    if (Math.abs((m.root.tilt + m.trunk) - (e.root.tilt + e.trunk)) > 1e-9) bad.push('the thorax angle moved (a lean, not a flare)');
    const a = eng.landmarksOf(e, H), b = eng.landmarksOf(m, H);
    for (const k of ['chest', 'backMid']) if (!(b[k][2] - a[k][2] >= 0.02)) bad.push(`${k} is not 2 cm or more forward of the end pose (${((b[k][2] - a[k][2]) * 100).toFixed(1)} cm)`);
    for (const k of ['hip.r', 'hip.l', 'knee.r', 'knee.l', 'ankle.r', 'ankle.l']) if (Math.hypot(...b[k].map((v: number, i: number) => v - a[k][i])) > 1e-6) bad.push(`${k} moved`);
    return bad;
  };
  it('R5: lumbar arch 12°, thorax angle kept, rib front and low back forward, hips and legs unmoved', () => {
    expect(flareProblems(spec('reverse_lunge'), mods.reverse_lunge.SIZES)).toEqual([]);
  });
  it('R5 mutations: the old lean-back (pelvis not tipped) and an enlarged arch (16°) are red', () => {
    const s = spec('reverse_lunge'), m = s.mistake.pose;
    const lean = { ...m, root: { ...m.root, tilt: s.poses.end.root.tilt }, shoulder: { flex: s.poses.end.root.tilt - 12 } };
    expect(flareProblems({ ...s, mistake: { ...s.mistake, pose: lean } }, mods.reverse_lunge.SIZES).length).toBeGreaterThan(0);
    expect(flareProblems({ ...s, mistake: { ...s.mistake, pose: { ...m, trunk: -16 } } }, { ...mods.reverse_lunge.SIZES, M_ARCH: 16 }).length).toBeGreaterThan(0);
  });
  // The ring (R11): zoomOf's own source ring holds the end pose's elbow dot, the lower back and the rib front.
  const ringProblems = async (s: any) => {
    const Z = await import(/* @vite-ignore */ lib('zoom/inline.mjs')), z = Z.zoomOf(s, { prefix: 'x' }), P = (w: number[]) => [s.camera.x0 + w[2]! * 146.29, s.camera.y0 - w[1]! * 146.29];
    const lm = eng.landmarksOf(s.poses.end, H), bad: string[] = [];
    const ribFront = lm.chest.map((v: number, i: number) => v + (lm.navel[i] - v) * 0.5);   // the lower-rib front, between the chest and the navel
    for (const [k, w] of [['elbow.r', lm['elbow.r']], ['backMid', lm.backMid], ['lower-rib front', ribFront]] as const) { const p = P(w as number[]); if (Math.hypot(p[0] - z.src.c[0], p[1] - z.src.c[1]) > z.src.r) bad.push(`${k} outside the ring`); }
    return bad;
  };
  it('R11: the ring holds the elbow dot, the low back and the rib front', async () => {
    expect(await ringProblems(spec('reverse_lunge'))).toEqual([]);
  });
  it("R11 mutation: round 1's ring (the chest-backMid anchor) is red", async () => {
    const s = spec('reverse_lunge');
    expect((await ringProblems({ ...s, mistake: { ...s.mistake, tells: s.mistake.tells.map((t: any) => ({ ...t, anchor: { along: ['chest', 'backMid'], t: 0.5, pose: 'mistake' } })) } })).length).toBeGreaterThan(0);
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
  // after the pin (Do 7) the default path: no authoring flag, the pinned exemptions apply (A5)
  const candOf = (id: string) => cand.candidateOf(`lib_${id}`, { all, platesHtml: html, engine: E });
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
      return { ...(await cand.candidateOf(`lib_${id}`, { all, platesHtml: h.toString('utf8'), engine: E })), spec: (await import(/* @vite-ignore */ `file://${file}`)).default };
    } finally { rmSync(dir, { recursive: true, force: true }); }
  };
  // F7 is raised only on the drawable-false rear-delt fly (decision 9); F6 only on its side fallback (D-LIB8R-FLIES).
  const RULED_NODE: Record<string, string[]> = { box_jump: [], bent_over_dumbbell_rear_delt_fly: ['F6', 'F7'] };
  const ruledProblems = (id: string, r: any) => ['F6', 'F7'].filter(f => r.flags[f].raised !== RULED_NODE[id]!.includes(f)).map(f => `${id}: ${f}`);
  it.each(ROWS)('%s: every node hard check passes with zero exemptions; F6 and F7 are the ruled set', async id => {
    const r = await qa(await candOf(id));
    expect(node(r)).toEqual([]);
    expect(ruledProblems(id, r)).toEqual([]);
    // the pinned exemptions cover every raised flag (the browser half, run in pilot-a2/qa.mjs's default path, gives ok)
    expect(qaIdx.FLAGS.filter((f: string) => r.flags[f].blocks)).toEqual([]);
  });
  it("A6 mutations: box_jump's end sole.l fact moved to the Mistake pose (no check there), and the rear-delt fly's wrist facts moved to the end pose, turn PQ-H6 red", async () => {
    const bj = await candOf('box_jump'), rd = await candOf('bent_over_dumbbell_rear_delt_fly');
    const f = (c: any, g: (x: any) => any) => ({ ...c, research: { ...c.research, plateFacts: c.research.plateFacts.map(g) } });
    expect(node(await qa(f(bj, (x: any) => (x.landmark === 'sole.l' && x.pose === 'end' ? { ...x, pose: 'mistake' } : x)))).some((k: string) => k.startsWith('H6.fact:'))).toBe(true);
    expect(node(await qa(f(rd, (x: any) => ({ ...x, pose: 'end' })))).some((k: string) => k.startsWith('H6.fact:'))).toBe(true);
  });
  it('A5 mutation: the rear-delt card with topFault set to the drawn key turns the expected set red', async () => {
    const c = await candOf('bent_over_dumbbell_rear_delt_fly'), r = await qa({ ...c, research: { ...c.research, topFault: 'shrug' } });
    expect(ruledProblems('bent_over_dumbbell_rear_delt_fly', r).length).toBeGreaterThan(0);
  });
  it('A10: each zoom is the planned Mistake-view zoom, at the smallest passing k', () => {
    expect(spec('reverse_lunge').zoom).toEqual({ view: 'mistake', k: 2.5 });
    expect(spec('dumbbell_fly').zoom).toEqual({ view: 'mistake', k: 2.5 });
    expect(spec('bent_over_dumbbell_rear_delt_fly').zoom).toEqual({ view: 'mistake', k: 2 });
    expect(spec('box_jump').zoom).toBeUndefined();
  });
  it('A10 mutations: the next k down on the rear-delt fly turns H3 red', async () => {
    for (const [id, k] of [['bent_over_dumbbell_rear_delt_fly', 1.5]] as const) {
      const c = await mutated(id, `s => ({ ...s, zoom: { ...s.zoom, k: ${k} } })`);
      expect(node(await qa(c)), id).toContain('H3.zoom:deviation');
    }
  });
  it('A5 M4 the Mistake equal to the end pose, and M5 the start equal to the end, turn PQ-H3 red (box_jump)', async () => {
    expect(node(await qa(await mutated('box_jump', 's => ({ ...s, mistake: { ...s.mistake, pose: {}, guides: [] } })')))).toContain('H3.mistake-outline');
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

describe('LIB-8R A2, A3, A12, A13: the PILOT-A2 pin (Do 7) and the untouched pilot A and pilot B pins', { timeout: T }, () => {
  let G: any, BG: any, reg: any, scratch: any, all: any;
  beforeAll(async () => {
    [G, BG, reg, scratch] = await Promise.all(['../golden.mjs', 'batch-golden.mjs', 'registry.mjs', 'ci/scratch.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
    all = reg.rows();
  }, T);
  const GOLDEN = () => JSON.parse(readFileSync('tests/howto/golden/GOLDEN.json', 'utf8')).entries;
  const file = () => readJson('tests/howto/golden/library/pilot-a2.json');
  /** A3: chain, the page entry equal to the built page, each plate entry's 9 fragments equal to extractPlates of it. */
  const chainProblems = async (f: any) => {
    const bad = [...G.verifyBatchChain(f, GOLDEN())];
    const pages = f.entries.filter((e: any) => e.kind === 'page'), html = (await build.buildPa2Page()).html;
    if (pages.length !== 1 || pages[0].pageSha256 !== sha(html) || pages[0].bytes !== html.length) bad.push('page entry != the built page');
    if (f.entries.some((e: any) => e.kind === 'layers-page')) bad.push('a layers-page entry');
    const plates = G.extractPlates(html.toString('utf8'));
    for (const e of f.entries.filter((x: any) => x.kind === 'plate')) {
      const p = plates.find((x: any) => x.chromeId === e.chromeId);
      if (!p || JSON.stringify(G.fragmentsOf(p)) !== JSON.stringify(e.fragments)) bad.push(`${e.id}: fragments`);
      if (e.approvedBy !== 'supervisor' || e.decision !== 'D-LIB-PILOTA2' || e.supersedes !== null) bad.push(`${e.id}: approval`);
    }
    if (JSON.stringify(f.entries.filter((e: any) => e.kind === 'plate').map((e: any) => e.id)) !== JSON.stringify(ROWS.map(i => `lib_${i}`))) bad.push('plate ids');
    const text = JSON.stringify(f) + readFileSync(rowsPath(), 'utf8') + readFileSync('tools/plates/library/pages/pilot-a2.json', 'utf8');
    // other batches' ids, their held ones (pilot B's crunch) included
    for (const id of [...all.filter((r: any) => r.batchFile && !r.batchFile.endsWith('/pilot-a2.json')).map((r: any) => r.id),
      ...[...scratch.PILOT_A, ...scratch.PILOT_B].map((n: string) => `lib_${n}`)]) if (new RegExp(`\\b${id}\\b`).test(text)) bad.push(`names ${id}`);
    return bad;
  };
  it('A3: the chain is valid, the page entry is the two-build page, each plate entry equals its fragments, no layers entry or file', async () => {
    expect(await chainProblems(file())).toEqual([]);
    expect(existsSync('tests/howto/golden/library/pilot-a2.layers.html')).toBe(false);
    expect(existsSync('tools/plates/library/pages/pilot-a2.layers.json')).toBe(false);
  });
  it('A3 mutations: a second page entry superseding 0 by the supervisor, one fragment edited, a layers-page entry and "lib_crunch" are red', async () => {
    const f0 = file();
    const sup = { ...f0, entries: G.appendEntry(f0.entries, { ...f0.entries[0], prev: undefined, supersedes: 0 }) };
    expect(G.verifyBatchChain(sup, GOLDEN()).length).toBeGreaterThan(0);
    const frag = copy(f0); frag.entries[1].fragments.normalSvg = '0'.repeat(64);
    expect((await chainProblems(frag)).length).toBeGreaterThan(0);
    const lay = copy(f0); lay.entries.push({ kind: 'layers-page' });
    expect((await chainProblems(lay)).length).toBeGreaterThan(0);
    const named = copy(f0); named.entries[1].why += ' "lib_crunch"';
    expect((await chainProblems(named)).some((p: string) => /lib_crunch/.test(p))).toBe(true);
  });
  it('A2: pilot A and pilot B rebuild to their pinned pages, and each pinned plate equals its golden fragments (153 equalities)', async () => {
    let n = 0;
    for (const b of ['pilot-a', 'pilot-b']) {
      const row = all.find((r: any) => r.batchFile === `tools/plates/library/batches/${b}.json`), html = await BG.platesPage(row, all);
      const plates = G.extractPlates(html), g = readJson(`tests/howto/golden/library/${b}.json`);
      for (const e of g.entries.filter((x: any) => x.kind === 'plate')) {
        const p = plates.find((x: any) => x.chromeId === e.chromeId);
        for (const [k, v] of Object.entries(G.fragmentsOf(p))) { expect(v, `${e.id} ${k}`).toBe(e.fragments[k]); n++; }
      }
    }
    expect(n).toBe(153);
  });
  it('A12: no PILOT-A2 row is shipped; mutation: one row set to shipped is caught', () => {
    const rowsOf = (t: any) => Object.values(t.rows).map((r: any) => r.stage);
    expect(rowsOf(readJson(rowsPath()))).toEqual(['approved-plate', 'approved-plate']);
    const m = readJson(rowsPath()); m.rows.lib_box_jump.stage = 'shipped';
    expect(rowsOf(m).includes('shipped')).toBe(true);
  });
  it('A13: the scratch set refuses PILOT-A2 ids (mutation: target lib_box_jump)', () => {
    expect(scratch.setProblems(scratch.SCRATCH_4C)).toEqual([]);
    const set = scratch.SCRATCH_4C.map((s: any) => (s.key === 'lib4c-scratch-a' ? { ...s, id: 'lib_box_jump' } : s));
    expect(scratch.setProblems(set)).toEqual(['lib_box_jump is a PILOT-A2 id (D-LIB11-SCRATCHIDS)']);
  });
});
