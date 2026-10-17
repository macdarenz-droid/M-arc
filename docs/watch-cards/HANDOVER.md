# Watch lane handover

Last update: 2026-10-17, by the watch lane session (owner asked for a handover before its usage ran out). Read with `AGENTS.md`, `docs/WATCH-ARCHITECTURE.md`, the cards in this folder and `native/wear/README.md` (every device record).

## Where things stand
- **Branch:** `ccr-061c7350-tjvpo6`, draft PR #221 (not for merge). Head `fff328ff` or later. M/ARC gate green on `cd0e0b16` (run 2116). The Play bundle job failed on `fff328ff` with Maven artifacts not found (`kotlin-stdlib:2.2.0` and about 80 more): a repository outage, not code; one re-run was requested. If it fails again, it is real: look at it.
- **Gates:** A done (Q1–Q6). B done (`WATCH-B.md`). C in progress: `WATCH-C.md` (protocol, outbox), `WATCH-C2.md` (C2 screens, Up next, watch 1.2.0), `WATCH-C3.md` (next build, not built yet).
- **On the owner's devices:** watch **1.2.0** (signed; hashes in README "C2 screens") and the debug APK from **run 2113** (`5fc2da44`; phone code unchanged since). The owner ran a practice test ("seems fine") and is doing a real workout; no crash reported so far.
- **Waiting on the owner:** the real-workout result (any crash: which screen, how far in); whether Settings > Down button offers M/ARC Watch.

## In flight when this was written
- **WATCH-C3** builders (phone and watch) were running in local worktrees of this session. Their commits are **not pushed**. If you do not see C3 commits on the branch, rebuild from the card: it lists every decision, the protocol (`st`, `nx`, `rs`), the screens, the tests (P3, L1–L5, X3, B3) and the W4 spec changes.
- After the build: integrate, then review, then red team (owner rule: "red team every output before handing it to me"), fix, a last red team of the fixes, sign, send privately, record hashes in README.

## Owner decisions (all recorded in `docs/WATCH-WEAR-ENGINE-APPLICATION.md` 11.3)
- 2026-10-16: phone sends exercise, target, set count, rest timer, theme; watch commands saved like phone sets.
- 2026-10-17: phone may also send last time's values and the exercises left with their next targets (Up next).
- Not approved without a Wear Engine Modify: heart rate saved on the phone, background answering (Gate D), undo, a phone ping that reopens the watch app. Name `nx`, `rs`, `st` and the plan message in that Modify.
- Before any release: a watch section in `docs/PRIVACY-POLICY.md` (heart rate on the watch included).

## Device facts that bite (details in README)
- Storage values must be under 128 bytes; never write an empty value (1.1.1's crash loop reset the watch). Keep the 1.1.2 storage hardening and restart guard.
- The GT 6 closes the app about 25 s after its screen goes dark; lowering the arm turns the screen off even with keep-on. No setting or API brings the app back on wrist raise.
- A `<text>` with `if` that turns true later is not drawn (1.2.0 gym run); use bound text.
- Huawei's own workout blocks other apps. Heart rate needs Body sensors allowed in watch Settings (error 602 until then).
- The GT 6 JS heap size is unknown; 1.2.0 uses more than 1.1.2 (model: about 98 KB against 77 KB at a workout's peak).
- The phone's JS can see messages seconds late after a native freeze; the hello answer's `pt` is the receipt midpoint because of this.

## Building and signing (nothing secret goes in the repo)
- Build: README "Build without DevEco Studio" (public OpenHarmony 7.0 SDK), then `native/wear/build/build-lite-bin.sh <sdk> native/wear/app/entry/src/main <out> debug` with `NODE_OPTIONS=--openssl-legacy-provider`, then `check-lite-js.cjs`.
- Sign: `native/wear/build/sign-lite-bin.sh` with the owner's debug keystore, certificate and GT 6 profile (`marc_watch_debug.p12`, its password file, `.cer`, `_gt6.p7b`). These lived only in this session's scratch folder: ask the owner for them again. Read the password from its file into a variable; never print it. Verify with `verify-signed-bin.py`.
- Signed builds carry the owner's name and the watch UDID: never commit, attach to a PR or publish; send privately.
- The JerryScript red-team harness and the lite-framework heap model also lived in scratch; rebuild them if needed (JerryScript ES5.1 with an 8 or 14 KB stack, the compiled page plus a model of ACE lite's ViewModel).

## Next after C3
Record Gate C (D1–D8 on the latest build), then plan Gate D (needs the Modify), the crown probe, dimming during rest (device check; may leave the system brightness changed), the Session and Heart pages.
