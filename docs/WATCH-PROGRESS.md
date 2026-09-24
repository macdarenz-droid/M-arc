# Watch progress

RUN LOCK: none

## Done this run

- Added the single-writer handover foundation: version 5 native seed/owner/input transaction, durable cancellation of uncertain requests, prepared phone recovery checkpoint, Android boot reconciliation, write/reset guards and a recovery screen. Captures actual rest preferences and the available timestamped BLE buffer. No UI/transport starts a handover, no phone command adapter/release path is enabled, and pending effects still cannot be acknowledged as Saved. Local source checks passed: 899 tests in UTC, New York and Manila, 3 performance budgets, TypeScript/build, 20 probe/protocol tests, 6 SQLite schema tests, 91 Worker tests and 14 Relay tests. [M/ARC gate 36002068353](https://github.com/macdarenz-droid/M-arc/actions/runs/36002068353) passed for code commit `7f36209`: both browser/time-zone gates, Watch Lab/recovery screen checks, native JVM transactions, APK native-class checks and permanent signing. [Agent guard 36002068562](https://github.com/macdarenz-droid/M-arc/actions/runs/36002068562) passed. Hardware/GT6 behavior remains unverified. See `native/wear/GATE-B.md` for the scope and failure controls.

- Merged current `main` through `b047fd5` (agent rules and Relay updates) as `c6e947d`; it did not overlap watch code. Added version 4 native pending-effect context in `b573010`: each applied set transaction now records pre-commit prior timing, nearby commit count, set effort/kind and effective/receive times, flags corrupt timing, and lists missing rest policy and heart inputs. Version 2 and 3 migrations keep old effects pending with null context. The applied receipt still says `sideEffectsStatus: not_implemented`; transport remains disconnected. [M/ARC gate 35972234378](https://github.com/macdarenz-droid/M-arc/actions/runs/35972234378) passed source, Watch Lab, Android JVM transaction tests, APK native-class checks and permanent signing; [Agent guard 35972234346](https://github.com/macdarenz-droid/M-arc/actions/runs/35972234346) passed. Focused local protocol and schema checks passed.
- Merged current `main` through `26631ab` (including remediation R0–R7 and Relay) as `34970f8`; preserved shared Android preparation, watch plugin and dex checks, Watch Lab entry, current signing fingerprint, Relay checks, and both sides of the manifest/tests changes. [M/ARC gate 35969348867](https://github.com/macdarenz-droid/M-arc/actions/runs/35969348867) passed source and Android (watch protocol, browser gate, native JVM tests, signed APK); Agent guard [35969348886](https://github.com/macdarenz-droid/M-arc/actions/runs/35969348886) passed. Local `npm run check`, 10 probe tests, 10 JS protocol tests, 4 SQLite schema tests and guard passed. Chromium download in this workspace returned an invalid archive; CI browser gate passed. No transport was connected.
- Fixed Claude's re-pair QA in commit `0ef2612ef133b686ae42f8ecf3e97bca38837f7c`: JS receipts are now indexed by (session ID, command ID), matching the native SQLite primary key. The planner accepts durable archived session installation/status metadata in `binding.sessionBindings` so a new command for finished s-1/watch-1 yields `conflict`, while watch-2 addressing s-1 yields `wrong_installation` for known and unknown command IDs. A shared fixture confirms s-1/c-fixture and s-2/c-fixture can coexist and independently replay. No transport calls this pure planner yet; the archived binding must be supplied from the native session row when wired.
- Green M/ARC gate [35928933369](https://github.com/macdarenz-droid/M-arc/actions/runs/35928933369) (source and Android) and Agent guard [35928933466](https://github.com/macdarenz-droid/M-arc/actions/runs/35928933466). Local `npm run check`, 10 probe tests, 10 JS command tests covering 28 shared Java/JS fixtures, 4 SQLite schema tests and agent guard pass; Android ran 11 Java test methods. Local browser gate lacks Chromium; CI installed it and passed.

## Next task

- Add continuous native heart capture with source/boot identity, phone command routing and completion/release reconciliation. Then consume the retained rest/heart inputs and resolve fidelity/rest/heart in the native transaction before connecting transport. The handover function remains unused by screens and transport until those paths are ready. Existing pending rows are partial and cannot be displayed as Saved.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
