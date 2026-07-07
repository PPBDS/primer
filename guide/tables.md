# Primer authoring guide — Preceptor & Population Tables (§10)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.

---

## 10. Preceptor and Population Tables

Every Preceptor Table and Population Table in the book and the tutorials follows the same format. Write them directly as `gt` code using the templates in §10.3 and §10.4: copy the template, change the column labels, fill in the example rows, and write the footnotes.

### 10.1 Purpose

The **Preceptor Table** is the smallest table that, if every cell were filled with its true value, would make the question easy to answer. It shows the **unobservable truth** — what the world looks like when every potential outcome is visible, including the counterfactuals we could never see in reality. Its footnotes clarify what each concept in the question means ("what does 'wealth' cover?"); they do not discuss the data or how we will collect it.

The **Population Table** bridges from the data we actually have to the Preceptor Table, via the population both come from. Its footnotes address the data and how it relates to the Preceptor Table's ideal.

### 10.2 Shared conventions

These apply to both tables, and the same `gt` pipeline + chunk-output wrapping is used verbatim in **both rendering contexts** — `inst/tutorials/NN-topic/tutorial.Rmd` (learnr) and `book/NN-topic.qmd` (Quarto). `gt` is rendering-agnostic; the pipeline-ending pattern described below (id on `gt::gt()`, footnote-cap CSS via `opt_css`, `as_raw_html()` into a variable, `cat()` inside a pandoc raw-HTML fence wrapped in an inline-block `<div>`) was developed to work around learnr-specific layout interactions and is harmless in Quarto. Write the pipeline once per problem; use it in both the tutorial's "Describe Preceptor Table" exercise (§13.2 Ex 9) and the chapter's parallel Wisdom/Justice sections.

- **All cell values are in double quotes, including numbers.** `"42"`, not `42`.
- **Labels are display phrases, not variable names.** `"Lifespan if Win"`, not `lifespan_win`. Capitalized, space-separated, human-readable. Use the simplest label the question allows: `Year` beats `Session Year` unless sessions actually matter; `Senator` beats `US Senator` when context is clear.
- **Example rows use real names and plausible figures.** This applies to *every* example tutorial, not just the ones whose units are obviously identifiable like senators or governors. Generic placeholders ("College 1", "Recruit 50", "Voter A") are wrong; use real institution / person names. Track the same identities across a question's Preceptor and Population Tables so the reader sees the same units in both. **At least one of the three example units in the Preceptor Table must also appear as a Data row in the Population Table** — same name in both blocks, with different values reflecting the time gap (or, if the data and Preceptor share a time, identical values for that one row plus different values for nearby covariates the table doesn't show). Showing the same institution at two different times is the cleanest visualization of why the Population Table needs a `Year` column when the Preceptor Table does not. The Colleges tutorial does this with all three Preceptor rows (Amherst College, University of Iowa, Wagner College) appearing in the Data block at 2013 and the Preceptor block at 2026.
- **`"..."` marks placeholder rows or cells** — the blank row in the middle of a block, or any cell where we're gesturing at "more of the same" rather than giving a specific value.
- **Unobservable potential outcomes are marked differently in the two tables.** In the Preceptor Table, every cell has its true value filled in, and the cells whose values could never be observed in reality are rendered with a diagonal cross-hatch (see §10.3). In the Data rows of the Population Table, the unobserved counterfactual potential outcome is written as `"..."` because no one measured it. In the Preceptor rows of the Population Table, both potential outcomes are filled in with the hatch convention from §10.3. `"?"` is not used anywhere in our table system.
- **Column alignment is type-based.** Left-align the unit column and all character/categorical columns (including `Source` in Population Tables). Right-align numeric columns (even when the `gt` cells are quoted strings to accommodate `"..."` placeholders). Do not center columns by default; centering is reserved for short symmetric content where neither left nor right feels natural. Column labels inherit their column's alignment.
- **Column widths are flexible.** Set them with `gt::cols_width()` if the default looks cramped or sprawling; otherwise omit. Reasonable ballpark: 100–120px for most columns.
- **`gt::fmt_markdown(columns = gt::everything())`** — so cell contents can contain emphasis, links, HTML (needed for hatching), etc.
- **Typographic hierarchy and fit-to-content.** Apply this `tab_options` call immediately after `gt::fmt_markdown()`:
  ```r
  gt::tab_options(
    heading.title.font.size   = "1.5em",
    heading.title.font.weight = "bolder",
    column_labels.font.weight = "normal"
  )
  ```
  The title scales to 1.5× the base font and is bolder. Column labels drop to normal weight so they recede behind the spanners without shrinking below body size. No hardcoded pixel sizes on labels or spanners. Body rows keep the gt default.

