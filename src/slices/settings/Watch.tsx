import { useEffect, useState } from 'preact/hooks';
import { state, update } from '@/core/store';
import { Button, Card, Row, Sheet, Toggle } from '@/ui/primitives';
import { watchStatus, scannedDevices, scanForWatch, stopWatchScan, connectWatch, disconnectWatch, watchPermissionState, requestWatchPermissions } from '@/native/watch';

/** Connect, forget, and auto-connect (6.5): reused from Train's live pill and Settings. */
export function WatchSheet({ onClose }: { onClose: () => void }) {
  const s = state.value;
  const w = s.preferences.watch;
  const status = watchStatus.value;
  const [scanning, setScanning] = useState(false);

  useEffect(() => () => { if (scanning) void stopWatchScan(); }, [scanning]);

  const startScan = async () => {
    const perm = await watchPermissionState();
    if (perm && !perm.granted) {
      const granted = await requestWatchPermissions();
      if (!granted) return;
    }
    setScanning(true);
    await scanForWatch();
  };

  const pick = async (address: string, name: string) => {
    setScanning(false);
    await stopWatchScan();
    update(x => ({ ...x, preferences: { ...x.preferences, watch: { ...x.preferences.watch, deviceAddress: address, deviceName: name } } }));
    await connectWatch(address);
  };

  const forget = async () => {
    await disconnectWatch();
    update(x => ({ ...x, preferences: { ...x.preferences, watch: { autoConnectOnSession: x.preferences.watch.autoConnectOnSession } } }));
  };

  return (
    <Sheet title="Watch" onClose={onClose}>
      <div class="stack">
        <p class="small muted">{status.message}</p>
        {status.state === 'connected' ? (
          <Row trailing={<Button size="sm" variant="danger" onClick={forget}>Disconnect</Button>}><span class="small">{status.deviceName ?? w.deviceName ?? 'Connected'}</span></Row>
        ) : (
          <Button variant="primary" block onClick={startScan} disabled={scanning}>{scanning ? 'Scanning…' : 'Scan for a watch'}</Button>
        )}
        {scanning && (
          <div class="stack-sm">
            {scannedDevices.value.length === 0 && <p class="small muted">Looking for broadcasting watches…</p>}
            {scannedDevices.value.map(d => (
              <Card key={d.address} class="card-press" onClick={() => pick(d.address, d.name)}>
                <b class="small">{d.name}</b>
                <div class="hint">{d.advertisesHeartRate ? 'Heart-rate broadcast' : d.paired ? 'Paired · not yet checked' : 'Nearby · not yet checked'}</div>
              </Card>
            ))}
          </div>
        )}
        <Row trailing={<Toggle checked={w.autoConnectOnSession} onChange={v => update(x => ({ ...x, preferences: { ...x.preferences, watch: { ...x.preferences.watch, autoConnectOnSession: v } } }))} label="Auto-connect when a session starts" />}><span class="small">Auto-connect when a session starts</span></Row>
        <p class="hint">Readings stay on this device. No Bluetooth address or heart-rate value ever leaves your phone.</p>
      </div>
    </Sheet>
  );
}
