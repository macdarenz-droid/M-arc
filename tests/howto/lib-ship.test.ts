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

const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const json = (p: string) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const EIGHT = Object.keys(json('tools/plates/plates.json'));
/** The library ids ruled to ship on this head, in registry order (W1: D-SHIP-W1-LAYERS #376 6616230145; W2: the 9 of
 *  D-SHIP-W2-STAMP #379 6636105974, less crunch and seated_leg_curl held by Q6/Q7 6636501505, 6636616603). */
const RULED_SHIPPED = ['lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_dumbbell_shoulder_press', 'lib_upright_row',
  'lib_dumbbell_biceps_curl', 'lib_rope_triceps_pushdown', 'lib_plank', 'lib_cable_fly', 'lib_push_up'];

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
    expect(keys).toEqual(['curl-dumbbell-under']);
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
    expect((await ht4()).mirrorExtras(process.cwd(), ids)).toEqual([BACK]);
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

// LIB-SHIP W5 (SHIP W5 PLAN RULED, #392 6647901307): the rulings' own checks, each red proven on an in-memory mutation.
describe('LIB-SHIP W5 D-SHIP-W5-PLATEONLY: [] only on a plate.* field, plate.view equal on cards and specs', () => {
  let FAM: any;
  beforeAll(async () => { FAM = await import(/* @vite-ignore */ url('tools/plates/library/lint/family.mjs')); });
  const FM = () => FAM.INHERIT_MAP as Record<string, Record<string, string[]>>;
  const emptyNonPlate = (map: Record<string, Record<string, string[]>>) => Object.entries(map).flatMap(([id, m]) =>
    Object.entries(m).filter(([f, p]) => p.length === 0 && !f.startsWith('plate.')).map(([f]) => `${id}: ${f}: [] on a non-plate field (D-SHIP-W5-PLATEONLY)`));
  const spec = async (id: string) => (await import(/* @vite-ignore */ url(`tools/plates/library/specs/${id}.mjs`))).default;
  const viewProblems = (id: string, kid: any, par: any, kidSpec: any, parSpec: any) => [
    ...(kid.plate.view === par.plate.view ? [] : [`${id}: card plate.view ${kid.plate.view} !== parent ${par.plate.view}`]),
    ...(kidSpec.view === parSpec.view ? [] : [`${id}: spec view ${kidSpec.view} !== parent ${parSpec.view}`])];
  it('the [] entries are exactly the 9 plate.view and straight_bar\'s plate.equipment; a [] on a non-plate field is red', () => {
    const empties = Object.entries(FM()).flatMap(([id, m]) => Object.entries(m).filter(([, p]) => p.length === 0).map(([f]) => `${id} ${f}`));
    expect(empties).toEqual([...['alternating_dumbbell_curl', 'barbell_curl', 'ez_bar_curl', 'hammer_curl', 'forward_lunge', 'walking_lunge', 'bulgarian_split_squat',
      'single_arm_triceps_pushdown'].map(s => `lib_${s} plate.view`), 'lib_straight_bar_triceps_pushdown plate.view', 'lib_straight_bar_triceps_pushdown plate.equipment']);
    expect(emptyNonPlate(FM())).toEqual([]);
    expect(emptyNonPlate({ ...FM(), lib_wall_sit: { ...FM().lib_wall_sit, 'b10 / redFlags knee (NHS knee box)': [] } }))
      .toEqual(['lib_wall_sit: b10 / redFlags knee (NHS knee box): [] on a non-plate field (D-SHIP-W5-PLATEONLY)']);
  });
  it('each plate.view child: card plate.view and spec view === the parent\'s (parents dumbbell_biceps_curl, reverse_lunge, triceps_pushdown); a changed child view is red', async () => {
    const kids = Object.entries(FM()).filter(([, m]) => 'plate.view' in m).map(([id]) => id.slice(4));
    expect(kids).toHaveLength(9);
    for (const id of kids) {
      const kid = json(`docs/research/howto/cards/${id}.json`), par = json(`docs/research/howto/cards/${kid.parent}.json`);
      expect([id, kid.parent]).toEqual([id, { curl: 'dumbbell_biceps_curl', lunge: 'reverse_lunge', pushdown: 'triceps_pushdown' }[/curl/.test(id) ? 'curl' : /pushdown/.test(id) ? 'pushdown' : 'lunge']]);
      const [ks, ps] = await Promise.all([spec(id), spec(kid.parent)]);
      expect([id, viewProblems(id, kid, par, ks, ps)]).toEqual([id, []]);
      expect(viewProblems(id, kid, par, { ...ks, view: 'front' }, ps)).toEqual([`${id}: spec view front !== parent ${ps.view}`]);
      expect(viewProblems(id, { ...kid, plate: { ...kid.plate, view: 'front' } }, par, ks, ps)).toEqual([`${id}: card plate.view front !== parent ${par.plate.view}`]);
    }
  });
});

