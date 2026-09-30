// HT-7 plugin: golden B's posture close-ups (S3, right next to wrong) -> src/howto/generated/posture-<chromeId>.ts, and
// the page's crop-background rule -> src/slices/howto/css/posture.css. Found by glob (no registry line).
//
// Golden B draws two posture close-ups per exercise (16). Its crops are re-renders with their own ids, labels, nested
// `<svg>` and `clip-path` (critic fix 3), so nothing is cut or redrawn here: each chunk carries
//   - `panels`: {key: the close-up's `<div class="zx" …>` block}, cut byte for byte from the golden-B page built from
//     the vendored, hash-locked layers (tools/plates/layers.mjs), after the page is checked against its approved sha256;
//   - `zdots`: the page's one hidden dot pattern (`ZDOTS`, howto-layers.mjs) that most crops fill their background
//     with (`url(#zdots)`), proven to be in the page verbatim; Posture.tsx mounts it once per document;
//   - an import of `css/zoom-<chromeId>.css` (HT-6 generates it: the exercise's scoped close-up rules). Never duplicated.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { ROOT, sha256 } from '../lib/inputs.mjs';
import { LAYERS, PAGE_SHA256, buildLayerPage, cleanupMirror, makeMirror, readManifest } from '../layers.mjs';
import { galleryCss } from '../css.mjs';
import { chromeRules, divAt, howtoCss, rewrite } from './hands.mjs';

export const PLATES_JSON = 'tools/plates/plates.json';
export const inputs = () => [
  ...Object.keys(readManifest().files).map(p => `tools/plates/layers/${p}`),
  'tools/plates/layers/MANIFEST.json', 'tools/plates/layers.mjs', 'tools/plates/css.mjs', 'tools/plates/gen/hands.mjs', PLATES_JSON,
];

/** The page's rule for the dot pattern's dots (HOWTO_CSS), the only page rule the posture crops need beyond HT-6's. */
export const POSTURE_SELECTORS = ['.zdot'];

/** The posture close-up panels of one exercise, in page order: [{ key, panel }], each exactly as the page holds it. */
export function posturePanels(html, id) {
  const out = [], re = new RegExp(`<div class="zx" id="${id}-zoom-([a-z0-9-]+)" data-zoom="([a-z0-9-]+)"`, 'g');
  for (const m of html.matchAll(re)) {
    if (m[2] === 'hand') continue;
    if (m[1] !== m[2]) throw new Error(`zooms: ${id}: panel id ${m[1]} != data-zoom ${m[2]}`);
    if (out.some(o => o.key === m[2])) throw new Error(`zooms: ${id}: two ${m[2]} close-ups`);
    out.push({ key: m[2], panel: divAt(html, m.index) });
  }
  if (!out.length) throw new Error(`zooms: ${id}: no posture close-up in the golden-B page`);
  return out;
}

const lit = s => JSON.stringify(s);

export async function outputs() {
  const rows = JSON.parse(readFileSync(join(ROOT, PLATES_JSON), 'utf8'));
  const mirror = makeMirror();
  try {
    const page = await buildLayerPage(mirror);
    if (sha256(page) !== PAGE_SHA256) throw new Error(`zooms: golden-B page sha256 ${sha256(page)} != approved ${PAGE_SHA256}`);
    const html = page.toString('utf8');
    const L = await import(pathToFileURL(join(mirror, 'artifact', 'howto-layers.mjs')).href);
    if (html.split(L.ZDOTS).length !== 2) throw new Error('zooms: ZDOTS is not in the golden-B page exactly once');
    const chrome = howtoCss(readFileSync(join(LAYERS, 'artifact', 'build-page.mjs'), 'utf8'), galleryCss(html));
    const out = [];
    for (const row of Object.values(rows)) {
      const id = row.chromeId, panels = posturePanels(html, id);
      out.push({ path: `src/howto/generated/posture-${id}.ts`, text:
        `// The ${id} posture close-ups (golden B), loaded on the first posture open (plan 2.5), with its close-up CSS.\n`
        + `import '../../slices/howto/css/zoom-${id}.css';\n`
        + `export const panels: Readonly<Record<string, string>> = {\n${panels.map(p => `  ${lit(p.key)}: ${lit(p.panel)},\n`).join('')}};\n`
        + `export const zdots = ${lit(L.ZDOTS)};\n` });
    }
    out.push({ path: 'src/slices/howto/css/posture.css', text: rewrite(chromeRules(chrome, POSTURE_SELECTORS)) });
    return out;
  } finally {
    cleanupMirror(mirror);
  }
}
