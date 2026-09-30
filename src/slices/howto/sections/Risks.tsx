// HT-9: "Risks and when to stop" (plan 2.4 item 7), a line-for-line port of golden B's risksSection()
// (tools/plates/layers/artifact/howto-layers.mjs). One shared red-flag block per entry in `howTo.riskFlags`,
// golden B's own order, all four blocks generated into archetypes.ts by HT-5 (HT9-A3; O2 closed 2026-09-30).
// The owner's DISCLAIMER now sits right after this section (owner decision LR-23, 2026-09-30: no sources or
// evidence labels in the app UI, which removed the "Where this comes from" section it used to be emitted with -
// golden-B's own `howto-layers.mjs:264` moves accordingly). Still exactly one node per sheet, text unchanged.
import { chromeIdOf } from '../PlateView';
import { iconBase } from '@/ui/icons';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_KNEE, RED_FLAG_ELBOW, DISCLAIMER } from '@/howto/archetypes';
import type { RedFlagBlock, RiskJoint } from '@/howto/content-types';
import type { SectionProps } from './index';

/** golden B's `I.alert(16)`, byte-equivalent path. */
const AlertIcon = () => <svg {...iconBase(16)}><path d="M12 8v5M12 16.5v.5" /><circle cx="12" cy="12" r="9" /></svg>;

const FLAG: Readonly<Record<RiskJoint, RedFlagBlock>> = {
  wrist: RED_FLAG,
  shoulder: RED_FLAG_SHOULDER,
  knee: RED_FLAG_KNEE,
  elbow: RED_FLAG_ELBOW,
};

export function Risks({ howTo }: SectionProps) {
  const pre = chromeIdOf(howTo);
  const risks = howTo.risks ?? [];
  const flags = howTo.riskFlags ?? ['wrist'];
  return (
    <>
      <section class="hw-sec risks" id={`${pre}-risks`} aria-labelledby={`${pre}-risks-h`}>
        <h4 class="eyebrow" id={`${pre}-risks-h`}>Risks and when to stop</h4>
        <ul class="rk-list">
          {risks.map(r => <li key={r.key}>{r.text}</li>)}
        </ul>
        {flags.map(f => {
          const F = FLAG[f];
          return (
            <div class="redflag" role="note" id={`${pre}-redflag-${f}`} tabIndex={-1} key={f}>
              <AlertIcon />
              <div>
                <p class="rf-name">{F.name}</p>
                <p>{F.now}</p>
                <p>{F.doctor}</p>
              </div>
            </div>
          );
        })}
      </section>
      <p class="ht-disclaimer" id={`${pre}-disclaimer`}>{DISCLAIMER}</p>
    </>
  );
}
