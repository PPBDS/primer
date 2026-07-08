> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 11 — NES  *(Position 7, Medium predictive)*

- **Type:** example
- **Renderings:** chapter ✓ (`book/11-nes.qmd`, built 2026-07-08) · tutorial ✓ (`primer.tutorials/inst/tutorials/11-nes/`, built 2026-07-08) · class exercise —
- **"Imagine":** You are a political scientist studying the 1992 presidential election, curious whether men and women differed in their support for Clinton, Bush, and Perot. There are many decisions to make.
- **Dataset:** NES (`primer.data`), 1992 presidential election
- **Outcome:** `pres_vote` — vote choice (Clinton / Bush / Perot)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Quantity of Interest (QoI):** What was the difference in voting preference of men and women in the 1992 US Presidential election?
- **Model:** Multinomial logistic regression
- **Causal / Predictive:** Predictive
- **Student project:** `nes`
- **Data prep:** `nes |> filter(year == 1992) |> select(sex, pres_vote) |> drop_na() |> mutate(pres_vote = as.factor(case_when(pres_vote == "Democrat" ~ "Clinton", pres_vote == "Republican" ~ "Bush", pres_vote == "Third Party" ~ "Perot")))` → `nes_92`
- **Final model:** `multinom_reg(engine = "nnet") |> fit(pres_vote ~ sex, data = nes_92)` → `fit_nes`
- **Preceptor Table:** Unit (Voter) | Outcome (Vote) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Outcome (Vote) | Covariate (Sex)
- **Authoring notes (from the 2026-07-08 tutorial build):**
  - **Specific question (Intro Ex 15):** "What is the difference in the probability of voting for Perot between men and women in the 1992 presidential election?" — the multinomial Ex 15 template requires picking one category; Perot is the one with the sharp, significant gap.
  - **Key numbers:** 1,658 voters (Clinton 793 / Bush 564 / Perot 301). Predicted: women 52.5/33.3/14.2%, men 42.5/34.8/22.6% (Clinton/Bush/Perot). `avg_comparisons` (Male − Female): Perot +8.4pp [4.7, 12.2]; Clinton −10.0pp [−14.7, −5.2]; Bush +1.5pp [−3.0, 6.1]. Reference outcome level is Bush (alphabetical).
  - **`check_predictions()` does not support `nnet::multinom`** (no `simulate()` method). The Medium model-check is adapted: the student computes observed vote shares by sex and the knowledge drop notes that this saturated model reproduces them exactly.
  - **`plot_predictions()` is unreliable for `nnet` fits** (the documented §13.5 multinomial caveat): Temperance builds the final plot manually from `predictions(...) |> as_tibble()`.
  - **Rotation (position 7):** Wisdom and Courage definitions asked; Justice and Temperance definitions appear as preamble reminders.

---

