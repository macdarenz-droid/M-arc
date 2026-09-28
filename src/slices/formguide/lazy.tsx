/** GU-7a-2: the form guide is its own chunk, fetched the first time a "How to do it" row is tapped
 * (the shape of src/slices/share/lazy.tsx, but not its failure handler: a failed load keeps this
 * sheet open with a Reload button and never calls onClose, R1-10). */
import type { FunctionComponent } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { Button, Sheet } from '@/ui/primitives';
import type { FormGuidePlayerProps } from '@/formguide/player/FormGuidePlayer';

type Comp = FunctionComponent<FormGuidePlayerProps>;
export type Loaded = { ok: true; Comp: Comp } | { ok: false };

/** Resolves to the player or to `{ ok: false }`; it never rejects and never gets onClose. */
export function loadGuide(importer: () => Promise<unknown>): Promise<Loaded> {
  return importer().then(
    m => {
      const Comp = (m as { FormGuidePlayer?: Comp } | null)?.FormGuidePlayer;
      return Comp ? { ok: true as const, Comp } : { ok: false as const };
    },
    () => ({ ok: false as const }),
  );
}

const importPlayer = () => import('@/formguide/player/FormGuidePlayer');

export function FormGuideSheet({ exerciseId, name, onClose }: { exerciseId: string; name: string; onClose: () => void }) {
  const [loaded, setLoaded] = useState<Loaded | null>(null);
  useEffect(() => {
    let live = true;
    void loadGuide(() => importPlayer().then(m => m.playerFor(exerciseId))).then(r => { if (live) setLoaded(r); });
    return () => { live = false; };
  }, []);
  return (
    <Sheet title={`How to do it: ${name}`} onClose={onClose}>
      {loaded?.ok && <loaded.Comp exerciseId={exerciseId} />}
      {loaded && !loaded.ok && (
        <div class="stack-sm">
          <p class="hint">Demo could not load.</p>
          <Button onClick={() => location.reload()}>Reload</Button>
        </div>
      )}
    </Sheet>
  );
}
