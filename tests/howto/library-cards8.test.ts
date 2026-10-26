// LIB-5 S12 and S3 (Do 3 b commit 1; D-LIB9-CARDFIELDS, D-LIB5-TEMPO8 = lib4-cards 14.7, D-LIB5-TOPFAULT): the 8's
// research cards and quotes, byte copies of claude/libht-research @ 9eaa248 with no machine key added, because every
// id stops (the 7 with a spec at H6.tempo, the lateral raise on TOPFAULT 'none'). The tempo map and the plateFacts form
// table below are this test's own literal copies of the ruling; expected values come only from them and the cards'
// plate.tempo, never from a spec, a plate or the builder's TEMPO8. The checks that need a wired card run on the S3
// fixture card in a temp copy of E1's tree, through candidateOf and runQa (D-LIB5-FIXTURE 4).
import { cpSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { HELD, PAIR, heldShapeProblems, pairingMismatches, pairingMutations } from './held-pairing';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const HOWTO = 'docs/research/howto';
const read = (p: string) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const EIGHT = ['dumbbell_lateral_raise', 'barbell_back_squat', 'pull_up', 'hanging_leg_raise', 'lat_pulldown', 'seated_cable_row', 'leg_press', 'machine_chest_press'];
const WITH_SPEC = EIGHT.slice(1);
const temps: string[] = [];
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });

/** path under docs/research/howto -> sha256 of the file bytes; each equals its blob at research 9eaa248. */
const PINS: Record<string, string> = {
  'cards/barbell_back_squat.json': '9a675aaba6d468b3d97bad6404fb3c69ccacff58da3814ef05e6b6af1e3997b9',
  'cards/dumbbell_lateral_raise.json': 'ccc9439f64a8102d9680a5d88ff2abe41619c2bd02832a87adf7e56f8b02a945',
  'cards/hanging_leg_raise.json': '1df7c438c4d7d5213cb536e26655c6bae1a088785936fbb7ebbb9ca420426fac',
  'cards/lat_pulldown.json': '8ce67c05ca6df69d7d5f2a510c5a0f7b59e7f54e55e59ce524973aa977358ca4',
  'cards/leg_press.json': '88734cb5742295b58682716c24e3a8e12dc3c03a362ee8e13420b3b7ae8e0f42',
  'cards/machine_chest_press.json': 'ab994238d42b3e579eec2d9fb3880dc63e0f8412d8ba490a8423dc9027e41d5c',
  'cards/pull_up.json': 'dd948e721b12a77d01766d9230034b60fb0a86ac30ed979826cba9c0e6a303b5',
  'cards/seated_cable_row.json': 'c9dafee1adcc0da0b548c142992adbf14c33c7a90e17abf02b6e7ee037a5fc34',
  'quotes/dumbbell_lateral_raise.json': '9125b940803f4cd85f1846af25fd9f8bebaae3961dd86090169117ce6e147b30',
  'quotes/barbell_back_squat.json': '7f2f375f5a21853e07d0eaced2a9e3badefe464e7351de5519d4d8e56116d876',
  'quotes/pull_up.json': '0f9e634515d9150a421727871aa0c41c4fe4fbb2b6b4181de57e32b43f68b6fb',
  'quotes/hanging_leg_raise.json': 'b20d8a3398bf88b31b98e19d28afaed658a4ac11616f8436eb3ffa413fc6de89',
  'quotes/lat_pulldown.json': '9e837d11897e7e470a40aac9a0386c13a08b508dcff790040a063795baed1b67',
  'quotes/seated_cable_row.json': '973c6b0c7f2d7fb4f6ba178e1dc53c940c99f98da2e4545c809b40afab61fd51',
  'quotes/leg_press.json': '450a169078a020d7703fbde82fb976a5eac3680b64943feefa25dddb99b843a3',
  'quotes/machine_chest_press.json': 'd00ed1a558e2a2600e508f094d44106f1978fe4cc8ad0bb4b656119fe4ee9a68',
};

