// LIB-7 key `rope` (hands/DESIGN.md §2): one hand on each rope end, up against its knob. Sizes match the plate's rope
// composer (library/eq/rope.mjs:54, thick 0.028 m, knob 0.046 m): a 28 mm strand seen end-on and the 46 mm knob behind
// the fist as a thin ring (golden-B's `h-eq-thin`, as its dumbbell head). Load in the fingers, lever check off (GA 3.1.1); no source gives the load's
// direction, so no force line is drawn.
import { RULES_FILE } from './radial-rules.mjs';

export const KEY = 'rope', OWNER = 'LIB-7', VIEW = 'radial', INPUTS = [RULES_FILE, 'tools/plates/library/eq/rope.mjs'];
export const HANDLE = { profile: 'rope', diameterMm: 28, ringMm: 46 };
export const VARIANTS = {
  push: {
    archetype: 'push', loadAxis: 'across', loadLine: false, panelHeight: 170, wristRange: [0, 15], contact: 'base',
    right: { view: 'radial', forearm: 90, wrist: { ext: 0, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
    rightNote: 'Against the knob',
    alt: 'Hand up against the knob at the end of the rope, thumb wrapped round it, wrist straight in line with the forearm.',
    claims: { knob: ['shared/rope-rule.json#c1'], thumb: ['shared/rope-rule.json#c2'], wrist: ['shared/rope-rule.json#c4'], contact: ['ga:rope-fingers'] },
    faults: {
      curled: { label: 'Wrists curl', side: 'flexed', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], claims: ['shared/rope-rule.json#c6'],
        alt: 'Wrist bent toward the palm as the rope is pushed down.' },
    },
  },
};
export const IDS = {
  // neutral grip for the pushdown is an inference the research card flags (rope-rule c3)
  rope_triceps_pushdown: { variant: 'push', orientation: 'neutral', faults: ['curled'], claims: ['shared/rope-rule.json#c3'] },
};
export const GAPS = {
  overhead_cable_triceps_extension: 'rope-rule gap 3: the pushdown rules need a source before an overhead sheet uses them; the card\'s Wrong is an elbow fault',
  face_pull: 'no research card',
  cable_crunch: 'no research card',
};
