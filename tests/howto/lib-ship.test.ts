// LIB-SHIP (card docs/supervisor/verify/lib-ship-card.md; PR #376): the rulings' own checks.
// - D-SHIP-C3 (6614298313): checkC3Library and the pinned no-zoom list, each of the five reds proven on a mutation.
// - D-SHIP-GRIP (6614415740): (a) a field the card leaves empty takes the pair key's recorded value, pinned here per
//   shipped keyed row; (b) NoHandling only when the card gives no hand claim at all.
// - A1 (W1): the shipped set is the 8 then exactly the ruled library ids.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { RULED, checkC3Library, checkConventionGrip, checkGripLibrary } from './checks/c3-library';
import { checkC3 } from './checks/c3';
import { checkC1 } from './checks/c1';
import { W4_IDS, W4_WAITING_IDS } from './checks/ship-w4';
import exercises from '../../src/data/exercises.json';

const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const json = (p: string) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const EIGHT = Object.keys(json('tools/plates/plates.json'));
/** The library ids ruled to ship on this head, in registry order (W1: D-SHIP-W1-LAYERS #376 6616230145; W2: the 9 of
 *  D-SHIP-W2-STAMP #379 6636105974, less crunch and seated_leg_curl held by Q6/Q7 6636501505, 6636616603; W3: the 9 of
 *  #384 6653062201, less assisted_pull_up and underhand_lat_pulldown (LIB-PLATEFIX-3) and incline_machine_press and
 *  shoulder_press (D-SHIP-W3-NOPAIR 6681221802); registry order puts lb01 first and zoom last). */
const W3_SHIPPED = ['lib_chin_up', 'lib_hanging_knee_raise', 'lib_inverted_row', 'lib_close_grip_pulldown', 'lib_single_arm_lat_pulldown',
  'lib_straight_arm_pulldown', 'lib_chest_supported_row', 'lib_resistance_band_row'];
const RULED_SHIPPED = [...W3_SHIPPED, 'lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_dumbbell_shoulder_press', 'lib_upright_row',
  'lib_dumbbell_biceps_curl', 'lib_rope_triceps_pushdown', 'lib_plank', 'lib_cable_fly', 'lib_push_up', 'lib_horizontal_leg_press'];

let reg: any, content: any, P: any, keyMods: any[];
beforeAll(async () => {
  [reg, content, P] = await Promise.all(['tools/plates/library/registry.mjs', 'tools/plates/gen/content.mjs', 'tools/plates/library/hands/pairs.mjs'].map(p => import(/* @vite-ignore */ url(p))));
  keyMods = await P.loadKeyModules();
});
const gapKeyOf = (id: string) => keyMods.find((m: any) => m.GAPS && id in m.GAPS)?.KEY ?? null;

describe('LIB-SHIP A1: the shipped set', () => {
  it('shippedIds() is the 8 then exactly the ruled library ids; none of the owner\'s 11 ships', () => {
    // LIB-SHIP W4 (ruling 3): then the W4 ids (checks/ship-w4.ts), all in registry order; no W4 waiting id ships
    const ruled = [...RULED_SHIPPED, ...W4_IDS];
    expect(reg.shippedIds()).toEqual([...EIGHT, ...reg.rows().map((r: any) => r.id).filter((id: string) => ruled.includes(id))]);
    expect(ruled.filter(id => !reg.shippedIds().includes(id))).toEqual([]);
    expect(reg.shippedIds().filter((id: string) => W4_WAITING_IDS.includes(id))).toEqual([]);
    const eleven = ['hip_thrust', 'pallof_press', 'russian_twist', 'flutter_kicks', 'bicycle_crunch', 'overhead_cable_triceps_extension',
      'cable_rear_delt_fly', 'seated_calf_raise', 'standing_calf_raise', 'bodyweight_calf_raise', 'leg_press_calf_raise'].map(s => `lib_${s}`);
    expect(reg.shippedIds().filter((id: string) => eleven.includes(id))).toEqual([]);
  });
});

describe('LIB-SHIP D-SHIP-C3: checkC3Library and the no-zoom list', () => {
  const list = () => json('tools/plates/library/hands/no-zoom.json').entries;
  const card = (id: string) => json(`docs/research/howto/cards/${id.slice(4)}.json`);
  const ohp = async () => (await content.loadContent('lib_barbell_overhead_press')).content;
  it('the pinned list holds only ruled entries, and barbell_overhead_press (gap-ruled, D-SHIP-Q1) passes', async () => {
    for (const [id, e] of Object.entries(list()) as [string, any][]) expect([id, RULED.has(e.ruling)]).toEqual([id, true]);
    const c = await ohp();
    expect(checkC3(c, 'Barbell')).toHaveLength(1);   // plain C3 refuses it: the list is what lets it through
    expect(checkC3Library(c, 'Barbell', { list: list(), card: card(c.id), gapKeyOf })).toEqual([]);
  });
  it('red 1: an id with no hand zoom that is not listed', async () => {
    const c = await ohp(), { lib_barbell_overhead_press: _drop, ...rest } = list();
    expect(checkC3Library(c, 'Barbell', { list: rest, card: card(c.id), gapKeyOf }).join('\n')).toMatch(/C3: handling.archetype is not none, and no hand zoom/);
  });
  it('red 2: a listed id whose card has a hand zoom and no GAP ruling (card-no-zoom, or gap-key with no key GAPS entry)', async () => {
    const c = await ohp();
    const asCardNoZoom = { ...list(), lib_barbell_overhead_press: { ruling: 'D-SHIP-Q1', reason: 'card-no-zoom' } };
    expect(checkC3Library(c, 'Barbell', { list: asCardNoZoom, card: card(c.id), gapKeyOf })).toContain('C3L: lib_barbell_overhead_press: card-no-zoom, but the card has a hand zoom');
    const asGapKey = { ...list(), lib_barbell_overhead_press: { ruling: 'D-SHIP-Q1', reason: 'gap-key', at: 'tools/plates/library/hands/hand-bar.mjs:1' } };
    expect(checkC3Library(c, 'Barbell', { list: asGapKey, card: card(c.id), gapKeyOf })).toContain('C3L: lib_barbell_overhead_press: gap-key, but no hand key lists it in GAPS');
  });
  it('red 3: an empty or mismatched why', async () => {
    const c = await ohp();
    for (const why of [undefined, '', 'D-SHIP-GRIP']) {
      const m = { ...c, handling: { ...c.handling, why } };
      expect(checkC3Library(m, 'Barbell', { list: list(), card: card(c.id), gapKeyOf })).toContain('C3L: lib_barbell_overhead_press: handling.why must name D-SHIP-Q1');
    }
  });
  it('red 4: a list entry whose ruling id is not in the ruled set', async () => {
    const c = await ohp(), bad = { ...list(), lib_barbell_overhead_press: { ruling: 'D-SHIP-NOPE', reason: 'gap-ruled' } };
    const m = { ...c, handling: { ...c.handling, why: 'D-SHIP-NOPE' } };
    expect(checkC3Library(m, 'Barbell', { list: bad, card: card(c.id), gapKeyOf })).toContain('C3L: lib_barbell_overhead_press: ruling D-SHIP-NOPE is not in the ruled set');
  });
  it('red 5: a card-no-zoom entry for a card that does have one (the card read at test time, not copied)', async () => {
    const c = await ohp(), list5 = { ...list(), lib_barbell_overhead_press: { ruling: 'D-SHIP-C3', reason: 'card-no-zoom' } };
    const m = { ...c, handling: { ...c.handling, why: 'D-SHIP-C3' } };
    expect(checkC3Library(m, 'Barbell', { list: list5, card: card(c.id), gapKeyOf })).toEqual(['C3L: lib_barbell_overhead_press: card-no-zoom, but the card has a hand zoom']);
    expect(checkC3Library(m, 'Barbell', { list: list5, card: { ...card(c.id), zooms: [] }, gapKeyOf })).toEqual([]);   // control: a card with none passes
  });
  it('a listed row that has a hand zoom is red (the list cannot excuse a zoomed row)', async () => {
    const { content: c } = await content.loadContent('lib_dumbbell_biceps_curl');
    expect(checkC3Library(c, 'Dumbbells', { list: { ...list(), lib_dumbbell_biceps_curl: { ruling: 'D-SHIP-C3', reason: 'card-no-zoom' } }, card: card(c.id), gapKeyOf }))
      .toEqual(['C3L: lib_dumbbell_biceps_curl is on the no-zoom list but has a hand zoom']);
  });
});

