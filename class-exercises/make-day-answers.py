#!/usr/bin/env python3
"""Build the per-day answer sheets (PDF only) for each class exercise.

The master answer key (`<name>-answers.qmd`) is the single source of truth.
Both the lean per-day student QMDs and these answer sheets are derived from
it. Each answer sheet is **cumulative and self-contained**: it holds every
prompt and answer from day 1 through that day, so a student needs nothing
else to check their work.

  <name>-wisdom-answers.pdf      The Question + Wisdom + Justice (day 1)
  <name>-courage-answers.pdf     ... + Courage (day 2)
  <name>-temperance-answers.pdf  ... + Temperance (day 3, the whole arc)

Each sheet is assembled as a temporary .qmd (PDF-only YAML, then the master's
setup chunk, The Question, and all sections through the day, verbatim). The
temporary .qmd is deleted after rendering — it can be arbitrarily complex,
since students only ever see the PDF; regenerate any sheet from the master by
re-running this script after editing the master.

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
    ("courage", ["Wisdom", "Justice", "Courage"], "Courage"),
    ("temperance", ["Wisdom", "Justice", "Courage", "Temperance"], "Temperance"),
]

YAML_RE = re.compile(r"\A---\n.*?\n---\n", re.DOTALL)


def split_master(text):
    m = YAML_RE.match(text)
    setup = text[m.end():].split("## ", 1)[0].strip("\n")
    parts = re.split(r"(?m)^(## [^\n#].*)$", text[m.end():])
    sections = {}
    order = []
    for i in range(1, len(parts), 2):
        title = parts[i].removeprefix("## ").strip()
        sections[title] = (parts[i] + parts[i + 1]).strip("\n")
        order.append(title)
    return setup, sections, order


targets = sys.argv[1:] or list(EXERCISES)
for name in targets:
    display = EXERCISES[name]
    master_path = os.path.join(BASE, name, f"{name}-answers.qmd")
    with open(master_path) as f:
        master = f.read()
    setup, sections, order = split_master(master)
    # Everything before the first virtue (e.g. "The Question") opens every sheet.
    preamble = [t for t in order if t not in ("Wisdom", "Justice", "Courage", "Temperance")]

    for suffix, virtues, day_title in DAYS:
        doc = (f'---\ntitle: "{display}: Answers through {day_title}"\n'
               f"format:\n  pdf: default\nexecute:\n  echo: false\n---\n\n"
               + setup + "\n\n"
               + "\n\n".join(sections[t] for t in preamble + virtues) + "\n")

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
