// LIB-SHIP W9 (#433; W9 LAYERS APPROVED 6911987250, D-SHIP-W9-STAMP): the wave's own checks. A5: each re-pinned page's W9
// layers-page entry whole, with its reds (lesson 2). A2: every carried card in its judged form equals its judged card
// (D-W9-CARRY-SC; cable_curl less its named D-PF5-HANDPAIR hand panel), with reds. Holds (S3, S4): approved-plate, no
// generated file. Q-W9 (Q-W8c-4 form): main 2c2de794's pre-W9 configs. D-W9-WATCHMAIN-TESTS: the C2 allowance and its reds.
// D-W8C-REDS-W9 (#429 6911681581): committed reds for ship-w8c.ts's judged-page check, supersedes clause and scUnderW8cProblems.
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { SHIPPED } from './shipped-rows';
import { checkC2 } from './checks/c2';
import {
  W9_HELD, W9_IDS, W9_JUDGED, W9_LAYERS, W9_LAYERS_APPROVAL, WATCHMAIN_OK, c2WatchMain, cardOf, lessHandPanel, lessW9Entry, preW9Config, w9CarryProblems,
  w9JudgedForm, w9LayersProblems,
} from './checks/ship-w9';
import { W10_HELD, W10_IDS, W10_LAYERS, preW10Config, underW10 } from './checks/ship-w10';   // LIB-SHIP W10
import { W8C_LAYERS, scUnderW8cProblems, w8cLayersProblems } from './checks/ship-w8c';

/* eslint-disable @typescript-eslint/no-explicit-any */
const json = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const goldenRaw = (b: string) => json(`tests/howto/golden/library/${b}.json`);
const pageRaw = (b: string) => readFileSync(`tests/howto/golden/library/${b}.layers.html`);
// LIB-SHIP W10: lb01, lb02, lb04, lb06 and pilot-a carry W10's entries on top; W9's checks run under them (underW10 checks
// W10's entries whole first and hands on W9's page pin in place of the committed page, now W10's).
const golden = (b: string) => underW10(goldenRaw(b), b, pageRaw(b)).file;
const page = (b: string) => underW10(goldenRaw(b), b, pageRaw(b)).page;
const copy = (f: any) => structuredClone(f);
const last = (f: any) => f.entries[f.entries.length - 1];
const PAGES = Object.keys(W9_LAYERS);

describe('LIB-SHIP W9 A5: the W9 layers-page entry on each re-pinned page, whole', () => {
  it('the 8 pages are exactly W9\'s', () => {
    expect(PAGES).toEqual(['lb02', 'lb03', 'lb04', 'lb05', 'lb06', 'lb07', 'lb09', 'lb10']);
  });
  it.each(PAGES)('%s: the entry is exact', b => {
    expect(w9LayersProblems(golden(b), b, page(b))).toEqual([]);
  });
  it.each(PAGES)('%s reds: another sha, another comment, a moved page pin, other ids, a moved superseded pin, the committed page moved, another decision, another superseded entry', b => {
    const red = (mut: (f: any) => void, re: RegExp, pg = page(b)) => { const f = copy(golden(b)); mut(f); expect(w9LayersProblems(f, b, pg).join('\n')).toMatch(re); };
    red(f => { last(f).approval = W9_LAYERS_APPROVAL.replace(/@ [0-9a-f]{40}$/, `@ ${'0'.repeat(40)}`); }, /W9: entry/);
    red(f => { last(f).approval = W9_LAYERS_APPROVAL.replace('6911987250', '6911918023'); }, /W9: entry/);
    red(f => { last(f).pageSha256 = `${'f'.repeat(63)}0`; }, /W9: page pin/);
    red(f => { last(f).ids = [...last(f).ids].reverse(); }, /W9: ids/);
    red(f => { f.entries[W9_LAYERS[b]!.supersedes].pageSha256 = `${'e'.repeat(63)}0`; }, /W9: superseded pin/);
    const pg = page(b);
    red(() => {}, /W9: committed page/, Buffer.isBuffer(pg) ? Buffer.concat([pg, Buffer.from(' ')]) : { ...pg, bytes: pg.bytes + 1 });
    red(f => { last(f).decision = 'D-SHIP-W8C-LAYERS'; }, /W9: entry/);
    red(f => { last(f).supersedes -= 1; }, /W9: supersedes/);
    red(f => { f.entries.push(structuredClone(last(f))); }, /W9: entry index/);
  });
  it('lessW9Entry drops exactly W9\'s entry and returns the superseded pin; it throws on a moved entry', () => {
    for (const b of PAGES) {
      const f = golden(b), r = lessW9Entry(f, b, page(b));
      expect(r.file.entries).toEqual(f.entries.slice(0, -1));
      expect(r.pin).toEqual({ sha: f.entries[W9_LAYERS[b]!.supersedes].pageSha256, bytes: f.entries[W9_LAYERS[b]!.supersedes].bytes });
    }
    const f = golden('lb02'); last(f).ids = ['lib_dumbbell_pullover'];
    expect(() => lessW9Entry(f, 'lb02', page('lb02'))).toThrow(/W9: ids/);
  });
});

