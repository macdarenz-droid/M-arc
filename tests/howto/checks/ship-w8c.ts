// LIB-SHIP W8c (W8c LAYERS APPROVED, #429 6895226756; D-SHIP-W8C-STAMP): the freed holds wave. The one list every W8c guard
// reads, the layers-page entry check of each re-pinned page (the W8b review form, lesson 2), and the exact text-zoom set
// D-W8C-TEXTZOOM-LOOPS (#429 6895200917).
import { createHash } from 'node:crypto';
import { SC_LAYERS_APPROVAL, toMainLayersPage } from '../sheetcopy-pins';

/** The 3 ids W8c ships, per batch file in row order. */
export const W8C_SHIPPED: Record<string, readonly string[]> = {
  'tools/plates/library/batches/pilot-b.json': ['lib_seated_leg_curl'],
  'tools/plates/library/batches/lb01.json': ['lib_assisted_pull_up'],
  'tools/plates/library/batches/lb03.json': ['lib_dumbbell_shrug'],
};
export const W8C_IDS: string[] = Object.values(W8C_SHIPPED).flat();
/** Held at main's bytes (approved-plate): D-W8C-UNDERHAND (F-UNDERHAND-FAMILY), D-W8C-MCHOLD (F-PALMFLAT-APPTYPE), S4
 *  (bulgarian: #426 had not merged by LAYERS READY). */
export const W8C_HELD: readonly string[] = ['lib_underhand_lat_pulldown', 'lib_mountain_climbers', 'lib_bulgarian_split_squat'];
export const w8cOf = (batchFile: string): string[] => [...(W8C_SHIPPED[batchFile] ?? [])];

/** D-W8C-TEXTZOOM-LOOPS: the shipped rows with no drawn posture close-up (text-zooms.json rows), exactly. A new one needs a
 *  test edit: the pin in zoom-none.test.ts holds this set equal to the shipped rows of text-zooms.json. */
export const TEXT_ZOOM_SHIPPED: readonly string[] = ['seated_leg_curl'];

/** The approval every W8c layers-page entry carries, exactly: the LAYERS APPROVED comment @ the head it names. */
export const W8C_LAYERS_APPROVAL = 'https://github.com/macdarenz-droid/M-arc/pull/429#issuecomment-6895226756 @ 0523227e3db7e273930d4acf1a31c6b9d073fe1d';
/** Each W8c page's entry: appended last as a 'supervisor' D-SHIP-W8C-LAYERS entry (D-BODYMAP-APPEND), with its index, the
 *  entry it supersedes, the ids, its page pin, the superseded entry's pin, and the judged page (the page W8c LAYERS APPROVED
 *  named). Merge of main 46e564ce (#423 F-SHEET-COPY, train 100), D-REPIN-UNMERGED: each entry re-pinned in place over
 *  F-SHEET-COPY's layers-page entry (was: over the entry that one supersedes); `was` is F-SHEET-COPY's pin (main's), and the
 *  committed page with F-SHEET-COPY's copy change undone is the judged page byte for byte (w8cJudgedPage). */
