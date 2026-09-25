# Live QA round 4: share cards (PR #12 @ c6ebaf4) and watch commits (06369f0..64765b5)

Each finding was checked by a reviewer and then a skeptic that tried to refute it. Mediums were reproduced. Fix each one with a test that fails before and passes after, and put the id in the commit message.

## Share cards (PR #12)

What works: the numbers match Stats, kg/lb are followed, and the preview matches the exported PNG. Back/Escape close the sheet, and the share code loads as its own offline-cached chunk. Gate passes (palace 74/74).

### Medium

- **QA4-1 · Assisted exercises count the machine's help as weight lifted** (src/brain/weekly.ts:15 `workingTotals`; used at cardData.ts:110, 142, 162).
  - Symptom: Assisted Pull-Up 3×10 @40 adds 1,200 kg. More help gives a bigger "lifted" number and comparison.
  - Fix: `workingTotals(exercises, custom = [])` still counts the set but adds no volume when `modeOf(e.exerciseId, custom) === 'assisted'`. Pass `custom` from weekSummary, weeklyVolumeHistory and both cardData paths, so Stats and the card stay equal.
  - In workoutLines, for assisted exercises: top = the lowest-kg set, label `@40 assist`, and the line value = sets, not kg.
  - Tests: an assisted case in share-cards and one in weekly.
- **QA4-2 · Carries, sleds and loaded holds print `3×0 @32 … BW`** (cardData.ts:95-110).
  - Fix: when topReps is 0, build the detail from distance, then time, then reps (`3×40 m @32`, `3×60s @20`).
  - `lineValue` returns 'BW' only when no working set has kg > 0; otherwise '—'. Apply the same rule in periodLines.
  - Tests: a Farmer's Carry logged as kg + m with no reps, and a Sled Push logged with metres only.
- **QA4-3 · Save does nothing useful on Android 8–10**: storage permissions are not declared (src/native/share.ts:53-61, native/patch_manifest.py).
  - Fix: add `WRITE_EXTERNAL_STORAGE` and `READ_EXTERNAL_STORAGE`, both with `maxSdkVersion="29"`, and `android:requestLegacyExternalStorage="true"` on `<application>`, all in patch_manifest.py.
  - Test the patched manifest if a harness exists.
  - Don't edit the workflow signing steps.
- **QA4-4 · A second Save on the same day silently overwrites the first** (ShareSheet.tsx:108 file name; share.ts:57 writes in overwrite mode).
  - Example: two sessions on one day, or the same card saved again with a new photo.
  - Fix: make the saved name unique. Add HHMMSS, plus the session id for workout cards. The Share cache name can stay as it is.
- **QA4-5 · Photo/Save/Share buttons are off-screen when the sheet opens at 360 px width** (styles.css:418-434; the sheet is 790 px tall inside a 588 px panel).
  - Fix: `.share-actions { position: sticky; bottom: 0; z-index: 1; background: var(--surface-1); margin: 0 -16px; padding: 12px 16px 8px; }`
  - Check at 360×640 and 390×844, with safe-area insets 0, 24 and 48 px.

### Low

- **QA4-6 · Ramped sets** read as `3×5 @80` when only one set was at 80 (cardData.ts:106). Use `n×reps @load` only when every working set is identical; otherwise `3 sets, top 5@80`.
- **QA4-7 · A workout card shows PRs from another session on the same day** (cardData.ts:141). Carry `sessionId` on each record in allRecords and filter on `r.sessionId === s.id`.
- **QA4-8 · A warm-up-only session gets a shareable 0 sets / 0 kg card.**
  - Gate the Share button on working sets > 0.
  - In ShareSheet, treat `data.sets === 0` as empty.
  - Leave the Finish/History set counts as they are.
- **QA4-9 · A bodyweight-only workout headlines "0 KG LIFTED"** (cards.ts:138, 180).
  - When volume is 0, the poster and sticker show working sets ("sets done") instead.
  - The receipt drops the TOTAL LIFTED line.
- **QA4-10 · Period "Time" undercounts when legacy sessions have no duration** (cardData.ts:167). If any session in range has no duration, show `14 h 5 m+`.
- **QA4-11 · Shared PNGs, including the photo, pile up in the cache** (share.ts:36-38). Before writing, rmdir `Cache/MARC Share` recursively and ignore errors.
- **QA4-12 · PWA Share can fall back to a download**, because the PNG render uses up the tap's user activation (ShareSheet.tsx:115).
  - Pre-render the PNG into a ref in an effect on [svgs, current, format].
  - On NotAllowedError, keep the blob and say "Ready, tap Share again".
- **QA4-13 · A failed chunk load keeps failing until restart** (lazy.tsx:11). Show `showToast('Could not load sharing.', 'Reload', () => location.reload())`.
- **QA4-14 · The carousel scroll ignores Reduce motion** (ShareSheet.tsx:95). Use `behavior: 'auto'` when `prefers-reduced-motion: reduce`.
- **QA4-15 · Tap targets are under 44 px** (styles.css:426, 432).
  - `.share-dots button` 44×44 with the 6 px dot unchanged, and `.share-dots { gap: 0 }`.
  - `.share-size button { min-height: 44px }`.

## Watch commits (codex/gt6-gate-a-watch-lab)

Passed. Nobody can get stuck unable to log a set. No new permissions are needed. CI claims are true: 912 tests in 3 time zones, APK signed 05:66…F1:F5. Fix these before handover is enabled:

- **QA4-W1 · The heart journal is never deleted, survives Reset app data, and sits in Android Auto Backup** (WorkoutCommandStore.java:33, 437; store.ts resetState).
  - Delete the rows once a handover is settled or exported.
  - Add a native wipe to the Reset path.
  - Exclude marc_watch_workout_v1.db from backup.
- **QA4-W2 · Heart capture fails silently** (WorkoutHeartRecorder.java:42, 106, 123; JS ignores `heartCapture`).
  - Log the exception class only.
  - Show "Watch heart rate isn't being saved for this workout".
- **QA4-W3 · One SQLite open/commit/close per BLE packet** (WorkoutHeartRecorder.java:153-161).
  - Keep one store open.
  - Write in batches every 5–10 s.
  - Flush on ownership read and on stop.
- **QA4-W4 · Heart samples are dropped while ownership is 'checking'** (heart.ts:48, up to 12 s).
  - Keep capturing and discard only if ownership resolves to native.
  - Or record the gap in GATE-B.md.
- **QA4-W5 · CI doesn't prove the Java test classes ran** (build-apk.yml:140-143).
  - Parse the test-results XML.
  - Require both classes with tests > 0 and no failures, errors or skips.
