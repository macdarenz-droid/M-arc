// LIB-SHIP W10 (W10 LAYERS APPROVED, #434 6923360626; D-SHIP-W10-STAMP, D-SHIP-W10-LAYERS; D-W10-JSLAND2 6923406051): the
// layers wave. The one list every W10 guard reads; the layers-page entry check of each re-pinned page (lesson 2); the carry
// compares (A2, D-W10-UNDERHAND; mountain_climbers' 0523227e card); jump_squat's card edit (A3, D-W10-JUMPSQ) and plate-alt
// re-pin (D-W10-JSLAND2); the MANIFEST transforms (lessW10, w10First); the pre-W10 layers configs (preW10Config).
import { createHash } from 'node:crypto';
import { SC_LAYERS_APPROVAL, toMainCopy } from '../sheetcopy-pins';
import { cardOf, lessHandPanel } from './ship-w9';

/** The 5 ids W10 ships, per batch file in row order. */
export const W10_SHIPPED: Record<string, readonly string[]> = {
  'tools/plates/library/batches/lb01.json': ['lib_underhand_lat_pulldown'],
  'tools/plates/library/batches/lb02.json': ['lib_decline_bench_press'],
  'tools/plates/library/batches/lb04.json': ['lib_jump_squat'],
  'tools/plates/library/batches/lb06.json': ['lib_hip_abduction'],
  'tools/plates/library/batches/pilot-a.json': ['lib_mountain_climbers'],
};
export const W10_IDS: string[] = Object.values(W10_SHIPPED).flat();
export const w10Of = (batchFile: string): string[] => [...(W10_SHIPPED[batchFile] ?? [])];
/** Held at main's bytes (approved-plate): the 9 W10 LAYERS APPROVED holds (follow-up cards), one_arm_dumbbell_row
 *  (D-W10-OADRHOLD, F-OADR-CALLOUT) and the S4 rows cable_external_rotation and jumping_jacks (#435; W11). */
export const W10_HELD: readonly string[] = [
  'lib_smith_machine_bench_press', 'lib_weighted_dip', 'lib_close_grip_bench_press', 'lib_incline_dumbbell_press', 'lib_high_to_low_cable_fly',
  'lib_machine_pullover', 'lib_burpee', 'lib_straight_bar_triceps_pushdown', 'lib_smith_machine_squat', 'lib_one_arm_dumbbell_row',
  'lib_cable_external_rotation', 'lib_jumping_jacks',
];

/** The approval every W10 layers-page entry carries, exactly: the LAYERS APPROVED comment @ the LAYERS READY head. */
export const W10_LAYERS_APPROVAL = 'https://github.com/macdarenz-droid/M-arc/pull/434#issuecomment-6923360626 @ d642147ea685fbb2c120a6d7521a3131bc692e55';
type Pin = { sha: string; bytes: number };
/** Each W10 page's entry: appended last as a 'supervisor' D-SHIP-W10-LAYERS entry (D-BODYMAP-APPEND), with its index, the
 *  entry it supersedes and that entry's decision, the ids, its page pin and the superseded entry's pin (W9 head's). */
