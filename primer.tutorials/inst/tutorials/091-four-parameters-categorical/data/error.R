

library(tidyverse)
library(tidymodels)
library(easystats)



fit_obj <- multinom_reg() |>
  fit(species ~ bill_length_mm, data = penguins)

check_model(fit_obj)

check_predictions(extract_fit_engine(fit_obj))
