# CLAUDE.md — Primer class exercises (`class-exercises/`)

You are authoring a **Primer class exercise** — one of three artifacts the project can build from a single problem, alongside the book chapter (`book/`) and the learnr tutorial (`primer.tutorials/`). Start at the repo index [`../CLAUDE.md`](../CLAUDE.md) for the curriculum, the base-guide relationship, and the collaboration protocol.

> **Reference example: [`recruits/`](recruits/).** The format below is established; `recruits/` is the canonical worked example. A few rendering details (listed under **Open questions**) are still unsettled — ask before inventing structure for those.

## One seed, up to three renderings

The load-bearing idea: **the upstream material is shared, and the artifact is downstream.** Given a dataset, a Quantity of Interest (QoI), a model, and the Preceptor/Population Tables, you can render a **chapter**, a **tutorial**, or a **class exercise** — or any subset. **We do not always build all three.** A problem may have a tutorial but no class exercise, a chapter but no tutorial, and so on.

That shared upstream already exists and already has a home: the **seed spec** at [`../guide/per-problem/<id>.md`](../guide/per-problem/). Each seed names the dataset, the "Imagine that you are…" scenario, the broad question and the narrow QoI, the causal/predictive framing, the data-prep step, the final model, the Preceptor and Population Table column structure, and a **Renderings** line tracking which of the three artifacts exist or are planned. A class exercise **consumes that seed; it does not re-derive it.** The question and the model are the same question and model the chapter and tutorial use.

So this guide is **not** the place to specify data, question, or model — those live in the seed. This guide specifies only what is *distinctive about rendering a seed as a class exercise*: the in-class format, the file layout, and how it differs from the tutorial built from the same seed.

## How a class exercise is built

A class exercise is a pair of Quarto documents in a folder named for the problem — **no number** (the curriculum number is irrelevant in the classroom). See [`recruits/`](recruits/) for the worked example.

- **Folder.** `class-exercises/<name>/`, where `<name>` is the problem's main name (e.g. `recruits`). Not numbered.
- **Two files, one exercise:**
  - `<name>.qmd` — the **student handout**: questions and prompts the student answers by typing directly into the document.
  - `<name>-answers.qmd` — the **TF answer key**: the *same* questions with our answers filled in, plus the worked Preceptor/Population Tables. Title carries `(Answer Key)`.
  - The student file is the answer key with the answer prose and the worked `gt` tables removed — building those is the student's task. Keep the two in sync: every question in one appears, identically worded, in the other.
- **Quarto, `echo: false`.** Both files are `.qmd` with a YAML `execute: echo: false` block and a `setup` chunk loading the packages the data needs (`tidyverse`, `gt`, and whichever package ships the dataset — `primer.tutorials` for `recruits`, `primer.data` for most others). Render with `quarto render` to confirm they build; the generated `.html`/`_files` are git-ignored, do not commit them.
- **Structure (mirrors the example).** Background Information (with real-world sources where useful) → **Scenarios** (a predictive framing *and* a causal framing of the same outcome, exactly the seed's primary + paired questions — include the causal one even when its manipulation is absurd, and say so) → **Data** (a few EDA chunks: print the tibble, `summary()`, a histogram) → **Preceptor Table** (the causal/predictive · units · outcome · covariates · treatment checklist, then a `gt` table per scenario) → **Population Table** (a `gt` table per scenario; describe it in words; the four Justice assumptions — validity, stability, representativeness, unconfoundedness — each defined and given a problem-specific counter-example) → **Modeling** (which model and why, from the variable type). This is the Wisdom→Justice→Courage arc in one handout.
- **Preceptor and Population Tables use the project standard — never improvised.** Build them with the full `gt` pipeline from [`../guide/tables.md`](../guide/tables.md) §10: spanners with fixed IDs (`unit_span`, `outcome_span`, `treatment_span`, `covariates_span`), the footnote set, the hatch helper for causal counterfactuals, the 11-row Population Table layout, and the `opt_css` → `as_raw_html()` → `cat()`-in-`results: asis` ending. The fastest correct path is to **copy the matching tables from the problem's chapter** (`../book/<NN-name>.qmd`) or tutorial and adapt them — for `recruits`, the four tables come straight from `book/05-recruits.qmd` (primary→Scenario 1, paired→Scenario 2). Do **not** write ad-hoc flat `gt()` tables; the answer key's tables must look exactly like the chapter's.
- **Seed-driven content.** Dataset, scenarios, outcome, covariates, treatment, model, and table column structure all come from the seed; do not re-derive them. After building, set the seed's **Renderings** line `class exercise ✓`.

## What is already fixed

- **Canonical definitions are inherited.** [`../book/key-concepts.qmd`](../book/key-concepts.qmd) is the single source of truth for every definition; the in-class exercises are named there explicitly as one of the artifacts that must agree with it. Never redefine a term — quote or link the canonical wording.
- **The slot fixes tier and framing.** A class exercise sits at its problem's curriculum position, so it inherits that slot's **EMH tier** (05–08 Easy, 09–12 Medium, 13–16 Hard) and its **predictive/causal framing** from the seed. See [`../guide/curriculum.md`](../guide/curriculum.md).
- **Concepts introduced in order.** Never use a concept the curriculum introduces in a later position (base guide; Primer schedule in `../guide/curriculum.md`).

## What to read

- The **seed spec** for the problem you are rendering: [`../guide/per-problem/<id>.md`](../guide/per-problem/) (read only that one) — dataset, question, model, tables, Renderings.
- [`../CLAUDE.md`](../CLAUDE.md) — repo index: curriculum, base-guide relationship, collaboration protocol.
- The matching chapter (`../book/`) and tutorial (`../primer.tutorials/`) for the same slot, if they exist — the class exercise shares their primary question, tables, and fitted model.
- Shared with chapters and tutorials: [`../guide/curriculum.md`](../guide/curriculum.md), [`../guide/tables.md`](../guide/tables.md), [`../guide/concepts-and-drops.md`](../guide/concepts-and-drops.md), [`../guide/guidance.md`](../guide/guidance.md).

## Open questions (still unsettled — ask David)

The upstream (data / question / model / tables) comes from the seed, and the format and file layout are settled (above). What remains:

1. **One exercise per problem, or one per virtue?** `recruits/` is a single end-to-end exercise. The example title pattern ("Wisdom and Recruits") could instead imply a `wisdom`/`justice`/`courage`/`temperance` file set per problem. Current default: one per problem.
2. **Base-guide inheritance.** Does the base tutorial guide (which governs tutorials) also govern class exercises, govern them with explicit overrides, or not apply? Note the class exercise already departs from the base guide's AI-mediated `analysis.qmd` workflow — students type answers directly into the handout `.qmd` — so at minimum that is an override.
3. **Length / time box and solo-vs-group.** What class duration is one exercise sized for, and is it individual, paired, or whole-class?
4. **Coverage.** Which problems get a class exercise? (Not necessarily all 16 — see the seed **Renderings** lines.)
5. **Guide home.** Keep this guidance here, or move it to a new part under [`../guide/`](../guide/) (e.g. `guide/class-exercises.md`) with this file as a thin router — mirroring how `book/` and `primer.tutorials/` route into `guide/`?

As David settles these, fold the answers in above and trim this list.
