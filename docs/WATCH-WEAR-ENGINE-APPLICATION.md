# Huawei Wear Engine application: full record

The one record of M/ARC's Huawei Wear Engine permission applications, both rejections, what was submitted, and where the watch work stands. Update it in place.

Written 2026-09-29 by the Claude supervisor, from primary sources:
- the owner's screenshots of both rejection emails and of the application form;
- the two PDFs the owner uploaded;
- the owner's chat with Astra, the ChatGPT watch agent, as shared on 2026-09-23;
- the watch branch in this repo.

**Who reads this:** a Claude agent on the owner's other account now looks after the watch docs instead of Astra. Everything that agent needs is in this repo and in Relay.

## 1. Where things stand (2026-09-29)
- **Application 1** (submitted by 2026-09-23): rejected.
- **Application 2** (submitted 2026-09-24): rejected. The owner shared the email on 2026-09-29.
- **Wear Engine access:** none has been granted yet. Nothing on the watch that needs Wear Engine can be tested on the GT6 until it is.
- **The second rejection doesn't match what was submitted.** Its one reason is "The permission to launch specified apps is not required for mobile apps". But the submitted form had **Launch specified app unticked** (owner's screenshot, section 4.3), and both PDFs say it is not requested (section 5). See section 3 for what this means and the next steps.
- **Correction:** on 2026-09-29 the supervisor first told the owner the form had asked for the launch and sensor permissions. The record shows it did not. This document is the correct version.

## 2. Identity (must match everywhere)

| Item | Value |
|---|---|
| App | M/ARC, Android |
| App ID | `119100049` |
| Package | `com.mrcdrnzz.dailytracker` |
| Signing SHA-256 (permanent key) | `05:66:9A:D2:72:1C:6A:BA:F9:FD:D4:B9:B8:4E:2F:B7:94:48:44:B1:DE:F3:59:84:5F:01:5F:2B:67:CA:F1:F5` |
| Old fingerprint (key gone, never used again) | `05:A0:B1:32…` |
| Watch | HUAWEI WATCH GT 6 = "Harmony Lightweight Smart Wearable Device" on the form |
| Developer | Individual developer, identity verification passed (before 2026-09-23) |

**Fingerprint in AppGallery Connect.** Huawei still had the old `05:A0…` fingerprint. On 2026-09-24 the owner was told to add `05:66…` in AppGallery Connect and then delete `05:A0…`, before resubmitting. The path is ☰ → My projects → M/ARC → Project settings → General information → App information → SHA-256 certificate fingerprint.
- The owner replied "Yeah all good. Submitted".
- **Not verified from here.** Check this in the console before the next submission.
- Don't use "Certificates, app IDs, and profiles" for this. That section is for signing the watch app later.
- Don't press Submit on "Release app → New version". That publishes to AppGallery.

## 3. What to do next (application 3)

### 3.1 What is known
- Application 2 selected only **Basic device information**. Message notification and Launch specified app were unticked. The form shows no sensor option for this device type (section 4.3).
- Both PDFs say, word for word, that Message notification, Launch specified app and the Wear Engine sensor permission are **not requested** (section 5).
- The "Permission application description" block (points 1 and 2) is the same text in both rejection emails. It is Huawei's standard guidance, not a finding about M/ARC.
- The only reason specific to application 2: "The permission to launch specified apps is not required for mobile apps."

### 3.2 What is not known (don't guess; check)
- **Was there another submission after 2026-09-24?** None is recorded, so the owner should confirm. If one ticked Launch specified app, the reason simply matches it.
- **What the console now shows** as the submitted permissions for the rejected application. The owner can open Wear Engine → the application record.
- **Why Huawei gave this reason** when launch was unticked. Possible triggers, none of them confirmed:
  - The form answer "Yes, I develop or plan to develop an application to the appliance". Huawei's point 1 says to apply only for the phone app, not for wearable device apps.
  - The authorization-path step "The user starts the workout in M/ARC and opens the watch companion".
  - A reviewer template.

