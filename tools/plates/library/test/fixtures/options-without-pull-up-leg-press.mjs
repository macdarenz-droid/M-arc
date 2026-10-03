// LIB-6 test fixture: the 8's close-up options minus pull-up and leg press (the mixed-fallback page test).
import { CLOSEUP_OPTIONS as ALL } from '../../render/closeups-8.mjs';

export const CLOSEUP_OPTIONS = Object.fromEntries(Object.entries(ALL).filter(([id]) => id !== 'pull_up' && id !== 'leg_press'));
