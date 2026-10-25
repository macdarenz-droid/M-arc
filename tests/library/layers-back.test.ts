// LIB-6-PM PM-A4 and PM-A5 (D-LIB5-PAGE, D-LIB6PM-ANCHORS, D-LIB6PM-WAITS): the back box on the layers page. In LIB-2b's
// staged trees, E1's How-to made back-flagged by tests/howto/fixtures/lib5/back-page.mjs (D-LIB6PM-FIXTURE):
//   - with LIB-5's placeholder back-box.mjs the page build rejects with the child's `Error: <id>: LIB-5: …` line;
//   - with a stand-in box (neutral text, never the research wording) the page shows exactly one back box, linked from
//     the row, through the RF, FLAG and holder patches;
//   - E1's unflagged page never loads back-box.mjs and stays byte for byte the committed page.
// The anchor of each new patch is covered by tests/library/closeups.test.ts:66-73 (every patch runs for every plan).
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
/* eslint-disable @typescript-eslint/no-explicit-any */
let F: any, B: any, flagged = '', plain = '';
const tmps: string[] = [];
const BOX = 'tools/plates/library/shared/back-box.mjs';
/** LIB-5's placeholder back-box.mjs (#244 @ 1d1fe9ea, all 15 lines). */
const PLACEHOLDER = `// LIB-5 (Do 4, D-LIB5-BOX, S4-P): the back-pain red-flag box, fail-closed until the owner answers decision 6 (plan 8
// item 6). It holds no box text and reads no research file, so no wording can reach src/ or the APK. library-gate.mjs
// calls refuseBack for every shipped row, and LIB-6-PM's page patch calls backBox() lazily (D-LIB5-PAGE). In Do 9
// backBox() keeps its name and signature and returns the answered box.
export const BACK_BOX_WAITS = 'LIB-5: back box waits for owner decision 6 (plan 8 item 6)';

/** The back box (a RedFlagBlock from Do 9). Throws until then. */
export function backBox() {
  throw new Error(BACK_BOX_WAITS);
}

/** Throws, naming the id, when a row's riskFlags link the back box. */
export function refuseBack(id, riskFlags) {
  if (Array.isArray(riskFlags) && riskFlags.includes('back')) throw new Error(\`\${id}: \${BACK_BOX_WAITS}\`);
}
`;
const WAITS_LINE = 'Error: lib_cable_lateral_raise: LIB-5: back box waits for owner decision 6 (plan 8 item 6)';
/** A stand-in box: neutral text, the shape of a RedFlagBlock. */
const STAND_IN = `export function backBox() {
  return { name: 'Stand-in name', now: 'Stand-in now line.', doctor: 'Stand-in doctor line.', claim: { tags: ['CONSENSUS'], sources: ['nhs-back'] } };
}
`;

/** The layers page of the tree's E1 batch, built by the tree's own builder (so BACK_BOX_URL is the tree's file). */
async function build(root: string) {
  const { layersSpecOf } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/layers-spec.mjs'));
  const { buildLayersPage } = await import(/* @vite-ignore */ F.url(root, 'tools/plates/library/build-layers-page.mjs'));
  const stage = mkdtempSync(join(tmpdir(), 'lib6pm-back-')); tmps.push(stage);
  return buildLayersPage(layersSpecOf(F.BATCH, { stageDir: stage, root }));
}

describe('LIB-6-PM back box on the layers page', { timeout: 300_000 }, () => {
  beforeAll(async () => {
    F = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib2b/fixture.mjs'));
    B = await import(/* @vite-ignore */ url('tests/howto/fixtures/lib5/back-page.mjs'));
    flagged = F.stageTree(); tmps.push(flagged);
    B.toBackPage(flagged, F.HOWTO);
    plain = F.stageTree(); tmps.push(plain);
  }, 300_000);
  afterAll(() => { for (const t of tmps) rmSync(t, { recursive: true, force: true }); });

  it('the back-flagged page rejects with LIB-5\'s placeholder: the child prints Error: <id>: BACK_BOX_WAITS', async () => {
    writeFileSync(join(flagged, BOX), PLACEHOLDER);
    const err = await build(flagged).then(() => null, (e: Error) => e);
    expect(err, 'the back-flagged page must not build while the box waits').toBeInstanceOf(Error);
    expect(err!.message.split('\n')).toContain(WAITS_LINE);
    expect(err!.message).not.toMatch(/red flag back missing|no shared red flag back/);
  });

  it('with a box, the back-flagged page shows exactly one back box, linked from the row', async () => {
    writeFileSync(join(flagged, BOX), STAND_IN);
    const page = (await build(flagged)).toString('utf8'), pre = F.CHROME;
    const boxes = page.split(`id="${pre}-redflag-back"`).length - 1;
    expect(boxes).toBe(1);
    const at = page.indexOf(`id="${pre}-redflag-back"`), block = page.slice(at, page.indexOf('</div></div>', at));
    expect([...block.matchAll(/<p[^>]*>([^<]*)<\/p>/g)].map(m => m[1])).toEqual(['Stand-in name', 'Stand-in now line.', 'Stand-in doctor line.']);
    expect(page).toMatch(new RegExp(`class="rf-link" id="${pre}-row-[\\w-]+-flag" data-flag="back" aria-controls="${pre}-redflag-back"`));
    expect(page).not.toContain(`${pre}-redflag-shoulder`);
  });

  it('E1\'s unflagged page never loads back-box.mjs and is byte for byte the committed page', async () => {
    writeFileSync(join(plain, BOX), `throw new Error('back-box.mjs loaded');\n${PLACEHOLDER}`);
    expect((await build(plain)).equals(readFileSync(F.PAGE_FIXTURE))).toBe(true);
  });
});