describe('LIB-SHIP D-SHIP-GRIP', () => {
  // W1 review low 4 (#378 6624739613): every pinned value is read from the live key module, the contact through its
  // CONVENTIONS entry, so a change to the key (its contact, convention, wrist range, pose or faults) turns this red.
  const CONTACT_OF = { heel: 'heel', mid: 'mid-palm', base: 'finger-base' } as const;
  it('(a) dumbbell_biceps_curl: each field its card leaves empty equals the curl key\'s recorded value, the contact through its CONVENTIONS entry', async () => {
    const { content: c } = await content.loadContent('lib_dumbbell_biceps_curl'), K = keyMods.find((m: any) => m.KEY === 'curl');
    const V = K.VARIANTS[K.IDS.dumbbell_biceps_curl.variant];
    expect(V.claims.contact).toEqual(['ga:curl-mid']);
    expect(P.CONVENTIONS['ga:curl-mid']).toMatch(/middle of the palm/);
    const pinned = (h: any) => [h.contact, h.wrist.ext, h.pose, h.loadAxis, h.faults.map((f: any) => f.key)];
    const want = [CONTACT_OF[V.contact as keyof typeof CONTACT_OF], V.wristRange, V.right, V.loadAxis, K.IDS.dumbbell_biceps_curl.faults];
    expect(json('docs/research/howto/cards/dumbbell_biceps_curl.json').grip.handContact).toBe('');
    expect(want[0]).toBe('mid-palm');
    expect(pinned(c.handling)).toEqual(want);
  });
  it('(b) NoHandling with why D-SHIP-GRIP is red when the card claims any of thumb, contact or wrist; pec_fly (none claimed) passes', async () => {
    const { content: pec } = await content.loadContent('lib_pec_fly');
    expect(checkGripLibrary(pec, json('docs/research/howto/cards/pec_fly.json'))).toEqual([]);
    expect(checkGripLibrary(pec, { grip: { thumb: 'Wrapped.', handContact: '', wrist: '' } })).toEqual(['GRIP: lib_pec_fly uses D-SHIP-GRIP (b) but its card claims grip.thumb']);
  });
});

describe('LIB-SHIP Q-W2-2: triceps_pushdown contact from CONVENTIONS[ga:push-heel]', () => {
  const card = () => json('docs/research/howto/cards/triceps_pushdown.json');
  it('the sheet matches the convention, and the card has no handContact', async () => {
    const { content: c } = await content.loadContent('lib_triceps_pushdown');
    expect(card().grip.handContact).toBe('');
    expect(readFileSync(join(ROOT, 'tools/plates/library/howto/lib_triceps_pushdown.howto.mjs'), 'utf8')).toContain(`const PUSH_HEEL = ${JSON.stringify(P.CONVENTIONS['ga:push-heel']).replace(/"/g, "'")};`);
    expect(checkConventionGrip(c, card(), P.CONVENTIONS['ga:push-heel'])).toEqual([]);
  });
  it('red 1: the convention changes (zone or range)', async () => {
    const { content: c } = await content.loadContent('lib_triceps_pushdown'), conv = P.CONVENTIONS['ga:push-heel'] as string;
    expect(checkConventionGrip(c, card(), conv.replace('heel of the palm', 'middle of the palm'))).toEqual(['GRIPC: lib_triceps_pushdown: contact heel is not the convention\'s zone']);
    expect(checkConventionGrip(c, card(), conv.replace(/extension \d+ to \d+/, 'extension 0 to 20'))).toEqual(['GRIPC: lib_triceps_pushdown: wrist ext [0,15] is not the convention\'s range']);
  });
  it('red 2: the card gains a handContact that disagrees', async () => {
    const { content: c } = await content.loadContent('lib_triceps_pushdown'), k = card();
    expect(checkConventionGrip(c, { grip: { ...k.grip, handContact: 'Bar across the middle of the palm.' } }, P.CONVENTIONS['ga:push-heel'])).toEqual(['GRIPC: lib_triceps_pushdown: card grip.handContact disagrees with the convention']);
    expect(checkConventionGrip(c, { grip: { ...k.grip, handContact: 'Bar on the heel of the palm.' } }, P.CONVENTIONS['ga:push-heel'])).toEqual([]);   // control
  });
});

describe('LIB-SHIP D-SHIP-FAMILY: single_leg_romanian_deadlift inherits from romanian_deadlift', () => {
  let FAM: any, L: any, kid: any, par: any;
  const readCard = (p: string) => json(p);
  beforeAll(async () => {
    [FAM, L] = await Promise.all(['tools/plates/library/lint/family.mjs', 'tools/plates/library/lint/index.mjs'].map(p => import(/* @vite-ignore */ url(p))));
    [kid, par] = await Promise.all(['lib_single_leg_romanian_deadlift', 'lib_romanian_deadlift'].map(async id => (await content.loadContent(id)).content));
  });
  const run = (parent: any) => FAM.familyRefusal(kid.id, kid, readCard, (id: string) => (id === par.id ? parent : undefined));
  it('passes with the parent shipped in this head, and refuses with no parent', () => {
    expect(run(par)).toBeNull();
    expect(run(undefined)).toMatch(/parent lib_romanian_deadlift is not shipped in this head/);
  });
  it('red 1: the child\'s resolved thumb differs from the parent\'s', () => {
    const other = par.handling.thumb.mode === 'wrapped' ? 'thumbless' : 'wrapped';
    expect(run({ ...par, handling: { ...par.handling, thumb: { ...par.handling.thumb, mode: other } } })).toMatch(/grip\.thumb/);
  });
  it('red 2: the child\'s resolved wrist differs from the parent\'s', () => {
    expect(run({ ...par, handling: { ...par.handling, wrist: { ...par.handling.wrist, ext: [0, 30] } } })).toMatch(/grip\.wrist/);
  });
  it('red 3: the SLRDL sheet text contains "bar"', () => {
    const bar = (c: any) => L.shownCopyFields(c).filter((f: any) => /\bbar\b/i.test(typeof f === 'string' ? f : f.text ?? ''));
    expect(bar(kid)).toEqual([]);
    const m = { ...kid, handling: { ...kid.handling, wrist: { ...kid.handling.wrist, limitText: 'Keep the bar close.' } } };
    expect(bar(m).length).toBeGreaterThan(0);
  });
});

describe('LIB-SHIP D-SHIP-GRIP (a): palm-flat values copied from the key (the key module is not importable by a sheet)', () => {
  // hand-palm-flat.mjs pulls view-common.mjs, which reads files outside the MANIFEST-locked trees, so the two sheets copy
  // the key's record. Each copied value is pinned here against the live key: a change to the key turns this red.
  const norm = (t: string) => t.toLowerCase().replace(/[^a-z ]/g, ' ').replace(/\s+/g, ' ').trim();
  for (const id of ['mountain_climbers', 'push_up']) it(`${id}: archetype, load axis, contact, faults (and poses where drawn) equal the key's`, async () => {
    const { content: c } = await content.loadContent(`lib_${id}`), K = keyMods.find((m: any) => m.KEY === 'palm-flat');
    const k = K.IDS[id], V = K.VARIANTS[k.variant], h = c.handling;
    expect([h.archetype, h.loadAxis, h.contact, V.contact]).toEqual([V.archetype, V.loadAxis, 'palm-flat', 'whole-hand']);
    for (const f of h.faults) {
      expect(k.faults).toContain(f.key);
      expect([f.label, norm(f.alt)]).toEqual([V.faults[f.key].label, norm(V.faults[f.key].alt)]);
      if (id === 'mountain_climbers') expect(f.pose).toEqual({ ...V.right, ...V.faults[f.key].pose });
    }
    if (id === 'mountain_climbers') expect(h.pose).toEqual(V.right);
  });
});

describe('LIB-SHIP cable_fly hold-default (#379 6627240712): thumb and contact pinned from golden B\'s hold default', () => {
  const holdProblems = (row: any, src: any) => (['thumb.mode', 'contact'] as const).flatMap(p => {
    const get = (o: any) => p.split('.').reduce((x, k) => x?.[k], o.handling);
    return get(row) === get(src) ? [] : [`hold-default: ${row.id} ${p} ${get(row)} is not ${src.id}'s ${get(src)}`];
  });
  it('equals lib_dumbbell_lateral_raise\'s handling, the file its hold-default source names; red when the source changes', async () => {
    const [{ content: fly, sources }, { content: src }] = await Promise.all(['lib_cable_fly', 'lib_dumbbell_lateral_raise'].map(id => content.loadContent(id)));
    expect((sources as any)['hold-default'].url).toBe('tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs');
    expect(holdProblems(fly, src)).toEqual([]);
    const moved = { ...src, handling: { ...src.handling, thumb: { ...src.handling.thumb, mode: 'thumbless' }, contact: 'finger-base' } };
    expect(holdProblems(fly, moved)).toEqual(['hold-default: lib_cable_fly thumb.mode wrapped is not lib_dumbbell_lateral_raise\'s thumbless',
      'hold-default: lib_cable_fly contact mid-palm is not lib_dumbbell_lateral_raise\'s finger-base']);
  });
});

describe('LIB-SHIP D-SHIP-GRIP (b2) (#379 6628848012): card-none rows with a claimed handContact', () => {
  const card = (id: string) => json(`docs/research/howto/cards/${id}.json`);
  it('plank and crunch pass; their claim ids are on a setup line', async () => {
    for (const id of ['plank', 'crunch']) {
      const { content: c } = await content.loadContent(`lib_${id}`);
      expect(c.handling.why).toMatch(/D-SHIP-GRIP \(b2\)/);
      expect([id, checkGripLibrary(c, card(id))]).toEqual([id, []]);
    }
  });
  it('red 1: a card whose archetype.hand is not none uses (b2)', async () => {
    const { content: c } = await content.loadContent('lib_plank');
    expect(checkGripLibrary(c, { ...card('plank'), archetype: { hand: 'hold' } })).toEqual(['GRIP: lib_plank uses D-SHIP-GRIP (b2) but its card\'s archetype.hand is not none']);
  });
  it('red 2: a claimed field\'s claim cited on no setup or posture line', async () => {
    const { content: c } = await content.loadContent('lib_crunch');
    const m = { ...c, setup: c.setup.map((s: any) => ({ ...s, claim: s.claim && { ...s.claim, note: String(s.claim.note ?? '').replace(/\bc2\b/g, 'cX') } })),
      posture: c.posture.map((s: any) => ({ ...s, claim: s.claim && { ...s.claim, note: String(s.claim.note ?? '').replace(/\bc2\b/g, 'cX') } })) };
    expect(checkGripLibrary(m, card('crunch'))).toEqual(['GRIP: lib_crunch uses D-SHIP-GRIP (b2) but card claim c2 is cited on no setup or posture line']);
  });
  it('red 3: (b) unchanged, a why naming plain D-SHIP-GRIP with a claimed field is red', async () => {
    const { content: c } = await content.loadContent('lib_plank');
    expect(checkGripLibrary({ ...c, handling: { ...c.handling, why: 'D-SHIP-GRIP (b)' } }, card('plank'))).toEqual(['GRIP: lib_plank uses D-SHIP-GRIP (b) but its card claims grip.handContact']);
  });
});

