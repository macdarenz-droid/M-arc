// FG-3: the entry `npm run fg:check` bundles for node (scripts/fg-check.mjs imports it).
export { CHECKS, runChecks, report } from './index';
export { inputFor, guideOf } from './node';
