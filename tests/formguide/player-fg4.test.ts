// FG-4: the ExerciseGuide player wiring (docs/FORM-GUIDE-PRODUCTION.md §6, card FG-4). Node only: the view builder,
// snapshots, load and waapi are pure; the DOM side is the gate's FG-4 block.
import { describe, expect, it, vi } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { THEME_IDS } from '@/theme/themes';
import { themeReader } from '@/formguide/rig/paint';
import { css, frontFrame } from '@/formguide/rig/pose';
import { JOINTS, type Pose } from '@/formguide/rig/joints';
import { VIEWBOXES } from '@/formguide/model';
import { sampleGuide, windowsFor, tempoOf } from '@/formguide/sample';
import { moments } from '@/formguide/check/index';
import { lib_dumbbell_lateral_raise as LR } from '@/formguide/exercises/lib_dumbbell_lateral_raise';
import { REPS, bandOf, cameraOf, chainedGroups, clockOf, frameFn, guideRig, markupOf, momentFrame, momentsOf, textsOf, tintOf } from '@/formguide/player/guideView';
import { SnapshotCache, posedMarkup, resolveVars, snapshotSvg, toDataUri } from '@/formguide/snapshot';
import { lastLoggedKg, loadOf } from '@/formguide/player/load';
import { chainedTiming, mountAnimations, type AnimRoot } from '@/formguide/player/waapi';
import { GUIDE_IDS } from '@/formguide/registry';
import type { ExerciseGuide } from '@/formguide/model';
import type { LoggedSet, Session } from '@/core/models';

const rig = guideRig(LR, 'shoulder_abduction');
const SB = themeReader('silent-black');
const mk = (mistake = false, load: number | null = 9) => markupOf(LR, rig, SB, { id: 't', mistake, load });

