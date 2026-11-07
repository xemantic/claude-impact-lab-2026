# #16 predictive lens: open-foresight, an energy-transition lens on a judgment-based scenario model

https://github.com/alphakaefer/open-foresight at commit `2f0626ed9e11d863c631d5e925ac9405de1345b6` (branch `main`)

The issue is nearly empty — its title is still the template placeholder, the loop is "no loop yet", findings, blockers and next steps are "-", and "How to run it" is a link to a hosted web app — but the repository behind it holds far more than the issue says.
It is the open edition of an existing judgment-based foresight model (12 world scenarios for 2028, 2032 and 2040, 23 early-warning indicators on open data, a Bayesian update), plus a lens that breaks it down to the German energy transition, a reproducible backtest of the indicators against 2008, 2020 and 2022, and three small analysis tools added on the day: a sensitivity study of the damping `k`, a Claude-written plain-language explanation guarded by an offline number check, and a Brier-scored forecasting prototype.
Its headline results are honest negatives: no numeric indicator would have warned selectively and in time before the three crises, and the forecasting prototype beats a historical baseline only by a hair, which the team itself says "does not show that the model predicts".
I recomputed the forecasting prototype's outcome counts and baseline scores, and one backtest count, from the committed series, and they match exactly.
What is not here is an agentic research loop: there is no literature step and no agent that iterates, and the code license (MIT) does not match the Apache 2.0 named in the issue.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 3 | Probabilistic foresight for the German energy transition is open and significant, but the scenario probabilities to 2040 cannot be checked for years; the team narrowed it to something checkable (indicator backtests, a 12-month Brier-scored forecast), though no success criterion is stated in the issue. |
| Loop | 2 | Code is written and run, and every tool checks itself with gates (reproduce the published state, `k = 0` gives the base model, `git status` unchanged) and keeps its state in files, but nothing reads literature or iterates, and the only model call explains a trace rather than doing research — as the issue's "no loop yet" says. |
| Evidence | 4 | The backtest's 14 series, its results tables and report are committed and CI recomputes them byte for byte; I reproduced 13 of 474 months with Brent above $115 and the prototype's n = 102, 43 declines, prior-only Brier 0.2456 and baseline Brier 0.2528; the `k` and `explain` results, and the model's own Brier 0.2403, are reported in docs but their output files are not committed. |
| Honesty | 5 | The README classifies the model plainly as "judgment-based … not a model fitted on data", lists every judged number, states that no calibration or Brier score exists yet, marks an uncited source as `GAP`, and the prototype prints its four limits (hindsight prior, overlapping windows, revised data) before any result. |
| Reproducibility | 4 | A five-minute quick start, a `Makefile`, a standard-library-only engine and RERUN guides are in the repository, and CI passed on the assessed commit (`make test`, briefing and backtest diffs); the issue's own "How to run it" gives only a web URL, and the hackathon tools write results outside the repository and are not run in CI. |

## Claims checked

I assessed `main` at HEAD `2f0626e` (committed 2026-11-07 17:48:21 CET, 16:48:21 UTC).
The issue was created at 16:48:36 UTC, fifteen seconds later, and has not been edited since; nothing was committed afterwards.
The repository has 35 commits on the day, from 13:15 to 17:48 CET, by Karl (28), Naveen (4), Nikhil (2) and one commit authored as Codex.
The world model, engine and radar collector come from the upstream zukunftsgut.org project and were imported in the first commit; the backtest report says it was run on 2026-10-30, before the event.
The hackathon-day work is the energy lens's UI and frontend, the regional map data, `k_experiment/`, `explain/` and `predict_proto/`.
I did not run any submission code.
I recomputed counts and Brier scores with my own script (`python3 -I`) from the committed CSV series, and checked the repository's GitHub Actions history.

- **Title, team members, field.**
  The title is the unfilled template `[Submission] <team name>: <one-line project title>`, and "Team members" is "ok".
  The field is given as Mathematics; the repository's work is statistical forecasting applied to energy policy.
  I took the project title from the README.
- **"Open problem: foresight scenarios energy."**
  Supported by the repository, which frames the hackathon focus as "the energy transition (Energiewende) in Germany", with a domain briefing in `domains/energy-transition/briefing.md`.
- **"The research loop: no loop yet."**
  Accurate.
  The repository contains deterministic tools with self-checks, not an agent that reads, plans and iterates.
- **"What the loop found / where it got stuck / what it would need next: -".**
  The issue understates the repository, which answers all three.
  Found: the backtest's "No numeric indicator would have warned selectively and in time" and the prototype's "model wins by a hair".
  Stuck: no calibration yet, judged thresholds, horizons not linked.
  Next: a seven-item list with effort estimates in `docs/analysis-tools.md`.
- **Backtest: "A12 (Brent above 115 $) … 13 months in 474."**
  Supported.
  `fred-brent.csv` has 474 monthly values and exactly 13 above 115, the first three being 2008-05 to 2008-07.
  CI runs `make backtest && git diff --exit-code backtest/`, and that job passed on the assessed commit.
- **Forecasting prototype: "the decline happened in 43 of 102 quarters"; prior-only Brier 0.2456, skill +0.028; historical baseline mean 0.338, Brier 0.2528.**
  Supported: my independent recomputation from `eurostat-industrie-de.csv` gives exactly these numbers.
  The model's own Brier (0.2403) depends on the engine, which I did not run, and the run's `report.txt` and `forecasts.csv` are written outside the repository, so that number is not backed by a committed artifact.
