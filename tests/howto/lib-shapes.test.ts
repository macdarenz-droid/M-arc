// LIB-SHAPES (#377, PLAN RULED): the two library sheet shapes, `none` (NoHandling) and a handled sheet with no hand
// close-up (D-SHIP-C3), on the layers page (tools/plates/library/build-layers-page.mjs patches) and in the app's How-to
// sections (Hand.tsx, LookCloser.tsx). Fixtures: tests/howto/fixtures/lib-shapes/fixture.mjs (F-NONE, F-NOZOOM).
import { createHash } from 'node:crypto';
import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { blankPF, pfProblems } from './platefix-pins';
import { alsoRowHtml, chipKeys, chipRowHtml, noHandZoom, type ChipContent, type Registered } from '@/slices/howto/sections/LookCloser';
import { gripHtml, handContentOf } from '@/slices/howto/sections/Hand';
import legPress from '@/howto/generated/ht-leg-press';
import chestPress from '@/howto/generated/ht-machine-chest-press';
import type { BuiltHowTo } from '@/howto/types';
import { W5, lessW5 } from './lib-ship-w5';
import { W4_IDS, lessW4 } from './checks/ship-w4';
import { pf2Problems, restorePF2 } from './platefix2-pins';
import { pf3bProblems, restorePF3b } from './platefix3b-pins';
import { PF4_MAIN, pf4Problems, restorePF4 } from './platefix4-pins';
import { PF5_MAIN, pf5Problems, restorePF5 } from './platefix5-pins';
// LIB-PLATEFIX-2 (#395, D-OWNER-REPIN; [golden update]): its moved keys (zoom/inline.mjs, specs/pec_fly.mjs) and
// lib_pec_fly's entry each pin their current value (pf2Problems), then are put back to main 7e060e83's (restorePF2), so
// every pin below, measured on main, still holds
const pf2Main = (x: any) => { expect(pf2Problems(x)).toEqual([]); expect(pf3bProblems(x)).toEqual([]); expect(pf4Problems(x)).toEqual([]); expect(pf5Problems(x)).toEqual([]); return restorePF5(restorePF4(restorePF3b(restorePF2(x)))); };   // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was PF2's keys only, now + 3b's assisted_pull_up.mjs and smith_machine_bench_press.mjs keys and lib_assisted_pull_up's and lib_smith_machine_bench_press's entries (platefix3b-pins), each pinning its current value, then put back to main 6227bd8e's; LIB-PLATEFIX-4 (#410, D-PLATEFIX-PINS form): + PF4's moved keys (platefix4-pins), each pinning its current value, then put back to main de91dd21's; LIB-PLATEFIX-5 (#419, D-PLATEFIX-PINS form): + PF5's moved keys (platefix5-pins), each pinning its current value, then put back to main a4796243's

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
  // LIB-SHIP W4 (ruling 3; D-SHIP-W4-FLIPSET): loaders.ts also adds the W4 ids (checks/ship-w4.ts W4_IDS), 4 lines each
  const W2_IDS = ['barbell_row', 'dumbbell_bench_press', 'dumbbell_shoulder_press', 'upright_row', 'rope_triceps_pushdown', 'plank', 'cable_fly', 'push_up',
    ...W4_IDS.map(id => id.slice(4))];
  // LIB-PLATEFIX-1 (#385, D-PLATEFIX-PINS / PIN GO): its 4 shipped ids add their lines the same way (4 each, no HAND line)
  const PF_IDS = ['romanian_deadlift', 'single_leg_romanian_deadlift', 'triceps_pushdown', 'reverse_lunge'], LINE_IDS = [...W2_IDS, ...PF_IDS];
  const W2_LINE = new RegExp(`^  (?:"lib_(?:${LINE_IDS.join('|')})",|lib_(?:${LINE_IDS.join('|')}): \\(\\) => |"(?:${LINE_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  /** loaders.ts's body (all but line 1) without the W2 lines: how many were taken out, and the rest's sha. */
  // LIB-SHIP W3 (D-SHIP-A9 guard replacement): W3's 9 ids add 4 lines each (HOWTO_IDS, LOADERS, POSTURE, FEEL) and the 5 pair
  // ids a HAND line each (handpair-<key>), 41 lines; with exactly those taken out, the W2 check below holds unchanged
  const W3_IDS = ['chin_up', 'hanging_knee_raise', 'inverted_row', 'close_grip_pulldown', 'single_arm_lat_pulldown', 'straight_arm_pulldown', 'chest_supported_row', 'resistance_band_row', 'horizontal_leg_press'];
  const W3_LINE = new RegExp(`^  (?:"lib_(?:${W3_IDS.join('|')})",|lib_(?:${W3_IDS.join('|')}): \\(\\) => |"(?:${W3_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  const w3Less = (t: string) => { const [head, ...lines] = t.split('\n'), kept = lines.filter(l => !W3_LINE.test(l)); return { removed: lines.length - kept.length, text: [head, ...kept].join('\n') }; };
  // LIB-SHIP W5 (ruling 3; D-SHIP-W5-FLIPSET + D-SHIP-W5-PREACHER): W5's 10 ids add 4 lines each the same way, and its 5 pair
  // curls (preacher, alternating dumbbell, barbell, ez bar, reverse) a HAND line each, 45 lines; front_squat, hammer_curl and
  // the 3 bodyweight ids have none. With exactly those taken out, the W3 and W2 checks below hold unchanged
  const W5_IDS = ['front_squat', 'bodyweight_squat', 'bodyweight_lunge', 'bodyweight_split_squat', 'preacher_curl', 'hammer_curl', 'alternating_dumbbell_curl', 'barbell_curl', 'ez_bar_curl', 'reverse_curl'];
  const W5_LINE = new RegExp(`^  (?:"lib_(?:${W5_IDS.join('|')})",|lib_(?:${W5_IDS.join('|')}): \\(\\) => |"(?:${W5_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  const w5Less = (t: string) => { const [head, ...lines] = t.split('\n'), kept = lines.filter(l => !W5_LINE.test(l)); return { removed: lines.length - kept.length, text: [head, ...kept].join('\n') }; };
  // LIB-SHIP W6 (D-SHIP-A9 guard replacement; #393 6689822595 flip set, 6701002884 ships 7): W6's 7 ids add 4 lines each
  // (HOWTO_IDS, LOADERS, POSTURE, FEEL; no HAND line, all 7 on hands/no-zoom.json), 28 lines; with exactly those taken out
  // first, the W3 and W2 checks below hold unchanged
  const W6_IDS = ['machine_crunch', 'machine_lateral_raise', 'cable_lateral_raise', 'dumbbell_front_raise', 'face_pull', 'incline_push_up', 'pike_push_up'];
  const W6_LINE = new RegExp(`^  (?:"lib_(?:${W6_IDS.join('|')})",|lib_(?:${W6_IDS.join('|')}): \\(\\) => |"(?:${W6_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  const w6Less = (t: string) => { const [head, ...lines] = t.split('\n'), kept = lines.filter(l => !W6_LINE.test(l)); return { removed: lines.length - kept.length, text: [head, ...kept].join('\n') }; };
  // LIB-SHIP W7 (ruling 3; D-SHIP-W7-STAMP #394 6711372615, after D-PF10-W7JOIN): W7's 16 ids (D-SHIP-W7-SLEDHOLD: sled_pull held; D-SHIP-W7-HOLD2 (#394 6753333493): glute_bridge and high_knees held) add 4 lines
  // each the same way (HOWTO_IDS, LOADERS, POSTURE, FEEL), 64 lines; no W7 row draws a hand pair, so none has a HAND line. With exactly those
  // taken out first (merge of main dc058207: then W6's), the W5, W3 and W2 checks below hold unchanged
  const W7_IDS = ['leg_extension', 'lying_leg_curl', 'standing_leg_curl', 'cable_kickback', 'resisted_hip_flexion',
    'ab_wheel_rollout', 'bird_dog', 'cable_crunch', 'hollow_body_hold', 'reverse_crunch', 'dead_bug',
    'kettlebell_swing', 'bear_crawl', 'sled_push', 'medicine_ball_slam', 'farmer_s_carry'];
  const W7_LINE = new RegExp(`^  (?:"lib_(?:${W7_IDS.join('|')})",|lib_(?:${W7_IDS.join('|')}): \\(\\) => |"(?:${W7_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  const w7Less = (t: string) => { const [head, ...lines] = t.split('\n'), kept = lines.filter(l => !W7_LINE.test(l)); return { removed: lines.length - kept.length, text: [head, ...kept].join('\n') }; };
  // LIB-SHIP W8a (ruling 3; #413 6761492481; D-W8A-ASSISTEDHOLD, D-W8A-SEATEDHOLD #415): its 3 ids add 12 lines (HOWTO_IDS,
  // LOADERS, POSTURE and FEEL each; no HAND line). With exactly those taken out first, the W7 chain below holds
  const W8A_IDS = ['barbell_overhead_press', 'pec_fly', 'crunch'];
  const W8A_LINE = new RegExp(`^  (?:"lib_(?:${W8A_IDS.join('|')})",|lib_(?:${W8A_IDS.join('|')}): \\(\\) => |"(?:${W8A_IDS.map(i => i.replace(/_/g, '-')).join('|')})": \\(\\) => )`);
  const w8aLess = (t: string) => { const [head, ...lines] = t.split('\n'), kept = lines.filter(l => !W8A_LINE.test(l)); return { removed: lines.length - kept.length, text: [head, ...kept].join('\n') }; };
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
    expect(W4_IDS).toHaveLength(6);
    const w8a = w8aLess(readFileSync('src/howto/generated/loaders.ts', 'utf8'));
    expect(w8a.removed).toBe(12);   // LIB-SHIP W8a: its lines taken out first
    const w7 = w7Less(w8a.text);
    expect(w7.removed).toBe(64);   // LIB-SHIP W7: W7's lines taken out next (16 x 4)
    const w6 = w6Less(w7.text);
    expect(w6.removed).toBe(28);   // LIB-SHIP W6: W6's lines taken out next (merge of main de91dd21; merge of main dc058207)
    const w5 = w5Less(w6.text);
    expect(w5.removed).toBe(45);   // LIB-SHIP W5: W5's lines taken out next
    const w3 = w3Less(w5.text);
    expect(w3.removed).toBe(41);
    // merge of main 62d3dcb6: W3's 41 lines out first, then W2's 32 and W4's 24 (W4's ids ride in W2_IDS); LIB-PLATEFIX-1:
    // with its 4 ids' 16 lines also taken out (merge of main 7e060e83: 32 + 24 + 16 = 72), the body is still main's 00a18e3c
    expect(w2Less(w3.text)).toEqual({ removed: 32 + 24 + 16, sha: '00a18e3c3dd9f50f3b0ef5e145f3668de51fefd860c950062c5422d7fa6a8d3b' });
  });
  it('LIB-SHIP W8a mutations (ruling 3): a W8a line dropped, a HAND line for a W8a id, and another line changed are red', () => {
    const t = readFileSync('src/howto/generated/loaders.ts', 'utf8'), ok = w2Less(w3Less(w5Less(w6Less(w7Less(w8aLess(t).text).text).text).text).text);
    expect(ok.sha).toBe('00a18e3c3dd9f50f3b0ef5e145f3668de51fefd860c950062c5422d7fa6a8d3b');
    expect(t).toContain('  "crunch": () => import(\'./posture-crunch\'),\n');
    expect(w8aLess(t.replace('  "crunch": () => import(\'./posture-crunch\'),\n', '')).removed).toBe(11);
    expect(w8aLess(t.replace('  "crunch": () => import(\'./posture-crunch\'),\n', '  "crunch": () => import(\'./posture-crunch\'),\n  "crunch": () => import(\'./hand-crunch\'),\n')).removed).toBe(13);
    expect(t).not.toMatch(/mountain[-_]climbers|underhand[-_]lat[-_]pulldown|assisted[-_]pull[-_]up|seated[-_]leg[-_]curl/);   // D-W8A-MCFEEL, D-W8A-UNDERHANDHOLD, D-W8A-ASSISTEDHOLD, D-W8A-SEATEDHOLD: held, no line
    expect(w2Less(w3Less(w5Less(w6Less(w7Less(w8aLess(t.replace('export const HAND', 'export const HAND_X')).text).text).text).text).text).sha).not.toBe(ok.sha);
  });
  it('LIB-SHIP W7 mutations (ruling 3): a W7 line dropped, a HAND line for a W7 id, and another line changed are red', () => {
    const t = w8aLess(readFileSync('src/howto/generated/loaders.ts', 'utf8')).text, ok = w2Less(w3Less(w5Less(w6Less(w7Less(t).text).text).text).text);
    expect(t).toContain('  "sled-push": () => import(\'./posture-sled-push\'),\n');
    expect(w7Less(t.replace('  "sled-push": () => import(\'./posture-sled-push\'),\n', '')).removed).toBe(63);
    // D-SHIP-W7-SLEDHOLD: sled_pull is held, so loaders.ts has no line for it
    expect(t).not.toMatch(/sled[-_]pull/);
    expect(t).not.toMatch(/glute[-_]bridge|high[-_]knees/);   // D-SHIP-W7-HOLD2 (#394 6753333493): glute_bridge and high_knees held, no line
    expect(w7Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"farmer-s-carry\": () => import('./hand-farmer-s-carry'),\n")).removed).toBe(65);
    expect(w2Less(w3Less(w5Less(w6Less(w7Less(t.replace('export const HAND', 'export const HAND_X')).text).text).text).text).sha).not.toBe(ok.sha);
  });
  it('LIB-SHIP W5 mutations (ruling 3): a W5 line dropped, a HAND line for a no-pair W5 id, and another line changed are red', () => {
    const t = readFileSync('src/howto/generated/loaders.ts', 'utf8'), ok = w2Less(w3Less(w5Less(t).text).text);
    expect(t).toContain('  "preacher-curl": () => import(\'./posture-preacher-curl\'),\n');
    expect(w5Less(t.replace('  "preacher-curl": () => import(\'./posture-preacher-curl\'),\n', '')).removed).toBe(44);
    expect(w5Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"hammer-curl\": () => import('./hand-hammer-curl'),\n")).removed).toBe(46);
    expect(w2Less(w3Less(w5Less(t.replace('export const HAND', 'export const HAND_X')).text).text).sha).not.toBe(ok.sha);
  });
  it('LIB-SHIP W6 mutations: a W6 line dropped, a HAND line for a no-pair W6 id, and another line changed are red', () => {
    // merge of main de91dd21: W5's lines are taken out too (w5Less after w6Less), as in the body test above; merge of main
    // dc058207 (LIB-SHIP W7): W7's lines are taken out first
    const t = w7Less(w8aLess(readFileSync('src/howto/generated/loaders.ts', 'utf8')).text).text, ok = w2Less(w3Less(w5Less(w6Less(t).text).text).text);   // LIB-SHIP W8a: its lines out first
    expect(ok.sha).toBe('00a18e3c3dd9f50f3b0ef5e145f3668de51fefd860c950062c5422d7fa6a8d3b');
    expect(t).toContain('  "face-pull": () => import(\'./posture-face-pull\'),\n');
    expect(w6Less(t.replace('  "face-pull": () => import(\'./posture-face-pull\'),\n', '')).removed).toBe(27);
    expect(w6Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"face-pull\": () => import('./hand-face-pull'),\n")).removed).toBe(29);
    expect(w2Less(w3Less(w5Less(w6Less(t.replace('export const HAND', 'export const HAND_X')).text).text).text).sha).not.toBe(ok.sha);
  });
  it('LIB-SHIP W3 mutations: a W3 line dropped, a HAND line for a no-pair W3 id, and another line changed are red', () => {
    const t = readFileSync('src/howto/generated/loaders.ts', 'utf8'), ok = w2Less(w3Less(t).text);
    expect(t).toContain('  "chin-up": () => import(\'./posture-chin-up\'),\n');
    expect(w3Less(t.replace('  "chin-up": () => import(\'./posture-chin-up\'),\n', '')).removed).toBe(40);
    expect(w3Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"straight-arm-pulldown\": () => import('./hand-straight-arm-pulldown'),\n")).removed).toBe(42);
    expect(w2Less(w3Less(t.replace('export const HAND', 'export const HAND_X')).text).sha).not.toBe(ok.sha);
  });
  it('LIB-SHIP W2 mutations: a HAND line for a W2 id, a W2 line dropped, and another line changed in loaders.ts are red', () => {
    const t = readFileSync('src/howto/generated/loaders.ts', 'utf8'), ok = w2Less(t);
    expect(w2Less(t.replace('export const HAND', 'export const HAND_X')).sha).not.toBe(ok.sha);
    // merge of main 7e060e83: the W2, W4 and PLATEFIX lines together are 72, so a dropped line leaves 71 and an extra HAND line 73
    expect(w2Less(t.replace('  "plank": () => import(\'./posture-plank\'),\n', '')).removed).toBe(71);
    expect(w2Less(t.replace('  "t-bar-row": () => import(\'./feel-t-bar-row\'),\n', '')).removed).toBe(71);   // LIB-SHIP W4: a W4 line dropped
    expect(w2Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"plank\": () => import('./hand-plank'),\n")).removed).toBe(73);
    // LIB-PLATEFIX-1: a PLATEFIX line dropped, and a HAND line for a PLATEFIX id, are red
    expect(w2Less(t.replace('  "reverse-lunge": () => import(\'./posture-reverse-lunge\'),\n', '')).removed).toBe(71);
    expect(w2Less(t.replace("export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n", "export const HAND: Readonly<Record<string, () => Promise<{ readonly panel: string }>>> = {\n  \"triceps-pushdown\": () => import('./hand-triceps-pushdown'),\n")).removed).toBe(73);
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

// LIB-SHIP W6 (#393): W6 adds the 23 lb06/lb07 rows (D-SHIP-MOVE; [golden update] pin commits) and moves no key of an older
// row past build-layers-page.mjs (already blanked as a W2 key). lessW6 checks each W6 row pins its files' current sha256
// and removes it, so every other entry is still compared as before.
const W6_ROWS = [...Object.keys(JSON.parse(readFileSync('tools/plates/library/batches/lb06.json', 'utf8')).rows),
  ...Object.keys(JSON.parse(readFileSync('tools/plates/library/batches/lb07.json', 'utf8')).rows)];
const lessW6 = (m: any) => {
  for (const id of W6_ROWS) {
    if (!(id in m.rows)) throw new Error(`LIB-SHIP W6: ${id} has no MANIFEST row`);
    for (const [k, v] of Object.entries<any>(m.rows[id].files)) if (v !== sha(readFileSync(k))) throw new Error(`LIB-SHIP W6: ${id} ${k} does not pin its file`);
    delete m.rows[id];
  }
  return m;
};
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
  const w3Read = (p: string) => readFileSync(p, 'utf8');
  // LIB-SHIP W3 (D-SHIP-A9 guard replacement): W3's lb01 and zoom pins add these 13 rows (the 9 shipped and the 4 staged
  // at approved-plate), and W3 PANEL FIX 2 (f561ff71, #384 6649416891) moves crop.mjs and zoom-css.mjs in every row. Each
  // W3 row must be there and each moved key must pin its current file; with the rows removed and main 5023f5c6's sha put
  // back (`keep`: keys the caller checks and blanks itself), every other entry is untouched for the checks below
  const W3_ROWS = ['assisted_pull_up', 'chest_supported_row', 'chin_up', 'close_grip_pulldown', 'hanging_knee_raise', 'horizontal_leg_press',
    'incline_machine_press', 'inverted_row', 'resistance_band_row', 'shoulder_press', 'single_arm_lat_pulldown', 'straight_arm_pulldown',
    'underhand_lat_pulldown'].map(id => `lib_${id}`);
  const W3_MOVED: Record<string, string> = {
    'tools/plates/library/render/closeup/crop.mjs': 'df61d973c2933021554e3d89c9834d01f1f171c35dd10d5cd1c7a11b946985d9',
    'tools/plates/library/render/closeup/zoom-css.mjs': '37836f22478605ef8162af3c05e515385d03034d090279b6c91f4248adce2fdf',
  };
  const lessW3 = (m: any, keep: string[] = []) => {
    for (const id of W3_ROWS) { expect(Object.keys(m.rows), id).toContain(id); delete m.rows[id]; }
    for (const [id, r] of Object.entries<any>(m.rows)) for (const [k, main] of Object.entries(W3_MOVED)) {
      if (keep.includes(k)) continue;
      expect(r.files[k], `${id} ${k}`).toBe(sha(w3Read(k)));
      r.files[k] = main;
    }
    return m;
  };
  it('LIB-SHIP W3 mutations: a W3 row missing, a moved key not at its current file, and a non-W3 row changed are red', () => {
    const m = () => JSON.parse(w3Read('tools/plates/library/MANIFEST.json'));
    const a = m(); delete a.rows.lib_chin_up;
    expect(() => lessW3(a)).toThrow(/lib_chin_up/);
    const b = m(); b.rows.lib_plank.files['tools/plates/library/render/closeup/zoom-css.mjs'] = 'f'.repeat(64);
    expect(() => lessW3(b)).toThrow(/lib_plank/);
    const c = m(); c.rows.lib_plank.entry = 'f'.repeat(64);
    expect(JSON.stringify(lessW3(c))).not.toBe(JSON.stringify(lessW3(m())));
  });
  it('every pinned row pins the current build-layers-page.mjs, and every other entry equals main c4c34d75 (re-measured after train 63)', () => {
    // LIB-SHIP W6 (merge of main de91dd21): lessW6 first, the 23 W6 rows checked and taken out, as before the merge
    // LIB-SHIP W4 (D-SHIP-W4-PIN; the W2-form widening, approved #391): lessW4 (checks/ship-w4.ts) removes the 20 lb02/lb03 rows
    // (each must be present) and blanks the W4-moved keys (each must pin its current file); LIB-SHIP W3's lessW3 then takes
    // out W3's 13 rows and puts main's moved shas back (merge of main 62d3dcb6: both lanes kept)
    // LIB-PLATEFIX-2 (#395): pf2Main then checks its moved keys and entry and puts main 7e060e83's back (merge of main 6227bd8e)
    const m = lessW3(pf2Main(lessW4(lessW6(JSON.parse(readFileSync('tools/plates/library/MANIFEST.json', 'utf8'))), k => sha(readFileSync(k)))));
    const rows = Object.values(m.rows) as { files: Record<string, string> }[];
    expect(rows).toHaveLength(22 + W5.length + W7_ROWS.length);   // LIB-SHIP W2: + PILOT-B2's lib_crunch; LIB-SHIP W5: + lb04's and lb05's 27 rows (lessW5); LIB-SHIP W7 (PIN GO #394 6649092340): + the 29 W7 rows, taken out again by lessW7
    expect(Object.keys(m.rows)).toContain('lib_crunch');
    // F-CROP-FRONT D-CROP-PIN / D-CROP-NONE (#380): crop.mjs's and hand.mjs's keys are re-pinned there and pinned exactly by crop-projection.test.ts
    const F_CROP = ['tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeup/hand.mjs'];
    // F-PAIR-FAULTS (#386): pairs.mjs's key is re-pinned there and pinned exactly by pair-faults.test.ts
    const F_PAIR = ['tools/plates/library/hands/pairs.mjs'];
    // LIB-PLATEFIX-3 E2 (#405 6684669717 item 18, [golden update]): zoom.mjs's key is re-pinned there and pinned exactly by platefix3-engine.test.ts
    const PF3 = ['tools/plates/library/render/closeup/zoom.mjs'];
    for (const r of rows) { expect(r.files[BLP]).toBe(sha(readFileSync(BLP))); r.files[BLP] = 'X'; for (const k of [...F_CROP, ...F_PAIR, ...PF3]) r.files[k] = 'X'; }
    // main cb9a6dae's MANIFEST.json with the same entries blanked was b126d854 (#386); LIB-SHIP W2 (merge of main cf28ab23,
    // both sides kept): with W2's changes also taken out, main cf28ab23's with the same blanks
    // LIB-SHIP W5: with W5's 27 rows also taken out first (lessW5: each must be present), the same hash
    // RESEARCH-ROUTES-1 (#398, D-RR-HEAD): back-pain-box.json's key is re-pinned there and pinned exactly by research-routes.test.ts;
    // each row that still lists it after lessW2 must pin the current file, then it is blanked too
    const rrBox = (x: any) => { for (const r of Object.values<any>(x.rows)) if ('docs/research/howto/shared/back-pain-box.json' in r.files) { expect(r.files['docs/research/howto/shared/back-pain-box.json']).toBe(sha(readFileSync('docs/research/howto/shared/back-pain-box.json'))); r.files['docs/research/howto/shared/back-pain-box.json'] = 'X'; } return x; };
    // (was 3882bf3e… without RESEARCH-ROUTES-1's key; re-measured by RESEARCH-ROUTES-1 on main e623d3ef)
    // F-BODYMAP-FRONTDELT (#404, D-BODYMAP-LIB): its region-fix.mjs key is re-pinned there and pinned exactly by
    // tests/library/bodymap-frontdelt.test.ts; each must pin its current file, then it is put back to main 5023f5c6's value.
    const bmFix = (x: any) => { for (const r of Object.values<any>(x.rows)) if ('tools/plates/library/render/region-fix.mjs' in r.files) { expect(r.files['tools/plates/library/render/region-fix.mjs']).toBe(sha(readFileSync('tools/plates/library/render/region-fix.mjs'))); r.files['tools/plates/library/render/region-fix.mjs'] = '3ffbd27de5e812d60a4542de4d483113640aa4b0b427089317e2cedb39e7f3a8'; } return x; };
    // LIB-PLATEFIX-3 (D-PLATEFIX-PINS form, #405 6684669717 item 18): was 99d9824b…e882e, then f8074fd0 with zoom.mjs's key also blanked.
    // LIB-PLATEFIX-1 (#385, D-PLATEFIX-PINS / PIN GO; [golden update]; merge of main 8841246c, both sides kept): its moved keys,
    // added keys and superseded entries each pin their current value (pfProblems; reds in crop-projection.test.ts), then are
    // blanked too; every key and entry where this MANIFEST differs from main 8841246c's is blanked, so the rest is main
    // 8841246c's with the same blanks (the crop-projection value: the same blanks, measured on main 8841246c's own MANIFEST).
    expect(pfProblems(m)).toEqual([]);
    expect(sha(JSON.stringify(rrBox(lessW2(bmFix(blankPF(lessW5(m), 'X')), [BLP]))))).toBe('0b7ad1294292f67bc7f9c074c01b2c0b28613b7f9194f186076f599865189435');   // LIB-SHIP W4 (merge of main 7e060e83): main's 3e726514… with lessW4's blanks too; LIB-SHIP W5: lessW5 first, as before the merge (merge of main 05382042)
  });
  it('LIB-SHIP W6 red: a W6 row whose file does not pin its sha, or a W6 row missing, throws', () => {
    const m = JSON.parse(readFileSync('tools/plates/library/MANIFEST.json', 'utf8')), r = m.rows[W6_ROWS[0]!];
    r.files[Object.keys(r.files)[0]!] = '0'.repeat(64);
    expect(() => lessW6(m)).toThrow('does not pin its file');
    const n = JSON.parse(readFileSync('tools/plates/library/MANIFEST.json', 'utf8')); delete n.rows[W6_ROWS[1]!];
    expect(() => lessW6(n)).toThrow('has no MANIFEST row');
  });
});

// LIB-PLATEFIX-4 (#410, D-PF4-PINS): the pf4 check above bites; one PF4 moved key off its file is red.
describe('LIB-PLATEFIX-4 D-PF4-PINS mutation', () => {
  it('one PF4 moved key off its file is red, naming the row and the key', () => {
    const m = JSON.parse(readFileSync(new URL('../../tools/plates/library/MANIFEST.json', import.meta.url), 'utf8'));
    expect(pf4Problems(m)).toEqual([]);
    const k = Object.keys(PF4_MAIN)[0]!, ids = Object.keys(m.rows).filter(r => k in m.rows[r].files), id = ids[0]!;
    m.rows[id].files[k] = '0'.repeat(64);
    const bad = pf4Problems(m);
    expect(bad.length).toBe(1);
    expect(bad[0]!.startsWith(`${id} ${k}: ${'0'.repeat(64)} != `)).toBe(true);
  });
});

// LIB-PLATEFIX-5 (#419, D-PF5-PINS): the pf5 check above bites; one PF5 moved key off its file is red.
describe('LIB-PLATEFIX-5 D-PF5-PINS mutation', () => {
  it('one PF5 moved key off its file is red, naming the row and the key', () => {
    const m = JSON.parse(readFileSync(new URL('../../tools/plates/library/MANIFEST.json', import.meta.url), 'utf8'));
    expect(pf5Problems(m)).toEqual([]);
    const k = Object.keys(PF5_MAIN)[0]!, ids = Object.keys(m.rows).filter(r => k in m.rows[r].files), id = ids[0]!;
    m.rows[id].files[k] = '0'.repeat(64);
    const bad = pf5Problems(m);
    expect(bad.length).toBe(1);
    expect(bad[0]!.startsWith(`${id} ${k}: ${'0'.repeat(64)} != `)).toBe(true);
  });
});