export const W8C_LAYERS: Record<string, { at: number; supersedes: number; ids: string[]; page: { sha: string; bytes: number }; was: { sha: string; bytes: number }; judged: { sha: string; bytes: number } }> = {
  'pilot-b': {
    at: 13, supersedes: 12, ids: ['lib_seated_leg_curl', 'lib_cable_fly', 'lib_push_up'],
    page: { sha: '5a217db7a13a02f0347a128b4411845078e7e27a7b1b6fd9f103ceeef712ade4', bytes: 542657 },
    was: { sha: 'e6edd102fcc95d28f9e7d345831bb316937da4f56892d1e109659523da789373', bytes: 425783 },
    judged: { sha: 'd8230e884046d291038509dcd3a47310d6d31ae8ed3496fb54403c20557feb28', bytes: 543193 },
  },
  lb01: {
    at: 22, supersedes: 21,
    ids: ['lib_chin_up', 'lib_hanging_knee_raise', 'lib_assisted_pull_up', 'lib_inverted_row', 'lib_close_grip_pulldown', 'lib_single_arm_lat_pulldown',
      'lib_straight_arm_pulldown', 'lib_chest_supported_row', 'lib_resistance_band_row'],
    page: { sha: '60a88e7932c311bbc10795a49c4ec8176a3eb80c3def1265b38a2d3299db9d9d', bytes: 2481927 },
    was: { sha: '0c9f31b5b3fb59d14e97b07649694ee70cdc64edc500e5db9f5e8c739ca77115', bytes: 2193884 },
    judged: { sha: '2ab37576d4f646423e7ececbfea5690d078ea6b87c037844eae805e92aa0d874', bytes: 2483603 },
  },
  lb03: {
    at: 19, supersedes: 18,
    ids: ['lib_pendlay_row', 'lib_landmine_row', 'lib_dumbbell_romanian_deadlift', 'lib_t_bar_row', 'lib_barbell_shrug', 'lib_cable_shrug', 'lib_dumbbell_shrug',
      'lib_smith_machine_shrug'],
    page: { sha: '4ef44afaa773d49da9ca1343a51dff655f9b84876be082c2ae4e490809e8b498', bytes: 1463850 },
    was: { sha: '0011cf75714e6826573e0daaa6240a6dbbfb74d3d7fdae56634c71440045a31c', bytes: 1313020 },
    judged: { sha: '4ff16053553930d1fa5c483e791b10757e67bcb67a4935ff54cc8b8ba92ff927', bytes: 1465175 },
  },
};
/** W8c's own headings that were bare before F-SHEET-COPY (sheetcopy-pins SC_KEEP's form): dumbbell_shrug's top close-up. */
export const W8C_SC_KEEP: Record<string, readonly string[]> = { lb03: ['dumbbell-shrug-zoom-dshrug-top-h'] };
/** The committed W8c `page` of `batch` with F-SHEET-COPY's copy change undone (sheetcopy-pins toMainLayersPage, W8C_SC_KEEP
 *  held bare): the page W8c LAYERS APPROVED judged, when only F-SHEET-COPY's copy moved it. */
