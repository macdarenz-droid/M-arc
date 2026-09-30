# M/ARC website: design specification (Midnight Pulse)

Date: 28 September 2026. Status: the build specification for the real site. The owner chose the Midnight Pulse direction (docs/WEBSITE-ARCHITECTURE.md section 4, Option 3) on this date. This is the one document for the site's design; update it, never copy it. Research, the three directions and the build architecture stay in docs/WEBSITE-ARCHITECTURE.md; this document points there instead of repeating it.

Starting point: the reviewed render at `website/renders/option-3-midnight.html` (three review rounds and a polish pass, docs/WEBSITE-ARCHITECTURE.md section 4). Its tokens, sections, copy, motion and script are kept wherever they passed review. Where a real site needs more (four pages, self-hosted fonts, build-time facts, a contrast fix on the primary button, a stricter reduced-motion state, an OG image, robots and sitemap), this document says exactly what.

A builder builds the whole site from this document. Every value is stated; nothing is left to taste. Where the inputs were silent, section 15 lists the decision and its reason.

## 1. Purpose and audience

**The one job.** Get a lifter who trains with a plan to install M/ARC and trust it with their data. Every section either shows what the app does with a real screen, or proves that the data stays on the phone. Nothing else earns a place on the page.

**Who reads it.**

| Reader | Arrives from | Needs in the first screen | Leaves with |
|---|---|---|---|
| A lifter on Android who follows a split (Push / Pull / Legs) and logs load, reps and effort | A link from the repository, a forum, a friend | What the app does, in one sentence, and a real screen | The APK, verified, or the repository link |
| A privacy-minded person checking the claims | The repository or a search for "no account workout log" | Where data is stored and what leaves the phone | The /privacy/ page, read in two minutes |
| A developer looking at the source | GitHub | That the code, tests and signing are real and checkable | The repository, the fingerprint and the verify command |

**What the site must never claim.**

- That the web app has a public address. It does not yet. The site says so in plain words until the owner supplies one (section 8, `SITE_APP_URL`).
- That the source is "open source". There is no LICENSE file. The site says "public source" (docs/WEBSITE-ARCHITECTURE.md section 1).
- Any number that is not in the content model (section 8). No user counts, ratings, rankings, "science-backed", "AI-powered", "free".
- That anything is tracked, measured or improved on the site's side. The site itself sets no cookies, stores nothing in the browser and loads nothing from a third party.
- Any promise about health outcomes. Levels is "a relative measure and not a medical one"; the body-fat estimate is "a trend, not one reading" (app strings).
- Anything about signing steps, keystores or secrets beyond the public fingerprint and the public verify command.

## 2. Site map and navigation

### 2.1 Pages

| Path | Title | Job | Length at 1440 |
|---|---|---|---|
| `/` | M/ARC, a training log that knows how recovered you are | The long page: hero, pinned story, Train, Body, Escobar, History, Your data, Install, footer | About 9 viewports plus the 400vh pinned block |
| `/install/` | Install M/ARC | The APK with version, fingerprint, verify command and steps; Obtainium; the web app's status; the source | About 2.5 viewports |
| `/privacy/` | How M/ARC handles your data | What is stored where, what leaves the phone and when, the two switches, backups and CSV, the rescue file, no account, what this website does | About 3 viewports |
| `/404.html` | Page not found | Says the page does not exist and offers Home and Install | Under 1 viewport |

Files: `website/index.html`, `website/install/index.html`, `website/privacy/index.html`, `website/404.html`. GitHub Pages serves `404.html` for unknown paths.

### 2.2 Navigation

The same header on every page (one partial, `website/partials/nav.html`, inlined at build; section 12).

| Slot | Content | Link | Notes |
|---|---|---|---|
| Left | Lockup: the heartbeat-M mark (28px) and the wordmark M/ARC | `__BASE__` (home) | `aria-label="M/ARC, home"`. On the home page the same link scrolls to the top. |
| Centre (901px and up) | Train, Body, Escobar, History, Privacy | `__BASE__#train`, `__BASE__#body`, `__BASE__#escobar`, `__BASE__#history`, `__BASE__privacy/` | `aria-current="true"` on the link whose section is in view (home only) or whose page this is (Privacy on /privacy/). |
| Centre (900px and under) | A native `<details class="menu">` labelled Menu with the same five links in a full-width list under the bar | | Closes when a link is chosen (script) and on Escape. |
| Right | Secondary button "Read the source"; primary button "Install" | `https://github.com/macdarenz-droid/M-arc`; `__BASE__install/` | The secondary hides at 640px and under. Install is visible at every width. On /install/ the primary reads "Download the APK" and links to `#apk`. |

Behaviour: sticky at `top: env(safe-area-inset-top, 0px)`, 64px tall (57px at 640 and under). Transparent over the hero; once a 1px sentinel at the page top has left the viewport (one IntersectionObserver, no scroll listener) the header takes `--nav-bg`, a 1px `--border` bottom line and a 14px backdrop blur. At 400px and under the blur is dropped for a solid `--bg`. On /install/, /privacy/ and 404 the header is solid from the start (class `nav on` in the HTML). Without JavaScript the header is solid from the start on every page (`html:not(.js) .nav`, W27). With JavaScript and reduced motion the sentinel observer still runs and the header still gains and loses `.on`, only without the `--dur-base` transition, so W20 has one expected result per run.

### 2.3 Footer

One partial, `website/partials/footer.html`, on every page.

- Row 1: the lockup at 24px and one line in `--text2`, 15px: "Nothing leaves your phone unless you turn Escobar on."
- Row 2, three columns (one column at 900px and under), each headed by an `h2` styled as a 13px uppercase label:
  - Product: Today (`__BASE__`), Train (`__BASE__#train`), Body (`__BASE__#body`), Escobar (`__BASE__#escobar`), History (`__BASE__#history`)
  - Install: Android APK (`__BASE__install/#apk`), Add to Home Screen (`__BASE__install/#web`), Releases and changelog (`https://github.com/macdarenz-droid/M-arc/releases`)
  - Trust: Your data (`__BASE__privacy/`), Signing key (`__BASE__install/#verify`), Source on GitHub (`https://github.com/macdarenz-droid/M-arc`), Architecture notes (`https://github.com/macdarenz-droid/M-arc/blob/main/docs/ARCHITECTURE.md`)
- Row 3: a 1px `--border` rule, then one line in JetBrains Mono 13px `--text2`: "M/ARC __VERSION__. Public source on GitHub. This page loads no analytics and sets no cookies."

The last sentence is a build requirement (section 11, W14).

### 2.4 Skip link

The first focusable element on every page: `<a class="skip" href="#main">Skip to content</a>`. Off-screen until focused (`top: -48px`, `top: 16px` on focus), `--accent` background, white text, 44px tall. `<main id="main" tabindex="-1">` receives focus. On the home page a second skip link follows: "Skip to install" (`__BASE__install/`).

### 2.5 URLs, base path and canonical

The domain is not decided. Two values live in one file, `website/site.config.mjs`:

```js
export const SITE_BASE = process.env.SITE_BASE ?? '/';        // '/' for a root domain, '/M-arc/' for a GitHub project page
export const SITE_URL = process.env.SITE_URL ?? '';           // 'https://example.org' once the domain exists; '' until then
export const SITE_APP_URL = process.env.SITE_APP_URL ?? '';   // the hosted web app, '' until it exists
```

- Every internal link in HTML is written with the `__BASE__` token (`href="__BASE__install/"`) and the build replaces it with `SITE_BASE`. Vite rewrites asset URLs itself; it does not rewrite `<a href>`, so the token is needed.
- `<link rel="canonical">` is `__SITE_URL____BASE__<path>`; with `SITE_URL` empty that yields a root-relative canonical (`/install/`), which browsers and crawlers accept as a same-origin hint. Once `SITE_URL` is set it becomes absolute with no other change. Trailing slash on every page path; no `.html` in links except `404.html`, which is never linked.
- `og:url`, `sitemap.xml` and the `Sitemap:` line in `robots.txt` need absolute URLs, so they are emitted only when `SITE_URL` is set (section 10).
- Set the values once, in the GitHub Pages workflow's `env:` block (section 12). Nowhere else.

## 3. Design tokens

Every colour on the site derives from the Midnight theme in `src/theme/themes.ts` (`THEMES.midnight.tokens`). The site is plain HTML and CSS, so it does not import that file; `website/tokens.css` restates the values, and the site gate compares them to `themes.ts` as text at gate time (W33), so the two never drift. The app's own tests are not touched.

### 3.1 Colours

