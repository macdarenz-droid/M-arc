// FG-5: the dumbbell, moved out of the front figure (FG-1 ported it from the Lateral Raise Lab's ARM) and generalised:
// the heads grow with the load (hex r ∝ ∛kg, 7 kg = the lab's r 20, clamped 0.75..1.6 of it), and it draws end-on (the
// lab's view: the handle points at you, far head behind the fist, near head in front) or across (the handle across the
// picture). figureFront.ts nests `dumbbellFar` in the forearm and `dumbbellNear` in the wrist, as the lab does; at 7 kg
// or no load the markup is byte for byte the lab's (tests/formguide/parts.test.ts).
import { body, edge, hexPts, n2, rrect, wrap, type Part, INK, SH } from './kit';

const LAB_KG = 7;
/** Head scale for a load: 1 at the lab's 7 kg (and when the load is unknown). */
export const headScale = (kg?: number) => (kg == null || !(kg > 0) ? 1 : Math.min(1.6, Math.max(0.75, Math.cbrt(kg / LAB_KG))));

/** The far head and the handle (drawn behind the forearm), about the grip. `g` is the iron gradient id. */
export function dumbbellFar(g: string, kg?: number): string {
  const k = headScale(kg), s = (v: number) => n2(v * k);
  return `<polygon points="${hexPts(s(-7), s(-9), s(16))}" fill="url(#${g})" stroke="${INK}" stroke-width="1.8"/><path d="M${s(-5)} ${s(-5)} L${s(6)} ${s(7)}" stroke="${SH}" stroke-width="8" stroke-linecap="round"/>`;
}

/** The near head (drawn in front of the fist) with the load label when kg is given. */
export function dumbbellNear(g: string, kg?: number): string {
  const k = headScale(kg), s = (v: number) => n2(v * k), x = s(7), y = s(9);
  const label = kg != null ? `
        <text x="${x}" y="${y}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="10" fill="${INK}" opacity=".75">${kg}</text>
        <text x="${x}" y="${n2(y + 8)}" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="5" fill="${INK}" opacity=".65">KG</text>` : '';
  return `
        <polygon points="${hexPts(x, y, s(20))}" fill="url(#${g})" stroke="${INK}" stroke-width="2"/>
        <polygon points="${hexPts(x, y, s(14))}" fill="none" stroke="${SH}" stroke-width="1.4"/>${label}`;
}

export type DumbbellOptions = { g: string; kg?: number; axis?: 'end' | 'across'; view?: 'front' | 'side' };
/** A dumbbell on its own, about the grip; hand_l and hand_r are both the grip (one hand holds it). */
export function dumbbell(o: DumbbellOptions): Part {
  const k = headScale(o.kg), axis = o.axis ?? 'end';
  let inner: string;
  if (axis === 'end') inner = dumbbellFar(o.g, o.kg) + dumbbellNear(o.g, o.kg);
  else {
    // Across: the lab's head (hex r 20, flats 34.6 across) seen side-on, 18 deep, beyond a 60-unit handle.
    const h = n2(34.6 * k), d = n2(18 * k), x = 30;
    inner = `<path d="M${-x} -3.5h${2 * x}v7h${-2 * x}Z" fill="${SH}" stroke="${INK}" stroke-width="1.4"/>`
      + body(rrect(-x - d, -h / 2, d, h, 3) + rrect(x, -h / 2, d, h, 3), o.g, 2)
      + edge(`M${n2(-x - d + 3)} ${n2(-h / 2 + 2)}h${n2(d - 6)}M${n2(x + 3)} ${n2(-h / 2 + 2)}h${n2(d - 6)}`)
      // The load on the near (right) head, as on the end-on head: ink on iron reads in every theme.
      + (o.kg != null ? `<text x="${n2(x + d / 2)}" y="1" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="800" font-size="9" fill="${INK}" opacity=".75">${o.kg}</text><text x="${n2(x + d / 2)}" y="8" text-anchor="middle" font-family="Inter,system-ui,sans-serif" font-weight="700" font-size="5" fill="${INK}" opacity=".65">KG</text>` : '');
  }
  return { id: 'dumbbell', view: o.view ?? 'front', svg: wrap('dumbbell', inner), anchors: { hand_l: [0, 0], hand_r: [0, 0] } };
}
