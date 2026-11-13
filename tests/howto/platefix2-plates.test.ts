// LIB-PLATEFIX-2 plates (PLATEFIX-2 PLAN RULED on #395): pec_fly PQ-H4 (D-SHIP-PECFLY-HOLD, approved at pf4). dumbbell_fly
// and the rear delt fly are held after their last round (D-LIB13-PANEL2, #395 6655186998); their drawings stay at main's,
// and the fix work is in this PR's history (2967c154) for the later card. The H4 overlap itself is the gate's
// LIB-PLATEFIX-2 block (a browser measurement).
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { lessSC } from './sheetcopy-pins';

const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
let pec: any;
beforeAll(async () => { pec = (await import(/* @vite-ignore */ lib('specs/pec_fly.mjs'))).default; });

describe('PF2 pec_fly PQ-H4 (D-SHIP-PECFLY-HOLD)', () => {
  // the hit-box overlap is a browser measurement (qa/browser.mjs at 390/360/340 px): it runs in the plate QA, not in this
  // unit file (unit jobs have no browser); here the moved box and its leader's anchor are pinned
  it('the height box sits at top 260 and its leader still ends on the start grip', () => {
    expect(pec.callouts.find((x: any) => x.key === 'height')).toMatchObject({ anchor: { at: 'grip.r', pose: 'start' }, box: { left: 20, top: 260 } });
  });
});

