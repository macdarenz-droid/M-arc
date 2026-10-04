// Audit 3, PLAY 01: a reported reply can carry health/body numbers to the built-in server
// (stored 90 days), with "Share health data" off. Correct behaviour: the Data safety draft's
// health and personal-info rows say so (the privacy policy already does, docs/PRIVACY-POLICY.md:49).
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { postReport, reportBody, reportText } from '@/escobar/report';
import { ESCOBAR_PROXY_URL } from '@/escobar/state';
import type { Conversation } from '@/escobar/types';

const conv: Conversation = {
  id: 'c1', createdAt: '2026-10-01T10:00:00Z', updatedAt: '2026-10-01T10:00:00Z', title: 't', mode: 'chat', ledger: [], appVersion: 'x', protocol: 2,
  messages: [
    { role: 'user', content: [{ type: 'text', text: 'How did I sleep?' }] as never },
    { role: 'assistant', content: [{ type: 'text', text: 'Resting heart rate 54 bpm, sleep 6.1 h, weight 82.4 kg.' }], meta: { rendered: { answer: 'Resting heart rate 54 bpm, sleep 6.1 h, weight 82.4 kg.' } } },
  ],
};

describe('PLAY 01 report data flow', () => {
  it('the report path sends health and body numbers to the built-in server, with no sharing check', async () => {
    const text = reportText(conv, [0, 1]);
    const sent: Array<{ url: string; body: string }> = [];
    await postReport(reportBody('wrong', text), { fetchImpl: (async (url: string, init: RequestInit) => { sent.push({ url, body: String(init.body) }); return new Response(null, { status: 204 }); }) as never });
    expect(sent[0].url).toBe(`${ESCOBAR_PROXY_URL}/reports`);
    expect(sent[0].body).toContain('54 bpm');
    expect(sent[0].body).toContain('82.4 kg');
  });

  it('the Data safety health and personal-info rows name the reply-report flow', () => {
    const doc = readFileSync('docs/PLAY-SUBMISSION.md', 'utf8');
    const row = (start: string) => doc.split('\n').find(l => l.startsWith(start)) ?? '';
    const health = row('| Health and fitness (heart rate');
    const personal = row('| Personal info');
    expect(health).not.toBe('');
    expect(personal).not.toBe('');
    expect(health).toMatch(/report/i);
    expect(personal).toMatch(/report/i);
  });
});
