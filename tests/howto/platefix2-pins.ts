// LIB-PLATEFIX-2 (#395, D-OWNER-REPIN, D-PLATEFIX-SECOND form; [golden update]): the keys and approving entry its re-pin of
// tools/plates/library/MANIFEST.json moves, for the MANIFEST blanked-keys tests (crop-projection, lib-shapes, pair-faults,
// research-routes). pf2Problems: each moved key pins its file's current sha256, and lib_pec_fly's `entry` is the hash of
// its latest plate entry in pilot A's batch golden file. restorePF2: the same keys and entry put back to main 7e060e83's
// values (main's MANIFEST differs from this PR's in exactly these three), so each test's pin, measured on main, holds.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const read = (p: string) => readFileSync(new URL(p, ROOT));
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');

/** The moved keys and main 7e060e83's value of each (one value in every row that lists it). */
export const PF2_MAIN: Record<string, string> = {
  'tools/plates/library/zoom/inline.mjs': 'aa97ffe63c60a9dd83ef4f849ec5c32397621e9f88d8f0b7fb0b64e2dd4b5c7b',
  'tools/plates/library/specs/pec_fly.mjs': '39bbb4cbf575f8e5f1330d5620adb3707de673ecf9d91fe8a73efc69eb347985',
};
/** lib_pec_fly's MANIFEST entry on main 7e060e83 (the hash of pilot A's entry 8). */
export const PF2_MAIN_ENTRY = 'd9aac21e853c01cb74f6cf188823d6c2c62d71c808492fd69c793e7e199e2c1f';

const latestPec = () => JSON.parse(read('tests/howto/golden/library/pilot-a.json').toString()).entries.filter((e: any) => e.kind === 'plate' && e.id === 'lib_pec_fly').at(-1);

/** Problems with `m`'s LIB-PLATEFIX-2 changes (empty when each moved key and lib_pec_fly's entry pin their current value). */
export function pf2Problems(m: any): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of Object.keys(PF2_MAIN)) if (k in r.files && r.files[k] !== sha(read(k))) bad.push(`${id} ${k}: ${r.files[k]} != ${sha(read(k))}`);
  const want = sha(JSON.stringify(latestPec()));
  if (m.rows.lib_pec_fly?.entry !== want) bad.push(`lib_pec_fly: entry ${m.rows.lib_pec_fly?.entry} != ${want}`);
  return bad;
}
/** `m` with the LIB-PLATEFIX-2 keys and entry put back to main 7e060e83's values; no checks. */
export function restorePF2(m: any): any {
  for (const r of Object.values<any>(m.rows)) for (const [k, v] of Object.entries(PF2_MAIN)) if (k in r.files) r.files[k] = v;
  if (m.rows.lib_pec_fly) m.rows.lib_pec_fly.entry = PF2_MAIN_ENTRY;
  return m;
}
