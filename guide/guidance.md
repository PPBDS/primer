# Primer authoring guide — Author guidance (§14)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference still resolves via that map.

---

## 14. Guidance for tutorial authors

General rules and patterns pulled from the template that apply across exercises, rather than to any one exercise.

### 14.1 Answers that students read closely

Students read our `message` text as closely as they read anything in the tutorial. They compare their own answer to ours. Make our answer excellent. This is especially true for Justice answers about validity, stability, representativeness, and unconfoundedness — students look here for examples of how to reason about assumptions.

Where a knowledge drop has two components — a universal truth and a problem-specific example — separate them when practical. The universal truth belongs in §12. The problem-specific piece is written per-tutorial.

### 14.2 Build understanding in steps, not one giant prompt

*(Superseded in mechanism by the base guide's `analysis.qmd` model; the pedagogical intent survives.)* Students no longer build objects line-by-line in exercise chunks, and there is no "type `fit_<n>` and hit Run Code." Instead, follow the base guide's *Exercise rhythm*: prefer several small AI-prompted edits to `analysis.qmd` — inspect the data, build a rough version, refine it — over one large prompt that produces the finished object in a single step. For a key object you want understood in parts (e.g. the fitted DGM), break the path into steps the student renders and examines along the way, rather than asking for the whole thing at once.

### 14.3 Show the plot, don't show the code

*(Folded into §14.12 *Visualization house style*; preserved as a number-only stub so internal `§14.x` cross-references elsewhere in this file keep their indices.)*

### 14.4 Iterative summary paragraph

The summary paragraph is built up across the tutorial:

- Wisdom Exercise 11: first two sentences (topic; data + question).
- Justice Exercise 16: add a weakness sentence.
- Courage Exercise 16: add a model-structure sentence.
- Temperance Exercise 13: add the final sentence with a QoI and uncertainty.

After each addition, the student updates their QMD and renders.

**Commit/push cadence — explicit override of the base guide.** The base guide's default is a commit at the end of every topic section. The Primer overrides this: it commits exactly **twice** — once after **Justice**, and once at the **end** of the tutorial. The Wisdom and Courage summary-paragraph additions are rendered but not committed; the next commit folds them in. Two commits keyed to natural milestones — the assumptions are settled after Justice, the artifact is finished at the end — are enough, and avoid commit-churn across six sections.

### 14.5 Test chunks for marginaleffects calls

For `predictions()` and `plot_predictions()` exercises, include a `-test` chunk. These calls sometimes break with package updates; the test chunk is how we catch that.

### 14.6 Virtue section openers

**Preambles do not describe what the virtue does.** That job belongs to the first exercise of each virtue section, which asks the student to describe the virtue's components using the canonical Key Concepts wording (Wisdom begins with a question…; Justice concerns the Population Table…; Courage creates the data generating mechanism; Temperance interprets the DGM…). The preamble must not pre-empt this — no "In Wisdom we will build a Preceptor Table," no "Justice is the virtue of asking hard questions about the data," no "Temperance uses the model to answer the question." Those sentences take the work out of the student's mouth.

What the preamble is for is spelled out in §5.5: it reprints the upstream artifacts this virtue needs (the Preceptor Table, the data table, the Population Table, the fitted DGM, etc.) so the section is usable by a reader who skipped or forgot what came before. Preamble prose stays tight and specific to *this problem* — naming the dataset, restating the question, showing the Preceptor Table — and leaves the virtue-level generalities to the first exercise.

Section-opening **quotes** are retired. Earlier tutorials opened each virtue with an inspirational aphorism (Tukey, Parker, Goethe, etc.); we no longer do. Knowledge-drop quotes *inside* exercises — Tukey, Engerman, the Rumsfeld-style aphorisms listed in §12 — remain part of the tutorial toolkit. This rule concerns only the section-opening slot.

### 14.7 Keep control of the question and the model

Even when an exercise asks the student to propose a question or a model, the tutorial always closes that exercise with *our* canonical answer, and the student uses our answer for the rest of the tutorial. Subsequent exercises — Preceptor Tables, Population Tables, the fitted model, parameter interpretation, summary paragraph — depend on everyone being anchored to the same question and the same model. If each student drifted to their own version, later exercises would lose their scaffolding and knowledge drops downstream would stop making sense.

The pattern:

1. A written-without-answer exercise (§7.3) lets the student propose freely.
2. A follow-up written-with-answer exercise (§7.2) displays our canonical version in the `message =` field.
3. Explicit closing language: *"This is the question (or model) we will use going forward."*

This is not a progression — it applies at every level (Easy / Medium / Difficult). What varies across levels is the sophistication of the proposal exercise, not whether the tutorial ultimately anchors the proposal to our canonical answer.

### 14.8 When to skip exercises

Predictive tutorials skip the unconfoundedness exercises (Justice 11 and 12). Models with no interpretable parameters (random forests, neural nets) replace Courage's three-fit interpretation block (§13.4 Exercises 3–8) with a single exercise that ensures the student understands the parameters aren't directly interpretable. Non-linear link-function models (logistic, multinomial, cumulative, Poisson) *keep* the Courage interpretation block but redirect each interpretation question away from asking students to produce link-scale coefficient interpretations directly; see §13.5 *Interpretability ceiling by model family* for the rules.

Operational exercises can be abbreviated in later tutorials once students have done them a few times. The first time through, migrate as-is. By tutorial 09+, the `library(broom)` exercise (Justice 14) can be much shorter.

### 14.9 Rounding consistency for parameter tables

Every **author-shown** parameter table in a tutorial — each Courage interpretation exercise's preamble table (§13.4 Exercises 4, 6, 8 in the three-fit pattern), the Temperance preamble's `tidy()` display, the concrete DGM math, and any other place a parameter is quoted — uses the **same rounding**. Numeric values that appear in exercise `message` text (the canonical answer) must match the rounded display — no "the intercept is 162.18" in the prose while the table shows 163, and no "the intercept is 163" in the prose while the table shows 162.9.

One rounding, one tutorial, everywhere the reader sees parameters. A student who compares their answer to ours should not get tripped up by mismatched digits.

**Resolution must be finer than the standard error.** A blanket `signif(3)` is *wrong* whenever a coefficient's magnitude is much larger than its standard error — the intercept and the upper CI bound collapse to the same displayed value. Concrete failure: NHANES height regression has intercept 162.94 with CI [162.38, 163.49]; `signif(3)` displays 163 / 162 / 163, with the estimate matching its own upper bound. The student looks at the table and cannot tell what the model actually says.

**Default: round to a fixed number of decimal places, chosen so estimate and CI bounds stay visibly distinct in every row.** Practically this means looking at the smallest standard error (or CI half-width) in the table and picking decimal places one finer than that:

| Smallest SE in table | Decimal places | Helper |
|---|---|---|
| ≥ 0.5 (e.g. NHANES, Trains) | 1 | `mutate(across(where(is.numeric), \(x) round(x, 1)))` |
| 0.05 – 0.5 (e.g. logistic log-odds) | 2 | `round(x, 2)` |
| 0.005 – 0.05 (e.g. Colleges grad-rate proportions) | 3 | `round(x, 3)` |
| smaller | 4+ | `round(x, 4)` etc. |

Use `round(x, n)` with a fixed `n` rather than `signif(x, 3)`. Sig figs are misleading on regression output: each row's *natural precision* is set by its standard error, not by the magnitude of the estimate. Within a row, the same decimal-place precision is applied to estimate, conf.low, and conf.high; across rows in the same table, the decimal-place count stays the same so the visual alignment of the columns is preserved.

**Per-row variation is allowed.** When a single table mixes coefficients with very different magnitudes (e.g. the residual variance σ² alongside log-odds coefficients), the global decimal-place rule will over-precise some rows and under-precise others. The fix is to render σ² (or any anomalous row) in its own block, formatted appropriately, rather than to force all rows to the same `round(n)` call. The principle is: **each row's rounding must keep its estimate and CI distinguishable** — when the global rule fails for one row, that row gets its own treatment.

**Concrete numbers in LaTeX and prose match the table.** The concrete DGM in the Temperance preamble (`$\hat{Y} = 162.9 + 13.6 \cdot X + \epsilon$`) carries the same digits the parameter table shows. The Temperance exercise prompts that quote a number ("Write a sentence interpreting the 162.9 estimate") and their canonical answers ("The expected value is 162.9 centimeters") match too. Verbal rounding in the *summary paragraph* — "about 163 cm" — is OK because it is explicitly verbal, but the concrete formulas and the canonical exercise answers are not the place for that.

The one exception is a **student-written code exercise** whose point is to teach `tidy()` itself (e.g. the Courage exercise where the student pipes into `tidy(conf.int = TRUE)` for the first time). There, the raw unrounded output is what `tidy()` actually produces; adding `round()` would muddy the learning goal. After that one teaching exercise, every subsequent display of parameters uses the chosen rounding.

### 14.10 Package-name formatting

**This rule applies everywhere in book content and tutorial prose** — chapters, miscellaneous chapters, appendices, and tutorial Rmd files alike. In prose (not in code), R package names use **bold + link to the package's home page**: **[primer.data](https://github.com/PPBDS/primer.data)**, **[tidymodels](https://www.tidymodels.org/)**, **[broom](https://broom.tidymodels.org/)**, **[marginaleffects](https://marginaleffects.com/)**. Do not surround package names with backticks unless they appear inside actual code — backticks are for code identifiers (object names like `nhanes`, function names like `tidy()`), not for package names in running text.

Prefer the package's own documentation site or GitHub page over CRAN. CRAN URLs are fallbacks when no dedicated homepage exists.

Canonical homepages the tutorials and chapters reference most often:

| Package | Homepage |
|---|---|
| primer.data | `https://github.com/PPBDS/primer.data` |
| primer.tutorials | `https://ppbds.github.io/primer/tutorials/` |
| tutorial.helpers | `https://ppbds.github.io/tutorial.helpers/` |
| vscode.tutorials | `https://ppbds.github.io/vscode.tutorials/` |
| tidyverse | `https://www.tidyverse.org/` |
| tidymodels | `https://www.tidymodels.org/` |
| broom | `https://broom.tidymodels.org/` |
| marginaleffects | `https://marginaleffects.com/` |
| easystats | `https://easystats.github.io/easystats/` |
| learnr | `https://rstudio.github.io/learnr/` |
| knitr | `https://yihui.org/knitr/` |
| gt | `https://gt.rstudio.com/` |

For prose mentions of `primer.tutorials`, the canonical URL is the package's web page at `https://ppbds.github.io/primer/tutorials/` (a subpath of the book's pkgdown site). The package's *source code* lives at `https://github.com/PPBDS/primer/tree/main/primer.tutorials` --- a subdirectory of the `primer` monorepo, not a separate repo --- but the source URL is for code references, not for the bold-and-link mention. Use the pkgdown URL in prose; use the GitHub subdirectory URL only when linking to the README or to a specific source file. Do not link to `github.com/PPBDS/primer.tutorials`; that URL does not exist.

