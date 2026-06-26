# CLAUDE.md — Primer class exercises (`class-exercises/`)

You are authoring a **Primer class exercise** — one of three artifacts the project can build from a single problem, alongside the book chapter (`book/`) and the learnr tutorial (`primer.tutorials/`). Start at the repo index [`../CLAUDE.md`](../CLAUDE.md) for the curriculum, the base-guide relationship, and the collaboration protocol.

> **Status: starter document.** This guide is a skeleton. The decisions that define what a class exercise physically *is* (format, length, live workflow) are not settled yet — they are collected under **Open questions** below and must be resolved with David before this guide acts as a real contract. Until then, do not invent structure; ask.

## One seed, up to three renderings

The load-bearing idea: **the upstream material is shared, and the artifact is downstream.** Given a dataset, a question (QoI), a model, and the Preceptor/Population Tables, you can render a **chapter**, a **tutorial**, or a **class exercise** — or any subset. **We do not always build all three.** A problem may have a tutorial but no class exercise, a chapter but no tutorial, and so on.

That shared upstream already exists and already has a home: the **seed spec** at [`../guide/per-problem/<id>.md`](../guide/per-problem/). Each seed names the dataset, the "Imagine that you are…" scenario, the broad question and the narrow QoI, the causal/predictive framing, the data-prep step, the final model, the Preceptor and Population Table column structure, and a **Renderings** line tracking which of the three artifacts exist or are planned. A class exercise **consumes that seed; it does not re-derive it.** The question and the model are the same question and model the chapter and tutorial use.

So this guide is **not** the place to specify data, question, or model — those live in the seed. This guide specifies only what is *distinctive about rendering a seed as a class exercise*: the in-class format, the time box, the live/collaborative workflow, and how (if at all) it differs from the tutorial built from the same seed.

## What is already fixed

- **Canonical definitions are inherited.** [`../book/key-concepts.qmd`](../book/key-concepts.qmd) is the single source of truth for every definition; the in-class exercises are named there explicitly as one of the artifacts that must agree with it. Never redefine a term — quote or link the canonical wording.
- **The slot fixes tier and framing.** A class exercise sits at its problem's curriculum position, so it inherits that slot's **EMH tier** (05–08 Easy, 09–12 Medium, 13–16 Hard) and its **predictive/causal framing** from the seed. See [`../guide/curriculum.md`](../guide/curriculum.md).
- **Concepts introduced in order.** Never use a concept the curriculum introduces in a later position (base guide; Primer schedule in `../guide/curriculum.md`).

## What to read

- The **seed spec** for the problem you are rendering: [`../guide/per-problem/<id>.md`](../guide/per-problem/) (read only that one) — dataset, question, model, tables, Renderings.
- [`../CLAUDE.md`](../CLAUDE.md) — repo index: curriculum, base-guide relationship, collaboration protocol.
- The matching chapter (`../book/`) and tutorial (`../primer.tutorials/`) for the same slot, if they exist — the class exercise shares their primary question, tables, and fitted model.
- Shared with chapters and tutorials: [`../guide/curriculum.md`](../guide/curriculum.md), [`../guide/tables.md`](../guide/tables.md), [`../guide/concepts-and-drops.md`](../guide/concepts-and-drops.md), [`../guide/guidance.md`](../guide/guidance.md).

## Open questions (resolve with David before this becomes a real contract)

The upstream questions (data / question / model / tables) are **answered** — they come from the seed. What remains are the *rendering* decisions, which are David's to make:

1. **Format and file type.** What does a class exercise physically look like? A `.qmd` to render, an `.Rmd` learnr tutorial, a markdown handout, slides, or instructor notes + a student handout?
2. **File and naming conventions.** Reuse the shared `NN-name` slug? One file per problem, or a subdirectory? Where does rendered output go, and where do these files live — here in `class-exercises/`, or somewhere else?
3. **Base-guide inheritance.** Does the base tutorial guide (which governs tutorials) also govern class exercises, govern them with explicit overrides, or not apply?
4. **Structure.** Follow the four Cardinal Virtues (Wisdom, Justice, Courage, Temperance) like chapters and tutorials, or a different arc suited to a live session?
5. **AI-mediated or not.** Tutorials use the AI-era workflow (students prompt an AI to build `analysis.qmd`). Same here, or hands-on-in-class differently?
6. **Length / time box and solo-vs-group.** What class duration is one exercise sized for, and is it individual, paired, or whole-class?
7. **Same data or parallel data.** Reuse the seed's exact dataset/QoI, or deliberately use a parallel-but-different dataset so the exercise is not a rerun of the tutorial?
8. **Guide home.** Should the detailed authoring guidance live here, or as a new part under [`../guide/`](../guide/) (e.g. `guide/class-exercises.md`) with this file as a thin router — mirroring how `book/` and `primer.tutorials/` route into `guide/`?

Once David answers these, fold the answers into the sections above, delete the resolved open questions, and remove the **starter document** banner.
