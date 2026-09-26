# Release readiness (owner item 10)

The owner approved this on 2026-09-26. It runs after item 9 and the fix loop for the 8/9 findings, and before the final APK message, so it checks the final build. Added on 2026-09-26 from the Agent Delivery Playbook: items 6–9 below, the release record, and the rule that the real-phone test blocks the store upload.

## Agents do
1. **Upgrade safety.**
   - Load data saved by the currently installed version (hotfix 721e997) into the final build: unit tests use fixtures exported from the old build, covering sessions, notes, settings, heart data and Escobar state.
   - Confirm nothing is lost or changed.
   - Confirm the release APK's signing certificate matches the pinned fingerprint. Verify only: never touch signing steps, keystores or the fingerprint.
2. **Coach server protection** (code in escobar-worker/; the owner deploys):
   - requests per install and per IP are limited, with a size cap;
   - a daily spending guard (a token budget counter): when the budget is used up, the coach returns a friendly "coach is resting, try later";
   - an uptime alert hook that reuses what exists (the `/health` endpoint plus a scheduled check that posts to Relay). A new alerting provider needs the owner's approval first.
3. **In the app:**
   - a training and AI disclaimer in onboarding and in the coach sheet ("not medical advice; the coach can be wrong");
   - a clear message when the coach is unreachable or resting;
   - a backup reminder when there's no backup in 30 days and at least 10 sessions are logged;
   - a privacy policy link in Settings (the owner supplies the URL);
   - the app version and "what's new" notes.
4. **Store paperwork drafts for the owner to review:**
   - listing text;
   - data-safety answers (what is sent, and when: coach data only when used, health only when shared, anonymous error reports only with consent);
   - permission reasons (health, notifications, watch);
   - release notes;
   - a privacy policy text draft.
5. **A real-phone test script:** a short checklist for the owner covering a cheap phone, a Huawei without Google services, two Android versions, swipe gestures, reminders, the watch, and installing over the old app.
6. **Online and offline behaviour table.** One row per feature that talks to anything outside the phone: the coach (Escobar), error reports, Health Connect, the watch, and backup export/import. Each row lists:
   - who owns the data;
   - what leaves the phone and when;
   - identity and permission;
   - how fresh the data is;
   - timeout and retry;
   - duplicate-request protection;
   - what the user sees when offline, when the server fails, and on reconnect;
   - cost and rate limits;
   - retention and deletion.

   Each row is checked against the code, not assumed. A gap becomes a fix in this item.
7. **Coach quality set.** 15–20 representative coach questions, including bad or empty input, privacy traps (asking for data the sharing switches block), and "coach resting/offline". For each question:
   - required answer properties (for example: no invented numbers, respects the sharing switches, a short plain answer);
   - latency;
   - cost per call.

   Run it before release and after any prompt or model change. A well-formed answer can still be wrong, so each answer is judged against its properties. Running it against the live Worker uses the owner's AI key (a few cents), so the owner approves that one run.
8. **Final regression on the exact release candidate.** The fix loop and items 1–7 above change code after the full QA (items 8 and 9). So, on the exact final commit and APK, run:
   - typecheck, all unit tests (three time zones) and the full gate;
   - a re-check of every 8/9 finding marked fixed;
   - the upgrade-safety tests.

   Any later change to code, config or stored-data shape means running the affected checks again. A passing result never carries over to a different build.
9. **Release record** (the section below): filled in and kept current by the supervisor.

## Release record
- **Candidate:** commit SHA, APK artifact link, version name/code, signing fingerprint verified (yes/no).
- **Checks on this exact candidate:** each with a link to its evidence (CI run, QA doc, device check). The real-phone test stays marked "not verified on a real phone" until the owner reports back.
- **Known risks:** each with its mitigation.
- **Rollout:** staged, if the store supports it. Health signals are watched after release: Worker `/health` uptime, the error-report daily summary, and store crash stats. The owner is alerted and responds.
- **Halt and recovery:**
  - App: an installed Android app cannot be rolled back, so a bad release is fixed by shipping a new version with a higher version code.
  - Worker: the owner redeploys the last good Worker version.
  - Saved data: a change to the saved-data shape ships only with a tested backup restore or a compatible forward fix. A feature switch cannot undo a destructive migration.

## Owner does (agents can't)
1. Back up the signing key and Huawei secrets offline, in 2 places. They are never committed; the repo is public.
2. Host the privacy policy (from the draft) and send the URL.
3. Set a spending cap on the AI provider key.
4. Deploy the Worker updates (items 7.5 and 10).
5. Run the real-phone test script, and optionally a 5–10 person closed beta for 1–2 weeks. **The store upload waits for this check.**
6. Store account and listing: approve screenshots, set the age rating and support email.
7. Approve the one coach quality-set run against the live Worker (a few cents on the AI key).
