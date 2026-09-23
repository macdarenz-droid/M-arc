# Watch progress

RUN LOCK: none

## Done this run

- Fixed Claude's QA in commit `78f56d8a8fd6b6fa5351adebca722b29930cdcef`: the JS planner checks persisted receipts before rejecting an absent active session, preserving applied and rejected replay outcomes and fingerprint conflicts. Shared fixtures now distinguish no database session from a finished stored session, including matching and mismatching closed session IDs. The native set's committed `at` is clamped to the earlier of raw watch `actionAt` and phone `receivedAt`; the receipt retains the original action timestamp. Java tests cover the future-time clamp, receipt replay after finishing/reopening and fixture parity. The pending rest and heart rows are still not usable as effects: they lack autoRest, default rest duration, effort, live BPM and time-window samples; `GATE-B.md` explicitly keeps them pending until Gate C.
- Green M/ARC gate [35922941788](https://github.com/macdarenz-droid/M-arc/actions/runs/35922941788) (source and Android) and Agent guard [35922941791](https://github.com/macdarenz-droid/M-arc/actions/runs/35922941791). Local `npm run check`, 10 probe tests, 9 JS command tests over 23 shared fixtures, 4 SQLite schema tests and agent guard pass. Android gate ran 11 Java test methods, source gate ran 684 regular tests per run and 2 performance tests. Local watch lab browser gate lacks Chromium; CI installed it and passed.

## Next task

- Gate B/C boundary: design and test explicit single-writer handover from `state.active` to native ownership after R4 write guards are merged. Capture the rest and heart inputs in a trustworthy native source, resolve fidelity/rest/heart effects and integrate them with the native transaction before connecting transport. Current rows are only pending markers with raw action time, and `sideEffectsStatus: not_implemented` remains accurate. The class is unconnected and its internal applied receipt must not be shown as watch Saved. Clock synchronization and confidence beyond `unverified` remain UNVERIFIED.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
