# OLD-ANDROID-1: launch failure on older Android phones

Owner report (2026-10-10): on older phones with a lower Android version, tapping the app crashes it or it never opens.

Investigation: supervisor workflow wf_e03f793e-c6c on main 41807999 (2026-10-16). Five lenses (JS syntax, JS runtime, native, Capacitor/WebView, boot); each candidate was adversarially verified: 12 survived, 3 were refuted.

Cards: OLD-ANDROID-1a (native, builder session_01PXNT6jPqQUKp9GfwGRR1HA) and OLD-ANDROID-1b (web floor, builder session_01AKXZbhXZViXpgvhfT3UeEv). The supervisor split the planned card in two because the file sets do not overlap.

Decision D-OA1-FLOOR (supervisor, 2026-10-16): WebView floor 111 by feature detection. OLD-ANDROID-2 lowers it to 80 only if device data shows users on WebView 80-110 who cannot update. No emulator smoke job for now; device check D1 is the real-ART proof for this release. The 1a builder also fixes WatchService's adaptive small icon (open question 7).

## Ranked causes

Verdict basis: all the evidence below was produced and adversarially re-run by the investigators and verifiers. I re-checked the key facts myself at the current HEAD 41807999: capacitor.config.json has only appId/appName/webDir/backgroundColor; vite.config.ts:20 `target: 'es2020'`; tsconfig.json:3 ES2020 with :6 lib ES2022; MainActivity.java:10-13; HealthConnectNativePlugin.java:66/:70/:224; index.html:109-110, :187, :191. At HEAD, grep finds 16 `.at(-1)` calls on 15 lines (apply.ts:172 has 2) and 14 `.finished` code sites (primitives.tsx:149 is only a comment). Two older verdicts ran on e9c4c482, where the entry chunk was index-DvgYX2LA.js. At HEAD it is index-CqIbE2DP.js. Those verdicts' conclusions still hold.

1) NATIVE-HC-REFLECT: native crash on every launch, Android 8.0-13 (API 26-33), whatever the WebView version. Most likely cause.
- Symptom: the app closes at once or shows "M/ARC keeps stopping", on every cold start.
- Mechanism: MainActivity.java:10 registerPlugin(HealthConnectNativePlugin.class) runs before :13 super.onCreate. Then BridgeActivity.java:42/:48 load() creates the bridge. Bridge.java:231 registerAllPlugins() runs BEFORE :233 loadWebView(). PluginHandle.java:104 newInstance, then :116 initializeActivityLaunchers(), then Plugin.java:109 getDeclaredMethods() on the plugin class.
- Two private methods carry API-34-only types in their erased descriptors: `private HealthConnectManager manager()` (HealthConnectNativePlugin.java:70) and `private <T> T aggregateIfGranted(String, AggregationType<T>, String, JSArray)` (:224).
- On ART, getDeclaredMethods() resolves return and parameter types and throws NoClassDefFoundError when one is missing. This is from memory (libcore Class.java comment "Throw NoClassDefFoundError if types cannot be resolved") and unverified here, because there is no SDK, ART or emulator.
- NoClassDefFoundError is an Error. It passes through PluginHandle.java:106 catch(Exception) and Bridge.java:704-710 (only InvalidPluginException/PluginLoadException), and the process dies before the WebView loads. The SDK_INT<34 guard at :66 protects method bodies, not signatures.
- Evidence:
  - JVM repro with the real plugin source plus Capacitor's exact loop: scratchpad/crash/realrepro and (supervisor scratch) crash/adv-hc. It gives NoClassDefFoundError android/health/connect/HealthConnectManager at Class.getDeclaredMethods <- Plugin.initializeActivityLaunchers, not caught by catch(Exception). With the strict verifier it fails earlier, at Class.forName, with the same uncaught Error.
  - A scratch nested-class fix passes with the verifier on and off: adv-hc/fix/HealthConnectNativePlugin.java, with 0 android/health refs in the outer class against 107 at HEAD.
  - The release build is not minified (template app/build.gradle:21 minifyEnabled false). release-apk.yml and play-bundle.yml both ship it, and prepare-android.sh:13 forces minSdk 26.
  - The signatures are present since 8365d9eb (2026-09-28) and unchanged at HEAD.
  - The other registered plugins are clean (NativeUiPlugin:123 Vibrator, WatchBridgePlugin:62 BluetoothAdapter).
  - Correction: readIfGranted/readRecords do not trigger it, because erasure removes the Record bound.
