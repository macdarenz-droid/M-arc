# Research grounding for the M/ARC coach

This file is the evidence base behind every principle the coach uses. The
app ships the same content as data in `src/data/principles.json`. When the
coach explains something, it may only lean on a card in this file. If a
claim is not here, the coach does not make it.

Each card states the principle in plain words, rates how settled the
evidence is, says what is genuinely disputed, and lists how the app uses
it. The rating scale:

| Rating | Meaning |
|---|---|
| **strong** | Multiple meta-analyses or a current position stand agree on the direction. |
| **moderate** | Good studies agree on the direction, but effect sizes, thresholds or populations are uncertain. |
| **contested** | Evidence is mixed, thin, or has been directly challenged. The app uses it only softly and says so. |
| **coaching consensus** | Widely taught and reasonable, but not established by controlled research. Labelled as such in copy. |

## How citations were verified

Verified on 2026-09-19. The build environment could not reach PubMed,
doi.org, Crossref, Europe PMC, Semantic Scholar or OpenAlex directly, so
each reference was checked against web-search records of the publisher
page and the PubMed entry: title, authors, journal, year and, where shown,
PubMed ID or DOI. Every reference below was found. Any reference that could
not be confirmed was to be dropped; none needed to be. Where a specific
number is quoted, it is a number the record itself showed. Numbers recalled
from memory are marked "approximately" and should be re-checked against the
full text when the network allows.

## What the coach must never claim

- That it can predict injury. No principle here supports injury prediction.
- That a recovery window is a fact. Windows are priors that widen with the user's own evidence.
- That a deload is "needed" because a number of weeks has passed.
- That any set count per week is a law. Bands are wide and labelled as bands.
- Anything about diet, calories, supplements, medication or medical conditions.
- That an estimate (one-rep max, body fat) is a measurement.

---

## P1. Progressive overload, and reps count as progress  — **strong**

**Statement.** To keep adapting, training has to get harder over time.
Adding repetitions at the same load is a legitimate form of progression,
not a placeholder for adding weight.

**Evidence.** The ACSM position stand on progression (2009) defines
progressive overload as the gradual increase in stress placed on the body
and treats load, volume, frequency and exercise selection as the levers.
The 2026 ACSM position stand, an overview of 137 systematic reviews,
reaffirms that resistance training improves strength, size and function
across adulthood and stresses consistency over perfection. Plotkin and
colleagues (2022) randomised trained lifters to progress either load at a
fixed rep range or repetitions at a fixed load for eight weeks; both groups
grew similarly (muscle thickness up roughly 7 to 13 percent across sites).

**Disputed.** Nothing about the direction. How fast to progress, and by how
much, is individual.

**App use.** The double-progression rule in `brain/progression.ts`: add a
rep until the top of the range, hit it twice without max effort, then take
one small load step. Findings: `progressing`, `plateau`, `decline`.

- ACSM. American College of Sports Medicine position stand. Progression models in resistance training for healthy adults. *Med Sci Sports Exerc.* 2009;41(3):687-708. PMID 19204579.
- ACSM. Position Stand. Resistance Training Prescription for Muscle Function, Hypertrophy, and Physical Performance in Healthy Adults: An Overview of Reviews. *Med Sci Sports Exerc.* 2026;58(4):851-872. PMID 41843416.
- Plotkin D, Coleman M, Van Every D, et al. Progressive overload without progressing load? The effects of load or repetition progression on muscular adaptations. *PeerJ.* 2022;10:e14142. PMID 36199287.

## P2. Weekly volume drives muscle growth, with diminishing returns — **strong** on direction, **contested** on exact numbers

**Statement.** More hard sets per muscle per week produce more growth, up
to a point. Past that point each extra set adds less and costs more
recovery. Where that point sits varies by person and muscle.

**Evidence.** Schoenfeld, Ogborn and Krieger (2017) meta-regressed 34
treatment groups and found a graded dose-response between weekly sets and
muscle size, with about ten weekly sets per muscle suggested as a threshold
for near-maximal gains. The 2026 ACSM position stand lists ten or more
weekly sets as the volume that enhanced hypertrophy. Pelland and colleagues
(2026) ran meta-regressions on volume and frequency and report a positive
dose-response for volume that flattens at higher doses.

