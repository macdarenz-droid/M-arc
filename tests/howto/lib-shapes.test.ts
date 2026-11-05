// LIB-SHAPES (#377, PLAN RULED): the two library sheet shapes, `none` (NoHandling) and a handled sheet with no hand
// close-up (D-SHIP-C3), on the layers page (tools/plates/library/build-layers-page.mjs patches) and in the app's How-to
// sections (Hand.tsx, LookCloser.tsx). Fixtures: tests/howto/fixtures/lib-shapes/fixture.mjs (F-NONE, F-NOZOOM).
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { alsoRowHtml, chipKeys, chipRowHtml, noHandZoom, type ChipContent, type Registered } from '@/slices/howto/sections/LookCloser';
import { gripHtml, handContentOf } from '@/slices/howto/sections/Hand';
import legPress from '@/howto/generated/ht-leg-press';
import chestPress from '@/howto/generated/ht-machine-chest-press';
import type { BuiltHowTo } from '@/howto/types';

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const ALL: Registered = { kind: () => true, feel: true };
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
let F: any, blp: any, layers: any, hands: any, feel: any, zooms: any;
const tmps: string[] = [];
let page = '';

/** The fixture page: F-NONE (leg_press) and F-NOZOOM (machine_chest_press) on one layers page, built like a batch. */
function specOf(dir: string, opts: { noZoom?: string[]; shapes?: Record<string, string>; extra?: Record<string, object>; plain?: string[] } = {}) {
  const files = F.writeShapeFiles(dir, opts.shapes, opts.extra);
  const ids = [...Object.keys(opts.shapes ?? { [F.NONE_ID]: 1, [F.NOZOOM_ID]: 1 }), ...(opts.plain ?? [])];
  return {
    groups: [{ id: 'machines', title: 'Machines', ids }], jump: null, files,
    closeups: Object.fromEntries(ids.map(id => [id, blp.GOLDEN_B_CLOSEUPS[id]])), optionsUrl: blp.GOLDEN_B_OPTIONS_URL,
    noZoom: opts.noZoom ?? F.NOZOOM_LIST,
  };
}
const build = async (opts: Parameters<typeof specOf>[1] = {}) => {
  const dir = mkdtempSync(join(tmpdir(), 'lib-shapes-')); tmps.push(dir);
  return (await blp.buildLayersPage(specOf(dir, opts))).toString('utf8') as string;
};
/** The card's element that starts with `open`, by balanced div tags (gen/hands.mjs divAt). */
const divOf = (html: string, open: string) => {
  const a = html.indexOf(open);
  if (a < 0 || html.indexOf(open, a + 1) >= 0) throw new Error(`not exactly one ${open}`);
  return hands.divAt(html, a) as string;
};
const ids = (html: string, pre: string) => [...html.matchAll(new RegExp(`id="${pre}-chip-([a-z-]+)"`, 'g'))].map(m => m[1]);

beforeAll(async () => {
  F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib-shapes/fixture.mjs'));
  blp = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
  layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
  hands = await import(/* @vite-ignore */ url('tools/plates/gen/hands.mjs'));
  feel = await import(/* @vite-ignore */ url('tools/plates/gen/feel.mjs'));
  zooms = await import(/* @vite-ignore */ url('tools/plates/gen/zooms.mjs'));
  page = await build();
}, 120_000);
afterAll(() => { for (const d of tmps) rmSync(d, { recursive: true, force: true }); });

const fNone = (): ChipContent => F.shapeOf(legPress, 'none');
const fNoZoom = (): ChipContent => F.shapeOf(chestPress, 'nozoom');

