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
.pics.on{display:grid}
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
    this.state = { playing: auto, started: auto, ended: false, speed: 1, mode: rm ? 'pics' : 'anim', zoom: null, gen: 'a', elapsed: 0, rm: rm, freeze: null };
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
    if (s.mode !== 'anim') { this.setState({ mode: 'anim', zoom: null, gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false, freeze: null }, () => this.startClock()); return; }
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
    this.setState({ mode: m, zoom: null, gen: this.flip(), elapsed: 0, playing: false, started: false, ended: false, freeze: null });
  }
  pickZoom(id) {
    const s = this.state, z = s.zoom === id ? null : id;
    this.setState(s.mode === 'pics' ? { zoom: z, gen: this.flip() } : { zoom: z });
  }
  renderVals() {
    const s = this.state, p = this.props, loop = on(p.loop), dur = this.repDur();
    const still = s.mode === 'pics' && !!s.zoom;
    let play = s.playing && s.mode === 'anim' ? 'running' : 'paused', delay = 0;
    if (still) delay = -(s.zoom === EX.pathChip ? EX.picsAt[2] : EX.picsAt[0]) * dur;
    if (s.freeze !== null) { play = 'paused'; delay = -s.freeze * dur; }
    const chip = EX.chips.find(c => c.id === s.zoom);
    const anim = s.mode === 'anim';
    return {
      rootStyle: `${themeVars(p.theme)};${rigVars(p.theme)};--play:${play};--dur:${dur}s;--iter:${loop ? 'infinite' : 3};--sets:${loop ? 'infinite' : 1};--delay:${delay}s`,
      rootClass: `player gen-${s.gen}`,
      camClass: `cam zoom-${s.zoom}`,
      picsClass: s.zoom ? 'pics zoomed' : (s.mode === 'pics' ? 'pics on' : 'pics'),
      showRepPill: anim && !chip,                 // a zoom view shows only the scene and its bubble
      showSlow: anim && s.speed === 0.5,
      showCamLabel: anim && !chip,
      showBubble: !!chip,
      bubbleText: chip ? chip.caption : '',
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
      chips: EX.chips.map(c => ({ id: c.id, label: c.label, pressed: s.zoom === c.id, pick: () => this.pickZoom(c.id) })),
      togglePlay: () => this.togglePlay(),
      speedTo1: () => this.setSpeed(1), speedToHalf: () => this.setSpeed(0.5),
      toAnim: () => this.setMode('anim'), toPics: () => this.setMode('pics'),
    };
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
}
const q = new URLSearchParams(location.search);
const props = { theme: q.get('theme') || 'silent-black', autoplay: q.get('autoplay') !== '0', loop: q.get('loop') !== '0' };
const comp = new Component(props);
if (q.get('mode') === 'pics') Object.assign(comp.state, { mode: 'pics', playing: false, started: false });
if (q.get('zoom')) comp.state.zoom = q.get('zoom');
if (q.get('speed') === '0.5') comp.state.speed = 0.5;
if (q.has('t')) Object.assign(comp.state, { freeze: Math.min(1, Math.max(0, +q.get('t') || 0)), playing: false, started: true });
comp.freeze = t => comp.setState({ freeze: t, playing: false, started: true });
bind(comp); comp.componentDidMount(); window.__rig = comp;
document.getElementById('harness-note').textContent = 'Harness only: theme ' + props.theme + (comp.state.freeze !== null ? ', frozen at t = ' + comp.state.freeze : ', live') + '. Query: ?theme= &t= &zoom= &mode=pics &loop=0 &autoplay=0 &speed=0.5';
`;

// ---------------------------------------------------------------------------
const ICON = {
  play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7z" fill="currentColor"/></svg>',
  pause: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 5v14M16 5v14"/></svg>',
  replay: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4"/></svg>',
  zoom: '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5"/></svg>',
};

function arrowSvg(a) { // a = { from:[x,y], to:[x,y] } in scene units
  const [x0, y0] = a.from, [x1, y1] = a.to, L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
  const hx = x1 - ux * 6, hy = y1 - uy * 6, nx = -uy * 4, ny = ux * 4;
  return `<path class="arrow" d="M${n2(x0)} ${n2(y0)}L${n2(hx)} ${n2(hy)}"/><polygon class="arrow-head" points="${pts([[x1, y1], [hx + nx, hy + ny], [hx - nx, hy - ny]])}"/>`;
}

function page(ex) {
  const exPublic = { rep: ex.rep, picsAt: ex.picsAt, pathChip: 'path', chips: ex.chips };
  const logic = `const THEMES = ${JSON.stringify(THEMES)};\n${themeVars.toString()}\n${rigVars.toString()}\nconst EX = ${JSON.stringify(exPublic)};\nconst on = ${on.toString()};\n${Component.toString()}`;
  const tiles = ex.pics.map((cap, i) => `<div class="tile"><svg viewBox="${ex.tileBox.join(' ')}" aria-hidden="true"><use href="#rig-${ex.id}" style="--play:paused;--sw:.75;--delay:calc(var(--dur) * -${ex.picsAt[i]})"/>${ex.arrows[i] ? arrowSvg(ex.arrows[i]) : ''}</svg><span class="badge">${i + 1}</span><p>${cap}</p></div>`).join('');
  const defaultStyle = `${themeVars('silent-black')};${rigVars('silent-black')};--play:running;--dur:4s;--iter:infinite;--sets:infinite;--delay:0s`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=390">
<title>${ex.title}</title>
<style>
/* Artboard: everything in this <style> goes into <helmet><style>. */
${BASE_CSS}
${ex.css}
</style>
<style>/* harness only: page padding and the note under the player */ body{padding:16px}.harness-note{margin:10px 0 0;width:358px;font-size:12px;line-height:16px;color:GrayText}</style>
</head>
<body>
<div class="player gen-a" data-class="rootClass" data-style="rootStyle" style="${defaultStyle}">
<div class="stage">
<svg class="scene" viewBox="0 0 358 276" aria-hidden="true"><g class="cam zoom-null" data-class="camClass"><g id="rig-${ex.id}">
${ex.scene}
</g>${ex.staticOverlays || ''}</g></svg>
<div class="pill-row" data-if="showRepPill"><span class="pill"><span class="stack"><span class="repx r1">${ex.repWord} 1 of 3</span><span class="repx r2">${ex.repWord} 2 of 3</span><span class="repx r3">${ex.repWord} 3 of 3</span></span></span><span class="pill pill-accent" data-if="showSlow" hidden>Slow motion</span></div>
<div class="cam-label" data-if="showCamLabel">${ex.cam}</div>
<div class="pics" data-class="picsClass">${tiles}</div>
<div class="bubble" data-if="showBubble" hidden><span class="dot"></span><span data-text="bubbleText"></span></div>
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
  const FAR = [5, -3];
  const pose = p => {
    const x = X0 + (X1 - X0) * p, G = [...grip2(x), Z0 + (Z1 - Z0) * p];
    const pole = norm(add(mul(pole0, 1 - p), mul(pole1, p)));
    const r = solve3(S, G, LEN.upperArm, LEN.forearm, pole);
    return { p, x, G, alpha: lever(x), ...r, ua: -r.phi, fa: -(r.psi - r.phi), lift: 0.5 * (x - X0) };
  };
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
${kf('cp-ua', p => `transform:rotate(${n2(pose(p).ua)}deg)`)}
${kf('cp-ul', p => `transform:scaleY(${n3(pose(p).fu)})`)}
${kf('cp-fa', p => { const q = pose(p); return `transform:translateY(${n2(-(1 - q.fu) * LEN.upperArm)}px) rotate(${n2(q.fa)}deg)`; })}
${kf('cp-fl', p => `transform:scaleY(${n3(pose(p).ff)})`)}
${kf('cp-hd', p => `transform:translateY(${n2(-(1 - pose(p).ff) * LEN.forearm)}px)`)}
${kf('cp-lever', p => `transform:rotate(${n2(pose(p).alpha)}deg)`)}
${kf('cp-stack', p => `transform:translateY(${n2(-pose(p).lift)}px)`)}
${kf('cp-cable', p => `transform:scaleY(${n3((45 - pose(p).lift) / 45)})`)}
${kf('cp-trail', p => `stroke-dashoffset:${n3(1 - trailS(p))}`)}
${kf('cp-eff', p => `opacity:${n3(0.75 + 0.25 * p)}`)}
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
  const bodyLayer = pass => { const Pp = passer(pass, roles, { effort: 'cp-eff' }); return `${Pp(SIDE.neck)}${Pp(SIDE.torso)}${Pp(SIDE.head)}${leg(pass)}`; };
  const upper = pass => { const Pp = passer(pass, roles); return `<g class="j anim cp-ul">${Pp(SIDE.upperArm)}</g>${Pp(SIDE.deltoid)}`; };
  const lower = pass => { const Pp = passer(pass, roles); return `${Pp(SIDE.elbowCap)}<g class="j anim cp-fl">${Pp(SIDE.forearm)}</g><g class="j anim cp-hd">${Pp(SIDE.fist)}${pass === 'fill' ? `<circle class="ov ov-grip ovs" cx="0" cy="16" r="12"/>` : ''}</g>`; };
  const arm = `<g class="j anim cp-ua arm-near">${upper('ol')}${upper('fill')}<g class="j anim cp-fa">${lower('ol')}${lower('fill')}</g></g>`;
  const leverG = far => `<g class="j anim cp-lever${far ? ' far-lever' : ' lever-near'}"><polygon class="${far ? 'eqf' : 'eqm'}" points="${pts([[P[0] - 2.6, P[1]], [P[0] + 2.6, P[1]], [P[0] + 2.6, P[1] + R - HALF + 1], [P[0] - 2.6, P[1] + R - HALF + 1]])}"/><rect class="${far ? 'hdf' : 'hd'}" x="${n2(P[0] - 3.2)}" y="${n2(P[1] + R - HALF)}" width="6.4" height="${2 * HALF}" rx="3"/></g>`;
  let still = '', moving = '';
  for (let i = 0; i < 10; i++) {
    const r = `<rect class="eq" x="26" y="${n2(112.5 + i * 13.5)}" width="48" height="12" rx="1.5"/>`;
    if (i < 6) moving += r; else still += r;
  }
  moving += `<rect class="pin" x="73" y="${n2(112.5 + 5 * 13.5 + 4)}" width="9" height="4" rx="2"/>`;   // selector pin in plate 6 (accent)
  moving += `<rect class="eqm" x="45" y="106" width="10" height="6.5" rx="1"/>`;                     // top bracket the cable pulls
  const RT = R + HALF;                                                  // trail radius: the handle's bottom tip
  const tip = al => [P[0] - RT * Math.sin(rad(al)), P[1] + RT * Math.cos(rad(al))];
  const trailPts = Array.from({ length: 33 }, (_, i) => tip(a0 + (a1 - a0) * i / 32));
  const trailD = 'M' + trailPts.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
<g class="machine-back"><rect class="eq" x="20" y="250" width="162" height="8" rx="1.5"/><line class="rod" x1="32" y1="56" x2="32" y2="250"/><line class="rod" x1="68" y1="56" x2="68" y2="250"/>${still}<g class="j anim cp-stack">${moving}</g><rect class="eq" x="88" y="52" width="12" height="198" rx="1.5"/><rect class="eq" x="22" y="44" width="192" height="10" rx="2"/><line class="cable j anim cp-cable" x1="50" y1="61" x2="50" y2="106"/><circle class="eqm" cx="55" cy="61" r="5.2"/><line class="cable" x1="55" y1="55.8" x2="${n2(P[0] - 6)}" y2="55.8"/></g>
<g class="far-side" transform="translate(${FAR[0]} ${FAR[1]})">${leverG(true)}<g transform="translate(${H[0]} ${H[1]})">${leg('ol', true)}${leg('fill', true)}</g></g>
<g class="machine-front"><rect class="eq" x="150" y="222" width="9" height="28"/><rect class="eq" x="100" y="168" width="26" height="8"/><rect class="eq" x="124.5" y="108" width="13" height="104" rx="4"/><rect class="eq" x="118" y="214" width="82" height="10" rx="4"/></g>
<g class="figure" transform="translate(${H[0]} ${H[1]})">${bodyLayer('ol')}${bodyLayer('fill')}</g>
${leverG(false)}<circle class="eqm" cx="${P[0]}" cy="${P[1]}" r="7"/><circle class="rod" cx="${P[0]}" cy="${P[1]}" r="2"/>
<path class="guide" d="${trailD}"/><path class="trail j anim cp-trail" d="${trailD}" pathLength="1"/>
<g class="figure-arm" transform="translate(${H[0]} ${H[1]})">${arm}</g>
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
    css, scene,
  };
  fs.writeFileSync(path.join(DIR, 'chest-press.html'), page(ex));
  const row = q => ({ p: n2(q.p), grip: [n2(q.G[0]), n2(q.G[1]), n2(q.G[2])], elbow: q.E.map(n2), lever: n2(q.alpha), upper: n2(q.ua), fu: n3(q.fu), fore: n2(q.fa), ff: n3(q.ff), inside: n2(q.inside), outFromSide: n2(q.outFromSide), forward: n2(q.forward), lift: n2(q.lift) });
  return {
    maxDrift, keyTable: [0, 0.25, 0.5, 0.75, 1].map(p => row(pose(p))),
    setup: { Z0, Z1, ez0, pole0, pole1, X0, X1, P, R, E0, S },
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
  const A = p => 12 + 76 * p;     // arm out from the side, degrees
  const BEND = 15;                // constant soft elbow
  const DROP = 14;                // trail runs 14 below the grip: under the dumbbell, never under the arm
  const css = `
