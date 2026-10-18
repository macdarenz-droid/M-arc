/** PLAY-HR: no feature uses the Health Connect heart-rate permission (session heart rate comes from
 * the Bluetooth watch), so the plugin must no longer request, read or output it. */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const java = readFileSync(fileURLToPath(new URL('../../native/HealthConnectNativePlugin.java', import.meta.url)), 'utf8');

describe('HealthConnectNativePlugin.java', () => {
  it('never mentions READ_HEART_RATE', () => {
    expect(java).not.toContain('READ_HEART_RATE');
  });

  it('never mentions HeartRateRecord outside RestingHeartRateRecord', () => {
    const withoutResting = java.replace(/RestingHeartRateRecord/g, '');
    expect(withoutResting).not.toContain('HeartRateRecord');
  });
});
