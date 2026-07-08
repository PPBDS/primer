> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 12 — Mail  *(Position 8, Medium causal)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **Renderings:** chapter ✓ (`book/12-mail.qmd`, built 2026-07-08) · tutorial ✓ (`primer.tutorials/inst/tutorials/12-mail/`, built 2026-07-08) · class exercise —
- **"Imagine":** You are on the Philadelphia City Commissioners' office ahead of the next general election. You have a fixed postcard-printing budget and want to know which nudge message — "safer for you" or "safer for your neighborhood" — actually moves people to apply for a mail ballot.
- **Dataset:** `mail` (2020 Philadelphia mail-in voting field experiment; Morris et al.)
- **Outcome:** `applied_mail` — binary; whether the voter applied for a mail ballot before the 26-May deadline
- **Treatment:** `treatment` — three-arm factor: `No Postcard`, `Self`, `Neighborhood`
- **Quantity of Interest (QoI):** What is the causal effect of each postcard wording on the probability a registered voter applies for a mail ballot?
- **Model:** Logistic regression with multi-arm treatment; interpretation via `marginaleffects::avg_comparisons()` back to the probability scale (Medium-tier adds `comparisons()` per §13.5)
- **Causal / Predictive:** Causal
- **Student project:** `mail`
- **Data prep:** `mail |> select(treatment, applied_mail, party, age, sex) |> drop_na() |> mutate(applied_mail = as.factor(applied_mail), treatment = fct_relevel(treatment, "No Postcard"))` → `x`. The `fct_relevel` makes the control group the reference level (alphabetical default is Neighborhood). `drop_na()` removes ~239K voters missing `sex`, leaving 696,638 rows — named as a representativeness concern in Justice. **Speed resolved (2026-07-08):** the glm fits the full 697K rows in ~1.4s, so it fits live in setup; no `.rds`, no slice. Note `age` is *categorical* (bands 18-29 … 65-121), not numeric.
- **Final model:** `logistic_reg(engine = "glm") |> fit(applied_mail ~ treatment + party + age + sex, data = x)` → `fit_mail`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Applied if No Postcard, Applied if Self, Applied if Neighborhood) | Treatment (Postcard) | Covariates (Party, Age, Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (three columns, one per treatment arm) | Treatment (Postcard) | Covariates (Party, Age, Sex)
- **Authoring notes:**
  - **Key numbers (2026-07-08 build):** arms No Postcard 661,672 / Self 17,435 / Neighborhood 17,531 after cleaning; application rates 16.8% control vs 17.2% in each arm. Final-model treatment coefficients: Neighborhood +0.035 [−0.006, 0.076], Self +0.030 [−0.011, 0.071] (log-odds vs control). `avg_comparisons`: Neighborhood +0.48pp [−0.08, +1.03], Self +0.41pp [−0.15, +0.96] — precisely-estimated near-null effects; both CIs cross zero. The pedagogical arc is the contrast with Shaming's large social-pressure effects, plus "precision ≠ big effect."
  - **Rotation (position 8):** Justice and Temperance definitions asked; Wisdom and Courage definitions appear as preamble reminders. Causal-definition alternation: Shaming used "Define a causal effect," so Mail uses the fundamental problem of causal inference (with a three-potential-outcomes twist).
  - **Stratified sampling.** Down-sampling from 936K to ~5K must preserve treatment-arm balance. Use `slice_sample(n = ...)` within `group_by(treatment)` or similar — flag in Wisdom's data-prep exercise so the student sees the reason.
  - **Three potential outcomes per row.** The Preceptor Table stretches to three columns under the `Potential Outcomes` spanner. This is the first tutorial in the curriculum where the Rubin-Causal-Model apparatus scales past two potential outcomes, and the Justice section's per-row causal-effect footnote (Easy-only, so absent here by §10 Medium/Hard rules) is already retired at Medium anyway — no conflict.
  - **Link-scale interpretation.** Per §13.5 *Interpretability ceiling*, do not ask students to interpret logistic coefficients on the log-odds scale. Author notes the log-odds form in a knowledge drop; student interpretation exercises target `avg_comparisons()` output on the probability scale.
  - **Pairing with Shaming (position 6).** Both tutorials use multi-arm postcard / mailing treatments in GOTV experiments. The Wisdom section should make the contrast explicit — shaming's postcards apply social pressure, mail's postcards are informational. Same structural apparatus, different behavioral mechanism.

---

