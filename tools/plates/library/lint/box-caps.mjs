// BOX-CAP (owner decision 6, option 1, 2026-10-18; R-W0-1, D-BOXCAP-1): the one place a red-flag box gets a word limit
// other than golden B's. A limit is looked up by the box's shared-card key, never by its text or its count; every key
// not listed here keeps golden B's RED_FLAG_BOX_MAX_WORDS, imported unchanged.
import { RED_FLAG_BOX_MAX_WORDS } from '../../layers/artifact/copy-lint.mjs';

/** Named limits, by shared-card key. The back-pain box keeps all six NHS emergency triggers in 50 words. */
export const NAMED_BOX_CAPS = Object.freeze({ 'back-pain-box': 50 });

/** The word limit for the box with shared-card key `key`: its named limit, else `fallback` (golden B's by default). */
export const boxCapOf = (key, fallback = RED_FLAG_BOX_MAX_WORDS) => (Object.hasOwn(NAMED_BOX_CAPS, key) ? NAMED_BOX_CAPS[key] : fallback);
