// LIB-SHIP W8c (W8c LAYERS APPROVED, #429 6895226756; D-SHIP-W8C-STAMP): the freed holds wave. The one list every W8c guard
// reads, the layers-page entry check of each re-pinned page (the W8b review form, lesson 2), and the exact text-zoom set
// D-W8C-TEXTZOOM-LOOPS (#429 6895200917).
import { createHash } from 'node:crypto';

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
 *  entry it supersedes, the ids, its page pin and the superseded entry's pin. */
export const W8C_LAYERS: Record<string, { at: number; supersedes: number; ids: string[]; page: { sha: string; bytes: number }; was: { sha: string; bytes: number } }> = {
  'pilot-b': {
    at: 12, supersedes: 9, ids: ['lib_seated_leg_curl', 'lib_cable_fly', 'lib_push_up'],
    page: { sha: 'd8230e884046d291038509dcd3a47310d6d31ae8ed3496fb54403c20557feb28', bytes: 543193 },
    was: { sha: '4e9685bc66d715c6ced72b794a868996436580016dd8fef18f658d707b62972e', bytes: 426161 },
  },
  lb01: {
    at: 21, supersedes: 16,
    ids: ['lib_chin_up', 'lib_hanging_knee_raise', 'lib_assisted_pull_up', 'lib_inverted_row', 'lib_close_grip_pulldown', 'lib_single_arm_lat_pulldown',
      'lib_straight_arm_pulldown', 'lib_chest_supported_row', 'lib_resistance_band_row'],
    page: { sha: '2ab37576d4f646423e7ececbfea5690d078ea6b87c037844eae805e92aa0d874', bytes: 2483603 },
    was: { sha: 'a1c714a30ab211d4ae05c2f5f49e7bcd48fe3275e55733ae930753c43c7a1678', bytes: 2195374 },
  },
  lb03: {
    at: 18, supersedes: 17,
    ids: ['lib_pendlay_row', 'lib_landmine_row', 'lib_dumbbell_romanian_deadlift', 'lib_t_bar_row', 'lib_barbell_shrug', 'lib_cable_shrug', 'lib_dumbbell_shrug',
      'lib_smith_machine_shrug'],
    page: { sha: '4ff16053553930d1fa5c483e791b10757e67bcb67a4935ff54cc8b8ba92ff927', bytes: 1465175 },
    was: { sha: '8556b3b6854194e72f20f6f22876a68a75377e74ae77f8a9071c7bcc40be0b16', bytes: 1314188 },
  },
};
/** The W8c entry of `batch` whole: the file's last entry, at its index, decision D-SHIP-W8C-LAYERS, approver 'supervisor',
 *  the exact W8C_LAYERS_APPROVAL, supersedes, ids, the page pin (also against the committed `page`) and the superseded pin.
 *  [problems] */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function w8cLayersProblems(file: any, batch: string, page: Buffer): string[] {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const W = W8C_LAYERS[batch]!, E = file.entries as any[], e = E[E.length - 1], bad: string[] = [];
  if (E.length - 1 !== W.at) bad.push(`${batch} W8c: entry index ${E.length - 1}`);
  if (e?.kind !== 'layers-page' || e.decision !== 'D-SHIP-W8C-LAYERS' || e.approvedBy !== 'supervisor' || e.approval !== W8C_LAYERS_APPROVAL) return [...bad, `${batch} W8c: entry ${e?.kind} ${e?.decision} ${e?.approval}`];
  if (e.supersedes !== W.supersedes || E[W.supersedes]?.kind !== 'layers-page') bad.push(`${batch} W8c: supersedes ${e.supersedes}`);
  if (JSON.stringify(e.ids) !== JSON.stringify(W.ids)) bad.push(`${batch} W8c: ids ${e.ids}`);
  if (e.pageSha256 !== W.page.sha || e.bytes !== W.page.bytes) bad.push(`${batch} W8c: page pin`);
  if (createHash('sha256').update(page).digest('hex') !== W.page.sha || page.length !== W.page.bytes) bad.push(`${batch} W8c: committed page`);
  const was = E[W.supersedes];
  if (was?.pageSha256 !== W.was.sha || was?.bytes !== W.was.bytes) bad.push(`${batch} W8c: superseded pin`);
  return bad;
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
