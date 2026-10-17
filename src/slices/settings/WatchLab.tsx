/**
 * Gate A question 2 (watch lane): the hidden Watch lab. Only the debug APK carries the WearEngine
 * plugin; without it WatchLabEntry renders nothing and listens to nothing, so the Settings Version
 * line stays exactly as it is. With it, 7 taps on the Version line open the lab. Nothing is saved:
 * the Native ack toggle (GATE-A-PROBE-2) lives in the lab session's memory and starts off.
 * WATCH-C: Connect also starts the workout link, whose panel (Hold results and its counters) is
 * built in src/native/watchLink.ts.
 */
import { useEffect, useState } from 'preact/hooks';
import { Button, Row, Sheet, Toggle } from '@/ui/primitives';
import { wearAvailable, watchLab } from '@/native/wearEngine';
import { watchLink, WatchLinkPanel } from '@/native/watchLink';

const LAB_TAPS = 7;
const VERSION_LINE = '[data-palace="settings.version"]';

export function WatchLabEntry() {
  return wearAvailable() ? <WatchLabTaps /> : null;
}

function WatchLabTaps() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    let taps = 0;
    const onTap = (e: Event) => {
      if (!(e.target instanceof Element) || !e.target.closest(VERSION_LINE)) return;
      if (++taps < LAB_TAPS) return;
      taps = 0;
      setOpen(true);
    };
    document.addEventListener('click', onTap);
    return () => document.removeEventListener('click', onTap);
  }, []);
  return open ? <WatchLabSheet onClose={() => setOpen(false)} /> : null;
}

function WatchLabSheet({ onClose }: { onClose: () => void }) {
  const lab = watchLab();
  const c = lab.counts.value;
  return (
    <Sheet title="Watch lab" onClose={onClose}>
      <div class="stack-sm">
        <div class="grid-3">
          <Button onClick={() => void watchLink().start()}>Connect</Button>
          <Button onClick={() => void lab.ping()}>Ping</Button>
          <Button onClick={() => void lab.stop()}>Stop</Button>
        </div>
        <Row trailing={<Toggle checked={lab.nativeAck.value} onChange={on => void lab.setNativeAck(on)} label="Native ack" />}><span class="small">Native ack</span></Row>
        <p class="small num">rx {c.rx} hr {c.hr} ack {c.ack} dup {c.dup} bad {c.bad}</p>
        <WatchLinkPanel />
        <pre class="small" style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'ui-monospace, monospace' }}>{lab.rows.value.join('\n')}</pre>
      </div>
    </Sheet>
  );
}