export function w8cJudgedPage(page: Buffer, batch: string): Buffer {
  let t = page.toString();
  for (const id of W8C_SC_KEEP[batch] ?? []) {
    const at = `id="${id}" tabindex="-1">`;
    if (t.split(at).length !== 2) throw new Error(`ship-w8c: ${batch}: ${id} is not on the page once`);
    t = t.replace(at, `id="${id}" tabindex="-1" data-w8c-keep>`);
  }
  return Buffer.from(toMainLayersPage(t, batch).toString().replaceAll(' tabindex="-1" data-w8c-keep>', ' tabindex="-1">'));
}
const sha = (b: Buffer) => createHash('sha256').update(b).digest('hex');
/** The W8c entry of `batch` whole: the file's last entry, at its index, decision D-SHIP-W8C-LAYERS, approver 'supervisor',
 *  the exact W8C_LAYERS_APPROVAL, superseding F-SHEET-COPY's entry, ids, the page pin (also against the committed `page`),
 *  the superseded pin, and the committed page with the copy change undone equal to the judged page. [problems] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function w8cLayersProblems(file: any, batch: string, page: Buffer): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const W = W8C_LAYERS[batch]!, E = file.entries as any[], e = E[E.length - 1], bad: string[] = [];
  if (E.length - 1 !== W.at) bad.push(`${batch} W8c: entry index ${E.length - 1}`);
  if (e?.kind !== 'layers-page' || e.decision !== 'D-SHIP-W8C-LAYERS' || e.approvedBy !== 'supervisor' || e.approval !== W8C_LAYERS_APPROVAL) return [...bad, `${batch} W8c: entry ${e?.kind} ${e?.decision} ${e?.approval}`];
  if (e.supersedes !== W.supersedes || E[W.supersedes]?.kind !== 'layers-page' || E[W.supersedes]?.decision !== 'F-SHEET-COPY') bad.push(`${batch} W8c: supersedes ${e.supersedes}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(W.ids)) bad.push(`${batch} W8c: ids ${e.ids}`);
  if (e.pageSha256 !== W.page.sha || e.bytes !== W.page.bytes) bad.push(`${batch} W8c: page pin`);
  if (sha(page) !== W.page.sha || page.length !== W.page.bytes) bad.push(`${batch} W8c: committed page`);
  const was = E[W.supersedes];
  if (was?.pageSha256 !== W.was.sha || was?.bytes !== W.was.bytes) bad.push(`${batch} W8c: superseded pin`);
  const j = w8cJudgedPage(page, batch);
  if (sha(j) !== W.judged.sha || j.length !== W.judged.bytes) bad.push(`${batch} W8c: the page with the copy change undone is not the judged page`);
  return bad;
}
/** F-SHEET-COPY's entry under W8c's (`file` less W8c's entry, so it is the last): sheetcopy-pins scLayersProblems' entry
 *  checks with its messages, its page pin against its own pin on main (W8C_LAYERS[batch].was; its page is superseded, so
 *  the W8a form: the entry keeps its pin). [problems] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function scUnderW8cProblems(file: any, batch: string): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const E = file.entries as any[], n = E.length - 1, e = E[n], bad: string[] = [], W = W8C_LAYERS[batch]!;
  if (e?.kind !== 'layers-page' || e.decision !== 'F-SHEET-COPY' || e.approvedBy !== 'supervisor' || e.approval !== SC_LAYERS_APPROVAL) return [`${batch} F-SHEET-COPY: last entry ${e?.kind} ${e?.decision}`];
  let s = -1; for (let i = n - 1; i >= 0; i--) if (E[i].kind === 'layers-page') { s = i; break; }
  if (s < 0 || e.supersedes !== s) bad.push(`${batch} F-SHEET-COPY: supersedes ${e.supersedes}, the last earlier layers-page entry is ${s}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(E[s]?.ids)) bad.push(`${batch} F-SHEET-COPY: ids ${e.ids}`);
  if (e.pageSha256 !== W.was.sha || e.bytes !== W.was.bytes) bad.push(`${batch} F-SHEET-COPY: page pin`);
  return bad;
}
/** `file` less W8c's and F-SHEET-COPY's entries (both checked first: throws on any problem), with the pin of the entry
 *  F-SHEET-COPY's supersedes (main's pre-copy page): checks measured before F-SHEET-COPY run on it unchanged (the W8a form,
 *  the superseded entry keeping its own pin). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW8cSC(file: any, batch: string, page: Buffer): { file: any; pin: { sha: string; bytes: number } } {
  const one = { ...file, entries: file.entries.slice(0, -1) };
  const bad = [...w8cLayersProblems(file, batch, page), ...scUnderW8cProblems(one, batch)];
  if (bad.length) throw new Error(bad.join('\n'));
  const sc = one.entries[one.entries.length - 1], was = one.entries[sc.supersedes];
  return { file: { ...file, entries: file.entries.slice(0, -2) }, pin: { sha: was.pageSha256, bytes: was.bytes } };
}

/** D-W8C-TEXTZOOM-LOOPS: `rows` less the TEXT_ZOOM_SHIPPED rows (those have no posture-<id>.ts chunk), and those rows. */
export const postureRows = <T extends { id: string }>(rows: readonly T[]): T[] => rows.filter(r => !TEXT_ZOOM_SHIPPED.includes(r.id.replace(/^lib_/, '')));
export const textZoomRows = <T extends { id: string }>(rows: readonly T[]): T[] => rows.filter(r => TEXT_ZOOM_SHIPPED.includes(r.id.replace(/^lib_/, '')));
/** The D-W8C-TEXTZOOM-LOOPS pin: `set` equals the shipped rows listed in text-zooms.json (`listed`, lib ids), and no set row
 *  has a posture chunk (`postureFiles`, file names) or a POSTURE loader line (`loaders`, loaders.ts text). [problems] */
export function textZoomSetProblems(set: readonly string[], shipped: readonly { id: string; chromeId: string }[], listed: readonly string[], postureFiles: readonly string[], loaders: string): string[] {
  const bad: string[] = [], want = shipped.filter(r => listed.includes(r.id)).map(r => r.id.replace(/^lib_/, '')).sort();
  for (const id of want) if (!set.includes(id)) bad.push(`${id}: a shipped text-zoom row missing from the set`);
  for (const id of set) if (!want.includes(id)) bad.push(`${id}: in the set, but not a shipped text-zoom row`);
  for (const r of shipped.filter(x => set.includes(x.id.replace(/^lib_/, '')))) {
    if (postureFiles.includes(`posture-${r.chromeId}.ts`)) bad.push(`${r.id}: has a posture chunk`);
    if (loaders.includes(`import('./posture-${r.chromeId}')`)) bad.push(`${r.id}: has a POSTURE loader line`);
  }
  return bad;
}

/** Q-W8c-4 (the Q-W8b-1 form): main 8f112a6d's pre-W8c layers config of `page`, from the committed one with W8c's own lines
 *  taken out (each must occur exactly once), and pinned to that file's sha256 on main. Throws on any other drift. */
