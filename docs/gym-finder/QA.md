# QA handoff

## Completed checks

The local exported concept was inspected in a browser. Pin selection, expansion, source dialogs, the Escobar entry and theme changes were exercised. All five catalogue themes rendered 276 map paths without shell horizontal overflow. The Paper expanded sheet fit a 320px browser viewport (286px content width), with actions above navigation. Computed ordinary primary-button contrast ranged from 4.55:1 to 7.52:1 after the concept's text-safe fill adjustment. No browser warning/error was recorded during that pass.

These are prototype checks, not production app, backend, API, geofence or physical-device tests. Earlier full-app audit results retain their own pinned commits and limits. The generated standalone export contains the same fragment; its inclusion does not make the production app use the map.

## Acceptance matrix

| ID | Implementation acceptance | Failure cases |
| --- | --- | --- |
| GF-01 | Foreground discovery and list return provider results with attribution | No location permission, no results, quota, offline, slow response, stale request race |
| GF-02 | Exact branch identity and honest details | Duplicate names, chain vs branch, moved/closed gym, missing phone, unknown/overnight/holiday hours |
| GF-03 | Rates actively sourced from official websites and accessible official socials | No page, inaccessible account, poster OCR ambiguity, missing currency, compulsory fee, conflicting offers |
| GF-04 | Applicable offers include evidence and full material conditions | Expired/future promotions, first-month discount, annual upfront, four-week billing, eligibility, “from” pricing |
| GF-05 | Refresh dates and stale states are accurate | Failed fetch must not advance successful-check date; expiry invalidates current promotion |
| GF-06 | Every registered theme restyles the whole feature | Paper contrast, Ember/Emerald foregrounds, Midnight marker boundary, new synthetic theme, preserved camera/selection/sheet |
| GF-07 | Save/link preserves stable internal gym identity and capacity rules | Eight-gym limit, wrong-branch match, duplicate links, deletion, import/export/reset |
| GF-08 | Train here goes through existing setup/session logic | Active workout, unit mismatch, missing equipment, denied location; no implicit set/session creation |
| GF-09 | Optional arrival prompt uses fresh, qualified evidence | Passing traffic, adjacent gym, other floor, stale GPS, coarse accuracy, staff/commuter patterns |
| GF-10 | Reminder lifecycle is consistent on real devices | Reboot, force-stop, revoked permission, battery restrictions, duplicate/delayed events, exit/re-entry, stale notification tap |
| GF-11 | Escobar uses only justified, permitted context and cites business facts | Unknown equipment, stale price, malicious source text, disallowed data sharing; no fabricated certainty |
| GF-12 | Discovery remains bounded and does not degrade tracking | Huge area, rapid pan/query, large images, provider outage, background battery/network budget |
| GF-13 | Accessible selection and useful non-map paths | Keyboard, screen reader, zoom/text scaling, contrast, touch targets, missing icons/CDN in prototype |
| GF-14 | Provider and source rights are reflected in code and retention | Expired photo references, attribution omission, unsupported cross-provider mixing, unauthorized persistent cache |

All rows are requirements for the future implementation. None is checked off merely by this document's existence. Builders must link tests/probes/device evidence to the exact implementation commit, and run the repository's required release gates when the production change is ready for review.

## Delivery checks

This delivery contains only `docs/gym-finder/**` plus the two supporting research documents under `docs/research/`. Verify relative file links, runnable export/source consistency, provenance and absence of secrets before publishing. The original audit branches stay unchanged. No fixture should be copied into a production provider fallback.
