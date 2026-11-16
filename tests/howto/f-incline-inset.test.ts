// F-INCLINE-INSET (card docs/supervisor/verify/f-incline-inset-card.md on claude/sup-lib4-cards; PLAN RULED #436 6919238880):
// incline_barbell_bench_press's elbow flare in a head-end inset with its own source ring (D-FII-INSET, smith's
// D-PF3B-INSETRING form), one place in both views (D-FII-PLACE (a), spec only), a readable inset (head, both shoulders, the
// bar line across the chest at shoulder width, D-FII-REF; the knees out), the side view's knot cleared (no dashed ring:
// RING and GHOST_UPPER gone, D-FII-GHOSTUP; the arrow ends on both elbows within 0.05 px, D-FII-ARROW; the shoulder line
// square to the pad; the two Mistake leader ends at least 24 px apart, D-FII-LEAD) and R7's '30°' value moved off the bench
// leader (D-FII-R7, D-FII-BOXES). Every value is read from the engine's landmarks, the plate's camera and the zoom's own
// projection and drawing. Main's spec has no zoom and its side view keeps the ring and the old boxes, so I1-I5 are red there.
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { beforeAll, describe, expect, it } from 'vitest';
import { yieldTask } from '../child-test';   // F-VITEST-RPC-2

/* eslint-disable @typescript-eslint/no-explicit-any */
const lib = (f: string) => new URL(`../../tools/plates/library/${f}`, import.meta.url).href;
const T = 600_000;
let plate: any, body: any, eq: any, qaEng: any, zoom: any, mg: any, ibp: any, smith: any;
beforeAll(async () => {
  [plate, body, eq, qaEng, zoom, mg] = await Promise.all(['../vendor/engine/plate.mjs', '../vendor/engine/body.mjs', '../vendor/engine/equipment.mjs', 'qa/engine.mjs', 'zoom/inline.mjs', 'mistake-ghosts.mjs']
    .map(f => import(/* @vite-ignore */ lib(f))));
  ibp = (await import(/* @vite-ignore */ lib('specs/incline_barbell_bench_press.mjs'))).default;
  smith = (await import(/* @vite-ignore */ lib('specs/smith_machine_bench_press.mjs'))).default;
}, T);

const Eng = () => ({ renderPlate: plate.renderPlate, PRIMITIVES: eq.PRIMITIVES, body });
const VIEWS = ['normal', 'mistake'] as const;
const SRC = ['shoulder.r', 'elbow.r'];
const deg = (v: number) => v * 180 / Math.PI;
const sub = (a: number[], b: number[]) => [a[0]! - b[0]!, a[1]! - b[1]!];
const len = (v: number[]) => Math.hypot(v[0]!, v[1]!);
const dist = (a: number[], b: number[]) => len(sub(a, b));
const angle = (a: number[], b: number[]) => deg(Math.acos((a[0]! * b[0]! + a[1]! * b[1]!) / (len(a) * len(b))));
const segDist = (p: number[], a: number[], b: number[]) => { const d = sub(b, a), t = Math.max(0, Math.min(1, ((p[0]! - a[0]!) * d[0]! + (p[1]! - a[1]!) * d[1]!) / (d[0]! ** 2 + d[1]! ** 2)));
  return dist(p, [a[0]! + t * d[0]!, a[1]! + t * d[1]!]); };
/** The plate camera and the end / Mistake pose landmarks (world), as the engine resolves them. */
const sideOf = (spec: any) => { const cam = qaEng.cameraOf(spec, plate.renderPlate(spec, { id: 'q' }).report), L = qaEng.poseLandmarks(Eng(), spec).lm;
  return { cam, P: (w: number[]) => cam.P(w), lmE: L.end, lmM: L.mistake }; };
const zoomOrNull = (spec: any, view: string) => { try { return zoom.zoomOf(spec, { prefix: 't', view }); } catch { return null; } };