describe('LIB-SHIP D-SHIP-IDS-NOPAIR (#379 6636740340): gen/ids.mjs missingChunks takes hands.mjs noPairRuling', () => {
  let ids: any;
  beforeAll(async () => { ids = await import(/* @vite-ignore */ url('tools/plates/gen/ids.mjs')); });
  const row = [{ id: 'lib_x', chromeId: 'x', slug: 'x' }], has = (n: string) => n !== 'hand-x', file = () => true;
  const handled = (why: unknown, zooms: unknown[] = []) => ({ handling: { archetype: 'push', why }, zooms });
  it('a handled no-zoom sheet naming D-SHIP-C3 passes; a sheet archetype none counts as none', () => {
    expect(() => ids.missingChunks(row, has, {}, { lib_x: 'push' }, file, { lib_x: handled('D-SHIP-C3 no-zoom list, D-SHIP-HANDW2: x') })).not.toThrow();
    expect(() => ids.missingChunks(row, has, {}, { lib_x: 'hold' }, file, { lib_x: { handling: { archetype: 'none' }, zooms: [] } })).not.toThrow();
  });
  it('red 1: no ruling in why', () => {
    expect(() => ids.missingChunks(row, has, {}, { lib_x: 'push' }, file, { lib_x: handled('D-SHIP-HANDW2: x') })).toThrow('ids: lib_x: no src/howto/generated/hand-x.ts and no hand pair');
  });
  it('red 2: a sheet with a hand zoom and no pair', () => {
    expect(() => ids.missingChunks(row, has, {}, { lib_x: 'push' }, file, { lib_x: handled('D-SHIP-C3: x', [{ key: 'hand', kind: 'hand' }]) })).toThrow(/no hand pair/);
  });
  it('red 3: the rule is hands.mjs\'s own (the import removed is red)', () => {
    const src = readFileSync(join(ROOT, 'tools/plates/gen/ids.mjs'), 'utf8');
    expect(src).toMatch(/^import \{ noPairRuling \} from '\.\/hands\.mjs';/m);
    expect(src).toMatch(/noPairRuling\(sheet\)/);
  });
});

describe('LIB-SHIP D-SHIP-PAIR-NOZOOM (#379 6637870829): pairsOf leaves out ids on the pinned no-zoom list', () => {
  let HP: any, H: any, R: any, pairs: any;
  beforeAll(async () => {
    [HP, H, R] = await Promise.all(['tools/plates/gen/handpairs.mjs', 'tools/plates/gen/hands.mjs', 'tools/plates/library/registry.mjs'].map(p => import(/* @vite-ignore */ url(p))));
    pairs = await HP.loadPairs();
  });
  it('red 1: a listed id gets no pair (rope and push_up are keyed but listed); without the list they would get one', () => {
    const shipped = R.shippedIds(), { pairOf } = HP.pairsOf(pairs, shipped);
    expect(pairOf['rope-triceps-pushdown']).toBeUndefined();
    expect(pairOf['push-up']).toBeUndefined();
    const unfiltered = HP.pairsOf(pairs, shipped, R.rows(), []).pairOf;   // mutation: the exclusion removed
    expect([unfiltered['rope-triceps-pushdown'], unfiltered['push-up']]).toEqual(['rope-push-neutral', 'palm-flat-floor-over']);
  });
  it('red 2: an unlisted keyed id keeps its pair (the curl)', () => {
    const { pairOf, keys } = HP.pairsOf(pairs, R.shippedIds());
    expect(pairOf['dumbbell-biceps-curl']).toBe('curl-dumbbell-under');
    // LIB-SHIP W3: W3's 5 pair rows (registry order, lb01 first) carry their sub-keys; the curl's key stays last
    expect(keys).toEqual(['bar-hang-only-curled-under', 'bar-hang-over', 'bar-row-only-curled-over', 'v-handle-pull-only-curled-neutral-overhead',
      'd-handle-pull-only-curled-unstated', 'curl-dumbbell-under']);
    expect(HP.noZoomIds()).not.toContain('lib_dumbbell_biceps_curl');
  });
  it('red 3: hands.mjs\'s no-zoom check runs for rope and push_up (their sheets name D-SHIP-C3; a sheet naming none is refused)', async () => {
    for (const id of ['lib_rope_triceps_pushdown', 'lib_push_up']) {
      const { content: c } = await content.loadContent(id);
      expect([id, H.noPairCheck(id, c, false, 'page', id)]).toEqual([id, 'D-SHIP-C3']);
      expect(() => H.noPairCheck(id, { ...c, handling: { ...c.handling, why: 'no ruling' } }, false, 'page', id)).toThrow(/no hand pair/);
    }
  });
});

describe('LIB-SHIP D-SHIP-A5BACK (#379 Q10 6640257406): the HT4 mirror carries every pinned file outside tools/plates and src/data', () => {
  // captureLayersBuild builds a batch's layers page in a mirror; a back-flagged sheet (plank, barbell_row, rope on pilot-a)
  // makes shared/back-box.mjs read docs/research/howto/shared/back-pain-box.json, so the mirror must carry it
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const BACK = 'docs/research/howto/shared/back-pain-box.json';
  // LIB-SHIP W3 (D-SHIP-A5BACK-CARDS): lb01.layers.json's pairWords rows (W3 layers fix, #384 6648454032) and
  // pilot-a.layers.json's mountain_climbers pairFaults row (Q-W3-14, F-PAIR-FAULTS #386), sorted by path
  const PAIR_CARDS = ['chin_up', 'close_grip_pulldown', 'inverted_row', 'single_arm_lat_pulldown']
    .map(id => `docs/research/howto/cards/${id}.json`);
  const ht4 = async (): Promise<any> => import(/* @vite-ignore */ (await import('node:url')).pathToFileURL(join(process.cwd(), 'tools/plates/library/fidelity/twins/ht4.mjs')).href);
  const pilotA = async (): Promise<string[]> => {
    const reg: any = await import(/* @vite-ignore */ (await import('node:url')).pathToFileURL(join(process.cwd(), 'tools/plates/library/registry.mjs')).href);
    return reg.rows().filter((r: any) => r.batchFile === 'tools/plates/library/batches/pilot-a.json').map((r: any) => r.id);
  };
  const build = async (root: string, ids: string[]) => {
    const { pathToFileURL } = await import('node:url'), { mkdtempSync } = await import('node:fs'), { tmpdir } = await import('node:os');
    return (await ht4()).captureLayersBuild(root, async (T: string) => {
      const { layersSpecOf }: any = await import(/* @vite-ignore */ pathToFileURL(join(T, 'tools/plates/library/layers-spec.mjs')).href);
      const s = layersSpecOf('tools/plates/library/batches/pilot-a.json', { stageDir: mkdtempSync(join(tmpdir(), 'a5back-stage-')), root: T });
      return s.optionsUrl ? { ...s, optionsUrl: s.optionsUrl.replace(pathToFileURL(join(root, 'tools/plates')).href, pathToFileURL(join(T, 'tools/plates')).href) } : s;
    }, ids);
  };
  it('pilot-a\'s pinned extras are exactly the back box research file, and the real tree builds pilot-a in the mirror', async () => {
    const ids = await pilotA();
    // D-SHIP-A5BACK-CARDS (#384 6648753200): then the research card of every layers-config row naming pairFaults or pairWords
    expect((await ht4()).mirrorExtras(process.cwd(), ids)).toEqual([BACK, ...PAIR_CARDS]);
    expect((await build(process.cwd(), ids)).calls.length).toBeGreaterThan(0);
  }, 300_000);
  it('red (the copy step removed, i.e. no ids reach it): the ENOENT crash on the back-flagged rows', async () => {
    await expect(build(process.cwd(), [])).rejects.toThrow(/ENOENT[\s\S]*back-pain-box\.json/);
  }, 300_000);
  it('red (a pinned file deleted from the source tree): the loud missing-file error names it', async () => {
    const { cpSync, mkdtempSync, rmSync, symlinkSync } = await import('node:fs'), { tmpdir } = await import('node:os');
    const R = mkdtempSync(join(tmpdir(), 'a5back-root-'));
    try {
      cpSync('tools/plates', join(R, 'tools/plates'), { recursive: true });
      cpSync('src/data', join(R, 'src/data'), { recursive: true });
      symlinkSync(join(process.cwd(), 'node_modules'), join(R, 'node_modules'));
      await expect(build(R, await pilotA())).rejects.toThrow(`HT4-A5: ${BACK} is pinned in MANIFEST.json for this batch but missing from the tree`);
    } finally { rmSync(R, { recursive: true, force: true }); }
  }, 300_000);
});

