# =====================================================================
# Preceptor Table -> DGM -> Graph : continuous NARRATED videos
#
# Spec: guide/animations.md (section 19). Operational notes, including
# requirements and how to re-render: README_preceptor_to_graph.md, here.
#
# FOUR OUTPUTS. Every example chapter carries a primary question and its
# paired opposite framing, so this script builds two videos per chapter,
# each at two paces:
#
#   framing = "predictive"  one Outcome column; graphs the outcome
#                           -> preceptor_to_graph_{easy,hard}.mp4
#   framing = "causal"      two potential-outcome columns, the
#                           unobservable one greyed; graphs their
#                           DIFFERENCE against a zero line
#                           -> preceptor_to_effect_{easy,hard}.mp4
#
# Do not fork this script to add a framing. The quantity being graphed
# funnels through a single `value` column, so every layer below the table
# is framing-agnostic; forking guarantees the pair drifts apart.
#
# A single uninterrupted sequence, not two clips. Four acts on one
# canvas, so the table and the graph are never separate objects:
#
#   Act 1  Fill the Preceptor Table, one row at a time, with the DGM
#          formula plus a fresh random error draw.
#   Act 2  The filled outcome values detach from the table and fly down
#          into a plot area, landing at their position on the x-axis.
#   Act 3  Hold one row's covariates fixed, redraw the error over and
#          over. Each draw falls into the graph; the distribution builds.
#   Act 4  Hold on the finished graph. The table stays faintly visible
#          above it -- that persistence IS the point of the video.
#
# The whole thing is one ggplot on a free coordinate canvas, advanced by
# transition_manual(). The table is drawn with geom_rect/geom_text and
# the graph axes are drawn by hand, because a real ggplot axis cannot
# coexist with a table in the same panel.
#
# NARRATION. Every beat carries one sentence, spoken by an AI voice
# (edge-tts) and shown on screen at the same time. The spoken line and
# the caption are the SAME sentence -- a muted viewer loses nothing.
# Because of that, narration length drives the edit, not the reverse:
# each beat is held for exactly as long as its sentence takes to say,
# plus a breath. Beat lengths are therefore computed at build time from
# the synthesised audio, not hardcoded. See guide/animations.md.
#
# TO REUSE IN A NEW CHAPTER: change the two CONFIG blocks below and the
# sentences in script_lines() / script_lines_causal(). Nothing beneath
# them should need editing. The worked example here is the Senators
# net-worth question from guide/tables.md 10.3, which no chapter owns
# yet -- see the Status section of the README before moving these files.
#
# Paths resolve against this script's own directory, so it can be run or
# sourced from any working directory:
#
#   BUILD_ANIMATIONS=true Rscript preceptor_to_graph_video.R   # all four
#   source(...); render_video("easy", "causal", "out.mp4")     # just one
#   build_video("easy", "causal", narrate = FALSE)$blocks      # dry plan
# =====================================================================

library(ggplot2)
library(dplyr)
library(tibble)
library(tidyr)
library(purrr)
library(gganimate)
library(ggtext)

# ---- CONFIG: change this block per chapter ---------------------------

example_rows <- tibble::tribble(
  ~unit,               ~covariate,
  "Bernie Sanders",     2,
  "Elizabeth Warren",  24,
  "Rick Scott",        18
)

unit_label      <- "Senator"
covariate_label <- "Years in Office"
outcome_label   <- "Net Worth ($M)"

beta0  <- 0.5   # intercept of the fitted DGM
beta1  <- 0.5   # slope on the covariate
sigma  <- 3     # sd of the error term
focus  <- "Elizabeth Warren"   # the row Act 3 simulates repeatedly

# ---- CONFIG: the paired (causal) framing ------------------------------
# Every example chapter carries two questions on the same outcome and the
# same covariates -- a primary and a paired opposite framing (root
# CLAUDE.md, "Curriculum at a glance"). So there are two videos per
# chapter, not one: `framing = "predictive"` fills a single Outcome
# column, `framing = "causal"` fills two potential-outcome columns and
# graphs their difference.
#
# Treatment here is re-election to another term. tau is the treatment
# effect the fitted DGM carries.
#
# MODELLING CHOICE, worth knowing you are making it: each potential
# outcome gets its OWN error draw, so the individual causal effect is
# tau + (e1 - e0) and varies across draws with sd = sigma * sqrt(2).
# Give both potential outcomes the SAME error instead and every unit's
# effect is exactly tau, the distribution collapses to a spike, and Act 3
# has nothing to show. The independent-error version is what makes the
# causal video's payoff ("the effect itself has a spread, and it crosses
# zero") true rather than decorative.

tau            <- 3.0    # causal effect of another term, $M
treat_label    <- "Re-elected"
control_label  <- "Retires"
y1_label       <- "Net Worth if\nRe-elected"
y0_label       <- "Net Worth if\nRetires"
effect_label   <- "Causal\nEffect"

# Which arm each senator is actually observed in. The other cell is a
# counterfactual that can never be observed -- the whole point of Act 1.
observed_arm <- c("Bernie Sanders" = "control",
                  "Elizabeth Warren" = "treated",
                  "Rick Scott" = "treated")

primer_blue   <- "#237194"
primer_orange <- "#FAA32B"
primer_offw   <- "#FBFAFC"

# ---- Narration config ------------------------------------------------
# Emma is the clearest of the conversational en-US neural voices; -8%
# slows a teaching read without making it sound sedated. Synthesised
# clips are cached in narration/ and reused unless the sentence changes,
# so a re-render costs no network calls.

TTS_VOICE  <- "en-US-EmmaMultilingualNeural"
TTS_RATE   <- "-8%"
AUDIO_HZ   <- 24000L
LEAD_IN    <- 0.18   # silence before a line starts, seconds
BREATH     <- 0.42   # silence after a line ends, seconds

# ---- Portability ------------------------------------------------------
# Everything this script reads or writes resolves against the script's own
# directory, not the working directory. Otherwise running it from the repo
# root scatters a narration/ folder and four mp4s into the repo root.

script_dir <- function() {
  a <- commandArgs(trailingOnly = FALSE)
  f <- grep("^--file=", a, value = TRUE)
  if (length(f)) return(dirname(normalizePath(sub("^--file=", "", f[1]))))
  sf <- sys.frames()
  for (i in rev(seq_along(sf))) {
    ofile <- sf[[i]]$ofile
    if (!is.null(ofile)) return(dirname(normalizePath(ofile)))
  }
  normalizePath(getwd())
}

