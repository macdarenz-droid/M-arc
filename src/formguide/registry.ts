// GU-7a: which exercises have a form guide. NO imports: Train.tsx (main chunk) reads it, and the
// guides themselves live in the lazy chunk (R1-10). GU-6's resolver replaces it later.
export const GUIDE_IDS: ReadonlySet<string> = new Set(['lib_machine_chest_press', 'lib_lat_pulldown', 'lib_dumbbell_lateral_raise']);
export const hasGuide = (id: string) => GUIDE_IDS.has(id);
