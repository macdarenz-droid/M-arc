# M/ARC Google Play cards

Eight cards in the Strava style: a short headline on top and a real M/ARC screen in a plain phone underneath. Claude chose the words and the design. GPT only builds the images, one card at a time.

Two files sit next to this document in the same `play-cards` folder:
- `marc-headlines.png` holds all 8 headlines, already set in the app's font with proper letter spacing. You attach it to GPT once. GPT never types a headline itself.
- `card.py` is the exact script inside the master prompt below. It was tested here on real M/ARC screens (the web build, 1080 px wide at two phone shapes): every card comes out at 1080 x 1920.

## 1. The set

8 cards, the most Play allows for phones. Google shows the first three in search, so they carry the promise: it tells you what to lift, it shows you getting stronger, and it tells you which muscles are ready.

1. **Know what to lift next.** (live workout) The core promise: your next weight and reps are already filled in.
2. **Your progress, lift by lift.** (Stats) Proof that logging pays off: a trend line going up.
3. **Check which muscles are ready.** (Body recovery map) The most striking picture in the set, and the headline says what it does.
4. **Today’s plan, on one screen.** (Today) The home screen people open every day.
5. **Coaching from your own log.** (Escobar's notes) The coach, working from your training with no internet.
6. **See how your session went.** (Finish screen) The reward moment after a workout.
7. **Share the work you put in.** (Share sheet) This is the Strava-style feature, so it gets a card of its own.
8. **Five themes. Pick yours.** (Today in three themes) Closes the set and shows the app is yours to style.

The AI chat is not in this set. See section 6 for why.

## 2. Card design

One spec for every card, so the set reads as one product.

- **Canvas:** 1080 x 1920 px, 9:16, PNG, RGB, no transparency. This passes Play's rules (320 to 3840 px, no side more than twice the other). It also meets the "4+ screenshots at 1080 x 1920" bar for Play's recommendation spots.
- **Background:** flat `#08090a`, Silent Black's background. It is also M/ARC's launcher icon colour and splash colour, so the brand colour is black, not a bright one. There is no gradient, texture, vignette or pattern.
- **Headline:**
  - Font: Inter SemiBold (600), the app's heading weight. It is made from the same Inter package the app uses, in its display cut (Inter's own cut for big headlines).
  - Size: 76 px, with 92 px between lines. Colour `#f7f8f8`, the app's text colour. Centred.
  - Length: at most 2 lines, with the line breaks set per card.
  - Position: a one-line headline has its baseline at y = 237. A two-line headline has baselines at y = 192 and 284. Each headline sits in its own 1080 x 420 band of `marc-headlines.png`, and the script pastes that band at the top of the card.
  - Margins: at least 120 px on each side. The widest line is 827 px.
  - The final full stop is in `#5e6ad2`, the accent colour, like the dot in the M/ARC logo. It is the only colour on the card outside the app screen.
  - Why a ready-made strip: the font's letter-pair spacing only works with a text engine that ChatGPT's workspace may not have. Without it, pairs like "Yo" and "To" open up. Setting the headlines here removes that risk.
