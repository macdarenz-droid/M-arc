// LIB-SHIP W8b (Q-W8b-1, SHIP W8b PLAN RULED #417 6847824876): the committed lb02 layers config lists only the W8b flip
// set (the D-SHIP-W4-FLIPSET form). PF4's lb02 page checks (platefix4-lb2, platefix4-incline_dumbbell_press) keep building
// the page PF4 judged: main e15e1c65's 6-id config, pinned here to that file's sha256 and read through a scratch file.
import { writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('../../../', import.meta.url).pathname;
const LB02 = 'tools/plates/library/batches/lb02.json';
export const PF4_LB02_CONFIG = {
  groups: [{ id: 'lb2', title: 'LB2', ids: ['lib_barbell_bench_press', 'lib_incline_barbell_bench_press', 'lib_incline_dumbbell_press',
    'lib_close_grip_bench_press', 'lib_decline_bench_press', 'lib_dumbbell_pullover'] }],
  optionsModule: 'tools/plates/library/pages/lb02.closeups.mjs',
  closeups: Object.fromEntries(['barbell_bench_press', 'incline_barbell_bench_press', 'incline_dumbbell_press', 'close_grip_bench_press',
    'decline_bench_press', 'dumbbell_pullover'].map(k => [`lib_${k}`, { optionsKey: k }])),
  jump: null,
};
export const PF4_LB02_TEXT = `${JSON.stringify(PF4_LB02_CONFIG, null, 2)}\n`;
/** git show e15e1c65:tools/plates/library/pages/lb02.layers.json | sha256sum */
export const PF4_LB02_SHA = 'e97790915467add04c0568ba5dac964dfaebc0552be7e83fa706df9d12f4c05c';
/** The lb02 layers spec from PF4_LB02_TEXT (written into `stageDir`); every other row reads its own committed config. */
export async function pf4Lb02Spec(stageDir: string) {
  const reg = await import(/* @vite-ignore */ new URL('../../../tools/plates/library/registry.mjs', import.meta.url).href);
  const { layersSpecOf } = await import(/* @vite-ignore */ new URL('../../../tools/plates/library/layers-spec.mjs', import.meta.url).href);
  const cfgPath = join(stageDir, 'lb02.layers.pf4.json');
  writeFileSync(cfgPath, PF4_LB02_TEXT);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const all = reg.rows().map((r: any) => (r.batchFile === LB02 ? { ...r, pages: { ...r.pages, layersConfig: relative(ROOT, cfgPath) } } : r));
  return layersSpecOf(LB02, { stageDir, all });
}

/** LIB-SHIP W8b (D-SHIP-W8B-STAMP, W8b LAYERS APPROVED #417 6856507580; D-W8B-INCLINE 6856468001): the 9 ids W8b ships,
 *  per batch file in row order. The one list every W8b guard reads. Held W8b ids stay approved-plate (D-PF4 form):
 *  dumbbell_shrug, bulgarian_split_squat (D-W8B-RIGHTPOSE), conventional_deadlift, sumo_deadlift, step_up, wrist_curl,
 *  cross_body_hammer_curl, incline_dumbbell_curl. */
export const W8B_SHIPPED: Record<string, readonly string[]> = {
  'tools/plates/library/batches/lb02.json': ['lib_dumbbell_pullover'],
  'tools/plates/library/batches/lb03.json': ['lib_dumbbell_romanian_deadlift'],
  'tools/plates/library/batches/lb04.json': ['lib_wall_sit', 'lib_pistol_squat', 'lib_forward_lunge', 'lib_walking_lunge'],
  'tools/plates/library/batches/lb05.json': ['lib_bayesian_cable_curl', 'lib_dumbbell_overhead_triceps_extension', 'lib_single_arm_triceps_pushdown'],
};
export const W8B_IDS: string[] = Object.values(W8B_SHIPPED).flat();
export const W8B_HELD: readonly string[] = ['lib_conventional_deadlift', 'lib_sumo_deadlift', 'lib_dumbbell_shrug', 'lib_step_up', 'lib_bulgarian_split_squat',
  'lib_wrist_curl', 'lib_cross_body_hammer_curl', 'lib_incline_dumbbell_curl'];
export const w8bOf = (batchFile: string): string[] => [...(W8B_SHIPPED[batchFile] ?? [])];
/** The approval every W8b layers-page entry carries, exactly: the ruling that names the committed page shas. */
export const W8B_LAYERS_APPROVAL = 'https://github.com/macdarenz-droid/M-arc/pull/417#issuecomment-6856468001 @ 1f53a5551277ae8fbc111984d1b5e63b90b2b652';

/** LIB-SHIP W8b: the MANIFEST keys its flip moved (the 4 batch files, the 4 layers configs and the 2 changed sheets), each
 *  with its value on main e15e1c65. */
export const W8B_MOVED: Record<string, string> = {
  'tools/plates/library/batches/lb02.json': 'b4a28b1c7a6a9a20af343c41d75fb64c6de694341cc287f3162ab384f18ad8c5',
  'tools/plates/library/batches/lb03.json': '5007dc584a03a5956ca35c9362cbe267fa4b1e23b3fa05a96a4b734afa3ac48b',
  'tools/plates/library/batches/lb04.json': 'ff98474d262f37e4bef445afb7b53dd3223f8cbeccbbfa61debbcaaa011194f4',
  'tools/plates/library/batches/lb05.json': '6f1a7f95dc315c1cddddcd98623d9908e830d3966e34593c2d1034fea484ae12',
  'tools/plates/library/pages/lb02.layers.json': 'e97790915467add04c0568ba5dac964dfaebc0552be7e83fa706df9d12f4c05c',
  'tools/plates/library/pages/lb03.layers.json': '6d37d9e28de1799ae48f0ca04f9146e86e7c1f4c51078f1e0fe87898c8de71ef',
  'tools/plates/library/pages/lb04.layers.json': 'a1a7f0c2f4280946288832830e62df499412d497b51613127ca485073eb1acb7',
  'tools/plates/library/pages/lb05.layers.json': '05fdee3412bf59c22181515063953de597d56fd8e257e638da0c9970699a9e95',
  'tools/plates/library/howto/lib_dumbbell_pullover.howto.mjs': '00d2cf3e2c69be0b2d09f85948b0148fb2056055b5e26142c820c686ce93f0f5',
  'tools/plates/library/howto/lib_dumbbell_romanian_deadlift.howto.mjs': '85f4c11a87d7f2087b3b7bce197722910d36d907ecc3acd03781c15e1b1e4da2',
};
/** The MANIFEST with W8b's moves put back to main e15e1c65's values (a copy). Each moved key must pin its current file,
 *  or a problem is pushed and the value is left (so the caller's compare stays red). */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lessW8b(m: any, shaOfFile: (p: string) => string, problems: string[] = []): any {
  const c = structuredClone(m), cur = Object.fromEntries(Object.keys(W8B_MOVED).map(k => [k, shaOfFile(k)]));
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  for (const [id, r] of Object.entries<any>(c.rows)) for (const [k, was] of Object.entries(W8B_MOVED)) if (k in r.files) {
    if (r.files[k] !== cur[k]) { problems.push(`${id}: ${k} off its file`); continue; }
    r.files[k] = was;
  }
  return c;
}

/** LIB-SHIP W8b (merge of main 9139c29c, #424 D-PFS-HEADERS): the generated files the W8b flip adds (the 9 ids' ht-, feel-,
 *  posture- and zoom css; 36), exactly. */
export const W8B_GEN_ADDED: readonly string[] = [
  'src/howto/generated/feel-bayesian-cable-curl.ts',
  'src/howto/generated/feel-dumbbell-overhead-triceps-extension.ts',
  'src/howto/generated/feel-dumbbell-pullover.ts',
  'src/howto/generated/feel-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/feel-forward-lunge.ts',
  'src/howto/generated/feel-pistol-squat.ts',
  'src/howto/generated/feel-single-arm-triceps-pushdown.ts',
  'src/howto/generated/feel-walking-lunge.ts',
  'src/howto/generated/feel-wall-sit.ts',
  'src/howto/generated/ht-bayesian-cable-curl.ts',
  'src/howto/generated/ht-dumbbell-overhead-triceps-extension.ts',
  'src/howto/generated/ht-dumbbell-pullover.ts',
  'src/howto/generated/ht-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/ht-forward-lunge.ts',
  'src/howto/generated/ht-pistol-squat.ts',
  'src/howto/generated/ht-single-arm-triceps-pushdown.ts',
  'src/howto/generated/ht-walking-lunge.ts',
  'src/howto/generated/ht-wall-sit.ts',
  'src/howto/generated/posture-bayesian-cable-curl.ts',
  'src/howto/generated/posture-dumbbell-overhead-triceps-extension.ts',
  'src/howto/generated/posture-dumbbell-pullover.ts',
  'src/howto/generated/posture-dumbbell-romanian-deadlift.ts',
  'src/howto/generated/posture-forward-lunge.ts',
  'src/howto/generated/posture-pistol-squat.ts',
  'src/howto/generated/posture-single-arm-triceps-pushdown.ts',
  'src/howto/generated/posture-walking-lunge.ts',
  'src/howto/generated/posture-wall-sit.ts',
  'src/slices/howto/css/zoom-bayesian-cable-curl.css',
  'src/slices/howto/css/zoom-dumbbell-overhead-triceps-extension.css',
  'src/slices/howto/css/zoom-dumbbell-pullover.css',
  'src/slices/howto/css/zoom-dumbbell-romanian-deadlift.css',
  'src/slices/howto/css/zoom-forward-lunge.css',
  'src/slices/howto/css/zoom-pistol-squat.css',
  'src/slices/howto/css/zoom-single-arm-triceps-pushdown.css',
  'src/slices/howto/css/zoom-walking-lunge.css',
  'src/slices/howto/css/zoom-wall-sit.css',
];
/** LIB-SHIP W8b: the generated files whose line-1 inputsSha256 header (and, in the 16 ht- modules, the `hashes:` line) the
 *  W8b flip moves without changing any other byte (80), measured against main 9139c29c. */
export const W8B_GEN_HEADERS: readonly string[] = [
  'src/howto/generated/feel-alternating-dumbbell-curl.ts',
  'src/howto/generated/feel-barbell-curl.ts',
  'src/howto/generated/feel-barbell-shrug.ts',
  'src/howto/generated/feel-bodyweight-lunge.ts',
  'src/howto/generated/feel-bodyweight-split-squat.ts',
  'src/howto/generated/feel-bodyweight-squat.ts',
  'src/howto/generated/feel-cable-shrug.ts',
  'src/howto/generated/feel-ez-bar-curl.ts',
  'src/howto/generated/feel-front-squat.ts',
  'src/howto/generated/feel-hammer-curl.ts',
  'src/howto/generated/feel-landmine-row.ts',
  'src/howto/generated/feel-pendlay-row.ts',
  'src/howto/generated/feel-preacher-curl.ts',
  'src/howto/generated/feel-reverse-curl.ts',
  'src/howto/generated/feel-smith-machine-shrug.ts',
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
  'src/howto/generated/ht-alternating-dumbbell-curl.ts',
  'src/howto/generated/ht-barbell-curl.ts',
  'src/howto/generated/ht-barbell-shrug.ts',
  'src/howto/generated/ht-bodyweight-lunge.ts',
  'src/howto/generated/ht-bodyweight-split-squat.ts',
  'src/howto/generated/ht-bodyweight-squat.ts',
  'src/howto/generated/ht-cable-shrug.ts',
  'src/howto/generated/ht-ez-bar-curl.ts',
  'src/howto/generated/ht-front-squat.ts',
  'src/howto/generated/ht-hammer-curl.ts',
  'src/howto/generated/ht-landmine-row.ts',
  'src/howto/generated/ht-pendlay-row.ts',
  'src/howto/generated/ht-preacher-curl.ts',
  'src/howto/generated/ht-reverse-curl.ts',
  'src/howto/generated/ht-smith-machine-shrug.ts',
  'src/howto/generated/ht-t-bar-row.ts',
  'src/howto/generated/posture-alternating-dumbbell-curl.ts',
  'src/howto/generated/posture-barbell-curl.ts',
  'src/howto/generated/posture-barbell-shrug.ts',
  'src/howto/generated/posture-bodyweight-lunge.ts',
  'src/howto/generated/posture-bodyweight-split-squat.ts',
  'src/howto/generated/posture-bodyweight-squat.ts',
  'src/howto/generated/posture-cable-shrug.ts',
  'src/howto/generated/posture-ez-bar-curl.ts',
  'src/howto/generated/posture-front-squat.ts',
  'src/howto/generated/posture-hammer-curl.ts',
  'src/howto/generated/posture-landmine-row.ts',
  'src/howto/generated/posture-pendlay-row.ts',
  'src/howto/generated/posture-preacher-curl.ts',
  'src/howto/generated/posture-reverse-curl.ts',
  'src/howto/generated/posture-smith-machine-shrug.ts',
  'src/howto/generated/posture-t-bar-row.ts',
  'src/slices/howto/css/zoom-alternating-dumbbell-curl.css',
  'src/slices/howto/css/zoom-barbell-curl.css',
  'src/slices/howto/css/zoom-barbell-shrug.css',
  'src/slices/howto/css/zoom-bodyweight-lunge.css',
  'src/slices/howto/css/zoom-bodyweight-split-squat.css',
  'src/slices/howto/css/zoom-bodyweight-squat.css',
  'src/slices/howto/css/zoom-cable-shrug.css',
  'src/slices/howto/css/zoom-chin-up.css',
  'src/slices/howto/css/zoom-close-grip-pulldown.css',
  'src/slices/howto/css/zoom-dumbbell-biceps-curl.css',
  'src/slices/howto/css/zoom-ez-bar-curl.css',
  'src/slices/howto/css/zoom-front-squat.css',
  'src/slices/howto/css/zoom-hammer-curl.css',
  'src/slices/howto/css/zoom-hanging-knee-raise.css',
  'src/slices/howto/css/zoom-inverted-row.css',
  'src/slices/howto/css/zoom-landmine-row.css',
  'src/slices/howto/css/zoom-pendlay-row.css',
  'src/slices/howto/css/zoom-preacher-curl.css',
  'src/slices/howto/css/zoom-reverse-curl.css',
  'src/slices/howto/css/zoom-single-arm-lat-pulldown.css',
  'src/slices/howto/css/zoom-smith-machine-shrug.css',
  'src/slices/howto/css/zoom-t-bar-row.css',
];
/** LIB-SHIP W8b: coverage.ts's 9 W8b rows as main has them (status pending, the row's archetype, stage approved-plate). */
export const W8B_COVERAGE_MAIN: Record<string, string> = {
  lib_single_arm_triceps_pushdown: 'push', lib_dumbbell_overhead_triceps_extension: 'push', lib_dumbbell_pullover: 'hold',
  lib_bayesian_cable_curl: 'curl', lib_walking_lunge: 'hold', lib_forward_lunge: 'hold', lib_dumbbell_romanian_deadlift: 'hold',
  lib_pistol_squat: 'none', lib_wall_sit: 'none',
};
const W8B_LOADER_LINE = new RegExp(`^  (?:"lib_(?:${W8B_IDS.map(i => i.slice(4)).join('|')})",|lib_(?:${W8B_IDS.map(i => i.slice(4)).join('|')}): \\(\\) => |"(?:${W8B_IDS.map(i => i.slice(4).replace(/_/g, '-')).join('|')})": \\(\\) => )`);
/** LIB-SHIP W8b: a generated file's text with W8b's own change taken out (null for a file W8b adds, and for ids.ts, whose
 *  packed string content-gen and ids tests pin): its header (line 1, kept as a blank line) and `hashes:` line for the 80
 *  header-only files; loaders.ts less its 36 W8b lines; coverage.ts with its header blanked and the 9 W8b rows as main has them. Any other file is
 *  returned unchanged. */
export function w8bGenText(p: string, t: string): string | null {
  if (W8B_GEN_ADDED.includes(p) || p === 'src/howto/ids.ts') return null;
  if (W8B_GEN_HEADERS.includes(p)) return `\n${t.slice(t.indexOf('\n') + 1).split('\n').filter(l => !/^ *hashes: \{ inputsSha256: /.test(l)).join('\n')}`;
  if (p === 'src/howto/generated/loaders.ts') return t.split('\n').filter(l => !W8B_LOADER_LINE.test(l)).join('\n');
  if (p === 'src/howto/coverage.ts') {
    let o = t;
    for (const [id, a] of Object.entries(W8B_COVERAGE_MAIN)) o = o.replace(`  '${id}': { status: 'approved', stage: 'shipped' },`, `  '${id}': { status: 'pending', archetype: '${a}', stage: "approved-plate" },`);
    return `\n${o.slice(o.indexOf('\n') + 1)}`;   // its header moves too
  }
  return t;
}
