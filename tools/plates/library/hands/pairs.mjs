// LIB-4b B5 scratch pair loader (lib4-cards 11.1 items 4, 14): one key per scratch id, each panel that id's own hand
// close-up, cut from the batch's fixture layers page. Scratch tree only.
import { readFileSync } from 'node:fs';
import { divAt } from '../../gen/hands.mjs';
export const HAND_OF_ID = {"lib_barbell_row":"lib4c-scratch-a","lib_one_arm_dumbbell_row":"lib4c-scratch-b","lib_t_bar_row":"lib4c-scratch-c","lib_landmine_row":"lib4c-scratch-d","lib_smith_machine_bench_press":"lib4c-scratch-e","lib_smith_machine_incline_press":"lib4c-scratch-f"};
const CHROME_OF_KEY = {"lib4c-scratch-a":"barbell-row","lib4c-scratch-b":"one-arm-dumbbell-row","lib4c-scratch-c":"t-bar-row","lib4c-scratch-d":"landmine-row","lib4c-scratch-e":"smith-machine-bench-press","lib4c-scratch-f":"smith-machine-incline-press"};
export const inputsFor = () => ['tests/howto/golden/library/zz-lib4b.layers.html'];
export async function pairPanel(key) {
  const page = readFileSync(new URL('../../../../tests/howto/golden/library/zz-lib4b.layers.html', import.meta.url), 'utf8'), id = CHROME_OF_KEY[key];
  if (!id) throw new Error('pairs: unknown key ' + key);
  const open = '<div class="zx" id="' + id + '-zoom-hand" data-zoom="hand"', a = page.indexOf(open);
  if (a < 0) throw new Error('pairs: no hand close-up for ' + id);
  return divAt(page, a);
}