- **Pipeline ending and chunk output — five-part pattern.** Every Preceptor/Population Table ends in a specific sequence that was necessary to get the table to render at content width in learnr. Skip any part and the table stretches full-width or generates pandoc warnings.

  1. **Give `gt::gt()` an `id`.** `gt::gt(my_tibble, id = "preceptor_tbl")`. The id scopes the footnote-cap CSS (part 2) to this table only. Use `"preceptor_tbl"` for Preceptor Tables and `"population_tbl"` for Population Tables; in chapters with paired Preceptor Tables, distinguish with `"preceptor_primary_tbl"` / `"preceptor_paired_tbl"`.

  2. **Cap the footnote `<td>` cell width** via `gt::opt_css()` placed immediately before `gt::as_raw_html()`:
     ```r
     gt::opt_css(
       css = "
         #preceptor_tbl .gt_footnote {
           max-width: 1px;
           word-break: break-word;
         }
       "
     )
     ```
     Without this, the long title footnote ("A Preceptor Table is the smallest table…") drives the table's max-content width to ~1300 px. CSS shrink-to-fit clamps to max-content, so the table fills its container no matter what width rules we apply to the table or its wrappers. Capping the footnote cell forces the table's preferred width to come from the data columns alone.

  3. **End the pipeline with `gt::as_raw_html()` and assign to a variable:**
     ```r
     pre_gt_html <- gt::gt(..., id = "preceptor_tbl") |> ... |> gt::as_raw_html()
     ```
     `as_raw_html()` returns a character string of HTML with every style inlined on each element. Must be the last call in the gt pipeline.

  4. **The chunk's options must be `#| echo: false` and `#| results: asis`.** Without `results: asis`, knitr wraps the chunk output in a code block, pandoc tries to markdown-parse the `<div>` tags, and you get `Div unclosed … closing implicitly` warnings plus a wrapper that's scoped to the entire rest of the document instead of the table.

  5. **Emit the HTML inside a pandoc raw-HTML fence wrapping an inline-block `<div>`:**
     ```r
     cat(
       "```{=html}\n",
       '<div style="display: inline-block; width: auto; max-width: 100%;">',
       pre_gt_html,
       "</div>\n",
       "```\n",
       sep = ""
     )
     ```
     The `` ```{=html} `` fence tells pandoc to pass the block through without markdown processing. The inline-block `<div>` wraps gt's output so the immediate containing block shrink-wraps around the (now footnote-capped) table. Belt-and-suspenders: either the footnote cap or the inline-block wrapper alone might suffice in some environments, but together they're robust across learnr, Quarto, and Shiny.

  This pattern replaced earlier attempts that all failed: `tab_options(table.width = "auto")`, `opt_css` with various width/display rules, and `htmltools::div()` returned from a chunk. See §16 for the gotchas in detail.

- **Dual-format ending — the `show_gt()` helper (required in any document that also renders to PDF; safe everywhere).** Tables must look as good in rendered PDF as in HTML. Quarto's HTML-table processing converts the raw-HTML table to a plain LaTeX table for PDF, losing everything CSS-based — bold spanners, the counterfactual cross-hatch, column widths, spacing. The fix: end the pipeline at `opt_css()` (do **not** call `as_raw_html()`), assign the gt object to a variable, and hand it to `show_gt()`, defined once in the document's setup chunk:

  ```r
  # Render a gt table: live HTML table in HTML output; in PDF output, a
  # high-resolution snapshot, because LaTeX conversion loses gt's styling
  # (bold spanners, the counterfactual cross-hatch, spacing).
  show_gt <- function(gt_tbl) {
    if (knitr::is_html_output()) {
      cat("```{=html}\n",
          '<div style="display: inline-block; width: auto; max-width: 100%;">',
          gt::as_raw_html(gt_tbl),
          "</div>\n```\n", sep = "")
    } else {
      f <- knitr::fig_path("png")
      dir.create(dirname(f), recursive = TRUE, showWarnings = FALSE)
      invisible(capture.output(suppressMessages(gt::gtsave(gt_tbl, f, zoom = 2))))
      w <- min(6.5, dim(png::readPNG(f))[2] / 2 / 96)
      cat("\\begin{center}\\includegraphics[width=", w,
          "in]{", f, "}\\end{center}\n", sep = "")
    }
  }
  ```

  The HTML branch is exactly parts 3–5 of the five-part pattern above, unchanged. The PDF branch snapshots the fully-styled table via `gt::gtsave()` (needs **webshot2** installed, which drives headless Chrome) at 2× zoom, so the PDF table is pixel-identical to the HTML one, and sizes it to its natural width (capped at the 6.5-inch text block). Three hard-won details: the PNG must go to `knitr::fig_path()`, not `tempfile()` — R's tempdir is deleted before LaTeX compiles, producing a "file not found" at the `\includegraphics`; the `gtsave()` call must be wrapped in `invisible(capture.output(suppressMessages(...)))` or webshot2's progress line leaks into the `asis` output as literal text; and the calling chunk still needs `#| results: asis`. In HTML-only artifacts (book chapters, tutorials) `show_gt()` behaves identically to the old ending, so it is safe to adopt everywhere.

- **Spanner styling: bold + alignment mirroring columns.** After `tab_options`, bold all spanners generically and then align each spanner group to match the column(s) it covers. Three `tab_style` calls:
  ```r
  gt::tab_style(
    style     = gt::cell_text(weight = "bold"),
    locations = gt::cells_column_spanners()
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "left"),
    locations = gt::cells_column_spanners(spanners = c("unit_span", "covariates_span"))
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "right"),
    locations = gt::cells_column_spanners(spanners = "outcome_span")
  )
  ```
  The spanner-ID lists in the left and right calls vary per table: left-aligned spanners cover text/identifier columns (unit, text covariates, treatment when text-valued, `Source` in Population Tables); right-aligned spanners cover numeric columns, almost always just `outcome_span`. When a spanner covers mixed-type columns (e.g., `Unit/Time` in the Population Table spans a text unit + a numeric year), align left by convention. This styling block is mandatory for every Preceptor and Population Table.
- **Spanner labels singularize when only one column sits under them.** `Covariate` (one) vs. `Covariates` (two or more). `Outcome` (predictive, one) vs. `Potential Outcomes` (causal, two or more). `Unit` stays singular — there is always exactly one unit column.
- **Spanner IDs are fixed** regardless of label: `"unit_span"`, `"outcome_span"`, `"treatment_span"`, `"covariates_span"`. The covariates ID stays `"covariates_span"` even when the label is the singular `Covariate`. Footnotes attach to IDs, so don't rename.
- **Code blocks are copy-paste runnable.** Every `gt` code block Claude produces must run top-to-bottom if pasted in the R Terminal: `tibble::tribble()` definition, footnote string assignments, and the complete `gt::gt(...) |> ...` pipeline ending at the final `tab_footnote()`. Do not include `library()` calls — `gt` and `tibble` are assumed already loaded.
- **Footnotes commit; they do not narrate the choice-making.** Write *"Each row represents one US adult in 2026,"* not *"The question leaves the population unspecified, so this table takes it to mean US adults."* Claude's best guess is often right; when it isn't, David will say so and the table gets fixed. Either way, the draft is ready to use.

