# RESEARCH-ROUTES-1: card edits the LIB-SHIP waves wait on

Status `ready` (supervisor, 11-05 ~03:00 UTC). This is one research lane for W4-W7 (D-OWNER-PARALLEL), in the W2B research form: Opus builder, the supervisor's 10 % re-fetch. Base: latest origin/main, on a new branch `claude/research-routes`. Read `claude/libht-research` (a48b0594) only for the W2B form and anything unmerged that touches the same files; report overlap as a question. Model: Opus.

## Why
Several wave rulings route a card-level fix to research. Wave builders never edit research cards. Until each edit is on main, its ids stay in droppable flip commits.

## Part 1: metadata edits (no new source; each edit cites its ruling)
| route | edit | ruling |
|---|---|---|
| D-SHIP-BACKBOX (ruling 6) | add the 21 back-linked ids to `docs/research/howto/shared/back-pain-box.json` `appliesTo` (the list in LIB-SHIP-DESIGN.md / plan; the W2B form) | lib-ship-card ruling 6; #392 Q-W5-9; #393 Q-W6-1 |
| F-W4-INHERIT | cable_shrug: drop `grip.wrist` and `grip.width` from `inherit[]`; dumbbell_shrug: drop `grip.wrist`; sumo_deadlift: drop `plate.equipment` | #391 Q-W4-5, Q-W4-9 |
| F-CARD-FRONTSQ-SETUP | front_squat: fix the inherited setup field that no golden path can hold (F-LB1-SETUP precedent) | #392 Q-W5-5(b) |
| (conditional) straight_bar plate.equipment | only if W5's equipment deep-equal red fails | #392 Q-W5-3 |
| (W7, if ruled) | items the W7 PLAN ruling routes here | #394 |

Each edit keeps every claim and quote. Removing a field from `inherit[]` changes no claim text, so the child's own claims then stand.

## Part 2: routes for held ids (new sources; the 10 % re-fetch applies)
These ids are held (S3) and on the owner's later-update list. Find sources so that each can return in a later wave. If no source supports a field, record "no source" and the id stays held. Never invent.
- bench_dip: thumb placement on the bench edge (F-CARD-BENCHDIP-HAND, #393 Q-W6-5).
- renegade_row: hand archetype and handle grip (F-CARD-RENEGADE-HAND, #393 Q-W6-6), plus its way-out.
- goblet_squat: thumb, wrist and way-out (#392 Q-W5-7).
- cable_external_rotation: a primary muscle, only if W6's D-SHIP-W6-NOPRIMARY fix fails (F-CARD-CER-PRIMARY).

## Files it may touch (write_scope)
- `docs/research/howto/cards/<id>.json` and `docs/research/howto/shared/*.json` for the items above; `sources.json` and quotes for new sources.
- Their MANIFEST keys, only in `[golden update]` commits (D-CROP-PIN form), plus any research-lint pins these files feed.
- Never: sheets, specs, pages, golden B, vendor, CI, `src/**` except generated output.

## Steps
1. Read `.claude/skills/builder/SKILL.md`, this card, and `lib4-cards.md` section 48 (research precedents: W2B, F-LB1-SETUP, the 10 % re-fetch).
2. Post `RESEARCH-ROUTES PLAN @ <sha>` on a draft PR from `claude/research-routes`: per item, the exact JSON edit and its ruling, and for part 2 the candidate sources.
3. Do part 1 first and post `RESEARCH-ROUTES PART 1 READY @ <sha>`. The supervisor re-fetches 10 % and checks the diff, then a fresh reviewer and a train follow, so the waves can flip.
4. Then part 2, and post `RESEARCH-ROUTES PART 2 READY @ <sha>`.

## Acceptance
- Research lint and `npm run check` pass; no claim text changes in part 1; every new claim in part 2 has a fetched quote.
- `npm run test:tz` and the gate pass on a READY head that contains the latest main.