describe('LIB-SHIP W3 D-SHIP-A5BACK-CARDS (#384 6648753200): the HT4 mirror carries the pair rows\' research cards', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const BACK = 'docs/research/howto/shared/back-pain-box.json', CARD = 'docs/research/howto/cards/inverted_row.json';
  const ht4 = async (): Promise<any> => import(/* @vite-ignore */ (await import('node:url')).pathToFileURL(join(process.cwd(), 'tools/plates/library/fidelity/twins/ht4.mjs')).href);
  const pilotA = async (): Promise<string[]> => {
    const reg: any = await import(/* @vite-ignore */ (await import('node:url')).pathToFileURL(join(process.cwd(), 'tools/plates/library/registry.mjs')).href);
    return reg.rows().filter((r: any) => r.batchFile === 'tools/plates/library/batches/pilot-a.json').map((r: any) => r.id);
  };
  it('red (a pair row\'s card dropped from the tree): the mirror build throws, naming it', async () => {
    const { cpSync, mkdtempSync, mkdirSync, rmSync, symlinkSync } = await import('node:fs'), { tmpdir } = await import('node:os'), { dirname } = await import('node:path');
    const { pathToFileURL } = await import('node:url');
    const R = mkdtempSync(join(tmpdir(), 'a5cards-root-'));
    try {
      cpSync('tools/plates', join(R, 'tools/plates'), { recursive: true });
      cpSync('src/data', join(R, 'src/data'), { recursive: true });
      for (const p of [BACK, ...(await ht4()).pairCardsOf(process.cwd())].filter(p => p !== CARD)) { mkdirSync(dirname(join(R, p)), { recursive: true }); cpSync(p, join(R, p)); }
      symlinkSync(join(process.cwd(), 'node_modules'), join(R, 'node_modules'));
      const ids = await pilotA();
      await expect((await ht4()).captureLayersBuild(R, async (T: string) => {
        const { layersSpecOf }: any = await import(/* @vite-ignore */ pathToFileURL(join(T, 'tools/plates/library/layers-spec.mjs')).href);
        return layersSpecOf('tools/plates/library/batches/pilot-a.json', { stageDir: mkdtempSync(join(tmpdir(), 'a5cards-stage-')), root: T });
      }, ids)).rejects.toThrow(`HT4-A5: ${CARD} is a pair row's research card (D-SHIP-A5BACK-CARDS) but missing from the tree`);
    } finally { rmSync(R, { recursive: true, force: true }); }
  }, 300_000);
});

describe('LIB-SHIP D-SHIP-A2FEEL (#379 6640877874): HT10-A2 scrolls the feel map back into view after the script', () => {
  // In the shard, HT10-A2 timed out on bench, shoulder_press, barbell_row, plank, cable_fly and push_up: ht10Script ends with
  // the feel map off-screen, the app's hold observer pauses the sweep, and settleApp waits for an animation that never ends.
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const run = async (mutate: (pre: string) => Promise<void>) => {
    const calls: string[] = [], g = globalThis as any, had = 'document' in g, was = g.document;
    g.__a2calls = calls;
    g.document = { querySelector: (s: string) => (s === 'dialog.sheet.ht .feel-map' ? { scrollIntoView: (o: any) => calls.push(`scroll ${JSON.stringify(o)}`) } : null) };
    try { await mutate('pre'); } finally { if (had) g.document = was; else delete g.document; delete g.__a2calls; }
    return calls;
  };
  const script = 'async pre => { globalThis.__a2calls.push(`script ${pre}`); }';
  it('a2Mutate runs the script, then scrolls the sheet\'s feel map into view (block center)', async () => {
    const F: any = await import(/* @vite-ignore */ (await import('node:url')).pathToFileURL(join(process.cwd(), 'tools/plates/library/fidelity.mjs')).href);
    expect(await run(F.a2Mutate(script))).toEqual(['script pre', 'scroll {"block":"center"}']);
    // a sheet with no feel map: the script still runs and nothing throws
    const none = async (m: any) => { const g = globalThis as any, was = g.document, calls: string[] = []; g.__a2calls = calls; g.document = { querySelector: () => null }; try { await m('pre'); } finally { g.document = was; delete g.__a2calls; } return calls; };
    expect(await none(F.a2Mutate(script))).toEqual(['script pre']);
  });
  it('red (the scroll removed, the old wrapper): the map is left where the script put it', async () => {
    // eslint-disable-next-line no-new-func
    const old = new Function('pre', `return (${script})(pre).then(() => {})`) as any;
    expect(await run(old)).toEqual(['script pre']);
    const src = readFileSync('tools/plates/library/fidelity.mjs', 'utf8');
    expect(src).toContain('const mutate = a2Mutate(ht10Script.toString());');
  });
});

describe('LIB-SHIP D-SHIP-A6NOGRIP and D-SHIP-G7ONE (#379 6641008259): HT4-A6 on no-Grip sheets, G7 on one-callout plates', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const url = async (p: string) => (await import('node:url')).pathToFileURL(join(process.cwd(), p)).href;
  const fakeEval = (grip: boolean) => ({ evaluate: async (fn: any, arg: any) => (String(fn).includes('.zx-chip') || String(fn).includes('.fr') ? [] : (String(arg).startsWith('#card-') && String(fn).includes('.grip') ? grip : null)) });
  it('gripOf: false only for the sheets noPairRuling rules D-SHIP-GRIP (plank, pec_fly); true for Grip sheets', async () => {
    const T: any = await import(/* @vite-ignore */ await url('tools/plates/library/fidelity/twins/ht4.mjs'));
    for (const id of ['lib_plank', 'lib_pec_fly']) expect([id, await T.gripOf(process.cwd(), id)]).toEqual([id, false]);
    for (const id of ['lib_dumbbell_biceps_curl', 'lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_rope_triceps_pushdown', 'lib_push_up', 'lib_cable_fly', 'lib_upright_row', 'lib_dumbbell_shoulder_press']) expect([id, await T.gripOf(process.cwd(), id)]).toEqual([id, true]);
    expect(readFileSync('tools/plates/library/fidelity/twins/ht4.mjs', 'utf8')).toContain('gb.selfCheck(page, chrome, { grip: await gripOf(ctx.root, lib) })');
  });
  it('statesFor keeps the grip capture by default (the 8, every Grip sheet) and leaves it out only with grip: false', async () => {
    const G: any = await import(/* @vite-ignore */ await url('tools/plates/fidelity/goldenB.mjs'));
    expect((await G.statesFor(fakeEval(true), 'x')).map((s: any) => s.name)).toContain('x: grip');
    expect((await G.statesFor(fakeEval(false), 'x', { grip: false })).map((s: any) => s.name)).not.toContain('x: grip');
    // the 8's gate call is unchanged
    expect(readFileSync('scripts/screenshot-gate.mjs', 'utf8')).toContain('const bad = await gb.selfCheck(page, id);');
  });
  it('reds: a no-Grip sheet that shows a .grip block; a Grip sheet passed grip: false (its block is shown)', async () => {
    const G: any = await import(/* @vite-ignore */ await url('tools/plates/fidelity/goldenB.mjs'));
    expect(await G.gripAbsenceProblems(fakeEval(false), 'plank')).toEqual([]);
    expect(await G.gripAbsenceProblems(fakeEval(true), 'plank')).toEqual(['plank: grip: a .grip block is shown on a sheet ruled with no Grip (D-SHIP-A6NOGRIP)']);
    expect(await G.gripAbsenceProblems(fakeEval(true), 'barbell-row')).toEqual(['barbell-row: grip: a .grip block is shown on a sheet ruled with no Grip (D-SHIP-A6NOGRIP)']);
  });
  it('G7: one or two callouts tap the last; none fails loud by name (the 8\'s HT-3 .nth(1) is untouched)', async () => {
    const F: any = await import(/* @vite-ignore */ await url('tools/plates/library/fidelity.mjs'));
    const page = (n: number, log: string[]) => ({ locator: () => ({ count: async () => n, last: () => ({ click: async () => { log.push(`last of ${n}`); } }), nth: () => ({ click: async () => { throw new Error('nth used'); } }) }) });
    for (const n of [1, 2]) { const log: string[] = [], bad: string[] = []; expect(await F.g7Tell(page(n, log), bad)).toBe(true); expect([log, bad]).toEqual([[`last of ${n}`], []]); }
    const log: string[] = [], bad: string[] = [];
    expect(await F.g7Tell(page(0, log), bad)).toBe(false);
    expect([log, bad]).toEqual([[], ['A3: G7: the mistake figure has no .plate-callout to tap (D-SHIP-G7ONE)']]);
    expect(readFileSync('tools/plates/fidelity/harness.mjs', 'utf8')).toContain('.ht-plate[data-mode="mistake"] .plate-callout`).nth(1).click();');
  });
});

