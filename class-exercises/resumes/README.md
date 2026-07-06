# Resumes

Bertrand and Mullainathan (2004) sent 4,870 fictitious resumes to help-wanted ads in Boston and Chicago newspapers, randomly assigning each resume an African-American-sounding or White-sounding name. This week you will use their data to help two different people:

- Imagine that you are a contemporary historian studying US employment in the year 2000 in Baltimore. You want to understand the process by which some people got jobs and some did not.

- Imagine that you work for a civil rights organization in Chicago. You want to understand the process by which black US citizens are discriminated against in hiring today.

This repo has everything you need for this week's class exercise:

- `resumes.qmd` — the exercise handout. Type your answers directly into this document.
- `resumes-answers.qmd` — the answer guideline.
- `data/resumes.csv` — the data.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo) to your computer, replacing `<your-username>`:

   ```bash
   git clone https://github.com/<your-username>/resumes.git
   ```

3. Open the `resumes` folder in RStudio or Positron.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "gt", "broom"))
```

## Work the exercise

Open `resumes.qmd` and type your answers into the blank space below each question. To render your document:

```bash
quarto render resumes.qmd
```

Commit and push your work to your fork as you go.
