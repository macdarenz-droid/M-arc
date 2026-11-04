# Data sources

The builder gets the design, source and decisions from this repository package. The finished app obtains business information through integrations the builder must implement. The preview itself supplies no live gym information.

## Responsibilities

| Information | Intended source | Treatment |
| --- | --- | --- |
| Name, branch, coordinates, address | Approved place provider | Stable provider ID, exact branch matching, provider-specific attribution/retention |
| Opening hours and phone | Provider and separately verified official branch sources | Branch-local timezone, special/overnight hours, missing/old-data states |
| Day passes, memberships, promotions | Gym's official website and accessible official social accounts | Branch-specific published offers with conditions, evidence, dates and review state |
| Photos | Permitted provider API or licensed/authorized gym media | Keep required credits; do not mirror unlicensed social/website galleries |
| Equipment and load increments | User's saved gym profile or independently verified gym information | Do not infer exact equipment from a listing/photo |
| User goals, schedule, workout history | Existing M/arc app data under its sharing controls | Separate from the public gym catalogue |
| Current position / arrival candidate | Device location with the relevant user permission | Foreground discovery and optional background reminders are separate capabilities |

Google Maps/Places is the research's first provider candidate, not an activated service. Validate its coverage, map-display rules, pricing and account terms before choosing it. This OSM prototype does not authorize displaying ordinary Google Places content on an OSM production map. Other provider choices need their own coverage and rights assessment. See the provider section of [RESEARCH.md](RESEARCH.md) for primary documentation and limitations.

## Rate pipeline

```text
Selected provider branch
  → resolve exact branch and official domains/accounts
  → fetch permitted pricing pages, booking pages, PDFs and social posts
  → extract structured offers, text or OCR with evidence references
  → validate branch, currency, amount, period, fees, eligibility and dates
  → review ambiguity/conflicts
  → return applicable published offers with source links and last check
  → refresh on expiry, age, demand and source changes
```

Use server-side acquisition and a shared branch-specific cache so each user's tap does not repeat web research. Do not put service secrets in the PWA or native bundle. Restricted client map keys and private backend credentials are different: apply the selected provider's key restrictions and keep privileged operations on the backend.

Official social sources are part of the intended acquisition scope, not a promise that all accounts or posts are accessible. Use permitted retrieval, authorized APIs or gym-supplied feeds. Do not bypass logins or access restrictions. When no usable rate can be established after a bounded search, show unavailable/needs confirmation and offer website or call as a fallback.

Resolve identity through address, contacts and official cross-links; gym-name similarity alone is insufficient. Distinguish a general chain page from a branch-specific offer. A newer social offer can supersede an older website offer only when plan, eligibility, branch and effective period support that conclusion.

## Record contract

Recommended fields, not an implemented database schema:

- Place identity: internal discovery ID, provider and provider ID, canonical branch match, attribution, independent-source links, field-specific retrieval/source timestamps and retention policy.
- Offer: ID, branch, plan type, amount in minor currency units with currency metadata, billing period, upfront total where stated, minimum commitment, compulsory fees, tax treatment, eligibility, branch coverage, included access, and qualifiers such as “from.”
- Evidence: source URL/type, official-account verification basis, relevant excerpt/reference where retention is permitted, publication date, valid-from and valid-to, last attempted fetch, last successful check, extraction version and reviewer state.
- Review: missing fields, competing evidence, resolution reason and price status such as published, needs confirmation, expired or unavailable. Community reports stay distinct from official offers and direct owner confirmation.

Use separate date fields. Retrieval today does not mean a tariff was published today. An expired promotion cannot occupy the current-price slot; a first-month discount cannot become the ongoing monthly price. A four-week membership is not a calendar month. Never compare annual-upfront equivalents against cancel-anytime monthly plans without their commitments and totals.

## Service boundary

Proposed interfaces can be implemented as typed application services or backend routes; these are capabilities, not existing URLs:

| Capability | Inputs | Output |
| --- | --- | --- |
| Search gyms | Bounded area or query, pagination token, locale | Listings, result/coverage limit, attribution and continuation |
| Get branch details | Provider + stable branch ID, requested fields | Hours/contact/media with provenance and unknown states |
| Get branch offers | Resolved branch ID, locale/currency display preference | Applicable offers, review state and successful-check date |
| Request rate refresh | Branch ID, deduplication/request context | Queued/in-progress/result; bounded by quotas and current job |
| Link training gym | Internal gym ID + confirmed place identity | Validated association, never an implicit workout mutation |

The client does not submit arbitrary URLs for an unrestricted backend fetch. Validate domains and redirects, block private/internal network targets, bound bytes/pages/OCR work and timeouts, rate-limit callers and deduplicate jobs. Treat all fetched text as untrusted evidence; it cannot change extractor instructions or execute Escobar actions. Keep source evidence and public offers separate from private workout/location histories.

## Refresh rules

Use expiry-aware scheduling and demand-based refresh with provider/site budgets; do not claim “live prices” without live evidence. Preserve `lastSuccessfulCheck` on network failure and record `lastAttemptedCheck` separately. A stale cached offer may remain visibly stale where appropriate, while an expired promotion must stop appearing current. Unresolved official conflicts require a needs-confirmation state, not selection of the cheapest amount.

Owner submissions and user corrections are future inputs requiring identity/branch verification and an audit trail. No gym outreach or owner messaging has been performed as part of this handoff.

## Builder inputs

Implementation needs an approved provider/project, restricted map/Places credentials, agreed budgets/quotas, permitted source-acquisition access, backend storage/refresh design and target launch areas for coverage checks. The docs provide a plan, not those accounts or secrets. Public business retrieval must not send users' workout histories or continuous location trails to pricing sources.

Before launch, recheck the current official provider/platform documentation linked in [RESEARCH.md](RESEARCH.md). No new paid service, stored location history or external data sharing is enabled by this design-only package.
