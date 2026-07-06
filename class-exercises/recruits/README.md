# Recruits

You are in charge of ordering uniforms for next year's Marine Corps bootcamp recruits. What will be the average height of male and female USMC recruits next year?

This repo has everything you need for this week's class exercise:

- `recruits.qmd` — the exercise handout. Type your answers directly into this document.
- `recruits-answers.qmd` — the answer guideline.
- `data/recruits.csv` — the data.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo) to your computer, replacing `<your-username>`:

   ```bash
   git clone https://github.com/<your-username>/recruits.git
   ```

3. Open the `recruits` folder in RStudio or Positron.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "gt", "broom"))
```

## Work the exercise

Open `recruits.qmd` and type your answers into the blank space below each question. To render your document:

```bash
quarto render recruits.qmd
```

Commit and push your work to your fork as you go.
