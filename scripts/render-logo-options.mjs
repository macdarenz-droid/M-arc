// Draw candidate marks for the M/ARC logo across the themes so one can be picked.
import { chromium } from 'playwright';
import { mkdirSync } from 'node:fs';
import { THEMES, THEME_IDS } from '../node_modules/.cache/logo-themes.mjs';

const tile = (bg, body, r = 14) => `<rect width="64" height="64" rx="${r}" fill="${bg}"/>${body}`;
const S = 'stroke-linecap="round" stroke-linejoin="round" fill="none"';

export const OPTIONS = [
  { id: 'A', name: 'Slash', blurb: 'Geometric M, the right diagonal is the accent slash. Linear-like.',
    draw: c => tile(c.bg, `<path d="M12 50V14L32 34M52 14V50" stroke="${c.ink}" stroke-width="8" ${S}/><path d="M22 44L58 8" stroke="${c.accent}" stroke-width="8" ${S}/>`) },
  { id: 'B', name: 'Arc', blurb: 'A progress ring three-quarters closed around a small M. Nods to "ARC" and recovery rings.',
    draw: c => tile(c.bg, `<path d="M46 47.5A20 20 0 1 1 46 16.5" stroke="${c.accent}" stroke-width="6" ${S}/><circle cx="46" cy="47.5" r="3" fill="${c.ink}"/><path d="M22 41V24L32 33L42 24V41" stroke="${c.ink}" stroke-width="5.5" ${S}/>`) },
  { id: 'C', name: 'Peaks', blurb: 'Two solid peaks with a knocked-out slash between them. Reads as an M and a summit.',
    draw: c => tile(c.bg, `<path d="M8 52L24 16L34 36L40 24L56 52Z" fill="${c.ink}"/><path d="M26 56L46 12" stroke="${c.bg}" stroke-width="7" ${S}/><path d="M50 12L56 12L56 20" stroke="${c.accent}" stroke-width="5" ${S}/>`) },
  { id: 'D', name: 'Plates', blurb: 'The M built from stacked bars, like plates on a rack. The top bar is the accent.',
    draw: c => tile(c.bg, `<rect x="12" y="15" width="10" height="34" rx="3" fill="${c.ink}"/><rect x="42" y="15" width="10" height="34" rx="3" fill="${c.ink}"/><path d="M17 20L32 36L47 20" stroke="${c.ink}" stroke-width="8" ${S}/><rect x="9" y="8" width="46" height="5" rx="2.5" fill="${c.accent}"/>`) },
  { id: 'E', name: 'Pulse', blurb: 'One continuous line: an M that spikes like a heartbeat. Whoop-like energy.',
    draw: c => tile(c.bg, `<path d="M8 40H16L22 22L30 50L36 30L40 40H56" stroke="${c.ink}" stroke-width="6" ${S}/><circle cx="30" cy="50" r="4.5" fill="${c.accent}"/>`) },
  { id: 'F', name: 'Type', blurb: 'Bold wordmark in the tile, slash in accent. Vercel and Strong keep it this plain.',
    draw: c => tile(c.bg, `<text x="32" y="43" text-anchor="middle" font-family="Inter, system-ui, sans-serif" font-size="30" font-weight="800" letter-spacing="-1.5" fill="${c.ink}">M<tspan fill="${c.accent}">/</tspan>A</text>`) },
];

const svg = (opt, c, size) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}">${opt.draw(c)}</svg>`;
const colors = id => { const t = THEMES[id].tokens; return { ink: t.text, accent: t.accent, bg: t.bg, border: t.border, text2: t.text2 }; };

const main = colors('silent-black');
const rows = OPTIONS.map(o => `
<div style="display:flex;align-items:center;gap:22px;padding:18px 24px;border-bottom:1px solid ${main.border}">
  <div style="font:700 22px Inter,system-ui;color:${main.accent};width:28px">${o.id}</div>
  <div style="border:1px solid ${main.border};border-radius:22px;line-height:0">${svg(o, main, 96)}</div>
  <div style="line-height:0">${svg(o, main, 24)}</div>
  <div style="flex:1"><div style="font:700 17px Inter,system-ui;color:${main.ink}">${o.name}</div><div style="font:400 13px Inter,system-ui;color:${main.text2};margin-top:4px;max-width:300px">${o.blurb}</div></div>
  <div style="display:flex;gap:8px">${THEME_IDS.filter(t => t !== 'silent-black').map(t => `<div style="border:1px solid ${colors(t).border};border-radius:12px;line-height:0">${svg(o, colors(t), 44)}</div>`).join('')}</div>
</div>`).join('');

mkdirSync('branding', { recursive: true });
const browser = await chromium.launch({ ...(process.env.MARC_CHROMIUM ? { executablePath: process.env.MARC_CHROMIUM } : {}), args: ['--no-sandbox'] });
const page = await browser.newPage({ viewport: { width: 760, height: 900 }, deviceScaleFactor: 2 });
await page.setContent(`<html><body style="margin:0;background:${main.bg}"><div style="padding:18px 24px 8px;font:600 12px Inter,system-ui;letter-spacing:.08em;text-transform:uppercase;color:${main.text2}">M/ARC logo options · large and 24 px in Silent Black · Paper, Ember, Emerald, Midnight at right</div>${rows}</body></html>`);
await page.screenshot({ path: 'branding/options.png', fullPage: true });
await browser.close();
console.log('branding/options.png');
