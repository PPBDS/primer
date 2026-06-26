# CLAUDE.md — Primer tutorials (`primer.tutorials/`)

You are authoring a **Primer learnr tutorial** — the `inst/tutorials/<NN-name>/tutorial.Rmd` files in this package. Start at the repo index [`../CLAUDE.md`](../CLAUDE.md) for the curriculum, the base-guide relationship, and the collaboration protocol.

**These tutorials follow the base tutorial guide by default** — [`tutorials/CLAUDE.md` in PPBDS/ai-rules](https://github.com/PPBDS/ai-rules/blob/main/claude-md/tutorials/CLAUDE.md) — which owns everything common to all tutorials (the AI-era philosophy, the `analysis.qmd` + render + Live Server workflow, the canonical question shape, `echo = TRUE` answers, knowledge-drop discipline, evidence conventions). **Read it first.** The Primer parts below add only Primer specifics or record explicit overrides.

What to read:

- [`../guide/authoring.md`](../guide/authoring.md) — Primer tutorial structure, question flow, exercise types, child documents, R tooling.
- [`../guide/exercise-list.md`](../guide/exercise-list.md) — the master exercise list (the per-virtue exercise sequence).
- [`../guide/per-problem/<id>.md`](../guide/per-problem/) — the seed spec for the problem you're building (read only that one).
- Shared with chapters: [`../guide/curriculum.md`](../guide/curriculum.md) (tier and framing), [`../guide/tables.md`](../guide/tables.md), [`../guide/concepts-and-drops.md`](../guide/concepts-and-drops.md), [`../guide/guidance.md`](../guide/guidance.md).

The tutorial directory, YAML `id`, packaged tibble (where applicable), and student repo all share one string per tutorial (e.g. `08-seguro-popular`); see `../guide/authoring.md` §3.