describe('LIB-SHIP W9 A2 (D-W9-CARRY-SC): each carried card in its judged form is its judged card', () => {
  const pages = () => Object.fromEntries(PAGES.map(b => [b, pageRaw(b).toString()]));
  it('the 10 W9 ids, each equal', () => {
    expect(Object.keys(W9_JUDGED)).toEqual(W9_IDS);
    expect(w9CarryProblems(pages())).toEqual([]);
  });
  it('m3 reds: one byte elsewhere in a carried card (bulgarian); diamond\'s keep heading given ": right and wrong"; one byte in cable_curl outside its hand panel; cable_curl judged with its hand panel kept', () => {
    const P = pages(), one = (b: string, chrome: string, from: string, to: string) => {
      const c = cardOf(P[b]!, chrome), at = c.indexOf(from); expect(at).toBeGreaterThan(-1);
      return { ...P, [b]: P[b]!.replace(c, c.slice(0, at) + to + c.slice(at + from.length)) };
    };
    expect(w9CarryProblems(one('lb04', 'bulgarian-split-squat', '<section class="hw-sec setup"', '<section class="hw-sec  setup"'))).toEqual([expect.stringMatching(/^lib_bulgarian_split_squat: judged form/)]);
    expect(w9CarryProblems(one('lb07', 'diamond-push-up', 'tabindex="-1">Shoulder blades</h4>', 'tabindex="-1">Shoulder blades: right and wrong</h4>'))).toEqual([expect.stringMatching(/^lib_diamond_push_up: judged form/)]);
    expect(w9CarryProblems(one('lb05', 'cable-curl', '<section class="hw-sec setup"', '<section class="hw-sec  setup"'))).toEqual([expect.stringMatching(/^lib_cable_curl: judged form/)]);
    const c = cardOf(P.lb05!, 'cable-curl');
    const J = W9_JUDGED.lib_cable_curl!, withHand = { ...J, hand: undefined };
    try { (W9_JUDGED as any).lib_cable_curl = withHand; expect(w9CarryProblems(P)).toEqual([expect.stringMatching(/^lib_cable_curl: judged form/)]); }
    finally { (W9_JUDGED as any).lib_cable_curl = J; }
    expect(w9JudgedForm(c, 'lib_cable_curl')).toContain('<!--w9-hand-panel-->');
    expect(() => lessHandPanel(c.replace('-zoom-hand" data-zoom="hand"', '-zoom-x" data-zoom="x"'), 'cable-curl')).toThrow(/no hand panel/);
  });
});

describe('LIB-SHIP W9 holds (S3: F-FID-NOPRIMARY, F-HARNESS-NOGRIP; S4: W10): approved-plate at main\'s bytes, no generated file', () => {
  const B = Object.fromEntries(['lb01', 'pilot-a', 'lb07', 'lb10'].map(b => [b, json(`tools/plates/library/batches/${b}.json`)]));
  const stage = (id: string) => Object.values(B).map((b: any) => b.rows[id]?.stage).find(Boolean);
  const chrome = (id: string) => id.slice(4).replace(/_/g, '-');
  const stray = (id: string, extra: string[] = []) => [
    ...[...readdirSync('src/howto/generated'), ...extra].filter(f => new RegExp(`^(ht|feel|posture|hand)-${chrome(id)}\\.ts$`).test(f)),
    ...[`docs/research/howto/${id}.json`, `src/slices/howto/css/zoom-${chrome(id)}.css`].filter(existsSync)];
  it('each held id is approved-plate and none is shipped; no W9 id is held; the held ids are on no W9 layers config', () => {
    expect(W9_HELD).toEqual(['lib_cable_external_rotation', 'lib_jumping_jacks', 'lib_underhand_lat_pulldown', 'lib_mountain_climbers']);
    // LIB-SHIP W10 ships underhand and mountain_climbers (W10 LAYERS APPROVED #434 6923360626); the other two stay held (W10_HELD)
    expect(W9_HELD.filter(id => W10_IDS.includes(id))).toEqual(['lib_underhand_lat_pulldown', 'lib_mountain_climbers']);
    expect(W9_HELD.filter(id => !W10_IDS.includes(id)).every(id => W10_HELD.includes(id))).toBe(true);
    for (const id of W9_HELD) expect([id, stage(id)]).toEqual([id, W10_IDS.includes(id) ? 'shipped' : 'approved-plate']);
    expect(SHIPPED.filter(r => W9_HELD.includes(r.id)).map(r => r.id)).toEqual(['lib_underhand_lat_pulldown', 'lib_mountain_climbers']);
    expect(W9_IDS.filter(id => W9_HELD.includes(id))).toEqual([]);
    for (const b of PAGES) {
      const c = json(`tools/plates/library/pages/${b}.layers.json`);
      expect([b, c.groups[0].ids.filter((i: string) => W9_HELD.includes(i) && !W10_IDS.includes(i))]).toEqual([b, []]);
    }
    expect(json('tools/plates/library/pages/lb07.layers.json').closeups.lib_cable_external_rotation).toBeUndefined();
  });
  it('jumping_jacks\' sheet is main\'s (c51ae277\'s hunk not applied: sizePx 110, no ZOOM_ROT)', () => {
    const t = readFileSync('tools/plates/library/howto/lib_jumping_jacks.howto.mjs', 'utf8');
    expect(t).toContain('sizePx: 110 }');
    expect(t).not.toContain('ZOOM_ROT');
  });
  it('no generated file exists for a held id (F-GEN-HELD-CLEAN); red: a stray file', () => {
    for (const id of W9_HELD.filter(i => !W10_IDS.includes(i))) expect([id, stray(id)]).toEqual([id, []]);
    for (const id of W9_HELD.filter(i => W10_IDS.includes(i))) expect([id, stray(id).length]).toEqual([id, 5]);   // W10 shipped: ht, feel, posture, research json, zoom css
    expect(stray('lib_cable_external_rotation', ['feel-cable-external-rotation.ts'])).toEqual(['feel-cable-external-rotation.ts']);
  });
});

