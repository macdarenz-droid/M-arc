// FG-5: the barbell and the EZ bar with plates. Front view: the bar across the picture, plates as slabs on the sleeves.
// Side view: the bar end-on (its axis points at you), plates face-on. The frame's origin is the bar's centre on its axis;
// hands grip the axis. Barbell dimensions are IWF's men's bar (2200 mm, 1310 mm between the inner collars, 415 mm
// sleeves of 50 mm, a 28 mm shaft); the EZ bar's are a drawing rule (D-FG5).
import { body, disc, edge, mm, n2, rect, wrap, INK, RIG_MM, SH, type Anchors, type Part } from './kit';
import { faces, loadBar, slabs, type BarProfile, type Loaded } from './plates';

export type BarOptions = {
  g: string;
  /** Total load on the bar, kg (bar included). 0 or less than the bar: the empty bar. */
  kg: number;
  profile?: BarProfile;
  view?: 'front' | 'side';
  /** Front view: centre-to-centre distance between the hands, mm. */
  gripMm?: number;
};

const IWF = { half: 655, collar: 30, sleeve: 415, sleeveDia: 50, shaftDia: 28, collarDia: 75 } as const;

/** Bar centre height above the floor when the bar rests on its largest drawn plate (units; the sleeve when empty). */
export const restHeight = (l: Loaded) => n2(Math.max(mm(IWF.sleeveDia) / 2, ...l.drawn.map(p => p.dia / 2)));

function endOn(l: Loaded, g: string): string {
  // The sleeve end on the outer plate's face (or alone when empty), with the collar ring behind it.
  const n = l.drawn.length;
  return (n ? '' : body(disc(0, 0, mm(IWF.collarDia) / 2), g, 1.6)) + faces(l, g)
    + `<path d="${disc(0, 0, mm(IWF.sleeveDia) / 2)}" fill="${SH}" stroke="${INK}" stroke-width="1.6"/>`;
}

/** A loaded barbell. Anchors: hands on the axis (front: ± grip / 2; side: the centre), shoulders where it sits on the
 * back (front: the rig's shoulder joints, ± 198 mm; side: the centre). */
export function barbell(o: BarOptions): Part & { load: Loaded } {
  const profile = o.profile ?? { unit: 'kg' }, view = o.view ?? 'front', l = loadBar(o.kg, profile, IWF.sleeve);
  if (view === 'side') return { id: 'barbell', view, load: l, svg: wrap('barbell', endOn(l, o.g)), anchors: { hand_l: [0, 0], hand_r: [0, 0], shoulder_l: [0, 0], shoulder_r: [0, 0] } };
  const h = mm(IWF.half), c = mm(IWF.collar), sl = mm(IWF.sleeve), sd = mm(IWF.sleeveDia), cd = mm(IWF.collarDia), s = mm(IWF.shaftDia);
  const svg = `<path d="${rect(-h, -s / 2, 2 * h, s)}" fill="${SH}" stroke="${INK}" stroke-width="1.4"/>`
    + body(rect(-h - c - sl, -sd / 2, sl, sd) + rect(h + c, -sd / 2, sl, sd), o.g, 1.4)
    + body(rect(-h - c, -cd / 2, c, cd) + rect(h, -cd / 2, c, cd), o.g, 1.6)
    + slabs(l, -h - c, -1, o.g, 'l') + slabs(l, h + c, 1, o.g, 'r')
    + edge(`M${n2(-h + 4)} ${n2(-s / 2 + 1.2)}H${n2(h - 4)}`, 1.4);
  const grip = mm(o.gripMm ?? 450) / 2, sh = mm(RIG_MM.shoulders) / 2;
  const anchors: Anchors = { hand_l: [-grip, 0], hand_r: [grip, 0], shoulder_l: [-sh, 0], shoulder_r: [sh, 0] };
  return { id: 'barbell', view, load: l, svg: wrap('barbell', svg), anchors };
}

/** EZ bar (D-FG5 drawing rule): 1200 mm, cambered between ± 190 mm, 275 mm sleeves from ± 325 mm. */
const EZ = { straight: 190, collarAt: 300, collar: 25, sleeve: 275, bar: 10 } as const;
/** The camber, mm, from the left collar to the right: [x, y]. */
const CAMBER: [number, number][] = [[-300, 0], [-190, 0], [-150, 22], [-105, -18], [-60, 0], [60, 0], [105, -18], [150, 22], [190, 0], [300, 0]];
export type EzOptions = Omit<BarOptions, 'gripMm'> & { grip?: 'close' | 'wide' };
/** A loaded EZ bar. Hands on the camber's angled grips (close: the inner pair, wide: the outer pair). */
export function ezBar(o: EzOptions): Part & { load: Loaded } {
  const p = o.profile ?? { unit: 'kg' as const }, profile = { ...p, barKg: p.barKg ?? EZ.bar }, view = o.view ?? 'front';
  const l = loadBar(o.kg, profile, EZ.sleeve);
  if (view === 'side') return { id: 'ez_bar', view, load: l, svg: wrap('ez_bar', endOn(l, o.g)), anchors: { hand_l: [0, 0], hand_r: [0, 0] } };
  const d = CAMBER.map(([x, y], i) => `${i ? 'L' : 'M'}${mm(x)} ${mm(y)}`).join('');
  const c0 = mm(EZ.collarAt), c = mm(EZ.collar), sl = mm(EZ.sleeve), sd = mm(50), cd = mm(70);
  const svg = `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${n2(mm(28) + 3)}" stroke-linejoin="round"/>`
    + `<path d="${d}" fill="none" stroke="${SH}" stroke-width="${n2(mm(28))}" stroke-linejoin="round"/>`
    + body(rect(-c0 - c - sl, -sd / 2, sl, sd) + rect(c0 + c, -sd / 2, sl, sd), o.g, 1.4)
    + body(rect(-c0 - c, -cd / 2, c, cd) + rect(c0, -cd / 2, c, cd), o.g, 1.6)
    + slabs(l, -c0 - c, -1, o.g, 'l') + slabs(l, c0 + c, 1, o.g, 'r')
    + edge(`M${mm(-60)} ${n2(-mm(14) + 1)}H${mm(60)}`, 1.2);
  const mid = (a: [number, number], b: [number, number]): [number, number] => [mm((a[0] + b[0]) / 2), mm((a[1] + b[1]) / 2)];
  const [i, j] = o.grip === 'wide' ? [1, 2] : [3, 4];
  const r = mid(CAMBER[CAMBER.length - 1 - i]!, CAMBER[CAMBER.length - 1 - j]!), lft = mid(CAMBER[i]!, CAMBER[j]!);
  return { id: 'ez_bar', view, load: l, svg: wrap('ez_bar', svg), anchors: { hand_l: lft, hand_r: r } };
}
