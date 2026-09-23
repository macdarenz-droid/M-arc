# Watch companion: what the builder must know from the M/ARC audit

This is for whoever implements [`WATCH-ARCHITECTURE.md`](WATCH-ARCHITECTURE.md) (the GT6 companion, Gates A–E).
It lists the facts from the audit ([`QA-REGRESSION-AUDIT.md`](QA-REGRESSION-AUDIT.md)) and the remediation plan ([`REMEDIATION-PLAN.md`](REMEDIATION-PLAN.md)) that change how the watch work must be done.
The architecture itself is sound. I checked its code claims against `e34076f`, and they hold: the session id is created at finish, sets are addressed by array position, `addSet` copies the previous set, and the energy helpers set gross equal to active. The points below are what it does not know.

## 1. Signing identity: blocking for Gate A (finding PL-19)

Huawei's app registration (App ID `119100049`, package `com.mrcdrnzz.dailytracker`) has fingerprint #1 = `05:A0:B1:32:DB:B1:E1:7D:ED:E7:51:78:92:0D:32:B2:7A:EE:54:DC:70:CB:FD:D1:78:3A:FE:38:F8:F1:A6:E8`.

That key is **not** in the repo and **not** in a secret. It exists only in the GitHub Actions cache `marc-debug-signing-v1` of the branch `claude/escobar-v2-implementation-eidx64`. The signing certificates inside the CI-built APKs show this:

