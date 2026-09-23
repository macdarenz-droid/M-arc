# Watch progress

RUN LOCK: none

## Done this run

- Fixed Claude's re-pair QA in commit `c54542234ebd9f81df1e1052e035cf270ce943c0`. The JS planner now checks a recorded command in its original session and installation before looking at the currently selected watch. A matching old receipt replays after s-2 is paired to watch-2; a different installation cannot claim it. Without a matching receipt, new commands still require the current binding. The shared Java/JS fixture applies c-fixture in s-1/watch-1, finishes s-1, creates s-2/watch-2, and verifies replay without mutating s-2. JS tests cover rejected replay, changed fingerprint, mismatched installation and reusing a command ID in the new session.
- Green M/ARC gate [35925851696](https://github.com/macdarenz-droid/M-arc/actions/runs/35925851696) (source and Android) and Agent guard [35925851670](https://github.com/macdarenz-droid/M-arc/actions/runs/35925851670). Local `npm run check`, 10 probe tests, 10 JS command tests over 24 shared fixtures, 4 SQLite schema tests and agent guard pass; Android gate ran 11 Java test methods. Local browser gate lacks Playwright Chromium; CI installed it and passed.

## Next task

- Gate B/C boundary: design and test explicit single-writer handover from `state.active` to native ownership after R4 write guards are merged. Capture the rest and heart inputs in a trustworthy native source, resolve fidelity/rest/heart effects and integrate them with the native transaction before connecting transport. Current rows are only pending markers with raw action time, and `sideEffectsStatus: not_implemented` remains accurate. The class is unconnected and its internal applied receipt must not be shown as watch Saved. Clock synchronization and confidence beyond `unverified` remain UNVERIFIED.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