### 3.3 Recommended order
1. **Owner:** confirm the AppGallery Connect fingerprint is `05:66…` (section 2).
2. **Owner:** confirm whether anything was submitted after 2026-09-24, and screenshot the rejected application's detail page.
3. **Ask Huawei before resubmitting** at `hihealth@huawei.com`, the contact in both emails. It costs nothing and avoids a third blind rejection. Short email:
   > App ID 119100049 (M/ARC). Our Wear Engine application was rejected on the grounds that "the permission to launch specified apps is not required for mobile apps". Our form selected only "Basic device information" (Launch specified app and Message notification unticked; no sensor permission), and our documents state this. Could you tell us what to change? We need only P2P messaging between the phone app and our own GT 6 companion app; the user opens the watch app manually.
4. **Resubmit** with the same ticks: Basic device information only. Make three changes:
   - **Description:** add one sentence, "Launch specified app is not requested: the user opens the M/ARC watch app manually."
   - **The "develop a watch app" question:** if Huawei's reply or its docs say it should be answered differently for a phone-only application, follow that. Otherwise keep "Yes" (it is true).
   - **Authorization path, step 3:** change it to "…and opens the M/ARC watch app manually from the watch's app list."
5. **Never tick** Launch specified app, Message notification, or any sensor permission. Heart rate doesn't need them (section 6.2).

## 4. Application history

### 4.1 Application 1 (submitted by 2026-09-23, guided by Astra in ChatGPT)
- **Form:**

  | Field | Value |
  |---|---|
  | App platform | Android App |
  | Product | M/ARC |
  | Device type | Harmony Lightweight Smart Wearable Device |
  | "Is an application developed on the wearable device?" | Yes, I develop or plan to develop an application to the appliance |
  | Basic device information | ticked |
  | Message notification | unticked |
  | Launch specified app | unticked |

- **Description** (712 of 1024 characters). The start, as Astra drafted it:
  > I am developing M/ARC, an Android fitness tracker, and plan to build a companion app for HUAWEI WATCH GT 6. The companion will support user-started workouts, display session status, and exchange workout commands and supported sensor readings with the paired M/ARC phone app through Wear Engine. The initial goal is live heart-rate display during workouts, subject to device API support and user autho[rization…]

  The rest of the text was not captured.
- **Documents:** Astra filled Huawei's two "Download Example" templates, data permissions and user authorization. The upload first failed and worked after a page refresh.
  - Those files lived in ChatGPT and were not shared here. Their contents are **not available**.
  - Astra's helper files (`MARC_Wear_Engine_Start_Here.docx`, `…_Application_Text.docx`, `…_Form_Content.xlsx`) were in ChatGPT's sandbox only.
- **Result:** rejected. Email shared on 2026-09-24:
  > We are sorry to inform you that your Wear Engine permission application for M/ARC (app ID: 119100049) has been rejected due to the following reasons:
  >
  > 1. Please provide screenshots or UX diagrams of the watch app in the application form, showing the scenarios where the phone app and watch app are supported by Wear Engine. This will be used for further evaluation. 2. The watch collects touch coordinates and calculates the swipe increment, and then sends the touch message to the paired phone in real time through the Wear Engine channel. If the watch app needs to synchronize files or data to the phone app through Wear Engine, and the phone app is not active, the message will fail to be sent. In this case, it is recommended that the watch app directly synchronize data to the server through the Internet. If the watch app needs to synchronize data from the phone to the watch through Wear Engine, please provide a description of why the Internet cannot be used, and provide the solution and screenshots for the scenario where the phone app is not active.
  >
  > Permission application description:
  > 1. You only need to apply for the Wear Engine service permission for phone apps, but not for wearable device apps.
  > 2. Please do not select **Enable or disable sensor on the wearable device and read the sensor data** unless you have reached an agreement with the HUAWEI Wear Engine Developer Team.
  >
  > Follow the instructions in Applying for the Wear Engine Service and submit the corresponding application materials. Go to HUAWEI Developers > Develop > HMS Core > Smart Device > Wear Engine > View documents. If you are unable to find a Huawei contact, please send an email to hihealth@huawei.com.
