# How to do it: four options

For the owner, 29 Sep 2026. All screens show the Dumbbell Lateral Raise. Every file path below is inside `scratchpad/howto/`. Start with `CONTACT-SHEET.png`, which puts every screen on one page, grouped by option.

## Summary and recommendation

We looked at four ways to replace the drawn "How to do it" figure. We built real phone screens for each, a judge scored them, and we fixed the judge's quick points before this write-up.

**Recommendation: Studio Loop.** It is a short filmed loop of one real athlete in a dark studio. Under it, a rep timeline and a cue that changes with each part of the rep. This is how Apple Fitness+, Alpha Progression and Fitbod do it, and it is the only option that can't look like a drawing. Its weak point is honest: tonight's screens use a still stock photo, so they show the layout but not the look.

**The cheapest proof is a one-exercise phone test before any spend.** You (or a friend) film one lateral raise on a tripod against a black backdrop. Agents grade it and put it into this exact player on your phone. If it looks premium, book the 15-exercise shoot. **Fallback: Technical Plate**, a still line drawing in the app's own colours. It costs $0, agents can build it in about a week, and it works in all 5 themes. Use it only if you look at the plate screens and they don't read as "drawn". **Key Frames** should not be a separate option: its photos come from the same shoot and become Studio Loop's still and offline view. **Drop Graphite Figure** for now: it looks like a crash-test dummy, and it is the slowest and most expensive option.

## Compare the options

The judge scored each option from 1 to 5, where higher is better. For cost, 5 means cheapest.

| Option | Premium | Accuracy | Can we do it | Cost | Fits the app | Total /25 | Verdict |
|---|---|---|---|---|---|---|---|
| Studio Loop (filmed athlete) | 4 | 4 | 2 | 3 | 4 | 17 | **Recommended.** Phone test first. |
| Technical Plate (line drawing) | 3 | 4 | 5 | 5 | 5 | 22 | **Fallback.** Only if it doesn't read as "drawn". |
| Key Frames (photo strip) | 3 | 3 | 3 | 4 | 4 | 17 | Fold it into Studio Loop. |
| Graphite Figure (3D body) | 2 | 3 | 1 | 1 | 3 | 10 | Drop for now. |

Technical Plate has the highest total because it is cheap and easy. It still isn't the first pick: you rejected the old guide for looking drawn, and a drawing carries that risk. Premium matters more here than ease.

| | Studio Loop | Technical Plate | Key Frames | Graphite Figure |
|---|---|---|---|---|
| Money for 15 exercises | about A$2,000–4,500 with a hired videographer, or about A$500 if you film it yourself (estimate) | $0 plus 2–4 h of coach time | $0 extra if shot with Studio Loop | about US$1.6–5.5k (unverified) |
| Time for 15 | about 1 week once people are booked | about 1 week | 4–5 days after the shoot | 3–4 weeks |
| Money for all 153 | about A$15–35k with a hired videographer (estimate), much less if self-filmed | $0 plus coach time | small extra on the same shoot days | about US$10–30k (unverified) |
| Works offline | after one download per clip, or "Download all" on Wi-Fi | yes, all 153 in about 300 KB | yes, from first launch for v1 | after one download per clip |
| Follows the 5 themes | the player does; the video stays dark | yes, fully | the page does; the photos stay dark | the player does; the render stays dark |
| Needs you | booking a shoot, a coach, the spend, hosting approval | booking a coach, a look check | the same shoot as Studio Loop | two new paid vendors, a capture day, the spend |

"Unverified" means the figure came from tonight's research and nobody has confirmed it with a real quote.

---

## 1. Studio Loop: filmed athlete, cues timed to the rep (recommended)

**What it is.** Tap "How to do it" and a sheet opens with a square video of one real athlete doing one rep at the correct tempo, looping. Under the video is a thin timeline split into Lift 1 s · Hold 0.5 s · Lower 2 s · Rest 0.5 s. A dot moves along it, and one cue line changes with the phase. For example, during Lift it says "The elbows lead, the hands follow." Buttons:
- **Slow** plays at half speed.
- **Mistake** swaps in a short clip of the common fault, with its tells as the cue lines.

