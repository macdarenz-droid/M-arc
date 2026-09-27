// gen.mjs: the FINAL shared rig. One source for every number, shape and keyframe.
// Writes chest-press.html, lateral-raise.html, parts.html, poses.json, and the generated
// block at the end of RIG.md.   Run: node gen.mjs   (no network, no dependencies)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const rad = d => (d * Math.PI) / 180;
const deg = r => (r * 180) / Math.PI;
const n2 = v => { const s = (Math.round(v * 100) / 100).toString(); return s === '-0' ? '0' : s; };
const n3 = v => { const s = (Math.round(v * 1000) / 1000).toString(); return s === '-0' ? '0' : s; };
// keyframe values: angles and scales to 1e-4, so rounding never adds a kink the smoothness check (c) would see
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
  return `--fg-line:color-mix(in srgb,var(--text) ${light ? 70 : 60}%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) ${light ? 56 : 38}%,var(--surface-1));--lit:var(${light ? '--bg' : '--text'});--shd:var(${light ? '--text' : '--bg'});--hi:${light ? 76 : 90}%;--lo:${light ? 84 : 78}%;--eq-hi:${light ? 40 : 82}%;--rim-k:${light ? 35 : 62}%`;
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
      { poly: [[7.38, -8.4], [5.2, -7.4], [2.8, -6], [-1, -5.2], [-4.4, -3.6], [-1.6, -2.8], [2, -3.6], [5.8, -3.4], [6.8, -5.6]], tone: 'hi', name: 'forehead' },
      { poly: [[-3.4, -1.8], [-0.6, -3.2], [1.6, -0.8], [1.4, 3.2], [-0.4, 5.4], [-2.8, 3.8]], tone: 'hi', name: 'ear' },
      { poly: [[-2.4, -0.6], [-0.6, -1.6], [0.4, 0], [0.2, 2.6], [-0.8, 3.8], [-2.2, 2.6]], tone: 'lo', name: 'earInner' },
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
      { poly: [[-3.4, -56.4], [1.4, -56], [0.8, -48.6], [-1.8, -47.4]], tone: 'lo', name: 'armpit' },
      { poly: [[-2.6, -42], [-4.8, -30], [-3.2, -29.6], [-0.8, -41]], tone: 'hi', name: 'latFold' },
      { poly: [[12.7, -38.6], [12.2, -35.6], [7, -36.2], [8.4, -38.2]], tone: 'lo', name: 'underChest' },
      { poly: [[11.4, -33.8], [10.2, -26], [9.8, -14], [10.5, -7], [5.8, -7.4], [5.6, -24], [6.6, -36.4]], muscle: 'abs' },
      { poly: [[5.6, -24], [5.8, -7.4], [-4, -8.2], [-4.8, -19], [-0.4, -27]], muscle: 'obliques' },
      // the pec as a fan: its fibres converge back toward the armpit, its top edge tucked under the front delt
      { poly: [[9.4, -64.4], [12.8, -61.2], [15.3, -52], [8, -50.2], [3.6, -52], [1.4, -56], [4.6, -61.4]], tone: 'hi', muscle: 'chest' },
      { poly: [[15.3, -52], [14.7, -44], [12.7, -38.6], [8.4, -38.2], [3.6, -42], [0.8, -48.6], [3.6, -52], [8, -50.2]], tone: 'hi', muscle: 'chest' },
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
  elbowCap: { base: ngon(0, -24, 4.8), regions: [{ poly: [[2.6, -27.2], [4.4, -24], [2.6, -20.8], [1.6, -24]], tone: 'lo', name: 'elbowCrease' }] },
  forearm: {
    base: tr([[-4.8, -1], [5, -1], [6.4, 4.5], [6.2, 10], [4.9, 21], [4, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 0, -24),
    regions: [
      { poly: tr([[0.6, -1], [5, -1], [6.4, 4.5], [6.2, 10], [4.9, 21], [4, 31], [0.8, 31]], 0, -24), tone: 'hi', muscle: 'forearms' },
      { poly: tr([[-4.8, -1], [-2.6, -1], [-2.2, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 0, -24), tone: 'lo', name: 'forearmUnder' },
    ],
  },
  // Hand round a vertical handle, seen from the back of the hand. In the hand's frame +x is up (thumb side) and
  // +y points forward along the forearm; the handle runs along x through the grip centre (0, 16).
  fist: {
    base: tr([[-3.7, -9.6], [3.7, -9.6], [5.6, -6.8], [7.2, -3], [7.3, 0.6], [6.2, 3.6], [4.8, 5.2], [2.2, 5.8], [-0.6, 5.8], [-3.2, 5.5], [-5.2, 4.6], [-6, 1.6], [-5.8, -3.6], [-4.8, -7]], 0, 16),
    regions: [
      { poly: [[-3.7, -9.6], [-4.8, -7], [-5.8, -3.6], [-4.6, -3.2], [-3.4, -8.6]], tone: 'lo', name: 'palmHeel' },
      { poly: [[3.3, -0.2], [3.3, 2.6], [4.6, 4.4], [3.4, 5.4], [2.2, 5.8], [-0.6, 5.8], [-3.2, 5.5], [-5.2, 4.6], [-6, 1.6], [-5.9, -0.4]], tone: 'lo', name: 'fingerGaps' },
      { poly: [[0.9, -0.2], [3.1, -0.4], [3.3, 2.6], [2.9, 4.9], [1.5, 5.5], [0.8, 2.8]], tone: 'hi', name: 'finger1' },
      { poly: [[-1.5, -0.2], [0.5, -0.2], [0.4, 2.8], [0.3, 5.6], [-1.3, 5.7], [-1.7, 2.8]], tone: 'hi', name: 'finger2' },
      { poly: [[-3.8, -0.2], [-1.9, -0.2], [-2, 2.8], [-2.1, 5.6], [-3.5, 5.4], [-4, 2.8]], tone: 'hi', name: 'finger3' },
      { poly: [[-5.9, -0.2], [-4.2, -0.2], [-4.4, 2.8], [-4.4, 5.2], [-5.3, 4.6], [-6, 1.6]], tone: 'hi', name: 'finger4' },
      // the thumb: a lit wedge along the top of the hand that crosses the handle and ends in front of it, over finger 1
      { poly: [[1.5, -8.6], [3.6, -6.4], [4.4, -2.6], [4, 2.2], [5.2, 3.6], [4.6, 4.4], [3.2, 2.6], [3.4, -2.6], [2.6, -6], [0.8, -7.9]], tone: 'lo', name: 'thumbCrease' },
      { poly: [[3.2, -9.4], [5.6, -6.8], [7.2, -3], [7.3, 0.6], [6.6, 2.6], [5.2, 3.6], [4, 2.2], [4.4, -2.6], [3.6, -6.4], [1.8, -8.4]], tone: 'hi', name: 'thumb' },
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
      { poly: sym([[0, -8.8], [4.6, -8.2], [7.6, -6.8], [8.7, -4.4], [6.4, -3.2], [0, -3.6]]), tone: 'hi', name: 'forehead' },
      ...both({ poly: [[9.7, -3.8], [11.1, -3.9], [11.9, -1.4], [11.3, 2.4], [9.5, 3.6], [9.3, 0]], tone: 'hi', name: 'ear' }),
      ...both({ poly: [[10.2, -2.6], [11.2, -1.6], [10.9, 1.6], [9.9, 2.2], [9.6, -0.4]], tone: 'lo', name: 'earInner' }),
      ...both({ poly: [[6.4, -2.6], [9.3, -3.2], [9.3, 0], [9.5, 3.6], [8.3, 6], [5.4, 9.4], [4.6, 5.6]], tone: 'lo', name: 'cheek' }),
      { poly: [[0.2, -1.4], [1.5, 3.2], [0.1, 4.1]], tone: 'lo', name: 'nose' },
    ].map(r => ({ ...r, poly: tr(r.poly, 0, -83) })),
  },
  torso: {
    cloth: 'tee',
    base: sym([[0, -65.8], [3.4, -67], [6.2, -71.2], [11.6, -69], [17.2, -66.2], [21, -62.6], [20.2, -52], [16.6, -38], [14, -26], [15, -14], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5]]),
    regions: [
      { poly: sym([[0, -7], [16.05, -7], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5]]), cloth: 'shorts', name: 'shorts' },
      { poly: sym([[0, -5.6], [12.6, -5.6], [13.2, -1.6], [12, 3.6], [5.4, 9.2], [0, 10.2]]), cloth: 'shorts', tone: 'hi', name: 'shortsFront' },
      { poly: [[-0.45, -5.6], [0.45, -5.6], [0.35, 8.2], [-0.35, 8.2]], cloth: 'shorts', tone: 'lo', name: 'fly' },
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
      ...both({ poly: [[7.4, -67.6], [13, -63.4], [20.4, -62.4], [20.2, -61], [13, -61.5], [7, -66]], tone: 'lo', ten: true, name: 'collarbone' }),
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
  elbowCapR: { base: ngon(22, -24, 4.8), regions: [{ poly: tr([[-2.6, -27.2], [-4.4, -24], [-2.6, -20.8], [-1.6, -24]], 22, 0), tone: 'lo', name: 'elbowCrease' }] },
  forearmR: {
    base: tr([[-4.8, -1], [5, -1], [6.2, 5], [6, 11], [4.8, 22], [4, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 22, -24),
    regions: [
      { poly: tr([[0.6, -1], [5, -1], [6.2, 5], [6, 11], [4.8, 22], [4, 31], [0.9, 31]], 22, -24), tone: 'hi', muscle: 'forearms' },
      { poly: tr([[-4.8, -1], [-2.8, -1], [-2.2, 31], [-4, 31], [-4.5, 18], [-4.9, 7]], 22, -24), tone: 'lo', name: 'forearmInner' },
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
      { poly: tr([[-5.4, -4], [5.6, -4], [6.4, 10], [6.1, 20], [5.3, 34.1], [-5.3, 34.5], [-5.8, 20], [-5.6, 10]], 10, 0), cloth: 'shorts', tone: 'hi', muscle: 'quads' },
      { poly: tr([[5.6, -4], [8, -4], [8.4, 10], [8, 20], [6.95, 34], [5.3, 34.1], [6.1, 20], [6.4, 10]], 10, 0), cloth: 'shorts', tone: 'lo', name: 'thighOuter' },
      { poly: tr([[-3.6, 34.5], [4, 34.3], [4.6, 44], [2.4, 48.2], [-1, 48.6], [-3.4, 43]], 10, 0), tone: 'hi', muscle: 'quads' },
      { poly: tr([[6.95, 34], [-7.3, 34.6], [-7.34, 33.2], [7.05, 32.6]], 10, 0), cloth: 'shorts', tone: 'lo', name: 'shortsHem' },
    ],
  },
  kneeCapR: { base: ngon(10, 50, 5.8), regions: [{ poly: half(10, 50, 5.8, 270), tone: 'hi', name: 'patella' }] },
  shinR: {
    base: tr([[-5.5, 49], [5.5, 49], [6.9, 60], [6.4, 68], [5.2, 78], [4, 94], [-4, 94], [-5, 78], [-6.4, 68], [-6.9, 60]], 10, 0),
    regions: [
      ...[1, -1].map(s => ({ poly: tr([[5.5, 49], [6.9, 60], [6.4, 68], [5.2, 78], [4, 94], [2.8, 92], [3.6, 74], [3.6, 56]].map(([x, y]) => [x * s, y]), 10, 0), tone: 'lo', muscle: 'calves' })),
    ],
  },
  footR: {
    cloth: 'shoe',
    base: tr([[-4.5, 92.4], [4.5, 92.4], [7.2, 96.6], [8, 99.4], [7.6, 102], [-6.6, 102], [-7.2, 99.4], [-6.4, 96.4]], 10, 0),
    regions: [
      { poly: tr([[-4.5, 92.4], [4.5, 92.4], [5, 93.6], [-4.8, 93.6]], 10, 0), tone: 'lo', name: 'collar' },
      { poly: tr([[-4.4, 96], [4.8, 96], [7, 98.4], [7.3, 100.4], [-6.4, 100.4], [-6.6, 98.4]], 10, 0), tone: 'hi', name: 'toeCap' },
      { poly: tr([[-7, 100.4], [7.8, 100.4], [7.6, 102], [-6.6, 102]], 10, 0), cloth: 'sole', name: 'sole' },
    ],
  },
};
const mirPart = p => ({ ...p, base: mir(p.base), regions: (p.regions || []).map(r => ({ ...r, poly: mir(r.poly) })) });

// TOP view (camera above a SEATED or STANDING lifter): origin = midpoint between the
// shoulder joints, lifter faces -y (up the screen). A LYING lifter seen from above is
// the front view (the camera sees the front of the body), so it reuses FR.
const TOP = {
  joints: { shoulderR: [22, 0], elbowR: [22, 38], gripR: [22, 78], head: [0, -2] },
  torso: {
    cloth: 'tee',
    base: [[-10, -12], [10, -12], [21, -8.5], [27, -1.5], [26, 6], [20, 11], [8, 13.5], [-8, 13.5], [-20, 11], [-26, 6], [-27, -1.5], [-21, -8.5]],
    regions: [
      { poly: [[6, -7], [19, -6], [23, -1], [9, 3]], muscle: 'upperTraps' },
      { poly: mir([[6, -7], [19, -6], [23, -1], [9, 3]]), muscle: 'upperTraps' },
      { poly: [[0, 2], [9, 3], [20, 11], [8, 13.5], [0, 13.5]], tone: 'lo', muscle: 'midBack' },
      { poly: mir([[0, 2], [9, 3], [20, 11], [8, 13.5], [0, 13.5]]), tone: 'lo', muscle: 'midBack' },
    ],
  },
  head: {
    cloth: 'hair',
    base: [[0, -12], [5, -11], [8.5, -7.5], [10, -2], [8.5, 4], [4.5, 7.5], [0, 8.5], [-4.5, 7.5], [-8.5, 4], [-10, -2], [-8.5, -7.5], [-5, -11]],
    regions: [{ poly: [[-2.2, -11.6], [0, -15], [2.2, -11.6]], cloth: 'skin', name: 'nose' }, { poly: [[-8.5, 4], [-4.5, 7.5], [0, 8.5], [4.5, 7.5], [8.5, 4], [0, 1]], tone: 'hi', name: 'crown' }],
  },
  deltoidR: {
    cloth: 'tee',
    base: tr([[-5, -6], [0, -8.5], [6, -7], [8.5, -1], [7.5, 6], [3, 9], [-3, 8], [-6, 2]], 22, 0),
    regions: [
      { poly: tr([[-5, -6], [0, -8.5], [6, -7], [8.5, -1], [1, 0]], 22, 0), tone: 'hi', muscle: 'frontDelts' },
      { poly: tr([[8.5, -1], [7.5, 6], [3, 9], [-3, 8], [1, 0]], 22, 0), muscle: 'rearDelts' },
    ],
  },
  // arms seen from above = the front-view arm parts moved so the shoulder joint is at (22, 0)
  upperArmR: trPart(FR.upperArmR, 0, 62),
  elbowCapR: trPart(FR.elbowCapR, 0, 62),
  forearmR: trPart(FR.forearmR, 0, 62),
  fistR: trPart(FR.fistR, 0, 62),
};

// ---------------------------------------------------------------------------
// Painting. Every body LAYER is drawn in three passes inside the same groups:
//   1) outline pass: each part's polygon with a 3-unit stroke in --fg-line (class olk)
//   2) rim pass: the same polygons with a 1.1-unit --rim stroke (class rim), so a thin lighter line runs just
//      inside the dark outline on the layer's silhouette
//   3) fill pass: each part's base fill, its tone facets, then glow and muscles
// The fills hide the inner half of every stroke, so only the layer's silhouette keeps its outline and rim,
// and no seam shows where parts overlap (shoulder, elbow, hip, knee). An arm (upper and lower) is one layer.
const CLOTH = { skin: 'b', tee: 't', shorts: 'p', shoe: 's', sole: 'so', hair: 'hr' };
const FAR_CLOTH = { skin: 'bf', tee: 'bf', shorts: 'pf', shoe: 'sf', sole: 'sf', hair: 'bf' };
const toneCls = (cloth, tone) => CLOTH[cloth] + (tone === 'hi' ? 'h' : tone === 'lo' ? 'l' : '');
let clipSeq = 0;   // clipPath ids for the glow, stable across builds
function fillPart(p, roles = {}, opt = {}) {
  const cloth = p.cloth || 'skin';
  if (opt.far) return `<polygon class="${FAR_CLOTH[cloth]}" points="${pts(p.base)}"/>` + (p.regions || []).filter(r => r.far).map(r => `<polygon class="${FAR_CLOTH[r.cloth || cloth]}" points="${pts(r.poly)}"/>`).join('');
  let s = `<polygon class="${toneCls(cloth, null)}" points="${pts(p.base)}"/>`, glow = '', mus = '', hotHelp = '', hotMain = '';
  // opt.tap: the exercise's muscle table (spec 2.10). A role polygon then carries a class hole (cls<Id>, so the tapped
  // region gets .sel) and an invisible hotspot copy with the button semantics and a 30 px halo, painted last in this
  // part, the target's after the helpers' (30 px wide, or 44 px minus the region's shortest side for a thin region, so every
  // hit box is at least 44 px). A halo must never take a tap meant for a neighbouring muscle's own fill, so a
  // stroke-less core copy of every region is collected into opt.cores[opt.coreKey] and painted by the exercise after all
  // halos (in a repeated joint chain, or the static figure group at the end of the scene): a tap on a muscle's visible
  // fill always wins; the halo only claims the empty space around it (D-R7).
  const hole = (m, cls) => { if (!m) return `class="${cls}"`; m.cls = cls; return `class="${cls}" data-class="cls${m.Id}"`; };
  const hot = (m, poly) => { if (opt.cores) { const k = opt.coreKey || 'body'; opt.cores[k] = opt.cores[k] || { help: '', main: '' }; opt.cores[k][m.role] += `<polygon class="hot hot-core" data-muscle="${m.region}" data-hot="${m.index}" points="${pts(poly)}"/>`; }
    // the halo is 30 px, or wider for a thin region, so the hit box is at least 44 px on its short side at 1x
    const xs = poly.map(q => q[0]), ys = poly.map(q => q[1]), thin = Math.min(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)), halo = Math.max(30, Math.ceil(44 - thin));
    return `<polygon class="hot"${halo > 30 ? ` style="stroke-width:${halo}px"` : ''} role="button" tabindex="0" aria-label="${m.common}, ${m.role === 'main' ? 'target muscle' : 'helps'}" data-muscle="${m.region}" data-hot="${m.index}" points="${pts(poly)}"/>`; };
  for (const r of p.regions || []) {
    const role = r.muscle && roles[r.muscle], m = opt.tap && role ? opt.tap.find(x => x.region === r.muscle) : null;
    if (role === 'main') { mus += `<polygon ${hole(m, `mm anim ${opt.effort || ''}`.trim())} points="${pts(r.poly)}"/>`; if (opt.glow) glow += `<polygon class="gw anim ${opt.glow}" points="${pts(r.poly)}"/>`; if (m) hotMain += hot(m, r.poly); }
    else if (role === 'help') { mus += `<polygon ${hole(m, `mh${opt.helpFade ? ` anim ${opt.helpFade}` : ''}`)} points="${pts(r.poly)}"/>`; if (m) hotHelp += hot(m, r.poly); }
    else if (r.ten) { if (opt.ten) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone)} tn anim ${opt.ten}" points="${pts(r.poly)}"/>`; }
    else if (r.tone || r.cloth) s += `<polygon class="${toneCls(r.cloth || cloth, r.tone)}" points="${pts(r.poly)}"/>`;
    else if (r.facet) s += `<polygon class="fc" points="${pts(r.poly)}"/>`;
  }
  // the glow halo is clipped to the part's own silhouette, so it never spills past the outline as a fringe
  if (glow) { const id = `${opt.glow}-clip${clipSeq++}`; glow = `<clipPath id="${id}"><polygon points="${pts(p.base)}"/></clipPath><g clip-path="url(#${id})">${glow}</g>`; }
  return s + glow + mus + hotHelp + hotMain;
}
const olPart = (p, far) => `<polygon class="${far ? 'olkf' : 'olk'}" points="${pts(p.base)}"/>`;
const rimPart = p => `<polygon class="rim" points="${pts(p.base)}"/>`;
// Muscle info on tap (spec 2.10): the exercise's table of tappable muscles. Its roles must be exactly the rig's roles map
// (asserted here at build time), every line ends with a full stop, and the ids get their camel-case form for the holes.
function muscleTable(list, roles, label) {
  const want = JSON.stringify(Object.entries(roles).sort()), got = JSON.stringify(list.map(m => [m.region, m.role]).sort());
  if (want !== got) throw new Error(`${label}: muscle table roles ${got} differ from the rig's roles ${want}`);
  for (const m of list) { if (!m.common || !m.anatomical || !/\.$/.test(m.line)) throw new Error(`${label}: bad muscle line for ${m.region}`); }
  return list.map((m, index) => ({ ...m, index, Id: m.id[0].toUpperCase() + m.id.slice(1) }));
}
const muscleText = m => `${m.common} (${m.anatomical}), ${m.role === 'main' ? 'target' : 'helps'}. ${m.line}`;
// the core copies collected for one chain, helpers first, the target last
const cores = (c, k) => (c[k] ? c[k].help + c[k].main : '');
// pass-aware helper: P(part) returns the outline, rim or fill markup for the current pass
const passer = (pass, roles, opt = {}) => p => (pass === 'ol' ? olPart(p, opt.far) : pass === 'rim' ? (opt.far ? '' : rimPart(p)) : fillPart(p, roles, opt));
// all three passes of one layer, in order
const layer = f => f('ol') + f('rim') + f('fill');
// an arm is ONE layer: the lower arm's outline and rim are drawn inside the upper arm's passes (the joint chain is
// repeated per pass), so no outline arc crosses the arm at the elbow; wrap(markup, pass) nests the lower arm's chain
const armLayer = (up, lo, wrap) => ['ol', 'rim', 'fill'].map(pass => up(pass) + wrap(lo(pass), pass)).join('');

// ---------------------------------------------------------------------------
// Timing (spec 2.5): 4 s rep; lift 0-25 %, hold to 37.5 %, return to 87.5 %, pause to 100 %.
// Each move follows the minimum-jerk profile p(x) = 10x^3 - 15x^4 + 6x^5: speed and acceleration are zero at
// both ends of every move and there is no kink mid-move (UPGRADE-BRIEF.md, smoothness target 1).
const minJerk = x => x * x * x * (10 + x * (-15 + 6 * x));
function progress(u) { // u = fraction of one rep -> p (0 setup .. 1 end pose)
  if (u <= 0.25) return minJerk(u / 0.25);
  if (u <= 0.375) return 1;
  if (u <= 0.875) return 1 - minJerk((u - 0.375) / 0.5);
  return 0;
}
// A solved pose every 0.25 % of the rep in the 1 s lift and every 0.5 % in the 2 s return (the same 0.01 s between stops
// at 1x); the holds need only their boundary stops (UPGRADE-BRIEF.md smoothness target 2 and its fallback; D-R1).
const SAMPLES = [];
for (let i = 0; i <= 100; i++) SAMPLES.push(i * 0.25);
for (let i = 0; i <= 100; i++) SAMPLES.push(37.5 + i * 0.5);
SAMPLES.push(100);

// Hand-path pace (used by the chest press). A pose solved from a hand place s (0 setup .. 1 end) along a path
// makes each joint angle a curve f(s). Where f bends sharply (the elbow opens fastest per unit of hand travel
// near the pressed end), s = p would give the angles a jerk spike at the end of each move (smoothness check (c)
// 4.3-4.9 x). pace(PACE, p) maps the min-jerk progress p to the place s: a monotone Bernstein polynomial whose
// control points are the running sums of the PACE weights. The hand still starts and stops with zero speed and
// acceleration; it only eases into the end pose a little earlier. `PACE_FIT=1 node gen.mjs` refits the weights
// for the current geometry (fitPace) and prints them; the build itself always uses the stored weights.
const binom = (n, k) => { let r = 1; for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i; return r; };
function pace(w, p) {
  const n = w.length, tot = w.reduce((a, b) => a + b, 0);
  let c = 0, s = 0;
  for (let k = 1; k <= n; k++) { c += w[k - 1] / tot; s += c * binom(n, k) * p ** k * (1 - p) ** (n - k); }
  return s;
}
// The smoothness numbers the shoot.cjs check measures (smooth-check.cjs), computed here from the solved poses:
// stops rounded as written (n4), drawn linearly between stops, sampled every 1/480 of the rep.
function smoothNumbers(at, angles, grip) { // at(u) -> pose at rep fraction u; angles: keys; grip: pose -> [x, y]
  const st = SAMPLES.map(pc => ({ u: pc / 100, q: at(pc / 100) }));
  const val = (k, q) => (k === 'grip' ? grip(q).map(v => +n4(v)) : [+n4(q[k])]);
  const lerp = (k, u) => { let i = 0; while (i < st.length - 2 && st[i + 1].u < u) i++; const t = (u - st[i].u) / (st[i + 1].u - st[i].u), a = val(k, st[i].q), b = val(k, st[i + 1].q); return a.map((v, j) => v + (b[j] - v) * t); };
  let b = 0, c = 0, a = 0;
  for (const [u0, u1] of [[0, 0.25], [0.375, 0.875]]) {
    for (const k of [...angles, 'grip']) {
      const smp = []; for (let i = Math.round(u0 * 480); i <= Math.round(u1 * 480); i++) smp.push(lerp(k, i / 480));
      const vel = smp.slice(1).map((v, i) => v.map((x, j) => (x - smp[i][j]) * 120));
      const mag = v => Math.hypot(...v), peak = Math.max(...vel.map(mag));
      a = Math.max(a, mag(vel[0]) / peak, mag(vel[vel.length - 1]) / peak);
      for (let i = 1; i < vel.length; i++) b = Math.max(b, mag(vel[i].map((x, j) => x - vel[i - 1][j])) / peak);
      if (k === 'grip') continue;
      const s = st.filter(x => x.u >= u0 - 1e-9 && x.u <= u1 + 1e-9).map(x => [x.u * 4, val(k, x.q)[0]]);
      const vv = [], tm = []; for (let i = 1; i < s.length; i++) { vv.push((s[i][1] - s[i - 1][1]) / (s[i][0] - s[i - 1][0])); tm.push((s[i][0] + s[i - 1][0]) / 2); }
      const acc = []; for (let i = 1; i < vv.length; i++) acc.push((vv[i] - vv[i - 1]) / (tm[i] - tm[i - 1]));
      const jk = []; for (let i = 1; i < acc.length; i++) jk.push(Math.abs(acc[i] - acc[i - 1]));
      const srt = [...jk].sort((x, y) => x - y), med = srt.length % 2 ? srt[(srt.length - 1) / 2] : (srt[srt.length / 2 - 1] + srt[srt.length / 2]) / 2;
      c = Math.max(c, Math.max(...jk) / med);
    }
  }
  return { a, b, c };
}
// Seeded random search over the PACE weights: minimise the worse of (b) / 8 % and (c) / 3 x (edge speed (a) kept
// under 0.8 %). Deterministic for a given geometry.
function fitPace(poseAt, angles, grip, n = 7, seeds = [3, 11], iters = 3600) {
  let best = null;
  for (const seed of seeds) {
    let r = seed; const rand = () => (r = (r * 16807) % 2147483647) / 2147483647;
    const score = w => { const m = smoothNumbers(u => poseAt(pace(w, progress(u))), angles, grip); return { w, m, u: Math.max(m.c / 3, m.b / 0.08) + 5 * Math.max(0, m.a - 0.008) }; };
    let cur = score(Array(n).fill(1)), step = 0.35;
    for (let i = 0; i < iters; i++) {
      const cand = score(cur.w.map(x => Math.max(0.02, x * Math.exp((rand() - 0.5) * 2 * step))));
      if (cand.u < cur.u) cur = cand;
      if (i % 600 === 599) step *= 0.7;
    }
    if (!best || cur.u < best.u) best = cur;
  }
  return best;
}

// Soft contact shadow: three stacked low-opacity ellipses in --scrim (no SVG filter), centred on the contact.
const shadow = (cx, cy, rx, ry) => `<g class="shadow">${[1, 0.72, 0.44].map(k => `<ellipse class="shd" cx="${n2(cx)}" cy="${n2(cy)}" rx="${n2(rx * k)}" ry="${n2(ry * k)}"/>`).join('')}</g>`;

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
body{margin:0;font-family:Roboto,Inter,"SF Pro Text",system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}
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
  --shorts:color-mix(in srgb,var(--body) 70%,var(--text));
  --shorts-hi:color-mix(in srgb,var(--shorts) var(--hi),var(--lit));
  --shorts-lo:color-mix(in srgb,var(--shorts) var(--lo),var(--shd));
  --shorts-far:color-mix(in srgb,var(--shorts) 45%,var(--surface-1));
  --shoe:color-mix(in srgb,var(--body) 50%,var(--shd));
  --shoe-hi:color-mix(in srgb,var(--shoe) var(--hi),var(--lit));
  --shoe-lo:color-mix(in srgb,var(--shoe) var(--lo),var(--shd));
  --shoe-far:color-mix(in srgb,var(--shoe) 45%,var(--surface-1));
  --sole:color-mix(in srgb,var(--body) 45%,var(--lit));
  --hair:color-mix(in srgb,var(--body) 50%,var(--shd));
  --hair-hi:color-mix(in srgb,var(--hair) 68%,var(--lit));
  --rim:color-mix(in srgb,var(--body) var(--rim-k),var(--lit));
  --equip-hi:color-mix(in srgb,var(--equip) var(--eq-hi),var(--lit));
  --equip-lo:color-mix(in srgb,var(--equip) var(--lo),var(--shd));
  --metal-lo:color-mix(in srgb,var(--fg-metal) 64%,var(--surface-1));
  --seam:color-mix(in srgb,var(--fg-frame) 70%,var(--equip));
  position:relative;width:358px;height:460px;box-sizing:border-box;display:flex;flex-direction:column;gap:8px;
  background:var(--surface-2);color:var(--text);font-family:Roboto,Inter,"SF Pro Text",system-ui,-apple-system,"Segoe UI",sans-serif}
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
.bubble .bt{min-width:0}.bubble b{font-weight:600}
.pics{position:absolute;inset:1px;display:none;padding:6px;gap:6px;grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(2,128px);background:var(--surface-1);border-radius:var(--radius-lg)}
.pics.on{display:grid}
.tile{position:relative;display:flex;flex-direction:column;background:var(--surface-2);border-radius:var(--radius-md);overflow:hidden}
.tile svg{display:block;width:169px;height:90px;flex:none}
.tile p{margin:0;padding:0 8px 6px;font-size:12px;line-height:16px;color:var(--text-2);overflow:hidden;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.badge{position:absolute;top:6px;left:6px;width:18px;height:18px;border-radius:50%;background:linear-gradient(var(--accent-soft),var(--accent-soft)),var(--surface-2);box-shadow:0 0 0 2px var(--surface-2);color:var(--accent);font-size:11px;line-height:18px;font-weight:700;text-align:center}
.cap-row{flex:none;display:flex;align-items:baseline;justify-content:space-between;gap:8px;height:20px}
.cap{font-size:15px;line-height:20px;font-weight:600;color:var(--text);white-space:nowrap;min-width:0;overflow:hidden;text-overflow:ellipsis}
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
.shd{fill:var(--border);fill-opacity:.6}
.olk{fill:none;stroke:var(--fg-line);stroke-width:calc(var(--sw) * 3px);stroke-linejoin:round}
.olkf{fill:none;stroke:var(--fg-line-far);stroke-width:calc(var(--sw) * 2.4px);stroke-linejoin:round}
.fc{fill:var(--body-facet);stroke:var(--map-line);stroke-width:.6px;stroke-linejoin:round}
.mm{fill:var(--muscle-main);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}
.mh{fill:var(--muscle-help);stroke:color-mix(in srgb,var(--text) 35%,transparent);stroke-width:.6px;stroke-linejoin:round}
.mm.sel,.mh.sel{stroke:var(--text);stroke-width:calc(var(--sw) * 1.5px)}
/* muscle hotspots (spec 2.10): an invisible copy of the region with a 30 px non-scaling stroke, so every tap target is at least 44 px */
.hot{fill:transparent;stroke:transparent;stroke-width:30px;stroke-linejoin:round;pointer-events:all;cursor:pointer}
.hot-core{stroke:none;stroke-width:0}
.pics .hot{pointer-events:none}
/* ---- equipment paint ---- */
.eq{fill:var(--equip);stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.eqm{fill:var(--equip);stroke:var(--fg-metal);stroke-width:calc(var(--sw) * 1.2px);stroke-linejoin:round}
.eqf{fill:var(--body-far);stroke:var(--fg-line-far);stroke-width:calc(var(--sw) * 1.1px);stroke-linejoin:round}
.hd{fill:var(--fg-metal)}
.eqs{fill:var(--equip)}.eqh{fill:var(--equip-hi)}.eql{fill:var(--equip-lo)}
.knurl{fill:none;stroke:var(--metal-lo);stroke-width:calc(var(--sw) * .6px)}
.seam{fill:none;stroke:var(--seam);stroke-width:calc(var(--sw) * .7px);stroke-dasharray:1.6 1.2}
.prim{fill:none;stroke:var(--fg-metal);stroke-width:calc(var(--sw) * .7px)}
.hdf{fill:var(--fg-line-far)}
.pin{fill:var(--accent)}
.rod{fill:none;stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px)}
.cable{fill:none;stroke:var(--fg-cable);stroke-width:calc(var(--sw) * 1.25px);stroke-linecap:round}
.floor{stroke:var(--border);stroke-width:1px}
.b,.bf,.olk,.olkf,.rim,.fc,.mm,.mh,.hot,.eq,.eqm,.eqf,.rod,.cable,.floor,.knurl,.seam,.prim{vector-effect:non-scaling-stroke}
/* ---- guides: path, progress trail, zoom overlays, arrows (accent) ---- */
.guide{fill:none;stroke:var(--accent);stroke-width:1.5;stroke-dasharray:4 3;opacity:.6}
.trail{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-dasharray:1 1}
.ov{opacity:0;transition:opacity 150ms linear}
.ovs{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arrow{fill:none;stroke:var(--accent);stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.arrow-head{fill:var(--accent)}
.arrow-lg{stroke-width:3}
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
  .pics:not(.zoomed){display:grid!important}
  .cam,.ov{transition:none!important}
  .pill-row{display:none!important}
}
`;

// ---------------------------------------------------------------------------
// The logic class. In the artboard this is the <script type="text/x-dc"> block, pasted
// as is (plus THEMES, themeVars, rigVars, EX). In the harness a 25-line stand-in for
// DCLogic writes renderVals() into the page through data-* markers (see HARNESS_BOOT).
const on = v => v === true || v === 'true' || v === 'yes';
class DCLogic { constructor(props) { this.props = props; } }   // node-side placeholder; never emitted
class Component extends DCLogic {
  constructor(props) {
    super(props);
    let rm = false;
    try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { rm = false; }
    const auto = on(props.autoplay) && !rm;
    this.state = { playing: auto, started: auto, ended: false, speed: 1, mode: rm ? 'pics' : 'anim', bubble: null, gen: 'a', elapsed: 0, rm: rm, freeze: null };
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
    if (s.mode !== 'anim') { this.setState({ mode: 'anim', bubble: null, gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false, freeze: null }, () => this.startClock()); return; }
    if (s.ended) { this.setState({ gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false, freeze: null }, () => this.startClock()); return; }
    if (s.playing) { this.stopClock(); this.setState({ playing: false }); return; }
    this.setState({ playing: true, started: true, freeze: null }, () => this.startClock());
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
    this.setState({ mode: m, bubble: null, gen: this.flip(), elapsed: 0, playing: false, started: false, ended: false, freeze: null });
  }
  // The bubble state is one of { kind: 'zoom', id } (a zoom chip), { kind: 'muscle', id } (a tapped muscle) or null: a
  // zoom and a muscle bubble never show together (spec 2.10).
  pickZoom(id) {
    const s = this.state, z = s.bubble && s.bubble.kind === 'zoom' && s.bubble.id === id ? null : { kind: 'zoom', id: id };
    this.setState(s.mode === 'pics' ? { bubble: z, gen: this.flip() } : { bubble: z });
  }
  tapMuscle(id, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    this.tapAt = Date.now();
    const s = this.state;
    if (s.mode !== 'anim') return;
    this.setState({ bubble: s.bubble && s.bubble.kind === 'muscle' && s.bubble.id === id ? null : { kind: 'muscle', id: id } });
  }
  keyMuscle(id, e) {
    if (e && e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    if (e && e.preventDefault) e.preventDefault();
    this.tapMuscle(id, e);
  }
  tapStage(e) {   // a tap on the stage background closes a muscle bubble (never a zoom; the hotspot's own tap wins)
    if (Date.now() - (this.tapAt || 0) < 80) return;
    if (e && e.target && e.target.closest && e.target.closest('.bubble')) return;
    const s = this.state;
    if (s.bubble && s.bubble.kind === 'muscle') this.setState({ bubble: null });
  }
  renderVals() {
    const s = this.state, p = this.props, loop = on(p.loop), dur = this.repDur();
    const zoom = s.bubble && s.bubble.kind === 'zoom' ? s.bubble.id : null;
    const anim = s.mode === 'anim';
    const mus = anim && s.bubble && s.bubble.kind === 'muscle' ? EX.muscles.find(m => m.id === s.bubble.id) : null;
    const still = s.mode === 'pics' && !!zoom;
    let play = s.playing && s.mode === 'anim' ? 'running' : 'paused', delay = 0;
    if (still) delay = -(zoom === EX.pathChip ? EX.picsAt[2] : EX.picsAt[0]) * dur;
    if (s.freeze !== null) { play = 'paused'; delay = -s.freeze * dur; }
    const chip = EX.chips.find(c => c.id === zoom);
    const out = {};
    for (const m of EX.muscles) {   // per muscle: its class hole (cls<Id>, .sel while tapped) and its tap and key handlers (tap<Id>, key<Id>)
      out['cls' + m.Id] = m.cls + (mus && mus.id === m.id ? ' sel' : '');
      out['tap' + m.Id] = e => this.tapMuscle(m.id, e);
      out['key' + m.Id] = e => this.keyMuscle(m.id, e);
    }
    return Object.assign(out, {
      rootStyle: `${themeVars(p.theme)};${rigVars(p.theme)};--play:${play};--dur:${dur}s;--iter:${loop ? 'infinite' : 3};--sets:${loop ? 'infinite' : 1};--delay:${delay}s`,
      rootClass: `player gen-${s.gen}`,
      camClass: `cam zoom-${zoom}`,
      picsClass: zoom ? 'pics zoomed' : (s.mode === 'pics' ? 'pics on' : 'pics'),
      showRepPill: anim && !chip,                 // a zoom view shows only the scene and its bubble
      showSlow: anim && s.speed === 0.5,
      showCamLabel: anim && !chip,
      showBubble: !!chip || !!mus,
      bubbleDotStyle: 'background:var(' + (mus ? (mus.role === 'main' ? '--muscle-main' : '--muscle-help') : '--accent') + ')',
      bubbleName: mus ? mus.common : '',
      bubbleRest: mus ? '(' + mus.anatomical + '), ' + (mus.role === 'main' ? 'target' : 'helps') + '. ' + mus.line : (chip ? chip.caption : ''),
      bubbleText: mus ? mus.common + ' (' + mus.anatomical + '), ' + (mus.role === 'main' ? 'target' : 'helps') + '. ' + mus.line : (chip ? chip.caption : ''),
      showIdle: anim && !s.started && !s.ended && s.freeze === null,
      showEnded: anim && s.ended,
      showCaps: (anim && (s.started || s.freeze !== null) && !s.ended) || still,
      showPicsLine: s.mode === 'pics' && !still,
      showTempo: anim || still,
      isPlay: !s.playing && !s.ended, isPause: s.playing, isReplay: s.ended,
      playLabel: s.ended ? 'Replay' : (s.playing ? 'Pause' : 'Play'),
      playDisabled: s.rm,
      speed1: s.speed === 1, speedHalf: s.speed === 0.5,
      modeAnim: anim, modePics: !anim, animDisabled: s.rm,
      hint: s.rm ? 'Pictures shown because your phone is set to reduce motion.' : (anim ? 'Tap a zoom chip to look closer. Tap it again to zoom out.' : 'Four key moments of one rep.'),
      chips: EX.chips.map(c => ({ id: c.id, label: c.label, pressed: zoom === c.id, pick: () => this.pickZoom(c.id) })),
      hots: EX.muscles.map(m => ({ id: m.id, tap: out['tap' + m.Id], key: out['key' + m.Id] })),
      tapStage: e => this.tapStage(e),
      togglePlay: () => this.togglePlay(),
      speedTo1: () => this.setSpeed(1), speedToHalf: () => this.setSpeed(0.5),
      toAnim: () => this.setMode('anim'), toPics: () => this.setMode('pics'),
    });
  }
}

// Harness-only stand-in for x-dc (not part of the artboard).
const HARNESS_STUB = `class DCLogic { constructor(props) { this.props = props; } setState(u, cb) { Object.assign(this.state, typeof u === 'function' ? u(this.state) : u); bind(this); if (cb) cb(); } forceUpdate() { bind(this); } }`;
const HARNESS_BOOT = `
function bind(c) {
  const v = c.renderVals(), all = s => document.querySelectorAll(s);
  all('[data-style]').forEach(el => el.setAttribute('style', v[el.dataset.style]));
  all('[data-class]').forEach(el => el.setAttribute('class', v[el.dataset.class]));
  all('[data-if]').forEach(el => { el.hidden = !v[el.dataset.if]; });
  all('[data-text]').forEach(el => { el.textContent = v[el.dataset.text]; });
  all('[data-pressed]').forEach(el => el.setAttribute('aria-pressed', String(!!v[el.dataset.pressed])));
  all('[data-label]').forEach(el => el.setAttribute('aria-label', v[el.dataset.label]));
  all('[data-disabled]').forEach(el => { el.disabled = !!v[el.dataset.disabled]; });
  all('[data-click]').forEach(el => { el.onclick = v[el.dataset.click]; });
  all('[data-chip]').forEach(el => { const ch = v.chips[+el.dataset.chip]; el.setAttribute('aria-pressed', String(ch.pressed)); el.onclick = ch.pick; });
  all('[data-hot]').forEach(el => { const h = v.hots[+el.dataset.hot]; el.onclick = h.tap; el.onkeydown = h.key; });
}
const q = new URLSearchParams(location.search);
const props = { theme: q.get('theme') || 'silent-black', autoplay: q.get('autoplay') !== '0', loop: q.get('loop') !== '0' };
const comp = new Component(props);
if (q.get('mode') === 'pics') Object.assign(comp.state, { mode: 'pics', playing: false, started: false });
if (q.get('zoom')) comp.state.bubble = { kind: 'zoom', id: q.get('zoom') };
if (q.get('muscle')) comp.state.bubble = { kind: 'muscle', id: q.get('muscle') };
if (q.get('speed') === '0.5') comp.state.speed = 0.5;
if (q.has('t')) Object.assign(comp.state, { freeze: Math.min(1, Math.max(0, +q.get('t') || 0)), playing: false, started: true });
comp.freeze = t => comp.setState({ freeze: t, playing: false, started: true });
bind(comp); comp.componentDidMount(); window.__rig = comp;
document.getElementById('harness-note').textContent = 'Harness only: theme ' + props.theme + (comp.state.freeze !== null ? ', frozen at t = ' + comp.state.freeze : ', live') + '. Query: ?theme= &t= &zoom= &muscle= &mode=pics &loop=0 &autoplay=0 &speed=0.5';
`;

// ---------------------------------------------------------------------------
const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14M16 5v14"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>',
};

function arrowSvg(a, k = 1) { // a = { from:[x,y], to:[x,y] } in scene units; k = 1.5 for the larger tile arrows (class arrow-lg)
  const [x0, y0] = a.from, [x1, y1] = a.to, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const hx = x1 - ux * 6 * k, hy = y1 - uy * 6 * k, nx = -uy * 4 * k, ny = ux * 4 * k;
  return `<path class="arrow${k !== 1 ? ' arrow-lg' : ''}" d="M${n2(x0)} ${n2(y0)}L${n2(hx)} ${n2(hy)}"/><polygon class="arrow-head" points="${pts([[x1, y1], [hx + nx, hy + ny], [hx - nx, hy - ny]])}"/>`;
}

function page(ex) {
  const exPublic = { rep: ex.rep, picsAt: ex.picsAt, pathChip: 'path', chips: ex.chips, muscles: ex.muscles.map(m => ({ region: m.region, id: m.id, Id: m.Id, common: m.common, anatomical: m.anatomical, role: m.role, line: m.line, cls: m.cls })) };
  if (ex.muscles.some(m => !m.cls)) throw new Error(ex.id + ': a muscle in the table has no drawn region with a role');
  const logic = `const THEMES = ${JSON.stringify(THEMES)};\n${themeVars.toString()}\n${rigVars.toString()}\nconst EX = ${JSON.stringify(exPublic)};\nconst on = ${on.toString()};\n${Component.toString()}`;
  const tiles = ex.pics.map((cap, i) => `<div class="tile"><svg viewBox="${ex.tileBox.join(' ')}" aria-hidden="true"><use href="#rig-${ex.id}" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -${ex.picsAt[i]})"/>${ex.arrows[i] ? arrowSvg(ex.arrows[i], 1.5) : ''}</svg><span class="badge">${i + 1}</span><p>${cap}</p></div>`).join('');
  const defaultStyle = `${themeVars('silent-black')};${rigVars('silent-black')};--play:running;--dur:4s;--iter:infinite;--sets:infinite;--delay:0s`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=390">
<title>${ex.title}</title>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@400..700&amp;display=swap">
<style>
/* Artboard: everything in this <style> goes into <helmet><style>. */
${BASE_CSS}
${ex.css}
</style>
<style>/* harness only: a local copy of the canvas font (Roboto, latin) so offline shoots draw the same text as the canvas, page padding, and the note under the player */ @font-face{font-family:Roboto;font-style:normal;font-weight:400 700;font-display:swap;src:url(fonts/Roboto-latin.woff2) format("woff2")}body{padding:16px}.harness-note{margin:10px 0 0;width:358px;font-size:12px;line-height:16px;color:GrayText}</style>
</head>
<body>
<div class="player gen-a" data-class="rootClass" data-style="rootStyle" style="${defaultStyle}">
<div class="stage" data-click="tapStage">
<svg class="scene" viewBox="0 0 358 276" aria-hidden="true"><g class="cam zoom-null" data-class="camClass"><g id="rig-${ex.id}">
${ex.scene}
</g>${ex.staticOverlays || ''}</g></svg>
<div class="pill-row" data-if="showRepPill"><span class="pill"><span class="stack"><span class="repx r1">${ex.repWord} 1 of 3</span><span class="repx r2">${ex.repWord} 2 of 3</span><span class="repx r3">${ex.repWord} 3 of 3</span></span></span><span class="pill pill-accent" data-if="showSlow" hidden>Slow motion</span></div>
<div class="cam-label" data-if="showCamLabel">${ex.cam}</div>
<div class="pics" data-class="picsClass">${tiles}</div>
<div class="bubble" data-if="showBubble" hidden><span class="dot" data-style="bubbleDotStyle"></span><span class="bt"><b data-text="bubbleName"></b> <span data-text="bubbleRest"></span></span></div>
</div>
<div class="cap-row"><span class="cap"><span data-if="showIdle" hidden>Tap Play to watch 3 slow reps.</span><span data-if="showEnded" hidden>Done. Tap Replay to watch again.</span><span class="stack" data-if="showCaps">${ex.caps.map((c, i) => `<span class="capx c${i + 1}">${c}</span>`).join('')}</span><span data-if="showPicsLine" hidden>${ex.picsLine}</span></span><span class="tempo" data-if="showTempo">${ex.tempo}</span></div>
<div class="chips">${ex.chips.map((c, i) => `<button class="chip chip-btn" type="button" aria-pressed="false" data-chip="${i}">${ICON.zoom}${c.label}</button>`).join('')}</div>
<div class="controls">
<button class="btn-icon" type="button" aria-label="Pause" data-label="playLabel" data-click="togglePlay" data-disabled="playDisabled"><span data-if="isPlay" hidden>${ICON.play}</span><span data-if="isPause">${ICON.pause}</span><span data-if="isReplay" hidden>${ICON.replay}</span></button>
<div class="seg speed"><button type="button" aria-pressed="true" data-pressed="speed1" data-click="speedTo1">1x</button><button type="button" aria-pressed="false" data-pressed="speedHalf" data-click="speedToHalf">0.5x</button></div>
<span class="grow"></span>
<div class="seg mode"><button type="button" aria-pressed="true" data-pressed="modeAnim" data-click="toAnim" data-disabled="animDisabled">Animation</button><button type="button" aria-pressed="false" data-pressed="modePics" data-click="toPics">Pictures</button></div>
</div>
<p class="hint" data-text="hint">Tap a zoom chip to look closer. Tap it again to zoom out.</p>
<p class="sr">${ex.srText}</p>
</div>
<p class="harness-note" id="harness-note">Harness</p>
<script>
/* ===== harness only: stand-in for the DCLogic base class that support.js provides ===== */
${HARNESS_STUB}
/* ===== artboard logic (goes into <script type="text/x-dc" data-dc-script>) ===== */
${logic}
/* ===== harness only ===== */
${HARNESS_BOOT}
</script>
</body>
</html>
`;
}

// ===========================================================================
// 1) MACHINE CHEST PRESS, side view
function chestPress() {
  const H = [150, 206];                          // hip on the stage
  const S = [H[0], H[1] - 62, 0];                // shoulder (150,144), fixed
  const P = [206.5, 58], R = 100;                // lever pivot, lever length to the grip centre
  const X0 = 187, X1 = 226;                      // grip x: setup, pressed (spec 3.1 said 170 -> 226)
  const HALF = 13;                               // handle half-length (grip centre to each end)
  const Z1 = 6;                                  // hand 6 units out from the shoulder at the end
  const E0 = [149, 166];                         // chosen setup elbow (stage): 1 behind, 22 below the shoulder
  const lever = x => -deg(Math.asin((x - P[0]) / R));
  const grip2 = x => [x, P[1] + Math.sqrt(R * R - (x - P[0]) ** 2)];
  // Setup: from the chosen elbow, the sideways (z) offsets that keep both bones full length.
  const ez0 = Math.sqrt(LEN.upperArm ** 2 - (E0[0] - S[0]) ** 2 - (E0[1] - S[1]) ** 2);
  const G0 = grip2(X0), dz0 = Math.sqrt(LEN.forearm ** 2 - (G0[0] - E0[0]) ** 2 - (G0[1] - E0[1]) ** 2);
  const Z0 = ez0 + dz0;                          // hand further out than the elbow at setup
  const pole0 = norm([E0[0] - S[0], E0[1] - S[1], ez0]), pole1 = norm([-0.1, 0.6, 0.8]);
  const roles = { chest: 'main', frontDelts: 'help', triceps: 'help' };
  const muscles = muscleTable([
    { region: 'chest', id: 'chest', common: 'Chest', anatomical: 'pectoralis major', role: 'main', line: 'Pushes the handles away; hardest as the arms straighten.' },
    { region: 'frontDelts', id: 'frontDelts', common: 'Front delts', anatomical: 'anterior deltoid', role: 'help', line: 'Lifts the upper arms forward with the chest.' },
    { region: 'triceps', id: 'triceps', common: 'Triceps', anatomical: 'triceps brachii', role: 'help', line: 'Straightens the elbows at the end of the press.' },
  ], roles, 'chest press');
  const FAR = [5, -3];
  // Place on the hand path from the timing progress q (see pace()). Inside poseAt, p is that place: grip x, grip
  // z and the pole blend are all linear in it.
  const PACE = [1.2272, 1.7968, 0.2816, 2.4809, 0.7058, 2.3213, 0.5835];   // PACE_FIT=1 node gen.mjs
  const poseAt = p => {
    const x = X0 + (X1 - X0) * p, G = [...grip2(x), Z0 + (Z1 - Z0) * p];
    const pole = norm(add(mul(pole0, 1 - p), mul(pole1, p)));
    const r = solve3(S, G, LEN.upperArm, LEN.forearm, pole);
    return { s: p, x, G, alpha: lever(x), ...r, ua: -r.phi, fa: -(r.psi - r.phi), lift: 0.5 * (x - X0) };
  };
  const pose = q => ({ ...poseAt(pace(PACE, q)), p: q });
  if (process.env.PACE_FIT) { const f = fitPace(poseAt, ['ua', 'fa', 'alpha'], q => q.G); console.log(`PACE fit: const PACE = [${f.w.map(v => +v.toFixed(4)).join(', ')}]; (a) ${(f.m.a * 100).toFixed(2)} %, (b) ${(f.m.b * 100).toFixed(2)} %, (c) ${f.m.c.toFixed(2)} x`); }
  const smooth = smoothNumbers(u => pose(progress(u)), ['ua', 'fa', 'alpha'], q => q.G);
  const a0 = lever(X0), a1 = lever(X1);
  const trailS = p => (a0 - pose(p).alpha) / (a0 - a1);      // share of the handle-tip arc done
  // analytic check: hand vs handle half-way between baked samples
  let maxDrift = 0;
  for (let i = 0; i < SAMPLES.length - 1; i++) {
    const a = pose(progress(SAMPLES[i] / 100)), b = pose(progress(SAMPLES[i + 1] / 100));
    const m = k => (a[k] + b[k]) / 2;
    const phi = -m('ua'), psi = phi - m('fa');
    const hand = [S[0] + LEN.upperArm * m('fu') * Math.sin(rad(phi)) + LEN.forearm * m('ff') * Math.sin(rad(psi)), S[1] + LEN.upperArm * m('fu') * Math.cos(rad(phi)) + LEN.forearm * m('ff') * Math.cos(rad(psi))];
    const al = m('alpha'), hdl = [P[0] - R * Math.sin(rad(al)), P[1] + R * Math.cos(rad(al))];
    maxDrift = Math.max(maxDrift, Math.hypot(hand[0] - hdl[0], hand[1] - hdl[1]));
  }
  const sampled = SAMPLES.map(pc => pose(progress(pc / 100)));
  const dense = Array.from({ length: 101 }, (_, i) => pose(i / 100));

  const css = `
${animRule('cp-ua', 'cp-ua', origin(0, -62))}
${animRule('cp-ul', 'cp-ul', origin(0, -62))}
${animRule('cp-fa', 'cp-fa', origin(0, -24))}
${animRule('cp-fl', 'cp-fl', origin(0, -24))}
${animRule('cp-hd', 'cp-hd')}
${animRule('cp-lever', 'cp-lever', origin(P[0], P[1]))}
${animRule('cp-stack', 'cp-stack')}
${animRule('cp-cable', 'cp-cable', origin(50, 61))}
${animRule('cp-trail', 'cp-trail')}
${animRule('cp-eff', 'cp-eff')}
${animRule('cp-ten', 'cp-ten')}
${kf('cp-ua', p => `transform:rotate(${n4(pose(p).ua)}deg)`)}
${kf('cp-ul', p => `transform:scaleY(${n4(pose(p).fu)})`)}
${kf('cp-fa', p => { const q = pose(p); return `transform:translateY(${n3(-(1 - q.fu) * LEN.upperArm)}px) rotate(${n4(q.fa)}deg)`; })}
${kf('cp-fl', p => `transform:scaleY(${n4(pose(p).ff)})`)}
${kf('cp-hd', p => `transform:translateY(${n3(-(1 - pose(p).ff) * LEN.forearm)}px)`)}
${kf('cp-lever', p => `transform:rotate(${n4(pose(p).alpha)}deg)`)}
${kf('cp-stack', p => `transform:translateY(${n3(-pose(p).lift)}px)`)}
${kf('cp-cable', p => `transform:scaleY(${n4((45 - pose(p).lift) / 45)})`)}
${kf('cp-trail', p => `stroke-dashoffset:${n3(1 - trailS(p))}`)}
${kf('cp-eff', p => `opacity:${n3(0.75 + 0.25 * p)}`)}
${kf('cp-ten', p => `opacity:${n3(p)}`)}
.cam.zoom-grip{transform:translate(179px,138px) scale(2) translate(-206px,-157px)}
.cam.zoom-path{transform:translate(179px,138px) scale(1.6) translate(-204px,-160px)}
.cam.zoom-seat{transform:translate(179px,138px) scale(1.7) translate(-150px,-190px)}
.zoom-grip .ov-grip,.zoom-seat .ov-seat{opacity:1}
.zoom-grip .far-lever{opacity:0}
`;
  // --- markup ---
  const leg = (pass, far) => {
    const Pp = passer(pass, roles, { far });
    return `<g class="j" style="transform-origin:0px 0px;transform:rotate(-90deg)">${Pp(SIDE.hipCap)}${Pp(SIDE.thigh)}<g class="j" style="transform-origin:0px 50px;transform:rotate(90deg)">${Pp(SIDE.kneeCap)}${Pp(SIDE.shin)}${Pp(SIDE.foot)}</g></g>`;
  };
  const CORES = {};   // stroke-less hotspot cores per joint chain, painted after every halo (see fillPart)
  const bodyLayer = pass => { const Pp = passer(pass, roles, { effort: 'cp-eff', glow: 'cp-ten', ten: 'cp-ten', tap: muscles, cores: CORES, coreKey: 'body' }); return `${Pp(SIDE.neck)}${Pp(SIDE.torso)}${Pp(SIDE.head)}${leg(pass)}`; };
  const upper = pass => `<g class="j anim cp-ul">${passer(pass, roles, { tap: muscles, cores: CORES, coreKey: 'ul' })(SIDE.upperArm)}</g>${passer(pass, roles, { tap: muscles, cores: CORES, coreKey: 'ua' })(SIDE.deltoid)}`;
  const lower = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}<g class="j anim cp-fl">${Pp(SIDE.forearm)}</g><g class="j anim cp-hd">${Pp(SIDE.fist)}${pass === 'fill' ? `<circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/>` : ''}</g>`; };
  const armBody = armLayer(upper, lower, m => `<g class="j anim cp-fa">${m}</g>`);
  const arm = `<g class="j anim cp-ua arm-near">${armBody}</g>`;
  // hotspot cores in drawing order, after every halo: the torso's, then the arm's in a repeated arm chain (same keyframes)
  const armCores = `<g class="j anim cp-ua"><g class="j anim cp-ul">${cores(CORES, 'ul')}</g>${cores(CORES, 'ua')}</g>`;
  const leverG = far => `<g class="j anim cp-lever${far ? ' far-lever' : ' lever-near'}"><polygon class="${far ? 'eqf' : 'eqm'}" points="${pts([[P[0] - 2.6, P[1]], [P[0] + 2.6, P[1]], [P[0] + 2.6, P[1] + R - HALF + 1], [P[0] - 2.6, P[1] + R - HALF + 1]])}"/><rect class="${far ? 'hdf' : 'hd'}" x="${n2(P[0] - 3.2)}" y="${n2(P[1] + R - HALF)}" width="6.4" height="${far ? HALF + 8 : 2 * HALF}" rx="3"/>${far ? '' : `<path class="knurl" d="${[-11, -9.6, -8.2, 8.2, 9.6, 11].map(d => `M${n2(P[0] - 3.2)} ${n2(P[1] + R + d)}h6.4`).join('')}"/>`}</g>`;
  let still = '', moving = '';
  for (let i = 0; i < 10; i++) {
    const r = `<rect class="eq" x="26" y="${n2(112.5 + i * 13.5)}" width="48" height="12" rx="1.5"/>`;
    if (i < 6) moving += r; else still += r;
  }
  const bevel = (i0, i1) => `<path class="eqh" d="${Array.from({ length: i1 - i0 }, (_, k) => `M27.2 ${n2(113.6 + (i0 + k) * 13.5)}h45.6v1.2h-45.6z`).join('')}"/>`;
  moving += bevel(0, 6); still += bevel(6, 10);
  moving += `<rect class="pin" x="73" y="${n2(112.5 + 5 * 13.5 + 4)}" width="9" height="4" rx="2"/><circle class="pin" cx="82.6" cy="${n2(112.5 + 5 * 13.5 + 6)}" r="2.6"/>`;   // selector pin in plate 6 (accent), with its knob
  moving += `<rect class="eqm" x="45" y="106" width="10" height="6.5" rx="1"/>`;                     // top bracket the cable pulls
  const RT = R + HALF;                                                  // trail radius: the handle's bottom tip
  const tip = al => [P[0] - RT * Math.sin(rad(al)), P[1] + RT * Math.cos(rad(al))];
  const trailPts = Array.from({ length: 33 }, (_, i) => tip(a0 + (a1 - a0) * i / 32));
  const trailD = 'M' + trailPts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
  const bodyMarkup = layer(bodyLayer);   // built first (with `arm` below): the layers collect the hotspot cores
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
${shadow(208, 258, 17, 2.6)}
<g class="machine-back"><rect class="eq" x="20" y="250" width="162" height="8" rx="1.5"/><line class="rod" x1="32" y1="56" x2="32" y2="250"/><line class="rod" x1="68" y1="56" x2="68" y2="250"/>${still}<g class="j anim cp-stack">${moving}</g><rect class="eq" x="88" y="52" width="12" height="198" rx="1.5"/><rect class="eq" x="22" y="44" width="192" height="10" rx="2"/><line class="cable j anim cp-cable" x1="50" y1="61" x2="50" y2="106"/><circle class="eqm" cx="55" cy="61" r="5.2"/><circle class="prim" cx="55" cy="61" r="3.2"/><circle class="hd" cx="55" cy="61" r="1.2"/><line class="cable" x1="55" y1="55.8" x2="${n2(P[0] - 6)}" y2="55.8"/></g>
<g class="far-side" transform="translate(${FAR[0]} ${FAR[1]})">${leverG(true)}<g transform="translate(${H[0]} ${H[1]})">${leg('ol', true)}${leg('fill', true)}</g></g>
<g class="machine-front"><rect class="eq" x="150" y="222" width="9" height="28"/><rect class="eq" x="100" y="168" width="26" height="8"/><rect class="eq" x="124.5" y="108" width="13" height="104" rx="4"/><rect class="eq" x="118" y="214" width="82" height="10" rx="4"/><rect class="seam" x="126.6" y="110.2" width="8.8" height="99.6" rx="2.6"/><rect class="seam" x="120.2" y="216.2" width="77.6" height="5.6" rx="2.2"/></g>
${shadow(166, 214.4, 34, 2.2)}
<g class="figure" transform="translate(${H[0]} ${H[1]})">${bodyMarkup}</g>
${leverG(false)}<circle class="eqm" cx="${P[0]}" cy="${P[1]}" r="7"/><circle class="prim" cx="${P[0]}" cy="${P[1]}" r="4.6"/><circle class="rod" cx="${P[0]}" cy="${P[1]}" r="2"/>
<path class="guide" d="${trailD}"/><path class="trail j anim cp-trail" d="${trailD}" pathLength="1"/>
<g class="figure-arm" transform="translate(${H[0]} ${H[1]})">${arm}</g>
<g class="figure-hot" transform="translate(${H[0]} ${H[1]})">${cores(CORES, 'body')}${armCores}</g>
<rect class="ov ov-seat ovs" x="116" y="212" width="86" height="14" rx="5"/><rect class="ov ov-seat ovs" x="148" y="224" width="13" height="26" rx="2"/>`;
  const mid = pose(0.5);
  const tipMid = tip(mid.alpha);
  const ex = {
    id: 'cp', title: 'Machine Chest Press form guide', cam: 'Side view', repWord: 'Rep', rep: 4,
    caps: ['Press out, 1 s', 'Pause, don’t lock out', 'Back slowly, 2 s', 'Reset, light chest stretch'],
    tempo: '1 s out · 2 s back', picsLine: 'Press out 1 s, pause, back 2 s',
    srText: 'One rep: press out for 1 second, pause, back slowly for 2 seconds, reset.',
    chips: [
      { id: 'grip', label: 'Grip', caption: 'Hold the middle of the handle. Wrists straight, not bent back.' },
      { id: 'path', label: 'Path', caption: 'Handles stay at mid-chest height and travel straight out.' },
      { id: 'seat', label: 'Seat', caption: 'Set the seat so the handles line up with the middle of your chest.' },
    ],
    pics: ['Setup: handles at mid-chest', 'Press straight out', 'Arms almost straight, no lock', 'Back slowly, 2 s'],
    picsAt: [0, 0.125, 0.31, 0.625],
    tileBox: [96, 104, 160, 158],
    arrows: [null, { from: [tipMid[0] - 12, tipMid[1] + 9], to: [tipMid[0] + 14, tipMid[1] + 9] }, null, { from: [tipMid[0] + 14, tipMid[1] + 9], to: [tipMid[0] - 12, tipMid[1] + 9] }],
    css, scene, muscles,
  };
  fs.writeFileSync(path.join(DIR, 'chest-press.html'), page(ex));
  const row = q => ({ p: n2(q.p), grip: [n2(q.G[0]), n2(q.G[1]), n2(q.G[2])], elbow: q.E.map(n2), lever: n2(q.alpha), upper: n2(q.ua), fu: n3(q.fu), fore: n2(q.fa), ff: n3(q.ff), inside: n2(q.inside), outFromSide: n2(q.outFromSide), forward: n2(q.forward), lift: n2(q.lift) });
  return {
    maxDrift, keyTable: [0, 0.25, 0.5, 0.75, 1].map(p => row(pose(p))),
    setup: { Z0, Z1, ez0, pole0, pole1, X0, X1, P, R, E0, S, PACE }, smooth, muscles: muscles.map(muscleText),
    series: { gz: dense.map(q => q.G[2]), ez: dense.map(q => q.E[2]), fu: sampled.map(q => q.fu), inside: dense.map(q => q.inside) },
    truth: { startInside: pose(0).inside, endInside: pose(1).inside, startOut: pose(0).outFromSide, endForward: pose(1).forward, startElbowX: pose(0).E[0], minFu: Math.min(...dense.map(q => q.fu)), setupFu: pose(0).fu },
    geo: { H, P, R, HALF, FAR, shoulder: [S[0], S[1]] },
    parts: { lever: leverG(false), leverFar: leverG(true), hub: `<circle class="eqm" cx="${P[0]}" cy="${P[1]}" r="7"/><circle class="rod" cx="${P[0]}" cy="${P[1]}" r="2"/>`, stackMoving: moving },
  };
}

// ===========================================================================
// 2) DUMBBELL LATERAL RAISE, front view
function lateralRaise() {
  const H = [179, 156];
  const roles = { sideDelts: 'main', upperTraps: 'help' };
  const muscles = muscleTable([
    { region: 'sideDelts', id: 'sideDelts', common: 'Side delts', anatomical: 'lateral deltoid', role: 'main', line: 'Lifts the arms out to the sides; hardest near shoulder height.' },
    { region: 'upperTraps', id: 'upperTraps', common: 'Upper traps', anatomical: 'upper trapezius', role: 'help', line: 'Steadies the shoulder blades; keep them down, no shrug.' },
  ], roles, 'lateral raise');
  const A = p => 12 + 76 * p;     // arm out from the side, degrees
  const BEND = 15;                // constant soft elbow
  const DROP = 20;                // trail runs 20 below the grip: just under the dumbbell, never under the arm
  const css = `
${animRule('lr-ua-r', 'lr-ua-r', origin(22, -62))}
${animRule('lr-ua-l', 'lr-ua-l', origin(-22, -62))}
.lr-fa-r{${origin(22, -24)};transform:rotate(${BEND}deg)}
.lr-fa-l{${origin(-22, -24)};transform:rotate(-${BEND}deg)}
${animRule('lr-db-r', 'lr-db-r', origin(22, 16))}
${animRule('lr-db-l', 'lr-db-l', origin(-22, 16))}
${animRule('lr-trail', 'lr-trail')}
${animRule('lr-eff', 'lr-eff')}
${animRule('lr-ten', 'lr-ten')}
${animRule('lr-hlp', 'lr-hlp')}
${kf('lr-ua-r', p => `transform:rotate(${n4(-A(p))}deg)`)}
${kf('lr-ua-l', p => `transform:rotate(${n4(A(p))}deg)`)}
${kf('lr-db-r', p => `transform:rotate(${n4(A(p) - BEND)}deg)`)}
${kf('lr-db-l', p => `transform:rotate(${n4(-(A(p) - BEND))}deg)`)}
${kf('lr-trail', p => `stroke-dashoffset:${n3(1 - p)}`)}
${kf('lr-eff', p => `opacity:${n3(0.75 + 0.25 * p)}`)}
${kf('lr-ten', p => `opacity:${n3(p)}`)}
${kf('lr-hlp', p => `opacity:${n3(1 - 0.3 * p)}`)}
.cam.zoom-shoulders{transform:translate(179px,138px) scale(2.2) translate(-179px,-90px)}
.cam.zoom-path{transform:translate(179px,138px) scale(1.2) translate(-179px,-135px)}
.cam.zoom-elbows{transform:translate(179px,138px) scale(2.2) translate(-179px,-113px)}
.zoom-shoulders .ov-shoulders,.zoom-elbows .ov-elbows{opacity:1}
`;
  // Hex dumbbell seen end-on from the front and a little above. Drawn in the hand's frame but counter-rotated to stay
  // level: a short handle stub, then the index finger and thumb as a ring closed round the handle where it leaves the
  // fist (skin tones, so the hand reads as closed), then the head: its top band overlaps the lower part of the fist,
  // three lit top faces (mid, light, dark), the end face with a thin rim for the recessed cap (no dark hole, which read
  // as a nut at phone size). Centred on x = the grip.
  const dumbbell = (gx, gy) => {
    const c = [gx, gy + 12.5], r = 6.6, sy = 0.92, h = 2.2, v = hexv(c[0], c[1], r, sy), up = q => [q[0], q[1] - h];
    const band = [v[3], v[4], v[5], v[0], up(v[0]), up(v[5]), up(v[4]), up(v[3])];
    const face = (a, b, cls) => `<polygon class="${cls}" points="${pts([a, b, up(b), up(a)])}"/>`;
    const handle = `<rect class="hd" x="${n2(gx - 1.8)}" y="${n2(gy + 1.6)}" width="3.6" height="3.6"/>`;   // under the finger ring and the head: seen end-on, the handle itself is inside the hand
    const ring = `<polygon class="bh" points="${pts([[gx - 3.4, gy + 1.2], [gx + 3.4, gy + 1.2], [gx + 3.9, gy + 2.5], [gx + 3.3, gy + 4], [gx - 3.3, gy + 4], [gx - 3.9, gy + 2.5]])}"/><polygon class="bl" points="${pts([[gx - 3.3, gy + 4], [gx + 3.3, gy + 4], [gx + 3, gy + 4.8], [gx - 3, gy + 4.8]])}"/>`;
    return `${handle}${ring}<polygon class="eqm" points="${pts(band)}"/>${face(v[3], v[4], 'eqs')}${face(v[4], v[5], 'eqh')}${face(v[5], v[0], 'eql')}<polygon class="eqm" points="${pts(v)}"/><polygon class="prim" points="${pts(hexv(c[0], c[1], 3.8, sy))}"/>`;
  };
  const side = s => {
    const M = s === 'r' ? (p => p) : mirPart, g = s === 'r' ? 22 : -22;
    const up = pass => { const Pp = passer(pass, roles, { effort: 'lr-eff', glow: 'lr-ten', tap: muscles, cores: CORES, coreKey: 'ua-' + s }); return `${Pp(M(FR.upperArmR))}${Pp(M(FR.deltoidR))}`; };
    const lo = pass => { const Pp = passer(pass, roles); return `${Pp(M(FR.elbowCapR))}${Pp(M(FR.forearmR))}${Pp(M(FR.fistR))}`; };
    return `<g class="j anim lr-ua-${s} arm-${s}">${armLayer(up, lo, (m, pass) => `<g class="j lr-fa-${s}">${m}${pass === 'fill' ? `<circle class="ov ov-elbows ovs" cx="${g}" cy="-24" r="8"/><g class="j anim lr-db-${s}">${dumbbell(g, 16)}</g>` : ''}</g>`)}</g>`;
  };
  const legs = pass => { const Pp = passer(pass, roles); return ['r', 'l'].map(s => { const M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(FR.thighR))}${Pp(M(FR.kneeCapR))}${Pp(M(FR.shinR))}${Pp(M(FR.footR))}`; }).join(''); };
  // the upper-trap helper tint eases off (1 -> 0.7) as the delts take over: the traps stay down, no shrug (secondary motion, opacity only)
  const CORES = {};   // stroke-less hotspot cores per joint chain, painted after every halo (see fillPart)
  const bodyLayer = pass => { const Pp = passer(pass, roles, { ten: 'lr-ten', helpFade: 'lr-hlp', tap: muscles, cores: CORES, coreKey: 'body' }); return `${legs(pass)}${Pp(FR.neck)}${Pp(FR.torso)}${Pp(FR.head)}`; };
  const grip = (p, sgn) => { const a = A(p); const E = [22 + 38 * Math.sin(rad(a)), -62 + 38 * Math.cos(rad(a))]; const Gp = [E[0] + 40 * Math.sin(rad(a - BEND)), E[1] + 40 * Math.cos(rad(a - BEND))]; return [sgn * Gp[0], Gp[1]]; };
  const trailR = Array.from({ length: 33 }, (_, i) => { const g = grip(i / 32, 1); return [g[0], g[1] + DROP]; });
  const trailL = trailR.map(([x, y]) => [-x, y]);
  const dR = 'M' + trailR.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L'), dL = 'M' + trailL.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
  const trapR = [[7, -75], [17.5, -72], [24, -67.5]];                 // 4 to 5 units above the trap slope
  const downR = { from: [H[0] + 30, H[1] - 90], to: [H[0] + 30, H[1] - 75] }, downL = { from: [H[0] - 30, H[1] - 90], to: [H[0] - 30, H[1] - 75] };
  const bodyMarkup = layer(bodyLayer), sideL = side('l'), sideR = side('r');   // built first: they collect the hotspot cores
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
${shadow(H[0], 258, 30, 3)}
<g class="figure" transform="translate(${H[0]} ${H[1]})">
${bodyMarkup}
<path class="guide" d="${dR}"/><path class="guide" d="${dL}"/><path class="trail j anim lr-trail" d="${dR}" pathLength="1"/><path class="trail j anim lr-trail" d="${dL}" pathLength="1"/>
${sideL}
${sideR}
<polyline class="ov ov-shoulders ovs" points="${pts(trapR)}"/><polyline class="ov ov-shoulders ovs" points="${pts(mir(trapR))}"/>
${cores(CORES, 'body')}${['l', 'r'].map(s => `<g class="j anim lr-ua-${s}">${cores(CORES, 'ua-' + s)}</g>`).join('')}
</g>`;
  const staticOverlays = `<g class="ov ov-shoulders">${arrowSvg(downR)}${arrowSvg(downL)}</g>`;
  // arrows for tiles 2 and 4: outside the right trail at p = 0.5, along the tangent
  const tA = p => { const g = grip(p, 1); return [g[0] + H[0], g[1] + DROP + H[1]]; };
  const pa = tA(0.36), pb = tA(0.64), mid = tA(0.5);
  const sh = [201, 94], nrm = norm(sub(mid, sh)), off = 10;
  const up = { from: [pa[0] + nrm[0] * off, pa[1] + nrm[1] * off], to: [pb[0] + nrm[0] * off, pb[1] + nrm[1] * off] };
  const ex = {
    id: 'lr', title: 'Dumbbell Lateral Raise form guide', cam: 'Front view', repWord: 'Rep', rep: 4,
    caps: ['Raise to shoulder height, 1 s', 'Pause, shoulders down', 'Lower slowly, 2 s', 'Reset at your sides'],
    tempo: '1 s up · 2 s down', picsLine: 'Raise 1 s, pause, lower 2 s',
    srText: 'One rep: raise your arms out to the sides for 1 second, pause, lower slowly for 2 seconds, reset.',
    chips: [
      { id: 'shoulders', label: 'Shoulders', caption: 'Keep your shoulders down, away from your ears. No shrug.' },
      { id: 'path', label: 'Path', caption: 'Out to the sides and up to shoulder height, no higher.' },
      { id: 'elbows', label: 'Elbows', caption: 'A soft bend in your elbows that stays the same up and down.' },
    ],
    pics: ['Stand tall, elbows soft', 'Lift out to the sides', 'Stop at shoulder height', 'Lower slowly, 2 s'],
    picsAt: [0, 0.125, 0.31, 0.625],
    tileBox: [66, 51, 226, 213],
    arrows: [null, up, null, { from: up.to, to: up.from }],
    css, scene, staticOverlays, muscles,
  };
  fs.writeFileSync(path.join(DIR, 'lateral-raise.html'), page(ex));
  const key = p => { const g = grip(p, 1); return { p: n2(p), A: n2(A(p)), outFromSide: n2(A(p)), inside: n2(180 - BEND), gripR: [n2(g[0] + H[0]), n2(g[1] + H[1])] }; };
  const smooth = smoothNumbers(u => { const p = progress(u); return { A: A(p), db: A(p) - BEND, g: grip(p, 1) }; }, ['A', 'db'], q => q.g);
  return { smooth, muscles: muscles.map(muscleText), keyTable: [0, 0.25, 0.5, 0.75, 1].map(key), truth: { startA: A(0), endA: A(1), topGripY: grip(1, 1)[1] + H[1], shoulderY: 94 }, geo: { H }, parts: { dumbbellR: dumbbell(22, 16) } };
}

// ===========================================================================
// 3) PARTS SHEET: the three views in their rest pose (static), to check the shapes.
function partsSheet() {
  const roles = {};
  const sideFig = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.neck)}${Pp(SIDE.torso)}${Pp(SIDE.head)}${Pp(SIDE.hipCap)}${Pp(SIDE.thigh)}${Pp(SIDE.kneeCap)}${Pp(SIDE.shin)}${Pp(SIDE.foot)}`; };
  const sideArm = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.upperArm)}${Pp(SIDE.deltoid)}`; };
  const sideLow = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}${Pp(SIDE.forearm)}${Pp(SIDE.fist)}`; };
  const frontBody = pass => { const Pp = passer(pass, roles); return ['r', 'l'].map(s => { const M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(FR.thighR))}${Pp(M(FR.kneeCapR))}${Pp(M(FR.shinR))}${Pp(M(FR.footR))}`; }).join('') + `${Pp(FR.neck)}${Pp(FR.torso)}${Pp(FR.head)}`; };
  const frontArm = (s, pass) => { const Pp = passer(pass, roles), M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(FR.upperArmR))}${Pp(M(FR.deltoidR))}`; };
  const frontLow = (s, pass) => { const Pp = passer(pass, roles), M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(FR.elbowCapR))}${Pp(M(FR.forearmR))}${Pp(M(FR.fistR))}`; };
  const topBody = pass => { const Pp = passer(pass, { rearDelts: 'main', midBack: 'help' }); return `${Pp(TOP.torso)}`; };
  const topHead = pass => passer(pass, {})(TOP.head);
  const topArm = (s, pass) => { const Pp = passer(pass, { rearDelts: 'main', midBack: 'help' }), M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(TOP.upperArmR))}${Pp(M(TOP.deltoidR))}`; };
  const topLow = (s, pass) => { const Pp = passer(pass, {}), M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(TOP.elbowCapR))}${Pp(M(TOP.forearmR))}${Pp(M(TOP.fistR))}`; };
  const sideSvg = `<g transform="translate(179 156)">${layer(sideFig)}<g>${armLayer(sideArm, sideLow, m => `<g>${m}</g>`)}</g></g>`;
  const frontSvg = `<g transform="translate(179 156)">${layer(frontBody)}${['l', 'r'].map(s => `<g>${armLayer(q => frontArm(s, q), q => frontLow(s, q), m => `<g>${m}</g>`)}</g>`).join('')}</g>`;
  // top view, seated rear delt fly start pose: arms forward (rotate 180 -+ 10), soft bend 12
  const topSvg = `<g transform="translate(179 160)">${['l', 'r'].map(s => { const sg = s === 'r' ? 1 : -1; return `<g class="j" style="${origin(sg * 22, 0)};transform:rotate(${sg * (180 - 4)}deg)">${armLayer(q => topArm(s, q), q => topLow(s, q), m => `<g class="j" style="${origin(sg * 22, 38)};transform:rotate(${-sg * 8}deg)">${m}</g>`)}</g>`; }).join('')}${layer(topBody)}${layer(topHead)}</g>`;
  const panel = (label, svg) => `<figure><div class="stage"><svg class="scene" viewBox="0 0 358 276" aria-hidden="true"><line class="floor" x1="16" y1="258" x2="342" y2="258"/>${svg}</svg><div class="cam-label">${label}</div></div></figure>`;
  // Framing guide: dashed boxes = keep-clear zones (rep pill incl. Slow motion, camera label,
  // zoom bubble when zoomed); solid box = safe area for figure and equipment. A 300-tall stage
  // adds one static translate(0 24) around the scene and moves the floor to 282.
  const zones = H => { const dy = H - 276; return `<rect class="zone" x="10" y="10" width="172" height="24" rx="6"/><rect class="zone" x="250" y="10" width="98" height="18" rx="4"/><rect class="zone" x="12" y="${H - 66}" width="334" height="54" rx="8"/><rect class="safe" x="16" y="40" width="326" height="${218 + dy}"/><line class="floor" x1="16" y1="${258 + dy}" x2="342" y2="${258 + dy}"/>`; };
  const framing = (H, label) => `<figure><div class="stage" style="height:${H}px"><svg class="scene" style="height:${H}px" viewBox="0 0 358 ${H}" aria-hidden="true">${zones(H)}<g transform="translate(0 ${H - 276})">${sideSvg.replace('translate(179 156)', 'translate(150 156)')}</g></svg><div class="cam-label" style="top:44px;right:24px">${label}</div></div></figure>`;
  const html = (theme) => `<div class="player" style="${themeVars(theme)};${rigVars(theme)};height:auto;padding:0 0 8px">${panel('Side view, rest pose', sideSvg)}${panel('Front view, rest pose', frontSvg)}${panel('Top view, seated', topSvg)}${framing(276, 'Framing, 358 x 276 player')}${framing(300, 'Framing, 358 x 300 stage')}</div>`;
  const doc = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>Rig parts sheet</title><style>${BASE_CSS}figure{margin:0}.row{display:flex;gap:16px}.zone{fill:none;stroke:var(--text-3);stroke-width:1;stroke-dasharray:3 3}.safe{fill:none;stroke:var(--accent);stroke-width:1;opacity:.5}</style></head><body><div class="row">${html('silent-black')}${html('paper')}</div></body></html>`;
  fs.writeFileSync(path.join(DIR, 'parts.html'), doc);
}

