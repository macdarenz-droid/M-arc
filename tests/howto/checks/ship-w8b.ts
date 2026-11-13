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