Exceptions: inside `library(packagename)` code, ggplot `caption = "Source: … via primer.data"` strings, and other literal-code contexts, the package name is plain (no bold, no link, no backticks beyond what the code syntax itself implies) because markdown does not render inside those contexts.

### 14.11 Conciseness in knowledge drops

Every sentence a student reads in a knowledge drop should earn its place. Verbosity is the enemy. Common traps to avoid:

- **Self-negating clauses** — *"X is the habit we want to build, not the habit you have to justify."* The "not the habit..." tail adds no information. Cut it; keep the positive statement.
- **Meta-narration about the tutorials** — *"You will see this shorthand throughout the tutorials."* Students figure it out; don't narrate the experience. Cut.
- **Hedging filler** — *"It might be worth noting that..."*, *"As we mentioned before..."*, *"It is important to recognize that..."*. None of these add content; each just delays the point.
- **Restating what just happened** — *"Now that you have loaded the library, let's proceed to the next step."* The exercise flow makes this obvious; don't spell it out.

The test: can you delete the sentence and lose information? If no, delete it. Knowledge drops are short on purpose — §6.4 says "Students won't read more than two sentences at a time." Every sentence is precious real estate.

**Every drop must teach chapter content.** Per the base tutorial guide's *Knowledge drops* rule, recycled / default / process drops do not belong in post-infrastructure tutorials, and Primer tutorials are post-infrastructure (`vscode.tutorials` covers infrastructure). If an operational exercise has no natural chapter-content drop, find one — forecast a coming concept, define a term the body section will use, name a tool a later exercise will rely on — but never fall back to a generic process drop (cloud, spaced repetition, CP/CR explanations, "what tidyverse is"). Those are vscode.tutorials material; the student has already seen them. The retired drops in §12.1, §13.1 Ex 1/Ex 2 Ends, and Theme 2 (§12.6) are listed as historical record so authors recognize them in legacy tutorials and sweep them out, not as a menu to reach for.