describe('LIB-SHIP W5 D-SHIP-W5-THUMB and D-SHIP-W5-SAWRIST: pushdown children against triceps_pushdown', () => {
  let FAM: any, L: any, par: any;
  const KIDS = ['lib_single_arm_triceps_pushdown', 'lib_straight_bar_triceps_pushdown'];
  beforeAll(async () => {
    [FAM, L] = await Promise.all(['tools/plates/library/lint/family.mjs', 'tools/plates/library/lint/index.mjs'].map(p => import(/* @vite-ignore */ url(p))));
    par = (await content.loadContent('lib_triceps_pushdown')).content;
  });
  const run = (c: any) => FAM.familyRefusal(c.id, c, json, (id: string) => (id === par.id ? par : undefined));
  const poseOnNoZoom = (c: any) => (!c.zooms.some((z: any) => z.kind === 'hand') && c.handling.pose !== undefined ? [`${c.id}: handling.pose on a no-zoom sheet (D-SHIP-W5-THUMB)`] : []);
  it('both children pass the family check; neither they nor the parent carry handling.pose; a changed thumb mode is red', async () => {
    expect(poseOnNoZoom(par)).toEqual([]);
    expect(par.handling.pose).toBeUndefined();
    for (const id of KIDS) {
      const { content: c } = await content.loadContent(id);
      expect([id, run(c), poseOnNoZoom(c)]).toEqual([id, null, []]);
      expect(run({ ...c, handling: { ...c.handling, thumb: { ...c.handling.thumb, mode: 'thumbless' } } }))
        .toBe(`${id}: family: grip.thumb: handling.thumb.mode "thumbless" !== parent lib_triceps_pushdown's "wrapped" (D-LIB5-FAMILY)`);
      expect(poseOnNoZoom({ ...c, handling: { ...c.handling, pose: { thumb: 'wrapped' } } })).toEqual([`${id}: handling.pose on a no-zoom sheet (D-SHIP-W5-THUMB)`]);
    }
  });
  it('single_arm: wrist.ext compared, its own limitText (c9), never the parent\'s plural line', async () => {
    const { content: c } = await content.loadContent('lib_single_arm_triceps_pushdown'), PLURAL = 'Keep the wrists in line with the forearms.';
    expect(par.handling.wrist.limitText).toBe(PLURAL);
    const plural = (x: any) => L.shownCopyFields(x).filter((f: any) => f.text.includes(PLURAL)).map((f: any) => f.path);
    expect([c.handling.wrist.limitText, plural(c)]).toEqual(['Keep the wrist in line with the forearm.', []]);
    expect(plural({ ...c, handling: { ...c.handling, wrist: { ...c.handling.wrist, limitText: PLURAL } } }).length).toBeGreaterThan(0);
    expect(run({ ...c, handling: { ...c.handling, wrist: { ...c.handling.wrist, ext: [0, 20] } } }))
      .toBe('lib_single_arm_triceps_pushdown: family: grip.wrist: handling.wrist.ext[1] 20 !== parent lib_triceps_pushdown\'s 15 (D-LIB5-FAMILY)');
  });
});

