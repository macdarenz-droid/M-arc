// Checks the canvas artboard against the harness, line by line, and renders it the way the canvas would.
// usage: node dc-stage.cjs [path/to/Player-LatPulldown.dc.html] [--shots]
// 1. Style: every rule in the artboard's <style> equals the harness's rule with the same selector or @keyframes name,
//    except the canvas typography rules listed in TYPO (Roboto, --tz text scale, Slow motion pill text colour).
// 2. Stage: the artboard's stage markup equals piece B (index.html) exactly.
// 3. Controls: the visible words of piece C match (the artboard uses sc-if / onClick holes instead of data-*).
// 4. Writes dc-render.html next to this file: the artboard's own CSS and markup, holes filled by its own logic class
//    (run in node with a stub DCLogic), so indep.cjs and the shots below measure the artboard itself.
const fs = require('fs'), path = require('path');
const DIR = __dirname;
const dcPath = path.resolve(process.argv.find((a, i) => i > 1 && !a.startsWith('--')) || path.join(DIR, '../project/Player-LatPulldown.dc.html'));
const H = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8'), D = fs.readFileSync(dcPath, 'utf8');
const TYPO = new Set(['body', '.player', '.pill', '.pill-accent', '.cam-label', '.bubble', '.tile p', '.badge', '.cap', '.tempo', '.chip', '.seg button', '.hint', '.inset-label']);
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
// stage markup: from <div class="stage"> to the line before the cap-row
const stageOf = s => { const i = s.indexOf('<div class="stage">'); const j = s.indexOf('<div class="cap-row">', i); return s.slice(i, j); };
// holes differ by format only: the harness's data-if="x" and the artboard's <sc-if value="{{ x }}"> wrappers
const norm = s => s.replace(/<sc-if [^>]*>|<\/sc-if>/g, '').replace(/ data-if="\w+"/g, '');
const stageSame = norm(stageOf(H)) === norm(stageOf(D));
if (!stageSame) problems.push('stage markup differs from piece B');
// controls: visible words
const words = s => { const i = s.indexOf('<div class="cap-row">'); const j = s.indexOf('</p>', s.indexOf('<p class="hint">', i)); return s.slice(i, j).replace(/<[^>]+>/g, '|').split('|').map(t => t.trim()).filter(Boolean); };
const wh = words(H), wd = words(D);
if (JSON.stringify(wh) !== JSON.stringify(wd)) problems.push(`controls words differ: harness ${JSON.stringify(wh)} vs artboard ${JSON.stringify(wd)}`);
// run the artboard's logic class in node
const script = D.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const props = JSON.parse(D.match(/data-props='([^']*)'/)[1]);
class DCLogic { constructor(p) { this.props = p; this.state = {}; } setState(u) { Object.assign(this.state, typeof u === 'function' ? u(this.state) : u); } }
const lib = new Function('DCLogic', 'window', `${script}\nreturn { themeVars, rigVars, Component };`)(DCLogic, { matchMedia: () => ({ matches: false }) });
const theme = (process.env.THEME || props.theme.default);
const comp = new lib.Component({ theme, autoplay: 'no', loop: 'no' });
const v = comp.renderVals();
let body = D.slice(D.indexOf('<div class="{{ rootClass }}"'), D.lastIndexOf('</x-dc>'));
body = body.replace('{{ rootClass }}', v.rootClass).replace('{{ rootStyle }}', v.rootStyle);
// sc-if: keep the content when the value is true (innermost first)
for (let n = 0; n < 50 && body.includes('<sc-if'); n++) body = body.replace(/<sc-if value="\{\{ (\w+) \}\}"[^>]*>((?:(?!<sc-if)[\s\S])*?)<\/sc-if>/g, (m, k, inner) => (v[k] ? inner : ''));
body = body.replace(/ on[A-Z]\w*="\{\{ [\w.]+ \}\}"/g, '').replace(/ disabled="\{\{ (\w+) \}\}"/g, (m, k) => (v[k] ? ' disabled' : '')).replace(/="\{\{ (\w+) \}\}"/g, (m, k) => `="${v[k]}"`);
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
