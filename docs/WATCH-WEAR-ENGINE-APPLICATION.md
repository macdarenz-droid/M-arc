# Huawei Wear Engine application: full record

The one record of M/ARC's Huawei Wear Engine permission applications, both rejections, what was submitted, and where the watch work stands. Update it in place.

Written 2026-09-29 by the Claude supervisor from primary sources. Since 2026-09-29 the Claude agent on the owner's other account keeps it (branch `claude/wear-engine-application-3`). Sources are listed in section 8.

## 1. Where things stand (2026-09-29)
- **Application 1** (submitted by 2026-09-23): rejected on 2026-09-24.
- **Application 2** (submitted 2026-09-24): rejected on 2026-09-29.
- **Wear Engine access:** none has been granted yet. Nothing on the watch that needs Wear Engine can be tested on the GT6 until it is.
- **Why application 2 was rejected (settled):** the form as submitted had **Launch specified app ticked**. The owner reopened the rejected application on 2026-09-29, shared a screenshot of it, and confirmed that it is application 2 as sent. Huawei's reason, "The permission to launch specified apps is not required for mobile apps", matches that tick. Huawei's docs explain it (section 3.1):
  - individual developers may apply only for Basic device information and Message notification;
  - the launch permission is for a watch app that opens an app on the phone, never for the phone app.
- **Correction to this record:** earlier versions said Launch specified app was unticked. That came from a screenshot taken before submission, not from what was sent. The supervisor's first message to the owner on 2026-09-29 was right about the launch permission and wrong about sensor permissions, which were never selected.
- **Application 3 is ready for the owner** (section 3): form answers, a new description (1010 of 1024 characters) and two new PDFs. **Only Basic device information is ticked.**
- **Owner confirmed on 2026-09-29:**
  - the old `05:A0…` fingerprint is deleted in AppGallery Connect;
  - nothing was submitted after 2026-09-24.

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
- The owner replied "Yeah all good. Submitted" on 2026-09-24. On 2026-09-29 the owner confirmed the old `05:A0…` fingerprint is deleted.
- Agents can't see the console. Before submitting, the owner checks that the fingerprint shown there is `05:66:9A…CA:F1:F5` (checklist in section 3.4).
- Don't use "Certificates, app IDs, and profiles" for this. That section is for signing the watch app later.
- Don't press Submit on "Release app → New version". That publishes to AppGallery.

## 3. Application 3

### 3.1 What Huawei's own documents say
Read 2026-09-29 from Huawei's documents, EN and CN. Quotes and links are in section 8.
- **Individual developers can only apply for Basic device information and Message notification** ("Applying for the Wear Engine Service", EN V19, updated 2026-04-07). Only the phone app applies; the watch app needs no permission.
- **Basic device information (`DEVICE_MANAGER`) covers phone ↔ watch P2P messages and files**, the paired-device list, connection status and app-installed checks. This is everything M/ARC needs.
- **Opening the watch app from the phone is part of Basic device information.** The Android P2P guide says "The phone app and wearable app must be launched at the same time", and that the phone app can open the watch app with `ping`. The lite-wearable guide adds that `ping` opens a lite-wearable JS app with no extra setup.
- **"Launch a specified app on a paired device" is a watch-side permission:** a HarmonyOS watch app opening an app on the phone (`startRemoteApp`). It appears only in the Chinese HarmonyOS watch-side guide (updated 2026-09-23). A GT 6 lite-wearable app has no such API. This is why Huawei says it is "not required for mobile apps".
- **Current templates.** There are two Data Permission and Usage templates:
  - The form's "Download Example" gives an older combined file with 4 questions and an optional display path.
  - The file linked from the doc page, "…for Individual Developers.xlsx", is newer. It asks for:
    - 5 mandatory self-check answers (phone app type, whether a watch app is developed, whether it talks to the phone app, whether the phone app stays active, and watch models);
    - one row per requested permission, deleting the rest;
    - a mandatory "Data Display Path" with phone- and wearable-side screenshots or UX diagrams;
    - App Information and Supplementary Info sheets.
  - Application 3's PDF follows the newer template.