describe('LIB-SHIP W5 D-SHIP-W5-GOLDENFEET and D-SHIP-W5-WALLSIT: squat children', () => {
  let FAM: any, L: any, fs: any, bb: any, ws: any, bw: any;
  beforeAll(async () => {
    [FAM, L] = await Promise.all(['tools/plates/library/lint/family.mjs', 'tools/plates/library/lint/index.mjs'].map(p => import(/* @vite-ignore */ url(p))));
    [fs, bb, ws, bw] = await Promise.all(['lib_front_squat', 'lib_barbell_back_squat', 'lib_wall_sit', 'lib_bodyweight_squat'].map(async id => (await content.loadContent(id)).content));
  });
  const run = (c: any, card: any, parent: any) => FAM.familyRefusal(c.id, c, () => card, (id: string) => (id === parent.id ? parent : undefined));
  const feet = (c: any) => c.posture.find((p: any) => p.key === 'feet');
  const shows = (c: any, s: string) => L.shownCopyFields(c).some((f: any) => f.text.includes(s));
  it('front_squat: still refused for the unmapped setup[2]; the feet label is golden\'s, the golden detail is not on the child', () => {
    const card = json('docs/research/howto/cards/front_squat.json');
    expect(run(fs, card, bb)).toBe('lib_front_squat: family: docs/research/howto/cards/front_squat.json#inherit: inherited-string map not ruled (D-LIB5-FAMILY)');
    expect([feet(fs).label, feet(bb).label]).toEqual(['Knees follow toes', 'Knees follow toes']);
    expect([shows(fs, feet(bb).detail), feet(fs).detail]).toEqual([false, 'Whole-foot balance, knees in line with the feet.']);
    const mapped = { ...card, inherit: card.inherit.filter((e: any) => !e.field.startsWith('setup[2]')) };
    expect(run(fs, mapped, bb)).toBeNull();
    const withFeet = (p: any) => ({ ...fs, posture: fs.posture.map((x: any) => (x.key === 'feet' ? { ...x, ...p } : x)) });
    expect(run(withFeet({ label: 'Feet flat' }), mapped, bb))
      .toBe('lib_front_squat: family: posture[3] (feet flat, knees follow the toes): posture[key=feet].label "Feet flat" !== parent lib_barbell_back_squat\'s "Knees follow toes" (D-LIB5-FAMILY)');
    expect(shows(withFeet({ detail: feet(bb).detail }), feet(bb).detail)).toBe(true);
  });
  const ownW4 = (c: any) => (c.posture.some((p: any) => p.key !== 'knees' && /\bw4\b/.test(p.claim?.note ?? '') && /Knees directly above the ankles/.test(p.detail)) ? [] : [`${c.id}: no own w4 checkpoint (D-SHIP-W5-WALLSIT)`]);
  const overToes = (c: any) => (c.posture.find((p: any) => p.key === 'knees').label === 'Knees over toes' ? [`${c.id}: knees label is "Knees over toes" (D-SHIP-W5-WALLSIT)`] : []);
  it('wall_sit: the parent\'s knees checkpoint exactly plus its own w4; bodyweight_squat\'s knees label is never "Knees over toes"', () => {
    const card = json('docs/research/howto/cards/wall_sit.json'), knees = (c: any) => c.posture.find((p: any) => p.key === 'knees');
    expect([run(ws, card, bw), ownW4(ws), overToes(bw)]).toEqual([null, [], []]);
    expect([knees(ws).label, knees(ws).detail]).toEqual([knees(bw).label, knees(bw).detail]);
    expect(ownW4({ ...ws, posture: ws.posture.filter((p: any) => p.key !== 'ankles') })).toEqual(['lib_wall_sit: no own w4 checkpoint (D-SHIP-W5-WALLSIT)']);
    const relabel = (c: any, label: string) => ({ ...c, posture: c.posture.map((p: any) => (p.key === 'knees' ? { ...p, label } : p)) });
    expect(run(relabel(ws, 'Knees out'), card, bw))
      .toBe('lib_wall_sit: family: posture[1] (knees over the second toe, ankles not rolling): posture[key=knees].label "Knees out" !== parent lib_bodyweight_squat\'s "Knees follow toes" (D-LIB5-FAMILY)');
    expect(overToes(relabel(bw, 'Knees over toes'))).toEqual(['lib_bodyweight_squat: knees label is "Knees over toes" (D-SHIP-W5-WALLSIT)']);
  });
});

