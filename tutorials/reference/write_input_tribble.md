# Write a tribble template with placeholders for a character vector of column names

Generates a character string representing R code for a
[`tibble::tribble()`](https://tibble.tidyverse.org/reference/tribble.html)
with the specified column names and 3 rows filled with placeholder text
`"..."`. Column values are aligned under their headers for easy editing.

## Usage

``` r
write_input_tribble(names)
```

## Arguments

- names:

  Character vector of column names.

## Value

Character string containing the R code for an input tribble with
placeholders `"..."`, formatted for manual editing with aligned columns.

## Details

This function is primarily used internally by
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
to generate properly formatted tribble code that gets inserted into
Quarto documents. The alignment ensures that when users edit the
placeholders, they can easily see which column they're working in.

## Author

David Kane, Aashna Patel

## Examples

``` r
# Generate tribble code for a simple table
cat(write_input_tribble(c("Student", "Year", "Grade")))
#> tibble::tribble(
#>   ~`Student`, ~`Year`, ~`Grade`,
#>   "..."     , "..."  , "..."   ,
#>   "..."     , "..."  , "..."   ,
#>   "..."     , "..."  , "..."   
#> )

# Generate tribble code for a causal inference table
causal_cols <- c("Senator", "Session Year", "Vote if Contact", "Vote if No Contact", 
                 "Lobbying Contact", "Senator Age")
cat(write_input_tribble(causal_cols))
#> tibble::tribble(
#>   ~`Senator`, ~`Session Year`, ~`Vote if Contact`, ~`Vote if No Contact`, ~`Lobbying Contact`, ~`Senator Age`,
#>   "..."     , "..."          , "..."             , "..."                , "..."              , "..."         ,
#>   "..."     , "..."          , "..."             , "..."                , "..."              , "..."         ,
#>   "..."     , "..."          , "..."             , "..."                , "..."              , "..."         
#> )
```
