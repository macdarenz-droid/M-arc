/** PLAY-1: the in-app privacy policy (P1, P2 with D-LR23-4) and the healthcare reminder (P3). */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { MEDICAL_LINE, PRIVACY_POLICY_URL } from '@/slices/settings/Settings';

const read = (p: string) => readFileSync(fileURLToPath(new URL(`../../${p}`, import.meta.url)), 'utf8');
const java = read('native/PermissionsRationaleActivity.java');
// The Play Console privacy policy field, as docs/PLAY-SUBMISSION.md records it (DOC-2).
const PLAY_CONSOLE_URL = read('docs/PLAY-SUBMISSION.md').match(/\*\*Privacy policy URL \(Play Console[^\n]*\n(https:\/\/\S+?)\s/)?.[1];

describe('PLAY-1', () => {
  it('A1: Settings links the Play Console privacy URL and shows the healthcare line', () => {
    expect(PLAY_CONSOLE_URL).toBe('https://macdarenz-droid.github.io/M-arc/privacy/');
    expect(PRIVACY_POLICY_URL).toBe(PLAY_CONSOLE_URL);
    expect(MEDICAL_LINE).toBe('Not medical advice. For medical advice, diagnosis or treatment, see a healthcare professional.');
  });

  it('A2: the Health Connect screen loads the same URL in a WebView', () => {
    expect(java).toContain(`static final String PRIVACY_POLICY_URL = "${PLAY_CONSOLE_URL}";`);
    expect(java).toMatch(/new WebView\(this\)/);
    expect(java).toMatch(/\.loadUrl\(PRIVACY_POLICY_URL\)/);
  });

  it('A2: a main-frame network or HTTP error keeps the summary on screen', () => {
    expect(java).toMatch(/onReceivedError\([^)]*\)\s*\{\s*if \(request\.isForMainFrame\(\)\) showFallback\(\);/);
    expect(java).toMatch(/onReceivedHttpError\([^)]*\)\s*\{\s*if \(request\.isForMainFrame\(\)\) showFallback\(\);/);
    // The WebView only replaces the summary once a page finished without an error.
    expect(java).toMatch(/onPageFinished\([^)]*\)\s*\{\s*if \(failed\) return;\s*web\.setVisibility\(View\.VISIBLE\);\s*fallback\.setVisibility\(View\.GONE\);/);
    expect(java).toMatch(/web\.setVisibility\(View\.INVISIBLE\);\s*web\.getSettings/);
    expect(java).toContain('M/ARC reads steps, sleep, heart rate, resting heart rate and active calories from Health Connect');
  });
});
