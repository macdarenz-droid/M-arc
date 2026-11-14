// F-BSS-REARKNEE (#426; D-RP-PINS, in the D-PF5-PINS form, as platefix5-pins.ts): its [golden update] moves one
// tools/plates/library/MANIFEST.json key, lib_bulgarian_split_squat.howto.mjs's, in the 12 lb04 rows, and the rear-knee
// crop's bytes. The other tasks' pins that this turns red (measured: f-w8a-assisted A1, pair-faults F-HAND-PALMFLAT-SIZE
// C1, platefix5-w6's all-zooms digest) call these, so each pin, measured on main 9139c29c, still holds:
//   restoreBSS(m)      each row's key must pin the current file (bssProblems), then main's value is put back;
//   bssMainZoom(id, z) bulgarian's rear-knee zoom with main's crop window, every other zoom unchanged.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

export const BSS_KEY = 'tools/plates/library/howto/lib_bulgarian_split_squat.howto.mjs';
/** The key's value on main 9139c29c (one value in every row that lists it). */
export const BSS_MAIN = '53d61b2cda48b24f6cdffb11b00059ce8b5758b91b9bc5d2b4a57d900ca400b9';
/** The rows that list the key (the lb04 batch). */
export const BSS_ROWS = 12;
/** main 9139c29c's rear-knee crop centre offset (this card moves it to [-40, -12]). */
export const BSS_MAIN_OFF = [-40, -24];

/** Problems: the key is not in exactly BSS_ROWS rows, or a row does not pin the current file. */
export function bssProblems(m: any): string[] {
  const now = sha(readFileSync(new URL(BSS_KEY, ROOT))), bad: string[] = [];
  let n = 0;
  for (const [id, r] of Object.entries<any>(m.rows)) if (BSS_KEY in r.files) { n++; if (r.files[BSS_KEY] !== now) bad.push(`${id}: ${BSS_KEY} ${r.files[BSS_KEY]} != current ${now}`); }
  if (n !== BSS_ROWS) bad.push(`${BSS_KEY}: in ${n} rows, not ${BSS_ROWS}`);
  return bad;
}
/** Puts main's value of the key back in every row (in place, and returned). Throws on any bssProblems line. */
export function restoreBSS(m: any): any {
  const bad = bssProblems(m);
  if (bad.length) throw new Error(`restoreBSS: ${bad.join('; ')}`);
  for (const r of Object.values<any>(m.rows)) if (BSS_KEY in r.files) r.files[BSS_KEY] = BSS_MAIN;
  return m;
}
/** Bulgarian's rear-knee zoom drawn with main's crop window; any other (howto key, zoom) pair is returned as is. */
export function bssMainZoom(key: string, z: any): any {
  if (key !== 'bulgarian_split_squat' || z.key !== 'rear-knee') return z;
  return { ...z, crop: { ...z.crop, center: { ...z.crop.center, off: BSS_MAIN_OFF } } };
}
