# #13 Do LLMs Argue Like Humans? (Team 2): Comparing the reasoning graphs of human and ChatGPT answers

https://github.com/ChaosRez/claude-hackathon-berlin-2026 at commit `567bffc955b9bc85d9dc88d4c2d31ae1dbe778bb`

The team turns length-matched human and ChatGPT answers from HC3 `finance` into typed reasoning graphs with a Claude extractor, and plans to compare their shape against a human-vs-human baseline.
The repository holds a careful pipeline (schemas, one shared validator, measures, a split-half baseline, 27 tests) and a well-run extraction approach study whose numbers all recompute exactly from its committed results.
But the issue's headline finding, that human graphs had more extra links in a 10-pair pilot (18 vs 4, 9 of 10 pairs, outside the baseline), has no graphs, run log, measures, permutation test or journal entry anywhere in the repository.
The team is candid about low confidence and missing hand labels, and the approach study is a good example of a loop that reads, tests and decides; the comparison itself has not yet been run in a checkable way.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 3 | Whether LLM and human answers differ in argument structure is open and measurable once graphs exist, and the team pins it down with hypotheses and measures in `criteria_merged.yaml`; but the open question in the issue is broad, and every measurement depends on an LLM extractor not yet checked against hand labels. |
| Loop | 4 | A literature report (`reports/SOTA argument extraction.md`) led to a planned, scripted and audited approach study, an ADR and a new default extractor, with state kept in `JOURNAL.md`, `TASKS.md` and validators that retry and count failures; the human-vs-ChatGPT comparison step has not been run on committed data. |
| Evidence | 2 | Every number in `experiments/approach_study/FINDINGS.md` and the Mind Graft README recomputes from committed files, but the issue's only reported finding (the 10-pair pilot) has no artifact in the repository or any branch. |
| Honesty | 4 | The issue states low confidence, no hand labels, the bugs and a wrong earlier claim, and `JOURNAL.md` discloses a deleted run folder and uncommitted run folders; it loses a point for presenting the pilot as "outside the baseline" without the evidence, and for the Mind Graft table calling Claude-made labels "by hand". |
| Reproducibility | 3 | The README gives clear `uv` setup, data, extraction, validation and measurement commands with a lock file, and the approach study has exact commands; but the pilot cannot be rerun or checked (no command, run id or outputs), extraction needs a paid API key, and the issue's "How to run it" block is empty. |

## Claims checked

I assessed HEAD `567bffc` (17:31 CET), which is after the issue was opened (16:22:56 UTC, 17:22 CET; last updated 16:33:46 UTC).
The only commits after the issue are `a547922` and its merge, which add a 3D answer-pair view (`src/viz3d.py`, `app.py`, `tests/test_viz3d.py`) and touch none of the claims below.
I also looked at all 18 remote branches; three have unmerged commits (`docs/research-reports`, `measures/degree-and-cycles`, `streamlit-app`), and none contains pilot results.
I did not run any submission code.
I recomputed numbers with my own scripts (run with `python3 -I`) from `experiments/approach_study/results/per_text.csv`, `mind-graft/data/entity_summary.csv` and a fresh download of HC3 `finance.jsonl`.
The issue carries no `submission` label, which may matter for the organisers' tooling.

- **Pilot of 10 pairs: human graphs had more extra links, 18 vs 4 extra edges, more in 9 of 10 pairs, outside the human-vs-human baseline.** Unsupported.
  No `results/` or `annotations/` folder exists on any branch, and `git log --all -- results annotations` is empty.
  No file contains these numbers, and no `JOURNAL.md` entry records a pilot comparison.
  The README still lists `results/` as "planned, not created yet", and `TASKS.md` leaves Task 9 (run the analysis) and Task 10 (read 3 pairs) open.
  The hypothesis it would confirm ("ChatGPT ... fewer extra links") is written down in `criteria_merged.yaml`, which is good practice, but the result cannot be checked.
