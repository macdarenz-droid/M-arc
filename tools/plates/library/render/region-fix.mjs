// LIB-6: the body-map stomach fix golden B applies to every feel map on its page. In golden B it runs as a side effect
// of loading howto/render-hanging_leg_raise.mjs (its REGION_FIX, lines 98-110, logic verbatim here); a page whose
// leg-raise close-ups come from the library renderer applies it through this module instead. Idempotent: a page that
// also loads the frozen leg-raise script has it applied once, by whichever runs first.
export const REGION_FIX = { swapToObliques: ['abs-upper-left', 'abs-upper-right'], splitObliques: ['obliques-left', 'obliques-right'] };

export const regionFixApplied = FRONT_PARTS => FRONT_PARTS.some(x => x.id === 'abs-upper-central-left');

export function applyRegionFix(FRONT_PARTS) {
  if (regionFixApplied(FRONT_PARTS)) return false;
  for (const id of REGION_FIX.swapToObliques) { const q = FRONT_PARTS.find(x => x.id === id); if (!q || q.muscle !== 'abs') throw new Error(`region fix: ${id} not abs`); q.muscle = 'obliques'; }
  for (const id of REGION_FIX.splitObliques) {
    const i = FRONT_PARTS.findIndex(x => x.id === id), q = FRONT_PARTS[i];
    if (!q || q.muscle !== 'obliques') throw new Error(`region fix: ${id} not obliques`);
    const sub = q.d.split(/(?=M )/).map(t => t.trim());
    if (sub.length !== 3) throw new Error(`region fix: ${id} has ${sub.length} blocks, expected 3`);
    const sideOf = t => Math.abs(+t.match(/M ([\d.]+)/)[1] - 15.845);        // distance of the block's start from the midline
    const order = sub.map((t, k) => [sideOf(t), k]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
    const central = order.slice(0, 2).map(k => sub[k]), lateral = sub[order[2]];
    const sd = id.endsWith('left') ? 'left' : 'right';
    FRONT_PARTS.splice(i, 1, { id: `abs-upper-central-${sd}`, muscle: 'abs', d: central.join(' ') }, { id: `obliques-side-${sd}`, muscle: 'obliques', d: lateral });
  }
  return true;
}
