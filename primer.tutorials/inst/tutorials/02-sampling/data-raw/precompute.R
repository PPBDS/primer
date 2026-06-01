# Pre-compute the heavy 1,000-sample tibbles used by the 02-sampling tutorial.
#
# The tutorial's setup chunk must stay cheap (a few seconds at most) so launches
# are snappy. Computing the unbiased and biased 1,000-sample machinery from
# scratch takes ~11 seconds. Pre-compute here and ship the result as
# data/precomputed.rds; the setup chunk readRDS()s it.
#
# Regenerate with:
#   cd inst/tutorials/02-sampling/data-raw
#   Rscript precompute.R
#
# Last regenerated: 2026-05-31 with R 4.5.x, tidyverse 2.x, primer.data 0.6.x.

suppressPackageStartupMessages({
  library(primer.data)
  library(tidyverse)
})

truth <- mean(shaming$age, na.rm = TRUE)

# One reproducible unbiased sample of 50 for the single-sample exercises.
set.seed(10)
my_sample   <- shaming |> slice_sample(n = 50)
sample_mean <- mean(my_sample$age, na.rm = TRUE)
sample_se   <- sd(my_sample$age, na.rm = TRUE) / sqrt(50)

# 1,000 unbiased samples for the coverage demonstration.
set.seed(10)
samples <- tibble(trial = 1:1000) |>
  mutate(data        = map(trial, ~ slice_sample(shaming, n = 50))) |>
  mutate(sample_mean = map_dbl(data, ~ mean(.$age, na.rm = TRUE))) |>
  mutate(sample_se   = map_dbl(data, ~ sd(.$age, na.rm = TRUE) / sqrt(50))) |>
  mutate(lower       = sample_mean - 1.96 * sample_se,
         upper       = sample_mean + 1.96 * sample_se) |>
  select(-data)

# Biased machinery: voters with age > 40 get triple weight.
shaming_w <- shaming |> mutate(wt = ifelse(age > 40, 3, 1))

set.seed(10)
biased_sample <- shaming_w |> slice_sample(n = 50, weight_by = wt)
biased_mean   <- mean(biased_sample$age, na.rm = TRUE)
biased_se     <- sd(biased_sample$age, na.rm = TRUE) / sqrt(50)

# 1,000 biased samples for the collapsed-coverage demonstration.
set.seed(10)
biased_samples <- tibble(trial = 1:1000) |>
  mutate(data = map(
    trial,
    ~ slice_sample(shaming_w, n = 50, weight_by = wt)
  )) |>
  mutate(sample_mean = map_dbl(data, ~ mean(.$age, na.rm = TRUE))) |>
  mutate(sample_se   = map_dbl(data, ~ sd(.$age, na.rm = TRUE) / sqrt(50))) |>
  mutate(lower       = sample_mean - 1.96 * sample_se,
         upper       = sample_mean + 1.96 * sample_se) |>
  select(-data)

precomputed <- list(
  truth          = truth,
  my_sample      = my_sample,
  sample_mean    = sample_mean,
  sample_se      = sample_se,
  samples        = samples,
  biased_sample  = biased_sample,
  biased_mean    = biased_mean,
  biased_se      = biased_se,
  biased_samples = biased_samples
)

saveRDS(precomputed, "../data/precomputed.rds")
cat("Wrote ../data/precomputed.rds\n")