// LIB-PLATEFIX-2 [golden update] (D-OWNER-REPIN, D-PLATEFIX-SECOND form, after #385 on main 7e060e83)
describe('PF2 pilot A re-pin: the owner page and pec_fly plate entries, and the MANIFEST guard helper', () => {
  // F-SHEET-COPY (#423, the W8a form): pilot-a.json now ends with its F-SHEET-COPY layers-page entry; lessSC checks it
  // (scLayersProblems on the committed page) and leaves it out, so the entries below are main's, unchanged
  const G = () => lessSC(JSON.parse(readFileSync(new URL('../../tests/howto/golden/library/pilot-a.json', import.meta.url), 'utf8')), 'pilot-a',
    readFileSync(new URL('../../tests/howto/golden/library/pilot-a.layers.html', import.meta.url))).file.entries;
  it('the last two entries are the page entry (superseding #385\'s 17) and pec_fly\'s (superseding 8); pec_fly moves only normalSvg and normalOverlay', () => {
    const E = G(), [pg, pf] = E.slice(23, 25), was = E[8];   // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was E.slice(-2), now E.slice(23, 25) (its 2 owner entries follow; pinned below)
    expect([E.length, pg.kind, pg.supersedes, E[17].kind, pg.approvedBy, pf.kind, pf.id, pf.supersedes, pf.approvedBy]).toEqual([28, 'page', 17, 'page', 'owner', 'plate', 'lib_pec_fly', 8, 'owner']);   // LIB-SHIP W8a: was 27, now 28 (its appended layers-page entry, pinned below). LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was length 25, now 27 (its 2 owner entries)
    // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was nothing after pec_fly's entry, now exactly its owner barbell_overhead_press plate (superseding 19) and page (superseding PF2's 23)
    // LIB-SHIP W8a (D-BODYMAP-APPEND, #413 6761492481): then exactly its supervisor layers-page entry, superseding 22
    expect(E.slice(25).map((e: any) => [e.kind, e.id ?? null, e.supersedes, e.approvedBy])).toEqual([['plate', 'lib_barbell_overhead_press', 19, 'owner'], ['page', null, 23, 'owner'], ['layers-page', null, 22, 'supervisor']]);
    for (const e of [pg, pf]) expect(e.decision).toMatch(/^D-OWNER-REPIN; LIB-PLATEFIX-2 golden update .*pf4 plates panel #395 6648800268 @ 24100cff74515ad865f044164bd8cb19c28b9c09/);
    expect(pg.decision).toContain('pf1 plates panel #385 6636073314');
    const moved = Object.keys(pf.fragments).filter(k => pf.fragments[k] !== was.fragments[k]);
    expect(moved).toEqual(['normalSvg', 'normalOverlay']);
    const keep = (e: any) => Object.fromEntries(Object.entries(e).filter(([k]) => !['fragments', 'approvedBy', 'decision', 'approval', 'date', 'why', 'supersedes', 'prev'].includes(k)));
    expect(keep(pf)).toEqual(keep(was));
  });
  it('pf2Problems is red when a moved key or lib_pec_fly\'s entry is off its current value; restorePF2 changes only those', async () => {
    const P = await import('./platefix2-pins');
    const cur = () => JSON.parse(readFileSync(new URL('../../tools/plates/library/MANIFEST.json', import.meta.url), 'utf8'));
    expect(P.pf2Problems(cur())).toEqual([]);
    const m1 = cur(); m1.rows.lib_pec_fly.files['tools/plates/library/specs/pec_fly.mjs'] = '0'.repeat(64);
    expect(P.pf2Problems(m1)).toHaveLength(1);
    const m2 = cur(); m2.rows.lib_plank.files['tools/plates/library/zoom/inline.mjs'] = '0'.repeat(64);
    expect(P.pf2Problems(m2)).toHaveLength(1);
    const m3 = cur(); m3.rows.lib_pec_fly.entry = P.PF2_MAIN_ENTRY;
    expect(P.pf2Problems(m3)).toHaveLength(1);
    const a = cur(), b = P.restorePF2(cur()), diff: string[] = [];
    for (const id of Object.keys(a.rows)) {
      if (a.rows[id].entry !== b.rows[id].entry) diff.push(`${id} entry`);
      for (const k of Object.keys(a.rows[id].files)) if (a.rows[id].files[k] !== b.rows[id].files[k]) diff.push(k);
    }
    expect([...new Set(diff)].sort()).toEqual(['lib_pec_fly entry', 'tools/plates/library/specs/pec_fly.mjs', 'tools/plates/library/zoom/inline.mjs']);
  });
});

// LIB-PLATEFIX-3b (#408, D-OWNER-REPIN; D-PLATEFIX-PINS form): its MANIFEST guard helper (platefix3b-pins), red-capable
describe('PF3b MANIFEST guard helper', () => {
  it('pf3bProblems is red when a moved key or a moved entry is off its current value; restorePF3b changes only those', async () => {
    const P = await import('./platefix3b-pins');
    const cur = () => JSON.parse(readFileSync(new URL('../../tools/plates/library/MANIFEST.json', import.meta.url), 'utf8'));
    expect(P.pf3bProblems(cur())).toEqual([]);
    const m1 = cur(); m1.rows.lib_assisted_pull_up.files['tools/plates/library/specs/assisted_pull_up.mjs'] = '0'.repeat(64);
    expect(P.pf3bProblems(m1)).toHaveLength(1);
    const m2 = cur(); m2.rows.lib_smith_machine_bench_press.files['tools/plates/library/specs/smith_machine_bench_press.mjs'] = '0'.repeat(64);
    expect(P.pf3bProblems(m2)).toHaveLength(1);
    const m3 = cur(); m3.rows.lib_assisted_pull_up.entry = '0'.repeat(64);
    expect(P.pf3bProblems(m3)).toHaveLength(1);
    const m4 = cur(); m4.rows.lib_smith_machine_bench_press.entry = P.PF3B_MAIN_ENTRY.lib_smith_machine_bench_press!;
    expect(P.pf3bProblems(m4)).toHaveLength(1);
    const a = cur(), b = P.restorePF3b(cur()), diff: string[] = [];
    for (const id of Object.keys(a.rows)) {
      if (a.rows[id].entry !== b.rows[id].entry) diff.push(`${id} entry`);
      for (const k of Object.keys(a.rows[id].files)) if (a.rows[id].files[k] !== b.rows[id].files[k]) diff.push(k);
    }
    expect([...new Set(diff)].sort()).toEqual(['lib_assisted_pull_up entry', 'lib_smith_machine_bench_press entry', 'tools/plates/library/specs/assisted_pull_up.mjs', 'tools/plates/library/specs/smith_machine_bench_press.mjs']);
  });
});
