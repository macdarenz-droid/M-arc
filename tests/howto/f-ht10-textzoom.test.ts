// F-HT10-TEXTZOOM (card docs/supervisor/verify/f-w8a-holds-card.md, part 2): HT10-A1's floor is max(15, E), E counted
// on the row's own judged layers card; only a ruled text-zoom row (text-zooms.json, checked by textZoomRow) may go
// below 15, and only to its own E. Browser-free: the counting runs on a fake DOM (project convention: no jsdom); the
// live counts and the measured steps come from CI's "HT10 steps" lines.
import { describe, expect, it } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
// @ts-expect-error plain .mjs build tool, no types
import { HT10_FLOOR, ht10Expected, ht10Floor, ht10Ruled, ht10TermsOfDoc } from '../../tools/plates/library/fidelity.mjs';

type Terms = { callouts: number; tells: number; wrist: number; chips: number[]; shows: number; feel: number; more: number; rows: number };
const ROOT = join(__dirname, '../..');

/** A fake card: querySelectorAll answers from a selector map; chips carry dataset.zoom. */
const fakeCard = (id: string, t: Terms) => {
  const many = (k: number, x: object = {}) => Array.from({ length: k }, () => ({ ...x }));
  const chipKeys = t.chips.map((_, i) => `z${i}`);
  const map: Record<string, object[]> = {
    'figure[data-mode="normal"] .plate-callout': many(t.callouts), 'figure[data-mode="mistake"] .plate-callout': many(t.tells),
    '.zx-chip[data-zoom]': chipKeys.map(k => ({ dataset: { zoom: k } })), '.st-show': many(t.shows), '.zx-chip[data-feel]': many(t.feel),
    '.fr-more': many(t.more), '.fr-btn': many(t.rows), [`#${id}-also-hand`]: many(t.wrist),
  };
  t.chips.forEach((p, i) => { map[`.zx[data-zoom="${chipKeys[i]}"] .zx-page`] = many(p); });
  return { querySelectorAll: (s: string) => map[s] ?? [], querySelector: (s: string) => (map[s] ?? [])[0] ?? null };
};
const fakeDoc = (cards: Record<string, Terms>) => ({ getElementById: (x: string) => { const id = x.replace(/^card-/, ''); return cards[id] ? fakeCard(id, cards[id]) : null; } });