HERE     <- script_dir()
NARR_DIR <- file.path(HERE, "narration")
out_path <- function(f) file.path(HERE, f)

# Python is `python` on Windows and usually `python3` elsewhere. Resolve
# once rather than failing halfway through a build.
python_cmd <- function() {
  for (cand in c("python", "python3")) {
    ok <- tryCatch(system2(cand, "--version", stdout = FALSE, stderr = FALSE) == 0,
                   warning = function(w) FALSE, error = function(e) FALSE)
    if (isTRUE(ok)) return(cand)
  }
  NA_character_
}

# Fail early, with instructions, rather than partway through a render.
check_deps <- function(narrate = TRUE) {
  pkgs <- c("ggplot2", "dplyr", "tibble", "tidyr", "purrr",
            "gganimate", "ggtext", "av")
  if (narrate) pkgs <- c(pkgs, "tuneR")
  missing <- pkgs[!vapply(pkgs, requireNamespace, logical(1), quietly = TRUE)]
  if (length(missing)) {
    stop("Missing R packages: ", paste(missing, collapse = ", "),
         "\n  install.packages(c(",
         paste(sprintf('"%s"', missing), collapse = ", "), "))", call. = FALSE)
  }
  if (narrate) {
    py <- python_cmd()
    if (is.na(py)) {
      stop("No python on PATH, so narration cannot be synthesised.\n",
           "  Install Python, then: pip install edge-tts\n",
           "  Or build silent: render_video(pace, framing, file, narrate = FALSE)",
           call. = FALSE)
    }
    ok <- tryCatch(system2(py, c("-m", "edge_tts", "--help"),
                           stdout = FALSE, stderr = FALSE) == 0,
                   warning = function(w) FALSE, error = function(e) FALSE)
    if (!isTRUE(ok)) {
      stop("edge-tts is not installed for '", py, "'.\n",
           "  ", py, " -m pip install edge-tts\n",
           "  Or build silent: render_video(pace, framing, file, narrate = FALSE)",
           call. = FALSE)
    }
  }
  invisible(TRUE)
}

# ---- Canvas geometry -------------------------------------------------
# One shared coordinate space. Table on top, graph below.

X_UNIT <- 0.20; X_COV <- 3.30; X_EPS <- 4.60; X_OUT <- 5.90
# The causal table carries five columns instead of four, so it gets its
# own set of x positions. Same canvas, same extent -- only the column
# stops move.
C_UNIT <- 0.20; C_COV <- 2.55; C_Y1 <- 3.95; C_Y0 <- 5.20; C_EFF <- 6.40
X_L    <- -0.15; X_R <- 6.75          # table extent
Y_HEAD <- -0.30                        # column headers
ROW_H  <- 0.72                         # table row pitch
Y_ROW1 <- -1.15                        # first table row centre

GY_BASE <- -7.60                       # graph baseline (x-axis line)
GY_TOP  <- -4.30                       # top of the tallest bar
GX_L    <- 0.20; GX_R <- 6.55          # graph x extent

y_row <- function(i) Y_ROW1 - (i - 1) * ROW_H

FPS <- 20

# Floors, in frames. Narration sets the length of every block, but the
# motion acts need a minimum regardless of how short their sentence is:
# a fly or a distribution build that finishes in half a second reads as
# a glitch rather than as motion.
MIN_F <- c(fill = 26L, fly = 34L, sim = 110L, hold = 44L)

# ---- Narration helpers -----------------------------------------------

# Wrap for display, then hand gridtext explicit <br> breaks. Wrapping
# has to happen on the *rendered* text, so measure with the asterisks
# removed and re-apply them line by line -- strwrap counts markup as
# characters and would wrap short.
wrap_md <- function(md, width = 54) {
  vapply(md, function(s) {
    if (is.na(s) || !nzchar(s)) return(s)
    toks <- strsplit(s, " ", fixed = TRUE)[[1]]
    vis  <- nchar(gsub("\\*\\*", "", toks))
    line <- 1L; used <- 0L; out <- character(length(toks))
    for (i in seq_along(toks)) {
      add <- vis[i] + as.integer(used > 0)
      if (used + add > width) { line <- line + 1L; used <- vis[i] }
      else used <- used + add
      out[i] <- line
    }
    paste(vapply(split(toks, out), paste, character(1), collapse = " "),
          collapse = "<br>")
  }, character(1), USE.NAMES = FALSE)
}

# Numbers read badly as glyphs: "+1.56" becomes "plus one point five
# six" only if we say so, and "Normal(0, 3)" is unspeakable as written.
say_num <- function(x) sprintf("%s %.2f", ifelse(x < 0, "minus", "plus"), abs(x))

#' Synthesise one sentence, with an on-disk cache.
#'
#' Returns the path to a mono wav at AUDIO_HZ. The cache key is the
#' sentence itself: a .txt sits beside each clip, and a mismatch forces
#' re-synthesis, so editing a caption automatically re-records it.
tts_line <- function(text, key) {
  dir.create(NARR_DIR, showWarnings = FALSE, recursive = TRUE)
  mp3 <- file.path(NARR_DIR, paste0(key, ".mp3"))
  wav <- file.path(NARR_DIR, paste0(key, ".wav"))
  txt <- file.path(NARR_DIR, paste0(key, ".txt"))

  stale <- !file.exists(wav) || !file.exists(txt) ||
    !identical(readLines(txt, warn = FALSE), text)

  if (stale) {
    message("  synthesising: ", key)
    st <- system2(python_cmd(), c("-m", "edge_tts",
                              "--voice", TTS_VOICE,
                              shQuote(paste0("--rate=", TTS_RATE)),
                              "--text", shQuote(text),
                              "--write-media", shQuote(mp3)),
                  stdout = FALSE, stderr = FALSE)
    if (st != 0 || !file.exists(mp3))
      stop("edge-tts failed for '", key, "'. Is it installed? ",
           "pip install edge-tts")
    av::av_audio_convert(mp3, output = wav, format = "wav",
                         sample_rate = AUDIO_HZ, verbose = FALSE)
    writeLines(text, txt)
  }
  wav
}

