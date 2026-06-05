# CLAUDE.md — Primer book chapters (`book/`)

You are authoring a **Preceptor's Primer book chapter** — the `.qmd` files in this directory. Start at the repo index [`../CLAUDE.md`](../CLAUDE.md) for the curriculum, the base-guide relationship, and the collaboration protocol.

Chapters are **prose Quarto, not learnr tutorials**, so the base tutorial guide does **not** govern them (it is tutorial-only). What to read:

- [`../guide/chapters.md`](../guide/chapters.md) — chapter structure: the six virtue sections, the paired (opposite-framing) question, richer EDA than the tutorial, and real-world background.
- Shared with tutorials: [`../guide/curriculum.md`](../guide/curriculum.md) (this chapter's tier and framing), [`../guide/tables.md`](../guide/tables.md) (Preceptor/Population Tables in `gt`), [`../guide/concepts-and-drops.md`](../guide/concepts-and-drops.md) (canonical definitions), [`../guide/guidance.md`](../guide/guidance.md) (rounding, visualization house style, LaTeX, package-name formatting).
- The matching tutorial's seed spec: [`../guide/per-tutorial/<id>.md`](../guide/per-tutorial/) — same primary question, Preceptor/Population Tables, and fitted model the chapter shares.

Filename convention: `NN-name.qmd` (two-digit chapter number; dataset or descriptive slug). `_quarto.yml` orders the chapters.