describe('LIB-SHAPES A1: the 8 unchanged', () => {
  it('golden B\'s page rebuilds byte for byte with the LIB-SHAPES patches applied (PAGE_SHA256)', async () => {
    expect(layers.sha256(await blp.buildLayersPage(blp.GOLDEN_B_SPEC))).toBe(layers.PAGE_SHA256);
  }, 120_000);

  // D-SHAPES-HDR (#377 6615207958): hands.mjs (D-SHAPES-HANDS) is a hashed writer of 27 of the 8's files, so only their
  // `inputsSha256=` header line moves; their bodies, and every other file of the 8, stay byte-equal to main b9369130.
  const ROWS = Object.values(JSON.parse(readFileSync('tools/plates/plates.json', 'utf8')) as Record<string, { chromeId: string }>).map(r => r.chromeId);
  const listSha = (list: string[], body: boolean) => {
    const h = createHash('sha256');
    for (const p of list) { const t = readFileSync(p, 'utf8'); h.update(`${p}\0${sha(body ? t.slice(t.indexOf('\n') + 1) : t)}\n`); }
    return h.digest('hex');
  };
  const W2_IDS = ['barbell_row', 'dumbbell_bench_press', 'dumbbell_shoulder_press', 'upright_row', 'rope_triceps_pushdown', 'plank', 'cable_fly', 'push_up'];
  const W2_LINE = new RegExp(`^  (?:"lib_(?:${W2_IDS.join('|')})",|lib_(?:${W2_IDS.join('|')}): \\(\\) => |"(?:${W2_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  /** loaders.ts's body (all but line 1) without the W2 lines: how many were taken out, and the rest's sha. */
  const w2Less = (t: string) => { const lines = t.slice(t.indexOf('\n') + 1).split('\n'), kept = lines.filter(l => !W2_LINE.test(l)); return { removed: lines.length - kept.length, sha: sha(kept.join('\n')) }; };
  it('the 27 header-moved files: each body (all but line 1) equals main c4c34d75 (re-measured after train 63)', () => {
    const list = [...ROWS.map(i => `src/howto/generated/hand-${i}.ts`), ...ROWS.map(i => `src/howto/generated/posture-${i}.ts`),
      ...ROWS.map(i => `src/slices/howto/css/zoom-${i}.css`), 'src/slices/howto/css/hand.css', 'src/slices/howto/css/posture.css',
      'src/howto/generated/loaders.ts'].sort();
    expect(list).toHaveLength(27);
    for (const p of list) expect(readFileSync(p, 'utf8'), p).toMatch(/^(\/\/|\/\*) GENERATED, do not edit\. [^\n]*inputsSha256=[0-9a-f]{64}( \*\/)?\n/);
    // LIB-SHIP W2 (ruling 3): the 27 together were c6e70592 on main cb9a6dae. loaders.ts's body now adds the 8 W2 ids (pec_fly held), so
    // the 26 others keep their main bodies exactly (67195ffa, measured on main cb9a6dae), and loaders.ts's body with exactly
    // the W2 lines taken out (4 per id: HOWTO_IDS, LOADERS, POSTURE, FEEL; no HAND line, D-SHIP-PAIR-NOZOOM) is main's
    // body (00a18e3c). An extra line, a missing W2 line or any other change is red.
    expect(listSha(list.filter(p => !p.endsWith('/loaders.ts')), true)).toBe('67195ffa45b45581bad58a99f88fed597e9b5b05af37577276b58360f6df2191');
    expect(w2Less(readFileSync('src/howto/generated/loaders.ts', 'utf8'))).toEqual({ removed: 32, sha: '00a18e3c3dd9f50f3b0ef5e145f3668de51fefd860c950062c5422d7fa6a8d3b' });
  });
  it('LIB-SHIP W2 mutations: a HAND line for a W2 id, a W2 line dropped, and another line changed in loaders.ts are red', () => {
    const t = readFileSync('src/howto/generated/loaders.ts', 'utf8'), ok = w2Less(t);
    expect(w2Less(t.replace('export const HAND', 'export const HAND_X')).sha).not.toBe(ok.sha);
    expect(w2Less(t.replace('  "plank": () => import(\'./posture-plank\'),\n', '')).removed).toBe(31);
    expect(w2Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"plank\": () => import('./hand-plank'),\n")).removed).toBe(33);
  });

  // F-PLATE-ZOOMCSS (D-ZOOMCSS-PINS, #387 6637398953): gen/plates.mjs is the 8 ht- files' hashed writer, so only their
  // header and `hashes:` line (inputsSha256) move; their bodies (bodies.mjs bodySha) stay as main. LIB-SHIP W2 (ruling 3;
  // D-FEEL-NOMEANS; merge of main 8bb433bd, both sides kept): gen/feel.mjs is the 8 feel files' hashed writer, so only their
  // header line moves: they keep their main bodies exactly (dd5410f0, main cb9a6dae), and GOLDEN.json and the golden-B page
  // stay byte-equal (7c7700d5, the same on main 8bb433bd).
  it('GOLDEN.json and the golden-B page are byte-equal, and the 8\'s ht- and feel- bodies equal, main b9369130', async () => {
    const two = ['tests/howto/golden/GOLDEN.json', 'tests/howto/golden/howto-layers.html'].sort();
    const feel = ROWS.map(i => `src/howto/generated/feel-${i}.ts`).sort();
    const ht = ROWS.map(i => `src/howto/generated/ht-${i === 'lateral-raise' ? 'dumbbell-lateral-raise' : i}.ts`).sort();
    expect(feel).toHaveLength(8);
    expect(ht).toHaveLength(8);
    expect(listSha(two, false)).toBe('7c7700d50566bd931cd700763825c2735b21b86e614e4acd85f396433b278644');
    expect(listSha(feel, true)).toBe('dd5410f05fe597226a210692d5f4c9092e06fc51898e98b7fa343de868cda435');
    for (const p of feel) expect(readFileSync(p, 'utf8'), p).toMatch(/^\/\/ GENERATED, do not edit\. Written by tools\/plates\/generate\.mjs \(tools\/plates\/gen\/feel\.mjs\)\. inputsSha256=[0-9a-f]{64}\n/);
    const { bodySha } = await import(/* @vite-ignore */ new URL('../../tools/plates/library/bodies.mjs', import.meta.url).href);
    const h = createHash('sha256');
    for (const p of ht) h.update(`${p}\0${bodySha(readFileSync(p, 'utf8'))}\n`);
    expect(h.digest('hex')).toBe('6aec194783462dd939055d18714f957c9de30a9f38c91dfd2956dff6a6424078');
  });

  it('every patch anchor matches once, and a spec with no noZoom and no `none` row needs none of the new branches', () => {
    const hl = readFileSync('tools/plates/layers/artifact/howto-layers.mjs', 'utf8');
    const src = blp.patchHowtoLayers(hl, blp.planOf(blp.GOLDEN_B_SPEC));
    expect(src).toContain('const __NOZOOM = [];');
    expect(src).toContain("if (handFirst && keys[0] !== 'hand' && !__noZoom(howto)) throw");
  });
});

describe('LIB-SHAPES fixtures', () => {
  it('the fixture edit is the shape and nothing else of the sheet', () => {
    const n: any = fNone(), z: any = fNoZoom();
    expect(n.handling).toEqual({ archetype: 'none', why: F.NONE_WHY });
    expect(n.mistakes).toEqual([]);
    expect(z.handling).toEqual({ ...(chestPress as any).handling, why: F.NOZOOM_WHY });
    for (const [c, base] of [[n, legPress], [z, chestPress]] as const) {
      expect(c.zooms.some((q: any) => q.kind === 'hand')).toBe(false);
      expect(c.zooms).toEqual((base as any).zooms.filter((q: any) => q.kind !== 'hand'));
      expect(JSON.stringify(c)).not.toMatch(/"zoom":"hand"/);
      expect(c.setup.length).toBe((base as any).setup.length);
    }
    expect(z.mistakes.map((m: any) => m.key)).toEqual((chestPress as any).mistakes.map((m: any) => m.key));
  });
});

describe('LIB-SHAPES A2: the `none` sheet', () => {
  it('layers page: posture and Feel chips, posture close-ups and the feel section; no hand close-up, Grip or wrist row', () => {
    expect(ids(page, 'leg-press')).toEqual(['back-on-pad', 'foot', 'feel']);
    expect(zooms.posturePanels(page, 'leg-press').map((p: any) => p.key)).toEqual(['back-on-pad', 'foot']);
    expect(feel.feelSectionOf(page, 'leg-press')).toMatch(/^<section class="hw-sec feel" id="leg-press-feel"/);
    expect(() => hands.handPanel(page, 'leg-press')).toThrow(/no hand close-up/);
    expect(page).not.toContain('id="leg-press-grip"');
    expect(page).not.toContain('id="leg-press-also"');
  });

  it('app: Look closer keeps the posture and Feel chips (handContentOf), with no Hand chip, Grip or wrist row', () => {
    const c = handContentOf(fNone() as unknown as BuiltHowTo);
    expect(c).not.toBeNull();
    const keys = chipKeys(c!, ALL);
    expect(keys).toEqual(['back-on-pad', 'foot', 'feel']);
    // the app's chip row is the layers page's, byte for byte
    expect(chipRowHtml('leg-press', c!, keys)).toBe(divOf(page, '<div class="zx-chips-wrap"><span class="eyebrow" id="leg-press-look"'));
    expect(alsoRowHtml('leg-press', c!)).toBe('');
    expect(() => gripHtml('leg-press', c!)).toThrow(/no grip line/);   // the guard stays: HandSections never calls it
    expect(noHandZoom(c!)).toBe(false);
  });

  it('a `none` row with a grip line, or with handling mistakes, does not build (they would never be shown)', async () => {
    await expect(build({ shapes: { [F.NONE_ID]: 'none' }, noZoom: [], extra: { [F.NONE_ID]: { handling: { gripLine: 'Hold lightly.' } } } }))
      .rejects.toThrow(/lib_leg_press: archetype 'none' with a grip line or handling mistakes/);
    await expect(build({ shapes: { [F.NONE_ID]: 'none' }, noZoom: [], extra: { [F.NONE_ID]: { mistakes: (legPress as any).mistakes.slice(0, 1) } } }))
      .rejects.toThrow(/lib_leg_press: archetype 'none' with a grip line or handling mistakes/);
  }, 120_000);
});

describe('LIB-SHAPES A3: the handled sheet with no hand close-up', () => {
  it('layers page: grip words and the posture and Feel chips; no Hand chip, hand close-up or wrist row', () => {
    expect(ids(page, 'machine-chest-press')).toEqual(['seat-height', 'blades', 'feel']);
    expect(() => hands.handPanel(page, 'machine-chest-press')).toThrow(/no hand close-up/);
    expect(page).not.toContain('id="machine-chest-press-also"');
    const grip = (chestPress as any).handling;
    expect(page).toContain(`<p class="grip-lead">${grip.gripLine}</p>`);
  });

  it('app: the same chips and Grip section as the page; no Hand chip or wrist row', () => {
    const c = handContentOf(fNoZoom() as unknown as BuiltHowTo)!;
    expect(noHandZoom(c)).toBe(true);
    const keys = chipKeys(c, ALL);
    expect(keys).toEqual(['seat-height', 'blades', 'feel']);
    expect(chipRowHtml('machine-chest-press', c, keys)).toBe(divOf(page, '<div class="zx-chips-wrap"><span class="eyebrow" id="machine-chest-press-look"'));
    expect(alsoRowHtml('machine-chest-press', c)).toBe('');
    const a = page.indexOf('<section class="hw-sec grip" id="machine-chest-press-grip"');
    expect(gripHtml('machine-chest-press', c)).toBe(page.slice(a, page.indexOf('</section>', a) + '</section>'.length));
  });

  it('a row off the list (builder) or without `why` (app) throws exactly as today', async () => {
    await expect(build({ shapes: { [F.NOZOOM_ID]: 'nozoom' }, noZoom: [] }))
      .rejects.toThrow(/lib_machine_chest_press: load goes through the hands, Hand must be the first chip/);
    const bare = { ...fNoZoom(), handling: (chestPress as any).handling } as ChipContent;
    expect(noHandZoom(bare)).toBe(false);
    expect(() => chipKeys(bare, ALL)).toThrow('lib_machine_chest_press: load goes through the hands, Hand must be the first chip');
    expect(() => alsoRowHtml('machine-chest-press', bare)).toThrow('lib_machine_chest_press: push exercise without a hand close-up');
    const blank = { ...fNoZoom(), handling: { ...(chestPress as any).handling, why: ' ' } } as ChipContent;
    expect(() => chipKeys(blank, ALL)).toThrow(/Hand must be the first chip/);
  }, 120_000);

  it('the builder refuses a listed id that is off the page, has a hand close-up, is `none` or has no `why`', async () => {
    expect(() => blp.planOf({ ...blp.GOLDEN_B_SPEC, noZoom: ['nope'] })).toThrow('layers page: noZoom: nope is not on the page');
    expect(() => blp.planOf({ ...blp.GOLDEN_B_SPEC, noZoom: ['leg_press', 'leg_press'] })).toThrow(/distinct/);
    await expect(build({ shapes: { [F.NONE_ID]: 'none' }, noZoom: [F.NONE_ID] })).rejects.toThrow(/lib_leg_press: on the no-zoom list, but not a handled sheet/);
    await expect(build({ shapes: {}, plain: ['pull_up'], noZoom: ['pull_up'] })).rejects.toThrow(/lib_pull_up: on the no-zoom list, but it has a hand close-up/);
    await expect(build({ shapes: { [F.NOZOOM_ID]: 'nozoom' }, extra: { [F.NOZOOM_ID]: { handling: { why: '' } } } }))
      .rejects.toThrow(/lib_machine_chest_press: on the no-zoom list, but handling.why is empty/);
  }, 120_000);
});

describe('LIB-SHAPES D-SHAPES-HANDS: gen/hands.mjs, a library row with no hand pair', () => {
  const C3 = (why?: string, zooms: object[] = []) => ({ handling: { archetype: 'push', ...(why === undefined ? {} : { why }) }, zooms });
  const NONE = (why?: string) => ({ handling: { archetype: 'none', ...(why === undefined ? {} : { why }) }, zooms: [] });
  const OLD = 'hands: lib_x: no hand pair (tools/plates/library/hands/pairs.mjs HAND_OF_ID); a library hand ships only as handpair-<key>';
  it('exactly two rulings pass: `none` + D-SHIP-GRIP, and handled with no hand zoom + D-SHIP-C3', () => {
    expect(hands.noPairCheck('lib_x', NONE('D-SHIP-GRIP (b): card has no hand claim'), false, 'p.html', 'x')).toBe('D-SHIP-GRIP');
    expect(hands.noPairCheck('lib_x', C3('D-SHIP-C3: gap-ruled D-SHIP-Q1'), false, 'p.html', 'x')).toBe('D-SHIP-C3');
    expect(hands.noPairCheck('lib_x', fNone(), false, 'p.html', 'x')).toBe('D-SHIP-GRIP');
    expect(hands.noPairCheck('lib_x', fNoZoom(), false, 'p.html', 'x')).toBe('D-SHIP-C3');
  });
  it('a handled row with neither `why` throws exactly as today', () => {
    for (const s of [C3(), C3(''), NONE(), { handling: (chestPress as any).handling, zooms: [] }, {}]) expect(() => hands.noPairCheck('lib_x', s, false, 'p.html', 'x')).toThrow(OLD);
  });
  it('a `why` naming another ruling, or the other shape\'s ruling, throws', () => {
    for (const s of [C3('D-SHIP-Q1'), C3('D-SHIP-GRIP'), NONE('D-SHIP-C3'), C3('D-SHIP-C3X'), NONE('D-SHIP-GRIP-2'), C3('xD-SHIP-C3')]) expect(() => hands.noPairCheck('lib_x', s, false, 'p.html', 'x')).toThrow(OLD);
  });
  it('a handled row that still has a hand zoom throws, and a ruled row whose page holds a hand close-up throws', () => {
    expect(() => hands.noPairCheck('lib_x', C3('D-SHIP-C3', [{ kind: 'hand', key: 'hand' }]), false, 'p.html', 'x')).toThrow(OLD);
    expect(() => hands.noPairCheck('lib_x', NONE('D-SHIP-GRIP'), true, 'p.html', 'x')).toThrow('hands: lib_x: no hand pair under D-SHIP-GRIP, but p.html holds a hand close-up for x');
  });
  it('the library loop calls it in place of the old throw, and only for a row with no pair', () => {
    const src = readFileSync('tools/plates/gen/hands.mjs', 'utf8');
    expect(src.split('else if (!pairOf[id]) noPairCheck(row.id, (await import(pathToFileURL(join(ROOT, sourceOf(row.id))).href)).default, hasHand, file, id);').length).toBe(2);
    expect(src.split('throw new Error(`hands: ${rowId}: no hand pair (').length).toBe(2);
  });
});

