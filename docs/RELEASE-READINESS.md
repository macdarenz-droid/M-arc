# Release readiness (owner item 10)

The owner approved this on 2026-09-26. It runs after item 9 and the fix loop for the 8/9 findings, and before the one APK message, so it checks the final build.

## Agents do
1. **Upgrade safety.**
   - Load data saved by the currently installed version (hotfix 721e997) into the final build: unit tests use fixtures exported from the old build, covering sessions, notes, settings, heart data and Escobar state.
   - Confirm nothing is lost or changed.
   - Confirm the release APK's signing certificate matches the pinned fingerprint. Verify only: never touch signing steps, keystores or the fingerprint.
2. **Coach server protection** (code in escobar-worker/; the owner deploys):
   - requests per install and per IP are limited, with a size cap;
   - a daily spending guard (a token budget counter): when the budget is used up, the coach returns a friendly "coach is resting, try later";
   - an uptime alert hook.
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

## Owner does (agents can't)
1. Back up the signing key and Huawei secrets offline, in 2 places. They are never committed; the repo is public.
2. Host the privacy policy (from the draft) and send the URL.
3. Set a spending cap on the AI provider key.
4. Deploy the Worker updates (items 7.5 and 10).
5. Run the real-phone test script, and optionally a 5–10 person closed beta for 1–2 weeks.
6. Store account and listing: approve screenshots, set the age rating and support email.