#' Assemble one silent-padded track from per-line clips.
#'
#' Each clip is dropped in at the sample its block starts, so the audio
#' cannot drift from the picture however the frame plan changes.
build_audio <- function(clips, starts_s, total_s, file) {
  n_total <- as.integer(ceiling(total_s * AUDIO_HZ))
  buf     <- integer(n_total)
  for (i in seq_along(clips)) {
    w   <- tuneR::readWave(clips[i])
    pcm <- as.integer(w@left)
    at  <- as.integer(round(starts_s[i] * AUDIO_HZ)) + 1L
    end <- min(at + length(pcm) - 1L, n_total)
    if (end >= at) buf[at:end] <- pcm[seq_len(end - at + 1L)]
  }
  tuneR::writeWave(
    tuneR::Wave(left = buf, samp.rate = AUDIO_HZ, bit = 16, pcm = TRUE),
    file)
  file
}

wav_seconds <- function(f) {
  w <- tuneR::readWave(f, header = TRUE)
  w$samples / w$sample.rate
}

# =====================================================================
# THE SCRIPT
#
# One row per block, in playback order. `caption` is markdown shown on
# screen; `say` is the spoken form of the same sentence. Keep them the
# same sentence -- if they drift, the muted viewer and the listening
# viewer are being taught different things.
# =====================================================================

# The paired (causal) script. Same four acts, but Act 1 fills two
# potential outcomes per row instead of one, and the quantity that flies
# down to the graph is their difference. Row 1 carries the fundamental
# problem of causal inference explicitly -- that is the sentence the
# whole video exists to earn.
script_lines_causal <- function(pace, u, n_draws) {
  arm_word <- function(r) if (r$arm == "treated") treat_label else control_label
  cf_word  <- function(r) if (r$arm == "treated") control_label else treat_label

  if (pace == "easy") {
    fill <- purrr::map_dfr(seq_len(nrow(u)), function(i) {
      r <- u[i, ]
      tb <- if (i == 1L) {
        tibble::tribble(
          ~beat, ~caption, ~say,
          1L,
          sprintf("Now the causal question. Same senator, **%s**, same **%g years** in office.",
                  r$unit, r$covariate),
          sprintf("Now the causal question. Same senator, %s, same %g years in office.",
                  r$unit, r$covariate),
          2L,
          sprintf("If he is re-elected, the model says his net worth would be **%.2f million**.",
                  r$y1),
          sprintf("If he is re-elected, the model says his net worth would be %.2f million dollars.",
                  r$y1),
          3L,
          sprintf("If he retires instead, **%.2f million**. Same senator, the other branch.",
                  r$y0),
          sprintf("If he retires instead, %.2f million dollars. Same senator, the other branch.",
                  r$y0),
          4L,
          sprintf("The difference, **%+.2f million**, is the causal effect for him. But he lives only one of these two rows — **the other can never be observed**.",
                  r$effect),
          sprintf("The difference, %s million dollars, is the causal effect for him. But he lives only one of these two rows. The other can never be observed.",
                  say_num(r$effect))
        )
      } else {
        tibble::tribble(
          ~beat, ~caption, ~say,
          1L,
          sprintf("Same two branches for **%s**, **%g years** in office.", r$unit, r$covariate),
          sprintf("Same two branches for %s, %g years in office.", r$unit, r$covariate),
          2L,
          sprintf("Re-elected: **%.2f**.", r$y1),
          sprintf("Re-elected: %.2f.", r$y1),
          3L,
          sprintf("Retired: **%.2f**. Greyed out, because that is the branch we never see.", r$y0),
          sprintf("Retired: %.2f. Greyed out, because that is the branch we never see.", r$y0),
          4L,
          sprintf("Effect: **%+.2f**.", r$effect),
          sprintf("Effect: %s.", say_num(r$effect))
        )
      }
      tb |> dplyr::mutate(kind = "fill", row_id = i)
    })

    tail_blocks <- tibble::tribble(
      ~kind, ~caption, ~say,
      "fly",
      "Each row's **causal effect** is one point on a graph — the differences, not the levels.",
      "Each row's causal effect is one point on a graph. The differences, not the levels.",
      "sim",
      sprintf("Hold %s's years in office fixed and **redraw both potential outcomes**, again and again.",
              focus),
      sprintf("Hold %s's years in office fixed, and redraw both potential outcomes, again and again.",
              focus),
      "hold",
      sprintf("After %s draws, **the effect itself has a spread — and it crosses zero**. The model does not claim another term always makes a senator richer.",
              format(n_draws, big.mark = ",")),
      sprintf("After %s draws, the effect itself has a spread, and it crosses zero. The model does not claim another term always makes a senator richer.",
              format(n_draws, big.mark = ","))
    ) |> dplyr::mutate(beat = 1L, row_id = NA_integer_)

  } else {
    fill <- purrr::map_dfr(seq_len(nrow(u)), function(i) {
      r <- u[i, ]
      tibble::tribble(
        ~beat, ~caption, ~say,
        1L,
        sprintf("**%s**: **%.2f** if re-elected, **%.2f** if not.", r$unit, r$y1, r$y0),
        sprintf("%s: %.2f if re-elected, %.2f if not.", r$unit, r$y1, r$y0),
        2L,
        sprintf("Effect: **%+.2f**. Only one of the two is ever observed.", r$effect),
        sprintf("Effect: %s. Only one of the two is ever observed.", say_num(r$effect))
      ) |> dplyr::mutate(kind = "fill", row_id = i)
    })

    tail_blocks <- tibble::tribble(
      ~kind, ~caption, ~say,
      "fly",
      "Each row's **causal effect** is one point.",
      "Each row's causal effect is one point.",
      "sim",
      "Fix the covariates, redraw both potential outcomes, repeat.",
      "Fix the covariates, redraw both potential outcomes, repeat.",
      "hold",
      sprintf("**The effect has a spread, and it crosses zero** — %s draws for %s.",
              format(n_draws, big.mark = ","), focus),
      sprintf("The effect has a spread, and it crosses zero. %s draws for %s.",
              format(n_draws, big.mark = ","), focus)
    ) |> dplyr::mutate(beat = 1L, row_id = NA_integer_)
  }

  dplyr::bind_rows(fill, tail_blocks) |>
    dplyr::mutate(idx = dplyr::row_number(),
                  key = sprintf("causal_%s_%02d_%s", pace, idx, kind))
}

