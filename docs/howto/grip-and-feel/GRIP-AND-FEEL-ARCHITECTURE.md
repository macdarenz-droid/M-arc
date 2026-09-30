# Grip, posture and "where you feel it": architecture for the Technical Plate How-to

Status: architecture only, 2026-09-30, revised after the critic's review the same day (safety copy, hand camera,
push physics, CI checks, equipment handling). No app code written. Nothing in the repo was changed.
Inputs read: `grip/research/GENERAL.md`, the 8 verified cards in `grip/research/*.json`, `plates2/engine/SPEC.md`,
the gallery page and screenshots, and at `wt-arch` (main fba3f37): `src/ui/MuscleMap.tsx`, `src/svg/bodyMuscles.ts`,
`src/data/muscles.ts`, `src/data/exercises.json`, `src/theme/themes.ts`, `src/ui/motion.ts`, `src/ui/sheetStack.ts`,
the `EntryCard` in `src/slices/workout/Train.tsx`, `docs/FORM-GUIDE-ARCHITECTURE.md`, and the old schema
(`src/formguide/model.ts`, `muscleNotes.ts`) on `claude/backup-fg-2026-09-29-main`.
Numbers in this doc that I computed (coverage counts, contrast ratios, lint hits, SVG sizes) came from scripts run on
those files today. The owner's two photos were not available to me; the fault is drawn from the brief's description.

---

## 1. Summary for the owner

**What you will see.** Every exercise's How-to sheet gets three new layers on top of the drawing you already have.

1. **The hand.** On any exercise where you hold something, the drawing has a tappable hand, and a "Hand" button under
   it. Tap it and a hand panel grows out of that spot. You see two hands side by side: the right hold on the left,
   the common wrong one on the right. The panel says where it is seen from ("Seen from above"), because the best
   angle for the wrist is often not the side view of the main drawing. The thumb is drawn clearly, wrapped round the
   handle. A thin line shows where the push goes. On the right hand it runs straight down the forearm. On the wrong
   hand it passes on the back-of-hand side of the wrist, and a red arc marks the bend.
2. **Posture close-ups.** Tap a label on the drawing ("Handles mid-chest", "Blades on pad") or its button and the
   drawing zooms into that spot, again right next to wrong.
3. **Where you should feel it.** A small body map under the drawing. The muscles that should do the work shimmer
   twice, slowly, and the helpers glow softly. That's all you see at rest. Under it: one plain line ("You should feel
   this across the middle and lower chest...") and up to three rows, "If you feel it in...", each saying what that
   usually means and how to fix it. Opening a row marks its spot on the map. The wrist row jumps straight to the hand
   close-up.
4. **Handling the kit.** Setup steps now include getting in and out of a machine, checking the pin, using the foot
   bar, kicking dumbbells up, and un-racking with the safeties set (section 3.4). Each needs its own source before it
   ships.

**Why this stops what happened to your wrist.** On your heavy set the handle sat in your fingers and your wrist was
bent back. The push then ran on the back-of-hand side of the wrist, so every rep levered the wrist further back. The
right way puts the handle low in the palm, on the heel of the hand, so the push goes straight down the forearm bones
(mechanics and coaching agreement: Barbell Logic https://barbell-logic.com/bench-press-grip-tips/ , ACE chest press
https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/). The design makes that hard
to miss, without waiting for you to open anything:

- On every pressing exercise, one of the three labels on the main drawing is always "Heel of palm".
- The Mistake button on pressing exercises shows the wrist fault first.
- In the workout itself, the hint line under the exercise shows "Push with the heel of your hand." every time, not
  only when the How-to is open.
- The hand close-up is the first button, and its wrong picture is drawn to match your fault: handle in the fingers,
  wrist folded back, thumb loose. You check it against your photo before it ships (section 8).
- The drawing engine works out where the push line passes and which way it bends the wrist. The build checks the
  angles and the push line: the right hand must keep the handle in the heel of the palm with the line close to the
  wrist, and the wrong hand must bend the wrist further back. People still check the pictures, because a program
  can't tell a loose thumb or swapped labels.
- The grip line says it in words: "Put the handle low in your palm, right on the heel of your hand, and wrap your
  thumb around it. Your knuckles should line up with your forearm. If your wrist starts bending back, the weight is
  too heavy."
- One shared "get it checked" block, the same on every exercise (NHS wrist-pain guidance,
  https://www.nhs.uk/conditions/hand-pain/wrist-pain/, checked 2026-09-30):
  - "Get it checked today if you can't grip, the wrist looks a different shape, or your hand goes numb."
  - "See a doctor if it's no better after two weeks of rest, keeps coming back, or tingles."

**For your wrist right now** (same NHS page): see a doctor if it isn't better after two weeks of home care, gets
worse or keeps coming back, tingles or goes numb, or turns warm, swollen and stiff. Get urgent help (NHS 111 in the
UK) if the pain is severe, you can't move the wrist or hold things, it changes shape or colour, you lose feeling in
the hand, you heard a snap or pop when it happened, or the pain makes you feel faint or sick. Until then the NHS
advice is rest, ice for up to 20 minutes every 2 to 3 hours, no heat for the first 2 to 3 days, and no heavy
lifting. When you train again, use the vertical handles, go lighter, and stop the set if it hurts (handle choice for
a sore wrist is coaching consensus from the chest press and pull-up cards, not measured).

**Two honest limits.** First, nobody has measured wrist load on a machine chest press handle. The heel-of-palm rule
comes from mechanics and coaching agreement, and each rule keeps an evidence tag in its data (research only, never shown in the app, LR-23).
Second, "where you feel it" is a coaching target, not a measurement. On the machine chest press the front shoulders
work almost as hard as the chest by EMG (Muyor 2023, https://pmc.ncbi.nlm.nih.gov/articles/PMC10203828/), so feeling
them a bit is normal. The app says "if the front of your shoulders is doing most of the work" as a setup goal, not
as a fact about muscle activity.

**One correction to the brief.** The sample line "lower the seat a notch" when the shoulders take over is the wrong
way round on a normal chest press machine: a low seat puts the handles up near your shoulders. "Raise the seat" can
also be wrong, if the seat is already too high or the machine moves the handles on their own. So the copy names the
target, not a direction: "set the seat so the handles line up with the middle of your chest. On most machines that
means raising it." (ACE chest press, above; the chest press card caught the slip.) GENERAL.md has the same slip and
more (see section 6), so no copy may be taken from it.

**Scale.** The 153 exercises share 10 hand types and 8 body-contact types, so the app needs about 18 drawings and
rule sets, not 153 (section 3). Every library exercise is already assigned (appendix B); five need a second look.

**What only you can decide** (section 8): paying a physio and a qualified coach to review the content, the wording
of the "not medical advice" line, whether users see the evidence tags (settled by LR-23: they never do), whether the hand close-up may pop up once by
itself (that needs a small "seen" note saved on the phone), and checking the wrong-hand picture against your photo.

---

## 2. User experience

### 2.1 Where it lives

The How-to sheet stays the one described in the Technical Plate work: header, plate (358 x 358), cue line,
Trace and Mistake pills, tempo. The new parts slot in below the pills, in this order, so nothing moves on the plate:

1. Header ("How to do it", exercise name, close)
2. Plate, with callouts (max 3, unchanged rule) and **hotspots** (new, invisible 44 px hit areas; one on the hand).
   On `push` exercises one of the 3 callouts is always the grip ("Heel of palm"), anchored on the `grip` landmark
3. Cue line (unchanged, `aria-live="polite"`)
4. Pills: Trace, Mistake, "Saved offline" (unchanged). On `push` exercises the Mistake pill shows the wrist fault:
   the plate box shows the hand zoom's wrong hand large, the right hand small beside it. The plate's own body
   mistake (on the chest press, "round and lock") moves to its posture zoom's wrong crop ("Blades")
5. **Look closer**: a row of up to 4 zoom chips. "Hand" is first whenever the load goes through the hands
   (hand archetypes `push`, `pull`, `hang`, `hold`, `curl`, `on-body`); last chip is always "Where to feel it"
6. Tempo (unchanged)
7. **Where you should feel it**: compact body map (front and back), feel line, legend, "If you feel it in..." rows
8. **Set up**: numbered steps, first 3 shown, "All steps" expands

No sources, evidence labels or contacts are shown (owner decision LR-23, 2026-09-30). Sources stay in the data.

Entry point is unchanged: the How-to sheet opens from the exercise card (`EntryCard` in `Train.tsx`) through the
existing `Sheet` and `sheetStack`. Nothing new on Today.

**Outside the sheet (mid-set).** Nobody opens a How-to between heavy reps, so the grip rule also sits where the eye
already is. `EntryCard` already prints a rotating coach cue (`pickCue`, `Train.tsx` line 699, shown at line 779). For
`push` exercises it adds one more `hint muted` line with the archetype cue, "Push with the heel of your hand.", on
every set. It reads static content only, so it adds no saved data.

Showing the hand zoom by itself the first time a `push` exercise is opened would need a "seen" flag on the phone.
That is new saved data, so it is an owner decision (section 8) and is not in v1.

### 2.2 States

| ID | State | What shows |
|---|---|---|
| S0 | Plate | The plate as today, plus a faint dotted ring on the hand hotspot and the chip row |
| S1 | Mistake | Existing mistake layer (on `push`: the wrist fault, see 2.1). Chips stay; hotspots stay |
| S2 | Hand zoom | The plate box shows the hand detail: Right (left half) and Wrong (right half), with the camera label ("Seen from above") and an orientation mark. A second page for thumb options only on `hang` and `pull`; one page everywhere else |
| S3 | Posture zoom | The plate box shows a crop of the plate: Right crop and Wrong crop side by side |
| S4 | Feel (resting) | Map with main muscles filled, helpers soft; nothing else; no motion. Legend has 2 entries |
| S5 | Feel (shimmer) | S4 plus a light diagonal band over the main muscles, 2 slow passes, then back to S4 |
| S6 | Feel row open | One "If you feel it in..." row expanded; only now its muscles get the dashed "watch" outline or its joint the pain tint; shimmer paused |
| S7 | Reduced motion | Same content, no zoom scaling, no shimmer, no pulse. Crossfades of 150 ms (REDUCED_DUR) or none |

S2/S3 and S1 are exclusive in the plate box: opening a zoom clears Mistake; closing the zoom restores the state the
plate was in. S4 to S6 live in the feel section and run independently of the plate box.

### 2.3 Transitions

Durations and easings are the app's motion tokens (`src/ui/motion.ts`: `DUR.enter` 240, `DUR.exit` 160,
`EASE.enter`, `REDUCED_DUR.enter` 150).

| From | Event | To | Motion | Reduced motion | Focus and speech |
|---|---|---|---|---|---|
| S0/S1 | Tap hand hotspot or "Hand" chip | S2 | The hand panel grows out of the hotspot's own box (or the chip's) to fill the plate box while crossfading with the plate (`transform: scale` and `opacity` on the panel, 240 ms, EASE.enter). The plate itself does not scale, because the hand view is often a different camera (5.1) and a zoom into the plate would pretend it is the same one | Crossfade 150 ms | Focus moves to the zoom heading "Hand: right and wrong"; the camera label and grip line are read |
| S0/S1 | Tap a callout that has a zoom, or its chip | S3 | Plate scales 1 to 2.2 around the callout anchor (CSS `transform` on the plate wrapper, 240 ms, EASE.enter). A posture zoom is a real crop of the same side view, so scaling is honest here | Crossfade 150 ms | Focus to "Seat height: right and wrong" |
| S2/S3 | Back button in the box, Android back, or tap the active chip | previous S0/S1 | Reverse, 160 ms, EASE.exit | Crossfade 100 ms | Focus returns to the control that opened it |
| S2 (`hang`, `pull` only) | Tap "Thumb" page dot or swipe | S2 page 2 | Horizontal slide 240 ms | Instant swap | "Thumb options, page 2 of 2" |
| S2/S3 | Tap another chip | the other zoom | Crossfade 150 ms (no zoom out and in) | Instant swap | Focus to the new heading |
| any | Feel section 50 % in view for 300 ms (first time per sheet open) | S5 | Shimmer, 2 passes of 2.4 s | Stays S4 | none |
| any | Tap "Where to feel it" chip | S5 | Sheet scrolls to the section, then shimmer | Scroll without smooth, S4 | Focus to the section heading |
| S4/S5 | Tap a row | S6 | Row expands (`transform`/`opacity` reveal, 200 ms; no height animation); marked outline or joint tint fades in once (opacity 200 ms) | Row expands instantly; outline static | Row is a button with `aria-expanded`; means + fix read |
| S6 | Tap "Show me" in a row that links a zoom | S2/S3 | Sheet scrolls to the plate, then zoom opens | Instant | Focus to the zoom heading |
| S6 | Tap the row again | S4 | Collapse | Instant | |
| S5 | Tap the map | S5 again | One more 2-pass run | S4 | |

