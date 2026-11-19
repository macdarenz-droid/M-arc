# UI/native coverage ledger

Main commit: `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`. `coverage.json` lists every tracked path in the assigned directories, named source functions and JSX event-handler locations. The automatically enumerated functions/handlers are navigation aids, **not** evidence that each function or button was executed. File-level source review does not prove all behavior correct. Tests run by the root reviewer are recorded in the consolidated audit, not invented here.

## Screen/action trace

| Surface | Functions/actions traced | Evidence and limitations |
|---|---|---|
| Today | greeting, primary session card routes, resume/start/view, schedule/rest state, recovery card, muscle click, Sparks/settings, insights/pins | Full component source; exact renderer ready/full boundary probe. Training/readiness/insight calculations delegated to brain. |
| Train | gym/split selection, rename inputs, start/pause/resume/finish, exercise expand/options, set input commit/blur, warmup controls, add/remove/reorder, notes draft/undo, substitutions, past entry | Source review extended through remaining start/split/past/finish/banner sections; parent browser exercised Start Push, Options Enter versus pointer, and saved 20 kg × 8 ideal set. Brief rest exit after save explained by last-frame exit animation; no defect claimed. Session reducer/progression correctness belongs to brain; not every mode/button was browser-exercised. |
| Exercise picker | search/filter, muscle/equipment filters, custom-exercise creation, duplicate/name validation, selection callbacks | Source reviewed; no complete mobile keyboard/screen-reader run. |
| History/log | calendar/day selection, session expand/Edit/Share, set deletion, mode-specific editor fields, save provenance | Source reviewed; exact SessionEditor synthetic distance-edit probe. Parent confirmed expand card has no role/tabindex and pointer reveals note/set; recorded UI-N19-07. Normal weighted edit 20 kg × 8 → 20 kg × 9 persisted in browser. |
| History/stats | weekly volume, chart pointer/keyboard scrubbing, exercise selection, trend series/readouts, record pagination, effort bars | Source reviewed including final Stats section; underlying series/record math delegated to brain. No pixel/gesture/keyboard chart acceptance run. |
| Body | recovery grid/list/details, trained/ready/full labels, soreness/fresh marks, body measurement inputs, explanatory copy, level/weekly detail | Source reviewed; brain owns model/calibration math and research. Parent browser 375 px viewport/body 360 px; invalid waist40/neck90 disables Save; height180/neck40/waist90 shows18.4%. Body distinguishes ready/full; Today is inconsistent. |
| Coach | profile and model evidence links, readiness and recommendation cards, suggestion actions and acceptance/dismissal | Full component/action source including remaining hidden-note and Coach-data rows reviewed; feedback/undo mutations reviewed. Brain owns policy/math; Escobar tool actions reviewed separately. |
| Profile/onboarding | unit-sensitive entry, bodyweight logging, profile/history change, goal/training age/time availability, dismiss/defer/held form progression | Source reviewed; onReplace integration reviewed with core owner. No complete restore/reset/onboarding browser matrix. |
| Settings | preferences, theme choice, units, haptics, health connect/diagnostic, watch, reminders, backup/import/reset/undo, rescue state | Full Settings, backup/parser/restore, export CSV, health/reminder/watch/diagnostic sources reviewed. Root additionally owns storage/security integration and real browser dialogs. Weekly backup replacement reconciliation remains open. |
| Gyms | local gym list, selection/rename, equipment settings, live-session active gym choice | Full GymsSheet, Train GymSheet and unit/gym mutations reviewed. Current local gym management is not a deployed geographical Gym Finder map; the design/handoff is separate. No provider/geolocation query performed. |
| How-to | HowToSheet lifecycle, asynchronous plate loading/cache, PlateView context, posture/frame selection, Feel overlay, ZoomHost | All runtime section/controller/event/registry/lazy-loader files reviewed, including Hand/LookCloser/Setup/Risks/HandlingMistakes, Feel controller, event cleanup and lazy rejection. Generated exercise instructions/plates and hundreds of CSS/data assets inventoried, not individually clinically or visually validated. No claim that every exercise illustration is safe/correct. |
| Sharing | ShareSheet choice/state, lazy load, PNG generation, share/seen behavior, card data/SVG rendering | Full source reviewed, including modes, date boundaries, escaping, layouts and theme palette mapping. Period-card session count includes warmup-only sessions; sent to brain's shared completion-semantics finding. No native share intent, font/image rendering pixel verification or actual external share. |
| Shared UI | Card/Row/Button/Field, Sheet focus/stack/back behavior, held button/number inputs, chart controls, gesture helpers and pending indicators | primitives, sheet stack, gesture tracker and reorder hook source reviewed. CSS/icon paths not exhaustively read. Nested Options and pointer-only History expansion confirm shared keyboard support alone is insufficient. |
| Themes | token application/engine, catalog structure, 5-theme compatibility, future theme assumptions | Engine and entire catalog source reviewed; styles targeted. Parent tested all five applied pressed states/body colors and 1280px horizontal overflow. No complete contrast audit or future-theme guarantee. |
| App/routes/errors | five-tab routing, parameter validation, panel rendering, sheet unwind, scroll memory, consent/loading sheets, launch gating, shared ticker, crash rescue/reset | Source reviewed. Emergency reset is origin-wide; conditional sibling-app isolation risk recorded with SW cleanup. Root browser opened Escobar consent without enabling; zero browser error logs reported. No destructive crash reset executed. |

