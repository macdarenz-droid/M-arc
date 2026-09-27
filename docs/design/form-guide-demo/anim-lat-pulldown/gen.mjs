// gen.mjs: Lat Pulldown player, built on the FINAL shared rig (rig-final/gen.mjs: helpers, themes, parts, paint and
// base CSS, copied as is from the figure-detail rig, commit 1ba3b30; the only changes are marked "LP:"). Writes index.html, poses.json and the
// generated pieces used in PLAYER.md.   Run: node gen.mjs   (no network, no dependencies)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const rad = d => (d * Math.PI) / 180;
const deg = r => (r * 180) / Math.PI;
const n2 = v => { const s = (Math.round(v * 100) / 100).toString(); return s === '-0' ? '0' : s; };
const n3 = v => { const s = (Math.round(v * 1000) / 1000).toString(); return s === '-0' ? '0' : s; };
// keyframe angles and scales are written to 4 decimals, translates to 3 (rounding at 2 alone breaks smoothness check (c))
const n4 = v => { const s = (Math.round(v * 10000) / 10000).toString(); return s === '-0' ? '0' : s; };
const pts = a => a.map(([x, y]) => `${n2(x)},${n2(y)}`).join(' ');
const tr = (a, dx, dy) => a.map(([x, y]) => [x + dx, y + dy]);
const mir = a => a.map(([x, y]) => [-x, y]);
const oct = (cx, cy, r) => Array.from({ length: 8 }, (_, i) => { const a = rad(i * 45 + 22.5); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const hexv = (cx, cy, r, sy = 1) => Array.from({ length: 6 }, (_, i) => { const a = rad(i * 60); return [cx + r * Math.cos(a), cy + r * sy * Math.sin(a)]; });
const norm = v => { const l = Math.hypot(...v); return v.map(x => x / l); };
const sub = (a, b) => a.map((x, i) => x - b[i]);
const add = (a, b) => a.map((x, i) => x + b[i]);
const mul = (a, k) => a.map(x => x * k);
const dot = (a, b) => a.reduce((s, x, i) => s + x * b[i], 0);

// ---------------------------------------------------------------------------
// THEMES and themeVars: spec 2.9, copied exactly (the artboard pastes the same).
const THEMES = {
  'silent-black': { bg:'#08090a', s1:'#0f1011', s2:'#141516', s3:'#1b1c1f', bSub:'rgba(255,255,255,0.06)', b:'rgba(255,255,255,0.10)', bStr:'rgba(255,255,255,0.18)', text:'#f7f8f8', t2:'#8a8f98', t3:'#62666d', acc:'#5e6ad2', accSoft:'rgba(94,106,210,0.16)', onAcc:'#ffffff', pos:'#4cc38a', warn:'#f2b544', neg:'#eb5757', info:'#6ea8fe', shadow:'0 16px 40px rgba(0,0,0,0.45)', mapBody:'#1b1c1f', mapLine:'rgba(255,255,255,0.10)', scheme:'dark', r:['8px','12px','16px','22px'] },
  'paper':        { bg:'#ffffff', s1:'#f7f6f3', s2:'#efeeea', s3:'#e6e4df', bSub:'rgba(55,53,47,0.08)', b:'rgba(55,53,47,0.14)', bStr:'rgba(55,53,47,0.26)', text:'#37352f', t2:'#6b6a66', t3:'#9b9a97', acc:'#2383e2', accSoft:'rgba(35,131,226,0.12)', onAcc:'#ffffff', pos:'#0f7b4f', warn:'#b7791f', neg:'#c0392b', info:'#2383e2', shadow:'0 8px 24px rgba(15,15,15,0.08)', mapBody:'#e6e4df', mapLine:'rgba(55,53,47,0.18)', scheme:'light', r:['6px','10px','14px','18px'] },
  'ember':        { bg:'#07080a', s1:'#0e1013', s2:'#14171b', s3:'#1c2026', bSub:'rgba(255,255,255,0.05)', b:'rgba(255,255,255,0.09)', bStr:'rgba(255,255,255,0.16)', text:'#ffffff', t2:'#9aa0a6', t3:'#5f666d', acc:'#ff6363', accSoft:'rgba(255,99,99,0.16)', onAcc:'#1a0b0b', pos:'#59d499', warn:'#ffb454', neg:'#ff6363', info:'#7aa7ff', shadow:'0 18px 44px rgba(0,0,0,0.5)', mapBody:'#1c2026', mapLine:'rgba(255,255,255,0.10)', scheme:'dark', r:['8px','12px','16px','20px'] },
  'emerald':      { bg:'#0f0f0f', s1:'#171717', s2:'#1c1c1c', s3:'#242424', bSub:'#242424', b:'#2e2e2e', bStr:'#393939', text:'#ededed', t2:'#a0a0a0', t3:'#707070', acc:'#3ecf8e', accSoft:'rgba(62,207,142,0.14)', onAcc:'#062d1c', pos:'#3ecf8e', warn:'#f5a623', neg:'#f04438', info:'#5fa8ff', shadow:'0 14px 36px rgba(0,0,0,0.45)', mapBody:'#242424', mapLine:'#393939', scheme:'dark', r:['6px','8px','12px','16px'] },
  'midnight':     { bg:'#0a2540', s1:'#0f2d4d', s2:'#143559', s3:'#1a3f68', bSub:'rgba(246,249,252,0.07)', b:'rgba(246,249,252,0.12)', bStr:'rgba(246,249,252,0.22)', text:'#f6f9fc', t2:'#a3b6cc', t3:'#6c839c', acc:'#635bff', accSoft:'rgba(99,91,255,0.18)', onAcc:'#ffffff', pos:'#3ecf8e', warn:'#ffbb00', neg:'#ff5c5c', info:'#00d4ff', shadow:'0 18px 44px rgba(3,20,40,0.55)', mapBody:'#1a3f68', mapLine:'rgba(246,249,252,0.14)', scheme:'dark', r:['8px','12px','16px','22px'] },
};
function themeVars(id) {
  const t = THEMES[id] || THEMES['silent-black'];
  return `color-scheme:${t.scheme};--bg:${t.bg};--surface-1:${t.s1};--surface-2:${t.s2};--surface-3:${t.s3};--border-subtle:${t.bSub};--border:${t.b};--border-strong:${t.bStr};--text:${t.text};--text-2:${t.t2};--text-3:${t.t3};--accent:${t.acc};--accent-soft:${t.accSoft};--on-accent:${t.onAcc};--positive:${t.pos};--warning:${t.warn};--negative:${t.neg};--info:${t.info};--shadow:${t.shadow};--map-body:${t.mapBody};--map-line:${t.mapLine};--radius-sm:${t.r[0]};--radius-md:${t.r[1]};--radius-lg:${t.r[2]};--radius-xl:${t.r[3]};--scrim:rgba(0,0,0,.5)`;
}
// The two rig variables that depend on the theme (light scheme: stronger lines, because the
// lifted body fill is darker than the stage there). It goes in the SAME root style hole as
// themeVars(), because artboards never set a data-theme attribute (design review must-fix 2).
function rigVars(id) {
  const t = THEMES[id] || THEMES['silent-black'];
  const light = t.scheme === 'light';
  // --lit / --shd: what a lit or a shaded facet mixes toward; --hi / --lo: how much of the base tone each keeps.
  // Dark themes shade mostly by darkening and light schemes mostly by lightening, so the outline stays readable.
  return `--fg-line:color-mix(in srgb,var(--text) ${light ? 70 : 60}%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) ${light ? 56 : 38}%,var(--surface-1));--lit:var(${light ? '--bg' : '--text'});--shd:var(${light ? '--text' : '--bg'});--hi:${light ? 76 : 90}%;--lo:${light ? 90 : 78}%;--rim-k:${light ? 35 : 62}%`;
}

// ---------------------------------------------------------------------------
// Contrast (WCAG) of the derived paints, so RIG.md quotes measured numbers. The paints are read from the CSS
// itself (BASE_CSS .player block, then themeVars() and rigVars(), as the page cascades them) and evaluated like
// the browser does (color-mix in srgb), so the table can never drift from what is drawn.
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const lum = rgb => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = rgb.map(f); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
const topSplit = (v, sep) => { const out = []; let d = 0, cur = ''; for (const ch of v) { if (ch === '(') d++; if (ch === ')') d--; if (ch === sep && !d) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out.map(x => x.trim()).filter(Boolean); };
function paintVars(id) {
  const vars = {};
  const take = str => { for (const decl of topSplit(str, ';')) { const m = decl.match(/^(--[\w-]+)\s*:\s*([\s\S]*)$/); if (m) vars[m[1]] = m[2].trim(); } };
  take(BASE_CSS.slice(BASE_CSS.indexOf('.player{') + 8, BASE_CSS.indexOf('position:relative;width:358px')));
  take(themeVars(id)); take(rigVars(id));
  return vars;
}
function paint(expr, vars) { // -> { rgb, a }
  expr = expr.trim();
  let m;
  if ((m = expr.match(/^var\((--[\w-]+)\)$/))) { if (!(m[1] in vars)) throw new Error('undefined ' + m[1]); return paint(vars[m[1]], vars); }
  if (expr.startsWith('#')) return { rgb: hex(expr), a: 1 };
  if (expr === 'transparent') return { rgb: [0, 0, 0], a: 0 };
  if ((m = expr.match(/^rgba?\(([^)]*)\)$/))) { const v = m[1].split(',').map(Number); return { rgb: v.slice(0, 3), a: v[3] ?? 1 }; }
  if ((m = expr.match(/^color-mix\(in srgb,([\s\S]*)\)$/))) {
    const [A, B] = topSplit(m[1], ',').map(part => { const w = part.match(/^([\s\S]*?)\s+(var\(--[\w-]+\)|[\d.]+%)$/); if (!w) return { c: paint(part, vars), p: null }; const p = w[2].startsWith('var') ? vars[w[2].slice(4, -1)] : w[2]; return { c: paint(w[1], vars), p: parseFloat(p) / 100 }; });
    const pa = A.p ?? (B.p !== null ? 1 - B.p : 0.5), pb = B.p ?? 1 - pa;
    const al = A.c.a * pa + B.c.a * pb;
    return { rgb: al ? A.c.rgb.map((v, i) => (v * A.c.a * pa + B.c.rgb[i] * B.c.a * pb) / al) : [0, 0, 0], a: al };
  }
  throw new Error('cannot evaluate ' + expr);
}
function contrastTable() {
  const rows = [];
  for (const id of Object.keys(THEMES)) {
    const V = paintVars(id), c = n => { const p = paint(`var(--${n})`, V); if (p.a < 1) throw new Error(n + ' is not opaque'); return p.rgb; };
    const s1 = c('surface-1'), line = c('fg-line'), body = c('body');
    rows.push({
      id, line: cr(line, s1), lineBody: cr(line, body), frame: cr(c('fg-frame'), s1), metal: cr(c('fg-metal'), s1), cable: cr(c('fg-cable'), s1), accent: cr(c('accent'), s1),
      bodyStage: cr(body, s1), bodyPad: cr(body, c('surface-3')), helpBody: cr(c('muscle-help'), body), mainBody: cr(c('accent'), body),
      // figure detail paints (RIG.md section 20): the outline over every tone an arm can cross, and the new parts
      lineSkin: cr(line, c('skin')), lineSkinHi: cr(line, c('skin-hi')), lineSkinLo: cr(line, c('skin-lo')), lineTeeHi: cr(line, c('tee-hi')), lineTeeLo: cr(line, c('tee-lo')),
      skinTee: cr(c('skin'), c('tee')), shortsSkin: cr(c('shorts'), c('skin')), shortsPad: cr(c('shorts'), c('surface-3')), shoeStage: cr(c('shoe'), s1), rimLine: cr(c('rim'), line), mainTee: cr(c('accent'), c('tee')),
      knurl: cr(c('metal-lo'), c('fg-metal')), seam: cr(c('seam'), c('equip')),
    });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// RIG. Rig units: 1 unit = 1 stage px at 358 wide. Local frame of every view:
// +y is down; limbs are drawn hanging straight down (rest pose); poses come only
// from rotations (and foreshortening scales) about the joints below.
export const LEN = { upperArm: 38, forearm: 40, torso: 62, thigh: 50, shin: 47, sole: 102 };
// Round joint caps: an n-gon (12 sides reads round at every size); half: the half facing dir (degrees, 0 = +x).
const ngon = (cx, cy, r, n = 12, a0 = 15) => Array.from({ length: n }, (_, i) => { const a = rad(a0 + (i * 360) / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });
const half = (cx, cy, r, dir, n = 6) => [...Array.from({ length: n + 1 }, (_, i) => { const a = rad(dir - 90 + (i * 180) / n); return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; })];
// sym: a front-view shape given as its screen-right half, from a point on x = 0 round to a point on x = 0.
const sym = h => [...h, ...mir(h.slice(1, -1)).reverse()];
const trPart = (p, dx, dy) => ({ ...p, base: tr(p.base, dx, dy), regions: (p.regions || []).map(r => ({ ...r, poly: tr(r.poly, dx, dy) })) });
// Every part: base (its silhouette) in its cloth (skin, tee, shorts, shoe, hair), then regions painted in order:
//   { poly, cloth?, tone?: 'hi' | 'lo', muscle?, name?, ten? }.
// A region with a muscle paints mm / mh when the exercise gives it a role; otherwise it paints its tone, or
// nothing when it has neither tone nor cloth (a muscle kept only for roles). ten: a secondary-motion facet that
// fades in with the move (drawn only when the exercise passes its channel). Section 20 of RIG.md.

// SIDE view: origin = hip joint, lifter faces +x. Light from the front and above.
const HEAD_S = [[-10.2, -3.5], [-8.6, -8.8], [-4.5, -11.8], [1.5, -12], [6.6, -9.6], [9.2, -5.6], [10, -2.6], [9.4, -1.2], [10.4, 0.6], [12.4, 3.4], [10.3, 4.6], [10.2, 6.2], [9.8, 8.5], [8, 10.8], [2.6, 11.2], [-1.2, 8.4], [-4.5, 6.8], [-8.8, 3.6]];
const SIDE = {
  joints: { hip: [0, 0], shoulder: [0, -62], elbow: [0, -24], grip: [0, 16], knee: [0, 50], ankle: [0, 97], head: [3, -82] },
  neck: {
    base: [[-6.2, -78], [1.2, -76], [3.2, -72.6], [6.8, -66], [5, -62.5], [-5.5, -62.5], [-7, -67]],
    regions: [
      { poly: [[1.2, -76], [3.2, -72.6], [6.8, -66], [4.4, -66.2], [0.6, -72.6], [-1.4, -75.6]], tone: 'hi', name: 'throat' },
      { poly: [[-6.2, -78], [-3.4, -77.4], [-4.8, -69], [-7, -67]], tone: 'lo', name: 'nape' },
    ],
  },
  head: {
    base: tr(HEAD_S, 3, -82),
    regions: [
      { poly: [[7.38, -8.4], [6.6, -9.6], [1.5, -12], [-4.5, -11.8], [-8.6, -8.8], [-10.2, -3.5], [-9.3, 1], [-6, -0.4], [-4.4, -3.6], [-1, -5.2], [2.8, -6], [5.2, -7.4]], cloth: 'hair', name: 'hair' },
      { poly: [[1.5, -12], [-4.5, -11.8], [-6.6, -10.2], [-1.6, -10.6], [3.6, -10.9]], cloth: 'hair', tone: 'hi', name: 'hairSheen' },
      { poly: [[-3.4, -1.8], [-0.6, -3.2], [1.6, -0.8], [1.4, 3.2], [-0.4, 5.4], [-2.8, 3.8]], tone: 'lo', name: 'ear' },
      { poly: [[6.2, -2], [9.4, -1.2], [10.4, 0.6], [12.4, 3.4], [10.3, 4.6], [10.2, 6.2], [7, 6.4], [5, 2.4]], tone: 'hi', name: 'face' },
      { poly: [[5.8, -3.4], [10, -2.6], [9.4, -1.2], [6.4, -2.2]], tone: 'lo', name: 'brow' },
      { poly: [[9.8, 8.5], [8, 10.8], [2.6, 11.2], [-1.2, 8.4], [4, 8.6]], tone: 'lo', name: 'jaw' },
    ].map(r => ({ ...r, poly: tr(r.poly, 3, -82) })),
  },
  torso: {
    cloth: 'tee',
    base: [[-6.4, -72.6], [-1.5, -70.8], [3.8, -68.6], [7.2, -66.6], [11.4, -64.6], [15, -57], [15.8, -48.5], [14.2, -41.2], [11.8, -36.4], [10.2, -26], [9.8, -14], [10.8, -4], [7.8, 6], [-3, 8.5], [-10.5, 6], [-12.8, -3], [-10.8, -15], [-10, -26], [-11.9, -40], [-12.3, -52], [-11.2, -60.5], [-9.2, -67.2]],
    regions: [
      { poly: [[10.5, -7], [10.8, -4], [7.8, 6], [-3, 8.5], [-10.5, 6], [-12.8, -3], [-11.87, -8.6]], cloth: 'shorts', name: 'shorts' },
      { poly: [[10.5, -7], [-11.87, -8.6], [-12.1, -7.2], [10.64, -5.6]], cloth: 'shorts', tone: 'lo', name: 'waistband' },
      { poly: [[-3, 8.5], [-10.5, 6], [-12.8, -3], [-12.1, -6.8], [-6, -4.6], [-1.6, 2]], cloth: 'shorts', tone: 'lo', muscle: 'glutes' },
      { poly: [[-6.6, -71.1], [-1.8, -69.3], [0.6, -66.4], [-3.6, -61], [-11.2, -60.5], [-9.2, -67.2]], tone: 'hi', muscle: 'upperTraps' },
      { poly: [[-6.4, -72.6], [-1.5, -70.8], [3.8, -68.6], [7.2, -66.6], [6.4, -65.4], [3.2, -67.3], [-1.8, -69.3], [-6.6, -71.1]], tone: 'lo', name: 'collar' },
      { poly: [[-11.2, -60.5], [-3.6, -61], [-5.4, -54.6], [-12.3, -52]], muscle: 'midBack' },
      { poly: [[-12.3, -52], [-5.4, -54.6], [-2.6, -42], [-4.8, -30], [-10, -26], [-11.9, -40]], tone: 'lo', muscle: 'lats' },
      { poly: [[11.8, -36.4], [11.4, -33.8], [6.6, -36.4], [6.4, -38.8]], tone: 'lo', name: 'underChest' },
      { poly: [[11.4, -33.8], [10.2, -26], [9.8, -14], [10.5, -7], [5.8, -7.4], [5.6, -24], [6.6, -36.4]], muscle: 'abs' },
      { poly: [[5.6, -24], [5.8, -7.4], [-4, -8.2], [-4.8, -19], [-0.4, -27]], muscle: 'obliques' },
      { poly: [[7.2, -66.6], [11.4, -64.6], [15, -57], [15.8, -48.5], [14.2, -41.2], [11.8, -36.4], [6.4, -38.8], [3.8, -52], [4.8, -62.4]], tone: 'hi', muscle: 'chest' },
      // secondary motion: the belly wall firms (brace) and the shoulder blade's inner edge shows (blades held back)
      { poly: [[10.2, -26], [9.8, -14], [10.5, -7], [8.6, -7.2], [8, -14], [8.4, -26.4]], tone: 'lo', ten: true, name: 'brace' },
      { poly: [[-8.8, -60.2], [-7.4, -60], [-9, -50.8], [-10.4, -51]], tone: 'lo', ten: true, name: 'bladeEdge' },
    ],
  },
  deltoid: {
    cloth: 'tee',
    base: tr([[-6.5, -4], [-2.5, -7.5], [4, -7], [7.5, -2.5], [7.8, 5], [5.6, 11.4], [0.6, 13], [-4.4, 12], [-6.5, 7.6]], 0, -62),
    regions: [
      { poly: tr([[2.4, -7.2], [4, -7], [7.5, -2.5], [7.8, 5], [5.6, 11.4], [3, 12.2], [2.2, 1]], 0, -62), tone: 'hi', muscle: 'frontDelts' },
      { poly: tr([[-2.2, -7.4], [2.4, -7.2], [2.2, 1], [3, 12.2], [0.6, 13], [-3.2, 12.3], [-2.4, 1]], 0, -62), muscle: 'sideDelts' },
      { poly: tr([[-6.5, -4], [-2.5, -7.5], [-2.2, -7.4], [-2.4, 1], [-3.2, 12.3], [-4.4, 12], [-6.5, 7.6]], 0, -62), tone: 'lo', muscle: 'rearDelts' },
    ],
  },
  upperArm: {
    base: tr([[-5.5, -2], [5.5, -2], [6.3, 9], [6.5, 17], [5.4, 28], [4.4, 35], [2.2, 38.2], [0, 39], [-4.6, 35], [-6.2, 14]], 0, -62),
    regions: [
      { poly: tr([[-5.5, -2], [5.5, -2], [6.3, 9], [6.5, 17], [6.3, 19], [-5.74, 20], [-6.2, 14]], 0, -62), cloth: 'tee', name: 'sleeve' },
      { poly: tr([[2.2, -2], [5.5, -2], [6.3, 9], [6.5, 17], [6.3, 19], [2.4, 19.3]], 0, -62), cloth: 'tee', tone: 'hi', muscle: 'biceps' },
      { poly: tr([[2.4, 19.3], [6.3, 19], [5.4, 28], [4.4, 35], [2.2, 36.8], [1.8, 28]], 0, -62), tone: 'hi', muscle: 'biceps' },
      { poly: tr([[-5.5, -2], [-2.4, -2], [-2.6, 19.7], [-5.74, 20], [-6.2, 14]], 0, -62), cloth: 'tee', tone: 'lo', muscle: 'triceps' },
      { poly: tr([[-5.74, 20], [-2.6, 19.7], [-2, 30], [-2.4, 36.8], [-4.6, 35]], 0, -62), tone: 'lo', muscle: 'triceps' },
      { poly: tr([[6.3, 19], [-5.74, 20], [-5.85, 18.6], [6.44, 17.6]], 0, -62), cloth: 'tee', tone: 'lo', name: 'sleeveHem' },
    ],
  },
  elbowCap: { base: ngon(0, -24, 4.6), regions: [{ poly: half(0, -24, 4.6, 180), tone: 'lo', name: 'elbowBack' }] },
  forearm: {
    base: tr([[-4.8, -1], [4.8, -1], [5.4, 6], [5, 13], [3.6, 31], [-3.6, 31], [-4.4, 14], [-4.9, 6]], 0, -24),
    regions: [
      { poly: tr([[0.4, -1], [4.8, -1], [5.4, 6], [5, 13], [3.6, 31], [0.6, 31]], 0, -24), tone: 'hi', muscle: 'forearms' },
      { poly: tr([[-4.8, -1], [-2.6, -1], [-2.2, 31], [-3.6, 31], [-4.4, 14], [-4.9, 6]], 0, -24), tone: 'lo', name: 'forearmUnder' },
    ],
  },
  // Hand round a vertical handle, seen from the back of the hand. In the hand's frame +x is up (thumb side) and
  // +y points forward along the forearm; the handle runs along x through the grip centre (0, 16).
  fist: {
    base: tr([[-3.7, -9.6], [3.7, -9.6], [5.6, -6.8], [7.2, -3], [7.3, 0.6], [6.2, 3.6], [4.8, 5.2], [2.2, 5.8], [-0.6, 5.8], [-3.2, 5.5], [-5.2, 4.6], [-6, 1.6], [-5.8, -3.6], [-4.8, -7]], 0, 16),
    regions: [
      { poly: [[-3.7, -9.6], [-4.8, -7], [-5.8, -3.6], [-4.6, -3.2], [-3.4, -8.6]], tone: 'lo', name: 'palmHeel' },
      { poly: [[2.2, -8.6], [4.2, -6.4], [5.6, -2.6], [5.1, 1.6], [4.3, 1.3], [4.6, -2.4], [3.3, -5.8], [1.5, -7.9]], tone: 'lo', name: 'thumbCrease' },
      { poly: [[3.7, -9.6], [5.6, -6.8], [7.2, -3], [7.3, 0.6], [6.4, 2.6], [5.3, 1.8], [5.8, -2.4], [4.4, -6.2], [2.4, -8.8]], tone: 'hi', name: 'thumb' },
      { poly: [[5.3, -0.6], [6.2, 3.6], [4.8, 5.2], [2.2, 5.8], [-0.6, 5.8], [-3.2, 5.5], [-5.2, 4.6], [-6, 1.6], [-5.9, -0.4]], tone: 'lo', name: 'fingerGaps' },
      { poly: [[2.6, -0.2], [5.1, -0.4], [5.6, 2.6], [4.6, 5.1], [3, 5.6], [2.5, 2.8]], tone: 'hi', name: 'finger1' },
      { poly: [[-0.2, -0.2], [2.2, -0.2], [2.1, 3], [1.9, 5.7], [0.1, 5.7], [-0.3, 3]], tone: 'hi', name: 'finger2' },
      { poly: [[-2.9, -0.2], [-0.6, -0.2], [-0.7, 3], [-0.9, 5.7], [-2.7, 5.5], [-3.1, 3]], tone: 'hi', name: 'finger3' },
      { poly: [[-5.3, 0], [-3.3, -0.2], [-3.5, 3], [-3.6, 5.4], [-4.9, 4.6], [-5.6, 2]], tone: 'hi', name: 'finger4' },
    ].map(r => ({ ...r, poly: tr(r.poly, 0, 16) })),
  },
  hipCap: { cloth: 'shorts', base: ngon(0, 0, 8.4) },
  thigh: {
    base: [[-8.5, -3], [8.5, -3], [8.9, 10], [8.3, 22], [6.4, 40], [4.6, 47.6], [0, 51], [-3.8, 49.8], [-6, 46], [-7.8, 32], [-8.5, 16]],
    regions: [
      { poly: [[-8.5, -3], [8.5, -3], [8.9, 10], [8.3, 22], [6.82, 36], [-7.09, 37.5], [-7.8, 32], [-8.5, 16]], cloth: 'shorts', name: 'shorts', far: true },
      { poly: [[3, -3], [8.5, -3], [8.9, 10], [8.3, 22], [6.82, 36], [3.2, 36.4]], cloth: 'shorts', tone: 'hi', muscle: 'quads' },
      { poly: [[3.2, 36.4], [6.82, 36], [6.4, 40], [4.6, 47.6], [2.4, 49.4], [1.6, 42]], tone: 'hi', muscle: 'quads' },
      { poly: [[-8.5, -3], [-3.4, -3], [-3.6, 37], [-7.09, 37.5], [-7.8, 32], [-8.5, 16]], cloth: 'shorts', tone: 'lo', muscle: 'hamstrings' },
      { poly: [[-7.09, 37.5], [-3.6, 37], [-2.8, 48.6], [-3.8, 49.8], [-6, 46]], tone: 'lo', muscle: 'hamstrings' },
      { poly: [[6.82, 36], [-7.09, 37.5], [-7.27, 36.1], [6.97, 34.6]], cloth: 'shorts', tone: 'lo', name: 'shortsHem' },
    ],
  },
  kneeCap: { base: ngon(0, 50, 6), regions: [{ poly: half(0, 50, 6, 0), tone: 'hi', name: 'patella' }] },
  shin: {
    base: [[-5.5, 49], [5.5, 49], [5.4, 60], [4.4, 80], [3.8, 94], [-4, 94], [-5.4, 84], [-7, 66], [-6.8, 58]],
    regions: [
      { poly: [[-5.5, 49], [-2, 49.5], [-2.2, 62], [-3.4, 78], [-5.4, 84], [-7, 66], [-6.8, 58]], tone: 'lo', muscle: 'calves' },
      { poly: [[2.6, 49.6], [5.5, 49], [5.4, 60], [4.4, 80], [3.8, 94], [2, 94], [2.4, 72]], tone: 'hi', name: 'shinFront' },
    ],
  },
  foot: {
    cloth: 'shoe',
    base: [[-5.6, 92.2], [3.4, 92.4], [7.4, 96.2], [13.6, 97.8], [17.2, 99.2], [17.9, 101], [17.6, 102], [-6.2, 102], [-6.8, 99], [-6.6, 95]],
    regions: [
      { poly: [[-5.6, 92.2], [3.4, 92.4], [4.4, 93.4], [-6.1, 93.6]], tone: 'lo', name: 'collar' },
      { poly: [[11, 97.2], [13.6, 97.8], [17.2, 99.2], [17.67, 100.4], [11.8, 100.4], [10.4, 98.6]], tone: 'hi', name: 'toeCap' },
      { poly: [[-6.52, 100.4], [17.67, 100.4], [17.9, 101], [17.6, 102], [-6.2, 102]], cloth: 'sole', name: 'sole' },
    ],
  },
};

// FRONT view: origin = midway between the hip joints, lifter faces the viewer.
// Screen-right side (the lifter's left) is defined; screen-left = mirror in x. Light from the front and above:
// tops of forms light, faces toward the camera mid, sides and undersides dark.
const HEAD_F = sym([[0, -12], [5.6, -11], [8.8, -7.6], [9.7, -3.8], [11.1, -3.9], [11.9, -1.4], [11.3, 2.4], [9.5, 3.6], [8.3, 6], [5.4, 9.4], [2.4, 11.2], [0, 11.6]]);
const both = (r) => [r, { ...r, poly: mir(r.poly) }];
const FR = {
  joints: { hipR: [10, 0], shoulderR: [22, -62], elbowR: [22, -24], gripR: [22, 16], kneeR: [10, 50], ankleR: [10, 97], head: [0, -83] },
  neck: {
    base: [[-5.2, -80], [5.2, -80], [5.6, -73], [8.2, -67.4], [6.4, -64], [-6.4, -64], [-8.2, -67.4], [-5.6, -73]],
    regions: [
      ...both({ poly: [[5.2, -78], [5.6, -73], [8.2, -67.4], [6, -67], [4.2, -72.4]], tone: 'lo', name: 'neckSide' }),
      { poly: [[-5.4, -73.4], [5.4, -73.4], [5.6, -71], [0, -69.4], [-5.6, -71]], tone: 'lo', name: 'underChin' },
    ],
  },
  head: {
    base: tr(HEAD_F, 0, -83),
    regions: [
      { poly: sym([[0, -12], [5.6, -11], [8.8, -7.6], [9.7, -3.8], [8.7, -4.4], [7.6, -6.8], [4.6, -8.2], [0, -8.8]]), cloth: 'hair', name: 'hair' },
      { poly: [[-4.6, -11.1], [1.6, -11.9], [4.2, -10.4], [-1.8, -10]], cloth: 'hair', tone: 'hi', name: 'hairSheen' },
      ...both({ poly: [[9.7, -3.8], [11.1, -3.9], [11.9, -1.4], [11.3, 2.4], [9.5, 3.6], [9.3, 0]], tone: 'lo', name: 'ear' }),
      ...both({ poly: [[6.4, -2.6], [9.3, -3.2], [9.3, 0], [9.5, 3.6], [8.3, 6], [5.4, 9.4], [4.6, 5.6]], tone: 'lo', name: 'cheek' }),
      { poly: [[0.2, -1.4], [1.5, 3.2], [0.1, 4.1]], tone: 'lo', name: 'nose' },
    ].map(r => ({ ...r, poly: tr(r.poly, 0, -83) })),
  },
  torso: {
    cloth: 'tee',
    base: sym([[0, -65.8], [3.4, -67], [6.2, -71.2], [11.6, -69], [17.2, -66.2], [21, -62.6], [20.2, -52], [16.6, -38], [14, -26], [15, -14], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5]]),
    regions: [
      { poly: sym([[0, -7], [16.05, -7], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5]]), cloth: 'shorts', name: 'shorts' },
      { poly: [[16.05, -7], [-16.05, -7], [-16.2, -5.6], [16.2, -5.6]], cloth: 'shorts', tone: 'lo', name: 'waistband' },
      ...both({ poly: [[6.2, -71.2], [11.6, -69], [17.2, -66.2], [21, -62.6], [13, -63.4], [7.4, -67.6]], tone: 'hi', muscle: 'upperTraps' }),
      { poly: sym([[0, -65.8], [3.4, -67], [6.2, -71.2], [7.4, -70.7], [4.2, -65.6], [0, -64.4]]), tone: 'lo', name: 'collar' },
      ...both({ poly: [[16.4, -45.4], [8.6, -43.2], [1, -44.6], [1, -42.6], [8.6, -41], [15.9, -43.4]], tone: 'lo', name: 'underChest' }),
      ...both({ poly: [[20.2, -52], [16.6, -38], [15.2, -33.4], [14.8, -40.6], [16.8, -45.6], [19.9, -53]], tone: 'lo', muscle: 'lats' }),
      ...both({ poly: [[15.2, -33.4], [14, -26], [15, -14], [16.05, -7], [9.6, -7.8], [9.4, -37.6], [14.8, -40.6]], tone: 'lo', muscle: 'obliques' }),
      { poly: sym([[0, -42.6], [8.6, -41], [9.4, -37.6], [9.6, -7.8], [0, -7.4]]), muscle: 'abs' },
      ...both({ poly: [[1, -64.2], [13, -63.4], [20, -61.6], [19.9, -53], [16.4, -45.4], [8.6, -43.2], [1, -44.6]], tone: 'hi', muscle: 'chest' }),
      // secondary motion: the belly wall firms (brace) and the collarbone line shows as the shoulders stay down
      ...both({ poly: [[8.6, -38], [10, -37.8], [10.4, -9.6], [9, -9.6]], tone: 'lo', ten: true, name: 'brace' }),
      ...both({ poly: [[7.4, -67.6], [13, -63.4], [20.4, -62.4], [20.2, -61.2], [13, -62], [7.2, -66.2]], tone: 'lo', ten: true, name: 'collarbone' }),
    ],
  },
  deltoidR: {
    cloth: 'tee',
    base: tr([[-5.2, -3], [1, -4], [6, -2.5], [8.2, 2.5], [7.8, 9.5], [4.8, 14.5], [-1, 13], [-5.2, 5.5]], 22, -62),
    regions: [
      { poly: tr([[1, -4], [6, -2.5], [8.2, 2.5], [7.8, 9.5], [4.8, 14.5], [2.5, 4.5]], 22, -62), tone: 'hi', muscle: 'sideDelts' },
      { poly: tr([[-5.2, -3], [1, -4], [2.5, 4.5], [4.8, 14.5], [-1, 13], [-5.2, 5.5]], 22, -62), muscle: 'frontDelts' },
    ],
  },
  upperArmR: {
    base: tr([[-5.2, -2], [5.5, -2], [6.4, 9], [6.2, 14], [4.6, 35], [0, 39], [-4.6, 35], [-5.8, 14]], 22, -62),
    regions: [
      { poly: tr([[-5.2, -2], [5.5, -2], [6.4, 9], [6.2, 14], [5.82, 19], [-5.48, 19.6], [-5.8, 14]], 22, -62), cloth: 'tee', name: 'sleeve' },
      { poly: tr([[-2.4, 1], [2.8, 1], [3, 19.2], [-2.4, 19.45]], 22, -62), cloth: 'tee', tone: 'hi', muscle: 'biceps' },
      { poly: tr([[-2.4, 19.45], [3, 19.2], [3.2, 27], [0.4, 31.4], [-2.4, 27]], 22, -62), tone: 'hi', muscle: 'biceps' },
      { poly: tr([[-5.2, -2], [-3.4, -2], [-3.6, 19.5], [-5.48, 19.6], [-5.8, 14]], 22, -62), cloth: 'tee', tone: 'lo', muscle: 'triceps' },
      { poly: tr([[-5.48, 19.6], [-3.6, 19.5], [-3.2, 33], [-4.6, 35]], 22, -62), tone: 'lo', muscle: 'triceps' },
      { poly: tr([[5.82, 19], [-5.48, 19.6], [-5.56, 18.2], [5.93, 17.6]], 22, -62), cloth: 'tee', tone: 'lo', name: 'sleeveHem' },
    ],
  },
  elbowCapR: { base: ngon(22, -24, 4.6), regions: [{ poly: half(22, -24, 4.6, 180), tone: 'lo', name: 'elbowInner' }] },
  forearmR: {
    base: tr([[-4.6, -1], [4.8, -1], [5.4, 7], [4.8, 15], [3.4, 31], [-3.4, 31], [-4.4, 16], [-5, 7]], 22, -24),
    regions: [
      { poly: tr([[0.4, -1], [4.8, -1], [5.4, 7], [4.8, 15], [3.4, 31], [0.8, 31]], 22, -24), tone: 'hi', muscle: 'forearms' },
      { poly: tr([[-4.6, -1], [-2.8, -1], [-2.2, 31], [-3.4, 31], [-4.4, 16], [-5, 7]], 22, -24), tone: 'lo', name: 'forearmInner' },
    ],
  },
  // Hand round a dumbbell handle that points at the camera, seen from the front and a little above: the index
  // finger curls round the handle, the middle, ring and little finger knuckles step up behind it, the thumb
  // crosses the inner side. The handle and the near head are in the dumbbell group (drawn over the hand).
  fistR: {
    base: tr([[-3.6, -9.6], [3.6, -9.6], [4.8, -8.2], [5.7, -6.8], [5.3, -5.7], [6.1, -4.4], [5.7, -3.2], [6.4, -1.8], [6, -0.6], [6.5, 0.8], [6, 3], [4.4, 4.9], [1.4, 5.8], [-1.8, 5.5], [-4.2, 4], [-5.6, 1.2], [-6.1, -2.8], [-5.6, -6.4]], 22, 16),
    regions: [
      { poly: [[4.8, -8.2], [5.7, -6.8], [5.3, -5.7], [6.1, -4.4], [5.7, -3.2], [6.4, -1.8], [6, -0.6], [6.5, 0.8], [6, 3], [4.4, 4.9], [1.4, 5.8], [-1.8, 5.5], [-4.2, 4], [-5.6, 1.2], [-6.1, -2.8], [-3.2, -4.6], [1.2, -8]], tone: 'lo', name: 'grip' },
      { poly: [[4.6, -8], [5.5, -6.9], [5.1, -5.9], [1.8, -6.2], [1.5, -7.7]], tone: 'hi', name: 'finger4' },
      { poly: [[5.4, -5.5], [5.9, -4.4], [5.5, -3.4], [2, -3.8], [1.9, -5.4]], tone: 'hi', name: 'finger3' },
      { poly: [[5.6, -3], [6.2, -1.8], [5.8, -0.9], [2.2, -1.2], [2.1, -2.8]], tone: 'hi', name: 'finger2' },
      { poly: [[5.8, -0.5], [6.3, 0.8], [5.8, 2.8], [4.2, 4.5], [1.4, 5.3], [-1.8, 5], [-3.6, 3.9], [-2.6, 2.7], [-0.2, 3.3], [2, 2.7], [2.4, -0.3]], tone: 'hi', name: 'finger1' },
      { poly: [[-6, -5.6], [-4.8, -7.2], [-3.4, -5.4], [-1.4, -1.6], [-0.9, 1], [-2, 2.2], [-3.6, 1.5], [-5.4, -1.6]], tone: 'hi', name: 'thumb' },
    ].map(r => ({ ...r, poly: tr(r.poly, 22, 16) })),
  },
  thighR: {
    base: tr([[-8, -4], [8, -4], [8.4, 10], [8, 20], [6, 44], [3.6, 49], [0, 50.5], [-4, 49], [-6, 46], [-7.2, 30], [-7.6, 16]], 10, 0),
    regions: [
      { poly: tr([[-8, -4], [8, -4], [8.4, 10], [8, 20], [6.95, 34], [-7.3, 34.6], [-7.2, 30], [-7.6, 16]], 10, 0), cloth: 'shorts', name: 'shorts' },
      { poly: tr([[-3.4, -4], [3.4, -4], [4, 34.3], [-3.6, 34.5]], 10, 0), cloth: 'shorts', tone: 'hi', muscle: 'quads' },
      { poly: tr([[-3.6, 34.5], [4, 34.3], [4.6, 44], [2.4, 48.2], [-1, 48.6], [-3.4, 43]], 10, 0), tone: 'hi', muscle: 'quads' },
      { poly: tr([[6.95, 34], [-7.3, 34.6], [-7.34, 33.2], [7.05, 32.6]], 10, 0), cloth: 'shorts', tone: 'lo', name: 'shortsHem' },
    ],
  },
  kneeCapR: { base: ngon(10, 50, 5.8), regions: [{ poly: half(10, 50, 5.8, 270), tone: 'hi', name: 'patella' }] },
  shinR: {
    base: tr([[-5.5, 49], [5.5, 49], [6.2, 60], [5.2, 74], [4, 94], [-4, 94], [-5, 76], [-6.2, 62]], 10, 0),
    regions: [
      ...[1, -1].map(s => ({ poly: tr([[5.5, 49], [6.2, 60], [5.2, 74], [4, 94], [2.8, 92], [3.4, 70], [3.2, 52]].map(([x, y]) => [x * s, y]), 10, 0), tone: 'lo', muscle: 'calves' })),
    ],
  },
  footR: {
    cloth: 'shoe',
    base: tr([[-4.5, 92.4], [4.5, 92.4], [6.6, 97], [7.2, 99.4], [6.8, 102], [-5.8, 102], [-6.4, 99.4], [-6, 96.4]], 10, 0),
    regions: [
      { poly: tr([[-4.5, 92.4], [4.5, 92.4], [5, 93.6], [-4.8, 93.6]], 10, 0), tone: 'lo', name: 'collar' },
      { poly: tr([[-3.8, 96.4], [4.2, 96.4], [6.2, 98.6], [6.4, 100.4], [-5.4, 100.4], [-5.6, 98.6]], 10, 0), tone: 'hi', name: 'toeCap' },
      { poly: tr([[-6.2, 100.4], [7, 100.4], [6.8, 102], [-5.8, 102]], 10, 0), cloth: 'sole', name: 'sole' },
    ],
  },
};
const mirPart = p => ({ ...p, base: mir(p.base), regions: (p.regions || []).map(r => ({ ...r, poly: mir(r.poly) })) });
// LP: the rig's TOP view is not used by this player, so it is not copied.

// ---------------------------------------------------------------------------
// Painting. Every body LAYER is drawn in three passes inside the same groups:
//   1) outline pass: each part's polygon with a 3-unit stroke in --fg-line (class olk)
//   2) rim pass: the same polygons with a 1.1-unit --rim stroke (class rim), so a thin lighter line runs just
//      inside the dark outline on the layer's silhouette
//   3) fill pass: each part's base fill, its tone facets, then glow and muscles
// The fills hide the inner half of every stroke, so only the layer's silhouette keeps its outline and rim,
// and no seam shows where parts overlap (shoulder, elbow, hip, knee).
const CLOTH = { skin: 'b', tee: 't', shorts: 'p', shoe: 's', sole: 'so', hair: 'hr' };
const FAR_CLOTH = { skin: 'bf', tee: 'bf', shorts: 'pf', shoe: 'sf', sole: 'sf', hair: 'bf' };
const toneCls = (cloth, tone) => CLOTH[cloth] + (tone === 'hi' ? 'h' : tone === 'lo' ? 'l' : '');
function fillPart(p, roles = {}, opt = {}) {
  const cloth = p.cloth || 'skin';
  if (opt.far) return `<polygon class="${FAR_CLOTH[cloth]}" points="${pts(p.base)}"/>` + (p.regions || []).filter(r => r.far).map(r => `<polygon class="${FAR_CLOTH[r.cloth || cloth]}" points="${pts(r.poly)}"/>`).join('');
  let s = `<polygon class="${toneCls(cloth, null)}" points="${pts(p.base)}"/>`, glow = '', mus = '';
  for (const r of p.regions || []) {
    const role = r.muscle && roles[r.muscle];
    if (role === 'main') { mus += `<polygon class="mm anim ${opt.effort || ''}" points="${pts(r.poly)}"/>`; if (opt.glow) glow += `<polygon class="gw anim ${opt.glow}" points="${pts(r.poly)}"/>`; }
    else if (role === 'help') mus += `<polygon class="mh" points="${pts(r.poly)}"/>`;
    else if (r.ten) { if (opt.ten) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone)} tn anim ${opt.ten}" points="${pts(r.poly)}"/>`; }
    else if (r.tone || r.cloth) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone)}" points="${pts(r.poly)}"/>`;
    else if (r.facet) s += `<polygon class="fc" points="${pts(r.poly)}"/>`;
  }
  // LP: opt.tenOver draws the secondary-motion facets over the role muscles. Here mid back (helps) and lats (main)
  // are painted, and the shoulder blade's inner edge lies on the mid back, so under it the edge would never show.
  if (opt.tenOver) { let ov = ''; s = s.replace(/<polygon class="[^"]* tn anim [^"]*" points="[^"]*"\/>/g, m => { ov += m; return ''; }); return s + glow + mus + ov; }
  return s + glow + mus;
}
const olPart = (p, far) => `<polygon class="${far ? 'olkf' : 'olk'}" points="${pts(p.base)}"/>`;
const rimPart = p => `<polygon class="rim" points="${pts(p.base)}"/>`;
// pass-aware helper: P(part) returns the outline, rim or fill markup for the current pass
const passer = (pass, roles, opt = {}) => p => (pass === 'ol' ? olPart(p, opt.far) : pass === 'rim' ? (opt.far ? '' : rimPart(p)) : fillPart(p, roles, opt));
// all three passes of one layer, in order
const layer = f => f('ol') + f('rim') + f('fill');

// Soft contact shadow (RIG.md section 20): three stacked --scrim ellipses, no filter.
const shadow = (cx, cy, rx, ry) => `<g class="shadow">${[1, 0.72, 0.44].map(k => `<ellipse class="shd" cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(rx * k)}" ry="${n2(ry * k)}"/>`).join('')}</g>`;