export const W10_LAYERS: Record<string, { at: number; supersedes: number; wasDecision: string; ids: string[]; page: Pin; was: Pin }> = {
  lb01: {
    at: 23, supersedes: 22, wasDecision: 'D-SHIP-W8C-LAYERS',
    ids: ['lib_chin_up', 'lib_hanging_knee_raise', 'lib_assisted_pull_up', 'lib_inverted_row', 'lib_close_grip_pulldown', 'lib_underhand_lat_pulldown', 'lib_single_arm_lat_pulldown', 'lib_straight_arm_pulldown', 'lib_chest_supported_row', 'lib_resistance_band_row'],
    page: { sha: '8898c07177948b25956647356f4b08ffbede5d770602c08b4d884d595f2f68b4', bytes: 2805902 },
    was: { sha: '60a88e7932c311bbc10795a49c4ec8176a3eb80c3def1265b38a2d3299db9d9d', bytes: 2481927 },
  },
  lb02: {
    at: 14, supersedes: 13, wasDecision: 'D-SHIP-W9-LAYERS',
    ids: ['lib_barbell_bench_press', 'lib_decline_bench_press', 'lib_dumbbell_pullover'],
    page: { sha: 'a9257f7f9a3da16cb139f17432a79abc57cfc4df7464fbb366ac803bf7da3f06', bytes: 596534 },
    was: { sha: '993e4adbc9678d8c91c7d9107436835831e972ad81464b5329af97b2ef45ecb7', bytes: 431486 },
  },
  lb04: {
    at: 19, supersedes: 16, wasDecision: 'D-SHIP-W9-LAYERS',
    ids: ['lib_front_squat', 'lib_bodyweight_squat', 'lib_wall_sit', 'lib_pistol_squat', 'lib_jump_squat', 'lib_forward_lunge', 'lib_walking_lunge', 'lib_bodyweight_lunge', 'lib_bodyweight_split_squat', 'lib_bulgarian_split_squat'],
    page: { sha: '8f2abdcf0b612f352e314dd1532c6c24edcffca7bad14a40920530b1008a781a', bytes: 2191457 },
    was: { sha: 'fcad45279a2da306670097ab0a813cdd1c2f0d28c99139f7767239986bf5d7d3', bytes: 1990139 },
  },
  lb06: {
    at: 20, supersedes: 19, wasDecision: 'D-SHIP-W9-LAYERS',
    ids: ['lib_cable_chest_press', 'lib_machine_crunch', 'lib_hip_abduction', 'lib_hip_adduction', 'lib_machine_lateral_raise'],
    page: { sha: '1b73f6c4c20ed2d164e2dc3d9355c5c7b10fb521b653612786cab7c709a83f91', bytes: 1181992 },
    was: { sha: '08b6e9d56f233a9ca48d43737217eae6a6aff833401a09347b25444009262420', bytes: 973900 },
  },
  'pilot-a': {
    at: 29, supersedes: 28, wasDecision: 'F-SHEET-COPY',
    ids: ['lib_barbell_overhead_press', 'lib_dumbbell_biceps_curl', 'lib_pec_fly', 'lib_plank', 'lib_rope_triceps_pushdown', 'lib_barbell_row', 'lib_dumbbell_bench_press', 'lib_dumbbell_shoulder_press', 'lib_mountain_climbers', 'lib_romanian_deadlift', 'lib_single_leg_romanian_deadlift', 'lib_triceps_pushdown', 'lib_upright_row'],
    page: { sha: 'bcaeb030705063e97cd78e496ede496f77b3bec6c5977d698d3bb67c340d2461', bytes: 2554533 },
    was: { sha: '7a7e2998ad918234e39feb9cc68725cfbcdacaf56a03a66a38059381d015359d', bytes: 2351010 },
  },
};
const sha = (b: Buffer | string) => createHash('sha256').update(b).digest('hex');
/** The W10 entry of `batch` whole (the w9LayersProblems form). [problems] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function w10LayersProblems(file: any, batch: string, page: Buffer): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const W = W10_LAYERS[batch]!, E = file.entries as any[], e = E[E.length - 1], bad: string[] = [];
  if (E.length - 1 !== W.at) bad.push(`${batch} W10: entry index ${E.length - 1}`);
  if (e?.kind !== 'layers-page' || e.decision !== 'D-SHIP-W10-LAYERS' || e.approvedBy !== 'supervisor' || e.approval !== W10_LAYERS_APPROVAL) return [...bad, `${batch} W10: entry ${e?.kind} ${e?.decision} ${e?.approval}`];
  if (e.supersedes !== W.supersedes || E[W.supersedes]?.kind !== 'layers-page' || E[W.supersedes]?.decision !== W.wasDecision) bad.push(`${batch} W10: supersedes ${e.supersedes}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(W.ids)) bad.push(`${batch} W10: ids ${e.ids}`);
  if (e.pageSha256 !== W.page.sha || e.bytes !== W.page.bytes) bad.push(`${batch} W10: page pin`);
  if (sha(page) !== W.page.sha || page.length !== W.page.bytes) bad.push(`${batch} W10: committed page`);
  const was = E[W.supersedes];
  if (was?.pageSha256 !== W.was.sha || was?.bytes !== W.was.bytes) bad.push(`${batch} W10: superseded pin`);
  return bad;
}

/** D-W10-JSLAND2 (#434 6923406051): lb04's two owner D-OWNER-REPIN entries (jump_squat plate 17 over 6, plates page 18 over
 *  0), between W9's entry 16 and W10's 19. Only the plate's fragments.alt moves; the page pin is the rebuilt plates page. */
