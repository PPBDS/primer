# CLAUDE.md



This file is the working reference for creating data science education artifacts.  The first artifact is a chapter in the textbook *Preceptor's Primer for Bayesian Data Science: Using the Cardinal Virtues for Inference*. The second artifact is a matching learnr tutorial. Every chapter has an associated tutorial and vice versea. The third artifact is a class exercise which covers similar material. The file is addressed to Claude. David Kane is the author; Claude is the co-author he collaborates with to produce new material.

The goal is that this file is the only reference either of us needs when starting work on a new chapter/tutorial pair or new class exercise. If any other document in the project conflicts with what's written here, this file wins.

## Contents

1. **Project** — what the Primer is; curriculum shape; Easy / Medium / Difficult progressions (representativeness, validity, stability, unconfoundedness, model checking, `marginaleffects`)
2. **Working with David** — collaboration protocol
3. **Output artifacts and file conventions** — where files live, naming
4. **Chapter structure** — the six sections of an example chapter
5. **Tutorial structure** — YAML, setup chunk, child documents
6. **Question flow** — Start / exercise / End
7. **Exercise types** — code / written-with-answer / written-without-answer
8. **Spaced repetition** — the curriculum-level pattern
9. **AI-mediated code exercises** — how students use AI to write code
10. **Preceptor and Population Tables** — `gt` code, conventions
11. **Canonical definitions** — convenience snapshot of the Key Concepts chapter wordings (the chapter is the source of truth)
12. **Knowledge drop library** — pedagogical beats, organized by virtue
13. **Master exercise list** — per-virtue exercise template
14. **Guidance for tutorial authors** — cross-cutting rules
15. **R tooling** — packages, setup chunk
16. **Open items** — pending TODOs
17. **Per-tutorial problem specifications** — Imagine, dataset, model, tables per tutorial

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

**Miscellaneous** chapters/tutorials cover topics that do not involve a major data science exercise. The current five are Probability, Sampling, Rubin Causal Model, Cardinal Virtues, and Mechanics.

The target curriculum is **17 chapter/tutorial pairs total**: the 5 miscellaneous above and **12 example chapters**. Twelve is a working target, chosen because it divides cleanly into 4 Easy / 4 Medium / 4 Hard and pairs with the predictive/causal alternation rule (§1.5). The sequence can grow to 14 or 16 later without changing the design principles — the EMH 4/4/4 split is an artifact of the current size, not a constraint on the final shape.

### 1.2 Chapter ≠ tutorial

Chapters are longer than tutorials. Every example chapter covers the same primary question as its matching tutorial — same question, same Preceptor Table, same Population Table, same fitted model — but in more depth: more EDA, more candidate models, more exploration. Almost every line of code in the tutorial also appears in the chapter.

In addition, every example chapter includes a **paired question**: a second question that uses the same outcome variable and the same covariates as the primary question, but with the opposite framing. If the primary question is causal, the paired question is predictive; if the primary is predictive, the paired is causal. The paired question gets its own Preceptor Table and its own Population Table. The key insight is that the **same fitted model** serves both questions — the outcome and covariates are identical. What differs is the assumptions the analyst is willing to make and the language used to interpret results.

The chapter therefore has two Preceptor Tables, two Population Tables, one fitted model, and two sets of answers in Temperance.

The "Imagine that you are…" opener is the same in the chapter and the tutorial. Reuse, don't rewrite.

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

**The seed lives in §17.** Each example tutorial's entry in §17 specifies the "Imagine that you are…" scenario, the dataset, the outcome variable, the treatment / key covariate, the question (QoI), the model, and the Preceptor and Population Table column structure. That — plus the rules in §4–§14 — is enough to regenerate a tutorial from scratch. The §17 entries are the stable core; everything around them (exercise wording, knowledge drops, specific transitions) is derivative.

**Writing order.**

1. **Tutorials first, in curriculum order, Easy → Medium → Difficult.** Write Tutorial 06 (the first example), then 07, 08, and so on up through 14. Expect back-and-forth: when you reach the last Medium tutorial you may realize the Medium sequence progressed too slowly (or too quickly) and the earlier Medium tutorials need adjustment. Plan for at least one revision pass once the last Medium tutorial is drafted, and another once the last Difficult tutorial is drafted. This is not a failure mode; it is the price of calibrating the progression only after seeing where it lands.
2. **Chapters after tutorials.** Each example chapter extends its paired tutorial: same primary question, same Preceptor and Population Tables, same fitted model, but with more EDA, more candidate models, more exploration (§1.2). Chapters also cover the *paired* question — the opposite framing (causal if the tutorial is predictive, predictive if causal) — which the tutorial does not. Writing chapters against finished tutorials is easier than the reverse.

**What this plan depends on.**

- §17 seed entries must be kept current. If a tutorial's dataset or model changes, update §17 before regenerating.
- Tutorial directory names and YAML `id:` fields do not change during regeneration. Student progress records are keyed on those, so directory stability protects continuity — though answers to exercises that got reworded will not map cleanly. Treat each major regeneration like a breaking release: bump the package version, describe the change in `NEWS.md`, tell students they may want to redo the affected tutorials.
- The miscellaneous tutorials (01 Probability, 02 Sampling, 03 Rubin Causal Model, 04 Mechanics, 05 Cardinal Virtues) have only one-line §17 entries today (`Type: miscellaneous`). For those to be regeneratable the same way, §17 would need richer seed content per misc tutorial. Until then, treat misc tutorials as hand-edited rather than regenerated.
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

2. **EMH 4/4/4, fixed by tutorial number.** Positions 1–4 are Easy, 5–8 Medium, 9–12 Hard. Because the directory numbering runs 06–17 for example tutorials, **the tutorial number alone determines the tier**:

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
   - For *causal* models (07-trains, the causal positions in M/H), causal language is required, not forbidden — but only after the unconfoundedness assumption is named and defended. The rule is *"match your language to your identification strategy"* (§12.6 Theme 4 L3).

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

## 2. Working with David

The authoring of a chapter/tutorial pair is a conversation. Do not try to produce a finished chapter in one shot. The rough protocol:

1. **David picks the topic or gives a pointer.** Example: "Write chapter 9, on logistic regression."
2. **Claude proposes the framing.** Candidate dataset(s), the Imagine-that-you-are scenario, the broad question, a specific narrow question (the QoI), and whether the tutorial (and therefore the primary question) will use a predictive or causal model. Offer two or three options where there is real choice. Also propose the paired question — the opposite framing using the same outcome and covariates.
3. **David picks.** Iterate on the dataset, the unit, the outcome, the treatment (if causal), and a short list of covariates. The same choices govern both the primary and the paired question.
4. **Claude drafts both Preceptor Tables and both Population Tables** as `gt` code — primary question first, paired question second. David reviews and corrects.
5. **Claude drafts the chapter Wisdom section**, then the tutorial Wisdom section. David reviews. Repeat by virtue: Justice, Courage, Temperance.
6. **Claude checks spaced-repetition coverage** against the per-tutorial specifications in §17 and adjusts which recurring questions this tutorial asks.

This protocol is a default; deviate when it makes sense. Where a decision is small and reversible (phrasing of a knowledge drop, which concrete example to use in an exercise), just make it. Where a decision shapes the rest of the chapter (dataset, QoI, functional form), pause and ask.

When you pause to ask, make it easy for David to answer: short list of options, your recommendation, your reasoning. Do not ask open-ended questions when a multiple-choice question will do.

---

## 3. Output artifacts and file conventions

Chapters are Quarto files with the top-level `#` already set by the book structure; use `##` for virtue-level sections. Filename convention: `NN-name.qmd` where `NN` is the two-digit chapter number and `name` is the dataset (for example chapters) or a descriptive slug (for miscellaneous chapters) — e.g. `04-cardinal-virtues.qmd`, `08-trains.qmd`, `13-colleges.qmd`.

Tutorials are R Markdown files with `learnr::tutorial` output. They live in the `primer.tutorials` package under `inst/tutorials/NN-name/tutorial.Rmd`, where `NN` is the two-digit chapter number (e.g. `06-recruits`, `14-ces`). The tutorial's `id` in the YAML is `NN-name`, lowercase, dashes for spaces, identical to the directory name. For example tutorials, `name` is the tibble the tutorial fits on — usually the upstream dataset's name (`trains`, `nes`, `governors`, `shaming`, `ces`, `colleges`, `stops`), but a *role-based* name when the tutorial ships its own packaged cut (`recruits` for the NHANES cut in `06-recruits`; see §3.1). Student repo names in operational exercises match the tutorial directory name, so everything (directory, id, repo, packaged tibble where applicable) shares one string per tutorial.

For new chapters, produce a single `.qmd` file. For new tutorials, produce a single `.Rmd` file with the structure described in §5. Do not emit partial diffs; produce complete files David can drop in place.

**Creating a new tutorial directory.** When authoring a new example tutorial from scratch, create the directory and its contents explicitly — do not assume they exist. The surviving tutorials in `inst/tutorials/` are the five misc ones (01–05) plus `99-project`; every example tutorial (06–17) starts from an empty directory.

Minimum layout for a new tutorial — run these creations in order when starting fresh:

1. `mkdir -p primer.tutorials/inst/tutorials/NN-name` — the tutorial directory.
2. Create `primer.tutorials/inst/tutorials/NN-name/tutorial.Rmd` — the tutorial file, with the full structure from §5 (YAML header, setup chunk, three child-document inclusions, virtue sections, exercises, Summary, download-answers child document).

**Additional structure for tutorials with an expensive fit** (per §5.6 — `**Expensive fit:** Yes` in the §17 entry):

3. `mkdir -p primer.tutorials/inst/tutorials/NN-name/data-raw` — holds the `prefit.R` script that regenerates the stored fit.
4. Create `primer.tutorials/inst/tutorials/NN-name/data-raw/prefit.R` — runnable R script that fits the model and writes `../data/fit_<n>.rds`. Header comment should record the package versions used to fit.
5. `mkdir -p primer.tutorials/inst/tutorials/NN-name/data` — holds the `.rds` output.
6. Run `Rscript data-raw/prefit.R` from the tutorial directory to generate the `.rds` — do *not* commit the `.rds` unless the fit genuinely needs caching and its size is reasonable. The `.rds` is what the setup chunk loads via `readRDS(system.file(...))`.

Tutorials **without** an `**Expensive fit:**` flag should not create the `data/` or `data-raw/` subdirectories. An empty-or-almost-empty `data/` is a code smell — per §5.6, authors reviewing existing tutorials should delete unreferenced `.rds` files on sight.

**Directory-creation is explicit, not implicit.** When an authoring session generates a new tutorial, it should issue the `mkdir` calls (or the equivalent file-creation moves) as part of the generation workflow. Do not assume a tutorial directory exists just because §17 lists it — if the filesystem check fails, create the directory, then write the `tutorial.Rmd`.

### 3.1 Tutorial-specific datasets shipped with `primer.tutorials`

Some tutorials need a curated cut of an upstream dataset rather than the full upstream tibble — to make uncertainty visible at the picture, to balance group sizes, to limit columns, or to lock a sample so every student gets the same rows. We ship those cuts as datasets in the `primer.tutorials` package itself, using the standard CRAN `data/` + `data-raw/` + `R/` pattern. The first such dataset is `recruits` (a 50-row, 40-male / 10-female cut of NHANES used by `06-recruits`); the same pattern applies to any future tutorial-specific cut.

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

**When to ship vs. when to slice in-tutorial.** Ship a dataset when one of the following is true:

- The transformation is non-trivial (composite covariates, stratified sampling, joins).
- The tutorial benefits from every student seeing exactly the same rows (uniform canonical answers, reproducible plots).
- A `slice_sample()` in the setup chunk would force `set.seed()` ceremony or produce different fits on different runs.

A blanket rule that *every* tutorial use a packaged dataset is overkill — datasets like `trains` are already small, balanced, and don't need re-cutting. Use the pattern when there is a real reason; ad-hoc filtering that a single `filter() |> select()` line can do in setup does not need its own `.rda`.

**Naming convention.** The packaged tibble's name should describe the *role* it plays in the tutorial (`recruits`, `voters`, `households`), not the upstream dataset name + size suffix (`nhanes_50`). The role-based name survives later N changes; the size-suffix name doesn't. Use the same name for the tutorial directory (`06-recruits`), the YAML `id` (`06-recruits`), and the student repo. One string per tutorial.

---

## 4. Chapter structure

Every example chapter has six top-level sections under `#`:

1. **Introduction** — `##`-level. Names the four Cardinal Virtues. Gives one "Imagine that you are…" paragraph motivating the problem. Names the dataset. Typically 2–6 paragraphs.
2. **Wisdom** — primary question (matching the tutorial) and its Preceptor Table, then EDA, then the paired question and its Preceptor Table. The two questions use the same outcome and covariates; one is causal, the other predictive. Present the primary question first.
3. **Justice** — two Population Tables, one per question. Validity, stability, and representativeness apply to both. Unconfoundedness applies only to the causal question (whether primary or paired).
4. **Courage** — mathematical structure, candidate models, tests, the selected Data Generating Mechanism. One fitted model serves both questions, because both questions use the same outcome and covariates. In later chapters, a posterior predictive check.
5. **Temperance** — two sets of interpretation and answers, one per question. Interpret the primary question first, then the paired question. Note carefully where causal language is and is not appropriate.
6. **Summary** — one final graphic, one concluding paragraph, and the sentence "The world is always more uncertain than our models would have us believe."

Chapters include full image references (`knitr::include_graphics("other/images/Wisdom.jpg")` etc.) at the top of each virtue section. Chapters quote extensively — from Tukey, from Rumsfeld, from the Bible, from whomever fits. Quotes are good; use them.

**Every example chapter includes a discussion of quantity-of-interest variety.** Each tutorial picks one narrow QoI — usually an expected value (*"the average height of male and female USMC recruits"*). The chapter should spend a paragraph or two inside Temperance naming the *other* QoIs a real practitioner would care about and showing which ones the fitted DGM already answers versus which ones need more work. For the NHANES chapter the riff is: *average height is convenient but tells you nothing about the tallest recruit you need to fit (a max), or about how many small-vs-large uniforms to order (quantiles — the 10th and 90th, say), or about how tall the tallest recruit out of a specific batch of three will be (a distribution over sample statistics, which needs simulation).* The chapter names these candidate QoIs, sketches how to get at each from the same fitted DGM, and describes the simulation step — take the DGM, draw `n` synthetic units, record the statistic of interest, repeat many times, build a PDF — without necessarily teaching the full mechanics. The point is that **"average" is one question in a family of questions**, and the DGM answers the whole family once you know how to ask.

This topic is chapter-only at Easy and Medium tiers. Hard tutorials may surface it as a knowledge drop; see §12.6 Theme 5 for the progressive schedule.

Chapters also benefit from an EDA section richer than the tutorial's — chapter authors should include at least one plot per covariate plus one plot showing the outcome conditional on the key covariate, and a paragraph naming anything strange in the data (missingness patterns, outliers, coding quirks). Tutorials budget two EDA plots; chapters can run three to five without bloat.

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

# Packages below are what we want students to load themselves at the
# R prompt / in the QMD. They are listed in the tutorial so that (a) we have access
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

Three child-document inclusions are standard. Place them immediately after the setup chunk, before the Introduction section:

```r
```{r copy-code-chunk, child = system.file("child_documents/copy_button.Rmd", package = "tutorial.helpers")}
```

```{r info-section, child = system.file("child_documents/info_section.Rmd", package = "tutorial.helpers")}
```
```

The third child document, `download_answers.Rmd`, goes at the very end of the tutorial (after Summary):

```r
```{r download-answers, child = system.file("child_documents/download_answers.Rmd", package = "tutorial.helpers")}
```
```

These are part of the framework. Do not reinvent them.

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

Within a section, each `### Exercise N` has three parts: **Start**, **exercise code chunk(s)**, and **End**. Every exercise ends with at least one Continue button (triple hash, `###`) before the next one begins.

### 6.1 Start

The Start is one or two sentences of framing and then the question itself. Two rules:

- **Two-sentence rule.** Students will not read more than two sentences at a time. If the Start is longer than two sentences, insert a `###` (Continue button) to break it into pieces.
- If the Start is short (one or two sentences), the question code chunk follows immediately without a `###` between them.

Students tend to click Continue until they see a question. They then read the sentence or two *immediately before* the question closely, because they don't know whether that text is needed to answer. That is your best place to teach.

### 6.2 Exercise code chunk(s)

Follow the `tutorial.helpers` conventions:

- **Exercise chunk.** Label it `{section}-{N}` (e.g., `wisdom-3`). This is where the student's answer goes.
- **Hint chunk.** Label `{section}-{N}-hint-1`. Include `eval = FALSE` because the hint is often not legal R code. Almost always only one hint.
- **Test chunk.** Label `{section}-{N}-test`. Include `include = FALSE`. Contains the code that the exercise expects to work — the canonical answer. We never show this to students; it exists so we can verify our own examples still run.

Hint and test chunks are only for code exercises. Written-answer exercises don't have them.

Most of the time there is **no** `###` immediately before the exercise code chunk — the Start runs directly into the code.

### 6.3 End

After the exercise code chunks, always place a `###` (to give the student a Continue button to pause on their output) and then a short End: one or two sentences of knowledge drop.

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

### 7.1 Code exercise

Student writes R code in the exercise chunk. Has a hint chunk and a test chunk. The test chunk contains the canonical answer; the exercise chunk is empty (or has scaffolding). With AI-mediated authoring (§9), most code exercises are now single-shot: state the goal, let the student prompt AI, paste and run.

```r
```{r courage-3, exercise = TRUE}

```

```{r courage-3-hint-1, eval = FALSE}
linear_reg(engine = "lm") |>
  fit(...)
```

```{r courage-3-test, include = FALSE}
linear_reg(engine = "lm") |>
  fit(att_end ~ treatment, data = trains)
```
```

### 7.2 Written exercise with model answer

A `question_text()` with `message = "..."` containing the canonical answer, `allow_retry = FALSE`, `incorrect = NULL`. Used for questions that have a correct answer — definitions, conceptual framings, recall. Students see our answer after submitting theirs.

```r
```{r wisdom-2}
question_text(NULL,
    message = "A Preceptor Table is the smallest possible table of data with rows and columns such that, if there is no missing data, we can easily calculate the quantity of interest.",
    answer(NULL, correct = TRUE),
    allow_retry = FALSE,
    incorrect = NULL,
    rows = 6)
```
```

The text in `message` is read closely by students, who compare their answer to ours. Our answer must be excellent. Use the wording from Key Concepts verbatim for definitional questions (the §11 snapshot is a convenience copy).

### 7.3 Written exercise without model answer

A `question_text()` with no `message`, `allow_retry = TRUE`, `try_again_button = "Edit Answer"`. Used only when there is no single correct answer — typically when the student is asked to run a diagnostic command like `show_file()` and paste the output, or to describe something specific to their own analysis. Do not use this type for definitional or conceptual questions.

```r
```{r introduction-2}
question_text(NULL,
    answer(NULL, correct = TRUE),
    allow_retry = TRUE,
    try_again_button = "Edit Answer",
    incorrect = NULL,
    rows = 3)
```
```

### 7.4 Operational conventions: "CP/CR", `show_file()`, and "the R prompt"

Many operational exercises end with the string **CP/CR**, short for *copy/paste the **c**ommand and the **r**esponse*. Students copy/paste both the command they sent to R (or the shell) and the response R gave back. Students know what it means by the time they get past the first tutorial. Exception: the **very first tutorial** should spell it out once, inside the exercise Start, before using it as shorthand.

`show_file()` (from `tutorial.helpers`) prints the contents of a file in the student's project. The usual pattern: the student does something in their QMD, then runs `show_file("XX.qmd", chunk = "Last")` at the R prompt to display the last chunk, copies the output, and pastes it back into the tutorial. `chunk = "Last"` is preferred over `start = -N` because it's more robust. We never actually check what they paste; the threat of checking is the point.

The `Cmd/Ctrl + Shift + K` keystroke renders the QMD. Use it often — rendering catches bugs early, and professionals do it.

**"At the R prompt" is the canonical phrasing for running code interactively.** Do not say "in the Console" — that term is Positron- and RStudio-specific and does not translate to the VS Code / Codespaces primary environment (§README). When an exercise asks the student to run something interactively rather than by rendering the QMD, use **"At the R prompt, run …"** (or *"At the R prompt, type …"*). When describing the `Cmd/Ctrl + Enter` workflow, say the line is **"sent to the R prompt"** rather than "copied down to the Console." The metaphor is pane-neutral: every supported environment has an R prompt somewhere, even if its on-screen label varies.

---

## 8. Spaced repetition

We believe spaced repetition works, and we care more about repetition than precise spacing. The goal: three months after finishing the tutorials, a student can still answer questions about our key definitions.

**Example chapters** repeat all definitions and concepts every time — each chapter is self-contained.

**Example tutorials** do not repeat everything every time; doing so would make each tutorial too long. Instead, use a schedule like: ask in tutorials 1, 2, 3, skip tutorial 4, ask in 5, skip 6 and 7, ask in 8, skip 9 and 10, ask in 11, and so on. Exact cadence can vary; the principle is "ask often early, then space out."

Spaced repetition pairs with progressive sophistication (§1.3): when a recurring concept reappears, it should appear at the next sophistication level — not as the same question restated.

Before writing a tutorial, read §17 for the problem specification (dataset, question, model, tables) and apply §8's spaced-repetition judgment.

---

## 9. AI-mediated code exercises

Students use AI (ChatGPT, Claude, etc.) to produce code. They prompt the AI and paste the result into their tutorial. Design code exercises accordingly:

- **Do not build pipelines line-by-line with the student writing each line** the way older tutorials do. Instead, state the goal of the code clearly enough that a student could prompt an AI for it, then have them run the AI's output.
- **Be explicit about what the code should do, not what it should look like.** "Create a tibble called `x` that contains only the 1992 observations from `nes`, with no missing values" is better than a fill-in-the-blanks pipeline.
- **Knowledge drops still matter.** The student may not read the code the AI wrote carefully. Use the End of each exercise to point out what the code actually did and why it matters.

This affects the shape of Wisdom and Courage sections in particular. Wisdom has lots of "examine the data" exercises; those still make sense as AI-prompted code. Courage fits models; fitting is typically one-shot, so most of Courage is interpretation, not pipeline-building.

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
- **Code blocks are copy-paste runnable.** Every `gt` code block Claude produces must run top-to-bottom if pasted at an R prompt: `tibble::tribble()` definition, footnote string assignments, and the complete `gt::gt(...) |> ...` pipeline ending at the final `tab_footnote()`. Do not include `library()` calls — `gt` and `tibble` are assumed already loaded.
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

## 11. Canonical definitions

