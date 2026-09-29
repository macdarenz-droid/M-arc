import { describe, it, expect, vi, afterEach } from 'vitest';
import { existsSync, readFileSync } from 'node:fs';
import { clock, finish, initial, isActivateKey, pickZoom, renderVals, setMode, setReduced, setSpeed, tapMuscle, tapStage, togglePlay, type PlayerState } from '@/formguide/player/controller';
import { mountAnimations, timingFor, type AnimRoot } from '@/formguide/player/waapi';
import { muscleInfo, stubGuide } from '@/formguide/player/stubGuide';
import { GUIDE_IDS, hasGuide } from '@/formguide/registry';

/** GU-7a-2. Node only (no DOM library in this repo): the controller is pure, and mountAnimations
 * gets a fake root whose elements record every animate() call and every playback call. */
type Call = { el: string; op: string; arg?: unknown };
function fakeRoot(classes: Record<string, number>) {
  const calls: Call[] = [];
  const animated: { el: string; frames: unknown; timing: KeyframeAnimationOptions }[] = [];
  const root: AnimRoot = {
    querySelectorAll(sel: string) {
      const name = sel.replace(/^\./, '');
      return Array.from({ length: classes[name] ?? 0 }, (_, i) => {
        const el = `${name}#${i}`;
        return {
          animate(frames: unknown, timing: KeyframeAnimationOptions) {
            animated.push({ el, frames, timing });
            let t = 0;
            return {
              play: () => calls.push({ el, op: 'play' }),
              pause: () => calls.push({ el, op: 'pause' }),
              cancel: () => calls.push({ el, op: 'cancel' }),
              updatePlaybackRate: (r: number) => calls.push({ el, op: 'rate', arg: r }),
              get currentTime() { return t; },
              set currentTime(v) { t = Number(v); calls.push({ el, op: 'seek', arg: v }); },
            } as unknown as Animation;
          },
        };
      });
    },
  };
  return { root, calls, animated };
}

const run = (s: PlayerState, ...fns: ((s: PlayerState) => { state: PlayerState })[]) => fns.reduce((acc, f) => f(acc).state, s);

