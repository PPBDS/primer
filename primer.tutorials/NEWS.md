# primer.tutorials (development version)

* Absorbed into the `PPBDS/primer` monorepo. The package now lives at `primer.tutorials/` inside the book repo and installs via `remotes::install_github("PPBDS/primer", subdir = "primer.tutorials")`.

* Renumbered tutorial directories from three-digit (`011-probability`, etc.) to two-digit (`01-probability`). Tutorial IDs in YAML headers updated to match.

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


