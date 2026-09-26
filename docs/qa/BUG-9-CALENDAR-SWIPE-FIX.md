# BUG-9: after a calendar swipe, the History calendar goes blank and the page slides sideways

Owner report 2026-09-27, with phone screenshots, on the item 4 APK (main ec7a981).

## What the owner sees
- History → Log: the September 2026 card shows its header, but the day grid is empty.
- The whole screen can be dragged sideways, leaving a blank right side.
- The bottom bar shows only Today, Train and History, spread wider. Body and Escobar are off the screen.

## Root cause (reproduced on ec7a981)
- `src/slices/history/History.tsx:112`: the A5 month-swipe exit animation `out` uses `fill: 'forwards'` and is never cancelled.
- The next month's enter animation has no fill. When it ends, `out`'s forwards fill applies again, so `.cal` stays at `opacity: 0` and `translateX(±width)`.
- The grid, pushed one width sideways and not clipped, makes the document wider than the screen. On the phone's WebView that widens the layout viewport, which stretches the fixed bottom bar.
- Repro on ec7a981 (390×844, isMobile, hasTouch, **full motion**), one swipe back:
  - `.cal`: opacity `0`, transform `matrix(1,0,0,1,324,0)`, one `finished/forwards` animation still attached;
  - `scrollWidth` 681 on a 390 px viewport.
- Why the gate and LIVE-QA-15 missed it:
  - the A5 gate block runs under `reducedMotion: 'reduce'`, which takes the no-animation branch;
  - it checks only the month label, never that the grid is visible or that the page width holds.

## Fix (verified; `docs/qa/fixes/BUG-9-calendar-swipe.patch`, applies on ec7a981)
1. In `afterOut`, call `out.cancel()` before `shift(dir)`.
2. The calendar card gets `class="cal-card"`, and styles.css adds `.cal-card { overflow-x: clip; }`, so the sliding grid never widens the page, even mid-drag.

With the patch, the same repro gives:
- mid-drag: `scrollWidth` 390;
- after a swipe back, a second one, then a forward one: opacity `1`, transform `none`, no animations left, `scrollWidth` 390;
- all 5 tabs visible.

The other `fill: 'forwards'` uses were checked, and each is removed or cancelled afterwards:
- the History row delete unmounts the row;
- sheets, the toast exit and EscobarSheet unmount;
- the Train rest bar is cancelled in its cleanup.

## Acceptance (the gate block `// BUG-9:`, add-only; it must fail on ec7a981 and pass with the fix)
Use a new context **without** `reducedMotion` (390×844, `isMobile`, `hasTouch`) and the legacy fixture. Tap "Later", then open History.
- A. While a held CDP touch drag moves 60% of the grid width rightwards (touchEnd not sent yet), `document.documentElement.scrollWidth <= innerWidth`.
- B. After the release, and again after a second swipe back and one forward swipe, wait 1500 ms each time. Then:
  - the month label changed as expected;
  - `.cal` has computed opacity `1` and transform `none`, and `.cal.getAnimations().length === 0`;
  - `scrollWidth <= innerWidth`;
  - every `nav.nav button` rect lies within `[0, innerWidth]`.
- C. Full-motion row swipe-delete, then Undo. The restored row's `.card` has opacity `1` and transform `none`, and `scrollWidth <= innerWidth`.
- `npm run check`, `npm run test:tz`, and the full gate with `TZ=Pacific/Auckland` all pass. No existing assertion is loosened.

## QA lesson (applies from now on)
Every gesture or WAAPI path gets at least one probe in a full-motion context. Under reduce, the animation code never runs.

## Needs a real phone
A quick swipe of the calendar both ways. Check that the grid stays, the page doesn't move sideways, and all 5 tabs show.
