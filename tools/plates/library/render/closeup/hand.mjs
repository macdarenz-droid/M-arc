// LIB-6: the hand close-up of a zoom sheet (S2), from golden B's howto/render-*.mjs handZoom(). One builder; the
// layouts and the bespoke parts are named options (closeups-8.mjs records the 8):
//   layout 'paged'  - Right/Wrong pages plus an optional thumb page, with a pager (pull-up, leg raise, lat pulldown);
//          'single' - one Right/Wrong page (seated cable row);
//          'framed' - one page, its captions, an end-on inset under it, on separate lines (lateral raise).
//   fit 'shared'    - every page drawn at one shared scale, with the Face -> Machine orientation row (lat pulldown).
//   stripLoad, fingerBase (pull-up); stripLoadLine, frontCameraLabel, dropFarFingerWrong, inset (lateral raise);
//   bendLabel {dx, dy, anchor} - move the Wrong bend value off the wedge (lateral raise, seated cable row);
//   handleChoiceHint - the sore-hands line under the limit hint (lat pulldown).
import { renderHandPair } from '../../../layers/engine/hand.mjs';
import { renderEndOnInset } from '../../../layers/howto/end-on-inset.mjs';
import { captions, esc, f, feelLink, mergePose, mergeWristFingers, nums, pagerOf, zoomTop } from './common.mjs';
import { fingerBaseMarks, stripLoad } from './hand-marks.mjs';
import { thumbPage } from './thumb.mjs';

/** Move the Wrong half's bend value (the engine sets it on the wedge's bisector) to an offset from the Wrong wrist. */
function moveBendLabel(svg, { dx, dy, anchor }) {
  const i = svg.indexOf('<g class="h-panel wrong">');
  const wj = svg.slice(i).match(/<circle class="h-joint wrist" cx="([\d.-]+)" cy="([\d.-]+)"/);
  if (i >= 0 && wj) svg = svg.replace(/<text class="h-val m" x="[\d.-]+" y="[\d.-]+" text-anchor="\w+">(\d+°)<\/text>/, (m0, v) =>
    `<text class="h-val m" x="${f(+wj[1] + dx)}" y="${f(+wj[2] + dy)}" text-anchor="${anchor}">${v}</text>`);
  return svg;
}

const PW = (358 - 16) / 2, ORIENT_H = 16;
const partBox = (svg, uid) => { let b = [1e9, 1e9, -1e9, -1e9];
  for (const m of svg.matchAll(new RegExp(`<path id="${uid}-[a-z0-9-]+" d="([^"]+)"`, 'g'))) { const n = nums(m[1]);
    for (let i = 0; i < n.length - 1; i += 2) b = [Math.min(b[0], n[i]), Math.min(b[1], n[i + 1]), Math.max(b[2], n[i]), Math.max(b[3], n[i + 1])]; }
  return b; };

