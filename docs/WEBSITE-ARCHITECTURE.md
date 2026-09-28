# M/ARC website: research, directions and architecture

Date: 28 September 2026. Status: three rendered directions for the owner to choose from; the build architecture below is filled in once one is chosen. One document for the whole website topic; update it, never copy it.

## 1. What the site sells, in one paragraph

M/ARC is a local-first workout, recovery and coaching tracker for Android (signed APK) and as a PWA. Every set you rate feeds a per-muscle recovery model, a 0-100 readiness score and next-session targets that hold or step from your own numbers. Escobar, the optional online coach, checks every number it says against your data and every change it proposes needs your tap. No account, works offline, your data stays on the phone. Numbers the site may show (verified in the code on this date): 153 exercises, 24 muscles on the map, 5 themes, 4 goals, 422 coach cues, 6 kinds of record, 14 kinds of change Escobar can propose, 116 test files with 1,487 tests (`npx vitest run` on this date), version 37.1.0. The source is public on GitHub; there is no LICENSE file yet, so the site says "public source", not "open source", until one is added.

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

Five directions were written (one per angle: Linear, Vercel, Height, Paper, Midnight), scored by two judges (a design-engineering lead and a product marketer) on fit, premium, distinctness and buildability, then reduced to the three that are strongest and most different from each other.

| Direction | Judge totals (of 80) | Result |
|---|---|---|
| Instrument (vercel) | 60 | chosen |
| Paper Edition (paper) | 59 | chosen |
| Silent Black, taken to the web (linear) | 58 | not chosen |
| Midnight Pulse (midnight) | 53 | chosen |
| Ember, checked (height) | 44 | not chosen |

Why this trio: the two highest-scoring directions, Instrument and Paper Edition, were in both judges' trios. The third slot went to Midnight Pulse instead of the higher-scoring Linear direction because one judge said outright that Linear and Instrument are the same page in two grey scales; the trio must give the owner a real choice, so it needs three themes, three type pairings, three signature motions and three hero visuals. Ember (Height) fell out on fit (it sold the optional coach as the product) and buildability. Linear's best parts (the hero phone panel with the theme switch, its copy lines) were grafted into Instrument.

### Option 1: Instrument (`vercel`)

- **Thesis**: Readouts, not claims. A monochrome page that treats M/ARC like a measuring instrument: near-black, white type, hairline rulers with ticks, and the app's real figures as the pictures. The Today screen sits in a plain hairline panel beside the copy, the readiness ruler under both is the signature, and every count in the ledger names its source file. One accent, used once.
- **App theme**: silent-black. **Palette**: bg #08090a, surface #0f1011, text #f7f8f8, muted #8a8f98, accent #5e6ad2, line #202122.
- **Type**: Geist 400 for every headline. Hero 64/68 at -0.035em on desktop (40/44 on phones). Section headlines 44/48 at -0.03em (32/36 on phones). Card and row titles Geist 500 at 20/26, -0.02em. Weight 600 only for the M/ARC wordmark in the nav and footer. text-wrap: balance on headings. Body: Geist 400 at 16/24 for body and 18/28 for the hero sub and section leads. Primary text #f7f8f8, secondary #8a8f98. Max measure 60 characters.
- **Hero**: "What to lift today, and why." M/ARC is a workout log for Android and the browser. It keeps every set on your phone, works out how recovered each of 24 muscles is, scores the day from 0 to 100 and sets your next targets from your own numbers. No account. Nothing leaves the phone unless you turn on Escobar, the optional online coach. Buttons: Download for Android / Open in the browser.
- **Signature motion**: The readiness ruler settles. Sequence on first load, only under prefers-reduced-motion: no-preference and only once: (1) hero copy rises 8px and fades in over 500ms; (2) the heartbeat-M path (M8 40H16L22 22L30 50L36 30L40 40H56, pathLength=1, stroke 6, round caps) draws from stroke-dashoffset 1 to 0 over 700ms with cubic-bezier(.6,.6,0,1), and the #5e6ad2 dot at (30,50) scales from 0.4 to 1 over 200ms as the line reaches the low point; (3) the Today panel arrives from scale .97 with a 30% opacity hold over 900ms, its screenshot wiping in once loaded; (4) after a 200ms pause the marker (a 2px w…
- **Sections**: What ships in 37.1.0. · Targets that respect a bad night. · Every set arrives with a target and a reason. · Ready at 90%. Full at 97%. · Six kinds of records, and a trend for every exercise. · Every number Escobar says is checked against your log. · Your log is a file on your phone. · No account. No sign-in. Works offline.
- **Why it is distinct**: Paper is a warm, light article with a serif and numbered figures; Midnight is saturated navy with a lit plane and a pinned phone. Instrument is the only near-black page in the trio, the only one set in Geist and Geist Mono, and the only one whose signature is a readout: the readiness ruler with real ticks, a ledger that names the source file under every count, a data table instead of a privacy paragraph, and guide lines with crosshairs. Colour appears once on the chrome and otherwise only inside the screenshots. It is the direction that proves the product with numbers a reader can check rather than with mood.
- **Render**: `website/renders/option-1-vercel.html`

