import { readFileSync } from 'node:fs';
import { chromium } from '/home/user/M-arc/node_modules/playwright/index.mjs';
import { renderFeelMap, renderFeelLegend, FEEL_CSS } from '/tmp/claude-0/-home-user-M-arc/27922d25-fb43-5b1a-9d50-3c8a55370d3e/scratchpad/plates2/engine/feelmap.mjs';
import { allThemesCss } from '/tmp/claude-0/-home-user-M-arc/27922d25-fb43-5b1a-9d50-3c8a55370d3e/scratchpad/plates2/engine/themes.mjs';
const TOKENS = readFileSync('/tmp/claude-0/-home-user-M-arc/27922d25-fb43-5b1a-9d50-3c8a55370d3e/scratchpad/plates2/engine/tokens.css','utf8');
const card = JSON.parse(readFileSync('/tmp/claude-0/-home-user-M-arc/27922d25-fb43-5b1a-9d50-3c8a55370d3e/scratchpad/plates2/engine/../../grip/research/machine_chest_press.json','utf8'));
const r = renderFeelMap({ primary: card.feel.primary, secondary: card.feel.secondary, views: ['front','back'], id:'x', autoplay: true });
const html = `<!doctype html><html data-theme="silent-black"><head><style>${TOKENS}${allThemesCss()}${FEEL_CSS} body{margin:0;background:var(--bg);width:390px}.feel-map{--feel-map-h:300px}</style></head><body>${r.html}</body></html>`;
console.log('feel map html', html.length, 'bands', (r.html.match(/feel-band/g)||[]).length, 'els approx', (r.html.match(/<[a-z]/g)||[]).length);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const rate of [1,4,6]) {
  const p = await b.newPage({ viewport:{width:390,height:844}, deviceScaleFactor:2 });
  const cdp = await p.context().newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate });
  await cdp.send('Performance.enable');
  for (const mode of ['idle','shimmer']) {
    await p.setContent(html.replace(mode==='idle' ? /is-playing/g : /$^/, ''));
    const m0 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
    const fr = await p.evaluate(() => new Promise(res => { const d=[]; let last=performance.now(); const t0=last;
      const f = t => { d.push(t-last); last=t; if (t-t0<5600) requestAnimationFrame(f); else res(d); }; requestAnimationFrame(f); }));
    const m1 = Object.fromEntries((await cdp.send('Performance.getMetrics')).metrics.map(x=>[x.name,x.value]));
    fr.sort((a,b)=>a-b); const p95 = fr[Math.floor(fr.length*.95)];
    const dt = k => ((m1[k]-m0[k])*1000).toFixed(0);
    console.log(`rate ${rate}x ${mode.padEnd(7)} frames ${fr.length} p95 ${p95.toFixed(1)}ms max ${fr[fr.length-1].toFixed(1)} | task ${dt('TaskDuration')}ms style ${dt('RecalcStyleDuration')} layout ${dt('LayoutDuration')}`);
  }
  await p.close();
}
await b.close();