// ---------------------------------------------------------------------------
// Timing (spec 2.5): 4 s rep; lift 0-25 %, hold to 37.5 %, return to 87.5 %, pause to 100 %.
// Each move follows the minimum-jerk profile p(x) = 10x^3 - 15x^4 + 6x^5: speed and acceleration are zero at
// both ends of every move and there is no kink mid-move (UPGRADE-BRIEF.md, smoothness target 1; as rig-final).
const minJerk = x => x * x * x * (10 + x * (-15 + 6 * x));
function progress(u) { // u = fraction of one rep -> p (0 setup .. 1 end pose)
  if (u <= 0.25) return minJerk(u / 0.25);
  if (u <= 0.375) return 1;
  if (u <= 0.875) return 1 - minJerk((u - 0.375) / 0.5);
  return 0;
}
// A solved pose every 0.5 % of the rep while the body moves; the holds need only their boundary stops (smoothness
// target 2). LP (docs/COACHING-DECISIONS.md D-L2): the brief's fallback of 0.25 % stops in the 1 s lift, so the grip,
// the bar and the cable pass check (b); both moves then have 100 steps. The old extra stops (0.625, 82.8125, 85.9375,
// 86.71875 %) are superseded.
const LIFT_STEP = 0.25;
const SAMPLES = [];
for (let i = 0; i <= 25 / LIFT_STEP; i++) SAMPLES.push(i * LIFT_STEP);
for (let i = 0; i <= 100; i++) SAMPLES.push(37.5 + i * 0.5);
SAMPLES.push(100);

