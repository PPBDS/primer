> Seed spec — a **standalone class-exercise problem** (unnumbered; not part of the 16-slot curriculum). To author, read the [CLAUDE.md in PPBDS/primer.exercises](https://github.com/PPBDS/primer.exercises/blob/main/CLAUDE.md) (sibling checkout: `../primer.exercises/`) and this file. Source material: `bootcamp/_internal/week-5/`.

### Resumes  *(standalone · Medium · two scenarios: one predictive, one causal)*

- **Type:** example (class exercise only)
- **Renderings:** chapter — · tutorial — · class exercise ✓ (`primer.exercises` repo, `resumes/`)
- **"Imagine" (two, given to students verbatim; groups are assigned one):**
  1. *Predictive:* "Imagine that you are a contemporary historian studying US employment in the year 2000 in Baltimore. You want to understand the process by which some people got jobs and some did not."
  2. *Causal:* "Imagine that you work for a civil rights organization in Chicago. You want to understand the process by which black US citizens are discriminated against in hiring today."
- **Preceptor's Questions (one per scenario):**
  1. *Historian:* What proportion of job applicants in Baltimore in the year 2000 received callbacks, and how did that proportion differ by the applicant's race and sex?
  2. *Civil rights organization:* What is the average causal effect of having a black-sounding name, rather than a white-sounding name, on the probability that a job applicant in Chicago today receives a callback?
- **Dataset:** `data/resumes.csv` — 4,870 fictitious resumes from Bertrand & Mullainathan (2004), "Are Emily and Greg More Employable Than Lakisha and Jamal?", *AER* 94(4); data cleaned and discussed in Imai, *Quantitative Social Science*. Columns: `name`, `sex` (female/male), `ethnicity` (afam/cauc — the race the name signals), `quality` (low/high), `call` (no/yes), `city` (boston/chicago), `jobs`, `experience`, `honors`, `holes`, `special`. Key margins: overall callback rate 8.05%; afam 6.45% vs cauc 9.65%; boston 9.7% vs chicago 6.7%.
- **Outcome:** `call` (binary: did the resume receive a callback?)
- **Treatment (causal scenario):** the racial connotation of the name on the resume (black-sounding vs white-sounding), randomly assigned by the experimenters. In the predictive scenario the same variable is just a covariate.
- **Covariates:** `sex`, `city`, `quality`, `special` (and the rest of the resume characteristics as candidates)
- **Causal / Predictive:** both — one scenario each; the same data and the same fitted model serve both.
- **Data prep:** `resumes <- read_csv("data/resumes.csv") |> mutate(call = as.factor(call))` — `call` must be a factor for `logistic_reg()`.
- **Candidate models (Courage):** `call ~ city` → `fit_city`; `call ~ city + ethnicity` → `fit_city_ethnicity`; `call ~ city + ethnicity + quality + ethnicity*quality` → `fit_quality` (interaction CI includes zero — motivates dropping quality).
- **Final model:** `logistic_reg() |> fit(call ~ sex + city + ethnicity + special, data = resumes)` → `fit_resumes`. Fitted equation: `logit(Pr(call = yes)) = −2.75 − 0.13·male − 0.46·chicago + 0.45·caucasian + 0.82·special`.
- **Headline QoI numbers:** average callback probability afam 6.45% [5.48, 7.42] vs cauc 9.65% [8.49, 10.81]; difference (cauc − afam) +3.21pp [1.70, 4.73] — roughly 50% more callbacks for white-sounding names.
- **Preceptor Table (historian, predictive):** Unit (Applicant) | Outcome (Callback) | Covariates (Race, Sex)
- **Preceptor Table (civil rights, causal):** Unit (Applicant) | Potential Outcomes (Callback if Black Name, Callback if White Name) | Treatment (Name on Resume)
- **Population Tables:** same columns plus Source and Unit/Time (Applicant, Year). Data rows: fictitious resumes, Boston/Chicago, 2001. Preceptor rows: Baltimore 2000 (historian) or Chicago 2026 (civil rights).
- **Assumption hooks:** validity — name-signaled race (data) vs actual race (historian) and the weakening link between names and race since 2001; "callback" via newspaper-ad phone response vs online-portal screening today. Stability — discrimination levels may have changed since 2001. Representativeness — made-up resumes answering newspaper help-wanted ads for entry-level jobs in two cities are not a sample of any real applicant population. Unconfoundedness — names were randomly assigned, so it should hold for the causal scenario; the honest worry is whether randomization was executed cleanly.
- **Quality-heterogeneity hook (Temperance discussion):** high quality raises callbacks +2.3pp for white-sounding names but only +0.5pp for black-sounding names (the paper's second headline), though the interaction's CI includes zero in this simple model.
