# M/ARC watch app (HUAWEI WATCH GT 6)

Owner rule (2026-10-15, extended 2026-10-16): every output gets its review, then a separate red team, before it goes to the owner. That covers builds, files, console entries and instructions. The red team tries to break the output: the wrong file, data loss, a step that cannot be followed, a claim with no evidence.

The watch lane's folder (`AGENTS.md`, file ownership). The GT 6 runs Lite Wearable JS apps (HML/CSS/JS, FA model, `deviceType: liteWearable`); see `docs/WATCH-ARCHITECTURE.md`.

## Build without DevEco Studio

`build/build-lite-bin.sh` compiles a lite-wearable module to an unsigned `.bin` and `.hap` on Linux with Node 22 and Java 17+. It repeats the steps hvigor-ohos-plugin 6.26.8 runs (read from its source): JS manifest, image copy, the SDK's ace-loader lite webpack, `restool`, the `lite_source` layout, `haptobin_tool.jar`, then `app_packing_tool.jar --mode hap`.

SDK: the public OpenHarmony 7.0 SDK, no login needed. From `https://repo.huaweicloud.com/openharmony/os/7.0-Release/ohos-sdk-windows_linux-public.tar.gz` take `ohos-sdk/linux/js-linux-x64-26.0.0.38-Beta.zip` (sha256 `1872b6cfbda0ae9a4a623d28212f570afd0895b971f6dee459a80da8486fe85d`) and `toolchains-linux-x64-26.0.0.38-Beta.zip` (sha256 `7b8bf76ce41e3815a6f6778e0a5ee93864c01c791d82b0de3f91ff0061b21236`), and unzip both into one folder.

```sh
build/build-lite-bin.sh <sdk-folder> hello/entry/src/main <out-folder> debug   # or release
python3 -I build/dump-bin.py <out-folder>/bin/entry-default-unsigned.bin       # lists the .bin's files
```

`hello/` is a one-page test app (a text and a button). On 2026-10-15 it built in both modes from this folder: debug `.bin` 136,432 B, release 134,169 B (sizes move a little with the build paths). Its page JS is about 3 KB, far below the 48 KB page limit. `config.json` uses the older API 6 shape (ability and JS entry both named `default`, `apiVersion` 6), because a GT watch rejects hvigor's newer shape with install error 40 (community GT 6 project leonsuv/hwgt6).

## Older SDK

The same script also builds with the public OpenHarmony 3.2 SDK (API 9, `ohos-sdk/linux/js-linux-x64-3.2.11.9-Release.zip` and `toolchains-linux-x64-3.2.11.9-Release.zip` from `https://repo.huaweicloud.com/openharmony/os/3.2-Release/ohos-sdk-windows_linux-public.tar.gz`), the SDK level the community iPhone tool HuaSideload uses. Its compiler ships without packages: run `npm ci --ignore-scripts` in `js/build-tools/ace-loader` (Huawei's lockfile, Huawei's npm mirror, integrity-checked) and build with `NODE_OPTIONS=--openssl-legacy-provider` on Node 17 or later. The config and the signature block come out the same as with the 7.0 SDK.

## First install attempts (2026-10-15)

