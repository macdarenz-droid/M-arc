// LIB-2 (library plan 5.1, design 7): the How-to total ceiling is the 8's measured mean plus 10 %, times the shipped
// ids, rounded once (rounding per id would drift). `measured` is the 8's measured total (tests/howto/budgets.json
// totals[0].measuredGz / measuredRaw); HT-11 may only lower it.
export const totalCeiling = (measured, n) => Math.ceil((measured * 11 * n) / 80);
/** The same per-id rule for a chunk that holds one entry per shipped id (the lazy loaders-*.js chunk; library plan 5.2
 *  "set once", D-LIB2-loaders-budget): `measured` is that chunk measured on the 8 (tests/howto/budgets.json perId). */
export const perIdCeiling = totalCeiling;
