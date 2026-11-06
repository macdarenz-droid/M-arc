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
    // main e623d3ef's MANIFEST.json with the same one entry blanked (was f0ec7bd5… on main 8bb433bd; re-measure if a later re-pin merges first)
    expect(sha(JSON.stringify(m))).toBe('be1e42287875c555263c2ee00fc166a373dcd4175280d09e53d8b4fe3a8c52f1');   // LIB-SHIP W4: main's with the W4-moved keys also blanked (re-measured on main 05f27be9; was daf6779b…)
  });
});