### Option 2: Paper Edition (`paper`)

- **Thesis**: A training log you can read. The site is set like a long magazine feature on warm paper: one serif for headlines, Inter for everything else, real app screens placed as numbered figures with plain captions, and copy that explains the app the way its own screens do. The page uses the app's Paper theme tokens, so the site and the installed app look like one product in daylight.
- **App theme**: paper. **Palette**: bg #f7f6f3, surface #ffffff, text #37352f, muted #5f5e5a, accent #2383e2, line #dcdbd8.
- **Type**: Newsreader (Google Fonts), optical size 72, weight 400 for the hero at 64px/1.02 and -0.01em (40px/1.06 on phones), weight 500 for section headlines at 40px/1.1 (30px on phones) and for card titles at 24px; italic 400 for the one quoted line in the Body section. Body: Inter 400 for reading text at 17px/1.55 in a 640px measure with -0.009em as in the app; 500 for buttons and nav links; 600 for figure numbers and eyebrows (11px, uppercase, .06em, text-2). Captions Inter 13px/18px text-2.
- **Hero**: "A workout log that explains today's plan." M/ARC keeps your sets, works out how recovered each muscle is, and writes today's targets with the reason next to each one. No account. Everything stays on your phone unless you turn on Escobar, the optional online coach. Buttons: Download for Android / Open in the browser.
- **Signature motion**: Paste-up. Every figure enters the way a picture is pasted onto a layout. First the hairline frame draws itself around the empty sheet: an SVG rect overlay the size of the sheet with pathLength=1, stroke #37352f at 1px, rx 14, stroke-dashoffset 1 to 0 over 600ms cubic-bezier(.6,.6,0,1), starting from the top-left corner. At 200ms the screenshot rises 12px and fades from 0 to 1 over 400ms with the app's --ease-enter cubic-bezier(.05,.7,.1,1). At 500ms the figure number and caption fade in over 240ms. When the frame animation ends, the overlay is removed and the sheet's own CSS border takes over,…
- **Sections**: The day starts with one card. · Every set arrives with a number and a reason. · A muscle map that knows what you did on Tuesday. · A coach that shows its working. · A log you can go back and correct. · Nothing leaves the phone unless you send it. · Five themes, switched with one crossfade. · Two ways in.
- **Why it is distinct**: This is the only light direction and the only one that reads as an article. Instrument is near-black with rulers and a mono ledger; Midnight Pulse is navy with a lit plane and a pinned phone. Paper Edition puts real screens on warm paper as numbered figures with captions, sets headlines in a text serif with an optical-size axis, and uses the app's own Paper tokens so the site looks like the app running in daylight. Its signature motion is a paste-up of each figure rather than glows or scroll stories, and its one diagram explains the model in a single picture. Nothing on it loops, and every sentence could be read aloud by the person who ships the app.
- **Render**: `website/renders/option-2-paper.html`

### Option 3: Midnight Pulse (`midnight`)

