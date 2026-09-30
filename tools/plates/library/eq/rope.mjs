// Composer `rope` (library plan 2.1): a triceps rope on a cable, any view. A metal ferrule on the cable, two rope
// strands from it to the hands, each ending in a rubber stopper just below the fist (neutral grip, thumbs up).
// Assumed sizes (typical commercial triceps rope; the spec names its source): strands about 28 mm thick, 30 cm from
// the ferrule to the stopper, stoppers about 4 cm across and 3.5 cm long.
// Each strand is one `dumbbell` primitive laid along the strand (its `eq-solid` handle is the rope, its two `disc`
// heads are the ferrule collar and the stopper), so every moving part carries `poly` (PQ-H9). The cable is a line in
// the correct plate, like the approved cable plates; `mistakeTwin` adds a thin `poly` twin of the cable only in the
// Mistake pose, so a cable that moves in the Mistake is drawn in its outline too.
import { sub, add, mul, norm, sideBar } from './parts.mjs';

/**
 * p.pulley: world centre of the pulley the cable leaves; p.grips: { l, r } world grip centres (lm['grip.l'/'grip.r']);
 * p.strand: ferrule-to-stopper length; p.below: grip centre to stopper centre along the strand.
 */
export function ropeGeometry({ pulley, grips, strand = 0.30, below = 0.055 }) {
  const mid = mul(add(grips.l, grips.r), 0.5), dir = norm(sub(mid, pulley));            // cable line toward the hands
  const half = Math.hypot(...sub(grips.l, grips.r)) / 2;
  const reach = Math.sqrt(Math.max(0.01, (strand - below) ** 2 - half * half));          // ferrule to hand midpoint
  const ferrule = sub(mid, mul(dir, reach));
  return { ferrule, dir, strands: ['l', 'r'].map(s => ({ side: s, from: ferrule, grip: grips[s], dir: norm(sub(grips[s], ferrule)) })) };
}

export function rope({ pulley, grips, strand = 0.30, below = 0.055, d = 0.028, knob = 0.046, knobLen = 0.035, z = 'mid', part = 'rope', mistakeTwin = false, ctx = null }) {
  const g = ropeGeometry({ pulley, grips, strand, below });
  const out = [{ type: 'cable', from: pulley, to: g.ferrule, z: 'center', part }];
  for (const s of g.strands) {
    const end = add(s.grip, mul(s.dir, below)), len = Math.hypot(...sub(end, s.from));
    // dumbbell: handle `len - knobLen` long between the two heads; heads centred knobLen/2 past each handle end
    const handle = Math.max(0.05, len - knobLen);
    out.push({ type: 'dumbbell', at: mul(add(s.from, end), 0.5), axis: s.dir, handle, head: knob, headLen: knobLen, z, part });
  }
  if (mistakeTwin && ctx?.pose === 'mistake') out.push(sideBar(pulley, g.ferrule, 0.004, { z: 'center', part }));
  void d;
  return out;
}
