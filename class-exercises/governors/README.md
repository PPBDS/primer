# Governors

Barfort, Klemmensen, and Larsen (2021) collected the lifespans of 3,587 candidates for US gubernatorial office, in order to estimate the causal effect of winning office on longevity. This week you will use their data to help two different people:

- Imagine you work for a life insurer, and want to forecast how long candidates for the US Senate might live based on their age, party, election result, and other variables.

- Imagine you are a researcher. You want to know if winning candidates live longer. You are interested in candidates for any elected office --- senate, governor, mayor, et cetera.

Each class meeting this week has its own repo, which you will fork that day:

- `governors-wisdom` — day 1: Wisdom and Justice.
- `governors-courage` — day 2: Courage. Its setup chunk provides the cleaned tibble `x` from day 1.
- `governors-temperance` — day 3: Temperance. Its setup chunk provides `x` and the fitted model `fit_governors` from day 2.

Each day's document holds just that day's questions; the setup chunk at the top carries forward whatever earlier work the day depends on, and our answers to each day's questions arrive by email after class. This repo holds one meeting's exercise document (the `.qmd` file), a rendered HTML version of it (open it in your browser to check things out), the data (`data/governors.csv`), the original Barfort, Klemmensen, and Larsen (2021) paper (`governors-paper.pdf`), and this README.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo): click the green **Code** button on your fork, copy the URL, and run `git clone <that-url>`.
3. Open the cloned folder in your IDE. Most of our students use VS Code.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "broom", "easystats"))
```

## Work the exercise

Open the `.qmd` file and type your answers into the blank space below each question, then render as you go:

```bash
quarto render governors-wisdom.qmd   # use the name of this repo's .qmd file
```

Commit and push your work to your fork as you go.
