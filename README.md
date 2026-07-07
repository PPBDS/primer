# Preceptor's Primer for Bayesian Data Science

Source for the book *Preceptor's Primer for Bayesian Data Science: Using the Cardinal Virtues for Inference* by David Kane. The accompanying `primer.tutorials` R package lives in its own repo: [PPBDS/primer.tutorials](https://github.com/PPBDS/primer.tutorials) (split out 2026-07 so that installing the package no longer downloads this entire repo).

- **Book:** <https://ppbds.github.io/primer/>
- **Tutorials package:** <https://github.com/PPBDS/primer.tutorials> (site: <https://ppbds.github.io/primer.tutorials/>)

## Repository layout

- `book/` — Quarto book source (`*.qmd` chapters, `_quarto.yml`, supporting images and data)
- `guide/` — the authoring guide, shared by book chapters and the tutorials (the tutorials repo links back here)
- `class-exercises/` — in-class exercise materials
- `.github/workflows/` — CI: render and deploy the book

## Installing the tutorials package

```r
remotes::install_github("PPBDS/primer.tutorials")
```

## Building locally

Render the book:

```bash
quarto render book
```
