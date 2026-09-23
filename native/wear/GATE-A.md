# M/ARC GT6 Gate A — diagnostic implementation and device procedure

Status: **software probe prepared; all six real-GT6 results pending**. This is not the C2 workout companion and does not approve Gate B.

Base: `claude/escobar-v2-implementation-eidx64` at `138edd6e4dca889dfed8ed9d178ccd9787e45ebf`. Design/integration requirements were read from `claude/marc-regression-architecture-gegkbq`, including WATCH-INTEGRATION-NOTES, WATCH-ARCHITECTURE and REMEDIATION-PLAN §1.1a/R0.0/R2.8. No source from the other unmerged branches is used.

## What this change adds

- Hidden Settings → tap **Version** seven times → **Watch lab**. Flag: `marc.dev.watchlab=1`; remove that key to hide the entry. The SDK is not contacted until a lab action asks for it.
- Phone plugin requests DEVICE_MANAGER only, discovers paired devices, registers a P2P receiver, pings, sends bounded diagnostic requests, and records actual watch replies and sensor callbacks separately.
- A tiny watch diagnostic page in M/ARC's C2 palette: sensor bpm, status, local Start/Stop HR and swipe counter. Local Start tests watch sensing before Wear Engine approval; phone messaging still needs its separate authorization. Source overlay for an official **Lite Wearable JS** DevEco template; not an independently validated HAP.
- Additive patches after `cap sync` in both Android workflows; Capacitor registration, SDK dependency and manifest metadata. APK DEX check catches absent native plugin classes.
- Explicit failure handling, finite request deadlines, 10-minute phone run, 5-minute watch sensor limit, bounded diagnostic file. No production session IDs, workout mutations, new workout heart store or Health Connect calls.

## Identity and signing

Phone package: `com.mrcdrnzz.dailytracker`; App ID: `119100049`.

Phone SHA-256: `05:66:9A:D2:72:1C:6A:BA:F9:FD:D4:B9:B8:4E:2F:B7:94:48:44:B1:DE:F3:59:84:5F:01:5F:2B:67:CA:F1:F5`.

The watch source contains this **public** phone identity. The phone lab asks for the **watch app's** bundle name and certificate fingerprint. Those are different directions; pasting the phone fingerprint into the watch-fingerprint field is incorrect. Use the format Huawei's watch signing/debugging tools report; the lab does not rewrite it.

No existing signing step or secret name is changed. Do not install a locally default-debug-signed APK over M/ARC. Use the build-apk workflow's permanently signed artifact after review. The release workflow still has the older signing secret scheme in the base commit: its safe use depends on remediation R0.8; this change deliberately does not repair or dispatch it.

Do not commit keystores, signing profiles, app secrets, `agconnect-services.json`, private test reports or device identifiers. A previously shared Huawei secret should be replaced in Huawei's console separately; it is not needed by this client probe. Never rotate the permanent Android signing key.

## One-time phone setup

1. Confirm Huawei has granted the requested Wear Engine service and registered the permanent phone fingerprint above. Developer membership alone does not grant every API. Keep the app under development; public store publication is not asserted as a prerequisite by this probe.
2. Build the feature branch through the existing reviewed pipeline, preserving its permanent signer verification. Gate A must remain in M/ARC; never make a separate APK with the same phone package.
3. Install the signed M/ARC update. Open Settings, tap Version seven times, then Watch lab. Enter the Huawei account region for the test.
4. Turn **HR broadcast OFF** on the GT6. Note Huawei Health version, watch firmware, model and phone battery/background restrictions. Keep the normal Huawei Health pairing.
5. Begin a run; authorize Wear Engine; discover and select the actual GT6. Denial is a useful result: export the error report instead of granting unrelated permissions.

## Watch build prerequisite — owner/developer machine

This workspace has neither the Huawei DevEco toolchain nor the owner's watch signing profile or GT6. The overlay has not been compiled, signed or installed on a physical watch here. Complete this before claiming question 1 passes.

