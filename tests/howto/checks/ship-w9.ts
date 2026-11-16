// LIB-SHIP W9 (W9 LAYERS APPROVED, #433 6911987250; D-SHIP-W9-STAMP, D-SHIP-W9-LAYERS): the standing-verdict wave. The one list
// every W9 guard reads; the layers-page entry check of each re-pinned page (lesson 2); the carry compares (A2, D-W9-CARRY-SC);
// the MANIFEST and generated-file transforms (lessW9, w9First, w9GenText); main 2c2de794's pre-W9 layers configs (preW9Config);
// D-W9-WATCHMAIN-TESTS (#433, supervisor 2026-11-16).
import { createHash } from 'node:crypto';
import { toMainCopy } from '../sheetcopy-pins';

/** The 10 ids W9 ships, per batch file in row order. */
export const W9_SHIPPED: Record<string, readonly string[]> = {
  'tools/plates/library/batches/lb02.json': ['lib_barbell_bench_press'],
  'tools/plates/library/batches/lb03.json': ['lib_conventional_deadlift', 'lib_sumo_deadlift'],
  'tools/plates/library/batches/lb04.json': ['lib_bulgarian_split_squat'],
  'tools/plates/library/batches/lb05.json': ['lib_cable_curl'],
  'tools/plates/library/batches/lb06.json': ['lib_cable_chest_press', 'lib_hip_adduction'],
  'tools/plates/library/batches/lb07.json': ['lib_diamond_push_up'],
  'tools/plates/library/batches/lb09.json': ['lib_side_plank'],
  'tools/plates/library/batches/lb10.json': ['lib_wall_ball'],
};
export const W9_IDS: string[] = Object.values(W9_SHIPPED).flat();
export const w9Of = (batchFile: string): string[] => [...(W9_SHIPPED[batchFile] ?? [])];
/** Held at main's bytes (approved-plate): S3 (fidelity reds; F-FID-NOPRIMARY, F-HARNESS-NOGRIP) and S4 (#432, #431 had not
 *  merged by LAYERS READY; both go to W10). */
export const W9_HELD: readonly string[] = ['lib_cable_external_rotation', 'lib_jumping_jacks', 'lib_underhand_lat_pulldown', 'lib_mountain_climbers'];

/** The approval every W9 layers-page entry carries, exactly: the LAYERS APPROVED comment @ the LAYERS READY head. */
export const W9_LAYERS_APPROVAL = 'https://github.com/macdarenz-droid/M-arc/pull/433#issuecomment-6911987250 @ 134c668be3e7d9682b46e66933832f419edba413';
type Pin = { sha: string; bytes: number };
/** Each W9 page's entry: appended last as a 'supervisor' D-SHIP-W9-LAYERS entry (D-BODYMAP-APPEND), with its index, the
 *  entry it supersedes and that entry's decision, the ids, its page pin and the superseded entry's pin (main 2c2de794's). */