Below that, the muscle map shows what the exercise works. With reduced motion turned on, nothing plays by itself: you see a still, the three cues as a numbered list, and a Play button.

**How it looks**
- `mock-studio-loop/a-train-card.png`: the exercise card with the "How to do it" pill where it is today.
- `mock-studio-loop/b-howto-playing.png`: the sheet playing, on the Lift phase.
- `mock-studio-loop/c-howto-reduced-motion.png`: reduced motion, with the still, the numbered cues and Play.

**Be aware:** the stage is a still stock photo from Pexels, not our athlete. It doesn't match the brief (the model is shirtless). No motion is shown, and the screen says so. The screens prove the layout, not the look.

**Why it feels premium.** A real person, one camera position, soft light and a near-black background: the same approach as Apple Fitness+, Alpha Progression and Fitbod. The video is graded so its background matches the app's own dark surface (#0f1011), so in Silent Black the clip sits inside the card instead of on top of it. Cues timed to the rep go further than the static text in Hevy, Strong and Fitbod.

**Cost and time**
- Pilot of 15, filmed in Australia where you live: about A$2,000–4,500 (estimate; only the videographer rate was checked). That covers:
  - a videographer at about A$1,200–2,500 a day (Sydney rates, checked 29 Sep 2026), or $0 if you film it yourself;
  - gym rent after hours;
  - the athlete's fee;
  - lights if bought (about US$200–500);
  - 2–4 hours of coach review.
- About 1 week once people are booked: 1 day of prep, 1 shoot day, 2–3 days of edit and review, and 1 day to put it in the app. The player gets built at the same time.
- All 153: roughly A$15–35k with a hired videographer (estimate), with 8–11 more shoot days over 1–2 months.
- Hosting: Cloudflare R2. The free tier is 10 GB of storage a month with no download (egress) fees, checked today on Cloudflare's pricing page. 15 clips are about 20 MB and 153 are about 200 MB, so hosting should cost $0.

**What you must do**
1. First, the phone test: film one lateral raise.
   - Phone on a tripod at chest height, a black backdrop and one soft light from the front-left.
   - Plain black top and shorts, no logos, light hex dumbbells.
   - A metronome app set to 1 s up, 0.5 s pause, 2 s down, 0.5 s rest.
   - 3 takes, then send the files.
2. If you like the result:
   - approve the spend;
   - book one athlete for the whole library, with a signed model release;
   - book an unbranded gym after hours;
   - book a coach: a PRC-licensed physical therapist or a certified strength coach in the PH, or an AUSactive or ESSA professional in AU;
   - book a videographer, or film it yourself.
3. Approve Cloudflare R2 as a new service.
4. Check the finished clips on your phone.

**Risks and what we do about them**
- The athlete isn't available later, so the 153 don't match. Sign them for the whole library and film everything within about 2 months.
- Likeness rights: get a signed release for use inside the app, worldwide, with no end date.
- Gym logos: tape over them, or use an unbranded gym.
- Android may block a video from starting on its own. Start it from the tap; if that fails, show a Play button. Test on a real phone.
- Mobile data cost in the PH: show the size of each clip, and allow "Download all" on Wi-Fi only.
- Filming the mistake could hurt the athlete: use a light weight, with the coach on set.
- Spending too early: pilot 15 before committing to 153.

**AI video is not used.** Tonight's research found joints and hands drifting in all current AI video tools, and the commercial terms of some tools are unclear.

---

## 2. Technical Plate: a still line drawing of the movement (fallback)

**What it is.** One still drawing in the app's own colours, like an engineering drawing:
- the end position solid and the start position dashed, with faint positions in between;
- the hand's path as one accent line with an arrow;
- the shoulder's range ("up to 90°");
- up to three short labels ("No shrug", "Elbows lead", "Stop at shoulder height"). Tap a label to read its full cue.

