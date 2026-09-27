// canvas-check.cjs: renders project/Player-MachineChestPress.dc.html with a minimal stand-in for
// the canvas runtime (holes in attributes and text, sc-if, onClick, onKeyDown), runs a parity probe against index.html, the two round 3 probes and a muscle tap probe (spec 2.10) on it, and writes canvas_*.png
// frames into shots/. Exit 1 on a failed probe.
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const DIR = __dirname, OUT = path.join(DIR, 'shots');
const src = fs.readFileSync(process.env.CANVAS || path.join(DIR, '..', 'project', 'Player-MachineChestPress.dc.html'), 'utf8');
const OUTP = process.env.CANVAS ? 'before_' : '';
const helmet = src.match(/<helmet>([\s\S]*?)<\/helmet>/)[1].replace(/<link[^>]*googleapis[^>]*>/g, '');
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
    if(a.name==='onkeydown'&&m){el.removeAttribute(a.name);el.onkeydown=lookup(m[1],v);continue;}
    if(a.name==='disabled'&&m){el.removeAttribute('disabled');el.disabled=!!lookup(m[1],v);continue;}
    if(/\\{\\{/.test(a.value)) el.setAttribute(a.name,a.value.replace(/\\{\\{\\s*([\\w.$]+)\\s*\\}\\}/g,(_,q)=>{const x=lookup(q,v);return x==null?'':String(x)}));}});
  const tw=document.createTreeWalker(tpl.content,NodeFilter.SHOW_TEXT); for(let t;(t=tw.nextNode());) if(/\\{\\{/.test(t.data)) t.data=t.data.replace(/\\{\\{\\s*([\\w.$]+)\\s*\\}\\}/g,(_,q)=>{const x=lookup(q,v);return x==null?'':String(x)});
  document.getElementById('host').replaceChildren(tpl.content);
}
const comp=new Component({theme:CFG.theme||'silent-black',autoplay:CFG.autoplay!==false,loop:CFG.loop!==false});
if(CFG.mode==='pics')Object.assign(comp.state,{mode:'pics',playing:false,started:false});
if(CFG.zoom)comp.state.bubble={kind:'zoom',id:CFG.zoom};
if(CFG.muscle)comp.state.bubble={kind:'muscle',id:CFG.muscle};
if(CFG.t!=null)Object.assign(comp.state,{playing:false,started:true});
render(); if(comp.componentDidMount)comp.componentDidMount();
</script></body></html>`;
const fails = [];
const check = (ok, msg) => { console.log((ok ? 'PASS ' : 'FAIL ') + msg); if (!ok) fails.push(msg); };
// probe 3 (parity): the artboard carries the current build. Its CSS must equal the harness CSS (index.html) plus exactly
// the canvas-only edits below, and its stage, Pictures grid, bubbles and logic class must equal the harness text.
// A rebuild that touches a canvas-edited rule fails the count here: carry that rule by hand, then update the table.
{
  const idx = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
  const hCss = idx.match(/<style>\n\/\* Artboard:[^\n]*\*\/\n([\s\S]*?)<\/style>/)[1];
  const cCss = src.match(/<helmet>[\s\S]*?<style>\n([\s\S]*?)<\/style>\s*<\/helmet>/)[1];
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
  // a muscle's class hole renders its EX.muscles class (plus sel only while tapped), so it is read as that class here
  const EXM = new Function(script.slice(0, script.indexOf('const on = ')) + 'return EX;')().muscles || [];
  const hg = groups(idx), cg = groups(markup.replace(/class="\{\{ cls([A-Za-z]+) \}\}"/g, (_, id) => `class="${(EXM.find(m => m.Id === id) || { cls: 'cls' + id }).cls}"`));
  check(hg.length > 0 && hg.join('|') === cg.join('|'), `canvas player: same animated groups as the harness (${cg.length}: ${[...new Set(cg.map(c => c.match(/cp-[\w]+/)?.[0]).filter(Boolean))].join(', ')})`);
  const piece = (s, re) => (s.match(re) || [''])[0];
  // The harness binds through data-* attributes; the canvas through holes. Muscle info (spec 2.10) is the only binding
  // inside these pieces, so the harness text is mapped to holes exactly as build.mjs maps it, then compared whole.
  const MUS = new Function(script.slice(0, script.indexOf('const on = ')) + 'return EX;')().muscles || [];
  const holes = s => s.replace(/class="[^"]*" data-class="(cls[A-Za-z]+)"/g, 'class="{{ $1 }}"')
    .replace(/ data-hot="(\d+)"/g, (_, i) => MUS[+i] ? ` onClick="{{ tap${MUS[+i].Id} }}" onKeyDown="{{ key${MUS[+i].Id} }}"` : ` data-hot="${i}"`);
  const bubbleHoles = s => s && '<sc-if value="{{ showBubble }}" hint-placeholder-val="{{ true }}">' + s.replace(' data-if="showBubble" hidden', '')
    .replace(' data-style="bubbleDotStyle">', ' style="{{ bubbleDotStyle }}">').replace(/<([a-z]+) data-text="(bubbleName|bubbleRest)"><\/\1>/g, '<$1>{{ $2 }}</$1>') + '</sc-if>';
  const PIECES = { // [harness pattern, canvas pattern, harness text -> canvas text]
    stage: [/<svg class="scene"[\s\S]*?<\/svg>/, /<svg class="scene"[\s\S]*?<\/svg>/, holes],
    pictures: [/<div class="pics">[^\n]*/, /<div class="pics">[^\n]*/, s => s],
    bubble: [/<div class="bubble" data-if="showBubble" hidden>[^\n]*/, /<sc-if value="\{\{ showBubble \}\}"[^\n]*/, bubbleHoles],
  };
  const pm = Object.entries(PIECES).filter(([k, [hr, cr, f]]) => !piece(idx, hr) || f(piece(idx, hr)) !== piece(markup, cr)).map(([k]) => k);
  check(!pm.length, `canvas player: stage SVG (figure, machine, overlays, muscle hotspots), Pictures grid and bubble are the harness text${pm.length ? '; differ: ' + pm.join(', ') : ''}`);
  const hLogic = idx.match(/\/\* ===== artboard logic[^\n]*\n([\s\S]*?)\n\/\* ===== harness only/)[1];
  check(hLogic.trim() === script.trim(), 'canvas player: the logic class is the harness logic, character for character');
}
(async () => {
  const b = await chromium.launch(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {});
  const errors = [];
  const open = async (cfg, scale = 2) => {
    const ctx = await b.newContext({ viewport: { width: 390, height: 520 }, deviceScaleFactor: scale });
    const page = await ctx.newPage(); page.on('pageerror', e => errors.push(e.message));
    const f = path.join(__dirname, 'canvas-tmp.html'); fs.writeFileSync(f, page0(cfg));
    await page.goto('file://' + f); await page.waitForTimeout(cfg.zoom ? 800 : 450); return { page, ctx };
  };
  const shot = async (cfg, name) => { const { page, ctx } = await open(cfg); await (await page.$('.player')).screenshot({ path: path.join(OUT, OUTP + name) }); await ctx.close(); };
  // probe 1: the pause looks bent from the side
  {
    const res = [];
    for (const t of [0.25, 0.3, 0.375]) {
      const { page, ctx } = await open({ t });
      res.push(await page.evaluate(t => {
        const svg = document.querySelector('.scene'), at = (el, x, y) => { const p = svg.createSVGPoint(); p.x = x; p.y = y; const q = p.matrixTransform(el.getCTM()); return [q.x, q.y]; };
        const S = at(document.querySelector('.arm-near'), 0, -62), E = at(document.querySelector('.arm-near .cp-fa'), 0, -24), G = at(document.querySelector('.arm-near .cp-hd'), 0, 16);
        const u = [S[0] - E[0], S[1] - E[1]], v = [G[0] - E[0], G[1] - E[1]];
        const ang = Math.acos((u[0] * v[0] + u[1] * v[1]) / Math.hypot(...u) / Math.hypot(...v)) * 180 / Math.PI;
        const h = ((G[0] - S[0]) * (E[1] - S[1]) - (G[1] - S[1]) * (E[0] - S[0])) / Math.hypot(G[0] - S[0], G[1] - S[1]);
        return { t, ang, h, cap: [...document.querySelectorAll('.capx')].filter(c => getComputedStyle(c).opacity === '1').map(c => c.textContent).join('|') };
      }, t));
      await ctx.close();
    }
    check(res.every(q => q.ang >= 155 && q.ang <= 169 && q.h >= 3.9 && (q.t >= 0.375 || q.cap === 'Pause, don’t lock out')), `canvas player: pause drawn bent, caption Pause inside its window, 25 to 37.5 % (${res.map(q => `t ${q.t}: ${q.ang.toFixed(2)} deg, ${q.h.toFixed(2)} below, "${q.cap}"`).join('; ')})`);
  }
  // probe 2: tile 1 corner plain (badge hidden), and not plain with the bracket forced on
  {
    const { page, ctx } = await open({ mode: 'pics' });
    const clip = await page.evaluate(() => { const s = document.querySelector('.tile svg'), vb = s.viewBox.baseVal, r = s.getBoundingClientRect(); const k = Math.min(r.width / vb.width, r.height / vb.height); const x0 = vb.x + vb.width / 2 - r.width / k / 2, y0 = vb.y + vb.height / 2 - r.height / k / 2; document.querySelectorAll('.tile .badge').forEach(el => { el.style.visibility = 'hidden'; }); return { x: r.left + (44 - x0) * k, y: r.top + (106 - y0) * k, width: 13 * k, height: 5 * k }; });
    const off = async () => { const b64 = (await page.screenshot({ clip })).toString('base64'); return page.evaluate(async s => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data, n = {}; for (let j = 0; j < d.length; j += 4) { const k = d[j] + ',' + d[j + 1] + ',' + d[j + 2]; n[k] = (n[k] || 0) + 1; } const bg = Object.keys(n).sort((a, b) => n[b] - n[a])[0].split(',').map(Number); let o = 0; for (let j = 0; j < d.length; j += 4) if (Math.abs(d[j] - bg[0]) + Math.abs(d[j + 1] - bg[1]) + Math.abs(d[j + 2] - bg[2]) > 12) o++; return o; }, b64); };
    const now = await off();
    await page.evaluate(() => document.querySelector('.tile use').style.setProperty('--stack-top', '1'));
    const forced = await off();
    check(now === 0 && forced > 0, `canvas player: Pictures tile 1 has no cut-off bracket or cable (${now} off; forced on: ${forced})`);
    const stage = await page.evaluate(() => getComputedStyle(document.querySelector('.scene .stack-top')).opacity);
    check(stage === '1', `canvas player: the stage still shows the stack's top bracket (opacity ${stage})`);
    await ctx.close();
  }
  // probe 4 (muscle info on tap, spec 2.10): on the canvas markup, at t 0.3, a tap where each muscle is visible opens the
  // bubble with its exact text, bold name and dot in the region's own fill colour, and the .sel outline on its polygons only;
  // a second tap closes; a zoom chip replaces a muscle bubble with its caption (accent dot); Enter on a hotspot opens.
  {
    const { page, ctx } = await open({ t: 0.3 });
    const muscles = await page.evaluate(() => EX.muscles || []);
    const text = m => `${m.common} (${m.anatomical}), ${m.role === 'main' ? 'target' : 'helps'}. ${m.line}`;
    const state = () => page.evaluate(() => { const b = document.querySelector('.bubble'), shown = !!b && getComputedStyle(b).display !== 'none';
      const sel = [...document.querySelectorAll('.stage .scene .sel')].filter(el => !el.closest('.pics'));
      return { shown, text: shown ? b.textContent.replace(/\s+/g, ' ').trim() : '', name: shown ? (b.querySelector('b') || {}).textContent || '' : '', dot: shown ? getComputedStyle(b.querySelector('.dot')).backgroundColor : '',
        sel: sel.length, selFill: sel.length ? getComputedStyle(sel[0]).fill : '', selAll: sel.map(el => el.getAttribute('class')).join('|'), accent: getComputedStyle(document.querySelector('.stage .scene .guide')).stroke }; });
    const tap = region => page.evaluate(region => { for (const el of document.querySelectorAll('.stage .scene .hot-core')) { if (el.dataset.muscle !== region) continue; const b = el.getBBox(), m = el.getScreenCTM(), x = b.x + b.width / 2, y = b.y + b.height / 2;
      const p = { x: m.a * x + m.c * y + m.e, y: m.b * x + m.d * y + m.f }, hit = document.elementFromPoint(p.x, p.y); if (hit && hit.classList.contains('hot') && hit.dataset.muscle === region) return p; } return null; }, region)
      .then(async p => { if (p) { await page.mouse.click(p.x, p.y); await page.waitForTimeout(30); } return !!p; });
    const rows = [];
    for (const m of muscles) {
      const hit = await tap(m.region), s1 = await state(), want = await page.evaluate(Id => MARKUP.split('class="{{ cls' + Id + ' }}"').length - 1, m.Id);
      await tap(m.region); const s2 = await state();
      rows.push({ id: m.id, ok: hit && s1.shown && s1.text === text(m) && s1.name === m.common && s1.dot === s1.selFill && s1.sel === want && s1.selAll.split('|').every(c => c === m.cls + ' sel') && !s2.shown && s2.sel === 0, s1, want });
    }
    check(rows.length > 0 && rows.every(r => r.ok), `canvas player: tapping each muscle at t 0.3 opens its text with the bold name and the dot in its fill colour, outlines its polygons only, and a second tap closes (${rows.map(r => `${r.id}: "${r.s1.name}" dot ${r.s1.dot}, ${r.s1.sel} of ${r.want} outlined${r.ok ? '' : ' FAILED'}`).join('; ')})`);
    if (muscles.length) await tap(muscles[0].region); await page.click('.chips .chip:nth-child(1)'); await page.waitForTimeout(50);
    const z = await state(), cap = await page.evaluate(() => (EX.chips || [{ caption: null }])[0].caption);
    check(z.shown && z.text === cap && z.name === '' && z.dot === z.accent && z.sel === 0, `canvas player: a zoom chip replaces the muscle bubble with its caption ("${z.text}", accent dot, no outline)`);
    await page.click('.chips .chip:nth-child(1)'); await page.waitForTimeout(50);
    await page.evaluate(region => { const el = document.querySelector('.stage .scene .hot:not(.hot-core)[data-muscle="' + region + '"]'); if (el) el.focus(); }, muscles.length ? muscles[0].region : '');
    await page.keyboard.press('Enter'); await page.waitForTimeout(30); const k = await state();
    check(muscles.length > 0 && k.shown && k.text === text(muscles[0]), `canvas player: Enter on the focused target hotspot opens its bubble`);
    await ctx.close();
  }
  for (const th of ['silent-black', 'paper']) for (const m of ['chest', 'frontDelts', 'triceps']) await shot({ t: 0.3, theme: th, muscle: m }, `canvas_muscle-${m}_${th}.png`);
  await shot({ t: 0.3 }, 'canvas_dark_t0.3.png');
  await shot({ t: 0 }, 'canvas_dark_t0.png');
  await shot({ t: 0.25 }, 'canvas_dark_t0.25.png');
  await shot({ t: 0, theme: 'paper' }, 'canvas_paper_t0.png');
  await shot({ t: 0.25, theme: 'paper' }, 'canvas_paper_t0.25.png');
  await shot({ t: 0.25, zoom: 1 }, 'canvas_zoom1_t0.25.png');
  await shot({ t: 0.25, zoom: 2 }, 'canvas_zoom2_t0.25.png');
  await shot({ mode: 'pics' }, 'canvas_pictures_silent-black.png');
  await shot({ mode: 'pics', theme: 'paper' }, 'canvas_pictures_paper.png');
  await shot({ mode: 'pics', zoom: 2 }, 'canvas_pictures_still_zoom2.png');
  await shot({ autoplay: false, loop: false }, 'canvas_about-import_autoplay-off.png');
  await shot({ t: 0.3, theme: 'midnight' }, 'canvas_midnight_t0.3.png');
  check(errors.length === 0, `canvas player: no page errors (${errors.length}) ${errors.slice(0, 2).join(' | ')}`);
  fs.unlinkSync(path.join(__dirname, 'canvas-tmp.html'));
  await b.close();
  console.log(fails.length ? fails.length + ' FAILED' : 'CANVAS CHECKS PASSED');
  process.exit(fails.length ? 1 : 0);
})();