## Native/offline trace

| Area | Functions/state transitions reviewed | Evidence and gaps |
|---|---|---|
| Notifications | permission/channel caching, per-family sequence, cancel/schedule, rest/training/backup reconcile, taps, exact alarm checks | Exact module probes for distinct same-ID stale payloads. Current cancellation protections observed. Real OS scheduling order, permission denial and delivered notification unverified. |
| Health Connect | capability/plugin discovery, permissions, missing/failed reads, daily timestamp handling, main sleep/awake overlap, calorie migration, foreground/background sync and generation guard | JS and Java source reviewed. Actual source cross-tab replacement probe establishes stale-data acceptance through store omission. Android version/provider, permission UX and physical records not exercised. |
| BLE watch/current main | scan/connect/permission handling, GATT queue, HR packet parser, session capture, freshness/aging, background service/lifecycle, wrapper listeners | JS/Java source reviewed. No watch pairing, packet capture, battery request timeout, radio loss/reconnect, OS process kill or vendor-device verification. [Android GATT guidance](https://developer.android.com/develop/connectivity/bluetooth/ble/transfer-ble-data) used as platform reference. |
| Native shell/wake | bridge registration, old-Android isolation, Android back/keyboard/insets, keep-awake grant/release, activity shutdown, haptic fallback, privacy rationale and manifest permission patching | Source reviewed, not Android compiled/device run by this reviewer. Signing/release settings untouched. |
| Share/photo/file picker | web/native fallback, MIME/URI handling, cancellation/error return contracts | Source reviewed; real provider/content URI and permission/picker interactions unverified. |
| PWA | install assets, activation/carry/deletion, fetch fallback, update listener and visibility hooks | Exact worker synthetic CacheStorage activation probe confirms cross-app cache deletion. Navigation 5xx fallback present. Full installed PWA/old-tab/offline/update browser sequence not run. |

## Prior issue reassessment

| Prior lead | Current evidence | Status |
|---|---|---|
| UI keyboard primitives/reorder | Card/Row keyboard handling and explicit reorder controls present; nested Train Options fails Enter | Partial; do not mark all keyboard work resolved |
| History edit provenance | Weight/reps/effort/duration comparison exists; distance omitted and probe preserves live fidelity | Partial/open for distance |
| Ready/full recovery wording | Body separates full timeline; Today says fully recovered at95% | Partial/open on Today |
| IMP-N01 native scheduling race | Sequence/cancellation checks exist; same-ID distinct payload mock loses latest intent | Partial; physical occurrence unverified |
| IMP-N02 health after replacement | Explicit replacement increments generation; storageMovedOn path does not; actual source accepts stale health | Partial; parent's core finding |
| Weekly backup restore synchronization | afterReplace resyncs training only | Open; static source trace |
| Offline HTTP5xx fallback | Source now returns cached app for transient server errors | Present fix; not end-to-end regression-certified here |
| Native Health Connect units/day/sleep fixes | Current mapping handles timestamp provenance, main sleep and old calorie migration | Present fixes; provider/physical-device verification still absent |
| Shared number editing/set notes/active gym | Commit-aware numeric inputs, note-draft flush/undo lookup and active-session gym binding present | Source improvement observed; no blanket resolved claim for all cases |

## PR #221 limits

Separate reviewed head `567a27e5130cc4f613cb4225f618623a156a5bbe`, not merged main. Selected `watchLink.ts`, workout command receipts/revisions and `wearEngine.ts` were read. This is partial source inspection of a large watch implementation. No full PR approval, device interop, watch runtime build, production deployment or signed-artifact verification. Root owns exact PR inventory and broader changed-file ledger.

## Execution and publication boundaries

Scratch evidence only: `probes.mjs`, `probe-results.json`, `build-coverage.mjs`, `coverage.json`, this ledger and `findings.md`. Probe-generated bundles are derived production code and should remain scratch rather than published evidence. `probes.mjs` uses actual source extraction/bundling, synthetic hook state, synthetic storage, a mocked Capacitor boundary and synthetic CacheStorage. No real health records, user identifiers, notifications, paid AI/API calls or external messages.

Unfinished verification remains explicit: all generated how-to content/assets, every chart/touch state, all accessibility/contrast/zoom permutations, screen readers, physical Android/iOS/watch lifecycle, native permissions/share/photo pickers, offline installation/update, all unmerged watch implementation and production provider behavior. These gaps prevent describing the entire app or every button as proven correct.
