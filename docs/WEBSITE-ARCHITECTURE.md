# M/ARC website: research, directions and architecture

Date: 28 September 2026. Status: three rendered directions for the owner to choose from; the build architecture below is filled in once one is chosen. One document for the whole website topic; update it, never copy it.

## 1. What the site sells, in one paragraph

M/ARC is a local-first workout, recovery and coaching tracker for Android (signed APK) and as a PWA. Every set you rate feeds a per-muscle recovery model, a 0-100 readiness score and next-session targets that hold or step from your own numbers. Escobar, the optional online coach, checks every number it says against your data and every change it proposes needs your tap. No account, works offline, your data stays on the phone. Numbers the site may show (verified in the code on this date): 153 exercises, 24 muscles on the map, 5 themes, 4 goals, 422 coach cues, 6 kinds of record, 14 kinds of change Escobar can propose, 117 test files with 1,255 test cases, version 37.1.0. The source is public on GitHub; there is no LICENSE file yet, so the site says "public source", not "open source", until one is added.

## 2. Research (four lenses, live pages read where possible)

Evidence categories: **Verified** = page fetched and its HTML/CSS read in this session. **Reported** = read from write-ups or a gallery capture because the live page was blocked or gone.

### 2.1 The three sites the owner named

| Site | Status | What carries over to M/ARC |
|---|---|---|
| linear.app (home, /plan) | Verified | Page #08090a, one accent (#5e6ad2, the same indigo M/ARC's Silent Black already uses), text #f7f8f8 / #b4bcd0, 1px translucent hairlines (#ffffff14) instead of shadows. One family, Inter Variable at weight 510, tracking -0.012em to 24px and -0.022em from 32px; hero 64px. 12-column grid, 1344px max, 128px section padding. Sticky header that turns solid on scroll. Motion lives inside components: masked wipe-in on images, a stepped LED grid, hover edge highlight, a logo marquee. Product UI shown straight-on in a rounded panel that fades into the page; no phone bezels. |
| vercel.com (home) | Verified | Near-black #000 with greys #1a1a1a to #ededed, borders as 1px #ffffff25 box-shadows. Geist Sans and Geist Mono; display tracking -6% of size (72/-4.32px, 64/-3.84px), hero h1 at weight 400. 12 columns, 20px gutters, sections 160-208px apart. Grid lines and ticks are part of the design; numbers and code are the imagery. |
| height.app | Reported | Height shut down on 24 September 2025; the live site is gone and the archive is blocked from this session. From a 2024 full-page capture: #111111 / #000000 bands, cards #1a1a1a with #2a2a2a hairlines, a rounded geometric display sans at 56-72px in sentence case with a full stop, one spectrum accent used sparingly, product cards that tilt and glow on hover. Its spectrum was its brand mark and is not copied. |

What the three share, and what reads as premium: near-black rather than grey, hairlines not shadows, one variable sans with tracking that tightens as size grows, generous vertical rhythm, one accent used as a thin line of colour, real UI shown at true proportions, motion kept small and inside components, every animation gated behind prefers-reduced-motion.

### 2.2 Premium fitness and health sites

Verified: Oura, Hevy, Strong, Bevel, Gentler Streak, Fitbod, Ladder. Reported: WHOOP (Cloudflare blocks non-browser clients). The quiet, premium pattern: one restrained accent on near-black or warm off-white, a display face paired with a neutral grotesque, real app screens in a simple frame with captions that state the actual value on screen (Bevel: "Strain Score at 65% on February 19"), scores drawn as rings or dials that progressively disclose (score, then trend, then raw data).

Avoid: stock gym photography; neon accents on black; shouty caps headlines; gradient blobs, noise and decorative stars; superlatives and ranking claims; "AI-powered", "24/7 coach", "science-backed"; jargon in coach messages; celebrity heroes and mascots; feature laundry lists; page-builder fly-ins; mockups with impossible data.

### 2.3 Motion and interaction craft (2025-2026)

Read from the live source of raycast.com, arc.net, family.co, Notion Calendar, reflect.app, superhuman.com, resend.com, clerk.com and linear.app. The pattern every verified site follows: one hero entrance (translateY 16-20px plus opacity, 0.8-1s, staggered 0.15-0.2s), transform/opacity-only loops, masks instead of overflow hacks, `@property`-typed custom properties for animated gradients, spring easing via `linear()` with an `@supports` fallback, in-view gated demos (IntersectionObserver plus a data attribute), a two-axis mask fade, a tiled noise texture at low opacity, hover lift with GPU promotion, and `@media (hover:hover) and (pointer:fine)` around anything hover-only.