export const PRE_W8C_SHA: Record<string, string> = {
  /** git show 8f112a6d:tools/plates/library/pages/<page>.layers.json | sha256sum */
  lb01: '4cec30c9c996b19e44793ef680da391901f7305c15e97bf90b9ea8855794e5db',
  lb03: 'c254137c0d0cfd8728e643b995b43516ad3bb79dbd82742f8bd2e384307251af',
  'pilot-b': '9ec640116fcd0f539f521f9080d5ef931319145a04116b168614811fc99ae85d',
};
const W8C_CONFIG_LINES: Record<string, [string, string][]> = {
  lb01: [['        "lib_hanging_knee_raise",\n        "lib_assisted_pull_up",\n', '        "lib_hanging_knee_raise",\n'],
    [`    "lib_assisted_pull_up": {
      "optionsKey": "assisted_pull_up",
      "pair": "bar-hang-over",
      "pairFaults": [
        "curled"
      ],
      "pairWords": {
        "curled": {
          "right": {
            "text": "Overhand, thumb wrapped, wrist not curled.",
            "source": "docs/research/howto/cards/assisted_pull_up.json zooms[key=hand].right (W3 layers fix #384 6648454032, D-SHIP-CONVCOPY: no unsourced contact point)"
          }
        }
      }
    },
`, '']],
  lb03: [['        "lib_cable_shrug",\n        "lib_dumbbell_shrug",\n', '        "lib_cable_shrug",\n']],
  'pilot-b': [['"ids": ["lib_seated_leg_curl", "lib_cable_fly", "lib_push_up"]', '"ids": ["lib_cable_fly", "lib_push_up"]'],
    ['    "lib_seated_leg_curl": { "optionsKey": "seated_leg_curl" },\n', '']],
};
export function preW8cConfig(page: string, committed: string): string {
  let t = committed;
  for (const [a, b] of W8C_CONFIG_LINES[page]!) {
    if (t.split(a).length !== 2) throw new Error(`preW8cConfig ${page}: W8c's line is not there exactly once: ${a.slice(0, 60)}`);
    t = t.replace(a, b);
  }
  const sha = createHash('sha256').update(t).digest('hex');
  if (sha !== PRE_W8C_SHA[page]) throw new Error(`preW8cConfig ${page}: ${sha} is not main 8f112a6d's config (drift)`);
  return t;
}

/** LIB-SHIP W8c: the MANIFEST keys its flip moved (the 3 batch files, the 3 layers configs and pilot-b's closeups module),
 *  each with its value on main c263d13d, and the key it added (assisted_pull_up's card, D-SHIP-A5BACK-CARDS: its lb01 row
 *  names pairWords). */
export const W8C_MOVED: Record<string, string> = {
  'tools/plates/library/batches/lb01.json': 'fdbb3d16fd996273f36c69df37f98ccc495880558edb308d4bc6d947af04db0b',
  'tools/plates/library/pages/lb01.layers.json': '4cec30c9c996b19e44793ef680da391901f7305c15e97bf90b9ea8855794e5db',
  'tools/plates/library/batches/lb03.json': 'f3685f35f54090f6f638984b24cfe3b01c09a950844de6efef885632b4c2a8a0',
  'tools/plates/library/pages/lb03.layers.json': 'c254137c0d0cfd8728e643b995b43516ad3bb79dbd82742f8bd2e384307251af',
  'tools/plates/library/batches/pilot-b.json': '03ed430a7a2af55c39dd235f58366520a6fb2c426b7d7b17e559221f5d53b910',
  'tools/plates/library/pages/pilot-b.closeups.mjs': 'c62f2ff4193a2abef90e185561505913e723960484db049d777de722c3e897cf',
  'tools/plates/library/pages/pilot-b.layers.json': '9ec640116fcd0f539f521f9080d5ef931319145a04116b168614811fc99ae85d',
};
export const W8C_ADDED: Record<string, readonly string[]> = { 'docs/research/howto/cards/assisted_pull_up.json': ['lib_assisted_pull_up'] };
/** The MANIFEST with W8c's moves put back to main c263d13d's values and its added key taken out (a copy). Each moved or
 *  added key must pin its current file, or a problem is pushed and the value is left (so the caller's compare stays red). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW8c(m: any, shaOfFile: (p: string) => string, problems: string[] = []): any {
  const c = structuredClone(m);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [id, r] of Object.entries<any>(c.rows)) {
    for (const [k, was] of Object.entries(W8C_MOVED)) if (k in r.files) {
      if (r.files[k] !== shaOfFile(k)) { problems.push(`${id}: ${k} off its file`); continue; }
      r.files[k] = was;
    }
    for (const [k, ids] of Object.entries(W8C_ADDED)) if (ids.includes(id)) {
      if (r.files[k] !== shaOfFile(k)) { problems.push(`${id}: ${k} off its file`); continue; }
      delete r.files[k];
    }
  }
  return c;
}
/** The file sha a check that runs after lessW8c should see: main c263d13d's value for a W8c-moved key (the chains below
 *  W8c, e.g. lessW8b, then check their own keys against main's pre-W8c bytes), the file's own sha otherwise. */
