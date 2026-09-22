# Coaching implementation progress

Resume from this file, `docs/COACHING-DECISIONS.md` and `docs/COACHING-PLAN.md`. Never re-derive finished work — check "Items done" first.

**Phase order**: P0 → P0-P → P1-R → P2-C → P1 → P2 → P3 → P4.
**Layer order inside a phase**: data model → brain → native → UI → gate. Commit at each layer, push at end of phase.

## Current phase: P0 (Close the loops)

Sections read: "How to use this document", 0, 7, 8, 6.6, 6.7, 6.12.1 (see COACHING-DECISIONS.md for why most of 6.12.1's gaps are deferred to P1-R).

### Layer: data model — DONE
- `src/core/models.ts`: `Profile.birthYear?`, new `DailyHealth` interface (P0 subset, see decisions), `AppState.healthDays: DailyHealth[]`, default `[]` in `freshState()`.
- `src/core/store.ts`: `normalize()` defaults `healthDays: s.healthDays ?? []`.
- Committed.

### Layer: brain — N/A for this phase
No pure brain module is required by P0's acceptance criteria (section 7). Recorded, not skipped by oversight.

### Layer: native — IN PROGRESS
- `src/native/health.ts` rewritten: `HealthSummaryRaw`, `mapHealthSummary()` (pure, tested), `syncHealth()` (calls `readSummary`, requests permission once via `requestPermissions`/`openPermissions`, retries).
- `native/HealthConnectNativePlugin.java`: added `@Permission(alias="health", ...)`, `requestPermissions()` `@PluginMethod`, `healthPermissionsCallback()` `@PermissionCallback`.
- `.github/workflows/build-apk.yml` and `release-apk.yml`: copy `MainActivity.java`, `HealthConnectNativePlugin.java`, `PermissionsRationaleActivity.java` into the generated package dir; run `native/patch_manifest.py`; verify step checks the plugin file exists and the manifest has `READ_HEART_RATE`.
- Tests: `tests/health-bridge.test.ts` (mapping, permission-denied → null, zeros → undefined) — passing.
- Not yet committed as its own layer commit — will commit next.

### Layer: UI — NOT STARTED
Plan:
- New `src/slices/settings/health.ts` (mirrors `reminders.ts`): `syncAndStoreHealth()` — calls `syncHealth()`, upserts into `state.healthDays` by day (cap 180), updates the `health` mirror for Settings' existing display.
- `src/main.tsx`: call `syncAndStoreHealth()` on `pageshow` and on boot (same pattern as `resyncReminders`).
- `src/slices/workout/session.ts` `startSession()`: call `syncAndStoreHealth()`.
- `src/slices/settings/Settings.tsx`: keep the manual Sync button (calls `syncAndStoreHealth()` now instead of the old `readHealth`/`update` inline); add a Birth year field next to weight/height.
- `src/app/selectors.ts` `insights`: fix W3 — pass `now: nowMs.value - (nowMs.value % 60_000)` instead of `Date.now()`.

### Layer: gate — NOT STARTED
No new screens in P0; existing `settings` screenshot already covers the changed section. Run `npm run gate` once at the end of the phase to confirm still green; no fixture changes expected.

## Blockers / needs device check
- None yet for P0. The permission-request flow (`requestPermissionForAlias`) cannot be exercised without a real Android 14+ device running the built APK — **needs device check**: install the CI-built debug APK on Marc's phone, open Settings → Health, tap Sync, confirm the system Health Connect permission picker appears (not just the "manage permissions" screen), grant it, confirm the Sync button then shows "Last sync" with real values.

## Not started
P0-P, P1-R, P2-C, P1, P2, P3, P4.
