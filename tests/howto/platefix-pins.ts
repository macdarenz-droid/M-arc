// LIB-PLATEFIX-1 (#385, D-PLATEFIX-PINS / PIN GO; [golden update]): the keys and approving entries its re-pin of
// tools/plates/library/MANIFEST.json moves, for the MANIFEST blanked-keys tests (crop-projection, lib-shapes, pair-faults;
// the LIB-SHIP W2 lessW2 form). Each moved key must pin its file's current sha256, each added key must be present and
// pin its file, and each moved row's `entry` must be the hash of its latest plate entry in its batch golden file
// (ci/manifest.mjs pinnedRows); then they are blanked, so the rest still equals main 05f27be9's with the same blanks.
// The keys W2 already moves (the five sheets, batches/pilot-a.json, pilot-a's closeups and layers config) stay in each
// test's W2_MOVED.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const read = (p: string) => readFileSync(new URL(p, ROOT));
const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
const M: any = await import(/* @vite-ignore */ new URL('tools/plates/library/ci/manifest.mjs', ROOT).href);

// howto-layers.mjs is back at its golden-B pin (64f13395, D-PF-PAINNAMES-LIB), so its key does not move and is not
// blanked. build-layers-page.mjs does move (painNamesPatch, D-PF-PAINNAMES-LIB #385 6657422689); its key is in each
// test's W2_MOVED / MOVED list, which checks it pins the current file before blanking it, so it is not repeated here (a
// key in both lists would be blanked before that check).
export const PF_MOVED = ['tools/plates/library/batches/pilot-a3.json',
  ...['barbell_overhead_press', 'barbell_row', 'cable_fly', 'crunch', 'reverse_lunge', 'romanian_deadlift', 'triceps_pushdown'].map(s => `tools/plates/library/specs/${s}.mjs`)];
export const PF_ADDED: Record<string, string[]> = {
  'tools/plates/library/pages/pilot-a3.closeups.mjs': ['lib_dumbbell_fly', 'lib_reverse_lunge'],
  'tools/plates/library/pages/pilot-a3.layers.json': ['lib_dumbbell_fly', 'lib_reverse_lunge'],
};
/** The rows whose approving plate entry the golden update supersedes. */
export const PF_ENTRY = ['lib_barbell_overhead_press', 'lib_barbell_row', 'lib_cable_fly', 'lib_crunch', 'lib_reverse_lunge', 'lib_romanian_deadlift', 'lib_triceps_pushdown'];
const LATEST: Record<string, string> = Object.fromEntries(M.pinnedRows().map((p: any) => [p.row.id, M.entryHash(p.entry)]));

/** Problems with `m`'s PLATEFIX changes (empty when every moved key, added key and moved entry pins its current value). */
export function pfProblems(m: any): string[] {
  const bad: string[] = [];
  for (const id of PF_ENTRY) if (!m.rows[id] || m.rows[id].entry !== LATEST[id]) bad.push(`${id}: entry ${m.rows[id]?.entry} != ${LATEST[id]}`);
  for (const [id, r] of Object.entries<any>(m.rows)) {
    for (const k of PF_MOVED) if (k in r.files && r.files[k] !== sha(read(k))) bad.push(`${id} ${k}: ${r.files[k]} != ${sha(read(k))}`);
    for (const [k, ids] of Object.entries(PF_ADDED)) if (ids.includes(id) && r.files[k] !== sha(read(k))) bad.push(`${id} ${k}: ${r.files[k]} != ${sha(read(k))}`);
  }
  return bad;
}
/** `m` with the PLATEFIX changes blanked (moved keys and entries set to `blank`, added keys removed); no checks. */
export function blankPF(m: any, blank: string): any {
  for (const id of PF_ENTRY) if (m.rows[id]) m.rows[id].entry = blank;
  for (const [id, r] of Object.entries<any>(m.rows)) {
    for (const k of PF_MOVED) if (k in r.files) r.files[k] = blank;
    for (const [k, ids] of Object.entries(PF_ADDED)) if (ids.includes(id)) delete r.files[k];
  }
  return m;
}

