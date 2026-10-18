// LIB-5 S8 (Do 6; D-LIB5-STAMPS, D-LIB5-SCRATCH): strict C15. The stamp helpers (tools/plates/library/research/
// stamps.mjs) compute exactly c15's contentHash over a row's full content and its 9 plate fragments, and an empty,
// missing or unparsable reviews.json fails every id (never c15's stub pass). Main holds no scratch marker or stamp.
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { checkC15, contentHash } from './checks/c15';

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
    expect(await one({ scope, hash, date: '2026-10-18' })).toEqual([]);
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
