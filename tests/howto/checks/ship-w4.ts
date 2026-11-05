// LIB-SHIP W4 (SHIP W4 PLAN RULED, #391 6647760116): the ids the W4 flip ships, per batch file, in each file's row order.
// The one list every W4 guard reads: an id the panel holds is dropped here, and nowhere else.
export const W4_SHIPPED: Record<string, readonly string[]> = {
  'tools/plates/library/batches/lb02.json': ['lib_barbell_bench_press', 'lib_incline_barbell_bench_press', 'lib_incline_dumbbell_press',
    'lib_close_grip_bench_press', 'lib_decline_bench_press', 'lib_dumbbell_pullover'],
  'tools/plates/library/batches/lb03.json': ['lib_pendlay_row', 'lib_landmine_row', 'lib_one_arm_dumbbell_row', 'lib_back_extension',
    'lib_t_bar_row', 'lib_barbell_shrug', 'lib_smith_machine_shrug'],
  'tools/plates/library/batches/pilot-b.json': ['lib_smith_machine_bench_press'],
};
/** Staged in their own later flip commits: the 3 deadlifts after #385 ships romanian_deadlift (Q-W4-1); sumo, cable_shrug
 *  and dumbbell_shrug after research F-W4-INHERIT (D-SHIP-W4-ROUTE). */
export const W4_STAGED = ['lib_conventional_deadlift', 'lib_dumbbell_romanian_deadlift', 'lib_sumo_deadlift', 'lib_cable_shrug', 'lib_dumbbell_shrug'];
/** Held at the W4 layers panel (S3, owner later-update list; ruling E3, #391 6653540190): the safety checker found no
 *  sourced way to end a failed rep alone (LIB-WAYOUT). Off the lb02 layers page; their rows stay at approved-plate. */
export const W4_HELD = ['lib_arnold_press', 'lib_skull_crusher'];
export const W4_IDS: string[] = Object.values(W4_SHIPPED).flat();
export const w4Of = (batchFile: string): string[] => [...(W4_SHIPPED[batchFile] ?? [])];

/** LIB-SHIP W4 (ruling 3): replaces D-LIB9a-HOWTOID's "the How-to source holds only its id and card" once the sheets are
 *  written. The sheet names its own id and card, and is not a stub: every sheet section is present, and the ones no sheet
 *  goes without (handling, setup, posture, sources) are non-empty. mistakes may be [] (back_extension draws none). */
export const SHEET_SECTIONS = ['handling', 'setup', 'posture', 'feel', 'mistakes', 'risks', 'sources'] as const;
const NON_EMPTY = ['handling', 'setup', 'posture', 'sources'];
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const empty = (v: any) => (Array.isArray(v) ? !v.length : typeof v === 'object' && v !== null && !Object.keys(v).length);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sheetProblems = (h: any, id: string): string[] => [
  ...(h?.id === `lib_${id}` ? [] : [`${id}: id ${JSON.stringify(h?.id)}`]),
  ...(h?.research?.card === `docs/research/howto/cards/${id}.json` ? [] : [`${id}: research.card ${JSON.stringify(h?.research?.card)}`]),
  ...SHEET_SECTIONS.filter(k => h?.[k] === undefined || h[k] === null || (NON_EMPTY.includes(k) && empty(h[k]))).map(k => `${id}: no ${k} (a stub)`),
];