describe('LIB-SHIP D-SHIP-IDS-NOPAIR + D-SHIP-PAIR-NOZOOM: every pinned no-zoom row\'s handling.why names its route', () => {
  // pairsOf gives a listed id no pair, so missingChunks passes it only through noPairRuling; a staged sheet whose why names
  // only its gap ruling broke the full-coverage control (lib-4a, write-ids at 153). The why form is Q7's (#379 6636616603)
  it('each hands/no-zoom.json entry\'s sheet gets noPairRuling D-SHIP-C3, and still names its own ruling', async () => {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const { pathToFileURL } = await import('node:url');
    const hands: any = await import(/* @vite-ignore */ pathToFileURL(join(process.cwd(), 'tools/plates/gen/hands.mjs')).href);
    const nz = json('tools/plates/library/hands/no-zoom.json').entries as Record<string, { ruling: string }>;
    expect(Object.keys(nz).length).toBeGreaterThanOrEqual(13);
    for (const [id, e] of Object.entries(nz)) {
      const s = (await import(/* @vite-ignore */ pathToFileURL(join(process.cwd(), `tools/plates/library/howto/${id}.howto.mjs`)).href)).default;
      expect([id, hands.noPairRuling(s)]).toEqual([id, 'D-SHIP-C3']);
      expect([id, s.handling.why.includes(e.ruling)]).toEqual([id, true]);
    }
    // red: the why with the route taken out
    const ohp = (await import(/* @vite-ignore */ pathToFileURL(join(process.cwd(), 'tools/plates/library/howto/lib_barbell_overhead_press.howto.mjs')).href)).default;
    expect(hands.noPairRuling({ ...ohp, handling: { ...ohp.handling, why: ohp.handling.why.replace('D-SHIP-C3 no-zoom list, ', '') } })).toBe(null);
  }, 60_000); // W4: 20 no-zoom sheets import cold in about 6 s, over vitest's 5 s default (red on 66925aac CI); the checks are unchanged
});

