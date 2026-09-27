# Dumbbell Lateral Raise player: drop-in pieces

Built by `node build.mjs` from the final rig (`../rig-final/lateral-raise.html`, made by `rig-final/gen.mjs`) and `logic.js`. The harness `index.html` is built from the very same strings, so every piece below is what the screenshots in `shots/` show. Do not edit these pieces by hand: change `rig-final/gen.mjs` or `build.mjs` and rebuild.

## In plain words

- A person seen from the front, standing tall with a dumbbell in each hand beside the thighs, elbows a little bent. Both arms lift out to the sides in 1 second until they are level with the shoulders, hold for half a second, lower slowly over 2 seconds, and rest for half a second. The shoulders never lift toward the ears, the body never swings, and the small bend in the elbows never changes. Three reps, then it stops and offers Replay.
- A blue line grows along each hand's path, from the start to where the hand is now, so a beginner can see how high to go and where to stop.
- Three close-ups (Shoulders, Path, Elbows): the camera glides in, a line or ring marks the thing to look at, and a short tip shows at the bottom.
- "Pictures" shows four key moments of one rep as still drawings, made from the same drawing as the animation. A phone set to reduce motion always gets the pictures instead of movement.
- Everything that changes is driven by one class string and one style string on the outer box. Nothing is built by script.

## 1. Files

| File | What it is |
|---|---|
| `index.html` | Harness: the full player, built the way the artboard is. Query: `?theme=<id>&t=<0..1>&zoom=1\|2\|3&mode=pictures&loop=1&autoplay=0&speed=0.5`. `t` freezes rep 1 at that point. `zoom` also takes `shoulders`, `path`, `elbows`. |
| `logic.js` | The artboard's logic class (`class Component extends DCLogic`). Pasted as is (section 10). |
| `build.mjs` | Builds `index.html` and this file. |
| `shoot.cjs` | Checks and screenshots (`shots/`). Exits 1 on any failure; writes `checks.txt`. |

## 2. What the logic must set

Only two holes carry state into the picture: the root `class` and the root `style`. Everything else is a plain `sc-if` flag or a click handler.

Root element:

```html
<div class="{{ rootClass }}" style="width: 358px; height: 460px; box-sizing: border-box; {{ rootStyle }}">
```

`rootStyle` = `themeVars(theme)` + `;` + `rigVars(theme)` + `;--play:<p>;--dur:<d>s;--iter:<i>;--sets:<s>;--delay:0s`

| Variable | Values | Meaning |
|---|---|---|
| `--play` | `running` or `paused` | running only while playing in Animation mode |
| `--dur` | `4s` at 1x, `8s` at 0.5x | one rep |
| `--iter` | `3` (loop off) or `infinite` | figure, dumbbells, trail and captions: 3 reps, then the last frame (= setup pose) holds |
| `--sets` | `1` (loop off) or `infinite` | the rep pill runs one 3-rep cycle |
| `--delay` | `0s` | always 0 from the logic. The CSS sets its own value for Pictures tiles and stills (section 5) |
| `--sw` | not set by the logic | stroke scale: 1 on the stage (CSS default), 0.75 in Pictures tiles (on each `<use>`) |

`rootClass` = `player gen-<a|b>` + ` zoom-<1|2|3>` when a chip is on + ` pictures` in Pictures mode.

| Class | Set when | What the CSS does |
|---|---|---|
| `gen-a` / `gen-b` | flips on Play after the end (Replay), on a speed change, on a mode change, and when a Pictures still opens or closes | picks the `-a` or `-b` keyframe set, which restarts every animation from 0 % (the setup pose). The two sets are identical (checked). |
| `zoom-1` | Shoulders chip on | camera `translate(179px,138px) scale(2.2) translate(-179px,-90px)`; accent guide lines over both shoulder slopes and two "keep down" arrows; bubble 1 |
| `zoom-2` | Path chip on | camera `translate(179px,138px) scale(1.2) translate(-179px,-135px)`; the always-on dashed hand paths and growing trails; bubble 2 |
| `zoom-3` | Elbows chip on | camera `translate(179px,138px) scale(2.2) translate(-179px,-113px)`; an accent ring on each elbow, moving with the arm; bubble 3 |
| any `zoom-N` | | rep pill row and camera label hide; camera glides in 320 ms `cubic-bezier(.32,.72,0,1)`; overlay fades in 150 ms |
| `pictures` | Pictures mode | the 2 x 2 grid of key poses covers the stage; with a `zoom-N` as well, the grid hides and the stage shows one still (section 5) |

Every other value the markup reads from `renderVals()` (`sc-if` flags, `aria-*` values and click handlers; all in `logic.js`): `showSlow`, `showIdle`, `showEnded`, `showCaps`, `showStill1`, `showStill3`, `showPicsLine`, `showTempo`, `z1`, `pick1`, `z2`, `pick2`, `z3`, `pick3`, `playLabel`, `togglePlay`, `playDisabled`, `isPlay`, `isPause`, `isReplay`, `speed1`, `speedTo1`, `speedHalf`, `speedToHalf`, `modeAnim`, `toAnim`, `animDisabled`, `modePics`, `toPics`, `hintAnim`, `hintPics`, `hintRm`.

| Flag | True when |
|---|---|
| `showSlow` | Animation mode at 0.5x ("Slow motion" pill) |
| `showIdle` | Animation mode before the first Play ("Tap Play to watch 3 slow reps.") |
| `showEnded` | after the 3 reps with loop off ("Done. Tap Replay to watch again.") |
| `showCaps` | Animation mode, playing or paused mid-set (the 4 phase captions) |
| `showStill1`, `showStill3` | a Pictures still is open: pose 1 (Shoulders, Elbows) shows "Stand tall, elbows soft", pose 3 (Path) shows "Stop at shoulder height", the same words as that picture's tile |
| `showPicsLine` | Pictures grid showing ("Raise 1 s, pause, lower 2 s") |
| `showTempo` | Animation mode only ("1 s up · 2 s down"). Pictures mode, grid or still, has no tempo note, as on Machine Chest Press and Lat Pulldown |
| `isPlay`, `isPause`, `isReplay`, `playLabel`, `playDisabled` | Play button icon, `aria-label` and disabled state (disabled under reduced motion) |
| `z1`, `z2`, `z3` | `aria-pressed` of the Shoulders, Path and Elbows chips |
| `speed1`, `speedHalf`, `modeAnim`, `modePics`, `animDisabled` | segment buttons |
| `hintAnim`, `hintPics`, `hintRm` | which hint line shows |

The 200 ms timer in `logic.js` ends playback after 3 x `--dur` with loop off (`playing: false, ended: true`); it is cleared in `componentWillUnmount`.

## 3. Rep timing and phase captions

One rep = `--dur` (4 s at 1x). The easing is baked into the keyframe samples (every 1.25 % in the raise, every 3.125 % in the lowering), so every figure keyframe plays `linear` between samples.

| Rep % | Time at 1x | Phase | Movement | Caption (`capx` span) | Keyframe window |
|---|---|---|---|---|---|
| 0 - 25 | 0 - 1.0 s | Raise | both arms out to the sides, from 12 to 88 degrees (50 degrees at 12.5 %); ease in, then ease out | c1 "Raise to shoulder height, 1 s" | `cap1`: 0 % 1, 25 % 0 |
| 25 - 37.5 | 1.0 - 1.5 s | Pause | still, arms level with the shoulders, shoulders down | c2 "Pause, shoulders down" | `cap2`: 25 % 1, 37.5 % 0 |
| 37.5 - 87.5 | 1.5 - 3.5 s | Lower | back to the sides (50 degrees at 62.5 %); ease in, then ease out | c3 "Lower slowly, 2 s" | `cap3`: 37.5 % 1, 87.5 % 0 |
| 87.5 - 100 | 3.5 - 4.0 s | Reset | still, weights beside the thighs | c4 "Reset at your sides" | `cap4`: 87.5 % 1, 100 % 1 |

Captions use `animation-timing-function: step-end` (class `capx`), so each one switches on and off exactly at its window edges. The rep pill (`repx r1..r3`) runs over `calc(var(--dur) * 3)` and switches at 33.333 % and 66.667 %. Caption, pill and figure share `--play`, `--dur`, `--delay` and the `gen` class, so they cannot drift apart. Tempo note: "1 s up · 2 s down".

