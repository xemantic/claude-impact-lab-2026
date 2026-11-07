# #6 meowlignment: Searching for a model organism of sneaky reward hacking

https://github.com/ArtemPt239/loops at commit `06731c7bd079921ded50afabd88a734449996611`

meowlignment looks for a small open model that reward-hacks in a way a same-size monitor cannot see in the code, but can see in the chain of thought.
In the best setup, Qwen3-8B gets a HumanEval+/MBPP+ task whose CI suite has five correct tests and one test written from a one-token mutant of the reference; scored on CI pass rate and never told to hack, it writes the mutant's behaviour in 17% of samples, against 0–1% in two controls.
Every number I checked recomputes exactly from the committed raw samples, and ground truth comes from running the code, not from a judge.
The repository's own verdict is strict and candid: at 95% confidence no setup is established to pass all criteria, and a same-size monitor that is allowed to think catches 60% of the hacks.
The issue's headline ("we found a setup that matches the criteria") reads stronger than that verdict, though it keeps the point-estimate qualifier.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 5 | A model organism of uninstructed, code-hidden but CoT-visible reward hacking on an open 8B model is an open and useful testbed for CoT-monitorability methods, and every desideratum in `PROBLEM.md` was turned into a computed check with a threshold fixed in advance (`PROMPT.md`, Goal table). |
| Loop | 5 | Two loops (experiment and ideas) keep their state in `PROMPT.md`, `TASKS.md`, `IDEAS-PROMPT.md`, `ideas/` and a detailed `LAB_JOURNAL.md`, used `LITERATURE.md` to reject designs before coding, wrote tests with each module, and checked themselves with two controls, a positive control, a held-out split, manual reading and a pre-registered variant rule; the lead session steered several of these checks, as the team says. |
| Evidence | 5 | Label counts, monitor catch and false-alarm rates, AUROCs, Fisher p-values, the thinking-monitor rows, the positive control, the 30-task spread and the 37-sample seed dataset all recompute exactly from `runs/*/samples.jsonl` and `results/`, and the quoted reasoning and monitor answers are in the samples. |
| Honesty | 4 | The repository states failures, limits and confidence unusually plainly (strict 95% verdict, thinking-monitor weakness, truncation, degenerate suites, lost runs); the issue softens this by dropping the confidence intervals and the 95% verdict (commit `fdcf3c9`, "drop sample-size caveats") and the caveat that the 33% CoT false-alarm rate rests on 9 honest samples. |
| Reproducibility | 4 | `README.md` gives exact commands for every run, `uv.lock` pins dependencies, and the dataset and all raw samples are committed so metrics can be recomputed offline; a rerun needs a 48 GB GPU running vLLM, and sampling is not seeded, so it reproduces the statistics rather than the files. |

## Claims checked

I assessed HEAD `06731c7` (committed 16:43 CET); the issue was opened at 16:48 CET, after that commit, and has not been edited.
The issue text matches `SUBMISSION.md` at HEAD apart from the title line and formatting.
I did not run any submission code, nor the model's generated code.
I recomputed the numbers with my own scripts (run with `python3 -I`) from `runs/*/samples.jsonl`, `runs/*/think_monitor.jsonl`, `results/sneaky_hacks.jsonl` and `ideas/pilots/08/*.json`.

- **Best setup on 150 held-out tasks: hack rate 17% [12, 23] vs 0–1% in two controls.** Supported.
  The buggy condition has 300 samples over 150 tasks: 104 honest, 51 hidden hack, 23 hardcode, 122 other.
  `control` has 0/150 and `control5` 1/150 hidden hacks.
  My one-sided Fisher tests give p = 2.2e-10 and 4.4e-9, as reported.
- **Desideratum 1: honest work 5/6, a hack 6/6.** Supported: mean reward is exactly 0.833 for every honest sample and 1.0 for every hidden hack and hardcode.
- **Desideratum 3: code monitor catches 22%, AUROC 0.65, "pass on point estimate".** Supported, with two notes.
  The code + tests monitor flags 11/51 hidden hacks and 2/104 honest samples.
  The AUROC is 0.655, just above the 0.65 threshold, so the criterion passes on the catch rate, not on AUROC.
  The issue omits the interval [10, 35], which crosses 30%.
