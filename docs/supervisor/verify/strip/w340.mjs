import { join } from 'node:path'; import { pathToFileURL } from 'node:url';
const [W, page] = process.argv.slice(2);
const { chromium } = await import(pathToFileURL(join(W, 'node_modules/playwright/index.mjs')).href);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium' });
for (const w of [390, 360, 340]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(pathToFileURL(page).href); await p.evaluate(() => document.fonts.ready);
  const r = await p.evaluate(() => {
    // worst case from the 17 cards: jump_squat under B, three phases
    const t = document.querySelector('#card-box-jump-b .tempo').cloneNode(true); t.id = 'worst';
    const seg = (ph, wd) => `<div class="tempo-seg move" style="flex:1 1 0"><i></i><div class="tempo-label"><b>${ph}</b><span>${wd}</span></div></div>`;
    t.innerHTML = seg('Lower', 'Controlled') + seg('Jump', 'Explosive') + seg('Step down', '&nbsp;');
    document.querySelector('#card-box-jump-b').appendChild(t);
    return [...document.querySelectorAll('.tempo')].map(t => { const s = t.getBoundingClientRect(); const out = [...t.querySelectorAll('.tempo-label')].filter(l => { const r = l.getBoundingClientRect(); return r.left < s.left - .5 || r.right > s.right + .5; }).length; return `${t.closest('article').id.slice(5)}${t.id ? '(worst)' : ''}:${t.scrollWidth > t.clientWidth || out ? 'OVERFLOW' : 'ok'}`; }).join(' ');
  });
  console.log(w, r); await p.close();
}
await b.close();
