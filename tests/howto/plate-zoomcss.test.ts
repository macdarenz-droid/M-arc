// F-PLATE-ZOOMCSS (card docs/supervisor/verify/f-plate-zoomcss-card.md, #379 "SHIP W2 QUESTION 6", ruling 6636501505):
// plate.css = golden A's gallery CSS plus zoom/inline.mjs's ZOOM_CSS (rewritten), and a batch page passes D-LIB2b-CSS
// when its CSS is golden A's, alone or led by exactly ZOOM_CSS. A1 on a real zoomed page; A2's three reds.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { beforeAll, describe, expect, it } from 'vitest';

const ROOT = new URL('../../', import.meta.url).pathname;
const url = (p: string) => new URL(`../../${p}`, import.meta.url).href;
let gen: any, css: any, Z: any, goldenCss = '', zoomPageCss = '';

beforeAll(async () => {
  [gen, css, Z] = await Promise.all(['tools/plates/gen/plates.mjs', 'tools/plates/css.mjs', 'tools/plates/library/zoom/inline.mjs'].map(p => import(/* @vite-ignore */ url(p))));
  goldenCss = css.galleryCss(readFileSync(join(ROOT, 'tests/howto/golden/technical-plates.html'), 'utf8'));
  const zb: any = await import(/* @vite-ignore */ url('tools/plates/library/zoom/build.mjs'));
  zoomPageCss = css.galleryCss((await zb.buildZoomPage()).html.toString('utf8'));
}, 300_000);

describe('F-PLATE-ZOOMCSS A1: a page with an inline zoom passes the plate.css check', () => {
  it('horizontal_leg_press\'s zoom page leads with exactly ZOOM_CSS and passes; the old check refused it', () => {
    expect(zoomPageCss.startsWith(Z.ZOOM_CSS)).toBe(true);
    expect(gen.pageCssProblem(zoomPageCss, goldenCss)).toBeNull();
    // the check on main before this card: rewriteCss(page) === rewriteCss(golden A) (gen/plates.mjs:177 at cb9a6dae)
    expect(css.rewriteCss(zoomPageCss)).not.toBe(css.rewriteCss(goldenCss));
  });
  it('a page with no inline zoom still passes (golden A\'s CSS alone)', () => {
    expect(gen.pageCssProblem(goldenCss, goldenCss)).toBeNull();
  });
  it('the committed plate.css body is rewriteCss(ZOOM_CSS + golden A\'s CSS), with every pz-* rule from ZOOM_CSS', () => {
    const body = readFileSync(join(ROOT, gen.PLATE_CSS), 'utf8').split('\n').slice(1).join('\n');
    expect(body).toBe(css.rewriteCss(Z.ZOOM_CSS + goldenCss));
    for (const k of ['pz-bg', 'pz-ring', 'pz-src', 'pz-link']) expect(body).toContain(`.${k} {`);
  });
});

describe('F-PLATE-ZOOMCSS A2: the reds', () => {
  it('an extra rule that is neither golden A\'s nor a ZOOM_CSS rule is refused', () => {
    expect(gen.pageCssProblem(Z.ZOOM_CSS + goldenCss + '\n.plate .x-extra { fill: red; }\n', goldenCss)).not.toBeNull();
    expect(gen.pageCssProblem(goldenCss + '\n.plate .x-extra { fill: red; }\n', goldenCss)).not.toBeNull();
  });
  it('a missing pz-* rule is refused', () => {
    const lines = Z.ZOOM_CSS.split('\n').filter(Boolean);
    expect(lines).toHaveLength(4);
    for (const drop of lines) {
      const partial = lines.filter((l: string) => l !== drop).join('\n') + '\n';
      expect(gen.pageCssProblem(partial + goldenCss, goldenCss)).toMatch(/pz-\* rules/);
    }
  });
  it('a hand-edited pz-* rule that differs from inline.mjs\'s bytes is refused', () => {
    const edited = Z.ZOOM_CSS.replace('stroke-width: 1.25', 'stroke-width: 1.5');
    expect(edited).not.toBe(Z.ZOOM_CSS);
    expect(gen.pageCssProblem(edited + goldenCss, goldenCss)).toMatch(/pz-\* rules/);
  });
});
