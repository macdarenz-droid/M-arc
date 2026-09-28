// FG-4: the player for an ExerciseGuide (docs/FORM-GUIDE-PRODUCTION.md §6). GU-7a's chrome, controller and waapi
// handle are kept; the figure is FG-1's, posed by the three reps chained (guideView.ts). Figure markup is mounted through
// innerHTML (built only from constants in the repo, never from user input: R1-9). The mistake figure is mounted only
// while its chip is on. Pictures are token-resolved snapshots, cached per theme and regenerated on a data-theme change.
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'preact/hooks';
import { Button, Chip } from '@/ui/primitives';
import { IconPause, IconPlay } from '@/ui/icons';
import { onReducedChange, reduced } from '@/ui/motion';
import type { ExerciseGuide } from '../model';
import { VIEWBOXES } from '../model';
import { cssReader } from '../rig/paint';
import type { Figure } from '../sample';
import { SnapshotCache, snapshotSvg, toDataUri } from '../snapshot';
import { finish, initial, pickZoom, renderVals, setMode, setReduced, setSpeed, togglePlay, type Fx, type PlayerState, type Step } from './controller';
import { chainedTiming, mountAnimations, type AnimHandle, type AnimRoot } from './waapi';
import { REPS, cameraOf, chainedGroups, clockOf, markupOf, momentFrame, momentsOf, textsOf } from './guideView';
import type { Rig } from '../check/view';

export type ExercisePlayerProps = { guide: ExerciseGuide; rig: Rig; name: string; load: { kg: number; text: string } | null };

const ZoomIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5" /></svg>
);
const ReplayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>
);

const themeNow = () => document.documentElement.getAttribute('data-theme') ?? '';
const ID: Record<Figure, string> = { correct: 'fgA', mistake: 'fgM' };

