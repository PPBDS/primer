# Primer authoring guide — Master exercise list (§13)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.
>
> **These exercises sit on top of the base tutorial guide ([`tutorials/CLAUDE.md` in PPBDS/ai-rules](https://github.com/PPBDS/ai-rules/blob/main/claude-md/tutorials/CLAUDE.md))** — its canonical question shape, `echo = TRUE` answers, knowledge-drop rules, and evidence conventions apply throughout unless a Primer override says otherwise.

---

## 13. Master exercise list

This is the ordered list of exercises that make up an example tutorial. Each exercise is tagged:

- **[canonical]** — use the wording and `message` text below verbatim. These are the spaced-repetition backbone.
- **[per-tutorial]** — the question frame is fixed; the author writes a problem-specific prompt and/or `message`.
- **[operational]** — a workflow instruction (creating files, rendering, CP/CR). Always a written-without-answer exercise. These are migrated from the template as-is.

Within a section, keep exercises in the order given. Not every tutorial includes every exercise — the schedule depends on spaced repetition (§8) and on whether the problem is causal or predictive. Some exercises (e.g., unconfoundedness questions) are skipped entirely for predictive tutorials.

**Pre-flight before drafting a tutorial.** The tier is fixed by the tutorial number per §1.5: **05–08 Easy, 09–12 Medium, 13–16 Hard**. Do not guess — read the number and use it. Then look up the tutorial's content spec in §17. Some exercises are **tier-dependent** — they are written here in their Medium form but must be dropped, replaced, or extended depending on tier. Tier-dependent exercises are flagged inline with a `**Tier:**` line; read it before including them. Current tier-dependent items:

- **Model checking** (§13.4 Exercises 11–12 in the three-fit pattern): skipped in the first two example tutorials (positions 1–2, target tutorials 05 Recruits and 06 Trains); replaced by an author-rendered side-by-side outcome/fitted-value plot in the remaining Easy tutorials (positions 3–4, target tutorials 07 Colleges and 08 Seguro Popular); Medium form (`check_predictions()`) in positions 5–8 (target tutorials 09–12); Hard form (posterior-predictive-check terminology + model revision driven by the check) in positions 9–10 (target tutorials 13–14); omitted entirely for positions 11–12 per §14.8 (random forests skip parameter and fit-diagnostic blocks in favor of `marginaleffects`-native outputs). Full progression in §1.3 *Worked example: model checking across three levels*.
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
| 5 | 09 Smokes | Medium-P | Wisdom, Justice |
| 6 | 10 Shaming | Medium-C | Courage, Temperance |
| 7 | 11 NES | Medium-P | Wisdom, Courage |
| 8 | 12 Mail | Medium-C | Justice, Temperance |
| 9 | 13 CES | Hard-P | Temperance |
| 10 | 14 Governors | Hard-C | Wisdom |
| 11 | 15 Stops/RF | Hard-P | Justice |
| 12 | 16 Kenya | Hard-C (last) | **all four** |

Each canonical definition is asked exactly twice across the four Medium tutorials and exactly once across Hard positions 9–11, then again at position 12. The schedule is a suggestion; adjacent tutorials should not repeat the same pair, and the author can rotate differently if it reads better. In every virtue-section preamble, include a *"Remember that …"* reminder for any canonical definition that is not asked at Ex 1 in that tutorial.

If a tutorial is being drafted without a pre-flight tier check, the default is Medium — and Medium wording *will be wrong* for every Easy tutorial (target tutorials 05–08, positions 1–4) and every Hard tutorial (target tutorials 13–16, positions 9–12). The pre-flight is cheap; skipping it is how model-checking exercises ended up in the Recruits tutorial (position 1, Easy) before we caught the mistake.

### 13.1 Introduction

**The Introduction preamble always has exactly three paragraphs, in this order:**

1. **Citation paragraph.** *"This tutorial supports [*Preceptor's Primer for Bayesian Data Science: Using the Cardinal Virtues for Inference*](https://ppbds.github.io/primer/) by [David Kane](https://davidkane.info/)."* Verbatim in every tutorial.
2. **Bookend sentence.** *"The world confronts us. Make decisions we must."* Verbatim. This sentence appears at both ends of every tutorial — it also closes the Temperance section (§13.5 Exercise 17 End).
3. **"Imagine that you are …" paragraph.** One paragraph motivating the problem with a real person facing real decisions. Always starts with *"Imagine that you are …"* and always ends with *"There are many decisions to make."* The exact wording is per-tutorial and comes from the `**"Imagine":**` field of the §17 seed entry. The same paragraph is reused verbatim in the Wisdom preamble (§13.2). The **matching chapter** may use the same paragraph as the tutorial, or an expanded version up to roughly twice as long --- the chapter has more room than the tutorial does and can afford to name additional decisions, additional questions the analyst might investigate for the boss, or more real-world context. The chapter and tutorial Imagine paragraphs share the same opening sentence, the same protagonist, and the same *"There are many decisions to make."* closer; the chapter's middle can carry more weight.

**The closing line ("There are many decisions to make") has to be earned.** It is in every Imagine paragraph; for it to land, the body of the paragraph must actually establish the multiplicity it claims. The recipe:

- **The protagonist has a boss with big-picture goals, not specific data-science requests.** A campaign manager's boss is the candidate, who wants to *win the election*. A public-health analyst's boss is the Minister, who wants to *improve health outcomes*. The boss does not ask for "a causal estimate of treatment X on outcome Y" --- they don't think in those terms, and most of them would not recognize the phrase. They have a goal and a budget; they trust the analyst to find evidence that helps.
- **The boss has many real-world *decisions* to make in service of that goal.** Name two or three concrete decisions in the paragraph: how many uniforms to purchase, from which vendors, in which sizes; which voters to target with which messaging; which programs to fund and which to cut; etc. The decisions are operational, not statistical --- the boss is choosing what to *do*, not what to *model*. This is the multiplicity the closing line refers to. **Do not say "many models would help"** --- that conflates "decisions the boss makes" with "models the analyst builds," and the word *models* is technical jargon that students at this point in the curriculum cannot yet ground. Talk about decisions.
- **The analyst, in turn, may have several *questions* she wants to answer in service of those decisions.** When this works, write each question as a sentence the analyst would actually speak to the boss --- normal English, ending in a question mark. For Seguro Popular: *"Does enrollment in SP change household spending on health care, and if so, by how much?"*, *"Does enrollment increase or decrease hospital usage?"*, *"What is the causal effect of SP enrollment on mortality?"* All three are concrete, askable in a meeting with the Minister, and grounded entirely in real-world quantities. **Do not enumerate "models"** in this slot either: *"Several models would help: how enrollment changes household spending, hospital usage, mortality, debt."* fails for the same reason as the decisions version --- *models* is jargon, and the analyst would not phrase it that way to the Minister. The test for any sentence in this slot is: *would the analyst say this out loud in the boss's office?* If not, rewrite. Decisions and questions are companion forms of multiplicity; a paragraph may name both, or one, or just decisions --- whichever reads naturally.
- **The analyst's job is to produce *estimates* that help with those decisions.** Estimates of facts: average heights, the probability a postcard moves turnout, the expected effect of a policy. Each artifact (tutorial or chapter) picks *one such estimate* and produces it carefully. The artifact's narrow focus is in service of the boss's broad agenda.
- **Name the one estimate the artifact produces, with its uncertainty.** *"This tutorial focuses on \[one estimate\]: \[specific QoI\], with its associated uncertainty."* (For a chapter: *"This chapter focuses on..."*) The word *uncertainty* is non-negotiable --- a number without a confidence interval is half an answer.
- **The estimate is an input to the decision, not the decision.** Say so directly. *"The estimate alone won't decide anything, but it is one good input."* This earns the closing line without overclaiming.

A good Imagine paragraph reads like a sketch of a real person doing a real job, with a boss who has goals, decisions to make, and a budget that doesn't stretch to all of them. A bad Imagine paragraph reads like a homework prompt that names a topic and a question. See §5.4 for the section-header formatting convention that determines where `###` Continue buttons sit around the preamble; the three paragraphs above run directly into `### Exercise 1` with no trailing `###` between them.

**First three tutorials: chapter highlights instead of Imagine.** The Imagine paragraph above is for tutorials built around a real data-science problem — the example tutorials (05+). The first three tutorials (01 Probability, 02 Sampling, 03 Rubin Causal Model) have no decision-maker to imagine, so they **replace paragraph 3 with a short paragraph of highlights from the companion chapter** (students often don't read it). Paragraphs 1 (citation) and 2 (bookend) are unchanged. Tutorial 04 (Cardinal Virtues) **does** use an Imagine paragraph — the high-school-principal scenario — so the highlights treatment applies to tutorials 01–03 only; 04 onward use Imagine. The migrated `02-sampling` tutorial is the worked example of the highlights paragraph.

**Pacing across the EMH tiers.** The Introduction is mostly operational — repo setup, adding libraries to the QMD, turning off code echo, rendering, and a first look at the data in the QMD. The exercise list below is pitched at **Medium** pace: concise, one operational step per exercise, assuming the student has been through this workflow once before. The pace changes with tier:

- **Easy** (positions 1–4, tutorials 05–08). Slower. Expand each operational exercise with more explanatory prose *before* the step — what a `.gitignore` does and why we need one; what `echo: false` does to the rendered document and why we care. Split a long exercise into two or three short ones if the student would otherwise have to track multiple unfamiliar steps at once. Knowledge drops still obey the base guide's rule — a key chapter point, a note about the data, or a comment on what the render just showed — not a generic lesson on the mechanics. Students at this stage have never done this before — silence is not a feature.
- **Medium** (positions 5–8, tutorials 09–12). Current pace. The exercise list below is calibrated here: one step per exercise, minimal lead-in prose, concepts assumed.
- **Hard** (positions 9–12, tutorials 13–16). Faster. Collapse sequences of related operational exercises into a single exercise (e.g. "add libraries, turn off echo, and commit the QMD — paste the result"). Drop explanatory knowledge drops that at Easy and Medium we kept for their own sake. Students at this stage have been through the setup six or more times and do not need it re-explained; keep the operational scaffold, but shrink it.

This progression applies to every Introduction exercise below unless the exercise is explicitly flagged otherwise.

**Exercise 1.** [canonical] Four Cardinal Virtues.
- Prompt: *What are the four [Cardinal Virtues](https://en.wikipedia.org/wiki/Cardinal_virtues), in order, which we use to guide our data science work?*
- Message: `"Wisdom, Justice, Courage, and Temperance."`
- End: a key point from the Cardinal Virtues chapter (per the base guide's KD rule). *(The former generic "spaced repetition" drop is retired.)*
- **Sequencing guard.** This question presupposes the student has reached the **Cardinal Virtues** chapter/tutorial (04). Every example tutorial (05–16) follows 04, so all of them include it. But **no tutorial before 04 may ask any Cardinal Virtues question, and none before 03 may ask any Rubin Causal Model question** — the misc tutorials 01 (Probability) and 02 (Sampling) in particular must not, and 03 (Rubin) introduces the RCM rather than quizzing it. This is the Primer's instance of the base guide's general rule, *Don't quiz concepts the student hasn't reached*: a tutorial never quizzes a concept the curriculum introduces in a later chapter.

**Exercise 2.** [operational] Confirm working repo and set up the QMD.
- **Do not name a specific environment** — no Codespaces, no `codespace-starter` template. Per the base guide's standard repo line, *"create one and connect to it"* covers both cloud and local; these tutorials can be done either way. Environment specifics live in the `primer.tutorials` README, not in the tutorial text.
- Prompt (the base guide's verbatim standard repo line, then the rest): *You should be connected to a repo named `XX`. If you are not, create one and connect to it. Create a new Quarto document titled `"XX"` (Title Case) with yourself as the author, save it as `analysis.qmd`, render it, and open `analysis.html` with Live Server so the rendered HTML auto-refreshes on every later render. Create a `.gitignore` file with `analysis_files` on the first line followed by a blank line. Commit and push. Use AI however you like. In the R Terminal, run `show_file(".gitignore")`. If that fails, it is probably because you have not yet loaded `library(tutorial.helpers)` in the R Terminal.*

  *CP/CR.*
- This is Exercise 2 only because Exercise 1 is the (no-AI) Cardinal Virtues question; it is the **first exercise that does anything**, so it carries the one-time *"Use AI however you like."* note. No later exercise repeats it (base guide, *Writing student prompts to AI*).
- The prompt does **not** spell out the IDE-specific mechanics for creating a new Quarto document — no "File → New File → ..." menu path, no mention of a specific pane or button. Assume students know how to create a new document.
- The QMD's filename is `analysis.qmd` by default in all tutorials; its document **title** is the Title-Case topic (e.g. `"Sampling"`).
- CP/CR is **not** explained — students know it from `vscode.tutorials` (base guide, *Submission evidence*).
- End: a key point from this tutorial's chapter, or a note about the data (per the base guide's KD rule). *(The former generic "work in the cloud / laptops fail" drop is retired.)*

**Exercise 3.** [operational] Add libraries and echo settings to QMD.
- Prompt: *In your QMD, put `library(tidyverse)` and `library(<data package>)` in a new code chunk. Render the file. Notice that the file does not look good because the code is visible and there are messages. Add `#| message: false` to remove the messages in this setup chunk. Also add the following to the YAML header to remove all code echos from the HTML:*
  ```
  execute:
    echo: false
  ```
- *In the R Terminal, run `show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: *Render again. Everything looks nice, albeit empty, because we have added code to make the file look better and more professional.*

**Exercise 4.** [operational] First look at the data.
- Prompt: *Add a code chunk to `analysis.qmd` that prints the `<tibble>` (just `<tibble>` on its own line). Render, and copy the first few rows from the rendered HTML below.*
- End: a note about the data (base guide KD rule, "the data") — what it is, its units of observation, and where it came from.

**Exercise 5.** [operational] Glimpse the columns.
- Prompt: *Add a chunk that runs `glimpse(<tibble>)` — on a column group of ≤ ~15 columns if the data is wide. Render, and copy the output from the HTML.*
- End: a note on what the column types and a few spot-checked values reveal — something worth noticing before we model.

**Exercise 6.** [operational] Summarize the key column(s).
- Prompt: *Add a chunk that runs `summary()` on the outcome and the most important covariate(s). Render, and copy the output.*
- End: a note on the scale, range, or placeholder/missing values the summary exposes — which begins to set up the question Wisdom will ask.

*(These three orient the student to the data, all in the QMD per the base guide's* Structural exploration *— no R Terminal. For a well-known built-in dataset they can be compressed per the tier pacing above. They replace the retired R-Terminal library-load and `?help` exercises; libraries now live only in the QMD setup chunk, added in Exercise 3.)*

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
- **Easy** (positions 1–4, tutorials 05–08). Use the full block. Causal tutorials do Ex 10, 11, 12, 15. Predictive tutorials do Ex 13, 14, 15. These questions do overlap somewhat with Wisdom — that is fine at Easy; the repetition reinforces the framing at the point in the tutorial where students most need it.
- **Medium** (positions 5–8, tutorials 09–12). One setup question plus the question-statement. Causal tutorials do only Ex 12 (compute a unit-level causal effect) and Ex 15. Predictive tutorials do only Ex 14 (two groups that might differ) and Ex 15. The Rubin Causal Model and associational-language knowledge drops are compressed into the End of the single retained setup question; Wisdom does the heavier framing at this tier.
- **Hard** (positions 9–12, tutorials 13–16). Drop Ex 10–14 entirely. Only Ex 15 (state the question) remains. The Introduction is considerably shorter at Hard — which is right, because students at this stage have rehearsed the framing many times and need to get to Wisdom.

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
2. **The specific question** in one line, labeled verbatim: *"The specific question: <the question>"* (e.g. *"The specific question: What is the average height of male and female USMC recruits?"*). This is the canonical answer to Intro Exercise 15 — the question the student just stated at the end of Introduction. The Introduction narrows from a broad topic (the "Imagine" paragraph) to this specific QoI; Wisdom starts from here. Do not relabel it "broad" — the topic is broad, the question is specific.
3. **One or two sentences naming the dataset.** The Introduction identifies the dataset; Wisdom is where we will explore it. Write as a plain statement — *"We will work from the NHANES survey (conducted by the CDC), available in the `nhanes` tibble of the `primer.data` package."* Do not make claims about what the data will show, and do not mention measurement or validity concerns — those come later.
4. A Continue button (`###` with no heading) before `### Exercise 1`.

The Imagine-paragraph repetition that used to live between the opening sentence and the specific question is **retired** — students have just read it three exercises earlier in the Introduction. Do not reuse it here.

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

- If the Intro plot is the outcome alone (05-recruits, 07-colleges), Wisdom's first EDA exercise asks for outcome × covariate.
- If the Intro plot is already outcome × covariate (06-trains shows `att_end` density colored by `treatment`), Wisdom's first EDA exercise asks for the *same data from a different angle* — a jitter of individual values with overlaid means, a boxplot, a scatter against a continuous covariate, a faceted view, etc.

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

- **No slice. Use all the data.** Default pattern: `select` the outcome and covariates, `drop_na`, type-coerce where needed, and stop.
  ```r
  x <- <raw_tibble> |>
    filter(<scoping>) |>
    select(<outcome>, <covariates>) |>
    drop_na()
  ```
  Per §1.2 *Use all the data*, this is the only default. `slice_sample()` does not belong in the setup chunk for tutorial-speed reasons --- linear and logistic fits on tens of thousands of rows are essentially instant, and the chapter's published estimate must be the *real* estimate, not a noisier slice. If a candidate model genuinely cannot fit on the full data in a reasonable time (Stan/brms posterior, or an unusually large tibble), flag the speed problem to the author for discussion; the resolution may be a pre-fit `.rds` (§5.6), a different model, or --- in the rare case where a slice is truly the answer --- an explicit slice the author has signed off on. Never quietly down-sample.

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
- End: *Read our answer. It will not be the same as yours. You can change your answer to incorporate some of our ideas, but do not copy/paste our answer exactly. Add your two sentences to your QMD and render.* (No commit here — see §14.4; the Primer commits after Justice and at the end.)

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
- Prompt: *A statistical model consists of two parts: the probability family and the link function. The probability family is the probability distribution which generates the randomness in our data. The link function is the mathematical formula which links our data to the unknown parameters. Add `library(tidymodels)` to the setup chunk in `analysis.qmd` and render. In the R Terminal, run `show_file("XX.qmd", chunk = "setup")`. CP/CR.*
- End: the probability family is determined by the outcome variable $Y$. Pick the relevant one:
  - Continuous → Normal: $Y \sim N(\mu, \sigma^2)$
  - Binary → Bernoulli: $Y \sim \text{Bernoulli}(\rho)$
  - Multi-category unordered → Multinomial
  - Multi-category ordered → Cumulative Logistic
  Full LaTeX for each lives in the template; migrate as needed.

**Exercise 14.** [operational] Add `library(broom)`.
- Prompt: *Add `library(broom)` to the setup chunk in `analysis.qmd` and render. In the R Terminal, run `show_file("XX.qmd", chunk = "setup")`. CP/CR.*
- In later tutorials, shrink the prompt verbiage.
- End: the link function depends on the outcome variable type. Pick the relevant functional form:
  - Continuous → linear: $\mu = \beta_0 + \beta_1 X_1 + \ldots$
  - Binary → log-odds: $\log[\rho / (1 - \rho)] = \beta_0 + \beta_1 X_1 + \ldots$
  - Multinomial → multinomial logistic (three-outcome form in template)
  - Ordinal → cumulative logistic (three-outcome form in template)

**Exercise 15.** [per-tutorial, written-with-answer] Add a weakness sentence to the summary.
- Prompt: *Write one sentence highlighting a potential weakness in your model. Derive it from possible problems with the assumptions above. We will add this to our summary paragraph. So far our version of the summary paragraph looks like this:* (paste our first two sentences). *Your version will be somewhat different.*
- Message: per-tutorial.
- End: *Add a weakness sentence to the summary paragraph in your QMD. You can modify your paragraph, but don't copy/paste our answer exactly. Render, then commit/push.* (This is the after-Justice commit — see §14.4.)

### 13.4 Courage

**Preamble (between `## Courage` header and Exercise 1).** Per the self-containment principle in §5.5, the Courage preamble revisits the two outputs from earlier virtues that Courage needs. Per §14.6, it does not describe what Courage does — Exercise 1 does that. *Exception:* when Exercise 1 is skipped in this tutorial (per the rotation in the §13 pre-flight list), add the canonical definition to this preamble as a reminder — *"Remember that Courage creates the data generating mechanism."* The reminder replaces the exercise. Contents, in order:

**Opening sentence, verbatim:** *"Justice gives us the Population Table and the abstract data generating mechanism."* Single sentence, no additional transitional prose. The two objects that follow stand on their own; no "Recall the…" or "And the abstract form…" labels between them.

1. **The Population Table from Justice**, rendered via the §10.4 `gt` pipeline. Shown immediately after the opening sentence, with no intervening label.
2. **The abstract mathematical form of the DGM** — the functional family chosen at the end of Justice (Normal / Bernoulli / multinomial / cumulative). Pull the block from §13.7. Use plain `N(0, \sigma^2)` for the error term, not `\mathcal{N}` (§13.5, same learnr MathJax bug applies here). **The abstract form must use an open-ended series with ellipsis** (e.g. `$\beta_0 + \beta_1 X_1 + \beta_2 X_2 + \cdots + \beta_n X_n + \epsilon$`), never a closed form pinned to the final model's covariate count. At the end of Justice we have decided the mathematical *structure* but not the number (or identity) of covariates; the math needs to reflect that. The concrete DGM in the Temperance preamble (§13.5) is the opposite: every term written out, no ellipsis, with the estimated coefficient values substituted in.
3. A Continue button (`###` with no heading) before `### Exercise 1`.

The "generic variables / Justice decided the family not the covariates" knowledge drop does **not** belong in the preamble — it's too much text after the math. Put it in Exercise 1's End instead (§13.4 Exercise 1).

Parts 1 and 2 are deliberately repetitive with Justice — they show the same Population Table and the same abstract math that Justice's last exercise produced. That is the point: a reader who skipped Justice can still start Courage, and a reader who didn't gets a useful refresher. See §5.5.

**Abstract-math block moves here.** The author-shown abstract mathematical structure that used to live at the end of Justice (§13.3 Exercise 15 in the original draft) now lives in the Courage preamble only — one place, not two.

**Model-checking staging.** Exercises 11 and 12 below (add `easystats` to the setup chunk, run `check_predictions()` in a QMD chunk) are **Medium-tier** as written. In **Easy-tier** tutorials, replace them with a single exercise that shows an author-produced side-by-side plot of outcome distribution vs. fitted-value distribution (no student code; bare `###` Continue button per §6.5) — or in the first two example tutorials, omit model checking entirely. In **Difficult-tier** tutorials, add a follow-up exercise that uses the check to drive a model revision and then re-runs the check on the improved model. The full progression is in §1.3 (Worked example: model checking across three levels).

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

**Exercise 9.** [per-tutorial] Confirm the fitted model.
- Prompt: *The final model from the previous exercise lives in a code chunk in your `analysis.qmd`, assigned to `fit_<n>`. Render and confirm it is there.*
- End: the code-being-primary knowledge drop (§12.4).

**Exercise 10.** *(Removed — obsolete under the `analysis.qmd` model.)* The old step brought `fit_<n>` into the R Terminal so interactive checks could run; now the fit lives in a QMD chunk and the checks below (`check_predictions()`, `tidy()`) run in QMD chunks too. The number is kept so later `§13.4 Exercise N` cross-references resolve; skip this slot when authoring.

**Exercise 11.** [operational] Add easystats to the setup chunk.
- **Tier:** Medium only. **Omit entirely** in positions 1–2 (target tutorials 05 Recruits, 06 Trains). In the remaining Easy positions 3–4 (target tutorials 07 Colleges, 08 Seguro Popular), replace both Exercises 11 and 12 with a single author-rendered side-by-side plot of outcome distribution vs. fitted-value distribution — the student views it and hits Continue (a bare `###`, no question chunk per §6.5); no package loaded, no terminology introduced. In Hard positions 9–10 (target tutorials 13 CES, 14 Governors), keep Exercises 11–12 and add a follow-up exercise that uses the check to drive a model revision. In Hard positions 11–12 (random forest tutorials), drop the model-checking block entirely per §14.8. Full progression in §1.3 *Worked example: model checking across three levels*.
- Prompt: *Add `library([easystats](https://easystats.github.io/easystats/))` to the setup chunk in `analysis.qmd` and render — we need it for `check_predictions()` in the next exercise, which runs in the QMD. In the R Terminal, run `show_file("XX.qmd", chunk = "setup")`. CP/CR.*
- End: a key chapter point on *why* we check the model — a good DGM should generate data that looks like the real data; the next exercise makes that comparison.

**Exercise 12.** [operational] Run `check_predictions()` in the QMD.
- **Tier:** Medium only. See Exercise 11's tier note above — same rules.
- Prompt: *Add a chunk (with `#| echo: false`) that runs `check_predictions(extract_fit_engine(fit_<n>))`. Render, and look at the comparison plot in `analysis.html`. Describe in one sentence what you see.*
- End: the `check_predictions()` knowledge drop (§12.4). Add a sentence noting whether the simulated data looks like the actual data for this problem.

**Exercise 13.** [author-shown block in Easy and Medium; optional student exercise in Difficult tutorials with simple models only] Concrete LaTeX DGM.
- **Tier:** Easy and Medium → author-shipped (no student exercise). Difficult with simple models → may be a student exercise (AI-assisted). Difficult with complex models → author-shipped. Never purely abstract LaTeX at this position — that form lives in the Courage preamble only.
- **Default (Easy, Medium, and Difficult tutorials with many parameters):** author-shipped. Render the fitted model in LaTeX with variable names and estimated coefficient values substituted in — the concrete DGM. Apply §14.13 conventions (`\widehat{\text{Outcome Name}}` rather than `\hat{\text{var\_name}}`; `\begin{aligned}` to wrap formulas with more than ~3 RHS terms). Include the hat-and-error-term knowledge drop (§12.4) followed by: *This is our data generating mechanism.* Then the DGM-being-a-formula knowledge drop (§12.4). Use a bare `###` Continue button after the formula (no fake `question_text()` per §6.5).
- **Difficult tutorials with simple models** (few coefficients, no many-level categoricals) may optionally include a student-produced version: the student prompts AI for the LaTeX and pastes it into their QMD. Even here, the heavy lifting is AI; the student is checking and pasting, not deriving.
- The concrete LaTeX DGM is also referenced in the §13.5 Temperance preamble as the fourth way to describe a model.

**Exercise 14.** [operational] Cache the fit in the QMD.
- Prompt: *Create a new code chunk in your QMD. Add the chunk option `#| cache: true`. Put the R code for the final model into the chunk, assigning the result to `fit_<n>`. (This includes `fit()` but not `tidy()`.) Render with `quarto render analysis.qmd`. Rendering may be slow the first time but is cached thereafter. In the R Terminal, run `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: the caching knowledge drop (§12.4). *To confirm, render again. It should be quick.*

**Exercise 15.** [operational] Add `*_cache` to `.gitignore`.
- Prompt: *Add `*_cache` to `.gitignore`. Cached objects are often large and don't belong on GitHub. In the R Terminal, run `tutorial.helpers::show_file(".gitignore")`. CP/CR.*
- End: *Because of the change in your `.gitignore` (assuming you saved it), the cache directory should not appear in the Source Control panel because Git is ignoring it.* (No commit here; the final commit at the end of the tutorial folds in this `.gitignore` change — see §14.4.)

**Exercise 16.** [per-tutorial, code] Run `tidy(fit_<n>, conf.int = TRUE)`.
- Prompt: *Add a chunk that runs `tidy()` on `fit_<n>` with `conf.int = TRUE` — this returns 95% intervals for all the parameters of the final model. Render, and copy the output from the HTML.*
- End: the `broom` knowledge drop (§12.4).

**Exercise 17.** [per-tutorial, written-without-answer] Make a nice table from `tidy()`.
- Prompt: *Create a new code chunk in your QMD that makes a nice-looking table from the tibble returned by `tidy()`. You don't need all the columns — estimate and confidence intervals is typical. You may need to load [tinytable](https://vincentarelbundock.github.io/tinytable/), [knitr](https://yihui.org/knitr/), [gt](https://gt.rstudio.com/), [kableExtra](https://haozhu233.github.io/kableExtra/), [flextable](https://davidgohel.github.io/flextable/), or [modelsummary](https://modelsummary.com/) in the setup chunk. Render, and copy the table from the HTML.*
- End: show our table and our code. Closing knowledge drop: *At the very least, your table should include a title and a caption with the data source. The more you use AI, the better you will get at doing so.*

**Exercise 18.** [per-tutorial, written-with-answer] Model-structure sentence.
- Prompt: *Add a sentence to your project summary explaining the structure of the model. Something like: "I/we model XX [concept of outcome, not variable name] as a [normally distributed / Bernoulli / multinomial / ordinal] variable which is a [linear/logistic/multinomial/ordinal] function of XX [and maybe other covariates]." Name the outcome's distributional family before the functional-form clause — Justice's choice of probability family is part of the model, not just the link function. Recall the beginning of our summary: [paste what we suggested at the end of Justice].*
- Message: per-tutorial.
- End: *Read our answer. Do not copy/paste exactly. Add your two sentences to the summary paragraph. Render.* (No commit here — see §14.4; the Primer commits after Justice and at the end.)

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
- **Easy** (positions 1–4, target tutorials 05–08). All linear models. The three-fit progression — binary or multi-level categorical (Fit A), the other categorical type or continuous (Fit B), final combined (Fit C) — is the curriculum's first place to practice interpretation across covariate types. The adjustment clause appears for the first time at Fit C's interpretation question.
- **Medium** (positions 5–8, target tutorials 09–12). First link functions (logit in Smokes at position 5, Shaming at position 6; multinomial in NES at position 7). Adjustment clauses are mandatory. Students are **not** asked to produce link-scale interpretations; the author notes the link-scale form once, and Courage's interpretation Ends focus on identifying reference categories, the sign of β, and why we need `marginaleffects`. Interactions, when they appear, force conditional interpretation — *"the effect of X depends on the value of Z."*
- **Hard** (positions 9–12, target tutorials 13–16). Cumulative logit (CES at position 9), RDD causal identification (Governors at position 10), and non-parametric models (random forests at positions 11 and 12). Non-parametric models replace the three-fit Courage block with a single "why parameters don't help" exercise per §14.8. Where the multi-fit block remains, keep at least one fit whose interpretation question requires the student to articulate *why* the parameter is opaque — the failure to interpret is itself the lesson, and it sets up the Temperance `marginaleffects` work that follows.

**Exercise 2.** [operational] Load `marginaleffects`.
- Prompt: *In the end, we don't really care about parameters. Parameters are imaginary, like unicorns. We care about answers to our questions. In the modern world, all parameters are nuisance parameters. Add `library(marginaleffects)` to the setup chunk in `analysis.qmd` and render. In the R Terminal, run `show_file("XX.qmd", chunk = "setup")`. CP/CR.*
- End: the humility knowledge drop (§12.5).

**Exercise 3.** [per-tutorial, written-with-answer] The specific question.
- Prompt: *What is the specific question we are trying to answer?*
- Message: per-tutorial. May match the Wisdom Exercise 10 question or differ.
- End: the data-science-projects-begin-with-decisions knowledge drop (§12.5).

**Exercise 4.** [per-tutorial, written-without-answer] Run `predictions()`.
- Prompt: *Add a chunk that runs `predictions()` on `fit_<n>`. Render, and copy the printed output from the rendered HTML.*
- End: the `predictions()` knowledge drop (§12.5), noting actual row count. Add a second sentence specific to what's interesting about this output.

**Exercise 5.** [per-tutorial, written-without-answer] Run `plot_predictions()` (first version).
- Prompt: *Add a chunk that runs `plot_predictions()` on `fit_<n>` with [specific arguments]. Render, and look at the plot in `analysis.html`.*
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
- Prompt: *In a chunk in your `analysis.qmd`, create a beautiful plot starting from the output of `plot_predictions(..., draw = FALSE)`. Title: key variables. Subtitle: important takeaway. Caption: data source. Axis labels: nice. This plot is not directly connected to your question — it answers lots of questions. Paste the plot code below.*
- End: show our plot and our code. Closing knowledge drop: the back-and-forth knowledge drop (§12.5).

**Exercise 9.** [operational] Finalize the plot chunk.
- Prompt: *Finalize the new graphics chunk in your QMD. Render with `quarto render analysis.qmd` to ensure it all works. In the R Terminal, run `tutorial.helpers::show_file("XX.qmd", chunk = "Last")`. CP/CR.*
- End: the map-is-not-the-territory knowledge drop (§12.5).

**Exercise 10.** [per-tutorial, written-with-answer] Last sentence of the summary paragraph.
- Prompt: *Write the last sentence of your summary paragraph. It describes at least one Quantity of Interest and a measure of uncertainty. It is OK if this QoI differs from the one you began with. It is OK to discuss more than one QoI.*
- Message: per-tutorial.
- End: *Add a final sentence to your summary paragraph, but don't copy/paste our answer exactly. Render.*

**Exercise 11.** [per-tutorial, written-with-answer] Why the estimate might be wrong.
- Prompt: *Write a few sentences explaining why the estimates for the quantities of interest, and the uncertainty, might be wrong. Suggest alternative estimates and confidence interval if warranted.*
- Message: per-tutorial. *You might or might not suggest an alternate point estimate; I always adjust toward my subjective sense of a long-run average or zero. But you should always widen the confidence interval, since the assumptions of your model are always false.*
- End: the go-back-to-the-Preceptor-Table knowledge drop (§12.5).

**Exercise 12.** [operational] Reorder and render final QMD.
- Prompt: *Rearrange the material in your QMD so the order is graphic, then paragraph. The chunk that creates the fitted model must occur before the chunk that creates the graphic. You can keep or discard the math at your discretion. Render with `quarto render analysis.qmd`. In the R Terminal, run `tutorial.helpers::show_file("XX.qmd")`. CP/CR.*
- End: the published-version knowledge drop (§12.5).

**Exercise 13.** [operational] Publish to GitHub Pages.
- Prompt: *Publish your rendered QMD to GitHub Pages. In the bash terminal (not the R Terminal!), run `quarto publish gh-pages XX.qmd`. Copy/paste the resulting URL below.*
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

