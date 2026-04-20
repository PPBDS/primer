#' Insert Preceptor and Population Table Templates in Quarto
#'
#' Inserts a Quarto-ready template consisting of multiple code chunks for creating
#' **Preceptor Tables** and **Population Tables**. These tables support both causal
#' and predictive workflows.
#'
#' The output includes:
#' - Empty `tibble`s for the Preceptor Table and Population Table (the latter includes
#'   the Preceptor rows)
#' - Editable footnotes for documentation
#' - `gt` code chunks to render each table with labeled spanners and columns
#'   sized roughly proportional to label length
#' - The Preceptor and Population tables include a final "More" column and
#'   a last empty row added during rendering for easier editing
#'
#' @name make_p_tables
#' @title Insert Preceptor and Population Table Templates
#'
#' @param type Character. Either `"causal"` or `"predictive"`. Determines
#'   whether potential outcomes are used (`"causal"`) or a single outcome (`"predictive"`).
#' 
#' @param unit_label Character. Label for the unit column (length 2).
#' 
#' @param outcome_label Character. Label for the outcome or potential outcomes.
#' 
#' @param treatment_label Character. Label for the treatment column (always required).
#' 
#' @param covariate_label Character. Label for the covariate column.
#' 
#' @param source_col Logical. Whether to include a `"Source"` column in the population table. Defaults to `TRUE`.
#'
#' @note
#' - All cell entries in the tibbles must be wrapped in double quotes, including numbers (e.g., `"42"`).
#' - The initial tibbles are simplified for easier editing; an additional row and "More" column
#'   are added during table rendering.
#' - Column widths in the rendered `gt` tables are set proportionally to the length of the column labels,
#'   helping maintain readable, centered columns.
#'
#' @details
#' This function inserts R code chunks into the active Quarto document via
#' `rstudioapi::insertText()`. The inserted code includes editable footnotes,
#' two tibbles (`p_tibble` and `d_tibble`) for the user to fill out, and the
#' assembly of final tables with proper column grouping and formatting.
#'
#' @return Invisibly returns `NULL`. Inserts code into the active Quarto document.
#'
#' @author David Kane, Aashna Patel
#'
#' @importFrom glue glue
#' @importFrom tibble tribble
#' @importFrom gt gt tab_spanner tab_header cols_align cols_width fmt_markdown
#' @importFrom dplyr add_row mutate
#'
#' @export
#'
#' @examples
#' \dontrun{
#' # Insert causal tables for a study of senators' voting behavior
#' # Outcomes reflect support conditional on the treatment
#' make_p_tables(
#'   type = "causal",
#'   unit_label = c("Senator", "Session Year"),
#'   outcome_label = c("Support if Contact", "Support if No Contact"),
#'   treatment_label = "Lobbying Contact",
#'   covariate_label = "Age"
#' )
#'
#' # Insert predictive tables for a clinical trial measuring patient recovery
#' make_p_tables(
#'   type = "predictive",
#'   unit_label = c("Patient ID", "Visit Number"),
#'   outcome_label = c("Recovery Score"),
#'   treatment_label = "Drug Dosage Group",
#'   covariate_label = "Baseline Health Score"
#' )
#' }



