# M/ARC

Local-first workout, recovery and coaching tracker. Ships as an Android APK (Capacitor) and as a PWA.

Version 37 is a ground-up rebuild of the previous single-file app into slices. Everything the old app did is here, organised so each part can be read and changed on its own:

- **Train**: splits, a live session with rest timer, effort rating, set-by-set targets and live record badges.
- **Body**: a themed vector muscle map with recovery, this-week and level views, a fully-recovered list, and a body-fat estimate.
- **Coach**: plain-words insights (recovery, progress, balance, focus, consistency, data), a training goal, a weekly schedule and coaching cues.
- **History**: calendar, session log with edit and delete, weekly stats, exercise trends and records.
- **Today**: what is scheduled, streak, recovery at a glance, the top insight and a daily quote.
- **Settings**: five themes, units, rest, reminders, haptics, profile, Health Connect, backup and restore, and the optional online coach.

The coach works out everything on the phone from what you log and never applies a suggestion by itself. An optional online mode, off by default, sends narrow, single-purpose requests to your own small proxy (see `proxy/README.md`): fuller wording for a finding, an answer to a question you type in ("Ask a question" on the Coach screen), suggested equipment and muscles for a custom exercise you name or photograph ("Scan a photo"), or tags for a session note (never a diagnosis). Design: `docs/COACH_BRAIN.md`. Evidence: `docs/RESEARCH.md`.

Your history from the previous version (localStorage key `dailyTrackerPremium`) is imported automatically on first launch. The old key is never modified.

## Run

Node 22.

```sh
npm ci
npm run dev        # Vite dev server
npm run check      # typecheck + tests + production build into www/
npm run backtest   # replay the coach over a synthetic history; pass a backup file to use your own
```

## Android

The GitHub Actions workflows build the web app, generate the Android project with Capacitor and produce a debug APK on every push to `main`, or a signed release APK on demand. See `.github/workflows/`.

## Layout

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for how the code is organised, how the coach thinks, and how to add a theme, a rule or an exercise.

The previous single-file app is kept under `legacy/v36/` for reference only. It is not built or shipped.
