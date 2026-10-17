# Review and red team of the clock fix

Raw research output (agents, 2026-10-17). Paths under /tmp/... were the watch lane session's scratch folder; its tools are now in native/wear/tools/redteam.

```json
{
 "review": {
  "verdict": "pass_with_fixes",
  "findings": [
   {
    "severity": "medium",
    "title": "The amended D1 never recreates the failure, so passing it cannot show the fix works",
    "file": "docs/watch-cards/WATCH-C.md",
    "line": 71,
    "scenario": "The owner runs D1 as written: lab Connect, M/ARC open, then 10 Completes. JS is live, so j (the time from the native receipt until JS handles the hello) is a few ms. The old 0d507ae0 code gives the same offset to within j/2, so it also has no future_time and a lead in range. A pass would be read as 'fixed' although the new path (rxAt well before t) never ran. The 1.1.2 failure needs a start where the hello reaches Java while M/ARC's JS is not running.",
    "evidence": "D1 only adds 'no future_time and a lab lead from -5 s to +1 s'. The Device runs header still says 'lab Connect' with nothing about a native gap. README line 200 puts the failure on hellos answered right after `! native gap up 8898.1s`. In probe 2, runs A and F show JS 4.3 to 9.3 s late only after such a pause; in foreground runs JS was 2 to 23 ms behind.",
    "fix": "Add a D1 variant (or D8): leave M/ARC in the background until the lab shows a native gap of 1 min or more, open the watch app first, wait about 15 s, then open M/ARC and do the Completes. Require each hello row to show `js +N ms` of 10 s or more, so the condition is known to be met, plus the lead window and no future_time. A run whose hello js is small does not count as evidence for this fix."
   },
   {
    "severity": "low",
    "title": "The inferred cause does not fit probe 2's numbers, and the screenshot cannot rule out a hold before Java's receiver",
    "file": "native/wear/README.md",
    "line": 200,
    "scenario": "Under the old formula the offset error is (d1 - d2 + j)/2. Here d1 runs from the watch's hello send to Java's receipt, d2 from the phone's send to the watch's JS, and j from the native receipt to JS handling. A set is flagged only if actionAt - rxAt = E - L > 5 s, where E is the offset error and L the time from tap to Java receipt. That needs j > 10 s + 2L. Probe 2's largest delay (9.3 s) gives E of at most 4.65 s, which could not flag any set. If the hello was instead held before Java's receiver (d1 large: the watch's send queue right after io.connect(), or HMS holding it), the result is the same, and the midpoint does not cure it. 1.1.2 has never had a run with a normal foreground start, so neither cause is excluded.",
    "evidence": "Watch link.js:219 `o = Math.round(m.pt - (m.wt + now) / 2)`; commands.ts:102 `future = c.actionAt > receivedAt + FUTURE_SLACK_MS` (5000). The README cites 'JS saw the first messages ... 4.3 to 9.3 s' and says the offset 'came out ahead by half the delay'. Neither the screenshot nor 1.1.2 logs j, the watch's rtt or the offset. The 3 sets not flagged fit a constant E slightly over 5 s + L: rows 4 and 8 each come right after two rest commands (2-3 and 6-7, the only non-Completes), so they likely waited in the one-in-flight outbox. The README does not discuss them.",
    "fix": "State what the hypothesis requires: j over about 10 s in this run (longer than anything probe 2 measured), and an E just above 5 s, so the three unflagged sets are the ones with a longer tap-to-receipt time (rows 4 and 8 waited behind rest commands). List 'hello held before Java's receiver' as an alternative that the screenshot cannot exclude and the fix would not cure. The next run's `js +N ms` hello rows will tell the two apart. Also soften the code comment in sendSnap (watchLink.ts:165-166), which states the link as fact."
   },
   {
    "severity": "low",
    "title": "The 'Still possible' list leaves out the phone's send hop, which makes the offset run behind without a flag",
    "file": "native/wear/README.md",
    "line": 202,
    "scenario": "t (T3) is JS `now()` at the start of sendSnap, before the snapshot is built and before the Capacitor hop. WearEnginePlugin.send then posts to the main thread (`onMain(\"send\", ...)`) before Huawei's p2p.send. If the main thread stalls or freezes after JS calls send, d2 includes the stall. This run logged exactly such a gap (`! native gap up 5.6s`) after both hellos reached Java. With the fix, the error becomes -(d2 - d1)/2: a 5.6 s stall puts the offset 2.8 s behind. Gate B then saves min(actionAt, receivedAt) = actionAt, a set time 2.8 s early with no flag, and D1's -5 s bound accepts the lead.",
    "evidence": "watchLink.ts:171-173 `const t = now(); ... pt: Math.round((rxAt + t) / 2)`; WearEnginePlugin.java:124 `onMain(\"send\", () -> { ... transmit(...) })`. The midpoint makes pt - (wt + arrival)/2 equal the NTP estimate \u03b8 + (d1 - d2)/2 (checked algebraically), so whatever stays in d1 or d2 still enters at half weight. 'At most half the round trip of the sample used' is true, but after a gap the watch's round trip includes j (seconds). The bound that applies is (round trip - phone hold)/2 = (d1 + d2)/2, and that is what probe 2's 93 to 623 ms figures measure.",
    "fix": "Name both sides in Still possible: the phone's hop from JS through the main thread to Huawei's send (d2), and any hold before Java's receiver (d1), each entering the offset at half. Say that only an error ahead is flagged, and an error behind saves early times silently. Word the bound as half of (round trip minus the phone's hold). A native send stamp would remove the d2 part, but WearEnginePlugin.java is reserved, so record it as a follow-up."
   },
   {
    "severity": "low",
    "title": "D1's -5 s lower lead bound is looser than D1's own 3 s Saved limit",
    "file": "docs/watch-cards/WATCH-C.md",
    "line": 71,
    "scenario": "lead = E - L. 'Saved within 3 s' in the same D1 line means the tap-to-receipt time L is under 3 s, so a correct offset (within about \u00b10.3 s from probe 2's round trips) gives a lead of at least about -3.3 s. A lead of -4.5 s therefore means the offset is at least 1.5 s behind. Gate B never flags a behind offset (it saves actionAt), and D1 would still pass it.",
    "evidence": "commands.ts:103 `Math.min(c.actionAt, receivedAt)`: an early actionAt is saved as it is. Code comment on lead(): 'positive means the watch's clock offset runs ahead'. Since L >= 0, a lead only puts E between lead and lead + L, so 'The lead ... shows it' overstates what one row proves. The +1 s upper bound is sound: it is stricter than the 5 s flag.",
    "fix": "Tighten the lower bound to about -3.5 s, which follows from the 3 s Saved limit, or compare each set's saved `at` with the tap time the owner notes (as D2 to D6 do, \u00b12 s). Say that a lead bounds the offset error only to within the tap-to-receipt time."
   },
   {
    "severity": "low",
    "title": "The README says every new test fails on 0d507ae0; one passes there",
    "file": "native/wear/README.md",
    "line": 201,
    "scenario": "Running the new tests in a scratch copy that holds 0d507ae0's watchLink.ts: 'a hello seen by JS late...', 'the lab row of a first answer...' and the contract test fail, but 'without a usable receipt time, and in snaps that answer no hello, pt is the send time' (tests/watch-link.test.ts:552) passes. The card requires 'Each test fails before and passes after'.",
    "evidence": "In the red run that test shows a \u2713 while the other three show \u00d7. As a guard it works: removing `&& rxAt < t` from watchLink.ts:173 turns it red (1 failed | 30 passed).",
    "fix": "Call it a guard test in the README and PR, and name the mutation that turns it red (dropping the `rxAt < t` guard). Or reword 'each failing on 0d507ae0' so it covers only the three red tests."
   },
   {
    "severity": "nit",
    "title": "No test covers the minus sign of a negative lead",
    "file": "tests/watch-link.test.ts",
    "line": 560,
    "scenario": "Changing lead() to always print '+' (`lead +${(Math.abs(d) / 1000).toFixed(1)}s`) leaves all 35 tests green. A lead of -2.0 s would then read '+2.0s' on device, which looks like an offset ahead and fails the D1 window for the wrong reason.",
    "evidence": "Mutation run: 'Tests 35 passed (35)'. Only '+7.1s' is asserted.",
    "fix": "Add a case where rxAt is later than actionAt (for example by 400 ms) and expect 'lead -0.4s'."
   }
  ],
  "notes": "Checks run: the full diff 0d507ae0..d303bbce; watchLink.ts, wearEngine.ts route, WearEnginePlugin.java (receiver and send), watch link.js (hello, onSnap, rx, tick) and commands.ts read. On d303bbce, tests/watch-link.test.ts and tests/watch-contract.test.ts pass (35/35), the full vitest suite passes (219 files, 3031 tests) and typecheck is clean; all three ran in a scratch copy (/tmp/claude-0/-home-user/c3b0d6bb-4284-56fb-97f3-76b9c2b50d59/scratchpad/red), and nothing in the checkout was touched. With 0d507ae0's watchLink.ts in the scratch copy, 3 of the 4 new tests fail for the right reasons: pt 1792144814000 instead of ...807000, the lead row missing, and future_time present. No existing test line is edited or removed (the diff only adds test lines). The existing row regexes (lines 267, 294, 326) still pass and are not loosened. native/wear/app is unchanged.\n\nRoot cause: with pt = (T2 + T3)/2, the watch's pt - (T1 + T4)/2 is exactly the NTP offset estimate \u03b8 + (d1 - d2)/2. Rounding on each side is at most 0.5 ms. Under the old code the error was (d1 - d2 + j)/2, so the claimed j/2 lead is right. The rtt filter takes the first sample of a run unconditionally (rtt < 0) and replaces it only with a lower-rtt sample or one past the clock-jump clause. Since rx resets due = tk + 20 on every message, a bad start sample does persist while snaps keep coming. After the fix the watch still ranks samples by full rtt, which includes the phone hold, so it may prefer a low-hold sample with worse radio asymmetry; that is minor and needs a later hello. Rest commands use receivedAt and cannot be flagged. Watch storage time only lowers the lead. The two start hellos both carry the same bias, and the lower-rtt one wins.\n\nWhat the screenshot proves: 8 Completes had actionAt - rxAt > 5 s, so for those the offset was more than 5 s ahead, assuming a steady watch clock. Both hellos reached Java right after the 2.5 h uptime gap. A 5.6 s main-thread gap came after both hellos were forwarded and before the first command, and hidden 0 means JS handled the hellos while visible. What it cannot show: j, d1, the watch's rtt or offset, or a watch clock step (1.1.2 shows none of these).\n\nCode checks: rxAt comes from System.currentTimeMillis() on Huawei's callback thread, the same clock as Date.now(). The lab passes the native rxAt when it is finite and its own receive time otherwise; the link's default is now(). In those fallback cases rxAt and t differ by about 0 ms, so pt is about t. The `rxAt < t` guard falls back to t. A hello while hidden is dropped before the branch, and the visible snap carries wt null. While held, the js row is logged and no snap goes. When stopped, it returns early. Snaps that answer no hello keep pt = t. The rest countdown is still taken at t. pt keeps the same digit count, so the 700 B limit is unaffected, and lastKey/projection zero pt. lead appears on first answers, including rejected and not_saved, and never on replays; types are sound. An edge that is not a defect: an rxAt slightly in the future would print 'js +-5ms', the same format as the lab's existing rx row.\n\nDoc numbers check out: 76 s, the counters, the flagged list 1, 5, 9, 10, 12-15, uptime 8898 s \u2248 2.47 h, and round trips 93-623 ms plus one of 4.6 s. The card's Device runs header still says watch 1.1.0; that predates this diff."
 },
 "redteam": {
  "verdict": "pass_with_fixes",
  "findings": [
   {
    "severity": "low",
    "title": "A run whose start hellos get no answer has no clock sample, and the fix's rxAt could supply one",
    "file": "src/native/watchLink.ts",
    "line": 202,
    "scenario": "The owner opens the watch app while M/ARC's JS is live but hidden (phone locked or in the background, before Android freezes it). Both start hellos reach JS and are dropped ('mw hidden hello'). Or both hello answers fail to send (206), and then a change snap goes. The owner then opens M/ARC, and the visibilitychange snap goes with wt null. The watch now has a snap, so Complete is enabled, but off is still 0 and rtt is still -1. Every reply resets due = tk + 20, so while sets come every few seconds the watch never sends another hello. actionAt is the raw watch clock: a watch 8 s behind the phone saves every set 8 s early with no flag, and a watch 8 s ahead gets future_time. This gap existed before the diff, but it belongs to the same 'phone JS late' family the fix targets. How much it matters depends on the GT 6's clock offset from the phone, which no run has measured.",
    "evidence": "Code path: watchLink.ts:202 returns on hidden before the hello branch. :244 the visible snap is sendSnap(null), so wt is null. :180 a failed send only logs. Watch link.js:55 starts with off = 0 and rtt = -1. :220 takes a sample only when hellos.indexOf(m.wt) >= 0. :100 actionAt = io.now() + off. :259 every rx sets due = tk + 20. Probe tests/zz-rt-clock.test.ts (real watch link.js ticking each second, real createLab route, createLink and Gate B). RT3, watch 8 s behind, hidden until the owner opens M/ARC: sets [{err:-8000,future:false} x3], rows 'mw hidden hello' x2. RT3, watch 8 s ahead: future_time x3. RT7, both hello answers return 206 and then a setSet change snap goes: [{err:-8000,future:false} x3]. With the prototype below, RT3 and RT7 give err 0 for every set, and tests/watch-link.test.ts (31/31) and tests/watch-contract.test.ts (4/4) stay green. I reverted the prototype afterwards.",
    "fix": "Phone only, about 6 lines in watchLink.ts. Keep `owed = {wt, rxAt}` for the latest hello not answered: set it in the hidden branch when m.v === MW_VERSION, m.k === 'hello' and wt is a number, and set it again when a hello answer's send is not SEND_OK. In sendSnap, use `ans = wt !== null ? {wt, rxAt} : owed`, build the snapshot with ans.wt and pt = round((ans.rxAt + t)/2), and clear owed once the snap goes. The midpoint keeps the offset right however long the answer waited. The watch takes the sample only if it is the run's first or has a lower round trip, so it is harmless for D6 (a run that already has a sample). Nothing is handled or sent while hidden. Add RT3 and RT7 as tests: both are red on d303bbce."
   },
   {
    "severity": "low",
    "title": "A watch clock step after the start sample is never corrected while sets flow, and the README does not list it",
    "file": "native/wear/README.md",
    "line": 202,
    "scenario": "The watch takes its offset from the start hellos. Its wall clock then steps, for example when Huawei Health syncs the time. Sets come every 5 s, so every snap resets the 20 s hello timer, and the clock-jump clause (link.js:220) never runs. A +8 s step saves every later set at its receipt time with future_time. A -8 s step saves them 8 s early with no flag. The fix does not touch this, and the screenshot cannot rule it out as a cause: for that, the step would have had to land between the start sample and command 1.",
    "evidence": "Probe RT5 (+8 s watch step 25 s into the run, a set every 5 s): sets 1-3 err 1 ms, sets 4-8 future_time; only 2 hello rows in the whole run. link.js:100 reads io.now() for actionAt. link.js:219-222 runs the clock-jump check only on a hello answer. link.js:259 resets due on every rx. README:200 says the bad offset 'kept ... for the whole run' but names only the JS delay as the cause.",
    "fix": "Add to 'Still possible': 'a watch clock step after the sample; no hello goes while snaps keep coming, so it lasts until 20 s of silence'. Add a reading rule for the next run's rows: a lead that stays the same from the first set points to a bad start sample, and a lead that jumps between rows points to a clock step. Record a watch follow-up for a later build, not this fix: send a hello after each applied set, or every N ticks even while snaps arrive."
   },
   {
    "severity": "low",
    "title": "The cause paragraph misquotes probe 2 run A and leaves out the run F detail that makes the hypothesis work",
    "file": "native/wear/README.md",
    "line": 200,
    "scenario": "The paragraph says that in runs A and F 'the phone's JS saw the first messages after such a pause 4.3 to 9.3 s after Java had them'. Run A's record says 'phone app open' and logs no pause. Run F's record says JS saw the messages 'when the owner opened the app'. So j is however long the owner takes to open M/ARC, and the 4.3 to 9.3 s figures are not an upper bound. This refines the reviewer's finding 2: a j over about 10 s, which the flags need, is what to expect when the watch app is opened first and M/ARC more than about 10 s later. The two visible hello rows, with no third, also bound j below 20 s: a longer JS freeze would have produced a third hello from the 20 s timer.",
    "evidence": "README:138 (A: 'Native ack off, phone app open ... reached Java on time but JS only 9.3 s and 4.3 s later'). README:143 (F: '... JS saw the messages only 7.2 to 7.6 s later, when the owner opened the app'). Watch index.js:37 plus link.js:142 show that the two start hellos come from registerReceiver onSuccess and load()'s finish, milliseconds apart. Probe RT1 models that timeline: Java woken at once, JS frozen 15.6 s, 11 Completes every 5 s. On the old pt, 11/11 are future_time. On d303bbce none are, each is saved at the tap, and the rows read 'mw hello ... js +15450ms' and 'lead -0.1s'.",
    "fix": "Reword: 'In probe 2 run F, a message woke the frozen app and Java answered at once, but JS saw it only when the owner opened M/ARC (7.2 to 7.6 s later). Run A, with the app open, saw 4.3 and 9.3 s on its first two messages.' Then state the condition: the watch app was opened first and M/ARC 10 to 20 s later (the run shows two hellos, not three). Drop 'after such a pause' for run A."
   },
   {
    "severity": "nit",
    "title": "New with the fix: a phone clock step between the native receipt and JS moves the offset by half the step, with no flag",
    "file": "src/native/watchLink.ts",
    "line": 173,
    "scenario": "JS is frozen after Java stamps rxAt, and the phone's wall clock steps by S (an NTP or network time correction) before JS sends. pt = (rxAt_old + t_new)/2 is S/2 off the true midpoint. A forward step makes the offset run S/2 behind, so sets are saved early without a flag. A backward step smaller than j makes it S/2 ahead; a larger one is caught by the rxAt < t guard. Under the old pt, the step added nothing. This is rare, but the window is exactly the long JS freeze the fix targets.",
    "evidence": "Probe RT4 (+6 s phone step 5 s into a 15 s JS freeze, watch clock unchanged): d303bbce sets [{err:-3000,future:false} x3]. The old pt gives future_time x3 from j/2, so neither formula is right there.",
    "fix": "Name it in 'Still possible'. A monotonic pair (SystemClock.elapsedRealtime() at receipt and at the native send) would remove it, but WearEnginePlugin.java is reserved, so record it as a follow-up only."
   },
   {
    "severity": "nit",
    "title": "The new contract test never ticks the watch, so the two start hellos, the 20 s re-hello and the watch's sample choice are untested",
    "file": "tests/watch-contract.test.ts",
    "line": 157,
    "scenario": "The X test sends one hello and never calls watch.tick() or watch.show(). The real start sends two hellos (load finish and registerReceiver onSuccess), and a JS freeze over 20 s adds a third. Then the lowest-round-trip choice and the answer order decide which sample sticks. If a later change broke the midpoint only for the second or newest hello, this test would still pass.",
    "evidence": "Probes RT1 and RT2 drive the real link.js with a 1 s interval, watch.show(), a 35 s JS freeze (3 hellos: 'js +34850ms' x2 and 'js +14850ms'), with the backlog handed over in order and newest first, and a watch 37 s behind. Both pass on d303bbce (6/6 sets err 0). RT2-old is red on the old pt (6/6 future_time), as is RT1-old (11/11 future_time).",
    "fix": "Add RT2 (or RT1) as an X test. It fails on 0d507ae0 and passes on d303bbce, so it meets the card's rule."
   }
  ],
  "notes": "I could not break the change itself. Probe file: /home/user/M-arc/.claude/worktrees/wf_70819483-83a-2/tests/zz-rt-clock.test.ts (12 tests, all green on d303bbce; run with `npx vitest run tests/zz-rt-clock.test.ts`). The worktree is detached at d303bbce. The only change left in it is that untracked probe file; I reverted the prototype in watchLink.ts. Nothing in /home/user/M-arc was touched.\n\nSimulation: the real watch link.js, ticking every 1 s and calling show() for the second start hello. Java is modelled as stamping rxAt when a message arrives (d1 = 150 ms) and handing it to JS through createLab.receive and route only after a set JS freeze. The phone's createLink and handleWorkoutCommand (Gate B) run as written, and the snap reaches the watch d2 = 150 ms later. The 'old' variant routes hellos without rxAt, which gives 0d507ae0's pt = t.\n\nWhat held:\n(1) Device timeline (RT1). On the old pt every set is future_time; on the fix none are, and each is saved at the tap.\n(2) A JS backlog of 3 hellos (RT2), handed over in order and in reverse, with the watch 37 s behind: every offset comes out right. Answers to older hellos after newer ones are fine: with the midpoint each sample's error is (d1 - d2)/2 whatever j is, and |o - off| <= rtt/2, so the clock-jump clause never fires on a stale answer.\n(3) rxAt missing or later than t falls back to pt = t (the existing guard test).\n(4) Hold, hidden and stopped send nothing. With Hold on, the js row is still logged, and once Hold is off the watch's next 20 s hello is answered.\n(5) D2 to D6. Late answers after a cut or after M/ARC is swiped away carry an rtt far above the run's sample, so the watch ignores them, and their offsets are right anyway. D2's reopened watch run takes its first sample after Bluetooth returns. D6 keeps its earlier sample.\n\nPaths that make the offset run behind (saved early, never flagged):\n- a stall in the phone's send, reviewer finding 3. RT6 reproduces it: a 5.6 s stall gives -2.8 s on every set;\n- a forward phone clock step during j (finding 4);\n- a watch behind the phone with no sample (finding 1);\n- a backward watch step (finding 2).\n\nLog-order reading, inferred and not verified: the visible rows (gap 8898 s, then two hellos, then gap 5.6 s) are exactly the order Java emits if the hellos woke the frozen process (probe 2 F), Android froze it again, and the owner opened M/ARC 5.6 s later. Under that reading the 5.6 s gap ended before JS ran, so it is not in d2. Also, if JS had been live (M/ARC opened first), a 5.6 s stall in the send would have pushed the old offset behind, not ahead. So the JS-frozen cause explains future_time without further assumptions; the other causes need a watch-side hold of more than 10 s or a watch clock step. The new 'js +N ms' and 'lead' rows in the next run settle it. Unverified: which app the owner opened first."
 }
}
```
