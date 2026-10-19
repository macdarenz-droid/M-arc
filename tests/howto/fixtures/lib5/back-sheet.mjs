// LIB-5 (D-LIB5-WORDS (b)): a neutral sheet for sheetWords, never a typed HowToContent (RiskJoint has no 'back' until
// Do 9): golden B's hanging leg raise (442 visible words, one wrist box) with 'back' added to its riskFlags. The box
// it is counted with comes from the test (neutral stand-in text, never the research wording).
import * as M from '../../../../tools/plates/layers/exercises/hanging_leg_raise.howto.mjs';

export * from '../../../../tools/plates/layers/exercises/hanging_leg_raise.howto.mjs';
export default { ...M.default, riskFlags: [...(M.default.riskFlags ?? ['wrist']), 'back'] };