Android back closes the zoom before the sheet: the zoom registers itself in `sheetStack` (`registerSheet('howto-zoom', close)`)
while open, so the existing back handling pops it first.

No animation is endless. The shimmer stops after 2 passes (300 ms delay + 2 x 2.4 s + one 0.4 s gap = 5.5 s), the
same rule the old form guide used and the one `styles.css` follows (endless animations only under a live state such
as `.active`).

**Why the shimmer won't read as "loading".** A straight band sweeping top to bottom over a grey block is the common
loading-placeholder look. Here the band is clipped to the muscle shapes (never a rectangle), runs at a slight
diagonal (about 20 degrees), is slow (2.4 s a pass), runs only twice, and starts only after the section has been in
view for 300 ms, so it never plays while content is still appearing. The gap check in C12 keeps the timing honest.

### 2.4 Tap targets

- Every chip, pill, row and zoom control: at least 44 x 44 CSS px (the brief's rule; the plate sheet's `.howto-pill` is
  already 44 px). Android's accessibility guidance asks for 48 dp; hotspots use 48 where two hotspots are far enough apart.
- Plate hotspots are invisible circles centred on their anchor (the hand hotspot on the `grip` landmark of the end
  pose). Two hotspots closer than 44 px merge into the one that comes first in the zoom order. The chip row is the
  guaranteed path; hotspots are a shortcut, so a merged hotspot loses nothing.
- The hand hotspot shows a dotted ring (1 px `--text-3`, r 14 px) so people learn it is tappable. The ring is inside
  the hit area and is placed by the same label placer as callouts, so it never covers a label.
- Map muscles are not separate tap targets on this sheet (the paths are 2 to 10 px wide at phone size). The rows are
  the targets. Tapping the map as a whole replays the shimmer.

### 2.5 TalkBack

- Hotspot: button, "Hand position. Opens a close-up of the right and the wrong grip."
- Posture hotspot: button, "Seat height. Opens a close-up of the right and the wrong seat height."
- Zoom panel: region labelled by its heading, then the camera label ("Seen from above"). Each half is `role="img"` with the zoom's `alt.right` / `alt.wrong`, e.g.
  Right: "Handle low in the palm on the heel of the hand, thumb wrapped round it, wrist straight, knuckles in line with
  the forearm. The push runs straight down the forearm." Wrong: "Handle in the fingers, wrist bent far back, thumb
  loose. The push passes on the back-of-hand side of the wrist and bends it further back."
- The words Right and Wrong are printed on screen with a tick and a cross icon, so the meaning is never colour only.
  This is required, not decoration: in Ember the mistake colour is violet and only the icon and word say "wrong".
  C16 fails a zoom without both, so a later polish pass cannot drop them.
- Map: one `role="img"` per view with a label built from the FeelSpec: "Where you should feel it. Main: chest.
  Also working: upper chest, triceps, front shoulders." Watch muscles are read only inside their open row.
  The paths inside are `aria-hidden`. The shimmer has no speech.
- Rows: buttons, "Front of the shoulders. Usually means: the handles are too high for your chest...". Expanded state
  announced. "More" is a button, "Show 2 more".
- Everything the pictures show is also in text (grip line, posture detail, feel line, rows), so a screen reader user
  gets the whole content without the drawings.

### 2.6 Themes

All colour is theme tokens. The plate engine already carries a `--mistake` token that is not in the app's
`ThemeTokens` yet; it must be added there (supervisor wiring, `themes.ts`, plus an add-only block in
`tests/theme.test.ts`).

| Element | Token | Silent Black | Paper | Ember | Emerald | Midnight |
|---|---|---|---|---|---|---|
| Hand, figure outline | `--text` stroke, `--surface-2` fill (plate `.u-stroke/.u-fill`) | as plate | as plate | as plate | as plate | as plate |
| Handle | plate `.eq` classes | | | | | |
| Right force line, tick | `--accent` | #5e6ad2 | #2383e2 | #ff6363 | #3ecf8e | #635bff |
| Wrong force line, bend arc, cross | `--mistake` | #eb5757 | #c0392b | #b36bff (violet, because Ember's accent is red) | #f04438 | #ff5c5c |
| Feel main (rest) | `--feel-main` = accent mixed with 25 % `--text` | 5.59:1 | 4.06:1 | 7.21:1 | 8.78:1 | 3.44:1 |
| Feel helpers | accent 45 % over `--map-body` (existing "roles" secondary) | 1.72:1 | 1.64:1 | 2.11:1 | 2.67:1 | 1.44:1 |
| Watch outline (S6 only) | `--mistake` dashed stroke, no fill | 4.90:1 | 4.28:1 | 5.03:1 | 4.13:1 | 3.55:1 |

Ratios are against each theme's `--map-body`, computed from `themes.ts` and the engine's mistake colours.
What the numbers force:

