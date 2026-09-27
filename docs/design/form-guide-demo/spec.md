# Form guide, library and warm-up: render spec for the demo canvas

Status: specification for a demo the owner will judge. Nothing here is built in the app. The app build starts only after all current patches merge.
Date: 2026-09-26. Source of truth: the `main-ro` checkout (`b55986a`, read-only), the newer `origin/main` (`b204c87`, which adds patch b3 "sheets and toasts"; read with `git show`, and it does not change Train.tsx, ExercisePicker.tsx, exercises.ts, exercises.json, pre.ts or themes.ts), the owner's screenshot `owner-split-screenshot.jpg`, and the research files in `scratchpad/arch/` (`gap.json`, `lib.json`, `guide.json`, `warmup.json`).

## 0. In plain words

- The demo uses the owner's real split, **SPLIT 1 UPPER BODY** at **Anytime Fitness**, drawn to match his Train screen.
- Tapping an exercise on the Train screen opens an **About** sheet. At the top is a moving demo you can play, pause, slow down and zoom into. Below it: other names, muscles, equipment, how-to steps, one tip, and two common mistakes.
- The figure is flat and low-poly, like the app's muscle map. It is painted only with the theme's colours, so it changes with the theme.
- 3 moving demos (the owner asked for exactly 3): Machine Chest Press, Lat Pulldown and Dumbbell Lateral Raise. The other 5 split exercises and Dumbbell Around the World (Lying) show their About text with the line "Animation comes with the form-guide update."; the warm-up moves show still pictures.
- Extra boards: the Lat Pulldown machine guide, the warm-up for this split, searching "around the world", making your own exercise, and the Machine Chest Press sheet in the 4 other themes.

---

## 1. Verified facts from the real app

### 1.1 Theme ids and every token

Theme ids (from `src/theme/themes.ts`, `ThemeId`): `silent-black` (default, `DEFAULT_THEME`), `paper`, `ember`, `emerald`, `midnight`. Every theme uses the same font stack: `Inter, "SF Pro Text", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif`.

`themeToCss()` turns each token into a CSS custom property on `[data-theme="<id>"]`. The screenshot pixels confirm Silent Black: page `#08090b`, card `#0f1012`, chips `#141517`, hints `#66676c`, chip text `#8d9099`, button `#606acb` (JPEG of `#08090a`, `#0f1011`, `#141516`, `#62666d`, `#8a8f98`, `#5e6ad2`).

| Token (themes.ts) | CSS custom property | silent-black | paper | ember | emerald | midnight |
|---|---|---|---|---|---|---|
| colorScheme | `color-scheme` | dark | light | dark | dark | dark |
| bg | `--bg` | `#08090a` | `#ffffff` | `#07080a` | `#0f0f0f` | `#0a2540` |
| surface1 | `--surface-1` | `#0f1011` | `#f7f6f3` | `#0e1013` | `#171717` | `#0f2d4d` |
| surface2 | `--surface-2` | `#141516` | `#efeeea` | `#14171b` | `#1c1c1c` | `#143559` |
| surface3 | `--surface-3` | `#1b1c1f` | `#e6e4df` | `#1c2026` | `#242424` | `#1a3f68` |
| borderSubtle | `--border-subtle` | `rgba(255,255,255,0.06)` | `rgba(55,53,47,0.08)` | `rgba(255,255,255,0.05)` | `#242424` | `rgba(246,249,252,0.07)` |
| border | `--border` | `rgba(255,255,255,0.10)` | `rgba(55,53,47,0.14)` | `rgba(255,255,255,0.09)` | `#2e2e2e` | `rgba(246,249,252,0.12)` |
| borderStrong | `--border-strong` | `rgba(255,255,255,0.18)` | `rgba(55,53,47,0.26)` | `rgba(255,255,255,0.16)` | `#393939` | `rgba(246,249,252,0.22)` |
| text | `--text` | `#f7f8f8` | `#37352f` | `#ffffff` | `#ededed` | `#f6f9fc` |
| text2 | `--text-2` | `#8a8f98` | `#6b6a66` | `#9aa0a6` | `#a0a0a0` | `#a3b6cc` |
| text3 | `--text-3` | `#62666d` | `#9b9a97` | `#5f666d` | `#707070` | `#6c839c` |
| accent | `--accent` | `#5e6ad2` | `#2383e2` | `#ff6363` | `#3ecf8e` | `#635bff` |
| accentSoft | `--accent-soft` | `rgba(94,106,210,0.16)` | `rgba(35,131,226,0.12)` | `rgba(255,99,99,0.16)` | `rgba(62,207,142,0.14)` | `rgba(99,91,255,0.18)` |
| onAccent | `--on-accent` | `#ffffff` | `#ffffff` | `#1a0b0b` | `#062d1c` | `#ffffff` |
| positive | `--positive` | `#4cc38a` | `#0f7b4f` | `#59d499` | `#3ecf8e` | `#3ecf8e` |
| warning | `--warning` | `#f2b544` | `#b7791f` | `#ffb454` | `#f5a623` | `#ffbb00` |
| negative | `--negative` | `#eb5757` | `#c0392b` | `#ff6363` | `#f04438` | `#ff5c5c` |
| info | `--info` | `#6ea8fe` | `#2383e2` | `#7aa7ff` | `#5fa8ff` | `#00d4ff` |
| shadow | `--shadow` | `0 16px 40px rgba(0,0,0,0.45)` | `0 8px 24px rgba(15,15,15,0.08)` | `0 18px 44px rgba(0,0,0,0.5)` | `0 14px 36px rgba(0,0,0,0.45)` | `0 18px 44px rgba(3,20,40,0.55)` |
| mapBody | `--map-body` | `#1b1c1f` | `#e6e4df` | `#1c2026` | `#242424` | `#1a3f68` |
| mapLine | `--map-line` | `rgba(255,255,255,0.10)` | `rgba(55,53,47,0.18)` | `rgba(255,255,255,0.10)` | `#393939` | `rgba(246,249,252,0.14)` |
| chrome | (meta theme-color only, no CSS var) | `#08090a` | `#ffffff` | `#07080a` | `#0f0f0f` | `#0a2540` |
| radius.sm | `--radius-sm` | 8px | 6px | 8px | 6px | 8px |
| radius.md | `--radius-md` | 12px | 10px | 12px | 8px | 12px |
| radius.lg | `--radius-lg` | 16px | 14px | 16px | 12px | 16px |
| radius.xl | `--radius-xl` | 22px | 18px | 20px | 16px | 22px |
| font | `--font` | stack above | same | same | same | same |

Theme-independent tokens (`src/ui/styles.css` `:root`, lines 3-45), used by the demo as literal values:

| Group | Values |
|---|---|
| Durations | `--dur-press` 100ms, `--dur-fast` 150ms, `--dur-base` 200ms, `--dur-enter` 240ms, `--dur-exit` 160ms, `--dur-sheet` 320ms, `--dur-sheet-exit` 200ms |
| Easings | `--ease-standard` cubic-bezier(.2,0,0,1); `--ease-enter` cubic-bezier(.05,.7,.1,1); `--ease-exit` cubic-bezier(.3,0,.8,.15); `--ease-drawer` cubic-bezier(.32,.72,0,1) |
| Type | cap 11/14 +.06em; meta 12/16; small 13/18 -.003em; body 15/20 -.009em; title 17/22 -.013em; stat 22/26 -.018em; h1 28/34 -.021em; display 40/44 -.022em; weights 400, 500, 600 |
| Space | 4, 8, 12, 16, 24, 32 px |
| Other radii | `--radius-xs` 4px, `--radius-pill` 999px |
| Elevation | `--shadow-float` 0 1px 2px rgba(0,0,0,.5), 0 12px 32px -8px rgba(0,0,0,.6) (Paper: 0 1px 2px rgba(0,0,0,.08), 0 12px 32px -8px rgba(0,0,0,.18)); `--scrim` rgba(0,0,0,.5) |
| Layout | `--nav-h` 58px; `--float-gap` 12px; the Escobar dock sits 70px above the bottom |

### 1.2 Typography, as the stylesheet sets it

- `body`: line-height 1.4, text 16px (browser default; no body size is set), `-webkit-font-smoothing: antialiased`.
- `h1` 28px, weight 650, letter-spacing -0.02em, line-height 1.15. `h2` 17px, 600, -0.01em. `h3` 14px, 600.
- `.eyebrow` 11px, 600, letter-spacing 0.08em, uppercase, `--text-3`.
- `.hint` 12px `--text-3`. `.small` 13px. `.tiny` 12px. `.muted` `--text-2`. `.num` tabular numbers.
- Buttons 14px/600. Chips 12px/600. Tabs 13px/600. Nav labels 11px/600.

Font in the demo: the app does not bundle Inter, so the owner's Android phone falls through to `system-ui` (Roboto-style glyphs in the screenshot). Each artboard loads Roboto from Google Fonts (`https://fonts.googleapis.com/css2?family=Roboto:wght@400..700&display=swap`) and sets `font-family: Roboto, Inter, "SF Pro Text", system-ui, -apple-system, "Segoe UI", sans-serif` so the canvas matches his phone.

### 1.3 Components (exact rules)

| Component | Rule (styles.css / primitives.tsx) |
|---|---|
| Page `.app` | max-width 560; padding 12px 16px 140px (plus safe areas). The demo draws no status bar. |
| `.topbar` | flex, align end, space-between, gap 12, margin 6px 0 18px |
| `.card` | `--surface-1`, 1px `--border-subtle`, radius `--radius-lg`, padding 16 |
| `.list-row` | flex, gap 12, padding 12px 0, 1px `--border-subtle` bottom (none on the last), min-height 52. `.pressable`: margin 0 -8px, padding 8px sides, radius `--radius-sm`, pressed background `--surface-3` |
| `.btn` | inline-flex, gap 8, min-height 44, padding 0 16, radius `--radius-md`, 14px/600, 1px `--border`, `--surface-2`, `--text` |
| `.btn-primary` | `--accent` fill, `--on-accent` text, no border. `.btn-quiet`: transparent, `--text-2`. `.btn-sm`: min-height 34, padding 0 12, 13px. `.btn-icon`: 44x44 circle. `.btn-block`: full width. Disabled: opacity .45 |
| `.chip` | inline-flex, gap 6, padding 4px 10px, radius 999, 12px/600, 1px `--border`, `--text-2` on `--surface-2`, min-height 28. `.chip-accent`: `--accent-soft` fill, `--accent` text. `.chip-btn`: min-height 36, padding 6px 12px, 4px invisible extra hit area top and bottom; `aria-pressed="true"` = `--text` fill, `--bg` text |
| `.tab` (split pills) | min-height 38, padding 0 14, radius 999, 1px `--border`, `--surface-1`, 13px/600 `--text-2`, 8px dot in the split's colour. Selected: `--text` fill, `--bg` text |
| `.seg` | 3px padding, `--surface-2`, 1px `--border-subtle`, radius `--radius-md`, gap 2; buttons min-height 34 (44 hit), 13px/600 `--text-2`; selected button `--surface-1`, `--text`, shadow 0 1px 2px rgba(0,0,0,.18) |
| Bottom nav `.nav` | fixed bottom, `color-mix(in srgb, var(--bg) 88%, transparent)` with 14px blur, 1px `--border-subtle` top; 5 equal columns; each button min-height 58, padding 10px 0 8px, gap 3, icon 22px, label 11px/600 `--text-3`; current tab `--text` |
| Nav items | Today (sun), Train (dumbbell), History (calendar), Body (person), Escobar (the Escobar mark) |
| Escobar dock `.esc-dock` | centred, 70px from bottom, min-height 40, padding 0 16 0 12, radius 999, `--surface-2`, 1px `--border`, `--shadow`, 13px/600 `--text`, Escobar mark in `--accent`. Hidden while any sheet is open |
| Escobar mark | a PNG mask (`src/assets/escobar-mark.png`, 192x192, 5.8 KB) painted with `currentColor`. The demo inlines the same PNG as a `data:` URI mask; no stand-in drawing |
| Sheet `.sheet-panel` (origin/main after b3) | `--surface-2`, 1px `--border` (no bottom), radius `--radius-xl` top corners, padding 8px 16px 20px, max-height 92% of the screen, scrolls, `overscroll-behavior: contain`; rises from `translateY(100%)` over `--dur-sheet` with `--ease-drawer`. (Before b3 the panel was `--surface-1`.) |
| Sheet top and backdrop | grab + head wrapped in a sticky `.sheet-top` (`top:-8px`, `--surface-2`, margin -8px -16px 0, padding 8px 16px 0); a 1px `--border-subtle` hairline under it fades in once the sheet is scrolled. Backdrop `--scrim`, no blur; a nested sheet has a clear backdrop. The demo draws this look |
| Grab and head | grab 36x4, radius 2, `--border-strong`, margin 4px auto 14px. Head: `h2` title left, close = quiet 44px circle with an X icon (`aria-label="Close"`), margin-bottom 14 |
| Line icons | 24x24 viewBox, no fill, `stroke="currentColor"`, stroke-width 1.8, round caps and joins (`src/ui/icons.tsx`). Sun: circle r4 + rays; Dumbbell `M6 7v10M18 7v10M3 9v6M21 9v6M6 12h12`; Calendar rect 4,5,16,15 rx2 + `M4 10h16M8 3v4M16 3v4`; Body circle 12,4.5 r2.5 + `M8 9h8l1 6h-2l-1 6h-4l-1-6H7z`; Plus `M12 5v14M5 12h14`; ChevronDown `M6 9l6 6 6-6`; Chevron `M9 6l6 6-6 6`; Edit `M4 20h4l10-10-4-4L4 16zM13 7l4 4`; X `M6 6l12 12M18 6L6 18`; Play `M7 5l12 7-12 7z` filled; Pause `M8 5v14M16 5v14`; Info circle r9 + `M12 11v5M12 8h.01`; Check `M5 12l4 4L19 7`. New for the demo, same style: Replay `M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4`; Zoom `circle 11,11 r6` + `M20 20l-4.5-4.5M11 8.5v5M8.5 11h5` |
| Insight card `.insight` | a card with a 3px left edge in the category colour (progress = `--warning`). The canvas rules forbid left-edge cards, so the demo shows a 6px `--warning` dot before the title instead |
| Escobar proposal card `.esc-proposal` | card, bold title, a small table `label | before (or —) | → | after`, then `Apply` (primary, small) and `Not now` (quiet, small). Applied state: "Applied" + an accent `Undo` link. Real card has a 3px accent left edge; the demo uses a normal bordered card (same canvas rule) |

### 1.4 The Train screen, checked against the screenshot

`Splits()` in `src/slices/workout/Train.tsx` (lines 201-285), top to bottom:

