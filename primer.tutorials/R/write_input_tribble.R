#' Write a tribble template with placeholders for a character vector of column names
#'
#' Generates a character string representing R code for a `tibble::tribble()` 
#' with the specified column names and 3 rows filled with placeholder
#' text `"..."`. Column values are aligned under their headers for easy editing.
#'
#' @param names Character vector of column names.
#'
#' @return Character string containing the R code for an input tribble with placeholders `"..."`,
#'   formatted for manual editing with aligned columns.
#'
#' @details
#' This function is primarily used internally by `make_p_tables()` to generate
#' properly formatted tribble code that gets inserted into Quarto documents.
#' The alignment ensures that when users edit the placeholders, they can easily
#' see which column they're working in.
#'
#' @author David Kane, Aashna Patel
#'
#' @examples
#' # Generate tribble code for a simple table
#' cat(write_input_tribble(c("Student", "Year", "Grade")))
#'
#' # Generate tribble code for a causal inference table
#' causal_cols <- c("Senator", "Session Year", "Vote if Contact", "Vote if No Contact", 
#'                  "Lobbying Contact", "Senator Age")
#' cat(write_input_tribble(causal_cols))
#'
#' @export

write_input_tribble <- function(names) {
  n <- length(names)
  
  # Calculate column widths based on header names (with backticks and ~)
  header_widths <- nchar(paste0("~`", names, "`"))
  # Ensure minimum width of 5 for "..." placeholder
  col_widths <- pmax(header_widths, 5)
  
  # Create properly spaced header row
  headers_spaced <- character(n)
  for (i in 1:n) {
    header_text <- paste0("~`", names[i], "`")
    padding <- col_widths[i] - nchar(header_text)
    headers_spaced[i] <- paste0(header_text, paste(rep(" ", padding), collapse = ""))
  }
  header <- paste(headers_spaced, collapse = ", ")
  
  # Create properly spaced data rows
  placeholder_rows <- character(3)
  for (row in 1:3) {
    row_values <- character(n)
    for (i in 1:n) {
      value_text <- '"..."'
      padding <- col_widths[i] - nchar(value_text)
      row_values[i] <- paste0(value_text, paste(rep(" ", padding), collapse = ""))
    }
    placeholder_rows[row] <- paste(row_values, collapse = ", ")
  }
  
  # Construct tribble text with aligned columns
  tribble_text <- paste0(
    "tibble::tribble(\n",
    "  ", header, ",\n  ",
    paste(placeholder_rows, collapse = ",\n  "),
    "\n)"
  )
  return(tribble_text)
}