export const W9_LAYERS: Record<string, { at: number; supersedes: number; wasDecision: string; ids: string[]; page: Pin; was: Pin }> = {
  lb02: {
    at: 13, supersedes: 12, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_barbell_bench_press',  'lib_dumbbell_pullover'],
    page: { sha: '993e4adbc9678d8c91c7d9107436835831e972ad81464b5329af97b2ef45ecb7', bytes: 431486 },
    was: { sha: '1c7c8f314c366c8e4235ba067cee4210cb91adff468d98304da67ce2ba2b1c4c', bytes: 261900 },
  },
  lb03: {
    at: 20, supersedes: 19, wasDecision: 'D-SHIP-W8C-LAYERS',
    ids: ['lib_pendlay_row',  'lib_landmine_row',  'lib_dumbbell_romanian_deadlift',  'lib_conventional_deadlift',  'lib_sumo_deadlift',  'lib_t_bar_row',  'lib_barbell_shrug',  'lib_cable_shrug',  'lib_dumbbell_shrug',  'lib_smith_machine_shrug'],
    page: { sha: 'd27715730c6869dee1fd1cea71b49af25dd78be7ccd0555718dc4d90a6f5ed18', bytes: 1950542 },
    was: { sha: '4ef44afaa773d49da9ca1343a51dff655f9b84876be082c2ae4e490809e8b498', bytes: 1463850 },
  },
  lb04: {
    at: 16, supersedes: 15, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_front_squat',  'lib_bodyweight_squat',  'lib_wall_sit',  'lib_pistol_squat',  'lib_forward_lunge',  'lib_walking_lunge',  'lib_bodyweight_lunge',  'lib_bodyweight_split_squat',  'lib_bulgarian_split_squat'],
    page: { sha: 'fcad45279a2da306670097ab0a813cdd1c2f0d28c99139f7767239986bf5d7d3', bytes: 1990139 },
    was: { sha: '22086ba103d674c848049798a522e1c72eb6d13db3cdaefa39d0ec29c7e2d5e2', bytes: 1777211 },
  },
  lb05: {
    at: 23, supersedes: 22, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_preacher_curl',  'lib_cable_curl',  'lib_bayesian_cable_curl',  'lib_dumbbell_overhead_triceps_extension',  'lib_hammer_curl',  'lib_alternating_dumbbell_curl',  'lib_single_arm_triceps_pushdown',  'lib_barbell_curl',  'lib_ez_bar_curl',  'lib_reverse_curl'],
    page: { sha: '73c76849b65e248216ba44b72fb62f6fa0c322ff3044e92e5bd3d13ba9140a0b', bytes: 2074061 },
    was: { sha: '29f408d8be52f126c39ab0402962e8a9f53014dcc8ec7e78f7dc3af46f66d5ce', bytes: 1862695 },
  },
  lb06: {
    at: 19, supersedes: 18, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_cable_chest_press',  'lib_machine_crunch',  'lib_hip_adduction',  'lib_machine_lateral_raise'],
    page: { sha: '08b6e9d56f233a9ca48d43737217eae6a6aff833401a09347b25444009262420', bytes: 973900 },
    was: { sha: '8ba70a238acefd186d3d37ec5f3eaed616461cb5c8bd8c81ed294fea5cdcec3e', bytes: 526543 },
  },
  lb07: {
    at: 14, supersedes: 13, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_cable_lateral_raise',  'lib_dumbbell_front_raise',  'lib_face_pull',  'lib_incline_push_up',  'lib_diamond_push_up',  'lib_pike_push_up'],
    page: { sha: 'ee9c8358e9e1f69db6feff94c1c27a1f8f1740e24e7be5f543f0fae516bda409', bytes: 1418468 },
    was: { sha: '13316c7eb448d4647097600d7d42fc3644a9ddca64b5e868e8ff1010d7142b6c', bytes: 1173925 },
  },
  lb09: {
    at: 14, supersedes: 13, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_ab_wheel_rollout',  'lib_bird_dog',  'lib_side_plank',  'lib_cable_crunch',  'lib_hollow_body_hold',  'lib_reverse_crunch',  'lib_dead_bug'],
    page: { sha: 'a79f0e2c5280ccf0d9638ceec1a08cb9ab42d4150aa513f41909d490b9aa5a51', bytes: 1583801 },
    was: { sha: 'f301453267f5d8ecaae35ab7f5d43a67a022ed243d0dfa45c1179f40fc4db594', bytes: 1356646 },
  },
  lb10: {
    at: 18, supersedes: 17, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_kettlebell_swing',  'lib_bear_crawl',  'lib_sled_push',  'lib_medicine_ball_slam',  'lib_farmer_s_carry',  'lib_wall_ball'],
    page: { sha: 'ce856c85364e43a638d8779f2dd4496e7db9696c15c35830abb6cfd96094336e', bytes: 1242685 },
    was: { sha: '6df8eec0617e003a3de5a52ca86c47652d4090c2473d6faf1368328a86b6951c', bytes: 1055680 },
  },
};
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
/** The W9 entry of `batch` whole: the file's last entry, at its index, decision D-SHIP-W9-LAYERS, approver 'supervisor', the
 *  exact W9_LAYERS_APPROVAL, superseding main's last layers-page entry (its decision), ids, the page pin (also against the
 *  committed `page`) and the superseded pin. [problems] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function w9LayersProblems(file: any, batch: string, page: Buffer): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const W = W9_LAYERS[batch]!, E = file.entries as any[], e = E[E.length - 1], bad: string[] = [];
  if (E.length - 1 !== W.at) bad.push(`${batch} W9: entry index ${E.length - 1}`);
  if (e?.kind !== 'layers-page' || e.decision !== 'D-SHIP-W9-LAYERS' || e.approvedBy !== 'supervisor' || e.approval !== W9_LAYERS_APPROVAL) return [...bad, `${batch} W9: entry ${e?.kind} ${e?.decision} ${e?.approval}`];
  if (e.supersedes !== W.supersedes || E[W.supersedes]?.kind !== 'layers-page' || E[W.supersedes]?.decision !== W.wasDecision) bad.push(`${batch} W9: supersedes ${e.supersedes}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(W.ids)) bad.push(`${batch} W9: ids ${e.ids}`);
  if (e.pageSha256 !== W.page.sha || e.bytes !== W.page.bytes) bad.push(`${batch} W9: page pin`);
  if (sha(page) !== W.page.sha || page.length !== W.page.bytes) bad.push(`${batch} W9: committed page`);
  const was = E[W.supersedes];
  if (was?.pageSha256 !== W.was.sha || was?.bytes !== W.was.bytes) bad.push(`${batch} W9: superseded pin`);
  return bad;
}
/** `file` less W9's entry (checked first: throws on any problem), with the pin of the entry it supersedes: checks measured
 *  before W9 run on it unchanged (the W8a form). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW9Entry(file: any, batch: string, page: Buffer): { file: any; pin: Pin } {
  const bad = w9LayersProblems(file, batch, page);
  if (bad.length) throw new Error(bad.join('\n'));
  return { file: { ...file, entries: file.entries.slice(0, -1) }, pin: W9_LAYERS[batch]!.was };
}

/** The card element of `chrome` on a layers page (gen/handpairs.mjs cardOf's bounds). */
export function cardOf(html: string, chrome: string): string {
  const a = html.indexOf(`<article class="sheet-card" id="card-${chrome}"`), b = a < 0 ? -1 : html.indexOf('</article>', a);
  if (a < 0 || b < 0) throw new Error(`ship-w9: no card ${chrome}`);
  return html.slice(a, b);
}
/** The <div class="zx" …> block that opens at `at`, whole (balanced divs). */
function divAt(s: string, at: number): string {
  const re = /<div\b|<\/div>/g; re.lastIndex = at; let d = 0, m;
  while ((m = re.exec(s))) { d += m[0] === '</div>' ? -1 : 1; if (d === 0) return s.slice(at, re.lastIndex); }
  throw new Error('ship-w9: unbalanced div');
}
/** D-PF5-HANDPAIR's named change, taken out of a card: its hand panel (module zoom or pair panel) and the Hand chip's
 *  aria-controls (both become a fixed marker), so a carried card and its judged card compare on everything else. */
