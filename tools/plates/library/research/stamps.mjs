// LIB-5 (Do 6; D-LIB5-STAMPS, D-LIB5-SCRATCH; content.md 3.5): C15 stamps. A shipped How-to needs a reviews.json
// entry whose scope and hash match c15's contentHash(content, plate): sha256 of JSON.stringify({ content, plate }) with
// content = gen/content.mjs loadContent(id).content and plate = the whole `fragments` object (9 keys) of the id's latest
// plate entry (GOLDEN.json for the 8, the batch golden file for a library row). library-gate.mjs throws on any
// stampProblems line. A missing, unparsable or empty reviews.json fails every id: never c15's stub pass.
// Scratch stamps (fixtures only) carry `scratch: true`, are written only into a root marked with SCRATCH_MARKER, and count
// only there; main holds no marker (S8).
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export const ROOT = resolve(fileURLToPath(new URL('../../../..', import.meta.url)));
export const REVIEWS = 'docs/research/howto/reviews.json';
/** A file at the top level of a scratch root (not git-ignored). */
export const SCRATCH_MARKER = 'LIB5-SCRATCH-ROOT';

const sha256 = s => createHash('sha256').update(s).digest('hex');
const imp = (root, p) => import(pathToFileURL(join(root, p)).href);

/** { scope, hash } for one shipped id, computed with `root`'s own modules (loadContent has no root parameter). */
export async function stampOf(id, { root = ROOT } = {}) {
  const [{ loadContent }, G, R, B] = await Promise.all(['tools/plates/gen/content.mjs', 'tools/plates/golden.mjs', 'tools/plates/library/registry.mjs',
    'tools/plates/library/batch-golden.mjs'].map(p => imp(root, p)));
  const row = R.rows(root).find(r => r.id === id);
  if (!row) throw new Error(`stamps: ${id}: no registry row`);
  const entry = row.mode === 'golden' ? G.latestEntries(JSON.parse(readFileSync(G.GOLDEN_JSON, 'utf8')).entries).get(id) : B.pinOf(row, 'plate', root);
  if (!entry?.fragments) throw new Error(`stamps: ${id}: no plate entry with fragments`);
  const { content } = await loadContent(id);
  return { scope: content.extends ?? content.id, hash: sha256(JSON.stringify({ content, plate: entry.fragments })) };
}

/** c15's contentHash for one shipped id. */
export async function contentHashOf(id, { root = ROOT } = {}) {
  return (await stampOf(id, { root })).hash;
}

/** reviews.json under `root`, or null when it is missing or unparsable. */
export function readReviews(root = ROOT) {
  try { return JSON.parse(readFileSync(join(root, REVIEWS), 'utf8')); } catch { return null; }
}

/** One line per id with no matching entry. A scratch entry counts only in a root that holds SCRATCH_MARKER. */
export async function stampProblems(ids, { root = ROOT, reviews = readReviews(root) } = {}) {
  const entries = Array.isArray(reviews?.entries) ? reviews.entries : [];
  const marked = existsSync(join(root, SCRATCH_MARKER)), bad = [];
  for (const id of ids) {
    const { scope, hash } = await stampOf(id, { root });
    if (!entries.length) { bad.push(`LIB-5 stamp: ${id}: reviews.json is missing, unparsable or empty`); continue; }
    if (!entries.some(e => e.scope === scope && e.hash === hash && (!e.scratch || marked))) bad.push(`LIB-5 stamp: ${id}: no reviews.json entry for scope ${scope} hash ${hash.slice(0, 12)}…`);
  }
  return bad;
}

/** Marks `root` as a scratch tree (fixtures only). No root is refused here: B5 builds in place in a worktree. What
 *  keeps main clean is S8: no marker exists at ROOT or is tracked, and the committed reviews.json holds no scratch entry. */
export function markScratch(root) {
  writeFileSync(join(root, SCRATCH_MARKER), 'LIB-5 scratch root: scratch stamps in docs/research/howto/reviews.json count here only.\n');
}

/** Writes a scratch stamp for each id into `root`'s reviews.json. Synchronous: the hashes come from a child Node process
 *  run in `root`, importing root's own stamps.mjs. Throws on a root without SCRATCH_MARKER. */
export function writeScratchStamps(root, ids) {
  if (!existsSync(join(root, SCRATCH_MARKER))) throw new Error(`stamps: ${root} holds no ${SCRATCH_MARKER}; scratch stamps go only into a marked scratch root`);
  const code = `import { stampOf } from './tools/plates/library/research/stamps.mjs';
const out = []; for (const id of ${JSON.stringify(ids)}) out.push(await stampOf(id));
console.log('@@' + JSON.stringify(out));`;
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { cwd: root, encoding: 'utf8' });
  const line = (r.stdout ?? '').split('\n').find(l => l.startsWith('@@'));
  if (r.status !== 0 || !line) throw new Error(`stamps: scratch stamps failed in ${root}:\n${r.stderr}`);
  const stamps = JSON.parse(line.slice(2)), file = join(root, REVIEWS), cur = readReviews(root) ?? { schema: 1, entries: [] };
  cur.entries = [...(cur.entries ?? []), ...stamps.map(s => ({ ...s, date: '2026-01-01', scratch: true }))];
  writeFileSync(file, `${JSON.stringify(cur, null, 2)}\n`);
  return stamps;
}
