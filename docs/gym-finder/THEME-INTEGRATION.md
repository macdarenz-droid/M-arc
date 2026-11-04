# Gym Finder theme integration — design and QA handoff

Date: 1 October 2026. Inspected M/arc source snapshot `dbd33b927b60582c24a3ab3d3104b87789007dfe`.

## Required behaviour

Gym Finder belongs to the existing theme engine. It must follow the selected app theme immediately, retain the selected gym and any open sheet when switching, and support future registered themes through the same semantic token contract. Do not implement separate Gym Finder components or theme-name branches for each palette.

The five current themes are Silent Black, Paper, Ember, Emerald and Midnight. The revised interactive concept loads a snapshot of their actual catalogue values. Its theme picker is a preview control; it does not propose adding another appearance setting to the production Gym Finder.

## Token mapping

| Element | Existing theme values / proposed geographic aliases |
| --- | --- |
| Page, details sheet, navigation | `bg`, `surface1`, `surface2`, `surface3` |
| Text and pricing provenance | `text`, `text2`; avoid decorative `text3` for essential information |
| Dividers, card edges | `borderSubtle`, `border`, `borderStrong` |
| Selected pins and primary actions | `accent`, `onAccent`, with a text-safe action fill when necessary |
| Quiet selected controls and small accent text | `accentSoft`, existing derived `accent-text` |
| Open/closed and other status | Semantic status tokens plus explicit text; never infer status solely from accent colour |
| Corners, typography, elevation | Theme `radius`, `font`, `shadow` |
| Geographic map | New geographic aliases derived from these values: land, road, major road, park, label, marker outline and halo |

The existing `mapBody` and `mapLine` tokens describe the anatomical muscle map. Keep geographic roles separate so changes to the body diagram do not accidentally restyle the street map.

The concept derives neutral roads from `surface3` and `text`, parks from `positive` and `surface1`, and uses a contrasting boundary around selected markers. These are proposed geographic defaults, not existing production map tokens. Future themes can override geographic aliases when needed; otherwise use the shared defaults.

## Accessibility correction demonstrated

Ember and Emerald supply dark `onAccent` colours. Fixed white icons or button labels would ignore that contract. The concept now uses the correct foreground for each theme.

Paper's current white text on `#2383e2` measures approximately 3.88:1. The concept derives a slightly darker action fill from the palette to retain white text and exceed 4.5:1. Promote this to a shared, tested action-token decision during implementation; do not create scattered per-screen colour adjustments.

Measured ordinary primary-button text contrast in the rendered concept:

| Theme | Contrast | Action corner radius |
| --- | ---: | ---: |
| Silent Black | 4.70:1 | 12px |
| Paper | 4.55:1 | 10px |
| Ember | 6.58:1 | 12px |
| Emerald | 7.52:1 | 8px |
| Midnight | 4.70:1 | 12px |

These measurements cover that button pair, not a complete accessibility certification. Every new theme still needs contrast checks for labels, focus indicators, status text, outlines, disabled states and selected markers on actual map layers.

## Production map integration

HTML controls can inherit CSS tokens. A separately rendered map may not: feed resolved palette values into its style interface when the app theme changes. Preserve camera position, markers, selection, expanded details and any route state during restyling. Keep provider attribution readable in every theme.

The SVG concept recolours its existing geographic paths through CSS variables; it does not implement or validate a production mapping SDK, native map component, live map tiles or provider-specific style restrictions.

## Future-theme issues in the current app

The Settings picker already enumerates `THEME_IDS`, which derives from the catalogue. However, adding an entry is not yet the only change required across the app:

- `ThemeId` is an explicit union in `src/theme/themes.ts:8`.
- `index.html` separately carries first-paint colours, a known-theme allowlist and splash palettes around lines 18, 39 and 127.
- `tests/theme.test.ts` includes expectations for exactly five themes.

Builder recommendation: derive the ID type from the canonical catalogue where practical; generate early startup palettes from the same source; validate every registered theme instead of requiring a fixed count. Continue to provide a safe default for unknown saved IDs and check font availability for any future theme with different typography.

## QA completed and limits

- Switched the rendered map through all five current catalogue themes: 276 geographic paths remained rendered, and no shell horizontal overflow was detected.
- Checked the Paper expanded details state at a 320px browser width: its 286px content width had no horizontal overflow, and action buttons ended above the bottom navigation.
- Checked primary-action contrast and theme-dependent radii using computed browser styles.
- Confirmed gym selection and theme are separate state; styling changes do not require selecting a gym again.
- Gym names, hours and rates remain illustrative. No live business rates, location permissions, directions, calls or workouts were triggered.

This records design/QA work only, now included in the repository handoff. No production application source files changed. The embedded catalogue is a preview snapshot; a future production implementation must subscribe to the canonical engine. Future theme compatibility is an implementation requirement supported by this token-based design; it is not a claim that unimplemented production Gym Finder code has passed integration tests.

Source: [theme catalogue](https://github.com/macdarenz-droid/M-arc/blob/dbd33b927b60582c24a3ab3d3104b87789007dfe/src/theme/themes.ts), [theme engine](https://github.com/macdarenz-droid/M-arc/blob/dbd33b927b60582c24a3ab3d3104b87789007dfe/src/theme/engine.ts), [shared styles](https://github.com/macdarenz-droid/M-arc/blob/dbd33b927b60582c24a3ab3d3104b87789007dfe/src/ui/styles.css), [startup code](https://github.com/macdarenz-droid/M-arc/blob/dbd33b927b60582c24a3ab3d3104b87789007dfe/index.html), [theme tests](https://github.com/macdarenz-droid/M-arc/blob/dbd33b927b60582c24a3ab3d3104b87789007dfe/tests/theme.test.ts).
