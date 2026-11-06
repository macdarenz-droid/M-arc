// RESEARCH-ROUTES-1 (research-routes-card.md; ruled #398 6648297602, D-RR-HEAD): part 1's card edits and the
// MANIFEST re-pin they need. The card bytes themselves are pinned by S1 (library-research.test.ts) and cards.sha.json.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(new URL('.', import.meta.url).pathname, '..', '..');
const rd = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const BOX = 'docs/research/howto/shared/back-pain-box.json';
const card = (id: string) => JSON.parse(rd(`docs/research/howto/cards/${id}.json`));

// lib-ship-card ruling 6 (D-SHIP-BACKBOX), copied from the ruling, never read from a card.
const ADDED = ['cable_chest_press', 'smith_machine_shoulder_press', 'single_arm_triceps_pushdown', 'leg_extension',
  'lying_leg_curl', 'standing_leg_curl', 'hack_squat', 'glute_bridge', 'cable_kickback', 'cable_crunch', 'reverse_crunch',
  'dead_bug', 'sled_push', 'farmer_s_carry', 'kettlebell_swing', 'medicine_ball_slam', 'v_up', 'hollow_body_hold',
  'bird_dog', 'superman', 'resistance_band_pull_apart'];

describe('RESEARCH-ROUTES-1 P1-a: the back box applies to the 21 back-linked ids (ruling 6)', () => {
  const box = JSON.parse(rd(BOX));
  it('appliesTo is 56 sorted, unique ids and holds all 21; each of the 21 cards links redFlag back', () => {
    expect(box.appliesTo).toHaveLength(56);
    expect([...box.appliesTo].sort()).toEqual(box.appliesTo);
    expect(new Set(box.appliesTo).size).toBe(56);
    for (const id of ADDED) {
      expect(box.appliesTo, id).toContain(id);
      expect(JSON.stringify(card(id).redFlags), id).toContain('"back"');
    }
  });
  const missing = (a: string[]) => ADDED.filter(id => !a.includes(id));
  it('mutation: one of the 21 removed is red; main\'s 35 lack all 21', () => {
    expect(missing(box.appliesTo)).toEqual([]);
    expect(missing(box.appliesTo.filter((x: string) => x !== 'superman'))).toEqual(['superman']);
    expect(missing(box.appliesTo.filter((x: string) => !ADDED.includes(x)))).toEqual(ADDED);
  });
});

describe('RESEARCH-ROUTES-1 P1-b/P1-c: the ruled fields left inherit[] (F-W4-INHERIT, F-CARD-FRONTSQ-SETUP)', () => {
  const GONE: Record<string, string[]> = {
    cable_shrug: ['grip.wrist', 'grip.width'],
    dumbbell_shrug: ['grip.wrist'],
    sumo_deadlift: ['plate.equipment (bar on the floor with full-size plates, parent c23)'],
    front_squat: ['setup[2] (load the plates evenly, collars on)'],
  };
  const fields = (c: any): string[] => c.inherit.map((e: { field: string }) => e.field);
  const back = (cards: Record<string, any>) => Object.entries(GONE).flatMap(([id, f]) => f.filter(x => fields(cards[id]).includes(x)).map(x => `${id}: ${x}`));
  const now = () => Object.fromEntries(Object.keys(GONE).map(id => [id, card(id)]));
  it('no ruled field is in its card\'s inherit[]', () => {
    expect(back(now())).toEqual([]);
  });
  it('mutation: a ruled field put back is red', () => {
    const f = 'setup[2] (load the plates evenly, collars on)', c = now(); c.front_squat.inherit.unshift({ field: f, why: 'x' });
    expect(back(c)).toEqual([`front_squat: ${f}`]);
  });
});

