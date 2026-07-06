> Seed spec — a **standalone class-exercise problem** (unnumbered; not part of the 16-slot curriculum). To author, read [`../../class-exercises/CLAUDE.md`](../../class-exercises/CLAUDE.md) and this file. Source material: `bootcamp/_internal/week-6/`.

### Class Size  *(standalone · Medium · two scenarios: one predictive, one causal)*

- **Type:** example (class exercise only)
- **Renderings:** chapter — · tutorial — · class exercise ✓ (`class-exercises/class-size/`)
- **"Imagine" (two, given to students verbatim; groups are assigned one):**
  1. *Predictive:* "Imagine that you are an elementary school principal in Chicago. You want to predict student performance. Fortunately, you have data today for your current students like the data available in the STAR project."
  2. *Causal:* "Imagine you work for the Texas Department of Education. You want to understand student performance in small classes, relative to big classes, in Dallas. In Texas, there is data available like the data in the STAR project."
- **Preceptor's Questions (one per scenario):**
  1. *Principal:* What will be the average fourth-grade math score of the students in my school next year, given their class type and background?
  2. *Texas DOE:* What is the average causal effect of assigning a Dallas student to a small class, rather than a regular class, on their fourth-grade math score?
- **Dataset:** `data/class-size.csv` — 6,325 students from the Tennessee STAR experiment (Mosteller 1995; data cleaned and discussed in Imai, *Quantitative Social Science*). Students were randomly assigned to small (13–17), regular (22–25), or regular-with-aide classes in grades K–3. Columns: `race`, `classtype` (1/2/3), `yearssmall` (0–4 years spent in small classes), `hsgrad`, `g4math`, `g4reading`. **3,930 of 6,325 students (62%) are missing `g4math`** — balanced across class types (61.1–63.6%) but a first-order data-quality discussion.
- **Underlying paper:** Mosteller (1995), "The Tennessee study of class size in the early school grades," *The Future of Children* 5(2). **PDF not yet in the folder** — not in `primer.data::inst/papers/` or the bootcamp repo; David to supply.
- **Outcome:** `g4math` — fourth-grade standardized math score (continuous; mean ≈ 709, sd ≈ 43)
- **Treatment (causal scenario):** class-type assignment (small / regular / regular with aid), randomized in the original experiment. Three levels → three potential outcomes.
- **Covariates:** `race` (recoded White/Black/Others), `yearssmall` (dose: years spent in small classes)
- **Causal / Predictive:** both — one scenario each; the same data and the same fitted model serve both.
- **Data prep (in the setup chunk of both files — students receive it, don't write it):** read CSV → recode `classtype` 1/2/3 to `kind` (small / regular / regular with aid) → recode `race` 1=White, 2=Black, 3–6=Others → `select(g4math, kind, race, yearssmall)` → object `star`.
- **Candidate models (Courage):** `g4math ~ kind` → `fit_kind` (nothing distinguishable); `g4math ~ kind + race` → `fit_kind_race` (race matters, kind still nothing); `+ yearssmall` → `fit_kind_race_years`.
- **Final model:** `linear_reg() |> fit(g4math ~ kind + race + yearssmall, data = star)` → `fit_classsize`. Equation: `695 − 1.95·regular_with_aid − 7.66·small + 38.7·Others + 16.2·White + 2.18·yearssmall`.
- **Headline numbers:** average predicted scores by kind 710 / 708 / 709 (heavily overlapping CIs); `avg_comparisons` small − regular −7.66 [−15.9, 0.6] (includes zero); **`yearssmall` +2.18 [0.10, 4.27] per year** — the dose, not the snapshot assignment, is where the signal is. This near-null teaching story is the point: a famous experiment whose headline effect is invisible in this simple cut.
- **Preceptor Table (principal, predictive):** Unit (Student) | Outcome (Math Score) | Covariates (Class Type, Race)
- **Preceptor Table (Texas DOE, causal):** Unit (Student) | Potential Outcomes (Score if Small, Score if Regular, Score if Regular with Aide — three levels, two hatched per row) | Treatment (Class Assignment)
- **Population Tables:** same columns plus Source and Unit/Time (Student, Year). Data rows: Tennessee, 1985. Preceptor rows: Chicago 2027 (principal) or Dallas 2026 (Texas DOE).
- **Assumption hooks:** validity — different math tests and different definitions of "small" in Chicago/Dallas today vs Tennessee 1985. Stability — home lives, curricula, and teaching have changed since the 1980s. Representativeness — 1980s Tennessee volunteer schools are not a draw from today's Chicago or Dallas. Unconfoundedness — randomized by design, but was randomization executed cleanly (administrators wanting their own kids in small classes)? Missing-outcome data (62%) threatens everything if missingness is not random.
