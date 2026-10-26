// LIB-STRIP (card docs/supervisor/verify/lib-strip-card.md on claude/sup-lib4-cards @ ad335ef2; D-STRIP-B): the tempo
// strip for a plate with no sourced seconds. A1-A4 and A6-A9, A11 here (node only; page builds go through
// buildPlatesPage's child process, D-LIB8M-RPC (b)); A10 is the LIB-STRIP gate block. Golden A and B themselves are
// rebuilt by library-core.test.ts and layers-engine.test.ts, unedited; this file pins their literals.
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { HELD, PAIR, heldShapeProblems, pairingMismatches, pairingMutations } from './held-pairing';   // D-PLATEFACTS-HELD

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
const read = (p: string) => readFileSync(join(ROOT, p), 'utf8');
const VENDOR_PAGE = 'tools/plates/vendor/artifact/build-page.mjs', LAYERS_PAGE = 'tools/plates/layers/artifact/build-page.mjs';
const ROWS = 'tools/plates/library/strip/rows.json';
const temps: string[] = [];
afterAll(() => { for (const t of temps) rmSync(t, { recursive: true, force: true }); });
let S: any;
beforeAll(async () => { S = await import(/* @vite-ignore */ url('tools/plates/library/strip/tempo-strip.mjs')); });

/** A strip function from a strip text, with the vendored esc and plain (no page build). */
const stripOf = (text: string) => {
  const v = read(VENDOR_PAGE), esc = v.match(/^const esc = .*$/m)![0], plain = v.match(/^const plain = .*$/m)![0];
  return new Function(`${esc}\n${plain}\n${text}return tempoStrip;`)() as (t: any[]) => string;
};
const aria = (html: string) => html.match(/aria-label="([^"]*)"/)![1];
const flexes = (html: string) => [...html.matchAll(/style="flex:([^"]*)"/g)].map(m => m[1]);
const values = (html: string) => [...html.matchAll(/<\/b><span>([^<]*)<\/span>/g)].map(m => m[1]);