describe('FG-4 A1: the three reps as chained keyframe sets', () => {
  const m = mk(), groups = chainedGroups(LR, rig, 'correct', m);
  const byClass = new Map(groups.map(g => [g.className, g.frames]));

  it('one group per animated element the markup draws, offsets 0..1 rising, the last frame the start pose', () => {
    expect(groups.length).toBeGreaterThan(20);
    for (const g of groups) {
      expect(m.includes(`fg-j ${g.className}"`) || m.includes(`fg-p ${g.className}"`)).toBe(true);
      const o = g.frames.map(f => f.offset);
      expect(o[0]).toBe(0); expect(o[o.length - 1]).toBe(1);
      o.forEach((v, i) => { if (i) expect(v).toBeGreaterThan(o[i - 1]!); });
      const [a, z] = [g.frames[0]!, g.frames[g.frames.length - 1]!];
      expect(z.transform ?? z.opacity).toEqual(a.transform ?? a.opacity);
    }
    for (const j of ['shoulder_r', 'shoulder_l', 'elbow_r', 'pelvis', 'knee_r'] as const) expect(byClass.has(`j-${j}`)).toBe(true);
    for (const k of ['t-side_delts_r', 'b-side_delts_l', 't-upper_traps_r', 't-front_delts_l']) expect(byClass.has(`fg-${k}`)).toBe(true);
  });

  it('rep r plays sampleGuide(rep r) at offset (r + u) / 3: the slowed lifts are their own keyframe sets', () => {
    const sh = byClass.get('j-shoulder_r')!;
    for (let r = 0; r < REPS; r++) {
      const s = sampleGuide(LR, 'correct', r);
      for (const i of [10, 60, 100, 150]) {
        const pose: Pose = {};
        for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
        const off = Math.round(((r + s.stops[i]!) / REPS) * 1e4) / 1e4;
        const k = sh.find(f => f.offset === off);
        expect(k?.transform).toBe(css(frontFrame('standing', pose).shoulder_r!.ops!));
      }
    }
    // the same point of rep 1 and rep 3 differs (slowdown 1 → 1.18)
    const at = (off: number) => sh.find(f => Math.abs(f.offset - off) < 1e-4)?.transform ?? sh.reduce((b, f) => (Math.abs(f.offset - off) < Math.abs(b.offset - off) ? f : b)).transform;
    expect(at(0.125 / 3)).not.toBe(at((2 + 0.125) / 3));
  });

  it('dropping flat runs keeps the same picture: the kept frames interpolate to every rep-0 stop exactly', () => {
    const s = sampleGuide(LR, 'correct', 0), fr = frameFn(LR, rig, 'correct', 0, m);
    for (const key of ['b-side_delts_r', 't-upper_traps_l']) {
      const kept = byClass.get(`fg-${key}`)!;
      const at = (off: number) => { let i = 0; while (i < kept.length - 2 && kept[i + 1]!.offset <= off) i++; const a = kept[i]!, b = kept[i + 1]!; return a.opacity! + (b.opacity! - a.opacity!) * Math.min(1, Math.max(0, (off - a.offset) / (b.offset - a.offset))); };
      s.stops.forEach((u, i) => {
        const pose: Pose = {};
        for (const ch of s.channels) pose[ch.id] = ch.stops[i]![1];
        expect(at(Math.round((u / REPS) * 1e4) / 1e4)).toBeCloseTo(fr(pose, u)[key]!.opacity!, 3);
      });
    }
  });

  it('flat runs keep only their ends (the same picture under linear interpolation)', () => {
    const head = byClass.get('j-head')!, raw = 3 * 202 + 1;
    expect(head.length).toBeLessThan(raw);
    head.forEach((f, i) => { if (i > 0 && i < head.length - 1) expect(f.transform === head[i - 1]!.transform && f.transform === head[i + 1]!.transform).toBe(false); });
  });

  it('effort drives the tints: the side-delt band peaks at the top, the traps tint rises in the mistake', () => {
    expect(tintOf(1)).toBe(0.6); expect(tintOf(-1)).toBe(0); expect(bandOf(0.5)).toBe(0); expect(bandOf(1)).toBe(1);
    const band = byClass.get('fg-b-side_delts_r')!, top = band.reduce((b, f) => (f.opacity! > b.opacity! ? f : b));
    expect(top.opacity!).toBeGreaterThan(0.8);
    const w = windowsFor(tempoOf(LR, 'correct', 0), LR.order, LR.kind), lift = w.find(x => x.name === 'lift')!;
    expect(top.offset * REPS % 1).toBeGreaterThanOrEqual(lift.u1 - 0.02);
    const traps = (fig: 'correct' | 'mistake') => Math.max(...chainedGroups(LR, rig, fig, mk(fig === 'mistake')).find(g => g.className === 'fg-t-upper_traps_r')!.frames.map(f => f.opacity!));
    expect(traps('correct')).toBeLessThan(0.2);
    expect(traps('mistake')).toBeGreaterThan(traps('correct') * 2);
  });

  it('the mistake plays its one rep three times on the same 12 s timeline', () => {
    const g = chainedGroups(LR, rig, 'mistake', mk(true)).find(x => x.className === 'j-knee_r')!.frames;
    const at = (off: number) => g.reduce((b, f) => (Math.abs(f.offset - off) < Math.abs(b.offset - off) ? f : b)).transform;
    expect(at(0.03 / 3)).toBe(at((1 + 0.03) / 3));
    expect(chainedTiming(4)).toEqual({ duration: 12000, iterations: 1, easing: 'linear', fill: 'both' });
  });

  it('the rep pill and the caption follow the animation clock; done after 3 reps', () => {
    expect(clockOf(LR, 0)).toEqual({ rep: 1, phase: 'lift', done: false });
    expect(clockOf(LR, 1200).phase).toBe('hold');
    expect(clockOf(LR, 2000).phase).toBe('lower');
    expect(clockOf(LR, 3900).phase).toBe('rest');
    expect(clockOf(LR, 4000 + 1050)).toEqual({ rep: 2, phase: 'lift', done: false });   // rep 2 lifts 1.08 s
    expect(clockOf(LR, 8000 + 1150).phase).toBe('lift');                                // rep 3 lifts 1.18 s
    expect(clockOf(LR, 12000)).toEqual({ rep: 1, phase: 'lift', done: true });
  });

  it('texts: the tempo, the phase captions and the tells come from the file', () => {
    const t = textsOf(LR, 'Dumbbell Lateral Raise');
    expect(t.tempo).toBe('1 s up · 2 s down');
    expect(['lift', 'hold', 'lower', 'rest'].map(p => t.caps(p as 'lift'))).toEqual(['Lift, 1 s', 'Hold, 0.5 s', 'Lower slowly, 2 s', 'Reset, 0.5 s']);
    expect(t.pics).toEqual(['Start', 'Halfway up', 'Top: hold 0.5 s', 'Halfway down']);
    expect(t.tells).toBe('Dip, shrug and drop: The knees dip to swing it up. The shoulders shrug toward the ears. Thumbs turn down at the top.');
    expect(t.sr).toContain('lift for 1 s, hold 0.5 s, lower for 2 s');
  });

  it('compare mode doubles the camera width and puts the mistake one camera to the right', () => {
    expect(cameraOf(LR, false, false)).toEqual({ box: VIEWBOXES.standingFront, dx: 576 });
    expect(cameraOf(LR, false, true).box).toEqual([-88, -6, 1152, 600]);
    expect(cameraOf(LR, true, true)).toEqual({ box: [60, 10, 560, 300], dx: 280 });
  });

  it('two live figures never share gradient ids; the load is the dumbbell label', () => {
    const a = markupOf(LR, rig, SB, { id: 'fgA', mistake: false, load: 9 }), b = markupOf(LR, rig, SB, { id: 'fgM', mistake: true, load: 9 });
    const ids = (s: string) => [...s.matchAll(/ id="([^"]+)"/g)].map(x => x[1]);
    expect(ids(a).filter(i => ids(b).includes(i))).toEqual([]);
    expect(a).toContain('>9</text>');
    expect(markupOf(LR, rig, SB, { id: 'x', mistake: false, load: null })).not.toContain('</text>');
  });
});

