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
11. **Canonical definitions** — verbatim text for §11-referenced concepts
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

The target curriculum is **20 chapter/tutorial pairs total**: the 5 miscellaneous above and 15 example chapters. The chapter sequence in §17 grows toward this target.

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

**Definitions stay stable; what scales is the discussion around them.** A student who learns the canonical §11 wording in an early chapter should see the same wording in later chapters — that is how spaced repetition cements it. What changes across Easy, Medium, and Difficult treatments is the depth of the *surrounding* material: the counter-examples chosen, the knowledge drops attached, the techniques mentioned, the edge cases probed. Mark Easy/Medium/Difficult variants on knowledge drops (§12), counter-examples, and exercise prompts (§13) — not on the canonical definitions themselves.

The exception is when a concept is being introduced for the first time. The Easy version may use a deliberately simpler framing to give students a foothold; the canonical §11 wording then takes over from the Medium chapter onward and stays fixed thereafter. Use the simpler framing sparingly, and note the convergence point so authors know when to switch.

**Worked example: representativeness across three levels.**

- **Easy.** Representativeness is the similarity between a subset of the units in a population and the overall population itself. The discussion stays on the *data → population* link: are the data representative of the population? The cleanest way to ensure this is a random sample, but that is rarely the case. All counter-examples concern this single link.

- **Medium.** Switch to the canonical §11 wording: representativeness concerns two relationships among the rows in the Population Table — *data ↔ other rows*, and *other rows ↔ Preceptor Table*. Counter-examples and discussion span both directions. Even with a random-sample dataset and an unbiased DGM, a Preceptor Table whose units are not representative of the broader population yields biased results.

- **Difficult.** Same canonical definition as Medium. What changes: more sophisticated counter-examples and knowledge drops, plus mention of advanced remedies (post-stratification, inverse-probability weighting, raking). We do not teach these techniques in depth — there is no room — but we name them so students know what to reach for when they encounter the problem in practice.

Note that the definition shifts only between Easy and Medium, then stays fixed. That is the typical pattern: a temporary intro framing in Easy, the canonical §11 form from Medium onward, and the discussion deepening continuously across all three.

**Terminology introduction points (sampling mechanism, selection mechanism).** The phrase *sampling mechanism* is first introduced in the middle of the Easy tier and is used from then on in knowledge drops and example answers — every subsequent tutorial can assume the reader has seen it. The phrase *selection mechanism* is first introduced in the middle of the Medium tier and likewise propagates forward. Before writing any given tutorial, check where it sits in the sequence: if it is before the introduction point of one of these phrases, use only the plainer vocabulary; if it is after, use the technical term freely. This staggered introduction is why the two phrases are defined as canonical concepts in §11 but not introduced together.

**Worked example: validity across three levels.**

- **Easy.** Canonical §11 wording from the start. Scope is restricted to the **outcome column** and obvious measurement mismatches. Counter-examples: unit mismatches (cm vs. inches, years vs. months), scale mismatches (1–7 Likert vs. 0–10), timing mismatches (income last year vs. income at treatment time), naming collisions (household income vs. personal income). Remedies: identify, document, and adjust either the Preceptor Table's concept or the question to match what the data actually measures.