export const JSLAND2_APPROVAL = 'https://github.com/macdarenz-droid/M-arc/pull/434#issuecomment-6923406051 @ e34ffd8b3ae8d11d4b628183de5b8dcbddc75721';
export const JSLAND2 = {
  plate: { at: 17, supersedes: 6, alt: '29f6b426f32ac93273a34bd564c3c66047c2978d183f62aa16f30a8c7c7dadbf' },
  page: { at: 18, supersedes: 0, sha: 'e7a77b9c27b6909704a896f9325db76dc1418e9c7fcc5d2c6c988c08cc0308d8' },
};
/** lb04's JSLAND2 entries whole. [problems] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function jsland2Problems(file: any): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const E = file.entries as any[], p = E[JSLAND2.plate.at], g = E[JSLAND2.page.at], was = E[JSLAND2.plate.supersedes], bad: string[] = [];
  for (const [e, k] of [[p, 'plate'], [g, 'page']] as const) if (e?.kind !== k || e.approvedBy !== 'owner' || e.decision !== 'D-OWNER-REPIN' || e.approval !== JSLAND2_APPROVAL) bad.push(`lb04 JSLAND2 ${k}: ${e?.kind} ${e?.decision}`);
  if (p?.id !== 'lib_jump_squat' || p?.supersedes !== JSLAND2.plate.supersedes || was?.id !== 'lib_jump_squat') bad.push('lb04 JSLAND2: plate entry target');
  else for (const k of Object.keys(was.fragments)) if ((k === 'alt') === (p.fragments[k] === was.fragments[k])) bad.push(`lb04 JSLAND2: fragment ${k} ${k === 'alt' ? 'unchanged' : 'moved'}`);
  if (p?.fragments?.alt !== JSLAND2.plate.alt) bad.push('lb04 JSLAND2: alt hash');
  if (g?.supersedes !== JSLAND2.page.supersedes || g?.pageSha256 !== JSLAND2.page.sha) bad.push('lb04 JSLAND2: page pin');
  return bad;
}
/** `file` less W10's entries (checked first: throws on any problem), with the pin of the entry W10's layers entry supersedes:
 *  checks measured before W10 run on it unchanged (the W8a/W9 form). lb04 also loses the two JSLAND2 entries. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW10Entry(file: any, batch: string, page: Buffer): { file: any; pin: Pin } {
  const bad = [...w10LayersProblems(file, batch, page), ...(batch === 'lb04' ? jsland2Problems(file) : [])];
  if (bad.length) throw new Error(bad.join('\n'));
  return { file: { ...file, entries: file.entries.slice(0, batch === 'lb04' ? -3 : -1) }, pin: W10_LAYERS[batch]!.was };
}

/** A2: each carried card's judged form and its sha. underhand: the judged PF5 card (72732fc9 @ f487c797) less its hand
 *  panel (D-W10-UNDERHAND); mountain_climbers: W8c's 0523227e card (hand panel 594e9df8 = SCRATCH_PANEL). */
export const W10_JUDGED: Record<string, { judged: string; hand?: true }> = {
  lib_underhand_lat_pulldown: { judged: 'ac8afb41073755451e40740479b84bf6b9b29cc7477ef739e1b90de2dbaf8be2', hand: true },
  lib_mountain_climbers: { judged: 'e4f35ba02d70b56a14980849f0dd872471aa844ee068965f8844812275324ee8' },
};
export function w10JudgedForm(card: string, id: string): string {
  const chrome = id.slice(4).replace(/_/g, '-'), t = toMainCopy(card, { page: true });
  return W10_JUDGED[id]!.hand ? lessHandPanel(t, chrome) : t;
}
/** A2: the committed card of every carried W10 id, in its judged form, against its judged sha. [problems] */
export function w10CarryProblems(pages: Record<string, string>): string[] {
  const bad: string[] = [];
  for (const [id, page] of [['lib_underhand_lat_pulldown', 'lb01'], ['lib_mountain_climbers', 'pilot-a']] as const) {
    const s = sha(w10JudgedForm(cardOf(pages[page]!, id.slice(4).replace(/_/g, '-')), id));
    if (s !== W10_JUDGED[id]!.judged) bad.push(`${id}: judged form ${s}`);
  }
  return bad;
}

/** The pre-W10 (W9 head 6571b0b8) layers config of `page`, from the committed one with W10's own lines taken out (each
 *  exactly once), pinned to that file's sha256 at the W9 head. */
