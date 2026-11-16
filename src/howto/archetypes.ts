// GENERATED, do not edit. Written by tools/plates/generate.mjs (tools/plates/gen/content.mjs). inputsSha256=5b786c073ec318be7e41f9d88d3ca336694ec7be45a1d61dfd2bcf1f8a75e116
import type { RedFlagBlock } from './content-types';

// GENERATED from tools/plates/layers/howto/shared.mjs (HT-5): the shared "Risks" copy, one block per joint, and the
// stop line that ends Risks (D-SHEETCOPY-STOPLINE). No card carries its own red-flag wording (C8).
export const RED_FLAG: RedFlagBlock = {
  "name": "Wrist pain",
  "now": "Can't grip, wrist changed shape, or hand gone numb? Get it checked today.",
  "doctor": "Tingling, keeps coming back, or no better after two weeks' rest? See a doctor.",
  "claim": {
    "tags": [
      "CONSENSUS"
    ],
    "sources": [
      "nhs-wrist-pain"
    ]
  }
};
export const RED_FLAG_SHOULDER: RedFlagBlock = {
  "name": "Shoulder pain",
  "now": "Sudden or severe, after falling, or arm won't move? Get it checked today.",
  "doctor": "Getting worse, very hard to move, or no better after two weeks? See a doctor.",
  "claim": {
    "tags": [
      "CONSENSUS"
    ],
    "sources": [
      "nhs-shoulder-pain"
    ]
  }
};
export const RED_FLAG_KNEE: RedFlagBlock = {
  "name": "Knee pain",
  "now": "Severe pain, badly swollen, changed shape, locking, giving way, or can't put weight on it? Get it checked today.",
  "doctor": "No better after a few weeks? See a doctor.",
  "claim": {
    "tags": [
      "CONSENSUS"
    ],
    "sources": [
      "nhs-knee-pain"
    ]
  }
};
export const RED_FLAG_ELBOW: RedFlagBlock = {
  "name": "Elbow pain",
  "now": "Severe pain and hard to move, heard a snap, changed shape, tingling, or numbness? Get it checked today.",
  "doctor": "No better after a few weeks? See a doctor.",
  "claim": {
    "tags": [
      "CONSENSUS"
    ],
    "sources": [
      "nhs-elbow-pain"
    ]
  }
};
export const STOP_LINE: string = "If something hurts, stop and get it checked.";
