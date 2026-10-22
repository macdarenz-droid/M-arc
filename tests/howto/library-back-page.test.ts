// LIB-6-PM S5-L (D-LIB5-PAGE, as D-LIB6PM-FIXTURE and D-LIB6PM-CAP amend it; PM-A7): E1's back-flagged layers page,
// built through build-layers-page.mjs only (the staged tree's copy, so its back-box.mjs reads the tree's research card;
// LIB-2b's staged tree, tests/howto/fixtures/lib5/back-page.mjs), shows the
// owner-approved back box exactly as src/howto/red-flag-back.ts holds it, linked from its row, within the box reach
// checks under BOX-CAP's named limit (imported, never copied) and within the sheet's 450 visible words, which count the
// box because golden B's copy-lint drops 'back' (copy-lint.mjs:313).
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { RED_FLAG_BACK } from '../../src/howto/red-flag-back';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let F: any, B: any, CL: any, LINT: any, CAPS: any, BB: any, shared: any, root = '', page = '';
const tmps: string[] = [];
type Box = { name: string; now: string; doctor: string };
const unescape = (s: string) => s.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&amp;/g, '&');

/** The back box as the page prints it: the texts of the `<p>` inside `#<pre>-redflag-back`, and how many blocks hold that id. */
function pageBox(html: string, pre: string) {
  const id = `id="${pre}-redflag-back"`, count = html.split(id).length - 1, at = html.indexOf(id);
  const block = at < 0 ? '' : html.slice(at, html.indexOf('</div></div>', at));
  return { count, ps: [...block.matchAll(/<p[^>]*>([^<]*)<\/p>/g)].map(m => unescape(m[1] ?? '')) };
}
/** The page's back box as a Box (throws unless the block holds exactly three texts). */
function boxOnPage(html: string, pre: string): Box {
  const [name, now, doctor, ...rest] = pageBox(html, pre).ps;
  if (name === undefined || now === undefined || doctor === undefined || rest.length) throw new Error('S5-L: the back box does not hold exactly three <p>');
  return { name, now, doctor };
}
/** The sheet's visible total with the back box (lintHowto's total drops 'back', so its words are added here). */
const sheetTotal = (M: any, box: Box) => CL.lintHowto(M, shared).words.total + CL.words([box.name, box.now, box.doctor].join(' '));
/** S5-L's word row: [] when the sheet with the back box is within VISIBLE_WORDS_MAX. */
const wordProblems = (M: any, box: Box) => { const n = sheetTotal(M, box); return n > CL.VISIBLE_WORDS_MAX ? [`visible words ${n} > ${CL.VISIBLE_WORDS_MAX}`] : []; };
/** D-LIB5-REACH on the page's box, with the box's shared-card key (BOX-CAP's named limit, D-BOXCAP-WIRE). */
const reach = (box: Box, key?: string) => [...LINT.boxReach('page:redFlag(back)', box, [], key), ...LINT.backBoxRules('page:redFlag(back)', { ...box, claim: RED_FLAG_BACK.claim })];

/** A copy of the tree's back-flagged How-to with `n` words added to one risk line (S5-L's boundary variants only). */
function variant(n: number, tag: string) {
  const from = "text: 'Wide grips are linked to shoulder pinching.'";
  const text = B.replaceOnce(readFileSync(join(root, F.HOWTO), 'utf8'), from, `text: 'Wide grips are linked to shoulder pinching.${' word'.repeat(n)}'`);
  const file = join(root, F.HOWTO.replace('.howto.mjs', `.${tag}.howto.mjs`));
  writeFileSync(file, text);
  return import(/* @vite-ignore */ F.url(root, F.HOWTO.replace('.howto.mjs', `.${tag}.howto.mjs`)));
}

