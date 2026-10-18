// LIB-8 plates page builder (library plan 2.7): builds a Technical Plates page for any list of specs in golden A's
// exact chrome. It never copies the chrome by hand: it takes the vendored artifact/build-page.mjs text, swaps only
// its written-in data (the exercise groups, the sources, where a spec is loaded from, the output path and the page
// heading), each by an exact one-match replacement, and runs the result in a mirror of the vendored folder
// (golden.mjs makeMirror). The vendored file is never edited.
// Proof (test/build-page.test.mjs): with the 8's list and the approved heading it rebuilds golden A e2bea90c…,
// 860,766 B, byte for byte.
//   import { buildPlatesPage, GOLDEN_A_CONFIG } from './build-page.mjs'
//   const bytes = await buildPlatesPage(config)   // config: { groups, sources, specs?, heading? }
import { readFileSync, rmSync, writeFileSync, mkdtempSync } from 'node:fs';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { VENDOR, makeMirror, verifyVendor } from '../golden.mjs';

const VENDORED_PAGE = join(VENDOR, 'artifact/build-page.mjs');

/** The approved page heading and footer line, verbatim from the vendored builder. */
export const GOLDEN_A_HEADING = {
  title: 'M/ARC Technical Plates',
  kicker: 'M/ARC · How to do it',
  h1: 'Option 2 · Technical Plate',
  intro: "Still drawings computed from joint angles, in the app's own colours: no photos, no video. Tap Trace to play the path once, Mistake to see the common fault, and a label to highlight its cue.",
  foot: "Mockup for the owner's review. Drawings are computed by our own code from cited joint angles (Winter 2009 body proportions); sources per exercise below.",
};

// Each patch must match exactly once in the vendored text, or the build stops (the vendored file changed shape).
const between = (src, start, endAfter) => {
  const i = src.indexOf(start);
  if (i < 0 || src.indexOf(start, i + 1) >= 0) throw new Error(`build-page: "${start}" must occur exactly once`);
  const j = src.indexOf(endAfter, i);
  if (j < 0) throw new Error(`build-page: no "${JSON.stringify(endAfter)}" after "${start}"`);
  return src.slice(i, j + endAfter.length);
};
const once = (src, find, repl) => {
  const i = src.indexOf(find);
  if (i < 0 || src.indexOf(find, i + 1) >= 0) throw new Error(`build-page: "${find.slice(0, 60)}" must occur exactly once`);
  return src.slice(0, i) + repl + src.slice(i + find.length);
};

/** The vendored builder with its data made parameters (read from the global __CFG). Pure text transform. */
export function patchedBuilder(src = readFileSync(VENDORED_PAGE, 'utf8')) {
  let s = src;
  s = once(s, between(s, 'const SOURCES = {', '\n};\n'), 'const SOURCES = __CFG.sources;\n');
  s = once(s, between(s, 'const GROUPS = [', '\n];\n'), 'const GROUPS = __CFG.groups;\n');
  s = once(s, "const spec = (await import(pathToFileURL(join(root, 'exercises', `${id}.mjs`)).href)).default;",
    "const spec = (await import(__CFG.specUrl[id] ?? pathToFileURL(join(root, 'exercises', `${id}.mjs`)).href)).default;");
  s = once(s, "const out = join(here, 'technical-plates.html');", 'const out = __CFG.out;');
  s = once(s, '<title>M/ARC Technical Plates</title>', '<title>${__CFG.heading.title}</title>');
  s = once(s, '<span class="pg-kicker">M/ARC · How to do it</span>', '<span class="pg-kicker">${__CFG.heading.kicker}</span>');
  s = once(s, '<h1>Option 2 · Technical Plate</h1>', '<h1>${__CFG.heading.h1}</h1>');
  s = once(s, `<p>${GOLDEN_A_HEADING.intro}</p>`, '<p>${__CFG.heading.intro}</p>');
  s = once(s, `<p>${GOLDEN_A_HEADING.foot}</p>`, '<p>${__CFG.heading.foot}</p>');
  s = once(s, "console.log(out, (html.length / 1024).toFixed(0) + ' KB');", '');
  const lastImport = s.lastIndexOf('\nimport ');
  const eol = s.indexOf('\n', lastImport + 1);
  return `${s.slice(0, eol + 1)}const __CFG = JSON.parse(process.env.LIB_PAGE_CFG);\n${s.slice(eol + 1)}`;
}

/** The golden A config: the 8, their groups and sources exactly as the vendored builder has them. */
export async function goldenAConfig() {
  const src = readFileSync(VENDORED_PAGE, 'utf8');
  const mod = s => `data:text/javascript;base64,${Buffer.from(s).toString('base64')}`;
  const data = await import(mod(`${between(src, 'const WINTER', ';\n')}\n${between(src, 'const SOURCES = {', '\n};\n')}\n${between(src, 'const GROUPS = [', '\n];\n')}\nexport { SOURCES, GROUPS };`));
  return { groups: data.GROUPS, sources: data.SOURCES, specs: {}, heading: GOLDEN_A_HEADING };
}

const run = (cwd, file, env) => new Promise((resolve, reject) => {
  const c = spawn(process.execPath, [file], { cwd, env: { ...process.env, ...env }, stdio: ['ignore', 'pipe', 'pipe'] });
  const out = [], err = [];
  c.stdout.on('data', d => out.push(d)); c.stderr.on('data', d => err.push(d));
  c.on('error', reject);
  c.on('close', code => (code === 0 ? resolve({ stdout: Buffer.concat(out).toString(), stderr: Buffer.concat(err).toString() })
    : reject(new Error(`page build exited ${code}: ${Buffer.concat(err).toString().slice(0, 3000)}`))));
});

/**
 * Build one plates page. config.groups: [{ id, title, ids }]; config.sources: { id: [line] } for every id;
 * config.specs: { id: absolute path of a library spec } (ids not listed load from the vendored exercises/);
 * config.heading: GOLDEN_A_HEADING's fields. Resolves to { html: Buffer, warnings: string }.
 */
export async function buildPlatesPage(config) {
  const bad = verifyVendor();
  if (bad.length) throw new Error(`vendored engine is not the golden lock:\n${bad.join('\n')}`);
  const ids = config.groups.flatMap(g => g.ids);
  if (new Set(ids).size !== ids.length) throw new Error('an id is listed twice');
  for (const id of ids) if (!config.sources?.[id]?.length) throw new Error(`${id}: no sources`);
  const mirror = makeMirror();
  const outDir = mkdtempSync(join(tmpdir(), 'lib-page-'));
  try {
    const file = join(mirror, 'artifact', 'library-page.mjs');
    writeFileSync(file, patchedBuilder());
    const out = join(outDir, 'page.html');
    const specUrl = Object.fromEntries(Object.entries(config.specs ?? {}).map(([id, p]) => [id, pathToFileURL(p).href]));
    const cfg = { groups: config.groups, sources: config.sources, specUrl, out, heading: { ...GOLDEN_A_HEADING, ...(config.heading ?? {}) } };
    const { stderr } = await run(join(mirror, 'artifact'), file, { LIB_PAGE_CFG: JSON.stringify(cfg) });
    return { html: readFileSync(out), warnings: stderr };
  } finally {
    rmSync(mirror, { recursive: true, force: true });
    rmSync(outDir, { recursive: true, force: true });
  }
}