// Every term non-zero, so a dropped term changes E.
const FULL: Terms = { callouts: 3, tells: 2, wrist: 1, chips: [1, 3], shows: 2, feel: 1, more: 1, rows: 4 };
// callouts 3 + Mistake on 1 + tells 2 + wrist 2 + Mistake off 1 + Trace 2 + chips (2 + 4) + shows 4 + feel 1 + more 1 + rows 4 + end 2
// The E table rows: { <lib id>: { terms, steps } }. 64 shipped rows from CI's "HT10 steps" silent-black lines, run
// 43394777552 @ ad5b66e9 (all 64 also E = steps in the other 4 themes); lib_seated_leg_curl from the scratch tree
// (1dd1cd39 + this file's fidelity.mjs, pilot-b.layers d8230e88…, 14 steps in all 5 themes).
const E_TABLE: Record<string, { terms: Terms; steps: number }> = {
  lib_ab_wheel_rollout: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 16 },
  lib_alternating_dumbbell_curl: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [2, 1], shows: 4, feel: 1, more: 0, rows: 1 }, steps: 25 },
  lib_barbell_curl: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [2, 1], shows: 3, feel: 1, more: 0, rows: 2 }, steps: 24 },
  lib_barbell_overhead_press: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 2 }, steps: 20 },
  lib_barbell_row: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_barbell_shrug: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 17 },
  lib_bear_crawl: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_bird_dog: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 3, feel: 1, more: 0, rows: 1 }, steps: 23 },
  lib_bodyweight_lunge: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 20 },
  lib_bodyweight_split_squat: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_bodyweight_squat: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 18 },
  lib_cable_crunch: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 3 }, steps: 18 },
  lib_cable_fly: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_cable_kickback: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 16 },
  lib_cable_lateral_raise: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 3 }, steps: 21 },
  lib_cable_shrug: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 18 },
  lib_chest_supported_row: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 2, feel: 1, more: 0, rows: 2 }, steps: 22 },
  lib_chin_up: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1, 1], shows: 4, feel: 1, more: 0, rows: 3 }, steps: 29 },
  lib_close_grip_pulldown: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1, 1], shows: 3, feel: 1, more: 0, rows: 2 }, steps: 26 },
  lib_crunch: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 3 }, steps: 21 },
  lib_dead_bug: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 19 },
  lib_dumbbell_bench_press: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_dumbbell_biceps_curl: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [2, 1], shows: 3, feel: 1, more: 0, rows: 2 }, steps: 25 },
  lib_dumbbell_front_raise: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 3, feel: 1, more: 0, rows: 2 }, steps: 24 },
  lib_dumbbell_shoulder_press: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_ez_bar_curl: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [2, 1], shows: 3, feel: 1, more: 0, rows: 2 }, steps: 24 },
  lib_face_pull: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 2, feel: 1, more: 0, rows: 2 }, steps: 22 },
  lib_farmer_s_carry: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 19 },
  lib_front_squat: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 4 }, steps: 22 },
  lib_hammer_curl: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 18 },
  lib_hanging_knee_raise: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1, 1], shows: 4, feel: 1, more: 0, rows: 4 }, steps: 30 },
  lib_hollow_body_hold: { terms: { callouts: 2, tells: 1, wrist: 0, chips: [1, 1], shows: 2, feel: 1, more: 0, rows: 3 }, steps: 21 },
  lib_horizontal_leg_press: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 3 }, steps: 18 },
  lib_incline_push_up: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 5, feel: 1, more: 0, rows: 3 }, steps: 29 },
  lib_inverted_row: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1, 1], shows: 4, feel: 1, more: 0, rows: 1 }, steps: 26 },
  lib_kettlebell_swing: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 3 }, steps: 21 },
  lib_landmine_row: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 2 }, steps: 20 },
  lib_leg_extension: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 0, feel: 1, more: 0, rows: 2 }, steps: 16 },
  lib_lying_leg_curl: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 0, feel: 1, more: 0, rows: 2 }, steps: 15 },
  lib_machine_crunch: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1, 1], shows: 2, feel: 1, more: 0, rows: 2 }, steps: 24 },
  lib_machine_lateral_raise: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 16 },
  lib_medicine_ball_slam: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 0, feel: 1, more: 0, rows: 1 }, steps: 17 },
  lib_pec_fly: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 17 },
  lib_pendlay_row: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 3, feel: 1, more: 0, rows: 1 }, steps: 23 },
  lib_pike_push_up: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 2, feel: 1, more: 0, rows: 3 }, steps: 22 },
  lib_plank: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 18 },
  lib_preacher_curl: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [2, 1], shows: 3, feel: 1, more: 0, rows: 3 }, steps: 26 },
  lib_push_up: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 4, feel: 1, more: 0, rows: 1 }, steps: 25 },
  lib_resistance_band_row: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_resisted_hip_flexion: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 17 },
  lib_reverse_crunch: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 2, feel: 1, more: 0, rows: 3 }, steps: 22 },
  lib_reverse_curl: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [2, 1], shows: 3, feel: 1, more: 0, rows: 2 }, steps: 24 },
  lib_reverse_lunge: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 20 },
  lib_romanian_deadlift: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 19 },
  lib_rope_triceps_pushdown: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 3 }, steps: 20 },
  lib_seated_leg_curl: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [], shows: 0, feel: 1, more: 0, rows: 2 }, steps: 14 },
  lib_single_arm_lat_pulldown: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_single_leg_romanian_deadlift: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 21 },
  lib_sled_push: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_smith_machine_shrug: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 1 }, steps: 17 },
  lib_standing_leg_curl: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1, 1], shows: 0, feel: 1, more: 0, rows: 2 }, steps: 17 },
  lib_straight_arm_pulldown: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1, 1], shows: 3, feel: 1, more: 0, rows: 3 }, steps: 25 },
  lib_t_bar_row: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 1 }, steps: 19 },
  lib_triceps_pushdown: { terms: { callouts: 3, tells: 2, wrist: 0, chips: [1], shows: 2, feel: 1, more: 0, rows: 3 }, steps: 21 },
  lib_upright_row: { terms: { callouts: 3, tells: 1, wrist: 0, chips: [1], shows: 1, feel: 1, more: 0, rows: 2 }, steps: 17 },
};
const FULL_E = 3 + 1 + 2 + 2 + 1 + 2 + (2 + 4) + 4 + 1 + 1 + 4 + 2;

