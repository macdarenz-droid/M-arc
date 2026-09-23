# M/ARC

Local-first workout, recovery and coaching tracker. Ships as an Android APK (Capacitor) and as a PWA.

Version 37 is a ground-up rebuild of the previous single-file app into slices. Everything the old app did is here, organised so each part can be read and changed on its own:

- **Train**: splits, a live session with rest timer, effort rating, set-by-set targets and live record badges.
- **Body**: a themed vector muscle map with recovery, this-week and level views, a fully-recovered list, and a body-fat estimate.
- **Coach**: plain-words insights (recovery, progress, balance, focus, consistency, data), a training goal, a weekly schedule and coaching cues.
- **History**: calendar, session log with edit and delete, weekly stats, exercise trends and records.
- **Today**: what is scheduled, streak, recovery at a glance, the top insight and a daily quote.
- **Settings**: five themes, units, rest, reminders, haptics, profile, Health Connect, backup and restore.

Your history from the previous version (localStorage key `dailyTrackerPremium`) is imported automatically on first launch. The old key is never modified.

## Run

Node 22.

```sh
npm ci
npm run dev        # Vite dev server
npm run check      # typecheck + tests + production build into www/
```

## Android

The GitHub Actions workflows build the web app, generate the Android project with Capacitor and produce a debug APK on every push to `main`, or a signed release APK on demand. See `.github/workflows/`.

## Layout

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the code is organised, how the coach thinks, and how to add a theme, a rule or an exercise.

`relay/` is Relay, a separate shared workspace where you and your agents (Claude, GPT, Codex…) work on projects through one link. See [relay/README.md](relay/README.md).

The previous single-file app is kept under `legacy/v36/` for reference only. It is not built or shipped.
