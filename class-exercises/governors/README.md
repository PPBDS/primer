# Governors

Barfort, Klemmensen, and Larsen (2021) collected the lifespans of 3,587 candidates for US gubernatorial office, in order to estimate the causal effect of winning office on longevity. This week you will use their data to help two different people:

- Imagine you work for a life insurer, and want to forecast how long candidates for the US Senate might live based on their age, party, election result, and other variables.

- Imagine you are a researcher. You want to know if winning candidates live longer.

Each class meeting this week has its own repo, which you will fork that day:

- `governors-wisdom` — day 1: Wisdom and Justice.
- `governors-courage` — day 2: Courage. Its document begins with our answers to Wisdom and Justice.
- `governors-temperance` — day 3: Temperance. Its document begins with our answers to Wisdom, Justice, and Courage.

This repo holds one meeting's exercise document (the `.qmd` file), the data (`data/governors.csv`), the original Barfort, Klemmensen, and Larsen (2021) paper (`governors-paper.pdf`), and this README.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo): click the green **Code** button on your fork, copy the URL, and run `git clone <that-url>`.
3. Open the cloned folder in your IDE. Most of our students use VS Code.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "broom", "gt"))
```

## Work the exercise

Open the `.qmd` file and type your answers into the blank space below each question. Each day's document starts with the same background and data loading, and the later documents begin with our answers to everything that came before — so you always work from correct foundations. Render as you go:

```bash
quarto render governors-wisdom.qmd   # use the name of this repo's .qmd file
```

Commit and push your work to your fork as you go.