- Confidence: mechanism high (one step is from memory). Link to the owner's report high-medium: this is the only cause that hits Play-updated phones and follows the Android version, which matches "older phones with a lower Android version crash or never open". While it stands, it hides every web cause on Android 8-13.

2) WEB-PARSE-FLOOR-80: WebView 61-79 gets the "M/ARC could not start" card; WebView 60 or older gets a blank screen. Merges es2020-entry-needs-webview-80, es2020-syntax-floor-webview80, cap-no-webview-gate and webview-below-80-syntax-floor.
- Mechanism: vite.config.ts:20 es2020 keeps `?.`/`??`, and the minifier also writes `??` into Preact (createVNode `__v:r??++xh`, near offset 1719). At HEAD the entry has 561 `??` and 483 `?.` nodes, and 13 of 50 chunks need Chrome 80.
- Real old engines: V8 7.0 (Chrome 70) and V8 7.8 (Chrome 78) fail with "SyntaxError: Unexpected token '?'". V8 8.1 parses 50/50 chunks (scratchpad/crash/adv/tools/parsemod.js).
- Nothing stops the load:
  - Bridge.java:105 defaults to 60. In :305-312, with no server.errorPath, it only logs (silent in release, CapConfig.java:296-306) and loads the app anyway.
  - The parse error reaches index.html:109, and __marcCrash shows the crash card. Its "Reset app data" button deletes every workout and cannot fix an old WebView.
  - Whether Chromium 61-79 reports a module parse error to window.onerror is unverified; if it does not, the result is a blank screen.
- Affected: phones whose active WebView provider was never updated (no Play Store, updates off, custom ROMs, maybe Huawei without GMS). Factory WebView per release, from memory and unverified: 8.0 about 58, 8.1 about 61, 9 about 66-69, 10 about 74, 11 about 83. Play-updated phones are not affected.
- Confidence: defect certain; link to the owner low-medium.

3) BOOT-SILENT-BLANK: the entry never runs and the blank screen stays with no message. Merges no-module-support-silent-blank and no-boot-watchdog-blank-screen.
- Mechanism: the only app script is `<script type="module">` (source index.html:191, built :112) with no fallback.
  - On WebView 60 or older it is ignored and no error fires.
  - A failed fetch fires 'error' only on the <script> element, which does not bubble to window.
  - __marcBooted is never set (main.tsx:33), the overlay leaves at 4 s (index.html:187), and #app stays empty on #08090a.
- Reproduced on Chromium 141 by rewriting the module type and by making the entry 404, empty or wrong-MIME: booted false, #app has 0 children, no error, still blank at 30 s.
- Corrections:
  - Parse and evaluation errors already show the crash card.
  - A synchronous hang cannot be caught by any JS timer.
  - A fixed 8-10 s timer gives false crash cards (with the Reset button) on slow loads (probe2 FIX=timer8). The deterministic fix is a DOMContentLoaded check plus a capture-phase script-error listener (probe2 FIX=dcl: no false positive).
- Affected: WebView 60 or older (Android 8.0 never updated, from memory). Entry load failures are unlikely in the APK (WebViewLocalServer.java:547-561 forces the JS MIME type).
- Confidence: gap certain; link to the owner low.

4) ANIM-FINISHED-84: on WebView 80-83, closing any sheet freezes the app. Closing the first-run sheet with X freezes it at first launch, on every launch.
- Mechanism:
  - primitives.tsx:117-128 requestClose sets closingRef and markClosing, guards only `!p.animate` (:122), then calls `anim.finished.then`, which throws a TypeError.
  - The modal <dialog> stays open but invisible and swallows every tap.
  - The first-run sheet (App.tsx:118) leaves only through close.current() (Onboarding.tsx:19-23), so it comes back on every launch (onboarding.ts:63). Only "Later" (Onboarding.tsx:44) works.
  - Back recovers panel sheets but not the first-run or Escobar sheets.
