# Machine Chest Press player: drop-in pieces

Built by `node build.mjs` from the final rig's generator (`../rig-final/gen.mjs`) with the chest press changes in section 13 applied, plus `logic.js`. The harness `index.html` is built from the very same strings, so every piece below is what the screenshots in `shots/` show. Do not edit these pieces by hand: change `build.mjs` (or `rig-final/gen.mjs`) and rebuild.

## In plain words

- A side view of a person on a chest press machine. The handles start level with the middle of the chest, with the elbows bent to about a right angle and pulled back a little behind the body, so the chest gets a light stretch. The person pushes the handles out in 1 second, pauses for half a second just short of straight arms (a small bend at the elbow, pointing down, that you can see from the side, so it never looks locked), brings the handles back slowly over 2 seconds, and rests for half a second. The weight plates rise and fall with the handles. Three reps, then it stops and offers Replay.
- A blue line grows from where the handle starts to where it is now, so a beginner can see how far to push and where to stop.
- Three close-ups (Grip, Path, Seat): the camera glides in, a ring or outline marks the thing to look at, and a short tip shows at the bottom. Nothing that is marked hides behind the tip.
- "Pictures" shows four key moments of one rep as still drawings, made from the same drawing as the animation. A phone set to reduce motion always gets the pictures instead of movement.
- Everything that changes is driven by one class string and one style string on the outer box. Nothing is built by script.

## 1. Files

| File | What it is |
|---|---|
| `index.html` | Harness: the full player, built the way the artboard is. Query: `?theme=<id>&t=<0..1>&zoom=1\|2\|3&mode=pictures&loop=1&autoplay=0&speed=0.5`. `t` freezes rep 1 at that point. |
| `logic.js` | The artboard's logic class (`class Component extends DCLogic`). Pasted as is (section 10). |
| `build.mjs` | Builds `index.html` and this file. First it copies `../rig-final/gen.mjs` into `rig/gen.mjs` with the section 13 changes (each one an exact-match edit, so the build stops if the rig changes under it) and runs it. |
| `rig/` | Written by `build.mjs`, never edited: `gen.mjs`, `chest-press.html` (the rig harness this player is built from) and `poses.json` (the solved numbers the checks read). |
| `shoot.cjs` | Checks and screenshots (`shots/`, or `SHOTS=<dir>`). Exits 1 on any failure. |
| `work/r3/` | Round 3 tools: `carry.mjs` (carries the rebuilt pieces into the canvas player by exact-match edits), `canvas-check.cjs` (renders the canvas player with a stand-in runtime, runs the round 3 probes on it, writes `shots-r3/canvas_*.png`), `shoot-r3.cjs` and `sheet.cjs` (frames and contact sheets in `shots-r3/`), `explore.mjs` and `explore-e0.mjs` (end pole and setup elbow scans), and the copies from before round 3 (`index.html`, `PLAYER.md`, `Player-before.dc.html`, `rig-before/`). |
| `shots-r3/` | Round 3 frames: the 16 dark frames, the zooms at 0 and 25 %, Pictures (dark and paper) and its stills, 4x crops of the arm and of tile 1's corner, the canvas player frames, and contact sheets (`sheet_*.png`). |

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
| `--iter` | `3` (loop off) or `infinite` | figure, machine, trail and captions: 3 reps, then the last frame (= setup pose) holds |
| `--sets` | `1` (loop off) or `infinite` | the rep pill runs one 3-rep cycle |
| `--delay` | `0s` | always 0 from the logic. The CSS sets its own value for Pictures tiles and stills (section 5) |
| `--sw` | not set by the logic | stroke scale: 1 on the stage (CSS default), 0.75 in Pictures tiles (on each `<use>`) |
| `--stack-top` | not set by the logic | 1 on the stage (CSS default): the weight stack's top bracket and cable show. 0 in Pictures tiles (on each `<use>`): they hide, so tile 1 has no cut-off bracket at its top edge (section 13, round 3 decision 3) |

`rootClass` = `player gen-<a|b>` + ` zoom-<1|2|3>` when a chip is on + ` pictures` in Pictures mode.

| Class | Set when | What the CSS does |
|---|---|---|
| `gen-a` / `gen-b` | flips on Play after the end (Replay), on a speed change, on a mode change, and when a Pictures still opens or closes | picks the `-a` or `-b` keyframe set, which restarts every animation from 0 % (the setup pose). The two sets are identical (checked). |
| `zoom-1` | Grip chip on | camera `translate(179px,138px) scale(2) translate(-206px,-157px)`; grip ring on; far lever hidden; bubble 1 |
| `zoom-2` | Path chip on | camera `translate(179px,138px) scale(1.6) translate(-204px,-160px)`; path guide and trail (always on); bubble 2 |
| `zoom-3` | Seat chip on | camera `translate(179px,138px) scale(1.7) translate(-150px,-190px)`; seat pad outlined; bubble 3 |
| any `zoom-N` | | rep pill row and camera label hide; camera glides in 320 ms `cubic-bezier(.32,.72,0,1)`; overlay fades in 150 ms |
| `pictures` | Pictures mode | the 2 x 2 grid of key poses covers the stage; with a `zoom-N` as well, the grid hides and the stage shows one still (section 5) |

Every other value the markup reads from `renderVals()` (`sc-if` flags, `aria-*` values and click handlers; all in `logic.js`): `showSlow`, `showIdle`, `showEnded`, `showCaps`, `showStill1`, `showStill3`, `showPicsLine`, `showTempo`, `z1`, `pick1`, `z2`, `pick2`, `z3`, `pick3`, `playLabel`, `togglePlay`, `playDisabled`, `isPlay`, `isPause`, `isReplay`, `speed1`, `speedTo1`, `speedHalf`, `speedToHalf`, `modeAnim`, `toAnim`, `animDisabled`, `modePics`, `toPics`, `hintAnim`, `hintPics`, `hintRm`.

| Flag | True when |
|---|---|
| `showSlow` | Animation mode at 0.5x ("Slow motion" pill) |
| `showIdle` | Animation mode before the first Play ("Tap Play to watch 3 slow reps.") |
| `showEnded` | after the 3 reps with loop off ("Done. Tap Replay to watch again.") |
| `showCaps` | Animation mode, playing or paused mid-set (the 4 phase captions) |
| `showStill1`, `showStill3` | a Pictures still is open: pose 1 (Grip, Seat) shows "Setup: handles at mid-chest", pose 3 (Path) shows "Arms almost straight, no lock", the same words as that picture's tile |
| `showPicsLine` | Pictures grid showing ("Press out 1 s, pause, back 2 s") |
| `showTempo` | Animation mode only ("1 s out · 2 s back"). Pictures mode, grid or still, has no tempo note, as RIG.md section 12 says; beside the longest still caption it would overflow the 358 px row |
| `isPlay`, `isPause`, `isReplay`, `playLabel`, `playDisabled` | Play button icon, `aria-label` and disabled state (disabled under reduced motion) |
| `z1`, `z2`, `z3` | `aria-pressed` of the Grip, Path and Seat chips |
| `speed1`, `speedHalf`, `modeAnim`, `modePics`, `animDisabled` | segment buttons |
| `hintAnim`, `hintPics`, `hintRm` | which hint line shows |

The 200 ms timer in `logic.js` ends playback after 3 x `--dur` with loop off (`playing: false, ended: true`); it is cleared in `componentWillUnmount`.

## 3. Rep timing and phase captions

One rep = `--dur` (4 s at 1x). The easing is baked into the keyframe samples (every 1.25 % in the press, every 3.125 % in the return), so every figure keyframe plays `linear` between samples.

| Rep % | Time at 1x | Phase | Movement | Caption (`capx` span) | Keyframe window |
|---|---|---|---|---|---|
| 0 - 25 | 0 - 1.0 s | Press | handles out from x 181 to 226 (mid pose at 12.5 %); ease in, then ease out | c1 "Press out, 1 s" | `cap1`: 0 % 1, 25 % 0 |
| 25 - 37.5 | 1.0 - 1.5 s | Pause | still, elbows 162.5 degrees; from the side the arm is drawn at 167.8 degrees with the elbow 4.1 below the shoulder-to-grip line, a bend you can see (no lockout) | c2 "Pause, don’t lock out" | `cap2`: 25 % 1, 37.5 % 0 |
| 37.5 - 87.5 | 1.5 - 3.5 s | Return | back to the setup pose (mid pose at 62.5 %); ease in, then ease out | c3 "Back slowly, 2 s" | `cap3`: 37.5 % 1, 87.5 % 0 |
| 87.5 - 100 | 3.5 - 4.0 s | Reset | still in the setup pose (elbows back, light chest stretch), plates resting | c4 "Reset, light chest stretch" | `cap4`: 87.5 % 1, 100 % 1 |

Captions use `animation-timing-function: step-end` (class `capx`), so each one switches on and off exactly at its window edges. The rep pill (`repx r1..r3`) runs over `calc(var(--dur) * 3)` and switches at 33.333 % and 66.667 %. Caption, pill and figure share `--play`, `--dur`, `--delay` and the `gen` class, so they cannot drift apart. Tempo note: "1 s out · 2 s back".