// Every keyframe set is written twice (-a and -b). Replay, speed change and mode change
// swap the stage class gen-a <-> gen-b, which restarts every animation from 0 %.
const GENS = ['a', 'b'];
const kf = (name, fn) => GENS.map(g => `@keyframes ${name}-${g}{${SAMPLES.map(pc => `${n2(pc)}%{${fn(progress(pc / 100), pc)}}`).join('')}}`).join('\n');
const kfRaw = (name, body) => GENS.map(g => `@keyframes ${name}-${g}{${body}}`).join('\n');
const animRule = (cls, name, extra = '') => `${extra ? `.${cls}{${extra}}` : ''}.gen-a .${cls}{animation-name:${name}-a}.gen-b .${cls}{animation-name:${name}-b}`;
const origin = (x, y) => `transform-origin:${n2(x)}px ${n2(y)}px`;

// 2-bone solve in 3D with a pole vector (from the pill rig). S shoulder, G grip (x, y, z),
// z = distance out to the lifter's side, toward the camera for the near arm.
// Returns the elbow and the projected (drawn) lengths fu, ff, plus side-view angles.
function solve3(S, G, a, b, pole) {
  const D = sub(G, S), d = Math.hypot(...D);
  if (d > a + b || d < Math.abs(a - b)) throw new Error(`unreachable d=${d.toFixed(2)}`);
  const ax = mul(D, 1 / d), along = (a * a - b * b + d * d) / (2 * d), rc = Math.sqrt(Math.max(0, a * a - along * along));
  const perp = norm(sub(pole, mul(ax, dot(pole, ax))));
  const E = add(add(S, mul(ax, along)), mul(perp, rc));
  const fu = Math.hypot(E[0] - S[0], E[1] - S[1]) / a, ff = Math.hypot(G[0] - E[0], G[1] - E[1]) / b;
  const phi = deg(Math.atan2(E[0] - S[0], E[1] - S[1])), psi = deg(Math.atan2(G[0] - E[0], G[1] - E[1]));
  const inside = deg(Math.acos(dot(sub(S, E), sub(G, E)) / (a * b)));
  const outFromSide = deg(Math.asin(Math.max(-1, Math.min(1, E[2] / a))));
  const forward = deg(Math.atan2(E[0] - S[0], E[1] - S[1]));
  return { E, fu, ff, phi, psi, inside, outFromSide, forward };
}

// ---------------------------------------------------------------------------
// Shared CSS (the artboard puts all of this in <helmet><style>).
const BASE_CSS = `
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
  --skin:color-mix(in srgb,var(--body) 92%,var(--text));
  --skin-hi:color-mix(in srgb,var(--skin) var(--hi),var(--lit));
  --skin-lo:color-mix(in srgb,var(--skin) var(--lo),var(--shd));
  --tee:var(--body);
  --tee-hi:color-mix(in srgb,var(--tee) var(--hi),var(--lit));
  --tee-lo:color-mix(in srgb,var(--tee) var(--lo),var(--shd));
  --shorts:color-mix(in srgb,var(--body) 78%,var(--text));
  --shorts-hi:color-mix(in srgb,var(--shorts) var(--hi),var(--lit));
  --shorts-lo:color-mix(in srgb,var(--shorts) var(--lo),var(--shd));
  --shorts-far:color-mix(in srgb,var(--shorts) 45%,var(--surface-1));
  --shoe:color-mix(in srgb,var(--body) 50%,var(--shd));
  --shoe-hi:color-mix(in srgb,var(--shoe) var(--hi),var(--lit));
  --shoe-lo:color-mix(in srgb,var(--shoe) var(--lo),var(--shd));
  --shoe-far:color-mix(in srgb,var(--shoe) 45%,var(--surface-1));
  --sole:color-mix(in srgb,var(--body) 45%,var(--lit));
  --hair:color-mix(in srgb,var(--body) 50%,var(--shd));
  --hair-hi:color-mix(in srgb,var(--hair) var(--hi),var(--lit));
  --rim:color-mix(in srgb,var(--body) var(--rim-k),var(--lit));
  --equip-hi:color-mix(in srgb,var(--equip) var(--hi),var(--lit));
  --equip-lo:color-mix(in srgb,var(--equip) var(--lo),var(--shd));
  --metal-lo:color-mix(in srgb,var(--fg-metal) 50%,var(--surface-1));
  --seam:color-mix(in srgb,var(--fg-frame) 70%,var(--equip));
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
.bubble{position:absolute;left:12px;right:12px;bottom:12px;display:flex;gap:8px;align-items:flex-start;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md);padding:8px 12px;font-size:13px;line-height:18px;color:var(--text)}
.bubble .dot{flex:none;width:8px;height:8px;border-radius:50%;background:var(--accent);margin-top:5px}
.pics{position:absolute;inset:1px;display:none;padding:6px;gap:6px;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,128px);background:var(--surface-1);border-radius:var(--radius-lg)}
/* LP: Pictures and zoom are root classes (player gen-a|gen-b [zoom-1|zoom-2|zoom-3] [pictures]) */
.pictures .pics{display:grid}
.zoom-1 .pics,.zoom-2 .pics,.zoom-3 .pics{display:none}
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
.b{fill:var(--skin)}.bh{fill:var(--skin-hi)}.bl{fill:var(--skin-lo)}
.t{fill:var(--tee)}.th{fill:var(--tee-hi)}.tl{fill:var(--tee-lo)}
.p{fill:var(--shorts)}.ph{fill:var(--shorts-hi)}.pl{fill:var(--shorts-lo)}
.s{fill:var(--shoe)}.sh{fill:var(--shoe-hi)}.sl{fill:var(--shoe-lo)}.so{fill:var(--sole)}
.hr{fill:var(--hair)}.hrh{fill:var(--hair-hi)}
.bf{fill:var(--body-far)}.pf{fill:var(--shorts-far)}.sf{fill:var(--shoe-far)}
.tn{fill-opacity:.75}
.rim{fill:none;stroke:var(--rim);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.gw{fill:none;stroke:var(--accent);stroke-width:calc(var(--sw) * 5px);stroke-opacity:.3;stroke-linejoin:round}
.shd{fill:var(--scrim);fill-opacity:.16}
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
.eqs{fill:var(--equip)}.eqh{fill:var(--equip-hi)}.eql{fill:var(--equip-lo)}
.knurl{fill:none;stroke:var(--metal-lo);stroke-width:calc(var(--sw) * .7px)}
.seam{fill:none;stroke:var(--seam);stroke-width:calc(var(--sw) * .7px);stroke-dasharray:1.6 1.2}
.prim{fill:none;stroke:var(--fg-metal);stroke-width:calc(var(--sw) * .7px)}
.hdf{fill:var(--fg-line-far)}
.pin{fill:var(--accent)}
.rod{fill:none;stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px)}
.cable{fill:none;stroke:var(--fg-cable);stroke-width:calc(var(--sw) * 1.25px);stroke-linecap:round}
.floor{stroke:var(--border);stroke-width:1px}
.b,.bf,.olk,.olkf,.rim,.fc,.mm,.mh,.eq,.eqm,.eqf,.rod,.cable,.floor,.knurl,.seam,.prim{vector-effect:non-scaling-stroke}
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
${kfRaw('cap1', '0%{opacity:1}25%{opacity:0}100%{opacity:0}')}
${kfRaw('cap2', '0%{opacity:0}25%{opacity:1}37.5%{opacity:0}100%{opacity:0}')}
${kfRaw('cap3', '0%{opacity:0}37.5%{opacity:1}87.5%{opacity:0}100%{opacity:0}')}
${kfRaw('cap4', '0%{opacity:0}87.5%{opacity:1}100%{opacity:1}')}
${kfRaw('rep1', '0%{opacity:1}33.333%{opacity:0}100%{opacity:0}')}
${kfRaw('rep2', '0%{opacity:0}33.333%{opacity:1}66.667%{opacity:0}100%{opacity:0}')}
${kfRaw('rep3', '0%{opacity:0}66.667%{opacity:1}100%{opacity:1}')}
${animRule('c1', 'cap1')}${animRule('c2', 'cap2')}${animRule('c3', 'cap3')}${animRule('c4', 'cap4')}
${animRule('r1', 'rep1')}${animRule('r2', 'rep2')}${animRule('r3', 'rep3')}
/* ---- reduced motion: cannot be overridden by the root style hole ---- */
@media (prefers-reduced-motion: reduce){
  .anim,.capx,.repx{animation-play-state:paused!important}
  .player:not(.zoom-1):not(.zoom-2):not(.zoom-3) .pics{display:grid!important}
  .cam,.ov{transition:none!important}
  .pill-row{display:none!important}
}
`;

// ===========================================================================
// LP: everything below is the Lat Pulldown player (spec 3.2), same conventions as the rig proofs.
const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14M16 5v14"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>',
};
function arrowSvg(a) { // a = { from:[x,y], to:[x,y] } in scene units (rig section 12)
  const [x0, y0] = a.from, [x1, y1] = a.to, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const hx = x1 - ux * 6, hy = y1 - uy * 6, nx = -uy * 4, ny = ux * 4;
  return `<path class="arrow" d="M${n2(x0)} ${n2(y0)}L${n2(hx)} ${n2(hy)}"/><polygon class="arrow-head" points="${pts([[x1, y1], [hx + nx, hy + ny], [hx - nx, hy - ny]])}"/>`;
}

// LP: exercise-local shape for the side-view lats region. The rig's region stops at the lower ribs,
// and with the arm down by the side it hides almost all of it at the end of the pull (the moment
// the lats work hardest). The lat really runs down the back to the waist, so here the region
// follows the back edge down to local y -12.5 (on the figure-detail torso outline, above the waistband).
// Only the Lat Pulldown uses this shape.
SIDE.torso.regions = SIDE.torso.regions.map(r => r.muscle === 'lats' ? { ...r, poly: [[-12.3, -52], [-5.4, -54.6], [-2.6, -42], [-3.8, -30], [-3.8, -20], [-5.2, -12.5], [-11.21, -12.5], [-10.8, -15], [-10, -26], [-11.9, -40]] } : r);
// LP: the rig's side hand wraps a handle along its local x with the thumb at +x. Here the bar runs from the grip
// toward the far hand along local -x (113-169 degrees from +x over the rep, section 7 of PLAYER.md), so the hand is
// the rig's hand mirrored: thumb and index finger on the inside of the grip (toward the far hand), little finger
// toward the near end of the bar, which is drawn over the hand from the little-finger side (as before).
const LP_FIST = mirPart(SIDE.fist);   // the far hand holds the other end, so its inside (thumb) is toward the near hand: the rig's hand as is
// LP: the face landmarks shoot.cjs and fit-motion.mjs measure against, as indices into the side head polygon
// (HEAD_S): the forehead's front top (top), the front edge from the brow to the chin (edge), and the chin (chin).
const FACE = { top: [4, 5], edge: [6, 12], chin: 12 };

// LP (QA r2, decision D1 closed): the whole solve is a function of the grip Z (hand out to the side from the
// shoulder joint, constant because the bar is rigid), so PLAYER.md can show what other grips would give.
// The build uses Z = 14: hands 72 apart, about 1.2 times the outside shoulder width ("a little wider than
// your shoulders", spec 3.2 Grip caption and About step 2).
// Top of the rep (spec truth table: arms overhead, about 170; elbow about 170, not locked): the hand is placed
// straight above the raised shoulder (2 behind its joint) at the reach an elbow of IN0 gives, so the upper arm sits
// about 162 from the torso line (the side view draws about 169). This is why the bar starts at about y 66, not 72,
// and a little behind x 156: with the bar at (156, 72) the arm cannot pass about 148 (spec 3.2's own key-pose table
// gives 148.4 there). Path: the bar comes down and forward above the head, passes in front of the face at x 160-162
// (so the fist stays clear of the nose), and comes onto the top of the chest at (157, 150).
// LP (smoothness upgrade, UPGRADE-BRIEF.md smoothness target 4; docs/COACHING-DECISIONS.md D-L1): the smoothness check
// asks every drawn angle (upper arm, forearm, bar, far upper arm, far forearm, front cable) to change its acceleration
// evenly, within 3 x its median change, while the timing is minimum-jerk. That holds only when each angle runs nearly
// in step with the progress p, with no sudden change of rate anywhere in the move. So the motion is described by
// smooth curves in p and fitted to the check (fit-motion.mjs), not pieced together from straight and curved parts:
// - the hand: x = X0 + a Bernstein curve of the PX offsets, y = Y0 + the PV shares of the drop to Y1 (degree 6). It
//   leaves the top forward and only a little down, so the nearly straight elbow starts to bend gradually (moving the
//   hand straight toward the shoulder at the start bends a nearly straight elbow in a sudden burst);
// - the elbow's bend direction (the pole): one cubic Bernstein curve in p from the top direction (out to the side,
//   B0 - 90 degrees forward) through the two PC directions (forward, out, down along the torso) to the end elbow;
// - the shoulder blades: pulled down and back first, share of the move done = 1 - (1 - p)^SK (spec truth table);
// - the elbow at the top: IN0 = 171, "about 170, not locked" (spec truth table; the old 174 made the first burst sharper).
const bern = (cp, t) => { const n = cp.length - 1; let s = 0; for (let k = 0; k <= n; k++) s += cp[k] * binom(n, k) * t ** k * (1 - t) ** (n - k); return s; };
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
const LP_OPT = {
  DX: -2, IN0: 171, TEND: 26, X1: 157, Y1: 150, B0: 126.485, SK: 4.56,
  PX: [2.4067, 12.3466, 22.2061, 33.8756, 19.9921],
  PV: [0.06516, 0.42816, 0.43248, 0.79953, 0.87118],
  PC: [[1.3947, 1.2281, 0.8589], [0.2808, 0.338, 0.8292]],
};
const makeLP = (Z, o = LP_OPT) => {
  const H = [150, 206];                          // hip on the stage (spec 3.2)
  const LEAN = 10;                               // torso leaned back 10 deg, fixed: rotate(-10) about the hip
  const cL = Math.cos(rad(-LEAN)), sL = Math.sin(rad(-LEAN));
  const rotL = ([x, y]) => [x * cL - y * sL, x * sL + y * cL];   // SVG rotate(-10deg)
  const TD = [Math.sin(rad(LEAN)), Math.cos(rad(LEAN)), 0];      // torso "down" axis (hip side)
  const TF = [Math.cos(rad(LEAN)), -Math.sin(rad(LEAN)), 0];     // torso forward axis (chest side)
  const TZ = [0, 0, 1];                                          // out to the lifter's side, toward the camera
  // Shoulder blades (spec truth table): slightly raised at the top stretch, pulled down and back first.
  const SC0 = [0.5, -2.5], SC1 = [-1.5, 1.5];
  const scap = p => { const w = 1 - (1 - Math.min(1, Math.max(0, p))) ** o.SK; return [SC0[0] + (SC1[0] - SC0[0]) * w, SC0[1] + (SC1[1] - SC0[1]) * w]; };
  const shoulder = p => { const d = scap(p), r = rotL([d[0], -62 + d[1]]); return [H[0] + r[0], H[1] + r[1], 0]; };
  const S0 = shoulder(0), R0 = Math.sqrt(38 * 38 + 40 * 40 - 2 * 38 * 40 * Math.cos(rad(o.IN0)));
  const X0 = S0[0] + o.DX, Y0 = S0[1] - Math.sqrt(R0 * R0 - o.DX * o.DX - Z * Z);
  const TRAVEL = o.Y1 - Y0;
  const BX = [X0, ...o.PX.map(v => X0 + v), o.X1], BY = [Y0, ...o.PV.map(v => Y0 + TRAVEL * v), o.Y1];
  const gripAt = p => [bern(BX, p), bern(BY, p), Z];
  // the hand path as a polyline (even steps of p), with its arc length, for the guide and the "still to go" line
  const PN = 96, pathPts = Array.from({ length: PN + 1 }, (_, i) => gripAt(i / PN));
  const cum = [0]; for (let i = 1; i <= PN; i++) cum.push(cum[i - 1] + Math.hypot(pathPts[i][0] - pathPts[i - 1][0], pathPts[i][1] - pathPts[i - 1][1]));
  const pathLen = cum[PN];
  const arcAt = p => { const f = p * PN, i = Math.max(0, Math.min(PN - 1, Math.floor(f))); return (cum[i] + (cum[i + 1] - cum[i]) * (f - i)) / cum[PN]; };
  // where the path runs in front of the face: its most forward x (XF) and the stretch at x 160 or more (y YK to YC)
  const fine = Array.from({ length: 2001 }, (_, i) => gripAt(i / 2000)), front = fine.filter(g => g[0] >= 160);
  const XF = Math.round(Math.max(...fine.map(g => g[0])) * 10) / 10, YK = Math.round(front[0][1] * 10) / 10, YC = Math.round(front[front.length - 1][1] * 10) / 10;
  // Poles (which way the elbow bends): at the top out to the side and B0 - 90 degrees forward; at the end the chosen end
  // elbow: down by the side, slightly behind, 25 from the torso line (spec: about 20-30); in between one smooth curve.
  const pole = (f, s, d) => norm(add(add(mul(TF, f), mul(TZ, s)), mul(TD, d)));
  const poleTop = pole(-Math.cos(rad(o.B0)), Math.sin(rad(o.B0)), 0);
  const S1 = shoulder(1), G1 = gripAt(1);
  const endElbow = (() => {
    const D = sub(G1, S1), d = Math.hypot(...D), ax = mul(D, 1 / d), along = (38 * 38 - 40 * 40 + d * d) / (2 * d), rc = Math.sqrt(38 * 38 - along * along);
    const u = norm(sub(TD, mul(ax, dot(TD, ax)))), v = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
    const E = add(add(S1, mul(ax, along)), add(mul(u, rc * Math.cos(rad(o.TEND))), mul(v, rc * Math.sin(rad(o.TEND)))));
    const es = sub(E, S1);
    return { E, elev: deg(Math.acos(dot(es, TD) / 38)), behind: -dot(es, TF) };
  })();
  const poleEnd = norm(sub(endElbow.E, S1));
  const PCV = [poleTop, ...o.PC.map(([f, s, d]) => add(add(mul(TF, f), mul(TZ, s)), mul(TD, d))), poleEnd];
  const poleAt = p => norm([0, 1, 2].map(k => bern(PCV.map(v => v[k]), p)));
  const raw = p => {
    const S = shoulder(p), G = gripAt(p), r = solve3(S, G, LEN.upperArm, LEN.forearm, poleAt(p));
    const es = sub(r.E, S);
    return { p, S, G, ...r, elev: deg(Math.acos(dot(es, TD) / 38)), behind: -dot(es, TF), uaRaw: -r.phi + LEAN, faRaw: -(r.psi - r.phi), sc: scap(p), bar: [G[0] - X0, G[1] - Y0] };
  };
  // unwrap the two rotations along p, so keyframes never spin the long way round
  const N = o.TAB || 2000, tab = [];
  for (let i = 0; i <= N; i++) {
    const q = raw(i / N);
    if (i) { const pr = tab[i - 1]; while (q.uaRaw - pr.ua > 180) q.uaRaw -= 360; while (q.uaRaw - pr.ua < -180) q.uaRaw += 360; while (q.faRaw - pr.fa > 180) q.faRaw -= 360; while (q.faRaw - pr.fa < -180) q.faRaw += 360; }
    tab.push({ ua: q.uaRaw, fa: q.faRaw });
  }
  const pose = p => {
    const q = raw(p), ref = tab[Math.round(p * N)];
    let ua = q.uaRaw, fa = q.faRaw;
    while (ua - ref.ua > 180) ua -= 360; while (ua - ref.ua < -180) ua += 360;
    while (fa - ref.fa > 180) fa -= 360; while (fa - ref.fa < -180) fa += 360;
    return { ...q, ua, fa };
  };
  return { H, LEAN, rotL, TD, TF, Z, X0, Y0, Y1: o.Y1, XF, X1: o.X1, YK, YC, TRAVEL, SC0, SC1, scap, shoulder, gripAt, pathPts, arcAt, pathLen, poleTop, poleEnd, endElbow, pose, o };
};
const GRIP_Z = 14;
const LP = makeLP(GRIP_Z);
// LP: angle helpers for the truth table. 3D = the real joint angle; 2D = the angle the side view shows.
const angTo = (v, w) => deg(Math.acos(dot(v, w) / (Math.hypot(...v) * Math.hypot(...w))));
const SHOULDER_OUT = 22, SHOULDER_OUTSIDE = 30.2;  // front view: shoulder joint 22 from the centre line; outside of the deltoid 30.2
const gripTimes = Z => 2 * (SHOULDER_OUT + Z) / (2 * SHOULDER_OUTSIDE);   // hand-to-hand width / outside shoulder width
// What other grips give with the same method (PLAYER.md section 9, decision D1): a wider grip opens the elbow at the
// chest toward the truth table's 65-75 but pulls the arms off "overhead" at the top; no grip meets both.
const GRIP_OPTIONS = [0, 8, GRIP_Z, 20, 25, 30, 39].map(Z => {
  const L = Z === GRIP_Z ? LP : makeLP(Z);
  let minFu = 9; for (let i = 0; i <= 100; i++) minFu = Math.min(minFu, L.pose(i / 100).fu);
  const a = L.pose(0), b = L.pose(1);
  return { Z, times: gripTimes(Z), topElev: a.elev, endInside: b.inside, endElev: b.elev, rom: a.elev - b.elev, minFu, Y0: L.Y0 };
});