script_lines <- function(pace, u, framing = "predictive") {
  n_draws <- if (pace == "easy") 220L else 700L
  f       <- u |> dplyr::filter(unit == focus)

  if (framing == "causal") return(script_lines_causal(pace, u, n_draws))

  if (pace == "easy") {
    # Row 1 teaches the mechanism in full sentences. Rows 2 and 3 run the
    # same four beats tersely -- the student is now watching a pattern
    # repeat, not learning it, and narrating the full explanation three
    # times is both padding and condescension. This also keeps the video
    # near a minute instead of near two.
    fill <- purrr::map_dfr(seq_len(nrow(u)), function(i) {
      r <- u[i, ]
      tb <- if (i == 1L) {
        tibble::tribble(
          ~beat, ~caption, ~say,
          1L,
          sprintf("Start with **%s**, who has been in office **%g years**. That is the one fact the model gets.",
                  r$unit, r$covariate),
          sprintf("Start with %s, who has been in office %g years. That is the one fact the model gets.",
                  r$unit, r$covariate),
          2L,
          sprintf("The fitted formula turns %g years into **%.2f**. Every row uses this same formula.",
                  r$covariate, r$fitted),
          sprintf("The fitted formula turns %g years into %.2f. Every row uses this same formula.",
                  r$covariate, r$fitted),
          3L,
          sprintf("Now add a random error, drawn fresh for this row. It comes out **%+.2f**.", r$eps),
          sprintf("Now add a random error, drawn fresh for this row. It comes out %s.", say_num(r$eps)),
          4L,
          sprintf("That gives %s a predicted net worth of **%.2f million**.", r$unit, r$outcome),
          sprintf("That gives %s a predicted net worth of %.2f million dollars.", r$unit, r$outcome)
        )
      } else {
        tibble::tribble(
          ~beat, ~caption, ~say,
          1L,
          sprintf("Same formula, new senator: **%s**, **%g years** in office.", r$unit, r$covariate),
          sprintf("Same formula, new senator. %s, %g years in office.", r$unit, r$covariate),
          2L,
          sprintf("The formula gives **%.2f**.", r$fitted),
          sprintf("The formula gives %.2f.", r$fitted),
          3L,
          sprintf("A fresh error: **%+.2f**. Different row, different draw.", r$eps),
          sprintf("A fresh error: %s. Different row, different draw.", say_num(r$eps)),
          4L,
          sprintf("So **%.2f million** for %s.", r$outcome, r$unit),
          sprintf("So %.2f million for %s.", r$outcome, r$unit)
        )
      }
      tb |> dplyr::mutate(kind = "fill", row_id = i)
    })

    tail_blocks <- tibble::tribble(
      ~kind, ~caption, ~say,
      "fly",
      "Every completed row is **one point on a graph**. Watch the three values drop onto the axis.",
      "Every completed row is one point on a graph. Watch the three values drop onto the axis.",
      "sim",
      sprintf("Now hold %s's years in office fixed and **draw the error again and again**. Each draw lands on the graph.",
              focus),
      sprintf("Now hold %s's years in office fixed, and draw the error again and again. Each draw lands on the graph.",
              focus),
      "hold",
      sprintf("After %s draws the shape settles. **This spread, not a single number, is the model's answer** for %s.",
              format(n_draws, big.mark = ","), focus),
      sprintf("After %s draws the shape settles. This spread, not a single number, is the model's answer for %s.",
              format(n_draws, big.mark = ","), focus)
    ) |> dplyr::mutate(beat = 1L, row_id = NA_integer_)

  } else {
    fill <- purrr::map_dfr(seq_len(nrow(u)), function(i) {
      r <- u[i, ]
      tibble::tribble(
        ~beat, ~caption, ~say,
        1L,
        sprintf("**%s**: the formula, plus a random error of **%+.2f**.", r$unit, r$eps),
        sprintf("%s: the formula, plus a random error of %s.", r$unit, say_num(r$eps)),
        2L,
        sprintf("gives **%.2f**.", r$outcome),
        sprintf("gives %.2f.", r$outcome)
      ) |> dplyr::mutate(kind = "fill", row_id = i)
    })

    tail_blocks <- tibble::tribble(
      ~kind, ~caption, ~say,
      "fly",
      "Each row is **one point on a graph**.",
      "Each row is one point on a graph.",
      "sim",
      "Fix the covariates, redraw the error, repeat.",
      "Fix the covariates, redraw the error, repeat.",
      "hold",
      sprintf("**The spread is the answer** — %s draws for %s.",
              format(n_draws, big.mark = ","), focus),
      sprintf("The spread is the answer. %s draws for %s.",
              format(n_draws, big.mark = ","), focus)
    ) |> dplyr::mutate(beat = 1L, row_id = NA_integer_)
  }

  dplyr::bind_rows(fill, tail_blocks) |>
    dplyr::mutate(idx = dplyr::row_number(),
                  key = sprintf("%s_%02d_%s", pace, idx, kind))
}

# =====================================================================
# BUILD
# =====================================================================