- **Diagnosis (2026-09-24):**
  - Point 2 describes the **Gate A diagnostic probe**, a swipe counter that sends swipes to the phone, not the real product.
  - Huawei also wanted: UX screens, the phone-inactive case, and why the internet isn't used.

### 4.2 Fixes made for application 2 (2026-09-24)
- **Describe the real product:**
  - The watch sends discrete commands only: complete set (weight, reps, effort), +30 s rest, skip rest, pause, resume, finish.
  - The phone sends a small snapshot.
  - No touch or coordinate streaming.
- **Phone-inactive case:** Huawei's form says these capabilities need the phone app **in the foreground**, so no "works in the pocket" promise was made. Instead:
  - the watch keeps the last snapshot and runs the rest timer locally;
  - it shows "Phone not connected" and keeps commands in a bounded outbox marked Pending, never Saved;
  - it resends when M/ARC is open again;
  - the phone applies each command once by ID (`WorkoutCommandStore` receipts, built and tested) and replies Saved.
- **Why not the internet:** M/ARC has no accounts and no workout server, and workout records are stored only on the phone. The only online feature is the optional AI coach (Escobar), whose relay stores no workout data and is never used by the watch link.
- **Added:**
  - the C2 watch UX (4 screens) marked "proposed", with the two phone-inactive faces;
  - real phone screenshots of the live workout, and the Watch settings screen cropped to the HR-broadcast connection (other personal devices cropped out);
  - the new `05:66…` fingerprint.
- **The email on page 1** was corrected to the owner's Huawei account email.

### 4.3 Application 2 (submitted 2026-09-24 about 10:22 UTC)
- **Form, from the owner's screenshot of the form page:**
  - Android App; M/ARC; package `com.mrcdrnzz.dailytracker`;
  - Harmony Lightweight Smart Wearable Device;
  - "Yes, I develop or plan to develop an application to the appliance";
  - **Basic device information ticked.** Its note on the form: "Supports data communication … Obtain paired devices random identifiers, names, battery levels, connection statuses, statuses of installed apps, and other information, as well as send audio and other files to the device";
  - **Message notification unticked** ("Send and receive notifications to and from paired devices");
  - **Launch specified app unticked** ("Launch a specified app from a paired device");
  - no sensor option is shown for this device type.
- **What the form page itself says:** "The following capabilities require that your mobile app be running in the foreground and the Huawei Health app be running properly in the background. The wearable capability does not support iOS devices. If you want to support non-Huawei Android phones, check whether the Huawei Health app can run in the background on these phones."
- **Uploads:**
  - Slot 1: *Data Permission and Usage Description* (4 pages).
  - Slot 2: *User Authorization Path Description* (4 pages).
  - Full text in section 5.
- **Description:** the owner's text below, with one advised change, "offline" → "offline-first", because the AI coach is online.
  - The owner confirmed "all good" before submitting. Whether that one word was changed is **not verified**.
  - A version under 1024 characters with that change and an explicit AI-coach sentence was also offered (1015 characters); the owner chose not to use it.
  > M/ARC is an offline Android workout tracker with a proposed HUAWEI WATCH GT 6 companion. Request: Basic device information, including P2P messaging, for the phone app only. The phone sends the current exercise, target, set count, rest timer and theme. The watch sends discrete commands: complete set (weight/reps/effort), +30 s rest, skip rest, pause/resume and finish. No touch or coordinate streaming. M/ARC must be open in the foreground to communicate. If inactive, the watch keeps the last snapshot, runs the rest countdown locally, shows Phone not connected and queues commands as Pending in a bounded outbox. It resends and refreshes when M/ARC reopens. The phone applies each command once by ID and replies Saved after storage. No accounts or workout server; workout records stay on the phone. The optional AI relay stores no workout data. No Wear Engine sensor permission is requested. Watch UX is proposed; GT6 end-to-end operation remains unverified.