const cp = chestPress();
const lr = lateralRaise();
partsSheet();
const contrast = contrastTable();
fs.writeFileSync(path.join(DIR, 'poses.json'), JSON.stringify({ chestPress: cp, lateralRaise: lr, contrast }, null, 1));
console.log(JSON.stringify({ cpKey: cp.keyTable, cpTruth: cp.truth, drift: cp.maxDrift, setup: cp.setup, lrTruth: lr.truth }, null, 1));

// ---------------------------------------------------------------------------
// RIG.md: refresh the generated block (copy-paste shapes + measured numbers) in place.
function snippet(title, parts) {
  let s = `**${title}**\n\n\`\`\`html\n`;
  for (const [name, group, p] of parts) {
    s += `<!-- ${name}  (lives in: ${group}) -->\n<polygon class="olk" points="${pts(p.base)}"/>  <!-- outline pass -->\n<polygon class="rim" points="${pts(p.base)}"/>  <!-- rim pass -->\n<polygon class="${toneCls(p.cloth || 'skin', null)}" points="${pts(p.base)}"/>  <!-- fill pass -->\n`;
    for (const r of p.regions || []) {
      const cls = r.tone || r.cloth ? toneCls(r.cloth || p.cloth || 'skin', r.tone) : null, reg = r.muscle || r.name;
      const note = r.ten ? `  <!-- secondary motion: add "tn anim XX-ten" -->` : r.muscle ? `  <!-- mm if main, mh if helps, ${cls || 'omit'} otherwise -->` : '';
      s += `<polygon class="${cls || 'mm'}" data-region="${reg}" points="${pts(r.poly)}"/>${note}\n`;
    }
  }
  return s + '```\n\n';
}
function generatedMd() {
  let md = '';
  md += snippet('Side view parts (faces +x; rig origin = hip joint)', [
    ['neck', 'figure root', SIDE.neck], ['torso', 'figure root', SIDE.torso], ['head', 'figure root', SIDE.head],
    ['upperArm', 'ua > ul', SIDE.upperArm], ['deltoid', 'ua', SIDE.deltoid], ['elbowCap', 'fa', SIDE.elbowCap],
    ['forearm', 'fa > fl', SIDE.forearm], ['fist', 'fa > hd', SIDE.fist],
    ['hipCap', 'thigh', SIDE.hipCap], ['thigh', 'thigh', SIDE.thigh], ['kneeCap', 'shin', SIDE.kneeCap], ['shin', 'shin', SIDE.shin], ['foot', 'shin', SIDE.foot]]);
  md += snippet('Front view parts (screen-right side; screen-left = same points with x negated; rig origin = midway between the hips)', [
    ['neck', 'figure root', FR.neck], ['torso', 'figure root', FR.torso], ['head', 'figure root', FR.head],
    ['upperArmR', 'ua-r', FR.upperArmR], ['deltoidR', 'ua-r', FR.deltoidR], ['elbowCapR', 'fa-r', FR.elbowCapR], ['forearmR', 'fa-r', FR.forearmR], ['fistR', 'fa-r', FR.fistR],
    ['thighR', 'figure root (static legs)', FR.thighR], ['kneeCapR', 'figure root', FR.kneeCapR], ['shinR', 'figure root', FR.shinR], ['footR', 'figure root', FR.footR]]);
  md += snippet('Top view parts, seated or standing lifter (faces -y; rig origin = midway between the shoulder joints)', [
    ['torso (shoulders and upper back from above)', 'figure root', TOP.torso], ['head (from above, nose toward -y)', 'figure root', TOP.head],
    ['deltoidR', 'ua-r', TOP.deltoidR], ['upperArmR', 'ua-r > ul-r', TOP.upperArmR], ['elbowCapR', 'fa-r', TOP.elbowCapR], ['forearmR', 'fa-r > fl-r', TOP.forearmR], ['fistR', 'fa-r > hd-r', TOP.fistR]]);
  md += `**Equipment parts (copy-paste; stage units unless a group is named)**\n\n\`\`\`html\n`;
  md += `<!-- front-view dumbbell, screen-right hand. Lives in fa-r > db-r (rotation origin 22,16 = the grip).\n     Handle stub, then the index finger and thumb as a ring closed round it (skin tones), then the head: centred at (22, 28.5), 12.5 below the grip, its top band over the lower part of the fist (seen a little from above). Screen-left: negate every x. -->\n${lr.parts.dumbbellR.replace(/></g, '>\n<')}\n`;
  md += `<!-- chest press lever (near). One group rotating about the pivot (${cp.geo.P.join(', ')}); grip centre ${cp.geo.R} below the pivot at rest. -->\n${cp.parts.lever.replace(/></g, '>\n<')}\n${cp.parts.hub.replace(/></g, '>\n<')}\n`;
  md += `<!-- far lever: the same group inside <g class="far-side" transform="translate(${cp.geo.FAR.join(' ')})"> -->\n${cp.parts.leverFar.replace(/></g, '>\n<')}\n`;
  md += `<!-- stack plates 1-6, pin and top bracket: one group, translateY(-lift) -->\n${cp.parts.stackMoving.replace(/></g, '>\n<')}\n\`\`\`\n\n`;
  const v3 = a => '[' + a.map(x => x.toFixed(4)).join(', ') + ']';
  md += `Chest press solve inputs (so every sample can be rebuilt from this file): p runs 0 to 1 over the move and is linear in grip x: x = ${cp.setup.X0} + ${cp.setup.X1 - cp.setup.X0} p; grip y = ${cp.setup.P[1]} + sqrt(${cp.setup.R}^2 - (x - ${cp.setup.P[0]})^2); lever rotate = -asin((x - ${cp.setup.P[0]}) / ${cp.setup.R}); grip z = ${cp.setup.Z0.toFixed(2)} + (${cp.setup.Z1} - ${cp.setup.Z0.toFixed(2)}) p. pole0 = norm([${cp.setup.E0[0] - cp.setup.S[0]}, ${cp.setup.E0[1] - cp.setup.S[1]}, ${cp.setup.ez0.toFixed(2)}]) = ${v3(cp.setup.pole0)}; pole1 = norm([-0.1, 0.6, 0.8]) = ${v3(cp.setup.pole1)}; pole(p) = norm((1 - p) pole0 + p pole1). Shoulder (${cp.setup.S.join(', ')}), upper arm 38, forearm 40; the setup elbow (${cp.setup.E0.join(', ')}, ${cp.setup.ez0.toFixed(2)}) is the elbow nearest pole0. The rep timing maps rep time to p (section 8).\n\n`;
  md += `### Measured numbers from this build\n\nMachine Chest Press key poses (stage units; z = sideways, out from the shoulder toward the camera; angles in degrees; SVG rotate + = clockwise):\n\n`;
  md += '| p | Grip (x, y, z) | Elbow (x, y, z) | Lever | Upper arm | fu | Forearm | ff | Elbow inside angle | Arm out from side | Arm forward | Stack lift |\n|---|---|---|---|---|---|---|---|---|---|---|---|\n';
  for (const k of cp.keyTable) md += `| ${k.p} | ${k.grip.join(', ')} | ${k.elbow.join(', ')} | ${k.lever} | ${k.upper} | ${k.fu} | ${k.fore} | ${k.ff} | ${k.inside} | ${k.outFromSide} | ${k.forward} | ${k.lift} |\n`;
  md += `\nWorst hand-to-handle gap half-way between baked samples (analytic): ${cp.maxDrift.toFixed(2)} units. Smallest upper-arm fu over the rep: ${cp.truth.minFu.toFixed(3)}.\n\n`;
  md += 'Dumbbell Lateral Raise key poses:\n\n| p | Arm out from side A | Elbow inside angle | Screen-right grip (stage) |\n|---|---|---|---|\n';
  for (const k of lr.keyTable) md += `| ${k.p} | ${k.A} | ${k.inside} | (${k.gripR.join(', ')}) |\n`;
  md += `\nContrast of the derived paints (WCAG ratio; stage = --surface-1):\n\n| Theme | Outline on stage | Outline on body | Frame | Metal | Cable | Accent | Body vs stage | Body vs pads | Helps vs body | Main vs body |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
  for (const r of contrast) md += `| ${r.id} | ${r.line.toFixed(2)} | ${r.lineBody.toFixed(2)} | ${r.frame.toFixed(2)} | ${r.metal.toFixed(2)} | ${r.cable.toFixed(2)} | ${r.accent.toFixed(2)} | ${r.bodyStage.toFixed(2)} | ${r.bodyPad.toFixed(2)} | ${r.helpBody.toFixed(2)} | ${r.mainBody.toFixed(2)} |\n`;
  md += `\nFigure detail paints (section 20; outline = --fg-line):\n\n| Theme | Outline on T-shirt light / dark | Outline on skin / light / dark | Skin vs T-shirt | Shorts vs skin | Shorts vs pads | Shoe vs stage | Rim vs outline | Knurl on handle | Seam on pad | Main vs T-shirt |\n|---|---|---|---|---|---|---|---|---|---|---|\n`;
  for (const r of contrast) md += `| ${r.id} | ${r.lineTeeHi.toFixed(2)} / ${r.lineTeeLo.toFixed(2)} | ${r.lineSkin.toFixed(2)} / ${r.lineSkinHi.toFixed(2)} / ${r.lineSkinLo.toFixed(2)} | ${r.skinTee.toFixed(2)} | ${r.shortsSkin.toFixed(2)} | ${r.shortsPad.toFixed(2)} | ${r.shoeStage.toFixed(2)} | ${r.rimLine.toFixed(2)} | ${r.knurl.toFixed(2)} | ${r.seam.toFixed(2)} | ${r.mainTee.toFixed(2)} |\n`;
  md += `\nKeyframe stops per animated group: ${SAMPLES.length}, written twice (-a and -b).\n`;
  return md;
}
const RIG_MD = path.join(DIR, 'RIG.md');
if (fs.existsSync(RIG_MD)) {
  const src = fs.readFileSync(RIG_MD, 'utf8');
  const a = '<!-- generated:start (node gen.mjs rewrites this block) -->', b = '<!-- generated:end -->';
  const i = src.indexOf(a), j = src.indexOf(b);
  if (i >= 0 && j > i) fs.writeFileSync(RIG_MD, src.slice(0, i + a.length) + '\n\n' + generatedMd() + '\n' + src.slice(j));
}
