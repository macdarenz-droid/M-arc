// LIB-PLATEFIX-4 (#410; D-PLATEFIX-PINS form, as platefix3b-pins.ts): the tools/plates/library/MANIFEST.json keys its
// [golden update] commits move, for the MANIFEST blanked-keys tests (crop-projection, lib-shapes, pair-faults,
// research-routes). pf4Problems: each moved key pins its file's current sha256, and each re-pinned row's `entry` is the
// hash of its latest plate entry in its batch golden file (an 'owner' D-OWNER-REPIN entry appended after its plates panel
// passed). restorePF4: the same keys and entries put back to main de91dd21's values (main's
// MANIFEST differs from this PR's in exactly these, plus render/closeup/crop.mjs), so each test's pin, measured on main,
// holds. crop.mjs (PF4 item 20's opt-in wrong.equipmentList) is not listed: those tests already pin it to its current
// file (F-CROP-FRONT D-CROP-PIN), so main's value is never restored for it.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
const M: any = await import(/* @vite-ignore */ new URL('tools/plates/library/ci/manifest.mjs', ROOT).href);

/** The moved keys and main de91dd21's value of each (one value in every row that lists it). */
export const PF4_MAIN: Record<string, string> = {
  'tools/plates/library/specs/straight_bar_triceps_pushdown.mjs': 'f66fb9065b05a51336b08fc41ea8af058b3b7057563e4c9ad7855ad4429dc35f',
  'tools/plates/library/templates/PUSHDOWN.mjs': '556151597cf24f4ad768c01cd208ebf76c7dbc1a6ac954fdabcb2c999901d137',
  'tools/plates/library/specs/cable_curl.mjs': '4af768a54524b54e6d48c56b715ad9f5bbeffdb087daa934e2aa1542cc75a334',
  'tools/plates/library/specs/one_arm_dumbbell_row.mjs': '26dc7671aac51083d68f3afd0a0fb8ce01dc9dedf2d2e45b3664585245da7b11',
  'tools/plates/library/specs/incline_dumbbell_press__lb2.mjs': '725b9046719d8281d74e8c890c6886a3b8562680629369290b9fd2662231aae0',
  'tools/plates/library/specs/dumbbell_fly.mjs': '407d924d07b4f246d5d8b51a565eb45be9ad2ae9458a2653ee534fbe75660d8b',
  'tools/plates/library/howto/lib_barbell_bench_press.howto.mjs': 'a7162089bb153283d35a3e041be53dd0893146f32401f926aab909a1a3ef4907',
  'tools/plates/library/howto/lib_decline_bench_press.howto.mjs': '9da086a93eb774922a6f92813f6f26cee312bb90289dfb70f6da18300d64ced6',
  'tools/plates/library/howto/lib_incline_dumbbell_press.howto.mjs': '68050104ccc8b9bb850aa3ce0e930679d9b78b780ace1979e0fe70237fdd352d',
  'tools/plates/library/howto/lib_back_extension.howto.mjs': 'bb0418efb944adc481adbe5c8e81a1e97e7d80682f9ecb01debcc1912654fa4b',
  'tools/plates/library/howto/lib_one_arm_dumbbell_row.howto.mjs': '4ce964ab8171adca17283db950745f3e3012c3ab6ec26403bbda02d6f5709f68',
};

/** The re-pinned rows' MANIFEST entries on main de91dd21 (one_arm_dumbbell_row: pf12 passed, #410 6751563503). */
export const PF4_MAIN_ENTRY: Record<string, string> = {
  lib_one_arm_dumbbell_row: '97c67d42afb7002dd15992716837d7de4d314ec3504a46a9fd1f2823cb549eab',
  lib_incline_dumbbell_press: 'f9865212f11f21912bbbaef8a51c831ee048ac4ddf5d30c865f703fe803a2491',   // pf13 passed, #410 6752705237
  lib_straight_bar_triceps_pushdown: '093bddfab5fa6182f19e438d4013a13e776609143b88420dd97420ac9974285b',   // pf12 + crop check passed
};
const LATEST: Record<string, string> = Object.fromEntries(M.pinnedRows().map((p: any) => [p.row.id, M.entryHash(p.entry)]));

/** Problems with `m`'s LIB-PLATEFIX-4 changes (empty when each moved key pins its file's current sha256). */
export function pf4Problems(m: any): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of Object.keys(PF4_MAIN)) {
    const now = sha(readFileSync(new URL(k, ROOT)));
    if (k in r.files && r.files[k] !== now) bad.push(`${id} ${k}: ${r.files[k]} != ${now}`);
  }
  // a row an earlier step already took out (lessW4 removes the lb02/lb03 rows) has nothing left to check
  for (const id of Object.keys(PF4_MAIN_ENTRY)) if (m.rows[id] && m.rows[id].entry !== LATEST[id]) bad.push(`${id}: entry ${m.rows[id].entry} != ${LATEST[id]}`);
  return bad;
}
/** `m` with the LIB-PLATEFIX-4 keys and entries put back to main de91dd21's values; no checks. */
export function restorePF4(m: any): any {
  for (const r of Object.values<any>(m.rows)) for (const [k, v] of Object.entries(PF4_MAIN)) if (k in r.files) r.files[k] = v;
  for (const [id, v] of Object.entries(PF4_MAIN_ENTRY)) if (m.rows[id]) m.rows[id].entry = v;
  return m;
}
