// F-UNDERHAND-FAMILY (card docs/supervisor/verify/f-underhand-family-card.md; rulings D-UF-OWNPR, D-UF-SENTENCE,
// D-UF-SHEET): underhand_lat_pulldown's INHERIT_MAP entry compares only what its card inherits from lat_pulldown, with the
// real sheet, card and parent (loadContent). No row flips here (W9 ships underhand).
// - U1: familyRefusal is null; main's entry put back (m6) gives main's exact red.
// - U2: each of the 2 path leaves and the 41 pad leaves is compared (m1-m4, and every leaf one by one).
// - U3 (D-UF-SENTENCE): the child's path detail ends with the parent's last sentence, read at test time (m5).
/* eslint-disable @typescript-eslint/no-explicit-any */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const json = (p: string) => JSON.parse(readFileSync(join(ROOT, p), 'utf8'));
const ID = 'lib_underhand_lat_pulldown', PID = 'lib_lat_pulldown';
const F_PATH = 'posture: bar comes down in front of the face, never behind the head', F_PAD = 'zooms: seat height / thigh pad crop';
// main 46e564ce family.mjs:69, the entry this card replaces (m6)
const MAIN_ENTRY = { [F_PATH]: ['posture[key=path]'], [F_PAD]: ['zooms[key=pad]'] };
const MAIN_RED = `${ID}: family: ${F_PATH}: posture[key=path].detail "The bar comes down in front of your face and stops just below your chin. Never behind the head." !== parent ${PID}'s "The bar travels past your chin to the top of your chest. Never behind the head." (D-LIB5-FAMILY)`;