describe('GU-7a-2 A4: playback', () => {
  it('animates every element of every group class, 3 reps of the rep length, linear, fill both, created paused', () => {
    const { root, calls, animated } = fakeRoot({ 'st-arm': 2, 'st-eff': 1 });
    const h = mountAnimations(stubGuide.sample().groups, root, 4);
    expect(animated.map(a => a.el)).toEqual(['st-arm#0', 'st-arm#1', 'st-eff#0']);
    for (const a of animated) expect(a.timing).toEqual({ duration: 4000, iterations: 3, easing: 'linear', fill: 'both' });
    expect(animated[0]!.frames).toBe(stubGuide.sample().groups[0]!.frames);
    expect(calls).toEqual(animated.map(a => ({ el: a.el, op: 'pause' })));
    expect(h.count).toBe(3);
    expect(timingFor(4).iterations).toBe(3);
  });

  it('Play, Pause, 0.5x, Replay and close reach every animation', () => {
    const { root, calls } = fakeRoot({ 'st-arm': 1, 'st-eff': 1 });
    const h = mountAnimations(stubGuide.sample().groups, root, 4);
    calls.length = 0;
    h.play(); h.pause(); h.rate(0.5); h.replay(); h.cancel();
    expect(calls.map(c => `${c.el} ${c.op}${c.arg != null ? ` ${c.arg}` : ''}`)).toEqual([
      'st-arm#0 play', 'st-eff#0 play',
      'st-arm#0 pause', 'st-eff#0 pause',
      'st-arm#0 rate 0.5', 'st-eff#0 rate 0.5',
      'st-arm#0 seek 0', 'st-arm#0 play', 'st-eff#0 seek 0', 'st-eff#0 play',
      'st-arm#0 cancel', 'st-eff#0 cancel',
    ]);
    expect(h.count).toBe(0);
  });

  it('the controller: Play runs, Pause freezes, the 3 reps end on Replay, Replay restarts', () => {
    let s = initial(false);
    expect(renderVals(s).playLabel).toBe('Play');
    let step = togglePlay(s); s = step.state;
    expect(step.fx).toBe('play');
    expect(renderVals(s)).toMatchObject({ playLabel: 'Pause', showCaps: true, showIdle: false });
    step = togglePlay(s); s = step.state;
    expect(step.fx).toBe('pause');
    expect(s.playing).toBe(false);
    s = run(s, togglePlay, finish);
    expect(renderVals(s)).toMatchObject({ playLabel: 'Replay', isReplay: true, showEnded: true, showCaps: false });
    step = togglePlay(s);
    expect(step.fx).toBe('replay');
    expect(step.state).toMatchObject({ playing: true, ended: false });
  });

  it('the clock: 3 reps of 4 s in animation time (8 s each at 0.5x), then done on the start pose', () => {
    expect(clock(0, 4)).toEqual({ rep: 1, phase: 0, done: false });
    expect(clock(1000, 4).phase).toBe(1);
    expect(clock(1500, 4).phase).toBe(2);
    expect(clock(3500, 4).phase).toBe(3);
    expect(clock(4000, 4)).toEqual({ rep: 2, phase: 0, done: false });
    expect(clock(11999, 4)).toMatchObject({ rep: 3, done: false });
    expect(clock(12000, 4)).toEqual({ rep: 1, phase: 0, done: true });
    // Web Animations keep currentTime in animation time: at playbackRate 0.5 one 4000 ms rep takes 8 s of wall time.
    expect(timingFor(4).duration as number / 0.5).toBe(8000);
  });

  it('a speed change keeps the phase and the play state (R1-13), and the 0.5x pill shows', () => {
    const s = run(initial(false), togglePlay);
    const step = setSpeed(s, 0.5);
    expect(step.fx).toBe('rate');
    expect(step.state).toMatchObject({ playing: true, started: true, speed: 0.5 });
    expect(renderVals(step.state).showSlow).toBe(true);
    expect(setSpeed(step.state, 0.5).fx).toBeNull();
  });
});

describe('GU-7a-2 A6: Pictures and reduced motion', () => {
  it('Pictures shows the grid, the pictures line and its hint; a zoom there shows still 1 (still 3 for Path)', () => {
    const step = setMode(run(initial(false), togglePlay), 'pics');
    expect(step.fx).toBe('reset');
    const v = renderVals(step.state);
    expect(v).toMatchObject({ showPics: true, showStage: false, showPicsLine: true, showTempo: false, hintPics: true, rootClass: 'player pictures' });
    expect(renderVals(pickZoom(step.state, 1).state)).toMatchObject({ showStill1: true, showStill3: false, showPics: false, showStage: true, rootClass: 'player zoom-1 pictures' });
    expect(renderVals(pickZoom(step.state, 2).state)).toMatchObject({ showStill1: false, showStill3: true });
  });

  it('the stub has the 4 demo tiles with their captions', () => {
    const tiles = stubGuide.stage('dark').tiles;
    expect(tiles.match(/<div class="tile">/g)).toHaveLength(4);
    for (const p of stubGuide.spec.pics) expect(tiles).toContain(`<p>${p}</p>`);
    expect(tiles).not.toContain('<use');
  });

  it('reduced motion: Pictures only, Play and Animation disabled, and the hint names the reason', () => {
    const s = initial(true);
    expect(renderVals(s)).toMatchObject({ modePics: true, playDisabled: true, animDisabled: true, hintRm: true, hintPics: false });
    expect(togglePlay(s)).toEqual({ state: s, fx: null });
    expect(setMode(s, 'anim')).toEqual({ state: s, fx: null });
  });

  it('reduced motion switched on while playing stops everything and shows Pictures', () => {
    const step = setReduced(run(initial(false), togglePlay), true);
    expect(step.fx).toBe('reset');
    expect(step.state).toMatchObject({ rm: true, mode: 'pics', playing: false });
  });
});

