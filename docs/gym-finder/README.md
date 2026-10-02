# Gym Finder

**Builder entry point.** This package contains the source of the map concept shown to the owner, its research, feature logic, data-sourcing plan and QA requirements. Read this page first.

**Executable design prototype, not production Gym Finder.** Gym names, hours, rates, phone numbers and source labels are illustrative; no current business rate has been verified. The sample map uses attributed OpenStreetMap geometry. Live discovery, rate research, location monitoring and workout integration remain implementation work.

## Package

| File | Purpose |
| --- | --- |
| [prototype/index.html](prototype/index.html) | Runnable exported preview; open locally in a browser |
| [prototype/source.html](prototype/source.html) | Editable HTML, CSS and JavaScript for map, pins, sheets and interactions |
| [FEATURES-AND-LOGIC.md](FEATURES-AND-LOGIC.md) | Current prototype behaviour, proposed app logic, state transitions and integration points |
| [DATA-SOURCES.md](DATA-SOURCES.md) | Where actual gym information comes from and how to acquire, verify and refresh it |
| [THEME-INTEGRATION.md](THEME-INTEGRATION.md) | Five-theme mapping, future-theme requirements and measured contrast |
| [RESEARCH.md](RESEARCH.md) | Full Gym Finder research, source links, constraints and reasoning |
| [QA.md](QA.md) | Completed prototype checks and production acceptance cases |
| [TASK.md](TASK.md) | Scope and evidence for this documentation/prototype delivery |
| [prototype/MAP-SOURCE.md](prototype/MAP-SOURCE.md) | Geometry provenance, ODbL attribution and reproducible query |
| [../research/user-adaptation-research.md](../research/user-adaptation-research.md) | Wider user-adaptation research |
| [../research/escobar-evolution-research.md](../research/escobar-evolution-research.md) | Wider Escobar capability research |

## Preview

Check out this branch, then run from the repository root:

```sh
python -m http.server 4175 --bind 127.0.0.1 --directory docs/gym-finder/prototype
```

Open `http://127.0.0.1:4175/`. A direct local browser open of `index.html` is also possible. The preview needs network access for approved CDN scripts and fonts, but no Places key, gym account or live Escobar request. GitHub displays HTML source; it does not automatically host this page as a live app.

Tap a pin, expand details, change theme, open the source dialog, or use the back arrow to see the Escobar entry. The sample search filters three fixtures. The local reminder toggle does not request location. Calls, directions and training actions show explanatory preview dialogs.

`source.html` is the canonical editable fragment. `index.html` is its generated standalone wrapper, including icon/runtime support. Treat the wrapper as preview infrastructure, not an app component to paste into `src/`. The underlying code has no live provider credentials or backend endpoints. The exported wrapper supplies optional widget state; production persistence must use M/arc's supported store.

## Audit locations

The original audits remain separate and unchanged:

- [Original Codex audit](https://github.com/macdarenz-droid/M-arc/blob/claude/codex-audit-2026-10-01/codex-audit.md), [draft PR #144](https://github.com/macdarenz-droid/M-arc/pull/144).
- [Improvement audit](https://github.com/macdarenz-droid/M-arc/blob/claude/improvement-audit-2026-10-01/improvement-audit.md), [draft PR #149](https://github.com/macdarenz-droid/M-arc/pull/149).

These audits describe their pinned code snapshots, not a claim that every finding remains present after subsequent fixes. This package adds the Gym Finder topic rather than replacing either audit.

## Builder handoff

1. Read `FEATURES-AND-LOGIC.md`, `DATA-SOURCES.md`, the theme note and QA matrix. Consult `RESEARCH.md` for the evidence behind each requirement.
2. Inspect the actual target branch again before implementing. Research examined `d5ebc771`; UI/themes examined `dbd33b92`. This handoff starts from main `3d3e4e11`, whose subsequent change was policy documentation. No new full-app audit is claimed.
3. Create implementation cards for the foreground map/provider adapter, official-source rate service, workout/gym linking, theme integration, and optional native arrival reminders. Keep provider/service activation and saved-data changes within the repo's ownership rules.
4. Reuse the existing Preact components, theme engine and session/store APIs. The prototype demonstrates interaction and visual intent; migrate the behaviour into app architecture rather than importing its DOM string builders or fixture array into production.
5. Obtain real listing data through the approved provider integration; obtain membership prices through the rate service described in `DATA-SOURCES.md`. Keep fixtures in development only.
6. Report evidence against `QA.md` on the implementation commit. Android background reminders require real-device evidence. A working visual preview is not that evidence.

Suggested builder instruction:

> Read `docs/gym-finder/README.md` on the `claude/gym-finder-handoff-2026-10-01` branch. Use the prototype as the design reference and the linked logic, data-source, theme and QA documents as the feature specification. Inspect current app code before implementation, keep sample data out of production, and deliver changes through the repository's builder/reviewer process.

## Delivery scope

Only documentation and prototype files are added. Nothing is wired into the production app; no paid provider was activated, location collected, gym contacted or Worker deployed. The owner's research/design scope remains intact. The builder can read this branch or fetch it without merging the prototype into the app.
