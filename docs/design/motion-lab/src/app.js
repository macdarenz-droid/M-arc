// MO: motion lab page: theme pills, the 3D view with tags, tempo, views, mistakes, muscles, grip and facts.
import { createMotion } from './motion.js';
import exercise from './exercises/machineChestPress.js';

const $ = (id) => document.getElementById(id);
const q = new URLSearchParams(location.search);
const json = async (p) => (await fetch(new URL(p, import.meta.url))).json();
const assetsIn = window.MOTION_ASSETS || null;                    // the published page inlines its files here

const themes = assetsIn ? assetsIn.themes : await json('./themes.json');
const assets = assetsIn ? assetsIn.files : {
  figure: new URL('../assets/figure.glb', import.meta.url).href,
  machine: new URL('../assets/chest-press.glb', import.meta.url).href,
  meta: await json('../assets/figure.meta.json'),
  regions: await json('../assets/figure.regions.json'),
};

const stage = $('stage'), canvas = $('c');
if (q.has('shot')) document.documentElement.classList.add('still');
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || q.get('reduced') === '1';
const size = () => { const r = stage.getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; };
let { w, h } = size();
const pr = Math.min(window.devicePixelRatio || 1, 2);
const motion = await createMotion({ canvas, assets, themes, exercise, width: w, height: h, pixelRatio: pr, preserve: q.has('shot') });
if (!motion) { stage.textContent = ''; stage.style.display = 'none'; }

// ---------- theme ----------
const cssVar = { bg: '--bg', surface1: '--surface-1', surface2: '--surface-2', surface3: '--surface-3', borderSubtle: '--border-subtle', border: '--border', text: '--text', text2: '--text-2', text3: '--text-3', accent: '--accent', onAccent: '--on-accent', mistake: '--mistake' };
function setTheme(id) {
  const t = themes.find(x => x.id === id) || themes[0];
  for (const [k, v] of Object.entries(cssVar)) document.documentElement.style.setProperty(v, t.tokens[k]);
  document.documentElement.style.setProperty('--radius-lg', t.radius.lg);
  document.documentElement.style.colorScheme = t.tokens.colorScheme;
  motion.setTheme(t.id);
  [...$('themes').children].forEach(b => b.setAttribute('aria-pressed', String(b.dataset.id === t.id)));
  legend();
}
for (const t of themes) {
  const b = document.createElement('button'); b.className = 'chip'; b.textContent = t.name; b.dataset.id = t.id;
  b.onclick = () => { setTheme(t.id); kick(); }; $('themes').append(b);
}

// ---------- tempo ----------
const bars = exercise.tempo.map(p => {
  const d = document.createElement('div'); d.style.flex = `${p.s} 1 0`;
  d.innerHTML = `<b>${p.label}</b><span>${p.s} s</span><i></i>`; $('tempo').append(d); return d;
});

// ---------- views and mistakes ----------
const VIEWS = [['three', 'Angle'], ['side', 'Side'], ['front', 'Front'], ['grip', 'Grip']];
let view = q.get('view') || 'three', mode = q.get('mode') || 'right';
function chipRow(el, items, current, onPick, bad = false) {
  el.innerHTML = '';
  for (const [key, label] of items) {
    const b = document.createElement('button'); b.className = 'chip' + (bad && key !== 'right' ? ' bad' : ''); b.textContent = label;
    b.setAttribute('aria-pressed', String(key === current)); b.onclick = () => onPick(key); el.append(b);
  }
}
function setView(v) { view = v; motion.setView(v); chipRow($('views'), VIEWS, view, setView); kick(); }
function setMode(m) {
  mode = m; motion.setMode(m);
  const md = exercise.modes[m];
  chipRow($('modes'), Object.entries(exercise.modes).map(([k, v]) => [k, v.label]), mode, setMode, true);
  const tell = $('tell');
  if (md && md.tell) { tell.hidden = false; tell.innerHTML = `<b>${md.tell}</b>${md.fix}`; } else tell.hidden = true;
  if (md && md.view) setView(md.view);
  legend(); kick();
}

