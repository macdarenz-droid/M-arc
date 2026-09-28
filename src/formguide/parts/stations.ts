// FG-5: the fixed parts the body meets: bench (flat, incline and decline as one part with an angle), rack (a squat
// stand), box and pull-up bar. Frame: y = 0 on the floor, x = 0 at the part's working point. Their anchors are pads for
// `bodyOnPad` (through kit.ts `asDrawing`). Sizes (D-FG5): the bench is IPF's (pad top 42-45 cm, drawn 44; pad 29-32 cm
// wide, drawn 30; at least 1.22 m long); the box is a 20 x 24 x 30 in plyo box; rack, pull-up bar and the bench's
// angle range are drawing rules.
import { body, disc, edge, flat, mm, n2, rect, rrect, wrap, INK, IRON, RIG_MM, SH, type Anchors, type Part, type Pt } from './kit';

const D = Math.PI / 180;
/** A tube frame: an ink outline under an iron core (two paths for any number of segments). */
const tube = (d: string, w: number) => `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${n2(w + 3)}" stroke-linecap="square" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="${IRON}" stroke-width="${n2(w)}" stroke-linecap="square" stroke-linejoin="round"/>`;

export const BENCH_ANGLE: [number, number] = [-20, 90];
export type BenchOptions = { g: string; view?: 'front' | 'side'; /** degrees: 0 flat, + incline (head end up), - decline */ angle?: number };
/** Bench. Side view: the head end to the left of the hinge (x = 0), the seat to the right. Anchors: back (the upper
 * back on the back pad, 450 mm up it from the hinge) and hip (on the seat, 100 mm from the hinge). */
export function bench(o: BenchOptions): Part {
  const top = mm(440), t = mm(60), view = o.view ?? 'side';
  if (view === 'front') {
    const w = mm(300), svg = flat(rrect(-w / 2, -top, w, t, 6), SH, 1.8) + edge(`M${n2(-w / 2 + 6)} ${n2(-top + 1.5)}H${n2(w / 2 - 6)}`)
      + tube(`M0 ${n2(-top + t)}V${-mm(30)}M${-mm(250)} ${-mm(15)}H${mm(250)}`, mm(50));
    return { id: 'bench', view, svg: wrap('bench', svg), anchors: { back: [0, -top], hip: [0, -top] } };
  }
  const a = Math.min(BENCH_ANGLE[1], Math.max(BENCH_ANGLE[0], o.angle ?? 0)), c = Math.cos(a * D), s = Math.sin(a * D);
  const L = mm(900), seat = mm(350), H: Pt = [0, -top];
  const on = (d: number, below = 0): Pt => [n2(H[0] - d * c - below * s), n2(H[1] - d * s + below * c)];   // along the back pad from the hinge
  const legY = -top + t, strut = on(L * 0.55, t);
  const svg = tube(`M${-mm(700)} ${-mm(20)}H${mm(330)}M${mm(280)} ${-mm(20)}V${n2(legY)}M${-mm(60)} ${n2(legY)}H${mm(330)}M${-mm(40)} ${-mm(20)}L${strut[0]} ${strut[1]}`, mm(50))
    + flat(rect(-mm(720), -mm(35), mm(120), mm(35)) + rect(mm(260), -mm(35), mm(120), mm(35)), IRON, 1.4)
    + flat(rrect(0, -top, seat, t, 8), SH, 1.8)
    + `<g transform="translate(0 ${n2(-top)}) rotate(${n2(a)})">${flat(rrect(-L, 0, L, t, 8), SH, 1.8)}${edge(`M${n2(-L + 8)} 1.5H-8`)}</g>`;
  const anchors: Anchors = { back: on(mm(450)), hip: [mm(100), -top] };
  return { id: 'bench', view, svg: wrap('bench', svg, ` data-angle="${a}"`), anchors };
}

export type RackOptions = { g: string; view?: 'front' | 'side'; /** the racked bar's centre above the floor, mm */ hookMm?: number };
/** Squat stand: 2.2 m uprights of 76 mm tube, J-hooks at hookMm. Anchors: shoulder_l/r where the racked bar meets
 * the shoulders at unrack (front: the rig's shoulder joints, ± 198 mm on the bar; side: the bar centre, in front of the upright). */