describe('GU-7a-2 A13: muscle info on tap (interaction)', () => {
  it('a tap opens the muscle bubble with its outline; the same muscle, or the stage, closes it', () => {
    let s = run(initial(false), togglePlay);
    s = tapMuscle(s, 'chest').state;
    expect(s.bubble).toEqual({ kind: 'muscle', id: 'chest' });
    expect(renderVals(s)).toMatchObject({ selMuscle: 'chest', showPills: true, showCamLabel: true, isPause: true });
    expect(tapMuscle(s, 'chest').state.bubble).toBeNull();
    expect(tapStage(s).state.bubble).toBeNull();
    expect(tapMuscle(s, 'triceps').state.bubble).toEqual({ kind: 'muscle', id: 'triceps' });
  });

  it('a zoom chip and a muscle bubble never show together; a second chip tap closes', () => {
    let s = tapMuscle(initial(false), 'chest').state;
    s = pickZoom(s, 1).state;
    expect(s.bubble).toEqual({ kind: 'zoom', id: 1 });
    expect(renderVals(s)).toMatchObject({ zoom: 1, rootClass: 'player zoom-1', zoomPressed: [true, false, false], selMuscle: null, showPills: false, showCamLabel: false });
    expect(tapStage(s).state).toBe(s);
    s = tapMuscle(s, 'front_delts').state;
    expect(s.bubble).toEqual({ kind: 'muscle', id: 'front_delts' });
    expect(renderVals(s).zoom).toBe(0);
    s = pickZoom(pickZoom(s, 2).state, 2).state;
    expect(s.bubble).toBeNull();
    expect(renderVals(s)).toMatchObject({ zoom: 0, rootClass: 'player' });
    // Round 3: the state has no separate zoom field; the one bubble is the only source.
    expect(Object.keys(initial(false)).sort()).toEqual(['bubble', 'ended', 'mode', 'playing', 'rm', 'speed', 'started']);
  });

  it('Enter, Space and "Spacebar" open a focused hotspot; other keys do not (the demo keyMuscle)', () => {
    expect(['Enter', ' ', 'Spacebar'].map(isActivateKey)).toEqual([true, true, true]);
    expect(['Tab', 'a', 'Escape'].map(isActivateKey)).toEqual([false, false, false]);
  });

  it('Pictures has no hotspots: a tap there changes nothing', () => {
    const s = setMode(initial(false), 'pics').state;
    expect(tapMuscle(s, 'chest').state).toBe(s);
  });

  it('the stub stage has one R1-15 hotspot per role, labelled from spec 2.10', () => {
    const svg = stubGuide.stage('dark').svg;
    const hots = [...svg.matchAll(/<polygon class="hot" data-muscle="(\w+)" role="button" tabindex="0" aria-label="([^"]+)" points="[^"]+" style="fill:transparent;stroke:transparent;stroke-width:30px;pointer-events:all;vector-effect:non-scaling-stroke"\/>/g)];
    expect(hots.map(h => h[1]).sort()).toEqual(Object.values(stubGuide.spec.roles).sort());
    expect(hots.map(h => h[2])).toEqual(['Chest, target muscle', 'Front delts, helps', 'Triceps, helps']);
    // Round 3 (D-R7): a stroke-less core per region, and the painted regions tagged for the .sel outline.
    const cores = [...svg.matchAll(/<polygon class="hot hot-core" data-muscle="(\w+)" points="[^"]+" style="fill:transparent;stroke:none;pointer-events:all"\/>/g)];
    expect(cores.map(c => c[1]).sort()).toEqual(Object.values(stubGuide.spec.roles).sort());
    expect([...svg.matchAll(/<polygon class="(mm|mh)" data-muscle="(\w+)"/g)].map(m => `${m[1]} ${m[2]}`)).toEqual(['mm chest', 'mh front_delts', 'mh triceps']);
    expect(muscleInfo('lib_machine_chest_press').map(m => `${m.common} (${m.anatomical}), ${m.role}. ${m.line}`)).toEqual([
      'Chest (pectoralis major), target. Pushes the handles away; hardest as the arms straighten.',
      'Front delts (anterior deltoid), helps. Lifts the upper arms forward with the chest.',
      'Triceps (triceps brachii), helps. Straightens the elbows at the end of the press.',
    ]);
    expect(muscleInfo('lib_lat_pulldown')).toEqual([]);
  });
});

