# Resumes

Bertrand and Mullainathan (2004) sent 4,870 fictitious resumes to help-wanted ads in Boston and Chicago newspapers, randomly assigning each resume an African-American-sounding or White-sounding name. This week you will use their data to help two different people:

- Imagine that you are a contemporary historian studying US employment in the year 2000 in Baltimore. You want to understand the process by which some people got jobs and some did not.

- Imagine that you work for a civil rights organization in Chicago. You want to understand the process by which black US citizens are discriminated against in hiring today.

This repo has everything you need for this week's class exercise:

- `resumes-wisdom.qmd` — day 1: Wisdom and Justice. Type your answers directly into the document.
- `resumes-courage.qmd` — day 2: Courage. Begins with our answers to Wisdom and Justice.
- `resumes-temperance.qmd` — day 3: Temperance. Begins with our answers to Wisdom, Justice, and Courage.
- `resumes-answers.qmd` — the answer guideline.
- `data/resumes.csv` — the data.
- `resumes-paper.pdf` — the original Bertrand and Mullainathan (2004) paper.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo) to your computer, replacing `<your-username>`:

   ```bash
   git clone https://github.com/<your-username>/resumes.git
   ```

3. Open the `resumes` folder in your IDE. Most of our students use VS Code.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "broom", "gt"))
```

## Work the exercise

Each class meeting has its own document. Work them in order: `resumes-wisdom.qmd`, then `resumes-courage.qmd`, then `resumes-temperance.qmd`. Every document starts with the same background and data loading, and each later document begins with our answers to everything that came before — so you always work from correct foundations.

Type your answers into the blank space below each question, then render:

```bash
quarto render resumes-wisdom.qmd
```

Commit and push your work to your fork as you go.
