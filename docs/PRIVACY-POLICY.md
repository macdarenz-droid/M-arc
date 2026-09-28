# M/ARC privacy policy

Draft for the owner to publish. Last updated: [OWNER: date of publishing]. Contact: [OWNER: contact email].

M/ARC is a workout tracker. It has no accounts, no ads and no analytics. Your data stays on your phone unless you turn on one of the two optional features below: the online coach and error reports. Both are off until you turn them on.

## What stays on your phone
- Your workouts, sets, weights, reps, splits, schedule, exercise notes, and profile (name, age, sex, height, body weight, training start).
- Weigh-ins, body measurements, soreness check-ins and readiness.
- Health Connect data, if you allow it: steps, sleep, heart rate, resting heart rate and active calories. The app only reads these; it never writes to Health Connect.
- Live heart rate from a Bluetooth watch or chest strap, if you connect one. Android asks for Bluetooth access for this (and, on Android 11 and older, location access, which Android requires to scan for Bluetooth devices; the app does not use your location).
- Coach conversations, coach memory and any photos you send the coach.
- Reminders are local notifications set on the phone. Backups are files you export and choose where to save.

The web version of the app is served by Netlify, a web host, which sees your IP address when the page loads.

Android's own backup may copy the app's data to your Google account if you have device backup turned on; that is Google's service, set in your phone's settings.

## The online coach (Escobar), off by default
When you turn on "Online coach" and send a message, the app sends to the coach server:
- your message and the conversation so far, and any photo you attach (shrunk to at most 900 pixels);
- a short summary built on the phone: date and time, the screen you are on, today's plan, muscle recovery, this week's training, your goal, age, sex, training experience, planned days, gym equipment, coach memory notes, and a readiness level;
- workout history the coach asks for, such as past sessions, exercise notes and progress;
- a random device id (not linked to your name or account), the app version, your unit (kg or lb) and coach tone.

Health data (heart rate, sleep, steps, calories) and body data (weight, body fat, measurements) are sent only if you turn on "Share health data" or "Share body data". Both are off by default. Turning one off also stops earlier answers from being sent again.

**Who receives it:**
- **Cloudflare** runs the coach server (a Cloudflare Worker run by the M/ARC developer). It passes your request on and keeps no conversation. To limit use, it counts requests per device id and per internet (IP) address for the day; these counters are deleted after 3 days. Its logs record only technical details (which model answered, token counts, timing), not your messages.
- **Anthropic** (the maker of the Claude AI) receives the request from the Worker and writes the coach's answer. The request comes from the server, not from your phone, so Anthropic does not see your IP address. Anthropic may keep parts of a request in a short-lived cache (up to one hour) so follow-up messages are faster. Anthropic handles it under its own terms and privacy policy: [OWNER: link to Anthropic's policy that applies to the API account].

## Anonymous error reports, off by default
The app asks you once, after your first logged workout, and there is a switch in Settings: "Send anonymous error reports". Nothing is sent while it is off, and switching it off deletes reports still waiting on the phone.

When it is on and something breaks, the app sends a report to the same Cloudflare server. A report holds only these 13 items: a random install id (made on the phone, not linked to you), the time, app version, platform (Android or web), Android version and device model (not collected yet), the screen name, the kind of error, the error name, the error message, the places in the app's own code where it failed, an error fingerprint, and how many times it happened.

The message is cleaned before it leaves the phone and again on the server: every digit becomes "#", anything in quotes is removed, and it is cut to 300 characters. Code locations are kept only for the app's own files, at most 15. Workouts, health or watch data, body data, coach conversations, memory and settings are never in a report.

The server stores reports in Cloudflare's database for 90 days, then deletes them. To stop abuse it allows 30 requests an hour per install id and per IP address; your IP address is never stored, only a scrambled code of it, deleted after the hour. A request can hold at most 20 reports and 8 KB.

## Deleting your data
"Reset everything" in Settings (Your data) erases everything on the phone, including coach conversations and photos, and gives you a new install id. Uninstalling the app also removes it. Error reports already on the server are anonymous and are deleted after 90 days. To ask about them, email [OWNER: contact email].

## Children
M/ARC is not meant for children under [OWNER: minimum age]. [OWNER: confirm age and wording for the countries you publish in.]

## Changes
If this policy changes, the new version will be posted here with a new date.

Applicable law: [OWNER: country or region whose law applies].
