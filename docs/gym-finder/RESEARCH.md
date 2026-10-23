# Gym Finder research

**Date:** 1 October 2026. **Audience:** mixed experience levels, as confirmed by the owner. **Scope:** product research, source inspection and proposed QA; no implementation, paid API calls or location collection.

**Recommendation:** add Gym Finder as a way to connect gym discovery, the user's saved equipment profiles and starting a workout. Deliver foreground discovery, active rate sourcing from each gym's official website/social accounts, and explicit gym linking first. Introduce optional arrival reminders only after native-device testing. A three-to-five-minute stay can support a question about a visit; it cannot establish that someone entered the building or trained.

This is a separate feature research note supporting the existing user-adaptation and Escobar reports. Source observations refer to local commit `d5ebc771b3194dc557d469e40945dfa2ddf1f8ab`; other branches and deployed builds were not inspected. The application checkout and original audit files were not changed.

## Current foundation

| Area | Verified implementation | Implication |
|---|---|---|
| Platforms | Preact/Capacitor Android app and PWA; no map, place-search or gym geofence implementation found in the inspected production paths. [Dependencies](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/package.json#L25-L37), [native bridges](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/native/MainActivity.java#L7-L14). | This is a new feature. An iOS background implementation would be separate work. |
| Gym records | Local ID, name, default unit and creation date; maximum eight personal gyms. Equipment profiles attach to gym IDs. [Model](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/core/models.ts#L51-L66). | Discovery results must stay separate from saved training gyms. Browsing should not consume the eight saved slots. |
| Gym suggestion | Uses the previous 56 days of sessions, matching weekday and roughly two hours around the current time; Train can preselect once per app session. [Inference](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts#L293-L318), [caller](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/Train.tsx#L249-L256). | The app already learns a routine from logs. It does not currently detect physical arrivals. |
| Session identity | Starting a workout captures the active gym. Existing load-menu learning uses the gym context. [Session start](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/slices/workout/session.ts#L75-L83), [load learning](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/brain/units.ts#L126-L161). | A confirmed location can help choose the next session's gym. It must not silently change a session already underway. |
| Location permission | Existing fine-location permission is capped at Android SDK 30 for legacy Bluetooth; modern scanning declares `neverForLocation`. [Manifest patch](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/native/patch_manifest.py#L38-L47). | Existing Bluetooth permission does not provide this feature or authorize visit monitoring. |
| Notifications | Rest, training and backup alerts exist. The tap bridge forwards only the notification type. [Delivery](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/native/notifications.ts#L125-L176). | Arrival detection, gym-specific routing, duplicate suppression and stale-tap validation are new work. |
| Storage and privacy | Gym normalization retains only the current fields. Published privacy text says the app does not use location. [Normalization](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/src/core/escobarState.ts#L145-L161), [policy](https://github.com/macdarenz-droid/M-arc/blob/d5ebc771b3194dc557d469e40945dfa2ddf1f8ab/docs/PRIVACY-POLICY.md#L7-L18). | Place links, reminder settings and retained visit evidence require deliberate schema, export, deletion and disclosure changes. |

These are source findings, not a device capability test. Searches covered production source, native wiring, dependencies, permissions, startup, notifications, gym records and persistence.

## User experience

Proposed flow:

1. Tap **Gym Finder**. Open an M/arc-styled map with gym markers and an equivalent list. Retain roads and landmarks for orientation while hiding unrelated business markers.
2. Use the current area with foreground permission, or search a town/address without granting location. Map movement should offer **Search this area**, with bounded requests.
3. Tap a gym to see its branch, address, opening hours, contact details, available rates and photos. Missing information stays missing.
4. Offer **Directions**, **Call**, **Website**, **Save gym** and **Train here** when applicable. Directions can hand off to a navigation app; building navigation is outside this feature.
5. Saving a listing lets the user link it to an existing personal gym or create one. Selecting a search result alone must not change the active gym.
6. **Train here** opens the appropriate workout setup. It does not silently create a completed visit or workout. If another workout is active, open it and make any gym change an explicit decision.
7. Offer **Arrival reminders** separately for a saved gym. Explain background access at that point, and keep manual logging available if permission is declined.

Include an unlisted-gym path for independent gyms, home facilities and private training spaces. An unlisted facility is not an invalid workout location. Accessibility requires a useful list, readable marker selection and screen-reader labels; the map cannot be the only way to choose a gym.

At the current eight-gym limit, **Save gym** and **Train here** must offer an explicit link to an appropriate existing record or gym management. They must not evict a gym, reuse an unrelated ID or attach a new venue to another gym's equipment. Creating an additional training gym requires capacity through a supported, explicit action; increasing the cap is a separate schema/product decision.

## Gym information

Google Places supports location/type search, including `gym`. A Nearby Search response is limited to 20 places, so it is not a complete worldwide directory or proof that all nearby gyms are listed. Use bounded area searches and a separate name search. [Nearby Search](https://developers.google.com/maps/documentation/places/web-service/nearby-search), [place types](https://developers.google.com/maps/documentation/places/web-service/place-types).

| Requested information | Evidence and proposed treatment |
|---|---|
| Opening and closing times | Places has regular and current opening-hour fields; current hours cover the next seven days and can include special hours. Display branch-local time and handle overnight periods. Missing hours mean unknown, not closed. A fresh API response does not prove the business recently verified its hours. |
| Contact numbers | National/international phone and website fields exist. Show them when supplied; do not invent a contact when absent. |
| Rates | Source membership/day-pass rates from the gym's official website and accessible official social accounts. Google's schema offers a price level/range, not a dependable membership tariff; missing Google pricing must not end the search for rates. |
| Photos | Place Photos can supply images with attribution. Photos are descriptive evidence, not proof that particular machines or prices are still available. |
| Equipment | Obtain from the user's gym profile or separately verified gym information. Do not infer exact equipment, load increments or units from the place category or a photograph. |

Field availability and semantics come from the [Place resource](https://developers.google.com/maps/documentation/places/web-service/reference/rest/v1/places). The treatment of unknowns, prices and equipment is this audit's design recommendation.

Rates are a core discovery capability, as clarified by the owner. The app should actively obtain the latest applicable published rates from each gym's own sources. **Website** or **Call** is a fallback after a bounded official-source search finds no usable rate or cannot resolve it. Exact coverage across every gym should not be promised.

Prefer authorized Place Photos or gym-supplied licensed images. Google's photo names expire and cannot be cached; required author attribution must accompany photos. Do not build a permanent mirrored photo library from these responses. [Place Photos](https://developers.google.com/maps/documentation/places/web-service/place-photos). For reusing website/social photographs in the gallery, initially link to the source unless a permitted API, applicable license or rights-holder permission enables reuse. Reading a permitted pricing poster to extract rates and republishing that photograph are separate uses.

## Rate sourcing

This is a proposed service design, not a crawler built or run during the audit. Its purpose is to show sourced rates inside M/arc so the user does not need to research every gym manually.

1. **Resolve the gym.** Identify the exact branch and official website/social accounts using branch address, contact details and cross-links. A matching name alone is insufficient. A chain-wide offer applies only where its stated branch coverage supports that conclusion.
2. **Find pricing sources.** Check membership/pricing pages, linked booking or signup pages, published rate sheets/PDFs, and accessible official social posts or pricing posters. Search results help discover sources; snippets alone should not be treated as the complete offer. Record which sources were checked and which were inaccessible.
3. **Extract the offer.** Use structured fields when present, text extraction for pages/PDFs, and OCR or image interpretation for permitted posters. Extract amount, currency, pass/plan, payment frequency, minimum commitment, compulsory fees, tax treatment when stated, eligibility, branch coverage and included access. Preserve the supporting source reference for each material claim.
4. **Resolve dates.** Store publication/update date, retrieval date and effective/expiry dates separately. A recent post announcing next month's rate is not today's price. A reposted expired promotion remains expired. A page's copyright year or HTTP modification date does not establish when a tariff took effect.
5. **Compare like offers.** Compare the same branch, plan, eligibility and effective period. A new social promotion can be more applicable than an older website tariff, while both may remain valid for different customers. Do not blindly prefer websites, the newest post or the lowest price. Unresolved conflicting official rates remain marked for confirmation, with their sources.
6. **Publish with provenance.** Show the rate, essential conditions, source link and last successful check. Distinguish an official published offer from direct gym confirmation and from a community report. Fetching an official page is not a guarantee that the gym will honor an undated tariff today.
7. **Refresh efficiently.** Propose a shared, branch-specific rate service so every user's map tap does not repeat the same web research. Refresh according to known expiry, source changes, age and demand, within access rights and request budgets. An expired offer leaves the current-price slot even if no replacement can be retrieved. A failed refresh must not advance the successful-check date.

Schema.org's `Offer` vocabulary can represent price, currency, validity and eligibility; that makes structured extraction an option where a site publishes it. It does not establish that gyms actually provide complete markup. Check it against the visible offer. [Offer specification](https://schema.org/Offer).

The source record should retain permitted evidence or a source reference, extraction version, branch match, unresolved fields and review state. An AI model's confidence alone must not turn missing currency, an ambiguous digit or unclear validity into an exact price. Review uncertain posters and material conflicts before promoting them to confirmed fields. If evidence is no longer accessible, retain only what the source permissions allow and keep the original check date visible.

Examples of required handling: a crossed-out standard rate must not replace the discounted amount; a first-month offer must not become the ongoing monthly rate; a monthly equivalent for an annual upfront membership must keep its upfront total and commitment visible; a four-week billing cycle must not be renamed a calendar month. If an offer says “from,” preserve that qualification. Do not invent a missing fee or assume there is none.

Official websites and social accounts are both intended sources. Access differs by site/account/platform. Use permitted retrieval, authorized integrations or gym-supplied feeds, and do not bypass login/access restrictions. Meta's official explanation states that unauthorized automated collection violates its terms; its current terms and API pages were not readable in this audit, so current access coverage remains an implementation check. This does not remove social sourcing from the product scope. [Meta explanation](https://about.fb.com/news/2021/04/how-we-combat-scraping/).

Give gym owners a future authenticated correction/submission route and let users report a changed rate. Ownership and branch authority require verification before an owner submission becomes authoritative. Corrections should preserve an audit trail and trigger review of affected offers. No gym outreach, messages or account connections were performed here.

The acquisition service needs bounded page/image sizes, timeouts, deduplicated fetches, source-specific refresh limits and safe URL handling. Treat fetched text as data rather than instructions to the extractor or Escobar. Keep discovery/price records separate from users' private workouts and location histories. Measure published-rate accuracy, branch accuracy, completeness of conditions, update delay and coverage; a high extraction rate alone is not success.

## Provider choice

**Recommended first candidate:** Google Maps with Places, evaluated against a sample of gyms in the actual launch areas. It matches the requested information and can support an M/arc-styled interface. Google documents hiding business points of interest so the app can draw its own relevant gym markers. [Map styling](https://developers.google.com/maps/documentation/javascript/examples/hiding-features).

For a standard Places API integration, Google specifies Google Maps display when results are shown on a map, attribution and restricted storage. Place IDs can be retained indefinitely; that exception does not apply to every returned field. [Places policies](https://developers.google.com/maps/documentation/places/web-service/policies). The current service terms allow temporary Places latitude/longitude caching for up to 30 consecutive days. Places UI Kit has a separate non-Google-map exception; do not generalize that exception to ordinary Places responses. Applicable EEA terms can differ. [Service terms](https://cloud.google.com/maps-platform/terms/maps-service-terms).

**Design consequence:** separate provider content, the user's own gym/equipment data and independently obtained device-location anchors. Define source and retention for each field. Saving a provider pin does not automatically turn its data into unrestricted user data. If a geofence uses provider coordinates, its persisted registration must obey the applicable coordinate retention rules as well as the app's settings. An independently measured location explicitly saved while the user is there is a different data source, still requiring user permission.

The general terms also restrict bulk extraction, certain directory/re-created-product uses, derived content and using Maps content to train/test/validate AI models. M/arc's independent workout value is relevant, but this audit is not a provider approval of every proposed use. Keep a contract-fit check for saved-place behavior, geofencing and any Escobar processing before launch. Avoid exporting Google content into an AI training/evaluation corpus. [Maps terms](https://cloud.google.com/maps-platform/terms).

Alternatives deserve a coverage comparison if the preferred integration proves unsuitable. Foursquare's current API supports place/category/area search and details, with a separate photo endpoint; coverage and reuse rights still require evaluation. [Search](https://docs.foursquare.com/fsq-developers-places/reference/place-search), [details](https://docs.foursquare.com/fsq-developers-places/reference/place-details), [photos](https://docs.foursquare.com/fsq-developers-places/reference/place-photos). An OSM-based stack offers another route, but the public OSM tile server is a limited, best-effort service and forbids bulk/offline prefetch; free map data does not imply free production infrastructure. [OSM tile policy](https://operations.osmfoundation.org/policies/tiles/).

No provider has been enabled and no coverage benchmark was run. Do not advertise universal coverage or a price advantage based on this documentation review.

## Visit detection

The important distinction is **nearby**, **a plausible visit**, **user-confirmed presence**, and **a workout recorded in M/arc**. These must remain separate facts.

Android geofencing supports dwell events, but its guidance recommends approximately 100–150 metre minimum radii for reliability; background delivery can be delayed by minutes. These regions often include roads, neighboring shops and other floors. Reboot can require re-registration. [Android geofencing](https://developer.android.com/develop/sensors-and-location/location/geofencing).

**Proposed first policy:** monitor a small set of saved, explicitly enabled gyms; test five minutes as the initial dwell threshold. Three minutes can be another tested setting. Neither value is scientifically established or an exact notification deadline. Discovering every passing gym in the background would create extra ambiguity, provider requests and notification burden, so broader automatic discovery should be a later, separately evaluated option.

| State | Evidence | Allowed behavior |
|---|---|---|
| Disabled | Feature or necessary permission unavailable | No monitoring or arrival notifications; manual search and logging remain available. |
| Nearby | Eligible geofence event or fresh foreground location | Hold a candidate; do not report a visit or start a timer that assumes future uninterrupted presence. |
| Plausible visit | OS dwell evidence or sufficient fresh observations, acceptable ambiguity and current permissions | Check whether a prompt would be useful now. A stale single fix plus elapsed wall time is insufficient. |
| Prompted | Eligible event not already handled | Deliver one gym-specific question with a stable event ID and expiry. |
| Confirmed | User explicitly confirms the gym | Offer the correct workout setup. Presence confirmation alone is not a training log. |
| Dismissed | User declines or ignores the prompt | Apply the reminder policy; infer no training, dislike or failure. |
| Ended | Credible exit or candidate expiry | Clear transient state; require a fresh eligible visit before considering another prompt. |

Proposed notification: **At [gym]?** with **Start workout** and **Not now**. The first action opens current workout setup; the app rechecks gym identity and any live session before starting. A location event itself must never start a workout, add sets, change recovery/readiness, award a streak or claim progress.

Use monotonic elapsed time within a device boot, and explicitly reset/reconcile after reboot. Store enough bounded state to deduplicate callbacks and process restarts. A missed observation is unknown, not evidence of continued presence or departure. An uncertain gap invalidates the candidate or requires renewed evidence. Exit hysteresis should prevent GPS jitter from manufacturing repeated visits.

Proposed prompt rules: one per visit, an initial maximum of one arrival prompt per local day, quiet hours, per-gym opt-out, and suppression when a workout is active, today's relevant workout is already complete, or the user marked the day off. Those are product defaults to evaluate; they are not platform limits. Manual tracking must still permit a second session or a spontaneous rest-day workout. Midnight alone must not create a new visit.

Nearby gyms in one building require an explicit branch choice when ambiguous. A gym employee, someone living above a gym, a person waiting in traffic or someone visiting a neighboring café can remain in the area for much longer than five minutes. Dwell never proves exercise. Optional reminder windows and **Do not remind here** are more useful than pretending to solve these cases through GPS precision.

## Regular gyms

Build on existing gym-linked workout history. Prioritize the user's pinned preferences and confirmed session choices. Support multiple regular gyms, temporary travel gyms and a manual correction. Do not promote a venue because someone drove past it repeatedly or stayed nearby for a long time. An arrival confirmation is weaker evidence of training use than a deliberately gym-linked workout.

Preserve stable local gym IDs when a provider listing changes name, moves, closes or gets a replacement ID. Linking a new listing must not merge histories by name. Deleting/unlinking a listing should not silently delete workout history or another gym's equipment. Retain the existing active session's gym until the user intentionally changes it through a supported flow.

Distinguish correcting a mistaken gym assignment from physically moving to another gym. With the current session-level gym identity, require a separate session for a real move after work has been logged. A future cross-gym session would need per-set provenance. Even an explicit gym switch must not relabel Gym A's committed sets as Gym B's work or teach Gym B the wrong equipment loads. A correction needs a review of affected records and derived learning.

The finder can improve adaptation by loading the confirmed gym's known equipment menu and units. For a new gym, equipment remains unknown until configured. The original improvement findings ENG-01, UI-R06, IMP-E04 and IMP-N01 cover relevant wrong-gym, deletion, stale-proposal and notification-race dependencies; those fixes must precede automation that relies on them. They were not re-executed here.

## Escobar role

Escobar should help with the next useful decision after gym selection. Proposed examples:

- The user selects a saved gym: offer today's planned session with that gym's verified equipment context.
- The user has limited time: offer a shorter feasible session, respecting the earlier adaptation report's time-budget and programme-protection rules.
- The user visits a new gym: ask which relevant equipment is available and offer substitutions; do not copy another branch's machine loads.
- The user is travelling: use the explicitly chosen temporary gym without replacing their preferred regular gym.

Use deterministic local logic for proximity, eligibility, units and session identity. No language model call is needed to decide whether to show an arrival reminder. By default, keep raw coordinates and movement history out of Escobar. Passing even a named gym or inferred visit to a remote coach is a distinct data-sharing choice that must be included in the future feature's scope.

Do not feed provider photos, listings or a gym website into unrestricted action tools. A fetched page is untrusted content. If later research retrieval is added, bind claims to a branch and source date, constrain external links/actions, and resolve provider terms before sending Maps content to an external model. A deterministic listing card can display authorized place details without asking Escobar to restate them.

## Platform scope

Foreground browsing should work without background permission. Native arrival reminders require a separate implementation. Android documents foreground/background access separately; approximate-only access and revoked permission must produce an honest degraded mode. Background access is subject to Google Play's core-functionality review, prominent disclosure and declaration requirements; convenience alone does not guarantee approval. [Android permissions](https://developer.android.com/develop/sensors-and-location/location/permissions), [Google Play background location](https://support.google.com/googleplay/android-developer/answer/9799150).

Notification permission is separate. An enabled preference is not proof that the OS will deliver an alert. Android 13 and later have a runtime notification permission. [Notification permission](https://developer.android.com/develop/ui/views/notifications/notification-permission).

A PWA cannot promise this closed-app behavior through ordinary web geolocation: the specification's position-request steps depend on an active, visible document. The standard Capacitor Geolocation plugin also does not directly provide background geolocation. [W3C Geolocation](https://www.w3.org/TR/geolocation/), [Capacitor Geolocation](https://capacitorjs.com/docs/apis/geolocation). A future iOS version would need its own Core Location design and validation; the current Android/PWA source does not establish iOS support. [Apple condition monitoring](https://developer.apple.com/documentation/corelocation/monitoring-the-user-s-proximity-to-geographic-regions).

Test normal backgrounding, force-stop, reboot, battery restrictions, location-service disablement and devices lacking the chosen native location service. Do not promise identical behavior across these cases or seek another permission/service to bypass a denial. The existing watch service is not a location-monitoring substitute.

## Data boundaries

Recommended future design: process visit candidates on the phone, keep short-lived event evidence, and retain no continuous route by default. Persistent personal gym anchors, reminder choices and any confirmed visits need a documented retention/deletion purpose. The feature can infer regular gyms from workout history without storing a second lifetime location history.

Map browsing still communicates with a provider: a search centre, typed area and map viewport can reveal location even if arrival classification stays on-device. Audit actual SDK traffic, telemetry and server logs before claiming that location is local. A proxy changes who receives requests; it does not remove disclosure obligations. Do not send workout history or body/health data to the map service merely to fetch nearby gyms.

Turning reminders off must remove owned geofences and pending prompts, invalidate in-flight callbacks and stop rescheduling. Recheck authorization at delivery and at notification tap. Reset/delete/restore should use a generation marker so late native events cannot recreate removed state. Restore/import must not silently reactivate permissions or arrival reminders on another device. Manual search, existing saved equipment and logging should remain usable when the provider is offline.

These are recommendations for the builder's data design. The repository's existing owner rules reserve approval of new stored/sent data and new paid providers to the owner. No approval is being requested for this research, and no such service or data collection was activated.

## Cost controls

The current global Google list quotes these monthly free caps and first paid-tier prices in USD per 1,000 events: Nearby Search Pro 5,000/$32; Place Details Enterprise 1,000/$20; Photos 1,000/$7; Dynamic Maps 10,000/$7. Basic native Maps SDK loads have a different listed treatment. These are dated list prices, not a quote for this app or every billing region. [Pricing](https://developers.google.com/maps/billing-and-pricing/pricing).

Illustrative monthly workload: 10,000 Nearby Search Pro requests, 5,000 Enterprise details requests, 10,000 photo requests and 10,000 Dynamic Maps loads gives **$303** after those free caps, before taxes, backend, other APIs, region-specific terms or discounts: $160 + $80 + $63 + $0. This is a workload example, not a user-count forecast or spending authorization.

Opening hours, phone and website fields trigger Enterprise Place Details billing. The field mask matters; requesting everything is inappropriate. [Place Details billing fields](https://developers.google.com/maps/documentation/places/web-service/place-details). Load a bounded set of results, fetch expanded details/photos as needed, cancel stale area searches, limit image dimensions and avoid querying on every map movement or geofence callback. Measure actual usage: a lower-tier search plus many detail calls is not automatically cheaper than a richer search.

Restrict keys appropriately and use the supported client SDK or an authenticated, narrowly scoped server endpoint for web-service access. An endpoint must not relay arbitrary provider calls. [Google security guidance](https://developers.google.com/maps/api-security-best-practices). Propose server-enforced request limits and a spending circuit breaker as well as billing alerts; never rely only on a mutable device counter. Cache only where the selected provider permits it.

## Delivery order

| Stage | Deliverable | Evidence required before release |
|---|---|---|
| 1 | Manual-area/foreground Gym Finder, list, details, photos and active official-source rate retrieval for launch coverage | Coverage sample, branch/offer/date extraction accuracy, unresolved-rate states, usable denial/offline states, attribution, field billing and authenticated-request checks |
| 2 | Explicit saved-gym linking and workout setup | Identity/migration/export/reset tests; no active-session overwrite; correct gym units/equipment; prior dependent defects resolved |
| 3 | Optional arrival reminders for enabled saved gyms | Native lifecycle tests, Play eligibility path, disclosed data flows, real-device latency/false-prompt/battery results |
| 4 | Better regular-gym suggestions and Escobar session preparation | Correctable preferences, travel handling, usefulness compared with simple suggestions, no unsupported location/training claims |
| Later | Broader unfamiliar-gym detection, expanded partner rate feeds, authenticated owner submissions, equipment and images | Expand the initial rate-sourcing coverage with a separate rights, data and operating-cost case |

## QA cases

The following are acceptance requirements to implement and test, not tests run in this research.

| Scenario | Required outcome |
|---|---|
| Location denied or approximate only | Area search and manual gym selection remain useful; no false claim of precise arrival detection. |
| No gyms returned | Explain the search result, allow another area/name or manual gym; never claim no gyms exist. |
| Dense area with more than a response can return | No completeness claim; bounded refinement without bulk harvesting. |
| Unknown, holiday or overnight hours | Correct branch timezone and unknown state; no stale automatic “open” claim. |
| Expired promotion or different branch tariff | Do not present it as today's price for this branch. |
| Google has no price but an official gym page/post does | Continue to official sources and display the usable sourced rate; do not stop at a contact link. |
| New social rate conflicts with older website pricing | Resolve branch, plan, eligibility and effective period; flag a genuine unresolved conflict instead of choosing arbitrarily. |
| Future rate, undated tariff or reposted poster | Distinguish publication, successful retrieval and offer validity; no automatic “latest/current” certification. |
| OCR sees crossed-out figures, multiple columns or fine print | Validate amount-to-plan association and conditions; ambiguous digits/currency remain unconfirmed. |
| Introductory offer, annual commitment or four-week billing | Preserve the actual payment schedule, fees and restrictions; do not advertise a misleading monthly price. |
| Refresh is blocked, a post disappears or access expires | Keep the original successful-check date and permitted evidence; no false freshness or bypass. |
| Missing/expired photo | Graceful fallback, correct attribution, no broken session controls. |
| Drive-by, traffic queue or neighboring café | No training record; suppress when evidence is insufficient and measure mistaken prompts in real trials. |
| Several gyms in one building | Resolve ambiguity; no nearest-coordinate assertion of entry. |
| Gym worker or home above gym | Per-location opt-out and bounded reminders; long dwell is never training evidence. |
| Stale fix, observation gap or GPS jitter | No invented continuous dwell, repeated visit or precise indoor claim. |
| Duplicate callbacks, process restart or midnight | One eligible prompt; stable event handling survives ordinary restart. |
| Reboot, force-stop or battery restriction | Honest availability; reconcile only when permitted; do not claim an exact timer guarantee. |
| Location/notification/reminder switched off during processing | Latest state wins; no new owned prompt or persistent event from a late callback. |
| Gym deleted, unlinked or moved before notification tap | Validate current identity and expiry; do not revive deleted data. |
| Manual gym choice or live workout conflicts with detection | Preserve explicit choice and captured session context. |
| Move from Gym A to Gym B after logging sets | Use a separate session under the current model; Gym A's sets cannot enter Gym B's equipment/load history. |
| Save or train at a new venue with eight gyms saved | Explicit linking or gym management; no silent eviction, ID reuse or wrong-gym assignment. |
| Prompt opened hours later or tapped twice | Expired prompt cannot start the wrong session; repeat tap cannot duplicate one. |
| Day off, quiet hours or completed workout | Suppression policy respected; manual workout remains available. |
| Travel or several regular gyms | No silent permanent preference replacement or history merge. |
| New gym with unknown equipment | No invented machine increments or transferred gym-specific loads. |
| Provider outage, quota exhaustion or revoked key | Core logging remains available; no retry storm or paid fallback without authorization. |
| Reset/restore/import during native callback | Removed state stays removed; monitoring is not silently reactivated. |
| Data-flow inspection | Verify searches, SDK telemetry, logs and coach payloads against the published privacy contract. |

Evaluate reminders using user-labelled outcomes: correct gym, useful timing, mistaken prompts, missed eligible visits, disablement and measured battery change against a comparable baseline. Measure detection-to-delivery latency distributions rather than promising minute five. Include outdoor, mall, urban, neighboring-business and poor-reception settings. A no-error result on a finite device sample is not proof of universal reliability. Notification taps and app opens alone do not establish better training outcomes.

## Research status

Completed: read-only source tracing, official provider/platform documentation review, product/QA critique, cost arithmetic and linked-source range checks. Not completed: paid provider queries, local gym coverage comparisons, native geofencing prototypes, user-location collection, device trials, policy approval, legal clearance or efficacy testing. No application code, dependencies, repository-root files or deployments were modified. This note is a builder handoff, not an implemented feature or a release certification.