**Disputed.** The exact shape at high volumes, whether there is a true
plateau or just diminishing returns, and how much of a set's value is lost
when it is far from failure. Individual response varies widely.

**App use.** `weeklyMuscleSets` in `brain/exposure.ts`. Findings:
`volume_drop`, `volume_spike`, `weekly_sets_out_of_band`, `uncovered_muscle`.
The band the app uses is deliberately wide and is described as a band.

- Schoenfeld BJ, Ogborn D, Krieger JW. Dose-response relationship between weekly resistance training volume and increases in muscle mass: A systematic review and meta-analysis. *J Sports Sci.* 2017;35(11):1073-1082. PMID 27433992. DOI 10.1080/02640414.2016.1210197.
- Pelland JC, Remmert JF, Robinson ZP, Hinson SR, Zourdos MC. The Resistance Training Dose Response: Meta-Regressions Exploring the Effects of Weekly Volume and Frequency on Muscle Hypertrophy and Strength Gains. *Sports Med.* 2026;56(2):481-505. PMID 41343037.
- ACSM 2026 position stand, as in P1.

## P3. Frequency matters mostly through volume — **moderate**

**Statement.** How many days a week you train a muscle matters less than
how much good work it gets across the week. Splitting the same volume over
more days can make each session better, but it is not required.

**Evidence.** Schoenfeld, Grgic and Krieger (2019) found no significant
hypertrophy difference between higher and lower frequencies when weekly
volume was equated, and an advantage for higher frequency only when it was
not. Grgic and colleagues (2018) found a similar pattern for strength.
Pelland (2026) reports only a small independent effect of frequency once
volume is accounted for. The 2026 ACSM position stand recommends two or
more sessions per week for strength.

**Disputed.** Whether very high per-session volumes become "junk volume",
which would make frequency matter more at the top end.

**App use.** Today's plan can swap a split without guilt: training a muscle
a day later mainly costs session quality, not progress. Split proposals
spread focus-muscle volume over at least two days as a way to fit more
quality work, not as a rule.

- Schoenfeld BJ, Grgic J, Krieger J. How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis of studies examining the effects of resistance training frequency. *J Sports Sci.* 2019;37(11):1286-1295. PMID 30558493.
- Grgic J, Schoenfeld BJ, Davies TB, Lazinica B, Krieger JW, Pedisic Z. Effect of Resistance Training Frequency on Gains in Muscular Strength: A Systematic Review and Meta-Analysis. *Sports Med.* 2018;48(5):1207-1220. PMID 29470825.
- Pelland 2026 and ACSM 2026, as above.

## P4. Effort can be rated by reps in reserve — **moderate** to **strong** as a tool

**Statement.** Asking "how many more reps could I have done?" is a valid,
practical way to measure how hard a set was. It tracks bar speed and load
well in both experienced and novice lifters.

**Evidence.** Zourdos and colleagues (2016) introduced a resistance
training RPE scale anchored on repetitions in reserve and found strong
inverse correlations between movement velocity and RPE in experienced
(r = −0.88) and novice (r = −0.77) squatters. Helms and colleagues (2016)
describe how to apply the scale in programming.

**Disputed.** Accuracy is lower far from failure and in beginners, and
people tend to underestimate how many reps they had left.

**App use.** The app's three-level effort (easy / ideal / max) is mapped to
reps-in-reserve bands: easy is roughly four or more in reserve, ideal
roughly one to three, max roughly zero to one. Missing ratings lower
confidence; they never count as easy or max. Findings: `effort_missing`,
`effort_drift_harder`, `effort_drift_easier`, `effort_mismatch`.

- Zourdos MC, Klemp A, Dolan C, et al. Novel Resistance Training-Specific Rating of Perceived Exertion Scale Measuring Repetitions in Reserve. *J Strength Cond Res.* 2016;30(1):267-275. PMID 26049792.
- Helms ER, Cronin J, Storey A, Zourdos MC. Application of the Repetitions in Reserve-Based Rating of Perceived Exertion Scale for Resistance Training. *Strength Cond J.* 2016;38(4):42-49. PMID 27531969.

## P5. Training close to failure helps growth a little; going to failure every set is not required — **moderate**, with real nuance

**Statement.** Sets need to be hard to be useful. Stopping a rep or two
short of failure gives most of the benefit for growth and all of it for
strength, at lower fatigue cost. Training to absolute failure on every set
is not superior and costs more recovery.

