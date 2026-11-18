// LIB-PLATEFIX-6d smith_machine_squat (F-SMITHSQ-TEMPO; card lib-platefix-6c-card.md Row 9, A18, m21; rulings
// D-PF6C-PAUSE, D-PF6D-RECOPIED). W10 round 1 L6 (#434, c2 and c3): the tempo strip read LOWER 3 s / DRIVE UP 1 s and
// dropped c22's 1 s bottom pause (Motra 3-1-1: eccentric, bottom pause, concentric); the fix "Brace and keep your chest
// forward" can read as leaning forward (c5 "chest lifted", c6 "chest up").
//  - Tempo in decline's Pause form (lb2/tempo.json, D-LIB10-NOTE Q5): a quoted 1 s constant between Lower and Drive up
//    in lb6/tempo.json r2.constants, its quote verbatim in the card's quotes file for its source; the card's machine key
//    `tempo` equals the spec's strip.
//  - Plate text (the D-SHIP-W5-PLATETEXT / D-W10-JSLAND2 form): of main's approved fragments (lb06.json entry 16, the
//    'owner' D-OWNER-REPIN pin) only `tempo` moves.
//  - The sheet's back fix reads "Brace and keep your chest up."; the feel line (D-TEXT-GOLDEN lockout cue) is main's.
//  - The card differs from main's only in `tempo` and handlingMistakes[2].fix; lb6/cards.sha.json r2 pins the new canon
//    sha and a `recopied` record { card, from, to, ruling, keys, head }.
// Red on the base (ff75bf0e): the strip is Lower 3 / Drive up 1 (no Pause), no r2 constant, the tempo fragment equals
// main's, the sheet and card read "chest forward", cards.sha r2 is 2020a06e… with no record.
// After: Lower 3 / Pause 1 / Drive up 1; only fragments.tempo differs from entry 16; "chest up"; r2 7eb78ee2….
import { createHash } from 'node:crypto';
import { execFile } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { promisify } from 'node:util';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const json = (p: string) => JSON.parse(readFileSync(p, 'utf8'));
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const T = 600_000;
const CARD = 'docs/research/howto/cards/smith_machine_squat.json';
const KEYS3 = ['plateFacts', 'tempo', 'topFault'];
const canon = (c: any) => { const o = { ...c }; for (const k of KEYS3) delete o[k]; return `${JSON.stringify(o, null, 2)}\n`; };
const STRIP = [{ phase: 'Lower', s: 3, move: true }, { phase: 'Pause', s: 1 }, { phase: 'Drive up', s: 1, move: true }];
const MAIN_TEMPO = [{ phase: 'Lower', s: 3, move: true }, { phase: 'Drive up', s: 1, move: true }];
const FIX = 'Brace and keep your chest up. Use a manageable weight.', MAIN_FIX = 'Brace and keep your chest forward. Use a manageable weight.';
// main ff75bf0e: JSON.stringify(card) sha, the r2 canon pin, the feel line
const MAIN_CARD_JSON = '7093f4e3ba378a25e2a1216379af7a59f561bddf5f00c3e749918cf4d5756ace';
const MAIN_CANON = '2020a06e6831e8159a9b4e07941e0a9d15c8518e530783323f2badba4be420d1';
const NEW_CANON = '7eb78ee2180819f3d9ea3a16a5f642163e0830af09150c5ff68775200775ade0';
const FEEL = 'You should feel this in the front of your thighs and your glutes. Stop just short of locking your knees.';
const RECOPIED = { card: CARD, from: MAIN_CANON, to: NEW_CANON, ruling: 'D-PF6C-PAUSE', keys: ['tempo', 'handlingMistakes[2].fix'], head: 'https://github.com/macdarenz-droid/M-arc/pull/438' };

/** The card with the two named edits undone, against main's card. [problems] */
const cardProblems = (c: any) => {
  const bad: string[] = [];
  if (JSON.stringify(c.tempo) !== JSON.stringify(STRIP)) bad.push('tempo');
  if (c.handlingMistakes?.[2]?.fix !== FIX) bad.push('fix');
  const back = structuredClone(c); back.tempo = MAIN_TEMPO; if (back.handlingMistakes?.[2]) back.handlingMistakes[2].fix = MAIN_FIX;
  if (sha(JSON.stringify(back)) !== MAIN_CARD_JSON) bad.push('another key moved');
  if (sha(canon(c)) !== NEW_CANON) bad.push('canon sha');
  return bad;
};
/** lb6/tempo.json r2's Pause constant: s 1 on claim c22, its quote verbatim in the quotes file for its source. [problems] */
const constProblems = (tj: any, quotes: any) => {
  const bad: string[] = [], c = tj.r2?.constants ?? {}, k = c['smith_machine_squat.Pause'];
  if (JSON.stringify(Object.keys(c)) !== '["smith_machine_squat.Pause"]') bad.push('constants: not the one ruled');
  if (!k || k.s !== 1 || k.claim !== 'c22' || k.ruling !== 'D-PF6C-PAUSE') bad.push('Pause: s, claim or ruling');
  if (!quotes.quotes.some((q: any) => q.claim === k?.claim && q.source === k?.source && q.text === k?.quote && q.status === 'verbatim')) bad.push('Pause: quote not verbatim');
  const rows = tj.r2?.ids?.smith_machine_squat?.rows ?? [];
  if (JSON.stringify(rows.map((r: any) => [r.phase, r.constant ?? r.from])) !== JSON.stringify([['Lower', 'down'], ['Pause', 'smith_machine_squat.Pause'], ['Drive up', 'up']])) bad.push('rows');
  if (Object.keys(tj.constants ?? {}).length) bad.push('top-level constants: not empty');
  return bad;
};

