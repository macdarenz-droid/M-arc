New phone test app: https://github.com/macdarenz-droid/M-arc/actions/runs/39051286436/artifacts/12109371477 (download MARC-DEBUG-APK, run 2144). Watch app 1.3.0 attached (private: it carries your name and your watch's ID).

What changed on the watch:
- With M/ARC closed on the phone, you keep logging the next sets of the exercise (up to 8 actions). They save at your tap times when you open M/ARC.
- When a rest runs out: "Rest done", one vibration, and OK.
- Tap the kg value to change kg and reps: + and -, or swipe up and down; swipe left or right to switch between kg and reps; Done.
- Your heart rate on Set and Rest.
- The "Phone not connected" title and "Pending" now show.

Safety first: use a practice workout, not a real one. If M/ARC Watch closes by itself even once, stop and tell me the step and the screen, and put 1.2.0 back with DevEco Assistant.

Before you start
1. M/ARC: Settings, Export backup.
2. Install this APK over your current M/ARC. Don't uninstall.
3. Install watch 1.3.0 over 1.2.0 with DevEco Assistant.
4. On the watch: Settings, Permission manager, M/ARC Watch, allow Body sensors.
5. M/ARC: Settings, turn on "Start rest after each set".
6. Start a practice workout with at least 2 weight exercises of 5 or more sets each (no bodyweight or timed ones).
7. M/ARC: Settings, tap Version 7 times, Watch lab, Connect. Then open M/ARC Watch.

F1. Logging with M/ARC closed. Close M/ARC on the phone (swipe it away from recent apps). On the watch, log 3 sets of the same exercise, with a rest after each (let it run or tap Skip). Write down the time of each Complete set tap. Then open M/ARC; if the sets don't appear within 30 s, open Watch lab and tap Connect. Expected: 3 sets saved, each at the time you tapped. Screenshot of the exercise card and of Watch lab with the "mw cmd" lines.
F2. Rest done. Keep your arm up so the watch screen stays on, and let a rest run out. Expected: "Rest done", one vibration, and OK takes you back to the set. (With the arm down the watch closes the app after about 25 s, so nothing shows then.)
F3. kg and reps. On the set screen, tap the kg value. Change kg with + (or swipe up), swipe left to reps, change them, tap Done, then Complete set. Expected: the phone saves those kg and reps.
F4. Heart rate. Expected: a "bpm" line on Set and Rest that updates about every 5 s. If it says "Allow Body sensors", do step 4 again.
F5. Phone not connected. Turn phone Bluetooth off and tap Complete set. Expected within 30 s: the "Phone not connected" title and "Pending". Turn Bluetooth on, wait until Huawei Health shows the watch connected, then tap Connect in Watch lab.
F6. Whole workout. Finish the practice workout from the watch, at least 12 sets with rests. Expected: no crash.

Then tap Finish and press and hold "Hold to discard"; don't tap the save buttons. Turn "Start rest after each set" off again if it was off. Send everything with its step name.
