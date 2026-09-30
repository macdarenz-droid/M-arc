// HT-4 (HT4-A3): C16, accessibility and meaning (the content-authored part: hotspot/icon rendering is a template
// concern, checked elsewhere). A zoom without alt.right/alt.wrong; a hand zoom without a camera label when the
// engine cannot print one itself (5.1: it only ever prints "above"/"side"); a Right/Wrong pair without both words.
import type { HowToContent } from '../../../src/howto/content-types';

export function checkC16(content: HowToContent): string[] {
  const bad: string[] = [];
  for (const z of content.zooms) {
    if (!z.alt.right) bad.push(`C16: zooms.${z.key}: no alt.right`);
    if (!z.alt.wrong) bad.push(`C16: zooms.${z.key}: no alt.wrong`);
    if (!z.caption.right) bad.push(`C16: zooms.${z.key}: no caption for the right panel`);
    if (!z.caption.wrong) bad.push(`C16: zooms.${z.key}: no caption for the wrong panel`);
    if (z.kind === 'hand' && z.hand) {
      const engineLabels = z.hand.camera === 'side' || z.hand.camera === 'above';
      if (!engineLabels && !z.hand.cameraLabel) bad.push(`C16: zooms.${z.key}: camera "${z.hand.camera}" needs its own cameraLabel`);
    }
  }
  return bad;
}
