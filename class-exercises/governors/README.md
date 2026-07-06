# Governors

Barfort, Klemmensen, and Larsen (2021) collected the lifespans of 3,587 candidates for US gubernatorial office, in order to estimate the causal effect of winning office on longevity. This week you will use their data to help two different people:

- Imagine you work for a life insurer, and want to forecast how long candidates for the US Senate might live based on their age, party, election result, and other variables.

- Imagine you are a researcher. You want to know if winning candidates live longer.

This repo has everything you need for this week's class exercise:

- `governors-wisdom.qmd` — day 1: Wisdom and Justice. Type your answers directly into the document.
- `governors-courage.qmd` — day 2: Courage. Begins with our answers to Wisdom and Justice.
- `governors-temperance.qmd` — day 3: Temperance. Begins with our answers to Wisdom, Justice, and Courage.
- `governors-answers.qmd` — the answer guideline.
- `data/governors.csv` — the data.
- `governors-paper.pdf` — the original Barfort, Klemmensen, and Larsen (2021) paper.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo) to your computer, replacing `<your-username>`:

   ```bash
   git clone https://github.com/<your-username>/governors.git
   ```

3. Open the `governors` folder in your IDE. Most of our students use VS Code.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "broom", "gt"))
```

## Work the exercise

Each class meeting has its own document. Work them in order: `governors-wisdom.qmd`, then `governors-courage.qmd`, then `governors-temperance.qmd`. Every document starts with the same background and data loading, and each later document begins with our answers to everything that came before — so you always work from correct foundations.

Type your answers into the blank space below each question, then render:

```bash
quarto render governors-wisdom.qmd
```

Commit and push your work to your fork as you go.
