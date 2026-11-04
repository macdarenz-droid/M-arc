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
const RULED_SHIPPED = ['lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_dumbbell_shoulder_press', 'lib_upright_row', 'lib_pec_fly',
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
