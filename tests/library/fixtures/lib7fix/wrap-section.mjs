// LIB-7-FIX F1 mutation (test only): wrap-pairs.mjs with a pairPanel that is not a zx panel (gen/handpairs.mjs:51 must refuse it).
export { inputsFor, HAND_OF_ID } from './wrap-pairs.mjs';
export const pairPanel = async () => '<section class="zoom"></section>';