- Installed three times through Gadgetbridge 0.95.1's File Installer on the GT 6 (software 6.1.0.118). Each time the upload finished and the watch reported 101 (started), then 10 %, then 103 (failed) about 2.15 s later. 103 carries no reason.
- In OpenHarmony's lite installer (`gt_bundle_installer.cpp`), 10 % is reported just before the signature and profile check and 50 % just after it, so the refusal sits in that check.
- Ruled out:
  - package format: HuaSideload's `check-watch-bin.py` rates it OK;
  - signature: `build/verify-signed-bin.py` passes it (layout, signed hash, both PKCS#7 signatures and chains to Huawei CBG Root CA G2). The app signer is our certificate, and the profile's development certificate is the same certificate;
  - profile: it parses under the rules of OpenHarmony's `app_provision.c` (debug type, bundle name, UDID list). Its signer matches the "HOS Profile Management Debug" entry in `app_verify.c`'s trust list;
  - watch developer options (turned on before the third attempt) and the watch clock.
- The Huawei account ID Gadgetbridge needs is not the AppGallery Connect developer ID. Entering the developer ID made the watch ask to delete the previous account's data and restart. Never confirm that prompt unless a reset is intended.
- Timing probes (2026-10-15, built from the SDK 3.2 build, time from the 10 % report to 103):
  - unsigned file: refused at once, with no 101 or 10 % report;
  - broken file hash: 1.03 s, after the app certificate chain and the hash;
  - profile block not signed: 1.16 s, after the app signature as well;
  - the real build: 2.02 s, so it also passes the profile's certificate chain (about 0.86 s more).
  The refusal therefore comes from the profile step after its chain. Either the watch does not trust the profile's signer, or it rejects something in the profile's content (the UDID, or a field). The SDK 3.2 build, without source maps, failed the same way, so the package contents are not the cause.
- Profile page: Huawei removed the older "HAP Provision Profile" page; its old help link now redirects to the "Certificates, app IDs, and profiles > Profiles" help. Huawei's GT-series lite-wearable guide (CN, updated 2026-08-19) links its debug-profile step to that page, and new apps can only be created as HarmonyOS NEXT records. So our profile comes from the documented route. Remaining suspect: the UDID. Huawei's documented source for a sports watch's UDID is DevEco Assistant's "Lite Wearable" tab, on a phone that is not on HarmonyOS NEXT.
- Huawei's own route. DevEco Assistant (AppGallery C102668469, package `com.huawei.deveco.assistant` 1.2.1.600, signed by CN=apkkey_devecoassistant_v1, OU=Huawei CBG; APK v2 signature checked 2026-10-15) reads the UDID on its "Lite Wearable" tab and installs a signed HAP from `/sdcard/haps/` through Huawei Health. It reports the watch's numbered error (Huawei's guide lists 30, 31, 40, 47 and others), which Gadgetbridge's 103 hides. Forum reports say it also runs on non-Huawei phones; it ran on the owner's Galaxy Z Flip 7 (2026-10-15).
- **Cause found (2026-10-15): wrong UDID.** DevEco Assistant's UDID differs from the tag 0x05 value we had registered, so the refusal was the profile's UDID check, which fits the timing probes. The GT 6 was added again in AppGallery Connect as "GT 6 DevEco" with the right UDID, and a new debug profile `marc-watch-debug-gt6` names only that device. Checked before signing: its signature and chain, debug type, this bundle, our certificate, and the one UDID.
- **Installed (2026-10-15):** with that profile, DevEco Assistant on the owner's Galaxy Z Flip 7 installed the HAP through Huawei Health, and "M/ARC Watch" appeared in the GT 6 app list. The app opened to a black screen that did not react: M-arc's root `package.json` says `"type": "module"`, so webpack compiled the watch JS as ES modules, which left `require` and `exports` that the watch's engine does not have. `build-lite-bin.sh` now compiles a copy under a CommonJS `package.json`, and `build/check-lite-js.cjs` loads every compiled file in a bare engine context and fails the build if one would not load. It fails on the old output and passes on the new one.
- **Runs (2026-10-15):** version 1.0.1 installed over 1.0.0 through DevEco Assistant and runs on the GT 6: the owner's photo shows "Tapped 9" above the blue Tap button, so rendering, touch and data binding work. Gate A question 1 is answered yes for the debug route (DevEco Assistant + Huawei Health on a Galaxy Z Flip 7, AGC debug certificate and profile). The Gadgetbridge File Installer route is untested with the correct UDID.

## Gate A question 2 plan (2026-10-15)

Question: can phone and watch exchange an identified request and an application acknowledgement through Wear Engine?

- **Watch:** M/ARC Watch 1.0.2. The test page sends `{"t":"marc-a2","v":1,"k":"req","id":"<boot>-<seq>"}`, using Huawei's lite Wear Engine JS SDK copied in unchanged. It shows each send result and the matching acknowledgement with its round-trip time.
- **Phone:** a hidden "Watch lab" sheet in M/ARC, opened by 7 taps on the Version line and present only when the plugin exists. A small Capacitor plugin wraps the Wear Engine Android SDK (`com.huawei.hms:wearengine`). The acknowledgement `{"k":"ack","id":<same>}` is built in TypeScript after the request is parsed and checked, so a send result of 207 alone never counts as an acknowledgement. The log is kept in memory only.
- **Build scope:** the plugin and SDK go into the debug APK only, behind `MARC_WEAR_LAB=1`. New CI checks prove that release and Play builds carry neither.
- **Pass:**
  - 5 watch sends give 5 matching acknowledgements on both screens, with the same ids, 0 bad and 0 lost;
  - negative control: with the phone receiver stopped, no acknowledgement arrives, and it comes back after reconnecting.
- **Approved by the owner (2026-10-15, no supervisor session running):**
  - the Wear Engine Android SDK in the debug APK only;
  - the watch lane making the two wiring edits (`scripts/prepare-android.sh`, `.github/workflows/build-apk.yml`).
  The added CI check steps are add-only.
- **Unverified until the device run:**
  - which phone `Message` accessor carries the watch's text;
  - Wear Engine on Android 16, and the Huawei Health and HMS Core versions on the Flip 7;
  - the exact fingerprint string forms.

### Question 2 build record (2026-10-15)

- Watch app 1.0.2 (`native/wear/hello`): built in debug mode with the 3.2 SDK (COMPILE RESULT:SUCCESS). `check-lite-js.cjs` passes: app.js 7,797 B and pages/index/index.js 37,541 B, all ASCII and under 48,000 B. The HAP was packed with the 7.0 SDK and signed with the debug certificate and profile `marc-watch-debug-gt6`.
  - signed `.bin`: sha256 `df4f484a75cce69bd18c21a15e1501093780abc030f2fc3aa984735097438a80`, and `verify-signed-bin.py` passes;
  - signed `.hap`: sha256 `826b076d76ae6421f594ac3c46194a98f1279bc4fe541a865ad46c31e5cfe299`, and `verify-app` passes;
  - unsigned `.bin`: sha256 `82a3d1fbb53a7c6378829e2bcfd82a585a08dbc9900512e28594b4deeebd4411`.
- Tests:
  - `node --test 'native/wear/test/*.test.mjs'`: 11 pass (A2-1);
  - `python3 -I -B -m unittest discover -s native/wear/test -p 'test_*.py'`: 20 pass (A2-4);
  - `npm test` and `npm run test:tz`: all pass (A2-2);
  - mutations each turn a test red: `lost()` with `>=`, `readAck` with `in`, one byte appended to `wearengine.js`.
- Plugin: `WearEnginePlugin.java` compiles with `javac -Werror` against android-35, the wearengine 5.0.3.304 AAR, the hmf tasks jar and Capacitor 8.5.0. Every Huawei call it makes was checked with `javap`.
- CI on `59998180` (run 38773205697), all green:
  - guard, source-gate (with the new watch-lane tests), visual-gate-tz (A2-6), the ht10 shards and `bundle` (the Play build carries neither the plugin nor the app ID);
  - android-gate (A2-5): the lab checks pass and the permanent-key fingerprint step reads `05:66:9A…CA:F1:F5`;
  - debug APK: artifact `MARC-DEBUG-APK` 11994883964, zip sha256 `cf4421288ec80da3951ed9db0261a09dc072eca8d21ab271572496ff023061d9`.
- The signed watch `.bin` comes from the debug build of the committed sources. The only differences are the four ASCII-folded comment characters in `wearengine.js` (U+3002, U+FF1A, U+FF08, U+FF09).
- Install note: the owner's daily M/ARC comes from Play (versionCode 370000xx, signed with the same key). The debug APK's versionCode is lower, so Android refuses to install it over the Play app. The route is "Export backup" in Settings, uninstall, install the debug APK, then "Restore backup". Raising the debug versionCode instead would stop later Play updates.
- **Device run (2026-10-16, owner's Galaxy Z Flip 7 and GT 6; debug APK from `59998180`, watch 1.0.2 sha256 `826b076d…e299`): question 2 answered yes.**
  - Preconditions (A2-7):
    - watch: Wear Engine service version 402; fingerprint set OK; receiver registered OK; ping to the phone gave 205;
    - phone: SM-F766B on Android 16 (SDK 36); Huawei Health authorisation OK; one bonded device, "Atum-B19F" on software 6.1.0.118(SP10C00M05), connected; receiver registered; ping to the watch gave 202 while the watch app was open (201 before it was).
  - Requests and acknowledgements (A2-8), 2 of the planned 5 sends:
    - watch: `> q1tyot-1 207`, `< ACK q1tyot-1 159ms`, `> q1tyot-2 207`, `< ACK q1tyot-2 496ms`; counters sent 2, ack 2, lost 0, bad 0;
    - phone: `rx q1tyot-1 type 1 data 56 desc 0`, then `ack q1tyot-1 207 75ms`; the same for `q1tyot-2` (61 ms); counters rx 2, ack 2, dup 0, bad 0;
    - the same ids appear on both screens, in the same order;
    - the watch's text arrives in the phone `Message`'s data (56 B), not its description, which settles that open point.
  - Negative control (A2-9): after the phone's Stop (`rx off`), the watch's two sends returned 206, with no acknowledgement (sent 2, ack 0). The watch app had been reopened, hence the new boot id `d4dg85`.
  - Reconnect (A2-9, second half; same morning): after Connect again, the 3 sends `gue55g-1..3` were each acknowledged with 207 (54, 65 and 76 ms on the phone). Across the session the phone counted rx 8, ack 8, dup 0 and bad 0.
  - Versions (A2-7): Huawei Health 16.1.6.310 (from Galaxy Store); HMS Core 6.16.4.352 (installed through DevEco Assistant).
- **Gate A question 5 (2026-10-16): yes, with the phone app in the foreground.**
  - With M/ARC Watch closed (watch face showing), the phone lab's Ping returned 201. The owner reports that M/ARC Watch then opened on its own, and the next ping returned 202.
  - So a phone-side Start can bring up the closed watch companion.
  - Not yet tested: the same with the phone app in the background or the phone locked.
- **Gate A question 4, first finding (2026-10-16): no acknowledgement while M/ARC is in the background.**
  - With M/ARC in the background (Home pressed), a watch send got no acknowledgement on the watch.
  - When M/ARC was opened again, the pending request was handled and the acknowledgement reached the watch (the `lyrlrg` pair: 90 and 56 ms measured from the moment the app's JS saw it).
  - The lab builds the acknowledgement in the WebView's JS. That proves only that the JS path pauses in the background; it does not show whether the Wear Engine receiver itself got the message earlier.
  - Next probe: answer in the native plugin as well and time-stamp the native receipt. That separates "Huawei delays delivery to a background app" from "the WebView pauses".
  - Not yet tested: phone locked, watch display off, and a native watch workout running.

## Gate A probe 2 (watch 1.0.3, 2026-10-16)

Questions 3, 4 and 6 in one device session.

- **Message contract** (both sides; the 1.0.2 fields are unchanged):
  - requests may carry `"p"` padding;
  - heart-rate reports are `{"t":"marc-a2","v":1,"k":"hr","id":…,"bpm":20..250}`;
  - acknowledgements add `"n"` (bytes received) and `"by":"js"|"native"`.
- **Watch modes** (the Mode button cycles them; the first button changes its label per mode):
  - MSG: one request per tap;
  - AUTO: a request every 5 s, showing sent, ack, lost and late, the last ack's age and timer gaps;
  - SIZE: 5 requests of 100, 200, 400, 800 and 1000 B, each row showing the n echoed back;
  - HR: `@system.sensor` heart rate, with bpm, sample count and age, and a report every 5 s;
  - KIT: a launch counter in `@system.storage`, short and long `@system.vibrator` tests, and swipes logged with direction.
  - `config.json` now requests `ohos.permission.READ_HEALTH_DATA` and `ohos.permission.VIBRATE`. If the GT 6 refuses the install, the first fallback is a build without them: it is built and checked from `329f78cf` with only `reqPermissions` removed, `.hap` sha256 `52f6c3ac17e04b18464321b20aec7be5d4a8a16b7e755ebfaf6c23ec89025904`, and is kept private until needed.
- **Phone lab:**
  - every message is stamped on native receipt, and the row shows `js +<ms>` (when JS handled it, minus the receipt time);
  - the "Native ack" toggle answers in Java at once, without waiting for JS;
  - a 1 s liveness ticker logs `! native gap up <a>s real <b>s` when a tick runs more than 2 s late.
- **Reading a background run:**
  - an uptime gap means Android froze the M/ARC process (fixable with a foreground service);
  - a real-time gap without an uptime gap means the phone slept;
  - a late native receipt while the ticks kept time means the message was held before reaching the app;
  - with Native ack on and no gaps, acknowledgements continuing in the background show that background replies can work.
- **Build:** signed `.bin` sha256 `d592c2201a2c7253f25202f790e38b9eb6387d0a40820b2990fc5a4652ab99ee`, `.hap` `01f9e60920c09c2a9284cc6eeba201d130cb35972e8cb74b618f84071f5e2bb0`, unsigned `628b439e4ca0ba6ceaadd17d8c7d86633c1ce6fd28f220e913772fe99ba34bc5`. Page JS is 46,508 B. `verify-signed-bin.py`, `check-lite-js.cjs` and the 21 watch tests pass.
- **Red team (2026-10-16):** the files check out (hashes, signature, a rebuild from `git archive 329f78cf`). Installing the new debug APK over the 59998180 one keeps data: same package, key and versionCode 1. The device steps were rewritten from its findings (mode order, screen timeout, separate phases, phone screenshots).
- **Phone:** the 47 lab tests pass; the plugin compiles with `javac -Werror`. The two new source checks (strict JSON, ticker) fail on the pre-fix plugin and pass now.

### Probe 2 device run (2026-10-16)

Debug APK from run 1988 (`71b53d88`) on a Samsung SM-F766B (Android 16, SDK 36). Watch 1.0.3 on the GT 6 (Atum-B19F, software 6.1.0.118(SP10C00M05)). The owner ran the steps, sitting in a parked car.

- **A. Native ack off, phone app open:** 11 sent, 11 acknowledged, 0 lost. Round trip on the watch was 109 to 343 ms. The first two requests reached Java on time but JS only 9.3 s and 4.3 s later; the rest within 2 to 9 ms.
- **B. Native ack off, phone app in the background (Home):** 9 of 9 acknowledged by JS, round trip 398 to 517 ms. After the run the ticker logged `native gap up 6.4s real 6.4s`.
- **C. Native ack on, part on screen, then background:** 9 of 9 acknowledged natively. Round trip 93 to 207 ms on screen and 539 to 623 ms in the background. The native ack is not faster in the background, so the extra time is not JS.
- **D. Native ack on, phone locked:** 6 of 6 acknowledged natively, round trip 207 to 290 ms, JS also live (5 to 23 ms). The log started over before D; the owner thinks he closed M/ARC by accident while locking, so that restart is not a finding.
- **E. Huawei Strength workout running:** the GT 6 runs one app at a time. While the Huawei workout runs or is paused, no other app can be opened, and M/ARC Watch closes when the workout screen comes back (owner, and a ping answered 201 straight after). M/ARC Watch cannot run beside Huawei's workout; it has to be the workout app itself.
- **F. Sizes, with the phone app idle in the background:** 100, 200, 400, 800 and 1000 B all answered 207 and echoed the exact byte count, natively, round trip 118 to 606 ms. Before them the ticker logged `native gap up 55.4s real 55.4s`: Android had frozen the M/ARC process for 55 s while the phone was awake. The first message woke it, Java answered within 43 to 94 ms, and JS saw the messages only 7.2 to 7.6 s later, when the owner opened the app.
- **G. Heart rate:** `subscribeHeartRate` fails with 602 "Permission not declared" and no permission prompt appears, although the built `config.json` declares `ohos.permission.READ_HEALTH_DATA`. It still fails after uninstalling and installing 1.0.3 fresh. Later that day the owner switched it on in the watch's Settings, Permission manager, M/ARC Watch, Body sensors, Allow. (The phone app declares no body-sensor permission, so this is the watch's setting.) Heart rate then worked: 13 samples, last 76 bpm, and the phone received 10 heart-rate reports at 74 to 77 bpm, all acknowledged natively, round trip 422 to 515 ms, including a few seconds with the phone app in the background. The watch counted 2 of 12 as lost: the phone shows neither, and its log starts with Connect just before report 3, so they were most likely sent before the phone was listening.
- **H. KIT:** the short and the long vibration were both felt. Swipes left, up, down and right all reach the app; a right swipe does not close it.
- **I. Storage:** the launch counter read 12 after closing and reopening, so `@system.storage` keeps data across launches.
- **J. AUTO with the watch screen going dark:** the phone received 6 requests (one every 5 s) and answered each natively, but its answer to the sixth got 206: the watch app was gone. Waking the watch showed the watch face, and tapping did nothing; M/ARC Watch had to be opened again from the app list, and it started from zero (MSG mode, nothing sent). So the GT 6 closes the app about 25 s after its screen goes dark. The owner then found that Ping or Connect on the phone opens M/ARC Watch even while the watch screen is dark (Connect sends a ping too), so the phone can bring the watch app back, for example when a rest ends. The phone's JS saw the 6 requests 153 to 178 s late, with native gaps of 4 to 5 s between them, while Java answered each at once (65 to 155 ms).
- **L. Watch 1.0.4, AUTO with keep-on, watch untouched:** "keep on ok" appeared and the screen stayed on the whole time (owner). 30 requests over about 150 s, all answered natively in 41 to 239 ms; the watch showed 22 of 22 with round trips of 205 to 318 ms, except one of 4.6 s right after a 5.9 s native gap on the phone. Stop showed "keep off ok". The heart-rate permission stayed allowed after installing 1.0.4 over 1.0.3.
- **M. Watch 1.0.4, HR with keep-on:** the screen stayed on the whole time. The phone received 25 heart-rate reports at 76 to 83 bpm, all answered natively in 41 to 122 ms; the watch showed 21 sent, 20 acknowledged (the last in flight), 0 lost, 21 samples and round trips of 316 to 425 ms. That is about one sample every 5 s.

What it answers:

- **Question 4:** a backgrounded M/ARC can answer the watch, but only from Java once Android has frozen the app. An incoming Wear Engine message wakes the process and the native ack goes out at once, while the WebView runs only when the app is opened again. The first question 4 finding was this case. In B to D, JS kept up because traffic every 5 s started as soon as the app left the screen. The workout path therefore needs the native workout service the architecture recommends, not WebView JS.
- **Question 4, watch display off:** the app does not survive a dark screen, but `@system.brightness.setKeepScreenOn` keeps the screen and the app on while a run goes (1.0.4: requested when a run starts, repeated in `onShow`, released on every stop). Battery cost over a full workout is not measured yet. A phone ping reopens the app if it does close. Build: signed `.bin` sha256 `c6061dd4887263a89a2f38118cbcba22160ea7df75a7f46ce13d034a5ecfffa2`, `.hap` `fcae75beb9283e09d8acc4b7919ceebc2c2b75ec3162bd279f2e296d333ae54d`, unsigned `b6f591f2817cf1b6140eeaf0f91a2a4c99cd638abcb22913085d7e3d4d5cdcec`; page JS 47,403 B; `verify-signed-bin.py`, `verify-app` and the 23 watch tests pass.
- **Question 6:** 1000 B messages work both ways, vibration and swipes work, and storage persists.
- **Question 3:** yes, `@system.sensor` heart rate works on the GT 6, but the permission is not granted at install and no prompt appears: the user has to allow Body sensors in the watch's Settings, Permission manager. The app must detect 602 and show that path.
- **Architecture:** Huawei's workout and M/ARC Watch cannot run together on the GT 6, so M/ARC Watch must measure heart rate and keep the workout itself. Its own heart rate works once the permission is on.

## Gate C: the workout app (WATCH-C, 2026-10-16)

Card: `docs/watch-cards/WATCH-C.md`. Debug APK only (`MARC_WEAR_LAB=1`); the privacy policy has no watch section yet.

- **Watch:** `app/`, M/ARC Watch 1.1.2 (code 1001002; 1.1.0 and 1.1.1 were device builds): the bundle, abilities and API 6 shape of `hello/`, no permissions. One page shows the exercise and set from the phone, an Effort button (tap: Easy, Ideal, Max, none), the rest with +30 s and Skip, Complete, and three status lines. `common/link.js` holds the protocol, the outbox and every screen line (tests: `test/link.test.mjs`); the page only makes the Wear Engine, storage and screen calls.
- **Phone:** `src/native/watchLink.ts` (tests: `tests/watch-link.test.ts`, and `tests/watch-contract.test.ts` runs the watch's `link.js` against it). The lab's Connect starts it; the Watch lab gains a Hold results switch and `mw` counters.
- **Protocol `mw` v1** (JSON, at most 1000 B; any other `v` shows "Update needed" and stops sending; unknown kinds and fields are ignored):
  - hello (watch, at most 120 B) `{t,v,k,app,boot,wt,q}`: at start, on `onShow`, after 20 s without a phone message, and after a failed send (5, 10, 20, then 30 s);
  - snap (phone, at most 700 B, ASCII) `{t,v,k,pt,wt,srev,sid,ex,si,sn,set,rest,th}`; `set` is `{id,rev,w,u,r,e,src}`, `rest` is `{id,left,tot,p}` with `left` and `tot` in ms. Sent on a hello (echoing its `wt`), after each result, on Connect, when M/ARC comes back on screen, and when the snapshot changes (not `pt` or the countdown), at most one per 300 ms;
  - cmd (watch, at most 400 B): WATCH-B's command with `t` and `k` in front, keys in a fixed order, with the load and effort the watch shows;
  - res (phone, at most 200 B): `{t,v,k}` plus the `CommandResult`, whatever the plugin's `by` says, then a fresh snap. `Wire.requestId` accepts only `marc-a2`, so Java never answers a workout message.
- **Outbox:** 8 slots, then the index (`m2q` since 1.1.2; 1.1.1's `mc_q` keys are never read). `@system.storage` refuses values of 128 bytes or more ("The length must be less than 128 bytes"; device run D1 on 1.1.0 showed "Not saved" for every 230 B command), and since 1.1.2 slot `n` (`m2qn`) is one value of under 120 plain characters: the command's fields (kind code `c`, `a` or `s`, commandId, sessionId, actionAt, setId or restId, then for a Complete rev, load, unit, reps, effort) and their sum, from which the watch rebuilds the same wire bytes. A command whose value would reach 120 characters, holds a character outside ASCII 33 to 126, or does not rebuild to the same bytes shows "Not saved" and sends nothing. Storage calls: a Complete, +30 s or Skip is 3 (slot, its read-back, index), a result is 1 (index), a start is the restart count's read and write, the index and one read per listed slot. The slot is read back and compared before the index is written, so Pending shows only after both; a slot whose sum does not match, whose kind code is not `c`, `a` or `s`, or whose field count is wrong is not loaded. No value is ever empty: the empty index is `-`, and `-`, an empty or a missing index all read as empty (1.1.1 wrote `""` when the outbox emptied, the most likely cause of its crashes). Every storage call starts on a fresh stack (`setTimeout` 0) and its callback comes back the same way, each inside `try`, with only the documented fields (a get: key and default; a set: key and value). One job at a time, each started on a fresh stack too. A call silent for 5 ticks fails, and storage then stays off for the run (each new tap shows "Not saved" and makes no storage call; before 1.1.2's red team W2 had "the next tap works" here, a deliberate spec change); a job whose start was lost starts on the 6th tick, and a job silent for 10 ticks is given up, with storage off too. After `onDestroy` nothing deferred runs, and messages and `onShow` do nothing. The tests' fake storage refuses values of 128 bytes or more since D1; before, it took any length, which is why the tests missed this. One command in flight, oldest first, the same bytes each time: resent after 4, 8 and 16 s, then every 30 s, and at once when a snap arrives (unless it went within the last second). `applied` (a replay too) shows "Saved" once the outbox is empty, and "N pending" while others wait; `rejected` shows "Changed on phone", "Workout ended" or "Not saved" and removes the entry, because the same bytes always get the same answer; `not_saved` is retried. Complete stays locked until the outbox has loaded, while its set is pending or being written (only a Complete sets that lock), and after Saved until a snap moves on; a second Skip for the same rest waits the same way. If the index or a listed slot cannot be read at start, the index is left as read for the rest of the run (a removal queued during start-up checks this when it runs) and new entries show "Not saved"; the next start reads them all again. An index write that reports a failure but was saved shows "Not saved", and the next launch sends that command; the phone's receipts keep it to one set. A storage call that has not called back after 5 ticks counts as failed ("Not saved"; at start-up, the unreadable-index path), and a late callback does nothing; if that late call was the index write and it lands after the cut-off, a command shown as "Not saved" can still be sent after a restart, and the phone rejects a second Complete of that set as already committed, so there is no double set.
- **Restart guard (1.1.2, after the red team):** `m2r` = `n,x`: `n` unclean starts in a row; `x` is `r` while a run is open, `c` after `onDestroy`, or the watch time a pause began. Each start reads it first. After an open run `n` grows by 1 (a count that is not an integer from 0 to 98 counts as 0); after a clean exit it is 0, and after a pause 1. The 2nd unclean start in a row (the 3rd start after 2 crashes) pauses the run: no receiver, no hello, no sends, no outbox load or resend, and no storage write but `m2r` = `n,<time>`; the screen shows "Paused after restarts" and "Try again in 10 min". A marker that cannot be read (failed, or silent for 5 ticks) pauses too, with no write. The pause lasts 600 ticks of the page's 1 s interval, then the run goes live by itself; a reopen during it pauses for the rest of the 10 min by the watch clock, never longer. `onDestroy` of a live run with no storage call in flight writes `0,c` with one direct `storage.set` (no `setTimeout`, callbacks ignored), as its last step; an exit during a call writes nothing and counts as unclean. A run live for 30 ticks writes `0,r`, so clean exits and slow restarts never count. A run whose storage went off writes nothing at `onDestroy`, so its exit counts as unclean; a crash later than 30 s into a run is not counted (the red team's 35 s crash loop never pauses). Unverified on the GT 6: whether the `onDestroy` write lands; if the watch drops it, two quick glances pause the third open for 10 min (device check planned).
- **Hardening (1.1.2, after the red team):** resends, hello, the phone lines, the rest countdown, storage time-outs and the pause count the page's 1 s ticks; the watch clock is read only for `actionAt`, the clock offset and a pause carried across a reopen. A message over 2,048 characters is refused before `JSON.parse`; snap fields (`wt` too) and res fields are type-checked, so a value such as `{"toString":1}` is ignored. Every page entry point (`onInit`, `onShow`, the buttons, `onDestroy`, the 1 s interval and the receiver callbacks) catches what it throws.
- **Clock:** offset = `pt - (wt + arrival) / 2` from the hello and snap pair with the lowest round trip, or from a later pair whose offset differs from it by more than that pair's round trip (the watch clock changed), kept for the app's run (each run starts with a hello); `actionAt` is fixed at the tap. "Pending hh:mm:ss" shows `actionAt` in watch time, and the lab row of an applied set shows its saved time (`at hh:mm:ss`), so the two can be compared.
- **Decisions beyond the card:**
  - `set` is null for every exercise mode but plain weight (bodyweight, assisted and conditioning as well as timed): the protocol carries no load meaning yet, and WATCH-ARCHITECTURE 7 forbids inverting it. The watch shows "Log on phone".
  - The snapshot's values go field by field, as Train's fields and placeholders do: the draft's own, else the target, else last time; `src` is `d` when the draft has any value of its own.
  - The exercise shown (device run D1, owner): the card open on the phone (Train's `openEntryId`, an in-memory signal), else the exercise of the set logged last, else the first one in display order; each only when it still has a set to log and is neither done nor skipped.
  - The lab's new controls are built in `watchLink.ts` and mounted in `WatchLab.tsx` with one line: the existing A2-6 test pins `WatchLab.tsx`'s own words, and a WATCH-C test pins the new ones.
- **Build (2026-10-16, debug, 7.0 SDK, unsigned):** page sources 31,913 B (at most 32,000), compiled `pages/index/index.js` 42,621 B (aim at most 44,000), `check-lite-js.cjs` RESULT: OK. `.bin` 173,900 B, sha256 `d999c32490316d4962fc797e285483df18c505ae5c169567eb743e9cf222b77c` (after the red-team fixes). Not signed here: the owner signs it.
- **Build 1.1.1 (2026-10-17, debug, unsigned, after review):** page sources 31,943 B (`link.js` is tab-indented to stay within 32,000; chunks use `substring`, as `substr` is Annex B; storage calls time out after 5 s), compiled `pages/index/index.js` 43,486 B, `check-lite-js.cjs` RESULT: OK. `.bin` 174,765 B, sha256 `16f317038f07f3a312c03c08ef582b0fe6fad5518624e0a8e645d6276e310f11`.
- **Build 1.1.2 (2026-10-17, debug, unsigned, after review):** page sources 31,975 B (`index.js` tab-indented too, except its page methods), compiled `pages/index/index.js` 43,964 B, `check-lite-js.cjs` RESULT: OK. `.bin` 175,243 B, sha256 `92dc7a945c5c92fc9bc4e6a7849f81786acafebb7708b7f96b29d0a176e50c81`. Not signed here.
- **Build 1.1.2 (2026-10-17, debug, unsigned, after the red team and its final check):** page sources 33,502 B (at most 34,000 since this round, card W4), compiled `pages/index/index.js` 45,709 B (at most 46,000), `check-lite-js.cjs` RESULT: OK. `.bin` 176,988 B, sha256 `eba9cfe58f65ffd8e62f9b0d2e526438441300af3f1be8249462270ebbca000d`. The red team's JerryScript scenarios (rt-e s1 to s15, 8 and 14 KB stacks) and the final check's probes (rt-f F1 to F5) run on its compiled page with no escaped exception, no invalid storage write and at most one storage call in flight; the 128a56db page failed s1 (stuck after a burst), s2, s3, s4, s6, s7, s9, s10 and s11 (the engine died), s12 and s15 there. Not signed here.
- **Signed 1.1.1 (2026-10-17):** `.bin` sha256 `d97916a894458cb620514588d4eced8f53cb53b4b2b1d5e4a4c34907a21fd343`, `.hap` `7d3396145f29d0f0013adeee59a1f5960dfda43ccf85c8ea04a95b2195368994`, from the unsigned `.bin` above; `verify-signed-bin.py` and `verify-app` pass. Version 1.1.1 (1001001), no permissions.
- **Signed (2026-10-16):** `.bin` sha256 `ff8ad3781ac64516fc543b2f4e118d5e6a1ff95e8fe5dada4a51e36a9d520d57`, `.hap` `ded41fbaa7c191b571467fc6091f88947d7b9a53265690a5b96742e836ee96bb`, from the unsigned `.bin` above; `verify-signed-bin.py` and `verify-app` pass. Bundle `com.mrcdrnzz.dailytracker.watch`, version 1.1.0 (1001000), no permissions.
- **Unverified until the device runs:** whether storage takes the JSON characters in a chunk unchanged (the read-back shows "Not saved" if not), `if` and colour bindings on the GT 6 (the community GT 6 app uses both on text), and whether Connect alone recovers the link after Bluetooth comes back.

### Device run D1 with 1.1.1: crash and watch reset (2026-10-17)

- **What worked:** the phone applied 3 `complete_set` commands and 1 `rest_skip` sent from the watch (lab: `mw cmd 4 res 4`; sets at 16:47:59, 16:48:49 and 16:49:39 phone time), so the chunked outbox, the link and `handleWorkoutCommand` work end to end.
- **What failed:** the watch app restarted after every applied command (a new boot id in the next hello each time), then crashed on every reopen. After repeated reopening the watch went into "system recovery", restarted, lost its pairing with the phone and its installed apps (owner). The test workout was discarded.
- **Likely cause, not confirmed:** storage callbacks that run synchronously, so the chain of about 10 storage calls per command (and the start-up reads of every pending slot) nests deeply on the watch's small stack. 1.1.0 failed at its first write and never ran the long chain. A pending slot left by a crash would then crash every start. Being checked against the OpenHarmony sources.
- **Source check (2026-10-17):** on the watch target, OpenHarmony's ace lite config turns its own storage and brightness modules off (`frameworks/targets/liteos_m/acelite_config.h`: `FEATURE_MODULE_STORAGE 0`, `FEATURE_MODULE_BRIGHTNESS 0`), so the GT 6 runs Huawei's closed modules and nothing below is confirmed. The best match: `drop()` writes `storage.set('mc_q', '')` once the outbox empties, which is exactly "right after each applied command"; open source turns an empty value into a delete (`commonlibrary_utils_lite`, `nativeapi_kv.cpp`), but Huawei's module may not. A reopen resends the pending command, the phone answers and `''` is written again, which is the loop. Open-source storage callbacks run later from the JS task's queue, and the JerryScript stack limit (8 KB) raises a catchable error, so deep nesting is less likely.
- **Rules from now on:** no watch build goes to the owner until the cause is backed by evidence and the build has (1) every storage step started from a fresh stack, (2) a crash-loop guard that turns storage and messaging off after an unclean start, and (3) a test that fails on 1.1.1's nesting.

## Not verified yet

- Whether a release build runs the `.js` or the jerry `.bc` snapshot it also contains.
- Icon sizes (116 and 48 px were picked, not looked up).

## Signing

`build/sign-lite-bin.sh` signs the unsigned `.bin` with `hap-sign-tool.jar sign-app -mode localSign -inForm bin -signAlg SHA256withECDSA -compatibleVersion 6`. It then builds the signed HAP the way DevEco's debug build does (hvigor `LegacyPackageHap` then `SignHap`): `app_packing_tool --mode hap --bin-path` packs the signed `.bin` as `entry-default-signed.bin`, the zip is signed with `-inForm zip`, and `verify-app` checks the HAP. The packing step needs the 7.0 SDK. Signing uses the watch debug keystore (`.p12`), the debug certificate (`.cer`) and the debug profile (`.p7b`). The keystore password comes from `MARC_WATCH_KEY_PWD`. The keystore, its password, the certificate and the profile are kept outside the repo: the owner holds them.

AppGallery Connect (2026-10-15): HarmonyOS app `com.mrcdrnzz.dailytracker.watch` (in its own project), the GT 6 registered as a sports watch by its UDID, a debug certificate from our EC P-256 CSR, and a debug profile for that app, certificate and watch, valid until 2027-10-15. Checked before use: the certificate carries our key, and the profile names this bundle, this certificate and the one watch.

On 2026-10-15 the `hello/` app built and signed: the signed `.bin` is the unsigned one plus a 6,663-byte signature block that holds the certificate and the profile and ends with `hw signed app   1000`. This SDK's `verify-app` cannot check a `.bin` (it reads it as ELF); `build/verify-signed-bin.py <signed.bin> <root.pem>` checks it offline instead.

## Installing from a non-Huawei phone

DevEco Assistant is only offered on Huawei phones. The candidate route is Gadgetbridge's File Installer (upstream 0.95.1), which uploads a signed `.bin` and leaves the signature check to the watch. It needs Gadgetbridge paired with the watch through the Huawei account ID, and it switches the watch between Gadgetbridge and Huawei Health. In use since 2026-10-15; see the install attempts above.

The first UDID came from the Watch UDID tool in the Watch-test repo (`udid-tool/`): the security-negotiation tag 0x05 value, which is also the watch's HiChain auth ID. On the GT 6 that is **not** the UDID the installer checks. DevEco Assistant's "Lite Wearable" tab gives the right one (2026-10-15), and it matches the `deviceSn` the watch sends after pairing in its WeChat device message (service 0x37 data, product 8240). Values are kept out of this public repo.

## Huawei console submissions

Owner rule (2026-10-15): everything entered in the Huawei developer console is reviewed and red-teamed against the approved Wear Engine application before it is submitted. Two applications were rejected for inconsistent documents and form answers.

The record, the console entries, the red-team findings and the pre-submission checklist are in `docs/WATCH-WEAR-ENGINE-APPLICATION.md` (sections 9 and 10). Signed builds carry the owner's name and the watch's UDID, so `.gitignore` here blocks built and signing files.