- **Rendering gotchas we already hit** (don't rediscover). Multiple attempts to narrow the table failed before we landed on the pattern above. For the next future you wondering "why is this so elaborate":
  1. **`table.width = "auto"` in `tab_options` does nothing in learnr.** gt emits `width: auto` on `.gt_table` by default. The value is correct but is fighting a different problem (max-content from long cells).
  2. **CSS overrides via `opt_css` on `.gt_table { width: fit-content !important; }` (or `inline-table`, or `auto`) do not shrink the table** when a cell's content has large max-content width. CSS shrink-to-fit is bounded below by max-content; the footnote `<td>` contains a long sentence, which sets max-content ~1300 px, so no width rule on the table shrinks it further. The footnote-cap rule (`max-width: 1px; word-break: break-word`) is what actually lets the table shrink, because it forces the footnote cell to wrap instead of contributing to max-content.
  3. **`htmltools::div()` returned from a chunk is block-parsed by pandoc.** The `<div>` starts at column 1 in the intermediate `.md`, pandoc treats it as a markdown-div context, fails to find the closing `</div>`, emits `Div unclosed … closing implicitly` warnings, and ends up wrapping the entire rest of the document instead of the table. `cat()` in a `results: asis` chunk inside a pandoc raw-HTML fence (`` ```{=html} … ``` ``) is what actually keeps the wrapper scoped.
  4. **`gt::as_raw_html()` drops stylesheet-level `opt_css` rules in some configurations** — the inlined per-element styles replace the scoped CSS block. The id-scoped `opt_css` we use (`#preceptor_tbl .gt_footnote { ... }`) still makes it into the inlined output because it's targeted specifically enough to survive. A generic `.gt_table { ... }` rule ahead of `as_raw_html()` does not reliably apply.

### 10.3 Preceptor Table

**Principle.** The Preceptor Table is the smallest table that answers the question. Only add columns the question forces you to add. If the question is "what is the average X of Y?", you need one column for Y (the unit) and one column for X (the outcome) — nothing else.

The Preceptor Table clarifies *the question*. Its footnotes discuss what each concept in the question means. They do **not** discuss the data we will eventually use, measurement error, or data-collection problems — those belong to the Population Table.

**Structure.** Four rows (three example rows plus a blank middle row at position 3). Columns grouped under spanners:

- **Unit** — one column identifying what a row represents. No separate Time column: time is implicit, either specified in the question ("…in 2010") or "now" if unstated. When a unit only makes sense with a year (a candidate in a specific election), fold the year into the unit string: `"Ann Richards (1990)"` rather than adding a column.

  **The Preceptor Table's time is the *question's* time, not the *data's* time.** When the data was collected years before the question is asked, the Preceptor Table reflects the moment of the question. Concrete: a non-profit in 2026 helping students choose colleges has a 2026 Preceptor Table even when the data is from a 2013 IPEDS snapshot. The Population Table will then have Data rows in 2013 and Preceptor rows in 2026 — same institutions, different times, different rows. This time gap is the *stability* concern, not a defect in the framing. The wrong move is to set the Preceptor Table's time to match the data's time ("the 2013 Preceptor Table"); that erases the gap by fiat and makes the stability discussion incoherent. Always set the Preceptor Table's time from the question; let the data's time be whatever the data's time is; let Justice surface the difference.
- **Potential Outcomes** (causal, two or more columns) or **Outcome** (predictive, one column). Causal columns are named after the counterfactual: `Lifespan if Win`, `Lifespan if Lose`. Every cell in these columns has a value — the Preceptor Table shows the unobservable truth, so there are no `"?"` cells; the cells that could never be observed in reality are instead rendered with a diagonal cross-hatch (see *Hatch convention* below).
- **Treatment** (causal only) — exactly one column, always present in causal Preceptor Tables. The treatment gets its own spanner (rather than being folded under `Covariate(s)`), even though it is conceptually a covariate. It is distinct enough from other covariates — it is *the* variable whose causal effect the question is about — that it warrants its own section of the table. Predictive tables never have a `Treatment` spanner or treatment column.
- **Covariate** / **Covariates** — only present when the question forces conditioning on a non-treatment variable.
  - **Predictive**: "how does X vary by Y?" requires Y. "What is the average X?" does not require anything, so no Covariate(s) spanner.
  - **Causal**: included when the question asks about effect heterogeneity ("how does the effect vary by Z?") or explicitly conditions on a variable. The treatment itself does *not* count — it has its own `Treatment` spanner. When the question requires no extra conditioning variable beyond the treatment, omit the `Covariate(s)` spanner.
  - Singular label `Covariate` when one column, plural `Covariates` when two or more.

There is never a `More` column anywhere in the Preceptor Table.

**Footnotes.** Attached to the title, to each spanner, and — in causal tables — to one specific data row. All footnotes clarify the *question*:

- *Title footnote*: a statement of the form *"If all the information in this table were available, we could answer the question: [Question]."*
- *Unit footnote*: what a row represents, including how many units there are — exact count when the question pins it down ("the 100 US Senators"), approximate or judgment-based when it doesn't ("treating 'politician' as federal legislators, ~535 of them"). Include the implicit time period.
- *Outcome footnote*: clarifies what the outcome *concept* means — the ambiguities in the question, not the data. For "wealth", is it personal or family? Does a spouse's wealth count? For "lifespan", age at death from birth or from the election year? When the outcome has a specified scale (a 3–15 integer, a 0–1 probability, etc.), name the scale and its direction (higher = more of what?). In causal tables, this footnote also explains the cross-hatched cells: they mark the unobservable potential outcome for each unit — the one we could never see, because the unit actually experienced the other treatment.
- *Treatment footnote* (causal only): describes the treatment — what counts as "received" vs. "not received", what the possible values are, and whether edge cases (contributions via Super PACs, indirect exposure on the next platform over, etc.) count. The defining concept of the treatment lives here.
- *Covariate(s) footnote* (when the spanner is present): clarifies the concept and values of each non-treatment covariate, plus any operational choices (e.g., *"Independents are treated here as their own category rather than folded into the party they caucus with"*). When a covariate is in the table because the question asks about effect heterogeneity, say so (*"shown because the question asks whether the connection varies across hometowns"*). With many covariates, discuss the ones whose definitions are most ambiguous and let the rest speak for themselves.
- *Per-row causal-effect footnote* (causal only, **Easy tier only — dropped in Medium and Difficult**, see §1.3 *Worked example: Preceptor Table and Population Table footnote sophistication*): attached to the unit-column cell of the second non-missing row (by default row 2 under the 1/2/blank/4 layout). The footnote shows the arithmetic of the difference between the two potential outcomes for that unit — e.g., *"the causal effect for Elizabeth Warren is 12.02 − 12.00 = 0.02 million USD"* — and emphasizes that because the Preceptor Table shows the unobservable truth, this is the true causal effect for that unit, not an estimate.

**Tier-dependent footnote content.** The Preceptor Table structure is identical across Easy / Medium / Difficult, but footnote wording scales. At Easy, the title footnote additionally explains *what* a Preceptor Table is (not just what question it would answer), and the per-row causal-effect footnote above is mandatory. At Medium and Difficult, both Easy scaffolding moves are dropped; the remaining footnotes instead carry more sophisticated discussion (why these column values, what ambiguity the author resolved, what subtleties sit behind the covariates). See §1.3 *Worked example: Preceptor Table and Population Table footnote sophistication across three levels* for details.

**Hatch convention (causal only).** The cell for each unit's unobservable potential outcome is rendered with a transparent diagonal cross-hatch. The hatch signals "this value exists and is filled in with the truth, but we could never observe it." Solid shading alone doesn't convey the *unobservable* part — the hatch makes the missing-from-reality status visible. In `gt`, define a small helper and apply it via `gt::text_transform()`:

```r
hatch <- function(x) {
  paste0(
    '<span style="background-image: repeating-linear-gradient(',
    '45deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 6px);',
    ' padding: 6px 10px; margin: -6px -10px; display: block;">',
    x,
    '</span>'
  )
}
```

The negative margins let the pattern cover the full cell despite the span's own padding. `gt::fmt_markdown()` must be applied so the HTML renders.

**Predictive template, no covariate.** The simplest case — average-of-an-outcome questions.

```r
p_tibble <- tibble::tribble(
  ~`Senator`        , ~`Net Worth ($M)`,
  "Bernie Sanders"  , "2.0",
  "Elizabeth Warren", "12.0",
  "..."             , "...",
  "Rick Scott"      , "300.0"
)

pre_title_footnote   <- "If all the information in this table were available, we could answer the question: What is the average wealth of US Senators?"
pre_units_footnote   <- "Each row represents one of the 100 currently serving US Senators in 2026. Missing rows represent the other senators not shown."
pre_outcome_footnote <- "Wealth here is personal net worth — a senator's own assets minus their own liabilities. It does not include a spouse's assets or jointly-held household wealth. A senator married to a billionaire is not counted as wealthy on that basis alone."

pre_gt_html <- gt::gt(p_tibble, id = "preceptor_tbl") |>
  gt::tab_header(title = "Preceptor Table") |>
  gt::tab_spanner(label = "Unit"   , id = "unit_span",
                  columns = c(`Senator`)) |>
  gt::tab_spanner(label = "Outcome", id = "outcome_span",
                  columns = c(`Net Worth ($M)`)) |>
  gt::cols_align(align = "left" , columns = c(`Senator`)) |>
  gt::cols_align(align = "right", columns = c(`Net Worth ($M)`)) |>
  gt::fmt_markdown(columns = gt::everything()) |>
  gt::tab_options(
    heading.title.font.size   = "1.5em",
    heading.title.font.weight = "bolder",
    column_labels.font.weight = "normal"
  ) |>
  gt::tab_style(
    style     = gt::cell_text(weight = "bold"),
    locations = gt::cells_column_spanners()
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "left"),
    locations = gt::cells_column_spanners(spanners = "unit_span")
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "right"),
    locations = gt::cells_column_spanners(spanners = "outcome_span")
  ) |>
  gt::tab_footnote(footnote = pre_title_footnote,
                   locations = gt::cells_title()) |>
  gt::tab_footnote(footnote = pre_units_footnote,
                   locations = gt::cells_column_spanners(spanners = "unit_span")) |>
  gt::tab_footnote(footnote = pre_outcome_footnote,
                   locations = gt::cells_column_spanners(spanners = "outcome_span")) |>
  gt::opt_css(
    css = "
      #preceptor_tbl .gt_footnote {
        max-width: 1px;
        word-break: break-word;
      }
    "
  ) |>
  gt::as_raw_html()

cat(
  "```{=html}\n",
  '<div style="display: inline-block; width: auto; max-width: 100%;">',
  pre_gt_html,
  "</div>\n",
  "```\n",
  sep = ""
)
```

**Predictive template, one covariate.** For difference-across-groups questions ("how does X vary by Y?") the grouping variable is a required covariate. Spanner label is `Covariate` (singular).

```r
p_tibble <- tibble::tribble(
  ~`Politician`    , ~`Net Worth ($M)`, ~`Party`       ,
  "Bernie Sanders" , "2.0"            , "Independent"  ,
  "Nancy Pelosi"   , "250.0"          , "Democrat"     ,
  "..."            , "..."            , "..."          ,
  "Rick Scott"     , "300.0"          , "Republican"
)

