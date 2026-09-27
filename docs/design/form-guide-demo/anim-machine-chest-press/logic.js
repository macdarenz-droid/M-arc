// One rep is 4 s at 1x. Zoom chips: 1 Grip, 2 Path, 3 Seat (root classes zoom-1..3).
const EX = { rep: 4 };
const on = v => v === true || v === 'true' || v === 'yes';
class Component extends DCLogic {
  constructor(props) {
    super(props);
    let rm = false;
    try { rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { rm = false; }
    const auto = on(props.autoplay) && !rm;
    this.state = { playing: auto, started: auto, ended: false, speed: 1, mode: rm ? 'pics' : 'anim', zoom: 0, gen: 'a', elapsed: 0, rm: rm };
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
    if (s.mode !== 'anim') { this.setState({ mode: 'anim', zoom: 0, gen: this.flip(), elapsed: 0, playing: true, started: true, ended: false }, () => this.startClock()); return; }
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
    this.setState({ mode: m, zoom: 0, gen: this.flip(), elapsed: 0, playing: false, started: false, ended: false });
  }
  pickZoom(n) {
    const s = this.state, z = s.zoom === n ? 0 : n;
    // In Pictures a zoom opens a still: flip gen so the paused animation restarts at 0 and shows the CSS still pose.
    // The caption line then shows that pose's picture caption (showStill1 / showStill3), not a phase caption.
    this.setState(s.mode === 'pics' ? { zoom: z, gen: this.flip() } : { zoom: z });
  }
  renderVals() {
    const s = this.state, p = this.props, loop = on(p.loop), dur = this.repDur();
    const anim = s.mode === 'anim', still = !anim && s.zoom > 0;
    const play = s.playing && anim ? 'running' : 'paused';
    return {
      rootStyle: `${themeVars(p.theme)};${rigVars(p.theme)};--play:${play};--dur:${dur}s;--iter:${loop ? 'infinite' : 3};--sets:${loop ? 'infinite' : 1};--delay:0s`,
      rootClass: `player gen-${s.gen}${s.zoom ? ' zoom-' + s.zoom : ''}${anim ? '' : ' pictures'}`,
      showSlow: anim && s.speed === 0.5,
      showIdle: anim && !s.started && !s.ended,
      showEnded: anim && s.ended,
      showCaps: anim && s.started && !s.ended,
      showStill1: still && s.zoom !== 2, showStill3: still && s.zoom === 2,
      showPicsLine: !anim && !still,
      showTempo: anim, // Pictures mode (grid or still) has no tempo note (RIG section 12); it would not fit beside a still's caption
      isPlay: !s.playing && !s.ended, isPause: s.playing, isReplay: s.ended,
      playLabel: s.ended ? 'Replay' : (s.playing ? 'Pause' : 'Play'),
      playDisabled: s.rm,
      z1: s.zoom === 1, z2: s.zoom === 2, z3: s.zoom === 3,
      pick1: () => this.pickZoom(1), pick2: () => this.pickZoom(2), pick3: () => this.pickZoom(3),
      speed1: s.speed === 1, speedHalf: s.speed === 0.5,
      modeAnim: anim, modePics: !anim, animDisabled: s.rm,
      hintAnim: !s.rm && anim, hintPics: !s.rm && !anim, hintRm: s.rm,
      togglePlay: () => this.togglePlay(),
      speedTo1: () => this.setSpeed(1), speedToHalf: () => this.setSpeed(0.5),
      toAnim: () => this.setMode('anim'), toPics: () => this.setMode('pics'),
    };
  }
}