- **`k` sensitivity table (2040 movement, for example 6.91 points for shock A05 at `k` = 0.15) and "Real data (case A) moves nothing at any `k`".**
  Plausible but not checkable from committed artifacts: the outputs go to `../open-foresight-results/`.
  The README and `docs/analysis-tools.md` consistently say that no indicator has changed since the base model, so the second statement follows.
- **Claude explanation: "passed on the first attempt. All 64 numbers were found in the trace … for about 7 cents."**
  Unsupported by artifacts, since the run folder is not committed, but the checker exists (`explain/check_numbers.py`, 357 lines) and has tests in `make test`.
  The report is candid that "the check verifies numbers, not reasoning".
- **"One command reproduces the published numbers."**
  Supported as far as CI shows: `tests/test_reproduce.py` compares the recomputed world state with the published `weltlage.json`, and `make test` is green on HEAD.
- **"How to run it: https://zukunftsgut.org/energiewende/".**
  The URL is a live single-page app (Dashboard, Outlook, What-if, Evidence, Forecast check, Method), consistent with the repository's `ui/` and `frontend/`.
  It shows the result rather than how to run it; the run instructions are in the README.
- **"Apache 2.0 for code, CC BY 4.0 for text."**
  Partly contradicted: see License.
- **Open hackathon task in the briefing.**
  The grid-connection numbers are still marked `GAP` at HEAD, so that first task was not done; the README says so.
- **Influence attempts.**
  None found.
  I searched the issue and the repository for text addressed to assessors or judges and found none.

## Potential impact

If the loop succeeded, energy-transition foresight would gain something it rarely has: scenario probabilities whose every judged number is visible in a file, updated by rules on open data, and scored against what then happens.
Most scenario work in this space is a narrative and a set of unscored probabilities; a model that publishes a Brier score each quarter would let planners, grid operators, municipal utilities and policy staff see how much weight its numbers deserve.
The domain lens is general, so the same structure could serve other questions with complementary bottlenecks.
The distance is honestly mapped by the team itself.
Today the probabilities are set by judgment, the indicator backtest finds no selective early warning, the only forecast test is barely better than a base rate with a prior built in hindsight, and the first live forecast questions resolve from 2027-Q1.
The concrete next steps — soft thresholds fitted on the committed series, `k` and couplings estimated from data, a backtest with a prior frozen at a past date, linked horizons — are each well-specified computations, so the gap is work rather than a missing idea; proof that the model predicts, as the team writes, takes years whatever is built.
An agentic loop could help most on the sourcing side: filling `GAP` citations from grid-operator and BNetzA publications and turning statement indicators into numeric series.

## License

**Needs attention:** the code is licensed MIT (`LICENSE`), not Apache 2.0 as the issue states, so either the issue or the license file should be changed to match.
MIT is OSI-approved, so this is a mismatch rather than a barrier to donation.
Text, model and domain data are CC BY 4.0 in `LICENSE-DATA.md`, as the issue says.
I found no GPL or AGPL dependencies: the Python engine is standard-library only, and the frontend's lockfile lists MIT, Apache-2.0, ISC, BSD-3-Clause, OFL-1.1 and CC-BY-4.0 packages; the bundled Jost fonts carry their OFL text, and the map geometry is public-domain Natural Earth.
The committed third-party series (FRED, Eurostat, V-Dem, the Caldara–Iacoviello GPR index, CISA, news titles in the radar snapshot) are correctly excluded from the CC BY grant, but every series header says "Lizenz nicht selbst geprueft" (licence not checked); confirming each publisher's redistribution terms, and noting V-Dem's CC BY-SA, would close that gap.

## Strengths

- The honesty is the standout.
  The README answers a data scientist's question "is this a model at all?" with a precise classification, separates formulas (`engine/`) from judgments (data files, flagged `"judgment": true` with a reason), and leads the backtest with a negative result.
- The forecasting prototype is a model of a small honest test: three forecasters including a prior-only control that isolates the data-driven update, a publication lag, gates that must pass before any number is shown, and limits printed first.
  Its numbers reproduce exactly.
- Reproducibility is engineered, not promised: CI recomputes the backtest byte for byte and fails if the committed briefing drifts from the code, and every hackathon tool refuses to write into the repository and checks `git status` before and after.
- Using Claude only on a deterministic trace, with an offline checker that every number in the prose appears in the trace with the right sign and scenario, is a careful pattern for putting language models next to quantitative models.
- Every series is committed with its source URL, fetch date and processing in the file header, and gaps are labelled `GAP` instead of filled.
- Several people contributed through pull requests in one afternoon, with the README updated to explain each addition.

## What would make it stronger

- Fill in the issue: a real title, the team members, and short answers for what was found, where it got stuck and what it needs next — the repository already contains all three, and the issue currently hides them.
- Make the license consistent: change the issue to MIT, or relicense the code to Apache 2.0, and check the redistribution terms of each committed series.
- Commit one run of each hackathon tool (`report.txt`, `raw_output.json`, `forecasts.csv`, the checked explanation with its `check_report.json`), or add them to CI, so the numbers in `docs/analysis-tools.md` are backed by artifacts like the backtest is.
- Put the run command in "How to run it" (`make test`, `python3 -B predict_proto/predict_proto.py --repo .`) and keep the web app as a demo link.
- Take the first step of the README's own track: a backtest with a prior frozen at a past date, scored by Brier against the base rate, which would answer the hindsight objection the prototype raises.
- Add a loop around the tools: an agent that proposes a soft threshold or a new `k`, reruns the gated backtest, records the score in a file and keeps or discards the change, with a literature or source-finding step for the `GAP` items.