pre_title_footnote     <- "If all the information in this table were available, we could answer the question: How does politician wealth vary by party?"
pre_units_footnote     <- "Each row represents one of the 535 US federal elected legislators — 100 Senators and 435 Representatives — serving in 2026. This table takes 'politician' to mean a federal legislator; other elected officials (state governors, the President, mayors) are outside the scope. Missing rows represent the other legislators not shown."
pre_outcome_footnote   <- "Wealth here is personal net worth — the politician's own assets minus their own liabilities. It does not include a spouse's assets, family trust holdings, or jointly-held household wealth. A politician married to a billionaire is not counted as wealthy on that basis alone."
pre_covariate_footnote <- "Party affiliation, taking one of three values: Democrat, Republican, or Independent. Independents (who typically caucus with one of the major parties) are treated here as their own category rather than folded into the party they caucus with."

pre_gt_html <- gt::gt(p_tibble, id = "preceptor_tbl") |>
  gt::tab_header(title = "Preceptor Table") |>
  gt::tab_spanner(label = "Unit"     , id = "unit_span",
                  columns = c(`Politician`)) |>
  gt::tab_spanner(label = "Outcome"  , id = "outcome_span",
                  columns = c(`Net Worth ($M)`)) |>
  gt::tab_spanner(label = "Covariate", id = "covariates_span",
                  columns = c(`Party`)) |>
  gt::cols_align(align = "left" , columns = c(`Politician`, `Party`)) |>
  gt::cols_align(align = "right", columns = c(`Net Worth ($M)`)) |>
  gt::fmt_markdown(columns = gt::everything()) |>
  gt::tab_options(
    heading.title.font.size   = "1.5em",
    heading.title.font.weight = "bolder",
    column_labels.font.weight = "normal"
  ) |>
  gt::tab_style(
    style     = gt::cell_text(weight = "bold"),
    locations = gt::cells_column_spanners()
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "left"),
    locations = gt::cells_column_spanners(spanners = c("unit_span", "covariates_span"))
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "right"),
    locations = gt::cells_column_spanners(spanners = "outcome_span")
  ) |>
  gt::tab_footnote(footnote = pre_title_footnote,
                   locations = gt::cells_title()) |>
  gt::tab_footnote(footnote = pre_units_footnote,
                   locations = gt::cells_column_spanners(spanners = "unit_span")) |>
  gt::tab_footnote(footnote = pre_outcome_footnote,
                   locations = gt::cells_column_spanners(spanners = "outcome_span")) |>
  gt::tab_footnote(footnote = pre_covariate_footnote,
                   locations = gt::cells_column_spanners(spanners = "covariates_span")) |>
  gt::opt_css(
    css = "
      #preceptor_tbl .gt_footnote {
        max-width: 1px;
        word-break: break-word;
      }
    "
  ) |>
  gt::as_raw_html()

