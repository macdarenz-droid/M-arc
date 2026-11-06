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
    const rows = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => BOX in r.files);
    expect(rows).toHaveLength(16);
    for (const r of rows) { expect(r.files[BOX]).toBe(sha(rd(BOX))); r.files[BOX] = 'X'; }
    // F-SCRATCH-SYNTH (#397, D-SCRATCH-SYNTH-KEYIDX) re-pins hands/pairs.mjs in its 22 rows: each pins the current file, blanked too
    const PAIRS = 'tools/plates/library/hands/pairs.mjs', pr = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => PAIRS in r.files);
    expect(pr).toHaveLength(22);
    for (const r of pr) { expect(r.files[PAIRS]).toBe(sha(rd(PAIRS))); r.files[PAIRS] = 'X'; }
    // main e623d3ef's MANIFEST.json with the same entries blanked (was f0ec7bd5… on main 8bb433bd, daf6779b… with BOX alone; re-measure if a later re-pin merges first)
    expect(sha(JSON.stringify(m))).toBe('a97a39e2402296337bf8c9947dc0b4e6d266d7732292caefbd0796fd5a49386f');
  });
});

// RESEARCH-ROUTES-1 part 2, F-STOPLINE-CLAIM (D-STOPLINE-CLAIM, #391 6681022221; ruled #400 6681126219): the shared
// stop-line card and its kind.
describe('RESEARCH-ROUTES-1 F-STOPLINE-CLAIM: the safety-line kind and the stop-line card', () => {
  const STOP = 'docs/research/howto/shared/stop-line.json', QUOTES = 'docs/research/howto/quotes/shared-stop-line.json';
  const V = () => import(/* @vite-ignore */ new URL('../../tools/plates/library/research/validate.mjs', import.meta.url).href);
  it('shared/stop-line.json validates; its line cites c1-c3; box_jump and hollow_body_hold are left out', async () => {
    const v: any = await V(), c = JSON.parse(rd(STOP));
    expect(v.validateSharedFile('stop-line.json')).toEqual([]);
    expect(c.kind).toBe('safety-line');
    expect(c.line).toEqual({ text: "Stop the set. Don't train through the pain.", claim: ['c1', 'c2', 'c3'] });
    expect(c.appliesTo).toHaveLength(67);
    // review FIX (#400): c1 names its source scope, as c2 and c3 do; never plain "elbow pain"
    expect(c.claims[0].text).toBe('NHS self-care advice for wrist pain, back pain and tennis elbow is to stop or cut down activities that cause pain or make it worse (written for those conditions, applied here to training).');
    for (const x of c.claims) expect(x.text, x.id).toMatch(/written for /);
    for (const id of ['box_jump', 'hollow_body_hold']) expect(c.appliesTo).not.toContain(id);
  });
  it('mutation: a safety-line card without its line is red, as is an unknown kind', async () => {
    const v: any = await V(), c = JSON.parse(rd(STOP)), q = JSON.parse(rd(QUOTES));
    delete c.line;
    expect(v.validateShared(c, q, { file: 'stop-line.json' })).toEqual(['shared/stop-line.json: safety-line card lacks line']);
    const k = JSON.parse(rd(STOP)); k.kind = 'stop-line';
    expect(v.validateShared(k, q, { file: 'stop-line.json' })).toEqual(['shared/stop-line.json: unknown kind "stop-line"']);
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