**Evidence.** Grgic and colleagues (2022) meta-analysed failure versus
non-failure training and found no overall difference for strength or
hypertrophy; when volume was not equated, non-failure favoured strength,
and in trained lifters failure favoured hypertrophy. Refalo and colleagues
(2023) found no evidence that momentary failure is superior for
hypertrophy and suggest a non-linear relationship. Robinson and colleagues
(2024) modelled proximity to failure continuously and report that
estimated closer proximity related to greater hypertrophy while strength
gain was little affected.

**Disputed.** How close is close enough for hypertrophy, and whether the
extra growth from the last rep is worth the extra fatigue. Reasonable
researchers still disagree.

**App use.** Goal reps-in-reserve bands in `data/goals.ts`. A strength goal
with max effort on every set triggers `effort_mismatch`. A growth goal does
not penalise max effort but the recovery model accounts for it.

- Grgic J, Schoenfeld BJ, Orazem J, Sabol F. Effects of resistance training performed to repetition failure or non-failure on muscular strength and hypertrophy: A systematic review and meta-analysis. *J Sport Health Sci.* 2022;11(2):202-211. PMID 33497853. DOI 10.1016/j.jshs.2021.01.007.
- Refalo MC, Helms ER, Trexler ET, Hamilton DL, Fyfe JJ. Influence of Resistance Training Proximity-to-Failure on Skeletal Muscle Hypertrophy: A Systematic Review with Meta-analysis. *Sports Med.* 2023;53(3):649-665. PMID 36334240. DOI 10.1007/s40279-022-01784-y.
- Robinson ZP, Pelland JC, Remmert JF, et al. Exploring the Dose-Response Relationship Between Estimated Resistance Training Proximity to Failure, Strength Gain, and Muscle Hypertrophy: A Series of Meta-Regressions. *Sports Med.* 2024;54(9):2209-2231. PMID 38970765.

## P6. Heavy loads for strength; a wide rep range works for size — **strong**

**Statement.** If the goal is maximal strength, lift heavy. If the goal is
muscle size, loads from light to heavy work about equally as long as sets
are taken close to failure.

**Evidence.** Schoenfeld, Grgic, Ogborn and Krieger (2017) meta-analysed
21 studies comparing loads at or below 60 percent of one-rep max with
heavier loads, both to failure: strength favoured heavy loads while
hypertrophy was similar across the spectrum. The 2026 ACSM position stand
lists loads of 80 percent of one-rep max or more, full range of motion,
two to three sets and at least two sessions a week for strength, and
moderate loads (30 to 70 percent) for power.

**Disputed.** Very light loads (under roughly 30 percent) are less
efficient and much more fatiguing per unit of growth.

**App use.** Goal rep ranges. Finding `rep_range_mismatch` fires when a
lift's typical reps sit outside the goal's range for several sessions, and
is worded as a nudge for strength goals and as information for growth
goals.

- Schoenfeld BJ, Grgic J, Ogborn D, Krieger JW. Strength and Hypertrophy Adaptations Between Low- vs. High-Load Resistance Training: A Systematic Review and Meta-analysis. *J Strength Cond Res.* 2017;31(12):3508-3523. PMID 28834797.
- ACSM 2026 position stand, as in P1.

## P7. Recovery takes one to three days and depends on how hard and how much — **moderate** on the shape, **weak** on exact hours

**Statement.** After a hard session a muscle's ability to perform is
reduced for roughly one to three days. Bigger, harder, more novel sessions
take longer; familiar sessions take less. Trained people recover faster
than beginners because damage shrinks with practice.

**Evidence.** Paulsen and colleagues (2012) reviewed exercise-induced
muscle damage and group it by severity of force loss: mild cases recover
within about two days, moderate ones over several days, severe ones take
more than a week. Damas and colleagues (2016) followed lifters over ten
weeks: muscle damage was highest after the first session, lower by week
three and minimal by week ten, and growth appeared only once damage had
attenuated. The repeated-bout effect is the mechanism.

**Disputed.** Exact hours per muscle, and how much individual variation
there is. There is no table of recovery times by muscle that the evidence
supports.