// Shared fit: the hand pages share ONE fit, so paging changes only the Wrong half: every page is drawn at the smallest of
// the pages' own scales (each half scaled about its wrist), the Right hand is centred in its column at the same place on
// every page, and the Wrong hand is centred in its column at the same wrist height. The engine's pair SVG is taken apart
// and put back together (the engine is not changed). An orientation row (Face -> Machine) sits under the camera label.
function sharedFitPairs(pairs) {
  const raw = pairs.map(({ page, fault, pair, uid }) => {
    const [wr, ww] = [...pair.svg.matchAll(/h-joint wrist" cx="([\d.]+)" cy="([\d.]+)"/g)].map(m => [+m[1], +m[2]]);
    return { page, fault, pair, k: pair.report.scalePxPerMm, wr, ww, bR: partBox(pair.svg, `${uid}-r`), bW: partBox(pair.svg, `${uid}-w`) };
  });
  const kc = Math.min(...raw.map(r => r.k)), ref = raw.find(r => r.k === kc);
  const rel = (b, w, s) => [(b[0] - w[0]) * s, (b[1] - w[1]) * s, (b[2] - w[0]) * s, (b[3] - w[1]) * s];
  const bR0 = rel(ref.bR, ref.wr, 1), Ty = ref.wr[1];                    // wrist height of the page drawn at kc
  const TR = [PW / 2 - (bR0[0] + bR0[2]) / 2, Ty];
  return Object.fromEntries(raw.map(r => {
    const s = kc / r.k, bW = rel(r.bW, r.ww, s), TW = [PW + 16 + PW / 2 - (bW[0] + bW[2]) / 2, Ty];
    return [r.page, { ...r, s, TR, TW, map: (p, w, T) => [T[0] + (p[0] - w[0]) * s, T[1] + (p[1] - w[1]) * s] }];
  }));
}
function sharedPairSvg(P) {
  const svg = P.pair.svg;
  const g0 = svg.indexOf('<g class="h-panel right">'), g1 = svg.indexOf('</g><g class="h-panel wrong">') + 4;
  const labelsAt = svg.search(/(<text class="h-val[^>]*>[^<]*<\/text>)*<\/svg>$/);
  const rightG = svg.slice(g0, g1);
  let wrongG = svg.slice(g1, labelsAt);
  const labels = svg.slice(labelsAt, -'</svg>'.length);
  // Slipping out: the load line starts at the bar and ends at wrist height (the bar pulls the hand back).
  if (P.fault.markers.includes('slip-arrow')) {
    const line = wrongG.match(/<path class="h-load m" d="([^"]+)"\/>/), head = wrongG.match(/<path class="h-load-head m" d="([^"]+)"\/>/);
    const hn = nums(head[1]), tipY = Math.max(hn[1], hn[3], hn[5]), dy = P.ww[1] - tipY, ln = nums(line[1]);
    wrongG = wrongG.replace(line[0], `<path class="h-load m" d="M${ln[0]} ${ln[1]}L${ln[2]} ${f(ln[3] + dy)}"/>`)
      .replace(head[0], `<path class="h-load-head m" d="M${hn[0]} ${f(hn[1] + dy)}L${hn[2]} ${f(hn[3] + dy)}L${hn[4]} ${f(hn[5] + dy)}Z"/>`);
  }
  // Bend label: moved from the arc's middle to the left of the straight (dotted) forearm line, level with the arc.
  const lab = [...labels.matchAll(/<text class="(h-val[^"]*)" x="([\d.-]+)" y="([\d.-]+)" text-anchor="[a-z]+">([^<]*)<\/text>/g)].map(m => {
    const wrong = /\bm\b/.test(m[1]), w = wrong ? P.ww : P.wr;
    const [x, y] = P.map([wrong ? w[0] - 7 : +m[2], +m[3]], w, wrong ? P.TW : P.TR);
    return `<text class="${m[1]}" x="${f(x)}" y="${f(y)}" text-anchor="${wrong ? 'end' : 'middle'}">${m[4]}</text>`; }).join('');
  const tf = (w, T) => `translate(${f(T[0])} ${f(T[1])}) scale(${+P.s.toFixed(4)}) translate(${f(-w[0])} ${f(-w[1])})`;
  const W = 358, Hh = +svg.match(/viewBox="0 0 \d+ ([\d.]+)"/)[1], H2 = Hh + ORIENT_H;
  const headEnd = svg.indexOf('<text class="h-cam"'), camEnd = svg.indexOf('</text>', headEnd) + 7;
  const cx = W / 2, oy = 37;
  const orient = `<g class="h-orient" aria-hidden="true"><text x="${cx - 24}" y="${oy}" text-anchor="end">FACE</text>`
    + `<path d="M${cx - 17} ${oy - 4}H${cx + 16}M${cx + 12} ${oy - 7}L${cx + 16} ${oy - 4}L${cx + 12} ${oy - 1}"/>`
    + `<text x="${cx + 23}" y="${oy}">MACHINE</text></g>`;
  return svg.slice(0, headEnd).replace(`viewBox="0 0 ${W} ${Hh}"`, `viewBox="0 0 ${W} ${H2}"`).replace(`<rect width="${W}" height="${W}"`, `<rect width="${W}" height="${H2}"`)
      .replace(/aria-label="Seen from the side\. /, 'aria-label="Seen from the side, the lifter facing the machine on the right. ')
    + svg.slice(headEnd, camEnd) + orient + `<g transform="translate(0 ${ORIENT_H})">` + svg.slice(camEnd, g0)
    + `<g transform="${tf(P.wr, P.TR)}">${rightG}</g><g transform="${tf(P.ww, P.TW)}">${wrongG}</g>${lab}</g></svg>`;
}

/** handZoom(page) and PAGES for one exercise. `mod` is the howto module (THUMB_PAGE), `o` the hand options. */
export function handZoomOf(mod, o, thumbOpts = {}) {
  const howto = mod.default;
  const z = howto.zooms.find(q => q.kind === 'hand'), h = howto.handling;
  const tail = `\n  <p class="grip-line">${esc(h.gripLine)}</p>\n  <p class="hint limit">${esc(h.wrist.limitText)}</p>`
    + (o.handleChoiceHint && h.handleChoice ? `<p class="hint limit">${esc(h.handleChoice.sore)}</p>` : '');
  const pairFor = (page, i) => {
    const fault = z.hand.wrong[i];
    const uid = o.layout === 'single' ? o.uid : `${o.uid}-${page}`;
    const pair = renderHandPair({ uid, camera: z.hand.camera, loadAxis: h.loadAxis, markers: fault.markers, right: z.hand.right,
      wrong: mergePose(z.hand.right, fault.pose), rightNote: o.rightNote ?? z.rightNote, wrongNote: fault.label,
      alt: { right: z.alt.right, wrong: i === 0 ? z.alt.wrong : z.alt.wrong2 }, panelHeight: o.panelHeight });
    return { page, fault, pair, uid };
  };

  if (o.layout === 'single') {
    return { PAGES: undefined, handZoom() {
      let svg = pairFor('p1', 0).pair.svg;
      if (o.bendLabel) svg = moveBendLabel(svg, o.bendLabel);
      return `<section class="zoom" role="region" aria-labelledby="zh-${z.key}">${zoomTop(z)}<div class="hand-plate">${svg}</div>${captions(z.caption)}${feelLink(z)}</section>${tail}`;
    } };
  }

  if (o.layout === 'framed') {
    return { PAGES: undefined, handZoom() {
      const fault = z.hand.wrong[0];
      const pair = renderHandPair({ uid: o.uid, camera: 'side', loadAxis: h.loadAxis, markers: fault.markers, right: z.hand.right, wrong: mergeWristFingers(z.hand.right, fault.pose),
        rightNote: o.rightNote, wrongNote: fault.label, alt: { right: z.alt.right, wrong: z.alt.wrong }, panelHeight: o.panelHeight });
      let svg = pair.svg;
      // renderHandPair prints only "above" or "side": a hand seen from the front prints the spec's own cameraLabel
      if (o.frontCameraLabel && z.hand.camera === 'front') {
        const cam = z.hand.cameraLabel;
        if (!cam) throw new Error('hand zoom with camera "front" needs hand.cameraLabel');
        svg = svg.replace('>SEEN FROM THE SIDE<', `>${esc(cam.toUpperCase())}<`).replace('aria-label="Seen from the side.', `aria-label="${esc(cam)}.`);
      }
      // the force line only for 'along-forearm': drop the load line and the Right half's wrist tick; contact dots stay
      if (o.stripLoadLine && h.loadAxis !== 'along-forearm')
        svg = svg.replace(/<path class="h-load( m)?" d="[^"]*"\/><path class="h-load-head( m)?" d="[^"]*"\/>/g, '').replace(/<path class="h-tick" d="[^"]*"\/>/g, '');
      // Wrong half only: the far (middle) finger's lighter outline beside the open index finger reads as a doubled line
      if (o.dropFarFingerWrong) { const i = svg.indexOf('<g class="h-panel wrong">');
        svg = svg.slice(0, i) + svg.slice(i).replace(/<g class="h-far"><g class="u-stroke">(?:<use [^>]*\/>)*<\/g><g class="u-fill">(?:<use [^>]*\/>)*<\/g><\/g>/, ''); }
      if (o.bendLabel) svg = moveBendLabel(svg, o.bendLabel);
      const inset = renderEndOnInset({ label: z.hand.inset.label, camera: z.hand.inset.cameraLabel, right: z.hand.inset.right, wrong: z.hand.inset.wrong, alt: { right: z.alt.insetRight, wrong: z.alt.insetWrong } });
      return `<section class="zoom" role="region" aria-labelledby="zh-${z.key}">${zoomTop(z)}
    <div class="hand-plate">${svg}</div>${captions(z.caption)}
    <div class="hand-plate inset">${inset.svg}</div>
    ${feelLink(z)}
  </section>${tail}`;
    } };
  }

  if (o.layout !== 'paged') throw new Error(`hand close-up: unknown layout ${o.layout}`);
  const PAGES = o.pages, pager = pagerOf(PAGES);
  const pairPages = PAGES.filter(p => p.key !== 'thumb').map(p => p.key);
  let shared = null;
  const sharedOf = () => (shared ??= sharedFitPairs(pairPages.map((page, i) => pairFor(page, i))));
  return { PAGES, handZoom(page) {
    let body;
    if (page === 'thumb') body = thumbPage(mod.THUMB_PAGE, h.loadAxis, thumbOpts);
    else if (o.fit === 'shared') body = `<div class="hand-plate">${sharedPairSvg(sharedOf()[page])}</div>${captions(page === 'p1' ? z.caption : z.captionPage2)}`;
    else {
      const { fault, pair } = pairFor(page, page === 'p1' ? 0 : 1);
      let svg = pair.svg;
      if (o.stripLoad && h.loadAxis !== 'along-forearm') svg = stripLoad(svg);
      if (o.fingerBase && fault.fingerBase) svg = svg.replace('</svg>', fingerBaseMarks(svg, pair.report.scalePxPerMm, z.hand.right, mergePose(z.hand.right, fault.pose)) + '</svg>');
      body = `<div class="hand-plate">${svg}</div>${captions(page === 'p1' ? z.caption : z.captionPage2)}`;
    }
    return `<section class="zoom" role="region" aria-labelledby="zh-${z.key}">${zoomTop(z)}${body}${pager(page)}${feelLink(z)}</section>${tail}`;
  } };
}
