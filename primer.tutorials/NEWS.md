# primer.tutorials (development version)

* Renamed `10-biden` to `10-smokes` and added a curated `smokes` dataset to the package. The position-5 (Medium predictive) tutorial previously framed a constructed Biden 2024 polling question; the new framing is a public-health analyst targeting an anti-smoking campaign, with logistic regression of "ever-smoker" status (`smoke ~ age + sex`). `smokes` is a 1,000-row teaching cut of the NHANES 2009--2012 educational subset (the **NHANES** CRAN package's `Smoke100` variable) drawn deterministically by `data-raw/smokes.R`, documented in `R/smokes.R`, and lazy-loaded via `LazyData: true`. The new framing keeps the link-function pedagogical role (first logistic regression in the curriculum) while removing political framing the curriculum already covers at positions 6, 7, 8, 9, 11, and 12. **Breaking change for student progress records:** the directory rename and YAML `id:` change mean completion data keyed on `10-biden` does not carry forward.

* Renamed `06-nhanes` to `06-recruits` and added a curated `recruits` dataset to the package. `recruits` is a 50-row teaching cut of NHANES (40 male, 10 female young adults aged 18--27) drawn deterministically by `data-raw/recruits.R`, documented in `R/recruits.R`, and lazy-loaded via `LazyData: true`. The deliberate 40/10 split gives the male and female group means visibly different standard errors, which the tutorial's Temperance section asks students to notice and explain. The tutorial's setup chunk now references `recruits` directly (no slice or filter); the student repo and YAML id are `06-recruits`. The shipped-dataset pattern (`data-raw/<name>.R` + `data/<name>.rda` + `R/<name>.R`) is documented in CLAUDE.md §3.1 and is reusable for other tutorials that need a curated cut of an upstream tibble.

# primer.tutorials 1.5.1

* Institute new Claude driven procedure.

* Absorbed into the `PPBDS/primer` monorepo. The package now lives at `primer.tutorials/` inside the book repo and installs via `remotes::install_github("PPBDS/primer", subdir = "primer.tutorials")`.

* Renumbered tutorial directories from three-digit (`011-probability`, etc.) to two-digit (`01-probability`). Tutorial IDs in YAML headers updated to match.

* Renamed example tutorial directories from parameter-count names to dataset names (`06-models` → `06-biden`, `07-two-parameters` → `07-nhanes`, `08-three-parameters-causal` → `08-trains`, `09-four-parameters-categorical` → `09-nes`, `10-five-parameters` → `10-governors`, `11-n-parameters` → `11-shaming`, `12-cumulative` → `12-ces`, `13-ordered-factors` → `13-colleges`; `14-stops` unchanged). Tutorial titles and YAML `id:` fields updated to match. Student-repo names in operational exercises now match the tutorial directory name.

* Re-sequenced example tutorials per CLAUDE.md §1.5: 12-tutorial target curriculum with predictive/causal alternation (P, C, P, C, …) starting at position 1, 4 tutorials per EMH tier, and random-forest tutorials at positions 11 and 12. Existing example tutorials physically renumbered to their target positions: `06-biden` → `10-biden` (position 5), `07-nhanes` → `06-nhanes` (position 1), `08-trains` → `07-trains` (position 2), `09-nes` → `12-nes` (position 7), `10-governors` → `15-governors` (position 10, and pending recast to causal), `11-shaming` unchanged (position 6), `12-ces` → `14-ces` (position 9), `13-colleges` → `08-colleges` (position 3), `14-stops` → `16-stops` (position 11, pending recast to random forest). Four gap slots (09, 13, 17) remain to be authored. YAML `id:` and `description:` fields updated to match.

* **Breaking change for student progress records.** Directory names and YAML `id:` fields have changed across both the dataset rename and the re-sequencing. Completion data keyed on the old IDs does not carry forward. Expect students to start affected tutorials from scratch after upgrading.

* Rearranged the curriculum: Mechanics is now Chapter 04 (was 08) and Cardinal Virtues is Chapter 05 (was 04); example chapters 06–08 shifted accordingly.

* Removed `renv` lockfile and `.Rprofile` autoloader. Dependencies now resolved via standard DESCRIPTION + `pak`.

* `DESCRIPTION` URL and BugReports now point at https://github.com/PPBDS/primer.

* Stop using gtsummary and equatiomatic packages.

# primer.tutorials 1.2.2

* Return to primer.tutorials name for repo and package.

# primer.tutorials 1.2.1

* Delete outline of rtweet tutorial.

* Delete three Appendix tutorials.

* Added a `NEWS.md` file to track changes to the package.

* Move prep_rstudio_settings() to r4ds.tutorials.

* Move Getting Started tutorial to tutorial.helpers.

* Move several tutorials --- RStudio and Code, RStudio and Github, Terminal, Quarto Websites and Getting Help --- to r4ds.tutorials.


