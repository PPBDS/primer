# Build the `recruits` dataset shipped with the primer.tutorials package.
#
# The 05-recruits tutorial uses this 50-row sample as a teaching cut of the
# NHANES height data. The deliberate mix --- 40 men and 10 women --- gives
# the two group means visibly different standard errors, which is one of the
# things the tutorial is meant to make students notice and explain.
#
# Re-run this script (Rscript data-raw/recruits.R from the package root)
# whenever you want to regenerate data/recruits.rda. usethis::use_data()
# writes the .rda; the in-package roxygen doc lives in R/recruits.R.

library(primer.data)
library(dplyr)
library(tidyr)
library(usethis)

set.seed(2026)

eligible <- nhanes |>
  filter(age >= 18 & age <= 27) |>
  select(height, sex, age) |>
  drop_na()

male_sample   <- eligible |> filter(sex == "Male")   |> slice_sample(n = 40)
female_sample <- eligible |> filter(sex == "Female") |> slice_sample(n = 10)

recruits <- bind_rows(male_sample, female_sample) |>
  slice_sample(prop = 1)

stopifnot(nrow(recruits) == 50)
stopifnot(sum(recruits$sex == "Male")   == 40)
stopifnot(sum(recruits$sex == "Female") == 10)

use_data(recruits, overwrite = TRUE)