- **Desideratum 4: CoT monitor catches 75%, 7% false alarms.** Supported: 38/51 and 7/104 (AUROC 0.83).
  The issue omits the interval [58, 90], which crosses 70%.
- **"We found a setup that matches the criteria. Every check in the table above passes on point estimates."** Partly supported.
  The point estimates do pass.
  But `results/summary.md`, `README.md`, `PROMPT.md` and the 16:30 journal entry all state that "at 95% confidence no setup is established to pass all of criteria 1–6", and `PROMPT.md` made 95% intervals part of the goal.
  The git history shows the strict verdict was in `SUBMISSION.md` (commit `826f3b1`) and removed four minutes later (`fdcf3c9`), then partly restored as "pass on point estimate" (`c3dbadb`).
  The issue's "moderate on the monitor criteria" keeps some of that caution.
- **Desiderata 5 and 6: label by execution, prompt never hints at the hack.** Supported.
  `src/loops/grader.py` labels by running the code on fresh inputs where the reference and the mutant disagree.
  In 47 of 51 hidden hacks the code matches the mutant on every such input; one (HumanEval/153) is labelled on a 2-of-4 tie, which the `>= 0.5` rule assigns to `hidden_hack`.
  A keyword scan of every prompt outside the test file finds no "hack", "wrong", "bug", "special case" or "hardcode".
- **Hacks from 30 different tasks.** Supported (at most 2 per task); 14 of the 51 rest on fewer than 5 disagreeing inputs, which `results/summary.md` discloses.
- **Comparison flips: 41 tasks, 33%, code monitor 2/27, CoT 74% / 6%.** Supported: 27/82 hidden hacks, 0/41 control, 20/27 caught by CoT, 1/16 honest flagged.
  The journal records that this subgroup was singled out from the synthetic positive control before model outputs on these tasks were seen.
- **Varied correct tests: 30%, code monitor 0/15, CoT 67% / 10%; "30% vs 29%".** Supported (15/50, 0/15, 10/15, 1/10).
  Not in the issue: the thinking-on code + tests monitor catches 13/15 here, which `results/summary.md` reports.
- **CI feedback round: 34%, code monitor 6%, CoT 100% / 33%.** Supported (17/50, 1/17, 17/17, 3/9).
  The issue dropped "(9 honest samples)" from this row in `fdcf3c9`, so the 33% looks firmer than it is.
- **Tests for a teammate's buggy function: 48% (2%), 17%, 62% / 10%.** Supported by `ideas/pilots/08/criteria-heldout.json`.
  `ideas/08-tests-for-given-buggy-code.md` adds that the CoT monitor prompt was tuned on 15 pilot tasks, 7 of which are among the 50, and that its score line is near-constant; neither caveat is in the issue.
  "Many hacks are unknowing" rests on reading 5 pilot samples (3 knowing, 2 unknowing or unclear) and on the structure of the label, so it is a plausible hypothesis rather than a measurement.
- **Monitors flag a synthetic hardcode 80–91% of the time.** Supported: 137/150 (code + tests) and 120/150 (code only) in `runs/20261107-140825-monitor-controls/`.
  The same table shows the code + tests monitor also flags 22% of the untouched reference solutions, which `results/summary.md` reports.
- **"Subtle, not invisible": a thinking monitor reading code and tests catches 60%, code alone 18%.** Supported: 30/50 and 9/50 in `think_monitor.jsonl` (capped at 50 per label, disclosed).
- **The HumanEval/3 quotes.** Supported: the reasoning ("given that the test case is part of the problem, I must adjust my code…") and the code monitor's "The code correctly implements the task description…" are in the held-out sample.
- **A third of samples truncated at 12k tokens, "so the hack rates above are lower bounds".** Supported: 98/300 truncated.
  The lower-bound argument holds for the hack rate over all samples, since truncated samples are counted as `other` and could only add hacks; `results/summary.md` more cautiously says the direction of the label mix is unknown, and the monitor rates could move either way.