- **"Depth, attacks and hedging showed no difference."** Unsupported, for the same reason.
- **Checked with "scripted permutation tests".** Unsupported.
  `src/measure.py` computes paired mean differences and a split-half baseline (1,000 shuffles over human graphs), not a permutation test.
  `criteria_merged.yaml` names an exact sign-flip permutation test as the method for small samples, but no code implements it.
- **"Reading 3 pairs. Most of the links were real, and one was wrong."** Unsupported for the pilot; nothing records which pairs were read.
  A separate three-example read is recorded for the approach study (`FINDINGS.md`, `examples.py`).
- **Data: `scripts/get_data.py` keeps 100 HC3 finance pairs with matched length.** Supported.
  It downloads HC3 `finance` and `scripts/filter_jsonl.py` keeps the first 100 pairs with a word-count difference of at most 10 and 150–500 words in total.
  My recount on the current HC3 file finds 165 pairs passing these defaults (235 at a difference of 15), so the cap of 100 is reached.
  `TASKS.md` notes that this count was never recorded.
- **Schema in `entity_definition.yaml`, `relation.yaml` and `criteria_merged.yaml`.** Supported; all three, plus `criteria.yaml` and `JOURNAL.yaml`, parse as YAML.
- **`src/extract.py` uses Claude to turn each answer into a graph; `src/draw.py` and `app.py` draw it.** Supported by the code.
  The extractor refuses runs above 10 pairs while `GUIDE.md` is not final, as `CLAUDE.md` requires.
- **`src/validate.py` checks every graph; failed graphs are retried, then counted, never dropped.** Supported.
  `extract.py` re-asks with the validator's errors (`--retries`, default 1) and records each graph as valid, invalid or error.
  `measure.py` lists invalid graphs instead of dropping them, and reports `INCONCLUSIVE` when none are valid.
- **`src/measure.py` computes the measures and a human-vs-human baseline.** Supported (split-half baseline; see the permutation-test point above).
- **`tests/` holds the tests.** Supported: 27 test functions in 5 files, three of them parametrised.
- **Bugs fixed: invalid YAML files, a result-handling bug, two validators that disagreed.** Supported.
  The `_request_id` result-handling bug is in `JOURNAL.md` Entry 1 (15:07), the validator mismatch and its fix in Entry 4, and the YAML fixes in commits `eebe091` and `75a3168`.
- **Wrong claim corrected: FiQA gives a second human answer for 68 filtered questions.** Supported by `JOURNAL.md` Entry 1 (15:23), citing `data_exploration.ipynb` section 11, and by the README.
  The plan still uses the split-half baseline; the FiQA baseline is listed as next work.
- **"Literature: not read by the loop. The team chose the related work in README.md by hand."** Contradicted, in the team's favour.
  `reports/SOTA argument extraction.md` is an agent-written literature review (Peldszus & Stede, Stab & Gurevych and others) whose recommendation ("freeze segmentation, sample typing and linking 5 times, decode one tree") the approach study then tested and `docs/adr/0001-extraction-approach.md` adopted.
  Three more reports sit on the unmerged `docs/research-reports` branch.
- **Approach study (in the repository, not in the issue).** Supported.
  From `per_text.csv` I reproduce every point estimate in `FINDINGS.md`: attachment 0.78 (65/83) for A and A-son, 0.83 (69/83) for S, V and P, 0.47 and 0.65 for the two rule baselines.
  Edge overlap between runs is 0.71, 0.69, 0.72, 0.89 and 0.79, and the paired V − S difference is +0.17.
  The by-source table (for example V 0.85 human vs 0.93 ChatGPT) and "A split like the hand-made split in 12 of 20 texts (A-son 8)" also match.
  I did not recompute the bootstrap intervals.
- **Mind Graft (in the repository, not in the issue).** Partly supported.
  `entity_summary.csv` reproduces the README's averages: max depth 4.54 vs 3.66, returns 0.63 vs 1.32, and 42% vs 38% of answers with an opposing entity.
  These are Reddit ELI5 answers with a different 12-type codebook, not the finance pipeline.
  The README table says the ELI5 rows were labelled "by hand, using the codebook", while its own caveat says Claude labelled them; I read that as Claude labelling.
  No baseline or significance test is given for these numbers.
