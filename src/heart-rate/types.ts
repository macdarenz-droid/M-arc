import type { HeartRateSummary } from '@/core/models';

export type HeartRateFreshness = 'unavailable' | 'connecting' | 'live' | 'delayed' | 'lost';

export interface HeartRateSample {
  bpm: number;
  /** Wall clock at receipt. Used only to associate a reading with a workout. */
  receivedAtEpochMs: number;
  /** Monotonic clock at receipt. Freshness is judged on this, never on wall time. */
  receivedAtElapsedMs: number;
  contactDetected?: boolean;
  energyKj?: number;
  rrMillis?: number[];
  source: 'ble-heart-rate';
}

export interface HeartRateDevice {
  id: string;
  name: string;
  heartRateAdvertised: boolean;
  bonded: boolean;
}

export interface HeartRateStatus {
  available: boolean;
  state: HeartRateFreshness;
  title: string;
  detail: string;
  deviceName?: string;
  rememberedDevice?: boolean;
  scanning?: boolean;
  batteryPct?: number;
}

export interface HeartRateTrace {
  sessionId: string;
  version: 1;
  startedAtEpochMs?: number;
  /** Absent while the workout is still running. */
  endedAtEpochMs?: number;
  samples: HeartRateSample[];
  summary: HeartRateSummary;
}
