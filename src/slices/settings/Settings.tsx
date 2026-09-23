import { useEffect, useState } from 'preact/hooks';
import { bootSource, deleteRescueCopy, flushSave, replaceState, rescueRaw, state, update } from '@/core/store';
import { freshState, type AppState } from '@/core/models';
import { Button, Card, Field, Row, Section, Sheet, Toggle } from '@/ui/primitives';
import { THEMES, THEME_IDS } from '@/theme/themes';
import { setTheme, themeId } from '@/theme/engine';
import { haptic, hapticSupport, setHapticsEnabled } from '@/native/haptics';
import { exportText, pickFile } from '@/native/share';
import { showToast } from '@/app/toast';
import { profileOpen } from '@/app/router';
import { reminderHealth, resyncReminders } from './reminders';
import { healthAvailable } from '@/native/health';
import { syncAndStoreHealth } from './health';
import { watchSupported, watchStatus } from '@/native/watch';
import { WatchSheet } from './Watch';
import { GymsSheet } from './Gyms';
import { usePalaceFocus } from '@/escobar/palace/focus';
import { Logo } from '@/ui/Logo';
import { EscobarSettings } from '@/escobar/ui/SettingsSection';
import { clearStore as clearEscobarStore, exportAllEscobar, restoreEscobar } from '@/escobar/store';
import { clearHeart, exportHeart, restoreHeart } from '@/core/heartStore';
import { cancelRestDone, exactAlarmsAllowed, refreshExactAlarm, requestExactAlarm, scheduleRestDone } from '@/native/notifications';
import { isNative } from '@/native/capacitor';
import { APP_VERSION } from '@/core/version';
import { formatDay, formatLocalStamp, dayKey } from '@/core/dates';
import { buildBackup, parseBackup } from './backup';

type Snapshot = { state: AppState; escobar: unknown; heart: unknown };
type PendingRestore = { next: AppState; escobar?: unknown; heart?: unknown; from: string; label: string };

/** Everything a restore or reset replaces, so Undo can put it back. */
function snapshot(): Snapshot { return { state: state.value, escobar: exportAllEscobar(), heart: exportHeart() }; }

/** After the state is replaced: timers, haptics and reminders follow the new state. */
function afterReplace(): void {
  void cancelRestDone();
  setHapticsEnabled(state.value.preferences.haptics);
  void resyncReminders();
}

function restoreAll(b: Snapshot): void {
  replaceState(b.state);
  restoreEscobar(b.escobar);
  restoreHeart(b.heart);
  afterReplace();
}

function resetEverything(): void {
  replaceState(freshState());
  clearEscobarStore();
  clearHeart();
  void import('@/escobar/images').then(m => m.clearImages()).catch(() => {});
  try { localStorage.removeItem('marc.health.asked'); } catch { /* storage unavailable */ }
  afterReplace();
}

