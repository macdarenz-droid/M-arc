// LIB-4c (card LIB-4c Do 2; D-LIB4-MODE): the library's CI mode follows the ref and the event (CI cannot see draft or
// ready). Full on main, on merge-train heads and on any workflow_dispatch; affected on every other push.
export const FULL_REF = /^refs\/heads\/(main|claude\/sup-merge-train-\d+)$/;

/** 'full' | 'affected'. */
export const modeOf = ({ ref, event }) => (event === 'workflow_dispatch' || FULL_REF.test(ref ?? '') ? 'full' : 'affected');