- **Result:** rejected. Email shared on 2026-09-29:
  > We are sorry to inform you that your Wear Engine permission application for M/ARC (app ID: 119100049) has been rejected due to the following reasons:
  >
  > The permission to launch specified apps is not required for mobile apps.
  >
  > Permission application description:
  > 1. You only need to apply for the Wear Engine service permission for phone apps, but not for wearable device apps.
  > 2. Please do not select **Enable or disable sensor on the wearable device and read the sensor data** unless you have reached an agreement with the HUAWEI Wear Engine Developer Team.
  >
  > Follow the instructions in Applying for the Wear Engine Service and submit the corresponding application materials. Go to HUAWEI Developers > Develop > HMS Core > Smart Device > Wear Engine > View documents. If you are unable to find a Huawei contact, please send an email to hihealth@huawei.com.

## 5. Attachment contents (application 2, as submitted)
Transcribed from the owner's PDFs. The developer's name and email are replaced by [owner] because this repo is public. The original PDFs are on the owner's phone: upload those, not this text. The C2 diagrams are drawn in the PDFs; they are described in words here.

### 5.1 Data Permission and Usage Description (slot 1, 4 pages)
**Page 1.** "Wear Engine resubmission | Individual developer | 24 September 2026"
- **Header details:**
  - Phone app: M/ARC.
  - App ID and package: 119100049, com.mrcdrnzz.dailytracker.
  - Wearable target: HUAWEI WATCH GT 6, Harmony Lightweight Smart Wearable Device.
  - Individual developer: [owner name, owner email].
  - SHA-256 signing certificate: the `05:66…` value in section 2.
- **Permission description:** "Basic device information is the only selected permission. Its data communication capability is used for P2P app-to-app messages. This application is for the Android phone app only. Message notification, Launch specified app, and Wear Engine sensor control/read permission are not requested."
- **Data usage and use scenario:**
  - *Phone operating system:* "Android, including non-Huawei Android phones. No iOS support is requested. Huawei Health must run properly in the background."
  - *Wearable app and communication:* "A GT6 workout companion is proposed. It exchanges small workout snapshots and deliberate workout commands with M/ARC. The Gate A swipe-counter probe is a feasibility test, not the product scenario."
  - *Apps active during communication:* "M/ARC must be open in the foreground for Wear Engine communication. The inactive-phone design uses a bounded watch outbox, Pending status, automatic retry after M/ARC is open, and phone save acknowledgements. See page 2."
  - *Supported wearable model:* "Initial validation target: HUAWEI WATCH GT 6. End-to-end operation on the GT6 remains unverified. Other models are not claimed as supported."
- **Data display path:** "C2 watch UX on page 3 is marked proposed design. Page 4 contains real phone screenshots of the current workout app and its existing HR Broadcast connection."

**Page 2. "Data flow and phone inactivity"**
- **Diagram:** M/ARC phone (local workout records) ⇄ GT6 companion (bounded command outbox). Three arrows: workout snapshot; discrete command with ID; Saved acknowledgement.
- **Messages exchanged:**
  - "Phone to watch: current exercise, target, set count, rest timer and theme."
  - "Watch to phone: complete set with weight, reps and effort; add 30 seconds of rest; skip rest; pause; resume; finish. Each command carries an ID. Taps and swipes are processed locally on the watch. No touch coordinates or gesture stream are transmitted."
