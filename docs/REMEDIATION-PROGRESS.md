# Remediation progress
Resume from this file and docs/REMEDIATION-PLAN.md. Never re-derive finished work.
Branch: claude/marc-r0-remediation-ast5xs (from claude/marc-regression-architecture-gegkbq, escobar 138edd6 merged) · Baseline: 589 app tests / 50 worker tests

## Owner answers
D1: done (R0.0, key 05:66:9A…F1:F5) · D2–D15: default

## Owner actions (collected; STOP once at the end)
- [ ] R0: dispatch "Deploy Escobar Worker", confirm /health quotas:true
- [ ] R0: if the deploy fails because Durable Objects are unavailable, run `npx wrangler kv namespace create QUOTA` and bind `QUOTA` in wrangler.toml
- [ ] R0.0: keep the encrypted key backup → add the new fingerprint in AppGallery Connect → backup, uninstall, reinstall, restore → delete SECRETS_WRITE_TOKEN and the `marc-debug-signing-v1` caches

## Phase R0 — done (agent side); owner deploy pending
### Layer: worker — done, commit f7c2ff6 — IDs: PL-01, PL-05, PL-06, PL-07, PL-12, PL-14
- QuotaCounter Durable Object (sync kv), quota.ts DO → KV → none, recordStep every step, RATE_IP, 413/byte checks, effort-only system messages refused, 48 KB system cap, policy sentence, abort on disconnect, one log line per step.
- PL-06: validate.test.ts and anthropic.test.ts assertions that accepted effort-only messages updated (they encoded the bug).
### Layer: CI — done, commit f863b6b — IDs: PL-11, PL-19/PL-02 (R0.8)
- deploy-worker.yml: push to main (paths filter kept) + workflow_dispatch; `npx --no-install wrangler deploy` with wrangler 4.136.3 pinned exactly in escobar-worker/package.json + lockfile; /health step fails unless protocol 2, key:true and quotas:true.
- release-apk.yml: MARC_ANDROID_* replaced by MARC_SIGNING_KEYSTORE_B64 / MARC_SIGNING_STORE_PASSWORD, alias `marc`, same EXPECTED_SHA256 assertion as build-apk.yml, keystore grep added. Signing step of build-apk.yml untouched.
- `wrangler deploy --dry-run` bundles and lists QUOTA_DO, RATE, RATE_IP (local check, no deploy).
### Layer: tests — done, commit 149e7e7 — worker 50 → 66
- New test/quota.test.ts: 5 concurrent DO adds sum exactly; alarm cleanup; scope mapping; DO → messages; tool_use step = steps 1 / turns 0; rotating device ids from one IP → 429 via RATE_IP; per-IP daily cap; one log line, no device id/content; health quotas:true.
- handler.test.ts: content-length 3_000_001 → 413 without reading the body or making the client; UTF-8 byte size; cancelled body aborts the model stream within 50 ms (mutation-checked: fails without the fix).
- validate.test.ts: effort-only refused; 48 KB system cap in bytes; cache_control on user text refused.
### Layer: gate — done
- `npm run check`: 589 passed · worker `npm ci && npm run check`: 66 passed · `npm run build && npm run gate`: PASS (5 themes, legacy import, escobar, palace).

### R0 report
- Built: QuotaCounter DO (sync kv, per UTC day, 3-day alarm cleanup) with KV fallback; RATE_IP; per-IP and global-output daily caps; every step recorded; abort on disconnect (enable_request_signal + writer.closed); 413 on content-length and UTF-8 bytes; effort-only system messages refused; 48 KB system cap; policy sentence; one log line per step; deploy on main + dispatch with wrangler 4.136.3 pinned and quotas:true health check; release-apk.yml on MARC_SIGNING_* with the fingerprint assertion.
- Tested: see layers above.
- Decided by research: DO with synchronous kv (no await between read and write); abort detection via writer.closed instead of waiting for the 10 s heartbeat; brief cap 48 KB (BRIEF_CAP 3000 chars × UTF-8 ≤ 12 KB, so 48 KB is the larger bound).
- Needs device check: Escobar chat still streams after deploy; a closed chat stops billing (watch `wrangler tail` for the step log with stop_reason null).
- Next dependency: R1 (store hardening) is independent of R0 and can start now. Two consecutive APKs signed 05:66… are produced by CI on this branch's push (build-apk.yml unchanged).
(skipped / not reproduced: none)

## Phase R1 — in progress
### Layer: core/store — done, commit 4f4cc86 — IDs: ST-01, ST-10, ST-11, ST-19, RG-02, ST-09
- Quarantine to `marc.state.v1.corrupt` (main) and `marc.state.v1.backup.corrupt` (backup, when source is fresh/legacy); `bootRecovered` signal; `rescueRaw()` / `deleteRescueCopy()`.
- persistNow: main write first, quota → drop backup + retry once; backup = previous good raw on the first save of each local day (`marc.state.v1.backupDay`), best-effort.
- `repairState()` exported (deep repair + dropped count); normalize = repair + fill + RG-02 lb backfill (raw has no `units`, lb user).
- storage listener for other tabs; toast when the local active session differs.
- convertLegacy: lb → lb gym (ST-09) and the same lb backfill (decided: v36 loads carry the same 0.25 kg rounding; the round-trip check makes it a no-op otherwise).
### Layer: app shell (crash containment) — done — IDs: ST-02, RG-01, ST-15, ST-14, UI-05, ES-29
- index.html: `__marcBooted` gate, plain copy, "Save a copy of my data" (inline rescue, duplicated from src/core/rescue.ts on purpose), reset needs confirm().
- main.tsx: ErrorBoundary around App, booted flag, late error/rejection toast throttled to 10 s. New src/app/ErrorBoundary.tsx, src/core/rescue.ts.
- Lazy import catches: App EscobarMount, ui/open.ts, SettingsSection reset, Composer attach.
- router.validatePanelParams + showPanel refuses a panel without its required param; goTo validates view/seg; executor navigate keeps only view/seg/muscle/exerciseId/sessionId and rejects a bad muscle; MuscleDetail guards itself.
