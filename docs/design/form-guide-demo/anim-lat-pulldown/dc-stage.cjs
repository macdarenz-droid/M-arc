// Checks the canvas artboard against the harness, line by line, and renders it the way the canvas would.
// usage: node dc-stage.cjs [path/to/Player-LatPulldown.dc.html] [--shots]
// 1. Style: every rule in the artboard's <style> equals the harness's rule with the same selector or @keyframes name,
//    except the canvas typography rules listed in TYPO (--tz text scale, Slow motion pill text colour; the font stack is shared).
//    Each rule key (selector or @keyframes name) appears as many times in the artboard as in the harness, so a stale
//    rule can never hide behind a typography key.
// 2. Stage: the artboard's stage markup equals piece B (index.html) exactly, after swapping the harness's data-* bindings
//    for the artboard's holes (data-class -> class="{{ cls<Id> }}", data-hot -> onClick/onKeyDown="{{ tap<Id> / key<Id> }}",
//    data-click -> onClick, data-style -> style, data-text -> a text hole; spec 2.10).
// 3. Controls: the visible words of piece C match (the artboard uses sc-if / onClick holes instead of data-*).
// 3b. Logic: the artboard's script is PLAYER.md piece D exactly, its EX equals the harness's, and driven in node it
//    opens and closes the muscle and zoom bubbles as spec 2.10 says.
// 4. Writes dc-render.html next to this file: the artboard's own CSS and markup, holes filled by its own logic class
//    (run in node with a stub DCLogic), so indep.cjs and the shots below measure the artboard itself.
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const dcPath = path.resolve(process.argv.find((a, i) => i > 1 && !a.startsWith('--')) || path.join(DIR, '../project/Player-LatPulldown.dc.html'));
const H = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8'), D = fs.readFileSync(dcPath, 'utf8');
const TYPO = new Set(['.player', '.pill', '.pill-accent', '.cam-label', '.bubble', '.tile p', '.badge', '.cap', '.tempo', '.chip', '.seg button', '.hint', '.inset-label']);
const problems = [];
const styleOf = s => { const i = s.indexOf('<style>') + 7; return s.slice(i, s.indexOf('</style>', i)).split('\n'); };
const key = l => { l = l.trim(); if (!l || l.startsWith('/*')) return null; const m = l.match(/^(@keyframes [\w-]+)/); return m ? m[1] : l.split('{')[0]; };
const hk = new Map(); for (const l of styleOf(H)) { const k = key(l); if (k !== null && l.includes('{')) hk.set(k, (hk.get(k) || []).concat(l)); }
let same = 0, typo = 0;
for (const l of styleOf(D)) {
  const k = key(l); if (k === null || !l.includes('{')) continue;
  const h = hk.get(k);
  if (h && h.includes(l)) { same++; continue; }
  if (TYPO.has(k)) { typo++; continue; }
  problems.push(`style rule differs from the harness: ${k}${h ? '' : ' (not in the harness)'}`);
}
for (const k of hk.keys()) if (!styleOf(D).some(l => key(l) === k)) problems.push(`harness style rule missing in the artboard: ${k}`);
{ const dk = new Map(); for (const l of styleOf(D)) { const k = key(l); if (k !== null && l.includes('{')) dk.set(k, (dk.get(k) || 0) + 1); }
  for (const [k, n] of dk) if (hk.has(k) && hk.get(k).length !== n) problems.push(`style rule ${k}: ${n} in the artboard, ${hk.get(k).length} in the harness`); }
// stage markup: from <div class="stage"> to the line before the cap-row
const stageOf = s => { const i = s.indexOf('<div class="stage"'); const j = s.indexOf('<div class="cap-row">', i); return s.slice(i, j); };
// holes differ by format only: the harness's data-if="x" and the artboard's <sc-if value="{{ x }}"> wrappers
const norm = s => s.replace(/<sc-if [^>]*>|<\/sc-if>/g, '').replace(/ data-if="\w+"/g, '');
// the harness's other bindings written as the artboard's holes (the muscle table from the harness's own EX)
const EXH = JSON.parse(H.match(/\nconst EX = (\{.*\});\n/)[1]);
const toDc = s => s.replace(/class="[^"]*" data-class="(\w+)"/g, (m, k) => `class="{{ ${k} }}"`)
  .replace(/ data-hot="(\d+)"/g, (m, i) => ` onClick="{{ tap${EXH.muscles[+i].Id} }}" onKeyDown="{{ key${EXH.muscles[+i].Id} }}"`)
  .replace(/ data-click="(\w+)"/g, (m, k) => ` onClick="{{ ${k} }}"`).replace(/ data-style="(\w+)"/g, (m, k) => ` style="{{ ${k} }}"`)
  .replace(/<b data-text="(\w+)"><\/b>/g, (m, k) => `<b>{{ ${k} }}</b>`).replace(/<span data-text="(\w+)"><\/span>/g, (m, k) => `{{ ${k} }}`);
