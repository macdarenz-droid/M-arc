// LIB-SHIP (card docs/supervisor/verify/lib-ship-card.md; PR #376): the rulings' own checks.
// - D-SHIP-C3 (6614298313): checkC3Library and the pinned no-zoom list, each of the five reds proven on a mutation.
// - D-SHIP-GRIP (6614415740): (a) a field the card leaves empty takes the pair key's recorded value, pinned here per
//   shipped keyed row; (b) NoHandling only when the card gives no hand claim at all.
// - A1 (W1): the shipped set is the 8 then exactly the ruled library ids.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';
import { B3_PINS, RULED, allSharedBoxes, checkC3Library, checkConventionGrip, checkGripB3, checkGripLibrary, noRedFlagProblems } from './checks/c3-library';
import { checkC3 } from './checks/c3';

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
    expect(reg.shippedIds()).toEqual([...EIGHT, ...RULED_SHIPPED]);
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
  });
});

describe('LIB-SHIP W7 D-SHIP-W7-B3 (#394 6647954465, Q-W7-1/Q-W7-5): NoHandling for 5 listed handled cards, fields pinned', () => {
  const card = (id: string) => json(`docs/research/howto/cards/${id}.json`);
  const B3 = ['lib_cable_crunch', 'lib_jump_rope', 'lib_wall_ball', 'lib_kettlebell_swing', 'lib_medicine_ball_slam'];
  const strip = (c: any, cid: string) => ({ ...c, setup: c.setup.map((s: any) => ({ ...s, claim: s.claim && { ...s.claim, note: String(s.claim.note ?? '').replace(new RegExp(`\\b${cid}\\b`, 'g'), 'cX') } })),
    posture: c.posture.map((s: any) => ({ ...s, claim: s.claim && { ...s.claim, note: String(s.claim.note ?? '').replace(new RegExp(`\\b${cid}\\b`, 'g'), 'cX') } })) });
  it('the listed set is exactly the 5, and each pin names every non-empty card field', () => {
    expect(Object.keys(B3_PINS)).toEqual(B3);
    for (const id of B3) {
      const g = card(id.slice(4)).grip, filled = (['thumb', 'handContact', 'wrist'] as const).filter(k => String(g[k] ?? '').trim() !== '');
      expect([id, Object.keys(B3_PINS[id] ?? {}).sort()]).toEqual([id, [...filled].sort()]);
    }
  });
  it('each listed sheet is NoHandling with why D-SHIP-GRIP (b3) and passes', async () => {
    for (const id of B3) {
      const { content: c } = await content.loadContent(id);
      expect([id, c.handling.archetype, /D-SHIP-GRIP \(b3\)/.test(c.handling.why ?? '')]).toEqual([id, 'none', true]);
      expect([id, checkGripLibrary(c, card(id.slice(4)))]).toEqual([id, []]);
    }
  });
  it('red 1: an unlisted handled card under (b3)', async () => {
    const { content: c } = await content.loadContent('lib_cable_fly');
    expect(checkGripLibrary({ ...c, handling: { archetype: 'none', why: 'D-SHIP-GRIP (b3)' } }, card('cable_fly'))).toEqual(['GRIP: lib_cable_fly uses D-SHIP-GRIP (b3) but it is not one of the listed ids']);
  });
  it('red 2: a listed field whose card bytes differ from its pin', async () => {
    const { content: c } = await content.loadContent('lib_wall_ball'), k = card('wall_ball');
    expect(checkGripLibrary(c, { ...k, grip: { ...k.grip, thumb: 'Wrapped round the ball.' } })).toEqual(['GRIP: lib_wall_ball uses D-SHIP-GRIP (b3) but card grip.thumb differs from its pinned bytes']);
  });
  it('red 3: a pinned claim cited on no setup or posture line (and the grip.claims id with it)', async () => {
    const { content: c } = await content.loadContent('lib_wall_ball');
    expect(checkGripLibrary(strip(c, 'c9'), card('wall_ball'))).toEqual(['GRIP: lib_wall_ball uses D-SHIP-GRIP (b3) but pinned claim c9 (grip.handContact) is cited on no setup or posture line',
      'GRIP: lib_wall_ball uses D-SHIP-GRIP (b3) but card claim c9 (grip.claims) is cited on no setup or posture line']);
  });
  it('red 4: a card grip.claims id cited nowhere, and a card field emptied while pinned', async () => {
    const { content: c } = await content.loadContent('lib_kettlebell_swing'), k = card('kettlebell_swing');
    expect(checkGripLibrary(strip(c, 'c24'), k)).toEqual(['GRIP: lib_kettlebell_swing uses D-SHIP-GRIP (b3) but card claim c24 (grip.claims) is cited on no setup or posture line']);
    expect(checkGripB3(c, { ...k, grip: { ...k.grip, wrist: '' } }, ['thumb', 'handContact'])).toEqual(['GRIP: lib_kettlebell_swing uses D-SHIP-GRIP (b3) but card grip.wrist is empty and pinned']);
  });
  it('red 5: (b3) on a card whose archetype.hand is none, and plain (b) on a listed row (the b/b2 reds above still hold)', async () => {
    const { content: c } = await content.loadContent('lib_jump_rope'), k = card('jump_rope');
    expect(checkGripLibrary(c, { ...k, archetype: { hand: 'none' } })).toEqual(['GRIP: lib_jump_rope uses D-SHIP-GRIP (b3) but its card\'s archetype.hand is not a handled archetype (use (b2))']);
    expect(checkGripLibrary({ ...c, handling: { archetype: 'none', why: 'D-SHIP-GRIP (b)' } }, k)).toEqual(['GRIP: lib_jump_rope uses D-SHIP-GRIP (b) but its card claims grip.handContact, grip.wrist']);
  });
});

