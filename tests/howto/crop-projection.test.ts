// F-CROP-FRONT (f-crop-front-card, Q-W2-8): a posture crop (render/closeup/crop.mjs engineCrop) projects every world
// point exactly as its plate does, for every view, facing and pitch. Reference: the engine's own makeCamera
// (vendor/engine/plate.mjs, not exported), taken from the vendored source as it stands (as f-zoom-pitch.test.ts does),
// fed the plate's spec and the fitted camera the crops reuse (base.report.camera).
//   A1 parity: every point a crop projects (centre, callout anchors, guides) is within 0.01 px of the engine's projection.
//   A3: the crop's own drawn spec projects as the plate does (front stays front, facing and pitch kept), and the drawn
//       anchor dot sits on the engine's point within the svg's 2-decimal rounding.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { W5, lessW5 } from './lib-ship-w5';
import { lessW4 } from './checks/ship-w4';
import { PF_MOVED, blankPF, pfProblems } from './platefix-pins';
import { pf2Problems, restorePF2 } from './platefix2-pins';
import { pf3bProblems, restorePF3b } from './platefix3b-pins';
// LIB-PLATEFIX-2 (#395, D-OWNER-REPIN; [golden update]): its moved keys (zoom/inline.mjs, specs/pec_fly.mjs) and
// lib_pec_fly's entry each pin their current value (pf2Problems), then are put back to main 7e060e83's (restorePF2), so
// every pin below, measured on main, still holds
const pf2Main = (x: any) => { expect(pf2Problems(x)).toEqual([]); expect(pf3bProblems(x)).toEqual([]); return restorePF3b(restorePF2(x)); };   // LIB-PLATEFIX-3b (D-PLATEFIX-PINS form): was PF2's keys only, now + 3b's assisted_pull_up.mjs and smith_machine_bench_press.mjs keys and lib_assisted_pull_up's and lib_smith_machine_bench_press's entries (platefix3b-pins), each pinning its current value, then put back to main 6227bd8e's

/* eslint-disable @typescript-eslint/no-explicit-any */
const ROOT = new URL('../../', import.meta.url);
const href = (p: string) => new URL(p, ROOT).href;
const path = (p: string) => new URL(p, ROOT).pathname;

const load = async () => {
  const [crop, cu, geom] = await Promise.all(['tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeups.mjs',
    'tools/plates/vendor/engine/geom.mjs'].map(p => import(/* @vite-ignore */ href(p))));
  const src = readFileSync(path('tools/plates/vendor/engine/plate.mjs'), 'utf8').match(/function makeCamera\([\s\S]*?\n}\n/)![0];
  const makeCamera = new Function('R', `${src}return makeCamera;`)(geom.R);
  return { crop, cu, makeCamera };
};

// The ids and why: the 4 front views of Q-W2-8, a second pitched front, the one library spec facing left, one facing right.
const CASES: [string, string][] = [
  ['cable_fly', 'front'], ['upright_row', 'front'], ['pec_fly', 'front'], ['dumbbell_fly', 'front, pitched'],
  ['bent_over_dumbbell_rear_delt_fly__alt', 'front, pitched'], ['pallof_press', 'side, facing left'], ['cable_crunch', 'side, facing right'],
];
// Fixture zooms: landmark, offset and world-point refs (x and z off zero, so a dropped facing sign or pitch term shows).
const ZOOMS = [
  { key: 'solid', alt: { right: 'r', wrong: 'w' }, right: 'end', wrong: { base: 'start', pose: {}, solid: true },
    crop: { center: 'elbow.r', sizePx: 120 },
    callout: { right: { anchor: 'elbow.r', text: 'a' }, wrong: { anchor: { at: 'wrist.r', off: [1, -2] }, text: 'b' } },
    guides: [{ kind: 'level', at: [0.21, 1.17, 0.33] }, { kind: 'path', role: 'right', pts: [[0.1, 1.0, 0.2], [0.3, 1.2, 0.4]] }] },
  { key: 'over', alt: { right: 'r', wrong: 'w' }, right: 'end', wrong: { base: 'start', pose: {}, parts: [] },
    crop: { center: [0.12, 1.31, 0.27], centerWrong: 'shoulder.l', sizePx: 150 },
    callout: { right: { anchor: 'wrist.l', text: 'a' }, wrong: { anchor: { at: 'elbow.l', pose: 'mistake' }, text: 'b' } },
    guides: [{ kind: 'level', at: 'shoulder.r', own: true }] },
];
const OPTS = { landmarks: 'spec', solidPose: 'own' };