export function lessHandPanel(card: string, chrome: string): string {
  const at = card.indexOf('-zoom-hand" data-zoom="hand"'), st = at < 0 ? -1 : card.lastIndexOf('<div class="zx"', at);
  if (st < 0) throw new Error(`ship-w9: ${chrome}: no hand panel`);
  const blk = divAt(card, st), chip = new RegExp(`(id="${chrome}-chip-hand" data-zoom="hand" aria-pressed="false" aria-controls=")[a-z0-9-]+(")`);
  const out = card.replace(blk, '<!--w9-hand-panel-->');
  if (!chip.test(out)) throw new Error(`ship-w9: ${chrome}: no Hand chip`);
  return out.replace(chip, '$1w9-hand$2');
}
/** A2 (D-W9-CARRY-SC): each carried card's judged card (rebuilt at its judged head from its judged recipe, PLAN #433
 *  6907418286), and the bare headings that card never carried with ": right and wrong" (sheetcopy-pins SC_KEEP's form).
 *  cable_curl: the judged card less its hand panel (lessHandPanel; the named D-PF5-HANDPAIR change, delta check PASS 6911987250). */
export const W9_JUDGED: Record<string, { batch: string; judged: string; keep?: readonly string[]; hand?: true }> = {
  lib_barbell_bench_press: { batch: 'lb02', judged: 'a69b8160baf1862fee6613d5e1e886b3dcfb8f33c6bbffb1cd5eb26e4e9d82c2' },   // lb02 4c4cf718 @ 7b4e4866
  lib_conventional_deadlift: { batch: 'lb03', judged: '318f30abf753591fbf3bb3f4157bf20be6318944162474e43b8c97d641223fdb' },   // lb03 1541d54a @ e8e15f7a (W8B_ORDER)
  lib_sumo_deadlift: { batch: 'lb03', judged: 'b1c29f89112a13a7bc104e7a7cf584cc4afa72c4dbe3273e4ed842f2d8d3dd0b' },
  lib_bulgarian_split_squat: { batch: 'lb04', judged: 'bcd016a4ce10c3f2f56ce8eea1cd492621aeed7c6e6c0d931223394b58fcbb99' },   // lb04 79557f3d @ ea5cbca8
  lib_cable_curl: { batch: 'lb05', judged: '2d6ee5626940d41f3ba6e870b08f331cedf186241913b5ca1b81e16cadb84b9b', hand: true },   // lb05 5a81cdc4 @ f487c797; card 5c0d6517 less its hand panel
  lib_cable_chest_press: { batch: 'lb06', judged: '7882638c4efd80ca723bd2d7ac806a3f9f3aae7e92043c8d41558772c46d249d' },   // lb06 a7ed5550 @ 50a35bb6
  lib_hip_adduction: { batch: 'lb06', judged: 'afb1afd84c59794576f099a3d6baa41e920a70062291026ee36251d79695d918' },   // lb06 ef403f7b @ f487c797 (= a7ed5550's, D-W9-HIPCER)
  lib_diamond_push_up: { batch: 'lb07', judged: '4a86cdbe02c94f201cdc7150e860a8f11286861bfadeb4e630308ac58933b5f8', keep: ['diamond-push-up-zoom-shoulder-blades-h'] },   // lb07 fad1e931 @ 50a35bb6
  lib_side_plank: { batch: 'lb09', judged: '6970813aea3479c8f44eb025e11f18f99cfa870632e7204285384bb4c1dcbc23' },   // lb09 ce27e3b7 @ 50a35bb6
  lib_wall_ball: { batch: 'lb10', judged: '343d59736c4eb007c0f3e8935abfb66fa85e88b86be9f87a3ae06bc693ca4007' },   // lb10 9707a074 @ 50a35bb6
};
/** A committed W9 card back in its judged form: #423's replacements undone (toMainCopy, page form), the W9_JUDGED keep
 *  headings left bare, and for a hand row the hand panel out. */
export function w9JudgedForm(card: string, id: string): string {
  const J = W9_JUDGED[id]!, chrome = id.slice(4).replace(/_/g, '-');
  let t = card;
  for (const h of J.keep ?? []) {
    const at = `id="${h}" tabindex="-1">`;
    if (t.split(at).length !== 2) throw new Error(`ship-w9: ${id}: ${h} is not on the card once`);
    t = t.replace(at, `id="${h}" tabindex="-1" data-w9-keep>`);
  }
  t = toMainCopy(t, { page: true });
  t = t.replaceAll(' tabindex="-1" data-w9-keep>', ' tabindex="-1">');
  return J.hand ? lessHandPanel(t, chrome) : t;
}
/** A2: the committed card of every W9 id, in its judged form, against its judged sha. [problems] */
export function w9CarryProblems(pages: Record<string, string>): string[] {
  const bad: string[] = [];
  for (const [id, J] of Object.entries(W9_JUDGED)) {
    const got = sha(w9JudgedForm(cardOf(pages[J.batch]!, id.slice(4).replace(/_/g, '-')), id));
    if (got !== J.judged) bad.push(`${id}: judged form ${got.slice(0, 12)} is not the judged card ${J.judged.slice(0, 12)}`);
  }
  return bad;
}

/** Q-W9 (the Q-W8c-4 form): main 2c2de794's pre-W9 layers config of `page`, from the committed one with W9's own lines taken
 *  out (each must occur exactly once), and pinned to that file's sha256 on main (git show 2c2de794:tools/plates/library/pages/<page>.layers.json | sha256sum). */
