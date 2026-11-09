// LIB-PLATEFIX-3b (#408, D-OWNER-REPIN; D-PLATEFIX-PINS form): the keys and approving entries its re-pin of
// tools/plates/library/MANIFEST.json moves beyond those the PF1 (platefix-pins: barbell_overhead_press.mjs and
// lib_barbell_overhead_press's entry) and PF2 (platefix2-pins: zoom/inline.mjs) helpers already check, for the MANIFEST
// blanked-keys tests (crop-projection, lib-shapes, pair-faults, research-routes). pf3bProblems: each moved key pins its
// file's current sha256, and each moved row's `entry` is the hash of its latest plate entry in its batch golden file
// (ci/manifest.mjs pinnedRows). restorePF3b: the same keys and entries put back to main 6227bd8e's values (main's
// MANIFEST differs from this PR's in exactly these, plus the PF1 and PF2 ones), so each test's pin, measured on main, holds.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const read = (p: string) => readFileSync(new URL(p, ROOT));
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const M: any = await import(/* @vite-ignore */ new URL('tools/plates/library/ci/manifest.mjs', ROOT).href);

/** The moved keys and main 6227bd8e's value of each (one value in every row that lists it). */
export const PF3B_MAIN: Record<string, string> = {
  'tools/plates/library/specs/assisted_pull_up.mjs': '14ae1c82cedfd49da3da394d1f1aafe359de2ef83fdd762b58477be640c1743d',
  'tools/plates/library/specs/smith_machine_bench_press.mjs': '23844e6703bf4d38e3c6ea56e01f2dea046ad21de989b6481522af2cad1c9376',
};
/** The moved rows' MANIFEST entries on main 6227bd8e. */
export const PF3B_MAIN_ENTRY: Record<string, string> = {
  lib_assisted_pull_up: 'f3e08a530f3fecb95190e55e881c039cb824009764ff48315ebd4a6c1301ba8c',
  lib_smith_machine_bench_press: '5a43687abc4145314bc00e32166b4be319be5ea319bfc183b4126cfc69ee2af8',
};
const LATEST: Record<string, string> = Object.fromEntries(M.pinnedRows().map((p: any) => [p.row.id, M.entryHash(p.entry)]));

/** Problems with `m`'s LIB-PLATEFIX-3b changes (empty when each moved key and entry pins its current value). */
export function pf3bProblems(m: any): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of Object.keys(PF3B_MAIN)) if (k in r.files && r.files[k] !== sha(read(k))) bad.push(`${id} ${k}: ${r.files[k]} != ${sha(read(k))}`);
  for (const id of Object.keys(PF3B_MAIN_ENTRY)) if (!m.rows[id] || m.rows[id].entry !== LATEST[id]) bad.push(`${id}: entry ${m.rows[id]?.entry} != ${LATEST[id]}`);
  return bad;
}
/** `m` with the LIB-PLATEFIX-3b keys and entries put back to main 6227bd8e's values; no checks. */
export function restorePF3b(m: any): any {
  for (const r of Object.values<any>(m.rows)) for (const [k, v] of Object.entries(PF3B_MAIN)) if (k in r.files) r.files[k] = v;
  for (const [id, v] of Object.entries(PF3B_MAIN_ENTRY)) if (m.rows[id]) m.rows[id].entry = v;
  return m;
}
