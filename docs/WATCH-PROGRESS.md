# Watch progress

RUN LOCK: none

## Done this run

- Commit `1b6f3affb8c01f1d03a42325821e8e6907ac8e9a` added a version 3 pending-effects outbox: fidelity, rest and heart records commit with an applied set, revision and receipt, keyed by session/command/effect. Version 2 databases backfill applied receipts only. The Java tests check replay, rejection without effects, failed effect insert rollback and migration. Green M/ARC gate [35917341256](https://github.com/macdarenz-droid/M-arc/actions/runs/35917341256) (source and Android) and Agent guard [35917341148](https://github.com/macdarenz-droid/M-arc/actions/runs/35917341148).
- Commits `eb34a8b68de549be8ef43abefbf339dec2def495` and `a8ecad7261d4939dfd9cf46c95dc83123b050b83` fixed owner QA: rejected receipts replay as `replay_rejected`, strict JSON syntax rejects comments/NUL/single quotes/unquoted keys/hex and leading-zero numbers, stale committed sets return `target_changed`, a missing active session returns `wrong_session` before installation comparison, and the JS applied receipt shape includes entry/time/clock/effects fields. Shared Java/JS fixtures cover these cases plus committed fresh revision, incomplete draft, and paused rejection survives reopen. The first CI run [35918492627](https://github.com/macdarenz-droid/M-arc/actions/runs/35918492627) caught one stale Java assertion; the second run [35919458060](https://github.com/macdarenz-droid/M-arc/actions/runs/35919458060) passed source and Android, with 684 regular tests per source run, 2 performance, 10 probe, 9 command tests, 4 SQLite schema tests, 20 shared fixtures, and 10 Java test methods. Agent guard [35919457878](https://github.com/macdarenz-droid/M-arc/actions/runs/35919457878) passed. Local `npm run check`, probe, command, SQLite and agent guard passed; local visual gate lacks Playwright Chromium, while CI passed it.

## Next task

- Gate B/C boundary: design and test explicit single-writer handover from `state.active` to native ownership after R4 write guards are merged. Resolve fidelity/rest/heart pending effects with trustworthy clock and heart inputs in the native transaction before connecting transport; current records are pending and `sideEffectsStatus: not_implemented` remains accurate. The native class is unconnected and its internal applied receipt must not be shown as watch Saved. Clock synchronization and confidence beyond `unverified` remain UNVERIFIED.

## WAITING ON OWNER

- Wear Engine application result and granted scopes: recommended answer is to share actual Huawei console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval. Record exact model, firmware, account/device region, phone Android/Huawei Health/HMS versions and signing fingerprint. Test identified request/ack, non-broadcast HR, locked/background phone, display off and native workout coexistence. Export M/ARC backup before reinstall.

## Owner answers

- None recorded in this progress file.
