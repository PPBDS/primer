# problems.md

Key parameters for each tutorial in the `primer.tutorials` package. Used to orient new authoring sessions and to populate the spaced-repetition registry in CLAUDE.md §15.

Tutorials marked **miscellaneous** have no full data-science exercise (no Preceptor Table, no model fit). All others are **example** tutorials.

Preceptor Table and Population Table columns are listed by spanner in order. Population Tables always have a leading `Source` column (not under any spanner) and a `Unit/Time` spanner with two columns. Preceptor Tables have no Time column — time is implicit. Causal models have a `Treatment` spanner separate from `Covariate(s)`. Potential outcome columns are named "Outcome if [treatment value]".

---

## 011 — Probability

- **Type:** miscellaneous

---

## 021 — Sampling

- **Type:** miscellaneous

---

## 031 — Rubin Causal Model

- **Type:** miscellaneous

---

## 041 — Cardinal Virtues

- **Type:** miscellaneous

---

## 051 — Models

- **Type:** example
- **"Imagine":** You are the chair of the Democratic National Committee in early 2024 deciding where to devote time and money.
- **Dataset:** YouGov poll, 1,559 U.S. adult citizens, March 2024 (constructed inline as a tibble)
- **Outcome:** `biden` — binary support for Biden (Yes/No)
- **Treatment / Key covariate:** none (intercept-only model)
- **Question (QoI):** What proportion of all votes will be cast for Joe Biden in the 2024 election?
- **Model:** Logistic regression, intercept-only
- **Causal / Predictive:** Predictive
- **Student project:** `biden`
- **Data prep:** `tibble(biden = as.factor(c(rep("Yes", 655), rep("No", 904)))) |> slice_sample(prop = 1)` → `poll_data`
- **Final model:** `logistic_reg() |> fit(biden ~ 1, data = poll_data)` → `fit_biden`
- **Preceptor Table:** Unit (Voter) | Outcome (Biden Support)
- **Population Table:** Source | Unit/Time (Voter, Year) | Outcome (Biden Support)

---

## 061 — Two Parameters

- **Type:** example
- **"Imagine":** You are in charge of ordering uniforms for next year's Marine Corps bootcamp recruits.
- **Dataset:** NHANES (`primer.data`)
- **Outcome:** `height` (continuous, cm)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What is the average height of male and female USMC recruits?
- **Model:** Linear regression, one categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `height`
- **Data prep:** `nhanes |> filter(age >= 18 & age <= 27) |> select(height, sex) |> drop_na() |> slice_sample(n = 50)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(height ~ sex, data = x)` → `fit_height`
- **Preceptor Table:** Unit (Young Adult) | Outcome (Height cm) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Young Adult, Year) | Outcome (Height cm) | Covariate (Sex)

---

## 071 — Three Parameters: Causal

- **Type:** example
- **"Imagine":** You are a campaign manager for a Republican congressional candidate in Georgia who wants to increase anti-immigration sentiment among voters.
- **Dataset:** `trains` (Enos 2014), Boston commuters, 2012 (`primer.data`)
- **Outcome:** `att_end` — immigration attitude after experiment (integer, 3–15)
- **Treatment / Key covariate:** `treatment` — exposure to Spanish-speakers on train platform (randomized)
- **Question (QoI):** What is the average causal effect of exposure to Spanish-speakers on attitudes toward immigration?
- **Model:** Linear regression, randomized experiment
- **Causal / Predictive:** Causal
- **Student project:** `immigration`
- **Data prep:** none — uses `trains` directly
- **Final model:** `linear_reg(engine = "lm") |> fit(att_end ~ treatment, data = trains)` → `fit_att`
- **Preceptor Table:** Unit (Person) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)
- **Population Table:** Source | Unit/Time (Person, Year) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)

---

## 081 — Mechanics

- **Type:** miscellaneous

---

## 091 — Four Parameters: Categorical

- **Type:** example
- **"Imagine":** You are a political scientist studying the 1992 presidential election, curious whether men and women differed in their support for Clinton, Bush, and Perot. There are many decisions to make.
- **Dataset:** NES (`primer.data`), 1992 presidential election
- **Outcome:** `pres_vote` — vote choice (Clinton / Bush / Perot)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What was the difference in voting preference of men and women in the 1992 US Presidential election?
- **Model:** Multinomial logistic regression
- **Causal / Predictive:** Predictive
- **Student project:** `election-1992`
- **Data prep:** `nes |> filter(year == 1992) |> select(sex, pres_vote) |> drop_na() |> mutate(pres_vote = as.factor(case_when(pres_vote == "Democrat" ~ "Clinton", pres_vote == "Republican" ~ "Bush", pres_vote == "Third Party" ~ "Perot")))` → `nes_92`
- **Final model:** `multinom_reg(engine = "nnet") |> fit(pres_vote ~ sex, data = nes_92)` → `fit_nes`
- **Preceptor Table:** Unit (Voter) | Outcome (Vote) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Outcome (Vote) | Covariate (Sex)

---

## 101 — Five Parameters