describe('LIB-SHIP W9 Q-W9: main 2c2de794\'s pre-W9 layers configs for the other cards\' scratch stages', () => {
  it.each(PAGES)('%s: the committed config less W9\'s lines is main\'s (sha-pinned); reds: drift, a W9 line gone', p => {
    // LIB-SHIP W10: W10's lines come off first (preW10Config, sha-pinned to W9's head) for the pages W10 also touches
    const raw = readFileSync(`tools/plates/library/pages/${p}.layers.json`, 'utf8');
    const t = p in W10_LAYERS ? preW10Config(p, raw) : raw;
    expect(() => preW9Config(p, t)).not.toThrow();
    expect(() => preW9Config(p, t.replace('"optionsModule"', ' "optionsModule"'))).toThrow(/drift/);
    expect(() => preW9Config(p, preW9Config(p, t))).toThrow(/exactly once/);
  });
});

describe('LIB-SHIP W9 D-W9-WATCHMAIN-TESTS: checkC2\'s both-primary-and-watch finding, allowed only for the pinned watchMain set', () => {
  const both = (id: string) => `C2: muscleId "${id}" is both primary and watch`;
  const feel = (o: any = {}) => ({ primary: [{ muscleId: 'glutes' }, { muscleId: 'lower_back' }], secondary: [], watch: [{ muscleId: 'lower_back' }], rows: [], watchMain: true, ...o });
  it('the set is exactly conventional_deadlift\'s lower_back, and no other shipped source names watchMain; conventional\'s feel sets it', async () => {
    expect(WATCHMAIN_OK).toEqual({ lib_conventional_deadlift: ['lower_back'] });
    const { pathToFileURL } = await import('node:url');
    const R = await import(/* @vite-ignore */ pathToFileURL(`${process.cwd()}/tools/plates/library/registry.mjs`).href), set: string[] = [];
    for (const r of R.shippedRows()) {
      if (/\bwatchMain\b/.test(readFileSync(R.sourceOf(r.id), 'utf8'))) set.push(r.id);   // the source text: no module import per row
    }
    expect(set).toEqual(Object.keys(WATCHMAIN_OK));
    const M = (await import(/* @vite-ignore */ pathToFileURL(`${process.cwd()}/tools/plates/library/howto/lib_conventional_deadlift.howto.mjs`).href)).default;
    expect([M.feel.watchMain, checkC2(M as any)]).toEqual([true, [both('lower_back')]]);
    expect(c2WatchMain('lib_conventional_deadlift', M.feel, checkC2(M as any))).toEqual([]);
  });
  it('allowed: conventional\'s lower_back with watchMain and lower_back watched', () => {
    expect(c2WatchMain('lib_conventional_deadlift', feel(), checkC2({ feel: feel() } as any))).toEqual([]);
  });
  it('reds: watchMain outside the set; the set id without watchMain; another muscle both Main and watched; the muscle not in feel.watch; another C2 finding kept', () => {
    expect(c2WatchMain('lib_sumo_deadlift', feel(), [both('lower_back')])).toEqual(['C2: lib_sumo_deadlift sets feel.watchMain outside D-W9-WATCHMAIN-TESTS\'s set', both('lower_back')]);
    expect(c2WatchMain('lib_conventional_deadlift', feel({ watchMain: undefined }), [both('lower_back')])).toEqual(['C2: lib_conventional_deadlift is in D-W9-WATCHMAIN-TESTS\'s set, but its feel does not set watchMain', both('lower_back')]);
    expect(c2WatchMain('lib_conventional_deadlift', feel(), [both('glutes')])).toEqual([both('glutes')]);
    expect(c2WatchMain('lib_conventional_deadlift', feel({ watch: [] }), [both('lower_back')])).toEqual([both('lower_back')]);
    expect(c2WatchMain('lib_conventional_deadlift', feel(), ['C2: feel.primary muscleId "core" has a misleading drawn region'])).toEqual(['C2: feel.primary muscleId "core" has a misleading drawn region']);
  });
});