// ---- LIB-SHIP W4 (SHIP W4 PLAN RULED, #391 6647760116): the W4 rulings' own reds. Each block runs on the real sheets
// (loadContent) and shows its red on an in-memory mutation; nothing is written. ----
describe('LIB-SHIP W4: the family rulings (D-SHIP-W4-THUMB, -GAPZOOM, -PADZOOM, Q-W4-6, Q-W4-7, E5)', () => {
  let FAM: any;
  const C: Record<string, any> = {};
  const cardOf = (id: string) => json(`docs/research/howto/cards/${id.slice(4)}.json`);
  const parentOf = (id: string) => `lib_${cardOf(id).parent}`;
  beforeAll(async () => {
    FAM = await import(/* @vite-ignore */ url('tools/plates/library/lint/family.mjs'));
    const ids = Object.keys(FAM.INHERIT_MAP).filter(id => W4_IDS.includes(id) || W4_WAITING_IDS.includes(id));
    for (const id of new Set([...ids, ...ids.map(parentOf)])) C[id] = (await content.loadContent(id)).content;
  });
  const W4 = () => Object.keys(C).filter(id => id in FAM.INHERIT_MAP && (W4_IDS.includes(id) || W4_WAITING_IDS.includes(id)));
  /** familyRefusal of `id` (or of `child`) against `parent` (default: its real parent sheet). `onlyMapped` reads the card
   *  with its unmapped fields dropped (the probe the design ran for cable_shrug, dumbbell_shrug and sumo). */
  const refuse = (id: string, { child = C[id], parent = C[parentOf(id)], onlyMapped = false, only }: { child?: any; parent?: any; onlyMapped?: boolean; only?: string } = {}) => {
    const card = cardOf(id), read = () => (only ? { ...card, inherit: card.inherit.filter((e: any) => e.field === only) }
      : onlyMapped ? { ...card, inherit: card.inherit.filter((e: any) => !FAM.unmappedFields(id, { inherit: [e] }).length) } : card);
    return FAM.familyRefusal(id, child, read, (x: string) => (x === parentOf(id) ? parent : undefined));
  };
  /** A deep copy (functions kept) with one leaf changed: `sub` is a leaves() suffix under `path` ('' = the path itself). */
  const copy = (v: any): any => (Array.isArray(v) ? v.map(copy) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, copy(x)])) : v);
  const bump = (x: any) => (typeof x === 'string' ? `${x} x` : typeof x === 'number' ? x + 1 : typeof x === 'boolean' ? !x : 'x');
  const withLeaf = (obj: any, path: string, sub: string, v: any) => {
    const o = copy(obj);
    if (sub === '') {
      const i = path.lastIndexOf('.'), at = i < 0 ? o : FAM.atPath(o, path.slice(0, i));
      at[path.slice(i + 1)] = v;
      return o;
    }
    const steps = [...sub.matchAll(/\.([^.[]+)|\[(\d+)\]/g)].map(m => m[1] ?? Number(m[2]));
    let t = FAM.atPath(o, path);
    for (const k of steps.slice(0, -1)) t = t[k as any];
    t[steps.at(-1) as any] = v;
    return o;
  };
  /** Every compared path of one map entry, with its first leaf changed in the parent (past a selected item's own `key`,
   *  which would only unmatch the selector): the refusal each gives. */
  const perLeaf = (id: string, field: string) => FAM.INHERIT_MAP[id][field].map((path: string) => {
    const all = FAM.leaves(FAM.atPath(C[parentOf(id)], path)), [sub, x] = all.find(([k]: [string]) => k !== '.key') ?? all[0];
    // the card read with this entry's field alone, so the red is this entry's and not an overlapping grip.* entry's
    return [path, refuse(id, { parent: withLeaf(C[parentOf(id)], path, sub, bump(x)), only: field })];
  });
  const THUMB_STAR = JSON.stringify(['handling.thumb.mode']);
  /** D-SHIP-W4-THUMB: a THUMB* entry (the thumb mode alone) only where neither the parent nor the child sheet has a pose. */
  const thumbProblems = (sheet: (id: string) => any) => W4().flatMap(id => Object.entries<string[]>(FAM.INHERIT_MAP[id])
    .filter(([, paths]) => JSON.stringify(paths) === THUMB_STAR)
    .flatMap(([f]) => ([[parentOf(id), 'parent'], [id, 'child']] as [string, string][]).filter(([x]) => sheet(x).handling?.pose !== undefined).map(([x, who]) => `${id}: ${f}: THUMB* but the ${who} ${x} has handling.pose (D-SHIP-W4-THUMB)`)));

  // F-W4-INHERIT (RESEARCH-ROUTES-1 part 1, e00a7036) dropped the D-SHIP-W4-ROUTE fields from the 3 cards: each W4 child now
  // passes on its full card; the routed field put back is refused again.
  it('every W4 child passes the family check against its real parent sheet on its full card; red: a D-SHIP-W4-ROUTE field put back', () => {
    const ROUTE: Record<string, string> = { lib_cable_shrug: 'grip.wrist', lib_dumbbell_shrug: 'grip.wrist', lib_sumo_deadlift: 'plate.equipment (bar on the floor with full-size plates, parent c23)' };
    expect(W4().sort()).toEqual([...W4_IDS, ...W4_WAITING_IDS].filter(id => id in FAM.INHERIT_MAP).sort());
    expect(W4_IDS.filter(id => !(id in FAM.INHERIT_MAP))).toEqual(['lib_barbell_shrug']);   // the one W4 shipped id with no parent
    for (const id of W4()) expect([id, refuse(id)]).toEqual([id, null]);
    for (const [id, field] of Object.entries(ROUTE)) {
      const card = cardOf(id), back = { ...card, inherit: [...card.inherit, { field, why: 'pre-F-W4-INHERIT' }] };
      expect([id, FAM.familyRefusal(id, C[id], () => back, (x: string) => (x === parentOf(id) ? C[parentOf(id)] : undefined))]).toEqual([id, `${id}: family: docs/research/howto/cards/${id.slice(4)}.json#inherit: inherited-string map not ruled (D-LIB5-FAMILY)`]);
    }
  });

  describe('D-SHIP-W4-THUMB', () => {
    it('every THUMB* entry\'s parent and child have no handling.pose; the full THUMB entries are the RDL family\'s', () => {
      expect(thumbProblems(id => C[id])).toEqual([]);
      const full = W4().filter(id => Object.values<string[]>(FAM.INHERIT_MAP[id]).some(p => JSON.stringify(p) === JSON.stringify(['handling.thumb.mode', 'handling.pose.thumb'])));
      expect(full.sort()).toEqual(['lib_conventional_deadlift', 'lib_sumo_deadlift']);
      for (const id of full) expect([id, C[parentOf(id)].handling.pose !== undefined]).toEqual([id, true]);
    });
    it('red: a THUMB* entry\'s parent gains handling.pose; its child gains one', () => {
      const posed = (x: string) => (id: string) => (id === x ? { ...C[id], handling: { ...C[id].handling, pose: { thumb: 'wrapped' } } } : C[id]);
      expect(thumbProblems(posed('lib_barbell_bench_press'))).toEqual(expect.arrayContaining(['lib_close_grip_bench_press: grip.thumb: THUMB* but the parent lib_barbell_bench_press has handling.pose (D-SHIP-W4-THUMB)']));
      expect(thumbProblems(posed('lib_landmine_row'))).toEqual(['lib_landmine_row: grip.thumb: THUMB* but the child lib_landmine_row has handling.pose (D-SHIP-W4-THUMB)']);
    });
    it('red: the thumb mode changed in one child', () => {
      for (const id of ['lib_arnold_press', 'lib_pendlay_row', 'lib_smith_machine_shrug']) {
        const other = C[id].handling.thumb.mode === 'wrapped' ? 'thumbless' : 'wrapped';
        expect([id, refuse(id, { child: withLeaf(C[id], 'handling.thumb.mode', '', other) })]).toEqual([id, `${id}: family: grip.thumb: handling.thumb.mode ${JSON.stringify(other)} !== parent ${parentOf(id)}'s ${JSON.stringify(C[parentOf(id)].handling.thumb.mode)} (D-LIB5-FAMILY)`]);
      }
    });
  });

  describe('D-SHIP-W4-GAPZOOM: the inherited gap-ruled hand zooms compare the handling leaves', () => {
    const GAP: [string, string][] = [['lib_close_grip_bench_press', 'zooms.bar-low-palm'], ['lib_decline_bench_press', 'zooms.bar-low-palm'],
      ['lib_incline_barbell_bench_press', 'zooms.bar-low-palm'], ['lib_smith_machine_bench_press', 'zooms.bar-low-palm'],
      ['lib_incline_dumbbell_press', 'zooms.wrist-neutral-press'], ['lib_smith_machine_shrug', 'zooms.shrug-grip']];
    it('the parent has no such zoom (gap-ruled), and every entry maps handling leaves only', () => {
      for (const [id, f] of GAP) {
        const key = f.slice('zooms.'.length);
        expect([id, (C[parentOf(id)].zooms ?? []).some((z: any) => z.key === key)]).toEqual([id, false]);
        expect([id, FAM.INHERIT_MAP[id][f].every((p: string) => p.startsWith('handling.'))]).toEqual([id, true]);
      }
    });
    it.each(GAP)('red: %s %s, one compared leaf changed in the parent, per path', (id, f) => {
      expect(refuse(id, { only: f })).toBeNull();
      for (const [path, r] of perLeaf(id, f)) expect([path, r]).toEqual([path, expect.stringMatching(new RegExp(`^${id}: family: ${f.replace('.', '\\.')}: ${path.replace(/[.[\]]/g, '\\$&')}.* !== parent ${parentOf(id)}'s `))]);
    });
  });

  describe('D-SHIP-W4-PADZOOM: arnold_press seat-back-contact compares the words; the crop and poses are its own', () => {
    const ID = 'lib_arnold_press', F = 'zooms.seat-back-contact';
    const zoomOf = (c: any) => c.zooms.find((z: any) => z.key === 'seat-back-contact');
    /** Arnold's Wrong is drawn on Arnold's plate: its pose must not be DSP's. */
    const poseProblems = (arnold: any, dsp: any) => (JSON.stringify(zoomOf(arnold).wrong.pose) === JSON.stringify(zoomOf(dsp).wrong.pose)
      ? [`${ID}: zooms[seat-back-contact].wrong.pose is ${parentOf(ID)}'s (D-SHIP-W4-PADZOOM)`] : []);
    it('the mapped leaves are exactly the 8 text leaves; Arnold\'s Wrong pose is its own', () => {
      expect(FAM.INHERIT_MAP[ID][F].map((p: string) => p.replace('zooms[key=seat-back-contact].', ''))).toEqual(['key', 'kind', 'chip', 'heading', 'callout.right.text', 'callout.wrong.text', 'caption.right', 'caption.wrong']);
      expect(refuse(ID)).toBeNull();
      expect(poseProblems(C[ID], C[parentOf(ID)])).toEqual([]);
    });
    it('red: each compared text leaf changed in the parent', () => {
      const r = perLeaf(ID, F);
      expect(r).toHaveLength(8);
      for (const [path, x] of r) expect([path, x]).toEqual([path, path.endsWith('.key')
        ? `${ID}: family: ${F}: parent ${parentOf(ID)}: ${path}: [key=seat-back-contact] matches 0 items (D-LIB5-FAMILY)`   // the key leaf: the selector unmatched
        : `${ID}: family: ${F}: ${path} ${JSON.stringify(FAM.atPath(C[ID], path))} !== parent ${parentOf(ID)}'s ${JSON.stringify(`${FAM.atPath(C[parentOf(ID)], path)} x`)} (D-LIB5-FAMILY)`]);
    });
    it('red: DSP\'s wrong.pose copied onto Arnold\'s zoom', () => {
      const dspPose = zoomOf(C[parentOf(ID)]).wrong.pose;
      const m = { ...C[ID], zooms: C[ID].zooms.map((z: any) => (z.key === 'seat-back-contact' ? { ...z, wrong: { ...z.wrong, pose: dspPose } } : z)) };
      expect(poseProblems(m, C[parentOf(ID)])).toEqual([`${ID}: zooms[seat-back-contact].wrong.pose is lib_dumbbell_shoulder_press's (D-SHIP-W4-PADZOOM)`]);
      expect(refuse(ID, { child: m })).toBeNull();   // the family check does not compare poses: this red is the only guard
    });
  });

  describe('Q-W4-6: grip.type maps to the orientation; no handle without a card claim', () => {
    const ORIENT = ['lib_smith_machine_bench_press', 'lib_cable_shrug', 'lib_landmine_row', 'lib_pendlay_row'];
    const NO_HANDLE = ['lib_landmine_row', 'lib_cable_shrug', 'lib_smith_machine_bench_press'];
    /** Q-W4-6: a sheet sets handling.handle only when its card gives a handle (a grip.handle line); none of these does. */
    const handleProblems = (id: string, c: any, card = cardOf(id)) => (c.handling?.handle !== undefined && !card.grip?.handle
      ? [`${id}: handling.handle ${JSON.stringify(c.handling.handle)} with no card claim (Q-W4-6)`] : []);
    it('each maps grip.type to the orientation (pendlay also the handle); the 3 have no handle and their cards give none', () => {
      for (const id of ORIENT) expect([id, FAM.INHERIT_MAP[id]['grip.type']]).toEqual([id, id === 'lib_pendlay_row' ? ['handling.orientation', 'handling.handle'] : ['handling.orientation']]);
      for (const id of NO_HANDLE) expect([id, C[id].handling.handle, cardOf(id).grip?.handle, handleProblems(id, C[id])]).toEqual([id, undefined, undefined, []]);
    });
    it('red: the child\'s orientation differs from its parent\'s', () => {
      for (const id of ORIENT) {
        const r = refuse(id, { child: withLeaf(C[id], 'handling.orientation', '', 'supinated'), onlyMapped: true });
        expect([id, r]).toEqual([id, `${id}: family: grip.type: handling.orientation "supinated" !== parent ${parentOf(id)}'s ${JSON.stringify(C[parentOf(id)].handling.orientation)} (D-LIB5-FAMILY)`]);
      }
    });
    it('red: a handle on landmine_row, cable_shrug or smith_machine_bench_press without a card claim', () => {
      for (const id of NO_HANDLE) {
        const m = { ...C[id], handling: { ...C[id].handling, handle: 'bar-28' } };
        expect([id, handleProblems(id, m)]).toEqual([id, [`${id}: handling.handle "bar-28" with no card claim (Q-W4-6)`]]);
        expect([id, refuse(id, { child: m, onlyMapped: true })]).toEqual([id, null]);   // the family check maps no handle here: this red is the guard
      }
    });
  });

  describe('Q-W4-7: the zoom-linked parent checkpoints compare label, detail and anchor only', () => {
    const CP: [string, string, string, string][] = [['lib_t_bar_row', 'posture[trunk angle stays the same]', 'trunk', 'row-back'],
      ['lib_dumbbell_romanian_deadlift', 'posture: knees fixed at a slight bend, movement at the hips (parent c4)', 'knees', 'rdl-bottom']];
    const known = new Set((exercises as any[]).map(e => e.id));
    it('the parent\'s checkpoint links its own zoom; the child\'s links none of the parent\'s, and C1 passes', () => {
      for (const [id, f, key, zoom] of CP) {
        expect([id, FAM.INHERIT_MAP[id][f]]).toEqual([id, ['label', 'detail', 'anchor'].map(l => `posture[key=${key}].${l}`)]);
        expect([id, C[parentOf(id)].posture.find((p: any) => p.key === key).zoom]).toEqual([id, zoom]);
        expect([id, C[id].posture.find((p: any) => p.key === key).zoom === zoom]).toEqual([id, false]);
        expect([id, checkC1(C[id], known)]).toEqual([id, []]);
      }
    });
    it.each(CP)('red: %s, one inherited word changed in the parent\'s label and detail', (id, f, key) => {
      const p = C[parentOf(id)];
      for (const leaf of ['label', 'detail']) {
        const path = `posture[key=${key}].${leaf}`, m = withLeaf(p, path, '', FAM.atPath(p, path).replace(/\w+/, 'Other'));
        expect([leaf, refuse(id, { parent: m })]).toEqual([leaf, expect.stringMatching(new RegExp(`^${id}: family: ${f.replace(/[.[\]()]/g, '\\$&')}: posture\\[key=${key}\\]\\.${leaf} `))]);
      }
    });
    it.each(CP)('red: %s, the parent\'s zoom link (%s… %s → %s) copied onto the child is a dangling zoom reference', (id, _f, key, zoom) => {
      const m = { ...C[id], posture: C[id].posture.map((p: any) => (p.key === key ? { ...p, zoom } : p)) };
      expect(checkC1(m, known)).toEqual([expect.stringMatching(new RegExp(`^C1: posture\\[\\d+\\] \\(${key}\\) references zoom "${zoom}", which is not in zooms$`))]);
    });
  });

  describe('E5 (amended D-SHIP-W5-PLATEONLY): no INHERIT_MAP field maps to []', () => {
    /** `plateCompared`: the `${id}#${field}` plate.* fields that have their own plate-compare red (none in W4). */
    // D-SHIP-W4-E5W3 (#391 6697811266 ruled (a)): W3's ruled empty field, exactly this one id#field (#384 6648454032 L2,
    // accepted 6648753200: the card's own setup steps replace the inherited lean). Every other [] stays red.
    const E5_RULED = new Set(['lib_single_arm_lat_pulldown#setup: lean back only slightly (about 30 degrees at most), no extra lean during the pull']);
    const emptyProblems = (map: Record<string, Record<string, string[]>>, plateCompared: Set<string> = new Set(), ruled: Set<string> = E5_RULED) => Object.entries(map).flatMap(([id, e]) =>
      Object.entries(e).filter(([f, paths]) => paths.length === 0 && !ruled.has(`${id}#${f}`) && !(f.startsWith('plate.') && plateCompared.has(`${id}#${f}`))).map(([f]) => `${id}: ${f}: mapped to [] (E5)`));
    it('the real map has none but the one ruled W3 field (D-SHIP-W4-E5W3)', () => { expect(emptyProblems(FAM.INHERIT_MAP)).toEqual([]); });
    it('D-SHIP-W4-E5W3 reds: a second, unruled [] field is caught; the exception widened to the id (any field) is red; without the exception the W3 field is red', () => {
      const W3 = 'lib_single_arm_lat_pulldown', W3F = 'setup: lean back only slightly (about 30 degrees at most), no extra lean during the pull';
      expect(FAM.INHERIT_MAP[W3][W3F]).toEqual([]);
      expect(emptyProblems({ ...FAM.INHERIT_MAP, [W3]: { ...FAM.INHERIT_MAP[W3], 'grip.thumb': [] } })).toEqual([`${W3}: grip.thumb: mapped to [] (E5)`]);
      // widen to the id: an id-level exception would hide that second field; the real one is exactly id#field, so it is caught
      const widened = (map: Record<string, Record<string, string[]>>) => Object.entries(map).flatMap(([id, e]) => Object.entries(e).filter(([, p]) => p.length === 0 && id !== W3).map(([f]) => `${id}: ${f}`));
      expect(widened({ ...FAM.INHERIT_MAP, [W3]: { ...FAM.INHERIT_MAP[W3], 'grip.thumb': [] } })).toEqual([]);   // what a widened exception would let through
      expect([...E5_RULED].every(k => /^lib_[a-z_]+#.+/.test(k))).toBe(true);
      expect(emptyProblems(FAM.INHERIT_MAP, new Set(), new Set())).toEqual([`${W3}: ${W3F}: mapped to [] (E5)`]);
      expect([...E5_RULED]).toEqual([`${W3}#${W3F}`]);
    });
    it('red: a sheet field mapped to []; a plate.* field mapped to [] with no plate-compare red; control: one that has its red', () => {
      expect(emptyProblems({ ...FAM.INHERIT_MAP, lib_t_bar_row: { ...FAM.INHERIT_MAP.lib_t_bar_row, 'grip.thumb': [] } })).toEqual(['lib_t_bar_row: grip.thumb: mapped to [] (E5)']);
      const plate = { ...FAM.INHERIT_MAP, lib_sumo_deadlift: { ...FAM.INHERIT_MAP.lib_sumo_deadlift, 'plate.equipment': [] } };
      expect(emptyProblems(plate)).toEqual(['lib_sumo_deadlift: plate.equipment: mapped to [] (E5)']);
      expect(emptyProblems(plate, new Set(['lib_sumo_deadlift#plate.equipment']))).toEqual([]);
      // why it is needed: familyRefusal compares nothing for [] and passes
      const card = cardOf('lib_t_bar_row');
      FAM.INHERIT_MAP.lib_e5 = { f: [] };
      try { expect(FAM.familyRefusal('lib_e5', { research: { card: 'c.json' } }, () => ({ parent: card.parent, inherit: [{ field: 'f' }] }), () => ({}))).toBeNull(); }
      finally { delete FAM.INHERIT_MAP.lib_e5; }
    });
  });
});

describe('LIB-SHIP W4 Q-W4-10: skull_crusher contact from CONVENTIONS[ga:push-heel]', () => {
  const card = () => json('docs/research/howto/cards/skull_crusher.json');
  const CONTACT_OF_ZONE = { 'heel of the palm': 'heel', 'middle of the palm': 'mid-palm', 'base of the fingers': 'finger-base' } as const;
  /** The contact the convention derives: the HandContact of the zone its text names. */
  const derived = (conv: string) => Object.entries(CONTACT_OF_ZONE).find(([z]) => conv.includes(z))?.[1];
  it('the sheet copies the convention text and its contact is the one the convention derives (heel)', async () => {
    const { content: c } = await content.loadContent('lib_skull_crusher'), conv = P.CONVENTIONS['ga:push-heel'] as string;
    expect(readFileSync(join(ROOT, 'tools/plates/library/howto/lib_skull_crusher.howto.mjs'), 'utf8')).toContain(`const PUSH_HEEL = ${JSON.stringify(conv).replace(/"/g, "'")};`);
    expect([c.handling.contact, derived(conv)]).toEqual(['heel', 'heel']);
    expect(checkConventionGrip(c, null, conv)).toEqual([]);
  });
  it('red 1: the convention changes (zone or range)', async () => {
    const { content: c } = await content.loadContent('lib_skull_crusher'), conv = P.CONVENTIONS['ga:push-heel'] as string;
    const moved = conv.replace('heel of the palm', 'middle of the palm');
    expect([derived(moved), checkConventionGrip(c, null, moved)]).toEqual(['mid-palm', ['GRIPC: lib_skull_crusher: contact heel is not the convention\'s zone']]);
    expect(checkConventionGrip(c, null, conv.replace(/extension \d+ to \d+/, 'extension 0 to 20'))).toEqual(['GRIPC: lib_skull_crusher: wrist ext [0,15] is not the convention\'s range']);
  });
  it('red 2: the card gains a handContact that disagrees', async () => {
    const { content: c } = await content.loadContent('lib_skull_crusher'), k = card();
    expect(checkConventionGrip(c, { grip: { ...k.grip, handContact: 'Bar across the middle of the palm.' } }, P.CONVENTIONS['ga:push-heel'])).toEqual(['GRIPC: lib_skull_crusher: card grip.handContact disagrees with the convention']);
    expect(checkConventionGrip(c, { grip: { ...k.grip, handContact: 'Bar on the heel of the palm.' } }, P.CONVENTIONS['ga:push-heel'])).toEqual([]);   // control
  });
});

describe('LIB-SHIP W4 barbell_shrug contact from golden B\'s hold default (as cable_fly, #379 6627240712)', () => {
  const contactProblems = (row: any, src: any) => (row.handling.contact === src.handling.contact ? [] : [`hold-default: ${row.id} contact ${row.handling.contact} is not ${src.id}'s ${src.handling.contact}`]);
  it('equals lib_dumbbell_lateral_raise\'s contact (mid-palm), the file its hold-default source names', async () => {
    const [{ content: sh, sources }, { content: src }] = await Promise.all(['lib_barbell_shrug', 'lib_dumbbell_lateral_raise'].map(id => content.loadContent(id)));
    expect((sources as any)['hold-default'].url).toBe('tools/plates/layers/exercises/dumbbell_lateral_raise.howto.mjs');
    expect((sources as any)['hold-default'].use).toBe('CONVENTION');
    expect([sh.handling.contact, contactProblems(sh, src)]).toEqual(['mid-palm', []]);
  });
  it('red 1: the source\'s contact changes', async () => {
    const [{ content: sh }, { content: src }] = await Promise.all(['lib_barbell_shrug', 'lib_dumbbell_lateral_raise'].map(id => content.loadContent(id)));
    expect(contactProblems(sh, { ...src, handling: { ...src.handling, contact: 'finger-base' } })).toEqual(['hold-default: lib_barbell_shrug contact mid-palm is not lib_dumbbell_lateral_raise\'s finger-base']);
  });
  it('red 2: the sheet\'s contact changes', async () => {
    const [{ content: sh }, { content: src }] = await Promise.all(['lib_barbell_shrug', 'lib_dumbbell_lateral_raise'].map(id => content.loadContent(id)));
    expect(contactProblems({ ...sh, handling: { ...sh.handling, contact: 'heel' } }, src)).toEqual(['hold-default: lib_barbell_shrug contact heel is not lib_dumbbell_lateral_raise\'s mid-palm']);
  });
});

// LIB-SHIP W3 D-SHIP-LEFTOUT-CLOSURE (#383 6632352291): a `left-out:` row in a batch file (leg_press_calf_raise, no spec)
// is never staged or listed by the batch closure (ci/manifest.mjs filesOf); a non-left-out row with no spec still throws.
describe('LIB-SHIP W3 D-SHIP-LEFTOUT-CLOSURE: left-out rows stay out of the batch closure', () => {
  const LEFT = 'lib_leg_press_calf_raise';
  it('the left-out row is in lb01.json at left-out:D-OWNER-LIB142, and no MANIFEST row or file names it', async () => {
    const { rows } = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const { manifestOf } = await import(/* @vite-ignore */ url('tools/plates/library/ci/manifest.mjs'));
    const row = rows().find((r: any) => r.id === LEFT);
    expect(row?.stage).toBe('left-out:D-OWNER-LIB142');
    expect(row?.batchFile).toBe('tools/plates/library/batches/lb01.json');
    const m: any = await manifestOf();
    expect(Object.keys(m.rows)).not.toContain(LEFT);
    for (const r of Object.values(m.rows) as any[]) expect(Object.keys(r.files).filter(p => p.includes('leg_press_calf_raise'))).toEqual([]);
  }, 120_000);
  it('the pinned MANIFEST sets are byte-equal to the committed file', async () => {
    const { manifestOf, manifestText, MANIFEST } = await import(/* @vite-ignore */ url('tools/plates/library/ci/manifest.mjs'));
    expect(manifestText(await manifestOf())).toBe(readFileSync(join(ROOT, MANIFEST), 'utf8'));
  }, 120_000);
  it('a row that is not left-out with a missing spec still throws', async () => {
    const { rows } = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const { filesOf } = await import(/* @vite-ignore */ url('tools/plates/library/ci/manifest.mjs'));
    const all = rows().map((r: any) => (r.id === LEFT ? { ...r, stage: 'approved-plate' } : r));
    const chin = all.find((r: any) => r.id === 'lib_chin_up');
    await expect(filesOf(chin, { all })).rejects.toThrow(/leg_press_calf_raise\.mjs does not exist/);
  }, 120_000);
  it('the lb01 layers spec stages no file of the left-out row (layers-spec.mjs filter)', async () => {
    const { layersSpecOf } = await import(/* @vite-ignore */ url('tools/plates/library/layers-spec.mjs'));
    const { mkdtempSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    const { rows } = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    // the left-out row (no pages, no spec) first in the batch: unfiltered, the spec would read its missing pages
    const { writeFileSync } = await import('node:fs');
    const { relative } = await import('node:path');
    // a scratch config that lists the left-out row, given to that row only and put first: unfiltered, layersSpecOf reads
    // the first batch row's config and stages the left-out row (its spec does not exist, so it throws)
    const dir = mkdtempSync(join(tmpdir(), 'w3-leftout-cfg-')), cfgPath = join(dir, 'lb01.layers.json');
    const cfg = json('tools/plates/library/pages/lb01.layers.json');
    writeFileSync(cfgPath, JSON.stringify({ ...cfg, groups: cfg.groups.map((g: any) => ({ ...g, ids: [...g.ids, 'lib_leg_press_calf_raise'] })) }));
    const all = rows(), left = all.find((r: any) => r.id === 'lib_leg_press_calf_raise');
    const front = [{ ...left, pages: { ...left.pages, layersConfig: relative(ROOT, cfgPath) } }, ...all.filter((r: any) => r !== left)];
    for (const order of [all, front]) {
      const spec: any = layersSpecOf('tools/plates/library/batches/lb01.json', { stageDir: mkdtempSync(join(tmpdir(), 'w3-leftout-')), all: order });
      expect(JSON.stringify(spec)).not.toContain('leg_press_calf_raise');
      expect(spec.groups.flatMap((g: any) => g.ids)).toHaveLength(8);   // 12 drawn LB1 rows less the 4 staged (underhand LIB-PLATEFIX-3, assisted_pull_up #384 6653062201, incline_machine_press and shoulder_press D-SHIP-W3-NOPAIR #384 6681221802)
    }
  }, 120_000);
});

describe('LIB-SHIP W3 Q-W3-13: zoom/ink-check.mjs probes a pinned row through its pinned (non-authoring) candidate', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const href = async (p: string) => (await import('node:url')).pathToFileURL(join(process.cwd(), p)).href;
  const ink = async (): Promise<any> => import(/* @vite-ignore */ await href('tools/plates/library/zoom/ink-check.mjs'));
  it('pinned stages take the pinned candidate, drawing and review the authoring one; horizontal_leg_press is pinned', async () => {
    const I = await ink(), { rows }: any = await import(/* @vite-ignore */ await href('tools/plates/library/registry.mjs'));
    expect(['approved-plate', 'shipped', 'drawing', 'review'].map(stage => I.authoringFor({ stage }))).toEqual([false, false, true, true]);
    expect(I.authoringFor(rows().find((r: any) => r.id === I.ID))).toBe(false);
  });
  it('red 1: the authoring candidate the check used before is refused for the pinned row (the gate red Q-W3-13 fixes)', async () => {
    const { candidateOf }: any = await import(/* @vite-ignore */ await href('tools/plates/library/candidate.mjs'));
    await expect(candidateOf('lib_horizontal_leg_press', { platesHtml: '', authoring: true })).rejects.toThrow(/authoring QA is refused at stage (approved-plate|shipped) \(D-LIB9-AUTHORQA\)/);
  });
  it('red 2: PAGE_SHA is the zoom batch\'s pinned plates page; the stale main sha is not', async () => {
    const I = await ink(), g = JSON.parse(readFileSync(join(process.cwd(), 'tests/howto/golden/library/zoom.json'), 'utf8'));
    const page = [...g.entries].reverse().find((e: any) => e.kind === 'page');
    expect(I.PAGE_SHA).toBe(page.pageSha256);
    expect(page.pageSha256).not.toBe('a0ef8eabc3b6935193531cd9236a27c5e67b5102f8b9f9c9ec7f3de031ccece0');
  });
  it('red 3: the check never hard-codes the authoring candidate again', async () => {
    const src = readFileSync(join(process.cwd(), 'tools/plates/library/zoom/ink-check.mjs'), 'utf8');
    expect(src).not.toMatch(/authoring: true/);
    expect(src).toMatch(/authoring: authoringFor\(/);
  });
});

// LIB-SHIP W3 D-SHIP-W3-LAYERSZOOM (#384 6686326673): build-layers-page.mjs applies applyZooms to the mirror specs, so a
// layers page draws each opted-in plate with the zoom circle its pinned plate has (HT4-A5 compares the two, byte for byte).
describe('LIB-SHIP W3 D-SHIP-LAYERSZOOM: a layers page carries the zoom its pinned plate has', () => {
  const ZOOMED: [string, string][] = [['zoom', 'lib_horizontal_leg_press'], ['pilot-b2', 'lib_crunch']];
  const pinOf = (b: string, id: string) => json(`tests/howto/golden/library/${b}.json`).entries.filter((e: any) => e.kind === 'plate' && e.id === id).at(-1);
  const page = (b: string) => readFileSync(join(ROOT, `tests/howto/golden/library/${b}.layers.html`), 'utf8');
  /** The page with every zoom group taken out of `chrome`'s plate (what the layers page drew before this ruling). */
  const unzoomed = (h: string, chrome: string) => {
    const fit = h.indexOf(`<div class="plate-fit" id="${chrome}-plate">`), stop = h.indexOf('<div class="plate-fit"', fit + 1);
    let card = h.slice(fit, stop < 0 ? undefined : stop);
    for (let i; (i = card.indexOf('<g class="plate-zoom"')) >= 0;) card = card.slice(0, i) + card.slice(card.indexOf('</svg>', i));
    return h.slice(0, fit) + card + (stop < 0 ? '' : h.slice(stop));
  };
  it('the committed zoom and pilot-b2 layers pages draw their zoomed plates byte-equal to the pinned plate entries', async () => {
    const gb = await import(/* @vite-ignore */ url('tools/plates/fidelity/goldenB.mjs'));
    for (const [b, id] of ZOOMED) {
      expect([b, gb.fragmentProblems(page(b), [pinOf(b, id)])]).toEqual([b, []]);
      expect(page(b)).toContain('<g class="plate-zoom" data-view="mistake"');
    }
  });
  it('red: a layers page whose Mistake plate lacks the zoom its pinned plate has', async () => {
    const gb = await import(/* @vite-ignore */ url('tools/plates/fidelity/goldenB.mjs'));
    for (const [b, id] of ZOOMED) {
      const e = pinOf(b, id), bad = gb.fragmentProblems(unzoomed(page(b), e.chromeId), [e]);
      expect([b, bad.some((p: string) => p.startsWith(`${e.chromeId}: mistakeSvg sha256 `))]).toEqual([b, true]);
    }
  });
  // Q-W3-20 (#384 6687335829): gen/zooms.mjs lessZoomCss takes ZOOM_CSS out of a zoomed layers page's style exactly once
  // before the golden B comparison; every other byte is compared. Its 4 reds, and the clean case.
  it('lessZoomCss: clean on a zoomed page; red on the CSS altered by one character, twice, on a page with no zoom, missing on a zoom page', async () => {
    const Z = await import(/* @vite-ignore */ url('tools/plates/gen/zooms.mjs')), { ZOOM_CSS } = await import(/* @vite-ignore */ url('tools/plates/library/zoom/inline.mjs'));
    const REST = '.plate .x { fill: none; }\n', G = '<g class="plate-zoom" data-view="mistake"></g>';
    const page = (css: string, zoom = true) => `<style>${css}${REST}</style><svg>${zoom ? G : ''}</svg>`;
    expect(Z.lessZoomCss(ZOOM_CSS + REST, page(ZOOM_CSS), 'lib_x')).toBe(REST);
    expect(Z.lessZoomCss(REST, page('', false), 'lib_x')).toBe(REST);   // no zoom, no CSS: the style as it is
    const one = ZOOM_CSS.replace('stroke-width: 1.25', 'stroke-width: 1.35');
    expect(one).not.toBe(ZOOM_CSS);
    expect(() => Z.lessZoomCss(one + REST, page(one), 'lib_x')).toThrow(/must carry ZOOM_CSS once, right after <style>/);
    expect(() => Z.lessZoomCss(ZOOM_CSS + ZOOM_CSS + REST, page(ZOOM_CSS + ZOOM_CSS), 'lib_x')).toThrow(/must carry ZOOM_CSS once/);
    expect(() => Z.lessZoomCss(ZOOM_CSS + REST, page(ZOOM_CSS, false), 'lib_x')).toThrow(/ZOOM_CSS on a layers page with no plate zoom/);
    expect(() => Z.lessZoomCss(REST, page(''), 'lib_x')).toThrow(/must carry ZOOM_CSS once/);
  });
  it('the builder applies applyZooms to the mirror specs after the build', () => {
    const src = readFileSync(join(ROOT, 'tools/plates/library/build-layers-page.mjs'), 'utf8');
    expect(src).toContain("import { applyZooms } from './zoom/inline.mjs';");
    expect(src).toContain("const page = await applyZooms(readFileSync(join(mirror, 'artifact', 'technical-plates.html')), specs);");
  });
});
