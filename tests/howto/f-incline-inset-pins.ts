// F-INCLINE-INSET (#436; D-PLATEFIX-PINS form, as platefix5-pins.ts): what its [golden update] commits move, and the
// helpers that put each back to main 2a898c3e's values so a pin measured on main holds unchanged.
// - MANIFEST.json: the incline spec's key (8 rows list it) and lib_incline_barbell_bench_press's approving entry hash.
//   fiiProblems: each moved key pins its file's current sha256 and the entry is the latest plate entry's hash.
//   restoreFII: the key and the entry back to main's values.
// - tests/howto/golden/library/lb02.json: two 'owner' D-OWNER-REPIN entries appended after F-SHEET-COPY's layers-page
//   entry (the plate entry over entry 2 and the page entry over entry 10, #436 6920821621). fiiTailProblems checks them
//   exactly; lessFII takes them off (after the check), so the F-SHEET-COPY entry is the file's last again.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');

export const FII_KEY = 'tools/plates/library/specs/incline_barbell_bench_press.mjs';
/** main 2a898c3e's MANIFEST values of the moved key and of the re-pinned row's entry. */
export const FII_MAIN = '58cc32cd5eb0d6f015fba5440d250ded2cd89255dc1f41b7cc2ac8cf49b883da';
export const FII_ID = 'lib_incline_barbell_bench_press';
export const FII_MAIN_ENTRY = '45dfd6757f28afbf0318b865f137ed1233ee42397c2454863d7dbf54af8e41a8';
export const FII_APPROVAL = 'https://github.com/macdarenz-droid/M-arc/pull/436#issuecomment-6920821621 @ 83a2e4a1ace95efe5e46e6ab461dd89dc74095a1';
export const FII_PAGE = { sha: 'b7b1593b8a8e90f9e45743ef1e56cd5e95a7d10fa2086196368bb5b2bdbb2284', bytes: 847371 };

const M: any = await import(/* @vite-ignore */ new URL('tools/plates/library/ci/manifest.mjs', ROOT).href);
const LATEST: string = M.entryHash(M.pinnedRows().find((p: any) => p.row.id === FII_ID).entry);

/** Problems with `m`'s F-INCLINE-INSET changes (empty when the moved key pins its file and the entry is the latest). */
export function fiiProblems(m: any): string[] {
  const bad: string[] = [], now = sha(readFileSync(new URL(FII_KEY, ROOT)));
  for (const [id, r] of Object.entries<any>(m.rows)) if (FII_KEY in r.files && r.files[FII_KEY] !== now) bad.push(`${id} ${FII_KEY}: ${r.files[FII_KEY]} != ${now}`);
  if (m.rows[FII_ID] && m.rows[FII_ID].entry !== LATEST) bad.push(`${FII_ID}: entry ${m.rows[FII_ID].entry} != ${LATEST}`);
  return bad;
}
/** `m` with the F-INCLINE-INSET key and entry put back to main 2a898c3e's values; no checks. */
export function restoreFII(m: any): any {
  for (const r of Object.values<any>(m.rows)) if (FII_KEY in r.files) r.files[FII_KEY] = FII_MAIN;
  if (m.rows[FII_ID]) m.rows[FII_ID].entry = FII_MAIN_ENTRY;
  return m;
}

/** lb02.json's last two entries against F-INCLINE-INSET's re-pin: the plate entry (over entry 2, the row's latest before)
 *  then the page entry (over entry 10), both 'owner' D-OWNER-REPIN with FII_APPROVAL, the page pinning FII_PAGE. [problems] */
export function fiiTailProblems(file: any): string[] {
  const E = file.entries as any[], p = E[E.length - 2], g = E[E.length - 1], bad: string[] = [];
  const form = (e: any) => e?.approvedBy === 'owner' && e?.decision === 'D-OWNER-REPIN' && e?.approval === FII_APPROVAL;
  if (!(p?.kind === 'plate' && p.id === FII_ID && p.supersedes === 2 && form(p))) bad.push(`lb02 F-INCLINE-INSET: entry ${E.length - 2} is ${p?.kind} ${p?.id ?? ''} ${p?.decision}`);
  if (!(g?.kind === 'page' && g.supersedes === 10 && form(g) && g.pageSha256 === FII_PAGE.sha && g.bytes === FII_PAGE.bytes)) bad.push(`lb02 F-INCLINE-INSET: last entry ${g?.kind} ${g?.decision}`);
  return bad;
}
/** lb02.json's `file` without F-INCLINE-INSET's two tail entries (checked first: throws on any fiiTailProblems). */
export function lessFII(file: any): any {
  const bad = fiiTailProblems(file);
  if (bad.length) throw new Error(bad.join('\n'));
  return { ...file, entries: file.entries.slice(0, -2) };
}