let FAM: any, kid: any, par: any;
beforeAll(async () => {
  const [fam, content] = await Promise.all(['tools/plates/library/lint/family.mjs', 'tools/plates/gen/content.mjs'].map(p => import(/* @vite-ignore */ url(p))));
  FAM = fam;
  [kid, par] = await Promise.all([ID, PID].map(async id => (await content.loadContent(id)).content));
});
const run = (child: any) => FAM.familyRefusal(ID, child, json, (x: string) => (x === PID ? par : undefined));
const pathRow = (c: any) => c.posture.find((p: any) => p.key === 'path');
const padZoom = (c: any) => c.zooms.find((z: any) => z.key === 'pad');
/** Set the leaf at `leafPath` (leaves()' form, e.g. `.crop.sizePx` or `.guides[0].x`) under `obj` to `val`. */
const setLeaf = (obj: any, leafPath: string, val: unknown) => {
  const segs = [...leafPath.matchAll(/\.([^.[]+)|\[(\d+)\]/g)].map(m => (m[1] ?? Number(m[2])));
  const last = segs.pop()!;
  let cur = obj;
  for (const s of segs) cur = cur[s];
  cur[last] = val;
};
/** The parent's last sentence (D-UF-SENTENCE), and whether the child's path detail ends with it. */
const lastSentence = (s: string) => s.trim().split(/(?<=[.!?])\s+/).pop()!;
const sentenceProblem = (child: any, parent: any) => {
  const want = lastSentence(pathRow(parent).detail), got = pathRow(child)?.detail;
  return typeof got === 'string' && got.trim().endsWith(want) ? null : `${ID}: posture[key=path].detail ${JSON.stringify(got)} does not end with parent ${PID}'s last sentence ${JSON.stringify(want)}`;
};

describe('F-UNDERHAND-FAMILY U1: familyRefusal with the real sheet, card and parent', () => {
  it('is null', () => {
    expect(json(kid.research.card).parent).toBe('lat_pulldown');
    expect(run(kid)).toBeNull();
  });
  it('m6: main\'s entry put back gives main\'s exact red; the new entry back again is null', () => {
    const now = FAM.INHERIT_MAP[ID];
    try {
      FAM.INHERIT_MAP[ID] = MAIN_ENTRY;
      expect(run(kid)).toBe(MAIN_RED);
    } finally { FAM.INHERIT_MAP[ID] = now; }
    expect(run(kid)).toBeNull();
  });
});

describe('F-UNDERHAND-FAMILY U2: every inherited leaf is compared', () => {
  const mutated = (f: (c: any) => void) => { const c = structuredClone(kid); f(c); return run(c); };
  it('the map names exactly the card\'s two fields: the path label and anchor, and the W3 PAD list', () => {
    expect(json(kid.research.card).inherit.map((e: any) => e.field)).toEqual([F_PATH, F_PAD]);
    expect(FAM.INHERIT_MAP[ID][F_PATH]).toEqual(['posture[key=path].label', 'posture[key=path].anchor']);
    expect(FAM.INHERIT_MAP[ID][F_PAD]).toEqual(['key', 'chip', 'heading', 'kind', 'crop', 'right', 'wrong', 'guides', 'callout', 'caption', 'alt'].map(k => `zooms[key=pad].${k}`));
  });
  it('m1: the child\'s path label changed is red', () => {
    expect(mutated(c => { pathRow(c).label = 'Bar low'; })).toBe(`${ID}: family: ${F_PATH}: posture[key=path].label "Bar low" !== parent ${PID}'s "Bar in front" (D-LIB5-FAMILY)`);
  });
  it('m2: the child\'s path anchor.at changed is red', () => {
    const at = pathRow(par).anchor.at;
    expect(mutated(c => { pathRow(c).anchor.at = `${at}-x`; })).toBe(`${ID}: family: ${F_PATH}: posture[key=path].anchor.at "${at}-x" !== parent ${PID}'s "${at}" (D-LIB5-FAMILY)`);
  });
  it('m3: one pad leaf changed is red (crop.sizePx, then wrong.equipment.kneePad.off[1], the pad vertical offset)', () => {
    const size = padZoom(par).crop.sizePx, dy = padZoom(par).wrong.equipment.kneePad.off[1];
    expect(mutated(c => { padZoom(c).crop.sizePx = size + 1; })).toBe(`${ID}: family: ${F_PAD}: zooms[key=pad].crop.sizePx ${size + 1} !== parent ${PID}'s ${size} (D-LIB5-FAMILY)`);
    expect(mutated(c => { padZoom(c).wrong.equipment.kneePad.off[1] = dy + 1; })).toBe(`${ID}: family: ${F_PAD}: zooms[key=pad].wrong.equipment.kneePad.off[1] ${dy + 1} !== parent ${PID}'s ${dy} (D-LIB5-FAMILY)`);
  });
  it('m4: the pad zoom removed from the child is red (atPath throws)', () => {
    expect(mutated(c => { c.zooms = c.zooms.filter((z: any) => z.key !== 'pad'); })).toMatch(new RegExp(`^${ID}: family: ${F_PAD}: zooms\\[key=pad\\]\\.key: \\[key=pad\\] matches 0 items`));
  });
  it('every compared leaf, one at a time, is red: 2 path leaves and 41 pad leaves', () => {
    const counts: Record<string, number> = {};
    for (const [f, paths] of Object.entries(FAM.INHERIT_MAP[ID]) as [string, string[]][]) for (const p of paths) {
      for (const [leaf, val] of FAM.leaves(FAM.atPath(kid, p))) {
        const c = structuredClone(kid);
        const other = typeof val === 'number' ? val + 1 : typeof val === 'boolean' ? !val : `${String(val)}-x`;
        if (leaf === '') {   // the path names a leaf itself (posture[key=path].label)
          const i = p.lastIndexOf('.');
          FAM.atPath(c, p.slice(0, i))[p.slice(i + 1)] = other;
        } else setLeaf(FAM.atPath(c, p), leaf, other);
        expect([p, leaf, run(c)]).toEqual([p, leaf, expect.stringMatching(new RegExp(`^${ID}: family: ${f.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')}: `))]);
        counts[f] = (counts[f] ?? 0) + 1;
      }
    }
    expect(counts).toEqual({ [F_PATH]: 2, [F_PAD]: 41 });
  });
});

describe('F-UNDERHAND-FAMILY U3 (D-UF-SENTENCE): the inherited sentence', () => {
  it('the child\'s path detail ends with the parent\'s last sentence, read at test time', () => {
    expect(lastSentence(pathRow(par).detail)).not.toBe(pathRow(par).detail.trim());   // a sentence, not the whole detail
    expect(sentenceProblem(kid, par)).toBeNull();
  });
  it('m5: the sentence dropped from the child\'s path detail is red', () => {
    const want = lastSentence(pathRow(par).detail), c = structuredClone(kid);
    pathRow(c).detail = pathRow(c).detail.replace(want, '').trim();
    expect(pathRow(c).detail).not.toContain(want);
    expect(sentenceProblem(c, par)).toMatch(/does not end with parent lib_lat_pulldown's last sentence/);
    // control: the parent's sentence changed at test time moves what is required (no literal)
    const p = structuredClone(par);
    pathRow(p).detail = `${pathRow(p).detail} Keep it there.`;
    expect(sentenceProblem(kid, p)).toMatch(/"Keep it there\."/);
  });
});
