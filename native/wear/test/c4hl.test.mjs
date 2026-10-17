// WATCH-C4 acceptance L11 (and the source side of B4) on the highlights page pages/hl: the params shown, the
// animation styles, two short vibrations, a tap back to the index page, the timer cleared, no link.js or
// wearengine.js, ES5 and ASCII. Run: node --test 'native/wear/test/*.test.mjs'
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const HL = path.join(ROOT, 'native/wear/app/entry/src/main/js/default/pages/hl');
const read = (ext) => readFileSync(path.join(HL, `hl.${ext}`), 'utf8');

/** hl.js as the engine runs it: imports and Date, setTimeout and clearTimeout faked; data with the params on it. */
function rig(params = {}, o = {}) {
  const r = { buzz: [], replace: [], timers: new Map(), cleared: [], t: 1000000, id: 0 };
  let src = read('js');
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'return {');
  const vibrator = { vibrate(a) { r.buzz.push({ mode: a.mode, at: r.t }); if (o.vibrateThrows) throw new Error('vibrator'); } };
  const router = { replace(a) { r.replace.push(a); if (o.replaceThrows) { o.replaceThrows--; throw new Error('router'); } } };
  const setTimeout = (fn, ms) => { r.id++; r.timers.set(r.id, { fn, at: r.t + ms, ms }); return r.id; };
  const clearTimeout = (id) => { r.cleared.push(id); r.timers.delete(id); };
  const def = new Function('router', 'vibrator', 'setTimeout', 'clearTimeout', 'Date', src)(router, vibrator, setTimeout, clearTimeout, { now: () => r.t });
  // the router copies params onto the new page's data before onInit (research 2026-10-18, Second page)
  r.def = def;
  r.page = { ...def.data, ...params };
  r.call = (name) => def[name].call(r.page);
  r.adv = (ms) => {
    r.t += ms;
    for (const [id, x] of [...r.timers]) if (x.at <= r.t) { r.timers.delete(id); x.fn(); }
  };
  return r;
}