describe('F-HT10-TEXTZOOM E: the exact ht10Script step count', () => {
  it('E of a card with every term', () => expect(ht10Expected(FULL)).toBe(FULL_E));
  it('each term moves E by its weight (m4: a dropped term is red)', () => {
    const plus = (k: keyof Terms, v: number | number[]) => ht10Expected({ ...FULL, [k]: v }) - FULL_E;
    expect(plus('callouts', 4)).toBe(1);
    expect(plus('tells', 3)).toBe(1);
    expect(plus('wrist', 0)).toBe(-2);
    expect(plus('chips', [1, 3, 1])).toBe(2);     // a one-page chip: open and closed
    expect(plus('chips', [1, 3, 2])).toBe(3);     // a two-page chip: open, page 1, closed
    expect(plus('shows', 3)).toBe(2);
    expect(plus('feel', 0)).toBe(-1);
    expect(plus('more', 0)).toBe(-1);
    expect(plus('rows', 5)).toBe(1);
  });
  // The E table (B2): terms read from each shipped row's judged layers card and the steps probed, from CI's
  // "HT10 steps" lines (silent-black). E must equal the measured steps on every row.
  const TABLE: Record<string, { terms: Terms; steps: number }> = E_TABLE;
  it('the E table: E = measured on every shipped row, and seated_leg_curl on its scratch page', () => {
    expect(Object.keys(TABLE).length).toBe(65);
    expect(TABLE.lib_seated_leg_curl?.steps).toBe(14);
    const off = Object.entries(TABLE).filter(([, r]) => ht10Expected(r.terms) !== r.steps).map(([id, r]) => `${id}: E ${ht10Expected(r.terms)} != ${r.steps}`);
    expect(off).toEqual([]);
  });
  it('the terms come from each row\'s own card (m5), and a missing card is null', () => {
    const other: Terms = { ...FULL, callouts: 2, shows: 0, chips: [1] };
    const t = ht10TermsOfDoc(fakeDoc({ a: FULL, b: other }), ['a', 'b', 'c']);
    expect(t).toEqual({ a: FULL, b: other, c: null });
  });
});

describe('F-HT10-TEXTZOOM floor: max(15, E), a ruled text-zoom row its own E', () => {
  it('a row not ruled keeps at least 15 (m1)', () => {
    expect(HT10_FLOOR).toBe(15);
    expect(ht10Floor(14, false)).toBe(15);
    expect(ht10Floor(15, false)).toBe(15);
    expect(ht10Floor(23, false)).toBe(23);
  });
  it('a ruled text-zoom row is held to its own E (m2: E - 1 is red)', () => {
    expect(ht10Floor(14, true)).toBe(14);
    const pass = (steps: number, E: number, ruled: boolean) => steps >= ht10Floor(E, ruled);
    expect(pass(14, 14, true)).toBe(true);
    expect(pass(13, 14, true)).toBe(false);
    expect(pass(14, 14, false)).toBe(false);
    expect(pass(22, 23, false)).toBe(false);
  });
  it('ruled only through textZoomRow: listed rows on main pass, unlisted rows and shipped rows do not', async () => {
    expect(await ht10Ruled(ROOT, 'lib_machine_pullover')).toBe(true);
    expect(await ht10Ruled(ROOT, 'lib_smith_machine_shoulder_press')).toBe(true);
    expect(await ht10Ruled(ROOT, 'lib_push_up')).toBe(false);
    expect(await ht10Ruled(ROOT, 'lib_seated_leg_curl')).toBe(false);
  });
  it('an entry that fails textZoomRow keeps max(15, E) (m3)', async () => {
    const tmp = mkdtempSync(join(tmpdir(), 'f-ht10-'));
    try {
      const list = JSON.parse(readFileSync(join(ROOT, 'tools/plates/library/text-zooms.json'), 'utf8'));
      const write = (entries: object) => writeFileSync(join(tmp, 'tools/plates/library/text-zooms.json'), JSON.stringify({ ...list, entries }));
      mkdirSync(join(tmp, 'tools/plates/library/howto'), { recursive: true });
      for (const id of ['lib_machine_pullover', 'lib_push_up']) {
        const sheet = `tools/plates/library/howto/${id}.howto.mjs`;
        writeFileSync(join(tmp, sheet), `export { default } from ${JSON.stringify(join(ROOT, sheet))};\n`);
        const card = (await import(join(ROOT, sheet))).default.research.card;
        mkdirSync(join(tmp, card, '..'), { recursive: true });
        writeFileSync(join(tmp, card), readFileSync(join(ROOT, card)));
      }
      write(list.entries);
      expect(await ht10Ruled(tmp, 'lib_machine_pullover')).toBe(true);
      // a ruling not in TEXT_ZOOM_RULINGS
      write({ ...list.entries, lib_machine_pullover: { ...list.entries.lib_machine_pullover, ruling: 'D-NOT-A-RULING' } });
      expect(await ht10Ruled(tmp, 'lib_machine_pullover')).toBe(false);
      // a checkpoint the sheet does not hold
      write({ ...list.entries, lib_machine_pullover: { ...list.entries.lib_machine_pullover, checkpoints: { 'pullover-pivot': 'nope' } } });
      expect(await ht10Ruled(tmp, 'lib_machine_pullover')).toBe(false);
      // a row with drawn posture zooms that the list names
      write({ ...list.entries, lib_push_up: list.entries.lib_machine_pullover });
      expect(await ht10Ruled(tmp, 'lib_push_up')).toBe(false);
    } finally { rmSync(tmp, { recursive: true, force: true }); }
  });
});
