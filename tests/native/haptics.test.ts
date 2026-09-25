/** F4: the semantic haptic vocabulary, per-class throttle, NativeUi-then-Capacitor-then-web backend order. */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const impact = vi.fn(async (_o: unknown) => {});
const notification = vi.fn(async (_o: unknown) => {});
const vibrate = vi.fn(async (_o: unknown) => {});
vi.mock('@capacitor/haptics', () => ({
  Haptics: {
    impact: (o: unknown) => impact(o),
    notification: (o: unknown) => notification(o),
    vibrate: (o: unknown) => vibrate(o),
  },
  ImpactStyle: { Light: 'LIGHT', Medium: 'MEDIUM', Heavy: 'HEAVY' },
  NotificationType: { Success: 'SUCCESS', Warning: 'WARNING', Error: 'ERROR' },
}));
const native = vi.hoisted(() => ({ on: true }));
vi.mock('@/native/capacitor', () => ({ isNative: () => native.on }));

type NativeUiHaptic = (o: { type: string; on?: boolean }) => Promise<{ played: boolean } | void>;
function setNativeUi(fn?: NativeUiHaptic): void {
  (globalThis as { Capacitor?: { Plugins?: { NativeUi?: { haptic: NativeUiHaptic } } } }).Capacitor =
    fn ? { Plugins: { NativeUi: { haptic: fn } } } : undefined;
}

beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-09-25T10:00:00.000Z'));
  vi.resetModules();
  impact.mockClear(); notification.mockClear(); vibrate.mockClear();
  native.on = true;
  setNativeUi(undefined);
});
afterEach(() => {
  vi.useRealTimers();
  (globalThis as { Capacitor?: unknown }).Capacitor = undefined;
});

describe('haptics without a NativeUi plugin (Capacitor fallback)', () => {
  it('tick() calls nothing', async () => {
    const { haptic } = await import('@/native/haptics');
    await haptic.tick();
    expect(impact).not.toHaveBeenCalled();
    expect(notification).not.toHaveBeenCalled();
    expect(vibrate).not.toHaveBeenCalled();
  });

  it('confirm() calls impact Light', async () => {
    const { haptic } = await import('@/native/haptics');
    await haptic.confirm();
    expect(impact).toHaveBeenCalledWith({ style: 'LIGHT' });
  });

  it('two confirm() 50ms apart fire once (80ms class throttle)', async () => {
    const { haptic } = await import('@/native/haptics');
    await haptic.confirm();
    vi.setSystemTime(new Date('2026-09-25T10:00:00.050Z'));
    await haptic.confirm();
    expect(impact).toHaveBeenCalledTimes(1);
  });

  it('success() twice within 1s fires once', async () => {
    const { haptic } = await import('@/native/haptics');
    await haptic.success();
    vi.setSystemTime(new Date('2026-09-25T10:00:00.500Z'));
    await haptic.success();
    expect(notification).toHaveBeenCalledTimes(1);
  });
});

describe('haptics with a mocked NativeUi plugin', () => {
  it('confirm() then tick() 50ms later calls NativeUi.haptic for both', async () => {
    const fn = vi.fn<NativeUiHaptic>(async () => ({ played: true }));
    setNativeUi(fn);
    const { haptic } = await import('@/native/haptics');
    await haptic.confirm();
    vi.setSystemTime(new Date('2026-09-25T10:00:00.050Z'));
    await haptic.tick();
    expect(fn).toHaveBeenNthCalledWith(1, { type: 'confirm' });
    expect(fn).toHaveBeenNthCalledWith(2, { type: 'tick' });
    expect(impact).not.toHaveBeenCalled();
  });

  it('a rejecting NativeUi.haptic makes confirm() call impact Light', async () => {
    const fn = vi.fn<NativeUiHaptic>(async () => { throw new Error('not on this API level'); });
    setNativeUi(fn);
    const { haptic } = await import('@/native/haptics');
    await haptic.confirm();
    expect(fn).toHaveBeenCalledWith({ type: 'confirm' });
    expect(impact).toHaveBeenCalledWith({ style: 'LIGHT' });
  });

  it('a {played:false} reply falls through to Capacitor', async () => {
    const fn = vi.fn<NativeUiHaptic>(async () => ({ played: false }));
    setNativeUi(fn);
    const { haptic } = await import('@/native/haptics');
    await haptic.reject();
    expect(impact).toHaveBeenCalledWith({ style: 'MEDIUM' });
  });
});

describe('setHapticsEnabled', () => {
  it('mutes every backend when off', async () => {
    const fn = vi.fn<NativeUiHaptic>(async () => ({ played: true }));
    setNativeUi(fn);
    const { haptic, setHapticsEnabled } = await import('@/native/haptics');
    setHapticsEnabled(false);
    await haptic.confirm();
    expect(fn).not.toHaveBeenCalled();
    expect(impact).not.toHaveBeenCalled();
  });
});