export const PRE_W9_SHA: Record<string, string> = {
  lb02: '4c19b52c82c5ae3d686c67cecab12cd7a07540f84c752c05042b633027a56688',
  lb03: 'a1e2118a421f610790ed02c9ed4e0a89b2a1b09ee2435adecb8d864a5d772ecc',
  lb04: '8ae0dd4dfba9382c855ea35fc786b1227dcb8e0c8482b59ca1200354a2a98087',
  lb05: 'e387fd54033b39c195053d92734afdc60451a8dbb42f41ecde8bafc528bdabe4',
  lb06: '2a8fbd4841863246d3c97a136835bf591f2e08b37125601523493f72e42b55b0',
  lb07: '03ad7c397bb700f92b92bf62bd677e5db02981a20c97279b7cca39e7ae6db32f',
  lb09: 'b64148d420cf219a36e1561a17428d46676a8d5a87fca1ebef7301aef26a418c',
  lb10: 'c9d16c004e043486991c362de91f65ebc002c72fe04f44def50a48eac2c8a753',
};
const W9_CONFIG_LINES: Record<string, [string, string][]> = {
  lb02: [["      \"ids\": [\n        \"lib_barbell_bench_press\",\n", "      \"ids\": [\n"]],
  lb03: [["        \"lib_dumbbell_romanian_deadlift\",\n        \"lib_conventional_deadlift\",\n        \"lib_sumo_deadlift\",\n", "        \"lib_dumbbell_romanian_deadlift\",\n"]],
  lb04: [["        \"lib_bodyweight_lunge\",\n        \"lib_bodyweight_split_squat\",\n        \"lib_bulgarian_split_squat\"\n", "        \"lib_bodyweight_lunge\",\n        \"lib_bodyweight_split_squat\"\n"], ["      \"optionsKey\": \"bodyweight_split_squat\"\n    },\n    \"lib_bulgarian_split_squat\": {\n      \"optionsKey\": \"bulgarian_split_squat\"\n", "      \"optionsKey\": \"bodyweight_split_squat\"\n"]],
  lb05: [["        \"lib_preacher_curl\",\n        \"lib_cable_curl\",\n", "        \"lib_preacher_curl\",\n"], ["      \"pair\": \"ez-curl-over\"\n    },\n    \"lib_cable_curl\": {\n      \"optionsKey\": \"cable_curl\",\n      \"pair\": \"curl-bar-under\"\n", "      \"pair\": \"ez-curl-over\"\n"]],
  lb06: [["      \"ids\": [\n        \"lib_cable_chest_press\",\n", "      \"ids\": [\n"], ["        \"lib_machine_crunch\",\n        \"lib_hip_adduction\",\n", "        \"lib_machine_crunch\",\n"], ["      \"optionsKey\": \"machine_lateral_raise\"\n    },\n    \"lib_cable_chest_press\": {\n      \"optionsKey\": \"cable_chest_press\"\n    },\n    \"lib_hip_adduction\": {\n      \"optionsKey\": \"hip_adduction\"\n", "      \"optionsKey\": \"machine_lateral_raise\"\n"]],
  lb07: [["        \"lib_incline_push_up\",\n        \"lib_diamond_push_up\",\n", "        \"lib_incline_push_up\",\n"], ["      \"optionsKey\": \"pike_push_up\"\n    },\n    \"lib_diamond_push_up\": {\n      \"optionsKey\": \"diamond_push_up\"\n", "      \"optionsKey\": \"pike_push_up\"\n"]],
  lb09: [["        \"lib_bird_dog\",\n        \"lib_side_plank\",\n", "        \"lib_bird_dog\",\n"]],
  lb10: [["        \"lib_medicine_ball_slam\",\n        \"lib_farmer_s_carry\",\n        \"lib_wall_ball\"\n", "        \"lib_medicine_ball_slam\",\n        \"lib_farmer_s_carry\"\n"]],
};
export function preW9Config(page: string, committed: string): string {
  let t = committed;
  for (const [a, b] of W9_CONFIG_LINES[page]!) {
    if (t.split(a).length !== 2) throw new Error(`preW9Config ${page}: W9's line is not there exactly once: ${a.slice(0, 60)}`);
    t = t.replace(a, b);
  }
  const s = sha(t);
  if (s !== PRE_W9_SHA[page]) throw new Error(`preW9Config ${page}: ${s} is not main 2c2de794's config (drift)`);
  return t;
}

/** LIB-SHIP W9: the MANIFEST keys its flip moved (the 8 batch files and the 8 layers configs), each with its value on main
 *  2c2de794 (= PRE_W9_SHA for the configs). W9 adds no key. */