/** The approvals of the golden update's superseding batch-golden entries. Page and plate entries are the owner's
 *  (D-OWNER-REPIN, #385 6686720061): each decision starts with PF_ENTRY_DECISION and names its own panel after it, and the
 *  approval is PF_OWNER_APPROVAL exactly. Layers-page entries are the supervisor's under PF_LAYERS_DECISION. The pin guards
 *  in lib8-pin, lib8r-pilot-a3, lib11-pilot-b and lib11-pilot-b2 read them from here. */
export const PF_ENTRY_DECISION = 'D-OWNER-REPIN; LIB-PLATEFIX-1 golden update (plan 2.8); ';
export const PF_OWNER_APPROVAL = 'Owner in chat, 2026-11-06 ~14:10 UTC: "Do all whats recommended. Whan u have question, answer urself via recommended" (D-OWNER-REPIN, #385 6686720061: a standing OK to supersede an approved plate or page pin once a full review panel passes the new version)';
export const PF_LAYERS_DECISION = 'D-PLATEFIX-STAMP';
const ownerOk = (e: any) => e.approvedBy === 'owner' && typeof e.decision === 'string' && e.decision.startsWith(PF_ENTRY_DECISION)
  && e.decision.length > PF_ENTRY_DECISION.length && e.approval === PF_OWNER_APPROVAL;

/** main 05f27be9's entries of each batch golden file the golden update appends to: how many, and the sha256 of their
 *  JSON.stringify. The update only appends, so these stay byte-equal. */
export const MAIN_GOLDEN: Record<string, { n: number; sha: string }> = {
  'pilot-a': { n: 16, sha: '715d3f61c4997a3227aa9136523d83452759d7c65b8b8b7286427e0695415975' },
  'pilot-b': { n: 6, sha: '5ae57c9629fbbd2e78c3f4d1e4cd7a1f23bd602ebb126027da61dad74ea90d27' },
  'pilot-a3': { n: 3, sha: '75a9682eedebb43a3ed046f6d66e6fff6c7932ab803d8d97b1a24eb402f95e6b' },
  'pilot-b2': { n: 3, sha: '0b659af46e873d927980bb2c68ec683780ace4d1056bcf89a18f6f3114fae225' },
};
/** The keys a superseding plate entry may change from the entry it supersedes. */
const PLATE_MOVES = ['fragments', 'approvedBy', 'decision', 'approval', 'date', 'why', 'supersedes', 'prev'];
/** The golden update's tail of batch golden `file` (`batch`: a MAIN_GOLDEN key): main's entries unchanged, then exactly a
 *  page entry superseding `page` that pins `html`, one plate entry per `plates` id (in that order) superseding that id's
 *  entry and equal to its plate in `html` (`fragmentsOf(extractPlates(html))`), the rest of it unchanged, and last one
 *  layers-page entry (supersedes `layers.supersedes`, names exactly `layers.ids`, pins `layers.page`). [problems] */
