// LIB-PLATEFIX-5 (#419; D-PLATEFIX-PINS form, as platefix4-pins.ts): the tools/plates/library/MANIFEST.json keys its
// [golden update] commit moves, for the MANIFEST blanked-keys tests (crop-projection, lib-shapes, pair-faults,
// research-routes). pf5Problems: each moved key pins its file's current sha256, and each re-pinned row's `entry` is the
// hash of its latest plate entry in its batch golden file (an 'owner' D-OWNER-REPIN entry appended after its plates
// panel passed, #419 6851987591). restorePF5: the same keys and entries put back to main a4796243's values (the only
// keys where this PR's MANIFEST differs from main, apart from render/closeup/crop.mjs, which the 4 tests already pin to
// its current file under F-CROP-FRONT D-CROP-PIN, so main's value is never restored for it), so each test's pin,
// measured on main, holds.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');

/** The moved keys and main a4796243's value of each (one value in every row that lists it). crop.mjs is not here: the
 *  4 tests pin it to its current file (D-CROP-PIN), so main's value is never restored for it. */
export const PF5_MAIN: Record<string, string> = {
  // item 3 (cable_curl), item 2 (pendulum_squat), item 4 (underhand_lat_pulldown): the three redrawn plate specs
  'tools/plates/library/specs/cable_curl.mjs': '4af768a54524b54e6d48c56b715ad9f5bbeffdb087daa934e2aa1542cc75a334',
  'tools/plates/library/specs/pendulum_squat.mjs': '49181b86375252b8c7e8c386048b68d0283749ecaa1787e4ffabca4e66820d81',
  'tools/plates/library/specs/underhand_lat_pulldown.mjs': '1f1308fa700322839d9e41ab83a81902d50878bc06df8ac30b0e4a22694f6461',
  // the seven redrawn close-up How-tos (hack_squat, wall_ball, side_plank, cable_external_rotation, diamond_push_up,
  // cable_chest_press, hip_adduction); jumping_jacks is held at main's bytes (D-PF5-JJ) so its key never moves
  'tools/plates/library/howto/lib_hack_squat.howto.mjs': 'db39e181c48053304dae2f7511e116b7cac2273d0d8ed96d935636b49ac6f257',
  'tools/plates/library/howto/lib_wall_ball.howto.mjs': 'f74b4b965240a96f5640cdfd563502179d74fc9f80ed4e20bb6156ba22f93837',
  'tools/plates/library/howto/lib_side_plank.howto.mjs': 'ee003d7d74c3865cf9876e52d5ba9174933425be2c80da285b6dfe6d3007d01a',
  'tools/plates/library/howto/lib_cable_external_rotation.howto.mjs': 'c29bb68fee8d5ec3ba0ba5c6e0409e07a68abe1a5f9f42b71e922dfff9dfa771',
  'tools/plates/library/howto/lib_diamond_push_up.howto.mjs': '20d097971398dc20482aae83aa1fb86f7a6b1c0c86eb852687c6f987a8210e8a',
  'tools/plates/library/howto/lib_cable_chest_press.howto.mjs': '503e73c1b0bdca52008e548186fff96fac8223a7dc197ff0b2188a3d0b958b4a',
  'tools/plates/library/howto/lib_hip_adduction.howto.mjs': '727ab6cf7d19f10dd34a3fe3566fa2bfe248e92ba181054810778425978b2f8e',
  // the three close-up page configs that list the moved sheets (lb06: CER, diamond; lb07: cable_chest_press, hip_adduction; lb08: hack_squat, wall_ball, side_plank)
  'tools/plates/library/pages/lb06.closeups.mjs': '922811b7ef22dedf84a98a850df052853daea52c2d23568e0e6477102b334f07',
  'tools/plates/library/pages/lb07.closeups.mjs': 'a7c0dc231d5da544627e67ad58211611d9e16e3e0ab46e7ec1c187f6a881f9c5',
  'tools/plates/library/pages/lb08.closeups.mjs': '8d2ed72795d10f268848d2800308d0c56020e7af057dd23783806ccdab0ae9e9',
};

/** The re-pinned rows' MANIFEST entries on main a4796243 (each moves when its 'owner' plate entry is appended). */
export const PF5_MAIN_ENTRY: Record<string, string> = {
  lib_cable_curl: '0a7f58eba8db3b45fea00ecb810f83562dc66a076b850a5b35a8f970f3935ecf',
  lib_pendulum_squat: '2aeb24c49656126d6f0f7d051532ad2a0e93a4463e73bfbe0102643362a3c318',
  lib_underhand_lat_pulldown: '2d267f6812d93cf00b1694b70a65a0381e067f4f0c520ccaad6b39e2697d3fb3',
};
const M: any = await import(/* @vite-ignore */ new URL('tools/plates/library/ci/manifest.mjs', ROOT).href);
const LATEST: Record<string, string> = Object.fromEntries(M.pinnedRows().map((p: any) => [p.row.id, M.entryHash(p.entry)]));

/** Problems with `m`'s LIB-PLATEFIX-5 changes (empty when each moved key pins its file's current sha256). */
export function pf5Problems(m: any): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of Object.keys(PF5_MAIN)) {
    const now = sha(readFileSync(new URL(k, ROOT)));
    if (k in r.files && r.files[k] !== now) bad.push(`${id} ${k}: ${r.files[k]} != ${now}`);
  }
  for (const id of Object.keys(PF5_MAIN_ENTRY)) if (m.rows[id] && m.rows[id].entry !== LATEST[id]) bad.push(`${id}: entry ${m.rows[id].entry} != ${LATEST[id]}`);
  return bad;
}
/** `m` with the LIB-PLATEFIX-5 keys and entries put back to main a4796243's values; no checks. */
export function restorePF5(m: any): any {
  for (const r of Object.values<any>(m.rows)) for (const [k, v] of Object.entries(PF5_MAIN)) if (k in r.files) r.files[k] = v;
  for (const [id, v] of Object.entries(PF5_MAIN_ENTRY)) if (m.rows[id]) m.rows[id].entry = v;
  return m;
}
