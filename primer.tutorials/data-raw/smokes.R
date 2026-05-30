# Build the `smokes` dataset shipped with the primer.tutorials package.
#
# The 09-smokes tutorial uses this 1000-row sample as a teaching cut of
# NHANES (the national health survey). The outcome is whether a respondent
# has ever smoked at least 100 cigarettes (the standard public-health
# definition of "ever-smoker"). Covariates are age and sex --- both
# textbook risk factors for tobacco use.
#
# Data source: the NHANES R package on CRAN, which bundles a 10,000-row
# educational subset of the National Health and Nutrition Examination
# Survey (2009-2012 waves). We further trim to adults aged 20-80 with
# non-missing values on Smoke100, Age, and Gender, then take a 1,000-row
# random sample.
#
# Re-run via `Rscript data-raw/smokes.R` from the package root. Requires
# the NHANES package to be installed; not added to DESCRIPTION because
# this script is the only place that uses it (see ^data-raw$ in
# .Rbuildignore).

library(NHANES)
library(dplyr)
library(stringr)
library(usethis)

data(NHANES)

set.seed(2026)

smokes <- NHANES |>
  filter(Age >= 20, Age <= 80) |>
  filter(!is.na(Smoke100), !is.na(Age), !is.na(Gender)) |>
  transmute(
    smoke = factor(Smoke100, levels = c("No", "Yes")),
    sex   = factor(str_to_title(as.character(Gender)), levels = c("Female", "Male")),
    age   = as.integer(Age)
  ) |>
  slice_sample(n = 1000)

stopifnot(nrow(smokes) == 1000)
stopifnot(all(c("Female", "Male") %in% smokes$sex))
stopifnot(all(c("No", "Yes") %in% smokes$smoke))
stopifnot(min(smokes$age) >= 20, max(smokes$age) <= 80)

use_data(smokes, overwrite = TRUE)