- **Type:** example
- **"Imagine":** You are considering a run for governor and wonder how long you are likely to live afterward.
- **Dataset:** `governors` (Barfort et al. 2020) (`primer.data`)
- **Outcome:** `lived_after` — years lived after election (continuous)
- **Treatment / Key covariate:** `election_age`, `sex` (with interaction)
- **Question (QoI):** How many years do gubernatorial candidates live after their election, and how does that vary by age and sex?
- **Model:** Linear regression with interaction term (`election_age * sex`)
- **Causal / Predictive:** Predictive
- **Student project:** `life-expectancy`
- **Data prep:** `governors |> filter(year > 1945) |> select(last_name, year, state, sex, lived_after, election_age, region)` → `x`
- **Final model:** `linear_reg(engine = "lm") |> fit(lived_after ~ election_age*sex, data = x)` → `fit_years`
- **Preceptor Table:** Unit (Candidate) | Outcome (Years Lived After) | Covariates (Age at Election, Sex)
- **Population Table:** Source | Unit/Time (Candidate, Year) | Outcome (Years Lived After) | Covariates (Age at Election, Sex)

---

## 111 — N Parameters

- **Type:** example
- **"Imagine":** You are running for Governor of Texas and must decide how to allocate campaign resources.
- **Dataset:** `shaming` (Gerber, Green, Larimer 2008) (`primer.data`)
- **Outcome:** `primary_06` — voted in 2006 primary (binary)
- **Treatment / Key covariate:** `treatment` — social-pressure mailing type (randomized)
- **Question (QoI):** What is the causal effect of social-pressure postcards on voter turnout?
- **Model:** Logistic regression with interaction (`treatment * voter_class`)
- **Causal / Predictive:** Causal
- **Student project:** `postcards`
- **Data prep:** `shaming |> mutate(civ_engage = primary_00 + primary_02 + primary_04 + general_00 + general_02 + general_04) |> select(primary_06, treatment, sex, age, civ_engage) |> mutate(voter_class = factor(case_when(civ_engage %in% c(5, 6) ~ "Always Vote", civ_engage %in% c(3, 4) ~ "Sometimes Vote", civ_engage %in% c(1, 2) ~ "Rarely Vote"), levels = c("Rarely Vote", "Sometimes Vote", "Always Vote"))) |> mutate(voted = as.factor(primary_06))` → `x`
- **Final model:** `logistic_reg(engine = "glm") |> fit(voted ~ age + sex + treatment*voter_class, data = x)` → `fit_vote`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Voted if Postcard, Voted if No Postcard) | Treatment (Mailing Type)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (Voted if Postcard, Voted if No Postcard) | Treatment (Mailing Type)

---

## 121 — Cumulative

- **Type:** example
- **"Imagine":** You are a pollster preparing for an upcoming election, exploring 2020 Trump approval patterns across ideology and education levels.
- **Dataset:** `ces` (Cooperative Election Study) (`primer.data`), 2020
- **Outcome:** `approval` — presidential approval (ordinal, 5 categories)
- **Treatment / Key covariate:** `ideology` (Very Liberal … Very Conservative)
- **Question (QoI):** What is the average difference in Trump approval between Very Liberal and Very Conservative voters?
- **Model:** Ordinal logistic regression (`MASS::polr`)
- **Causal / Predictive:** Predictive
- **Student project:** `approval`
- **Data prep:** `ces |> filter(year == 2020) |> select(approval, ideology, education) |> drop_na() |> filter(!ideology %in% "Not Sure") |> mutate(ideology = fct_drop(ideology))` → `x`
- **Final model:** `polr(approval ~ ideology + education, data = x)` → `fit_approval`
- **Preceptor Table:** Unit (Respondent) | Outcome (Presidential Approval) | Covariate (Political Ideology)
- **Population Table:** Source | Unit/Time (Respondent, Year) | Outcome (Presidential Approval) | Covariate (Political Ideology)

---

## 131 — Ordered Factors

- **Type:** example
- **"Imagine":** You are a data scientist at a non-profit helping students find the best college.
- **Dataset:** `colleges` (`primer.data`), ~900 U.S. colleges/universities (DOE IPEDS 2013)
- **Outcome:** `grad_rate` — graduation rate (continuous, 0–1)
- **Treatment / Key covariate:** `tuition` (continuous)
- **Question (QoI):** What effect does the tuition of a college have on its graduation rate?
- **Model:** Linear regression with ordinal categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `ordered`
- **Data prep:** `colleges |> select(tuition, grad_rate, selectivity) |> filter(tuition > 2)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(grad_rate ~ tuition + selectivity, data = x)` → `fit_colleges`
- **Preceptor Table:** Unit (College) | Outcome (Graduation Rate) | Covariate (Tuition)
- **Population Table:** Source | Unit/Time (College, Year) | Outcome (Graduation Rate) | Covariate (Tuition)

---

## 141 — Stops

- **Type:** example
- **"Imagine":** You are a member of your city's police department who wants to ensure race doesn't unfairly affect arrest chances during traffic stops.
- **Dataset:** `stops` (Open Policing Project) (`primer.data`), New Orleans, July 2011–July 2018
- **Outcome:** `arrested` — arrest during stop (binary)
- **Treatment / Key covariate:** `race` (Black/White), `sex`, `zone`
- **Question (QoI):** What is the difference in arrest rate between Black and White drivers, adjusting for sex and zone?
- **Model:** Linear regression (`arrested ~ sex + race*zone`); logistic regression also demonstrated
- **Causal / Predictive:** Predictive
- **Student project:** `stops`
- **Data prep:** `stops |> filter(race %in% c("black", "white")) |> mutate(race = str_to_title(race), sex = str_to_title(sex))` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(arrested ~ sex + race*zone, data = x)` → `fit_stops`
- **Preceptor Table:** Unit (Traffic Stop) | Outcome (Arrested) | Covariates (Race, Sex, Zone)
- **Population Table:** Source | Unit/Time (Traffic Stop, Year) | Outcome (Arrested) | Covariates (Race, Sex, Zone)
