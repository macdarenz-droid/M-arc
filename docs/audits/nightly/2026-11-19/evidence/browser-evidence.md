# Browser verification record

Source: current main `57dcbfc7efa60218ba902d16d6e3329d2fc053f5`; local Vite preview on loopback, synthetic fresh storage. The external preview configuration explicitly aliases Coach.tsx/Profile.tsx to work around Windows case ambiguity. No tracked source was edited. This is a development preview, not a built APK, installed PWA or release bundle.

| Flow | Actual observation | Limit |
|---|---|---|
| Onboarding | Your details → Later reaches empty Today | Full profile/permission paths not all exercised |
| Five themes | Silent Black, Paper, Ember, Emerald, Midnight each selected with pressed state; body background/text changed | Not a contrast audit of every component/future theme |
| Theme dimensions | 1280 px viewport: body 1280 and settings dialog 560; no horizontal overflow in sampled settings view | Other screen/theme combinations not exhaustive |
| Starter workout | Empty Train → Use Push/Pull/Legs → Start Push → Skip check-in → Start Push opens seven-exercise session | Synthetic fixture only |
| Keyboard Options | Enter on first expanded Machine Chest Press Options collapsed its header; zero dialogs. Pointer click opened options | Confirms UI-N19-01; Space source-traced only |
| Exercise guide | How to do it loads machine chest press technique; Hand Heel of palm opens labelled close-up with Right/Wrong images and explanatory copy | Not every exercise illustration/trace verified |
| Set logging | Enter 20 kg × 8, select Ideal; set becomes logged and rest banner appears | No real lifting, timing or health measurements |
| Pause/resume | Pause changes top state to Paused and Resume; Resume returns Live | Long background lifecycle not a controlled timing experiment |
| Finish | Finish warns of seven unmarked exercises, summarizes one exercise/one set; Finish and save shows Push done | Short retained rest-banner exit frame is intentional, disappears; not reported as defect |
| History | Saved note and 20 kg × 8 I visible after pointer expansion; Edit to 9 reps and Save changes persists 20 kg × 9 I | Expansion container is a div.card-press without role/tabIndex, while Share/Edit are buttons; keyboard expansion remains a source/DOM gap |
| Body at 375×812 | Body scroll width 360, viewport 375; Chest detail opens with dates, estimate/data labels and logged lift | One narrow viewport/theme only |
| Measurement validation | Height180/neck90/waist40 disables Save; 180/40/90 displays 18.4% | UI check, not independent validation of scientific accuracy; no reading saved |
| Escobar consent | Disabled coach shows Turn on; consent sheet explains server/provider and health/body switches | Did not enable, send a message/photo or call a paid model |
| Console | No error entries at final sampled log read | Shared Card warnings about nested interactive children occurred; no claim all runtime errors are absent |

Body background/text values observed (RGB): Silent Black 8,9,10 / 247,248,248; Paper 255,255,255 / 55,53,47; Ember 7,8,10 / 255,255,255; Emerald 15,15,15 / 237,237,237; Midnight 10,37,64 / 246,249,252. These are computed CSS values, not a full contrast matrix.

The host paused/interrupted during this run. The live synthetic workout timer consequently reached about 7h57m before completion. This is elapsed host time, not evidence of an app timer defect. The temporary narrow viewport was reset. All local browser changes belong only to this disposable audit fixture. No real account, user backup, live Worker, location, camera, notification delivery or physical device was used.