Avoid: GSAP, Lenis and scroll-hijacking; WebGL or Spline above the fold; per-letter reveals on anything longer than a wordmark; stagger delays over 0.2s; infinite loops on more than one or two elements; blur radii over 24px; animating layout properties; any animation without a reduced-motion counterpart.

### 2.4 Local-first and indie app landings

Verified: Obsidian, Bear, Things, Craft, Signal, Standard Notes, Hevy's install flow. Three patterns matter: privacy sells as short concrete promises ("Your thoughts are yours." "No ads. No trackers. No kidding."), never as legal text; install sections are per-channel cards with the safe path first, then a direct APK with the signing fingerprint in monospace, the verify command, version and date; public source is shown as a plain link to the repository and the release page, not as a badge wall. Everything the site claims about data must be true in the app: if the site says no tracking, the site itself ships no analytics.

## 3. Copy rules (owner, 2026-09-28)

Every headline, sentence, caption, button and alt text is written in a plain, professional, human voice. Concrete nouns and verbs. The app's own words (Readiness, Recovery, Escobar, Today, Train, Body, History, records, splits, sets, effort). Real numbers from section 1. Banned: seamless, effortless, elevate, unleash, supercharge, game-changing, revolutionary, next-level, empower, journey, unlock, harness, delve, crafted, meticulously, robust, cutting-edge, "powerful" or "smart" as filler, AI-powered, "in today's world", "whether you're X or Y", "not just X, but Y", rhetorical questions, three adjectives in a row, exclamation marks, em-dashes, colon-then-reveal headlines, Discover, Experience, Welcome to, Meet, Introducing, Say goodbye to, Take control, Level up, Redefine, Reimagine. Feature headlines name the thing ("Rest by heart rate"). Captions describe what is in the picture in one sentence ("The Today screen on a push day, readiness at 66."). The rule is enforced three times: in each direction's copy deck, in the build, and in the review of each render.

## 4. The three directions

Filled in from the render review. Each render lives in `website/renders/option-<n>-<key>.html` and uses the real app screenshots in `website/renders/shots/` (captured by `website/shots.mjs` and `website/shots-extra.mjs` from a production build with the gate's fixture data: Today, Train, Body, History, Escobar, Settings, Stats, Levels, check-in and a live session, in all five themes).

(to be filled)

## 5. Build architecture for the real site

Decided once the owner picks a direction. Fixed points that do not depend on the choice:

- A static site in `website/`, built with Vite (already in the repo) and plain HTML, CSS and JavaScript; no framework, no animation library, no analytics, no cookie banner. The app's own theme tokens (`src/theme/themes.ts`) are the site's palette source so the two never drift.
- Fonts self-hosted (Inter Variable is already a dependency) so the page does not call Google at load.
- Product imagery is real screenshots regenerated by `website/shots.mjs` from each release build, so the site never shows a screen the app does not have.
- Install section: PWA first ("Add to Home Screen"), then the signed APK from GitHub Releases with the fingerprint `05:66:9A:…:F1:F5` shown read-only in monospace and the `apksigner` verify command, then the repository link. Nothing on the site touches signing steps, keystores or secrets.
- Hosting: GitHub Pages or Netlify from `main`, decided with the owner because it is a new external service.
- Checks: the site gets its own Playwright gate (desktop 1440, phone 400, reduced motion on and off, console clean, no horizontal scroll, fonts loaded, every image resolves) run in CI next to the app gate.

## 6. Risks and mitigations

| Risk | Mitigation |
|---|---|
| The site looks like a template or machine-made | Directions are judged against the reference sites; copy rules in section 3; real screenshots only; no stock, no blobs, no emoji icons. |
| A claim on the site the app does not keep | Every number and promise traces to a file in section 1; "public source" until a LICENSE exists. |
| Motion that hurts phones or accessibility | Transform/opacity only, reduced-motion counterpart for every animation, hover effects gated to fine pointers, no scroll hijacking. |
| Screenshots go stale | Regenerated from the build by script; the site gate fails on a missing image. |
| Height is gone | Its patterns are taken from a capture and write-ups and are marked Reported; the Linear and Vercel findings are Verified and carry the weight. |
