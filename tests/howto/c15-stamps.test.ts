// LIB-5 S8 (Do 6; D-LIB5-STAMPS, D-LIB5-SCRATCH): strict C15. The stamp helpers (tools/plates/library/research/
// stamps.mjs) compute exactly c15's contentHash over a row's full content and its 9 plate fragments, and an empty,
// missing or unparsable reviews.json fails every id (never c15's stub pass). Main holds no scratch marker or stamp.
import { createHash } from 'node:crypto';
import { execFileSync, spawn } from 'node:child_process';
import { cpSync, existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { child } from '../child-test';   // D-W8B-RPC2 (#417): W8b's slow blocks run in an awaited child
import { checkC15, contentHash } from './checks/c15';
import { W4_IDS } from './checks/ship-w4';
import { W9_HELD, W9_IDS } from './checks/ship-w9';   // LIB-SHIP W9
import { W10_HELD, W10_IDS } from './checks/ship-w10';   // LIB-SHIP W10

/* eslint-disable @typescript-eslint/no-explicit-any */
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const ROOT = new URL('../../', import.meta.url).pathname;
const EIGHT = Object.keys(JSON.parse(readFileSync(join(ROOT, 'tools/plates/plates.json'), 'utf8')));
let S: any, content: any, G: any;
const temps: string[] = [];
beforeAll(async () => {
  [S, content, G] = await Promise.all(['tools/plates/library/research/stamps.mjs', 'tools/plates/gen/content.mjs', 'tools/plates/golden.mjs'].map(p => import(/* @vite-ignore */ url(p))));
});
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });
const fragmentsOf8 = (id: string) => G.latestEntries(JSON.parse(readFileSync(G.GOLDEN_JSON, 'utf8')).entries).get(id).fragments;

describe('LIB-5 S8: the stamp hash is c15\'s contentHash over the full content and the 9 plate fragments', () => {
  it('contentHashOf equals c15 contentHash(loadContent(id).content, fragments) for each of the 8', async () => {
    for (const id of EIGHT) {
      const f = fragmentsOf8(id), { content: c } = await content.loadContent(id);
      expect(Object.keys(f)).toEqual(['normalSvg', 'normalOverlay', 'mistakeSvg', 'mistakeOverlay', 'tells', 'tempo', 'cues', 'alt', 'mistakeAlt']);
      expect([id, await S.contentHashOf(id)]).toEqual([id, contentHash(c, f)]);
      expect((await S.stampOf(id)).scope).toBe(c.extends ?? c.id);
    }
  });
  it('mutations: one character of content, or one fragment, changes the hash, and checkC15 then fails on the old stamp', async () => {
    const id = 'lib_pull_up', f = fragmentsOf8(id), { content: c } = await content.loadContent(id), h = contentHash(c, f);
    const reviews = { schema: 1 as const, entries: [{ scope: id, hash: h, date: '2026-10-18' }] };
    expect(checkC15(c, f, reviews)).toEqual([]);
    const c2 = { ...c, copy: { ...c.copy, setupLine: `${c.copy.setupLine.slice(0, -1)}!` } };
    expect(checkC15(c2, f, reviews)).toHaveLength(1);
    expect(checkC15(c, { ...f, tells: f.tells.replace(/^./, 'x') }, reviews)).toHaveLength(1);
  });
});

describe('LIB-5 S8: stampProblems is strict', () => {
  it('a missing, unparsable or empty reviews.json fails every id', async () => {
    for (const reviews of [null, { schema: 1, entries: [] }, { schema: 1 }]) {
      expect(await S.stampProblems(['lib_pull_up', 'lib_leg_press'], { reviews })).toEqual([
        'LIB-5 stamp: lib_pull_up: reviews.json is missing, unparsable or empty', 'LIB-5 stamp: lib_leg_press: reviews.json is missing, unparsable or empty']);
    }
  });
  it('a matching entry passes; a stale hash, a wrong scope, and a scratch entry outside a marked root each fail', async () => {
    const { scope, hash } = await S.stampOf('lib_pull_up');
    const one = (e: any) => S.stampProblems(['lib_pull_up'], { reviews: { schema: 1, entries: [e] } });
    expect(await one({ scope, hash, date: '2026-10-18', approvedBy: 'supervisor', decision: 'D-LIB5-STAMPS', approval: 'https://github.com/macdarenz-droid/M-arc/pull/244#issuecomment-6247438837 @ 33302cc898afae29df539c9a932ceaad4a0864cb', open: 0 })).toEqual([]);
    expect(await one({ scope, hash: hash.replace(/^./, (c: string) => (c === '0' ? '1' : '0')), date: '2026-10-18' })).toEqual([`LIB-5 stamp: lib_pull_up: no reviews.json entry for scope lib_pull_up hash ${hash.slice(0, 12)}…`]);
    expect(await one({ scope: 'lib_leg_press', hash, date: '2026-10-18' })).toHaveLength(1);
    expect(await one({ scope, hash, date: '2026-10-18', scratch: true })).toHaveLength(1);
  });
});

describe('LIB-5 S8 / D-LIB5-SCRATCH: main holds no scratch marker or scratch stamp', () => {
  it('no SCRATCH_MARKER at ROOT, none tracked, and the committed reviews.json holds no scratch entry', () => {
    expect(S.SCRATCH_MARKER).toBe('LIB5-SCRATCH-ROOT');
    expect(existsSync(join(ROOT, S.SCRATCH_MARKER))).toBe(false);
    expect(execFileSync('git', ['ls-files', '--', `:(glob)**/${S.SCRATCH_MARKER}`], { cwd: ROOT, encoding: 'utf8' })).toBe('');
    const reviews = JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/reviews.json'), 'utf8'));
    expect(reviews.entries.filter((e: any) => 'scratch' in e)).toEqual([]);
  });
  it('writeScratchStamps on an unmarked root throws, and writes nothing', () => {
    const t = mkdtempSync(join(tmpdir(), 'lib5-unmarked-')); temps.push(t);
    expect(() => S.writeScratchStamps(t, ['lib_pull_up'])).toThrow(/holds no LIB5-SCRATCH-ROOT/);
    expect(existsSync(join(t, 'docs/research/howto/reviews.json'))).toBe(false);
  });
});

