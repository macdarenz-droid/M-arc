// LIB-6 close-up options for the 'zbox' shell (closeup/zbox.mjs): what each golden-B exercises/*.howto-render.mjs script
// did differently, as named data. Guide names on the left are the howto data's callout `guide` values; `kind` is the
// GUIDES registry entry (zbox-geometry.mjs) that draws it. Values are golden B's constants.
const BODY = { bodyHeight: 1.75 };
// squat: the bony bump at the base of the neck (C7) from the neck pivot, m up / toward the back; its level line and label
const C7 = { up: 0.012, back: 0.052, lineLen: 34, fontSize: 4.9, label: 'Bony bump' };

export const ZBOX_OPTIONS = {
  machine_chest_press: {
    shell: 'zbox', ...BODY,
    camera: { kind: 'fixed', pxPerM: 146.29, x0: 150, y0: 339 },
    still: { kind: 'seat-drop', dropFn: 'startArmPhantom' },
    guides: {
      'handle-to-chest': { kind: 'handle-to-chest', from: 'start' },
      'pad-contact': { kind: 'seat-pad-contact', half: 0.07 },
      'pad-gap': { kind: 'seat-pad-gap', capHalfPx: 3.5 },
    },
    hand: { mergeParts: ['wrist', 'fingers'], steps: [['bend-label', { dx: 6, dy: 30 }]] },
    handLines: ['hand-note', 'handle-choice'],
    css: { marks: ['gap-fill', 'dot', 'target', 'tick', 'leader', 'anchor', 'sheet-comment'], handLine: ['inset'], caps: ['sore'] },
  },
  barbell_back_squat: {
    shell: 'zbox', ...BODY,
    camera: { kind: 'spec-origin', pxPerM: 146.29 },
    still: { kind: 'barbell', plates: [0.045], sleeveR: 0.025 },
    guides: {
      'bar-shelf': { kind: 'bar-ring', sleeveR: 0.025, c7: C7 },
      'bar-bone': { kind: 'bar-ring', pressure: true, sleeveR: 0.025, c7: C7 },
      'knee-line': { kind: 'knee-line', kneeR: 0.05, creaseM: 0.06 },
    },
    hand: { mergeParts: ['wrist', 'fingers'], steps: [['load-guide'], ['option-inset', { size: 400, uid: 'hi',
      alt: 'Bar in the heel of the palm, thumb resting over the bar beside the index finger, wrist straight.' }]] },
    css: { marks: ['ref', 'dot'], hand: ['opt', 'opt-fig', 'opt-hidden-edge', 'thin', 'bony-bump', 'opt-txt'], optFigWidth: 112, feel: ['textonly'] },
  },
  leg_press: {
    shell: 'zbox', ...BODY,
    camera: { kind: 'fitted' },
    still: { kind: 'sled' },
    guides: {
      'pad-contact': { kind: 'recline-pad-contact', offPx: 2.5 },
      'pad-gap': { kind: 'recline-pad-gap', padRunM: -0.06 },
      'sole-line': { kind: 'sole-line', offPx: 2.5 },
      'heel-gap': { kind: 'heel-gap', tickPx: 3 },
    },
    hand: { mergeParts: ['wrist', 'fingers', 'handle', 'load'], loadAxis: 'along-forearm', steps: [['hold-only'], ['knee-surface',
      { clipTop: 66, labelDrop: 18, label: 'KNEE', bendDx: 5, bendBelowKneeTop: 24, leverDx: 5, leverLift: 10 }]] },
    css: { crop: ['wide', 'gap-shade', 'knee', 'value-halo', 'right-thumb-ink'], marks: ['ref', 'dot'], hand: ['opt', 'opt-fig', 'opt-txt'], optFigWidth: 96, feel: ['textonly'] },
  },
};
