# Making the Preceptor Table → DGM → graph animation

**This folder is a self-contained toolkit.** It holds everything needed to build the narrated animation that shows the connection between a Preceptor Table, the DGM formula, and the final answer — and nothing else. Read this file, then run the script.

```
animations/
  animations.md                 this file — the design contract and the gotchas
  preceptor_to_graph_video.R    the build script; four renders from one file
  example-embed.qmd             a worked example of the finished embed
  .gitignore                    keeps generated video and audio out of the repo
```

Nothing here is generated output. The videos and the narration audio are **reproducible** — build them with:

```bash
BUILD_ANIMATIONS=true Rscript animations/preceptor_to_graph_video.R
```

That runs from any working directory (paths resolve against the script's own location) and writes four `.mp4`s plus a `narration/` cache into this folder, both gitignored.

## Requirements

| | |
|---|---|
| R packages | **gganimate**, **av**, **ggtext**, **tuneR**, plus the tidyverse |
| Narration | `edge-tts`, installed for the Python on `PATH` (`pip install edge-tts`) |

No external `ffmpeg` — **av** bundles the codecs and `av_renderer(audio =)` does the muxing. `check_deps()` runs before every render and fails with a message naming exactly what is missing. If `edge-tts` cannot be installed, `narrate = FALSE` builds silent videos with beat lengths estimated from character counts.

## What the animation is

A single uninterrupted narrated video, not two clips shown back to back. The claim being made is that the table and the graph are the same object at two moments, and cutting between two clips destroys exactly that claim.

Related Primer guidance, for authors working in this repo: [`guide/guidance.md`](../guide/guidance.md) §14.12 (visualization house style, which this deliberately overrides in one place), [`guide/tables.md`](../guide/tables.md) §10 (the real Preceptor Table this reconstructs), [`guide/dgm.md`](../guide/dgm.md) §18 (what a student should already believe about the DGM before watching).

## 1. Format and embedding

These run 42-98 seconds and **carry an audio track**, so `.mp4` is the only option — a gif cannot hold sound at all, and a gif of the easy version at this length would run to tens of MB against the mp4's 0.7-1.7 MB. (It also matches the existing `coin_plot_fancy.mp4` precedent.)

**Embedding differs from a gif and this matters in both artifacts.** `![](path.mp4)` does not work. Use a raw-HTML block, which renders in Quarto chapters and learnr tutorials alike:

````
```{=html}
<video controls preload="metadata" playsinline width="100%">
  <source src="<chapter-slug>/animations/preceptor_to_graph_easy.mp4" type="video/mp4">
</video>
```
````

**It must be a `{=html}` fenced *code block*, not a `::: {=html}` fenced *div*.** Pandoc's raw-attribute syntax applies to code blocks; a raw fenced div does not exist. The div form was in the original draft of this spec and is wrong — it fails quietly rather than erroring: Quarto emits a literal `<div class="{=html}">` wrapper, drops the closing fence into the page as visible `:::` text, and ends the raw HTML at the first bare text line, so a `</video>` can go missing. The page still "renders", which is exactly why it ships broken. Verified against Quarto in this repo, and it matches the working pattern already used in `03-rubin-causal-model.qmd`.

`controls` is not optional. A 95-second video with no scrub bar is worse than a gif — readers need to replay the error-draw beat.

**`loop` and `muted` were dropped when the narration landed, and must not come back.** They were right for a silent clip and are wrong now: `muted` starts the voiceover silenced, which is the whole feature off by default, and `loop` restarts a 95-second narrated explanation on top of itself the moment it ends. Prose before the embed should mention there is sound.

## 2. Where it lives, and where it goes in the chapter

The build script lives here; its four `.mp4`s get copied into the chapter that uses them, under `book/<slug>/animations/`, and into the matching `inst/tutorials/<id>/tutorial.Rmd` in [PPBDS/primer.tutorials](https://github.com/PPBDS/primer.tutorials). One script, two embed sites per video.

Because the video spans Courage material (the formula) and Temperance material (the predictive distribution), it goes **at the start of Temperance**, after the DGM has been fitted, with a back-reference to the Courage formula. It cannot sit in Courage: its last two acts answer a question Courage has not yet asked.

Prose immediately before the embed states what to watch for, e.g. *"Watch the error column. The formula is the same in every row; the error is redrawn each time, and that redraw is the entire reason the last act produces a spread rather than a single number."*

**No chapter uses this yet.** The worked example baked into the script is the Senators net-worth question from `guide/tables.md` §10.3, chosen because it is the simplest table in the guide — it is a *demonstration*, not any chapter's material. To adopt it for a real chapter: change the two `CONFIG` blocks at the top of the script and the sentences in `script_lines()` / `script_lines_causal()`. Nothing below those should need editing.

## 3. Two videos per chapter, not one

**Every example chapter carries a primary question and its paired opposite framing** (root `CLAUDE.md`, *Curriculum at a glance*, and step 4 of the collaboration protocol). The animation follows: one video per question, so **four renders per chapter** — predictive and causal, each at Easy and Hard.

| | Predictive (`framing = "predictive"`) | Paired causal (`framing = "causal"`) |
|---|---|---|
| Table columns | Unit, covariate, error, **one** Outcome | Unit, covariate, **two** potential outcomes, Effect |
| What flies to the graph | the outcome | the **difference** between the two potential outcomes |
| What Act 3 redraws | one error | **both** errors, independently |
| The payoff | "the answer is a spread, not a number" | "the *effect* is a spread, **and it crosses zero**" |
| Files | `preceptor_to_graph_{easy,hard}.mp4` | `preceptor_to_effect_{easy,hard}.mp4` |

**One script, one `framing` argument. Do not fork it.** Everything except the table layer and the script sentences is shared — the canvas, the four acts, the motion, the narration machinery, the caption. The quantity being graphed funnels through a single `value` column so no downstream layer knows which framing it is drawing. Forking would guarantee the two drift apart, and drift between the primary and paired artefacts is exactly what the chapter cannot afford.

**The counterfactual cell is greyed and italic, never hatched.** One of the two potential outcomes in every row is a branch the unit did not live. §"Why the table can't be the real `gt` table" forbids hatching in this reconstruction, so contrast carries the claim instead — and the row-1 narration says it out loud, because the fundamental problem of causal inference is the sentence the causal video exists to earn.

**The causal graph needs a zero line.** "The effect crosses zero" is the payoff, and it is not legible without a dashed reference mark saying where zero is. The predictive graph must not have one — there is nothing special about a net worth of zero.

**Independent errors per potential outcome.** $Y_i(1)$ and $Y_i(0)$ each get their own draw, so the individual causal effect is $\tau + (\epsilon_1 - \epsilon_0)$ and is spread by $\sigma\sqrt{2}$. Reuse one error for both and every unit's effect is exactly $\tau$, the distribution collapses to a spike, and Act 3 has nothing to show. Widen the histogram bins to match the wider spread or the causal graph becomes a comb of near-empty bars.

## 4. The four acts

The video is one ggplot on a free coordinate canvas, advanced by `transition_manual()`. The table is drawn with `geom_rect()` + `geom_text()`; the graph's axes are drawn by hand. This is the load-bearing design decision: a real ggplot axis cannot coexist with a table in the same panel, and using two panels would reintroduce the cut the video exists to avoid.

1. **Fill** — the Preceptor Table fills one row at a time: covariate, formula, error draw, outcome.
2. **Fly** — the three filled outcome values detach from their cells and arc down into a plot area, landing at their positions on the x-axis. Caption: *"Every filled-in row is one point on a graph."*
3. **Simulate** — one row's covariates are held fixed and the error is redrawn repeatedly. The table stays on screen with that row's error and outcome updating live; each draw falls into the graph and the distribution builds.
4. **Hold** — the finished graph, table still faintly visible above it. That persistence is the argument: the graph did not replace the table, it is what the table becomes when you run it enough times.

## 5. Why the table can't be the real `gt` table

`gt` objects aren't `ggplot2` objects, so nothing can tween them. Act 1 uses a **simplified illustrative reconstruction** carrying only the columns the story needs — Unit, the covariate(s) in the formula, the error term, the Outcome. The real footnoted `gt` Preceptor Table stays in Wisdom, and the video's plot caption says so ("Illustrative reconstruction. See Wisdom for the full Preceptor Table."). No footnotes, no hatching.

## 6. Rules the video must obey

- **Every frame contains every table row, and filled rows stay filled.** The easiest thing to get wrong. If frame data holds only the *active* row, earlier rows vanish and the table appears to empty itself.
- **Non-focus rows keep their values during the simulation act.** They earned them in Act 1 and they are in the histogram; blanking them is the same vanishing-values bug in a different costume.
- **Each row's error stays visible after its row completes.** Three visibly *different* error values sitting in the finished table is what makes "random draw" legible.
- **Both graph axes are fixed for the whole video, computed from the final state.** The y-axis is the one people forget, and a y-axis that grows with the bars is worse than a moving x-axis: every frame looks equally full, hiding the fact that the distribution is settling.
- **The table never fully disappears.** It dims to ~55% opacity and stays. If it fades out, the video becomes two clips again.

## 7. Narration

**The video is narrated by an AI voice, and the spoken line and the on-screen caption are the same sentence.** Not a paraphrase of it — the same sentence, so a student watching muted loses nothing. Tutorials frequently play muted, and a caption that is merely a label while the voice carries the real content quietly downgrades every muted viewer.

- **Voice: `edge-tts`**, `en-US-EmmaMultilingualNeural` at `--rate=-8%`. Free, no API key, neural quality. It posts the sentence text to Microsoft's TTS endpoint to synthesize — text only, and only the caption text, but it is an external call, so do not put anything unpublished in a caption.
- **Clips are cached in `narration/`, which is gitignored.** Each `.wav` sits beside a `.txt` holding the sentence it was made from; edit the sentence and the mismatch re-records that line only. 12 MB of audio, fully reproducible from `script_lines()`, so it is derived and stays out of the repo.
- **Caption is markdown, and the load-bearing phrase is bold** — the number that just changed, or the claim the beat exists to make. Drawn with `ggtext::geom_richtext()`; plain `geom_text()` prints the asterisks.
- **The spoken form and the written form of a sentence differ in *notation only*.** `**+1.56**` on screen is "plus one point five six" aloud; `Normal(0, 3)` is unspeakable as written. Keep two columns, `caption` and `say`, never one.
- **Anything that changes every frame cannot live in the caption**, because the caption must stay word-for-word the spoken line. The running draw counter is therefore its own small element by the graph, not part of the caption.

### Narration drives the edit

**This inverts the pacing model.** Beat length is no longer a constant to tune — each block is held for exactly as long as its sentence takes to say, plus a breath, computed at build time from the synthesized audio. Hardcoded beat lengths and a voice track cannot both be right, and the voice is the one the student is following.

The floors in `MIN_F` still apply: a motion act whose sentence is short still needs enough frames to read as motion rather than as a glitch.

**Teach the mechanism once.** Row 1 gets full sentences; rows 2 and 3 run the same beats tersely. By row 2 the student is watching a pattern repeat, not learning it, and narrating the full explanation three times is padding. This is also what keeps the easy version near a minute and a half instead of over two.

## 8. Easy vs. Hard pacing

One script, a `pace` argument. Do not build two scripts.

| | Easy | Hard |
|---|---|---|
| Beats per row | 4 (covariate / formula / error draw / outcome) | 2 (formula+error together / outcome) |
| Beat length | set by narration, ~3–7s | set by narration, ~2–4s |
| Captions | full sentences for row 1, terse for rows 2–3 | short label, result only |
| Simulation draws | 220, individually visible | 700, compressed so the *shape* is the point |
| Total runtime | ~95s predictive, ~98s causal | ~43s predictive, ~56s causal |

Medium-tier chapters default to the Easy profile; Hard is for tutorials where the reader has already seen the mechanism (13-16 per the EMH progression) and the video is reinforcing aggregation, not teaching the arithmetic.

## 9. Implementation notes (learned from building it — don't rediscover)

These are real failures hit while building this animation. All four renders come out clean once they are respected.

Notes 1–9 come from a superseded two-clip design (four gifs — `dgm_fill_*.gif`, `dgm_distribution_*.gif`, 700×430) that this single continuous video replaced; they were learned building those and still apply. Notes 10–17 come from the single-video build, 18–23 from adding narration.

1. **`tibble()` evaluates its arguments sequentially, and later arguments see earlier ones *already recycled* to the tibble's size.** So `tibble(unit = unit, step = 1:4, cap = glue("{unit}..."))` silently makes `unit` length 4 inside `cap`, and because `glue()` is vectorized the caption column comes out length 10 instead of 4. Symptom: *"Tibble columns must have compatible sizes."* Build caption/label vectors **before** the `tibble()` call, or in a separate `mutate()`.

2. **Use `transition_manual()`, not `transition_states()`, for the table fill.** `transition_states()` tweens between frames, and tweened `geom_text()` crossfades one number into another — unreadable. `transition_manual()` cuts cleanly.

3. **Label variables differ by transition and fail silently.** `transition_manual()` provides `{current_frame}`; `transition_states()` provides `{closest_state}`. Using the wrong one doesn't error — it renders the literal string `{closest_state}` into your subtitle.

4. **`fps` must be a factor of 100 for the `magick` renderer** (1, 2, 4, 5, 10, 20, 25, 50). `gifski` is laxer, but 24 fps hard-errors under `magick`. Set pace by **how many frames each beat is held**, not by fractional fps — that's portable across both renderers.

5. **Every held frame is a full duplicate image in the `.gif`.** Holding a beat for 16 frames at 10 fps pushed the easy fill animation to 3.2 MB. Holding for 3 frames at 2 fps gives the same 1.5s beat at 609 KB. Prefer low fps + few holds.

6. **Fix *both* axes on the accumulating histogram, from the final state.** The `x` limit is the obvious one; the **`y` limit is the one people forget**, and a y-axis that grows with the bars is worse than a moving x-axis — every frame looks equally "full", so the reader can't see the distribution settling. Compute `max(table(cut(draws$outcome, breaks)))` over the complete draw set and set `ylim` from it before animating.

7. **`transition_manual(cumulative = TRUE)` can't subsample.** It gives one frame per level, so 800 draws means 800 frames. To show 800 draws in ~60 frames, build the cumulative frames explicitly and use plain `transition_manual()` on the frame index.

8. **`theme_void()` for the table mock-up is a deliberate exception** to `guidance.md` §14.12's `theme_minimal()` default — the mock-up is a table, not a plot, so axes and gridlines are noise. Animation 2 is a real plot and uses `theme_minimal()` as normal. Record it as an on-the-record override, per the repo's no-silent-departures rule.

9. **Set the seed inside each build function, not once at the top of the script.** Otherwise the ε values shown in the fill animation change depending on what else ran first, and the "easy" and "hard" versions of the same animation disagree about the numbers — confusing for a student who watches both.

**Additional lessons from the single-video build:**

10. **A ggplot axis cannot share a panel with a table**, so the graph's axis line, ticks, and labels are drawn by hand with `geom_segment()`/`geom_text()` on the same free canvas as the table. Compute a `xmap()` value-to-canvas function and an `hmap()` count-to-height function once, and route everything through them.

11. **`transition_manual()` treats layers lacking the frame variable as static.** That is useful (the axis line can be one static segment) but it means a layer you *meant* to animate will silently render in every frame if you forget to carry `frame` into its data.

12. **Precompute smooth motion frame by frame instead of asking gganimate to tween it.** The flying values use an explicit ease-out (`1 - (1-t)^2`) plus a `sin(pi*t)` arc, computed per frame. This coexists with `transition_manual()`, so text still cuts cleanly while points still move smoothly.

13. **Derive positions from a named offset, never a repeated literal.** The table slides up between acts; the caption sits a fixed gap below the formula. When those were two separate hardcoded numbers, a search-and-replace updated one and not the other and the caption landed on top of the formula. `DY_FILL` and `CAP_GAP` exist for this reason.

14. **Snap the caption between acts, don't interpolate it.** The caption *text* changes at each act boundary anyway, so interpolating its *position* just drags it across the graph mid-transition.

15. **`av` renders mp4 and sidesteps the gif problems entirely** — no factor-of-100 fps constraint, no per-frame size penalty. A silent 659-frame cut at 800x700 was 287 KB; the narrated 1,896-frame version at 800x760 with an AAC track is 1.6 MB.

16. **Set the beat by how long the caption takes to *read*, not by how long the change takes to *see*.** The first cut ran the easy fill at 22 frames (1.1s) per beat with size-3.0 captions and read as too fast and too small — each beat swaps the formula line *and* a full sentence of caption at once, so 1.1s is enough to notice the change but not to finish the sentence. 34 frames (1.7s) at size 4.1 is the floor. This is the one parameter to check on every new chapter's build; everything else ports unchanged.

17. **Caption type large enough to read no longer fits on one line.** Wrap it before drawing (`strwrap()` at ~52 characters) instead of shrinking the type back down, set `vjust = 1` so the caption hangs *down* from `cap_y` rather than growing in both directions, and give the canvas bottom margin for the second line. Enlarging the caption also means retuning `DY_FILL`: the fill act's block is taller now, so the old offset left it sitting high.

**Additional lessons from adding narration:**

18. **`gganimate::av_renderer()` takes an `audio =` argument**, so muxing needs no external `ffmpeg` — the **av** package bundles the codecs. Handy on Windows, where `ffmpeg` is usually not on `PATH`.

19. **Build one padded track, don't concatenate clips.** Assemble a silent buffer the length of the finished video and drop each clip in at the sample its block starts (`start_frame / fps`). Concatenating clips back to back makes audio length the sum of clip lengths, which drifts from the frame plan the moment any block hits its `MIN_F` floor. Padding cannot drift: verified onsets sit a constant ~0.22s after each block start (edge-tts's own leading silence) with no accumulation across 15 blocks.

20. **`av::av_media_info()` estimates mp3 duration from bitrate and warns that it may be inaccurate.** Believe the warning. Decode to wav with `av_audio_convert()` and take `samples / sample_rate` — beat lengths are computed from these numbers, so an approximate duration desynchronises the whole edit.

21. **Wrap markdown captions on the *rendered* width, not the raw string.** `strwrap()` counts `**` as characters and wraps short. Measure with the asterisks stripped, then re-apply per line and join with `<br>` for gridtext.

22. **Cache synthesis against the sentence, not the filename.** A `.txt` beside each clip holding its source sentence means editing a caption re-records exactly that line and nothing else. Without it you either re-synthesize everything on every build or, worse, silently keep stale audio against a changed caption.

23. **Budget for how long the video becomes.** Narration roughly tripled the runtime (33s → 95s). That is inherent — a sentence takes as long as it takes — but it makes trimming the *script* the only real lever on length. Cut words, not frames.

## 10. Rendered output, as built

Four files per chapter, all 800×760 at `res = 105`, 20 fps, h264 video with AAC audio at 24 kHz:

| File | Framing | Frames | Runtime | Size |
|---|---|---|---|---|
| `preceptor_to_graph_easy.mp4` | predictive | ~1,900 | ~95s | 1.6 MB |
| `preceptor_to_graph_hard.mp4` | predictive | ~850 | ~43s | 0.7 MB |
| `preceptor_to_effect_easy.mp4` | causal | ~1,960 | ~98s | 1.7 MB |
| `preceptor_to_effect_hard.mp4` | causal | ~1,125 | ~56s | 1.0 MB |

**Those frame counts are approximate on purpose, and a rebuild will not reproduce them exactly.** This is the one place the build is not deterministic, and it is worth understanding rather than treating as a bug:

- **The statistical content *is* deterministic.** `set.seed(2026)` sits inside the builder, so every error draw, every table value and the shape of every histogram is identical run to run. Two people building this get the same numbers on screen.
- **The edit timing is not.** Beat lengths are cut to the synthesised narration, and `edge-tts` is a network service that returns marginally different audio for the same sentence on different calls. A cold rebuild moved frame counts by up to 14 frames (0.7s) per video. Nothing is wrong; the voice just landed slightly differently.

So: **never quote an exact runtime as a target**, and never "fix" a frame count that differs from this table. If you need byte-identical rebuilds, commit the `narration/` cache — the `.wav` files are the only non-deterministic input, and with them present no synthesis happens at all.

**Do not commit the `.mp4`s.** They are reproducible output and `.gitignore` excludes them, along with `narration/`. The whole toolkit is ~50 KB of text; the outputs are ~4 MB of binary that would be re-added on every re-render.
