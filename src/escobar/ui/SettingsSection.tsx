/**
 * Settings → Escobar (§20, §21): the online coach switch (first enable goes through the
 * explainer in the sheet), sharing, tone, proactive notes, memory, the server URL, today's
 * usage with a rough cost, and resetting conversations.
 */
import { useState } from 'preact/hooks';
import { state, update } from '@/core/store';
import type { EscobarState } from '@/core/models';
import { todayKey } from '@/core/dates';
import { showPanel } from '@/app/router';
import { showToast } from '@/app/toast';
import { Button, Card, Field, Row, Section, Segmented, Toggle } from '@/ui/primitives';
import { ESCOBAR_PROXY_URL, estimateCost } from '../state';
import { openEscobar } from './open';

const set = (patch: Partial<EscobarState>) => update(s => ({ ...s, escobar: { ...s.escobar, ...patch } }));

export function EscobarSettings({ onClose }: { onClose: () => void }) {
  const e = state.value.escobar;
  const [confirm, setConfirm] = useState(false);
  const [url, setUrl] = useState(e.proxyUrl ?? '');
  const u = e.usage.day === todayKey() ? e.usage : { turns: 0, inputTokens: 0, outputTokens: 0, cacheReadTokens: 0 };
  const cost = estimateCost(u);
  const saveUrl = () => {
    const v = url.trim().replace(/\/$/, '');
    if (v && !/^https:\/\/[^\s/]+/.test(v)) { showToast('Use an https:// address'); return; }
    set({ proxyUrl: v && v !== ESCOBAR_PROXY_URL ? v : null });
    showToast(v ? 'Server saved' : 'Using the built-in server');
  };
  return (
    <Section title="Escobar" palace="settings.escobar">
      <Card class="stack-sm">
        <Row trailing={<Toggle checked={e.enabled} label="Online coach" onChange={on => { if (on) { onClose(); openEscobar(); } else set({ enabled: false }); }} />}>
          <span class="small">Online coach</span>
          <div class="hint">{e.enabled ? 'On. Escobar answers with the model; nothing else leaves the phone.' : 'Off. Nothing leaves the phone.'}</div>
        </Row>
        {e.enabled && (
          <>
            <Row trailing={<Toggle checked={e.sharing.health} label="Share health data" onChange={v => set({ sharing: { ...e.sharing, health: v } })} />}><span class="small">Share health data</span><div class="hint">Sleep, resting heart rate, session heart rate.</div></Row>
            <Row trailing={<Toggle checked={e.sharing.body} label="Share body data" onChange={v => set({ sharing: { ...e.sharing, body: v } })} />}><span class="small">Share body data</span><div class="hint">Weight and measurements.</div></Row>
            <Field label="Tone"><Segmented value={e.tone} options={[{ value: 'warm', label: 'Warm' }, { value: 'direct', label: 'Direct' }]} onChange={v => set({ tone: v })} /></Field>
            <Row trailing={<Toggle checked={e.proactive.enabled} label="Proactive notes" onChange={v => set({ proactive: { ...e.proactive, enabled: v } })} />}><span class="small">Proactive notes</span><div class="hint">A short note after a session or on a Monday.</div></Row>
            <Row trailing={<Toggle checked={e.memoryEnabled} label="Let Escobar remember" onChange={v => set({ memoryEnabled: v })} />}><span class="small">Let Escobar remember</span><div class="hint">Injuries, equipment and preferences you mention.</div></Row>
            <Row trailing={<Button size="sm" onClick={() => { onClose(); showPanel('memory'); }}>View</Button>}><span class="small">What Escobar knows</span><div class="hint">{e.memory.length} item{e.memory.length === 1 ? '' : 's'}</div></Row>
            <div class="small" data-palace="settings.escobar-usage">
              <b>Today</b> <span class="muted">{u.turns} question{u.turns === 1 ? '' : 's'} · {Math.round((u.inputTokens + u.cacheReadTokens) / 1000)}k in · {Math.round(u.outputTokens / 1000)}k out · about ${cost < 0.01 ? cost.toFixed(3) : cost.toFixed(2)}</span>
            </div>
            <Field label="Server" hint="Leave empty for the built-in server."><div class="row" style={{ gap: 8 }}><input value={url} placeholder={ESCOBAR_PROXY_URL} inputMode="url" onInput={x => setUrl((x.target as HTMLInputElement).value)} /><Button size="sm" onClick={saveUrl}>Save server</Button></div></Field>
            {!confirm ? <Button variant="quiet" onClick={() => setConfirm(true)}>Reset conversations</Button> : (
              <Card class="card-quiet"><p class="small">Delete every conversation with Escobar? What he remembers stays until you clear it.</p><div class="row" style={{ marginTop: 10 }}><Button variant="quiet" onClick={() => setConfirm(false)}>Keep</Button><Button variant="danger" onClick={() => { void import('../session').then(m => m.resetConversations()); void import('../images').then(m => m.clearImages()); setConfirm(false); showToast('Conversations deleted'); }}>Delete conversations</Button></div></Card>
            )}
          </>
        )}
      </Card>
    </Section>
  );
}