describe('F-CROP-FRONT crops project as the plate', { timeout: 300_000 }, () => {
  it.each(CASES)('%s (%s): every crop anchor is the engine\'s projection (A1) and the crop draws the plate\'s view (A3)', async id => {
    const { crop, cu, makeCamera } = await load();
    const specFile = path(`tools/plates/library/specs/${id}.mjs`);
    const plate = (await import(/* @vite-ignore */ href(`tools/plates/library/specs/${id}.mjs`))).default;
    const engine = await cu.engineOf(specFile);
    expect(engine.name).toBe('vendor');
    const cam = engine.renderPlate(plate, { id: 'base' }).report.camera;
    const ref = makeCamera(plate, cam).P;
    const probe = { points: [] as any[], specs: [] as any[] };
    const cropHalf = crop.engineCrop({ plate, zooms: ZOOMS }, OPTS, engine, probe);
    for (const z of ZOOMS) for (const role of ['right', 'wrong']) {
      const at = probe.points.length, html = cropHalf(z, role);
      // A3: the drawn anchor dot (panel px) mapped back to plate px sits on the engine's point of the callout anchor
      const [vx, vy, s] = html.match(/viewBox="(-?[\d.]+) (-?[\d.]+) (\d+) \d+" class="z-plate"/)!.slice(1).map(Number);
      const [cx, cy] = html.match(/<circle class="z-anchor [a-z]+" cx="(-?[\d.]+)" cy="(-?[\d.]+)"/)!.slice(1).map(Number);
      const k = crop.PANEL / s, anchor = probe.points[at + 1];   // resolveRefs order: the centre, then the callout anchor
      const [dx, dy] = (z.callout as any)[role].anchor.off ?? [0, 0], want = ref(anchor.w);
      expect(Math.abs(vx + cx / k - (want[0] + dx)), `${id} ${z.key}-${role} drawn anchor x`).toBeLessThan(0.02);
      expect(Math.abs(vy + cy / k - (want[1] + dy)), `${id} ${z.key}-${role} drawn anchor y`).toBeLessThan(0.02);
    }
    // A1: every projected point
    expect(probe.points.length).toBe(14);   // 4 crops: centres, anchors, levels and the path points
    for (const { key, w, px } of probe.points) {
      const e = ref(w);
      expect(Math.hypot(px[0] - e[0], px[1] - e[1]), `${id} ${key} [${w.map((v: number) => v.toFixed(3))}]: crop (${px.map((v: number) => v.toFixed(2))}) vs engine (${e.map((v: number) => v.toFixed(2))})`).toBeLessThan(0.01);
    }
    // A3: each crop spec drawn projects as the plate (view, facing, pitch) at the plate's camera
    expect(probe.specs.length).toBe(4);
    const W = [[0.12, 1.31, 0.27], [-0.4, 0.05, -0.33], [0.71, 0.92, 0.58]];
    for (const { key, role, spec } of probe.specs) {
      const P = makeCamera(spec, spec.camera).P;
      for (const w of W) { const a = P(w), b = ref(w); expect(Math.hypot(a[0] - b[0], a[1] - b[1]), `${id} ${key}-${role} drawn view`).toBeLessThan(0.01); }
    }
  });
});

