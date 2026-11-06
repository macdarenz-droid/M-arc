// LIB-PLATEFIX-3 engine items, library side only (ADDENDUM ruled #405 6683319630; golden B and the vendor engine are
// never touched). E1: an empty feel list prints no "If you feel it in…" heading (build-layers-page.mjs patch). E2: a
// sheet whose zooms draw a `path` guide gets the path CSS (render/closeup/zoom.mjs cssFor), so its head takes the
// accent or fault token instead of the browser's black. Every committed library layers page rebuilds byte-equal with
// both (pilot-a afd5d413…, pilot-b ae7fd155…, pilot-b2 7c66d68e…; recorded on the PR).
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let blp: any, zoom: any, css: any;
beforeAll(async () => {
  [blp, zoom, css] = await Promise.all(['build-layers-page.mjs', 'render/closeup/zoom.mjs', 'render/closeup/zoom-css.mjs'].map(f => import(/* @vite-ignore */ lib(f))));
}, 600_000);
const VENDORED = () => readFileSync('tools/plates/layers/artifact/howto-layers.mjs', 'utf8');
/** The feel section's heading term from a howto-layers source, evaluated for `rows` (rowsHtml 'R'). */
const headTerm = (src: string, rows: unknown[]) => {
  const i = src.indexOf('If you feel it in…'), a = src.lastIndexOf('\n', i), b = src.indexOf('\n', i);
  const line = src.slice(a + 1, b).trim().replace(/^\+\s*/, '');
  return new Function('F', 'rowsHtml', `return ${line};`)({ rows }, 'R');
};

describe('PF3 E1: no "If you feel it in…" heading over an empty feel list', () => {
  it('the vendored line is there exactly once, as FEEL_ROWS_HEAD (the patch anchor)', () => {
    expect(VENDORED().split(blp.FEEL_ROWS_HEAD).length - 1).toBe(1);
  });
  it('patched: rows -> the vendored bytes; no rows -> nothing', () => {
    const src = blp.patchHowtoLayers(VENDORED(), blp.planOf(blp.GOLDEN_B_SPEC));
    const want = '<h5 class="eyebrow fr-head">If you feel it in…</h5><ul class="fr-list">R</ul>';
    expect(headTerm(src, [{}])).toBe(want);
    expect(headTerm(src, [])).toBe('');
  });
  it('mutation: the unpatched vendored source prints the heading over an empty list (red)', () => {
    expect(headTerm(VENDORED(), [])).not.toBe('');
  });
});

describe('PF3 E2: path guides get the path CSS (Silent Black arrowheads)', () => {
  const withPath = { zooms: [{ kind: 'posture', guides: [{ kind: 'path', role: 'wrong', pts: [[0, 0, 0], [0, 0.1, 0]] }] }] };
  const noPath = { zooms: [{ kind: 'posture', guides: [{ kind: 'level' }] }, { kind: 'hand' }] };
  it('a sheet with a path guide and no `path` option gets path: true; the CSS then styles .z-path-head with the tokens', () => {
    const o = { thumb: 'plain' }, got = zoom.cssFor(o, withPath);
    expect(got).toEqual({ thumb: 'plain', path: true });
    expect(css.zoomCss(got)).toMatch(/\.z-path-head\.m \{ stroke: var\(--mistake\)/);
    expect(css.zoomCss(o)).not.toMatch(/z-path-head/);   // mutation: the page's own options leave the head unstyled (black)
  });
  it('no path guide, or `path` already set: the options are returned unchanged (the same object, so no bytes move)', () => {
    const o = { thumb: 'plain' }, p = { thumb: 'plain', path: true };
    expect(zoom.cssFor(o, noPath)).toBe(o);
    expect(zoom.cssFor(p, withPath)).toBe(p);
    expect(zoom.cssFor(undefined, { zooms: [] })).toBe(undefined);
  });
});

// LIB-PLATEFIX-3 E1/E2 [golden update] (#405 6684669717 item 18, D-BODYMAP-LIB form): the 22 library MANIFEST rows re-pin
// exactly the two builder files this card changes; crop-projection.test.ts and lib-shapes.test.ts blank zoom.mjs's key on
// the strength of this block (build-layers-page.mjs's key is already checked against its file there).
// D-PF3-W3MERGE: after W3 (main 62d3dcb6) the library MANIFEST has 35 rows (W3's 13 added); was 22, now 35, each row still checked
describe('PF3 E1/E2 MANIFEST re-pin', () => {
  it('every one of the 35 rows pins the current render/closeup/zoom.mjs and build-layers-page.mjs', () => {
    const sha = (p: string) => createHash('sha256').update(readFileSync(p)).digest('hex');
    const m = JSON.parse(readFileSync('tools/plates/library/MANIFEST.json', 'utf8'));
    const rows = Object.entries<any>(m.rows);
    expect(rows).toHaveLength(35);
    for (const k of ['tools/plates/library/render/closeup/zoom.mjs', 'tools/plates/library/build-layers-page.mjs'])
      for (const [id, r] of rows) expect(r.files[k], `${id} ${k}`).toBe(sha(k));
  });
});