describe('LIB-SHIP W7 D-SHIP-HANDW7 (#394 6647954465, Q-W7-3/Q-W7-4): gap-ruled palm-flat trio and farmer_s_carry; no W7 hand pair', () => {
  const nz = () => json('tools/plates/library/hands/no-zoom.json').entries as Record<string, any>;
  const TRIO = ['bird_dog', 'burpee', 'bear_crawl'];
  it('D-SHIP-HANDW7 is ruled; the trio and farmer_s_carry are gap-ruled under it, sled_pull gap-key at hand-implement.mjs:7', () => {
    expect(RULED.has('D-SHIP-HANDW7')).toBe(true);
    for (const id of [...TRIO, 'farmer_s_carry']) expect([id, nz()[`lib_${id}`]?.ruling, nz()[`lib_${id}`]?.reason]).toEqual([id, 'D-SHIP-HANDW7', 'gap-ruled']);
    expect(nz().lib_sled_pull).toEqual({ ruling: 'D-SHIP-C3', reason: 'gap-key', at: 'tools/plates/library/hands/hand-implement.mjs:7' });
  });
  it('the trio stay in hand-palm-flat.mjs IDS and get no pair; bear_crawl keeps its own wrist claim (c11)', async () => {
    const pf = keyMods.find((m: any) => m.KEY === 'palm-flat');
    for (const id of TRIO) expect([id, id in pf.IDS]).toEqual([id, true]);
    // pairsOf over the 4 no-zoom W7 ids and sled_pull (gap-key): none gets a pair (battle_ropes is held: HAND_OF_ID maps it,
    // so it would get one; the supervisor's Q-W7-2 route stops its flip, D-SHIP-W7-ROPES)
    const HP = await import(/* @vite-ignore */ url('tools/plates/gen/handpairs.mjs'));
    const W = [...TRIO, 'farmer_s_carry', 'sled_pull'].map(i => `lib_${i}`);
    expect(HP.pairsOf(P, W).pairOf).toEqual({});
    expect(Object.keys(HP.pairsOf(P, ['lib_battle_ropes']).pairOf)).toEqual(['battle-ropes']);   // control: the held id would pair
    const { content: c } = await content.loadContent('lib_bear_crawl');
    expect(String(c.handling.wrist.claim?.note ?? '')).toMatch(/\bc11\b/);
  });
  it('red: a gap-ruled trio entry removed turns C3 red', async () => {
    const { content: c } = await content.loadContent('lib_bird_dog'), { lib_bird_dog: _drop, ...rest } = nz();
    expect(checkC3Library(c, 'Bodyweight', { list: rest, card: json('docs/research/howto/cards/bird_dog.json'), gapKeyOf }).join('\n')).toMatch(/C3: handling.archetype is not none, and no hand zoom/);
  });
});