- **User Authorization Path template:** "For Android and HarmonyOS applications, the basic device information and message notification permissions are granted by default." The authorization guide says the same for Huawei Health 11.0.3.512 or later. Until approval, the API returns error code 8, so no real authorization screenshot can exist yet.
- **Upload format:** the form says "Upload an Excel or PDF file smaller than 10 MB". PDF is fine.
- **Review time:** "Generally, the approval process may take one to two weeks". "An application won't be approved if the submitted materials do not meet the requirements."
- **Device support:** the GT series from GT 3 onward is listed. App-to-app messaging with lite wearables is open to individual developers.
- **What reviewers check,** from a Huawei official forum reply on 2025-10-28: the materials are mainly used to check that the permissions requested match what user authorization grants. Mock text or images are accepted when no real screen exists yet. ([forum](https://developer.huawei.com/consumer/cn/forum/topic/0203196964711393095))
- **The launch permission is brand new.** In February 2026 Huawei's forum still said a watch could not launch a phone app. The watch-side launch API dates from HarmonyOS API 24, and the CN guide describing it was updated on 2026-09-23, one day before application 2. That explains why the checkbox appears on the form without any explanation in Huawei's English docs.

### 3.2 Form answers for application 3
Open the rejected application (as the owner did on 2026-09-29) and change it like this:

| Field | Answer |
|---|---|
| App platform / product / package | Android App · M/ARC · `com.mrcdrnzz.dailytracker` (unchanged) |
| Wearable devices | Harmony Lightweight Smart Wearable Device (unchanged) |
| Is an application developed on the wearable device? | Yes, I develop or plan to develop an application to the appliance (unchanged; true, and the P2P scenario needs it) |
| Describe the main functions of your wearable app | the text below (replace the old text completely) |
| Basic device information | **ticked** |
| Message notification | unticked (not needed: with a watch app, Basic device information already covers messages, per the template) |
| Launch specified app | **UNTICKED** (the only reason for rejection 2) |
| Upload 1 (data permissions) | new `MARC_Data_Permission_and_Usage.pdf` (section 5.4) |
| Upload 2 (user authorization path) | new `MARC_User_Authorization_Path.pdf` (section 5.4) |

**Description** (1010 characters, plain ASCII; the form's counter matched Python's count for application 2's 1015-character text):

> The M/ARC watch app is a gym workout companion for HUAWEI WATCH GT 6 (lite wearable, in development) that works with the M/ARC Android phone app, which stores the workout. Main functions: 1) Show the current exercise, set number, target weight and reps, and the rest countdown sent by the phone. 2) Let the user complete a set (weight, reps, effort), add 30 s of rest, skip rest, pause, resume or finish. Each action goes to the phone as one small P2P message with an ID. 3) Show Pending until the phone replies Saved. The user opens the M/ARC watch app from the watch's app list. Messages flow only while both apps are open, with M/ARC in the foreground and Huawei Health in the background. If the phone app is not active, the watch keeps the last workout state, runs the rest timer locally and shows Phone not connected; waiting actions resend when M/ARC is open again. Workout records are stored only on the phone; there is no account or workout server. The phone app requests only Basic device information.

### 3.3 Email to hihealth@huawei.com (optional; send after submitting)
The cause is now known, so there is no need to wait for Huawei before resubmitting. The email makes it easy for the reviewer to ask about anything else. **Don't send the earlier draft:** it said the launch permission was not selected, which was wrong.

> **Subject:** Wear Engine application for M/ARC (app ID 119100049): launch permission removed and resubmitted
>
> Hello HUAWEI Wear Engine Developer Team,
>
> Thank you for reviewing the Wear Engine application for M/ARC (app ID 119100049, package com.mrcdrnzz.dailytracker). It was rejected on 29 September 2026 because "the permission to launch specified apps is not required for mobile apps".
>
> You are right: that option was selected by mistake. I have resubmitted the application with only Basic device information selected. I am an individual developer. The Android phone app uses the permission for P2P messages with our own lite wearable app on the HUAWEI WATCH GT 6, and the user opens the watch app on the watch.
>
> The updated Data Permission and Usage Description and User Authorization Path Description follow your current individual-developer templates. If anything else is missing, please let me know and I will correct it straight away.
>
> Kind regards,
> [your name]
> M/ARC (individual developer)