| Token | Value | Role on the site | Source in themes.ts (midnight) |
|---|---|---|---|
| `--bg` | `#0a2540` | Page background, screen fallback behind images, code blocks | `bg` |
| `--s1` | `#0f2d4d` | Lifted bands (Train, Escobar, footer, the story band), cards, secondary buttons | `surface1` |
| `--s2` | `#143559` | Secondary button hover, switch pill, rest-banner chips | `surface2` |
| `--s3` | `#1a3f68` | Rest banner replica | `surface3` |
| `--border` | `#263e57` | Every hairline: dividers, card and button borders, ring tracks. The flat equivalent of `borderSubtle`/`border` on `--bg`, used so hairlines never double up where surfaces overlap | derived from `border` rgba(246,249,252,.12) over `bg` |
| `--border-a` | `rgba(246,249,252,.12)` | Hairlines that sit over the lit plane (the phone ring's neighbour) | `border` |
| `--border-strong` | `rgba(246,249,252,.22)` | Secondary button hover border, rest banner top edge, switch pill border, link underline | `borderStrong` |
| `--text` | `#f6f9fc` | Headlines, primary copy, stat figures | `text` |
| `--text2` | `#a3b6cc` | Body copy in sections, captions, nav links, labels | `text2` |
| `--text3` | `#6c839c` | Decorative only (never text under 24px; 3.97:1 on `--bg`): the switch knob uses `--text2` for the same reason, see 6.10 | `text3` |
| `--accent` | `#635bff` | Primary button fill, the wordmark slash, the mark's dot, ring fills in Body, undo bar, focus ring base | `accent` |
| `--accent-soft` | `rgba(99,91,255,.18)` | Current nav link background | `accentSoft` |
| `--accent-line` | `rgba(99,91,255,.7)` | The cursor-following border shine | derived from `accent` |
| `--accent-text` | `color-mix(in srgb, var(--accent) 65%, var(--text))`, flat `#9692fe` | Eyebrows, row icons, the active step's eyebrow. Never on `--s3` (4.01:1) | `accentTextPct: 65` |
| `--on-accent` | `#ffffff` | Text on the primary button and the skip link | `onAccent` |
| `--accent-hover` | `color-mix(in srgb, var(--accent) 90%, black)`, flat `#5952e6` | Primary button hover. Darker, not lighter: white on the render's lighter hover measured 3.83:1 (fails); on this value 5.56:1 | derived; section 15 |
| `--info` | `#00d4ff` | The cyan light (`--lb-cyan`) only. Never as text | `info` |
| `--positive` | `#3ecf8e` | Green readiness dot, the green light, the drained undo bar and "Applied" label | `positive` |
| `--warning` | `#ffbb00` | Amber readiness dot, the amber light, the story rings' stroke | `warning` |
| `--negative` | `#ff5c5c` | Red readiness dot only | `negative` |
| `--bezel` | `#071a30` | Phone frame | derived: `bg` darkened so the frame reads against the plane; 1.13:1 against `--bg` is intended (the ring separates them) |
| `--ring` | `rgba(246,249,252,.18)` | 1px ring around the phone frame | between `border` and `borderStrong` |
| `--hl` | `rgba(255,255,255,.14)` | Inset 1px top highlight on the primary button and keycap cards | derived |
| `--hl-soft` | `rgba(255,255,255,.07)` | Inset top highlight on the phone frame | derived |
| `--sheen` | `rgba(255,255,255,.08)` | The keycap sweep | derived |
| `--nav-bg` | `rgba(10,37,64,.92)` | Sticky header once scrolled (flat `#0a2641` over `--s1`) | `bg` at 92% |
| `--shadow` | `0 18px 44px rgba(3,20,40,.55)` | The phone frame only | `shadow` |
| `--focus` | `color-mix(in srgb, var(--accent) 80%, var(--text))`, flat `#807bfe` | Focus ring, 2px solid, 2px offset (4.57:1 on `--bg`) | the app's focus rule (app-facts `dna.motion.rules`) |
| `--t-silent`, `--t-paper`, `--t-ember`, `--t-emerald`, `--t-midnight` | `#5e6ad2`, `#2383e2`, `#ff6363`, `#3ecf8e`, `#635bff` | The five theme accents in the themes row (Install section) | each theme's `accent` |

Lit plane colours, one pair per story step. `--light-a` is the top-left lamp, `--light-b` the bottom-right lamp. Both are registered with `@property` (syntax `<color>`, inherits) so the pair can transition.

| Step | Screen | `--light-a` | `--light-b` | Why these strengths |
|---|---|---|---|---|
| 0 (hero) and 1 | Today, then the live session | `--la-violet: rgba(99,91,255,.85)` | `--lb-cyan: rgba(0,212,255,.48)` | Violet is the thinnest of the three planes on navy, so it carries the most ink to weigh the same as green and amber after a 60px blur |
| 2 | Muscle map, Recovery view | `--la-green: rgba(62,207,142,.62)` | `--lb-cyan: rgba(0,212,255,.48)` | |
| 3 | Today again | `--la-amber: rgba(255,187,0,.48)` | `--lb-violet: rgba(99,91,255,.5)` | Amber kept lowest so the plane never blooms yellow |
| Install section | none | violet | cyan | The same element at `opacity: .4` |

### 3.2 Spacing

4px base. Use the named step, never a loose number.

| Name | px | Typical use |
|---|---|---|
| `--sp-1` | 4 | Gaps inside chips and the undo label |
| `--sp-2` | 8 | Button gap, list item gap, ring gap |
| `--sp-3` | 12 | Card grid gap, caption top margin, CTA gap, band row padding |
| `--sp-4` | 16 | Between paragraphs, eyebrow bottom margin, row gap in the nav |
| `--sp-5` | 20 | Card padding, headline bottom margin, row padding |
| `--sp-6` | 24 | Grid gap, section grid gap, figure gap |
| `--sp-7` | 32 | Hero CTA top margin, rows and tiles top margin |
| `--sp-8` | 40 | Footer row padding |
| `--sp-9` | 48 | Cards grid top margin, cut padding allowance |
| `--sp-10` | 64 | Section padding on phones (`--pad` at 640 and under), strip bottom margin |
| `--sp-11` | 96 | Section padding at 1024 and under, footer top padding |
| `--sp-12` | 128 | Section padding on desktop (`--pad`) |

`--pad` is 128 by default, 96 at 1024px and under, 64 at 640px and under. `--gutter` is 32, 16 at 640px and under. `--cut` is `min(10.5vw, 140px)`.

### 3.3 Grid and breakpoints

- Content width 1120px; the wrap is `max-width: calc(1120px + 2 * var(--gutter))` with `padding-inline: var(--gutter)`, centred.
- 12 columns, `column-gap: 24px`, `align-items: center`. Each section grid holds three items in DOM order: `.head` (eyebrow and h2), `.media` (the figures) and `.copy` (the paragraphs and what follows). On desktop the head sits at the end of row 1 and the copy at the start of row 2 with no row gap, so the two read as one block, and the media spans both rows; the placement classes are explicit: `.c5` (columns 1 to 5), `.c5r` (8 to 12), `.c6` (1 to 6), `.c7` (6 to 12), `.c7l` (1 to 7). Copy takes 5 columns, visuals 7, sides alternating per section (Train: head and copy left, figure right; Body: visuals left; Escobar: visual 6 left, head and copy 5 right starting at column 8; History: visuals left). At 900 and under the three stack in DOM order with a 32px row gap (heading, figure, copy) and the h2 gives up its bottom margin.
- Breakpoints: 1024px (padding step), 900px (single column, phone menu, pinned block stacks), 640px (phone type sizes, 240px phones, 16px gutter, 2x2 strip), 400px (nav blur dropped). Tested widths: 1440, 900, 400, and 360 for horizontal scroll only.
- The pinned block uses its own two-column grid `6fr 6fr` (not the 12-column grid) because the sticky column must span two rows; section 5.2.

### 3.4 Radii

`--r1: 8px` (code blocks, nav links, skip link, chips), `--r2: 12px` (buttons), `--r3: 16px` (cards, panels, rest banner), `--r4: 22px` (reserved; the app's sheet radius, unused on the site). Phone frame 40px outer, 32px screen. These are the Midnight theme's `radius` sm/md/lg/xl.

### 3.5 Shadows and highlights

Only the phone frame casts a shadow (`--shadow` plus `0 0 0 1px var(--ring)`). Everything else is flat with a hairline. Inset highlights: `inset 0 1px 0 var(--hl)` on the primary button and keycap cards; `inset 0 1px 0 var(--hl-soft)` on the phone frame via `::after`.

### 3.6 Z-index layers

| Layer | z | Elements |
|---|---|---|
| Backdrop fade | -2 | `.pin::before` on phones (the strip that hides copy passing under the pinned phone) |
| Planes | -1 | `.light`, `.story-bg`, `.cut::before` |
| Content | 0 | Everything else |
| Pinned column | 2 | `.col-pin`, so the phone passes over the story copy on phones |
| Header | 50 | `.nav` |
| Skip link | 100 | `.skip` |

Every stacking context is isolated (`isolation: isolate`) on `.pinblock`, `.pin`, `.cut` and `.install`, so negative z-indexes never fall behind the page.

### 3.7 The noise grain

One SVG tile as a data URI in `--grain` (`feTurbulence`, `fractalNoise`, `baseFrequency .85`, two octaves, `stitchTiles`, alpha .7), 256px, repeated, at `opacity: .06` with `mix-blend-mode: overlay`, only on `.light::after`. It stops banding on the navy behind the blur. Nowhere else.

## 4. Typography

Three self-hosted families from `website/fonts/` (README there; all OFL 1.1, latin subset): Instrument Sans (`instrument-sans-latin-wght.woff2`, wght 400-700) for display, Inter (`inter-latin-wght.woff2`, wght 100-900) for body and figures, JetBrains Mono (`jetbrains-mono-latin-wght.woff2`) for data. `font-display: swap`, `unicode-range` latin. Metric fallbacks so layout shift stays near zero:

```css
@font-face{font-family:'Inter Fallback';src:local('Arial'),local('Helvetica');size-adjust:107%;ascent-override:90%;descent-override:22%;line-gap-override:0%}
@font-face{font-family:'Instrument Sans Fallback';src:local('Arial'),local('Helvetica');size-adjust:101%;ascent-override:92%;descent-override:23%;line-gap-override:0%}
--fd:'Instrument Sans','Instrument Sans Fallback',Arial,sans-serif;
--fb:Inter,'Inter Fallback',Arial,sans-serif;
--fm:'JetBrains Mono',ui-monospace,Menlo,Consolas,monospace;
```

The three woff2 files are `<link rel="preload" as="font" type="font/woff2" crossorigin>` in the head, in this order: Instrument Sans, Inter, JetBrains Mono. No request leaves the origin for a font (W4).

Body defaults: `font: 400 17px/1.5 var(--fb); letter-spacing: -.009em; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility`. `text-wrap: balance` on h1, h2, h3. `text-wrap: pretty` on paragraphs where supported.

### 4.1 Type scale

| Name | Family, weight | 1440 and 900 (size/line-height, tracking) | 640 and under | Used for |
|---|---|---|---|---|
| display | Instrument Sans 600 | 64/1.04, -.03em | 40/1.06 | The one h1 per page |
| h2 | Instrument Sans 600 | 44/1.1, -.024em | 32/1.12 | Section headlines |
| h3 | Instrument Sans 600 | 22/1.25, -.012em | 20/1.25 | Story step titles, install and privacy subheads |
| h3-card | Instrument Sans 600 | 20/1.3, -.012em | 20/1.3 | Titles inside promise and install cards |
| title | Inter 600 | 17/1.4, -.01em | 17/1.4 | Feature row titles, the proposal card title |
| lead | Inter 400 | 19/1.5, -.009em | 17/1.5 | Hero lead, page leads on /install/ and /privacy/, `--text2` |
| body | Inter 400 | 17/1.5, -.009em | 15/1.5 | Section copy, `--text2` in sections, `--text` on /privacy/ |
| small | Inter 400 | 15/1.5, -.009em | 15/1.5 | Row text, card text, bands, footer links |
| caption | Inter 400 | 13/1.4 | 13/1.4 | Figure captions, strip labels, `--text2` |
| eyebrow | Inter 600 | 12/1, .08em, uppercase | same | Section eyebrows, `--accent-text`; step eyebrows `--text2` until active |
| eyebrow-hero | Instrument Sans 500 | 15/1.4, -.005em | same | The version line above the h1, `--text2` |
| label | Inter 600 | 12/1.4, .08em, uppercase | same | "Signing key SHA-256" and table labels, `--text2` |
| label-lg | Inter 600 | 13/1, .08em, uppercase | same | The footer column headings (2.3, 6.16), `--text` |
| stat | Inter 600 | 48/1, -.03em, tabular | 40/1 | The four-figure strip |
| stat-md | Inter 600 | 40/1, -.03em, tabular | 40/1 | The two Escobar stat tiles |
| stat-sm | Inter 600 | 32/1, -.03em, tabular | 32/1 | The Body tiles |
| rest-time | Instrument Sans 600 | 40/1, -.02em, tabular | same | The rest banner's 1:30 |
| ring-label | Inter 500 | 14/1.3, tabular | same | "Triceps 45%", "90% ready for hard work" |
| button | Inter 500 | 15/1, -.005em | same | Buttons and nav links; small button 14/1 |
| mono | JetBrains Mono 400 | 13/1.6, 0 | same | Fingerprint, commands, version lines, the footer's last line. Every element in this face carries `font-variant-ligatures: none; font-feature-settings: "calt" 0, "liga" 0`: the face's contextual alternates fuse `--` into one long dash and `>-` into an arrow tail, which misread the verify command and the file name (W34) |
| mono-button | JetBrains Mono 500 | 13/1, 0 | same | The Copy button label |
| wordmark | Inter 700 | 18/1, -.04em | same | The M/ARC wordmark in the nav (28px mark); 16/1 in the footer and themes row (24px mark). Matches `branding/midnight/lockup.svg` (Inter 700, letter-spacing -1.5 at 38px) |

Numerals: `font-variant-numeric: tabular-nums` (and `font-feature-settings: "tnum"` for older engines) on every stat, ring label, the rest banner, the strip, the fingerprint, the undo label and every table cell that holds a number on /install/ and /privacy/. Anywhere two digits sit above each other, they align.

### 4.2 Measure

| Block | Max width |
|---|---|
| Hero copy column | 560px |
| Story steps | 460px |
| Section copy (`.copy`) | the 5-column track (about 452px at 1440) |
| Story steps, section copy and icon rows at 641 to 900px | 640px (one column there; without the cap the lines ran to about 110 characters) |
| Lead paragraphs | 36em |
| Your data and Install intros | 640px |
| /privacy/ and /install/ prose | 640px (about 70 characters at 17px) |
| Captions | the figure's width |

### 4.3 Heading order

One `h1` per page. Sections are `h2`. Inside a section, `h3` only: story steps, feature rows, cards, install subheads. Footer column titles are `h2` styled as labels (they follow the page's `h1` and sit in the `footer` landmark). No level is skipped anywhere; the gate checks (W16). Headings are sentence case with a full stop where they are sentences ("Targets from your own numbers.") and without one where they are names ("Train", "Android APK").

## 5. Motion system

The app's motion tokens, copied exactly (app-facts `dna.motion`), plus the site-only tokens marked (site) in 5.1. The site-only tokens drive the site's own entrances and demos and have no counterpart in `src/ui/styles.css`, so W24's lint and a reviewer look for them in `website/tokens.css` only. No literal duration or curve outside the token block; no `transition: all`; no infinite animation anywhere on the site (W24). Every transition and animation sits inside `@media (prefers-reduced-motion: no-preference)` and is further gated by `html.m`, a class the script sets only when the OS query is `no-preference`. Without JavaScript there is no `.m`, so the page is static.

### 5.1 Tokens

| Token | Value | Use |
|---|---|---|
| `--dur-press` | 100ms | Button press scale |
| `--dur-fast` | 150ms | Colour changes on links and buttons |
| `--dur-base` | 200ms | Nav solidify, step eyebrow colour, step dimming, shine opacity, undo bar colour |
| `--dur-enter` | 240ms | Screen crossfade in the pinned phone |
| `--dur-light` (site) | 400ms | The lit plane's colour pair; the phone shrink fallback on phones |
| `--dur-reveal` (site) | 400ms | Section reveals |
| `--stagger` | 40ms | Between staggered children (up to five) |
| `--dur-rise` (site) | 480ms | Hero copy entrance per element |
| `--gap-rise` (site) | 80ms | Between hero elements; between the two ring fills (the whole hero has landed by 800ms) |
| `--dur-draw` (site) | 900ms | The mark's line draw; the phone's arrival |
| `--dur-pop` (site) | 200ms | The mark's dot |
| `--dur-wipe` (site) | 800ms | Screenshot wipe-in; the keycap sheen sweep and its delay |
| `--dur-fill` (site) | 700ms | Ring fills |
| `--dur-bounce` | 460ms | The rest banner swell |
| `--dur-tick` (site) | 1000ms | One second of the rest count |
| `--dur-undo` (site) | 8000ms | The undo bar drain (the app's real 8 seconds) |
| `--dur-copied` (site) | 1500ms | How long the Copy button reads Copied |
| `--ease-standard` | `cubic-bezier(.2,0,0,1)` | Colour, opacity, small moves |
| `--ease-enter` | `cubic-bezier(.05,.7,.1,1)` | Anything arriving |
| `--ease-exit` | `cubic-bezier(.3,0,.8,.15)` | Reserved for exits (unused on the site today) |
| `--ease-draw` | `cubic-bezier(.6,.6,0,1)` | The line draw |
| `--ease-fill` | `cubic-bezier(.2,.7,.2,1)` | Ring fills |
| `--ease-spring-bounce` | the app's `linear(0,0.106,0.323,0.554,0.748,0.889,0.978,1.025,1.043,1.044,1.036,1.026,1.016,1.008,1.003,1,0.998,0.998,0.998,0.999,1)` under `@supports (transition-timing-function: linear(0,1))`, else `--ease-enter` | The rest banner swell |

### 5.2 The signature: the pinned phone

One phone frame, introduced in the hero, stays on screen while the hero copy and three story steps scroll past; its screen and the lit plane behind it change per step. Markup order inside `.pinblock > .wrap.pg`: `section.hero-copy` (data-i="0"), `div.col-pin` (holds `.pin-s` and `.pin` with `.light` and `.phone`), `div.story-bg`, `section.story` with the strip, the h2 and `ol.steps` of three `li.step` (data-i 1 to 3). The HTML ships with `data-step="0"` on `.pinblock`, so the Today screen shows before any script runs.

Screen layers: three `img.layer` at `position: absolute; inset: 0; object-fit: cover` inside `.screen` (aspect-ratio 780/1688): `.l-today` (steps 0 and 3), `.l-live` (step 1), `.l-body` (step 2). The active layer is `opacity: 1; transform: none`; the others `opacity: 0; transform: translateY(12px)`. Transitions: opacity `--dur-enter --ease-standard`, transform `--dur-enter --ease-enter`. Under `html:not(.m)` the inactive layers are `display: none` (not opacity 0), so nothing on the page sits at opacity 0 when motion is off (W6).

**Desktop (901px and up).**

| Property | Value |
|---|---|
| Grid | `.pg { grid-template-columns: 6fr 6fr; column-gap: 24px }`; hero copy row 1 col 1 (`min-height: max(64svh, <the pin's 765px box>)`, content centred, padding 48px 0, max-width 560px, so the copy and the phone share a vertical middle at 1440x900); the stat strip (6.6) row 2 col 1 with `margin-top: calc(var(--cut) + 48px)`; `.col-pin` col 2 rows 1 to 4; `.story-bg` rows 2 to 4 and `.story` row 3, col 1 |
| Pin | `.pin { position: sticky; top: max(calc(50vh - 382px), 8px); contain: layout; padding: 48px 64px }`. 382px is half the pin's box: a 320px phone is (320 - 20) × 2.1641 + 20 = 669px tall, plus 96px padding is 765px, half of which is 382px (the render's 394px was 12px off; section 15), so the phone centres in tall viewports and sits 8px under the top edge in short ones |
| Phone | 320px wide |
| Light | `.light { position: absolute; inset: -20%; filter: blur(60px); will-change: filter }` with two radial gradients: `50% 40% at 32% 30%` in `--light-a` and `45% 36% at 72% 66%` in `--light-b`, each fading to transparent at 70% |
| Step band | The middle tenth of the viewport: IntersectionObserver `rootMargin: '-45% 0px -45% 0px'` on the hero copy and, for each step, its `h3`. The step box is 100vh tall with its content centred, so watching the box lit a step a full half-viewport before its heading arrived (round 4: step 2 lit with its heading at the bottom edge); the heading is what the reader reaches. A step lights when its heading is inside the band and stays lit until the next heading enters, so the phone shows a step's screen while its copy passes the middle |
| Steps | `min-height: 100vh`, content centred, `padding: 32px 0`, max-width 460px; the first step `min-height: 0; padding-top: 40px` so the strip and h2 do not push it a full screen down, while the h2 keeps 60px of air before the Step 1 eyebrow |
| Sticky range end | `.story { padding-bottom: max(calc(50vh - 40px), 64px) }`, so the phone leaves the viewport with the last step instead of stopping while the Train band arrives |
| Story band | `.story-bg` spans both columns on row 2, bleeds to the viewport edges (`margin-inline: calc(50% - 50vw)`), background `--s1`, `clip-path: polygon(0 var(--cut), 100% 0, 100% 100%, 0 100%)`: the first of the two diagonal cuts. The strip sits on the band under the cut (its own margin-top); `.story` has no top padding |
| Dimming | `.step:not([aria-current]) { opacity: .8 }` with a `--dur-base` transition; the active step's eyebrow turns `--accent-text`. Not .6: that put the dimmed body copy at 3.39:1 on `--s1`; .8 keeps it at 4.87:1 (9.1) |

**Phones and tablets (900px and under).** One column. The phone sits under the hero copy at 240px, then pins under the nav and shrinks so the steps can scroll beneath it.

| Property | Value |
|---|---|
| Grid | `.pg { grid-template-columns: 1fr; grid-template-rows: auto auto 0 auto }`; hero copy row 1 (`min-height: 0; padding: 32px 0 40px`); the stat strip row 2 on `--bg` (`margin: 0 0 40px`), before the pin, so it passes under the nav and never under the phone's fade (a round-3 finding: the labels outlived their figures); `.col-pin` rows 3 to 5 on the 0px track, `position: relative; padding-top: calc(var(--cut) + 16px); z-index: 2`; story on row 4. Under `html:not(.m)` the rows are `auto auto auto auto` and `.col-pin` is row 3 |
| Pin | `top: calc(var(--navh) + env(safe-area-inset-top, 0px) + 8px)`; `padding: 0`; width `--pw0` (240px) at rest |
| Shrink | Target height `--ph: 44svh` (44vh where svh is unsupported). `--phh0: calc((var(--pw0) - 20px) * 2.1641 + 20px)` (496px, the frame's height at rest; it sizes `.pin-s` and the story's top padding); `--pw: clamp(168px, calc((var(--ph) - 20px) * .4621), var(--pw0))`; `--phh: calc((var(--pw) - 20px) * 2.1641 + 20px)` (the frame's 10px bezel on each side, and 1688/780 = 2.1641). Both registered as `<length>` with `@property` so the script can read the resolved pixel value |
| Shrink driver | Where `animation-timeline: scroll()` is supported: `.pin { animation: shrink 1s linear both; animation-timeline: --shrink; animation-range: exit 0% exit 100% }` with `@keyframes shrink { to { width: var(--pw) } }`, timed by `.pin-s`, an invisible block of height `calc(var(--phh0) - var(--phh))` at the pin's rest position with `view-timeline: --shrink block; view-timeline-inset: <sticky top> 0` and `timeline-scope: --shrink` on `.col-pin`. Otherwise the script toggles `.stuck` on `.pinblock` once `.pin-s` passes the sticky line and `.pin` transitions `width` over `--dur-light` |
| Backdrop | `.pin::before`: a full-bleed strip from 8px above the pin to `--pin-fade` (48px) below it, `linear-gradient(var(--s1) calc(100% - var(--pin-fade)), transparent)`, z -2, so copy passing under the phone dissolves instead of showing through |
| Light | `inset: -30% calc(50% - 50vw) 0` with a mask that fades the bottom 24px, so the glow ends at the phone's foot |
| Story spacing | `.story { padding-top: calc(var(--cut) + 16px + var(--phh0) + 32px); padding-bottom: 48px }` leaves room for the phone at rest |
| Steps | `min-height: 40vh; justify-content: flex-start; padding: 48px 0 24px; max-width: none` |
| Step band | A 24px band just under the pinned phone and its fade: `top = pinTop + phh + 48 + 8`, `rootMargin: '-<top>px 0px -<viewportHeight - top - 24>px 0px'`. A step lights only once its heading is in the clear below the phone (W30) |
| Sticky range end | `.col-pin { margin-bottom: calc(var(--pin-fade) + 96px) }` so step 3's rings leave with the phone instead of sliding under it |

**The observer.** One IntersectionObserver watches the hero copy, each step's target (its `h3` on desktop, its box on phones) and every `main > section[id]` (for the nav's `aria-current`). On intersect it writes `data-step` (0 to 3) on `.pinblock`, `aria-current="step"` on the active `li`, and starts the story rings' fill when step 3 lights. The script keeps the set of step targets inside the band; whenever that set is empty after a callback (a target left without the next one entering: the gap between two headings on desktop, a fast flick, a jump) it lights the last step whose target top has passed the band's lower edge, so the phone never keeps an earlier screen or skips ahead. A jump (a hash link, a dragged scrollbar, a programmatic `scrollTo`) can move the page so that no target crosses the band and the observer has nothing to report, so a passive `scroll` listener, debounced to one frame with `requestAnimationFrame`, runs the same scan while nothing is in the band; it does one `getBoundingClientRect` per target and writes nothing when the step is already right. The observer is rebuilt 200ms after a resize because the band depends on viewport size. The lit plane's pair is set in CSS by `[data-step="2"]` and `[data-step="3"]` selectors on `.pin`, transitioning over `--dur-light`.

**Reduced motion or no JavaScript (`html:not(.m)`).** `.pin { position: static }`; the wrapper renders as the hero with its phone, then three stacked step blocks each with its own `figure.step-shot` (a 300px phone, 240px at 640 and under, with the step's screenshot and a caption) that is otherwise `display: none`. Steps `min-height: 0; padding: 40px 0`. On phones the grid rows become `auto auto auto`, `.col-pin` returns to row 2 with no padding or margin, `.pin-s` and `.pin::before` are removed, and the pin has `padding: 32px 40px`. The light is static at the hero pair. Every screen is visible, every step's text is at full opacity (W6).

### 5.3 Reveals

Below-the-fold blocks carry `.r` (single) or `.st` (staggered children, first five). Under `html.m` and `no-preference`: start at `opacity: 0; transform: translateY(12px)`, settle over `--dur-reveal --ease-enter` when `.in` arrives from one IntersectionObserver (`threshold .2`, unobserve after the first hit, so each reveals once). Children of `.st` delay `--stagger` times their index. Transform and opacity only; 12px throughout (the spec's range is 8 to 16px; the hero uses 16px, sections 12px). Nothing above the fold is a reveal: the hero uses the load sequence instead.

### 5.4 Hover and pointer

Gated to `@media (hover: hover) and (pointer: fine)`:

- Cursor-following border shine on `.sh` elements (feature rows, cards, panels): a `::after` with a 1px `--accent-line` border, masked by a 200px radial gradient at `--mx/--my`, updated on `pointermove` (one delegated listener on `document`), opacity 0 to 1 over `--dur-base`. The script binds the `pointermove` listener only when `html.m` is present, so under reduced motion there is no cursor-following shine at all, fine pointer or not: the element keeps its static hairline, the same as on touch devices.
- Primary button hover: background `--accent-hover`, `translateY(-1px)`.
- Secondary button hover: border `--border-strong`, background `--s2`.
- Links and nav links: colour `--text2` to `--text` over `--dur-fast`.
- The mark redraws on `pointerenter` of the nav lockup.

Press: every `.btn:active { transform: scale(.97) }` over `--dur-press`, at every pointer type.

### 5.5 Load orchestration (home page, `html.m` only)

| Order | What | Timing |
|---|---|---|
| 1 | The mark's line draws (`stroke-dashoffset` 1 to 0, `pathLength="1"`) | `--dur-draw --ease-draw`; the dot pops (`scale 0 to 1`) over `--dur-pop` starting at `--dur-draw - --dur-pop` |
| 2 | Hero copy children rise 16px and fade in, in DOM order (eyebrow, h1, lead, CTAs, caption) | `--dur-rise --ease-enter`, delays 0, 1, 2, 3, 4 times `--gap-rise` |
| 3 | The phone arrives: opacity .3 and `scale(.97)` held to 30%, then to 1 | `--dur-draw --ease-enter`, starts with the page |
| 4 | Each screenshot wipes in left to right with a gradient mask when its `load` event fires | `--dur-wipe --ease-standard`; images that were complete before the script ran get the class at once |

On /install/, /privacy/ and 404 only steps 1 and 2 run (the page heading block uses the same rise). Nothing loops; the light does not drift.

### 5.6 Component demos, once each

| Demo | Trigger | Behaviour | Reduced motion |
|---|---|---|---|
| Story rings (Triceps 45, Chest 58) | Step 3 lights | `stroke-dasharray` from `0 100` to `--v 100` over `--dur-fill --ease-fill`, the second `--gap-rise` later | Drawn at final values |
| Body rings (90, 97) | Tiles 40% in view | Same fill | Final values |
| Rest banner | 40% in view | 1:30, 1:29, 1:28 at `--dur-tick` each, then `.done`: the grid stays, the clock reads "Go", the -15 and +15 chips leave, Skip becomes "OK" and the line under reads "Rest done. Next set." (the app's own settled state), with a `scale` swell of the banner to 1.02 and back over `--dur-bounce --ease-spring-bounce` | At the done state from the start |
| Proposal card undo bar | 40% in view | The bar's fill scales X from 1 to 0 over `--dur-undo` linear; on `transitionend` the track turns `--positive` and the label swaps from "Undo · 8 s" to "Applied" | Drained, green, "Applied" |
| Keycap sheen | The card (or its `.st` parent) gets `.in` | `::before` sweeps `translateX(-100%)` to `100%` over `--dur-wipe`, delayed `--dur-wipe`, once | No sweep |
| Copy button | Click | Label reads Copied for `--dur-copied`, then Copy | Same (a label change, not motion) |

### 5.7 Performance rules

- Animate transform and opacity only, plus the registered colour tokens on the light and `stroke-dasharray` on the rings. No layout property animates; the phone shrink on phones animates `width` on one element inside `contain: layout` and is the one exception, chosen over a scale because the sticky offsets must follow the real box.
- `filter: blur()` on `.light` only. The header's `backdrop-filter` is the only other blur, and it is dropped at 400px and under.
- `will-change: filter` on `.light` only. Nothing else declares `will-change`.
- Three IntersectionObservers (nav sentinel; reveals and demos; steps and sections) and one `pointermove` listener behind the fine-pointer gate. Scroll and resize work: a 200ms debounced observer rebuild on resize, and on scroll one passive listener that does at most one frame of geometry (four `getBoundingClientRect` calls) and only while no step target is in the band (5.2). Nothing else listens to scroll.
- `contain: layout` on `.pin`; `overflow-x: clip` on `.page`.
- Blur radius never above 60px; stagger never above 40ms; no animation longer than the undo drain, and that one is the app's real duration.

## 6. Components

Every interactive control has a 44px minimum target, a visible focus ring (`outline: 2px solid var(--focus); outline-offset: 2px`) and a text label. Colour never carries meaning alone.

### 6.1 Nav

Anatomy in 2.2. Layout at 901px and up: `.nav-in` is a grid of three tracks (`1fr auto 1fr`: lockup, links, buttons at `justify-self: end`), so the centre group sits at the same x on every page whatever the primary button reads; at 900 and under it is a flex row with `space-between`. Sizes: 64px tall (57 at 640 and under); lockup mark 28px, wordmark 18px; nav links `min-height: 44px; padding: 0 12px; border-radius: --r1`; current link `background: --accent-soft; color: --text`. States: transparent, solid (`.on`), menu open (`details[open]`, list `position: absolute; left: 0; right: 0; top: 100%; padding: 8px var(--gutter) 16px; background: --bg; border-bottom: 1px solid --border`). Accessibility: `<header>` landmark, `<nav aria-label="Sections">`, the `details` summary is a native disclosure (keyboard works without script). Copy: link labels are the app's tab names plus Privacy; the buttons read "Read the source" and "Install" ("Download the APK" to `#apk` on /install/).

### 6.2 Buttons

| Variant | Fill | Border | Text | Hover (fine pointer) | Press |
|---|---|---|---|---|---|
| Primary `.btn-p` | `--accent`, inset `--hl` | none | `--on-accent` 500 15px | `--accent-hover`, `translateY(-1px)` | `scale(.97)` |
| Secondary `.btn-s` | `--s1` | 1px `--border` | `--text` | border `--border-strong`, fill `--s2` | `scale(.97)` |
| Small `.sm` | as parent | | 14px | | |

Sizes: `min-height: 44px; padding: 0 18px; border-radius: --r2; gap: 8px`; small `min-height: 36px; padding: 0 14px` (small is used only inside the aria-hidden proposal replica, never as a real control). `white-space: nowrap`. Focus: the ring. Disabled: not used on the site. Copy: verbs, two to four words. The full set on the site: "Download for Android", "Download the APK", "Read the source", "Install", "Source on GitHub", "Open in the browser", "Home", "Copy". External links carry `target="_blank" rel="noopener"` and the visible text names the destination.

### 6.3 Phone frame

`.phone`: `--bezel` background, `border-radius: 40px; padding: 10px; box-shadow: var(--shadow), 0 0 0 1px var(--ring)`; `::after` inset top highlight. `.screen`: `aspect-ratio: 780/1688; border-radius: 32px; overflow: hidden; background: --bg`. Sizes: 320px (pinned, desktop), 300px (section figures, `.phone.s`), 240px (640 and under, and the pinned phone at rest on phones), and the phone-width shrink target from 5.2. Upright only: no tilt, no 3D, no hand. Every `img` has `width="780" height="1688" decoding="async"`, `loading="lazy"` except the hero's Today layer (`fetchpriority="high"`, eager). Alt rules in 8.4.

### 6.4 Hairline panel

`.panel`: `background: --s1; border: 1px solid --border; border-radius: --r3; overflow: hidden; position: relative`. Two sizes: the Escobar crop `width: 390px; aspect-ratio: 390/344` with `img { position: absolute; left: 0; top: -63.4%; width: 100% }` (the crop starts 11px above the "Today's brief" heading, whole, and ends after the "What Escobar knows" row; the tab's top card never appears, W31); the check-in `width: 390px; aspect-ratio: 390/629; img { top: -34.1% }`. At 640 and under the panel is 220px wide inside `.duo`. Panels are used where the app shows a sheet or a crop, never for a whole screen (a whole screen goes in a phone frame).

### 6.5 Cards

| Kind | Rules | Where |
|---|---|---|
| Plain `.card` | `background: --s1; border: 1px solid --border; border-radius: --r3; padding: 20px` | The proposal replica |
| Keycap `.card.key` | Plain plus `box-shadow: inset 0 1px 0 var(--hl)`, `overflow: hidden`, a `::before` sheen layer `linear-gradient(105deg, transparent 40%, var(--sheen) 50%, transparent 60%)` at `translateX(-100%)` until swept | Stat tiles in Escobar, promise cards, install cards |
| Tile `.card.tile` | Plain plus `display: flex; flex-direction: column; gap: 12px; font: 500 14px/1.3` tabular | The Body tiles |

Card content order: icon (24px, `--accent-text`, 16px below), `h3.h3-card`, paragraphs at 15px `--text2`, then a button aligned to the start with `margin-top: auto` so buttons in a row line up. Card grids: `.cards3` and `.icards` are `repeat(3, 1fr)` with 24px gap, one column at 900 and under; `.tiles` is `repeat(auto-fit, minmax(140px, 1fr))` with 12px gap; `.stats2` is two columns with 12px gap.

### 6.6 Stat

`b.stat` (figure) over `span` (label, 13 or 14px `--text2`). Figures are real and static: no count-up anywhere. The strip is a `ul` with `aria-label="Four figures about the app"`, four `li` in a row (`repeat(4, max-content)` spaced between, 24px vertical padding, 1px `--border` top and bottom), a 2x2 grid at 640 and under. It is a direct child of `.pg`, not of `.story`, so the grid can place it before the pin on phones (5.2).

### 6.7 Rows with icons

`ul.rows`: 1px `--border` top; each `li` is a grid `24px 1fr`, gap 16px, `padding: 20px 0`, 1px `--border` bottom. Icon: an inline SVG, `viewBox 0 0 24 24`, `fill: none; stroke: currentColor; stroke-width: 1.5; stroke-linecap: round; stroke-linejoin: round`, `color: --accent-text`, `aria-hidden="true"`. Text: `h3.title` and a 15px `--text2` paragraph. Rows carry `.sh` for the shine. The four icons are drawn inline in the render (heart, badge, plate, chevron); reuse those paths.

### 6.8 Rest banner demo

`.rest` (aria-hidden; its meaning is in the row above it): `background: --s3; border: 1px solid --border; border-top: 2px solid --border-strong; border-radius: --r3; padding: 16px 20px; max-width: 420px`. Live state: a grid `auto 1fr` with `.rest-time` "1:30" (rest-time type), `.rest-c` three chips (`min-height: 36px; padding: 0 12px; border: 1px solid --border; background: --s2; border-radius: --r1; font: 500 14px/1`) reading "-15", "+15", "Skip", and `.rest-n` "Next · 50 kg × 6" at 14px `--text2` spanning both columns. Done state (`.rest.done`): the same grid; the clock cell reads "Go", the -15 and +15 chips are gone, the third chip reads "OK", and the line under reads "Rest done. Next set." in the same 14px `--text2`. This is the app's settled banner (Train.tsx `clockText`, `hintText`, the OK button), not a one-line replacement: a reader who arrives after the count still sees the control. Strings are the app's own (Train.tsx); numbers come from the Train screenshot (50 kg × 6).

### 6.9 Proposal card with undo bar demo

`.card.prop` (aria-hidden), `max-width: 390px; margin-top: 24px`: `.title` "Lighter week", a 15px `--text2` line "Fewer sets this week.", a `span.btn.btn-p.sm` reading "Apply" (a span, not a button: it is a picture of the app's control), then `.undo` (`margin-top: 16px; padding-top: 12px; border-top: 1px solid --border`) holding `.undo-l` "Undo · 8 s" (500 14px `--text2`), `.undo-d` "Applied" (hidden until done, `--positive`), and `i.undo-bar` (2px tall, `--border` track, radius 1px) with `b` (`--accent` fill, `transform-origin: left`). States in 5.6. The 8 seconds is the app's real undo window.

### 6.10 Switches

`.switches`: a grid `auto 1fr` with gaps 16px 24px, max-width 820px; one column at 900 and under with the paragraph after the two switches. Each `.sw` is a row (`font: 500 15px/1`, `white-space: nowrap`) of `i.pill` (46x28, `border-radius: 14px; border: 1px solid --border-strong; background: --s2`) with `b` knob (20px, `left: 3px; top: 3px; background: --text2`) and the label text "Share health data" / "Share body data". Static, off, `aria-hidden` on the pill; the label text carries the meaning. Not interactive: the section's paragraph explains them.

### 6.11 Fingerprint block with copy button

On /install/ only (section 15). `.copyrow` is a flex row (`gap: 8px; align-items: flex-start`) of `code.fp#fp` and `button.btn.btn-s[data-copy="#fp"]`. The code block: mono type, `--text`, `background: --bg; border: 1px solid --border; border-radius: --r1; padding: 10px 12px; display: block; overflow-wrap: anywhere; word-break: normal`, and a `<wbr>` after every colon so a wrap can only fall between pairs, never inside one (a review blocker in round 2). The button: `font: 500 13px/1 var(--fm); min-height: 44px; padding: 0 12px; flex: none`, `aria-label="Copy the signing key fingerprint"`, visible label "Copy". On click: `navigator.clipboard.writeText(el.textContent.trim())` (the `<wbr>` elements contribute no text, so the copied string is the exact 95 characters, W10); on success the label reads "Copied" for `--dur-copied`; on failure the text is selected so the reader can copy by hand. `aria-live="polite"` on the button so the label change is announced. The command block `code.cmd` follows the same visual rules in `--text2`, `white-space: pre-wrap`, with `--print-certs` and the file name wrapped in `span.nb { white-space: nowrap }`, and has its own Copy button (`data-copy="#cmd"`, `aria-label="Copy the verify command"`).

### 6.12 Chain list

Used on /install/ (the verify steps) and /privacy/ (what happens when Escobar is on). `ol.chain`: `counter-reset`, each `li` a grid `28px 1fr` with gap 16px and `padding: 16px 0`, 1px `--border` bottom; the counter is a 28px circle (`border: 1px solid --border-strong; font: 600 13px/1 var(--fb)` tabular, `--text2`) and a 2px `--border` line connects the circles vertically (`::after` on every `li` but the last). Text: `h3.title` optional, 15px paragraphs. No motion of its own beyond the reveal.

### 6.13 Bands list

`ul.bands`: `margin-top: 28px; border-top: 1px solid --border`; each `li` a flex row (`gap: 12px; padding: 12px 0; border-bottom: 1px solid --border; font-size: 15px`) starting with `i.dot` (6px circle in the state colour via `--c`, `aria-hidden`). The three rows read: "Green, 67 and above. Train as planned." / "Amber. Keep loads steady, skip increases." / "Red, 33 and below. Fewer sets today." The words carry the meaning; the dot is decoration.

### 6.14 Rings

Inline SVG `viewBox 0 0 40 40`, 40px, `aria-hidden` (the adjacent text carries the value): `circle.tr` (track, `stroke: --border; stroke-width: 4; fill: none`) and `circle.val` (`pathLength="100"`, `stroke-dasharray: var(--v) 100`, `stroke-linecap: round`, rotated -90deg about the centre). Stroke `--warning` in the story (`Triceps 45%`, `Chest 58%`, each with a `path.tick` at the 90 mark in `--text`, 1.5px), `--accent` in Body (`.ring.acc`, 90 and 97). Label: ring-label type, `gap: 10px`. Fill behaviour in 5.6.

### 6.15 Theme row

`.themes` under the install cards: `margin-top: 64px; padding-top: 32px; border-top: 1px solid --border`; one centred 15px `--text2` line, then `ul.trow` (flex, wrap, centred, gaps 24px 40px) of five `li` each with a swatch (`.swatch`, 148x76px, `--r2`, background the theme's own `bg`, 1px border in its `border`) holding the inline lockup (24px mark with `--lk` set to the theme accent, wordmark 16px, in the theme's `text` colour, on an `--r1` chip of its `surface1`) and the theme name at 13px `--text2` beneath. The swatch colours are tokens (`--t-<theme>-bg`, `-s`, `-bd`, `-text` in tokens.css, from themes.ts) set inline on each `li`; at 16px the five marks differed only by the slash colour, and Silent Black #5e6ad2 was indistinguishable from Midnight #635bff. The lockups are the same inline SVG mark as the nav (not the five lockup.svg files, which would cost five requests for one row). Copy: "Five themes. Silent Black, Paper, Ember, Emerald and Midnight. Switching one crossfades the whole app."

### 6.16 Footer

Section 2.3. `.foot { background: --s1; padding: 96px 0 48px }`; row 1 flex with wrap (`gap: 16px 32px; padding-bottom: 40px`); `.fcols` `repeat(3, 1fr)` with 24px gap, `padding: 40px 0`, 1px `--border` top; column `h2` in label-lg type (`600 13px/1`, `.08em`, uppercase, `--text`), 16px below; links 15px `--text2` (`--text` on hover), 10px between; row 3 1px `--border` top, `padding-top: 24px`, mono `--text2`. Footer links are inline text at 15px with 10px spacing (their line box is under 44px; inline text links are exempt from the target rule, W18).

### 6.17 Table (install and privacy pages)

`table.facts`: full width, `border-collapse: collapse`; `th` label type (12px uppercase `--text2`), left-aligned, `padding: 12px 16px 12px 0`, 1px `--border` bottom; `td` 15px `--text`, `padding: 14px 16px 14px 0`, 1px `--border` bottom, numbers tabular; first column `white-space: nowrap` at 641 and up on /install/; on /privacy/ it wraps at every width and the three columns are `width: 33% / 28% / 39%` (about 1.2 : 1 : 1.4) at 641 and up, so "Location" and "Removal" get the room and the Data column no longer takes half the row. At 640 and under each row becomes a block: `th, td { display: block; padding-right: 0 }`, the header row hidden with `.sr-only`, and each `td` carries its column name in `data-label` shown as a 12px label above it. `<caption class="sr-only">` on every table.

## 7. Pages, section by section

Copy below is final. `__VERSION__` renders as the package.json version (37.1.0 today) and `__FINGERPRINT__` as the value of `EXPECTED_SHA256` in `.github/workflows/build-apk.yml`, both injected at build (section 8). Screenshot paths are under `website/renders/shots/`; the build copies the named files unchanged to `website/public/shots/` (section 8.3). Alt text follows 8.4: the alt is the caption sentence where no caption is visible, and a short name of the screen where a figcaption carries the sentence.

### 7.1 Home: `/`

**Hero** (`section#hero.hero-copy`, inside the pinned block)

| | |
|---|---|
| Eyebrow (eyebrow-hero) | With `SITE_APP_URL` empty: "Version __VERSION__ for Android". With it set: "Version __VERSION__ for Android and the browser" (the `<!-- if APP_URL -->` block; the first line must be true on the day it is read) |
| h1 | Training log |
| Lead | Every set you rate feeds a recovery clock for each of 24 muscles, a readiness score for the day and a target for your next session. No account. Everything stays on your phone unless you turn on Escobar, the optional online coach. |
| Buttons | Primary "Download for Android" to `__BASE__install/#apk`. Secondary "Read the source" to the repository. |
| Caption | A signed APK that works offline, with no account. |
| Phone | `shots/midnight-today.png`, eager. Alt: "The Today screen on a Push day, readiness Amber at 66, with triceps at 45% and three days from ready" |
| Layout 1440 | Copy in the left 6fr column, max-width 560px, centred on the pin's box (at least 64svh); the phone (320px) in the right column, pinned, on the lit plane at the hero pair |
| Layout 900 | Same two columns (the break to one column is at 900 and under, so 900 itself is still two columns; at 899 the single column applies) |
| Layout 400 | Copy first (`padding: 32px 0 40px`), then the phone at 240px on its plane, then the story band's cut |
| Motion | The load sequence in 5.5; the phone is the pinned element of 5.2 |
| Criteria | W1, W2, W5, W7, W12, W25 |

**Story** (`section#story`, the pinned block's second row)

| | |
|---|---|
| Strip | 153, exercises in the library · 24, muscles on the map · 6, kinds of records · 8, seconds to undo a coach change |
| Eyebrow | Method |
| h2 | Feedback loop |
| Step 1 | Eyebrow "Step 1". h3 "Effort rating" Body: "After each set, tap E, I or M. Easy means 3 or more reps left, Ideal 1 to 3, Max nothing left. A missing rating never counts as easy or max. It lowers confidence instead." Screen: `shots/midnight-live.png`. Caption and alt: "A live Push session on the machine chest press: two sets logged, the second at 52.5 kg for 6 rated I, and 1:30 of rest counting down" |
| Step 2 | Eyebrow "Step 2". h3 "Muscle recovery" Body: "Every working set leaves an impulse sized by role, effort, reps and load. It decays, stacks over 7 days and adjusts to how your next session actually went, within limits. Ready for hard work at 90%. Fully recovered at 97%." Screen: `shots/midnight-body.png`. Caption and alt: "The muscle map in Recovery view, front and back: chest and front shoulders marked Nearly, rear shoulders Recovering, legs and back Ready" |
| Step 3 | Eyebrow "Step 3". h3 "Readiness score" Body: "Your check-in, sleep, resting heart rate and load make a 0 to 100 score. Green from 67. Red at 33 or below. Amber holds the load. Red cuts sets. The advice is one sentence you can act on: keep loads steady today and skip any increases." Then the bands list (6.13; at 640px and under it shows only in the stacked fallback, since the body already carries the thresholds and the reading band under the pinned phone is about 300px) and two story rings "Triceps 45%" and "Chest 58%". Screen: `shots/midnight-today.png` again. Caption and alt for the stacked fallback: "The Today screen on the same Push day, readiness Amber at 66 and the advice to keep loads steady" |
| Layout 1440 | Left column: strip, eyebrow, h2, then the three steps at 100vh each (the first shorter); the phone pinned in the right column; the band is `--s1` behind both, starting with the first diagonal cut |
| Layout 900 | Two columns still; steps at 460px max |
| Layout 400 | Strip 2x2; the phone pinned under the nav, shrinking to 44svh; steps at 40vh minimum scroll under it; each step lights when its heading clears the phone |
| Motion | 5.2 in full; rings fill when step 3 lights |
| Criteria | W6, W7, W22, W26, W30 |

**Train** (`section#train.band.lift`)

| | |
|---|---|
| Eyebrow | Train |
| h2 | Targets |
| Copy | "Open a session and every set already says what to do, such as 62.5 kg for 8, with a one-line reason. Tap the row to log it as planned or type what actually happened." / "A target steps up after you hit the top of the range twice. It holds when readiness is Amber or a primary muscle is under 60% recovered. A lighter week or a Red day cuts sets. There is no blind 2.5 kg increase." |
| Rows | "Heart-rate rest": With a Bluetooth heart-rate watch, rest ends when your heart rate settles, and falls back to the timer if the signal drops. / "PR chip": The set that beats your best lights up the moment you log it, and History keeps six kinds of records, from heaviest load to furthest carry. / "Plates per side": Tap a barbell target to see the plates in the plates' own unit. Up to 8 gyms, and each machine remembers kg or lb. / "Target reasons": Open the Why this target disclosure under any exercise to see the rule that fired, such as top of range twice, step up, or effort missing, repeat and rate. |
| Demo | The rest banner (6.8) under the rows |
| Figure | `shots/midnight-train.png` in a 300px phone. Caption: "The Train tab with a Push split of three exercises: machine chest press at 50 kg, dumbbell shoulder press at 18 kg, triceps pushdown at 25 kg, three sets each". Alt: "The Train tab" |
| Layout 1440 | Heading and copy 5 columns left (rows 1 and 2 of the section grid, 3.3); figure 7 columns right spanning both rows, `align-self: start` |
| Layout 900 | Same |
| Layout 400 | In DOM order: eyebrow and h2, then the figure at 240px, then copy, rows, banner (the figure sits before the copy, never before the heading) |
| Motion | Copy block `.r`; rows `.st` with the shine; banner demo at 40% |
| Criteria | W5, W18, W21 |

**Body** (`section#body.band`)

| | |
|---|---|
| Eyebrow | Body |
| h2 | 24 muscles |
| Copy | "Tap any muscle for its ring, when it will be ready and how sure the estimate is. Ready times sit under Today, Tomorrow, Later and Sore today. When sleep, resting heart rate and load slow everything down, the map says so in one line, such as "Whole body: recovering about 12% slower than usual this week." If a muscle already feels fine, mark it as fresh." / "This week shows effective sets per muscle against a band and turns amber when you go over. Levels shows how much you have trained each muscle, as a relative measure and not a medical one." / "Sleep and heart rate can arrive from Android Health Connect in the background. Before a session, a quick check-in adds sleep quality, mood and soreness on a 1 to 5 scale. It takes a few seconds and you can skip it." |
| Tiles | Ring 90 "90% ready for hard work" · ring 97 "97% fully recovered" · stat 7 "days of stacking" |
| Figures (`.duo`) | `shots/midnight-levels.png` in a 300px phone. Caption: "The muscle map in Levels view, front and back, the most worked muscles in violet, with the legend Most worked, Some, None". Alt: "The muscle map, Levels view". Then `shots/midnight-checkin.png` in the check-in panel (6.4), offset 48px lower. Caption: "The quick check-in before a Push session: sleep quality, mood and soreness for chest, shoulders and triceps on a 1 to 5 scale". Alt: "The pre-session check-in sheet" |
| Layout 1440 | Figures 7 columns left in two equal tracks, spanning both rows; heading and copy 5 columns right from column 8 |
| Layout 900 | Same |
| Layout 400 | Eyebrow and h2, then the figures stacked and centred (phone 240px, panel 220px), then the copy and tiles |
| Motion | Figures `.st` (the second delayed 2 staggers); copy `.r`; rings fill at 40% |
| Criteria | W5, W11 |

**Escobar** (`section#escobar.band.lift`)

| | |
|---|---|
| Eyebrow | Escobar |
| h2 | Online coach |
| Copy | "Escobar is the one online part of M/ARC, and it is off until you turn it on. Ask about your training and every number in the answer is checked against your own log before it stands; anything unsupported is repaired or marked, and you can see what it looked at." / "When Escobar wants to change something, a split, a schedule, a goal, today's loads or a lighter week, it arrives as a card. Nothing changes until you tap Apply, and you have 8 seconds to undo." / "Without a network the tab still works: the ranked notes, the weekly review and the lighter-week suggestion update on the phone, and each note shows its chain, Noticed, Means, Do next. What Escobar knows lists what it remembers about injuries, equipment and preferences, and you can edit or delete any of it." |
| Stats (keycap) | 14 "kinds of change, each tap to apply" · 422 "cues that work offline" |
| Figure | The Escobar crop panel (6.4) with `shots/midnight-escobar.png`. Caption: "Today's brief on the Escobar tab: Push today, but triceps is only 45% recovered, with the suggestion to swap splits or keep Push light. Nothing agreed yet." Alt: "Today's brief on the Escobar tab". Under it the proposal card demo (6.9) |
| Layout 1440 | Panel and proposal in 6 columns left, spanning both rows; heading, copy and stats in 5 columns from column 8 |
| Layout 900 | Same |
| Layout 400 | Eyebrow and h2, then the panel (full width up to 390px) and the proposal card, then copy and the two stats side by side |
| Motion | Left block `.r`; stats `.st` with the sheen; undo demo at 40% |
| Criteria | W5, W22, W31 |

**History** (`section#history.band`)

| | |
|---|---|
| Eyebrow | History |
| h2 | Session history |
| Copy | "Swipe the calendar between months, tap a day to see its sessions, open any of them to fix a set or a load. Recovery is rebuilt from history after the edit. Swipe a session to delete it and get an Undo that restores it with its heart data." / "Stats shows weekly volume, a sparkline per exercise once you have logged it twice, and records by kind: heaviest load, strength estimate, more reps at a load, most reps, longest hold, furthest carry. Share a week or a session as a card." |
| Figures (`.duo`) | `shots/midnight-history.png`, 300px phone. Caption: "History for September 2026, trained days filled in, today outlined, and the last sessions listed under Recent: Push on Monday the 28th, Pull on Sunday the 27th". Alt: "History, the month calendar". Then `shots/midnight-stats.png`, offset 48px. Caption: "History in Stats view, the exercise progress card: the machine chest press line falls from 95.7 on August 31 to 68.3 on September 28, last top load 50 kg, 9 reps at top, trend marked Slipping". Alt: "History, Stats view" |
| Layout 1440 | Figures 7 columns left, spanning both rows; heading and copy 5 right from column 8 |
| Layout 900 | Same |
| Layout 400 | Eyebrow and h2, then the figures stacked at 240px, then copy |
| Motion | Figures `.st`; copy `.r` |
| Criteria | W5, W21 |

The History and Stats captions name dates and values that are true for the current screenshots; when the screenshots are regenerated (8.3) these two captions are rewritten from the new pictures in the same release.

**Your data** (`section#data.band.cut`, the second diagonal cut)

| | |
|---|---|
| Eyebrow | Your data |
| h2 | Privacy |
| Cards (keycap, icons: phone, cloud-off, file) | "Local storage" Sessions, recovery and settings are stored on the device, and our server keeps no copy. Photos you give Escobar and heart-rate data sit in their own local stores. There is nothing to sign in to, and nothing is uploaded unless you turn Escobar on. / "Offline use" The service worker installs every built file, and the coach notes, weekly review and lighter-week suggestion run without a network. Only a conversation with Escobar needs one. / "Backup and export" Export a JSON backup and restore it with a preview and Undo. Export every set as CSV for 90 days or all time. If saved data ever fails to read at start, it is kept aside as a rescue file, never thrown away. |
| Switches | Share health data · Share body data, with the paragraph: "When Escobar is on, health data (sleep, resting and session heart rate) and body data (weight, measurements) leave the phone only with their own switches on. Turn one off and that data is redacted from replayed history. Requests go through the project's own server, and quotas are counted per device and network address, not per account." |
| Link | A text link after the switches: "How M/ARC handles your data, in full" to `__BASE__privacy/` |
| Layout 1440 | Intro 640px; three cards in a row; switches grid `auto 1fr` |
| Layout 900 | Cards in one column; switches one column with the paragraph last |
| Layout 400 | Same as 900 |
| Motion | Intro `.r`; cards `.st` with sheen and shine; switches `.r` |
| Criteria | W9, W21 |

**Install** (`section#install.band.install`)

| | |
|---|---|
| Eyebrow | Install |
| h2 | Install options |
| Card 1 "Android APK" (icon: arrow down to a line) | Mono line "Version __VERSION__". "Every build is signed with one permanent key, and CI checks the fingerprint on each build before an APK is released." Primary button "Download the APK" to `https://github.com/macdarenz-droid/M-arc/releases/latest`. Text link "Verify the signature" to `__BASE__install/#verify`. |
| Card 2 "Add to Home Screen" (icon: square with a plus) | With `SITE_APP_URL` empty: "The web app has no public address yet. When it does, this page will carry it. Chrome, Edge and Samsung Internet on Android then offer Add to Home Screen, and M/ARC installs as an app and works offline." then "Until then, install the APK." With it set: "Open M/ARC in Chrome, Edge or Samsung Internet on Android and choose Add to Home Screen. It installs as an app and works offline." and a secondary button "Open in the browser" to `SITE_APP_URL`. The same `<!-- if APP_URL -->` block as /install/#web: no imperative until the address exists. |
| Card 3 "Source code" (icon: angle brackets) | "The code is public on GitHub with the architecture notes. Every push runs typecheck, 1,487 unit tests in 116 files, run in three time zones, a production build and a visual gate across the five themes before an APK is signed." Secondary button "Source on GitHub" to the repository. |
| Themes row | 6.15 |
| Layout 1440 | Intro 640px; three cards `repeat(3, 1fr)`, `align-items: start`; the lit plane behind the cards at `opacity: .4` (`inset: auto 10% 15%; height: 60%`) |
| Layout 900 | One column of cards |
| Layout 400 | Same; the plane `inset: auto 0 10%; height: 50%` |
| Motion | Intro `.r`; cards `.st`; themes `.r` |
| Criteria | W9, W13, W22 |

Then the footer (2.3).

### 7.2 Install: `/install/`

Solid nav from the start; the primary nav button reads "Download the APK" and links to `#apk`. Every section is `section.band` with `aria-labelledby`, straight edges, alternating `--s1` and `--bg` starting with `--s1`, 64px vertical padding (48px at 640 and under; not the home page's `--pad`, which left each short band mostly empty: round 4), content in a 640px measure except where a two-column layout is named. The lit plane appears once, behind the heading block, at `opacity: .4`.

| Block | Copy and layout |
|---|---|
| Heading (`--bg`) | Eyebrow "Install". h1 "Installation". Lead: "A signed APK for Android, the web app once it has an address, and the source for anyone who wants to read it." |
| Android APK (`section#apk`, `--s1`) | h2 "Android APK". Mono line "Version __VERSION__". Paragraph: "The release file is named MARC-v__VERSION__.<run>-signed.apk, where <run> is the CI run number." (mono for the file name). Primary "Download the APK" to releases/latest; text link "Releases and changelog". Then a chain list (6.12): 1 "Download the APK from the latest release." 2 "Open the file. The first time, Android asks you to allow installs from your browser or file manager. Allow it for this install." 3 "Tap Install. An update installs over the old version and keeps your data. Android allows that only because every M/ARC build carries the same signing key." At 1024 and up the band is two columns, top aligned: the copy (h2, version, paragraph, buttons, then the chain) in 7 columns left, the Verify block (next row) in 5 columns from column 8, so the page earns its width (round 4); under 1024 one column, the Verify block after the chain with 48px above it. |
| Signature check (`section#verify`, nested in the APK band's right column, on `--s1`) | h2 "Signature check". Paragraph: "Every build is signed with one permanent key, and CI checks the fingerprint on each build before an APK is released. You can check it yourself." Label "Signing key SHA-256" (the paragraph above already says the key is permanent). The fingerprint block with Copy (6.11): `__FINGERPRINT__`. Label "Verify command". The command block with Copy: `apksigner verify --print-certs MARC-v__VERSION__.*-signed.apk`. Paragraph: "apksigner ships with the Android SDK build tools. If the fingerprint it prints matches the one above, the file was signed by the M/ARC key and has not been altered." Keeps `id="verify"` and `tabindex="-1"` as the target of the footer's "Signing key" and the home page's "Verify the signature" links. |
| Obtainium (`section#obtainium`, `--bg`) | h2 "Obtainium". Paragraph: "Obtainium can install M/ARC from the GitHub releases page and keep it updated. Add this address as a source:" then a mono block `https://github.com/macdarenz-droid/M-arc` with a Copy button (`aria-label="Copy the repository address"`). The address is three `white-space: nowrap` segments split after each slash with a `<wbr>` between them, so at 400 it wraps only after a slash and never inside a word (round 4: `word-break: keep-all` still broke at the hyphen in the owner's name); the text content stays the exact address. Paragraph: "Android refuses an update whose signing key differs from the installed app's, so a swapped file cannot install over M/ARC." |
| Web app (`section#web`, `--s1`) | h2 "Web app". With `SITE_APP_URL` empty: "The web app has no public address yet. When it does, this page will carry it. Chrome, Edge and Samsung Internet on Android then offer Add to Home Screen, and M/ARC installs as an app and works offline." With it set: "Open M/ARC in Chrome, Edge or Samsung Internet on Android and choose Add to Home Screen. It installs as an app and works offline." and a primary button "Open in the browser" to `SITE_APP_URL`. |
| Release checks (`section#checks`, `--bg`) | h2 "Release checks". Paragraph: "Every push runs typecheck, 1,487 unit tests in 116 files, run in three time zones, a production build and a visual gate across the five themes before an APK is signed. A release is built on demand from a commit with a green gate." Secondary "Source on GitHub"; text link "Architecture notes". |
| Footer | 2.3 |

Motion on this page: the load rise on the heading block; `.r` reveals on each section; the Copy buttons; nothing else. Criteria: W1, W2, W3, W8, W10, W13, W21.

### 7.3 Privacy: `/privacy/`

Solid nav. Prose in a 640px measure, body copy in `--text` (this page is read, not scanned). Sections alternate `--bg` and `--s1` with 64px vertical padding, 48px at 640 and under (the same rule as 7.2).

Since DOC-3 (2026-09-30) this page is the app's Privacy Policy, the URL given to Google Play. It has two parts:

| Block | Source |
|---|---|
| Heading | Eyebrow "Your data". h1 = the policy's `# ` title ("M/ARC Privacy Policy"), then `p#effective` = its "Effective date:" line, a lead, and two links: Summary, Full policy. |
| Summary (`#summary`) | Hand-written in `website/privacy/index.html`: h3s "Stored data" (facts table, 6.17), "Outgoing data" (chain list), "Sharing switches" (6.10), "Backup and export" (backups, CSV and the rescue file), "Offline", "Website". It says that the full policy applies if the two ever differ. Every claim was checked against the app code on `main` (DOC-3 PR). Headings name the content and the copy never labels itself as simplified (owner, 2026-10-01, DOC-5). Every heading is a short label of one to three words, a noun phrase, never a sentence or a qualifier; the text under it explains it (owner, 2026-10-01, DOC-6). |
| Full policy (`#about` onward) | Rendered at every site build from `docs/PRIVACY-POLICY.md`, the one source (`website/policy.mjs`, called from `website/vite.config.js`). The paragraphs before the first `## ` become "Policy" (`#about`); each `## ` becomes a band with an id from its heading; a line that is only `**Label:**` becomes an `h3` (so `#recipients`). |

Required sections: `REQUIRED` in `website/policy.mjs` lists what Google Play's policy rules ask for (title, effective date, developer and contact e-mail, the named third parties Cloudflare and Anthropic, retention and deletion, children and 18+, applicable law, how changes are announced). The build throws if the rendered page misses one, and the site gate checks the served page again. Editing `docs/PRIVACY-POLICY.md` runs the website workflow's gate.

### 7.4 Not found: `/404.html`

Solid nav, footer, one short band on `--bg` (`min-height: 60svh`, never taller than the viewport): eyebrow "404", h1 "Page not found", paragraph in `--text2`: "The address may have changed or been typed wrong.", buttons: primary "Home" to `__BASE__`, secondary "Install" to `__BASE__install/`. The block is left aligned on the same gutter as the nav, the footer and the other page heads (at 1440, x = 160): the band centres its `.wrap` vertically with flex, and the wrap takes `width: 100%` so it is not shrink-wrapped and centred (round 4). `<meta name="robots" content="noindex">`. Criteria: W8, W28.

## 8. Content model and truth

### 8.1 Every figure and its source

| Figure | Value | Source file | How it reaches the page |
|---|---|---|---|
| Version | 37.1.0 | `package.json` `version` | `__VERSION__`, injected at build (8.2) |
| Release file name | `MARC-v<version>.<run>-signed.apk` | `.github/workflows/release-apk.yml` lines 215-216 | Written into the verify command as `MARC-v__VERSION__.*-signed.apk` |
| Verify command | `apksigner verify --print-certs MARC-v37.1.0.*-signed.apk` | the line above; docs/COACHING-DECISIONS.md "Website renders" | `/install/#verify` |
| Signing key SHA-256 | `05:66:9A:D2:72:1C:6A:BA:F9:FD:D4:B9:B8:4E:2F:B7:94:48:44:B1:DE:F3:59:84:5F:01:5F:2B:67:CA:F1:F5` | `.github/workflows/build-apk.yml` `EXPECTED_SHA256` (read only) | `__FINGERPRINT__`, injected at build; the build fails if the constant cannot be read or is not 32 colon-separated pairs |
| Exercises | 153 | `src/data/exercises.json` (node count) | Strip |
| Muscles | 24 | `src/data/muscles.ts` | Strip, Body h2, hero lead |
| Themes | 5 | `src/theme/themes.ts` `THEMES` | Install themes row, source card |
| Goals | 4 | `src/data/goals.ts` | Not shown on the site (kept in the model for future copy) |
| Coach cues | 422 | `src/data/coachCues.json` | Escobar stat |
| Kinds of record | 6 | `src/brain/prs.ts` `PR_LABEL` | Strip, Train row |
| Kinds of Escobar change | 14 | `src/escobar/tools/schema.ts` `propose_*` tools | Escobar stat |
| Undo window | 8 seconds | `docs/ARCHITECTURE.md`, `src/escobar/tools/actions.ts` | Strip, Escobar copy, undo demo |
| Unit tests | 1,487 in 116 files | `npx vitest run` on 2026-09-28 (docs/WEBSITE-ARCHITECTURE.md section 1) | Source card, /install/#checks |
| Time zones in CI | 3 | `package.json` `test:tz` plus the default run; README "M/ARC gate" | Source card |
| Readiness bands | green from 67, red at 33 or below | `docs/ARCHITECTURE.md` "Readiness"; `Today.tsx` | Step 3, bands list |
| Recovery thresholds | ready at 90%, full at 97% | `src/data/recovery.ts` `READY_PCT`, `FULL_PCT`; `Body.tsx` hint | Step 2, Body tiles |
| Stacking window | 7 days | `docs/ARCHITECTURE.md` "Recovery" | Step 2, Body tile |
| Hold rule | primary muscle under 60% recovered | `docs/ARCHITECTURE.md` "Next session" | Train copy |
| Gyms | up to 8 | `Train.tsx` GymSheet | Train row |
| Check-in scale | 1 to 5 | `Train.tsx` check-in | Body copy and caption |
| Effort ratings | E, I, M with their rep definitions | `Train.tsx` `EFFORTS` | Step 1 |
| Screenshot values (66, 45%, 58%, 52.5 kg, 50 kg, 18 kg, 25 kg, 95.7, 68.3, dates) | as captioned | the current PNGs in `website/renders/shots/` | Captions and alt text; rewritten when the shots are regenerated |
| Data stores | app storage, Escobar photo store, heart-rate store | `docs/ARCHITECTURE.md` "Side stores"; `src/escobar/images.ts`; `src/core/heartStore.ts` | /privacy/#stored |
| Deletion paths | Delete conversations (also clears photos); Reset everything (state, Escobar store, heart store, photos); deleting a session removes its heart series | `src/escobar/ui/SettingsSection.tsx` line 50; `Settings.tsx` `resetEverything`; `History.tsx` `deleteSeries` | /privacy/#stored |
| Sharing switches and hints | Share health data (sleep, resting heart rate, session heart rate); Share body data (weight and measurements) | `src/escobar/ui/SettingsSection.tsx` lines 39-40 | /privacy/#switches, home Your data |
| Photos sent with a message | yes, up to two per message | `src/escobar/ui/EscobarSheet.tsx` line 296; `Composer.tsx` | /privacy/#leaves |
| Quotas | per device and network address | `README.md`; `docs/ARCHITECTURE.md` Worker section | Your data, /privacy/ |
| Health Connect reads | steps, active calories, sleep, heart rate, resting heart rate | `docs/ARCHITECTURE.md` "Android"; `HealthConnectNativePlugin.java` (resting heart rate, DOC-3) | /privacy/#stored |
| Train target example | 62.5 kg for 8 | app-facts Train tab ("62.5 kg x 8 - top of range twice, step up"); `src/brain/progression.ts` headline target | Train copy |
| Load step | 2.5 kg | `src/brain/units.ts` `step` (2.5 kg, 5 lb); `docs/ARCHITECTURE.md` "Next session" (one step up, at most 10%) | Train copy ("no blind 2.5 kg increase") |
| Whole-body line | 12% | `src/slices/body/Body.tsx` line 58 ("Whole body: recovering about {n}% slower than usual this week."); 12 is the example value app-facts shows | Body copy |
| Readiness scale | 0 to 100 | `docs/ARCHITECTURE.md` "Readiness" | Step 3 |
| CSV window | 90 days | `src/slices/settings/Settings.tsx` "Export CSV (90 days)" | Your data card, /privacy/#backups |
| Rest banner replica | 1:30, -15, +15, Next · 50 kg × 6 | `Train.tsx` strings; the Train screenshot for 50 kg × 6 | Rest banner demo (6.8, aria-hidden) |
| Key label; not-found eyebrow | SHA-256; 404 | the hash algorithm's name; the HTTP status | "Signing key SHA-256" on /install/; the /404.html eyebrow |

Nothing else numeric appears on the site. A new figure needs a row here first; W22 is built from this table.

### 8.2 Build-time injection

`website/vite.config.mjs` holds one inline plugin (no dependency) with a `transformIndexHtml` hook that:

1. Inlines partials: `<!-- include: partials/nav.html -->` and `<!-- include: partials/footer.html -->` (and `partials/head.html` for the shared meta, fonts and tokens link).
2. Replaces `__VERSION__` with `package.json` `version` (read from the repo root), `__FINGERPRINT__` with the `EXPECTED_SHA256` value parsed from `.github/workflows/build-apk.yml` by a regular expression on that one line (read only), `__BASE__` with `SITE_BASE`, `__SITE_URL__` with `SITE_URL`, `__APP_URL__` with `SITE_APP_URL`, and `__BUILD_DATE__` with the ISO date.
3. Resolves the conditional blocks `<!-- if APP_URL -->...<!-- else -->...<!-- endif -->` used by the Install card and /install/#web.
4. Fails the build if any `__TOKEN__` remains in the output, if the fingerprint is not 32 hex pairs, or if the version does not match `/^\d+\.\d+\.\d+$/`.

The same script exposes the values to `website/copy-gate.mjs` and `website/og.mjs`.

### 8.3 Screenshot pipeline

- `website/shots.mjs` captures Today, Train, Body, History, Escobar and Settings in all five themes from a production build (`vite preview`) with the gate's legacy fixture; `website/shots-extra.mjs` adds Stats, Levels, the check-in and a live session. Both write 780x1688 PNGs (390x844 at 2x) to `website/renders/shots/<theme>-<screen>.png`.
- Both run once per release, after the app is built, before `site:build`. The site build copies the nine Midnight files it uses (`today`, `live`, `body`, `train`, `levels`, `checkin`, `escobar`, `history`, `stats`) to `website/public/shots/` unchanged; `midnight-settings.png` is not used. The originals are never edited.
- The fixture's training schedule follows the capture date (push today, pull two days on, legs four days on), so Today is a Push day whenever the shots are taken; its newest session is the day before, so the week row reads one workout unless the capture runs on a Monday (the app's week starts on Monday; both scripts warn in that case). The app's floating "Ask Escobar" pill slides away on a downward scroll (src/ui/hideOnScroll.ts), so every shot scrolls 16px first and the pill covers nothing; the screen loses only 16px of top padding. Both scripts fail if their preview server cannot bind its port, so a stale server on the port can never answer the readiness probe with the wrong app.
- After a regeneration the History and Stats captions (7.1) and any value named in a caption are re-read from the new pictures before the site is published; the copy gate lists the values it expects (W22) so a stale caption fails the gate.

### 8.4 Alt text and captions

- A caption is one plain sentence that says what is in the picture, with the real values on screen ("readiness Amber at 66", "52.5 kg for 6"). No adjectives about the app, no verbs like "shows how easy".
- Where a `figcaption` is visible, the image's `alt` is a short name of the screen ("The Train tab", "History, Stats view") so a screen reader does not hear the sentence twice.
- Where no caption is visible (the three layers in the pinned phone), the `alt` is the full caption sentence.
- Decorative SVGs (icons, rings, the mark, dots, pills) are `aria-hidden="true"`; the text next to them carries the value.
- The HTML replicas (rest banner, proposal card, switches) are `aria-hidden` and their meaning is in the copy beside them.
- The OG image has no alt (it is metadata); the favicons have none.

## 9. Accessibility

### 9.1 Contrast

Computed with the WCAG 2.x relative-luminance formula on the flat values (the check lives in `website/gate.mjs`; `color-mix` values are computed in sRGB). The gate composites every ancestor background up to the root and applies each element's and ancestor's `opacity` to the text and the layers beneath it, so dimmed blocks are measured as seen. Text pairs must reach 4.5:1 (3:1 for text at 24px and above, or 18.66px bold and above); non-text indicators 3:1.

| Foreground | Background | Ratio | Use | Result |
|---|---|---|---|---|
| `--text` #f6f9fc | `--bg` #0a2540 | 14.70 | Headlines, copy | Pass |
| `--text` | `--s1` #0f2d4d | 13.22 | Card and band text | Pass |
| `--text` | `--s2` #143559 | 11.81 | Rest chips | Pass |
| `--text` | `--s3` #1a3f68 | 10.17 | Rest banner | Pass |
| `--text2` #a3b6cc | `--bg` | 7.49 | Body copy, captions | Pass |
| `--text2` | `--s1` | 6.73 | Card text, nav links when solid | Pass |
| `--text2` | `--s2` | 6.01 | | Pass |
| `--text2` | `--s3` | 5.18 | Rest banner "Next" line | Pass |
| `--text2` at opacity .8 (#859bb3) | `--s1` | 4.87 | Body copy and eyebrow of a dimmed story step | Pass |
| `--text` at opacity .8 (#c8d0d9) | `--s1` | 8.98 | Heading of a dimmed story step | Pass |
| `--text2` at opacity .6 (#687f99) | `--s1` | 3.39 | The earlier dimming; replaced by .8 | Fail, so replaced |
| `--text2` | `--nav-bg` flat #0a2641 | 7.41 | Nav links over the solid header | Pass |
| `--text2` | `--accent-soft` over `--bg` (#1a2f62) | 6.22 | Current nav link | Pass |
| `--accent-text` #9692fe | `--bg` | 5.80 | Eyebrows, icons | Pass |
| `--accent-text` | `--s1` | 5.22 | Eyebrows on lifted bands | Pass |
| `--accent-text` | `--s2` | 4.66 | Not used; recorded for the rule | Pass |
| `--accent-text` | `--s3` | 4.01 | Never used (rule in 3.1) | Fail, so banned |
| `--on-accent` #ffffff | `--accent` #635bff | 4.70 | Primary button, skip link | Pass |
| `--on-accent` | `--accent-hover` #5952e6 | 5.56 | Primary button hover | Pass |
| `--on-accent` | the render's lighter hover #766fff | 3.83 | Replaced by the row above | Fail, so replaced |
| `--positive` #3ecf8e | `--s1` | 7.00 | "Applied" label | Pass |
| `--positive` | `--bg` | 7.78 | Green dot (non-text, 3:1 needed) | Pass |
| `--warning` #ffbb00 | `--bg` | 9.15 | Amber dot, ring stroke | Pass |
| `--negative` #ff5c5c | `--bg` | 5.13 | Red dot | Pass |
| `--focus` #807bfe | `--bg` | 4.57 | Focus ring (non-text) | Pass |
| `--focus` | `--s1` | 4.11 | Focus ring on lifted bands (non-text, 3:1) | Pass |
| `--text3` #6c839c | `--bg` | 3.97 | Would fail for text; therefore never text | Restricted |
| `--border` #263e57 | `--bg` | 1.41 | Hairlines are decoration, not indicators | Not applicable |

### 9.2 Keyboard and focus

- Tab order follows the DOM: skip links, lockup, nav links (or the Menu summary), the two header buttons, then the page. Every interactive element shows the 2px `--focus` ring at 2px offset; nothing removes `outline` without replacing it.
- The Menu `details` opens with Enter or Space on its summary; Escape closes it (script); the first link inside receives focus when it opens.
- The Copy buttons are real `<button type="button">` elements with `aria-label` and `aria-live="polite"`.
- The proposal replica's "Apply" is a `span`, not focusable, inside an `aria-hidden` block.
- Anchors to sections (`#train`) land on a `section` with `tabindex="-1"` so focus moves with the scroll.

### 9.3 Reduced motion

Section 5: `prefers-reduced-motion: reduce` (or no JavaScript) yields the static page: pinned phone unpinned, three stacked step pairs, rest banner at its done state, undo bar drained and "Applied", rings at their values, no reveals (everything at opacity 1), no wipe, no sheen, no cursor-following shine (the static hairline only; the `pointermove` listener is not bound), no header transition. The gate runs every page twice, with and without the preference (W6, W26).

### 9.4 Structure

- Landmarks: `header`, `nav[aria-label="Sections"]`, `main#main`, `footer`; every `section` has `aria-labelledby` pointing at its heading; the strip and the steps are lists with labels.
- Headings: 4.3.
- Language: `<html lang="en">`. Dates written in words ("September 2026").
- Images: 8.4. Tables: captions and header cells (6.17).
- Touch targets: 44x44 minimum for buttons, nav links, menu items, copy buttons and the lockup; inline text links in prose and the footer are exempt but have `padding: 4px 0` where they stand alone.
- Colour never carries meaning alone: bands and rings have their values in text; the switches' state is stated in words; the current nav link also changes text colour.
- `color-scheme: dark` on `:root` so form controls and scrollbars match; `<meta name="theme-color" content="#0a2540">`.

## 10. SEO and sharing

| Page | `<title>` | `meta description` |
|---|---|---|
| `/` | M/ARC, a training log that knows how recovered you are | A workout log for Android. Every set you rate feeds a recovery clock for 24 muscles, a readiness score and your next targets. No account. Your data stays on the phone. |
| `/install/` | Install M/ARC | Download the signed Android APK, check its signing key with apksigner, or add M/ARC through Obtainium. Version __VERSION__. |
| `/privacy/` | How M/ARC handles your data | What M/ARC stores on your phone, what leaves it only when you turn on Escobar, the two sharing switches, backups, CSV export and the rescue file. |
| `/404.html` | Page not found | There is no page at this address. (`noindex`; the description is for the tab and history only) |

Shared head (partial): charset, viewport `width=device-width, initial-scale=1, viewport-fit=cover`, the title and description, `<link rel="canonical">` (2.5), `theme-color`, the three font preloads, `tokens.css` and `site.css` (one stylesheet each, both under 20 KB before compression), the module script with `defer`, and:

- Open Graph: `og:type website`, `og:site_name M/ARC`, `og:title` (the title), `og:description` (the description), `og:image __SITE_URL____BASE__og.png` (emitted only when `SITE_URL` is set; relative image URLs are ignored by scrapers), `og:image:width 1200`, `og:image:height 630`, `og:image:alt "M/ARC lockup and the heading Training log, on deep navy"`, `og:url` (when `SITE_URL` is set).
- Twitter: `twitter:card summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (same condition).
- Favicons from `branding/midnight/`, copied at build to `website/public/`: `<link rel="icon" href="__BASE__mark.svg" type="image/svg+xml">`, `<link rel="icon" href="__BASE__icon-192.png" sizes="192x192" type="image/png">`, `<link rel="apple-touch-icon" href="__BASE__icon-192.png">`. No manifest: the site is not an app.

**OG image.** `website/og/og.html` is a 1200x630 page using the same tokens: the Midnight plane (the hero pair of lights, blurred 60px, with the grain) behind `branding/midnight/lockup.png` at 96px tall in the top-left (80px margins) and the hero heading "Training log" in Instrument Sans 600 at 72px/1.04, -.03em, `--text`, max-width 900px, bottom-left; a caption line "Android. No account. Your data stays on the phone." in Inter 400 24px `--text2` beneath it. `website/og.mjs` renders it with Playwright (Chromium at `MARC_CHROMIUM`, device scale 1) to `website/public/og.png` before `vite build`; the file must be under 300 KB (PNG) or the script fails.

**robots.txt** (always emitted to `website/public/robots.txt`):

```
User-agent: *
Allow: /
Sitemap: __SITE_URL____BASE__sitemap.xml   (this line only when SITE_URL is set)
```

**sitemap.xml**: emitted only when `SITE_URL` is set, listing `/`, `/install/` and `/privacy/` with `<lastmod>__BUILD_DATE__</lastmod>`. Nothing else is listed.

## 11. Performance budgets

| Budget | Limit | How it is met | Check |
|---|---|---|---|
| HTML + CSS + JS per page | under 120 KB compressed (brotli or gzip) | The render is 60 KB uncompressed with everything inline; the site splits it into `tokens.css`, `site.css` and `site.js` shared across pages, and the SVG grain and icons stay inline | W12 |
| Fonts | under 120 KB total | 30,092 + 48,256 + 31,432 = 109,780 bytes for the three woff2 files, preloaded, `font-display: swap` | W12 |
| Images | every screenshot `loading="lazy"` except the hero's Today layer (`fetchpriority="high"`); every image has `width` and `height`; the hero PNG is 183,654 bytes | Total image weight on the home page is about 1.5 MB, loaded as the reader scrolls; PNGs are kept as captured (no WebP step, no new dependency; section 14) | W5, W12 |
| LCP | under 2.5 s on a mid-range phone (Playwright: 4x CPU throttle, 1.6 Mbps down, 150 ms RTT) | Critical path: HTML, two small stylesheets, three preloaded fonts, one 184 KB image; nothing render-blocking from another origin; the hero h1 paints in the fallback face at once | W25 |
| CLS | under 0.05 | Metric fallbacks for both text faces; explicit image sizes; the pinned block's heights are set in CSS, not measured | W25 |
| Third-party requests | zero | Fonts, images, scripts and styles from the site's origin only; external `href` only on links | W2 |
| Cookies and storage | none | No `Set-Cookie`, no `document.cookie`, no `localStorage`, `sessionStorage` or IndexedDB use anywhere in the site's script | W14 |
| Script | one module under 8 KB compressed, no library | The render's 6 KB script plus the Escape handler for the menu and the second copy button | W12 |
| Long tasks at idle | none over 50 ms after load | No timers except the rest count and the copy label; observers only | W24 |

## 12. Build and hosting summary

Full detail in docs/WEBSITE-ARCHITECTURE.md section 5. In short:

- `website/` is a Vite static site of plain HTML, CSS and JavaScript modules: `index.html`, `install/index.html`, `privacy/index.html`, `404.html`, `partials/`, `tokens.css`, `site.css`, `site.js`, `fonts/`, `public/` (built assets: shots, favicons, og.png, robots.txt, sitemap.xml), `og/og.html`, `site.config.mjs`, `vite.config.mjs` (`root: 'website'`, `base: SITE_BASE`, `build.outDir: 'website/dist'`, the four pages as `rollupOptions.input`, the inline plugin from 8.2), `copy-gate.mjs`, `og.mjs`, `gate/` (the Playwright gate), `shots.mjs`, `shots-extra.mjs`.
- `package.json` gains three scripts only, and the change is called out in the PR: `site:dev` (`vite --config website/vite.config.mjs`), `site:build` (`node website/og.mjs && vite build --config website/vite.config.mjs && node website/copy-gate.mjs`), `site:gate` (`node website/gate/run.mjs`, which serves `website/dist` with `vite preview` and runs the checks in section 13). No new dependency: Vite, Playwright and esbuild are already present.
- The app's own commands are untouched: `tsconfig.json` includes only `src`, `tests`, `scripts/**/*.ts` and `vite.config.ts`, and vitest includes only `tests/**`; the site's files are `.mjs`, `.html` and `.css` under `website/`, so `npm run typecheck`, `npm test` and `npm run build` see nothing new.
- A new workflow file `.github/workflows/website.yml` (added, nothing existing edited): on every push touching `website/**` or `docs/WEBSITE-DESIGN.md`, `npm ci`, `npm run build` (the app, so `shots.mjs` has a build to shoot; the shots step itself runs only on `workflow_dispatch` with `regenerate_shots: true`), `npm run site:build`, `npm run site:gate`, and uploads `website/dist` as an artifact. Deploy to GitHub Pages runs only on manual `workflow_dispatch` (`actions/upload-pages-artifact` and `actions/deploy-pages`, with `SITE_BASE`, `SITE_URL` and `SITE_APP_URL` set in the workflow `env:` block). Nothing in the workflow touches signing, keystores or secrets; it reads `EXPECTED_SHA256` from `build-apk.yml` as text.

## 13. Acceptance criteria

The gate (`npm run site:gate`) checks each item on `website/dist` at 1440x900 and 400x844 (plus 360 for W3), with reduced motion off and on, on every page. The reviewer checks the same list against the built site and this document.

| Id | Criterion | Checked by |
|---|---|---|
| W1 | No console errors and no uncaught exceptions on any page in any of the four runs (two widths, two motion settings) | Gate: `console` and `pageerror` listeners |
| W2 | No failed request, and every request's origin is the site's own; zero requests to any other host | Gate: `requestfailed` and a host filter on `request` |
| W3 | No horizontal scroll at 400 and 360 on every page: `document.documentElement.scrollWidth <= innerWidth` at rest and after scrolling to the end | Gate |
| W4 | `document.fonts` reports Instrument Sans, Inter and JetBrains Mono loaded, each served from the site's origin; no request to `fonts.googleapis.com` or `fonts.gstatic.com` | Gate |
| W5 | Every `img` resolves (`complete && naturalWidth > 0` after scrolling the page), has `width`, `height` and `alt`, and only the hero layer is eager | Gate |
| W6 | With reduced motion on: every step's heading and paragraph is visible (opacity 1, in the flow), no element containing text has computed opacity 0 or a non-identity transform, the three `.step-shot` figures are visible, the pinned phone is static, the rest banner reads "Rest done. Next set.", the undo label reads "Applied" | Gate |
| W7 | With motion on at 1440 and 400: scrolling the page in 100px notches (a mouse wheel, not half-viewport jumps, which can land two steps in the band at once) sets `data-step` 1, 2, 3 in turn, the matching layer is the one at opacity 1, and `--light-a` on `.pin` changes value between steps 1, 2 and 3. At 1440, at the notch where `data-step` changes, the new step's `h3` top is between 350 and 550 of the 900px viewport (the heading is in the middle band, 5.2). At both widths, a jump from the top to 100px past step 3's heading (one `scrollTo`) leaves `data-step` at 3 | Gate |
| W8 | `/`, `/install/`, `/privacy/` and `/404.html` render with exactly one `h1` each and the titles in section 10 | Gate |
| W9 | Every internal link resolves to a file in `dist` (anchors to an existing `id`); every external link is one of the four GitHub URLs in this document and carries `rel="noopener"` | Gate: link crawl |
| W10 | On `/install/`, clicking Copy on the fingerprint writes exactly the 95-character fingerprint to the clipboard, clicking Copy on the command writes exactly `apksigner verify --print-certs MARC-v<version>.*-signed.apk`, each button reads "Copied" then returns to "Copy" | Gate: clipboard permission granted, `navigator.clipboard.readText()` |
| W11 | Every pair in 9.1 marked Pass measures at or above its threshold from computed styles on the live page (text colour and the nearest opaque background) | Gate: `website/gate/contrast.mjs` |
| W12 | Per page, HTML + CSS + JS under 120 KB compressed; fonts under 120 KB total; script under 8 KB compressed | Gate: sizes from the preview server's `content-length` after gzip |
| W13 | The version string on every page equals `package.json` `version`; the verify command equals the string in W10 with that version; the fingerprint equals `EXPECTED_SHA256` in `build-apk.yml`; no `__TOKEN__` remains in any file | Gate |
| W14 | `document.cookie` is empty, no `Set-Cookie` header is received, and `localStorage`, `sessionStorage` and `indexedDB` hold nothing after loading and using every page (copy, menu, scroll) | Gate |
| W15 | On every page the first Tab lands on "Skip to content"; Enter moves focus to `main` | Gate |
| W16 | Heading levels never skip (h1 then h2 then h3) on any page; one h1 | Gate |
| W17 | Landmarks present: `header`, `nav`, `main`, `footer`; every `section` has `aria-labelledby` resolving to an element | Gate |
| W18 | Every `button`, nav link, menu link, header link and card button has a bounding box of at least 44x44 (inline prose and footer links exempt) | Gate |
| W19 | Every focusable element shows a visible focus ring on `:focus-visible` (computed `outline-style` not `none`, width 2px) | Gate |
| W20 | With JavaScript, in both motion runs, the header gains `.on` after scrolling 100px on the home page and loses it back at the top (without JavaScript it carries `.on` from the start, W27); at 400 the Menu opens, lists five links, and closes on Escape and on choosing a link | Gate |
| W21 | The rendered text, `alt`, `title` and `meta description` of every page contain no em-dash, no exclamation mark, no standalone token "AI", none of "free", "open source", and none of the banned words in section 1 and docs/WEBSITE-ARCHITECTURE.md section 3 | `copy-gate.mjs` at build and the gate |
| W22 | Every value in 8.1 appears where 8.1 places it, and no integer above 20 appears in rendered copy, alt or captions other than the 8.1 values, the fingerprint and the dates named in the 7.1 captions | Gate: expected-values list built from 8.1 |
| W23 | `og.png` exists at 1200x630; each page has the OG and Twitter tags in section 10; `mark.svg` and `icon-192.png` resolve | Gate |
| W24 | After load plus 10 s at rest, `document.getAnimations()` contains no animation with infinite iterations, and no long task over 50 ms was observed | Gate: PerformanceObserver `longtask` |
| W25 | LCP under 2.5 s and CLS under 0.05 on the home page at 400 with 4x CPU throttle and a 1.6 Mbps / 150 ms network | Gate: PerformanceObserver; reported per run, fails over budget |
| W26 | With reduced motion on, `document.getAnimations()` is empty at load and after scrolling the whole page | Gate |
| W27 | With JavaScript disabled, every page shows the stacked fallback, all text visible, header solid, links working, no element hidden by a script-only class | Gate: `javaScriptEnabled: false` |
| W28 | `/404.html` shows the copy in 7.4 and its Home and Install links resolve under the configured base | Gate |
| W29 | `robots.txt` exists; `sitemap.xml` exists if and only if `SITE_URL` was set, and then lists exactly the three pages | Gate |
| W30 | At 400 with motion on, for each step at the moment it gains `aria-current`, the step heading's top is below the pinned phone's bottom edge plus 48px | Gate: geometry check |
| W31 | The Escobar panel's image offset and the panel's aspect ratio equal 6.4, so the tab's top card is never inside the panel's box | Gate: computed style check |
| W32 | `filter: blur()` is declared only on `.light`, `backdrop-filter` only on `.nav`, and `will-change` only on `.light` | Gate: stylesheet scan |
| W33 | Every colour in `tokens.css` equals the matching `THEMES.midnight` value in `src/theme/themes.ts` (the gate parses that file as text) | Gate |
| W34 | Every element whose computed font family is JetBrains Mono has `font-variant-ligatures: none`, on all four pages | Gate: computed style scan |

## 14. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The primary button's hover state fails contrast (found while writing this document: the render's lighter hover measures 3.83:1) | Hover darkens to `--accent-hover` (5.56:1); W11 measures it |
| The pinned phone covers a step's copy on phones | The step band sits below the phone's fade; the backdrop strip dissolves passing copy; W30 measures the geometry |
| The pinned story stutters on mid-range Android | Sticky positioning only, one passive scroll listener that does a frame of geometry only while no step is in the band, opacity and transform crossfades, one static blurred element, `contain: layout`; the stacked fallback under reduced motion |
| Screenshots or captions go stale after a release | Regenerated per release by script; W5 fails on a missing image; W22 fails on a caption value the gate does not expect; the History and Stats captions are on the release checklist |
| The Today screenshot shows an empty week | Known and recorded; the fixture fix is a separate task; no caption mentions the week row |
| A claim the app does not keep slips into copy | The copy is final in section 7; the copy gate and W21 and W22 catch drift; every number has a source row in 8.1 |
| The web address or domain arrives later | Three config values in one file; conditional blocks in the two install locations; canonical, OG and sitemap switch to absolute automatically |
| The base path is wrong on GitHub project pages | `__BASE__` on every internal link; W9 and W28 crawl the built output under the configured base |
| Fonts fail to load on a poor connection | Self-hosted, preloaded, `font-display: swap`, metric fallbacks; the page is fully readable in Arial |
| Fingerprint retyped by hand | Read from the workflow constant at build; format-checked; W13 compares it |
| PNG weight on slow networks | All but one image lazy; sizes declared; a lossless PNG optimisation step is deferred because it would need a new dependency (owner approval) |
| Reads as a Stripe clone or as generic dark SaaS | The light exists only behind the phone and the install cards; two cuts only; no mesh, no loop, no stock art; every visual is a real screen with real values |
| The site is mistaken for tracking the reader | No cookies, storage, analytics or third-party requests, stated in the footer and on /privacy/ and enforced by W2 and W14 |

## 15. Decisions made where the inputs were silent

Each is also recorded in docs/COACHING-DECISIONS.md under "Website design spec (2026-09-28)".

1. **Primary button hover darkens instead of brightening.** The render's `color-mix(accent 88%, white)` puts white text at 3.83:1; `color-mix(accent 90%, black)` gives 5.56:1. Source: the contrast computation in 9.1.
2. **The fingerprint and verify command live on /install/ only; the home Install card links to them.** One instance of a 95-character block with a copy button keeps the home page short and gives the reader one place to verify. The home card still shows the version and the download button. Source: the task's page list; signal.org's install page pattern in docs/WEBSITE-ARCHITECTURE.md 2.4.
3. **The APK card comes first in the Install section, the web app second.** The APK is the one path that works today; the web app card states its status. The order flips to web first through a one-line change once `SITE_APP_URL` is set, which is when docs/WEBSITE-ARCHITECTURE.md section 5's "PWA first" becomes true. Source: the same section and the missing hosted address.
4. **The hero's primary button goes to /install/#apk for everyone; no user-agent detection.** The install page carries the verify step, which is the point of the site's trust story, and one link is easier to test than a UA branch. Source: section 1's job statement.
5. **Nav links are Train, Body, Escobar, History, Privacy; the home page's Your data section links to /privacy/.** The nav needs the trust page reachable from every page; "Your data" stays as the home section's eyebrow. Source: the three-page site map.
6. **Internal links use a `__BASE__` token replaced at build.** Vite rewrites asset URLs but not `href` on anchors, and GitHub project pages live under a sub-path. Source: Vite's HTML handling; the undecided domain.
7. **Canonical is root-relative until `SITE_URL` is set; `og:url`, `og:image` and the sitemap are emitted only when it is.** Relative values are accepted for canonical but ignored or invalid for OG images and sitemaps. Source: the task's instruction to use a relative canonical.
8. **The wordmark is Inter 700 at -.04em, not Instrument Sans 600 as in the render.** It matches `branding/midnight/lockup.svg` (Inter 700, letter-spacing -1.5 at 38px), so the nav, the OG image and the app icon read as one mark; Inter's weight axis is already loaded. Source: branding/midnight/lockup.svg; website/fonts/README.md.
9. **Under reduced motion the inactive phone layers are `display: none`, not opacity 0.** The acceptance rule says nothing sits at opacity 0 when motion is off; the stacked figures show every screen anyway. Source: the task's acceptance list.
10. **Figure alt text is a short screen name when a caption is visible, and the full sentence when it is not.** Avoids reading the same sentence twice to screen-reader users while keeping the pinned layers fully described. Source: WCAG technique for figures with captions; the direction spec's alt-equals-caption rule applied where no caption exists.
11. **Card titles unify at 20px/1.3.** The render used 19px in the promise cards and 20px in the install cards; one size means one token. Source: the render's CSS.
12. **Footer column titles are `h2` styled as labels.** Keeps heading order valid (h1 then h2) without a hidden heading. Source: 4.3 and W16.
13. **The themes row uses the inline SVG mark with the theme accent, not the five `lockup.svg` files.** Five extra requests for one decorative row would cost more than they add; the mark path is the same in every theme's file. Source: branding/<theme>/lockup.svg (identical paths, different fills).
14. **The 404 page carries `noindex` and only two links.** Nothing to rank; the reader needs Home or Install. Source: none in the inputs.
15. **OG image is generated with Playwright, which is already a dependency, into `website/public/og.png`, capped at 300 KB.** No new dependency; the same tokens as the site. Source: the task's OG requirement and the no-new-dependency rule.
16. **Sharing details on /privacy/ state that a photo attached to a message is sent with it.** Verified in `src/escobar/ui/EscobarSheet.tsx` (images travel with `S.send`) and `Composer.tsx` (two photos per message). Source: those files.
17. **No lossless PNG optimisation step in this build.** It would need a new dependency, which needs owner approval; recorded as a risk with the numbers. Source: the repo rules.
18. **Fonts are preloaded in the order Instrument Sans, Inter, JetBrains Mono.** The h1 paints first and is the LCP candidate; the mono face is needed only below the fold. Source: 11's LCP budget.
19. **The gate treats footer and prose text links as exempt from the 44px rule.** WCAG 2.5.8 exempts inline links; every button and nav control still meets 44px. Source: WCAG 2.2 target size (minimum) exceptions.
20. **The Obtainium section gives the repository address as the source URL and states Android's same-key update rule.** Both are checkable facts (Obtainium adds GitHub repositories as sources; Android refuses updates signed with a different key). Source: the render's reviewed Obtainium sentence; Android platform behaviour.
21. **The desktop pin top is `max(calc(50vh - 382px), 8px)`, not the render's 394px.** The stated intent is to centre the pin's box: (320 - 20) × 2.1641 + 20 = 669px of phone plus 96px of padding is 765px, half of which is 382px. The render's value put the phone 12px high. Source: 5.2's own arithmetic.
22. **W22 is defined by 8.1, not by a list of its own.** Every figure on the site has a row in 8.1 with its source; the gate's expected-values list is generated from that table, so the two cannot drift. Rows were added for 62.5 kg for 8, 2.5 kg, 12%, 0 to 100, 90 days, 58%, the rest banner replica strings, the SHA-256 label and the 404 eyebrow. The 2.5 kg step lives in `src/brain/units.ts`, not in docs/ARCHITECTURE.md, which states the step rule without the size. Source: the review of this document; the files named in the rows.
23. **No cursor-following shine under reduced motion.** The `pointermove` listener is bound only when `html.m` is present, so reduced motion with a fine pointer gets the static hairline, the same as touch and no JavaScript. Source: 5's gating rule applied to the one listener the render bound outside it.
24. **Three fragment rows became sentences.** The hero caption, the Your data h2 and the install lead now each read as one sentence. The copy rule bans stacked fragments, and the copy gate cannot tell a fact strip from hype, so the site carries none. Source: the owner's copy rule (docs/COACHING-DECISIONS.md "Website copy voice").
25. **The header behaves the same with and without reduced motion; only the transition goes.** The sentinel observer runs whenever JavaScript runs, so W20 has one expected result per motion run, and without JavaScript the header is solid from the start (W27). Source: W20 and W27 read together.
