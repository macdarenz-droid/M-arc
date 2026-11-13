# F-HAND-UNDERHAND: underhand How-to hand close-ups drawn palm down (claim from PF5 #419)

Status `not confirmed, no fix card` (verifier, 11-13, on origin/main a4796243). Claim: How-to hand close-ups for underhand
(`under`) and EZ angled (`angled`) grips render palm down, because How-to modules pass no `mirror`.

## Verdict
The app draws every one of these hands palm up. The cited lines are accurate, but the conclusion misses one step: for a
library id that has a pair key, the app never shows the How-to module's own `zooms[hand]`. It shows the shared pair
panel, and that panel is mirrored.

| id | stage | pair key (`HAND_OF_ID`) | app panel | How-to module's own zoom (not shipped) |
|---|---|---|---|---|
| barbell_curl | shipped | curl-bar-under | palm up | palm down |
| dumbbell_biceps_curl | shipped | curl-dumbbell-under | palm up | palm down |
| alternating_dumbbell_curl | shipped | curl-dumbbell-under | palm up | palm down |
| preacher_curl | shipped | ez-curl-under | palm up | palm down |
| ez_bar_curl | shipped | ez-curl-angled | palm up | palm down |
| chin_up | shipped | bar-hang-only-curled-under | mirrored, same as the pair page (forearm 180, so G8 does not measure it) | not mirrored |
| cable_curl, incline_dumbbell_curl | approved-plate | curl-bar-under, curl-dumbbell-under | palm up once shipped (the key's chunk is already shipped) | palm down |
| underhand_lat_pulldown | approved-plate | bar-pulldown-under | mirrored once shipped (forearm 180) | not mirrored |

"Palm up" is G8's measure (`hands/checks.mjs:139-141`): with a level forearm, the handle centre sits above the wrist.
App panels: the handle is at y 141 and the wrist at y 158.7 for the bar, or 163.8 and 182.1 for the dumbbell. How-to own
zoom: the handle is at y 216.4 and the wrist at y 197.5, or 194.9 and 175.0.

Evidence: PNGs in the verifier's scratchpad `hand-verify/`.
- `golden-lb05-*.png` and `golden-lb01-*.png`: the pair panels as built into the pinned layers pages.
- `cmp-<id>.png`: the app panel on the left, the How-to's own unmirrored zoom on the right.
- `report.json`: the numbers above.

For every shipped key, the generated chunk equals `pairPanel(key)` byte for byte.

## Why the app is right
- The app's hand chunk for a library row is `handpair-<key>`. See `tools/plates/gen/ids.mjs:44-45` and `src/howto/generated/loaders.ts:167-177`.
- That chunk is written from `pairs.pairPanel(key)` (`tools/plates/gen/handpairs.mjs:47-60`).
- `pairPanel(key)` calls `renderPair`, which calls `pairSpec`. `pairSpec` adds `mirror: true` for `PALM_UP` (`tools/plates/library/hands/pairs.mjs:114`, `:446-451`).
- A library hand ships only as a pair. Otherwise `noPairCheck` throws (`tools/plates/gen/hands.mjs:183-186`).
- The layers pages swap each row's own hand block for `pairPanel(key)` (`tools/plates/library/build-layers-page.mjs:293-316`). The golden pages `lb05`/`lb01.layers.html` hold only `hp-*` hand svgs.
- The HT6 tuples already state this: "an id on a pair key ships its key's pair panel, not its How-to's hand zoom" (`tools/plates/library/fidelity/tuples.mjs:102-104`).

## Claims checked at file:line
- `tools/plates/layers/engine/hand.mjs:193`: true. `mirror` flips V.
- `tools/plates/library/hands/pairs.mjs:32` and `:114`: true. The claim cited this path as `hands/pairs.mjs`.
- `tools/plates/library/hands/checks.mjs:139-141`: true. This is G8.
- `lib_cable_curl.howto.mjs:68` and `lib_underhand_lat_pulldown.howto.mjs:77-84`: true. `RIGHT_POSE = V.right`, with no mirror and no handle profile.
- `tools/plates/library/render/closeup/hand.mjs:91-92`: true. It draws `z.hand.right` as given.
- `src/howto/content-types.ts:78-90`: true. `HandPose` has no `mirror` field.

None of these reaches a shipped image for the ids above.

## Existing guards (mutation run on a4796243)
Mutation: delete `...(PALM_UP.has(cfg.orientation) ? { mirror: true } : {})` at `pairs.mjs:114`. Result:
- `tests/library/hand-pairs.test.ts` fails 5 tests, including "every drawn id has pages and no problem" with `G8 palm down for underhand`, and "G8: the angled grip drawn without the mirror".
- `node tools/plates/generate.mjs --check` fails: `handpair-curl-bar-under.ts`, `handpair-ez-curl-angled.ts` and others differ.
- Baseline: 48/48 pass. The mutation was reverted.

## Latent risk (no card proposed)
`zooms[hand].hand.right` in the 9 How-to modules has no effect for pair ids. It has no mirror and no handle profile, and
its load line is not stripped. It would draw palm down only if a library hand zoom ever shipped without its pair, and
`gen/hands.mjs:185` refuses that today.

If a future card ever ships a How-to's own hand zoom for these ids, use the smallest fix that cannot be forgotten: derive
`mirror` in `render/closeup/hand.mjs` `handZoomOf`, from `HAND_OF_ID` and `pairSpec(id).right.mirror`. Do not edit 9
How-to modules and the `HandPose` type. Golden B (owner-approved, `tests/howto/golden/howto-layers.html`) has no
underhand grip and is not affected. No pins, goldens or MANIFEST rows move, because no change is proposed.

## Not verified
- The real device. The PNGs come from the pinned layers pages and the generated chunk markup in Chromium, not from the APK.
- Whether chin_up and underhand_lat_pulldown should be mirrored at all. The forearm points up, so the picture has no body reference that fixes palm-toward-you. The app matches the pair page, which supervisor rulings D-LIB7-16 and PALM_UP set. That is consistent, but not judged against a source.
