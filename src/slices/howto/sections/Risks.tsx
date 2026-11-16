// HT-9: "Risks" (plan 2.4 item 7), a line-for-line port of golden B's risksSection()
// (tools/plates/layers/artifact/howto-layers.mjs). One shared red-flag block per entry in `howTo.riskFlags`,
// golden B's own order, all four blocks generated into archetypes.ts by HT-5 (HT9-A3; O2 closed 2026-09-30).
// F-SHEET-COPY (R1 amended, D-SHEETCOPY-STOPLINE): no "not medical advice" line; the section ends the sheet on STOP_LINE.
import { chromeIdOf } from '../PlateView';
import { iconBase } from '@/ui/icons';
import { RED_FLAG, RED_FLAG_SHOULDER, RED_FLAG_KNEE, RED_FLAG_ELBOW, STOP_LINE } from '@/howto/archetypes';
import { RED_FLAG_BACK } from '@/howto/red-flag-back';
import type { RedFlagBlock, RiskJoint } from '@/howto/content-types';
import type { SectionProps } from './index';
import { useAfterFirstPaint } from './Setup';

/** golden B's `I.alert(16)`, byte-equivalent path. */
const AlertIcon = () => <svg {...iconBase(16)}><path d="M12 8v5M12 16.5v.5" /><circle cx="12" cy="12" r="9" /></svg>;

const FLAG: Readonly<Record<RiskJoint, RedFlagBlock>> = {
  wrist: RED_FLAG,
  shoulder: RED_FLAG_SHOULDER,
  knee: RED_FLAG_KNEE,
  elbow: RED_FLAG_ELBOW,
  back: RED_FLAG_BACK,
};

/** Pure render: no hooks, so it is unit-testable by calling it directly (project convention: no jsdom). */
export function renderRisks(howTo: SectionProps['howTo']) {
  const pre = chromeIdOf(howTo);
  const risks = howTo.risks ?? [];
  const flags = howTo.riskFlags ?? ['wrist'];
  return (
    <section class="hw-sec risks" id={`${pre}-risks`} aria-labelledby={`${pre}-risks-h`}>
      <h4 class="eyebrow" id={`${pre}-risks-h`}>Risks</h4>
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
      <p class="rk-stop">{STOP_LINE}</p>
    </section>
  );
}

export function Risks({ howTo }: SectionProps) {
  return useAfterFirstPaint(3) ? renderRisks(howTo) : null;   // one frame after Setup (D-HT9-A3b)
}
