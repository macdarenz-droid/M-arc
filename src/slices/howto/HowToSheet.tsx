// The How-to sheet (HT-3, plan 2.4): the app's Sheet with the eyebrow HOWTO_LABEL and the exercise name, then the
// golden block (PlateView), then the section registry. Every open starts at S0 and nothing is stored.
import { useEffect, useState } from 'preact/hooks';
import { Sheet } from '@/ui/primitives';
import { HOWTO_LABEL, hasHowTo } from '@/howto/ids';
import type { BuiltHowTo, LibId } from '@/howto/types';
import { howToLoadFailed } from './lazy';
import { LoadersContext, type HowToLoaders } from './loadersContext';
import { PlateApiContext, PlateView } from './PlateView';
import type { PlateApi } from './usePlateState';
import { SECTIONS } from './sections';
import './css/plate.css';
import './css/sheet.css';

export interface HowToSheetProps {
  readonly exerciseId: string;
  readonly name: string;
  readonly onClose: () => void;
}

export function HowToSheet({ exerciseId, name, onClose }: HowToSheetProps) {
  const [howTo, setHowTo] = useState<{ built: BuiltHowTo; loaders: HowToLoaders } | null>(null);
  const [api, setApi] = useState<PlateApi | null>(null);
  useEffect(() => {
    let live = true;
    // generated/** is reached only through import() (D-HT1 A4); the data is in before the sheet slides in
    if (!hasHowTo(exerciseId)) { howToLoadFailed(onClose); return; }
    // LIB-2: LOADERS is its own lazy chunk (loaders) and Partial over LibId; a missing loader is a failed load. The
    // module goes down to the sections (LoadersContext), which find their per-chromeId chunks in it.
    void import('@/howto/generated/loaders').then(m => { const load = m.LOADERS[exerciseId as LibId]; if (!load) throw new Error(`no loader for ${exerciseId}`); return load().then(h => ({ built: h.default, loaders: m })); }).then(v => { if (live) setHowTo(v); }).catch(() => { if (live) howToLoadFailed(onClose); });
    return () => { live = false; };
  }, []);
  if (!howTo) return null;
  return (
    <Sheet class="ht" eyebrow={HOWTO_LABEL} title={name} onClose={onClose}>
      <PlateView howTo={howTo.built} onApi={setApi} />
      <LoadersContext.Provider value={howTo.loaders}>
        <PlateApiContext.Provider value={api}>
          {SECTIONS.map(s => <section key={s.id} data-section={s.id}><s.Component howTo={howTo.built} /></section>)}
        </PlateApiContext.Provider>
      </LoadersContext.Provider>
    </Sheet>
  );
}
