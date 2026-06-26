> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 05 — Recruits  *(Position 1, Easy predictive)*

- **Type:** example
- **Renderings:** chapter ✓ · tutorial ✓ · class exercise —
- **"Imagine":** You are in charge of ordering uniforms for next year's Marine Corps bootcamp recruits.
- **Dataset:** `recruits` (`primer.tutorials`) — a 50-row teaching cut of NHANES, 40 male and 10 female young adults aged 18–27, columns `height`, `sex`, `age`. Built by `data-raw/recruits.R`; documented in `R/recruits.R`. The 40/10 split is deliberate so the two group means have visibly different standard errors — a feature the Temperance section asks students to notice and explain.
- **Outcome:** `height` (continuous, cm)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What is the average height of male and female USMC recruits?
- **Model:** Linear regression, one categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `recruits`
- **Data prep:** none in the tutorial — the `recruits` tibble is already filtered and sliced. Setup chunk uses `recruits` directly (no intermediate `x`).
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(height ~ sex, data = recruits)` → `fit_recruits`
- **Preceptor Table:** Unit (Young Adult) | Outcome (Height cm) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Young Adult, Year) | Outcome (Height cm) | Covariate (Sex)
- **Paired question (chapter only):** What is the average causal effect of sex on a recruit's height? The implied manipulation is biologically absurd --- you cannot toggle a recruit's sex --- so the chapter explicitly names the absurdity and uses it to make the predictive/causal distinction visible (per §1.2's *paired-question-required-even-when-absurd* rule).
- **Paired Preceptor Table (chapter only):** Unit (Young Adult) | Potential Outcomes (Height if Female, Height if Male) | Treatment (Sex). The two potential-outcome columns are filled with truth, with the unobservable counterfactual rendered with diagonal hatching (same convention as any causal Preceptor Table).
- **QoI-variety candidates (chapter Temperance):** the average is one question; a campaign-quality answer for the Quartermaster also wants (a) the *maximum* (the tallest recruit you need to fit), (b) the 10th and 90th *percentiles* (how many extra-small and extra-large uniforms to order), and (c) the *distribution of a sample statistic* (e.g. the height of the tallest recruit out of a specific batch of three) which requires simulation from the DGM. The chapter sketches how to get each from the same fitted DGM; the simulation step gets a paragraph but not full mechanics.

---

