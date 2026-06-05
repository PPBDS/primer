# Primer authoring guide — Authoring tutorials (§3, §5–§7, §9, §15)

> **Primer tutorials follow the base tutorial guide ([`tutorials/CLAUDE.md` in PPBDS/ai-rules](https://github.com/PPBDS/ai-rules/blob/main/claude-md/tutorials/CLAUDE.md)) by default; this file only adds Primer specifics or records explicit overrides.**

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.

---

## 3. Output artifacts and file conventions

Chapters are Quarto files with the top-level `#` already set by the book structure; use `##` for virtue-level sections. Filename convention: `NN-name.qmd` where `NN` is the two-digit chapter number and `name` is the dataset (for example chapters) or a descriptive slug (for miscellaneous chapters) — e.g. `04-cardinal-virtues.qmd`, `08-trains.qmd`, `13-colleges.qmd`.

Tutorials are R Markdown files with `learnr::tutorial` output. They live in the `primer.tutorials` package under `inst/tutorials/NN-name/tutorial.Rmd`, where `NN` is the two-digit chapter number (e.g. `05-recruits`, `13-ces`). The tutorial's `id` in the YAML is `NN-name`, lowercase, dashes for spaces, identical to the directory name. For example tutorials, `name` is the tibble the tutorial fits on — usually the upstream dataset's name (`trains`, `nes`, `governors`, `shaming`, `ces`, `colleges`, `stops`), but a *role-based* name when the tutorial ships its own packaged cut (`recruits` for the NHANES cut in `05-recruits`; see §3.1). Student repo names in operational exercises match the tutorial directory name, so everything (directory, id, repo, packaged tibble where applicable) shares one string per tutorial.

For new chapters, produce a single `.qmd` file. For new tutorials, produce a single `.Rmd` file with the structure described in §5. Do not emit partial diffs; produce complete files David can drop in place.

**Creating a new tutorial directory.** When authoring a new example tutorial from scratch, create the directory and its contents explicitly — do not assume they exist. The surviving tutorials in `inst/tutorials/` are the four misc ones (01–04) plus `99-project`; every example tutorial (05–16) starts from an empty directory.

Minimum layout for a new tutorial — run these creations in order when starting fresh:

1. `mkdir -p primer.tutorials/inst/tutorials/NN-name` — the tutorial directory.
2. Create `primer.tutorials/inst/tutorials/NN-name/tutorial.Rmd` — the tutorial file, with the full structure from §5 (YAML header, setup chunk, the two child-document inclusions, virtue sections, exercises, Summary, download-answers child document).

**Additional structure for tutorials with an expensive fit** (per §5.6 — `**Expensive fit:** Yes` in the §17 entry):

3. `mkdir -p primer.tutorials/inst/tutorials/NN-name/data-raw` — holds the `prefit.R` script that regenerates the stored fit.
4. Create `primer.tutorials/inst/tutorials/NN-name/data-raw/prefit.R` — runnable R script that fits the model and writes `../data/fit_<n>.rds`. Header comment should record the package versions used to fit.
5. `mkdir -p primer.tutorials/inst/tutorials/NN-name/data` — holds the `.rds` output.
6. Run `Rscript data-raw/prefit.R` from the tutorial directory to generate the `.rds` — do *not* commit the `.rds` unless the fit genuinely needs caching and its size is reasonable. The `.rds` is what the setup chunk loads via `readRDS(system.file(...))`.

Tutorials **without** an `**Expensive fit:**` flag should not create the `data/` or `data-raw/` subdirectories. An empty-or-almost-empty `data/` is a code smell — per §5.6, authors reviewing existing tutorials should delete unreferenced `.rds` files on sight.

**Directory-creation is explicit, not implicit.** When an authoring session generates a new tutorial, it should issue the `mkdir` calls (or the equivalent file-creation moves) as part of the generation workflow. Do not assume a tutorial directory exists just because §17 lists it — if the filesystem check fails, create the directory, then write the `tutorial.Rmd`.

### 3.1 Tutorial-specific datasets shipped with `primer.tutorials`

Some tutorials need a curated cut of an upstream dataset rather than the full upstream tibble — to make uncertainty visible at the picture, to balance group sizes, to limit columns, or to lock a sample so every student gets the same rows. We ship those cuts as datasets in the `primer.tutorials` package itself, using the standard CRAN `data/` + `data-raw/` + `R/` pattern. The first such dataset is `recruits` (a 50-row, 40-male / 10-female cut of NHANES used by `05-recruits`); the same pattern applies to any future tutorial-specific cut.

**Layout.** Three pieces, all in the `primer.tutorials` package root:

1. **`data-raw/<name>.R`** — runnable script that pulls upstream data, applies the transformation, calls `set.seed()`, and ends with `usethis::use_data(<name>, overwrite = TRUE)`. Keep a header comment that explains the source, the transformation, and any deliberate features (e.g. *"the 40/10 split is intentional to give differential SEs"*). Re-run with `Rscript data-raw/<name>.R` from the package root.
2. **`data/<name>.rda`** — the binary serialized object, written by `usethis::use_data()`. With `LazyData: true` in DESCRIPTION (set), the dataset lazy-loads when `library(primer.tutorials)` runs.
3. **`R/<name>.R`** — roxygen documentation, ending with the dataset name as a string (`"recruits"`). Required: `R CMD check` fails on a `data/` object without a doc page. Include a `@format` block describing each column and a `@source` referencing both the upstream dataset (e.g. `primer.data::nhanes`) and the construction script (`data-raw/<name>.R`). After editing, run `devtools::document(".")` and `devtools::install(".")` to regenerate `man/` and reload.

**Wiring (one-time, already done):**

- `DESCRIPTION` includes `LazyData: true`.
- `.Rbuildignore` includes `^data-raw$` so the source script does not ship in the built tarball.

**Tutorial-side conventions.** When a tutorial uses a packaged dataset:

- Setup chunk loads `library(primer.tutorials)` (not `library(primer.data)`), and references the dataset directly. No `slice_sample()`, no filtering, no `x` intermediate.
- Student-facing exercises that load libraries put `library(primer.tutorials)` in the QMD (in place of, or alongside, `library(primer.data)`).
- The `?<dataset>` exercise asks the student to look at the *packaged* dataset's help page (e.g. `?recruits`), not the upstream `?nhanes`.
- The Justice / Wisdom prose names the upstream source ("a 50-row teaching sample drawn from NHANES…"), but the analysis code references the packaged tibble.

**When to ship a packaged dataset.** Per §1.2 *Use all the data*, in-tutorial down-sampling for tutorial-speed reasons is not a default — so the question is no longer "ship vs. slice in-tutorial" but "ship vs. use the upstream raw tibble directly." Ship a packaged dataset when one of the following is true:

- The transformation is non-trivial (composite covariates, joins, recodes that don't fit in a one-liner).
- The upstream tibble is incomplete on its own and needs curation to be usable (e.g. an NHANES cut that drops rows with missing demographics).
- The tutorial benefits from every student seeing exactly the same rows for reasons unrelated to fit speed (uniform canonical answers, reproducible plots, a small didactic subset that exposes a feature a random slice would hide).

A blanket rule that *every* tutorial use a packaged dataset is overkill — datasets like `trains` are already small, balanced, and don't need re-cutting. Use the pattern when there is a real reason; ad-hoc filtering that a single `filter() |> select()` line can do in setup does not need its own `.rda`.

**Naming convention.** The packaged tibble's name should describe the *role* it plays in the tutorial (`recruits`, `voters`, `households`), not the upstream dataset name + size suffix (`nhanes_50`). The role-based name survives later N changes; the size-suffix name doesn't. Use the same name for the tutorial directory (`05-recruits`), the YAML `id` (`05-recruits`), and the student repo. One string per tutorial.

---


## 5. Tutorial structure

Every example tutorial has the same six sections as a chapter (Introduction, Wisdom, Justice, Courage, Temperance, Summary), but each section is a sequence of `### Exercise N` blocks rather than prose.

Tutorials are self-contained. A student who has not read the chapter should be able to complete the tutorial and learn everything the tutorial is trying to teach. This means every tutorial defines the key terms (causal effect, Preceptor Table, Population Table, validity, stability, representativeness, unconfoundedness, DGM), even though the chapter does too.

Every tutorial fits **one model**, not two — either predictive or causal, matching the chapter's primary question. (The chapter also covers a paired question with the opposite framing using the same fitted model; the tutorial does not.)

### 5.1 YAML header

```yaml
---
title: <Topic>
author: David Kane
tutorial:
  id: <NN-name>   # e.g., 07-nhanes. Same as directory name.
output:
  learnr::tutorial:
    progressive: yes
    allow_skip: yes
runtime: shiny_prerendered
description: "Tutorial #NN for Preceptor's Primer"
---
```

### 5.2 Setup chunk

The setup chunk loads the packages needed to render the tutorial and fits the model that the tutorial will reference as `fit_<n>` (e.g. `fit_attitude`). It must not contain anything slow; setup runs every time the tutorial launches.

```r
```{r setup, include = FALSE}
# learnr, tutorial.helpers, and gt are required for the tutorial to work.
# gt is needed because we show a Preceptor Table built with it, even
# though we don't show students how to build it.

library(learnr)
library(tutorial.helpers)
library(gt)

# Packages below are what we want students to load themselves in their
# QMD. They are listed in the tutorial so that (a) we have access
# to their functions for rendering, and (b) students get a knowledge drop
# for each.

library(tidyverse)
library(tidymodels)       # or ordinal, or another modeling package
library(broom)            # or broom.mixed
library(marginaleffects)
library(easystats)        # used for check_predictions()

knitr::opts_chunk$set(echo = FALSE)
options(tutorial.exercise.timelimit = 600,
        tutorial.storage = "local")

# Fit the model used throughout the tutorial. Name it fit_<something>.
# Keep setup cheap — a few seconds at most.
fit_<n> <- linear_reg(engine = "lm") |>
  fit(<outcome> ~ <covariates>, data = <tibble>)
```
```

Model naming: always start with `fit_` (`fit_attitude`, `fit_lifespan`, etc.) and use the same name throughout the tutorial.

Slow setup is a hard no. See the `tutorial.helpers` AI article (https://ppbds.github.io/tutorial.helpers/articles/ai.html) for background.

### 5.3 Child documents

Two child-document inclusions are standard. Place `info-section` immediately after the setup chunk, before the Introduction section:

```r
```{r info-section, child = system.file("child_documents/info_section.Rmd", package = "tutorial.helpers")}
```
```

The `download_answers.Rmd` child goes at the very end of the tutorial (after Summary):

```r
```{r download-answers, child = system.file("child_documents/download_answers.Rmd", package = "tutorial.helpers")}
```
```

**Do not include the `copy-code-chunk` (copy-button) child** — per the base guide, its only job is a copy button on exercise code chunks, and these tutorials have none. These two are part of the framework; do not reinvent them.

The `download_answers.Rmd` child document generates an HTML file the student downloads at the end of the tutorial. What the student does with that HTML — submitting it to a grader, emailing it to an instructor, uploading to an LMS — is **out of scope for CLAUDE.md and varies by course context**. Tutorial authors should assume the file is produced and trust that any downstream grading workflow is configured elsewhere. Do not add extra submission instructions in the tutorial body.

### 5.4 Sections and numbering

Each of the six sections opens with `##`. Each exercise opens with `### Exercise N` where `N` restarts at 1 within each section. Each exercise has a chunk label of the form `<section>-<N>` — `introduction-1`, `wisdom-3`, `justice-11`, etc.

**Section-header formatting.** Every `## SectionHeader` is immediately followed by a `###` (Continue button) on the next line — *every* section, including Summary. The `###` opener gives the section header its own paused screen, separate from the preamble that follows. Conversely, **do not insert a trailing `###` between the section preamble and `### Exercise 1`**: the preamble runs directly into the first exercise. The shape is:

```
## Wisdom
###

[preamble: opening sentence, Imagine paragraph, specific question, dataset name]

### Exercise 1

[exercise prose]
```

Not:

```
## Wisdom

[preamble]

###

### Exercise 1
```

The `###` between exercises (the End-of-exercise Continue button before the End drop) is unchanged — that's a different role and stays as is. Only the section-opener `###` (immediately after `##`) and the absence of a trailing `###` (immediately before `### Exercise 1`) are governed by this rule.

### 5.5 Section preambles

The **preamble** of a virtue section is the content between the section header (`## Wisdom`, `## Justice`, `## Temperance`, etc.) and the first `### Exercise N` block. Preambles are prose, knowledge drops, and/or author-rendered output — never student-facing exercises. They orient the student, review work done earlier in the tutorial, or set up what this section will do.

**Virtue-section self-containment.** Each virtue section — in the tutorial *and* in the chapter — is meant to be somewhat self-contained. A reader who skipped (or just forgot) the previous section should be able to start the next one without backtracking. The mechanism is the preamble: each preamble revisits the key output(s) from the earlier virtues that this virtue needs. This is repetitive by design, and the repetition is the point — it is the Primer's spaced-repetition pattern (§8) operating at section scale.

Concretely:

- **Wisdom preamble**: opens with the canonical sentence *"Data science starts with some broad questions and a data set which might help us to answer them."* Then the "Imagine that you are…" paragraph verbatim from Introduction, one line labeled *"The specific question:"* stating the QoI from Intro Exercise 15 (the Cardinal Virtues assume a student arrives with a data set and a *specific* question — Intro narrowed from the broad topic to this one), and one or two sentences naming the dataset. Detailed spec in §13.2.
- **Justice preamble**: shows the Preceptor Table from Wisdom (exact copy) and a `gt` table of the data. Detailed spec in §13.3; the data table's footnotes describe the data on its own terms, not in comparison with the Preceptor Table.
- **Courage preamble**: shows the Population Table from Justice, plus the abstract mathematical form of the DGM that Justice's last exercise chose (functional family: Normal / Bernoulli / multinomial / cumulative — pull the block from §13.7). The author-shown abstract-math block that used to live at the *end* of Justice (§13.3 Exercise 15) moves here in any tutorial that uses a Courage preamble — one place, not two.
- **Temperance preamble**: reviews the DGM decided on at the end of Courage using some combination of the four canonical ways to describe a model (words, R code, parameter table, concrete mathematical formula). Fully specified in §13.5.
- **Summary preamble**: the final plot and the summary paragraph (§13.6).

None of these preambles describe what the *current* virtue does. That is the first exercise's job in every section (§14.6). Preamble prose is limited to showing upstream artifacts and the specifics of *this problem*.

It is OK — though not ideal — for a reader to skip, say, Courage and still make useful sense of Temperance, because Temperance's preamble shows the fitted DGM; and it is OK to skip Justice and start on Courage because Courage's preamble shows the Population Table. Repetition is not a bug; being forced to flip pages is.

Detailed per-virtue preamble specs for Introduction, Wisdom, Justice, and Summary are not yet fully written out — see §16 Open items.

### 5.6 Pre-fitting expensive models

**This section is about a different kind of caching than the one the base guide requires — do not confuse them.** The base guide requires a **student-facing caching exercise** (`#| cache: true` on a chunk in the student's `analysis.qmd`, paired with a `.gitignore` entry) **at least once in every tutorial** — caching is a concept we reinforce every time, like `.gitignore`, even when the fit is cheap. That inherited rule is implemented by §13.4 Exercise 14 and is **not** optional. This section, by contrast, is about an **author-side** decision: whether to pre-fit an expensive model to a stored `.rds` so the tutorial's *own* setup chunk renders fast. The two are independent — the student still does the caching exercise whether or not the author pre-fits to `.rds`.

§5.2 requires the setup chunk to be cheap — a tutorial launch that takes more than a few seconds breaks the student's flow. Most fits in the curriculum are cheap (linear regression on 50 rows of NHANES, logistic on 5K rows of Mail). A handful are not: the causal forest at position 12 (Kenya), potentially the shaming fit on the full 344K rows, potentially the ordinal fit on full CES.

**Default: fit in setup.** Do not create a `data/fit_<n>.rds` just because a model exists. Linear, logistic, multinomial, and ordinal fits on a slice-sampled subset are all cheap enough to fit directly in setup. The `.rds` pattern adds complexity (binary artifacts in git, silent-drift risk, R-version coupling) that isn't worth paying for a fit that takes 50 ms.

**Pre-fit pattern, when warranted.** If fitting the model takes more than about three seconds even on a reasonable subset, pre-fit offline and store the result. Convention:

- **Script location.** `inst/tutorials/NN-name/data-raw/prefit.R` — a runnable R script that reads the raw data, fits the model, and calls `saveRDS(fit_<n>, "../data/fit_<n>.rds")`. Structure it so `Rscript data-raw/prefit.R` from the tutorial directory regenerates the `.rds` from scratch. Include a header comment with the package versions used to fit, so later maintainers know when the `.rds` was created.
- **Output location.** `inst/tutorials/NN-name/data/fit_<n>.rds` (single subdirectory, one `.rds` per stored object).
- **Setup-chunk load.** Use `system.file()` so the path works whether the package is installed or loaded via `pkgload::load_all()`:
  ```r
  fit_<n> <- readRDS(system.file(
    "tutorials/NN-name/data/fit_<n>.rds",
    package = "primer.tutorials"
  ))
  ```
- **Show the fitting code anyway.** Even though `fit_<n>` is loaded from disk, the Courage section should still show the `linear_reg() |> fit(...)` code students would run themselves. The `.rds` is a cache, not a replacement for the code. Students see the fit being "created"; under the hood, it's restored from `.rds`.
- **Do not store pre-computed `tidy()` or `predictions()` output separately.** If the fit is in `.rds`, downstream `tidy()`/`marginaleffects` calls on it are cheap and should run live. A hybrid where *both* the fit is cached *and* a pre-computed `tidy()` output is cached is not the convention — it is an earlier partial implementation and should be collapsed to one `.rds` per tutorial.

**§17 flag.** Any tutorial using this pattern gets an explicit field in its §17 entry:
```
- **Expensive fit:** Yes — `grf::multi_arm_causal_forest` with 2000 trees is too slow for in-setup fitting. Pre-fit via `data-raw/prefit.R`; setup loads from `data/fit_kenya.rds`.
```
Tutorials without this flag should not have an `.rds` file. Authors reviewing existing tutorials should delete unreferenced `.rds` files on sight.

**Regeneration workflow.** When the model spec changes, the author re-runs `Rscript data-raw/prefit.R` manually. A package-level helper (`primer.tutorials::rebuild_prefits()`, to be added) can walk `inst/tutorials/*/data-raw/prefit.R` and regenerate every `.rds` in the package — useful after bulk curriculum changes or R / dependency upgrades. Do not wire this into CI for the whole package; the cost (rebuilding the causal forest, for example) is too high to run on every push. Trigger it manually when `NEWS.md` documents a model-affecting change.

**Drift check.** To catch the case where the fitting code in the tutorial has diverged from the `.rds`, include a small comment in the setup chunk of any prefitted tutorial noting when the `.rds` was last regenerated:
```r
# fit_kenya loaded from data/fit_kenya.rds (regenerated 2026-05-14 via data-raw/prefit.R)
```

---

## 6. Question flow

Within a section, each `### Exercise N` has three parts: **Start**, the **task** (a written question, or an instruction to edit `analysis.qmd` and render), and **End**. Every exercise ends with at least one Continue button (triple hash, `###`) before the next one begins. The base guide's *Exercise rhythm* governs the overall loop — prompt AI / edit `analysis.qmd` → render → inspect the HTML → submit evidence → expected output → knowledge drop; this section adds only the Primer's Start/End conventions.

### 6.1 Start

The Start is one or two sentences of framing and then the question itself. Two rules:

- **Two-sentence rule.** Students will not read more than two sentences at a time. If the Start is longer than two sentences, insert a `###` (Continue button) to break it into pieces.
- If the Start is short (one or two sentences), the question code chunk follows immediately without a `###` between them.

Students tend to click Continue until they see a question. They then read the sentence or two *immediately before* the question closely, because they don't know whether that text is needed to answer. That is your best place to teach.

### 6.2 The task: code lives in `analysis.qmd`, not in exercise chunks

Per the base guide (*Philosophy*, *Student workflow*), students do **not** write R in learnr exercise chunks. Code work happens in their own `analysis.qmd`: the exercise states a goal, the student prompts an AI agent to make the edit, renders with `quarto render`, and inspects the rendered HTML. The tutorial `.Rmd` carries only two kinds of chunk:

- **Written question chunks** (`question_text()`, §7.2/§7.3) — for definitions, interpretation, and evidence submission (CP/CR, paste-from-HTML, `show_file()` output).
- **Answer chunks** — labeled `{section}-{N}-test`, with `#| echo: true`. Per the base guide's *canonical question shape*, this chunk is **shown** to the student the instant they click Continue: it runs our canonical code and displays the code **and** its result together, with **no label**, so the student compares it against their own. (A plain code-only block is the fallback when the code is too slow to run live.) There is no `exercise = TRUE` chunk and no `-hint` chunk.

This is the migrated model. The legacy `{section}-{N}` exercise chunk + `-hint-1` hint chunk pattern is **retired** — do not author new exercises with it.

**Test-chunk code must run as-is in the student's `analysis.qmd`.** This is the central honesty rule of the migrated model. A test chunk that runs in the tutorial's R session because the tutorial's `setup` chunk pre-built some object the student has never created is a *fiction*: it shows the student an output their own copy-paste of the same code would not reproduce. Don't do that.

The rule has two consequences for how tutorials are organized:

1. **Interim objects are created by the student in a cached chunk of `analysis.qmd` *before* any test chunk references them.** For a typical example tutorial that means an early Wisdom exercise instructs the student to add a chunk like

   ````
   ```{r}
   #| cache: true
   x <- <raw_tibble> |>
     <select / filter / drop_na / type-coerce>
   ```
   ````

   and a similar early Courage exercise instructs the student to add the fitted model:

   ````
   ```{r}
   #| cache: true
   fit_<n> <- <model spec> |>
     fit(<formula>, data = x)
   ```
   ````

   From that point on, any later test chunk may reference `x` or `fit_<n>` directly. The cached chunks make this cheap to re-render.

2. **The tutorial's `setup` chunk mirrors what the student is asked to add to `analysis.qmd`.** Same `x`, same `fit_<n>`, same names. The mirror lets the test chunks run under `learnr::run_tutorial()` *and* lets a student paste the same code into their own QMD and get the same output. Two sources of truth, identical content; that is the cost of the model.

The author check: read each test chunk and ask, *"if a student types this code into their own `analysis.qmd`, will it run?"* If the answer requires `x`, `fit_<n>`, or any other interim object that the student has not been told to create in their QMD, the tutorial is wrong; either add the missing setup exercise upstream, or inline the data-prep / fit into the test chunk itself.

### 6.3 End

After the task and its answer chunk, always place a `###` (a Continue button to pause on the output) and then a short End: one or two sentences of knowledge drop.

### 6.4 Topic-level final knowledge drop

After the last `### Exercise N` of a virtue section, add a standalone `###` followed by a one-or-two-sentence knowledge drop that steps back from the specific exercise and makes a broader point about the topic. This is not another exercise. It is the capstone for the section.

Example: if the last exercise in Wisdom polishes a scatter plot, the topic-final knowledge drop says something about scatter plots in general, or about the role of EDA, not about the particular plot the student just made.

### 6.5 Continue buttons without a real question

When you need a pause point in the flow — to display an author-shown table, formula, or plot, then let the student read it before moving on — use a **standalone `###`** (triple hash, no heading, no question). That alone produces a Continue button that advances the student. Do **not** create a fake `### Exercise N` with a placeholder `question_text()` containing *"(No command to run — this exercise is a pause to make sure you have read the table above.)"*. Those placeholders are noise: they pretend to be exercises, they bump the exercise count, and they ask the student to type/click for no reason.

The pattern, when an author-shown chunk needs a pause:

```
###  Exercise N

[prompt prose for the actual question]

[author-shown chunk]

###

[End knowledge drop, if any]
```

The `###` after the author-shown chunk is the continue button. The next `### Exercise N+1` heading starts the following exercise. No fake `question_text()` in between.

If the *only* thing the student needs to do is read an author-shown table or plot, fold the content into the *next* exercise's preamble — make the table or plot part of the setup for an interpretation question, rather than a standalone "view-and-Continue" exercise. The view+question pairing is much stronger pedagogy than view-then-acknowledge-with-a-button.

---

## 7. Exercise types

Three types, used in roughly this mix:

### 7.1 Code exercise (work in `analysis.qmd`)

The student produces code by prompting an AI agent and editing their `analysis.qmd`, then renders and inspects the result — never by typing into a learnr exercise chunk (base guide, *Philosophy* and *Authoring student prompts to AI*; §9). State the **goal**, not the implementation — *"Add a chunk to `analysis.qmd` that fits `att_end ~ treatment` on `trains`, assigns it to `fit_attitude`, render, and confirm it appears"* — and let the AI choose the functions.

Authoring: there is no `exercise = TRUE` chunk and no `-hint` chunk. The canonical result we show students after they submit goes in the `{section}-{N}-test` **answer chunk** with `#| echo: true` — shown (code **and** result, no label) after the first `###`, per the base guide's *canonical question shape* and §6.2. With AI-mediated authoring (§9), most code tasks are single-shot: state the goal, the student prompts AI, edits `analysis.qmd`, renders, submits evidence.

```r
```{r courage-3-test}
#| echo: true
# shown to the student after Continue — our code and its result, no label
linear_reg(engine = "lm") |>
  fit(att_end ~ treatment, data = trains)
```
```

### 7.2 Written exercise with model answer

Same `question_text()` shape as the base guide's *Question types* (yes-answer form: `message = "..."` with the canonical answer, `allow_retry = FALSE`, `incorrect = NULL`). Used for questions that have a correct answer — definitions, conceptual framings, recall; students see our answer after submitting theirs. The chunk skeleton is in the base guide and is not repeated here.

Primer-specific rule: the `message` text is read closely and compared against the student's own answer, so it must be excellent. For definitional questions, use the **Key Concepts** wording *verbatim* (the §11 snapshot is a convenience copy).

### 7.3 Written exercise without model answer

The base guide's no-answer `question_text()` form (`allow_retry = TRUE`, `try_again_button = "Edit Answer"`, no `message`). Used only when there is no single correct answer — typically evidence submission (paste `show_file()` output or copy from the rendered HTML) or describing something specific to the student's own analysis. Do **not** use this type for definitional or conceptual questions.

### 7.4 Operational conventions

**CP/CR** and **`show_file()`** follow the base guide's *Submission evidence* section and are not repeated here. **Evidence form follows the base rule: copy from the HTML by default for any printed result (tibble, `tidy()` table, `summary()`, `predictions()` output, …); reserve `show_file("analysis.qmd", chunk = "Last")` for plot exercises (to submit the code behind the visual, so code and our rendered plot sit side by side) and for genuine file checks (`.gitignore`, the final QMD).** CP/CR is **not** explained — students learned it in `vscode.tutorials` (base guide, *Submission evidence*).

Primer-specific notes, all deferring to the base guide's workflow:

- **Render + view per the base guide.** Students run `quarto render analysis.qmd` in a bash terminal and view the result via **Live Server**. Do **not** tell students to render with `Cmd/Ctrl + Shift + K` or to send lines to a Console with `Cmd/Ctrl + Enter`. Those keystrokes are **retired** here — superseded by the base workflow.
- **Terminal phrasing.** For interactive one-off commands (`show_file()`, `?recruits`, `list.files()`), use the base guide's terminal vocabulary — **R Terminal** and **bash terminal** — consistently. The Primer's older "at the R prompt" / "not the Console" phrasing is being swept out; prefer the base guide's wording in all new material.

---


## 9. AI-mediated code exercises

This is the base guide's model (*Philosophy*, *Authoring student prompts to AI*, *Authoring with AI agents*): students prompt an AI agent to produce code, edit `analysis.qmd`, render, and inspect — describing the **goal**, not the implementation, and not dictating functions. The general rules are in the base guide and are not repeated here.

Primer-specific consequences for section shape:

- **Wisdom** has many "examine the data" tasks; those work well as AI-prompted edits to `analysis.qmd`.
- **Courage** fits the model; fitting is typically one-shot, so most of Courage is *interpretation* (written exercises), not pipeline-building.
- Knowledge drops carry the load: the student may not read the AI's code closely, so the End of each exercise says what the code actually did and why it matters.

---


## 15. R tooling

The tutorial setup chunk (§5.2) loads the full package stack. For chapters, setup is simpler: load the packages, fit the model, move on.

**Packages loaded for rendering only** (not expected in the student's R Terminal): `learnr`, `tutorial.helpers`, `gt`.

**Packages students are expected to load themselves** (and appear in the setup chunk for the tutorial to work):
- `tidyverse` — always.
- `tidymodels` — for most models. Replace with `ordinal` or another package if that model framework doesn't fit.
- `broom` — for tidying model output. `broom.mixed` for mixed models.
- `marginaleffects` — for `predictions()`, `plot_predictions()`, `plot_comparisons()`.
- `easystats` — for `check_predictions()`. Added to the QMD setup chunk; the check runs in a rendered chunk like the rest of the analysis.

**Data package**: whichever one holds the tutorial's dataset (`primer.data` most of the time).

**Setup chunk must be cheap**. A model fit that takes more than a few seconds breaks the student's flow. Use a subset of the data if needed; fit the full model with `#| cache: true` in the tutorial body rather than in setup.

### 15.1 Quarto rendering conventions

The tutorial's setup chunk and the student's `analysis.qmd` rely on a small, stable set of Quarto chunk options and YAML directives. Collected here so authors don't have to hunt them down across tutorials.

**YAML header** (tutorial and student QMD both). In the student's `analysis.qmd`, `execute.echo: false` is added in Introduction Exercise 3 and kept thereafter:
```yaml
execute:
  echo: false
```

**Chunk options used frequently:**

| Option | Purpose | Where |
|---|---|---|
| `#| echo: false` | Hide the code; show only the result. | Setup chunks; any author-shown `gt` / `tidy()` / plot chunk where students should see output but not the code. Applies per-chunk when YAML-level `echo: false` is not set. |
| `#| message: false` | Suppress package-load messages ("Attaching tidyverse" etc.). | Setup chunks. |
| `#| warning: false` | Suppress R warnings. | Rarely — use sparingly; warnings often matter. |
| `#| results: asis` | Pass output through pandoc without wrapping in a code block. | Required for the §10 `gt` + inline-block-div + pandoc-raw-HTML pattern. Without it, the emitted HTML gets markdown-parsed and scopes wrap incorrectly. |
| `#| cache: true` | Quarto saves the chunk's objects on first render and loads them on subsequent renders as long as the code is unchanged. | Any chunk that fits an expensive model (causal forest, large RF, bootstrapped posterior). Pair with `*_cache` in `.gitignore` (§13.4 Exercise 13) so the cache directory doesn't go to GitHub. |
| `#| include: false` | Run the chunk but hide *both* code and output. | Almost never needed in tutorials. Mentioned here for completeness. |

**Setup chunk idiom** — the tutorial's top setup chunk typically uses:
```r
knitr::opts_chunk$set(echo = FALSE)
options(tutorial.exercise.timelimit = 600, tutorial.storage = "local")
```
Leave the rendering behavior to chunk-level overrides when needed. `options(tutorial.exercise.timelimit = ...)` gives each student-code exercise 10 minutes (600s); `tutorial.storage = "local"` tells learnr to persist student answers between sessions on the student's machine.

**Rendering and running — follow the base guide.** Students render with `quarto render analysis.qmd` in a bash terminal and view the result via Live Server (base guide, *Student workflow*). That section forbids the `Cmd/Ctrl + Shift + K` render keystroke and the `Cmd/Ctrl + Enter` send-to-Console keystroke; the earlier Primer text that told students to use those is **retired**.

---