export function ExercisePlayer({ guide: g, rig, name, load }: ExercisePlayerProps) {
  const T = useMemo(() => textsOf(g, name), [g, name]);
  const repS = useMemo(() => ('lift' in g.tempo ? g.tempo.lift + g.tempo.hold + g.tempo.lower + g.tempo.rest : g.tempo.hold), [g]);
  const groups = useMemo(() => ({} as Partial<Record<Figure, ReturnType<typeof chainedGroups>>>), [g]);
  const cache = useMemo(() => new SnapshotCache(), [g]);
  const [theme, setTheme] = useState(themeNow);
  const [s, setS] = useState<PlayerState>(() => initial(reduced()));
  const [mistake, setMistake] = useState(false);
  const [tick, setTick] = useState<{ rep: number; phase: ReturnType<typeof clockOf>['phase'] }>({ rep: 1, phase: 'lift' });
  const sRef = useRef(s);
  sRef.current = s;
  const rootRef = useRef<HTMLDivElement>(null);
  const figRef = useRef<SVGGElement>(null);
  const misRef = useRef<SVGGElement>(null);
  const anim = useRef<AnimHandle | null>(null);
  const animM = useRef<AnimHandle | null>(null);
  const raf = useRef(0);
  const mistakeRef = useRef(mistake);
  mistakeRef.current = mistake;

  const markup = (fig: Figure) => markupOf(g, rig, cssReader(rootRef.current ?? document.documentElement), { id: ID[fig], mistake: fig === 'mistake', load: load?.kg ?? null });
  const groupsOf = (fig: Figure, m: string) => (groups[fig] ??= chainedGroups(g, rig, fig, m));
  const mountFig = (fig: Figure): AnimHandle | null => {
    const el = fig === 'correct' ? figRef.current : misRef.current;
    if (!el) return null;
    const m = markup(fig);
    el.innerHTML = m;
    if (sRef.current.rm) return null;
    return mountAnimations(groupsOf(fig, m), el as unknown as AnimRoot, repS, chainedTiming(repS, REPS));
  };
  /** Every live figure's handle, the mistake joined to the correct figure's clock. */
  const each = (fn: (h: AnimHandle) => void) => { if (anim.current) fn(anim.current); if (animM.current) fn(animM.current); };

  const loop = () => {
    raf.current = 0;
    const h = anim.current;
    if (!h) return;
    const c = clockOf(g, h.currentTime());
    setTick(t => (t.rep === c.rep && t.phase === c.phase ? t : { rep: c.rep, phase: c.phase }));
    if (c.done) { apply(finish(sRef.current)); return; }
    if (sRef.current.playing) raf.current = requestAnimationFrame(loop);
  };
  const startLoop = () => { if (!raf.current) raf.current = requestAnimationFrame(loop); };
  const stopLoop = () => { if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; } };

  const runFx = (fx: Fx, next: PlayerState) => {
    if (!fx) return;
    if (fx === 'reset') { each(h => h.reset()); stopLoop(); setTick({ rep: 1, phase: 'lift' }); return; }
    if (next.rm) return;
    if (!anim.current) { anim.current = mountFig('correct'); if (mistakeRef.current) animM.current = mountFig('mistake'); }
    if (fx === 'rate') { each(h => h.rate(next.speed)); return; }
    if (fx === 'pause') { each(h => h.pause()); stopLoop(); return; }
    each(h => h.rate(next.speed));
    if (fx === 'replay') { setTick({ rep: 1, phase: 'lift' }); each(h => h.replay()); } else each(h => h.play());
    startLoop();
  };
  const apply = (step: Step) => {
    sRef.current = step.state;
    setS(step.state);
    runFx(step.fx, step.state);
  };
  const drop = () => { stopLoop(); anim.current?.cancel(); anim.current = null; animM.current?.cancel(); animM.current = null; };

  // Mount the figure (again on a theme change: its palette is resolved from the tokens); it sits paused on the setup
  // pose (no animation at all under reduced motion).
  useLayoutEffect(() => {
    drop();
    anim.current = mountFig('correct');
    if (mistakeRef.current) animM.current = mountFig('mistake');
    if (sRef.current.started || sRef.current.ended) apply({ state: { ...sRef.current, playing: false, started: false, ended: false }, fx: 'reset' });
  }, [theme]);

  useEffect(() => {
    const off = onReducedChange(r => apply(setReduced(sRef.current, r)));
    const onVisibility = () => { if (document.hidden) stopLoop(); else if (sRef.current.playing) startLoop(); };
    document.addEventListener('visibilitychange', onVisibility);
    const mo = new MutationObserver(() => setTheme(themeNow()));
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => { off(); mo.disconnect(); document.removeEventListener('visibilitychange', onVisibility); drop(); };
  }, []);

  // The mistake figure exists only while its chip is on; it joins the correct figure's clock, speed and play state.
  const toggleMistake = () => {
    const on = !mistake;
    setMistake(on);
    mistakeRef.current = on;
    if (!on) { animM.current?.cancel(); animM.current = null; if (misRef.current) misRef.current.innerHTML = ''; return; }
  };
  useLayoutEffect(() => {
    if (!mistake || animM.current || (misRef.current && misRef.current.firstChild)) return;
    animM.current = mountFig('mistake');
    const h = anim.current, m = animM.current;
    if (h && m) { m.rate(sRef.current.speed); if (sRef.current.playing) m.follow(h); else m.seek(h.currentTime()); }
  }, [mistake]);

  const v = renderVals(s);
  const zoom = v.zoom === 1;
  const compare = mistake && v.showStage;
  const cam = cameraOf(g, zoom, compare);
  const still = v.showStill1;
  const fig: Figure = mistake ? 'mistake' : 'correct';
  // Pictures: the four moments of the figure shown, as images resolved in the current theme (cached per theme).
  const shots = (box: 'full' | 'zoom', only?: number): string[] => cache.get(`${theme}|${fig}|${box}${only ?? ''}`, () => {
    const read = cssReader(rootRef.current ?? document.documentElement), m = markupOf(g, rig, read, { id: 'snap', mistake: fig === 'mistake', load: load?.kg ?? null });
    const us = momentsOf(g, fig), vb = VIEWBOXES[box === 'zoom' ? g.camera.zoom : g.camera.full];
    return (only == null ? us : [us[only]!]).map(u => toDataUri(snapshotSvg(m, momentFrame(g, rig, fig, u, m), read, vb)));
  });
  const tiles = v.showPics ? shots('full') : null;
  const stillSrc = still ? shots('zoom', 0)[0] : null;

  const bubble = s.bubble?.kind === 'zoom' ? T.cue : null;
  const load_ = load ? ` · ${load.text}` : '';

  return (
    <div class="form-guide" ref={rootRef}>
      <div class={v.rootClass}>
        <div class="stage">
          <svg class="scene fg4-scene" viewBox={cam.box.join(' ')} preserveAspectRatio="xMidYMid meet" aria-hidden="true" hidden={!(v.showStage && !still)}>
            <g ref={figRef} />
            <g ref={misRef} transform={`translate(${cam.dx} 0)`} />
          </svg>
          {stillSrc && <img class="fg4-still" src={stillSrc} alt="" />}
          {v.showPills && (
            <div class="pill-row">
              <span class="pill">Rep {tick.rep} of 3</span>
              {v.showSlow && <span class="pill pill-accent">Slow motion</span>}
            </div>
          )}
          {v.showCamLabel && v.showStage && <div class="cam-label">Front view{load_}</div>}
          {compare && !bubble && (
            <div class="fg4-key"><span>Right way</span><span class="fg4-key-m">Mistake</span></div>
          )}
          {tiles && (
            <div class="pics">
              {tiles.map((src, i) => (
                <div class="tile" key={i}>
                  <img src={src} alt="" />
                  <span class="badge">{i + 1}</span>
                  <p>{mistake ? `Mistake: ${T.pics[i]}` : T.pics[i]}</p>
                </div>
              ))}
            </div>
          )}
          {bubble && (
            <div class="bubble" role="status">
              <span class="dot" style={{ background: 'var(--accent)' }} />
              <span class="bt"><span>{bubble}</span></span>
            </div>
          )}
        </div>
        <div class="cap-row">
          <span class="cap" aria-live="polite">
            {v.showIdle && 'Tap Play to watch 3 slow reps.'}
            {v.showEnded && 'Done. Tap Replay to watch again.'}
            {v.showCaps && T.caps(tick.phase)}
            {still && T.pics[0]}
            {v.showPicsLine && T.picsLine}
          </span>
          {v.showTempo && <span class="tempo">{T.tempo}</span>}
        </div>
        <div class="chips">
          <Chip pressed={v.zoomPressed[0]} onClick={() => apply(pickZoom(sRef.current, 1))}><ZoomIcon />Zoom</Chip>
          <Chip pressed={mistake} onClick={toggleMistake}>Mistake</Chip>
        </div>
        <div class="controls">
          <Button variant="primary" class="btn-icon" aria-label={v.playLabel} disabled={v.playDisabled} onClick={() => apply(togglePlay(sRef.current))}>
            {v.isPause ? <IconPause /> : v.isReplay ? <ReplayIcon /> : <IconPlay />}
          </Button>
          <div class="seg speed">
            <button type="button" aria-pressed={v.speed1} onClick={() => apply(setSpeed(sRef.current, 1))}>1x</button>
            <button type="button" aria-pressed={v.speedHalf} onClick={() => apply(setSpeed(sRef.current, 0.5))}>0.5x</button>
          </div>
          <span class="grow" />
          <div class="seg mode">
            <button type="button" aria-pressed={v.modeAnim} disabled={v.animDisabled} onClick={() => apply(setMode(sRef.current, 'anim'))}>Animation</button>
            <button type="button" aria-pressed={v.modePics} onClick={() => apply(setMode(sRef.current, 'pics'))}>Pictures</button>
          </div>
        </div>
        <p class="hint">
          {mistake ? T.tells : <>
            {v.hintAnim && 'Tap Zoom to look closer. Tap Mistake to compare.'}
            {v.hintPics && 'Four key moments of one rep.'}
            {v.hintRm && 'Pictures shown because your phone is set to reduce motion.'}
          </>}
        </p>
        <p class="sr-only">{T.sr}</p>
      </div>
    </div>
  );
}
