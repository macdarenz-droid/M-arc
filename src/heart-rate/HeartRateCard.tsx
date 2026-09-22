import { useEffect, useMemo, useState } from 'preact/hooks';
import { Button, Card, Chip, Row, Sheet } from '@/ui/primitives';
import { IconHeart } from '@/ui/icons';
import { connectHeartRateDevice, disconnectHeartRate, heartRateDevices, heartRateNativeAvailable, heartRateStatus, latestHeartRate, recentHeartRate, requestHeartRatePermissions, scanHeartRateDevices } from './store';
import type { HeartRateSample } from './types';
import { freshness, LIVE_MAX_MS } from './metrics';
import { tracePoints } from './chart';
import { traceGeometry, type TraceSegment } from './path';

const LABEL = { unavailable: 'Unavailable', connecting: 'Connecting', live: 'Live', delayed: 'Delayed', lost: 'Signal lost' } as const;

export function HeartRateCard({ compact = false }: { compact?: boolean }) {
  const [setup, setSetup] = useState(false);
  const [clock, setClock] = useState(() => Date.now());
  // Freshness is a function of elapsed time, so it has to re-evaluate on its
  // own. One second is enough, and it ticks only while this card is mounted.
  useEffect(() => { const timer = setInterval(() => setClock(Date.now()), 1_000); return () => clearInterval(timer); }, []);
  const status = heartRateStatus.value;
  const latest = latestHeartRate.value;
  const fresh = status.state === 'unavailable' || status.state === 'connecting' || status.state === 'lost' ? status.state : freshness(latest, clock);
  const tone = fresh === 'live' ? 'positive' : fresh === 'delayed' ? 'warning' : fresh === 'lost' ? 'negative' : 'info';

  return (
    <>
      <Card class={`heart-rate-card ${compact ? 'compact' : ''}`}>
        <div class="row-between">
          <div class="heart-rate-value">
            <div class="eyebrow"><IconHeart size={14} /> Heart rate</div>
            <div><b class="num">{latest && fresh !== 'lost' ? latest.bpm : '—'}</b> <span class="hint">BPM</span></div>
            <span class="hint">{fresh === 'live' ? status.deviceName || 'Live sensor' : status.detail}</span>
          </div>
          <div class="stack-sm" style={{ justifyItems: 'end' }}>
            <Chip tone={tone}><i class="hr-status-dot" /> {LABEL[fresh]}</Chip>
            {!compact && <HeartRateRange samples={recentHeartRate.value} />}
            <Button variant="quiet" size="sm" onClick={() => setSetup(true)}>{status.state === 'live' ? 'Sensor' : 'Set up'}</Button>
          </div>
        </div>
        {!compact && <HeartRateTrend samples={recentHeartRate.value} bpm={fresh === 'live' ? latest?.bpm : undefined} />}
        {!compact && <p class="hint" style={{ marginTop: 8 }}>{fresh === 'live'
          ? 'Log how each set felt. Escobar reviews your pulse alongside comparable workouts after saving.'
          : fresh === 'lost' ? 'Check watch fit and broadcast if you want to keep recording. Your workout log still saves.'
          : 'Record throughout the workout to give Escobar more context.'}</p>}
      </Card>
      {setup && <HeartRateSetup onClose={() => setSetup(false)} />}
    </>
  );
}

/**
 * The two-minute window's own high and low. These are the only extra figures
 * the card can state live: a session average and capture coverage do not exist
 * until the recorder closes the window at finish.
 */
function HeartRateRange({ samples }: { samples: HeartRateSample[] }) {
  const range = useMemo(() => {
    const points = tracePoints(samples, 0, Number.MAX_SAFE_INTEGER);
    if (!points.length) return null;
    return points.reduce((acc, p) => ({ low: Math.min(acc.low, p.bpm), high: Math.max(acc.high, p.bpm) }),
      { low: points[0]!.bpm, high: points[0]!.bpm });
  }, [samples]);
  if (!range) return null;
  return (
    <div class="hr-range" aria-label={`Two-minute range, ${range.low} to ${range.high} BPM`}>
      <div><b class="num">{range.high}</b><span>2-min high</span></div>
      <div><b class="num">{range.low}</b><span>2-min low</span></div>
    </div>
  );
}

const TREND_W = 320, TREND_H = 76, TREND_PAD = 6, TREND_WINDOW_MS = 120_000;