// D-CROP-PIN (#380 6627881461, the D-SHAPES-PIN form; D-CROP-NONE 6628698370 adds hand.mjs): MANIFEST.json pins the
// renderers' own source sha in every pinned row, so this card re-pins exactly crop.mjs's and hand.mjs's keys; every other
// entry equals main 8d596fab.
describe('F-CROP-FRONT D-CROP-PIN: the library MANIFEST re-pin moves only crop.mjs and hand.mjs', () => {
  const KEYS = ['tools/plates/library/render/closeup/crop.mjs', 'tools/plates/library/render/closeup/hand.mjs'];
  const sha = (b: string | Buffer) => createHash('sha256').update(b).digest('hex');
  // LIB-SHIP W2 (#379; [golden update] re-pins): W2 re-pins these keys (its sheets, batches, closeups, layers configs and
  // build-layers-page.mjs), adds these keys to these rows, and adds PILOT-B2's lib_crunch row. Each W2 key pins its
  // file's current sha; with the W2 keys blanked (moved) or removed (added) and the crunch row removed, the manifest
  // equals main cb9a6dae's with the same blanks (6dd225c2): every other entry still equals main.
  const W2_MOVED = ['tools/plates/library/batches/pilot-a.json', 'tools/plates/library/batches/pilot-b.json', 'tools/plates/library/build-layers-page.mjs',
    ...['barbell_overhead_press', 'barbell_row', 'bent_over_dumbbell_rear_delt_fly', 'box_jump', 'cable_fly', 'dumbbell_bench_press', 'dumbbell_fly',
      'dumbbell_shoulder_press', 'mountain_climbers', 'pec_fly', 'plank', 'push_up', 'reverse_lunge', 'romanian_deadlift', 'rope_triceps_pushdown',
      'seated_leg_curl', 'single_leg_romanian_deadlift', 'triceps_pushdown', 'upright_row'].map(id => `tools/plates/library/howto/lib_${id}.howto.mjs`),
    'tools/plates/library/pages/pilot-a.closeups.mjs', 'tools/plates/library/pages/pilot-a.layers.json'];
  const W2_ADDED: Record<string, string[]> = {
    'docs/research/howto/shared/back-pain-box.json': ['lib_bent_over_dumbbell_rear_delt_fly', 'lib_box_jump'],
    'tools/plates/library/shared/back-box.mjs': ['lib_bent_over_dumbbell_rear_delt_fly', 'lib_box_jump'],
    'tools/plates/library/pages/pilot-b.closeups.mjs': ['lib_cable_fly', 'lib_push_up', 'lib_seated_leg_curl', 'lib_smith_machine_bench_press'],
    'tools/plates/library/pages/pilot-b.layers.json': ['lib_cable_fly', 'lib_push_up', 'lib_seated_leg_curl', 'lib_smith_machine_bench_press'],
  };
  // LIB-SHIP W6 (#393): the 23 lb06/lb07 rows; each must pin its files' current sha256, then it is taken out (lib-shapes form)
  const W6_ROWS = [...Object.keys(JSON.parse(readFileSync(path('tools/plates/library/batches/lb06.json'), 'utf8')).rows),
    ...Object.keys(JSON.parse(readFileSync(path('tools/plates/library/batches/lb07.json'), 'utf8')).rows)];
  const lessW6 = (m: any) => {
    for (const id of W6_ROWS) {
      if (!(id in m.rows)) throw new Error(`LIB-SHIP W6: ${id} has no MANIFEST row`);
      for (const [k, v] of Object.entries<any>(m.rows[id].files)) if (v !== sha(readFileSync(path(k)))) throw new Error(`LIB-SHIP W6: ${id} ${k} does not pin its file`);
      delete m.rows[id];
    }
    return m;
  };
  /** The manifest less W2's changes (red if a W2 key does not pin its current file, or an added key is missing). */
  const lessW2 = (m: any) => {
    delete m.rows.lib_crunch;
    for (const [id, r] of Object.entries<any>(m.rows)) {
      for (const k of W2_MOVED) if (k in r.files) { expect(r.files[k], `${id} ${k}`).toBe(sha(readFileSync(path(k)))); r.files[k] = 'X'; }
      for (const [k, ids] of Object.entries(W2_ADDED)) if (ids.includes(id)) { expect(r.files[k], `${id} ${k}`).toBe(sha(readFileSync(path(k)))); delete r.files[k]; }
    }
    return m;
  };
  const w3Read = (p: string) => readFileSync(path(p), 'utf8');
  // LIB-SHIP W3 (D-SHIP-A9 guard replacement): W3's lb01 and zoom pins add these 13 rows (the 9 shipped and the 4 staged
  // at approved-plate), and W3 PANEL FIX 2 (f561ff71, #384 6649416891) moves crop.mjs and zoom-css.mjs in every row. Each
  // W3 row must be there and each moved key must pin its current file; with the rows removed and main 5023f5c6's sha put
  // back (`keep`: keys the caller checks and blanks itself), every other entry is untouched for the checks below
  const W3_ROWS = ['assisted_pull_up', 'chest_supported_row', 'chin_up', 'close_grip_pulldown', 'hanging_knee_raise', 'horizontal_leg_press',
    'incline_machine_press', 'inverted_row', 'resistance_band_row', 'shoulder_press', 'single_arm_lat_pulldown', 'straight_arm_pulldown',
    'underhand_lat_pulldown'].map(id => `lib_${id}`);
  const W3_MOVED: Record<string, string> = {
    'tools/plates/library/render/closeup/crop.mjs': 'df61d973c2933021554e3d89c9834d01f1f171c35dd10d5cd1c7a11b946985d9',
    'tools/plates/library/render/closeup/zoom-css.mjs': '37836f22478605ef8162af3c05e515385d03034d090279b6c91f4248adce2fdf',
  };
  const lessW3 = (m: any, keep: string[] = []) => {
    for (const id of W3_ROWS) { expect(Object.keys(m.rows), id).toContain(id); delete m.rows[id]; }
    for (const [id, r] of Object.entries<any>(m.rows)) for (const [k, main] of Object.entries(W3_MOVED)) {
      if (keep.includes(k)) continue;
      expect(r.files[k], `${id} ${k}`).toBe(sha(w3Read(k)));
      r.files[k] = main;
    }
    return m;
  };
  it('LIB-SHIP W3 mutations: a W3 row missing, a moved key not at its current file, and a non-W3 row changed are red', () => {
    const m = () => JSON.parse(w3Read('tools/plates/library/MANIFEST.json'));
    const a = m(); delete a.rows.lib_chin_up;
    expect(() => lessW3(a)).toThrow(/lib_chin_up/);
    const b = m(); b.rows.lib_plank.files['tools/plates/library/render/closeup/zoom-css.mjs'] = 'f'.repeat(64);
    expect(() => lessW3(b)).toThrow(/lib_plank/);
    const c = m(); c.rows.lib_plank.entry = 'f'.repeat(64);
    expect(JSON.stringify(lessW3(c))).not.toBe(JSON.stringify(lessW3(m())));
  });
  // LIB-PLATEFIX-1: main 8841246c's MANIFEST.json with the pin test's blanks and the PLATEFIX keys and entries blanked
  // LIB-SHIP W4 (merge of main 7e060e83): main's 3e726514… with lessW4's blanks too (W4's rows out, the smith-sheet key blanked)
  const PF_CP_PIN = '0b7ad1294292f67bc7f9c074c01b2c0b28613b7f9194f186076f599865189435';
  it('every pinned row pins the current crop.mjs and hand.mjs, and every other entry equals main 8d596fab', () => {
    // LIB-SHIP W6 (merge of main de91dd21): lessW6 first, the 23 W6 rows checked and taken out, as before the merge
    // LIB-SHIP W4 (D-SHIP-W4-PIN; the W2-form widening, approved #391): lessW4 (checks/ship-w4.ts) removes the 20 lb02/lb03 rows
    // (each must be present) and blanks the W4-moved keys (each must pin its current file); LIB-SHIP W3's lessW3 then takes
    // out W3's 13 rows and puts main's crop.mjs / zoom-css.mjs shas back (merge of main 62d3dcb6: both lanes kept)
    // LIB-PLATEFIX-2 (#395): pf2Main then checks its moved keys and entry and puts main 7e060e83's back (merge of main 6227bd8e)
    const m = lessW3(pf2Main(lessW4(lessW6(JSON.parse(readFileSync(path('tools/plates/library/MANIFEST.json'), 'utf8'))), k => sha(readFileSync(path(k))))), [KEYS[0]!]);
    const rows = Object.values(m.rows) as { files: Record<string, string> }[];
    expect(rows).toHaveLength(22 + W5.length);   // LIB-SHIP W2: + PILOT-B2's lib_crunch; LIB-SHIP W5: + lb04's and lb05's 27 rows (lessW5)
    expect(Object.keys(m.rows)).toContain('lib_crunch');
    for (const r of rows) for (const k of KEYS) { expect(r.files[k]).toBe(sha(readFileSync(path(k)))); r.files[k] = 'X'; }
    // F-PAIR-FAULTS (#386): build-layers-page.mjs's and pairs.mjs's keys are re-pinned there and pinned exactly by pair-faults.test.ts
    // (build-layers-page.mjs's key is checked against its file and blanked by lessW2, a W2 key too)
    for (const r of rows) r.files['tools/plates/library/hands/pairs.mjs'] = 'X';
    // LIB-PLATEFIX-3 E2 (#405 6684669717 item 18, [golden update]): render/closeup/zoom.mjs's key is re-pinned there and pinned
    // exactly by platefix3-engine.test.ts
    for (const r of rows) r.files['tools/plates/library/render/closeup/zoom.mjs'] = 'X';
    // main cb9a6dae's MANIFEST.json with the same entries blanked was b126d854 (#386); LIB-SHIP W2 (merge of main cf28ab23,
    // both sides kept): with W2's changes also taken out, main cf28ab23's with the same blanks
    // LIB-SHIP W5: with W5's 27 rows also taken out first (lessW5: each must be present), the same hash
    // RESEARCH-ROUTES-1 (#398, D-RR-HEAD): back-pain-box.json's key is re-pinned there and pinned exactly by research-routes.test.ts;
    // each row that still lists it after lessW2 must pin the current file, then it is blanked too
    const rrBox = (x: any) => { for (const r of Object.values<any>(x.rows)) if ('docs/research/howto/shared/back-pain-box.json' in r.files) { expect(r.files['docs/research/howto/shared/back-pain-box.json']).toBe(sha(readFileSync(path('docs/research/howto/shared/back-pain-box.json')))); r.files['docs/research/howto/shared/back-pain-box.json'] = 'X'; } return x; };
    // (was 3882bf3e… without RESEARCH-ROUTES-1's key; re-measured by RESEARCH-ROUTES-1 on main e623d3ef)
    // F-BODYMAP-FRONTDELT (#404, D-BODYMAP-LIB): its region-fix.mjs key is re-pinned there and pinned exactly by
    // tests/library/bodymap-frontdelt.test.ts; each must pin its current file, then it is put back to main 5023f5c6's value.
    const bmFix = (x: any) => { for (const r of Object.values<any>(x.rows)) if ('tools/plates/library/render/region-fix.mjs' in r.files) { expect(r.files['tools/plates/library/render/region-fix.mjs']).toBe(sha(readFileSync(path('tools/plates/library/render/region-fix.mjs')))); r.files['tools/plates/library/render/region-fix.mjs'] = '3ffbd27de5e812d60a4542de4d483113640aa4b0b427089317e2cedb39e7f3a8'; } return x; };
    // LIB-PLATEFIX-3 (D-PLATEFIX-PINS form, #405 6684669717 item 18): was 99d9824b…e882e, then f8074fd0 with zoom.mjs's key also blanked.
    // LIB-PLATEFIX-1 (#385, D-PLATEFIX-PINS / PIN GO; [golden update]; merge of main 8841246c, both sides kept): its moved keys,
    // added keys and superseded entries each pin their current value (pfProblems), then are blanked too (blankPF): every key
    // and entry where this MANIFEST differs from main 8841246c's is blanked by one of these, so the rest is main 8841246c's
    // MANIFEST.json with the same blanks (measured on main 8841246c's own MANIFEST).
    expect(pfProblems(m)).toEqual([]);
    expect(sha(JSON.stringify(rrBox(lessW2(bmFix(blankPF(lessW5(m), 'X'))))))).toBe(PF_CP_PIN);   // LIB-SHIP W5: lessW5 first, as before the merge
  });
  it('LIB-PLATEFIX-1 mutations: a moved key, an added key or a superseded entry off its current value is red, and so is any other key moved', () => {
    // LIB-SHIP W6 merge of main de91dd21: the 23 W6 rows checked and taken out before pf2Main puts main's PF values back
    const cur = () => pf2Main(lessW6(JSON.parse(readFileSync(path('tools/plates/library/MANIFEST.json'), 'utf8'))));
    const m1 = cur(); (Object.values<any>(m1.rows).find(r => PF_MOVED[2]! in r.files)).files[PF_MOVED[2]!] = '0'.repeat(64);
    expect(pfProblems(m1)).toHaveLength(1);
    const m2 = cur(); m2.rows.lib_reverse_lunge.files['tools/plates/library/pages/pilot-a3.layers.json'] = '0'.repeat(64);
    expect(pfProblems(m2)).toHaveLength(1);
    const m3 = cur(); m3.rows.lib_romanian_deadlift.entry = '0'.repeat(64);
    expect(pfProblems(m3)).toEqual([`lib_romanian_deadlift: entry ${'0'.repeat(64)} != ${cur().rows.lib_romanian_deadlift.entry}`]);
    // the pin test's blanks, without its checks: the current MANIFEST gives the pin, one other entry moved does not
    const all = (x: any) => {
      // LIB-SHIP W6 merge: the 23 W6 rows were checked and taken out by cur(), as in the pin test
      lessW4(x, k => sha(readFileSync(path(k))));   // LIB-SHIP W4 (merge of main 7e060e83): W4's 20 rows out and its moved keys blanked first
      lessW5(lessW3(x, [KEYS[0]!]));   // LIB-SHIP W5: W5's 27 rows out too (merge of main 05382042)
      for (const r of Object.values<any>(x.rows)) for (const k of [...KEYS, 'tools/plates/library/hands/pairs.mjs', 'tools/plates/library/render/closeup/zoom.mjs']) r.files[k] = 'X';
      for (const r of Object.values<any>(x.rows)) if ('tools/plates/library/render/region-fix.mjs' in r.files) r.files['tools/plates/library/render/region-fix.mjs'] = '3ffbd27de5e812d60a4542de4d483113640aa4b0b427089317e2cedb39e7f3a8';
      const y = lessW2(blankPF(x, 'X'));
      for (const r of Object.values<any>(y.rows)) if ('docs/research/howto/shared/back-pain-box.json' in r.files) r.files['docs/research/howto/shared/back-pain-box.json'] = 'X';
      return sha(JSON.stringify(y));
    };
    expect(all(cur())).toBe(PF_CP_PIN);
    const m4 = cur(); m4.rows.lib_plank.entry = '0'.repeat(64);   // an entry this card does not supersede
    expect(pfProblems(m4)).toEqual([]);
    expect(all(m4)).not.toBe(PF_CP_PIN);
  });
});