describe('FG-4 A5: key moments are token-resolved snapshots, non-blank in all five themes', () => {
  it('the moments are check/index.ts moments', () => {
    expect(momentsOf(LR)).toEqual(moments(windowsFor(tempoOf(LR, 'correct', 0), LR.order, LR.kind)));
    expect(momentsOf(LR, 'mistake')).toEqual(moments(windowsFor(tempoOf(LR, 'mistake', 0), LR.order, LR.kind)));
  });

  it('every theme, both figures, all four moments: no var() left, colours painted, every joint posed', () => {
    const seen = new Set<string>();
    for (const id of THEME_IDS) {
      const read = themeReader(id);
      for (const fig of ['correct', 'mistake'] as const) {
        const m = markupOf(LR, rig, read, { id: 'snap', mistake: fig === 'mistake', load: 9 });
        for (const u of momentsOf(LR, fig)) {
          const svg = snapshotSvg(m, momentFrame(LR, rig, fig, u, m), read, VIEWBOXES[LR.camera.full]);
          expect(svg).not.toContain('var(');
          expect(svg).toMatch(/<path\b[^>]*\sfill="#[0-9a-f]{6}"/);
          expect((svg.match(/<path\b/g) ?? []).length).toBeGreaterThan(100);
          for (const j of JOINTS) expect(svg).toMatch(new RegExp(`class="fg-j j-${j}" style="transform-origin:[^"]+;transform:[^"]+"`));
          expect(toDataUri(svg).startsWith('data:image/svg+xml;charset=utf-8,%3Csvg')).toBe(true);
          seen.add(`${id}:${svg.match(/fill="(#[0-9a-f]{6})"/)![1]}`);
        }
      }
    }
    expect(new Set([...seen].map(s => s.split(':')[1])).size).toBeGreaterThanOrEqual(THEME_IDS.length);
  });

  it('the moments differ: the top is not the start, the mistake is not the correct figure', () => {
    const m = mk(), [u0, , u2] = momentsOf(LR);
    const shot = (fig: 'correct' | 'mistake', u: number, mm = m) => snapshotSvg(mm, momentFrame(LR, rig, fig, u, mm), SB, VIEWBOXES.standingFront);
    expect(shot('correct', u2!)).not.toBe(shot('correct', u0!));
    expect(shot('mistake', momentsOf(LR, 'mistake')[2]!, mk(true))).not.toBe(shot('correct', u2!));
  });

  it('posedMarkup writes transforms into joints and parts and opacity into tints, nothing else', () => {
    const m = '<g class="fg-j j-elbow_r" style="transform-origin:0px 0px"><path class="fg-p fg-t-side_delts_r" d="M0 0Z" fill="var(--target)" opacity="0"/></g><g class="fg-p fg-breath" style="transform-origin:1px 2px"></g>';
    const out = posedMarkup(m, { elbow_r: { ops: [['r', 5]] }, 't-side_delts_r': { opacity: 0.456789 }, breath: { ops: [['s', 1, 2]] } });
    expect(out).toBe('<g class="fg-j j-elbow_r" style="transform-origin:0px 0px;transform:rotate(5deg)"><path class="fg-p fg-t-side_delts_r" d="M0 0Z" fill="var(--target)" opacity="0.4568"/></g><g class="fg-p fg-breath" style="transform-origin:1px 2px;transform:scale(1, 2)"></g>');
  });

  it('resolveVars: the figure root variables, then the tokens; an unresolved name throws', () => {
    expect(resolveVars('<g class="fg-fig" style="--l:#010203;--d:#0a0b0c"><path fill="var(--l)" stroke="var(--target)"/></g>', t => (t === 'target' ? '#ffffff' : ''))).toBe('<g class="fg-fig" style="--l:#010203;--d:#0a0b0c"><path fill="#010203" stroke="#ffffff"/></g>');
    expect(() => resolveVars('<path fill="var(--nope)"/>', () => '#000000')).toThrow(/--nope/);
    expect(() => resolveVars('<path fill="var(--ink)"/>', () => '')).toThrow(/--ink/);
  });

  it('snapshots are cached per theme and regenerated for a new theme', () => {
    const c = new SnapshotCache(), make = vi.fn(() => ['a']);
    c.get('silent-black|correct|full', make); c.get('silent-black|correct|full', make);
    expect(make).toHaveBeenCalledTimes(1);
    c.get('paper|correct|full', make);
    expect(make).toHaveBeenCalledTimes(2);
    expect(c.size).toBe(2);
  });
});

