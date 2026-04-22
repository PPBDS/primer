# primer.tutorials (development version)

* Absorbed into the `PPBDS/primer` monorepo. The package now lives at `primer.tutorials/` inside the book repo and installs via `remotes::install_github("PPBDS/primer", subdir = "primer.tutorials")`.

* Renumbered tutorial directories from three-digit (`011-probability`, etc.) to two-digit (`01-probability`). Tutorial IDs in YAML headers updated to match.

* Renamed example tutorial directories from parameter-count names to dataset names (`06-models` → `06-biden`, `07-two-parameters` → `07-nhanes`, `08-three-parameters-causal` → `08-trains`, `09-four-parameters-categorical` → `09-nes`, `10-five-parameters` → `10-governors`, `11-n-parameters` → `11-shaming`, `12-cumulative` → `12-ces`, `13-ordered-factors` → `13-colleges`; `14-stops` unchanged). Tutorial titles and YAML `id:` fields updated to match. Student-repo names in operational exercises now match the tutorial directory name. Breaking change for existing student progress records: IDs changed, so completion data from the old directory names does not carry forward.

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