cat(
  "```{=html}\n",
  '<div style="display: inline-block; width: auto; max-width: 100%;">',
  pre_gt_html,
  "</div>\n",
  "```\n",
  sep = ""
)
```

**Causal template.** The treatment lives under its own `Treatment` spanner. The unobservable potential outcome for each data row is hatched. The second non-missing row (here Clayton Williams) carries a footnote showing its causal effect.

```r
hatch <- function(x) {
  paste0(
    '<span style="background-image: repeating-linear-gradient(',
    '45deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 6px);',
    ' padding: 6px 10px; margin: -6px -10px; display: block;">',
    x,
    '</span>'
  )
}

p_tibble <- tibble::tribble(
  ~`Candidate`       , ~`Lifespan if Win`, ~`Lifespan if Lose`, ~`Election Outcome`,
  "Ann Richards"     , "73"              , "70"               , "Won"              ,
  "Clayton Williams" , "85"              , "88"               , "Lost"             ,
  "..."              , "..."             , "..."              , "..."              ,
  "Mario Cuomo"      , "82"              , "80"               , "Won"
)

pre_title_footnote     <- "If all the information in this table were available, we could answer the question: Does winning a gubernatorial election cause longer life?"
pre_units_footnote     <- "Each row represents a candidate in a specific close gubernatorial election (margin < 5%) between 1950 and 2000. Across that period there were roughly 100 such elections and therefore about 200 candidate-election units."
pre_outcome_footnote   <- "Lifespan as age at death in years. For candidates still alive, the potential outcomes would still be filled in — with projected lifespans — because the Preceptor Table shows the unobservable truth. The cross-hatched cells mark each candidate's unobservable potential outcome: the one we could never see, because the candidate actually experienced the other treatment."
pre_treatment_footnote <- "The candidate's election outcome, taking values 'Won' or 'Lost'. The close-election margin (< 5%) is what makes treatment assignment plausibly as-if random."
pre_effect_footnote    <- "The causal effect for Clayton Williams is the difference between his two potential outcomes: 85 − 88 = -3 years. Because the Preceptor Table shows the unobservable truth, this is the true causal effect for him, not an estimate."