export const PRE_W10_SHA: Record<string, string> = {
  lb01: '23864742dce3b53117125ec92c2ba6e1ffa8473d369523eda0687eb399da470e',
  lb02: '9e89ef467e70e2e1bc8b114b327a58000a86c62a3ccc9fa6577e7bf7da6ed3b8',
  lb04: '9286103902409790199c4380e8d8d47d5998c834934808e9eb692384e4338490',
  lb06: 'cf7b54dcf1386867ebd1d8ced41747ec6e0e9fea480f0b84f7d1d4824d6c3aa7',
  'pilot-a': '795a2c0a730fb20d3c12d80ec780fbf99551f956fa8e3bdf427277dc9c0c0f97',
};
export const W10_CONFIG_LINES: Record<string, [string, string][]> = {
  lb01: [
    ['        "lib_close_grip_pulldown",\n        "lib_underhand_lat_pulldown",\n', '        "lib_close_grip_pulldown",\n'],
    [',\n    "lib_underhand_lat_pulldown": {\n      "optionsKey": "underhand_lat_pulldown",\n      "pair": "bar-pulldown-under",\n      "pairFaults": [\n        "curled"\n      ]\n    }\n', '\n'],
  ],
  lb02: [['        "lib_barbell_bench_press",\n        "lib_decline_bench_press",\n', '        "lib_barbell_bench_press",\n']],
  lb04: [
    ['        "lib_pistol_squat",\n        "lib_jump_squat",\n', '        "lib_pistol_squat",\n'],
    [',\n    "lib_jump_squat": {\n      "optionsKey": "jump_squat"\n    }\n', '\n'],
  ],
  lb06: [
    ['        "lib_machine_crunch",\n        "lib_hip_abduction",\n', '        "lib_machine_crunch",\n'],
    [',\n    "lib_hip_abduction": {\n      "optionsKey": "hip_abduction"\n    }\n', '\n'],
  ],
  'pilot-a': [
    ['"lib_dumbbell_shoulder_press", "lib_mountain_climbers", "lib_romanian_deadlift"', '"lib_dumbbell_shoulder_press", "lib_romanian_deadlift"'],
    [/* the #424 row (one line) */ '', ''],
  ],
};
export function preW10Config(page: string, committed: string): string {
  let t = committed;
  for (const [a, b] of W10_CONFIG_LINES[page]!) {
    if (!a) {   // the #424 row: one line, exactly once
      const rows = t.split('\n').filter(l => l.startsWith('    "lib_mountain_climbers": {'));
      if (rows.length !== 1) throw new Error(`preW10Config ${page}: mountain_climbers' row ${rows.length} times`);
      t = t.replace(`${rows[0]}\n`, ''); continue;
    }
    if (t.split(a).length !== 2) throw new Error(`preW10Config ${page}: W10's line is not there exactly once: ${a.slice(0, 60)}`);
    t = t.replace(a, b);
  }
  const s = sha(t);
  if (s !== PRE_W10_SHA[page]) throw new Error(`preW10Config ${page}: ${s} is not the W9 head's config (drift)`);
  return t;
}

/** LIB-SHIP W10: the MANIFEST keys its flip moved, each with its value at the W9 head 6571b0b8. */
export const W10_MOVED: Record<string, string> = {
  'tools/plates/library/batches/lb01.json': '59273c77736df595085653bf57908921f5c61e0be5756ffee52c5a086c0cb09a',
  'tools/plates/library/pages/lb01.layers.json': '23864742dce3b53117125ec92c2ba6e1ffa8473d369523eda0687eb399da470e',
  'tools/plates/library/batches/lb02.json': '6e63936120901d489717e00efb044b65e847daaf6b2e4d63b275589f729f25b8',
  'tools/plates/library/pages/lb02.layers.json': '9e89ef467e70e2e1bc8b114b327a58000a86c62a3ccc9fa6577e7bf7da6ed3b8',
  'tools/plates/library/batches/lb04.json': '751ec062fa51b70c44b252b2a253c78262ff2c356de7eaea19493ce8506d95c5',
  'tools/plates/library/pages/lb04.layers.json': '9286103902409790199c4380e8d8d47d5998c834934808e9eb692384e4338490',
  'tools/plates/library/batches/lb06.json': '6b477a2c7f3109e24ff36d5b42d8da59a3ba5ed9e924aa6c016cd6780900df1a',
  'tools/plates/library/pages/lb06.layers.json': 'cf7b54dcf1386867ebd1d8ced41747ec6e0e9fea480f0b84f7d1d4824d6c3aa7',
  'tools/plates/library/batches/pilot-a.json': 'ce946e082ff3ca759c34ea20a7c9aa3917c876dc74d8e64eef7996a0a64ee2f2',
  'tools/plates/library/pages/pilot-a.layers.json': '795a2c0a730fb20d3c12d80ec780fbf99551f956fa8e3bdf427277dc9c0c0f97',
  'tools/plates/library/pages/pilot-a.closeups.mjs': '0fabff0585f1825fbc31ff2b696e4740376a7c704da00b3ae084b54e3c9b4c9d',
  'tools/plates/library/howto/lib_mountain_climbers.howto.mjs': 'a89b5a02c3544639886982ea33639c2915eb6ad1dc38f963f02bb8a193ddd0ba',
  'tools/plates/library/howto/lib_decline_bench_press.howto.mjs': 'fd65af1c591a2f17a1ed42cf1e84fc0d6e631f53fdcda45366af9db322573f98',
  'tools/plates/library/specs/jump_squat.mjs': '6d3361d1d84800fd9a89aa1bd5decbb4593207a6e5183602d878e979622b616c',
};
/** The keys W10 adds, per row: each shipped pair row's research card (cited by its pair words; manifest filesOf). */
export const W10_ADDED: Record<string, string> = {
  lib_mountain_climbers: 'docs/research/howto/cards/mountain_climbers.json',
  lib_underhand_lat_pulldown: 'docs/research/howto/cards/underhand_lat_pulldown.json',
};
/** jump_squat's plate-entry hash before and after D-W10-JSLAND2 (the only row entry W10 moves). */
export const W10_ENTRY = { id: 'lib_jump_squat', was: '7b13bdf57ebb29e3bef3309bc1b836a1cdda2ad5f5abb096d16504079baad492', now: 'f8dda1e3aacacfc8dbacabd818aa13f87ca5de585a9429c1621bde7b320f3d3f' };
/** The MANIFEST with W10's moves put back to the W9 head's values (a copy): moved keys back, added keys out, jump_squat's
 *  entry back. A moved or added key off its file, or another entry, is a problem. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW10(m: any, shaOfFile: (p: string) => string, problems: string[] = []): any {
  const c = structuredClone(m);
  for (const [id, k] of Object.entries(W10_ADDED)) {
    const r = c.rows[id];
    if (!r || !(k in r.files)) { problems.push(`${id}: ${k} not added`); continue; }
    if (r.files[k] !== shaOfFile(k)) problems.push(`${id}: ${k} off its file`);
    else delete r.files[k];
  }
  const e = c.rows[W10_ENTRY.id];
  if (e?.entry !== W10_ENTRY.now) problems.push(`${W10_ENTRY.id}: entry ${e?.entry}`); else e.entry = W10_ENTRY.was;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [id, r] of Object.entries<any>(c.rows)) for (const [k, was] of Object.entries(W10_MOVED)) if (k in r.files) {
    if (r.files[k] !== shaOfFile(k)) { problems.push(`${id}: ${k} off its file`); continue; }
    r.files[k] = was;
  }
  return c;
}
/** The file sha a check that runs after lessW10 should see: the W9 head's value for a W10-moved key, the file's own otherwise. */
export const w10First = (shaOfFile: (p: string) => string) => (p: string): string => W10_MOVED[p] ?? shaOfFile(p);