**App use.** `brain/recovery.ts` uses 24, 48 and 72 hours by effort as a
prior. Planned change: scale the window by the session's volume relative to
the muscle's own trailing baseline, and keep the rule that the window never
shrinks below the effort floor. Personal widening from the user's own
short-rest performance stays. Copy says "you will probably perform worse",
never "you will get hurt". Findings: `under_recovered`.

- Paulsen G, Mikkelsen UR, Raastad T, Peake JM. Leucocytes, cytokines and satellite cells: what role do they play in muscle damage and regeneration following eccentric exercise? *Exerc Immunol Rev.* 2012;18:42-97. PMID 22876722.
- Damas F, Phillips SM, Libardi CA, et al. Resistance training-induced changes in integrated myofibrillar protein synthesis are related to hypertrophy only after attenuation of muscle damage. *J Physiol.* 2016;594(18):5209-5222. DOI 10.1113/JP272472.

## P8. Planned deloads: weak evidence; easing off when signals say so: reasonable — **contested**

**Statement.** Taking an easier week on a fixed schedule has not been shown
to improve muscle growth, and one trial found it slightly hurt strength.
What is well supported is that reduced training keeps most of your gains,
so an easier week costs little when you actually need one.

**Evidence.** Coleman and colleagues (2024) randomised trained lifters to
a nine-week programme with or without a one-week break in the middle: no
difference in hypertrophy, power or endurance, and a small negative effect
on lower-body strength for the deload group. Ogasawara and colleagues
(2013) found that three cycles of six weeks training plus three weeks off
produced similar hypertrophy to 24 weeks continuous. Bosquet and colleagues
(2013) meta-analysed training cessation: strength declines moderately and
the decline grows with time off.

**Disputed.** Whether deloads help people who are genuinely
over-reached, which trials of healthy volunteers do not test.

**App use.** The coach never proposes a deload by calendar. It proposes an
easier week only when several lifts decline together and effort at the
same load is rising, and it frames it as a response to those signals.
Proposal: `deload_week`.

- Coleman M, Burke R, Augustin F, et al. Gaining more from doing less? The effects of a one-week deload period during supervised resistance training on muscular adaptations. *PeerJ.* 2024;12:e16777. DOI 10.7717/peerj.16777.
- Ogasawara R, Yasuda T, Ishii N, Abe T. Comparison of muscle hypertrophy following 6-month of continuous and periodic strength training. *Eur J Appl Physiol.* 2013;113(4):975-985. DOI 10.1007/s00421-012-2511-9.
- Bosquet L, Berryman N, Dupuy O, et al. Effect of training cessation on muscular performance: A meta-analysis. *Scand J Med Sci Sports.* 2013;23(3):e140-e149. PMID 23347054.

## P9. Time off costs less than people fear, and regain is fast — **moderate**

**Statement.** A few weeks away reduces strength modestly. Muscle and
strength come back faster than they were first built.

**Evidence.** Bosquet (2013) quantifies the decline. Ogasawara (2013)
shows periodic breaks did not compromise six-month gains. Seaborne and
colleagues (2018) showed human muscle retains an epigenetic memory of
earlier growth that is reactivated on retraining.

**Disputed.** How long memory lasts and how much is muscle versus skill.

**App use.** Re-entry rule: more than 28 days away means repeat the last
load once, no increase. Finding `long_gap`. Copy: "strength comes back
fast; make the first session easy".

- Seaborne RA, Strauss J, Cocks M, et al. Human Skeletal Muscle Possesses an Epigenetic Memory of Hypertrophy. *Sci Rep.* 2018;8:1898. PMID 29382913.
- Bosquet 2013 and Ogasawara 2013, as in P8.

## P10. Beginners: start light, add small steps often — **moderate**, with **coaching consensus** for the specific rule

**Statement.** New lifters respond to modest doses and progress quickly.
Starting conservatively and adding small amounts each session is safer and
loses nothing.

**Evidence.** The ACSM 2009 position stand recommends novices work in an
8 to 12 rep range and increase load by roughly 2 to 10 percent once one or
two reps beyond target can be completed. Peterson, Rhea and Alvar (2005)
review meta-analyses showing training status changes the dose-response:
untrained people gain from lower doses. The specific "two clean sessions at
the top of the range, then one step" is the widely taught two-for-two
coaching rule; it is sensible, not a trial result.