| Build | Signing SHA-256 |
|---|---|
| escobar branch, run 35853038794 | `05:A0:…:A6:E8` (registered with Huawei) |
| any branch without its own cache (e.g. run 35861335573, same code) | `7E:BC:16:BB:…:29:04:3D:9D` (restored from `main`'s cache) |
| the keystore embedded in `build-apk.yml` (cache-miss fallback) | `1E:13:E7:B6:…:B5:11:5E:0E` (public) |

Consequences:
- A Gate A phone build from any other branch fails Wear Engine's identity check and cannot update the installed app.
- GitHub deletes caches that go unused for 7 days. If the escobar branch does not build again, the `05:A0` key is gone around **2026-09-30**.

Rules:
- **Before Gate A:** the owner rescues the key into secret `MARC_DEBUG_KEYSTORE_B64` (remediation plan R0.0). Until then, build every APK you install from the escobar branch.
- **Never rotate `05:A0`.** Never register `1E:13` or `7E:BC`. A release key, if ever used, goes into Huawei fingerprint slot 2 and never replaces #1.
- CI must fail any APK whose signing SHA-256 is not the expected one (R0.0 adds this check).
- Debug APKs have `versionCode 1` (the Capacitor template default). Release APKs have `37000000 + run`. A phone running a release build refuses debug builds, both because of the downgrade and because the signature differs.
- **Do not build Gate A's phone side as a separate APK with package `com.mrcdrnzz.dailytracker`.** It would install over M/ARC. Put the phone half of Gate A inside M/ARC as a hidden "Watch lab" screen behind a developer flag (e.g. `localStorage['marc.dev.watchlab']`). The Wear Engine identity is then M/ARC's own, and the gym data stays safe.
- Before any uninstall or reinstall, export a backup: Settings → Export backup. Uninstalling wipes all local workouts.

## 2. The Android project is generated in CI; nothing under `android/` is committed

- `android/` is gitignored. Each CI run does `npx cap add android`, patches `minSdkVersion` to 26 (targetSdk 36 comes from Capacitor 8), copies `native/*.java` and `native/watch/**` into the package, and patches the manifest with `native/patch_manifest.py`.
- **Every native addition must follow this pipeline**, in both `build-apk.yml` and `release-apk.yml`:
  - the Wear Engine SDK dependency, the Huawei Maven repository (`https://developer.huawei.com/repo/`), and any `agconnect` plugin or JSON are Gradle edits made by a CI patch step (there is no committed `build.gradle`);
  - new Java classes go under `native/`;
  - manifest entries go through `patch_manifest.py`.
- Remediation R7 moves this duplicated generation into `scripts/prepare-android.sh`. Put Wear Engine patches there once it exists.
- **Do not commit `agconnect-services.json` or the Huawei app secret**: the repo is **public**. Anything the phone genuinely needs, such as the app ID, is not a secret. Reset the app secret that was pasted into the ChatGPT chat.
- CI verifies plugins by grepping `capacitor.plugins.json`. Add the Wear Engine plugin name there, and to the dex class check that R5.6 adds.

## 3. File ownership and order with the remediation plan

The remediation plan (R0–R8) and the watch gates edit the same files. Order:

| Watch gate | Can start | Touches in M/ARC | Must wait for |
|---|---|---|---|
| **A** Feasibility | now | Only additive files: `src/native/wearEngine.ts`, `native/wear/**`, a hidden Watch-lab screen, CI patch lines | the R0.0 key rescue (or build from the escobar branch) |
| **B** Command foundation | after **R2** is merged | `session.ts`, `models.ts`, `store.ts` | R1 (store gives a real save acknowledgement) and R2 (clock module, commit-once, `addSet` copying drafts only, stable ids R2.8, parsers) |
| **C** Vertical slice | after B | + the Wear Engine transport | R5.2 (WatchBridge threading fix, FGS start guard) |
| **D** Native ownership, 4 screens | after C | + a new native service and a SQLite store | R4 (Escobar undo no longer restores `active`; apply guards) |
| **E** Health enrichment | after D | Health Connect and Health Kit sources | R5.1 (Health Connect fixes) |

**R2.8 in the remediation plan already creates the stable identities that Gate B needs**: `sessionId` at start, `entryId`, `setId`, and set `status`. Gate B adds the command receipts and revisions on top. Do not implement a second id scheme.

## 4. Known bugs in code the watch design relies on

| Area | Finding | Why it matters for the watch |
|---|---|---|
| Set commit | **UI-01** | Every blur re-commits a set: it rewrites `at`, restarts rest and flips fidelity. `addSet` copies timing and heart from the previous set. This is fixed in R2.3. The watch's "complete set" must go through the fixed path. |
| Clock | **ST-05/06, VX-02** | `nowMs` only ticks while Train is mounted, and the ticker is a boolean, not reference-counted. The rest countdown freezes on other tabs. Fixed by the R2.1 clock module. The watch's rest must derive from the rest record, which R2.1 keeps authoritative. |
| Heart capture | **UI-07, UI-08** | The same reading is pushed on every state change, so one sample looks like three "settled" ones and heart-guided rest ends early. After an app restart, sample time uses epoch seconds. Fixed in R5.2. |
| Save acknowledgement | **ST-01, ST-10** | A failed backup write reports "Could not save" although the main write succeeded. Unreadable state is silently replaced. `flushSave` returns nothing. R1.1 fixes this; the watch's "Saved" state needs it. |
| Health Connect | **PL-03, PL-04, VX-01** | Every read deadlocks for 20 s and returns empty. Once fixed, steps and calories are 48 h raw sums, and calories are 1000× too large. **Do not use Health Connect calories as "Active" until R5.1 lands.** |
| BLE fallback | **PL-08, PL-13** | Plugin methods mutate main-thread state from the plugin thread (crash risk). Each scan result re-emits every known device. Fixed in R5.2, together with the FGS start guard (Android 14+ requires `BLUETOOTH_CONNECT` before starting a `connectedDevice` FGS). |
| Rest notifications | **UI-02** | Plugin 8.3.1 opens the "Alarms & reminders" screen on every `schedule()` when exact alarms aren't granted. Fixed in R2.5. Any watch-triggered rest must use the fixed scheduler. |
| Writers that clear `active` | **ES-03, ES-05, UI-11, UI-15** | Escobar Undo restores `active`. Applying a programme and deleting a split set `active: null`. Restore brings back a stale `active`. These are fixed in R2 and R4, and they are exactly the "write-ownership audit" the architecture asks for. |
| HRmax / zones | **BR-12** | Observed HRmax takes the first plateau, not the highest. Zones on the watch would be wrong until R3.13. |
| Energy | (architecture §8) and **BR-30** | `energyFromWatch` and `energyFromHealthConnect` set gross = active, and `pickEnergy` has no caller. Decide calorie semantics before showing two totals; R7.1 otherwise deletes these helpers. |
| Units | **RG-02, BR-06** | Old lb history shows 0.1–0.3 lb off until R1.1 backfills `entered`. Assisted-exercise progress reads as decline until R3.5. Send the load meaning and the entered unit, as the architecture says. |

## 5. Privacy text must follow the data
- `PermissionsRationaleActivity` says health data never leaves the device. Escobar already sends it when sharing is on (PL-10, fixed in R5.6). Wear Engine consent screens must describe the actual flows.
- Android auto-backup stays enabled (decision D2). Mention it wherever health data handling is disclosed.

## 6. Reusable test infrastructure
- `scripts/screenshot-gate.mjs` already stubs a native plugin (`WatchBridge`) in Playwright through `CapacitorCustomPlatform`; see `docs/COACHING-DECISIONS.md` for the technique. Reuse it for a Wear Engine stub so the vertical slice has a CI test with no watch attached.
- Unit tests are vitest with `environment: node`. Use an in-memory `Storage` as in `tests/reorder.test.ts`. The remediation plan adds `tests/session.test.ts` and `tests/store.test.ts`; extend those rather than making parallel harnesses.

## 7. Theme tokens
Take the palette from `src/theme/themes.ts` at runtime, from the active theme (five themes). Silent Black is `bg #08090a`, `text #f7f8f8`, `text2 #8a8f98`, `accent #5e6ad2`. Send it in the snapshot as the architecture proposes. Do not hard-code the palette.
