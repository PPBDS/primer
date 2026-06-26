> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 10 — Shaming  *(Position 6, Medium causal)*

- **Type:** example
- **Renderings:** chapter ✓ · tutorial ✓ · class exercise —
- **"Imagine":** You are running for Governor of Texas and must decide how to allocate campaign resources.
- **Dataset:** `shaming` (Gerber, Green, Larimer 2008) (`primer.data`)
- **Outcome:** `primary_06` — voted in 2006 primary (binary)
- **Treatment / Key covariate:** `treatment` — social-pressure mailing type (randomized)
- **Quantity of Interest (QoI):** What is the causal effect of social-pressure postcards on voter turnout?
- **Model:** Logistic regression with interaction (`treatment * voter_class`)
- **Causal / Predictive:** Causal
- **Student project:** `shaming`
- **Data prep:** `shaming |> mutate(civ_engage = primary_00 + primary_02 + primary_04 + general_00 + general_02 + general_04) |> select(primary_06, treatment, sex, age, civ_engage) |> mutate(voter_class = factor(case_when(civ_engage %in% c(5, 6) ~ "Always Vote", civ_engage %in% c(3, 4) ~ "Sometimes Vote", civ_engage %in% c(1, 2) ~ "Rarely Vote"), levels = c("Rarely Vote", "Sometimes Vote", "Always Vote"))) |> mutate(voted = as.factor(primary_06))` → `x`
- **Final model:** `logistic_reg(engine = "glm") |> fit(voted ~ age + sex + treatment*voter_class, data = x)` → `fit_shaming`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Voted if No Postcard, Voted if Civic Duty, Voted if Hawthorne, Voted if Self, Voted if Neighbors) | Treatment (Mailing Type) | Covariate (Voter Class)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (five columns, one per treatment arm) | Treatment (Mailing Type) | Covariates (Voter Class, Age, Sex)
- **Authoring notes:**
  - **Five potential-outcome columns.** Faithful to Gerber-Green-Larimer 2008's five-arm design (No Postcard / Civic Duty / Hawthorne / Self / Neighbors). The Preceptor Table is wide; the §10 inline-block-div pattern handles it. Each row has one observed potential outcome and four hatched (unobservable) ones.
  - **Full-data fit (~344K rows) takes ~1 second.** Below the §5.6 prefit threshold; fit lives in setup chunk. CIs are tight — Neighbors gives +8.1 pp turnout (CI 7.6 to 8.6), Self +4.8 pp, Hawthorne +2.5 pp, Civic Duty +1.8 pp.
  - **Interaction with `voter_class`.** Heterogeneous treatment effects are the substantive payoff: Neighbors gives +9.0 pp among Always Vote and +8.6 pp among Sometimes Vote, but only +4.4 pp among Rarely Vote. The Temperance section uses `plot_predictions(condition = c("treatment", "voter_class"))` to make this visible.
  - **Pairs thematically with Mail (position 8)** as the two multi-arm GOTV experiments at Medium causal. Same dataset family (postcards before an election), different treatment compositions.

---

