> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 16 — Kenya  *(Position 12, Hard causal — causal forest — curriculum capstone)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **Renderings:** chapter planned · tutorial planned · class exercise —
- **"Imagine":** You are an advisor to Kenya's electoral commission ahead of the 2027 election. Your budget can fund one — maybe two — of six possible interventions to boost voter registration: SMS, local administrators, canvassing, or combinations. The right choice almost certainly varies by community: SMS probably works best where phone density is high; a local admin may matter more in isolated, low-poverty areas. You want a *policy rule*, not a single causal effect.
- **Dataset:** `kenya` (Harris et al., "Electoral Administration in Fledgling Democracies: Experimental Evidence from Kenya")
- **Outcome:** `reg_byrv13` — registered-voter count at polling location during intervention period divided by registered voters at that polling location in 2013 (continuous rate)
- **Treatment:** `treatment` — six-arm factor: `control`, `SMS`, `local`, `canvass`, `local + SMS`, `local + canvass`
- **Question (QoI):** Which intervention produces the largest causal increase in voter registration, and how does the best intervention vary with community characteristics (poverty, distance to polling station, population density)?
- **Model:** **Causal forest** via the `grf` package (`grf::multi_arm_causal_forest()` for the six-arm case). Parameter interpretation is skipped per §13.5 *Interpretability ceiling*; all answering happens via `marginaleffects::predictions()` / `comparisons()` on the forest's conditional-average-treatment-effect estimates, or via `grf`'s native prediction API.
- **Causal / Predictive:** Causal
- **Student project:** `kenya`
- **Data prep:** `kenya |> select(treatment, reg_byrv13, poverty, distance, pop_density, mean_age) |> drop_na()` → `x` *(polling-station-level, ~1,600 rows — no downsampling needed)*
- **Final model (sketch):** `fit_kenya <- grf::multi_arm_causal_forest(X = as.matrix(x |> select(poverty, distance, pop_density, mean_age)), Y = x$reg_byrv13, W = x$treatment, num.trees = 2000)`  *(confirm exact `grf` API when authoring; the package has moved around)*
- **Expensive fit:** Yes — causal forest with 2000 trees exceeds the setup-chunk time budget. Pre-fit via `inst/tutorials/16-kenya/data-raw/prefit.R`; setup loads from `inst/tutorials/16-kenya/data/fit_kenya.rds` per §5.6. Reducing `num.trees` to 500 is a fallback if the stored object is too large for the package.
- **Preceptor Table:** Unit (Polling Station) | Potential Outcomes (six columns: Reg Rate if Control, if SMS, if Local, if Canvass, if Local+SMS, if Local+Canvass) | Treatment (Intervention) | Covariates (Poverty, Distance, Density, Mean Age)
- **Population Table:** Source | Unit/Time (Polling Station, Year) | Potential Outcomes (six columns) | Treatment | Covariates
- **Authoring notes:**
  - **Setup cost.** `grf::multi_arm_causal_forest` with `num.trees = 2000` takes longer than the "few seconds" setup budget in §5.2. Fit once in setup with `#| cache: true` in the tutorial body; if still too slow, reduce `num.trees` for the tutorial (e.g. 500) and note the tradeoff in a knowledge drop. Do not fit the forest in the R Terminal interactively in an exercise — cache it.
  - **Fallback if `grf` is too heavy.** A lighter non-parametric path: fit a random-forest *predictive* model on `reg_byrv13 ~ treatment * (covariates)` with `ranger`, then use `marginaleffects` to extract arm-by-covariate conditional predictions and compute contrasts. Loses the formal causal-forest machinery but keeps the heterogeneous-effect story visible.
  - **Parameter-block handling.** Per §13.4 + §14.8: random forests have no interpretable parameter table, so Courage's three-fit interpretation block (Exercises 3–8) collapses to a single exercise whose only job is to make the student articulate *why* the forest does not have directly interpretable parameters. All answering happens downstream via `marginaleffects` on the forest's predictions in Temperance.
  - **Canonical-definition retention check.** Per §13 pre-flight rotation, this is the very last tutorial in the 12-example sequence, so Exercise 1 in each virtue section asks **all four** canonical definitions (Wisdom, Justice, Courage, Temperance) as a retention test. No preamble reminders — the exercises return in force.
  - **Intro-section pacing.** Per §13.1 Hard-tier rule, the Introduction is maximally short: canonical definitions of the virtues (per the rotation above), the state-the-question exercise (Ex 15), and the minimum operational setup (repo confirmation, library loading). Drop the Rubin-Causal-Model warm-up block (Ex 10–14); students at position 12 have done this six times before.
  - **Six potential outcomes per row.** The Preceptor and Population Tables get visually wide. Consider column-width adjustments via `gt::cols_width()`; the §10 styling conventions are otherwise unchanged.

---