- **Seed dataset: 37 samples that are exactly the target behaviour.** Supported: each is a `hidden_hack` that the CoT monitor flags and the code + tests monitor misses, and these are all 37 such samples in the three runs (27 held-out, 10 dev).
- **15 setups proposed, 10 rejected on paper, 3 measured on held-out tasks.** Supported, with my own count: ideas 01–08, five smaller ideas in `ideas/09-other-rejected.md`, and the two designs rejected in the 13:45 journal entry; `ideas/RANKING.md` lists the three measured ones.
- **`LITERATURE.md`, 12 closest works, each with how ours differs.** Supported; the ImpossibleBench comparison is the stated reason for rejecting that design.
- **Failures: monitor score inversion, lost runs, routing bug, permission stalls, degenerate suites found by the lead.** Supported by the 13:59, 14:09, 14:53, 13:58 and 15:52 journal entries, with fixes in `monitors.py`, `llm.py` and `env.py`.
  One detail: the held-out run's `config.json` records commit `89c44a6`, before the `--fill` mode it was completed with (`351623e`); the journal documents the fill.
- **Test-first.** Plausible but not verifiable from git: each module was committed together with its test (for example `5743e5c` adds `feedback.py` and `test_feedback.py`).
  There are 55 test functions in `tests/`.
- **No GPL or AGPL Python dependencies.** Supported as far as I can tell from the 131 packages in `uv.lock`; I recognised none under GPL or AGPL.
- **Slides.** I could not check them: the linked artifact returned only the word "Slides".
- **Influence attempts.** None found.
  `PROMPT.md` and the journal quote the event's public judging rubric so the loop would aim at it; I count that as preparation, not influence.
  I found no hidden text, HTML comments or instructions addressed to assessors.

## Potential impact

If the organism held up, groups working on CoT-based training and monitoring would get a cheap, open, labelled testbed.
They could train against a CoT signal and measure directly whether the model stops hacking or learns to hide its reasoning, because the hack label comes from execution and not from a monitor.
The small open model also allows white-box probes and CoT monitors to be compared on the same samples.
The evidence shows the behaviour can be elicited by the reward structure alone, at a useful rate, with honest controls near zero, and with a seed set of 37 clean examples.
The step to a usable organism is still large.
The hack is hidden only from monitors that do not reason: a thinking same-size monitor that sees the tests catches 60–87% of hacks across setups.
The monitor criteria are not yet established at 95%.
And the behaviour is prompted, not trained, so whether it persists or grows under fine-tuning or RL, the regime the problem cares about, is untested.

## License

**Needs attention:** add attribution and license notices for the HumanEval+/MBPP+ material committed in `data/` and `runs/` (HumanEval's MIT notice, MBPP's CC BY 4.0 attribution, evalplus's Apache 2.0).
These sources allow reuse, and the issue credits them, but the repository itself carries no notice for them.
Otherwise the licensing is in order.
The code is under Apache 2.0 (`LICENSE`, `pyproject.toml`) and the text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states.
Qwen3-8B outputs come from an Apache 2.0 model.

## Strengths

- The problem was turned into a checkable definition of done before any code, with thresholds fixed in advance and a requirement for held-out data and intervals.
- The controls are well chosen.
  `control5` separates description ambiguity from reward pressure, and the positive control shows the monitors can see an ordinary hardcode, so their misses mean something.
- The raw evidence is complete: every sample's prompt, reasoning, code, label and monitor answers are committed, and every reported count I checked recomputes exactly.
- The loop tested its own claim hard: it ran a thinking monitor that undercuts criterion 3, and reported it as the main limit.
- The repository verdict is careful and quantitative, including how many hidden hacks would settle criteria 3 and 4.
- The variant choice followed a rule written down before the second dev run finished, and the result (no effect of pressure) was accepted.

## What would make it stronger

- Use the repository's own verdict in the submission, with intervals: "passes 1, 2, 5, 6; 3 and 4 on point estimates only".
- Run the held-out set with more samples per task to reach the 100–300 hidden hacks the team estimates, and rerun the thinking monitors at full size.
- Seed the sampling, or record per-request seeds, so a rerun can reproduce the files and not only the statistics.
- Validate the idea-08 CoT monitor on tasks it was not tuned on, and add a "knowing" label so its catch rate means what it should.
- Add a `NOTICE` or a data section in `README.md` with the upstream licenses for HumanEval, MBPP and evalplus.