1. In the current Huawei-supported DevEco toolchain, create a **new Lite Wearable JS** template compatible with the actual GT6 firmware. Proposed probe bundle: `com.mrcdrnzz.watchlab`. If that target is unavailable or cannot be installed on this regional model, record the exact error: this is a Gate A blocker, not a reason to silently substitute a full HarmonyOS/ArkTS project.
2. Download Huawei's official Wear Engine JS SDK and its SHA-256 checksum from the [JS SDK integration page](https://developer.huawei.com/consumer/en/doc/connectivity-guides/integrating-fitnesstwatch-sdk-0000001052859174). Do not use an arbitrary repository's copy. Keep the DevEco project and all signing material outside this public repo.
3. Copy the probe into that new template, replacing its generated sample index page:

   ```sh
   python3 native/wear/prepare_watch.py --ability-dir /path/to/new-probe/entry/src/main/js/MainAbility --sdk /path/to/official/wearengine.js --sdk-sha256 CHECKSUM_FROM_HUAWEI --replace-template-page
   ```

   Use `default` instead of `MainAbility` if that is the directory generated by the chosen SDK. The script verifies the supplied checksum and does not alter signing settings.
4. In the template's `config.json`, retain the generated compatible Lite Wearable device/SDK/ability settings. Make `pages/index` the first JS page and add `ohos.permission.READ_HEALTH_DATA` to `module.reqPermissions` with the required user-facing reason for that SDK. The probe uses `@system.sensor`, `@system.storage` and `@system.vibrator`; build/API failures are evidence of incompatibility, not permission approval.
5. Configure the **watch app** signing profile and supported device installation route in Huawei's official tooling. Use existing credentials where applicable. Record DevEco/SDK versions, official JS SDK checksum, HAP hash, watch bundle and watch certificate fingerprint in the test notes. The watch build/installation path must be confirmed for this account and regional GT6; no APK installation on the watch is implied.
6. Build/sign/install that HAP with the official tool. Open it on the GT6. Photograph its “M/ARC · WATCH LAB” screen. You may tap **Start HR** on the watch for a local sensor check while Wear Engine approval is pending; that proves only watch-local sensing. In the phone lab enter this watch bundle/fingerprint and tap Register watch receiver after approval.

The Huawei guide describes `ping` as the Lite Wearable launch mechanism; that is a **test hypothesis for this GT6**, not a guarantee of silent launch or continuous background sensing. Legacy support-list metadata is described for HarmonyOS versions below 2.0 only; do not add obsolete metadata blindly to a current template.

## Six device questions and required evidence

Start with a fresh run, record observations before changing conditions, and export after each scenario. Use multiple short runs; do not exceed the watch's five-minute HR window when judging a condition. Keep the watch on your wrist.

| Gate question | Test on the actual GT6 | Evidence needed | Result |
|---|---|---|---|
| 1. Can our signed watch app install/run? | Build and install the probe; open it, close it and open it again. | Toolchain/SDK, HAP hash, install log and watch screen photo, exact GT6/firmware/region. | PENDING |
| 2. Is phone↔watch application messaging real? | Tap echo five times, allowing a reply each time. | Five matching `send_requested`/`watch_reply` IDs and measured round trips. SDK send success alone fails this criterion. | PENDING |
| 3. Can HR arrive without broadcast? | Record “broadcast OFF”, tap hr start and observe for 60 seconds. Then hr stop. | Actual `hr_sample` values, receipt intervals, any `watch_sensor_error`, manual comparison with watch display. No numeric latency inferred from unsynchronized clocks. | PENDING |
| 4. What survives background/screen changes? | Separate runs: both screens on; phone locked 60 s; phone on Home 60 s; watch display asleep 60 s; watch showing another app; watch native workout active. Repeat a disconnect/reconnect and phone process restart. | Native phone pause/resume, screen-interactive flags, watch heartbeats/boot/lifecycle counts, HR gaps and observations. Resume and echo to distinguish recovery from continuous delivery. | PENDING |
| 5. Can phone start/open a closed companion? | Leave/close the watch probe using normal watch navigation. Record state, tap ping, visually inspect the watch, then echo. Repeat with screen asleep and native workout active. | Raw ping code + observed watch screen + subsequent app reply/boot. Merely sending a ping is not a pass. | PENDING |
| 6. Are storage, haptics, gestures and payloads usable? | Write nonce; read; leave/reopen watch app and read again. Swipe both directions and query capabilities. Vibrate and confirm by feel. Test 256/512/1024 B requests. | Matching stored nonce after reopen, swipe counts, vibration observation, exact received bytes, successful app acknowledgements or reproducible limits. | PENDING |