export function rack(o: RackOptions): Part {
  const up = mm(76), hgt = mm(2200), hook = mm(o.hookMm ?? 1350), view = o.view ?? 'side';
  if (view === 'side') {
    const bar: Pt = [n2(up / 2 + mm(35)), -hook], cup = n2(-hook + mm(25));   // the bar's 25 mm radius on the hook plate
    const svg = flat(rect(-up / 2, -hgt, up, hgt - mm(40)), IRON, 1.6) + flat(rect(-mm(450), -mm(40), mm(900), mm(40)), IRON, 1.4)
      + body(`M${n2(up / 2)} ${cup}h${mm(70)}v${mm(-30)}h${mm(20)}v${mm(75)}h${mm(-90)}Z`, o.g, 1.6)
      + edge(`M${n2(-up / 2 + 1.5)} ${n2(-hgt + 3)}V${-mm(60)}`);
    return { id: 'rack', view, svg: wrap('rack', svg), anchors: { shoulder_l: bar, shoulder_r: bar } };
  }
  const x = mm(600), sh = mm(RIG_MM.shoulders) / 2;
  const svg = flat(rect(-x - up, -hgt, up, hgt - mm(40)) + rect(x, -hgt, up, hgt - mm(40)), IRON, 1.6)
    + flat(rect(-x - up - mm(150), -mm(40), up + mm(300), mm(40)) + rect(x - mm(150), -mm(40), up + mm(300), mm(40)), IRON, 1.4)
    + flat(rect(-x, -hgt, 2 * x, mm(60)), IRON, 1.4)
    + body(rect(-x, n2(-hook + mm(25)), mm(90), mm(40)) + rect(x - mm(90), n2(-hook + mm(25)), mm(90), mm(40)), o.g, 1.6)
    + edge(`M${n2(-x - up + 1.5)} ${n2(-hgt + 3)}V${-mm(60)}M${n2(x + 1.5)} ${n2(-hgt + 3)}V${-mm(60)}`);
  return { id: 'rack', view, svg: wrap('rack', svg), anchors: { shoulder_l: [-sh, -hook], shoulder_r: [sh, -hook] } };
}

export type BoxOptions = { g: string; view?: 'front' | 'side'; heightMm?: number; /** foot to foot, mm (front view) */ stanceMm?: number };
/** Plyo box, 20 x 24 x 30 in, standing on its 24 x 30 side (default 20 in = 508 mm tall). Anchors: feet on the top
 * (front: the rig's standing stance, 185 mm apart, or stanceMm; side: the middle) and hip (box squat, the middle of the top). */
export function box(o: BoxOptions): Part {
  const view = o.view ?? 'side', h = mm(o.heightMm ?? 508), w = mm(view === 'front' ? 762 : 610), lip = mm(30);
  const svg = body(rect(-w / 2, -h, w, h), o.g, 2) + flat(rect(-w / 2, -h, w, lip), IRON, 1.4)
    + `<path d="${rrect(-mm(80), n2(-h + mm(90)), mm(160), mm(45), 8)}" fill="${SH}" stroke="${INK}" stroke-width="1.4"/>`
    + edge(`M${n2(-w / 2 + 3)} ${n2(-h + 1.5)}H${n2(w / 2 - 3)}`);
  const f = view === 'front' ? mm(o.stanceMm ?? RIG_MM.stance) / 2 : 0;
  return { id: 'box', view, svg: wrap('box', svg), anchors: { foot_l: [-f, -h], foot_r: [f, -h], hip: [0, -h] } };
}

export type PullUpOptions = { g: string; view?: 'front' | 'side'; /** bar centre above the floor, mm */ barMm?: number; gripMm?: number };
/** Pull-up bar on a free-standing frame: a 32 mm bar 1.2 m wide. Anchors: hands on the bar (front: ± grip / 2,
 * default 500 mm; side: the bar centre). */
export function pullUpBar(o: PullUpOptions): Part {
  const view = o.view ?? 'front', y = -mm(o.barMm ?? 2300), r = mm(16), post = mm(60);
  if (view === 'side') {
    const svg = flat(rect(-post / 2 - mm(180), n2(y - mm(40)), post, n2(-y + mm(40) - mm(40))), IRON, 1.6) + flat(rect(-mm(500), -mm(40), mm(800), mm(40)), IRON, 1.4)
      + flat(rect(-mm(180), n2(y - r), mm(180), 2 * r), IRON, 1.4)
      + body(disc(0, y, r), o.g, 1.6)
      + edge(`M${n2(-post / 2 - mm(180) + 1.5)} ${n2(y - mm(30))}V${-mm(60)}`);
    return { id: 'pull_up_bar', view, svg: wrap('pull_up_bar', svg), anchors: { hand_l: [0, y], hand_r: [0, y] } };
  }
  const x = mm(600), g = mm(o.gripMm ?? 500) / 2;
  const svg = flat(rect(-x - post, n2(y - mm(80)), post, n2(-y + mm(80) - mm(40))) + rect(x, n2(y - mm(80)), post, n2(-y + mm(80) - mm(40))), IRON, 1.6)
    + flat(rect(-x - post - mm(200), -mm(40), post + mm(400), mm(40)) + rect(x - mm(200), -mm(40), post + mm(400), mm(40)), IRON, 1.4)
    + body(rect(-x, n2(y - r), 2 * x, 2 * r), o.g, 1.6)
    + edge(`M${n2(-x + 3)} ${n2(y - r + 1.2)}H${n2(x - 3)}`, 1.2);
  return { id: 'pull_up_bar', view, svg: wrap('pull_up_bar', svg), anchors: { hand_l: [-g, y], hand_r: [g, y] } };
}