export function pfTailProblems(file: any, batch: string, o: { G: any; html: string | Buffer; page: number; plates: Record<string, number>; layers: { supersedes: number | null; ids: string[]; page: Buffer } }): string[] {
  const bad: string[] = [], M0 = MAIN_GOLDEN[batch]!, E = file.entries as any[];
  if (sha(JSON.stringify(E.slice(0, M0.n))) !== M0.sha) bad.push(`${batch}: main's ${M0.n} entries changed`);
  const tail = E.slice(M0.n), ids = Object.keys(o.plates);
  const kinds = ['page', ...ids.map(() => 'plate'), 'layers-page'];
  if (JSON.stringify(tail.map(e => e.kind)) !== JSON.stringify(kinds)) return [...bad, `${batch}: tail kinds ${tail.map(e => e.kind)}`];
  const [pg, ...rest] = tail, lp = rest.pop(), html = o.html.toString();
  if (pg.supersedes !== o.page || E[o.page]?.kind !== 'page') bad.push(`${batch}: page supersedes ${pg.supersedes}`);
  if (pg.pageSha256 !== sha(html) || pg.bytes !== Buffer.byteLength(html)) bad.push(`${batch}: page entry != the built page`);
  if (!ownerOk(pg)) bad.push(`${batch}: page approval`);
  const plates = o.G.extractPlates(html);
  rest.forEach((e, k) => {
    const id = ids[k]!, was = E[o.plates[id]!];
    if (e.id !== id || e.supersedes !== o.plates[id] || was?.kind !== 'plate' || was.id !== id) { bad.push(`${batch}: plate ${k}: ${e.id} supersedes ${e.supersedes}`); return; }
    const p = plates.find((x: any) => x.chromeId === e.chromeId);
    if (!p || JSON.stringify(o.G.fragmentsOf(p)) !== JSON.stringify(e.fragments)) bad.push(`${id}: fragments`);
    for (const key of new Set([...Object.keys(e), ...Object.keys(was)])) if (!PLATE_MOVES.includes(key) && JSON.stringify(e[key]) !== JSON.stringify(was[key])) bad.push(`${id}: ${key} changed`);
    if (!ownerOk(e)) bad.push(`${id}: approval`);
  });
  if ((lp.supersedes ?? null) !== o.layers.supersedes || (o.layers.supersedes !== null && E[o.layers.supersedes]?.kind !== 'layers-page')) bad.push(`${batch}: layers-page supersedes ${lp.supersedes}`);
  if (lp.approvedBy !== 'supervisor' || lp.decision !== PF_LAYERS_DECISION || !/^https:\/\/github\.com\/macdarenz-droid\/M-arc\/pull\/385#issuecomment-\d+ @ [0-9a-f]{40}$/.test(lp.approval ?? '')) bad.push(`${batch}: layers-page approval`);
  if (JSON.stringify(lp.ids) !== JSON.stringify(o.layers.ids)) bad.push(`${batch}: layers-page ids ${lp.ids}`);
  if (lp.pageSha256 !== sha(o.layers.page) || lp.bytes !== o.layers.page.length) bad.push(`${batch}: layers-page pin`);
  return bad;
}

/** The keys this PR moves that the W2 lists (W2_MOVED in crop-projection, lib-shapes and pair-faults) already check and
 *  blank: build-layers-page.mjs (D-PF-PAINNAMES-LIB #385 6657422689), batches/pilot-a.json, the 5 sheets and pilot A's
 *  closeups and layers config. A guard with no W2 list (research-routes) checks and blanks them with pfW2Problems. */
export const PF_W2_KEYS = ['tools/plates/library/build-layers-page.mjs', 'tools/plates/library/batches/pilot-a.json',
  ...['barbell_overhead_press', 'reverse_lunge', 'romanian_deadlift', 'single_leg_romanian_deadlift', 'triceps_pushdown'].map(id => `tools/plates/library/howto/lib_${id}.howto.mjs`),
  'tools/plates/library/pages/pilot-a.closeups.mjs', 'tools/plates/library/pages/pilot-a.layers.json'];
/** Problems with `m`'s PF_W2_KEYS (each must pin its current file), then those keys set to `blank`. */
export function pfW2Problems(m: any, blank: string): string[] {
  const bad: string[] = [];
  for (const [id, r] of Object.entries<any>(m.rows)) for (const k of PF_W2_KEYS) if (k in r.files) {
    if (r.files[k] !== sha(read(k))) bad.push(`${id} ${k}: ${r.files[k]} != ${sha(read(k))}`);
    r.files[k] = blank;
  }
  return bad;
}