describe('LIB-SHIP W5 D-SHIP-W5-GRIPC: pushdown contacts from ga:push-heel, curl contacts from ga:curl-mid', () => {
  const card = (id: string) => json(`docs/research/howto/cards/${id.slice(4)}.json`);
  const src = (id: string) => readFileSync(join(ROOT, `tools/plates/library/howto/${id}.howto.mjs`), 'utf8');
  for (const id of ['lib_single_arm_triceps_pushdown', 'lib_straight_bar_triceps_pushdown', 'lib_dumbbell_overhead_triceps_extension']) {
    it(`${id}: the sheet takes PUSH_HEEL from the convention; red 1: the convention changes (zone or range)`, async () => {
      const { content: c } = await content.loadContent(id), conv = P.CONVENTIONS['ga:push-heel'] as string;
      expect(src(id)).toContain(`const PUSH_HEEL = ${JSON.stringify(conv).replace(/"/g, "'")};`);
      expect(checkConventionGrip(c, null, conv)).toEqual([]);
      expect(checkConventionGrip(c, null, conv.replace('heel of the palm', 'middle of the palm'))).toEqual([`GRIPC: ${id}: contact heel is not the convention's zone`]);
      expect(checkConventionGrip(c, null, conv.replace(/extension \d+ to \d+/, 'extension 0 to 20'))).toEqual([`GRIPC: ${id}: wrist ext [0,15] is not the convention's range`]);
    });
  }
  for (const id of ['lib_single_arm_triceps_pushdown', 'lib_straight_bar_triceps_pushdown']) {
    it(`${id}: the card has no handContact; red 2: the card gains one that disagrees`, async () => {
      const { content: c } = await content.loadContent(id), k = card(id), conv = P.CONVENTIONS['ga:push-heel'];
      expect([k.grip.handContact, checkConventionGrip(c, k, conv)]).toEqual(['', []]);
      expect(checkConventionGrip(c, { grip: { ...k.grip, handContact: 'Bar across the middle of the palm.' } }, conv)).toEqual([`GRIPC: ${id}: card grip.handContact disagrees with the convention`]);
      expect(checkConventionGrip(c, { grip: { ...k.grip, handContact: 'Bar on the heel of the palm.' } }, conv)).toEqual([]);   // control
    });
  }
  // ga:curl-mid's range is signed (-10 to +10), so the curl form reads it with a signed pattern, as the sheets do
  const ZONE: Record<string, string> = { heel: 'heel of the palm', 'mid-palm': 'middle of the palm', 'finger-base': 'base of the fingers' };
  const curlGripc = (c: any, conv: string, exempt: boolean) => {
    const h = c.handling, out: string[] = [], ext = conv.match(/extension (-?\d+) to \+?(-?\d+)/)?.slice(1).map(Number);
    const zone = ZONE[h.contact];
    if (!zone || !conv.includes(zone)) out.push(`GRIPC: ${c.id}: contact ${h.contact} is not the convention's zone`);
    if (exempt) { if (h.wrist.exempt === undefined || h.wrist.ext !== undefined) out.push(`GRIPC: ${c.id}: an exempt wrist carries the convention's range`); }
    else if (JSON.stringify(h.wrist.ext) !== JSON.stringify(ext)) out.push(`GRIPC: ${c.id}: wrist ext ${JSON.stringify(h.wrist.ext)} is not the convention's range`);
    return out;
  };
  for (const [id, exempt] of [['lib_concentration_curl', false], ['lib_wrist_curl', true]] as const) {
    it(`${id}: contact from CURL_MID (${exempt ? 'contact only, the wrist exempt' : 'contact and range'}); reds: the zone changes${exempt ? ', the range on the exempt wrist' : ', the range changes'}`, async () => {
      const { content: c } = await content.loadContent(id), conv = P.CONVENTIONS['ga:curl-mid'] as string;
      expect(src(id)).toContain(`const CURL_MID = ${JSON.stringify(conv).replace(/"/g, "'")};`);
      expect([card(id).grip.handContact, curlGripc(c, conv, exempt)]).toEqual(['', []]);
      expect(curlGripc(c, conv.replace('middle of the palm', 'heel of the palm'), exempt)).toEqual([`GRIPC: ${id}: contact mid-palm is not the convention's zone`]);
      if (exempt) expect(curlGripc({ ...c, handling: { ...c.handling, wrist: { ...c.handling.wrist, ext: [-10, 10] } } }, conv, true)).toEqual([`GRIPC: ${id}: an exempt wrist carries the convention's range`]);
      else expect(curlGripc(c, conv.replace(/extension -?\d+ to \+?-?\d+/, 'extension 0 to 15'), false)).toEqual([`GRIPC: ${id}: wrist ext [-10,10] is not the convention's range`]);
    });
  }
  it('wrist_curl: thumb wrapped is CONVENTION data, and no printed string names a thumb (red: one that does)', async () => {
    const L: any = await import(/* @vite-ignore */ url('tools/plates/library/lint/index.mjs')), { content: c } = await content.loadContent('lib_wrist_curl');
    const thumbs = (x: any) => L.shownCopyFields(x).filter((f: any) => /\bthumbs?\b/i.test(f.text)).map((f: any) => f.path);
    expect([c.handling.thumb.mode, c.handling.thumb.claim.tags, thumbs(c)]).toEqual(['wrapped', ['CONVENTION'], []]);
    expect(thumbs({ ...c, handling: { ...c.handling, gripLine: `${c.handling.gripLine} Thumbs wrapped round the bar.` } })).toEqual(['handling.gripLine']);
  });
  it('concentration_curl: thumb cites shared/curl.json thumbRule, whose appliesTo names it (red: the id removed from appliesTo)', async () => {
    const { content: c } = await content.loadContent('lib_concentration_curl'), curl = json('docs/research/howto/shared/curl.json');
    const sourced = (x: any, s: any) => [
      ...(s.appliesTo.includes(x.id.slice(4)) ? [] : [`${x.id}: not in shared/curl.json appliesTo`]),
      ...(x.handling.thumb.claim.note.includes('shared/curl.json thumbRule') && s.thumbRule.claim.every((k: string) => new RegExp(`\\b${k}\\b`).test(x.handling.thumb.claim.note)) ? [] : [`${x.id}: thumb does not cite shared/curl.json thumbRule`]),
      ...(x.handling.thumb.mode === 'wrapped' && /thumbs wrapped/.test(s.thumbRule.text) ? [] : [`${x.id}: thumb mode is not the thumbRule's`])];
    expect(sourced(c, curl)).toEqual([]);
    expect(sourced(c, { ...curl, appliesTo: curl.appliesTo.filter((s: string) => s !== 'concentration_curl') })).toEqual(['lib_concentration_curl: not in shared/curl.json appliesTo']);
  });
});

