# Watch progress

RUN LOCK: 2026-09-23T19:28:20Z

## Done this run

- Added an unconnected `WorkoutCommandStore.java` SQLite primitive on the existing R2.8 session ID. It restricts handover to one active session, ties receipts to that session, checks the selected installation and revision, and writes a caller-prepared snapshot and receipt in one transaction. No watch command calls this class and no `Saved` acknowledgement is sent. Commit `3545b6cc34d515a637326ac6c74428351c4181e1`.
- Added three SQLite schema tests for one active session, foreign keys, rollback and receipt replay constraints, plus a session test for unique R2.8 handover IDs. The generated Android debug build compiles the new class. Green M/ARC gate [35904973917](https://github.com/macdarenz-droid/M-arc/actions/runs/35904973917) (source and Android jobs); Agent guard [35904973897](https://github.com/macdarenz-droid/M-arc/actions/runs/35904973897). CI source log: 683 regular tests per run, 2 performance tests, 10 probe tests, 7 command tests, 3 SQLite schema tests, watch lab browser gate passed.
- Local `npm run check`, probe/command/SQLite tests and agent guard passed. Local watch lab browser gate could not start because the Playwright Chromium executable is absent; CI installed Chromium and passed the browser gate.

## Next task

- Gate B: validate and apply a specific `complete_set` mutation against R2.8 entry/set IDs inside the native transaction, including target revision/conflict checks and a crash-after-commit replay test. Then plan explicit single-writer handover of `state.active` before connecting transport. The current store takes a caller-prepared snapshot and is not yet a safe command receiver.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share the actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before any reinstall.

## Owner answers

- None recorded in this progress file.
