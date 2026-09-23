# Watch progress

RUN LOCK: none

## Done this run

- Replaced the caller supplied native snapshot/receipt API with `completeSet(raw)`, which checks the bound installation, R2.8 session/entry/set IDs, per-set revision, draft values and action time before mutating the selected set and writing its receipt in one SQLite transaction. Session revision and set revision change in the same transaction. Old command IDs replay the recorded result; changed fingerprints conflict. Commit `a6330273805ce9f1a44031d0b170771eb668d671`.
- Added a version 1 to 2 migration for set revisions, a crash-before-commit rollback test, a receipt-after-reopen test and a session test that verifies stable ID targeting after reorder. Green M/ARC gate [35910010862](https://github.com/macdarenz-droid/M-arc/actions/runs/35910010862) (source and Android jobs); Agent guard [35910010885](https://github.com/macdarenz-droid/M-arc/actions/runs/35910010885). CI source log: 684 regular tests per run, 2 performance tests, 10 probe tests, 7 command tests, 4 SQLite schema tests and watch lab browser gate passed.
- Local `npm run check`, probe/command/SQLite tests and agent guard passed. Local browser gate cannot start without Playwright Chromium; CI installed Chromium and passed it. Java mutation behavior itself has only compiled, not run under an Android test harness: UNVERIFIED.

## Next task

- Add an Android runtime test for `WorkoutCommandStore.completeSet`: valid targeted set, duplicate replay after DB reopen, changed fingerprint, wrong installation, reordered and substituted entries, stale set revision, invalid time and failed transaction. Then design the single-writer handover from `state.active`, including rest/fidelity/heart side effects, before connecting the watch or sending `Saved`.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
