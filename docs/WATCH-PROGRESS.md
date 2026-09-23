# Watch progress

RUN LOCK: 2026-09-23T20:36:20.700Z

## Done this run

- Added an Android JVM test harness for the actual `WorkoutCommandStore.completeSet` Java method. Initial harness commit `bd43bf218a9af5d0ab7529608b62395663eb71d4`: M/ARC gate [35912688857](https://github.com/macdarenz-droid/M-arc/actions/runs/35912688857) and Agent guard [35912688849](https://github.com/macdarenz-droid/M-arc/actions/runs/35912688849) green.
- Fixed owner QA in commit `fd06c505933de57e6764319bf61e53831d04d308`: missing revision returns `invalid`; applied and identified rejected receipts preserve separate `actionAt` / `receivedAt` with `clockConfidence: unverified`; the set snapshot records unverified action clock confidence; identified authorized rejections are durable and replay rather than later apply; JS and Java share 10 wire/conflict fixtures for installation/session ordering, paused state, revision limit and trailing JSON; an applied internal receipt explicitly marks `sideEffectsStatus: not_implemented`. Invalid or unbound packets cannot claim/occupy a session receipt.
- Green M/ARC gate [35914017824](https://github.com/macdarenz-droid/M-arc/actions/runs/35914017824) (source and Android jobs) and Agent guard [35914017418](https://github.com/macdarenz-droid/M-arc/actions/runs/35914017418). CI source log: 684 regular tests per run, 2 performance tests, 10 probe tests, 9 command tests, 4 SQLite schema tests, watch lab browser gate. Android gate ran the 7 Java test methods and built/signed the debug APK. Local `npm run check`, node/SQLite tests and agent guard pass; local browser gate still lacks Chromium, and CI passed it.

## Next task

- Gate B/C boundary: design and test the explicit single-writer handover from `state.active` to native ownership and include fidelity, rest and heart pending effects in the same native transaction before any transport connects. The current class is unconnected and its internal `applied` receipt must not be shown as watch `Saved`. Clock synchronization and confidence beyond `unverified` are still UNVERIFIED.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