describe('LIB-SHIP W9 D-W8C-REDS-W9 (#429 6911681581): committed reds for ship-w8c.ts\'s guards W8c added without them', () => {
  // W9's lb03 entry (20) supersedes W8c's (19): the W8c checks run on lb03 less W9's entry
  const lb03 = () => lessW9Entry(golden('lb03'), 'lb03', page('lb03')).file;
  it('the W8c entries hold on pilot-b and lb01; on lb03 under W9\'s entry only the two page checks move (W9 re-pinned the page)', () => {
    expect(w8cLayersProblems(golden('pilot-b'), 'pilot-b', pageRaw('pilot-b'))).toEqual([]);
    // LIB-SHIP W10's lb01 entry (23) supersedes W8c's (22): under it exactly the two page checks move (W10 re-pinned the page)
    expect(w8cLayersProblems(golden('lb01'), 'lb01', pageRaw('lb01'))).toEqual(['lb01 W8c: committed page', 'lb01 W8c: the page with the copy change undone is not the judged page']);
    expect(w8cLayersProblems(lb03(), 'lb03', pageRaw('lb03'))).toEqual(['lb03 W8c: committed page', 'lb03 W8c: the page with the copy change undone is not the judged page']);
  });
  it('the judged-page check is red when the W8c page with the copy change undone is not the judged page', () => {
    const b = 'pilot-b', p = pageRaw(b), f = golden(b), W = W8C_LAYERS[b]!;
    const saved = { ...W.judged };
    try {
      W.judged.sha = `${'a'.repeat(63)}0`;
      expect(w8cLayersProblems(f, b, p)).toEqual(['pilot-b W8c: the page with the copy change undone is not the judged page']);
    } finally { W.judged.sha = saved.sha; }
    expect(w8cLayersProblems(f, b, p)).toEqual([]);
  });
  it('the supersedes-is-F-SHEET-COPY clause is red when the superseded entry is another decision, or another index', () => {
    const f = copy(golden('lb01'));
    f.entries[W8C_LAYERS.lb01!.supersedes].decision = 'D-SHIP-W8B-LAYERS';
    expect(w8cLayersProblems(f, 'lb01', pageRaw('lb01'))).toContain('lb01 W8c: supersedes 21');
    const g = copy(golden('lb01')); last(g).supersedes = 20;
    expect(w8cLayersProblems(g, 'lb01', pageRaw('lb01'))).toContain('lb01 W8c: supersedes 20');
  });
  it('scUnderW8cProblems: clean under W8c\'s entry; reds: another decision, another approval, a moved supersedes, other ids, a moved page pin', () => {
    const under = (b: string) => (b === 'lb03' ? { ...lb03(), entries: lb03().entries.slice(0, -1) } : { ...golden(b), entries: golden(b).entries.slice(0, -1) });
    for (const b of Object.keys(W8C_LAYERS)) expect([b, scUnderW8cProblems(under(b), b)]).toEqual([b, []]);
    const red = (mut: (f: any) => void, re: RegExp) => { const f = copy(under('lb01')); mut(f); expect(scUnderW8cProblems(f, 'lb01').join('\n')).toMatch(re); };
    red(f => { last(f).decision = 'D-SHIP-W8C-LAYERS'; }, /F-SHEET-COPY: last entry/);
    red(f => { last(f).approval = last(f).approval.replace(/@ [0-9a-f]{40}$/, `@ ${'0'.repeat(40)}`); }, /F-SHEET-COPY: last entry/);
    red(f => { last(f).supersedes -= 1; }, /F-SHEET-COPY: supersedes/);
    red(f => { last(f).ids = [...last(f).ids].reverse(); }, /F-SHEET-COPY: ids/);
    red(f => { last(f).pageSha256 = `${'b'.repeat(63)}0`; }, /F-SHEET-COPY: page pin/);
  });
});
