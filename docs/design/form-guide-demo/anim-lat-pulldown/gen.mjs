// gen.mjs: Lat Pulldown player, built on the FINAL shared rig (rig-final/gen.mjs lines 1-378,
// copied as is; the only changes are marked "LP:"). Writes index.html, poses.json and the
// generated pieces used in PLAYER.md.   Run: node gen.mjs   (no network, no dependencies)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const DIR = path.dirname(fileURLToPath(import.meta.url));
const rad = d => (d * Math.PI) / 180;
const deg = r => (r * 180) / Math.PI;
const n2 = v => { const s = (Math.round(v * 100) / 100).toString(); return s === '-0' ? '0' : s; };
const n3 = v => { const s = (Math.round(v * 1000) / 1000).toString(); return s === '-0' ? '0' : s; };
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
  return `--fg-line:color-mix(in srgb,var(--text) ${light ? 70 : 60}%,var(--surface-1));--fg-frame:color-mix(in srgb,var(--text) ${light ? 56 : 38}%,var(--surface-1))`;
}

// ---------------------------------------------------------------------------
// Contrast (WCAG) of the derived paints, so RIG.md quotes measured numbers.
const hex = h => [1, 3, 5].map(i => parseInt(h.slice(i, i + 2), 16));
const parse = c => c.startsWith('#') ? { rgb: hex(c), a: 1 } : (() => { const m = c.match(/[\d.]+/g).map(Number); return { rgb: m.slice(0, 3), a: m[3] ?? 1 }; })();
const over = (c, bg) => { const p = parse(c), b = parse(bg).rgb; return p.rgb.map((v, i) => v * p.a + b[i] * (1 - p.a)); };
const mixc = (a, pa, b) => a.map((v, i) => v * pa + b[i] * (1 - pa));
const lum = rgb => { const f = v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = rgb.map(f); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const cr = (x, y) => { const a = lum(x), b = lum(y); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
function contrastTable() {
  const rows = [];
  for (const [id, t] of Object.entries(THEMES)) {
    const s1 = hex(t.s1), text = hex(t.text), mb = hex(t.mapBody), s3 = hex(t.s3), acc = hex(t.acc);
    const body = mixc(mb, 0.88, text), line = mixc(text, t.scheme === 'light' ? 0.7 : 0.6, s1), frame = mixc(text, t.scheme === 'light' ? 0.56 : 0.38, s1);
    const metal = mixc(text, 0.72, s1), cable = mixc(text, 0.55, s1), help = mixc(acc, 0.45, body);
    rows.push({ id, line: cr(line, s1), lineBody: cr(line, body), frame: cr(frame, s1), metal: cr(metal, s1), cable: cr(cable, s1), accent: cr(acc, s1), bodyStage: cr(body, s1), bodyPad: cr(body, s3), helpBody: cr(help, body), mainBody: cr(acc, body) });
  }
  return rows;
}

// ---------------------------------------------------------------------------
// RIG. Rig units: 1 unit = 1 stage px at 358 wide. Local frame of every view:
// +y is down; limbs are drawn hanging straight down (rest pose); poses come only
// from rotations (and foreshortening scales) about the joints below.
export const LEN = { upperArm: 38, forearm: 40, torso: 62, thigh: 50, shin: 47, sole: 102 };

// SIDE view: origin = hip joint, lifter faces +x.
const SIDE = {
  joints: { hip: [0, 0], shoulder: [0, -62], elbow: [0, -24], grip: [0, 16], knee: [0, 50], ankle: [0, 97], head: [3, -82] },
  neck: { base: [[-5, -63], [-4.5, -73.5], [5, -72.5], [7, -64]] },
  head: {
    base: tr([[-10, -4], [-7.5, -10], [0, -12], [7, -9.5], [10, -4], [11, 0], [13, 2.5], [10.5, 4.5], [9.5, 8.5], [4, 11], [-2, 10], [-7, 6.5]], 3, -82),
    regions: [{ poly: tr([[-3.5, -1.5], [0, -3], [1.5, 1], [0, 4.5], [-3.5, 3]], 3, -82), facet: true, name: 'ear' }],
  },
  torso: {
    base: [[-7, -67], [-2, -70.5], [6, -69.5], [11, -65], [15, -56], [15.5, -46], [12.5, -36], [10, -25], [9.5, -13], [10.5, -3], [7.5, 6], [-3, 8.5], [-10.5, 6], [-12.5, -3], [-10.5, -15], [-9.8, -26], [-11.8, -40], [-12.2, -52], [-10.5, -62]],
    regions: [
      { poly: [[4, -66.5], [11, -65], [15, -56], [15.5, -46], [12.5, -36], [5, -39], [3, -52]], muscle: 'chest', facet: true },
      { poly: [[12.5, -36], [10, -25], [9.5, -13], [10.5, -3], [3, -6], [3, -24], [5, -39]], muscle: 'abs' },
      { poly: [[-12.2, -52], [-4, -55], [-2, -40], [-6, -28], [-9.8, -26], [-11.8, -40]], muscle: 'lats', facet: true },
      { poly: [[-7, -67], [-2, -70.5], [2, -66], [-3, -58], [-10.5, -62]], muscle: 'upperTraps' },
      { poly: [[-10.5, -62], [-3, -58], [-4, -55], [-12.2, -52]], muscle: 'midBack' },   // LP: added region (paints only when mid back has a role)
      { poly: [[-3, 8.5], [-10.5, 6], [-12.5, -3], [-10.5, -15], [-3, -9], [1, 3]], facet: true, name: 'seat' },
    ],
  },
  deltoid: {
    base: tr([[-6.5, -4], [-2.5, -7.5], [4, -7], [7.5, -2.5], [7.5, 5], [5, 12], [-1, 13.5], [-6.5, 8]], 0, -62),
    regions: [
      { poly: tr([[0.5, -7.3], [4, -7], [7.5, -2.5], [7.5, 5], [5, 12], [1.5, 6]], 0, -62), muscle: 'frontDelts' },
      { poly: tr([[-6.5, -4], [-2.5, -7.5], [0.5, -7.3], [1.5, 6], [-1, 13.5], [-6.5, 8]], 0, -62), muscle: 'rearDelts', facet: true },
    ],
  },
  upperArm: {
    base: tr([[-5.5, -2], [5.5, -2], [6.2, 12], [4.6, 35], [0, 39], [-4.6, 35], [-6.2, 14]], 0, -62),
    regions: [
      { poly: tr([[0.3, -2], [5.5, -2], [6.2, 12], [4.6, 35], [0.3, 37]], 0, -62), muscle: 'biceps', facet: true },
      { poly: tr([[-5.5, -2], [0.3, -2], [0.3, 37], [-4.6, 35], [-6.2, 14]], 0, -62), muscle: 'triceps' },
    ],
  },
  elbowCap: { base: oct(0, -24, 4.6) },
  forearm: {
    base: tr([[-4.8, -1], [4.8, -1], [5, 11], [3.6, 31], [-3.6, 31], [-4.6, 11]], 0, -24),
    regions: [{ poly: tr([[0.2, -1], [4.8, -1], [5, 11], [3.6, 31], [0.2, 31]], 0, -24), muscle: 'forearms', facet: true }],
  },
  fist: {
    base: tr([[-4.2, -10], [4.2, -10], [6, -5], [6.5, 3], [3.5, 7], [-3, 7], [-5.5, 2.5], [-5.2, -5]], 0, 16),
    regions: [{ poly: tr([[4.2, -10], [6, -5], [6.5, 3], [3.5, 7], [1.5, -1]], 0, 16), facet: true }],
  },
  hipCap: { base: oct(0, 0, 8.4) },
  thigh: {
    base: [[-8.5, -3], [8.5, -3], [8.2, 20], [6, 47], [0, 51], [-6, 47], [-8.4, 22]],
    regions: [{ poly: [[0.3, -3], [8.5, -3], [8.2, 20], [6, 47], [0.3, 48]], muscle: 'quads', facet: true }],
  },
  kneeCap: { base: oct(0, 50, 6) },
  shin: {
    base: [[-5.5, 49], [5.5, 49], [5, 62], [4, 94], [-4, 94], [-7, 64]],
    regions: [{ poly: [[-5.5, 49], [0, 49], [0, 94], [-4, 94], [-7, 64]], muscle: 'calves', facet: true }],
  },
  foot: { base: [[-5, 93], [3, 93], [8, 97.5], [17, 99.5], [17.5, 102], [-6, 102], [-6.5, 97.5]] },
};

// FRONT view: origin = midway between the hip joints, lifter faces the viewer.
// Screen-right side (the lifter's left) is defined; screen-left = mirror in x.
const FR = {
  joints: { hipR: [10, 0], shoulderR: [22, -62], elbowR: [22, -24], gripR: [22, 16], kneeR: [10, 50], ankleR: [10, 97], head: [0, -83] },
  neck: { base: [[-5, -79], [5, -79], [6.5, -64], [-6.5, -64]] },
  head: {
    base: tr([[0, -12], [7, -10], [10, -4], [9.5, 3], [6, 9], [0, 11.5], [-6, 9], [-9.5, 3], [-10, -4], [-7, -10]], 0, -83),
    regions: [{ poly: tr([[0, -12], [7, -10], [10, -4], [9.5, 3], [6, 9], [0, 11.5]], 0, -83), facet: true }],
  },
  torso: {
    base: [[-6.5, -69.5], [-2.5, -65.5], [2.5, -65.5], [6.5, -69.5], [17, -66.5], [21, -63], [20, -52], [16.5, -38], [14, -26], [15, -14], [16.5, -4], [15, 4], [6, 10.5], [0, 11.5], [-6, 10.5], [-15, 4], [-16.5, -4], [-15, -14], [-14, -26], [-16.5, -38], [-20, -52], [-21, -63], [-17, -66.5]],
    regions: [
      { poly: [[6.5, -69.5], [17, -66.5], [21, -63], [12, -63], [4.5, -65.5]], muscle: 'upperTraps' },
      { poly: mir([[6.5, -69.5], [17, -66.5], [21, -63], [12, -63], [4.5, -65.5]]), muscle: 'upperTraps' },
      { poly: [[0.5, -63.5], [19.8, -62], [19.5, -52], [15.5, -44], [0.5, -45]], muscle: 'chest', facet: true },
      { poly: mir([[0.5, -63.5], [19.8, -62], [19.5, -52], [15.5, -44], [0.5, -45]]), muscle: 'chest', facet: true },
      { poly: [[16.5, -38], [14, -26], [15, -14], [16.5, -4], [9, -9], [9, -41]], muscle: 'obliques', facet: true },
      { poly: mir([[16.5, -38], [14, -26], [15, -14], [16.5, -4], [9, -9], [9, -41]]), muscle: 'obliques', facet: true },
    ],
  },
  deltoidR: {
    base: tr([[-5.2, -3], [1, -4], [6, -2.5], [8.2, 2.5], [7.8, 9.5], [4.8, 14.5], [-1, 13], [-5.2, 5.5]], 22, -62),
    regions: [
      { poly: tr([[1, -4], [6, -2.5], [8.2, 2.5], [7.8, 9.5], [4.8, 14.5], [2.5, 4.5]], 22, -62), muscle: 'sideDelts' },
      { poly: tr([[-5.2, -3], [1, -4], [2.5, 4.5], [4.8, 14.5], [-1, 13], [-5.2, 5.5]], 22, -62), muscle: 'frontDelts', facet: true },
    ],
  },
  upperArmR: {
    base: tr([[-5.2, -2], [5.5, -2], [6.2, 14], [4.6, 35], [0, 39], [-4.6, 35], [-5.8, 14]], 22, -62),
    regions: [{ poly: tr([[-3, 3], [3, 3], [3.5, 26], [0, 31], [-3, 26]], 22, -62), muscle: 'biceps', facet: true }],
  },
  elbowCapR: { base: oct(22, -24, 4.6) },
  forearmR: {
    base: tr([[-4.6, -1], [4.8, -1], [5, 11], [3.6, 31], [-3.6, 31], [-4.8, 11]], 22, -24),
    regions: [{ poly: tr([[0.2, -1], [4.8, -1], [5, 11], [3.6, 31], [0.2, 31]], 22, -24), muscle: 'forearms', facet: true }],
  },
  fistR: {
    base: tr([[-4.2, -10], [4.2, -10], [5.2, -4], [5, 4], [2.5, 7.5], [-3, 7.5], [-5.2, 3.5], [-5.2, -4]], 22, 16),
    regions: [{ poly: tr([[0, -10], [4.2, -10], [5.2, -4], [5, 4], [2.5, 7.5], [0, 7.5]], 22, 16), facet: true }],
  },
  thighR: {
    base: tr([[-8, -4], [8, -4], [8, 18], [6, 47], [0, 50.5], [-6, 47], [-7.5, 20]], 10, 0),
    regions: [{ poly: tr([[0, -4], [8, -4], [8, 18], [6, 47], [0, 49]], 10, 0), muscle: 'quads', facet: true }],
  },
  kneeCapR: { base: oct(10, 50, 5.8) },
  shinR: {
    base: tr([[-5.5, 49], [5.5, 49], [6, 62], [4, 94], [-4, 94], [-6, 62]], 10, 0),
    regions: [{ poly: tr([[0, 49], [5.5, 49], [6, 62], [4, 94], [0, 94]], 10, 0), muscle: 'calves', facet: true }],
  },
  footR: { base: tr([[-4.5, 93], [4.5, 93], [7, 99], [6.5, 102], [-5.5, 102], [-6, 99]], 10, 0) },
};
const mirPart = p => ({ base: mir(p.base), regions: (p.regions || []).map(r => ({ ...r, poly: mir(r.poly) })) });

// TOP view (camera above a SEATED or STANDING lifter): origin = midpoint between the
// shoulder joints, lifter faces -y (up the screen). A LYING lifter seen from above is
// the front view (the camera sees the front of the body), so it reuses FR.
const TOP = {
  joints: { shoulderR: [22, 0], elbowR: [22, 38], gripR: [22, 78], head: [0, -2] },
  torso: {
    base: [[-10, -12], [10, -12], [21, -8.5], [27, -1.5], [26, 6], [20, 11], [8, 13.5], [-8, 13.5], [-20, 11], [-26, 6], [-27, -1.5], [-21, -8.5]],
    regions: [
      { poly: [[6, -7], [19, -6], [23, -1], [9, 3]], muscle: 'upperTraps' },
      { poly: mir([[6, -7], [19, -6], [23, -1], [9, 3]]), muscle: 'upperTraps' },
      { poly: [[0, 2], [9, 3], [20, 11], [8, 13.5], [0, 13.5]], muscle: 'midBack', facet: true },
      { poly: mir([[0, 2], [9, 3], [20, 11], [8, 13.5], [0, 13.5]]), muscle: 'midBack', facet: true },
    ],
  },
  head: {
    base: [[0, -12], [5, -11], [8.5, -7.5], [10, -2], [8.5, 4], [4.5, 7.5], [0, 8.5], [-4.5, 7.5], [-8.5, 4], [-10, -2], [-8.5, -7.5], [-5, -11]],
    regions: [{ poly: [[-2.2, -11.6], [0, -15], [2.2, -11.6]], facet: true, name: 'nose' }, { poly: [[-8.5, 4], [-4.5, 7.5], [0, 8.5], [4.5, 7.5], [8.5, 4], [0, 1]], facet: true, name: 'crown' }],
  },
  deltoidR: {
    base: tr([[-5, -6], [0, -8.5], [6, -7], [8.5, -1], [7.5, 6], [3, 9], [-3, 8], [-6, 2]], 22, 0),
    regions: [
      { poly: tr([[-5, -6], [0, -8.5], [6, -7], [8.5, -1], [1, 0]], 22, 0), muscle: 'frontDelts', facet: true },
      { poly: tr([[8.5, -1], [7.5, 6], [3, 9], [-3, 8], [1, 0]], 22, 0), muscle: 'rearDelts' },
    ],
  },
  // arms seen from above = the front-view arm parts moved so the shoulder joint is at (22, 0)
  upperArmR: { base: tr(FR.upperArmR.base, 0, 62), regions: [] },
  elbowCapR: { base: tr(FR.elbowCapR.base, 0, 62) },
  forearmR: { base: tr(FR.forearmR.base, 0, 62), regions: [{ poly: tr(FR.forearmR.regions[0].poly, 0, 62), muscle: 'forearms', facet: true }] },
  fistR: { base: tr(FR.fistR.base, 0, 62), regions: [{ poly: tr(FR.fistR.regions[0].poly, 0, 62), facet: true }] },
};

// ---------------------------------------------------------------------------
// Painting. Every body LAYER is drawn in two passes inside the same groups:
//   1) outline pass: each part's polygon with a 3-unit stroke in --fg-line (class olk)
//   2) fill pass: each part's base fill, facets, muscles
// The fill hides the inner half of every stroke, so only the layer's silhouette keeps
// a 1.5 outline and no seam shows where parts overlap (shoulder, elbow, hip, knee).
function fillPart(p, roles = {}, opt = {}) {
  let s = `<polygon class="${opt.far ? 'bf' : 'b'}" points="${pts(p.base)}"/>`;
  if (opt.far) return s;
  for (const r of p.regions || []) {
    const role = r.muscle && roles[r.muscle];
    if (role === 'main') s += `<polygon class="mm anim ${opt.effort || ''}" points="${pts(r.poly)}"/>`;
    else if (role === 'help') s += `<polygon class="mh" points="${pts(r.poly)}"/>`;
    else if (r.facet) s += `<polygon class="fc" points="${pts(r.poly)}"/>`;
  }
  return s;
}
const olPart = (p, far) => `<polygon class="${far ? 'olkf' : 'olk'}" points="${pts(p.base)}"/>`;
// pass-aware helper: P(part) returns the outline or the fill markup for the current pass
const passer = (pass, roles, opt = {}) => p => (pass === 'ol' ? olPart(p, opt.far) : fillPart(p, roles, opt));

// ---------------------------------------------------------------------------
// Timing (spec 2.5): 4 s rep; lift 0-25 %, hold to 37.5 %, return to 87.5 %, pause to 100 %.
function bez(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const X = t => ((ax * t + bx) * t + cx) * t, Y = t => ((ay * t + by) * t + cy) * t;
  return x => { let lo = 0, hi = 1; for (let i = 0; i < 60; i++) { const m = (lo + hi) / 2; if (X(m) < x) lo = m; else hi = m; } return Y((lo + hi) / 2); };
}
const easeIn = bez(0.4, 0, 1, 1), easeOut = bez(0, 0, 0.6, 1);
const inOut = x => (x < 0.5 ? 0.5 * easeIn(2 * x) : 0.5 + 0.5 * easeOut(2 * x - 1));
function progress(u) { // u = fraction of one rep -> p (0 setup .. 1 end pose)
  if (u <= 0.25) return inOut(u / 0.25);
  if (u <= 0.375) return 1;
  if (u <= 0.875) return 1 - inOut((u - 0.375) / 0.5);
  return 0;
}
const SAMPLES = [];
for (let i = 0; i <= 20; i++) SAMPLES.push(i * 1.25);
for (let i = 0; i <= 16; i++) SAMPLES.push(37.5 + i * 3.125);
SAMPLES.push(100);
// LP (QA r3, smooth elbow): extra stops where the arm is nearly straight, at the very start of the pull and over the
// last 6.25 % of the return. There a small hand move bends the elbow a lot, so the 1.25 % / 3.125 % gaps made the
// forearm start and stop at about a fifth of its top speed; with these stops it starts and settles gently.
SAMPLES.push(0.625, 82.8125, 85.9375, 86.71875);
SAMPLES.sort((a, b) => a - b);

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
.b{fill:var(--body)}
.bf{fill:var(--body-far)}
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
.hdf{fill:var(--fg-line-far)}
.pin{fill:var(--accent)}
.rod{fill:none;stroke:var(--fg-frame);stroke-width:calc(var(--sw) * 1.1px)}
.cable{fill:none;stroke:var(--fg-cable);stroke-width:calc(var(--sw) * 1.25px);stroke-linecap:round}
.floor{stroke:var(--border);stroke-width:1px}
.b,.bf,.olk,.olkf,.fc,.mm,.mh,.eq,.eqm,.eqf,.rod,.cable,.floor{vector-effect:non-scaling-stroke}
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
// follows the back edge down to local y -12.5. Only the Lat Pulldown uses this shape.
SIDE.torso.regions = SIDE.torso.regions.map(r => r.muscle === 'lats' ? { ...r, poly: [[-12.2, -52], [-4, -55], [-2, -40], [-3.5, -26], [-3.5, -20], [-5, -12.5], [-10.5, -15], [-9.8, -26], [-11.8, -40]] } : r);

// LP (QA r2, decision D1 closed): the whole solve is a function of the grip Z (hand out to the side from the
// shoulder joint, constant because the bar is rigid), so PLAYER.md can show what other grips would give.
// The build uses Z = 14: hands 72 apart, about 1.2 times the outside shoulder width ("a little wider than
// your shoulders", spec 3.2 Grip caption and About step 2).
// Top of the rep (spec truth table: arms overhead, about 170; elbow about 170, not locked): the hand is placed
// straight above the raised shoulder (5 in front of it) at the reach an elbow of 168 gives, and the slight bend
// points back, so the upper arm sits about 168 from the torso line. This is why the bar starts at about y 66,
// not 72, and a little behind x 156: with the bar at (156, 72) the arm cannot pass about 148 (spec 3.2's own
// key-pose table gives 148.4 there). Path: the bar comes down and forward above the head, straight down in
// front of the face (x 160, so the fist stays clear of the nose), and eases onto the top of the chest (157, 150).
// LP (QA r3, smooth elbow): two changes make every joint's speed rise and fall once per phase (pull, return):
// (1) the elbow's bend direction (the pole) moves along ONE smooth curve over the whole pull, from out to the
//     side (20 degrees forward) at the top, through the plane MID degrees in front of the side plane (at p = PM), to the end
//     elbow; round 2 swung it from out to the side into that plane inside the first 10 % of p, which made the
//     elbow jerk at the start of the pull and at the end of the return;
// (2) the bar's place on its path is h(p) = p - A sin(2 pi p) / (2 pi): h(0.5) = 0.5, so the key poses and the
//     tile times stay where they were (bar half-way at 12.5 %, on the chest at 25 %), but the bar leaves the top
//     a little more gently. Near a straight arm the elbow bends fast for a small hand move, so without this the
//     elbow's first burst came before the hand had got going.
const smooth = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
const LP_OPT = { DX: -2, IN0: 174, B0: 110, XF: 160, YK: 104, YC: 134, X1: 157, Y1: 150, TEND: 26, MID: 50, MD: 0.6, PM: 0.4, A: 0.4 };
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
  const scap = p => { const w = smooth(p / 0.35); return [SC0[0] + (SC1[0] - SC0[0]) * w, SC0[1] + (SC1[1] - SC0[1]) * w]; };
  const shoulder = p => { const d = scap(p), r = rotL([d[0], -62 + d[1]]); return [H[0] + r[0], H[1] + r[1], 0]; };
  const S0 = shoulder(0), R0 = Math.sqrt(38 * 38 + 40 * 40 - 2 * 38 * 40 * Math.cos(rad(o.IN0)));
  const X0 = S0[0] + o.DX, Y0 = S0[1] - Math.sqrt(R0 * R0 - o.DX * o.DX - Z * Z);
  const gx = y => (y <= o.YK ? X0 + (o.XF - X0) * smooth((y - Y0) / (o.YK - Y0)) : y <= o.YC ? o.XF : o.XF + (o.X1 - o.XF) * smooth((y - o.YC) / (o.Y1 - o.YC)));
  const TRAVEL = o.Y1 - Y0;
  const hOf = p => p - o.A * Math.sin(2 * Math.PI * p) / (2 * Math.PI);   // bar's share of its path at pose p (QA r3)
  const gripAt = p => { const y = Y0 + TRAVEL * hOf(p); return [gx(y), y, Z]; };
  // the hand path as a polyline, with its arc length, for the guide and the "still to go" line
  const PN = 96, pathPts = Array.from({ length: PN + 1 }, (_, i) => gripAt(i / PN));
  const cum = [0]; for (let i = 1; i <= PN; i++) cum.push(cum[i - 1] + Math.hypot(pathPts[i][0] - pathPts[i - 1][0], pathPts[i][1] - pathPts[i - 1][1]));
  const pathLen = cum[PN];
  const arcAt = p => { const f = p * PN, i = Math.min(PN - 1, Math.floor(f)); return (cum[i] + (cum[i + 1] - cum[i]) * (f - i)) / cum[PN]; };
  // Poles (which way the elbow bends): at the top out to the side and B0 - 90 = 20 degrees forward, the shoulder
  // blade's own plane, where arms held overhead with an overhand grip really sit (round 2 had it straight out to the
  // side, so the elbow had to swing forward fast at the start; now it has less to travel and the forearm stays clear
  // of the head);
  // over the pull the elbow travels out and forward through a plane MID degrees in front of the body's side plane,
  // pointing a little down (so the upper arm is never drawn short and the forearm stays in front of the face), and
  // ends at the chosen end elbow: down by the side, slightly behind, 25 from the torso line (spec: about 20-30).
  const pole = (f, s, d) => norm(add(add(mul(TF, f), mul(TZ, s)), mul(TD, d)));
  const poleTop = pole(-Math.cos(rad(o.B0)), Math.sin(rad(o.B0)), 0);
  const poleMid = pole(Math.sin(rad(o.MID)), Math.cos(rad(o.MID)), o.MD);
  const S1 = shoulder(1), G1 = gripAt(1);
  const endElbow = (() => {
    const D = sub(G1, S1), d = Math.hypot(...D), ax = mul(D, 1 / d), along = (38 * 38 - 40 * 40 + d * d) / (2 * d), rc = Math.sqrt(38 * 38 - along * along);
    const u = norm(sub(TD, mul(ax, dot(TD, ax)))), v = [ax[1] * u[2] - ax[2] * u[1], ax[2] * u[0] - ax[0] * u[2], ax[0] * u[1] - ax[1] * u[0]];
    const E = add(add(S1, mul(ax, along)), add(mul(u, rc * Math.cos(rad(o.TEND))), mul(v, rc * Math.sin(rad(o.TEND)))));
    const es = sub(E, S1);
    return { E, elev: deg(Math.acos(dot(es, TD) / 38)), behind: -dot(es, TF) };
  })();
  const poleEnd = norm(sub(endElbow.E, S1));
  // one quadratic Bezier curve poleTop -> poleEnd that passes through poleMid at p = PM; its parameter runs at a
  // constant rate on each side of PM with the same speed where they meet, so the pole never stops or lurches
  const poleC = sub(mul(poleMid, 2), mul(add(poleTop, poleEnd), 0.5));
  const bezT = p => (p <= o.PM ? 0.5 * p / o.PM : 0.5 + 0.5 * (p - o.PM) / (1 - o.PM));
  const poleAt = p => { const t = bezT(p); return norm(add(add(mul(poleTop, (1 - t) * (1 - t)), mul(poleC, 2 * t * (1 - t))), mul(poleEnd, t * t))); };
  const raw = p => {
    const S = shoulder(p), G = gripAt(p), r = solve3(S, G, LEN.upperArm, LEN.forearm, poleAt(p));
    const es = sub(r.E, S);
    return { p, S, G, ...r, elev: deg(Math.acos(dot(es, TD) / 38)), behind: -dot(es, TF), uaRaw: -r.phi + LEAN, faRaw: -(r.psi - r.phi), sc: scap(p), bar: [G[0] - X0, G[1] - Y0] };
  };
  // unwrap the two rotations along p, so keyframes never spin the long way round
  const N = 2000, tab = [];
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
  return { H, LEAN, rotL, TD, TF, Z, X0, Y0, Y1: o.Y1, XF: o.XF, X1: o.X1, YK: o.YK, YC: o.YC, TRAVEL, SC0, SC1, scap, shoulder, gripAt, hOf, pathPts, arcAt, pathLen, poleTop, poleMid, poleEnd, endElbow, pose, o };
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
  const svg = `<svg class="inset-fig" viewBox="${vb.map(n2).join(' ')}" aria-hidden="true">${body('ol')}${body('fill')}<path class="lp-barline" d="M${bar.map(p => `${n2(p[0])} ${n2(p[1])}`).join('L')}"/>${arm('ol', 'L')}${arm('fill', 'L')}${arm('ol', 'R')}${arm('fill', 'R')}</svg>`;
  return { svg, grip: [gxR, gy], elbow, uaA, faA, fu, ff, handsApart: 2 * gxR, shouldersOutside: 2 * SHOULDER_OUTSIDE, vb };
}

function latPulldown() {
  const { H, LEAN, X0, Y0, Y1, TRAVEL, pose, arcAt, pathPts } = LP;
  const barLocalD = `M${BAR_PTS.map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;   // bar in the hand's frame (grip at 0, 16)
  // the near end again, from the little-finger side of the hand (HAND_HALF nearer the camera than the grip) out to the tip
  const nearEndD = `M${[barPt(NEAR_Z + HAND_HALF), BAR_PTS[1], BAR_PTS[0]].map(q => `${n2(q[0])} ${n2(16 + q[1])}`).join('L')}`;
  const roles = { lats: 'main', biceps: 'help', midBack: 'help' };
  const FAR = [5, -3];
  const C0 = [X0 + BAR_MID[0], Y0 + BAR_MID[1]];          // bar middle (cable hook) at the top
  const cab = p => { const q = pose(p), c = [C0[0] + q.bar[0], C0[1] + q.bar[1]], dx = c[0] - PF.x, dy = c[1] - (PF.y + PF.r); return { len: Math.hypot(dx, dy), ang: deg(Math.atan2(-dx, dy)) }; };
  const CAB0 = cab(0).len, lift = p => 0.5 * (cab(p).len - CAB0);   // 2:1: the stack rises half as far as the cable pays out
  const LIFT1 = lift(1);
  const BEAM = 36, REAR_TOP = BEAM + 11, REAR_RUN = 106 - REAR_TOP;  // rear pulley r 7 at (47, 47); rear cable to the stack bracket
  // far forearm: from the far grip it aims at the near elbow, so it tucks in behind the near arm (or behind the chest);
  // it is scaled about its wrist end (9 from the grip), so it never parts from the fist
  const farJ = p => { const q = pose(p), zE = SHOULDER_OUT + q.E[2];
    const S = [q.S[0] + DEPTH_K[0] * 2 * SHOULDER_OUT, q.S[1] + DEPTH_K[1] * 2 * SHOULDER_OUT], E = [q.E[0] + DEPTH_K[0] * 2 * zE, q.E[1] + DEPTH_K[1] * 2 * zE], G = [q.G[0] + FAR_GRIP[0], q.G[1] + FAR_GRIP[1]];
    const au = deg(Math.atan2(-(E[0] - S[0]), E[1] - S[1])), af = deg(Math.atan2(-(G[0] - E[0]), G[1] - E[1]));
    return { S, E, G, au, af, fu: Math.hypot(E[0] - S[0], E[1] - S[1]) / LEN.upperArm, ff: Math.hypot(G[0] - E[0], G[1] - E[1]) / LEN.forearm }; };
  const FS0 = farJ(0).S;
  // unwrap the far arm's two screen angles along p
  const farTab = []; for (let i = 0; i <= 2000; i++) { const f = farJ(i / 2000); if (i) { const pr = farTab[i - 1]; while (f.au - pr.au > 180) f.au -= 360; while (f.au - pr.au < -180) f.au += 360; while (f.af - pr.af > 180) f.af -= 360; while (f.af - pr.af < -180) f.af += 360; } farTab.push(f); }
  const far = p => farTab[Math.round(p * 2000)];
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
${kf('lp-ua', p => { const q = pose(p); return `transform:translate(${n2(q.sc[0])}px,${n2(q.sc[1])}px) rotate(${n2(q.ua)}deg)`; })}
${kf('lp-ul', p => `transform:scaleY(${n3(pose(p).fu)})`)}
${kf('lp-fa', p => { const q = pose(p); return `transform:translateY(${n2(-(1 - q.fu) * LEN.upperArm)}px) rotate(${n2(q.fa)}deg)`; })}
${kf('lp-fl', p => `transform:scaleY(${n3(pose(p).ff)})`)}
${kf('lp-hd', p => `transform:translateY(${n2(-(1 - pose(p).ff) * LEN.forearm)}px)`)}
${kf('lp-bar', p => { const q = pose(p); return `transform:rotate(${n2(LEAN - q.ua - q.fa)}deg)`; })}
${kf('lp-fua', p => { const f = far(p); return `transform:translate(${n2(f.S[0] - FS0[0])}px,${n2(f.S[1] - FS0[1])}px) rotate(${n2(f.au)}deg)`; })}
${kf('lp-ful', p => `transform:scaleY(${n3(far(p).fu)})`)}
${kf('lp-ffa', p => { const f = far(p); return `transform:translateY(${n2(-(1 - f.fu) * LEN.upperArm)}px) rotate(${n2(f.af - f.au)}deg)`; })}
${kf('lp-ffl', p => `transform:scaleY(${n3(far(p).ff)})`)}
${kf('lp-fhd', p => `transform:translateY(${n2(-(1 - far(p).ff) * LEN.forearm)}px)`)}
${kf('lp-stack', p => `transform:translateY(${n2(-lift(p))}px)`)}
${kf('lp-cable-f', p => { const c = cab(p); return `transform:rotate(${n2(c.ang)}deg) scaleY(${n2(c.len)})`; })}
${kf('lp-cable-r', p => `transform:scaleY(${n3((REAR_RUN - lift(p)) / REAR_RUN)})`)}
${kf('lp-togo', p => `stroke-dashoffset:${n3(-Math.min(arcAt(p) + TOGO_GAP, 0.999))}`)}
${kf('lp-eff', p => `opacity:${n3(0.75 + 0.25 * p)}`)}
.lp-barline{fill:none;stroke:var(--fg-metal);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
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
  const bodyLayer = pass => { const Pp = passer(pass, roles, { effort: 'lp-eff' }); return `<g class="j lp-torso">${Pp(SIDE.neck)}${Pp(SIDE.torso)}<g class="lp-head">${Pp(SIDE.head)}</g></g>${leg(pass)}`; };
  const upper = pass => { const Pp = passer(pass, roles); return `<g class="j anim lp-ul">${Pp(SIDE.upperArm)}</g>${Pp(SIDE.deltoid)}`; };
  // LP (QA r3): the lat bar is held equipment, so it lives INSIDE the near hand group (spec 2.4, RIG section 4) and can
  // never part from the near hand. It counter-rotates by minus the sum of the arm's rotations (torso -10, ua, fa), as
  // the rig's dumbbells do, so it keeps its fixed look on screen. Two layers, both in the hand group: the whole bar and
  // the hook go under the fist fill (the fist wraps round the bar at the grip); the near end, from the little-finger
  // side of the hand out to its tip, goes over the fist. The near end is nearer the camera than the hand, the forearm
  // and the chest, so nothing may hide it: its visible length stays the same through the rep.
  const barGroup = `<g class="j anim lp-bar"><path class="lp-barline" d="${barLocalD}"/><circle class="lp-hook" cx="${n2(BAR_MID[0])}" cy="${n2(16 + BAR_MID[1])}" r="2.4"/></g>`;
  const barNear = `<g class="j anim lp-bar lp-bar-near"><path class="lp-barline" d="${nearEndD}"/></g>`;
  const lower = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}<g class="j anim lp-fl">${Pp(SIDE.forearm)}</g><g class="j anim lp-hd">${pass === 'fill' ? barGroup : ''}${Pp(SIDE.fist)}${pass === 'fill' ? `${barNear}<circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/>` : ''}</g>`; };
  const arm = `<g class="j lp-torso"><g class="j anim lp-ua arm-near">${upper('ol')}${upper('fill')}<g class="j anim lp-fa">${lower('ol')}${lower('fill')}</g></g></g>`;
  // far hand: the rig's forearm and fist turned to point from the grip toward the elbow (local +y), in the far tones
  // far arm (QA r2 issue 2): the same arm seen on the far side, placed with the rig's depth view (each joint moves
  // (0.25, -0.15) per unit it is further from the camera), in the far tones, behind the bar and the body
  const fpart = part => ({ base: tr(part.base, FS0[0], FS0[1] + 62) });
  const FP = pass => part => (pass === 'ol' ? olPart(fpart(part), true) : fillPart(fpart(part), {}, { far: true }));
  const farUpper = pass => `<g class="j anim lp-ful">${FP(pass)(SIDE.upperArm)}</g>${FP(pass)(SIDE.deltoid)}`;
  const farLower = pass => `${FP(pass)(SIDE.elbowCap)}<g class="j anim lp-ffl">${FP(pass)(SIDE.forearm)}</g><g class="j anim lp-fhd">${FP(pass)(SIDE.fist)}</g>`;
  const farArm = `<g class="far-arm"><g class="j anim lp-fua">${farUpper('ol')}${farUpper('fill')}<g class="j anim lp-ffa">${farLower('ol')}${farLower('fill')}</g></g></g>`;
  let still = '', moving = '';
  for (let i = 0; i < 10; i++) {
    const r = `<rect class="eq" x="16" y="${n2(112.5 + i * 13.5)}" width="48" height="12" rx="1.5"/>`;
    if (i < 7) moving += r; else still += r;
  }
  moving += `<rect class="pin lp-pin" x="63" y="${n2(112.5 + 6 * 13.5 + 4)}" width="9" height="4" rx="2"/>`;   // pin in plate 7 (spec)
  moving += `<rect class="eqm" x="35" y="106" width="10" height="6.5" rx="1"/>`;                        // top bracket the cable pulls
  const pathD = `M${pathPts.map(p => `${n2(p[0])} ${n2(p[1])}`).join('L')}`;
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
<g class="machine-back"><rect class="eq" x="16" y="250" width="246" height="8" rx="1.5"/><g class="lp-stackset"><line class="rod" x1="22" y1="${BEAM + 8}" x2="22" y2="250"/><line class="rod" x1="58" y1="${BEAM + 8}" x2="58" y2="250"/>${still}<g class="j anim lp-stack">${moving}</g><line class="cable j anim lp-cable-r" x1="40" y1="${REAR_TOP}" x2="40" y2="106"/></g><rect class="eq" x="72" y="${BEAM}" width="12" height="${250 - BEAM}" rx="1.5"/><rect class="eq" x="16" y="${BEAM}" width="162" height="8" rx="2"/><g class="lp-stackset"><circle class="eqm" cx="47" cy="${REAR_TOP}" r="7"/><circle class="rod" cx="47" cy="${REAR_TOP}" r="2"/></g><circle class="eqm" cx="${PF.x}" cy="${PF.y}" r="${PF.r}"/><circle class="rod" cx="${PF.x}" cy="${PF.y}" r="2"/></g>
<g class="far-side" transform="translate(${FAR[0]} ${FAR[1]})"><g transform="translate(${H[0]} ${H[1]})">${leg('ol', true)}${leg('fill', true)}</g></g>
${farArm}
<g class="machine-front"><rect class="eq" x="150" y="224" width="9" height="26"/><rect class="eq" x="188" y="191" width="8" height="59"/><rect class="eq" x="118" y="214" width="68" height="10" rx="4"/></g>
<g class="figure" transform="translate(${H[0]} ${H[1]})">${bodyLayer('ol')}${bodyLayer('fill')}</g>
<rect class="eq" x="180" y="184" width="24" height="14" rx="7"/><rect class="ov ov-pad ovs" x="178" y="182" width="28" height="18" rx="9"/>
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
    smoothness,
    series: { fu: dense.map(q => q.fu), ff: dense.map(q => q.ff), inside: dense.map(q => q.inside), ua: sampled.map(q => q.ua), fa: sampled.map(q => q.fa) },
    truth: { topElev2D: angTo([pose(0).E[0] - pose(0).S[0], pose(0).E[1] - pose(0).S[1]], [LP.TD[0], LP.TD[1]]), endElev2D: angTo([pose(1).E[0] - pose(1).S[0], pose(1).E[1] - pose(1).S[1]], [LP.TD[0], LP.TD[1]]), topLine: angTo(sub(pose(0).G, pose(0).S), LP.TD), gripTimes: gripTimes(LP.Z), tile2: { at: TILE2, p: t2.p, elbowBelowShoulder: t2.E[1] - t2.S[1], elbowBelowGrip: t2.E[1] - t2.G[1], forearmFromVertical: Math.abs(deg(Math.atan2(t2.G[0] - t2.E[0], t2.E[1] - t2.G[1]))) }, topInside: pose(0).inside, topElev: pose(0).elev, endInside: pose(1).inside, endElev: pose(1).elev, endBehind: pose(1).behind, endBehind2D: deg(Math.atan2(pose(1).S[0] - pose(1).E[0], pose(1).E[1] - pose(1).S[1])) + LEAN, minFu: Math.min(...dense.map(q => q.fu)), minFf: Math.min(...dense.map(q => q.ff)), liftEnd: LIFT1, travel: TRAVEL },
    geo: { H, X0, Y0, Y1, X1: LP.X1, XF: LP.XF, YK: LP.YK, YC: LP.YC, TRAVEL, Z: LP.Z, NEAR_Z, C0, BEAM, PF, REAR_TOP, REAR_RUN, CAB0, LIFT1, SC0: LP.SC0, SC1: LP.SC1, FS0, DEPTH_K, FAR_GRIP, BAR_MID, BAR_PTS, zooms: { Z1, Z2, Z3 }, inset: { grip: inset.grip, elbow: inset.elbow, handsApart: inset.handsApart, shouldersOutside: inset.shouldersOutside, uaA: inset.uaA, faA: inset.faA } },
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
if (WRITE) fs.writeFileSync(path.join(DIR, 'poses.json'), JSON.stringify({ latPulldown: { keyTable: lp.keyTable, truth: lp.truth, grips: GRIP_OPTIONS, drift: lp.drift, smoothness: lp.smoothness, samples: SAMPLES, cableTravel: lp.cableTravel, geo: lp.geo, series: lp.series, picsAt: EXL.picsAt, chips: EXL.chips, tileBox: EXL.tileBox }, contrast: contrastTable() }, null, 1));
export { EXL, lp, ARTBOARD_CSS, stageMarkup, belowMarkup, tilesMarkup, SAMPLES };
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

Status: built on the final shared rig (\`../rig-final/RIG.md\`), same parts, paint, stroke widths, timing and restart method. QA round 3 fixes are in (section 0 maps each of the 9 issues to its fix and its proof; the round 2 table follows it). Checked in Chromium on 2026-09-27, result: **${summary}** (section 11). The DECIDED lines are the spec 3.2 values this build changes on purpose (decisions D1, D2 and D3, section 9). They need the supervisor's sign-off, and the ready spec.md edit in section 9 has to be applied to spec.md (this task may not write spec.md). The canvas artboard \`../project/Player-LatPulldown.dc.html\` carries the same pieces (section 2). This file is generated by \`node gen.mjs\`, from the same source as \`index.html\`, so the pieces below are exactly what the harness shows.

## In plain words

- A side view of one person doing a lat pulldown: arms straight up overhead at the top, pull the bar down in front of the face to the top of the chest (1 s), squeeze (0.5 s), let it up slowly (2 s), short reset. It plays 3 reps and stops.
- Both hands hold one wide bar. The far arm is drawn behind the head and body in the dimmer "far side" colour. The cable now hangs from the pulley straight down onto the middle of the bar, between the two hands, and it is drawn in front of the far arm, so the bar clearly hangs from the cable, not from the far hand.
- The elbow now moves smoothly: it speeds up once and slows down once on the way down and again on the way up. Before, it jerked at the start of the pull and at the end of the way up.
- The bar is held in the near hand (it is part of the hand in the drawing), so it can never slip out of the hand. The end of the bar that points toward you always shows; before, it disappeared behind the chest at the bottom.
- The close-ups now show what holds the bar: the Grip and Path close-ups show the pulley, the whole cable and both hands; the Pad close-up shows the feet flat on the floor, above the caption that says "feet flat". The small front view in the Grip close-up shows the whole bar with its bent ends, as in the main picture.
- Words changed on purpose (section 9): the Path caption no longer says "straight", because the bar first moves forward above the head and the dashed line shows that curve. At the bottom the elbow is bent to about 35 degrees, not 65-75: with hands only a little wider than the shoulders and arms overhead at the top, that is what a real body does.

## 0. QA round 3: each issue, what changed, and the proof

| # | Issue | What changed | Proof |
|---|---|---|---|
| 1 | [Medium] The front cable is drawn before the far arm, so the far fist hides most of it and the bar seems to hang from the far fist | The front cable is drawn after the far arm, the far leg and the body, and under the guides and the near arm. The front pulley moved from x 152 to x ${g.PF.x}, straight above the cable hook at the top of the rep, so in the setup pose (the pose on screen longest) the cable hangs straight down onto the bar's middle, in the gap between the two fists, not over the far fist. | Check "front cable drawn over the far arm and the body": 0 of 39 points covered at any of 71 phases, including t 0-0.04 and 0.8-1.0 (QA r2: 22 of 39 on the far arm at t 0). Frames \`shots-r3/r3-hi-top-montage.png\` (t 0, 0.03, 0.06, 0.8, 0.84, 0.9), \`r3-tile1-4x.png\`, \`r3-dark-f00.png\`. |
| 2 | [Medium] The elbow jerks at the start of the pull and the end of the return (forearm 0.3, 6.0, 19.8, 14.9, 8.6 degrees per stop; drawn elbow 173.7 to 139.0 in 0.1 s) | Two changes in the solve (section 7). (1) The elbow's bend direction moves along one smooth curve over the whole pull, from out to the side (20 degrees forward, the shoulder blade's own plane) at the top, through the plane ${LP.o.MID} degrees in front of the side plane, to the end elbow; round 2 swung it inside the first 10 % of the pull. (2) The bar leaves the top a little more gently (its place on the path is \`h(p) = p - ${LP.o.A} sin(2 pi p) / (2 pi)\`); the key poses stay at the same times (bar half-way at 12.5 %, on the chest at 25 %). (3) Extra keyframe stops where the arm is nearly straight (0.625 %, 82.8125 %, 85.9375 %, 86.71875 %), so the forearm starts and settles gently instead of at about a fifth of its top speed. | Check "smooth motion (analytic)": every joint (upper arm, forearm, far upper arm, far forearm, drawn elbow angle, elbow point, far elbow point, hand) speeds up once and slows down once in each phase; worst dip ${(lp.smoothness.worst * 100).toFixed(2)} % of the phase's top speed (limit 2 %). Forearm per 1.25 % of the rep, pull: ${lp.smoothness.pull.fa.slice(0, 7).map(v => v.toFixed(1)).join(', ')}, ... Check "smooth motion in the browser": the drawn arm read back at all ${SAMPLES.length} keyframe stops, worst dip under 2 %; drawn elbow ${f(lpSm.a025)} at t 0.025 and ${f(lpSm.a05)} at t 0.05. The fist and forearm still never cover the head (0.00 s). Frames \`r3-hi-elbow-montage.png\` (t 0.02-0.05). |
| 3 | [Low-Medium] The near end of the bar hides behind the chest and neck at t 0.19-0.44, so the bar's visible length changes | The bar is drawn in the near hand group, in two layers: the whole bar and the hook under the fist (the fist wraps round it), and the near end, from the little-finger side of the hand out to its tip, over the fist. The near end is nearer the camera than the hand, the forearm and the chest, so nothing covers it. (Drawing it under the near arm, as QA suggested, would hide it behind the forearm at the bottom instead, because in this view the near end and the forearm point the same way there.) | Check "near end of the bar": its outer half shows at all 41 phases; its bent part is 100 % in view over the whole rep. Frames \`r3-hi-end-montage.png\` (t 0.125, 0.19, 0.25, 0.44). |
| 4 | [Low] The bar is not nested in the hand group, and section 9 did not list that | The bar now lives inside the near hand group (spec 2.4, RIG section 4) and counter-rotates by minus the sum of the arm's rotations, as the rig's dumbbells do, so it keeps its fixed look and the grip can never come apart. No longer a difference from the spec. | Checks "the lat bar is inside the near hand group" (2 of 2 bar layers) and "near hand on the bar": worst gap 0.000 over 201 phases. The far hand stays on the bar's far grip: ${lp.drift.far.toFixed(2)} analytic, under 0.5 in the browser. |
| 5 | [Open, spec] The build disagrees with spec.md 3.2 and spec.md is not edited | Decision D1 stands, checked again (section 9): with hands a little wider than the shoulders and the bar at the top of the chest, the shoulder-to-hand distance forces an elbow of about 35 degrees; the spec's own key-pose table gives 30.5. The About steps match the drawing (grip a little wider than the shoulders, sit with the arms straight, pull to the top of the chest, arms straight again at the top). New: D2 (Path caption) and D3 (Grip and Pad targets). The ready spec.md edit in section 9 now covers all three. | The check summary names every DECIDED value; the exit code stays 3 until the supervisor signs off and spec.md carries the edit. |
| 6 | [Low] The Path caption says "straight down" but the dashed guide first curves ${f(g.XF - g.X0)} units forward above the head | Decision D2: the caption drops "straight": "${EXL.chips[1].caption}" Arms that start straight overhead must bring the bar forward above the head to pass in front of the face with a fixed lean, so the curve is right and the word was wrong. | DECIDED line "Path caption". Frames \`r3-zoom2-t*.png\`, \`r3-pics-zoom2.png\`. |
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
| 5 | Fist or forearm over the face about 1.28 s per rep | Never now (0.00 s); the bar passes in front of the face at x ${g.XF}. |
| 6 | Weight-stack slivers at the edge of the close-ups | The whole stack hides in the Grip and Path close-ups and their stills. |
| 7 | Upper arm drawn at 0.499 of its length | Never below ${f(t.minFu, 2)} now. |
| 8 | Spec changes not written down | Section 9 lists every difference and the ready spec.md edit. |

## 1. Files

| File | What it is |
|---|---|
| \`index.html\` | The harness: the full 358 x 460 player, built exactly as the artboard (pieces A, B, C). Its small script is harness-only: \`?theme=<id>\`, \`?t=<0..1>\` (freeze rep 1 at that point), \`?zoom=1|2|3\` (or grip, path, pad), \`?mode=pictures\`, plus \`?loop=1\` and \`?speed=0.5\`. The buttons work too. |
| \`gen.mjs\` | The single source (rig-final \`gen.mjs\` lines 1-378 copied, changes marked \`LP:\`). Writes \`index.html\`, \`poses.json\` and this file. |
| \`shoot.cjs\` | Every check and the required screenshots in \`shots/\` (\`lp_*.png\`). Writes \`checks.txt\` and \`measured.json\`. Exit code 1 on any FAIL; 2 on any OPEN (a spec value not met that waits for a decision); 3 when everything passes but a DECIDED spec edit still has to be signed off and applied to spec.md; 0 only when all pass. |
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

Easing (baked into the samples, rig section 8): pull and return each ease in (\`cubic-bezier(.4,0,1,1)\`) to their mid pose and ease out (\`cubic-bezier(0,0,.6,1)\`) after it. Tempo note: "${EXL.tempo}". Rep pill: "Rep 1 of 3" to "Rep 3 of 3", one step per rep. Pictures line: "${EXL.picsLine}". Hidden line for screen readers: "${EXL.srText}"

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
| Elbow inside angle, end | about 65-75 | ${f(t.endInside)} | **DECIDED** (section 9): 65-75 needs a grip about twice shoulder width, which cannot reach "about 170" at the top; the spec's own key-pose table has 30.5 |
| Shoulder blades | slightly raised at the top, pulled down and back first | shoulder joint 2.5 up (and 0.5 forward) at the top; 1.5 down and 1.5 back once the bar is 35 % of the way down | yes |
| Torso | 10 degrees back, no swing | fixed 10 | yes |
| Head, hips, knees under the pad, feet, wrists | fixed | fixed | yes |
| Bar | straight down at x 156 in front of the face to the top of the chest, y 72 to 150; stack 0 to 39 | from ${barTop} just above the raised shoulder, forward above the head, straight down at x ${g.XF} in front of the face (y ${g.YK} to ${g.YC}), onto the top of the chest at (${g.X1}, ${g.Y1}); stack 0 to ${f(t.liftEnd)} (half the ${f(lp.cableTravel)} the cable pays out) | **DECIDED** (section 9) |

Key poses (stage units; z = sideways, out from the shoulder joint toward the camera; angles in degrees; \`ua\` and \`fa\` are the keyframe rotations inside the leaned torso frame, unwrapped so they never spin the long way round):

| p | Shoulder | Grip (x, y, z) | Elbow (x, y, z) | ua | fu | fa | ff | Elbow inside | Upper arm from torso line | Bar down | Stack up |
|---|---|---|---|---|---|---|---|---|---|---|---|
${k.map(r => `| ${r.p} | ${r.shoulder.join(', ')} | ${r.grip.join(', ')} | ${r.elbow.join(', ')} | ${r.ua} | ${r.fu} | ${r.fa} | ${r.ff} | ${r.inside} | ${r.elev} | ${r.bar} | ${r.lift} |`).join('\n')}

How the arm is solved (rig section 9, the 3D pole-vector solve): shoulder S(p) with the shoulder-blade offsets, grip G(p) on the path above, upper arm 38, forearm 40. The top pose puts the hand 2 behind the raised shoulder joint and ${g.Z} out to the side, at the reach an elbow of ${f(t.topInside)} gives; there the slight elbow bend points out to the side and ${LP.o.B0 - 90} degrees forward (the shoulder blade's own plane, where arms held overhead with an overhand grip sit).

The elbow's bend direction (the pole) then moves along one smooth curve (a quadratic Bezier, normalised) from that top direction, through a plane ${LP.o.MID} degrees in front of the body's side plane, pointing a little down (reached at p = ${LP.o.PM}), to the chosen end elbow: ${f(t.endElev)} from the torso line, ${f(t.endBehind)} behind the shoulder joint. The curve's parameter runs at a constant rate on each side of p = ${LP.o.PM}, with the same rate where the two sides meet, so the elbow's direction never stops or lurches. The bar's place on its path at pose p is \`h(p) = p - ${LP.o.A} sin(2 pi p) / (2 pi)\`: h(0.5) = 0.5, so the key poses keep their times, and the bar leaves the top a little more gently, because near a straight arm the elbow bends a lot for a small hand move. Round 2 swung the elbow from straight out to the side into the forward plane within the first 10 % of the pull, which made the elbow jerk at the start of the pull and at the end of the return (QA r3 issue 2). The settings (${LP.o.B0 - 90} degrees at the top, ${LP.o.MID} degrees at p = ${LP.o.PM}, A = ${LP.o.A}) came from a search (\`work/r3/explore/\`) for the smoothest motion that also keeps the fist and forearm off the head (0.00 s) and the upper arm drawn at least ${f(t.minFu, 2)} of its length.

Joint speed per keyframe gap (degrees or units per 1.25 % of the rep; the return's gaps are 3.125 %, scaled to match), as the CSS plays it:

| Joint | Pull (0-25 %) | Return (37.5-87.5 %) |
|---|---|---|
${Object.keys(lp.smoothness.pull).map(k => `| ${({ ua: 'upper arm (lp-ua)', fa: 'forearm (lp-fa)', fua: 'far upper arm (lp-fua)', ffa: 'far forearm (lp-ffa)', elbowAngle: 'drawn elbow angle', elbow: 'elbow point', farElbow: 'far elbow point', hand: 'hand' })[k]} | ${lp.smoothness.pull[k].map(v => v.toFixed(1)).join(' ')} | ${lp.smoothness.ret[k].map(v => v.toFixed(1)).join(' ')} |`).join('\n')}

Each row rises once and falls once per phase (worst dip ${(lp.smoothness.worst * 100).toFixed(2)} %). Every keyframe stop is a pose solved at p(u); ${SAMPLES.length} stops per group (every 1.25 % in the pull, every 3.125 % in the return, with extra stops at 0.625 %, 82.8125 %, 85.9375 % and 86.71875 % where the arm is nearly straight), written twice (\`-a\`, \`-b\`). Between stops (every value runs linearly): the far hand stays within ${lp.drift.far.toFixed(2)} of the bar's far grip, the cable's free end within ${lp.drift.cable.toFixed(2)} of the hook (the hook dot has radius 2.4, so the join never shows), and the drawn near hand within ${lp.drift.nearPath.toFixed(2)} of the solved path; the near hand holds the bar in its own group, so its gap is 0.

The far arm: the same arm on the far side, placed with the rig's depth view (each joint moves (0.25, -0.15) for every unit it is further from the camera, the view that puts the far leg at \`translate(5 -3)\` for its 20 units of hip width): far shoulder +44 units of depth, far elbow +2 x its distance from the centre line, far hand +72. It is keyframed with the same method (\`lp-fua\`, \`lp-ful\`, \`lp-ffa\`, \`lp-ffl\`, \`lp-fhd\`), painted in the far tones, and drawn behind the body, the cable and the bar, so the head, the torso and the cable cover it where they really would.

## 8. Scene layout (stage units, back to front)

- Floor x 16-342 at y 258. Base rail x 16-262, y 250-258.
- Weight stack (rig section 7): 10 plates 48 x 12 at x 16-64 from y 112.5; guide rods x 22 and 58 (y ${g.BEAM + 8}-250); the pin in plate 7 (x 63-72, accent); plates 1-7, the pin and the top bracket (x 35-45, y 106) lift together by half the cable travel, 0 to ${f(g.LIFT1, 2)}. Rear pulley r 7 at (47, ${g.REAR_TOP}); the rear cable runs down its left side at x 40 to the bracket and shortens as the stack rises. All of these are in \`.lp-stackset\`, which hides in the Grip and Path close-ups.
- Upright x 72-84, y ${g.BEAM}-250. Top beam x 16-178, y ${g.BEAM}-${g.BEAM + 8}, below the pill row (pills y 10-32). Front pulley r ${g.PF.r} at (${g.PF.x}, ${g.PF.y}) (top at y ${f(g.PF.y - g.PF.r)}, below the pills), straight above the cable hook at the top of the rep. The run between the pulleys is inside the beam.
- Far leg (far tones) at \`translate(5 -3)\`.
- Far arm (far tones), section 7.
- Seat pad x 118-186, y 214-224, post x 150-159. Thigh-pad post x 188-196 (behind the near leg).
- Body (torso, neck and head leaned 10 degrees; seated leg as the chest press). Thigh pad roller x 180-204, y 184-198, rx 7, on top of the thigh.
- Path guide (dashed, the whole hand path) and the "still to go" line (solid accent; \`stroke-dashoffset\` = minus the path fraction already travelled, minus 16 units, so it starts 6 below the fist and shrinks as the bar comes down), plus the target mark: a 10-wide accent line across the path's end at (${g.X1}, ${g.Y1}).
- The front cable (\`lp-cable-f\`), drawn after the far arm, the far leg and the body (QA r3): it hangs on the bar's middle, which is nearer the camera than the far hand and in front of the face, so nothing but the near arm may cover it. One line from the pulley's bottom (${g.PF.x}, ${f(g.PF.y + g.PF.r)}) to the hook; it turns and stretches with the bar (\`rotate()\` and \`scaleY()\` about the pulley bottom, on the same samples).
- The near arm on top. The lat bar lives inside its hand group (\`lp-hd\`; spec 2.4, RIG section 4), so the grip can never come apart: \`lp-bar\` turns by \`rotate(-10 - ua - fa)\` about the grip (0, 16), minus the sum of the arm's rotations, as the rig's dumbbells do, so the bar keeps its fixed look on screen. Two layers: the whole bar and the hook under the fist fill (the fist wraps round the bar), and the near end, from the little-finger side of the hand (${HAND_HALF} nearer the camera than the grip) out to its tip, over the fist. The near end is nearer the camera than the hand, the forearm and the chest, so it always shows and the bar's visible length never changes. The bar: a 4-wide metal line, drawn with the depth view: 150 long, straight between +-48 of the centre line, ends bent down 6. Relative to the near grip: near end (${g.BAR_PTS[0].map(v => f(v, 2)).join(', ')}), bends at (${g.BAR_PTS[1].map(v => f(v, 2)).join(', ')}) and (${g.BAR_PTS[2].map(v => f(v, 2)).join(', ')}), far end (${g.BAR_PTS[3].map(v => f(v, 2)).join(', ')}); far hand at (${g.FAR_GRIP.map(v => f(v, 2)).join(', ')}); the cable hook (metal dot r 2.4) on the middle at (${g.BAR_MID.map(v => f(v, 2)).join(', ')}).
- Then \`.lp-over\`: the same guide, line and mark again, shown only in the Path close-up.
- Muscles: main Lats (effort cue 0.75 to 1.0 opacity); helps Biceps and Mid back.

## 9. Differences from the spec, and why

| Spec 3.2 | Now | Why |
|---|---|---|
| Bar straight down at x 156, y 72 to 150; stack lift 0 to 39 | from ${barTop} forward above the head, straight down at x ${g.XF} in front of the face, onto (${g.X1}, ${g.Y1}); lift 0 to ${f(t.liftEnd)} | Decision D1 below: "about 170" at the top puts the hand about 78 above the raised shoulder (y ${f(g.Y0)}), a little behind x 156. x ${g.XF} in front of the face keeps the fist off the nose (QA r2 issue 5); x ${g.X1} at the end puts the bar on the chest. The stack still rises half as far as the cable pays out. |
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
| Muscle "Mid back" (no side-view region in the rig) | a \`midBack\` region on the side torso, between the upper traps and the lats | So the helper can be tinted. It paints only when an exercise gives mid back a role. |
| Rig side-view lats region | this player only: the region runs on down the back to the waist | With the arm down by the side at the end of the pull, the rig's region was almost fully hidden at the moment the lats work hardest. |
| Pictures and zoom as class strings on the grid (\`pics on\`, \`pics zoomed\`) | root classes \`pictures\`, \`zoom-1\`..\`zoom-3\` | As asked for this build; the reduced-motion rule keys off the same root classes. |

Back to the spec (so no longer differences): the lat bar lives inside the near hand group (spec 2.4, RIG section 4; round 2 moved it with its own keyframes, and section 9 did not say so); the Path close-up target 150, 112, 1.4 (round 2 had 152, 136, 1.6); Pictures tile 2 at 12.5 % (the fist is ${face ? face.tile2Gap.toFixed(1) : '?'} clear of the face there and the elbow is in view under the bar); the Grip bubble text "Hands a little wider than your shoulders, thumbs around the bar."

### Decision D1 (decided by the builder; waits for the supervisor's sign-off): the arm angle at the top, and the grip width

In plain words: spec 3.2 asked for four things that cannot all be true at once in any drawing of a real body:

1. Arms about 170 degrees overhead at the top (truth table).
2. The elbow bent to 65-75 degrees at the bottom (truth table).
3. Hands "a little wider than your shoulders" (Grip bubble and About step 2).
4. The bar straight down at x 156 from y 72 (anchors), which with the lean puts the hand in front of the shoulder at the top.

What each grip gives, with the same rig, lean, shoulder blades and path method (hand straight above the raised shoulder at the top; computed by \`makeLP(Z)\` in \`gen.mjs\`):

| Hands apart (times the outside shoulder width) | Hand out from the shoulder joint | Arm at the top, from the torso line | Elbow at the bottom | Shoulder moves | Upper arm never drawn shorter than | Bar starts at y |
|---|---|---|---|---|---|---|
${GRIP_OPTIONS.map(o => `| ${f(o.times, 2)}${o.Z === GRIP_Z ? ' (built: "a little wider")' : o.Z === 39 ? ' (round-1 build)' : o.Z === 0 ? ' (hands straight above the shoulders)' : ''} | ${o.Z} | ${f(o.topElev)} | ${f(o.endInside)} | ${f(o.rom)} | ${f(o.minFu, 2)} | ${f(o.Y0)} |`).join('\n')}

A wider grip opens the elbow at the bottom toward 65-75, but tips the arms out to the side, so they cannot get overhead; no grip meets 1 and 2 together. With the bar at (156, 72), no grip reaches 170 at all.

Decision: keep what a beginner reads and sees, and what the lats need: the spec's grip words (3) and arms overhead at the top (1), with the shoulder moving about 140. Hands ${f(G14.times, 2)} times the outside shoulder width. The bottom elbow follows from that: ${f(G14.endInside)}, which is what spec 3.2's own key-pose table already gives (30.5). The round-1 wide grip (${f(G39.times, 2)} times) reached only ${f(G39.topElev)} at the top even with this path. Decided by the builder under the working rule "decide, don't ask" (AGENTS.md), because QA round 2 marked the open item as a failure. QA round 2 checked the geometry on its own and it holds: at the bottom the shoulder joint (${[].concat(end.shoulder).join(', ')}) is ${f(Math.hypot(g.X1 - Number([].concat(end.shoulder)[0]), g.Y1 - Number([].concat(end.shoulder)[1]), g.Z))} from the hand (${g.X1}, ${g.Y1}, ${g.Z} out), and a 38 upper arm with a 40 forearm can span that only with the elbow at about 35 degrees. It still needs the supervisor's sign-off; the supervisor can reverse it, and the table above shows the cost of each other grip.

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

### Decision D2 (decided by the builder; waits for the supervisor's sign-off): the Path caption

Spec 3.2: "The bar comes straight down in front of your face to the top of your chest." Arms that start straight overhead, with a fixed lean, must bring the bar ${f(g.XF - g.X0)} units forward above the head before it can pass in front of the face; the dashed guide in the Path close-up shows that curve, so a beginner would see a curve while reading "straight". Now: "${EXL.chips[1].caption}" The part in front of the face is straight, and the words no longer claim more.

### Decision D3 (decided by the builder; waits for the supervisor's sign-off): the Grip and Pad close-up targets

- Grip: spec 156, 111, 1.8; now ${z.Z1.cx}, ${z.Z1.cy}, ${z.Z1.s}. The hand travels 84 units, so at 1.8 no camera spot holds the setup pose's pulley and far arm and the chest pose's ring at once: at the setup pose (the pose shown longest: before Play, after the 3 reps, and in the Grip still) the pulley and the top of the far arm were cut off, so the bar had no visible link to the machine (QA r2). At ${z.Z1.s} the pulley, the whole cable and both fists show at the setup pose, and the ring stays inside the stage, above the bubble and left of the inset for the whole rep.
- Pad: spec 192, 200, 2.2; now ${z.Z3.cx}, ${z.Z3.cy}, ${z.Z3.s}. At the spec's target the feet sat under the bubble that says "feet flat" (QA r2: feet bottom 265.6, bubble 210-264). Now the thigh pad, the arrow above it, the shins and the feet flat on the floor all show above the bubble.
- Path: back on the spec's own 150, 112, 1.4.

### Spec edit to apply to spec.md section 3.2 (ready to paste)

Applied to \`../spec.md\` section 3.2 on 2026-09-27 (items 1-7 below, word for word; the supervisor's sign-off of D1-D3 is still open). The lines replaced in section 3.2:

1. Camera line, last sentence. Old: "The bar is drawn as a 44-unit bar seen slightly from the front so it reads as a bar, not a dot." New: "The bar is drawn with the rig's slight view from the front and above (the view of the far leg: 0.25 across and 0.15 up for every unit of depth), 44 units long on screen, with both hands on it; the far arm is drawn in the far tones behind the head and body, for this player only (an exception to RIG section 7)."
2. Equipment line. New: "base rail x 16-262, y 250-258; upright x 72-84, y 36-250; top beam x 16-178, y 36-44; front pulley r 5.2 at (${g.PF.x}, 39.2); rear pulley r 7 at (47, 47); cable bar middle -> front pulley -> beam -> rear pulley -> stack bracket; weight stack: the rig's 10 plates 48 x 12 at x 16-64 from y 112.5, pin at plate 7; seat pad x 118-186, y 214-224 on a post; thigh pad roller x 180-204, y 184-198 (radius 7) on a post; lat bar 150 long (ends bent down 6 over the last 27), hands 72 apart, the cable on its middle."
3. Anchors line, last two sentences. Old: "Bar straight down at x 156: y 72 → 150. Stack lift 0 → 39." New: "Grip ${g.Z} out from each shoulder joint (hands 72 apart, about 1.2 times the outside shoulder width). Bar (grip centre) from (${f(g.X0)}, ${f(g.Y0)}), just above the raised shoulder, forward above the head to x ${g.XF} at y ${g.YK}, straight down at x ${g.XF} in front of the face to y ${g.YC}, onto the top of the chest at (${g.X1}, ${g.Y1}). Stack lift 0 → ${f(t.liftEnd)} (half the cable travel)."
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
| D1-D3 not yet signed off (spec.md section 3.2 already carries them, applied 2026-09-27) | \`shoot.cjs\` reports the ${(checks.match(/^DECIDED/gm) || []).length} DECIDED lines (D1, D2, D3) and exits with code 3 until the supervisor signs them off (it does not read spec.md, so code 3 stays until then). |
| The far arm is new to the rig (RIG section 7 said never) and could clutter the face | It is drawn in the far tones and behind the head and body, so it never covers the face; at 2x zoom the far hand is 21 units away on the same bar, where a second hand belongs. If the supervisor prefers the rig rule, deleting \`.far-arm\` leaves a correct bar without the far hand (QA r2 issue 2 would then return). |
| The upper arm crosses the face ${faceEdge} | Measured by \`shoot.cjs\` (any near-arm part over the face's front edge, 401 phases). It happens only while the bar is above the head, as the arms come down from overhead or go back up. While the bar passes the face, the face is always clear (0 of those phases), and the fist or forearm never covers the head at all (was 1.28 s). Avoiding it completely would need the elbow to swing straight at the camera, which draws the upper arm short (QA r2 issue 7). |
| The bar moves forward about ${f(g.XF - g.X0)} units above the head before it comes straight down | That is where arms that start straight overhead must bring the bar to pass in front of the face with a fixed lean. The Path caption no longer says "straight" (D2), so the words match the curved dashed guide. |
| The arm is nearly straight at the very start of the pull and the end of the return, where a small hand move bends the elbow a lot | Extra keyframe stops there. The near forearm now starts at ${f(lp.smoothness.pull.fa[0])} and settles at ${f(lp.smoothness.ret.fa[lp.smoothness.ret.fa.length - 1])} degrees per 1.25 % of the rep (top speed ${f(Math.max(...lp.smoothness.pull.fa))}). The far forearm, dim and behind the head, still turns ${f(lp.smoothness.ret.ffa[lp.smoothness.ret.ffa.length - 2])} then ${f(lp.smoothness.ret.ffa[lp.smoothness.ret.ffa.length - 1])} degrees per 1.25 % in the last two stops of the return (top speed ${f(Math.max(...lp.smoothness.ret.ffa))}): its speed still rises once and falls once, but it settles late. Left as is: it is the far side, drawn behind the head in the far tones; a change would mean a new far-arm solve. |
| At the bottom the near end of the bar lies over the near forearm | In this view the near end and the forearm point the same way there. The near end is nearer the camera than the forearm, so drawing it on top is right; drawing it under the arm (QA r2's suggestion) would hide it behind the forearm there and bring back the changing bar length. |
| The hand-to-bar gap between baked samples is ${lp.drift.far.toFixed(2)} (round 1: 0.31) | Below the 0.5 limit analytically and in the browser (section 11); the fist is 12 wide, so it does not show. More samples would add page size for no visible gain. |
| Someone edits a keyframe by hand and a hand leaves the bar | Change \`gen.mjs\` and rebuild; \`shoot.cjs\` fails when either hand's gap passes 0.5 or an angle leaves its range. |
| Pictures 2 and 3 both show the bar low | Tile 2 (12.5 %) has the bar at the forehead with the elbows under it and a down arrow; tile 3 (31 %) has it on the chest. |
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
