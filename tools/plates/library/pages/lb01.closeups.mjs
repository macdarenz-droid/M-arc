// LIB-SHIP W3 (D-SHIP-Q4, D-SHIP-SHAPES): LB1's close-up options, data only, for render/closeups.mjs's 'zoom' shell,
// keyed as lb01.layers.json's optionsKey. The shell record as pilot-a.closeups.mjs. Hand zooms:
//  - the 7 pair-key ids draw their hand zoom here only for the build; the page swaps that block for the pair panel
//    (LIB-7b). rightNote is the key's (radial-rules.mjs hang and pull variants: 'Base of fingers'); panel heights are
//    golden B's for the same grip family (render/closeups-8.mjs: hanging_leg_raise 250 for the hang, lat_pulldown and
//    seated_cable_row 282 for the pulls);
//  - incline_machine_press and shoulder_press inherit machine_chest_press's hand zoom (INHERIT_MAP): its own note and
//    panel height (machine_chest_press.howto.mjs hand.notes.right 'Heel of palm', hand.panelHeight 150);
//  - the 3 card-no-zoom ids (hands/no-zoom.json) take NO_HAND.
const ZOOM = {
  shell: 'zoom', chipText: { feel: 'Feel' },
  crop: { source: 'engine', landmarks: 'spec', solidPose: 'own', equipment: 'noRays' },
  css: { thumb: 'plain' },
};
// No hand close-up: zoom.mjs calls handZoomOf(mod, o.hand) for every record, which reads o.handleChoiceHint and needs a
// known layout; handZoom() itself runs only for a sheet with a hand zoom, so this layout is never drawn.
const NO_HAND = { ...ZOOM, hand: { layout: 'single' } };
const KEYED = (uid, panelHeight) => ({ ...ZOOM, hand: { layout: 'single', uid, rightNote: 'Base of fingers', panelHeight } });
const MCP = uid => ({ ...ZOOM, hand: { layout: 'single', uid, rightNote: 'Heel of palm', panelHeight: 150 } });
// W3 LAYERS FIX (#384 6648454032, L5): a sheet with a "Seen from behind" zoom (view 'back') takes golden B's
// hanging_leg_raise record for it (render/closeups-8.mjs): backView, and the level and blade-outline styles.
const BACK = r => ({ ...r, crop: { ...r.crop, backView: true }, css: { ...r.css, levelNeutral: true, outlines: true } });
export const CLOSEUP_OPTIONS = {
  chin_up: BACK(KEYED('cu', 250)),
  hanging_knee_raise: KEYED('hkr', 250),
  assisted_pull_up: (r => ({ ...r, css: { ...r.css, fade: true } }))(BACK(KEYED('apu', 250))),   // W3 PANEL FIX 2: Bottom Wrong fade
  inverted_row: KEYED('ir', 282),
  close_grip_pulldown: KEYED('cgp', 282),
  underhand_lat_pulldown: KEYED('ulp', 282),
  // W3 PANEL FIX 2 (#384 6649416891): the Bottom Wrong fades the correct arm (crop wrong.fade)
  single_arm_lat_pulldown: (r => ({ ...r, css: { ...r.css, fade: true } }))(KEYED('salp', 282)),
  straight_arm_pulldown: NO_HAND,
  chest_supported_row: NO_HAND,
  resistance_band_row: BACK(NO_HAND),
  incline_machine_press: MCP('imp'),
  shoulder_press: MCP('sp'),
};
