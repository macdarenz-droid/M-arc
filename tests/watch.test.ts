import { describe, it, expect } from 'vitest';
import { devicesFrom } from '@/native/watch';

describe('watchDevices batch (PL-13)', () => {
  it('reads the whole list from one event', () => {
    const d = { address: 'AA:BB', name: 'GT6', advertisesHeartRate: true, paired: false, rssi: -60 };
    expect(devicesFrom({ devices: [d, { ...d, address: 'CC:DD', name: 'Band' }] })!.map(x => x.name)).toEqual(['GT6', 'Band']);
    expect(devicesFrom({ devices: [] })).toEqual([]);
  });
  it('ignores anything that is not a batch', () => {
    expect(devicesFrom({ address: 'AA:BB' })).toBeNull();
    expect(devicesFrom(null)).toBeNull();
    expect(devicesFrom({ devices: [null, { name: 'no address' }] })).toEqual([]);
  });
});