**Disputed.** There is no research table of starting weights. Empty bar or
lightest dumbbell plus fast early progression is the honest default.

**App use.** `startingLoadKg` in `core/exercises.ts`, load steps of 1, 2 or
2.5 kg capped at 10 percent, and the confirm-then-step rule.

- ACSM 2009 position stand, as in P1.
- Peterson MD, Rhea MR, Alvar BA. Applications of the dose-response for muscular strength development: a review of meta-analytic efficacy and reliability for designing training prescription. *J Strength Cond Res.* 2005;19(4):950-958.

## P11. Changing exercises: a useful reset, not a growth hack — **contested**

**Statement.** Swapping a stalled exercise for a similar one can spread
growth across a muscle and refresh motivation. It has not been shown to
grow more muscle overall.

**Evidence.** Fonseca and colleagues (2014) found varied exercise
selection produced more uniform quadriceps growth and efficient strength
gains over twelve weeks. Kassiano and colleagues (2022) reviewed eight
studies and found no meaningful hypertrophy advantage for variation, while
noting a plausible role in motivation and adherence.

**Disputed.** Whether the Fonseca result reflects regional growth or
measurement. Too much variation slows skill and makes progress hard to
track.

**App use.** Proposal `exercise_swap` for a plateaued lift, drawing from the
same movement pattern in the library, worded as "a fresh stimulus and a
reset, not a fix". Finding `redundant_exercises` for near-duplicate work in
one split.

- Fonseca RM, Roschel H, Tricoli V, et al. Changes in exercises are more effective than in loading schemes to improve muscle strength. *J Strength Cond Res.* 2014;28(11):3085-3092. DOI 10.1519/JSC.0000000000000539.
- Kassiano W, Nunes JP, Costa B, Ribeiro AS, Schoenfeld BJ, Cyrino ES. Does Varying Resistance Exercises Promote Superior Muscle Hypertrophy and Strength Gains? A Systematic Review. *J Strength Cond Res.* 2022;36(6):1753-1762. PMID 35438660.

## P12. Rest longer between heavy sets — **moderate**

**Statement.** Two to three minutes between sets beats one minute for
strength and, in trained lifters, for growth. Shorter rests are fine for
lighter isolation work and for beginners.

**Evidence.** Schoenfeld and colleagues (2016) compared one- and
three-minute rests in trained men over eight weeks and found greater
strength and hypertrophy with three minutes. Grgic and colleagues (2018)
systematically reviewed rest intervals for strength and concluded longer
rests (over two minutes) favour trained lifters while shorter rests can
suffice for the untrained.

**Disputed.** The optimum for hypertrophy with isolation exercises.

**App use.** The rest timer default is 90 seconds. Proposal `rest_default`
suggests two to three minutes on compound lifts for a strength goal. The
app does not log per-set rest, so this is advice about the default, not a
measured finding.

- Schoenfeld BJ, Pope ZK, Benik FM, et al. Longer Interset Rest Periods Enhance Muscle Strength and Hypertrophy in Resistance-Trained Men. *J Strength Cond Res.* 2016;30(7):1805-1812. PMID 26605807.
- Grgic J, Schoenfeld BJ, Skrepnik M, Davies TB, Mikulic P. Effects of Rest Interval Duration in Resistance Training on Measures of Muscular Strength: A Systematic Review. *Sports Med.* 2018;48(1):137-151. PMID 28933024.

## P13. Push and pull balance — **coaching consensus**

**Statement.** Training the back and rear shoulders roughly as much as the
chest and front shoulders is standard coaching advice for shoulder health
and even development. It is reasonable. It has not been tested in trials
of everyday lifters.

**Evidence.** Kolber and colleagues (2010) reviewed shoulder injuries in
the resistance-training population and report that up to 36 percent of
documented training injuries involve the shoulder complex, with exercise
selection and technique among the suspected factors. There is no
randomised evidence that a particular push-to-pull ratio prevents injury.

**Disputed.** Almost everything specific. The app keeps the rule because
lopsided programmes are common and the cost of fixing them is low.

**App use.** `brain/balance.ts`. Finding `balance_imbalance`, with softened
copy and the "coaching consensus" label in the explanation.

- Kolber MJ, Beekhuizen KS, Cheng MS, Hellman MA. Shoulder injuries attributed to resistance training: a brief review. *J Strength Cond Res.* 2010;24(6):1696-1704. PMID 20508476.