- **When the phone is inactive:** "If M/ARC becomes inactive mid-workout, the watch keeps the last workout snapshot, continues the rest countdown locally and shows Phone not connected. It refreshes from the phone when M/ARC is open in the foreground again. The watch retains commands in a bounded local outbox and shows Pending, never Saved. It resends automatically when M/ARC is open in the foreground again. The phone checks command IDs, applies each command once and sends a saved receipt. The watch shows Saved only after that acknowledgement. Proposed watch faces are shown on page 3."
- **No workout running:** the watch shows "Start your workout in M/ARC on your phone".
- **Why this uses a local phone connection:** "M/ARC has no accounts and no workout server. Workout records stay on the user's phone, and workout logging works offline in gyms. The watch needs the current workout state held by that phone. The optional online AI coach relay stores no workout data and is not a workout synchronization server. Internet access from the GT6 app is unverified; this application makes no claim about its availability."
- **Implementation status:** "phone-side WorkoutCommandStore receipts are built and tested. The full watch outbox, foreground communication and acknowledgement flow remains proposed pending end-to-end GT6 verification."

**Page 3. "C2 watch UX", proposed design, sample data.** "C2 Pulse / Split. Taps, swipes and value adjustment stay local; only confirmed commands are sent." Six round watch faces, each with "M/ARC 18:42" at the top:
1. **Live / C2 Split:** Chest press; 128 bpm · 1s ago; SET 2/3, 54 kg × 10; 165 Total kcal, 142 Active kcal; Start rest.
2. **Current set:** Chest press; CURRENT SET 2/3; Target 54 kg × 10; Last time: 52 kg × 10; Easy / Ideal / Max; Complete set.
3. **Rest:** REST 01:30; 128 bpm · 1s ago; Next: set 3 of 3, 54 kg × 10; +30 s; Skip rest.
4. **Session:** 8 / 21 sets complete; Chest press · 2/3; Incline press · 0/3; Pause / Resume; Finish.
5. **A · Phone inactive:** Phone not connected; 2 actions Pending; Rest 00:42 · local; Open M/ARC on your phone.
6. **B · After phone acknowledgement:** Phone connected; Saved ✓, 2 actions saved; Workout refreshed; Rest 00:36; Continue workout.

Footer:
- "Delivery feedback: actions stay Pending until the phone acknowledges storage. A local tap alone never permits Saved."
- "Health displays: HR and calories are sample values; GT6 access is unverified. Current phone HR uses HR Broadcast. Future watch-side sensors need their own permission and verification. Wear Engine sensor control/read permission is not requested."

**Page 4. "Current phone app evidence", "Real screenshots supplied by the developer on 24 September 2026"**
- Intro: "These captures document M/ARC's current workout UI and its existing direct Bluetooth heart-rate broadcast connection. They do not demonstrate Wear Engine authorization, watch command delivery or foreground-to-background operation."
- Left: the live workout screenshot.
- Right, "Watch connection":
  - *Current HR Broadcast:* "The supplied crop shows 'Direct Bluetooth' and 'Heart-rate broadcast'. It is the existing connection to HUAWEI WATCH HR-1D5."
  - *App information:* "M/ARC logs workout splits, exercises, sets, effort, session timing and workout history. The phone owns the saved workout record."
  - *Development scope:* "Private development and testing. No AppGallery listing or store rating is claimed. The proposed GT6 companion and its Wear Engine flow still require device verification."
  - *Supplementary information:* "Sports and fitness application. Testing uses the developer's existing GT6 and Android phone. No hardware-purchase or co-marketing commitment is made. Enterprise business-license fields are not applicable."