// Bar (QA r2 issue 2): the lat bar is drawn with the rig's own slight view from the front and above, the same view
// that puts the far leg at translate(5 -3) for its 20 units of hip width, so one unit of depth away from the camera
// moves a point (0.25, -0.15) on screen. Real sizes: bar 150 long (ends at +-75 from the centre line), straight
// between +-48, then bent down 6 to the ends; near hand at +36 (22 to the shoulder joint + 14), far hand at -36.
// Drawn relative to the near grip: the near end sticks out a little behind and below the near fist, the bar rises
// forward to the far hand and the far end; the cable hooks on the bar's middle (9 forward, 5.4 up of the near grip).
const DEPTH_K = [0.25, -0.15];
const NEAR_Z = SHOULDER_OUT + GRIP_Z, BAR_HALF = 75, BAR_BEND = 48, BAR_DROP = 6;
const barPt = z => { const d = NEAR_Z - z, drop = BAR_DROP * Math.max(0, (Math.abs(z) - BAR_BEND) / (BAR_HALF - BAR_BEND)); return [DEPTH_K[0] * d, DEPTH_K[1] * d + drop]; };
const BAR_PTS = [BAR_HALF, BAR_BEND, -BAR_BEND, -BAR_HALF].map(barPt);
const BAR_MID = barPt(0), FAR_GRIP = barPt(-NEAR_Z);
const HAND_HALF = 5;   // half a hand's width along the bar (the fist is 12 across in the front view)
// Pictures tile 2 "Drive your elbows down" is back at the spec's 12.5 % (QA r2 issue 8): with this grip and path the
// fist and forearm are clear of the face there (checked in shoot.cjs).
const TILE2 = 0.125;
const GRIP_CAPTION = 'Hands a little wider than your shoulders, thumbs around the bar.';   // spec 3.2, unchanged
// LP (QA r3, decision D2): the spec's Path caption said "comes straight down", but arms that start overhead bring the
// bar forward above the head before it drops past the face, and the dashed guide shows that curve. The word
// "straight" is dropped so the words match what a beginner sees.
const PATH_CAPTION = 'The bar comes down in front of your face to the top of your chest.';
// Front pulley: r 5.2, top at y 34 so it stays below the pill row (pills y 10-32). LP (QA r3): it sits straight
// above the cable hook at the top of the rep, so at the start (the pose on screen longest) the cable hangs straight
// down onto the bar's middle, in the gap between the two fists; round 2 had it 5.7 further forward, right over the
// far fist, and the bar looked as if it hung from the far fist.
const PF = { x: Math.round((LP.X0 + BAR_MID[0]) * 10) / 10, y: 39.2, r: 5.2 };

// Grip close-up inset (QA r2 issue 3): the side view cannot show how wide the hands are or the thumbs, so the Grip
// chip also shows a small front view of the top of the rep: both hands on the bar, a little wider than the shoulders
// (the arms open slightly outward from the shoulders), with the thumbs wrapped round the bar (accent). Static, drawn
// from the rig's front-view parts with the arm angles of this build's top pose.
// LP: the front cable and the far arm as functions of the pose p, for any makeLP build (the player's, and the
// pace fit below). The cable runs from the bottom of the front pulley to the hook on the bar's middle.
function extrasOf(L) {
  const { pose, X0, Y0 } = L;
  const C0 = [X0 + BAR_MID[0], Y0 + BAR_MID[1]];          // bar middle (cable hook) at the top
  const cab = (p, q = pose(p)) => { const c = [C0[0] + q.bar[0], C0[1] + q.bar[1]], dx = c[0] - PF.x, dy = c[1] - (PF.y + PF.r); return { len: Math.hypot(dx, dy), ang: deg(Math.atan2(-dx, dy)) }; };
  // far forearm: from the far grip it aims at the near elbow, so it tucks in behind the near arm (or behind the chest);
  // it is scaled about its wrist end (9 from the grip), so it never parts from the fist
  const farJ = (p, q = pose(p)) => { const zE = SHOULDER_OUT + q.E[2];
    const S = [q.S[0] + DEPTH_K[0] * 2 * SHOULDER_OUT, q.S[1] + DEPTH_K[1] * 2 * SHOULDER_OUT], E = [q.E[0] + DEPTH_K[0] * 2 * zE, q.E[1] + DEPTH_K[1] * 2 * zE], G = [q.G[0] + FAR_GRIP[0], q.G[1] + FAR_GRIP[1]];
    const au = deg(Math.atan2(-(E[0] - S[0]), E[1] - S[1])), af = deg(Math.atan2(-(G[0] - E[0]), G[1] - E[1]));
    return { S, E, G, au, af, fu: Math.hypot(E[0] - S[0], E[1] - S[1]) / LEN.upperArm, ff: Math.hypot(G[0] - E[0], G[1] - E[1]) / LEN.forearm }; };
  const FS0 = farJ(0).S;
  // the far arm's two screen angles, unwrapped along p against a table (the table only picks the turn: every value is
  // solved at its own p, so a stop never repeats its neighbour's value)
  const FN = L.o.TAB || 2000, farTab = []; for (let i = 0; i <= FN; i++) { const f = farJ(i / FN); if (i) { const pr = farTab[i - 1]; while (f.au - pr.au > 180) f.au -= 360; while (f.au - pr.au < -180) f.au += 360; while (f.af - pr.af > 180) f.af -= 360; while (f.af - pr.af < -180) f.af += 360; } farTab.push(f); }
  const far = (p, q) => { const f = farJ(p, q), r = farTab[Math.round(p * FN)];
    while (f.au - r.au > 180) f.au -= 360; while (f.au - r.au < -180) f.au += 360; while (f.af - r.af > 180) f.af -= 360; while (f.af - r.af < -180) f.af += 360;
    return f; };
  return { C0, cab, far, FS0 };
}

// LP: the smoothness numbers shoot.cjs measures in the browser (../smooth-check.cjs, UPGRADE-BRIEF.md target 4),
// computed from the solved poses exactly as the page draws them: every keyframe value rounded as written, drawn
// linearly between stops, sampled every 1/480 of the rep. Channels: the six rotated groups (lp-ua, lp-fa, lp-bar,
// lp-fua, lp-ffa, lp-cable-f) and the near grip point (0, 16 in the near hand group), placed through the drawn chain.
const SM_LIM = { a: 0.01, b: 0.08, c: 3, d: 4, travel: 10 };
function drawnAt(L, X, p) {
  const q = L.pose(p), f = X.far(p, q), c = X.cab(p, q);
  return { sc: [+n3(q.sc[0]), +n3(q.sc[1])], tfa: +n3(-(1 - q.fu) * LEN.upperArm), thd: +n3(-(1 - q.ff) * LEN.forearm),
    ang: { 'lp-ua': +n4(q.ua), 'lp-fa': +n4(q.fa), 'lp-bar': +n4(L.LEAN - q.ua - q.fa), 'lp-fua': +n4(f.au), 'lp-ffa': +n4(f.af - f.au), 'lp-cable-f': +n4(c.ang) } };
}
function drawnGrip(L, d) {
  const R = (a, [x, y]) => { const c = Math.cos(rad(a)), s = Math.sin(rad(a)); return [x * c - y * s, x * s + y * c]; };
  const f = R(d.ang['lp-fa'], [0, LEN.forearm + d.thd]);
  const u = R(d.ang['lp-ua'], [f[0], LEN.upperArm + d.tfa + f[1]]);
  const t = L.rotL([d.sc[0] + u[0], -62 + d.sc[1] + u[1]]);
  return [L.H[0] + t[0], L.H[1] + t[1]];
}
function smoothNumbers(L, X = extrasOf(L)) {
  const N = 480, DT = 4 / N;
  const st = SAMPLES.map(pc => ({ u: pc / 100, d: drawnAt(L, X, progress(pc / 100)) }));
  const names = Object.keys(st[0].d.ang);
  const lerpD = (a, b, w) => ({ sc: [a.sc[0] + (b.sc[0] - a.sc[0]) * w, a.sc[1] + (b.sc[1] - a.sc[1]) * w], tfa: a.tfa + (b.tfa - a.tfa) * w, thd: a.thd + (b.thd - a.thd) * w, ang: Object.fromEntries(names.map(k => [k, a.ang[k] + (b.ang[k] - a.ang[k]) * w])) });
  const smp = []; let j = 0;
  for (let i = 0; i <= N; i++) { const u = i / N; while (j < st.length - 2 && st[j + 1].u <= u) j++; const w = (u - st[j].u) / (st[j + 1].u - st[j].u); smp.push(lerpD(st[j].d, st[j + 1].d, Math.min(1, w))); }
  const grip = smp.map(d => drawnGrip(L, d)), ser = Object.fromEntries(names.map(k => [k, smp.map(d => d.ang[k])]));
  const stats = (s, i0, i1, vec) => {
    const vel = []; for (let i = i0; i < i1; i++) vel.push(vec ? [(s[i + 1][0] - s[i][0]) / DT, (s[i + 1][1] - s[i][1]) / DT] : (s[i + 1] - s[i]) / DT);
    const mag = v => (vec ? Math.hypot(v[0], v[1]) : Math.abs(v)), peak = Math.max(...vel.map(mag));
    let jump = 0; for (let i = 1; i < vel.length; i++) jump = Math.max(jump, vec ? Math.hypot(vel[i][0] - vel[i - 1][0], vel[i][1] - vel[i - 1][1]) : Math.abs(vel[i] - vel[i - 1]));
    const seg = s.slice(i0, i1 + 1);
    return { a: peak ? Math.max(mag(vel[0]), mag(vel[vel.length - 1])) / peak : 0, b: peak ? jump / peak : 0, travel: vec ? null : Math.max(...seg) - Math.min(...seg) };
  };
  const stopJerk = (k, a, b) => {
    const s = st.filter(x => x.u >= a - 1e-9 && x.u <= b + 1e-9).map(x => [x.u * 4, x.d.ang[k]]);
    const vv = [], tm = []; for (let i = 1; i < s.length; i++) { vv.push((s[i][1] - s[i - 1][1]) / (s[i][0] - s[i - 1][0])); tm.push((s[i][0] + s[i - 1][0]) / 2); }
    const acc = []; for (let i = 1; i < vv.length; i++) acc.push((vv[i] - vv[i - 1]) / (tm[i] - tm[i - 1]));
    const jk = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i] - acc[i - 1]));
    const srt = [...jk].sort((x, y) => x - y), med = srt.length % 2 ? srt[(srt.length - 1) / 2] : (srt[srt.length / 2 - 1] + srt[srt.length / 2]) / 2;
    const mx = Math.max(...jk);
    return { r: med > 0 ? mx / med : Infinity, u: s[jk.indexOf(mx) + 2][0] / 4 };
  };
  let d = { v: 0 }; for (const k of names) for (let i = 0; i < N; i++) { const v = Math.abs(ser[k][i + 1] - ser[k][i]); if (v > d.v) d = { v, k, u: i / N }; }
  const out = { d, phases: {} };
  for (const [ph, a, b] of [['lift', 0, 0.25], ['return', 0.375, 0.875]]) {
    const i0 = Math.round(a * N), i1 = Math.round(b * N);
    const rows = [{ name: 'near hand (grip)', ...stats(grip, i0, i1, true), c: null, gate: true }];
    for (const k of names) { const r = stats(ser[k], i0, i1, false), gate = r.travel >= SM_LIM.travel, j = gate ? stopJerk(k, a, b) : null; rows.push({ name: k, ...r, c: j ? j.r : null, cu: j ? j.u : null, gate }); }
    const g = rows.filter(r => r.gate), cc = rows.filter(r => r.c !== null);
    out.phases[ph] = { a: Math.max(...g.map(r => r.a)), b: Math.max(...g.map(r => r.b)), c: Math.max(...cc.map(r => r.c)), rows };
  }
  const P = out.phases;
  out.worst = Math.max(P.lift.a / SM_LIM.a, P.return.a / SM_LIM.a, P.lift.b / SM_LIM.b, P.return.b / SM_LIM.b, P.lift.c / SM_LIM.c, P.return.c / SM_LIM.c, d.v / SM_LIM.d);
  return out;
}
const smLine = m => ['lift', 'return'].map(ph => `${ph}: ` + m.phases[ph].rows.map(r => `${r.name}${r.travel !== null ? ` [${r.travel.toFixed(1)}]` : ''} a ${(r.a * 100).toFixed(2)} % b ${(r.b * 100).toFixed(2)} %${r.c !== null ? ` c ${r.c.toFixed(2)}x` : ''}`).join('; ')).join('\n') + `\n(d) ${m.d.v.toFixed(2)} deg (${m.d.k} at u ${m.d.u.toFixed(4)})`;

function gripInset() {
  const a = LP.pose(0), up = v => -dot(v, LP.TD);
  const eU = sub(a.E, a.S), gU = sub(a.G, a.S);
  const elbow = [SHOULDER_OUT + eU[2], -62 - up(eU)], grip = [SHOULDER_OUT + gU[2], -62 - up(gU)];
  const uaA = deg(Math.atan2(elbow[0] - SHOULDER_OUT, -(elbow[1] + 62)));           // upper arm, degrees out from straight up
  const faA = deg(Math.atan2(grip[0] - elbow[0], -(grip[1] - elbow[1])));           // forearm, degrees out from straight up
  const L = Math.hypot(elbow[0] - SHOULDER_OUT, elbow[1] + 62), F = Math.hypot(grip[0] - elbow[0], grip[1] - elbow[1]);
  const fu = L / 38, ff = F / 40;                                                    // front-view drawn lengths (the arm leans a little toward the camera)
  const ang = -(180 - uaA), rel = faA - uaA;                                         // screen-right arm: rotate(ang) about the shoulder, then rel about the elbow
  const gy = grip[1], gxR = grip[0];
  // LP (QA r3): the same bar as the main scene: 150 long, straight between +-48, ends bent down 6, hands at +-36
  const barY = gy, bar = [[-BAR_HALF, barY + BAR_DROP], [-BAR_BEND, barY], [BAR_BEND, barY], [BAR_HALF, barY + BAR_DROP]];
  const P = pass => passer(pass, {});
  const arm = (pass, side) => {
    const s = side === 'R' ? 1 : -1, pp = P(pass);
    const part = k => (side === 'R' ? FR[k + 'R'] : mirPart(FR[k + 'R']));
    const thumb = pass === 'fill' ? `<polygon class="lp-thumb" points="${pts([[s * 23.5, 12], [s * 27.6, 12.5], [s * 28, 17], [s * 26.2, 21.5], [s * 23.5, 20.5]])}"/>` : '';
    return `<g class="j" style="transform-origin:${s * 22}px -62px;transform:rotate(${n2(s * ang)}deg)"><g class="j" style="transform-origin:${s * 22}px -62px;transform:scaleY(${n3(fu)})">${pp(part('upperArm'))}</g>${pp(part('deltoid'))}<g class="j" style="transform-origin:${s * 22}px -24px;transform:translateY(${n2(-(1 - fu) * 38)}px) rotate(${n2(s * rel)}deg)">${pp(part('elbowCap'))}<g class="j" style="transform-origin:${s * 22}px -24px;transform:scaleY(${n3(ff)})">${pp(part('forearm'))}</g><g style="transform:translateY(${n2(-(1 - ff) * 40)}px)">${pp(part('fist'))}${thumb}</g></g></g>`;
  };
  const body = pass => { const pp = P(pass); return `${pp(FR.neck)}${pp(FR.torso)}${pp(FR.head)}`; };
  const vb = [-80, gy - 11, 160, -52 - (gy - 11)];   // crop: the whole bar with both bent ends, both hands, head and shoulders
  const svg = `<svg class="inset-fig" viewBox="${vb.map(n2).join(' ')}" aria-hidden="true">${layer(body)}<path class="lp-barline" d="M${bar.map(p => `${n2(p[0])} ${n2(p[1])}`).join('L')}"/>${[-1, 1].map(sg => `<path class="lp-grip" d="M${[50, 56, 62, 68, 73].map(x => `${n2(sg * x)} ${n2(barY + BAR_DROP * (x - BAR_BEND) / (BAR_HALF - BAR_BEND))}`).join('L')}"/>`).join('')}${layer(q => arm(q, 'L'))}${layer(q => arm(q, 'R'))}</svg>`;
  return { svg, grip: [gxR, gy], elbow, uaA, faA, fu, ff, handsApart: 2 * gxR, shouldersOutside: 2 * SHOULDER_OUTSIDE, vb };
}

