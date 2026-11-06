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
  it('every row that lists it pins the current file, and every other entry equals main e623d3ef', () => {
    const m = JSON.parse(rd('tools/plates/library/MANIFEST.json'));
    const rows = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => BOX in r.files);
    expect(rows).toHaveLength(16);
    for (const r of rows) { expect(r.files[BOX]).toBe(sha(rd(BOX))); r.files[BOX] = 'X'; }
    // main e623d3ef's MANIFEST.json with the same one entry blanked (was f0ec7bd5… on main 8bb433bd; re-measure if a later re-pin merges first)
    expect(sha(JSON.stringify(m))).toBe('daf6779bd9505c07f28f805fac904bd0acd6408c78a65a8ce966691814502e69');
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
