// build.mjs: turns ../project/*.dc.html + canvas.json into out/: one wrapper page per artboard (<Name>.html),
// runtime.js and index.html (the canvas page). Deterministic: same input, same bytes. Run: node build.mjs
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const PROJECT = path.join(HERE, '..', 'project');
const OUT = path.join(HERE, 'out');
const RUNTIME = fs.readFileSync(path.join(HERE, 'runtime.js'), 'utf8');
const sandbox = { console, queueMicrotask, setTimeout };
vm.runInNewContext(RUNTIME, sandbox, { filename: 'runtime.js' });
const DC = sandbox.DC;

const fail = msg => { throw new Error('build: ' + msg); };
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'" };
const decode = s => s.replace(/&(#\d+|#x[0-9a-f]+|[a-z]+);/gi, (m, e) => {
  if (ENT[e] !== undefined) return ENT[e];
  if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
  fail('unknown entity ' + m);
});
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const json = v => JSON.stringify(v).replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');

// ---------- read one .dc.html file ----------
function readComponent(name) {
  const file = path.join(PROJECT, name + '.dc.html');
  if (!fs.existsSync(file)) fail(`${name}.dc.html not found (dc-import or canvas.json)`);
  const src = fs.readFileSync(file, 'utf8');
  const title = (src.match(/<title>([\s\S]*?)<\/title>/) || fail(name + ': no <title>'))[1].trim();
  const xdcs = src.match(/<x-dc>[\s\S]*?<\/x-dc>/g) || [];
  if (xdcs.length !== 1) fail(`${name}: expected exactly one <x-dc> block, found ${xdcs.length}`);
  const inner = xdcs[0].slice(6, -7);
  const hm = inner.match(/^\s*<helmet>([\s\S]*?)<\/helmet>/);
  const markup = hm ? inner.slice(hm[0].length) : inner;
  if (/<helmet\b/.test(markup)) fail(`${name}: <helmet> must come first inside <x-dc>`);
  const links = [], styles = [];
  if (hm) {
    const rest = hm[1]
      .replace(/<link\b([^>]*)>/g, (m, a) => {
        const href = (a.match(/\bhref="([^"]*)"/) || [])[1];
        if (!/\brel="stylesheet"/.test(a) || !href || !decode(href).startsWith('https://fonts.googleapis.com/css2?')) fail(`${name}: helmet <link> other than a Google Fonts css2 stylesheet: ${m}`);
        links.push(decode(href));
        return '';
      })
      .replace(/<style>([\s\S]*?)<\/style>/g, (m, css) => { styles.push(css); return ''; })
      .replace(/<!--[\s\S]*?-->/g, '');
    if (rest.trim()) fail(`${name}: unsupported content in <helmet>: ${rest.trim().slice(0, 80)}`);
  }
  const scripts = [...src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)].filter(m => /type="text\/x-dc"/.test(m[1]));
  if (scripts.length !== 1) fail(`${name}: expected one <script type="text/x-dc" data-dc-script>, found ${scripts.length}`);
  const [, sattrs, logic] = scripts[0];
  if (!/\bdata-dc-script\b/.test(sattrs)) fail(`${name}: logic script lacks data-dc-script`);
  const pm = sattrs.match(/\bdata-props='([^']*)'/) || sattrs.match(/\bdata-props="([^"]*)"/);
  let props = {};
  if (pm) { try { props = JSON.parse(decode(pm[1])); } catch (e) { fail(`${name}: data-props is not JSON (${e.message})`); } }
  if (!/\bclass\s+Component\s+extends\s+DCLogic\b/.test(logic)) fail(`${name}: no "class Component extends DCLogic"`);
  if (/<!--|<script/i.test(logic)) fail(`${name}: logic contains "<!--" or "<script", which cannot be inlined safely`);
  const tpl = DC.parse(markup, name); // throws on any unsupported construct
  const imports = [];
  (function walk(n) { for (const k of n.kids || []) { if (k.kind === 'import' && !imports.includes(k.importName)) imports.push(k.importName); walk(k); } })(tpl);
  return { name, title, links, styles, logic, props, markup, imports };
}

const comps = new Map();
const comp = name => { if (!comps.has(name)) comps.set(name, readComponent(name)); return comps.get(name); };
// Parent first, then its imports depth-first: the order the helmets go into <head>.
function closure(name, seen = []) {
  if (seen.includes(name)) return seen;
  seen.push(name);
  for (const i of comp(name).imports) closure(i, seen);
  return seen;
}