${animRule('lr-ua-r', 'lr-ua-r', origin(22, -62))}
${animRule('lr-ua-l', 'lr-ua-l', origin(-22, -62))}
.lr-fa-r{${origin(22, -24)};transform:rotate(${BEND}deg)}
.lr-fa-l{${origin(-22, -24)};transform:rotate(-${BEND}deg)}
${animRule('lr-db-r', 'lr-db-r', origin(22, 16))}
${animRule('lr-db-l', 'lr-db-l', origin(-22, 16))}
${animRule('lr-trail', 'lr-trail')}
${animRule('lr-eff', 'lr-eff')}
${kf('lr-ua-r', p => `transform:rotate(${n2(-A(p))}deg)`)}
${kf('lr-ua-l', p => `transform:rotate(${n2(A(p))}deg)`)}
${kf('lr-db-r', p => `transform:rotate(${n2(A(p) - BEND)}deg)`)}
${kf('lr-db-l', p => `transform:rotate(${n2(-(A(p) - BEND))}deg)`)}
${kf('lr-trail', p => `stroke-dashoffset:${n3(1 - p)}`)}
${kf('lr-eff', p => `opacity:${n3(0.75 + 0.25 * p)}`)}
.cam.zoom-shoulders{transform:translate(179px,138px) scale(2.2) translate(-179px,-90px)}
.cam.zoom-path{transform:translate(179px,138px) scale(1.2) translate(-179px,-135px)}
.cam.zoom-elbows{transform:translate(179px,138px) scale(2.2) translate(-179px,-113px)}
.zoom-shoulders .ov-shoulders,.zoom-elbows .ov-elbows{opacity:1}
`;
  // hex dumbbell seen almost end-on from a little above: top band + end face + metal handle end
  const dumbbell = (gx, gy) => {
    const c = [gx, gy + 5], r = 8, sy = 0.92, h = 3.8, v = hexv(c[0], c[1], r, sy);
    const band = [v[3], v[4], v[5], v[0], [v[0][0], v[0][1] - h], [v[5][0], v[5][1] - h], [v[4][0], v[4][1] - h], [v[3][0], v[3][1] - h]];
    return `<polygon class="eqm" points="${pts(band)}"/><polygon class="eqm" points="${pts(v)}"/><polygon class="hd" points="${pts(hexv(c[0], c[1], 2.7, sy))}"/>`;
  };
  const side = s => {
    const M = s === 'r' ? (p => p) : mirPart, g = s === 'r' ? 22 : -22;
    const up = pass => { const Pp = passer(pass, roles, { effort: 'lr-eff' }); return `${Pp(M(FR.upperArmR))}${Pp(M(FR.deltoidR))}`; };
    const lo = pass => { const Pp = passer(pass, roles); return `${Pp(M(FR.elbowCapR))}${Pp(M(FR.forearmR))}${Pp(M(FR.fistR))}`; };
    return `<g class="j anim lr-ua-${s} arm-${s}">${up('ol')}${up('fill')}<g class="j lr-fa-${s}">${lo('ol')}${lo('fill')}<circle class="ov ov-elbows ovs" cx="${g}" cy="-24" r="8"/><g class="j anim lr-db-${s}">${dumbbell(g, 16)}</g></g></g>`;
  };
  const legs = pass => { const Pp = passer(pass, roles); return ['r', 'l'].map(s => { const M = s === 'r' ? (p => p) : mirPart; return `${Pp(M(FR.thighR))}${Pp(M(FR.kneeCapR))}${Pp(M(FR.shinR))}${Pp(M(FR.footR))}`; }).join(''); };
  const bodyLayer = pass => { const Pp = passer(pass, roles); return `${legs(pass)}${Pp(FR.neck)}${Pp(FR.torso)}${Pp(FR.head)}`; };
  const grip = (p, sgn) => { const a = A(p); const E = [22 + 38 * Math.sin(rad(a)), -62 + 38 * Math.cos(rad(a))]; const Gp = [E[0] + 40 * Math.sin(rad(a - BEND)), E[1] + 40 * Math.cos(rad(a - BEND))]; return [sgn * Gp[0], Gp[1]]; };
  const trailR = Array.from({ length: 33 }, (_, i) => { const g = grip(i / 32, 1); return [g[0], g[1] + DROP]; });
  const trailL = trailR.map(([x, y]) => [-x, y]);
  const dR = 'M' + trailR.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L'), dL = 'M' + trailL.map(([x, y]) => `${n2(x)} ${n2(y)}`).join('L');
  const trapR = [[7, -75], [17.5, -72], [24, -67.5]];                 // 4 to 5 units above the trap slope
  const downR = { from: [H[0] + 30, H[1] - 90], to: [H[0] + 30, H[1] - 75] }, downL = { from: [H[0] - 30, H[1] - 90], to: [H[0] - 30, H[1] - 75] };
  const scene = `<line class="floor" x1="16" y1="258" x2="342" y2="258"/>