export const W9_MOVED: Record<string, string> = {
  'tools/plates/library/batches/lb02.json': '5e51c7fb4136dbf99813a0f0c7db43c14118577af8d0a56ef25de605f968ea72',
  'tools/plates/library/pages/lb02.layers.json': '4c19b52c82c5ae3d686c67cecab12cd7a07540f84c752c05042b633027a56688',
  'tools/plates/library/batches/lb03.json': '640c015c181779e749114469e4020529222588f0fd5019341c85038826692662',
  'tools/plates/library/pages/lb03.layers.json': 'a1e2118a421f610790ed02c9ed4e0a89b2a1b09ee2435adecb8d864a5d772ecc',
  'tools/plates/library/batches/lb04.json': '98cc5bb3b45c36a6a5160f3deaae15e6cccfc3023e1264f55d6a7daadb09dab2',
  'tools/plates/library/pages/lb04.layers.json': '8ae0dd4dfba9382c855ea35fc786b1227dcb8e0c8482b59ca1200354a2a98087',
  'tools/plates/library/batches/lb05.json': '2b803f3c3ccf447be86fe4947ce8b31df88dc622c01ab05031d4901a56ca91ad',
  'tools/plates/library/pages/lb05.layers.json': 'e387fd54033b39c195053d92734afdc60451a8dbb42f41ecde8bafc528bdabe4',
  'tools/plates/library/batches/lb06.json': '222476d7f144639789476303bc1ea2c953f114fe8f39da90f863d63bfeb14b78',
  'tools/plates/library/pages/lb06.layers.json': '2a8fbd4841863246d3c97a136835bf591f2e08b37125601523493f72e42b55b0',
  'tools/plates/library/batches/lb07.json': '33c1c3436d987c4fbd0a4fca08626a5959f2223c544466b3162d5f6c49909487',
  'tools/plates/library/pages/lb07.layers.json': '03ad7c397bb700f92b92bf62bd677e5db02981a20c97279b7cca39e7ae6db32f',
  'tools/plates/library/batches/lb09.json': '07a0addf9084b7c34244c371f888a57c88efa74f90ac71c2adfe2d3c5cedf6fb',
  'tools/plates/library/pages/lb09.layers.json': 'b64148d420cf219a36e1561a17428d46676a8d5a87fca1ebef7301aef26a418c',
  'tools/plates/library/batches/lb10.json': 'ed5f2a8db2a6b945a10995c47a4c7db7193961e1ec668b28df38fd343fcb7198',
  'tools/plates/library/pages/lb10.layers.json': 'c9d16c004e043486991c362de91f65ebc002c72fe04f44def50a48eac2c8a753',
};
/** The MANIFEST with W9's moves put back to main 2c2de794's values (a copy). Each moved key must pin its current file, or a
 *  problem is pushed and the value is left (so the caller's compare stays red). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW9(m: any, shaOfFile: (p: string) => string, problems: string[] = []): any {
  const c = structuredClone(m);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [id, r] of Object.entries<any>(c.rows)) for (const [k, was] of Object.entries(W9_MOVED)) if (k in r.files) {
    if (r.files[k] !== shaOfFile(k)) { problems.push(`${id}: ${k} off its file`); continue; }
    r.files[k] = was;
  }
  return c;
}
/** The file sha a check that runs after lessW9 should see: main 2c2de794's value for a W9-moved key, the file's own otherwise. */
export const w9First = (shaOfFile: (p: string) => string) => (p: string): string => W9_MOVED[p] ?? shaOfFile(p);

/** LIB-SHIP W9: the generated files the W9 flip adds (the 10 ids' ht-, feel-, posture- and zoom css; 40), exactly. */
export const W9_GEN_ADDED: readonly string[] = [
  'src/howto/generated/feel-barbell-bench-press.ts',
  'src/howto/generated/feel-bulgarian-split-squat.ts',
  'src/howto/generated/feel-cable-chest-press.ts',
  'src/howto/generated/feel-cable-curl.ts',
  'src/howto/generated/feel-conventional-deadlift.ts',
  'src/howto/generated/feel-diamond-push-up.ts',
  'src/howto/generated/feel-hip-adduction.ts',
  'src/howto/generated/feel-side-plank.ts',
  'src/howto/generated/feel-sumo-deadlift.ts',
  'src/howto/generated/feel-wall-ball.ts',
  'src/howto/generated/ht-barbell-bench-press.ts',
  'src/howto/generated/ht-bulgarian-split-squat.ts',
  'src/howto/generated/ht-cable-chest-press.ts',
  'src/howto/generated/ht-cable-curl.ts',
  'src/howto/generated/ht-conventional-deadlift.ts',
  'src/howto/generated/ht-diamond-push-up.ts',
  'src/howto/generated/ht-hip-adduction.ts',
  'src/howto/generated/ht-side-plank.ts',
  'src/howto/generated/ht-sumo-deadlift.ts',
  'src/howto/generated/ht-wall-ball.ts',
  'src/howto/generated/posture-barbell-bench-press.ts',
  'src/howto/generated/posture-bulgarian-split-squat.ts',
  'src/howto/generated/posture-cable-chest-press.ts',
  'src/howto/generated/posture-cable-curl.ts',
  'src/howto/generated/posture-conventional-deadlift.ts',
  'src/howto/generated/posture-diamond-push-up.ts',
  'src/howto/generated/posture-hip-adduction.ts',
  'src/howto/generated/posture-side-plank.ts',
  'src/howto/generated/posture-sumo-deadlift.ts',
  'src/howto/generated/posture-wall-ball.ts',
  'src/slices/howto/css/zoom-barbell-bench-press.css',
  'src/slices/howto/css/zoom-bulgarian-split-squat.css',
  'src/slices/howto/css/zoom-cable-chest-press.css',
  'src/slices/howto/css/zoom-cable-curl.css',
  'src/slices/howto/css/zoom-conventional-deadlift.css',
  'src/slices/howto/css/zoom-diamond-push-up.css',
  'src/slices/howto/css/zoom-hip-adduction.css',
  'src/slices/howto/css/zoom-side-plank.css',
  'src/slices/howto/css/zoom-sumo-deadlift.css',
  'src/slices/howto/css/zoom-wall-ball.css',
];
/** LIB-SHIP W9: the generated files whose line-1 inputsSha256 header (and, in the ht- modules, the `hashes:` line) the W9 flip
 *  moves without changing any other byte, measured against main 2c2de794. */