// ---------- canvas.json ----------
const canvas = JSON.parse(fs.readFileSync(path.join(PROJECT, 'canvas.json'), 'utf8'));
const boards = Object.entries(canvas.boards).map(([file, b]) => {
  if (!/^[\w-]+\.dc\.html$/.test(file)) fail('odd board file name ' + file);
  for (const k of ['x', 'y', 'w', 'h']) if (!Number.isFinite(b[k])) fail(`${file}: ${k} missing`);
  return { file, name: file.slice(0, -8), x: b.x, y: b.y, w: b.w, h: b.h, title: b.title || file };
});
boards.sort((a, b) => a.y - b.y || a.x - b.x || (a.name < b.name ? -1 : 1));
const notes = Object.values(canvas.notes || {}).filter(n => n && Number.isFinite(n.y) && n.text).sort((a, b) => a.y - b.y || a.x - b.x);
// A board belongs to the last title note at or above it; without notes, boards with the same y form a row.
const rows = [];
for (const b of boards) {
  const note = notes.filter(n => n.y <= b.y).pop();
  const id = note ? 'n' + notes.indexOf(note) : 'y' + b.y;
  let row = rows.find(r => r.id === id);
  if (!row) rows.push(row = { id, title: note ? note.text : '', boards: [] });
  row.boards.push(b);
}
const isPlayer = b => /^Player-/.test(b.name);
const pi = rows.findIndex(r => r.boards.some(isPlayer));
if (pi > 0) rows.unshift(rows.splice(pi, 1)[0]);
rows.forEach((r, i) => { if (!r.title) r.title = 'Row ' + (i + 1); });

// ---------- wrapper pages ----------
function wrapper(b) {
  const names = closure(b.name);
  const links = [...new Set(names.flatMap(n => comp(n).links))];
  const head = [
    '<!doctype html>',
    '<html lang="en">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    `<title>${esc(comp(b.name).title)}</title>`,
    ...links.map(h => `<link rel="stylesheet" href="${esc(h)}">`),
    `<style>html,body{margin:0}#dc-board{position:relative;width:${b.w}px;height:${b.h}px;overflow:hidden}</style>`,
    ...names.flatMap(n => comp(n).styles.map(css => `<style data-dc-helmet="${n}" media="not all">${css}</style>`)),
    '<script src="runtime.js"></script>',
    '</head>',
    '<body>',
    '<div id="dc-board"></div>',
    '<script>',
    ...names.map(n => {
      const c = comp(n);
      return `DC.define(${json(n)}, {"props":${json(c.props)},"markup":${json(c.markup)}}, function (DCLogic) {\n${c.logic.replace(/^\n+|\s+$/g, '')}\n;return Component;\n});`;
    }),
    `DC.mount(document.getElementById("dc-board"), ${json(b.name)});`,
    '</script>',
    '</body>',
    '</html>',
    '',
  ];
  return head.join('\n');
}

