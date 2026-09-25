# Agent rules: read this if the "Agent guard" check failed or warned

Two agents work on this repo **at the same time**, and a supervisor session (Claude, acting for the owner while he is away) checks every push:

| Agent | Branch | Owns |
|---|---|---|
| Remediation (Claude Opus) | `claude/marc-r0-remediation-ast5xs` (phases R0–R8 of `docs/REMEDIATION-PLAN.md`) | everything in the plan |
| Watch companion (GPT/Codex) | `codex/gt6-gate-a-watch-lab` (Gates A–E of `docs/WATCH-ARCHITECTURE.md`) | `native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`, its Watch-lab row in `Settings.tsx`, and its lines in the CI workflows |

## Why you are being watched

1. **One signing key, registered with Huawei.** Every APK must be signed `05:66:9A:D2:72:1C:6A:BA:F9:FD:D4:B9:B8:4E:2F:B7:94:48:44:B1:DE:F3:59:84:5F:01:5F:2B:67:CA:F1:F5`. Wear Engine (App ID `119100049`) accepts only that fingerprint, and a different key cannot update the owner's installed app. Before 2026-09-23, every CI build used a random key and the registered one was lost (finding PL-19). The guard makes sure that never happens again.
2. **The repo is public.** Anything committed is public: keystores, `agconnect-services.json`, the Huawei app secret, tokens.
3. **Both agents edit the same CI files.** `build-apk.yml`, `release-apk.yml` and `native/patch_manifest.py` carry both agents' lines, and a careless merge silently deletes the other agent's work.
4. **`main` deploys production.** A push to `main` that touches `escobar-worker/**` deploys the live Escobar Worker. Only the owner merges into `main`, through pull requests.

## The rules, and how to fix a failure

| Guard message | Fix |
|---|---|
| **Signing step removed**, **Fingerprint changed**, **Release fingerprint changed** | Restore the steps "Decode the permanent signing key", "Sign with the permanent key and verify the fingerprint" and the `EXPECTED_SHA256` value exactly as on `origin/main`. Never rotate, regenerate or replace the key. |
| **Keystore committed**, **Key file committed** | Remove it (`git rm --cached`), add it to `.gitignore`, and tell the owner, because it is public now. Read keys only from secrets. |
| **Watch agent outside its files** | The watch branch must not change `escobar-worker/`, `src/escobar/`, `src/brain/` or the remediation docs. Revert those paths to `origin/main`. If the watch genuinely needs a change there, write it down for the owner instead. |
| **Remediation agent in watch files** | The remediation branch must not change `native/wear/**`, `src/native/wearEngine.ts` or `WatchLab.tsx`. Revert those paths. |
| **Gate B files touched** (warning) | `session.ts`, `models.ts` and `store.ts` are allowed for Gate B only, built on the R2.8 identities already on `main` (`ActiveSession.id`, entry `id`, set `id`, set `status`). Do not create a second id scheme. |
| **Behind main** (warning) | `git fetch origin main && git merge origin/main`. Keep both sides of every conflict, and never drop the signing steps or the other agent's CI lines. |

Also: never push to `main` or `claude/escobar-v2-implementation-eidx64`, never deploy the Worker yourself, and never skip or loosen a test or a guard check to get green.

## Current action items (2026-09-23)

**Watch agent (`codex/gt6-gate-a-watch-lab`):**
1. Your branch is about 36 commits behind `main`. Remediation R0–R3 was merged into `main` (PR #4). Merge `origin/main` now.
2. There is one expected conflict, in `.github/workflows/release-apk.yml`. Keep both sides: your step "Verify release native classes" goes immediately **before** main's "Decode the permanent signing key". Keep `python3 native/wear/prepare_android.py`, the `WearEnginePlugin` plugin check and the `wear/WearEnginePlugin.java` file check. Main's release signing (`MARC_SIGNING_*`, `EXPECTED_SHA256`) replaces the old `MARC_ANDROID_*` block entirely.
3. `Settings.tsx` merges cleanly (remediation changed restore and reset; your Watch-lab row stays).
4. Gate B is now unblocked, because R2 is on `main`. Build the command receipts and revisions on the R2.8 ids. Every Wear Engine promise needs a `.catch()`: `main` now has an ErrorBoundary and a boot-only crash box, but unhandled rejections still show a toast.

**Remediation agent (`claude/marc-r0-remediation-ast5xs`):**
1. Merge `origin/main` (the PR #4 merge commit) before the next phase push.
2. When the watch branch's CI lines arrive through merges, keep them (`prepare_android.py`, the WearEnginePlugin checks, `check_apk.py`).
3. Worker changes go live only through `main`. Keep `/health` reporting `key`, `quotas` and `relay` as `true`: the deploy fails otherwise.

## What the supervisor does

- It checks every push against these rules and every CI run on `main` and both branches. It also polls the live Worker's `/health`.
- A failed guard must be fixed in your next commit.
- If a rule is broken again, or a push endangers the signing key, secrets or user data, the supervisor stops that agent's session and reports to the owner.