describe('LIB-5 Do 6 (D-LIB5-STAMPS, D-LIB-O5 = lib4-cards 14.8): the 8\'s committed stamps', () => {
  const reviews = () => JSON.parse(readFileSync(join(ROOT, 'docs/research/howto/reviews.json'), 'utf8'));
  /** Problems with the committed (non-scratch) entries: approvedBy 'supervisor', a decision, an approval and open 0. */
  // LIB-SHIP W2 (ruling 3): the ruled library stamps, each with its decision and approval
  const W1_RULE = ['D-SHIP-W1-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/376#issuecomment-6616230145 @ 26593a92bdbe428f12186949c7842b35d9f47dec'];
  const W2_RULE = ['D-SHIP-W2-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/379#issuecomment-6636105974 @ 91ee3dfa68c60f825dad53077358bcc0056c4ecf'];
  const W2_STAMPED = ['lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_dumbbell_shoulder_press', 'lib_upright_row', 'lib_rope_triceps_pushdown', 'lib_plank', 'lib_cable_fly', 'lib_push_up'];
  // LIB-SHIP W3 (ruling 3; D-SHIP-W3-STAMP, the final panel result #384 6653062201 at the flip base af8e6e02): the 9, registry order
  const W3_RULE = ['D-SHIP-W3-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/384#issuecomment-6653062201 @ af8e6e025798059495971c476e9d5a1585907c4f'];
  const W3_STAMPED = ['lib_chin_up', 'lib_hanging_knee_raise', 'lib_inverted_row', 'lib_close_grip_pulldown', 'lib_single_arm_lat_pulldown',
    'lib_straight_arm_pulldown', 'lib_chest_supported_row', 'lib_resistance_band_row', 'lib_horizontal_leg_press'];
  // LIB-SHIP W6 (ruling 3; D-SHIP-W6-STAMP): the flip set of #393 6689822595, ruled to ship by #393 6701002884; the 7, registry order
  const W6_RULE = ['D-SHIP-W6-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/393#issuecomment-6689822595 @ d939496e22e7d0d9e858662e3ac2b719bec47c20'];
  const W6_STAMPED = ['lib_machine_crunch', 'lib_machine_lateral_raise', 'lib_cable_lateral_raise', 'lib_dumbbell_front_raise', 'lib_face_pull',
    'lib_incline_push_up', 'lib_pike_push_up'];
  // LIB-PLATEFIX-1 (#385, D-PLATEFIX-STAMP 6654532221 @ e1419e26; D-PLATEFIX-PINS / PIN GO): the 4 it ships are stamped
  // under its ruling, and barbell_row and cable_fly, whose plates it changed, are re-stamped after their W2 stamps (kept
  // as main's history, byte-equal), all after main 8841246c's entries. RULING lists each id's rulings in stamp order; the
  // last one is the current stamp.
  // LIB-SHIP W4 (ruling 3; D-SHIP-W4-FLIPSET #391 6682985023): then the 6 W4 ids (checks/ship-w4.ts), in shipping order;
  // merge of main 7e060e83: W4 merged after W3 and LIB-PLATEFIX-1, so W4's 6 follow main's entries
  const W4_RULE = ['D-SHIP-W4-FLIPSET', 'https://github.com/macdarenz-droid/M-arc/pull/391#issuecomment-6682985023 @ 2af8092ca4343ef72bf908872ea7c362e9c24758'];
  const PF_RULE = ['D-PLATEFIX-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/385#issuecomment-6654532221 @ e1419e2616a6cd7a048a6a09d81fadee83ccdd2d'];
  const PF_STAMPED = ['lib_romanian_deadlift', 'lib_single_leg_romanian_deadlift', 'lib_triceps_pushdown', 'lib_reverse_lunge'];
  const PF_RESTAMPED = ['lib_barbell_row', 'lib_cable_fly'];
  // LIB-SHIP W5 (ruling 3; D-SHIP-W5-STAMP under D-SHIP-W5-FLIPSET + D-SHIP-W5-PREACHER, #392 6683213580 @ 9d4d72cd): the
  // 10 flipped ids, stamped after LIB-PLATEFIX-1's entries in batch order (lb04's 4, then lb05's 6); the 17 held W5 rows
  // (goblet_squat among them) stay unruled, so one shipped is red
  const W5_RULE = ['D-SHIP-W5-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/392#issuecomment-6683213580 @ 9d4d72cdd0cc1b5d288a22a2210462bf5c93c313'];
  const W5_STAMPED = ['lib_front_squat', 'lib_bodyweight_squat', 'lib_bodyweight_lunge', 'lib_bodyweight_split_squat',
    'lib_preacher_curl', 'lib_hammer_curl', 'lib_alternating_dumbbell_curl', 'lib_barbell_curl', 'lib_ez_bar_curl', 'lib_reverse_curl'];
  // LIB-SHIP W7 (ruling 3; D-SHIP-W7-STAMP, #394 6711372615 @ a3e5b6e7, after D-PF10-W7JOIN): the 16 flipped ids, stamped
  // after W6's 7 in batch order (lb08's 5, lb09's 6, lb10's 5); the 13 held W7 rows (v_up among them) stay unruled;
  // D-SHIP-W7-SLEDHOLD (#394 SHIP W7 QUESTION 4 option 1; follow-up F-SLEDPULL-S0): sled_pull is held at approved-plate and its stamp removed
  // D-SHIP-W7-HOLD2 (#394 6753333493): glute_bridge is held too; D-SHIP-W7-HOLD2 (gate HT8/HT9 after main dc058207; F-NOREDFLAG-GATE): high_knees held too
  const W7_RULE = ['D-SHIP-W7-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/394#issuecomment-6711372615 @ a3e5b6e75d494041afbe674c1a5fe227b492f51c'];
  const W7_STAMPED = ['lib_leg_extension', 'lib_lying_leg_curl', 'lib_standing_leg_curl', 'lib_cable_kickback', 'lib_resisted_hip_flexion',
    'lib_ab_wheel_rollout', 'lib_bird_dog', 'lib_cable_crunch', 'lib_hollow_body_hold', 'lib_reverse_crunch', 'lib_dead_bug',
    'lib_kettlebell_swing', 'lib_bear_crawl', 'lib_sled_push', 'lib_medicine_ball_slam', 'lib_farmer_s_carry'];
  // LIB-SHIP W8a (ruling 3; D-SHIP-W8A-STAMP, #413 6761492481): the 3 shipped ids, stamped after W7's 16 in that order;
  // pec_fly's names the ruling comment (its row changed after the panel); mountain_climbers and underhand_lat_pulldown are held
  const W8A_PANEL = ['D-SHIP-W8A-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/413#issuecomment-6760254084 @ 29e4af37a166b4a7e23c577c10386047da419b95'];
  const W8A_RULED = ['D-SHIP-W8A-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/413#issuecomment-6761492481 @ bb60cc574a8515dc6e67b3c80195b2cb2ffe6738'];
  const W8A_STAMPED = ['lib_barbell_overhead_press', 'lib_pec_fly', 'lib_crunch'];
  // LIB-SHIP W8b (ruling 3; D-SHIP-W8B-STAMP, W8b LAYERS APPROVED #417 6856507580): the 9 shipped ids, stamped after W8a's 3 in
  // the comment's order; 8 name the panel at the head it judged, dumbbell_pullover the round-2 ruling (its risk line changed
  // after the panel); the 8 held W8b ids stay unruled
  const W8B_PANEL = ['D-SHIP-W8B-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/417#issuecomment-6856272493 @ 1fdf6975d8e93c184ae77ad11daf1cf73505a15d'];
  const W8B_RULED = ['D-SHIP-W8B-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/417#issuecomment-6856468001 @ 1f53a5551277ae8fbc111984d1b5e63b90b2b652'];
  // D-W8B-RDLWATCH (#417 6872764692): dumbbell_romanian_deadlift re-stamped in place (its watch moved after the panel); the
  // other 8 stand
  const W8B_RDLWATCH = ['D-SHIP-W8B-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/417#issuecomment-6872580444 @ d61ca89bcea4493d92bcb4ceeeca79638f652b00'];
  const W8B_STAMPED = ['lib_dumbbell_pullover', 'lib_dumbbell_romanian_deadlift', 'lib_pistol_squat', 'lib_wall_sit', 'lib_forward_lunge', 'lib_walking_lunge',
    'lib_single_arm_triceps_pushdown', 'lib_bayesian_cable_curl', 'lib_dumbbell_overhead_triceps_extension'];
  // F-SHEET-COPY (#423; D-SHEETCOPY-STAMP, panel #423 6852654901 @ a4ed9e22): the sheet copy change moved the content hash
  // of the 8 and of 4 shipped library ids (their How-to sources carry a renamed zoom heading), so each is re-stamped once
  // under that ruling after main 8f112a6d's 83 entries (kept byte-equal), in id order. The 8's D-LIB5-STAMPS entries and
  // the 4's W3 stamps stay as main's history; the re-stamp is the current one.
  const SC_RULE = ['D-SHEETCOPY-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/423#issuecomment-6852654901 @ a4ed9e22fc0a6e215df45a915b26135a25a88efb'];
  const SC_LIB_RESTAMPED = ['lib_chin_up', 'lib_close_grip_pulldown', 'lib_hanging_knee_raise', 'lib_inverted_row'];
  const SC_RESTAMPED = [...EIGHT, ...SC_LIB_RESTAMPED].sort();
  const MAIN_SC_ENTRIES = { n: 83, sha: '7ccc2cd4845fb5d41fe9c9b8d47482aa24108487577bc0d30db64e791f6c0bbb' };   // main 8f112a6d's reviews.json entries (was main a4796243's 74, 7613f546…; + W8b's 9)
  // LIB-SHIP W8c (ruling 3; D-SHIP-W8C-STAMP, W8c LAYERS APPROVED #429 6895226756): the 3 shipped ids, stamped after W8b's 9 in
  // the STAMP list's order, each with its listed approval (seated: the W8a panel; assisted: the W8c delta check; shrug: the W8b panel)
  const W8C_STAMPED = ['lib_seated_leg_curl', 'lib_assisted_pull_up', 'lib_dumbbell_shrug'];
  const W8C_RULE: Record<string, string[]> = {
    lib_seated_leg_curl: ['D-SHIP-W8C-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/413#issuecomment-6760254084 @ 29e4af37a166b4a7e23c577c10386047da419b95'],
    lib_assisted_pull_up: ['D-SHIP-W8C-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/429#issuecomment-6895226756 @ 0523227e3db7e273930d4acf1a31c6b9d073fe1d'],
    lib_dumbbell_shrug: ['D-SHIP-W8C-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/417#issuecomment-6856272493 @ 1fdf6975d8e93c184ae77ad11daf1cf73505a15d'],
  };
  // LIB-SHIP W9 (ruling 3; D-SHIP-W9-STAMP, W9 LAYERS APPROVED #433 6911987250): the 10 shipped ids, stamped after W8c's 3 in
  // the STAMP list's (registry) order, each with its standing verdict's approval (cable_curl: the W9 LAYERS APPROVED comment)
  const W9_STAMPED = ['lib_barbell_bench_press', 'lib_conventional_deadlift', 'lib_sumo_deadlift', 'lib_bulgarian_split_squat', 'lib_cable_curl',
    'lib_cable_chest_press', 'lib_hip_adduction', 'lib_diamond_push_up', 'lib_side_plank', 'lib_wall_ball'];
  const W9_RULE: Record<string, string[]> = {
    lib_barbell_bench_press: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/410#issuecomment-6750587189 @ 7b4e486655a8d98e8db8a9530e6e9b8c8aba784c'],
    lib_conventional_deadlift: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/427#issuecomment-6874288878 @ e8e15f7a5634669f821e868a0e9247b5abe7530c'],
    lib_sumo_deadlift: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/417#issuecomment-6856272493 @ 1fdf6975d8e93c184ae77ad11daf1cf73505a15d'],
    lib_bulgarian_split_squat: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/426#issuecomment-6869858026 @ ea5cbca8530e3f8adddc75250e50926e2e12ff08'],
    lib_cable_curl: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/433#issuecomment-6911987250 @ 134c668be3e7d9682b46e66933832f419edba413'],
    lib_cable_chest_press: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/419#issuecomment-6853178277 @ 50a35bb68c215c6c3f11117ccfda09fe4fd38331'],
    lib_hip_adduction: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/419#issuecomment-6851987591 @ f487c7971ddae190542e75e66abe2508c77234aa'],
    lib_diamond_push_up: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/419#issuecomment-6853178277 @ 50a35bb68c215c6c3f11117ccfda09fe4fd38331'],
    lib_side_plank: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/419#issuecomment-6853178277 @ 50a35bb68c215c6c3f11117ccfda09fe4fd38331'],
    lib_wall_ball: ['D-SHIP-W9-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/419#issuecomment-6853178277 @ 50a35bb68c215c6c3f11117ccfda09fe4fd38331'],
  };
  // LIB-SHIP W10 (D-SHIP-W10-STAMP, W10 LAYERS APPROVED #434 6923360626 @ d642147e): the 4 shipped ids, stamped after W9's 10 in
  // registry order, each with the W10 LAYERS APPROVED approval (D-W10-DECLINEHOLD: decline_bench_press held, no stamp)
  const W10_STAMPED = ['lib_underhand_lat_pulldown', 'lib_jump_squat', 'lib_hip_abduction', 'lib_mountain_climbers'];
  const W10_RULE = ['D-SHIP-W10-STAMP', 'https://github.com/macdarenz-droid/M-arc/pull/434#issuecomment-6923360626 @ d642147ea685fbb2c120a6d7521a3131bc692e55'];
  const RULING: Record<string, string[][]> = { lib_dumbbell_biceps_curl: [W1_RULE], ...Object.fromEntries(W2_STAMPED.map(id => [id, [W2_RULE]])),
    ...Object.fromEntries(W3_STAMPED.map(id => [id, [W3_RULE]])), ...Object.fromEntries(PF_STAMPED.map(id => [id, [PF_RULE]])),
    ...Object.fromEntries(PF_RESTAMPED.map(id => [id, [W2_RULE, PF_RULE]])), ...Object.fromEntries(W4_IDS.map(id => [id, [W4_RULE]])), ...Object.fromEntries(W5_STAMPED.map(id => [id, [W5_RULE]])),
    ...Object.fromEntries(W6_STAMPED.map(id => [id, [W6_RULE]])),
    ...Object.fromEntries(W7_STAMPED.map(id => [id, [W7_RULE]])),
    ...Object.fromEntries(W8A_STAMPED.map(id => [id, [id === 'lib_pec_fly' ? W8A_RULED : W8A_PANEL]])),
    ...Object.fromEntries(W8B_STAMPED.map(id => [id, [id === 'lib_dumbbell_pullover' ? W8B_RULED : id === 'lib_dumbbell_romanian_deadlift' ? W8B_RDLWATCH : W8B_PANEL]])),
    ...Object.fromEntries(SC_LIB_RESTAMPED.map(id => [id, [W3_RULE, SC_RULE]])),   // F-SHEET-COPY: the W3 stamp, then the re-stamp
    ...Object.fromEntries(W8C_STAMPED.map(id => [id, [W8C_RULE[id]!]])),
    ...Object.fromEntries(W9_STAMPED.map(id => [id, [W9_RULE[id]!]])),
    ...Object.fromEntries(W10_STAMPED.map(id => [id, [W10_RULE]])) };   // LIB-SHIP W10
  /** main 8841246c's 26 reviews.json entries (sha256 of their JSON.stringify): LIB-PLATEFIX-1 only appends. */
  const sha = (t: string) => createHash('sha256').update(t).digest('hex');
  const MAIN_ENTRIES = { n: 26, sha: '18060e4098c373dd9bdf3a0b5875cefddbc5af632814ceee9798aadb1d4c2e37' };
  // LIB-SHIP W6: main 7e060e83's 32 entries (sha256 of their JSON.stringify, measured from 7e060e83's own reviews.json):
  // W6 only appends its 7 after them
  const MAIN_W6_ENTRIES = { n: 32, sha: '9d4bb7ff39b2d978a34b50829dc494b54225c88c3474b6e10ca9dbfcb698f63d' };
  // LIB-SHIP W6, merge of main de91dd21 (trains 78-81): main de91dd21's 48 entries (sha256 of their JSON.stringify, measured
  // from de91dd21's own reviews.json); W6 still only appends its 7 after them
  const MAIN_W6_ENTRIES_DE91 = { n: 48, sha: '92449ae84b210bc6628f548f3ebd423690a1c2e8a94ac81397c26c5633216746' };
  const clone = (x: any) => JSON.parse(JSON.stringify(x));
  /** The library entries against RULING: every ruled id stamped once per ruling, in order, under that decision; no
   *  unruled id stamped. */
  // W2 review follow-up (#384 6647873082): cross-checked against the registry's shipped ids, so a shipped library id
  // outside RULING is red even with no stamp
  let SHIPPED: string[] = [];
  beforeAll(async () => { SHIPPED = (await import(/* @vite-ignore */ url('tools/plates/library/registry.mjs'))).shippedIds(); });
  const stampedProblems = (entries: any[], shipped = SHIPPED) => {
    const lib = entries.filter(e => !e.scratch && !EIGHT.includes(e.scope)), bad: string[] = [];
    if (!shipped.length) bad.push('no shipped ids');
    for (const id of shipped) if (!EIGHT.includes(id) && !RULING[id]) bad.push(`${id}: shipped, not ruled`);
    for (const id of Object.keys(RULING)) {
      const n = lib.filter(e => e.scope === id).length;
      if (!n) bad.push(`${id}: ruled, not stamped`);
      else if (n < RULING[id]!.length) bad.push(`${id}: ruled ${RULING[id]!.length} stamps, has ${n}`);
    }
    const seen: Record<string, number> = {};
    for (const e of lib) {
      const ruled = RULING[e.scope]?.[(seen[e.scope] = (seen[e.scope] ?? -1) + 1)];
      if (!RULING[e.scope]) bad.push(`${e.scope}: stamped, not ruled`);
      else if (!ruled) bad.push(`${e.scope}: stamped again, not ruled`);
      else if (e.decision !== ruled[0]) bad.push(`${e.scope}: decision ${e.decision}, ruled ${ruled[0]}`);
    }
    return bad;
  };
  const entryProblems = (entries: any[]) => entries.filter(e => !e.scratch).flatMap(e => [
    ...(e.approvedBy !== 'supervisor' ? [`${e.scope}: approvedBy ${JSON.stringify(e.approvedBy)}`] : []),
    ...(typeof e.decision !== 'string' || !e.decision ? [`${e.scope}: no decision`] : []),
    ...(typeof e.approval !== 'string' || !e.approval ? [`${e.scope}: no approval`] : []),
    ...(e.open !== 0 ? [`${e.scope}: open ${JSON.stringify(e.open)}`] : []),
  ]);
  // LIB-SHIP (D-SHIP-A9, ruling 3; D-SHIP-W1-STAMP #376 6616230145): replaces "exactly the 8": the committed entries are
  // the 8 then exactly the ruled shipped library ids, in shipping order; an unruled or missing entry is red.
  child.it('one approved entry per id of the 8, each matching stampOf; LIB-SHIP: then one per ruled shipped library id; every committed entry is the supervisor\'s', async () => {
    const r = reviews();
    // LIB-SHIP W2 (ruling 3; D-SHIP-W2-STAMP #379 6636105974): the W1 id, then the 9 W2 ids in shipping (registry) order
    // LIB-SHIP W3: then W3's 9 (D-SHIP-W3-STAMP)
    // LIB-PLATEFIX-1: then its 4 in registry order, then the 2 re-stamps; main 8841246c's 26 entries unchanged
    // LIB-SHIP W4: then W4's 6 (D-SHIP-W4-FLIPSET), merged after main 7e060e83's 32
    // LIB-SHIP W5 (D-SHIP-W5-STAMP, ruling 3): then W5's 10 (merge of main 05382042: after W4's 6)
    // LIB-SHIP W6: then W6's 7 (D-SHIP-W6-STAMP, #393 6689822595 / 6701002884); main 7e060e83's 32 and main de91dd21's 48 entries unchanged
    // LIB-SHIP W7 (D-SHIP-W7-STAMP, ruling 3): then W7's 16 (merge of main dc058207: after W6's 7; D-SHIP-W7-SLEDHOLD, D-SHIP-W7-HOLD2)
    expect(r.entries.map((e: any) => e.scope)).toEqual([...EIGHT, 'lib_dumbbell_biceps_curl', ...W2_STAMPED, ...W3_STAMPED, ...PF_STAMPED, ...PF_RESTAMPED, ...W4_IDS, ...W5_STAMPED, ...W6_STAMPED, ...W7_STAMPED, ...W8A_STAMPED, ...W8B_STAMPED, ...SC_RESTAMPED, ...W8C_STAMPED, ...W9_STAMPED, ...W10_STAMPED]);   // LIB-SHIP W10: + its 5   // LIB-SHIP W8a: + its 3; LIB-SHIP W8b: + its 9; F-SHEET-COPY: + its re-stamps; LIB-SHIP W8c: + its 3; LIB-SHIP W9: + its 10
    expect(SC_RESTAMPED).toHaveLength(12);
    expect(sha(JSON.stringify(r.entries.slice(0, MAIN_SC_ENTRIES.n)))).toBe(MAIN_SC_ENTRIES.sha);
    expect(r.entries.slice(MAIN_SC_ENTRIES.n, MAIN_SC_ENTRIES.n + SC_RESTAMPED.length).map((e: any) => [e.scope, e.decision, e.approval])).toEqual(SC_RESTAMPED.map(id => [id, ...SC_RULE]));
    expect(W7_STAMPED).toHaveLength(16);
    expect(W8A_STAMPED).toHaveLength(3);   // D-W8A-ASSISTEDHOLD, D-W8A-SEATEDHOLD (#415): assisted_pull_up and seated_leg_curl held
    expect(W8B_STAMPED).toHaveLength(9);   // D-W8B-RIGHTPOSE, D-W8B-INCLINE and the W8b panel holds (#417): 8 held
    expect(W8C_STAMPED).toHaveLength(3);   // LIB-SHIP W8c: D-W8C-UNDERHAND, D-W8C-MCHOLD and S4 (bulgarian) held
    expect(W9_STAMPED).toEqual(W9_IDS);   // LIB-SHIP W9: exactly checks/ship-w9.ts's 10; S3 and S4 (4) held
    expect(W10_STAMPED).toEqual(W10_IDS);   // LIB-SHIP W10: exactly checks/ship-w10.ts's 4; its 13 held (W10_HELD)
    expect(sha(JSON.stringify(r.entries.slice(0, MAIN_ENTRIES.n)))).toBe(MAIN_ENTRIES.sha);
    expect(sha(JSON.stringify(r.entries.slice(0, MAIN_W6_ENTRIES.n)))).toBe(MAIN_W6_ENTRIES.sha);
    expect(sha(JSON.stringify(r.entries.slice(0, MAIN_W6_ENTRIES_DE91.n)))).toBe(MAIN_W6_ENTRIES_DE91.sha);
    expect(W4_IDS).toHaveLength(6);
    expect(stampedProblems(r.entries)).toEqual([]);
    expect(entryProblems(r.entries)).toEqual([]);
    const lib = r.entries.filter((x: any) => !EIGHT.includes(x.scope));
    for (const [i, e] of lib.entries()) {   // LIB-SHIP: each library stamp matches its sheet and its ruling
      const k = lib.slice(0, i).filter((x: any) => x.scope === e.scope).length, last = !lib.slice(i + 1).some((x: any) => x.scope === e.scope);
      // LIB-PLATEFIX-1: a superseded stamp (main's, byte-equal above) no longer matches the changed sheet; the last one does
      if (last) expect([e.scope, e.hash]).toEqual([e.scope, (await S.stampOf(e.scope)).hash]);
      else expect([e.scope, e.hash === (await S.stampOf(e.scope)).hash]).toEqual([e.scope, false]);
      expect([e.scope, e.decision, e.approval]).toEqual([e.scope, ...(RULING[e.scope]?.[k] ?? ['no ruling', ''])]);
    }
    for (const e of r.entries.filter((x: any) => EIGHT.includes(x.scope) && x.decision === 'D-LIB5-STAMPS')) {
      // F-SHEET-COPY (#423): was "equals stampOf"; the D-LIB5-STAMPS entry is now main's history (byte-equal above), superseded
      // by its D-SHEETCOPY-STAMP re-stamp, which matches the changed sheet
      expect([e.scope, e.hash === (await S.stampOf(e.scope)).hash]).toEqual([e.scope, false]);
      expect([e.decision, e.approval]).toEqual(['D-LIB5-STAMPS', 'https://github.com/macdarenz-droid/M-arc/pull/244#issuecomment-6247438837 @ 33302cc898afae29df539c9a932ceaad4a0864cb']);
      for (const role of ['fetcher', 'critic', 'safety', 'reviewer']) expect([e.scope, role, e[role]]).toEqual([e.scope, role, expect.stringContaining('README.md:52-90')]);
      for (const f of e.findings) expect(f).toMatch(/recorded, not changed: golden B is locked \(plan 2\.8\)$/);
    }
    for (const id of EIGHT) {   // F-SHEET-COPY: each of the 8 has exactly its D-LIB5-STAMPS entry, then its re-stamp, which is current
      const es = r.entries.filter((x: any) => x.scope === id);
      expect([id, es.map((x: any) => x.decision)]).toEqual([id, ['D-LIB5-STAMPS', 'D-SHEETCOPY-STAMP']]);
      expect([id, es[1].hash]).toEqual([id, (await S.stampOf(id)).hash]);
      expect([id, es[1].approval, es[1].approvedBy, es[1].open]).toEqual([id, SC_RULE[1], 'supervisor', 0]);
    }
    expect(await S.stampProblems(EIGHT)).toEqual([]);
  }, 60_000);   // LIB-SHIP W4 (the W3 WALKTIME form, #384 6690918663): walks every shipped row (36 after main 7e060e83); timed out at the 5 s default on 76c2e190's unit-tz (Asia/Manila); no assertion change
  it('LIB-SHIP W2 A9 mutations, each red: a ruled id\'s stamp removed; an unruled id stamped; a W2 id under the W1 ruling', () => {
    const es = reviews().entries;
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_plank'))).toEqual(['lib_plank: ruled, not stamped']);
    // LIB-SHIP W8a: crunch is ruled now, so the unruled id is the held mountain_climbers; a W8a stamp under another ruling is red
    // LIB-SHIP W10: mountain_climbers is ruled now (W10), so the unruled id is W10's held burpee
    expect(stampedProblems([...es, { ...es[es.length - 1], scope: 'lib_burpee' }])).toEqual(['lib_burpee: stamped, not ruled']);
    const w8 = clone(es); w8.find((e: any) => e.scope === 'lib_crunch').decision = 'D-SHIP-W7-STAMP';
    expect(stampedProblems(w8)).toEqual(['lib_crunch: decision D-SHIP-W7-STAMP, ruled D-SHIP-W8A-STAMP']);
    const w1 = clone(es); w1.find((e: any) => e.scope === 'lib_push_up').decision = 'D-SHIP-W1-STAMP';
    expect(stampedProblems(w1)).toEqual(['lib_push_up: decision D-SHIP-W1-STAMP, ruled D-SHIP-W2-STAMP']);
    expect(stampedProblems(es, [...SHIPPED, 'lib_burpee'])).toEqual(['lib_burpee: shipped, not ruled']);   // LIB-SHIP W8a: crunch is ruled now; the held mountain_climbers; LIB-SHIP W10: mountain_climbers ships, the held burpee
    // LIB-SHIP W8b reds: a held W8b id stamped or shipped; a W8b stamp's approval at another sha or naming another comment
    expect(stampedProblems([...es, { ...es[es.length - 1], scope: 'lib_incline_dumbbell_curl' }])).toEqual(['lib_incline_dumbbell_curl: stamped, not ruled']);
    // LIB-SHIP W8c: dumbbell_shrug is ruled now (W8c), so the held W8b id here is step_up
    expect(stampedProblems(es, [...SHIPPED, 'lib_step_up'])).toEqual(['lib_step_up: shipped, not ruled']);
    // LIB-SHIP W8c reds: a held W8c id stamped or shipped; a W8c stamp's approval at another sha, naming another comment, or another W8c id's
    // LIB-SHIP W10: W8c's held underhand and mountain_climbers ship now (W10), so the held id here is W10's weighted_dip
    expect(stampedProblems([...es, { ...es[es.length - 1], scope: 'lib_weighted_dip' }])).toEqual(['lib_weighted_dip: stamped, not ruled']);
    // LIB-SHIP W9: bulgarian_split_squat ships now (W9), so the held W8c id here is mountain_climbers (still held, W9 S4); LIB-SHIP W10: weighted_dip
    expect(stampedProblems(es, [...SHIPPED, 'lib_weighted_dip'])).toEqual(['lib_weighted_dip: shipped, not ruled']);
    const w8cApproval = (entries: any[]) => entries.filter((e: any) => W8C_STAMPED.includes(e.scope))
      .flatMap((e: any) => (e.decision === W8C_RULE[e.scope]![0] && e.approval === W8C_RULE[e.scope]![1] ? [] : [`${e.scope}: approval ${e.approval}`]));
    expect(w8cApproval(es)).toEqual([]);
    const c1 = clone(es); c1.find((e: any) => e.scope === 'lib_seated_leg_curl').approval = W8C_RULE.lib_seated_leg_curl![1]!.replace(/[0-9a-f]{40}$/, '0523227e3db7e273930d4acf1a31c6b9d073fe1d');
    expect(w8cApproval(c1)).toHaveLength(1);
    const c2 = clone(es); c2.find((e: any) => e.scope === 'lib_assisted_pull_up').approval = W8C_RULE.lib_assisted_pull_up![1]!.replace('6895226756', '6895200917');
    expect(w8cApproval(c2)).toHaveLength(1);
    const c3 = clone(es); c3.find((e: any) => e.scope === 'lib_dumbbell_shrug').approval = W8C_RULE.lib_seated_leg_curl![1];
    expect(w8cApproval(c3)).toHaveLength(1);
    // LIB-SHIP W9 reds: each held W9 id stamped or shipped; a W9 stamp's approval at another sha, naming another comment, or
    // another W9 id's; a W9 stamp under the W8c decision; a W9 stamp removed
    for (const id of W9_HELD.filter(i => !W10_IDS.includes(i))) {   // LIB-SHIP W10: less underhand and mountain_climbers, which W10 ships
      expect(stampedProblems([...es, { ...es[es.length - 1], scope: id }])).toEqual([`${id}: stamped, not ruled`]);
      expect(stampedProblems(es, [...SHIPPED, id])).toEqual([`${id}: shipped, not ruled`]);
    }
    const w9Approval = (entries: any[]) => entries.filter((e: any) => W9_STAMPED.includes(e.scope))
      .flatMap((e: any) => (e.decision === W9_RULE[e.scope]![0] && e.approval === W9_RULE[e.scope]![1] ? [] : [`${e.scope}: approval ${e.approval}`]));
    expect(w9Approval(es)).toEqual([]);
    expect(es.filter((e: any) => W9_STAMPED.includes(e.scope)).map((e: any) => e.scope)).toEqual(W9_STAMPED);
    const d1 = clone(es); d1.find((e: any) => e.scope === 'lib_barbell_bench_press').approval = W9_RULE.lib_barbell_bench_press![1]!.replace(/[0-9a-f]{40}$/, '134c668be3e7d9682b46e66933832f419edba413');
    expect(w9Approval(d1)).toEqual([`lib_barbell_bench_press: approval ${d1.find((e: any) => e.scope === 'lib_barbell_bench_press').approval}`]);
    const d2 = clone(es); d2.find((e: any) => e.scope === 'lib_hip_adduction').approval = W9_RULE.lib_hip_adduction![1]!.replace('6851987591', '6853178277');
    expect(w9Approval(d2)).toHaveLength(1);
    const d3 = clone(es); d3.find((e: any) => e.scope === 'lib_cable_curl').approval = W9_RULE.lib_wall_ball![1];
    expect(w9Approval(d3)).toHaveLength(1);
    const d4 = clone(es); d4.find((e: any) => e.scope === 'lib_conventional_deadlift').decision = 'D-SHIP-W8C-STAMP';
    expect(w9Approval(d4)).toHaveLength(1);
    expect(stampedProblems(d4)).toEqual(['lib_conventional_deadlift: decision D-SHIP-W8C-STAMP, ruled D-SHIP-W9-STAMP']);
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_side_plank'))).toEqual(['lib_side_plank: ruled, not stamped']);
    // LIB-SHIP W10 reds: each held W10 id stamped or shipped; a W10 stamp's approval at another sha, naming another comment;
    // a W10 stamp under the W9 decision; a W10 stamp removed
    for (const id of W10_HELD) {
      expect(stampedProblems([...es, { ...es[es.length - 1], scope: id }])).toEqual([`${id}: stamped, not ruled`]);
      expect(stampedProblems(es, [...SHIPPED, id])).toEqual([`${id}: shipped, not ruled`]);
    }
    const w10Approval = (entries: any[]) => entries.filter((e: any) => W10_STAMPED.includes(e.scope))
      .flatMap((e: any) => (e.decision === W10_RULE[0] && e.approval === W10_RULE[1] ? [] : [`${e.scope}: approval ${e.approval}`]));
    expect(w10Approval(es)).toEqual([]);
    expect(es.filter((e: any) => W10_STAMPED.includes(e.scope)).map((e: any) => e.scope)).toEqual(W10_STAMPED);
    const e1 = clone(es); e1.find((e: any) => e.scope === 'lib_jump_squat').approval = W10_RULE[1]!.replace(/[0-9a-f]{40}$/, 'e34ffd8b3ae8d11d4b628183de5b8dcbddc75721');
    expect(w10Approval(e1)).toHaveLength(1);
    const e2 = clone(es); e2.find((e: any) => e.scope === 'lib_mountain_climbers').approval = W10_RULE[1]!.replace('6923360626', '6923406051');
    expect(w10Approval(e2)).toHaveLength(1);
    const e3 = clone(es); e3.find((e: any) => e.scope === 'lib_hip_abduction').decision = 'D-SHIP-W9-STAMP';
    expect(stampedProblems(e3)).toEqual(['lib_hip_abduction: decision D-SHIP-W9-STAMP, ruled D-SHIP-W10-STAMP']);
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_jump_squat'))).toEqual(['lib_jump_squat: ruled, not stamped']);
    /** Each W8b stamp's approval against its ruling, exactly (the W8a review's M4 gap). */
    const w8bApproval = (entries: any[]) => entries.filter((e: any) => W8B_STAMPED.includes(e.scope))
      .flatMap((e: any) => (e.approval === RULING[e.scope]![0]![1] ? [] : [`${e.scope}: approval ${e.approval}`]));
    expect(w8bApproval(es)).toEqual([]);
    const b1 = clone(es); b1.find((e: any) => e.scope === 'lib_wall_sit').approval = W8B_PANEL[1]!.replace(/[0-9a-f]{40}$/, '1f53a5551277ae8fbc111984d1b5e63b90b2b652');
    expect(w8bApproval(b1)).toHaveLength(1);
    const b2 = clone(es); b2.find((e: any) => e.scope === 'lib_dumbbell_pullover').approval = W8B_RULED[1]!.replace('6856468001', '6856272493');
    expect(w8bApproval(b2)).toHaveLength(1);
    // D-W8B-RDLWATCH reds: RDL's stamp still naming the panel; naming the ruling at another sha
    const b3 = clone(es); b3.find((e: any) => e.scope === 'lib_dumbbell_romanian_deadlift').approval = W8B_PANEL[1];
    expect(w8bApproval(b3)).toHaveLength(1);
    const b4 = clone(es); b4.find((e: any) => e.scope === 'lib_dumbbell_romanian_deadlift').approval = W8B_RDLWATCH[1]!.replace(/[0-9a-f]{40}$/, '1f53a5551277ae8fbc111984d1b5e63b90b2b652');
    expect(w8bApproval(b4)).toHaveLength(1);
    // LIB-SHIP W3 A9 reds: a W3 id's stamp removed; a W3 id under the W2 ruling; a held W3-lane id shipped unruled
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_chin_up'))).toEqual(['lib_chin_up: ruled, not stamped']);
    const w2 = clone(es); w2.find((e: any) => e.scope === 'lib_horizontal_leg_press').decision = 'D-SHIP-W2-STAMP';
    expect(stampedProblems(w2)).toEqual(['lib_horizontal_leg_press: decision D-SHIP-W2-STAMP, ruled D-SHIP-W3-STAMP']);
    expect(stampedProblems(es, [...SHIPPED, 'lib_shoulder_press'])).toEqual(['lib_shoulder_press: shipped, not ruled']);
    // LIB-PLATEFIX-1 A9: a PLATEFIX id's stamp removed; a re-stamp removed; a PLATEFIX id under the W2 ruling; a third stamp
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_reverse_lunge'))).toEqual(['lib_reverse_lunge: ruled, not stamped']);
    const noRe = es.filter((e: any) => !(e.scope === 'lib_cable_fly' && e.decision === 'D-PLATEFIX-STAMP'));
    expect(stampedProblems(noRe)).toEqual(['lib_cable_fly: ruled 2 stamps, has 1']);
    const pfW2 = clone(es); pfW2.find((e: any) => e.scope === 'lib_triceps_pushdown').decision = 'D-SHIP-W2-STAMP';
    expect(stampedProblems(pfW2)).toEqual(['lib_triceps_pushdown: decision D-SHIP-W2-STAMP, ruled D-PLATEFIX-STAMP']);
    expect(stampedProblems([...es, { ...es.filter((e: any) => e.scope === 'lib_cable_fly').at(-1) }])).toEqual(['lib_cable_fly: stamped again, not ruled']);   // merge of main 7e060e83: cable_fly's re-stamp named (W4's 6, then W5's 10, then W6's 7, then W7's 16, now end the list)
    // the re-stamp's order matters: the PLATEFIX stamp before the W2 one is red
    const swapped = clone(es), a = swapped.findIndex((e: any) => e.scope === 'lib_barbell_row'), b = swapped.map((e: any) => e.scope).lastIndexOf('lib_barbell_row');
    [swapped[a], swapped[b]] = [swapped[b], swapped[a]];
    expect(stampedProblems(swapped)).toEqual(['lib_barbell_row: decision D-PLATEFIX-STAMP, ruled D-SHIP-W2-STAMP', 'lib_barbell_row: decision D-SHIP-W2-STAMP, ruled D-PLATEFIX-STAMP']);
    // LIB-SHIP W5 A9 reds (D-SHIP-W5-STAMP, ruling 3): a W5 id's stamp removed; a W5 id under the W3 ruling; a held W5 id
    // (goblet_squat, approved-plate) shipped unruled; a ruled W5 id stamped twice
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_preacher_curl'))).toEqual(['lib_preacher_curl: ruled, not stamped']);
    const w3 = clone(es); w3.find((e: any) => e.scope === 'lib_front_squat').decision = 'D-SHIP-W3-STAMP';
    expect(stampedProblems(w3)).toEqual(['lib_front_squat: decision D-SHIP-W3-STAMP, ruled D-SHIP-W5-STAMP']);
    expect(stampedProblems(es, [...SHIPPED, 'lib_goblet_squat'])).toEqual(['lib_goblet_squat: shipped, not ruled']);
    expect(stampedProblems([...es, clone(es.find((e: any) => e.scope === 'lib_hammer_curl'))])).toEqual(['lib_hammer_curl: stamped again, not ruled']);
    // LIB-SHIP W7 A9 reds (D-SHIP-W7-STAMP, ruling 3): a W7 id's stamp removed; a W7 id under the W5 ruling; a held W7 id
    // (v_up, approved-plate) shipped unruled; a ruled W7 id stamped twice
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_kettlebell_swing'))).toEqual(['lib_kettlebell_swing: ruled, not stamped']);
    // D-SHIP-W7-SLEDHOLD (#394 SHIP W7 QUESTION 4 option 1; follow-up F-SLEDPULL-S0): sled_pull shipped (unruled, unstamped) is red
    expect(stampedProblems(es, [...SHIPPED, 'lib_sled_pull'])).toEqual(['lib_sled_pull: shipped, not ruled']);
    // D-SHIP-W7-HOLD2 (#394 6753333493): glute_bridge shipped (unruled, its stamp removed) is red
    expect(stampedProblems(es, [...SHIPPED, 'lib_glute_bridge'])).toEqual(['lib_glute_bridge: shipped, not ruled']);
    expect(stampedProblems(es, [...SHIPPED, 'lib_high_knees'])).toEqual(['lib_high_knees: shipped, not ruled']);   // D-SHIP-W7-HOLD2: high_knees too
    const w5 = clone(es); w5.find((e: any) => e.scope === 'lib_bird_dog').decision = 'D-SHIP-W5-STAMP';
    expect(stampedProblems(w5)).toEqual(['lib_bird_dog: decision D-SHIP-W5-STAMP, ruled D-SHIP-W7-STAMP']);
    expect(stampedProblems(es, [...SHIPPED, 'lib_v_up'])).toEqual(['lib_v_up: shipped, not ruled']);
    expect(stampedProblems([...es, clone(es.find((e: any) => e.scope === 'lib_farmer_s_carry'))])).toEqual(['lib_farmer_s_carry: stamped again, not ruled']);
    // LIB-SHIP W4: a W4 stamp removed, a waiting W4 id stamped, and a W4 id under the W2 ruling are red
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_cable_shrug'))).toEqual(['lib_cable_shrug: ruled, not stamped']);
    // LIB-SHIP W8c: dumbbell_shrug ships now, so the waiting W4 id here is conventional_deadlift (still held, F-DL-LIFTOFF)
    // LIB-SHIP W9: conventional_deadlift ships now (W9), so the waiting W4 id here is one_arm_dumbbell_row (still held)
    expect(stampedProblems([...es, { ...es[es.length - 1], scope: 'lib_one_arm_dumbbell_row' }])).toEqual(['lib_one_arm_dumbbell_row: stamped, not ruled']);
    const w2b = clone(es); w2b.find((e: any) => e.scope === 'lib_t_bar_row').decision = 'D-SHIP-W2-STAMP';
    expect(stampedProblems(w2b)).toEqual(['lib_t_bar_row: decision D-SHIP-W2-STAMP, ruled D-SHIP-W4-FLIPSET']);
    // LIB-SHIP W6 A9 reds (#393 6689822595 / 6701002884): a W6 id's stamp removed; a W6 id under the W3 ruling; an unruled
    // id stamped; a held W6 id (approved-plate in lb06/lb07) shipped or stamped
    expect(stampedProblems(es.filter((e: any) => e.scope !== 'lib_face_pull'))).toEqual(['lib_face_pull: ruled, not stamped']);
    const w3w6 = clone(es); w3w6.find((e: any) => e.scope === 'lib_pike_push_up').decision = 'D-SHIP-W3-STAMP';   // merge of main de91dd21: renamed from w3 (W5's red holds w3)
    expect(stampedProblems(w3w6)).toEqual(['lib_pike_push_up: decision D-SHIP-W3-STAMP, ruled D-SHIP-W6-STAMP']);
    // LIB-SHIP W10: hip_abduction ships now (W10), so the held W6 id here is rear_delt_fly (still held)
    expect(stampedProblems(es, [...SHIPPED, 'lib_rear_delt_fly'])).toEqual(['lib_rear_delt_fly: shipped, not ruled']);
    expect(stampedProblems([...es, { ...es[es.length - 1], scope: 'lib_weighted_dip' }])).toEqual(['lib_weighted_dip: stamped, not ruled']);
  });
  it('mutations, each red: \'owner\'; approvedBy missing; open: 1', () => {
    const e = reviews().entries[0], { approvedBy: _a, ...noBy } = e;
    expect(entryProblems([{ ...e, approvedBy: 'owner' }])).toEqual([`${e.scope}: approvedBy "owner"`]);
    expect(entryProblems([noBy])).toEqual([`${e.scope}: approvedBy undefined`]);
    expect(entryProblems([{ ...e, open: 1 }])).toEqual([`${e.scope}: open 1`]);
    expect(entryProblems([{ ...e, approvedBy: 'stamps (O5)' }])).toHaveLength(1);
  });
});