**Ground truth has moved.** Canonical definitions used to live here. They now live in the `Key Concepts` book chapter (`book/key-concepts.qmd`), which is the single source of truth for every definition the project uses. CLAUDE.md is no longer authoritative for the wording; when you author a tutorial or chapter, the Key Concepts entry is what gets the final word, and any older wording cached anywhere else (older drafts, prior tutorials, this file's own §1.3 worked examples, anywhere) is superseded.

The wordings below are mirrored from Key Concepts as a *convenience copy* for authoring sessions that don't want to open the book chapter. **Treat them as a snapshot, not as the truth** — if they ever drift from `key-concepts.qmd`, the chapter wins. When you change a definition, change it in `key-concepts.qmd` first, then update the snapshot here.

The §1.3 worked examples elsewhere in this file no longer carry the *definitional* content of staged definitions (representativeness, validity, stability, unconfoundedness, justice). That content has moved to Key Concepts under each definition's *Where this comes from* subsection, with content-named labels (e.g. "Single-link frame", "Outcome-only scope", "Stability and time") rather than the EMH-tier labels the worked examples use here. What remains in §1.3 is the *tier-routing rule*: which version a given tutorial-tier should use when. CLAUDE.md owns *which version to use when*; Key Concepts owns *what each version says*.

Use the wording below verbatim as the `message` text in written-answer exercises that ask for a definition. Use the same wording (or a close paraphrase) in chapter prose.

### Four Cardinal Virtues

> *Wisdom, Justice, Courage, and Temperance.*

### Wisdom

> *Wisdom begins with a question and then moves on to the creation of a Preceptor Table and an examination of our data.*

### Justice

> *Justice concerns the Population Table, the four key assumptions which underlie it (validity, stability, representativeness, and unconfoundedness), and the choice of probability family and link function for the data generating mechanism.*

### Courage

> *Courage creates the data generating mechanism.*

### Temperance

> *Temperance interprets the data generating mechanism and then uses it to answer, with the help of graphics, the question(s) with which we began. Humility reminds us that this answer is always false.*

### Rubin Causal Model

> *The [Rubin Causal Model](https://en.wikipedia.org/wiki/Rubin_causal_model) is an approach to the statistical analysis of cause and effect based on the framework of potential outcomes.*

### Potential outcome

> *A potential outcome is the outcome for an individual under a specified treatment. In a causal model there are at least two potential outcomes for each unit: the outcome under treatment and the outcome under control.*

### Causal effect

> *A causal effect is the difference between two potential outcomes.*

### Fundamental problem of causal inference

> *The fundamental problem of causal inference is that we can only observe one potential outcome.*

### Predictive versus causal models

> *Predictive models have only one outcome column. Causal models have more than one (potential) outcome column because we need more than one potential outcome in order to estimate a causal effect.*

### Units

> *Units are the rows, both in the Preceptor Table and in the data. They are determined by the original question, which also determines the quantity of interest.*

### Variables

> *Variables is the general term for the columns in both the Preceptor Table and the data. The term is more general still, since it may refer to data vectors we would like to have in order to answer the question but which are not available in the data.*

### Outcome

> *The outcome is the most important variable. It is determined by the question/QoI. By definition, it must be present in both the data and the Preceptor Table.*

### Covariates

> *Covariates is the general term for all the variables which are not the outcome. The term is used in three ways: all variables that might matter (whether in the data or not), all variables in the data other than the outcome, and the subset of those variables actually used in the model.*

### Treatment

> *A treatment is a covariate which we can, at least in theory, manipulate. Treatments appear in causal models, not predictive ones.*

### Quantity of Interest (QoI)

> *The Quantity of Interest is the number we want to estimate — the answer to a specific question. We almost always calculate a posterior probability distribution for the QoI, since in the real world we will never know it precisely.*

### Preceptor Table

> *A Preceptor Table is the smallest possible table of data with rows and columns such that, if there is no missing data, we can easily calculate the quantity of interest.*

### Preceptor Table, detailed

> *The rows of the Preceptor Table are the units. The outcome is at least one of the columns. If the problem is causal, there will be at least two (potential) outcome columns. The other columns are covariates. If the problem is causal, at least one of the covariates will be considered a treatment.*

### Population Table

> *The Population Table includes a row for each unit/time combination in the underlying population from which both the Preceptor Table and the data are drawn.*

### Validity

> *Validity is the consistency, or lack thereof, in the columns of the data set and the corresponding columns in the Preceptor Table.*

### Stability

> *Stability means that the relationship between the columns in the Population Table is the same for three categories of rows: the data, the Preceptor Table, and the larger population from which both are drawn.*

### Representativeness

> *Representativeness, or the lack thereof, concerns two relationships among the rows in the Population Table. The first is between the data and the other rows. The second is between the other rows and the Preceptor Table.*

### Unconfoundedness

> *Unconfoundedness means that the treatment assignment is independent of the potential outcomes, when we condition on pre-treatment covariates.*

### Assignment mechanism

> *The assignment mechanism is the probabilistic rule by which units come to receive one treatment value rather than another. In a randomized experiment the assignment mechanism is known and independent of the potential outcomes; in observational data it is unknown and must be modeled or assumed.*

### Sampling mechanism

> *The sampling mechanism is the probabilistic rule by which units come to appear in the data. It covers survey-sampling design, non-response, attrition, and any other process that determines who the data includes. When the sampling mechanism is correlated with the outcome or with treatment, inference about the broader population is biased.*

### Selection mechanism

> *The selection mechanism is the analyst's decision about which units the Preceptor Table includes — the scope of the question. Unlike the sampling mechanism, this is not a physical process but a scoping choice made by the analyst. When the selection mechanism excludes units whose outcomes would differ systematically, inference about the target population is biased.*

### Data Generating Mechanism (DGM)

> *The Data Generating Mechanism is the final model, the one we use to answer the question. It is a model of the process by which the world generates the data we observe.*

### Preceptor's Posterior

> *Preceptor's Posterior is the posterior distribution we would calculate if every assumption we made in Wisdom and Justice were correct. It is the best posterior achievable with our data; it is not the truth.*

---

## 12. Knowledge drop library

Short prose fragments — typically one or two sentences — that go in the End of an exercise. Organized by virtue. Cross-references to Key Concepts indicate that the knowledge drop corresponds to a canonical definition covered there (the §11 snapshot is a convenience copy).

**Knowledge drops are *thematic templates*, not verbatim text.** Each drop below names a theme — *"stability is about time"*, *"parameters are imaginary"*, *"covariates are used in three different ways"* — and gives a sample wording. **Tutorials should rephrase the drop in fresh language**, even when reusing the same theme across tutorials at the same tier. Students who read tutorial 6, then 7, then 8 and find the same paragraph pasted three times stop reading; if the wording is fresh each time, the theme registers more strongly because the student has to re-parse it. The canonical answer text inside `question_text(message = ...)` *is* fixed verbatim — that's the answer key — but the End drops that follow are author-rephrased. Aim for the same theme, different sentences.

Knowledge drops are deliberately short. Students won't read more than two sentences.

**Reduce repetition across tutorials.** A common authoring failure is to use identical knowledge drops in every tutorial — the same tidyverse blurb after `library(tidyverse)`, the same QMD/R-World speech after every `Cmd/Ctrl + Enter` exercise. Students notice, and stop reading. The fix is **progressive themes**: pick a concept (how QMD talks to R, what a package namespace is, what the tidyverse ecosystem covers, what `broom` does, how caching works) and plan a ladder of knowledge drops that deepen across the curriculum. Each appearance builds on the previous one rather than restating it. §12.6 below catalogs the themes and the intended progression. When drafting a tutorial, consult §12.6 to see which theme-level each recurring exercise should use, rather than reaching for the same knowledge drop each time.

### 12.1 Introduction

**On spaced repetition.**
> *The best way to ensure that students remember these concepts more than a few months after the course ends is spaced repetition, although we focus more on the repetition than on the spacing.*

**On professional practice.**
> *Professionals keep their data science work in the cloud because laptops fail.*

**On the Rubin Causal Model.**
> *According to the Rubin Causal Model, there must be two (or more) potential outcomes for any discussion of causation to make sense. This is simplest to discuss when the treatment has only two different values, generating only two potential outcomes.*

**On continuous treatments.**
> *If the treatment variable is continuous (like a lottery payment), then there are lots and lots of potential outcomes, one for each possible value of the treatment variable.*

**On manipulability.**
> *Any data set can be used to construct a causal model as long as there is at least one covariate that we can, at least in theory, manipulate. It does not matter whether or not anyone did, in fact, manipulate it.*

**On models as a conceptual frame.**
> *The same data set can be used to create, separately, lots and lots of different models, both causal and predictive. We can just use different outcome variables and/or specify different treatment variables. This is a conceptual framework we apply to the data. It is never inherent in the data itself.*

**On difference ≠ subtraction.**
> *A causal effect is defined as the difference between two potential outcomes. "Difference" does not necessarily mean "subtraction" — many potential outcomes are not numbers.*

**On predictive models having no treatment.**
> *With a predictive model, each individual unit has only one observed outcome. There are not two potential outcomes because none of the covariates are treated as treatment variables. Instead, all covariates are assumed to be "fixed." Predictive models have no "treatments" — only covariates.*

**On predictive language.**
> *In predictive models, do not use words like "cause," "influence," "impact," or anything else which suggests causation. The best phrasing is in terms of "differences" between groups of units with different values for a covariate of interest.*

**On causal being within-row.**
> *Any causal connection means exploring the within-row difference between two potential outcomes. There's no need to consider other rows.*

**On the iterative question.** *(Legacy — prefer the per-tutorial End specified in §13.1 Exercise 15, which comments on the chosen QoI and names one or two reasonable alternatives. This generic drop is a fallback when the author cannot write good per-tutorial commentary.)*
> *This is the first version of the question. We will now create a Preceptor Table to answer the question. We may then revise the question given complexities discovered in the data. We then update the question and the Preceptor Table. And so on.*

### 12.2 Wisdom

Canonical definitions appropriate here (see Key Concepts): Wisdom, Preceptor Table, Preceptor Table (detailed), Units, Variables, Outcome, Covariates, Treatment, Quantity of Interest.

**The Tukey walk-away.**
> *The combination of some data and an aching desire for an answer does not ensure that a reasonable answer can be extracted from a given body of data.* — John W. Tukey

**On the Preceptor Table not being exhaustive.**
> *The Preceptor Table does not include all the covariates which you will eventually include in your model. It only includes, along with the outcome(s), covariates which are mentioned in your question.*

**On the Preceptor Table forcing clarity.**
> *Specifying the Preceptor Table forces us to think clearly about the units and outcomes implied by the question. The resulting discussion sometimes leads us to modify the question with which we started. No data science project follows a single direction. We always backtrack. There is always dialogue.*

**On modeling units but caring about aggregates.**
> *We model units, but we only really care about aggregates.*

**On the outcome compromise.**
> *The outcome variable that we really care about is often not the outcome variable which our data includes. This compromise — working with what we have rather than what we really want — is a part of most data science work in the real world.*

**On three usages of "covariates."**
> *The term "covariates" is used in at least three ways in data science. First, it is all the variables which might be useful, regardless of whether or not we have the data. Second, it is all the variables for which we have data. Third, it is the set of variables in the data which we end up using in the model.*

**On treatment as covariate.**
> *Remember that a treatment is just another covariate which, for the purposes of this specific problem, we are assuming can be manipulated, thereby creating two or more different potential outcomes for each unit.*

**On time not being instant.**
> *A Preceptor Table can never really refer to an exact instant in time since nothing is instantaneous in this fallen world.*

**On looking at data.**
> *You can never look at the data too much.* — Mark Engerman

### 12.3 Justice

Canonical definitions appropriate here (see Key Concepts): Justice, Population Table, Validity, Stability, Representativeness, Unconfoundedness.

**On Justice being about concerns.**
> *Justice is about concerns that you (or your critics) might have, reasons why the model you create might not work as well as you hope.*

**On validity as a columns-thing.**
> *Validity is always about the columns in the Preceptor Table and the data. Just because columns from these two different tables have the same name does not mean that they are the same thing.*

**On validity enabling the Population Table.**
> *In order to consider the Preceptor Table and the data to be drawn from the same population, the columns from one must have a valid correspondence with the columns in the other. Validity, if true (or at least reasonable), allows us to construct the Population Table, which is the first step in Justice.*

**On the Population Table being bigger.**
> *The Population Table is almost always much bigger than the combination of the Preceptor Table and the data, because if we can really assume that both are part of the same population, then that population must cover a broad universe of time and units.*

**On the arbitrary time unit.**
> *The exact time period used — whether hour, day, month, year, or whatever — is relatively arbitrary. The important thing to note is that the Population Table, unlike the Preceptor Table, covers a period of time over which things may change.*

**On stability being about parameters.**
> *A change in time or the distribution of the data does not, in and of itself, demonstrate a violation of stability. Stability is about the parameters: β₀, β₁, and so on. Stability means these parameters are the same in the data as they are in the population as they are in the Preceptor Table.*

**On stability as a time-thing.**
> *Stability is all about time. Is the relationship among the columns in the Population Table stable over time? The longer the time period between the data and the Preceptor Table, the more suspect stability becomes.*

**On representativeness ideal and reality.**
> *Ideally, we would like both the Preceptor Table and our data to be random samples from the population. Sadly, this is almost never the case.*

**On representativeness' cost.**
> *When representativeness is violated, the estimates for the model parameters might be biased. By pure luck they may coincide with the truth, but we have no reason to expect that — and certainly nothing to defend if a critic asks how we know.*

**On stability vs. representativeness.**
> *Stability looks across time periods. Representativeness looks within time periods.*

**The crispest summary.**
> *Validity is about the columns in our Population Table. Stability and representativeness are about the rows.*

**On sampling vs. selection mechanism.**
> *Sampling mechanism and selection mechanism both concern which units we see, but they act in different places: sampling determines who ends up in the data, selection determines who ends up in the Preceptor Table. Sampling is a physical process (who answered, who showed up, who survived); selection is an analyst's scoping choice.*

**On the Heckman terminology collision.**
> *In published statistics and econometrics (notably Heckman 1979, "Sample Selection Bias"), "selection mechanism" usually refers to the data-side process — what the Primer calls sampling mechanism. The Primer reverses the emphasis deliberately: sampling is something that happened in the world, often before the analyst arrived; selection is something the analyst does when scoping the question. Students reading Heckman later should expect the terms to be used in the opposite direction.*

**On unconfoundedness being causal-only.**
> *This assumption is only relevant for causal models. We describe a model as "confounded" if this is not true. The easiest way to ensure unconfoundedness is to assign treatment randomly.*

**On randomization failing.**
> *The great advantage of randomized assignment of treatment is that it guarantees unconfoundedness, if the randomization is done correctly. There is no way for treatment assignment to be correlated with anything, including potential outcomes, if treatment assignment is random, and if the experimental set up worked as designed. Sadly, in the real world, there are sometimes problems.*

**On survey oversampling (representativeness).**
> *Many national surveys (NHANES, CPS, the census ACS) deliberately oversample specific demographic groups — older adults, racial and ethnic minorities, rural residents — so that those subgroups have enough observations for stable estimates. The raw data is not representative of the general population on that axis; the survey ships sampling weights to let analysts reweight back to representativeness. Ignore the weights and your sample over-represents whoever was oversampled. Every subsequent estimate inherits the bias.*

**On voluntary participation (representativeness).**
> *Voluntary surveys are answered by people who choose to answer. That choice is correlated with the thing being measured — politically engaged voters answer political surveys at higher rates, employed adults answer at home-phone surveys at lower rates. Voluntary participation is almost never missing-at-random, and the direction of the bias is usually predictable.*

### 12.4 Courage

Canonical definitions appropriate here (see Key Concepts): Courage, Data Generating Mechanism.

**On tidymodels.**
> *The [tidymodels](https://www.tidymodels.org/) framework is the most popular one for estimating models among R users. [Tidy Modeling with R](https://www.tmwr.org/) by Max Kuhn and Julia Silge is a great introduction.*

> *Note on "R world": this phrase is a thematic template like the rest of §12. **Do not write "the R world" in tutorial knowledge drops** — that phrase clashes with the deliberate "R World" metaphor (capitalized) we use to refer to the R session and the objects living there (§12.1, §12.4). Rephrase to something like "among R users," "for R-based modeling," "in the R modeling community," etc., per the no-verbatim-copies rule (§12 intro).*

**On dummy variables from a 2-level variable.**
> *A categorical variable (whether character or factor) like `sex` is turned into a 0/1 "dummy" variable which is then renamed something like `sexMale`. We can't have words in a mathematical formula, hence the need for dummy variables.*

**On dummy variables with N categories.**
> *The same dummy variable approach applies to a categorical covariate with N values. Such cases produce N−1 dummy 0/1 variables. The presence of an intercept in most models means that we can't have N categories. The "missing" category is incorporated into the intercept.*

**On more variables, less interpretability.**
> *The more variables we add, the more difficult it is to interpret the meaning of any particular coefficient. But interpretation also becomes less important. We don't really care about coefficients. We care about using our model to estimate quantities of interest.*

**On code being primary.**
> *In data science, we deal with words, math, and code, but the most important of these is code. We created the mathematical structure of the model and then wrote a model formula in order to estimate the unknown parameters.*

**On workspace awareness.**
> *Just because something exists in the tutorial (or in the QMD) does not mean that it is at the R prompt. You should be aware of what exists in R World, which is generally called your "workspace."*

**On why easystats isn't in the QMD.**
> *We don't add easystats to the QMD because we are only using it for an interactive check of our fitted model. However, the [easystats ecosystem](https://easystats.github.io/easystats/) has a variety of interesting functions and packages which you might want to explore.*

**On `check_predictions()`.**
> *The purpose of `check_predictions()` is to compare your actual data (in green) with data that has been simulated from your fitted model — your data generating mechanism. If your DGM is reasonable, data simulated from it should not look too dissimilar from your actual data. Of course, it won't look exactly the same because of randomness. The actual data should be within the range of outcomes that your DGM simulates.*

**On the hat and the error term.**
> *First, we have replaced the parameters with our best estimates. Second, the left-hand side variable has a hat because this formula generates our estimated outcome. A hat indicates an estimated value.*

**On the DGM being a formula.**
> *A data generating mechanism is just a formula, something which we can write down and implement with computer code. Of course, there is randomness built into the DGM, but we won't worry about that detail for now.*

**On `broom`.**
> *`tidy()` is part of the [broom](https://broom.tidymodels.org/) package, used to summarize information from a wide variety of models.*

**On caching.**
> *Including `#| cache: true` causes Quarto to cache the results of the chunk. The next time you render your QMD, as long as you have not changed the code, Quarto will just load up the saved fitted object.*

**On no hypothesis tests.**
> *Null hypothesis testing is a mistake. There is only the data, the models, and the summaries therefrom.*

**On randomness.**
> *Randomness is intrinsic to this fallen world.*

### 12.5 Temperance

Canonical definitions appropriate here (see Key Concepts): Temperance, Preceptor's Posterior.

**On Courage handing off to Temperance.**
> *Courage gave us the data generating mechanism. Temperance guides us in the use of the DGM — or the "model" — we have created to answer the question(s) with which we began. We create posteriors for the quantities of interest.*

**On parameters being imaginary.**
> *In the end, we don't really care about parameters, much less how to interpret them. Parameters are imaginary, like unicorns. We care about answers to our questions. Parameters are tools for answering questions. In the modern world, all parameters are nuisance parameters.*

**On humility.**
> *We should be modest in the claims we make. The posteriors we create are never the "truth." The assumptions we made to create the model are never perfect. Yet decisions made with flawed posteriors are almost always better than decisions made without them.*

**On data science projects beginning with a decision.**
> *Data science projects begin with a decision which we face. To make that decision wisely, we would like to have good estimates of many unknown numbers. Yet, in order to make progress, we need to drill down to one specific question. This leads to the creation of a data generating mechanism, which can then be used to answer lots of questions.*

**On `predictions()`.**
> *`predictions()` returns a data frame with one row for each observation in the data set used to fit the model.*

**On `plot_predictions()` vs. `plot_comparisons()`.**
> *We are often just as interested in comparisons as in predictions. It is tempting to think we can deduce comparisons by subtracting one prediction from another. This mostly works for the center of the distribution but definitely not for the confidence interval. If you want the difference or ratio of more than one expected value, use `plot_comparisons()`.*

**On non-treatment variables in interpretation.**
> *Whenever we consider non-treatment variables, we must never use terms like "cause" or "impact." We can't make any statement which implies more than one potential outcome based on changes in non-treatment variables. We can only compare across rows. Use phrases like "when comparing X and Y."*

**On dummy variable base values.**
> *Dummy variables must always be interpreted in the context of the base value for that variable, which is generally included in the intercept. The base value for a character variable is the first alphabetically by default. For a factor, you can change this by setting the order of the levels by hand.*

**On same data, different assumptions.**
> *The interpretation of a treatment variable is very different from the interpretation of a standard covariate. There is no such thing as a causal data set (versus a predictive one), nor causal R code (versus predictive). You can use the same data set and the same R code for both. The difference lies in the assumptions you make.*

**On parameters not "meaning" anything.**
> *Most of the time parameters in a model have no direct relationship with any population value in which we might be interested. Especially in complex and non-linear models, a coefficient like β₀ does not "mean" anything. But in simple linear models, it sometimes corresponds to something real.*

**On confidence intervals excluding zero.**
> *We care if the confidence interval for a given variable excludes zero. If not, we can't be sure whether the relationship between the variable and the outcome is positive or negative. In that case, why would we include the variable in the model at all?*

**On expected values vs. individual units.** A model coefficient describes a shift in the **expected** outcome between groups, not a guarantee about every unit in one group versus every unit in the other. β > 0 for `sexMale` says the *expected* height of male recruits is greater than the *expected* height of female recruits — it does *not* say every male is taller than every female. The two height distributions overlap; there are plenty of females taller than some males. Be careful in canonical answers and knowledge drops not to slide from the expected-value claim ("males are on average taller") to the per-unit claim ("males are taller than females") — the second is a much stronger and almost always false statement, and it is exactly the kind of reading we are trying to teach students *not* to give. The same trap applies to every parameter in every linear, logistic, multinomial, and ordinal model in the curriculum.

**On "adjust" vs. "control."**
> *We recommend the verb "adjust" in place of "control" when discussing the effect of including other variables in the model. "The causal effect is 1.5, adjusting for age and party." "Adjusting" demonstrates humility; "controlling" does not.*

**On overlapping dummy intervals.**
> *If the variable is categorical, we care whether the confidence interval for one of the dummy columns overlaps with the confidence intervals for the other dummy columns derived from that categorical variable. If so, we can't be sure about the ordering of importance among the categories.*

**On comparisons with numeric variables.**
> *Numeric variables are harder to use in comparisons than binary variables because there are no longer two well-defined groups. We must create those two groups ourselves. As long as there are no interaction terms, we can pick two groups with any values. The most common two groups differ by one unit of the variable.*

**On back-and-forth in data science.**
> *Data science often involves back-and-forth work. First, make a single chunk of code — say, a new plot — work well. This requires interactive work between the QMD and the R prompt. Second, ensure that the entire QMD runs correctly on its own.*

**On the map and the territory.**
> *Always remember: the map is not the territory. A beautiful graphic tells a story, but that story is always an imperfect representation of reality. Our models depend on assumptions that are never completely true.*

**On going back to the Preceptor Table.**
> *Always go back to your Preceptor Table — the information which, if you had it, would make answering your question easy. In almost all real-world cases, the Preceptor Table and the data are fairly different. So, even a perfectly estimated statistical model is rarely as useful as we might like.*

**On the published version.**
> *This is the version of your QMD file at which your teacher is most likely to look closely.*

**On the Preceptor Table and God.**
> *We can never know all the entries in the Preceptor Table. That knowledge is reserved for God. If all our assumptions are correct, then our DGM is true — it accurately describes the way in which the world works. There is no better way to predict the future, or to model the past, than to use it. Sadly, this will only be the case with toy examples involving things like coins and dice.*

**On humility.**
> *We can never know the truth.*

**On the world's uncertainty.**
> *The world is always more uncertain than our models would have us believe.* (Last line of every chapter and the last line of every tutorial's Summary section.)

**On ordinal coefficients (proportional-odds / cumulative logit).**
> *In a proportional-odds model, a coefficient like β for "Very Conservative" (relative to the reference category "Moderate") represents a change in the log-odds of being at or below each category of the outcome. Negative β means the unit is more likely to be at the higher end of the outcome scale; positive β means more likely to be at the lower end. The reference category is determined by the factor's level ordering. The interpretation is one coefficient, many thresholds — the model uses the same β but different cutpoints to separate each adjacent pair of outcome categories.*

**On percentage-point increases (logistic probability-scale interpretation).**
> *A logistic coefficient on the log-odds scale is hard to read. For probability-scale interpretation, compute `avg_comparisons()` or subtract two `avg_predictions()` and multiply by 100 to get a percentage-point change: "sending the 'Self' postcard raises the probability of applying by X percentage points compared to sending no postcard." Percentage points (the raw difference) are different from percent changes (the ratio). Always say which you mean.*

### 12.6 Progressive knowledge-drop themes

Rather than repeating the same knowledge drop every tutorial, we plan **themes** that deepen across the curriculum. Each theme has a fixed lead-in sentence from Level 2 onward and a ladder of escalating content. When drafting a tutorial, look up which theme-level each recurring exercise should use at this point in the sequence.

Two themes are fully sketched here. Authors should propose new themes whenever they find themselves repeating the same drop across tutorials; add the new theme to this subsection with a ladder of levels.

**Theme 1: QMD World vs R World.** Attached to an early `Cmd/Ctrl + Enter` exercise. From Level 2 onward, each drop opens with the fixed sentence *"QMD World and R World are not the same."*

| Level | Where it appears | Focus |
|---|---|---|
| L1 | First Easy tutorial (06) | The two worlds exist; `Cmd/Ctrl + Enter` moves a line from QMD World into R World. Students will do this hundreds of times. |
| L2 | Easy, next appearance | *QMD World and R World are not the same.* Rendering runs in a fresh session — packages loaded at the R prompt are invisible to the render. |
| L3 | Easy, third appearance | *QMD World and R World are not the same.* Several R sessions can run simultaneously (interactive, tutorial, render), each with its own workspace. |
| L4 | Medium, first mention | *QMD World and R World are not the same.* The isolation is usually a feature: renders start from known-clean state, so results don't depend on whatever is loaded in an interactive session. |
| L5 | Medium, later mention | *QMD World and R World are not the same.* The rare failure mode is when they do share state — writing to the same file, reading a cache another process is updating — and those are almost always bugs. |
| L6 | Hard, last tutorial (17) | *QMD World and R World are not the same.* In modern workflows, neither is a single instance: many R sessions run in parallel (students on shared Codespaces, `Rscript` jobs, AI agents spawning their own sessions). Parallelism is the norm now; non-interaction is what makes it work; when they do interact, expect trouble. |

Do not reuse the same level across tutorials — each appearance advances the ladder. Skipped levels are fine (authors choose which ones fit); what must not happen is two tutorials shipping the same level.

**Theme 2: `library(tidyverse)` and package ecosystems.** Attached to the `Cmd/Ctrl + Enter` exercise that loads tidyverse (or to the operational exercise whose output is the tidyverse attach message). The theme grows from "what tidyverse is" through "why the conflicts matter" to "what a namespace is."

| Level | Where it appears | Focus |
|---|---|---|
| L1 | First Easy tutorial (06) | The tidyverse is a family of packages — dplyr for manipulation, ggplot2 for plotting, readr for I/O, etc. `library(tidyverse)` loads the core set at once. |
| L2 | Easy, next appearance | The attach message ends with a "Conflicts" section naming functions that have the same name in multiple packages — `dplyr::filter()` masks `stats::filter()`. The last-loaded package wins. |
| L3 | Medium, first appearance | Why masking matters: `filter()` from dplyr behaves very differently from `filter()` in base R. Tidyverse's masking is deliberate; the tidyverse is saying "our version is what you want." |
| L4 | Medium, later or Hard appearance | **Namespaces**: every function in R lives in a package's namespace. `dplyr::filter` names the function explicitly and avoids masking entirely. When you write reusable code (packages, scripts meant to be sourced), reach for the namespace prefix rather than relying on load order. |

Authors can compress or expand — the goal is "each appearance teaches something the previous didn't." Reaching L4 (namespaces) across the full curriculum is aspirational, not required.

**Theme 3: "Predictive models have no treatments."** Attached to §13.1 Exercise 13's End (the predictive-only "which variable has an important connection to the outcome" question). Appears only in predictive tutorials (positions 1, 3, 5, 7, 9, 11 — tutorials 06, 08, 10, 12, 14, 16); causal tutorials skip this exercise entirely. At E and M the drop is reused verbatim — students see the framing often enough to cement it, and it's the canonical answer to "why didn't we use the word treatment here." At H the drop deepens: the causal/predictive distinction is a commitment by the analyst, not a property of the data or model, and the sophistication level grows to match.

| Level | Where it appears | Focus |
|---|---|---|
| L1 | Easy/Medium predictive tutorials (06, 08, 10, 12), verbatim | *With a predictive model, each individual unit has only one observed outcome. Predictive models have no "treatments" — only covariates.* |
| L2 | Hard predictive, first appearance (14 CES) | A predictive model doesn't deny causation; it takes no position on it. The same linear-regression code fits a predictive model or a causal one — what differs is the question you ask and the assumptions you're willing to defend. When the analyst refuses to call any covariate a "treatment," the result is a predictive model. |
| L3 | Hard predictive, last appearance (16 Stops recast) | The predictive/causal distinction is a commitment by the analyst, not a property of the data or the model. Rubin's potential-outcomes framework formalized this distinction roughly fifty years ago; earlier statisticians treated "association" and "causation" as fuzzier ideas. Modern practice demands that you declare your framing upfront, because the same coefficient can be interpreted very differently depending on which framing you adopt. |

**Theme 4: Language discipline in predictive models.** Attached to §13.1 Exercise 14's End (the predictive-only "two groups that might differ" question). Appears only in predictive tutorials. Paired pedagogically with Theme 3 (which frames *what* a predictive model is); this theme drills *how to talk about it*. At E and M the drop is verbatim — language habits form through repetition. At H the drop deepens toward *when* causal language is actually appropriate (truly causal models) and the broader cultural problem of correlation-being-reported-as-causation.

| Level | Where it appears | Focus |
|---|---|---|
| L1 | Easy/Medium predictive tutorials (06, 08, 10, 12), verbatim | *In predictive models, do not use "cause," "influence," "impact," or anything else which suggests causation. The best phrasing is in terms of "differences" between groups of units with different values for a covariate of interest.* |
| L2 | Hard predictive, first appearance (14 CES) | The language rule is not pedantry. Phrases like "X causes Y" or "raising X will raise Y" smuggle causal assumptions into a predictive model, and those assumptions are almost always unjustified. Resist the pull of the active voice ("exercise reduces weight") toward the comparative frame ("groups that exercise more tend to weigh less"). When news stories use causal language to describe what a study actually measured predictively, that is a reporting bug, not a translation choice. |
| L3 | Hard predictive, last appearance (16 Stops recast) | Language constrains inference. Almost every data-science claim you will meet in the wild — policy memos, news summaries, executive dashboards — uses causal language to describe relationships that were only measured predictively. Refusing to participate in that conflation is a discipline. It is also, occasionally, *over-correction*: in a truly causal model — randomized experiment, cleanly identified quasi-experiment — causal language is not just permitted, it is required. The rule is not "always hedge" but "match your language to your identification strategy." |

**Theme 5: Expected values vs. other quantities of interest.** Attached to a late-Temperance exercise or knowledge drop, typically around the "alternative-estimates / why-might-we-be-wrong" step. This topic is **chapter-primary** (every example chapter includes a paragraph or two on it, per §4) and only optionally surfaces in tutorials — never at E or M, and only at H as a compressed knowledge drop pointing at what the chapter expands on.

The core observation: a tutorial's QoI is almost always an expected value (*"the average height of male and female USMC recruits"*), but the fitted DGM can answer a whole family of questions — max, min, quantiles, distribution of a sample statistic. Many of those require simulation: draw synthetic units from the DGM, compute the statistic, repeat, build a PDF.

| Level | Where it appears | Focus |
|---|---|---|
| L1 | Hard tutorials, first appearance (14 CES or 15 Governors) | Average is one question in a family. The fitted DGM also answers max, min, and quantiles — a logistics officer ordering uniforms needs the 90th percentile more than the mean. See the matching chapter for how to ask these questions from the same fit. |
| L2 | Hard tutorials, later appearance | Some QoIs — the expected height of the tallest recruit in the next batch of three, for instance — aren't functions of a single parameter. They require simulation from the DGM: draw three synthetic units, take the max, record it, repeat 1,000 times. The resulting distribution is your posterior on the question you actually cared about. |
| L3 | Hard tutorials, capstone (17 Kenya) | The DGM is a simulator. Once you have one, any question that can be posed as "draw units, compute statistic, summarize" has an answer — even questions with no closed form. This is what makes the Rubin framing powerful: expected values are a convenient special case, but the whole family of questions reduces to *draw from the DGM and count*. |

Chapters get more room for this topic than tutorials can afford, and should include concrete simulation code (not just prose) where feasible.

**Structural note.** Themes can require rearranging which exercise a knowledge drop attaches to. For example, if both the QMD/R-World theme and the tidyverse theme naturally attach to the first `Cmd/Ctrl + Enter library(tidyverse)` exercise, split them: put the QMD/R-World drop on the `Cmd/Ctrl + Enter` exercise, and the tidyverse drop on the exercise immediately after (whose output is the tidyverse attach message). Each theme gets its own place to breathe.

---

## 13. Master exercise list

This is the ordered list of exercises that make up an example tutorial. Each exercise is tagged:

- **[canonical]** — use the wording and `message` text below verbatim. These are the spaced-repetition backbone.
- **[per-tutorial]** — the question frame is fixed; the author writes a problem-specific prompt and/or `message`.
- **[operational]** — a workflow instruction (creating files, rendering, CP/CR). Always a written-without-answer exercise. These are migrated from the template as-is.

Within a section, keep exercises in the order given. Not every tutorial includes every exercise — the schedule depends on spaced repetition (§8) and on whether the problem is causal or predictive. Some exercises (e.g., unconfoundedness questions) are skipped entirely for predictive tutorials.

**Pre-flight before drafting a tutorial.** The tier is fixed by the tutorial number per §1.5: **06–09 Easy, 10–13 Medium, 14–17 Hard**. Do not guess — read the number and use it. Then look up the tutorial's content spec in §17. Some exercises are **tier-dependent** — they are written here in their Medium form but must be dropped, replaced, or extended depending on tier. Tier-dependent exercises are flagged inline with a `**Tier:**` line; read it before including them. Current tier-dependent items:

- **Model checking** (§13.4 Exercises 11–12 in the three-fit pattern): skipped in the first two example tutorials (positions 1–2, target tutorials 06 Recruits and 07 Trains); replaced by an author-rendered side-by-side outcome/fitted-value plot in the remaining Easy tutorials (positions 3–4, target tutorials 08 Colleges and 09 SPS); Medium form (`check_predictions()`) in positions 5–8 (target tutorials 10–13); Hard form (posterior-predictive-check terminology + model revision driven by the check) in positions 9–10 (target tutorials 14–15); omitted entirely for positions 11–12 per §14.8 (random forests skip parameter and fit-diagnostic blocks in favor of `marginaleffects`-native outputs). Full progression in §1.3 *Worked example: model checking across three levels*.
- **Concrete DGM math** (§13.4 Exercise 11): author-shipped in Easy and Medium; possibly a student exercise (via AI) in Difficult tutorials with simple models; author-shipped when the model is complex. Details in §13.4.
- **Parameter-table formatting** (§13.5 Temperance preamble): Easy = raw `tidy()`, Medium = nicer (`kable`/`gt`), Difficult = near-publication quality. Always author-shipped.
- **`marginaleffects` coverage** (§13.5 Temperance): Easy = `predictions()` family only; Medium adds `comparisons()`; Difficult adds the five-decisions framework and grid types. Slopes are never introduced.
- **Preceptor/Population Table footnote depth** (§10): Easy footnotes include scaffolding (what a Preceptor Table *is*; per-row causal-effect arithmetic); Medium and Difficult drop the scaffolding and deepen the remaining footnotes. Details in §1.3 *Worked example: Preceptor Table and Population Table footnote sophistication*.
- **Validity/stability/representativeness/unconfoundedness progressions** (§1.3): each has an Easy → Medium → Difficult treatment; consult §1.3 when drafting the Justice exercises for that assumption.
- **Introduction pacing** (§13.1): Easy = slower, more explanatory prose before each operational step, split long exercises into shorter ones; Medium = current Introduction-exercise pace; Hard = faster, collapse related operational exercises, drop background knowledge drops students have seen several times already.
- **Introduction Exercises 7 & 8 (causal definitions)** (§13.1): causal tutorials only (positions 2, 4, 6, 8, 10, 12). Easy causal = both; Medium causal = one; Hard causal = neither, except the last causal tutorial (position 12) = both. Predictive tutorials skip both.
- **Introduction Exercises 10–14 (causal / predictive setup block)** (§13.1): each tutorial uses *either* the causal block (10–12) *or* the predictive block (13–14), never both. Easy = full block (10/11/12 for causal, 13/14 for predictive). Medium = single setup question only (Ex 12 for causal, Ex 14 for predictive). Hard = drop 10–14 entirely. Ex 15 (state the question) appears in every tutorial at every tier. Use the real treatment variable from §17 in causal tutorials — no imaginary placeholder variables.
- **Virtue Exercise 1 (canonical definition)** — Wisdom §13.2 Ex 1, Justice §13.3 Ex 1, Courage §13.4 Ex 1, Temperance §13.5 Ex 1: Easy asks all four (one per virtue section, every tutorial). Medium asks only two of the four per tutorial, rotating across the four Medium tutorials so each definition is asked twice. Hard asks only one per tutorial, *except* the last tutorial of the whole curriculum (position 12), which asks all four as a retention check. **When a virtue's Exercise 1 is skipped, the definition appears in that virtue's preamble as a reminder sentence** (e.g. *"Remember that Courage creates the data generating mechanism."*) — the preamble absorbs what the exercise would have asked. Suggested schedule in §13 Virtue-definition rotation below.

**Virtue-definition rotation (suggested).** Which two of the four canonical definitions each Medium tutorial asks, and which one each Hard tutorial asks:

| Position | Tutorial | Tier | Ex 1 asks |
|---|---|---|---|
| 5 | 10 Smokes | Medium-P | Wisdom, Justice |
| 6 | 11 Shaming | Medium-C | Courage, Temperance |
| 7 | 12 NES | Medium-P | Wisdom, Courage |
| 8 | 13 TODO | Medium-C | Justice, Temperance |
| 9 | 14 CES | Hard-P | Temperance |
| 10 | 15 Governors | Hard-C | Wisdom |
| 11 | 16 Stops/RF | Hard-P | Justice |
| 12 | 17 TODO | Hard-C (last) | **all four** |

Each canonical definition is asked exactly twice across the four Medium tutorials and exactly once across Hard positions 9–11, then again at position 12. The schedule is a suggestion; adjacent tutorials should not repeat the same pair, and the author can rotate differently if it reads better. In every virtue-section preamble, include a *"Remember that …"* reminder for any canonical definition that is not asked at Ex 1 in that tutorial.

If a tutorial is being drafted without a pre-flight tier check, the default is Medium — and Medium wording *will be wrong* for every Easy tutorial (target tutorials 06–09, positions 1–4) and every Hard tutorial (target tutorials 14–17, positions 9–12). The pre-flight is cheap; skipping it is how model-checking exercises ended up in the Recruits tutorial (position 1, Easy) before we caught the mistake.

### 13.1 Introduction

**The Introduction preamble always has exactly three paragraphs, in this order:**

1. **Citation paragraph.** *"This tutorial supports [*Preceptor's Primer for Bayesian Data Science: Using the Cardinal Virtues for Inference*](https://ppbds.github.io/primer/) by [David Kane](https://davidkane.info/)."* Verbatim in every tutorial.
2. **Bookend sentence.** *"The world confronts us. Make decisions we must."* Verbatim. This sentence appears at both ends of every tutorial — it also closes the Temperance section (§13.5 Exercise 17 End).
3. **"Imagine that you are …" paragraph.** One paragraph motivating the problem with a real person facing real decisions. Always starts with *"Imagine that you are …"* and always ends with *"There are many decisions to make."* The exact wording is per-tutorial and comes from the `**"Imagine":**` field of the §17 seed entry. The same paragraph is reused verbatim in the Wisdom preamble (§13.2) and in the matching chapter.

**The closing line ("There are many decisions to make") has to be earned.** It is in every Imagine paragraph; for it to land, the body of the paragraph must actually establish the multiplicity it claims. The recipe:

- **The protagonist has a boss with big-picture goals, not specific data-science requests.** A campaign manager's boss is the candidate, who wants to *win the election*. A public-health analyst's boss is the Minister, who wants to *improve health outcomes*. The boss does not ask for "a causal estimate of treatment X on outcome Y" --- they don't think in those terms, and most of them would not recognize the phrase. They have a goal and a budget; they trust the analyst to find evidence that helps.
- **The analyst chooses what to model.** Many causal and predictive models would help with the boss's goal. The analyst is the one picking which model to build. Name two or three plausible alternatives in the paragraph so the reader sees the choice is real.
- **This tutorial is one of many models.** The Imagine paragraph makes explicit that the model the tutorial builds is one piece, not the whole picture. *"This tutorial builds just one of them: \[specific QoI\]."*
- **The estimate is an input to the decision, not the decision.** Say so directly. *"The estimate alone won't decide anything, but it is one good input."* This earns the closing line without overclaiming.

A good Imagine paragraph reads like a sketch of a real person doing a real job, with a boss who has goals and a budget that doesn't stretch to all of them. A bad Imagine paragraph reads like a homework prompt that names a topic and a question. See §5.4 for the section-header formatting convention that determines where `###` Continue buttons sit around the preamble; the three paragraphs above run directly into `### Exercise 1` with no trailing `###` between them.

**Pacing across the EMH tiers.** The Introduction is mostly operational — repo setup, adding libraries to the QMD, turning off code echo, sending commands to the R prompt, etc. The exercise list below is pitched at **Medium** pace: concise, one operational step per exercise, assuming the student has been through this workflow once before. The pace changes with tier:

- **Easy** (positions 1–4, tutorials 06–09). Slower. Expand each operational exercise with more explanatory prose *before* the step — what a `.gitignore` does and why we need one; what `echo: false` does to the rendered document and why we care; what `Cmd/Ctrl + Enter` does and why we want code in the QMD rather than at the R prompt. Split a long exercise into two or three short ones if the student would otherwise have to track multiple unfamiliar steps at once. Add knowledge drops that teach the *concept* behind each mechanic (why QMD World and R World must stay in sync, what "rendering" actually does). Students at this stage have never done this before — silence is not a feature.
- **Medium** (positions 5–8, tutorials 10–13). Current pace. The exercise list below is calibrated here: one step per exercise, minimal lead-in prose, concepts assumed.
- **Hard** (positions 9–12, tutorials 14–17). Faster. Collapse sequences of related operational exercises into a single exercise (e.g. "add libraries, turn off echo, and commit the QMD — paste the result"). Drop explanatory knowledge drops that at Easy and Medium we kept for their own sake. Students at this stage have been through the setup six or more times and do not need it re-explained; keep the operational scaffold, but shrink it.

This progression applies to every Introduction exercise below unless the exercise is explicitly flagged otherwise.

**Exercise 1.** [canonical] Four Cardinal Virtues.
- Prompt: *What are the four [Cardinal Virtues](https://en.wikipedia.org/wiki/Cardinal_virtues), in order, which we use to guide our data science work?*
- Message: `"Wisdom, Justice, Courage, and Temperance."`
- End: knowledge drop *On spaced repetition* (§12.1).

**Exercise 2.** [operational] Confirm working repo and set up the QMD.
- The primary assumed environment is **VS Code on GitHub Codespaces**, started from the [`PPBDS/codespace-starter`](https://github.com/PPBDS/codespace-starter) devcontainer. The repo — named after the tutorial (e.g. `nhanes`) and initially empty — is expected to already exist, since the student must have created it to launch the Codespace. Positron-local and VS-Code-local are supported alternatives documented in the `primer.tutorials` package README, not in the tutorial text.
- Prompt: *You should be working inside a GitHub repo named `XX`, opened in a Codespace from the [`PPBDS/codespace-starter`](https://github.com/PPBDS/codespace-starter) template. If you are not there yet, please create that repo and open it in a Codespace now — see the [package README](https://github.com/PPBDS/primer/tree/main/primer.tutorials#working-environments-and-repo-setup) if you need setup instructions or are working locally instead. Once you're inside the `XX` repo, create a new Quarto document titled `"XX"` with yourself as the author, render it, and save it as `analysis.qmd`. Create a `.gitignore` file with `analysis_files` on the first line followed by a blank line. Save and push. At the R prompt, run `show_file(".gitignore")`. If that fails, it's probably because you haven't loaded `library(tutorial.helpers)` at the R prompt. CP/CR.*
- The prompt does **not** spell out the IDE-specific mechanics for creating a new Quarto document — no "File → New File → ..." menu path, no mention of a specific pane or button. Assume students know how to create a new document in whatever IDE they are using. The Codespaces-primary / locally-supported framing handles environment differences; mechanics that vary by IDE do not belong here.
- The QMD's filename is `analysis.qmd` by default in all tutorials (earlier tutorials used per-topic filenames like `immigration.qmd`; new tutorials should stick with `analysis.qmd` for consistency).
- In the **first** tutorial, spell out CP/CR as *"copy/paste the command you sent to R along with the response R gave back"* on first use. Keep it concise — no "you will see this throughout" filler.
- End: *Professionals keep their data science work in the cloud because laptops fail.*

**Exercise 3.** [operational] Add libraries and echo settings to QMD.
- Prompt: *In your QMD, put `library(tidyverse)` and `library(<data package>)` in a new code chunk. Render the file. Notice that the file does not look good because the code is visible and there are messages. Add `#| message: false` to remove the messages in this setup chunk. Also add the following to the YAML header to remove all code echos from the HTML:*
  ```
  execute:
    echo: false
  ```
- *At the R prompt, run `show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: *Render again. Everything looks nice, albeit empty, because we have added code to make the file look better and more professional.*

**Exercise 4.** [operational] `library(tidyverse)` via `Cmd/Ctrl + Enter`.
- Prompt: *Place your cursor in the QMD file on the `library(tidyverse)` line. Use `Cmd/Ctrl + Enter` to execute that line. Note that this sends the line to the R prompt and runs it. CP/CR.*
- (No End before next exercise; this runs into the next one naturally.)

**Exercise 5.** [operational] Next `library()` via `Cmd/Ctrl + Enter`.
- Prompt: *Place your cursor in the QMD file on the next `library()` line. Use `Cmd/Ctrl + Enter` to execute that line. This workflow — writing things in the QMD so you have a permanent copy, and then executing them at the R prompt with `Cmd/Ctrl + Enter` — is the most common approach to data science. There is QMD World and R World. It is your responsibility to keep them in sync. CP/CR.*
- End: introduce the data: "A version of the data from XX is available in the `XX` tibble."

**Exercise 6.** [operational] Read the `?<tibble>` help.
- Prompt: *At the R prompt, type `?XX`, and paste the Description below.*
- Only include if the tibble has a help page. Delete if not.
- End: short paragraph of context about the data (paper abstract, source website quote).

**Exercises 7 and 8 are causal-only with a spaced-repetition schedule.** Neither exercise appears in predictive tutorials. Across causal tutorials (positions 2, 4, 6, 8, 10, 12), the pattern is:

- **Easy causal tutorials** (positions 2 Trains, 4 TODO): include **both** Exercise 7 and Exercise 8.
- **Medium causal tutorials** (positions 6 Shaming, 8 TODO): include **one** of Exercise 7 or Exercise 8, not both. Alternate across the two Medium causal tutorials so each question appears once at this tier.
- **Hard causal tutorials**: include **neither** — *except* in the **very last causal tutorial of the whole curriculum** (position 12), where both reappear. The final reappearance is a retention check: a student who has seen these definitions early, halved in the middle, and absent in the Hard tier should be able to produce them on recall three months after finishing.

Predictive tutorials (positions 1, 3, 5, 7, 9, 11) skip both Exercise 7 and Exercise 8 entirely, and renumber subsequent Introduction exercises accordingly.

**Exercise 7.** [canonical, causal-only] Define a causal effect.
- Prompt: *Define a causal effect.*
- Message: `"A causal effect is the difference between two potential outcomes."`
- End: *According to the Rubin Causal Model, there must be two (or more) potential outcomes for any discussion of causation to make sense. This is simplest to discuss when the treatment has only two different values, generating only two potential outcomes.*

**Exercise 8.** [canonical, causal-only] Fundamental problem of causal inference.
- Prompt: *What is the fundamental problem of causal inference?*
- Message: `"The fundamental problem of causal inference is that we can only observe one potential outcome."`
- End: *If the treatment variable is continuous (like a lottery payment), then there are lots and lots of potential outcomes, one for each possible value of the treatment variable.*

**Exercise 9.** [per-tutorial, written-with-answer] The outcome variable.
- Prompt: *XX is the broad topic of this tutorial. Given that topic, which variable in `<tibble>` should we use as our outcome variable?*
- Message: a sentence about the outcome variable used.
- End: *We will use `XX` as our outcome variable.* Follow with a simple AI-generated plot of the outcome (univariate or bivariate; bivariate should use a non-key covariate). Subtitle highlights an aspect of the data. No code chunk label.

**Exercises 10–14 are split by tutorial type AND by EMH tier.** Each tutorial includes *either* the causal block (Ex 10–12) *or* the predictive block (Ex 13–14), never both. Ex 15 (state the question) is shared by both and always appears. Mixing them — asking a predictive tutorial's student to also reason about potential outcomes for an imagined treatment, or asking a causal tutorial's student to also reason about two predictive groups — makes this section too long and muddles the framing the tutorial is actually using.

**Causal tutorials use Exercises 10–12; predictive tutorials use Exercises 13–14.** For causal tutorials, use the **actual treatment variable** the tutorial plans to use later in Wisdom and Courage. Drop the older "imaginary variable" framing entirely — no `phone_call` or `nutrition_program` placeholders; the treatment is the real one from §17.

**EMH progression across these exercises:**
- **Easy** (positions 1–4, tutorials 06–09). Use the full block. Causal tutorials do Ex 10, 11, 12, 15. Predictive tutorials do Ex 13, 14, 15. These questions do overlap somewhat with Wisdom — that is fine at Easy; the repetition reinforces the framing at the point in the tutorial where students most need it.
- **Medium** (positions 5–8, tutorials 10–13). One setup question plus the question-statement. Causal tutorials do only Ex 12 (compute a unit-level causal effect) and Ex 15. Predictive tutorials do only Ex 14 (two groups that might differ) and Ex 15. The Rubin Causal Model and associational-language knowledge drops are compressed into the End of the single retained setup question; Wisdom does the heavier framing at this tier.
- **Hard** (positions 9–12, tutorials 14–17). Drop Ex 10–14 entirely. Only Ex 15 (state the question) remains. The Introduction is considerably shorter at Hard — which is right, because students at this stage have rehearsed the framing many times and need to get to Wisdom.

The `[per-tutorial, written-with-answer]` tag below applies across all three tiers; the axis that changes is *whether the exercise appears at all*, not the question format.

**Exercise 10.** [per-tutorial, written-with-answer; causal only, Easy only] Introduce the actual treatment variable.
- Prompt: *Our treatment variable will be `XX`, which can take [values]. Describe briefly what each value means and how, at least in theory, it is manipulable.*
- Message pattern: concrete one-sentence-each description of each treatment value plus a sentence on who can manipulate it. E.g., for Trains: *"`treatment` takes two values: 'Treated' if the commuter was on a platform during the two-week window when Spanish-speaking confederates rode, or 'Control' otherwise. Enos, the experimenter, manipulated this variable by assigning which platforms the confederates rode on."*
- End: *Any data set can be used to construct a causal model as long as there is at least one covariate that we can, at least in theory, manipulate. It does not matter whether or not anyone did, in fact, manipulate it.*

**Exercise 11.** [per-tutorial, written-with-answer; causal only, Easy only] Count potential outcomes.
- Prompt: *Given our treatment variable `XX`, how many potential outcomes are there for each unit? Explain why.*
- Message pattern: *"There are [N] potential outcomes because the treatment variable `XX` takes on [N] possible values: …"* For a binary treatment N is 2; for a multi-arm treatment state the exact number and name the arms.
- End: *The same data set can be used to create, separately, lots and lots of different models, both causal and predictive. This is a conceptual framework we apply to the data. It is never inherent in the data itself.*

**Exercise 12.** [per-tutorial, written-with-answer; causal only, Easy and Medium] Compute a unit-level causal effect.
- Prompt: *Pick a single [unit] from the data. Specify the two values the treatment variable `XX` could take for that unit, guess the potential outcome under each, and compute the causal effect for that unit.*
- Message pattern: *"For [specific named unit] in the data, `XX` could be [treatment value] or [control value]. If the unit gets [treatment], the outcome would be [value A]. If the unit gets [control], the outcome would be [value B]. The causal effect on the outcome of [treatment] versus [control] is [value A] − [value B] = [difference], which is the causal effect for this unit."*
- End: *A causal effect is the difference between two potential outcomes. "Difference" does not necessarily mean "subtraction" — many potential outcomes are not numbers. Even for numeric outcomes, you can't simply say the effect is 10 without specifying the order of subtraction.*

**Exercise 13.** [per-tutorial, written-with-answer; predictive only, Easy only] Predictive covariate of interest.
- Prompt: *Which variable in `<tibble>` do you think might have an important connection to `<outcome>`?*
- Message pattern: brief description of one key covariate whose connection we might want to explore.
- End: *With a predictive model, each individual unit has only one observed outcome. Predictive models have no "treatments" — only covariates.*

**Exercise 14.** [per-tutorial, written-with-answer; predictive only, Easy and Medium] Two groups that might differ.
- Prompt: *Specify two different groups of [units] which have different values for [covariate] and which might have different average values for the [outcome].*
- Message pattern: *"Consider two groups: one with [covariate] = [value A], one with [covariate] = [value B]. These two groups might have different average values for the outcome."*
- End: *In predictive models, do not use "cause," "influence," "impact," or similar words. The best phrasing is in terms of "differences" between groups of units with different values for a covariate of interest.*

**Exercise 15.** [per-tutorial, written-with-answer] State the question.
- **Appears in every tutorial at every tier** — this is the one exercise in the causal/predictive block that every tutorial keeps.
- Prompt: *Write a [causal or predictive] question connecting the outcome `XX` to `XX`, the [treatment / covariate of interest].*
- **The specific question must specify one or more numbers to compute.** Predictive and causal questions ask for specific numerical quantities — not a vague "relationship," "connection," or "association." A question like *"What is the relationship between a college's tuition and its graduation rate?"* is **wrong**: "relationship" doesn't tell you what to compute, and the canonical Temperance answer can't pin down a value. Replace with a specific comparison or one or more specific expected values.
- **Templates by outcome type:**
  - **Numeric outcome (continuous).** Predictive: *"What is the difference in expected [outcome] between [group A] and [group B]?"* (e.g., *"What is the difference in expected graduation rates between colleges with tuition of $20,000 and colleges with tuition of $30,000?"*) Causal: *"What is the average causal effect of [treatment] on [outcome]?"* — fine because "the average causal effect" *is* a specific number, β in the linear model with binary treatment. The expected-value form *"What is the expected [outcome] for a [unit description]?"* is also acceptable.
  - **Binary outcome.** Predictive: *"What is the difference in the probability of [event] between [group A] and [group B]?"* Causal: *"What is the average causal effect of [treatment] on the probability of [event]?"*
  - **Multinomial / ordinal outcome.** Predictive: *"What is the difference in the probability of [specific outcome category] between [group A] and [group B]?"* — pick *one* category to ask about; do not ask about "the distribution" of multinomial outcomes since that is a vector, not a number.
- **What "specific" rules out:**
  - Vague nouns: *"the relationship,"* *"the connection,"* *"the association,"* *"the link."*
  - Trend questions: *"How does Y vary with X?"* — vary how much? at what point on X? Replace with a specific X1-vs-X2 comparison.
  - Distribution questions: *"What is the distribution of Y by X?"* — distributions are not single numbers.
- **What "specific" allows:** asking for two or more specific numbers in one question is fine, as long as each piece is itself a clear, computable quantity. *"What is the average height of male and female USMC recruits?"* asks for two expected values; both are unique and computable, so the question is specific. The comparison form (the *difference* between two numbers) is also acceptable and is sometimes cleaner because it produces a single answer; authors can pick either. The rule is about specifying *what numbers to compute*, not about being limited to one number per question.
- **End (per-tutorial).** Two-to-three sentences of commentary on the chosen question. The default content is **a concrete subtlety about one of the variables in the question** — a measurement quirk, a definitional ambiguity, a coding choice — that is worth flagging at this point in the tutorial. The goal is to make the student notice that the variables they are about to model are not transparent labels but constructed measurements with histories. Examples:
  - **Colleges (tuition).** *"School tuition in this data is the stated tuition --- the sticker price. At many colleges, most students receive significant financial aid, so the average tuition actually paid is far lower than the recorded number. Our question therefore compares colleges by sticker price, not by net price."*
  - **Trains (treatment).** *"The 'treatment' here is being on a Metra platform during the two-week window when Spanish-speaking confederates rode the same morning trains. Whether that exposure is comparable to a present-day MBTA platform conversation is a question we will revisit in Justice."*
  - **Shaming (voted).** *"The outcome is whether the registered voter showed up to the 2006 primary. Voting records misclassify in both directions --- some non-voters appear in the rolls because of paperwork lag, and a small number of votes are uncounted --- so the column slightly understates true turnout."*
  
  An alternative content pattern is **the QoI-variety drop** — naming one or two *other* questions a practitioner in the scenario might reasonably ask instead (max, percentile, simulation, heterogeneous treatment effect). This pattern is acceptable when the variables are well understood and the more interesting pedagogical move is to expand the family of questions. Use the variable-subtlety pattern by default; the QoI-variety pattern as a deliberate choice when the variables don't have a flag worth surfacing.
  
  Do **not** use the generic "This is the first version of the question..." drop from §12.1; that drop is a fallback, not the default. The Preceptor-Table transition ("we will use a Preceptor Table to answer this question") does not need to appear here — Wisdom §13.2 Exercise 1's canonical definition of Wisdom already carries it.

### 13.2 Wisdom

By the end of Wisdom, the student has a specific question, a Preceptor Table that would answer it, and a first look at the data.

**Preamble (between `## Wisdom` header and Exercise 1).** The Cardinal Virtues assume a student arrives with a broad question and a data set; Wisdom's preamble emphasizes exactly those two things. Contents, in order:

1. **Canonical opening sentence, verbatim:** *"Data science starts with some broad questions and a data set which might help us to answer them."* Every Wisdom preamble in the Primer begins with this sentence, unchanged.
2. **The "Imagine that you are…" paragraph from Introduction, verbatim.** Same text, not paraphrased. It reorients a reader who skipped Introduction, and it costs nothing to show a reader who did read Introduction.
3. **The specific question** in one line, labeled verbatim: *"The specific question: <the question>"* (e.g. *"The specific question: What is the average height of male and female USMC recruits?"*). This is the canonical answer to Intro Exercise 15 — the question the student just stated at the end of Introduction. The Introduction narrows from a broad topic (the "Imagine" paragraph) to this specific QoI; Wisdom starts from here. Do not relabel it "broad" — the topic is broad, the question is specific.
4. **One or two sentences naming the dataset.** The Introduction identifies the dataset; Wisdom is where we will explore it. Write as a plain statement — *"We will work from the NHANES survey (conducted by the CDC), available in the `nhanes` tibble of the `primer.data` package."* Do not make claims about what the data will show, and do not mention measurement or validity concerns — those come later.
5. A Continue button (`###` with no heading) before `### Exercise 1`.

Per §14.6, the preamble does **not** describe what Wisdom does; Exercise 1 below asks the student to describe Wisdom using the canonical Key Concepts wording. *Exception:* when Exercise 1 is skipped (Medium tutorials not on the Wisdom rotation, Hard tutorials not on the Wisdom rotation; see §13 pre-flight list), add the canonical definition to this preamble as a reminder — *"Remember that Wisdom begins with a question and then moves on to the creation of a Preceptor Table and an examination of our data."* The reminder replaces the exercise; preamble absorbs what Ex 1 would have asked.

**Exercise 1.** [canonical, tier-dependent presence] Components of Wisdom.
- **Tier:** Easy = always ask; Medium = ask in 2 of the 4 Medium tutorials per the rotation in §13's pre-flight list; Hard = ask only in position 12 (last tutorial, all four definitions) and in one other Hard position per the rotation. When *not* asked, the Wisdom preamble (§13.2) includes a *"Remember that …"* reminder with the canonical definition verbatim.
- Prompt: *In your own words, describe the key components of Wisdom when working on a data science problem.*
- Message: `"Wisdom begins with a question and then moves on to the creation of a Preceptor Table and an examination of our data."`
- End: the Tukey walk-away quote (§12.2).

**Exercise 2.** [canonical] Define a Preceptor Table.
- Prompt: *Define a Preceptor Table.*
- Message: `"A Preceptor Table is the smallest possible table of data with rows and columns such that, if there is no missing data, we can easily calculate the quantity of interest."`
- End: *The Preceptor Table does not include all the covariates which you will eventually include in your model. It only includes, along with the outcome(s), covariates which are mentioned in your question.*

Between Exercises 2 and 3, insert at least one problem-specific EDA exercise (AI-prompted code, §9) that **shows the outcome variable in relation to a key covariate** (the treatment for causal tutorials, the covariate of interest for predictive tutorials). Provide a knowledge drop that highlights what the plot reveals.

**Do not duplicate the Introduction's outcome plot here.** §13.1 Exercise 9 already ships an author-rendered plot of the outcome variable — usually a univariate density of the outcome alone, sometimes the outcome already split by the key covariate. Wisdom must move past that view, not repeat it. Concretely:

- If the Intro plot is the outcome alone (06-recruits, 08-colleges), Wisdom's first EDA exercise asks for outcome × covariate.
- If the Intro plot is already outcome × covariate (07-trains shows `att_end` density colored by `treatment`), Wisdom's first EDA exercise asks for the *same data from a different angle* — a jitter of individual values with overlaid means, a boxplot, a scatter against a continuous covariate, a faceted view, etc.

The exercise opener should explicitly acknowledge the Intro plot — *"We saw the distribution of [outcome] on its own in the Introduction. Now look at how [outcome] varies with [covariate]…"* — so the student understands why the new view is different from what they have already seen.

Two EDA exercises (one outcome-only, one outcome × covariate) is fine when neither duplicates the Intro plot, but with the Intro plot in place this is rare. Default to one Wisdom EDA exercise; add a second (e.g. a faceted or ridge view) only when the problem genuinely needs it.

**Exercise 3.** [canonical] Components of a Preceptor Table.
- Prompt: *Describe the key components of Preceptor Tables in general, without worrying about this specific problem. Use words like "units," "outcomes," and "covariates."*
- Message: `"The rows of the Preceptor Table are the units. The outcome is at least one of the columns. If the problem is causal, there will be at least two (potential) outcome columns. The other columns are covariates. If the problem is causal, at least one of the covariates will be considered a treatment."`
- End (causal): *This problem is causal, so one of the covariates is a treatment. In our problem, the treatment is XX. There is a potential outcome for each of the XX possible values of the treatment.*
- End (predictive): a sentence comparing outcomes for two different groups.

**Exercise 4.** [per-tutorial, written-with-answer] The units.
- Prompt: *What are the units for this problem?*
- Message: per-tutorial specification of the unit (and implicit time period).
- End: *Specifying the Preceptor Table forces us to think clearly about the units and outcomes implied by the question. No data science project follows a single direction. We always backtrack. There is always dialogue. We model units, but we only really care about aggregates.*

**Exercise 5.** [per-tutorial, written-with-answer] The outcome variable.
- Prompt: *What is the outcome variable for this problem?*
- Message pattern: *"Keep track of two 'outcome' variables: the one in our Preceptor Table and the one in our data. In this case, XX."*
- End: the outcome-compromise knowledge drop (§12.2).

**Exercise 6.** [per-tutorial, written-with-answer] A plausible covariate.
- Prompt: *What is a covariate which you think might be useful for this problem, regardless of whether or not it might be included in the data?*
- Message pattern: a sensible variable plausibly connected to the outcome.
- End: the three-usages-of-covariates knowledge drop (§12.2).

**Exercise 7.** [per-tutorial, written-with-answer] The treatment(s).
- Prompt: *What are the treatments, if any, for this problem?*
- Message: per-tutorial specification of the treatment variable, or a note that this is a predictive model with no treatment.
- End: the treatment-as-covariate knowledge drop (§12.2).

**Exercise 8.** [per-tutorial, written-with-answer] Moment in time.
- Prompt: *What moment in time does the Preceptor Table refer to?*
- Message: one brief phrase or sentence describing the moment.
- End: *A Preceptor Table can never really refer to an exact instant in time since nothing is instantaneous in this fallen world.* Optionally followed by a more sophisticated sentence tying to the specific problem.

Between Exercises 8 and 9, consider inserting an AI-prompted plot with outcome on the y-axis and the most important covariate/treatment on the x-axis. Knowledge drop after: the Engerman "you can never look at the data too much" quote (§12.2).

**Exercise 9.** [per-tutorial, written-with-answer] Describe the Preceptor Table in words.
- Prompt: *Describe in words the Preceptor Table for this problem.*
- Message: an excellent description mentioning *rows*, *units*, *outcome*, *covariates*, and (if causal) *treatment*.
- End: a rendered `gt` Preceptor Table (§10) — by itself, with no prefacing prose ("The Preceptor Table for this problem looks something like this:") and no follow-up ("Like all aspects of a data science problem…"). The table *is* the knowledge drop.

If the modeling requires a cleaned tibble `x` (e.g., filtering to one year, dropping NAs), insert 1–3 AI-prompted code exercises that build the cleaned `x`. Follow with a QMD-world exercise that asks the student to copy/paste the pipeline into a new code chunk, render, and `show_file("XX.qmd", chunk = "Last")`.

**Canonical data-prep patterns.** The cleaned `x` is built with a handful of recurring transformations. New tutorials should reuse these patterns — they are codified here so authors don't have to reverse-engineer them from existing tutorials:

- **Slice-sample for setup-chunk speed** (used in almost every tutorial).
  ```r
  x <- <raw_tibble> |>
    filter(<scoping>) |>
    select(<outcome>, <covariates>) |>
    drop_na() |>
    slice_sample(n = 50)   # or whatever N keeps the fit cheap
  ```
  Set `set.seed(N)` on the line before the pipeline so the sample is reproducible across renders. The sample size (`n = 50` for NHANES, `n = 5000` for Mail) is chosen so the fit finishes in a few seconds — see §5.2 *Setup chunk must be cheap*.

- **Stratified sample when treatment arms are imbalanced** (Mail; applies to any RCT with a huge control arm).
  ```r
  x <- <raw_tibble> |>
    filter(<scoping>) |>
    drop_na() |>
    group_by(treatment) |>
    slice_sample(n = 1500) |>
    ungroup()
  ```
  `slice_sample()` *after* `group_by()` samples within each group. Without this, a naive `slice_sample(n = 5000)` on a 936K-row tibble with a 95% control arm pulls almost no treated units.

- **Composite-score construction** (Shaming: `voter_class` from prior election turnout).
  ```r
  x <- shaming |>
    mutate(civ_engage = primary_00 + primary_02 + primary_04 +
                        general_00 + general_02 + general_04) |>
    mutate(voter_class = factor(
      case_when(civ_engage %in% c(5, 6) ~ "Always Vote",
                civ_engage %in% c(3, 4) ~ "Sometimes Vote",
                civ_engage %in% c(1, 2) ~ "Rarely Vote"),
      levels = c("Rarely Vote", "Sometimes Vote", "Always Vote")))
  ```
  Two moves: (a) sum several 0/1 indicator columns into a composite score, (b) bin the score into ordered categories with `factor(..., levels = ...)` to fix the reference level. Without the explicit `levels`, R uses alphabetical ordering and the dummy-coding reference becomes whichever level sorts first — usually not what you want.

- **Factor recoding for presentation** (NES: multinomial outcome).
  ```r
  x <- nes |>
    filter(year == 1992) |>
    select(sex, pres_vote) |>
    drop_na() |>
    mutate(pres_vote = as.factor(case_when(
      pres_vote == "Democrat"    ~ "Clinton",
      pres_vote == "Republican"  ~ "Bush",
      pres_vote == "Third Party" ~ "Perot")))
  ```
  Replaces generic party labels with candidate names so students and readers see "Clinton/Bush/Perot" rather than "Democrat/Republican/Third Party." Purely a presentation choice; the model doesn't care.

- **Case-fix for presentation** (Stops: `"black"` → `"Black"`).
  ```r
  x <- stops |>
    filter(race %in% c("black", "white")) |>
    mutate(race = str_to_title(race), sex = str_to_title(sex))
  ```
  `str_to_title()` capitalizes the first letter of each word. Use it on categorical variables whose raw levels are all-lowercase; the resulting plot labels and parameter-table terms are then properly cased.

- **Factor-coercion for `logistic_reg()`** (Shaming, Mail).
  ```r
  x <- <raw> |>
    ...
    mutate(voted = as.factor(primary_06))
  ```
  Required because `tidymodels`' `logistic_reg(engine = "glm")` refuses a raw 0/1 integer outcome — see §13.4 *Factor-outcome gotcha*.

- **Outcome-range filtering** (Colleges: `filter(tuition > 2)`). When the data includes sentinel or implausible values in the outcome or key covariate, filter them out explicitly before modeling. Document the filter in a comment so the Justice section can name it as a selection mechanism (see Key Concepts).

These patterns appear in roughly this order across the tutorials — slice-sample is ubiquitous; factor-level control and composite-score construction show up from Medium onward as the models need richer covariate structure.

**Exercise 10.** [per-tutorial, written-with-answer] First two sentences of the summary paragraph.
- Prompt: *We will be creating a summary paragraph over the course of this tutorial. Write the first two sentences. The first sentence is a general statement about the overall topic, mentioning the general class of outcome and at least one covariate. The second introduces the data source and the specific question — when/where gathered, how many observations, who collected it.*
- Message: an excellent two-sentence opener.
- End: *Read our answer. It will not be the same as yours. You can change your answer to incorporate some of our ideas, but do not copy/paste our answer exactly. Add your two sentences to your QMD, `Cmd/Ctrl + Shift + K`, and commit/push.*

### 13.3 Justice

**Preamble (between `## Justice` header and Exercise 1).** Per the self-containment principle in §5.5, the Justice preamble revisits the two outputs from Wisdom that Justice needs. Per §14.6, it does not describe what Justice does — Exercise 1 does that. *Exception:* when Exercise 1 is skipped in this tutorial (per the rotation in the §13 pre-flight list), add the canonical definition to this preamble as a reminder — *"Remember that Justice concerns the Population Table, the four key assumptions which underlie it (validity, stability, representativeness, and unconfoundedness), and the choice of probability family and link function for the data generating mechanism."* The reminder replaces the exercise. Contents, in order:

**Opening sentence, verbatim:** *"Wisdom gives us the Preceptor Table and the data."* This single sentence is the entire lead-in — no additional transitional prose. The two objects that follow stand on their own.

1. **The Preceptor Table from Wisdom**, rendered via the §10.3 `gt` pipeline. An exact copy — same tibble, same footnotes, same code. No label or transitional sentence. Do not alter the Preceptor Table here; if it needs changing, change it in Wisdom too.
2. **A `gt` table of the data** — a companion to the Preceptor Table. No transitional sentence between it and the Preceptor Table above; the tables are shown back-to-back. Show 3–5 sample rows (plus a `"..."` row) with the same columns the data has for the outcome and the most important covariates. This is the first time in the tutorial the reader sees the actual data as a formatted table; prior exposure is as raw tibble print-outs. Specifications:
   - **Title** starts with `"Data: "` and then a short descriptive name of the dataset — e.g. `"Data: NHANES Young Adults, Ages 18–27"`, `"Data: Enos Metra Platform Experiment, 2012"`, `"Data: Gerber-Green-Larimer Michigan Shaming Experiment, 2006"`. Not just the package's tibble name.
   - **Title footnote** gives proper source information — the citation / author / year / provenance of the data, the kind of thing that would appear in a paper's data section. E.g. *"National Health and Nutrition Examination Survey (NHANES), Centers for Disease Control and Prevention. Continuous survey data 1999–present; height measured by trained examiners in the Mobile Examination Center."*
   - **Outcome-column footnote** describes the data's outcome on its own terms — how it was measured, by whom, on what scale, and any coding subtlety a thoughtful reader of *this dataset* would want to know. It does **not** compare the data's measurement to the Preceptor Table's; it does **not** say things like "Preceptor recruits, by contrast, are measured at enlistment." Those comparisons are Justice's job — the exercises that follow this preamble are precisely where validity (columns of the data ↔ columns of the Preceptor Table) gets addressed. A footnote that is genuinely describing the data will happen to expose the features that validity will later confront, and that is enough. No foreshadowing beyond that.
   - **Key-covariate footnote** does the same for the most important covariate (or the treatment, in causal problems): measurement procedure, coding, and any subtlety a reader of the dataset would want to know. Again, describe — do not compare.
   - **Other columns** need footnotes only if there is something specific to say. Don't narrate every column.
   - **Do not discuss validity, stability, representativeness, unconfoundedness, or any of the named assumptions.** Those belong to the exercises that follow. The preamble's data-table footnotes are descriptive; the comparative work — data ↔ Preceptor Table, data ↔ population — is the point of Justice's exercises and does not belong in the preamble.
   - Use the same §10.2 pipeline + inline-block wrapper pattern as the Preceptor/Population Tables so the table renders at content width in learnr. Give the `gt::gt()` call a unique `id` — e.g. `"data_tbl"` — and scope the footnote-cap `opt_css` to it.
3. A Continue button (`###` with no heading) before `### Exercise 1`.

Parts 1 and 2 are deliberately repetitive with Wisdom — same Preceptor Table, same data a reader has already seen in an EDA plot. That is the point: a reader who skipped Wisdom can still start Justice, and a reader who didn't gets a useful refresher. See §5.5.

**Exercise 1.** [canonical, tier-dependent presence and tier-staged wording] Components of Justice.
- **Tier presence:** See §13 pre-flight list for the rotation. When *not* asked, the Justice preamble (§13.3) includes a *"Remember that …"* reminder with the wording for that tutorial's tier.
- **Prompt** (tier-agnostic): *In your own words, describe the components of Justice when working on a data science problem.*
- **Message** (tier-staged per §1.3 *Worked example: Justice's definition across three levels*):
  - **Easy:** `"Justice reviews the Population Table and selects the formula for the data generating mechanism."`
  - **Medium:** `"Justice concerns the Population Table, the four key assumptions which underlie it (validity, stability, representativeness, and unconfoundedness), and selects the formula for the data generating mechanism."`
  - **Hard:** `"Justice concerns the Population Table, the four key assumptions which underlie it (validity, stability, representativeness, and unconfoundedness), and the choice of probability family and link function for the data generating mechanism."`
- **End** (tier-staged; always previews the next tier per §1.3):
  - **Easy:** *"Justice is about concerns that you (or your critics) might have, reasons why the model you create might not work as well as you hope. The exercises that follow walk through several such concerns by name. Justice also picks the formula for the data generating mechanism --- different outcome variables call for different formulas, a piece that gets more technical names in later tutorials."*
  - **Medium:** *"Justice is about concerns that you (or your critics) might have, reasons why the model you create might not work as well as you hope. The 'formula for the data generating mechanism' has two pieces with formal names: a probability family (the distribution of the outcome --- Normal, Bernoulli, multinomial, ordinal) and a link function (how the outcome's expected value depends on the covariates). We will use those terms freely in Hard tutorials."*
  - **Hard:** *"Justice is about concerns that you (or your critics) might have, reasons why the model you create might not work as well as you hope."*
- **Reminder text** (used in the Justice preamble when this exercise is skipped): *"Remember that <tier-appropriate message wording>."* Use the same tier-staged wording as the message above.

**Exercise 2.** [canonical] Define validity.
- Prompt: *In your own words, define "validity" as we use the term.*
- Message: `"Validity is the consistency, or lack thereof, in the columns of the data set and the corresponding columns in the Preceptor Table."`
- End: the validity-as-columns knowledge drop (§12.3).

**Exercise 3.** [per-tutorial, written-with-answer] A validity concern for this problem.
- Prompt: *Provide one reason why the assumption of validity might not hold for the outcome variable `XX` or for one of the covariates. Use the words "column" or "columns" in your answer.*
- Message pattern: specific concern about outcome and/or covariate columns. Our answer should be longer than the one we expect from students, ideally mentioning both.
- End: *In order to consider the Preceptor Table and the data to be drawn from the same population, the columns from one must have a valid correspondence with the columns in the other. Validity, if true (or at least reasonable), allows us to construct the Population Table, which is the first step in Justice.* Optionally also: *Because we control the Preceptor Table and, to a lesser extent, the original question, we can adjust those variables to be closer to the data we actually have.*

**Exercise 4.** [canonical] Define a Population Table.
- Prompt: *In your own words, define a Population Table.*
- Message: `"The Population Table includes a row for each unit/time combination in the underlying population from which both the Preceptor Table and the data are drawn."`
- End: the Population Table is bigger knowledge drop (§12.3).

**Exercise 5.** [per-tutorial, written-with-answer] The unit/time combination.
- Prompt: *Specify the unit/time combinations which define each row in this Population Table.*
- Message: per-tutorial.
- End: the arbitrary-time-unit knowledge drop (§12.3). Follow with a rendered `gt` Population Table (§10).

**Exercise 6.** [canonical, tier-stable wording; tier-staged End] Define stability.
- Prompt: *In your own words, define the assumption of "stability" when employed in the context of data science.*
- Message (same at every tier): `"Stability means that the relationship between the columns in the Population Table is the same for three categories of rows: the data, the Preceptor Table, and the larger population from which both are drawn."`
- **End** — tier-staged by *theme* (per §1.3 *Worked example: Stability across three levels*); each tutorial rephrases the theme in fresh wording rather than pasting verbatim from §12.3:
  - **Easy:** theme is *stability and time*. Frame stability as a question about whether the relationship between covariates and outcome holds across the time gap between data collection and the Preceptor Table's reference moment. The longer the gap, the more suspect stability becomes. May seed a forward-pointer that "the relationship in question is really about model parameters" — picked up in Medium tutorials.
  - **Medium:** theme is *stability is about parameters, not distributions*. Frame stability as a question about β₀, β₁, etc., not about whether covariate distributions shift. A change in the distribution of any single variable does not, by itself, violate stability; a change in the slope does. Build on Easy's forward-pointer.
  - **Hard:** theme is *three DGMs and the parallel to representativeness*. Frame stability as the assumption that three DGMs (data, Preceptor Table, broader population) are identical — same parameters, same residual variance. Make the parallel to representativeness explicit: representativeness asks whether *rows* match across the three blocks; stability asks whether *parameters* match. Both are assumptions about sameness across the data/Preceptor divide.

**Exercise 7.** [per-tutorial, written-with-answer; tier-staged End] A stability concern for this problem.
- Prompt: *Provide one reason why the assumption of stability might not be true in this case.*
- **Message** (per-tutorial canonical answer). Two hard rules that authors must follow:
  1. **The canonical answer must be a parameter-change story, not a distribution-change story.** Students will recall the canonical answer; if our answer says "tuition has risen since 2013" or "the demographic mix of riders has shifted" — both *distribution* changes — we have ourselves fallen into exactly the trap the End paragraph is supposed to teach against. The right canonical answer names a *parameter* (a slope, an intercept, the residual variance) and gives a story about why that parameter might have shifted between the data's era and the Preceptor Table's era.
  2. **Be precise about which parameter and which direction.** *"The slope of `grad_rate` on `tuition` may have flattened between 2013 and 2026 because federal aid policy now decouples sticker price from per-student spending"* is the kind of answer to write. *"Things have changed"* is not.
- **End** — tier-staged in parallel with Ex 6 but one rung deeper in sophistication, since the per-tutorial answer (the message) has already given a concrete parameter-change story for the theme:
  - **Easy:** theme is *parameters, not distributions* — the insight that closes the gap between "the world is changing" (which is always true) and "stability is violated" (which is more specific). Each Easy tutorial should hit this theme in fresh wording, and **revisit the point more than once within the same drop**: students very often confuse a distribution shift in the outcome (or in a covariate) with a stability violation, and one mention is not enough. A typical drop hits the point three times — at the level (mean), at the spread (variance), and at the mix (composition) — to make sure students notice that *none* of these are stability violations on their own.
  - **Medium:** push toward the *three-DGM* framing. Continue to repeat the distribution-vs-parameter point if the tutorial's specific concern invites it.
  - **Hard:** structural breaks, regime shifts, or named remedies (time-varying coefficients, changepoint analysis, DiD); whichever fits the problem's specific stability concern. The distribution-vs-parameter point should be assumed by Hard but is worth re-stating once if the specific example invites a slip back into the trap.

**Exercise 8.** [canonical] Define representativeness.
- Prompt: *We use our data to make inferences about the overall population. We use information about the population to make inferences about the Preceptor Table: Data → Population → Preceptor Table. In your own words, define the assumption of "representativeness."*
- Message: `"Representativeness, or the lack thereof, concerns two relationships among the rows in the Population Table. The first is between the data and the other rows. The second is between the other rows and the Preceptor Table."`
- End: the representativeness-ideal-and-reality knowledge drop (§12.3).

**Exercise 9.** [per-tutorial, written-with-answer] Representativeness: data vs. population.
- Prompt: *We do not use the data directly to estimate missing values in the Preceptor Table. Instead, we use the data to learn about the overall population. Provide one reason, involving the relationship between the data and the population, why the assumption of representativeness might not be true in this case.*
- Message: per-tutorial. Do not invoke time — save time-based examples for stability.
- **End:** rephrase the *On representativeness' cost* knowledge drop (§12.3) per the new §12 intro rule (no verbatim copies across tutorials). The drop must include the "might be biased, not will" nuance — bias is a reason to suspect, not a guarantee. **At Easy tier**, also append a one-sentence forward-pointer that there is a *second* representativeness relationship — between the population and the Preceptor Table — that we will pick up in later tutorials. Saying it explicitly avoids ambushing the student when Ex 10 appears at Medium.

**Exercise 10.** [per-tutorial, written-with-answer; **Medium-and-up only — skip in Easy**] Representativeness: population vs. Preceptor Table.
- **Tier:** Easy tutorials skip this exercise entirely. The Easy-tier framing of representativeness is *one-sided* — only the data ↔ population relationship — per §1.3 *Worked example: representativeness across three levels*. The second relationship (population ↔ Preceptor Table) is the Medium-tier upgrade. Easy tutorials still flag this second link in Ex 9's End, but do not exercise it.
- Prompt: *We use information about the population to make inferences about the Preceptor Table. Provide one reason, involving the relationship between the Population and the Preceptor Table, why the assumption of representativeness might not be true in this case.*
- Message: per-tutorial. Again, avoid time.
- End: the stability-vs-representativeness knowledge drop (§12.3), rephrased per §12 rules.

**Exercise 11.** [canonical, causal only] Define unconfoundedness.
- Prompt: *In your own words, define the assumption of "unconfoundedness" when employed in the context of data science.*
- Message: `"Unconfoundedness means that the treatment assignment is independent of the potential outcomes, when we condition on pre-treatment covariates."`
- End: the unconfoundedness-being-causal-only knowledge drop (§12.3).

**Exercise 12.** [per-tutorial, written-with-answer, causal only] An unconfoundedness concern.
- Prompt: *Provide one reason why the assumption of unconfoundedness might not be true (or relevant) in this case.*
- Message: per-tutorial. Confounds are the hardest questions for students — your example must be good, specifying precisely how treatment assignment is correlated with potential outcomes.
- End: the randomization-failing knowledge drop (§12.3).

**Exercise 13.** [operational] Load the modeling package.
- Prompt: *A statistical model consists of two parts: the probability family and the link function. The probability family is the probability distribution which generates the randomness in our data. The link function is the mathematical formula which links our data to the unknown parameters. Add `library(tidymodels)` to the QMD file. Place your cursor on that line. Use `Cmd/Ctrl + Enter` to execute. Note that this sends the line to the R prompt. CP/CR.*
- End: the probability family is determined by the outcome variable $Y$. Pick the relevant one:
  - Continuous → Normal: $Y \sim N(\mu, \sigma^2)$
  - Binary → Bernoulli: $Y \sim \text{Bernoulli}(\rho)$
  - Multi-category unordered → Multinomial
  - Multi-category ordered → Cumulative Logistic
  Full LaTeX for each lives in the template; migrate as needed.

**Exercise 14.** [operational] Add `library(broom)`.
- Prompt: *Add `library(broom)` to the QMD file. Place your cursor on that line. Use `Cmd/Ctrl + Enter`. CP/CR.*
- In later tutorials, shrink the prompt verbiage.
- End: the link function depends on the outcome variable type. Pick the relevant functional form:
  - Continuous → linear: $\mu = \beta_0 + \beta_1 X_1 + \ldots$
  - Binary → log-odds: $\log[\rho / (1 - \rho)] = \beta_0 + \beta_1 X_1 + \ldots$
  - Multinomial → multinomial logistic (three-outcome form in template)
  - Ordinal → cumulative logistic (three-outcome form in template)

**Exercise 15.** [per-tutorial, written-with-answer] Add a weakness sentence to the summary.
- Prompt: *Write one sentence highlighting a potential weakness in your model. Derive it from possible problems with the assumptions above. We will add this to our summary paragraph. So far our version of the summary paragraph looks like this:* (paste our first two sentences). *Your version will be somewhat different.*
- Message: per-tutorial.
- End: *Add a weakness sentence to the summary paragraph in your QMD. You can modify your paragraph, but don't copy/paste our answer exactly. `Cmd/Ctrl + Shift + K`, then commit/push.*

### 13.4 Courage

**Preamble (between `## Courage` header and Exercise 1).** Per the self-containment principle in §5.5, the Courage preamble revisits the two outputs from earlier virtues that Courage needs. Per §14.6, it does not describe what Courage does — Exercise 1 does that. *Exception:* when Exercise 1 is skipped in this tutorial (per the rotation in the §13 pre-flight list), add the canonical definition to this preamble as a reminder — *"Remember that Courage creates the data generating mechanism."* The reminder replaces the exercise. Contents, in order:

**Opening sentence, verbatim:** *"Justice gives us the Population Table and the abstract data generating mechanism."* Single sentence, no additional transitional prose. The two objects that follow stand on their own; no "Recall the…" or "And the abstract form…" labels between them.

1. **The Population Table from Justice**, rendered via the §10.4 `gt` pipeline. Shown immediately after the opening sentence, with no intervening label.
2. **The abstract mathematical form of the DGM** — the functional family chosen at the end of Justice (Normal / Bernoulli / multinomial / cumulative). Pull the block from §13.7. Use plain `N(0, \sigma^2)` for the error term, not `\mathcal{N}` (§13.5, same learnr MathJax bug applies here). **The abstract form must use an open-ended series with ellipsis** (e.g. `$\beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_n X_n + \epsilon$`), never a closed form pinned to the final model's covariate count. At the end of Justice we have decided the mathematical *structure* but not the number (or identity) of covariates; the math needs to reflect that. The concrete DGM in the Temperance preamble (§13.5) is the opposite: every term written out, no ellipsis, with the estimated coefficient values substituted in.
3. A Continue button (`###` with no heading) before `### Exercise 1`.

The "generic variables / Justice decided the family not the covariates" knowledge drop does **not** belong in the preamble — it's too much text after the math. Put it in Exercise 1's End instead (§13.4 Exercise 1).

Parts 1 and 2 are deliberately repetitive with Justice — they show the same Population Table and the same abstract math that Justice's last exercise produced. That is the point: a reader who skipped Justice can still start Courage, and a reader who didn't gets a useful refresher. See §5.5.

**Abstract-math block moves here.** The author-shown abstract mathematical structure that used to live at the end of Justice (§13.3 Exercise 15 in the original draft) now lives in the Courage preamble only — one place, not two.

**Model-checking staging.** Exercises 11 and 12 below (load `easystats`, run `check_predictions()`) are **Medium-tier** as written. In **Easy-tier** tutorials, replace them with a single exercise that shows an author-produced side-by-side plot of outcome distribution vs. fitted-value distribution (no student code; bare `###` Continue button per §6.5) — or in the first two example tutorials, omit model checking entirely. In **Difficult-tier** tutorials, add a follow-up exercise that uses the check to drive a model revision and then re-runs the check on the improved model. The full progression is in §1.3 (Worked example: model checking across three levels).

**Exercise 1.** [canonical, tier-dependent presence] Components of Courage.
- **Tier:** See §13 pre-flight list for the rotation. When *not* asked, the Courage preamble (§13.4) includes a *"Remember that …"* reminder with the canonical definition verbatim.
- Prompt: *In your own words, describe the components of the virtue of Courage for analyzing data.*
- Message: `"Courage creates the data generating mechanism."`
- End: *Having decided on the basic mathematical structure of the model at the end of Justice — a choice mostly driven by the distribution of our outcome variable — we now turn toward estimating the model.*

**Model-family routing and engines.** Most tutorials use `tidymodels` directly — `linear_reg()`, `logistic_reg()`, `multinom_reg()`. The one exception is **ordinal outcomes**: `tidymodels` does not provide an ordinal-regression engine, so those tutorials (currently CES at position 9) call `MASS::polr()` directly rather than via `parsnip`. The pattern:

```r
# setup chunk — NOTE load order
library(MASS)       # load BEFORE tidyverse so select() is shadowed correctly
library(tidyverse)  # tidyverse's select() wins; MASS's select() is hidden
library(tidymodels)

# fit
fit_<n> <- polr(ordinal_outcome ~ covariates, data = x)
```

Loading `MASS` *after* `tidyverse` silently breaks `dplyr::select()` across the rest of the tutorial — every subsequent `select()` call resolves to `MASS::select()` and fails. Flag the load-order requirement in any ordinal tutorial's setup chunk with a comment. Do not call `conflicted` or `conflicts_prefer()` — the students aren't ready for package-conflict resolution at this tier; the load-order workaround is sufficient.

`broom::tidy()` works on `polr()` objects, so downstream `tidy(fit_<n>, conf.int = TRUE)` exercises don't need adjustment.

**Interaction terms.** Interactions appear across model families — `logistic_reg() |> fit(voted ~ treatment*voter_class, ...)` in Shaming (position 6), `linear_reg() |> fit(lived_after ~ election_age*sex, ...)` in Governors (position 10), `linear_reg() |> fit(arrested ~ race*zone, ...)` in Stops (position 11 recast). The `A*B` formula shorthand expands to `A + B + A:B` — the two main effects plus their interaction. Use it inside `fit()` the same way in every model family; the machinery is formula-side, not engine-side. Interpretation requires `marginaleffects::plot_predictions(..., condition = c("A", "B"))` to visualize the two-dimensional effect surface (§13.5).

**Exercise 2.** [per-tutorial, code] Start the model.
- Prompt: *Because our outcome variable is [binary/continuous/multinomial/ordinal], start to create the model by entering `<appropriate model function>`* — `linear_reg(engine = "lm")` for continuous, `logistic_reg(engine = "glm")` for binary, `multinom_reg(engine = "nnet")` for multinomial, `MASS::polr()` (no parsnip wrapper) for ordinal.
- End: the tidymodels knowledge drop (§12.4); in ordinal tutorials, add a sentence explaining that ordinal regression is the one model family outside the tidymodels umbrella.

**Factor-outcome gotcha for `logistic_reg()`.** `tidymodels`' `logistic_reg(engine = "glm") |> fit(y ~ x, data = d)` requires `y` to be a **factor**, not a raw 0/1 integer. If `y` is integer, the call fails with an opaque error. Fix in data-prep with `mutate(y = as.factor(y))`. Flag this in the relevant tutorial's Wisdom data-prep exercise; it is easy to miss and hard for students to debug on their own.

**The Courage parameter-interpretation block.** Courage is now where students do almost all of their parameter interpretation. The pattern is: fit a candidate model with one kind of covariate, look at the parameter table, interpret one coefficient; then fit a candidate model with a *different* kind of covariate, interpret again; then fit the final model. Each fit serves two purposes:

1. **Practice interpretation across covariate types** — binary/two-level categorical, multi-level categorical (3+ levels), and continuous. Each type teaches a different reading of the parameter table (the dummy-variable-vs-reference-level reading for categoricals, the per-unit-comparison reading for continuous), and the only way to internalize them is to do each at least once.
2. **Explore which variables belong in the model** — by fitting a candidate model and reading its CIs, students can see whether a covariate carries enough signal to keep. The final model is then justified, not just declared.

Concretely, an Easy/Medium tutorial's Courage runs through three model fits:

- **Fit A** — outcome on one covariate of one type (typically the binary or two-level categorical the question first reaches for).
- **Fit B** — outcome on a *different* covariate, of a different type when the dataset has one available. If only one type is available (e.g. NHANES has only `sex` (binary) and `age` (continuous) for the height question), use the other type here.
- **Fit C (final)** — the final model the rest of the tutorial uses, typically a combination of A's and B's covariates plus any others the question requires.

When the dataset has only one usable covariate type (rare), do two fits — outcome alone (intercept-only) and outcome on the one covariate. The intercept-only fit still teaches *something* (the §13.5 simple-model interpretation pattern, now relocated to Courage).

For *causal* tutorials, the structure is similar but more constrained: Fit A is `outcome ~ treatment`, Fit B is `outcome ~ treatment + covariate` (adjusting for one covariate to show how the treatment estimate moves under adjustment), Fit C is the final model. The interpretation question after each is about the treatment coefficient — *causal* language is required (and contrasted with predictive comparison language at H tier per §1.6 commitment 1).

**Each fit gets two exercises (per §6.5: no fake placeholder questions; the parameter table folds into the interpretation exercise's preamble):**
1. **Code exercise.** Pipe `linear_reg() |> set_engine("lm") |> fit(formula, data = ...)` (or the appropriate `_reg` variant). The first fit defines the chain; subsequent fits use a "Copy previous code" button and just change the formula. **Do not pipe into `tidy(conf.int = TRUE)` here** — the parameter-table display lives in the next exercise's preamble.
2. **Interpretation exercise (with parameter table in the preamble).** Open with one or two sentences naming the model just fit; show an `echo: false` chunk that runs `tidy(conf.int = TRUE) |> select(term, estimate, conf.low, conf.high) |> mutate(across(where(is.numeric), \(x) round(x, n)))` for the just-fit model, with the §14.9 rounding rule applied; then ask a `question_text()` written-with-answer question about one coefficient. The canonical answer follows §1.6 commitment 1 (comparison language for predictive; causal language for causal) and commitment 5 (percentage-points vs. percent precision when the outcome is a proportion).

The interpretation questions are concentrated in Courage so the parameter-table-reading skill is fully exercised before Temperance starts. Temperance (§13.5) then assumes that skill; it spends its time on `marginaleffects` instead.

**Exercise 3.** [per-tutorial, code] Fit A: outcome on one covariate.
- Prompt: *Continue the pipe to `fit(<outcome> ~ <covariate A>, data = <tibble>)`.* Use the simplest covariate of the chosen type.
- Copy-previous-code button is included.
- End: brief contextual note about what kind of covariate this is (binary, three-level, etc.).

**Exercise 4.** [per-tutorial, written-with-answer] Interpret a coefficient from Fit A (parameter table in the preamble).
- Preamble: a one-sentence opener naming the model, then an `echo: false` chunk that displays the rounded `tidy()` table for Fit A.
- Prompt: *Looking at the parameter table above, write a sentence interpreting the [coefficient].*
- Message: per-tutorial canonical answer using comparison language (predictive) or causal language (causal). Include the §1.6 commitment 5 percentage-points-vs-percent precision when the outcome is a proportion.
- End: knowledge drop appropriate to the covariate type — dummy-variables-from-2-level for a binary covariate, dummy-variables-with-N-categories for a multi-level factor, or the per-unit-comparison drop for a continuous covariate. Optional forward-pointer to Fit B.

**Exercise 5.** [per-tutorial, code] Fit B: outcome on a different covariate (or, when only two covariates exist, the same covariate plus a second; for causal tutorials, `outcome ~ treatment + covariate` showing adjustment).
- Prompt: *Change the formula to `<outcome> ~ <covariate B>` (or the per-tutorial alternative). Refit.*
- Copy-previous-code button.
- End: short note about why we are looking at a second model.

**Exercise 6.** [per-tutorial, written-with-answer] Interpret a coefficient from Fit B (parameter table in the preamble).
- Preamble + parameter-table chunk identical in pattern to Exercise 4.
- Prompt: *Write a sentence interpreting the [coefficient].*
- Message: per-tutorial. The covariate type or role is typically different from Fit A's, so the reading is different (dummy reference for multi-level categorical, per-unit comparison for continuous, or the comparison/causal contrast for an adjusted causal estimate).
- End: knowledge drop matching the new covariate type or the adjustment-vs-unadjusted comparison. **For two-fit tutorials (datasets with limited covariate types), this is the last interpretation exercise; the End closes the block by stating which fit is the final model.**

**Exercise 7.** [per-tutorial, code; *omit in two-fit tutorials*] Fit C: the final model combining covariates.
- Prompt: *Now fit the final model: `<final formula>`.*
- Copy-previous-code button.
- End: short note that this is the model the rest of the tutorial will use, and that it has more than one covariate so the next interpretation will need an *adjustment clause*.

**Exercise 8.** [per-tutorial, written-with-answer; *omit in two-fit tutorials*] Interpret a coefficient from the final model with adjustment (parameter table in the preamble).
- Preamble + parameter-table chunk identical in pattern to Exercises 4 and 6, but with the final-model fit.
- Prompt: *Write a sentence interpreting [coefficient] in the final model.*
- Message: per-tutorial. **Must include the adjustment clause** ("adjusting for ...") since the model now has more than one covariate; see §13.5 *Which parameters to interpret: the three axes* for the rule. Use the appropriate language commitment (predictive comparison or causal causal-effect).
- End: the more-variables-less-interpretability knowledge drop (§12.4), customized; this is also a natural place to land the §1.6 commitment 4 "expected values describe groups, not individuals" point if the CI's exclusion of zero is the right hook.

**Numbering for two-fit and three-fit blocks.** Three-fit Courage (most predictive tutorials with both categorical and continuous covariates) uses Exercises 3–8 as the parameter block; the operational exercises that follow start at Ex 9. Two-fit Courage (tutorials whose dataset has limited covariate variety) uses Exercises 3–6; the operational exercises start at Ex 7. The exercise numbers below assume the three-fit pattern (operational from Ex 9); subtract 2 throughout for two-fit tutorials.

**Exercise 9.** [per-tutorial, code] Display the fit object.
- Prompt: *Behind the scenes, an object called `fit_<n>` has been created (the final model from the previous exercise). Type `fit_<n>` and hit "Run Code."*
- End: the code-being-primary knowledge drop (§12.4).

**Exercise 10.** [operational] Bring `fit_<n>` into R World.
- Prompt: *We need `fit_<n>` to exist in R World. Copy/paste this code to the R prompt and execute it:*
  ```
  fit_<n> <- <model spec> |>
    fit(<final formula>, data = <tibble>)
  ```
- *CP/CR.*
- End: the workspace-awareness knowledge drop (§12.4).

**Exercise 11.** [operational] Load easystats at the R prompt.
- **Tier:** Medium only. **Omit entirely** in positions 1–2 (target tutorials 06 Recruits, 07 Trains). In the remaining Easy positions 3–4 (target tutorials 08 Colleges, 09 SPS), replace both Exercises 11 and 12 with a single author-rendered side-by-side plot of outcome distribution vs. fitted-value distribution — the student views it and hits Continue (a bare `###`, no question chunk per §6.5); no package loaded, no terminology introduced. In Hard positions 9–10 (target tutorials 14 CES, 15 Governors), keep Exercises 11–12 and add a follow-up exercise that uses the check to drive a model revision. In Hard positions 11–12 (random forest tutorials), drop the model-checking block entirely per §14.8. Full progression in §1.3 *Worked example: model checking across three levels*.
- Prompt: *At the R prompt, load the [easystats](https://easystats.github.io/easystats/) package. CP/CR.*
- End: the why-easystats-isn't-in-the-QMD knowledge drop (§12.4).

**Exercise 12.** [operational] Run `check_predictions()`.
- **Tier:** Medium only. See Exercise 11's tier note above — same rules.
- Prompt: *At the R prompt, run `check_predictions(extract_fit_engine(fit_<n>))`. CP/CR.*
- End: the `check_predictions()` knowledge drop (§12.4). Add a sentence noting whether the simulated data looks like the actual data for this problem.

**Exercise 13.** [author-shown block in Easy and Medium; optional student exercise in Difficult tutorials with simple models only] Concrete LaTeX DGM.
- **Tier:** Easy and Medium → author-shipped (no student exercise). Difficult with simple models → may be a student exercise (AI-assisted). Difficult with complex models → author-shipped. Never purely abstract LaTeX at this position — that form lives in the Courage preamble only.
- **Default (Easy, Medium, and Difficult tutorials with many parameters):** author-shipped. Render the fitted model in LaTeX with variable names and estimated coefficient values substituted in — the concrete DGM. Apply §14.13 conventions (`\widehat{\text{Outcome Name}}` rather than `\hat{\text{var\_name}}`; `\begin{aligned}` to wrap formulas with more than ~3 RHS terms). Include the hat-and-error-term knowledge drop (§12.4) followed by: *This is our data generating mechanism.* Then the DGM-being-a-formula knowledge drop (§12.4). Use a bare `###` Continue button after the formula (no fake `question_text()` per §6.5).
- **Difficult tutorials with simple models** (few coefficients, no many-level categoricals) may optionally include a student-produced version: the student prompts AI for the LaTeX and pastes it into their QMD. Even here, the heavy lifting is AI; the student is checking and pasting, not deriving.
- The concrete LaTeX DGM is also referenced in the §13.5 Temperance preamble as the fourth way to describe a model.

**Exercise 14.** [operational] Cache the fit in the QMD.
- Prompt: *Create a new code chunk in your QMD. Add the chunk option `#| cache: true`. Copy/paste the R code for the final model into the chunk, assigning the result to `fit_<n>`. (This includes `fit()` but not `tidy()`.) Place your cursor on the `fit_<n>` line and use `Cmd/Ctrl + Enter`. (This is technically unnecessary since we already have `fit_<n>` in the workspace, but ensuring everything in the QMD is also at the R prompt is good habit.) `Cmd/Ctrl + Shift + K`. Rendering may be slow the first time but cached thereafter. At the R prompt, run `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: the caching knowledge drop (§12.4). *To confirm, `Cmd/Ctrl + Shift + K` again. It should be quick.*

**Exercise 15.** [operational] Add `*_cache` to `.gitignore`.
- Prompt: *Add `*_cache` to `.gitignore`. Cached objects are often large and don't belong on GitHub. At the R prompt, run `tutorial.helpers::show_file(".gitignore")`. CP/CR.*
- End: *Because of the change in your `.gitignore` (assuming you saved it), the cache directory should not appear in the Source Control panel because Git is ignoring it. Commit and push.*

**Exercise 16.** [per-tutorial, code] Run `tidy(fit_<n>, conf.int = TRUE)`.
- Prompt: *At the R prompt, run `tidy()` on `fit_<n>` with `conf.int = TRUE`. This returns 95% intervals for all the parameters of the final model.*
- End: the `broom` knowledge drop (§12.4).

**Exercise 17.** [per-tutorial, written-without-answer] Make a nice table from `tidy()`.
- Prompt: *Create a new code chunk in your QMD. Ask AI to make a nice-looking table from the tibble returned by `tidy()`. You don't need all the columns — estimate and confidence intervals is typical. You may need to load [tinytable](https://vincentarelbundock.github.io/tinytable/), [knitr](https://yihui.org/knitr/), [gt](https://gt.rstudio.com/), [kableExtra](https://haozhu233.github.io/kableExtra/), [flextable](https://davidgohel.github.io/flextable/), or [modelsummary](https://modelsummary.com/) in the setup chunk. Insert your table code. `Cmd/Ctrl + Shift + K`. At the R prompt, `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: show our table and our code. Closing knowledge drop: *At the very least, your table should include a title and a caption with the data source. The more you use AI, the better you will get at doing so.*

**Exercise 18.** [per-tutorial, written-with-answer] Model-structure sentence.
- Prompt: *Add a sentence to your project summary explaining the structure of the model. Something like: "I/we model XX [concept of outcome, not variable name] as a [normally distributed / Bernoulli / multinomial / ordinal] variable which is a [linear/logistic/multinomial/ordinal] function of XX [and maybe other covariates]." Name the outcome's distributional family before the functional-form clause — Justice's choice of probability family is part of the model, not just the link function. Recall the beginning of our summary: [paste what we suggested at the end of Justice].*
- Message: per-tutorial.
- End: *Read our answer. Do not copy/paste exactly. Add your two sentences to the summary paragraph. `Cmd/Ctrl + Shift + K`, then commit/push.*

### 13.5 Temperance

**Preamble (between `## Temperance` header and Exercise 1).** The Temperance preamble reviews the DGM decided on at the end of Courage. Per §14.6, it does not describe what Temperance does — Exercise 1 does that. *Exception:* when Exercise 1 is skipped in this tutorial (per the rotation in the §13 pre-flight list), add the canonical definition to this preamble as a reminder — *"Remember that Temperance interprets the data generating mechanism and then uses it to answer, with the help of graphics, the question(s) with which we began. Humility reminds us that this answer is always false."* The reminder replaces the exercise. Contents, in order:

**Opening sentence, verbatim:** *"Courage provides the data generating mechanism. We can express the DGM in four ways:"* Single two-sentence block, no additional transitional prose. No "the fitted model `fit_<n>` can be described in four complementary ways" variant — the canonical opener is fixed.

1. The four ways to describe the DGM (below), shown in sequence with their bold headers (**In words:**, **In R code:**, **In a parameter table:**, **As a mathematical formula:**).
2. A Continue button (`###` with no heading) before `### Exercise 1`. Students must hit Continue to advance — they should not see Exercise 1 on the same screen as the preamble.

**Do not include the marginaleffects book link in the preamble.** Mention of the package and its companion book belongs in Exercise 1's End (the canonical-definition knowledge drop), and even there it stays brief: name the **[marginaleffects](https://marginaleffects.com/)** package as Temperance's tool and the *[Model to Meaning](https://marginaleffects.com/)* book by Vincent Arel-Bundock as the reference. Do **not** link a specific chapter from Exercise 1's End — chapter-specific links (Predictions, Comparisons, Challenge, Framework) belong, if anywhere, near a later exercise that actually uses that chapter's tools. In practice we rarely link a specific chapter at all; the package and book mention is enough to point students who want the reference to it.

**Do not include a dummy-variable explanatory paragraph after the concrete formula.** The preamble's math block is the formula and the error-distribution line — no trailing "`sexMale` is a dummy variable: 1 for male..." paragraph. If dummy-variable meaning matters for a specific tutorial, it belongs in an Exercise 3–5 End (where interpretation lives), not in the preamble.

**Four ways to describe a model.** Most Temperance preambles combine some subset of these four:

1. **Words.** *"We model [outcome] as a [outcome distribution] variable which is a [functional form] of [covariates]."* The verb is **model**, not "describe" — we are not narrating the model, we are committing to one. The sentence names the outcome's distributional family (normally distributed, Bernoulli, multinomial, ordinal) before the functional-form clause; without it the sentence understates what was actually decided in Justice. Examples: *"We model height as a normally distributed variable which is a linear function of sex."* *"We model voter turnout as a Bernoulli variable which is a logistic function of treatment, age, sex, and prior voting."* *"We model presidential vote as a multinomial variable which is a multinomial logistic function of sex."* **Exception to the §12 "rephrase per tutorial" rule:** this sentence is one of the few items the curriculum reuses verbatim across multiple places within a single tutorial — the Temperance preamble's *In words:* line, the §13.4 Exercise 18 model-structure summary sentence, and the Courage model-structure question's canonical answer all say it the same way, so students see one consistent sentence about "what model are we using." The verbatim form is the answer key, not a knowledge drop. Across *different* tutorials each tutorial fills in its own outcome / family / covariates, so no two tutorials end up with literally identical sentences.
2. **R code.** The fitting call itself — e.g. `linear_reg(engine = "lm") |> fit(att_end ~ treatment, data = trains)` → `fit_att`. Rendered as a code block; not re-run in the preamble.
3. **Parameter table.** The estimated parameter values. *Easy:* rough `tidy(fit_<n>, conf.int = TRUE)` output. *Medium:* nicer table via `knitr::kable()`, `gt`, or equivalent. *Difficult:* close to publication quality. The Primer does not teach students to build these tables in Easy or Medium — the author ships them. In Difficult tutorials with few parameters, a student exercise using AI to produce the table is possible; in Difficult tutorials with many covariates or many-level categoricals, the table is too complex to hand to a student, and the author ships it.
4. **Concrete mathematical formula.** The fitted model in LaTeX with variable names and estimated coefficient values substituted in — the "true" DGM. This is the form the Temperance preamble uses for math. Never asked of students in Easy or Medium. Possibly asked (via AI) in Difficult tutorials with simple models; author-shipped otherwise.

**The Temperance preamble never shows the abstract mathematical structure.** That abstract form (the fifth form — $Y$, $X_1$, $\beta_0$, …) belongs to Justice, where the student is choosing a functional family (§13.3). By Temperance the parameter values exist; the concrete DGM is what's on the table. Showing abstract LaTeX here only teaches students to gloss past it.

**Concrete DGM rules.**

- **No ellipsis.** The concrete DGM writes out every term of the fitted model explicitly — one `β · X` product per covariate, plus intercept and error term. An ellipsis in the concrete formula would be an error: once the model is fit, every parameter has a value and every term has a name. This is the opposite of the Courage preamble's abstract form, which must use `+ ⋯ + β_n X_n + ε` because the covariate count isn't yet decided at that stage (see §13.4 abstract-math rule).
- Use the real variable names from the model, not $Y$ and $X_1$. Categorical predictors appear as the dummy variable names R produces — `sexMale`, `treatmentTreated`, `partyRepublican`. State explicitly in one sentence what each dummy encodes (which level is 1, which is 0) and what the intercept represents.
- Use `N(0, …)` (not `\mathcal{N}(0, …)`) for the error term — `\mathcal{N}` renders as an empty box (□) in learnr's MathJax setup; we have hit this bug repeatedly.
- **Substitute the estimated residual variance, not the symbol `\sigma^2`.** The point of the concrete DGM is to show numbers: every parameter the model fits (including the residual variance) is a number, and the math should display it. Compute `sigma(extract_fit_engine(fit_<n>))`, square it, round to the tutorial's rounding convention, and write `N(0, 40.3)` (or whatever the value is). Follow with a one-sentence note naming the residual SD as well (e.g. *"a residual SD of about 6.4 cm"*) so students see both forms.
- Parameter values in the math **must match the parameter table** to the same number of significant figures. If the table shows `161`, the math shows `161`, not `161.17778`. Three significant figures is the default; apply it to the residual variance too.
- To keep the table and math in sync, round the table with `mutate(across(where(is.numeric), \(x) signif(x, 3)))` in the preamble chunk, then use those same rounded values — plus the separately-computed rounded residual variance — in the LaTeX.

**We do not ask students to write LaTeX themselves.** The previous curriculum had exercises (old §13.3 Exercise 15, old §13.4 Exercise 11) asking students to prompt AI for LaTeX and paste it in. Those student-facing exercises are removed; the LaTeX is now shown to students, not produced by them. A small number of Difficult tutorials with simple models may keep a student-produced LaTeX exercise, but the heavy lifting is AI — the student is checking and pasting, not deriving.

**Most parameter interpretation now happens in Courage.** Per the §13.4 Courage parameter-interpretation block, students interpret coefficients from a sequence of candidate models there. By the time Temperance starts, the parameter-table-reading skill is already exercised. Temperance's job is therefore narrower: connect the (already-interpreted) parameters to predictions on the outcome scale via `marginaleffects`. Temperance has *no* parameter-interpretation block; it goes straight from the components-of-Temperance Ex 1 to loading `marginaleffects`.

**Exercise 1.** [canonical, tier-dependent presence] Components of Temperance.
- **Tier:** See §13 pre-flight list for the rotation. When *not* asked, the Temperance preamble (§13.5) includes a *"Remember that …"* reminder with the canonical definition verbatim.
- Prompt: *In your own words, describe the use of Temperance in data science.*
- Message: `"Temperance interprets the data generating mechanism and then uses it to answer, with the help of graphics, the question(s) with which we began. Humility reminds us that this answer is always false."`
- End: the Courage-handoff knowledge drop (§12.5).

**Optional final-DGM interpretation question (Easy only).** If, when authoring a tutorial, the §13.4 Courage interpretation block somehow misses an interpretation worth making — e.g. an intercept that the per-fit interpretation questions never asked about, or a CI's exclusion-of-zero point that the §1.6 commitment 4 wants to drive home — Temperance may include **at most one** parameter-interpretation question early in the section to fill that gap. This is the exception, not the default; in most tutorials Temperance jumps straight to `marginaleffects`. When this exception applies, the question goes between the components-of-Temperance Ex 1 and the load-marginaleffects exercise (which would then renumber from Ex 2 to Ex 3, and so on through the section).

**Interpretation language: stay at the model level, don't drift to the data.** This rule still applies to any parameter-interpretation exercise, in Courage or in Temperance. Use the **expected value** framing: *"The expected value of [outcome] for a [unit description] is [coefficient]."* Do **not** equate a coefficient with a sample summary statistic, even when (as for an intercept-only OLS) they happen to coincide. Saying *"the average height of a young adult in our sample is 169.7 centimeters"* trains students to confuse the parameter with the sample mean; in general (non-linear models, models with covariates, anything beyond a degenerate case) parameters do not equal any easily-calculated data summary, and we should not encourage that habit. The §13.4 Courage interpretation questions and (when present) the optional Temperance interpretation question all use this framing.

**End-of-warm-up knowledge drop** (when the simple-model warm-up appears in Courage as Fit A's interpretation End). Bridge from "the DGM has only one prediction" to "the next model adds a covariate and gets one prediction per group." Canonical wording:

> *"Without a covariate, the model can only emit one prediction — the same one for every unit. Adding `[covariate]` lets the DGM produce different predictions for different units, which is the whole point of having a covariate."*

Replace `[covariate]` with the actual variable the next exercise's model adds (e.g. `sex` for NHANES). Do **not** say things like "the simplest model has one parameter: the overall mean" or "that mean is the best guess when we know nothing" — those phrasings reintroduce the parameter-equals-sample-mean confusion that the *Interpretation language* paragraph above forbids. Stay at the model level: parameters produce predictions; covariates let the model produce *different* predictions for *different* units.

**Interpretability ceiling by model family** (governs Courage interpretation questions in §13.4 and any optional Temperance interpretation question). Not every model's parameters are equally interpretable. The student-facing interpretation work scales accordingly:

- **Linear models (continuous outcome, identity link).** Fully interpretable. Coefficients sit on the outcome scale — a β of 15.9 literally means "15.9 more centimeters of height" (with comparison framing). Courage's interpretation questions are direct.

- **Non-linear link-function models (logistic, multinomial, cumulative, Poisson, etc.).** Partially interpretable. Coefficients sit on a link scale — log-odds, log-rate, cumulative logits — which is not the scale the question is asked on. A direct interpretation is possible ("a one-unit increase in X raises the log-odds of Y by β"), but it is not intuitive, and **we do not ask students to produce that interpretation as their answer**. Instead: the author **notes the link-scale interpretation once, in a knowledge drop**, so students see what it would look like; the Courage interpretation *exercises* for these models focus elsewhere — on recognizing that the coefficients are not on the outcome scale, on identifying the reference category and the sign of β, on asking why the next step is `marginaleffects`. The real answer to "what does this model say?" happens in Temperance's `marginaleffects` block via `predictions()` and (from Medium onward) `comparisons()`, which bring results back to the outcome scale.

- **Non-parametric models (random forest, gradient boosting, neural nets).** Not interpretable at the parameter level. Don't show a parameter table; the object `fit_<n>` does not have meaningful coefficients to `tidy()`. **In Courage, replace the multi-fit interpretation block with a single exercise whose only purpose is to make the student articulate *why* the parameters are not directly interpretable** — see §14.8. All the answering happens downstream via `marginaleffects` in Temperance.

This ordering determines how much real estate the Courage parameter block consumes (§13.4) and how much Temperance can devote to `marginaleffects`. Easy linear-model tutorials run the full Courage three-fit interpretation block. Easy logistic/multinomial tutorials run the same Courage block but with link-scale cautions in the Ends. Non-parametric tutorials run a single "why parameters don't help here" exercise in Courage and skip directly to `marginaleffects` in Temperance.

**Which parameters to interpret: the three axes** (governs Courage interpretation questions in §13.4 — Exercises 5, 8, 11 — and any optional Temperance interpretation question). Pick which parameters (or comparisons) to interpret. The choice depends on three axes. (Shorthand: **EMH** = Easy / Medium / Hard, what §1.3 previously called Easy / Medium / Difficult. Going forward, prefer *EMH* and *Hard*; the word *Difficult* elsewhere in this file is the same tier.)

1. **Variable type.** Three cases come up — and Courage's three-fit structure is designed to hit each:
   - **Binary** (2-level categorical, typically dummy-coded by R as `variableLevelName`). Interpretation language: *"When we compare two [units] differing in [covariate], the [Level=1] group has [X more] [outcome] than the [Level=0] group."* Plus the adjustment clause if there are other covariates.
   - **Multinomial** (3+ levels). Each non-reference level becomes its own dummy, interpreted *relative to the reference category* — which by default is the first level alphabetically (or the first factor level if set by hand). Interpretation language: *"Compared to [reference level], [Other Level] [units] have [X more] [outcome]."* Whenever a multi-level coefficient is interpreted, state the reference level explicitly; students confuse it otherwise.
   - **Continuous.** Per-unit comparison language: *"When we compare two [units] differing by one unit of [X], the higher-[X] group has [β more] [outcome]."* When the variable's natural unit is not 1 (e.g. a year's worth of income change may make no practical sense), either rescale before fitting or name a meaningful comparison (*"colleges differing by $10,000 of tuition..."*).
2. **Variable role.** A variable is either a standard **covariate** or (in causal models only) a **treatment**.
   - For **covariates** in *predictive* models, use associational/comparison language per §1.6 commitment 1: *"when comparing two groups differing in X, group A has Y more outcome"* — no *cause*, *effect*, *impact*, *influence*, *raise*, *change*. See the non-treatment-variables knowledge drop (§12.5).
   - For **treatments** in *causal* models, use causal language: *"causal effect of X on Y," "the effect of [treatment]."* In any causal tutorial, try to make **at least one of the three Courage interpretation questions be about the treatment's coefficient** — the treatment is the variable the question is actually about, and interpreting its coefficient is what the model is for.
3. **Number of covariates.** Every interpretation must name the other covariates it is conditional on, if there are any.
   - **One covariate** (Fits A and B in Courage's three-fit block, when those fits each have a single covariate): no adjustment clause needed.
   - **Two or more covariates** (Fit C, the final model): every interpretation sentence ends with an adjustment clause — *"…adjusting for [list of other covariates]."* Use **adjust** in preference to **control**; see the adjust-vs-control knowledge drop (§12.5). Omitting the adjustment clause is the single most common student error on interpretation exercises, which is why our canonical `message` always includes it. Fit C's interpretation question (§13.4 Exercise 11) is where the adjustment clause first appears in the curriculum.

**EMH progression for the Courage interpretation block (§13.4 Exercises 5, 8, 11):**
- **Easy** (positions 1–4, target tutorials 06–09). All linear models. The three-fit progression — binary or multi-level categorical (Fit A), the other categorical type or continuous (Fit B), final combined (Fit C) — is the curriculum's first place to practice interpretation across covariate types. The adjustment clause appears for the first time at Fit C's interpretation question.
- **Medium** (positions 5–8, target tutorials 10–13). First link functions (logit in Smokes at position 5, Shaming at position 6; multinomial in NES at position 7). Adjustment clauses are mandatory. Students are **not** asked to produce link-scale interpretations; the author notes the link-scale form once, and Courage's interpretation Ends focus on identifying reference categories, the sign of β, and why we need `marginaleffects`. Interactions, when they appear, force conditional interpretation — *"the effect of X depends on the value of Z."*
- **Hard** (positions 9–12, target tutorials 14–17). Cumulative logit (CES at position 9), RDD causal identification (Governors at position 10), and non-parametric models (random forests at positions 11 and 12). Non-parametric models replace the three-fit Courage block with a single "why parameters don't help" exercise per §14.8. Where the multi-fit block remains, keep at least one fit whose interpretation question requires the student to articulate *why* the parameter is opaque — the failure to interpret is itself the lesson, and it sets up the Temperance `marginaleffects` work that follows.

**Exercise 2.** [operational] Load `marginaleffects`.
- Prompt: *In the end, we don't really care about parameters. Parameters are imaginary, like unicorns. We care about answers to our questions. In the modern world, all parameters are nuisance parameters. Add `library(marginaleffects)` to the QMD. Place your cursor on that line. Use `Cmd/Ctrl + Enter`. CP/CR.*
- End: the humility knowledge drop (§12.5).

**Exercise 3.** [per-tutorial, written-with-answer] The specific question.
- Prompt: *What is the specific question we are trying to answer?*
- Message: per-tutorial. May match the Wisdom Exercise 10 question or differ.
- End: the data-science-projects-begin-with-decisions knowledge drop (§12.5).

**Exercise 4.** [per-tutorial, written-without-answer] Run `predictions()`.
- Prompt: *At the R prompt, run `predictions()` on `fit_<n>`. CP/CR.*
- End: the `predictions()` knowledge drop (§12.5), noting actual row count. Add a second sentence specific to what's interesting about this output.

**Exercise 5.** [per-tutorial, written-without-answer] Run `plot_predictions()` (first version).
- Prompt: *At the R prompt, run `plot_predictions()` on `fit_<n>` with [specific arguments]. CP/CR.*
- End: discuss the estimate and uncertainty the plot shows. Explain how to read the estimate and confidence interval from the plot.

Insert additional `plot_predictions()` exercises as needed — different arguments, options like `points`, or `draw = FALSE` to return a tibble. `plot_comparisons()` belongs here when the question calls for differences rather than level estimates (see §12.5).

**Multi-variable conditioning.** `plot_predictions(fit_<n>, condition = c("var1", "var2"))` visualizes the effect surface across two covariates — canonical when the model has an interaction term (`A*B` in the formula). This pattern appears in Shaming (`treatment` × `voter_class`), Governors (`election_age` × `sex`), and Stops (`race` × `zone`). The two-variable form renders as small multiples: one panel per level of `var2`, with `var1` on the x-axis.

**Multinomial caveat.** `marginaleffects` does not fully support multinomial outcomes from `multinom_reg(engine = "nnet")`. `predictions()` works (returns one row per unit per outcome category), but `plot_predictions()` and `comparisons()` may need manual post-processing: extract the tibble with `draw = FALSE`, pivot to long form by outcome category, and build the final ggplot by hand. Note this in the NES tutorial's Temperance section; the same caveat applies to any future tutorial using a multinomial fit. The ordinal case (`MASS::polr`) does not have this problem — `marginaleffects` handles `polr` natively.

**Exercise 6.** [per-tutorial, written-without-answer] Final `plot_predictions()` call.
- Prompt: the version whose output will be the basis for the final plot. CP/CR.
- End: comments on the key takeaways relative to the question.

**Exercise 7.** [per-tutorial, written-without-answer] `plot_predictions(..., draw = FALSE)`.
- Prompt: run the same call as above with `draw = FALSE`. CP/CR.
- End: *Because `plot_predictions()` returns a ggplot object, you can continue with ggplot commands like `labs()`. But it can be useful to see the underlying values in the tibble and build your own plot directly.*

**Exercise 8.** [per-tutorial, written-without-answer] Build a beautiful plot.
- Prompt: *Work with AI to create a beautiful plot starting from the output of `plot_predictions(..., draw = FALSE)`. Do this in your QMD (much easier than the R prompt). Title: key variables. Subtitle: important takeaway. Caption: data source. Axis labels: nice. This plot is not directly connected to your question — it answers lots of questions. Paste the plot code below.*
- End: show our plot and our code. Closing knowledge drop: the back-and-forth knowledge drop (§12.5).

**Exercise 9.** [operational] Finalize the plot chunk.
- Prompt: *Finalize the new graphics chunk in your QMD. `Cmd/Ctrl + Shift + K` to ensure it all works. At the R prompt, `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: the map-is-not-the-territory knowledge drop (§12.5).

**Exercise 10.** [per-tutorial, written-with-answer] Last sentence of the summary paragraph.
- Prompt: *Write the last sentence of your summary paragraph. It describes at least one Quantity of Interest and a measure of uncertainty. It is OK if this QoI differs from the one you began with. It is OK to discuss more than one QoI.*
- Message: per-tutorial.
- End: *Add a final sentence to your summary paragraph, but don't copy/paste our answer exactly. `Cmd/Ctrl + Shift + K`.*

**Exercise 11.** [per-tutorial, written-with-answer] Why the estimate might be wrong.
- Prompt: *Write a few sentences explaining why the estimates for the quantities of interest, and the uncertainty, might be wrong. Suggest alternative estimates and confidence interval if warranted.*
- Message: per-tutorial. *You might or might not suggest an alternate point estimate; I always adjust toward my subjective sense of a long-run average or zero. But you should always widen the confidence interval, since the assumptions of your model are always false.*
- End: the go-back-to-the-Preceptor-Table knowledge drop (§12.5).

**Exercise 12.** [operational] Reorder and render final QMD.
- Prompt: *Rearrange the material in your QMD so the order is graphic, then paragraph. The chunk that creates the fitted model must occur before the chunk that creates the graphic. You can keep or discard the math at your discretion. `Cmd/Ctrl + Shift + K`. At the R prompt, `tutorial.helpers::show_file("XX.qmd")`. CP/CR.*
- End: the published-version knowledge drop (§12.5).

**Exercise 13.** [operational] Publish to GitHub Pages.
- Prompt: *Publish your rendered QMD to GitHub Pages. In the Terminal (not the R prompt!), run `quarto publish gh-pages XX.qmd`. Copy/paste the resulting URL below.*
- End: *Commit/push everything.*

**Exercise 14.** [operational] Paste the repo URL.
- Prompt: *Copy/paste the URL to your GitHub repo.*
- End: the Preceptor-Table-and-God knowledge drop (§12.5), followed by *The world confronts us. Make decisions we must.*

### 13.6 Summary

Not an exercise sequence — a brief closing prose section. Give the final plot and the summary paragraph. Add concerns separately. Note how the findings might help the "Imagine" person from the Introduction, and mention other numbers that would be useful. End with: *The world is always more uncertain than our models would have us believe.*

Then the `download_answers.Rmd` child document:

```r
```{r download-answers, child = system.file("child_documents/download_answers.Rmd", package = "tutorial.helpers")}
```
```

### 13.7 LaTeX model-form reference

The LaTeX blocks to paste into Justice Exercise 15 (and to show students the mathematical structure of the model). Pick the form matching the outcome type.

**Rendering caveat.** `\mathcal{N}` renders correctly in Quarto (where these blocks go — into the student's QMD) but renders as an empty box in learnr's MathJax. When showing the error term inside a tutorial (Justice preamble, Temperance preamble), use plain `N(0, \sigma^2)` instead. The blocks below are the Quarto form.

**Normal (continuous outcome — linear regression).**

$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_n X_n + \epsilon$$

with $\epsilon \sim \mathcal{N}(0, \sigma^2)$.

Source:

````
$$Y = \beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_n X_n + \epsilon$$

with $\epsilon \sim \mathcal{N}(0, \sigma^2)$.
````

Linear regression for continuous data. The $\beta$ coefficients represent the effect of predictors on the mean of the outcome.

**Bernoulli (binary outcome — logistic regression).**

$$P(Y = 1) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_n X_n)}}$$

with $Y \sim \text{Bernoulli}(\rho)$, where $\rho$ is the probability above.

Source:

````
$$P(Y = 1) = \frac{1}{1 + e^{-(\beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_n X_n)}}$$

with $Y \sim \text{Bernoulli}(\rho)$, where $\rho$ is the probability above.
````

Logistic regression for binary data. The $\beta$ coefficients represent the effect of predictors on the log-odds of the outcome.

**Multinomial (unordered categorical outcome — multinomial logistic regression).**

$$P(Y = k) = \frac{e^{\beta_{k0} + \beta_{k1} X_1 + \beta_{k2} X_2 + \cdots + \beta_{kn} X_n}}{\sum_{j=1}^{K} e^{\beta_{j0} + \beta_{j1} X_1 + \beta_{j2} X_2 + \cdots + \beta_{jn} X_n}}$$

with $Y \sim \text{Multinomial}(\boldsymbol{\rho})$ where $\boldsymbol{\rho} = (\rho_1, \rho_2, \ldots, \rho_K)$ are the probabilities above.

Source:

````
$$P(Y = k) = \frac{e^{\beta_{k0} + \beta_{k1} X_1 + \beta_{k2} X_2 + \cdots + \beta_{kn} X_n}}{\sum_{j=1}^{K} e^{\beta_{j0} + \beta_{j1} X_1 + \beta_{j2} X_2 + \cdots + \beta_{jn} X_n}}$$

with $Y \sim \text{Multinomial}(\boldsymbol{\rho})$ where $\boldsymbol{\rho} = (\rho_1, \rho_2, \ldots, \rho_K)$ are the probabilities above.
````

Each category $k$ has its own set of parameters $\beta_{k0}, \beta_{k1}, \ldots, \beta_{kn}$.

**Cumulative / ordinal (ordered categorical outcome — proportional-odds model).**

$$P(Y \leq k) = \frac{1}{1 + e^{-(\alpha_k - \beta_1 X_1 - \beta_2 X_2 - \cdots - \beta_n X_n)}}$$

with $Y \sim \text{Ordinal}(\boldsymbol{\rho})$ where $\boldsymbol{\rho} = (\rho_1, \rho_2, \ldots, \rho_K)$ are derived from the cumulative probabilities above.

Source:

````
$$P(Y \leq k) = \frac{1}{1 + e^{-(\alpha_k - \beta_1 X_1 - \beta_2 X_2 - \cdots - \beta_n X_n)}}$$

with $Y \sim \text{Ordinal}(\boldsymbol{\rho})$ where $\boldsymbol{\rho} = (\rho_1, \rho_2, \ldots, \rho_K)$ are derived from the cumulative probabilities above.
````

Proportional-odds model for ordinal data. $\alpha_k$ are the threshold parameters (cutpoints); the $\beta$ coefficients represent the effect of predictors on the log-odds of being in category $k$ or below.

---

## 14. Guidance for tutorial authors

General rules and patterns pulled from the template that apply across exercises, rather than to any one exercise.

### 14.1 Answers that students read closely

Students read our `message` text as closely as they read anything in the tutorial. They compare their own answer to ours. Make our answer excellent. This is especially true for Justice answers about validity, stability, representativeness, and unconfoundedness — students look here for examples of how to reason about assumptions.

Where a knowledge drop has two components — a universal truth and a problem-specific example — separate them when practical. The universal truth belongs in §12. The problem-specific piece is written per-tutorial.

### 14.2 Build objects through questions, not by assignment

Never have students do the final assignment themselves. Build objects through a series of exercises — often a pipe built line by line — each producing output the student can examine. When the creation is complete, have a final exercise that says, in effect: "Behind the scenes we have assigned the result to the object `fit_<n>`. To confirm, type `fit_<n>` and hit Run Code."

With AI-mediated authoring (§9), the line-by-line pipe pattern is less necessary than it was. But for key objects you want the student to understand in parts, still prefer build-up over final-assignment.

### 14.3 Show the plot, don't show the code

*(Folded into §14.12 *Visualization house style*; preserved as a number-only stub so internal `§14.x` cross-references elsewhere in this file keep their indices.)*

### 14.4 Iterative summary paragraph

The summary paragraph is built up across the tutorial:

- Wisdom Exercise 11: first two sentences (topic; data + question).
- Justice Exercise 16: add a weakness sentence.
- Courage Exercise 16: add a model-structure sentence.
- Temperance Exercise 13: add the final sentence with a QoI and uncertainty.

After each addition, the student updates their QMD, renders with `Cmd/Ctrl + Shift + K`, and commits/pushes.

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

Operational exercises can be abbreviated in later tutorials once students have done them a few times. The first time through, migrate as-is. By tutorial 10+, the `library(broom)` exercise (Justice 14) can be much shorter.

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

In prose (not in code), R package names use **bold + link to the package's home page**: **[primer.data](https://github.com/PPBDS/primer.data)**, **[tidymodels](https://www.tidymodels.org/)**, **[broom](https://broom.tidymodels.org/)**, **[marginaleffects](https://marginaleffects.com/)**. Do not surround package names with backticks unless they appear inside actual code — backticks are for code identifiers (object names like `nhanes`, function names like `tidy()`), not for package names in running text.

Prefer the package's own documentation site or GitHub page over CRAN. CRAN URLs are fallbacks when no dedicated homepage exists.

Canonical homepages the tutorials reference most often:

| Package | Homepage |
|---|---|
| primer.data | `https://github.com/PPBDS/primer.data` |
| tutorial.helpers | `https://ppbds.github.io/tutorial.helpers/` |
| tidyverse | `https://www.tidyverse.org/` |
| tidymodels | `https://www.tidymodels.org/` |
| broom | `https://broom.tidymodels.org/` |
| marginaleffects | `https://marginaleffects.com/` |
| easystats | `https://easystats.github.io/easystats/` |
| learnr | `https://rstudio.github.io/learnr/` |
| knitr | `https://yihui.org/knitr/` |

Exceptions: inside `library(packagename)` code, ggplot `caption = "Source: … via primer.data"` strings, and other literal-code contexts, the package name is plain (no bold, no link, no backticks beyond what the code syntax itself implies) because markdown does not render inside those contexts.

### 14.11 Conciseness in knowledge drops

Every sentence a student reads in a knowledge drop should earn its place. Verbosity is the enemy. Common traps to avoid:

- **Self-negating clauses** — *"X is the habit we want to build, not the habit you have to justify."* The "not the habit..." tail adds no information. Cut it; keep the positive statement.
- **Meta-narration about the tutorials** — *"You will see this shorthand throughout the tutorials."* Students figure it out; don't narrate the experience. Cut.
- **Hedging filler** — *"It might be worth noting that..."*, *"As we mentioned before..."*, *"It is important to recognize that..."*. None of these add content; each just delays the point.
- **Restating what just happened** — *"Now that you have loaded the library, let's proceed to the next step."* The exercise flow makes this obvious; don't spell it out.

The test: can you delete the sentence and lose information? If no, delete it. Knowledge drops are short on purpose — §6.4 says "Students won't read more than two sentences at a time." Every sentence is precious real estate.

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

---

## 15. R tooling

The tutorial setup chunk (§5.2) loads the full package stack. For chapters, setup is simpler: load the packages, fit the model, move on.

**Packages loaded for rendering only** (not expected at the student's R prompt): `learnr`, `tutorial.helpers`, `gt`.

**Packages students are expected to load themselves** (and appear in the setup chunk for the tutorial to work):
- `tidyverse` — always.
- `tidymodels` — for most models. Replace with `ordinal` or another package if that model framework doesn't fit.
- `broom` — for tidying model output. `broom.mixed` for mixed models.
- `marginaleffects` — for `predictions()`, `plot_predictions()`, `plot_comparisons()`.
- `easystats` — for `check_predictions()`. Not added to student QMDs; used interactively at the R prompt.

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

**Keyboard shortcut reference** — `Cmd/Ctrl + Shift + K` renders a QMD; `Cmd/Ctrl + Enter` sends the current line to the R prompt. These are the only two shortcut bindings tutorials can assume students know; both are standard across Positron, RStudio, and VS Code with the R extension.

---

## 16. Open items

Things flagged but not yet resolved. Revisit when relevant.

- **Preambles for the non-Temperance virtue sections.** §5.5 defines the "preamble" as the content between a virtue section header and its first exercise. §13.5 fully specifies the Temperance preamble (transition + `marginaleffects` book link + four ways to describe the model + Easy-only abstract mathematical structure). The preambles for Introduction, Wisdom, Justice, Courage, and Summary are not yet specified — decide what each should always contain and add the specification to the corresponding §13.x subsection.

- **Simulation as a tutorial topic.** §4 and §12.6 Theme 5 commit chapters to a paragraphs-long treatment of simulation from the DGM (drawing synthetic units to answer questions like "what's the tallest recruit in the next batch of three?"). Whether any of this belongs in the tutorials themselves — perhaps a Hard-tier exercise that runs a small simulation — is undecided. The pro: simulation is the general mechanism by which the DGM answers arbitrary questions, and students who never do it may never grasp that the DGM is more than a formula for expected values. The con: each Hard tutorial is already packed, and teaching simulation properly would require introducing `tidyr::expand_grid()` / `purrr::map()` patterns or base-R `replicate()`, adding operational surface area. Revisit when the Hard tutorials are drafted; the default is "chapters only," but a one-exercise simulation inside 17-Kenya (the curriculum capstone) is defensible.

- **Curriculum learning goals — explicit specification.** Write down, in CLAUDE.md, what students should understand after completing all 14 tutorials. We need these goals explicit because the Easy / Medium / Difficult progressions (§1.3) are supposed to *build toward* them, and we cannot calibrate the progressions without knowing the targets. Candidate home: a new §1.4 or its own top-level section. Aim for 10–20 concrete things a student should be able to do, explain, or notice by the end of Tutorial 14. Current worked examples in §1.3 (representativeness, validity, stability, unconfoundedness, model checking) implicitly define a handful of these goals — enumerate them all.

- **Justice exercises for sampling and selection mechanism.** Key Concepts now defines assignment, sampling, and selection mechanism as canonical concepts (with the Heckman-terminology-collision note), and §12.3 has disambiguation knowledge drops. Still pending: adding explicit Justice exercises to the §13.3 master exercise list that ask students to name the sampling mechanism and the selection mechanism for the problem at hand, alongside the existing representativeness/stability/validity/unconfoundedness exercises.
- **The DGM randomness detail** — we defer discussion of the randomness in the DGM in Courage Exercise 11's knowledge drop. Decide in which tutorial this gets unwrapped.
- **AI tool article absorption** — `https://ppbds.github.io/tutorial.helpers/articles/ai.html` may have more AI-workflow specifics than §9 currently captures. Worth re-reading and absorbing the next time we touch §9.

---

## 17. Per-tutorial problem specifications

Key parameters for each tutorial in the `primer.tutorials` package. Use these entries to orient new authoring sessions: the dataset, the primary question, the model to fit, and the Preceptor Table and Population Table column structure. Tutorials marked **miscellaneous** have no full data-science exercise (no Preceptor Table, no model fit). All others are **example** tutorials.

**The §17 seed names a *final model* per tutorial; Courage's §13.4 three-fit interpretation block is generated from that.** Each entry below specifies the final model the tutorial fits, but the Courage section actually fits two or three candidate models (Fit A → Fit B → Fit C) so students can practice parameter interpretation across covariate types. The candidate fits are chosen by the author at draft time from the dataset's available covariates and need not be listed in the §17 entry. See §13.4 *The Courage parameter-interpretation block* for the design pattern, and the `06-recruits` / `07-trains` / `08-colleges` tutorials for worked examples.

**Target roster: 12 example tutorials (positions 1–12) + 5 miscellaneous = 17 total.** Example tutorials are numbered 06–17 and arranged per §1.5:

- P/C alternating (P, C, P, C, …) starting at position 1.
- Positions 1–4 Easy, 5–8 Medium, 9–12 Hard.
- Positions 11 and 12 are the non-parametric (random forest or equivalent) tutorials.

Preceptor Table and Population Table columns are listed by spanner in order. Population Tables always have a leading `Source` column (not under any spanner) and a `Unit/Time` spanner with two columns. Preceptor Tables have no Time column — time is implicit. Causal models have a `Treatment` spanner separate from `Covariate(s)`. Potential outcome columns are named "Outcome if [treatment value]".

**Expensive-fit flag.** Tutorials whose final model is too slow to fit in the setup chunk (more than ~3 seconds even on a slice-sampled subset) include an `**Expensive fit:** Yes — <reason>` field. Those tutorials load the fit from a pre-generated `.rds` in `data/`, regenerated by `data-raw/prefit.R`. See §5.6 for the pattern and load-snippet. Tutorials without this flag must not include an `.rds` cache of the fit — the fit happens live in setup.

**Directory numbering.** Physical directory names on disk match the target numbering. Nine example tutorials currently exist (06, 07, 08, 10, 11, 12, 14, 15, 16) with **three gap slots (09, 13, 17) where the dataset and framing are chosen but the exercise content has yet to be authored**. Target tutorial 09 is **SPS** (Seguro Popular, binary treatment), 13 is **Mail** (Philadelphia mail-in voting, 3-arm), 17 is **Kenya** (voter registration, 6-arm multi-arm causal forest — curriculum capstone). Per §1.5, positions 11 and 12 (target tutorials 16 and 17) are the non-parametric tutorials; target tutorial 16 at `16-stops` is slated for a random-forest **recast** of the old predictive-linear stops tutorial.

---

**Miscellaneous tutorials (01–05) are frozen inheritance.** They predate this CLAUDE.md rewrite and are not specified here beyond the `Type: miscellaneous` tag. Do not rewrite them to match the §13 master exercise list; their existing content stands. They do not follow the example-tutorial structure (Wisdom / Justice / Courage / Temperance with per-virtue preambles), the EMH progression rules, or the §17 seed-entry pattern. When the rest of the curriculum changes (terminology shifts, renumbering, etc.), touch them only as needed for consistency — not to restructure.

### 01 — Probability

- **Type:** miscellaneous

---

### 02 — Sampling

- **Type:** miscellaneous

---

### 03 — Rubin Causal Model

- **Type:** miscellaneous

---

### 04 — Mechanics

- **Type:** miscellaneous

---

### 05 — Cardinal Virtues

- **Type:** miscellaneous

---

### 06 — Recruits  *(Position 1, Easy predictive)*

- **Type:** example
- **"Imagine":** You are in charge of ordering uniforms for next year's Marine Corps bootcamp recruits.
- **Dataset:** `recruits` (`primer.tutorials`) — a 50-row teaching cut of NHANES, 40 male and 10 female young adults aged 18–27, columns `height`, `sex`, `age`. Built by `data-raw/recruits.R`; documented in `R/recruits.R`. The 40/10 split is deliberate so the two group means have visibly different standard errors — a feature the Temperance section asks students to notice and explain.
- **Outcome:** `height` (continuous, cm)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What is the average height of male and female USMC recruits?
- **Model:** Linear regression, one categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `recruits`
- **Data prep:** none in the tutorial — the `recruits` tibble is already filtered and sliced. Setup chunk uses `recruits` directly (no intermediate `x`).
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(height ~ sex, data = recruits)` → `fit_height`
- **Preceptor Table:** Unit (Young Adult) | Outcome (Height cm) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Young Adult, Year) | Outcome (Height cm) | Covariate (Sex)

---

### 07 — Trains  *(Position 2, Easy causal)*

- **Type:** example
- **"Imagine":** You are a campaign manager for a Republican congressional candidate in Georgia who wants to increase anti-immigration sentiment among voters.
- **Dataset:** `trains` (Enos 2014), Boston commuters, 2012 (`primer.data`)
- **Outcome:** `att_end` — immigration attitude after experiment (integer, 3–15)
- **Treatment / Key covariate:** `treatment` — exposure to Spanish-speakers on train platform (randomized)
- **Question (QoI):** What is the average causal effect of exposure to Spanish-speakers on attitudes toward immigration?
- **Model:** Linear regression, randomized experiment
- **Causal / Predictive:** Causal
- **Student project:** `trains`
- **Data prep:** none — uses `trains` directly
- **Final model:** `linear_reg(engine = "lm") |> fit(att_end ~ treatment, data = trains)` → `fit_att`
- **Preceptor Table:** Unit (Person) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)
- **Population Table:** Source | Unit/Time (Person, Year) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)

---

### 08 — Colleges  *(Position 3, Easy predictive)*

- **Type:** example
- **"Imagine":** You are a data scientist at a non-profit helping students find the best college.
- **Dataset:** `colleges` (`primer.data`), ~900 U.S. colleges/universities (DOE IPEDS 2013)
- **Outcome:** `grad_rate` — graduation rate (continuous, 0–1)
- **Treatment / Key covariate:** `tuition` (continuous)
- **Question (QoI):** What effect does the tuition of a college have on its graduation rate?
- **Model:** Linear regression with ordinal categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `colleges`
- **Data prep:** `colleges |> select(tuition, grad_rate, selectivity) |> filter(tuition > 2)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(grad_rate ~ tuition + selectivity, data = x)` → `fit_colleges`
- **Preceptor Table:** Unit (College) | Outcome (Graduation Rate) | Covariate (Tuition)
- **Population Table:** Source | Unit/Time (College, Year) | Outcome (Graduation Rate) | Covariate (Tuition)

---

### 09 — SPS  *(Position 4, Easy causal)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **"Imagine":** You are a health-policy analyst at Mexico's Ministry of Health deciding whether to continue funding Seguro Popular, the universal health-insurance program. Households care about whether enrollment actually lowers out-of-pocket medical spending.
- **Dataset:** `sps` (King et al. 2009 Seguro Popular randomized rollout, Mexico 2005–06)
- **Outcome:** `t2_health_exp_3m` — total health-related household expenditure in the 3 months before the follow-up survey (pesos; continuous)
- **Treatment:** `treatment` — binary; 1 = household in a cluster randomly assigned to Seguro Popular rollout, 0 = control cluster
- **Question (QoI):** What is the causal effect of Seguro Popular enrollment on household out-of-pocket health expenditures?
- **Model:** Linear regression, binary treatment (optionally one covariate for adjustment)
- **Causal / Predictive:** Causal
- **Student project:** `sps`
- **Data prep:** `sps |> select(treatment, t2_health_exp_3m, age, sex, education) |> drop_na() |> slice_sample(n = 100)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(t2_health_exp_3m ~ treatment, data = x)` → `fit_sps`  *(add `age` or `sex` as a second covariate if the author wants to trigger the adjustment-clause practice at the two-or-more-covariates threshold)*
- **Preceptor Table:** Unit (Household) | Potential Outcomes (Expenditure if Enrolled, Expenditure if Not Enrolled) | Treatment (Enrollment)
- **Population Table:** Source | Unit/Time (Household, Year) | Potential Outcomes (Expenditure if Enrolled, Expenditure if Not Enrolled) | Treatment (Enrollment)
- **Authoring notes:**
  - Outcome scale is heavy-tailed (raw pesos). Plot the distribution in Wisdom EDA and note the skew. If misbehavior is severe, switch outcome to `t2_health_exp_1m`, log-transform, or trim outliers — record the decision in the Wisdom preamble's dataset note.
  - Assignment was cluster-randomized, not individual-randomized. Justice should name this under unconfoundedness (treatment assignment is independent of potential outcomes *at the cluster level*) without teaching clustered standard errors (too advanced for Easy).
  - Pairs thematically with **07-trains** (position 2) as the two simple RCTs in the Easy tier: different domain (health vs. immigration attitudes), same model class (linear with binary treatment), same Easy-tier apparatus.

---

### 10 — Smokes  *(Position 5, Medium predictive)*

- **Type:** example
- **Status:** **Replaced.** Earlier drafts at this slot used a constructed Biden 2024 YouGov tibble (intercept-only logistic) and then a 2024 NES Democratic-vote design. Both have a political framing the curriculum has plenty of elsewhere (positions 6, 7, 8, 9, 11, 12). The current design swaps in a non-political binary outcome — whether an adult has ever smoked — using a curated NHANES cut packaged in `primer.tutorials::smokes`. Same dataset family students saw at position 1 (06 Recruits drew its `recruits` cut from NHANES too), so the data is familiar; the model and outcome are new.
- **"Imagine":** You are a public-health analyst at a state health department designing the next anti-smoking campaign. To target outreach, you want to know which adults are most likely to be smokers, broken out by basic demographics like age and sex. There are many decisions to make.
- **Dataset:** `smokes` (`primer.tutorials`) — a 1,000-row teaching cut of the NHANES 2009--2012 educational subset bundled in the **NHANES** CRAN package. Restricted to adults aged 20--80 with non-missing values on smoking status, age, and sex. Built by `data-raw/smokes.R`; documented in `R/smokes.R`.
- **Outcome:** `smoke` — factor with levels `"No"` and `"Yes"`; "Yes" means the respondent has ever smoked at least 100 cigarettes (the standard public-health "ever-smoker" definition). Stored as a factor for `logistic_reg(engine = "glm")` (factor-outcome gotcha, §13.4).
- **Treatment / Key covariate:** `sex` (binary: Female / Male) is the covariate with the clean signal. `age` (continuous, 20--80) has a borderline coefficient whose CI just barely crosses zero — pedagogically useful as the "this covariate doesn't help much" Fit B.
- **Question (QoI):** What is the difference in the probability of having ever smoked between a 30-year-old woman and a 70-year-old man? *(One specific number per §13.1; uses both covariates.)*
- **Model:** Logistic regression on the link scale; interpretation lives downstream in `marginaleffects` (probability scale). Per §13.5 *Interpretability ceiling*, link-scale coefficients are noted in a knowledge drop but not the focus of student interpretation.
- **Causal / Predictive:** Predictive. Comparison language only — *"the probability that a [Male] is a smoker is X percentage points higher than the probability that a [Female] is a smoker, adjusting for age."* No causal framing — the model says nothing about *what causes* smoking.
- **Student project:** `smokes`
- **Data prep:** none in the tutorial — the `smokes` tibble is already filtered, sampled, and factor-coded. Setup chunk loads `library(primer.tutorials)` and uses `smokes` directly (no intermediate `x`).
- **Final model:** `logistic_reg(engine = "glm") |> fit(smoke ~ age + sex, data = smokes)` → `fit_smokes`
- **Courage three-fit block** (per §13.4):
  - Fit A: `smoke ~ sex` (binary, clean signal)
  - Fit B: `smoke ~ age` (continuous, borderline — the "covariate barely helps" lesson)
  - Fit C (final): `smoke ~ age + sex` (combined, with link-scale interpretation cautions)
- **Preceptor Table:** Unit (Adult) | Outcome (Ever Smoked) | Covariates (Age, Sex)
- **Population Table:** Source | Unit/Time (Adult, Year) | Outcome (Ever Smoked) | Covariates (Age, Sex)
- **Authoring notes:**
  - **Approximate fit values** (from the 1,000-row analysis sample, set.seed(2026)):
    - Fit A `smoke ~ sex`: intercept (Female) ≈ -0.54, sexMale ≈ +0.54 (CI [0.29, 0.80]).
    - Fit B `smoke ~ age`: intercept ≈ -0.60, age ≈ +0.007 (CI [-0.001, +0.014] — borderline).
    - Fit C `smoke ~ age + sex`: intercept ≈ -0.88, age ≈ +0.007 (CI [-0.001, +0.015]), sexMale ≈ +0.55 (CI [0.29, 0.80]).
    - Predicted probability of being an ever-smoker: 30y Female ≈ 0.34, 70y Female ≈ 0.41, 30y Male ≈ 0.47, 70y Male ≈ 0.54. The QoI (70y Male − 30y Female) ≈ 0.54 − 0.34 ≈ 0.20, about 20 percentage points.
  - **Link-scale cautions are mandatory at Medium.** Fit C's interpretation question must *not* ask the student to translate the log-odds coefficient on `sex` into outcome-scale terms. The author notes the link-scale form ("a coefficient of +0.55 on `sexMale` means the log-odds of being an ever-smoker are 0.55 higher for men than women") in a knowledge drop, then hands off to Temperance's `predictions()` for probability-scale answers. This is the curriculum's first link-function tutorial; build the handoff carefully.
  - **Why age stays in the final model despite a borderline coefficient.** Pedagogically, Fit B teaches "this covariate barely moves the needle on its own"; Fit C *keeps* age anyway so that interpretation of `sexMale` in Fit C requires the adjustment clause ("adjusting for age") that Easy tutorials introduced and Medium tutorials must keep mandatory.
  - **"Specific question" verification.** The QoI subtracts two probabilities (70y Male P=0.54, 30y Female P=0.34). The answer is one specific number (0.20, or 20 percentage points). The §13.1 specific-number rule is satisfied.
  - **Real-names + overlap rule (§10.2).** The Preceptor Table and Population Table use real-sounding adult identifiers (e.g. NHANES participant IDs paired with last names plausible for the survey population). At least one identifier appears in both the Data block (with one observed `smoke` value) and the Preceptor block (with both potential outcomes — though for a *predictive* tutorial there is just one outcome column, no hatching).
  - **Reframing student-progress note.** Position 5's directory was `10-biden` in earlier drafts and is being renamed to `10-smokes`. Existing student progress records keyed on the old `10-biden` ID will not carry forward. Document the rename in `NEWS.md` and bump the package version.

---

### 11 — Shaming  *(Position 6, Medium causal)*

- **Type:** example
- **"Imagine":** You are running for Governor of Texas and must decide how to allocate campaign resources.
- **Dataset:** `shaming` (Gerber, Green, Larimer 2008) (`primer.data`)
- **Outcome:** `primary_06` — voted in 2006 primary (binary)
- **Treatment / Key covariate:** `treatment` — social-pressure mailing type (randomized)
- **Question (QoI):** What is the causal effect of social-pressure postcards on voter turnout?
- **Model:** Logistic regression with interaction (`treatment * voter_class`)
- **Causal / Predictive:** Causal
- **Student project:** `shaming`
- **Data prep:** `shaming |> mutate(civ_engage = primary_00 + primary_02 + primary_04 + general_00 + general_02 + general_04) |> select(primary_06, treatment, sex, age, civ_engage) |> mutate(voter_class = factor(case_when(civ_engage %in% c(5, 6) ~ "Always Vote", civ_engage %in% c(3, 4) ~ "Sometimes Vote", civ_engage %in% c(1, 2) ~ "Rarely Vote"), levels = c("Rarely Vote", "Sometimes Vote", "Always Vote"))) |> mutate(voted = as.factor(primary_06))` → `x`
- **Final model:** `logistic_reg(engine = "glm") |> fit(voted ~ age + sex + treatment*voter_class, data = x)` → `fit_shaming`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Voted if No Postcard, Voted if Civic Duty, Voted if Hawthorne, Voted if Self, Voted if Neighbors) | Treatment (Mailing Type) | Covariate (Voter Class)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (five columns, one per treatment arm) | Treatment (Mailing Type) | Covariates (Voter Class, Age, Sex)
- **Authoring notes:**
  - **Five potential-outcome columns.** Faithful to Gerber-Green-Larimer 2008's five-arm design (No Postcard / Civic Duty / Hawthorne / Self / Neighbors). The Preceptor Table is wide; the §10 inline-block-div pattern handles it. Each row has one observed potential outcome and four hatched (unobservable) ones.
  - **Full-data fit (~344K rows) takes ~1 second.** Below the §5.6 prefit threshold; fit lives in setup chunk. CIs are tight — Neighbors gives +8.1 pp turnout (CI 7.6 to 8.6), Self +4.8 pp, Hawthorne +2.5 pp, Civic Duty +1.8 pp.
  - **Interaction with `voter_class`.** Heterogeneous treatment effects are the substantive payoff: Neighbors gives +9.0 pp among Always Vote and +8.6 pp among Sometimes Vote, but only +4.4 pp among Rarely Vote. The Temperance section uses `plot_predictions(condition = c("treatment", "voter_class"))` to make this visible.
  - **Pairs thematically with Mail (position 8)** as the two multi-arm GOTV experiments at Medium causal. Same dataset family (postcards before an election), different treatment compositions.

---

### 12 — NES  *(Position 7, Medium predictive)*

- **Type:** example
- **"Imagine":** You are a political scientist studying the 1992 presidential election, curious whether men and women differed in their support for Clinton, Bush, and Perot. There are many decisions to make.
- **Dataset:** NES (`primer.data`), 1992 presidential election
- **Outcome:** `pres_vote` — vote choice (Clinton / Bush / Perot)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What was the difference in voting preference of men and women in the 1992 US Presidential election?
- **Model:** Multinomial logistic regression
- **Causal / Predictive:** Predictive
- **Student project:** `nes`
- **Data prep:** `nes |> filter(year == 1992) |> select(sex, pres_vote) |> drop_na() |> mutate(pres_vote = as.factor(case_when(pres_vote == "Democrat" ~ "Clinton", pres_vote == "Republican" ~ "Bush", pres_vote == "Third Party" ~ "Perot")))` → `nes_92`
- **Final model:** `multinom_reg(engine = "nnet") |> fit(pres_vote ~ sex, data = nes_92)` → `fit_nes`
- **Preceptor Table:** Unit (Voter) | Outcome (Vote) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Outcome (Vote) | Covariate (Sex)

---

### 13 — Mail  *(Position 8, Medium causal)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **"Imagine":** You are on the Philadelphia City Commissioners' office ahead of the next general election. You have a fixed postcard-printing budget and want to know which nudge message — "safer for you" or "safer for your neighborhood" — actually moves people to apply for a mail ballot.
- **Dataset:** `mail` (2020 Philadelphia mail-in voting field experiment; Morris et al.)
- **Outcome:** `applied_mail` — binary; whether the voter applied for a mail ballot before the 26-May deadline
- **Treatment:** `treatment` — three-arm factor: `No Postcard`, `Self`, `Neighborhood`
- **Question (QoI):** What is the causal effect of each postcard wording on the probability a registered voter applies for a mail ballot?
- **Model:** Logistic regression with multi-arm treatment; interpretation via `marginaleffects::avg_comparisons()` back to the probability scale (Medium-tier adds `comparisons()` per §13.5)
- **Causal / Predictive:** Causal
- **Student project:** `mail`
- **Data prep:** `mail |> select(treatment, applied_mail, party, age, sex) |> drop_na() |> mutate(applied_mail = as.factor(applied_mail)) |> slice_sample(n = 5000)` → `x` *(stratify on `treatment` to preserve arm balance; control arm ~888K vs ~23K per treatment arm means a naive slice will under-represent treatment)*
- **Final model:** `logistic_reg(engine = "glm") |> fit(applied_mail ~ treatment + party + age + sex, data = x)` → `fit_mail`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Applied if No Postcard, Applied if Self, Applied if Neighborhood) | Treatment (Postcard) | Covariates (Party, Age, Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (three columns, one per treatment arm) | Treatment (Postcard) | Covariates (Party, Age, Sex)
- **Authoring notes:**
  - **Stratified sampling.** Down-sampling from 936K to ~5K must preserve treatment-arm balance. Use `slice_sample(n = ...)` within `group_by(treatment)` or similar — flag in Wisdom's data-prep exercise so the student sees the reason.
  - **Three potential outcomes per row.** The Preceptor Table stretches to three columns under the `Potential Outcomes` spanner. This is the first tutorial in the curriculum where the Rubin-Causal-Model apparatus scales past two potential outcomes, and the Justice section's per-row causal-effect footnote (Easy-only, so absent here by §10 Medium/Hard rules) is already retired at Medium anyway — no conflict.
  - **Link-scale interpretation.** Per §13.5 *Interpretability ceiling*, do not ask students to interpret logistic coefficients on the log-odds scale. Author notes the log-odds form in a knowledge drop; student interpretation exercises target `avg_comparisons()` output on the probability scale.
  - **Pairing with Shaming (position 6).** Both tutorials use multi-arm postcard / mailing treatments in GOTV experiments. The Wisdom section should make the contrast explicit — shaming's postcards apply social pressure, mail's postcards are informational. Same structural apparatus, different behavioral mechanism.

---

### 14 — CES  *(Position 9, Hard predictive)*

- **Type:** example
- **"Imagine":** You are a pollster preparing for an upcoming election, exploring 2020 Trump approval patterns across ideology and education levels.
- **Dataset:** `ces` (Cooperative Election Study) (`primer.data`), 2020
- **Outcome:** `approval` — presidential approval (ordinal, 5 categories)
- **Treatment / Key covariate:** `ideology` (Very Liberal … Very Conservative)
- **Question (QoI):** What is the average difference in Trump approval between Very Liberal and Very Conservative voters?
- **Model:** Ordinal logistic regression (`MASS::polr`)
- **Causal / Predictive:** Predictive
- **Student project:** `ces`
- **Data prep:** `ces |> filter(year == 2020) |> select(approval, ideology, education) |> drop_na() |> filter(!ideology %in% "Not Sure") |> mutate(ideology = fct_drop(ideology))` → `x`
- **Final model:** `polr(approval ~ ideology + education, data = x)` → `fit_approval`
- **Preceptor Table:** Unit (Respondent) | Outcome (Presidential Approval) | Covariate (Political Ideology)
- **Population Table:** Source | Unit/Time (Respondent, Year) | Outcome (Presidential Approval) | Covariate (Political Ideology)

---

### 15 — Governors  *(Position 10, Hard causal — recast from predictive)*

- **Type:** example
- **Status:** **Recast required.** The existing tutorial frames this as a predictive question — *"how long do gubernatorial candidates live after their election?"*. Under the new §1.5 alternation, position 10 is causal, and the Barfort et al. 2020 paper is a close-election RDD study whose natural framing *is* causal. Rewrite the tutorial around the causal question.
- **"Imagine":** You are considering a run for governor and want to know whether winning changes how long you are likely to live.
- **Dataset:** `governors` (Barfort et al. 2020) (`primer.data`)
- **Outcome:** `lived_after` — years lived after election (continuous)
- **Treatment / Key covariate:** election outcome (won/lost), identified by close-margin quasi-randomization
- **Question (QoI):** What is the causal effect of winning a gubernatorial election on lifespan?
- **Model:** Linear regression restricted to close-margin elections; treatment = win/lose. Interaction with `election_age` and `sex` optional.
- **Causal / Predictive:** Causal
- **Student project:** `governors`
- **Data prep (revised):** `governors |> filter(year > 1945) |> filter(margin < 5) |> select(last_name, year, state, sex, lived_after, election_age, region, won)` → `x`  *(pseudocode — margin column name and cutoff to be confirmed against `primer.data`)*
- **Final model (revised):** `linear_reg(engine = "lm") |> fit(lived_after ~ won + election_age + sex, data = x)` → `fit_governors`  *(treatment = `won`; interaction terms optional at Hard tier)*
- **Preceptor Table:** Unit (Candidate) | Potential Outcomes (Years Lived if Won, Years Lived if Lost) | Treatment (Election Outcome) | Covariates (Age at Election, Sex)
- **Population Table:** Source | Unit/Time (Candidate, Year) | Potential Outcomes (Years Lived if Won, Years Lived if Lost) | Treatment (Election Outcome) | Covariates (Age at Election, Sex)
- **Author note:** The RDD identification story is what makes this Hard-tier — not the model specification itself (which is still a linear regression). The Justice section should name the RDD assumption explicitly and discuss the close-margin restriction as the mechanism that makes unconfoundedness plausible. Per §1.3 *unconfoundedness worked example (Hard)*, name the design family (RDD) without teaching it in depth; that framing belongs in the Difficult tier.

---

### 16 — TODO  *(Position 11, Hard predictive — non-parametric / random forest — GAP)*

- **Type:** example *(to be authored)*
- **Status:** **Gap.** Non-parametric predictive tutorial does not exist.
- **Target:** Random forest or gradient-boosted model on a predictive question where the outcome-scale prediction matters more than parameter interpretation. Per §13.5 *Interpretability ceiling by model family*, the parameter-interpretation block is cut entirely — replace with a single exercise whose purpose is to articulate *why* the model's parameters aren't interpretable, then hand off to `marginaleffects::predictions()` / `plot_predictions()` for all question-answering.
- **Constraint:** Must be predictive and Hard (§1.5). The current `stops` tutorial (formerly `14-stops`) is a natural candidate to recast — `arrested ~ race + sex + zone + …` on the Open Policing data benefits from non-linearity and interactions a linear model can't capture well — but we should evaluate whether `stops` is the best home for the curriculum's first RF tutorial vs. a cleaner dataset.
- **Candidates to evaluate:** recast `stops` (Open Policing arrests); a Kaggle-style dataset with strong non-linearities; `colleges` refit with an RF if we've removed colleges from position 3 (we haven't — position 3 keeps `colleges` at Easy tier).

---

### 17 — Kenya  *(Position 12, Hard causal — causal forest — curriculum capstone)*

- **Type:** example *(to be authored — dataset and framing chosen; exercise content still to write)*
- **"Imagine":** You are an advisor to Kenya's electoral commission ahead of the 2027 election. Your budget can fund one — maybe two — of six possible interventions to boost voter registration: SMS, local administrators, canvassing, or combinations. The right choice almost certainly varies by community: SMS probably works best where phone density is high; a local admin may matter more in isolated, low-poverty areas. You want a *policy rule*, not a single causal effect.
- **Dataset:** `kenya` (Harris et al., "Electoral Administration in Fledgling Democracies: Experimental Evidence from Kenya")
- **Outcome:** `reg_byrv13` — registered-voter count at polling location during intervention period divided by registered voters at that polling location in 2013 (continuous rate)
- **Treatment:** `treatment` — six-arm factor: `control`, `SMS`, `local`, `canvass`, `local + SMS`, `local + canvass`
- **Question (QoI):** Which intervention produces the largest causal increase in voter registration, and how does the best intervention vary with community characteristics (poverty, distance to polling station, population density)?
- **Model:** **Causal forest** via the `grf` package (`grf::multi_arm_causal_forest()` for the six-arm case). Parameter interpretation is skipped per §13.5 *Interpretability ceiling*; all answering happens via `marginaleffects::predictions()` / `comparisons()` on the forest's conditional-average-treatment-effect estimates, or via `grf`'s native prediction API.
- **Causal / Predictive:** Causal
- **Student project:** `kenya`
- **Data prep:** `kenya |> select(treatment, reg_byrv13, poverty, distance, pop_density, mean_age) |> drop_na()` → `x` *(polling-station-level, ~1,600 rows — no downsampling needed)*
- **Final model (sketch):** `fit_kenya <- grf::multi_arm_causal_forest(X = as.matrix(x |> select(poverty, distance, pop_density, mean_age)), Y = x$reg_byrv13, W = x$treatment, num.trees = 2000)`  *(confirm exact `grf` API when authoring; the package has moved around)*
- **Expensive fit:** Yes — causal forest with 2000 trees exceeds the setup-chunk time budget. Pre-fit via `inst/tutorials/17-kenya/data-raw/prefit.R`; setup loads from `inst/tutorials/17-kenya/data/fit_kenya.rds` per §5.6. Reducing `num.trees` to 500 is a fallback if the stored object is too large for the package.
- **Preceptor Table:** Unit (Polling Station) | Potential Outcomes (six columns: Reg Rate if Control, if SMS, if Local, if Canvass, if Local+SMS, if Local+Canvass) | Treatment (Intervention) | Covariates (Poverty, Distance, Density, Mean Age)
- **Population Table:** Source | Unit/Time (Polling Station, Year) | Potential Outcomes (six columns) | Treatment | Covariates
- **Authoring notes:**
  - **Setup cost.** `grf::multi_arm_causal_forest` with `num.trees = 2000` takes longer than the "few seconds" setup budget in §5.2. Fit once in setup with `#| cache: true` in the tutorial body; if still too slow, reduce `num.trees` for the tutorial (e.g. 500) and note the tradeoff in a knowledge drop. Do not fit the forest at the R prompt interactively in an exercise — cache it.
  - **Fallback if `grf` is too heavy.** A lighter non-parametric path: fit a random-forest *predictive* model on `reg_byrv13 ~ treatment * (covariates)` with `ranger`, then use `marginaleffects` to extract arm-by-covariate conditional predictions and compute contrasts. Loses the formal causal-forest machinery but keeps the heterogeneous-effect story visible.
  - **Parameter-block handling.** Per §13.4 + §14.8: random forests have no interpretable parameter table, so Courage's three-fit interpretation block (Exercises 3–8) collapses to a single exercise whose only job is to make the student articulate *why* the forest does not have directly interpretable parameters. All answering happens downstream via `marginaleffects` on the forest's predictions in Temperance.
  - **Canonical-definition retention check.** Per §13 pre-flight rotation, this is the very last tutorial in the 12-example sequence, so Exercise 1 in each virtue section asks **all four** canonical definitions (Wisdom, Justice, Courage, Temperance) as a retention test. No preamble reminders — the exercises return in force.
  - **Intro-section pacing.** Per §13.1 Hard-tier rule, the Introduction is maximally short: canonical definitions of the virtues (per the rotation above), the state-the-question exercise (Ex 15), and the minimum operational setup (repo confirmation, library loading). Drop the Rubin-Causal-Model warm-up block (Ex 10–14); students at position 12 have done this six times before.
  - **Six potential outcomes per row.** The Preceptor and Population Tables get visually wide. Consider column-width adjustments via `gt::cols_width()`; the §10 styling conventions are otherwise unchanged.

---

### Note: `16-stops` pending RF recast

The tutorial at `inst/tutorials/16-stops/` currently fits a linear regression of `arrested ~ sex + race*zone` on the Open Policing data and frames the question as predictive — content that predates the move to position 11 / target tutorial 16. Under §1.5, position 11 is the non-parametric predictive slot, so this tutorial's content must be recast to random forest (or equivalent). The directory has been renamed already; the content rewrite is the outstanding work.

The Open Policing data is well-suited to RF — non-linearities between race, zone, and arrest probability are exactly the kind of interaction a linear model mishandles — so the recast is the default unless a cleaner RF-candidate dataset appears during authoring. The alternative is to drop `16-stops` entirely and start fresh on a different dataset.