### 14.12 Visualization house style

Every student-produced plot (EDA in Wisdom, final plot in Temperance) should use the same four-slot layout:

- **Title**: the key variables being shown. E.g., *"Height by Sex Among USMC Recruits"*. Short, declarative, identifies what is being plotted.
- **Subtitle**: the *takeaway* — the one thing a reader should remember from the plot. E.g., *"Male recruits are on average about 16 cm taller than female recruits"*. Subtitles are the plot's thesis; without one, a plot just "shows data."
- **Caption**: the data source. E.g., *"Source: NHANES via primer.data"*. Include the year range when relevant.
- **Axis labels**: human-readable, with units. E.g., *"Height (cm)"* rather than *"height"*. Capitalization normal-case unless proper nouns.

Legend labels follow the axis rule (human-readable, units where relevant). When a scale is categorical, use `str_to_title()` on the raw data before plotting so the legend shows *"Black / White"* rather than *"black / white"* (§13.2 data-prep patterns).

`ggplot2::theme_minimal()` or `theme_classic()` is the default — tutorials should not ship custom themes. Color scales inherit from ggplot defaults unless a specific palette is pedagogically necessary (e.g. a red-blue political scale for voter-behavior plots).

**Show the plot, not the code.** For any author-rendered plot (EDA in Wisdom, the model-checking plot in Courage, the final plot in the Summary), use `#| echo: false` so the student sees the output but not the code. Author-rendered plots are deliverables, not lessons in ggplot — the lesson lives in the student-facing exercise that *generates* the plot via AI prompting.

