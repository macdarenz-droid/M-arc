// LIB-2 test fixture: a hand-pair loader in the shape LIB-7's tools/plates/library/hands/pairs.mjs exports (design 12).
// Synthetic keys on shipped ids, so the plugin has something to write; never read by the real generator.
export const HAND_OF_ID = { lib_pull_up: 'bar-grip', lib_lat_pulldown: 'bar-grip', lib_leg_press: 'd-handle' };
const FILES = { 'bar-grip': ['tests/howto/fixtures/handpairs/bar-grip.json'], 'd-handle': ['tests/howto/fixtures/handpairs/d-handle.json'] };
export const inputsFor = key => FILES[key];
export const pairPanel = async key => `<div class="zx" id="pair-${key}" data-zoom="hand" hidden></div>`;