### 5.2 User Authorization Path Description (slot 2, 4 pages)
**Page 1.** "Wear Engine resubmission | Proposed phone and watch flow"
- **Header:** the same app, package, target and SHA-256 as 5.1, with no developer row.
- **Scope box:** "Selected scope: Basic device information, including P2P data communication. Only the phone app applies for Wear Engine. Message notification, Launch specified app and Wear Engine sensor control/read permission remain unselected."
- **Authorization and use path:**
  1. *Connection disclosure:* "In M/ARC, the user chooses to connect the paired GT6. The proposed disclosure explains device selection and workout messages. Continue proceeds; Not now returns to ordinary phone workout logging."
  2. *Device authorization:* "Present required Huawei/Wear Engine authorization prompts where applicable, then select the paired GT6. The diagrams do not reproduce or claim a verified Huawei system permission screen."
  3. *Start a workout:* "The user starts the workout in M/ARC and opens the watch companion. Keep M/ARC open in the foreground and Huawei Health operational in the background. No remote app-launch permission is requested."
  4. *Use watch controls:* "The phone supplies the small workout snapshot. The watch sends a discrete command only when an action is confirmed. The phone applies it once and acknowledges storage. Pending and Saved states are shown on page 2."
  5. *End the connection:* "The proposed phone controls allow the user to disconnect. Ending a workout requires a deliberate Finish command. No always-on or unattended background operation is claimed."
- **Heart rate:** "Separate heart-rate access: the current phone feature uses HR Broadcast. Any later watch sensor access requires the watch app's own supported permission. This application does not request Wear Engine sensor permission."

**Page 2. "Phone inactive and reconnection UX"**, proposed design, "No delivery promise while the phone app is inactive". Four steps:
1. *Command confirmed on the watch:* "Store the command in the bounded local outbox. Display Pending."
2. *M/ARC is inactive or unavailable:* "If M/ARC becomes inactive mid-workout, keep the last workout snapshot, continue the rest countdown locally and show Phone not connected. Retain commands in the watch outbox. Continue to show Pending, never Saved."
3. *M/ARC is open in the foreground again:* "The watch resends automatically and refreshes from the phone. The phone checks the command ID and applies it once. WorkoutCommandStore receipts prevent duplicate application."
4. *The phone acknowledges storage:* "The phone replies Saved. Only then may the watch replace Pending with Saved."

The rest of the page:
- **No workout running:** "Start your workout in M/ARC on your phone".
- **Local data and connectivity:** "Workout data is saved on the user's phone. M/ARC has no accounts or workout server. The bounded on-watch outbox holds commands waiting for acknowledgement. The optional online AI relay stores no workout data. Watch internet access is unverified and is not assumed."
- **Evidence boundary:** "phone-side receipt handling is built and tested. The complete proposed watch flow and automatic resend still require GT6 end-to-end verification. Wear Engine communication requires M/ARC to be open in the foreground."

**Page 3:** the same C2 watch UX page as 5.1 page 3.

**Page 4:** the same phone evidence page as 5.1 page 4.

### 5.3 Wording to fix in the next version (small, for consistency)
| Now | Change to | Why |
|---|---|---|
| "Workout records stay on the user's phone" | "Workout records are stored only on the user's phone" | The AI coach sends workout context when asked, so "stay" could read as "never leave". |
| "The optional online AI coach relay stores no workout data…" | "The only online feature is an optional AI coach that answers the user's questions; its relay stores no workout data and the watch link never uses it." | Matches the form description. |
| Step 3: "…and opens the watch companion." | "…and opens the M/ARC watch app manually from the watch's app list." | Makes clear that nothing launches it remotely (section 3.3). |

## 6. The watch project around the application

### 6.1 Plan and docs
- **Architecture:** `docs/WATCH-ARCHITECTURE.md` (on main).
  - A small GT6 companion that controls the workout already running in M/ARC.
  - The phone owns the record; the watch shows state and sends deliberate actions.
  - The approved design is "C2 Split": very large heart rate plus the current set, 4 gesture screens.