1. Topbar: eyebrow "Train" (shown uppercase), `h1` "Workouts"; right: quiet small button "+ Split" (plus icon 16).
2. Gym chip: `chip chip-btn gym-chip` "At: Anytime Fitness" + chevron-down 14. Row margin-bottom 10.
3. Split pills `.tabs-strip` (gap 8, scrolls sideways): SPLIT 1 UPPER BODY (selected, dot `#4d9dff`), SPLIT 2 - LOWER AND CORE (dot `#ffc845`), third pill (dot `#a061ff`) cut off by the screen edge. Its name is not visible in the screenshot; the demo writes "SPLIT 3" and lets the edge clip it so only "SP" shows, exactly like the screenshot. Dots come from `SPLIT_COLORS` in `splits.ts`.
4. Split card: `h2` "SPLIT 1 UPPER BODY", hint "8 exercises · 21 sets", edit button (pencil, quiet 44 circle).
5. Exercise rows (`Row`, trailing hint "N sets"): name line, then hint line `target · coach reason`, both one line with ellipsis. Full text of each row is in section 7.1.
6. Primary block button: play icon + "Start SPLIT 1 UPPER BODY" (margin-top 12).
7. Quiet block button "Log a past session" (in the screenshot it sits behind the Escobar dock).
8. Below the card: hint "Targets come from your last sessions and your goal (...)". The goal is not visible in the screenshot, so the demo leaves this line out rather than guess the goal.
9. Escobar dock: "What should I lift today?" (the Train prompt from `src/escobar/ui/prompts.ts:52`).
10. Bottom nav with Train current.

Measured from the screenshot (1080 px wide; the 44 px button and 58 px nav both measure about 2.05 display px per CSS px at the 857 px preview): chip 36 px, pills 38 px, button 44 px all match the stylesheet. Exercise rows measure about 57 px apart; the stylesheet gives 63 px (12 + 22.4 + 16.8 + 12). The demo follows the stylesheet. If rows look taller than on his phone, the phone's text size setting is the likely reason; this cannot be confirmed from a screenshot.

Today the split rows are **not** tappable (`Row` without `onClick`). This work makes them pressable (`.list-row.pressable`, role button, Enter/Space) and opens the About sheet.

### 1.5 Other screens this work touches

- **PreSessionSheet** (`Train.tsx` 886-915): sheet "Before you start {split}", a row with hint "Today's checks" and the Ask-Escobar icon, up to 3 insight cards from `preSessionInsights()` (title bold 13px; `means` 13px muted; `action` hint), then primary "Start {split}". For SPLIT 1 the 4 main lifts (Machine Chest Press, Lat Pulldown, Incline Machine Press, Seated Cable Row) each make a "today's target load" card at priority 260, so the 3-card limit shows the first three and the warm-up ramp card (priority 120) never shows. The warm-up design below fixes this.
- **ExercisePicker** (`src/slices/workout/ExercisePicker.tsx`): sheet "Add exercise", search input (placeholder "Search, e.g. chest press, lat pulldown"), pressable rows (name; hint "{equipment} · {main muscles}"; chip "Add"), empty text "Nothing matches. You can create it below.", quiet button "Create a custom exercise". Custom form: Name, Equipment, How resistance works, Main muscles (pick one or two), Main lift or accessory, Back / Create and add. Opened from Edit split ("Add exercise") and from the live session ("Add exercise to this session").
- **Per-exercise Options sheet** (live session, `EntryCard`, `Train.tsx` 757-778): sheet titled with the exercise name: "Setup note (shown every time)", "Note for today", Skip today, Substitute exercise, Remove from this session, and a hint "{equipment} · main: ... · helps: ...". This is the only per-exercise sheet today. This work adds a first button "About this exercise" there, opening the same About sheet (nested).
- **Search scoring** (`searchExercises`, `src/core/exercises.ts` 219-241): exact name 150, exact alias 130, name starts 70, name contains 50, alias contains 40, all words in name 30; minus name length / 100; custom exercises listed before the library.
- **Duplicate check already in Escobar**: `propose_custom_exercise` refuses a name that `findExerciseExact` finds, and that function checks names **and aliases** (normalised, plural-tolerant) across custom and library (`actions.ts` 330-332, `exercises.ts` 131-137, 215-217). Apply creates the custom exercise and returns an Undo (`apply.ts` 175-180).
- **Warm-up ramp** (`src/brain/coach/pre.ts`): 50% x 8, 70% x 5, 85% x 2 of the first working set, snapped to the equipment. Machine/cable default step is 5 (`src/brain/units.ts:35`). For Machine Chest Press at 120 lb this gives **60 lb x 8, 85 lb x 5, 100 lb x 2** (27.2 kg = 60 lb; 38.1 kg = 84 lb, nearest 85; 46.3 kg = 102 lb, nearest 100).

### 1.6 Figure style today (`src/svg/bodyMuscles.ts`, `src/ui/MuscleMap.tsx`)

- Flat, low-poly body: straight-edged paths from the body-muscles package, viewBox 35 x 93 per view, no gradients, no shadows.
- Plain parts: fill `--map-body`, stroke `--map-line`, stroke-width .12, round joins.
- Muscles in "roles" mode: main = `var(--accent)`; helps = `color-mix(in srgb, var(--accent) 45%, var(--map-body))`; stabilises = `color-mix(in srgb, var(--accent) 22%, var(--map-body))`. Lit muscles get stroke `color-mix(in srgb, var(--text) 35%, transparent)`.
- Legend words: Main, Helps, Stabilises.

### 1.7 Library entries used (`src/data/exercises.json`)

Muscle names below are the app's labels from `src/data/muscles.ts`.

| Slug (demo) | Library id | Name | Equipment | Main | Helps | Pattern | Other names (aliases) |
|---|---|---|---|---|---|---|---|
| machine-chest-press | lib_machine_chest_press | Machine Chest Press | Machine | Chest | Front shoulders, Triceps | horizontal_push | chest press machine, machine press, seated chest press |
| lat-pulldown | lib_lat_pulldown | Lat Pulldown | Cable / Machine | Lats | Biceps, Mid back | vertical_pull | wide grip pulldown, lat pull down |
| incline-machine-press | lib_incline_machine_press | Incline Machine Press | Machine | Upper chest | Front shoulders, Triceps, Chest | incline_push | incline chest press machine |
| seated-cable-row | lib_seated_cable_row | Seated Cable Row | Cable | Mid back | Lats, Biceps, Rear shoulders | horizontal_pull | cable row, seated row |
| dumbbell-lateral-raise | lib_dumbbell_lateral_raise | Dumbbell Lateral Raise | Dumbbells | Side shoulders | Upper traps | shoulder_abduction | lateral raise, side raise, db lateral raise |
| rear-delt-fly | lib_rear_delt_fly | Rear Delt Fly | Machine | Rear shoulders | Mid back | horizontal_abduction | reverse pec deck, rear delt machine fly |
| dumbbell-biceps-curl | lib_dumbbell_biceps_curl | Dumbbell Biceps Curl | Dumbbells | Biceps | Forearms | elbow_flexion | db biceps curl, dumbbell curl, db curl |
| single-arm-triceps-pushdown | lib_single_arm_triceps_pushdown | Single-Arm Triceps Pushdown | Cable | Triceps | Forearms | elbow_extension | unilateral pushdown, one arm pushdown |
| around-the-world | new (proposed `lib_dumbbell_around_the_world`) | Dumbbell Around the World (Lying) | Dumbbells | Chest, Front shoulders | Upper chest, Triceps | chest_adduction | see section 6 |
| arm-circles | warm-up move (not a library exercise) | Arm Circles | None | (warms) Front, Side and Rear shoulders, Rotator cuff | none | warm-up | shoulder circles, arm rotations |

Rear Delt Fly in the library is the machine version (reverse pec deck), which matches the owner logging it in lb.

Lat pulldown station family in the library: Lat Pulldown, Close-Grip Pulldown (neutral grip pulldown, close grip lat pulldown), Underhand Lat Pulldown (reverse grip pulldown), all "Cable / Machine"; Single-Arm Lat Pulldown ("Cable", one arm lat pulldown, unilateral pulldown), done on the same station with a single handle.

---

## 2. Shared player design (every Player-*.dc.html)

### 2.1 Contract