// ---------- index.html (an Artifact page: the host adds doctype, html, head and body) ----------
function index() {
  const nPlayers = boards.filter(isPlayer).length;
  const row = r => `
<section class="cv-row" aria-labelledby="cv-r-${r.id}">
<h2 id="cv-r-${r.id}">${esc(r.title)}</h2>
<div class="cv-strip">
${r.boards.map(b => `<figure class="cv-board" data-w="${b.w}" data-h="${b.h}">
<figcaption>${esc(b.title)}<span>${b.w} × ${b.h}</span></figcaption>
<div class="cv-frame" style="width:${b.w}px;height:${b.h}px"><iframe src="${b.name}.html" title="${esc(b.title)}" width="${b.w}" height="${b.h}" style="width:${b.w}px;height:${b.h}px"></iframe></div>
</figure>`).join('\n')}
</div>
</section>`;
  return `<title>M/ARC Form Guide Canvas</title>
<style>
:root{color-scheme:light;--bg:#ffffff;--surface-1:#f7f6f3;--surface-2:#efeeea;--border-subtle:rgba(55,53,47,0.08);--border:rgba(55,53,47,0.14);--text:#37352f;--text-2:#6b6a66;--accent:#2383e2}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){color-scheme:dark;--bg:#08090a;--surface-1:#0f1011;--surface-2:#141516;--border-subtle:rgba(255,255,255,0.06);--border:rgba(255,255,255,0.10);--text:#f7f8f8;--text-2:#8a8f98;--accent:#5e6ad2}}
:root[data-theme="dark"]{color-scheme:dark;--bg:#08090a;--surface-1:#0f1011;--surface-2:#141516;--border-subtle:rgba(255,255,255,0.06);--border:rgba(255,255,255,0.10);--text:#f7f8f8;--text-2:#8a8f98;--accent:#5e6ad2}
body{margin:0;background:var(--bg);color:var(--text);font:15px/1.4 Inter,"SF Pro Text",system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;-webkit-font-smoothing:antialiased}
.cv{box-sizing:border-box;padding:24px 16px 48px;min-width:0}
.cv h1{margin:0;font-size:22px;font-weight:650;letter-spacing:-.018em;line-height:1.2}
.cv-lede{margin:6px 0 0;max-width:62ch;color:var(--text-2);font-size:13px;line-height:18px}
.cv-size{display:flex;align-items:center;gap:8px;margin-top:16px;color:var(--text-2);font-size:12px;font-weight:600}
.cv-seg{display:inline-flex;padding:2px;border-radius:999px;background:var(--surface-2);box-shadow:inset 0 0 0 1px var(--border-subtle)}
.cv-seg button{min-width:56px;min-height:32px;padding:0 12px;border:0;border-radius:999px;background:none;color:var(--text-2);font:inherit;cursor:pointer}
.cv-seg button[aria-pressed="true"]{background:var(--text);color:var(--bg)}
.cv-seg button:focus-visible{outline:2px solid var(--accent);outline-offset:1px}
.cv-row{margin-top:32px}
.cv-row h2{margin:0 0 12px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:var(--text-2)}
.cv-strip{display:flex;align-items:flex-start;gap:24px;overflow-x:auto;padding:1px 1px 12px;scroll-snap-type:x proximity;overscroll-behavior-x:contain}
.cv-board{flex:none;margin:0;scroll-snap-align:start}
.cv-board figcaption{display:flex;justify-content:space-between;align-items:baseline;gap:8px;margin-bottom:8px;font-size:13px;font-weight:600;line-height:18px}
.cv-board figcaption span{flex:none;color:var(--text-2);font-size:12px;font-weight:400;font-variant-numeric:tabular-nums}
.cv-frame{overflow:hidden;outline:1px solid var(--border);background:var(--surface-1)}
.cv-frame iframe{display:block;border:0;transform-origin:0 0}
</style>
<main class="cv">
<h1>M/ARC form guide canvas</h1>
<p class="cv-lede">This page renders the ${boards.length} canvas artboards from the canvas files, with the ${nPlayers} animated form-guide players live.</p>
<div class="cv-size" role="group" aria-label="Size">Size<span class="cv-seg"><button type="button" data-size="fit" aria-pressed="true">Fit</button><button type="button" data-size="full" aria-pressed="false">100 %</button></span></div>
${rows.map(row).join('\n')}
</main>
<script>
(function () {
  var mode = 'fit';
  var figs = Array.prototype.slice.call(document.querySelectorAll('.cv-board'));
  var btns = Array.prototype.slice.call(document.querySelectorAll('.cv-seg button'));
  function layout() {
    figs.forEach(function (fig) {
      var strip = fig.parentNode, cs = getComputedStyle(strip);
      var avail = strip.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      var w = +fig.getAttribute('data-w'), h = +fig.getAttribute('data-h');
      var s = mode === 'fit' ? Math.min(1, avail / w) : 1;
      var frame = fig.querySelector('.cv-frame'), ifr = frame.querySelector('iframe');
      fig.style.width = frame.style.width = w * s + 'px';
      frame.style.height = h * s + 'px';
      ifr.style.transform = s < 1 ? 'scale(' + s + ')' : '';
    });
  }
  btns.forEach(function (b) {
    b.addEventListener('click', function () {
      mode = b.getAttribute('data-size');
      btns.forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
      layout();
    });
  });
  window.addEventListener('resize', layout);
  layout();
})();
</script>
`;
}

// ---------- write ----------
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'runtime.js'), RUNTIME);
const sizes = [];
for (const b of boards) {
  const html = wrapper(b);
  fs.writeFileSync(path.join(OUT, b.name + '.html'), html);
  sizes.push(`${b.name}.html ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB (${closure(b.name).join(' + ')})`);
}
fs.writeFileSync(path.join(OUT, 'index.html'), index());
console.log(sizes.join('\n'));
console.log(`wrote ${boards.length} wrapper pages, runtime.js and index.html to ${path.relative(process.cwd(), OUT) || '.'}`);
