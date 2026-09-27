// build.mjs: builds index.html (harness) and PLAYER.md (artboard drop-in pieces) for the
// Dumbbell Lateral Raise player. Source of the rig: ../rig-final/lateral-raise.html (written by
// rig-final/gen.mjs; read only here). Logic: ./logic.js. Run: node build.mjs
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const SRC = path.join(DIR, '..', 'rig-final', 'lateral-raise.html');
const src = fs.readFileSync(SRC, 'utf8');
const logic = fs.readFileSync(path.join(DIR, 'logic.js'), 'utf8').trim();

// Replace exactly one occurrence, or stop the build (so a changed rig can never slip through).
const one = (s, from, to) => {
  const n = s.split(from).length - 1;
  if (n !== 1) throw new Error(`expected 1 match, found ${n}: ${from.slice(0, 80)}`);
  return s.replace(from, () => to);
};
const between = (s, a, b) => {
  const i = s.indexOf(a); if (i < 0) throw new Error('missing ' + a);
  const j = s.indexOf(b, i + a.length); if (j < 0) throw new Error('missing ' + b);
  return s.slice(i + a.length, j);
};

// ---- 1. CSS: zoom, bubbles, Pictures and stills keyed off the ROOT class ------------------
let css = between(src, '<style>\n/* Artboard: everything in this <style> goes into <helmet><style>. */\n', '</style>').trim() + '\n';
css = one(css, '.pics.on{display:grid}',
  '.pictures .pics{display:grid}\n' +
  '.pictures.zoom-1 .pics,.pictures.zoom-2 .pics,.pictures.zoom-3 .pics{display:none}');
css = one(css, '.bubble .dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px}',
  '.bubble .dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px}\n' +
  '.zoom-1 .pill-row,.zoom-2 .pill-row,.zoom-3 .pill-row,.zoom-1 .cam-label,.zoom-2 .cam-label,.zoom-3 .cam-label{display:none}');
css = one(css, '.pics:not(.zoomed){display:grid!important}',
  '.player:not(.zoom-1):not(.zoom-2):not(.zoom-3) .pics{display:grid!important}');
css = one(css, '.cam.zoom-shoulders{', '.zoom-1 .cam{');
css = one(css, '.cam.zoom-path{', '.zoom-2 .cam{');
css = one(css, '.cam.zoom-elbows{', '.zoom-3 .cam{');
css = one(css, '.zoom-shoulders .ov-shoulders,.zoom-elbows .ov-elbows{opacity:1}',
  '.zoom-1 .ov-shoulders,.zoom-3 .ov-elbows{opacity:1}\n' +
  '/* Pictures stills (Pictures + a zoom chip): paused on key pose 1, or pose 3 (31 %) for Path */\n' +
  '.pictures .stage,.pictures .cap-row{--play:paused}\n' +
  '.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}');
