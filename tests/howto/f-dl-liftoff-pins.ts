// F-DL-LIFTOFF (#427; D-DL-PINS, the D-PF5-PINS form, as platefix5-pins.ts): the one tools/plates/library/MANIFEST.json
// key its [golden update] commit moves beyond build-layers-page.mjs (which the two callers already blank or pin to its
// current file): the conventional_deadlift how-to, in its 12 lb03 rows. restoreDL checks that each of those rows pins
// the file's current sha256 (and that exactly 12 rows list it), then puts main d92830c2's value back, so each caller's
// pin, measured on main, holds unchanged.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
export const DL_KEY = 'tools/plates/library/howto/lib_conventional_deadlift.howto.mjs';
/** main d92830c2's value of the key (one value in every row that lists it). */
export const DL_MAIN = '529e60f7c59adb02abf0c48c2fd70467f41078ae2bbbae6c8a2ecc4ff467b0fc';
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

/** The key's problems on `m` (empty when every row that lists it pins the current file and exactly 12 rows list it). */
export function dlProblems(m: any): string[] {
  const now = sha(readFileSync(new URL(`../../${DL_KEY}`, import.meta.url))), out: string[] = [];
  const rows = Object.entries<any>(m.rows).filter(([, r]) => DL_KEY in r.files);
  if (rows.length !== 12) out.push(`${DL_KEY}: listed in ${rows.length} rows, not 12`);
  for (const [id, r] of rows) if (r.files[DL_KEY] !== now) out.push(`${id}: ${DL_KEY} pins ${r.files[DL_KEY]}, not the current ${now}`);
  return out;
}
/** `m` with the key put back to main's value, after dlProblems is clean (throws otherwise). Mutates and returns `m`. */
export function restoreDL(m: any): any {
  const p = dlProblems(m);
  if (p.length) throw new Error(`F-DL-LIFTOFF pins: ${p.join('; ')}`);
  for (const r of Object.values<any>(m.rows)) if (DL_KEY in r.files) r.files[DL_KEY] = DL_MAIN;
  return m;
}