build_video <- function(pace = c("easy", "hard"),
                        framing = c("predictive", "causal"),
                        narrate = TRUE) {
  pace    <- match.arg(pace)
  framing <- match.arg(framing)
  causal  <- framing == "causal"
  n_row   <- nrow(example_rows)
  n_beats <- if (pace == "easy") 4L else 2L
  n_draws <- if (pace == "easy") 220L else 700L

  # Which table column the flying values launch from, and what the graph
  # is a graph OF. Everything framing-specific funnels through these.
  X_VAL <- if (causal) C_EFF else X_OUT
  value_axis_label <- if (causal) "Causal Effect on Net Worth ($M)" else outcome_label
  plot_title <- if (causal) "From the Preceptor Table to the Causal Effect"
                else "From the Preceptor Table to the Graph"
  plot_subtitle <- if (causal)
    "The DGM fills both potential outcomes; their difference is the causal effect"
  else
    "The DGM fills the table one row at a time; repeating that fill builds the answer"

  # Seed inside the builder so easy and hard show identical numbers.
  set.seed(2026)

  # Both framings share the fitted part; the causal one draws a second,
  # independent error so each potential outcome is its own draw from the
  # DGM. `value` is whatever this video graphs -- the outcome in the
  # predictive framing, the causal effect in the paired one -- so every
  # layer downstream can stay framing-agnostic.
  units_tbl <- example_rows |>
    dplyr::mutate(
      row_id  = dplyr::row_number(),
      eps     = rnorm(dplyr::n(), 0, sigma),
      eps0    = rnorm(dplyr::n(), 0, sigma),
      fitted  = beta0 + beta1 * covariate,
      outcome = fitted + eps,
      y1      = fitted + tau + eps,
      y0      = fitted + eps0,
      effect  = y1 - y0,
      arm     = unname(observed_arm[unit]),
      value   = if (causal) effect else outcome,
      y       = y_row(row_id)
    )

  focus_row  <- units_tbl |> dplyr::filter(unit == focus)
  stopifnot(nrow(focus_row) == 1)
  focus_fit  <- focus_row$fitted

  sim <- tibble::tibble(
    draw    = seq_len(n_draws),
    eps     = rnorm(n_draws, 0, sigma),
    eps0    = rnorm(n_draws, 0, sigma),
    outcome = focus_fit + eps,
    y1      = focus_fit + tau + eps,
    y0      = focus_fit + eps0
  ) |>
    dplyr::mutate(effect = y1 - y0,
                  value  = if (causal) effect else outcome)

  # ---- Script, audio, and the frame budget it implies -----------------
  # This is the inversion the narrated version introduces: the edit is
  # cut to the voice. Each block is held for its sentence plus a breath,
  # floored by MIN_F so the motion acts still read as motion.
  blocks <- script_lines(pace, units_tbl, framing)

  if (narrate) {
    clips <- purrr::map2_chr(blocks$say, blocks$key, tts_line)
    dur   <- vapply(clips, wav_seconds, numeric(1), USE.NAMES = FALSE)
  } else {
    clips <- character(0)
    dur   <- nchar(blocks$say) / 15   # ~15 chars/sec reading pace
  }

  blocks <- blocks |>
    dplyr::mutate(
      audio_s  = dur,
      want_f   = ceiling((LEAD_IN + audio_s + BREATH) * FPS),
      n_frames = pmax(want_f, MIN_F[kind]),
      start_f  = cumsum(dplyr::lag(n_frames, default = 0L)) + 1L,
      start_s  = (start_f - 1) / FPS + LEAD_IN
    )

  n_all <- sum(blocks$n_frames)

  # ---- Fixed graph scale, computed from the FINAL state --------------
  # Both axes fixed for the whole video. A y-axis that grows with the
  # bars makes every frame look equally full, hiding the fact that the
  # distribution is settling (guide/animations.md note 6).
  all_out  <- c(units_tbl$value, sim$value)
  # The causal effect is tau + (e1 - e0), so it is sqrt(2) times as spread
  # as the outcome. Widen the bins to match or the histogram turns into a
  # comb of forty near-empty bars.
  bw       <- if (causal) sigma / 1.6 else sigma / 2.2
  brks     <- seq(floor(min(all_out)) - bw, ceiling(max(all_out)) + bw, by = bw)
  cnt_max  <- max(table(cut(sim$value, breaks = brks)))
  v_lo     <- min(brks); v_hi <- max(brks)

  xmap <- function(v) GX_L + (v - v_lo) / (v_hi - v_lo) * (GX_R - GX_L)
  hmap <- function(n) (n / cnt_max) * (GY_TOP - GY_BASE)

  bin_of  <- function(v) pmin(pmax(findInterval(v, brks), 1), length(brks) - 1)
  bin_mid <- (head(brks, -1) + tail(brks, -1)) / 2

  Y_FORM_C <- y_row(n_row) - 0.75
  Y_CAP_C  <- GY_BASE - 0.95
  CAP_GAP  <- 0.78      # gap between the formula line and the caption
  # How far the table hangs while it is alone on screen. Chosen to centre
  # the fill act's block (header down to a three-line caption) in the
  # canvas; retune it if CAP_GAP or the caption wrap width changes.
  DY_FILL  <- -1.95

  # ---- Frame plan -----------------------------------------------------
  # Built by expanding the block table, so a block's length is whatever
  # its sentence needed. Nothing downstream may assume uniform beats.
  frames <- blocks |>
    dplyr::select(idx, kind, row_id, beat, n_frames, caption) |>
    tidyr::uncount(n_frames, .id = "within") |>
    dplyr::mutate(frame = dplyr::row_number()) |>
    dplyr::group_by(idx) |>
    dplyr::mutate(t = within / dplyr::n()) |>
    dplyr::ungroup()

  f_sim <- min(frames$frame[frames$kind == "sim"])
  sim_frames <- sum(frames$kind == "sim")
  sim_k <- round(seq(1, n_draws, length.out = sim_frames))

  frames <- frames |>
    dplyr::rename(act = kind, active_row = row_id) |>
    dplyr::mutate(
      fly_t = dplyr::case_when(act == "fly" ~ t,
                               frame >= f_sim ~ 1, TRUE ~ 0),
      sim_i   = ifelse(act == "sim", within, NA_integer_),
      n_drawn = dplyr::case_when(act == "sim"  ~ sim_k[pmax(1, within)],
                                 act == "hold" ~ n_draws, TRUE ~ NA_integer_),
      # Graph furniture fades in during the fly act and stays.
      graph_alpha = dplyr::case_when(act == "fill" ~ 0, act == "fly" ~ fly_t,
                                     TRUE ~ 1),
      # The table dims once the graph takes over, but never disappears.
      table_alpha = dplyr::case_when(act == "fill" ~ 1,
                                     act == "fly"  ~ 1 - 0.45 * fly_t,
                                     TRUE          ~ 0.55),
      # The table hangs lower while it is the only thing on screen, then
      # slides up to make room as the graph fades in.
      table_dy = dplyr::case_when(act == "fill" ~ DY_FILL,
                                  act == "fly"  ~ DY_FILL * (1 - fly_t),
                                  TRUE          ~ 0),
      # Caption tracks the action: under the formula while the table is
      # alone, under the x-axis once the graph exists. Snap, don't drift.
      cap_y = dplyr::case_when(act == "fill" ~ Y_FORM_C + DY_FILL - CAP_GAP,
                               TRUE          ~ Y_CAP_C)
    )

  # ---- Layer: table cells --------------------------------------------
  cells <- frames |>
    dplyr::select(frame, act, active_row, beat, table_alpha, table_dy, n_drawn) |>
    dplyr::cross_join(units_tbl) |>
    dplyr::mutate(
      is_focus  = unit == focus,
      is_active = act == "fill" & row_id == active_row,
      done      = act != "fill" |
                  row_id < active_row |
                  (row_id == active_row & beat == n_beats),
      # In the simulation act only the focus row still carries live
      # values: same covariates, a new error every frame.
      live_eps  = ifelse(act %in% c("sim", "hold") & is_focus,
                         sim$eps[pmax(1, n_drawn)], eps),
      live_out  = ifelse(act %in% c("sim", "hold") & is_focus,
                         sim$outcome[pmax(1, n_drawn)], outcome),
      live_y1   = ifelse(act %in% c("sim", "hold") & is_focus,
                         sim$y1[pmax(1, n_drawn)], y1),
      live_y0   = ifelse(act %in% c("sim", "hold") & is_focus,
                         sim$y0[pmax(1, n_drawn)], y0),
      live_eff  = live_y1 - live_y0,
      show_eps  = dplyr::case_when(
        act == "fill" & row_id < active_row                     ~ TRUE,
        act == "fill" & is_active & (n_beats == 2 | beat >= 3)  ~ TRUE,
        act == "fill"                                           ~ FALSE,
        TRUE                                                    ~ TRUE
      ),
      show_out = dplyr::case_when(act == "fill" ~ done, TRUE ~ TRUE),
      # Causal beats reveal one potential outcome at a time: beat 2 the
      # treated arm, beat 3 the control arm, beat 4 the difference.
      show_y1  = dplyr::case_when(
        act == "fill" & row_id < active_row                    ~ TRUE,
        act == "fill" & is_active & (n_beats == 2 | beat >= 2) ~ TRUE,
        act == "fill"                                          ~ FALSE,
        TRUE                                                   ~ TRUE),
      show_y0  = dplyr::case_when(
        act == "fill" & row_id < active_row                    ~ TRUE,
        act == "fill" & is_active & (n_beats == 2 | beat >= 3) ~ TRUE,
        act == "fill"                                          ~ FALSE,
        TRUE                                                   ~ TRUE),
      eps_text = ifelse(show_eps, sprintf("%+.2f", live_eps), ""),
      out_text = ifelse(show_out, sprintf("%.2f", live_out), ""),
      y1_text  = ifelse(show_y1, sprintf("%.2f", live_y1), ""),
      y0_text  = ifelse(show_y0, sprintf("%.2f", live_y0), ""),
      eff_text = ifelse(show_out, sprintf("%+.2f", live_eff), ""),
      # The counterfactual cell is greyed and italic. The spec forbids gt
      # hatching in this reconstruction, so contrast carries the "you can
      # never observe this" claim instead.
      y1_col   = ifelse(arm == "treated", primer_blue, "grey62"),
      y0_col   = ifelse(arm == "control", primer_blue, "grey62"),
      y1_face  = ifelse(arm == "treated", 2, 3),
      y0_face  = ifelse(arm == "control", 2, 3),
      row_fill = dplyr::case_when(
        is_active                            ~ "#E1EDF3",
        act %in% c("sim","hold") & is_focus  ~ "#E1EDF3",
        TRUE                                 ~ "grey96"
      )
    )

  # ---- Layer: values in flight ---------------------------------------
  # Quadratic ease-out plus a slight arc: readable rather than mechanical.
  fly <- frames |>
    dplyr::filter(act == "fly") |>
    dplyr::select(frame, fly_t, table_dy) |>
    dplyr::cross_join(dplyr::select(units_tbl, row_id, value, y)) |>
    dplyr::mutate(
      t    = pmin(1, fly_t * 1.15),
      e    = 1 - (1 - t)^2,
      ybot = y + table_dy,
      x    = X_VAL + (xmap(value) - X_VAL) * e,
      yy   = ybot + (GY_BASE + 0.10 - ybot) * e - 0.55 * sin(pi * e)
    )

  # ---- Layer: the newest simulated draw falling ----------------------
  drop <- frames |>
    dplyr::filter(act == "sim") |>
    dplyr::select(frame, sim_i, n_drawn) |>
    dplyr::mutate(
      value = sim$value[n_drawn],
      t  = ((sim_i - 1) %% 3 + 1) / 3,
      x  = X_VAL + (xmap(value) - X_VAL) * t,
      yy = y_row(focus_row$row_id) +
           (GY_BASE + 0.10 - y_row(focus_row$row_id)) * t - 0.45 * sin(pi * t)
    )

  # ---- Layer: histogram bars -----------------------------------------
  seed_bins <- bin_of(units_tbl$value)

  bars_fly <- frames |>
    dplyr::filter(act == "fly") |>
    dplyr::select(frame, fly_t) |>
    dplyr::cross_join(tibble::tibble(bin = seed_bins)) |>
    dplyr::count(frame, fly_t, bin, name = "n") |>
    dplyr::mutate(n = n * as.integer(fly_t > 0.92))

  sim_bins <- bin_of(sim$value)
  bars_sim <- purrr::map_dfr(which(frames$act %in% c("sim", "hold")), function(i) {
    k <- frames$n_drawn[i]
    tibble::tibble(frame = frames$frame[i],
                   bin   = sim_bins[seq_len(k)]) |>
      dplyr::count(frame, bin, name = "n")
  })
  # Carry the three seed rows into every later frame so the bars never
  # lose the values that came out of the table.
  bars_sim <- bars_sim |>
    dplyr::bind_rows(
      tidyr::expand_grid(frame = frames$frame[frames$act %in% c("sim","hold")],
                         bin   = seed_bins) |>
        dplyr::count(frame, bin, name = "n")
    ) |>
    dplyr::count(frame, bin, wt = n, name = "n")

  bars <- dplyr::bind_rows(dplyr::select(bars_fly, frame, bin, n), bars_sim) |>
    dplyr::filter(n > 0) |>
    dplyr::mutate(
      xc   = xmap(bin_mid[bin]),
      half = (xmap(v_lo + bw) - xmap(v_lo)) / 2 * 0.92,
      top  = GY_BASE + hmap(n)
    )

  # ---- Layer: graph furniture (axis line, ticks, labels) -------------
  tick_v <- pretty(c(v_lo, v_hi), n = 6)
  tick_v <- tick_v[tick_v >= v_lo & tick_v <= v_hi]
  xticks <- frames |>
    dplyr::select(frame, graph_alpha) |>
    dplyr::cross_join(tibble::tibble(v = tick_v)) |>
    dplyr::mutate(x = xmap(v))

  ytick_n <- pretty(c(0, cnt_max), n = 4)
  ytick_n <- ytick_n[ytick_n <= cnt_max]
  yticks <- frames |>
    dplyr::select(frame, graph_alpha) |>
    dplyr::cross_join(tibble::tibble(n = ytick_n)) |>
    dplyr::mutate(yy = GY_BASE + hmap(n))

  # ---- Layer: per-frame text -----------------------------------------
  # The running draw counter is deliberately NOT part of the caption.
  # The caption has to stay word-for-word identical to the spoken line,
  # and a number that ticks every frame cannot be.
  counter <- frames |>
    dplyr::filter(act %in% c("sim", "hold")) |>
    dplyr::transmute(frame,
                     label = sprintf("Draws: %s",
                                     format(n_drawn, big.mark = ",")))

  ann <- frames |>
    dplyr::left_join(dplyr::select(units_tbl, row_id, unit, covariate,
                                   fitted, eps, outcome, y1, y0, effect),
                     by = c("active_row" = "row_id")) |>
    dplyr::mutate(
      formula_text = if (causal) dplyr::case_when(
        act == "fill" & n_beats == 4 & beat == 1 ~
          sprintf("Y(1) = %.2f + %.2f x %s + %.1f + e     Y(0) = ... + e",
                  beta0, beta1, covariate_label, tau),
        act == "fill" & n_beats == 4 & beat == 2 ~
          sprintf("Y(1) = %.2f + %.1f %+.2f = %.2f", fitted, tau, eps, y1),
        act == "fill" & n_beats == 4 & beat == 3 ~
          sprintf("Y(0) = %.2f %+.2f = %.2f", fitted, y0 - fitted, y0),
        act == "fill" & n_beats == 4 & beat == 4 ~
          sprintf("%.2f  -  %.2f  =  %+.2f", y1, y0, effect),
        act == "fill" & n_beats == 2 & beat == 1 ~
          sprintf("Y(1) = %.2f     Y(0) = %.2f", y1, y0),
        act == "fill" & n_beats == 2 & beat == 2 ~
          sprintf("=  %+.2f", effect),
        act == "fly" ~ "",
        act %in% c("sim", "hold") ~
          sprintf("Y(1) - Y(0)        e ~ Normal(0, %g), drawn twice", sigma),
        TRUE ~ ""
      ) else dplyr::case_when(
        act == "fill" & n_beats == 4 & beat == 1 ~
          sprintf("%s  =  %.2f  +  %.2f x %s  +  e", outcome_label, beta0,
                  beta1, covariate_label),
        act == "fill" & n_beats == 4 & beat == 2 ~
          sprintf("%.2f  +  %.2f x %g  =  %.2f", beta0, beta1, covariate, fitted),
        act == "fill" & n_beats == 4 & beat == 3 ~
          sprintf("%.2f  +  e        e ~ Normal(0, %g)", fitted, sigma),
        act == "fill" & n_beats == 4 & beat == 4 ~
          sprintf("%.2f  %+.2f  =  %.2f", fitted, eps, outcome),
        act == "fill" & n_beats == 2 & beat == 1 ~
          sprintf("%.2f + %.2f x %g %+.2f", beta0, beta1, covariate, eps),
        act == "fill" & n_beats == 2 & beat == 2 ~
          sprintf("=  %.2f", outcome),
        act == "fly" ~ "",
        act %in% c("sim", "hold") ~
          sprintf("%.2f  +  e        e ~ Normal(0, %g)", focus_fit, sigma),
        TRUE ~ ""
      ),
      caption_md = wrap_md(caption)
    ) |>
    dplyr::select(frame, formula_text, caption_md, graph_alpha,
                  table_dy, cap_y)

  # ---- Layer: the table, whose shape depends on the framing -----------
  # Four columns predictive, five causal. Built as a list of geoms rather
  # than branching the whole ggplot: everything else on the canvas -- the
  # graph, the motion, the caption -- is identical between the two, and
  # duplicating the assembly would guarantee the two drift apart.
  hdr <- dplyr::distinct(cells, frame, table_alpha, table_dy)
  htxt <- function(x, lab, sz = 3.5)
    geom_text(data = hdr, aes(x = x, y = Y_HEAD + table_dy, label = lab,
                              alpha = table_alpha),
              fontface = "bold", size = sz, lineheight = 0.95)

  table_layers <- if (causal) list(
    geom_text(data = hdr, aes(x = C_UNIT, y = Y_HEAD + table_dy, label = unit_label,
                              alpha = table_alpha),
              hjust = 0, fontface = "bold", size = 3.2),
    htxt(C_COV, covariate_label, 3.2),
    htxt(C_Y1,  y1_label,        3.2),
    htxt(C_Y0,  y0_label,        3.2),
    htxt(C_EFF, effect_label,    3.2),
    geom_text(data = cells, aes(x = C_UNIT, y = y + table_dy, label = unit,
                                alpha = table_alpha), hjust = 0, size = 3.2),
    geom_text(data = cells, aes(x = C_COV, y = y + table_dy, label = format(covariate),
                                alpha = table_alpha), size = 3.2),
    geom_text(data = cells, aes(x = C_Y1, y = y + table_dy, label = y1_text,
                                alpha = table_alpha, colour = y1_col, fontface = y1_face),
              size = 3.2),
    geom_text(data = cells, aes(x = C_Y0, y = y + table_dy, label = y0_text,
                                alpha = table_alpha, colour = y0_col, fontface = y0_face),
              size = 3.2),
    geom_text(data = cells, aes(x = C_EFF, y = y + table_dy, label = eff_text,
                                alpha = table_alpha),
              size = 3.3, colour = primer_orange, fontface = "bold")
  ) else list(
    geom_text(data = hdr, aes(x = X_UNIT, y = Y_HEAD + table_dy, label = unit_label,
                              alpha = table_alpha),
              hjust = 0, fontface = "bold", size = 3.5),
    htxt(X_COV, covariate_label),
    htxt(X_EPS, "Error e"),
    htxt(X_OUT, outcome_label),
    geom_text(data = cells, aes(x = X_UNIT, y = y + table_dy, label = unit,
                                alpha = table_alpha), hjust = 0, size = 3.5),
    geom_text(data = cells, aes(x = X_COV, y = y + table_dy, label = format(covariate),
                                alpha = table_alpha), size = 3.5),
    geom_text(data = cells, aes(x = X_EPS, y = y + table_dy, label = eps_text,
                                alpha = table_alpha),
              size = 3.5, colour = primer_orange, fontface = "bold"),
    geom_text(data = cells, aes(x = X_OUT, y = y + table_dy, label = out_text,
                                alpha = table_alpha),
              size = 3.6, colour = primer_blue, fontface = "bold")
  )

  # A zero line, causal only. "The effect distribution crosses zero" is
  # the payoff of the causal video, and it is not legible without a
  # reference mark for where zero actually is.
  zero_layer <- if (causal && 0 > v_lo && 0 < v_hi) list(
    geom_segment(data = dplyr::distinct(frames, frame, graph_alpha),
                 aes(x = xmap(0), xend = xmap(0),
                     y = GY_BASE, yend = GY_TOP + 0.15, alpha = graph_alpha),
                 colour = "grey55", linewidth = 0.3, linetype = "dashed"),
    geom_text(data = dplyr::distinct(frames, frame, graph_alpha),
              aes(x = xmap(0), y = GY_TOP + 0.34, label = "no effect",
                  alpha = graph_alpha),
              size = 2.7, colour = "grey50")
  ) else list()

  # ---- Assemble -------------------------------------------------------
  p <- ggplot() +
    # table rows
    geom_rect(data = cells,
              aes(xmin = X_L, xmax = X_R,
                  ymin = y + table_dy - 0.30, ymax = y + table_dy + 0.30,
                  fill = row_fill, alpha = table_alpha),
              color = "grey78", linewidth = 0.25) +
    scale_fill_identity() +
    scale_alpha_identity() +
    scale_colour_identity() +
    # table header + cells, chosen by framing (see table_layers below)
    table_layers +
    # graph furniture
    geom_segment(data = dplyr::distinct(frames, frame, graph_alpha),
                 aes(x = GX_L - 0.15, xend = GX_R + 0.15,
                     y = GY_BASE, yend = GY_BASE, alpha = graph_alpha),
                 color = "grey45", linewidth = 0.35) +
    geom_text(data = xticks, aes(x = x, y = GY_BASE - 0.26,
                                 label = format(v), alpha = graph_alpha),
              size = 3.0, color = "grey35") +
    geom_text(data = yticks, aes(x = GX_L - 0.30, y = yy,
                                 label = format(n), alpha = graph_alpha),
              size = 2.8, color = "grey55", hjust = 1) +
    geom_text(data = dplyr::distinct(frames, frame, graph_alpha),
              aes(x = (GX_L + GX_R) / 2, y = GY_BASE - 0.58,
                  label = value_axis_label, alpha = graph_alpha),
              size = 3.4, color = "grey25") +
    zero_layer +
    # bars
    geom_rect(data = bars,
              aes(xmin = xc - half, xmax = xc + half,
                  ymin = GY_BASE, ymax = top),
              fill = primer_blue, color = "white", linewidth = 0.15) +
    # running draw counter (sim/hold only)
    geom_text(data = counter, aes(x = GX_R, y = GY_TOP + 0.30, label = label),
              hjust = 1, size = 3.1, color = "grey45") +
    # values in flight
    geom_point(data = fly, aes(x = x, y = yy), size = 2.6,
               color = primer_blue) +
    geom_point(data = drop, aes(x = x, y = yy), size = 2.2,
               color = primer_orange) +
    # text lines
    geom_text(data = ann, aes(x = X_UNIT, y = Y_FORM_C + table_dy,
                              label = formula_text),
              hjust = 0, size = 3.9, family = "mono", color = "grey20") +
    # The caption is markdown so the load-bearing phrase can be bold.
    # geom_richtext, not geom_text: geom_text would print the asterisks.
    ggtext::geom_richtext(
      data = ann, aes(x = X_UNIT, y = cap_y, label = caption_md),
      hjust = 0, vjust = 1, size = 4.1, color = "grey20",
      lineheight = 1.25, fill = NA, label.color = NA,
      label.padding = grid::unit(rep(0, 4), "pt")) +
    coord_cartesian(xlim = c(X_L - 0.55, X_R + 0.15),
                    ylim = c(Y_CAP_C - 1.75, 0.55)) +
    labs(
      title    = plot_title,
      subtitle = plot_subtitle,
      caption  = "Illustrative reconstruction. See Wisdom for the full Preceptor Table."
    ) +
    # theme_void is a deliberate exception to guidance.md 14.12's
    # theme_minimal default: the canvas holds a table and a hand-drawn
    # graph, so ggplot's own axes and gridlines would be noise.
    theme_void() +
    theme(
      plot.title    = element_text(size = 14, face = "bold", hjust = 0),
      plot.subtitle = element_text(size = 10.5, color = "grey30", hjust = 0),
      plot.caption  = element_text(size = 7, color = "grey60", hjust = 0),
      plot.margin   = margin(10, 12, 8, 12),
      plot.background = element_rect(fill = primer_offw, color = NA)
    )

  # transition_manual, not transition_states: cell text must not tween.
  anim <- p + transition_manual(frame)

  list(anim = anim, nframes = n_all, blocks = blocks, clips = clips,
       seconds = n_all / FPS)
}