function latPulldown() {
  const { H, LEAN, X0, Y0, Y1, TRAVEL, pose, arcAt, pathPts } = LP;
  const barLocalD = `M${BAR_PTS.map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;   // bar in the hand's frame (grip at 0, 16)
  // the near end again, from the little-finger side of the hand (HAND_HALF nearer the camera than the grip) out to the tip
  const nearEndD = `M${[barPt(NEAR_Z + HAND_HALF), BAR_PTS[1], BAR_PTS[0]].map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;
  const roles = { lats: 'main', biceps: 'help', midBack: 'help' };
  const FAR = [5, -3];
  const { C0, cab, far, FS0 } = extrasOf(LP);
  const CAB0 = cab(0).len, lift = p => 0.5 * (cab(p).len - CAB0);   // 2:1: the stack rises half as far as the cable pays out
  const LIFT1 = lift(1);
  const BEAM = 36, REAR_TOP = BEAM + 11, REAR_RUN = 106 - REAR_TOP;  // rear pulley r 7 at (47, 47); rear cable to the stack bracket
  // analytic checks between baked samples (every keyframe value runs linearly between stops), at 1/4, 1/2 and 3/4 of
  // each gap. The bar lives in the near hand group, so the near hand can never leave it (QA r3); what is checked:
  // - far: the far fist's grip point vs the far grip on the bar (= near hand + FAR_GRIP, the bar never turns);
  // - cable: the front cable's free end vs the hook on the bar (= near hand + BAR_MID);
  // - nearPath: how far the drawn near hand strays from the solved grip (the dashed guide runs through the solved grip).
  const drift = { far: 0, cable: 0, nearPath: 0 };
  {
    const lerp = (x, y, w) => x + (y - x) * w;
    const cabKey = p => { const c = cab(p); return { ang: c.ang, len: c.len }; };
    for (let i = 0; i < SAMPLES.length - 1; i++) {
      const p0 = progress(SAMPLES[i] / 100), p1 = progress(SAMPLES[i + 1] / 100);
      const a = pose(p0), b = pose(p1), fa0 = far(p0), fb = far(p1), ca = cabKey(p0), cb = cabKey(p1);
      for (const w of [0.25, 0.5, 0.75]) {
        const m = k => lerp(a[k], b[k], w);
        const sc = [lerp(a.sc[0], b.sc[0], w), lerp(a.sc[1], b.sc[1], w)];
        const Sx = LP.rotL([sc[0], -62 + sc[1]]);
        const phi = -(m('ua') - LEAN), psi = phi - m('fa');
        const hand = [H[0] + Sx[0] + LEN.upperArm * m('fu') * Math.sin(rad(phi)) + LEN.forearm * m('ff') * Math.sin(rad(psi)), H[1] + Sx[1] + LEN.upperArm * m('fu') * Math.cos(rad(phi)) + LEN.forearm * m('ff') * Math.cos(rad(psi))];
        drift.nearPath = Math.max(drift.nearPath, Math.min(...Array.from({ length: 41 }, (_, k) => { const g = pose(lerp(p0, p1, k / 40)).G; return Math.hypot(hand[0] - g[0], hand[1] - g[1]); })));
        const fm = k => lerp(fa0[k], fb[k], w);
        const fS = [lerp(fa0.S[0], fb.S[0], w), lerp(fa0.S[1], fb.S[1], w)], au = fm('au'), af = fm('af');
        const fHand = [fS[0] - LEN.upperArm * fm('fu') * Math.sin(rad(au)) - LEN.forearm * fm('ff') * Math.sin(rad(af)), fS[1] + LEN.upperArm * fm('fu') * Math.cos(rad(au)) + LEN.forearm * fm('ff') * Math.cos(rad(af))];
        drift.far = Math.max(drift.far, Math.hypot(fHand[0] - hand[0] - FAR_GRIP[0], fHand[1] - hand[1] - FAR_GRIP[1]));
        const cAng = lerp(ca.ang, cb.ang, w), cLen = lerp(ca.len, cb.len, w);
        const cEnd = [PF.x - cLen * Math.sin(rad(cAng)), PF.y + PF.r + cLen * Math.cos(rad(cAng))];
        drift.cable = Math.max(drift.cable, Math.hypot(cEnd[0] - hand[0] - BAR_MID[0], cEnd[1] - hand[1] - BAR_MID[1]));
      }
    }
  }
  const dense = Array.from({ length: 101 }, (_, i) => pose(i / 100));
  // QA r3: joint speed per keyframe gap, as the CSS plays it (degrees or units per 1.25 % of the rep, so the pull's
  // 1.25 % gaps and the return's 3.125 % gaps compare). Each phase must rise once and fall once: "dip" is the largest
  // drop below the running peak on both sides, as a share of the phase's peak.
  const smoothness = (() => {
    const drawnIn = q => { const u = [q.S[0] - q.E[0], q.S[1] - q.E[1]], v = [q.G[0] - q.E[0], q.G[1] - q.E[1]]; return deg(Math.acos(dot(u, v) / Math.hypot(...u) / Math.hypot(...v))); };
    const st = SAMPLES.map(pc => { const p = progress(pc / 100), q = pose(p), f = far(p); return { pc, ua: q.ua, fa: q.fa, fua: f.au, ffa: f.af - f.au, din: drawnIn(q), E: q.E, fE: f.E, G: q.G }; });
    const val = { ua: s => s.ua, fa: s => s.fa, fua: s => s.fua, ffa: s => s.ffa, elbowAngle: s => s.din };
    const pt = { elbow: s => s.E, farElbow: s => s.fE, hand: s => s.G };
    const phase = (from, to) => {
      const idx = st.map((s, i) => i).filter(i => i > 0 && st[i].pc > from + 1e-9 && st[i].pc <= to + 1e-9);
      const out = {};
      for (const [k, fn] of Object.entries(val)) out[k] = idx.map(i => Math.abs(fn(st[i]) - fn(st[i - 1])) / (st[i].pc - st[i - 1].pc) * 1.25);
      for (const [k, fn] of Object.entries(pt)) out[k] = idx.map(i => { const a = fn(st[i]), b = fn(st[i - 1]); return Math.hypot(a[0] - b[0], a[1] - b[1]) / (st[i].pc - st[i - 1].pc) * 1.25; });
      return out;
    };
    const dip = s => { const mx = Math.max(...s); let w = 0, pre = -1; const suf = []; let m = -1; for (let i = s.length - 1; i >= 0; i--) { m = Math.max(m, s[i]); suf[i] = m; } for (let j = 0; j < s.length; j++) { if (j > 0 && j < s.length - 1) w = Math.max(w, Math.min(pre, suf[j + 1]) - s[j]); pre = Math.max(pre, s[j]); } return mx ? w / mx : 0; };
    const pull = phase(0, 25), ret = phase(37.5, 87.5);
    const dips = Object.fromEntries(Object.keys(pull).map(k => [k, Math.max(dip(pull[k]), dip(ret[k]))]));
    return { pull, ret, dips, worst: Math.max(...Object.values(dips)) };
  })();
  const sampled = SAMPLES.map(pc => pose(progress(pc / 100)));
  // Zoom targets (QA r3): each close-up shows what connects the bar to the machine. Grip: the front pulley, the whole
  // cable and both fists at the setup pose, the ring inside the stage, above the bubble and left of the inset for the
  // whole rep (1.55: the hand travels 84 units, so 1.8 cannot hold the pulley and the ring at the chest at once).
  // Path: the spec's own target, which holds the pulley, the whole path, the face and the chest above the bubble.
  // Pad: the thigh pad, the arrow above it and the feet flat on the floor, all above the bubble ("feet flat").
  const Z1 = { cx: 163, cy: 119, s: 1.55 };
  const Z2 = { cx: 150, cy: 112, s: 1.4 };
  const Z3 = { cx: 197, cy: 227, s: 1.9 };
  const camT = z => `transform:translate(179px,138px) scale(${z.s}) translate(${n2(-z.cx)}px,${n2(-z.cy)}px)`;
  const inset = gripInset();
  // the "still to go" line starts 16 units below the grip (6 below the wrist edge of the fist), so it never looks tied to the fist (QA r2 issue 4)
  const TOGO_GAP = 16 / LP.pathLen;
  const css = `
/* ---- Lat Pulldown (lp): joints, machine, bar, far hand, cable, "still to go" line, effort ---- */
.lp-torso{transform-origin:0px 0px;transform:rotate(-${LEAN}deg)}
${animRule('lp-ua', 'lp-ua', origin(0, -62))}
${animRule('lp-ul', 'lp-ul', origin(0, -62))}
${animRule('lp-fa', 'lp-fa', origin(0, -24))}
${animRule('lp-fl', 'lp-fl', origin(0, -24))}
${animRule('lp-hd', 'lp-hd')}
${animRule('lp-bar', 'lp-bar', origin(0, 16))}
${animRule('lp-fua', 'lp-fua', origin(FS0[0], FS0[1]))}
${animRule('lp-ful', 'lp-ful', origin(FS0[0], FS0[1]))}
${animRule('lp-ffa', 'lp-ffa', origin(FS0[0], FS0[1] + 38))}
${animRule('lp-ffl', 'lp-ffl', origin(FS0[0], FS0[1] + 38))}
${animRule('lp-fhd', 'lp-fhd')}
${animRule('lp-stack', 'lp-stack')}
${animRule('lp-cable-f', 'lp-cable-f', origin(PF.x, PF.y + PF.r))}
${animRule('lp-cable-r', 'lp-cable-r', origin(40, REAR_TOP))}
${animRule('lp-togo', 'lp-togo')}
${animRule('lp-eff', 'lp-eff')}
${animRule('lp-ten', 'lp-ten')}
${kf('lp-ua', p => { const q = pose(p); return `transform:translate(${n3(q.sc[0])}px,${n3(q.sc[1])}px) rotate(${n4(q.ua)}deg)`; })}
${kf('lp-ul', p => `transform:scaleY(${n4(pose(p).fu)})`)}
${kf('lp-fa', p => { const q = pose(p); return `transform:translateY(${n3(-(1 - q.fu) * LEN.upperArm)}px) rotate(${n4(q.fa)}deg)`; })}
${kf('lp-fl', p => `transform:scaleY(${n4(pose(p).ff)})`)}
${kf('lp-hd', p => `transform:translateY(${n3(-(1 - pose(p).ff) * LEN.forearm)}px)`)}
${kf('lp-bar', p => { const q = pose(p); return `transform:rotate(${n4(LEAN - q.ua - q.fa)}deg)`; })}
${kf('lp-fua', p => { const f = far(p); return `transform:translate(${n3(f.S[0] - FS0[0])}px,${n3(f.S[1] - FS0[1])}px) rotate(${n4(f.au)}deg)`; })}
${kf('lp-ful', p => `transform:scaleY(${n4(far(p).fu)})`)}
${kf('lp-ffa', p => { const f = far(p); return `transform:translateY(${n3(-(1 - f.fu) * LEN.upperArm)}px) rotate(${n4(f.af - f.au)}deg)`; })}
${kf('lp-ffl', p => `transform:scaleY(${n4(far(p).ff)})`)}
${kf('lp-fhd', p => `transform:translateY(${n3(-(1 - far(p).ff) * LEN.forearm)}px)`)}
${kf('lp-stack', p => `transform:translateY(${n3(-lift(p))}px)`)}
${kf('lp-cable-f', p => { const c = cab(p); return `transform:rotate(${n4(c.ang)}deg) scaleY(${n4(c.len)})`; })}
${kf('lp-cable-r', p => `transform:scaleY(${n4((REAR_RUN - lift(p)) / REAR_RUN)})`)}
${kf('lp-togo', p => `stroke-dashoffset:${n3(-Math.min(arcAt(p) + TOGO_GAP, 0.999))}`)}
${kf('lp-eff', p => `opacity:${n3(0.75 + 0.25 * p)}`)}
${kf('lp-ten', p => `opacity:${n3(p)}`)}
.lp-barline{fill:none;stroke:var(--fg-metal);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
/* grip texture on the bar's bent ends: ribs painted on the bar line itself (same path and width). A texture, not an occluder, so it takes no pointer hits: a hit test on the bar there finds the bar */
.lp-grip{fill:none;stroke:var(--metal-lo);stroke-width:4;stroke-dasharray:.8 1.1;pointer-events:none}
.lp-hook{fill:var(--fg-metal)}
.lp-target{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round}
/* ---- Grip close-up: front-view inset (QA r2 issue 3) ---- */
.inset{position:absolute;top:10px;right:10px;width:134px;box-sizing:border-box;display:none;flex-direction:column;gap:2px;padding:6px 7px 5px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-md)}
.inset-label{font-size:11px;line-height:14px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--text-2)}
.inset-fig{display:block;width:118px;height:${n2(118 * inset.vb[3] / inset.vb[2])}px;--sw:.8}
.lp-thumb{fill:var(--accent)}
.zoom-1 .inset{display:flex}
/* the path guide and the "still to go" line are the Path chip's subject: hidden in the Grip close-up (QA r2 issue 4), drawn over the arm in the Path close-up so the part in front of the face always shows */
.guide,.trail,.lp-target{transition:opacity 150ms linear}
.zoom-1 .guide,.zoom-1 .trail,.zoom-1 .lp-target{opacity:0}
.lp-over{opacity:0}
.zoom-2 .lp-over{opacity:1}
/* ---- zoom states: root classes zoom-1 Grip, zoom-2 Path, zoom-3 Pad ---- */
.zoom-1 .cam{${camT(Z1)}}
.zoom-2 .cam{${camT(Z2)}}
.zoom-3 .cam{${camT(Z3)}}
.zoom-1 .ov-grip,.zoom-3 .ov-pad{opacity:1}
/* LP (QA r1 issue 5, QA r2 issue 6): the weight stack (plates, rods, pin, bracket, rear cable and pulley) sits on the stage's left edge in the Grip and Path close-ups, cut into slivers; it is not the subject there, so it hides (as the rig hides the far lever in the chest-press Grip zoom) */
.lp-stackset{transition:opacity 150ms linear}
.zoom-1 .lp-stackset,.zoom-2 .lp-stackset{opacity:0}
/* LP (QA r1 issue 1): solid Slow motion pill (accent tint over --surface-2, as the tile badge), so nothing can show through its text */
.pill-accent{background:linear-gradient(var(--accent-soft),var(--accent-soft)),var(--surface-2)}
.bubble{display:none}
.zoom-1 .bubble-1,.zoom-2 .bubble-2,.zoom-3 .bubble-3{display:flex}
.zoom-1 .pill-row,.zoom-2 .pill-row,.zoom-3 .pill-row,.zoom-1 .cam-label,.zoom-2 .cam-label,.zoom-3 .cam-label,.pictures .pill-row,.pictures .cam-label{display:none}
/* ---- Pictures: the grid is a root class; a zoom chip in Pictures shows one still (pose 1; pose 3 for Path) ---- */
.pictures .anim,.pictures .capx,.pictures .repx{animation-play-state:paused}
.pictures.zoom-2 .stage,.pictures.zoom-2 .cap-row{--delay:calc(var(--dur) * -0.31)}
.pictures.zoom-1 .stage,.pictures.zoom-3 .stage,.pictures.zoom-1 .cap-row,.pictures.zoom-3 .cap-row{--delay:0s}
@media (prefers-reduced-motion: reduce){.lp-stackset{transition:none!important}}
`;
  // --- markup (two passes per body layer, rig section 5) ---
  const leg = (pass, far) => {
    const Pp = passer(pass, roles, { far });
    return `<g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)">${Pp(SIDE.hipCap)}${Pp(SIDE.thigh)}<g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)">${Pp(SIDE.kneeCap)}${Pp(SIDE.shin)}${Pp(SIDE.foot)}</g></g>`;
  };
  const bodyLayer = pass => { const Pp = passer(pass, roles, { effort: 'lp-eff', glow: 'lp-ten', ten: 'lp-ten', tenOver: true }); return `<g class="j lp-torso">${Pp(SIDE.neck)}${Pp(SIDE.torso)}<g class="lp-head">${Pp(SIDE.head)}</g></g>${leg(pass)}`; };
  const upper = pass => { const Pp = passer(pass, roles); return `<g class="j anim lp-ul">${Pp(SIDE.upperArm)}</g>${Pp(SIDE.deltoid)}`; };
  // LP (QA r3): the lat bar is held equipment, so it lives INSIDE the near hand group (spec 2.4, RIG section 4) and can
  // never part from the near hand. It counter-rotates by minus the sum of the arm's rotations (torso -10, ua, fa), as
  // the rig's dumbbells do, so it keeps its fixed look on screen. Two layers, both in the hand group: the whole bar and
  // the hook go under the fist fill (the fist wraps round the bar at the grip); the near end, from the little-finger
  // side of the hand out to its tip, goes over the fist. The near end is nearer the camera than the hand, the forearm
  // and the chest, so nothing may hide it: its visible length stays the same through the rep.
  // grip texture (brief: grip texture on the handles): ribs on each bent end, |z| 50 to 73 (the bend is at 48, the tip at 75)
  const gripD = sgn => `M${[50, 56, 62, 68, 73].map(z => barPt(sgn * z)).map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;
  const barGroup = `<g class="j anim lp-bar"><path class="lp-barline" d="${barLocalD}"/><path class="lp-grip" d="${gripD(-1)}"/><circle class="lp-hook" cx="${n2(BAR_MID[0])}" cy="${n2(16 + BAR_MID[1])}" r="2.4"/></g>`;
  const barNear = `<g class="j anim lp-bar lp-bar-near"><path class="lp-barline" d="${nearEndD}"/><path class="lp-grip" d="${gripD(1)}"/></g>`;
  const lower = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}<g class="j anim lp-fl">${Pp(SIDE.forearm)}</g><g class="j anim lp-hd">${pass === 'fill' ? barGroup : ''}${Pp(LP_FIST)}${pass === 'fill' ? `${barNear}<circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/>` : ''}</g>`; };
  const arm = `<g class="j lp-torso"><g class="j anim lp-ua arm-near">${layer(upper)}<g class="j anim lp-fa">${layer(lower)}</g></g></g>`;
  // far hand: the rig's forearm and fist turned to point from the grip toward the elbow (local +y), in the far tones
  // far arm (QA r2 issue 2): the same arm seen on the far side, placed with the rig's depth view (each joint moves
  // (0.25, -0.15) per unit it is further from the camera), in the far tones, behind the bar and the body
  const fpart = part => ({ base: tr(part.base, FS0[0], FS0[1] + 62) });
  const FP = pass => part => (pass === 'ol' ? olPart(fpart(part), true) : fillPart(fpart(part), {}, { far: true }));   // far: outline and fill, no rim (RIG section 5)
  const farUpper = pass => `<g class="j anim lp-ful">${FP(pass)(SIDE.upperArm)}</g>${FP(pass)(SIDE.deltoid)}`;
  const farLower = pass => `${FP(pass)(SIDE.elbowCap)}<g class="j anim lp-ffl">${FP(pass)(SIDE.forearm)}</g><g class="j anim lp-fhd">${FP(pass)(SIDE.fist)}</g>`;
  const farArm = `<g class="far-arm"><g class="j anim lp-fua">${farUpper('ol')}${farUpper('fill')}<g class="j anim lp-ffa">${farLower('ol')}${farLower('fill')}</g></g></g>`;
  let still = '', moving = '';
  for (let i = 0; i < 10; i++) {
    const r = `<rect class="eq" x="16" y="${n2(112.5 + i * 13.5)}" width="48" height="12" rx="1.5"/>`;
    if (i < 7) moving += r; else still += r;
  }
  const bevel = (i0, i1) => `<path class="eqh" d="${Array.from({ length: i1 - i0 }, (_, k) => `M17.2 ${n2(113.6 + (i0 + k) * 13.5)}h45.6v1.2h-45.6z`).join('')}"/>`;   // each plate's lighter top bevel (rig section 7)
  moving += bevel(0, 7); still += bevel(7, 10);
  moving += `<rect class="pin lp-pin" x="63" y="${n2(112.5 + 6 * 13.5 + 4)}" width="9" height="4" rx="2"/><circle class="pin" cx="69.8" cy="${n2(112.5 + 6 * 13.5 + 6)}" r="2.4"/>`;   // pin in plate 7 (spec)
  moving += `<rect class="eqm" x="35" y="106" width="10" height="6.5" rx="1"/>`;                        // top bracket the cable pulls
  const pathD = `M${pathPts.map(p => `${n2(p[0])} ${n2(p[1])}`).join('L')}`;
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
${shadow(208, 258, 17, 2.6)}
<g class="machine-back"><rect class="eq" x="16" y="250" width="246" height="8" rx="1.5"/><g class="lp-stackset"><line class="rod" x1="22" y1="${BEAM + 8}" x2="22" y2="250"/><line class="rod" x1="58" y1="${BEAM + 8}" x2="58" y2="250"/>${still}<g class="j anim lp-stack">${moving}</g><line class="cable j anim lp-cable-r" x1="40" y1="${REAR_TOP}" x2="40" y2="106"/></g><rect class="eq" x="72" y="${BEAM}" width="12" height="${250 - BEAM}" rx="1.5"/><rect class="eq" x="16" y="${BEAM}" width="162" height="8" rx="2"/><g class="lp-stackset"><circle class="eqm" cx="47" cy="${REAR_TOP}" r="7"/><circle class="prim" cx="47" cy="${REAR_TOP}" r="4.6"/><circle class="hd" cx="47" cy="${REAR_TOP}" r="1.4"/></g><circle class="eqm" cx="${PF.x}" cy="${PF.y}" r="${PF.r}"/><circle class="prim" cx="${PF.x}" cy="${PF.y}" r="3.2"/><circle class="hd" cx="${PF.x}" cy="${PF.y}" r="1.2"/></g>
<g class="far-side" transform="translate(${FAR[0]} ${FAR[1]})"><g transform="translate(${H[0]} ${H[1]})">${leg('ol', true)}${leg('fill', true)}</g></g>
${farArm}
<g class="machine-front"><rect class="eq" x="150" y="224" width="9" height="26"/><rect class="eq" x="188" y="191" width="8" height="59"/><rect class="eq" x="118" y="214" width="68" height="10" rx="4"/><rect class="seam" x="120.1" y="216.1" width="63.8" height="5.8" rx="2.2"/></g>
${shadow(160, 214.4, 26, 2.2)}
<g class="figure" transform="translate(${H[0]} ${H[1]})">${layer(bodyLayer)}</g>
<rect class="eq" x="180" y="184" width="24" height="14" rx="7"/><rect class="seam" x="182.1" y="186.1" width="19.8" height="9.8" rx="4.9"/><rect class="ov ov-pad ovs" x="178" y="182" width="28" height="18" rx="9"/>
<path class="guide" d="${pathD}"/><path class="trail j anim lp-togo" d="${pathD}" pathLength="1"/><line class="lp-target" x1="${n2(LP.X1 - 5)}" y1="${Y1}" x2="${n2(LP.X1 + 5)}" y2="${Y1}"/>
<g class="j anim lp-cable-f"><line class="cable" x1="${PF.x}" y1="${PF.y + PF.r}" x2="${PF.x}" y2="${PF.y + PF.r + 1}"/></g>
<g class="figure-arm" transform="translate(${H[0]} ${H[1]})">${arm}</g>
<g class="lp-over"><path class="guide" d="${pathD}"/><path class="trail j anim lp-togo" d="${pathD}" pathLength="1"/><line class="lp-target" x1="${n2(LP.X1 - 5)}" y1="${Y1}" x2="${n2(LP.X1 + 5)}" y2="${Y1}"/></g>`;
  const staticOverlays = `<g class="ov ov-pad">${arrowSvg({ from: [192, 162], to: [192, 179] })}</g>`;
  const down = { from: [210, 96], to: [210, 128] };
  const ex = {
    id: 'lp', title: 'Lat Pulldown form guide', cam: 'Side view', rep: 4,
    caps: ['Pull to your chest, 1 s', 'Squeeze, chest up', 'Up slowly, 2 s', 'Arms long, reset'],
    tempo: '1 s down · 2 s up', picsLine: 'Pull down 1 s, squeeze, up 2 s',
    srText: 'One rep: pull the bar down in front of your face to the top of your chest for 1 second, squeeze, let it up slowly for 2 seconds, reset with your arms long overhead.',
    chips: [
      { n: 1, id: 'grip', label: 'Grip', caption: GRIP_CAPTION },
      { n: 2, id: 'path', label: 'Path', caption: PATH_CAPTION },
      { n: 3, id: 'pad', label: 'Pad', caption: 'Thigh pad snug on your thighs, feet flat. It stops you lifting off.' },
    ],
    pics: ['Thighs under the pad, arms long', 'Drive your elbows down', 'Bar to the top of your chest', 'Up slowly, 2 s'],
    picsAt: [0, TILE2, 0.31, 0.625],
    tileBox: [58, 32, 204, 230],
    arrows: [null, down, null, { from: down.to, to: down.from }],
    css, scene, staticOverlays, zooms: [Z1, Z2, Z3], inset,
  };
  const row = q => ({ p: n2(q.p), shoulder: [n2(q.S[0]), n2(q.S[1])], grip: q.G.map(n2), elbow: q.E.map(n2), ua: n2(q.ua), fu: n3(q.fu), fa: n2(q.fa), ff: n3(q.ff), inside: n2(q.inside), elev: n2(q.elev), behind: n2(q.behind), bar: n2(q.G[1] - Y0), lift: n2(lift(q.p)) });
  const t2 = pose(progress(TILE2));
  const cableTravel = cab(1).len - CAB0;
  return {
    ex, drift, cableTravel, keyTable: [0, 0.25, 0.5, 0.75, 1].map(p => row(pose(p))),
    smoothness, smoothCheck: smoothNumbers(LP),
    series: { fu: dense.map(q => q.fu), ff: dense.map(q => q.ff), inside: dense.map(q => q.inside), ua: sampled.map(q => q.ua), fa: sampled.map(q => q.fa) },
    truth: { topElev2D: angTo([pose(0).E[0] - pose(0).S[0], pose(0).E[1] - pose(0).S[1]], [LP.TD[0], LP.TD[1]]), endElev2D: angTo([pose(1).E[0] - pose(1).S[0], pose(1).E[1] - pose(1).S[1]], [LP.TD[0], LP.TD[1]]), topLine: angTo(sub(pose(0).G, pose(0).S), LP.TD), gripTimes: gripTimes(LP.Z), tile2: { at: TILE2, p: t2.p, elbowBelowShoulder: t2.E[1] - t2.S[1], elbowBelowGrip: t2.E[1] - t2.G[1], forearmFromVertical: Math.abs(deg(Math.atan2(t2.G[0] - t2.E[0], t2.E[1] - t2.G[1]))) }, topInside: pose(0).inside, topElev: pose(0).elev, endInside: pose(1).inside, endElev: pose(1).elev, endBehind: pose(1).behind, endBehind2D: deg(Math.atan2(pose(1).S[0] - pose(1).E[0], pose(1).E[1] - pose(1).S[1])) + LEAN, minFu: Math.min(...dense.map(q => q.fu)), minFf: Math.min(...dense.map(q => q.ff)), liftEnd: LIFT1, travel: TRAVEL },
    geo: { face: FACE, H, X0, Y0, Y1, X1: LP.X1, XF: LP.XF, YK: LP.YK, YC: LP.YC, TRAVEL, Z: LP.Z, NEAR_Z, C0, BEAM, PF, REAR_TOP, REAR_RUN, CAB0, LIFT1, SC0: LP.SC0, SC1: LP.SC1, FS0, DEPTH_K, FAR_GRIP, BAR_MID, BAR_PTS, zooms: { Z1, Z2, Z3 }, inset: { grip: inset.grip, elbow: inset.elbow, handsApart: inset.handsApart, shouldersOutside: inset.shouldersOutside, uaA: inset.uaA, faA: inset.faA } },
  };
}

const lp = latPulldown();
const EXL = lp.ex;

// ---------------------------------------------------------------------------
// Markup, written once with two binding styles: 'dc' (the artboard's x-dc holes) and 'h' (harness).
// Only the caption row, the chips and the controls are bound; the stage is static markup driven by
// the root style string and the root class string.
const cond = (mode, flag, inner, tag = 'span', attrs = '') => mode === 'dc'
  ? `<sc-if value="{{ ${flag} }}" hint-placeholder-val="{{ true }}"><${tag}${attrs}>${inner}</${tag}></sc-if>`
  : `<${tag}${attrs} data-if="${flag}">${inner}</${tag}>`;
function tilesMarkup() {
  return EXL.pics.map((cap, i) => `<div class="tile"><svg viewBox="${EXL.tileBox.join(' ')}" aria-hidden="true"><use href="#rig-${EXL.id}" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -${EXL.picsAt[i]})"/>${EXL.arrows[i] ? arrowSvg(EXL.arrows[i]) : ''}</svg><span class="badge">${i + 1}</span><p>${cap}</p></div>`).join('\n');
}
function stageMarkup(mode) {
  const slow = cond(mode, 'showSlow', 'Slow motion', 'span', ' class="pill pill-accent"');
  return `<div class="stage">
<svg class="scene" viewBox="0 0 358 276" aria-hidden="true"><g class="cam"><g id="rig-${EXL.id}">
${EXL.scene}
</g>${EXL.staticOverlays}</g></svg>
<div class="pill-row"><span class="pill"><span class="stack"><span class="repx r1">Rep 1 of 3</span><span class="repx r2">Rep 2 of 3</span><span class="repx r3">Rep 3 of 3</span></span></span>${slow}</div>
<div class="cam-label">${EXL.cam}</div>
<div class="pics">
${tilesMarkup()}
</div>
${EXL.chips.map(c => `<div class="bubble bubble-${c.n}"><span class="dot"></span><span>${c.caption}</span></div>`).join('\n')}
<div class="inset"><span class="inset-label">Front view</span>${EXL.inset.svg}</div>
</div>`;
}
function belowMarkup(mode) {
  const dc = mode === 'dc';
  const on = (attr, flag) => dc ? ` ${attr}="{{ ${flag} }}"` : ` data-${attr === 'aria-pressed' ? 'pressed' : attr === 'aria-label' ? 'label' : attr}="${flag}"`;
  const click = fn => dc ? ` onClick="{{ ${fn} }}"` : ` data-click="${fn}"`;
  const caps = `<span class="stack">${EXL.caps.map((c, i) => `<span class="capx c${i + 1}">${c}</span>`).join('')}</span>`;
  return `<div class="cap-row"><span class="cap">${cond(mode, 'showIdle', 'Tap Play to watch 3 slow reps.')}${cond(mode, 'showEnded', 'Done. Tap Replay to watch again.')}${dc ? `<sc-if value="{{ showCaps }}" hint-placeholder-val="{{ true }}">${caps}</sc-if>` : caps.replace('<span class="stack">', '<span class="stack" data-if="showCaps">')}${cond(mode, 'showStill1', EXL.pics[0])}${cond(mode, 'showStill3', EXL.pics[2])}${cond(mode, 'showPicsLine', EXL.picsLine)}</span>${cond(mode, 'showTempo', EXL.tempo, 'span', ' class="tempo"')}</div>
<div class="chips">${EXL.chips.map(c => `<button class="chip chip-btn" type="button"${on('aria-pressed', 'z' + c.n)}${click('pick' + c.n)}>${ICON.zoom}${c.label}</button>`).join('')}</div>
<div class="controls">
<button class="btn-icon" type="button"${on('aria-label', 'playLabel')}${dc ? ' disabled="{{ playDisabled }}"' : ' data-disabled="playDisabled"'}${click('togglePlay')}>${cond(mode, 'isPlay', ICON.play)}${cond(mode, 'isPause', ICON.pause)}${cond(mode, 'isReplay', ICON.replay)}</button>
<div class="seg speed"><button type="button"${on('aria-pressed', 'speed1')}${click('speedTo1')}>1x</button><button type="button"${on('aria-pressed', 'speedHalf')}${click('speedToHalf')}>0.5x</button></div>
<span class="grow"></span>
<div class="seg mode"><button type="button"${on('aria-pressed', 'modeAnim')}${dc ? ' disabled="{{ animDisabled }}"' : ' data-disabled="animDisabled"'}${click('toAnim')}>Animation</button><button type="button"${on('aria-pressed', 'modePics')}${click('toPics')}>Pictures</button></div>
</div>
<p class="hint">${cond(mode, 'hintAnim', 'Tap a zoom chip to look closer. Tap it again to zoom out.')}${cond(mode, 'hintPics', 'Four key moments of one rep.')}${cond(mode, 'hintRm', 'Pictures shown because your phone is set to reduce motion.')}</p>
<p class="sr">${EXL.srText}</p>`;
}
const ARTBOARD_CSS = `${BASE_CSS}${EXL.css}`;

