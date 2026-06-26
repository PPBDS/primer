> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 09 — Smokes  *(Position 5, Medium predictive)*

- **Type:** example
- **Renderings:** chapter ✓ · tutorial ✓ · class exercise —
- **Status:** **Replaced.** Earlier drafts at this slot used a constructed Biden 2024 YouGov tibble (intercept-only logistic) and then a 2024 NES Democratic-vote design. Both have a political framing the curriculum has plenty of elsewhere (positions 6, 7, 8, 9, 11, 12). The current design swaps in a non-political binary outcome — whether an adult has ever smoked — using a curated NHANES cut packaged in `primer.tutorials::smokes`. Same dataset family students saw at position 1 (05 Recruits drew its `recruits` cut from NHANES too), so the data is familiar; the model and outcome are new.
- **"Imagine":** You are a public-health analyst at a state health department designing the next anti-smoking campaign. To target outreach, you want to know which adults are most likely to be smokers, broken out by basic demographics like age and sex. There are many decisions to make.
- **Dataset:** `smokes` (`primer.tutorials`) — a 1,000-row teaching cut of the NHANES 2009--2012 educational subset bundled in the **NHANES** CRAN package. Restricted to adults aged 20--80 with non-missing values on smoking status, age, and sex. Built by `data-raw/smokes.R`; documented in `R/smokes.R`.
- **Outcome:** `smoke` — factor with levels `"No"` and `"Yes"`; "Yes" means the respondent has ever smoked at least 100 cigarettes (the standard public-health "ever-smoker" definition). Stored as a factor for `logistic_reg(engine = "glm")` (factor-outcome gotcha, §13.4).
- **Treatment / Key covariate:** `sex` (binary: Female / Male) is the covariate with the clean signal. `age` (continuous, 20--80) has a borderline coefficient whose CI just barely crosses zero — pedagogically useful as the "this covariate doesn't help much" Fit B.
- **Question (QoI):** What is the difference in the probability of having ever smoked between a 30-year-old woman and a 70-year-old man? *(One specific number per §13.1; uses both covariates.)*
- **Model:** Logistic regression on the link scale; interpretation lives downstream in `marginaleffects` (probability scale). Per §13.5 *Interpretability ceiling*, link-scale coefficients are noted in a knowledge drop but not the focus of student interpretation.
- **Causal / Predictive:** Predictive. Comparison language only — *"the probability that a [Male] is a smoker is X percentage points higher than the probability that a [Female] is a smoker, adjusting for age."* No causal framing — the model says nothing about *what causes* smoking.
- **Student project:** `smokes`
- **Data prep:** none in the tutorial — the `smokes` tibble is already filtered, sampled, and factor-coded. Setup chunk loads `library(primer.tutorials)` and uses `smokes` directly (no intermediate `x`).
- **Final model:** `logistic_reg(engine = "glm") |> fit(smoke ~ age + sex, data = smokes)` → `fit_smokes`
- **Courage three-fit block** (per §13.4):
  - Fit A: `smoke ~ sex` (binary, clean signal)
  - Fit B: `smoke ~ age` (continuous, borderline — the "covariate barely helps" lesson)
  - Fit C (final): `smoke ~ age + sex` (combined, with link-scale interpretation cautions)
- **Preceptor Table:** Unit (Adult) | Outcome (Ever Smoked) | Covariates (Age, Sex)
- **Population Table:** Source | Unit/Time (Adult, Year) | Outcome (Ever Smoked) | Covariates (Age, Sex)
- **Authoring notes:**
  - **Approximate fit values** (from the 1,000-row analysis sample, set.seed(2026)):
    - Fit A `smoke ~ sex`: intercept (Female) ≈ -0.54, sexMale ≈ +0.54 (CI [0.29, 0.80]).
    - Fit B `smoke ~ age`: intercept ≈ -0.60, age ≈ +0.007 (CI [-0.001, +0.014] — borderline).
    - Fit C `smoke ~ age + sex`: intercept ≈ -0.88, age ≈ +0.007 (CI [-0.001, +0.015]), sexMale ≈ +0.55 (CI [0.29, 0.80]).
    - Predicted probability of being an ever-smoker: 30y Female ≈ 0.34, 70y Female ≈ 0.41, 30y Male ≈ 0.47, 70y Male ≈ 0.54. The QoI (70y Male − 30y Female) ≈ 0.54 − 0.34 ≈ 0.20, about 20 percentage points.
  - **Link-scale cautions are mandatory at Medium.** Fit C's interpretation question must *not* ask the student to translate the log-odds coefficient on `sex` into outcome-scale terms. The author notes the link-scale form ("a coefficient of +0.55 on `sexMale` means the log-odds of being an ever-smoker are 0.55 higher for men than women") in a knowledge drop, then hands off to Temperance's `predictions()` for probability-scale answers. This is the curriculum's first link-function tutorial; build the handoff carefully.
  - **Why age stays in the final model despite a borderline coefficient.** Pedagogically, Fit B teaches "this covariate barely moves the needle on its own"; Fit C *keeps* age anyway so that interpretation of `sexMale` in Fit C requires the adjustment clause ("adjusting for age") that Easy tutorials introduced and Medium tutorials must keep mandatory.
  - **"Specific question" verification.** The QoI subtracts two probabilities (70y Male P=0.54, 30y Female P=0.34). The answer is one specific number (0.20, or 20 percentage points). The §13.1 specific-number rule is satisfied.
  - **Real-names + overlap rule (§10.2).** The Preceptor Table and Population Table use real-sounding adult identifiers (e.g. NHANES participant IDs paired with last names plausible for the survey population). At least one identifier appears in both the Data block (with one observed `smoke` value) and the Preceptor block (with both potential outcomes — though for a *predictive* tutorial there is just one outcome column, no hatching).
  - **Reframing student-progress note.** Position 5's directory was `10-biden` in earlier drafts and is being renamed to `09-smokes`. Existing student progress records keyed on the old `10-biden` ID will not carry forward. Document the rename in `NEWS.md` and bump the package version.

---