pre_gt_html <- gt::gt(p_tibble, id = "preceptor_tbl") |>
  gt::tab_header(title = "Preceptor Table") |>
  gt::tab_spanner(label = "Unit"              , id = "unit_span",
                  columns = c(`Candidate`)) |>
  gt::tab_spanner(label = "Potential Outcomes", id = "outcome_span",
                  columns = c(`Lifespan if Win`, `Lifespan if Lose`)) |>
  gt::tab_spanner(label = "Treatment"         , id = "treatment_span",
                  columns = c(`Election Outcome`)) |>
  gt::cols_align(align = "left" , columns = c(`Candidate`, `Election Outcome`)) |>
  gt::cols_align(align = "right", columns = c(`Lifespan if Win`, `Lifespan if Lose`)) |>
  gt::fmt_markdown(columns = gt::everything()) |>
  gt::tab_options(
    heading.title.font.size   = "1.5em",
    heading.title.font.weight = "bolder",
    column_labels.font.weight = "normal"
  ) |>
  gt::tab_style(
    style     = gt::cell_text(weight = "bold"),
    locations = gt::cells_column_spanners()
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "left"),
    locations = gt::cells_column_spanners(spanners = c("unit_span", "treatment_span"))
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "right"),
    locations = gt::cells_column_spanners(spanners = "outcome_span")
  ) |>
  # Hatch each data row's unobservable potential outcome. Rows 1 and 4 ("Won")
  # → "Lifespan if Lose" is unobservable; row 2 ("Lost") → "Lifespan if Win".
  gt::text_transform(
    locations = gt::cells_body(columns = `Lifespan if Lose`, rows = c(1, 4)),
    fn        = function(x) hatch(x)
  ) |>
  gt::text_transform(
    locations = gt::cells_body(columns = `Lifespan if Win`, rows = 2),
    fn        = function(x) hatch(x)
  ) |>
  gt::tab_footnote(footnote = pre_title_footnote,
                   locations = gt::cells_title()) |>
  gt::tab_footnote(footnote = pre_units_footnote,
                   locations = gt::cells_column_spanners(spanners = "unit_span")) |>
  gt::tab_footnote(footnote = pre_outcome_footnote,
                   locations = gt::cells_column_spanners(spanners = "outcome_span")) |>
  gt::tab_footnote(footnote = pre_treatment_footnote,
                   locations = gt::cells_column_spanners(spanners = "treatment_span")) |>
  # Per-row causal-effect footnote on the second non-missing unit (row 2).
  gt::tab_footnote(footnote = pre_effect_footnote,
                   locations = gt::cells_body(columns = `Candidate`, rows = 2)) |>
  gt::opt_css(
    css = "
      #preceptor_tbl .gt_footnote {
        max-width: 1px;
        word-break: break-word;
      }
    "
  ) |>
  gt::as_raw_html()