// The D-CROP-PIN form (#380 6627881461): MANIFEST.json pins back-pain-box.json in 16 rows (13 before main e623d3ef), so this lane re-pins exactly
// that one key; every other entry equals main e623d3ef.
describe('RESEARCH-ROUTES-1: the library MANIFEST re-pin moves only back-pain-box.json', () => {
  const w3Read = (p: string) => rd(p);
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
    // D-SHIP-W3-LAYERSZOOM (#384 6686326673): build-layers-page.mjs applies applyZooms (the other MANIFEST tests blank its key themselves)
    'tools/plates/library/build-layers-page.mjs': '2d123a0121e145bfd2c3f2d366cfcfb93fd1b55087f96cea28b7a2cefbeea4fb',
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
  it('every row that lists it pins the current file, and every other entry equals main e623d3ef', () => {
    const m = lessW3(JSON.parse(rd('tools/plates/library/MANIFEST.json')));   // LIB-SHIP W3
    // LIB-SHIP W7 (PIN GO #394 6649092340): + the 29 W7 rows, each listing the box; taken out again by lessW7 before the sha
    const W7_ROWS = ['lib_hack_squat', 'lib_pendulum_squat', 'lib_leg_extension', 'lib_lying_leg_curl', 'lib_standing_leg_curl', 'lib_glute_bridge', 'lib_cable_kickback', 'lib_resisted_hip_flexion', 'lib_ab_wheel_rollout', 'lib_bird_dog', 'lib_side_plank', 'lib_superman', 'lib_cable_crunch', 'lib_hollow_body_hold', 'lib_reverse_crunch', 'lib_dead_bug', 'lib_v_up', 'lib_kettlebell_swing', 'lib_high_knees', 'lib_jump_rope', 'lib_battle_ropes', 'lib_sled_pull', 'lib_burpee', 'lib_bear_crawl', 'lib_sled_push', 'lib_medicine_ball_slam', 'lib_farmer_s_carry', 'lib_jumping_jacks', 'lib_wall_ball'];
    const rows = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => BOX in r.files);
    expect(rows).toHaveLength(16 + W7_ROWS.length);
    for (const r of rows) { expect(r.files[BOX]).toBe(sha(rd(BOX))); r.files[BOX] = 'X'; }
    for (const id of W7_ROWS) { expect(Object.keys(m.rows), id).toContain(id); delete m.rows[id]; }   // LIB-SHIP W7: taken out before main's checks
    // F-SCRATCH-SYNTH (#397, D-SCRATCH-SYNTH-KEYIDX) re-pins hands/pairs.mjs in its 22 rows: each pins the current file, blanked too
    const PAIRS = 'tools/plates/library/hands/pairs.mjs', pr = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => PAIRS in r.files);
    expect(pr).toHaveLength(22);
    for (const r of pr) { expect(r.files[PAIRS]).toBe(sha(rd(PAIRS))); r.files[PAIRS] = 'X'; }
    // main e623d3ef's MANIFEST.json with the same entries blanked (was f0ec7bd5… on main 8bb433bd, daf6779b… with BOX alone; re-measure if a later re-pin merges first)
    expect(sha(JSON.stringify(m))).toBe('a97a39e2402296337bf8c9947dc0b4e6d266d7732292caefbd0796fd5a49386f');
  });
});

// RESEARCH-ROUTES-1 part 2, F-CARD-INCLINEDB-RISK (#391 6653791551, 6681022221): the card's dropped-weights risk says
// no more than c15 (Kerr 2010: the most common mechanism of US emergency-department weight-training injuries).
describe('RESEARCH-ROUTES-1 F-CARD-INCLINEDB-RISK: incline_dumbbell_press risks[0]', () => {
  it('reads as the W4 sheet prints it and cites c15, c10; the old wider wording is gone', () => {
    const c = card('incline_dumbbell_press');
    expect(c.risks[0]).toEqual({ risk: 'In US hospital data, dropped weights are the top cause of lifting injuries. Have a spotter hold your wrists.', claim: ['c15', 'c10'] });
    const risks = c.risks.map((r: { risk: string }) => r.risk).join(' ');
    expect(risks).not.toContain('cause most bad lifting injuries');
    expect(risks).not.toContain('a leading cause of weight-training injuries');   // dropped c15's US-hospital scope (#403 6683127888)
  });
});

// RESEARCH-ROUTES-1 part 2, F-CARD-CONCCURL-RISK (#398 6648427172, ruled #403 6683127888): concentration_curl's risk and
// red flag, from StrengthLog's dumbbell-curl wrist line (sl-dbcurl); no elbow risk is sourced.
describe('RESEARCH-ROUTES-1 F-CARD-CONCCURL-RISK: concentration_curl risks and redFlags', () => {
  const Q = 'Keep your wrists straight during the movement. If they\u2019re bent, it can put an unnecessary load on them and lead to discomfort and maybe even injuries.';
  it('risks[0] cites c15, whose sl-dbcurl quote is in the quotes file; redFlags is wrist only', () => {
    const c = card('concentration_curl'), q = JSON.parse(rd('docs/research/howto/quotes/concentration_curl.json'));
    expect(c.risks).toEqual([{ risk: 'Bent wrists under load can cause wrist discomfort.', claim: 'c15' }]);
    expect(c.redFlags).toEqual(['wrist']);
    const c15 = c.claims.find((x: { id: string }) => x.id === 'c15');
    expect(c15.sources).toEqual(['sl-dbcurl']);
    expect(c15.quotes.map((x: { text: string }) => x.text)).toEqual([Q]);
    expect(q.quotes.some((x: { claim: string; text: string }) => x.claim === 'c15' && x.text === Q)).toBe(true);
    expect(c.sources.map((s: { id: string }) => s.id)).toContain('sl-dbcurl');
  });
  it('mutation: the elbow box or an emptied risk list is red', () => {
    const ok = (x: any) => x.redFlags.length === 1 && x.redFlags[0] === 'wrist' && x.risks.length === 1;
    const a = card('concentration_curl'); a.redFlags.push('elbow');
    const b = card('concentration_curl'); b.risks = [];
    expect([ok(card('concentration_curl')), ok(a), ok(b)]).toEqual([true, false, false]);
  });
});
