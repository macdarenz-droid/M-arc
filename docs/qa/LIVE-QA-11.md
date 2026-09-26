# Live QA round 11: b3 sheets and toasts, I6 + A3 + I7 + F13-toast + palace fix (PR #25)

Checked PR #25 at 9b8ec2d (CI green; 062a113 only adds main) with three reviewers:
- code and behaviour;
- UI with real touch input (CDP touch at 320/360/390 px, Paper and Silent Black, both motion settings);
- tests.

A second agent tried to disprove every finding. 8 held up. 1 was rejected as not reproducible, and 1 marked "already on main" is kept, because this PR newly routes the coach's jumps through it.

**What passes:**
- Sheets slide in and out on every close path.
- A double Back during an exit closes the sheet below.
- Swipe thresholds (40% closes, 10% springs back, a flick closes) and rubber-banding work.
- Scrolled content scrolls instead of dragging.
- Coach-sheet detents, and the composer focus animating.
- The toast stays centred with no sideways shift, Undo is at least 44 px, and contrast is fine.
- The palace fix (BUG-1).
- No test or gate assertion was loosened.

Fix the items below. Each needs a test or gate probe that fails before and passes after, with the id in the commit message.

## High

**QA11-1 · With 2 sheets open, the coach's jumps hang and the next Back is swallowed.**
- **Cause:** `closeAllSheets()` (sheetStack.ts:58-63) does `ignorePops += pushed; history.go(-pushed)`. In real Chromium and WebView, one `history.go(-2)` fires ONE popstate, not 2 (checked in real Chromium).
- **Effect:**
  - `ignorePops` stays at 1 and the `then` callback never runs, so `goTo()` (which now awaits it, since 9b8ec2d) never navigates;
  - the user's next real Back is eaten.

  The helper is older than this PR (router.ts tab taps use it too), but this PR made the coach's jumps depend on it, so fix it here. That fixes the tab case as well.
- **Fix:** `ignorePops += 1` (and `-= 1` in the catch). The `history.go(-pushed)` call stays.
- **Gate probe:** open a sheet and a second sheet on top, then run palace `goTo('settings.reminders')`. The target is visible and scrolled into view. Then press Back once: it behaves as a single real Back (nothing swallowed).

**QA11-2 · Dragging the toast sideways also fires the up-down tracker's cancel, mid-drag.**
- **Cause:** track() (gesture.ts), in its wrong-axis abort, calls `onCancel` even though that tracker never locked. For the toast, the y-tracker's `springBack()` then fights the x-drag for about 300 ms and resumes the timer mid-gesture.
- **Fix:** in the wrong-axis branch, `reset(); return;` without calling `onCancel`, the same as the existing "a tap, nothing to end" rule. This only affects `capture: 'afterSlop'` users (the toast); sheet and coach grabs use `capture: 'down'`.
- **Test** (vitest): two trackers (x and y) on one element; an 8+ px horizontal move → the y-tracker events don't include `cancel`.

**QA11-3 · A plain tap on the toast pauses its countdown forever.**
- **Cause:** `onStart` (pause) fires on every pointerdown. track() calls neither `onEnd` nor `onCancel` for a release under the slop distance, so the timer never resumes and the toast (and its Undo) can stay on screen for good.
- **Fix:** pause and resume through their own pointerdown / pointerup / pointercancel listeners on the toast, independent of track() and guarded by `!leavingRef.current`. `resumeTimer`'s existing guard makes a double resume harmless. Remove `onStart` from both trackers.
- **Test:** pointerdown then a 1 px pointerup → not paused afterwards, and the toast dismisses on time.

## Medium

**QA11-4 · A sideways swipe inside a sheet can drag the sheet closed.**
- **Cause:** the body-drag start (primitives.tsx:142-176) only checks `dy > 0` at scrollTop 0, with no check that the move is mostly vertical. A horizontal scroller or a diagonal touch gets taken over.
- **Fix:** track `bodyStartX`, and add `dy > AXIS_RATIO * Math.abs(dx)` (import AXIS_RATIO from `@/ui/gesture`).
- **Test:** dx 30 / dy 2 → not dragging; dx 2 / dy 20 → dragging.

**QA11-5 · When a short drag springs back, the dark backdrop snaps to full at once.**
- **Cause:** primitives.tsx:110 removes `--scrim-o` immediately in the spring-back branch, even though `anim.finished.then(clearFollow)` already clears it when the panel settles.
- **Fix:** delete that line.
- **Gate probe:** after a 10% drag and release, the backdrop opacity right away is within 0.02 of its value before release, and it reaches 1 only when the panel is back at rest.

**QA11-6 · Nothing tests that the paused countdown resumes with the time that was left.**
- **Gate probe:**
  1. Show a 3000 ms toast.
  2. At 1500 ms, press and hold it.
  3. Hold past 3000 ms: the toast is still there.
  4. Release: it leaves within about the remaining 1500 ms plus the exit time, not a fresh 3000 ms.

**QA11-7 · The sheetStack rule "skip a sheet that's already closing" has no fast test.**
- **Unit test:** `registerSheet('a')`, `registerSheet('b')`, `markClosing(b)`, `closeTopSheet()` → closes 'a'.

## Low

**QA11-8 · "Back closes the coach with the same animated exit as the X button" is only claimed in a comment.**
- **Fix:** in tests/back.test.ts, `registerEscobarClose(spy)`, then `handleBack()` → assert the spy ran, not the fallback.

## Rejected
- **"The F13 swipe-no-Undo gate reads storage too early":** it doesn't reproduce. The 300 ms wait comes after the drag finishes, so the mutation is caught every time (3 of 3 runs).
