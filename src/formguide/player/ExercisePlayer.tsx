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
import { guideDrive, guideStops, layerFor, layerGroups, layerMarkup, setupSvgs, standInDrive } from './machineView';
import { FrameLog, longPress, statsLine, type FrameStats } from './fps';
import { angleLabel, effortRows, fmtDeg, fmtPct, fmtSpeed, phaseBar, readouts } from './readouts';
import { guideMarkup, guidePlan, guideScales } from './guides';
import { hotRadius, hotspotsFor, muscleBubble, sizeHotspots, withHotspots } from './hotspots';
import { isActivateKey, tapMuscle, tapStage } from './controller';
import { MUSCLE_BY_ID, type MuscleId } from '@/data/muscles';

export type ExercisePlayerProps = { guide: ExerciseGuide; rig: Rig; name: string; load: { kg: number; text: string } | null };

const ZoomIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5" /></svg>
);
const ReplayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>
);

/** V1-09: the frame-rate panel a long-press on the stage opens (DC0): the last play's frame times and the Stress toggle.
 * Pure, so it is tested without a DOM; it holds nothing and stores nothing. */
export function FpsPanel({ open, stats, stress, onStress, onClose }: { open: boolean; stats: FrameStats | null; stress: boolean; onStress: () => void; onClose: () => void }) {
  if (!open) return null;
  return (
    <div class="fg9-panel" role="dialog" aria-label="Frame rate">
      <p class="fg9-stats">{statsLine(stats)}</p>
      <div class="fg9-row">
        <Chip pressed={stress} onClick={onStress}>Stress</Chip>
        <Button variant="quiet" size="sm" onClick={onClose}>Close</Button>
      </div>
      {stress && <p class="fg9-note">A stand-in machine plays behind the figure in compare mode (tap Mistake).</p>}
    </div>
  );
}

/** V1-19: the readout row (§1): the working joint's angle, hand speed, load, effort per muscle and the phase bar. The
 * numbers are written by the player's frame loop (paintReadouts), not by a render per frame. */
