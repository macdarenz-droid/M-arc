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
// LIB-SHIP W6 (#393): the 23 lb06/lb07 rows (D-SHIP-MOVE; [golden update] pin commits); each must pin its files' current sha256,
// then it is taken out (the lib-shapes / pair-faults form), so every other entry is compared as before.
const W6_ROWS = ['lb06', 'lb07'].flatMap(b => Object.keys(JSON.parse(rd(`tools/plates/library/batches/${b}.json`)).rows));
const lessW6 = (m: any) => {
  for (const id of W6_ROWS) {
    if (!(id in m.rows)) throw new Error(`LIB-SHIP W6: ${id} has no MANIFEST row`);
    for (const [k, v] of Object.entries<any>(m.rows[id].files)) if (v !== sha(rd(k))) throw new Error(`LIB-SHIP W6: ${id} ${k} does not pin its file`);
    delete m.rows[id];
  }
  return m;
};
const LAYERS = 'tools/plates/library/build-layers-page.mjs';
const lessLayers = (m: any) => {
  for (const [id, r] of Object.entries<any>(m.rows)) if (LAYERS in r.files) {
    if (r.files[LAYERS] !== sha(rd(LAYERS))) throw new Error(`LIB-SHIP W6: ${id} ${LAYERS} does not pin its file`);
    r.files[LAYERS] = 'X';
  }
  return m;
};
describe('RESEARCH-ROUTES-1: the library MANIFEST re-pin moves only back-pain-box.json', () => {
  it('every row that lists it pins the current file, and every other entry equals main e623d3ef', () => {
    const m = lessW6(JSON.parse(rd('tools/plates/library/MANIFEST.json')));   // LIB-SHIP W6: the 23 W6 rows checked and taken out
    const rows = (Object.values(m.rows) as { files: Record<string, string> }[]).filter(r => BOX in r.files);
    expect(rows).toHaveLength(16);
    for (const r of rows) { expect(r.files[BOX]).toBe(sha(rd(BOX))); r.files[BOX] = 'X'; }
    // main e623d3ef's MANIFEST.json with the same one entry blanked (was f0ec7bd5… on main 8bb433bd; re-measure if a later re-pin merges first)
    // LIB-SHIP W6 (#393, D-SHIP-W6-NOPRIMARY): build-layers-page.mjs's key is re-pinned in the 22 older rows; lessLayers checks each pins the
    // current file and blanks it. Was daf6779b… (main e623d3ef, BOX blanked); re-measured on main 5023f5c6 with both keys blanked
    // (BOX alone still gives daf6779b… there).
    expect(sha(JSON.stringify(lessLayers(m)))).toBe('61d86f587d6137c5b58e3a06d4b576e5b11c24aa277b903863c162350fe436d7');
  });
});

describe('LIB-SHIP W6: research-routes lessW6', () => {
  it('red: a W6 row missing, a W6 row that does not pin its file, an older row\'s build-layers-page.mjs key unpinned', () => {
    const gone = JSON.parse(rd('tools/plates/library/MANIFEST.json')); delete gone.rows.lib_face_pull;
    expect(() => lessW6(gone)).toThrow(/lib_face_pull has no MANIFEST row/);
    const stale = JSON.parse(rd('tools/plates/library/MANIFEST.json')); stale.rows.lib_face_pull.files[BOX] = '0'.repeat(64);
    expect(() => lessW6(stale)).toThrow(/lib_face_pull .*back-pain-box.json does not pin its file/);
    const layers = lessW6(JSON.parse(rd('tools/plates/library/MANIFEST.json'))); layers.rows.lib_crunch.files[LAYERS] = '0'.repeat(64);
    expect(() => lessLayers(layers)).toThrow(/lib_crunch .*build-layers-page.mjs does not pin its file/);
  });
});
