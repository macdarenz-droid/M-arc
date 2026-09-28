// FG-1: hard anatomical limits shared by every exercise (docs/FORM-GUIDE-PRODUCTION.md §2). The correct figure stays in
// the cited coaching ranges (research.json); the mistake may leave those but never these.
// Source: American Academy of Orthopaedic Surgeons, average range of joint motion (Greene WB, Heckman JD, eds.
// The Clinical Measurement of Joint Motion. Rosemont, IL: AAOS; 1994), adult values in degrees.
// Only degree channels with an AAOS entry are listed; shrug_cm, scap_depress_cm, elbow_lead, breath, sway and layer
// have no AAOS row and are bounded by the coaching ranges instead.
import type { SidedBase } from './joints';

export const AAOS_SOURCE = 'AAOS, The Clinical Measurement of Joint Motion (Greene & Heckman, 1994): average adult range of motion';

/** [min, max] in degrees; negative is the opposite motion (extension, adduction, supination, plantar flexion). */
export const AAOS = {
  shoulder_abd: [0, 180],     // abduction 180 (no adduction row: 0 is the arm at the side)
  shoulder_flex: [-60, 180],  // flexion 180, extension 60
  elbow_flex: [0, 150],       // flexion 150
  wrist_pron: [-80, 80],      // forearm pronation 80, supination 80
  hip_flex: [-30, 120],       // flexion 120, extension 30
  hip_abd: [-30, 45],         // abduction 45, adduction 30
  knee_flex: [0, 135],        // flexion 135
  ankle_flex: [-50, 20],      // dorsiflexion 20, plantar flexion 50
  torso_lean: [-80, 25],      // trunk on pelvis: thoracolumbar flexion 80 (forward, -), extension 25 (back, +)
} as const satisfies Partial<Record<SidedBase | 'torso_lean', readonly [number, number]>>;

export type Limited = keyof typeof AAOS;

/** A named measurement and its allowed range (ported from GU-7a's moves/types.ts `Truth`). */
export type Truth = { name: string; value: number; min: number; max: number };

/** The AAOS truth for a channel value; the channel may be sided (`knee_flex_r`). Null when the channel has no AAOS row. */
export function aaosTruth(channel: string, value: number): Truth | null {
  const base = channel.replace(/_[lr]$/, '') as Limited;
  const lim = (AAOS as Record<string, readonly [number, number]>)[base];
  return lim ? { name: channel, value, min: lim[0], max: lim[1] } : null;
}

export const inRange = (t: Truth): boolean => t.value >= t.min && t.value <= t.max;
