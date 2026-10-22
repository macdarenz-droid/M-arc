// LIB-7b (D-LIB7b-HALVES condition 2): exactly what golden B's splitHalves (howto-layers.mjs:112) adds to a hand SVG,
// removed: the halves' role="img" and aria-label, the texts' aria-hidden, and the root's role and label restored
// ("<camera>. Right: <a> Wrong: <b>") from the halves' labels.
export function unsplit(h) {
  return h.replace(/<svg class="hand-svg[^>]*>[\s\S]*?<\/svg>/g, svg => {
    const halves = [...svg.matchAll(/<g class="(?:h-panel|zx-half) (right|wrong)" role="img" aria-label="(Right|Wrong): ([^"]*)">/g)];
    if (!halves.length) return svg;
    const r = halves.find(x => x[1] === 'right')[3], w = halves.find(x => x[1] === 'wrong')[3];
    return svg.replace(/^(<svg class="hand-svg[^>]*?) role="group" aria-label="([^"]*)"/, (m, a, cam) => `${a} role="img" aria-label="${cam}. Right: ${r} Wrong: ${w}"`)
      .replace(/<text aria-hidden="true" /g, '<text ')
      .replace(/<g class="((?:h-panel|zx-half) (?:right|wrong))" role="img" aria-label="[^"]*">/g, '<g class="$1">');
  });
}