**AI-assisted plotting.** Most tutorials ask students to prompt AI for the plot code (§9) rather than build up ggplot layer-by-layer. When the author shows "our version" of the plot after the student exercise, that reference plot should obey the four-slot rule above so students see what "good" looks like.

**Density plots: drop the y-axis entirely.** A density plot's y-axis values (the kernel-density-estimate height) carry no information a student can use — the numbers are abstract, the absolute scale isn't interpretable, and the message lives entirely in the *shape* of the curve and the x-axis. Strip the y-axis label, ticks, and tick text:

```r
recruits |>
  ggplot(aes(x = height)) +
  geom_density(fill = "grey70", color = "grey30") +
  labs(
    title    = "Height in Our 50-Recruit Sample",
    subtitle = "A heavy left shoulder hints that sex matters",
    x        = "Height (cm)",
    y        = NULL,
    caption  = "Source: 50-row sample from NHANES via primer.tutorials::recruits"
  ) +
  theme_minimal() +
  theme(axis.text.y  = element_blank(),
        axis.ticks.y = element_blank())
```

This applies to every `geom_density()` plot the curriculum produces — EDA plots, by-group overlays, model-checking comparisons of actual-vs-fitted distributions, etc. Do **not** label the y-axis "Density" — the word means nothing to students at this stage of the curriculum, and having a numeric y-axis present invites readers to try to read values off of it that cannot be meaningfully interpreted. Histograms (`geom_histogram()` with raw counts) keep the y-axis because counts *are* meaningful; the rule above is density-specific.

**Format proportions and rates as percentages on axes.** When a variable is a proportion (graduation rate, probability, share), display its axis labels as percentages, not decimals:

```r
scale_x_continuous(labels = scales::label_percent())
```

`50%` is more legible than `0.5` for a general reader, harmonizes with the subtitle when the subtitle says *"50% to 80%"*, and matches the way the variable is described in everyday speech. Apply on whichever axis (x or y) shows the proportion. The underlying data values stay as proportions (0–1); `label_percent()` only affects the displayed tick labels.

**Format dollar amounts and other "human" units in the axis labels themselves.** When a variable is in raw units that aren't human-friendly — e.g. `tuition` in `colleges` is stored in units of $10,000, so a value of 3 means $30,000 — apply a `scales::label_*()` formatter so the tick labels read in the units a person uses to discuss the variable:

```r
# tuition stored in $10,000 units; show $20,000, $30,000, etc.
scale_x_continuous(labels = scales::label_dollar(scale = 10000))
```

