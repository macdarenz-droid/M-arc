# Watch lane handover

Last update: 2026-10-17, by the watch lane session (owner asked for a handover before its usage ran out). Read with `AGENTS.md`, `docs/WATCH-ARCHITECTURE.md`, the cards in this folder and `native/wear/README.md` (every device record).

## Current task (emergency pickup)
Exactly where the watch lane stopped, in order:
1. **WATCH-C3 is built and on the branch, not yet reviewed:** phone `f583f397` (`st`, `nx`, `rs`, the 0.01 rounding; tests P3) and watch 1.3.0 `aa632927` (no `<text if>`, logging ahead from `nx`, local rest, Rest done with OK and vibration, Adjust, heart rate; tests L1-L5 in `native/wear/test/c3.test.mjs`). Watch tests 105/105 and the phone's watch tests 98/98 pass on the merged branch. Compiled page 43,125 B, page sources 45,989 B (cap 46,000). Framework model: a workout needs a 100 KB heap (1.2.0: 96 KB). The watch builder changed some existing watch tests beyond the card's list (Rest done before Set in four C2 tests, the 1.3.0 version pins, the W4 handler pin, the Rest line list): accept or rule on them in review. Not signed, not sent.
2. **Then:** write the X3 contract test (the watch's `link.js` logs 3 sets offline from a real snap's `nx`, the phone applies them in order with their action times); run `npm run check`, `npm run test:tz`, `node --test 'native/wear/test/*.test.mjs'`; build the watch and run `check-lite-js`; push.
3. **Then:** a fresh-context review, then a red team (JerryScript runs, heap, offline and Adjust edge cases), fix every finding with a test that fails before, and one last red team of the fixes.
4. **Then:** sign 1.3.0 (owner's debug keystore files needed), verify, record the hashes in README, send it privately with numbered device steps (the card's F1–F6), and say a practice workout comes first.
5. **CI:** the Play bundle job on `fff328ff` failed on a Maven outage; one re-run was requested. Check it; a second failure is real.
6. **PR #221 body:** update the HANDOFF block at the end to the new head.

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
- Sign: `native/wear/build/sign-lite-bin.sh` with the owner's debug keystore, certificate and GT 6 profile (`marc_watch_debug.p12`, its password file, `.cer`, `_gt6.p7b`). They are secrets and stay out of this public repo (AGENTS.md: never commit keys). The owner keeps them and gives them to the next session once; they are the only thing to ask for. Read the password from its file into a variable; never print it. Verify with `verify-signed-bin.py`.
- Signed builds carry the owner's name and the watch UDID: never commit, attach to a PR or publish; send privately.
- The JerryScript red-team harness and the lite-framework heap model are in `native/wear/tools/redteam/` (see its README); the research and review outputs are in `native/wear/research/`; the C2 design is `docs/watch-cards/c2-watch-ux.png`; the owner's last test steps are `native/wear/tools/owner-steps-1.2.0.md`.

## Next after C3
Record Gate C (D1–D8 on the latest build), then plan Gate D (needs the Modify), the crown probe, dimming during rest (device check; may leave the system brightness changed), the Session and Heart pages.
