import type { LoadUnit, LoggedSet } from './models';

export const KG_PER_LB = 0.45359237;

const round = (v: number, places: number): number => { const f = 10 ** places; return Math.round(v * f) / f; };

/**
 * Canonical kg to a number in `unit`. kg keeps two decimals (1.25 kg plates survive);
 * lb rounds to 0.1, so any kg that came from a typed lb value (stored to 3 decimals)
 * converts back to exactly what was typed.
 */
export function kgToDisplay(kg: number, unit: LoadUnit): number {
  return unit === 'lb' ? round(kg / KG_PER_LB, 1) : round(kg, 2);
}

/** A typed value to canonical kg, unrounded to 3 decimals (§25.3), so it survives its own round trip. */
export function displayToKg(value: number, unit: LoadUnit): number {
  return round(unit === 'lb' ? value * KG_PER_LB : value, 3);
}

export function formatLoad(kg: number | undefined, unit: LoadUnit): string {
  if (kg == null || !Number.isFinite(kg)) return '—';
  return `${kgToDisplay(kg, unit)} ${unit}`;
}

/** The load of a logged set in `unit`: exactly what was typed when it was typed in that unit, else converted from kg. */
export function setLoadIn(set: Pick<LoggedSet, 'kg' | 'entered'>, unit: LoadUnit): number | undefined {
  if (set.entered && set.entered.unit === unit) return set.entered.value;
  return set.kg != null ? kgToDisplay(set.kg, unit) : undefined;
}

/** Like formatLoad, but for a logged set: it respects the entered value. */
export function formatSetLoad(set: Pick<LoggedSet, 'kg' | 'entered'>, unit: LoadUnit): string {
  const v = setLoadIn(set, unit);
  return v == null ? '—' : `${v} ${unit}`;
}

/** The "≈ 20.4 kg" hint under an input whose entry unit differs from the display unit. */
export function approxIn(kg: number, unit: LoadUnit): string {
  return `≈ ${round(unit === 'lb' ? kg / KG_PER_LB : kg, 1)} ${unit}`;
}

/** Records a typed load: canonical kg plus exactly what was typed. */
export function enteredLoad(value: number, unit: LoadUnit): { kg: number; entered: { value: number; unit: LoadUnit } } {
  return { kg: displayToKg(value, unit), entered: { value, unit } };
}
