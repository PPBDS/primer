#!/usr/bin/env python3
"""Build the per-day answer sheets (PDF only) for each class exercise.

The master answer key (`<name>-answers.qmd`) is the single source of truth.
This script slices it into one answer sheet per class meeting:

  <name>-wisdom-answers.pdf      Wisdom + Justice (day 1)
  <name>-courage-answers.pdf     Courage (day 2)
  <name>-temperance-answers.pdf  Temperance (day 3)

Each sheet is assembled as a temporary .qmd (PDF-only YAML, the master's setup
chunk, then the day's section(s) verbatim). Because later days' code depends on
objects built earlier (e.g. the analysis tibble from Wisdom, the fitted model
from Courage), a hidden `include: false` chunk runs all code from the earlier
sections first. The temporary .qmd is deleted after rendering — regenerate it
from the master any time by re-running this script.

Usage:  python3 make-day-answers.py [exercise-name ...]
        (no arguments = all exercises)
"""
import os
import re
import subprocess
import sys

BASE = os.path.dirname(os.path.abspath(__file__))
EXERCISES = {"resumes": "Resumes", "governors": "Governors", "class-size": "Class Size"}
DAYS = [
    ("wisdom", ["Wisdom", "Justice"], "Wisdom and Justice"),
    ("courage", ["Courage"], "Courage"),
    ("temperance", ["Temperance"], "Temperance"),
]

YAML_RE = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)


def split_master(text):
    m = YAML_RE.match(text)
    setup = text[m.end():].split("## ", 1)[0].strip("\n")
    parts = re.split(r"(?m)^(## [^\n#].*)$", text[m.end():])
    sections = {}
    for i in range(1, len(parts), 2):
        sections[parts[i].removeprefix("## ").strip()] = (parts[i] + parts[i + 1]).strip("\n")
    return setup, sections


def chunk_code(section_text):
    """All R code in a section, chunk-option lines stripped. Fences are matched
    line-anchored, because chunk bodies contain literal ``` inside cat() strings."""
    code, current, inside = [], [], False
    for line in section_text.split("\n"):
        if not inside and line.strip() == "```{r}":
            inside, current = True, []
        elif inside and line.strip() == "```":
            inside = False
            body = "\n".join(l for l in current if not l.startswith("#|")).strip("\n")
            if body:
                code.append(body)
        elif inside:
            current.append(line)
    return "\n\n".join(code)


ORDER = ["Wisdom", "Justice", "Courage", "Temperance"]

targets = sys.argv[1:] or list(EXERCISES)
for name in targets:
    display = EXERCISES[name]
    master_path = os.path.join(BASE, name, f"{name}-answers.qmd")
    with open(master_path) as f:
        master = f.read()
    setup, sections = split_master(master)

    for suffix, virtues, day_title in DAYS:
        first = ORDER.index(virtues[0])
        prior = [sections[v] for v in ORDER[:first]]
        prior_code = "\n\n".join(chunk_code(s) for s in prior).strip("\n")

        doc = (f'---\ntitle: "{display}: {day_title} --- Answers"\n'
               f"format:\n  pdf: default\nexecute:\n  echo: false\n---\n\n"
               + setup + "\n\n")
        if prior_code:
            doc += ("```{r}\n#| label: prior-days\n#| include: false\n"
                    "#| message: false\n#| warning: false\n"
                    + prior_code + "\n```\n\n")
        doc += "\n\n".join(sections[v] for v in virtues) + "\n"

        qmd = os.path.join(BASE, name, f"{name}-{suffix}-answers.qmd")
        with open(qmd, "w") as f:
            f.write(doc)
        r = subprocess.run(["quarto", "render", qmd, "--to", "pdf"],
                           capture_output=True, text=True)
        os.remove(qmd)
        pdf = qmd.replace(".qmd", ".pdf")
        if r.returncode != 0 or not os.path.exists(pdf):
            print(f"FAILED {pdf}\n{r.stderr[-2000:]}")
            sys.exit(1)
        print(f"built {os.path.relpath(pdf, BASE)}")