export function Settings({ onClose }: { onClose: () => void }) {
  const s = state.value;
  const p = s.preferences;
  const [confirmReset, setConfirmReset] = useState(false);
  usePalaceFocus('settings.theme');
  const [watchOpen, setWatchOpen] = useState(false);
  const [gymsOpen, setGymsOpen] = useState(false);
  const [pending, setPending] = useState<PendingRestore | null>(null);
  const [rescue, setRescue] = useState(() => rescueRaw() != null);
  const [exact, setExact] = useState(exactAlarmsAllowed());
  useEffect(() => { void refreshExactAlarm().then(setExact); }, []);
  const setPref = (patch: Partial<AppState['preferences']>) => update(x => ({ ...x, preferences: { ...x.preferences, ...patch } }));

  const backup = async () => {
    flushSave();
    const name = `marc-backup-${new Date().toISOString().slice(0, 10)}.json`;
    try { showToast(await exportText(name, JSON.stringify(buildBackup(), null, 1))); } catch { showToast('Export failed'); }
  };
  const restore = async () => {
    const text = await pickFile();
    if (!text) return;
    const b = parseBackup(text);
    if ('error' in b) { showToast(b.error); return; }
    if (b.kind === 'legacy') { setPending({ next: b.state, from: 'the previous version', label: 'the old backup' }); return; }
    const when = b.exportedAt && Number.isFinite(Date.parse(b.exportedAt)) ? formatDay(dayKey(b.exportedAt)) : 'this file';
    setPending({ next: b.state, escobar: b.escobar, heart: b.heart, from: when, label: b.dropped ? `the backup (${b.dropped} damaged item${b.dropped === 1 ? '' : 's'} skipped)` : 'the backup' });
  };
  const applyRestore = (r: PendingRestore) => {
    const before = snapshot();
    // Health Connect permission belongs to this device, not the backup.
    replaceState({ ...r.next, health: { connected: false } });
    if (r.escobar !== undefined) restoreEscobar(r.escobar);
    if (r.heart !== undefined) restoreHeart(r.heart);
    afterReplace();
    setPending(null);
    showToast(`Restored ${r.next.sessions.length} sessions from ${r.label}`, 'Undo', () => restoreAll(before));
  };
  const saveRescue = async () => {
    const raw = rescueRaw();
    if (raw == null) { setRescue(false); return; }
    try { showToast(await exportText('marc-rescue-data.json', raw)); } catch { showToast('Export failed'); }
  };

  return (
    <Sheet title="Settings" onClose={onClose}>
      <div class="stack">
        <Section title="Theme" palace="settings.theme">
          <div class="theme-grid">
            {THEME_IDS.map(id => { const t = THEMES[id]; const k = t.tokens; return (
              <button type="button" key={id} class="theme-card" aria-pressed={themeId.value === id} onClick={() => { setTheme(id); void haptic.light(); }}>
                <div class="theme-preview" style={{ background: k.bg }}><i style={{ top: 8, width: '55%', background: k.text, opacity: .9 }} /><i style={{ top: 22, background: k.surface3 }} /><i style={{ top: 36, width: 40, background: k.accent }} /></div>
                <div><b class="small">{t.name}</b><div class="hint">After {t.inspiredBy}</div></div>
              </button>
            ); })}
          </div>
        </Section>

        <Section title="Training">
          <Card>
            <Row trailing={<div class="seg" style={{ width: 120 }}><button type="button" aria-pressed={p.weightUnit === 'kg'} onClick={() => setPref({ weightUnit: 'kg' })}>kg</button><button type="button" aria-pressed={p.weightUnit === 'lb'} onClick={() => setPref({ weightUnit: 'lb' })}>lb</button></div>}><span class="small" data-palace="settings.weight-unit">Show weights in</span><div class="hint">History, charts and records. Each machine keeps its own entry unit.</div></Row>
            <Row trailing={<Button size="sm" onClick={() => setGymsOpen(true)}>Manage</Button>}><span class="small" data-palace="settings.gyms">Gyms and equipment</span><div class="hint">{s.units.gyms.length === 1 ? s.units.gyms[0]!.name : `${s.units.gyms.length} gyms`}</div></Row>
            <Row trailing={<Toggle checked={p.autoRest} onChange={v => setPref({ autoRest: v })} label="Automatic rest timer" />}><span class="small" data-palace="settings.auto-rest">Start rest after each set</span></Row>
            <Row trailing={<div class="row"><Button variant="quiet" size="sm" onClick={() => setPref({ restDefaultSec: Math.max(15, p.restDefaultSec - 15) })}>−15</Button><b class="num small">{p.restDefaultSec}s</b><Button variant="quiet" size="sm" onClick={() => setPref({ restDefaultSec: Math.min(600, p.restDefaultSec + 15) })}>+15</Button></div>}><span class="small" data-palace="settings.rest-length">Rest length</span></Row>
            <Row trailing={<Toggle checked={p.showSpark} onChange={v => setPref({ showSpark: v })} label="Daily quote" />}><span class="small" data-palace="settings.spark">Daily quote on Today</span></Row>
          </Card>
        </Section>

        <Section title="Reminders" palace="settings.reminders">
          <Card>
            <Row trailing={<Toggle checked={p.reminders.enabled} onChange={v => { setPref({ reminders: { ...p.reminders, enabled: v } }); void resyncReminders(); }} label="Training day reminders" />}><span class="small">Training day reminder</span><div class="hint">{reminderHealth.value.status}</div></Row>
            <Row trailing={<input type="time" style={{ width: 120 }} value={p.reminders.time} onChange={e => { setPref({ reminders: { ...p.reminders, time: (e.target as HTMLInputElement).value } }); void resyncReminders(); }} />}><span class="small">Time</span></Row>
            <Row trailing={<select style={{ width: 120 }} value={p.reminders.style} onChange={e => { setPref({ reminders: { ...p.reminders, style: (e.target as HTMLSelectElement).value as never } }); void resyncReminders(); }}><option value="silent">Silent</option><option value="vibrate">Vibrate</option><option value="alert">Alert</option></select>}><span class="small">Style</span></Row>
            <Row trailing={<Toggle checked={!!p.reminders.readinessSummary} onChange={v => { setPref({ reminders: { ...p.reminders, readinessSummary: v } }); void resyncReminders(); }} label="Readiness in the reminder" />}><span class="small" data-palace="settings.readiness-reminder">Morning readiness summary</span><div class="hint">Swaps today's reminder for your readiness, when there is one to show.</div></Row>
            {isNative() && !exact && (
              <Row trailing={<Button size="sm" onClick={() => { void requestExactAlarm().then(setExact); }}>Allow</Button>}><span class="small" data-palace="settings.precise-rest">Precise rest alerts</span><div class="hint">Without this, Android may deliver the rest alert a little late.</div></Row>
            )}
            {isNative() && <Button size="sm" onClick={() => { void scheduleRestDone(Date.now() + 5000); showToast('Lock the phone; an alert should arrive in 5 s'); }}>Test rest alert (5 s)</Button>}
            <p class="hint">Your choice stays on even if Android drops the queue. The app re-checks and repairs it when you come back.</p>
          </Card>
        </Section>

        <Section title="Feedback" palace="settings.haptics">
          <Card>
            <Row trailing={<Toggle checked={p.haptics} onChange={v => { setPref({ haptics: v }); setHapticsEnabled(v); }} label="Haptic feedback" />}><span class="small">Haptic feedback</span><div class="hint">{hapticSupport() === 'native' ? 'Android haptics' : hapticSupport() === 'web' ? 'Browser vibration' : 'No vibration on this device'}</div></Row>
            <Button size="sm" onClick={() => { void haptic.warning(); showToast('Sent a test buzz'); }}>Test haptic</Button>
          </Card>
        </Section>

        <Section title="Profile" palace="settings.profile">
          <Card class="stack-sm">
            <Field label="Name"><input value={s.profile.name} maxLength={30} onInput={e => update(x => ({ ...x, profile: { ...x.profile, name: (e.target as HTMLInputElement).value } }))} /></Field>
            <Row trailing={<Button size="sm" onClick={() => { onClose(); profileOpen.value = true; }}>Open</Button>}><span class="small">Weight, height, birth year, goal and more</span></Row>
          </Card>
        </Section>

        <Section title="Watch and health" palace="settings.health">
          <Card class="stack-sm">
            <Row trailing={healthAvailable() ? <Button size="sm" onClick={async () => { const ok = await syncAndStoreHealth(); showToast(ok ? 'Health data updated' : 'Could not read Health Connect'); }}>Sync</Button> : undefined}><span class="small">Android Health Connect</span><div class="hint">{healthAvailable() ? (s.health.connected ? `Last sync ${s.health.lastSync ? formatLocalStamp(s.health.lastSync) : ''}` : 'Not connected') : 'Available in the Android app'}</div></Row>
            {watchSupported.value && <Row trailing={<Button size="sm" onClick={() => setWatchOpen(true)}>Open</Button>}><span class="small">Watch</span><div class="hint">{watchStatus.value.state === 'connected' ? `Connected · ${watchStatus.value.deviceName ?? ''}` : 'Not connected'}</div></Row>}
            {watchStatus.value.state === 'connected' && (
              <Row trailing={<Toggle checked={p.rest.mode === 'heart'} onChange={v => setPref({ rest: { ...p.rest, mode: v ? 'heart' : 'time' } })} label="Rest ends by heart rate" />}>
                <span class="small">Rest ends by heart rate</span>
                <div class="hint">Falls back to the timer if the signal drops.</div>
              </Row>
            )}
          </Card>
        </Section>
        {watchOpen && <WatchSheet onClose={() => setWatchOpen(false)} />}
        {gymsOpen && <GymsSheet onClose={() => setGymsOpen(false)} />}

        <EscobarSettings onClose={onClose} />

        <Section title="Your data" palace="settings.data">
          <Card class="stack-sm">
            <div class="grid-2"><Button onClick={backup}>Export backup</Button><Button onClick={restore}>Restore backup</Button></div>
            {pending && (
              <Card class="card-quiet" role="alertdialog">
                <p class="small">Replace <b>{s.sessions.length}</b> sessions on this device with <b>{pending.next.sessions.length}</b> sessions from {pending.from}?</p>
                <div class="row" style={{ marginTop: 10 }}><Button variant="quiet" onClick={() => setPending(null)}>Cancel</Button><Button variant="danger" onClick={() => applyRestore(pending)}>Replace</Button></div>
              </Card>
            )}
            {rescue && (
              <Row trailing={<div class="row"><Button size="sm" onClick={() => void saveRescue()}>Save rescue file</Button><Button size="sm" variant="quiet" onClick={() => { deleteRescueCopy(); setRescue(false); showToast('Rescue copy deleted'); }}>Delete rescue copy</Button></div>}>
                <span class="small" data-palace="settings.rescue">Unreadable data kept aside</span><div class="hint">A copy of saved data the app could not read at start.</div>
              </Row>
            )}
            <p class="hint">Everything stays on this device. {s.legacyImportedAt ? 'Your history from the previous version was imported automatically.' : ''} Loaded from: {bootSource.value}.</p>
            {!confirmReset ? <Button variant="danger" onClick={() => setConfirmReset(true)}>Reset workout data</Button> : (
              <Card class="card-quiet"><p class="small">Delete all sessions, splits and settings on this device? Export a backup first if unsure.</p><div class="row" style={{ marginTop: 10 }}><Button variant="quiet" onClick={() => setConfirmReset(false)}>Keep</Button><Button variant="danger" onClick={() => { resetEverything(); setConfirmReset(false); showToast('Workout data reset'); void haptic.warning(); }}>Reset everything</Button></div></Card>
            )}
          </Card>
        </Section>
        <div class="stack-sm" style={{ justifyItems: 'center', paddingTop: 8 }}><Logo height={30} /><span class="hint" data-palace="settings.version">Version {APP_VERSION}</span></div>
      </div>
    </Sheet>
  );
}
