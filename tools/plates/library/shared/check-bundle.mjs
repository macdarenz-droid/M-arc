// LIB-5 (D-LIB5-BUNDLE, Do 9 rule): the answered back-pain box reaches the built app whole. Reads box.name.text,
// box.now.text and box.doctor.text from the S1-pinned, owner-approved research card and scans the bytes of every file
// under <dir> (default www, vite's outDir): each value must appear as one exact, case-sensitive string. The 9dbc7e0
// draft box.now.text (tests/howto/fixtures/lib5/draft-box-now.txt) must not appear unless it is the answered value.
// Never vacuous: a folder with no assets/HowToSheet-*.js chunk fails too.
//   node tools/plates/library/shared/check-bundle.mjs [dir]
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const BOX_CARD = 'docs/research/howto/shared/back-pain-box.json';
export const FIELDS = ['name', 'now', 'doctor'];
export const DRAFT_NOW = 'tests/howto/fixtures/lib5/draft-box-now.txt';

/** The 9dbc7e0 draft box.now.text, kept as a fixture (D-LIB5-BUNDLE). */
export const draftNow = (root = ROOT) => readFileSync(join(root, DRAFT_NOW), 'utf8');

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

/** Problems for one built folder: an answered value no file holds, the draft `now` where it is not the answer, and a
 *  missing HowToSheet chunk. */
export function bundleProblems(dir, values = boxValues(), draft = draftNow()) {
  if (!existsSync(dir)) return [`${dir}: no such folder (run npm run build first)`];
  const bad = [], files = walk(dir).map(f => [f, readFileSync(f)]);
  for (const [f, t] of Object.entries(values)) if (!files.some(([, b]) => b.includes(Buffer.from(t, 'utf8')))) bad.push(`${dir}: no file holds box.${f}.text`);
  if (draft !== values.now) for (const [file, b] of files) if (b.includes(Buffer.from(draft, 'utf8'))) bad.push(`${relative(dir, file)}: holds the 9dbc7e0 draft box.now.text`);
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
  console.log(`check-bundle: PASS, ${walk(dir).length} files under ${relative(ROOT, dir) || dir}, every answered back-box value present`);
}