const stageSame = toDc(norm(stageOf(H))) === norm(stageOf(D));
if (/ data-(class|hot|click|style|text)=/.test(stageOf(D))) problems.push('harness binding (data-class/hot/click/style/text) left in the artboard stage');
if (!stageSame) problems.push('stage markup differs from piece B');
// controls: visible words
const words = s => { const i = s.indexOf('<div class="cap-row">'); const j = s.indexOf('</p>', s.indexOf('<p class="hint">', i)); return s.slice(i, j).replace(/<[^>]+>/g, '|').split('|').map(t => t.trim()).filter(Boolean); };
const wh = words(H), wd = words(D);
if (JSON.stringify(wh) !== JSON.stringify(wd)) problems.push(`controls words differ: harness ${JSON.stringify(wh)} vs artboard ${JSON.stringify(wd)}`);
// run the artboard's logic class in node
const script = D.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
{ const P = fs.readFileSync(path.join(DIR, 'PLAYER.md'), 'utf8'), i = P.indexOf('## Piece D'), a = P.indexOf('```js\n', i) + 6, pieceD = P.slice(a, P.indexOf('\n```', a));
  if (i < 0 || script.trim() !== pieceD.trim()) problems.push('the artboard script is not PLAYER.md piece D'); }
const props = JSON.parse(D.match(/data-props='([^']*)'/)[1]);
class DCLogic { constructor(p) { this.props = p; this.state = {}; } setState(u) { Object.assign(this.state, typeof u === 'function' ? u(this.state) : u); } }
const lib = new Function('DCLogic', 'window', `${script}\nreturn { themeVars, rigVars, Component, EX };`)(DCLogic, { matchMedia: () => ({ matches: false }) });
if (JSON.stringify(lib.EX) !== JSON.stringify(EXH)) problems.push('the artboard logic EX differs from the harness EX');
// the muscle tap and zoom states (spec 2.10), driven through the logic's own handlers
try {
  const c = new lib.Component({ theme: 'silent-black', autoplay: 'no', loop: 'no' }), bad = [];
  const text = m => `${m.common} (${m.anatomical}), ${m.role === 'main' ? 'target' : 'helps'}. ${m.line}`;
  const want = (ok, what) => { if (!ok) bad.push(what); };
  let v = c.renderVals();
  want(!v.showBubble && EXH.muscles.every(m => v['cls' + m.Id] === m.cls), 'closed at start, every class hole its plain class');
  for (const m of EXH.muscles) {
    c.state.started = true; v.hots.find(h => h.id === m.id).tap({ stopPropagation() {} }); v = c.renderVals();
    want(v.showBubble && v.bubbleName === m.common && `${v.bubbleName} ${v.bubbleRest}` === text(m) && v.bubbleText === text(m) && v.bubbleDotStyle === `background:var(${m.role === 'main' ? '--muscle-main' : '--muscle-help'})`, `${m.id}: tap opens its text and colour`);
    want(EXH.muscles.every(o => v['cls' + o.Id] === o.cls + (o.id === m.id ? ' sel' : '')) && !/zoom-/.test(v.rootClass), `${m.id}: outline on it only, no zoom`);
    v['tap' + m.Id]({}); v = c.renderVals(); want(!v.showBubble, `${m.id}: a second tap closes`);
  }
  v['key' + EXH.muscles[0].Id]({ key: 'Enter', preventDefault() {} }); v = c.renderVals(); want(v.showBubble, 'Enter opens');
  v['key' + EXH.muscles[0].Id]({ key: 'Tab', preventDefault() {} }); v = c.renderVals(); want(v.showBubble, 'Tab does nothing');
  c.tapAt = 0; v.tapStage({ target: { closest: () => null } }); v = c.renderVals(); want(!v.showBubble, 'a stage tap closes a muscle bubble');
  v.tapLats && v.tapLats({}); v = c.renderVals(); v.pick1(); v = c.renderVals();
  want(v.showBubble && v.bubbleName === '' && v.bubbleRest === EXH.chips[0].caption && v.bubbleDotStyle === 'background:var(--accent)' && / zoom-1$/.test(v.rootClass) && v.z1 && !v['cls' + EXH.muscles[0].Id].includes('sel'), 'a chip replaces the muscle bubble with its caption');
  c.tapAt = 0; v.tapStage({ target: { closest: () => null } }); v = c.renderVals(); want(v.showBubble && v.z1, 'a stage tap never closes a zoom');
  v.pick1(); v = c.renderVals(); want(!v.showBubble && !/zoom-/.test(v.rootClass), 'a second chip tap closes everything');
  v.toPics(); v = c.renderVals(); v['tap' + EXH.muscles[0].Id]({}); v = c.renderVals(); want(!v.showBubble, 'no muscle bubble in Pictures');
  v.pick2(); v = c.renderVals(); want(/ pictures zoom-2$/.test(v.rootClass) && v.showStill3 && v.bubbleRest === EXH.chips[1].caption, 'the Path still in Pictures');
  if (bad.length) problems.push('logic: ' + bad.join('; '));
} catch (e) { problems.push('logic: the muscle and zoom states cannot be driven (' + e.message + ')'); }
const theme = (process.env.THEME || props.theme.default);
const comp = new lib.Component({ theme, autoplay: 'no', loop: 'no' });
const v = comp.renderVals();
let body = D.slice(D.indexOf('<div class="{{ rootClass }}"'), D.lastIndexOf('</x-dc>'));
body = body.replace('{{ rootClass }}', v.rootClass).replace('{{ rootStyle }}', v.rootStyle);
// sc-if: keep the content when the value is true (innermost first)
for (let n = 0; n < 50 && body.includes('<sc-if'); n++) body = body.replace(/<sc-if value="\{\{ (\w+) \}\}"[^>]*>((?:(?!<sc-if)[\s\S])*?)<\/sc-if>/g, (m, k, inner) => (v[k] ? inner : ''));
body = body.replace(/ on[A-Z]\w*="\{\{ [\w.]+ \}\}"/g, '').replace(/ disabled="\{\{ (\w+) \}\}"/g, (m, k) => (v[k] ? ' disabled' : '')).replace(/="\{\{ (\w+) \}\}"/g, (m, k) => `="${v[k]}"`).replace(/\{\{ (\w+) \}\}/g, (m, k) => (k in v ? String(v[k]) : m));
if (/\{\{/.test(body)) problems.push('unfilled hole left in the artboard markup: ' + body.match(/\{\{[^}]*\}\}/)[0]);
const css = D.slice(D.indexOf('<style>'), D.indexOf('</style>') + 8);
const out = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>dc render</title>${css}<style>body{padding:16px;background:#777}</style></head><body>${body}</body></html>`;
const renderPath = path.join(__dirname, 'dc-render.html');
fs.writeFileSync(renderPath, out);
console.log(JSON.stringify({ dc: dcPath, styleRulesSame: same, typographyRules: typo, stageSame, controlWords: wd.length, rootClass: v.rootClass, rootStyleHead: v.rootStyle.slice(0, 60), problems }, null, 1));
if (process.argv.includes('--shots')) {
  const { chromium } = require('playwright');
  (async () => {
    const b = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
    const OUT = path.join(DIR, 'shots');
    const shot = async (name, cls, t) => {
      const p = await b.newPage({ viewport: { width: 420, height: 520 }, deviceScaleFactor: 2 });
      await p.goto('file://' + renderPath); await p.waitForTimeout(300);
      await p.evaluate(({ cls, t }) => { const r = document.querySelector('.player'); if (cls) r.setAttribute('class', cls); r.style.setProperty('--play', 'paused'); if (t !== null) r.style.setProperty('--delay', (-4 * t) + 's'); }, { cls, t });
      await p.waitForTimeout(600);
      await (await p.$('.player')).screenshot({ path: path.join(OUT, name) }); await p.close();
    };
    await shot('dc-idle.png', null, null);
    for (const t of [0, 0.125, 0.25, 0.625]) await shot(`dc-t${t}.png`, 'player gen-a', t);
    for (const z of [1, 2, 3]) await shot(`dc-zoom${z}-t0.png`, `player gen-a zoom-${z}`, 0);
    await shot('dc-zoom1-t0.25.png', 'player gen-a zoom-1', 0.25);
    await shot('dc-pictures.png', 'player gen-b pictures', null);
    await shot('dc-pics-zoom2.png', 'player gen-b pictures zoom-2', null);
    await b.close(); console.log('dc shots ok');
  })();
}
if (problems.length) process.exitCode = 1;
