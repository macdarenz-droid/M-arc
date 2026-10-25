// LIB-7-FIX F1 (test only): LIB-7's real inputsFor and pairPanel, with one pair key on a shipped id of the 8, so
// main's gen/handpairs.mjs outputs() has a row to write (library-core L2-A21's fixture technique). Never read by the build.
export { inputsFor, pairPanel } from '../../../../tools/plates/library/hands/pairs.mjs';
export const HAND_OF_ID = { lib_pull_up: 'curl-dumbbell-under' };
