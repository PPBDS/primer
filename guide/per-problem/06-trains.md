> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 06 — Trains  *(Position 2, Easy causal)*

- **Type:** example
- **Renderings:** chapter ✓ · tutorial ✓ · class exercise —
- **"Imagine":** You are a campaign manager for a Republican congressional candidate in Georgia who wants to increase anti-immigration sentiment among voters.
- **Dataset:** `trains` (Enos 2014), Boston commuters, 2012 (`primer.data`)
- **Outcome:** `att_end` — immigration attitude after experiment (integer, 3–15)
- **Treatment / Key covariate:** `treatment` — exposure to Spanish-speakers on train platform (randomized)
- **Quantity of Interest (QoI):** What is the average causal effect of exposure to Spanish-speakers on attitudes toward immigration?
- **Model:** Linear regression, randomized experiment
- **Causal / Predictive:** Causal
- **Student project:** `trains`
- **Data prep:** none — uses `trains` directly
- **Final model:** `linear_reg(engine = "lm") |> fit(att_end ~ treatment, data = trains)` → `fit_att`
- **Preceptor Table:** Unit (Person) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)
- **Population Table:** Source | Unit/Time (Person, Year) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)

---

