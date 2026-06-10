# Primer authoring guide — Canonical definitions & knowledge-drop library (§11, §12)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.

---

## 11. Canonical definitions

**Ground truth has moved.** Canonical definitions used to live here. They now live in the `Key Concepts` book chapter (`book/key-concepts.qmd`), which is the single source of truth for every definition the project uses. CLAUDE.md is no longer authoritative for the wording; when you author a tutorial or chapter, the Key Concepts entry is what gets the final word, and any older wording cached anywhere else (older drafts, prior tutorials, this file's own §1.3 worked examples, anywhere) is superseded.

The wordings below are mirrored from Key Concepts as a *convenience copy* for authoring sessions that don't want to open the book chapter. **Treat them as a snapshot, not as the truth** — if they ever drift from `key-concepts.qmd`, the chapter wins. When you change a definition, change it in `key-concepts.qmd` first, then update the snapshot here.

The §1.3 worked examples elsewhere in this file no longer carry the *definitional* content of staged definitions (representativeness, validity, stability, unconfoundedness, justice). That content has moved to Key Concepts under each definition's *Where this comes from* subsection, with content-named labels (e.g. "Single-link frame", "Outcome-only scope", "Stability and time") rather than the EMH-tier labels the worked examples use here. What remains in §1.3 is the *tier-routing rule*: which version a given tutorial-tier should use when. CLAUDE.md owns *which version to use when*; Key Concepts owns *what each version says*.

Use the wording below verbatim as the `message` text in written-answer exercises that ask for a definition. Use the same wording (or a close paraphrase) in chapter prose.

**Exception — staged definitions.** Five terms — *Justice*, *validity*, *stability*, *representativeness*, and *unconfoundedness* — have **staged simpler-frame versions** for early-tier tutorials. The canonical (final) wording is the one below; the simpler-frame wordings live in [`key-concepts.qmd`](../book/key-concepts.qmd) under each term's *Where this comes from* subsection (see also the *A note on staged definitions* preface at the top of that chapter). §1.3 in this file owns the **tier-routing rule** — which version a given tutorial-tier should use. When you write a yes-answer `message =` for one of these terms in an early-tier tutorial, the staged simpler-frame wording is correct; the rule is *verbatim against the tier-appropriate canonical*, not *verbatim against the final canonical*. The 03 (Rubin Causal Model) and 04 (Cardinal Virtues) tutorials, for example, use the simpler-frame *Justice* (*"Justice reviews the Population Table and selects the formula for the data generating mechanism."*) as their `message =` text — that is correct, not a drift.

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

**Knowledge drops are *thematic templates*, not verbatim text.** Each drop below names a theme — *"stability is about time"*, *"parameters are imaginary"*, *"covariates are used in three different ways"* — and gives a sample wording. **Tutorials should rephrase the drop in fresh language**, even when reusing the same theme across tutorials at the same tier. Students who read tutorial 5, then 6, then 7 and find the same paragraph pasted three times stop reading; if the wording is fresh each time, the theme registers more strongly because the student has to re-parse it. The canonical answer text inside `question_text(message = ...)` *is* fixed verbatim — that's the answer key — but the End drops that follow are author-rephrased. Aim for the same theme, different sentences.

Knowledge drops are deliberately short. Students won't read more than two sentences.

**Reduce repetition across tutorials.** A common authoring failure is to use identical knowledge drops in every tutorial — the same paragraph about predictive-vs-causal language, say, pasted verbatim each time. Students notice, and stop reading. The fix is **progressive themes**: pick a recurring concept and plan a ladder of knowledge drops that deepen across the curriculum, each appearance building on the previous one rather than restating it. §12.6 below catalogs the surviving themes (predictive-models-have-no-treatments, language discipline, expected-values-vs-other-QoIs) and their progressions. When drafting a tutorial, consult §12.6 for which level each recurring drop should use, rather than reaching for the same wording each time.

### 12.1 Introduction

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
> *Just because something exists in the tutorial (or in the QMD) does not mean that it is in your R Terminal. You should be aware of what exists in R World, which is generally called your "workspace."*

**On easystats.**
> *`check_predictions()` comes from the [easystats ecosystem](https://easystats.github.io/easystats/), which has a variety of interesting functions and packages worth exploring. We add `library(easystats)` to the setup chunk so the check renders in the document like the rest of the analysis.*

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
> *Data science often involves back-and-forth work. First, make a single chunk of code — say, a new plot — work well. This requires interactive work between the QMD and the R Terminal. Second, ensure that the entire QMD runs correctly on its own.*

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

**Theme 1: QMD World vs R World.** *Retired from the Primer.* This is generic infrastructure pedagogy, and per the base guide's knowledge-drop rule such drops live **only** in `vscode.tutorials`, never in a normal tutorial. (The number is kept so existing `Theme N` cross-references stay valid.)

**Theme 2: `library(tidyverse)` and package ecosystems.** *Retired from the Primer.* Also generic infrastructure pedagogy — `vscode.tutorials`-only, per the base guide's knowledge-drop rule. (Number kept for stable cross-references.)

**Theme 3: "Predictive models have no treatments."** Attached to §13.1 Exercise 13's End (the predictive-only "which variable has an important connection to the outcome" question). Appears only in predictive tutorials (positions 1, 3, 5, 7, 9, 11 — tutorials 05, 07, 09, 11, 13, 15); causal tutorials skip this exercise entirely. At E and M the drop is reused verbatim — students see the framing often enough to cement it, and it's the canonical answer to "why didn't we use the word treatment here." At H the drop deepens: the causal/predictive distinction is a commitment by the analyst, not a property of the data or model, and the sophistication level grows to match.

| Level | Where it appears | Focus |
|---|---|---|
| L1 | Easy/Medium predictive tutorials (06, 08, 10, 12), verbatim | *With a predictive model, each individual unit has only one observed outcome. Predictive models have no "treatments" — only covariates.* |
| L2 | Hard predictive, first appearance (13 CES) | A predictive model doesn't deny causation; it takes no position on it. The same linear-regression code fits a predictive model or a causal one — what differs is the question you ask and the assumptions you're willing to defend. When the analyst refuses to call any covariate a "treatment," the result is a predictive model. |
| L3 | Hard predictive, last appearance (15 Stops recast) | The predictive/causal distinction is a commitment by the analyst, not a property of the data or the model. Rubin's potential-outcomes framework formalized this distinction roughly fifty years ago; earlier statisticians treated "association" and "causation" as fuzzier ideas. Modern practice demands that you declare your framing upfront, because the same coefficient can be interpreted very differently depending on which framing you adopt. |

**Theme 4: Language discipline in predictive models.** Attached to §13.1 Exercise 14's End (the predictive-only "two groups that might differ" question). Appears only in predictive tutorials. Paired pedagogically with Theme 3 (which frames *what* a predictive model is); this theme drills *how to talk about it*. At E and M the drop is verbatim — language habits form through repetition. At H the drop deepens toward *when* causal language is actually appropriate (truly causal models) and the broader cultural problem of correlation-being-reported-as-causation.

| Level | Where it appears | Focus |
|---|---|---|
| L1 | Easy/Medium predictive tutorials (06, 08, 10, 12), verbatim | *In predictive models, do not use "cause," "influence," "impact," or anything else which suggests causation. The best phrasing is in terms of "differences" between groups of units with different values for a covariate of interest.* |
| L2 | Hard predictive, first appearance (13 CES) | The language rule is not pedantry. Phrases like "X causes Y" or "raising X will raise Y" smuggle causal assumptions into a predictive model, and those assumptions are almost always unjustified. Resist the pull of the active voice ("exercise reduces weight") toward the comparative frame ("groups that exercise more tend to weigh less"). When news stories use causal language to describe what a study actually measured predictively, that is a reporting bug, not a translation choice. |
| L3 | Hard predictive, last appearance (15 Stops recast) | Language constrains inference. Almost every data-science claim you will meet in the wild — policy memos, news summaries, executive dashboards — uses causal language to describe relationships that were only measured predictively. Refusing to participate in that conflation is a discipline. It is also, occasionally, *over-correction*: in a truly causal model — randomized experiment, cleanly identified quasi-experiment — causal language is not just permitted, it is required. The rule is not "always hedge" but "match your language to your identification strategy." |

**Theme 5: Expected values vs. other quantities of interest.** Attached to a late-Temperance exercise or knowledge drop, typically around the "alternative-estimates / why-might-we-be-wrong" step. This topic is **chapter-primary** (every example chapter includes a paragraph or two on it, per §4) and only optionally surfaces in tutorials — never at E or M, and only at H as a compressed knowledge drop pointing at what the chapter expands on.

The core observation: a tutorial's QoI is almost always an expected value (*"the average height of male and female USMC recruits"*), but the fitted DGM can answer a whole family of questions — max, min, quantiles, distribution of a sample statistic. Many of those require simulation: draw synthetic units from the DGM, compute the statistic, repeat, build a PDF.

| Level | Where it appears | Focus |
|---|---|---|
| L1 | Hard tutorials, first appearance (13 CES or 14 Governors) | Average is one question in a family. The fitted DGM also answers max, min, and quantiles — a logistics officer ordering uniforms needs the 90th percentile more than the mean. See the matching chapter for how to ask these questions from the same fit. |
| L2 | Hard tutorials, later appearance | Some QoIs — the expected height of the tallest recruit in the next batch of three, for instance — aren't functions of a single parameter. They require simulation from the DGM: draw three synthetic units, take the max, record it, repeat 1,000 times. The resulting distribution is your posterior on the question you actually cared about. |
| L3 | Hard tutorials, capstone (16 Kenya) | The DGM is a simulator. Once you have one, any question that can be posed as "draw units, compute statistic, summarize" has an answer — even questions with no closed form. This is what makes the Rubin framing powerful: expected values are a convenient special case, but the whole family of questions reduces to *draw from the DGM and count*. |

Chapters get more room for this topic than tutorials can afford, and should include concrete simulation code (not just prose) where feasible.

**Structural note.** Themes can require rearranging which exercise a knowledge drop attaches to. When two themes would naturally land on the same exercise, split them so each gets its own place to breathe — put one on that exercise and the next on the exercise immediately after.

---

