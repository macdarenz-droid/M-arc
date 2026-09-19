/** Longer rests for strength goals when the default is short (rest_intervals). */
import type { Proposal } from '../contract';
import type { BrainContext } from '../context';
import { REST_SHORT_SEC, REST_STRENGTH_SEC } from '../bands';
import { proposal } from './shared';

export function planRest(ctx: BrainContext): Proposal | null {
  const strength = ctx.goal === 'strength' || ctx.goal === 'strength_muscle';
  if (!strength || ctx.restDefaultSec >= REST_SHORT_SEC) return null;
  return proposal({ kind: 'rest_default', subject: {}, apply: { kind: 'rest_default', seconds: REST_STRENGTH_SEC }, basedOn: [], confidence: 'medium' });
}