render_video <- function(pace, framing = "predictive", file, narrate = TRUE) {
  check_deps(narrate)
  b <- build_video(pace, framing, narrate = narrate)

  audio <- NULL
  if (narrate) {
    audio <- file.path(NARR_DIR, paste0(framing, "_", pace, "_track.wav"))
    build_audio(b$clips, b$blocks$start_s, b$seconds, audio)
  }

  message(sprintf("%s/%s: %d frames, %.1fs%s", framing, pace, b$nframes,
                  b$seconds, if (narrate) " (narrated)" else ""))

  gganimate::animate(
    b$anim, nframes = b$nframes, fps = FPS,
    width = 800, height = 760, res = 105,
    renderer = gganimate::av_renderer(out_path(file), audio = audio))
}

# Two questions per chapter means two videos per chapter, each at two
# paces. The predictive pair graphs the outcome; the causal pair graphs
# the difference between the two potential outcomes.
if (identical(Sys.getenv("BUILD_ANIMATIONS"), "true")) {
  render_video("easy", "predictive", "preceptor_to_graph_easy.mp4")
  render_video("hard", "predictive", "preceptor_to_graph_hard.mp4")
  render_video("easy", "causal",     "preceptor_to_effect_easy.mp4")
  render_video("hard", "causal",     "preceptor_to_effect_hard.mp4")
}
