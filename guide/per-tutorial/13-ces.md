> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 13 — CES  *(Position 9, Hard predictive)*

- **Type:** example
- **"Imagine":** You are a pollster preparing for an upcoming election, exploring 2020 Trump approval patterns across ideology and education levels.
- **Dataset:** `ces` (Cooperative Election Study) (`primer.data`), 2020
- **Outcome:** `approval` — presidential approval (ordinal, 5 categories)
- **Treatment / Key covariate:** `ideology` (Very Liberal … Very Conservative)
- **Question (QoI):** What is the average difference in Trump approval between Very Liberal and Very Conservative voters?
- **Model:** Ordinal logistic regression (`MASS::polr`)
- **Causal / Predictive:** Predictive
- **Student project:** `ces`
- **Data prep:** `ces |> filter(year == 2020) |> select(approval, ideology, education) |> drop_na() |> filter(!ideology %in% "Not Sure") |> mutate(ideology = fct_drop(ideology))` → `x`
- **Final model:** `polr(approval ~ ideology + education, data = x)` → `fit_approval`
- **Preceptor Table:** Unit (Respondent) | Outcome (Presidential Approval) | Covariate (Political Ideology)
- **Population Table:** Source | Unit/Time (Respondent, Year) | Outcome (Presidential Approval) | Covariate (Political Ideology)

---