if (/zoom-(shoulders|path|elbows|null)|zoomed|\.on\{/.test(css)) throw new Error('old zoom or pics selector left in CSS');

// ---- 2. Markup: one static tree; state only through the root class and style -------------
let body = src.slice(src.indexOf('<div class="player'), src.indexOf('<p class="harness-note"')).trim();
body = one(body, '<g class="cam zoom-null" data-class="camClass">', '<g class="cam">');
body = one(body, '<div class="pill-row" data-if="showRepPill">', '<div class="pill-row">');
body = one(body, '<div class="cam-label" data-if="showCamLabel">', '<div class="cam-label">');
body = one(body, '<div class="pics" data-class="picsClass">', '<div class="pics">');
// Chip captions: exactly the rig's EX.chips (RIG.md section 15 and the spec edits in section 17).
const EXRIG = JSON.parse(between(src, 'const EX = ', ';\n'));
const CHIPS = EXRIG.chips.map(c => [c.label, c.caption]);
if (CHIPS.map(c => c[0]).join() !== 'Shoulders,Path,Elbows') throw new Error('rig chips changed: ' + CHIPS.map(c => c[0]));
// One bubble, as in the rig (spec 2.10, RIG.md section 21): a zoom chip's caption or a tapped muscle's name and line, never
// both. It keeps its sc-if, dot style hole and two text holes; the build asserts the exact markup once.
const BUBBLE = '<div class="bubble" data-if="showBubble" hidden><span class="dot" data-style="bubbleDotStyle"></span><span class="bt"><b data-text="bubbleName"></b> <span data-text="bubbleRest"></span></span></div>';
body = one(body, BUBBLE, BUBBLE);
CHIPS.forEach((c, i) => { body = one(body, `aria-pressed="false" data-chip="${i}"`, `aria-pressed="false" data-pressed="z${i + 1}" data-click="pick${i + 1}"`); });
body = one(body, '<p class="hint" data-text="hint">Tap a zoom chip to look closer. Tap it again to zoom out.</p>',
  '<p class="hint"><span data-if="hintAnim">Tap a zoom chip to look closer. Tap it again to zoom out.</span>' +
  '<span data-if="hintPics" hidden>Four key moments of one rep.</span>' +
  '<span data-if="hintRm" hidden>Pictures shown because your phone is set to reduce motion.</span></p>');
// A Pictures still shows that picture's own caption (the words of tiles 1 and 3), not the phase caption of the
// frozen frame; same pattern as Machine Chest Press and Lat Pulldown.
body = one(body, '<span data-if="showPicsLine" hidden>',
  '<span data-if="showStill1" hidden>Stand tall, elbows soft</span><span data-if="showStill3" hidden>Stop at shoulder height</span><span data-if="showPicsLine" hidden>');
// Outside the one exact bubble element (matched once above), no rig-only binding may be left.
if (/data-(chip|text)=|camClass|picsClass|showBubble|showRepPill|showCamLabel|bubbleText/.test(body.replace(BUBBLE, ''))) throw new Error('old binding left in markup');
// Muscle info on tap: every hotspot's index, every class hole and every static muscle class match the rig's EX.muscles.
const MUS = EXRIG.muscles;
if (!MUS.length || MUS.some(m => !m.Id || !m.cls)) throw new Error('rig EX.muscles missing or incomplete');
for (const m of body.matchAll(/data-muscle="([A-Za-z]+)" data-hot="(\d+)"/g)) if (!MUS[+m[2]] || MUS[+m[2]].region !== m[1]) throw new Error('hotspot index does not match EX.muscles: ' + m[0]);
for (const m of body.matchAll(/class="([^"]*)" data-class="(cls[A-Za-z0-9]+)"/g)) { const mu = MUS.find(x => 'cls' + x.Id === m[2]); if (!mu || mu.cls !== m[1]) throw new Error('muscle class hole does not match EX.muscles: ' + m[0]); }
MUS.forEach((m, i) => { if (!body.includes(`data-hot="${i}"`) || !body.includes(`data-class="cls${m.Id}"`)) throw new Error('no hotspot or class hole for ' + m.id); });

// ---- 3. Logic: THEMES + themeVars + rigVars (unchanged from the rig) + logic.js -----------
const themes = src.slice(src.indexOf('const THEMES = '), src.indexOf('const EX = ')).trim();
// EX: the rig's rep, chips and muscle table (spec 2.10), never typed by hand.
const EXP = { rep: EXRIG.rep, chips: EXRIG.chips, muscles: EXRIG.muscles };
if (EXP.rep !== 4) throw new Error('rig rep changed: ' + EXP.rep);
const artboardScript = themes + '\nconst EX = ' + JSON.stringify(EXP) + ';\n' + logic;

// Every binding the markup uses must exist in renderVals (checked again in the browser).
const used = [...new Set([...body.matchAll(/data-(?:if|pressed|click|label|disabled|style|class|text)="([A-Za-z0-9]+)"/g)].map(m => m[1])
  .concat(/data-hot=/.test(body) ? ['hots'] : []).concat(MUS.flatMap(m => ['tap' + m.Id, 'key' + m.Id])))];

// ---- 4. index.html harness -----------------------------------------------------------
const harness = `
/* ===== harness only: stand-in for the DCLogic base class that support.js provides ===== */
class DCLogic { constructor(props) { this.props = props; } setState(u, cb) { Object.assign(this.state, typeof u === 'function' ? u(this.state) : u); bind(this); if (cb) cb(); } forceUpdate() { bind(this); } }
/* ===== artboard logic (goes into <script type="text/x-dc" data-dc-script>) ===== */
${artboardScript}
/* ===== harness only: ?theme= ?t= ?zoom= ?muscle= ?mode=pictures ?loop=1 ?autoplay=0 ?speed=0.5 ===== */
const H = { freeze: null };
function vals(c) {
  const v = c.renderVals();
  // ?t= freezes rep 1 at that point through the same root style string the artboard uses.
  if (H.freeze !== null && c.state.mode === 'anim') {
    v.rootStyle += ';--play:paused;--delay:' + (-H.freeze * c.repDur()) + 's';
    v.showCaps = true; v.showIdle = false; v.showEnded = false;
  }
  return v;
}
function bind(c) {
  const v = vals(c), all = s => document.querySelectorAll(s);
  all('[data-style]').forEach(el => el.setAttribute('style', (el.dataset.style === 'rootStyle' ? 'width: 358px; height: 460px; box-sizing: border-box; ' : '') + v[el.dataset.style]));
  all('[data-class]').forEach(el => el.setAttribute('class', v[el.dataset.class]));
  all('[data-if]').forEach(el => { el.hidden = !v[el.dataset.if]; });
  all('[data-pressed]').forEach(el => el.setAttribute('aria-pressed', String(!!v[el.dataset.pressed])));
  all('[data-label]').forEach(el => el.setAttribute('aria-label', v[el.dataset.label]));
  all('[data-disabled]').forEach(el => { el.disabled = !!v[el.dataset.disabled]; });
  all('[data-click]').forEach(el => { el.onclick = v[el.dataset.click]; });
  all('[data-text]').forEach(el => { el.textContent = v[el.dataset.text]; });
  all('[data-hot]').forEach(el => { const h = v.hots[+el.dataset.hot]; el.onclick = h.tap; el.onkeydown = h.key; });
}
const q = new URLSearchParams(location.search);
const props = { theme: q.get('theme') || 'silent-black', autoplay: q.get('autoplay') !== '0', loop: q.get('loop') === '1' };
const comp = new Component(props);
if (q.get('mode') === 'pictures' || q.get('mode') === 'pics') Object.assign(comp.state, { mode: 'pics', playing: false, started: false });
const chipOf = z => EX.chips.find((c, i) => c.id === z || String(i + 1) === z);
if (q.get('zoom') && chipOf(q.get('zoom'))) comp.state.bubble = { kind: 'zoom', id: chipOf(q.get('zoom')).id };
if (q.get('muscle') && EX.muscles.some(m => m.id === q.get('muscle'))) comp.state.bubble = { kind: 'muscle', id: q.get('muscle') };
if (q.get('speed') === '0.5') comp.state.speed = 0.5;
if (q.has('t') && comp.state.mode === 'anim') { H.freeze = Math.min(1, Math.max(0, +q.get('t') || 0)); Object.assign(comp.state, { playing: false, started: true }); }
const realToggle = comp.togglePlay.bind(comp);
comp.togglePlay = () => { H.freeze = null; realToggle(); };
comp.freeze = t => { H.freeze = t; comp.stopClock(); comp.setState({ playing: false, started: true }); };
window.__rig = comp; window.__used = ${JSON.stringify(used)};
bind(comp); comp.componentDidMount();
document.getElementById('harness-note').textContent = 'Harness only: theme ' + props.theme + (H.freeze !== null ? ', frozen at t = ' + H.freeze : ', live') + (props.loop ? ', loop on' : ', 3 reps then Replay') + '. Query: ?theme= &t= &zoom=1|2|3 &muscle=<id> &mode=pictures &loop=1 &autoplay=0 &speed=0.5';
`;

const indexHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=390">
<title>Dumbbell Lateral Raise form guide</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400..700&amp;display=swap">
<style>
/* Artboard: everything in this <style> goes into <helmet><style>. Built by build.mjs. */
${css}</style>
<style>/* harness only: a local copy of the canvas font (Roboto, latin) so offline shoots draw the same text as the canvas, page padding, and the note under the player */ @font-face{font-family:Roboto;font-style:normal;font-weight:400 700;font-display:swap;src:url(../rig-final/fonts/Roboto-latin.woff2) format("woff2")}body{padding:16px}.harness-note{margin:10px 0 0;width:358px;font-size:12px;line-height:16px;color:GrayText}</style>
</head>
<body>
${body}
<p class="harness-note" id="harness-note">Harness</p>
<script>${harness}</script>
</body>
</html>
`;
fs.writeFileSync(path.join(DIR, 'index.html'), indexHtml);

// ---- 5. Artboard markup: data-* bindings become x-dc holes ------------------------------
// Find the end of the element that starts at `start` (counts nested tags of the same name).
function elementEnd(s, start) {
  const tag = /^<([a-z0-9-]+)/i.exec(s.slice(start))[1];
  const re = new RegExp(`<${tag}[\\s>]|</${tag}>`, 'g');
  re.lastIndex = start; let depth = 0, m;
  while ((m = re.exec(s))) { depth += m[0][1] === '/' ? -1 : 1; if (depth === 0) return m.index + m[0].length; }
  throw new Error('unclosed ' + tag);
}
let ab = body;
// data-if="x" -> <sc-if value="{{ x }}" hint-placeholder-val="{{ true }}">element</sc-if>
for (;;) {
  const m = /data-if="([A-Za-z0-9]+)"/.exec(ab); if (!m) break;
  const start = ab.lastIndexOf('<', m.index), end = elementEnd(ab, start);
  const el = ab.slice(start, end).replace(` data-if="${m[1]}"`, '').replace(/^(<[^>]*?) hidden(?=[\s>])/, '$1');
  ab = ab.slice(0, start) + `<sc-if value="{{ ${m[1]} }}" hint-placeholder-val="{{ true }}">` + el + '</sc-if>' + ab.slice(end);
}
// Muscle info on tap (RIG.md section 21): hotspots get the tap and key holes, muscle polygons a class hole, the bubble its
// dot style hole and its two text holes (FORMAT-RULES.md: dotted holes only, no expressions).
ab = ab.replace(/ data-hot="(\d+)"/g, (_, i) => ` onClick="{{ tap${MUS[+i].Id} }}" onKeyDown="{{ key${MUS[+i].Id} }}"`)
  .replace(/class="[^"]*" data-class="(cls[A-Za-z0-9]+)"/g, 'class="{{ $1 }}"');
ab = one(ab, '<span class="dot" data-style="bubbleDotStyle"></span><span class="bt"><b data-text="bubbleName"></b> <span data-text="bubbleRest"></span></span>',
  '<span class="dot" style="{{ bubbleDotStyle }}"></span><span class="bt"><b>{{ bubbleName }}</b> {{ bubbleRest }}</span>');
ab = ab.replace(/aria-pressed="(?:true|false)" data-pressed="([A-Za-z0-9]+)"/g, 'aria-pressed="{{ $1 }}"')
  .replace(/aria-label="[^"]*" data-label="([A-Za-z0-9]+)"/g, 'aria-label="{{ $1 }}"')
  .replace(/ data-click="([A-Za-z0-9]+)"/g, ' onClick="{{ $1 }}"')
  .replace(/ data-disabled="([A-Za-z0-9]+)"/g, ' disabled="{{ $1 }}"')
  .replace(/<div class="player gen-a" data-class="rootClass" data-style="rootStyle" style="[^"]*">/,
    '<div class="{{ rootClass }}" style="width: 358px; height: 460px; box-sizing: border-box; {{ rootStyle }}">');
if (/data-(if|pressed|label|click|disabled|class|style|text|hot)=/.test(ab) || / hidden[\s>]/.test(ab)) throw new Error('unconverted binding in artboard markup');
if (/#[0-9a-fA-F]{3,8}\b|rgba?\(/.test(ab.replace(/href="#rig-lr"/g, ''))) throw new Error('raw colour in artboard markup');

// The markup split into the named pieces PLAYER.md hands over.
const svgStart = ab.indexOf('<svg class="scene"'), svgEnd = ab.indexOf('</svg>', svgStart) + 6;
const stageSvg = ab.slice(svgStart, svgEnd);
if (!stageSvg.includes('<g class="ov ov-shoulders">')) throw new Error('stage svg cut short');
const picsStart = ab.indexOf('<div class="pics">'), picsHtml = ab.slice(picsStart, elementEnd(ab, picsStart));
const bubStart = ab.indexOf('<sc-if value="{{ showBubble }}"'), bubHtml = ab.slice(bubStart, elementEnd(ab, bubStart));
if (bubStart < 0 || !bubHtml.includes('<div class="bubble">')) throw new Error('bubble piece not found');
// the artboard's holes, for the binding check in the browser (every one must exist in renderVals)
const abHoles = [...new Set([...ab.matchAll(/\{\{ ([A-Za-z0-9]+) \}\}/g)].map(m => m[1]).filter(h => h !== 'true'))];
const missingHole = abHoles.filter(h => !used.includes(h));
if (missingHole.length) throw new Error('artboard holes not in the harness binding list: ' + missingHole.join(','));

const dataProps = '{"theme":{"editor":"enum","options":["silent-black","paper","ember","emerald","midnight"],"default":"silent-black"},"autoplay":{"editor":"boolean","default":true},"loop":{"editor":"boolean","default":true},"$preview":{"width":358,"height":460}}';
const fullArtboard = `<!doctype html>
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
${ab.slice(0, svgStart)}<!-- stage SVG: section 9.1 -->${ab.slice(svgEnd, picsStart)}<!-- Pictures grid: section 9.2 -->${ab.slice(picsStart + picsHtml.length, bubStart)}<!-- bubble: section 9.3 -->${ab.slice(bubStart + bubHtml.length)}
</x-dc>
<script type="text/x-dc" data-dc-script data-props='${dataProps}'>
/* section 10 */
</script>
</body>
</html>`;

// ---- 6. Tables pulled from the rig, so PLAYER.md cannot drift from index.html -------------
const kf = {};
for (const m of css.matchAll(/@keyframes ([a-z0-9-]+)\{((?:[^{}]*\{[^{}]*\})*)\}/g)) kf[m[1]] = m[2];
const setA = Object.keys(kf).filter(k => k.endsWith('-a'));
const sameAB = setA.every(k => kf[k] === kf[k.slice(0, -2) + '-b']) && setA.length === Object.keys(kf).length / 2;
if (!sameAB) throw new Error('-a and -b keyframe sets differ');
const animated = setA.map(k => k.slice(0, -2));
const poses = JSON.parse(fs.readFileSync(path.join(DIR, '..', 'rig-final', 'poses.json'), 'utf8'));
const LR = poses.lateralRaise, tr = LR.truth, kt = LR.keyTable;
const stops = kf['lr-ua-r-a'].split('%{').length - 1;
const f1 = v => Number(v).toFixed(1);
const gr = i => `(${f1(kt[i].gripR[0])}, ${f1(kt[i].gripR[1])})`;

const md = `# Dumbbell Lateral Raise player: drop-in pieces

Built by \`node build.mjs\` from the final rig (\`../rig-final/lateral-raise.html\`, made by \`rig-final/gen.mjs\`) and \`logic.js\`. The harness \`index.html\` is built from the very same strings, so every piece below is what the screenshots in \`shots/\` show. Do not edit these pieces by hand: change \`rig-final/gen.mjs\` or \`build.mjs\` and rebuild.

## In plain words

- A person seen from the front, standing tall with a dumbbell in each hand beside the thighs, elbows a little bent. Both arms lift out to the sides in 1 second until they are level with the shoulders, hold for half a second, lower slowly over 2 seconds, and rest for half a second. The shoulders never lift toward the ears, the body never swings, and the small bend in the elbows never changes. Three reps, then it stops and offers Replay.
- A blue line grows along each hand's path, from the start to where the hand is now, so a beginner can see how high to go and where to stop.
- Three close-ups (Shoulders, Path, Elbows): the camera glides in, a line or ring marks the thing to look at, and a short tip shows at the bottom.
- "Pictures" shows four key moments of one rep as still drawings, made from the same drawing as the animation. A phone set to reduce motion always gets the pictures instead of movement.
- Tap a muscle in the animation and a bubble names it: its everyday name in bold, its real name, whether it is the target or helps, and one line on what it does, with a dot in that muscle's colour and a thin outline on the muscle. Tap it again, or the empty stage, to close it. A zoom chip replaces it with the chip's tip.
- The picture itself is driven by one class string and one style string on the outer box; the bubble and the tapped muscle's outline use a few more holes (section 4a). Nothing is built by script.

## 1. Files

| File | What it is |
|---|---|
| \`index.html\` | Harness: the full player, built the way the artboard is. Query: \`?theme=<id>&t=<0..1>&zoom=1\\|2\\|3&mode=pictures&loop=1&autoplay=0&speed=0.5\`. \`t\` freezes rep 1 at that point. \`zoom\` also takes \`shoulders\`, \`path\`, \`elbows\`. \`muscle=<id>\` (${MUS.map(m => '\`' + m.id + '\`').join(', ')}) opens that muscle's bubble. |
| \`logic.js\` | The artboard's logic class (\`class Component extends DCLogic\`). The build writes \`THEMES\`, \`themeVars\`, \`rigVars\` and \`EX\` (rep, chips, muscle table, all from the rig) above it; section 10 is the whole script. |
| \`build.mjs\` | Builds \`index.html\` and this file. |
| \`shoot.cjs\` | Checks and screenshots (\`shots/\`), including the shared muscle tap check (\`../rig-final/muscle-tap-check.cjs\`). Exits 1 on any failure; writes \`checks.txt\`. |
| \`canvas-check.cjs\` | Checks the shipped artboard \`project/Player-DumbbellLateralRaise.dc.html\` with a stand-in canvas runtime: its CSS is the harness CSS plus the canvas-only edits (text zoom \`--tz\`, Roboto first, text-coloured accent pill and badge), its stage, figure, Pictures grid, bubbles and logic are the harness text, its drawn frames match the harness and its pixels equal the harness's outside the text the canvas zooms (drawn in the harness's local Roboto), and zoom, Pictures and reduced motion work. Writes \`shots/canvas_*.png\`; exits 1 on any failure. |

## 2. What the logic must set

Only two holes carry state into the picture: the root \`class\` and the root \`style\`. Everything else is a plain \`sc-if\` flag, a click handler, or one of the muscle-tap holes of section 4a (the bubble's dot style and two text holes, and per muscle a class hole and a tap and key handler).

Root element:

\`\`\`html
<div class="{{ rootClass }}" style="width: 358px; height: 460px; box-sizing: border-box; {{ rootStyle }}">
\`\`\`

\`rootStyle\` = \`themeVars(theme)\` + \`;\` + \`rigVars(theme)\` + \`;--play:<p>;--dur:<d>s;--iter:<i>;--sets:<s>;--delay:0s\`

| Variable | Values | Meaning |
|---|---|---|
| \`--play\` | \`running\` or \`paused\` | running only while playing in Animation mode |
| \`--dur\` | \`4s\` at 1x, \`8s\` at 0.5x | one rep |
| \`--iter\` | \`3\` (loop off) or \`infinite\` | figure, dumbbells, trail and captions: 3 reps, then the last frame (= setup pose) holds |
| \`--sets\` | \`1\` (loop off) or \`infinite\` | the rep pill runs one 3-rep cycle |
| \`--delay\` | \`0s\` | always 0 from the logic. The CSS sets its own value for Pictures tiles and stills (section 5) |
| \`--sw\` | not set by the logic | stroke scale: 1 on the stage (CSS default), 0.75 in Pictures tiles (on each \`<use>\`) |

\`rootClass\` = \`player gen-<a|b>\` + \` zoom-<1|2|3>\` when a chip is on + \` pictures\` in Pictures mode. The logic keeps one state field, \`bubble\`: \`{ kind: 'zoom', id }\` (a chip id from \`EX.chips\`; its place in the list gives N), \`{ kind: 'muscle', id }\` or \`null\`, so a zoom and a muscle bubble never show together.

| Class | Set when | What the CSS does |
|---|---|---|
| \`gen-a\` / \`gen-b\` | flips on Play after the end (Replay), on a speed change, on a mode change, and when a Pictures still opens or closes | picks the \`-a\` or \`-b\` keyframe set, which restarts every animation from 0 % (the setup pose). The two sets are identical (checked). |
| \`zoom-1\` | Shoulders chip on | camera \`translate(179px,138px) scale(2.2) translate(-179px,-90px)\`; accent guide lines over both shoulder slopes and two "keep down" arrows; the bubble shows the Shoulders caption |
| \`zoom-2\` | Path chip on | camera \`translate(179px,138px) scale(1.2) translate(-179px,-135px)\`; the always-on dashed hand paths and growing trails; the bubble shows the Path caption |
| \`zoom-3\` | Elbows chip on | camera \`translate(179px,138px) scale(2.2) translate(-179px,-113px)\`; an accent ring on each elbow, moving with the arm; the bubble shows the Elbows caption |
| any \`zoom-N\` | | rep pill row and camera label hide; camera glides in 320 ms \`cubic-bezier(.32,.72,0,1)\`; overlay fades in 150 ms |
| \`pictures\` | Pictures mode | the 2 x 2 grid of key poses covers the stage; with a \`zoom-N\` as well, the grid hides and the stage shows one still (section 5) |

Every other value the markup reads from \`renderVals()\` (\`sc-if\` flags, \`aria-*\` values and click handlers; all in \`logic.js\`): ${used.filter(u => !['rootStyle', 'rootClass'].includes(u)).map(u => '`' + u + '`').join(', ')}.

| Flag | True when |
|---|---|
| \`showSlow\` | Animation mode at 0.5x ("Slow motion" pill) |
| \`showIdle\` | Animation mode before the first Play ("Tap Play to watch 3 slow reps.") |
| \`showEnded\` | after the 3 reps with loop off ("Done. Tap Replay to watch again.") |
| \`showCaps\` | Animation mode, playing or paused mid-set (the 4 phase captions) |
| \`showStill1\`, \`showStill3\` | a Pictures still is open: pose 1 (Shoulders, Elbows) shows "Stand tall, elbows soft", pose 3 (Path) shows "Stop at shoulder height", the same words as that picture's tile |
| \`showPicsLine\` | Pictures grid showing ("Raise 1 s, pause, lower 2 s") |
| \`showTempo\` | Animation mode only ("1 s up · 2 s down"). Pictures mode, grid or still, has no tempo note, as on Machine Chest Press and Lat Pulldown |
| \`isPlay\`, \`isPause\`, \`isReplay\`, \`playLabel\`, \`playDisabled\` | Play button icon, \`aria-label\` and disabled state (disabled under reduced motion) |
| \`z1\`, \`z2\`, \`z3\` | \`aria-pressed\` of the Shoulders, Path and Elbows chips (\`pick1\`..\`pick3\` call \`pickZoom\` with the chip's id) |
| \`showBubble\` | a chip is on (Animation or a Pictures still) or a muscle is tapped (Animation only); the bubble's text holes are in section 4a |
| \`speed1\`, \`speedHalf\`, \`modeAnim\`, \`modePics\`, \`animDisabled\` | segment buttons |
| \`hintAnim\`, \`hintPics\`, \`hintRm\` | which hint line shows |

The 200 ms timer in \`logic.js\` ends playback after 3 x \`--dur\` with loop off (\`playing: false, ended: true\`); it is cleared in \`componentWillUnmount\`.

## 3. Rep timing and phase captions

One rep = \`--dur\` (4 s at 1x). The minimum-jerk timing is baked into the keyframe samples (a stop every 0.25 % of the rep in the 1 s raise, every 0.5 % in the 2 s lowering, and only the boundary stops in the two holds: ${stops} stops per channel, written twice as the -a and -b sets), so every figure keyframe plays \`linear\` between samples.

| Rep % | Time at 1x | Phase | Movement | Caption (\`capx\` span) | Keyframe window |
|---|---|---|---|---|---|
| 0 - 25 | 0 - 1.0 s | Raise | both arms out to the sides, from ${tr.startA} to ${tr.endA} degrees (${Math.round((tr.startA + tr.endA) / 2)} degrees at 12.5 %); ease in, then ease out | c1 "Raise to shoulder height, 1 s" | \`cap1\`: 0 % 1, 25 % 0 |
| 25 - 37.5 | 1.0 - 1.5 s | Pause | still, arms level with the shoulders, shoulders down | c2 "Pause, shoulders down" | \`cap2\`: 25 % 1, 37.5 % 0 |
| 37.5 - 87.5 | 1.5 - 3.5 s | Lower | back to the sides (${Math.round((tr.startA + tr.endA) / 2)} degrees at 62.5 %); ease in, then ease out | c3 "Lower slowly, 2 s" | \`cap3\`: 37.5 % 1, 87.5 % 0 |
| 87.5 - 100 | 3.5 - 4.0 s | Reset | still, weights beside the thighs | c4 "Reset at your sides" | \`cap4\`: 87.5 % 1, 100 % 1 |

Captions use \`animation-timing-function: step-end\` (class \`capx\`), so each one switches on and off exactly at its window edges. The rep pill (\`repx r1..r3\`) runs over \`calc(var(--dur) * 3)\` and switches at 33.333 % and 66.667 %. Caption, pill and figure share \`--play\`, \`--dur\`, \`--delay\` and the \`gen\` class, so they cannot drift apart. Tempo note: "1 s up · 2 s down".

Movement numbers (checked against the spec's truth table, section 3.5; solved in \`rig-final/gen.mjs\`, measured again in the browser by \`shoot.cjs\`):

| Joint | Setup (0 %, 87.5 %, 100 %) | Mid (12.5 %, 62.5 %) | Top (25 - 37.5 %) | Truth table |
|---|---|---|---|---|
| Shoulder, arm out to the side (A) | ${tr.startA} | ${Math.round((tr.startA + tr.endA) / 2)} | ${tr.endA} | about 10-15, then 85-90; never above shoulder height |
| Elbow inside angle | ${kt[0].inside} | ${kt[2].inside} | ${kt[4].inside} | soft bend about 15 degrees, fixed |
| Wrist and dumbbell | level | level | level | straight, fixed (the dumbbell counter-rotates, so it stays level on screen) |
| Shoulder joints (stage) | (157, 94) and (201, 94) | same | same | fixed height, no shrug |
| Torso, hips, knees, feet, head | upright | upright | upright | fixed, no swing |
| Screen-right grip (stage) | ${gr(0)} | ${gr(2)} | ${gr(4)} | spec: (206.8, 171.2) to (277.2, 107) |
| Top grip against the shoulder line | | | ${f1(tr.topGripY - tr.shoulderY)} below | hands a little below the elbows at the top |

Screen-right arm: \`rotate(-A)\` about (22, -62) in rig units (stage (201, 94)); screen-left: \`rotate(+A)\` about (-22, -62). Forearms: a static \`rotate(15deg)\` / \`rotate(-15deg)\` about the elbow. Dumbbells: \`rotate(A - 15)\` / \`rotate(15 - A)\` about the grip, so they stay level.

Animated groups (each has an identical \`-a\` and \`-b\` keyframe set): ${animated.map(a => '`' + a + '`').join(', ')}.

## 4. Zoom states

| Root class | Chip | Camera centre, scale | Overlay | Bubble text | Still in Pictures |
|---|---|---|---|---|---|
| \`zoom-1\` | Shoulders | 179, 90, 2.2 | accent lines lifted just off both shoulder slopes (\`.ov-shoulders\`) and two down arrows over the shoulders | ${CHIPS[0][1]} | pose 1 (0 %) |
| \`zoom-2\` | Path | 179, 135, 1.2 | the always-on dashed hand paths and growing trails | ${CHIPS[1][1]} | pose 3 (31 %) |
| \`zoom-3\` | Elbows | 179, 113, 2.2 | an accent ring r 8 on each elbow, inside the arm groups so it follows the elbow (\`.ov-elbows\`) | ${CHIPS[2][1]} | pose 1 (0 %) |

The animation keeps running while zoomed. Each chip's subject stays inside the stage and above the bubble for the whole rep (checked at 41 phases, section 11).

Chips differ from spec 3.5 on purpose, as the final rig decided (RIG.md sections 15 and 17): Grip (242, 139, 2.0) became Shoulders (179, 90, 2.2), because from the front each hand is a small fist round a handle that points at the camera: the whole fist shows above the dumbbell head, with the index finger and thumb closed as a ring round the handle, but a light grip and which way the palms face (the Grip cue) cannot be seen from the front, while shrugging is a listed common mistake that this view shows well; Path moved from (179, 120, 1.25) to (179, 135, 1.2), because at 120 the bottom of the path sat under the bubble; Elbows moved from (224, 113) to (179, 113), because at 224 the screen-left elbow left the stage near the top of the rep. The head centre is (179, 73), not 77, so the chin does not cover the neck. The dumbbell end face is a hex of r 6.6 (squashed to 0.92 tall), centred 12.5 below the grip so the whole hand shows above it, the rig's size (RIG.md sections 7 and 20), not the spec's r 7.

## 4a. Muscle info on tap (spec 2.10; rig-final/RIG.md section 21)

The stage markup (section 9.1) is the rig's: every muscle polygon with a role carries a class hole, and each gets a halo hotspot (an invisible copy, class \`hot\`, a wide transparent stroke so the tap target is at least 44 px, \`role="button"\`, \`tabindex="0"\`, an \`aria-label\`) and a core copy (class \`hot hot-core\`, no stroke) painted after every halo, so a tap on a muscle's own fill always opens that muscle. Hotspots sit in the same animated groups as their muscles and follow the motion; \`.pics .hot{pointer-events:none}\` and the grid keep Pictures free of them.

| Muscle (\`EX.muscles\`) | Role | Class hole | Tap / key holes | Bubble (bold name, then the rest) |
|---|---|---|---|---|
${MUS.map(m => `| \`${m.id}\` | ${m.role === 'main' ? 'target' : 'helps'} | \`cls${m.Id}\` = \`${m.cls}\` (+ \` sel\` while tapped) | \`tap${m.Id}\`, \`key${m.Id}\` | **${m.common}** (${m.anatomical}), ${m.role === 'main' ? 'target' : 'helps'}. ${m.line} |`).join('\n')}

