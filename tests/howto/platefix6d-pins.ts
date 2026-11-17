// LIB-PLATEFIX-6d (#438; D-PLATEFIX-PINS form, as platefix5-pins.ts): the tools/plates/library/MANIFEST.json keys its
// [golden update] commit moves, for the MANIFEST blanked-keys tests (crop-projection, lib-shapes, pair-faults,
// research-routes). pf6dProblems: each moved key pins its file's current sha256, and each re-pinned row's `entry` is
// the hash of its latest plate entry in its batch golden file (an 'owner' D-OWNER-REPIN entry appended after PLATES
// APPROVED, #438 6938786967). restorePF6D: the same keys and entries put back to main ff75bf0e's values (the only
// keys where this PR's MANIFEST differs from main, apart from render/closeup/crop.mjs, which the 4 tests pin to its
// current file under F-CROP-FRONT D-CROP-PIN). The chains apply it first (innermost), so an older restore that covers
// the same key (PF4's three lb06 specs) still wins with its own main's value.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

/** The moved keys and main ff75bf0e's value of each (one value in every row that lists it). */
export const PF6D_MAIN: Record<string, string> = {
  // the six redrawn plate specs, the pushdown template (endTilt opt-in) and the pullover machine
  'tools/plates/library/specs/high_to_low_cable_fly.mjs': '2d3a5615c0e7fa3bbef3b2df8de41395f3ce6f30a3984e48edbb81a34eadbd19',
  'tools/plates/library/specs/smith_machine_squat.mjs': 'd20f1ff05c445ea37a83141a866e3353c9fe56908b45331afffba9c3f5208896',
  'tools/plates/library/specs/machine_pullover.mjs': 'f1a76b77017bd483927b261b6bafd78a976fed2ff0c8ba01f7d626927170a896',
  'tools/plates/library/specs/burpee.mjs': 'a9a0c7dd0f59ada22de07684d593ab91d35621c4e9ebd9265107cc1b1c2cf85b',
  'tools/plates/library/specs/straight_bar_triceps_pushdown.mjs': '17190b111614031584af218c27678c32df9e480cb37fe9f3a4065e719dcd7c38',
  'tools/plates/library/specs/one_arm_dumbbell_row.mjs': '4a8e14dbf5b7e1030822948b6c07b0e0d2ce4e53c8ed6b60917bd6c84b7619ac',
  'tools/plates/library/templates/PUSHDOWN.mjs': 'ac2da5089459b04f600cb514b57a5a211c0706ef6496a294e9f82f10dfa5b958',
  'tools/plates/library/eq/pulloverMachine.mjs': 'd42db8f718aec34c3b8aeaab11a0be7ccb437f56496c2719e865f94dbb10e3c3',
  // the six How-tos
  'tools/plates/library/howto/lib_high_to_low_cable_fly.howto.mjs': '45abf632d13c339f6d0342638ca7168cdd5d1f0799158aeedb4a5e54f6fdf8ec',
  'tools/plates/library/howto/lib_smith_machine_squat.howto.mjs': 'cad1bded8cef9940504f3edbb4a714716a692a8b12cc5f1492b3f43a968ac258',
  'tools/plates/library/howto/lib_machine_pullover.howto.mjs': 'fca019a442037f64be0cedc92a036e165a0d69aa1ddb04adb7517714c86f41e5',
  'tools/plates/library/howto/lib_burpee.howto.mjs': 'bc10efcfd94aadd18b3536e883fae362199bdf1e2e29404e646a9594384fa0c0',
  'tools/plates/library/howto/lib_straight_bar_triceps_pushdown.howto.mjs': '800f773e587f73a5f2d1975d7920956c794862514e45d800a741bf82aa324aca',
  'tools/plates/library/howto/lib_one_arm_dumbbell_row.howto.mjs': 'a8ccb4a3e4adc84e9890d375f4eabcca1ff600a37963c8b87ea5d356899ee48c',
};

/** The re-pinned rows' MANIFEST entries on main ff75bf0e (each moves when its 'owner' plate entry is appended). */
export const PF6D_MAIN_ENTRY: Record<string, string> = {
  lib_high_to_low_cable_fly: '92fb933e4bee2bdca11bb8dcd72ebde93a06517d7e3d02ed9eab630ac91cc344',
  lib_smith_machine_squat: '212d497b76aaf67f8e4772daecb55932b3bf52f88d2b1ba4aa7546ff368e6e73',
  lib_machine_pullover: '0996d6fa50030587057184d5c614b444691cfac90b985c94e2051620962cbd1d',
  lib_burpee: 'b7573797637ac8cb6ebdd5116a20ebf31a913abe447f181014db137e1fda0af3',
  lib_straight_bar_triceps_pushdown: '17c786b24dbad3f20f0b6b9869f8092a62837982ec6ebe468b68e1bbb4c277b0',
  lib_one_arm_dumbbell_row: '11f797c0cf76973d4b15ffae5418e8c376926d97e981e9b4eb83b853bcf03dd1',
};
const M: any = await import(/* @vite-ignore */ new URL('tools/plates/library/ci/manifest.mjs', ROOT).href);
const LATEST: Record<string, string> = Object.fromEntries(M.pinnedRows().map((p: any) => [p.row.id, M.entryHash(p.entry)]));

/** Problems with `m`'s LIB-PLATEFIX-6d changes (empty when each moved key pins its file's current sha256). */
export function pf6dProblems(m: any): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of Object.keys(PF6D_MAIN)) {
    const now = sha(readFileSync(new URL(k, ROOT)));
    if (k in r.files && r.files[k] !== now) bad.push(`${id} ${k}: ${r.files[k]} != ${now}`);
  }
  for (const id of Object.keys(PF6D_MAIN_ENTRY)) if (m.rows[id] && m.rows[id].entry !== LATEST[id]) bad.push(`${id}: entry ${m.rows[id].entry} != ${LATEST[id]}`);
  return bad;
}
/** `m` with the LIB-PLATEFIX-6d keys and entries put back to main ff75bf0e's values; no checks. */
export function restorePF6D(m: any): any {
  for (const r of Object.values<any>(m.rows)) for (const [k, v] of Object.entries(PF6D_MAIN)) if (k in r.files) r.files[k] = v;
  for (const [id, v] of Object.entries(PF6D_MAIN_ENTRY)) if (m.rows[id]) m.rows[id].entry = v;
  return m;
}

/** render/closeup/crop.mjs on main ff75bf0e (PF6d's `view: 'side'` opt-in moved it; the 4 D-CROP-PIN tests pin it to the
 *  current file, so restorePF6D leaves it): for the blanked-keys tests whose main predates no crop pin (pair-faults C1). */
export const PF6D_CROP: readonly [string, string] = ['tools/plates/library/render/closeup/crop.mjs', '9afd83487230bf179b9e0a96b6b4ebb0fed75fed1a670675df6cb15039d8d702'];
/** `m` with crop.mjs's key put back to main ff75bf0e's value; no checks. */
export function restorePF6DCrop(m: any): any {
  for (const r of Object.values<any>(m.rows)) if (PF6D_CROP[0] in r.files) r.files[PF6D_CROP[0]] = PF6D_CROP[1];
  return m;
}