- **Thesis**: Recovery-aware training. Every set you rate changes tomorrow's plan, and the page shows that chain on one upright phone: rate a set, watch a muscle's clock move, see readiness set the day. The Midnight theme's navy is lit from behind the device so the state on screen (violet, green, amber) is the only colour on the page.
- **App theme**: midnight. **Palette**: bg #0a2540, surface #0f2d4d, text #f6f9fc, muted #a3b6cc, accent #635bff, line #263e57.
- **Type**: Instrument Sans 600 for the hero headline and every section headline; 500 for the hero eyebrow line. Display 64/1.04/-0.03em (40px under 640px), h2 44/1.1/-0.024em (32px on phones), h3 22/1.25/-0.012em. text-wrap: balance on headings. Body: Inter 400 for body at 17/1.5/-0.009em (15px on phones) and captions at 13/1.4 in muted; 500 for buttons and nav links; 600 for card titles, eyebrows (12/.08em uppercase in the accent text mix) and stat figures at 48/1 with font-variant-numeric: tabular-nums.
- **Hero**: "A training log that knows how recovered you are." Every set you rate feeds a recovery clock for each of 24 muscles, a readiness score for the day and a target for your next session. No account. Everything stays on your phone unless you turn on Escobar, the optional online coach. Buttons: Download for Android / Open in the browser.
- **Signature motion**: The pinned phone. One phone frame, introduced in the hero, stays fixed on screen while the hero copy and then three story steps scroll past, and its screen changes with each step. Markup: a wrapper section .pinblock is a 2-column grid; the right column (7 of 12) holds .pin, position: sticky, top: calc(50vh - 340px), containing the 320px phone frame and its lit plane; the left column (5 of 12) holds the hero copy block (min-height 100vh) followed by three .step blocks (min-height 100vh each, content centred), so the wrapper is about 400vh on desktop. Inside the phone's screen the image layers s…
- **Sections**: Every set you rate changes the next session. · Targets from your own numbers. · 24 muscles, each with a ready time. · A coach that checks its own numbers. · A history you can edit. · No account. No server copy. Your log stays on the phone. · Get M/ARC.
- **Why it is distinct**: Instrument is near-black with rulers, a mono ledger and one accent used once; Paper Edition is warm, light and editorial with a serif and numbered figures. Midnight Pulse is the only direction on a saturated navy, the only one with a lit plane behind the device whose colour follows the state on screen (violet, green, amber), the only one with diagonal cuts, and the only one where the hero phone itself stays pinned and its screen changes as the story scrolls. It uses a second face (Instrument Sans) for headlines where the others stay with Geist or Newsreader plus Inter, and it ends where it began, on the same light, with the install cards.
- **Render**: `website/renders/option-3-midnight.html`


### Review results (28 September 2026)

Each render was rendered in Chromium at 1440x900 and 400x844 by a reviewer agent, fixed by a second agent, and re-checked, up to three rounds; then one polish pass took the reviewer's remaining notes. A render passes at score 8 or more with no blocking item.

| Option | Round 1 | Round 2 | Round 3 | Polish pass | Published |
|---|---|---|---|---|---|
| Instrument | 7, four blocking (phone clipping, a browser-install promise, the ruler animating below the fold, source paths breaking mid-word) | 8, passed | not needed | nine layout notes applied | https://claude.ai/artifact/FApo35YX3ZCXcy9KkbvNnK |
| Paper Edition | 7, five blocking (theme rail broken on phones, frames drawn before the paste-up, first rail caption clipped, browser-install promise, fingerprint wrapping mid-pair) | 7, two blocking (headline promised two ways in, wrong APK file name) | 7, two blocking (wrong test count, rail fade at rest) | both fixed plus nine notes | https://claude.ai/artifact/G5apDFKmu47kPMcLVkFwLc |
| Midnight Pulse | 6, three blocking (the lit plane rendered as a hard rectangle, the pinned phone covering copy on phones, two stat tiles broken) | 7, one blocking (fingerprint wrapping mid-pair) | 7.5, one blocking (a step lit while its heading was still under the phone on phones) | fixed, phone stays pinned, plus nine notes | https://claude.ai/artifact/1AQUGdTHfCwtXEePi7Q5ZZ |

Corrections made across all three after the reviews: the unit-test count is 1,487 in 116 files (from `npx vitest run`; the earlier 1,255 came from counting `it(` calls), and the verify command names the release file the way release-apk.yml writes it. The review sandbox blocks Google Fonts, so the reviewers' screenshots used size-adjusted fallback faces; the published pages load the real fonts.

What is still open on every option: the web app has no hosted address, so the Install cards say so and point to the APK or the source; the Today screenshot shows a week with nothing logged because the fixture's newest session is the day before the capture (docs/COACHING-DECISIONS.md). Both close once the site is hosted and the screenshots are regenerated from a fixture with a session that week.

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
