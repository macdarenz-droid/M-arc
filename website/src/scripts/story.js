// The pinned phone story on the home page (docs/WEBSITE-DESIGN.md section 5.2): one observer for the hero copy, the three
// steps and every main section (for the nav's current link), a one-frame scroll fallback for jumps, plus the phone-shrink
// fallback on phones.
import { motion, ms, setCurrent } from './site.js';

const d = document;
const q = (s, c) => (c || d).querySelector(s);
const qa = (s, c) => Array.from((c || d).querySelectorAll(s));

const pb = q('#pinblock');
if (pb) {
  const pin = q('.pin', pb);
  const ps = q('.pin-s', pb);
  const steps = qa('[data-i]');
  const narrow = () => matchMedia('(max-width: 900px)').matches;
  /* what the band watches for each step: on desktop the heading, because the step box is 100vh tall with its content centred
     and would light the step long before its heading arrives; on phones the box, whose top sits 76px above the heading */
  const tgt = (s) => (s.dataset.i === '0' || narrow() ? s : q('h3', s) || s);
  const lit = new Set(); /* the step targets inside the band right now */
  let bottom = 0; /* the band's lower edge in viewport px */
  let so = null;
  let st = null;
  let rt;
  let sf = 0;

  const act = (i) => {
    pb.dataset.step = i;
    steps.forEach((s) => {
      if (s.dataset.i === '0') return;
      if (+s.dataset.i === i) s.setAttribute('aria-current', 'step');
      else s.removeAttribute('aria-current');
    });
    if (i === 3) qa('.rings-story .ring').forEach((r) => r.classList.add('fill'));
    setCurrent(null);
  };

  /* the step a reader at the band has reached: the last one whose target has passed the band's lower edge. Runs whenever no
     target is in the band (a jump, a fast flick, the gap between two headings on desktop), so the phone never keeps an earlier
     screen or skips ahead */
  const scan = () => {
    let last = null;
    steps.forEach((s) => { if (tgt(s).getBoundingClientRect().top <= bottom) last = s; });
    if (last && pb.dataset.step !== last.dataset.i) act(+last.dataset.i);
  };

  const onStep = (es) => {
    es.forEach((e) => {
      const s = e.target.closest('[data-i]');
      if (!s) { if (e.isIntersecting) setCurrent(e.target.id); return; }
      if (e.isIntersecting) { lit.add(e.target); act(+s.dataset.i); } else lit.delete(e.target);
    });
    if (lit.size === 0) scan();
  };

  const pinTop = () => parseFloat(getComputedStyle(pin).top) || 0;
  const band = () => {
    /* phones: a 24px band just under the pinned phone and its fade, so a step lights only once its heading is in the clear;
       desktop: the middle tenth of the viewport */
    if (narrow()) {
      const b = Math.round(pinTop() + parseFloat(getComputedStyle(pb).getPropertyValue('--phh')) + ms('--pin-fade') + 8);
      bottom = Math.min(b + 24, innerHeight);
      return '-' + b + 'px 0px -' + Math.max(0, Math.round(innerHeight - b - 24)) + 'px 0px';
    }
    bottom = innerHeight * 0.55;
    return '-45% 0px -45% 0px';
  };

  const watch = () => {
    if (so) so.disconnect();
    lit.clear();
    so = new IntersectionObserver(onStep, { rootMargin: band() });
    steps.forEach((s) => so.observe(tgt(s)));
    qa('main > section[id]').forEach((s) => so.observe(s));
    /* the pinned phone's shrink where the browser has no scroll-driven animations: a class once the phone's own top passes its sticky line */
    if (st) st.disconnect();
    if (ps && !(window.CSS && CSS.supports('animation-timeline: scroll()'))) {
      const line = Math.round(pinTop());
      st = new IntersectionObserver((e) => {
        pb.classList.toggle('stuck', motion() && narrow() && e[0].boundingClientRect.top < line);
      }, { rootMargin: '-' + line + 'px 0px 0px 0px' });
      st.observe(ps);
    }
  };
  watch();
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(watch, 200); });
  /* a jump (a hash link, a dragged scrollbar, a programmatic scroll) can move the page so that no target crosses the band and the
     observer has nothing to report: while nothing is in the band, one scan per frame puts the right step on the phone */
  addEventListener('scroll', () => {
    if (sf) return;
    sf = requestAnimationFrame(() => { sf = 0; if (lit.size === 0) scan(); });
  }, { passive: true });
}