// ---------------------------------------------------------------------------
// Harness (index.html). The script is harness-only: it reads ?theme= ?t= ?zoom= ?mode=pictures
// (plus ?loop=1 and ?speed=0.5), writes the same root style and class strings the artboard's logic
// writes, and wires the buttons so the page can be tried by hand. The artboard never uses it.
const HARNESS_JS = `
const THEMES = ${JSON.stringify(THEMES)};
${themeVars.toString()}
${rigVars.toString()}
const REP = ${EXL.rep};
const q = new URLSearchParams(location.search);
const ZOOMS = { grip: 1, path: 2, pad: 3, 1: 1, 2: 2, 3: 3 };
let rm = false; try { rm = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
const tq = q.has('t') ? Math.min(1, Math.max(0, +q.get('t') || 0)) : null;
const S = { theme: q.get('theme') || 'silent-black', zoom: ZOOMS[q.get('zoom')] || 0, pics: rm || /^pic/.test(q.get('mode') || ''), loop: q.get('loop') === '1', speed: q.get('speed') === '0.5' ? 0.5 : 1, gen: 'a', t: tq, playing: tq === null && !rm, ended: false };
if (S.pics) S.playing = false;
const root = document.getElementById('player');
function vals() {
  const dur = REP / S.speed, anim = !S.pics, still = S.pics && S.zoom > 0;
  const play = S.playing && anim ? 'running' : 'paused', delay = S.t !== null && anim ? -S.t * dur : 0;
  return {
    rootStyle: 'width:358px;height:460px;box-sizing:border-box;' + themeVars(S.theme) + ';' + rigVars(S.theme) + ';--play:' + play + ';--dur:' + dur + 's;--iter:' + (S.loop ? 'infinite' : 3) + ';--sets:' + (S.loop ? 'infinite' : 1) + ';--delay:' + delay + 's',
    rootClass: 'player gen-' + S.gen + (S.zoom ? ' zoom-' + S.zoom : '') + (anim ? '' : ' pictures'),
    showSlow: anim && S.speed === 0.5, showIdle: anim && !S.playing && !S.ended && S.t === null, showEnded: anim && S.ended,
    showCaps: anim && !S.ended && (S.playing || S.t !== null), showStill1: still && S.zoom !== 2, showStill3: still && S.zoom === 2, showPicsLine: S.pics && !still, showTempo: anim || still,
    isPlay: !S.playing && !S.ended, isPause: S.playing, isReplay: S.ended, playLabel: S.ended ? 'Replay' : (S.playing ? 'Pause' : 'Play'), playDisabled: rm,
    z1: S.zoom === 1, z2: S.zoom === 2, z3: S.zoom === 3, speed1: S.speed === 1, speedHalf: S.speed === 0.5, modeAnim: anim, modePics: !anim, animDisabled: rm,
    hintAnim: !rm && anim, hintPics: !rm && !anim, hintRm: rm,
  };
}
const flip = () => { S.gen = S.gen === 'a' ? 'b' : 'a'; };
const ACT = {
  pick1: () => pick(1), pick2: () => pick(2), pick3: () => pick(3),
  togglePlay: () => { if (rm) return; if (S.pics) { S.pics = false; S.zoom = 0; flip(); S.playing = true; S.ended = false; S.t = null; }
    else if (S.ended) { flip(); S.playing = true; S.ended = false; S.t = null; } else if (S.playing) S.playing = false; else { S.playing = true; S.t = null; } bind(); },
  speedTo1: () => { if (S.speed !== 1) { S.speed = 1; flip(); S.ended = false; bind(); } }, speedToHalf: () => { if (S.speed !== 0.5) { S.speed = 0.5; flip(); S.ended = false; bind(); } },
  toAnim: () => { if (!rm && S.pics) { S.pics = false; S.zoom = 0; flip(); S.playing = false; S.ended = false; S.t = null; bind(); } },
  toPics: () => { if (!S.pics) { S.pics = true; S.zoom = 0; flip(); S.playing = false; S.ended = false; bind(); } },
};
function pick(n) { S.zoom = S.zoom === n ? 0 : n; if (S.pics) flip(); bind(); }
function bind() {
  const v = vals(), all = s => document.querySelectorAll(s);
  root.setAttribute('style', v.rootStyle); root.setAttribute('class', v.rootClass);
  all('[data-if]').forEach(el => { el.hidden = !v[el.dataset.if]; });
  all('[data-pressed]').forEach(el => el.setAttribute('aria-pressed', String(!!v[el.dataset.pressed])));
  all('[data-label]').forEach(el => el.setAttribute('aria-label', v[el.dataset.label]));
  all('[data-disabled]').forEach(el => { el.disabled = !!v[el.dataset.disabled]; });
  all('[data-click]').forEach(el => { el.onclick = ACT[el.dataset.click]; });
}
// bounded 3 reps: when the upper arm's animation ends (after --iter reps), the button becomes Replay
root.addEventListener('animationend', e => { if (e.target.classList.contains('lp-ua') && !e.target.closest('.pics') && !S.loop) { S.playing = false; S.ended = true; bind(); } });
bind(); window.__lp = { S, bind, vals };
document.getElementById('harness-note').textContent = 'Harness only: theme ' + S.theme + (S.t !== null ? ', frozen at t = ' + S.t : '') + (S.zoom ? ', zoom-' + S.zoom : '') + (S.pics ? ', pictures' : '') + '. Query: ?theme= &t= &zoom=1|2|3 &mode=pictures &loop=1 &speed=0.5';
`;
const defaultStyle = `width:358px;height:460px;box-sizing:border-box;${themeVars('silent-black')};${rigVars('silent-black')};--play:running;--dur:4s;--iter:3;--sets:1;--delay:0s`;
const harness = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=390">
<title>${EXL.title}</title>
<style>
/* Artboard: everything in this <style> goes into <helmet><style> (PLAYER.md piece A). */
${ARTBOARD_CSS}
</style>
<style>/* harness only */ body{padding:16px;background:#777}.harness-note{margin:10px 0 0;width:358px;font:12px/16px system-ui,sans-serif;color:#fff}</style>
</head>
<body>
<div class="player gen-a" id="player" style="${defaultStyle}">
${stageMarkup('h')}
${belowMarkup('h')}
</div>
<p class="harness-note" id="harness-note">Harness</p>
<script>
/* ===== harness only (the artboard uses its logic class instead) ===== */
${HARNESS_JS}
</script>
</body>
</html>
`;
const WRITE = !process.env.LP_NO_WRITE;   // LP_NO_WRITE=1: import the pieces without writing files (work/r3/dc-*.mjs)
if (WRITE) fs.writeFileSync(path.join(DIR, 'index.html'), harness);
if (WRITE) fs.writeFileSync(path.join(DIR, 'poses.json'), JSON.stringify({ latPulldown: { keyTable: lp.keyTable, truth: lp.truth, grips: GRIP_OPTIONS, drift: lp.drift, smoothness: lp.smoothness, smoothCheck: lp.smoothCheck, samples: SAMPLES, cableTravel: lp.cableTravel, geo: lp.geo, series: lp.series, picsAt: EXL.picsAt, chips: EXL.chips, tileBox: EXL.tileBox }, contrast: contrastTable() }, null, 1));
export { EXL, lp, ARTBOARD_CSS, stageMarkup, belowMarkup, tilesMarkup, SAMPLES, SIDE, LP_FIST, FACE, LP, makeLP, LP_OPT, extrasOf, smoothNumbers, smLine, progress as progressOf };
if (WRITE) console.log('smoothness check, as the page draws it (../smooth-check.cjs limits: a 1 %, b 8 %, c 3 x, d 4 deg):\n' + smLine(lp.smoothCheck));
if (WRITE) console.log(JSON.stringify({ truth: lp.truth, drift: lp.drift, X0: lp.geo.X0, Y0: lp.geo.Y0, zooms: lp.geo.zooms, grips: GRIP_OPTIONS.map(o => `Z${o.Z} x${o.times.toFixed(2)} top ${o.topElev.toFixed(1)} end ${o.endInside.toFixed(1)} minFu ${o.minFu.toFixed(2)}`), key: lp.keyTable.map(r => `p${r.p} S(${r.shoulder}) E(${r.elbow}) ua ${r.ua} fu ${r.fu} fa ${r.fa} ff ${r.ff} in ${r.inside} elev ${r.elev} beh ${r.behind} lift ${r.lift}`) }, null, 1));

// ---------------------------------------------------------------------------
// PLAYER.md: the drop-in pieces, written from the same source as index.html.
{
  const g = lp.geo, k = lp.keyTable, t = lp.truth, f = (v, d = 1) => Number(v).toFixed(d);
  const z = g.zooms;
  const rigVarsSrc = rigVars.toString();
  const checksFile = path.join(DIR, 'checks.txt'), measuredFile = path.join(DIR, 'measured.json');
  const checks = fs.existsSync(checksFile) ? fs.readFileSync(checksFile, 'utf8').trim() : 'run node shoot.cjs, then node gen.mjs again';
  const summary = checks.split('\n').pop();
  const face = fs.existsSync(measuredFile) ? JSON.parse(fs.readFileSync(measuredFile, 'utf8')).armOverFace : null;
  const lpSm = (fs.existsSync(measuredFile) && JSON.parse(fs.readFileSync(measuredFile, 'utf8')).r3) || { a025: NaN, a05: NaN };
  const pc = v => `${+(v * 100).toFixed(2)}`;
  const wins = w => (w && w.length ? w.map(x => `${pc(x[0])}-${pc(x[1])} %`).join(' and ') : 'never');
  const faceHead = face ? `${wins(face.head.win)} (${face.head.total.toFixed(2)} s of every 4 s rep)` : '(run node shoot.cjs, then node gen.mjs again)';
  const faceEdge = face ? `${wins(face.face.win)} of the rep (${face.face.total.toFixed(2)} s of every 4 s rep)` : '(run node shoot.cjs, then node gen.mjs again)';
  const G14 = GRIP_OPTIONS.find(o => o.Z === GRIP_Z), G39 = GRIP_OPTIONS.find(o => o.Z === 39);
  const kk = p => k.find(r => Number(r.p) === p);
  const mid = kk(0.5), top = kk(0), end = kk(1);
  const barTop = `(${f(g.X0)}, ${f(g.Y0)})`;
  const md = `# Lat Pulldown player: drop-in pieces for \`Player-LatPulldown.dc.html\`

Status: built on the final shared rig (\`../rig-final/RIG.md\`), same parts, paint, stroke widths, timing and restart method, including the figure detail of RIG.md section 20 (head, clothing, muscle facets, hands that wrap the bar, 3-tone token shading with a rim line, contact shadows, the target-muscle glow and the secondary-motion facets, equipment detail), so the three players share one look. QA round 3 fixes are in (section 0 maps each of the 9 issues to its fix and its proof; the round 2 table follows it). Checked in Chromium on 2026-09-27, result: **${summary}** (section 11). Decisions D1, D2 and D3 (section 9) are signed off, and spec.md section 3.2 carries them. Smoothness upgrade (\`../UPGRADE-BRIEF.md\`, smoothness target): minimum-jerk timing, a solved pose every ${LIFT_STEP} % of the rep in the pull and every 0.5 % in the return, and one fitted motion, so every drawn angle, the cable and the bar pass the numeric smoothness check (section 7). The canvas artboard \`../project/Player-LatPulldown.dc.html\` carries the same pieces (section 2). This file is generated by \`node gen.mjs\`, from the same source as \`index.html\`, so the pieces below are exactly what the harness shows.

## In plain words

- A side view of one person doing a lat pulldown: arms straight up overhead at the top, pull the bar down in front of the face to the top of the chest (1 s), squeeze (0.5 s), let it up slowly (2 s), short reset. It plays 3 reps and stops.
- Both hands hold one wide bar. The far arm is drawn behind the head and body in the dimmer "far side" colour. The cable now hangs from the pulley straight down onto the middle of the bar, between the two hands, and it is drawn in front of the far arm, so the bar clearly hangs from the cable, not from the far hand.
- The whole motion is smooth: every joint, the far arm, the bar and the cable start and stop without a jolt, speed up once and slow down once on the way down and again on the way up, and never change speed in steps (measured in the browser at 120 samples a second, section 7). Before, the elbows, the far arm and the cable started and stopped sharply.
- The bar is held in the near hand (it is part of the hand in the drawing), so it can never slip out of the hand. The end of the bar that points toward you always shows; before, it disappeared behind the chest at the bottom.
- The close-ups now show what holds the bar: the Grip and Path close-ups show the pulley, the whole cable and both hands; the Pad close-up shows the feet flat on the floor, above the caption that says "feet flat". The small front view in the Grip close-up shows the whole bar with its bent ends, as in the main picture.
- Words changed on purpose (section 9): the Path caption no longer says "straight", because the bar first moves forward above the head and the dashed line shows that curve. At the bottom the elbow is bent to about 35 degrees, not 65-75: with hands only a little wider than the shoulders and arms overhead at the top, that is what a real body does.

## 0. QA round 3: each issue, what changed, and the proof

| # | Issue | What changed | Proof |
|---|---|---|---|
| 1 | [Medium] The front cable is drawn before the far arm, so the far fist hides most of it and the bar seems to hang from the far fist | The front cable is drawn after the far arm, the far leg and the body, and under the guides and the near arm. The front pulley moved from x 152 to x ${g.PF.x}, straight above the cable hook at the top of the rep, so in the setup pose (the pose on screen longest) the cable hangs straight down onto the bar's middle, in the gap between the two fists, not over the far fist. | Check "front cable drawn over the far arm and the body": 0 of 39 points covered at any of 71 phases, including t 0-0.04 and 0.8-1.0 (QA r2: 22 of 39 on the far arm at t 0). Frames \`shots-r3/r3-hi-top-montage.png\` (t 0, 0.03, 0.06, 0.8, 0.84, 0.9), \`r3-tile1-4x.png\`, \`r3-dark-f00.png\`. |
| 2 | [Medium] The elbow jerks at the start of the pull and the end of the return (forearm 0.3, 6.0, 19.8, 14.9, 8.6 degrees per stop; drawn elbow 173.7 to 139.0 in 0.1 s) | Round 3 smoothed the elbow's bend direction and the bar's start and added stops where the arm is nearly straight. The smoothness upgrade (section 7) replaced all three with one fitted motion: minimum-jerk timing, the hand on one smooth curve that leaves the top forward and only a little down, the elbow's bend direction on one smooth curve, and a solved pose every ${LIFT_STEP} % of the rep in the pull and every 0.5 % in the return. | Check "smooth motion (analytic)": every joint (upper arm, forearm, far upper arm, far forearm, drawn elbow angle, elbow point, far elbow point, hand) speeds up once and slows down once in each phase; worst dip ${(lp.smoothness.worst * 100).toFixed(2)} % of the phase's top speed (limit 2 %). Smoothness check (a)-(d) in the browser: section 7. Check "smooth motion in the browser": the drawn arm read back at all ${SAMPLES.length} keyframe stops, worst dip under 2 %; drawn elbow ${f(lpSm.a025)} at t 0.025 and ${f(lpSm.a05)} at t 0.05. The fist or forearm over the head: ${faceHead}. Frames \`r3-hi-elbow-montage.png\` (t 0.02-0.05). |
| 3 | [Low-Medium] The near end of the bar hides behind the chest and neck at t 0.19-0.44, so the bar's visible length changes | The bar is drawn in the near hand group, in two layers: the whole bar and the hook under the fist (the fist wraps round it), and the near end, from the little-finger side of the hand out to its tip, over the fist. The near end is nearer the camera than the hand, the forearm and the chest, so nothing covers it. (Drawing it under the near arm, as QA suggested, would hide it behind the forearm at the bottom instead, because in this view the near end and the forearm point the same way there.) | Check "near end of the bar": its outer half shows at all 41 phases; its bent part is 100 % in view over the whole rep. Frames \`r3-hi-end-montage.png\` (t 0.125, 0.19, 0.25, 0.44). |
| 4 | [Low] The bar is not nested in the hand group, and section 9 did not list that | The bar now lives inside the near hand group (spec 2.4, RIG section 4) and counter-rotates by minus the sum of the arm's rotations, as the rig's dumbbells do, so it keeps its fixed look and the grip can never come apart. No longer a difference from the spec. | Checks "the lat bar is inside the near hand group" (2 of 2 bar layers) and "near hand on the bar": worst gap 0.000 over 201 phases. The far hand stays on the bar's far grip: ${lp.drift.far.toFixed(2)} analytic, under 0.5 in the browser. |
| 5 | [Open, spec] The build disagrees with spec.md 3.2 and spec.md is not edited | Decision D1 stands, checked again (section 9): with hands a little wider than the shoulders and the bar at the top of the chest, the shoulder-to-hand distance forces an elbow of about 35 degrees; the spec's own key-pose table gives 30.5. The About steps match the drawing (grip a little wider than the shoulders, sit with the arms straight, pull to the top of the chest, arms straight again at the top). New: D2 (Path caption) and D3 (Grip and Pad targets). The ready spec.md edit in section 9 now covers all three. | Signed off; spec.md section 3.2 carries D1-D3, and the four former DECIDED lines are ordinary checks now (section 11). |
| 6 | [Low] The Path caption says "straight down" but the dashed guide first curves ${f(g.XF - g.X0)} units forward above the head | Decision D2: the caption drops "straight": "${EXL.chips[1].caption}" Arms that start straight overhead must bring the bar forward above the head to pass in front of the face with a fixed lean, so the curve is right and the word was wrong. | Check "Path caption". Frames \`r3-zoom2-t*.png\`, \`r3-pics-zoom2.png\`. |
| 7 | [Low] Grip and Path close-ups at the setup pose (and the Grip still): the far arm pokes out of the top, the pulley is out of frame | Grip target ${g.zooms.Z1.cx}, ${g.zooms.Z1.cy}, ${g.zooms.Z1.s} (was 157, 127, 1.8); Path back on the spec's own 150, 112, 1.4 (was 152, 136, 1.6). Both hold the pulley, the whole cable and both hands; with the cable now in front, the bar is visibly tied to the machine. | Check "close-ups at the setup pose and their stills": pulley, cable and near fist inside the stage and above the bubble, far arm not out of the top, in the animation and in both stills. Check "Grip close-up over 41 phases": far arm inside the stage, far hand never under the inset. Frames \`r3-zoom-t0-montage.png\`, \`r3-pics-zoom-montage.png\`. |
| 8 | [Low] Pad close-up: "feet flat" but the feet sit under the bubble | Decision D3: Pad target ${g.zooms.Z3.cx}, ${g.zooms.Z3.cy}, ${g.zooms.Z3.s} (spec 192, 200, 2.2): the thigh pad, the arrow above it, the shins and the feet flat on the floor, all above the bubble. | Check "close-ups ...": feet bottom above the bubble top, in the animation and in the still. Frame \`r3-zoom3-t0.png\`. |
| 9 | [Low] The bar in the Grip front-view inset is short and straight; the scene's bar is 150 long with bent ends | The inset draws the same bar: 150 long, straight between +-48, both ends bent down 6, hands at +-36; the inset's view widened to show all of it. | Check "Grip inset bar matches the scene's bar". Frame \`r3-inset-4x.png\`. |

## 0b. QA round 2 (still in force)

| # | Issue | What changed |
|---|---|---|
| 1 | Start not "arms overhead, about 170"; shoulder moved 105.5 | Decision D1: grip a little wider than the shoulders, the hand straight above the raised shoulder at the top, elbow nearly straight; shoulder now moves ${f(t.topElev - t.endElev)}. |
| 2 | The bar did not read as a wide lat bar | The bar is drawn with the rig's slight view from the front and above, with its real length and bent ends, both hands on it, the far arm in far tones, the cable on its middle. |
| 3 | Copy and picture disagreed about grip width | Hands 72 apart (${f(t.gripTimes, 2)} times the outside shoulder width); the Grip close-up has a front-view inset with the thumbs in accent. |
| 4 | A solid blue line ran up from the fist beside the cable | The solid line shows the way still to go, from 16 below the grip to a target mark at the top of the chest. |
| 5 | Fist or forearm over the face about 1.28 s per rep | Fist or forearm over the head now ${faceHead}; the bar passes in front of the face at x 160-${g.XF}. |
| 6 | Weight-stack slivers at the edge of the close-ups | The whole stack hides in the Grip and Path close-ups and their stills. |
| 7 | Upper arm drawn at 0.499 of its length | Never below ${f(t.minFu, 2)} now. |
| 8 | Spec changes not written down | Section 9 lists every difference and the ready spec.md edit. |

## 1. Files

| File | What it is |
|---|---|
| \`index.html\` | The harness: the full 358 x 460 player, built exactly as the artboard (pieces A, B, C). Its small script is harness-only: \`?theme=<id>\`, \`?t=<0..1>\` (freeze rep 1 at that point), \`?zoom=1|2|3\` (or grip, path, pad), \`?mode=pictures\`, plus \`?loop=1\` and \`?speed=0.5\`. The buttons work too. |
| \`gen.mjs\` | The single source (rig-final \`gen.mjs\` lines 1-378 copied, changes marked \`LP:\`). Writes \`index.html\`, \`poses.json\` and this file. |
| \`shoot.cjs\` | Every check and the required screenshots in \`shots/\` (\`lp_*.png\`). Writes \`checks.txt\` and \`measured.json\`. Exit code 1 on any FAIL; 2 on any OPEN (a spec value not met that waits for a decision); 0 only when all pass. It runs the shared smoothness check \`../smooth-check.cjs\`. |
| \`fit-motion.mjs\` | Refits the motion (\`LP_OPT\` in \`gen.mjs\`) to the smoothness check with a margin, keeping the path's drawn-geometry checks (section 7). Run it only after a change to the path, the grip or the shoulder blades. |
| \`work/r3/frames.cjs\` | The QA round 3 verification frames in \`shots-r3/\` (\`r3-*.png\`), plus \`work/r3/dc-stage.cjs\`, which checks the canvas artboard against \`index.html\` and renders its own CSS and markup (section 2) into \`shots-r3/dc-*.png\`, and \`work/r3/indep.cjs\`, which re-measures every QA round 2 issue the way QA measured it, on the harness and on the artboard render (\`work/r3/indep-harness.json\`, \`work/r3/indep-dc.json\`). |
| \`measured.json\` | Numbers measured in the browser: when the arm passes over the head and the face, and the round 3 cable, bar-end and smoothness measures. |
| \`poses.json\` | Solved numbers: key poses, truth-table angles, the grip table, zoom targets, joint speeds per keyframe gap, drift between samples, contrast table. |
| \`quick.cjs\`, \`crop.cjs\`, \`work/\` | Viewing helpers and scratch images (\`work/r3/explore/\` holds the search that picked the round 3 motion settings). Not deliverables. |

## 2. Building the artboard

1. Skeleton per \`FORMAT-RULES.md\`: \`<title>Lat Pulldown form guide</title>\`, \`data-props\` from spec 2.1 (theme, autoplay, loop, \`$preview\` 358 x 460).
2. Piece A (below) goes whole into \`<helmet><style>\`.
3. The root: \`<div class="{{ rootClass }}" style="width: 358px; height: 460px; box-sizing: border-box; {{ rootStyle }}">\`, then piece B (the stage, with the Grip inset inside it), then piece C (caption line, chips, controls, hint).
4. The logic class: the same one as the Machine Chest Press player (the names in section 3; \`EX.rep = 4\`), plus \`THEMES\` and \`themeVars\` from spec 2.9 and this \`rigVars\`:

\`\`\`js
${rigVarsSrc}
\`\`\`

Nothing is built by script. The stage is plain markup; the root style string and the root class string drive all of it (animation, zoom, bubbles, the inset, Pictures, the Path still).

The canvas artboard \`../project/Player-LatPulldown.dc.html\` is built this way. Its stage is piece B exactly; its controls are piece C written with the canvas holes (\`sc-if\`, \`onClick\`, \`aria-pressed\`, \`disabled\`) in place of the harness's \`data-*\` attributes; its Lat Pulldown CSS (keyframes, origins, zoom targets, inset) is piece A's exactly, except the inset label's text size, which follows the canvas text scale. The only other differences are the canvas typography settings in the shared part of its style (Roboto first in the font stack, text sizes multiplied by \`--tz: .8\`, the Slow motion pill text in \`--text\`) and one logic choice (no tempo note beside a Pictures still). \`node work/r3/dc-stage.cjs\` checks this line by line against \`index.html\`, writes \`work/r3/dc-render.html\` (the artboard's own CSS and markup with its holes filled as the logic fills them), and \`work/r3/indep.cjs\` runs the round 3 measures on both pages.

## 3. What the logic must set

Root style string (\`rootStyle\`): \`themeVars(theme);rigVars(theme);--play:<running|paused>;--dur:<rep>s;--iter:<3|infinite>;--sets:<1|infinite>;--delay:0s\`.

| Variable | Value |
|---|---|
| \`--play\` | \`running\` while playing in Animation mode; \`paused\` otherwise (before the first Play, when paused, in Pictures) |
| \`--dur\` | one rep: \`4s\` at 1x, \`8s\` at 0.5x |
| \`--iter\` | \`3\` (bounded, inside About) or \`infinite\` (loop on, standalone canvas) |
| \`--sets\` | rep pill: \`1\` or \`infinite\`, the same choice as \`--iter\` |
| \`--delay\` | \`0s\`. (The harness uses a negative value for \`?t=\`. The Pictures tiles and the Path still set their own in CSS.) |

Root class string (\`rootClass\`): \`player gen-a\` or \`player gen-b\`, then \`zoom-1\`, \`zoom-2\` or \`zoom-3\` when a chip is on, then \`pictures\` in Pictures mode. Examples: \`player gen-b zoom-2\`, \`player gen-a pictures\`, \`player gen-b pictures zoom-2\` (the Path still).

Flip \`gen\` (a to b or back) on Replay, on a speed change, on a mode change, and on a chip tap in Pictures mode. Every animation name ends in \`-a\` or \`-b\`, so the flip restarts every animation from 0 %.

Values piece C reads from \`renderVals()\`: \`showSlow\`, \`showIdle\`, \`showEnded\`, \`showCaps\`, \`showStill1\`, \`showStill3\`, \`showPicsLine\`, \`showTempo\`, \`isPlay\`, \`isPause\`, \`isReplay\`, \`playLabel\`, \`playDisabled\`, \`z1\`, \`z2\`, \`z3\`, \`pick1\`, \`pick2\`, \`pick3\`, \`speed1\`, \`speedHalf\`, \`modeAnim\`, \`modePics\`, \`animDisabled\`, \`hintAnim\`, \`hintPics\`, \`hintRm\`, \`togglePlay\`, \`speedTo1\`, \`speedToHalf\`, \`toAnim\`, \`toPics\`. \`showCaps\` is for Animation mode only (playing or paused mid-set). A Pictures still (Pictures with a chip on) shows that picture's own caption instead, the same words as its tile: \`showStill1\` (Grip and Pad, pose 1) "Thighs under the pad, arms long", \`showStill3\` (Path, pose 3) "Bar to the top of your chest". Same pattern as the Machine Chest Press player.

With loop off, the logic's 200 ms timer ends playback after 3 x \`--dur\`: \`playing=false, ended=true\`, and the button becomes Replay. The figure then holds the 100 % frame, which equals the setup pose.

## 4. Phase captions (CSS only, in the caption line)

Four spans stacked in one grid cell; each is visible only inside its window. They use the figure's \`--dur\`, \`--play\`, \`--delay\` and \`gen\`, so they cannot drift from it.

| Span | Caption | % of rep | 1x | 0.5x | What the figure does |
|---|---|---|---|---|---|
| \`capx c1\` | ${EXL.caps[0]} | 0-25 | 0-1.0 s | 0-2.0 s | pull: the bar from above the head, in front of the face, to the top of the chest (mid pose at 12.5 %) |
| \`capx c2\` | ${EXL.caps[1]} | 25-37.5 | 1.0-1.5 s | 2.0-3.0 s | hold at the top of the chest |
| \`capx c3\` | ${EXL.caps[2]} | 37.5-87.5 | 1.5-3.5 s | 3.0-7.0 s | return (mid pose at 62.5 %) |
| \`capx c4\` | ${EXL.caps[3]} | 87.5-100 | 3.5-4.0 s | 7.0-8.0 s | reset pause, arms long overhead |

Easing (baked into the samples, rig section 8): each move (pull, return) follows the minimum-jerk profile p(x) = 10x^3 - 15x^4 + 6x^5, so speed and acceleration are zero at both ends and there is no kink mid-move (UPGRADE-BRIEF.md smoothness target 1). Tempo note: "${EXL.tempo}". Rep pill: "Rep 1 of 3" to "Rep 3 of 3", one step per rep. Pictures line: "${EXL.picsLine}". Hidden line for screen readers: "${EXL.srText}"

## 5. Zoom states (root classes)

| Class | Chip | Camera target cx, cy, scale | What lights up | Bubble caption |
|---|---|---|---|---|
| \`zoom-1\` | Grip | ${z.Z1.cx}, ${z.Z1.cy}, ${z.Z1.s} | accent ring r 12 around the near hand (inside the hand group, so it follows the hand), and the front-view inset (top right, 134 wide): both hands on the bar a little outside the shoulders, thumbs in accent | ${EXL.chips[0].caption} |
| \`zoom-2\` | Path | ${z.Z2.cx}, ${z.Z2.cy}, ${z.Z2.s} | the path guide, the "still to go" line and the target mark, drawn a second time over the arm, so the part in front of the face always shows | ${EXL.chips[1].caption} |
| \`zoom-3\` | Pad | ${z.Z3.cx}, ${z.Z3.cy}, ${z.Z3.s} | accent outline on the thigh pad and a down arrow above it | ${EXL.chips[2].caption} |

The camera moves with a 320 ms transition; the animation keeps running. While a chip is on, the rep pill and the "Side view" label hide and only that chip's bubble shows. In the Grip close-up the path guide, the "still to go" line and the target mark hide (they are the Path chip's subject). In the Grip and Path close-ups the weight stack hides (it would sit cut into slivers on the left edge). Each subject stays inside the stage and above the bubble for the whole rep, and the Grip ring and the far hand never go under the inset (measured at 41 phases, section 11). At the setup pose, and in the Grip and Path stills, the front pulley, the whole cable and the near fist are inside the stage and above the bubble and the far arm does not stick out of the top, so the close-up always shows what the bar hangs from (QA r3). The Pad close-up shows the feet flat on the floor above its bubble.

## 6. Pictures

- \`pictures\` on the root shows the 2 x 2 grid over the stage (rig section 12). Each tile draws the rig itself: \`<use href="#rig-lp">\` with \`--play:paused\`, \`--sw:.75\` and its own \`--delay\`, so the pictures always match the animation.
- Tile crop: \`viewBox="${EXL.tileBox.join(' ')}"\` (the whole machine top, so no pulley is cut in half, down to the feet; the raised arms and both hands fit at the top).

| Tile | Pose (% of rep) | Caption | Arrow |
|---|---|---|---|
| 1 | 0 | ${EXL.pics[0]} | none |
| 2 | ${pc(EXL.picsAt[1])} (spec) | ${EXL.pics[1]} | down, beside the bar |
| 3 | 31 | ${EXL.pics[2]} | none |
| 4 | 62.5 | ${EXL.pics[3]} | up |

- A chip in Pictures mode hides the grid and shows one still at that zoom: pose 1 for Grip and Pad, pose 3 (31 %) for Path. CSS sets \`--delay\` on \`.stage\` and \`.cap-row\` for \`.pictures.zoom-2\`, so the still needs nothing from the logic except the \`gen\` flip. The caption line under a still shows that picture's caption (\`showStill1\` / \`showStill3\`), not the phase caption of the frozen frame, so the Grip and Pad stills do not read "Pull to your chest, 1 s" under the arms-up setup pose.

## 7. Movement: spec truth table against this build

Camera: side view, lifter faces right. Hip (150, 206); torso leaned back 10 degrees and fixed (\`rotate(-10deg)\` about the hip, on the torso and on the arm layer); head, hips, legs and wrists fixed. Grip: each hand ${g.Z} out to the side from its shoulder joint (hands 72 apart, ${f(t.gripTimes, 2)} times the outside shoulder width of 60.4), constant because the bar is rigid.

| Joint | Spec 3.2 | This build | Result |
|---|---|---|---|
| Upper arm, top | arms overhead, about 170 | ${f(t.topElev)} from the torso line (real joint angle); the side view draws ${f(t.topElev2D)} | yes |
| Elbow inside angle, top | about 170, not locked | ${f(t.topInside)} | yes |
| Upper arm, end | down by the sides, slightly behind, about 20-30 | ${f(t.endElev)} from the torso line; ${f(t.endBehind)} behind the shoulder joint (the side view shows ${f(t.endBehind2D)} degrees behind the torso line; the spec's key-pose table has 30.5) | yes |
| Shoulder, change over the pull | about 140 | ${f(t.topElev - t.endElev)} | yes |
| Elbow inside angle, end | about 35 (30-45; decision D1, signed off) | ${f(t.endInside)} | yes |
| Shoulder blades | slightly raised at the top, pulled down and back first | shoulder joint 2.5 up (and 0.5 forward) at the top; 1.5 down and 1.5 back at the end, moving fastest at the start of the pull (share done 1 - (1 - p)^${LP.o.SK}: half by p = ${f(1 - 0.5 ** (1 / LP.o.SK), 2)}) | yes |
| Torso | 10 degrees back, no swing | fixed 10 | yes |
| Head, hips, knees under the pad, feet, wrists | fixed | fixed | yes |
| Bar | from just above the raised shoulder, forward above the head, down in front of the face to the top of the chest at (157, 150) (decision D1, signed off) | from ${barTop}, forward and down above the head, down in front of the face at x 160 to ${g.XF} (y ${g.YK} to ${g.YC}), onto the top of the chest at (${g.X1}, ${g.Y1}); stack 0 to ${f(t.liftEnd)} (half the ${f(lp.cableTravel)} the cable pays out) | yes |

Key poses (stage units; z = sideways, out from the shoulder joint toward the camera; angles in degrees; \`ua\` and \`fa\` are the keyframe rotations inside the leaned torso frame, unwrapped so they never spin the long way round):

| p | Shoulder | Grip (x, y, z) | Elbow (x, y, z) | ua | fu | fa | ff | Elbow inside | Upper arm from torso line | Bar down | Stack up |
|---|---|---|---|---|---|---|---|---|---|---|---|
${k.map(r => `| ${r.p} | ${r.shoulder.join(', ')} | ${r.grip.join(', ')} | ${r.elbow.join(', ')} | ${r.ua} | ${r.fu} | ${r.fa} | ${r.ff} | ${r.inside} | ${r.elev} | ${r.bar} | ${r.lift} |`).join('\n')}

How the arm is solved (rig section 9, the 3D pole-vector solve): shoulder S(p) with the shoulder-blade offsets, grip G(p) on the path above, upper arm 38, forearm 40. The top pose puts the hand 2 behind the raised shoulder joint and ${g.Z} out to the side, at the reach an elbow of ${f(t.topInside)} gives; there the slight elbow bend points out to the side and ${f(LP.o.B0 - 90)} degrees forward.

The smoothness check (\`../smooth-check.cjs\`, UPGRADE-BRIEF.md smoothness target 4) asks every drawn angle to change its acceleration evenly while the timing is minimum-jerk: at the keyframe stops, no change of acceleration may pass 3 times its median over the move. That holds only when each angle runs nearly in step with the progress p, with no sudden change of rate anywhere in the move. Round 3's motion was pieced together (a curve above the head, a straight drop at x 160, a curve onto the chest, the shoulder blades done by p = 0.35, a bend in the elbow direction's timing), and every joint changed rate at each seam (up to 15.6 x in the browser). So the motion is now described by smooth curves in p and fitted to the check (\`fit-motion.mjs\`, docs/COACHING-DECISIONS.md D-L1):

- the hand: x = X0 + a Bernstein curve through the offsets ${LP.o.PX.join(', ')}; y = Y0 + the shares ${LP.o.PV.join(', ')} of the drop to ${g.Y1} (degree 6). It leaves the top forward and only a little down: moving the hand straight toward the shoulder bends a nearly straight elbow in a sudden burst, and a forward move bends it gradually;
- the elbow's bend direction (the pole): one cubic Bernstein curve from the top direction through the directions (forward, out, down along the torso) ${LP.o.PC.map(v => `(${v.join(', ')})`).join(' and ')} to the chosen end elbow: ${f(t.endElev)} from the torso line, ${f(t.endBehind)} behind the shoulder joint;
- the shoulder blades: share done 1 - (1 - p)^${LP.o.SK};
- the elbow at the top: ${f(t.topInside)} ("about 170, not locked"; round 3's 174 made the first bend sharper).

The fit keeps a margin under every limit and keeps the drawn checks that the path's shape decides: the far fist never under the Grip close-up's inset, the face clear while the bar passes it, the fist and forearm clear of the head, tile 2's pose, the elbow closing steadily, the upper arm never drawn short.

Smoothness check, computed here from the stops as written (the browser reads the same numbers, section 11); a = speed over the first and last 1/120 s as a share of the top speed (limit 1 %), b = largest velocity step between samples 1/120 s apart (limit 8 %), c = largest change of acceleration between keyframe stops over its median (limit 3 x):

| Channel | Moves (deg) | Pull a | Pull b | Pull c | Return a | Return b | Return c |
|---|---|---|---|---|---|---|---|
${lp.smoothCheck.phases.lift.rows.map((r, i) => { const q = lp.smoothCheck.phases.return.rows[i], pp = v => (v * 100).toFixed(2) + ' %', cx = v => (v === null ? '-' : v.toFixed(2) + ' x'); return `| ${r.name} | ${r.travel === null ? '-' : f(r.travel)} | ${pp(r.a)} | ${pp(r.b)} | ${cx(r.c)} | ${pp(q.a)} | ${pp(q.b)} | ${cx(q.c)} |`; }).join('\n')}

(d) largest joint angle step between samples 1/120 s apart: ${lp.smoothCheck.d.v.toFixed(2)} degrees (${lp.smoothCheck.d.k}; limit 4). Before the upgrade (\`inOut\` easing, ${43} stops): pull a up to 35.7 %, b up to 80.7 %, c up to 15.6 x; return a up to 26.6 %, b up to 92.8 %, c up to 19.5 x.

Joint speed per keyframe gap, every 10th gap (degrees or units per 1.25 % of the rep, scaled from the ${LIFT_STEP} % and 0.5 % gaps), as the CSS plays it:

| Joint | Pull (0-25 %) | Return (37.5-87.5 %) |
|---|---|---|
${Object.keys(lp.smoothness.pull).map(k => `| ${({ ua: 'upper arm (lp-ua)', fa: 'forearm (lp-fa)', fua: 'far upper arm (lp-fua)', ffa: 'far forearm (lp-ffa)', elbowAngle: 'drawn elbow angle', elbow: 'elbow point', farElbow: 'far elbow point', hand: 'hand' })[k]} | ${lp.smoothness.pull[k].filter((v, i) => i % 10 === 9).map(v => v.toFixed(1)).join(' ')} | ${lp.smoothness.ret[k].filter((v, i) => i % 10 === 9).map(v => v.toFixed(1)).join(' ')} |`).join('\n')}

Each row rises once and falls once per phase (worst dip ${(lp.smoothness.worst * 100).toFixed(2)} %). Every keyframe stop is a pose solved at p(u); ${SAMPLES.length} stops per group (every ${LIFT_STEP} % in the 1 s pull and every 0.5 % in the 2 s return, so both moves have 100 steps; the hold and the pause only at their ends), written twice (\`-a\`, \`-b\`); angles and scales to 4 decimals, moves to 3 (2 decimals alone would break check (c)). Between stops (every value runs linearly): the far hand stays within ${lp.drift.far.toFixed(2)} of the bar's far grip, the cable's free end within ${lp.drift.cable.toFixed(2)} of the hook (the hook dot has radius 2.4, so the join never shows), and the drawn near hand within ${lp.drift.nearPath.toFixed(2)} of the solved path; the near hand holds the bar in its own group, so its gap is 0.

The far arm: the same arm on the far side, placed with the rig's depth view (each joint moves (0.25, -0.15) for every unit it is further from the camera, the view that puts the far leg at \`translate(5 -3)\` for its 20 units of hip width): far shoulder +44 units of depth, far elbow +2 x its distance from the centre line, far hand +72. It is keyframed with the same method (\`lp-fua\`, \`lp-ful\`, \`lp-ffa\`, \`lp-ffl\`, \`lp-fhd\`), painted in the far tones, and drawn behind the body, the cable and the bar, so the head, the torso and the cable cover it where they really would.

## 8. Scene layout (stage units, back to front)

- Floor x 16-342 at y 258. Base rail x 16-262, y 250-258.
- Weight stack (rig section 7): 10 plates 48 x 12 at x 16-64 from y 112.5; guide rods x 22 and 58 (y ${g.BEAM + 8}-250); each plate with a lighter top bevel; the pin in plate 7 (x 63-72, accent) with its knob (r 2.4 at x 69.8, clear of the upright); plates 1-7, the pin and the top bracket (x 35-45, y 106) lift together by half the cable travel, 0 to ${f(g.LIFT1, 2)}. Rear pulley r 7 at (47, ${g.REAR_TOP}) with a rim ring (r 4.6) and a hub; the rear cable runs down its left side at x 40 to the bracket and shortens as the stack rises. All of these are in \`.lp-stackset\`, which hides in the Grip and Path close-ups.
- Upright x 72-84, y ${g.BEAM}-250. Top beam x 16-178, y ${g.BEAM}-${g.BEAM + 8}, below the pill row (pills y 10-32). Front pulley r ${g.PF.r} at (${g.PF.x}, ${g.PF.y}) with a rim ring (r 3.2) and a hub (top at y ${f(g.PF.y - g.PF.r)}, below the pills), straight above the cable hook at the top of the rep. The run between the pulleys is inside the beam.
- Far leg (far tones) at \`translate(5 -3)\`.
- Far arm (far tones), section 7.
- Seat pad x 118-186, y 214-224, post x 150-159, with a stitched seam 2.1 inside its edge. Thigh-pad post x 188-196 (behind the near leg).
- Contact shadows (RIG.md section 20): under the feet on the floor (208, 258, rx 17) and under the thighs on the seat (160, 214.4, rx 26), outside \`.figure\`, so no figure box changes.
- Body (torso, neck and head leaned 10 degrees; seated leg as the chest press), painted in three passes (outline, rim, fill: RIG.md section 5) with the figure-detail parts of RIG.md section 20. Thigh pad roller x 180-204, y 184-198, rx 7, on top of the thigh, with a stitched seam.
- Path guide (dashed, the whole hand path) and the "still to go" line (solid accent; \`stroke-dashoffset\` = minus the path fraction already travelled, minus 16 units, so it starts 6 below the fist and shrinks as the bar comes down), plus the target mark: a 10-wide accent line across the path's end at (${g.X1}, ${g.Y1}).
- The front cable (\`lp-cable-f\`), drawn after the far arm, the far leg and the body (QA r3): it hangs on the bar's middle, which is nearer the camera than the far hand and in front of the face, so nothing but the near arm may cover it. One line from the pulley's bottom (${g.PF.x}, ${f(g.PF.y + g.PF.r)}) to the hook; it turns and stretches with the bar (\`rotate()\` and \`scaleY()\` about the pulley bottom, on the same samples).
- The near arm on top. The lat bar lives inside its hand group (\`lp-hd\`; spec 2.4, RIG section 4), so the grip can never come apart: \`lp-bar\` turns by \`rotate(-10 - ua - fa)\` about the grip (0, 16), minus the sum of the arm's rotations, as the rig's dumbbells do, so the bar keeps its fixed look on screen. Two layers: the whole bar and the hook under the fist fill (the fist wraps round the bar), and the near end, from the little-finger side of the hand (${HAND_HALF} nearer the camera than the grip) out to its tip, over the fist. The near end is nearer the camera than the hand, the forearm and the chest, so it always shows and the bar's visible length never changes. The bar: a 4-wide metal line, drawn with the depth view: 150 long, straight between +-48 of the centre line, ends bent down 6. Relative to the near grip: near end (${g.BAR_PTS[0].map(v => f(v, 2)).join(', ')}), bends at (${g.BAR_PTS[1].map(v => f(v, 2)).join(', ')}) and (${g.BAR_PTS[2].map(v => f(v, 2)).join(', ')}), far end (${g.BAR_PTS[3].map(v => f(v, 2)).join(', ')}); far hand at (${g.FAR_GRIP.map(v => f(v, 2)).join(', ')}); the cable hook (metal dot r 2.4) on the middle at (${g.BAR_MID.map(v => f(v, 2)).join(', ')}).
- Then \`.lp-over\`: the same guide, line and mark again, shown only in the Path close-up.
- Muscles: main Lats (effort cue 0.75 to 1.0 opacity, and the accent glow \`gw\` under it); helps Biceps and Mid back. This player's lats region runs down the back to the waist (section 9).
- Glow and secondary motion (RIG.md section 20): one channel \`lp-ten\` (\`opacity\` = the move progress p, \`-a\` / \`-b\` sets, no \`rotate()\`) runs the glow on the lats, so it rises through the pull, is strongest in the hold at the chest and fades on the way up, and two facets inside the torso: \`brace\` (the belly wall firming) and \`bladeEdge\` (the inner edge of the shoulder blade showing as the blades are pulled down and back). Here mid back and lats are painted as roles, so the facets are drawn over them (\`tenOver\`); on the rig they sit under unpainted regions. The joints do not move for it; the shoulder joint's own small drop and pull back (the spec's shoulder-blade row) is the \`lp-ua\` translate, as before.
- Hands: the rig's side hand (palm heel, thumb, four fingers over a dark backing) wraps the bar. The near hand is the rig's hand mirrored, so the thumb and index finger are on the inside of the grip (toward the far hand) and the little finger toward the near end of the bar; the far hand is the rig's hand as it is (its inside is toward the near hand). Grip texture: ribs (\`lp-grip\`, \`--metal-lo\` dashes on the bar line) on both bent ends, |z| 50 to 73, also in the Grip inset.

## 9. Differences from the spec, and why

| Spec 3.2 | Now | Why |
|---|---|---|
| Bar straight down at x 156, y 72 to 150; stack lift 0 to 39 | from ${barTop} forward and down above the head, down in front of the face at x 160 to ${g.XF}, onto (${g.X1}, ${g.Y1}); lift 0 to ${f(t.liftEnd)} | Decision D1 below: "about 170" at the top puts the hand about 78 above the raised shoulder (y ${f(g.Y0)}), a little behind x 156. x 160 or more in front of the face keeps the fist off the nose (QA r2 issue 5), and the path is one smooth curve so the motion passes the smoothness check (section 7); x ${g.X1} at the end puts the bar on the chest. The stack still rises half as far as the cable pays out. |
| Elbow at the end about 65-75 | ${f(t.endInside)} | Decision D1 below. |
| Key pose table (fu, ff from a 2D fit) | the 3D solve in section 7 | The spec's table was a 2D fit with the bar at (156, 72); it gives 148.4 at the top and 30.5 at the end. This build keeps its end (about 30) and meets the truth table's top instead. |
| Camera line: "a 44-unit bar seen slightly from the front" | the bar and the far arm drawn with the rig's own depth view (section 7); the drawn bar is 44 long, as the spec says | QA r2 issue 2: a bar drawn "from the front" on a true side view read as a stick out of the chest. |
| RIG section 7: "never a far arm or far hand" | the far arm and hand are drawn, in the far tones, behind the head and body | QA r2 issue 2 asked for the second hand. The rig's rule came from the chest press, where a far fist sat next to the near fist on a second handle and read as a second hand on the same handle; here the far hand is 21 units away on the same bar, where it belongs. This exception is for this player only. |
| RIG section 10: a progress line grows from the start to the hand | the solid line shows the way still to go, from 16 below the grip to a target mark at the top of the chest | QA r2 issue 4: a solid line running up from the fist beside the cable read as a second cable. The line still shows how far to pull and where to stop. |
| Front pulley (156, 26); rear pulley (78, 26); beam x 72-170, y 14-22; upright from y 14; stack x 28-72, y 120-246; rail x 28-260 | front pulley r ${g.PF.r} at (${g.PF.x}, ${g.PF.y}); rear pulley r 7 at (47, 47); beam x 16-178, y 36-44; upright from y 36; the rig's stack at x 16-64 from y 112.5; rail x 16-262 | The machine top must stay below the pill row (QA r1 issues 1-2); the rear cable must come straight down onto the stack, and the rig's plate size (48 x 12) clears the upright at x 72 only at x 16-64; the front pulley sits over the bar's middle and clears the far hand at the top of the rep. |
| Chip Grip 156, 111, 1.8 | ${z.Z1.cx}, ${z.Z1.cy}, ${z.Z1.s}, plus the front-view inset | Decision D3 below. QA r2 issue 3: the side view cannot show hand width or thumbs, hence the inset. |
| Chip Pad 192, 200, 2.2 | ${z.Z3.cx}, ${z.Z3.cy}, ${z.Z3.s} | Decision D3 below. |
| Path caption "The bar comes straight down in front of your face to the top of your chest." | "${EXL.chips[1].caption}" | Decision D2 below. |
| Stack pin always shown | the whole stack hides in the Grip and Path close-ups and their stills | QA r1 issue 5 and QA r2 issue 6: there it sat cut into slivers on the left edge. Same rule as the rig's far lever in the chest-press Grip zoom. |
| Slow motion pill: \`.chip-accent\` look (see-through \`--accent-soft\`) | accent tint laid over \`--surface-2\`, as the tile badge | QA r1 issue 1: nothing can show through its text. |
| Rig side-view lats region | this player only: the region runs on down the back to the waist | With the arm down by the side at the end of the pull, the rig's region was almost fully hidden at the moment the lats work hardest. |
| Pictures and zoom as class strings on the grid (\`pics on\`, \`pics zoomed\`) | root classes \`pictures\`, \`zoom-1\`..\`zoom-3\` | As asked for this build; the reduced-motion rule keys off the same root classes. |

Back to the spec (so no longer differences): the rig's side torso now has its own \`midBack\` region (the shoulder blade, painted only for roles), used here for the helper tint; the lat bar lives inside the near hand group (spec 2.4, RIG section 4; round 2 moved it with its own keyframes, and section 9 did not say so); the Path close-up target 150, 112, 1.4 (round 2 had 152, 136, 1.6); Pictures tile 2 at 12.5 % (the fist is ${face ? face.tile2Gap.toFixed(1) : '?'} clear of the face there and the elbow is in view under the bar); the Grip bubble text "Hands a little wider than your shoulders, thumbs around the bar."

### Decision D1 (decided by the builder, signed off): the arm angle at the top, and the grip width

In plain words: spec 3.2 asked for four things that cannot all be true at once in any drawing of a real body:

1. Arms about 170 degrees overhead at the top (truth table).
2. The elbow bent to 65-75 degrees at the bottom (truth table).
3. Hands "a little wider than your shoulders" (Grip bubble and About step 2).
4. The bar straight down at x 156 from y 72 (anchors), which with the lean puts the hand in front of the shoulder at the top.

What each grip gives, with the same rig, lean, shoulder blades and path method (hand straight above the raised shoulder at the top, the same path curve; computed by \`makeLP(Z)\` in \`gen.mjs\`):

| Hands apart (times the outside shoulder width) | Hand out from the shoulder joint | Arm at the top, from the torso line | Elbow at the bottom | Shoulder moves | Upper arm never drawn shorter than | Bar starts at y |
|---|---|---|---|---|---|---|
${GRIP_OPTIONS.map(o => `| ${f(o.times, 2)}${o.Z === GRIP_Z ? ' (built: "a little wider")' : o.Z === 39 ? ' (round-1 build)' : o.Z === 0 ? ' (hands straight above the shoulders)' : ''} | ${o.Z} | ${f(o.topElev)} | ${f(o.endInside)} | ${f(o.rom)} | ${f(o.minFu, 2)} | ${f(o.Y0)} |`).join('\n')}

A wider grip opens the elbow at the bottom toward 65-75, but tips the arms out to the side, so they cannot get overhead; no grip meets 1 and 2 together. With the bar at (156, 72), no grip reaches 170 at all.

Decision: keep what a beginner reads and sees, and what the lats need: the spec's grip words (3) and arms overhead at the top (1), with the shoulder moving about 140. Hands ${f(G14.times, 2)} times the outside shoulder width. The bottom elbow follows from that: ${f(G14.endInside)}, which is what spec 3.2's own key-pose table already gives (30.5). The round-1 wide grip (${f(G39.times, 2)} times) reached only ${f(G39.topElev)} at the top even with this path. Decided by the builder under the working rule "decide, don't ask" (AGENTS.md), because QA round 2 marked the open item as a failure. QA round 2 checked the geometry on its own and it holds: at the bottom the shoulder joint (${[].concat(end.shoulder).join(', ')}) is ${f(Math.hypot(g.X1 - Number([].concat(end.shoulder)[0]), g.Y1 - Number([].concat(end.shoulder)[1]), g.Z))} from the hand (${g.X1}, ${g.Y1}, ${g.Z} out), and a 38 upper arm with a 40 forearm can span that only with the elbow at about 35 degrees. Signed off; the table above shows the cost of each other grip.

Drawing, player words and About steps now say the same thing:

| What a beginner is told | Where | What the drawing does |
|---|---|---|
| "Hold the bar a little wider than your shoulders" | About step 2, Grip bubble | hands 72 apart, ${f(t.gripTimes, 2)} times the outside shoulder width; the Grip inset shows it from the front |
| "sit down with your arms straight" / "Arms long, reset" | About step 2, caption 4, Pictures 1 | elbow ${f(t.topInside)} (nearly straight), arms ${f(t.topElev2D)} degrees overhead on screen |
| "Lean back slightly" | About step 3 | torso fixed 10 degrees back |
| "pull the bar to the top of your chest, driving your elbows down" | About step 3, caption 1, Pictures 2 and 3 | bar onto the top of the chest at (${g.X1}, ${g.Y1}); elbows end down by the sides, ${f(t.endElev)} from the torso line, slightly behind |
| "The bar comes down in front of your face" | Path bubble (D2) | the fist passes in front of the face at x ${g.XF}; no arm part covers the face then |
| "Let the bar rise slowly until your arms are straight again" / "Up slowly, 2 s" | About step 4, caption 3, Pictures 4 | 2 s return to the same nearly straight arm |
| "Thigh pad snug on your thighs, feet flat" | About step 1, Pad bubble | thighs under the roller, feet flat, both in the Pad close-up above its bubble (D3) |

No player word or About step names the elbow angle, so the 35-degree end needs no copy change.

### Decision D2 (decided by the builder, signed off): the Path caption

Spec 3.2: "The bar comes straight down in front of your face to the top of your chest." Arms that start straight overhead, with a fixed lean, must bring the bar ${f(g.XF - g.X0)} units forward above the head before it can pass in front of the face; the dashed guide in the Path close-up shows that curve, so a beginner would see a curve while reading "straight". Now: "${EXL.chips[1].caption}" In front of the face the bar runs nearly straight down (x 160 to ${g.XF}), and the words no longer claim more.

### Decision D3 (decided by the builder, signed off): the Grip and Pad close-up targets

- Grip: spec 156, 111, 1.8; now ${z.Z1.cx}, ${z.Z1.cy}, ${z.Z1.s}. The hand travels 84 units, so at 1.8 no camera spot holds the setup pose's pulley and far arm and the chest pose's ring at once: at the setup pose (the pose shown longest: before Play, after the 3 reps, and in the Grip still) the pulley and the top of the far arm were cut off, so the bar had no visible link to the machine (QA r2). At ${z.Z1.s} the pulley, the whole cable and both fists show at the setup pose, and the ring stays inside the stage, above the bubble and left of the inset for the whole rep.
- Pad: spec 192, 200, 2.2; now ${z.Z3.cx}, ${z.Z3.cy}, ${z.Z3.s}. At the spec's target the feet sat under the bubble that says "feet flat" (QA r2: feet bottom 265.6, bubble 210-264). Now the thigh pad, the arrow above it, the shins and the feet flat on the floor all show above the bubble.
- Path: back on the spec's own 150, 112, 1.4.

### Spec edit to apply to spec.md section 3.2 (ready to paste)

Applied to \`../spec.md\` section 3.2 (items 1-7 below, word for word; D1-D3 signed off; items 3 and 5 applied again after the smoothness upgrade moved the path and the key poses). The lines replaced in section 3.2:

1. Camera line, last sentence. Old: "The bar is drawn as a 44-unit bar seen slightly from the front so it reads as a bar, not a dot." New: "The bar is drawn with the rig's slight view from the front and above (the view of the far leg: 0.25 across and 0.15 up for every unit of depth), 44 units long on screen, with both hands on it; the far arm is drawn in the far tones behind the head and body, for this player only (an exception to RIG section 7)."
2. Equipment line. New: "base rail x 16-262, y 250-258; upright x 72-84, y 36-250; top beam x 16-178, y 36-44; front pulley r 5.2 at (${g.PF.x}, 39.2); rear pulley r 7 at (47, 47); cable bar middle -> front pulley -> beam -> rear pulley -> stack bracket; weight stack: the rig's 10 plates 48 x 12 at x 16-64 from y 112.5, pin at plate 7; seat pad x 118-186, y 214-224 on a post; thigh pad roller x 180-204, y 184-198 (radius 7) on a post; lat bar 150 long (ends bent down 6 over the last 27), hands 72 apart, the cable on its middle."
3. Anchors line, last two sentences. Old: "Bar straight down at x 156: y 72 → 150. Stack lift 0 → 39." New: "Grip ${g.Z} out from each shoulder joint (hands 72 apart, about 1.2 times the outside shoulder width). Bar (grip centre) from (${f(g.X0)}, ${f(g.Y0)}), just above the raised shoulder, forward and down above the head, down in front of the face at x 160 to ${g.XF} (y ${g.YK} to ${g.YC}), onto the top of the chest at (${g.X1}, ${g.Y1}), along one smooth curve. Stack lift 0 → ${f(t.liftEnd)} (half the cable travel)."
4. Truth table, Elbow row. Old: "| Elbow (inside angle) | about 170 degrees (not locked) | about 65-75 degrees | about 100 degrees | moves |". New: "| Elbow (inside angle) | about 170 degrees (not locked) | about 35 degrees (30-45) | about 140 degrees | moves |".
5. Key-pose table: replace with (bar = grip centre; angles are the solved 3D values; the keyframe values are in the player's poses.json):

   | % | Bar (x, y) | Upper arm from torso line | Elbow inside | fu | ff | Stack lift |
   |---|---|---|---|---|---|---|
   | 0, 87.5, 100 | ${top.grip[0]}, ${top.grip[1]} | ${top.elev} | ${top.inside} | ${top.fu} | ${top.ff} | 0 |
   | 12.5, 62.5 | ${mid.grip[0]}, ${mid.grip[1]} | ${mid.elev} | ${mid.inside} | ${mid.fu} | ${mid.ff} | ${mid.lift} |
   | 25, 37.5 | ${end.grip[0]}, ${end.grip[1]} | ${end.elev} | ${end.inside} | ${end.fu} | ${end.ff} | ${end.lift} |

6. Chip table. Grip row: "| Grip | ${z.Z1.cx}, ${z.Z1.cy}, ${z.Z1.s} | Hands a little wider than your shoulders, thumbs around the bar. |" and add under the table: "The Grip close-up also shows a small front view of both hands on the bar (thumbs in accent), because the side view cannot show hand width." Path row: "| Path | ${z.Z2.cx}, ${z.Z2.cy}, ${z.Z2.s} | ${EXL.chips[1].caption} |" (D2). Pad row: "| Pad | ${z.Z3.cx}, ${z.Z3.cy}, ${z.Z3.s} | Thigh pad snug on your thighs, feet flat. It stops you lifting off. |" (D3).
7. Add one line after the chip table: "Path cue for this player: the solid accent line shows the way still to go (from just below the hands to a target mark at the top of the chest), not the way already travelled (an exception to RIG section 10, because the hands hang from a cable)."

Captions, Pictures captions, tile times (0, 12.5, 31, 62.5 %), the Info block and the About steps stay as they are: this build matches them (see the table under D1).

## 10. Risks and how they are handled

| Risk | Handling |
|---|---|
| The motion is fitted to the smoothness check, so a later change to the path, the grip, the shoulder blades or the far arm can break it | \`shoot.cjs\` runs the check on every build and fails on it; \`node fit-motion.mjs\` refits \`LP_OPT\` for the new geometry with the same limits (and a margin) and the same drawn-geometry constraints. |
| The far arm is new to the rig (RIG section 7 said never) and could clutter the face | It is drawn in the far tones and behind the head and body, so it never covers the face; at 2x zoom the far hand is 21 units away on the same bar, where a second hand belongs. If the supervisor prefers the rig rule, deleting \`.far-arm\` leaves a correct bar without the far hand (QA r2 issue 2 would then return). |
| The upper arm crosses the face ${faceEdge} | Measured by \`shoot.cjs\` (any near-arm part over the face's front edge, 401 phases). It happens only while the bar is above the head, as the arms come down from overhead or go back up. While the bar passes the face, the face is always clear (0 of those phases); the fist or forearm over the head: ${faceHead} (round 1: 1.28 s). Avoiding it completely would need the elbow to swing straight at the camera, which draws the upper arm short (QA r2 issue 7). |
| The bar moves forward about ${f(g.XF - g.X0)} units above the head before it comes down in front of the face | That is where arms that start straight overhead must bring the bar to pass in front of the face with a fixed lean. The Path caption no longer says "straight" (D2), so the words match the curved dashed guide. |
| The arm is nearly straight at the top, where a hand move toward the shoulder bends the elbow in a sudden burst | The hand leaves the top forward and only a little down, and the top elbow is ${f(t.topInside)}, so the elbow starts to bend gradually. The near and the far arm now start and settle with the smoothness check's (a) at ${(Math.max(...['lift', 'return'].flatMap(ph => lp.smoothCheck.phases[ph].rows.filter(r => /^lp-f/.test(r.name)).map(r => r.a))) * 100).toFixed(2)} % of the top speed at most (limit 1 %); round 3's late settle of the far forearm is gone. |
| At the bottom the near end of the bar lies over the near forearm | In this view the near end and the forearm point the same way there. The near end is nearer the camera than the forearm, so drawing it on top is right; drawing it under the arm (QA r2's suggestion) would hide it behind the forearm there and bring back the changing bar length. |
| The hand-to-bar gap between baked samples is ${lp.drift.far.toFixed(2)} (round 1: 0.31) | Below the 0.5 limit analytically and in the browser (section 11); the fist is 12 wide, so it does not show. More samples would add page size for no visible gain. |
| Someone edits a keyframe by hand and a hand leaves the bar | Change \`gen.mjs\` and rebuild; \`shoot.cjs\` fails when either hand's gap passes 0.5 or an angle leaves its range. |
| Pictures 2 and 3 both show the bar low | Tile 2 (12.5 %) has the bar near the forehead with the elbows under it and a down arrow; tile 3 (31 %) has it on the chest. |
| Page size about ${Math.round(fs.statSync(path.join(DIR, 'index.html')).size / 1000)} KB, because every keyframe set is written twice and the far arm has its own | Generated, never typed; the real app plays the same samples with the Web Animations API. |

## 11. Checks run (\`node shoot.cjs\`, Chromium)

\`\`\`
__CHECKS__
\`\`\`

Screenshots (\`shots/\`, captured at 2x, all viewed): the required set from \`shoot.cjs\` (\`lp_*.png\`: the 8 frames of one rep in Silent Black, Paper t 0 and 0.5, slow motion, each zoom state plus Grip and Path at t 0.25, Pictures in Silent Black and Paper, the Path still, reduced motion, Ember, Emerald and Midnight at t 0.19) and the QA round 2 set from \`work/frames.cjs\` (\`r2-*.png\`: 16 frames of one rep, the Grip and Path close-ups at t 0, 0.0625, 0.125, 0.1875, 0.25 and 0.625, the Pad close-up, Pictures in both themes, the Grip and Path stills, Paper at 4 moments, Ember, Emerald and Midnight at t 0.125, slow motion, the whole player at t 0).

## Piece A: \`<helmet><style>\` (complete)

\`\`\`css
${ARTBOARD_CSS.trim()}
\`\`\`

## Piece B: the stage (first child of the root)

\`\`\`html
${stageMarkup('dc')}
\`\`\`

## Piece C: caption line, chips, controls and hint (after the stage)

\`\`\`html
${belowMarkup('dc')}
\`\`\`
`;
  if (WRITE) fs.writeFileSync(path.join(DIR, 'PLAYER.md'), md.replace('__CHECKS__', checks));
}