function Readouts({ g, load, rep, set }: { g: ExerciseGuide; load: string | null; rep: number; set: (el: HTMLDivElement | null) => void }) {
  const label = useMemo(() => angleLabel(g), [g]);
  return (
    <div class="fg19-ro" ref={set} aria-hidden="true">
      <div class="fg19-tiles">
        {label && <div><b>{label}</b><span class="fg19-v" data-k="angle">0°</span></div>}
        <div><b>Speed</b><span class="fg19-v" data-k="speed">0.0 m/s</span></div>
        {load && <div><b>Load</b><span class="fg19-v">{load}</span></div>}
      </div>
      {effortRows(g).map(r => (
        <div class={`fg19-bar fg19-${r.role}`} key={r.id}><b>{MUSCLE_BY_ID[r.id]?.common ?? r.id}</b><i><i data-m={r.id} /></i><span data-p={r.id}>0%</span></div>
      ))}
      <div class="fg19-phases">
        {phaseBar(g, 'correct', rep - 1).map(p => <span key={p.name} style={{ flex: p.frac }}>{p.name === 'lower' ? 'Lower' : p.name[0]!.toUpperCase() + p.name.slice(1)}</span>)}
        <i class="fg19-now" />
      </div>
    </div>
  );
}

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
  const svgRef = useRef<SVGSVGElement>(null);
  /** V1-19: every hotspot HOT_PX across at the scene's drawn scale (preserveAspectRatio meet: the smaller axis), and the
   * tag at its camera's scale. */
  const sizeHot = () => {
    const sv = svgRef.current, el = figRef.current;
    if (!sv || !el) return;
    const b = sv.viewBox.baseVal, r = sv.getBoundingClientRect(), px = Math.min(r.width / (b.width || 1), r.height / (b.height || 1));
    if (!(px > 0)) return;
    sizeHotspots(el, hotRadius(px));
    if (!plan) return;
    const k = guideScales(px, renderVals(sRef.current).zoom === 1 ? plan.k.zoom : plan.k.full);
    el.querySelector('.fg19-tag-k')?.setAttribute('transform', `scale(${k.tag})`);
    el.querySelector('.fg19-arc-k')?.setAttribute('transform', `scale(${k.arc})`);
  };
  const misRef = useRef<SVGGElement>(null);
  const anim = useRef<AnimHandle | null>(null);
  const animM = useRef<AnimHandle | null>(null);
  const raf = useRef(0);
  const mistakeRef = useRef(mistake);
  mistakeRef.current = mistake;
  // V1-09: the machine layer (a machine file's machine, or the stand-in under Stress in compare mode), the frame log of
  // the last play and the long-press panel. Held in memory only.
  const macRef = useRef<SVGGElement>(null);
  const animL = useRef<AnimHandle | null>(null);
  const [stress, setStress] = useState(false);
  const [panel, setPanel] = useState(false);
  const [stats, setStats] = useState<FrameStats | null>(null);
  const log = useMemo(() => new FrameLog(), []);
  const press = useMemo(() => longPress(() => { setStats(log.stats()); setPanel(true); }), []);
  const layerOn = useRef({ stress: false, compare: false });
  // V1-19: the correct figure's readouts, guides (arc, tag, hand path) and muscle hotspots (§1). The guides ride the
  // figure's own animation handle; the numbers are painted from its clock on each frame, never by a render.
  const ro = useMemo(() => readouts(g, rig), [g, rig]);
  const plan = useMemo(() => guidePlan(g, rig), [g, rig]);
  const roEl = useRef<HTMLDivElement | null>(null);
  const paintReadouts = (ms: number) => {
    const el = roEl.current, fig = figRef.current;
    if (!el) return;
    const r = ro('correct', ms), set = (sel: string, t: string) => { const x = el.querySelector(sel); if (x && x.textContent !== t) x.textContent = t; };
    if (r.angle) { set('[data-k="angle"]', fmtDeg(r.angle.deg)); const t = fig?.querySelector('.fg19-tag-t'); if (t) t.textContent = fmtDeg(r.angle.deg); }
    set('[data-k="speed"]', fmtSpeed(r.speed));
    for (const e of r.effort) {
      (el.querySelector(`[data-m="${e.id}"]`) as HTMLElement | null)?.style.setProperty('transform', `scaleX(${Math.min(1, Math.max(0, e.v)).toFixed(3)})`);
      set(`[data-p="${e.id}"]`, fmtPct(e.v));
    }
    (el.querySelector('.fg19-now') as HTMLElement | null)?.style.setProperty('transform', `scaleX(${r.u.toFixed(4)})`);
  };

  const markup = (fig: Figure) => markupOf(g, rig, cssReader(rootRef.current ?? document.documentElement), { id: ID[fig], mistake: fig === 'mistake', load: load?.kg ?? null });
  const groupsOf = (fig: Figure, m: string) => (groups[fig] ??= chainedGroups(g, rig, fig, m));
  const mountFig = (fig: Figure): AnimHandle | null => {
    const el = fig === 'correct' ? figRef.current : misRef.current;
    if (!el) return null;
    const m = markup(fig), v19 = fig === 'correct';
    el.innerHTML = v19 ? withHotspots(m, hotspotsFor(g, m)) + (plan ? guideMarkup(plan) : '') : m;
    if (v19) { sizeHot(); paintReadouts(0); }
    if (sRef.current.rm) return null;
    return mountAnimations(v19 && plan ? [...groupsOf(fig, m), ...plan.groups] : groupsOf(fig, m), el as unknown as AnimRoot, repS, chainedTiming(repS, REPS));
  };
  /** Every live figure's handle, the mistake joined to the correct figure's clock. */
  const each = (fn: (h: AnimHandle) => void) => { if (anim.current) fn(anim.current); if (animM.current) fn(animM.current); if (animL.current) fn(animL.current); };
  /** The machine layer, on the correct figure's clock (none for a free-weight file unless Stress is on in compare). */
  const mountLayer = () => {
    animL.current?.cancel(); animL.current = null;
    const el = macRef.current;
    if (!el) return;
    const L = layerFor(g, layerOn.current);
    el.innerHTML = L ? layerMarkup(L.art, { kg: load?.kg ?? 0, settings: g.machine?.settings }) : '';
    if (!L || sRef.current.rm) return;
    const drive = L.standIn ? standInDrive(g, rig, 'correct') : guideDrive(g, 'correct');
    const h = mountAnimations(layerGroups(L.art, guideStops(g, 'correct'), drive, REPS), el as unknown as AnimRoot, repS, chainedTiming(repS, REPS));
    animL.current = h;
    const c = anim.current;
    if (c) { h.rate(sRef.current.speed); if (sRef.current.playing) h.follow(c); else h.seek(c.currentTime()); }
  };

  const loop = (t: number) => {
    raf.current = 0;
    const h = anim.current;
    if (!h) return;
    log.tick(t);
    paintReadouts(h.currentTime());
    const c = clockOf(g, h.currentTime());
    setTick(t => (t.rep === c.rep && t.phase === c.phase ? t : { rep: c.rep, phase: c.phase }));
    if (c.done) { setStats(log.stats()); apply(finish(sRef.current)); return; }
    if (sRef.current.playing) raf.current = requestAnimationFrame(loop);
  };
  const startLoop = () => { if (!raf.current) raf.current = requestAnimationFrame(loop); };
  const stopLoop = () => { if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; } };

  const runFx = (fx: Fx, next: PlayerState) => {
    if (!fx) return;
    if (fx === 'reset') { each(h => h.reset()); stopLoop(); setTick({ rep: 1, phase: 'lift' }); paintReadouts(0); return; }
    if (next.rm) return;
    if (!anim.current) { anim.current = mountFig('correct'); if (mistakeRef.current) animM.current = mountFig('mistake'); mountLayer(); }
    if (fx === 'rate') { each(h => h.rate(next.speed)); return; }
    if (fx === 'pause') { each(h => h.pause()); stopLoop(); log.gap(); paintReadouts(anim.current?.currentTime() ?? 0); return; }
    if (fx === 'replay' || anim.current?.currentTime() === 0) log.start(); else log.gap();
    each(h => h.rate(next.speed));
    if (fx === 'replay') { setTick({ rep: 1, phase: 'lift' }); each(h => h.replay()); } else each(h => h.play());
    startLoop();
  };
  const apply = (step: Step) => {
    sRef.current = step.state;
    setS(step.state);
    runFx(step.fx, step.state);
  };
  const drop = () => { stopLoop(); anim.current?.cancel(); anim.current = null; animM.current?.cancel(); animM.current = null; animL.current?.cancel(); animL.current = null; };

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
  layerOn.current = { stress, compare };
  // Mounted after the figures (declared after their effect), again on a theme change or when Stress or compare flips.
  useLayoutEffect(() => mountLayer(), [theme, stress, compare]);
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
  // V1-09: the setup moment of a machine file (right, and the mistake's wrong setting), before rep 1 and in Pictures.
  const art = g.machine ? layerFor(g, { stress: false, compare: false })!.art : null;
  const setup = art && (v.showPics || v.showIdle) ? cache.get(`${theme}|setup`, () => {
    const read = cssReader(rootRef.current ?? document.documentElement), m = markupOf(g, rig, read, { id: 'snap', mistake: false, load: load?.kg ?? null });
    return setupSvgs(g, art, { markup: m, frame: momentFrame(g, rig, 'correct', 0, m) }, read, VIEWBOXES[g.camera.full], load?.kg ?? 0).map(x => toDataUri(x.svg));
  }) : null;
  const setupText = (i: number) => (i ? `Wrong setup: ${g.mistake.setup?.text ?? ''}` : 'Setup');
  const stillSrc = still ? shots('zoom', 0)[0] : null;

  // V1-19: one bubble (controller.ts): the zoom tip, or a tapped muscle's line with its tint colour.
  const mb = s.bubble?.kind === 'muscle' ? muscleBubble(g, s.bubble.id) : null;
  const bubble = s.bubble?.kind === 'zoom' ? T.cue : mb ? mb.rest : null;
  const load_ = load ? ` · ${load.text}` : '';

  // V1-19: a hotspot opens its muscle (closing a zoom tip); a tap on the bubble keeps it; anywhere else closes a muscle
  // bubble (GU-7a's stage rule). The selected muscle's outline shows; the hotspots are sized to the drawn scale.
  const onStage = (e: Event) => {
    const t = e.target as Element | null, id = t?.closest?.('.fg19-hot')?.getAttribute('data-muscle') as MuscleId | null | undefined;
    if (id) { apply(tapMuscle(sRef.current, id)); return; }
    if (t?.closest?.('.bubble, .fg9-panel')) return;
    apply(tapStage(sRef.current));
  };
  const onStageKey = (e: KeyboardEvent) => {
    const id = (e.target as Element | null)?.closest?.('.fg19-hot')?.getAttribute('data-muscle') as MuscleId | null | undefined;
    if (!id || !isActivateKey(e.key)) return;
    e.preventDefault();
    apply(tapMuscle(sRef.current, id));
  };
  // The hand path stops at the top edge of an open bubble (the zoom tip or a muscle's line), so no path runs under it.
  const clipTrace = () => {
    const sv = svgRef.current, r = figRef.current?.querySelector('.fg19-clip-r'), b = rootRef.current?.querySelector('.stage > .bubble');
    const m = sv?.getScreenCTM();
    if (!sv || !r || !m) return;
    let h = 99999;
    if (b) { const p = sv.createSVGPoint(); p.x = 0; p.y = b.getBoundingClientRect().top; h = p.matrixTransform(m.inverse()).y + 9999; }
    r.setAttribute('height', String(Math.max(0, h)));
  };
  useLayoutEffect(clipTrace, [bubble, zoom, compare, theme, v.showStage, still]);
  useEffect(() => {
    figRef.current?.querySelectorAll('.fg19-out').forEach(o => o.classList.toggle('on', o.getAttribute('data-muscle') === v.selMuscle));
  }, [v.selMuscle, theme]);
  useLayoutEffect(() => {
    sizeHot();
    const fit = () => { sizeHot(); clipTrace(); };
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [zoom, compare, theme, v.showStage, still]);

  return (
    <div class="form-guide" ref={rootRef}>
      <div class={v.rootClass}>
        <div class="stage" onClick={onStage} onKeyDown={onStageKey} onPointerDown={press.down} onPointerMove={press.move} onPointerUp={press.up} onPointerCancel={press.leave} onPointerLeave={press.leave} onContextMenu={e => e.preventDefault()}>
          <svg ref={svgRef} class={`scene fg4-scene${compare ? ' fg19-cmp' : ''}`} viewBox={cam.box.join(' ')} preserveAspectRatio="xMidYMid meet" aria-hidden="true" hidden={!(v.showStage && !still)}>
            <g ref={macRef} />
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
          {setup && v.showIdle && (
            <div class="fg9-setup">
              {setup.map((src, i) => <figure key={i}><img src={src} alt="" /><figcaption>{setupText(i)}</figcaption></figure>)}
            </div>
          )}
          {tiles && (
            <div class="pics">
              {setup?.map((src, i) => (
                <div class="tile" key={`s${i}`}>
                  <img src={src} alt="" />
                  <span class="badge">S</span>
                  <p>{setupText(i)}</p>
                </div>
              ))}
              {tiles.map((src, i) => (
                <div class="tile" key={i}>
                  <img src={src} alt="" />
                  <span class="badge">{i + 1}</span>
                  <p>{mistake ? `Mistake: ${T.pics[i]}` : T.pics[i]}</p>
                </div>
              ))}
            </div>
          )}
          <FpsPanel open={panel} stats={stats} stress={stress} onStress={() => setStress(x => !x)} onClose={() => setPanel(false)} />
          {bubble && (
            <div class="bubble" role="status">
              <span class="dot" style={{ background: mb?.dot ?? 'var(--accent)' }} />
              <span class="bt">{mb && <><b>{mb.name}</b>{' '}</>}<span>{bubble}</span></span>
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
        {v.showStage && !still && <Readouts g={g} load={load?.text ?? null} rep={tick.rep} set={el => { roEl.current = el; if (el) paintReadouts(anim.current?.currentTime() ?? 0); }} />}
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
