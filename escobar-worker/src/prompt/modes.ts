import generated from '../tools.generated.json';

/** Mode addenda, generated from the app (src/escobar/context/modes.ts). Sent inside the brief, never in `system`. */
export type Mode = 'chat' | 'plan' | 'live' | 'brief' | 'moment' | 'summarize';
export const MODES: Mode[] = ['chat', 'plan', 'live', 'brief', 'moment', 'summarize'];
export const MODE_ADDENDUM = generated.modes as Record<Mode, string>;