// ---------- muscles ----------
function legend() {
  const md = exercise.modes[mode] || {};
  const tiers = { ...exercise.tiers, ...(md.tiers || {}) };
  const names = exercise.muscleNames;
  const rows = [[1, 'Main'], [2, 'Helps'], [3, 'Takes over']];
  const css = getComputedStyle(document.documentElement);
  const accent = css.getPropertyValue('--accent'), bad = css.getPropertyValue('--mistake');
  $('legend').innerHTML = rows.map(([tier, label]) => {
    const list = Object.entries(tiers).filter(([, t]) => t === tier).map(([m]) => names[m]);
    if (!list.length) return '';
    const dot = tier === 3 ? bad : tier === 2 ? `color-mix(in srgb, ${accent} 45%, transparent)` : accent;
    return `<div><em><i style="background:${dot}"></i>${label}</em><span>${list.join(', ')}</span></div>`;
  }).join('');
}

$('name').textContent = exercise.name;
$('grip').textContent = exercise.grip;
$('facts').innerHTML = exercise.facts.map(f => `<li>${f}</li>`).join('');

// ---------- tags over the view ----------
const tagEls = new Map();
function tags(last) {
  const svg = $('lines'); const lines = [];
  const want = [];
  const md = exercise.modes[mode];
  if (mode === 'right') for (const c of exercise.callouts) if (c.phases.includes(last.phase.key) && c.at[view]) want.push({ ...c, offset: c.at[view], bad: false });
  if (md && md.tag && md.tag.phases.includes(last.phase.key) && md.tag.at[view]) want.push({ key: 'mistake', text: md.tag.text, anchor: md.tag.anchor, offset: md.tag.at[view], bad: true });
  const seen = new Set();
  for (const c of want) {
    const a = last.anchors[c.anchor]; if (!a) continue;
    const p = motion.screenOf(a); const o = c.offset;
    let el = tagEls.get(c.key);
    if (!el) { el = document.createElement('div'); el.className = 'tag'; stage.append(el); tagEls.set(c.key, el); }
    el.textContent = c.text; el.classList.toggle('bad', c.bad); el.style.opacity = '1';
    const half = el.offsetWidth / 2 + 8; const x = Math.max(half, Math.min(w - half, p.x + o[0])), y = Math.max(44, Math.min(h - 20, p.y + o[1]));
    el.style.left = x + 'px'; el.style.top = y + 'px';
    lines.push(`<line x1="${p.x}" y1="${p.y}" x2="${x}" y2="${y}" stroke="${c.bad ? 'var(--mistake)' : 'var(--text-2)'}" stroke-width="1" /><circle cx="${p.x}" cy="${p.y}" r="2.5" fill="${c.bad ? 'var(--mistake)' : 'var(--text)'}" />`);
    seen.add(c.key);
  }
  for (const [k, el] of tagEls) if (!seen.has(k)) el.style.opacity = '0';
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`); svg.innerHTML = lines.join('');
}

// ---------- loop ----------
let t = +(q.get('t') ?? 0), playing = !reduced && !q.has('shot'), lastNow = null, drawn = false;
const yawDrag = { on: false, x: 0, yaw: 0 };
function frame(now) {
  if (lastNow != null && playing) t += (now - lastNow) / 1000;
  lastNow = now;
  const last = motion.renderAt(t);
  $('phase').textContent = last.phase.label;
  let acc = 0; const total = motion.cycle; const x = ((t % total) + total) % total;
  exercise.tempo.forEach((p, i) => { const f = Math.min(1, Math.max(0, (x - acc) / p.s)); bars[i].querySelector('i').style.width = (f * 100) + '%'; acc += p.s; });
  tags(last);
  drawn = true;
  if (playing) requestAnimationFrame(frame);
}
function kick() { if (!playing) requestAnimationFrame(frame); }
$('play').onclick = () => { playing = !playing; $('play').textContent = playing ? '❚❚' : '▶'; $('play').setAttribute('aria-label', playing ? 'Pause' : 'Play'); lastNow = null; requestAnimationFrame(frame); };
if (!playing) { $('play').textContent = '▶'; $('play').setAttribute('aria-label', 'Play'); }

// horizontal drag turns the view; vertical drags still scroll the page
stage.addEventListener('pointerdown', (e) => { yawDrag.on = true; yawDrag.x = e.clientX; yawDrag.yaw = motion.state.yawOffset || 0; });
addEventListener('pointerup', () => { yawDrag.on = false; });
addEventListener('pointermove', (e) => { if (!yawDrag.on) return; motion.state.yawOffset = yawDrag.yaw + (e.clientX - yawDrag.x) * 0.4; kick(); });
addEventListener('resize', () => { ({ w, h } = size()); motion.resize(w, h); kick(); });

setTheme(q.get('theme') || themes[0].id);
setView(view); setMode(mode);
requestAnimationFrame(frame);
window.motionReady = () => drawn;
window.motion = motion;