"Trace" draws the hand path once, over 2.4 s, and stops. It never loops. "Mistake" swaps in the fault marks (shrug, knee dip, thumbs down) in the mistake colour. Below are the tempo bar and the muscle map. Numbers appear only when a source states them.

**How it looks**
- `mock-blueprint-plate/a-train-card.png`: the entry pill.
- `mock-blueprint-plate/b-plate-elbows-lead.png`: the plate after Trace, with "Elbows lead" tapped.
- `mock-blueprint-plate/c-plate-mistake.png`: the Mistake view.
- `mock-blueprint-plate/d-plate-5-themes.png`: the same plate in all 5 themes.
- `mock-blueprint-plate/e-plate-paper.png`: the Paper theme.
- `mock-blueprint-plate/f-trace.mp4`: Trace playing once, 83 KB.

This is the real drawing code, not a stand-in.

**Why it feels premium.** It reads like a scientific or engineering plate: hairlines, tabular numbers and one accent colour. Its roots are the old long-exposure motion studies, not comics. It shows what video can't: the exact path and range, with sources. It matches the "Why this target" explanations the app already has. It is the only option that follows all 5 themes exactly.

**Cost and time**
- Money: $0 for media. A coach reviews the plates for 2–4 hours (the hourly rate is unverified).
- About 1 week for 15.
- About 4–6 weeks for 153. Most of that time goes on writing cited research for the other 138 exercises.

**What you must do**
1. Look at `b-plate-elbows-lead.png` and `d-plate-5-themes.png` and answer one question: does this still look drawn?
2. If you pick it, book a coach for 2–4 hours.
3. Check it on your phone.

**Risks and what we do about them**
- Any drawn figure may still feel like the look you rejected. There is no face, no clothes and no bouncing loop, and you decide from tonight's screens. The production plan traces the body outline from a real athlete photo.
- It is harder for beginners to read than video. At most 3 labels, in plain words, plus the cue line.
- Seated machines hide the body behind pads. Draw the pads as outlines over the figure.
- A rough example number could get shown as fact. A check script blocks any number that has no source.
- Clutter on small phones: an automatic check for overlapping labels, run at 320 px width.

---

## 3. Key Frames: an editorial photo strip (fold into Studio Loop)

**What it is.** Three or four photos of the key positions:
- Start;
- Top;
- Lower slowly;
- Avoid (the common mistake).

They sit in a strip you swipe, like a magazine page, with one numbered cue under each photo. A "Guides" switch adds one thin line showing the one thing to look at. Press and hold a photo to fade to its partner (Start and Top). Nothing moves by itself, and it works offline from the first launch.

**How it looks**
- `mock-key-frames/a-train-card.png`: the entry pill with a small stacked-frames icon.
- `mock-key-frames/b-sheet-start-guides.png`: frame 01 "Start", with the next frame peeking in.
- `mock-key-frames/c-sheet-paper-scrolled.png`: the Paper theme with the tempo under the photo.

**Be aware:** only frame 01 is a real photo, a Pexels stand-in. Frames 02 to 04 are empty placeholders, because we had no licensed photo of those positions and did not fake one.

**Why it feels premium.** Numbered, generous space, one idea per photo, which matches the app's restraint. It uses a real person where Hevy and Strong use generic illustrations. Reduced motion loses nothing, because nothing moves.

**Cost and time**
- Shot together with Studio Loop, about $0 extra: the athlete holds each key position for 2 seconds, adding 1–2 hours on set.
- About 2 agent days to build the strip.
- On its own: one shoot day, about A$1,200–2,500 for a videographer (estimate).

**What you must do.** The same shoot as Studio Loop.

**Risks and what we do about them**
- Stills can feel like the cheaper mode, and they can't show tempo or the weight's path. Use them as Studio Loop's still, offline and reduced-motion view, not as the only option.
- If the photos ship inside the app, they add about 3.6 MB to the first download. Cache them the first time the sheet opens instead.