// ---------------------------------------------------------------------------------------------------------------- I1
/** I1: both views carry a head inset whose own source ring (src) holds the side plate's shoulder and elbow dots, linked. */
function srcProblems(spec: any): string[] {
  const out: string[] = [], { P, lmE } = sideOf(spec);
  for (const v of VIEWS) {
    const e = zoom.zoomFor(spec, v);
    if (!e) { out.push(`${v}: no zoom entry`); continue; }
    if (e.project !== 'head') out.push(`${v}: project ${e.project}, not head`);
    if (JSON.stringify(e.src) !== JSON.stringify(SRC)) out.push(`${v}: src ${JSON.stringify(e.src)}`);
    if ('ring' in e) out.push(`${v}: ring ${e.ring} (a plain inset, no source ring)`);
    const o = zoomOrNull(spec, v);
    if (!o) { out.push(`${v}: the zoom does not build`); continue; }
    if (!o.src || !/<circle class="pz-src"/.test(o.svg)) { out.push(`${v}: no source ring drawn`); continue; }
    for (const n of SRC) if (dist(P(lmE[n]), o.src.c) > o.src.r) out.push(`${v}: the source ring misses the ${n} dot`);
    if (!o.link || !/<path class="pz-link"/.test(o.svg)) out.push(`${v}: no link`);
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- I2
/** I2: one place: both circles share their centre (within 1 px) and the source ring is the same in both views. */
function placeProblems(spec: any): string[] {
  const n = zoomOrNull(spec, 'normal'), m = zoomOrNull(spec, 'mistake');
  if (!n || !m) return ['a view has no zoom'];
  const out: string[] = [];
  if (dist(n.circle.c, m.circle.c) > 1) out.push(`the circle moves ${dist(n.circle.c, m.circle.c).toFixed(1)} px between views (${n.circle.c} -> ${m.circle.c})`);
  if (n.circle.r !== m.circle.r) out.push(`radii ${n.circle.r} and ${m.circle.r}`);
  if (JSON.stringify(n.src) !== JSON.stringify(m.src)) out.push('the source ring differs between views');
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- I3
/** The inset of `view`: its entry and circle and a map of world points into the circle (zoom px), from the zoom's own
 *  projection (postureUV), the plate camera's scale x k and the region centre, as the zoom places it. */
function inset(spec: any, view: 'normal' | 'mistake') {
  const entry = zoom.zoomFor(spec, view), o = zoom.zoomOf(spec, { prefix: 't', view }), { cam } = sideOf(spec);
  const uv = zoom.postureUV(entry, cam, spec), s = cam.pxPerM * entry.k, R = zoom.focusPoints(spec, entry).map(uv);
  const xs = R.map((q: number[]) => q[0]), ys = R.map((q: number[]) => q[1]), mc = [(Math.min(...xs) + Math.max(...xs)) / 2, (Math.min(...ys) + Math.max(...ys)) / 2];
  const Z = (w: number[]) => { const q = uv(w); return [o.circle.c[0] + s * (q[0] - mc[0]!), o.circle.c[1] - s * (q[1] - mc[1]!)]; };
  const L = qaEng.poseLandmarks(Eng(), zoom.postureSpec(spec, entry)).lm;
  return { entry, o, Z, lm: L[view === 'mistake' ? 'mistake' : 'end'], lmE: L.end };
}
/** An upper arm in the inset: its length (px), its angle from the torso axis (shoulders -> hips, deg), elbow inside. */
const armIn = (I: any, lm: any) => { const arm = sub(I.Z(lm['elbow.r']), I.Z(lm['shoulder.r'])), torso = sub(I.Z(I.lmE.hips), I.Z(I.lmE.shoulders));
  return { px: len(arm), deg: angle(arm, torso), inside: dist(I.Z(lm['elbow.r']), I.o.circle.c) <= I.o.circle.r }; };
/** I3: the inset's content. `over`: landmark overrides (world) per view, to measure a drawn arm elsewhere (m4b). */
function contentProblems(spec: any, over: Record<string, Record<string, number[]>> = {}): string[] {
  const out: string[] = [];
  for (const v of VIEWS) {
    if (!zoom.zoomFor(spec, v) || !zoomOrNull(spec, v)) { out.push(`${v}: no inset`); continue; }
    const I0 = inset(spec, v), I = { ...I0, lm: { ...I0.lm, ...(over[v] ?? {}) }, lmE: { ...I0.lmE, ...(over.end ?? {}) } }, { c, r } = I.o.circle, d = (w: number[]) => dist(I.Z(w), c);
    for (const n of ['head', 'shoulder.l', 'shoulder.r']) if (d(I.lmE[n]) > r) out.push(`${v}: ${n} outside the circle (${d(I.lmE[n]).toFixed(1)} > ${r})`);
    for (const n of ['knee.l', 'knee.r']) if (d(I.lmE[n]) <= r) out.push(`${v}: ${n} inside the circle (${d(I.lmE[n]).toFixed(1)} <= ${r})`);
    const ref = I.entry.ref;
    if (!ref) out.push(`${v}: no bar ref`);
    else for (const [k, w] of ref.entries()) if (d(w) > r) out.push(`${v}: bar ref end ${k} outside the circle`);
    const right = armIn(I, { ...I.lmE, ...(over.end ?? {}) });
    if (!(right.deg >= 45 && right.deg <= 75)) out.push(`${v}: Right upper arm ${right.deg.toFixed(1)} deg from the torso (c7 45-75)`);
    if (right.px < 40) out.push(`${v}: Right upper arm ${right.px.toFixed(1)} px < 40`);
    if (!right.inside) out.push(`${v}: Right elbow outside the circle`);
    if (v === 'mistake') {
      const wrong = armIn(I, I.lm);
      if (!(wrong.deg >= 85 && wrong.deg <= 95)) out.push(`mistake: Wrong upper arm ${wrong.deg.toFixed(1)} deg from the torso (85-95)`);
      if (wrong.px < 40) out.push(`mistake: Wrong upper arm ${wrong.px.toFixed(1)} px < 40`);
      if (!wrong.inside) out.push('mistake: Wrong elbow outside the circle');
      // the flared upper arm's ghost: a dashed guide lying along shoulder -> flared elbow (capsule radius 7.6 px + 1), at least 40 px long
      const a = I.Z(I.lm['shoulder.r']), b = I.Z(I.lm['elbow.r']);
      const ghost = (I.entry.guides ?? []).some((g: any) => { if (g.kind !== 'dashed') return false; const q = g.pts.map(I.Z);
        return q.every((p: number[]) => segDist(p, a, b) <= 0.052 * 146.29 + 1) && Math.max(...q.map((p: number[]) => dist(p, a))) >= 40; });
      if (!ghost) out.push('mistake: no ghost of the flared upper arm in the inset');
    }
  }
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- I4
export const LEAD_MIN = 24;   // D-FII-LEAD: the two Mistake leader ends at least 24 px apart (main: 6 px; smith's posted below)
const leaderEnds = (spec: any) => [...plate.renderPlate(spec, { id: 'x', mistake: true }).svg.matchAll(/<path class="leader m" d="M(-?[\d.]+) (-?[\d.]+)/g)].map(x => [+x[1]!, +x[2]!]);
const isLandmark = (a: any) => a && typeof a === 'object' && !Array.isArray(a) && typeof a.at === 'string' && ['end', 'mistake', 'start'].includes(a.pose ?? 'end')
  && Object.keys(a).every(k => ['at', 'pose', 'off'].includes(k)) && (a.off === undefined || (Array.isArray(a.off) && a.off.length === 2 && a.off.every(Number.isFinite)));
/** I4: the side view's Mistake marks (R5 c1, c3; D-FII-PINS replacement of LIB-10's R5). */
function sideProblems(spec: any): string[] {
  const out: string[] = [], { P, lmE, lmM } = sideOf(spec), sh = P(lmM['shoulder.r']), ee = P(lmE['elbow.r']), me = P(lmM['elbow.r']);
  const dashed = spec.mistake.guides.filter((g: any) => g.kind === 'dashed').map((g: any) => g.pts.map(P));
  for (const q of dashed) {
    const m = [q.reduce((s: number, p: number[]) => s + p[0]!, 0) / q.length, q.reduce((s: number, p: number[]) => s + p[1]!, 0) / q.length];
    if (q.length >= 4 && q.every((p: number[]) => dist(p, m) <= 4)) out.push(`a joint-sized dashed ring at (${m.map(v => v.toFixed(1))})`);
    // a ring-sized closed loop (span <= 30 px) whose box holds the shoulder dot: main's GHOST_UPPER spans 20.2 px (a
    // self-crossing loop, so its box, not its winding, is read); the ghost forearm (elbow to bar, 39.1 px), which passes
    // over the shoulder dot side-on, is not a ring
    const span = Math.max(...q.flatMap((a: number[]) => q.map((b: number[]) => dist(a, b)))), xs = q.map((p: number[]) => p[0]), ys = q.map((p: number[]) => p[1]);
    if (q.length >= 4 && dist(q[0], q[q.length - 1]) < 0.01 && span <= 30 && sh[0]! >= Math.min(...xs) && sh[0]! <= Math.max(...xs) && sh[1]! >= Math.min(...ys) && sh[1]! <= Math.max(...ys))
      out.push('a closed dashed loop around the Mistake shoulder dot');
  }
  const arrow = spec.mistake.guides.find((g: any) => g.kind === 'arrow');
  if (!arrow || !Array.isArray(arrow.from) || dist(P(arrow.from), ee) > 0.05) out.push('the arrow does not start at the correct elbow');
  if (!arrow || !Array.isArray(arrow.to) || dist(P(arrow.to), me) > 0.05) out.push('the arrow does not end at the flared elbow');
  const padUp = [-Math.cos(30 * Math.PI / 180), -Math.sin(30 * Math.PI / 180)];   // up the 30 deg pad on screen (head to the left)
  const line = dashed.find((q: number[][]) => q.length === 2 && segDist(sh, q[0]!, q[1]!) <= 1 && Math.abs(angle(sub(q[1]!, q[0]!), padUp) - 90) <= 2);
  if (!line) out.push('no dashed shoulder line through the Mistake shoulder, square to the pad');
  const t = (k: string) => spec.mistake.tells.find((x: any) => x.key === k);
  for (const x of spec.mistake.tells) if (!isLandmark(x.anchor)) out.push(`tell ${x.key}: anchor is not a landmark`);
  const lv = t('level')?.anchor, fl = t('flare')?.anchor;
  if (JSON.stringify(fl) !== JSON.stringify({ at: 'elbow.r', pose: 'mistake' })) out.push('flare not on the flared elbow');
  if (!(lv?.at === 'shoulder.r' && lv?.pose === 'mistake' && Array.isArray(lv?.off))) out.push('level is not the Mistake shoulder with an offset');
  else if (line) { const end = [sh[0]! + lv.off[0], sh[1]! + lv.off[1]], far = dist(line[0], sh) > dist(line[1], sh) ? line[0] : line[1];
    if (dist(end, far) > 1) out.push(`level does not end on the shoulder line's outer end (${dist(end, far).toFixed(2)} px)`); }
  const ends = leaderEnds(spec);
  if (ends.length !== 2 || dist(ends[0]!, ends[1]!) < LEAD_MIN) out.push(`leader ends ${ends.length === 2 ? dist(ends[0]!, ends[1]!).toFixed(1) : '?'} px apart (< ${LEAD_MIN})`);
  const svg: string = plate.renderPlate(spec, { id: 'x', mistake: true }).svg;
  if (!(svg.indexOf('class="mistake-layer"') > svg.lastIndexOf('pose-end'))) out.push('red marks under the solid figure');
  return out;
}

// ---------------------------------------------------------------------------------------------------------------- I5
/** I5 (R7): leader samples (101 per segment, 2 px margin) inside a label box other than the leader's own (the box its end
 *  touches), per view; [] when none. */
function crossings(spec: any): string[] {
  const out: string[] = [];
  for (const m of [false, true]) {
    const raw = plate.renderPlate(spec, { id: 'x', mistake: m }), p = m ? mg.mistakePlate(spec, raw) : raw, B = zoom.labelBoxes(p.overlay);
    for (const pl of zoom.leadersOf(p.svg)) {
      const end = pl[pl.length - 1], own = B.findIndex((b: any) => end[0] >= b.x0 - 3 && end[0] <= b.x1 + 3 && end[1] >= b.y0 - 3 && end[1] <= b.y1 + 3);
      for (const [j, b] of B.entries()) {
        if (j === own) continue;
        let n = 0;
        for (let s = 0; s < pl.length - 1; s++) for (let k = 0; k <= 100; k++) { const x = pl[s][0] + (pl[s + 1][0] - pl[s][0]) * k / 100, y = pl[s][1] + (pl[s + 1][1] - pl[s][1]) * k / 100;
          if (x > b.x0 - 2 && x < b.x1 + 2 && y > b.y0 - 2 && y < b.y1 + 2) n++; }
        if (n) out.push(`${m ? 'mistake' : 'normal'}: a leader from (${pl[0].map((v: number) => v.toFixed(1))}) enters the ${b.kind} box ${[b.x0, b.y0, b.x1, b.y1].map((v: number) => v.toFixed(0))} (${n} samples)`);
      }
    }
  }
  return out;
}
const arcValue = (spec: any) => /plate-arc-label[^>]*><b>([^<]*)<\/b><span>([^<]*)<\/span>/.exec(plate.renderPlate(spec, { id: 'x' }).overlay)?.[2];

// ---------------------------------------------------------------------------------------------------------- mutations
const withZoom = (spec: any, f: (e: any) => any) => ({ ...spec, zoom: spec.zoom.map(f) });
const withTell = (spec: any, k: string, f: (t: any) => any) => ({ ...spec, mistake: { ...spec.mistake, tells: spec.mistake.tells.map((t: any) => (t.key === k ? f(t) : t)) } });
const withGuides = (spec: any, g: any[]) => ({ ...spec, mistake: { ...spec.mistake, guides: g } });
/** A world loop of `n + 1` points, radius `r` m, round centre `c` in the side plane (main's RING form). */
const loop = (c: number[], r: number, n = 12) => Array.from({ length: n + 1 }, (_, k) => [0, c[1]! + r * Math.sin(2 * Math.PI * k / n), c[2]! + r * Math.cos(2 * Math.PI * k / n)]);
/** main's side capsule (copied from the spec's `capsule`, close_grip_bench_press's): GHOST_UPPER's form. */
const capsule = (a: number[], b: number[], ra: number, rb: number, n = 8) => { const u = [b[1]! - a[1]!, b[2]! - a[2]!], k = Math.hypot(u[0]!, u[1]!), t = [u[0]! / k, u[1]! / k], nn = [-t[1]!, t[0]!], pts: number[][] = [];
  const ang0 = Math.atan2(nn[0]!, nn[1]!);
  for (let i = 0; i <= n; i++) { const q = ang0 - Math.PI * i / n; pts.push([0, b[1]! + rb * Math.cos(q), b[2]! + rb * Math.sin(q)]); }
  for (let i = 0; i <= n; i++) { const q = ang0 + Math.PI - Math.PI * i / n; pts.push([0, a[1]! + ra * Math.cos(q), a[2]! + ra * Math.sin(q)]); }
  return [...pts, pts[0]!]; };

describe('F-INCLINE-INSET I1-I2: the head inset with its own source ring, in one place', { timeout: T }, () => {
  it('I1: both views carry a head inset with src [shoulder.r, elbow.r]; the drawn ring holds both dots; the link is drawn in both', () => {
    expect(srcProblems(ibp)).toEqual([]);
  });
  it('I2: the normal and Mistake circles share one centre (within 1 px) and one source ring', () => {
    expect(placeProblems(ibp)).toEqual([]);
  });
  it('m1: ring false back on either entry is red on I1', async () => {
    for (const v of VIEWS) {
      await yieldTask();
      const m = withZoom(ibp, (e: any) => (e.view === v ? (({ src, ...rest }) => ({ ...rest, ring: false }))(e) : e));
      expect(srcProblems(m).join('; '), v).toMatch(new RegExp(`${v}: (src undefined|ring false)`));
    }
  });
  it('m2: the level box back at main\'s {8,198} lets the Mistake search take another spot: red on I2', () => {
    const m = withTell(ibp, 'level', (t: any) => ({ ...t, box: { left: 8, top: 198 } }));
    expect(placeProblems(m).join('; ')).toMatch(/the circle moves/);
  });
});

describe('F-INCLINE-INSET I3: the inset reads (head, both shoulders, the bar line; the knees out; the two arm angles)', { timeout: T }, () => {
  it('I3: head, both shoulders and both bar-line ends inside, both knees outside; Right 45-75 deg, Wrong 85-95 deg, each at least 40 px', () => {
    expect(contentProblems(ibp)).toEqual([]);
    const n = inset(ibp, 'normal'), m = inset(ibp, 'mistake'), R = armIn(n, n.lmE), W = armIn(m, m.lm);
    console.log(`F-INCLINE-INSET I3: Right ${R.px.toFixed(1)} px at ${R.deg.toFixed(1)} deg; Wrong ${W.px.toFixed(1)} px at ${W.deg.toFixed(1)} deg; circle ${n.o.circle.c} r ${n.o.circle.r}`);
  });
  it('m3: 388db2e4\'s region (neck, shoulder.r, elbow.r, hips) is red on I3', () => {
    const m = withZoom(ibp, (e: any) => ({ ...e, focus: { ...e.focus, region: ['neck', 'shoulder.r', 'elbow.r', 'hips'] } }));
    expect(contentProblems(m).length).toBeGreaterThan(0);
  });
  it('m4: the Wrong arm\'s ghost removed, or the Right arm drawn at 30 deg, is red on I3', () => {
    const noGhost = withZoom(ibp, (e: any) => (e.view === 'mistake' ? { ...e, guides: e.guides.filter((g: any) => g.kind !== 'dashed') } : e));
    expect(contentProblems(noGhost)).toContain('mistake: no ghost of the flared upper arm in the inset');
    // the Right elbow at 30 deg from the torso axis, the upper arm's own length, in the inset's plane (lateral x and the
    // sacrum -> upper back line, the projection's screen axes)
    const { lmE } = inset(ibp, 'normal'), sh = lmE['shoulder.r'], el = lmE['elbow.r'], L1 = Math.hypot(el[0] - sh[0], el[1] - sh[1], el[2] - sh[2]);
    const V = [0, 1, 2].map(i => lmE.backUpper[i] - lmE.sacrum[i]), k = Math.hypot(...V), down = V.map(v => -v / k), a = 30 * Math.PI / 180;
    const at30 = [sh[0] - L1 * Math.sin(a), sh[1] + L1 * Math.cos(a) * down[1]!, sh[2] + L1 * Math.cos(a) * down[2]!];
    expect(contentProblems(ibp, { end: { 'elbow.r': at30 } }).join('; ')).toMatch(/Right upper arm 30\.\d deg/);
  });
});

describe('F-INCLINE-INSET I4: the side view (R5 c1, c3; D-FII-GHOSTUP, D-FII-ARROW, D-FII-LEAD)', { timeout: T }, () => {
  it('I4: no dashed ring; the arrow on both elbows (0.05 px); the shoulder line through the Mistake shoulder, square to the pad; leader ends apart; tells on landmarks', () => {
    expect(sideProblems(ibp)).toEqual([]);
    const e = leaderEnds(ibp), s = leaderEnds(smith);
    console.log(`F-INCLINE-INSET I4: leader ends ${dist(e[0]!, e[1]!).toFixed(1)} px apart (>= ${LEAD_MIN}); smith_machine_bench_press's reference ${dist(s[0]!, s[1]!).toFixed(1)} px`);
  });
  it('m5: RING (2.25 px at the flared elbow) or GHOST_UPPER (the side capsule around the shoulder dot) back is red on I4', () => {
    const { lmM } = sideOf(ibp);
    const ring = withGuides(ibp, [...ibp.mistake.guides, { kind: 'dashed', pts: loop(lmM['elbow.r'], 2.25 / 146.29) }]);
    expect(sideProblems(ring).join('; ')).toMatch(/a joint-sized dashed ring/);
    const upper = withGuides(ibp, [{ kind: 'dashed', pts: capsule(lmM['shoulder.r'], lmM['elbow.r'], 0.052, 0.040) }, ...ibp.mistake.guides]);
    expect(sideProblems(upper)).toContain('a closed dashed loop around the Mistake shoulder dot');
    const short = withGuides(ibp, ibp.mistake.guides.map((g: any) => (g.kind === 'arrow' ? { kind: 'arrow', from: { at: 'elbow.r', pose: 'end', off: [-4, -4] }, to: { at: 'elbow.r', pose: 'mistake', off: [3, 3] } } : g)));
    expect(sideProblems(short)).toEqual(expect.arrayContaining(['the arrow does not start at the correct elbow', 'the arrow does not end at the flared elbow']));
  });
  it('m6: level back on the Mistake shoulder joint with no offset is red on I4', () => {
    const m = withTell(ibp, 'level', (t: any) => ({ ...t, anchor: { at: 'shoulder.r', pose: 'mistake' } }));
    expect(sideProblems(m)).toEqual(expect.arrayContaining(['level is not the Mistake shoulder with an offset', expect.stringMatching(/^leader ends [\d.]+ px apart/)]));
  });
});

describe('F-INCLINE-INSET I5: R7, the 30° value off the bench leader (D-FII-R7, D-FII-BOXES)', { timeout: T }, () => {
  it('I5: no leader enters a label box other than its own (2 px margin) in either view; the arc value is still 30°', () => {
    expect(crossings(ibp)).toEqual([]);
    expect(arcValue(ibp)).toBe('30°');
  });
  it('m7: the measure box back at main\'s {124,262} is red on I5', () => {
    const m = { ...ibp, measure: { ...ibp.measure, box: { left: 124, top: 262 } } }, bad = crossings(m);
    console.log(`F-INCLINE-INSET I5: measure box at main's {124,262}: ${bad.join('; ')}`);
    expect(bad.join('; ')).toMatch(/normal: a leader from \(172\.4,269\.6\) enters the arc box/);
  });
});

describe('F-INCLINE-INSET I7: smith_machine_bench_press stays byte-equal', { timeout: T }, () => {
  // main 2a898c3e's smith spec file and its two zoom outputs (svg, focus, circle, source, link, posture), hashed on main
  const SMITH_SPEC = 'c3f12bb91e43308a1b9f1a6daa21cad070fbfc0de24266d6380407a8297095cf';
  const SMITH_ZOOM = '692c0bc1fdf41b563bd0f8b248b24d1330a84b8fd8ea71616571fcd48a217757';
  const zoomHash = (s: any) => { const h = createHash('sha256');
    for (const z of zoom.zoomList(s.zoom)) { const o = zoom.zoomOf(s, { prefix: 'smith_machine_bench_press.mjs', view: z.view }); h.update(o.svg + JSON.stringify([o.focus, o.circle, o.src, o.link, o.posture ?? null])); }
    return h.digest('hex'); };
  it('I7: smith\'s spec file and both its insets are main\'s bytes', () => {
    expect(createHash('sha256').update(readFileSync(new URL('../../tools/plates/library/specs/smith_machine_bench_press.mjs', import.meta.url))).digest('hex')).toBe(SMITH_SPEC);
    expect(zoomHash(smith)).toBe(SMITH_ZOOM);
  });
  it('m8: one changed value in smith\'s zoom entry is red on I7', () => {
    expect(zoomHash(withZoom(smith, (e: any) => ({ ...e, r: e.r + 1 })))).not.toBe(SMITH_ZOOM);
  });
});

describe('F-INCLINE-INSET D-FII-PINS helpers (f-incline-inset-pins.ts)', { timeout: T }, () => {
  it('the lb02 tail is the two re-pin entries; fiiProblems is clean; reds: the tail cut, another approval, a moved key off its file', async () => {
    const P = await import('./f-incline-inset-pins');
    const file = JSON.parse(readFileSync(new URL('./golden/library/lb02.json', import.meta.url), 'utf8')), m = JSON.parse(readFileSync(new URL('../../tools/plates/library/MANIFEST.json', import.meta.url), 'utf8'));
    expect(P.fiiTailProblems(file)).toEqual([]);
    expect(P.lessFII(file).entries.at(-1).decision).toBe('D-SHIP-W9-LAYERS');   // main's last entry (W9, train 104) under the two re-pin entries
    expect(P.fiiProblems(m)).toEqual([]);
    expect(P.fiiTailProblems({ ...file, entries: file.entries.slice(0, -1) }).length).toBeGreaterThan(0);
    expect(() => P.lessFII({ ...file, entries: [...file.entries.slice(0, -1), { ...file.entries.at(-1), approval: 'x' }] })).toThrow(/F-INCLINE-INSET: last entry/);
    const back = P.restoreFII(structuredClone(m));
    expect(back.rows[P.FII_ID].entry).toBe(P.FII_MAIN_ENTRY);
    expect(P.fiiProblems(back).length).toBe(9);   // 8 rows list the spec key, plus the entry
  });
});
