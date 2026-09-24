# Watch progress

RUN LOCK: none

## Done this run

- Merged current `main` through `b047fd5` (agent rules and Relay updates) as `c6e947d`; it did not overlap watch code. Added version 4 native pending-effect context in `b573010`: each applied set transaction now records pre-commit prior timing, nearby commit count, set effort/kind and effective/receive times, flags corrupt timing, and lists missing rest policy and heart inputs. Version 2 and 3 migrations keep old effects pending with null context. The applied receipt still says `sideEffectsStatus: not_implemented`; transport remains disconnected. [M/ARC gate 35972234378](https://github.com/macdarenz-droid/M-arc/actions/runs/35972234378) passed source, Watch Lab, Android JVM transaction tests, APK native-class checks and permanent signing; [Agent guard 35972234346](https://github.com/macdarenz-droid/M-arc/actions/runs/35972234346) passed. Focused local protocol and schema checks passed.
- Merged current `main` through `26631ab` (including remediation R0–R7 and Relay) as `34970f8`; preserved shared Android preparation, watch plugin and dex checks, Watch Lab entry, current signing fingerprint, Relay checks, and both sides of the manifest/tests changes. [M/ARC gate 35969348867](https://github.com/macdarenz-droid/M-arc/actions/runs/35969348867) passed source and Android (watch protocol, browser gate, native JVM tests, signed APK); Agent guard [35969348886](https://github.com/macdarenz-droid/M-arc/actions/runs/35969348886) passed. Local `npm run check`, 10 probe tests, 10 JS protocol tests, 4 SQLite schema tests and guard passed. Chromium download in this workspace returned an invalid archive; CI browser gate passed. No transport was connected.
- Fixed Claude's re-pair QA in commit `0ef2612ef133b686ae42f8ecf3e97bca38837f7c`: JS receipts are now indexed by (session ID, command ID), matching the native SQLite primary key. The planner accepts durable archived session installation/status metadata in `binding.sessionBindings` so a new command for finished s-1/watch-1 yields `conflict`, while watch-2 addressing s-1 yields `wrong_installation` for known and unknown command IDs. A shared fixture confirms s-1/c-fixture and s-2/c-fixture can coexist and independently replay. No transport calls this pure planner yet; the archived binding must be supplied from the native session row when wired.
- Green M/ARC gate [35928933369](https://github.com/macdarenz-droid/M-arc/actions/runs/35928933369) (source and Android) and Agent guard [35928933466](https://github.com/macdarenz-droid/M-arc/actions/runs/35928933466). Local `npm run check`, 10 probe tests, 10 JS command tests covering 28 shared Java/JS fixtures, 4 SQLite schema tests and agent guard pass; Android ran 11 Java test methods. Local browser gate lacks Chromium; CI installed it and passed.

## Next task

- Implement and test explicit single-writer handover from the current WebView active session to native ownership. Freeze phone writes, preserve a recoverable pre-handover snapshot, capture the actual rest preferences and timestamped heart stream from the phone, commit the native seed and ownership marker atomically, and reconcile before allowing edits after boot. Only then resolve fidelity/rest/heart in a transaction and connect transport. Existing pending rows are partial and cannot be displayed as Saved.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