cat(
  "```{=html}\n",
  '<div style="display: inline-block; width: auto; max-width: 100%;">',
  pre_gt_html,
  "</div>\n",
  "```\n",
  sep = ""
)
```

**Causal with an additional covariate.** When the question asks about effect heterogeneity (e.g., *"and how does that effect vary by hometown?"*), add a `Covariate` or `Covariates` spanner to the right of `Treatment` with the moderator column(s). The treatment footnote still describes only the treatment; the covariate(s) footnote describes the non-treatment covariate(s) and notes why they are in the table (typically: *"shown because the question asks whether the effect varies across it"*).

**Causal → Predictive.** When a question is restated in predictive form (*"what is the connection between X and the treatment variable?"* instead of *"what is the causal effect of the treatment on X?"*), the table simplifies: the `Treatment` spanner disappears, the former treatment column moves under `Covariate(s)`, the two potential-outcome columns collapse to one observed `Outcome` column, the hatch goes away, and the per-row effect footnote goes away. If the causal question had both a treatment and an additional moderator covariate, the predictive version has both as covariates under a single plural `Covariates` spanner.

### 10.4 Population Table

**Principle.** The Population Table bridges between the data we have and the Preceptor Table's unobservable truth. Each row is one unit at one point in time, drawn from the broader population both the data and the Preceptor Table sample from. Its footnotes discuss the data: where it came from, how it was measured, and how observed columns relate to the ideal ones in the Preceptor Table. This is the table where validity, stability, representativeness, and (for causal models) unconfoundedness become visible — they are the assumptions that let us move *from* Data rows *to* Preceptor rows.

**Structure.** Eleven rows, with a leading `Source` column (not under any spanner) that takes values `"Data"`, `"Preceptor"`, or `"..."`. The body columns are the same as the Preceptor Table's — same spanners, same labels, same singular-plural rules — with one addition: the `Unit` spanner becomes `Unit/Time`.

- **Unit/Time spanner (two columns).** In the Population Table, time is explicit because Data rows and Preceptor rows typically come from different moments. The first column identifies the unit (`Commuter`, `Candidate`, `Senator`); the second column holds the year (or other time unit). Spanner ID stays `unit_span`.
- All other spanners follow the Preceptor Table's rules verbatim: `Outcome` (predictive) or `Potential Outcomes` (causal); `Treatment` (causal only, one column, its own spanner); `Covariate` / `Covariates` (singular when one, plural when two or more; present only when the question requires non-treatment covariates). No `More` column.

**The two kinds of blank row.** This is subtle but matters:

- **Separator blanks** (rows 1, 6, 11). Every cell is `"..."`, *including* `Source`. These represent the rest of the population the Data and Preceptor blocks are drawn from.
- **Middle-of-block blanks** (rows 4 and 9). Content cells are `"..."`, but `Source` keeps its value — `"Data"` in row 4, `"Preceptor"` in row 9. These say "more rows of this kind."

Full layout:

| Row | Source        | Content                              |
|-----|---------------|--------------------------------------|
| 1   | `"..."`       | separator, all `"..."`               |
| 2   | `"Data"`      | observed data row                    |
| 3   | `"Data"`      | observed data row                    |
| 4   | `"Data"`      | middle blank, content cells `"..."`  |
| 5   | `"Data"`      | observed data row                    |
| 6   | `"..."`       | separator, all `"..."`               |
| 7   | `"Preceptor"` | Preceptor row                        |
| 8   | `"Preceptor"` | Preceptor row                        |
| 9   | `"Preceptor"` | middle blank, content cells `"..."`  |
| 10  | `"Preceptor"` | Preceptor row                        |
| 11  | `"..."`       | separator, all `"..."`               |

**How unobservable potential outcomes are marked differs by row block.** This is the central distinction that makes the Population Table do its work.

- **Data rows (causal).** Only one potential outcome was actually measured — the one corresponding to the treatment the unit received. The other is shown as `"..."` because no one observed it. *Never* `"?"`; `"?"` is not used anywhere in our table system.
- **Preceptor rows (causal).** Both potential outcomes are filled in with their true values, and the unobservable one for each row is rendered with a diagonal cross-hatch — the same convention as the Preceptor Table. Hatch says "this value exists and is filled in with the truth, but no empirical process could ever recover it."

The two marks differ because the underlying claims differ: Data `"..."` means "we don't have this value"; Preceptor hatch means "the truth exists and is shown, but it's unobservable in reality." The outcome footnote spells this out.

**Track Preceptor rows from the Preceptor Table.** Use the same units, in the same order, with the same values, as the three example rows from the question's Preceptor Table. Readers should see identical identities across both tables.

**Footnotes.** Five, with a sixth (the per-row causal-effect footnote) carrying over from the Preceptor Table. All of these discuss the data and how it relates to the Preceptor Table — they are *not* question-clarifying footnotes.

- *Title footnote*: how this table combines the specific data source with the Preceptor Table's rows, and the broader population both are drawn from. Name the data source.
- *Unit/Time footnote*: discusses both the unit and the time. For Data rows: who the subjects were, roughly how many, when and where. For Preceptor rows: who we want to answer about, roughly how many, when. Note the gap between the two (different era, different geography, etc.) — this is the representativeness discussion.
- *Outcome footnote*: documents the measurement of the outcome in the data, any rescaling to match the Preceptor Table's scale, and explains the `"..."` (Data rows) vs. hatch (Preceptor rows) convention for unobservable potential outcomes. For causal models, connects to validity.
- *Treatment footnote* (causal only): describes how the treatment was realized in the Data rows (a randomized experiment, an observational measure, etc.) and what the treatment means in the Preceptor rows. If the two treatment operationalizations differ — and they usually do — say so; this is a validity and unconfoundedness issue.
- *Covariate(s) footnote* (when the spanner is present): documents the covariate data sources, any measurement differences between Data and Preceptor rows, and any non-overlap between the values seen in Data vs. Preceptor rows.
- *Per-row causal-effect footnote* (causal only, **Easy tier only — dropped in Medium and Difficult**, carries over from the Preceptor Table; see §1.3 *Worked example: Preceptor Table and Population Table footnote sophistication*). Attached to the same Preceptor unit as in the Preceptor Table — by default, the second non-missing Preceptor row. Because Preceptor rows show the unobservable truth with both potential outcomes filled in, the arithmetic still works. The row number changes: in the Preceptor Table the footnote sat on row 2; in the Population Table it typically sits on row 8.

**Causal template.** Using a flat 11-row `tribble()` keeps the visual layout aligned with the rendered table row for row.

```r
hatch <- function(x) {
  paste0(
    '<span style="background-image: repeating-linear-gradient(',
    '45deg, rgba(0,0,0,0.12) 0 1px, transparent 1px 6px);',
    ' padding: 6px 10px; margin: -6px -10px; display: block;">',
    x,
    '</span>'
  )
}

population_tibble <- tibble::tribble(
  ~Source    , ~`Commuter`       , ~`Year`, ~`Attitude if Exposed`, ~`Attitude if Not Exposed`, ~`Spanish Exposure`, ~`Hometown`    ,
  "..."      , "..."             , "..."  , "..."                 , "..."                     , "..."              , "..."          ,
  "Data"     , "Sarah Thompson"  , "2012" , "12"                  , "..."                     , "Exposed"          , "Evanston"     ,
  "Data"     , "Michael Chen"    , "2012" , "..."                 , "8"                       , "Not exposed"      , "Oak Park"     ,
  "Data"     , "..."             , "..."  , "..."                 , "..."                     , "..."              , "..."          ,
  "Data"     , "Rebecca Johnson" , "2012" , "14"                  , "..."                     , "Exposed"          , "Highland Park",
  "..."      , "..."             , "..."  , "..."                 , "..."                     , "..."              , "..."          ,
  "Preceptor", "Patrick Sullivan", "2026" , "11"                  , "10"                      , "Not exposed"      , "Milton"       ,
  "Preceptor", "Karen Walsh"     , "2026" , "13"                  , "10"                      , "Exposed"          , "Arlington"    ,
  "Preceptor", "..."             , "..."  , "..."                 , "..."                     , "..."              , "..."          ,
  "Preceptor", "Marcus Lee"      , "2026" , "9"                   , "9"                       , "Not exposed"      , "Somerville"   ,
  "..."      , "..."             , "..."  , "..."                 , "..."                     , "..."              , "..."
)

