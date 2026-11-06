// RESEARCH-ROUTES-1 (research-routes-card.md; ruled #398 6648297602, D-RR-HEAD): part 1's card edits and the
// MANIFEST re-pin they need. The card bytes themselves are pinned by S1 (library-research.test.ts) and cards.sha.json.
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { lessW4 } from './checks/ship-w4';

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
  it('every row that lists it pins the current file, and every other entry equals main e623d3ef', () => {
    // LIB-SHIP W4 (D-SHIP-W4-PIN; the W2-form widening, approved #391): lessW4 (checks/ship-w4.ts) removes the 20 lb02/lb03 rows
    // (each must be present) and blanks the W4-moved keys (each must pin its current file); the rest is main's rows as before
    const m = lessW4(JSON.parse(rd('tools/plates/library/MANIFEST.json')), k => sha(readFileSync(join(ROOT, k))));
    const rows = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => BOX in r.files);
    expect(rows).toHaveLength(16);
    for (const r of rows) { expect(r.files[BOX]).toBe(sha(rd(BOX))); r.files[BOX] = 'X'; }
    // F-SCRATCH-SYNTH (#397, D-SCRATCH-SYNTH-KEYIDX) re-pins hands/pairs.mjs in its 22 rows: each pins the current file, blanked too
    const PAIRS = 'tools/plates/library/hands/pairs.mjs', pr = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => PAIRS in r.files);
    expect(pr).toHaveLength(22);
    for (const r of pr) { expect(r.files[PAIRS]).toBe('X'); }   // LIB-SHIP W4: lessW4 above already checked each pins the current file and blanked it
    // main e623d3ef's MANIFEST.json with the same entries blanked (was f0ec7bd5… on main 8bb433bd, daf6779b… with BOX alone; re-measure if a later re-pin merges first)
    expect(sha(JSON.stringify(m))).toBe('be1e42287875c555263c2ee00fc166a373dcd4175280d09e53d8b4fe3a8c52f1');   // LIB-SHIP W4: main 484d4552's with the BOX, pairs.mjs and smith-sheet keys blanked (main's own value with BOX and pairs.mjs alone: a97a39e2…)
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
