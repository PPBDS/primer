# Preceptor's Primer for Bayesian Data Science

Source for the book *Preceptor's Primer for Bayesian Data Science: Using the Cardinal Virtues for Inference* by David Kane, together with the `primer.tutorials` R package that accompanies it.

- **Book:** <https://ppbds.github.io/primer/>
- **Tutorials site:** <https://ppbds.github.io/primer/tutorials/>

## Repository layout

- `book/` — Quarto book source (`*.qmd` chapters, `_quarto.yml`, supporting images and data)
- `primer.tutorials/` — R package providing the learnr tutorials
- `.github/workflows/` — CI: R CMD check for the package, combined render and deploy for the book + pkgdown site

## Installing the R package

```r
remotes::install_github("PPBDS/primer", subdir = "primer.tutorials")
```

## Building locally

Render the book:

```bash
quarto render book
```

Check the R package (from the repo root):

```r
setwd("primer.tutorials")
devtools::check()
```
