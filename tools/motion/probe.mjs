// MO: numeric checks of the motion lab's chest press, on the real solver (headless Chromium + three.js).
//   node tools/motion/probe.mjs <path-to-a-three@0.186.1-package>
// Each check prints PASS/FAIL with the measured value; exit code 1 on any failure. The checks refuse to pass on
// a still pose (the handle must travel and the elbow must open), so a broken loop cannot look green.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { chromium } from '../../node_modules/playwright/index.mjs';

const THREE_DIR = resolve(process.argv[2] || '');
const ROOT = resolve(new URL('../..', import.meta.url).pathname);
const types = { '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.glb': 'model/gltf-binary', '.html': 'text/html' };
const page = `<!doctype html><meta charset="utf-8"><script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<canvas id="c"></canvas><script type="module">
const L = '/docs/design/motion-lab/';
const { createMotion } = await import(L + 'src/motion.js');
const ex = (await import(L + 'src/exercises/machineChestPress.js')).default;
const j = async (p) => (await fetch(L + p)).json();
const m = await createMotion({ canvas: document.getElementById('c'), themes: await j('src/themes.json'), exercise: ex, width: 360, height: 400,
  assets: { figure: L + 'assets/figure.glb', machine: L + 'assets/chest-press.glb', meta: await j('assets/figure.meta.json'), regions: await j('assets/figure.regions.json') } });
const out = { reach: { L: m.rig.restLen('LeftArm','LeftForeArm') + m.rig.restLen('LeftForeArm','LeftHand'), R: m.rig.restLen('RightArm','RightForeArm') + m.rig.restLen('RightForeArm','RightHand') } };
for (const mode of Object.keys(ex.modes)) { if (mode === 'reach') continue;
  m.setMode(mode); out[mode] = [];
  for (let k = 0; k <= 66; k++) { const t = k * m.cycle / 66; const r = m.renderAt(t).report; out[mode].push({ t, phase: r.phase, u: r.u, L: r.Left, R: r.Right, c: r.contacts, handle: r.handle, shoulder: r.shoulder, nippleY: r.nippleY, nippleNow: r.nippleNow, slantL: r.Left.handleSlant }); }
}
window.result = out;
</script>`;
const srv = createServer(async (req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  if (url === '/') { res.writeHead(200, { 'content-type': 'text/html' }); return res.end(page); }
  const file = url.startsWith('/three/') ? join(THREE_DIR, url.slice(7)) : join(ROOT, url);
  try { const b = await readFile(file); res.writeHead(200, { 'content-type': types[extname(file)] || 'application/octet-stream' }); res.end(b); }
  catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = srv.address().port;
const browser = await chromium.launch({ executablePath: process.env.MARC_CHROMIUM || '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await browser.newPage();
const errs = []; p.on('pageerror', e => errs.push(e.message));
await p.goto(`http://127.0.0.1:${port}/`);
const R = await p.waitForFunction(() => window.result, null, { timeout: 120000 }).then(h => h.jsonValue()).catch(() => null);
await browser.close(); srv.close();
if (!R) { console.log('FAIL could not run the solver', errs.join(' | ')); process.exit(1); }

let fails = 0;
const check = (name, ok, value) => { console.log(`${ok ? 'PASS' : 'FAIL'} ${name}: ${value}`); if (!ok) fails++; };
const at = (mode, phase, pick = 'first') => { const f = R[mode].filter(x => x.phase === phase); return pick === 'first' ? f[0] : f[Math.floor(f.length / 2)]; };
const fx = (x, d = 1) => (typeof x === 'number' ? x.toFixed(d) : String(x));

// motion is real: the handle travels and the elbow opens
const s0 = at('right', 'press'), s1 = at('right', 'hold', 'mid');
const travel = Math.hypot(...s1.handle.map((v, i) => v - s0.handle[i]));
check('handle travels over the press (>= 0.30 m)', travel >= 0.30, fx(travel, 3) + ' m');
check('elbow opens over the press (>= 90 deg)', s0.L.elbowFlex - s1.L.elbowFlex >= 90, fx(s0.L.elbowFlex) + ' -> ' + fx(s1.L.elbowFlex));
// setup and posture (research: handles mid-chest; upper arm 45-70 deg from the torso; elbow soft at the end)
check('start: handles at the nipple line (+-1 cm)', Math.abs(s0.handle[1] - s0.nippleY) <= 0.01, fx((s0.handle[1] - s0.nippleY) * 100) + ' cm');
check('start: upper arm 45-70 deg from the torso', s0.L.flare >= 45 && s0.L.flare <= 70 && s0.R.flare >= 45 && s0.R.flare <= 70, fx(s0.L.flare) + ' / ' + fx(s0.R.flare));
check('end: elbow soft, 10-18 deg short of straight', [s1.L.elbowFlex, s1.R.elbowFlex].every(e => e >= 10 && e <= 18), fx(s1.L.elbowFlex) + ' / ' + fx(s1.R.elbowFlex));
const rise = s1.handle[1] - s0.handle[1];
check('handle rise inside the measured range of overhead-pivot presses (5-25 cm)', rise >= 0.05 && rise <= 0.25, fx(rise * 100) + ' cm');
check('end: hands no more than 20 cm above the shoulder joint', s1.handle[1] - s1.shoulder[1] <= 0.20, fx((s1.handle[1] - s1.shoulder[1]) * 100) + ' cm');
// contacts every frame of the right form: back on the pad, hips on the seat, fingers on the handle
const right = R.right;
const backBad = right.filter(f => f.c.back < -0.012 || f.c.back > 0.003).length;
check('back on the pad every frame (pressed 0-12 mm, never off)', backBad === 0, `${backBad} of ${right.length} frames out`);
const seatBad = right.filter(f => f.c.seat < -0.02 || f.c.seat > 0.003).length;
check('hips on the seat every frame', seatBad === 0, `${seatBad} of ${right.length} frames out`);
const worst = (key) => right.map(f => ({ t: f.t.toFixed(2), ph: f.phase, slant: f.slantL?.toFixed(1), g: Math.max(f.L.gripGaps[key], f.R.gripGaps[key]) })).sort((a, b) => b.g - a.g).slice(0, 3);
if (process.env.PROBE_DEBUG) console.log('arm lengths', JSON.stringify(R.reach), 'rolloff hold L/R reach', JSON.stringify(at('rolloff','hold','mid').L.reach), JSON.stringify(at('rolloff','hold','mid').R.reach));
if (process.env.PROBE_DEBUG) console.log('worst thumb', JSON.stringify(worst('Thumb')), 'worst ring', JSON.stringify(worst('Ring')), 'worst index', JSON.stringify(worst('Index')), 'worst pinky', JSON.stringify(worst('Pinky')), 'worst middle', JSON.stringify(worst('Middle')));
const fingerGap = Math.max(...right.flatMap(f => ['Index', 'Middle', 'Ring', 'Pinky'].flatMap(n => [f.L.gripGaps[n], f.R.gripGaps[n]])));
check('fingers within 8 mm of the handle every frame', fingerGap <= 8, fx(fingerGap) + ' mm max');
const thumbGap = Math.max(...right.flatMap(f => [f.L.gripGaps.Thumb, f.R.gripGaps.Thumb]));
check('thumb tip within 12 mm of its place over the fingers', thumbGap <= 12, fx(thumbGap) + ' mm max');
const wrist = Math.max(...right.map(f => Math.max(f.L.wristSwing, f.R.wristSwing)));
check('wrist close to straight (bend <= 15 deg) every frame', wrist <= 15, fx(wrist) + ' deg max');
// mistakes show what they say
const sl = at('seat', 'press');
check('seat low: handles at least 6 cm above the nipple line', sl.handle[1] - sl.nippleNow >= 0.06, fx((sl.handle[1] - sl.nippleNow) * 100) + ' cm');
const wr = at('wrist', 'hold', 'mid');
check('wrist mistake: wrist bent back >= 25 deg', Math.min(wr.L.wristSwing, wr.R.wristSwing) >= 25, fx(wr.L.wristSwing) + ' / ' + fx(wr.R.wristSwing));
const ro = at('rolloff', 'hold', 'mid');
check('roll-off: elbows locked (<= 5 deg)', ro.L.elbowFlex <= 5 && ro.R.elbowFlex <= 5, fx(ro.L.elbowFlex) + ' / ' + fx(ro.R.elbowFlex));
check('roll-off: shoulder blades off the pad (>= 2 cm)', ro.c.blades >= 0.02, fx(ro.c.blades * 100) + ' cm');
check('roll-off: the right form keeps the blades on the pad', s1.c.blades <= 0.003, fx(s1.c.blades * 100) + ' cm');
console.log(fails ? `\n${fails} check(s) failed` : '\nall checks passed');
process.exit(fails ? 1 : 0);