/** D-LIB5-TEMPO8 (14.7 rows 1-8): the ruled map, the test's own literal copy. */
const MAP: Record<string, any[] | null> = {
  lib_dumbbell_lateral_raise: null,
  lib_barbell_back_squat: [{ phase: 'Lower', move: true, from: 'down' }, { phase: 'Drive up', move: true, from: 'up' }, { phase: 'Brace', from: 'pause' }],
  lib_pull_up: [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Lower', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_hanging_leg_raise: [{ phase: 'Lift', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Lower', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_lat_pulldown: [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_seated_cable_row: [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', move: true, from: 'down' }, { phase: 'Rest', from: null }],
  lib_leg_press: [{ phase: 'Lower', move: true, from: 'down' }, { phase: 'Pause', constant: 1, claim: 'c15' }, { phase: 'Press', move: true, from: 'up' }, { phase: 'Rest', from: 'pause' }],
  lib_machine_chest_press: [{ phase: 'Press', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Return', move: true, from: 'down' }, { phase: 'Rest', from: null }],
};
/** The S3 fixture card's map row (this test's own; E1's spec is golden B's pull-up). */
const FIXTURE_ROW = [{ phase: 'Pull', move: true, from: 'up' }, { phase: 'Hold', from: 'pause' }, { phase: 'Lower', move: true, from: 'down' }, { phase: 'Rest', constant: 0.5, claim: 'c3' }];

/** D-LIB5-TEMPO8 (14.7 items 10-15): the plateFacts form table, the test's own literal copy (kind always 'angle'). */
const FORMS: Record<string, { vertex: string; quantity: string; form: 'measure' | 'joint'; joint?: string; pose: string }> = {
  lib_barbell_back_squat: { vertex: 'knee.r', quantity: 'knee bend from straight', form: 'measure', pose: 'end' },
  lib_pull_up: { vertex: 'elbow.r', quantity: 'elbow bend from straight', form: 'measure', pose: 'end' },
  lib_hanging_leg_raise: { vertex: 'hip.r', quantity: 'trunk-to-thigh angle at the hip', form: 'measure', pose: 'end' },
  lib_lat_pulldown: { vertex: 'hip.r', quantity: 'trunk lean back from a plumb line at the hip', form: 'measure', pose: 'end' },
  lib_seated_cable_row: { vertex: 'shoulder.r', quantity: 'the upper arm\'s sweep at the shoulder from its start to its end position', form: 'measure', pose: 'end' },
  lib_leg_press: { vertex: 'knee.r', quantity: 'thigh-to-shank angle at the knee', form: 'measure', pose: 'end' },
  lib_machine_chest_press: { vertex: 'elbow.r', quantity: 'the engine report\'s elbow.r angle', form: 'joint', joint: 'elbow.r', pose: 'end' },
};
const FIXTURE_FORM = { vertex: 'elbow.r', quantity: 'elbow bend from straight', form: 'joint' as const, joint: 'elbow.r', pose: 'end' };

/** TOPFAULT @ 9eaa248 (#244 comment 6246231455), the blind pass's answers. */
const TOPFAULT: Record<string, string> = { barbell_back_squat: 'none', dumbbell_lateral_raise: 'none', hanging_leg_raise: 'swing', lat_pulldown: 'none', leg_press: 'lift', machine_chest_press: 'round', pull_up: 'kick', seated_cable_row: 'swing' };
/** Why each of the 8 stops (D-LIB5-TEMPO8 5, D-LIB5-TOPFAULT): the tempo build's throw or 'tempo differs' (a built
 *  array unlike the spec's), and 'TOPFAULT none'. */
const STOPS: Record<string, string[]> = {
  lib_dumbbell_lateral_raise: ['TOPFAULT none'],
  lib_barbell_back_squat: ['tempo differs', 'TOPFAULT none'],
  lib_pull_up: ['lib_pull_up: tempo: Rest has no verified source'],
  lib_hanging_leg_raise: ['lib_hanging_leg_raise: tempo: Rest has no verified source'],
  lib_lat_pulldown: ['lib_lat_pulldown: tempo: Rest has no verified source', 'TOPFAULT none'],
  lib_seated_cable_row: ['lib_seated_cable_row: tempo: Rest has no verified source'],
  lib_leg_press: ['tempo differs'],
  lib_machine_chest_press: ['lib_machine_chest_press: tempo: Rest has no verified source'],
};

let V: any;
const SPECS: Record<string, any> = {};
beforeAll(async () => {
  V = await import(/* @vite-ignore */ url('tools/plates/library/research/validate.mjs'));
  // The ruling cites tools/plates/vendor/exercises/<id>.mjs, which needs the engine's font mirror to import; golden B's
  // tools/plates/layers/exercises/<id>.mjs is byte-equal to it (asserted below) and imports plainly.
  for (const id of WITH_SPEC) SPECS[`lib_${id}`] = (await import(/* @vite-ignore */ url(`tools/plates/layers/exercises/${id}.mjs`))).default;
});
const card = (id: string) => read(`${HOWTO}/cards/${id}.json`);

/** The stop for one id under a map: the build's throw, 'differs' when the built array is not the spec's, or null. */
const stopOf = (lib: string, map: Record<string, any[] | null>, plateTempo: any, spec: any) => {
  let built;
  try { built = V.buildTempo(lib, map[lib], plateTempo); } catch (e: any) { return e.message; }
  return built === null || JSON.stringify(built) === JSON.stringify(spec?.tempo) ? null : 'tempo differs';
};
/** Every problem with the 8 under (map, forms, topfault, cards8): the stop table, the machine keys, the form table. */
function cards8Problems({ map = MAP, forms = FORMS, topfault = TOPFAULT, cards8 = [] as string[], cards = Object.fromEntries(EIGHT.map(id => [id, card(id)])), specs = SPECS } = {}) {
  const bad: string[] = [];
  if (JSON.stringify(V.TEMPO8) !== JSON.stringify(map)) bad.push('TEMPO8 differs from the ruled map');
  for (const id of EIGHT) {
    const lib = `lib_${id}`, c = cards[id];
    const stop = [stopOf(lib, map, c.plate.tempo, specs[lib]), topfault[id] === 'none' ? 'TOPFAULT none' : null].filter(Boolean);
    if (JSON.stringify(stop) !== JSON.stringify(STOPS[lib])) bad.push(`${lib}: stops ${JSON.stringify(stop)}, ruled ${JSON.stringify(STOPS[lib])}`);
    if (stop.length && cards8.includes(lib)) bad.push(`${lib}: stopped, but in CARDS_8`);
    if (stop.length) for (const k of V.MACHINE_KEYS) if (k in c) bad.push(`${lib}: stopped, but its card has ${k}`);
  }
  for (const [lib, f] of Object.entries(forms)) {
    const s = specs[lib];
    if (f.vertex !== s?.measure?.vertex) bad.push(`${lib}: form vertex ${f.vertex}, spec measure.vertex ${s?.measure?.vertex}`);
    if (!(f.pose in (s?.poses ?? {}))) bad.push(`${lib}: form pose ${f.pose} is not a spec pose`);
    if ((f.form === 'joint') !== ('joint' in f)) bad.push(`${lib}: one form per fact`);
    if (f.form === 'measure' && s?.measure?.expect == null) bad.push(`${lib}: a measure fact needs spec.measure.expect`);
  }
  return bad;
}

describe('LIB-5 S12: the 8\'s cards are research 9eaa248\'s bytes, validated, with no machine key', () => {
  it('each card and quotes file equals its pinned sha256 (the 9eaa248 blob); one byte changed is red', () => {
    const files = EIGHT.flatMap(id => [`cards/${id}.json`, `quotes/${id}.json`]);
    expect(Object.keys(PINS).sort()).toEqual([...files].sort());
    const sha = (p: string) => createHash('sha256').update(readFileSync(join(ROOT, HOWTO, p))).digest('hex');
    for (const f of files) expect([f, sha(f)]).toEqual([f, PINS[f]]);
    const t = readFileSync(join(ROOT, HOWTO, files[0]!));
    t[10] = t[10]! ^ 1;
    expect(createHash('sha256').update(t).digest('hex')).not.toBe(PINS[files[0]!]);
  });
  it('S2: the validator passes on each of the 8 and on the S3 fixture card; each problem kind is red', () => {
    for (const id of EIGHT) expect([id, V.validateCardFile(`${id}.json`)]).toEqual([id, []]);
    const fx = fixture(), q = read('tests/howto/fixtures/lib5/research/quotes/cable_lateral_raise.json');
    expect(V.validateCard(fx, q, { file: 'cable_lateral_raise.json' })).toEqual([]);
    const v = (c: any) => V.validateCard(c, q, { file: 'cable_lateral_raise.json' });
    const { claim: _c, ...noClaim } = fx.plateFacts[0];
    expect(v({ ...fx, plateFacts: [noClaim] })).toEqual(['cards/cable_lateral_raise.json: plateFacts[0] names no claim']);
    // F-PLATEFACTS (D-PLATEFACTS-EMPTY): [] is a verified "no fact" (D-LIB8M-NOFACTS); a non-list, an unknown claim and no claim stay red
    expect(v({ ...fx, plateFacts: [] })).toEqual([]);
    expect(v({ ...fx, plateFacts: {} })).toEqual(['cards/cable_lateral_raise.json: plateFacts is not a list']);
    expect(v({ ...fx, plateFacts: 'x' })).toEqual(['cards/cable_lateral_raise.json: plateFacts is not a list']);
    expect(v({ ...fx, plateFacts: [{ ...fx.plateFacts[0], claim: 'c999' }] })).toEqual(['cards/cable_lateral_raise.json: plateFacts[0].claim names unknown claim c999', 'cards/cable_lateral_raise.json: plateFacts[0] names unknown claim c999']);
    expect(v({ ...fx, plateFacts: [{ ...fx.plateFacts[0], measure: true }] })).toEqual(['cards/cable_lateral_raise.json: plateFacts[0]: both joint and measure (one form per fact)']);
    expect(v({ ...fx, tempo: [{ ...fx.tempo[0], claim: 'c2' }, ...fx.tempo.slice(1)] })).toEqual(['cards/cable_lateral_raise.json: tempo[0] keys phase,s,move,claim, want phase,s[,move]']);
    const { tempo: _t, ...noTempo } = fx;
    expect(v(noTempo)).toEqual(['cards/cable_lateral_raise.json: plateFacts and tempo go in together or not at all']);
  });
  it('F-PLATEFACTS: every card main holds validates, except the ruled hold markers (D-PLATEFACTS-EMPTY, D-PLATEFACTS-HELD)', () => {
    const cards = readdirSync(join(ROOT, HOWTO, 'cards')).filter((f: string) => f.endsWith('.json'));
    expect(cards.length).toBeGreaterThan(EIGHT.length);
    expect(heldShapeProblems(HELD)).toEqual([]);
    expect(pairingMismatches(V)).toEqual([]);
  });
  it('F-PLATEFACTS FIX 2 (D-PLATEFACTS-HELD): mutations (a)-(e) are red; the control is green', () => {
    const m = pairingMutations(V);
    expect(m.control).toEqual([]);
    expect(m.a).toEqual([`barbell_row: [], want ${JSON.stringify([PAIR('barbell_row')])}`]);
    expect(m.b).toEqual([`plank: ${JSON.stringify([PAIR('plank')])}, want []`]);
    expect(m.c.length).toBe(1);
    expect(m.c[0]).toMatch(/^barbell_row: .*names unknown claim c999/);
    expect(m.d).toEqual([`barbell_row: ${JSON.stringify([PAIR('barbell_row')])}, want []`]);
    expect(m.e).toEqual([`held[0] (${HELD[0]!.id}) has no ruling`]);
  });
});

describe('LIB-5 D-LIB5-TEMPO8: the ruled map and form table; every one of the 8 stops (14.7)', () => {
  it('the specs read are the vendor specs the ruling cites (byte-equal copies)', () => {
    for (const id of WITH_SPEC) expect([id, readFileSync(join(ROOT, `tools/plates/layers/exercises/${id}.mjs`), 'utf8') === readFileSync(join(ROOT, `tools/plates/vendor/exercises/${id}.mjs`), 'utf8')]).toEqual([id, true]);
  });
  it('TEMPO8 equals the test\'s copy; the stop table, machine keys and form table hold', () => {
    expect(V.TEMPO8).toEqual(MAP);
    expect(cards8Problems()).toEqual([]);
  });
  it('each stopped id keeps H6:no-card (the 7 with a spec) and F7, and approved.mjs wires no card', () => {
    const ex = read('tools/plates/library/qa/exemptions.json').plates;
    for (const id of EIGHT) {
      const keys = Object.keys(ex[`lib_${id}`] ?? {});
      expect([id, keys.includes('F7'), keys.includes(id === 'dumbbell_lateral_raise' ? 'H6:not-engine' : 'H6:no-card')]).toEqual([id, true, true]);
    }
    // D-LIB5-TEMPO8 (commit 2): the 7 ids' H6:no-card and F7 reasons name the ruling; the lateral raise's F7 is as on main
    const WHY = 'no machine-readable verified card on main for the 8 (plate facts, tempo, top fault); the verified card\'s tempo differs from the approved plate\'s timing; approved timing kept (D-LIB5-TEMPO8)';
    for (const id of WITH_SPEC) expect([id, ex[`lib_${id}`]['H6:no-card'], ex[`lib_${id}`].F7]).toEqual([id, WHY, WHY]);
    expect(ex.lib_dumbbell_lateral_raise.F7).toBe('no machine-readable verified card on main for the 8 (plate facts, tempo, top fault); LIB-5 adds their cards');
    const appr = readFileSync(join(ROOT, 'tools/plates/library/qa/approved.mjs'), 'utf8');
    expect(appr).not.toMatch(/CARDS_8|cardResearch/);
    expect(appr).toContain('research: null, census: CENSUS_8[LIB_OF[p.chromeId]] ?? null, mistakeFault: null,');
  });
  it('the five TOPFAULT keys equal the approved plates\' mistake.firstKey (recorded; not wired, 14.7)', () => {
    for (const [id, k] of Object.entries(TOPFAULT).filter(([, k]) => k !== 'none')) {
      const t = readFileSync(join(ROOT, `src/howto/generated/ht-${id.replace(/_/g, '-')}.ts`), 'utf8');
      expect([id, t.match(/mistake: \{[\s\S]*?firstKey: "([^"]+)"/)?.[1]]).toEqual([id, k]);
    }
  });
  it('mutations (14.7 item 18 and NEW-4 4), each red', () => {
    const red = (name: string, x: any) => expect([name, cards8Problems(x).length > 0]).toEqual([name, true]);
    const m = (lib: string, f: (row: any[]) => void) => { const c = structuredClone(MAP); f(c[lib]!); return c; };
    red('pull_up Rest given a constant 0.5', { map: m('lib_pull_up', r => { r[3] = { phase: 'Rest', constant: 0.5, claim: 'c11' }; }) });
    red('hanging_leg_raise Rest given a constant 1 citing c10', { map: m('lib_hanging_leg_raise', r => { r[3] = { phase: 'Rest', constant: 1, claim: 'c10' }; }) });
    red('leg_press Pause constant 1 -> 0.5', { map: m('lib_leg_press', r => { r[1].constant = 0.5; }) });
    red('a mapped field swapped (up for down)', { map: m('lib_lat_pulldown', r => { r[0].from = 'down'; }) });
    red('an s with no map entry (a phase dropped)', { map: m('lib_seated_cable_row', r => { r.pop(); }) });
    red('a constant added without a ruling', { map: m('lib_machine_chest_press', r => { r[3] = { phase: 'Rest', constant: 0.5, claim: 'c16' }; }) });
    red('a stopped id added to CARDS_8', { cards8: ['lib_pull_up'] });
    red('a stopped card given tempo', { cards: { ...Object.fromEntries(EIGHT.map(id => [id, card(id)])), leg_press: { ...card('leg_press'), tempo: [] } } });
    red('a form row\'s vertex changed', { forms: { ...FORMS, lib_pull_up: { ...FORMS.lib_pull_up!, vertex: 'shoulder.r' } } });
    red('a form row\'s pose changed', { forms: { ...FORMS, lib_leg_press: { ...FORMS.lib_leg_press!, pose: 'bottom' } } });
    red('a form row with both joint and measure', { forms: { ...FORMS, lib_pull_up: { ...FORMS.lib_pull_up!, joint: 'elbow.r' } } });
    red('a TOPFAULT none answer changed to a key', { topfault: { ...TOPFAULT, lat_pulldown: 'swing' } });
  });
  it('the squat\'s Brace is left out at pause 0, never emitted as 0 s; a builder that emits it is red', () => {
    expect(V.buildTempo('lib_barbell_back_squat', MAP.lib_barbell_back_squat, card('barbell_back_squat').plate.tempo))
      .toEqual([{ phase: 'Lower', s: 2, move: true }, { phase: 'Drive up', s: 2, move: true }]);
    const emits = (row: any[], t: any) => row.map(e => (e.from === 'pause' ? { phase: e.phase, s: t.pause } : null)).filter(Boolean);
    expect(emits(MAP.lib_barbell_back_squat!, card('barbell_back_squat').plate.tempo)).toEqual([{ phase: 'Brace', s: 0 }]);
    expect(() => V.buildTempo('lib_x', [{ phase: 'Up', move: true, from: 'pause' }], { pause: 1 })).toThrow('lib_x: tempo: Up moves, so it takes up or down');
    expect(() => V.buildTempo('lib_x', [{ phase: 'Up', move: true, constant: 1, claim: 'c1' }], {})).toThrow('lib_x: tempo: Up moves, so it takes up or down, never a constant');
    expect(() => V.buildTempo('lib_x', undefined, {})).toThrow('lib_x: tempo: no ruled map row');
  });
});

const fixture = () => read('tests/howto/fixtures/lib5/research/cards/cable_lateral_raise.json');

describe('LIB-5 S3 and S12 on the S3 fixture card: candidateOf and runQa in a copy of E1\'s tree (D-LIB5-FIXTURE 4)', () => {
  const T = 900_000;
  let F: any, tree: string, base: any;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    const t0 = await (await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/tree.mjs'))).fixtureTreeAsync(); temps.push(t0);
    tree = mkdtempSync(join(tmpdir(), 'lib5-s3-')); temps.push(tree);
    cpSync(t0, tree, { recursive: true, verbatimSymlinks: true });
    const e1 = JSON.parse(readFileSync(join(tree, F.CARD_FILE), 'utf8'));
    base = { e1 };
    writeFileSync(join(tree, F.CARD_FILE), readFileSync(join(ROOT, 'tests/howto/fixtures/lib5/research/cards/cable_lateral_raise.json')));
    const turl = (p: string) => F.url(tree, p);
    const [cand, bg, reg, golden, eng, qa] = await Promise.all(['tools/plates/library/candidate.mjs', 'tools/plates/library/batch-golden.mjs', 'tools/plates/library/registry.mjs',
      'tools/plates/golden.mjs', 'tools/plates/library/qa/engine.mjs', 'tools/plates/library/qa/index.mjs'].map(p => import(/* @vite-ignore */ turl(p))));
    const all = reg.rows(), row = all.find((r: any) => r.id === F.ID), mirror = golden.makeMirror();
    const E = await eng.loadEngine(mirror), html = await bg.platesPage(row, all);
    Object.assign(base, { cand, qa, E, mirror, eng, c: await cand.candidateOf(F.ID, { platesHtml: html, engine: E, all }) });
  }, T);
  afterAll(() => { if (base?.mirror) base.eng.dropMirror(base.mirror); });
  /** The candidate with research read from `card` (written over CARD_FILE in the tree, as researchOf reads it). */
  const withCard = (c: any) => {
    writeFileSync(join(tree, F.CARD_FILE), JSON.stringify(c));
    return { ...base.c, research: base.cand.researchOf({ research: { card: F.CARD_FILE } }, tree) };
  };
  const qa = async (cand: any) => base.cand.nodeHalf(await base.qa.runQa(cand, { engine: base.E }));
  const h6 = (r: any) => r.hard['PQ-H6'].problems.map((p: any) => p.key);

  it('S3: candidateOf returns the three keys; H6 passes and F7 is not raised', async () => {
    const fx = fixture();
    expect(base.c.research).toEqual({ plateFacts: fx.plateFacts, tempo: fx.tempo, topFault: fx.topFault });
    const r = await qa(base.c);
    expect([h6(r), r.flags.F7.raised]).toEqual([[], false]);
  }, T);
  it('the fixture\'s values trace to E1 and to its own map row and form row', () => {
    const fx = fixture();
    expect(fx.plateFacts).toEqual([{ ...base.e1.plateFacts[0], claim: 'c1' }]);
    expect(V.buildTempo('lib_cable_lateral_raise', FIXTURE_ROW, fx.plate.tempo)).toEqual(fx.tempo);
    expect(fx.tempo).toEqual(base.c.spec.tempo);
    const f = fx.plateFacts[0];
    expect([f.kind, f.joint, f.pose, 'measure' in f]).toEqual(['angle', FIXTURE_FORM.joint, FIXTURE_FORM.pose, false]);
    expect(FIXTURE_FORM.vertex).toBe(base.c.spec.measure.vertex);
    expect([fx.plate.mistake.drawable, fx.topFault]).toEqual([true, base.c.mistakeFault]);
  });
  it('mutations through researchOf and runQa, each red', async () => {
    const fx = fixture(), { tempo: _t, plateFacts: _p, topFault: _f, ...bare } = fx;
    const cases: [string, any, (r: any) => boolean][] = [
      ['tempo nested under plate', { ...bare, plateFacts: fx.plateFacts, topFault: fx.topFault, plate: { ...fx.plate, tempoArray: fx.tempo } }, r => h6(r).includes('H6.tempo')],
      ['plateFacts deleted', { ...bare, tempo: fx.tempo, topFault: fx.topFault }, r => h6(r).includes('H6:no-card')],
      ['one angle fact +3 deg', { ...fx, plateFacts: [{ ...fx.plateFacts[0], deg: fx.plateFacts[0].deg + 3 }] }, r => h6(r).some((k: string) => k.startsWith('H6.fact:0:angle'))],
      ['tempo deleted', { ...bare, plateFacts: fx.plateFacts, topFault: fx.topFault }, r => h6(r).includes('H6.tempo')],
      ['one tempo second changed', { ...fx, tempo: fx.tempo.map((t: any, i: number) => (i === 1 ? { ...t, s: 0.6 } : t)) }, r => h6(r).includes('H6.tempo')],
      ['topFault deleted', { ...bare, plateFacts: fx.plateFacts, tempo: fx.tempo }, r => r.flags.F7.raised === true],
      ['topFault set to another key', { ...fx, topFault: 'short' }, r => r.flags.F7.raised === true],
    ];
    try {
      for (const [name, c, isRed] of cases) expect([name, isRed(await qa(withCard(c)))]).toEqual([name, true]);
    } finally { writeFileSync(join(tree, F.CARD_FILE), readFileSync(join(ROOT, 'tests/howto/fixtures/lib5/research/cards/cable_lateral_raise.json'))); }
  }, T);
  it('mutations on the map and the card checks, each red: field swapped, pause s off the card, other form, drawable false', () => {
    const fx = fixture(), build = (row: any[], t: any) => V.buildTempo('lib_cable_lateral_raise', row, t);
    const swapped = FIXTURE_ROW.map(e => (e.from === 'up' ? { ...e, from: 'down' } : e));
    expect(build(swapped, fx.plate.tempo)).not.toEqual(base.c.spec.tempo);
    expect(build(FIXTURE_ROW, { ...fx.plate.tempo, pause: 0.6 })).not.toEqual(fx.tempo);
    expect(build(FIXTURE_ROW.slice(0, 3), fx.plate.tempo)).not.toEqual(base.c.spec.tempo);
    /** S12's wired-card rules: drawable true, a drawable:false topFault never the drawn key, the fact in its row's form. */
    const wiredProblems = (c: any, form: any, drawn: string) => [
      ...(c.plate.mistake.drawable !== true ? ['not drawable'] : []),
      ...(c.plate.mistake.drawable === false && c.topFault === drawn ? ['drawable:false topFault equals the drawn fault'] : []),
      ...c.plateFacts.filter((f: any) => (form.form === 'joint' ? f.joint !== form.joint || 'measure' in f : f.measure !== true || 'joint' in f)).map(() => 'fact not in its row\'s form'),
    ];
    expect(wiredProblems(fx, FIXTURE_FORM, base.c.mistakeFault)).toEqual([]);
    expect(wiredProblems({ ...fx, plate: { ...fx.plate, mistake: { ...fx.plate.mistake, drawable: false } } }, FIXTURE_FORM, base.c.mistakeFault)).toContain('not drawable');
    expect(wiredProblems({ ...fx, plate: { ...fx.plate, mistake: { ...fx.plate.mistake, drawable: false } } }, FIXTURE_FORM, base.c.mistakeFault)).toContain('drawable:false topFault equals the drawn fault');
    expect(wiredProblems({ ...fx, plateFacts: [{ kind: 'angle', measure: true, pose: 'end', deg: 146.5, claim: 'c1' }] }, FIXTURE_FORM, base.c.mistakeFault)).toEqual(['fact not in its row\'s form']);
  });
});