For question 3, extended Health Kit real-time HR is a **separate permission/integration route**, not a fallback automatically enabled here. If direct watch sensing is unavailable, stop and evaluate its eligibility/API approval before expanding scope. RR/HRV, sleep, training index, active and total calories are not claimed available by this Gate A or by Wear Engine approval.

After HR tests use **hr stop** while connected, confirm the watch changes state, then **Stop local run** and export JSON. Local stop sends best-effort hr_stop but explicitly cannot confirm remote cessation. The watch stops after five minutes or page destruction; when its timers are suspended, it checks the deadline before delivering another sample and on resume. This does not promise that the OS releases the sensor precisely at the deadline while suspended.

## Reading the evidence

`sdk_accepted`, `send_result`, `ping_result`, `watch_reply`, `watch_heartbeat`, and `hr_sample` are distinct. Raw result codes are retained instead of guessing their meaning. `roundTripMs` uses the phone's monotonic clock. Sample timestamps use both phone wall time and elapsedRealtime; watchAt is diagnostic only. A heartbeat continuing while HR stops points at sensing/lifecycle, not necessarily transport failure.

Run `python3 native/wear/summarize_report.py exported.json` for receipt intervals, reply timings and condition markers. A gap after a process restart is **unknown**, not zero HR. Native storage restores the previous report and marks interruption without reauthorizing or reconnecting silently. The lab retains only the most recent run and at most 1,200 events; export before a new run. Discarded-event count is explicit. File writes are serialized off the Android main thread; abrupt termination can lose the latest queued write.

The report has diagnostic run/request UUIDs only. They are not workout/session/entry/set IDs. For Gate B, wait for merged R1/R2 and consume their stable IDs, by-ID mutations and core/heartStore. Nothing here establishes calorie semantics or fixes the existing workout/Health Connect/WatchBridge defects.

## Reproducible software checks

```sh
npm run typecheck
npm run build
node --test native/wear/probe.test.mjs
node native/wear/watch-lab-gate.mjs
# Use MARC_CHROMIUM=/path/to/chromium if Playwright's installed browser is unavailable.
```

The browser gate uses CapacitorCustomPlatform, local calendar dates and locator readiness waits. It checks default hiding, opt-in, isolated storage, SDK-success-vs-watch-reply display and contained plugin rejection. It is explicitly a stub, not evidence for any GT6 capability. Native source is compiled in CI against the pinned SDK; the APK check inspects both Capacitor registration and actual DEX descriptors.

Android regeneration: `npm run build`, `npx cap add android` (fresh project), `npx cap sync android`, existing native source-copy steps, `python3 native/patch_manifest.py android/app/src/main/AndroidManifest.xml`, then `python3 native/wear/prepare_android.py`. Run the latter again after any subsequent `cap sync` because Capacitor regenerates the plugin registry. No generated Android project is committed.

## Source evidence and boundaries

- [Huawei Wear Engine app identity configuration](https://developer.huawei.com/consumer/en/doc/development/connectivity-Guides/addingappid-packagename-0000001050818013): package, app ID and certificate must match registration.
- [Huawei JS P2P guide](https://developer.huawei.com/consumer/en/doc/connectivity-guides/send-message-0000001052460491): peer identity, application messaging, callback semantics, 1 KB payload guidance and Lite Wearable ping launch path.
- [Huawei published Android SDK artifact](https://developer.huawei.com/repo/com/huawei/hms/wearengine/5.0.3.300/wearengine-5.0.3.300.aar) and [POM](https://developer.huawei.com/repo/com/huawei/hms/wearengine/5.0.3.300/wearengine-5.0.3.300.pom): pinned reproducible SDK; method signatures inspected directly. This pin is not a claim that 5.0.3.300 is the latest or verified with GT6 firmware.
- [Huawei Lite Wearable sensor reference](https://developer.huawei.com/consumer/cn/doc/harmonyos-references-V3/lite-wearable-system-sensor-0000001222566847-V3): verify API and permission support in the actual installed SDK. Interface presence cannot establish GT6 sensor authorization.
- [Huawei extended Health Kit real-time HR](https://developer.huawei.com/consumer/en/doc/development/HMSCore-Guides/extended-obtaining-real-time-heart-data-0000001050163997): separate scope and prerequisites; intentionally not implemented here.

Do not mark Gate A passed or advance to Gate B until real-device reports answer the six questions, and R1/R2 have merged. Do not directly push/merge into the install branch or manually dispatch release builds as part of this change.