/** `file` (and its committed `page`) under W10: for a W10 page, less W10's entries (checked whole first) with the pin W10's
 *  entry supersedes in place of the page bytes; any other page unchanged. Checks measured before W10 run on it. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function underW10(file: any, batch: string, page: Buffer): { file: any; page: Buffer | Pin } {
  if (!(batch in W10_LAYERS)) return { file, page };
  const r = lessW10Entry(file, batch, page);
  return { file: r.file, page: r.pin };
}

/** LIB-SHIP W10: the generated files the W10 flip adds (the 5 ids' ht-, feel-, posture- and zoom css, and the two handpair
 *  sub-key chunks; 22), exactly. */
export const W10_GEN_ADDED: readonly string[] = [
  'src/howto/generated/feel-decline-bench-press.ts',
  'src/howto/generated/feel-hip-abduction.ts',
  'src/howto/generated/feel-jump-squat.ts',
  'src/howto/generated/feel-mountain-climbers.ts',
  'src/howto/generated/feel-underhand-lat-pulldown.ts',
  'src/howto/generated/handpair-bar-pulldown-only-curled-under.ts',
  'src/howto/generated/handpair-palm-flat-floor-only-hand-ahead-over.ts',
  'src/howto/generated/ht-decline-bench-press.ts',
  'src/howto/generated/ht-hip-abduction.ts',
  'src/howto/generated/ht-jump-squat.ts',
  'src/howto/generated/ht-mountain-climbers.ts',
  'src/howto/generated/ht-underhand-lat-pulldown.ts',
  'src/howto/generated/posture-decline-bench-press.ts',
  'src/howto/generated/posture-hip-abduction.ts',
  'src/howto/generated/posture-jump-squat.ts',
  'src/howto/generated/posture-mountain-climbers.ts',
  'src/howto/generated/posture-underhand-lat-pulldown.ts',
  'src/slices/howto/css/zoom-decline-bench-press.css',
  'src/slices/howto/css/zoom-hip-abduction.css',
  'src/slices/howto/css/zoom-jump-squat.css',
  'src/slices/howto/css/zoom-mountain-climbers.css',
  'src/slices/howto/css/zoom-underhand-lat-pulldown.css',
];
/** LIB-SHIP W10: the generated files whose line-1 inputsSha256 header (and, in the ht- modules, the `hashes:` line) the W10
 *  flip moves without changing any other byte, measured against the W9 head 6571b0b8 (161). */