- File: `project/<file>.dc.html`, complete per `FORMAT-RULES.md` (support.js in head, `<x-dc>`, `<helmet>`, script block, closed tags).
- Root: fixed **358 x 460**, `$preview` 358 x 460, `<title>` "<exercise name> form guide". Root background `var(--surface-2)` (it sits inside the sheet panel).
- `data-props`: `{"theme":{"editor":"enum","options":["silent-black","paper","ember","emerald","midnight"],"default":"silent-black"},"autoplay":{"editor":"boolean","default":true},"loop":{"editor":"boolean","default":true},"$preview":{"width":358,"height":460}}`. In `renderVals()`, read booleans defensively: `const on = v => v === true || v === 'true' || v === 'yes';` (importers pass `{{ no }}` = `false`).
- Paints only with theme tokens set as CSS custom properties on the root from `this.props.theme` (the THEMES object in 2.9). No hex or rgba anywhere else in the file.
- Importers: `<dc-import name="<file>" theme="{{ theme }}" autoplay="{{ no }}" loop="{{ no }}" hint-size="358px,460px"></dc-import>` (file name without `.dc.html`, as the rules' example does).
- Standalone on the canvas: autoplay and loop are true, so it moves at once and keeps repeating the 3-rep cycle. Inside About: still setup pose; Play runs 3 reps; then it holds the setup pose and the button becomes Replay. This bounded behaviour is the real app behaviour.

### 2.2 Layout inside 358 x 460 (y in px)

| y | Block | Detail |
|---|---|---|
| 0-276 | Stage | `--surface-1`, 1px `--border-subtle`, radius `--radius-lg`, overflow hidden. Inline `<svg viewBox="0 0 358 276" aria-hidden="true">`. Overlays: top-left rep pill "Rep 1 of 3" (12px/600 `--text-2` on `--surface-2`, radius pill, padding 3px 8px; with loop on it cycles 1-3); a second pill "Slow motion" (`.chip-accent` look) at 0.5x; top-right camera label ("Side view", "Front view", "Top view", "Three-quarter view"), 11px/600 uppercase .06em `--text-2`. Zoom bubble (when zoomed): bottom 12, left 12, right 12; `--surface-2`, 1px `--border`, radius `--radius-md`, padding 8px 12px, 13px/18px `--text`, leading 8px `--accent` dot |
| 284-304 | Caption line | 15px/20px, 600, `--text`, left; right side 12px `--text-2` tempo note (e.g. "1 s up · 2 s down"). Idle text: "Tap Play to watch 3 slow reps." Ended text: "Done. Tap Replay to watch again." |
| 312-356 | Zoom chips | 3 `.chip.chip-btn` with the Zoom icon (14px) + label; `aria-pressed` when active; row gap 8 |
| 364-408 | Controls | Play/Pause/Replay: `.btn.btn-primary.btn-icon` 44 circle (`aria-label` "Play", "Pause" or "Replay"); gap 8; speed `.seg` 104 wide: "1x" / "0.5x"; flexible space; mode `.seg` 184 wide: "Animation" / "Pictures" |
| 416-452 | Hint | 12px/16px `--text-2`. Animation: "Tap a zoom chip to look closer. Tap it again to zoom out." Pictures: "Four key moments of one rep." Reduced motion: "Pictures shown because your phone is set to reduce motion." |

Width check: 44 + 8 + 104 + 8 + 184 = 348 of 358.

### 2.3 Figure and equipment paint (derived from theme tokens, set on the root)

Two rig-only variables ride in the same root style hole as `themeVars()`, written by `rigVars(theme)` (`rig-final/gen.mjs`): `--lit` / `--shd`, what a lit or a shaded facet mixes toward (`--text` / `--bg` in dark themes, `--bg` / `--text` in light ones), and `--hi` / `--lo`, how much of the base tone a light or a dark facet keeps (90% / 78% dark, 76% / 84% light); `--eq-hi`, how much the equipment's light face keeps (82% dark, 40% light, so plate bevels show on Paper); also `--rim-k` (62% dark, 35% light). Dark themes shade mostly by darkening, light ones mostly by lightening.

| Role | Value | Contrast on `--surface-1` (worst theme) |
|---|---|---|
| Body fill `--body` (the T-shirt's own tone) | `color-mix(in srgb, var(--map-body) 88%, var(--text))` | fill only |
| Skin, shorts, shoe, sole, hair | `--skin` = `color-mix(in srgb, var(--body) 92%, var(--text))`; `--shorts` = `color-mix(in srgb, var(--body) 70%, var(--text))`; `--shoe` = `color-mix(in srgb, var(--body) 50%, var(--shd))`; `--sole` = `color-mix(in srgb, var(--body) 45%, var(--lit))`; `--hair` = `color-mix(in srgb, var(--body) 50%, var(--shd))` | fill only |
| 3-tone shading (light, mid, dark per surface, skin/T-shirt/shorts/shoe/hair and the equipment faces alike) | `X-hi = color-mix(in srgb, X var(--hi), var(--lit))`; `X-lo = color-mix(in srgb, X var(--lo), var(--shd))`; the hair sheen keeps 68% (`--hair-hi`), the equipment's light face `--eq-hi` | tint only |
| Figure outline `--fg-line` (one silhouette per body layer: a 3-unit stroke drawn under the fills, so 1.5 shows) | `color-mix(in srgb, var(--text) 60%, var(--surface-1))` dark themes, 70% light, round joins, `vector-effect: non-scaling-stroke` | at least 4.6:1 on the stage, 3.1:1 over the body, every theme |
| Rim (thin lighter line just inside the outline) `--rim` | `color-mix(in srgb, var(--body) var(--rim-k), var(--lit))`, 1.1 units drawn under the fill so 0.55 shows | at least 1.25:1 over the outline |
| Frame outline `--fg-frame` (pads, frame, plates, rails, guide rods) | `color-mix(in srgb, var(--text) 38%, var(--surface-1))` dark, 56% light | at least 3.18:1 |
| Main muscle | `var(--accent)`; effort cue: opacity 0.75 (setup pose) rising to 1.0 (end pose), never below 0.75 | 2.98:1 Midnight (the outline carries the shape; muscles are also listed in text) |
| Helper muscle | `color-mix(in srgb, var(--accent) 45%, var(--body))` | tint only |
| Target-muscle glow `gw` (a halo under the main muscle, clipped to the part's own silhouette with a `<clipPath>` of its base polygon, so it never spills past the outline) | `var(--accent)`, 5 units wide, stroke-opacity 0.3; element opacity = the move progress p: 0 at setup, rising through the lift, 1.0 through the hold (the hardest point), falling back to 0 through the return and reset | never flashes at the rep restart |
| Helper tint easing (lateral raise): the upper-trap `mh` polygons | opacity 1 at setup easing to 0.7 through the hold and back, on the same timing (the traps stay down; opacity only, no joint moves) | |
| Secondary-motion facet (a brace inside the torso; the shoulder-blade edge or, front view, the collarbone line) | the surface's own tone, fill-opacity 0.75, class `tn`; opacity also = p, no `rotate()` | shape change only; fixed joints stay fixed |
| Contact shadow | three stacked ellipses in `--border`, fill-opacity 0.6 (radii 1, 0.72, 0.44), no filter, under the feet and (chest press) under the seat: a faint light pool on the near-black stages, a soft dark one on Paper | |
| Metal moving parts `--fg-metal` (handles, bar, dumbbells, carriage) | `color-mix(in srgb, var(--text) 72%, var(--surface-1))` | 4.9:1 Paper, 7.6+ dark |
| Equipment faces, plain / light / dark (plate bevels, dumbbell top and end faces) | `var(--equip)` (= `var(--surface-3)`) / `--equip-hi` / `--equip-lo` (3-tone formula above) | fill only |
| Grip texture (handle ribs) `--metal-lo` | `color-mix(in srgb, var(--fg-metal) 64%, var(--surface-1))`, 0.6 units, so the fingers dominate the hand | |
| Pad seams `--seam` | `color-mix(in srgb, var(--fg-frame) 70%, var(--equip))`, dashed 1.6 1.2 | |
| Cables `--fg-cable` | `color-mix(in srgb, var(--text) 55%, var(--surface-1))`, 1.25 units | 3.1:1 Paper, 5.0+ dark |
| Far side (depth cue): far leg, far lever or handle only, never a far arm | `--body-far` = map-body 50% into `--surface-1`; `--shorts-far` / `--shoe-far` = shorts / shoe 45% into `--surface-1`; outline `--fg-line-far` = text 30% into `--surface-1`, 2.4 units (1.2 shows) | |
| Pads, frame, plates | fill `var(--surface-3)`, outline `--fg-frame` | outline carries it |
| Stack pin, path traces, zoom rings, direction arrows | `var(--accent)`; traces dashed 4 3, 1.5 units | |
| Floor | `var(--border)` 1 unit line from x 16 to 342 at y 258 | |

The app's muscle map uses `--map-line` for outlines; at the player's size that fails 3:1 in Silent Black (about 1.6:1), so the player uses `--fg-line` / `--fg-frame` instead, and paints only the inner facet lines with `--map-line`. This is the one deliberate difference from the muscle map look.

Low-poly rule: every body part is a straight-edged polygon (head = a skull-and-jaw shape, limbs = tapered 4-6 sided shapes, torso = 6-8 sided), with a round joint cap (12-sided, body fill) at shoulder, elbow (r 4.8), hip and knee so rotations never show gaps. An arm is one silhouette: the lower arm's outline and rim are drawn inside the upper arm's passes, so no outline arc crosses the elbow, and a small crease facet on the inner side of the elbow marks the joint. Clothing (T-shirt with a neckline and sleeve hem at mid upper arm, shorts above the knee, shoes with a sole and toe cap, a hair cap), the head (skull and jaw, an ear, and in side views a subtle nose and brow line; no eyes or mouth), and the hands (a palm, four fingers wrapping the handle, and a thumb: in side views a lit wedge along the top of the hand that crosses the handle; in the front view the index finger and thumb close as a ring round the dumbbell handle, drawn in the dumbbell group so it stays level with the head) are drawn as extra low-poly facets inside these same parts, never as new joints (`rig-final/RIG.md` section 20). Every fill, tone and stroke above is a theme token or a `color-mix()` of tokens; none is a literal colour outside the token definitions (`rig-final/gen.mjs`, `BASE_CSS` and `rigVars()`).

### 2.4 Rig

Units are stage viewBox units (1 unit is about 1 CSS px).

| Segment | Length | Drawn width (near to far end) |
|---|---|---|
| Head | a skull-and-jaw shape, not a plain octagon: about 20 wide (22.6 with the nose, side view; 23.8 with the ears, front view) x 23.2-23.6 tall | |
| Neck | 4 to 8 visible | 11 to 16, widening into the trapezius slope |
| Torso, hip joint to shoulder joint | 62 | 26-28 deep (side); 42 at the shoulders, 28 at the waist (front) |
| Upper arm | 38 | 11 to 12 |
| Forearm to grip centre | 40 | 9.8 at the elbow, 12.4 over the brachioradialis bulge (thumb side, 4 to 10 below the elbow), 8 at the wrist |
| Thigh | 50 | 17 to 12 |
| Shin, knee to ankle | 47 | 11 to 8 |
| Foot | heel -6 to toe 17.5 (23.5 long), sole at ankle + 5 | |

Figure detail (`rig-final/RIG.md` section 20), drawn as extra low-poly facets inside these same parts, never as new joints: a hair cap and sheen, an ear, and in side views a subtle nose and brow line (no eyes or mouth); a fitted T-shirt (collar band, sleeve hem at mid upper arm) over the torso and upper arm, shorts (hem above the knee) over the thigh, and a shoe (collar, toe cap, sole); each hand shows a palm, a thumb and four fingers wrapping the handle. Muscle facets (deltoid cap, pecs, lats, biceps, triceps, forearm taper, glutes, quads, hamstrings, calves) are cut inside the same body, upper-arm and lower-arm layers, split at a clothing hem where one crosses it. Equipment gains matching surface detail (section 7): grip ribs on handles, a top bevel on each weight plate, hex faces and a recessed end on the dumbbell heads, pulley and hub rims, and stitched pad seams.

Nesting (`<g>` per joint, each with its own class and keyframes): hip → torso → neck/head and shoulder → upper arm → elbow → forearm → hand → held equipment (handle, bar or dumbbell). Legs hang from the hip group. Equipment that the hand holds is nested in the hand group, so the grip can never come apart; the equipment's own track (carriage, cable, stack) is keyframed at the same percentages. Every body layer draws its outline, then its rim, then its fill, tone facets, glow and muscles (section 2.3), in that order, so no seam shows where parts overlap; an arm (upper and lower) is one such layer, so nothing crosses it at the elbow.

Side-view sign rule (figure faces right, +x). Every limb is drawn hanging straight down in its local frame. SVG `rotate(θ)`: positive = clockwise on screen.
- Torso lean back L degrees: `rotate(-L)` about the hip. Lean forward F: `rotate(+F)`.
- Arm swung forward by φ degrees (absolute, from straight down): relative rotate inside the torso = `-φ - torsoRotate`.
- Elbow bend b (0 = straight): forearm relative `rotate(-b)`.
- Foreshortening: when a limb points toward or away from the camera, its drawn length shrinks. Use `scaleY(f)` on the limb's shape group and `translate(0, 38*f px)` on the child joint group, both keyframed. `f` values are given per exercise.

Front view (lifter faces the viewer): the screen-right arm (lifter's left) lifted sideways by A: `rotate(-A)`; the screen-left arm `rotate(+A)`.
Top view (camera above): rules given per exercise.

Every rotate uses `transform-box: view-box; transform-origin: <x>px <y>px` at the joint's position in the setup pose. Held values were solved with a small 2-bone solver so the hand lands on the handle at each key pose (`scratchpad/render-guide/work/ik.py`).

### 2.5 Timing, captions and playback

Standard rep (presses, pulls, raises, curls, pushdowns): 4.0 s at 1x.

| Phase | % of rep | Time at 1x | Easing |
|---|---|---|---|
| Lift, press or pull | 0-25% (mid pose at 12.5%) | 1.0 s | minimum-jerk, `p(x) = 10x^3 - 15x^4 + 6x^5`; a solved pose every 0.5% of the rep (lat pulldown: every 0.25% in this phase), joined by straight lines |
| Hold | 25-37.5% | 0.5 s | hold |
| Lower or return | 37.5-87.5% (mid pose at 62.5%) | 2.0 s | minimum-jerk, `p(x) = 10x^3 - 15x^4 + 6x^5`; a solved pose every 0.5% of the rep |
| Reset pause | 87.5-100% | 0.5 s | hold |

Around the World: 5.0 s (out and over 0-40%, mid at 20%; hold 40-50%; back 50-90%, mid at 70%; pause 90-100%). Arm Circles: 2.0 s per circle, even speed (linear), two caption halves.

Technique (per FORMAT-RULES):
- Root style hole: `--play: running|paused; --dur: <seconds>s; --iter: 3|infinite` plus the theme variables. Every animated element: `animation-duration: var(--dur); animation-play-state: var(--play); animation-iteration-count: var(--iter); animation-fill-mode: both; animation-timing-function` as the table.
- Replay and restart swap two identical keyframe sets through one class hole on the stage wrapper: `class="stage gen-{{ gen }}"`, with CSS `.gen-a .mcp-uarm { animation-name: mcp-uarm-a }` and `.gen-b .mcp-uarm { animation-name: mcp-uarm-b }`.
- Paused before the first Play = the 0% keyframe = the setup pose. After 3 reps the 100% keyframe (same as 0%) holds.
- Captions are CSS-only: 4 `<span>`s stacked in the caption box, each with an opacity keyframe that is 1 only inside its phase window (hard steps: 0% 1, 24.99% 1, 25% 0, 100% 0, linear). They share the stage's `--dur`, `--play` and generation class, so they cannot drift from the figure. Idle and ended texts replace the stack through `sc-if`.
- Logic class timer (`setInterval` 200 ms while playing; cleared in `componentWillUnmount`) keeps elapsed time for the rep pill and, with loop off, ends playback after 3 x rep duration / speed: `playing=false, ended=true`.
- Speed change restarts from the setup pose (generation swap) and keeps playing. Reason: changing `animation-duration` mid-rep makes the figure jump.
- Pause holds the current frame (play state). Pictures mode pauses the animation.
- The real app will play this with the Web Animations API and `playbackRate` for speed, and never uses an endless loop; the canvas loop exists only so the owner sees movement.

### 2.6 Zoom

- State `zoom` = chip id or null. Tapping the active chip again sets null.
- The camera group `<g class="cam zoom-{{ zoom }}">` gets `transform: translate(179px,138px) scale(s) translate(-cx px,-cy px)`, transition 320ms `cubic-bezier(.32,.72,0,1)`; no transition under reduced motion.
- Each chip also shows its overlay (opacity 0 to 1 over 150ms): Grip = accent ring (r 12, 1.5 units) nested in the hand; Path = accent dashed trace of the hand's full path; Seat/Pad/Feet/Chest/Elbows/Shoulders/Arms = accent outline (2 units) on that part.
- Animation keeps running while zoomed, so the owner sees the grip or the path move up close.

### 2.7 Pictures mode

- The stage shows a 2 x 2 grid: padding 6, gap 6, tiles 169 x 128, `--surface-2`, radius `--radius-md`. Each tile: number badge (18px circle, `--accent-soft` fill, `--accent` 11px/700 number) at 6,6; the rig drawn statically in that key pose, fitted into 169 x 92 (reuse limb shapes through `<defs>` and `<use>`); an accent arrow for direction on tiles 2 and 4; caption 12px/16px `--text-2`, up to 2 lines, padding 0 8 6.
- Key poses: 1 = 0%, 2 = 12.5%, 3 = 31%, 4 = 62.5% (Around the World: 0, 20, 45, 70%; Arm Circles: see its block).
- A zoom chip in Pictures mode replaces the grid with one large still of pose 1 (pose 3 for Path) at that zoom, plus the caption bubble. The caption line under the still shows that picture's own caption (the words of tile 1 or tile 3), not the phase caption of the frozen frame, and no tempo note; all three players do the same.

### 2.8 Reduced motion and accessibility

- `@media (prefers-reduced-motion: reduce)`: the animated stage is hidden, the Pictures grid shows, the Animation button is disabled, zoom has no transition, the hint says pictures are shown on purpose. Never a blank stage. (The real app keys this off `reduced()` from `src/ui/motion.ts` and `html[data-motion="reduce"]`, not the media query.)
- Every control is a real `<button>` with a 44 px target; icon-only buttons have `aria-label`; chips and segment buttons carry `aria-pressed`.
- The SVG is `aria-hidden`. A visually hidden line gives the whole rep in words, e.g. "One rep: press out for 1 second, pause, back slowly for 2 seconds, reset."

### 2.9 THEMES object to paste into every artboard's logic

```js
const THEMES = {
  'silent-black': { bg:'#08090a', s1:'#0f1011', s2:'#141516', s3:'#1b1c1f', bSub:'rgba(255,255,255,0.06)', b:'rgba(255,255,255,0.10)', bStr:'rgba(255,255,255,0.18)', text:'#f7f8f8', t2:'#8a8f98', t3:'#62666d', acc:'#5e6ad2', accSoft:'rgba(94,106,210,0.16)', onAcc:'#ffffff', pos:'#4cc38a', warn:'#f2b544', neg:'#eb5757', info:'#6ea8fe', shadow:'0 16px 40px rgba(0,0,0,0.45)', mapBody:'#1b1c1f', mapLine:'rgba(255,255,255,0.10)', scheme:'dark', r:['8px','12px','16px','22px'] },
  'paper':        { bg:'#ffffff', s1:'#f7f6f3', s2:'#efeeea', s3:'#e6e4df', bSub:'rgba(55,53,47,0.08)', b:'rgba(55,53,47,0.14)', bStr:'rgba(55,53,47,0.26)', text:'#37352f', t2:'#6b6a66', t3:'#9b9a97', acc:'#2383e2', accSoft:'rgba(35,131,226,0.12)', onAcc:'#ffffff', pos:'#0f7b4f', warn:'#b7791f', neg:'#c0392b', info:'#2383e2', shadow:'0 8px 24px rgba(15,15,15,0.08)', mapBody:'#e6e4df', mapLine:'rgba(55,53,47,0.18)', scheme:'light', r:['6px','10px','14px','18px'] },
  'ember':        { bg:'#07080a', s1:'#0e1013', s2:'#14171b', s3:'#1c2026', bSub:'rgba(255,255,255,0.05)', b:'rgba(255,255,255,0.09)', bStr:'rgba(255,255,255,0.16)', text:'#ffffff', t2:'#9aa0a6', t3:'#5f666d', acc:'#ff6363', accSoft:'rgba(255,99,99,0.16)', onAcc:'#1a0b0b', pos:'#59d499', warn:'#ffb454', neg:'#ff6363', info:'#7aa7ff', shadow:'0 18px 44px rgba(0,0,0,0.5)', mapBody:'#1c2026', mapLine:'rgba(255,255,255,0.10)', scheme:'dark', r:['8px','12px','16px','20px'] },
  'emerald':      { bg:'#0f0f0f', s1:'#171717', s2:'#1c1c1c', s3:'#242424', bSub:'#242424', b:'#2e2e2e', bStr:'#393939', text:'#ededed', t2:'#a0a0a0', t3:'#707070', acc:'#3ecf8e', accSoft:'rgba(62,207,142,0.14)', onAcc:'#062d1c', pos:'#3ecf8e', warn:'#f5a623', neg:'#f04438', info:'#5fa8ff', shadow:'0 14px 36px rgba(0,0,0,0.45)', mapBody:'#242424', mapLine:'#393939', scheme:'dark', r:['6px','8px','12px','16px'] },
  'midnight':     { bg:'#0a2540', s1:'#0f2d4d', s2:'#143559', s3:'#1a3f68', bSub:'rgba(246,249,252,0.07)', b:'rgba(246,249,252,0.12)', bStr:'rgba(246,249,252,0.22)', text:'#f6f9fc', t2:'#a3b6cc', t3:'#6c839c', acc:'#635bff', accSoft:'rgba(99,91,255,0.18)', onAcc:'#ffffff', pos:'#3ecf8e', warn:'#ffbb00', neg:'#ff5c5c', info:'#00d4ff', shadow:'0 18px 44px rgba(3,20,40,0.55)', mapBody:'#1a3f68', mapLine:'rgba(246,249,252,0.14)', scheme:'dark', r:['8px','12px','16px','22px'] },
};
function themeVars(id) {
  const t = THEMES[id] || THEMES['silent-black'];
  return `color-scheme:${t.scheme};--bg:${t.bg};--surface-1:${t.s1};--surface-2:${t.s2};--surface-3:${t.s3};--border-subtle:${t.bSub};--border:${t.b};--border-strong:${t.bStr};--text:${t.text};--text-2:${t.t2};--text-3:${t.t3};--accent:${t.acc};--accent-soft:${t.accSoft};--on-accent:${t.onAcc};--positive:${t.pos};--warning:${t.warn};--negative:${t.neg};--info:${t.info};--shadow:${t.shadow};--map-body:${t.mapBody};--map-line:${t.mapLine};--radius-sm:${t.r[0]};--radius-md:${t.r[1]};--radius-lg:${t.r[2]};--radius-xl:${t.r[3]};--scrim:rgba(0,0,0,.5)`;
}
```

The derived player variables (`--fg-line`, `--fg-metal`, `--fg-cable`, `--muscle-main`, `--muscle-help`) are written in `<helmet><style>` on the root class, as `color-mix()` of these variables.

---

### 2.10 Muscle info on tap (owner request, 2026-09-27)

The owner: "when you click a muscle, show the common name, its real muscle name and info: the target muscle, the secondary muscles, with colours." Design, applied to every player and carried into the app (GUIDE-UPGRADE-ARCHITECTURE.md R1-15):

- **What you tap:** each coloured muscle region on the figure (the target muscle in `--muscle-main`, a helper in `--muscle-help`) is a hotspot: a halo plus a core. The halo is an invisible copy of the region's polygon inside the same animated group (so it follows the motion) with `fill:transparent; stroke:transparent; stroke-width:30px; pointer-events:all; vector-effect:non-scaling-stroke` (widened inline to 44 minus the region's shortest side for thin regions), which makes every hotspot at least 44 px on its short side at 1x; the core is a stroke-less copy (`stroke-width:0`) painted after every halo in drawing order, so a tap on a muscle's own paint always picks that muscle even where another muscle's halo overlaps it (decision D-R7). A region drawn as two polygons has two halos and two cores. Halos are painted last inside their layer, the target's after the helpers', so where two halos overlap the target wins. Hotspots carry `role="button"`, `tabindex="0"`, `aria-label="<Common name>, target muscle"` (or "helps"), `onClick` and `onKeyDown` (Enter or Space).
- **What shows:** the existing caption bubble at the bottom of the stage (`.bubble`), with the dot in the muscle's own colour (`--muscle-main` or `--muscle-help`) instead of the accent, and the text `<b>Chest</b> (pectoralis major), target. Pushes the handles away; hardest as the arms straighten.` The bubble is at most 2 lines (text under 100 characters; the caption check fails a third line). The tapped region gets a thin `--text` outline (`.mm.sel` / `.mh.sel`, 1.5 px) until it closes. The rep pill and the camera label stay (no zoom).
- **How it closes:** tap the same muscle again, tap the stage background, or tap a zoom chip (a zoom and a muscle bubble never show together: one state `bubble: {kind:'zoom'|'muscle', id}`). Animation keeps playing throughout. Pictures mode has no hotspots (the tiles are `<use>` clones); the app's About sheet lists the same muscles with the same colours for reduced-motion users (GU-2).
- **Names (common, anatomical), the app's 24 muscle ids** (`src/data/muscles.ts`; the demo uses the rig's region names on the right): chest, pectoralis major (`chest`); upper chest, clavicular pectoralis major; front delts, anterior deltoid (`frontDelts`); side delts, lateral deltoid (`sideDelts`); rear delts, posterior deltoid (`rearDelts`); rotator cuff, supraspinatus, infraspinatus, teres minor and subscapularis; biceps, biceps brachii (`biceps`); triceps, triceps brachii (`triceps`); brachialis, brachialis; forearms, forearm flexors and extensors (`forearms`); lats, latissimus dorsi (`lats`); mid back, rhomboids and middle trapezius (`midBack`); upper traps, upper trapezius (`upperTraps`); lower back, erector spinae; abs, rectus abdominis (`abs`); obliques, external and internal obliques (`obliques`); core, transversus abdominis; hip flexors, iliopsoas; quads, quadriceps femoris (`quads`); hamstrings, biceps femoris, semitendinosus and semimembranosus (`hamstrings`); glutes, gluteus maximus (`glutes`); adductors, hip adductors; abductors, gluteus medius and minimus; calves, gastrocnemius and soleus (`calves`).
- **Roles come from the exercise database:** target = `primary`, helps = `secondary` in `src/data/exercises.json` (the three demo exercises already match: chest press chest + front delts, triceps; lateral raise side delts + upper traps; lat pulldown lats + biceps, mid back). A test in the app fails when a movement's muscle list differs from its exercise row.
- **Lines for the three demo exercises** (own words; the app keeps a generic line per muscle for exercises without a written one):
  - Machine Chest Press: **Chest** (pectoralis major), target. Pushes the handles away; hardest as the arms straighten. **Front delts** (anterior deltoid), helps. Lifts the upper arms forward with the chest. **Triceps** (triceps brachii), helps. Straightens the elbows at the end of the press.
  - Dumbbell Lateral Raise: **Side delts** (lateral deltoid), target. Lifts the arms out to the sides; hardest near shoulder height. **Upper traps** (upper trapezius), helps. Steadies the shoulder blades; keep them down, no shrug.
  - Lat Pulldown: **Lats** (latissimus dorsi), target. Pulls the elbows down and back; hardest at the bottom. **Biceps** (biceps brachii), helps. Bends the elbows as the bar comes down. **Mid back** (rhomboids and middle trapezius), helps. Squeezes the shoulder blades together.
- **Checks** (`rig-final/muscle-tap-check.cjs`, shared, run by every `shoot.cjs`): every muscle with a role has its halo and core hotspots in the stage and their box is at least 44 x 44 px at t 0 and t 0.25; the check taps a point where the muscle is visible and fails if none exists (D-R9); tapping the target at t 0.3 shows the bubble with the exact text and the dot in the muscle colour; tapping again hides it; tapping a zoom chip replaces it with the chip caption and a second tap on the chip restores nothing (closed); the `.sel` outline is on the tapped region only; every muscle text fits 2 lines in Roboto; in Pictures mode no hotspot is hit-testable; hotspots never change the smoothness, muscle-visibility or zoom keep-clear checks (they are excluded by class); no page errors. The canvas artboards expose `tapChest`-style handlers, `bubbleDotStyle` and `bubbleHtml`-free plain text holes only (FORMAT-RULES: no markup in holes, so the bold common name is its own `<b>` hole: `<b>{{ bubbleName }}</b> {{ bubbleRest }}`).

## 3. A) The animations (3 in this demo)

The owner asked for exactly 3 animations in this demo: 3.1 Machine Chest Press, 3.2 Lat Pulldown and 3.5 Dumbbell Lateral Raise. Sections 3.3, 3.4 and 3.6-3.10 are kept as the design for later; they are not animated in this demo and have no player file. Their info blocks are what the About sheet shows.

Muscle patches are drawn on the rig as flat polygons: chest = front of the upper torso; upper chest = top third of that; front shoulders = front of the shoulder cap; side shoulders = outer cap (front view) or top of the cap (side view); rear shoulders = back of the cap; lats = back side of the torso from armpit to lower ribs; mid back = upper back between the shoulder blades; upper traps = slope from neck to shoulder; biceps = front of the upper arm; triceps = back of the upper arm; forearms = the forearm.

### 3.1 Machine Chest Press → `Player-MachineChestPress.dc.html`

- Camera: **side view**. Reason: only from the side can you see the handle height against the chest, the press path at chest height and the back staying on the pad.
- Equipment (simplified): base rail x 20-182, y 250-258; column x 88-100, y 52-250; top beam x 22-214, y 44-54; a lever arm hanging from the top beam: pivot (203.5, 58), 100 long to the grip centre, one group that turns about the pivot (5.2-wide bar, hub r 7), with the far lever the same shape offset (5, -3) in the far tones; vertical handle grip 6.4 x 26 at the end of the lever (`--fg-metal`), so it shows above and below the fist; seat pad x 118-200, y 214-224 on a post x 150-159; upright back pad x 124.5-137.5, y 108-212 on a bracket x 100-126, y 168-176; weight stack x 26-74 from y 112.5 (10 plates, 48 x 12, 1.5 gap, guide rods at x 32 and 68), pin (accent) at plate 6; cable from the stack's top bracket over a pulley at (55,61) r 5.2 and along y 55.8 to the lever hub.
- Anchors: hip (150,206); torso upright (0); shoulder (150,144); knee (200,206); ankle (200,253), foot flat. Grip centre x 181 → 226 on the lever arc (mid-chest): y 155.4 at both ends and 158 mid-press, as the lever turns 13 degrees each side of straight down. Setup elbow (144.5,166): 5.5 behind the shoulder, so the elbows sit a little behind the body. Stack top plates rise (grip x - 181) x 0.5 (0 → 22.5).
- Muscles painted: main Chest; helps Front shoulders, Triceps.

Biomechanics truth table (real body angles):

| Joint | Start (setup) | End (pressed) | Change | Rule |
|---|---|---|---|---|
| Shoulder | elbows a little behind the body, about 45-60 degrees out from the sides | arms reaching forward at chest height, about 80 degrees forward | about 95 degrees | moves |
| Elbow (inside angle) | about 90 degrees | about 160-165 degrees | about 70 degrees | moves; stops short of straight, no lockout slam |
| Wrist | straight | straight | 0 | fixed |
| Torso and back | upright, flat on the pad | same | 0 | fixed |
| Shoulder blades | back and down | back and down | 0 | fixed |
| Hips, knees (about 90), feet flat | | | 0 | fixed |

Rig key poses (3D pole-vector solve, RIG.md section 9: pole0 points at the setup elbow, pole1 = norm([0, 0.95, 1]), blended as p to the 4th power (QA round 3: the small end bend points down and a little out, so the side view shows it); grip z 42.99 → 6. SVG rotates relative to the parent; fu = upper-arm foreshortening. Timing is minimum-jerk (section 2.5); the hand's place on the press path is a fitted pace s = pace(PACE, p) of the minimum-jerk move progress p, not p itself (RIG.md sections 8 and 20; COACHING-DECISIONS.md D-S4), so grip x is linear in the path place s, not in p. Full table: `anim-machine-chest-press/PLAYER.md` sections 3 and 13):

| % | Grip (x,y) | Elbow (x,y) | Lever | Upper arm | fu | Forearm | Elbow inside | Arm out from side | Arm forward | Stack lift |
|---|---|---|---|---|---|---|---|---|---|---|
| 0, 87.5, 100 | (181,155.44) | (144.5,166) | 13 | 14.04 | 0.597 | -120.18 | 88.0 | 53.4 | -14.0 | 0 |
| 12.5, 62.5 | (203.16,158) | (163.86,164.03) | 0.19 | -34.69 | 0.641 | -64.04 | 101.2 | 50.1 | 34.7 | 11.08 |
| 25, 37.5 | (226,155.44) | (186.06,153.57) | -13 | -75.14 | 0.982 | -12.19 | 162.5 | 10.9 | 75.1 | 22.5 |

The 12.5/62.5% row is the pose at s = 0.5, a little short of the geometric midpoint of the press (grip x 203.5, lever 0): the fitted pace eases the hand in a little earlier so the elbow's angle stays smooth through the move (smoothness check (c) 2.64x lift / 2.67x return, RIG.md section 20).

Shoulder travel: arm forward -14.0 → 75.1 = 89.2 degrees (truth table: about 95; checked 88-100). QA round 3 gave up 4.5 degrees at the end so the pause shows a bend you can see from the side (elbow drawn at 167.8 degrees, 4.1 below the shoulder-to-grip line), not a lockout.

Captions: 0-25% "Press out, 1 s"; 25-37.5% "Pause, don't lock out"; 37.5-87.5% "Back slowly, 2 s"; 87.5-100% "Reset, light chest stretch". Tempo note "1 s out · 2 s back".

Zoom chips:

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 206, 157, 2.0 | Hold the middle of the handle. Wrists straight, not bent back. |
| Path | 204, 160, 1.6 | Handles stay at mid-chest height the whole way out and back. |
| Seat | 150, 190, 1.7 | Set the seat so the handles line up with the middle of your chest. |

Seat overlay: an accent outline on the seat pad only, open at its front end so it passes behind the near shin. The post is not outlined, because at this zoom most of it sits behind the tip. The Path tip does not say "straight": the lever arc puts the handles 2.6 lower mid-press.

Pictures: 1 "Setup: handles at mid-chest"; 2 "Press straight out"; 3 "Arms almost straight, no lock"; 4 "Back slowly, 2 s". A zoom chip in Pictures shows one still (pose 1, or pose 3 for Path), and the caption line under it shows that picture's caption.

Info block:
- Other names: chest press machine, machine press, seated chest press.
- Muscles: Main: Chest. Helps: Front shoulders, Triceps.
- Equipment: Machine (chest press).
- How to do it:
  1. Set the seat so the handles line up with the middle of your chest.
  2. Sit with your back flat on the pad and your feet flat on the floor.
  3. Push the handles straight out until your arms are almost straight.
  4. Bring them back slowly until you feel a light stretch across your chest.
- Tip: Keep your shoulder blades pulled back and down against the pad for the whole set.
- Common mistakes:
  - Seat at the wrong height, so the handles sit at your shoulders or your stomach. Fix: move the seat until the handles are at mid-chest.
  - Locking your elbows and letting the weights slam between reps. Fix: stop just before your arms are straight, and lower slowly so the plates touch lightly.

### 3.2 Lat Pulldown → `Player-LatPulldown.dc.html`

- Camera: **side view**. Reason: shows the small fixed lean, the bar coming down in front of the face to the top of the chest, and the thigh pad holding you down. The bar is drawn with the rig's slight view from the front and above (the view of the far leg: 0.25 across and 0.15 up for every unit of depth), 44 units long on screen, with both hands on it; the far arm is drawn in the far tones behind the head and body, for this player only (an exception to RIG section 7).
- Equipment: base rail x 16-262, y 250-258; upright x 72-84, y 36-250; top beam x 16-178, y 36-44; front pulley r 5.2 at (146.3, 39.2); rear pulley r 7 at (47, 47); cable bar middle → front pulley → beam → rear pulley → stack bracket; weight stack: the rig's 10 plates 48 x 12 at x 16-64 from y 112.5, pin at plate 7; seat pad x 118-186, y 214-224 on a post; thigh pad roller x 180-204, y 184-198 (radius 7) on a post; lat bar 150 long (ends bent down 6 over the last 27), hands 72 apart, the cable on its middle.
- Anchors: hip (150,206); torso leaned back 10 degrees, constant (`rotate(-10)`); shoulder (139.2,144.9); thighs horizontal under the pad; feet flat. Grip 14 out from each shoulder joint (hands 72 apart, about 1.2 times the outside shoulder width). Bar (grip centre) from (137.3, 65.9), just above the raised shoulder, forward and down above the head, down in front of the face at x 160 to 164.1 (y 106.1 to 142.9), onto the top of the chest at (157, 150), along one smooth curve. Stack lift 0 → 43.0 (half the cable travel).
- Muscles: main Lats; helps Biceps, Mid back.

| Joint | Start (arms up) | End (bar at chest) | Change | Rule |
|---|---|---|---|---|
| Shoulder | arms overhead, about 170 degrees | elbows down by the sides, slightly behind, about 20-30 degrees | about 140 degrees | moves |
| Elbow (inside angle) | about 170 degrees (not locked) | about 35 degrees (30-45) | about 140 degrees | moves |
| Shoulder blades | slightly raised at the top stretch | pulled down and back first | small | moves a little |
| Torso | leaned back about 10 degrees | same | at most 5 degrees | still; a small set lean, no swinging |
| Head | neutral, bar passes in front of the face | same | 0 | fixed |
| Hips, knees under the pad, feet flat | | | 0 | fixed |
| Wrists | straight | straight | 0 | fixed |

Key poses (bar = grip centre; angles are the solved 3D values; the keyframe values are in `anim-lat-pulldown/poses.json`):

| % | Bar (x, y) | Upper arm from torso line | Elbow inside | fu | ff | Stack lift |
|---|---|---|---|---|---|---|
| 0, 87.5, 100 | 137.29, 65.93 | 162.01 | 171 | 0.97 | 0.993 | 0 |
| 12.5, 62.5 | 160.17, 106.47 | 84.44 | 75.59 | 0.832 | 0.984 | 22.49 |
| 25, 37.5 | 157, 150 | 25.31 | 35.44 | 0.946 | 0.999 | 42.99 |

(Torso group `rotate(-10)` throughout.)

Captions: "Pull to your chest, 1 s" / "Squeeze, chest up" / "Up slowly, 2 s" / "Arms long, reset". Tempo note "1 s down · 2 s up".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 163, 119, 1.55 | Hands a little wider than your shoulders, thumbs around the bar. |
| Path | 150, 112, 1.4 | The bar comes down in front of your face to the top of your chest. |
| Pad | 197, 227, 1.9 | Thigh pad snug on your thighs, feet flat. It stops you lifting off. |

The Grip close-up also shows a small front view of both hands on the bar (thumbs in accent), because the side view cannot show hand width. Path cue for this player: the solid accent line shows the way still to go (from just below the hands to a target mark at the top of the chest), not the way already travelled (an exception to RIG section 10, because the hands hang from a cable). Why these values differ from the first draft (decisions D1-D3, signed off): `anim-lat-pulldown/PLAYER.md` section 9. The bar's path, the elbow's bend direction and the shoulder blades move as one smooth motion fitted to the smoothness check (`anim-lat-pulldown/PLAYER.md` section 7). A zoom chip in Pictures shows one still (pose 1, or pose 3 for Path), and the caption line under it shows that picture's caption.

Pictures: 1 "Thighs under the pad, arms long"; 2 "Drive your elbows down"; 3 "Bar to the top of your chest"; 4 "Up slowly, 2 s".

Info block:
- Other names: wide grip pulldown, lat pull down.
- Muscles: Main: Lats. Helps: Biceps, Mid back.
- Equipment: Cable / Machine (lat pulldown station). Link chip: "See the machine".
- How to do it:
  1. Set the thigh pad so your thighs fit snugly under it, feet flat.
  2. Hold the bar a little wider than your shoulders and sit down with your arms straight.
  3. Lean back slightly, then pull the bar to the top of your chest, driving your elbows down.
  4. Let the bar rise slowly until your arms are straight again.
- Tip: Think of pulling with your elbows, not your hands.
- Common mistakes:
  - Leaning far back and swinging to move the weight. Fix: keep a small lean that does not change; use less weight if you have to swing.
  - Pulling the bar behind your neck. Fix: always pull in front, to the top of your chest.

### 3.3 Incline Machine Press → `Player-InclineMachinePress.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **side view**. Reason: shows the reclined back and that the press goes up and out along the line of the upper chest, not straight up.
- Equipment: base rail x 50-300, y 250-258; seat x 128-196, y 214-224 on a post; back pad 12 x 100 reclined 30 degrees behind the torso; column x 80-92, y 40-250; angled track parallel to the press path, 60 units above it (from about (96,114) to (196,56)), carriage with a 60-unit rod down to the handle; stack x 26-74, y 112-246, pin at plate 6; cable from the carriage over a pulley at (86,44) to the stack.
- Anchors: hip (160,206); torso reclined 30 degrees (`rotate(-30)`), constant; shoulder (129,152.3). Handle path runs 30 degrees above level (at right angles to the torso): start (152.2,150.5), end (199.8,123.0), 55 units. Stack lift 0 → 27.5.
- Muscles: main Upper chest; helps Front shoulders, Triceps, Chest.

| Joint | Start | End | Change | Rule |
|---|---|---|---|---|
| Shoulder | elbows a little behind the body, 45-60 degrees out from the sides | arms pointing up and forward in line with the upper chest | about 95 degrees | moves |
| Elbow (inside angle) | about 90 degrees | about 160 degrees | about 70 degrees | moves; no lockout slam |
| Torso | flat on the reclined pad (30 degrees back) | same | 0 | fixed; lower back stays on the pad |
| Wrists | stacked over the elbows, straight | same | 0 | fixed |
| Hips, knees, feet flat | | | 0 | fixed |

| % | Handle (x,y) | Upper arm | fu | Forearm | Stack lift |
|---|---|---|---|---|---|
| 0, 87.5, 100 | (152.2,150.5) | +65.4 | 0.55 | -153.5 | 0 |
| 12.5, 62.5 | (176.4,136.5) | -25.3 | 0.80 | -90.6 | 14 |
| 25, 37.5 | (199.8,123.0) | -71.5 | 1.00 | -21.4 | 27.5 |

Captions: "Press up and out, 1 s" / "Pause, don't lock out" / "Back slowly, 2 s" / "Reset at your upper chest". Tempo note "1 s out · 2 s back".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 176, 137, 2.0 | Wrists stacked over your elbows, handles in the middle of your palm. |
| Path | 165, 135, 1.5 | Press up and out along the line of your upper chest. |
| Seat | 150, 180, 1.6 | Set the seat so the handles start at your upper chest, not your shoulders. |

Pictures: 1 "Setup: handles at upper chest"; 2 "Press up and out"; 3 "Almost straight, no lock"; 4 "Back slowly, 2 s".

Info block:
- Other names: incline chest press machine.
- Muscles: Main: Upper chest. Helps: Front shoulders, Triceps, Chest.
- Equipment: Machine (incline press).
- How to do it:
  1. Set the seat so the handles start level with your upper chest.
  2. Sit with your back flat on the pad and your feet flat on the floor.
  3. Press the handles up and out until your arms are almost straight.
  4. Lower slowly until your hands are back at your upper chest.
- Tip: Keep your chest up and shoulder blades back so your shoulders don't roll forward.
- Common mistakes:
  - Seat too low, so the handles start above your shoulders and your shoulders take over. Fix: raise the seat until the handles line up with your upper chest.
  - Arching your lower back off the pad to push more. Fix: keep your back and hips on the pad; lower the weight if you can't.

### 3.4 Seated Cable Row → `Player-SeatedCableRow.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **side view**. Reason: shows the handle coming to the lower ribs, the elbows going past the body, and the torso staying tall.
- Equipment: long low bench x 40-228, y 224-234 on two legs; footplate 10 x 40 tilted 15 degrees, centred (244,222); tower x 280-334, y 60-250 with plates x 288-326, y 110-246 and pin (accent); low pulley r 7 at (274,232); cable from the handle to the pulley (drawn behind the legs); V-handle (small V shape, `--fg-metal`) in the hand.
- Anchors: hip (140,216); thighs pointing forward and slightly up, knees softly bent (about 25 degrees); feet on the footplate. Handle y 190 (lower ribs), x 216 → 162. Stack lift 0 → 27.
- Muscles: main Mid back; helps Lats, Biceps, Rear shoulders.

| Joint | Start (arms long) | End (handle at ribs) | Change | Rule |
|---|---|---|---|---|
| Shoulder | arms reaching forward and a little down, upper arm about 50 degrees forward of the body | elbows past the body, upper arm about 28 degrees behind | about 75-80 degrees | moves |
| Elbow (inside angle) | about 155-160 degrees | about 65-90 degrees | about 90 degrees | moves |
| Shoulder blades | let forward a little | squeezed together | small | moves |
| Torso | up to 8 degrees forward at the stretch | upright | at most 10 degrees | nearly still; never rocks back past upright |
| Knees | soft bend, about 25 degrees | same | 0 | fixed |
| Feet on plates, head neutral, wrists straight | | | 0 | fixed |

| % | Torso | Handle (x,y) | Upper arm | Forearm | Stack lift |
|---|---|---|---|---|---|
| 0, 87.5, 100 | +8 (forward) | (216,190) | -57.3 | -25.3 | 0 |
| 12.5, 62.5 | 0 | (189,190) | -13.7 | -77.6 | 13.5 |
| 25, 37.5 | 0 | (162,190) | +28.1 | -114.6 | 27 |

Captions: "Pull to your ribs, 1 s" / "Squeeze your back" / "Arms long slowly, 2 s" / "Sit tall, reset". Tempo note "1 s in · 2 s out".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 189, 190, 2.0 | Palms facing each other on the V-handle, wrists straight. |
| Path | 175, 180, 1.5 | Pull to your lower ribs with your elbows close to your sides. |
| Feet | 236, 222, 2.2 | Feet on the plates, knees slightly bent. Your legs stay still. |

Pictures: 1 "Sit tall, knees soft, arms long"; 2 "Pull to your lower ribs"; 3 "Squeeze your shoulder blades"; 4 "Arms long slowly, 2 s".

Info block:
- Other names: cable row, seated row.
- Muscles: Main: Mid back. Helps: Lats, Biceps, Rear shoulders.
- Equipment: Cable (low row station, V-handle).
- How to do it:
  1. Sit with your feet on the plates and your knees slightly bent.
  2. Hold the handle with straight arms and sit tall.
  3. Pull the handle to your lower ribs, squeezing your shoulder blades together.
  4. Let your arms go straight again slowly, without rounding your back.
- Tip: Lead with your elbows and keep them close to your sides.
- Common mistakes:
  - Rocking your body back and forth to move the weight. Fix: sit tall and keep still; only your arms and shoulder blades move.
  - Shrugging your shoulders up toward your ears. Fix: keep your shoulders down and pull toward your ribs.

### 3.5 Dumbbell Lateral Raise → `Player-DumbbellLateralRaise.dc.html`

- Camera: **front view**. Reason: the arms move out to the sides, so only the front shows how high they go and that the shoulders stay down.
- Equipment: two hex dumbbells, seen end-on from a little above (hex end face r 5.8, squashed to 0.92 tall, `--fg-metal`; the handle end is metal, not accent), the head centred 13.3 below the grip so the whole hand, holding a knurled handle, shows above the weight; floor.
- Anchors: standing, feet hip-width; hip joints (169,156) and (189,156); shoulders (157,94) and (201,94), fixed height (no shrug); head centre (179,73) (at 77 the chin covered the neck).
- Arms: screen-right arm `rotate(-A)`, screen-left `rotate(+A)`; forearm keeps a constant 15-degree soft bend (screen-right `rotate(+15)`, screen-left `rotate(-15)`), so at the top the hands sit a little below the elbows. Right hand travels (206.8,171.2) → (277.2,107).
- Muscles: main Side shoulders; helps Upper traps.

| Joint | Start | End | Change | Rule |
|---|---|---|---|---|
| Shoulder (out to the side) | about 10-15 degrees, weights beside the thighs | about 85-90 degrees, arms level with the shoulders | about 75 degrees | moves; never above shoulder height |
| Elbow | soft bend, about 15 degrees | same | 0 | fixed |
| Wrist | straight, palms in at the bottom, facing down at the top | same | 0 | fixed |
| Shoulder height (shrug) | down | down | 0 | fixed |
| Torso, knees soft | upright | upright | 0 | fixed; no swing |

| % | A (degrees) | Forearm (relative) |
|---|---|---|
| 0, 87.5, 100 | 12 | 15 |
| 12.5, 62.5 | 50 | 15 |
| 25, 37.5 | 88 | 15 |

Captions: "Raise to shoulder height, 1 s" / "Pause, shoulders down" / "Lower slowly, 2 s" / "Reset at your sides". Tempo note "1 s up · 2 s down".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Shoulders | 179, 90, 2.2 | Keep your shoulders down, away from your ears. No shrug. |
| Path | 179, 135, 1.2 | Out to the sides and up to shoulder height, no higher. |
| Elbows | 179, 113, 2.2 | A soft bend in your elbows that stays the same up and down. |

Why these chips (final rig, `rig-final/RIG.md` sections 15 and 17): the first draft's Grip chip (242, 139, 2.0) "Light grip. Palms face the floor at the top." became Shoulders (179, 90, 2.2), because the whole hand now shows above the smaller, lower dumbbell head, but a light grip and which way the palms face still cannot be seen from the front; shrugging is a listed common mistake and this view shows it. Path moved from (179, 120, 1.25) to (179, 135, 1.2), because at 120 the bottom of the path sat under the caption bubble. Elbows moved from (224, 113) to (179, 113), because at 224 the screen-left elbow ring was cut by the stage edge and left the stage near the top of the rep. Grip close-ups stay on Machine Chest Press and Lat Pulldown. Overlays: Shoulders draws accent lines just off both shoulder slopes and two "keep down" arrows; Path uses the always-on dashed hand paths and growing trails; Elbows puts an accent ring on each elbow that moves with the arm.

Pictures: 1 "Stand tall, elbows soft"; 2 "Lift out to the sides"; 3 "Stop at shoulder height"; 4 "Lower slowly, 2 s". A zoom chip in Pictures shows one still (pose 1, or pose 3 for Path), and the caption line under it shows that picture's caption.

Info block:
- Other names: lateral raise, side raise, db lateral raise.
- Muscles: Main: Side shoulders. Helps: Upper traps.
- Equipment: Dumbbells.
- How to do it:
  1. Stand tall with a dumbbell in each hand at your sides, elbows slightly bent.
  2. Raise both arms out to the sides, leading with your elbows.
  3. Stop when your arms reach shoulder height.
  4. Lower slowly back to your sides.
- Tip: Go light. Your side shoulders are small muscles; clean reps beat heavy swings.
- Common mistakes:
  - Swinging your body to get the weights up. Fix: stand still and use a lighter pair.
  - Shrugging your shoulders toward your ears. Fix: keep your shoulders down and stop at shoulder height.

### 3.6 Rear Delt Fly (machine) → `Player-RearDeltFly.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **top view** (from above). Reason: the arms sweep in a flat circle, which only shows its true size from above.
- Equipment (seen from above): weight stack end x 159-199, y 14-40 with pin; column x 169-189, y 30-124; chest pad x 161-197, y 134-147; seat under the body x 155-203, y 150-200 (mostly hidden); two machine arms, each a bar from a hub at the shoulder to the handle, rotating with the lifter's arm; hubs drawn as rings r 6 (`--fg-line`, no fill) over the shoulders; vertical handles seen from above as circles r 4 (`--fg-metal`) in the hands.
- Anchors: shoulders (157,160) and (201,160); head (179,158) r 12 drawn over the shoulder line; arms drawn pointing forward (up the screen), length 76.
- Left arm rotates about (157,160): `rotate(+10)` → `rotate(-85)`; right arm mirrored (`-10` → `+85`). Soft bend: left forearm `rotate(+12)`, right `rotate(-12)`, constant. Hands start near (170,85) and (188,85) and end near (81,153) and (277,153), about 5 degrees in front of the shoulder line.
- Muscles: main Rear shoulders; helps Mid back.

| Joint | Start | End | Change | Rule |
|---|---|---|---|---|
| Shoulder (sweep in a flat circle) | arms straight out in front at shoulder height, hands close | arms in line with the shoulders | about 90-95 degrees | moves; stop at the shoulder line |
| Elbow | soft bend, about 10-15 degrees | same | 0 | fixed; do not turn it into a row |
| Chest | on the pad | on the pad | 0 | fixed |
| Shoulder height | down | down | 0 | fixed; no shrug |
| Wrists | straight, palms facing each other | same | 0 | fixed |

| % | Left arm | Right arm |
|---|---|---|
| 0, 87.5, 100 | +10 | -10 |
| 12.5, 62.5 | -40 | +40 |
| 25, 37.5 | -85 | +85 |

Captions: "Sweep out wide, 1 s" / "Pause, arms in line" / "Back slowly, 2 s" / "Reset, arms in front". Tempo note "1 s out · 2 s back".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 130, 120, 1.9 | Palms facing each other, light grip. Your hands just hold on. |
| Path | 179, 125, 1.25 | A wide, flat arc until your arms line up with your shoulders. |
| Chest | 179, 145, 2.2 | Chest stays on the pad the whole time. No leaning back. |

Pictures: 1 "Chest on pad, arms in front"; 2 "Sweep out wide"; 3 "Arms in line with shoulders"; 4 "Back slowly, 2 s".

Info block:
- Other names: reverse pec deck, rear delt machine fly.
- Muscles: Main: Rear shoulders. Helps: Mid back.
- Equipment: Machine (pec deck set for rear delts).
- How to do it:
  1. Set the handles to the back position and the seat so the handles are at shoulder height.
  2. Sit facing the pad with your chest on it, arms straight out in front holding the handles.
  3. Sweep your arms out and back in a wide arc until they line up with your shoulders.
  4. Bring them back slowly, stopping before the weights touch.
- Tip: Think of reaching your hands out wide to the walls, not pinching your shoulder blades.
- Common mistakes:
  - Bending and straightening your elbows so it turns into a row. Fix: set a soft bend and keep it the same.
  - Shrugging or lifting your chest off the pad. Fix: stay on the pad with your shoulders down; use less weight.

### 3.7 Dumbbell Biceps Curl → `Player-DumbbellBicepsCurl.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **side view**. Reason: shows the elbow staying pinned at the side while only the forearm moves.
- Equipment: dumbbell seen end-on in the hand (the shared rig's hex dumbbell: end face r 5.8, centred 13.3 below the grip, knurled handle; RIG.md §7); floor.
- Anchors: standing, hip (170,156), torso upright, shoulder (170,94), elbow near (170,132).
- Muscles: main Biceps; helps Forearms.

| Joint | Start | End | Change | Rule |
|---|---|---|---|---|
| Elbow (inside angle) | about 170-175 degrees (straight, not forced) | about 40-45 degrees | about 130 degrees | moves |
| Shoulder | upper arm straight down at the side | at most 5 degrees forward | at most 5 degrees | pinned |
| Wrist | straight, palm facing forward and up | same | 0 | fixed; no curling the wrist |
| Torso, knees soft | upright | upright | 0 | fixed; no swing or lean back |

| % | Upper arm | Forearm | Hand (x,y) |
|---|---|---|---|
| 0, 87.5, 100 | 0 | -5 | (173.5,171.8) |
| 12.5, 62.5 | -3 | -70 | |
| 25, 37.5 | -5 | -135 | (198.8,102.2) |

Captions: "Curl up, 1 s" / "Squeeze at the top" / "Lower slowly, 2 s" / "Arms straight, reset". Tempo note "1 s up · 2 s down".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 186, 137, 1.9 | Palms face forward and stay facing up as you curl. |
| Path | 185, 137, 1.5 | The dumbbell swings up in an arc; your elbow stays in one place. |
| Elbows | 171, 132, 2.4 | Elbows pinned at your sides from start to finish. |

Pictures: 1 "Arms straight, palms forward"; 2 "Bend at the elbow only"; 3 "Squeeze at the top"; 4 "Lower slowly, 2 s".

Info block:
- Other names: db biceps curl, dumbbell curl, db curl.
- Muscles: Main: Biceps. Helps: Forearms.
- Equipment: Dumbbells.
- How to do it:
  1. Stand tall with a dumbbell in each hand, arms straight, palms facing forward.
  2. Keeping your elbows at your sides, curl the weights up toward your shoulders.
  3. Squeeze at the top for a moment.
  4. Lower slowly until your arms are straight.
- Tip: Only your forearms should move. If your elbows drift forward, the weight is too heavy.
- Common mistakes:
  - Swinging your body to lift the weight. Fix: stand still, brace your stomach, use a lighter pair.
  - Stopping short at the bottom. Fix: lower all the way to straight arms every rep.

### 3.8 Single-Arm Triceps Pushdown → `Player-SingleArmTricepsPushdown.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **side view**. Reason: shows the elbow tucked at the side and the forearm swinging down to a straight arm.
- Equipment: cable tower x 218-246, y 30-250 with plates x 222-242, y 150-246 and pin; high pulley r 6 at (214,40) on a short arm; cable drawn as a line from the pulley that rotates about (214,40) and stretches (`scaleY`) to meet the handle; single D-handle in the hand.
- Anchors: hip (160,156); torso leaned forward 10 degrees (`rotate(+10)`), constant; shoulder (170.8,94.9); upper arm straight down at the side (relative `rotate(-10)`), elbow (170.8,132.9). The other arm is hidden behind the body.
- Muscles: main Triceps; helps Forearms.

| Joint | Start | End | Change | Rule |
|---|---|---|---|---|
| Elbow (inside angle) | about 90 degrees, forearm level with the floor | about 175 degrees, arm straight | about 85 degrees | moves |
| Shoulder | upper arm at the side | same | at most 5 degrees | pinned |
| Torso | leaned forward about 10 degrees | same | 0 | fixed; no pushing with body weight |
| Wrist | straight | straight | 0 | fixed |
| Knees soft, feet hip-width | | | 0 | fixed |

| % | Forearm | Hand (x,y) | Cable rotate about (214,40) | Cable length | Stack lift |
|---|---|---|---|---|---|
| 0, 87.5, 100 | -90 | (210.8,132.9) | +2.0 | 93 | 0 |
| 12.5, 62.5 | -45 | (199.1,161.2) | +7.0 | 122 | 14.5 |
| 25, 37.5 | -5 | (174.3,172.7) | +16.7 | 138.5 | 23 |

Captions: "Push down, 1 s" / "Squeeze, arm straight" / "Up slowly, 2 s" / "Reset at a right angle". Tempo note "1 s down · 2 s up".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 192, 153, 2.0 | Palm facing down on the handle, wrist straight. |
| Path | 192, 150, 1.5 | Push down until your arm is straight, hand beside your thigh. |
| Elbow | 171, 133, 2.4 | Elbow tucked at your side. Only your forearm moves. |

Pictures: 1 "Elbow at side, forearm level"; 2 "Push down, elbow still"; 3 "Arm straight, squeeze"; 4 "Up slowly, 2 s".

Info block:
- Other names: unilateral pushdown, one arm pushdown.
- Muscles: Main: Triceps. Helps: Forearms.
- Equipment: Cable (high pulley, single handle).
- How to do it:
  1. Set the pulley high and clip on a single handle.
  2. Stand facing it, hold the handle in one hand, elbow tucked at your side.
  3. Push the handle down until your arm is straight.
  4. Let it rise slowly until your forearm is about level with the floor.
- Tip: Lean forward a little and keep that lean the same; it keeps your shoulder out of the move.
- Common mistakes:
  - Your elbow drifts forward and up as the handle rises. Fix: keep the elbow pinned at your side and stop the return at a right angle.
  - Leaning over the handle to push with your body weight. Fix: keep a small, steady lean and use less weight.

### 3.9 Dumbbell Around the World (Lying) → `Player-AroundTheWorld.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **top view** (from above). Reason: the arms sweep a half-circle along the bench, and only the view from above shows the whole half-circle.
- Equipment: flat bench x 161-197, y 50-244, radius 6; two dumbbells, each seen from above as a bar with two heads (22 units long) lying across the palm, at right angles to the forearm.
- Anchors: head (179,76) r 12; shoulders (157,102) and (201,102); hips at y 160; knees (170,212) and (188,212); feet on the floor beside the bench end at (160,250) and (198,250).
- Arms drawn pointing toward the feet, length 75.7 (78 x 0.97 for the soft bend, which points toward the ceiling and so only shortens the arm from above). Left arm `rotate(+θ)`, right arm `rotate(-θ)` about the shoulders. θ = 15 (weights beside the hips) → 178 (over the head, weights almost touching).
- Muscles: main Chest, Front shoulders; helps Upper chest, Triceps.

| Joint | Start | End | Change | Rule |
|---|---|---|---|---|
| Shoulder (half-circle along the bench) | arms by the hips, about 15 degrees out | arms over the head, about 178 degrees | about 160 degrees | moves |
| Elbow | soft bend, about 15 degrees | same | 0 | fixed |
| Wrist and grip | palms up, dumbbells level | same | 0 | fixed |
| Arm height | at bench level, never dropped far below | same | small | controlled |
| Back, hips, feet | flat on the bench, feet on the floor | same | 0 | fixed |

| % | θ (degrees) |
|---|---|
| 0, 90, 100 | 15 |
| 20, 70 | 100 |
| 40, 50 | 178 |

Captions (5 s rep): 0-40% "Out and over, 2 s"; 40-50% "Pause over your head"; 50-90% "Back to your hips, 2 s"; 90-100% "Reset, palms up". Tempo note "2 s over · 2 s back".

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Grip | 137, 175, 2.4 | Palms facing up, dumbbells held level. |
| Path | 179, 110, 1.15 | A wide half-circle from your hips to over your head, at about bench height. |
| Elbows | 125, 110, 1.9 | A soft bend in your elbows that never changes. |

Pictures (0, 20, 45, 70%): 1 "Palms up, weights by your hips"; 2 "Sweep out to the sides"; 3 "Meet over your head"; 4 "Same path back, 2 s".

Info block:
- Other names: around the world, dumbbell around the world, lying around the world, around the world fly, dumbbell circles.
- Muscles: Main: Chest, Front shoulders. Helps: Upper chest, Triceps. (From `gap.json`; confirm when the library row is added.)
- Equipment: Dumbbells and a flat bench.
- How to do it:
  1. Lie on a flat bench with your feet on the floor and a light dumbbell in each hand by your hips, palms up.
  2. With a soft bend in your elbows, sweep your arms out to the sides in a wide half-circle.
  3. Keep going until the dumbbells almost meet over your head.
  4. Bring them back the same way, slowly, to your hips.
- Tip: Use light dumbbells. The long arm path makes small weights feel heavy on the shoulders.
- Common mistakes:
  - Going heavy and bending the elbows to force it round. Fix: pick lighter weights and keep the same soft bend all the way.
  - Letting your arms drop far below the bench at the sides. Fix: keep them at about bench height and stop where you feel a stretch, not pain.

### 3.10 Arm Circles (warm-up move) → `Player-ArmCircles.dc.html` (not animated in this demo; owner: exactly 3)

- Camera: **three-quarter front view** (body turned about 35 degrees). Reason: from straight in front a circle looks like an up-and-down line; turned a little, it shows as a circle and both arms stay in view.
- Equipment: none; floor.
- Anchors: standing; hips y 156; near shoulder (200,94), far shoulder (160,94); head (178,77); arms straight out to the sides at shoulder height, drawn length 64 (78 shortened by the turn); near arm points to the screen right, far arm to the left, far arm fill `color-mix(in srgb, var(--map-body) 80%, var(--surface-1))`.
- Circle (forward: over the top going forward): each arm rotates a few degrees about its shoulder and stretches a little so the hand traces an oval (7 degrees up and down, length 93-107%).

| % of circle | Near arm (rotate, length) | Far arm (rotate, length) | Point |
|---|---|---|---|
| 0, 100 | 0, 0.93 | 0, 1.07 | back |
| 25 | -7, 1.00 | +7, 1.00 | top |
| 50 | 0, 1.07 | 0, 0.93 | front |
| 75 | +7, 1.00 | -7, 1.00 | bottom |

Linear timing, 2.0 s per circle, 3 circles. Captions: 0-50% "Up and over, arms long"; 50-100% "Down and round, shoulders relaxed". Tempo note "about 2 s a circle". The rep pill reads "Circle 1 of 3".

| Joint | Start | During | Rule |
|---|---|---|---|
| Shoulder | arms out at shoulder height | small circles, then bigger over the set | moves |
| Elbow | straight, not locked | same | fixed |
| Shoulder height | down, relaxed | same | fixed; no shrug |
| Torso, legs | tall, feet hip-width | same | fixed |

| Chip | cx, cy, scale | Caption |
|---|---|---|
| Arms | 232, 96, 1.8 | Arms straight out at shoulder height, palms down. |
| Size | 264, 94, 2.6 | Start with small circles and make each one a bit bigger. (Shows a small and a large oval trace.) |
| Shoulders | 180, 92, 2.2 | Shoulders down and relaxed, away from your ears. |

Pictures: 1 "Arms out at shoulder height"; 2 "Small circles forward" (small oval trace); 3 "Make them bigger" (large oval trace); 4 "Then 10 circles backward" (reversed arrows).

Info block:
- Other names: shoulder circles, arm rotations.
- Muscles (warms up): Front shoulders, Side shoulders, Rear shoulders, Rotator cuff.
- Equipment: none.
- How to do it:
  1. Stand tall, feet hip-width, arms straight out to the sides at shoulder height.
  2. Make small forward circles, about the size of a fist.
  3. Make each circle a little bigger, 10 in all.
  4. Reverse and do 10 backward.
- Tip: Keep it easy. This warms your shoulders up; it should not tire them.
- Common mistakes:
  - Shrugging your shoulders up. Fix: keep them down and relaxed.
  - Starting with big, fast circles. Fix: start small and slow, then build up.

---

## 4. B) Machine guide: lat pulldown station

Opened from the Lat Pulldown About sheet through the chip "See the machine". Sheet title: **"Lat pulldown station"**.

Diagram: 358 x 300 stage, the same side view and coordinates as `Player-LatPulldown` but without the person, plus a handle hook on the upright (x 84-96, y 90) holding a V-handle and a single D-handle. Numbered markers (circle r 13, `--surface-3` fill, `--fg-line` outline, 12px/700 number; selected = `--accent` fill, `--on-accent` number, part outlined in accent 2 units), each with a 44 x 44 transparent hit area.

| # | Part id | Label | Marker at | Tip | Mistake it prevents |
|---|---|---|---|---|---|
| 1 | seat | Seat | (152,219) | Set the height so your feet are flat and your knees fit snugly under the pad. | Feet dangling, so you can't brace. |
| 2 | thigh_pad | Thigh pad | (192,176) | Lower it until it presses lightly on the tops of your thighs. | Lifting off the seat when the weight gets heavy. |
| 3 | bar | Bar and grip | (156,60) | Hold a little wider than your shoulders, thumbs around the bar. | A very wide grip that cuts the pull short. |
| 4 | cable | Cable and top pulley | (156,26) | Sit so the cable hangs straight down in front of your face. | Pulling at an angle, which makes you lean back and swing. |
| 5 | stack | Weight stack and pin | (50,180) | Push the pin all the way into the plate you want. Lower gently so the plates don't clank. | A loose pin, and letting the weight crash down. |
| 6 | handles | Handle options | (90,100) | Wide bar for Lat Pulldown, V-handle for Close-Grip Pulldown, single handle for Single-Arm Lat Pulldown. Check the clip is closed. | A handle coming loose mid-set. |

Below the diagram: the selected part in a card (title "2 · Thigh pad", tip 15px `--text`, line "Stops: Lifting off the seat when the weight gets heavy." 13px `--text-2`). Default selected: 2 (thigh pad, the setting most people skip). Then the full part list as pressable rows (label + first sentence of the tip as hint). Then **"Exercises on this machine"** (library): Lat Pulldown (wide bar), Close-Grip Pulldown (V-handle), Underhand Lat Pulldown (bar, palms facing you), Single-Arm Lat Pulldown (single handle).

Build note (from the `guide.json` review): the equipment text "Machine" is shared by 21 different machines, so the build maps each exercise id to its machine (not the equipment text). For this split: Machine Chest Press → chest press machine; Incline Machine Press → incline press machine; Lat Pulldown and Single-Arm Lat Pulldown → lat pulldown station; Seated Cable Row → low row station; Rear Delt Fly → pec deck; Single-Arm Triceps Pushdown → cable tower. Only the lat pulldown station is drawn in this demo, so only Lat Pulldown shows the "See the machine" chip here.

---

## 5. C) Warm-up for SPLIT 1 UPPER BODY

### 5.1 What the split works (the app's own weighting)

Weight per muscle = sets x role weight (main 1, helps 0.55; `ROLE_WEIGHT` in `src/brain/exposure.ts`), rolled up by muscle group from `src/data/muscles.ts`.

| Group | Muscles (weight) | Group score |
|---|---|---|
| Arms | Triceps 5.3, Biceps 5.3, Forearms 2.2 | 12.8 |
| Back | Mid back 5.75, Lats 4.65, Upper traps 1.65 | 12.05 |
| Shoulders | Rear shoulders 3.65, Front shoulders 3.3, Side shoulders 3.0 | 9.95 |
| Chest | Chest 4.65, Upper chest 3.0 | 7.65 |
| Core, Legs | none | 0 |

Rule change: the `warmup.json` design kept at most 3 groups, which would drop Chest here even though two presses train it (the review found the same flaw on the Full body templates). The rule becomes: keep every group scoring at least 20% of the top group (here all 4), no group cap; keep the sheet short by capping moves at 1 raise + up to 5 targeted moves and choosing moves that cover more than one group.

How other splits map (same rule, no split names involved): upper day → chest, back, shoulders, arms moves; arms day → arms moves; lower day (SPLIT 2 - LOWER AND CORE) → legs and core moves; a custom split → whatever muscles its exercises work.

### 5.2 The moves (about 6 minutes)

| # | Move | Dose | Cue (one line) | Warms | Demo |
|---|---|---|---|---|---|
| 1 | Jumping jacks (raise) | 90 s | Easy pace. Breathing a bit faster, not out of breath. | Whole body | Still pose: star shape (front view), in/out arrows |
| 2 | Arm circles | 10 forward, then 10 back | Arms out at shoulder height. Start small and make each circle bigger. | Front, side and rear shoulders, rotator cuff | Still pose: front view, arms out at shoulder height, with "Animation comes with the form-guide update." (no player in this demo) |
| 3 | Wall push-ups | 12 slow | Hands on the wall at chest height. Lower your chest to the wall, then push away. | Chest, front shoulders, triceps | Still pose: side view, leaning on a wall, elbows bent |
| 4 | Air pulldowns | 10 | Reach up tall, then pull your elbows down to your ribs and squeeze your back. | Lats, mid back | Still pose: front view, elbows down, faint arms overhead |
| 5 | Bent-over Y-T-W | 5 of each | Hinge forward with a flat back, thumbs up. Lift your arms into a Y, then a T, then a W. | Rear shoulders, mid back | Still pose: view from behind, hinged, Y solid, T and W faint |
| 6 | Curls and kickbacks, no weight | 15 | Make fists. Curl up and squeeze, then straighten your arms down and back and squeeze. | Biceps, triceps, forearms | Still pose: side view, fist at shoulder, faint arm straight back |

Time: 90 + 50 + 45 + 30 + 60 + 40 s = about 5.3 minutes of moves plus short changes = **about 6 min**. Jumping jacks swap line (shown under its cue): "Sore knees or ankles? March on the spot instead."

Still poses use the same rig and paint as the players, one pose each, in a 358 x 180 stage box.

### 5.3 Hand-off to the load ramp

Last screen of the warm-up sheet: **"Then: 3 warm-up sets for Machine Chest Press"**, line "60 lb x 8, 85 lb x 5, 100 lb x 2, then your working sets." (from `warmupSets(120 lb)`, 5 lb machine step). The warm-up sheet computes this itself with `warmupOffer()` for the first main lift, because in the pre-session sheet the ramp card is always cut by the 3-card limit on this split (section 1.5).

Button "Done" returns to the pre-session sheet, where the warm-up row now reads "Warm-up done" with a check in `--positive`. Skipping any move or the whole warm-up is always one tap. "Done or skipped" is kept in memory only, like the existing check-in skip, so nothing new is saved.

---

## 6. D) Library copy

### 6.1 The four "Around the World" meanings (from `gap.json`)

`gap.json` confirms no name or alias in the 153-row library matches "around the world", and that the name means 4 different exercises. Proposed rows (names follow the library's singular style; every row gets the alias "around the world"):

| Meaning | Name | Equipment | Main | Helps | Pattern, mode | Other names |
|---|---|---|---|---|---|---|
| 1 Chest and shoulder arc (most likely on an upper day) | Dumbbell Around the World (Lying) | Dumbbells | Chest, Front shoulders | Upper chest, Triceps | chest_adduction, weighted | around the world, dumbbell around the world, lying around the world, around the world fly, dumbbell circles |
| 2 Halo, plate version | Plate Halo | Plate | Side shoulders, Front shoulders | Deep core, Rotator cuff | shoulder_abduction, weighted | around the world, halo, plate around the world, weight plate halo, plate around the head |
| 2 Halo, kettlebell version | Kettlebell Halo | Kettlebell | Side shoulders, Front shoulders | Deep core, Rotator cuff, Triceps | shoulder_abduction, weighted | around the world, kb halo, kettlebell around the head |
| 3 Waist pass | Kettlebell Pass-Around | Kettlebell | Front shoulders, Obliques | Forearms, Deep core, Side shoulders | anti_rotation, weighted | around the world, kettlebell around the world, kettlebell pass around the body, waist pass, around the body pass |
| 4 Leg-day lunge | Clock Lunge | Bodyweight | Quads, Glutes | Inner thighs, Outer hips | lunge, bodyweight | around the world, around the world lunges, clock lunges, lunge matrix, 8-point lunges, multi-directional lunges |

A fifth, rare meaning (Around-the-World Pull-Up) is niche and stays out of the first pass.

Build notes: "Plate" needs the `equipmentGroup()` fix from the `lib.json` review (move `plate` into the Dumbbells branch; the proposed reorder alone does not work). Clock Lunge uses equipment exactly "Bodyweight" because it is logged as bodyweight (lib.json rule). The lunge pattern is front-and-back only; a sideways pattern is a separate `lib.json` item.

Search order: all five rows score 130 (exact alias). The current tie-break (shorter name first) would list Plate Halo first and the dumbbell version last. LIB-1 adds one tie-break: among equal base scores, a row whose own name contains the search words comes first, then shorter names. Result for "around the world": **Dumbbell Around the World (Lying), Plate Halo, Clock Lunge, Kettlebell Halo, Kettlebell Pass-Around**. The Search artboard shows this order.

About info for the other four (text only in the demo; they have no moving guide in this demo):
- Plate Halo. Steps: 1 Hold a light plate by its sides at chest height. 2 Circle it around your head, close to your head, elbows bending as it passes behind. 3 Finish at your chest, then circle the other way. Tip: Squeeze your stomach and glutes so your lower back doesn't arch.
- Kettlebell Halo. Steps: 1 Hold a light kettlebell upside down by the horns at chest height. 2 Circle it around your head, keeping it close. 3 Finish at your chest, then go the other way. Tip: Keep your ribs down; move the bell, not your body.
- Kettlebell Pass-Around. Steps: 1 Stand tall holding a kettlebell by the handle in front of your hips. 2 Pass it to your other hand behind your back. 3 Bring it round to the front and keep circling. 4 Switch direction halfway. Tip: Keep your hips facing forward; the bell travels, not your body.
- Clock Lunge. Steps: 1 Stand tall and picture yourself in the middle of a clock. 2 Lunge forward to 12, push back to the middle. 3 Lunge out to the side to 3, then back to 6, returning to the middle each time. 4 Switch legs and go round the other way. Tip: Keep your front knee in line with your toes on every step.

### 6.2 The "also called" line

Rule: a search result matched through one of its other names (the alias branches of the scorer) gets the glowing info button, and its About sheet opens with the line. Exact copy for the demo (About for Dumbbell Around the World (Lying), searched "around the world"):

> You searched "around the world". It's also called Dumbbell Around the World (Lying).
> Other exercises share that name: Plate Halo, Clock Lunge, Kettlebell Halo and Kettlebell Pass-Around.

The second line appears only when the searched name belongs to 2 or more exercises. For Plate Halo the first line reads: You searched "around the world". It's also called Plate Halo.

### 6.3 No match (a real gap)

Search "tate press". Tate Press is a real triceps exercise, missing from the library and rated niche in `gap.json` (so it stays out of the "common" expansion). Screen copy:

> Can't find it?
> [Create my own] [Ask Escobar]

Ask Escobar sends: Add "tate press" as my own exercise.
Escobar replies: Tate Press isn't in the library yet, so I can add it as your own exercise: dumbbells, working the triceps, with the chest helping.
Proposal (existing `propose_custom_exercise`, input from `gap.json`: name "Tate Press", equipment "Dumbbells", primary triceps, secondary chest, mode weighted, role accessory): title "Add exercise: Tate Press"; table row `Tate Press | — | → | Dumbbells · Triceps`; buttons Apply, Not now. After Apply: "Applied" and "Undo". After Undo: "Undone".

Offline: the Ask Escobar button shows greyed out with the line "Needs internet"; [Create my own] still works.

Duplicates through Escobar: already blocked by the tool's validator (name or alias match, section 1.5). The Escobar prompt should also tell him to search first, so he answers "That's already in the library as Rear Delt Fly." instead of failing. Drawn on the Custom board as the view `escobar-duplicate`: the user asks Add "reverse pec deck" as my own exercise.; Escobar answers with that line and one small primary button "Use Rear Delt Fly" (toast "Rear Delt Fly is already in SPLIT 1 UPPER BODY"); no proposal card.

### 6.4 Custom name that matches a library exercise

In Create my own, the Name field is checked against library names and aliases (same normalising as `findExerciseExact`). The demo preset is **"Pec deck"**, the other name of the library's Pec Fly (`exercises.json`: Machine, main chest, other names pec deck, machine fly, chest fly machine). Under the Name field a card appears:

> This looks like Pec Fly. Use it?
> Machine · Chest · also called pec deck
> [Use Pec Fly] [Create mine anyway]

"Use Pec Fly" adds the library exercise (the same as tapping its row; toast "Added Pec Fly to your split"). "Create mine anyway" hides the card and lets Create and add work as today.

Typing **"reverse pec deck"** matches the other name of Rear Delt Fly, which is already in SPLIT 1 UPPER BODY: the card reads "This looks like Rear Delt Fly. Use it?" / "Machine · Rear shoulders · also called reverse pec deck" and adds the line "It's already in SPLIT 1 UPPER BODY."; "Use Rear Delt Fly" closes the sheet with the toast "Rear Delt Fly is already in SPLIT 1 UPPER BODY".

---

## 7. E) Artboards and exact copy

All artboards: `<html lang="en">`, Roboto link in `<helmet>`, root with the theme variables from `themeVars(theme)` and its own `background: var(--bg)` (the `body` rule alone cannot see the root's variables). No status bar. No emoji. Icons are inline stroke SVG (section 1.3). The Escobar mark is the real PNG as a `data:` mask.

| File | Size | Title | data-props (besides `$preview`) |
|---|---|---|---|
| Main.dc.html | 390 x 844 | Train workouts | theme (enum, default silent-black); open (enum: none + the 8 split slugs, default none) |
| About.dc.html | 390 x 776 | Exercise about sheet | theme; exercise (enum, 9 options as built: machine-chest-press, lat-pulldown, dumbbell-lateral-raise, around-the-world, incline-machine-press, seated-cable-row, rear-delt-fly, dumbbell-biceps-curl, single-arm-triceps-pushdown; default machine-chest-press; the four other "around the world" meanings are shown by Search's own text panel, see 7.6); searched (enum: "" or "around the world", default "") |
| Player-*.dc.html (3: MachineChestPress, LatPulldown, DumbbellLateralRaise) | 358 x 460 | "<name> form guide" | theme; autoplay (true); loop (true) |
| Machine.dc.html | 390 x 844 | Lat pulldown station | theme |
| Warmup.dc.html | 390 x 844 | Split warm-up | theme |
| Search.dc.html | 390 x 844 | Search other names | theme |
| Custom.dc.html | 390 x 844 | Create my own | theme; view (enum: no-match, duplicate, ask-escobar, escobar-duplicate; default no-match); online (boolean, default true) |
| Theme-Paper.dc.html, Theme-Ember.dc.html, Theme-Emerald.dc.html, Theme-Midnight.dc.html | 390 x 844 | Train in Paper (Ember, Emerald, Midnight) | none |

### 7.1 Main (the owner's Train screen)

Scroll area (absolute, inset 0, overflow-y auto, padding 12px 16px 140px) with:

- Eyebrow "Train"; `h1` "Workouts"; quiet small button "+ Split" (with a 44 px hit area).
- Chip "At: Anytime Fitness" + chevron down.
- Pills: "SPLIT 1 UPPER BODY" (selected, dot `#4d9dff`), "SPLIT 2 - LOWER AND CORE" (dot `#ffc845`), "SPLIT 3" (dot `#a061ff`, clipped by the edge).
- Card: `h2` "SPLIT 1 UPPER BODY"; hint "8 exercises · 21 sets"; pencil button `aria-label="Edit split"` (an `<a href="Search.dc.html">` in the demo, standing in for Edit split → Add exercise).
- Rows (pressable, each opens About for its slug). Name / hint (ellipsis) / trailing hint:

| Name | Hint (full text; the screen cuts it with an ellipsis) | Trailing |
|---|---|---|
| Machine Chest Press | 120 lb · 12 reps · Last set was max effort. Keep the load and aim for one more clean rep. | 3 sets |
| Lat Pulldown | 45 kg · 6–8 reps · Progress has slipped over recent sessions. Keep this load, stop short of max effort for a week, then build back up. | 3 sets |
| Incline Machine Press | 55 lb · 11 reps · Last set was max effort. Keep the load and aim for one more clean rep. | 3 sets |
| Seated Cable Row | 45 kg · 12 reps · Last set was max effort. Keep the load and aim for one more clean rep. | 3 sets |
| Dumbbell Lateral Raise | 6 kg · 13 reps · Last set was max effort. Keep the load and aim for one more clean rep. | 3 sets |
| Rear Delt Fly | 55 lb · 15 reps · Last set was max effort. Keep the load and aim for one more clean rep. | 2 sets |
| Dumbbell Biceps Curl | 10 kg · 8–10 reps · Progress has slipped over recent sessions. Keep this load, stop short of max effort for a week, then build back up. | 2 sets |
| Single-Arm Triceps Pushdown | 5 kg · 9 reps · Last set was max effort. Keep the load and aim for one more clean rep. | 2 sets |

(Reason texts are the real strings from `src/brain/progression.ts` lines 272 and 296.)

- Primary block link-button (`<a href="Warmup.dc.html">` styled as `.btn.btn-primary.btn-block`): play icon + "Start SPLIT 1 UPPER BODY".
- Quiet block button "Log a past session".
- Fixed over the scroll: Escobar dock "What should I lift today?" (hidden while a sheet is open) and the bottom nav (Today, Train current, History, Body, Escobar).
- Sheet state (`open` not "none"): scrim `--scrim` over everything; About child at the bottom (top = 68 px), rising in 320 ms `--ease-drawer` (fade only under reduced motion): `<dc-import name="About" theme="{{ theme }}" exercise="{{ open }}" searched="" hint-size="390px,776px"></dc-import>`. Tapping the scrim or the sheet's close button returns to `none` (the About child calls a close handler passed as a prop, or Main puts a transparent 44 x 44 close hit area over the About's close button, which sits at x 330-374, y 98-142 in Main's coordinates: About top 68 + panel padding 8 + grab 4 + 4 + 14 = head at 30-74 inside About). Main keeps the open sheet in state, starting from the `open` prop; tapping a row sets it, closing clears it.

### 7.2 About (child sheet)

Root 390 x 776, `--surface-2` panel, 1px `--border` (no bottom), radius `--radius-xl` top, padding 8px 16px 20px, scrolls. Top to bottom:

1. Sticky top: grab; `h2` exercise name; close button (`aria-label="Close"`).
2. Only when `searched` is set: the also-called banner. `--accent-soft` fill, radius `--radius-md`, padding 10px 12px, info icon in `--accent`, 13px/18px `--text` (line 1) and `--text-2` (line 2). Copy in 6.2.
3. The player (for the 3 animated slugs: machine-chest-press, lat-pulldown, dumbbell-lateral-raise): one `sc-if` per slug, each with a literal import, for example `<dc-import name="Player-MachineChestPress" theme="{{ theme }}" autoplay="{{ no }}" loop="{{ no }}" hint-size="358px,460px"></dc-import>`. Margin-bottom 16. The other 6 slugs show a quiet card in the same place with the line "Animation comes with the form-guide update."
4. "Works" (eyebrow): chips; main muscles as `.chip.chip-accent`, helpers as `.chip`, with tiny labels "Main" and "Helps" (11px `--text-2`) before each group.
5. "Also called:" line, 13px `--text-2`, the other names joined by commas.
6. "Equipment" line, 13px `--text-2`; for Lat Pulldown a `.chip.chip-btn` link "See the machine" (`<a href="Machine.dc.html">`).
7. `h3` "How to do it": numbered steps, 15px/20px `--text`, number in a 22px `--surface-3` circle, 12px/600 `--text-2`, gap 10.
8. Tip: quiet card (transparent, 1px `--border-subtle`, radius `--radius-md`, padding 12), eyebrow "Tip", 15px text.
9. `h3` "Common mistakes": for each, 13px/600 `--text` mistake, then 13px `--text-2` "Fix: ...".

All exercise copy is in section 3 (the 9 About exercises: the 8 split exercises and Dumbbell Around the World; 3.10 Arm Circles is a warm-up move) and 6.1 (four text-only rows).

### 7.3 Player-* (3 files)

As section 2 and the per-exercise blocks in section 3. The owner asked for exactly 3 animations in this demo. File to exercise map:

| File | Exercise |
|---|---|
| Player-MachineChestPress.dc.html | Machine Chest Press |
| Player-LatPulldown.dc.html | Lat Pulldown |
| Player-DumbbellLateralRaise.dc.html | Dumbbell Lateral Raise |

Not built in this demo (design kept in 3.3, 3.4, 3.6-3.10): Incline Machine Press, Seated Cable Row, Rear Delt Fly, Dumbbell Biceps Curl, Single-Arm Triceps Pushdown, Dumbbell Around the World (Lying), Arm Circles.

### 7.4 Machine

Background: the Train screen (static, as Main at scroll 0) under the scrim; the machine sheet on top (max 776 tall): title "Lat pulldown station", close = `<a href="Main.dc.html">` styled as the close button. Content and copy in section 4. State: `selected` part id (default thigh_pad).

### 7.5 Warmup

Background: the Train screen under the scrim. States:

1. **Pre-session sheet**, title "Before you start SPLIT 1 UPPER BODY":
   - Row: hint "Today's checks" + Ask-Escobar icon button (`aria-label="Ask Escobar about Before SPLIT 1 UPPER BODY"`).
   - New warm-up row (pressable card, first in the list): "Warm up" 15px/600 + "about 6 min" 13px `--text-2`; hint "Chest, back, shoulders and arms · 6 moves"; chevron right.
   - Insight cards (6px `--warning` dot before the title): "Machine Chest Press: today's target load" / "It already accounts for today's readiness, a lighter week and the loads your equipment has." / "Start around 120 lb · 12 reps."; "Lat Pulldown: today's target load" / same line / "Start around 45 kg · 6–8 reps."; "Incline Machine Press: today's target load" / same line / "Start around 55 lb · 11 reps." (strings from `pre.ts` 116-121; if the real brief shows different text on the owner's data, the real one wins).
   - Primary block: play icon + "Start SPLIT 1 UPPER BODY".
2. **Warm-up sheet** (nested, clear backdrop), title "Warm up"; under the head: 7 progress dots (6 moves + hand-off; current = `--accent`, done = `--text-2`, next = `--border-strong`) and a quiet small "Skip warm-up" on the right. Per move: eyebrow "Move 1 of 6 · Get warm" (then "Shoulders", "Chest and arms", "Back", "Back and rear shoulders", "Arms"); `h2` move name; demo (a still pose box for every move, move 2 included, with "Animation comes with the form-guide update." under it); cue 15px `--text`; warms line 13px `--text-2` ("Warms: Chest, Front shoulders, Triceps"); dose shown big (40px/650 tabular: "1:30" with Start/Pause for the timed move, "12" with "reps" for rep moves); buttons: quiet "Skip this move" and primary "Done" (grows).
   - Timer: real countdown for Jumping jacks (interval cleared on unmount); at 0:00 the Done button pulses once (no loop).
3. **Hand-off screen**: eyebrow "Warm-up done"; `h2` "Then: 3 warm-up sets for Machine Chest Press"; line "60 lb x 8, 85 lb x 5, 100 lb x 2, then your working sets."; primary "Done" → back to state 1 with the row now "Warm-up done" + check in `--positive`, hint "Then: 3 warm-up sets for Machine Chest Press".

### 7.6 Search

Background: the Train screen under the scrim. Sheet "Add exercise":
- Input with value "around the world" (focused look: `--accent` border and 3px `--accent-soft` ring).
- Rows (order from 6.1). Each: name; hint "{equipment} · {main muscles}"; info button (44 x 44, info icon 18) then chip "Add":

| Name | Hint |
|---|---|
| Dumbbell Around the World (Lying) | Dumbbells · Chest, Front shoulders |
| Plate Halo | Plate · Side shoulders, Front shoulders |
| Clock Lunge | Bodyweight · Quads, Glutes |
| Kettlebell Halo | Kettlebell · Side shoulders, Front shoulders |
| Kettlebell Pass-Around | Kettlebell · Front shoulders, Obliques |

- All five matched by another name, so all five info buttons glow: icon in `--accent`; a 30 px ring (1.5px `--accent`) behind it runs `@keyframes info-glow { 0% {opacity:0; transform:scale(.8)} 40% {opacity:1; transform:scale(1.12)} 100% {opacity:1; transform:scale(1)} }` for 900 ms, `cubic-bezier(.2,0,0,1)`, 3 times, `both`, so it ends as a steady ring. Rows start 60 ms apart. Reduced motion: no pulses, steady ring at once. A plain match (no other name) shows the same button in `--text-3` with no ring.
- Quiet button "Create a custom exercise" under the list.
- Info button → nested About: `<dc-import name="About" theme="{{ theme }}" exercise="{{ aboutSlug }}" searched="around the world" hint-size="390px,776px"></dc-import>`. For the dumbbell row it shows the About text with "Animation comes with the form-guide update." in the player's place (not animated in this demo). The other four rows open Search's own text panel (same layout as About; moving them into About is an open clean-up). Under the About content (Search only): primary block "Add to SPLIT 1 UPPER BODY".

### 7.7 Custom

Background: the Train screen under the scrim. Sheet "Add exercise" / "New exercise" / Escobar panel by `view`:

- **no-match**: input value "tate press"; empty block centred: "Can't find it?" (15px `--text-2`), then a row: `.btn` "Create my own" and `.btn` with the accent Escobar mark "Ask Escobar". With `online` false: "Ask Escobar" shows greyed out with the line "Needs internet"; "Create my own" still works.
- **Create my own** (from the button): sheet "New exercise", fields as today with Name "tate press"; the Name input is live: typing "reverse pec deck" (any case, extra spaces ignored) shows the duplicate card from 6.4. Embedded match list: the names and aliases of the 8 split exercises plus 6 common upper-body moves not in the split (Pec Fly, Cable Fly, Dumbbell Fly, Face Pull, Skull Crusher, Hammer Curl), from `exercises.json`.
- **duplicate** (preset): Name "Pec deck" with the Pec Fly card showing, buttons "Use Pec Fly" and "Create mine anyway" (6.4).
- **ask-escobar**: Escobar panel (62% height, `--surface-2` as on origin/main, 1px `--border`, radius `--radius-xl` top, grab, head with the accent mark and `h2` "Escobar" 16px, close). Thread: user bubble right (`--accent-soft`, 15px, radius 18 18 6 18): Add "tate press" as my own exercise. Escobar answer 15.5px/1.5 `--text` (copy in 6.3, no left rule line in the demo). Proposal card as origin/main `ProposalCard`: bold title "Add exercise: Tate Press", the change table row `Tate Press | — | → | Dumbbells · Triceps`, small buttons Apply (primary) and Not now (quiet). After Apply: "Applied" with an accent "Undo" link for 8 s (`UNDO_WINDOW_MS`), plus the toast with Undo. After Not now: "Dismissed". After Undo: "Undone". The card has no left accent rule in the demo (canvas rule), otherwise as the app.
- **escobar-duplicate**: the same Escobar panel; thread: Add "reverse pec deck" as my own exercise. / That's already in the library as Rear Delt Fly. / small primary button "Use Rear Delt Fly". No proposal card (6.3).

### 7.8 Theme wrappers

Each file: root 390 x 844 containing only `<dc-import name="Main" theme="paper" open="machine-chest-press" hint-size="390px,844px"></dc-import>` (theme `ember`, `emerald`, `midnight` in the others). Shows the owner's Train screen with the Machine Chest Press About sheet open (player idle on the setup pose; Play works).

---

## 8. Placement, online and offline

| Place | What | Decision |
|---|---|---|
| Train split rows | tap → About sheet with the player | new, quiet (no extra icons on the rows) |
| Live session, per-exercise Options sheet | first button "About this exercise" → About (nested) | new |
| Exercise picker | info button per row; glow on other-name matches; About with "Add to split" | new |
| Pre-session sheet | "Warm up" row → move-by-move sheet | new |
| About → "See the machine" | machine guide sheet | new |
| Today screen | nothing | never (a build check fails if Today imports the guide) |

| Feature | Works offline | Why |
|---|---|---|
| Player, pictures, zoom, About info, machine guide, warm-up | yes, bundled | gyms often have no signal; all of it is drawn in code and ships in a lazy chunk |
| Ask Escobar (custom exercise) | no; button greyed out offline, "Needs internet" | needs the live coach; uses the owner's AI key |
| Real video clips | not in scope | licence cost and cannot follow the theme; owner decision later (`guide.json`) |

Nothing new is saved: the guide and warm-up are static content; "warm-up done" lives in memory only. Custom exercises use the existing store and tool.

---

## 9. Decisions and why

1. Side view for presses, pulls, curls and pushdowns; front view for the lateral raise; top view for the rear delt fly and Around the World; three-quarter view for arm circles. Each is the one view that shows the movement's true path.
2. Foreshortening (`scaleY`) on arm segments in side views, because elbows that flare out to the sides would otherwise draw as elbows poking through the back pad.
3. Outline colour `--fg-line` instead of `--map-line`, to reach 3:1 on every theme (section 2.3).
4. CSS-only captions sharing the figure's clock, so text and movement cannot drift.
5. Speed change restarts the rep, to avoid a jump.
6. Glow on every other-name match, plus a sharing line when a name has several meanings, because "around the world" is ambiguous.
7. Search tie-break so the most likely meaning lists first without new saved fields.
8. Warm-up keeps every trained group (no 3-group cap) and shows the ramp itself, fixing two flaws found in the `warmup.json` review.
9. The demo draws sheets as they look on `origin/main` after patch b3 (merged in `b204c87`), since the build starts from the latest main.
10. Left-edge cards (insight, proposal, Escobar turn) are drawn without the left edge because the canvas rules forbid them; the real app keeps its look.

## 10. Differences between the demo and the real app

- No status bar, no safe areas; 390 px wide instead of the owner's roughly 412 px.
- Roboto loaded from Google Fonts to match his phone's fallback font.
- Hints keep the app's `--text-3` (3.3:1 on Silent Black cards), below the canvas's 4.5:1 text rule. This is the real app today; all new text in this spec uses `--text` or `--text-2`.
- Standalone players loop; the app never loops.
- Reduced motion is the media query here; the app uses `data-motion`.
- The pencil jumps straight to the exercise picker (the app shows Edit split first).
- In Paper, the demo darkens the Start button's fill to `#1f73c7` (4.84:1 for white text) instead of the plain accent `#2383e2` (3.88:1, fails 4.5:1). The real app uses the same accent-on-white pair today and should apply the same fix.

## 11. Risks and how they are handled

| Risk | Mitigation |
|---|---|
| A flat 2D figure cannot show movement toward the camera (elbow flare, arm height in top views) | per-exercise camera, foreshortening, zoom captions that say it in words, and the info steps |
| Wrong coaching copy | every line checked against the library muscles; the owner (or a coach) reads all copy before the build; truth tables become test fixtures (hand stays on the handle within 3 units at every key pose, fixed joints never move more than the table allows) |
| Hand drifts off the handle between key poses | the handle is nested in the hand; add a keyframe wherever the drift exceeds 3 units |
| Accent in Midnight is under 3:1 on `--surface-1` (2.98) | muscles are also named in text; outlines carry the shapes |
| Glow feels loud with five rows | 3 pulses only, then a steady ring; rows staggered 60 ms; reduced motion shows the ring only |
| "Machine" equipment text shared by 21 machines | map machines by exercise id |
| Ranking puts Plate Halo first | the one-line tie-break in 6.1, with a search test |
| Warm-up drops chest on upper days, ramp card never shows | rules in 5.1 and 5.3, each with a test on SPLIT 1 |
| Canvas `boolean` editor not supported | players read booleans defensively; fallback is an enum of "yes"/"no" |
| Owner's row height differs from the demo | noted in 1.4; judge the layout, not the pixel height |

## 12. For the owner to decide later (none block the demo)

- Keep or change the move list and doses in 5.2.
- Whether the other Around the World meanings (and Tate Press) get moving guides in the first build.
- Whether Ask Escobar should also offer to add Tate Press to the split, not only to the library.