<g class="figure" transform="translate(${H[0]} ${H[1]})">
${bodyLayer('ol')}${bodyLayer('fill')}
<path class="guide" d="${dR}"/><path class="guide" d="${dL}"/><path class="trail j anim lr-trail" d="${dR}" pathLength="1"/><path class="trail j anim lr-trail" d="${dL}" pathLength="1"/>
${side('l')}
${side('r')}
<polyline class="ov ov-shoulders ovs" points="${pts(trapR)}"/><polyline class="ov ov-shoulders ovs" points="${pts(mir(trapR))}"/>
</g>`;
  const staticOverlays = `<g class="ov ov-shoulders">${arrowSvg(downR)}${arrowSvg(downL)}</g>`;
  // arrows for tiles 2 and 4: outside the right trail at p = 0.5, along the tangent
  const tA = p => { const g = grip(p, 1); return [g[0] + H[0], g[1] + DROP + H[1]]; };
  const pa = tA(0.42), pb = tA(0.58), mid = tA(0.5);
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
    tileBox: [66, 56, 226, 208],
    arrows: [null, up, null, { from: up.to, to: up.from }],
    css, scene, staticOverlays,
  };
  fs.writeFileSync(path.join(DIR, 'lateral-raise.html'), page(ex));
  const key = p => { const g = grip(p, 1); return { p: n2(p), A: n2(A(p)), outFromSide: n2(A(p)), inside: n2(180 - BEND), gripR: [n2(g[0] + H[0]), n2(g[1] + H[1])] }; };
  return { keyTable: [0, 0.25, 0.5, 0.75, 1].map(key), truth: { startA: A(0), endA: A(1), topGripY: grip(1, 1)[1] + H[1], shoulderY: 94 }, geo: { H }, parts: { dumbbellR: dumbbell(22, 16) } };
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
  const sideSvg = `<g transform="translate(179 156)">${sideFig('ol')}${sideFig('fill')}<g>${sideArm('ol')}${sideArm('fill')}<g>${sideLow('ol')}${sideLow('fill')}</g></g></g>`;
  const frontSvg = `<g transform="translate(179 156)">${frontBody('ol')}${frontBody('fill')}${['l', 'r'].map(s => `<g>${frontArm(s, 'ol')}${frontArm(s, 'fill')}<g>${frontLow(s, 'ol')}${frontLow(s, 'fill')}</g></g>`).join('')}</g>`;
  // top view, seated rear delt fly start pose: arms forward (rotate 180 -+ 10), soft bend 12
  const topSvg = `<g transform="translate(179 160)">${['l', 'r'].map(s => { const sg = s === 'r' ? 1 : -1; return `<g class="j" style="${origin(sg * 22, 0)};transform:rotate(${sg * (180 - 4)}deg)">${topArm(s, 'ol')}${topArm(s, 'fill')}<g class="j" style="${origin(sg * 22, 38)};transform:rotate(${-sg * 8}deg)">${topLow(s, 'ol')}${topLow(s, 'fill')}</g></g>`; }).join('')}${topBody('ol')}${topBody('fill')}${topHead('ol')}${topHead('fill')}</g>`;
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
    s += `<!-- ${name}  (lives in: ${group}) -->\n<polygon class="olk" points="${pts(p.base)}"/>  <!-- outline pass -->\n<polygon class="b" points="${pts(p.base)}"/>  <!-- fill pass -->\n`;
    for (const r of p.regions || []) s += `<polygon class="fc" data-region="${r.muscle || r.name || 'facet'}" points="${pts(r.poly)}"/>${r.muscle ? `  <!-- mm if main, mh if helps, ${r.facet ? 'fc' : 'omit'} otherwise -->` : ''}\n`;
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
  md += `<!-- front-view dumbbell, screen-right hand. Lives in fa-r > db-r (rotation origin 22,16 = the grip).\n     End face centred at (22, 21): 5 below the grip, so the fist shows above it. Screen-left: negate every x. -->\n${lr.parts.dumbbellR.replace(/></g, '>\n<')}\n`;
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
