// LIB-SHIP W8a (#413; W8a LAYERS APPROVED 6761492481): the layers-page entry each W8a page gets, appended last as a
// superseding 'supervisor' entry (point 4, D-BODYMAP-APPEND), and the pin of the page it supersedes. The guards that
// checked the superseded entry against the committed page check it against `was` instead, and this entry against the page.
import { createHash } from 'node:crypto';

export const W8A_LAYERS: Record<string, { supersedes: number; ids: string[]; was: { sha: string; bytes: number } }> = {
  'pilot-a': {
    supersedes: 22,
    ids: ['lib_barbell_overhead_press', 'lib_dumbbell_biceps_curl', 'lib_pec_fly', 'lib_plank', 'lib_rope_triceps_pushdown', 'lib_barbell_row', 'lib_dumbbell_bench_press',
      'lib_dumbbell_shoulder_press', 'lib_romanian_deadlift', 'lib_single_leg_romanian_deadlift', 'lib_triceps_pushdown', 'lib_upright_row'],
    was: { sha: 'ff1bd298c518eed4eb64214da4643b4d2360b40a24d772ee413a84a134c187de', bytes: 1965361 },
  },
  'pilot-b': {
    supersedes: 9,
    ids: ['lib_seated_leg_curl', 'lib_cable_fly', 'lib_push_up'],
    was: { sha: '4e9685bc66d715c6ced72b794a868996436580016dd8fef18f658d707b62972e', bytes: 426161 },
  },
};
const LINK = /^https:\/\/github\.com\/macdarenz-droid\/M-arc\/pull\/413#issuecomment-6760254084 @ [0-9a-f]{40}$/;

/** The W8a entry of `batch` against the committed layers page: the file's last entry, exactly. [problems] */
export function w8aLayersProblems(file: any, batch: string, page: Buffer): string[] {
  const W = W8A_LAYERS[batch]!, E = file.entries as any[], e = E[E.length - 1], bad: string[] = [];
  if (e?.kind !== 'layers-page' || e.decision !== 'D-SHIP-W8A-LAYERS' || e.approvedBy !== 'supervisor' || !LINK.test(e.approval ?? '')) return [`${batch} W8a: last entry ${e?.kind} ${e?.decision}`];
  if (e.supersedes !== W.supersedes || E[W.supersedes]?.kind !== 'layers-page') bad.push(`${batch} W8a: supersedes ${e.supersedes}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(W.ids)) bad.push(`${batch} W8a: ids ${e.ids}`);
  if (e.pageSha256 !== createHash('sha256').update(page).digest('hex') || e.bytes !== page.length) bad.push(`${batch} W8a: page pin`);
  const was = E[W.supersedes];
  if (was?.pageSha256 !== W.was.sha || was?.bytes !== W.was.bytes) bad.push(`${batch} W8a: superseded pin`);
  return bad;
}

/** LIB-SHIP W8a: the MANIFEST keys its flip moved (the 3 batch files, 2 layers configs, 2 closeups modules and pec_fly's
 *  sheet), each with its value on main 07f5fbcf. lb01 is back on main's bytes (D-W8A-ASSISTEDHOLD, #415 Q-W8a-8). */
export const W8A_MOVED: Record<string, string> = {
  'tools/plates/library/pages/pilot-a.layers.json': '03a4c9d5b642c5bf247b77a0108f502a575c869a55ae7fda8bbe0a9f634352c2',
  'tools/plates/library/batches/pilot-a.json': '8839222fb48f7760833a9047894b9b3406b8fdb94ce6331ed0f5ddf5048915af',
  'tools/plates/library/howto/lib_pec_fly.howto.mjs': 'a4f8308e938ec094f1fc8524e71961a57e91634c39c11015aa99e7509a1729ec',
  'tools/plates/library/pages/pilot-a.closeups.mjs': '69efa1e7a00b5f895297b3189940f42089381711f8b8e6c1b8d5e7c991ed04d2',
  'tools/plates/library/batches/pilot-b.json': '03ed430a7a2af55c39dd235f58366520a6fb2c426b7d7b17e559221f5d53b910',
  'tools/plates/library/pages/pilot-b.closeups.mjs': 'c62f2ff4193a2abef90e185561505913e723960484db049d777de722c3e897cf',
  'tools/plates/library/pages/pilot-b.layers.json': '9ec640116fcd0f539f521f9080d5ef931319145a04116b168614811fc99ae85d',
  'tools/plates/library/batches/pilot-b2.json': 'c96824c618be9728083932c20a2072ab5fdd9b53709fc96b0043d71b43e2cf74',
};
/** The MANIFEST with W8a's moves put back to main 07f5fbcf's values (in place; returned). Each moved key must pin its
 *  current file, or a problem is pushed and the value is left. */
/** `keep`: moved keys a caller's later helper already checks against the current file and blanks (left as they are). */
export function lessW8a(m: any, shaOfFile: (p: string) => string, problems: string[] = [], keep: readonly string[] = []): any {
  const cur = Object.fromEntries(Object.keys(W8A_MOVED).map(k => [k, shaOfFile(k)]));
  for (const [id, r] of Object.entries<any>(m.rows)) for (const [k, was] of Object.entries(W8A_MOVED)) if (k in r.files && !keep.includes(k)) {
    if (r.files[k] !== cur[k]) { problems.push(`${id}: ${k} off its file`); continue; }
    r.files[k] = was;
  }
  return m;
}