export const W10_GEN_HEADERS: readonly string[] = [
  'src/howto/generated/feel-assisted-pull-up.ts',
  'src/howto/generated/feel-barbell-bench-press.ts',
  'src/howto/generated/feel-barbell-overhead-press.ts',
  'src/howto/generated/feel-barbell-row.ts',
  'src/howto/generated/feel-bodyweight-lunge.ts',
  'src/howto/generated/feel-bodyweight-split-squat.ts',
  'src/howto/generated/feel-bodyweight-squat.ts',
  'src/howto/generated/feel-bulgarian-split-squat.ts',
  'src/howto/generated/feel-cable-chest-press.ts',
  'src/howto/generated/feel-chest-supported-row.ts',
  'src/howto/generated/feel-chin-up.ts',
  'src/howto/generated/feel-close-grip-pulldown.ts',
  'src/howto/generated/feel-dumbbell-bench-press.ts',
  'src/howto/generated/feel-dumbbell-biceps-curl.ts',
  'src/howto/generated/feel-dumbbell-pullover.ts',
  'src/howto/generated/feel-dumbbell-shoulder-press.ts',
  'src/howto/generated/feel-forward-lunge.ts',
  'src/howto/generated/feel-front-squat.ts',
  'src/howto/generated/feel-hanging-knee-raise.ts',
  'src/howto/generated/feel-hip-adduction.ts',
  'src/howto/generated/feel-inverted-row.ts',
  'src/howto/generated/feel-machine-crunch.ts',
  'src/howto/generated/feel-machine-lateral-raise.ts',
  'src/howto/generated/feel-pec-fly.ts',
  'src/howto/generated/feel-pistol-squat.ts',
  'src/howto/generated/feel-plank.ts',
  'src/howto/generated/feel-resistance-band-row.ts',
  'src/howto/generated/feel-romanian-deadlift.ts',
  'src/howto/generated/feel-rope-triceps-pushdown.ts',
  'src/howto/generated/feel-single-arm-lat-pulldown.ts',
  'src/howto/generated/feel-single-leg-romanian-deadlift.ts',
  'src/howto/generated/feel-straight-arm-pulldown.ts',
  'src/howto/generated/feel-triceps-pushdown.ts',
  'src/howto/generated/feel-upright-row.ts',
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
  'src/howto/generated/ht-assisted-pull-up.ts',
  'src/howto/generated/ht-barbell-bench-press.ts',
  'src/howto/generated/ht-barbell-overhead-press.ts',
  'src/howto/generated/ht-barbell-row.ts',
  'src/howto/generated/ht-bodyweight-lunge.ts',
  'src/howto/generated/ht-bodyweight-split-squat.ts',
  'src/howto/generated/ht-bodyweight-squat.ts',
  'src/howto/generated/ht-bulgarian-split-squat.ts',
  'src/howto/generated/ht-cable-chest-press.ts',
  'src/howto/generated/ht-chest-supported-row.ts',
  'src/howto/generated/ht-chin-up.ts',
  'src/howto/generated/ht-close-grip-pulldown.ts',
  'src/howto/generated/ht-dumbbell-bench-press.ts',
  'src/howto/generated/ht-dumbbell-biceps-curl.ts',
  'src/howto/generated/ht-dumbbell-pullover.ts',
  'src/howto/generated/ht-dumbbell-shoulder-press.ts',
  'src/howto/generated/ht-forward-lunge.ts',
  'src/howto/generated/ht-front-squat.ts',
  'src/howto/generated/ht-hanging-knee-raise.ts',
  'src/howto/generated/ht-hip-adduction.ts',
  'src/howto/generated/ht-inverted-row.ts',
  'src/howto/generated/ht-machine-crunch.ts',
  'src/howto/generated/ht-machine-lateral-raise.ts',
  'src/howto/generated/ht-pec-fly.ts',
  'src/howto/generated/ht-pistol-squat.ts',
  'src/howto/generated/ht-plank.ts',
  'src/howto/generated/ht-resistance-band-row.ts',
  'src/howto/generated/ht-romanian-deadlift.ts',
  'src/howto/generated/ht-rope-triceps-pushdown.ts',
  'src/howto/generated/ht-single-arm-lat-pulldown.ts',
  'src/howto/generated/ht-single-leg-romanian-deadlift.ts',
  'src/howto/generated/ht-straight-arm-pulldown.ts',
  'src/howto/generated/ht-triceps-pushdown.ts',
  'src/howto/generated/ht-upright-row.ts',
  'src/howto/generated/ht-walking-lunge.ts',
  'src/howto/generated/ht-wall-sit.ts',
  'src/howto/generated/posture-assisted-pull-up.ts',
  'src/howto/generated/posture-barbell-bench-press.ts',
  'src/howto/generated/posture-barbell-overhead-press.ts',
  'src/howto/generated/posture-barbell-row.ts',
  'src/howto/generated/posture-bodyweight-lunge.ts',
  'src/howto/generated/posture-bodyweight-split-squat.ts',
  'src/howto/generated/posture-bodyweight-squat.ts',
  'src/howto/generated/posture-bulgarian-split-squat.ts',
  'src/howto/generated/posture-cable-chest-press.ts',
  'src/howto/generated/posture-chest-supported-row.ts',
  'src/howto/generated/posture-chin-up.ts',
  'src/howto/generated/posture-close-grip-pulldown.ts',
  'src/howto/generated/posture-dumbbell-bench-press.ts',
  'src/howto/generated/posture-dumbbell-biceps-curl.ts',
  'src/howto/generated/posture-dumbbell-pullover.ts',
  'src/howto/generated/posture-dumbbell-shoulder-press.ts',
  'src/howto/generated/posture-forward-lunge.ts',
  'src/howto/generated/posture-front-squat.ts',
  'src/howto/generated/posture-hanging-knee-raise.ts',
  'src/howto/generated/posture-hip-adduction.ts',
  'src/howto/generated/posture-inverted-row.ts',
  'src/howto/generated/posture-machine-crunch.ts',
  'src/howto/generated/posture-machine-lateral-raise.ts',
  'src/howto/generated/posture-pec-fly.ts',
  'src/howto/generated/posture-pistol-squat.ts',
  'src/howto/generated/posture-plank.ts',
  'src/howto/generated/posture-resistance-band-row.ts',
  'src/howto/generated/posture-romanian-deadlift.ts',
  'src/howto/generated/posture-rope-triceps-pushdown.ts',
  'src/howto/generated/posture-single-arm-lat-pulldown.ts',
  'src/howto/generated/posture-single-leg-romanian-deadlift.ts',
  'src/howto/generated/posture-straight-arm-pulldown.ts',
  'src/howto/generated/posture-triceps-pushdown.ts',
  'src/howto/generated/posture-upright-row.ts',
  'src/howto/generated/posture-walking-lunge.ts',
  'src/howto/generated/posture-wall-sit.ts',
  'src/slices/howto/css/zoom-alternating-dumbbell-curl.css',
  'src/slices/howto/css/zoom-assisted-pull-up.css',
  'src/slices/howto/css/zoom-barbell-bench-press.css',
  'src/slices/howto/css/zoom-barbell-curl.css',
  'src/slices/howto/css/zoom-barbell-overhead-press.css',
  'src/slices/howto/css/zoom-barbell-row.css',
  'src/slices/howto/css/zoom-bodyweight-lunge.css',
  'src/slices/howto/css/zoom-bodyweight-split-squat.css',
  'src/slices/howto/css/zoom-bodyweight-squat.css',
  'src/slices/howto/css/zoom-bulgarian-split-squat.css',
  'src/slices/howto/css/zoom-cable-chest-press.css',
  'src/slices/howto/css/zoom-cable-curl.css',
  'src/slices/howto/css/zoom-chest-supported-row.css',
  'src/slices/howto/css/zoom-chin-up.css',
  'src/slices/howto/css/zoom-close-grip-pulldown.css',
  'src/slices/howto/css/zoom-dumbbell-bench-press.css',
  'src/slices/howto/css/zoom-dumbbell-biceps-curl.css',
  'src/slices/howto/css/zoom-dumbbell-pullover.css',
  'src/slices/howto/css/zoom-dumbbell-shoulder-press.css',
  'src/slices/howto/css/zoom-ez-bar-curl.css',
  'src/slices/howto/css/zoom-forward-lunge.css',
  'src/slices/howto/css/zoom-front-squat.css',
  'src/slices/howto/css/zoom-hanging-knee-raise.css',
  'src/slices/howto/css/zoom-hip-adduction.css',
  'src/slices/howto/css/zoom-inverted-row.css',
  'src/slices/howto/css/zoom-machine-crunch.css',
  'src/slices/howto/css/zoom-machine-lateral-raise.css',
  'src/slices/howto/css/zoom-pec-fly.css',
  'src/slices/howto/css/zoom-pistol-squat.css',
  'src/slices/howto/css/zoom-plank.css',
  'src/slices/howto/css/zoom-preacher-curl.css',
  'src/slices/howto/css/zoom-resistance-band-row.css',
  'src/slices/howto/css/zoom-reverse-curl.css',
  'src/slices/howto/css/zoom-romanian-deadlift.css',
  'src/slices/howto/css/zoom-rope-triceps-pushdown.css',
  'src/slices/howto/css/zoom-single-arm-lat-pulldown.css',
  'src/slices/howto/css/zoom-single-leg-romanian-deadlift.css',
  'src/slices/howto/css/zoom-straight-arm-pulldown.css',
  'src/slices/howto/css/zoom-triceps-pushdown.css',
  'src/slices/howto/css/zoom-upright-row.css',
  'src/slices/howto/css/zoom-walking-lunge.css',
  'src/slices/howto/css/zoom-wall-sit.css',
];
/** LIB-SHIP W10: coverage.ts's 5 W10 rows as the W9 head has them (status pending, the row's archetype, stage approved-plate). */
export const W10_COVERAGE_MAIN: Record<string, string> = {
  lib_underhand_lat_pulldown: 'pull', lib_decline_bench_press: 'push', lib_jump_squat: 'none', lib_hip_abduction: 'balance', lib_mountain_climbers: 'palm-flat',
};
const W10_SHORT = W10_IDS.map(i => i.slice(4)), W10_CHROME = W10_SHORT.map(i => i.replace(/_/g, '-'));
const W10_LOADER_LINE = new RegExp(`^  (?:"lib_(?:${W10_SHORT.join('|')})",|lib_(?:${W10_SHORT.join('|')}): \\(\\) => |"(?:${W10_CHROME.join('|')})": \\(\\) => )`);
/** LIB-SHIP W10: a generated file's text with W10's own change taken out (null for a file W10 adds, and for ids.ts): its header
 *  (line 1, kept as a blank line) and `hashes:` line for the header-only files; loaders.ts less its 22 W10 lines; coverage.ts
 *  with its header blanked and the 5 W10 rows as the W9 head has them. Any other file is returned unchanged. Run it before
 *  w9GenText (W10 is the later wave). */