make_p_tables <- function(
  type,
  unit_label,
  outcome_label,
  treatment_label,
  covariate_label,
  source_col = TRUE
) {
  # Validation
  if (length(unit_label) != 2) {
    stop("unit_label must be of length 2.", call. = FALSE)
  }
  if (type == "causal" && length(outcome_label) < 2) {
    stop("For causal tables, outcome_label must be of length 2 or greater.", call. = FALSE)
  }
  if (!type %in% c("causal", "predictive")) {
    stop("`type` must be either 'causal' or 'predictive'.")
  }

  # Both p_tibble and d_tibble use the same columns (no Source column yet)
  all_cols <- c(unit_label, outcome_label, treatment_label, covariate_label)

  # Generate tribble code using helper function
  p_tribble_code <- write_input_tribble(all_cols)
  d_tribble_code <- write_input_tribble(all_cols)

  widths <- c(
    if (source_col) 80 else NULL,  # Source column width
    max(nchar(unit_label[1]) * 8, 100),  # Minimum 100px for first unit column
    max(nchar(unit_label[2]) * 8, 120),  # Minimum 120px for second unit column
    rep(max(max(nchar(outcome_label)) * 8, 120), length(outcome_label)),  # Minimum 120px per outcome
    max(nchar(treatment_label) * 8, 120),  # Minimum 120px for treatment
    max(nchar(covariate_label) * 8, 120),  # Minimum 120px for covariate
    60  # More column
  )

  glue_cols <- function(cols) paste0("`", cols, "`", collapse = ", ")

  code_footnotes <- glue::glue(
    "```{{r}}
# Edit the following tibbles and footnotes, look at the vignette for more details
  
p_tibble <- {p_tribble_code}

d_tibble <- {d_tribble_code}
  
pre_title_footnote <- \"...\"
pre_units_footnote <- \"...\"
pre_outcome_footnote <- \"...\"
pre_treatment_footnote <- \"...\"
pre_covariates_footnote <- \"...\"

pop_title_footnote <- \"...\"
pop_units_footnote <- \"...\"
pop_outcome_footnote <- \"...\"
pop_treatment_footnote <- \"...\"
pop_covariates_footnote <- \"...\"
```"
  )

  code_p_table <- glue::glue(
    "```{{r}}
# This code chunk will generate the Preceptor Table
  
p_tibble_full <- expand_input_tibble(list(p_tibble), \"preceptor\")

gt::gt(p_tibble_full) |>
  gt::tab_header(title = \"Preceptor Table\") |>
  gt::tab_spanner(label = \"Unit/Time\", id = \"unit_span\", columns = c({glue_cols(unit_label)})) |>
  gt::tab_spanner(label = \"Potential Outcomes\", id = \"outcome_span\", columns = c({glue_cols(outcome_label)})) |>
  gt::tab_spanner(label = \"Treatment\", id = \"treatment_span\", columns = c({glue_cols(treatment_label)})) |>
  gt::tab_spanner(label = \"Covariates\", id = \"covariates_span\", columns = c({glue_cols(covariate_label)}, \"More\")) |>
  gt::cols_align(align = \"center\", columns = gt::everything()) |>
  gt::cols_align(align = \"left\", columns = c(`{unit_label[1]}`)) |>
  gt::cols_width({
    all_cols_with_more <- c(unit_label, outcome_label, treatment_label, covariate_label, \"More\")
    width_assignments <- paste0('\"', all_cols_with_more, '\" ~ gt::px(', widths[!is.null(widths)], ')', collapse = \", \")
    width_assignments
  }) |>
  gt::cols_label(More = \"...\") |>
  gt::fmt_markdown(columns = gt::everything()) |>
  gt::tab_footnote(footnote = pre_title_footnote, locations = gt::cells_title()) |>
  gt::tab_footnote(footnote = pre_units_footnote, locations = gt::cells_column_spanners(spanners = \"unit_span\")) |>
  gt::tab_footnote(footnote = pre_outcome_footnote, locations = gt::cells_column_spanners(spanners = \"outcome_span\")) |>
  gt::tab_footnote(footnote = pre_treatment_footnote, locations = gt::cells_column_spanners(spanners = \"treatment_span\")) |>
  gt::tab_footnote(footnote = pre_covariates_footnote, locations = gt::cells_column_spanners(spanners = \"covariates_span\"))
```"
  )

  # Population table code - fixed to keep Source column separate from spanners
  if (source_col) {
    code_pop_table <- glue::glue(
      "```{{r}}
# This code chunk will generate the Population Table
    
data_tibble <- dplyr::bind_rows(
  d_tibble[1:2, , drop = FALSE],  
  d_tibble[1, , drop = FALSE] |> dplyr::mutate(dplyr::across(dplyr::everything(), ~ \"...\")),  
  d_tibble[3, , drop = FALSE]     
) |>
  dplyr::mutate(Source = \"Data\", .before = 1)

preceptor_tibble <- p_tibble_full |>
  dplyr::select(-More) |>
  dplyr::mutate(Source = \"Preceptor\", .before = 1)

empty_row <- data_tibble[1, , drop = FALSE]
empty_row[,] <- \"...\"

population_tibble <- dplyr::bind_rows(
  empty_row,              # Row 1: blank
  data_tibble,            # Rows 2-5: 4 data rows (3rd is blank)
  empty_row,              # Row 6: blank  
  preceptor_tibble,       # Rows 7-10: 4 preceptor rows (3rd is blank)
  empty_row               # Row 11: blank
)

population_tibble$More <- \"...\"

gt::gt(population_tibble) |>
  gt::tab_header(title = \"Population Table\") |>
  gt::tab_spanner(label = \"Unit/Time\", id = \"unit_span\", columns = c({glue_cols(unit_label)})) |>
  gt::tab_spanner(label = \"Potential Outcomes\", id = \"outcome_span\", columns = c({glue_cols(outcome_label)})) |>
  gt::tab_spanner(label = \"Treatment\", id = \"treatment_span\", columns = c({glue_cols(treatment_label)})) |>
  gt::tab_spanner(label = \"Covariates\", id = \"covariates_span\", columns = c({glue_cols(covariate_label)}, \"More\")) |>
  gt::cols_align(align = \"center\", columns = gt::everything()) |>
  gt::cols_align(align = \"left\", columns = c(`{unit_label[1]}`)) |>
  gt::cols_width({
    all_cols_with_more <- c(\"Source\", unit_label, outcome_label, treatment_label, covariate_label, \"More\")
    width_assignments <- paste0('\"', all_cols_with_more, '\" ~ gt::px(', widths[!is.null(widths)], ')', collapse = \", \")
    width_assignments
  }) |>
  gt::cols_label(More = \"...\") |>
  gt::fmt_markdown(columns = gt::everything()) |>
  gt::tab_footnote(footnote = pop_title_footnote, locations = gt::cells_title()) |>
  gt::tab_footnote(footnote = pop_units_footnote, locations = gt::cells_column_spanners(spanners = \"unit_span\")) |>
  gt::tab_footnote(footnote = pop_outcome_footnote, locations = gt::cells_column_spanners(spanners = \"outcome_span\")) |>
  gt::tab_footnote(footnote = pop_treatment_footnote, locations = gt::cells_column_spanners(spanners = \"treatment_span\")) |>
  gt::tab_footnote(footnote = pop_covariates_footnote, locations = gt::cells_column_spanners(spanners = \"covariates_span\"))
```"
    )
  } else {
    code_pop_table <- glue::glue(
      "```{{r}}
# This code chunk will generate the Population Table
    
data_tibble <- dplyr::bind_rows(
  d_tibble[1:2, , drop = FALSE],  
  d_tibble[1, , drop = FALSE] |> dplyr::mutate(dplyr::across(dplyr::everything(), ~ \"...\")),  
  d_tibble[3, , drop = FALSE]    
)

preceptor_tibble <- p_tibble_full |>
  dplyr::select(-More)

empty_row <- data_tibble[1, , drop = FALSE]
empty_row[,] <- \"...\"

population_tibble <- dplyr::bind_rows(
  empty_row,              # Row 1: blank
  data_tibble,            # Rows 2-5: 4 data rows (3rd is blank)
  empty_row,              # Row 6: blank  
  preceptor_tibble,       # Rows 7-10: 4 preceptor rows (3rd is blank)
  empty_row               # Row 11: blank
)

population_tibble$More <- \"...\"

pop_table <- gt::gt(population_tibble) |>
  gt::tab_header(title = \"Population Table\") |>
  gt::tab_spanner(label = \"Unit/Time\", id = \"unit_span\", columns = c({glue_cols(unit_label)})) |>
  gt::tab_spanner(label = \"Potential Outcomes\", id = \"outcome_span\", columns = c({glue_cols(outcome_label)})) |>
  gt::tab_spanner(label = \"Treatment\", id = \"treatment_span\", columns = c({glue_cols(treatment_label)})) |>
  gt::tab_spanner(label = \"Covariates\", id = \"covariates_span\", columns = c({glue_cols(covariate_label)}, \"More\")) |>
  gt::cols_align(align = \"center\", columns = gt::everything()) |>
  gt::cols_align(align = \"left\", columns = c(`{unit_label[1]}`)) |>
  gt::cols_width({
    all_cols_with_more <- c(unit_label, outcome_label, treatment_label, covariate_label, \"More\")
    width_assignments <- paste0('\"', all_cols_with_more, '\" ~ gt::px(', widths[!is.null(widths)], ')', collapse = \", \")
    width_assignments
  }) |>
  gt::cols_label(More = \"...\") |>
  gt::fmt_markdown(columns = gt::everything())

# Add footnotes only if they have content
if (!is.null(pop_title_footnote)) {{
  pop_table <- pop_table |> gt::tab_footnote(footnote = pop_title_footnote, locations = gt::cells_title())
}}
if (!is.null(pop_units_footnote)) {{
  pop_table <- pop_table |> gt::tab_footnote(footnote = pop_units_footnote, locations = gt::cells_column_spanners(spanners = \"unit_span\"))
}}
if (!is.null(pop_outcome_footnote)) {{
  pop_table <- pop_table |> gt::tab_footnote(footnote = pop_outcome_footnote, locations = gt::cells_column_spanners(spanners = \"outcome_span\"))
}}
if (!is.null(pop_treatment_footnote)) {{
  pop_table <- pop_table |> gt::tab_footnote(footnote = pop_treatment_footnote, locations = gt::cells_column_spanners(spanners = \"treatment_span\"))
}}
if (!is.null(pop_covariates_footnote)) {{
  pop_table <- pop_table |> gt::tab_footnote(footnote = pop_covariates_footnote, locations = gt::cells_column_spanners(spanners = \"covariates_span\"))
}}

pop_table
```"
    )
  }

  full_code <- paste(
    code_footnotes,
    code_p_table,
    code_pop_table,
    sep = "\n\n"
  )

  rstudioapi::insertText(
    location = rstudioapi::getActiveDocumentContext()$selection[[1]]$range,
    text = full_code
  )

  invisible(NULL)
}