- 14 sites: primitives.tsx:128,151,160,332,337; History.tsx:96,124,127,202,229; ZoomHost.tsx:105; EscobarSheet.tsx:237,273,286.
- Probes adv-fin-r/probe.mjs and probe-x.mjs: with finished deleted, and in a full Chrome-83 simulation, the dialog stays open, nav is blocked and the page errors with "reading 'then'".
- finished arriving in Chrome 84 is from memory; caniuse-lite marks Web Animations as full support from 84.
- Confidence: defect high; real devices rare; link to the owner low.

5) ARRAY-AT-92: on WebView 80-91, a weighted workout can never be finished, and Train or Finish can show the "Screen error" card. Not at cold launch.
- 16 calls in 9 files at HEAD: post.ts:206; substitute.ts:54; recovery.ts:446,459,498,529; progression.ts:330,503; escobar/mock/transport.ts:69,78; escobar/apply.ts:159,172(x2); escobar/tools/show.ts:90; escobar/tools/read.ts:182,358.
- tsconfig.json:6 lib ES2022 against target ES2020 lets them typecheck, and nothing polyfills them.
- Effects:
  - recovery.ts:529 throws inside update() (session.ts:604), so the session is not saved, active stays set, and the user sees the toast "Something went wrong. Your data is saved." (main.tsx:45).
  - post.ts:206 throws during FinishScreen render (Train.tsx:1258-1265), which shows the ErrorBoundary card.
  - progression.ts:503 throws during the Train render. The card's Reload loops, because #train is kept (router.ts:116, ErrorBoundary.tsx:99).
- Evidence: E2E runs in refute-at/e2e2.mjs; the draft test tools/vt/at-floor.test.ts fails on HEAD. Boot is fine without .at (probes c80/c91).
- Confidence: defect high; link to the owner low.

6) CSS-ABOVE-FLOOR: degraded UI on WebView 80-110, no crash.
- inset 87 (index.html:27 plus 20 rules); translate/scale 104; :has 105 (styles.css:238); dvh 108 (styles.css:91,109,280,286,556,560,561); color-mix 111 (60 shipped uses).
- Every color-mix use contains var(), so a plain fallback before it is discarded and the property becomes unset: black muscle map, transparent chips, no focus ring.
- linear() is already guarded (styles.css:51).
- Confidence: degradation real; not a launch cause.

Refuted, kept for the record:
- huawei-webview-version-bypass. Only matters if a fix relied on Capacitor's version gate. Design rule taken from it: use feature detection, not versionName.
- systembars-versionname-parse. No real versionName fails, and it is not tied to the Android version.
- renderer-gone-unhandled. Not tied to the version. Act on it only if a logcat shows "Render process gone".

## Card as planned (split into 1a and 1b)

