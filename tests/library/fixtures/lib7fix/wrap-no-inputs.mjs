// LIB-7-FIX F1 mutation (test only): wrap-pairs.mjs with inputsFor returning [] (gen/handpairs.mjs:49 must refuse it).
export { pairPanel, HAND_OF_ID } from './wrap-pairs.mjs';
export const inputsFor = () => [];
