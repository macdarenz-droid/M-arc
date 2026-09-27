// GU-7a-2: the form-guide player (the lazy chunk). Chrome from controller.renderVals() with the
// app's own Chip, Button, .seg, .hint and .sr-only (R1-12); figure markup mounted once through
// innerHTML (built only from constants in the repo, never from user input: R1-9's one allowed use);
// motion through waapi.ts; rep pill and caption from the animation clock in a rAF loop that stops
// when nothing plays (the PulseLine.tsx pattern).
import { useEffect, useLayoutEffect, useRef, useState } from 'preact/hooks';
import { Button, Chip } from '@/ui/primitives';
import { IconPause, IconPlay } from '@/ui/icons';
import { onReducedChange, reduced } from '@/ui/motion';
import type { MuscleId } from '@/data/muscles';
import type { Guide } from '../rig/api';
import { clock, finish, initial, isActivateKey, pickZoom, renderVals, setMode, setReduced, setSpeed, tapMuscle, tapStage, togglePlay, type Fx, type PlayerState, type Step } from './controller';
import { mountAnimations, type AnimHandle, type AnimRoot } from './waapi';
// GU-7a-4 switches these two to '@/formguide/index' (guides), '@/formguide/rig/paint' (RIG_CSS) and '@/formguide/muscles'.
import { RIG_CSS, muscleInfo, stubGuide } from './stubGuide';

const RIG_STYLE_ID = 'marc-formguide-rig';

/** The rig paint rules, injected once (the theme engine's marc-theme-tokens pattern, R1-12). */
function ensureRigCss(): void {
  if (document.getElementById(RIG_STYLE_ID)) return;
  const el = document.createElement('style');
  el.id = RIG_STYLE_ID;
  el.textContent = RIG_CSS;
  document.head.appendChild(el);
}

export function guideFor(_exerciseId: string): Guide {
  return stubGuide;
}

const ZoomIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5M11 8.5v5M8.5 11h5" /></svg>
);
const ReplayIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12a8 8 0 1 0 2.3-5.6M4 4v4h4" /></svg>
);

export type FormGuidePlayerProps = { exerciseId: string };

