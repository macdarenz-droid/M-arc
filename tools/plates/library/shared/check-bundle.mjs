// LIB-5 (D-LIB5-BUNDLE, S4-P bundle half): no whole field value of the back-pain box reaches the built app while the
// box waits for the owner (decision 6). Reads box.name.text, box.now.text and box.doctor.text from the S1-pinned
// research card and scans the bytes of every file under <dir> (default www, vite's outDir). Never vacuous: a folder
// with no assets/HowToSheet-*.js chunk fails too.
//   node tools/plates/library/shared/check-bundle.mjs [dir]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const BOX_CARD = 'docs/research/howto/shared/back-pain-box.json';
export const FIELDS = ['name', 'now', 'doctor'];

/** field -> the card's whole text value. */
export function boxValues(card = JSON.parse(readFileSync(join(ROOT, BOX_CARD), 'utf8'))) {
  return Object.fromEntries(FIELDS.map(f => {
    const t = card.box?.[f]?.text;
    if (typeof t !== 'string' || !t) throw new Error(`check-bundle: ${BOX_CARD} has no box.${f}.text`);
    return [f, t];
  }));
}

const walk = dir => readdirSync(dir).flatMap(n => {
  const p = join(dir, n);
  return statSync(p).isDirectory() ? walk(p) : [p];
});

/** Problems for one built folder: each file holding a whole box value, and a missing HowToSheet chunk. */
export function bundleProblems(dir, values = boxValues()) {
  if (!existsSync(dir)) return [`${dir}: no such folder (run npm run build first)`];
  const bad = [], needles = Object.entries(values).map(([f, t]) => [f, Buffer.from(t, 'utf8')]);
  for (const file of walk(dir)) {
    const bytes = readFileSync(file);
    for (const [f, needle] of needles) if (bytes.includes(needle)) bad.push(`${relative(dir, file)}: holds box.${f}.text`);
  }
  const assets = join(dir, 'assets');
  if (!existsSync(assets) || !readdirSync(assets).some(n => /^HowToSheet-[\w-]+\.js$/.test(n))) bad.push(`${dir}: no assets/HowToSheet-*.js chunk`);
  return bad;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const dir = resolve(process.argv[2] ?? join(ROOT, 'www'));
  const bad = bundleProblems(dir);
  if (bad.length) {
    console.error(`check-bundle: FAIL\n  ${bad.join('\n  ')}`);
    process.exit(1);
  }
  console.log(`check-bundle: PASS, ${walk(dir).length} files under ${relative(ROOT, dir) || dir}, no back-box field value`);
}
