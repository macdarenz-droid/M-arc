// canvas-check.cjs: tests the shipped artboard project/Player-DumbbellLateralRaise.dc.html, not the harness.
// It renders the artboard with a minimal stand-in for the canvas runtime (holes, sc-if, onClick, disabled),
// proves parity with index.html (text and drawn frames), runs the zoom, Pictures and reduced-motion probes,
// and writes canvas_*.png frames into shots/. Run after `node build.mjs`: node canvas-check.cjs (exit 1 on a failure).
// Modelled on ../anim-machine-chest-press/canvas-check.cjs.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname, OUT = path.join(DIR, 'shots');
fs.mkdirSync(OUT, { recursive: true });
const FILE = process.env.CANVAS || path.join(DIR, '..', 'project', 'Player-DumbbellLateralRaise.dc.html');
const src = fs.readFileSync(FILE, 'utf8');
const OUTP = process.env.CANVAS ? 'before_' : ''; // CANVAS=<other artboard> checks that file; its frames get this prefix
const idx = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const md = fs.readFileSync(path.join(DIR, 'PLAYER.md'), 'utf8');
const helmet = src.match(/<helmet>([\s\S]*?)<\/helmet>/)[1].replace(/<link[^>]*googleapis[^>]*>/g, ''); // no network here
const markup = src.match(/<x-dc>[\s\S]*?<\/helmet>([\s\S]*?)<\/x-dc>/)[1];
const script = src.match(/<script type="text\/x-dc"[^>]*>([\s\S]*?)<\/script>/)[1];
const page0 = cfg => `<!doctype html><html lang="en"><head><meta charset="utf-8">${helmet}<style>body{padding:16px}</style></head><body><div id="host"></div><script>
class DCLogic{constructor(p){this.props=p;this.state={}}setState(u,cb){Object.assign(this.state,typeof u==='function'?u(this.state,this.props):u);render();if(cb)cb()}forceUpdate(){render()}}
${script}
const MARKUP=${JSON.stringify(markup)}, CFG=${JSON.stringify(cfg)};
const lookup=(p,c)=>p.split('.').reduce((o,k)=>o==null?undefined:o[k],c);
function render(){
  const v=comp.renderVals(); if(CFG.t!=null){v.rootStyle+=';--play:paused;--delay:'+(-CFG.t*comp.repDur())+'s';}
  const tpl=document.createElement('template'); tpl.innerHTML=MARKUP;
  let n; while((n=tpl.content.querySelector('sc-if'))){const ok=lookup(n.getAttribute('value').replace(/[{}\\s]/g,''),v); if(ok) n.replaceWith(...n.childNodes); else n.remove();}
  tpl.content.querySelectorAll('*').forEach(el=>{for(const a of [...el.attributes]){const m=a.value.match(/^\\s*\\{\\{\\s*([\\w.$]+)\\s*\\}\\}\\s*$/);
    if(a.name==='onclick'&&m){el.removeAttribute(a.name);el.onclick=lookup(m[1],v);continue;}
    if(a.name==='disabled'&&m){el.removeAttribute('disabled');el.disabled=!!lookup(m[1],v);continue;}
    if(/\\{\\{/.test(a.value)) el.setAttribute(a.name,a.value.replace(/\\{\\{\\s*([\\w.$]+)\\s*\\}\\}/g,(_,q)=>{const x=lookup(q,v);return x==null?'':String(x)}));}});
  document.getElementById('host').replaceChildren(tpl.content);
}
const comp=new Component({theme:CFG.theme||'silent-black',autoplay:CFG.autoplay!==false,loop:CFG.loop!==false});
if(CFG.mode==='pics')Object.assign(comp.state,{mode:'pics',playing:false,started:false});
if(CFG.zoom)comp.state.zoom=CFG.zoom;
if(CFG.t!=null)Object.assign(comp.state,{playing:false,started:true});
render(); if(comp.componentDidMount)comp.componentDidMount();
</script></body></html>`;
const fails = [];
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };

// ---- 1. Text parity: the artboard carries the current build -----------------------------------------------
// Its CSS must equal the harness CSS (index.html) plus exactly the canvas-only edits below; its stage, figure,
// Pictures grid, bubbles and logic class must equal the harness text; the rest of its markup (caption row,
// chips, controls, hint) must equal PLAYER.md section 7. A rebuild that touches a canvas-edited rule fails
// the count here: carry that rule by hand, then update the table.
const hCss = idx.match(/<style>\n\/\* Artboard:[^\n]*\*\/\n([\s\S]*?)<\/style>/)[1];
const cCss = src.match(/<helmet>[\s\S]*?<style>\n([\s\S]*?)<\/style>\s*<\/helmet>/)[1];
{
  const tz = (a, b) => `font-size:calc(${a}px * var(--tz));line-height:calc(${b}px * var(--tz))`;
  // the harness and the canvas share the Roboto-first font stack (rig-final/gen.mjs BASE_CSS), so no font edit is needed here
  const EDITS = [ // [harness text, canvas text, expected count in the harness CSS]
    ['.player{--play:running;--dur:4s;--iter:infinite;--sets:infinite;--delay:0s;--sw:1;\n', '.player{--play:running;--dur:4s;--iter:infinite;--sets:infinite;--delay:0s;--sw:1;--tz:.8;\n', 1],
    ['.pill-accent{background:var(--accent-soft);color:var(--accent)}', '.pill-accent{background:var(--accent-soft);color:var(--text)}', 1],
    ['color:var(--accent);font-size:11px;line-height:18px;font-weight:700;text-align:center}', tz(11, 18) + ';font-weight:700;text-align:center;color:var(--text)}', 1],
    ['font:600 12px/16px inherit;font-family:inherit;', 'font-family:inherit;' + tz(12, 16) + ';font-weight:600;', 1],
    ['font:600 13px/16px inherit;font-family:inherit;', 'font-family:inherit;' + tz(13, 16) + ';font-weight:600;', 1],
    ['font-size:12px;line-height:16px', tz(12, 16), 4],
    ['font-size:11px;line-height:14px', tz(11, 14), 1],
    ['font-size:13px;line-height:18px', tz(13, 18), 1],
    ['font-size:15px;line-height:20px', tz(15, 20), 1],
  ];
  let want = hCss; const counts = [];
  for (const [a, b, n] of EDITS) { const k = want.split(a).length - 1; counts.push(k); if (k === n) want = want.split(a).join(b); }
  const badCounts = EDITS.map((e, i) => counts[i] === e[2] ? null : `edit ${i + 1}: ${counts[i]} matches, want ${e[2]}`).filter(Boolean);
  const firstDiff = s => { const x = s.split('\n'), y = want.split('\n'); const i = x.findIndex((l, j) => l !== y[j]); return i < 0 ? `line count ${x.length} vs ${y.length}` : `line ${i + 1}: "${x[i].slice(0, 70)}" vs "${(y[i] || '').slice(0, 70)}"`; };
  check(!badCounts.length && cCss === want, `canvas player: CSS = harness CSS + the ${EDITS.length} canvas-only edits (text zoom --tz, text-coloured accent pill and badge)${badCounts.length ? ' ' + badCounts.join('; ') : cCss === want ? '' : ' first difference ' + firstDiff(cCss)}`);
  check(/<helmet>\n<link rel="stylesheet" href="https:\/\/fonts\.googleapis\.com\/css2\?family=Roboto:wght@400\.\.700&amp;display=swap">\n<style>/.test(src), 'canvas player: helmet loads Roboto (Google Fonts css2 link) before the style');
  const kf = css => [...css.matchAll(/@keyframes ([\w-]+)\{/g)].map(m => m[1]);
  const kfText = css => css.split('\n').filter(l => l.startsWith('@keyframes ')).join('\n');
  const hk = kf(hCss), ck = kf(cCss);
  check(hk.length > 0 && hk.join() === ck.join() && kfText(hCss) === kfText(cCss), `canvas player: same keyframe names (${ck.length}) and the same keyframe text as the harness`);
  const groups = s => [...s.match(/<svg class="scene"[\s\S]*?<\/svg>/)[0].matchAll(/class="([^"]*\banim\b[^"]*)"/g)].map(m => m[1]);
  const hg = groups(idx), cg = groups(markup);
  check(hg.length > 0 && hg.join('|') === cg.join('|'), `canvas player: same animated groups as the harness (${cg.length}: ${[...new Set(cg.map(c => c.match(/lr-[\w-]+/)?.[0]).filter(Boolean))].join(', ')})`);
  // the figure group, cut by counting nested <g> tags
  const figure = s => { const i = s.indexOf('<g class="figure"'); if (i < 0) return ''; const re = /<g[\s>]|<\/g>/g; re.lastIndex = i; let d = 0, m; while ((m = re.exec(s))) { d += m[0][1] === '/' ? -1 : 1; if (!d) return s.slice(i, m.index + 4); } return ''; };
  const hf = figure(idx), cf = figure(markup);
  check(hf.length > 0 && hf === cf, `canvas player: the figure markup is the harness text (${cf.length} chars, ${(cf.match(/<polygon/g) || []).length} polygons)`);
  const piece = (s, re) => (s.match(re) || [''])[0];
  const PIECES = { stage: /<svg class="scene"[\s\S]*?<\/svg>/, pictures: /<div class="pics">[^\n]*/, bubbles: /<div class="bubble bub-1">[\s\S]*?bub-3[^\n]*/ };
  const pm = Object.entries(PIECES).filter(([, re]) => !piece(idx, re) || piece(idx, re) !== piece(markup, re)).map(([k]) => k);
  check(!pm.length, `canvas player: stage SVG (figure, dumbbells, paths, overlays), Pictures grid and bubbles are the harness text${pm.length ? '; differ: ' + pm.join(', ') : ''}`);
  const hLogic = idx.match(/\/\* ===== artboard logic[^\n]*\n([\s\S]*?)\n\/\* ===== harness only/)[1];
  check(hLogic.trim() === script.trim(), 'canvas player: the logic class is the harness logic, character for character');
  // the rest of the markup (caption row, chips, controls, hint) and data-props: PLAYER.md section 7 with 9.1-9.3 filled
  const sec = (head, lang) => { const i = md.indexOf(head); const a = md.indexOf('```' + lang + '\n', i) + lang.length + 4; return md.slice(a, md.indexOf('\n```\n', a)); };
  const skel = sec('## 7. Artboard skeleton', 'html').replace('<!-- stage SVG: section 9.1 -->', () => sec('### 9.1 Stage SVG', 'html'))
    .replace('<!-- Pictures grid: section 9.2 -->', () => sec('### 9.2 Pictures grid', 'html')).replace('<!-- caption bubbles: section 9.3 -->', () => sec('### 9.3 Caption bubbles', 'html'));
  const mdMarkup = skel.match(/<\/helmet>([\s\S]*?)<\/x-dc>/)[1], props = s => (s.match(/data-dc-script data-props='([^']*)'/) || [])[1];
  check(mdMarkup === markup && props(skel) === props(src), 'canvas player: markup (caption row, chips, controls, hint) and data-props are PLAYER.md section 7, character for character');
  // format rules the artboard must keep
  const kb = Buffer.byteLength(src) / 1024;
  const raw = (cCss + markup.replace(/href="#rig-lr"/g, '')).match(/#[0-9a-fA-F]{3,8}\b|rgba?\(|hsla?\(/g);
  check(kb < 450 && src.includes('<head>\n<meta charset="utf-8">\n<title>Dumbbell Lateral Raise form guide</title>\n<script src="./support.js"></script>\n</head>') && !raw && !/innerHTML|appendChild|createElement|addEventListener\(['"]keydown/.test(script),
    `canvas player: ${kb.toFixed(1)} KB (limit 450), support.js head intact, no raw colour in CSS or markup (${raw ? raw.slice(0, 3).join(' ') : 'none'}), no script-built DOM`);
}

(async () => {
  const b = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const errors = [];
  const TMP = path.join(OUT, 'canvas-tmp.html');
  const open = async (cfg, opts = {}) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: opts.scale || 2, reducedMotion: opts.rm ? 'reduce' : 'no-preference' });
    const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    fs.writeFileSync(TMP, page0(cfg));
    await page.goto('file://' + TMP); await page.waitForTimeout(cfg.zoom ? 800 : 450); return { page, ctx };
  };
  const harness = async query => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: 2 });
    const page = await ctx.newPage(); await page.goto('file://' + path.join(DIR, 'index.html') + query); await page.waitForTimeout(450); return { page, ctx };
  };
  const shot = async (cfg, name, opts) => { const { page, ctx } = await open(cfg, opts); await (await page.$('.player')).screenshot({ path: path.join(OUT, OUTP + name) }); await ctx.close(); };

  // ---- 2. Drawn parity: every animated element sits exactly where the harness draws it -------------------------
  const drawn = () => {
    const svg = document.querySelector('.scene');
    const els = [...svg.querySelectorAll('.anim')].map(el => { const m = el.getCTM(), cs = getComputedStyle(el); return [m.a, m.b, m.c, m.d, m.e, m.f, +cs.opacity, parseFloat(cs.strokeDashoffset) || 0]; });
    const cap = [...document.querySelectorAll('.capx')].filter(c => getComputedStyle(c).opacity === '1').map(c => c.textContent).join('|');
    const at = (sel, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(document.querySelector(sel).getCTM()); return [q.x, q.y]; };
    return { els, cap, grip: at('.lr-db-r', 22, 16), capPx: getComputedStyle(document.querySelector('.cap')).fontSize };
  };
  {
    const res = [];
    for (const t of [0, 0.125, 0.25, 0.3, 0.5, 0.625, 0.875]) {
      const c = await open({ t }); const cv = await c.page.evaluate(drawn); await c.ctx.close();
      const h = await harness(`?t=${t}`); const hv = await h.page.evaluate(drawn); await h.ctx.close();
      let worst = cv.els.length === hv.els.length ? 0 : Infinity;
      cv.els.forEach((row, i) => row.forEach((x, j) => { worst = Math.max(worst, Math.abs(x - hv.els[i][j])); }));
      res.push({ t, worst, n: cv.els.length, cap: cv.cap, capOk: cv.cap === hv.cap && cv.cap.length > 0, grip: cv.grip, capPx: [cv.capPx, hv.capPx] });
    }
    check(res.every(r => r.worst < 1e-3 && r.capOk), `canvas player: drawn frames match the harness at ${res.length} points (${res[0].n} animated elements, worst difference ${Math.max(...res.map(r => r.worst)).toExponential(1)}; captions ${res.map(r => `t ${r.t} "${r.cap}"`).join(', ')})`);
    check(res.every(r => r.capPx[0] === '12px' && r.capPx[1] === '15px'), `canvas player: text zoom applies (caption ${res[0].capPx[0]} on the canvas, ${res[0].capPx[1]} in the harness)`);
    console.log('  screen-right grip (canvas): ' + res.map(r => `t ${r.t} (${r.grip.map(v => v.toFixed(1)).join(', ')})`).join('; '));
  }
  // ---- 3. Layout: nothing clipped in the caption row, chips and controls (dark and Paper, with the canvas text zoom)
  for (const theme of ['silent-black', 'paper']) {
    const { page, ctx } = await open({ t: 0.25, theme });
    const r = await page.evaluate(() => {
      const root = document.querySelector('.player').getBoundingClientRect();
      const out = [...document.querySelectorAll('.cap-row, .cap, .tempo, .chips .chip, .controls button, .seg button, .hint')].filter(el => el.getClientRects().length)
        .filter(el => { const q = el.getBoundingClientRect(); return el.scrollWidth > el.clientWidth + 1 || q.left < root.left - 0.5 || q.right > root.right + 0.5; }).map(el => el.className || el.tagName);
      return { out, n: document.querySelectorAll('.chips .chip').length, bg: getComputedStyle(document.querySelector('.stage')).backgroundColor };
    });
    check(r.out.length === 0 && r.n === 3, `canvas player (${theme}): caption row, 3 zoom chips, controls and hint inside the player with no overflow${r.out.length ? '; over: ' + r.out.join(', ') : ''} (stage ${r.bg})`);
    await ctx.close();
  }
  // ---- 4. Zoom: a chip click through the onClick hole zooms, shows only its bubble, and a second click zooms out
  {
    const { page, ctx } = await open({});
    const read = () => page.evaluate(() => ({ cls: document.querySelector('.player').className, pressed: [...document.querySelectorAll('.chips .chip')].map(c => c.getAttribute('aria-pressed')).join(),
      bub: [...document.querySelectorAll('.bubble')].map(x => getComputedStyle(x).display !== 'none' ? 1 : 0).join(''), pill: getComputedStyle(document.querySelector('.pill-row')).display }));
    await page.click('.chips .chip:nth-child(1)'); await page.waitForTimeout(900);
    const z = await read();
    const m = await page.evaluate(() => new DOMMatrix(getComputedStyle(document.querySelector('.cam')).transform).a);
    await page.click('.chips .chip:nth-child(1)'); await page.waitForTimeout(900);
    const off = await read();
    check(/\bzoom-1\b/.test(z.cls) && z.pressed === 'true,false,false' && z.bub === '100' && z.pill === 'none' && Math.abs(m - 2.2) < 0.01 && !/zoom-/.test(off.cls) && off.bub === '000' && off.pill !== 'none',
      `canvas player: Shoulders chip zooms (x${m.toFixed(2)}, pressed ${z.pressed}, bubbles ${z.bub}, pill ${z.pill}) and a second tap zooms out (bubbles ${off.bub})`);
    await ctx.close();
  }
  // ---- 5. Pictures: grid of 4 different poses; a still hides the grid and shows its own caption
  {
    const { page, ctx } = await open({ mode: 'pics' });
    const r = await page.evaluate(() => ({ grid: getComputedStyle(document.querySelector('.pics')).display, tiles: [...document.querySelectorAll('.pics .tile')].map(t => t.querySelector('use').getAttribute('style').match(/--delay:[^;]*/)?.[0]),
      caps: [...document.querySelectorAll('.pics .tile p')].map(p => p.textContent), play: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState }));
    check(r.grid === 'grid' && r.tiles.length === 4 && new Set(r.tiles).size === 4 && r.play === 'paused', `canvas player: Pictures shows the grid with 4 different poses (${r.tiles.join(' ')}), stage paused; captions ${r.caps.map(c => '"' + c + '"').join(', ')}`);
    await page.click('.chips .chip:nth-child(2)'); await page.waitForTimeout(900);
    const s = await page.evaluate(() => ({ grid: getComputedStyle(document.querySelector('.pics')).display, line: document.querySelector('.cap').textContent }));
    check(s.grid === 'none' && s.line === 'Stop at shoulder height', `canvas player: Path still hides the grid and shows its picture caption ("${s.line}")`);
    await ctx.close();
  }
  // ---- 6. Reduced motion: key poses, paused even if the root says running, Animation and Play disabled, hint
  {
    const { page, ctx } = await open({}, { rm: true });
    const r = await page.evaluate(() => {
      document.querySelector('.player').style.setProperty('--play', 'running');
      return { grid: getComputedStyle(document.querySelector('.pics')).display, play: getComputedStyle(document.querySelector('.lr-ua-r')).animationPlayState,
        hint: document.querySelector('.hint').textContent, dis: [...document.querySelectorAll('button')].filter(x => x.disabled).map(x => x.getAttribute('aria-label') || x.textContent.trim()).join(',') };
    });
    check(r.grid === 'grid' && r.play === 'paused' && /reduce motion/.test(r.hint) && /Play/.test(r.dis) && /Animation/.test(r.dis), `canvas player: reduced motion shows the key poses (${r.grid}), stays ${r.play} with the root forced to running, disables ${r.dis}; hint "${r.hint}"`);
    await ctx.close();
  }
  // ---- 7. Frames to look at (compare with the harness shots lr_*.png)
  await shot({ t: 0 }, 'canvas_dark_t0.png');
  await shot({ t: 0.25 }, 'canvas_dark_t0.25.png');
  await shot({ t: 0, theme: 'paper' }, 'canvas_paper_t0.png');
  await shot({ t: 0.25, theme: 'paper' }, 'canvas_paper_t0.25.png');
  await shot({ t: 0.25, zoom: 1 }, 'canvas_zoom1_t0.25.png');
  await shot({ t: 0.25, zoom: 3 }, 'canvas_zoom3_t0.25.png');
  await shot({ mode: 'pics' }, 'canvas_pictures_silent-black.png');
  await shot({ mode: 'pics', theme: 'paper' }, 'canvas_pictures_paper.png');
  await shot({ mode: 'pics', zoom: 2 }, 'canvas_pictures_still_zoom2.png');
  await shot({}, 'canvas_reduced-motion.png', { rm: true });
  await shot({ autoplay: false, loop: false }, 'canvas_about-import_autoplay-off.png');
  check(errors.length === 0, `canvas player: no page errors (${errors.length}) ${errors.slice(0, 2).join(' | ')}`);
  fs.unlinkSync(TMP);
  await b.close();
  console.log(fails.length ? fails.length + ' FAILED' : 'CANVAS CHECKS PASSED');
  process.exit(fails.length ? 1 : 0);
})();
