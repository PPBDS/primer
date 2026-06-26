# Primer authoring guide — Curriculum & sequencing (§1, §8)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.

---

## 1. Project

The *Primer* teaches students how to do data science: given a question and some data, complete a series of steps that, with luck, yield an answer — presented graphically, and including a measure of uncertainty.

The steps are organized around the [Cardinal Virtues](https://en.wikipedia.org/wiki/Cardinal_virtues) — Wisdom, Justice, Courage, Temperance. References and allusions to the virtues are a feature, not a bug. Use them liberally. The main images we use for these virtues are currently located in `book/other/images/`. Each file is the first letter capitalized virtue with ``jpg` suffix. We would like to include these images at the start of the relevant section in all three artifacts.

A data science project has three potential artifacts:

- **Textbook chapters** — full Quarto files, one per chapter, numbered. 
- **Tutorials** — one learnr tutorial per chapter. Students *are* required to complete these, so they must be self-contained; do not assume a student has read the associated chapter.
- **Classroom material** — not yet created.

### 1.1 Two types of chapters/tutorials

**Example** chapters/tutorials work through a well-defined data science problem using the Cardinal Virtues. The example sequence gets progressively more sophisticated as students become more practiced. Every example chapter covers every important concept — causal effect, Preceptor Table, Population Table, hypothesis testing, posterior predictive checks, and so on. Earlier example chapters may skip the most advanced concepts, but once a concept is introduced it appears in every subsequent chapter.

**Miscellaneous** chapters/tutorials cover topics that do not involve a major data science exercise. The current four are Probability, Sampling, Rubin Causal Model, and Cardinal Virtues.

The target curriculum is **16 chapter/tutorial pairs total**: the 4 miscellaneous above and **12 example chapters**. Twelve is a working target, chosen because it divides cleanly into 4 Easy / 4 Medium / 4 Hard and pairs with the predictive/causal alternation rule (§1.5). The sequence can grow to 14 or 16 later without changing the design principles — the EMH 4/4/4 split is an artifact of the current size, not a constraint on the final shape.

### 1.2 Chapter ≠ tutorial

Chapters are longer than tutorials. Every example chapter covers the same primary question as its matching tutorial — same question, same Preceptor Table, same Population Table, same fitted model — but in more depth: more EDA, more candidate models, more exploration. Almost every line of code in the tutorial also appears in the chapter.

In addition, every example chapter includes a **paired question**: a second question that uses the same outcome variable and the same covariates as the primary question, but with the opposite framing. If the primary question is causal, the paired question is predictive; if the primary is predictive, the paired is causal. The paired question gets its own Preceptor Table and its own Population Table. The key insight is that the **same fitted model** serves both questions — the outcome and covariates are identical. What differs is the assumptions the analyst is willing to make and the language used to interpret results.

**The paired question is required even when the implied causal manipulation is absurd.** Some predictive tutorials use covariates that are not realistically manipulable (sex, age in Recruits; tuition and selectivity in Colleges, where the "manipulation" is at the institutional level rather than the unit level). The paired causal question for those chapters has to *pretend* one covariate is a treatment and ask "what is the causal effect of X on Y?" anyway --- and the chapter then explicitly names the absurdity. The pedagogical point is that the predictive/causal distinction is *an analyst's commitment*, not a property of the data, and the absurd-counterfactual case makes the commitment visible. Don't skip the paired question to avoid awkwardness; lean into the awkwardness.

The chapter therefore has two Preceptor Tables, two Population Tables, one fitted model, and two sets of answers in Temperance.

The "Imagine that you are…" opener is the same in the chapter and the tutorial --- reuse it verbatim. The *only* word that changes is *tutorial* → *chapter* in the sentence that names what the artifact focuses on (*"This tutorial focuses on…"* → *"This chapter focuses on…"*). The Imagine paragraph does not mention the predictive/causal pairing --- that is a Wisdom move, introduced once the reader has the apparatus to understand it; in Imagine we stay at the real-world level of decisions and estimates.

**Use all the data.** The chapter and tutorial work from the same data --- the full dataset, in every case where we have access to the full dataset. Down-sampling for tutorial-speed reasons is **not** the default and should not appear in new authoring. The chapter is a published artifact that should arrive at the real estimate, not a noisier slice of it; the tutorial, by the *chapter ≠ tutorial* match rule above, uses the same data the chapter does. If a candidate model would take a long time to fit on the full dataset (typically because it is a Stan/brms posterior, or the dataset itself is unusually large), **do not down-sample silently** --- flag the speed problem to the author for discussion. The resolution may be a pre-fit `.rds` (§5.6), a different model, a different dataset, or, in rare cases, an explicit slice; the resolution is never "quietly cut the dataset to 500 rows and apologize for the wide error bars in a knowledge drop." The packaged-dataset cases (`recruits`, `smokes`) are not exceptions to this rule --- those tibbles **are** the full dataset for tutorial purposes, curated upstream in `data-raw/` for reasons documented in §3.1 (incomplete original sources, reproducible curated cuts), and the chapter uses the same packaged tibble.

### 1.3 Progressive sophistication

Many definitions, concepts, and tools have three sophistication levels — **Easy**, **Medium**, and **Hard** (abbreviated **EMH**). The curriculum uses the Easy version in roughly the first third of the chapter sequence, the Medium version in the second third, and the Hard version in the final third. Each return to a concept builds on the previous visit, deepening the student's understanding rather than restating it.

*Legacy terminology note:* earlier sections of this file and prior drafts use **Difficult** where this and later sections use **Hard**. They mean the same tier. Going forward, prefer *Hard* and *EMH*; treat any remaining *Difficult* as synonymous.

Transitions are gradual, not sharp. The last Easy tutorial should be just slightly simpler than the first Medium tutorial; same for the Medium-to-Difficult boundary. There should be no step change a student can point to.

This principle works hand-in-hand with spaced repetition (§8): a recurring concept doesn't merely reappear, it reappears at the next level of sophistication, so each visit teaches something new.

**Most definitions stay stable across tiers; what scales is the discussion around them.** A student who learns the canonical Key Concepts wording in an early chapter should see the same wording in later chapters — that is how spaced repetition cements it. What changes across Easy, Medium, and Difficult treatments is the depth of the *surrounding* material: the counter-examples chosen, the knowledge drops attached, the techniques mentioned, the edge cases probed. Mark Easy/Medium/Difficult variants on knowledge drops (§12), counter-examples, and exercise prompts (§13) — not on the canonical definitions themselves.

**Some definitions, however, are themselves tier-staged.** When a concept's full canonical wording is too sophisticated for early tutorials, the Key Concepts wording is the *Hard* version, and Easy and (sometimes) Medium tutorials use simpler framings that grow toward it. Three patterns exist:

- **No staging** (most concepts). Canonical wording from Easy onward. Examples: Wisdom, Courage, Temperance, Preceptor Table, causal effect, fundamental problem of causal inference, Population Table, **Stability**. For these, the canonical wording is the same at every tier; what scales across E/M/H is the *knowledge drop* that follows the definition exercise — a "post-definition theme" that grows in sophistication tier by tier.
- **Two tiers** (Easy → canonical at Medium). The simpler form covers Easy plus the first half of Medium; canonical takes over at the back half of Medium and stays. Examples: Representativeness, Unconfoundedness.
- **Three tiers** (E / M / H). Each tier has its own wording, mapping one-for-one to the EMH split. Example: Justice.

When a definition has tier-staged variants, the End of the corresponding §13 Ex 1 is **always devoted to placing the definition in the context of increasing sophistication** — naming the technical terms or distinctions that the next tier will introduce, even if there is not time to go into the details. The aim is for students to see what's coming. (When a definition has no staging, the End can do something else.)

**Where the variants themselves are written down.** The actual wordings, scope expansions, theme-by-tier drops, and counter-examples for every tier-staged definition live in the `Key Concepts` book chapter (`book/key-concepts.qmd`), under each definition's *Where this comes from* subsection. Key Concepts uses content-based labels (e.g. "Single-link frame", "Outcome-only scope", "Stability and time", "The simpler frame") rather than EMH-tier labels — the chapter does not name the EMH split because that is curriculum machinery, not pedagogical content. CLAUDE.md retains the *tier-routing rules* below (which version goes in which tutorial position) but no longer carries the wordings or the discussion. When you need to write or rewrite a §13 Ex 1 message, look up the relevant Key Concepts entry.

**Tier-routing: representativeness.** Two-tier staging.

- **Easy.** Use the *Single-link frame*. Discussion stays on the data → population link only.
- **Medium and Hard.** Switch to the canonical *Two-link frame* (data → population → Preceptor Table) and stay there. Counter-examples deepen across Medium → Hard but the wording does not change.

The wordings, the counter-examples, and the advanced-remedy discussion (post-stratification, IPW, raking) live in `Key Concepts` → *Representativeness* → *Where this comes from*.

**Terminology introduction points (sampling mechanism, selection mechanism).** The phrase *sampling mechanism* is first introduced in the middle of the Easy tier and is used from then on in knowledge drops and example answers — every subsequent tutorial can assume the reader has seen it. The phrase *selection mechanism* is first introduced in the middle of the Medium tier and likewise propagates forward. Before writing any given tutorial, check where it sits in the sequence: if it is before the introduction point of one of these phrases, use only the plainer vocabulary; if it is after, use the technical term freely. This staggered introduction is why the two phrases are defined as canonical concepts in Key Concepts but not introduced together at the same point in the curriculum.

**Tier-routing: validity.** No staging of the wording — the canonical Key Concepts definition is plain enough for the first tutorial. What scales across tiers is the *scope* of mismatch the discussion considers.

- **Easy.** *Outcome-only scope.* Restrict the discussion to the outcome column.
- **Medium.** *Covariates and treatment scope.* Expand to non-outcome columns, including treatment operationalization and derived columns.
- **Hard.** *Construct scope.* Construct validity --- subtle conceptual mismatches. Name (do not teach) advanced remedies: measurement invariance testing, item response theory, cross-walking between instruments, IV when the proxy is biased.

The scope-by-scope counter-examples and remedies live in `Key Concepts` → *Validity* → *Where this comes from*. Use validity as the guide for other concepts: only introduce an Easy-specific *wording* when the canonical version would genuinely obstruct a new student. Most of the time, scope-based staging is sufficient.

**Tier-routing: stability.** No staging of the wording — the canonical definition holds at every tier. What scales is the *theme of the post-definition drop* attached to §13.3 Ex 6's End.

- **Easy.** Theme: *Stability and time*. Frame stability as primarily a temporal concern; the longer the gap between data and Preceptor Table, the more stability is at risk. Easy-tier authors may also seed a forward-pointer to the parameters-vs-distributions point coming at Medium.
- **Medium.** Theme: *Stability is about parameters, not distributions*. The load-bearing Medium-level insight. Plan to revisit "distribution change ≠ stability violation" across several Medium-tier drops; the point resists landing in one pass.
- **Hard.** Theme: *Three DGMs and the parallel to representativeness*. Make the row-level (representativeness) vs parameter-level (stability) parallel explicit at least once per Hard tutorial. Name (do not teach) advanced remedies: time-varying coefficients, state-space models, changepoint analysis, DiD with time fixed effects, structural-break tests, the Lucas critique.

The theme-by-theme content lives in `Key Concepts` → *Stability* → *Where this comes from*. The Ends across tiers are *thematic* — different wording each time, but the same theme at any given tier (see §12 on knowledge drops as templates).

**Tier-routing: unconfoundedness.** Causal-only — predictive tutorials skip the assumption entirely. Two-tier definitional shift, plus a third frame at Hard for advanced designs.

- **Easy.** Use the *Intuition: random assignment* frame. Stay at student-intuition level. Scope: binary treatment, surface-level confounding.
- **Medium.** Switch to the canonical wording and stay there. Introduce the *Conditioning on pre-treatment covariates* apparatus: pre-vs-post-treatment distinction, *selection on observables*, randomized vs. observational. Heavy upgrade — plan to revisit across several Medium-tier tutorials rather than dropping it all at once.
- **Hard.** *Selection on unobservables.* Name (do not teach) the advanced designs: IV, RDD, DiD with parallel-trends, propensity-score methods, sensitivity analysis.

The wordings, counter-examples, and design discussion live in `Key Concepts` → *Unconfoundedness* → *Where this comes from*. A predictive tutorial sandwiched between two causal ones means the next causal tutorial may need a half-exercise to re-ground why the assumption applies here and did not last time.

**Tier-routing: Justice's definition.** Three-tier ladder — each tier's wording adds something the previous did not name.

- **Easy.** *The simpler frame.* No four-assumption enumeration; uses *"formula for the data generating mechanism"* as the catch-all for what canonical Justice calls *"probability family and link function."*
- **Medium.** *The four-assumption frame.* Adds the validity / stability / representativeness / unconfoundedness enumeration; still uses *"formula"* in place of the technical terms.
- **Hard.** *The canonical frame.* Replaces *"formula"* with *probability family* and *link function*.

The actual wordings live in `Key Concepts` → *Justice* → *Where this comes from*.

The End of Justice Ex 1 always previews the next tier of sophistication. At Easy, the End names the four-assumption enumeration as something coming and notes that the formula choice gets technical names later. At Medium, the End names "probability family" and "link function" as the Hard-tier upgrade. At Hard, no forward-pointer is needed.

**Worked example: model checking across three levels.** Model checking — comparing the fitted values our DGM produces with the actual outcomes in the data — is different from the four assumption worked examples above. It is not a property we hope for; it is a diagnostic we perform. The same Easy / Medium / Difficult staging applies, but what scales is how much the check steers model choice and how much vocabulary we attach to it.

- **Easy.** Two sub-stages.
  - **First two example tutorials:** skip model checking entirely. The section's other canonical questions (Rubin framing, Preceptor Table construction, Population Table, the assumptions) already fill the budget; tutorial real estate is better spent there.
  - **Next three example tutorials:** one exercise that shows a side-by-side plot the author has produced ahead of time — the distribution of the actual outcome alongside the distribution of fitted values from the DGM. The student doesn't write code; they view the image, hit Continue, and see a short knowledge drop. Canonical End: *"In a good model, the distribution of fitted values looks like the distribution of the actual outcome. Big divergences mean our model is missing something."* No package loaded, no new terminology, no phrase "posterior predictive check" yet.

- **Medium.** Students create the comparison themselves with `check_predictions()` from `easystats` (or an equivalent package if a better one emerges). Knowledge drops sharpen: what a discrepancy can mean — wrong functional form, missing covariate, a wrong distributional family for the outcome, variance that depends on covariates. Students **diagnose** what they see but **do not fix** the model yet; the skill at this level is interpretation, not iteration.

- **Difficult.** Introduce the phrase **posterior predictive check** for the first time. Use `check_predictions()` (or equivalent) to perform a formal PPC. Discussion deepens to cover what different kinds of divergence mean for inference downstream: interval width, coverage, bias in particular regions of covariate space. In at least two Difficult-tier tutorials, use the PPC to drive a model revision — fit a first-pass model, show that its PPC is visibly poor, fit an alternative (different outcome family, added interaction, transformed covariate, etc.), and show that the new PPC is visibly better. This is the first time students see the check drive model choice rather than passively confirm it.

The Easy → Medium transition hands the tool to the student. The Medium → Difficult transition adds the technical name and — more importantly — the practice of *acting on* what the check reveals. The vocabulary "posterior predictive check" is withheld until Difficult so that the practice (look at the picture, reason about it, eventually iterate on the model) accumulates before the jargon arrives.

**Worked example: using the fitted model to answer questions (`marginaleffects`) across three levels.** Temperance's job is to get from the fitted DGM to the question we actually asked. Raw parameters rarely *are* the answer — log-odds, multinomial coefficients, and interaction terms are not on the outcome scale a student or stakeholder can read. (Parameter *interpretation* on whatever scale R returns happens earlier, in Courage's three-fit interpretation block; Temperance picks up where that leaves off, with the model already fit and the parameters already read.) The `marginaleffects` package — [**Model to Meaning: How to Interpret Statistical Models in R and Python**](https://marginaleffects.com/) by Vincent Arel-Bundock — is the tool for getting from those parameters to outcome-scale answers. Each Temperance section names the package and book once (see §13.5 Ex 1's End); chapter-specific links are rarely worth adding.

- **Easy.** Predictions only. `predictions()`, `avg_predictions()`, `plot_predictions()`. The frame: *"The model's coefficients are on an awkward scale. `predictions()` gives us back numbers on the outcome scale — probabilities, counts, years, whatever the question actually needs."* Skip `comparisons()`; skip the five-decision framework; skip grid types. Knowledge drops emphasize that predictions answer *"what does the model say Y is when X = …?"* Mention the marginaleffects package and the *Model to Meaning* book in Temperance Exercise 1's End (no chapter-specific link). The current §13.5 Exercises 4–6 (predictions, plot_predictions, plot_predictions(draw = FALSE)) already operate at this level.

- **Medium.** Add comparisons. `comparisons()`, `avg_comparisons()`, `plot_comparisons()`. The frame: *"Predictions tell us the level of Y. Comparisons tell us how Y changes when X changes. Most of the questions we actually ask — causal effects, group differences — are comparisons, not predictions."* Canonical pitfall to drill: deducing a comparison by subtracting two predictions (point estimate is often right; the confidence interval is wrong). Introduce the `avg_*()` family for aggregation — unit-level estimates vs. aggregated summaries. Link to the [Comparisons chapter](https://marginaleffects.com/chapters/comparisons.html).

- **Difficult.** Introduce the full framework explicitly: the five decisions — **quantity**, **predictor grid**, **aggregation**, **uncertainty**, **test** — and the habit of answering them *deliberately before computing anything*. Introduce the **grid types** (empirical, representative, counterfactual) and have students choose consciously rather than accept defaults. Link to the [Challenge chapter](https://marginaleffects.com/chapters/challenge.html) (why raw coefficients mislead) and the [Framework chapter](https://marginaleffects.com/chapters/framework.html). The Difficult-level frame: *"Define your quantity of interest first, then pick the `marginaleffects` tool that delivers it — don't start from the function and work backward."* Slopes (partial derivatives of prediction with respect to a continuous predictor) are intentionally **not** introduced at any level — the Primer's causal framing is about differences between potential outcomes, not instantaneous rates of change.

The question `marginaleffects` answers — "what is the model saying, on the outcome scale?" — stays fixed across all three levels. What changes is: (Easy → Medium) adding comparisons as a second kind of QoI; (Medium → Difficult) adding deliberate choice across all five framework axes.

**Worked example: Preceptor Table and Population Table footnote sophistication across three levels.** The tables themselves do not change across tiers. Every example tutorial shows the full Preceptor Table and Population Table, with the same column structure, the same `gt` conventions (spanners, alignment, hatching, `"..."` vs. hatch for unobservable potential outcomes, per-row layouts), and the same row counts (Preceptor: 4; Population: 11). What scales is what the **footnotes** say.

- **Easy.** Footnotes include scaffolding for students first encountering these tables:
  - The title footnote explains what a Preceptor (or Population) Table *is*, not just what question it would answer. E.g., *"A Preceptor Table is the smallest table such that, if every cell were filled with its true value, answering the question 'Does winning a gubernatorial election cause longer life?' would be easy."*
  - For causal tables, the per-row causal-effect footnote (§10.3) walks through the subtraction explicitly: *"The causal effect for Clayton Williams is 85 − 88 = −3 years. Because the Preceptor Table shows the unobservable truth, this is the true causal effect for him, not an estimate."*
  - Other footnotes (unit, outcome, treatment, covariates) stay at the plainest level — what each column means, nothing more.

- **Medium.** The scaffolding goes away. The title footnote becomes the canonical §10.3 form — *"If all the information in this table were available, we could answer the question: [Question]."* — with no further explanation of what a Preceptor Table is. The per-row causal-effect footnote is **dropped**; students are expected to read the subtraction off the row themselves. What replaces the scaffolding is **more sophisticated discussion inside the remaining footnotes**: why these specific column values rather than plausible alternatives, what ambiguity in the question forced the author's hand, what measurement issues sit behind the covariates.

- **Difficult.** Footnotes deepen further: subtle unit-definition edge cases, covariate non-overlap between Data and Preceptor rows in the Population Table, validity concerns that span multiple columns at once, representativeness concerns tied to specific rows in the visible table.

**Practical consequence for regeneration.** Authors generating Easy, Medium, and Difficult versions of the same problem copy the same `gt` skeleton — same tibble, same spanners, same alignment, same hatching — and only rewrite the footnote strings. The gt code is stable; the pedagogical work lives in the footnote authoring.

### 1.4 Build and rebuild strategy

The Primer is designed so that most example tutorials (and the chapters that match them) can be generated from this file plus the seed specifications in §17. The reason the system works this way, rather than as a set of hand-written artifacts edited individually forever:

**Cross-cutting changes are expensive to propagate manually.** If we change the canonical definition of stability, or adjust how the Easy → Medium transition for representativeness works, the hand-edit path requires walking through all the tutorials (and their matching chapters) — and we will miss things. The regeneration path updates Key Concepts (the canonical wording) or §1.3 (the tier-routing rules) or §13 (the exercise specifications), then rebuilds the affected tutorials from the updated spec. Consistency is enforced by construction.

**Definition-only edits do not need a rebuild.** Changing just the wording of a canonical definition in Key Concepts works as find-and-replace in every tutorial. Regeneration earns its keep for *structural* changes: progression pacing (is Medium too steep between Tutorial 7 and Tutorial 8?), coverage (has this tutorial asked the canonical exercises from §13 that are due this tutorial?), cross-tutorial consistency (do the Difficult tutorials consistently drive model revision from the PPC per §1.3?). These are hard to see when each tutorial is considered in isolation and hard to fix without walking the whole sequence.

**The seed lives in §17.** Each example tutorial's entry in §17 specifies the "Imagine that you are…" scenario, the dataset, the outcome variable, the treatment / key covariate, the Quantity of Interest (QoI), the model, and the Preceptor and Population Table column structure. That — plus the rules in §4–§14 — is enough to regenerate a tutorial from scratch. The §17 entries are the stable core; everything around them (exercise wording, knowledge drops, specific transitions) is derivative.

**Writing order.**

1. **Tutorials first, in curriculum order, Easy → Medium → Difficult.** Write Tutorial 06 (the first example), then 07, 08, and so on up through 14. Expect back-and-forth: when you reach the last Medium tutorial you may realize the Medium sequence progressed too slowly (or too quickly) and the earlier Medium tutorials need adjustment. Plan for at least one revision pass once the last Medium tutorial is drafted, and another once the last Difficult tutorial is drafted. This is not a failure mode; it is the price of calibrating the progression only after seeing where it lands.
2. **Chapters after tutorials.** Each example chapter extends its paired tutorial: same primary question, same Preceptor and Population Tables, same fitted model, but with more EDA, more candidate models, more exploration (§1.2). Chapters also cover the *paired* question — the opposite framing (causal if the tutorial is predictive, predictive if causal) — which the tutorial does not. Writing chapters against finished tutorials is easier than the reverse.

**What this plan depends on.**

- §17 seed entries must be kept current. If a tutorial's dataset or model changes, update §17 before regenerating.
- Tutorial directory names and YAML `id:` fields do not change during regeneration. Student progress records are keyed on those, so directory stability protects continuity — though answers to exercises that got reworded will not map cleanly. Treat each major regeneration like a breaking release: bump the package version, describe the change in `NEWS.md`, tell students they may want to redo the affected tutorials.
- The miscellaneous tutorials (01 Probability, 02 Sampling, 03 Rubin Causal Model, 04 Cardinal Virtues) have only one-line §17 entries today (`Type: miscellaneous`). For those to be regeneratable the same way, §17 would need richer seed content per misc tutorial. Until then, treat misc tutorials as hand-edited rather than regenerated.
- The LLM doing the regeneration must have this file as context. That is by design — `CLAUDE.md` is the only reference either author needs.

**Operational notes.**

- **LLM regeneration is not deterministic.** The same §17 seed plus the same CLAUDE.md can produce meaningfully different tutorial drafts on two different runs. Some drift is fine — it may even self-edit in useful ways — but budget a human QA pass after each rebuild. Do not expect bit-identical reproduction across runs.

- **Chapter regeneration is more expensive than tutorial regeneration.** Chapters carry the paired-question requirement (§1.2) that tutorials do not: one fitted model serving two framings, two Preceptor Tables, two Population Tables, two sets of Temperance answers. More moving parts, more places the LLM can drift. Plan for chapter QA to take longer than tutorial QA.

- **Branch-based rebuilds.** Regenerate on a feature branch (e.g., `rebuild/2026-05`), review the full diff there, merge to `main` only when satisfied. Keeps main-branch history clean and gives a reversible fallback if a rebuild goes sideways.

- **Cap revision cycles.** The writing order above expects revision when the last Medium tutorial reveals earlier Medium tutorials need adjustment. Set a budget: at most two Easy → Medium calibration passes and two Medium → Difficult passes. If the second pass is not converging, the *progression design* itself needs reconsideration — not another revision pass.

### 1.5 Curriculum shape and sequencing

The 12 example tutorials are arranged under three rules that operate together:

1. **Predictive / causal alternation.** The sequence alternates predictive and causal tutorials, starting with predictive:
   ```
   Pos  1  2  3  4  5  6  7  8  9  10  11  12
        P  C  P  C  P  C  P  C  P  C   P   C
   ```
   Six of each. A reader moving through the curriculum sees the causal / predictive distinction reinforced every time a new dataset arrives: we just did a predictive version; now here is a causal one. The rule is a hard constraint — do not drop two predictive tutorials in a row to "simplify," and do not push all the causal tutorials to the end.

2. **EMH 4/4/4, fixed by tutorial number.** Positions 1–4 are Easy, 5–8 Medium, 9–12 Hard. Because the directory numbering runs 05–16 for example tutorials, **the tutorial number alone determines the tier**:

   | Tutorial number | Position | Tier |
   |---|---|---|
   | 06, 07, 08, 09 | 1–4 | **Easy** |
   | 10, 11, 12, 13 | 5–8 | **Medium** |
   | 14, 15, 16, 17 | 9–12 | **Hard** |

   This is a hard rule, not a suggestion. When an author is asked to (re)write a specific tutorial — e.g. "redo tutorial 11" — the tier is given by the number: tutorial 11 is Medium, full stop. Do not look up §17 to decide; the number is sufficient. The split is an *artifact* of twelve. At 14 tutorials the split becomes 5/5/4 or 4/5/5 with judgment on where the boundaries fall; at 16, 6/5/5 or 5/6/5. The boundary-smoothing principle from §1.3 (*"the last Easy tutorial should be just slightly simpler than the first Medium tutorial"*) is the thing that actually governs sequencing; EMH is the label we put on it for discussion.

3. **Random forest at the end.** Positions 11 and 12 are the non-parametric tutorials — position 11 predictive, position 12 causal. Random forests (or equivalent non-parametric approaches) come last because they complete the arc from "parameters mean something literal" (Easy linear) through "parameters are on a link scale, use `marginaleffects` to interpret" (Medium) to "parameters are not the point at all, use `marginaleffects` or stop" (Hard). The student who reaches position 11 has already seen why direct parameter interpretation fails for link-scale models; RF is the culmination of that lesson, not a surprise.

**Corollary.** Because P/C alternation is a hard rule, any change to the roster of tutorials is a paired change: adding or dropping a tutorial means adding or dropping its alternation partner too (or recasting an existing tutorial from P to C or vice versa). See §17 for the current roster and gap flags.

### 1.6 Pedagogical commitments to hammer

A short list of cross-curriculum commitments that should appear, in fresh wording each time, across many tutorials. These are not concepts to define once and move on from; they are *how we talk*, and we say them often. Per §12, knowledge drops are thematic templates, not verbatim text — each appearance of one of these commitments should be rephrased.

Each commitment below names: the rule, why it matters, and concrete phrasings/anti-phrasings to use as guides. Authors should reach for these explicitly when an exercise involves the relevant concept. M and H tutorials should *contrast* the right phrasing with the wrong one at least once — that is what makes the commitment land.

**Relationship to §12.6 *Progressive knowledge-drop themes*.** §1.6 and §12.6 overlap in scope but answer different questions. §1.6 is *what we believe and say uniformly* — commitments that hold across all tutorials and all tiers, restated in fresh language each time. §12.6 is *what we teach in stages* — themes (QMD/R world, package ecosystems, language discipline, etc.) that climb a sophistication ladder L1 → L2 → … as the curriculum progresses. A topic that appears in both lists has both faces: §1.6 captures the *commitment*, §12.6 the *staged delivery*. Theme 4 in §12.6 (Language discipline) is exactly Commitment 1 in §1.6, viewed through the staged-delivery lens; that overlap is intentional.

1. **Comparison language, not causal language, with predictive models.** When interpreting a coefficient in a *predictive* model, describe a comparison between two groups, never a "change" or "rise" or "raise" that one variable produces in another. The latter implies causation; predictive models do not warrant that claim.
   - **Right:** *"When we compare two groups of colleges that differ by $10,000 in tuition, the higher-tuition group has a graduation rate about 9 percentage points higher."*
   - **Wrong:** *"Raising tuition by $10,000 raises graduation rate by 9 percentage points."* (Implies causal effect of price on graduation.)
   - **Wrong:** *"When tuition rises by $10,000, graduation rate rises by 9 percentage points."* (Same problem in different syntax.)
   - In M/H predictive tutorials, write at least one End that contrasts the right phrasing with the wrong, so students see the difference.
   - For *causal* models (06-trains, the causal positions in M/H), causal language is required, not forbidden — but only after the unconfoundedness assumption is named and defended. The rule is *"match your language to your identification strategy"* (§12.6 Theme 4 L3).

2. **"Might be biased," not "will be biased" — uncertainty, not certainty.** Bias under representativeness violations, validity slippage, or stability violations is a *reason to suspect*, not a guarantee. A non-representative sample can produce the right answer by pure luck; we have no principled reason to expect that, but we also can't claim it never happens. Always use *might*, *may*, or *probably* — never *will*.
   - **Right:** *"When representativeness is violated, our parameter estimates might be biased."*
   - **Wrong:** *"When representativeness is violated, our parameter estimates will be biased."*

3. **Distribution change ≠ stability violation.** A change in the distribution of any variable — its level, its spread, its mix — does not, by itself, violate stability. Stability is about the *parameters* (β₀, β₁, slopes, residual variance). Hammer this point: students very often confuse "the world has changed" (which is always true) with "stability has failed" (which is more specific). See §1.3 *Worked example: Stability* and §13.3 Ex 7 spec for the rule that the End drop should hit this point three times within the same paragraph (level / spread / mix → distribution; slope → parameter).

4. **Expected values describe groups, not individuals.** β > 0 says males are *on average* taller than females; it does *not* say every male is taller than every female. Distributions overlap. When a coefficient's confidence interval excludes zero, that establishes a difference in *expected outcome* between groups, not a guarantee about every individual unit. See §12.5 *On expected values vs. individual units* for the canonical knowledge drop.

5. **Percentage points vs. percent: be precise.** When the outcome is a proportion (graduation rate, probability, share), distinguish *percentage points* (absolute) from *percent* (relative). A coefficient of 0.090 on `grad_rate` is **9 percentage points**, not 9 percent — going from a 60% baseline to 69% is a 9 pp increase, but a relative increase of 15%. Saying "9 percent" when you mean "9 percentage points" misleads readers about the magnitude. Always name the unit.

6. **Parameters are tools, not answers.** We don't really care what β₁ is; we care what the model predicts on the outcome scale. `marginaleffects` is the bridge from parameters to predictions/comparisons. Especially for models on a link scale (logistic, multinomial, ordinal), parameter interpretation is a teaching device — the actual answer always comes from `predictions()` or `comparisons()`. See §13.5 *Interpretability ceiling by model family*.

7. **The world is always more uncertain than our models suggest.** Closing line of every tutorial's Summary, and the spirit of every Justice section. Confidence intervals reflect *sampling* uncertainty around a model whose assumptions are themselves uncertain. The reported CI is always too narrow.

This list is meant to grow. When a recurring pedagogical commitment surfaces in two or three tutorials, consider adding it here; when an existing item reaches the point where it is so well-internalized in the curriculum that it no longer needs hammering, consider retiring it.

---


## 8. Spaced repetition

We believe spaced repetition works, and we care more about repetition than precise spacing. The goal: three months after finishing the tutorials, a student can still answer questions about our key definitions.

**Example chapters** repeat all definitions and concepts every time — each chapter is self-contained.

**Example tutorials** do not repeat everything every time; doing so would make each tutorial too long. Instead, use a schedule like: ask in tutorials 1, 2, 3, skip tutorial 4, ask in 5, skip 6 and 7, ask in 8, skip 9 and 10, ask in 11, and so on. Exact cadence can vary; the principle is "ask often early, then space out."

Spaced repetition pairs with progressive sophistication (§1.3): when a recurring concept reappears, it should appear at the next sophistication level — not as the same question restated.

Before writing a tutorial, read §17 for the problem specification (dataset, question, model, tables) and apply §8's spaced-repetition judgment.

---

