// BOX-CAP (owner decision 6, option 1, 2026-10-18; R-W0-1, D-BOXCAP-1): the one place a red-flag box gets a word limit
// other than its site's default. A limit is looked up by the box's shared-card key, never by its text or its count.
// It imports nothing: each site passes its own default (golden B's RED_FLAG_BOX_MAX_WORDS, or c7's LIMITS), so every
// key not listed here keeps that default (D-BOXCAP-WIRE).

/** Named limits, by shared-card key. The back-pain box keeps all six NHS emergency triggers in 50 words. */
export const NAMED_BOX_CAPS = Object.freeze({ 'back-pain-box': 50 });

/** The word limit for the box with shared-card key `key`: its named limit, else the site's `fallback` (required). */
export function boxCapOf(key, fallback) {
  if (typeof fallback !== 'number' || !Number.isFinite(fallback)) throw new Error(`boxCapOf: fallback must be a finite number, got ${fallback}`);
  return typeof key === 'string' && Object.hasOwn(NAMED_BOX_CAPS, key) ? NAMED_BOX_CAPS[key] : fallback;
}
