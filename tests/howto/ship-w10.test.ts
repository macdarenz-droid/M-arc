// LIB-SHIP W10 (#434; W10 LAYERS APPROVED 6923360626, D-SHIP-W10-STAMP; D-W10-JSLAND2 6923406051): the wave's own checks.
// A1 holds (the 13 W10_HELD: approved-plate, no generated file, on no W10 layers config) with m1/m2. A2: each carried card in
// its judged form equals its judged card, with m3. A3: jump_squat's research card (D-W10-JUMPSQ) with m4/m5. A4
// (D-W10-DECLINEHOLD #434): decline_bench_press is held, its sheet the W9 head's (its two ruled lines go to LIB-PLATEFIX-6c). A5: each re-pinned page's W10 layers-page entry whole, with its reds (m7), and lb04's JSLAND2
// entries. A6: the W10 stamps with m8. A7: the W10 budget rows at measured + 10 % with m9. A11: the text-zoom set (machine_
// pullover is held, so the set stays W8c's) with m11. Q-W10: the W9 head's pre-W10 configs. lib-ship A1 (exact set), library-ci
// (A8) and the per-page A9 guards carry the rest.
import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { describe, expect, it } from 'vitest';
import { SHIPPED } from './shipped-rows';
import { cardOf, lessHandPanel } from './checks/ship-w9';
import {
  JSLAND2, JSLAND2_APPROVAL, W10_HELD, W10_IDS, W10_JUDGED, W10_LAYERS, W10_LAYERS_APPROVAL, W10_MOVED, jsland2Problems, lessW10Entry, preW10Config,
  w10CarryProblems, w10JudgedForm, w10LayersProblems, w10Of,
} from './checks/ship-w10';

/* eslint-disable @typescript-eslint/no-explicit-any */
const json = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const golden = (b: string) => json(`tests/howto/golden/library/${b}.json`);
const page = (b: string) => readFileSync(`tests/howto/golden/library/${b}.layers.html`);
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
const copy = (f: any) => structuredClone(f);
const last = (f: any) => f.entries[f.entries.length - 1];
const PAGES = Object.keys(W10_LAYERS);
const url = (p: string) => pathToFileURL(join(process.cwd(), p)).href;
const chrome = (id: string) => id.slice(4).replace(/_/g, '-');