export function w10GenText(p: string, t: string): string | null {
  if (W10_GEN_ADDED.includes(p) || p === 'src/howto/ids.ts') return null;
  if (W10_GEN_HEADERS.includes(p)) return `\n${t.slice(t.indexOf('\n') + 1).split('\n').filter(l => !/^ *hashes: \{ inputsSha256: /.test(l)).join('\n')}`;
  if (p === 'src/howto/generated/loaders.ts') return t.split('\n').filter(l => !W10_LOADER_LINE.test(l)).join('\n');
  if (p === 'src/howto/coverage.ts') {
    let o = t;
    for (const [id, a] of Object.entries(W10_COVERAGE_MAIN)) o = o.replace(`  '${id}': { status: 'approved', stage: 'shipped' },`, `  '${id}': { status: 'pending', archetype: '${a}', stage: "approved-plate" },`);
    return `\n${o.slice(o.indexOf('\n') + 1)}`;
  }
  return t;
}

/** pilot-a's W8a layers-page pin (entry 27): main's pre-copy page, which F-SHEET-COPY's page with the copy change undone
 *  equalled (scLayersProblems, proved on the W9 head 6571b0b8, whose committed page W10 replaced). */
export const PILOT_A_W8A_PAGE: Pin = { sha: '91661d0e10bf9f3fb3b38d4ce1bd1e33e69b1b3271ba0f2e2632031ea53d6af7', bytes: 2353010 };
/** pilot-a under W10 (the lib-ship scUnderW9 form): W10's entry checked whole (lessW10Entry: throws), then F-SHEET-COPY's,
 *  now the last, checked as scLayersProblems does, with its page pin against W10's superseded pin in place of the page and
 *  its superseded entry against PILOT_A_W8A_PAGE in place of the undone page. [problems of the F-SHEET-COPY entry] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function pilotAScUnderW10(file: any, page: Buffer): { problems: string[]; file: any; w8aPage: Pin } {
  const r = lessW10Entry(file, 'pilot-a', page), E = r.file.entries as any[], n = E.length - 1, e = E[n], bad: string[] = [];   // eslint-disable-line @typescript-eslint/no-explicit-any
  const out = (b: string[]) => ({ problems: b, file: { ...r.file, entries: E.slice(0, -1) }, w8aPage: PILOT_A_W8A_PAGE });
  if (e?.kind !== 'layers-page' || e.decision !== 'F-SHEET-COPY' || e.approvedBy !== 'supervisor' || e.approval !== SC_LAYERS_APPROVAL) return out([`pilot-a F-SHEET-COPY: last entry ${e?.kind} ${e?.decision}`]);
  let s = -1; for (let i = n - 1; i >= 0; i--) if (E[i].kind === 'layers-page') { s = i; break; }
  if (s < 0 || e.supersedes !== s) bad.push(`pilot-a F-SHEET-COPY: supersedes ${e.supersedes}, the last earlier layers-page entry is ${s}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(E[s]?.ids)) bad.push(`pilot-a F-SHEET-COPY: ids ${e.ids}`);
  if (e.pageSha256 !== r.pin.sha || e.bytes !== r.pin.bytes) bad.push('pilot-a F-SHEET-COPY: page pin');
  if (E[s]?.pageSha256 !== PILOT_A_W8A_PAGE.sha || E[s]?.bytes !== PILOT_A_W8A_PAGE.bytes) bad.push('pilot-a F-SHEET-COPY: the superseded entry is not main\'s pre-copy page');
  return out(bad);
}