// D-CROP-NONE (#380 6628698370, from #379 Q-W2-11): a sheet with no hand zoom (D-SHIP-GRIP 'none') builds through the
// zoom shell (render/closeup/zoom.mjs zoomApi); handZoomOf returned before it read the absent handling.wrist.
describe('F-CROP-FRONT D-CROP-NONE: a none sheet builds through the zoom shell', { timeout: 300_000 }, () => {
  it('zoomApi builds a none sheet (no hand zoom, no wrist text) and draws its posture crop', async () => {
    const [{ zoomApi }, cu] = await Promise.all(['tools/plates/library/render/closeup/zoom.mjs', 'tools/plates/library/render/closeups.mjs']
      .map(p => import(/* @vite-ignore */ href(p))));
    const specFile = path('tools/plates/library/specs/cable_fly.mjs');
    const plate = (await import(/* @vite-ignore */ href('tools/plates/library/specs/cable_fly.mjs'))).default;
    const z: any = { ...ZOOMS[0], chip: 'Elbows', heading: 'Elbow bend', kind: 'posture', caption: { right: 'r', wrong: 'w' } };
    const howto = { id: 'lib_cable_fly', plate, handling: { archetype: 'none', why: 'D-SHIP-GRIP' }, zooms: [z], chips: [z.key, 'feel'] };
    const opts = { shell: 'zoom', chipText: { feel: 'Feel' }, crop: { source: 'engine', ...OPTS }, css: { thumb: 'plain' } };
    const api = zoomApi({ default: howto }, opts, await cu.engineOf(specFile));
    expect(api.handZoom).toBeUndefined();
    expect(api.PAGES).toBeUndefined();
    const html = api.postureZoom(z);
    expect(html.match(/<svg class="z-crop"/g)).toHaveLength(2);
    expect(api.chipRow(z.key)).toContain('aria-pressed="true">Elbows</button>');
  });
});
