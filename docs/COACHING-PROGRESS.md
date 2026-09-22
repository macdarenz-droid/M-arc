# Coaching implementation progress

Resume from this file, `docs/COACHING-DECISIONS.md` and `docs/COACHING-PLAN.md`. Never re-derive finished work — check "Items done" first.

**Phase order**: P0 → P0-P → P1-R → P2-C → P1 → P2 → P3 → P4.
**Layer order inside a phase**: data model → brain → native → UI → gate. Commit at each layer, push at end of phase.

## Phase P0 (Close the loops) — DONE

Sections read: "How to use this document", 0, 7, 8, 6.6, 6.7, 6.12.1 (see COACHING-DECISIONS.md for why most of 6.12.1's gaps are deferred to P1-R, matching section 7's own phase table).

### Layer: data model — done, commit 9cac29d
- `src/core/models.ts`: `Profile.birthYear?`, new `DailyHealth` interface (P0 subset — see decisions), `AppState.healthDays: DailyHealth[]`, default `[]` in `freshState()`.
- `src/core/store.ts`: `normalize()` defaults `healthDays: s.healthDays ?? []`.

### Layer: brain — N/A for this phase
No pure brain module is required by P0's acceptance criteria (section 7).

### Layer: native — done, commit e686cd3
- `src/native/health.ts` rewritten: `HealthSummaryRaw`, `mapHealthSummary()` (pure, tested), `syncHealth()`.
- `native/HealthConnectNativePlugin.java`: `@Permission(alias="health", ...)`, `requestPermissions()`, `healthPermissionsCallback()`.
- `.github/workflows/build-apk.yml`, `release-apk.yml`: copy the three native Java files, run `patch_manifest.py`, verify plugin file + manifest permission.
- `tests/health-bridge.test.ts`: 3 tests, passing (`npx vitest run tests/health-bridge.test.ts`).

### Layer: UI — done, commit e7c79cb
- `src/slices/settings/health.ts` (new): `syncAndStoreHealth()`.
- `src/main.tsx`: sync on boot and `pageshow`.
- `src/slices/workout/session.ts`: sync on `startSession()`.
- `src/slices/settings/Settings.tsx`: Sync button uses the new path; added Birth year field.
- `src/app/selectors.ts`: `insights` uses the minute-quantised `nowMs` clock instead of raw `Date.now()` (W3).

### Layer: gate — done, no fixture changes needed
- `npm run check`: **PASS** (typecheck, 42 tests across 9 files including the 3 new ones, production build).
- `npm run gate`: **PASS** — "Screenshot gate PASS: 5 themes, no page errors, legacy import verified." No new screens in P0, so no fixture/screenshot changes were required.

### Needs device check (not a stop condition, just can't be verified from here)
- Install the CI-built debug APK on Marc's Android 14+ phone. Settings → Health → Sync. Confirm the **system Health Connect permission picker** appears (not just the "manage permissions" screen) — this exercises `requestPermissionForAlias` end to end, which only a real device/OS can do. Grant it, confirm Sync then shows "Last sync" with real step/HR/sleep numbers, and that a second app open (or a new session start) updates it again without re-prompting.

### P0 report
- **Built**: `DailyHealth`/`healthDays` in models+store; `mapHealthSummary`/`syncHealth` in native/health.ts; `requestPermissions`/`healthPermissionsCallback` in the Java plugin; CI copy+patch+verify in both workflow files; `syncAndStoreHealth` in slices/settings/health.ts wired into main.tsx (boot, pageshow) and session.ts (`startSession`); Settings.tsx Sync button and birth year field; selectors.ts insights clock fix.
- **Tested**: `npx vitest run tests/health-bridge.test.ts` → 3 passed. `npm run check` → typecheck clean, 42/42 tests passed, build succeeded. `npm run gate` → 5/5 themes, no page errors.
- **Decided by research**: Capacitor `@Permission`/`requestPermissionForAlias` pattern for Health Connect permission request (not the Jetpack `PermissionController` contract) — see COACHING-DECISIONS.md.
- **Needs device check**: permission-picker flow on a real Android 14+ device (see above).
- **Depends on this for later phases**: P1-R's fidelity classifier and `trainedAt`/`weightLog`/`trainingSince` additions (6.12.1's remaining gaps) build on this same `models.ts`/`store.ts` pattern; P1's WatchBridge plugin follows the same CI-copy pattern now proven for the health plugin; P2/P3 readiness work reads `healthDays`.

## Next: Phase P0-P (Profile and goal) — NOT STARTED
Sections to read next: 6.14, 6.15, 6.16.

## Not started
P0-P, P1-R, P2-C, P1, P2, P3, P4.
