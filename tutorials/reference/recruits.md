# Teaching cut of NHANES young-adult heights

A 50-row sample drawn from the National Health and Nutrition Examination
Survey (NHANES, via
[primer.data::nhanes](https://rdrr.io/pkg/primer.data/man/nhanes.html))
for the `06-recruits` tutorial. Restricted to ages 18–27 and to the
columns relevant for the tutorial's question. The split between sexes
(40 male, 10 female) is deliberately uneven so the two group means have
visibly different standard errors — a feature the tutorial's Temperance
section asks students to notice and explain.

## Usage

``` r
recruits
```

## Format

A tibble with 50 rows and 3 variables:

- height:

  Height in centimeters.

- sex:

  Self-reported sex; takes values `"Male"` and `"Female"`.

- age:

  Age in years (integer, 18–27). Not used in the tutorial's model; kept
  in the dataset because it documents the age scope of the sample and is
  occasionally useful in EDA.

## Source

Subset of
[primer.data::nhanes](https://rdrr.io/pkg/primer.data/man/nhanes.html).
See `data-raw/recruits.R` in the `primer.tutorials` package for the
script that draws the sample (random with `set.seed(2026)`); rerun that
script to regenerate.
