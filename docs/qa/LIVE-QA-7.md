# Live QA round 7: O3 "Ready times" (PR #19)

Checked PR #19 at 18a6635 against main d1e63b1. One code reviewer and one UI skeptic worked from real DOM measurements at 320/360/390 px, in Paper and Silent Black, with and without reduced motion.

- **Logic:** the grouping edges are right: exactly 90%, lo = 0, midnight crossing, 23:59, a latest of exactly midnight, and DST both ways. Ring maths and colours match §6b. The minute tick updates numbers while the order stays frozen.
- **Checks:** vitest (1,109) passed, and readyTimes plus dates passed under UTC, Manila and New York. `npm run gate` passed. No horizontal scroll, rings are 40 px, tiles are 52 px, contrast is ≥ 3:1 in both themes, and no stored data changed. No test or gate assertion lost a line.

Fix these five, each with a test or gate probe that fails before and passes after, and put the id in the commit message.

## High

**QA7-1 · Tapping a tile never opens its detail strip.**
- **Cause:** styles.css:619 sets `.rt-detail-wrap { grid-template-rows: 0fr }`, but no rule sets `1fr` when it is open. Line 622 only fades the child in. The wrap stays 28 px from 50 ms to 3 s after the tap, in both motion modes. Rows 2 and 3 and the chevron are clipped, and the sliver overlaps the next group header.
- **Fix:** add `.rt-detail-wrap.open { grid-template-rows: 1fr; }` after line 619. Checked by injecting it: the wrap goes from 28 px to 90 px, and all three rows are fully in view.
- **Gate probe:** the current one only asserts `visible()`, which is why it passed. After a tap and one `--dur-base`, assert:
  - `.rt-detail-row3` and `.rt-detail-chevron` bottoms are ≤ the `.rt-detail-wrap` bottom;
  - the wrap is at least 80 px tall;
  - the next `.rt-group-head` top is ≥ the `.rt-detail` bottom.

## Medium

**QA7-2 · One long name drops the whole card to one column.**
- **Cause:** `.rt-tile-name` (styles.css:617) is nowrap with an ellipsis. So "Front shoulders" (124 px), "Rear shoulders" (119 px) and "Side shoulders" (117 px) overflow the 97 px (360) or 112 px (390) text slot, and the probe (Body.tsx:232-247) switches every group to one column. These are common muscles, so the 2-column design the owner picked rarely shows.
- **Decision (amends §6b "Tile"):** a name may wrap to 2 lines. 2 × 18 + 16 = 52 still fits the 52 px tile. Times stay nowrap. The one-column fallback now fires only for a single word or time that can't fit.
- **Fix:** styles.css:617 becomes `.rt-tile-name { font-size: 14px; line-height: 18px; font-weight: 600; color: var(--text); overflow: hidden; white-space: normal; overflow-wrap: normal; }` (drop `text-overflow` and `nowrap`). Keep `overflow: hidden` so an unbreakable word still counts as overflow. The probe must test both axes: `scrollWidth > clientWidth || scrollHeight > clientHeight + 1`, and the name box may be at most 36 px tall. Checked by injecting it: 2 columns at 360 and 390, the shoulder names wrap cleanly, tiles stay 52 px, and there is no horizontal scroll.
- **Gate probe:** seed a Front shoulders window, then at 360 px:
  - `.rt-line` has no `one-col`;
  - the tile has 2 columns;
  - the name has `scrollWidth ≤ clientWidth` and a height ≤ 36;
  - the tile is 52 px tall.

**QA7-3 · In one column, the caret points at empty space.**
- **Cause:** Body.tsx:274 passes the tile's pair index `ci`. `RtDetail` (Body.tsx:182) turns col 1 into `calc(50% + 28px)` even when every tile is full-width with its ring on the left. The caret sits 180 px from the ring centre.
- **Fix:** decide at render time, so a resize after opening is also right. Pass `oneColumn` into `RtDetail` and use `const caretLeft = full || oneColumn || col === 0 ? '28px' : 'calc(50% + 28px)';`. Checked by injecting it: the caret-to-ring gap goes from 180 px to 6 px.
- **Gate probe:** force one column (probe override or width 320 with a long time), open a tile that was second in its pair, and assert the caret centre is within 8 px of that tile's ring centre.

## Low

**QA7-4 · The scroll-keep timer and tile refs are never cleaned up.**
- **Cause:** `onTile` (Body.tsx:249-261) starts a `setTimeout(…, durFor('base') + 30)` with no cleanup, so leaving the screen within about 230 ms can scroll the next screen. The `tileRef` callback never deletes refs to removed tiles.
- **Fix:** `const scrollTimer = useRef<ReturnType<typeof setTimeout>>(); useEffect(() => () => clearTimeout(scrollTimer.current), []);`. In `onTile`, run `clearTimeout(scrollTimer.current); scrollTimer.current = setTimeout(…)`. Change the ref callback to `el => { if (el) tileRefs.current.set(m, el); else tileRefs.current.delete(m); }`.
- **Test:** a unit or gate check. Tap a tile, then switch the view within 100 ms; `window.scrollY` doesn't change after 400 ms.

**QA7-5 · The `readyWindow` guard drops the smaller bound when lo > hi.**
- **Cause:** dates.ts:156 clamps `earliest` down to `latest` without taking `min(lo, hi)`. `readyWindow(now, 50, 5)` builds the whole window from 50 h. recovery.ts always gives lo ≤ hi today, so this is defensive only.
- **Fix:** `const earliest = roundNearestHour(now + Math.min(lo, hi) * 3_600_000);`. `latest` already uses `Math.max(lo, hi)`; keep the clamp line.
- **Test:** `readyWindow(now, 50, 5)` equals `readyWindow(now, 5, 50)`.
