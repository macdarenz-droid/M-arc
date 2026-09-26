# Live QA round 15: b5 item 4, navigation and lists (PR #30)

Checked at 8fcc784 with two sonnet reviewers working in parallel: code and tests, and the UI with real CDP touch at 360 and 390 px, in all 5 themes and under reduced motion. One sonnet skeptic re-checked the findings.

**Result: no defects in I9, I10, I11 or A5.**
- **I9:** the tab's scroll position comes back within 0 px, and re-tapping a tab goes to the top. The unit tests fail when the fix is reverted.
- **I10:** the thumb exactly covers the selected button in 2- and 3-option controls, and its colour differs from the track in all 5 themes. The raw `.seg` in Settings still shows its selection. A theme change calls `startViewTransition`, except under reduced motion. Segmented with an undefined value presses no option and hides the thumb.
- **I11:** a long-press fires at about 400 ms. A lift scales to 1.02 (1 under reduced motion). Holding near the nav auto-scrolls the list, and the item settles into its slot.
- **A5:**
  - A −20% swipe springs back and deletes nothing.
  - A −70% swipe deletes the session, and Undo restores the same id.
  - A vertical drag scrolls the page with no sideways movement.
  - A drag that starts 20 px from the edge does nothing.
  - The calendar pages back a month, and rubber-bands past the current month.
- **Toast race fix (fc7d4b0):** it guards every deferred dismiss.
- **Nothing loosened; file ownership respected.** `check`, `test:tz` and the full gate pass.
- **Refuted:** QA15-1 ("merging would delete PR #29's files"). It came from a two-dot diff. A real merge with main keeps everything, with no conflicts.
- **Before merge (process):** the head must contain the latest main (fd07251, PR #29). b5 merges main, CI turns green again, then this merges as item 4.
