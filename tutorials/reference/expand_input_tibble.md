# Expand input tibble(s) by adding a 'More' column and missing rows, then combine if population

Processes one or two input tibbles to add missing rows and structure, a
final "More" column with "..." placeholders, and combines them if type
is 'population'. This function ensures consistent table structure
regardless of initial input.

## Usage

``` r
expand_input_tibble(x, type, source = FALSE)
```

## Arguments

- x:

  List of tibble(s). For type "preceptor", a list of length 1. For type
  "population", a list of length 2 (data tibble and preceptor tibble).

- type:

  Character string. Either "preceptor" or "population".

- source:

  Logical, whether the population table includes a 'Source' column.
  Default FALSE.

## Value

A single tibble with added missing rows and 'More' column, suitable for
piping to gt.

## Details

For "preceptor": Takes a 3-row input tibble, adds a blank row in the
third position (filled with "..."), then adds a "More" column with "..."
in all positions. Results in a 4-row tibble.

For "population": Takes two tibbles (data and preceptor), expands the
data tibble to 4 rows, uses the 4-row preceptor tibble, then combines
them into an 11-row structure with proper spacing: blank + 4 data rows +
blank + 4 preceptor rows + blank. Finally adds "More" column with "..."
placeholders.

## Author

David Kane, Aashna Patel

## Examples

``` r
# Preceptor example
library(tibble)
library(dplyr)
#> 
#> Attaching package: ‘dplyr’
#> The following objects are masked from ‘package:stats’:
#> 
#>     filter, lag
#> The following objects are masked from ‘package:base’:
#> 
#>     intersect, setdiff, setequal, union

student_data <- tribble(
  ~Student, ~Year, ~Grade,
  "Alice", "2020", "A",
  "Bob", "2021", "B", 
  "Carol", "2022", "A"
)
expand_input_tibble(list(student_data), "preceptor")
#> # A tibble: 4 × 4
#>   Student Year  Grade More 
#>   <chr>   <chr> <chr> <chr>
#> 1 Alice   2020  A     ...  
#> 2 Bob     2021  B     ...  
#> 3 ...     ...   ...   ...  
#> 4 Carol   2022  A     ...  

# Population example - combining data and preceptor sections
data_section <- tribble(
  ~Senator, ~Year, ~Vote,
  "Smith", "2020", "Yes",
  "Jones", "2021", "No",
  "Davis", "2022", "Yes"
)

preceptor_section <- tribble(
  ~Senator, ~Year, ~Vote, 
  "Expected A", "2023", "Yes",
  "Expected B", "2024", "No",
  "...", "...", "...",
  "Expected C", "2025", "Yes"
)

expand_input_tibble(list(data_section, preceptor_section), "population")
#> # A tibble: 11 × 4
#>    Senator    Year  Vote  More 
#>    <chr>      <chr> <chr> <chr>
#>  1 ...        ...   ...   ...  
#>  2 Smith      2020  Yes   ...  
#>  3 Jones      2021  No    ...  
#>  4 ...        ...   ...   ...  
#>  5 Davis      2022  Yes   ...  
#>  6 ...        ...   ...   ...  
#>  7 Expected A 2023  Yes   ...  
#>  8 Expected B 2024  No    ...  
#>  9 ...        ...   ...   ...  
#> 10 Expected C 2025  Yes   ...  
#> 11 ...        ...   ...   ...  
```
