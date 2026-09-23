# Watch progress

RUN LOCK: none

## Done this run

- Hardened `native/wear/commandProtocol.mjs`: reject normalized invalid UTC dates and ignore inherited receipt-map properties. Added a regression test for each case. Commit `4b1e27f0d3bd14978e0ed4dd96d86812e4e3ce55`.
- Green CI: M/ARC gate [35885005872](https://github.com/macdarenz-droid/M-arc/actions/runs/35885005872) (source and Android jobs); Agent guard [35885005893](https://github.com/macdarenz-droid/M-arc/actions/runs/35885005893). Source log: 682 unit tests each regular/time-zone run, 2 performance tests, 10 probe tests, 7 command tests, watch lab browser gate passed. Local `npm run check`, probe tests and agent guard passed; local browser gate could not start because Playwright Chromium was unavailable and its download returned an invalid archive. CI installed Chromium and passed that gate.

## Next task

- Gate B: design and implement a transactional native active-workout command store using the existing R2.8 session, entry and set IDs, with a durable receipt and replay test before connecting the watch's Complete action. Review the current Android generation pipeline and store ownership first; no durable `Saved` acknowledgement exists yet.

## WAITING ON OWNER

- Wear Engine application result and approved scopes: recommended answer is to share the actual console approval and scope details when available; UNVERIFIED until then.

## DEVICE QUEUE

- On the real GT6 and paired phone, install the signed probe after approval, record model/firmware/regions/versions and certificate fingerprint; test request/acknowledgement, non-broadcast HR, phone locked/background, display off, and native workout coexistence. Export M/ARC backup before any reinstall.

## Owner answers

- None recorded in this progress file.