- **Plain accent is not enough for the main muscles.** Accent on map body is 2.29:1 in Midnight and 3.05:1 in Paper,
  under or at the 3:1 line for graphics (WCAG 1.4.11, https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast.html).
  Mixing 25 % text in clears 3:1 in all five. (The existing "roles" mode of `MuscleMap` uses plain accent, so
  Midnight's current map has the same weakness; worth fixing there too.)
- **Accent and mistake are too close to tell apart** (1.12:1 in Ember, 1.88:1 at best). So "should not take over" is
  never shown by colour: main muscles are filled, watch muscles are an unfilled dashed outline.
- **Helpers are below 3:1 everywhere.** They are a soft extra; every helper is also named in the text list and the
  legend, so nothing depends on seeing them.
- Paper is the only light theme; the hand and plate strokes already pass there (the gallery renders Paper today).

### 2.7 Wireframes (phone, 390 px)

S0, plate with hotspot and chips (3 callouts, one of them the grip):

```
+--------------------------------------+
| HOW TO DO IT                      X  |
| Machine Chest Press                  |
| +----------------------------------+ |
| | SIDE VIEW                        | |
| |              HEEL OF PALM        | |
| |  BLADES     o---=(:)  <- hand    | |
| |  ON PAD    /   (..)  hotspot     | |
| |           |  HANDLES MID-CHEST   | |
| |           |__                    | |
| +----------------------------------+ |
| Handles at mid-chest.                |
| (Trace) (Mistake: wrist)  v Saved    |
| LOOK CLOSER                          |
| [Hand] [Seat height] [Blades] [Feel] |
| PRESS 1s  HOLD .3  RETURN 1.5  REST  |
+--------------------------------------+
```

S2, hand zoom (one page on `push`). Vertical handles: the palm faces in, so the side view would show the back of
the hand and hide the bend. The hand is drawn from above, where the bend is flat to the screen:

```
+----------------------------------+
| < Plate     Hand: right and wrong|
| SEEN FROM ABOVE   [head ^ mark]  |
|  v RIGHT          x WRONG        |
|   ___               ___          |
|  |   |==O          |   |  O==    |
|  |   | thumb       |   |\  finger|
|  |   | wrapped     |   | \ grip  |
|  |   |             |   |  )  arc |
|  |:  |  push line  |  :|  push   |
|  |:  |  down the   |  :|  line on|
|  |:  |  forearm    |  :|  back-of|
|  Heel of palm,     Handle in the |
|  wrist straight    fingers, wrist|
|                    folds back    |
|  [inset: horizontal handles,     |
|   seen from the side]            |
+----------------------------------+
Put the handle low in your palm, right on the heel of your hand...
Sore wrist? Use the vertical handles.
```

S3, posture zoom (seat height):

```
+----------------------------------+
| < Plate   Seat height            |
|  v RIGHT          x WRONG        |
|   (head)           (head)        |
|   |  ---O          |  ---O       |
|   |<-mid chest     |<- collarbone|
|   |                |             |
|  Handles meet the  Handles too   |
|  middle of chest   high: near    |
|                    the shoulders |
|  Feel it in the front of your    |
|  shoulders? This is usually why >|
+----------------------------------+
```

S4 to S6, feel section (at rest: main and helpers only; the row's own marks appear when it opens):

```
WHERE YOU SHOULD FEEL IT
 +---------+  +---------+
 | front   |  | back    |      ##  main
 |  ##chest|  |  triceps|      ::  helps
 |  ::delt |  |         |
 +---------+  +---------+
You should feel this across the middle and lower chest. If the
front of your shoulders is doing most of the work, set the seat
so the handles line up with the middle of your chest.
IF YOU FEEL IT IN...
 > Front of the shoulders
 v Wrist (top or back of the wrist)          <- S6, open; wrist tinted
   Usually means: your wrist is bending back and the handle has
   slid into your fingers. Often the weight is too heavy.
   Fix: Move the handle into the heel of your palm and wrap your
   thumb. Go lighter until your wrist stays straight.
   [Show me the hand]
   Get it checked today if you can't grip, the wrist looks a
   different shape, or your hand goes numb.
   See a doctor if it's no better after two weeks of rest,
   keeps coming back, or tingles.
 > Wrist sore before you start
 [Show 2 more]
```

S7 is S0 to S6 with the same layout: zooms swap without scaling, the map shows S4 only.

---

## 3. Handling archetypes

Every exercise references **one hand archetype** (10) and **one to three contact archetypes** (8). An archetype holds
the rules (grip, thumb, wrist range), the default hand pose for the drawing, the standard wrong drawings and the
default copy. An exercise only adds its own orientation, handle shape, width and overrides. Coverage of all 153
library exercises is in appendix B (every id assigned, no duplicates, checked by script).

Evidence tags as in GENERAL.md: DATA, MECH, CONSENSUS, WEAK. **A tag here rates the source for this use, not the
paper's design.** Weiss 1995 is a measured study of carpal-tunnel pressure, but for a lifting wrist range it is
MECH/WEAK. Nance 2017 is measured data on push-ups, planks and yoga, so it is DATA for `palm-flat` and WEAK for
presses. The `Claim` model already carries tags per claim (4.1), so the same source can carry different tags in
different claims.

### 3.1 Hand archetypes

| ID | Covers (count) | Contact in the hand | Thumb | Wrist, right range (drawing check) | Standard wrong drawings | Default cue | Evidence |
|---|---|---|---|---|---|---|---|
| `push` | Presses, bar and V-bar pushdowns, dips, skull crusher, sled push, ab wheel (26). Rope pushdown and overhead cable extension are in, with their own rope rule (3.1.1) | Heel of the palm, low, over the forearm | Wrapped. Required when `overBody` (free weight over face, neck or chest) | Extension 0 to 15, side bend within 10 | `fingers-bent-back` (the owner's fault), `ulnar-tip` (wide horizontal handles, wrist tipped toward the little finger) | "Push with the heel of your hand." | Weiss 1995 https://pubmed.ncbi.nlm.nih.gov/7593079/ (MECH/WEAK for this use: nerve pressure, not lifting); Nance 2017 https://pubmed.ncbi.nlm.nih.gov/29085728/ (WEAK for presses: push-ups, planks and yoga, association only); ACE chest press https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/ ; JTS https://help.jtsstrength.com/en/articles/69-bench-pillar-3-gripping-the-bar (CONSENSUS); falls on the lifter: Kerr 2010 https://pubmed.ncbi.nlm.nih.gov/20139328/ , Jumbelic 2007 https://pubmed.ncbi.nlm.nih.gov/17456099/ |
| `palm-flat` | Push-ups, pike, diamond, bench dip, burpee, mountain climbers, bear crawl, bird dog, renegade row (10) | Whole palm, weight through the heel and the base of the index finger | Spread, not wrapped | Set by the floor (large extension); the check is shoulder over wrist instead | `hand-ahead` (hands in front of the shoulders), `fingers-in` | To be written from a card | Nance 2017 studied exactly this group (push-ups, planks, yoga) (DATA, association). The rest has **no verified source yet**; the first palm-flat card must supply it, including whether fists or push-up handles help a sore wrist |
| `pull` | Pulldowns, rows, face pull, upright row, rear-delt machine, inverted row, band pulls, sled pull, cable external rotation (19) | Base of the fingers and top edge of the palm, like carrying a bag | Wrapped by default; thumb over the bar allowed as a comfort option | Extension 0 to 25, never curled | `curled-squeeze` (wrist curled forward, hard squeeze), `fingertip-slip` (bar sliding out as the grip tires) | "Your hands are hooks. Pull with your elbows." | O'Driscoll 1992 https://pubmed.ncbi.nlm.nih.gov/1538102/ (DATA, dynamometer); Baechle and Earle https://us.humankinetics.com/blogs/excerpt/grip-selection-and-location (CONSENSUS); Lusk 2010 https://pubmed.ncbi.nlm.nih.gov/20543740/ (DATA, grip type barely moves biceps). No study on thumb-over pulls (WEAK) |
| `hang` | Pull-up, chin-up, assisted pull-up, hanging leg and knee raise (5) | Top of the palm where the fingers start | Wrapped, always (you are what falls) | Extension 0 to 35 | `fingertip-slip`, `palm-deep` (skin ridge), `thumbless-opening`; thumb page shows full, thumbless, hook, gymnastics false grip | "Hook it with your fingers, then wrap your thumb." | O'Driscoll 1992; Baechle and Earle; Prinold and Bull 2016 https://pubmed.ncbi.nlm.nih.gov/26383875/ (DATA, shoulder position) |
| `hold` | Raises, flyes (pec fly machine included), pullover, straight-arm pulldown, shrugs, carries, deadlifts and RDLs, lunges and split squats with weights, pallof press (28) | Across the middle of the palm, fingers wrapped | Wrapped; hook or mixed only for trained lifters on heavy deadlifts | Extension -10 to +10 (neutral), side bend within 10 | `fingertip-hang` (hand droops), `cocked` (hand bent up) | "Keep your wrist in line with your forearm." | ACE lateral raise https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/ (CONSENSUS); Sporrong 1995 https://pubmed.ncbi.nlm.nih.gov/8983914/ (DATA, grip squeeze and shoulder muscles, loose support) |
| `curl` | All curls, preacher, reverse curl, wrist curl (13) | Across the middle of the palm | Wrapped | Extension -10 to +10 while the elbow bends. `wrist_curl` is exempt (the wrist is the moving joint) | `wrist-curl-cheat`, `bent-back-bottom` | To be written from a card | **No verified source yet** for curls; the first curl card must supply it |
| `on-body` | Back squat, front squat, goblet squat, Smith squat, hip thrust, cable crunch, Russian twist (7) | The load rests on the body; the hands only keep it there. Bar in the heel of the palm | Wrapped, or thumb beside the fingers if wrapping bends the wrist | Extension 0 to 15. Front rack is exempt and must name its reason and source | `waiter-tray` (bar in the fingers, hand bent back under it, load arrow through the wrist) | "Your back holds the bar. Your hands just keep it there." | Barbell Logic squat grip https://barbell-logic.com/?p=4521 ; Human Kinetics https://us.humankinetics.com/blogs/strength-conditioning-fitness/squat-technique (CONSENSUS; the two disagree on wrist extension, see appendix A3) |
| `balance` | Leg press family, leg curls and extension, hip abduction and adduction, calf machines, machine crunch, machine lateral raise, machine pullover, cable kickback, resisted hip flexion (18) | Across the fingers and top of the palm, light | Wrapped, light | Extension 0 to 20 | `push-on-knees` (reuses the `push` lever drawing), `white-knuckle` | "Hold the handles lightly. Your hands stay there." | ACE leg press https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/ (CONSENSUS, "lightly grasp") |
| `implement` | Kettlebell swing, battle ropes, medicine ball slam, wall ball, jump rope (5) | Per implement | Per implement | Per implement, neutral at impact or release | Per implement | To be written from a card | **No verified source yet**; each card supplies it |
| `none` | Bodyweight squats and lunges, floor core work, plank, back extension, jumps (22) | none | none | none | none | none | Hand placement notes (e.g. crunch: fingertips at the temples) go in a posture checkpoint, not a hand zoom |

#### 3.1.1 Which way the load runs: `loadAxis`

The heel-of-palm rule and the lever check assume the load runs **along the forearm**, into the heel of the palm.
Five exercises first filed under `push` break that, so each exercise states its `loadAxis`
(`'along-forearm' | 'across'`, default from the archetype: `push` and `on-body` are `along-forearm`, the rest
`across`). The lever check in C5 runs only for `along-forearm`.

| Exercise | Why the push rule doesn't fit | Decision |
|---|---|---|
| `pec_fly` | The pad or handle load runs across the forearm, as in a fly | Moved to `hold` |
| `pallof_press` | A sideways cable pull held still; the hands resist rotation, they don't press into a handle | Moved to `hold` |
| `rope_triceps_pushdown`, `overhead_cable_triceps_extension` | A rope can only be pulled. The load sits in the fingers and on the little-finger edge of the fist, never on the heel of the palm | Stay `push` with `handle: 'rope'`, `loadAxis: 'across'`, lever check off with the reason "rope: load on the fist edge". Own fault set: `rope-wrist-curl` (wrist curling toward the palm at the bottom) and `rope-slip` (rope sliding out of the fist). Needs its own source; none verified yet |
| `dumbbell_overhead_triceps_extension` | Two hands cup the top plate of one dumbbell, thumbs round the handle | Stays `push` with `thumb: 'cupped'`, `loadAxis: 'along-forearm'` pending its card; no verified source yet |

These five get a second pass (from a card, with sources) before C6 turns appendix B into stubs.

The wrist ranges are **drawing checks, not injury thresholds.** They keep the "right" picture inside what the cards
say and force the "wrong" picture to look clearly wrong. The ranges come from the cards (push: 0 to about 10, limit
15 to 20, chest press card; pull: straight or tipped back, lat pulldown and row cards; hang: up to 35, O'Driscoll;
on-body: 0 to 15, squat card). All limit numbers are coaching consensus, and the cards say so.

### 3.2 Contact archetypes

| ID | Covers (primary contact, count) | Default checkpoints | Default zoom | Evidence |
|---|---|---|---|---|
| `seat-back` | Seated machines and seated presses (20) | Hips back, shoulder blades on the pad, handles at the right height | "Seat height" crop | ACE chest press, ACE lat pulldown https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/ (CONSENSUS) |
| `bench-lying` | Bench presses, flyes, skull crusher, pullover, hip thrust, bench dip (13) | Head, upper back, hips on the bench, both feet on the floor | "Five points" crop | NSCA five-point contact via study summary https://www.ptpioneer.com/personal-training/certifications/nsca-cscs/cscs-chapter-15/ (CONSENSUS, secondary source) |
| `foot-platform` | Leg press family, hack and pendulum squat, seated cable row (6) | Whole foot flat, heels down, knees soft at the end | "Foot on platform" crop | ACE leg press; Escamilla 2001 https://pubmed.ncbi.nlm.nih.gov/11528346/ (DATA, knee forces rise with knee bend) |
| `standing-feet` | Everything standing (75) | Whole foot on the floor, knees follow the toes, weight over mid-foot | "Feet and knees" crop | Human Kinetics squat technique (CONSENSUS) |
| `pivot-pad` | Lying and standing leg curl, preacher curl, seated calf raise (4); secondary contact on leg extension, seated leg curl, hip machines | Joint lined up with the machine's pivot, pad on the right spot of the limb | "Pivot" crop | ACE lying hamstring curl https://www.acefitness.org/resources/everyone/exercise-library/153/lying-hamstrings-curl/ (CONSENSUS) |
| `brace-pad` | Chest-supported row, T-bar, assisted pull-up, back extension, standing calf raise, one-arm row, concentration curl (7); secondary on pulldowns (knee pad) | Pad firm, body still against it | "Pad" crop | ACE lat pulldown (knee pad) (CONSENSUS) |
| `floor-body` | Push-ups, planks, floor core, bird dog, glute bridge, ab wheel, cable crunch (22) | Per exercise | Per exercise | **No verified source yet**; per card |
| `hang-support` | Pull-up, chin-up, hanging raises, dips, inverted row (6) | Active hang or active support, shoulders down | "Shoulder blades" crop | Catalyst Athletics pull-up https://www.catalystathletics.com/exercise/39/Pull-up/ (CONSENSUS) |

"Forefoot on an edge" (calf raises) is a foot parameter of `foot-platform` and `standing-feet`, not its own type.

**Lying face down (prone).** The owner's brief says "prone posture". It most likely means "proper", but face-down
work is real: lying leg curl, chest-supported row, T-bar with a chest pad, superman. These stay in `pivot-pad`,
`brace-pad` and `floor-body`; no new type. Instead, a contact entry can carry `prone: true`, which adds two shared
default checkpoints: "Hips stay on the pad" (hips lifting off the pad) and "Neck in line" (head cranked up to look
forward). No verified source yet for either; the lying leg curl card must supply them (ACE lying hamstring curl,
already cited above, is the first place to check).

### 3.3 Why these groupings

Grouping by **which way the load goes through the hand** (into the heel of the palm, into the fingers, hanging from
the hand, resting on the body) rather than by equipment keeps each group's rules true for all its members. Orientation
(overhand, neutral, underhand) and handle shape are parameters of the drawing, not separate archetypes, because they
don't change the rule. This merges GENERAL.md's G1/G2/G3/G5-press into `push` and G6/G7/G8-pull into `pull`, and adds
two groups GENERAL.md does not have: `palm-flat` (10 exercises, and the group Nance 2017 actually studied) and
`curl` (13).

### 3.4 Handling the equipment itself

The owner asked for proper handling of machines and equipment, not only grip and posture. These moves are setup
steps (`SetupStep.kind`, 4.3), and the two that need a picture are posture zoom archetypes, shared across every
exercise that uses them.

| Move | Where it applies | How it shows | Source status |
|---|---|---|---|
| Getting in and out of a machine (`get-in`, `get-out` steps) | Every seated and lying machine | Setup steps | No verified source yet; per card |
| Selector pin fully in | Every stack machine | A `safety` setup step: "Push the pin all the way in until it clicks." | No verified source yet; per card |
| Foot bar to bring chest press handles out | Machine chest press and other machines with a foot bar | Setup step with a "Show me" to the plate | Chest press card has it in its setup steps; source to confirm |
| Un-racking and re-racking a bar, safeties set | Barbell and Smith presses and squats | Posture zoom archetype `unrack-rerack`: safeties at the right height, bar path out of and back into the hooks | No verified source yet; the squat and bench cards must supply it |
| Kicking dumbbells up for a bench press, and putting them down | Dumbbell bench and incline presses | Posture zoom archetype `dumbbell-kickup`: dumbbells on the thighs, rock back, knees drive them up; on the way down, back to the thighs, never dropped out to the sides | No verified source yet; the dumbbell bench card must supply it |

No copy from this table ships until its card cites a source (C8).

### 3.5 Wrist wraps

Left out of v1 on purpose. I found no verified source on wraps for heavy presses, and the right grip fixes the
owner's fault without them. If a press card later finds a source, wraps come back as an option tagged WEAK, never as
the fix for a bent wrist.

---

## 4. Data model

Static content, bundled with the app. **It adds no new user data**: nothing is saved, nothing is sent, nothing is
read from the user. It does not touch `src/core/models.ts`, `src/core/store.ts` or any migration, so the owner's
saved-data approval rule is not triggered. The How-to does not remember which layer was open; every open starts
at S0.

### 4.1 Shared types

All types live in `src/howto/types.ts`. Build tools (`tools/plates/`) import from there, never the other way round,
so app code never imports from a build tool. Each content file ends `export default { ... } satisfies HowTo`, so the
typecheck does the shape check (C1 keeps only rules across fields).

```ts
type LibId = `lib_${string}`;                 // exercises.json id; research cards drop the prefix
type EvidenceTag = 'DATA' | 'MECH' | 'CONSENSUS' | 'WEAK';
type SourceId = string;                       // key in the source registry, e.g. 'nance2017'

/** Attached to every rule. Research data only: never shown in the app (LR-23). */
interface Claim { tags: EvidenceTag[]; sources: SourceId[]; note?: string }

interface Source {
  id: SourceId; cite: string; url: string;
  kind: 'peer-reviewed' | 'guideline' | 'coach' | 'manufacturer' | 'secondary';
  access: 'full' | 'abstract' | 'summary' | 'unreachable';   // what the verifier actually read
  checked: string;                                         // ISO date of the last check
}

type BodyPartId = string;                     // a part id in bodyMuscles.ts, e.g. 'hand-left', 'knee-right', 'nape'
type PointRef = { landmark: string; pose?: 'start' | 'end' | 'mistake'; dx?: number; dy?: number };
                                              // mirrors the plate spec's point references (SPEC.md 3); the engine
                                              // imports this type from src/howto/types.ts
```

### 4.2 Hand

```ts
type HandArchetypeId = 'push' | 'palm-flat' | 'pull' | 'hang' | 'hold' | 'curl'
                     | 'on-body' | 'balance' | 'implement' | 'none';
type Orientation = 'pronated' | 'neutral' | 'supinated' | 'mixed';
type HandleProfile = 'bar-28' | 'bar-32' | 'machine-grip' | 'ez-bend' | 'rope' | 'd-handle' | 'v-handle'
                   | 'dumbbell' | 'kettlebell' | 'ball' | 'pad-handle' | 'floor';
type ThumbMode = 'wrapped' | 'wrapped-light' | 'beside' | 'over' | 'hook' | 'cupped' | 'spread';
type HandContact = 'heel' | 'mid-palm' | 'finger-base' | 'fingertips' | 'palm-flat' | 'cupped';

/** What the hand renderer draws (section 5.1). Angles in degrees. */
interface HandPose {
  view: 'radial' | 'dorsal' | 'end-on';       // thumb side (default), back of the hand, along the handle.
                                              // 'radial' is the view where the wrist's back-and-forward bend lies
                                              // flat on the screen; faults about that bend must use it
  forearm: number;                            // forearm angle on screen, 0 = pointing down the screen
  wrist: { ext: number; dev: number };        // ext + bent back / - curled; dev + thumb side / - little-finger side
  contactAt: number;                          // handle axis along the hand: 0 wrist crease, ~.2 heel, 1 finger base, 1.6 tips
  fingers: { curl: number; open?: number };   // 0..1; open > 0 = peeling off
  thumb: ThumbMode;
  squeeze?: 'light' | 'firm' | 'max';         // 'max' draws tendon lines
  handle: { profile: HandleProfile; axis: 'across' | 'along'; diameterMm?: number };
  load: { kind: 'push' | 'pull' | 'gravity' | 'on-body'; dir?: [number, number] };   // dir defaults from kind + forearm
}

interface HandFault {
  key: string;                                // archetype fault key or an exercise-own key
  label: string;                              // 1-3 words, shown over the wrong hand
  pose: Partial<HandPose>;
  markers: Array<'lever-arc' | 'slip-arrow' | 'skin-ridge' | 'tendon' | 'load-through-wrist'>;
  alt: string;                                // TalkBack text for the wrong half
}

interface HandArchetype {
  id: HandArchetypeId; name: string;
  pose: HandPose;                             // the right default
  wrist: { ext: [number, number]; dev: [number, number]; claim: Claim } | { exempt: string; claim: Claim };
  faultMargin: number;                        // a wrong pose must sit this many degrees outside the range, or carry a non-angle marker
  // Lever = signed distance from the wrist centre to the force line, in mm at the hand's drawn scale.
  // Positive = line on the back-of-hand side, so the push bends the wrist further back. Negative = palm side.
  maxLeverMm?: number;                        // along-forearm only: |right lever| at most this. Value and reasoning
                                              // set by the builder from the drawn hand's size and written in the
                                              // archetype file; no number is fixed here yet
  minWrongLeverMm?: number;                   // along-forearm only: a bent-back fault's lever is at least this AND positive
  contactAt?: { rightMax: number; wrongMin: number };   // push: { rightMax: 0.3, wrongMin: 0.8 } (heel vs fingers)
  thumb: { default: ThumbMode; allowed: ThumbMode[]; requiredWhen?: 'overBody' | 'always'; claim: Claim };
  faults: HandFault[];
  copy: { grip: string; cue: string };        // defaults, overridable per exercise
  redFlags: boolean;                          // the zoom shows the shared RED_FLAG block
}

/** One shared copy object in src/howto/archetypes.ts, used by every row and zoom that shows a red flag.
 *  Source: NHS wrist pain, https://www.nhs.uk/conditions/hand-pain/wrist-pain/ (checked 2026-09-30).
 *  Rows and fixes may not carry their own red-flag wording (C8). */
const RED_FLAG = {
  now: "Get it checked today if you can't grip, the wrist looks a different shape, or your hand goes numb.",
  doctor: "See a doctor if it's no better after two weeks of rest, keeps coming back, or tingles.",
  claim: { tags: ['CONSENSUS'], sources: ['nhs-wrist-pain'] },
} as const;

/** Per exercise. */
interface HandlingSpec {
  archetype: HandArchetypeId;
  orientation?: Orientation;
  handle?: HandleProfile;
  loadAxis?: 'along-forearm' | 'across';      // default from the archetype (3.1.1); the lever check runs only for along-forearm
  handleChoice?: { sore: string; claim: Claim };   // push machines with both handle types: shown on the hand zoom,
                                              // e.g. "Sore wrist? Use the vertical handles."
  overBody?: boolean;                         // free weight above the face, neck or chest
  width?: { text: string; claim: Claim };
  thumb: { mode: ThumbMode; options?: Array<{ mode: ThumbMode; when: string }>; claim: Claim };
  contact: HandContact;
  wrist: { ext: [number, number]; dev?: [number, number]; limitText: string; claim: Claim }
       | { exempt: string; claim: Claim };
  pose?: Partial<HandPose>;                   // overrides the archetype default
  faults: Array<string | HandFault>;          // order = drawing order; first is the main wrong hand
  gripLine: string;                           // user copy
}
type NoHandling = { archetype: 'none'; why?: string };   // `why` required when the library lists a handled piece of equipment
```

### 4.3 Setup, posture, feel, zooms

```ts
type ContactArchetypeId = 'seat-back' | 'bench-lying' | 'foot-platform' | 'standing-feet'
                        | 'pivot-pad' | 'brace-pad' | 'floor-body' | 'hang-support';

interface SetupStep {
  text: string;                               // one instruction, user copy
  kind: 'get-in' | 'adjust' | 'load' | 'position' | 'grip' | 'brace' | 'safety' | 'finish' | 'get-out';
  zoom?: string;                              // ZoomSpec.key it points to ("Show me")
  claim: Claim;
}

interface PostureCheckpoint {
  key: string;
  label: string;                              // 1-3 words; becomes a plate callout if it is in the top 3
  detail: string;                             // what "right" looks like, user copy
  anchor: PointRef;                           // where the hotspot sits on the plate
  zoom?: string;
  claim: Claim;
}

interface FeelMuscle { muscleId: MuscleId; plain: string }

interface FeelRow {
  key: string;
  where: string;                              // "Front of the shoulders"
  at: { muscles?: MuscleId[]; parts?: BodyPartId[] };   // parts = joints and non-muscle regions (hands, knees, nape)
  means: string; fix: string;                 // each at most 30 words and 2 sentences; fix never carries red-flag wording
  zoom?: string;                              // "Show me" target
  redFlag?: boolean;                          // shows the shared RED_FLAG block under the fix
  claim: Claim;
}

interface FeelSpec {
  primary: FeelMuscle[];                      // shimmer
  secondary: FeelMuscle[];                    // soft glow
  watch: FeelMuscle[];                        // "should not take over": dashed outline, shown ONLY while a row naming
                                              // the muscle is open (S6). Never drawn at rest. Never primary + watch.
  side?: 'one';                               // one-arm or one-leg work: only the working side is marked
  feelLine: string;
  rows: FeelRow[];                            // "If you feel it in..."; first 3 shown, the rest behind "More"
  libraryDiff?: { add?: MuscleId[]; drop?: MuscleId[]; why: string };   // when this differs from exercises.json
  claim: Claim;
}

interface ZoomSpec {
  key: string;
  chip: string;                               // 1-2 words
  heading: string;                            // "Hand: right and wrong"
  kind: 'hand' | 'posture';
  hand?: {
    right?: Partial<HandPose>;                // default: the HandlingSpec pose
    wrong: Array<string | HandFault>;         // 1-2; a second one pages
    camera: 'side' | 'above' | 'below' | 'front';   // printed as "Seen from above", with a small orientation mark
    inset?: { label: string; pose: Partial<HandPose>; camera: 'side' | 'above' | 'below' | 'front' };
    thumbPage?: ThumbMode[];                  // page 2, `hang` and `pull` only: thumb options, each labelled
  };
  crop?: { center: PointRef; sizePx: number };  // plate px; posture zooms are crops of the plate
  right?: 'start' | 'end' | PoseOverride;     // pose drawn in the right crop
  wrong?: 'mistake' | PoseOverride;           // pose drawn in the wrong crop
  guides?: Guide[];                           // the plate's guide kinds (SPEC.md 4, mistake.guides)
  caption: { right: string; wrong: string };  // <= 14 words each
  alt: { right: string; wrong: string };
  feelRow?: string;                           // FeelRow.key this zoom explains ("Feel it in... This is usually why")
}
```

### 4.4 The exercise file and how it attaches

```ts
interface HowTo {
  schema: 1;
  id: LibId;
  rev: number;                                // bumps on any user-visible change
  extends?: LibId;                            // inherit handling, setup, zooms from a parent (e.g. incline machine press <- machine chest press)
  plate: PlateSpec;                           // the existing Technical Plate spec (SPEC.md 4), unchanged
  handling: HandlingSpec | NoHandling;
  contacts: ContactArchetypeId[];             // 1-3, first is primary
  setup: SetupStep[];
  posture: PostureCheckpoint[];
  feel: FeelSpec;
  zooms: ZoomSpec[];                          // max 4 chips; order = chip order and hotspot priority
  copy: { setupLine: string; mistakeLine: string };
  sources: SourceId[];
  research: { card: string; rev: number };    // path of the research card it came from
}
// Review stamps are NOT in the content file (a builder could edit them and re-hash). They live in
// docs/research/howto/reviews.json, owned by the supervisor (4.4, C15).
```

How it hooks into the plate spec: `plate.callouts[i]` gains an optional `zoom` key, so a callout tap opens its zoom.
Hotspots are not written by hand: the build adds one for the `grip` landmark when `handling.archetype` is not
`none`, and one per `PostureCheckpoint` that has a `zoom`, then runs them through the plate's label placer
(SPEC.md 4) so they never sit on a label.

**Where it lives** (proposal; folder names need the supervisor's OK):

| What | Where | Bundled |
|---|---|---|
| Research cards (JSON, full evidence notes) | `docs/research/howto/<id>.json` | no |
| Source registry | `docs/research/howto/sources.json` | no (the few citations a sheet shows are copied into its content at build) |
| Review stamps (supervisor-owned, add-only for builders; the guard enforces it like other shared files) | `docs/research/howto/reviews.json` | no |
| Shared types | `src/howto/types.ts` | yes (types only) |
| Archetypes, `RED_FLAG` | `src/howto/archetypes.ts` | yes |
| One file per exercise | `src/howto/content/<libId>.ts` | yes, lazy |
| Generated SVG (plate, hand zooms) | `src/howto/generated/**` ("generated, do not edit"; CI regenerates and diffs) | yes, lazy |
| Plate engine and hand renderer | `tools/plates/` (build time only, node) | no |

**Versioning.** `schema` for the shape, `rev` per exercise, `research.rev` for the card it came from, and a
content hash that CI computes (never stored in the content file): every user-visible string, every drawing
parameter, plus the archetype's own hash and, with `extends`, the parent's. `reviews.json` holds entries of
`{ scope: LibId | HandArchetypeId, hash, coach?, physio?, date }`. An exercise passes C15 when its current hash, or
its archetype's current hash for the archetype-level parts, has a matching entry. So a change to the chest press
flags the incline machine press too, and an archetype re-review re-stamps every exercise under it in one entry
instead of 26 files. Builders can add entries only through the supervisor.

**Library link.** Content is keyed by the `exercises.json` id. `feel.primary` and `feel.secondary` should match the
library's `primary`/`secondary`; a difference needs `libraryDiff.why`. Three cards already differ (seated row makes
lats primary; leg press adds adductors; squat keeps hamstrings as "only a little"). Changing `exercises.json` is a
separate supervisor decision; the How-to never silently disagrees with the library.

**Two levels of content**, so all 153 get the most important layer early:

- Level 1 (archetype only): hand zoom from the archetype with the exercise's orientation and handle, archetype grip
  line and cue, and a **still** map from `exercises.json` roles with no shimmer. `exercises.json` primary lists
  include ids with no fair drawn region (`core` in 8 exercises, `brachialis` in 3, `rotator_cuff` in 1), so at
  Level 1 those ids go to the text list only, and nothing shimmers until a card has checked the roles. No feel line,
  no rows, no posture zooms. Allowed only after the archetype itself passed review.
- Level 2 (researched card): everything in this section.

---

## 5. Rendering

### 5.1 The hand renderer

A new build-time module next to the plate engine (`engine/hand.mjs`), same style as the plate (same stroke classes,
same fills, same label placer and leader rules).

- **Skeleton.** Forearm (one tapered limb), wrist centre, palm block with a heel pad and a thumb-base bulge, four
  fingers of three segments, thumb of three segments with an opposition angle. Scale from the plate's hand length
  (0.108 H, Winter 2009, SPEC.md 2). Segment proportions must come from a published hand-anthropometry source that
  the builder cites; I have not verified one, so none is named here.
- **Wrap solve.** The handle is a circle of the profile's diameter (end-on) or a bar (side). Given `contactAt`, the
  fingers flex joint by joint until each tip meets the handle outline, the same idea as the plate's `reach` IK. The
  thumb wraps the opposite way for `wrapped`, lies along the index finger for `beside`/`over`, pins under the
  fingers for `hook`. `fingers.open` peels the tips off for slip faults.
- **Draw order** by view: far fingers, handle, palm, near fingers, thumb. In `radial` view the thumb is always the
  nearest shape and gets the heaviest line, so the thumb position is the clearest thing in the picture.
- **Camera.** The plate is a side view (SPEC.md 1), but the hand is drawn from wherever the wrist's
  back-and-forward bend lies flat on the screen (`view: 'radial'`, thumb side toward the camera). With horizontal
  handles that is the side view. With vertical handles the palm faces in, so from the side you would see the back
  of the hand and the bend would point at the camera, hidden. Those hands are drawn from above and printed "Seen
  from above", with a small orientation mark (a head-and-shoulders glyph showing which way is forward). The camera
  is a field of the zoom (`hand.camera`), and the inset carries its own camera.
- **Force line, computed.** A line through the handle contact point along `load.dir`. The renderer reports the
  signed lever: the perpendicular distance from the wrist centre to that line, positive when the line passes on the
  back-of-hand side (the push bends the wrist further back), negative on the palm side. "Front" and "behind" are not
  used, because they mean nothing on a turned hand. Right hand: accent line with a small tick where it passes the
  wrist. Wrong hand: mistake line plus the `lever-arc` at the wrist. The report feeds CI check C5. It is only drawn
  for `loadAxis: 'along-forearm'`.
- **Markers.** `lever-arc` (bend arc at the wrist), `slip-arrow`, `skin-ridge`, `tendon` (strain lines for a max
  squeeze), `load-through-wrist` (on-body faults: arrow down through the wrist and elbow).
- **Layout.** Two panels in the 358 px box, about 171 px each, "Right" and "Wrong" printed above with tick and cross
  icons, the camera label above both. Inset (e.g. horizontal handle, thumb-over option) sits bottom-right of its panel at 40 %. Thumb page: 2 to
  4 small panels, `hang` and `pull` only, each with its label ("Full grip", "Thumbless", "Hook: heavy barbell pulls only", "Gymnastics false
  grip: rings only"). The word "false grip" alone is never used, because NSCA-style texts use it for the thumbless
  grip (pull-up card).
- **Output.** Static SVG strings at build time, theme-free (classes only), one per unique (archetype, orientation,
  handle, fault) combination, shared across exercises. Runtime only inserts markup.

### 5.2 Posture zooms

A posture zoom is **a crop of the plate that is already on screen**: the same SVG with a smaller `viewBox`
(`crop.center`, `crop.sizePx`) scaled up about 2 to 2.5 times, plus a zoom-only overlay group (guides such as the
dashed "handle to mid-chest" line). Right uses the end or start pose; wrong uses the mistake pose or a zoom-own pose
override rendered at build time. Cost: the right crop is free; a wrong crop with its own pose is one extra pose layer
(the plate's mistake layer is about the size of a ghost).

Engine gaps that limit v1 posture zooms (SPEC.md 8): no top-down camera (chest press "start depth", lateral raise
"arm path from above"), no front view of `legPress45` (leg press "knee tracking"). These stay as text checkpoints
until the engine gains a top view; the appendix marks them.

### 5.3 Shimmer on the existing MuscleMap

`MuscleMap` gains a `mode: 'feel'` with these props:

```ts
feel: { primary: MuscleId[]; secondary: MuscleId[]; watch: MuscleId[]; focus?: MuscleId[]; pain?: BodyPartId[] };
shimmer: boolean;   // false when reduced motion is on
```

- Main: `.muscle.lit` with `--muscle-fill: var(--feel-main)` and a `--text` stroke at 0.3 (viewBox units), so the
  shape reads even without colour.
- Helpers: the existing roles-mode secondary fill.
- Watch: no fill, `--mistake` stroke 0.45, `stroke-dasharray: .9 .6`, drawn **only** while a row naming the muscle is
  open (S6). At rest the map has two kinds of marking, main and helpers. A muscle listed as both helper and watch
  shows as a helper until its row opens (for example front delts on the chest press).
- One side (`side: 'one'`): single-arm pulldown, one-arm row and similar mark only the working side.
- Pain (rows about wrists, elbows, knees, neck, S6 only): the non-muscle part path (`hand-left`, `elbow-right`, `knee-left`,
  `nape`...) gets a `--mistake` stroke and 20 % mistake fill. Joints never shimmer.
- **Aliases are off in feel mode.** Today `ALIAS` paints `rotator_cuff` on the rear delts and `brachialis` on the
  biceps. In feel mode that would light the wrong muscle, so alias-only ids appear in the text list only (C2).
- **Shimmer.** Per view, one `<clipPath>` made of copies of the main muscles' paths (at most about 8 paths), and one
  `<rect class="feel-band">` inside it, rotated about 20 degrees, filled with a soft gradient (transparent,
  `--feel-main` mixed with 55 % `--text`, transparent). CSS moves the band with `transform: translate()` along its
  diagonal from above the muscle to below it, 2.4 s, EASE.standard, 2 iterations, 400 ms apart,
  `animation-fill-mode: both`, starting only after the section has been 50 % in view for 300 ms. The component does not render the
  band at all when `reduced()` is true, and `html[data-motion="reduce"] .feel-band { display: none }` backs it up.
- `focus` (S6) stops the shimmer and fades in (opacity only) the dashed outline on the row's muscles or the pain
  tint on its joint. These marks exist only while a row is open.

The map keeps its current look in every other mode; `feel` is additive.

Side finding for the map: the `core` id is drawn on the serratus anterior regions (`serratus-anterior-left/right`),
the side of the ribs. Shimmering `core` for a squat brace would light the wrong area, so `core` is text only in feel
mode until the map draws it correctly (C2 list of misleading regions).

### 5.4 Performance budget

Measured today: one plate SVG is 32 to 36 KB raw, 9 to 10 KB gzipped (machine chest press, back squat).

| Item | Budget | How it is enforced |
|---|---|---|
| Per-exercise How-to chunk (plate, posture overlays, text) | 24 KB gzipped | CI size check (C13) |
| Shared hand-zoom pack (all unique hand SVGs) | 60 KB gzipped | C13 |
| Motion structure | every How-to animation animates only `transform` and `opacity` (read from `getAnimations()` keyframes in the gate); no runtime geometry, all SVG pre-rendered | CI (C18) and code review |
| Open the sheet | first frame under 100 ms on a budget Android phone; the final number is set after a baseline measurement | recorded device check, not CI |
| Zoom and shimmer frame time | no visible jank; p95 frame time recorded on the same budget phone | recorded device check, not CI |
| Shimmer length | ends after 2 passes (5.5 s from the section coming into view) | C12 |

Frame timing in headless Chromium at 4x throttle is flaky on CI runners and says little about an Android WebView, so
CI checks only the structure; timing is measured on a real phone.

### 5.5 Offline

Everything ships inside the APK as lazy chunks, the same decision as the earlier form-guide architecture
(`docs/FORM-GUIDE-ARCHITECTURE.md` section 11: Capacitor bundles `www/`; no service worker in the native build). No network call, no CDN, no fonts beyond what the
app already ships. No source link or other URL is shown (LR-23). The sheet keeps its "Saved offline" mark.

---

## 6. Content pipeline

```
research card (JSON, verified)  ->  coach review  ->  spec (src/howto/content)  ->  automated checks (CI)  ->  render review  ->  device checks  ->  merge
```

1. **Research card.** One per exercise, in the format of the 8 verified cards: grip, setup (including getting in and
   out and the equipment moves in 3.4), posture, mistakes, feel, rows, zooms, sources, evidence notes. A second agent
   verifies every source against its real title and abstract (NCBI E-utilities for PubMed; direct read for
   guidelines) and records `access` and `checked`. Batches go by archetype, presses first (the injury path).
2. **Coach review.** A qualified person reads the card, not the code (owner decision, section 8). Output: approve or
   a list of changes. The supervisor records the result in `reviews.json`.
3. **Spec.** A builder turns the card into `src/howto/content/<libId>.ts`: picks at most 4 zooms, splits every mixed
   field into user copy and a `Claim` (the cards put citations inside `whyItHurts`; see C7), picks archetype faults,
   writes plate callouts, and replaces any card red-flag wording with the shared `RED_FLAG` block.
4. **Automated checks** (below).
5. **Render review.** The engine renders plate, every zoom (right and wrong) and the feel map in all 5 themes and
   reduced motion; a reviewer with fresh context compares each picture with the card's zoom description, and checks
   by eye what C5 can't: the thumb really wraps on the right hand, the handle really sits in the heel of the palm,
   Right and Wrong are not swapped. The owner sees one contact sheet per batch.
6. **Device checks** (recorded, on the exact APK): sheet first-frame time and zoom and shimmer frame times on a
   budget Android phone (5.4); for the `push` archetype, the two checks in 6.3.

**GENERAL.md is superseded by the cards.** No user copy may be taken from `grip/research/GENERAL.md`. Known errors
in it: the "go down a notch" line (section 4) and "lower the seat a notch" (section 5.3) are the seat slip from
section 1; its section 5.4 table (machine chest press row) infers seat height from incline-press EMG, which the
chest press card rightly dropped (the critic pointed at line 52; the inference is actually on line 171); and section
1.3 (line 43) says 15 degrees less wrist extension "cost a third of grip strength", citing O'Driscoll 1992. The abstract (https://pubmed.ncbi.nlm.nih.gov/1538102/, read 2026-09-30) says people chose about 35 degrees of
extension, grip was significantly weaker 10 to 15 degrees away from that in any direction, and **at** 15 degrees of
extension grip fell to two thirds to three quarters of normal. That is a loss of a quarter to a third at 20 degrees
less than the chosen angle. Section 1.1 also puts the load "in front of the wrist joint", while section 1.4 says
"behind the wrist line"; this doc replaces both with palm side and back-of-hand side of the wrist centre (5.1). If
GENERAL.md is kept, it gets a "superseded by the cards" header and these fixes; the
cards are the only source for copy.

### 6.1 CI checks

| ID | Check | Fails when |
|---|---|---|
| C1 | Cross-field rules | the shape is left to the typecheck (`satisfies HowTo`); C1 checks only rules across fields: zoom keys referenced by rows, steps and callouts exist; `feelRow` keys exist; at most 4 zooms and 3 callouts; `extends` targets exist; `NoHandling.why` present when required |
| C2 | Muscle ids | an id is not `isMuscleId`; a shimmer role (primary) or a map role (secondary, watch) uses an id with no drawn region (`brachialis`, `rotator_cuff`) or a misleading region (`core`); a `parts` id is not in `bodyMuscles.ts`; a muscle is both primary and watch. Level 1 content has no shimmer and sends these ids to text (4.4), so it passes |
| C3 | Hand zoom present | `handling.archetype` is not `none` and no `hand` zoom exists (own or inherited); or the library lists handled equipment (Machine, Cable, Dumbbell, Barbell, EZ bar, Kettlebell, T-bar, Landmine, Smith) and the archetype is `none` without `why` |
| C4 | Thumb rule | `overBody` or `hang`, and the thumb default is not `wrapped` or `over` is offered |
| C5 | Wrist, contact, thumb and lever | the right pose is outside its archetype range (unless exempt with a reason and claim); a wrong pose is inside the range plus `faultMargin` without a non-angle marker; each wrong fault does not differ from the right hand in at least one of wrist angle, `contactAt` or thumb; the right hand's thumb is not `HandlingSpec.thumb.mode`. For `push`: the right `contactAt` is above 0.3, or the `fingers-bent-back` fault's `contactAt` is below 0.8. For `loadAxis: 'along-forearm'`: the right |lever| is above `maxLeverMm`, or a bent-back fault's lever is below `minWrongLeverMm` **or on the palm side** (wrong sign). A hand fault about the wrist bend is drawn in a view other than `radial` |
| C6 | Coverage | an `exercises.json` id has no HowTo and no archetype stub (appendix B becomes this stub list, after the second pass in 3.1.1) |
| C7 | Copy lint | any banned pattern (6.2) in user copy; length caps broken |
| C8 | Evidence | a rule without a `Claim`; a claim without a source; a source missing from the registry; a claim whose only sources are `unreachable`; a row `means` or `fix`, grip line or caption that carries its own red-flag wording (matches "get it checked", "see a doctor", "GP", "physio", "numb", "tingl", "swell") instead of `redFlag: true` |
| C9 | Contrast | per theme, from `themes.ts`: `--feel-main` vs `--map-body` under 3:1; `--mistake` vs `--map-body` or vs `--surface-1` under 3:1; `--accent` vs `--surface-1` under 3:1 (right force line) |
| C10 | Tap targets | any hotspot, chip, row or zoom control under 44 x 44 CSS px, or two hotspots overlapping (gate probe) |
| C11 | Reduced motion | with `data-motion="reduce"`: any running animation after opening a zoom or the feel section, or a `.feel-band` in the DOM |
| C12 | No endless motion | any How-to animation with infinite iterations; any animation still running after (shimmer delay + passes x duration + gaps) + 1 s, computed from the spec constants (today 5.5 + 1 = 6.5 s), never a hand-typed number |
| C13 | Size | budgets in 5.4 |
| C14 | Generated files | regenerating SVG gives a diff. The engine rounds every coordinate to 2 decimals, and CI pins the Node version (`.nvmrc` or `engines`, supervisor's call), so floating-point output is the same on every machine |
| C15 | Review stamp | the computed content hash (4.4) has no matching entry in `reviews.json`, directly or through its archetype. `reviews.json` is supervisor-owned and add-only for builders (guard) |
| C16 | Accessibility and meaning | a zoom without `alt.right`/`alt.wrong`; a hotspot without a label; a hand zoom without its camera label; a Right or Wrong panel without both its word and its tick or cross icon |
| C17 | No network | the How-to chunk contains `fetch(`, `XMLHttpRequest`, `Worker`, an http(s) URL other than the SVG and xlink namespace literals, an `<a>`, a `target=`, or an `href` that does not start with `#` (LR-23, D-LR23-7) |
| C18 | Motion structure | any How-to animation whose keyframes touch a property other than `transform` or `opacity` (gate, `getAnimations()`) |
| C19 | No sources or contacts in the How-to UI (LR-23) | any How-to string or file with source, citation or evidence wording, an evidence label, a link, a phone number, helpline or emergency-service wording, or a registry source's author or organisation name (patterns from `tests/guards/no-contacts.ts`; unit checks in HT-4b, gate block in HT-9) |

C9 and the plate's existing theme checks belong in `tests/theme.test.ts` as an add-only block named with this task's
id; the gate probes go into `scripts/screenshot-gate.mjs` the same way (AGENTS.md shared-file rule).

What CI can't catch, and who does: a loose thumb on the "right" hand, the handle drawn in the fingers with a
straight wrist (C5 checks the numbers, not the pixels), swapped labels, tone. Those are the render review's job (step
5) and the device checks below.

### 6.2 Copy style lint (C7)

User copy is: grip, setup, posture detail, feel line, row where/means/fix, captions, cues, setupLine, mistakeLine,
mistake and cue labels, `handleChoice`. Rules:

- Banned anywhere: em dash, an en dash used as punctuation, `!`, emoji, `%`, digits followed by a percent sign,
  semicolons, study citations (`(Name 2020)`, `Name et al.`), `EMG`, `MVC`/`MVIC`, `mind-muscle`.
- Banned words and phrases: engage, activate, activation, fire/firing (of a muscle), torch, blast, sculpt, tone(d),
  "your core" (the filler "engage/brace your core"), unlock your (potential|gains), maximise/maximize, optimal,
  optimise/optimize, ultimate, crucial, essential, "key to", game changer, powerhouse, effortless, seamless, elevate,
  journey, simply, "make sure", ensure, "it's important", "remember to", "focus on", "throughout the movement",
  "controlled manner", "proper form".
- Banned structures: "not X but Y" (`\bnot\b[^.,]{1,40}\bbut\b`), "it's not X, it's Y", "not just ... but". Flagged
  for the human review (not auto-failed, since real lists are fine): three short items joined by commas with no
  verb in between, the rhythm-triplet habit ("slow, steady, strong").
- Banned in user copy: Latin or clinical names (pectoralis, deltoid, latissimus, trapezius, rectus, supraspinatus,
  scapholunate, TFCC, iliopsoas, erector). The `common`/`label` names from `muscles.ts` are the vocabulary. "Little
  finger" everywhere, never "pinky".
- Templates: `feelLine` starts "You should feel this". Row `fix` starts with a verb.
- Length: `feelLine` at most 40 words and 2 sentences; row `means` and `fix` each at most 30 words and 2 sentences;
  `gripLine`, `setupLine`, `mistakeLine` at most 45 words and 3 sentences; any sentence at most 25 words; captions
  at most 14 words; callout labels 1 to 3 words; cues at most 8 words.

Tried on the 8 cards today (script over every user-facing field): 27 hits in 7 cards. Nearly all are citations and
percentages inside `whyItHurts`, which mixes user copy and evidence; step 3 splits that field. Real copy problems,
all to fix before spec: seated cable row has citations in two row fixes ("(Fujita 2020)", "(de Abreu Vasconcelos
2023)"); lateral raise setup mentions "the EMG study"; feel lines over 40 words in back squat (41) and hanging leg
raise (46), both rewritten in appendix A; the chest press wrist fix is 58 words in 4 sentences with its own red-flag
wording, rewritten in A1. Leg press passed clean. "Unlock the elbows" (lateral raise) is literal and allowed, which
is why the unlock rule is phrase-level. The new phrases and the 30-word row limit were added after this run; the
first builder re-runs the lint on all 8 cards.

Tone is checked by people: the lint catches the patterns, the coach review and the render review judge the voice.

### 6.3 Device checks for the hand zoom

The design claims the wrong hand matches the owner's fault. Nobody has checked that against his photos yet.

1. **Owner match.** The supervisor first checks the owner's two photos for the handle type (vertical or
   horizontal); if the photos don't show it, the owner says. Then the owner looks at the engine's wrong hand (both
   cameras) next to his photo 1 and confirms it shows what he did. If they were horizontal, the chest
   press draws horizontal as the main pair and vertical as the inset. Recorded, with the date, in the PR.
2. **Five-second test.** Two or three gym users see the hand zoom for five seconds, without the text, and say which
   hand is wrong and why. Pass: each names the bent-back wrist or the handle in the fingers. Recorded in the PR.

---

## 7. Merging with the Technical Plate gallery mockup

The next mockup updates the existing gallery (`plates2/artifact/technical-plates.html` via `build-page.mjs`; one
document per topic, no copy). It must prove the design on three exercises that cover the hard cases:

- **Machine chest press** (`push`, the owner's fault), full depth: "Heel of palm" callout and hand hotspot on the
  plate; the Mistake pill showing the wrist fault; hand zoom "Seen from above" with the owner's fault as the wrong
  hand, the signed force lines and lever numbers in the report; inset for horizontal handles "Seen from the side";
  the "Sore wrist? Use the vertical handles." line; "Seat height" posture zoom with the handles-to-mid-chest caption;
  feel map with chest shimmering and front delts soft (dashed only once the shoulder row is open); the wrist row
  opened with "Show me the hand" and the shared red-flag block; the `EntryCard` hint line.
- **Lat pulldown** (`pull`): shows the pull hand is a different picture (bar at the finger base, curled-squeeze wrong
  hand, fingertip-slip inset) and a posture zoom from a seated pull.
- **Leg press** (`balance` + `foot-platform`): a no-handle-load exercise where the hand zoom is not first, and the
  `push-on-knees` wrong hand reuses the push lever drawing.

What the page must show, at 390 px phone width:

1. Every state S0 to S7 for the chest press, Silent Black and Paper.
2. A 5-theme strip of the hand zoom and of the feel map (static), with the C9 ratios printed under each.
3. The shimmer as a frame strip (0, 0.6, 1.2, 1.8 s of the first pass), since screenshots cannot move.
4. The reduced-motion frames (no band).
5. The hand zoom growing out of the hotspot, as a frame strip, with the camera label visible.
6. The TalkBack text of every control and image on the chest press sheet, as a list.
7. The check report: C2, C4, C5 (wrist angles, `contactAt`, thumb, signed lever mm, right and wrong), C7, C9, C10,
   C16 results for the three exercises.
8. Side by side for the owner's match check (6.3): the wrong hand from both cameras, for him to hold next to his photo on
   his own phone. The photo itself is never stored in the repo or the page.

Engine work the mockup needs (scratch only): `engine/hand.mjs` (5.1), crop zooms in `sheet.mjs` (5.2), and a feel map
module that reads the body paths from `wt-arch/src/svg/bodyMuscles.ts` without changing it. The owner's photos are not
used or stored anywhere; the fault is drawn by the engine.

---

## 8. Risks, mitigations, owner decisions

| Risk | Mitigation |
|---|---|
| **Medical claims and liability.** A row reads like a diagnosis, someone keeps training through an injury, or two screens give different "get it checked" advice | Rows say "usually means", never name a condition. One shared `RED_FLAG` block (NHS wrist-pain guidance, https://www.nhs.uk/conditions/hand-pain/wrist-pain/, checked 2026-09-30) with an urgent line and a see-a-doctor line, only on joint rows and the hand zoom; C8 fails any row with its own red-flag wording. On `push` exercises a "Wrist sore before you start" row (appendix A1). The owner's disclaimer line ("General guidance, not medical advice. If something hurts, stop and get it checked.") once per sheet, right after "Risks and when to stop" (LR-23). No personal advice: the sheet never reacts to the user's own pain |
| **Wrong advice.** A card is wrong, as the seat-height line in the brief and in GENERAL.md was; or a fix gives a direction that is wrong on some machines ("raise the seat" when it is already too high) | Two-person research (writer and verifier), coach review, evidence tags kept per claim, C8 blocks unsourced rules, render review compares pictures to cards. Fixes name the target ("handles at mid-chest") before the usual direction. No copy from GENERAL.md (6) |
| **The hand zoom is never seen when it matters** (mid-set, heavy load) | "Heel of palm" is always a plate callout on `push`; the Mistake pill leads with the wrist fault; the workout hint line shows the push cue every set (2.1). A one-time automatic zoom needs the owner's OK (new saved data) |
| **The wrong hand is drawn from an angle that hides the fault** (vertical handles from the side) | Hand camera chosen so the bend lies flat on screen, printed on the zoom; C16 requires the camera label; C5 rejects a bend fault in a non-radial view; owner match check (6.3) |
| **Checks that look strict but aren't** (a builder re-stamping its own review; numbers that pass while the picture is wrong) | Review stamps in supervisor-owned `reviews.json`; C5 checks signs, contact and thumb, not only distances; the render review and the device checks cover what numbers can't (6.1) |
| **Push rule applied where the load isn't along the forearm** (rope, fly, pallof) | `loadAxis`, moves to `hold`, rope rule, second pass before stubs (3.1.1) |
| **Overclaiming "feel".** EMG does not equal feeling; front delts work nearly as hard as the chest on the machine press | Plain area words only, no numbers (C7), feel line framed as the setup goal; cards keep the honest note; mind-muscle cues framed for lighter sets (Calatayud 2016 https://pubmed.ncbi.nlm.nih.gov/26700744/ , Snyder and Fry 2012 https://pubmed.ncbi.nlm.nih.gov/22076100/) |
| **Misleading map regions.** Aliases (`rotator_cuff` shown on the rear delts) and `core` drawn on the serratus | Aliases off in feel mode, `core` text only, C2 |
| **Cluttered sheet** | Plate untouched apart from the grip callout; max 3 callouts, max 4 chips; one hand-zoom page on `push`; feel section below the fold with two map markings at rest and at most 3 rows before "More"; 30-word row limit; set-up list collapsed after 3; sources collapsed; one zoom open at a time |
| **Shimmer read as "pain" or "danger", or as "loading"** | Legend has two words ("Main", "Helps"); watch outlines and joint tints appear only inside an open row that names them in words; pain uses the mistake colour on joints only; watch uses outline, not fill. Against "loading": clipped to muscles, diagonal, slow, 2 passes, 300 ms in-view delay (2.3) |
| **Colour-only meaning** | Right and Wrong printed with icons; main filled, watch outlined; every map mark also in text |
| **Performance on budget phones** | Pre-rendered SVG, transform and opacity only (C18), 2-pass shimmer, size budgets in CI, frame times measured on a real budget phone (5.4) |
| **Flaky CI** (timing checks, float output) | No frame timing in CI; C12 limit computed from the spec plus 1 s; C14 with rounded coordinates and a pinned Node version |
| **Content scale** (153 deep cards is a lot of research) | Level 1 archetype content for all 153 first; Level 2 cards in archetype batches; `extends` for near-duplicates (incline presses, pulldown variants); C6 keeps coverage honest |
| **Archetype rules that don't fit an exercise** (front rack, wrist curl) | Explicit `exempt` with reason and source; C5 allows nothing silent |
| **Engine limits** (no top view, no front view of the leg press) | Those zooms stay as text in v1; listed in the appendix |
| **Stale sources and dead links** | `checked` date per source; a yearly re-check task; claims never rest on `unreachable` sources |
| **Theme contract change** (`--mistake`, `--feel-main` added to every theme) | Supervisor wiring in `themes.ts`, add-only block in `tests/theme.test.ts`, C9 |

**Needs the owner's decision:**

1. **Qualified review (costs money).** My recommendation: a physiotherapist with hand and wrist experience reviews
   the 10 hand archetypes and the red-flag wording once, and a certified strength coach (for example NSCA-CSCS or
   an equivalent qualification) reviews the exercise cards in batches. Without it the content can still go to your
   own phone for testing, but I would not ship it to other users as "proper handling" advice.
2. **The disclaimer line** wording, and whether you want a lawyer to look at it.
3. **Showing evidence tags to users** ("measured" vs "coaching advice"). Closed by the owner on 2026-09-30 (LR-23):
   no sources or evidence labels in the UI; they stay in the data.
4. **Order after the 8 cards.** Recommendation: all `push` exercises next (26, the injury path), then `pull` and
   `hang`.
5. **A "seen" flag (new saved data).** Should the hand close-up open by itself the first time you open a pressing
   exercise? That means saving one small "already seen" note per exercise on the phone. Recommendation: yes, but
   only after your approval; v1 works without it (2.1).
6. **Your photo check and your machine's handles** (only you can do this). Look at the drawn wrong hand next to your
   photo 1 and say whether it matches (6.3), and tell us which handles you used last night, vertical or horizontal.
   More broadly, gyms differ: tell us which handle types the machines you use have, so each machine's zoom leads with
   the pair you'll actually hold.

**Needs the supervisor:** the folder names in 4.4, `reviews.json` ownership and its guard rule, the pinned Node
version for C14, the `themes.ts` token additions, the `MuscleMap` feel mode, the `EntryCard` hint line in
`Train.tsx`, and the three library differences (seated row lats, leg press adductors, squat hamstrings).

---

## 9. Appendix A: the 8 verified cards

For each: archetypes, the grip line and feel line as the card has them (lint result noted), map roles, the chosen
chips (max 4, in order) and where the card's other zooms go, and the key sources.

### A1. Machine chest press (`lib_machine_chest_press`)

- Hand `push`, neutral vertical handles (horizontal as inset), `machine-grip`, `loadAxis: 'along-forearm'`; contacts
  `seat-back`, `standing-feet` (feet flat on the floor). Main pair and inset swap if the owner's check (6.3) shows he
  used the horizontal handles.
- Grip line: "Put the handle low in your palm, right on the heel of your hand, and wrap your thumb around it. Your
  knuckles should line up with your forearm. If your wrist starts bending back, the weight is too heavy." (passes)
- Cue line: "Handles at mid-chest." ("nipple line" stays in the posture detail only if the coach reviewer wants it;
  ACE's own wording is "around nipple level".) Workout hint line: "Push with the heel of your hand."
- `handleChoice.sore`: "Sore wrist? Use the vertical handles." (coaching consensus, chest press card evidence notes)
- Feel line: "You should feel this across the middle and lower chest. If the front of your shoulders is doing most of
  the work, set the seat so the handles line up with the middle of your chest." (36 words; replaces the card's
  "raise the seat" line, see section 1)
- Rows (first 3 shown, the rest behind "More"):
  1. Front of the shoulders. Means: "The handles are probably too high for your chest, or your shoulders are rolling
     off the pad." Fix: "Set the seat so the handles line up with the middle of your chest. On most machines
     that means raising it."
  2. Wrist (top or back of the wrist), `redFlag: true`, zoom Hand. Means: "Your wrist is bending back and the handle
     has slid into your fingers. Often the weight is too heavy." Fix: "Move the handle into the heel of your palm
     and wrap your thumb. Go lighter until your wrist stays straight." (Replaces the card's 58-word, 4-sentence fix
     and its own "after a few days" red-flag wording, which disagreed with the NHS two weeks.)
  3. Wrist, already sore before you start, `redFlag: true`, zoom Hand. Means: "Pressing heavy on a sore wrist can
     make it worse." Fix: "Use the vertical handles and go lighter. Stop the set if it hurts." Claim: NHS
     self-care says not to lift heavy things with wrist pain (https://www.nhs.uk/conditions/hand-pain/wrist-pain/);
     handle choice is consensus (card). Tags: CONSENSUS.
  4. to 6. behind "More": top of the shoulders or neck, mostly triceps, lower back, elbows (card text, re-linted to
     the 30-word limit).
- Plate callouts (3): Heel of palm, Blades on pad, Handles mid-chest. Mistake pill: the wrist fault first; the plate's
  "round and lock" body mistake becomes the wrong crop of the Blades zoom. The card's other mistakes stay in text.
- Map: main chest; helps upper chest, triceps, front delts; watch front delts, upper traps, forearms (each shown only
  while its row is open). Wrist rows mark the `hand-*` parts, not the forearm muscles.
- Chips: Hand ("Seen from above"; wrong: `fingers-bent-back` 30 to 40 degrees, handle in the finger bends, thumb
  loose; inset: same on horizontal handles, "Seen from the side"; one page), Seat height, Blades (shoulder blades on
  the pad at the end), Where to feel it. "Start depth" is top-down: text checkpoint until the engine has a top view
  of the body.
- Setup additions (3.4): get in, check the pin is fully in, foot bar to bring the handles out, get out. Sources to
  confirm in the card.
- Sources: ACE seated chest press https://www.acefitness.org/resources/everyone/exercise-library/188/seated-chest-press/ ;
  Muyor 2023 https://pmc.ncbi.nlm.nih.gov/articles/PMC10203828/ ; Weiss 1995 https://pubmed.ncbi.nlm.nih.gov/7593079/
  (MECH/WEAK for this use) ; Nance 2017 https://pubmed.ncbi.nlm.nih.gov/29085728/ (WEAK for presses) ;
  Fees 1998 https://pubmed.ncbi.nlm.nih.gov/9784824/ ; Barbell Logic https://barbell-logic.com/bench-press-grip-tips/ ;
  NHS wrist pain https://www.nhs.uk/conditions/hand-pain/wrist-pain/
- Open: the feel target is coaching, not EMG (front delts about as active as the chest in Muyor 2023, so some
  shoulder feel is normal). Seat-height advice has no study; ACE plus consensus.

### A2. Dumbbell lateral raise (`lib_dumbbell_lateral_raise`)

- Hand `hold`, neutral turning to pronated, `dumbbell`; contact `standing-feet`.
- Grip line: "Hold the handle across the middle of your palm with your thumb wrapped and your wrist straight. At the
  top, your thumb stays level with your little finger or a touch higher." (passes; replaces "keep your thumb level
  with your pinky, never lower", which read two ways)
- Feel line: "You should feel this on the outside of your shoulders, the round cap. If your neck and the top of your
  shoulders are doing most of the work, go lighter and keep your shoulders down." (passes)
- Map: main side delts; helps upper traps, front delts; watch forearms, lower back (upper traps and front delts are
  helpers, marked as watch only when their row is open). Shoulder pinch is a row with no map mark (`rotator_cuff`
  has no drawn region).
- Chips: Hand (wrong: `fingertip-hang`; one page, with an end-on inset "thumb vs little finger": level or thumb a
  touch higher is right, little finger higher than the thumb is wrong), Top height, Shoulders (neck and traps), Where to feel it. "Arm path from above" is top-down:
  text. "Torso" swing is the plate's Mistake layer.
- Fix before spec: setup step 2 says "the EMG study that tested this exercise used a seated version"; user copy
  must drop the study reference.
- Sources: ACE lateral raise https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/ ;
  Coratella 2020 https://pmc.ncbi.nlm.nih.gov/articles/PMC7503819/ ; Graichen 1999 https://pubmed.ncbi.nlm.nih.gov/10370995/ ;
  Kolber 2014 https://pubmed.ncbi.nlm.nih.gov/24077379/ ; Andersen 2008 https://pubmed.ncbi.nlm.nih.gov/18339796/
- Open: Coratella 2020 is 10 competitive bodybuilders, seated; Kolber 2014 and Graichen 1999 show association and
  anatomy, not injury causes.

### A3. Barbell back squat (`lib_barbell_back_squat`)

- Hand `on-body`, pronated, `bar-28`, thumb `wrapped` with `beside` allowed; contact `standing-feet`.
- Grip line: "Hands a little wider than your shoulders, bar in the heel of your palm, wrists straight, elbows down.
  Your back holds the bar. Your hands just keep it there." (passes)
- Feel line: "You should feel this in the front of your thighs and your glutes. If your lower back is doing more
  than your legs, go lighter and let your chest and hips rise together." (33 words; the card's 41-word version
  dropped "with your inner thighs helping near the bottom", which the map already shows as a helper)
- Map: main quads, glutes; helps adductors, lower back, hamstrings; `core` text only (drawn on the serratus); watch
  forearms, upper traps (as bar pressure, not work); lower back marked as watch only when its row is open. Wrist and inside-elbow row marks `hand-back-*` and `elbow-*`; neck row marks `nape`.
- Chips: Hand (wrong: `waiter-tray`, load arrow through wrist and elbow; inset thumb-beside), Bar on back, Feet and
  knees, Depth. "Bar over mid-foot" is already a plate datum.
- Sources: ACE back squat https://www.acefitness.org/resources/everyone/exercise-library/11/back-squat/ ;
  Human Kinetics https://us.humankinetics.com/blogs/strength-conditioning-fitness/squat-technique ;
  Barbell Logic https://barbell-logic.com/?p=4521 ; Caterisano 2002 https://pubmed.ncbi.nlm.nih.gov/12173958/ ;
  Kubo 2019 https://pubmed.ncbi.nlm.nih.gov/31230110/ ; Fry 2003 https://pubmed.ncbi.nlm.nih.gov/14636100/
- Open: sources disagree on wrist extension (Human Kinetics teaches an extended wrist, Barbell Logic warns against
  it); the card allows 0 to 15 and draws the line where the wrist carries load. All hand rules are consensus.
  High-bar only; low-bar needs its own card.

### A4. Pull-up (`lib_pull_up`)

- Hand `hang`, pronated, `bar-32`; contact `hang-support`.
- Grip line: "Hands just outside your shoulders, palms facing away. Lay the bar across the top of your palm where
  your fingers start, close your hand and wrap your thumb under the bar." (passes)
- Feel line: "You should feel this in the sides of your back, under your armpits. If your arms or the tops of your
  shoulders are doing most of it, pull your shoulders down first and then drive your elbows toward your ribs."
  (passes, 40 words)
- Map: main lats; helps biceps, mid back, forearms, abs; watch upper traps, lower back. Shoulder pinch and elbow rows
  have no map mark or mark `elbow-*`.
- Chips: Hand (wrong: `fingertip-slip`, second page `palm-deep`; thumb page with full, thumbless, hook, gymnastics
  false grip), Shoulder blades, Grip width, Top position. "Body line" (swinging) is the plate's Mistake layer.
- Sources: Youdas 2010 https://pubmed.ncbi.nlm.nih.gov/21068680/ ; Dickie 2017 https://pubmed.ncbi.nlm.nih.gov/28011412/ ;
  Prinold and Bull 2016 https://pubmed.ncbi.nlm.nih.gov/26383875/ ; O'Driscoll 1992 https://pubmed.ncbi.nlm.nih.gov/1538102/ ;
  Catalyst Athletics https://www.catalystathletics.com/exercise/39/Pull-up/
- Open: grip width data is thin (one modelling study vs one kinematics study); thumb position unstudied.

### A5. Hanging leg raise (`lib_hanging_leg_raise`)

- Hand `hang`, pronated, `bar-32`; contacts `hang-support`, with ab slings and captain's chair as options.
- Grip line: "Hands about shoulder width, palms facing away. Lay the bar across the base of your fingers, close your
  hand and wrap your thumb under. If your grip quits before your stomach does, use straps." (passes)
- Feel line: "You should feel this down the front of your stomach, most of all below your belly button. If it's
  mostly the front of your hips, bend your knees and roll your hips up toward your ribs at the top." (39 words;
  shortened from the card's 46)
- Map: main abs; helps obliques, hip flexors, lats, forearms; watch lower back, upper traps (hip flexors and forearms
  marked as watch only when their row is open).
- Chips: Hand (thumb page: full vs thumbless), Pelvis curl, Straps (lifting strap, ab slings, captain's chair),
  Shoulder blades. "Body line" is the plate's Mistake layer.
- Sources: McGill 2015 https://pubmed.ncbi.nlm.nih.gov/25111163/ ; Escamilla 2006 https://pubmed.ncbi.nlm.nih.gov/16649890/ ;
  Workman 2008 https://pubmed.ncbi.nlm.nih.gov/18714231/ ; Andersson 1997 https://pubmed.ncbi.nlm.nih.gov/9118976/ ;
  Catalyst Athletics https://catalystathletics.com/exercise/45/Hanging-Leg-Raise/
- Open: the pelvis-curl support is indirect (lying leg lift, not on a bar); "below the belly button" is a common feel
  cue, not a measured lower-ab bias. The straps panel needs a strap drawing the engine does not have yet.

### A6. Lat pulldown (`lib_lat_pulldown`)

- Hand `pull`, pronated, `bar-28` on the lat bar (bent ends); contacts `seat-back`, `brace-pad` (knee pad).
- Grip line: "Hands about one and a half times shoulder width, palms facing away. Lay the bar across the base of your
  fingers and wrap your thumb around it. Keep your wrists straight, knuckles up." (passes)
- Feel line: "You should feel this in the sides of your back, under your armpits. If your biceps are doing most of it,
  loosen your grip a bit and pull your elbows down to your sides." (passes)
- Map: main lats; helps mid back, biceps, rear delts, forearms (brachialis text only); watch upper traps, lower back
  (biceps and forearms marked as watch only when their row is open).
- Chips: Hand (wrong: `curled-squeeze`; inset `fingertip-slip` "end the set here"; inset thumb-over option), Grip
  width, Knee pad, Lean and bar path. Shoulder blades is already a plate callout.
- Fix before spec: `front_delts` in the watch list stands for a shoulder pinch, which is pain, not a muscle taking
  over. Move it to a row with no map mark, as the pull-up card does.
- Sources: ACE lat pulldown https://www.acefitness.org/resources/everyone/exercise-library/158/seated-lat-pulldown/ ;
  Signorile 2002 https://pubmed.ncbi.nlm.nih.gov/12423182/ ; Lusk 2010 https://pubmed.ncbi.nlm.nih.gov/20543740/ ;
  Andersen 2014 https://pubmed.ncbi.nlm.nih.gov/24662157/ ; Kolber 2013 https://pubmed.ncbi.nlm.nih.gov/22836608/ ;
  O'Driscoll 1992 https://pubmed.ncbi.nlm.nih.gov/1538102/
- Open: the bent bar ends keeping the wrist straight is reasoning only; the behind-the-neck risk is one association
  study.

### A7. Seated cable row (`lib_seated_cable_row`)

- Hand `pull`, neutral, `v-handle`; contact `foot-platform` (pull form: legs brace, do not push).
- Grip line: "Hold the V-handle with your palms facing each other, the handle across the base of your fingers and your
  thumbs wrapped round it. Keep your wrists straight, knuckles pointing at the stack." (passes)
- Feel line: "You should feel this between your shoulder blades and down the sides of your back. If your arms are
  doing most of the work, relax your grip and pull with your elbows." (passes)
- Map: main mid back, lats (differs from the library, which has lats as secondary: `libraryDiff`); helps rear delts,
  biceps, forearms (brachialis text only); watch upper traps, lower back. Hamstring tug row has no shimmer.
- Chips: Hand (wrong: `fingertip-slip` with the wrist curled toward the belly), Back line, Foot on platform, Finish
  position.
- Fix before spec: two row fixes carry citations ("(Fujita 2020)", "(de Abreu Vasconcelos 2023)"); `front_delts` in
  watch stands for a pinch (same fix as A6). The card's wrist target keeps a 0 to 20 degree band, while the lat
  pulldown card dropped its band because O'Driscoll's strongest grip sits at 25 to 35 degrees; align the two pull
  cards before the `pull` archetype range is fixed.
- Sources: de Abreu Vasconcelos 2023 https://doi.org/10.47206/ijsc.v3i1.190 ; Lehman 2004 https://pubmed.ncbi.nlm.nih.gov/15228624/ ;
  Fujita 2020 https://pubmed.ncbi.nlm.nih.gov/32448047/ ; Fenwick 2009 https://pubmed.ncbi.nlm.nih.gov/19197209/ ;
  ACE seated row https://www.acefitness.org/resources/everyone/exercise-library/168/seated-row/
- Open: no study measures spine load on this row; the Padovan 2025 narrow-vs-wide numbers come from a review, the
  full text was unreachable.

### A8. Leg press, 45 degrees (`lib_leg_press`)

- Hand `balance`, `pad-handle` side handles; contacts `foot-platform`, `seat-back`.
- Grip line: "Hold the side handles lightly with your thumbs wrapped round. They keep you in the seat, so leave your
  hands there and never push on your knees." (passes)
- Feel line: "You should feel this in the front of your thighs and your glutes. If your lower back is working, you're
  going too deep, so stop a little higher and keep your tailbone on the pad." (passes)
- Map: main quads, glutes; helps adductors (a `libraryDiff`, from Kinoshita 2026), hamstrings, calves; watch lower
  back, forearms. Knee rows mark `knee-*` parts.
- Chips: Back on pad, Foot on platform, Hand (wrong: `push-on-knees`, wrist near 90 degrees, force line behind the
  wrist), Safety catch. "Knee at the top" is the plate's soft-knees callout; "Knee tracking" needs a front view of
  the sled the engine lacks: text checkpoint.
- Sources: ACE leg press https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/ (the
  verifier got a 403; content taken from the first research pass) ; NASM https://www.nasm.org/resource-center/exercise-library/leg-press ;
  Escamilla 2001 https://pubmed.ncbi.nlm.nih.gov/11528346/ ; Da Silva 2008 https://pubmed.ncbi.nlm.nih.gov/18545207/ ;
  Barnds 2019 https://pubmed.ncbi.nlm.nih.gov/30676343/ ; MacDougall 1985 https://pubmed.ncbi.nlm.nih.gov/3980383/
- Open: two sources (ACE page, Bells of Steel) could not be opened by the verifier; C8 blocks any rule resting only on
  them. Nothing measures grip or wrist on this machine (WEAK); lockout risk rests on one case report.

---

## 10. Appendix B: archetype assignment for all 153 exercises

Provisional, from name, equipment and pattern in `exercises.json`; each card confirms or changes its row. Checked by
script: every id assigned once, none unknown. This list becomes the C6 stub file.

**Hand archetypes (153):**

- `push` (26): machine_chest_press, dumbbell_bench_press, barbell_bench_press, smith_machine_bench_press,
  incline_machine_press, incline_dumbbell_press, incline_barbell_bench_press, smith_machine_incline_press,
  decline_bench_press, cable_chest_press, weighted_dip, shoulder_press, dumbbell_shoulder_press,
  barbell_overhead_press, smith_machine_shoulder_press, arnold_press, triceps_pushdown, rope_triceps_pushdown,
  straight_bar_triceps_pushdown, single_arm_triceps_pushdown, overhead_cable_triceps_extension,
  dumbbell_overhead_triceps_extension, skull_crusher, close_grip_bench_press, ab_wheel_rollout, sled_push.
  Second pass before stubs (3.1.1): rope_triceps_pushdown and overhead_cable_triceps_extension (rope rule,
  `loadAxis: 'across'`), dumbbell_overhead_triceps_extension (cupped)
- `palm-flat` (10): push_up, incline_push_up, bench_dip, pike_push_up, diamond_push_up, burpee, mountain_climbers,
  bear_crawl, bird_dog, renegade_row
- `pull` (19): lat_pulldown, close_grip_pulldown, underhand_lat_pulldown, single_arm_lat_pulldown, chest_supported_row,
  seated_cable_row, barbell_row, pendlay_row, one_arm_dumbbell_row, t_bar_row, landmine_row, face_pull,
  cable_external_rotation, upright_row, rear_delt_fly, inverted_row, resistance_band_row, resistance_band_pull_apart,
  sled_pull
- `hang` (5): pull_up, chin_up, assisted_pull_up, hanging_leg_raise, hanging_knee_raise
- `hold` (28): pec_fly and pallof_press (moved from `push`, 3.1.1; second pass before stubs), dumbbell_lateral_raise, cable_lateral_raise, dumbbell_front_raise, bent_over_dumbbell_rear_delt_fly,
  cable_rear_delt_fly, cable_fly, low_to_high_cable_fly, high_to_low_cable_fly, dumbbell_fly, dumbbell_pullover,
  straight_arm_pulldown, dumbbell_shrug, barbell_shrug, smith_machine_shrug, cable_shrug, farmer_s_carry,
  romanian_deadlift, dumbbell_romanian_deadlift, single_leg_romanian_deadlift, conventional_deadlift, sumo_deadlift,
  walking_lunge, reverse_lunge, forward_lunge, bulgarian_split_squat, step_up
- `curl` (13): dumbbell_biceps_curl, alternating_dumbbell_curl, barbell_curl, ez_bar_curl, hammer_curl,
  cross_body_hammer_curl, cable_curl, bayesian_cable_curl, preacher_curl, incline_dumbbell_curl, concentration_curl,
  reverse_curl, wrist_curl (exempt: moving joint)
- `on-body` (7): barbell_back_squat, front_squat (front rack exempt, needs its source), goblet_squat,
  smith_machine_squat, hip_thrust, cable_crunch, russian_twist
- `balance` (18): leg_press, horizontal_leg_press, hack_squat, pendulum_squat, leg_extension, seated_leg_curl,
  lying_leg_curl, standing_leg_curl, hip_abduction, hip_adduction, seated_calf_raise, standing_calf_raise,
  leg_press_calf_raise, machine_crunch, machine_lateral_raise, machine_pullover, cable_kickback, resisted_hip_flexion
- `implement` (5): kettlebell_swing, battle_ropes, medicine_ball_slam, wall_ball, jump_rope
- `none` (22): crunch, reverse_crunch, plank, side_plank, dead_bug, hollow_body_hold, v_up, bicycle_crunch,
  flutter_kicks, superman, back_extension, glute_bridge, bodyweight_squat, jump_squat, bodyweight_lunge,
  bodyweight_split_squat, pistol_squat, wall_sit, bodyweight_calf_raise, box_jump, jumping_jacks, high_knees

`overBody: true` (free weight over the face, neck or chest; thumb wrapped required): dumbbell and barbell bench
presses (flat, incline, decline, Smith included since the bar travels over the face), close_grip_bench_press,
skull_crusher, dumbbell_fly, dumbbell_pullover, dumbbell_overhead_triceps_extension, and the standing overhead
presses.

**Primary contact archetypes (153):** seat-back 20, bench-lying 13, foot-platform 6, pivot-pad 4, brace-pad 7,
floor-body 22, hang-support 6, standing-feet 75. Secondary contacts (knee pad on pulldowns, pivots on leg extension
and hip machines, the bench under a one-arm row) are added per card.

Hand zooms needed at Level 1: 131 exercises (all but `none`). They are drawn once per unique (archetype, orientation,
handle, fault) combination and shared; the exact count is known once each exercise's orientation and handle are set.
