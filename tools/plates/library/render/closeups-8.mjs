// LIB-6: the close-up options of golden B's 8 exercises (seam D-LIB6-1: LIB-2's data tree provides closeupOptions(id)
// for the library and may take these records over). With these, render/closeups.mjs draws all 8 close-ups byte for
// byte as golden B (proof: test/closeups.test.mjs).
import { ZBOX_OPTIONS } from './closeup/zbox-options.mjs';

const PAGED = { layout: 'paged', panelHeight: 250 };
const CHIP_E2 = { feel: 'Feel' };
export const CLOSEUP_OPTIONS = {
  dumbbell_lateral_raise: { shell: 'zoom', e1: true, chipText: { hand: 'Hand', 'top-height': 'Top height', shoulders: 'Shoulders', feel: 'Feel' },
    hand: { layout: 'framed', uid: 'dlr', rightNote: 'Middle of palm', panelHeight: 130, frontCameraLabel: true, stripLoadLine: true, dropFarFingerWrong: true,
      bendLabel: { dx: -6, dy: -17, anchor: 'end' } },
    crop: { source: 'refSrc' },
    css: { e1: true, endOnInset: true, inset: true } },
  pull_up: { shell: 'zoom', chipText: CHIP_E2,
    hand: { ...PAGED, uid: 'pu', rightNote: 'Top of palm', stripLoad: true, fingerBase: true,
      pages: [{ key: 'p1', label: 'Slipping out' }, { key: 'p2', label: 'Deep in palm' }, { key: 'thumb', label: 'Thumb' }] },
    thumb: { riskRole: true, hookThumb: true },
    crop: { source: 'engine', landmarks: 'zoom', solidPose: 'merged', equipment: 'plate', backView: true, datumZooms: ['top'] },
    css: { thumb: 'subgrid', levelNeutral: true, outlines: true, cap: true } },
  hanging_leg_raise: { shell: 'zoom', chipText: CHIP_E2,
    hand: { ...PAGED, uid: 'hlr', rightNote: 'Base of fingers', pages: [{ key: 'p1', label: 'Slipping out' }, { key: 'thumb', label: 'Thumb' }] },
    thumb: {},
    crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'plate', backView: true },
    css: { thumb: 'plain', levelNeutral: true, outlines: true, pelvis: true, swPain: 'redFlag' } },
  lat_pulldown: { shell: 'zoom', chipText: CHIP_E2,
    hand: { layout: 'paged', uid: 'lp', panelHeight: 282, fit: 'shared', handleChoiceHint: true,
      pages: [{ key: 'p1', label: 'Curled wrist' }, { key: 'p2', label: 'Slipping out' }, { key: 'thumb', label: 'Thumb' }] },
    thumb: { thumbMark: true },
    crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
    css: { thumb: 'plain', thumbMark: true, path: true } },
  seated_cable_row: { shell: 'zoom', chipText: CHIP_E2,
    hand: { layout: 'single', uid: 'scr', panelHeight: 282, bendLabel: { dx: -5, dy: -30, anchor: 'end' } },
    crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
    css: { thumb: 'plain', path: true, spine: true, swPain: 'showme' } },
  ...ZBOX_OPTIONS,
};
