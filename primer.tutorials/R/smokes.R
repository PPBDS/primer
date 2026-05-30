#' Teaching cut of NHANES smoking data
#'
#' A 1,000-row sample drawn from the educational NHANES dataset bundled in
#' the **NHANES** CRAN package (a 10,000-row subset of the 2009--2012 NHANES
#' waves). Restricted to adults aged 20--80 with non-missing values on
#' smoking status, age, and sex. Used by the `09-smokes` tutorial as a
#' Medium-tier predictive logistic regression problem: who has ever smoked
#' at least 100 cigarettes, as a function of age and sex.
#'
#' @format A tibble with 1,000 rows and 3 variables:
#' \describe{
#'   \item{smoke}{Whether the respondent has ever smoked at least 100
#'     cigarettes in their lifetime --- the standard public-health
#'     definition of an "ever-smoker." Factor with levels `"No"` and
#'     `"Yes"`.}
#'   \item{sex}{Self-reported sex; factor with levels `"Female"` and
#'     `"Male"`.}
#'   \item{age}{Age in years (integer, 20--80).}
#' }
#'
#' @source Subset of `NHANES::NHANES` (the **[NHANES](https://CRAN.R-project.org/package=NHANES)**
#'   CRAN package). See `data-raw/smokes.R` in the `primer.tutorials`
#'   package for the script that draws the sample (random with
#'   `set.seed(2026)`); rerun that script to regenerate.
"smokes"