```
id: OLD-ANDROID-1
model: claude-opus-5-5 (the native refactor and boot gating need judgement; not mechanical)
outcome: M/ARC opens on every Android 8.0+ phone. On API 26-33 the launch never throws in native code. A WebView too old for the bundle gets one clear "WebView update" screen. It never gets a crash card, a blank screen, a frozen sheet or a workout it cannot save. A boot that never starts always shows a message.
base: origin/main at or after 41807999
depends_on: none. build_prerequisites: none. merge_prerequisites: review passed; every check green on a head that contains the latest main; the supervisor's collision check is done (open cards' write_scope for index.html, src/main.tsx, native/HealthConnectNativePlugin.java, .github/workflows/build-apk.yml and the gate file).
lanes: two independent halves (native: A1-A2, G1-G2; web: A3-A9, G3-G4). The supervisor may split them into OLD-ANDROID-1a and 1b in parallel; the file sets do not overlap.

decision (record it in docs/ARCHITECTURE.md, one short section on the minimum Android and WebView):
- WebView floor = 111, by FEATURE DETECTION. The app needs:
  - module scripts (61)
  - Array.prototype.at (92)
  - Animation.prototype.finished (84)
  - CSS color-mix() (111)
- Any engine with all four also parses ES2020 (Chrome 111, Firefox 113, Safari 16.2; versions from memory). So there is no eval/new Function probe, which keeps it CSP-safe.
- Why this design:
  - It closes causes 2-6 using index.html plus one wiring line.
  - It needs no edits to card-owned files (src/ui/primitives.tsx, src/ui/styles.css, src/escobar/ui/EscobarSheet.tsx, src/slices/history/History.tsx, src/brain/**).
  - Every device below the floor is a WebView that missed its updates, and it gets one actionable screen.
- Why not capacitor.config.json minWebViewVersion plus errorPath:
  - It reads the provider's versionName, and Huawei uses its own numbering (Bridge.java:332-344).
  - errorPath also fires on every main-frame load error and loops on a 404 (BridgeWebViewClient.java:55-58, :85-88).
  - The Chromium gate cannot test it.
- Lowering the floor to 80 (replace the 16 .at calls, add an animDone helper at the 14 .finished sites, add CSS @supports fallbacks) is OLD-ANDROID-2. Open it only if device data shows users on WebView 80-110 who cannot update.

read_first:
- node_modules/@capacitor/android/capacitor/src/main/java/com/getcapacitor/Plugin.java:102-110, PluginHandle.java:98-118, Bridge.java:225-235 and :699-711
- native/HealthConnectNativePlugin.java (all of it)
- index.html:53-111 and :160-191
- src/main.tsx:21-87
- scripts/screenshot-gate.mjs:5143-5158 (O1 block: __marcCrash('x') must still remove #launch and show "M/ARC could not start") and :255 (no crash screen after boot)
- tests/bug34.test.ts and tests/theme.test.ts (they pin index.html text; keep them passing unchanged)
- scratch prototype: (supervisor scratch) crash/adv-hc/fix/HealthConnectNativePlugin.java

write_scope:
1. native/HealthConnectNativePlugin.java. Move every android.health.connect.* and android.os.OutcomeReceiver use into one nested `static final class Api34` (optionally @androidx.annotation.RequiresApi(34)). That covers:
   - manager(), readRecords, readIfGranted, aggregateIfGranted and Holder;
   - both anonymous OutcomeReceiver classes;
   - the readSummary worker body, as a package-private `JSObject summary(...)` that the outer lambda calls inside its existing try/catch;
   - the getSystemService(HealthConnectManager.class) call in platformAvailable(), as a static Api34.available(Context) called only after SDK_INT >= 34;
   - ACTION_MANAGE_HEALTH_PERMISSIONS as a string literal or inside Api34.
   Rules:
   - Api34 members that the outer class calls are package-private, never private, so D8 adds no nest bridges.
   - Outer helpers that Api34 calls (hasHealthPermission, missingPermissions) are package-private.
   - Lambdas in the outer class capture no Api34-only types.
   - No logic change on API 34+.
   - The cp line in scripts/prepare-android.sh:21 does not change, because a nested class stays in the same file.
2. index.html, head classic script only, ES5 only:
   a. Feature probe. It sets window.__marcUnsupported to an array of missing ids, or null:
      - 'modules': !('noModule' in document.createElement('script'))
      - 'at': ![].at
      - 'animation': !(window.Animation && 'finished' in Animation.prototype)
      - 'color-mix': !(window.CSS && CSS.supports && CSS.supports('color','color-mix(in srgb, red, red)'))
   b. window.__marcUnsupportedShow(). It is idempotent and renders into #app, waiting for DOMContentLoaded if #app is missing. It removes #launch and sets #app data-unsupported="1" and data-crash-shown="1".
      - Inline cssText like the crash box (index.html:89), with literal colours only: no var(), inset, dvh or color-mix.
      - Copy: heading "WebView update"; line "M/ARC needs a newer Android System WebView."; a data line "WebView <Chrome major or ?> · <missing ids>"; one link-button "Open Play Store" to market://details?id=com.google.android.webview.
      - No Reset and no rescue buttons.
   c. The existing error and unhandledrejection listeners (:109-110) call __marcUnsupportedShow() instead of __marcCrash when __marcUnsupported is set.
   d. A capture-phase window 'error' listener. For a SCRIPT target before boot it calls __marcCrash(new Error('Could not load ' + src)), or the update screen if unsupported.
   e. A DOMContentLoaded handler: setTimeout 0, then if unsupported, show the update screen; else if !__marcBooted, call __marcCrash(new Error('App did not start')). No fixed timers.
   f. __marcCrash appends '\n\n' + navigator.userAgent to the <pre> text. The heading and buttons are unchanged.
3. src/main.tsx (supervisor-owned; smallest wiring, called out in the PR): line 22 `try {` becomes `if (!(globalThis as { __marcUnsupported?: unknown }).__marcUnsupported) try {`. Nothing else changes.
4. scripts/old-android-floor.mjs (new, single source of truth). Exports:
   - FEATURES: [{id, chrome, probe}] for the 4 features above;
   - FLOOR = max(FEATURES.chrome) = 111;
   - JS_APIS: tokens with Chrome versions, at least Promise.withResolvers 119, Object.groupBy/Map.groupBy 117, Array.fromAsync 121, Set union/intersection/difference/symmetricDifference/isSubsetOf/isSupersetOf/isDisjointFrom 122, URL.canParse 120;
   - CSS_TOKENS with versions: inset 87, translate:/scale:/rotate: 104, :has( 105, dvh/svh/lvh 108, color-mix( 111, linear( 113, subgrid 117, @starting-style 117;
   - ALLOW: per-site exceptions, each with a reason.
5. tests/old-android-native.test.ts (new; G1).
6. tests/old-android-floor.test.ts (new; G3).
7. scripts/screenshot-gate.mjs: ONE add-only block headed `// OLD-ANDROID-1:` (G4).
8. .github/workflows/build-apk.yml: ONE add-only step named "OLD-ANDROID-1 native API floor", placed after "Build debug APK" (G2). Never touch the signing, keystore or EXPECTED_SHA256 steps.
9. docs/ARCHITECTURE.md: the decision section above.

reserved_paths (do not change):
- native/wear/**, src/native/wearEngine.ts, src/slices/settings/WatchLab.tsx, and the Watch-lab row in Settings.tsx (watch agent);
- scripts/prepare-android.sh and native/patch_manifest.py (supervisor);
- package.json and package-lock.json: no new dependency. esbuild, typescript and playwright are already direct devDependencies;
- capacitor.config.json, vite.config.ts and tsconfig.json (unchanged by the decision);
- src/ui/styles.css, src/ui/primitives.tsx, src/escobar/**, src/brain/**, src/slices/** (OLD-ANDROID-2 scope);
- every other task's gate block and test.

acceptance (each criterion with its evidence):
- A1 On API 26-33, registering HealthConnectNativePlugin cannot throw. The outer class has no declared method or field descriptor that names an android/java class with api-since > 26, and 0 `android/health` constant-pool refs.
  Evidence: G1 (fails on HEAD at :70 and :224), G2 (fails on HEAD), device check D1.
- A2 Health Connect behaves the same on API 34+, and API < 34 still returns the existing "requires Android 14" result.
  Evidence: device check D3 on an Android 14+ phone, plus the reviewer's diff read showing the moved code is unchanged in logic.
- A3 Missing any FEATURE gives: the update screen within 1 s of DOMContentLoaded; #launch removed; no crash card and no [data-reset]; __marcBooted stays false; no 'marc.state.v1' written on a fresh context.
  Evidence: G4 probes P2-P6 (all fail on HEAD).
- A4 Features present but the entry never runs gives the crash card within 2 s of DOMContentLoaded, with navigator.userAgent in its <pre>.
  Evidence: G4 P7 (blank on HEAD).
- A5 No false positives: baseline boots; a slow entry never shows either screen; the O1 block and the :255 check still pass.
  Evidence: G4 P1, P8, and the full `npm run gate`.
- A6 The build stays within the floor (syntax, runtime APIs, CSS).
  Evidence: G4 S1-S3, plus G3 FLOOR === max(FEATURES), and index.html contains every FEATURES probe (fails on HEAD).
- A7 The index.html inline classic scripts stay ES5.
  Evidence: G3 (esbuild transform at target 'es5' succeeds).
- A8 The update screen copy matches write_scope 2b exactly. The heading is a 1-2 word noun phrase, per the AGENTS.md UI-copy rule.
  Evidence: G4 P2 text assertions, plus review.
- A9 Every existing check still passes: typecheck, test, test:tz, build, gate, tests/bug34 and tests/theme.
  Evidence: CI on a head with the latest main.
- A10 Release acceptance, tracked separately from the merge: the owner's old phone opens the app, or shows the update screen and then opens after updating WebView.
  Evidence: recorded device checks D1, D2 and D4 on the CI APK built from the merged commit.

verification: npm ci; npm run typecheck; npm test; npm run test:tz; npm run build; MARC_CHROMIUM=/opt/pw-browsers/chromium npm run gate. Before the fix, run G1, G3 and the G4 block on base HEAD and paste the failing lines in the PR. After the fix, paste them passing. G2 evidence is the CI run on the PR (red on a commit with only the step, green with the fix).

risk_and_recovery:
- R1 Floor 111 locks out WebView 80-110, possibly including Huawei WebView without GMS, whose Chromium base is unknown. Mitigation: the screen shows the WebView version and the missing ids, the owner's device check, and OLD-ANDROID-2 ready to lower the floor (the scratch fixes for .at and .finished already exist: refute-at/fixsim, adv-fin-r/fixsrc).
- R2 A probe misfires on a capable engine and locks everyone out. Mitigation: no eval; standard probes; G4 P1 baseline on the gate's Chromium; D3 on a current phone.
- R3 The refactor changes Health Connect behaviour. Mitigation: move code unchanged, then D3.
- R4 The ART reflection step is from memory. Mitigation: D1 on a real Android 8-13 phone or emulator.
- R5 Module scripts run before DOMContentLoaded (HTML spec, from memory). Mitigation: P8 proves no false positive on Chromium.
- Recovery: revert the PR. The tests and gate block are add-only.

return: PR (draft, then ready) on a claude/* branch with each A-criterion ticked to its evidence; HANDOVER note; G2 CI run link; list of any ALLOW entries with reasons.
```

## Gates

All four gates are named OLD-ANDROID-1 and are add-only. Each must fail on current main and pass after the fix, unless it is marked "forward guard".

G1 tests/old-android-native.test.ts (vitest, node; no Java needed; runs in npm test)
- Read native/HealthConnectNativePlugin.java, strip comments and string literals, and collect the simple names imported from android.health.connect.* plus OutcomeReceiver.
- Find `class Api34` and cut its brace-matched body.
- Assert that `class Api34` exists and that no collected name appears in the rest of the file outside import lines.
- Fails on HEAD: manager() at :70, aggregateIfGranted at :224, Holder/OutcomeReceiver use near :190 and :236, and there is no Api34. Passes after the refactor.

G2 build-apk.yml step "OLD-ANDROID-1 native API floor" (CI, after "Build debug APK"; Python inline like the RG-20 step; signing steps untouched)
- Class list: MainActivity plus every class named in a registerPlugin(...) call in native/MainActivity.java (HealthConnectNativePlugin, NativeUiPlugin, watch/WatchBridgePlugin). Find their compiled .class files under android/app/build/intermediates/javac/** (the AGP path varies, so find them; fail if any is missing).
- (a) `javap -p -s`: every L<type>; in every declared method and field descriptor that exists in $ANDROID_HOME/platforms/android-<compileSdk>/data/api-versions.xml must have since <= 26. Fail with class, member and type. The location of api-versions.xml is from memory and unverified; the step must FAIL, never skip, if the file is missing.
- (b) `javap -v` on the outer HealthConnectNativePlugin.class: the count of 'android/health' must be 0. HEAD has 107 refs and 2 bad descriptors (adv-hc verdict).
- Fails on HEAD; passes after.

G3 tests/old-android-floor.test.ts (vitest, node; runs in npm test)
- (a) FLOOR imported from scripts/old-android-floor.mjs equals the max FEATURES chrome value.
- (b) The index.html head script contains each FEATURES probe string and defines __marcUnsupportedShow and a DOMContentLoaded handler.
- (c) The update-screen markup string has no 'data-reset'.
- (d) Every inline classic <script> in index.html transforms with esbuild.transformSync(code, {target:'es5'}) without error. Confirm (d) passes on today's scripts first; it is the ES5 guard.
- Fails on HEAD through (a)-(c), since the module and the probes are absent.

G4 scripts/screenshot-gate.mjs block `// OLD-ANDROID-1:` (runs in npm run gate after build in CI). Each probe uses a fresh context; the tampering goes in addInitScript or page.route.

Probes:

| Probe | Setup | Expected after the fix | Result on HEAD |
|---|---|---|---|
| P1 baseline | none | __marcBooted true; no [data-unsupported]; no "could not start" | passes |
| P2 below 61 | delete HTMLScriptElement.prototype.noModule; route index.html with type="module" rewritten to type="module-off" | [data-unsupported] within 3 s; #launch gone; no [data-reset]; localStorage 'marc.state.v1' absent; text has "WebView update" and "WebView " plus a version | FAILS (blank #app) |
| P3 61-79 | delete Array.prototype.at; route the entry chunk with "const a = ;" prepended | update screen, no crash card | FAILS (crash card with Reset) |
| P4 80-91 | delete Array.prototype.at | update screen; not booted; no 'marc.state.v1' | FAILS (boots) |
| P5 80-83 | delete Animation.prototype.finished | update screen | FAILS (boots; a sheet close would freeze) |
| P6 92-110 | wrap CSS.supports to return false for color-mix | update screen | FAILS (boots) |
| P7 entry 404 | features intact; route the entry to 404 | "M/ARC could not start" within 2 s of DOMContentLoaded; <pre> contains navigator.userAgent | FAILS (blank) |
| P8 slow entry | route delays the entry 8 s | neither screen at 2/5/7 s; boots afterwards | passes (false-positive guard) |

Scans (forward guards; they pass on HEAD at FLOOR 111, so the builder confirms and records them):
- S1: every www/assets/*.js gives the same output from esbuild.transformSync(code, {target:'chrome'+FLOOR}) and {target:'esnext'} (minify off). Verifier data: chrome91+ already gives 0 changes.
- S2: no JS_APIS token with chrome > FLOOR in the built chunks unless it is listed in ALLOW with a reason.
- S3: no CSS_TOKENS token with chrome > FLOOR in the built CSS outside an @supports block. linear( is inside @supports at styles.css:51.

Before/after proof required in the PR: G1, G3, G4 P2-P7 and G2 red on base, green on the fix commit.

Not adopted as a gate (supervisor's call): an emulator smoke job (API 26/30/33: am start -W, fail on FATAL EXCEPTION or NoClassDefFoundError in logcat, or if the process is dead after 10 s). It is the only automated proof of A1 on real ART, but it costs CI time. Device check D1 covers it for this release.

## Device checks

Ask the owner once, in the same message as the next APK (owner-chat rule: APK link, what changed, what to check).

Ask now, on the old phone that fails:
1. Phone model, and Android version (Settings > About phone > Android version).
2. Android System WebView version: Settings > Apps > menu > Show system apps > Android System WebView, version at the bottom. On Android 7-9 also give the Chrome version. On a Huawei, say whether Google Play is installed and give the "Huawei WebView" version if listed.
3. What exactly happens when he taps the icon. A screenshot if anything shows.
   - It closes at once, or "M/ARC keeps stopping": native crash, cause 1.
   - The logo, then a black screen that stays: WebView 60 or older, cause 3.
   - An "M/ARC could not start" screen: WebView 61-79, cause 2.
4. Optional, only if he has a computer with adb: `adb logcat -d | grep -E "FATAL|AndroidRuntime|NoClassDefFound|Capacitor"` right after a failed launch.

After the OLD-ANDROID-1 APK (record each result with the APK commit sha):
- D1, old phone (Android 8-13): swipe M/ARC away and open it cold 3 times. Pass: it opens to Today or shows the "WebView update" screen, and it never closes by itself. This is the real-ART proof of A1.
- D2, if the update screen shows: note the WebView number on it, tap "Open Play Store", update Android System WebView (and Chrome on Android 7-9), reopen M/ARC. Pass: the app opens. This also checks that the market:// link opens from the Capacitor WebView, which is unverified.
- D3, the newer Android 14+ phone: open the Health section in Settings, connect or sync. Pass: same permissions flow and same step, calorie, sleep and resting-heart-rate numbers as before. This is the A2 check.
- D4, old phone, once the app is open: close the first-run "Your details" sheet with X; open Settings and close it; do and finish a short weighted workout. Pass: no freeze, and the workout appears in History. This confirms the gate let in only a capable WebView.

## Open questions

1. ART behaviour (from memory, unverified): getDeclaredMethods() throws NoClassDefFoundError for a missing signature type. D1 settles it.
   - If the current main APK opens fine on an Android 8-13 phone with an updated WebView, cause 1 is refuted for that phone.
   - Then the web causes become the explanation, and the WebView version from the device answers it.

2. The owner's device data is unknown: model, Android version and WebView version. Every link from cause to report other than cause 1 depends on it.
   - **Owner, 2026-10-17 ~16:05 UTC:** "Android version 12 / Android version13 / Etc. Different phones cause they are the one involved in beta test on pkaystore". So the reports come from the Play closed-test testers' phones on Android 12 and 13, which is cause 1's range (8-13). The closed test was released with bundle 37.1.0.55 (main `bf0a916`, 10-03), which predates the native fix (OLD-ANDROID-1a, train 17 `277bd6d`, first Play bundle 37.1.0.103). The newest bundle with both halves of the fix is 37.1.0.107 (versionCode 37000107, main `49a2853`, Play bundle run 39010087902, artifact MARC-PLAY-AAB-UPLOAD-SIGNED 12092871150). Uploading it to the closed-test track is the owner's step; the testers then run D1 (and D2/D4); WebView versions are still unknown.

3. Huawei WebView's Chromium base is unknown, and Huawei users are in scope (App ID at build-apk.yml:252).
   - If no-GMS Huawei phones report a WebView below 111, open OLD-ANDROID-2 to lower the floor to 80.
   - Its contents: replace the 16 .at(-1) calls with slice(-1)[0] or a last() helper; add an animDone helper at the 14 .finished sites (with a once-guard, see History.tsx:118); add CSS @supports fallbacks, since a plain fallback before color-mix with var() is discarded.
   - Scratch fixes exist under (supervisor scratch) crash/refute-at/fixsim and .../adv-fin-r/fixsrc.

4. Does market://details?id=com.google.android.webview open from inside the Capacitor WebView? Capacitor's external-intent handling is from memory. D2 settles it; if it fails, use the https Play URL.

5. Does $ANDROID_HOME/platforms/android-<compileSdk>/data/api-versions.xml exist on the GitHub runner (from memory)? The builder confirms on the first G2 run, and the step fails if the file is missing.

6. Supervisor decisions:
   - whether to add the emulator smoke job (API 26/30/33);
   - whether to split OLD-ANDROID-1 into native and web lanes;
   - the collision check against open cards touching index.html, src/main.tsx, native/HealthConnectNativePlugin.java and build-apk.yml.

7. Not in this card, found on the way: WatchService.notification() uses the adaptive R.mipmap.ic_launcher as its small icon (WatchService.java:246). Android 8.0 may reject that with "Bad notification posted" when a watch connects (from memory, unverified). Candidate card for the watch or supervisor lane. native/watch/** is not on the watch agent's reserved list, but coordinate with that agent.

8. Facts recalled from memory, high confidence but unverified here:
   - factory WebView versions per Android release;
   - the Chrome version each feature arrived in: modules 61, ?./?? 80, finished 84, inset 87, .at 92, dvh 108, color-mix 111;
   - Android 8/9 WebView updates ending around Chrome 138.
