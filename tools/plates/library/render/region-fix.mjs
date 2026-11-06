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

// F-BODYMAP-FRONTDELT (D-BODYMAP-LIB, #404 6682755661): golden B's body map draws front_delts on the strip between
// the neck and the shoulder cap, where it reads as the upper traps, and has no inner-elbow part. Library layers pages
// redraw both front_delts parts on the front of the shoulder cap (between side_delts and upper_chest, above the
// biceps) and add an inner-elbow pain part on each arm. Golden B's own page keeps the vendored map (byte-locked); the
// owner's golden-B update F-GOLDENB-FRONTDELT would move it. Right = left mirrored about x = 15.83629 (the map's axis).
export const BODYMAP_FIX = {
  replace: {
    'shoulder-front-left': { muscle: 'front_delts', d: 'M 20.300,15.300 L 22.500,15.480 L 20.959,16.531 L 22.712,19.750 L 22.000,19.750 L 20.392,16.876 L 20.000,16.400 Z' },
    'shoulder-front-right': { muscle: 'front_delts', d: 'M 11.373,15.300 L 9.173,15.480 L 10.714,16.531 L 8.961,19.750 L 9.673,19.750 L 11.281,16.876 L 11.673,16.400 Z' },
  },
  add: [
    { id: 'elbow-inner-left', muscle: null, d: 'M 25.311,29.900 L 27.206,32.550 L 26.877,32.550 L 25.087,29.900 Z' },
    { id: 'elbow-inner-right', muscle: null, d: 'M 6.362,29.900 L 4.467,32.550 L 4.796,32.550 L 6.586,29.900 Z' },
  ],
};

export const bodymapFixApplied = FRONT_PARTS => FRONT_PARTS.some(x => x.id === BODYMAP_FIX.add[0].id);

/** Applies BODYMAP_FIX once (idempotent: false when already applied); throws on a missing part or the wrong muscle. */
export function applyBodymapFix(FRONT_PARTS) {
  if (bodymapFixApplied(FRONT_PARTS)) return false;
  for (const [id, { muscle }] of Object.entries(BODYMAP_FIX.replace)) {
    const q = FRONT_PARTS.find(x => x.id === id);
    if (!q || q.muscle !== muscle) throw new Error(`bodymap fix: ${id} not ${muscle}`);
  }
  for (const { id } of BODYMAP_FIX.add) if (FRONT_PARTS.some(x => x.id === id)) throw new Error(`bodymap fix: ${id} already exists`);
  for (const [id, { d }] of Object.entries(BODYMAP_FIX.replace)) FRONT_PARTS.find(x => x.id === id).d = d;
  for (const p of BODYMAP_FIX.add) FRONT_PARTS.push({ ...p });
  return true;
}
