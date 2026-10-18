// LIB-4a (D-SUP-ERRLIST): the gate's error list, every item printed. console.error('Page errors:', errors) shows only
// the first 100 items of an array, so a run at scale hid the rest. A count line, then one numbered line per error.
/** The lines to print for `errors`: none for an empty list. */
export function formatErrors(errors) {
  if (!errors.length) return [];
  return [`Page errors (${errors.length}):`, ...errors.map((e, i) => `[${i + 1}/${errors.length}] ${e}`)];
}
