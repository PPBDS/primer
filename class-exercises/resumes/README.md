# Resumes

Bertrand and Mullainathan (2004) sent 4,870 fictitious resumes to help-wanted ads in Boston and Chicago newspapers, randomly assigning each resume an African-American-sounding or White-sounding name. This week you will use their data to help two different people:

- Imagine that you are a contemporary historian studying US employment in the year 2000 in Baltimore. You want to understand the process by which some people got jobs and some did not.

- Imagine that you work for a civil rights organization in Chicago. You want to understand the process by which black US citizens are discriminated against in hiring today.

Each class meeting this week has its own repo, which you will fork that day:

- `resumes-wisdom` — day 1: Wisdom and Justice.
- `resumes-courage` — day 2: Courage. Its document begins with our answers to Wisdom and Justice.
- `resumes-temperance` — day 3: Temperance. Its document begins with our answers to Wisdom, Justice, and Courage.

This repo holds one meeting's exercise document (the `.qmd` file), a rendered HTML version of it (open it in your browser to check things out), the data (`data/resumes.csv`), the original Bertrand and Mullainathan (2004) paper (`resumes-paper.pdf`), and this README.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo): click the green **Code** button on your fork, copy the URL, and run `git clone <that-url>`.
3. Open the cloned folder in your IDE. Most of our students use VS Code.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "broom", "gt", "easystats"))
```

## Work the exercise

Open the `.qmd` file and type your answers into the blank space below each question. Each day's document starts with the same background and data loading, and the later documents begin with our answers to everything that came before — so you always work from correct foundations. Render as you go:

```bash
quarto render resumes-wisdom.qmd   # use the name of this repo's .qmd file
```

Commit and push your work to your fork as you go.
