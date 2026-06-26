> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 08 — Seguro Popular  *(Position 4, Easy causal)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **Renderings:** chapter ✓ · tutorial ✓ · class exercise —
- **Directory + chapter file:** `inst/tutorials/08-seguro-popular/`, `book/08-seguro-popular.qmd`. The tutorial YAML id is `08-seguro-popular`. The dataset in `primer.data` is still named `sps` (the upstream tibble name); the tutorial and chapter slug use the program name "Seguro Popular" instead so the human-readable name lines up with the program being studied.
- **"Imagine":** You are a health-policy analyst at Mexico's Ministry of Health. The Minister is considering closing gaps in the current arrangements for covering uninsured households and has several questions on her desk: does public health insurance for the uninsured lower out-of-pocket spending? Reduce mortality? The strongest randomized evidence comes from a 2005--2006 evaluation in which the Ministry randomized the early-vs-late rollout of Seguro Popular (the universal-coverage program launched in 2003 and closed in 2020) so its first-year effects could be measured cleanly. The estimate from that twenty-year-old trial is an *imperfect* input for a present-day decision --- the policy implemented today is not exactly the policy tested then, and validity concerns about transporting it forward will matter as much as precision --- but it is the best randomized evidence on offer. There are many decisions to make. *(Note: do not write that "Seguro Popular randomized into communities"; the program is the program, and the Ministry used randomization as a tool of its evaluation.)*
- **Dataset:** `sps` (King et al. 2009 Seguro Popular randomized rollout, Mexico 2005–06)
- **Outcome:** `t2_health_exp_3m` — total health-related household expenditure in the 3 months before the follow-up survey (pesos; continuous)
- **Treatment:** `treatment` — binary; 1 = household in a cluster randomly assigned to Seguro Popular rollout, 0 = control cluster
- **Quantity of Interest (QoI):** What is the causal effect of Seguro Popular enrollment on household out-of-pocket health expenditures?
- **Model:** Linear regression, binary treatment (optionally one covariate for adjustment)
- **Causal / Predictive:** Causal
- **Student project:** `seguro-popular`
- **Data prep:** `sps |> select(treatment, t2_health_exp_3m, age, sex, education) |> drop_na()` → `x` *(use the full ~27.6K-row tibble; an `lm` fit on this is essentially instant)*
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(t2_health_exp_3m ~ treatment, data = x)` → `fit_sp`  *(add `age` or `sex` as a second covariate if the author wants to trigger the adjustment-clause practice at the two-or-more-covariates threshold)*
- **Preceptor Table:** Unit (Household) | Potential Outcomes (Expenditure if Enrolled, Expenditure if Not Enrolled) | Treatment (Enrollment)
- **Population Table:** Source | Unit/Time (Household, Year) | Potential Outcomes (Expenditure if Enrolled, Expenditure if Not Enrolled) | Treatment (Enrollment)
- **Authoring notes:**
  - Outcome scale is heavy-tailed (raw pesos). Plot the distribution in Wisdom EDA and note the skew. If misbehavior is severe, switch outcome to `t2_health_exp_1m`, log-transform, or trim outliers — record the decision in the Wisdom preamble's dataset note.
  - Assignment was cluster-randomized, not individual-randomized. Justice should name this under unconfoundedness (treatment assignment is independent of potential outcomes *at the cluster level*) without teaching clustered standard errors (too advanced for Easy).
  - Pairs thematically with **06-trains** (position 2) as the two simple RCTs in the Easy tier: different domain (health vs. immigration attitudes), same model class (linear with binary treatment), same Easy-tier apparatus.

---

