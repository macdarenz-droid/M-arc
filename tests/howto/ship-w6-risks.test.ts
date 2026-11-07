// LIB-SHIP W6 D-SHIP-W6-RISKS (#393 6703065396): ht10DomProbe's C19 expects exactly the row's riskFlags.length red-flag
// blocks (tools/plates/library/fidelity.mjs riskCountOf), with the disclaimer after the last block; `true` keeps the
// old "at least one" rule for golden B's 8. The four ruled reds run the real probe in Chromium on a minimal sheet.
import { chromium, type Browser } from 'playwright';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url).pathname;
const DISC = 'Disclaimer text.';
const block = (f: string) => `<div class="redflag" role="note" id="x-redflag-${f}" tabindex="-1"><div><p class="rf-name">${f}</p></div></div>`;
const page = (blocks: string[], discFirst = false) => {
  const disc = `<p class="ht-disclaimer" id="x-disclaimer">${DISC}</p>`;
  const risks = `<section class="hw-sec risks"><ul class="rk-list"><li>r</li></ul>${blocks.join('')}</section>`;
  return `<!doctype html><dialog class="sheet ht" open><div class="sheet-panel">${discFirst ? disc + risks : risks + disc}</div></dialog>`;
};
let browser: Browser, ht10DomProbe: any;
const riskCountOf = async (root: string, id: string): Promise<number> =>
  (await import(/* @vite-ignore */ new URL('../../tools/plates/library/fidelity.mjs', import.meta.url).href)).riskCountOf(root, id);
beforeAll(async () => {
  ({ ht10DomProbe } = await import(/* @vite-ignore */ new URL('../../tools/plates/fidelity/harness.mjs', import.meta.url).href));
  browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || '/opt/pw-browsers/chromium' }); }, 60_000);
afterAll(async () => { await browser?.close(); });
const c19 = async (html: string, expectRisks: number | boolean) => {
  const p = await browser.newPage();
  try {
    await p.setContent(html);
    const d: any = await p.evaluate(ht10DomProbe as any, [[], [], [], DISC, expectRisks, false, 0]);
    return (d.problems as string[]).filter(x => x.startsWith('C19'));
  } finally { await p.close(); }
};

describe('LIB-SHIP W6 D-SHIP-W6-RISKS: C19 counts the row\'s own red flags', () => {
  it('green: one flag and one block; no flag and no block; the 8\'s `true` with a block', async () => {
    expect(await c19(page([block('shoulder')]), 1)).toEqual([]);
    expect(await c19(page([]), 0)).toEqual([]);
    expect(await c19(page([block('wrist')]), true)).toEqual([]);
  }, 60_000);
  it('red 1: a flagged row with its block removed', async () => {
    expect(await c19(page([]), 1)).toEqual(['C19: 0 .redflag block(s), expected 1 (riskFlags)']);
    expect(await c19(page([block('shoulder')]), 2)).toEqual(['C19: 1 .redflag block(s), expected 2 (riskFlags)']);
  }, 60_000);
  it('red 2: a row with no flags and a stray block', async () => {
    expect(await c19(page([block('shoulder')]), 0)).toEqual(['C19: 1 .redflag block(s), expected 0 (riskFlags)']);
  }, 60_000);
  it('red 3: a flagged row whose disclaimer comes before its last block', async () => {
    expect(await c19(page([block('shoulder')], true), 1)).toEqual(['C19: the disclaimer is not after the last .redflag']);
  }, 60_000);
  it('red 4: the old rule (`true` for every id) is red on machine_lateral_raise\'s no-flag sheet, which the row count passes', async () => {
    expect(await riskCountOf(ROOT, 'lib_machine_lateral_raise')).toBe(0);
    expect(await c19(page([]), true)).toEqual(['C19: no .redflag block before the disclaimer']);
    expect(await c19(page([]), await riskCountOf(ROOT, 'lib_machine_lateral_raise'))).toEqual([]);
  }, 60_000);
  it('the other 6 shipped W6 ids expect their sheets\' own counts (pike_push_up has two flags)', async () => {
    const ids = ['machine_crunch', 'cable_lateral_raise', 'dumbbell_front_raise', 'face_pull', 'incline_push_up', 'pike_push_up'];
    expect(await Promise.all(ids.map(i => riskCountOf(ROOT, `lib_${i}`)))).toEqual([1, 1, 1, 1, 1, 2]);
  });
});