Movement numbers (checked against the spec's truth table; solved in `rig/gen.mjs`, which is `rig-final/gen.mjs` plus section 13):

| Joint | Setup (0 %) | Pressed (25 - 37.5 %) | Truth table |
|---|---|---|---|
| Elbow inside angle | 88.0 | 162.5 | about 90, then 160-165, no lockout (checked 80-95 and 155-168) |
| Elbow angle as drawn (side view) | 59.8 | 167.8 | pressed: the bend must show from the side (checked 155-169, elbow at least 3.9 below the shoulder-to-grip line; now 4.1). Setup: the side camera draws the 88-degree elbow sharper because the upper arm points out toward the camera (section 13, round 3 decision 2) |
| Arm out from the side | 53.4 | | 45-60 |
| Arm forward (side view; minus = elbow behind the shoulder) | -14.0 | 75.1 | elbows a little behind the body (checked -18 to -10), then about 80 forward (checked 75-85) |
| Shoulder travel | 89.2 degrees | | about 95 (checked 88-100) |
| Setup elbow (shoulder at 150, 144) | (144.5, 166) | | 5.5 behind the shoulder, close to the back line of the torso, and still clear of the back pad (checked over the whole rep) |
| Upper arm drawn length (fu) | 0.60 | 0.982 | never below 0.55 (min 0.553) |
| Torso, hips, knees, feet, wrist, shoulder blades | fixed | fixed | fixed |
| Grip centre (stage units) | (181, 155.44) | (226, 155.44) | handles at mid-chest; the lever arc puts them 2.6 lower mid-press (203.5, 158) |
| Stack lift | 0 | 22.5 | half the handle travel |

Animated groups (each has an identical `-a` and `-b` keyframe set): `cap1`, `cap2`, `cap3`, `cap4`, `rep1`, `rep2`, `rep3`, `cp-ua`, `cp-ul`, `cp-fa`, `cp-fl`, `cp-hd`, `cp-lever`, `cp-stack`, `cp-cable`, `cp-trail`, `cp-eff`.

## 4. Zoom states

| Root class | Chip | Camera centre, scale | Overlay | Bubble text | Still in Pictures |
|---|---|---|---|---|---|
| `zoom-1` | Grip | 206, 157, 2.0 | accent ring r 12 in the hand group (`.ov-grip`); far lever hidden | Hold the middle of the handle. Wrists straight, not bent back. | pose 1 (0 %) |
| `zoom-2` | Path | 204, 160, 1.6 | the always-on dashed path and growing trail. The lever turns on an arc, so the path is a shallow curve (the handle's bottom tip is 2.9 lower mid-press); the tip says "stay at mid-chest height", not "straight". | Handles stay at mid-chest height the whole way out and back. | pose 3 (31 %) |
| `zoom-3` | Seat | 150, 190, 1.7 | accent outline on the seat pad only (`.ov-seat`), open at its front end so it passes behind the near shin instead of over it. The pad outline and the near handle stay in view and above the bubble for the whole rep. The post is not outlined: at this zoom most of it sits behind the bubble. | Set the seat so the handles line up with the middle of your chest. | pose 1 (0 %) |

The animation keeps running while zoomed. Each chip's subject stays inside the stage and above the bubble for the whole rep (checked at 41 phases, section 11).

## 5. Pictures mode and stills

- Root class `pictures`: the grid (`.pics`, always in the markup, never inside an `sc-if`) covers the stage. Four tiles, each a `<use href="#rig-cp">` of the one rig with its own `--play:paused;--sw:.75;--delay:calc(var(--dur) * -<pose>)`. Key poses: 1 = 0 %, 2 = 12.5 %, 3 = 31 %, 4 = 62.5 %. Tiles 2 and 4 carry a direction arrow.
- Captions: 1 "Setup: handles at mid-chest"; 2 "Press straight out"; 3 "Arms almost straight, no lock"; 4 "Back slowly, 2 s".
- Every tile's `<use>` also sets `--stack-top:0`, which hides the weight stack's top bracket and cable (class `stack-top`, rule `.stack-top{opacity:var(--stack-top,1)}`) in the tiles only. At rest they sat just under the tile's top edge, sliced, behind badge 1. The tile crop (`viewBox="96 104 160 158"`) stays: the head's top is at y 112, so a crop starting below the bracket (y 113) would cut the head.
- `pictures zoom-N`: the grid hides and the stage shows one still at that zoom. The CSS pauses the stage and caption row and, for Path, moves them to pose 3: `.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}`. The logic flips `gen` when a still opens or closes, so the paused animation restarts from 0 before the delay applies.
- The caption line under a still shows that pose's picture caption, not the phase caption of the frame: "Setup: handles at mid-chest" for Grip and Seat (pose 1), "Arms almost straight, no lock" for Path (pose 3). The phase captions (`showCaps`) belong to the animation only.
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

## 7. Artboard skeleton (`project/Player-MachineChestPress.dc.html`)

Sections 8, 9 and 10 fill the marked places. The `data-props` follow spec 2.1 (standalone on the canvas it autoplays and loops; About imports it with `autoplay` and `loop` off, so it runs 3 reps and offers Replay). SVG shapes use `/>`, which is valid inside `<svg>`; every HTML element is closed.

```html
<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Machine Chest Press form guide</title>
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
<div class="cam-label">Side view</div>
<!-- Pictures grid: section 9.2 -->
<!-- caption bubbles: section 9.3 -->
</div>
<div class="cap-row"><span class="cap"><sc-if value="{{ showIdle }}" hint-placeholder-val="{{ true }}"><span>Tap Play to watch 3 slow reps.</span></sc-if><sc-if value="{{ showEnded }}" hint-placeholder-val="{{ true }}"><span>Done. Tap Replay to watch again.</span></sc-if><sc-if value="{{ showCaps }}" hint-placeholder-val="{{ true }}"><span class="stack"><span class="capx c1">Press out, 1 s</span><span class="capx c2">Pause, don’t lock out</span><span class="capx c3">Back slowly, 2 s</span><span class="capx c4">Reset, light chest stretch</span></span></sc-if><sc-if value="{{ showStill1 }}" hint-placeholder-val="{{ true }}"><span>Setup: handles at mid-chest</span></sc-if><sc-if value="{{ showStill3 }}" hint-placeholder-val="{{ true }}"><span>Arms almost straight, no lock</span></sc-if><sc-if value="{{ showPicsLine }}" hint-placeholder-val="{{ true }}"><span>Press out 1 s, pause, back 2 s</span></sc-if></span><sc-if value="{{ showTempo }}" hint-placeholder-val="{{ true }}"><span class="tempo">1 s out · 2 s back</span></sc-if></div>
<div class="chips"><button class="chip chip-btn" type="button" aria-pressed="{{ z1 }}" onClick="{{ pick1 }}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Grip</button><button class="chip chip-btn" type="button" aria-pressed="{{ z2 }}" onClick="{{ pick2 }}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Path</button><button class="chip chip-btn" type="button" aria-pressed="{{ z3 }}" onClick="{{ pick3 }}"><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>Seat</button></div>
<div class="controls">
<button class="btn-icon" type="button" aria-label="{{ playLabel }}" onClick="{{ togglePlay }}" disabled="{{ playDisabled }}"><sc-if value="{{ isPlay }}" hint-placeholder-val="{{ true }}"><span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg></span></sc-if><sc-if value="{{ isPause }}" hint-placeholder-val="{{ true }}"><span><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14M16 5v14"/></svg></span></sc-if><sc-if value="{{ isReplay }}" hint-placeholder-val="{{ true }}"><span><svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg></span></sc-if></button>
<div class="seg speed"><button type="button" aria-pressed="{{ speed1 }}" onClick="{{ speedTo1 }}">1x</button><button type="button" aria-pressed="{{ speedHalf }}" onClick="{{ speedToHalf }}">0.5x</button></div>
<span class="grow"></span>
<div class="seg mode"><button type="button" aria-pressed="{{ modeAnim }}" onClick="{{ toAnim }}" disabled="{{ animDisabled }}">Animation</button><button type="button" aria-pressed="{{ modePics }}" onClick="{{ toPics }}">Pictures</button></div>
</div>
<p class="hint"><sc-if value="{{ hintAnim }}" hint-placeholder-val="{{ true }}"><span>Tap a zoom chip to look closer. Tap it again to zoom out.</span></sc-if><sc-if value="{{ hintPics }}" hint-placeholder-val="{{ true }}"><span>Four key moments of one rep.</span></sc-if><sc-if value="{{ hintRm }}" hint-placeholder-val="{{ true }}"><span>Pictures shown because your phone is set to reduce motion.</span></sc-if></p>
<p class="sr">One rep: press out for 1 second, pause, back slowly for 2 seconds, reset.</p>
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


.cp-ua{transform-origin:0px -62px}.gen-a .cp-ua{animation-name:cp-ua-a}.gen-b .cp-ua{animation-name:cp-ua-b}
.cp-ul{transform-origin:0px -62px}.gen-a .cp-ul{animation-name:cp-ul-a}.gen-b .cp-ul{animation-name:cp-ul-b}
.cp-fa{transform-origin:0px -24px}.gen-a .cp-fa{animation-name:cp-fa-a}.gen-b .cp-fa{animation-name:cp-fa-b}
.cp-fl{transform-origin:0px -24px}.gen-a .cp-fl{animation-name:cp-fl-a}.gen-b .cp-fl{animation-name:cp-fl-b}
.gen-a .cp-hd{animation-name:cp-hd-a}.gen-b .cp-hd{animation-name:cp-hd-b}
.cp-lever{transform-origin:203.5px 58px}.gen-a .cp-lever{animation-name:cp-lever-a}.gen-b .cp-lever{animation-name:cp-lever-b}
.gen-a .cp-stack{animation-name:cp-stack-a}.gen-b .cp-stack{animation-name:cp-stack-b}
.cp-cable{transform-origin:50px 61px}.gen-a .cp-cable{animation-name:cp-cable-a}.gen-b .cp-cable{animation-name:cp-cable-b}
.gen-a .cp-trail{animation-name:cp-trail-a}.gen-b .cp-trail{animation-name:cp-trail-b}
.gen-a .cp-eff{animation-name:cp-eff-a}.gen-b .cp-eff{animation-name:cp-eff-b}
@keyframes cp-ua-a{0%{transform:rotate(14.04deg)}1.25%{transform:rotate(13.51deg)}2.5%{transform:rotate(12.03deg)}3.75%{transform:rotate(9.56deg)}5%{transform:rotate(5.98deg)}6.25%{transform:rotate(1.19deg)}7.5%{transform:rotate(-4.81deg)}8.75%{transform:rotate(-11.86deg)}10%{transform:rotate(-19.59deg)}11.25%{transform:rotate(-27.56deg)}12.5%{transform:rotate(-35.41deg)}13.75%{transform:rotate(-42.37deg)}15%{transform:rotate(-48.11deg)}16.25%{transform:rotate(-52.97deg)}17.5%{transform:rotate(-57.23deg)}18.75%{transform:rotate(-61.06deg)}20%{transform:rotate(-64.62deg)}21.25%{transform:rotate(-67.98deg)}22.5%{transform:rotate(-71.15deg)}23.75%{transform:rotate(-73.86deg)}25%{transform:rotate(-75.14deg)}37.5%{transform:rotate(-75.14deg)}40.63%{transform:rotate(-73.26deg)}43.75%{transform:rotate(-69.6deg)}46.88%{transform:rotate(-65.47deg)}50%{transform:rotate(-61.06deg)}53.13%{transform:rotate(-56.21deg)}56.25%{transform:rotate(-50.63deg)}59.38%{transform:rotate(-43.9deg)}62.5%{transform:rotate(-35.41deg)}65.63%{transform:rotate(-25.57deg)}68.75%{transform:rotate(-15.67deg)}71.88%{transform:rotate(-6.49deg)}75%{transform:rotate(1.19deg)}78.13%{transform:rotate(6.99deg)}81.25%{transform:rotate(10.93deg)}84.38%{transform:rotate(13.23deg)}87.5%{transform:rotate(14.04deg)}100%{transform:rotate(14.04deg)}}
@keyframes cp-ua-b{0%{transform:rotate(14.04deg)}1.25%{transform:rotate(13.51deg)}2.5%{transform:rotate(12.03deg)}3.75%{transform:rotate(9.56deg)}5%{transform:rotate(5.98deg)}6.25%{transform:rotate(1.19deg)}7.5%{transform:rotate(-4.81deg)}8.75%{transform:rotate(-11.86deg)}10%{transform:rotate(-19.59deg)}11.25%{transform:rotate(-27.56deg)}12.5%{transform:rotate(-35.41deg)}13.75%{transform:rotate(-42.37deg)}15%{transform:rotate(-48.11deg)}16.25%{transform:rotate(-52.97deg)}17.5%{transform:rotate(-57.23deg)}18.75%{transform:rotate(-61.06deg)}20%{transform:rotate(-64.62deg)}21.25%{transform:rotate(-67.98deg)}22.5%{transform:rotate(-71.15deg)}23.75%{transform:rotate(-73.86deg)}25%{transform:rotate(-75.14deg)}37.5%{transform:rotate(-75.14deg)}40.63%{transform:rotate(-73.26deg)}43.75%{transform:rotate(-69.6deg)}46.88%{transform:rotate(-65.47deg)}50%{transform:rotate(-61.06deg)}53.13%{transform:rotate(-56.21deg)}56.25%{transform:rotate(-50.63deg)}59.38%{transform:rotate(-43.9deg)}62.5%{transform:rotate(-35.41deg)}65.63%{transform:rotate(-25.57deg)}68.75%{transform:rotate(-15.67deg)}71.88%{transform:rotate(-6.49deg)}75%{transform:rotate(1.19deg)}78.13%{transform:rotate(6.99deg)}81.25%{transform:rotate(10.93deg)}84.38%{transform:rotate(13.23deg)}87.5%{transform:rotate(14.04deg)}100%{transform:rotate(14.04deg)}}
@keyframes cp-ul-a{0%{transform:scaleY(0.597)}1.25%{transform:scaleY(0.594)}2.5%{transform:scaleY(0.586)}3.75%{transform:scaleY(0.576)}5%{transform:scaleY(0.566)}6.25%{transform:scaleY(0.557)}7.5%{transform:scaleY(0.553)}8.75%{transform:scaleY(0.558)}10%{transform:scaleY(0.574)}11.25%{transform:scaleY(0.603)}12.5%{transform:scaleY(0.645)}13.75%{transform:scaleY(0.696)}15%{transform:scaleY(0.747)}16.25%{transform:scaleY(0.796)}17.5%{transform:scaleY(0.841)}18.75%{transform:scaleY(0.881)}20%{transform:scaleY(0.915)}21.25%{transform:scaleY(0.942)}22.5%{transform:scaleY(0.963)}23.75%{transform:scaleY(0.977)}25%{transform:scaleY(0.982)}37.5%{transform:scaleY(0.982)}40.63%{transform:scaleY(0.974)}43.75%{transform:scaleY(0.953)}46.88%{transform:scaleY(0.922)}50%{transform:scaleY(0.881)}53.13%{transform:scaleY(0.83)}56.25%{transform:scaleY(0.772)}59.38%{transform:scaleY(0.709)}62.5%{transform:scaleY(0.645)}65.63%{transform:scaleY(0.595)}68.75%{transform:scaleY(0.565)}71.88%{transform:scaleY(0.554)}75%{transform:scaleY(0.557)}78.13%{transform:scaleY(0.568)}81.25%{transform:scaleY(0.582)}84.38%{transform:scaleY(0.592)}87.5%{transform:scaleY(0.597)}100%{transform:scaleY(0.597)}}
@keyframes cp-ul-b{0%{transform:scaleY(0.597)}1.25%{transform:scaleY(0.594)}2.5%{transform:scaleY(0.586)}3.75%{transform:scaleY(0.576)}5%{transform:scaleY(0.566)}6.25%{transform:scaleY(0.557)}7.5%{transform:scaleY(0.553)}8.75%{transform:scaleY(0.558)}10%{transform:scaleY(0.574)}11.25%{transform:scaleY(0.603)}12.5%{transform:scaleY(0.645)}13.75%{transform:scaleY(0.696)}15%{transform:scaleY(0.747)}16.25%{transform:scaleY(0.796)}17.5%{transform:scaleY(0.841)}18.75%{transform:scaleY(0.881)}20%{transform:scaleY(0.915)}21.25%{transform:scaleY(0.942)}22.5%{transform:scaleY(0.963)}23.75%{transform:scaleY(0.977)}25%{transform:scaleY(0.982)}37.5%{transform:scaleY(0.982)}40.63%{transform:scaleY(0.974)}43.75%{transform:scaleY(0.953)}46.88%{transform:scaleY(0.922)}50%{transform:scaleY(0.881)}53.13%{transform:scaleY(0.83)}56.25%{transform:scaleY(0.772)}59.38%{transform:scaleY(0.709)}62.5%{transform:scaleY(0.645)}65.63%{transform:scaleY(0.595)}68.75%{transform:scaleY(0.565)}71.88%{transform:scaleY(0.554)}75%{transform:scaleY(0.557)}78.13%{transform:scaleY(0.568)}81.25%{transform:scaleY(0.582)}84.38%{transform:scaleY(0.592)}87.5%{transform:scaleY(0.597)}100%{transform:scaleY(0.597)}}
@keyframes cp-fa-a{0%{transform:translateY(-15.32px) rotate(-120.18deg)}1.25%{transform:translateY(-15.43px) rotate(-119.35deg)}2.5%{transform:translateY(-15.72px) rotate(-117.14deg)}3.75%{transform:translateY(-16.1px) rotate(-113.71deg)}5%{transform:translateY(-16.51px) rotate(-109.1deg)}6.25%{transform:translateY(-16.84px) rotate(-103.31deg)}7.5%{transform:translateY(-16.97px) rotate(-96.4deg)}8.75%{transform:translateY(-16.79px) rotate(-88.58deg)}10%{transform:translateY(-16.17px) rotate(-80.19deg)}11.25%{transform:translateY(-15.08px) rotate(-71.65deg)}12.5%{transform:translateY(-13.47px) rotate(-63.26deg)}13.75%{transform:translateY(-11.56px) rotate(-55.76deg)}15%{transform:translateY(-9.62px) rotate(-49.43deg)}16.25%{transform:translateY(-7.76px) rotate(-43.86deg)}17.5%{transform:translateY(-6.05px) rotate(-38.73deg)}18.75%{transform:translateY(-4.53px) rotate(-33.81deg)}20%{transform:translateY(-3.25px) rotate(-28.91deg)}21.25%{transform:translateY(-2.2px) rotate(-23.93deg)}22.5%{transform:translateY(-1.41px) rotate(-18.92deg)}23.75%{transform:translateY(-0.89px) rotate(-14.41deg)}25%{transform:translateY(-0.69px) rotate(-12.19deg)}37.5%{transform:translateY(-0.69px) rotate(-12.19deg)}40.63%{transform:translateY(-0.99px) rotate(-15.42deg)}43.75%{transform:translateY(-1.77px) rotate(-21.42deg)}46.88%{transform:translateY(-2.96px) rotate(-27.67deg)}50%{transform:translateY(-4.53px) rotate(-33.81deg)}53.13%{transform:translateY(-6.46px) rotate(-39.98deg)}56.25%{transform:translateY(-8.68px) rotate(-46.57deg)}59.38%{transform:translateY(-11.07px) rotate(-54.09deg)}62.5%{transform:translateY(-13.47px) rotate(-63.26deg)}65.63%{transform:translateY(-15.4px) rotate(-73.78deg)}68.75%{transform:translateY(-16.54px) rotate(-84.43deg)}71.88%{transform:translateY(-16.96px) rotate(-94.52deg)}75%{transform:translateY(-16.84px) rotate(-103.31deg)}78.13%{transform:translateY(-16.41px) rotate(-110.36deg)}81.25%{transform:translateY(-15.9px) rotate(-115.57deg)}84.38%{transform:translateY(-15.49px) rotate(-118.92deg)}87.5%{transform:translateY(-15.32px) rotate(-120.18deg)}100%{transform:translateY(-15.32px) rotate(-120.18deg)}}
@keyframes cp-fa-b{0%{transform:translateY(-15.32px) rotate(-120.18deg)}1.25%{transform:translateY(-15.43px) rotate(-119.35deg)}2.5%{transform:translateY(-15.72px) rotate(-117.14deg)}3.75%{transform:translateY(-16.1px) rotate(-113.71deg)}5%{transform:translateY(-16.51px) rotate(-109.1deg)}6.25%{transform:translateY(-16.84px) rotate(-103.31deg)}7.5%{transform:translateY(-16.97px) rotate(-96.4deg)}8.75%{transform:translateY(-16.79px) rotate(-88.58deg)}10%{transform:translateY(-16.17px) rotate(-80.19deg)}11.25%{transform:translateY(-15.08px) rotate(-71.65deg)}12.5%{transform:translateY(-13.47px) rotate(-63.26deg)}13.75%{transform:translateY(-11.56px) rotate(-55.76deg)}15%{transform:translateY(-9.62px) rotate(-49.43deg)}16.25%{transform:translateY(-7.76px) rotate(-43.86deg)}17.5%{transform:translateY(-6.05px) rotate(-38.73deg)}18.75%{transform:translateY(-4.53px) rotate(-33.81deg)}20%{transform:translateY(-3.25px) rotate(-28.91deg)}21.25%{transform:translateY(-2.2px) rotate(-23.93deg)}22.5%{transform:translateY(-1.41px) rotate(-18.92deg)}23.75%{transform:translateY(-0.89px) rotate(-14.41deg)}25%{transform:translateY(-0.69px) rotate(-12.19deg)}37.5%{transform:translateY(-0.69px) rotate(-12.19deg)}40.63%{transform:translateY(-0.99px) rotate(-15.42deg)}43.75%{transform:translateY(-1.77px) rotate(-21.42deg)}46.88%{transform:translateY(-2.96px) rotate(-27.67deg)}50%{transform:translateY(-4.53px) rotate(-33.81deg)}53.13%{transform:translateY(-6.46px) rotate(-39.98deg)}56.25%{transform:translateY(-8.68px) rotate(-46.57deg)}59.38%{transform:translateY(-11.07px) rotate(-54.09deg)}62.5%{transform:translateY(-13.47px) rotate(-63.26deg)}65.63%{transform:translateY(-15.4px) rotate(-73.78deg)}68.75%{transform:translateY(-16.54px) rotate(-84.43deg)}71.88%{transform:translateY(-16.96px) rotate(-94.52deg)}75%{transform:translateY(-16.84px) rotate(-103.31deg)}78.13%{transform:translateY(-16.41px) rotate(-110.36deg)}81.25%{transform:translateY(-15.9px) rotate(-115.57deg)}84.38%{transform:translateY(-15.49px) rotate(-118.92deg)}87.5%{transform:translateY(-15.32px) rotate(-120.18deg)}100%{transform:translateY(-15.32px) rotate(-120.18deg)}}
@keyframes cp-fl-a{0%{transform:scaleY(0.95)}1.25%{transform:scaleY(0.953)}2.5%{transform:scaleY(0.962)}3.75%{transform:scaleY(0.972)}5%{transform:scaleY(0.982)}6.25%{transform:scaleY(0.991)}7.5%{transform:scaleY(0.997)}8.75%{transform:scaleY(1)}10%{transform:scaleY(1)}11.25%{transform:scaleY(0.997)}12.5%{transform:scaleY(0.994)}13.75%{transform:scaleY(0.99)}15%{transform:scaleY(0.987)}16.25%{transform:scaleY(0.986)}17.5%{transform:scaleY(0.987)}18.75%{transform:scaleY(0.989)}20%{transform:scaleY(0.991)}21.25%{transform:scaleY(0.994)}22.5%{transform:scaleY(0.997)}23.75%{transform:scaleY(0.999)}25%{transform:scaleY(1)}37.5%{transform:scaleY(1)}40.63%{transform:scaleY(0.999)}43.75%{transform:scaleY(0.996)}46.88%{transform:scaleY(0.992)}50%{transform:scaleY(0.989)}53.13%{transform:scaleY(0.987)}56.25%{transform:scaleY(0.987)}59.38%{transform:scaleY(0.989)}62.5%{transform:scaleY(0.994)}65.63%{transform:scaleY(0.998)}68.75%{transform:scaleY(1)}71.88%{transform:scaleY(0.998)}75%{transform:scaleY(0.991)}78.13%{transform:scaleY(0.98)}81.25%{transform:scaleY(0.967)}84.38%{transform:scaleY(0.955)}87.5%{transform:scaleY(0.95)}100%{transform:scaleY(0.95)}}
@keyframes cp-fl-b{0%{transform:scaleY(0.95)}1.25%{transform:scaleY(0.953)}2.5%{transform:scaleY(0.962)}3.75%{transform:scaleY(0.972)}5%{transform:scaleY(0.982)}6.25%{transform:scaleY(0.991)}7.5%{transform:scaleY(0.997)}8.75%{transform:scaleY(1)}10%{transform:scaleY(1)}11.25%{transform:scaleY(0.997)}12.5%{transform:scaleY(0.994)}13.75%{transform:scaleY(0.99)}15%{transform:scaleY(0.987)}16.25%{transform:scaleY(0.986)}17.5%{transform:scaleY(0.987)}18.75%{transform:scaleY(0.989)}20%{transform:scaleY(0.991)}21.25%{transform:scaleY(0.994)}22.5%{transform:scaleY(0.997)}23.75%{transform:scaleY(0.999)}25%{transform:scaleY(1)}37.5%{transform:scaleY(1)}40.63%{transform:scaleY(0.999)}43.75%{transform:scaleY(0.996)}46.88%{transform:scaleY(0.992)}50%{transform:scaleY(0.989)}53.13%{transform:scaleY(0.987)}56.25%{transform:scaleY(0.987)}59.38%{transform:scaleY(0.989)}62.5%{transform:scaleY(0.994)}65.63%{transform:scaleY(0.998)}68.75%{transform:scaleY(1)}71.88%{transform:scaleY(0.998)}75%{transform:scaleY(0.991)}78.13%{transform:scaleY(0.98)}81.25%{transform:scaleY(0.967)}84.38%{transform:scaleY(0.955)}87.5%{transform:scaleY(0.95)}100%{transform:scaleY(0.95)}}
@keyframes cp-hd-a{0%{transform:translateY(-2px)}1.25%{transform:translateY(-1.87px)}2.5%{transform:translateY(-1.54px)}3.75%{transform:translateY(-1.12px)}5%{transform:translateY(-0.71px)}6.25%{transform:translateY(-0.37px)}7.5%{transform:translateY(-0.13px)}8.75%{transform:translateY(-0.01px)}10%{transform:translateY(-0.01px)}11.25%{transform:translateY(-0.11px)}12.5%{transform:translateY(-0.26px)}13.75%{transform:translateY(-0.41px)}15%{transform:translateY(-0.51px)}16.25%{transform:translateY(-0.55px)}17.5%{transform:translateY(-0.52px)}18.75%{transform:translateY(-0.45px)}20%{transform:translateY(-0.34px)}21.25%{transform:translateY(-0.22px)}22.5%{transform:translateY(-0.12px)}23.75%{transform:translateY(-0.04px)}25%{transform:translateY(-0.02px)}37.5%{transform:translateY(-0.02px)}40.63%{transform:translateY(-0.06px)}43.75%{transform:translateY(-0.17px)}46.88%{transform:translateY(-0.32px)}50%{transform:translateY(-0.45px)}53.13%{transform:translateY(-0.54px)}56.25%{transform:translateY(-0.53px)}59.38%{transform:translateY(-0.44px)}62.5%{transform:translateY(-0.26px)}65.63%{transform:translateY(-0.08px)}68.75%{transform:translateY(0px)}71.88%{transform:translateY(-0.09px)}75%{transform:translateY(-0.37px)}78.13%{transform:translateY(-0.81px)}81.25%{transform:translateY(-1.34px)}84.38%{transform:translateY(-1.8px)}87.5%{transform:translateY(-2px)}100%{transform:translateY(-2px)}}
@keyframes cp-hd-b{0%{transform:translateY(-2px)}1.25%{transform:translateY(-1.87px)}2.5%{transform:translateY(-1.54px)}3.75%{transform:translateY(-1.12px)}5%{transform:translateY(-0.71px)}6.25%{transform:translateY(-0.37px)}7.5%{transform:translateY(-0.13px)}8.75%{transform:translateY(-0.01px)}10%{transform:translateY(-0.01px)}11.25%{transform:translateY(-0.11px)}12.5%{transform:translateY(-0.26px)}13.75%{transform:translateY(-0.41px)}15%{transform:translateY(-0.51px)}16.25%{transform:translateY(-0.55px)}17.5%{transform:translateY(-0.52px)}18.75%{transform:translateY(-0.45px)}20%{transform:translateY(-0.34px)}21.25%{transform:translateY(-0.22px)}22.5%{transform:translateY(-0.12px)}23.75%{transform:translateY(-0.04px)}25%{transform:translateY(-0.02px)}37.5%{transform:translateY(-0.02px)}40.63%{transform:translateY(-0.06px)}43.75%{transform:translateY(-0.17px)}46.88%{transform:translateY(-0.32px)}50%{transform:translateY(-0.45px)}53.13%{transform:translateY(-0.54px)}56.25%{transform:translateY(-0.53px)}59.38%{transform:translateY(-0.44px)}62.5%{transform:translateY(-0.26px)}65.63%{transform:translateY(-0.08px)}68.75%{transform:translateY(0px)}71.88%{transform:translateY(-0.09px)}75%{transform:translateY(-0.37px)}78.13%{transform:translateY(-0.81px)}81.25%{transform:translateY(-1.34px)}84.38%{transform:translateY(-1.8px)}87.5%{transform:translateY(-2px)}100%{transform:translateY(-2px)}}
@keyframes cp-lever-a{0%{transform:rotate(13deg)}1.25%{transform:rotate(12.76deg)}2.5%{transform:rotate(12.13deg)}3.75%{transform:rotate(11.21deg)}5%{transform:rotate(10.07deg)}6.25%{transform:rotate(8.74deg)}7.5%{transform:rotate(7.25deg)}8.75%{transform:rotate(5.63deg)}10%{transform:rotate(3.89deg)}11.25%{transform:rotate(2.01deg)}12.5%{transform:rotate(0deg)}13.75%{transform:rotate(-2.01deg)}15%{transform:rotate(-3.89deg)}16.25%{transform:rotate(-5.63deg)}17.5%{transform:rotate(-7.25deg)}18.75%{transform:rotate(-8.74deg)}20%{transform:rotate(-10.07deg)}21.25%{transform:rotate(-11.21deg)}22.5%{transform:rotate(-12.13deg)}23.75%{transform:rotate(-12.76deg)}25%{transform:rotate(-13deg)}37.5%{transform:rotate(-13deg)}40.63%{transform:rotate(-12.63deg)}43.75%{transform:rotate(-11.7deg)}46.88%{transform:rotate(-10.37deg)}50%{transform:rotate(-8.74deg)}53.13%{transform:rotate(-6.86deg)}56.25%{transform:rotate(-4.77deg)}59.38%{transform:rotate(-2.49deg)}62.5%{transform:rotate(0deg)}65.63%{transform:rotate(2.49deg)}68.75%{transform:rotate(4.77deg)}71.88%{transform:rotate(6.86deg)}75%{transform:rotate(8.74deg)}78.13%{transform:rotate(10.37deg)}81.25%{transform:rotate(11.7deg)}84.38%{transform:rotate(12.63deg)}87.5%{transform:rotate(13deg)}100%{transform:rotate(13deg)}}
@keyframes cp-lever-b{0%{transform:rotate(13deg)}1.25%{transform:rotate(12.76deg)}2.5%{transform:rotate(12.13deg)}3.75%{transform:rotate(11.21deg)}5%{transform:rotate(10.07deg)}6.25%{transform:rotate(8.74deg)}7.5%{transform:rotate(7.25deg)}8.75%{transform:rotate(5.63deg)}10%{transform:rotate(3.89deg)}11.25%{transform:rotate(2.01deg)}12.5%{transform:rotate(0deg)}13.75%{transform:rotate(-2.01deg)}15%{transform:rotate(-3.89deg)}16.25%{transform:rotate(-5.63deg)}17.5%{transform:rotate(-7.25deg)}18.75%{transform:rotate(-8.74deg)}20%{transform:rotate(-10.07deg)}21.25%{transform:rotate(-11.21deg)}22.5%{transform:rotate(-12.13deg)}23.75%{transform:rotate(-12.76deg)}25%{transform:rotate(-13deg)}37.5%{transform:rotate(-13deg)}40.63%{transform:rotate(-12.63deg)}43.75%{transform:rotate(-11.7deg)}46.88%{transform:rotate(-10.37deg)}50%{transform:rotate(-8.74deg)}53.13%{transform:rotate(-6.86deg)}56.25%{transform:rotate(-4.77deg)}59.38%{transform:rotate(-2.49deg)}62.5%{transform:rotate(0deg)}65.63%{transform:rotate(2.49deg)}68.75%{transform:rotate(4.77deg)}71.88%{transform:rotate(6.86deg)}75%{transform:rotate(8.74deg)}78.13%{transform:rotate(10.37deg)}81.25%{transform:rotate(11.7deg)}84.38%{transform:rotate(12.63deg)}87.5%{transform:rotate(13deg)}100%{transform:rotate(13deg)}}
@keyframes cp-stack-a{0%{transform:translateY(0px)}1.25%{transform:translateY(-0.21px)}2.5%{transform:translateY(-0.74px)}3.75%{transform:translateY(-1.53px)}5%{transform:translateY(-2.51px)}6.25%{transform:translateY(-3.65px)}7.5%{transform:translateY(-4.94px)}8.75%{transform:translateY(-6.34px)}10%{transform:translateY(-7.86px)}11.25%{transform:translateY(-9.49px)}12.5%{transform:translateY(-11.25px)}13.75%{transform:translateY(-13.01px)}15%{transform:translateY(-14.64px)}16.25%{transform:translateY(-16.16px)}17.5%{transform:translateY(-17.56px)}18.75%{transform:translateY(-18.85px)}20%{transform:translateY(-19.99px)}21.25%{transform:translateY(-20.97px)}22.5%{transform:translateY(-21.76px)}23.75%{transform:translateY(-22.29px)}25%{transform:translateY(-22.5px)}37.5%{transform:translateY(-22.5px)}40.63%{transform:translateY(-22.19px)}43.75%{transform:translateY(-21.39px)}46.88%{transform:translateY(-20.25px)}50%{transform:translateY(-18.85px)}53.13%{transform:translateY(-17.22px)}56.25%{transform:translateY(-15.41px)}59.38%{transform:translateY(-13.43px)}62.5%{transform:translateY(-11.25px)}65.63%{transform:translateY(-9.07px)}68.75%{transform:translateY(-7.09px)}71.88%{transform:translateY(-5.28px)}75%{transform:translateY(-3.65px)}78.13%{transform:translateY(-2.25px)}81.25%{transform:translateY(-1.11px)}84.38%{transform:translateY(-0.31px)}87.5%{transform:translateY(0px)}100%{transform:translateY(0px)}}
@keyframes cp-stack-b{0%{transform:translateY(0px)}1.25%{transform:translateY(-0.21px)}2.5%{transform:translateY(-0.74px)}3.75%{transform:translateY(-1.53px)}5%{transform:translateY(-2.51px)}6.25%{transform:translateY(-3.65px)}7.5%{transform:translateY(-4.94px)}8.75%{transform:translateY(-6.34px)}10%{transform:translateY(-7.86px)}11.25%{transform:translateY(-9.49px)}12.5%{transform:translateY(-11.25px)}13.75%{transform:translateY(-13.01px)}15%{transform:translateY(-14.64px)}16.25%{transform:translateY(-16.16px)}17.5%{transform:translateY(-17.56px)}18.75%{transform:translateY(-18.85px)}20%{transform:translateY(-19.99px)}21.25%{transform:translateY(-20.97px)}22.5%{transform:translateY(-21.76px)}23.75%{transform:translateY(-22.29px)}25%{transform:translateY(-22.5px)}37.5%{transform:translateY(-22.5px)}40.63%{transform:translateY(-22.19px)}43.75%{transform:translateY(-21.39px)}46.88%{transform:translateY(-20.25px)}50%{transform:translateY(-18.85px)}53.13%{transform:translateY(-17.22px)}56.25%{transform:translateY(-15.41px)}59.38%{transform:translateY(-13.43px)}62.5%{transform:translateY(-11.25px)}65.63%{transform:translateY(-9.07px)}68.75%{transform:translateY(-7.09px)}71.88%{transform:translateY(-5.28px)}75%{transform:translateY(-3.65px)}78.13%{transform:translateY(-2.25px)}81.25%{transform:translateY(-1.11px)}84.38%{transform:translateY(-0.31px)}87.5%{transform:translateY(0px)}100%{transform:translateY(0px)}}
@keyframes cp-cable-a{0%{transform:scaleY(1)}1.25%{transform:scaleY(0.995)}2.5%{transform:scaleY(0.983)}3.75%{transform:scaleY(0.966)}5%{transform:scaleY(0.944)}6.25%{transform:scaleY(0.919)}7.5%{transform:scaleY(0.89)}8.75%{transform:scaleY(0.859)}10%{transform:scaleY(0.825)}11.25%{transform:scaleY(0.789)}12.5%{transform:scaleY(0.75)}13.75%{transform:scaleY(0.711)}15%{transform:scaleY(0.675)}16.25%{transform:scaleY(0.641)}17.5%{transform:scaleY(0.61)}18.75%{transform:scaleY(0.581)}20%{transform:scaleY(0.556)}21.25%{transform:scaleY(0.534)}22.5%{transform:scaleY(0.517)}23.75%{transform:scaleY(0.505)}25%{transform:scaleY(0.5)}37.5%{transform:scaleY(0.5)}40.63%{transform:scaleY(0.507)}43.75%{transform:scaleY(0.525)}46.88%{transform:scaleY(0.55)}50%{transform:scaleY(0.581)}53.13%{transform:scaleY(0.617)}56.25%{transform:scaleY(0.658)}59.38%{transform:scaleY(0.702)}62.5%{transform:scaleY(0.75)}65.63%{transform:scaleY(0.798)}68.75%{transform:scaleY(0.842)}71.88%{transform:scaleY(0.883)}75%{transform:scaleY(0.919)}78.13%{transform:scaleY(0.95)}81.25%{transform:scaleY(0.975)}84.38%{transform:scaleY(0.993)}87.5%{transform:scaleY(1)}100%{transform:scaleY(1)}}
@keyframes cp-cable-b{0%{transform:scaleY(1)}1.25%{transform:scaleY(0.995)}2.5%{transform:scaleY(0.983)}3.75%{transform:scaleY(0.966)}5%{transform:scaleY(0.944)}6.25%{transform:scaleY(0.919)}7.5%{transform:scaleY(0.89)}8.75%{transform:scaleY(0.859)}10%{transform:scaleY(0.825)}11.25%{transform:scaleY(0.789)}12.5%{transform:scaleY(0.75)}13.75%{transform:scaleY(0.711)}15%{transform:scaleY(0.675)}16.25%{transform:scaleY(0.641)}17.5%{transform:scaleY(0.61)}18.75%{transform:scaleY(0.581)}20%{transform:scaleY(0.556)}21.25%{transform:scaleY(0.534)}22.5%{transform:scaleY(0.517)}23.75%{transform:scaleY(0.505)}25%{transform:scaleY(0.5)}37.5%{transform:scaleY(0.5)}40.63%{transform:scaleY(0.507)}43.75%{transform:scaleY(0.525)}46.88%{transform:scaleY(0.55)}50%{transform:scaleY(0.581)}53.13%{transform:scaleY(0.617)}56.25%{transform:scaleY(0.658)}59.38%{transform:scaleY(0.702)}62.5%{transform:scaleY(0.75)}65.63%{transform:scaleY(0.798)}68.75%{transform:scaleY(0.842)}71.88%{transform:scaleY(0.883)}75%{transform:scaleY(0.919)}78.13%{transform:scaleY(0.95)}81.25%{transform:scaleY(0.975)}84.38%{transform:scaleY(0.993)}87.5%{transform:scaleY(1)}100%{transform:scaleY(1)}}
@keyframes cp-trail-a{0%{stroke-dashoffset:1}1.25%{stroke-dashoffset:0.991}2.5%{stroke-dashoffset:0.966}3.75%{stroke-dashoffset:0.931}5%{stroke-dashoffset:0.887}6.25%{stroke-dashoffset:0.836}7.5%{stroke-dashoffset:0.779}8.75%{stroke-dashoffset:0.717}10%{stroke-dashoffset:0.649}11.25%{stroke-dashoffset:0.577}12.5%{stroke-dashoffset:0.5}13.75%{stroke-dashoffset:0.423}15%{stroke-dashoffset:0.351}16.25%{stroke-dashoffset:0.283}17.5%{stroke-dashoffset:0.221}18.75%{stroke-dashoffset:0.164}20%{stroke-dashoffset:0.113}21.25%{stroke-dashoffset:0.069}22.5%{stroke-dashoffset:0.034}23.75%{stroke-dashoffset:0.009}25%{stroke-dashoffset:0}37.5%{stroke-dashoffset:0}40.63%{stroke-dashoffset:0.014}43.75%{stroke-dashoffset:0.05}46.88%{stroke-dashoffset:0.101}50%{stroke-dashoffset:0.164}53.13%{stroke-dashoffset:0.236}56.25%{stroke-dashoffset:0.316}59.38%{stroke-dashoffset:0.404}62.5%{stroke-dashoffset:0.5}65.63%{stroke-dashoffset:0.596}68.75%{stroke-dashoffset:0.684}71.88%{stroke-dashoffset:0.764}75%{stroke-dashoffset:0.836}78.13%{stroke-dashoffset:0.899}81.25%{stroke-dashoffset:0.95}84.38%{stroke-dashoffset:0.986}87.5%{stroke-dashoffset:1}100%{stroke-dashoffset:1}}
@keyframes cp-trail-b{0%{stroke-dashoffset:1}1.25%{stroke-dashoffset:0.991}2.5%{stroke-dashoffset:0.966}3.75%{stroke-dashoffset:0.931}5%{stroke-dashoffset:0.887}6.25%{stroke-dashoffset:0.836}7.5%{stroke-dashoffset:0.779}8.75%{stroke-dashoffset:0.717}10%{stroke-dashoffset:0.649}11.25%{stroke-dashoffset:0.577}12.5%{stroke-dashoffset:0.5}13.75%{stroke-dashoffset:0.423}15%{stroke-dashoffset:0.351}16.25%{stroke-dashoffset:0.283}17.5%{stroke-dashoffset:0.221}18.75%{stroke-dashoffset:0.164}20%{stroke-dashoffset:0.113}21.25%{stroke-dashoffset:0.069}22.5%{stroke-dashoffset:0.034}23.75%{stroke-dashoffset:0.009}25%{stroke-dashoffset:0}37.5%{stroke-dashoffset:0}40.63%{stroke-dashoffset:0.014}43.75%{stroke-dashoffset:0.05}46.88%{stroke-dashoffset:0.101}50%{stroke-dashoffset:0.164}53.13%{stroke-dashoffset:0.236}56.25%{stroke-dashoffset:0.316}59.38%{stroke-dashoffset:0.404}62.5%{stroke-dashoffset:0.5}65.63%{stroke-dashoffset:0.596}68.75%{stroke-dashoffset:0.684}71.88%{stroke-dashoffset:0.764}75%{stroke-dashoffset:0.836}78.13%{stroke-dashoffset:0.899}81.25%{stroke-dashoffset:0.95}84.38%{stroke-dashoffset:0.986}87.5%{stroke-dashoffset:1}100%{stroke-dashoffset:1}}
@keyframes cp-eff-a{0%{opacity:0.75}1.25%{opacity:0.752}2.5%{opacity:0.758}3.75%{opacity:0.767}5%{opacity:0.778}6.25%{opacity:0.791}7.5%{opacity:0.805}8.75%{opacity:0.82}10%{opacity:0.837}11.25%{opacity:0.855}12.5%{opacity:0.875}13.75%{opacity:0.895}15%{opacity:0.913}16.25%{opacity:0.93}17.5%{opacity:0.945}18.75%{opacity:0.959}20%{opacity:0.972}21.25%{opacity:0.983}22.5%{opacity:0.992}23.75%{opacity:0.998}25%{opacity:1}37.5%{opacity:1}40.63%{opacity:0.997}43.75%{opacity:0.988}46.88%{opacity:0.975}50%{opacity:0.959}53.13%{opacity:0.941}56.25%{opacity:0.921}59.38%{opacity:0.899}62.5%{opacity:0.875}65.63%{opacity:0.851}68.75%{opacity:0.829}71.88%{opacity:0.809}75%{opacity:0.791}78.13%{opacity:0.775}81.25%{opacity:0.762}84.38%{opacity:0.753}87.5%{opacity:0.75}100%{opacity:0.75}}
@keyframes cp-eff-b{0%{opacity:0.75}1.25%{opacity:0.752}2.5%{opacity:0.758}3.75%{opacity:0.767}5%{opacity:0.778}6.25%{opacity:0.791}7.5%{opacity:0.805}8.75%{opacity:0.82}10%{opacity:0.837}11.25%{opacity:0.855}12.5%{opacity:0.875}13.75%{opacity:0.895}15%{opacity:0.913}16.25%{opacity:0.93}17.5%{opacity:0.945}18.75%{opacity:0.959}20%{opacity:0.972}21.25%{opacity:0.983}22.5%{opacity:0.992}23.75%{opacity:0.998}25%{opacity:1}37.5%{opacity:1}40.63%{opacity:0.997}43.75%{opacity:0.988}46.88%{opacity:0.975}50%{opacity:0.959}53.13%{opacity:0.941}56.25%{opacity:0.921}59.38%{opacity:0.899}62.5%{opacity:0.875}65.63%{opacity:0.851}68.75%{opacity:0.829}71.88%{opacity:0.809}75%{opacity:0.791}78.13%{opacity:0.775}81.25%{opacity:0.762}84.38%{opacity:0.753}87.5%{opacity:0.75}100%{opacity:0.75}}
.zoom-1 .cam{transform:translate(179px,138px) scale(2) translate(-206px,-157px)}
.zoom-2 .cam{transform:translate(179px,138px) scale(1.6) translate(-204px,-160px)}
.zoom-3 .cam{transform:translate(179px,138px) scale(1.7) translate(-150px,-190px)}
.zoom-1 .ov-grip,.zoom-3 .ov-seat{opacity:1}
.zoom-1 .far-lever{opacity:0}
/* Pictures stills (Pictures + a zoom chip): paused on key pose 1, or pose 3 (31 %) for Path */
.pictures .stage,.pictures .cap-row{--play:paused}
.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}
/* stack top bracket and cable: shown on the stage, hidden in the Pictures tiles (each tile <use> sets --stack-top:0) */
.stack-top{opacity:var(--stack-top,1)}
```

## 9. Markup pieces

### 9.1 Stage SVG: camera group, machine, far side, figure, lever, path guide, progress trail, near arm, zoom overlays

The whole scene sits in `<g class="cam">` (zoomed by the root class) and `<g id="rig-cp">` (cloned by the Pictures tiles).

```html
<svg class="scene" viewBox="0 0 358 276" aria-hidden="true"><g class="cam"><g id="rig-cp">
<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
<g class="machine-back"><rect class="eq" x="20" y="250" width="162" height="8" rx="1.5"/><line class="rod" x1="32" y1="56" x2="32" y2="250"/><line class="rod" x1="68" y1="56" x2="68" y2="250"/><rect class="eq" x="26" y="193.5" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="207" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="220.5" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="234" width="48" height="12" rx="1.5"/><g class="j anim cp-stack"><rect class="eq" x="26" y="112.5" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="126" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="139.5" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="153" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="166.5" width="48" height="12" rx="1.5"/><rect class="eq" x="26" y="180" width="48" height="12" rx="1.5"/><rect class="pin" x="73" y="184" width="9" height="4" rx="2"/><rect class="eqm stack-top" x="45" y="106" width="10" height="6.5" rx="1"/></g><rect class="eq" x="88" y="52" width="12" height="198" rx="1.5"/><rect class="eq" x="22" y="44" width="192" height="10" rx="2"/><line class="cable j anim cp-cable stack-top" x1="50" y1="61" x2="50" y2="106"/><circle class="eqm" cx="55" cy="61" r="5.2"/><line class="cable" x1="55" y1="55.8" x2="197.5" y2="55.8"/></g>
<g class="far-side" transform="translate(5 -3)"><g class="j anim cp-lever far-lever"><polygon class="eqf" points="200.9,58 206.1,58 206.1,146 200.9,146"/><rect class="hdf" x="200.3" y="145" width="6.4" height="26" rx="3"/></g><g transform="translate(150 206)"><g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)"><polygon class="olkf" points="7.76,3.21 3.21,7.76 -3.21,7.76 -7.76,3.21 -7.76,-3.21 -3.21,-7.76 3.21,-7.76 7.76,-3.21"/><polygon class="olkf" points="-8.5,-3 8.5,-3 8.2,20 6,47 0,51 -6,47 -8.4,22"/><g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)"><polygon class="olkf" points="5.54,52.3 2.3,55.54 -2.3,55.54 -5.54,52.3 -5.54,47.7 -2.3,44.46 2.3,44.46 5.54,47.7"/><polygon class="olkf" points="-5.5,49 5.5,49 5,62 4,94 -4,94 -7,64"/><polygon class="olkf" points="-5,93 3,93 8,97.5 17,99.5 17.5,102 -6,102 -6.5,97.5"/></g></g><g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)"><polygon class="bf" points="7.76,3.21 3.21,7.76 -3.21,7.76 -7.76,3.21 -7.76,-3.21 -3.21,-7.76 3.21,-7.76 7.76,-3.21"/><polygon class="bf" points="-8.5,-3 8.5,-3 8.2,20 6,47 0,51 -6,47 -8.4,22"/><g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)"><polygon class="bf" points="5.54,52.3 2.3,55.54 -2.3,55.54 -5.54,52.3 -5.54,47.7 -2.3,44.46 2.3,44.46 5.54,47.7"/><polygon class="bf" points="-5.5,49 5.5,49 5,62 4,94 -4,94 -7,64"/><polygon class="bf" points="-5,93 3,93 8,97.5 17,99.5 17.5,102 -6,102 -6.5,97.5"/></g></g></g></g>
<g class="machine-front"><rect class="eq" x="150" y="222" width="9" height="28"/><rect class="eq" x="100" y="168" width="26" height="8"/><rect class="eq" x="124.5" y="108" width="13" height="104" rx="4"/><rect class="eq" x="118" y="214" width="82" height="10" rx="4"/></g>
<g class="figure" transform="translate(150 206)"><polygon class="olk" points="-5,-63 -4.5,-73.5 5,-72.5 7,-64"/><polygon class="olk" points="-7,-67 -2,-70.5 6,-69.5 11,-65 15,-56 15.5,-46 12.5,-36 10,-25 9.5,-13 10.5,-3 7.5,6 -3,8.5 -10.5,6 -12.5,-3 -10.5,-15 -9.8,-26 -11.8,-40 -12.2,-52 -10.5,-62"/><polygon class="olk" points="-7,-86 -4.5,-92 3,-94 10,-91.5 13,-86 14,-82 16,-79.5 13.5,-77.5 12.5,-73.5 7,-71 1,-72 -4,-75.5"/><g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)"><polygon class="olk" points="7.76,3.21 3.21,7.76 -3.21,7.76 -7.76,3.21 -7.76,-3.21 -3.21,-7.76 3.21,-7.76 7.76,-3.21"/><polygon class="olk" points="-8.5,-3 8.5,-3 8.2,20 6,47 0,51 -6,47 -8.4,22"/><g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)"><polygon class="olk" points="5.54,52.3 2.3,55.54 -2.3,55.54 -5.54,52.3 -5.54,47.7 -2.3,44.46 2.3,44.46 5.54,47.7"/><polygon class="olk" points="-5.5,49 5.5,49 5,62 4,94 -4,94 -7,64"/><polygon class="olk" points="-5,93 3,93 8,97.5 17,99.5 17.5,102 -6,102 -6.5,97.5"/></g></g><polygon class="b" points="-5,-63 -4.5,-73.5 5,-72.5 7,-64"/><polygon class="b" points="-7,-67 -2,-70.5 6,-69.5 11,-65 15,-56 15.5,-46 12.5,-36 10,-25 9.5,-13 10.5,-3 7.5,6 -3,8.5 -10.5,6 -12.5,-3 -10.5,-15 -9.8,-26 -11.8,-40 -12.2,-52 -10.5,-62"/><polygon class="mm anim cp-eff" points="4,-66.5 11,-65 15,-56 15.5,-46 12.5,-36 5,-39 3,-52"/><polygon class="fc" points="-12.2,-52 -4,-55 -2,-40 -6,-28 -9.8,-26 -11.8,-40"/><polygon class="fc" points="-3,8.5 -10.5,6 -12.5,-3 -10.5,-15 -3,-9 1,3"/><polygon class="b" points="-7,-86 -4.5,-92 3,-94 10,-91.5 13,-86 14,-82 16,-79.5 13.5,-77.5 12.5,-73.5 7,-71 1,-72 -4,-75.5"/><polygon class="fc" points="-0.5,-83.5 3,-85 4.5,-81 3,-77.5 -0.5,-79"/><g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)"><polygon class="b" points="7.76,3.21 3.21,7.76 -3.21,7.76 -7.76,3.21 -7.76,-3.21 -3.21,-7.76 3.21,-7.76 7.76,-3.21"/><polygon class="b" points="-8.5,-3 8.5,-3 8.2,20 6,47 0,51 -6,47 -8.4,22"/><polygon class="fc" points="0.3,-3 8.5,-3 8.2,20 6,47 0.3,48"/><g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)"><polygon class="b" points="5.54,52.3 2.3,55.54 -2.3,55.54 -5.54,52.3 -5.54,47.7 -2.3,44.46 2.3,44.46 5.54,47.7"/><polygon class="b" points="-5.5,49 5.5,49 5,62 4,94 -4,94 -7,64"/><polygon class="fc" points="-5.5,49 0,49 0,94 -4,94 -7,64"/><polygon class="b" points="-5,93 3,93 8,97.5 17,99.5 17.5,102 -6,102 -6.5,97.5"/></g></g></g>
<g class="j anim cp-lever lever-near"><polygon class="eqm" points="200.9,58 206.1,58 206.1,146 200.9,146"/><rect class="hd" x="200.3" y="145" width="6.4" height="26" rx="3"/></g><circle class="eqm" cx="203.5" cy="58" r="7"/><circle class="rod" cx="203.5" cy="58" r="2"/>
<path class="guide" d="M178.08 168.1L179.64 168.45L181.21 168.78L182.78 169.08L184.36 169.37L185.94 169.63L187.53 169.87L189.11 170.08L190.71 170.27L192.3 170.44L193.89 170.59L195.49 170.72L197.09 170.82L198.69 170.9L200.29 170.95L201.9 170.99L203.5 171L205.1 170.99L206.71 170.95L208.31 170.9L209.91 170.82L211.51 170.72L213.11 170.59L214.7 170.44L216.29 170.27L217.89 170.08L219.47 169.87L221.06 169.63L222.64 169.37L224.22 169.08L225.79 168.78L227.36 168.45L228.93 168.1"/><path class="trail j anim cp-trail" d="M178.08 168.1L179.64 168.45L181.21 168.78L182.78 169.08L184.36 169.37L185.94 169.63L187.53 169.87L189.11 170.08L190.71 170.27L192.3 170.44L193.89 170.59L195.49 170.72L197.09 170.82L198.69 170.9L200.29 170.95L201.9 170.99L203.5 171L205.1 170.99L206.71 170.95L208.31 170.9L209.91 170.82L211.51 170.72L213.11 170.59L214.7 170.44L216.29 170.27L217.89 170.08L219.47 169.87L221.06 169.63L222.64 169.37L224.22 169.08L225.79 168.78L227.36 168.45L228.93 168.1" pathLength="1"/>
<g class="figure-arm" transform="translate(150 206)"><g class="j anim cp-ua arm-near"><g class="j anim cp-ul"><polygon class="olk" points="-5.5,-64 5.5,-64 6.2,-50 4.6,-27 0,-23 -4.6,-27 -6.2,-48"/></g><polygon class="olk" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.5,-57 5,-50 -1,-48.5 -6.5,-54"/><g class="j anim cp-ul"><polygon class="b" points="-5.5,-64 5.5,-64 6.2,-50 4.6,-27 0,-23 -4.6,-27 -6.2,-48"/><polygon class="fc" points="0.3,-64 5.5,-64 6.2,-50 4.6,-27 0.3,-25"/><polygon class="mh" points="-5.5,-64 0.3,-64 0.3,-25 -4.6,-27 -6.2,-48"/></g><polygon class="b" points="-6.5,-66 -2.5,-69.5 4,-69 7.5,-64.5 7.5,-57 5,-50 -1,-48.5 -6.5,-54"/><polygon class="mh" points="0.5,-69.3 4,-69 7.5,-64.5 7.5,-57 5,-50 1.5,-56"/><polygon class="fc" points="-6.5,-66 -2.5,-69.5 0.5,-69.3 1.5,-56 -1,-48.5 -6.5,-54"/><g class="j anim cp-fa"><polygon class="olk" points="4.25,-22.24 1.76,-19.75 -1.76,-19.75 -4.25,-22.24 -4.25,-25.76 -1.76,-28.25 1.76,-28.25 4.25,-25.76"/><g class="j anim cp-fl"><polygon class="olk" points="-4.8,-25 4.8,-25 5,-13 3.6,7 -3.6,7 -4.6,-13"/></g><g class="j anim cp-hd"><polygon class="olk" points="-4.2,6 4.2,6 6,11 6.5,19 3.5,23 -3,23 -5.5,18.5 -5.2,11"/></g><polygon class="b" points="4.25,-22.24 1.76,-19.75 -1.76,-19.75 -4.25,-22.24 -4.25,-25.76 -1.76,-28.25 1.76,-28.25 4.25,-25.76"/><g class="j anim cp-fl"><polygon class="b" points="-4.8,-25 4.8,-25 5,-13 3.6,7 -3.6,7 -4.6,-13"/><polygon class="fc" points="0.2,-25 4.8,-25 5,-13 3.6,7 0.2,7"/></g><g class="j anim cp-hd"><polygon class="b" points="-4.2,6 4.2,6 6,11 6.5,19 3.5,23 -3,23 -5.5,18.5 -5.2,11"/><polygon class="fc" points="4.2,6 6,11 6.5,19 3.5,23 1.5,15"/><circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/></g></g></g></g>
<path class="ov ov-seat ovs" d="M191 212H121A5 5 0 0 0 116 217V221A5 5 0 0 0 121 226H191"/>
</g></g></svg>
```

### 9.2 Pictures grid (4 key poses with captions)

```html
<div class="pics"><div class="tile"><svg viewBox="96 104 160 158" aria-hidden="true"><use href="#rig-cp" style="--play:paused;--sw:.75;--stack-top:0;--delay:calc(var(--dur) * -0)"/></svg><span class="badge">1</span><p>Setup: handles at mid-chest</p></div><div class="tile"><svg viewBox="96 104 160 158" aria-hidden="true"><use href="#rig-cp" style="--play:paused;--sw:.75;--stack-top:0;--delay:calc(var(--dur) * -0.125)"/><path class="arrow" d="M191.5 180L211.5 180"/><polygon class="arrow-head" points="217.5,180 211.5,184 211.5,176"/></svg><span class="badge">2</span><p>Press straight out</p></div><div class="tile"><svg viewBox="96 104 160 158" aria-hidden="true"><use href="#rig-cp" style="--play:paused;--sw:.75;--stack-top:0;--delay:calc(var(--dur) * -0.31)"/></svg><span class="badge">3</span><p>Arms almost straight, no lock</p></div><div class="tile"><svg viewBox="96 104 160 158" aria-hidden="true"><use href="#rig-cp" style="--play:paused;--sw:.75;--stack-top:0;--delay:calc(var(--dur) * -0.625)"/><path class="arrow" d="M217.5 180L197.5 180"/><polygon class="arrow-head" points="191.5,180 197.5,176 197.5,184"/></svg><span class="badge">4</span><p>Back slowly, 2 s</p></div></div>
```

### 9.3 Caption bubbles (one per zoom state; CSS shows the one that matches the root class)

```html
<div class="bubble bub-1"><span class="dot"></span><span>Hold the middle of the handle. Wrists straight, not bent back.</span></div>
<div class="bubble bub-2"><span class="dot"></span><span>Handles stay at mid-chest height the whole way out and back.</span></div>
<div class="bubble bub-3"><span class="dot"></span><span>Set the seat so the handles line up with the middle of your chest.</span></div>
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
// One rep is 4 s at 1x. Zoom chips: 1 Grip, 2 Path, 3 Seat (root classes zoom-1..3).
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
      showTempo: anim, // Pictures mode (grid or still) has no tempo note (RIG section 12); it would not fit beside a still's caption
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
- Hand on handle over 201 phases (`getCTM`), shoulder fixed, grip at the key poses matches section 3, every scene group inside the stage.
- Truth table (spec 3.1): elbow about 90 at setup and 155-168 pressed; arm 45-60 out from the side; setup arm forward -18 to -10 (elbows a little behind the body); pressed 75-85 forward; shoulder travel 88-100 degrees; upper arm never below 0.55. In the browser: the drawn setup elbow sits on the solved point, at least 4 behind the shoulder, and every arm outline point stays at least 2.05 from the back pad over 41 phases.
- Seat outline: one part (the pad), ending before the near shin. Path tip: does not say "straight".
- Round 3: the pause looks bent from the side, not locked. On the painted shoulder, elbow and grip at 25, 30 and 37.5 %, the drawn elbow angle is 155-169 and the elbow sits at least 3.9 below the shoulder-to-grip line (was 176.5 and 1.16: failed before the fix).
- Round 3: Pictures tile 1 has no cut-off bracket or cable at its top edge. The corner above the top plate shows only the tile background, and with the bracket forced back on it does not (so the probe looks in the right place). The whole figure, head to floor, fits inside the tile.
- Loop off (a real 12 s run): 3 reps, stop in the reset pose, Replay restarts through the `-b` set; 0.5x gives an 8 s rep and the Slow motion pill; Pause holds the frame; autoplay off starts on the setup pose.
- Phase captions: exactly one shows, the right one, in each window. The five themes paint from `?theme=`.
- Each zoom state: camera transform, only its own bubble, pill row and camera label hidden, subject inside the stage and above the bubble at 41 phases.
- Pictures: grid shown, 4 different poses; stills: grid hidden, Path still on pose 3, and the caption line shows that pose's picture caption.
- The caption row never overflows its 358 px width: 4 phases of the animation, the Pictures grid and all 3 stills.
- Reduced motion: paused even when the root style says running, grid shown, hint, Animation disabled.
- Every binding in the markup exists in `renderVals()`; no page errors.

## 12. Risks

| Risk | Handling |
|---|---|
| Someone edits a keyframe by hand and the hand leaves the handle | Change the section 13 edits in `build.mjs` (or `rig-final/gen.mjs`), then run `node build.mjs` (it rebuilds `rig/` too) and `node shoot.cjs`; the build stops if a replaced string is missing, and the checks fail on any gap over 0.5 units. |
| `sc-if` wrappers change layout in the canvas | Every wrapped element sits in a flex row or a grid cell and keeps its own class, so the wrapper only adds or removes it. Check once on the canvas. |
| A still shows the wrong pose if the canvas does not restart animations on a class change | The logic flips `gen`, which renames every animation and restarts it; checked in Chromium. |
| Page weight (about 60 KB) from the doubled keyframe sets | Generated, never typed. The real app plays the same samples with the Web Animations API and needs one copy. |
| The 200 ms timer stops the set a few ms before the CSS end (measured: 11.97 s of 12 s) | The last 0.5 s of every rep is the still reset pose, equal to the setup pose, so the frame is the same; checked that every animation stops inside that window and the grip sits at the setup position. |
| The pictures are a 2 x 2 grid, not one row | Spec 2.7 sets the grid; four tiles in one row would be 85 px wide, too small to read the pose. |
| This player's rig differs from the rig proof in `rig-final/` (section 13) | `build.mjs` applies each change as an exact-match edit to `rig-final/gen.mjs` and stops if a line it edits has changed. RIG.md sections 9, 15, 16, 17 and 19 still show the proof's chest press numbers until the section 13 rows are applied there. |
| The setup elbow sits close to the back pad (5.5 behind the shoulder) | Checked over 41 phases: the arm shape stays at least 2.05 from the pad, so the outlines never touch. Moving the elbow further back would put it on the pad. |
| The upper arm is drawn short early in the press (min fu 0.553, floor 0.55) | The end pole is blended in late (p to the 4th power), which keeps fu above the floor; the check fails the build below 0.55. |
| The pressed arm is 75.1 degrees forward, close to the spec's 75 floor | The visible bend needs the elbow about 4 below the shoulder-to-grip line, which lowers the upper arm. The end pole's downward weight 0.95 keeps it inside 75-85 (1.0 would give 74.97); the check fails the build below 75, and the build stops if the drawn pause angle goes above 169. |
| The canvas player (`project/Player-MachineChestPress.dc.html`) was assembled from these pieces and then edited for the canvas (text zoom `--tz`, fonts), so a rebuild here does not update it | Carry every change by exact-match edits (round 3: `work/r3/carry.mjs` swaps the changed arm keyframe sets, the `stack-top` markup and the CSS rule, and stops if any old string is missing). |
| The lever arc makes the handles dip 2.6 mid-press | Real lever machines do this. The Path tip does not promise a straight line (checked), and the dashed path shows the true curve. |

## 13. Changes from the rig proof (`rig-final/`), and why

The rig proof kept the setup elbow almost under the shoulder, so the shoulder turned about 78 degrees, not the 95 the truth table asks for. This player applies these changes on top of `rig-final/gen.mjs` (see `build.mjs`, step 0). Apply the same rows to RIG.md sections 9, 15, 16, 17 and 19 when the rig is next rebuilt.

| Rig proof | This player | Why |
|---|---|---|
| Setup elbow (149, 166), 1 behind the shoulder | (144.5, 166), 5.5 behind, z 30.49 | truth table: elbows a little behind the body at setup; the Reset caption promises a light chest stretch |
| Grip x 187 to 226, pivot (206.5, 58) | grip x 181 to 226, pivot (203.5, 58), lever 100, 13.0 degrees each side of straight down | with the elbow back, a handle at 187 is out of reach at about 90 degrees; the pivot sits over the middle of the travel so the arc stays even |
| Grip z 38.56 to 6 | 42.99 to 6 | keeps the forearm 40 long from the new setup elbow |
| pole1 = norm([-0.1, 0.6, 0.8]), blended linearly | pole1 = norm([0, 0.95, 1]), blended as p to the 4th power: pole(p) = norm((1 - p^4) pole0 + p^4 pole1) | the small end bend points down and a little out, so the side view shows it (round 3 decision 1), while the upper arm stays above 0.55 of its length |
| Arm forward -2.6 to 75.7 (78.3 degrees) | -14.0 to 75.1 (89.2 degrees) | truth table: about 95 (checked 88-100); round 3 gave up 4.5 degrees at the end for the visible bend |
| Elbow inside 89.2 to 163.4; out from side 54.6 | 88.0 to 162.5; 53.4 | still inside the truth table |
| Stack lift 0 to 19.5 | 0 to 22.5 (half the handle travel) | longer handle travel |
| Seat overlay: pad rect plus post rect | pad outline only, open at the front end | the post outline sat about 30 of its 44 px behind the bubble; the pad outline was drawn over the near shin |
| Path tip "... travel straight out." | "Handles stay at mid-chest height the whole way out and back." | the lever arc dips 2.6 at the grip mid-press, so "straight" did not match the picture |
| Pictures still caption line: the phase caption of the frame ("Press out, 1 s" on the setup pose) | that pose's picture caption | the setup pose now reads as setup |
| Stack top bracket and cable in every view | hidden in the Pictures tiles (`--stack-top:0`) | tile 1 showed them sliced at its top edge (round 3 decision 3) |

### Round 3 decisions (QA round 3)

1. **The pause shows a bend you can see from the side.** Before: the small end bend (17.5 degrees) pointed sideways, and a side camera cannot show a sideways bend. So the pause arm was drawn almost straight (176.5 degrees, the elbow 1.2 below the shoulder-to-grip line, behind a fist 12 wide) while the caption said "Pause, don’t lock out". A beginner would copy a lockout, the exact mistake the guide warns about. Chosen: the bend points down and a little out (end pole norm([0, 0.95, 1])), which is what the elbow does with these vertical, neutral-grip handles. Now the arm is drawn at 167.8 degrees with the elbow 4.1 below the line; the real elbow angle is unchanged (162.5). Cost: a lower elbow means a lower upper arm, so the pressed arm is 75.1 degrees forward (was 79.6) and the shoulder turns 89.2 degrees (was 93.7), both still inside the spec's checks (75-85 and 88-100). With the handles fixed at mid-chest, a bigger drop would take the arm below 75 degrees forward, so about 4 is the most the spec allows. The words already agree with the drawing: the pause caption "Pause, don’t lock out", tile 3 "Arms almost straight, no lock", About step 3 "Push the handles straight out until your arms are almost straight." and the second common mistake ("stop just before your arms are straight"). The spec's rig key-pose row for 25 and 37.5 % (spec 3.1) still shows the old pole and numbers; this section and section 3 are the current ones.
2. **The setup keeps its drawn angle (59.8 degrees).** The side camera draws the 88-degree setup elbow sharper because the upper arm points 53.4 degrees out to the side, toward the camera; a photo from the side shows the same. A scan of setup elbows (`work/r3/explore-e0.mjs`, with this end pole) found none that passes every check and draws much closer to 88: (146, 166) draws 62.9 but cuts shoulder travel to 85.4 (check 88-100); (145, 165) draws 61.7 but the upper arm shrinks to 0.527 of its length (floor 0.55); (144.5, 164.5) draws 61.0 with the upper arm at 0.516. A deeper-looking bend at the start does not teach a mistake, and the Reset caption and About step 4 ask for the light chest stretch this pose shows, so the setup stays.
3. **Pictures tiles hide the stack's top bracket and cable instead of moving the crop.** QA suggested starting the tile crop at y 113 or lower. The head's top is at y 112 and the bracket's bottom at 112.5, so no crop can drop the bracket and keep the head. The bracket and the cable carry class `stack-top`, and every tile's `<use>` sets `--stack-top:0`. The stage still shows them, where the cable visibly lifts the stack. In tiles 2 to 4 they were already above the tile, so only tile 1 looks different.