function HeartRateTrend({ samples, bpm }: { samples: HeartRateSample[]; bpm?: number }) {
  const geometry = useMemo(() => {
    if (samples.length < 2) return null;
    const to = samples[samples.length - 1]!.receivedAtEpochMs;
    const from = to - TREND_WINDOW_MS;
    const points = tracePoints(samples, from, to + 1);
    if (points.length < 2) return null;
    // tracePoints already marks where the signal broke; carry those breaks
    // through as separate segments so the fill never spans a gap either.
    const segments: TraceSegment[][] = [];
    for (const point of points) {
      if (point.startsSegment || !segments.length) segments.push([]);
      segments[segments.length - 1]!.push({ t: point.receivedAtEpochMs, bpm: point.bpm });
    }
    return traceGeometry(segments, {
      width: TREND_W, height: TREND_H, padding: TREND_PAD,
      from, to, liveWithinMs: LIVE_MAX_MS,
    });
  }, [samples]);

  if (!geometry || !geometry.line) return <div class="hr-chart-empty">The two-minute trend appears after two readings.</div>;
  return (
    <div class="hr-chart-wrap">
      <svg
        class="hr-chart" viewBox={`0 0 ${TREND_W} ${TREND_H}`} preserveAspectRatio="none"
        role="img" aria-label="Heart rate over the last two minutes, broken where the signal was lost"
      >
        <defs>
          <linearGradient id="hrFill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stop-color="var(--accent)" stop-opacity="0.34" />
            <stop offset="1" stop-color="var(--accent)" stop-opacity="0" />
          </linearGradient>
        </defs>
        <path class="hr-area" d={geometry.area} />
        <path class="hr-halo" d={geometry.line} />
        <path class="hr-line" d={geometry.line} />
      </svg>
      {geometry.tip && (
        /*
         * Positioned in percentages over the chart rather than drawn inside it.
         * The SVG stretches horizontally to fill the card, which would turn a
         * circle into a width-dependent ellipse; this stays round at any size,
         * and a transform pulse composites better than animating an SVG radius.
         *
         * The period is the measured rate, so the marker beats with the person.
         * It is CSS throughout: a new sample never re-renders the chart.
         */
        <i
          class="hr-tip" aria-hidden="true"
          style={{
            left: `${(geometry.tip.x / TREND_W) * 100}%`,
            top: `${(geometry.tip.y / TREND_H) * 100}%`,
            ...(bpm ? { ['--beat' as string]: `${(60 / bpm).toFixed(2)}s` } : {}),
          }}
        />
      )}
    </div>
  );
}

function HeartRateSetup({ onClose }: { onClose: () => void }) {
  const status = heartRateStatus.value;
  const devices = heartRateDevices.value;
  const [busy, setBusy] = useState(false);
  const run = async (task: () => Promise<unknown>) => { setBusy(true); try { await task(); } finally { setBusy(false); } };
  return (
    <Sheet title="Heart-rate sensor" onClose={onClose}>
      <div class="stack">
        <Card class="card-quiet">
          <div class="eyebrow">{status.title}</div>
          <p class="small muted" style={{ marginTop: 6 }}>{status.detail}</p>
          {status.deviceName && <p class="hint" style={{ marginTop: 4 }}>{status.deviceName}{status.batteryPct != null ? ` · ${status.batteryPct}% battery` : ''}</p>}
        </Card>
        {!heartRateNativeAvailable() ? <p class="small muted">Live Bluetooth heart rate is available in the Android app. Workouts remain fully usable here.</p> : (
          <>
            <div class="grid-2">
              <Button disabled={busy} onClick={() => run(requestHeartRatePermissions)}>Allow Bluetooth</Button>
              <Button variant="primary" disabled={busy || status.scanning} onClick={() => run(scanHeartRateDevices)}>{status.scanning ? 'Scanning…' : 'Scan for sensors'}</Button>
            </div>
            <div class="list">
              {devices.map(device => <Row key={device.id} trailing={<Button size="sm" disabled={busy} onClick={() => run(() => connectHeartRateDevice(device.id))}>Connect</Button>}>
                <b class="small">{device.name}</b>
                <div class="hint">{device.heartRateAdvertised ? 'Heart-rate broadcast' : device.bonded ? 'Paired device' : 'Bluetooth device'}</div>
              </Row>)}
              {!devices.length && <p class="small muted">Enable HR Data Broadcasts on the watch, then scan. M/ARC cannot switch the watch broadcast on remotely.</p>}
            </div>
            {(status.state === 'live' || status.state === 'connecting' || status.deviceName) && <Button variant="danger" onClick={() => run(disconnectHeartRate)}>Disconnect sensor</Button>}
          </>
        )}
      </div>
    </Sheet>
  );
}