- **Medium.** Same canonical definition. Scope expands to **covariates and (in causal models) the treatment**, and introduces **derived variables** — columns constructed from raw data. Counter-examples: treatment operationalization mismatch (e.g., Enos's platform-confederate experiment as one operationalization of "Spanish exposure" vs. a different instantiation in the Preceptor Table), covariate encoding (education as years completed vs. as highest degree), concept drift over time ("Republican" in 1990 vs. 2024), derived columns (a "partisanship" index built from three survey items). Remedies expand: rescaling or redefining outcome and covariates, adjusting the question to match what is truly measurable, folding measurement error into how the DGM is specified.

- **Difficult.** Same canonical definition. Discussion moves to **construct validity** — subtle conceptual mismatches rather than obvious ones. Counter-examples: psychological constructs (is a three-item "attitude toward immigration" scale really measuring what the question means by "attitude"?), economic constructs (BLS-defined unemployment vs. colloquial usage; "wealth" as self-reported assets minus debts), policy constructs that drift across jurisdictions ("arrested" across different states' definitions). Advanced remedies to name, not teach: measurement invariance testing, item response theory, cross-walking between instruments, cognitive interviewing, instrumental variables when the proxy is known to be biased.

Unlike representativeness, validity's definition does not shift between Easy and Medium. The canonical §11 wording — "consistency, or lack thereof, in the columns of the data set and the corresponding columns in the Preceptor Table" — is plain-English enough for a first-chapter student, so no intro framing is needed. What deepens across the three levels is entirely the scope (outcome → covariates/treatment → constructs), the sophistication of the counter-examples, and the remedies named. Use this as the guide for other concepts: only introduce an Easy-specific framing when the §11 wording would genuinely obstruct a new student.

**Worked example: stability across three levels.**

- **Easy.** Simplified intro framing. Scope is a single temporal link — the data's era vs. the Preceptor Table's era. Frame: *"Stability means the relationship between the outcome and the covariates doesn't change over time. If the world in the data's era behaves differently from the world in the Preceptor Table's era, stability fails."* Counter-examples stay close to student intuition: survey data from 2015 used to answer a 2025 question, pre- vs. post-pandemic consumer behavior, interest-rate behavior in 2007 vs. 2020, data collected before a new competitor entered a market. Remedies: narrow the time gap, use the most recent subset of the data, adjust the Preceptor Table's time scope.

- **Medium.** Switch to canonical §11 wording and keep it. Scope broadens to the **three row categories** — data, Preceptor Table, and the intermediate population from which both are drawn. Introduces the load-bearing Medium-level insight: **stability is about parameters, not distributions.** A change in the distribution of any single variable over time does not, by itself, constitute a stability violation; what matters is whether β₀, β₁, and so on are the same across the three row categories. Counter-examples: Enos Metra 2012 → MBTA 2026, where the effect *parameter* of Spanish exposure on attitude may have shifted over 14 years even if the rider distribution hasn't; education's coefficient in an income model across decades; intercepts drifting while slopes hold, or the reverse. Remedies expand: include year as a covariate, estimate coefficients year-by-year, compare parameter estimates across time-split subsets.

- **Difficult.** Same canonical definition. Discussion moves to **structural breaks, regime shifts, and the Lucas critique** — cases where the pattern doesn't merely drift but changes in kind. Counter-examples: a new law that redefines "arrested" and thus pivots its relationship with covariates; agents optimizing against a published model so its coefficients decay once the model is known (Lucas critique); interaction terms whose sign flips across regimes (education's effect on income for men vs. women in 1950 vs. 2020); heteroscedasticity that is itself non-stationary. Advanced remedies to name, not teach: time-varying coefficients, state-space models, changepoint or regime-switching analysis, difference-in-differences with time fixed effects, Chow tests for structural breaks.

Like representativeness, stability has an Easy → Medium definitional shift and then fixes the canonical form from Medium onward. Unlike representativeness, the real Medium-level upgrade is not "more relationships to consider" but a different *kind* of insight — parameters, not distributions. Expect this insight to take more than one tutorial to stick; plan to revisit "distribution change ≠ stability violation" in several Medium-tier knowledge drops before moving on.

**Worked example: unconfoundedness across three levels.** Unlike the other three assumptions, unconfoundedness is causal-only — tutorials with predictive models skip it entirely, so every reappearance is in a causal context. A predictive tutorial between two causal tutorials means the next causal one may need to spend a half-exercise re-grounding why the assumption applies here and did not last time.

- **Easy.** Intuition-level framing. Scope: binary treatment, surface-level confounding. Frame: *"Unconfoundedness asks: could something other than the treatment explain why the treated and untreated groups have different outcomes? If not — if nothing else is driving the difference — the treatment is unconfounded. The easiest way to guarantee this is to assign treatment randomly."* Counter-examples stay at student-intuition level: voters who self-select into volunteering with a campaign differ from those who don't; smokers differ from non-smokers in many ways besides smoking; people who choose college differ from those who don't in ability, family income, and geography. Remedies: randomize when you can; if you cannot, name the confounders you are worried about and check whether they are in your data.

- **Medium.** Switch to canonical §11 wording and keep it. Introduces two pieces of apparatus: **conditioning on pre-treatment covariates**, with the critical distinction between *pre-treatment* and *post-treatment* covariates (only the former belong in the model; controlling for post-treatment variables that sit on the causal path induces bias); and **selection on observables**, the formal name for the assumption that all relevant confounders are measurable and present in your data. Also distinguishes randomized experiments (unconfoundedness guaranteed by design) from observational data (unconfoundedness is an assumption you defend). Counter-examples: Enos's Metra platform experiment and the Shaming experiment as "good" randomized cases that make the observational contrast vivid; education's effect on income as the classic ability-bias story; the post-treatment trap of controlling for "occupation" when estimating education → income. Remedies expand: identify and include measurable confounders, be strict about the pre-treatment cutoff, reason explicitly about which variables sit on the causal path between treatment and outcome.

- **Difficult.** Same canonical definition. Discussion moves to **selection on unobservables** — confounders that cannot be measured even in principle — and the **research designs built to work around them**. Counter-examples: ability bias that no test captures; voluntary-program selection (job training, welfare-to-work) where the people who sign up differ in ways that are not in the data; time-varying confounding when past outcomes affect future treatment decisions. Advanced designs and remedies to name, not teach: instrumental variables, regression discontinuity, difference-in-differences with its own parallel-trends assumption, natural experiments, propensity-score matching and weighting, sensitivity analysis (how much unmeasured confounding would overturn the result?).

Like stability, unconfoundedness has an Easy → Medium definitional shift and then fixes the canonical form from Medium onward. The Medium upgrade is heavy — the conditioning apparatus plus pre-vs-post-treatment plus the observables/unobservables framing — so plan to revisit these pieces across several Medium-tier tutorials rather than dropping them all at once. The Difficult upgrade is mostly about named designs (IV, RDD, DiD, propensity methods), which the Primer does not teach but names so students know the menu exists when they face unmeasured confounders in practice.

**Worked example: model checking across three levels.** Model checking — comparing the fitted values our DGM produces with the actual outcomes in the data — is different from the four assumption worked examples above. It is not a property we hope for; it is a diagnostic we perform. The same Easy / Medium / Difficult staging applies, but what scales is how much the check steers model choice and how much vocabulary we attach to it.

- **Easy.** Two sub-stages.
  - **First two example tutorials:** skip model checking entirely. The section's other canonical questions (Rubin framing, Preceptor Table construction, Population Table, the assumptions) already fill the budget; tutorial real estate is better spent there.
  - **Next three example tutorials:** one exercise that shows a side-by-side plot the author has produced ahead of time — the distribution of the actual outcome alongside the distribution of fitted values from the DGM. The student doesn't write code; they view the image, hit Continue, and see a short knowledge drop. Canonical End: *"In a good model, the distribution of fitted values looks like the distribution of the actual outcome. Big divergences mean our model is missing something."* No package loaded, no new terminology, no phrase "posterior predictive check" yet.

- **Medium.** Students create the comparison themselves with `check_predictions()` from `easystats` (or an equivalent package if a better one emerges). Knowledge drops sharpen: what a discrepancy can mean — wrong functional form, missing covariate, a wrong distributional family for the outcome, variance that depends on covariates. Students **diagnose** what they see but **do not fix** the model yet; the skill at this level is interpretation, not iteration.

- **Difficult.** Introduce the phrase **posterior predictive check** for the first time. Use `check_predictions()` (or equivalent) to perform a formal PPC. Discussion deepens to cover what different kinds of divergence mean for inference downstream: interval width, coverage, bias in particular regions of covariate space. In at least two Difficult-tier tutorials, use the PPC to drive a model revision — fit a first-pass model, show that its PPC is visibly poor, fit an alternative (different outcome family, added interaction, transformed covariate, etc.), and show that the new PPC is visibly better. This is the first time students see the check drive model choice rather than passively confirm it.

The Easy → Medium transition hands the tool to the student. The Medium → Difficult transition adds the technical name and — more importantly — the practice of *acting on* what the check reveals. The vocabulary "posterior predictive check" is withheld until Difficult so that the practice (look at the picture, reason about it, eventually iterate on the model) accumulates before the jargon arrives.

**Worked example: using the fitted model to answer questions (`marginaleffects`) across three levels.** Temperance's job is to get from the fitted DGM to the question we actually asked. Raw parameters rarely *are* the answer — log-odds, multinomial coefficients, and interaction terms are not on the outcome scale a student or stakeholder can read. The `marginaleffects` package — [**Model to Meaning: How to Interpret Statistical Models in R and Python**](https://marginaleffects.com/) by Vincent Arel-Bundock — is the tool for that transformation. Every Temperance section links the relevant chapter of the book at least once (see §13.5).

- **Easy.** Predictions only. `predictions()`, `avg_predictions()`, `plot_predictions()`. The frame: *"The model's coefficients are on an awkward scale. `predictions()` gives us back numbers on the outcome scale — probabilities, counts, years, whatever the question actually needs."* Skip `comparisons()`; skip the five-decision framework; skip grid types. Knowledge drops emphasize that predictions answer *"what does the model say Y is when X = …?"* Link each tutorial's Temperance section to the [Predictions chapter](https://marginaleffects.com/chapters/predictions.html). The current §13.5 Exercises 7–9 already operate at this level.

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

**Cross-cutting changes are expensive to propagate manually.** If we change the canonical definition of stability, or adjust how the Easy → Medium transition for representativeness works, the hand-edit path requires walking through all the tutorials (and their matching chapters) — and we will miss things. The regeneration path updates §11 (or §1.3, or wherever the change lives) and rebuilds the affected tutorials from the updated spec. Consistency is enforced by construction.

**Definition-only edits do not need a rebuild.** Changing just the wording of a §11 canonical definition works as find-and-replace in every tutorial. Regeneration earns its keep for *structural* changes: progression pacing (is Medium too steep between Tutorial 7 and Tutorial 8?), coverage (has this tutorial asked the canonical exercises from §13 that are due this tutorial?), cross-tutorial consistency (do the Difficult tutorials consistently drive model revision from the PPC per §1.3?). These are hard to see when each tutorial is considered in isolation and hard to fix without walking the whole sequence.

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

Chapters are Quarto files with the top-level `#` already set by the book structure; use `##` for virtue-level sections. Filename convention: `NN-topic-name.qmd` where `NN` is the chapter number (e.g. `04-cardinal-virtues.qmd`, `09-logistic-regression.qmd`).

Tutorials are R Markdown files with `learnr::tutorial` output. They live in the `primer.tutorials` package under `inst/tutorials/NN-topic-name/tutorial.Rmd`, where `NN` is the two-digit chapter number (e.g. `06-models`, `14-stops`). The tutorial's `id` in the YAML is `NN-topic-name`, lowercase, dashes for spaces.

For new chapters, produce a single `.qmd` file. For new tutorials, produce a single `.Rmd` file with the structure described in §5. Do not emit partial diffs; produce complete files David can drop in place.

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
  id: <NN-topic-name>   # e.g., 09-logistic-regression. Same as directory name.
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

# Packages below are what we want students to load themselves in the
# Console/QMD. They are listed in the tutorial so that (a) we have access
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

### 5.4 Sections and numbering

Each of the six sections opens with `##`. Each exercise opens with `### Exercise N` where `N` restarts at 1 within each section. Each exercise has a chunk label of the form `<section>-<N>` — `introduction-1`, `wisdom-3`, `justice-11`, etc.

### 5.5 Section preambles

The **preamble** of a virtue section is the content between the section header (`## Wisdom`, `## Justice`, `## Temperance`, etc.) and the first `### Exercise N` block. Preambles are prose, knowledge drops, and/or author-rendered output — never student-facing exercises. They orient the student, review work done earlier in the tutorial, or set up what this section will do.

**Virtue-section self-containment.** Each virtue section — in the tutorial *and* in the chapter — is meant to be somewhat self-contained. A reader who skipped (or just forgot) the previous section should be able to start the next one without backtracking. The mechanism is the preamble: each preamble revisits the key output(s) from the earlier virtues that this virtue needs. This is repetitive by design, and the repetition is the point — it is the Primer's spaced-repetition pattern (§8) operating at section scale.

Concretely:

- **Wisdom preamble**: opens with the canonical sentence *"Data science starts with some broad questions and a data set which might help us to answer them."* Then the "Imagine that you are…" paragraph verbatim from Introduction, one line restating the broad question (from Intro Exercise 15), and one or two sentences naming the dataset. The preamble emphasizes the two things the Cardinal Virtues assume a student arrives with: a broad question and a data set. Detailed spec in §13.2.
- **Justice preamble**: shows the Preceptor Table from Wisdom (exact copy) and a `gt` table of the data. Detailed spec in §13.3; the data table's footnotes describe the data on its own terms, not in comparison with the Preceptor Table.
- **Courage preamble**: shows the Population Table from Justice, plus the abstract mathematical form of the DGM that Justice's last exercise chose (functional family: Normal / Bernoulli / multinomial / cumulative — pull the block from §13.7). The author-shown abstract-math block that used to live at the *end* of Justice (§13.3 Exercise 15) moves here in any tutorial that uses a Courage preamble — one place, not two.
- **Temperance preamble**: reviews the DGM decided on at the end of Courage using some combination of the four canonical ways to describe a model (words, R code, parameter table, concrete mathematical formula). Fully specified in §13.5.
- **Summary preamble**: the final plot and the summary paragraph (§13.6).

None of these preambles describe what the *current* virtue does. That is the first exercise's job in every section (§14.6). Preamble prose is limited to showing upstream artifacts and the specifics of *this problem*.

It is OK — though not ideal — for a reader to skip, say, Courage and still make useful sense of Temperance, because Temperance's preamble shows the fitted DGM; and it is OK to skip Justice and start on Courage because Courage's preamble shows the Population Table. Repetition is not a bug; being forced to flip pages is.

Detailed per-virtue preamble specs for Introduction, Wisdom, Justice, and Summary are not yet fully written out — see §16 Open items.

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

The text in `message` is read closely by students, who compare their answer to ours. Our answer must be excellent. Use the wording in §11 verbatim for definitional questions.

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

### 7.4 Operational conventions: "CP/CR" and `show_file()`

Many operational exercises end with the string **CP/CR**, short for *Copy-Paste / Command-Response*. Students know what it means by the time they get past the first tutorial. Exception: the **very first tutorial** should spell it out once, inside the exercise Start, before using it as shorthand.

`show_file()` (from `tutorial.helpers`) prints the contents of a file in the student's project. The usual pattern: the student does something in their QMD, then runs `show_file("XX.qmd", chunk = "Last")` in the Console to display the last chunk, copies the Console output, and pastes it back into the tutorial. `chunk = "Last"` is preferred over `start = -N` because it's more robust. We never actually check what they paste; the threat of checking is the point.

The `Cmd/Ctrl + Shift + K` keystroke renders the QMD. Use it often — rendering catches bugs early, and professionals do it.

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
- **Example rows use real names and plausible figures** when the question targets identifiable units (senators, governors, firms, teams, countries). Track the same identities across a question's Preceptor and Population Tables so the reader sees the same people in both.
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

These are the ground truth for the project's key definitions. Use the wording below verbatim as the `message` text in written-answer exercises that ask for a definition. Use the same wording (or a close paraphrase) in chapter prose.

### Four Cardinal Virtues

> *Wisdom, Justice, Courage, and Temperance.*

### Wisdom

> *Wisdom begins with a question and then moves on to the creation of a Preceptor Table and an examination of our data.*

### Justice

> *Justice concerns the Population Table and the four key assumptions which underlie it: validity, stability, representativeness, and unconfoundedness.*

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

Short prose fragments — typically one or two sentences — that go in the End of an exercise. Use verbatim where applicable; edit lightly where the exercise context calls for specifics. Organized by virtue. Cross-references to §11 indicate that the knowledge drop is a canonical definition already covered there.

Knowledge drops are deliberately short. Students won't read more than two sentences.

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

**On the iterative question.**
> *This is the first version of the question. We will now create a Preceptor Table to answer the question. We may then revise the question given complexities discovered in the data. We then update the question and the Preceptor Table. And so on.*

### 12.2 Wisdom

Canonical definitions from §11 appropriate here: Wisdom, Preceptor Table, Preceptor Table (detailed), Units, Variables, Outcome, Covariates, Treatment, Quantity of Interest.

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

Canonical definitions from §11 appropriate here: Justice, Population Table, Validity, Stability, Representativeness, Unconfoundedness.

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
> *When representativeness is violated, the estimates for the model parameters will be biased.*

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

### 12.4 Courage

Canonical definitions from §11 appropriate here: Courage, Data Generating Mechanism.

**On tidymodels.**
> *The [tidymodels](https://www.tidymodels.org/) framework is the most popular one in the R world for estimating models. [Tidy Modeling with R](https://www.tmwr.org/) by Max Kuhn and Julia Silge is a great introduction.*

**On dummy variables from a 2-level variable.**
> *A categorical variable (whether character or factor) like `sex` is turned into a 0/1 "dummy" variable which is then renamed something like `sexMale`. We can't have words in a mathematical formula, hence the need for dummy variables.*

**On dummy variables with N categories.**
> *The same dummy variable approach applies to a categorical covariate with N values. Such cases produce N−1 dummy 0/1 variables. The presence of an intercept in most models means that we can't have N categories. The "missing" category is incorporated into the intercept.*

**On more variables, less interpretability.**
> *The more variables we add, the more difficult it is to interpret the meaning of any particular coefficient. But interpretation also becomes less important. We don't really care about coefficients. We care about using our model to estimate quantities of interest.*

**On code being primary.**
> *In data science, we deal with words, math, and code, but the most important of these is code. We created the mathematical structure of the model and then wrote a model formula in order to estimate the unknown parameters.*

**On workspace awareness.**
> *Just because something exists in the tutorial (or in the QMD) does not mean that it is in the Console. You should be aware of what exists in R World, which is generally called your "workspace."*

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

Canonical definitions from §11 appropriate here: Temperance, Preceptor's Posterior.

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

**On "adjust" vs. "control."**
> *We recommend the verb "adjust" in place of "control" when discussing the effect of including other variables in the model. "The causal effect is 1.5, adjusting for age and party." "Adjusting" demonstrates humility; "controlling" does not.*

**On overlapping dummy intervals.**
> *If the variable is categorical, we care whether the confidence interval for one of the dummy columns overlaps with the confidence intervals for the other dummy columns derived from that categorical variable. If so, we can't be sure about the ordering of importance among the categories.*

**On comparisons with numeric variables.**
> *Numeric variables are harder to use in comparisons than binary variables because there are no longer two well-defined groups. We must create those two groups ourselves. As long as there are no interaction terms, we can pick two groups with any values. The most common two groups differ by one unit of the variable.*

**On back-and-forth in data science.**
> *Data science often involves back-and-forth work. First, make a single chunk of code — say, a new plot — work well. This requires interactive work between the QMD and the Console. Second, ensure that the entire QMD runs correctly on its own.*

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

---

## 13. Master exercise list

This is the ordered list of exercises that make up an example tutorial. Each exercise is tagged:

- **[canonical]** — use the wording and `message` text below verbatim. These are the spaced-repetition backbone.
- **[per-tutorial]** — the question frame is fixed; the author writes a problem-specific prompt and/or `message`.
- **[operational]** — a workflow instruction (creating files, rendering, CP/CR). Always a written-without-answer exercise. These are migrated from the template as-is.

Within a section, keep exercises in the order given. Not every tutorial includes every exercise — the schedule depends on spaced repetition (§8) and on whether the problem is causal or predictive. Some exercises (e.g., unconfoundedness questions) are skipped entirely for predictive tutorials.

**Pre-flight before drafting a tutorial.** Find the tutorial's position in §17 (06 = first example, 07 = second, …) and its tier in §1.3 (roughly: first third Easy, middle third Medium, final third Difficult). Some exercises are **tier-dependent** — they are written here in their Medium form but must be dropped, replaced, or extended depending on tier. Tier-dependent exercises are flagged inline with a `**Tier:**` line; read it before including them. Current tier-dependent items:

- **Model checking** (§13.4 Exercises 9–10): skipped in the first two example tutorials (06, 07); replaced by an author-rendered side-by-side outcome/fitted-value plot in Easy tutorials 3–5 (08–10); Medium form (`check_predictions()`) in tutorials 11–12; Difficult form (posterior-predictive-check terminology + model revision driven by the check) thereafter. Full progression in §1.3 *Worked example: model checking across three levels*.
- **Concrete DGM math** (§13.4 Exercise 11): author-shipped in Easy and Medium; possibly a student exercise (via AI) in Difficult tutorials with simple models; author-shipped when the model is complex. Details in §13.4.
- **Parameter-table formatting** (§13.5 Temperance preamble): Easy = raw `tidy()`, Medium = nicer (`kable`/`gt`), Difficult = near-publication quality. Always author-shipped.
- **`marginaleffects` coverage** (§13.5 Temperance): Easy = `predictions()` family only; Medium adds `comparisons()`; Difficult adds the five-decisions framework and grid types. Slopes are never introduced.
- **Preceptor/Population Table footnote depth** (§10): Easy footnotes include scaffolding (what a Preceptor Table *is*; per-row causal-effect arithmetic); Medium and Difficult drop the scaffolding and deepen the remaining footnotes. Details in §1.3 *Worked example: Preceptor Table and Population Table footnote sophistication*.
- **Validity/stability/representativeness/unconfoundedness progressions** (§1.3): each has an Easy → Medium → Difficult treatment; consult §1.3 when drafting the Justice exercises for that assumption.

If a tutorial is being drafted without a pre-flight tier check, the default is Medium — and Medium wording *will be wrong* for every Easy tutorial (06–10) and every Difficult tutorial (11 onward, depending on final numbering). The pre-flight is cheap; skipping it is how model-checking exercises ended up in Tutorial 07.

### 13.1 Introduction

The Introduction preamble opens with the bookend sentence *The world confronts us. Make decisions we must.* This sentence appears at both ends of every tutorial — it also closes the Temperance section (§13.5 Exercise 17 End). After this opening sentence comes a single "Imagine that you are …" paragraph that motivates the problem with a real person facing real decisions. The paragraph always starts with "Imagine that you are …" and always ends with "There are many decisions to make." The same paragraph is used in the matching chapter.

**Exercise 1.** [canonical] Four Cardinal Virtues.
- Prompt: *What are the four [Cardinal Virtues](https://en.wikipedia.org/wiki/Cardinal_virtues), in order, which we use to guide our data science work?*
- Message: `"Wisdom, Justice, Courage, and Temperance."`
- End: knowledge drop *On spaced repetition* (§12.1).

**Exercise 2.** [operational] Create a GitHub repo.
- Prompt: *Create a GitHub repo called `XX`. Make sure to click the "Add a README file" checkbox. Connect the repo to a project on your computer using `File -> New Folder from Git ...`. Select "Open in a new window." You need two editor windows: this one for the tutorial, and the one you just created for your code and Console. Select `File -> New File -> Quarto Document ...`. Provide a title — `"XX"` — and an author. Render the document and save it as `XX.qmd`. Create a `.gitignore` file with `XX_files` on the first line followed by a blank line. Save and push. In the Console, run `show_file(".gitignore")`. If that fails, it's probably because you haven't loaded `library(tutorial.helpers)` in the Console. CP/CR.*
- In the **first** tutorial, spell out CP/CR as "copy the Console output and paste it in the Response" on first use.
- End: *Professionals keep their data science work in the cloud because laptops fail.*

**Exercise 3.** [operational] Add libraries and echo settings to QMD.
- Prompt: *In your QMD, put `library(tidyverse)` and `library(<data package>)` in a new code chunk. Render the file. Notice that the file does not look good because the code is visible and there are messages. Add `#| message: false` to remove the messages in this setup chunk. Also add the following to the YAML header to remove all code echos from the HTML:*
  ```
  execute:
    echo: false
  ```
- *In the Console, run `show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: *Render again. Everything looks nice, albeit empty, because we have added code to make the file look better and more professional.*

**Exercise 4.** [operational] `library(tidyverse)` via `Cmd/Ctrl + Enter`.
- Prompt: *Place your cursor in the QMD file on the `library(tidyverse)` line. Use `Cmd/Ctrl + Enter` to execute that line. Note that this copies the line to the Console and runs it. CP/CR.*
- (No End before next exercise; this runs into the next one naturally.)

**Exercise 5.** [operational] Next `library()` via `Cmd/Ctrl + Enter`.
- Prompt: *Place your cursor in the QMD file on the next `library()` line. Use `Cmd/Ctrl + Enter` to execute that line. This workflow — writing things in the QMD so you have a permanent copy, and then executing them in the Console with `Cmd/Ctrl + Enter` — is the most common approach to data science. There is QMD World and R World. It is your responsibility to keep them in sync. CP/CR.*
- End: introduce the data: "A version of the data from XX is available in the `XX` tibble."

**Exercise 6.** [operational] Read the `?<tibble>` help.
- Prompt: *In the Console, type `?XX`, and paste the Description below.*
- Only include if the tibble has a help page. Delete if not.
- End: short paragraph of context about the data (paper abstract, source website quote).

**Exercise 7.** [canonical] Define a causal effect.
- Prompt: *Define a causal effect.*
- Message: `"A causal effect is the difference between two potential outcomes."`
- End: *According to the Rubin Causal Model, there must be two (or more) potential outcomes for any discussion of causation to make sense. This is simplest to discuss when the treatment has only two different values, generating only two potential outcomes.*

**Exercise 8.** [canonical] Fundamental problem of causal inference.
- Prompt: *What is the fundamental problem of causal inference?*
- Message: `"The fundamental problem of causal inference is that we can only observe one potential outcome."`
- End: *If the treatment variable is continuous (like a lottery payment), then there are lots and lots of potential outcomes, one for each possible value of the treatment variable.*

**Exercise 9.** [per-tutorial, written-with-answer] The outcome variable.
- Prompt: *XX is the broad topic of this tutorial. Given that topic, which variable in `<tibble>` should we use as our outcome variable?*
- Message: a sentence about the outcome variable used.
- End: *We will use `XX` as our outcome variable.* Follow with a simple AI-generated plot of the outcome (univariate or bivariate; bivariate should use a non-key covariate). Subtitle highlights an aspect of the data. No code chunk label.

**Exercise 10.** [per-tutorial, written-with-answer] An imaginary binary treatment.
- Prompt: *Let's imagine a brand new variable which does not exist in the data. This variable should be binary — it only takes on one of two values — and, at least in theory, manipulable. Describe this imaginary variable and how we might manipulate its value.*
- Message pattern: concrete example of such a variable with `` `backticks` `` around its name, e.g. *"Imagine a variable called `phone_call` which has value 1 if the person received a call urging them to vote and 0 otherwise. We, the organization making the calls, can manipulate this variable by deciding whether to call a specific individual."*
- (If this is a causal model, also include these two sentences in the Start: *For now, ignore the actual treatment variable `XX` which we will use later. The point of this exercise is to reinforce our understanding of the Rubin Causal Model.*)
- End: *Any data set can be used to construct a causal model as long as there is at least one covariate that we can, at least in theory, manipulate. It does not matter whether or not anyone did, in fact, manipulate it.*

**Exercise 11.** [per-tutorial, written-with-answer] Count potential outcomes for binary treatment.
- Prompt: *Given our (imaginary) treatment variable `XX`, how many potential outcomes are there for each unit? Explain why.*
- Message pattern: *"There are two potential outcomes because the treatment variable `XX` takes on two possible values: XX."*
- End: *The same data set can be used to create, separately, lots and lots of different models, both causal and predictive. This is a conceptual framework we apply to the data. It is never inherent in the data itself.*

**Exercise 12.** [per-tutorial, written-with-answer] Compute a unit-level causal effect.
- Prompt: *Specify two different values for the imaginary treatment variable `XX`, for a single unit; guess the potential outcomes; and calculate the causal effect for that unit given those guesses.*
- Message pattern: *"For a given [unit], assume the treatment variable could be [treatment] or [control]. If the unit gets [treatment], the outcome would be [value A]. If the unit gets [control], the outcome would be [value B]. The causal effect on the outcome of a treatment of [treatment] versus [control] is [value A] − [value B] = [difference], which is the causal effect for this unit."*
- End: *A causal effect is the difference between two potential outcomes. "Difference" does not necessarily mean "subtraction" — many potential outcomes are not numbers. Even for numeric outcomes, you can't simply say the effect is 10 without specifying the order of subtraction.*

**Exercise 13.** [per-tutorial, written-with-answer] Predictive covariate of interest.
- Prompt: *Let's consider a predictive model. Which variable in `<tibble>` do you think might have an important connection to `<outcome>`?*
- Message pattern: brief description of one key covariate whose connection we might want to explore.
- End: *With a predictive model, each individual unit has only one observed outcome. Predictive models have no "treatments" — only covariates.*

**Exercise 14.** [per-tutorial, written-with-answer] Two groups that might differ.
- Prompt: *Specify two different groups of [units] which have different values for [covariate] and which might have different average values for the [outcome].*
- Message pattern: *"Consider two groups: one with [covariate] = [value A], one with [covariate] = [value B]. These two groups might have different average values for the outcome."*
- End: *In predictive models, do not use "cause," "influence," "impact," or similar words. The best phrasing is in terms of "differences" between groups of units with different values for a covariate of interest.*

**Exercise 15.** [per-tutorial, written-with-answer] State the question.
- Prompt: *Write a [causal or predictive] question connecting the outcome `XX` to `XX`, the covariate of interest.*
- Message pattern: the specific question. Causal: "What is the average causal effect of [treatment] on [outcome]?" Predictive: "What is the difference in [outcome] between [group A] and [group B]?"
- End: *This is the first version of the question. We will now create a Preceptor Table to answer the question. We may then revise the question given complexities discovered in the data. And so on.*

### 13.2 Wisdom

By the end of Wisdom, the student has a specific question, a Preceptor Table that would answer it, and a first look at the data.

**Preamble (between `## Wisdom` header and Exercise 1).** The Cardinal Virtues assume a student arrives with a broad question and a data set; Wisdom's preamble emphasizes exactly those two things. Contents, in order:

1. **Canonical opening sentence, verbatim:** *"Data science starts with some broad questions and a data set which might help us to answer them."* Every Wisdom preamble in the Primer begins with this sentence, unchanged.
2. **The "Imagine that you are…" paragraph from Introduction, verbatim.** Same text, not paraphrased. It reorients a reader who skipped Introduction, and it costs nothing to show a reader who did read Introduction.
3. **The broad question** in one line — the canonical answer to Intro Exercise 15 (e.g. *"What is the average height of male and female USMC recruits?"*). This is the *broad* question, not the narrow specific question that Wisdom Exercise 10 will arrive at — do not preempt that exercise.
4. **One or two sentences naming the dataset.** The Introduction identifies the dataset; Wisdom is where we will explore it. Write as a plain statement — *"We will work from the NHANES survey (conducted by the CDC), available in the `nhanes` tibble of the `primer.data` package."* Do not make claims about what the data will show, and do not mention measurement or validity concerns — those come later.
5. A Continue button (`###` with no heading) before `### Exercise 1`.

Per §14.6, the preamble does **not** describe what Wisdom does; Exercise 1 below asks the student to describe Wisdom using the canonical §11 wording.

**Exercise 1.** [canonical] Components of Wisdom.
- Prompt: *In your own words, describe the key components of Wisdom when working on a data science problem.*
- Message: `"Wisdom begins with a question and then moves on to the creation of a Preceptor Table and an examination of our data."`
- End: the Tukey walk-away quote (§12.2).

**Exercise 2.** [canonical] Define a Preceptor Table.
- Prompt: *Define a Preceptor Table.*
- Message: `"A Preceptor Table is the smallest possible table of data with rows and columns such that, if there is no missing data, we can easily calculate the quantity of interest."`
- End: *The Preceptor Table does not include all the covariates which you will eventually include in your model. It only includes, along with the outcome(s), covariates which are mentioned in your question.*

Between Exercises 2 and 3, insert at least two problem-specific EDA exercises (AI-prompted code, §9). One typically explores the outcome variable; the other explores the treatment (causal) or key covariate (predictive). Provide knowledge drops that highlight what the plot reveals.

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

**Exercise 10.** [per-tutorial, written-with-answer] The narrow specific question.
- Prompt: *What is the narrow, specific question we will try to answer?*
- Message: per-tutorial.
- End: *The answer to this question is your Quantity of Interest. It is OK if your question differs from ours. Many similar questions lead to the creation of the same model.*

**Exercise 11.** [per-tutorial, written-with-answer] First two sentences of the summary paragraph.
- Prompt: *We will be creating a summary paragraph over the course of this tutorial. Write the first two sentences. The first sentence is a general statement about the overall topic, mentioning the general class of outcome and at least one covariate. The second introduces the data source and the specific question — when/where gathered, how many observations, who collected it.*
- Message: an excellent two-sentence opener.
- End: *Read our answer. It will not be the same as yours. You can change your answer to incorporate some of our ideas, but do not copy/paste our answer exactly. Add your two sentences to your QMD, `Cmd/Ctrl + Shift + K`, and commit/push.*

### 13.3 Justice

**Preamble (between `## Justice` header and Exercise 1).** Per the self-containment principle in §5.5, the Justice preamble revisits the two outputs from Wisdom that Justice needs. Per §14.6, it does not describe what Justice does — Exercise 1 does that. Contents, in order:

1. **The Preceptor Table from Wisdom**, rendered via the §10.3 `gt` pipeline. An exact copy — same tibble, same footnotes, same code. Prefaced by one sentence — something like *"Recall the Preceptor Table we built in Wisdom:"* — so a reader coming in cold knows what it is. Do not alter the Preceptor Table here; if it needs changing, change it in Wisdom too.
2. **A `gt` table of the data** — a companion to the Preceptor Table. Show 3–5 sample rows (plus a `"..."` row) with the same columns the data has for the outcome and the most important covariates. This is the first time in the tutorial the reader sees the actual data as a formatted table; prior exposure is as raw tibble print-outs. Specifications:
   - **Title** starts with `"Data: "` and then a short descriptive name of the dataset — e.g. `"Data: NHANES Young Adults, Ages 18–27"`, `"Data: Enos Metra Platform Experiment, 2012"`, `"Data: Gerber-Green-Larimer Michigan Shaming Experiment, 2006"`. Not just the package's tibble name.
   - **Title footnote** gives proper source information — the citation / author / year / provenance of the data, the kind of thing that would appear in a paper's data section. E.g. *"National Health and Nutrition Examination Survey (NHANES), Centers for Disease Control and Prevention. Continuous survey data 1999–present; height measured by trained examiners in the Mobile Examination Center."*
   - **Outcome-column footnote** describes the data's outcome on its own terms — how it was measured, by whom, on what scale, and any coding subtlety a thoughtful reader of *this dataset* would want to know. It does **not** compare the data's measurement to the Preceptor Table's; it does **not** say things like "Preceptor recruits, by contrast, are measured at enlistment." Those comparisons are Justice's job — the exercises that follow this preamble are precisely where validity (columns of the data ↔ columns of the Preceptor Table) gets addressed. A footnote that is genuinely describing the data will happen to expose the features that validity will later confront, and that is enough. No foreshadowing beyond that.
   - **Key-covariate footnote** does the same for the most important covariate (or the treatment, in causal problems): measurement procedure, coding, and any subtlety a reader of the dataset would want to know. Again, describe — do not compare.
   - **Other columns** need footnotes only if there is something specific to say. Don't narrate every column.
   - **Do not discuss validity, stability, representativeness, unconfoundedness, or any of the named assumptions.** Those belong to the exercises that follow. The preamble's data-table footnotes are descriptive; the comparative work — data ↔ Preceptor Table, data ↔ population — is the point of Justice's exercises and does not belong in the preamble.
   - Use the same §10.2 pipeline + inline-block wrapper pattern as the Preceptor/Population Tables so the table renders at content width in learnr. Give the `gt::gt()` call a unique `id` — e.g. `"data_tbl"` — and scope the footnote-cap `opt_css` to it.
3. A Continue button (`###` with no heading) before `### Exercise 1`.

Parts 1 and 2 are deliberately repetitive with Wisdom — same Preceptor Table, same data a reader has already seen in an EDA plot. That is the point: a reader who skipped Wisdom can still start Justice, and a reader who didn't gets a useful refresher. See §5.5.

**Exercise 1.** [canonical] Components of Justice.
- Prompt: *In your own words, name the five key components of Justice when working on a data science problem.*
- Message: `"Justice concerns the Population Table and the four key assumptions which underlie it: validity, stability, representativeness, and unconfoundedness."`
- End: *Justice is about concerns that you (or your critics) might have, reasons why the model you create might not work as well as you hope.*

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

**Exercise 6.** [canonical] Define stability.
- Prompt: *In your own words, define the assumption of "stability" when employed in the context of data science.*
- Message: `"Stability means that the relationship between the columns in the Population Table is the same for three categories of rows: the data, the Preceptor Table, and the larger population from which both are drawn."`
- End: the stability-as-time knowledge drop (§12.3).

**Exercise 7.** [per-tutorial, written-with-answer] A stability concern for this problem.
- Prompt: *Provide one reason why the assumption of stability might not be true in this case.*
- Message: per-tutorial. Students read these "official" answers carefully — make the example precise.
- End: the stability-about-parameters knowledge drop (§12.3).

**Exercise 8.** [canonical] Define representativeness.
- Prompt: *We use our data to make inferences about the overall population. We use information about the population to make inferences about the Preceptor Table: Data → Population → Preceptor Table. In your own words, define the assumption of "representativeness."*
- Message: `"Representativeness, or the lack thereof, concerns two relationships among the rows in the Population Table. The first is between the data and the other rows. The second is between the other rows and the Preceptor Table."`
- End: the representativeness-ideal-and-reality knowledge drop (§12.3).

**Exercise 9.** [per-tutorial, written-with-answer] Representativeness: data vs. population.
- Prompt: *We do not use the data directly to estimate missing values in the Preceptor Table. Instead, we use the data to learn about the overall population. Provide one reason, involving the relationship between the data and the population, why the assumption of representativeness might not be true in this case.*
- Message: per-tutorial. Do not invoke time — save time-based examples for stability.
- End: the representativeness-cost knowledge drop (§12.3).

**Exercise 10.** [per-tutorial, written-with-answer] Representativeness: population vs. Preceptor Table.
- Prompt: *We use information about the population to make inferences about the Preceptor Table. Provide one reason, involving the relationship between the Population and the Preceptor Table, why the assumption of representativeness might not be true in this case.*
- Message: per-tutorial. Again, avoid time.
- End: the stability-vs-representativeness knowledge drop (§12.3).

**Exercise 11.** [canonical, causal only] Define unconfoundedness.
- Prompt: *In your own words, define the assumption of "unconfoundedness" when employed in the context of data science.*
- Message: `"Unconfoundedness means that the treatment assignment is independent of the potential outcomes, when we condition on pre-treatment covariates."`
- End: the unconfoundedness-being-causal-only knowledge drop (§12.3).

**Exercise 12.** [per-tutorial, written-with-answer, causal only] An unconfoundedness concern.
- Prompt: *Provide one reason why the assumption of unconfoundedness might not be true (or relevant) in this case.*
- Message: per-tutorial. Confounds are the hardest questions for students — your example must be good, specifying precisely how treatment assignment is correlated with potential outcomes.
- End: the randomization-failing knowledge drop (§12.3).

**Exercise 13.** [operational] Load the modeling package.
- Prompt: *A statistical model consists of two parts: the probability family and the link function. The probability family is the probability distribution which generates the randomness in our data. The link function is the mathematical formula which links our data to the unknown parameters. Add `library(tidymodels)` to the QMD file. Place your cursor on that line. Use `Cmd/Ctrl + Enter` to execute. Note that this copies the line to the Console. CP/CR.*
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

**Preamble (between `## Courage` header and Exercise 1).** Per the self-containment principle in §5.5, the Courage preamble revisits the two outputs from earlier virtues that Courage needs. Per §14.6, it does not describe what Courage does — Exercise 1 does that. Contents, in order:

1. **The Population Table from Justice**, rendered via the §10.4 `gt` pipeline. Prefaced by one sentence of context — something like *"Recall the Population Table we built in Justice:"* — so a reader coming in cold knows what it is.
2. **The abstract mathematical form of the DGM** — the functional family chosen at the end of Justice (Normal / Bernoulli / multinomial / cumulative). Pull the block from §13.7. Use plain `N(0, \sigma^2)` for the error term, not `\mathcal{N}` (§13.5, same learnr MathJax bug applies here). Accompany with the knowledge drop: *We use generic variables — $Y$, $X_1$, and so on — because our purpose is to describe the general mathematical structure of the model, independent of the specific variables we will eventually use.*
3. A Continue button (`###` with no heading) before `### Exercise 1`.

Parts 1 and 2 are deliberately repetitive with Justice — they show the same Population Table and the same abstract math that Justice's last exercise produced. That is the point: a reader who skipped Justice can still start Courage, and a reader who didn't gets a useful refresher. See §5.5.

**Abstract-math block moves here.** The author-shown abstract mathematical structure that used to live at the end of Justice (§13.3 Exercise 15 in the original draft) now lives in the Courage preamble only — one place, not two.

**Model-checking staging.** Exercises 9 and 10 below (load `easystats`, run `check_predictions()`) are **Medium-tier** as written. In **Easy-tier** tutorials, replace them with a single exercise that shows an author-produced side-by-side plot of outcome distribution vs. fitted-value distribution (no student code, view-and-Continue pattern) — or in the first two example tutorials, omit model checking entirely. In **Difficult-tier** tutorials, add a follow-up exercise that uses the check to drive a model revision and then re-runs the check on the improved model. The full progression is in §1.3 (Worked example: model checking across three levels).

**Exercise 1.** [canonical] Components of Courage.
- Prompt: *In your own words, describe the components of the virtue of Courage for analyzing data.*
- Message: `"Courage creates the data generating mechanism."`
- End: *Having decided on the basic mathematical structure of the model at the end of Justice — a choice mostly driven by the distribution of our outcome variable — we now turn toward estimating the model.*

**Exercise 2.** [per-tutorial, code] Start the model.
- Prompt: *Because our outcome variable is [binary/continuous/multinomial/ordinal], start to create the model by entering `<appropriate model function>`* (e.g., `linear_reg(engine = "lm")`, `logistic_reg(engine = "glm")`, `multinom_reg(engine = "glmnet")`).
- End: the tidymodels knowledge drop (§12.4).

**Exercise 3.** [per-tutorial, code] Fit a single-variable model.
- Prompt: *Continue the pipe to `fit(<outcome> ~ <single categorical covariate>, data = <tibble>)`.* Use a two-level categorical if possible.
- Copy-previous-code button is included.
- End: the dummy-variables-from-2-level knowledge drop (§12.4), customized with the actual variable name.

**Exercise 4.** [per-tutorial, code] Add `tidy(conf.int = TRUE)`.
- Prompt: *Continue the pipe with `tidy(conf.int = TRUE)`.*
- End: discuss the meaning of the intercept and β₁ using the actual numeric results.

**Exercise 5.** [per-tutorial, code] Fit with a 3+ level categorical variable.
- Prompt: *Change the call to `fit(<outcome> ~ <3+ level categorical>, data = <tibble>)`.*
- End: the dummy-variables-with-N-categories knowledge drop (§12.4), customized.

**Exercise 6.** [per-tutorial, code] Fit the final model.
- Prompt: *Change the call to `fit(<final formula>, data = <tibble>)`.*
- End: the more-variables-less-interpretability knowledge drop (§12.4). Add commentary about why this model was chosen.

**Exercise 7.** [per-tutorial, code] Display the fit object.
- Prompt: *Behind the scenes, an object called `fit_<n>` has been created. Type `fit_<n>` and hit "Run Code."*
- End: the code-being-primary knowledge drop (§12.4).

**Exercise 8.** [operational] Bring `fit_<n>` into R World.
- Prompt: *We need `fit_<n>` to exist in R World. Copy/paste this code into the Console and execute it:*
  ```
  fit_<n> <- <model spec> |>
    fit(<formula>, data = <tibble>)
  ```
- *CP/CR.*
- End: the workspace-awareness knowledge drop (§12.4).

**Exercise 9.** [operational] Load easystats in the Console.
- **Tier:** Medium only. **Omit entirely** in the first two example tutorials (06 Models, 07 Two Parameters). In Easy tutorials 3–5 (08–10), replace both Exercises 9 and 10 with a single author-rendered side-by-side plot of outcome distribution vs. fitted-value distribution — the student views it and hits Continue; no package loaded, no terminology introduced. In Difficult tutorials, keep Exercises 9–10 and add a follow-up exercise that uses the check to drive a model revision. Full progression in §1.3 *Worked example: model checking across three levels*.
- Prompt: *In the Console, load the [easystats](https://easystats.github.io/easystats/) package. CP/CR.*
- End: the why-easystats-isn't-in-the-QMD knowledge drop (§12.4).

**Exercise 10.** [operational] Run `check_predictions()`.
- **Tier:** Medium only. See Exercise 9's tier note above — same rules.
- Prompt: *In the Console, run `check_predictions(extract_fit_engine(fit_<n>))`. CP/CR.*
- End: the `check_predictions()` knowledge drop (§12.4). Add a sentence noting whether the simulated data looks like the actual data for this problem.

**Exercise 11.** [author-shown block in Easy and Medium; optional student exercise in Difficult tutorials with simple models only] Concrete LaTeX DGM.
- **Tier:** Easy and Medium → author-shipped (no student exercise). Difficult with simple models → may be a student exercise (AI-assisted). Difficult with complex models → author-shipped. Never purely abstract LaTeX at this position — that form lives in the Courage preamble only.
- **Default (Easy, Medium, and Difficult tutorials with many parameters):** author-shipped. Render the fitted model in LaTeX with variable names and estimated coefficients substituted in — the concrete DGM. Include the hat-and-error-term knowledge drop (§12.4) followed by: *This is our data generating mechanism.* Then the DGM-being-a-formula knowledge drop (§12.4).
- **Difficult tutorials with simple models** (few coefficients, no many-level categoricals) may optionally include a student-produced version: the student prompts AI for the LaTeX and pastes it into their QMD. Even here, the heavy lifting is AI; the student is checking and pasting, not deriving.
- The concrete LaTeX DGM is also referenced in the §13.5 Temperance preamble as the fourth way to describe a model.

**Exercise 12.** [operational] Cache the fit in the QMD.
- Prompt: *Create a new code chunk in your QMD. Add the chunk option `#| cache: true`. Copy/paste the R code for the final model into the chunk, assigning the result to `fit_<n>`. (This includes `fit()` but not `tidy()`.) Place your cursor on the `fit_<n>` line and use `Cmd/Ctrl + Enter`. (This is technically unnecessary since we already have `fit_<n>` in the workspace, but ensuring everything in the QMD is also in the Console is good habit.) `Cmd/Ctrl + Shift + K`. Rendering may be slow the first time but cached thereafter. At the Console, run `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: the caching knowledge drop (§12.4). *To confirm, `Cmd/Ctrl + Shift + K` again. It should be quick.*

**Exercise 13.** [operational] Add `*_cache` to `.gitignore`.
- Prompt: *Add `*_cache` to `.gitignore`. Cached objects are often large and don't belong on GitHub. At the Console, run `tutorial.helpers::show_file(".gitignore")`. CP/CR.*
- End: *Because of the change in your `.gitignore` (assuming you saved it), the cache directory should not appear in the Source Control panel because Git is ignoring it. Commit and push.*

**Exercise 14.** [per-tutorial, code] Run `tidy(fit_<n>, conf.int = TRUE)`.
- Prompt: *In the Console, run `tidy()` on `fit_<n>` with `conf.int = TRUE`. This returns 95% intervals for all the parameters.*
- End: the `broom` knowledge drop (§12.4).

**Exercise 15.** [per-tutorial, written-without-answer] Make a nice table from `tidy()`.
- Prompt: *Create a new code chunk in your QMD. Ask AI to make a nice-looking table from the tibble returned by `tidy()`. You don't need all the columns — estimate and confidence intervals is typical. You may need to load [tinytable](https://vincentarelbundock.github.io/tinytable/), [knitr](https://yihui.org/knitr/), [gt](https://gt.rstudio.com/), [kableExtra](https://haozhu233.github.io/kableExtra/), [flextable](https://davidgohel.github.io/flextable/), or [modelsummary](https://modelsummary.com/) in the setup chunk. Insert your table code. `Cmd/Ctrl + Shift + K`. At the Console, `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: show our table and our code. Closing knowledge drop: *At the very least, your table should include a title and a caption with the data source. The more you use AI, the better you will get at doing so.*

**Exercise 16.** [per-tutorial, written-with-answer] Model-structure sentence.
- Prompt: *Add a sentence to your project summary explaining the structure of the model. Something like: "I/we model XX [concept of outcome, not variable name], [values of XX], as a [linear/logistic/multinomial/ordinal] function of XX [and maybe other covariates]." Recall the beginning of our summary: [paste what we suggested at the end of Justice].*
- Message: per-tutorial.
- End: *Read our answer. Do not copy/paste exactly. Add your two sentences to the summary paragraph. `Cmd/Ctrl + Shift + K`, then commit/push.*

### 13.5 Temperance

**Preamble (between `## Temperance` header and Exercise 1).** The Temperance preamble reviews the DGM decided on at the end of Courage. Per §14.6, it does not describe what Temperance does — Exercise 1 does that. Contents, in order:

1. A link to [**Model to Meaning**](https://marginaleffects.com/) — pick the chapter matching the tutorial's tier per §1.3 (Easy: Predictions; Medium adds Comparisons; Difficult adds Challenge and Framework).
2. A review of the DGM using some subset of the four canonical ways to describe a model (below).
3. A Continue button (`###` with no heading) before `### Exercise 1`. Students must hit Continue to advance — they should not see Exercise 1 on the same screen as the preamble.

**Four ways to describe a model.** Most Temperance preambles combine some subset of these four:

1. **Words.** *"We describe [outcome] as a [functional form] of [covariates]."* This is the same sentence added to the summary paragraph in §13.4 Exercise 16 and the canonical answer to the Courage model-structure question. Reuse verbatim — do not rewrite.
2. **R code.** The fitting call itself — e.g. `linear_reg(engine = "lm") |> fit(att_end ~ treatment, data = trains)` → `fit_att`. Rendered as a code block; not re-run in the preamble.
3. **Parameter table.** The estimated parameter values. *Easy:* rough `tidy(fit_<n>, conf.int = TRUE)` output. *Medium:* nicer table via `knitr::kable()`, `gt`, or equivalent. *Difficult:* close to publication quality. The Primer does not teach students to build these tables in Easy or Medium — the author ships them. In Difficult tutorials with few parameters, a student exercise using AI to produce the table is possible; in Difficult tutorials with many covariates or many-level categoricals, the table is too complex to hand to a student, and the author ships it.
4. **Concrete mathematical formula.** The fitted model in LaTeX with variable names and estimated coefficient values substituted in — the "true" DGM. This is the form the Temperance preamble uses for math. Never asked of students in Easy or Medium. Possibly asked (via AI) in Difficult tutorials with simple models; author-shipped otherwise.

**The Temperance preamble never shows the abstract mathematical structure.** That abstract form (the fifth form — $Y$, $X_1$, $\beta_0$, …) belongs to Justice, where the student is choosing a functional family (§13.3). By Temperance the parameter values exist; the concrete DGM is what's on the table. Showing abstract LaTeX here only teaches students to gloss past it.

**Concrete DGM rules.**

- Use the real variable names from the model, not $Y$ and $X_1$. Categorical predictors appear as the dummy variable names R produces — `sexMale`, `treatmentTreated`, `partyRepublican`. State explicitly in one sentence what each dummy encodes (which level is 1, which is 0) and what the intercept represents.
- Use `N(0, \sigma^2)` for the error term, **not** `\mathcal{N}(0, \sigma^2)`. `\mathcal{N}` renders as an empty box (□) in learnr's MathJax setup — we have hit this bug repeatedly.
- Parameter values in the math **must match the parameter table** to the same number of significant figures. If the table shows `161`, the math shows `161`, not `161.17778`. Three significant figures is the default.
- To keep the table and math in sync, round the table with `mutate(across(where(is.numeric), \(x) signif(x, 3)))` in the preamble chunk, then use those same rounded values in the LaTeX.

**We do not ask students to write LaTeX themselves.** The previous curriculum had exercises (old §13.3 Exercise 15, old §13.4 Exercise 11) asking students to prompt AI for LaTeX and paste it in. Those student-facing exercises are removed; the LaTeX is now shown to students, not produced by them. A small number of Difficult tutorials with simple models may keep a student-produced LaTeX exercise, but the heavy lifting is AI — the student is checking and pasting, not deriving.

**Parameter-interpretation approach (Exercises 2–4).** Start by showing the fitted DGM's parameter values and attempting to interpret them. This is relatively straightforward for simple linear models; harder for non-linear models and interaction terms; and essentially degenerate for models with no interpretable parameters (random forest, gradient boosting). Attempt the interpretation anyway when models are hard, if only to highlight how the linear-model intuition fails. When parameters genuinely aren't interpretable, keep one exercise whose purpose is to make sure the student understands *why* they aren't. Then move on: comparisons, predictions, and a final plot.

**Exercise 1.** [canonical] Components of Temperance.
- Prompt: *In your own words, describe the use of Temperance in data science.*
- Message: `"Temperance interprets the data generating mechanism and then uses it to answer, with the help of graphics, the question(s) with which we began. Humility reminds us that this answer is always false."`
- End: the Courage-handoff knowledge drop (§12.5).

**Exercises 2–4.** [per-tutorial, written-with-answer] Interpret the parameters.
- Prompt pattern: show the `tidy(conf.int = TRUE)` table, ask an interpretation question about one parameter or one comparison. At least three such questions. See the *Temperance example knowledge drops* in §12.5 for options to use as the End of each. In tutorials using models with no interpretable parameters (random forests), cut these.
- Message: per-tutorial; must be excellent. Numeric values quoted in the message (e.g. *"the intercept of 162"*) must match the rounded parameter table — same rule as the Temperance preamble.
- **Rounding:** the shown `tidy()` output must use the **same rounding** as the Temperance preamble's parameter table (default: `signif(3)`). Append `|> mutate(across(where(is.numeric), \(x) signif(x, 3)))` to the display chunk. A tutorial that shows 162.178 in one place and 162 in another is confusing; pick a rounding level once and apply it everywhere an author-shown parameter table appears.
- End: pick from the Temperance knowledge drops (non-treatment variables, dummy base values, confidence intervals excluding zero, same-data-different-assumptions, parameters-don't-mean-anything, "adjust" vs. "control," overlapping dummy intervals, numeric comparisons).

**Which model(s) to interpret.** Before picking *which parameters*, pick *which model's parameters*. Two kinds of interpretation happen in Temperance:

1. **Interpretation of the final DGM.** This is the most important thing and always happens — the final DGM is what Temperance is for. Every tutorial, every tier, includes interpretation exercises for the final fitted model.
2. **Interpretation of a simple, one-covariate model, used to fix ideas.** Before jumping to the final DGM, show a simple version of the model — typically a one-covariate linear (or logistic, etc.) fit — whose coefficients have the cleanest, most direct interpretation possible. The student interprets the simple model's coefficients in isolation, the canonical answer establishes the interpretation pattern, and *then* we move to the final DGM with that interpretation pattern already in hand. The adjustment clause, interaction language, and link-function scale complications are easier to reach for once the simple baseline is there.

**EMH rule for this split:**
- **Easy (Tutorials 06–10).** Do both. Simple model first (one covariate, outcome scale), then the final DGM. Easy tutorials have room for this two-step flow because their `marginaleffects` coverage is limited to `predictions()`, which leaves Temperance with time to spend on parameters.
- **Medium and Hard (Tutorials 11+).** Skip the simple-model step. Go straight to interpreting the final DGM. M/H tutorials pack in `comparisons()`, grid choices, and (for Hard) the explicit five-decisions framework (§1.3 *marginaleffects worked example*), which crowds out a second parameter-interpretation block. Students have seen the one-covariate interpretation pattern several times in Easy — by Tutorial 11 it does not need to be re-established.

In Courage, we have already fit *exactly the model we will interpret here*. For Easy tutorials, the simple-model-interpretation variant runs on a model that Courage has not shown — either a smaller fit Courage skipped past, or a one-covariate reduction of the final model. Either way, Temperance displays a `tidy()` table for that simple fit, asks for an interpretation of one of its coefficients, and then moves on.

**Interpretability ceiling by model family.** Not every model's parameters are equally interpretable. The student-facing interpretation work scales accordingly:

- **Linear models (continuous outcome, identity link).** Fully interpretable. Coefficients sit on the outcome scale — a β of 15.9 literally means "15.9 more centimeters of height." Student interpretation exercises are direct: "what does this coefficient mean?" This is the default setting for Easy tutorials, and the reason the simple-model step (§ above) lives in Easy — because there is a scale on which parameters cleanly mean things.

- **Non-linear link-function models (logistic, multinomial, cumulative, Poisson, etc.).** Partially interpretable. Coefficients sit on a link scale — log-odds, log-rate, cumulative logits — which is not the scale the question is asked on. A direct interpretation is possible ("a one-unit increase in X raises the log-odds of Y by β"), but it is not intuitive, and **we do not ask students to produce that interpretation as their answer**. Instead: the author **notes the link-scale interpretation once, in a knowledge drop**, so students see what it would look like; the interpretation *exercises* for these models focus elsewhere — on recognizing that the coefficients are not on the outcome scale, on identifying the reference category and the sign of β, on asking why the next step is `marginaleffects`. The real answer to "what does this model say?" happens in Exercises 5+ via `predictions()` and (from Medium onward) `comparisons()`, which bring results back to the outcome scale.

- **Non-parametric models (random forest, gradient boosting, neural nets).** Not interpretable at the parameter level. Don't show a parameter table; the object `fit_<n>` does not have meaningful coefficients to `tidy()`. **Skip Exercises 2–4 entirely** per §14.8, and replace with a single exercise whose only purpose is to make the student articulate *why* the parameters are not directly interpretable — no attempt at parameter interpretation at all, and no simple-model warm-up either. All the answering happens downstream via `marginaleffects`.

This ordering determines how much Temperance real-estate the parameter block consumes. Easy linear-model tutorials get the full simple-then-final two-step flow. Easy logistic/multinomial tutorials (if any — 06 is logistic) still use the simple-model warm-up, but the final-DGM interpretation is a knowledge drop, not an exercise. Non-parametric tutorials skip the block almost entirely.

**Which parameters to interpret: the three axes.** Once the model(s) are chosen, pick which parameters (or comparisons) to interpret — three exercises total across both kinds of model in Easy, three on the final DGM in Medium/Hard. The choice depends on three axes. (Shorthand: **EMH** = Easy / Medium / Hard, what §1.3 previously called Easy / Medium / Difficult. Going forward, prefer *EMH* and *Hard*; the word *Difficult* elsewhere in this file is the same tier.)

1. **Variable type.** Three cases come up:
   - **Binary** (2-level categorical, typically dummy-coded by R as `variableLevelName`). Interpretation language: *"A [Level=1] recruit has X more [outcome] than a [Level=0] recruit."* Plus the adjustment clause if there are other covariates.
   - **Multinomial** (3+ levels). Each non-reference level becomes its own dummy, interpreted *relative to the reference category* — which by default is the first level alphabetically (or the first factor level if set by hand). Interpretation language: *"Compared to [reference level], a [Other Level=1] unit has X more [outcome] than a [reference] unit."* Whenever a multinomial variable's coefficient is interpreted, state the reference level explicitly; students confuse it otherwise.
   - **Continuous.** One-unit-change language: *"For every one-unit increase in [X], [outcome] increases by β."* When the variable's natural unit is not 1 (e.g. a year's worth of income change may make no practical sense), either rescale before fitting or name a meaningful comparison in the interpretation (*"an additional decade of education is associated with X more dollars of income"*).
2. **Variable role.** A variable is either a standard **covariate** or (in causal models only) a **treatment**.
   - For **covariates**, use associational language: *"is associated with," "connected with," "differ by,"* comparisons *between groups* — no *cause*, *effect*, *impact*, *influence*. See the non-treatment-variables knowledge drop (§12.5).
   - For **treatments**, use causal language: *"causal effect of X on Y," "the effect of [treatment]."* In any causal tutorial, try to make **at least one of the three interpretation exercises be about the treatment's coefficient** — the treatment is the variable the question is actually about, and interpreting its coefficient is what the model is for.
3. **Number of covariates.** Every interpretation must name the other covariates it is conditional on, if there are any.
   - **One covariate** (simple tutorials, typically early in the sequence): no adjustment clause needed. *"For every additional year of education, income increases by β."*
   - **Two or more covariates** (everything past the first few tutorials): every interpretation sentence ends with an adjustment clause — *"…adjusting for [list of other covariates]."* Use **adjust** in preference to **control**; see the adjust-vs-control knowledge drop (§12.5). Omitting the adjustment clause is the single most common student error on interpretation exercises, which is why our canonical `message` always includes it.

**EMH progression for this exercise block:**
- **Easy** (Tutorials 06–10). Mostly linear models with one or two covariates, binary or 3-level categorical. Interpretation is direct on the outcome scale: a coefficient = expected-value difference. Easy includes the simple-model warm-up before the final DGM (see *Which model(s) to interpret*). The adjustment clause appears from the moment a second covariate is introduced (~Tutorial 09). Logistic and multinomial cases do appear in Easy (06, 09) — for these, follow the non-linear rule above: direct link-scale interpretation is a knowledge drop, not a student exercise.
- **Medium** (Tutorials 11–12). More covariates, more variable types (continuous + categorical in the same model), interaction terms start appearing, link functions other than identity (logit, multinomial logit). Adjustment clauses are mandatory. Students are **not** asked to interpret link-scale coefficients; the author mentions the link-scale form in a knowledge drop, and the student exercises focus on recognizing the link scale, identifying reference categories, and handing off to `marginaleffects`. Interactions, when they appear on the outcome scale, force conditional interpretation — *"the effect of X depends on the value of Z."*
- **Hard** (Tutorials 13+). Everything from Medium plus: strong non-linearities, interactions the interpretation of which is not algebraically clean, link functions whose coefficients have no direct human reading (ordinal regression's threshold parameters, cumulative logits). Non-parametric models (random forests, gradient boosting) skip the parameter block entirely per §14.8. Where a parameter block remains, keep at least one exercise whose purpose is to make the student articulate *why* the parameters are opaque — the failure to interpret is the point, and it sets up the `marginaleffects` work that follows.

**Exercise 5.** [operational] Load `marginaleffects`.
- Prompt: *In the end, we don't really care about parameters. Parameters are imaginary, like unicorns. We care about answers to our questions. In the modern world, all parameters are nuisance parameters. Add `library(marginaleffects)` to the QMD. Place your cursor on that line. Use `Cmd/Ctrl + Enter`. CP/CR.*
- End: the humility knowledge drop (§12.5).

**Exercise 6.** [per-tutorial, written-with-answer] The specific question.
- Prompt: *What is the specific question we are trying to answer?*
- Message: per-tutorial. May match the Wisdom Exercise 10 question or differ.
- End: the data-science-projects-begin-with-decisions knowledge drop (§12.5).

**Exercise 7.** [per-tutorial, written-without-answer] Run `predictions()`.
- Prompt: *In the Console, run `predictions()` on `fit_<n>`. CP/CR.*
- End: the `predictions()` knowledge drop (§12.5), noting actual row count. Add a second sentence specific to what's interesting about this output.

**Exercise 8.** [per-tutorial, written-without-answer] Run `plot_predictions()` (first version).
- Prompt: *In the Console, run `plot_predictions()` on `fit_<n>` with [specific arguments]. CP/CR.*
- End: discuss the estimate and uncertainty the plot shows. Explain how to read the estimate and confidence interval from the plot.

Insert additional `plot_predictions()` exercises as needed — different arguments, options like `points`, or `draw = FALSE` to return a tibble. `plot_comparisons()` belongs here when the question calls for differences rather than level estimates (see §12.5).

**Exercise 9.** [per-tutorial, written-without-answer] Final `plot_predictions()` call.
- Prompt: the version whose output will be the basis for the final plot. CP/CR.
- End: comments on the key takeaways relative to the question.

**Exercise 10.** [per-tutorial, written-without-answer] `plot_predictions(..., draw = FALSE)`.
- Prompt: run the same call as above with `draw = FALSE`. CP/CR.
- End: *Because `plot_predictions()` returns a ggplot object, you can continue with ggplot commands like `labs()`. But it can be useful to see the underlying values in the tibble and build your own plot directly.*

**Exercise 11.** [per-tutorial, written-without-answer] Build a beautiful plot.
- Prompt: *Work with AI to create a beautiful plot starting from the output of `plot_predictions(..., draw = FALSE)`. Do this in your QMD (much easier than the Console). Title: key variables. Subtitle: important takeaway. Caption: data source. Axis labels: nice. This plot is not directly connected to your question — it answers lots of questions. Paste the plot code below.*
- End: show our plot and our code. Closing knowledge drop: the back-and-forth knowledge drop (§12.5).

**Exercise 12.** [operational] Finalize the plot chunk.
- Prompt: *Finalize the new graphics chunk in your QMD. `Cmd/Ctrl + Shift + K` to ensure it all works. At the Console, `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: the map-is-not-the-territory knowledge drop (§12.5).

**Exercise 13.** [per-tutorial, written-with-answer] Last sentence of the summary paragraph.
- Prompt: *Write the last sentence of your summary paragraph. It describes at least one Quantity of Interest and a measure of uncertainty. It is OK if this QoI differs from the one you began with. It is OK to discuss more than one QoI.*
- Message: per-tutorial.
- End: *Add a final sentence to your summary paragraph, but don't copy/paste our answer exactly. `Cmd/Ctrl + Shift + K`.*

**Exercise 14.** [per-tutorial, written-with-answer] Why the estimate might be wrong.
- Prompt: *Write a few sentences explaining why the estimates for the quantities of interest, and the uncertainty, might be wrong. Suggest alternative estimates and confidence interval if warranted.*
- Message: per-tutorial. *You might or might not suggest an alternate point estimate; I always adjust toward my subjective sense of a long-run average or zero. But you should always widen the confidence interval, since the assumptions of your model are always false.*
- End: the go-back-to-the-Preceptor-Table knowledge drop (§12.5).

**Exercise 15.** [operational] Reorder and render final QMD.
- Prompt: *Rearrange the material in your QMD so the order is graphic, then paragraph. The chunk that creates the fitted model must occur before the chunk that creates the graphic. You can keep or discard the math at your discretion. `Cmd/Ctrl + Shift + K`. At the Console, `tutorial.helpers::show_file("XX.qmd")`. CP/CR.*
- End: the published-version knowledge drop (§12.5).

**Exercise 16.** [operational] Publish to GitHub Pages.
- Prompt: *Publish your rendered QMD to GitHub Pages. In the Terminal (not the Console!), run `quarto publish gh-pages XX.qmd`. Copy/paste the resulting URL below.*
- End: *Commit/push everything.*

**Exercise 17.** [operational] Paste the repo URL.
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

For any tutorial-owned plot (EDA plots, a `gt` Preceptor Table, a quote-framed image), render the plot in a code chunk with no label, so the student sees the output but not the code. Plots should be competent — axis labels, a title, a subtitle that highlights the key takeaway, a caption naming the data source.

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

**Preambles do not describe what the virtue does.** That job belongs to the first exercise of each virtue section, which asks the student to describe the virtue's components using the canonical §11 wording (Wisdom begins with a question…; Justice concerns the Population Table…; Courage creates the data generating mechanism; Temperance interprets the DGM…). The preamble must not pre-empt this — no "In Wisdom we will build a Preceptor Table," no "Justice is the virtue of asking hard questions about the data," no "Temperance uses the model to answer the question." Those sentences take the work out of the student's mouth.

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

Predictive tutorials skip the unconfoundedness exercises (Justice 11 and 12). Models with no interpretable parameters (random forests, neural nets) skip the parameter-interpretation exercises (Temperance 2–4) — replace with a single exercise that ensures the student understands the parameters aren't directly interpretable. Non-linear link-function models (logistic, multinomial, cumulative, Poisson) *keep* Exercises 2–4 but redirect them away from asking students to interpret link-scale coefficients directly; see §13.5 *Interpretability ceiling by model family* for the rules.

Operational exercises can be abbreviated in later tutorials once students have done them a few times. The first time through, migrate as-is. By tutorial 10+, the `library(broom)` exercise (Justice 14) can be much shorter.

### 14.9 Rounding consistency for parameter tables

Every **author-shown** parameter table in a tutorial — the Temperance preamble's `tidy()` display, each of Temperance Exercises 2–4, the Courage preamble's parameter summary when present, the concrete DGM math — uses the **same rounding**. Default: `signif(3)`, applied via `|> mutate(across(where(is.numeric), \(x) signif(x, 3)))` appended to the `tidy()` pipeline. Numeric values that appear in exercise `message` text (the canonical answer) must match the rounded display — no "the intercept is 162.18" in the prose while the table shows 162, and no "the intercept is 162" in the prose while the table shows 162.18.

One rounding, one tutorial, everywhere the reader sees parameters. A student who compares their answer to ours should not get tripped up by mismatched digits.

The one exception is a **student-written code exercise** whose point is to teach `tidy()` itself (e.g. the Courage exercise where the student pipes into `tidy(conf.int = TRUE)` for the first time). There, the raw unrounded output is what `tidy()` actually produces; adding `signif()` would muddy the learning goal. After that one teaching exercise, every subsequent display of parameters uses the chosen rounding.

---

## 15. R tooling

The tutorial setup chunk (§5.2) loads the full package stack. For chapters, setup is simpler: load the packages, fit the model, move on.

**Packages loaded for rendering only** (not expected in student's Console): `learnr`, `tutorial.helpers`, `gt`.

**Packages students are expected to load themselves** (and appear in the setup chunk for the tutorial to work):
- `tidyverse` — always.
- `tidymodels` — for most models. Replace with `ordinal` or another package if that model framework doesn't fit.
- `broom` — for tidying model output. `broom.mixed` for mixed models.
- `marginaleffects` — for `predictions()`, `plot_predictions()`, `plot_comparisons()`.
- `easystats` — for `check_predictions()`. Not added to student QMDs; used interactively in the Console.

**Data package**: whichever one holds the tutorial's dataset (`primer.data` most of the time).

**Setup chunk must be cheap**. A model fit that takes more than a few seconds breaks the student's flow. Use a subset of the data if needed; fit the full model with `#| cache: true` in the tutorial body rather than in setup.

---

## 16. Open items

Things flagged but not yet resolved. Revisit when relevant.

- **Preambles for the non-Temperance virtue sections.** §5.5 defines the "preamble" as the content between a virtue section header and its first exercise. §13.5 fully specifies the Temperance preamble (transition + `marginaleffects` book link + four ways to describe the model + Easy-only abstract mathematical structure). The preambles for Introduction, Wisdom, Justice, Courage, and Summary are not yet specified — decide what each should always contain and add the specification to the corresponding §13.x subsection.

- **Curriculum learning goals — explicit specification.** Write down, in CLAUDE.md, what students should understand after completing all 14 tutorials. We need these goals explicit because the Easy / Medium / Difficult progressions (§1.3) are supposed to *build toward* them, and we cannot calibrate the progressions without knowing the targets. Candidate home: a new §1.4 or its own top-level section. Aim for 10–20 concrete things a student should be able to do, explain, or notice by the end of Tutorial 14. Current worked examples in §1.3 (representativeness, validity, stability, unconfoundedness, model checking) implicitly define a handful of these goals — enumerate them all.

- **Justice exercises for sampling and selection mechanism.** §11 now defines assignment, sampling, and selection mechanism as canonical concepts, and §12.3 has disambiguation knowledge drops. Still pending: adding explicit Justice exercises to the §13.3 master exercise list that ask students to name the sampling mechanism and the selection mechanism for the problem at hand, alongside the existing representativeness/stability/validity/unconfoundedness exercises.
- **The DGM randomness detail** — we defer discussion of the randomness in the DGM in Courage Exercise 11's knowledge drop. Decide in which tutorial this gets unwrapped.
- **AI tool article absorption** — `https://ppbds.github.io/tutorial.helpers/articles/ai.html` may have more AI-workflow specifics than §9 currently captures. Worth re-reading and absorbing the next time we touch §9.

---

## 17. Per-tutorial problem specifications

Key parameters for each of the 14 numbered tutorials in the `primer.tutorials` package. Use these entries to orient new authoring sessions: the dataset, the primary question, the model to fit, and the Preceptor Table and Population Table column structure. Tutorials marked **miscellaneous** have no full data-science exercise (no Preceptor Table, no model fit). All others are **example** tutorials.

Preceptor Table and Population Table columns are listed by spanner in order. Population Tables always have a leading `Source` column (not under any spanner) and a `Unit/Time` spanner with two columns. Preceptor Tables have no Time column — time is implicit. Causal models have a `Treatment` spanner separate from `Covariate(s)`. Potential outcome columns are named "Outcome if [treatment value]".

---

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

### 06 — Models

- **Type:** example
- **"Imagine":** You are the chair of the Democratic National Committee in early 2024 deciding where to devote time and money.
- **Dataset:** YouGov poll, 1,559 U.S. adult citizens, March 2024 (constructed inline as a tibble)
- **Outcome:** `biden` — binary support for Biden (Yes/No)
- **Treatment / Key covariate:** none (intercept-only model)
- **Question (QoI):** What proportion of all votes will be cast for Joe Biden in the 2024 election?
- **Model:** Logistic regression, intercept-only
- **Causal / Predictive:** Predictive
- **Student project:** `biden`
- **Data prep:** `tibble(biden = as.factor(c(rep("Yes", 655), rep("No", 904)))) |> slice_sample(prop = 1)` → `poll_data`
- **Final model:** `logistic_reg() |> fit(biden ~ 1, data = poll_data)` → `fit_biden`
- **Preceptor Table:** Unit (Voter) | Outcome (Biden Support)
- **Population Table:** Source | Unit/Time (Voter, Year) | Outcome (Biden Support)

---

### 07 — Two Parameters

- **Type:** example
- **"Imagine":** You are in charge of ordering uniforms for next year's Marine Corps bootcamp recruits.
- **Dataset:** NHANES (`primer.data`)
- **Outcome:** `height` (continuous, cm)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What is the average height of male and female USMC recruits?
- **Model:** Linear regression, one categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `height`
- **Data prep:** `nhanes |> filter(age >= 18 & age <= 27) |> select(height, sex) |> drop_na() |> slice_sample(n = 50)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(height ~ sex, data = x)` → `fit_height`
- **Preceptor Table:** Unit (Young Adult) | Outcome (Height cm) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Young Adult, Year) | Outcome (Height cm) | Covariate (Sex)

---

### 08 — Three Parameters: Causal

- **Type:** example
- **"Imagine":** You are a campaign manager for a Republican congressional candidate in Georgia who wants to increase anti-immigration sentiment among voters.
- **Dataset:** `trains` (Enos 2014), Boston commuters, 2012 (`primer.data`)
- **Outcome:** `att_end` — immigration attitude after experiment (integer, 3–15)
- **Treatment / Key covariate:** `treatment` — exposure to Spanish-speakers on train platform (randomized)
- **Question (QoI):** What is the average causal effect of exposure to Spanish-speakers on attitudes toward immigration?
- **Model:** Linear regression, randomized experiment
- **Causal / Predictive:** Causal
- **Student project:** `immigration`
- **Data prep:** none — uses `trains` directly
- **Final model:** `linear_reg(engine = "lm") |> fit(att_end ~ treatment, data = trains)` → `fit_att`
- **Preceptor Table:** Unit (Person) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)
- **Population Table:** Source | Unit/Time (Person, Year) | Potential Outcomes (Attitude if Exposed, Attitude if Not Exposed) | Treatment (Spanish Exposure)

---

### 09 — Four Parameters: Categorical

- **Type:** example
- **"Imagine":** You are a political scientist studying the 1992 presidential election, curious whether men and women differed in their support for Clinton, Bush, and Perot. There are many decisions to make.
- **Dataset:** NES (`primer.data`), 1992 presidential election
- **Outcome:** `pres_vote` — vote choice (Clinton / Bush / Perot)
- **Treatment / Key covariate:** `sex` (Male/Female)
- **Question (QoI):** What was the difference in voting preference of men and women in the 1992 US Presidential election?
- **Model:** Multinomial logistic regression
- **Causal / Predictive:** Predictive
- **Student project:** `election-1992`
- **Data prep:** `nes |> filter(year == 1992) |> select(sex, pres_vote) |> drop_na() |> mutate(pres_vote = as.factor(case_when(pres_vote == "Democrat" ~ "Clinton", pres_vote == "Republican" ~ "Bush", pres_vote == "Third Party" ~ "Perot")))` → `nes_92`
- **Final model:** `multinom_reg(engine = "nnet") |> fit(pres_vote ~ sex, data = nes_92)` → `fit_nes`
- **Preceptor Table:** Unit (Voter) | Outcome (Vote) | Covariate (Sex)
- **Population Table:** Source | Unit/Time (Voter, Year) | Outcome (Vote) | Covariate (Sex)

---

### 10 — Five Parameters

- **Type:** example
- **"Imagine":** You are considering a run for governor and wonder how long you are likely to live afterward.
- **Dataset:** `governors` (Barfort et al. 2020) (`primer.data`)
- **Outcome:** `lived_after` — years lived after election (continuous)
- **Treatment / Key covariate:** `election_age`, `sex` (with interaction)
- **Question (QoI):** How many years do gubernatorial candidates live after their election, and how does that vary by age and sex?
- **Model:** Linear regression with interaction term (`election_age * sex`)
- **Causal / Predictive:** Predictive
- **Student project:** `life-expectancy`
- **Data prep:** `governors |> filter(year > 1945) |> select(last_name, year, state, sex, lived_after, election_age, region)` → `x`
- **Final model:** `linear_reg(engine = "lm") |> fit(lived_after ~ election_age*sex, data = x)` → `fit_years`
- **Preceptor Table:** Unit (Candidate) | Outcome (Years Lived After) | Covariates (Age at Election, Sex)
- **Population Table:** Source | Unit/Time (Candidate, Year) | Outcome (Years Lived After) | Covariates (Age at Election, Sex)

---

### 11 — N Parameters

- **Type:** example
- **"Imagine":** You are running for Governor of Texas and must decide how to allocate campaign resources.
- **Dataset:** `shaming` (Gerber, Green, Larimer 2008) (`primer.data`)
- **Outcome:** `primary_06` — voted in 2006 primary (binary)
- **Treatment / Key covariate:** `treatment` — social-pressure mailing type (randomized)
- **Question (QoI):** What is the causal effect of social-pressure postcards on voter turnout?
- **Model:** Logistic regression with interaction (`treatment * voter_class`)
- **Causal / Predictive:** Causal
- **Student project:** `postcards`
- **Data prep:** `shaming |> mutate(civ_engage = primary_00 + primary_02 + primary_04 + general_00 + general_02 + general_04) |> select(primary_06, treatment, sex, age, civ_engage) |> mutate(voter_class = factor(case_when(civ_engage %in% c(5, 6) ~ "Always Vote", civ_engage %in% c(3, 4) ~ "Sometimes Vote", civ_engage %in% c(1, 2) ~ "Rarely Vote"), levels = c("Rarely Vote", "Sometimes Vote", "Always Vote"))) |> mutate(voted = as.factor(primary_06))` → `x`
- **Final model:** `logistic_reg(engine = "glm") |> fit(voted ~ age + sex + treatment*voter_class, data = x)` → `fit_vote`
- **Preceptor Table:** Unit (Voter) | Potential Outcomes (Voted if Postcard, Voted if No Postcard) | Treatment (Mailing Type)
- **Population Table:** Source | Unit/Time (Voter, Year) | Potential Outcomes (Voted if Postcard, Voted if No Postcard) | Treatment (Mailing Type)

---

### 12 — Cumulative

- **Type:** example
- **"Imagine":** You are a pollster preparing for an upcoming election, exploring 2020 Trump approval patterns across ideology and education levels.
- **Dataset:** `ces` (Cooperative Election Study) (`primer.data`), 2020
- **Outcome:** `approval` — presidential approval (ordinal, 5 categories)
- **Treatment / Key covariate:** `ideology` (Very Liberal … Very Conservative)
- **Question (QoI):** What is the average difference in Trump approval between Very Liberal and Very Conservative voters?
- **Model:** Ordinal logistic regression (`MASS::polr`)
- **Causal / Predictive:** Predictive
- **Student project:** `approval`
- **Data prep:** `ces |> filter(year == 2020) |> select(approval, ideology, education) |> drop_na() |> filter(!ideology %in% "Not Sure") |> mutate(ideology = fct_drop(ideology))` → `x`
- **Final model:** `polr(approval ~ ideology + education, data = x)` → `fit_approval`
- **Preceptor Table:** Unit (Respondent) | Outcome (Presidential Approval) | Covariate (Political Ideology)
- **Population Table:** Source | Unit/Time (Respondent, Year) | Outcome (Presidential Approval) | Covariate (Political Ideology)

---

### 13 — Ordered Factors

- **Type:** example
- **"Imagine":** You are a data scientist at a non-profit helping students find the best college.
- **Dataset:** `colleges` (`primer.data`), ~900 U.S. colleges/universities (DOE IPEDS 2013)
- **Outcome:** `grad_rate` — graduation rate (continuous, 0–1)
- **Treatment / Key covariate:** `tuition` (continuous)
- **Question (QoI):** What effect does the tuition of a college have on its graduation rate?
- **Model:** Linear regression with ordinal categorical predictor
- **Causal / Predictive:** Predictive
- **Student project:** `ordered`
- **Data prep:** `colleges |> select(tuition, grad_rate, selectivity) |> filter(tuition > 2)` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(grad_rate ~ tuition + selectivity, data = x)` → `fit_colleges`
- **Preceptor Table:** Unit (College) | Outcome (Graduation Rate) | Covariate (Tuition)
- **Population Table:** Source | Unit/Time (College, Year) | Outcome (Graduation Rate) | Covariate (Tuition)

---

### 14 — Stops

- **Type:** example
- **"Imagine":** You are a member of your city's police department who wants to ensure race doesn't unfairly affect arrest chances during traffic stops.
- **Dataset:** `stops` (Open Policing Project) (`primer.data`), New Orleans, July 2011–July 2018
- **Outcome:** `arrested` — arrest during stop (binary)
- **Treatment / Key covariate:** `race` (Black/White), `sex`, `zone`
- **Question (QoI):** What is the difference in arrest rate between Black and White drivers, adjusting for sex and zone?
- **Model:** Linear regression (`arrested ~ sex + race*zone`); logistic regression also demonstrated
- **Causal / Predictive:** Predictive
- **Student project:** `stops`
- **Data prep:** `stops |> filter(race %in% c("black", "white")) |> mutate(race = str_to_title(race), sex = str_to_title(sex))` → `x`
- **Final model:** `linear_reg() |> set_engine("lm") |> fit(arrested ~ sex + race*zone, data = x)` → `fit_stops`
- **Preceptor Table:** Unit (Traffic Stop) | Outcome (Arrested) | Covariates (Race, Sex, Zone)
- **Population Table:** Source | Unit/Time (Traffic Stop, Year) | Outcome (Arrested) | Covariates (Race, Sex, Zone)
