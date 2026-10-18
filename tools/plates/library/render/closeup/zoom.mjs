// LIB-6: the How-to zoom sheet shell (golden B's howto/render-*.mjs family): hand close-up pages (hand.mjs), posture
// crops (crop.mjs), chip row and CSS (zoom-css.mjs). Options (closeups-8.mjs has the 8's records):
//   { shell: 'zoom', e1?, chipText, hand: {…hand.mjs}, thumb: {…thumb.mjs}, crop: { source: 'engine' | 'refSrc', …crop.mjs },
//     css: {…zoom-css.mjs} }
// `e1`: the first sheet's edition (lateral raise), whose posture section puts the feel link on its own line.
import { captions, chipRowOf, esc, feelLink, I, zoomTop } from './common.mjs';
import { engineCrop, refSrcCrop } from './crop.mjs';
import { handZoomOf } from './hand.mjs';
import { zoomCss } from './zoom-css.mjs';

export function zoomApi(mod, o) {
  const howto = mod.default;
  const { handZoom, PAGES } = handZoomOf(mod, o.hand, o.thumb);
  let cropHalf = null;
  const crop = () => (cropHalf ??= o.crop.source === 'refSrc' ? refSrcCrop(howto) : engineCrop(howto, o.crop));
  function postureZoom(z) {
    const sub = role => z.callout[role].text.replace(/<br\s*\/?>/g, ' ');   // the crop's own label, printed once under the word
    const head = ok => `<div class="z-head ${ok ? 'ok' : 'm'}">${ok ? I.check(18) : I.x(18)}<b>${ok ? 'Right' : 'Wrong'}</b></div><div class="z-sub ${ok ? 'ok' : 'm'}">${esc(sub(ok ? 'right' : 'wrong').toUpperCase())}</div>`;
    const c = crop();
    if (o.e1) return `<section class="zoom" role="region" aria-labelledby="zh-${z.key}">${zoomTop(z)}
    <div class="z-pair"><div>${head(true)}${c(z, 'right')}</div><div>${head(false)}${c(z, 'wrong')}</div></div>
    ${captions(z.caption)}
    ${feelLink(z)}
  </section>`;
    return `<section class="zoom" role="region" aria-labelledby="zh-${z.key}">${zoomTop(z)}
    ${z.camLabel ? `<div class="th-cam eyebrow z-cam">${esc(z.camLabel)}</div>` : ''}<div class="z-pair${z.camLabel ? ' has-cam' : ''}"><div>${head(true)}${c(z, 'right')}</div><div>${head(false)}${c(z, 'wrong')}</div></div>
    ${captions(z.caption)}${feelLink(z)}</section>`;
  }
  return { handZoom, postureZoom, zoomSection: undefined, chipRow: chipRowOf(howto, o.chipText), PAGES, CSS: zoomCss(o.css), ZCSS: undefined, howto };
}
