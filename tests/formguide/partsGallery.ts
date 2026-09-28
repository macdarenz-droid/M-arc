// FG-5: a page of every free-weight part for the screenshot gate (scripts/screenshot-gate.mjs, block FG-5): one card per
// drawing, framed to its own box, painted from one theme's tokens; plus the front figure with the library dumbbell and
// with a barbell at its hands. Test and gate only; nothing here ships.
import { THEMES, themeToCss, type ThemeId } from '@/theme/themes';
import { figureFront, FIST, ELB, SH_L, SH_R } from '@/formguide/rig/figureFront';
import { themeReader } from '@/formguide/rig/paint';
import { bbox, compile } from '@/formguide/check/svg';
import { UNITS_PER_M } from '@/formguide/parts/kit';
import { PART_GRAD, barbell, bench, box, dumbbell, ezBar, kettlebell, loosePlate, partDefs, place, pullUpBar, rack, type Part } from '@/formguide/parts';

const g = PART_GRAD;
export const GALLERY: [string, () => Part][] = [
  ['dumbbell 7 kg, end-on', () => dumbbell({ g, kg: 7 })],
  ['dumbbell 20 kg, across', () => dumbbell({ g, kg: 20, axis: 'across', view: 'side' })],
  ['barbell 100 kg, front', () => barbell({ g, kg: 100 })],
  ['barbell 100 kg, side', () => barbell({ g, kg: 100, view: 'side' })],
  ['barbell 62.5 kg, side', () => barbell({ g, kg: 62.5, view: 'side' })],
  ['barbell 225 lb, front', () => barbell({ g, kg: 225 * 0.45359237, profile: { unit: 'lb' } })],
  ['EZ bar 30 kg, front', () => ezBar({ g, kg: 30 })],
  ['kettlebell 24 kg', () => kettlebell({ g, kg: 24 })],
  ['bench flat, side', () => bench({ g })],
  ['bench 30° incline, side', () => bench({ g, angle: 30 })],
  ['bench 15° decline, side', () => bench({ g, angle: -15 })],
  ['bench, front', () => bench({ g, view: 'front' })],
  ['rack, side', () => rack({ g })],
  ['rack, front', () => rack({ g, view: 'front' })],
  ['box 20 in, side', () => box({ g })],
  ['box, front', () => box({ g, view: 'front' })],
  ['plate 20 kg, front', () => loosePlate({ g, value: 20, unit: 'kg' })],
  ['plate 20 kg, side', () => loosePlate({ g, value: 20, unit: 'kg', view: 'side' })],
  ['pull-up bar, front', () => pullUpBar({ g })],
  ['pull-up bar, side', () => pullUpBar({ g, view: 'side' })],
];

const PAD = 8;
const frame = (svg: string) => { const b = bbox(compile(svg), {}); return [b.x0 - PAD, b.y0 - PAD, b.x1 - b.x0 + 2 * PAD, b.y1 - b.y0 + 2 * PAD].map(v => +v.toFixed(1)).join(' '); };
const card = (name: string, inner: string, defs: string) =>
  `<figure class="card" data-part="${name}"><svg viewBox="${frame(inner)}" role="img" aria-label="${name}">${defs}${inner}</svg><figcaption>${name}</figcaption></figure>`;

/** The rest figure's hands (no joint turned): shoulder, elbow and wrist offsets of FRONT_RIG. */
const HAND_R: [number, number] = [SH_R[0] + ELB[0] + FIST[0], SH_R[1] + ELB[1] + FIST[1]];
const HAND_L: [number, number] = [SH_L[0] - ELB[0] - FIST[0], SH_L[1] + ELB[1] + FIST[1]];

export function galleryHtml(theme: ThemeId): string {
  const read = themeReader(theme), defs = partDefs(read);
  const parts = GALLERY.map(([name, make]) => card(name, make().svg, defs));
  const fig = (o: Parameters<typeof figureFront>[1], extra = '') => figureFront(read, o) + extra;
  const grip = ((HAND_R[0] - HAND_L[0]) * 1000) / UNITS_PER_M;
  const bar = place(barbell({ g: 'fgb-i', kg: 60, gripMm: grip }), [(HAND_R[0] + HAND_L[0]) / 2, HAND_R[1]]);
  const figures = [
    card('lateral raise figure, library dumbbell 7 kg', fig({ id: 'fga', dumbbell: { kg: 7 } }), ''),
    card('figure holding a 60 kg barbell at its hand anchors', fig({ id: 'fgb' }, bar.svg), ''),
  ];
  return `<!doctype html><html data-theme="${theme}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${themeToCss(THEMES[theme])}body{margin:0;padding:16px;background:var(--bg);color:var(--text);font:13px Inter,system-ui,sans-serif}
.grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.card{margin:0;padding:8px;border:1px solid var(--border);border-radius:10px;background:var(--surface-1)}
.card svg{display:block;width:100%;height:140px}.wide{grid-column:1/-1}.wide svg{height:360px}figcaption{margin-top:4px;color:var(--text-2);font-size:11px}</style></head>
<body><h1 style="font-size:16px;margin:0 0 10px">FG-5 parts, ${theme}</h1><div class="grid">${parts.join('')}${figures.map(f => f.replace('class="card"', 'class="card wide"')).join('')}</div></body></html>`;
}