**If there is no answer:**
- Huawei's forum staff send questions about a specific application to the online support ticket (HUAWEI Developers → Support → Submit a ticket, Wear Engine category). Use it if nothing arrives within two weeks of submitting.
- One individual developer reported that a public forum post got a stuck application enabled within two days (2025, a single report, low reliability). Try it only after the ticket.

### 3.4 Owner checklist before pressing Submit
1. In AppGallery Connect, the SHA-256 fingerprint shows `05:66:9A…CA:F1:F5` and no `05:A0…` (section 2).
2. In the form, **only Basic device information is ticked**. Launch specified app and Message notification are unticked.
3. The description box holds the new text (the counter shows 1010 / 1024).
4. Both uploads show the green tick and are the new files dated 29 September 2026.
5. **Send a screenshot of the whole filled form before pressing Submit, and wait for the agent's go.** The agent checks the ticks, the description and both uploads against 3.2.
   - Application 2 went out with Launch specified app ticked because nobody checked the final form.
   - The last screenshot an agent saw was taken before that tick, and "Submitted" was taken as confirmation.
   - Neither Astra nor the supervisor had checked Huawei's rule that individual developers may request only two permissions. Knowing it would have flagged the launch option however it got ticked.
6. After the go, submit. Then send the email in 3.3 if you want to.
7. Expect an answer in one to two weeks (Huawei's figure). Share every reply; the record is updated each time (section 4.5).

### 3.5 Risks and what reduces them
- **The watch app isn't built yet, so page 3 shows designs, not screenshots.** The template accepts "screenshots/UX diagrams", and rejection 2 did not repeat rejection 1's request for them. Every design page is labelled proposed.
- **The watch face shows heart rate and calories.** A reviewer could read that as sensor use. The page says these are sample values, that today's phone heart rate comes from the watch's standard heart-rate broadcast, and that no sensor permission is requested. Sending the watch's heart rate over P2P later uses the same permission, but it would be a new use of data; if it is added, describe it with Modify.
- **No real authorization screenshot.** None can exist before approval (error code 8). The authorization path document says so, shows the real M/ARC Watch screen and the proposed disclosure, and cites Huawei's rule that the permission is granted by default.
- **Personal details.** The developer's name and email appear only in the owner's copies of the PDFs (page 1 of the data-permission file). They never go in the repo; the generator takes them on the command line.
- **The application-2 PDFs carried a signed "made with ChatGPT" content credential** (a C2PA manifest from OpenAI). There's no evidence Huawei checks it. The new PDFs are built fresh and carry none.

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
- **Result:** rejected. Console message dated "Sep 24, 2026, 6:22:16 PM" (as the console shows it); the email was shared on 2026-09-24:
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
- **Form as submitted,** from the owner's screenshot of the rejected application reopened on 2026-09-29, confirmed by the owner as application 2:
  - Android App; M/ARC; package `com.mrcdrnzz.dailytracker`;
  - Harmony Lightweight Smart Wearable Device;
  - "Yes, I develop or plan to develop an application to the appliance";
  - **Basic device information ticked.** Its note on the form: "Supports data communication … Obtain paired devices random identifiers, names, battery levels, connection statuses, statuses of installed apps, and other information, as well as send audio and other files to the device";
  - **Message notification unticked** ("Send and receive notifications to and from paired devices"; its note starts "This permission is a template-…");
  - **Launch specified app TICKED** ("Launch a specified app from a paired device"). This is what Huawei rejected;
  - no sensor option is shown for this device type;
  - the description box is headed "Describe the main functions of your wearable app".
  - An earlier screenshot, taken before submission, showed Launch unticked. This record used to follow it; that was wrong.
- **What the form page itself says:** "The following capabilities require that your mobile app be running in the foreground and the Huawei Health app be running properly in the background. The wearable capability does not support iOS devices. If you want to support non-Huawei Android phones, check whether the Huawei Health app can run in the background on these phones."
- **Uploads:**
  - Slot 1: *Data Permission and Usage Description* (4 pages).
  - Slot 2: *User Authorization Path Description* (4 pages).
  - Full text in section 5.
- **Description:** the reopened form shows the 1015-character "offline-first" version (counter 1015 / 1024), starting "M/ARC is an offline-first Android workout tracker with a proposed HUAWEI WATCH GT 6 companion. Request: Basic device information (P2P messaging) for the phone…". An earlier version of this record said the owner chose not to use it; the form shows otherwise. The owner's earlier text, kept for reference:
  > M/ARC is an offline Android workout tracker with a proposed HUAWEI WATCH GT 6 companion. Request: Basic device information, including P2P messaging, for the phone app only. The phone sends the current exercise, target, set count, rest timer and theme. The watch sends discrete commands: complete set (weight/reps/effort), +30 s rest, skip rest, pause/resume and finish. No touch or coordinate streaming. M/ARC must be open in the foreground to communicate. If inactive, the watch keeps the last snapshot, runs the rest countdown locally, shows Phone not connected and queues commands as Pending in a bounded outbox. It resends and refreshes when M/ARC reopens. The phone applies each command once by ID and replies Saved after storage. No accounts or workout server; workout records stay on the phone. The optional AI relay stores no workout data. No Wear Engine sensor permission is requested. Watch UX is proposed; GT6 end-to-end operation remains unverified.
- **Result:** rejected. Console message dated "Sep 29, 2026, 4:30:13 PM"; the email was shared on 2026-09-29:
  > We are sorry to inform you that your Wear Engine permission application for M/ARC (app ID: 119100049) has been rejected due to the following reasons:
  >
  > The permission to launch specified apps is not required for mobile apps.
  >
  > Permission application description:
  > 1. You only need to apply for the Wear Engine service permission for phone apps, but not for wearable device apps.
  > 2. Please do not select **Enable or disable sensor on the wearable device and read the sensor data** unless you have reached an agreement with the HUAWEI Wear Engine Developer Team.
  >
  > Follow the instructions in Applying for the Wear Engine Service and submit the corresponding application materials. Go to HUAWEI Developers > Develop > HMS Core > Smart Device > Wear Engine > View documents. If you are unable to find a Huawei contact, please send an email to hihealth@huawei.com.

### 4.4 Application 3 (prepared 2026-09-29, not yet submitted)
Everything to submit is in section 3.2, and the PDF contents are in 5.4. What changed from application 2:
- Launch specified app unticked; only Basic device information requested.
- A new description that answers the box's actual question, the watch app's main functions.
- PDFs rebuilt around Huawei's current individual-developer template, with the section 5.3 wording fixes.

### 4.5 Huawei replies log
One line per reply or console message, newest last. Update the rest of this record at the same time.

| Date (console time) | Application | Result | Specific reason |
|---|---|---|---|
| Sep 24, 2026, 6:22:16 PM | 1 | rejected | watch UX screenshots needed; the swipe-streaming probe; phone-inactive case; why not the internet |
| Sep 29, 2026, 4:30:13 PM | 2 | rejected | "The permission to launch specified apps is not required for mobile apps." (Launch specified app was ticked) |

## 5. Attachment contents
5.1 to 5.3 are application 2 as submitted, transcribed from the owner's PDFs; 5.4 is application 3. The developer's name and email are replaced by [owner] because this repo is public. Upload the owner's PDF files, not this text. The C2 diagrams are drawn in the PDFs; they are described in words here.

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

### 5.3 Wording fixed in application 3
| Now | Change to | Why |
|---|---|---|
| "Workout records stay on the user's phone" | "Workout records are stored only on the user's phone" | The AI coach sends workout context when asked, so "stay" could read as "never leave". |
| "The optional online AI coach relay stores no workout data…" | "The only online feature is an optional AI coach that answers the user's questions; its relay stores no workout data and the watch link never uses it." | Matches the form description. |
| Step 3: "…and opens the watch companion." | "…and opens the M/ARC watch app manually from the watch's app list." | Makes clear that nothing launches it remotely. |

All three are applied in application 3 (5.4).

### 5.4 Application 3 PDFs (built 2026-09-29)
- **Source of the exact wording:** `docs/wear-engine/make_pdfs.py`.
  - The developer's name, email and phone screenshots are passed in on the command line, so the script holds no personal data.
  - Page 3 of each file (the C2 watch screens) is copied unchanged from the application-2 PDF.
  - The build stops if any page's text runs into the footer.
  - Needs python3 with reportlab, pypdf and Pillow, plus the DejaVu Sans fonts.
- **Checked on the built files:**
  - each file has 4 pages;
  - no page mentions any permission except Basic device information;
  - the name and email appear once, on page 1 of the data-permission file;
  - no content-credential (C2PA) data;
  - sizes about 1.05 MB and 0.19 MB, both under the 10 MB limit.
- **Data Permission and Usage Description** (upload 1):
  1. **Page 1:**
     - identity table: phone app, App ID and package, wearable target, [owner] name and email;
     - the SHA-256;
     - "Self-check": the 5 questions of Huawei's current individual-developer template, answered in order: Android app, and non-Huawei Android phones are supported; a watch app for the GT 6 is in development; it talks to the phone by P2P; both apps stay active in the foreground, with Huawei Health in the background; watch model HUAWEI WATCH GT 6;
     - "Permission requested": one row only, Basic device information, in Huawei's own wording. It says what M/ARC uses (device list, connection status, the watch app's install status, P2P messages) and what it doesn't (battery, audio, files).
  2. **Page 2, "Usage scenario and data flow":**
     - usage scenario and requirements, in the same shape as Huawei's example;
     - diagram: phone ⇄ watch app with the workout snapshot, the confirmed action with ID, and the Saved reply;
     - messages exchanged, with no touch or gesture streaming;
     - what happens when the phone app is not active (Pending, the local rest timer, resend, Saved);
     - "Why a phone connection, not the internet", using the 5.3 wording;
     - implementation status.
  3. **Page 3:** the C2 watch UX page from application 2.
  4. **Page 4, "App information":**
     - three real phone screenshots: the Workouts list, the live workout, and the Watch screen with heart-rate broadcast;
     - app introduction;
     - AppGallery: not listed, so no rating;
     - supplementary information: no hardware purchase, no co-marketing, industry sports.