- **"Demo materials: Available."** Partly supported: two slide decks are committed (`docs/presentation/approach-study/` and `mind-graft/presentation/`), but the issue gives no link, and neither deck presents the pilot finding.
- **Influence attempts.** None found.
  The repository contains a copy of this event's `judge-submissions` skill, identical to the organisers' version and described as such in the README.
  I found no hidden text or instructions addressed to assessors in the issue, the documents or the slide HTML.

## Potential impact

If the loop worked, it would give a reproducible, text-blind way to say how LLM answers are built differently from human ones: whether they raise and answer counterpoints, qualify claims, or just stack points under one conclusion.
Researchers in argument mining, discourse analysis and LLM evaluation would use the graphs and measures, and so might educators or platform designers worried about LLM text flattening debate.
The approach study is already a reusable result on its own: on short texts, voting over five labellings of a fixed split makes LLM argument extraction much more stable at no loss of accuracy.
The loop is still a few steps from its main claim.
It needs hand labels on HC3 to know whether the extractor reads human and ChatGPT text equally well (the study already shows it is less stable on human text), a committed full run with the agreed measures, and a second human answer as baseline.
Opinion questions, as the team notes, would give the graphs more argument to capture than factual finance lookups.

## License

**Needs attention:** the issue names only Apache 2.0 and CC BY 4.0, but the repository also puts HC3-derived data under CC BY-SA 4.0 (`LICENSE-data`), and the HC3 text in `mind-graft/data/` is not among the folders the README places under it.
The README itself asks for the CC BY-SA license to be named in the submission issue.
Otherwise the licensing is in order.
The code is Apache 2.0 (`LICENSE`) and the documentation CC BY 4.0 (`LICENSE-docs`), and the README's Licenses section explains the three-way split clearly.
The dependencies (anthropic, pandas, networkx, scikit-learn, streamlit, matplotlib, three.js from a CDN) are permissive, with no GPL or AGPL code.
The arg-microtexts corpus (CC BY-NC-SA 4.0) is kept out of the repository as planned; `per_text.csv` holds only ids and scores.
HC3 is CC BY-SA 4.0; the team rightly notes that some of its upstream sources (FiQA, Reddit) may be stricter.

## Strengths

- The research design is careful: length-matched pairs, a human-vs-human baseline required for every result, comparisons on node and edge types only, and hypotheses with expected measures written down in advance in `criteria_merged.yaml`.
- One validator is shared by the extractor and the measures, failed graphs are counted rather than dropped, and the extractor enforces the team's own rule against large runs before the guide is final.
- The approach study is a model of a small, honest experiment: a literature-derived recommendation, two rule baselines (one checked against the published 0.45), paired intervals, stated confounds, invalid runs kept in the denominators, and a decision recorded as an ADR.
  Every number I checked recomputes exactly.
- `JOURNAL.md` corrects itself in the open: the deleted run folder, the Python 3.14.1 networkx issue and its later correction, and the fact that cited run folders were never committed.
- The team includes a scientist-driven schema and a separate visual exploration (Mind Graft), and the work is split cleanly across many small, reviewed pull requests.

## What would make it stronger

- Commit the pilot: the run folder (`run.yaml` and graphs, under CC BY-SA), the `measure.py` output, the permutation-test script, and a `JOURNAL.md` entry naming the three pairs read and the link that was wrong.
  Until then, the headline should be stated as unverified.
- Make the hand-label check (Task 7) the next step, scored separately for human and ChatGPT texts, since the study already shows the extractor is less stable on human answers.
- Implement the sign-flip permutation test and the FiQA second-answer baseline in `src/measure.py`, so the comparison matches `criteria_merged.yaml`.
- Update the issue: name the CC BY-SA 4.0 data license, credit the literature review the agent did, mention the approach study, and fill in the "How to run it" block (the README already has the commands).
- In `mind-graft/README.md`, say consistently that the ELI5 labels were made by Claude, and state that `mind-graft/data/` is CC BY-SA 4.0.
