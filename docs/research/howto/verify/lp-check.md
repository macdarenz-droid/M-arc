# LP check: horizontal_leg_press top knee angle, leg_press_calf_raise ankle range

Source check for lib4-cards 13.3 and 13.4 (D-LIB8-shrug, PQ-H3). Base `claude/libht-research` @ 0393aac9. No card edited, no source added. Fetched 2026-10-18 with curl, HTML stripped to plain text, each page searched in full for: degree, °, angle, lock, straight, extension, flexion, range of motion, cm, inch, heel, ankle, stretch, short of.

PubMed pages (pubmed.ncbi.nlm.nih.gov) returned HTTP 203 with a "Cookies must be enabled" page and no abstract. The same PubMed abstracts were then fetched as text from NCBI E-utilities (`https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=<PMID>&rettype=abstract&retmode=text`), status 200. Every card lists these sources as `access: abstract`, so the abstract is all that was checked.

## 1. horizontal_leg_press: knee angle at the top

**Answer: no sourced number.** No source on the card gives the top-of-press knee angle in degrees, as a range, or as degrees short of lockout. The top is stated only in words:

- ACE (c4), Step 3: "Continue extending your hips and knees until the knees reach a relaxed, extended position, with the heels still pressed firmly into the plate. Do not hyperextend (lock-out) your knees". Its only number is the start: "the bend in your knees is at approximately 90 degrees" (Step 1).
- WebMD (c4), 'Seated Leg Press Form': "you should stop just short of a full knee extension while pushing on the platform." and "It is important for best results to stop just before locking the knees while platform pressing." Its only numbers are the start and bottom: "bends the knees at about 90 degrees" ('How to Do a Seated Leg Press') and "do not let your thigh lower to below the 90-degree level at the knee" ('Seated Leg Press Form').
- escamilla2001 (abstract, CONCLUSIONS): "training within the functional 0-50 degrees range may be efficacious for those whose goal is to minimize knee forces." This is a knee-flexion training range whose end is 0 degrees; it gives no stop short of lockout, so it does not set the top angle.
- barnds2019 (abstract, last sentence): "The risk of knee dislocation can be reduced by avoiding locking and hyperextension of the knees during any type of leg press or squatting exercise." No number.

The plate's 15° has no source on this card.

| Source | URL | Fetch | Number for the top knee angle |
|---|---|---|---|
| ace-seated-leg-press | https://www.acefitness.org/resources/everyone/exercise-library/154/seated-leg-press/ | 200 | none |
| webmd-seated-leg-press | https://www.webmd.com/fitness-exercise/how-to-do-seated-leg-presses | 200 | none |
| barnds2019 | https://pubmed.ncbi.nlm.nih.gov/30676343/ | 203 (cookie wall); E-utilities abstract 200 | none |
| tassi1998 | https://pubmed.ncbi.nlm.nih.gov/9651694/ | 203 (cookie wall); E-utilities abstract 200 | none (no angles) |
| tassi1999 | https://pubmed.ncbi.nlm.nih.gov/10499208/ | 203 (cookie wall); E-utilities abstract 200 | none (no angles) |
| escamilla2001 | https://pubmed.ncbi.nlm.nih.gov/11528346/ | 203 (cookie wall); E-utilities abstract 200 | none ("0-50 degrees" knee-flexion range; feet "turned out 30 degrees") |
| macdougall1985 | https://pubmed.ncbi.nlm.nih.gov/3980383/ | 203 (cookie wall); E-utilities abstract 200 | none |
| acsm2009 | https://pubmed.ncbi.nlm.nih.gov/19204579/ | 203 (cookie wall); E-utilities abstract 200 | none |

## 2. leg_press_calf_raise: ankle range larger than 30-45°, or travel in cm

**Answer: yes, one source states a larger ankle range: kassiano2023, 50° in total (−25° to +25°), on a horizontal leg press. No source gives footplate travel or heel drop in cm.**

- kassiano2023 (abstract, methods): "The calf raise exercise was performed in a pin-loaded, horizontal, leg-press machine, in 3 sets of 15-20 repetition maximum. The subjects were randomly assigned to 1 of the 3 groups: FULL ROM (ankle: -25° to +25°), INITIAL ROM (ankle: -25° to 0°), and FINAL ROM (ankle: 0° to +25°), where 0° was defined as an angle of 90° of the foot with the tibia."
  - The 50° total is the span from −25° to +25°; the abstract does not write "50". The abstract does not say which sign is dorsiflexion. By its title ("Partial Range of Motion Training Performed at Long Muscle Lengths") and its result that INITIAL ROM is the long-length arm, −25° is the stretched (heel-down) end, but this sign mapping is read from context, not stated.
  - This is a study arm, not a technique instruction. The same abstract concludes in favour of the partial arm: "the inclusion of the calf raise exercise performed with partial ROM in the initial portion of the excursion should be considered."
- yessis-lpcr (c4), 'Execution': "Extend the feet at a slow to moderate rate of speed through approximately a 30 — 45° range of motion." and "return (under control) until the feet are in a position of slight dorsi flexion (ball of the foot about 10 — 20° toward the shin from the neutral position)." 'Training Tips' argues against more range on this machine: "If you fully extend the ankle in the up and down movements the possibility of slipping off the resistance platform is increased greatly. Thus it is important that you limit the range of motion to ensure that the feet remain in contact with the resistance platform." No cm.

| Source | URL | Fetch | Ankle range / cm |
|---|---|---|---|
| yessis-lpcr | https://doctoryessis.com/?p=2881 | 200 | 30-45° range; 10-20° dorsiflexion at the bottom; no cm |
| kassiano2023 | https://pubmed.ncbi.nlm.nih.gov/37015016/ | 203 (cookie wall); E-utilities abstract 200 | −25° to +25° (FULL ROM); no cm |
| barnds2019 | https://pubmed.ncbi.nlm.nih.gov/30676343/ | 203 (cookie wall); E-utilities abstract 200 | none |
| macdougall1985 | https://pubmed.ncbi.nlm.nih.gov/3980383/ | 203 (cookie wall); E-utilities abstract 200 | none |
| acsm2009 | https://pubmed.ncbi.nlm.nih.gov/19204579/ | 203 (cookie wall); E-utilities abstract 200 | none |
