# Class Size

The Tennessee STAR experiment (Mosteller 1995) randomly assigned more than 6,000 students to small classes (13–17 students), regular classes (22–25), or regular classes with a teacher's aide, from kindergarten through third grade. This week you will use the data to help two different people:

- Imagine that you are an elementary school principal in Chicago. You want to predict student performance. Fortunately, you have data today for your current students like the data available in the STAR project.

- Imagine you work for the Texas Department of Education. You want to understand student performance in small classes, relative to big classes, in Dallas. In Texas, there is data available like the data in the STAR project.

Each class meeting this week has its own repo, which you will fork that day:

- `class-size-wisdom` — day 1: Wisdom and Justice.
- `class-size-courage` — day 2: Courage.
- `class-size-temperance` — day 3: Temperance. Its setup chunk provides the fitted model `fit_classsize` from day 2.

Each day's document holds just that day's questions; the setup chunk at the top carries forward whatever earlier work the day depends on, and our answers to each day's questions arrive by email after class. This repo holds one meeting's exercise document (the `.qmd` file), a rendered HTML version of it (open it in your browser to check things out), the data (`data/class-size.csv`), the original Mosteller (1995) paper (`class-size-paper.pdf`), and this README.

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
quarto render class-size-wisdom.qmd   # use the name of this repo's .qmd file
```

Commit and push your work to your fork as you go.
