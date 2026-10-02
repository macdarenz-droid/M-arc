# Feature logic

This is the product/implementation specification accompanying the executable design source. Proposed behaviour below is not implemented merely because it appears in a mock screen.

## Behaviour map

| Feature | Working in prototype | Required production behaviour |
| --- | --- | --- |
| Escobar entry | Composer suggestion and Gym Finder row open the map | Use current navigation/router; retain the existing five main tabs |
| Map | Sourced central-Makati geometry projected with D3 | Approved map integration, pan/zoom, bounded area search, attribution and loading/error states |
| Gym pins | Three selectable dumbbell markers | Real gyms in the requested area; clustering or bounded results at wider zoom; selection also available in a list |
| Search | Filters three sample names/addresses | Town/address, gym-name and area search; manual-area path when location is denied |
| Details | Sample branch, status, hours, prices and phone | Field-specific source, freshness and unknown states; branch-local time and overnight/holiday hours |
| Prices | Sample day-pass/monthly values and source dialog | Official website/social acquisition, full conditions, validity, conflicts and refresh states |
| Photos | Not included | Attributed provider photos or permitted gym-supplied media; useful no-photo fallback |
| Save | In-memory set, optional wrapper state | Explicitly link to an existing personal gym or create within supported capacity; never alter a workout merely by browsing |
| Train here | Preview dialog | Confirm gym and equipment through existing workout setup; respect active-session state |
| Call / directions | Preview dialogs | Validate available number/destination, then hand off on user action; don't invent missing fields |
| Reminders | Per-fixture local toggle | Separate opt-in, permission/device implementation, dwell policy and notification lifecycle |
| Themes | Five verified palette snapshots | Canonical engine subscription plus provider-style adapter; future registered themes and retained map state |

## Source functions

In `prototype/source.html`:

- `applyTheme`, `textSafeFill`, `contrast`: read the embedded catalogue, assign semantic aliases and preserve readable primary-button text.
- `visibleGyms`: local sample-name/address and saved filters.
- `choose`: update the selected card, price fields, hours and save/reminder state.
- `renderMap`: project sourced GeoJSON, draw parks/roads, label selected roads and bind pin selection.
- `renderList`: render the same filtered sample gyms as accessible button rows.
- `setExpanded`, `showFinder`, `showEntry`: local screen/sheet states.
- `persist`: optional preview-host state only; not the M/arc persistence API.
- `dialog`, `message`: illustrative external-action dialogs and brief status messages.

The embedded `mf-map-data` is source geometry, `mf-theme-data` is the theme snapshot, and `gyms` contains clearly fictional business details. Production UI must render external strings as text or through framework escaping. Do not reuse the prototype's fixture-only `innerHTML` assembly for untrusted provider or website content.

## State rules

Keep `selectedPlace`, `linkedTrainingGym`, `activeSessionGym`, search area and arrival candidate as separate state. A map tap changes only selection. Saving links an external venue to a stable internal gym ID. Starting or changing a workout is an explicit action through the existing session APIs.

Search requests use cancellation/version IDs so older responses cannot replace a newer query. Debounce text input, bound area/radius/result counts and page sizes, and fetch detailed fields only when needed. Map motion should offer Search this area rather than continuously issuing paid requests. Preserve usable core workout tracking during provider outages.

Details distinguish loading, available, unknown, stale, expired, conflicting, inaccessible and failed refresh. Unknown hours never mean closed. An unavailable price never becomes zero/free. Show exact-price qualifiers and compulsory fees; never substitute a Google price level for a membership tariff.

## Training link

The inspected app has up to eight personal gyms and gym-specific equipment/load learning. Discovery records must not consume those slots until explicitly linked. At capacity, offer linking to the correct existing gym or gym management; never silently evict or reuse an unrelated ID.

With no active session, Train here resolves the internal gym and equipment profile before opening workout setup. With an active session, open that session and explicitly handle any proposed gym change. Map selection, arrival confirmation and a reminder tap must never create sets, complete a workout, alter recovery or retroactively change old gym identities.

Escobar may help choose a suitable gym or prepare a session using the user's stated budget, goal, schedule and verified equipment. Explain the reason for a recommendation and unknown constraints. Do not infer machine availability, crowding, exact equipment or live indoor presence from a photo, a gym category or elapsed time near coordinates.

## Arrival states

`disabled → nearby candidate → plausible visit → prompted → confirmed / dismissed / expired`

Monitor only saved gyms the user has enabled in the initial version. Fresh foreground observations or supported OS dwell evidence can create a plausible visit. A stale location fix followed by a JavaScript timeout cannot. Test five minutes as the initial policy; three minutes is an alternative to validate, not proof of entry or a guaranteed delivery time.

Before prompting, recheck permission, feature enablement, candidate freshness, branch ambiguity, existing workout, recent prompts and quiet/decline settings. Assign an event ID and expiry. Notification taps revalidate that event and its linked gym. Dismissal records no workout or failure. Exit cancels the candidate; reboot, permission revocation, deletion, reset and import must reconcile registered regions and pending notifications.

Sidewalk traffic, neighboring businesses, employees, apartment floors and GPS drift can all resemble a gym visit. Ask the user rather than asserting entry. Indoor presence and completed training remain separate facts.

## Integration points

Verify these on the implementation branch: `src/theme/themes.ts`, `src/theme/engine.ts`, `src/core/models.ts`, `src/core/store.ts`, gym normalization in `src/core/escobarState.ts`, gym inference/load context in `src/brain/units.ts`, `src/slices/workout/Train.tsx`, `src/slices/workout/session.ts`, `src/native/notifications.ts` and native permission wiring.

The historical research provides pinned source references. The notification bridge, persistence schema, export/import/reset and privacy/store declarations need coordinated design before native reminders ship. No implementation paths or endpoint names proposed in these documents should be mistaken for existing APIs.
