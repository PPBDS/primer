# Primer authoring guide — Chapter structure (§4)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.

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

**Every example chapter includes a discussion of quantity-of-interest variety.** Each tutorial picks one narrow QoI — usually an expected value (*"the average height of male and female USMC recruits"*). The chapter should spend a paragraph or two inside Temperance naming the *other* QoIs a real practitioner would care about and showing which ones the fitted DGM already answers versus which ones need more work. For the Recruits chapter the riff is: *average height is convenient but tells you nothing about the tallest recruit you need to fit (a max), or about how many small-vs-large uniforms to order (quantiles — the 10th and 90th, say), or about how tall the tallest recruit out of a specific batch of three will be (a distribution over sample statistics, which needs simulation).* The chapter names these candidate QoIs, sketches how to get at each from the same fitted DGM, and describes the simulation step — take the DGM, draw `n` synthetic units, record the statistic of interest, repeat many times, build a PDF — without necessarily teaching the full mechanics. The point is that **"average" is one question in a family of questions**, and the DGM answers the whole family once you know how to ask.

This topic is chapter-only at Easy and Medium tiers. Hard tutorials may surface it as a knowledge drop; see §12.6 Theme 5 for the progressive schedule.

Chapters also benefit from an EDA section richer than the tutorial's — chapter authors should include at least one plot per covariate plus one plot showing the outcome conditional on the key covariate, and a paragraph naming anything strange in the data (missingness patterns, outliers, coding quirks). Tutorials budget two EDA plots; chapters can run three to five without bloat.

**Chapters provide rich real-world background. Tutorials don't have time for; chapters do.** A central purpose of every example chapter is to give the reader *true factual depth* about the real-world problem and the data the chapter uses to answer it. Useful kinds of background include the history of the data source (when it began, who collects it, how it has evolved), the scale of the real-world problem (actual numbers --- how many recruits per year, how many voters in the dataset, how many households were eligible for the program), measurement procedures (how is height actually measured at enlistment? how does NHANES handle non-response? how does the postcard treatment get to a voter's door?), and demographic specifics (who is in the population, who is not). The chapter is where the reader gets to *know the problem and the data well enough to argue about it*.

This is not motivational fluff. **Do not write sentences like "most data science failures come from skipping this step" or "this matters because students learn best when they care."** That kind of writing assumes the reader needs convincing. The reader is reading the chapter; that's the convincing already. What the reader actually needs is *facts they don't already have* --- and what facts the chapter chooses to share should not be random. Background details should *connect to the Population Table assumptions discussion later* in Justice. If a chapter explains how NHANES heights are measured (precise stadiometer, examiner-administered, shoes off), that fact can be picked up in Justice's validity discussion. If the chapter explains that USMC recruits are filtered by a fitness screen, that fact carries into Justice's representativeness discussion. The chapter's background section earns its keep when its details get *used* later --- when the reader can read the Justice section and recognize *"oh, this is why the chapter spent a paragraph on that earlier."*

Don't make things up. If you don't know an actual number, omit the fact rather than guess. Vague factual assertions ("most experts agree...", "research suggests...") have no place; if a fact is worth including it should be specific and verifiable.

**The chapter is self-contained for the student. No meta-references.** A student reading the chapter should not encounter a sentence about the chapter's position in the curriculum (no *"this is the fourth example chapter"*), no mention of which EMH tier the chapter belongs to (no *"the first Medium-tier predictive chapter"*), no mention of the matching tutorial (no *"the matching tutorial is 08-seguro-popular in the primer.tutorials package; almost every line of code in that tutorial appears here"*), and no discussion of how tutorials relate to chapters as a workflow. The categories defined in this guide --- example vs. misc, predictive vs. causal pairing, EMH tiers, the tutorial-first authoring flow --- are *author* categories. They stay out of the student-facing prose entirely.

From the *author's* point of view the relationship is in fact tutorial-first --- we write the tutorial, then build the chapter around it as a scaffold --- but that mechanic does not belong in the chapter the student reads. The opening paragraph should be about the *problem* the chapter takes on (the dataset, the question, the real-world stakes), not about the chapter's place in a meta-curriculum. A student should be able to read any single chapter on its own, understand everything in it, and never open the matching tutorial; the chapter has to earn its keep at that bar.

This rule is easy to violate accidentally when an author is "warming up" to the real opening. A useful sanity check: if the opening paragraph contains the words *chapter*, *tutorial*, *Easy*, *Medium*, *Hard*, *primary*, *paired*, *predictive*, or *causal* in a sentence describing the chapter itself (rather than describing the problem the chapter is about), the paragraph is probably about the wrong subject. Cut it; rewrite about the dataset, the question, or the real-world stakes.

### 4.1 Lessons to mention at least once

Some pedagogical points are best made *once*, in a single chapter where the context fits, rather than repeated everywhere or hammered uniformly across the curriculum. (Compare §1.6, which catalogs commitments we *say often* in fresh wording each time.) This subsection collects them. The list is a working inventory; add entries as they come up during chapter writing. The point is not to teach every lesson everywhere; some lessons are best made once and well.

| # | Lesson | Suggested tier | Brief gist |
|---|---|---|---|
| 1 | **Average vs. expected value** | Medium | The *average* (e.g. of next year's recruit heights) is a real physical fact about the world: line up the units and measure them, and you have a number. The *expected value* is a property of the model --- what the model says we should expect the average to be. The two are not the same. The average is the target the question asks about; the expected value is our model-based estimate of it, with uncertainty. The Easy chapters use precise language (don't say "expected" when you mean "average," or vice versa); the Medium chapter that elects to host this lesson should make the distinction explicit and explain why the gap matters. |

When a one-off pedagogical point surfaces during chapter writing --- something worth saying once but not worth repeating --- add it here with a tier suggestion. Each entry should fit on a single table row; if the lesson needs a paragraph of context, link out to where it lives in full.

---

