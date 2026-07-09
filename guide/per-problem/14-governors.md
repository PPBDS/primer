> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 14 — Governors  *(Position 10, Hard causal — recast from predictive)*

- **Type:** example
- **Renderings:** chapter planned · tutorial planned · class exercise ✓ (`primer.exercises` repo, `governors/`)
- **Status:** **Recast required.** The existing tutorial frames this as a predictive question — *"how long do gubernatorial candidates live after their election?"*. Under the new §1.5 alternation, position 10 is causal, and the Barfort et al. 2020 paper is a close-election RDD study whose natural framing *is* causal. Rewrite the tutorial around the causal question.
- **"Imagine":** You are considering a run for governor and want to know whether winning changes how long you are likely to live.
- **Dataset:** `governors` (Barfort et al. 2020) (`primer.data`)
- **Outcome:** `lived_after` — years lived after election (continuous)
- **Treatment / Key covariate:** election outcome (won/lost), identified by close-margin quasi-randomization
- **Quantity of Interest (QoI):** What is the causal effect of winning a gubernatorial election on lifespan?
- **Model:** Linear regression restricted to close-margin elections; treatment = win/lose. Interaction with `election_age` and `sex` optional.
- **Causal / Predictive:** Causal
- **Student project:** `governors`
- **Data prep (revised):** `governors |> filter(year > 1945) |> filter(margin < 5) |> select(last_name, year, state, sex, lived_after, election_age, region, won)` → `x`  *(pseudocode — margin column name and cutoff to be confirmed against `primer.data`)*
- **Final model (revised):** `linear_reg(engine = "lm") |> fit(lived_after ~ won + election_age + sex, data = x)` → `fit_governors`  *(treatment = `won`; interaction terms optional at Hard tier)*
- **Preceptor Table:** Unit (Candidate) | Potential Outcomes (Years Lived if Won, Years Lived if Lost) | Treatment (Election Outcome) | Covariates (Age at Election, Sex)
- **Population Table:** Source | Unit/Time (Candidate, Year) | Potential Outcomes (Years Lived if Won, Years Lived if Lost) | Treatment (Election Outcome) | Covariates (Age at Election, Sex)
- **Class-exercise rendering** (`primer.exercises` repo, `governors/`, built 2026-07-06 from `bootcamp/_internal/week-7/`): follows the class-exercise two-scenario rule. Scenario 1 (predictive): *"Imagine you work for a life insurer, and want to forecast how long candidates for the US Senate might live based on their age, party, election result, and other variables."* Scenario 2 (causal): *"Imagine you are a researcher. You want to know if winning candidates live longer. You are interested in candidates for any elected office --- senate, governor, mayor, et cetera."* Data ships as `data/governors.csv` (full 3,587-row `primer.data::governors`); students build the analysis tibble `x` (close elections `abs(win_margin) <= 5`, `year > 1945`, `election_result` from `win_margin`; 254 rows). Class model — **differs from the planned tutorial model above**: `linear_reg() |> fit(lived_after ~ election_result + win_margin + election_age + party, data = x)` → `fit_governors`; equation `67.6 + 8.63·Win − 1.46·win_margin − 0.89·election_age + 4.04·Republican − 9.50·Third`. Headline: winning +8.63 years [3.3, 14.0] via `avg_comparisons()`, vs. a raw group gap of only 2.4 — the running-variable control is the teaching moment.
- **Author note:** The RDD identification story is what makes this Hard-tier — not the model specification itself (which is still a linear regression). The Justice section should name the RDD assumption explicitly and discuss the close-margin restriction as the mechanism that makes unconfoundedness plausible. Per §1.3 *unconfoundedness worked example (Hard)*, name the design family (RDD) without teaching it in depth; that framing belongs in the Difficult tier.

---