describe('LIB-SHIP W10 A1: the 4 ship; the 13 held stay approved-plate with no generated file', () => {
  const BATCHES = readdirSync('tools/plates/library/batches').filter(f => f.endsWith('.json')).map(f => `tools/plates/library/batches/${f}`);
  const rowOf = (id: string) => BATCHES.map(b => json(b).rows?.[id]).find(Boolean);
  const stray = (id: string, extra: string[] = []) => [
    ...[...readdirSync('src/howto/generated'), ...extra].filter(f => new RegExp(`^(ht|feel|posture|hand)-${chrome(id)}\\.ts$`).test(f)),
    ...[`docs/research/howto/${id}.json`, `src/slices/howto/css/zoom-${chrome(id)}.css`].filter(existsSync)];
  /** Each W10 id shipped and each held id approved-plate (the ruled state); every other stage on them is a problem. */
  const stageProblems = (rows: (id: string) => any) => [...W10_IDS.filter(id => rows(id)?.stage !== 'shipped').map(id => `${id}: ${rows(id)?.stage}, ruled shipped`),
    ...W10_HELD.filter(id => rows(id)?.stage !== 'approved-plate').map(id => `${id}: ${rows(id)?.stage}, held`)];
  it('the set: 4 ids in batch order, each shipped; the 13 held approved-plate, none shipped', () => {
    expect(W10_IDS).toEqual(['lib_underhand_lat_pulldown', 'lib_jump_squat', 'lib_hip_abduction', 'lib_mountain_climbers']);
    expect(W10_HELD).toHaveLength(13);
    expect(W10_HELD).toContain('lib_decline_bench_press');   // D-W10-DECLINEHOLD
    expect(W10_IDS.filter(id => W10_HELD.includes(id))).toEqual([]);
    expect(stageProblems(rowOf)).toEqual([]);
    expect(SHIPPED.filter(r => W10_IDS.includes(r.id)).map(r => r.id)).toEqual(W10_IDS);
    expect(SHIPPED.filter(r => W10_HELD.includes(r.id))).toEqual([]);
    for (const b of PAGES) {
      const c = json(`tools/plates/library/pages/${b}.layers.json`);
      expect([b, c.groups.flatMap((g: any) => g.ids).filter((i: string) => W10_HELD.includes(i))]).toEqual([b, []]);
    }
  });
  it('m1, m2: an unruled id at shipped is not in the set; a held id shipped, or a W10 id left at approved-plate, is red', () => {
    const at = (id: string, stage: string) => (x: string) => (x === id ? { ...rowOf(x), stage } : rowOf(x));
    expect(stageProblems(at('lib_burpee', 'shipped'))).toEqual(['lib_burpee: shipped, held']);   // m2 (a held conditional row)
    expect(stageProblems(at('lib_jump_squat', 'approved-plate'))).toEqual(['lib_jump_squat: approved-plate, ruled shipped']);
    // m1: an id outside both lists shipped is no W10 id, and lib-ship A1's exact set refuses it (lib-ship.test.ts)
    expect([...W10_IDS, ...W10_HELD]).not.toContain('lib_hip_thrust');
  });
  it('no generated file exists for a held id (F-GEN-HELD-CLEAN); each W10 id has its 5; red: a stray file', () => {
    for (const id of W10_HELD) expect([id, stray(id)]).toEqual([id, []]);
    for (const id of W10_IDS) expect([id, stray(id).length]).toEqual([id, 5]);   // ht, feel, posture, research json, zoom css
    expect(stray('lib_burpee', ['ht-burpee.ts'])).toEqual(['ht-burpee.ts']);
  });
  it('w10Of gives each batch file\'s W10 ids', () => {
    expect(w10Of('tools/plates/library/batches/lb06.json')).toEqual(['lib_hip_abduction']);
    expect(w10Of('tools/plates/library/batches/lb03.json')).toEqual([]);
  });
});

describe('LIB-SHIP W10 A2: each carried card in its judged form is its judged card', () => {
  const pages = () => ({ lb01: page('lb01').toString(), 'pilot-a': page('pilot-a').toString() });
  it('underhand_lat_pulldown and mountain_climbers, each equal', () => {
    expect(Object.keys(W10_JUDGED)).toEqual(['lib_underhand_lat_pulldown', 'lib_mountain_climbers']);
    expect(w10CarryProblems(pages())).toEqual([]);
  });
  it('m3 reds: one byte outside the copy change and the named hand panel in underhand\'s card; one byte in mountain_climbers\' card; underhand judged with its hand panel kept', () => {
    const P = pages(), one = (b: 'lb01' | 'pilot-a', c: string, from: string, to: string) => {
      const card = cardOf(P[b], c), at = card.indexOf(from); expect(at).toBeGreaterThan(-1);
      return { ...P, [b]: P[b].replace(card, card.slice(0, at) + to + card.slice(at + from.length)) };
    };
    expect(w10CarryProblems(one('lb01', 'underhand-lat-pulldown', '<section class="hw-sec setup"', '<section class="hw-sec  setup"'))).toEqual([expect.stringMatching(/^lib_underhand_lat_pulldown: judged form/)]);
    expect(w10CarryProblems(one('pilot-a', 'mountain-climbers', '<section class="hw-sec setup"', '<section class="hw-sec  setup"'))).toEqual([expect.stringMatching(/^lib_mountain_climbers: judged form/)]);
    const J = W10_JUDGED.lib_underhand_lat_pulldown!;
    try { (W10_JUDGED as any).lib_underhand_lat_pulldown = { ...J, hand: undefined }; expect(w10CarryProblems(P)).toEqual([expect.stringMatching(/^lib_underhand_lat_pulldown: judged form/)]); }
    finally { (W10_JUDGED as any).lib_underhand_lat_pulldown = J; }
    const c = cardOf(P.lb01, 'underhand-lat-pulldown');
    expect(w10JudgedForm(c, 'lib_underhand_lat_pulldown')).toContain('<!--w9-hand-panel-->');
    expect(() => lessHandPanel(c.replace('-zoom-hand" data-zoom="hand"', '-zoom-x" data-zoom="x"'), 'underhand-lat-pulldown')).toThrow(/no hand panel/);
  });
});

