import { useEffect, useRef, useState } from 'preact/hooks';
import { Button, Card, Field, Sheet } from '@/ui/primitives';
import { WATCH_LAB_FLAG, wearLab, type LabAction, type LabReport } from '@/native/wearEngine';
import { exportText } from '@/native/share';

function enabled(): boolean { try { return localStorage.getItem(WATCH_LAB_FLAG) === '1'; } catch { return false; } }
export function WatchLabEntry({ version }: { version: string }) {
  const [dev, setDev] = useState(enabled);
  const [open, setOpen] = useState(false);
  const taps = useRef(0);
  return <>
    <button type="button" class="btn btn-quiet hint" data-palace="settings.version" onClick={() => {
      if (++taps.current >= 7) { try { localStorage.setItem(WATCH_LAB_FLAG, '1'); setDev(true); } catch { /* Storage disabled: keep lab hidden. */ } }
    }}>Version {version}</button>
    {dev && <Button size="sm" onClick={() => setOpen(true)}>Watch lab</Button>}
    {open && <WatchLab onClose={() => setOpen(false)} />}
  </>;
}

function WatchLab({ onClose }: { onClose: () => void }) {
  const [report, setReport] = useState<LabReport>();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [peer, setPeer] = useState('com.mrcdrnzz.watchlab');
  const [fingerprint, setFingerprint] = useState('');
  const [token, setToken] = useState('');
  const [region, setRegion] = useState('');
  const [note, setNote] = useState('');
  const alive = useRef(true);
  const running = useRef(false);
  const act = (action: LabAction, args: Record<string, unknown> = {}) => {
    if (running.current) return;
    running.current = true; setBusy(true);
    void wearLab(action, args).then(result => {
      if (!alive.current) return;
      if (result.ok) { setReport(result.report); setError(''); } else setError(result.error);
    }).catch(() => { if (alive.current) setError('Could not read the lab response.'); })
      .finally(() => { running.current = false; if (alive.current) setBusy(false); }).catch(() => { /* Guard UI cleanup too. */ });
  };
  useEffect(() => {
    alive.current = true; act('snapshot');
    // Poll native diagnostics; recording itself stays native while this sheet is closed.
    const timer = setInterval(() => act('snapshot'), 2000);
    return () => { alive.current = false; clearInterval(timer); };
  }, []);
  const probe = (op: string, bytes?: number) => act('probe', { op, bytes });
  const exportReport = () => {
    if (!report) return;
    const d = new Date();
    const date = [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
    void exportText(`MARC-GT6-Gate-A-${date}-${report.run || 'idle'}.json`, JSON.stringify(report, null, 2))
      .then(message => { if (alive.current) setError(message); }).catch(() => { if (alive.current) setError('Report export failed; recording remains on this phone.'); });
  };
  return <Sheet title="Watch lab · Gate A" onClose={onClose}>
    <div class="stack">
      <Card class="stack-sm">
        <p>Diagnostic build. Real GT6 results are pending. No workout data is changed.</p>
        <p class="hint">Turn HR broadcast OFF. Keep Huawei Health available. Export before starting another run; only the latest run is retained. Runs stop after 10 minutes. Closing this sheet leaves recording active.</p>
        <Field label="Huawei account region (for this test)"><input value={region} maxLength={60} onInput={e => setRegion(e.currentTarget.value)} /></Field>
        <Button disabled={busy || report?.active} onClick={() => act('begin', { region })}>Begin diagnostic run</Button>
        <div role="status">{error || (report?.active ? 'Recording diagnostics' : 'No active run')}</div>
        {report && !report.persisted && <p role="alert">Diagnostic persistence failed. Export now; this log may be lost on restart.</p>}
      </Card>
      <Card class="stack-sm">
        <Button disabled={busy || !report?.active} onClick={() => act('authorize')}>1. Authorize Wear Engine</Button>
        <span class="hint">Authorization: {report?.authorized ? 'granted' : 'not confirmed'}</span>
        <Button disabled={busy || !report?.authorized} onClick={() => act('devices')}>2. Discover paired watches</Button>
        <Field label="Watch"><select aria-label="Watch" value={token} onChange={e => setToken(e.currentTarget.value)}><option value="">Select device</option>{report?.devices.map(d => <option value={d.token} key={d.token}>{d.model} · {d.firmware} · {d.connected ? 'connected' : 'offline'}</option>)}</select></Field>
        <Field label="Watch probe bundle name"><input value={peer} onInput={e => setPeer(e.currentTarget.value)} /></Field>
        <Field label="Watch app certificate fingerprint (from signed HAP; not the phone certificate)"><input value={fingerprint} maxLength={512} onInput={e => setFingerprint(e.currentTarget.value)} /></Field>
        <Button disabled={busy || !token || !fingerprint || !report?.authorized} onClick={() => act('connect', { token, peer, fingerprint })}>3. Register watch receiver</Button>
        <Button disabled={busy || !report?.receiverReady} onClick={() => act('ping')}>4. Ping / try opening watch probe</Button>
        <span class="hint">SDK acceptance and ping codes do not prove that the watch app opened. Confirm on the watch and record it below.</span>
      </Card>
      <Card class="stack-sm">
        {['echo', 'capabilities', 'hr_start', 'hr_stop', 'storage_write', 'storage_read', 'vibrate'].map(op => <Button key={op} disabled={busy || !report?.receiverReady} onClick={() => probe(op)}>{op.replaceAll('_', ' ')}</Button>)}
        <div class="row">{[256, 512, 1024].map(bytes => <Button key={bytes} size="sm" disabled={busy || !report?.receiverReady} onClick={() => probe('payload', bytes)}>Test {bytes} B</Button>)}</div>
        <p class="hint">HR auto-stops on the watch after 5 minutes. “Watch reply” and sensor samples are separate events. No HRV, sleep, RR or calories are inferred.</p>
      </Card>
      <Card class="stack-sm">
        <Field label="Observation (e.g. broadcast off; phone locked; watch screen off; vibration felt)"><input value={note} maxLength={200} onInput={e => setNote(e.currentTarget.value)} /></Field>
        <Button disabled={busy || !report?.active || !note.trim()} onClick={() => act('mark', { note })}>Record observation</Button>
        <Button disabled={busy || !report?.active} onClick={() => act('stop')}>Stop local run</Button>
        <Button disabled={busy || !report} onClick={exportReport}>Export diagnostic JSON</Button>
        <span class="hint">{report?.events.length ?? 0} events · {report?.dropped ?? 0} discarded at log limit. Review exported notes before sharing.</span>
        <pre style={{ whiteSpace: 'pre-wrap', maxHeight: 260, overflow: 'auto', fontSize: 11 }}>{report?.events.slice(-20).map(e => `${new Date(e.at).toLocaleTimeString()} ${e.kind} ${JSON.stringify(e.data)}`).join('\n')}</pre>
      </Card>
    </div>
  </Sheet>;
}