export const W9_GEN_HEADERS: readonly string[] = [
  'src/howto/generated/feel-ab-wheel-rollout.ts',
  'src/howto/generated/feel-alternating-dumbbell-curl.ts',
  'src/howto/generated/feel-barbell-curl.ts',
  'src/howto/generated/feel-barbell-shrug.ts',
  'src/howto/generated/feel-bayesian-cable-curl.ts',
  'src/howto/generated/feel-bear-crawl.ts',
  'src/howto/generated/feel-bird-dog.ts',
  'src/howto/generated/feel-bodyweight-lunge.ts',
  'src/howto/generated/feel-bodyweight-split-squat.ts',
  'src/howto/generated/feel-bodyweight-squat.ts',
  'src/howto/generated/feel-cable-crunch.ts',
  'src/howto/generated/feel-cable-lateral-raise.ts',
  'src/howto/generated/feel-cable-shrug.ts',
  'src/howto/generated/feel-dead-bug.ts',
  'src/howto/generated/feel-dumbbell-front-raise.ts',
  'src/howto/generated/feel-dumbbell-overhead-triceps-extension.ts',
  'src/howto/generated/feel-dumbbell-pullover.ts',
  'src/howto/generated/feel-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/feel-dumbbell-shrug.ts',
  'src/howto/generated/feel-ez-bar-curl.ts',
  'src/howto/generated/feel-face-pull.ts',
  'src/howto/generated/feel-farmer-s-carry.ts',
  'src/howto/generated/feel-forward-lunge.ts',
  'src/howto/generated/feel-front-squat.ts',
  'src/howto/generated/feel-hammer-curl.ts',
  'src/howto/generated/feel-hollow-body-hold.ts',
  'src/howto/generated/feel-incline-push-up.ts',
  'src/howto/generated/feel-kettlebell-swing.ts',
  'src/howto/generated/feel-landmine-row.ts',
  'src/howto/generated/feel-machine-crunch.ts',
  'src/howto/generated/feel-machine-lateral-raise.ts',
  'src/howto/generated/feel-medicine-ball-slam.ts',
  'src/howto/generated/feel-pendlay-row.ts',
  'src/howto/generated/feel-pike-push-up.ts',
  'src/howto/generated/feel-pistol-squat.ts',
  'src/howto/generated/feel-preacher-curl.ts',
  'src/howto/generated/feel-reverse-crunch.ts',
  'src/howto/generated/feel-reverse-curl.ts',
  'src/howto/generated/feel-single-arm-triceps-pushdown.ts',
  'src/howto/generated/feel-sled-push.ts',
  'src/howto/generated/feel-smith-machine-shrug.ts',
  'src/howto/generated/feel-t-bar-row.ts',
  'src/howto/generated/feel-walking-lunge.ts',
  'src/howto/generated/feel-wall-sit.ts',
  'src/howto/generated/handpair-bar-hang-only-curled-over.ts',
  'src/howto/generated/handpair-bar-hang-only-curled-under.ts',
  'src/howto/generated/handpair-bar-hang-over.ts',
  'src/howto/generated/handpair-bar-row-only-curled-over.ts',
  'src/howto/generated/handpair-curl-bar-under.ts',
  'src/howto/generated/handpair-curl-dumbbell-under.ts',
  'src/howto/generated/handpair-d-handle-pull-only-curled-unstated.ts',
  'src/howto/generated/handpair-ez-curl-angled.ts',
  'src/howto/generated/handpair-ez-curl-over.ts',
  'src/howto/generated/handpair-ez-curl-under.ts',
  'src/howto/generated/handpair-v-handle-pull-only-curled-neutral-overhead.ts',
  'src/howto/generated/ht-ab-wheel-rollout.ts',
  'src/howto/generated/ht-alternating-dumbbell-curl.ts',
  'src/howto/generated/ht-barbell-curl.ts',
  'src/howto/generated/ht-barbell-shrug.ts',
  'src/howto/generated/ht-bayesian-cable-curl.ts',
  'src/howto/generated/ht-bear-crawl.ts',
  'src/howto/generated/ht-bird-dog.ts',
  'src/howto/generated/ht-bodyweight-lunge.ts',
  'src/howto/generated/ht-bodyweight-split-squat.ts',
  'src/howto/generated/ht-bodyweight-squat.ts',
  'src/howto/generated/ht-cable-crunch.ts',
  'src/howto/generated/ht-cable-lateral-raise.ts',
  'src/howto/generated/ht-cable-shrug.ts',
  'src/howto/generated/ht-dead-bug.ts',
  'src/howto/generated/ht-dumbbell-front-raise.ts',
  'src/howto/generated/ht-dumbbell-overhead-triceps-extension.ts',
  'src/howto/generated/ht-dumbbell-pullover.ts',
  'src/howto/generated/ht-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/ht-dumbbell-shrug.ts',
  'src/howto/generated/ht-ez-bar-curl.ts',
  'src/howto/generated/ht-face-pull.ts',
  'src/howto/generated/ht-farmer-s-carry.ts',
  'src/howto/generated/ht-forward-lunge.ts',
  'src/howto/generated/ht-front-squat.ts',
  'src/howto/generated/ht-hammer-curl.ts',
  'src/howto/generated/ht-hollow-body-hold.ts',
  'src/howto/generated/ht-incline-push-up.ts',
  'src/howto/generated/ht-kettlebell-swing.ts',
  'src/howto/generated/ht-landmine-row.ts',
  'src/howto/generated/ht-machine-crunch.ts',
  'src/howto/generated/ht-machine-lateral-raise.ts',
  'src/howto/generated/ht-medicine-ball-slam.ts',
  'src/howto/generated/ht-pendlay-row.ts',
  'src/howto/generated/ht-pike-push-up.ts',
  'src/howto/generated/ht-pistol-squat.ts',
  'src/howto/generated/ht-preacher-curl.ts',
  'src/howto/generated/ht-reverse-crunch.ts',
  'src/howto/generated/ht-reverse-curl.ts',
  'src/howto/generated/ht-single-arm-triceps-pushdown.ts',
  'src/howto/generated/ht-sled-push.ts',
  'src/howto/generated/ht-smith-machine-shrug.ts',
  'src/howto/generated/ht-t-bar-row.ts',
  'src/howto/generated/ht-walking-lunge.ts',
  'src/howto/generated/ht-wall-sit.ts',
  'src/howto/generated/posture-ab-wheel-rollout.ts',
  'src/howto/generated/posture-alternating-dumbbell-curl.ts',
  'src/howto/generated/posture-barbell-curl.ts',
  'src/howto/generated/posture-barbell-shrug.ts',
  'src/howto/generated/posture-bayesian-cable-curl.ts',
  'src/howto/generated/posture-bear-crawl.ts',
  'src/howto/generated/posture-bird-dog.ts',
  'src/howto/generated/posture-bodyweight-lunge.ts',
  'src/howto/generated/posture-bodyweight-split-squat.ts',
  'src/howto/generated/posture-bodyweight-squat.ts',
  'src/howto/generated/posture-cable-crunch.ts',
  'src/howto/generated/posture-cable-lateral-raise.ts',
  'src/howto/generated/posture-cable-shrug.ts',
  'src/howto/generated/posture-dead-bug.ts',
  'src/howto/generated/posture-dumbbell-front-raise.ts',
  'src/howto/generated/posture-dumbbell-overhead-triceps-extension.ts',
  'src/howto/generated/posture-dumbbell-pullover.ts',
  'src/howto/generated/posture-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/posture-dumbbell-shrug.ts',
  'src/howto/generated/posture-ez-bar-curl.ts',
  'src/howto/generated/posture-face-pull.ts',
  'src/howto/generated/posture-farmer-s-carry.ts',
  'src/howto/generated/posture-forward-lunge.ts',
  'src/howto/generated/posture-front-squat.ts',
  'src/howto/generated/posture-hammer-curl.ts',
  'src/howto/generated/posture-hollow-body-hold.ts',
  'src/howto/generated/posture-incline-push-up.ts',
  'src/howto/generated/posture-kettlebell-swing.ts',
  'src/howto/generated/posture-landmine-row.ts',
  'src/howto/generated/posture-machine-crunch.ts',
  'src/howto/generated/posture-machine-lateral-raise.ts',
  'src/howto/generated/posture-medicine-ball-slam.ts',
  'src/howto/generated/posture-pendlay-row.ts',
  'src/howto/generated/posture-pike-push-up.ts',
  'src/howto/generated/posture-pistol-squat.ts',
  'src/howto/generated/posture-preacher-curl.ts',
  'src/howto/generated/posture-reverse-crunch.ts',
  'src/howto/generated/posture-reverse-curl.ts',
  'src/howto/generated/posture-single-arm-triceps-pushdown.ts',
  'src/howto/generated/posture-sled-push.ts',
  'src/howto/generated/posture-smith-machine-shrug.ts',
  'src/howto/generated/posture-t-bar-row.ts',
  'src/howto/generated/posture-walking-lunge.ts',
  'src/howto/generated/posture-wall-sit.ts',
  'src/slices/howto/css/zoom-ab-wheel-rollout.css',
  'src/slices/howto/css/zoom-alternating-dumbbell-curl.css',
  'src/slices/howto/css/zoom-assisted-pull-up.css',
  'src/slices/howto/css/zoom-barbell-curl.css',
  'src/slices/howto/css/zoom-barbell-shrug.css',
  'src/slices/howto/css/zoom-bayesian-cable-curl.css',
  'src/slices/howto/css/zoom-bear-crawl.css',
  'src/slices/howto/css/zoom-bird-dog.css',
  'src/slices/howto/css/zoom-bodyweight-lunge.css',
  'src/slices/howto/css/zoom-bodyweight-split-squat.css',
  'src/slices/howto/css/zoom-bodyweight-squat.css',
  'src/slices/howto/css/zoom-cable-crunch.css',
  'src/slices/howto/css/zoom-cable-lateral-raise.css',
  'src/slices/howto/css/zoom-cable-shrug.css',
  'src/slices/howto/css/zoom-chin-up.css',
  'src/slices/howto/css/zoom-close-grip-pulldown.css',
  'src/slices/howto/css/zoom-dead-bug.css',
  'src/slices/howto/css/zoom-dumbbell-biceps-curl.css',
  'src/slices/howto/css/zoom-dumbbell-front-raise.css',
  'src/slices/howto/css/zoom-dumbbell-overhead-triceps-extension.css',
  'src/slices/howto/css/zoom-dumbbell-pullover.css',
  'src/slices/howto/css/zoom-dumbbell-romanian-deadlift.css',
  'src/slices/howto/css/zoom-dumbbell-shrug.css',
  'src/slices/howto/css/zoom-ez-bar-curl.css',
  'src/slices/howto/css/zoom-face-pull.css',
  'src/slices/howto/css/zoom-farmer-s-carry.css',
  'src/slices/howto/css/zoom-forward-lunge.css',
  'src/slices/howto/css/zoom-front-squat.css',
  'src/slices/howto/css/zoom-hammer-curl.css',
  'src/slices/howto/css/zoom-hanging-knee-raise.css',
  'src/slices/howto/css/zoom-hollow-body-hold.css',
  'src/slices/howto/css/zoom-incline-push-up.css',
  'src/slices/howto/css/zoom-inverted-row.css',
  'src/slices/howto/css/zoom-kettlebell-swing.css',
  'src/slices/howto/css/zoom-landmine-row.css',
  'src/slices/howto/css/zoom-machine-crunch.css',
  'src/slices/howto/css/zoom-machine-lateral-raise.css',
  'src/slices/howto/css/zoom-medicine-ball-slam.css',
  'src/slices/howto/css/zoom-pendlay-row.css',
  'src/slices/howto/css/zoom-pike-push-up.css',
  'src/slices/howto/css/zoom-pistol-squat.css',
  'src/slices/howto/css/zoom-preacher-curl.css',
  'src/slices/howto/css/zoom-reverse-crunch.css',
  'src/slices/howto/css/zoom-reverse-curl.css',
  'src/slices/howto/css/zoom-single-arm-lat-pulldown.css',
  'src/slices/howto/css/zoom-single-arm-triceps-pushdown.css',
  'src/slices/howto/css/zoom-sled-push.css',
  'src/slices/howto/css/zoom-smith-machine-shrug.css',
  'src/slices/howto/css/zoom-t-bar-row.css',
  'src/slices/howto/css/zoom-walking-lunge.css',
  'src/slices/howto/css/zoom-wall-sit.css',
];
/** LIB-SHIP W9: coverage.ts's 10 W9 rows as main has them (status pending, the row's archetype, stage approved-plate). */
export const W9_COVERAGE_MAIN: Record<string, string> = {
  lib_barbell_bench_press: 'push', lib_conventional_deadlift: 'hold', lib_sumo_deadlift: 'hold', lib_bulgarian_split_squat: 'hold', lib_cable_curl: 'curl',
  lib_cable_chest_press: 'push', lib_hip_adduction: 'balance', lib_diamond_push_up: 'palm-flat', lib_side_plank: 'none', lib_wall_ball: 'implement',
};
const W9_SHORT = W9_IDS.map(i => i.slice(4)), W9_CHROME = W9_SHORT.map(i => i.replace(/_/g, '-'));
const W9_LOADER_LINE = new RegExp(`^  (?:"lib_(?:${W9_SHORT.join('|')})",|lib_(?:${W9_SHORT.join('|')}): \\(\\) => |"(?:${W9_CHROME.join('|')})": \\(\\) => )`);
/** LIB-SHIP W9: a generated file's text with W9's own change taken out (null for a file W9 adds, and for ids.ts): its header
 *  (line 1, kept as a blank line) and `hashes:` line for the header-only files; loaders.ts less its 41 W9 lines; coverage.ts
 *  with its header blanked and the 10 W9 rows as main has them. Any other file is returned unchanged. */
