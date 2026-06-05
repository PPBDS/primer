# Primer authoring guide — Open items (§16)

> A part of the Primer authoring guide. Start at the index — [`CLAUDE.md`](../CLAUDE.md) — which maps each `§` to its file. **Section numbers are unchanged**, so every `§N.M` cross-reference in the guide still resolves via that map.

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