/** hl.hml as a tree, as c3.test.mjs reads index.hml. */
function tree(src) {
  const root = { kids: [] }, stack = [root];
  for (const m of src.matchAll(/<(\/?)(\w+)([^>]*)>|([^<]+)/g)) {
    if (m[4] !== undefined) { if (m[4].trim()) stack.at(-1).kids.push({ text: m[4].trim() }); continue; }
    if (m[1]) { stack.pop(); continue; }
    const node = { tag: m[2], attrs: Object.fromEntries([...m[3].matchAll(/([\w-]+)(?:="([^"]*)")?/g)].map((a) => [a[1], a[2] ?? ''])), kids: [] };
    stack.at(-1).kids.push(node);
    stack.push(node);
  }
  assert.equal(stack.length, 1, 'every element is closed');
  return root;
}
const all = (n, out = []) => { for (const k of n.kids) if (k.tag) { out.push(k); all(k, out); } return out; };
const HML = tree(read('hml'));
/** The texts drawn for a page's data, in order. */
const shown = (data) => all(HML).filter((n) => n.tag === 'text').map((n) => n.kids.map((k) => k.text.replace(/\{\{(\w+)\}\}/g, (_, x) => data[x])).join(''));

/** hl.css: its rules in source order and its keyframes. Nothing else may be in the file. */
const decl = (s) => Object.fromEntries(s.split(';').map((x) => x.trim()).filter(Boolean).map((x) => [x.slice(0, x.indexOf(':')).trim(), x.slice(x.indexOf(':') + 1).trim()]));
const CSS = read('css').replace(/\/\*[\s\S]*?\*\//g, '');
const FRAMES = {}, RULES = [];
const KF = /@keyframes\s+(\w+)\s*\{((?:\s*[\w%]+\s*\{[^{}]*\})*)\s*\}/g;
for (const m of CSS.matchAll(KF)) FRAMES[m[1]] = [...m[2].matchAll(/([\w%]+)\s*\{([^{}]*)\}/g)].map((f) => [f[1], decl(f[2])]);
const REST = CSS.replace(KF, '');
for (const m of REST.matchAll(/\.([\w-]+)\s*\{([^{}]*)\}/g)) RULES.push([m[1], decl(m[2])]);
assert.equal(REST.replace(/\.([\w-]+)\s*\{([^{}]*)\}/g, '').trim(), '', 'hl.css holds only class rules and keyframes');
/** The style an element gets from its classes (later rules win, as in the file). */
const style = (n) => { const c = (n.attrs.class || '').split(/\s+/), s = {}; for (const [k, d] of RULES) if (c.includes(k)) Object.assign(s, d); return s; };
const byClass = (c) => { const n = all(HML).filter((x) => (x.attrs.class || '').split(/\s+/).includes(c)); assert.equal(n.length, 1, `one .${c}`); return n[0]; };
const px = (v) => { const m = /^(-?\d+)px$/.exec(v); assert.ok(m, `${v} is in px`); return +m[1]; };
const ms = (v) => { const m = /^(\d+)ms$/.exec(v); assert.ok(m, `${v} is in ms`); return +m[1]; };
const tr = (v, axis) => { const m = new RegExp(`^translate${axis}\\((-?\\d+)px\\)$`).exec(v); assert.ok(m, `${v} is a translate${axis}`); return +m[1]; };
/** A keyframes rule as [from, to]: exactly two frames (the lite engine uses only frames 0 and 1). */
const two = (name) => { const f = FRAMES[name]; assert.ok(f, `@keyframes ${name}`); assert.deepEqual(f.map((x) => x[0]), ['from', 'to'], `${name}: from and to only`); return [f[0][1], f[1][1]]; };

const P = { h1: 'Best: Bench press 100kg x5', h2: '52 min, 18 sets', h3: '6120 kg lifted', h4: '5 exercises', h5: 'Peak 168 bpm, avg 131' };

test('L11 the params are shown: "Workout done" then h1 to h5 in order; an absent param shows nothing', () => {
  const r = rig(P);
  r.call('onInit');
  assert.deepEqual(shown(r.page), ['Workout done', P.h1, P.h2, P.h3, P.h4, P.h5]);
  const e = rig({ h1: '45 min, 12 sets', h2: '4100 kg lifted', h3: '4 exercises' });
  e.call('onInit');
  assert.deepEqual(shown(e.page), ['Workout done', '45 min, 12 sets', '4100 kg lifted', '4 exercises', '', '']);
  const n = rig();
  n.call('onInit');
  assert.deepEqual(shown(n.page), ['Workout done', '', '', '', '', ''], 'no params: the data defaults');
  assert.deepEqual(r.def.data, { h1: '', h2: '', h3: '', h4: '', h5: '' }, 'h1 to h5 declared in data, as strings');
  const bound = [...read('hml').matchAll(/\{\{ ?(\w+) ?\}\}/g)].map((m) => m[1]);
  assert.deepEqual(bound, ['h1', 'h2', 'h3', 'h4', 'h5'], 'each bound once, in order');
});

test('L11 no if, elif, else, show or for in the markup (a text with if is never drawn on the GT 6); one tap target, the root', () => {
  for (const n of all(HML)) for (const a of ['if', 'elif', 'else', 'show', 'for']) assert.ok(!(a in n.attrs), `<${n.tag} ${a}>`);
  assert.equal(HML.kids.length, 1);
  const rootEl = HML.kids[0];
  assert.equal(rootEl.tag, 'div');
  assert.equal(rootEl.attrs.onclick, 'onTap');
  assert.deepEqual(all(HML).filter((n) => Object.keys(n.attrs).some((a) => a.startsWith('on'))).map((n) => n.attrs.onclick), ['onTap'], 'taps on children bubble to the root');
  assert.match(read('js'), /^ {2}onTap\(\) \{/m);
});

test('L11 the ring grows from its centre to 240 px while "Workout done" rises into it (ease-out, fill forwards)', () => {
  const box = style(byClass('bb')), wr = byClass('wr'), rise = style(wr), rgEl = byClass('rg'), ring = style(rgEl), title = byClass('tt'), tt = style(title);
  assert.deepEqual(shown({}).slice(0, 1), ['Workout done']);
  assert.deepEqual(wr.kids.map((k) => k.attrs.class), ['rg', 'tt'], 'the ring and the title move together in the rising wrapper');
  for (const [s, name] of [[rise, 'up'], [ring, 'rg']]) {
    assert.equal(s['animation-name'], name);
    assert.equal(ms(s['animation-duration']), 600);
    assert.equal(s['animation-timing-function'], 'ease-out');
    assert.equal(s['animation-fill-mode'], 'forwards');
    assert.equal(s['animation-delay'], undefined, 'both start at once, so the centre stays put');
  }
  const [uf, ut] = two('up'), [rf, rt] = two('rg');
  assert.deepEqual(Object.keys(uf).concat(Object.keys(ut)), ['transform', 'transform']);
  const B = px(ring['border-width']);
  assert.equal(B, 6);
  assert.equal(ring['border-color'], '#5e6ad2', 'the accent');
  assert.ok(px(ring['border-radius']) >= 120, 'round at every size');
  assert.equal(ring['background-color'], undefined, 'a ring, not a disc');
  // Lite sizes are border-box in CSS (the border is dropped when the box is not larger than it) but content-box in
  // keyframes (UIView::SetWidth adds the border), so the ring's box is its keyframe width plus 2 borders.
  assert.ok(px(ring.width) > 2 * B && px(ring.height) > 2 * B, 'the CSS box keeps its border');
  assert.equal(px(box.width), 240);
  assert.equal(px(box.height), 240);
  assert.ok(!box['flex-direction'] && box['align-items'] === 'flex-start', 'the taller wrapper sits at the top of the box');
  assert.equal(px(rise.width), 240);
  const at = (p) => {
    const w = px(rf.width) + (px(rt.width) - px(rf.width)) * p, h = px(rf.height) + (px(rt.height) - px(rf.height)) * p;
    const x = px(ring['margin-left']) + tr(rf.transform, 'X') + (tr(rt.transform, 'X') - tr(rf.transform, 'X')) * p;
    const y = px(ring['margin-top']) + tr(uf.transform, 'Y') + (tr(ut.transform, 'Y') - tr(uf.transform, 'Y')) * p;
    return { w: w + 2 * B, h: h + 2 * B, cx: x + (w + 2 * B) / 2, cy: y + (h + 2 * B) / 2, x, y };
  };
  assert.deepEqual([px(rf.width), px(rf.height)], [0, 0], 'from 0');
  assert.deepEqual([at(1).w, at(1).h, at(1).x, at(1).y], [240, 240, 0, 0], 'to 240 px, filling the 240 px box');
  assert.equal(px(ring.width), px(ring.height), 'square');
  for (const p of [0, 0.1, 0.25, 0.5, 0.75, 0.9, 1]) {
    assert.ok(Math.abs(at(p).cx - 120) <= 1 && Math.abs(at(p).cy - 120) <= 1, `centre at ${p}: ${at(p).cx}, ${at(p).cy}`);
  }
  // Before the first frame the engine draws the CSS state: the small dot where the growth starts.
  assert.ok(Math.abs(px(ring['margin-left']) + px(ring.width) / 2 - 120) <= 1 && Math.abs(px(ring['margin-top']) + px(ring.height) / 2 - 120) <= 1);
  // "Workout done": in the wrapper under the ring, so it rises with it and ends centred in the ring.
  const ty0 = px(ring['margin-top']) + px(ring.height) + px(tt['margin-top']);
  const ty1 = ty0 + tr(ut.transform, 'Y');
  assert.ok(ty1 < ty0, 'it rises');
  assert.ok(ty0 - ty1 >= 100, `it rises at least 100 px (${ty0 - ty1})`);
  assert.ok(Math.abs(ty1 + px(tt.height) / 2 - 120) <= 1, 'it ends centred in the ring');
  assert.ok(Math.abs(px(tt['margin-left']) + px(tt.width) / 2 - 120) <= 1, 'and centred across');
  assert.ok(px(tt.width) <= 240 - 2 * B, 'inside the ring');
  assert.ok(px(rise.height) >= ty0 + px(tt.height), 'the wrapper holds the title at its start');
  assert.equal(rise['flex-direction'], 'column');
  assert.equal(rise['align-items'], 'flex-start');
});

test('L11 the lines show one by one, from 600 to 1400 ms, and stay (fill forwards); nothing shows before its turn', () => {
  const ls = byClass('ls'), wipe = style(ls);
  const lines = ls.kids;
  assert.deepEqual(lines.map((n) => n.tag), ['text', 'text', 'text', 'text', 'text']);
  assert.deepEqual(lines.map((n) => n.kids[0].text), ['{{h1}}', '{{h2}}', '{{h3}}', '{{h4}}', '{{h5}}']);
  const st = lines.map(style);
  // Card change, recorded in hl.css: the lines sit in a box of height 0 that a linear height animation opens, one
  // line at a time (children draw only inside their parent, ui_lite root_view.cpp DrawTop). Not `opacity: 0` and a
  // fade: in the lite engine CSS opacity sets the view's opacity scale, which the opacity animation never changes (it
  // scales the style opacities it recorded), so the lines would stay hidden for good (ace_engine_lite component.cpp
  // SetOpacity, transition_impl.cpp OPACITY, ui_label.cpp GetMixOpaScale). Before its delay an animation draws the
  // CSS state, so a delayed fade without that box would show each line, then blank it, then fade it in.
  for (const [k, d] of RULES) assert.ok(!('opacity' in d), `.${k} sets no base opacity`);
  for (const s of st) assert.ok(!Object.keys(s).some((p) => p.startsWith('animation-')), 'the box shows the lines, not their own animation');
  assert.equal(px(wipe.height), 0, 'nothing shows before the box opens');
  assert.equal(wipe['flex-direction'], 'column');
  assert.ok(!wipe['justify-content'] || wipe['justify-content'] === 'flex-start', 'lines laid out from the top');
  assert.ok(!wipe['align-items'] || px(wipe.width) === px(st[0].width), 'lines fill the box across');
  const [wf, wt] = two('wp');
  assert.deepEqual(Object.keys(wf).concat(Object.keys(wt)), ['height', 'height']);
  assert.equal(px(wf.height), 0);
  const lh = st.map((s) => px(s.height));
  assert.ok(lh.every((h) => h === lh[0]), 'one line height');
  assert.equal(px(wt.height), 5 * lh[0], 'it ends open on all five lines');
  assert.equal(wipe['animation-name'], 'wp');
  assert.ok([undefined, 'linear'].includes(wipe['animation-timing-function']), 'linear (the lite default)');
  assert.equal(wipe['animation-fill-mode'], 'forwards');
  const d0 = ms(wipe['animation-delay']), dd = ms(wipe['animation-duration']);
  const open = (t) => (t <= d0 ? 0 : t >= d0 + dd ? px(wt.height) : (px(wt.height) * (t - d0)) / dd);
  // when each line starts to show and when it is whole, on the box's linear clock
  const first = [], whole = [];
  for (let k = 0; k < 5; k++) {
    let t = 0;
    while (open(t) <= k * lh[0]) t += 10;
    first.push(t - 10);
    while (open(t) < (k + 1) * lh[0]) t += 10;
    whole.push(t);
  }
  assert.deepEqual(first, [600, 800, 1000, 1200, 1400], 'one line every 200 ms from 600 ms');
  assert.deepEqual(whole, [800, 1000, 1200, 1400, 1600]);
  assert.equal(open(0), 0);
  assert.equal(open(599), 0, 'hidden while the ring grows and the title rises (600 ms)');
  assert.equal(open(60000), 150, 'and open for good');
  const rise = style(byClass('wr'));
  assert.ok(d0 >= ms(rise['animation-duration']), 'the lines start once the ring and title are in place');
});

test('L11 every animation is one the lite engine runs: two frames, animatable properties, fill forwards; the page colours and fixed text sizes', () => {
  const used = new Set();
  for (const n of all(HML).concat(HML.kids)) {
    const s = style(n);
    if (!s['animation-name']) { assert.ok(!Object.keys(s).some((p) => p.startsWith('animation-')), `.${n.attrs.class}`); continue; }
    used.add(s['animation-name']);
    assert.ok(FRAMES[s['animation-name']], `.${n.attrs.class}: @keyframes ${s['animation-name']}`);
    assert.equal(s['animation-fill-mode'], 'forwards', `.${n.attrs.class}`);
    ms(s['animation-duration']);
  }
  assert.deepEqual([...used].sort(), Object.keys(FRAMES).sort(), 'no unused keyframes');
  for (const name of Object.keys(FRAMES)) {
    const [f, t] = two(name);
    assert.deepEqual(Object.keys(f), Object.keys(t), `${name}: the same properties in both frames`);
    for (const [p, v] of Object.entries(f).concat(Object.entries(t))) {
      assert.ok(['width', 'height', 'opacity', 'transform'].includes(p), `${name}: ${p} animates on lite`);
      if (p === 'transform') assert.match(v, /^translate[XY]\(-?\d+px\)$/, `${name}: one translate, no scale`);
    }
  }
  for (const [, d] of RULES) if (d['animation-timing-function']) assert.ok(['linear', 'ease-in', 'ease-out', 'ease-in-out'].includes(d['animation-timing-function']));
  const colours = [...CSS.matchAll(/#[0-9a-fA-F]{3,8}\b/g)].map((m) => m[0].toLowerCase());
  assert.ok(colours.length > 0);
  for (const c of colours) assert.ok(['#08090a', '#f7f8f8', '#5e6ad2', '#8a8f98'].includes(c), `${c} is an index page colour`);
  const rootStyle = style(HML.kids[0]);
  assert.deepEqual([rootStyle.width, rootStyle.height, rootStyle['background-color']], ['466px', '466px', '#08090a']);
  for (const n of all(HML).filter((x) => x.tag === 'text')) {
    const s = style(n);
    for (const p of ['width', 'height', 'font-size']) px(s[p]);
    assert.equal(s['text-align'], 'center');
    assert.ok(s.color, 'a colour');
    assert.ok(!('font-family' in s) && !('font-weight' in s) && !('line-height' in s), 'the one font, no bold, no line-height');
  }
  assert.doesNotMatch(CSS, /\bposition\s*:/, 'no position');
});

test('L11 two short vibrations about 250 ms apart; every call is caught', () => {
  const r = rig(P);
  r.call('onInit');
  assert.deepEqual(r.buzz.map((b) => b.mode), ['short']);
  assert.equal(r.timers.size, 1);
  r.adv(199);
  assert.equal(r.buzz.length, 1);
  r.adv(101);
  assert.deepEqual(r.buzz.map((b) => b.mode), ['short', 'short']);
  const gap = r.buzz[1].at - r.buzz[0].at;
  assert.ok(gap >= 200 && gap <= 300, `${gap} ms apart`);
  r.adv(5000);
  assert.equal(r.buzz.length, 2, 'two, no more');
  assert.equal(r.timers.size, 0);
  const t = rig(P, { vibrateThrows: true });
  assert.doesNotThrow(() => t.call('onInit'));
  assert.deepEqual(shown(t.page), ['Workout done', P.h1, P.h2, P.h3, P.h4, P.h5]);
  assert.doesNotThrow(() => t.adv(300));
  assert.equal(t.buzz.length, 2, 'the second is tried after the first threw');
  assert.match(read('js'), /vibrator\.vibrate\(\{ mode: 'short', success: no, fail: no \}\)/, 'with the callbacks the C3 page passes');
});

test('L11 a tap anywhere returns to the index page with router.replace; not in the first second', () => {
  const r = rig(P);
  r.call('onInit');
  r.adv(500);
  r.call('onTap');
  assert.deepEqual(r.replace, [], 'a touch carried over from the index page does not skip the highlights');
  r.adv(600);
  r.call('onTap');
  assert.deepEqual(r.replace, [{ uri: 'pages/index/index' }]);
  const f = rig(P, { replaceThrows: 1 });
  f.call('onInit');
  f.adv(1500);
  assert.doesNotThrow(() => f.call('onTap'));
  f.call('onTap');
  assert.deepEqual(f.replace, [{ uri: 'pages/index/index' }, { uri: 'pages/index/index' }], 'a failed replace can be tapped again');
  assert.doesNotMatch(read('js'), /router\.(push|back|clear)\b/, 'only replace works on lite');
});

test('L11 onDestroy clears its timer: a tap before the second vibration stops it', () => {
  const r = rig(P);
  r.call('onInit');
  const [id] = [...r.timers.keys()];
  r.adv(100);
  r.call('onDestroy');
  assert.ok(r.cleared.includes(id), 'the pending timer is cleared');
  r.adv(1000);
  assert.equal(r.buzz.length, 1, 'no vibration after the page left');
  const d = rig(P);
  d.call('onInit');
  d.adv(300);
  assert.doesNotThrow(() => d.call('onDestroy'), 'nothing pending: still fine');
  const e = rig(P, { vibrateThrows: true });
  assert.doesNotThrow(() => { e.call('onInit'); e.call('onTap'); e.adv(2000); e.call('onTap'); e.call('onDestroy'); });
});

const JS_RULES = [
  ['RegExp', /\bRegExp\b/],
  ['regular expression literal', /(^|[=(,:[!&|?{};])\s*\/(?![/*])/m],
  ['.replace( (router.replace is the router module, not the String method that throws on the GT 6)', /(?<!\brouter)\.replace\(/],
  ['let', /\blet\b/],
  ['const', /\bconst\b/],
  ['=>', /=>/],
  ['class', /\bclass\b/],
  ['template string', /`/],
  ['typeof x === "object" (babel adds its _typeof helper)', /typeof [\w.[\]]+ === 'object'/],
];

test('L11 no link.js or wearengine.js: the page imports only @system.router and @system.vibrator, and stores nothing', () => {
  const js = read('js');
  assert.deepEqual([...js.matchAll(/^import (\w+) from '([^']+)';$/gm)].map((m) => m[2]), ['@system.router', '@system.vibrator']);
  assert.equal([...js.matchAll(/\bimport\b/g)].length, 2);
  assert.doesNotMatch(js, /link\.js|wearengine|\brequire\b|@system\.(storage|sensor|brightness)|\$app/);
  for (const ext of ['hml', 'css']) assert.doesNotMatch(read(ext), /link|wearengine|import/);
});

test('L11 ES5 and ASCII: every hl source is ASCII; hl.js keeps the GT 6 page style and transforms to ES5 with no helper', async () => {
  for (const ext of ['hml', 'css', 'js']) {
    const buf = readFileSync(path.join(HL, `hl.${ext}`));
    const at = buf.findIndex((b) => b > 0x7f || (b < 0x20 && b !== 0x0a && b !== 0x09));
    assert.equal(at, -1, `hl.${ext}: byte ${buf[at]} at offset ${at}`);
  }
  let src = read('js');
  for (const [name, rule] of JS_RULES) assert.doesNotMatch(src, rule, `hl.js uses ${name}`);
  src = src.split('\n').filter((l) => !l.startsWith('import ')).join('\n').replace(/^export default \{/m, 'var page = {');
  // The page-method style hello/ ran on the GT 6, as W4 checks on the index page: two spaces in, on<Name>() {.
  src = src.replace(/^ {2}(on[A-Z]\w*)\(\) \{/gm, '  $1: function () {');
  assert.doesNotMatch(src, /\.\.\./, 'spread or rest');
  assert.doesNotMatch(src, /\.(substr|anchor|big|blink|bold|fixed|fontcolor|fontsize|italics|link|small|strike|sub|sup)\(|\b(un)?escape\(/, 'an Annex B method');
  const { transformSync } = await import('esbuild');
  const out = transformSync(src, { target: 'es5', loader: 'js' }).code;
  assert.doesNotMatch(out, /\b__\w+/, 'needs an esbuild helper');
  const methods = [...read('js').matchAll(/^ {2}(on[A-Z]\w*)\(\) \{/gm)].map((m) => m[1]);
  assert.deepEqual(methods, ['onInit', 'onTap', 'onDestroy']);
  for (const m of methods) {
    const body = read('js').split(`  ${m}() {`)[1];
    assert.match(body, /^\s*try \{/, `${m} catches what it throws`);
  }
});
