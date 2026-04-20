#' Expand input tibble(s) by adding a 'More' column and missing rows, then combine if population
#'
#' Processes one or two input tibbles to add missing rows and structure,
#' a final "More" column with "..." placeholders, and combines them if type is 'population'.
#' This function ensures consistent table structure regardless of initial input.
#'
#' @param x List of tibble(s). For type "preceptor", a list of length 1.
#'   For type "population", a list of length 2 (data tibble and preceptor tibble).
#' @param type Character string. Either "preceptor" or "population".
#' @param source Logical, whether the population table includes a 'Source' column. Default FALSE.
#'
#' @return A single tibble with added missing rows and 'More' column, suitable for piping to gt.
#'
#' @details
#' For "preceptor": Takes a 3-row input tibble, adds a blank row in the third position
#' (filled with "..."), then adds a "More" column with "..." in all positions.
#' Results in a 4-row tibble.
#'
#' For "population": Takes two tibbles (data and preceptor), expands the data tibble
#' to 4 rows, uses the 4-row preceptor tibble, then combines them into an 11-row
#' structure with proper spacing: blank + 4 data rows + blank + 4 preceptor rows + blank.
#' Finally adds "More" column with "..." placeholders.
#'
#' @author David Kane, Aashna Patel
#'
#' @examples
#' # Preceptor example
#' library(tibble)
#' library(dplyr)
#' 
#' student_data <- tribble(
#'   ~Student, ~Year, ~Grade,
#'   "Alice", "2020", "A",
#'   "Bob", "2021", "B", 
#'   "Carol", "2022", "A"
#' )
#' expand_input_tibble(list(student_data), "preceptor")
#'
#' # Population example - combining data and preceptor sections
#' data_section <- tribble(
#'   ~Senator, ~Year, ~Vote,
#'   "Smith", "2020", "Yes",
#'   "Jones", "2021", "No",
#'   "Davis", "2022", "Yes"
#' )
#' 
#' preceptor_section <- tribble(
#'   ~Senator, ~Year, ~Vote, 
#'   "Expected A", "2023", "Yes",
#'   "Expected B", "2024", "No",
#'   "...", "...", "...",
#'   "Expected C", "2025", "Yes"
#' )
#' 
#' expand_input_tibble(list(data_section, preceptor_section), "population")
#'
#' @export

expand_input_tibble <- function(x, type, source = FALSE) {
  stopifnot(type %in% c("preceptor", "population"))
  
  if (type == "preceptor") {
    if (length(x) != 1) stop("For 'preceptor', x must be a list of length 1.")
    tib <- x[[1]]
    
    if (nrow(tib) >= 3) {
      new_row <- tib[1, , drop = FALSE]
      new_row[,] <- "..."
      
      tib_expanded <- dplyr::bind_rows(
        tib[1:(nrow(tib)-1), ],
        new_row,
        tib[nrow(tib), ]
      )
    } else {
      tib_expanded <- tib
    }
    
    tib_expanded$More <- "..."
    
    return(tib_expanded)
    
  } else if (type == "population") {
    if (length(x) != 2) stop("For 'population', x must be a list of length 2.")
    
    data_tibble <- x[[1]]    # Should be 2 rows from d_tibble
    preceptor_tibble <- x[[2]] # Should be 4 rows from p_tibble_full (without More column)
    
    # Create empty row template
    empty_row <- data_tibble[1, , drop = FALSE]
    empty_row[,] <- "..."
    
    # Build the 11-row structure:
    # Row 1: blank (all "...")
    # Rows 2-3: data rows (2 rows)
    # Row 4: blank ("..." in all columns)
    # Rows 5-8: preceptor rows (4 rows, already has "..." in 3rd position)
    # Row 9: blank (all "...")
    
    # For data section: 2 data rows + 1 blank + 1 more blank = 4 rows total
    data_section <- dplyr::bind_rows(
      data_tibble[1, ],  # First data row
      data_tibble[2, ],  # Second data row  
      empty_row,         # Blank row
      data_tibble[3, ]   # Third data row
    )
    
    # Preceptor section is already 4 rows from p_tibble_full
    preceptor_section <- preceptor_tibble
    
    # Combine: blank + data(4) + blank + preceptor(4) + blank = 11 rows
    combined <- dplyr::bind_rows(
      empty_row,          # Row 1: blank
      data_section,       # Rows 2-5: data section (4 rows)
      empty_row,          # Row 6: blank  
      preceptor_section,  # Rows 7-10: preceptor section (4 rows)
      empty_row           # Row 11: blank
    )
    
    # Add More column
    combined$More <- "..."
    
    return(combined)
  }
}
