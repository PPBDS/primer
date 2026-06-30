# Insert Preceptor and Population Table Templates

Insert Preceptor and Population Table Templates in Quarto

## Usage

``` r
make_p_tables(
  type,
  unit_label,
  outcome_label,
  treatment_label,
  covariate_label,
  source_col = TRUE
)
```

## Arguments

- type:

  Character. Either `"causal"` or `"predictive"`. Determines whether
  potential outcomes are used (`"causal"`) or a single outcome
  (`"predictive"`).

- unit_label:

  Character. Label for the unit column (length 2).

- outcome_label:

  Character. Label for the outcome or potential outcomes.

- treatment_label:

  Character. Label for the treatment column (always required).

- covariate_label:

  Character. Label for the covariate column.

- source_col:

  Logical. Whether to include a `"Source"` column in the population
  table. Defaults to `TRUE`.

## Value

Invisibly returns `NULL`. Inserts code into the active Quarto document.

## Details

Inserts a Quarto-ready template consisting of multiple code chunks for
creating **Preceptor Tables** and **Population Tables**. These tables
support both causal and predictive workflows.

The output includes:

- Empty `tibble`s for the Preceptor Table and Population Table (the
  latter includes the Preceptor rows)

- Editable footnotes for documentation

- `gt` code chunks to render each table with labeled spanners and
  columns sized roughly proportional to label length

- The Preceptor and Population tables include a final "More" column and
  a last empty row added during rendering for easier editing

This function inserts R code chunks into the active Quarto document via
[`rstudioapi::insertText()`](https://rstudio.github.io/rstudioapi/reference/rstudio-documents.html).
The inserted code includes editable footnotes, two tibbles (`p_tibble`
and `d_tibble`) for the user to fill out, and the assembly of final
tables with proper column grouping and formatting.

## Note

- All cell entries in the tibbles must be wrapped in double quotes,
  including numbers (e.g., `"42"`).

- The initial tibbles are simplified for easier editing; an additional
  row and "More" column are added during table rendering.

- Column widths in the rendered `gt` tables are set proportionally to
  the length of the column labels, helping maintain readable, centered
  columns.

## Author

David Kane, Aashna Patel

## Examples

``` r
if (FALSE) { # \dontrun{
# Insert causal tables for a study of senators' voting behavior
# Outcomes reflect support conditional on the treatment
make_p_tables(
  type = "causal",
  unit_label = c("Senator", "Session Year"),
  outcome_label = c("Support if Contact", "Support if No Contact"),
  treatment_label = "Lobbying Contact",
  covariate_label = "Age"
)

# Insert predictive tables for a clinical trial measuring patient recovery
make_p_tables(
  type = "predictive",
  unit_label = c("Patient ID", "Visit Number"),
  outcome_label = c("Recovery Score"),
  treatment_label = "Drug Dosage Group",
  covariate_label = "Baseline Health Score"
)
} # }
```
