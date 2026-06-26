> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 07 — Colleges  *(Position 3, Easy predictive)*

- **Type:** example
- **Renderings:** chapter ✓ · tutorial ✓ · class exercise —
- **"Imagine":** You are a data scientist at a non-profit helping students find the best college.
- **Dataset:** `colleges` (`primer.data`), ~900 U.S. colleges/universities (DOE IPEDS 2013)
- **Outcome:** `grad_rate` — graduation rate (continuous, 0–1)
- **Treatment / Key covariate:** `tuition` (continuous)
- **Quantity of Interest (QoI):** What effect does the tuition of a college have on its graduation rate?
- **Model:** Linear regression with ordinal categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `colleges`
- **Data prep:** `colleges |> select(tuition, grad_rate, selectivity) |> filter(tuition > 2)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(grad_rate ~ tuition + selectivity, data = x)` → `fit_colleges`
- **Preceptor Table:** Unit (College) | Outcome (Graduation Rate) | Covariate (Tuition)
- **Population Table:** Source | Unit/Time (College, Year) | Outcome (Graduation Rate) | Covariate (Tuition)

---