pop_title_footnote     <- "This table combines data from Enos (2014) with the Preceptor Table's 2026 Boston-area riders, drawn from the same broader population of adult commuter-rail riders exposed to platform conversations."
pop_units_footnote     <- "Each row is a commuter-rail rider at a specific time. Data rows are individual participants in Enos's 2012 Chicago-area Metra-platform experiment, roughly 100 in total. Preceptor rows are 2026 Boston-area MBTA commuter-rail riders, roughly 50,000 on a weekday. The 14-year gap and the city difference are a representativeness question the model must address."
pop_outcome_footnote   <- "Attitude toward immigration on an integer scale from 3 to 15, where higher values indicate stronger opposition. Enos's original measure was a three-item immigration-policy index that we rescale to this range. In Data rows, only one potential outcome was observed — the one the subject actually experienced; the other is shown as '...' because no one measured it. In Preceptor rows, both potential outcomes are filled in (the unobservable one hatched), because Preceptor rows show the unobservable truth."
pop_treatment_footnote <- "In Data rows, Spanish Exposure is whether the subject was on a Chicago Metra platform during Enos's two-week treatment window, when Spanish-speaking confederates rode the same morning trains. In Preceptor rows, Spanish Exposure is whether the 2026 MBTA rider stood on a platform where other commuters conducted an extended Spanish-language conversation at conversational volume. These are not the same physical manipulation; the model must assume they act comparably on attitude (validity)."
pop_covariate_footnote <- "Hometown is the municipality each rider lists as primary residence. Chicago-area suburbs (Evanston, Oak Park, Highland Park) appear in the Data block; Boston-area suburbs (Milton, Arlington, Somerville) in the Preceptor block. The two hometown sets do not overlap, a representativeness issue the model must address."
pop_effect_footnote    <- "The causal effect for Karen Walsh is the difference between her two potential outcomes: 13 − 10 = 3 points on the 3–15 scale. Because the Preceptor rows show the unobservable truth, this is the true causal effect for her, not an estimate."

pop_gt_html <- gt::gt(population_tibble, id = "population_tbl") |>
  gt::tab_header(title = "Population Table") |>
  gt::tab_spanner(label = "Unit/Time"         , id = "unit_span",
                  columns = c(`Commuter`, `Year`)) |>
  gt::tab_spanner(label = "Potential Outcomes", id = "outcome_span",
                  columns = c(`Attitude if Exposed`, `Attitude if Not Exposed`)) |>
  gt::tab_spanner(label = "Treatment"         , id = "treatment_span",
                  columns = c(`Spanish Exposure`)) |>
  gt::tab_spanner(label = "Covariate"         , id = "covariates_span",
                  columns = c(`Hometown`)) |>
  gt::cols_align(align = "left" , columns = c(`Source`, `Commuter`, `Spanish Exposure`, `Hometown`)) |>
  gt::cols_align(align = "right", columns = c(`Year`, `Attitude if Exposed`, `Attitude if Not Exposed`)) |>
  gt::fmt_markdown(columns = gt::everything()) |>
  gt::tab_options(
    heading.title.font.size   = "1.5em",
    heading.title.font.weight = "bolder",
    column_labels.font.weight = "normal"
  ) |>
  gt::tab_style(
    style     = gt::cell_text(weight = "bold"),
    locations = gt::cells_column_spanners()
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "left"),
    locations = gt::cells_column_spanners(spanners = c("unit_span", "treatment_span", "covariates_span"))
  ) |>
  gt::tab_style(
    style     = gt::cell_text(align = "right"),
    locations = gt::cells_column_spanners(spanners = "outcome_span")
  ) |>
  # Hatch Preceptor rows' unobservable potential outcomes.
  # Rows 7 & 10 ("Not exposed") → "Attitude if Exposed" is unobservable.
  # Row 8  ("Exposed")           → "Attitude if Not Exposed" is unobservable.
  gt::text_transform(
    locations = gt::cells_body(columns = `Attitude if Exposed`, rows = c(7, 10)),
    fn        = function(x) hatch(x)
  ) |>
  gt::text_transform(
    locations = gt::cells_body(columns = `Attitude if Not Exposed`, rows = 8),
    fn        = function(x) hatch(x)
  ) |>
  gt::tab_footnote(footnote = pop_title_footnote,
                   locations = gt::cells_title()) |>
  gt::tab_footnote(footnote = pop_units_footnote,
                   locations = gt::cells_column_spanners(spanners = "unit_span")) |>
  gt::tab_footnote(footnote = pop_outcome_footnote,
                   locations = gt::cells_column_spanners(spanners = "outcome_span")) |>
  gt::tab_footnote(footnote = pop_treatment_footnote,
                   locations = gt::cells_column_spanners(spanners = "treatment_span")) |>
  gt::tab_footnote(footnote = pop_covariate_footnote,
                   locations = gt::cells_column_spanners(spanners = "covariates_span")) |>
  # Per-row causal-effect footnote on the second non-missing Preceptor row
  # (Karen Walsh, row 8 under the Population Table layout).
  gt::tab_footnote(footnote = pop_effect_footnote,
                   locations = gt::cells_body(columns = `Commuter`, rows = 8)) |>
  gt::opt_css(
    css = "
      #population_tbl .gt_footnote {
        max-width: 1px;
        word-break: break-word;
      }
    "
  ) |>
  gt::as_raw_html()

cat(
  "```{=html}\n",
  '<div style="display: inline-block; width: auto; max-width: 100%;">',
  pop_gt_html,
  "</div>\n",
  "```\n",
  sep = ""
)
```

**Predictive variant.** Three changes from the causal template:

1. The outcome spanner holds a single column and is labeled `"Outcome"`. No hatch, no `"..."` for unobservable potential outcomes — predictive rows have one observed outcome each.
2. Drop the `Treatment` spanner and the treatment footnote. The former treatment, if the question keeps it, moves under `Covariate(s)`.
3. Drop the per-row causal-effect footnote. Predictive tables have no causal effect to display.

**Causal with an additional covariate.** When the question requires conditioning on a non-treatment variable (as in the Enos example with Hometown), the `Covariate` spanner becomes `Covariates` and spans all the non-treatment covariate columns. Treatment stays in its own spanner. Extend the covariate footnote to document each covariate's data provenance in turn.

---

