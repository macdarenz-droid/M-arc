#!/usr/bin/env python3
"""Summarize measured receipt timing. Does not turn software checks into GT6 PASS claims."""
import argparse
import json
import statistics

p = argparse.ArgumentParser(description=__doc__)
p.add_argument("report")
args = p.parse_args()
with open(args.report, encoding="utf-8") as f:
    report = json.load(f)
if report.get("schema") != 1:
    raise SystemExit("Unsupported report schema")
events = report["events"]
samples = [e for e in events if e["kind"] == "hr_sample"]
intervals = [b["elapsed"] - a["elapsed"] for a, b in zip(samples, samples[1:]) if b["elapsed"] >= a["elapsed"]]
roundtrips = [e["data"]["roundTripMs"] for e in events if e["kind"] == "watch_reply"]
print("Run:", report["run"])
print("Environment:", json.dumps(report["environment"], indent=2))
print("Events:", len(events), "Dropped:", report["dropped"], "Persistence:", report["persisted"])
print("Sensor samples:", len(samples), "App replies:", len(roundtrips))
if intervals:
    print("Phone HR receipt interval ms: median", statistics.median(intervals), "maximum", max(intervals))
if roundtrips:
    print("Phone-to-watch-to-phone application reply ms: median", statistics.median(roundtrips), "maximum", max(roundtrips))
print("No synchronized clocks: these numbers do NOT measure sensor latency.")
for e in events:
    if e["kind"] in {"observation", "error", "reply_timeout", "watch_sensor_error", "phone_pause", "phone_resume", "process_restored", "stop"}:
        print(e["at"], e["kind"], json.dumps(e["data"]))
print("Gate A questions 1–6 require the device observations in GATE-A.md; none are automatically marked passed.")
