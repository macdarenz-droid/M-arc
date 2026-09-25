# Live QA round 6: F13 body weight counts as load (PR #16)

Checked PR #16 at 3a8115a against main f86a8b5. Three reviewers covered numbers, untouched paths and privacy, and the UI, and a skeptic re-ran each medium finding.

- **Numbers:** with no body weight saved, every number matches main. Only the spec'd wording changes ('BW', 'assist', '+kg'). With body weight, every §1/§7 value checks out by hand, in kg and lb.
- **Must not change:** progression, records, e1RM, trends and stored data are untouched. The source guard fails when a forbidden import is added.
- **Privacy:** body weight reaches Escobar only when body sharing is on, and replay removes it.
- **Checks:** vitest (1,072) passed, and so did MARC_PERF, three time zones, tsc, the build and `npm run gate`. No test lost a line.

Fix these three, each with a test that fails before and passes after, and put the id in the commit message.

## Medium

**QA6-1 · The coach's week card hides the body-weight total.**
- **Cause:** the Generic card shows only its first 6 rows (src/escobar/ui/components/index.tsx:35). show.ts:125 adds `withBodyweightKg` 7th, so it never appears. With body sharing on, a week of pull-ups reads "volume kg 0" on the card while Stats shows 1.9t. Spec §9 warned about this limit.
- **Fix:** in show.ts:125, put the key right after `volumeKg`: `{ week, workouts, sets, volumeKg, ...(withBw ? { withBodyweightKg } : {}), records, grade }`. With sharing off, the output stays identical to main.
- **Decision:** leave the shared Generic renderer at 6 rows, since changing it would alter every coach card. So with sharing on and body weight saved, the grade row is the one left off.
- **Test:** with sharing on and a weigh-in, the first 6 number/string entries of the week_summary summary include `withBodyweightKg`.

**QA6-2 · Stats › Exercise progress: the date overlaps the set text.**
- **Cause:** at History.tsx:266 the trailing text is now longer ('BW+10 kg × 5', '20 kg assist'). The `.grow` date cell collapses to 0–12 px, so "Mon, / Sep / 21" wraps onto three lines and lies over the sets. The overlap is 8–20 px at 390 and 360 px, in kg and lb. Main doesn't overlap.
- **Fix:**
  - Give that Row `class="stat-hist-row"`.
  - In src/ui/styles.css after the `.list-row` rules (~:187), add `.list-row.stat-hist-row > .grow { flex: none; } .list-row.stat-hist-row > .hint { flex: 1 1 0; min-width: 0; text-align: right; }`.
  - This was checked by injecting the CSS: the date stays on one line (78–82 px), the sets wrap right-aligned, and there is a clean gap at 390 and 360 px in kg and lb.
- **Gate probe:** seed Pull-Up 3×5 at +10 kg and Assisted Pull-Up 20 kg × 10, then open Exercise progress at 360 px. On each row, the date's `rect.right` ≤ the set text's `rect.left`, and the date is one line tall.

## Low

**QA6-3 · The coach's compare card can point the opposite way to Stats.**
- **Cause:** `compare_periods` returns `delta` and `deltaPct` from the added-load numbers only (show.ts:206). The new `effective` values sit in objects that the card filters out.
- **Example:** 3×8 pull-ups at 0 kg compared with 3×5 at +10 kg gives delta +150, while Stats fell by 570 kg.
- **Fix:**
  - When `effA`/`effB` are present, also return `effectiveDelta: r1(effB - effA)` and `effectiveDeltaPct: effA ? r1(((effB - effA) / effA) * 100) : null`, straight after `deltaPct`.
  - Add both keys to BODY_KEYS (loop.ts:120), and add `effectiveDelta\w*` to BODY_FACT (loop.ts:123). `\beffective\b` doesn't match them.
- **Test:** effectiveDelta is −570 with sharing on, is absent with sharing off, and is removed on replay.