describe('FG-4: load from the last logged set (read only)', () => {
  const set = (kg: number, extra: Partial<LoggedSet> = {}): LoggedSet => ({ kg, reps: 10, ...extra });
  const sess = (day: string, sets: LoggedSet[], id = 'lib_dumbbell_lateral_raise') => ({ id: day, splitId: 'x', splitName: 'x', day, startedAt: '', endedAt: '', durationSec: 0, exercises: [{ exerciseId: id, name: 'Dumbbell Lateral Raise', sets }], logging: {} } as unknown as Session);
  const src = (sessions: Session[], live: LoggedSet[] | null = null) => ({ sessions, customExercises: [], active: live ? { splitId: 'x', startedAt: '', pausedMs: 0, entries: [{ exerciseId: 'lib_dumbbell_lateral_raise', name: 'x', sets: live, done: false, skipped: false }] } : null });

  it('the last working set of the last session; warm-ups and unloaded sets do not count', () => {
    const s = src([sess('2026-09-01', [set(12)]), sess('2026-09-20', [set(8), set(9), set(2, { kind: 'warmup' }), set(0)])]);
    expect(lastLoggedKg(s, 'lib_dumbbell_lateral_raise')).toBe(9);
    expect(lastLoggedKg(src([]), 'lib_dumbbell_lateral_raise')).toBeNull();
  });
  it('a committed set in the live session wins; drafts do not', () => {
    const hist = [sess('2026-09-20', [set(9)])];
    expect(lastLoggedKg(src(hist, [set(11, { status: 'committed' }), set(12.5, { status: 'draft' })]), 'lib_dumbbell_lateral_raise')).toBe(11);
    expect(lastLoggedKg(src(hist, [set(12.5, { status: 'draft' })]), 'lib_dumbbell_lateral_raise')).toBe(9);
    // a set committed before `status` existed has only `at` (session.ts isCommitted)
    expect(lastLoggedKg(src(hist, [set(10.5, { at: '2026-09-28T10:00:00.000Z' })]), 'lib_dumbbell_lateral_raise')).toBe(10.5);
    expect(lastLoggedKg(src(hist, [set(11, { status: 'committed' }), set(3, { status: 'committed', kind: 'warmup' })]), 'lib_dumbbell_lateral_raise')).toBe(11);
  });
  it('loadOf: the kg for the KG-marked dumbbell, the readout in the user unit; bodyweight draws no label', () => {
    const s = src([sess('2026-09-20', [set(9.07)])]);
    expect(loadOf(LR, s, 'kg')).toEqual({ kg: 9.1, text: '9.07 kg' });
    expect(loadOf(LR, s, 'lb')!.text).toBe('20 lb');
    const bw = { ...LR, equipment: { ...LR.equipment, loadFrom: 'bodyweight' } } as ExerciseGuide;
    expect(loadOf(bw, s, 'kg')).toBeNull();
    const fixed = { ...LR, equipment: { ...LR.equipment, loadFrom: 'fixed', kg: 4 } } as ExerciseGuide;
    expect(loadOf(fixed, src([]), 'kg')).toEqual({ kg: 4, text: '4 kg' });
  });
  it('load.ts never writes: no store update, no setter', () => {
    const src = readFileSync('src/formguide/player/load.ts', 'utf8');
    expect(src).not.toMatch(/\bupdate\(|\.value\s*=|setItem|@\/core\/store/);
    expect(src).toContain('isCommitted(x)');
  });
});

describe('FG-4: registry, lazy chunks and the mistake figure joining the clock', () => {
  it('every exercise file is a guided exercise, loaded through import.meta.glob (one chunk per file)', () => {
    const files = readdirSync('src/formguide/exercises').filter(f => f.endsWith('.ts')).map(f => f.replace(/\.ts$/, ''));
    expect(files.length).toBeGreaterThan(0);
    for (const f of files) expect(GUIDE_IDS.has(f)).toBe(true);
    const player = readFileSync('src/formguide/player/FormGuidePlayer.tsx', 'utf8');
    expect(player).toContain("import.meta.glob<Record<string, unknown>>('../exercises/*.ts')");
    expect(player).not.toMatch(/import .* from '\.\.\/exercises\//);
    expect(readFileSync('src/slices/formguide/lazy.tsx', 'utf8')).toContain('loadGuide(() => importPlayer().then(m => m.playerFor(exerciseId)))');
  });

  it('follow() starts a later figure on the first one\'s timeline; seek() moves every animation', () => {
    const made: { currentTime: number | null; startTime: number | null }[] = [];
    const root = (n: number): AnimRoot => ({ querySelectorAll: () => Array.from({ length: n }, () => ({ animate: () => { const a = { currentTime: 0 as number | null, startTime: null as number | null, play() { a.startTime = 500 + 100 * made.indexOf(a); }, pause() {}, cancel() {}, updatePlaybackRate() {} }; made.push(a); return a as unknown as Animation; } })) });
    const g = [{ className: 'x', frames: [{ offset: 0 }, { offset: 1 }] }];
    const h = mountAnimations(g, root(2), 4, chainedTiming(4)), m = mountAnimations(g, root(1), 4, chainedTiming(4));
    h.play(); made[1]!.startTime = 500; h.seek(3000);
    expect(made.slice(0, 2).map(a => a.currentTime)).toEqual([3000, 3000]);
    m.follow(h);
    expect(made[2]!.startTime).toBe(500);          // the first figure's start, not a start of its own (700)
    const q = mountAnimations(g, root(1), 4, chainedTiming(4));
    let ready = () => {};
    const pending = { ...h, startTime: () => null as number | null, currentTime: () => 1234, whenReady: (fn: () => void) => { ready = fn; } };
    q.follow(pending);
    expect(made[3]!.currentTime).toBe(1234);
    pending.startTime = () => 900; ready();
    expect(made[3]!.startTime).toBe(900);           // takes the first figure's start once its pending play lands
  });
});

describe('FG-4: playerFor routes by exercise file', () => {
  it('the lateral raise loads its chunk and plays its ExerciseGuide; the GU-7a guides without a file keep the stub', async () => {
    const mod = await import('@/formguide/player/FormGuidePlayer');
    const { ExercisePlayer } = await import('@/formguide/player/ExercisePlayer');
    const lr = await mod.playerFor('lib_dumbbell_lateral_raise');
    const el = lr.FormGuidePlayer({ exerciseId: 'lib_dumbbell_lateral_raise' });
    expect(el.type).toBe(ExercisePlayer);
    expect(el.props).toMatchObject({ guide: LR, name: 'Dumbbell Lateral Raise', load: null });
    expect((await mod.playerFor('lib_machine_chest_press')).FormGuidePlayer).toBe(mod.FormGuidePlayer);
    expect(mod.fileFor('lib_machine_chest_press')).toBeUndefined();
  });
});
