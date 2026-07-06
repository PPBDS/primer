# Class Size

The Tennessee STAR experiment (Mosteller 1995) randomly assigned more than 6,000 students to small classes (13–17 students), regular classes (22–25), or regular classes with a teacher's aide, from kindergarten through third grade. This week you will use the data to help two different people:

- Imagine that you are an elementary school principal in Chicago. You want to predict student performance. Fortunately, you have data today for your current students like the data available in the STAR project.

- Imagine you work for the Texas Department of Education. You want to understand student performance in small classes, relative to big classes, in Dallas. In Texas, there is data available like the data in the STAR project.

This repo has everything you need for this week's class exercise:

- `class-size-wisdom.qmd` — day 1: Wisdom and Justice. Type your answers directly into the document.
- `class-size-courage.qmd` — day 2: Courage. Begins with our answers to Wisdom and Justice.
- `class-size-temperance.qmd` — day 3: Temperance. Begins with our answers to Wisdom, Justice, and Courage.
- `class-size-answers.qmd` — the answer guideline.
- `data/class-size.csv` — the data.
- `class-size-paper.pdf` — the original Mosteller (1995) paper.

## Get your own copy

1. Click **Fork** (top right of this page) to make your own copy of this repo on your GitHub account.
2. Clone *your fork* (not this repo) to your computer, replacing `<your-username>`:

   ```bash
   git clone https://github.com/<your-username>/class-size.git
   ```

3. Open the `class-size` folder in your IDE. Most of our students use VS Code.

## What you need installed

[R](https://cran.r-project.org/), [Quarto](https://quarto.org/docs/get-started/), and these packages:

```r
install.packages(c("tidyverse", "tidymodels", "marginaleffects", "broom", "gt"))
```

## Work the exercise

Each class meeting has its own document. Work them in order: `class-size-wisdom.qmd`, then `class-size-courage.qmd`, then `class-size-temperance.qmd`. Every document starts with the same background and data loading, and each later document begins with our answers to everything that came before — so you always work from correct foundations.

Type your answers into the blank space below each question, then render:

```bash
quarto render class-size-wisdom.qmd
```

Commit and push your work to your fork as you go.