describe('LIB-SHIP W5 D-SHIP-W5-HAMMERWRONG: the hand-zoom Wrong caption never says twist; the twist claim keeps its slot', () => {
  const problems = (c: any) => {
    const z = c.zooms.find((x: any) => x.kind === 'hand'), out: string[] = [];
    if (/twist/i.test(`${z.caption.right} ${z.caption.wrong}`)) out.push(`${c.id}: hand zoom caption says twist`);
    const slot = c.id === 'lib_hammer_curl'
      ? c.mistakes.some((m: any) => /twist/i.test(m.title) && /\bc5\b/.test(m.claim?.note ?? ''))
      : /twist/i.test(c.handling.wrist.limitText) && /\bc7\b/.test(c.handling.wrist.claim.note);
    if (!slot) out.push(`${c.id}: the twist claim is missing from its slot`);
    return out;
  };
  for (const id of ['lib_hammer_curl', 'lib_cross_body_hammer_curl']) it(`${id}: green; reds: twist in the caption, the twist claim removed`, async () => {
    const { content: c } = await content.loadContent(id);
    expect(problems(c)).toEqual([]);
    const cap = { ...c, zooms: c.zooms.map((z: any) => (z.kind === 'hand' ? { ...z, caption: { ...z.caption, wrong: 'Wrist twisting out of neutral.' } } : z)) };
    expect(problems(cap)).toEqual([`${id}: hand zoom caption says twist`]);
    const gone = id === 'lib_hammer_curl' ? { ...c, mistakes: c.mistakes.filter((m: any) => m.key !== 'twist') }
      : { ...c, handling: { ...c.handling, wrist: { ...c.handling.wrist, limitText: 'Keep the wrist straight.' } } };
    expect(problems(gone)).toEqual([`${id}: the twist claim is missing from its slot`]);
  });
});

describe('LIB-SHIP W5 D-SHIP-HANDW5: straight_bar\'s no-zoom entry and why', () => {
  const ok = (e: any, why: string) => [...(e?.ruling === 'D-SHIP-HANDW5' && e.reason === 'gap-ruled' ? [] : ['entry is not gap-ruled D-SHIP-HANDW5']),
    ...(why.startsWith('D-SHIP-C3 no-zoom list') && why.includes('D-SHIP-HANDW5') ? [] : ['why does not begin with the D-SHIP-C3 route then name D-SHIP-HANDW5'])];
  it('green on the tree; reds: the entry\'s ruling changed, the why reordered', async () => {
    const e = json('tools/plates/library/hands/no-zoom.json').entries.lib_straight_bar_triceps_pushdown, { content: c } = await content.loadContent('lib_straight_bar_triceps_pushdown');
    expect(ok(e, c.handling.why)).toEqual([]);
    expect(ok({ ...e, ruling: 'D-SHIP-HANDW2' }, c.handling.why)).toEqual(['entry is not gap-ruled D-SHIP-HANDW5']);
    expect(ok(e, c.handling.why.replace('D-SHIP-C3 no-zoom list, ', '') + ' D-SHIP-C3 no-zoom list')).toEqual(['why does not begin with the D-SHIP-C3 route then name D-SHIP-HANDW5']);
  });
});
