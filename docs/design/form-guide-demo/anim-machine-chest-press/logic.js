// One rep is 4 s at 1x. Zoom chips: 1 Grip, 2 Path, 3 Seat (root classes zoom-1..3). Muscles: the rig's table (spec 2.10);
// build.mjs stops when chips or muscles differ from the rig's EX (rig/chest-press.html).
const EX = {
  rep: 4,
  chips: [
    { id: 1, label: 'Grip', caption: 'Hold the middle of the handle. Wrists straight, not bent back.' },
    { id: 2, label: 'Path', caption: 'Handles stay at mid-chest height the whole way out and back.' },
    { id: 3, label: 'Seat', caption: 'Set the seat so the handles line up with the middle of your chest.' },
  ],
  muscles: [
    { region: 'chest', id: 'chest', Id: 'Chest', common: 'Chest', anatomical: 'pectoralis major', role: 'main', line: 'Pushes the handles away; hardest as the arms straighten.', cls: 'mm anim cp-eff' },
    { region: 'frontDelts', id: 'frontDelts', Id: 'FrontDelts', common: 'Front delts', anatomical: 'anterior deltoid', role: 'help', line: 'Lifts the upper arms forward with the chest.', cls: 'mh' },
    { region: 'triceps', id: 'triceps', Id: 'Triceps', common: 'Triceps', anatomical: 'triceps brachii', role: 'help', line: 'Straightens the elbows at the end of the press.', cls: 'mh' },
  ],
};
const on = v => v === true || v === 'true' || v === 'yes';
class Component extends DCLogic {
  constructor(props) {
    super(props);
    let rm = false;
    try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { rm = false; }
    const auto = on(props.autoplay) && !rm;
    this.state = { playing: auto, started: auto, ended: false, speed: 1, mode: rm ? 'pics' : 'anim', bubble: null, gen: 'a', elapsed: 0, rm: rm };
    this.timer = null;
  }
  componentDidMount() { if (this.state.playing) this.startClock(); }
  componentWillUnmount() { this.stopClock(); }
  startClock() { this.stopClock(); this.t0 = Date.now() - this.state.elapsed * 1000; this.timer = setInterval(() => this.tick(), 200); }
  stopClock() { if (this.timer) { clearInterval(this.timer); this.timer = null; } }
  repDur() { return EX.rep / this.state.speed; }
  flip() { return this.state.gen === 'a' ? 'b' : 'a'; }
  tick() {
    const el = (Date.now() - this.t0) / 1000, total = 3 * this.repDur();
    if (!on(this.props.loop) && el >= total) { this.stopClock(); this.setState({ playing: false, ended: true, elapsed: total }); }
    else this.setState({ elapsed: el });
  }
  togglePlay() {
    const s = this.state;
    if (s.rm) return;
    if (s.mode !== 'anim') { this.setState({ mode: 'anim', bubble: null, gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false }, () => this.startClock()); return; }
    if (s.ended) { this.setState({ gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false }, () => this.startClock()); return; }
    if (s.playing) { this.stopClock(); this.setState({ playing: false }); return; }
    this.setState({ playing: true, started: true }, () => this.startClock());
  }
  setSpeed(v) {
    if (v === this.state.speed) return;
    const was = this.state.playing;
    this.stopClock();
    this.setState({ speed: v, gen: this.flip(), elapsed: 0, ended: false, playing: was }, () => { if (was) this.startClock(); });
  }
  setMode(m) {
    if (m === this.state.mode || (this.state.rm && m === 'anim')) return;
    this.stopClock();
    this.setState({ mode: m, bubble: null, gen: this.flip(), elapsed: 0, playing: false, started: false, ended: false });
  }
  // The bubble state is one of { kind: 'zoom', id } (a zoom chip, id 1..3), { kind: 'muscle', id } (a tapped muscle) or
  // null: a zoom and a muscle bubble never show together (spec 2.10).
  pickZoom(id) {
    const s = this.state, z = s.bubble && s.bubble.kind === 'zoom' && s.bubble.id === id ? null : { kind: 'zoom', id: id };
    // In Pictures a zoom opens a still: flip gen so the paused animation restarts at 0 and shows the CSS still pose.
    // The caption line then shows that pose's picture caption (showStill1 / showStill3), not a phase caption.
    this.setState(s.mode === 'pics' ? { bubble: z, gen: this.flip() } : { bubble: z });
  }
  tapMuscle(id, e) {
    if (e && e.stopPropagation) e.stopPropagation();
    this.tapAt = Date.now();
    const s = this.state;
    if (s.mode !== 'anim') return;
    this.setState({ bubble: s.bubble && s.bubble.kind === 'muscle' && s.bubble.id === id ? null : { kind: 'muscle', id: id } });
  }
  keyMuscle(id, e) {
    if (e && e.key !== 'Enter' && e.key !== ' ' && e.key !== 'Spacebar') return;
    if (e && e.preventDefault) e.preventDefault();
    this.tapMuscle(id, e);
  }
  tapStage(e) {   // a tap on the stage background closes a muscle bubble (never a zoom; the hotspot's own tap wins)
    if (Date.now() - (this.tapAt || 0) < 80) return;
    if (e && e.target && e.target.closest && e.target.closest('.bubble')) return;
    const s = this.state;
    if (s.bubble && s.bubble.kind === 'muscle') this.setState({ bubble: null });
  }
  renderVals() {
    const s = this.state, p = this.props, loop = on(p.loop), dur = this.repDur();
    const zoom = s.bubble && s.bubble.kind === 'zoom' ? s.bubble.id : 0;
    const anim = s.mode === 'anim', still = !anim && zoom > 0;
    const mus = anim && s.bubble && s.bubble.kind === 'muscle' ? EX.muscles.find(m => m.id === s.bubble.id) : null;
    const chip = EX.chips.find(c => c.id === zoom);
    const play = s.playing && anim ? 'running' : 'paused';
    const out = {};
    for (const m of EX.muscles) {   // per muscle: its class hole (cls<Id>, .sel while tapped) and its tap and key handlers (tap<Id>, key<Id>)
      out['cls' + m.Id] = m.cls + (mus && mus.id === m.id ? ' sel' : '');
      out['tap' + m.Id] = e => this.tapMuscle(m.id, e);
      out['key' + m.Id] = e => this.keyMuscle(m.id, e);
    }
    return Object.assign(out, {
      rootStyle: `${themeVars(p.theme)};${rigVars(p.theme)};--play:${play};--dur:${dur}s;--iter:${loop ? 'infinite' : 3};--sets:${loop ? 'infinite' : 1};--delay:0s`,
      rootClass: `player gen-${s.gen}${zoom ? ' zoom-' + zoom : ''}${anim ? '' : ' pictures'}`,
      showSlow: anim && s.speed === 0.5,
      showBubble: !!chip || !!mus,
      bubbleDotStyle: 'background:var(' + (mus ? (mus.role === 'main' ? '--muscle-main' : '--muscle-help') : '--accent') + ')',
      bubbleName: mus ? mus.common : '',
      bubbleRest: mus ? '(' + mus.anatomical + '), ' + (mus.role === 'main' ? 'target' : 'helps') + '. ' + mus.line : (chip ? chip.caption : ''),
      bubbleText: mus ? mus.common + ' (' + mus.anatomical + '), ' + (mus.role === 'main' ? 'target' : 'helps') + '. ' + mus.line : (chip ? chip.caption : ''),
      showIdle: anim && !s.started && !s.ended,
      showEnded: anim && s.ended,
      showCaps: anim && s.started && !s.ended,
      showStill1: still && zoom !== 2, showStill3: still && zoom === 2,
      showPicsLine: !anim && !still,
      showTempo: anim, // Pictures mode (grid or still) has no tempo note (RIG section 12); it would not fit beside a still's caption
      isPlay: !s.playing && !s.ended, isPause: s.playing, isReplay: s.ended,
      playLabel: s.ended ? 'Replay' : (s.playing ? 'Pause' : 'Play'),
      playDisabled: s.rm,
      z1: zoom === 1, z2: zoom === 2, z3: zoom === 3,
      pick1: () => this.pickZoom(1), pick2: () => this.pickZoom(2), pick3: () => this.pickZoom(3),
      speed1: s.speed === 1, speedHalf: s.speed === 0.5,
      modeAnim: anim, modePics: !anim, animDisabled: s.rm,
      hintAnim: !s.rm && anim, hintPics: !s.rm && !anim, hintRm: s.rm,
      hots: EX.muscles.map(m => ({ id: m.id, tap: out['tap' + m.Id], key: out['key' + m.Id] })),
      tapStage: e => this.tapStage(e),
      togglePlay: () => this.togglePlay(),
      speedTo1: () => this.setSpeed(1), speedToHalf: () => this.setSpeed(0.5),
      toAnim: () => this.setMode('anim'), toPics: () => this.setMode('pics'),
    });
  }
}