describe('A1: one module, applied once in each builder', () => {
  it('both builders carry NOSECS_STRIP once and VENDOR_STRIP zero times; the vendored text is there exactly once', async () => {
    const bp = await import(/* @vite-ignore */ url('tools/plates/library/build-page.mjs'));
    const blp = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
    const count = (s: string, x: string) => s.split(x).length - 1;
    for (const f of [VENDOR_PAGE, LAYERS_PAGE]) expect([f, count(read(f), S.VENDOR_STRIP)]).toEqual([f, 1]);
    const plates = bp.patchedBuilder(), layers = blp.patchBuildPage(read(LAYERS_PAGE), blp.GOLDEN_B_SPEC);
    expect([count(plates, S.NOSECS_STRIP), count(plates, S.VENDOR_STRIP)]).toEqual([1, 0]);
    expect([count(layers, S.NOSECS_STRIP), count(layers, S.VENDOR_STRIP)]).toEqual([1, 0]);
  });
  it('a vendored strip one byte off stops both builders, naming the patch (S7)', async () => {
    const bp = await import(/* @vite-ignore */ url('tools/plates/library/build-page.mjs'));
    const blp = await import(/* @vite-ignore */ url('tools/plates/library/build-layers-page.mjs'));
    const off = (f: string) => read(f).replace("second${t.s === 1 ? '' : 's'}`).join(', ');", "second${t.s === 1 ? '' : 's'}`).join(',  ');");
    expect(() => bp.patchedBuilder(off(VENDOR_PAGE))).toThrow(/"const tempoStrip = tempo => \{[\s\S]*must occur exactly once/);
    expect(() => blp.patchBuildPage(off(LAYERS_PAGE), blp.GOLDEN_B_SPEC)).toThrow('layers page: patch "tempo strip" matched 0 times');
  });
  it('tempo-strip.mjs is the only file outside docs/ that holds the new strip text', () => {
    const l = S.NOSECS_STRIP.split('\n').find((x: string) => x.includes('const val = t =>')), line = l.slice(l.indexOf('t.word ?'));   // raw in the module source too
    const hits = execFileSync('git', ['grep', '-l', '--untracked', '-F', '-e', line, '--', '.', ':!docs'], { cwd: ROOT, encoding: 'utf8' }).trim().split('\n');
    expect(hits).toEqual(['tools/plates/library/strip/tempo-strip.mjs']);
  });
});

describe('A2, A3: the goldens the rebuild tests prove (library-core :455-485, layers-engine :68-70) are the pinned ones', () => {
  it('golden A e2bea90c…, 860,766 B; golden B e7b81413…', async () => {
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const layers = await import(/* @vite-ignore */ url('tools/plates/layers.mjs'));
    expect([g.PINS.pageSha256, g.PINS.pageBytes]).toEqual(['e2bea90c8312132b93a2ab0bc004cee6ef43edd22e8227720be3958f6b2dcf48', 860766]);
    expect(layers.PAGE_SHA256).toBe('e7b8141368e59cf993f29555efce53bc06f36131d8e283c79e11a9f2614c928a');
  });
});

/** Expected aria-labels, one literal per rows.json card and fallbackA card (D-STRIP-B: "<phase> <word>", lower case). */
const LABELS: Record<string, string> = {
  front_squat: 'Tempo: lower controlled, drive up',
  goblet_squat: 'Tempo: lower controlled, drive up controlled',
  bodyweight_squat: 'Tempo: lower, drive up',
  step_up: 'Tempo: rise, lower controlled',
  pistol_squat: 'Tempo: lower slow, drive up slow',
  box_jump: 'Tempo: take-off explosive, step down',
  reverse_lunge: 'Tempo: lower slow, rise quicker',
  jump_squat: 'Tempo: lower controlled, jump explosive',
  bulgarian_split_squat: 'Tempo: lower controlled, stand',
  walking_lunge: 'Tempo: lower controlled, rise',
  forward_lunge: 'Tempo: step slow, lower smooth, rise',
  bodyweight_lunge: 'Tempo: step slow, lower, rise',
  bodyweight_split_squat: 'Tempo: lower smooth, rise smooth',
  renegade_row: 'Tempo: row, lower controlled',
  sled_pull: 'Tempo: walk quick',
  flutter_kicks: 'Tempo: kick crisp',
  cable_rear_delt_fly: 'Tempo: open slow, return slow',
  burpee: 'Tempo: squat down controlled, kick back, jump in, jump up',
  farmer_s_carry: 'Tempo: walk controlled',
};

describe('A4: the strip, on NOSECS_STRIP with the vendored esc and plain', () => {
  it('every timed tempo draws the vendored output byte for byte', async () => {
    const v = read(VENDOR_PAGE), old = stripOf(S.VENDOR_STRIP), neu = stripOf(S.NOSECS_STRIP);
    const tempos: any[] = [...v.matchAll(/^ {4}tempo: (\[.*\]),$/gm)].map(m => new Function(`return ${m[1]}`)());
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs')), mirror = g.makeMirror(); temps.push(mirror);   // the specs read the mirror's font
    for (const f of ['barbell_back_squat', 'hanging_leg_raise', 'lat_pulldown', 'leg_press', 'machine_chest_press', 'pull_up', 'seated_cable_row'])
      tempos.push((await import(/* @vite-ignore */ pathToFileURL(join(mirror, `exercises/${f}.mjs`)).href)).default.tempo);
    tempos.push([{ phase: 'Hold', s: '10–60' }], [{ phase: 'Hold', s: '30-60' }], [{ phase: 'Pause', s: 0.5 }, { phase: 'Lower', s: 1, move: true }]);
    expect(tempos).toHaveLength(11);
    for (const t of tempos) expect(neu(t)).toBe(old(t));
  });
  it('an untimed tempo: every bar flex 1, the escaped word or &nbsp;, the spoken word', () => {
    const f = stripOf(S.NOSECS_STRIP);
    const h = f([{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Drive up', move: true }]);
    expect([aria(h), flexes(h), values(h)]).toEqual(['Tempo: lower controlled, drive up', ['1 1 0', '1 1 0'], ['Controlled', '&nbsp;']]);
    expect(values(f([{ phase: 'Lower', word: 'A<b>&' }]))).toEqual(['A&lt;b&gt;&amp;']);
  });
  it('the mixed fixture keeps its sourced seconds on the timed phase; every bar is flex 1', () => {
    const h = stripOf(S.NOSECS_STRIP)([{ phase: 'Lower', move: true, s: '2–3' }, { phase: 'Push', move: true }]);
    expect([aria(h), flexes(h), values(h)]).toEqual(['Tempo: lower 2–3 seconds, push', ['1 1 0', '1 1 0'], ['2–3 s', '&nbsp;']]);
  });
  it('every rows.json card gives its expected aria-label', () => {
    const f = stripOf(S.NOSECS_STRIP), R = JSON.parse(read(ROWS)), cards = [...R.cards, ...R.fallbackA];
    expect(Object.fromEntries(cards.map((c: any) => [c.id, aria(f(S.tempoOf(c.rows)))]))).toEqual(LABELS);
  });
  it('tempoOf keeps { phase, move?, word? } in that order and refuses a timed row', () => {
    expect(JSON.stringify(S.tempoOf([{ phase: 'Lower', move: true, word: 'Slow', claim: 'c1', says: 'lower slowly' }, { phase: 'Rise', move: true, blank: true, claim: 'c1' }])))
      .toBe('[{"phase":"Lower","move":true,"word":"Slow"},{"phase":"Rise","move":true}]');
    expect(() => S.tempoOf([{ phase: 'Lower', from: 'down', move: true }])).toThrow('timed row');
  });
});

describe('D-STRIP-FORMS and -SAYS: whole-word, case-insensitive', () => {
  it('a form matches only as a whole word; directions read both ways', () => {
    expect([S.formIn('Controlled', 'Controlled descent'), S.formIn('Controlled', 'control the way down'), S.formIn('Controlled', 'controlling both phases'),
      S.formIn('Slow', 'slower'), S.formIn('Quick', 'quicker'), S.formIn('Steady', 'steady'), S.formIn('Explosive', 'Explosively extend'), S.formIn('Explosive', 'explosiveness')])
      .toEqual([true, true, false, false, false, false, true, false]);
    expect(Object.fromEntries(Object.entries(S.FORMS).map(([k, v]: any) => [k, v.length]))).toEqual({ Controlled: 2, Slow: 2, Smooth: 2, Quicker: 1, Quick: 1, Explosive: 2, Crisp: 1 });
    expect([S.directionsOf('Take-off'), S.directionsOf('Step down'), S.directionsOf('Controlled descent, drive up'), S.directionsOf('Walk'), S.directionsOf('Lowering')])
      .toEqual([['up'], ['down'], ['down', 'up'], [], ['down']]);
  });
});

/** The S3 fixture card (validates, timed) with an untimed tempo from front_squat's rows and its text. */
const FX = 'tests/howto/fixtures/lib5/research/cards/cable_lateral_raise.json', FXQ = 'tests/howto/fixtures/lib5/research/quotes/cable_lateral_raise.json';
const frontSquat = () => JSON.parse(read(ROWS)).cards.find((c: any) => c.id === 'front_squat');
const untimedCard = (tempo?: any[]) => {
  const fx = JSON.parse(read(FX)), fs = frontSquat();
  return { ...fx, tempo: tempo ?? S.tempoOf(fs.rows), plate: { ...fx.plate, tempo: { ...fx.plate.tempo, text: fs.text } } };
};
/** Rows whose tempoOf is `tempo` (blank: true where no word), so only the word checks are left to fire. */
const rowsFor = (tempo: any[]) => tempo.map(t => ({ ...t, ...('word' in t ? { says: 'x', quote: 'x' } : { blank: true }), claim: 'c21' }));

describe('A6: the validator accepts the untimed shapes (D-STRIP-SHAPE), add-only', () => {
  let V: any;
  beforeAll(async () => { V = await import(/* @vite-ignore */ url('tools/plates/library/research/validate.mjs')); });
  const q = () => JSON.parse(read(FXQ));
  const v = (c: any, rows = frontSquat().rows) => V.validateCard(c, q(), { file: 'cable_lateral_raise.json', untimed: new Map([['cable_lateral_raise', rows]]) });
  it('front_squat\'s rows through tempoOf validate; every card on main still validates (bar the ruled hold markers); the timed fixture still does', () => {
    expect(v(untimedCard())).toEqual([]);
    expect(V.validateCard(JSON.parse(read(FX)), q(), { file: 'cable_lateral_raise.json' })).toEqual([]);
    expect(readdirSync(join(ROOT, 'docs/research/howto/cards')).length).toBeGreaterThan(8);
    expect(heldShapeProblems(HELD)).toEqual([]);
    expect(pairingMismatches(V)).toEqual([]);   // D-PLATEFACTS-HELD: a held id gives exactly the pairing marker, every other card []
  });
  it('D-PLATEFACTS-HELD: mutations (a)-(e) are red; the control is green', () => {
    const m = pairingMutations(V);
    expect(m.control).toEqual([]);
    expect(m.a).toEqual([`barbell_row: [], want ${JSON.stringify([PAIR('barbell_row')])}`]);
    expect(m.b).toEqual([`plank: ${JSON.stringify([PAIR('plank')])}, want []`]);
    expect(m.c.length).toBe(1);
    expect(m.c[0]).toMatch(/^barbell_row: .*names unknown claim c999/);
    expect(m.d).toEqual([`barbell_row: ${JSON.stringify([PAIR('barbell_row')])}, want []`]);
    expect(m.e).toEqual([`held[0] (${HELD[0]!.id}) has no ruling`]);
  });
  it('mutations, each red on its own check', () => {
    const T = S.tempoOf(frontSquat().rows), with0 = (x: any) => [{ ...T[0], ...x }, T[1]];
    const steady = with0({ word: 'Steady' }), quick = with0({ word: 'Quick' }), none = [{ phase: 'Lower', move: true }, T[1]];
    const cases: [string, string[], RegExp][] = [
      ['an extra key', v(untimedCard([{ ...T[0], claim: 'c21' }, T[1]])), /tempo\[0\] keys phase,move,word,claim, want phase\[,move\]\[,word\]/],
      ['s and word in one entry', v(untimedCard(with0({ s: 2 }))), /tempo words: word:0:timed/],
      ['a word not in FORMS', v(untimedCard(steady), rowsFor(steady)), /tempo\[0\]\.word "Steady" is not a FORMS word/],
      ['a FORMS word not in the text', v(untimedCard(quick), rowsFor(quick)), /^[^]*tempo words: word:0 \(plate\.tempo\.text\)$/],
      ['an untimed tempo with no word', v(untimedCard(none), rowsFor(none)), /tempo words: noword/],
      ['a card not listed as untimed', V.validateCard(untimedCard(), q(), { file: 'cable_lateral_raise.json', untimed: new Map() }), /tempo\[1\] keys phase,move, want phase,s\[,move\]/],
      ['the card tempo is not tempoOf(its rows)', v(untimedCard([T[1], T[0]])), /!= tempoOf\(strip rows\)/],
      ['a row with no claim', v(untimedCard(), frontSquat().rows.map((r: any, i: number) => (i ? r : { ...r, claim: undefined }))), /strip row 0 \(Lower\) carries no claim/],
      ['a blank row without its marker', v(untimedCard(), frontSquat().rows.map((r: any, i: number) => (i ? { ...r, blank: undefined } : r))), /strip row 1 \(Drive up\) needs a word or blank: true/],
    ];
    for (const [name, bad, re] of cases) expect([name, bad.some(b => re.test(b))]).toEqual([name, true]);
    // D-STRIP-AFALL both ways: all blank is valid only on a fallbackA card, and a fallbackA card carries no word
    const blank = [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }], fa = (c: any, rows: any[], on: boolean) =>
      V.validateCard(c, q(), { file: 'cable_lateral_raise.json', untimed: new Map([['cable_lateral_raise', rows]]), fallbackA: new Set(on ? ['cable_lateral_raise'] : []) });
    expect(fa(untimedCard(blank), rowsFor(blank), true)).toEqual([]);
    expect(fa(untimedCard(blank), rowsFor(blank), false).some((b: string) => /tempo words: noword/.test(b))).toBe(true);
    expect(fa(untimedCard(), frontSquat().rows, true).some((b: string) => /tempo words: word:0:fallback/.test(b))).toBe(true);
    const fx = JSON.parse(read(FX));
    expect(v({ ...fx, tempo: [{ ...fx.tempo[0], word: 'Controlled' }, ...fx.tempo.slice(1)] })).toContain('cards/cable_lateral_raise.json: tempo[0] keys phase,s,move,word, want phase,s[,move]');
    expect(v({ ...fx, tempo: [{ ...fx.tempo[0], extra: 1 }, ...fx.tempo.slice(1)] })).toContain('cards/cable_lateral_raise.json: tempo[0] keys phase,s,move,extra, want phase,s[,move]');
  });
});

describe('A7, A8: H6 and H8 through runQa on a candidate built from the fixture card', () => {
  const T = 120_000;
  let B: any;
  beforeAll(async () => {
    const [golden, eng, appr, qa, cand] = await Promise.all(['tools/plates/golden.mjs', 'tools/plates/library/qa/engine.mjs', 'tools/plates/library/qa/approved.mjs',
      'tools/plates/library/qa/index.mjs', 'tools/plates/library/candidate.mjs'].map(p => import(/* @vite-ignore */ url(p))));
    const mirror = golden.makeMirror(), E = await eng.loadEngine(mirror), eight = await appr.candidatesOf(appr.goldenHtml(), E);
    const tree = mkdtempSync(join(tmpdir(), 'lib-strip-h6-')); temps.push(tree); mkdirSync(join(tree, 'cards'));
    B = { eng, mirror, E, qa, cand, eight, tree, sq: eight.find((c: any) => c.chromeId === 'barbell-back-squat') };
  }, T);
  afterAll(() => { if (B?.mirror) B.eng.dropMirror(B.mirror); });
  /** The back squat's plate as a mode-H candidate, its research read by researchOf from `card` and its spec tempo `tempo`. */
  const cand = (card: any, tempo: any[], plateTempo?: string) => {
    writeFileSync(join(B.tree, 'cards/x.json'), JSON.stringify(card));
    const plate = plateTempo ? { ...B.sq.plate, tempo: plateTempo } : B.sq.plate;
    return { ...B.sq, mode: 'H', exemptions: [], plate, spec: { ...B.sq.spec, tempo }, research: B.cand.researchOf({ research: { card: 'cards/x.json' } }, B.tree) };
  };
  const keys = async (c: any, h: string, pre: string) => B.cand.nodeHalf(await B.qa.runQa(c, { engine: B.E })).hard[h].problems.map((p: any) => p.key).filter((k: string) => k.startsWith(pre));
  it('researchOf adds tempoText only for an untimed card; a timed card reads the three keys', () => {
    const c = untimedCard(), fx = JSON.parse(read(FX));
    expect(cand(c, c.tempo).research).toEqual({ plateFacts: c.plateFacts, tempo: c.tempo, topFault: c.topFault, tempoText: frontSquat().text });
    expect(cand(fx, fx.tempo).research).toEqual({ plateFacts: fx.plateFacts, tempo: fx.tempo, topFault: fx.topFault });
  });
  it('H6: silent on the card and on the 8; each new key fires on its case', async () => {
    const c = untimedCard(), t = c.tempo;
    expect(await keys(cand(c, t), 'PQ-H6', 'H6.tempo')).toEqual([]);
    for (const e of B.eight) expect(await keys(e, 'PQ-H6', 'H6.tempo-')).toEqual([]);
    const w0 = (x: any) => [{ ...t[0], ...x }, t[1]];
    const cases: [string, any, any[], string][] = [
      ['a word not in the text', untimedCard(w0({ word: 'Quick' })), w0({ word: 'Quick' }), 'H6.tempo-word:0'],
      ['a word beside seconds', untimedCard(w0({ s: 2 })), w0({ s: 2 }), 'H6.tempo-word:0:timed'],
      ['every word removed', untimedCard([{ phase: 'Lower', move: true }, t[1]]), [{ phase: 'Lower', move: true }, t[1]], 'H6.tempo-noword'],
      ['plate.tempo.text removed', { ...c, plate: { ...c.plate, tempo: { ...c.plate.tempo, text: undefined } } }, t, 'H6.tempo-text'],
      ['the word moved to the other phase in the spec only', c, [{ phase: 'Lower', move: true }, { ...t[1], word: 'Controlled' }], 'H6.tempo'],
    ];
    for (const [name, card, tempo, key] of cases) expect([name, (await keys(cand(card, tempo), 'PQ-H6', 'H6.tempo')).includes(key)]).toEqual([name, true]);
    // D-STRIP-AFALL: researchOf marks a card listed under fallbackA (bodyweight_squat); its all-blank tempo passes, a word is red
    const blank = [{ phase: 'Lower', move: true }, { phase: 'Drive up', move: true }], bw = (tempo: any[]) => ({ ...untimedCard(tempo), id: 'bodyweight_squat' });
    expect(cand(bw(blank), blank).research.tempoFallbackA).toBe(true);
    expect('tempoFallbackA' in cand(c, t).research).toBe(false);
    expect(await keys(cand(bw(blank), blank), 'PQ-H6', 'H6.tempo')).toEqual([]);
    expect(await keys(cand(bw(t), t), 'PQ-H6', 'H6.tempo')).toContain('H6.tempo-word:0:fallback');
  }, T);
  it('H8: each value line that is not &nbsp; is a label; the 1-3 word rule and the bans apply', async () => {
    const node = await import(/* @vite-ignore */ url('tools/plates/library/qa/node.mjs'));
    const f = stripOf(S.NOSECS_STRIP), c = untimedCard();
    const strip = (w: string) => f([{ phase: 'Lower', move: true, word: w }, { phase: 'Drive up', move: true }]);
    expect(node.plateStrings({ ...B.sq.plate, tempo: strip('Controlled') }).filter((s: any) => s.where.startsWith('tempo.')))
      .toEqual([{ where: 'tempo.Lower', text: 'Lower' }, { where: 'tempo.Drive up', text: 'Drive up' }, { where: 'tempo.Lower.value', text: 'Controlled', label: true }]);
    const tempoKeys = async (w: string) => (await keys(cand(c, c.tempo, strip(w)), 'PQ-H8', 'H8')).filter((k: string) => k.includes(':tempo.'));
    expect(await tempoKeys('Controlled')).toEqual([]);
    expect(await tempoKeys('Activated')).toEqual(['H8.ban:tempo.Lower.value:activate']);
    expect(await tempoKeys('Very slow and steady')).toEqual(['H8.words:tempo.Lower.value']);
    expect(node.plateStrings(B.sq.plate).filter((s: any) => /^tempo\..*\.value$/.test(s.where)).map((s: any) => s.text)).toEqual(['2 s', '1 s', '1 s']);
  }, T);
});

/** Stand-in cards: the vendored back squat with its tempo replaced (render.mjs's way), one per rows.json card. */
const WORST = [{ phase: 'Lower', move: true, word: 'Controlled' }, { phase: 'Jump', move: true, word: 'Explosive' }, { phase: 'Step down', move: true }];
const MIXED = [{ phase: 'Lower', move: true, s: '2–3' }, { phase: 'Push', move: true }];
async function standInPage(extra: Record<string, any[]>) {
  const bp = await import(/* @vite-ignore */ url('tools/plates/library/build-page.mjs'));
  const dir = mkdtempSync(join(tmpdir(), 'lib-strip-page-')); temps.push(dir);
  const R = JSON.parse(read(ROWS));
  const tempos: Record<string, any[]> = { ...Object.fromEntries([...R.cards, ...R.fallbackA].map((c: any) => [`strip_${c.id}`, S.tempoOf(c.rows)])), strip_worst: WORST, strip_mixed: MIXED, ...extra };
  const specs = Object.fromEntries(Object.entries(tempos).map(([id, t]) => {
    const f = join(dir, `${id}.mjs`);
    // the mirror's own copy (the page build runs in <mirror>/artifact), as render.mjs's mirror exercises did. Since LIB-ZOOM
    // applyZooms also imports each spec in this process (cwd = the repo) and reads only its `zoom`, so there it is the tempo alone
    writeFileSync(f, `import { pathToFileURL } from 'node:url';\nconst base = process.cwd() === ${JSON.stringify(ROOT.replace(/\/$/, ''))} ? {} : (await import(new URL('../exercises/barbell_back_squat.mjs', pathToFileURL(\`\${process.cwd()}/\`)).href)).default;\nexport default { ...base, tempo: ${JSON.stringify(t)} };\n`);
    return [id, f];
  }));
  const ids = Object.keys(tempos);
  const cfg = { groups: [{ id: 'strip', title: 'Tempo', ids }], sources: Object.fromEntries(ids.map(id => [id, ['LIB-STRIP fixture']])), specs, heading: bp.GOLDEN_A_HEADING };
  return { ids, html: (await bp.buildPlatesPage(cfg)).html.toString('utf8') };
}

describe('A9: extractPlates and PQ-H2 on a built page', () => {
  it('every stand-in, the worst case and the mixed fixture extract and pass H2\'s strip check; tempo [] is red', async () => {
    const g = await import(/* @vite-ignore */ url('tools/plates/golden.mjs'));
    const node = await import(/* @vite-ignore */ url('tools/plates/library/qa/node.mjs'));
    const { loadPins } = await import(/* @vite-ignore */ url('tools/plates/library/qa/index.mjs'));
    const { articlesOf } = await import(/* @vite-ignore */ url('tools/plates/library/qa/approved.mjs'));
    const { ids, html } = await standInPage({ strip_empty: [] });
    const plates = g.extractPlates(html), arts = articlesOf(html), { vocabulary, envelope } = loadPins();
    expect(plates.map((p: any) => p.chromeId)).toEqual(ids.map(id => id.replace(/_/g, '-')));
    const h2 = Object.fromEntries(plates.map((p: any) => [p.chromeId, node.h2({ chromeId: p.chromeId, plate: p, article: arts.get(p.chromeId) }, { vocabulary, envelope }).map((x: any) => x.key).includes('H2.chrome:tempo')]));
    expect(h2).toEqual(Object.fromEntries(ids.map(id => [id.replace(/_/g, '-'), id === 'strip_empty'])));
    const strip = plates.find((p: any) => p.chromeId === 'strip-front-squat').tempo;
    expect(aria(strip)).toBe(LABELS.front_squat);
  }, 60_000);
});

/** D-STRIP-SCOPE's 17 plus D-STRIP-ALL's 8 (LIB-STRIP start). */
const SCOPE = ['front_squat', 'goblet_squat', 'bodyweight_squat', 'step_up', 'pistol_squat', 'box_jump', 'reverse_lunge', 'jump_squat', 'bulgarian_split_squat',
  'walking_lunge', 'forward_lunge', 'bodyweight_lunge', 'bodyweight_split_squat', 'renegade_row', 'sled_pull', 'flutter_kicks', 'bear_crawl',
  'cable_rear_delt_fly', 'sled_push', 'farmer_s_carry', 'burpee', 'medicine_ball_slam', 'wall_ball', 'diamond_push_up', 'pike_push_up'];
const SET_LEVEL_PHASE = /^(set|sets|rep|reps|rest)$/i, SET_LEVEL_SAYS = /(?<![A-Za-z])(set|sets|rep|reps|rest|round|rounds|failure)(?![A-Za-z])/i;
/** sha256 of rows.json's canonical JSON (JSON.stringify of the parsed file), set at 'STRIP ROWS VERIFIED' (Do 6). */
const ROWS_PIN = '0e16f200886e33529bfaebc670d2920bc885f0ccb52beec74dfb816de4c308fd';   // the rows verified at 511ded30, plus D-STRIP-BURPEE's burpee row, re-synced to research 42cf542a

/** A11's checks on a parsed rows.json; returns problems. */
function rowProblems(R: any, V: any): string[] {
  const out: string[] = [], seen = [...R.cards, ...R.fallbackA, ...R.timedAtHead, ...R.leftOut].map((c: any) => c.id);
  if (JSON.stringify([...seen].sort()) !== JSON.stringify([...SCOPE].sort())) out.push(`ids ${seen.join()} are not the scope's ${SCOPE.length}, each once`);
  for (const t of R.timedAtHead) if (!t.tempo.every((p: any) => p.s != null)) out.push(`${t.id}: timedAtHead without s on every phase`);
  const fallbackA = new Set(R.fallbackA.map((c: any) => c.id));
  for (const c of [...R.cards, ...R.fallbackA]) {
    const claims: string[] = [].concat(c.claim);
    if (fallbackA.has(c.id) ? c.rows.some((r: any) => 'word' in r) : !c.rows.some((r: any) => 'word' in r)) out.push(`${c.id}: ${fallbackA.has(c.id) ? 'a word on a fallbackA card' : 'no word'}`);
    for (const r of c.rows) {
      const at = `${c.id}.${r.phase}`;
      if (SET_LEVEL_PHASE.test(r.phase)) out.push(`${at}: set-level phase`);
      if (!('word' in r)) {   // a blank phase: the card's tempo claim, or one its text cites
        if (!claims.includes(r.claim) && !new RegExp(`\\((?:[a-z]+\\d+, )*${r.claim}(?:, [a-z]+\\d+)*\\)`).test(c.text)) out.push(`${at}: claim ${r.claim} not in plate.tempo.claim nor cited in the text`);
        if ('quote' in r) out.push(`${at}: a blank phase carries a quote`);
        continue;
      }
      // D-STRIP-QUOTEWORD: a worded phase's claim has a quote (stored verbatim as `quote`) that holds the word or its form
      if (typeof r.quote !== 'string' || !S.formIn(r.word, r.quote)) out.push(`${at}: the quote of claim ${r.claim} does not hold ${r.word}`);
      if (typeof r.says !== 'string' || !c.text.includes(r.says)) out.push(`${at}: says is not a verbatim span of the text`);
      if (!S.formIn(r.word, r.says)) out.push(`${at}: ${r.word} is not a whole word in says`);
      if (SET_LEVEL_SAYS.test(r.says ?? '')) out.push(`${at}: set-level says`);
      const d = S.directionsOf(r.says ?? ''), p = S.directionsOf(r.phase);
      if (d.length > 1) out.push(`${at}: says carries both directions`);
      if (d.length === 1 && p.length === 1 && d[0] !== p[0]) out.push(`${at}: says is ${d[0]}, the phase ${p[0]}`);
    }
    const tempo = S.tempoOf(c.rows), u = untimedCard(tempo), card = { ...u, plate: { ...u.plate, tempo: { ...u.plate.tempo, text: c.text } } };
    for (const b of V.validateCard(card, JSON.parse(read(FXQ)), { file: 'cable_lateral_raise.json', untimed: new Map([['cable_lateral_raise', c.rows]]), fallbackA: new Set(fallbackA.has(c.id) ? ['cable_lateral_raise'] : []) })) out.push(`${c.id}: ${b}`);
    const tree = join(ROOT, `docs/research/howto/cards/${c.id}.json`);
    if (existsSync(tree) && JSON.parse(readFileSync(tree, 'utf8')).plate?.tempo?.text !== c.text) out.push(`${c.id}: text differs from the tree's card`);
  }
  return out;
}

describe('A11: the rows (D-STRIP-ROWS, -SCOPE, -SAYS, D-STRIP-ALL)', () => {
  let V: any;
  beforeAll(async () => { V = await import(/* @vite-ignore */ url('tools/plates/library/research/validate.mjs')); });
  const rows = () => JSON.parse(read(ROWS));
  it('rows.json passes every row rule; its strips pass A4\'s labels; it is the verified file', () => {
    expect(rowProblems(rows(), V)).toEqual([]);
    expect(rows().research).toMatch(/^claude\/libht-research [0-9a-f]{40}$/);
    expect(createHash('sha256').update(JSON.stringify(rows())).digest('hex')).toBe(ROWS_PIN);
  });
  it('mutations, each red', () => {
    const edit = (id: string, f: (c: any) => void) => { const R = rows(); f(R.cards.find((c: any) => c.id === id)); return rowProblems(R, V); };
    const cases: [string, string[], RegExp][] = [
      ['a word not in its text', edit('front_squat', c => { c.rows[0].word = 'Quick'; }), /front_squat\.Lower: Quick is not a whole word in says/],
      ['front_squat\'s Controlled moved to Drive up', edit('front_squat', c => { c.rows[1] = { ...c.rows[0], phase: 'Drive up' }; c.rows[0] = { phase: 'Lower', move: true, blank: true, claim: 'c21' }; }), /front_squat\.Drive up: says is down, the phase up/],
      ['jump_squat given a Rest phase', edit('jump_squat', c => { c.rows.push({ phase: 'Rest', move: true, blank: true, claim: 'j9' }); }), /jump_squat\.Rest: set-level phase/],
      ['a says naming set-level advice', edit('jump_squat', c => { c.rows[1].says = '3-5 reps per set'; }), /jump_squat\.Jump: set-level says/],
      ['a row whose claim\'s quote lacks its word', edit('front_squat', c => { c.rows[0].quote = 'Some front squat training should include pauses.'; }), /front_squat\.Lower: the quote of claim c21 does not hold Controlled/],
      ['a row with no quote', edit('jump_squat', c => { delete c.rows[1].quote; }), /jump_squat\.Jump: the quote of claim j7 does not hold Explosive/],
      ['a says edited by one character', edit('reverse_lunge', c => { c.rows[0].says = 'lower slowlY '; }), /reverse_lunge\.Lower: says is not a verbatim span/],
      ['a blank phase\'s claim not cited', edit('step_up', c => { c.rows[0].claim = 'c9'; }), /step_up\.Rise: claim c9 not in plate\.tempo\.claim nor cited/],
      ['a says with both directions', edit('front_squat', c => { c.rows[0].says = 'Controlled descent, drive up'; }), /front_squat\.Lower: says carries both directions/],
    ];
    for (const [name, bad, re] of cases) expect([name, bad.some(b => re.test(b))]).toEqual([name, true]);
    const R1 = rows(); R1.cards.push({ id: 'bear_crawl', lane: 'LB10', text: 'x', claim: 'c4', rows: [{ phase: 'Walk', move: true, word: 'Controlled', says: 'controlled', claim: 'c4' }] });
    expect(rowProblems(R1, V).some(b => /are not the scope's 25, each once/.test(b))).toBe(true);
    const R2 = rows(); R2.cards.pop();
    expect(rowProblems(R2, V).some(b => /are not the scope's 25, each once/.test(b))).toBe(true);
    const R4 = rows(); R4.fallbackA[0].rows[0] = { phase: 'Lower', move: true, word: 'Controlled', says: 'Controlled descent', quote: 'control', claim: 'b7' };
    expect(rowProblems(R4, V)).toContain('bodyweight_squat: a word on a fallbackA card');
    const R5 = rows(); R5.cards.find((c: any) => c.id === 'front_squat').rows[0] = { phase: 'Lower', move: true, blank: true, claim: 'c21' };
    expect(rowProblems(R5, V)).toContain('front_squat: no word');
    const ex = S.FORMS.Explosive;
    try { S.FORMS.Explosive = ['explosive']; expect(rowProblems(rows(), V)).toContain('box_jump.Take-off: the quote of claim c3 does not hold Explosive'); } finally { S.FORMS.Explosive = ex; }
    const R3 = rows(); R3.cards[0].rows[0].word = 'Slow';
    expect(createHash('sha256').update(JSON.stringify(R3)).digest('hex')).not.toBe(ROWS_PIN);
  });
});

describe('D-STRIP-GROUPS: the LIB-STRIP gate block is one group, packed into exactly one job per time zone', () => {
  let B: any, G: any, SRC = '', TIMES: any;
  beforeAll(async () => {
    B = await import(/* @vite-ignore */ url('scripts/gate-blocks.mjs'));
    G = await import(/* @vite-ignore */ url('scripts/gate-split.mjs'));
    SRC = read('scripts/screenshot-gate.mjs'); TIMES = JSON.parse(read('scripts/gate-times.json'));
  });
  const GUARD = "if (gate.runs('LIB-STRIP'))\n";
  /** Problems with the LIB-STRIP group in a gate source: not exactly one group, or not in exactly one job per time zone. */
  const groupProblems = (src: string) => {
    const { groups, problems } = B.parseGate(src), keys = groups.map((g: any) => g.key), out = [...problems];
    const n = keys.filter((k: string) => k === 'LIB-STRIP').length;
    if (n !== 1 || src.split(GUARD).length - 1 !== 1) out.push(`LIB-STRIP is ${n} groups (${src.split(GUARD).length - 1} guards), want 1`);
    if (n) for (const tz of ['UTC', 'Pacific/Auckland']) {
      const jobs = G.planFor(keys, TIMES, TIMES.K, tz).filter((j: string[]) => j.includes('LIB-STRIP')).length;
      if (jobs !== 1) out.push(`${tz}: LIB-STRIP in ${jobs} jobs, want 1`);
    }
    return out;
  };
  it('the gate has one LIB-STRIP group, after LIB-12, in exactly one of the K jobs per time zone', () => {
    expect(groupProblems(SRC)).toEqual([]);
    const keys = B.parseGate(SRC).groups.map((g: any) => g.key);
    expect(keys.slice(-2)).toEqual(['LIB-12', 'LIB-STRIP']);
  });
  it('mutations: the block twice, and the block missing, are red', () => {
    const at = SRC.indexOf(`// LIB-STRIP: the tempo strip without seconds`), end = SRC.indexOf('\nawait gate.done();\n');
    const block = SRC.slice(at, end);
    expect(groupProblems(SRC.slice(0, end) + '\n' + block + SRC.slice(end)).length).toBeGreaterThan(0);
    expect(groupProblems(SRC.slice(0, at) + SRC.slice(end)).some(p => /LIB-STRIP is 0 groups/.test(p))).toBe(true);
  });
});
