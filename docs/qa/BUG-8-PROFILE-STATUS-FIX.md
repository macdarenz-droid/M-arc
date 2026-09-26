# BUG-8: the profile shows "Not set" for details that are saved, and "Male" looks chosen when sex was never saved

Owner report, 2026-09-27, with phone screenshots. Main is at d2c0ba4.

## What the owner sees
- **Profile sheet:**
  - Birth year 1998 shows "Updated Fri, 25 Sept".
  - Sex shows **Male highlighted**, but the hint says **"Not set"**.
  - Height 164 shows "Not set".
  - Body weight 70 shows "Not set · 2 weigh-ins logged".
- **Escobar tab, "What the coach can see":** Profile is "3 of 4 details", and "Calories, heart-rate zones and age-adjusted recovery" is still shown as locked.
- The owner believes the profile is complete.

## Root cause (checked against main)
1. `src/slices/profile/Profile.tsx:41`: `<Segmented value={s.profile.sex ?? 'male'} …>` shows **Male as selected when `profile.sex` is undefined**.
   - The data really is unset: `profileCompleteness` (`src/brain/onboarding.ts:19-26`) counts `sex != null` and reports 3 of 4.
   - The UI lies. The owner never taps Male because it already looks chosen, so calories never unlock.
2. `Profile.tsx:14-16` `updatedHint()` returns "Not set" whenever `lastChangeAt(s.profileHistory, field)` finds no history entry, **even when the value exists**.
   - Values that came from onboarding, an import, Health Connect or a backup restore without a `profileHistory` entry show "Not set" next to a filled-in value (height 164, weight 70).

## Fix (smallest change; no saved-data shape change)
1. **Sex with no value:** when `profile.sex` is undefined, neither option is selected.
   - `Segmented` in `src/ui/primitives.tsx` accepts `value: T | undefined`.
   - With `undefined`, no button has `aria-pressed="true"` / `aria-selected="true"`.
   - Profile passes `s.profile.sex` without the `?? 'male'` fallback.
   - Tapping Male or Female saves it (`setSex`), and the hint becomes "Updated …".
   - Check every other `Segmented` caller: none of them pass `undefined` today, so their behaviour is unchanged.
2. **Honest hints.** Replace `updatedHint(at)` with `statusHint(value, at)`:
   - value present and a history time exists → `Updated <stamp>` (unchanged);
   - value present and no history → `Saved`;
   - value missing → `Not set`.

   Apply it to birth year, sex, height and body weight. For body weight, use the latest weigh-in's time when there is no profile history: the weigh-in log has dates. If `WeightEntry` doesn't carry a time, show `Saved`.
3. **Escobar tab row (Coach.tsx:322):**
   - When incomplete, name what is missing instead of the generic list, e.g. "Add sex to unlock calories". Use `profileCompleteness`'s booleans; the text for each missing field comes from the Profile sheet's "Unlocks:" lines.
   - When complete, show "All 4 details".

## Acceptance (each needs a test that fails on main and passes after)
- A. A unit or DOM test (tests/profile or a new test): with `profile.sex` undefined, the Profile sheet renders no pressed Sex option.
- B. After tapping Male: `profile.sex === 'male'`, a profileHistory entry exists, and the hint reads "Updated …".
- C. `statusHint(164, undefined)` returns `Saved`; `statusHint(undefined, undefined)` returns `Not set`; `statusHint(164, iso)` returns `Updated …`.
- D. The Coach "What the coach can see" Profile row names the missing field when incomplete, and reads complete for 4 of 4.
- E. A gate probe `// BUG-8:` block (add-only):
  - seed a profile with birthYear 1998, height 164 and weight 70, sex unset, and no profileHistory for height or weight;
  - the Profile sheet shows no pressed Sex option;
  - height and weight hints read "Saved", not "Not set";
  - after a real tap on Male, the Escobar tab row reads 4 of 4.
- `npm run check`, `npm run test:tz`, and the full gate with `TZ=Pacific/Auckland` all pass. No assertion is loosened.

## Do not touch
- src/core/models.ts, src/core/store.ts (no stored-data change)
- escobar-worker/**, native/wear/**, src/native/wearEngine.ts, WatchLab.tsx, .github/**, package.json

## Note on coordination
b5 (item 4) is rewriting `Segmented` for I10 (the sliding thumb). This fix makes `value` optional. b5 must hide the thumb when no option is selected (index −1). The supervisor tells b5.

## Needs a real phone
Only a quick look that the Sex choice now shows as unset until tapped, and that calories unlock after it's set.
