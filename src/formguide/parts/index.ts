// FG-5: the free-weight parts library (docs/FORM-GUIDE-PRODUCTION.md §4). One entry per part; each draws in the front
// and the side view. `PART_BUDGET_MARKUP` is what the §5 checks read (check/view.ts PARTS): per part, its biggest
// drawing over both views and every load the budget allows, so pathBudget and themes see the worst case.
import type { PartId } from '../model';
import type { TokenReader } from '../rig/paint';
import { ironGrad, shapeCount, type Part } from './kit';
import { dumbbell } from './dumbbell';
import { barbell, ezBar } from './barbell';
import { kettlebell } from './kettlebell';
import { loosePlate } from './plates';
import { bench, box, pullUpBar, rack } from './stations';
import { wide_bar } from './handles/wide_bar';
import { v_handle } from './handles/v_handle';
import { d_handle } from './handles/d_handle';

export { asDrawing, place, shapeCount, PART_SHAPES, type Anchors, type Part } from './kit';
export { dumbbell, dumbbellFar, dumbbellNear, headScale } from './dumbbell';
export { barbell, ezBar, restHeight } from './barbell';
export { kettlebell } from './kettlebell';
export { loadBar, loosePlate, plateSize, MAX_DRAWN, type BarProfile, type Loaded } from './plates';
export { bench, box, pullUpBar, rack, BENCH_ANGLE } from './stations';

/** The gradient id the parts fill with when drawn on their own; `partDefs` defines it. */
export const PART_GRAD = 'fgp-i';
export const partDefs = (read: TokenReader, id = PART_GRAD) => `<defs>${ironGrad(read, id)}</defs>`;

export const FREE_WEIGHT_PARTS = ['dumbbell', 'barbell', 'ez_bar', 'kettlebell', 'bench', 'rack', 'box', 'plate', 'pull_up_bar'] as const satisfies readonly PartId[];
export type FreeWeightPart = (typeof FREE_WEIGHT_PARTS)[number];

const g = PART_GRAD, views = ['front', 'side'] as const;
/** Every drawing a part can make that the budget has to cover: both views, the heaviest loads, every angle end. */
export const VARIANTS: Record<FreeWeightPart, () => Part[]> = {
  dumbbell: () => [dumbbell({ g, kg: 7 }), dumbbell({ g, kg: 60 }), dumbbell({ g, kg: 60, axis: 'across', view: 'side' })],
  barbell: () => views.flatMap(view => [barbell({ g, kg: 20, view }), barbell({ g, kg: 500, view }), barbell({ g, kg: 1000, view, profile: { unit: 'lb' } }), barbell({ g, kg: 120, view, profile: { unit: 'kg', plates: [2.5] } })]),
  ez_bar: () => views.flatMap(view => [ezBar({ g, kg: 10, view }), ezBar({ g, kg: 300, view }), ezBar({ g, kg: 300, view, grip: 'wide' })]),
  kettlebell: () => views.map(view => kettlebell({ g, kg: 48, view })),
  bench: () => [bench({ g, view: 'front' }), ...[-20, 0, 45, 90].map(angle => bench({ g, angle }))],
  rack: () => views.map(view => rack({ g, view })),
  box: () => views.map(view => box({ g, view })),
  plate: () => views.flatMap(view => [loosePlate({ g, value: 25, unit: 'kg', view }), loosePlate({ g, value: 45, unit: 'lb', view })]),
  pull_up_bar: () => views.map(view => pullUpBar({ g, view })),
};

/** Per part, its drawing with the most shapes (the §3 budget's worst case). */
export const PART_BUDGET_MARKUP: Record<FreeWeightPart, string> = Object.fromEntries(FREE_WEIGHT_PARTS.map(id => [
  id, VARIANTS[id]().map(p => p.svg).reduce((a, b) => (shapeCount(b) > shapeCount(a) ? b : a)),
])) as Record<FreeWeightPart, string>;

// V1-09: the cable handles, one slot file each (parts/handles/), filled by the card that draws it.
export const HANDLE_CARDS = { wide_bar: 'V1-17', v_handle: 'V1-15', d_handle: 'V1-15' } as const satisfies Partial<Record<PartId, string>>;
export const HANDLES = { wide_bar, v_handle, d_handle } satisfies Record<keyof typeof HANDLE_CARDS, unknown>;