Movement numbers (checked against the spec's truth table, section 3.5; solved in `rig-final/gen.mjs`, measured again in the browser by `shoot.cjs`):

| Joint | Setup (0 %, 87.5 %, 100 %) | Mid (12.5 %, 62.5 %) | Top (25 - 37.5 %) | Truth table |
|---|---|---|---|---|
| Shoulder, arm out to the side (A) | 12 | 50 | 88 | about 10-15, then 85-90; never above shoulder height |
| Elbow inside angle | 165 | 165 | 165 | soft bend about 15 degrees, fixed |
| Wrist and dumbbell | level | level | level | straight, fixed (the dumbbell counter-rotates, so it stays level on screen) |
| Shoulder joints (stage) | (157, 94) and (201, 94) | same | same | fixed height, no shrug |
| Torso, hips, knees, feet, head | upright | upright | upright | fixed, no swing |
| Screen-right grip (stage) | (206.8, 171.1) | (253.1, 151.2) | (277.2, 107.0) | spec: (206.8, 171.2) to (277.2, 107) |
| Top grip against the shoulder line | | | 13.0 below | hands a little below the elbows at the top |

Screen-right arm: `rotate(-A)` about (22, -62) in rig units (stage (201, 94)); screen-left: `rotate(+A)` about (-22, -62). Forearms: a static `rotate(15deg)` / `rotate(-15deg)` about the elbow. Dumbbells: `rotate(A - 15)` / `rotate(15 - A)` about the grip, so they stay level.

Animated groups (each has an identical `-a` and `-b` keyframe set): `cap1`, `cap2`, `cap3`, `cap4`, `rep1`, `rep2`, `rep3`, `lr-ua-r`, `lr-ua-l`, `lr-db-r`, `lr-db-l`, `lr-trail`, `lr-eff`.

## 4. Zoom states

| Root class | Chip | Camera centre, scale | Overlay | Bubble text | Still in Pictures |
|---|---|---|---|---|---|
| `zoom-1` | Shoulders | 179, 90, 2.2 | accent lines lifted just off both shoulder slopes (`.ov-shoulders`) and two down arrows over the shoulders | Keep your shoulders down, away from your ears. No shrug. | pose 1 (0 %) |
| `zoom-2` | Path | 179, 135, 1.2 | the always-on dashed hand paths and growing trails | Out to the sides and up to shoulder height, no higher. | pose 3 (31 %) |
| `zoom-3` | Elbows | 179, 113, 2.2 | an accent ring r 8 on each elbow, inside the arm groups so it follows the elbow (`.ov-elbows`) | A soft bend in your elbows that stays the same up and down. | pose 1 (0 %) |

The animation keeps running while zoomed. Each chip's subject stays inside the stage and above the bubble for the whole rep (checked at 41 phases, section 11).

Chips differ from spec 3.5 on purpose, as the final rig decided (RIG.md sections 15 and 17): Grip (242, 139, 2.0) became Shoulders (179, 90, 2.2), because from the front the hands sit behind the end-on dumbbells, so a grip cue cannot be shown, while shrugging is a listed common mistake that this view shows well; Path moved from (179, 120, 1.25) to (179, 135, 1.2), because at 120 the bottom of the path sat under the bubble; Elbows moved from (224, 113) to (179, 113), because at 224 the screen-left elbow left the stage near the top of the rep. The head centre is (179, 73), not 77, so the chin does not cover the neck. The dumbbell end face is a hex of r 8 (squashed to 0.92 tall), the rig's size, not r 7.

## 5. Pictures mode and stills

- Root class `pictures`: the grid (`.pics`, always in the markup, never inside an `sc-if`) covers the stage. Four tiles, each a `<use href="#rig-lr">` of the one rig with its own `--play:paused;--sw:.75;--delay:calc(var(--dur) * -<pose>)`, cropped to the scene box 66 56 226 208. Key poses: 1 = 0 %, 2 = 12.5 %, 3 = 31 %, 4 = 62.5 %. Tiles 2 (up) and 4 (down) carry a direction arrow beside the screen-right hand.
- Captions: 1 "Stand tall, elbows soft"; 2 "Lift out to the sides"; 3 "Stop at shoulder height"; 4 "Lower slowly, 2 s".
- `pictures zoom-N`: the grid hides and the stage shows one still at that zoom. The CSS pauses the stage and caption row and, for Path, moves them to pose 3: `.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}`. The logic flips `gen` when a still opens or closes, so the paused animation restarts from 0 before the delay applies.
- The caption line under a still shows that pose's picture caption, not the phase caption of the frame: "Stand tall, elbows soft" for Shoulders and Elbows (pose 1), "Stop at shoulder height" for Path (pose 3). The phase captions (`showCaps`) belong to the animation only, as on Machine Chest Press and Lat Pulldown.
- The logic pauses everything in Pictures mode (`--play: paused`); the CSS pauses the stage there too, as a second guard.

## 6. Reduced motion

```css
@media (prefers-reduced-motion: reduce){
  .anim,.capx,.repx{animation-play-state:paused!important}                    /* element level: the root style hole cannot undo it */
  .player:not(.zoom-1):not(.zoom-2):not(.zoom-3) .pics{display:grid!important} /* the key poses, never a blank or frozen frame */
  .cam,.ov{transition:none!important}
  .pill-row{display:none!important}
}
```

- The logic reads `matchMedia('(prefers-reduced-motion: reduce)')` once in its constructor: it starts in Pictures mode, disables Play and "Animation", and shows the hint "Pictures shown because your phone is set to reduce motion." Zoom chips still open stills, with no camera glide.
- A root-level `--play: paused` in the media query is not enough, because the root's inline style wins; the element-level rule above is what holds it (checked with the root forced to `running`).
- The real app keys this off `html[data-motion="reduce"]` and `reduced()` from `src/ui/motion.ts` (spec 2.8).

## 7. Artboard skeleton (`project/Player-DumbbellLateralRaise.dc.html`)

Sections 8, 9 and 10 fill the marked places. The `data-props` follow spec 2.1 (standalone on the canvas it autoplays and loops; About imports it with `autoplay` and `loop` off, so it runs 3 reps and offers Replay). SVG shapes use `/>`, which is valid inside `<svg>`; every HTML element is closed.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Dumbbell Lateral Raise form guide</title>
<script src="./support.js"></script>
</head>
<body>
<x-dc>
<helmet>
<style>
/* the complete CSS from section 8 goes here */
</style>
</helmet>
<div class="{{ rootClass }}" style="width: 358px; height: 460px; box-sizing: border-box; {{ rootStyle }}">
<div class="stage">
<!-- stage SVG: section 9.1 -->
<div class="pill-row"><span class="pill"><span class="stack"><span class="repx r1">Rep 1 of 3</span><span class="repx r2">Rep 2 of 3</span><span class="repx r3">Rep 3 of 3</span></span></span><sc-if value="{{ showSlow }}" hint-placeholder-val="{{ true }}"><span class="pill pill-accent">Slow motion</span></sc-if></div>
<div class="cam-label">Front view</div>
<!-- Pictures grid: section 9.2 -->
<!-- caption bubbles: section 9.3 -->
</div>
<div class="cap-row"><span class="cap"><sc-if value="{{ showIdle }}" hint-placeholder-val="{{ true }}"><span>Tap Play to watch 3 slow reps.</span></sc-if><sc-if value="{{ showEnded }}" hint-placeholder-val="{{ true }}"><span>Done. Tap Replay to watch again.</span></sc-if><sc-if value="{{ showCaps }}" hint-placeholder-val="{{ true }}"><span class="stack"><span class="capx c1">Raise to shoulder height, 1 s</span><span class="capx c2">Pause, shoulders down</span><span class="capx c3">Lower slowly, 2 s</span><span class="capx c4">Reset at your sides</span></span></sc-if><sc-if value="{{ showStill1 }}" hint-placeholder-val="{{ true }}"><span>Stand tall, elbows soft</span></sc-if><sc-if value="{{ showStill3 }}" hint-placeholder-val="{{ true }}"><span>Stop at shoulder height</span></sc-if><sc-if value="{{ showPicsLine }}" hint-placeholder-val="{{ true }}"><span>Raise 1 s, pause, lower 2 s</span></sc-if></span><sc-if value="{{ showTempo }}" hint-placeholder-val="{{ true }}"><span class="tempo">1 s up · 2 s down</span></sc-if></div>
<div class="chips"><button class="chip chip-btn" type="button" aria-pressed="{{ z1 }}" onClick="{{ pick1 }}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Shoulders</button><button class="chip chip-btn" type="button" aria-pressed="{{ z2 }}" onClick="{{ pick2 }}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Path</button><button class="chip chip-btn" type="button" aria-pressed="{{ z3 }}" onClick="{{ pick3 }}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Elbows</button></div>
<div class="controls">
<button class="btn-icon" type="button" aria-label="{{ playLabel }}" onClick="{{ togglePlay }}" disabled="{{ playDisabled }}"><sc-if value="{{ isPlay }}" hint-placeholder-val="{{ true }}"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg></span></sc-if><sc-if value="{{ isPause }}" hint-placeholder-val="{{ true }}"><span><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14M16 5v14"/></svg></span></sc-if><sc-if value="{{ isReplay }}" hint-placeholder-val="{{ true }}"><span><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg></span></sc-if></button>
<div class="seg speed"><button type="button" aria-pressed="{{ speed1 }}" onClick="{{ speedTo1 }}">1x</button><button type="button" aria-pressed="{{ speedHalf }}" onClick="{{ speedToHalf }}">0.5x</button></div>
<span class="grow"></span>
<div class="seg mode"><button type="button" aria-pressed="{{ modeAnim }}" onClick="{{ toAnim }}" disabled="{{ animDisabled }}">Animation</button><button type="button" aria-pressed="{{ modePics }}" onClick="{{ toPics }}">Pictures</button></div>
</div>
<p class="hint"><sc-if value="{{ hintAnim }}" hint-placeholder-val="{{ true }}"><span>Tap a zoom chip to look closer. Tap it again to zoom out.</span></sc-if><sc-if value="{{ hintPics }}" hint-placeholder-val="{{ true }}"><span>Four key moments of one rep.</span></sc-if><sc-if value="{{ hintRm }}" hint-placeholder-val="{{ true }}"><span>Pictures shown because your phone is set to reduce motion.</span></sc-if></p>
<p class="sr">One rep: raise your arms out to the sides for 1 second, pause, lower slowly for 2 seconds, reset.</p>
</div>
</x-dc>
<script type="text/x-dc" data-dc-script data-props='{"theme":{"editor":"enum","options":["silent-black","paper","ember","emerald","midnight"],"default":"silent-black"},"autoplay":{"editor":"boolean","default":true},"loop":{"editor":"boolean","default":true},"$preview":{"width":358,"height":460}}'>
/* section 10 */
</script>
</body>
</html>
```

## 8. The complete CSS for `<helmet><style>`

```css
body{margin:0;font-family:Inter,"SF Pro Text",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
[hidden]{display:none!important}
.player{--play:running;--dur:4s;--iter:infinite;--sets:infinite;--delay:0s;--sw:1;
  --fg-line:color-mix(in srgb,var(--text) 60%,var(--surface-1));
  --fg-line-far:color-mix(in srgb,var(--text) 30%,var(--surface-1));
  --fg-metal:color-mix(in srgb,var(--text) 72%,var(--surface-1));
  --fg-cable:color-mix(in srgb,var(--text) 55%,var(--surface-1));
  --body:color-mix(in srgb,var(--map-body) 88%,var(--text));
  --body-facet:color-mix(in srgb,var(--map-body) 78%,var(--text));
  --body-far:color-mix(in srgb,var(--map-body) 50%,var(--surface-1));
  --muscle-main:var(--accent);
  --muscle-help:color-mix(in srgb,var(--accent) 45%,var(--body));
  --equip:var(--surface-3);
  position:relative;width:358px;height:460px;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;
  background:var(--surface-2);color:var(--text);font-family:Inter,"SF Pro Text",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
.stage{position:relative;flex:none;width:358px;height:276px;background:var(--surface-1);border-radius:var(--radius-lg);overflow:hidden}
.stage::after{content:"";position:absolute;inset:0;border:1px solid var(--border-subtle);border-radius:inherit;pointer-events:none}
.scene{position:absolute;left:0;top:0;width:358px;height:276px;display:block}
.cam{transform-box:view-box;transform-origin:0 0;transition:transform 320ms cubic-bezier(.32,.72,0,1)}
.pill-row{position:absolute;top:10px;left:10px;display:flex;gap:6px}
.pill{display:inline-grid;font-size:12px;line-height:16px;font-weight:600;color:var(--text-2);background:var(--surface-2);border-radius:999px;padding:3px 8px}
.pill-accent{background:var(--accent-soft);color:var(--accent)}
.cam-label{position:absolute;top:12px;right:12px;font-size:11px;line-height:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2)}
.stack{display:inline-grid}.stack>span{grid-area:1/1;white-space:nowrap}
.bubble{position:absolute;left:12px;right:12px;bottom:12px;display:none;gap:8px;align-items:flex-start;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:8px 12px;font-size:13px;line-height:18px;color:var(--text)}
.bubble .dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px}
.zoom-1 .bub-1,.zoom-2 .bub-2,.zoom-3 .bub-3{display:flex}
.zoom-1 .pill-row,.zoom-2 .pill-row,.zoom-3 .pill-row,.zoom-1 .cam-label,.zoom-2 .cam-label,.zoom-3 .cam-label{display:none}
.pics{position:absolute;inset:1px;display:none;padding:6px;gap:6px;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,128px);background:var(--surface-1);border-radius:var(--radius-lg)}
.pictures .pics{display:grid}
.pictures.zoom-1 .pics,.pictures.zoom-2 .pics,.pictures.zoom-3 .pics{display:none}
.tile{position:relative;display:flex;flex-direction:column;background:var(--surface-2);border-radius:var(--radius-md);overflow:hidden}
.tile svg{display:block;width:169px;height:90px;flex:none}
.tile p{margin:0;padding:0 8px 6px;font-size:12px;line-height:16px;color:var(--text-2);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.badge{position:absolute;top:6px;left:6px;width:18px;height:18px;border-radius:50%;background:linear-gradient(var(--accent-soft),var(--accent-soft)),var(--surface-2);box-shadow:0 0 0 2px var(--surface-2);color:var(--accent);font-size:11px;line-height:18px;font-weight:700;text-align:center}
.cap-row{flex:none;display:flex;align-items:baseline;justify-content:space-between;gap:8px;height:20px}
.cap{font-size:15px;line-height:20px;font-weight:600;color:var(--text);white-space:nowrap}
.tempo{font-size:12px;line-height:16px;color:var(--text-2);white-space:nowrap}
.chips{flex:none;display:flex;align-items:center;gap:8px;height:44px}
.chip{display:inline-flex;align-items:center;gap:6px;min-height:36px;padding:6px 12px;box-sizing:border-box;border-radius:999px;border:1px solid var(--border);background:var(--surface-2);color:var(--text-2);font:600 12px/16px inherit;font-family:inherit;cursor:pointer;position:relative}
.chip::before{content:"";position:absolute;inset:-4px 0}
.chip[aria-pressed="true"]{background:var(--text);color:var(--bg);border-color:var(--text)}
.chip svg{width:14px;height:14px}
.controls{flex:none;display:flex;align-items:center;gap:8px;height:44px}
.btn-icon{flex:none;width:44px;height:44px;border-radius:50%;border:0;background:var(--accent);color:var(--on-accent);display:inline-flex;align-items:center;justify-content:center;cursor:pointer;padding:0}
.btn-icon svg{width:20px;height:20px}
.btn-icon:disabled,.seg button:disabled{opacity:.45;cursor:default}
.seg{flex:none;display:flex;gap:2px;padding:3px;box-sizing:border-box;background:var(--surface-2);border:1px solid var(--border-subtle);border-radius:var(--radius-md)}
.seg button{flex:1 1 0;min-height:34px;border:0;background:transparent;color:var(--text-2);font:600 13px/16px inherit;font-family:inherit;border-radius:calc(var(--radius-md) - 3px);cursor:pointer;position:relative;padding:0 6px}
.seg button::before{content:"";position:absolute;inset:-5px 0}
.seg button[aria-pressed="true"]{background:var(--surface-1);color:var(--text);box-shadow:0 1px 2px color-mix(in srgb,var(--scrim) 36%,transparent)}
.speed{width:104px}.mode{width:184px}.grow{flex:1 1 auto}
.hint{flex:none;margin:0;font-size:12px;line-height:16px;color:var(--text-2);min-height:36px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}
/* ---- figure paint (every value is a token or a color-mix of tokens) ---- */
.b{fill:var(--body)}
.bf{fill:var(--body-far)}
.olk{fill:none;stroke:var(--fg-line);stroke-width:calc(var(--sw) * 3px);stroke-linejoin:round}
.olkf{fill:none;stroke:var(--fg-line-far);stroke-width:calc(var(--sw) * 2.4px);stroke-linejoin:round}
.fc{fill:var(--body-facet);stroke:var(--map-line);stroke-width:.6px;stroke-linejoin:round}
.mm{fill:var(--muscle-main);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}
.mh{fill:var(--muscle-help);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}
/* ---- equipment paint ---- */
.eq{fill:var(--equip);stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.eqm{fill:var(--equip);stroke:var(--fg-metal);stroke-width:calc(var(--sw) * 1.2px);stroke-linejoin:round}
.eqf{fill:var(--body-far);stroke:var(--fg-line-far);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.hd{fill:var(--fg-metal)}
.hdf{fill:var(--fg-line-far)}
.pin{fill:var(--accent)}
.rod{fill:none;stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px)}
.cable{fill:none;stroke:var(--fg-cable);stroke-width:calc(var(--sw) * 1.25px);stroke-linecap:round}
.floor{stroke:var(--border);stroke-width:1px}
.b,.bf,.olk,.olkf,.fc,.mm,.mh,.eq,.eqm,.eqf,.rod,.cable,.floor{vector-effect:non-scaling-stroke}
/* ---- guides: path, progress trail, zoom overlays, arrows (accent) ---- */
.guide{fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4 3;opacity:.6}
.trail{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-dasharray:1 1}
.ov{opacity:0;transition:opacity 150ms linear}
.ovs{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arrow{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arrow-head{fill:var(--accent)}
/* ---- motion ---- */
.j{transform-box:view-box}
.anim{animation-duration:var(--dur);animation-delay:var(--delay);animation-play-state:var(--play);animation-iteration-count:var(--iter);animation-fill-mode:both;animation-timing-function:linear}
.capx{animation-duration:var(--dur);animation-delay:var(--delay);animation-play-state:var(--play);animation-iteration-count:var(--iter);animation-fill-mode:both;animation-timing-function:step-end}
.repx{animation-duration:calc(var(--dur) * 3);animation-delay:var(--delay);animation-play-state:var(--play);animation-iteration-count:var(--sets);animation-fill-mode:both;animation-timing-function:step-end}
@keyframes cap1-a{0%{opacity:1}25%{opacity:0}100%{opacity:0}}
@keyframes cap1-b{0%{opacity:1}25%{opacity:0}100%{opacity:0}}
@keyframes cap2-a{0%{opacity:0}25%{opacity:1}37.5%{opacity:0}100%{opacity:0}}
@keyframes cap2-b{0%{opacity:0}25%{opacity:1}37.5%{opacity:0}100%{opacity:0}}
@keyframes cap3-a{0%{opacity:0}37.5%{opacity:1}87.5%{opacity:0}100%{opacity:0}}
@keyframes cap3-b{0%{opacity:0}37.5%{opacity:1}87.5%{opacity:0}100%{opacity:0}}
@keyframes cap4-a{0%{opacity:0}87.5%{opacity:1}100%{opacity:1}}
@keyframes cap4-b{0%{opacity:0}87.5%{opacity:1}100%{opacity:1}}
@keyframes rep1-a{0%{opacity:1}33.333%{opacity:0}100%{opacity:0}}
@keyframes rep1-b{0%{opacity:1}33.333%{opacity:0}100%{opacity:0}}
@keyframes rep2-a{0%{opacity:0}33.333%{opacity:1}66.667%{opacity:0}100%{opacity:0}}
@keyframes rep2-b{0%{opacity:0}33.333%{opacity:1}66.667%{opacity:0}100%{opacity:0}}
@keyframes rep3-a{0%{opacity:0}66.667%{opacity:1}100%{opacity:1}}
@keyframes rep3-b{0%{opacity:0}66.667%{opacity:1}100%{opacity:1}}
.gen-a .c1{animation-name:cap1-a}.gen-b .c1{animation-name:cap1-b}.gen-a .c2{animation-name:cap2-a}.gen-b .c2{animation-name:cap2-b}.gen-a .c3{animation-name:cap3-a}.gen-b .c3{animation-name:cap3-b}.gen-a .c4{animation-name:cap4-a}.gen-b .c4{animation-name:cap4-b}
.gen-a .r1{animation-name:rep1-a}.gen-b .r1{animation-name:rep1-b}.gen-a .r2{animation-name:rep2-a}.gen-b .r2{animation-name:rep2-b}.gen-a .r3{animation-name:rep3-a}.gen-b .r3{animation-name:rep3-b}
/* ---- reduced motion: cannot be overridden by the root style hole ---- */
@media (prefers-reduced-motion: reduce){
  .anim,.capx,.repx{animation-play-state:paused!important}
  .player:not(.zoom-1):not(.zoom-2):not(.zoom-3) .pics{display:grid!important}
  .cam,.ov{transition:none!important}
  .pill-row{display:none!important}
}


.lr-ua-r{transform-origin:22px -62px}.gen-a .lr-ua-r{animation-name:lr-ua-r-a}.gen-b .lr-ua-r{animation-name:lr-ua-r-b}
.lr-ua-l{transform-origin:-22px -62px}.gen-a .lr-ua-l{animation-name:lr-ua-l-a}.gen-b .lr-ua-l{animation-name:lr-ua-l-b}
.lr-fa-r{transform-origin:22px -24px;transform:rotate(15deg)}
.lr-fa-l{transform-origin:-22px -24px;transform:rotate(-15deg)}
.lr-db-r{transform-origin:22px 16px}.gen-a .lr-db-r{animation-name:lr-db-r-a}.gen-b .lr-db-r{animation-name:lr-db-r-b}
.lr-db-l{transform-origin:-22px 16px}.gen-a .lr-db-l{animation-name:lr-db-l-a}.gen-b .lr-db-l{animation-name:lr-db-l-b}
.gen-a .lr-trail{animation-name:lr-trail-a}.gen-b .lr-trail{animation-name:lr-trail-b}
.gen-a .lr-eff{animation-name:lr-eff-a}.gen-b .lr-eff{animation-name:lr-eff-b}
@keyframes lr-ua-r-a{0%{transform:rotate(-12deg)}1.25%{transform:rotate(-12.7deg)}2.5%{transform:rotate(-14.51deg)}3.75%{transform:rotate(-17.17deg)}5%{transform:rotate(-20.48deg)}6.25%{transform:rotate(-24.34deg)}7.5%{transform:rotate(-28.68deg)}8.75%{transform:rotate(-33.42deg)}10%{transform:rotate(-38.56deg)}11.25%{transform:rotate(-44.06deg)}12.5%{transform:rotate(-50deg)}13.75%{transform:rotate(-55.94deg)}15%{transform:rotate(-61.44deg)}16.25%{transform:rotate(-66.58deg)}17.5%{transform:rotate(-71.32deg)}18.75%{transform:rotate(-75.66deg)}20%{transform:rotate(-79.52deg)}21.25%{transform:rotate(-82.83deg)}22.5%{transform:rotate(-85.49deg)}23.75%{transform:rotate(-87.3deg)}25%{transform:rotate(-88deg)}37.5%{transform:rotate(-88deg)}40.63%{transform:rotate(-86.94deg)}43.75%{transform:rotate(-84.25deg)}46.88%{transform:rotate(-80.4deg)}50%{transform:rotate(-75.66deg)}53.13%{transform:rotate(-70.18deg)}56.25%{transform:rotate(-64.06deg)}59.38%{transform:rotate(-57.35deg)}62.5%{transform:rotate(-50deg)}65.63%{transform:rotate(-42.65deg)}68.75%{transform:rotate(-35.94deg)}71.88%{transform:rotate(-29.82deg)}75%{transform:rotate(-24.34deg)}78.13%{transform:rotate(-19.6deg)}81.25%{transform:rotate(-15.75deg)}84.38%{transform:rotate(-13.06deg)}87.5%{transform:rotate(-12deg)}100%{transform:rotate(-12deg)}}
@keyframes lr-ua-r-b{0%{transform:rotate(-12deg)}1.25%{transform:rotate(-12.7deg)}2.5%{transform:rotate(-14.51deg)}3.75%{transform:rotate(-17.17deg)}5%{transform:rotate(-20.48deg)}6.25%{transform:rotate(-24.34deg)}7.5%{transform:rotate(-28.68deg)}8.75%{transform:rotate(-33.42deg)}10%{transform:rotate(-38.56deg)}11.25%{transform:rotate(-44.06deg)}12.5%{transform:rotate(-50deg)}13.75%{transform:rotate(-55.94deg)}15%{transform:rotate(-61.44deg)}16.25%{transform:rotate(-66.58deg)}17.5%{transform:rotate(-71.32deg)}18.75%{transform:rotate(-75.66deg)}20%{transform:rotate(-79.52deg)}21.25%{transform:rotate(-82.83deg)}22.5%{transform:rotate(-85.49deg)}23.75%{transform:rotate(-87.3deg)}25%{transform:rotate(-88deg)}37.5%{transform:rotate(-88deg)}40.63%{transform:rotate(-86.94deg)}43.75%{transform:rotate(-84.25deg)}46.88%{transform:rotate(-80.4deg)}50%{transform:rotate(-75.66deg)}53.13%{transform:rotate(-70.18deg)}56.25%{transform:rotate(-64.06deg)}59.38%{transform:rotate(-57.35deg)}62.5%{transform:rotate(-50deg)}65.63%{transform:rotate(-42.65deg)}68.75%{transform:rotate(-35.94deg)}71.88%{transform:rotate(-29.82deg)}75%{transform:rotate(-24.34deg)}78.13%{transform:rotate(-19.6deg)}81.25%{transform:rotate(-15.75deg)}84.38%{transform:rotate(-13.06deg)}87.5%{transform:rotate(-12deg)}100%{transform:rotate(-12deg)}}
@keyframes lr-ua-l-a{0%{transform:rotate(12deg)}1.25%{transform:rotate(12.7deg)}2.5%{transform:rotate(14.51deg)}3.75%{transform:rotate(17.17deg)}5%{transform:rotate(20.48deg)}6.25%{transform:rotate(24.34deg)}7.5%{transform:rotate(28.68deg)}8.75%{transform:rotate(33.42deg)}10%{transform:rotate(38.56deg)}11.25%{transform:rotate(44.06deg)}12.5%{transform:rotate(50deg)}13.75%{transform:rotate(55.94deg)}15%{transform:rotate(61.44deg)}16.25%{transform:rotate(66.58deg)}17.5%{transform:rotate(71.32deg)}18.75%{transform:rotate(75.66deg)}20%{transform:rotate(79.52deg)}21.25%{transform:rotate(82.83deg)}22.5%{transform:rotate(85.49deg)}23.75%{transform:rotate(87.3deg)}25%{transform:rotate(88deg)}37.5%{transform:rotate(88deg)}40.63%{transform:rotate(86.94deg)}43.75%{transform:rotate(84.25deg)}46.88%{transform:rotate(80.4deg)}50%{transform:rotate(75.66deg)}53.13%{transform:rotate(70.18deg)}56.25%{transform:rotate(64.06deg)}59.38%{transform:rotate(57.35deg)}62.5%{transform:rotate(50deg)}65.63%{transform:rotate(42.65deg)}68.75%{transform:rotate(35.94deg)}71.88%{transform:rotate(29.82deg)}75%{transform:rotate(24.34deg)}78.13%{transform:rotate(19.6deg)}81.25%{transform:rotate(15.75deg)}84.38%{transform:rotate(13.06deg)}87.5%{transform:rotate(12deg)}100%{transform:rotate(12deg)}}
@keyframes lr-ua-l-b{0%{transform:rotate(12deg)}1.25%{transform:rotate(12.7deg)}2.5%{transform:rotate(14.51deg)}3.75%{transform:rotate(17.17deg)}5%{transform:rotate(20.48deg)}6.25%{transform:rotate(24.34deg)}7.5%{transform:rotate(28.68deg)}8.75%{transform:rotate(33.42deg)}10%{transform:rotate(38.56deg)}11.25%{transform:rotate(44.06deg)}12.5%{transform:rotate(50deg)}13.75%{transform:rotate(55.94deg)}15%{transform:rotate(61.44deg)}16.25%{transform:rotate(66.58deg)}17.5%{transform:rotate(71.32deg)}18.75%{transform:rotate(75.66deg)}20%{transform:rotate(79.52deg)}21.25%{transform:rotate(82.83deg)}22.5%{transform:rotate(85.49deg)}23.75%{transform:rotate(87.3deg)}25%{transform:rotate(88deg)}37.5%{transform:rotate(88deg)}40.63%{transform:rotate(86.94deg)}43.75%{transform:rotate(84.25deg)}46.88%{transform:rotate(80.4deg)}50%{transform:rotate(75.66deg)}53.13%{transform:rotate(70.18deg)}56.25%{transform:rotate(64.06deg)}59.38%{transform:rotate(57.35deg)}62.5%{transform:rotate(50deg)}65.63%{transform:rotate(42.65deg)}68.75%{transform:rotate(35.94deg)}71.88%{transform:rotate(29.82deg)}75%{transform:rotate(24.34deg)}78.13%{transform:rotate(19.6deg)}81.25%{transform:rotate(15.75deg)}84.38%{transform:rotate(13.06deg)}87.5%{transform:rotate(12deg)}100%{transform:rotate(12deg)}}
@keyframes lr-db-r-a{0%{transform:rotate(-3deg)}1.25%{transform:rotate(-2.3deg)}2.5%{transform:rotate(-0.49deg)}3.75%{transform:rotate(2.17deg)}5%{transform:rotate(5.48deg)}6.25%{transform:rotate(9.34deg)}7.5%{transform:rotate(13.68deg)}8.75%{transform:rotate(18.42deg)}10%{transform:rotate(23.56deg)}11.25%{transform:rotate(29.06deg)}12.5%{transform:rotate(35deg)}13.75%{transform:rotate(40.94deg)}15%{transform:rotate(46.44deg)}16.25%{transform:rotate(51.58deg)}17.5%{transform:rotate(56.32deg)}18.75%{transform:rotate(60.66deg)}20%{transform:rotate(64.52deg)}21.25%{transform:rotate(67.83deg)}22.5%{transform:rotate(70.49deg)}23.75%{transform:rotate(72.3deg)}25%{transform:rotate(73deg)}37.5%{transform:rotate(73deg)}40.63%{transform:rotate(71.94deg)}43.75%{transform:rotate(69.25deg)}46.88%{transform:rotate(65.4deg)}50%{transform:rotate(60.66deg)}53.13%{transform:rotate(55.18deg)}56.25%{transform:rotate(49.06deg)}59.38%{transform:rotate(42.35deg)}62.5%{transform:rotate(35deg)}65.63%{transform:rotate(27.65deg)}68.75%{transform:rotate(20.94deg)}71.88%{transform:rotate(14.82deg)}75%{transform:rotate(9.34deg)}78.13%{transform:rotate(4.6deg)}81.25%{transform:rotate(0.75deg)}84.38%{transform:rotate(-1.94deg)}87.5%{transform:rotate(-3deg)}100%{transform:rotate(-3deg)}}
@keyframes lr-db-r-b{0%{transform:rotate(-3deg)}1.25%{transform:rotate(-2.3deg)}2.5%{transform:rotate(-0.49deg)}3.75%{transform:rotate(2.17deg)}5%{transform:rotate(5.48deg)}6.25%{transform:rotate(9.34deg)}7.5%{transform:rotate(13.68deg)}8.75%{transform:rotate(18.42deg)}10%{transform:rotate(23.56deg)}11.25%{transform:rotate(29.06deg)}12.5%{transform:rotate(35deg)}13.75%{transform:rotate(40.94deg)}15%{transform:rotate(46.44deg)}16.25%{transform:rotate(51.58deg)}17.5%{transform:rotate(56.32deg)}18.75%{transform:rotate(60.66deg)}20%{transform:rotate(64.52deg)}21.25%{transform:rotate(67.83deg)}22.5%{transform:rotate(70.49deg)}23.75%{transform:rotate(72.3deg)}25%{transform:rotate(73deg)}37.5%{transform:rotate(73deg)}40.63%{transform:rotate(71.94deg)}43.75%{transform:rotate(69.25deg)}46.88%{transform:rotate(65.4deg)}50%{transform:rotate(60.66deg)}53.13%{transform:rotate(55.18deg)}56.25%{transform:rotate(49.06deg)}59.38%{transform:rotate(42.35deg)}62.5%{transform:rotate(35deg)}65.63%{transform:rotate(27.65deg)}68.75%{transform:rotate(20.94deg)}71.88%{transform:rotate(14.82deg)}75%{transform:rotate(9.34deg)}78.13%{transform:rotate(4.6deg)}81.25%{transform:rotate(0.75deg)}84.38%{transform:rotate(-1.94deg)}87.5%{transform:rotate(-3deg)}100%{transform:rotate(-3deg)}}
@keyframes lr-db-l-a{0%{transform:rotate(3deg)}1.25%{transform:rotate(2.3deg)}2.5%{transform:rotate(0.49deg)}3.75%{transform:rotate(-2.17deg)}5%{transform:rotate(-5.48deg)}6.25%{transform:rotate(-9.34deg)}7.5%{transform:rotate(-13.68deg)}8.75%{transform:rotate(-18.42deg)}10%{transform:rotate(-23.56deg)}11.25%{transform:rotate(-29.06deg)}12.5%{transform:rotate(-35deg)}13.75%{transform:rotate(-40.94deg)}15%{transform:rotate(-46.44deg)}16.25%{transform:rotate(-51.58deg)}17.5%{transform:rotate(-56.32deg)}18.75%{transform:rotate(-60.66deg)}20%{transform:rotate(-64.52deg)}21.25%{transform:rotate(-67.83deg)}22.5%{transform:rotate(-70.49deg)}23.75%{transform:rotate(-72.3deg)}25%{transform:rotate(-73deg)}37.5%{transform:rotate(-73deg)}40.63%{transform:rotate(-71.94deg)}43.75%{transform:rotate(-69.25deg)}46.88%{transform:rotate(-65.4deg)}50%{transform:rotate(-60.66deg)}53.13%{transform:rotate(-55.18deg)}56.25%{transform:rotate(-49.06deg)}59.38%{transform:rotate(-42.35deg)}62.5%{transform:rotate(-35deg)}65.63%{transform:rotate(-27.65deg)}68.75%{transform:rotate(-20.94deg)}71.88%{transform:rotate(-14.82deg)}75%{transform:rotate(-9.34deg)}78.13%{transform:rotate(-4.6deg)}81.25%{transform:rotate(-0.75deg)}84.38%{transform:rotate(1.94deg)}87.5%{transform:rotate(3deg)}100%{transform:rotate(3deg)}}
@keyframes lr-db-l-b{0%{transform:rotate(3deg)}1.25%{transform:rotate(2.3deg)}2.5%{transform:rotate(0.49deg)}3.75%{transform:rotate(-2.17deg)}5%{transform:rotate(-5.48deg)}6.25%{transform:rotate(-9.34deg)}7.5%{transform:rotate(-13.68deg)}8.75%{transform:rotate(-18.42deg)}10%{transform:rotate(-23.56deg)}11.25%{transform:rotate(-29.06deg)}12.5%{transform:rotate(-35deg)}13.75%{transform:rotate(-40.94deg)}15%{transform:rotate(-46.44deg)}16.25%{transform:rotate(-51.58deg)}17.5%{transform:rotate(-56.32deg)}18.75%{transform:rotate(-60.66deg)}20%{transform:rotate(-64.52deg)}21.25%{transform:rotate(-67.83deg)}22.5%{transform:rotate(-70.49deg)}23.75%{transform:rotate(-72.3deg)}25%{transform:rotate(-73deg)}37.5%{transform:rotate(-73deg)}40.63%{transform:rotate(-71.94deg)}43.75%{transform:rotate(-69.25deg)}46.88%{transform:rotate(-65.4deg)}50%{transform:rotate(-60.66deg)}53.13%{transform:rotate(-55.18deg)}56.25%{transform:rotate(-49.06deg)}59.38%{transform:rotate(-42.35deg)}62.5%{transform:rotate(-35deg)}65.63%{transform:rotate(-27.65deg)}68.75%{transform:rotate(-20.94deg)}71.88%{transform:rotate(-14.82deg)}75%{transform:rotate(-9.34deg)}78.13%{transform:rotate(-4.6deg)}81.25%{transform:rotate(-0.75deg)}84.38%{transform:rotate(1.94deg)}87.5%{transform:rotate(3deg)}100%{transform:rotate(3deg)}}
@keyframes lr-trail-a{0%{stroke-dashoffset:1}1.25%{stroke-dashoffset:0.991}2.5%{stroke-dashoffset:0.967}3.75%{stroke-dashoffset:0.932}5%{stroke-dashoffset:0.888}6.25%{stroke-dashoffset:0.838}7.5%{stroke-dashoffset:0.781}8.75%{stroke-dashoffset:0.718}10%{stroke-dashoffset:0.651}11.25%{stroke-dashoffset:0.578}12.5%{stroke-dashoffset:0.5}13.75%{stroke-dashoffset:0.422}15%{stroke-dashoffset:0.349}16.25%{stroke-dashoffset:0.282}17.5%{stroke-dashoffset:0.219}18.75%{stroke-dashoffset:0.162}20%{stroke-dashoffset:0.112}21.25%{stroke-dashoffset:0.068}22.5%{stroke-dashoffset:0.033}23.75%{stroke-dashoffset:0.009}25%{stroke-dashoffset:0}37.5%{stroke-dashoffset:0}40.63%{stroke-dashoffset:0.014}43.75%{stroke-dashoffset:0.049}46.88%{stroke-dashoffset:0.1}50%{stroke-dashoffset:0.162}53.13%{stroke-dashoffset:0.235}56.25%{stroke-dashoffset:0.315}59.38%{stroke-dashoffset:0.403}62.5%{stroke-dashoffset:0.5}65.63%{stroke-dashoffset:0.597}68.75%{stroke-dashoffset:0.685}71.88%{stroke-dashoffset:0.765}75%{stroke-dashoffset:0.838}78.13%{stroke-dashoffset:0.9}81.25%{stroke-dashoffset:0.951}84.38%{stroke-dashoffset:0.986}87.5%{stroke-dashoffset:1}100%{stroke-dashoffset:1}}
@keyframes lr-trail-b{0%{stroke-dashoffset:1}1.25%{stroke-dashoffset:0.991}2.5%{stroke-dashoffset:0.967}3.75%{stroke-dashoffset:0.932}5%{stroke-dashoffset:0.888}6.25%{stroke-dashoffset:0.838}7.5%{stroke-dashoffset:0.781}8.75%{stroke-dashoffset:0.718}10%{stroke-dashoffset:0.651}11.25%{stroke-dashoffset:0.578}12.5%{stroke-dashoffset:0.5}13.75%{stroke-dashoffset:0.422}15%{stroke-dashoffset:0.349}16.25%{stroke-dashoffset:0.282}17.5%{stroke-dashoffset:0.219}18.75%{stroke-dashoffset:0.162}20%{stroke-dashoffset:0.112}21.25%{stroke-dashoffset:0.068}22.5%{stroke-dashoffset:0.033}23.75%{stroke-dashoffset:0.009}25%{stroke-dashoffset:0}37.5%{stroke-dashoffset:0}40.63%{stroke-dashoffset:0.014}43.75%{stroke-dashoffset:0.049}46.88%{stroke-dashoffset:0.1}50%{stroke-dashoffset:0.162}53.13%{stroke-dashoffset:0.235}56.25%{stroke-dashoffset:0.315}59.38%{stroke-dashoffset:0.403}62.5%{stroke-dashoffset:0.5}65.63%{stroke-dashoffset:0.597}68.75%{stroke-dashoffset:0.685}71.88%{stroke-dashoffset:0.765}75%{stroke-dashoffset:0.838}78.13%{stroke-dashoffset:0.9}81.25%{stroke-dashoffset:0.951}84.38%{stroke-dashoffset:0.986}87.5%{stroke-dashoffset:1}100%{stroke-dashoffset:1}}
@keyframes lr-eff-a{0%{opacity:0.75}1.25%{opacity:0.752}2.5%{opacity:0.758}3.75%{opacity:0.767}5%{opacity:0.778}6.25%{opacity:0.791}7.5%{opacity:0.805}8.75%{opacity:0.82}10%{opacity:0.837}11.25%{opacity:0.855}12.5%{opacity:0.875}13.75%{opacity:0.895}15%{opacity:0.913}16.25%{opacity:0.93}17.5%{opacity:0.945}18.75%{opacity:0.959}20%{opacity:0.972}21.25%{opacity:0.983}22.5%{opacity:0.992}23.75%{opacity:0.998}25%{opacity:1}37.5%{opacity:1}40.63%{opacity:0.997}43.75%{opacity:0.988}46.88%{opacity:0.975}50%{opacity:0.959}53.13%{opacity:0.941}56.25%{opacity:0.921}59.38%{opacity:0.899}62.5%{opacity:0.875}65.63%{opacity:0.851}68.75%{opacity:0.829}71.88%{opacity:0.809}75%{opacity:0.791}78.13%{opacity:0.775}81.25%{opacity:0.762}84.38%{opacity:0.753}87.5%{opacity:0.75}100%{opacity:0.75}}
@keyframes lr-eff-b{0%{opacity:0.75}1.25%{opacity:0.752}2.5%{opacity:0.758}3.75%{opacity:0.767}5%{opacity:0.778}6.25%{opacity:0.791}7.5%{opacity:0.805}8.75%{opacity:0.82}10%{opacity:0.837}11.25%{opacity:0.855}12.5%{opacity:0.875}13.75%{opacity:0.895}15%{opacity:0.913}16.25%{opacity:0.93}17.5%{opacity:0.945}18.75%{opacity:0.959}20%{opacity:0.972}21.25%{opacity:0.983}22.5%{opacity:0.992}23.75%{opacity:0.998}25%{opacity:1}37.5%{opacity:1}40.63%{opacity:0.997}43.75%{opacity:0.988}46.88%{opacity:0.975}50%{opacity:0.959}53.13%{opacity:0.941}56.25%{opacity:0.921}59.38%{opacity:0.899}62.5%{opacity:0.875}65.63%{opacity:0.851}68.75%{opacity:0.829}71.88%{opacity:0.809}75%{opacity:0.791}78.13%{opacity:0.775}81.25%{opacity:0.762}84.38%{opacity:0.753}87.5%{opacity:0.75}100%{opacity:0.75}}
.zoom-1 .cam{transform:translate(179px,138px) scale(2.2) translate(-179px,-90px)}
.zoom-2 .cam{transform:translate(179px,138px) scale(1.2) translate(-179px,-135px)}
.zoom-3 .cam{transform:translate(179px,138px) scale(2.2) translate(-179px,-113px)}
.zoom-1 .ov-shoulders,.zoom-3 .ov-elbows{opacity:1}
/* Pictures stills (Pictures + a zoom chip): paused on key pose 1, or pose 3 (31 %) for Path */
.pictures .stage,.pictures .cap-row{--play:paused}
.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}
```

## 9. Markup pieces

### 9.1 Stage SVG: camera group, floor, figure, dumbbells, hand paths, progress trails, zoom overlays

The whole scene sits in `<g class="cam">` (zoomed by the root class) and `<g id="rig-lr">` (cloned by the Pictures tiles). Front view draw order: floor, body layer (legs, torso, neck, head), hand paths and trails, screen-left arm, screen-right arm, static overlays. Each dumbbell lives inside its hand's group (`lr-db-l`, `lr-db-r`), so the grip can never come apart.

```html
<svg class="scene" viewBox="0 0 358 276" aria-hidden="true"><g class="cam"><g id="rig-lr">
<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
<g class="figure" transform="translate(179 156)">
<polygon class="olk" points="2,-4 18,-4 18,18 16,47 10,50.5 4,47 2.5,20"/><polygon class="olk" points="15.36,52.22 12.22,55.36 7.78,55.36 4.64,52.22 4.64,47.78 7.78,44.64 12.22,44.64 15.36,47.78"/><polygon class="olk" points="4.5,49 15.5,49 16,62 14,94 6,94 4,62"/><polygon class="olk" points="5.5,93 14.5,93 17,99 16.5,102 4.5,102 4,99"/><polygon class="olk" points="-2,-4 -18,-4 -18,18 -16,47 -10,50.5 -4,47 -2.5,20"/><polygon class="olk" points="-15.36,52.22 -12.22,55.36 -7.78,55.36 -4.64,52.22 -4.64,47.78 -7.78,44.64 -12.22,44.64 -15.36,47.78"/><polygon class="olk" points="-4.5,49 -15.5,49 -16,62 -14,94 -6,94 -4,62"/><polygon class="olk" points="-5.5,93 -14.5,93 -17,99 -16.5,102 -4.5,102 -4,99"/><polygon class="olk" points="-5,-79 5,-79 6.5,-64 -6.5,-64"/><polygon class="olk" points="-6.5,-69.5 -2.5,-65.5 2.5,-65.5 6.5,-69.5 17,-66.5 21,-63 20,-52 16.5,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.5,-38 -20,-52 -21,-63 -17,-66.5"/><polygon class="olk" points="0,-95 7,-93 10,-87 9.5,-80 6,-74 0,-71.5 -6,-74 -9.5,-80 -10,-87 -7,-93"/><polygon class="b" points="2,-4 18,-4 18,18 16,47 10,50.5 4,47 2.5,20"/><polygon class="fc" points="10,-4 18,-4 18,18 16,47 10,49"/><polygon class="b" points="15.36,52.22 12.22,55.36 7.78,55.36 4.64,52.22 4.64,47.78 7.78,44.64 12.22,44.64 15.36,47.78"/><polygon class="b" points="4.5,49 15.5,49 16,62 14,94 6,94 4,62"/><polygon class="fc" points="10,49 15.5,49 16,62 14,94 10,94"/><polygon class="b" points="5.5,93 14.5,93 17,99 16.5,102 4.5,102 4,99"/><polygon class="b" points="-2,-4 -18,-4 -18,18 -16,47 -10,50.5 -4,47 -2.5,20"/><polygon class="fc" points="-10,-4 -18,-4 -18,18 -16,47 -10,49"/><polygon class="b" points="-15.36,52.22 -12.22,55.36 -7.78,55.36 -4.64,52.22 -4.64,47.78 -7.78,44.64 -12.22,44.64 -15.36,47.78"/><polygon class="b" points="-4.5,49 -15.5,49 -16,62 -14,94 -6,94 -4,62"/><polygon class="fc" points="-10,49 -15.5,49 -16,62 -14,94 -10,94"/><polygon class="b" points="-5.5,93 -14.5,93 -17,99 -16.5,102 -4.5,102 -4,99"/><polygon class="b" points="-5,-79 5,-79 6.5,-64 -6.5,-64"/><polygon class="b" points="-6.5,-69.5 -2.5,-65.5 2.5,-65.5 6.5,-69.5 17,-66.5 21,-63 20,-52 16.5,-38 14,-26 15,-14 16.5,-4 15,4 6,10.5 0,11.5 -6,10.5 -15,4 -16.5,-4 -15,-14 -14,-26 -16.5,-38 -20,-52 -21,-63 -17,-66.5"/><polygon class="mh" points="6.5,-69.5 17,-66.5 21,-63 12,-63 4.5,-65.5"/><polygon class="mh" points="-6.5,-69.5 -17,-66.5 -21,-63 -12,-63 -4.5,-65.5"/><polygon class="fc" points="0.5,-63.5 19.8,-62 19.5,-52 15.5,-44 0.5,-45"/><polygon class="fc" points="-0.5,-63.5 -19.8,-62 -19.5,-52 -15.5,-44 -0.5,-45"/><polygon class="fc" points="16.5,-38 14,-26 15,-14 16.5,-4 9,-9 9,-41"/><polygon class="fc" points="-16.5,-38 -14,-26 -15,-14 -16.5,-4 -9,-9 -9,-41"/><polygon class="b" points="0,-95 7,-93 10,-87 9.5,-80 6,-74 0,-71.5 -6,-74 -9.5,-80 -10,-87 -7,-93"/><polygon class="fc" points="0,-95 7,-93 10,-87 9.5,-80 6,-74 0,-71.5"/>
<path class="guide" d="M27.81 29.11L31 28.81L34.17 28.37L37.33 27.8L40.46 27.1L43.55 26.27L46.61 25.31L49.63 24.23L52.6 23.02L55.51 21.69L58.37 20.25L61.17 18.68L63.9 17L66.56 15.21L69.14 13.31L71.64 11.3L74.05 9.19L76.38 6.99L78.61 4.69L80.74 2.29L82.78 -0.18L84.71 -2.74L86.53 -5.38L88.24 -8.09L89.84 -10.87L91.32 -13.71L92.68 -16.62L93.92 -19.57L95.03 -22.58L96.03 -25.62L96.89 -28.71L97.62 -31.83L98.23 -34.98"/><path class="guide" d="M-27.81 29.11L-31 28.81L-34.17 28.37L-37.33 27.8L-40.46 27.1L-43.55 26.27L-46.61 25.31L-49.63 24.23L-52.6 23.02L-55.51 21.69L-58.37 20.25L-61.17 18.68L-63.9 17L-66.56 15.21L-69.14 13.31L-71.64 11.3L-74.05 9.19L-76.38 6.99L-78.61 4.69L-80.74 2.29L-82.78 -0.18L-84.71 -2.74L-86.53 -5.38L-88.24 -8.09L-89.84 -10.87L-91.32 -13.71L-92.68 -16.62L-93.92 -19.57L-95.03 -22.58L-96.03 -25.62L-96.89 -28.71L-97.62 -31.83L-98.23 -34.98"/><path class="trail j anim lr-trail" d="M27.81 29.11L31 28.81L34.17 28.37L37.33 27.8L40.46 27.1L43.55 26.27L46.61 25.31L49.63 24.23L52.6 23.02L55.51 21.69L58.37 20.25L61.17 18.68L63.9 17L66.56 15.21L69.14 13.31L71.64 11.3L74.05 9.19L76.38 6.99L78.61 4.69L80.74 2.29L82.78 -0.18L84.71 -2.74L86.53 -5.38L88.24 -8.09L89.84 -10.87L91.32 -13.71L92.68 -16.62L93.92 -19.57L95.03 -22.58L96.03 -25.62L96.89 -28.71L97.62 -31.83L98.23 -34.98" pathLength="1"/><path class="trail j anim lr-trail" d="M-27.81 29.11L-31 28.81L-34.17 28.37L-37.33 27.8L-40.46 27.1L-43.55 26.27L-46.61 25.31L-49.63 24.23L-52.6 23.02L-55.51 21.69L-58.37 20.25L-61.17 18.68L-63.9 17L-66.56 15.21L-69.14 13.31L-71.64 11.3L-74.05 9.19L-76.38 6.99L-78.61 4.69L-80.74 2.29L-82.78 -0.18L-84.71 -2.74L-86.53 -5.38L-88.24 -8.09L-89.84 -10.87L-91.32 -13.71L-92.68 -16.62L-93.92 -19.57L-95.03 -22.58L-96.03 -25.62L-96.89 -28.71L-97.62 -31.83L-98.23 -34.98" pathLength="1"/>
<g class="j anim lr-ua-l arm-l"><polygon class="olk" points="-16.8,-64 -27.5,-64 -28.2,-48 -26.6,-27 -22,-23 -17.4,-27 -16.2,-48"/><polygon class="olk" points="-16.8,-65 -23,-66 -28,-64.5 -30.2,-59.5 -29.8,-52.5 -26.8,-47.5 -21,-49 -16.8,-56.5"/><polygon class="b" points="-16.8,-64 -27.5,-64 -28.2,-48 -26.6,-27 -22,-23 -17.4,-27 -16.2,-48"/><polygon class="fc" points="-19,-59 -25,-59 -25.5,-36 -22,-31 -19,-36"/><polygon class="b" points="-16.8,-65 -23,-66 -28,-64.5 -30.2,-59.5 -29.8,-52.5 -26.8,-47.5 -21,-49 -16.8,-56.5"/><polygon class="mm anim lr-eff" points="-23,-66 -28,-64.5 -30.2,-59.5 -29.8,-52.5 -26.8,-47.5 -24.5,-57.5"/><polygon class="fc" points="-16.8,-65 -23,-66 -24.5,-57.5 -26.8,-47.5 -21,-49 -16.8,-56.5"/><g class="j lr-fa-l"><polygon class="olk" points="-26.25,-22.24 -23.76,-19.75 -20.24,-19.75 -17.75,-22.24 -17.75,-25.76 -20.24,-28.25 -23.76,-28.25 -26.25,-25.76"/><polygon class="olk" points="-17.4,-25 -26.8,-25 -27,-13 -25.6,7 -18.4,7 -17.2,-13"/><polygon class="olk" points="-17.8,6 -26.2,6 -27.2,12 -27,20 -24.5,23.5 -19,23.5 -16.8,19.5 -16.8,12"/><polygon class="b" points="-26.25,-22.24 -23.76,-19.75 -20.24,-19.75 -17.75,-22.24 -17.75,-25.76 -20.24,-28.25 -23.76,-28.25 -26.25,-25.76"/><polygon class="b" points="-17.4,-25 -26.8,-25 -27,-13 -25.6,7 -18.4,7 -17.2,-13"/><polygon class="fc" points="-22.2,-25 -26.8,-25 -27,-13 -25.6,7 -22.2,7"/><polygon class="b" points="-17.8,6 -26.2,6 -27.2,12 -27,20 -24.5,23.5 -19,23.5 -16.8,19.5 -16.8,12"/><polygon class="fc" points="-22,6 -26.2,6 -27.2,12 -27,20 -24.5,23.5 -22,23.5"/><circle class="ov ov-elbows ovs" cx="-22" cy="-24" r="8"/><g class="j anim lr-db-l"><polygon class="eqm" points="-30,21 -26,14.63 -18,14.63 -14,21 -14,17.2 -18,10.83 -26,10.83 -30,17.2"/><polygon class="eqm" points="-14,21 -18,27.37 -26,27.37 -30,21 -26,14.63 -18,14.63"/><polygon class="hd" points="-19.3,21 -20.65,23.15 -23.35,23.15 -24.7,21 -23.35,18.85 -20.65,18.85"/></g></g></g>
<g class="j anim lr-ua-r arm-r"><polygon class="olk" points="16.8,-64 27.5,-64 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/><polygon class="olk" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/><polygon class="b" points="16.8,-64 27.5,-64 28.2,-48 26.6,-27 22,-23 17.4,-27 16.2,-48"/><polygon class="fc" points="19,-59 25,-59 25.5,-36 22,-31 19,-36"/><polygon class="b" points="16.8,-65 23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 21,-49 16.8,-56.5"/><polygon class="mm anim lr-eff" points="23,-66 28,-64.5 30.2,-59.5 29.8,-52.5 26.8,-47.5 24.5,-57.5"/><polygon class="fc" points="16.8,-65 23,-66 24.5,-57.5 26.8,-47.5 21,-49 16.8,-56.5"/><g class="j lr-fa-r"><polygon class="olk" points="26.25,-22.24 23.76,-19.75 20.24,-19.75 17.75,-22.24 17.75,-25.76 20.24,-28.25 23.76,-28.25 26.25,-25.76"/><polygon class="olk" points="17.4,-25 26.8,-25 27,-13 25.6,7 18.4,7 17.2,-13"/><polygon class="olk" points="17.8,6 26.2,6 27.2,12 27,20 24.5,23.5 19,23.5 16.8,19.5 16.8,12"/><polygon class="b" points="26.25,-22.24 23.76,-19.75 20.24,-19.75 17.75,-22.24 17.75,-25.76 20.24,-28.25 23.76,-28.25 26.25,-25.76"/><polygon class="b" points="17.4,-25 26.8,-25 27,-13 25.6,7 18.4,7 17.2,-13"/><polygon class="fc" points="22.2,-25 26.8,-25 27,-13 25.6,7 22.2,7"/><polygon class="b" points="17.8,6 26.2,6 27.2,12 27,20 24.5,23.5 19,23.5 16.8,19.5 16.8,12"/><polygon class="fc" points="22,6 26.2,6 27.2,12 27,20 24.5,23.5 22,23.5"/><circle class="ov ov-elbows ovs" cx="22" cy="-24" r="8"/><g class="j anim lr-db-r"><polygon class="eqm" points="14,21 18,14.63 26,14.63 30,21 30,17.2 26,10.83 18,10.83 14,17.2"/><polygon class="eqm" points="30,21 26,27.37 18,27.37 14,21 18,14.63 26,14.63"/><polygon class="hd" points="24.7,21 23.35,23.15 20.65,23.15 19.3,21 20.65,18.85 23.35,18.85"/></g></g></g>
<polyline class="ov ov-shoulders ovs" points="7,-75 17.5,-72 24,-67.5"/><polyline class="ov ov-shoulders ovs" points="-7,-75 -17.5,-72 -24,-67.5"/>
</g>
</g><g class="ov ov-shoulders"><path class="arrow" d="M209 66L209 75"/><polygon class="arrow-head" points="209,81 205,75 213,75"/><path class="arrow" d="M149 66L149 75"/><polygon class="arrow-head" points="149,81 145,75 153,75"/></g></g></svg>
```

### 9.2 Pictures grid (4 key poses with captions)

```html
<div class="pics"><div class="tile"><svg viewBox="66 56 226 208" aria-hidden="true"><use href="#rig-lr" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -0)"/></svg><span class="badge">1</span><p>Stand tall, elbows soft</p></div><div class="tile"><svg viewBox="66 56 226 208" aria-hidden="true"><use href="#rig-lr" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -0.125)"/><path class="arrow" d="M252.6 178.46L260.28 171.47"/><polygon class="arrow-head" points="264.72,167.43 262.97,174.43 257.59,168.51"/></svg><span class="badge">2</span><p>Lift out to the sides</p></div><div class="tile"><svg viewBox="66 56 226 208" aria-hidden="true"><use href="#rig-lr" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -0.31)"/></svg><span class="badge">3</span><p>Stop at shoulder height</p></div><div class="tile"><svg viewBox="66 56 226 208" aria-hidden="true"><use href="#rig-lr" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -0.625)"/><path class="arrow" d="M264.72 167.43L257.04 174.42"/><polygon class="arrow-head" points="252.6,178.46 254.35,171.46 259.73,177.38"/></svg><span class="badge">4</span><p>Lower slowly, 2 s</p></div></div>
```

### 9.3 Caption bubbles (one per zoom state; CSS shows the one that matches the root class)

```html
<div class="bubble bub-1"><span class="dot"></span><span>Keep your shoulders down, away from your ears. No shrug.</span></div>
<div class="bubble bub-2"><span class="dot"></span><span>Out to the sides and up to shoulder height, no higher.</span></div>
<div class="bubble bub-3"><span class="dot"></span><span>A soft bend in your elbows that stays the same up and down.</span></div>
```

## 10. Logic script (`<script type="text/x-dc" data-dc-script data-props='...'>`)

```js
const THEMES = {"silent-black":{"bg":"#08090a","s1":"#0f1011","s2":"#141516","s3":"#1b1c1f","bSub":"rgba(255,255,255,0.06)","b":"rgba(255,255,255,0.10)","bStr":"rgba(255,255,255,0.18)","text":"#f7f8f8","t2":"#8a8f98","t3":"#62666d","acc":"#5e6ad2","accSoft":"rgba(94,106,210,0.16)","onAcc":"#ffffff","pos":"#4cc38a","warn":"#f2b544","neg":"#eb5757","info":"#6ea8fe","shadow":"0 16px 40px rgba(0,0,0,0.45)","mapBody":"#1b1c1f","mapLine":"rgba(255,255,255,0.10)","scheme":"dark","r":["8px","12px","16px","22px"]},"paper":{"bg":"#ffffff","s1":"#f7f6f3","s2":"#efeeea","s3":"#e6e4df","bSub":"rgba(55,53,47,0.08)","b":"rgba(55,53,47,0.14)","bStr":"rgba(55,53,47,0.26)","text":"#37352f","t2":"#6b6a66","t3":"#9b9a97","acc":"#2383e2","accSoft":"rgba(35,131,226,0.12)","onAcc":"#ffffff","pos":"#0f7b4f","warn":"#b7791f","neg":"#c0392b","info":"#2383e2","shadow":"0 8px 24px rgba(15,15,15,0.08)","mapBody":"#e6e4df","mapLine":"rgba(55,53,47,0.18)","scheme":"light","r":["6px","10px","14px","18px"]},"ember":{"bg":"#07080a","s1":"#0e1013","s2":"#14171b","s3":"#1c2026","bSub":"rgba(255,255,255,0.05)","b":"rgba(255,255,255,0.09)","bStr":"rgba(255,255,255,0.16)","text":"#ffffff","t2":"#9aa0a6","t3":"#5f666d","acc":"#ff6363","accSoft":"rgba(255,99,99,0.16)","onAcc":"#1a0b0b","pos":"#59d499","warn":"#ffb454","neg":"#ff6363","info":"#7aa7ff","shadow":"0 18px 44px rgba(0,0,0,0.5)","mapBody":"#1c2026","mapLine":"rgba(255,255,255,0.10)","scheme":"dark","r":["8px","12px","16px","20px"]},"emerald":{"bg":"#0f0f0f","s1":"#171717","s2":"#1c1c1c","s3":"#242424","bSub":"#242424","b":"#2e2e2e","bStr":"#393939","text":"#ededed","t2":"#a0a0a0","t3":"#707070","acc":"#3ecf8e","accSoft":"rgba(62,207,142,0.14)","onAcc":"#062d1c","pos":"#3ecf8e","warn":"#f5a623","neg":"#f04438","info":"#5fa8ff","shadow":"0 14px 36px rgba(0,0,0,0.45)","mapBody":"#242424","mapLine":"#393939","scheme":"dark","r":["6px","8px","12px","16px"]},"midnight":{"bg":"#0a2540","s1":"#0f2d4d","s2":"#143559","s3":"#1a3f68","bSub":"rgba(246,249,252,0.07)","b":"rgba(246,249,252,0.12)","bStr":"rgba(246,249,252,0.22)","text":"#f6f9fc","t2":"#a3b6cc","t3":"#6c839c","acc":"#635bff","accSoft":"rgba(99,91,255,0.18)","onAcc":"#ffffff","pos":"#3ecf8e","warn":"#ffbb00","neg":"#ff5c5c","info":"#00d4ff","shadow":"0 18px 44px rgba(3,20,40,0.55)","mapBody":"#1a3f68","mapLine":"rgba(246,249,252,0.14)","scheme":"dark","r":["8px","12px","16px","22px"]}};
function themeVars(id) {
  const t = THEMES[id] || THEMES['silent-black'];
  return `color-scheme:${t.scheme};--bg:${t.bg};--surface-1:${t.s1};--surface-2:${t.s2};--surface-3:${t.s3};--border-subtle:${t.bSub};--border:${t.b};--border-strong:${t.bStr};--text:${t.text};--text-2:${t.t2};--text-3:${t.t3};--accent:${t.acc};--accent-soft:${t.accSoft};--on-accent:${t.onAcc};--positive:${t.pos};--warning:${t.warn};--negative:${t.neg};--info:${t.info};--shadow:${t.shadow};--map-body:${t.mapBody};--map-line:${t.mapLine};--radius-sm:${t.r[0]};--radius-md:${t.r[1]};--radius-lg:${t.r[2]};--radius-xl:${t.r[3]};--scrim:rgba(0,0,0,.5)`;
}
function rigVars(id) {
  const t = THEMES[id] || THEMES['silent-black'];
  const light = t.scheme === 'light';
  return `--fg-line:color-mix(in srgb,var(--text) ${light ? 70 : 60}%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) ${light ? 56 : 38}%,var(--surface-1))`;
}
// One rep is 4 s at 1x. Zoom chips: 1 Shoulders, 2 Path, 3 Elbows (root classes zoom-1..3).
const EX = { rep: 4 };
const on = v => v === true || v === 'true' || v === 'yes';
class Component extends DCLogic {
  constructor(props) {
    super(props);
    let rm = false;
    try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { rm = false; }
    const auto = on(props.autoplay) && !rm;
    this.state = { playing: auto, started: auto, ended: false, speed: 1, mode: rm ? 'pics' : 'anim', zoom: 0, gen: 'a', elapsed: 0, rm: rm };
    this.timer = null;
  }
  componentDidMount() { if (this.state.playing) this.startClock(); }
  componentWillUnmount() { this.stopClock(); }
  startClock() { this.stopClock(); this.t0 = Date.now() - this.state.elapsed * 1000; this.timer = setInterval(() => this.tick(), 200); }
  stopClock() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
  repDur() { return EX.rep / this.state.speed; }
  flip() { return this.state.gen === 'a' ? 'b' : 'a'; }
  tick() {
    const el = (Date.now() - this.t0) / 1000, total = 3 * this.repDur();
    if (!on(this.props.loop) && el >= total) { this.stopClock(); this.setState({ playing: false, ended: true, elapsed: total }); }
    else this.setState({ elapsed: el });
  }
  togglePlay() {
    const s = this.state;
    if (s.rm) return;
    if (s.mode !== 'anim') { this.setState({ mode: 'anim', zoom: 0, gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false }, () => this.startClock()); return; }
    if (s.ended) { this.setState({ gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false }, () => this.startClock()); return; }
    if (s.playing) { this.stopClock(); this.setState({ playing: false }); return; }
    this.setState({ playing: true, started: true }, () => this.startClock());
  }
  setSpeed(v) {
    if (v === this.state.speed) return;
    const was = this.state.playing;
    this.stopClock();
    this.setState({ speed: v, gen: this.flip(), elapsed: 0, ended: false, playing: was }, () => { if (was) this.startClock(); });
  }
  setMode(m) {
    if (m === this.state.mode || (this.state.rm && m === 'anim')) return;
    this.stopClock();
    this.setState({ mode: m, zoom: 0, gen: this.flip(), elapsed: 0, playing: false, started: false, ended: false });
  }
  pickZoom(n) {
    const s = this.state, z = s.zoom === n ? 0 : n;
    // In Pictures a zoom opens a still: flip gen so the paused animation restarts at 0 and shows the CSS still pose.
    // The caption line then shows that pose's picture caption (showStill1 / showStill3), not a phase caption.
    this.setState(s.mode === 'pics' ? { zoom: z, gen: this.flip() } : { zoom: z });
  }
  renderVals() {
    const s = this.state, p = this.props, loop = on(p.loop), dur = this.repDur();
    const anim = s.mode === 'anim', still = !anim && s.zoom > 0;
    const play = s.playing && anim ? 'running' : 'paused';
    return {
      rootStyle: `${themeVars(p.theme)};${rigVars(p.theme)};--play:${play};--dur:${dur}s;--iter:${loop ? 'infinite' : 3};--sets:${loop ? 'infinite' : 1};--delay:0s`,
      rootClass: `player gen-${s.gen}${s.zoom ? ' zoom-' + s.zoom : ''}${anim ? '' : ' pictures'}`,
      showSlow: anim && s.speed === 0.5,
      showIdle: anim && !s.started && !s.ended,
      showEnded: anim && s.ended,
      showCaps: anim && s.started && !s.ended,
      showStill1: still && s.zoom !== 2, showStill3: still && s.zoom === 2,
      showPicsLine: !anim && !still,
      showTempo: anim, // Pictures mode (grid or still) has no tempo note, as on Machine Chest Press and Lat Pulldown
      isPlay: !s.playing && !s.ended, isPause: s.playing, isReplay: s.ended,
      playLabel: s.ended ? 'Replay' : (s.playing ? 'Pause' : 'Play'),
      playDisabled: s.rm,
      z1: s.zoom === 1, z2: s.zoom === 2, z3: s.zoom === 3,
      pick1: () => this.pickZoom(1), pick2: () => this.pickZoom(2), pick3: () => this.pickZoom(3),
      speed1: s.speed === 1, speedHalf: s.speed === 0.5,
      modeAnim: anim, modePics: !anim, animDisabled: s.rm,
      hintAnim: !s.rm && anim, hintPics: !s.rm && !anim, hintRm: s.rm,
      togglePlay: () => this.togglePlay(),
      speedTo1: () => this.setSpeed(1), speedToHalf: () => this.setSpeed(0.5),
      toAnim: () => this.setMode('anim'), toPics: () => this.setMode('pics'),
    };
  }
}
```

## 11. Checks

`node shoot.cjs` (Chromium) runs every check below and writes the screenshots; results are in `checks.txt`.

- Keyframes: every `-a` set equals its `-b` set; figure, captions and rep pill are driven only by `--play`, `--dur`, `--delay`, `--iter`, `--sets`.
- Movement over 201 phases (`getCTM`): arm angle A at every key point of the tempo table, both shoulders fixed (no shrug), left and right hands mirror each other, hands and elbows never above the shoulder line, elbow bend fixed at 15 degrees, dumbbells level, grip on the rig's timed path, figure inside the safe area of the stage.
- Loop off (a real 12 s run): 3 reps, stop in the reset pose, Replay restarts through the `-b` set; 0.5x gives an 8 s rep and the Slow motion pill; Pause holds the frame; autoplay off starts on the setup pose.
- Phase captions: exactly one shows, the right one, in each window. The five themes paint from `?theme=`.
- Each zoom state: camera transform, only its own bubble, pill row and camera label hidden, subject inside the stage and above the bubble at 41 phases.
- Pictures: grid shown, 4 different poses; stills: grid hidden, Path still on pose 3.
- Reduced motion: paused even when the root style says running, grid shown, hint, Animation disabled.
- Every binding in the markup exists in `renderVals()`; no page errors.

## 12. Risks

| Risk | Handling |
|---|---|
| Someone edits a keyframe by hand and an arm swings past shoulder height or the two arms stop mirroring | Change `rig-final/gen.mjs`, rebuild the rig, then `node build.mjs` and `node shoot.cjs`; the build stops if a replaced string is missing, and the checks fail on any angle, mirror or shoulder-line error. |
| `sc-if` wrappers change layout in the canvas | Every wrapped element sits in a flex row or a grid cell and keeps its own class, so the wrapper only adds or removes it. Check once on the canvas. |
| A still shows the wrong pose if the canvas does not restart animations on a class change | The logic flips `gen`, which renames every animation and restarts it; checked in Chromium. |
| Page weight (about 50 KB) from the doubled keyframe sets | Generated, never typed. The real app plays the same samples with the Web Animations API and needs one copy. |
| The 200 ms timer stops the set a few ms before the CSS end | The last 0.5 s of every rep is the still reset pose, equal to the setup pose, so the frame is the same; checked that every animation stops inside that window and the grip sits at the setup position. |
| The chips differ from spec 3.5 (Shoulders instead of Grip, two centres moved) | Decided by the final rig with reasons (section 4); spec.md section 3.5 carries the same chips and reasons (applied 2026-09-27). |
| Midnight: the accent muscle tint is weak on the body (1.63:1) | As in the rig: each muscle polygon has its own thin outline, the figure outline carries the shape, and the muscles are named in text. |
