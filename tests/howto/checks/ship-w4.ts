// LIB-SHIP W4 (D-SHIP-W4-FLIPSET, #391 6682985023): the ids the W4 flip ships, per batch file, in each file's row order.
// The one list every W4 guard reads. Nothing from lb02.json or pilot-b.json ships in W4.
const LB02 = 'tools/plates/library/batches/lb02.json', LB03 = 'tools/plates/library/batches/lb03.json', PILOT_B = 'tools/plates/library/batches/pilot-b.json';
export const W4_SHIPPED: Record<string, readonly string[]> = {
  [LB02]: [],
  [LB03]: ['lib_pendlay_row', 'lib_landmine_row', 'lib_t_bar_row', 'lib_barbell_shrug', 'lib_cable_shrug', 'lib_smith_machine_shrug'],
  [PILOT_B]: [],
};
/** The W4 ids that stay at approved-plate, per batch file in row order, each with its reason (D-SHIP-W4-FLIPSET, #391
 *  6682985023; the LIB-PLATEFIX-3 routes are the focused recheck's, #391 6682615402). They keep their panel records. */
export const W4_WAITING: Record<string, Readonly<Record<string, string>>> = {
  [LB02]: {
    lib_barbell_bench_press: "lb02's ids are held (D-SHIP-W4-FLIPSET)",
    lib_incline_barbell_bench_press: "lb02's ids are held; plate and layers L5, L7 routed to LIB-PLATEFIX-3",
    lib_incline_dumbbell_press: "lb02's ids are held (D-SHIP-W4-FLIPSET)",
    lib_close_grip_bench_press: 'held until barbell_bench_press ships; round 2 judged with the LIB-PLATEFIX-3 recheck',
    lib_decline_bench_press: "lb02's ids are held (D-SHIP-W4-FLIPSET)",
    lib_arnold_press: 'held at the W4 layers panel (ruling E3, #391 6653540190): no sourced way to end a failed rep alone (LIB-WAYOUT)',
    lib_skull_crusher: 'held at the W4 layers panel (ruling E3, #391 6653540190): no sourced way to end a failed rep alone (LIB-WAYOUT)',
    lib_dumbbell_pullover: "lb02's ids are held (D-SHIP-W4-FLIPSET)",
  },
  [LB03]: {
    lib_one_arm_dumbbell_row: 'to LIB-PLATEFIX-3 (round-2 L5)',
    lib_dumbbell_romanian_deadlift: 'held until romanian_deadlift ships (#385)',
    lib_conventional_deadlift: 'staged; round 2 judged with the LIB-PLATEFIX-3 recheck',
    lib_sumo_deadlift: 'staged; L1 routed to LIB-PLATEFIX-3, round 2 judged with its recheck',
    lib_back_extension: 'L5 routed to LIB-PLATEFIX-3 (the Wrong pad moves above the hip)',
    lib_dumbbell_shrug: 'to LIB-PLATEFIX-3 (round-2 L1)',
  },
  [PILOT_B]: {
    lib_smith_machine_bench_press: 'L5 routed to LIB-PLATEFIX-3 (a head-end inset for the elbow flare)',
  },
};
export const W4_IDS: string[] = Object.values(W4_SHIPPED).flat();
export const W4_WAITING_IDS: string[] = Object.values(W4_WAITING).flatMap(w => Object.keys(w));
export const w4Of = (batchFile: string): string[] => [...(W4_SHIPPED[batchFile] ?? [])];
export const waitOf = (batchFile: string): string[] => Object.keys(W4_WAITING[batchFile] ?? {});

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

/** LIB-SHIP W4 (D-SHIP-W4-PIN, D-SHIP-W4-FLIPSET; supervisor approved the W2-form MANIFEST widening, #391): the library
 *  MANIFEST rows W4 adds (every lb02 and lb03 row, pinned under D-SHIP-W4-PIN) and the keys it re-pins in main's rows
 *  (hands/pairs.mjs, from the W4 press sheets' hand pairs; the smith sheet, in pilot B's rows). */
export const W4_MANIFEST_ROWS: string[] = [LB02, LB03].flatMap(f => [...w4Of(f), ...waitOf(f)]).sort();
export const W4_MANIFEST_MOVED = ['tools/plates/library/hands/pairs.mjs', 'tools/plates/library/howto/lib_smith_machine_bench_press.howto.mjs'];
/** The manifest less W4's changes, in place: each W4 row must be present and is removed; each W4-moved key must pin
 *  `shaOf(key)` (its file's current sha) and is blanked to `blank`. Throws on a missing W4 row or a stale W4 key. */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const lessW4 = (m: any, shaOf: (key: string) => string, blank = 'X') => {
  for (const id of W4_MANIFEST_ROWS) { if (!(id in m.rows)) throw new Error(`MANIFEST: W4 row ${id} missing`); delete m.rows[id]; }
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of W4_MANIFEST_MOVED) if (k in r.files) {   // eslint-disable-line @typescript-eslint/no-explicit-any
    if (r.files[k] !== shaOf(k)) throw new Error(`MANIFEST: ${id} ${k} does not pin its current file`);
    r.files[k] = blank;
  }
  return m;
};