describe('LIB-SHAPES D-SHAPES-PIN: the library MANIFEST re-pin moves only build-layers-page.mjs', () => {
  const BLP = 'tools/plates/library/build-layers-page.mjs';
  // LIB-SHIP W2 (#379; [golden update] re-pins): W2 re-pins these keys (its sheets, batches, closeups, layers configs and
  // build-layers-page.mjs), adds these keys to these rows, and adds PILOT-B2's lib_crunch row. Each W2 key pins its
  // file's current sha; with the W2 keys blanked (moved) or removed (added) and the crunch row removed, the manifest
  // equals main cb9a6dae's with the same blanks (6dd225c2): every other entry still equals main.
  const W2_MOVED = ['tools/plates/library/batches/pilot-a.json', 'tools/plates/library/batches/pilot-b.json', 'tools/plates/library/build-layers-page.mjs',
    ...['barbell_overhead_press', 'barbell_row', 'bent_over_dumbbell_rear_delt_fly', 'box_jump', 'cable_fly', 'dumbbell_bench_press', 'dumbbell_fly',
      'dumbbell_shoulder_press', 'mountain_climbers', 'pec_fly', 'plank', 'push_up', 'reverse_lunge', 'romanian_deadlift', 'rope_triceps_pushdown',
      'seated_leg_curl', 'single_leg_romanian_deadlift', 'triceps_pushdown', 'upright_row'].map(id => `tools/plates/library/howto/lib_${id}.howto.mjs`),
    'tools/plates/library/pages/pilot-a.closeups.mjs', 'tools/plates/library/pages/pilot-a.layers.json'];
  const W2_ADDED: Record<string, string[]> = {
    'docs/research/howto/shared/back-pain-box.json': ['lib_bent_over_dumbbell_rear_delt_fly', 'lib_box_jump'],
    'tools/plates/library/shared/back-box.mjs': ['lib_bent_over_dumbbell_rear_delt_fly', 'lib_box_jump'],
    'tools/plates/library/pages/pilot-b.closeups.mjs': ['lib_cable_fly', 'lib_push_up', 'lib_seated_leg_curl', 'lib_smith_machine_bench_press'],
    'tools/plates/library/pages/pilot-b.layers.json': ['lib_cable_fly', 'lib_push_up', 'lib_seated_leg_curl', 'lib_smith_machine_bench_press'],
  };
  /** The manifest less W2's changes (red if a W2 key does not pin its current file, or an added key is missing). */
  // LIB-SHIP W7 (PIN GO #394 6649092340): the 29 W7 rows the pin adds; every other row and key is unchanged, so they are
  // taken out (each must be present) before the W2 comparison below.
  const W7_ROWS = ['lib_hack_squat', 'lib_pendulum_squat', 'lib_leg_extension', 'lib_lying_leg_curl', 'lib_standing_leg_curl', 'lib_glute_bridge', 'lib_cable_kickback', 'lib_resisted_hip_flexion', 'lib_ab_wheel_rollout', 'lib_bird_dog', 'lib_side_plank', 'lib_superman', 'lib_cable_crunch', 'lib_hollow_body_hold', 'lib_reverse_crunch', 'lib_dead_bug', 'lib_v_up', 'lib_kettlebell_swing', 'lib_high_knees', 'lib_jump_rope', 'lib_battle_ropes', 'lib_sled_pull', 'lib_burpee', 'lib_bear_crawl', 'lib_sled_push', 'lib_medicine_ball_slam', 'lib_farmer_s_carry', 'lib_jumping_jacks', 'lib_wall_ball'];
  const lessW7 = (m: any) => { for (const id of W7_ROWS) { expect(Object.keys(m.rows), id).toContain(id); delete m.rows[id]; } return m; };
  const lessW2 = (m: any, blanked: string[] = []) => {   // blanked: keys the caller already checked and blanked
    lessW7(m);
    delete m.rows.lib_crunch;
    for (const [id, r] of Object.entries<any>(m.rows)) {
      for (const k of W2_MOVED) if (k in r.files && !blanked.includes(k)) { expect(r.files[k], `${id} ${k}`).toBe(sha(readFileSync(k))); r.files[k] = 'X'; }
      for (const [k, ids] of Object.entries(W2_ADDED)) if (ids.includes(id)) { expect(r.files[k], `${id} ${k}`).toBe(sha(readFileSync(k))); delete r.files[k]; }
    }
    return m;
  };
  it('every pinned row pins the current build-layers-page.mjs, and every other entry equals main c4c34d75 (re-measured after train 63)', () => {
    const m = JSON.parse(readFileSync('tools/plates/library/MANIFEST.json', 'utf8'));
    const rows = Object.values(m.rows) as { files: Record<string, string> }[];
    expect(rows).toHaveLength(22 + W7_ROWS.length);   // LIB-SHIP W2: + PILOT-B2's lib_crunch; LIB-SHIP W7 (PIN GO #394 6649092340): + the 29 W7 rows, taken out again by lessW7
    expect(Object.keys(m.rows)).toContain('lib_crunch');
    // F-CROP-FRONT D-CROP-PIN / D-CROP-NONE (#380): crop.mjs's and hand.mjs's keys are re-pinned there and pinned exactly by crop-projection.test.ts
    const F_CROP = ['tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeup/hand.mjs'];
    // F-PAIR-FAULTS (#386): pairs.mjs's key is re-pinned there and pinned exactly by pair-faults.test.ts
    const F_PAIR = ['tools/plates/library/hands/pairs.mjs'];
    for (const r of rows) { expect(r.files[BLP]).toBe(sha(readFileSync(BLP))); r.files[BLP] = 'X'; for (const k of [...F_CROP, ...F_PAIR]) r.files[k] = 'X'; }
    // main cb9a6dae's MANIFEST.json with the same entries blanked was b126d854 (#386); LIB-SHIP W2 (merge of main cf28ab23,
    // both sides kept): with W2's changes also taken out, main cf28ab23's with the same blanks
    expect(sha(JSON.stringify(lessW2(m, [BLP])))).toBe('3882bf3eb1690fd260bd5b02351a7bf93684946cdb7a05cd0ca1acb0c19f2a68');
  });
});