export const w8cFirst = (shaOfFile: (p: string) => string) => (p: string): string => W8C_MOVED[p] ?? shaOfFile(p);

/** LIB-SHIP W8c: the generated files the W8c flip adds (the 3 ids' ht-, feel-, posture- (seated has none), assisted's
 *  handpair sub-key and the 3 zoom css; 12), exactly. */
export const W8C_GEN_ADDED: readonly string[] = [
  'src/howto/generated/feel-assisted-pull-up.ts',
  'src/howto/generated/feel-dumbbell-shrug.ts',
  'src/howto/generated/feel-seated-leg-curl.ts',
  'src/howto/generated/handpair-bar-hang-only-curled-over.ts',
  'src/howto/generated/ht-assisted-pull-up.ts',
  'src/howto/generated/ht-dumbbell-shrug.ts',
  'src/howto/generated/ht-seated-leg-curl.ts',
  'src/howto/generated/posture-assisted-pull-up.ts',
  'src/howto/generated/posture-dumbbell-shrug.ts',
  'src/slices/howto/css/zoom-assisted-pull-up.css',
  'src/slices/howto/css/zoom-dumbbell-shrug.css',
  'src/slices/howto/css/zoom-seated-leg-curl.css',
];
/** LIB-SHIP W8c: the generated files whose line-1 inputsSha256 header (and, in the ht- modules, the `hashes:` line) the W8c
 *  flip moves without changing any other byte, measured against main c263d13d. */