## P14. Short sleep lowers strength performance — **moderate** to **strong**

**Statement.** A short night measurably reduces next-day strength,
especially on big compound lifts. Rating effort honestly on those days
keeps the coach from misreading a tired session as a real decline.

**Evidence.** Knowles and colleagues (2018) systematically reviewed sleep
loss and resistance exercise and concluded inadequate sleep impairs
maximal strength, more clearly for multi-joint than single-joint efforts.
Craven and colleagues (2022) meta-analysed 227 outcomes from 69 studies and
report a mean 7.56 percent performance decrease after acute sleep loss,
varying by exercise type and timing.

**Disputed.** Thresholds and how much habitual short sleep matters versus
one bad night.

**App use.** Only when Health Connect provides sleep. Finding
`low_sleep_readiness` suggests keeping the load and not chasing records
that day. Never fires without sleep data.

- Knowles OE, Drinkwater EJ, Urwin CS, Lamon S, Aisbett B. Inadequate sleep and muscle strength: Implications for resistance training. *J Sci Med Sport.* 2018;21(9):959-968. PMID 29422383. DOI 10.1016/j.jsams.2018.01.012.
- Craven J, McCartney D, Desbrow B, et al. Effects of Acute Sleep Loss on Physical Performance: A Systematic and Meta-Analytical Review. *Sports Med.* 2022;52(11):2669-2690. PMID 35708888.

## P15. Habits form through repeated cues, slowly, and survive missed days — **moderate**

**Statement.** Training at a consistent time and context builds
automaticity over weeks to months. Deciding in advance when and where you
will train roughly doubles the odds of doing it. Missing one day does not
undo the habit.

**Evidence.** Lally and colleagues (2010) tracked 96 volunteers for twelve
weeks: automaticity grew along an asymptotic curve, the median time to
plateau was about 66 days with a very wide range, and missing an
occasional repetition did not materially impair formation. Gollwitzer and
Sheeran (2006) meta-analysed 94 tests of implementation intentions
("when X, I will Y") and found a medium-to-large effect on goal attainment
(d = 0.65). Kaushal and Rhodes (2015) followed 111 new gym members and
found about four sessions a week for six weeks was the minimum associated
with habit formation.

**Disputed.** Whether phone reminders help long term or just create
fatigue. Evidence for reminders is modest, so the app caps them hard.

**App use.** Learned schedule proposals and cue-timed nudges. At most one
nudge a day, none on days already trained, retired quietly when a habit
day goes cold, one tap to turn off, no streak shaming. Finding
`habit_pattern`; proposal `schedule`.

- Lally P, van Jaarsveld CHM, Potts HWW, Wardle J. How are habits formed: Modelling habit formation in the real world. *Eur J Soc Psychol.* 2010;40(6):998-1009. DOI 10.1002/ejsp.674.
- Gollwitzer PM, Sheeran P. Implementation intentions and goal achievement: A meta-analysis of effects and processes. *Adv Exp Soc Psychol.* 2006;38:69-119. DOI 10.1016/S0065-2601(06)38002-1.
- Kaushal N, Rhodes RE. Exercise habit formation in new gym members: a longitudinal study. *J Behav Med.* 2015;38(4):652-663. PMID 25851609. DOI 10.1007/s10865-015-9640-7.

## P16. One-rep-max estimates are estimates — **moderate**

**Statement.** Formulas that predict a one-rep max from a set of several
reps correlate well with real maxes but carry bias, and they get worse as
reps go up.

**Evidence.** LeSuer and colleagues (1997) tested seven prediction
equations against measured maxes in bench, squat and deadlift: all
correlations exceeded 0.95, yet most equations showed significant average
error, and accuracy depends on the lift.

**Disputed.** Which equation is best; none is exact.

**App use.** `estimatedOneRm` uses the Epley form and caps reps at ten.
Copy always says "about X kg one-rep estimate". The app never suggests
testing a true max from it.

- LeSuer DA, McCormick JH, Mayhew JL, Wasserstein RL, Arnold MD. The Accuracy of Prediction Equations for Estimating 1-RM Performance in the Bench Press, Squat, and Deadlift. *J Strength Cond Res.* 1997;11(4):211-213.

