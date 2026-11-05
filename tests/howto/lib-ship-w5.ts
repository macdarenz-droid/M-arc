// LIB-SHIP W5 (#392; Q-W5-10 PIN GO, [golden update] 0b68084c / 866f4d4c): lb04's and lb05's pins add exactly the
// 27 rows of batches/lb04.json and batches/lb05.json to MANIFEST.json and their two plates pages to the pinned-page list.
// The guards that pin the 22 earlier rows take these rows out with lessW5 and keep every earlier check on the rest.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = join(__dirname, '..', '..');
const idsOf = (b: string): string[] => Object.keys(JSON.parse(readFileSync(join(ROOT, `tools/plates/library/batches/${b}.json`), 'utf8')).rows);
/** The 27 W5 row ids, lb04's then lb05's, as their batch files list them. */
export const W5: readonly string[] = [...idsOf('lb04'), ...idsOf('lb05')];
if (W5.length !== 27 || new Set(W5).size !== 27) throw new Error(`LIB-SHIP W5: batches lb04 + lb05 list ${W5.length} ids (${new Set(W5).size} distinct), not exactly 27`);
/** The manifest less W5's rows: throws if a W5 row is missing. An extra unlisted row stays, so the caller's count and hash checks catch it. */
export const lessW5 = (m: any) => {
  for (const id of W5) { if (!(id in m.rows)) throw new Error(`LIB-SHIP W5: MANIFEST.json has no row ${id}`); delete m.rows[id]; }
  return m;
};
