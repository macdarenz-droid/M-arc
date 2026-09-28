# Anonymous error reports (owner item 7.5)

The owner approved this on 2026-09-26. Build it after checklist item 7 is merged and before items 8 and 9, so the full QA and the 50-user simulation cover it too.

## What it does
When something breaks, the app sends a small report to the owner's own Cloudflare Worker. Normal use sends nothing.

**Triggers (errors only):**
- ErrorBoundary crashes;
- `window.onerror` and `unhandledrejection`;
- store save failures (such as quota exceeded);
- migration or load failures on boot, and the rescue path;
- backup export or import failures;
- Escobar transport errors (never message content).

**Offline:** reports wait in a small local queue (at most 20, oldest dropped first) and are sent when the phone is back online. The same error signature within a day is sent once, with a count.

## Report contents (allowlist; nothing else)
- The error name, and the message after cleaning: digits are replaced with `#`, quoted strings with `"…"`, and it's cut to 300 characters.
- Stack frames from the app bundle only: file, line and column, at most 15 frames.
- App version (`__APP_VERSION__`), platform (android/web), Android version and device model.
- The route or screen name (a palace/route id; no ids or details).
- A timestamp (UTC).
- A random anonymous install id: generated locally, not tied to any account or data, and reset by "delete everything".

## Never sent
Workouts, sets, weights, reps, notes, exercise or split names, body weight, health or watch data, coach conversations, memory items, and settings values. The cleaning code has unit tests that seed personal strings and numbers and assert none of them appear in the report.

## Consent
- A Settings switch: "Send anonymous error reports". It is **off until the user says yes**, and the user is asked once, after the first successful workout or after the update.
- No report is sent while it is off. Reports already queued are cleared when it is switched off.

## Server (escobar-worker/)
- `POST /errors`:
  - validates the shape against the allowlist and rejects unknown fields;
  - limits body size to 8 KB;
  - limits requests to 30 per hour per install id and per IP.
- Stores reports in Cloudflare D1 or KV and deletes them after 90 days.
- A daily summary for the owner: new error signatures, counts, and affected installs.
- The Cloudflare free tier covers it.
- **The owner deploys the Worker.** Agents never deploy it.

## Owner to-do
1. Deploy the Worker update when it is ready.
2. Add one line to the privacy policy: "The app can send anonymous crash and error reports if you allow it. They contain no workout, health or personal data."