## P17. Acute-versus-chronic load ratios — **contested**

**Statement.** Comparing this week's training load with the recent average
is a reasonable way to notice a sudden jump. It is not a validated
predictor of injury, and the app does not use it as one.

**Evidence.** Gabbett (2016) popularised the training-injury prevention
paradox and the acute:chronic workload ratio in team sport. Impellizzeri
and colleagues (2020) laid out conceptual and statistical pitfalls of the
ratio and note that no study has properly estimated causal effects, so
manipulating it to change injury rates is conjecture.

**Disputed.** Most of it.

**App use.** A per-muscle acute-to-chronic volume ratio is one soft input
to `volume_spike` and to the deload signal. The copy never mentions injury
risk.

- Gabbett TJ. The training-injury prevention paradox: should athletes be training smarter and harder? *Br J Sports Med.* 2016;50(5):273-280. PMID 26758673. DOI 10.1136/bjsports-2015-095788.
- Impellizzeri FM, Tenan MS, Kempton T, Novak A, Coutts AJ. Acute:Chronic Workload Ratio: Conceptual Issues and Fundamental Pitfalls. *Int J Sports Physiol Perform.* 2020;15(6):907-913.

## P18. Tape-measure body fat is an estimate — **moderate**

**Statement.** The circumference method estimates body fat within a few
percentage points for most people and is useful for tracking direction
over time, not for a precise number.

**Evidence.** Hodgdon and Beckett (1984) developed and cross-validated the
equations on 602 US Navy men against hydrostatic weighing; secondary
sources report a correlation of about 0.90 and a typical error of about
three to four percentage points.

**Disputed.** Accuracy at the extremes of body composition and in
populations unlike the original sample.

**App use.** `navyBodyFat` in `brain/bodyfat.ts`. Copy shows the estimate
with "about" and a plus-or-minus range and calls it an estimate.

- Hodgdon JA, Beckett MB. Prediction of percent body fat for U.S. Navy men from body circumferences and height. Naval Health Research Center, San Diego. Report No. 84-11. 1984.

## P19. Self-reported wellness is worth tracking over time; one reading, alone, is a weak signal — **moderate**

**Statement.** Short, regular self-reports of soreness, fatigue, stress
and sleep are a validated, low-cost way to monitor how someone is coping
with training, when tracked over time. A single soreness rating on a
single day, on its own, correlates weakly with actual muscle damage and
should not be read as measuring anything by itself.

**Evidence.** Hooper and Mackinnon (1995) validated a daily wellness
questionnaire (fatigue, stress, muscle soreness, sleep quality) against
physiological markers in swimmers, finding it predicted staleness better
than several objective measures. The related session-RPE method (Foster
et al., 2001), where an athlete's own rated exertion multiplied by session
duration tracks training load, has been supported by 36 subsequent
validity and reliability studies across ages, sports and expertise levels.
Against that, Nosaka and colleagues (2002) found delayed-onset muscle
soreness a poor reflector of the magnitude of actual exercise-induced
muscle damage — soreness and damage do not move together reliably.

**Disputed.** A soreness or fatigue rating from one day says little on its
own; the signal is in the pattern over time and the honesty of the
self-report, not any single value. This card supports noticing and
recalling what someone told the app, never diagnosing, rating severity, or
inferring a cause from it.

**App use.** A note or check-in that mentions discomfort, fatigue or an
equipment issue is tagged and can be recalled later — never diagnosed,
never given a cause. Finding `note_flag`.

- Hooper SL, Mackinnon LT. Monitoring overtraining in athletes: recommendations. *Sports Med.* 1995;20(5):321-327. PMID 8584849.
- Foster C, Florhaug JA, Franklin J, et al. A new approach to monitoring exercise training. *J Strength Cond Res.* 2001;15(1):109-115. PMID 11708692.
- Nosaka K, Newton M, Sacco P. Delayed-onset muscle soreness does not reflect the magnitude of eccentric exercise-induced muscle damage. *Scand J Med Sci Sports.* 2002;12(6):337-346. PMID 12453160.

---

## Maintenance

Cards are versioned with the app. A change to a card's statement,
rating or citations bumps `principles.json`'s `version`. A review of new
literature, with proposed card changes and a changelog entry, is done on a
cadence the maintainer sets, and nothing ships until the maintainer
approves the diff.