export function w9GenText(p: string, t: string): string | null {
  if (W9_GEN_ADDED.includes(p) || p === 'src/howto/ids.ts') return null;
  if (W9_GEN_HEADERS.includes(p)) return `\n${t.slice(t.indexOf('\n') + 1).split('\n').filter(l => !/^ *hashes: \{ inputsSha256: /.test(l)).join('\n')}`;
  if (p === 'src/howto/generated/loaders.ts') return t.split('\n').filter(l => !W9_LOADER_LINE.test(l)).join('\n');
  if (p === 'src/howto/coverage.ts') {
    let o = t;
    for (const [id, a] of Object.entries(W9_COVERAGE_MAIN)) o = o.replace(`  '${id}': { status: 'approved', stage: 'shipped' },`, `  '${id}': { status: 'pending', archetype: '${a}', stage: "approved-plate" },`);
    return `\n${o.slice(o.indexOf('\n') + 1)}`;
  }
  return t;
}

/** D-W9-WATCHMAIN-TESTS (#433, supervisor): the exact set of shipped feels with `watchMain: true`, each with the muscles it
 *  keeps both Main and watched (F-DL-LIFTOFF D-DL-WATCHMAIN #427). checkC2's "both primary and watch" finding is allowed
 *  only for these, and only when the feel sets watchMain === true and the muscle is in feel.watch. */
export const WATCHMAIN_OK: Readonly<Record<string, readonly string[]>> = { lib_conventional_deadlift: ['lower_back'] };
/** checkC2's findings for `id` with the WATCHMAIN_OK allowance applied, plus the set's own reds: watchMain on an id outside
 *  the set, or a set id whose feel no longer sets it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function c2WatchMain(id: string, feel: any, c2: readonly string[]): string[] {
  const ok = WATCHMAIN_OK[id], bad: string[] = [];
  if (feel?.watchMain === true && !ok) bad.push(`C2: ${id} sets feel.watchMain outside D-W9-WATCHMAIN-TESTS's set`);
  if (ok && feel?.watchMain !== true) bad.push(`C2: ${id} is in D-W9-WATCHMAIN-TESTS's set, but its feel does not set watchMain`);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const watched = new Set((feel?.watch ?? []).map((m: any) => m.muscleId));
  return [...bad, ...c2.filter(f => {
    const m = /^C2: muscleId "([a-z_]+)" is both primary and watch$/.exec(f);
    return !(m && ok && feel?.watchMain === true && ok.includes(m[1]!) && watched.has(m[1]!));
  })];
}