describe('GU-7a-2 A9: a failed chunk load', () => {
  afterEach(() => vi.unstubAllGlobals());
  it('loadGuide resolves { ok: false } on a rejecting importer, never rejects, and takes no onClose', async () => {
    vi.stubGlobal('location', { reload: vi.fn() });
    const { loadGuide } = await import('@/slices/formguide/lazy');
    expect(loadGuide.length).toBe(1);
    await expect(loadGuide(() => Promise.reject(new Error('Failed to fetch dynamically imported module')))).resolves.toEqual({ ok: false });
    await expect(loadGuide(() => Promise.resolve({}))).resolves.toEqual({ ok: false });
    const Comp = () => null;
    await expect(loadGuide(() => Promise.resolve({ FormGuidePlayer: Comp }))).resolves.toEqual({ ok: true, Comp });
  });

  it('the sheet never calls onClose itself and shows the one-line failure with Reload', () => {
    const src = readFileSync('src/slices/formguide/lazy.tsx', 'utf8');
    expect(src).not.toMatch(/onClose\s*\(|onClose\?\.\(/); // handed to <Sheet> only, never called
    expect(src).toContain('<Sheet title={`How to do it: ${name}`} onClose={onClose}>');
    expect(src).toContain('<p class="hint">Demo could not load.</p>');
    expect(src).toContain('<Button onClick={() => location.reload()}>Reload</Button>');
  });
});

describe('GU-7a-2 A8: the "How to do it" row', () => {
  it('registry.ts has no imports and names exactly the 2 guides (V1-00: the lat pulldown is off until its file passes)', () => {
    expect(readFileSync('src/formguide/registry.ts', 'utf8')).not.toMatch(/^\s*import\b/m);
    expect([...GUIDE_IDS].sort()).toEqual(['lib_dumbbell_lateral_raise', 'lib_machine_chest_press']);
    expect(hasGuide('lib_barbell_bench_press')).toBe(false);
    expect(hasGuide('lib_lat_pulldown')).toBe(false);
  });

  it('every GUIDE_IDS id has an exercise file or is the stub\'s id (V1-00 A2)', () => {
    const orphans = [...GUIDE_IDS].filter(id => !existsSync(`src/formguide/exercises/${id}.ts`) && id !== stubGuide.spec.exerciseId);
    expect(orphans).toEqual([]);
  });

  it('Train.tsx imports only hasGuide and FormGuideSheet, and the row sits before Substitute for guided exercises only', () => {
    const src = readFileSync('src/slices/workout/Train.tsx', 'utf8');
    expect(src.match(/^import .*formguide.*$/gm)).toEqual([
      "import { FormGuideSheet } from '@/slices/formguide/lazy';",
      "import { hasGuide } from '@/formguide/registry';",
    ]);
    const row = "{ex && hasGuide(ex.id) && <Button variant=\"quiet\" onClick={() => { closeMenu(); setGuideOpen(true); }}>How to do it</Button>}";
    const at = src.indexOf(row);
    expect(at).toBeGreaterThan(-1);
    expect(src.indexOf('>Substitute exercise</Button>')).toBeGreaterThan(at);
  });
});

describe('GU-7a-2 review of 25b05f6', () => {
  it('api.ts is the 7.2 block byte for byte (it ends with the blank line the block carries)', () => {
    expect(readFileSync('src/formguide/rig/api.ts', 'utf8').endsWith('7a-4 switches the import.\n\n')).toBe(true);
  });
  it('5.12: the phase caption line is an aria-live="polite" region', () => {
    expect(readFileSync('src/formguide/player/FormGuidePlayer.tsx', 'utf8')).toContain('<span class="cap" aria-live="polite">');
  });
});