When the formatter handles the units, the axis title can drop the parenthetical unit annotation: prefer `x = "Tuition"` over `x = "Tuition ($10,000)"`. The dollar amounts appear in the tick labels themselves; restating the unit in the title is redundant. The general rule: **the axis labels should read the way a person would say the value out loud** — `$30,000`, `50%`, `175 cm`, `2014` — not the way the variable happens to be encoded in the tibble. Useful `scales::label_*()` helpers: `label_dollar()`, `label_percent()`, `label_comma()`, `label_number(suffix = " cm")`, `label_date()`.

**Do not write a knowledge drop after a plot.** The plot's title and subtitle carry the takeaway; the EDA exercise ends when the student has seen the plot. Don't append a paragraph that re-narrates the plot ("the distribution is broad, with a peak around …", "the jitter plot shows N individual scores, the means confirm…"). If the plot's message isn't visible in the picture itself, fix the plot — usually by sharpening the subtitle. Save prose for places where it does pedagogical work that the picture cannot. This rule applies uniformly: EDA plots in the Introduction and in Wisdom, model-checking plots in Courage, and the final plot in Temperance / Summary all stand on their own.

What this rule **does not** prohibit:
- A short *lead-in* before the plot that orients the student ("One way to check the model is to compare actual and fitted distributions"). The rule is about post-plot prose, not pre-plot prose.
- The next exercise's content, which begins immediately under the next `### Exercise N` header. The flow is: prose lead-in → plot → next exercise. No drop in between.

**Do not ship cargo-culted helpers.** Examples flagged in past tutorials include `tidytext::scale_x_reordered()` with a comment like `# Needed (?)` — if an author is unsure whether a helper function is necessary, they should test both with and without it and commit the simpler one. A tutorial is not the place to debug dependency uncertainty.

### 14.13 LaTeX formatting for concrete DGM formulas

Concrete-DGM formulas (the §13.4 Exercise 16 author-shown formula in Courage, the §13.5 Temperance preamble *As a mathematical formula:* block) almost always need to wrap and need careful handling of variable names that contain underscores. Two rules:

**Rule 1: avoid `\text{var\_name}` for variable names with underscores in math mode.** Even when escaped correctly as `\text{grad\_rate}`, the rendered output sometimes shows the literal backslash (`grad\_rate`) instead of the underscore. The cleanest fix is to use a human-readable form of the variable name with no underscores: `\text{Graduation Rate}` (with a space, capitalized) instead of `\text{grad\_rate}`. The math-mode label is for the *reader*, not the *computer*; the underscore-bearing tibble name is in the R code blocks above and below.

For a *predicted* outcome, use `\widehat{\text{Graduation Rate}}` (the wide-hat version, which spans multi-character text properly), not `\hat{\text{grad\_rate}}`.

**Rule 2: wrap long formulas with `\begin{aligned}`.** A concrete-DGM formula with five or six terms doesn't fit on a single rendered line; it overflows the column or wraps at unhelpful places. Use `aligned` to break it across lines at sensible places (after the intercept, after each term, etc.):

```latex
$$
\begin{aligned}
\widehat{\text{Graduation Rate}} =\ & 0.487 + 0.090 \cdot \text{Tuition} \\
&{} - 0.078 \cdot \text{Highly Selective} \\
&{} - 0.128 \cdot \text{Moderately Selective} \\
&{} - 0.213 \cdot \text{Lowly Selective} \\
&{} - 0.205 \cdot \text{Non-selective}
\end{aligned}
$$
```

The `&` aligns the continuation lines below the first `=`-sign or just after the right-hand-side begins. The `{}` after the `&` on continuation lines tells LaTeX to treat the leading `-` as a binary operator (proper spacing) rather than a unary minus. Each `\\` is a line break in display math.

For the *un-hatted* version with `+ \epsilon` (Temperance preamble's "as a mathematical formula"), the same wrapping applies. Drop the `\widehat{...}` and append `+ \epsilon` on the last line, before `\end{aligned}`.

A formula with three or fewer terms (e.g. NHANES `height ~ sex` has just two parameters) can stay on a single line without `aligned`. The threshold is rough: when the formula has more than ~3 RHS terms or any single term-label is verbose, switch to `aligned`.