describe('PF6d smith_machine_squat: the bottom pause (D-PF6C-PAUSE) and "chest up" (A18, m21)', { timeout: T }, () => {
  let spec: any, howto: any;
  beforeAll(async () => {
    spec = (await import(/* @vite-ignore */ lib('specs/smith_machine_squat.mjs'))).default;
    howto = (await import(/* @vite-ignore */ lib('howto/lib_smith_machine_squat.howto.mjs'))).default;
  }, T);
  it('the spec strip is Lower 3 / Pause 1 / Drive up 1; the card\'s tempo key equals it', () => {
    expect(spec.tempo).toEqual(STRIP);
    expect(json(CARD).tempo).toEqual(spec.tempo);
  });
  it('lb6/tempo.json r2: the Pause constant, its row between Lower and Drive up, its quote verbatim; mutations (Pause gone, s 2, quote not verbatim) are red', () => {
    const tj = json('tools/plates/library/lb6/tempo.json'), q = json('docs/research/howto/quotes/smith_machine_squat.json');
    expect(constProblems(tj, q)).toEqual([]);
    const gone = structuredClone(tj); gone.r2.ids.smith_machine_squat.rows.splice(1, 1); delete gone.r2.constants;
    expect(constProblems(gone, q)).toContain('rows');
    const s2 = structuredClone(tj); s2.r2.constants['smith_machine_squat.Pause'].s = 2;
    expect(constProblems(s2, q)).toEqual(['Pause: s, claim or ruling']);
    const nv = structuredClone(tj); nv.r2.constants['smith_machine_squat.Pause'].quote = '3-1-1 tempo';
    expect(constProblems(nv, q)).toEqual(['Pause: quote not verbatim']);
  });
  it('the sheet\'s back fix reads "chest up"; the feel line is main\'s, byte for byte; m21: "chest forward" back is red', () => {
    const back = howto.mistakes.find((m: any) => m.key === 'back');
    expect(back.fix).toBe(FIX);
    expect(howto.feel.feelLine).toBe(FEEL);
    expect(MAIN_FIX).not.toBe(back.fix);   // m21 (sheet)
  });
  it('the card differs from main\'s only in tempo and handlingMistakes[2].fix; cards.sha r2 pins its canon sha with the recopied record; m21 (card) is red', () => {
    const c = json(CARD), r2 = json('tools/plates/library/lb6/cards.sha.json').r2;
    expect(cardProblems(c)).toEqual([]);
    expect(r2.cards.smith_machine_squat).toBe(NEW_CANON);
    expect(r2.recopied).toEqual({ smith_machine_squat: RECOPIED });
    const m21 = structuredClone(c); m21.handlingMistakes[2].fix = MAIN_FIX;
    expect(cardProblems(m21)).toEqual(['fix', 'canon sha']);
    const other = structuredClone(c); other.handlingMistakes[1].fix += ' ';
    expect(cardProblems(other)).toEqual(['another key moved', 'canon sha']);
  });
});

describe('PF6d smith_machine_squat plate text: only the tempo fragment moves against main\'s approved pin (lb06.json entry 16)', { timeout: T }, () => {
  let golden: any, html: string, entry: any;
  beforeAll(async () => {
    golden = await import(/* @vite-ignore */ lib('../golden.mjs'));
    const script = `const b = await import(${JSON.stringify(lib('lb6/build.mjs'))});
process.stdout.write((await b.buildLb6Page({ all: b.lb6All(), ids: ['lib_smith_machine_squat'] })).html.toString('utf8'));`;
    html = (await promisify(execFile)(process.execPath, ['--input-type=module', '-e', script], { maxBuffer: 1 << 28 })).stdout;
    entry = json('tests/howto/golden/library/lb06.json').entries[16];
  }, T);
  /** The fragments that differ from entry 16's. */
  const moved = (h: string) => { const p = golden.extractPlates(h).find((x: any) => x.chromeId === 'smith-machine-squat'), f = golden.fragmentsOf(p);
    return Object.keys(entry.fragments).filter(k => f[k] !== entry.fragments[k]); };
  it('entry 16 is main\'s owner pin of the squat plate', () => {
    expect([entry.kind, entry.id, entry.approvedBy, entry.decision]).toEqual(['plate', 'lib_smith_machine_squat', 'owner', 'D-OWNER-REPIN']);
  });
  it('only fragments.tempo moves, and the strip names the 1 s Pause; m21: a byte moved outside the tempo fragment is red', () => {
    expect(moved(html)).toEqual(['tempo']);
    const p = golden.extractPlates(html).find((x: any) => x.chromeId === 'smith-machine-squat');
    expect(p.tempo).toMatch(/Pause/);
    expect(moved(html.replace(p.alt, p.alt.replace(/e/, 'E')))).toEqual(['tempo', 'alt']);
  });
});