export const W8C_GEN_HEADERS: readonly string[] = [
  'src/howto/generated/feel-barbell-shrug.ts',
  'src/howto/generated/feel-cable-fly.ts',
  'src/howto/generated/feel-cable-shrug.ts',
  'src/howto/generated/feel-chest-supported-row.ts',
  'src/howto/generated/feel-chin-up.ts',
  'src/howto/generated/feel-close-grip-pulldown.ts',
  'src/howto/generated/feel-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/feel-hanging-knee-raise.ts',
  'src/howto/generated/feel-inverted-row.ts',
  'src/howto/generated/feel-landmine-row.ts',
  'src/howto/generated/feel-pendlay-row.ts',
  'src/howto/generated/feel-push-up.ts',
  'src/howto/generated/feel-resistance-band-row.ts',
  'src/howto/generated/feel-single-arm-lat-pulldown.ts',
  'src/howto/generated/feel-smith-machine-shrug.ts',
  'src/howto/generated/feel-straight-arm-pulldown.ts',
  'src/howto/generated/feel-t-bar-row.ts',
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
  'src/howto/generated/ht-barbell-shrug.ts',
  'src/howto/generated/ht-cable-fly.ts',
  'src/howto/generated/ht-cable-shrug.ts',
  'src/howto/generated/ht-chest-supported-row.ts',
  'src/howto/generated/ht-chin-up.ts',
  'src/howto/generated/ht-close-grip-pulldown.ts',
  'src/howto/generated/ht-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/ht-hanging-knee-raise.ts',
  'src/howto/generated/ht-inverted-row.ts',
  'src/howto/generated/ht-landmine-row.ts',
  'src/howto/generated/ht-pendlay-row.ts',
  'src/howto/generated/ht-push-up.ts',
  'src/howto/generated/ht-resistance-band-row.ts',
  'src/howto/generated/ht-single-arm-lat-pulldown.ts',
  'src/howto/generated/ht-smith-machine-shrug.ts',
  'src/howto/generated/ht-straight-arm-pulldown.ts',
  'src/howto/generated/ht-t-bar-row.ts',
  'src/howto/generated/posture-barbell-shrug.ts',
  'src/howto/generated/posture-cable-fly.ts',
  'src/howto/generated/posture-cable-shrug.ts',
  'src/howto/generated/posture-chest-supported-row.ts',
  'src/howto/generated/posture-chin-up.ts',
  'src/howto/generated/posture-close-grip-pulldown.ts',
  'src/howto/generated/posture-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/posture-hanging-knee-raise.ts',
  'src/howto/generated/posture-inverted-row.ts',
  'src/howto/generated/posture-landmine-row.ts',
  'src/howto/generated/posture-pendlay-row.ts',
  'src/howto/generated/posture-push-up.ts',
  'src/howto/generated/posture-resistance-band-row.ts',
  'src/howto/generated/posture-single-arm-lat-pulldown.ts',
  'src/howto/generated/posture-smith-machine-shrug.ts',
  'src/howto/generated/posture-straight-arm-pulldown.ts',
  'src/howto/generated/posture-t-bar-row.ts',
  'src/slices/howto/css/zoom-alternating-dumbbell-curl.css',
  'src/slices/howto/css/zoom-barbell-curl.css',
  'src/slices/howto/css/zoom-barbell-shrug.css',
  'src/slices/howto/css/zoom-cable-fly.css',
  'src/slices/howto/css/zoom-cable-shrug.css',
  'src/slices/howto/css/zoom-chest-supported-row.css',
  'src/slices/howto/css/zoom-chin-up.css',
  'src/slices/howto/css/zoom-close-grip-pulldown.css',
  'src/slices/howto/css/zoom-dumbbell-biceps-curl.css',
  'src/slices/howto/css/zoom-dumbbell-romanian-deadlift.css',
  'src/slices/howto/css/zoom-ez-bar-curl.css',
  'src/slices/howto/css/zoom-hanging-knee-raise.css',
  'src/slices/howto/css/zoom-inverted-row.css',
  'src/slices/howto/css/zoom-landmine-row.css',
  'src/slices/howto/css/zoom-pendlay-row.css',
  'src/slices/howto/css/zoom-preacher-curl.css',
  'src/slices/howto/css/zoom-push-up.css',
  'src/slices/howto/css/zoom-resistance-band-row.css',
  'src/slices/howto/css/zoom-reverse-curl.css',
  'src/slices/howto/css/zoom-single-arm-lat-pulldown.css',
  'src/slices/howto/css/zoom-smith-machine-shrug.css',
  'src/slices/howto/css/zoom-straight-arm-pulldown.css',
  'src/slices/howto/css/zoom-t-bar-row.css',
];
/** LIB-SHIP W8c: coverage.ts's 3 W8c rows as main has them (status pending, the row's archetype, stage approved-plate). */
export const W8C_COVERAGE_MAIN: Record<string, string> = { lib_assisted_pull_up: 'hang', lib_dumbbell_shrug: 'hold', lib_seated_leg_curl: 'balance' };
const W8C_LOADER_LINE = new RegExp(`^  (?:"lib_(?:${W8C_IDS.map(i => i.slice(4)).join('|')})",|lib_(?:${W8C_IDS.map(i => i.slice(4)).join('|')}): \\(\\) => |"(?:${W8C_IDS.map(i => i.slice(4).replace(/_/g, '-')).join('|')})": \\(\\) => )`);
/** LIB-SHIP W8c: a generated file's text with W8c's own change taken out (null for a file W8c adds, and for ids.ts): its
 *  header (line 1, kept as a blank line) and `hashes:` line for the header-only files; loaders.ts less its 12 W8c lines;
 *  coverage.ts with its header blanked and the 3 W8c rows as main has them. Any other file is returned unchanged. */
export function w8cGenText(p: string, t: string): string | null {
  if (W8C_GEN_ADDED.includes(p) || p === 'src/howto/ids.ts') return null;
  if (W8C_GEN_HEADERS.includes(p)) return `\n${t.slice(t.indexOf('\n') + 1).split('\n').filter(l => !/^ *hashes: \{ inputsSha256: /.test(l)).join('\n')}`;
  if (p === 'src/howto/generated/loaders.ts') return t.split('\n').filter(l => !W8C_LOADER_LINE.test(l)).join('\n');
  if (p === 'src/howto/coverage.ts') {
    let o = t;
    for (const [id, a] of Object.entries(W8C_COVERAGE_MAIN)) o = o.replace(`  '${id}': { status: 'approved', stage: 'shipped' },`, `  '${id}': { status: 'pending', archetype: '${a}', stage: "approved-plate" },`);
    return `\n${o.slice(o.indexOf('\n') + 1)}`;
  }
  return t;
}
