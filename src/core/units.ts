export const KG_PER_LB = 0.45359237;

export function kgToDisplay(kg: number, unit: 'kg' | 'lb'): number {
  const v = unit === 'lb' ? kg / KG_PER_LB : kg;
  return Math.round(v * 2) / 2;
}

export function displayToKg(value: number, unit: 'kg' | 'lb'): number {
  const kg = unit === 'lb' ? value * KG_PER_LB : value;
  return Math.round(kg * 4) / 4;
}

export function formatLoad(kg: number | undefined, unit: 'kg' | 'lb'): string {
  if (kg == null || !Number.isFinite(kg)) return '—';
  return `${kgToDisplay(kg, unit)} ${unit}`;
}
