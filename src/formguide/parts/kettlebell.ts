// FG-5: the kettlebell, competition size (every load the same size: 280 mm tall, 210 mm bell, 35 mm handle; D-FG5), so
// only the label changes with the load. Frame: the middle of the handle's top bar, where the hand grips. Front and side
// views draw the same outline (the bell is round and the handle's width reads the same either way at phone size).
import { arc, body, edge, mm, n2, wrap, INK, SH, type Part } from './kit';

export type KettlebellOptions = { g: string; kg?: number; view?: 'front' | 'side' };
export function kettlebell(o: KettlebellOptions): Part {
  const r = mm(105), cy = mm(280) - r, hw = mm(62), hd = mm(35);
  const arch = `M${-hw} ${n2(cy - r * 0.55)}C${-hw} ${mm(30)} ${n2(-hw * 0.9)} 0 0 0C${n2(hw * 0.9)} 0 ${hw} ${mm(30)} ${hw} ${n2(cy - r * 0.55)}`;
  // The bell with a flat base 60 % of its width.
  const a = (Math.atan2(0.8, 0.6) * 180) / Math.PI, bell = arc(0, n2(cy), r, 180 - a, 360 + a) + 'Z';   // from the base's left end round the top
  const svg = `<path d="${arch}" fill="none" stroke="${INK}" stroke-width="${n2(hd + 3)}" stroke-linecap="round"/>`
    + `<path d="${arch}" fill="none" stroke="${SH}" stroke-width="${hd}" stroke-linecap="round"/>`
    + body(bell, o.g, 2)
    + edge(arc(0, n2(cy), n2(r * 0.86), 200, 255), 2)
    + (o.kg != null ? `<text x="0" y="${n2(cy + 4)}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="11" fill="${INK}" opacity=".75">${o.kg}</text>` : '');
  return { id: 'kettlebell', view: o.view ?? 'front', svg: wrap('kettlebell', svg), anchors: { hand_l: [0, 0], hand_r: [0, 0] } };
}