export function FormGuidePlayer({ exerciseId }: FormGuidePlayerProps) {
  const guide = guideFor(exerciseId);
  const spec = guide.spec;
  const [stage] = useState(() => guide.stage(document.documentElement.dataset.theme === 'paper' ? 'light' : 'dark'));
  const [s, setS] = useState<PlayerState>(() => initial(reduced()));
  const [tick, setTick] = useState({ rep: 1, phase: 0 });
  const sRef = useRef(s);
  sRef.current = s;
  const sceneRef = useRef<SVGSVGElement>(null);
  const stillRef = useRef<SVGSVGElement>(null);
  const picsRef = useRef<HTMLDivElement>(null);
  const anim = useRef<AnimHandle | null>(null);
  const raf = useRef(0);
  const info = muscleInfo(exerciseId);

  const ensureAnims = (): AnimHandle => {
    if (!anim.current) anim.current = mountAnimations(guide.sample().groups, sceneRef.current as unknown as AnimRoot, spec.rep);
    return anim.current;
  };

  const loop = () => {
    raf.current = 0;
    const h = anim.current;
    if (!h) return;
    const c = clock(h.currentTime(), spec.rep);
    setTick(t => (t.rep === c.rep && t.phase === c.phase ? t : { rep: c.rep, phase: c.phase }));
    if (c.done) { apply(finish(sRef.current)); return; }
    if (sRef.current.playing) raf.current = requestAnimationFrame(loop);
  };
  const startLoop = () => { if (!raf.current) raf.current = requestAnimationFrame(loop); };
  const stopLoop = () => { if (raf.current) { cancelAnimationFrame(raf.current); raf.current = 0; } };

  const runFx = (fx: Fx, next: PlayerState) => {
    if (!fx) return;
    if (fx === 'reset') { anim.current?.reset(); stopLoop(); setTick({ rep: 1, phase: 0 }); return; }
    if (next.rm) return;
    const h = ensureAnims();
    if (fx === 'rate') { h.rate(next.speed); return; }
    if (fx === 'pause') { h.pause(); stopLoop(); return; }
    h.rate(next.speed);
    if (fx === 'replay') { setTick({ rep: 1, phase: 0 }); h.replay(); } else h.play();
    startLoop();
  };
  const apply = (step: Step) => {
    sRef.current = step.state;
    setS(step.state);
    runFx(step.fx, step.state);
  };

  // Mount the figure once; the animations sit paused on the setup pose (none at all under reduced motion).
  useLayoutEffect(() => {
    ensureRigCss();
    if (sceneRef.current) sceneRef.current.innerHTML = stage.svg;
    if (picsRef.current) {
      picsRef.current.innerHTML = stage.tiles;
      // Pictures has no hotspots (spec 2.10): the tiles are static copies.
      picsRef.current.querySelectorAll('.hot').forEach(h => h.remove());
    }
    if (!sRef.current.rm) ensureAnims();
    const off = onReducedChange(r => apply(setReduced(sRef.current, r)));
    const onVisibility = () => { if (document.hidden) stopLoop(); else if (sRef.current.playing) startLoop(); };
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      off();
      document.removeEventListener('visibilitychange', onVisibility);
      stopLoop();
      anim.current?.cancel();
      anim.current = null;
    };
  }, []);

  const v = renderVals(s);
  const still = v.showStill1 || v.showStill3;

  // A Pictures still: tile 1 (tile 3 for Path) drawn large at the chip's zoom (R1-9, logic.js showStill1/showStill3).
  useLayoutEffect(() => {
    const el = stillRef.current;
    if (!el) return;
    const tile = picsRef.current?.querySelectorAll('.tile svg')[v.showStill3 ? 2 : 0];
    el.innerHTML = still && tile ? `<g class="cam">${tile.innerHTML}</g>` : '';
  }, [still, v.showStill3]);

  // The .sel outline on the tapped region only: its painted polygons, which the rig tags with data-muscle (the demo's cls<Id> hole).
  useEffect(() => {
    const root = sceneRef.current;
    if (!root) return;
    root.querySelectorAll('.sel').forEach(e => e.classList.remove('sel'));
    if (v.selMuscle) root.querySelectorAll(`.mm[data-muscle="${v.selMuscle}"],.mh[data-muscle="${v.selMuscle}"]`).forEach(p => p.classList.add('sel'));
  }, [v.selMuscle]);

  // One handler on the stage (the demo's tapStage on .stage): a hotspot opens its muscle; a tap on the bubble does nothing;
  // anywhere else closes a muscle bubble.
  const onStage = (e: Event) => {
    const t = e.target as Element | null;
    const id = t?.closest?.('.scene .hot')?.getAttribute('data-muscle') as MuscleId | null | undefined;
    if (id) { apply(tapMuscle(sRef.current, id)); return; }
    if (t?.closest?.('.bubble')) return;
    apply(tapStage(sRef.current));
  };
  const onStageKey = (e: KeyboardEvent) => {
    if (!isActivateKey(e.key)) return;
    const hot = (e.target as Element | null)?.closest?.('.hot');
    const id = hot?.getAttribute('data-muscle') as MuscleId | null | undefined;
    if (!id) return;
    e.preventDefault();
    apply(tapMuscle(sRef.current, id));
  };

  let bubble: { name: string; rest: string; dot: string } | null = null;
  if (s.bubble?.kind === 'zoom') bubble = { name: '', rest: spec.chips[s.bubble.id - 1]?.caption ?? '', dot: 'var(--accent)' };
  else if (s.bubble?.kind === 'muscle') {
    const id = s.bubble.id;
    const m = info.find(x => x.id === id);
    if (m) bubble = { name: m.common, rest: `(${m.anatomical}), ${m.role}. ${m.line}`, dot: m.colorVar };
  }

  return (
    <div class="form-guide">
      <style>{stage.css}</style>
      <div class={v.rootClass}>
        <div class="stage" onClick={onStage} onKeyDown={onStageKey}>
          <svg ref={sceneRef} class="scene" viewBox="0 0 358 276" hidden={!(v.showStage && !still)} />
          <svg ref={stillRef} class="scene still" viewBox="0 0 358 276" aria-hidden="true" hidden={!still} />
          {v.showPills && (
            <div class="pill-row">
              <span class="pill">Rep {tick.rep} of 3</span>
              {v.showSlow && <span class="pill pill-accent">Slow motion</span>}
            </div>
          )}
          {v.showCamLabel && v.showStage && <div class="cam-label">{spec.cam}</div>}
          <div ref={picsRef} class="pics" hidden={!v.showPics} />
          {bubble && (
            <div class="bubble" role="status">
              <span class="dot" style={{ background: bubble.dot }} />
              <span class="bt">{bubble.name && <><b>{bubble.name}</b>{' '}</>}<span>{bubble.rest}</span></span>
            </div>
          )}
        </div>
        <div class="cap-row">
          <span class="cap">
            {v.showIdle && 'Tap Play to watch 3 slow reps.'}
            {v.showEnded && 'Done. Tap Replay to watch again.'}
            {v.showCaps && spec.caps[tick.phase]}
            {v.showStill1 && spec.pics[0]}
            {v.showStill3 && spec.pics[2]}
            {v.showPicsLine && spec.picsLine}
          </span>
          {v.showTempo && <span class="tempo">{spec.tempo}</span>}
        </div>
        <div class="chips">
          {spec.chips.map((c, i) => (
            <Chip key={c.id} pressed={v.zoomPressed[i]} onClick={() => apply(pickZoom(sRef.current, i + 1))}><ZoomIcon />{c.label}</Chip>
          ))}
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
          {v.hintAnim && 'Tap a zoom chip to look closer. Tap it again to zoom out.'}
          {v.hintPics && 'Four key moments of one rep.'}
          {v.hintRm && 'Pictures shown because your phone is set to reduce motion.'}
        </p>
        <p class="sr-only">{spec.srText}</p>
      </div>
    </div>
  );
}
