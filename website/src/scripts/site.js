// Shared page behaviour: nav state, menu, reveals and demos, copy buttons, cursor shine (docs/WEBSITE-DESIGN.md sections 5 and 6).
// The head's inline one-liner already set html.js and html.m before first paint; this module keeps html.m in step with the OS.
const d = document;
const h = d.documentElement;
const q = (s, c) => (c || d).querySelector(s);
const qa = (s, c) => Array.from((c || d).querySelectorAll(s));

h.classList.add('js');
const mq = matchMedia('(prefers-reduced-motion: reduce)');
const setM = () => h.classList.toggle('m', mq.matches === false);
setM();
mq.addEventListener('change', setM);
export const motion = () => h.classList.contains('m');
/* a duration token in milliseconds; the CSS minifier rewrites 1500ms as 1.5s, so read the unit */
export const ms = (name) => {
  const v = getComputedStyle(h).getPropertyValue(name).trim();
  const n = parseFloat(v) || 0;
  return /s$/.test(v) && !/ms$/.test(v) ? n * 1000 : n;
};

/* the mark draws on load and again on hover of the lockup */
const lk = q('#lockup');
if (lk) {
  const draw = () => { lk.classList.remove('draw'); void lk.offsetWidth; lk.classList.add('draw'); };
  if (motion()) draw();
  lk.addEventListener('animationend', (e) => { if (e.target.tagName === 'circle') lk.classList.remove('draw'); });
  if (matchMedia('(pointer: fine)').matches) lk.addEventListener('pointerenter', () => { if (motion()) draw(); });
  /* on the page it points at, the lockup scrolls to the top instead of reloading */
  lk.addEventListener('click', (e) => {
    if (lk.pathname !== location.pathname) return;
    e.preventDefault();
    scrollTo({ top: 0, behavior: motion() ? 'smooth' : 'auto' });
    const main = q('#main');
    if (main) main.focus({ preventScroll: true });
  });
}

/* the header turns solid once the 1px sentinel at the page top has left the viewport */
const nav = q('#nav');
const sentinel = q('#sentinel');
if (nav && sentinel && !nav.classList.contains('on')) {
  new IntersectionObserver((e) => nav.classList.toggle('on', e[0].isIntersecting === false)).observe(sentinel);
}

/* the phone menu: focus its first link when it opens, close on a choice and on Escape */
const menu = q('.menu');
if (menu) {
  menu.addEventListener('toggle', () => { if (menu.open) { const a = q('a', menu); if (a) a.focus(); } });
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) menu.removeAttribute('open'); });
  menu.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menu.open) { menu.removeAttribute('open'); q('summary', menu).focus(); } });
}

/* the nav link whose section is in view (the story observer calls this on the home page) */
const links = qa('#navlinks a');
export const setCurrent = (id) => {
  links.forEach((a) => { if (id && a.hash === '#' + id) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current'); });
};
/* on its own page (Privacy), the link to this page is current from the start */
links.forEach((a) => { if (!a.hash && a.pathname === location.pathname) a.setAttribute('aria-current', 'true'); });

/* reveals and the once-only demos */
const play = {
  rings(el) { qa('.ring', el).forEach((r) => r.classList.add('fill')); },
  rest(el) {
    if (motion() === false) return;
    const t = q('.rest-clock', el); /* the clock text only: .rest-time also holds the Go span the done state shows */
    const v = ['1:29', '1:28'];
    let i = 0;
    const tick = ms('--dur-tick');
    const f = () => { if (i < v.length) { t.textContent = v[i++]; setTimeout(f, tick); } else el.classList.add('done'); };
    setTimeout(f, tick);
  },
  undo(el) {
    if (motion() === false) return;
    const b = q('.undo-bar b', el);
    b.addEventListener('transitionend', () => el.classList.add('applied'));
    requestAnimationFrame(() => el.classList.add('run'));
  },
};
const io = new IntersectionObserver((es) => {
  es.forEach((e) => {
    const el = e.target;
    const k = el.dataset.play;
    const need = k ? 0.4 : 0.2;
    if (e.isIntersecting === false || e.intersectionRatio < need) return;
    el.classList.add('in');
    io.unobserve(el);
    if (k && play[k]) play[k](el);
  });
}, { threshold: [0.2, 0.4] });
qa('.r, .st, [data-play]').forEach((el) => io.observe(el));
/* Safety: a capture, a print or a reader that never scrolls must still see every section, so anything not yet revealed
   3 s after load is revealed in place (the demos keep waiting for their own view). */
const revealAll = () => qa('.r:not(.in), .st:not(.in)').forEach((el) => { el.classList.add('in'); io.unobserve(el); });
addEventListener('load', () => setTimeout(revealAll, 3000), { once: true });
addEventListener('beforeprint', revealAll);

/* each screenshot wipes in when it has loaded */
qa('img.wipe').forEach((im) => {
  const f = () => im.classList.add('ld');
  if (im.complete && im.naturalWidth) f();
  else { im.addEventListener('load', f); im.addEventListener('error', f); }
});

/* cursor-following border shine: bound only with motion on and a fine pointer */
if (motion() && matchMedia('(hover: hover) and (pointer: fine)').matches) {
  d.addEventListener('pointermove', (e) => {
    const el = e.target.closest ? e.target.closest('.sh') : null;
    if (el === null) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
}

/* copy buttons: the exact text, "Copied" for --dur-copied, a selection if the clipboard is refused */
qa('[data-copy]').forEach((b) => {
  b.addEventListener('click', () => {
    const el = q(b.dataset.copy);
    if (!el) return;
    const t = el.textContent.trim();
    const done = () => { b.textContent = 'Copied'; setTimeout(() => { b.textContent = 'Copy'; }, ms('--dur-copied')); };
    const fail = () => { const s = getSelection(); const r = d.createRange(); r.selectNodeContents(el); s.removeAllRanges(); s.addRange(r); };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(t).then(done, fail);
    else fail();
  });
});
