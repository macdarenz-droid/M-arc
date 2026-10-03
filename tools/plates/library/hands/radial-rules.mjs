// LIB-7: the radial variants the keys share (hands/DESIGN.md §2). Claim refs are `<file>#<cid>` under
// docs/research/howto/ at research 95342b1 (pinned extract: hands/claims.json); `ga:*` refs are archetype defaults a card
// delegates to (pairs.mjs CONVENTIONS), flagged on the sheet. Wrong-angle sizes reuse approved golden-B precedents
// (D-LIB7-5): curled -30 (lat pulldown), bent back +35 with the handle at 1.05 on a push (machine chest press).
// Wrong labels are one pair of words everywhere (D-LIB7-10): "Wrist curled" (flexed) and "Wrist bent back" (extended),
// shared/curl.json's labels and golden B's chest press; rope-rule's "Wrists curl" names the same fault.
export const RULES_FILE = 'tools/plates/library/hands/radial-rules.mjs';

const CURL_THUMB = ['shared/curl.json#c1', 'shared/curl.json#c2'], CURL_WRIST = ['shared/curl.json#c3', 'shared/curl.json#c4'];
/** Curl: handle across the middle of the palm, thumb wrapped, wrist straight while the elbow bends (forearm level).
 *  The load (gravity) does not run along the level forearm, so no force line is drawn (as golden-B's lateral raise).
 *  A level hand is short, so the panel is 170 px tall (lateral raise 130, pull-up 250): same scale, less empty space. */
export const curlVariant = ({ wristClaims = CURL_WRIST, bentBackClaims = ['shared/curl.json#c3', 'shared/curl.json#c4', 'shared/curl.json#c5'], handle } = {}) => ({
  archetype: 'curl', loadAxis: 'across', loadLine: false, panelHeight: 170, wristRange: [-10, 10], contact: 'mid', ...(handle ? { handle } : {}),
  right: { view: 'radial', forearm: 90, wrist: { ext: 0, dev: 0 }, contactAt: 0.6, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'gravity' } },
  rightNote: 'Middle of palm',
  alt: 'Handle across the middle of the palm, thumb wrapped round it, wrist straight in line with the forearm.',
  claims: { thumb: CURL_THUMB, wrist: wristClaims, contact: ['ga:curl-mid'] },
  faults: {
    curled: { label: 'Wrist curled', side: 'flexed', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], claims: ['shared/curl.json#c3', 'shared/curl.json#c4'],
      alt: 'Wrist bent forward, curled toward the forearm.' },
    'bent-back': { label: 'Wrist bent back', side: 'extended', pose: { wrist: { ext: 30 } }, markers: ['lever-arc'], claims: bentBackClaims,
      alt: 'Wrist bent back, the hand tipped away from the forearm.' },
  },
});

/** Push: handle in the heel of the palm, thumb wrapped, wrist straight; Wrong: bent back with the handle in the fingers.
 *  The Right is golden B's approved squat Right (contactAt -0.1, wrist 8 deg; D-LIB7-14, measured by G4) and, as there,
 *  draws no force line: the contact dot, the pivot and the engine's wrist tick (D-LIB7-18a, G6); the forearm stands vertical, as in the pushdown and the skull crusher, so a
 *  single handle with no stated orientation implies none (D-LIB7-12). */
export const pushVariant = ({ thumbClaims, wristClaims, bentBackClaims, handle }) => ({
  archetype: 'push', loadAxis: 'along-forearm', rightLoad: false,
  flags: ['heel contact -0.1 and wrist 8° are golden-B squat drawing values, not claims (D-LIB7-14)'], wristRange: [0, 15], contact: 'heel', ...(handle ? { handle } : {}),
  right: { view: 'radial', forearm: 180, wrist: { ext: 8, dev: 0 }, contactAt: -0.1, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'push' } },
  rightNote: 'Heel of palm',
  alt: 'Wrist straight, handle in the heel of the palm, thumb wrapped. The push runs through the wrist.',
  claims: { thumb: thumbClaims, wrist: wristClaims, contact: ['ga:push-heel'] },
  faults: {
    'bent-back': { label: 'Wrist bent back', side: 'extended', pose: { wrist: { ext: 35 }, contactAt: 1.05 }, markers: ['lever-arc'], claims: bentBackClaims,
      alt: 'Wrist bent back, handle in the fingers. The push passes behind the wrist and levers it further back.' },
  },
});

/** Pull: handle across the base of the fingers, thumb wrapped, wrist not curled; Wrong: wrist curled forward. */
export const pullVariant = ({ thumbClaims, wristClaims, curledClaims, handle }) => ({
  archetype: 'pull', loadAxis: 'across', wristRange: [0, 25], contact: 'base', ...(handle ? { handle } : {}),
  right: { view: 'radial', forearm: 180, wrist: { ext: 5, dev: 0 }, contactAt: 1.0, fingers: { curl: 1 }, thumb: 'wrapped', squeeze: 'firm', load: { kind: 'pull' } },
  rightNote: 'Base of fingers',
  alt: 'Handle across the base of the fingers, thumb wrapped, back of the hand in line with the forearm.',
  claims: { thumb: thumbClaims, wrist: wristClaims, contact: ['ga:pull-base'] },
  faults: {
    curled: { label: 'Wrist curled', side: 'flexed', pose: { wrist: { ext: -30 } }, markers: ['lever-arc'], claims: curledClaims,
      alt: 'Wrist curled forward toward the forearm.' },
  },
});
