// GATE-FLAKE-3 (docs/COACHING-DECISIONS.md D-GF3-1): HT-6's C11 animation capture, shared by the gate and
// tests/gate/gf3-c11-race.mjs. Every animation on the panel is recorded in the page at the moment it is created
// (Element.prototype.animate, Animation.prototype.play, and the CSS animationstart / transitionrun events), so a read
// after a slow round trip still sees an animation that has already finished. Nothing is filtered: each recorded
// animation is one entry, as panel.getAnimations() listed it.

/** MARC_GF3_LAG (ms, probe mode): a delay between the action and the read, as a loaded runner adds. */
export const LAG = Number(process.env.MARC_GF3_LAG || 0);

/** In the page: the recorder, installed once, armed for `sel` with an empty log. */
function arm(sel) {
  const W = window;
  if (!W.__gf3) {
    const data = a => ({ k: a.effect.getKeyframes().map(f => ({ o: f.opacity, t: f.transform, off: f.offset })), d: a.effect.getTiming().duration, e: a.effect.getTiming().easing });
    const seen = new WeakSet();
    const on = t => W.__gf3.sel && t instanceof Element && t.matches(W.__gf3.sel);
    const note = a => { if (!seen.has(a) && on(a.effect?.target)) { seen.add(a); W.__gf3.log.push(data(a)); } };
    const animate = Element.prototype.animate, play = Animation.prototype.play;
    Element.prototype.animate = function (...args) { const a = animate.apply(this, args); note(a); return a; };
    Animation.prototype.play = function (...args) { const r = play.apply(this, args); note(this); return r; };
    for (const ev of ['animationstart', 'transitionrun']) document.addEventListener(ev, e => { if (on(e.target)) W.__gf3.log.push({ css: ev, name: e.animationName ?? e.propertyName }); }, true);
    W.__gf3 = { sel: null, log: [] };
  }
  W.__gf3.sel = sel; W.__gf3.log = [];
}

/**
 * The animations created on `sel` by `act()`: armed before the action, read once the panel is `until` ('shown' or
 * 'hidden') in the page, after LAG and two frames (CSS animation events arrive with the next frame).
 */
export async function captureAnims(page, sel, act, until) {
  await page.evaluate(arm, sel);
  await act();
  await page.waitForFunction(([s, u]) => { const el = document.querySelector(s); return !!el && el.hidden === (u === 'hidden'); }, [sel, until], { timeout: 8000 });
  if (LAG) await new Promise(r => setTimeout(r, LAG));
  return page.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(() => { const g = window.__gf3; g.sel = null; r(g.log); }))));
}

/** C11's rule, unchanged: exactly one animation, equal to golden B's. */
export const c11Bad = (app, gold) => JSON.stringify(app) !== JSON.stringify(gold) || app.length !== 1;

/** The recorder installed (not armed), for a test that adds a defect on top of it. */
export const install = page => page.evaluate(arm, null);
