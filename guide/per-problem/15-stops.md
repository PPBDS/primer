> Seed spec — §17 of the Primer authoring guide. To author this tutorial, read the index `../../CLAUDE.md`, the shared rules in `../authoring.md` + `../exercise-list.md`, and this file.

### 15 — TODO  *(Position 11, Hard predictive — non-parametric / random forest — GAP)*

- **Type:** example *(to be authored)*
- **Renderings:** chapter planned · tutorial planned · class exercise —
- **Status:** **Gap.** Non-parametric predictive tutorial does not exist.
- **Target:** Random forest or gradient-boosted model on a predictive question where the outcome-scale prediction matters more than parameter interpretation. Per §13.5 *Interpretability ceiling by model family*, the parameter-interpretation block is cut entirely — replace with a single exercise whose purpose is to articulate *why* the model's parameters aren't interpretable, then hand off to `marginaleffects::predictions()` / `plot_predictions()` for all question-answering.
- **Constraint:** Must be predictive and Hard (§1.5). The current `stops` tutorial (formerly `14-stops`) is a natural candidate to recast — `arrested ~ race + sex + zone + …` on the Open Policing data benefits from non-linearity and interactions a linear model can't capture well — but we should evaluate whether `stops` is the best home for the curriculum's first RF tutorial vs. a cleaner dataset.
- **Candidates to evaluate:** recast `stops` (Open Policing arrests); a Kaggle-style dataset with strong non-linearities; `colleges` refit with an RF if we've removed colleges from position 3 (we haven't — position 3 keeps `colleges` at Easy tier).

---

### Note: `15-stops` pending RF recast

The tutorial at `inst/tutorials/15-stops/` currently fits a linear regression of `arrested ~ sex + race*zone` on the Open Policing data and frames the question as predictive — content that predates the move to position 11 / target tutorial 15. Under §1.5, position 11 is the non-parametric predictive slot, so this tutorial's content must be recast to random forest (or equivalent). The directory has been renamed already; the content rewrite is the outstanding work.

The Open Policing data is well-suited to RF — non-linearities between race, zone, and arrest probability are exactly the kind of interaction a linear model mishandles — so the recast is the default unless a cleaner RF-candidate dataset appears during authoring. The alternative is to drop `15-stops` entirely and start fresh on a different dataset.