describe('LIB-SHIP W7 D-SHIP-W7-NOREDFLAG (#394 6648497703, = D-SHIP-W6-NOREDFLAG #393 6648157060): riskFlags [] rows', () => {
  const NO_RED_FLAG = ['lib_high_knees', 'lib_battle_ropes', 'lib_jumping_jacks'];
  // Q-W7-7 (D-SHIP-LEFTOUT-CLOSURE): the left-out rows (no How-to sheet) are not W7 sheets; every other row still is.
  const W7 = ['lb08', 'lb09', 'lb10'].flatMap(b => Object.entries<any>(json(`tools/plates/library/batches/${b}.json`).rows).filter(([, r]) => !/^left-out:/.test(r.stage)).map(([id]) => id));
  it('the W7 sheets with riskFlags [] are exactly the 3 pinned ids, each card names no red flag, and none is red', async () => {
    const empty: string[] = [];
    for (const id of W7) {
      const { content: c } = await content.loadContent(id);
      if (Array.isArray(c.riskFlags) && c.riskFlags.length === 0) empty.push(id);
      expect([id, noRedFlagProblems(c, json(c.research.card))]).toEqual([id, []]);
    }
    expect(empty).toEqual(NO_RED_FLAG);
  }, 60_000);
  it('red: riskFlags [] on a card that names a red flag', async () => {
    const { content: c } = await content.loadContent('lib_high_knees');
    expect(noRedFlagProblems(c, { ...json(c.research.card), redFlags: ['knee'] })).toEqual(['RF: lib_high_knees: riskFlags is [] but its card names red flags knee']);
  });
  it('the C19 boxes for such a row are every shared box plus the back box; the disclaimer alone stays red', async () => {
    const [shared, BB, C19] = await Promise.all([import(/* @vite-ignore */ url('tools/plates/layers/howto/shared.mjs')), import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs')), import('./checks/c19')]);
    const boxes = allSharedBoxes(shared, BB.backBox());
    expect(Object.values(boxes).every(b => b && typeof b === 'object')).toBe(true);
    expect(C19.checkC19Shared({ ...boxes, DISCLAIMER: shared.DISCLAIMER }, 'lib_high_knees')).toEqual([]);
    expect(C19.checkC19Shared({ DISCLAIMER: shared.DISCLAIMER }, 'lib_high_knees')).toEqual(['C19: lib_high_knees: no RED_FLAG box to check']);
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

// LIB-SHIP W7 Q-W7-7 D-SHIP-LEFTOUT-CLOSURE (ruling 14): the owner's left-out W7 ids are rows of lb08.json and lb09.json at
// left-out:D-OWNER-LIB142 (W3's leg_press_calf_raise form). No MANIFEST row, layers spec or plates page names them, and the
// lb8/lb9 drawnIds skip them although their specs exist (bicycle_crunch has none).
describe('LIB-SHIP W7 Q-W7-7 D-SHIP-LEFTOUT-CLOSURE: the 8 left-out W7 rows stay out', () => {
  const LEFT: Record<string, string[]> = {
    lb08: ['lib_seated_calf_raise', 'lib_standing_calf_raise', 'lib_bodyweight_calf_raise', 'lib_hip_thrust'],
    lb09: ['lib_pallof_press', 'lib_russian_twist', 'lib_flutter_kicks', 'lib_bicycle_crunch'],
  };
  const ALL = Object.values(LEFT).flat(), bare = (id: string) => id.slice(4);
  const named = (text: string) => ALL.filter(id => new RegExp(`\\b${bare(id)}\\b|\\b${bare(id).replace(/_/g, '-')}\\b`).test(text));
  it('each is in its batch file at left-out:D-OWNER-LIB142, after the existing rows, in the HELD row form (no pages, sources or pin); no MANIFEST row or file names it', async () => {
    const { rows } = await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'));
    const { MANIFEST } = await import(/* @vite-ignore */ url('tools/plates/library/ci/manifest.mjs'));
    const all = rows(), VIEW: Record<string, string> = { lib_russian_twist: 'front', lib_bicycle_crunch: 'front' };
    for (const [b, ids] of Object.entries(LEFT)) {
      const file = `tools/plates/library/batches/${b}.json`, j = json(file);
      expect(Object.keys(j.rows).slice(-ids.length), b).toEqual(ids);
      expect(named(readFileSync(join(ROOT, `tests/howto/golden/library/${b}.json`), 'utf8')), `${b} pin`).toEqual([]);   // no pin
      for (const id of ids) {
        const s = bare(id).replace(/_/g, '-');
        expect(j.rows[id], id).toEqual({ src: `library/specs/${bare(id)}.mjs`, slug: s, prefix: s, chromeId: s, mode: 'H', view: VIEW[id] ?? 'side', stage: 'left-out:D-OWNER-LIB142' });
        expect(json(`docs/research/howto/cards/${bare(id)}.json`).plate.view, id).toBe(j.rows[id].view);
        expect(all.find((r: any) => r.id === id)?.batchFile, id).toBe(file);
      }
    }
    const m = json(MANIFEST);
    for (const id of ALL) expect(Object.keys(m.rows), id).not.toContain(id);
    for (const r of Object.values(m.rows) as any[]) expect(named(Object.keys(r.files).join('\n'))).toEqual([]);
  });
  it('the lb08 and lb09 layers specs stage none of them (layers-spec.mjs filter)', async () => {
    const { layersSpecOf } = await import(/* @vite-ignore */ url('tools/plates/library/layers-spec.mjs'));
    const { mkdtempSync } = await import('node:fs');
    const { tmpdir } = await import('node:os');
    for (const b of Object.keys(LEFT)) {
      const spec: any = layersSpecOf(`tools/plates/library/batches/${b}.json`, { stageDir: mkdtempSync(join(tmpdir(), `w7-leftout-${b}-`)) });
      expect(named(JSON.stringify(spec)), b).toEqual([]);
    }
  }, 120_000);
  it('the lb8 and lb9 plates pages draw none of them; red: with the stage off left-out, drawnIds takes the id (its spec exists)', async () => {
    const [L8, L9] = await Promise.all(['lb8', 'lb9'].map(n => import(/* @vite-ignore */ url(`tools/plates/library/${n}/build.mjs`))));
    for (const [b, B, build] of [['lb08', L8, 'buildLb8Page'], ['lb09', L9, 'buildLb9Page']] as const) {
      const ids: string[] = B.drawnIds();
      expect(ids.filter(id => ALL.includes(id)), b).toEqual([]);
      const html = (await B[build]()).html.toString('utf8');
      expect(LEFT[b]!.filter(id => html.includes(`id="card-${bare(id).replace(/_/g, '-')}"`)), b).toEqual([]);
      const data = json(`tools/plates/library/batches/${b}.json`), id = LEFT[b]![0]!;
      expect(B.drawnIds(undefined, { ...data, rows: { ...data.rows, [id]: { ...data.rows[id], stage: 'drawing' } } }), b).toContain(id);
    }
    // bicycle_crunch has no spec: the existence filter alone keeps it out, as for leg_press_calf_raise
    expect(L9.drawnIds(undefined, { rows: { lib_bicycle_crunch: { ...json('tools/plates/library/batches/lb09.json').rows.lib_bicycle_crunch, stage: 'drawing' } } })).toEqual([]);
  }, 300_000);
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