- **User Authorization Path Description** (upload 2):
  1. **Page 1:**
     - identity table and SHA-256;
     - "Permission requested: Basic device information only";
     - a 6-step authorization path: open Settings → Watch and health → Watch; M/ARC disclosure; Huawei authorization (granted by default on Huawei Health 11.0.3.512 or later, otherwise Huawei Health's own screen); select the GT 6 and check the watch app is installed; use during a workout, with the watch app opened manually from the watch's app list; Disconnect;
     - heart-rate note.
  2. **Page 2, "Authorization screens":**
     1. the real M/ARC Watch screen today;
     2. the proposed M/ARC disclosure, drawn;
     3. a card explaining Huawei Health's own screen, which can't be captured before approval (error code 8);
     - then how access is granted and removed.
  3. **Page 3:** the C2 watch UX page from application 2.
  4. **Page 4, "Phone inactive and reconnection":** four steps, the no-workout face, and local data, using the 5.3 wording.

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
- **Never tick Launch specified app** for the phone app. It is the watch-side permission for a watch app that opens an app on the phone (section 3.1).
- **Opening the watch app:** the application says the user opens it on the watch.
  - Huawei's Android P2P guide says the phone app may also open a lite-wearable app with `ping`, under Basic device information.
  - GATE-A.md question 5 tests whether that works on the GT6. Treat any success as a bonus; GATE-A.md line 54 already calls ping-launch "a test hypothesis".
  - Using it needs no new permission.
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
- Keep this file current after every Huawei reply: a line in section 4.5, then sections 1 and 3. Add a Relay `LOG.md` line (no URLs or secrets).
- **PDFs:** change the wording in `docs/wear-engine/make_pdfs.py` and rebuild. Give the owner the rebuilt files. Never commit built PDFs, screenshots, or the developer's name or email.

## 8. Sources
- The owner's screenshots:
  - rejection 1 email (shared 2026-09-24 about 08:39 UTC);
  - the application 2 form page before submission (superseded, see 4.3);
  - rejection 2 email (shared 2026-09-29 about 08:07 UTC);
  - on 2026-09-29: the rejection 2 email again, the rejected application 2 reopened in the console (Launch specified app ticked), and both console messages ("My messages", with dates);
  - on 2026-09-29: the phone screenshots used in the application 3 PDFs (Workouts, live workout, Watch screen).
- The owner's application 2 PDFs, sent again on 2026-09-29:
  - `MARC_Data_Permission_and_Usage.pdf`;
  - `MARC_User_Authorization_Path.pdf`, uploaded twice. Both copies have the same pages; only their embedded ChatGPT content credential differs.
- Huawei's templates, as the owner downloaded them from the form on 2026-09-29: `DataPermissionandUsageDescription.xlsx` (the older combined file) and `UserAuthorizationPathDescription.xlsx`. The newer "…for Individual Developers.xlsx" linked from the doc page was read on the same day.
- Huawei documents, read 2026-09-29 through Huawei's document API (the same text the pages show):
  - [Applying for the Wear Engine Service (Android)](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/applying-wearengine-0000001050777982), EN V19, updated 2026-04-07: "Individual developers can only apply for basic device information and message notification permissions"; "By default, you do not need to apply for permissions for the wearable app"; review "one to two weeks".
  - [Requesting User Authorization](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/requesting-user-authorization-0000001050819181): NOTIFY and DEVICE_MANAGER are granted by default from Huawei Health 11.0.3.512; error code 8 before approval.
  - [Android phone P2P guide](https://developer.huawei.com/consumer/en/doc/connectivity-Guides/phone-send-message-0000001051059209): DEVICE_MANAGER is required; both apps must be running; `ping` can open the watch app.
  - [Lite-wearable P2P guide](https://developer.huawei.com/consumer/en/doc/connectivity-guides/send-message-0000001052460491): `ping` opens a lite-wearable JS app.
  - [Wear Engine FAQ](https://developer.huawei.com/consumer/en/doc/connectivity-guides/faq-0000001050818031): code 206 when the lite-wearable app is not in the foreground.
  - [HarmonyOS watch-side P2P guide (CN)](https://developer.huawei.com/consumer/cn/doc/harmonyos-guides/watch_p2p_communication), updated 2026-09-23: the launch permission is for a watch app opening an app on the phone.
  - Huawei developer forum threads (CN), read 2026-09-29:
    - [0203196964711393095](https://developer.huawei.com/consumer/cn/forum/topic/0203196964711393095): how materials are reviewed, and that mock images are accepted;
    - [0204205683435135235](https://developer.huawei.com/consumer/cn/forum/topic/0204205683435135235): in February 2026 a watch could not launch a phone app;
    - [0203182864243725100](https://developer.huawei.com/consumer/cn/forum/topic/0203182864243725100): an individual developer's application enabled after a forum post.
  - [Service introduction (CN)](https://developer.huawei.com/consumer/cn/doc/connectivity-Guides/service-introduction-0000000000018585): GT 3 and later are supported; app-to-app messaging is open to individual developers.
- Astra's chat, shared with the supervisor on 2026-09-23: application 1 steps, form ticks and description draft.
- The repo: `docs/WATCH-ARCHITECTURE.md` and `docs/WATCH-INTEGRATION-NOTES.md` on main; `native/wear/GATE-A.md` and `docs/WATCH-PROGRESS.md` on `codex/gt6-gate-a-watch-lab`.
- The owner's connected Gmail (checked 2026-09-29) has no Huawei review emails. The rejections are known only from the screenshots.
