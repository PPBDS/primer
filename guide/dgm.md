# Primer authoring guide — The Data Generating Mechanism (§18)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file.

---

## 18. What the dgm* tutorials should teach

This section records the target understanding for the four `dgm-*` tutorials in [PPBDS/primer.tutorials](https://github.com/PPBDS/primer.tutorials) (`dgm-linear`, `dgm-logistic`, `dgm-multinomial`, `dgm-ordered`). Two essays, recorded verbatim, are the answer to: *what should a student believe about the DGM, tidymodels, and marginaleffects after finishing these tutorials?* §18.1 covers building the DGM (Structure → Method → Fitting, via tidymodels); §18.2 covers using it to answer questions (Question → Units → Answer, via marginaleffects). When revisiting or drafting a dgm* tutorial, check its exercises and knowledge drops against this guidance (see the open item in [`open-items.md`](open-items.md)).

### 18.1 Essay 1: The Data Generating Mechanism (verbatim)

#### The Data Generating Mechanism

Imagine you find a spreadsheet on a park bench. It has 1,000 rows, one per student. Each row records whether the student received tutoring in algebra and how the student did on an end-of-year algebra test. What can you do with it?

The honest answer is: almost nothing — not until you know where the data came from. Which students are these? How did they end up in a tutoring program, or not? Who administered the test, and are any students missing from the spreadsheet entirely? The spreadsheet is silent on all of these questions, yet the answers determine what conclusions you can draw.

Data scientists have a name for the thing the spreadsheet is silent about: the data generating mechanism, or DGM. The data generating mechanism is the process — in the real world, with all its messiness — that produced the numbers you see. It is the answer to the question: *How did this data come to be?*

#### Data is a shadow of a process

Here is the central idea. The data you have is never the thing you care about. The data is a shadow cast by some underlying process, and it is the process you actually want to understand.

Suppose the question behind our spreadsheet is whether tutoring helps students learn algebra. The test results are the data. But the mechanism includes much more: how students decided to sign up (maybe the most motivated ones joined), how the test was administered, which results got recorded, and the underlying reality of how much algebra each student knows. One useful way to think about a DGM is as a story with random parts: "Each student has some true skill. Motivated students are more likely to enroll. Tutoring raises skill by some amount — possibly zero. A test result reflects true skill plus random noise."

We cannot observe the mechanism directly, so we build a model of it — a formal, mathematical guess about the process that cast the shadow. Building that guess involves three steps, and none of them has anything to do with software.

First, **propose a structure**. What kind of outcome does the mechanism produce? The distribution of your outcome variable determines the structure of the DGM. A mechanism that produces numerical test scores is a fundamentally different machine from one that produces pass/fail results, which is different again from one that produces a choice among categories. Before anything else, you must commit to what kind of machine you believe you are studying.

Second, **choose a method** for learning about the mechanism from data. Will you seek the single version of your proposed machine that best fits the data? Or will you keep an entire collection of plausible versions, each weighted by how consistent it is with what you observed? The structure of your story is the same either way; this step is about your philosophy of estimation.

Third, **fit the DGM**. Your proposed structure is really a whole family of machines — regressions with every conceivable slope and intercept. Fitting means estimating the parameters: using the data to work out which settings of the machine are most plausible. Only once the parameters are estimated do you have a usable DGM — one you can use to predict new observations or to ask what would happen if you changed one part of the mechanism.

**Structure → Method → Fitting.** That three-word chain is the discipline of the whole enterprise.

#### Building a DGM in R

The tidymodels collection of packages in R turns these three steps into three commands, in the same order.

Step one becomes the **model function**. If the outcome column in our spreadsheet records a numerical score — 0 to 100 — we begin with `linear_reg()`, proposing that scores are centered on a value that rises or falls with tutoring, plus random noise. If instead it records pass or fail, the very same substantive question demands a different machine: `logistic_reg()`, proposing that tutoring shifts the probability of passing. These are the two workhorses, but they belong to a larger family: several unordered categories — which math course each student chose next — call for `multinom_reg()`, while ordered categories — a letter grade from F up through A — call for `ordinal_reg()`. The function you call announces the structure you chose in step one.

Step two becomes **`set_engine()`**. Writing `set_engine("lm")` asks R's classical least-squares machinery for the single best-fitting version of your mechanism. Writing `set_engine("stan")` asks for a Bayesian fit, which returns a whole distribution of plausible versions. This is exactly the estimation-philosophy decision from step two, made concrete — and tidymodels keeps it separate from the structure on purpose, because the DGM (the truth out there) and our procedure for estimating it (the tool in here) are separate things.

Step three becomes **`fit()`**. You hand `fit()` a formula — `score ~ tutoring` — and the data, and the engine estimates the parameters: the numerical settings of your proposed mechanism that best explain the shadow you found on the park bench. The output of `fit()` is your fitted DGM, the object every later question — every prediction, every what-if — will be addressed to.

#### Why beginners should care

Three habits follow from taking the DGM seriously. First, before you type `linear_reg()` or anything else, write down the story of how your data came to be. Second, when you fit a model, say out loud what mechanism it assumes, and ask whether that assumption is plausible. Third, when you state a conclusion, ask whether a different, equally plausible mechanism could have produced the same data. If it could, your conclusion is weaker than it looks.

Return one last time to the park bench. Suppose the fitted model shows tutored students scoring ten points higher. Should the school district fund tutoring for everyone? Only reasoning about the mechanism can say. If motivated students both enrolled in tutoring and would have scored higher regardless, part of that ten points — perhaps all of it — belongs to motivation, not tutoring. No `fit()` on the spreadsheet alone can rescue you from a misunderstood mechanism.

#### The takeaway

Data does not speak for itself. Every dataset is the output of a machine — part nature, part human decisions, part chance — and the machine, not the output, is what we are really studying. Learning data science means learning to reason backward from the numbers you can see to the mechanism you can't. Tidymodels gives us the ritual: **Structure → Method → Fitting.** But start every analysis by asking the beginner's most powerful question: *How did this data come to be?*

### 18.2 Essay 2: Using the DGM to Answer Questions (verbatim)

#### Using the DGM to Answer Questions

Return to the spreadsheet from the park bench: 1,000 students, their tutoring status, and their algebra test scores. Suppose we have done everything the last essay described. We proposed a structure, chose a method, and fit the model: Structure → Method → Fitting. We now possess a fitted data generating mechanism.

Here is the surprise. The fitted DGM is not the answer to anything. Nobody ever asked, "What are the parameters of a linear regression relating test scores to tutoring?" The questions people actually ask sound like this: What score should we expect for a student who gets tutoring? How much better would a particular student do with tutoring than without? The fitted DGM is not the destination. It is the machine we built so that we could answer questions like these. This essay is about how to run the machine.

#### Asking the machine, conceptually

Recall what a fitted DGM is: our best account of the process that generates test results. Once we believe, even provisionally, that we hold the machine that produced the data, we can do something remarkable. We can feed the machine students who do not exist and observe what it produces. Answering questions with a DGM always involves three conceptual moves.

First, **pose the question as a quantity**. Vague curiosity — "does tutoring help?" — must become a number the machine can produce. Two kinds of quantities cover most questions. A *prediction* asks the machine for the expected outcome of a specified unit: What score should we expect for a tutored student? A *comparison* asks the machine to run twice and report the difference: Take one student, send her through the machine with tutoring, send her through again without, and subtract. That difference — the gap between two hypothetical worlds — is what "the effect of tutoring" means, made precise.

Second, **specify the units**. A prediction is always a prediction for someone. Which someone? A single imaginary student? Every student in the original spreadsheet, one at a time? A grid of hypothetical students spanning the interesting cases? This choice is where your substantive question lives. "What should the district expect if all students were tutored?" and "what should we expect for this one struggling student?" are different questions, answered by running the machine on different units.

Third, **run the machine and summarize**. Feed the specified units into the fitted DGM and collect its outputs, along with their uncertainty — a good machine reports not just a number but how confident it is. A thousand outputs are rarely digestible as a table, so the summary is usually a picture: expected outcomes plotted across the units, or the tutored-versus-untutored gap displayed directly.

**Question → Units → Answer.** Notice that the fitted DGM never changes during any of this. Fitting happened once. Everything afterward is interrogation.

#### Asking the machine in R

The marginaleffects package turns these conceptual moves into commands. It is a large package; we need only three functions, and each one is the machine-running step made concrete.

**`predictions()`** runs the machine. Hand it your fitted model, and it returns the expected outcome for each unit you specify, with uncertainty attached. Ask for predictions for every row of the original spreadsheet and you get the machine's account of each real student. Ask for predictions on students who never existed — the whole point of having a mechanism rather than a mere dataset — and the machine obliges just as readily. The output is an ordinary data frame: units in the rows, the machine's answers alongside.

**`plot_predictions()`** draws the machine's answers. Rather than reading a thousand rows, we usually want to see how the expected outcome varies, and here a genuinely important choice appears: the `condition` argument versus the `by` argument. They correspond to the two ways of specifying units from the conceptual section. With `condition = "tutoring"`, the machine is run on imaginary students — one representative student per tutoring status, with any other variables held at typical values — and the plot shows conditional expectations for those hypothetical units. With `by = "tutoring"`, the machine is instead run on every real student in the spreadsheet, and the predictions are then averaged within the tutored and untutored groups. The first answers "what should we expect for a typical student in each world?"; the second answers "what does the machine expect, on average, across the students we actually have?" With one predictor the pictures look similar, but with more variables they can differ meaningfully, and knowing which question you are asking — a typical unit or an average over real units — is exactly the kind of thinking the DGM framework demands.

**`plot_comparisons()`** draws the difference between two worlds. Predictions answer "what should we expect?"; comparisons answer "what difference does tutoring make?" `plot_comparisons()` runs the machine twice for each unit — once with tutoring, once without — subtracts, and plots the gap along with its uncertainty. This is the counterfactual question made visible: not two groups of different students, but the same students imagined in two worlds. When someone asks what your model says about the effect of tutoring, this picture is the honest answer — a gap, and a band around the gap showing how sure the machine is.

Notice the division of labor. Tidymodels built the machine: Structure → Method → Fitting. Marginaleffects interrogates it: Question → Units → Answer. Keeping the two stages separate in your mind prevents the most common beginner confusion, which is treating the fitted model's printed output as if it were the answer to your question. It almost never is. The answer comes from running the machine.

#### A caution about two worlds

One warning belongs here. `plot_comparisons()` will happily draw the tutored-versus-untutored gap whether or not that gap deserves a causal interpretation. Whether the machine's implication matches reality depends on the story from the first essay — how students ended up tutored in the first place. If motivated students selected into tutoring, the gap your machine draws mixes tutoring with motivation, and no function in any package can unmix them for you. The pictures are only as trustworthy as the mechanism behind them.

#### The takeaway

A fitted DGM is a machine for generating answers, and using it well means asking well. Pose your question as a quantity — a prediction or a comparison. Specify the units — real or imaginary — whose outcomes you care about. Then run the machine and draw the picture: `predictions()`, `plot_predictions()`, `plot_comparisons()`. The first essay ended with the beginner's most powerful question: *How did this data come to be?* This one ends with its natural sequel: *What does my DGM imply?*