---

## 4. Graphite Figure: our athlete's motion on a 3D body (drop for now)

**What it is.** Film our athlete once on ordinary phones. A tool then turns the video into 3D motion (the AI measures real movement; it doesn't invent it). That motion is played on one smooth, faceless graphite body in a fixed studio light, and you can switch the angle: Side, Front or 45°. The player is the same as Studio Loop's.

**How it looks**
- `mock-graphite-3d/a-train-card.png`: the entry pill.
- `mock-graphite-3d/b-howto-front-hold.png`: the front view at the top of the rep.
- `mock-graphite-3d/c-howto-45-paper.png`: the 45° view in the Paper theme.

The loop is at `mock-graphite-3d/renders/lateral-raise-front-loop.mp4`.

**Be aware:** this is a look test with a simple mannequin and computed motion, not a production body.

**Why it could feel premium.** The same body, light and camera for all 153 exercises, forever, from any angle, with no reshoots, no gym logos and no face.

**Cost and time** (all unverified)
- For 15:
  - a half-day capture, about US$100–300;
  - a motion-capture tool at about $48 a month;
  - a freelance 3D animator at about US$1.5–5k.
- About 3–4 weeks.
- For 153: about US$10–30k over 2–4 months.

**What you must do.** Approve two new paid vendors (the capture tool and an animator), book a capture half-day with an athlete and a coach, and pass a paid one-exercise pilot before any more spend.

**Why we drop it**
- The look test reads as a crash-test dummy.
- The first muscle-glow version lit the whole upper arm and looked like shine, so it pointed at the wrong muscle. We tried a tighter version tonight and it still read as shine, so it was withdrawn.
- The renders stay dark in the light Paper theme.
- It is the slowest, most expensive option and depends on a freelancer.

---

## What we would build first

**Studio Loop.** Card `howto-sl-1`: a phone test of the player with one real clip.
1. Build the How-to sheet (video stage, rep timeline, cue per phase, Slow, reduced-motion still, muscle map) as a separate part of the app that loads only when opened.
2. Load it with one lateral-raise clip you film on a phone, which agents grade, loop and shrink to 1.5 MB or less. No hosting yet; Mistake stays hidden until a mistake clip exists.
3. Done when the tests and the 320 px and reduced-motion checks pass, and you say yes to the look on your phone. Only then book the 15-exercise shoot.

**Technical Plate.** Card `howto-tp-1`: the plate renderer and its safety check.
1. Build the plate drawer that works from angle data inside the app (about 8 KB), plus a check script. The script confirms every drawn angle is inside its cited range, that a number shows only when a source gives it, that labels fit and don't overlap, and that text is readable in all 5 themes.
2. Draw the lateral raise and the Romanian deadlift first, with the body outline traced from a real photo.
3. Done when the joint-maths tests and the 320 px and reduced-motion checks pass, and you confirm on your phone that it doesn't look drawn.

**Key Frames.** Card `howto-kf-1`: the photo strip as Studio Loop's still layer.
1. Build the swipe strip (snap scrolling, pager, hold to compare, Guides switch) with no new library, working offline.
2. Fill it with the held key positions from the Studio Loop shoot; no stand-in photos ship in the app.
3. Done when the checks pass: 4 frames or fewer, cues of 60 characters or fewer, alt text on every photo, and a guide label only with a source. The 320 px and reduced-motion checks must pass too.

**Graphite Figure.** Card `howto-g3d-1`: a paid one-exercise pilot, with no app code.
1. Capture the leg press on 2 phones with a coach, turn it into 3D motion, and have an animator clean it up on a sculpted faceless body.
2. A script fails any frame where a joint leaves the cited range. The coach checks a side-by-side of the real video and the render.
3. Done when you watch it on your phone and prefer it to real footage. This needs your approval for two new paid vendors.

---

## Fix these whichever option wins

1. **Muscle data disagrees.** The exercise library (`src/data/exercises.json`) lists upper traps as a helper for the lateral raise. The research file lists front shoulders as the helper and says upper traps should stay quiet, which is what the "No shrug" cue says. The screens follow the research file. The library needs one data fix before any how-to ships.
2. **"Keep quiet" is a new muscle-map role.** The app's legend today is Main / Helps / Stabilises. The screens now say "Main" (not "Target") to match; "Keep quiet" still needs a yes.
3. **Wrong cue on Lower.** Studio Loop's plan put "The load peaks at shoulder height" on Lower. The research puts the load peak at the top hold, so that cue belongs to Hold. The Graphite screen already shows it on Hold.

## What changed tonight after the judge's review

- **Studio Loop**
  - The stand-in is now cropped from neck to mid-thigh, with no cap, no face and the logo blurred.
  - The stage says "still frame, no motion shown".
  - The legend says Main.
  - The empty gap under the cue is gone.
  - Timeline labels never touch, checked at 320 px.
- **Key Frames**
  - A line icon replaces the round face photo in the pill.
  - There is no guide line on Start.
  - The Paper screen shows the whole photo.
  - Up and Down use the accent colour; the pause is grey.
- **Technical Plate**
  - The body is redrawn: a head with a jaw and a visible neck, a sloped trapezius, and legs that separate below the hips.
  - The dumbbells are hex ends. A camera in front sees a dumbbell end-on in this lift, so we did not draw the handle side-on as the judge suggested.
  - The shoulder-height line runs to the shoulder.
  - The Trace clip shows only the three cited cues.
- **Graphite Figure**
  - The muscle glow is withdrawn.
  - The Angle control moved onto the video, so the sheet fits without scrolling.
  - The look-test note moved off the exercise cards.

## Sources

**Checked today**
- Cloudflare R2 pricing: 10 GB-month free storage, free egress. https://developers.cloudflare.com/r2/pricing/
- Pexels License: commercial use and editing allowed, no credit needed; people may not be shown in a bad light. https://www.pexels.com/license/
- Stand-in photo: "A Bodybuilder Holding Dumbbells" by Wagner Robson, Pexels photo 9073248. https://www.pexels.com/photo/a-bodybuilder-holding-dumbbells-9073248/

**Form, tempo and muscles** (the repo's lateral-raise guide and research files)
- ACE Fitness, Lateral Raise. https://www.acefitness.org/resources/everyone/exercise-library/26/lateral-raise/
- Physiopedia, Scapulohumeral Rhythm. https://www.physio-pedia.com/Scapulohumeral_Rhythm
- EMG study, 2020 (thumbs-down grip and upper traps): PMC7503819.
- Dumbbell vs cable lateral raise study (the load peaks at shoulder height): PMC12277279.
- Body proportions: D. A. Winter, *Biomechanics and Motor Control of Human Movement*, 4th ed., Wiley 2009, anthropometry chapter.

**Checked by the supervisor, 29 Sep 2026:** Australian videographer day rates of A$1,200–2,500 (Sydney). Sources: shootsta.com/blog/video-production-cost-australia, 618media.com.au (professional videographer cost guide), queencharles.com.au/video-production-pricing-sydney. The first draft priced the shoot in Manila; it was corrected because you live in Australia.

**From tonight's research, not re-checked here**
- The premium apps' approach: Apple Fitness+, Alpha Progression, Fitbod, Hevy, Strong, JEFIT, Centr and Muscle & Motion.
- Shoot, crew and animator prices: the other shoot costs (gym, athlete, lights), the motion-capture tool at about $48 a month, and the 3D animator.
- The finding that current AI video tools drift at the joints and hands.
- The Exercise Animatic licence, a possible fallback for hard-to-film machines.

**Mockup credits:** each `mock-*/CREDITS.txt` lists the files used, their licences and every change.
