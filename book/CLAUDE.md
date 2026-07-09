# CLAUDE.md — Primer book chapters (`book/`)

You are authoring a **Preceptor's Primer book chapter** — the `.qmd` files in this directory. Start at the repo index [`../CLAUDE.md`](../CLAUDE.md) for the curriculum, the base-guide relationship, and the collaboration protocol.

Chapters are **prose Quarto, not learnr tutorials**, so the base tutorial guide does **not** govern them (it is tutorial-only). What to read:

- [`../guide/chapters.md`](../guide/chapters.md) — chapter structure: the six virtue sections, the paired (opposite-framing) question, richer EDA than the tutorial, and real-world background.
- Shared with tutorials: [`../guide/curriculum.md`](../guide/curriculum.md) (this chapter's tier and framing), [`../guide/tables.md`](../guide/tables.md) (Preceptor/Population Tables in `gt`), [`../guide/concepts-and-drops.md`](../guide/concepts-and-drops.md) (canonical definitions), [`../guide/guidance.md`](../guide/guidance.md) (rounding, visualization house style, LaTeX, package-name formatting).
- The matching seed spec: [`../guide/per-problem/<id>.md`](../guide/per-problem/) — same primary question, Preceptor/Population Tables, and fitted model the chapter shares.

Filename convention: `NN-name.qmd` (two-digit chapter number; dataset or descriptive slug). `_quarto.yml` orders the chapters.

**Code visibility (settled 2026-07-09).** `_quarto.yml` sets `code-fold: true` with no global `echo` option, so every chunk's code renders behind a collapsed "Show the code" button by default. Analysis code — setup/data loading, EDA plots, candidate models, the DGM fit, `marginaleffects` calls — is deliberately shown this way; readers should be able to open any figure's or model's code. Presentation machinery stays hidden: every gt Preceptor/Population Table chunk (whether it prints the table directly or emits raw HTML via `results: asis`) and every `knitr::include_graphics()` chunk must carry an explicit `#| echo: false`. Helper-function definitions belong in a hidden chunk, not the visible setup chunk.
