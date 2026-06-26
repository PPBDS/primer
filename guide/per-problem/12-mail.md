> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 12 — Mail  *(Position 8, Medium causal)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **Renderings:** chapter planned · tutorial planned · class exercise —
- **"Imagine":** You are on the Philadelphia City Commissioners' office ahead of the next general election. You have a fixed postcard-printing budget and want to know which nudge message — "safer for you" or "safer for your neighborhood" — actually moves people to apply for a mail ballot.
- **Dataset:** `mail` (2020 Philadelphia mail-in voting field experiment; Morris et al.)
- **Outcome:** `applied_mail` — binary; whether the voter applied for a mail ballot before the 26-May deadline
- **Treatment:** `treatment` — three-arm factor: `No Postcard`, `Self`, `Neighborhood`
- **Question (QoI):** What is the causal effect of each postcard wording on the probability a registered voter applies for a mail ballot?
- **Model:** Logistic regression with multi-arm treatment; interpretation via `marginaleffects::avg_comparisons()` back to the probability scale (Medium-tier adds `comparisons()` per §13.5)
- **Causal / Predictive:** Causal
- **Student project:** `mail`
- **Data prep:** `mail |> select(treatment, applied_mail, party, age, sex) |> drop_na() |> mutate(applied_mail = as.factor(applied_mail))` → `x` *(full ~936K-row tibble; per §1.2 use-all-the-data, this dataset is large enough that a `glm` fit may be slow --- flag to the author for discussion before authoring this chapter and decide whether the size warrants pre-fitting via `.rds`, a different sub-design, or some other resolution. Do not silently slice.)*
- **Final model:** `logistic_reg(engine = "glm") |> fit(applied_mail ~ treatment + party + age + sex, data = x)` → `fit_mail`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Applied if No Postcard, Applied if Self, Applied if Neighborhood) | Treatment (Postcard) | Covariates (Party, Age, Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (three columns, one per treatment arm) | Treatment (Postcard) | Covariates (Party, Age, Sex)
- **Authoring notes:**
  - **Stratified sampling.** Down-sampling from 936K to ~5K must preserve treatment-arm balance. Use `slice_sample(n = ...)` within `group_by(treatment)` or similar — flag in Wisdom's data-prep exercise so the student sees the reason.
  - **Three potential outcomes per row.** The Preceptor Table stretches to three columns under the `Potential Outcomes` spanner. This is the first tutorial in the curriculum where the Rubin-Causal-Model apparatus scales past two potential outcomes, and the Justice section's per-row causal-effect footnote (Easy-only, so absent here by §10 Medium/Hard rules) is already retired at Medium anyway — no conflict.
  - **Link-scale interpretation.** Per §13.5 *Interpretability ceiling*, do not ask students to interpret logistic coefficients on the log-odds scale. Author notes the log-odds form in a knowledge drop; student interpretation exercises target `avg_comparisons()` output on the probability scale.
  - **Pairing with Shaming (position 6).** Both tutorials use multi-arm postcard / mailing treatments in GOTV experiments. The Wisdom section should make the contrast explicit — shaming's postcards apply social pressure, mail's postcards are informational. Same structural apparatus, different behavioral mechanism.

---