Markup: each halo and core carries \`onClick="{{ tap<Id> }}" onKeyDown="{{ key<Id> }}"\`; each muscle polygon \`class="{{ cls<Id> }}"\`; the stage \`onClick="{{ tapStage }}"\`; the bubble (section 9.3) \`<span class="dot" style="{{ bubbleDotStyle }}"></span><span class="bt"><b>{{ bubbleName }}</b> {{ bubbleRest }}</span>\`.

| Hole | Value |
|---|---|
| \`bubbleDotStyle\` | \`background:var(--muscle-main)\` for the target, \`var(--muscle-help)\` for a helper, \`var(--accent)\` for a chip |
| \`bubbleName\` | the muscle's common name (bold); empty for a chip |
| \`bubbleRest\` | \`(anatomical), target|helps. Line.\`, or the chip's caption |
| \`bubbleText\` | the whole line as plain text (not used by the markup; for tests and screen readers) |
| \`hots\` | the tap and key handlers as a list (harness \`data-hot\` binding only) |

Handlers (\`logic.js\`): \`tapMuscle(id, e)\` toggles that muscle's bubble in Animation mode only (it stops the event and notes the time); \`keyMuscle(id, e)\` accepts Enter and Space; \`tapStage(e)\` closes a muscle bubble on a tap of the stage background, never a zoom, never a tap inside the bubble, and not within 80 ms of a hotspot tap; \`pickZoom(id)\` replaces a muscle bubble with the chip's caption. The rep pill, camera label and camera stay as they are while a muscle bubble is open. Mode changes and Play from Pictures close any bubble.

## 5. Pictures mode and stills

- Root class \`pictures\`: the grid (\`.pics\`, always in the markup, never inside an \`sc-if\`) covers the stage. Four tiles, each a \`<use href="#rig-lr">\` of the one rig with its own \`--play:paused;--sw:.75;--delay:calc(var(--dur) * -<pose>)\`, cropped to the scene box 66 56 226 208. Key poses: 1 = 0 %, 2 = 12.5 %, 3 = 31 %, 4 = 62.5 %. Tiles 2 (up) and 4 (down) carry a direction arrow beside the screen-right hand.
- Captions: 1 "Stand tall, elbows soft"; 2 "Lift out to the sides"; 3 "Stop at shoulder height"; 4 "Lower slowly, 2 s".
- \`pictures zoom-N\`: the grid hides and the stage shows one still at that zoom. The CSS pauses the stage and caption row and, for Path, moves them to pose 3: \`.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}\`. The logic flips \`gen\` when a still opens or closes, so the paused animation restarts from 0 before the delay applies.
- The caption line under a still shows that pose's picture caption, not the phase caption of the frame: "Stand tall, elbows soft" for Shoulders and Elbows (pose 1), "Stop at shoulder height" for Path (pose 3). The phase captions (\`showCaps\`) belong to the animation only, as on Machine Chest Press and Lat Pulldown.
- The logic pauses everything in Pictures mode (\`--play: paused\`); the CSS pauses the stage there too, as a second guard.

## 6. Reduced motion

\`\`\`css
@media (prefers-reduced-motion: reduce){
  .anim,.capx,.repx{animation-play-state:paused!important}                    /* element level: the root style hole cannot undo it */
  .player:not(.zoom-1):not(.zoom-2):not(.zoom-3) .pics{display:grid!important} /* the key poses, never a blank or frozen frame */
  .cam,.ov{transition:none!important}
  .pill-row{display:none!important}
}
\`\`\`

- The logic reads \`matchMedia('(prefers-reduced-motion: reduce)')\` once in its constructor: it starts in Pictures mode, disables Play and "Animation", and shows the hint "Pictures shown because your phone is set to reduce motion." Zoom chips still open stills, with no camera glide.
- A root-level \`--play: paused\` in the media query is not enough, because the root's inline style wins; the element-level rule above is what holds it (checked with the root forced to \`running\`).
- The real app keys this off \`html[data-motion="reduce"]\` and \`reduced()\` from \`src/ui/motion.ts\` (spec 2.8).

## 7. Artboard skeleton (\`project/Player-DumbbellLateralRaise.dc.html\`)

Sections 8, 9 and 10 fill the marked places. The \`data-props\` follow spec 2.1 (standalone on the canvas it autoplays and loops; About imports it with \`autoplay\` and \`loop\` off, so it runs 3 reps and offers Replay). SVG shapes use \`/>\`, which is valid inside \`<svg>\`; every HTML element is closed.

\`\`\`html
${fullArtboard}
\`\`\`

## 8. The complete CSS for \`<helmet><style>\`

\`\`\`css
${css}\`\`\`

## 9. Markup pieces

### 9.1 Stage SVG: camera group, floor, figure, dumbbells, hand paths, progress trails, zoom overlays

The whole scene sits in \`<g class="cam">\` (zoomed by the root class) and \`<g id="rig-lr">\` (cloned by the Pictures tiles). Front view draw order: floor, body layer (legs, torso, neck, head), hand paths and trails, screen-left arm, screen-right arm, static overlays. Each dumbbell lives inside its hand's group (\`lr-db-l\`, \`lr-db-r\`), so the grip can never come apart.

\`\`\`html
${stageSvg}
\`\`\`

### 9.2 Pictures grid (4 key poses with captions)

\`\`\`html
${picsHtml}
\`\`\`

### 9.3 Bubble (a zoom chip's caption or a tapped muscle's line; section 4a)

\`\`\`html
${bubHtml}
\`\`\`

## 10. Logic script (\`<script type="text/x-dc" data-dc-script data-props='...'>\`)

\`\`\`js
${artboardScript}
\`\`\`

## 11. Checks

\`node shoot.cjs\` (Chromium) runs every check below and writes the screenshots; results are in \`checks.txt\`.

- Keyframes: every \`-a\` set equals its \`-b\` set; figure, captions and rep pill are driven only by \`--play\`, \`--dur\`, \`--delay\`, \`--iter\`, \`--sets\`.
- Movement over 201 phases (\`getCTM\`): arm angle A at every key point of the tempo table, both shoulders fixed (no shrug), left and right hands mirror each other, hands and elbows never above the shoulder line, elbow bend fixed at 15 degrees, dumbbells level, grip on the rig's timed path, figure inside the safe area of the stage.
- Loop off (a real 12 s run): 3 reps, stop in the reset pose, Replay restarts through the \`-b\` set; 0.5x gives an 8 s rep and the Slow motion pill; Pause holds the frame; autoplay off starts on the setup pose.
- Phase captions: exactly one shows, the right one, in each window. The five themes paint from \`?theme=\`.
- Each zoom state: camera transform, the one bubble with that chip's caption, pill row and camera label hidden, subject inside the stage and above the bubble at 41 phases.
- Pictures: grid shown, 4 different poses; stills: grid hidden, Path still on pose 3.
- Reduced motion: paused even when the root style says running, grid shown, hint, Animation disabled.
- Smoothness (UPGRADE-BRIEF.md target 4; docs/COACHING-DECISIONS.md D-R1): the rig's own numbers on the written stops of this build are (a) ${(LR.smooth.a * 100).toFixed(2)} %, (b) ${(LR.smooth.b * 100).toFixed(2)} %, (c) ${LR.smooth.c.toFixed(2)} x (limits 1 %, 8 %, 3 x). \`shoot.cjs\` measures the drawn page with \`../smooth-check.cjs\` (every joint angle and the grip at 120 samples per second, plus the keyframe stops) and prints the numbers per phase; the last run is in \`checks.txt\`.
- Target muscle visible at the hardest point (\`../rig-final/muscle-check.cjs\`): the accent pixels of the main muscle in the hold are at least 97 % of those at setup. Caption row (\`../rig-final/caption-check.cjs\`): caption and tempo never overlap or leave the player in idle, ended, the four captions and Pictures, drawn with the canvas font (Roboto).
- Secondary motion: the upper-trap helper tint eases 1 -> 0.7 with the lift and back on the move's timing (opacity only; the shoulder joints, the 15-degree bend and the level dumbbells are checked above).
- Muscle info on tap (\`../rig-final/muscle-tap-check.cjs\`, spec 2.10): every muscle has halo hotspots of at least 44 px with button semantics and a core per polygon at t 0 and 0.25; at t 0.3 a tap on each muscle shows its exact text, bold name, dot in its own colour and the outline on its polygons only, with nothing else moving; a second tap closes; a chip replaces the muscle bubble; Enter opens, Space closes; the stage background closes; each text fits two lines in Roboto; no hotspot is hit-testable in Pictures; no hotspot is animated or matches a zoom subject.
- Every binding in the markup exists in \`renderVals()\`; no page errors.

## 12. Risks

| Risk | Handling |
|---|---|
| Someone edits a keyframe by hand and an arm swings past shoulder height or the two arms stop mirroring | Change \`rig-final/gen.mjs\`, rebuild the rig, then \`node build.mjs\` and \`node shoot.cjs\`; the build stops if a replaced string is missing, and the checks fail on any angle, mirror or shoulder-line error. |
| \`sc-if\` wrappers change layout in the canvas | Every wrapped element sits in a flex row or a grid cell and keeps its own class, so the wrapper only adds or removes it. Check once on the canvas. |
| A still shows the wrong pose if the canvas does not restart animations on a class change | The logic flips \`gen\`, which renames every animation and restarts it; checked in Chromium. |
| Page weight (about 140 KB; limit 450 KB) from the doubled keyframe sets and the detailed figure | Generated, never typed. The real app plays the same samples with the Web Animations API and needs one copy. |
| The 200 ms timer stops the set a few ms before the CSS end | The last 0.5 s of every rep is the still reset pose, equal to the setup pose, so the frame is the same; checked that every animation stops inside that window and the grip sits at the setup position. |
| The chips differ from spec 3.5 (Shoulders instead of Grip, two centres moved) | Decided by the final rig with reasons (section 4); spec.md section 3.5 carries the same chips and reasons (applied 2026-09-27). |
| A hotspot's halo takes a tap meant for a neighbouring muscle | Every muscle also has a core copy painted after every halo, so its own fill always wins (D-R7); the muscle tap check taps each muscle where it is visible. |
| Midnight: the accent muscle tint is weak on the body (1.63:1) | As in the rig: each muscle polygon has its own thin outline, the figure outline carries the shape, and the muscles are named in text. |
`;
fs.writeFileSync(path.join(DIR, 'PLAYER.md'), md);
console.log('index.html', indexHtml.length, 'bytes; PLAYER.md', md.length, 'bytes; bindings', used.join(','));
