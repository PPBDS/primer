# Preceptor and Population Tables

## Overview

This vignette introduces the
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
function in the `primer.tutorials` package, which inserts a three-chunk
Quarto-ready template into your open document for creating **Preceptor
Tables** and **Population Tables**.

These tables are designed to support both **causal** and **predictive**
modeling workflows by clearly labeling variables with spanners and
encouraging detailed documentation via footnotes.

## What Are Preceptor and Population Tables?

**Preceptor Tables** and **Population Tables** help represent structured
information about observational units, treatment status, potential or
predicted outcomes, and covariates in a standardized format. They are
especially useful in modeling workflows, particularly in education or
social science contexts where modeling assumptions should be made
transparent.

This format draws inspiration from the [Cardinal
Virtues](https://ppbds.github.io/primer/tutorials/articles/cardinal_virtues.html#preceptor-table)
article, and aims to make tables interpretable in isolation by including
both clear labeling and explanatory footnotes.

### Preceptor Table

A **Preceptor Table** contains hypothetical or expected outcomes for
units (such as students or senators). It often includes unknowns
(denoted by `"..."`) where real data is not yet available, and reflects
researcher or instructor expectations. The table automatically includes
a blank third row and a “More” column for additional covariates.

### Population Table

A **Population Table** contains a combined view of observed data and the
Preceptor Table. It includes an additional column `Source` that
distinguishes between actual data (`"Data"`) and data required to answer
the question (`"Preceptor"`). The table follows an 11-row structure with
proper spacing between data and preceptor sections.

## Key Features

The output of
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
includes:

- Editable footnotes for documentation
- An empty `tibble` for the **Preceptor Table** (`p_tibble`)
- An empty `tibble` for data input (`d_tibble`)
- `gt` code to render both tables with grouped column headers
  (“spanners”)
- Automatic addition of missing rows and “More” column during rendering
- Column alignment in the tribble code for easier editing

## Spanner Structure

Each table includes spanners for:

- **Unit/Time**
- **Potential Outcomes** (for causal models) or **Outcome** (for
  predictive models)
- **Treatment** (included only in causal models)
- **Covariates** (includes the covariate columns and the “More” column)

> **Note:** All table entries must be surrounded by **double quotes**,
> even for numeric values (e.g., `"42"`).

The goal is to visually communicate which variables play which roles in
your modeling. Each spanner groups columns of a shared type. Footnotes
help document the rationale and context for each set of variables.

## Running `make_p_tables()`

Preceptor and Population Tables are inserted together. The Population
Table includes a `"Source"` column as its first column (controlled by
the `source_col` argument), which takes values `"Data"` or `"Preceptor"`
depending on origin.

Behind the scenes, these tables are generated using
[`tibble::tribble()`](https://tibble.tidyverse.org/reference/tribble.html)
for easier manual editing by row. The tribble code is formatted with
aligned columns to help authors maintain visual structure while editing.

When you run
[`primer.tutorials::make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
without any argument values, you’ll get an error because the function
requires specific labels to create the template.

## Understanding the Function Arguments

The
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
function takes a set of user-defined labels and options that control how
the **Preceptor** and **Population** tables are built and displayed.
Each argument serves a clear conceptual role and is used to populate
column headers, spanner labels, and the default content in
[`tibble::tribble()`](https://tibble.tidyverse.org/reference/tribble.html)
calls. Here is a detailed breakdown:

- We use the term “label” rather than “vars” to indicate that these are
  the labels in the table rather than the variable names from the data.
  As such, they are often human-readable phrases with spaces, like “Math
  Score if in Small Class”. These descriptions should be concise but
  meaningful.

### `type` *(Character)*

- Set to `"causal"` to generate a causal table structure, which
  includes:
  - Multiple columns for **Potential Outcomes** (specified in
    `outcome_label`).
  - A **Treatment** column representing an intervention or assigned
    condition.
- Set to `"predictive"` for a predictive model:
  - Includes outcome columns as specified in `outcome_label`.
- This determines not only what variables appear in the tables, but also
  how they are **spanned** and **labeled** in the rendered `gt` tables.

------------------------------------------------------------------------

### `unit_label` *(Character vector of length 2)*

- Human-readable names for the **unit of analysis** — e.g.,
  `c("Senator", "Session Year")` or `c("Student", "Grade Level")`. The
  first element is the unit, and the second element is the time period.
- These will appear as the first two columns and are grouped under the
  `"Unit/Time"` spanner.
- The labels should be capitalized and concise.

------------------------------------------------------------------------

### `outcome_label` *(Character vector)*

- Describes the **key outcome(s)** being predicted or causally modeled.
- For causal models, must include at least two potential outcomes.
- Causal labels often include both the outcome and the treatment value,
  e.g., \`c(“Score if Small Class”, “Score if Large Class”)
- For predictive models, there is only one outcome, e.g., `c("Score")`.
- Should be interpretable phrases that clearly describe the outcome(s).

------------------------------------------------------------------------

### `treatment_label` *(Character)*

- Label for the treatment/predictor column, such as `"Phone Call"` or
  `"Tutoring Program"`.
- Used to title the corresponding
  [`gt::tab_spanner()`](https://gt.rstudio.com/reference/tab_spanner.html).
- Required for both causal and predictive models.

------------------------------------------------------------------------

### `covariate_label` *(Character)*

- Label for the main covariate column relevant to the analysis.
- This is grouped under the `"Covariates"` spanner along with the “More”
  column.
- Should be a simple phrase like `"Age"` or `"School Type"`.

------------------------------------------------------------------------

### `source_col` *(Logical, default TRUE)*

- Controls whether the Population Table includes a `"Source"` column.
- When `TRUE`, adds a column distinguishing between `"Data"` and
  `"Preceptor"` rows.
- When `FALSE`, the Population Table omits the source column.

Each of these labels should be understood as **descriptive display
names**, not as variable names from an existing dataset.

------------------------------------------------------------------------

## Helper Functions

The
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
function relies on two key helper functions that handle the generation
and formatting of the table templates:

### `write_input_tribble()`

This function generates properly formatted
[`tibble::tribble()`](https://tibble.tidyverse.org/reference/tribble.html)
code with aligned columns for easy manual editing:

- **Purpose**: Creates a character string representing R code for a
  tribble with placeholder values (`"..."`)
- **Input**: Character vector of column names
- **Output**: Formatted tribble code with columns aligned under their
  headers
- **Key Feature**: Calculates appropriate spacing so that column values
  align vertically, making it easier to see which column you’re editing

The function ensures that: - Column headers are wrapped in backticks and
prefixed with `~` - All placeholder values are `"..."` - Column widths
accommodate both header names and placeholder text - The resulting code
is properly formatted for insertion into Quarto documents

### `expand_input_tibble()`

This function processes the user-filled tibbles to add missing
structural elements before rendering:

- **Purpose**: Adds missing rows and the “More” column to create the
  final table structure
- **Input**: List of tibbles, table type (“preceptor” or “population”),
  and source column option
- **Output**: A single expanded tibble ready for `gt` rendering

For **Preceptor Tables**: - Ensures at least 4 rows by adding a blank
row in the third position - Adds a “More” column filled with `"..."`

For **Population Tables**: - Creates the 11-row structure with proper
spacing - Combines data and preceptor sections with blank rows - Handles
the “Source” column labeling (“Data” vs “Preceptor”)

This function ensures that the final rendered tables have consistent
structure regardless of how much data the user initially provides in
their tibbles.

------------------------------------------------------------------------

## Understanding the Footnotes

Footnotes in these tables document your analytical assumptions and
connect to the **cardinal virtues** of data science. When you use
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md),
it generates editable placeholders for ten footnotes, five for each
table.

------------------------------------------------------------------------

### Preceptor Table Footnotes

- **`pre_title_footnote`**: Make clear the question we are trying to
  answer. That question helps to define the universe of interest.

- **`pre_units_footnote`**: Defines each unit/row and connects to
  **stability** and **representativeness**. Explains what each row
  represents and any temporal/spatial scope. The missing rows (indicated
  by “…”) represent the rest of the population from which both your data
  and expectations are drawn.

- **`pre_outcome_footnote`**: For causal tables, connects to
  **validity** - explains how the potential outcomes relate to the true
  causal effects you want to measure. For predictive tables, simply
  describes the outcome variable and its measurement.

- **`pre_treatment_footnote`**: Defines the treatment and connects to
  **unconfoundedness**. Explains the treatment assignment mechanism and
  what makes it “as good as random” for causal inference.

- **`pre_covariates_footnote`**: Explains covariate selection and the
  “…” in the More column, indicating additional variables that might
  matter but aren’t included.

------------------------------------------------------------------------

### Population Table Footnotes

- **`pop_title_footnote`**: Describes how this table combines observed
  data with researcher expectations from the Preceptor Table.

- **`pop_units_footnote`**: Distinguishes between Data rows (observed
  units) and Preceptor rows (researcher expectations), connecting to
  **stability** and **representativeness**. The “…” rows represent the
  broader population from which both are drawn.

- **`pop_outcome_footnote`**: Documents data sources and measurement
  procedures. For causal tables, connects to **validity** by explaining
  how observed outcomes relate to the potential outcomes of interest.

- **`pop_treatment_footnote`**: Explains how treatment was assigned or
  observed in the data, connecting to **unconfoundedness** assumptions
  about the assignment mechanism.

- **`pop_covariates_footnote`**: Describes covariate data sources and
  any measurement differences between observed data and researcher
  expectations.

------------------------------------------------------------------------

The key insight is that **question marks in the Preceptor Table
represent the fundamental problem of causal inference** - we can never
observe both potential outcomes for the same unit. These footnotes make
your assumptions about this missing data explicit and connect them to
the cardinal virtues that make causal inference possible: **validity**,
**stability**, **representativeness**, and **unconfoundedness**.

## Examples

When you run:

``` r
make_p_tables(
  type = "causal",
  unit_label = c("Senator", "Session Year"),
  outcome_label = c("Support Bill", "Oppose Bill"),
  treatment_label = "Lobbying Contact",
  covariate_label = "Senator Age"
)
```

The following chunks are inserted:

### 1. Footnotes and Data Setup

### 2. Preceptor Table

[TABLE]

### 3. Population Table

[TABLE]

After filling in the tibbles and footnotes with actual data, you would
see properly formatted tables with:

- **Preceptor Table**: 4 rows (3 content + 1 blank) with a “More” column
- **Population Table**: 11 rows with proper separation between data and
  preceptor sections
- **Column alignment**: Easy-to-edit tribble format with aligned columns
- **Source labeling**: Clear distinction between “Data” and “Preceptor”
  rows

------------------------------------------------------------------------

## Working Example: Gubernatorial Elections and Longevity

Let’s walk through a complete example using real data from the
`governors` dataset in `primer.data`. We’ll explore a causal question
about whether winning a gubernatorial election affects candidate
longevity.

### Research Question

Does winning a gubernatorial election causally increase a candidate’s
lifespan? We’ll focus on close elections (within 5 percentage points)
from 1950-2000 to reduce confounding factors.

### Setting Up the Analysis

``` r
make_p_tables(
  type = "causal",
  unit_label = c("Candidate", "Election Year"),
  outcome_label = c("Lifespan if Win", "Lifespan if Lose"),
  treatment_label = "Election Outcome",
  covariate_label = "Election Age"
)
```

This generates the template, which we then fill with actual data:

### 1. Completed Data Setup

### 2. Rendered Preceptor Table

[TABLE]

### 3. Rendered Population Table

[TABLE]

## Table Structure Details

### Preceptor Table

- Uses `p_tibble` as input (3 rows of placeholders)
- Processed by
  [`expand_input_tibble()`](https://ppbds.github.io/primer/tutorials/reference/expand_input_tibble.md)
  to add a blank third row and “More” column
- Results in 4 total rows for the final table

### Population Table

- Uses `d_tibble` for data input (3 rows of placeholders)
- Creates 4 data rows (3 content + 1 blank in 3rd position)
- Uses the expanded preceptor table (4 rows)
- Combines into 11-row structure: blank + 4 data + blank + 4 preceptor +
  blank
- All rows are properly labeled in the Source column

### Column Alignment

The tribble code generated by
[`write_input_tribble()`](https://ppbds.github.io/primer/tutorials/reference/write_input_tribble.md)
is formatted with aligned columns to make editing easier: - Headers and
values are padded to align vertically - Minimum column width
accommodates the `"..."` placeholder - Makes it easy to see which column
you’re editing

------------------------------------------------------------------------

## Summary

The
[`make_p_tables()`](https://ppbds.github.io/primer/tutorials/reference/make_p_tables.md)
function simplifies the creation of interpretable, spanner-labeled
tables for modeling workflows. It promotes clarity, transparency, and
rigor by encouraging authors to:

- Replace placeholders with meaningful values
- Use proper formatting with double quotes around all entries
- Fill in footnotes with useful context
- Take advantage of the aligned column structure for easy editing
- Understand the automatic row and column additions during rendering

This workflow supports better modeling documentation and instructional
design, with helper functions ensuring consistent formatting and
structure.

For more on how and why to use these tables, see:

- [The Cardinal
  Virtues](https://ppbds.github.io/primer/tutorials/articles/cardinal_virtues.html)
  article from *primer.tutorials*