describe('LIB-SHIP W10 A3 (D-W10-JUMPSQ): jump_squat\'s research card differs from the W9 head\'s in inherit and notes only', () => {
  const CARD = 'docs/research/howto/cards/jump_squat.json', KEYS = ['plateFacts', 'tempo', 'topFault'];
  // the W9 head 6571b0b8's card: JSON.stringify of its object (sha), and its inherit[] (the airborne convention row)
  const W9_CARD_SHA = '63253eff9d0743edd686ded07bf52a198e0475485a13182300cfb12e1f331e65';
  const W9_INHERIT = [{ field: 'plate.frames (airborne convention: take-off and landing frames only)', why: 'true for this child because architecture section 1 lists the jump squat under the airborne convention.' }];
  const NOTES = ['RESEARCH-ROUTES-4 (D-RR4-JUMPSQ; Q-W7-9, #394 6647954465): plate.frames leaves inherit[]. This card\'s own plate.frames line equals box_jump\'s byte for byte and follows the ruled airborne convention (D-LIB8R-AIR), so the row no longer waits on box_jump. parent stays box_jump. No claim text changes.'];
  const canon = (c: any) => { const o = { ...c }; for (const k of KEYS) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
  /** The card with W10's two-key edit undone (notes out, inherit back), against the W9 head's card. [problems] */
  const cardProblems = (c: any) => {
    const bad: string[] = [], { notes, ...rest } = c;
    if (JSON.stringify(c.inherit) !== '[]') bad.push(`inherit ${JSON.stringify(c.inherit)}`);
    if (JSON.stringify(notes) !== JSON.stringify(NOTES)) bad.push('notes');
    if (sha(JSON.stringify({ ...rest, inherit: W9_INHERIT })) !== W9_CARD_SHA) bad.push('another key moved');
    if (JSON.stringify(Object.keys(c).slice(-3)) !== JSON.stringify(KEYS)) bad.push('machine keys not last');
    if (sha(canon(c)) !== 'ff68e99722214224412966d94a2d0421643dafe6ad5079e10493d15210ce1522') bad.push('canon sha');
    return bad;
  };
  it('the card: inherit [], 207b8de8\'s notes, everything else the W9 head\'s; the machine keys last; the computed canon sha; the cards.sha.json pin; the quotes file unchanged', () => {
    const c = json(CARD);
    expect(cardProblems(c)).toEqual([]);
    expect(json('tools/plates/library/lb4/cards.sha.json').cards.jump_squat).toBe('ff68e99722214224412966d94a2d0421643dafe6ad5079e10493d15210ce1522');
    expect(json('tools/plates/library/lb4/cards.sha.json').recopied.jump_squat.researchHead).toBe('207b8de81bbc9acc96b6fd0027033e4eabdcd4f2');
    expect(sha(readFileSync('docs/research/howto/quotes/jump_squat.json'))).toBe('23f7b4df34dcc0690851716f4b3f96fdfaab7ec9a586b8f2220dc37536a07d66');
  });
  it('familyRefusal is null with box_jump unshipped (inherit [] needs no shipped parent); m5: inherit left as the W9 head\'s is refused', async () => {
    const FM = await import(/* @vite-ignore */ url('tools/plates/library/lint/family.mjs')), { loadContent } = await import(/* @vite-ignore */ url('tools/plates/gen/content.mjs'));
    const { content } = await loadContent('lib_jump_squat'), c = json(CARD), shipped = SHIPPED.map(r => r.id);
    expect(shipped).not.toContain('lib_box_jump');
    expect(FM.familyRefusal('lib_jump_squat', content, () => c, shipped)).toBeNull();
    expect(FM.familyRefusal('lib_jump_squat', content, () => ({ ...c, inherit: W9_INHERIT }), shipped)).toBeTruthy();   // m5
    expect(cardProblems({ ...c, inherit: W9_INHERIT })).toEqual([`inherit ${JSON.stringify(W9_INHERIT)}`, 'canon sha']);
  });
  it('m4: the card copied from 207b8de8 (the three machine keys gone) is red; so is a moved key elsewhere, or notes after the machine keys', () => {
    const c = json(CARD), bare = Object.fromEntries(Object.entries(c).filter(([k]) => !KEYS.includes(k)));
    expect(cardProblems(bare)).toEqual(expect.arrayContaining(['another key moved', 'machine keys not last']));
    expect(cardProblems({ ...c, anchorNote: `${c.anchorNote} ` })).toEqual(['another key moved', 'canon sha']);
    const { notes, ...rest } = c;
    expect(cardProblems({ ...rest, notes })).toEqual(['machine keys not last']);
  });
});

describe('LIB-SHIP W10 A4 (D-W10-DECLINEHOLD #434): decline_bench_press is held at the W9 head\'s sheet', () => {
  const SHEET = 'tools/plates/library/howto/lib_decline_bench_press.howto.mjs';
  it('its sheet is the W9 head\'s, byte for byte (the two ruled lines wait for LIB-PLATEFIX-6c); red: one byte moved', () => {
    const W9_SHEET = 'fd65af1c591a2f17a1ed42cf1e84fc0d6e631f53fdcda45366af9db322573f98';
    const t = readFileSync(SHEET, 'utf8');
    expect(sha(t)).toBe(W9_SHEET);
    expect(t).toContain("means: '',   // D-FEEL-NOMEANS");
    expect(sha(t.replace("means: '',   // D-FEEL-NOMEANS", "means: 'Lowering the bar without control.',   // D-FEEL-NOMEANS"))).not.toBe(W9_SHEET);
    expect(W10_MOVED[SHEET]).toBeUndefined();
  });
});

describe('LIB-SHIP W10 A5: the W10 layers-page entry on each re-pinned page, whole; lb04\'s JSLAND2 entries', () => {
  it('the 4 pages are exactly W10\'s, with the exact approval', () => {
    expect(PAGES).toEqual(['lb01', 'lb04', 'lb06', 'pilot-a']);
    expect(W10_LAYERS_APPROVAL).toBe('https://github.com/macdarenz-droid/M-arc/pull/434#issuecomment-6923360626 @ d642147ea685fbb2c120a6d7521a3131bc692e55');
    expect(JSLAND2_APPROVAL).toBe('https://github.com/macdarenz-droid/M-arc/pull/434#issuecomment-6923406051 @ e34ffd8b3ae8d11d4b628183de5b8dcbddc75721');
  });
  it.each(PAGES)('%s: the entry is exact', b => {
    expect(w10LayersProblems(golden(b), b, page(b))).toEqual([]);
  });
  it.each(PAGES)('%s reds (m7): another sha, another comment, a moved page pin, other ids, a moved superseded pin, the committed page moved, another decision, another superseded entry, another index', b => {
    const red = (mut: (f: any) => void, re: RegExp, pg = page(b)) => { const f = copy(golden(b)); mut(f); expect(w10LayersProblems(f, b, pg).join('\n')).toMatch(re); };
    red(f => { last(f).approval = W10_LAYERS_APPROVAL.replace(/@ [0-9a-f]{40}$/, `@ ${'0'.repeat(40)}`); }, /W10: entry/);
    red(f => { last(f).approval = W10_LAYERS_APPROVAL.replace('6923360626', '6923406051'); }, /W10: entry/);
    red(f => { last(f).pageSha256 = `${'f'.repeat(63)}0`; }, /W10: page pin/);
    red(f => { last(f).ids = [...last(f).ids].reverse(); }, /W10: ids/);
    red(f => { f.entries[W10_LAYERS[b]!.supersedes].pageSha256 = `${'e'.repeat(63)}0`; }, /W10: superseded pin/);
    red(() => {}, /W10: committed page/, Buffer.concat([page(b), Buffer.from(' ')]));
    red(f => { last(f).decision = 'D-SHIP-W9-LAYERS'; }, /W10: entry/);
    red(f => { last(f).supersedes -= 1; }, /W10: supersedes/);
    red(f => { f.entries.push(structuredClone(last(f))); }, /W10: entry index/);
  });
  it('lessW10Entry drops exactly W10\'s entries (lb04: and the 2 JSLAND2 entries) and returns the superseded pin; it throws on a moved entry', () => {
    for (const b of PAGES) {
      const f = golden(b), r = lessW10Entry(f, b, page(b)), n = b === 'lb04' ? 3 : 1;
      expect(r.file.entries).toEqual(f.entries.slice(0, -n));
      expect(r.pin).toEqual({ sha: f.entries[W10_LAYERS[b]!.supersedes].pageSha256, bytes: f.entries[W10_LAYERS[b]!.supersedes].bytes });
    }
    const f = golden('lb06'); last(f).ids = ['lib_machine_crunch'];
    expect(() => lessW10Entry(f, 'lb06', page('lb06'))).toThrow(/W10: ids/);
  });
  it('JSLAND2: plate entry 17 over 6 (only fragments.alt moves) and page entry 18 over 0, both the owner\'s with the exact approval; reds', () => {
    const f = golden('lb04');
    expect(jsland2Problems(f)).toEqual([]);
    const at = (i: number, o: any) => { const g = copy(f); g.entries[i] = { ...g.entries[i], ...o }; return g; };
    expect(jsland2Problems(at(JSLAND2.plate.at, { approvedBy: 'supervisor' }))).toEqual(['lb04 JSLAND2 plate: plate D-OWNER-REPIN']);
    expect(jsland2Problems(at(JSLAND2.page.at, { approval: JSLAND2_APPROVAL.replace('6923406051', '6923360626') }))).toEqual(['lb04 JSLAND2 page: page D-OWNER-REPIN']);
    expect(jsland2Problems(at(JSLAND2.plate.at, { fragments: { ...f.entries[JSLAND2.plate.at].fragments, tells: '0'.repeat(64) } }))).toEqual(['lb04 JSLAND2: fragment tells moved']);
    expect(jsland2Problems(at(JSLAND2.plate.at, { fragments: { ...f.entries[JSLAND2.plate.at].fragments, alt: f.entries[6].fragments.alt } }))).toEqual(['lb04 JSLAND2: fragment alt unchanged', 'lb04 JSLAND2: alt hash']);
    expect(jsland2Problems(at(JSLAND2.page.at, { pageSha256: '0'.repeat(64) }))).toEqual(['lb04 JSLAND2: page pin']);
    expect(() => lessW10Entry(at(JSLAND2.page.at, { supersedes: 1 }), 'lb04', page('lb04'))).toThrow(/JSLAND2: page pin/);
  });
});

describe('LIB-SHIP W10 A6: the 4 stamps (D-SHIP-W10-STAMP, the W10 LAYERS APPROVED approval)', () => {
  it('stampProblems over the shipped ids is []; m8: a W10 stamp no longer matching its sheet (another hash) is red; another approval is caught by c15', async () => {
    const S = await import(/* @vite-ignore */ url('tools/plates/library/research/stamps.mjs'));
    const ids = SHIPPED.map(r => r.id);
    expect(await S.stampProblems(ids)).toEqual([]);
    const rv = S.readReviews(), es = rv.entries.filter((e: any) => e.decision === 'D-SHIP-W10-STAMP');
    expect(es.map((e: any) => [e.scope, e.approval, e.approvedBy])).toEqual(W10_IDS.map(id => [id, W10_LAYERS_APPROVAL, 'supervisor']));
    const { scope, hash } = await S.stampOf('lib_hip_abduction');
    // m8: the sheet edited after its stamp gives another hash; the committed entry then no longer matches it
    const moved = { ...rv, entries: rv.entries.map((e: any) => (e.scope === scope && e.hash === hash ? { ...e, hash: `${hash.slice(0, -1)}${hash.endsWith('0') ? '1' : '0'}` } : e)) };
    expect(await S.stampProblems(['lib_hip_abduction'], { reviews: moved })).toEqual([`LIB-5 stamp: lib_hip_abduction: no reviews.json entry for scope ${scope} hash ${hash.slice(0, 12)}…`]);
  }, 120_000);
});

describe('LIB-SHIP W10 A7: the W10 budget rows at measured + 10 %', () => {
  const ROWS = [...W10_IDS.flatMap(id => ['ht', 'feel', 'posture'].map(k => `${k}-${chrome(id)}-*.js`)),
    'handpair-bar-pulldown-only-curled-under-*.js', 'handpair-palm-flat-floor-only-hand-ahead-over-*.js'];
  const budgetProblems = (rows: any[]) => ROWS.flatMap(c => {
    const e = rows.filter(r => r.chunk === c);
    if (e.length !== 1) return [`${c}: ${e.length} rows`];
    const [r] = e;
    return r.rawMax === Math.ceil(r.measuredRaw * 1.1) && r.gzMax === Math.ceil(r.measuredGz * 1.1) && /^LIB-SHIP W10: /.test(r.reason) ? [] : [`${c}: not measured + 10 %`];
  });
  it('the 14 rows, each at ceil(measured x 1.1); ids.ts <= 2,048 B (footprint.test.ts holds ids.ts + lazy.tsx <= 3,072 B)', () => {
    const rows = json('tests/howto/budgets.json').budgets;
    expect(ROWS).toHaveLength(14);
    expect(budgetProblems(rows)).toEqual([]);
    expect(readFileSync('src/howto/ids.ts').length).toBeLessThanOrEqual(2048);
  });
  it('m9: a budget entry 1 B over measured + 10 %, or a row missing, is red', () => {
    const rows = json('tests/howto/budgets.json').budgets;
    expect(budgetProblems(rows.map((r: any) => (r.chunk === 'feel-hip-abduction-*.js' ? { ...r, rawMax: r.rawMax + 1 } : r)))).toEqual(['feel-hip-abduction-*.js: not measured + 10 %']);
    expect(budgetProblems(rows.filter((r: any) => r.chunk !== 'posture-jump-squat-*.js'))).toEqual(['posture-jump-squat-*.js: 0 rows']);
  });
});

describe('LIB-SHIP W10 A11: the text-zoom set (D-W8C-TEXTZOOM-LOOPS)', () => {
  // machine_pullover (the card's A11 row) is held in W10 (W10_HELD, PF4 follow-up), so the shipped text-zoom set stays W8c's
  // seated_leg_curl, and machine_pullover writes no chunk; ship-w8c.test.ts checks the set against text-zooms.json and loaders
  it('machine_pullover is held and not shipped; the shipped text-zoom rows are exactly seated_leg_curl; m11: machine_pullover shipped would change the set', async () => {
    const Z = json('tools/plates/library/text-zooms.json').entries, shipped = SHIPPED.map(r => r.id);
    expect(W10_HELD).toContain('lib_machine_pullover');
    expect(shipped).not.toContain('lib_machine_pullover');
    const set = (ids: string[]) => Object.keys(Z).filter(k => ids.includes(k) || ids.includes(`lib_${k}`)).sort();
    expect(set(shipped)).toEqual(set(['lib_seated_leg_curl']));
    expect(existsSync('src/howto/generated/posture-machine-pullover.ts')).toBe(false);
    if ('machine_pullover' in Z || 'lib_machine_pullover' in Z) expect(set([...shipped, 'lib_machine_pullover'])).not.toEqual(set(shipped));   // m11
  });
});

describe('LIB-SHIP W10 Q-W10: the W9 head 6571b0b8\'s pre-W10 layers configs for the other cards\' scratch stages', () => {
  it.each(PAGES)('%s: the committed config less W10\'s lines is the W9 head\'s (sha-pinned); reds: drift, a W10 line gone', p => {
    const t = readFileSync(`tools/plates/library/pages/${p}.layers.json`, 'utf8');
    expect(() => preW10Config(p, t)).not.toThrow();
    expect(sha(preW10Config(p, t))).toBe(W10_MOVED[`tools/plates/library/pages/${p}.layers.json`]);
    expect(() => preW10Config(p, t.replace('"optionsModule"', ' "optionsModule"'))).toThrow(/drift|not there exactly once/);
    expect(() => preW10Config(p, preW10Config(p, t))).toThrow(/exactly once|times/);
  });
});
