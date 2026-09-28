// The pinned phone story on the home page (docs/WEBSITE-DESIGN.md section 5.2): one observer for the hero copy, the three
// steps and every main section (for the nav's current link), plus the phone-shrink fallback on phones. No scroll listener.
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
  let so = null;
  let st = null;
  let rt;

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

  const onStep = (es) => {
    es.forEach((e) => {
      const t = e.target;
      if (t.hasAttribute('data-i') === false) { if (e.isIntersecting) setCurrent(t.id); return; }
      if (e.isIntersecting) { act(+t.dataset.i); return; }
      /* a step that left above the band without the next one entering (a jump or a fast flick):
         light the last step whose top has passed the band, so the phone never keeps an earlier screen */
      if (t.dataset.i !== '0' && e.rootBounds && e.boundingClientRect.bottom <= e.rootBounds.top) {
        let last = null;
        steps.forEach((s) => { if (s.dataset.i !== '0' && s.getBoundingClientRect().top <= e.rootBounds.bottom) last = s; });
        if (last) act(+last.dataset.i);
      }
    });
  };

  const pinTop = () => parseFloat(getComputedStyle(pin).top) || 0;
  const band = () => {
    /* phones: a 24px band just under the pinned phone and its fade, so a step lights only once its heading is in the clear;
       desktop: the middle tenth of the viewport */
    if (narrow()) {
      const b = Math.round(pinTop() + parseFloat(getComputedStyle(pb).getPropertyValue('--phh')) + ms('--pin-fade') + 8);
      return '-' + b + 'px 0px -' + Math.max(0, Math.round(innerHeight - b - 24)) + 'px 0px';
    }
    return '-45% 0px -45% 0px';
  };

  const watch = () => {
    if (so) so.disconnect();
    so = new IntersectionObserver(onStep, { rootMargin: band() });
    steps.forEach((s) => so.observe(s));
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
}