- **Code rules for watch work:** `docs/WATCH-INTEGRATION-NOTES.md` (on main).
- **Watch branch:** `codex/gt6-gate-a-watch-lab` (PR #3, never merged by agents). Head `8fc26d8` (2026-09-25); 64 commits ahead of main and 572 behind on 2026-09-29.
  - `native/wear/GATE-A.md`: the device test procedure, 6 questions, all PENDING.
  - `native/wear/GATE-B.md`, `native/wear/VALIDATION.md`.
  - `docs/WATCH-PROGRESS.md`: Astra's run log. Its "Waiting on owner" line is this application's result.
- **Built and tested on that branch** (unit and CI tests, not on a real GT6):
  - the Watch lab, hidden: Settings → tap Version 7 times;
  - the phone plugin, using DEVICE_MANAGER only;
  - the GT6 diagnostic probe page;
  - `WorkoutCommandStore` (each command applied once by ID);
  - the command protocol;
  - native heart-rate recording from HR broadcast;
  - handover and recovery.

### 6.2 Heart rate: three separate routes (don't mix them up)
1. **Now:** the GT6's own "Heart-rate broadcast" over direct Bluetooth, shown as HUAWEI WATCH HR-1D5. It needs no Huawei approval.
2. **Planned:** the M/ARC watch app reads the watch's heart-rate sensor itself and sends the value over P2P.
   - It uses the watch app's own permission in its `config.json` (`ohos.permission.READ_HEALTH_DATA`), per GATE-A.md step 4.
   - This is **not** the Wear Engine sensor permission Huawei says not to tick.
   - Whether the GT6 allows it is a Gate A question.
3. **Not planned:** Health Kit real-time heart rate. It is a separate Huawei permission and integration.

### 6.3 What the rejections change in the plan
- **No phone-triggered launch of the watch app.** The user opens the M/ARC watch app on the watch.
  - GATE-A.md question 5 still tests whether a P2P ping opens a closed companion; treat any success as a bonus.
  - GATE-A.md line 54 already calls ping-launch "a test hypothesis".
- **M/ARC must be in the foreground** for Wear Engine messages. The watch uses Pending and the outbox otherwise; no "works in the pocket" claim.
- **The phone never asks for the Wear Engine sensor permission.**

## 7. Rules for whoever continues
- **Ownership:**
  - Watch code (`native/wear/**`, `src/native/wearEngine.ts`, `src/slices/settings/WatchLab.tsx`) belongs to the watch branch.
  - The Agent guard fails any `claude/*` branch that changes those paths.
  - Write watch docs under `docs/` on a `claude/*` branch.
- **Never commit** keystores, signing profiles, app secrets, `agconnect-services.json`, device identifiers or private test reports. The repo is public.
  - GATE-A.md notes that a Huawei app secret was shared earlier (it was pasted into a ChatGPT chat). Replacing it in Huawei's console is the owner's job.
- **Never** change the phone signing key `05:66…`.
- **Only the owner** logs in to Huawei, submits applications, emails Huawei and changes console settings. Agents prepare the text and check it.
- Keep this file current after every Huawei reply. Add a Relay `LOG.md` line (no URLs or secrets).

## 8. Sources
- The owner's screenshots:
  - rejection 1 email (shared 2026-09-24 about 08:39 UTC);
  - the application 2 form page;
  - rejection 2 email (shared 2026-09-29 about 08:07 UTC).
- The owner's uploads of the application 2 PDFs, final versions from 2026-09-24:
  - `MARC_Data_Permission_and_Usage-1.pdf`;
  - `MARC_User_Authorization_Path.pdf` (the second upload, with the phone-inactive faces).
- Astra's chat, shared with the supervisor on 2026-09-23: application 1 steps, form ticks and description draft.
- The repo: `docs/WATCH-ARCHITECTURE.md` and `docs/WATCH-INTEGRATION-NOTES.md` on main; `native/wear/GATE-A.md` and `docs/WATCH-PROGRESS.md` on `codex/gt6-gate-a-watch-lab`.
- The owner's connected Gmail (checked 2026-09-29) has no Huawei review emails. The rejections are known only from the screenshots.