describe('S5-L: the back box on E1\'s back-flagged layers page', { timeout: 300_000 }, () => {
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    B = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/back-page.mjs'));
    root = F.stageTree(); tmps.push(root);
    B.toBackPage(root, F.HOWTO);
    CL = await import(/* @vite-ignore */ F.url(root, 'tools/plates/layers/artifact/copy-lint.mjs'));
    shared = await import(/* @vite-ignore */ F.url(root, 'tools/plates/layers/howto/shared.mjs'));
    LINT = await import(/* @vite-ignore */ url('tools/plates/library/lint/index.mjs'));
    CAPS = await import(/* @vite-ignore */ url('tools/plates/library/lint/box-caps.mjs'));
    BB = await import(/* @vite-ignore */ url('tools/plates/library/shared/back-box.mjs'));
    const { layersSpecOf } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/layers-spec.mjs'));
    const { buildLayersPage } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/build-layers-page.mjs'));
    const stage = mkdtempSync(join(tmpdir(), 'lib6pm-s5l-')); tmps.push(stage);
    page = (await buildLayersPage(layersSpecOf(F.BATCH, { stageDir: stage, root }))).toString('utf8');
  }, 300_000);
  afterAll(() => { for (const t of tmps) rmSync(t, { recursive: true, force: true }); });

  it('#<pre>-redflag-back holds exactly three <p>: RED_FLAG_BACK\'s name, now and doctor', () => {
    const { count, ps } = pageBox(page, F.CHROME);
    expect(count).toBe(1);
    expect(ps).toEqual([RED_FLAG_BACK.name, RED_FLAG_BACK.now, RED_FLAG_BACK.doctor]);
  });

  it('the row\'s rf-link has data-flag="back" and aria-controls="<pre>-redflag-back"', () => {
    const links = [...page.matchAll(/<button type="button" class="rf-link"[^>]*>/g)].map(m => m[0]).filter(b => b.includes('data-flag="back"'));
    expect(links).toHaveLength(1);
    expect(links[0]).toContain(`aria-controls="${F.CHROME}-redflag-back"`);
  });

  it('D-LIB5-REACH on the page\'s box, with the key \'back-pain-box\' (BOX-CAP\'s named limit)', () => {
    expect(BB.BACK_BOX_KEY).toBe('back-pain-box');
    expect(reach(boxOnPage(page, F.CHROME), BB.BACK_BOX_KEY)).toEqual([]);
  });

  it('lintHowto\'s words.total plus the back box is within VISIBLE_WORDS_MAX; the variant at exactly 450 with the box is green', async () => {
    const M = await import(/* @vite-ignore */ F.url(root, F.HOWTO)), box = boxOnPage(page, F.CHROME);
    expect(CL.lintHowto(M, shared).words.total).toBe(390);
    expect(sheetTotal(M, box)).toBe(440);
    expect(wordProblems(M, box)).toEqual([]);
    const at450 = await variant(CL.VISIBLE_WORDS_MAX - sheetTotal(M, box), 'w450');
    expect(sheetTotal(at450, box)).toBe(CL.VISIBLE_WORDS_MAX);
    expect(wordProblems(at450, box)).toEqual([]);
  });

  it('red: one box byte drifted; the back box at its named limit + 1; another box at 31; a sheet whose words.total is 450', async () => {
    const box = { name: RED_FLAG_BACK.name, now: RED_FLAG_BACK.now, doctor: RED_FLAG_BACK.doctor };
    // one byte of the research card's box text drifted: the page no longer equals RED_FLAG_BACK
    const card = join(root, BB.BACK_CARD), s = readFileSync(card, 'utf8');
    writeFileSync(card, B.replaceOnce(s, 'See a doctor.', 'See a doctor!'));
    try {
      const { layersSpecOf } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/layers-spec.mjs'));
      const { buildLayersPage } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/build-layers-page.mjs'));
      const stage = mkdtempSync(join(tmpdir(), 'lib6pm-s5l-')); tmps.push(stage);
      const drifted = pageBox((await buildLayersPage(layersSpecOf(F.BATCH, { stageDir: stage, root }))).toString('utf8'), F.CHROME).ps;
      expect(drifted).not.toEqual([RED_FLAG_BACK.name, RED_FLAG_BACK.now, RED_FLAG_BACK.doctor]);
    } finally { writeFileSync(card, s); }
    // the back box at the named limit + 1 words, the limit imported from box-caps.mjs (never copied)
    const limit = CAPS.NAMED_BOX_CAPS[BB.BACK_BOX_KEY], n = CL.words([box.name, box.now, box.doctor].join(' '));
    const over = { ...box, doctor: `${box.doctor}${' word'.repeat(limit + 1 - n)}` };
    expect(CL.words([over.name, over.now, over.doctor].join(' '))).toBe(limit + 1);
    expect(reach(over, BB.BACK_BOX_KEY).map((x: any) => x.rule)).toContain(`red-flag box > ${limit} words`);
    // another box (the wrist box's key has no named limit) at 31 words: the default 30 holds
    const wrist = { name: 'Wrist pain', now: `See a doctor today if${' word'.repeat(31 - 10)}.`, doctor: 'See a doctor.' };
    expect(CL.words([wrist.name, wrist.now, wrist.doctor].join(' '))).toBe(31);
    expect(LINT.boxReach('redFlag(wrist)', wrist, [], undefined).map((x: any) => x.rule)).toContain('red-flag box > 30 words');
    // a sheet whose words.total is already 450: only the back box's extra words make it red
    const M = await import(/* @vite-ignore */ F.url(root, F.HOWTO));
    const full = await variant(CL.VISIBLE_WORDS_MAX - CL.lintHowto(M, shared).words.total, 't450');
    expect(CL.lintHowto(full, shared).words.total).toBe(CL.VISIBLE_WORDS_MAX);
    expect(wordProblems(full, box)).toEqual([`visible words ${CL.VISIBLE_WORDS_MAX + n} > ${CL.VISIBLE_WORDS_MAX}`]);
  });
});