- **Subline:** none. Strava uses none, and Google says to keep text to a minimum.
- **Phone:**
  - Style: a plain generic outline. No brand, no notch, no buttons, no shadow, no reflection.
  - Body `#1b1c1f` (surface 3), 3 px edge `#343536` (the app's strong hairline over black), corner radius 80 px, bezel 14 px, screen corners 66 px.
  - Position: x = 150, y = 420, 780 px wide (the screen is 752 px wide). It runs off the bottom edge like Strava's, so roughly the bottom 10% of the screenshot is cut off, usually through the tab bar.
  - The screenshot is only scaled and cropped. It is never redrawn.
- **Card 8 only:** three of the same phones. The Silent Black phone is at the front (x 170, y 440, 740 px wide). Paper sits behind on the left (x -100, y 620, 640 px) and Midnight behind on the right (x 540, y 620, 640 px). On most phones (19:9 and taller) all three run off the bottom edge; on an 18:9 phone all three show their rounded bottoms. The script sorts the three screenshots by colour, so the upload order does not matter.
- **Logo:** none on the cards. Play shows the M/ARC icon and name right above the screenshots, and the accent full stop already echoes the logo dot. The files in `branding/` are not needed.
- **Never in any image:** gradients, glow, neon, bokeh or blur, 3D or glossy renders, lens flare, light leaks, reflections, heavy shadows, textures, people, hands, gym scenes, stock photos, props, extra or invented UI, invented numbers, badges, ribbons, stars or ratings, "#1", "best", "free", "new", prices, confetti, sparkles, emoji, other companies' names, and any text besides the headline.

## 3. Cards

Every card has no subline. The theme is **Silent Black** unless stated.

**Card 1.** "Know what to lift next."
- Screen: *Live workout logging (sets, weight, reps, effort, targets, PR badge)*. One exercise card is open, with weight and reps pre-filled from the target and the "Last:" line visible.
- Data: 2 or 3 earlier sessions of the same split, so the targets and "Last:" lines are real. Mid-workout: 1 or 2 exercises done, and the open exercise has 2 sets logged and rated, with the next set showing its target. A PR badge only if you really hit one.
- Why: it is the daily job of the app plus its best trick, and it reads as a gym app in one glance.

**Card 2.** "Your progress, lift by lift."
- Screen: *Progress charts (Stats)*. The 12-week volume chart, and under it the Exercise progress card on a lift that is going up (trend word "Improving").
- Data: 8 or more weeks of steady sessions, with rising loads on one main lift.
- Why: it is the outcome people want. The chart is proof, not a promise.

**Card 3.** "Check which muscles are ready." (lines: "Check which" / "muscles are ready.")
- Screen: *Muscle map and recovery*, the Body tab in its Recovery view, with the body map and "Ready times" below it.
- Data: a session yesterday and a different split 2 or 3 days ago, so the map shows a mix of recovered and recovering muscles.
- Why: it is the most visual screen in the app, and the headline says in plain words what it does.

**Card 4.** "Today’s plan, on one screen."
- Screen: *Today dashboard*: date, greeting, streak flame, the "Scheduled today" card with Start, Readiness, and This week.
- Data: your name set, splits plus a weekly schedule, a streak of a few days, today's check-in saved, and 2 or more weeks of sessions for the week numbers. Readiness must be past its first 14 days, or it shows "Green · calibrating" (see phone prep).
- Why: it is the home screen, and it shows the app thinks about your whole day, not only the log.

**Card 5.** "Coaching from your own log."
- Screen: *Coach notes, weekly review and lighter week (offline coach)*, the Escobar tab scrolled to "Escobar’s notes".
- Data: 3 to 6 weeks of rated sessions, so 3 or 4 notes show. Escobar can stay off.
- Why: it shows the coach working from what you logged, on the phone, with no AI and no internet.

**Card 6.** "See how your session went."
- Screen: *Finish screen (session saved)*: "<Split> done" with time, exercises and sets, then the Debrief cards.
- Data: a full session (5 to 7 exercises, 15 to 20 rated sets) on top of earlier history, so the Debrief has cards.
- Why: it is the reward moment and makes finishing a workout feel good.

**Card 7.** "Share the work you put in."
- Screen: *Share cards*, the Share sheet with a Week poster preview, 9:16.
- Data: a week with 3 or 4 sessions and at least one record.
- Why: it is the feature that feels most like Strava, and it is how people show friends.

**Card 8.** "Five themes. Pick yours."
- Screen: *Themes*, shown as the same Today screen in Silent Black (front), Paper (left) and Midnight (right). Never the theme picker, because it names other companies.
- Data: same as card 4.
- Why: it ends the set with something personal, and the three phones show the look changes, not only the colour of one button.

## 4. Master prompt for GPT

Paste this once, together with `marc-headlines.png` and your card 1 screenshot.

````
You are building Google Play screenshot cards for M/ARC, an Android gym tracker. The words and the design are final. Your only job is to build each card exactly as below, using the Python tool (Pillow). Never use the image generator for these cards: it redraws app screens and adds an "AI look", which is exactly what I don't want.

ATTACHED NOW: marc-headlines.png (all 8 finished headlines, one 420 px band per card) and my screenshot for card 1.

DESIGN (same on every card)
- 1080 x 1920 PNG, RGB, no transparency.
- Background: flat #08090a. Nothing else on it.
- Headline: band N of marc-headlines.png, pasted at the top as it is. Never type, redraw or change a headline.
- Phone: a plain rounded outline, body #1b1c1f, 3 px edge #343536, no notch, no buttons, no shadow. It runs off the bottom edge. My screenshot sits inside it.
- No logo, no subline, no other text.

HARD RULES
1. Run the script below as written. Only change a file path if an upload landed at a different path.
2. My screenshot is only scaled and cropped. Never redraw, restyle, recolour, sharpen, blur, retouch or "improve" it.
3. Never add or change text, numbers, UI, people, hands, props, gradients, glow, shadows, textures, sparkles, emoji, badges, ratings or icons.
4. If an attachment is missing or looks like the wrong screen for the card, say so in one line and wait.
5. If Python gives an error, or the Python tool is not available, reply with one line: "STOPPED: <reason>". Make nothing else. Never use the image generator for these cards.
6. Before every card, run the whole SCRIPT again (running it twice is safe). If /mnt/data/marc-headlines.png is missing, reply "Please re-attach marc-headlines.png." and wait.

SCRIPT
```python
import hashlib
from PIL import Image, ImageDraw, ImageStat
W, H, BAND = 1080, 1920, 420
BG, BODY, EDGE = "#08090a", "#1b1c1f", "#343536"
STRIP = "/mnt/data/marc-headlines.png"  # the uploaded headline strip
STRIP_SHA = "3a8fe76498639349a923f1a839f6f2003b311ab00675accbc1126917ee1ce932"

def headline(n):  # band n of the strip: the finished headline for card n
    s = Image.open(STRIP).convert("RGB")
    if s.size != (W, 8 * BAND) or hashlib.sha256(s.tobytes()).hexdigest() != STRIP_SHA:
        raise ValueError("marc-headlines.png was changed on upload. Re-attach it with Attach file.")
    return s.crop((0, BAND * (n - 1), W, BAND * n))

def phone(im, shot, x, y, w):
    b, r = 14, 80
    sw = w - 2 * b
    s = Image.open(shot).convert("RGB")
    if s.width < sw:
        raise ValueError(f"The screenshot is {s.width} px wide. Attach the original with Attach file.")
    s = s.resize((sw, round(s.height * sw / s.width)), Image.LANCZOS)  # scale only
    full = y + b + s.height <= H                                       # screen ends on the canvas?
    ImageDraw.Draw(im).rounded_rectangle([x, y, x + w, y + 2 * b + s.height if full else H + r],
                                         radius=r, fill=BODY, outline=EDGE, width=3)
    s = s.crop((0, 0, sw, min(s.height, H - y - b)))                   # crop at canvas bottom
    m = Image.new("L", s.size, 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, sw - 1, s.height - 1 if full else s.height + r],
                                        radius=r - b, fill=255)
    im.paste(s, (x + b, y + b), m)

def by_theme(shots):  # card 8: returns [Silent Black, Paper, Midnight] whatever the upload order
    look = []
    for p in shots:
        m = ImageStat.Stat(Image.open(p).convert("RGB")).mean
        look.append((sum(m) / 3, m[2] - m[0], p))       # (brightness, blue minus red, path)
    look.sort()
    black_or_navy, white = look[:2], look[2]
    black, navy = sorted(black_or_navy, key=lambda t: t[1])
    if len(shots) != 3 or white[0] - navy[0] < 80 or white[0] - black[0] < 80 or navy[1] - black[1] < 15:
        raise ValueError("Card 8 needs one Silent Black, one Paper and one Midnight screenshot of Today.")
    return [black[2], white[2], navy[2]]

def card(n, shots):
    im = Image.new("RGB", (W, H), BG)
    im.paste(headline(n), (0, 0))
    if n != 8:
        phone(im, shots[0], 150, 420, 780)
    else:
        black, white, navy = by_theme(shots)
        phone(im, white, -100, 620, 640)
        phone(im, navy, 540, 620, 640)
        phone(im, black, 170, 440, 740)
    out = f"/mnt/data/marc-card-{n}.png"
    im.save(out, "PNG")
    chk = Image.open(out)
    assert chk.size == (W, H) and chk.mode == "RGB"
    return out
```

CARDS
Card 1 (headline "Know what to lift next."). Screenshot: a live workout with one exercise open (set rows with kg and reps). Run card(1, [screenshot]).
Card 2 (headline "Your progress, lift by lift."). Screenshot: History > Stats with the weekly volume chart and an exercise trend line. Run card(2, [screenshot]).
Card 3 (headline "Check which muscles are ready."). Screenshot: the Body tab, a front and back muscle map. Run card(3, [screenshot]).
Card 4 (headline "Today’s plan, on one screen."). Screenshot: the Today tab (greeting, today's workout, readiness). Run card(4, [screenshot]).
Card 5 (headline "Coaching from your own log."). Screenshot: the Escobar tab scrolled to "Escobar’s notes". Run card(5, [screenshot]).
Card 6 (headline "See how your session went."). Screenshot: the finish screen ("... done"). Run card(6, [screenshot]).
Card 7 (headline "Share the work you put in."). Screenshot: the Share sheet with a poster preview. Run card(7, [screenshot]).
Card 8 (headline "Five themes. Pick yours."). THREE screenshots of the Today tab: one near-black (Silent Black), one white (Paper), one navy (Midnight), in any order. The script tells them apart by colour. Run card(8, [all three screenshots]).

FLOW
Make card 1 only. Then stop and wait. When I type nxt, make the next card, using the screenshot(s) I attach with it. If I type "redo N" with a new screenshot, make card N again.
Each reply: only the finished PNG (shown, with its download link) and one line, "Card N of 8". Nothing else.
````

Why the Python tool and not the image generator: OpenAI's own docs say the image model "can still struggle with precise text placement and clarity", so it would blur or rewrite the numbers on your screen. Pillow pastes your real screenshot pixel for pixel, and the headlines come ready-made from `marc-headlines.png`. It also hits exactly 1080 x 1920, which the image generator cannot output. If GPT ever replies STOPPED, send me the screenshots and I will build the cards with the same script.

## 5. Screenshots to take on your phone

Take every screenshot first (one per card and three for card 8; shot 4 can double as 8a), then start GPT. Every card uses your real screen; no card works without a screenshot. Use your real training log. The app has no demo mode, and Play requires the screens to match the real app.

**Phone prep (once)**
- Install the latest M/ARC build, the same one you will publish.
- In Android settings, set Display size and Font size to Default.
- Charge the phone. Clear every notification so the status bar shows only the time, signal and battery. Do Not Disturb adds its own small icon, so use it only if calls or messages keep arriving. The status bar stays in the shot; that's fine.
- In M/ARC (Settings is the gear icon on Today): Settings > Theme > **Silent Black**; Settings > Training > Show weights in > **kg**; Settings > Profile with a first name you are happy to show publicly (Today says "Good morning, <name>").
- Close the "Help the coach know you" sheet and answer the error-report banner, so neither covers a screen.
- Set a weekly schedule (Escobar tab > Weekly schedule > Edit) if you haven't.
- Readiness shows "calibrating" until it has check-ins on 14 different days (or 14 days of sleep from Health Connect). Do the Quick check-in every day for the next 2 weeks, rest days too: Train > Start > Quick check-in > Save, then close "Before you start". Take shots 4 and 8 after that. If it still says calibrating, it's real, but wait if you can.
- Use the normal screenshot buttons (Power + Volume down), not scrolling screenshots.
- The card cuts off about the bottom tenth of your screen, often through the tab bar or the "Ask Escobar" button. That's expected. Keep anything important above the bottom sixth.
- In ChatGPT, attach screenshots with "Attach file", not the photo picker, which may shrink them. The script stops if a screenshot is too small to fill the phone.

**Shot list** (numbered by card; Silent Black unless stated)

1. **Card 1, live workout.** Train > Start <your split> > Quick check-in (Save, if it asks) > Start. Log 1 or 2 exercises. Open the next exercise, log 2 sets and tap an effort button on each, and leave the 3rd set showing its pre-filled kg and reps. Take it with the open card in the top part of the screen. Needs 2 or 3 earlier sessions of this split. If the rest bar shows at the bottom, that's fine.
2. **Card 2, Stats.** History > Stats. In Exercise progress, pick your main lift with the clearest upward line. Scroll so the weekly volume chart is near the top and the Exercise progress card is below it. Best after 8 or more weeks of training.
3. **Card 3, recovery map.** Bottom nav > Body (Recovery view). Take it the day after a session, with a different split trained 2 or 3 days before, so the map mixes colours. Keep the map and "Ready times" in view.
4. **Card 4, Today.** On a scheduled training day, before you train: Train > Start > Quick check-in > Save, then close the "Before you start" sheet without starting. Go to Today and take the top of the screen: greeting, streak, "Scheduled today", Readiness, This week.
5. **Card 5, coach notes.** Bottom nav > Escobar, scrolled so "Escobar’s notes" are at the top. Escobar can stay off. Best with 3 or 4 notes showing (3 to 6 weeks of rated sessions).
6. **Card 6, finish screen.** At the end of the workout from shot 1: Finish > Finish. Take the "<Split> done" screen straight away, scrolled to the top, because it only shows right after finishing.
7. **Card 7, share.** Late in the week, after 3 or 4 sessions: History > Stats > share icon (top right) > **Week** > **Poster** > **9:16**. No photo behind it.
8. **Card 8, themes (3 shots).** Right after shot 4, on the same Today screen: shot 8a is the Silent Black one (you can reuse shot 4). Settings > Theme > **Paper**, back to Today, shot 8b. Settings > Theme > **Midnight**, shot 8c. Switch back to Silent Black. Never screenshot the theme picker itself.

**Easiest order on one training day:** in the morning take 3, 4 and 8 (and 2 and 5). Then train, taking 1 during the workout and 6 at the end. Take 7 late in the week.

**What to attach with each message to GPT**
- First message: master prompt + `marc-headlines.png` + shot 1 → card 1
- nxt + shot 2 → card 2
- nxt + shot 3 → card 3
- nxt + shot 4 → card 4
- nxt + shot 5 → card 5
- nxt + shot 6 → card 6
- nxt + shot 7 → card 7
- nxt + shots 8a, 8b, 8c, any order → card 8

## 6. Before you upload to Play

- 8 files, each exactly 1080 x 1920 PNG. Save each card with GPT's download link, not by long-pressing the picture, and check the file info on each.
- Upload them in order 1 to 8. Drag to reorder in Play Console if needed.
- Read every headline against section 3, word for word, full stop included.
- Zoom in on each phone screen. It must match your screenshot exactly: same words, same numbers, nothing redrawn.
- Every screen must still match the build you publish. If a screen changes before release, retake that shot and type "redo N".
- Nothing banned: no ratings, "#1", "best", "free", "new", prices or awards, no other companies' names (the theme picker stays out), and no Escobar cost or server address.
- Your first name on Today will be public. Make sure you are fine with that.
- The AI chat is not in this set. The app has no way to report a bad Escobar answer yet, and Google Play asks AI apps to have one. This applies to the release itself, not only these cards, so a Report button for Escobar answers is needed before publishing with Escobar available. Once it ships, the chat card can come back as "Stuck on a lift? Ask Escobar."
- If you later add other languages, Play wants separate cards per language. Ask me for translated headlines then.

---
Files (all in docs/store/ on branch claude/play-store-cards):
- PLAY-STORE-SCREENSHOTS.md: this document.
- marc-headlines.png: 1080 x 3360 RGB PNG, 8 bands of 420 px, rendered here with Pillow 12.3 + raqm (full kerning). The owner attaches it to GPT; it needs to be sent to the owner. card.py checks its pixel SHA-256 (3a8fe764...ce932), so a re-encoded upload stops with a clear message.
- card.py: byte-identical to the script in section 4. Tested here on real app screens captured from the web build (Today in Silent Black, Paper and Midnight; Body in Silent Black) at 1080x2340 and 1080x2280, plus crops to 1080x2160 and 1080x1920: all 8 cards give 1080x1920 RGB PNGs; card 8 gives the same image for all 6 upload orders; a 540 px screenshot, two dark screenshots on card 8, and a JPEG-recoded strip each stop with their error. Not run in ChatGPT's own sandbox (unknown Pillow version; it uses only Image, ImageDraw.rounded_rectangle, ImageStat and hashlib, all in Pillow 8.2+).
- Inter-SemiBold.ttf: the source font for the strip (display cut, wght 600, OFL). Its name table now says Inter SemiBold. The owner no longer needs it.
- Change beyond the review: card 8's front phone moved to x 170, 740 px wide, because at 700 px a 19.5:9 screenshot stopped 10 px above the canvas edge with square screen corners. phone() now draws a full rounded phone whenever the screen ends on the canvas, which removes that gap for any screenshot shape.

Reviewer notes not applied
- Card 3 line break: used "Check which / muscles are ready." instead of "Check which muscles / are ready.", because the lines balance (447 and 641 px) instead of leaving a short last line.