describe('LIB-5 Do 6: the stamp gate in E1\'s tree (D-LIB5-SCRATCH 3, 7; S8)', () => {
  const T = 900_000;
  let F: any, tree: string;
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    tree = await (await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/tree.mjs'))).fixtureTreeAsync(); temps.push(tree);
  }, T);
  /** `node tools/plates/generate.mjs` in `cwd`; resolves { code, out }. */
  const gen = (cwd: string) => new Promise<{ code: number; out: string }>(resolve => {
    const c = spawn(process.execPath, ['tools/plates/generate.mjs'], { cwd, env: Object.fromEntries(Object.entries(process.env).filter(([k]) => k !== 'NODE_ENV' && !k.startsWith('VITEST') && k !== 'TEST')) });
    let out = '';
    c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
    c.on('close', code => resolve({ code: code ?? 1, out }));
  });
  const copy = (edit: (r: string) => void) => { const r = mkdtempSync(join(tmpdir(), 'lib5-stamp-')); temps.push(r); cpSync(tree, r, { recursive: true, verbatimSymlinks: true }); edit(r); return r; };
  const REV = 'docs/research/howto/reviews.json';
  const rev = (r: string) => JSON.parse(readFileSync(join(r, REV), 'utf8'));
  it('fixtureTree() marks the tree and writes one scratch stamp for E1, and generate passes the gate', async () => {
    expect(existsSync(join(tree, S.SCRATCH_MARKER))).toBe(true);
    expect(rev(tree).entries.filter((e: any) => e.scratch).map((e: any) => e.scope)).toEqual([F.ID]);
    const g = await gen(tree);
    expect([g.code, g.out.slice(-300)]).toEqual([0, expect.stringContaining('generate: wrote')]);
  }, T);
  it('mutations, each red: entries emptied (every shipped id named, while checkC15 passes the empty file); marker removed; E1\'s stamp dropped', async () => {
    // one generator at a time: three full generator runs at once, beside the other suites, overload the runner
    const emptied = await gen(copy(r => writeFileSync(join(r, REV), '{ "schema": 1, "entries": [] }\n')));
    const unmarked = await gen(copy(r => rmSync(join(r, S.SCRATCH_MARKER))));
    const dropped = await gen(copy(r => { const v = rev(r); v.entries = v.entries.filter((e: any) => !e.scratch); writeFileSync(join(r, REV), JSON.stringify(v)); }));
    expect(emptied.code).not.toBe(0);
    for (const id of [...EIGHT, F.ID]) expect([id, emptied.out]).toEqual([id, expect.stringContaining(`LIB-5 stamp: ${id}: reviews.json is missing, unparsable or empty`)]);
    const { content: c } = await content.loadContent('lib_pull_up');
    expect(checkC15(c, fragmentsOf8('lib_pull_up'), { schema: 1, entries: [] })).toEqual([]);
    for (const x of [unmarked, dropped]) {
      expect(x.code).not.toBe(0);
      expect(x.out).toContain(`LIB-5 stamp: ${F.ID}: no reviews.json entry for scope ${F.ID}`);
      for (const id of EIGHT) expect(x.out).not.toContain(`LIB-5 stamp: ${id}:`);
    }
  }, T);
  it('LIB-4a: writeIds(ROOT, 22) passes, and its synthetic copy holds no reviews.json (the gate is never reached from ids.mjs)', async () => {
    // In a child process: writeIds copies src/ and tools/plates synchronously, which would block this worker's RPC.
    const code = `import { existsSync } from 'node:fs'; import { join } from 'node:path';
const { writeIds } = await import(${JSON.stringify(url('tools/plates/library/scale/write-ids.mjs'))});
const o = await writeIds(${JSON.stringify(ROOT)}, 22);
console.log('@@' + JSON.stringify({ root: o.root, reviews: existsSync(join(o.root, ${JSON.stringify(REV)})) }));`;
    const r = await new Promise<{ code: number; out: string }>(resolve => {
      const c = spawn(process.execPath, ['--input-type=module', '-e', code], { cwd: ROOT });
      let out = '';
      c.stdout.on('data', d => { out += d; }); c.stderr.on('data', d => { out += d; });
      c.on('close', k => resolve({ code: k ?? 1, out }));
    });
    const line = r.out.split('\n').find(l => l.startsWith('@@'));
    expect([r.code, Boolean(line)]).toEqual([0, true]);
    const got = JSON.parse(line!.slice(2));
    temps.push(got.root);
    expect(got.reviews).toBe(false);
  }, T);
});
