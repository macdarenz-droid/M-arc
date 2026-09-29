// FG-3: the entry `npm run fg:check` bundles for node (scripts/fg-check.mjs imports it). V1-07: the CLI runs and accepts
// the 20 §5 checks and V1-07's (ALL_CHECKS); `CHECKS` itself stays the 20.
export { ALL_CHECKS as CHECKS, runChecks, report } from './index';
export { inputFor, guideOf } from './node';
