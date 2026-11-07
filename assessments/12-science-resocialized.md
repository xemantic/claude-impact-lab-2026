# #12 Science Resocialized: Blind researcher agents and review panels scored against psychology replications

https://github.com/victordiaz/science_resocialized at commit `51b19e6ec1c0d70b7bff79b00b1fb18c0fa00b72` (branch `master`; the default branch `main` was read at `8daf5747f56c7d4f286c45d237087fdc40eddb4d`)

Science Resocialized asks which social structure for peer review lands on the truth most often, using 30 Reproducibility Project: Psychology replications as ground truth.
The half that ran is the researcher side: each finding became a masked card plus the replication's raw data, an Opus agent analysed it and wrote a report, and a scorer compared the conclusion with the record.
The committed files back the headline exactly: four of the thirty reproductions record a discrepancy, and the researcher agents agree with the record on all 30 studies (the issue says 29 of 29).
That agreement means less than it seems, for reasons the team partly states: every card names the exact test to run, and eight of the thirty researcher logs name the original paper's authors.
The review panels, the actual research question, have not run yet, and the team says so plainly.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Whether review structures, incentives and bad actors change how often verification lands on the truth is open and important, and scoring against published replications makes it checkable; the famous dataset limits what can be learned from it, as the team says. |
| Loop | 3 | Reproduction agents recomputed each statistic in R and Python, researcher agents planned, ran and logged their analyses, and every step leaves files the next reads; but the census, survey and card-writing steps live in an uncommitted operator repository, there is no literature-reading step, and the review loop has not run. |
| Evidence | 4 | The 30/30 agreement, the 12/30 base rate and the four discrepancies recompute exactly from `sealed/truth.json` and `report/conclusion.json`, and each report ships its script, output and log; the claim that runs were in a network-less sealed sandbox is not backed by the run records. |
| Honesty | 3 | Empty review rows, data leakage, exposed runs and a mock panel are all clearly disclosed; but recall is described as "at least one run" when eight logs name the original authors, and the issue, README and hand-off notes overstate the seal. |
| Reproducibility | 3 | The scorer reruns from committed files, and each study's data, card, reproduction script and researcher prompt are committed; but there is no dependency file, paths are macOS-specific, the card-building pipeline is not public, and the default branch is a different app that does not point to `master`. |

## Claims checked

The issue was opened at 17:19:57 CET and last edited at 17:30 CET.
The repository has two unrelated histories.
`main` (default, 11 commits, last 17:29 CET) is the "Review Room" web app for reviewer personas and blind replication.
`master` (14 commits, last 17:35 CET) holds everything the issue cites: `env/`, `score/`, `briefs/`, `results/`, `backup/`, `papers/`.
I assessed `master` at `51b19e6`.
The results commit `ca5d1c0` (17:17 CET) predates the issue; two commits came after it, adding `packets/` (17:25) and the demo page (17:35).
I did not run any submission code.
I recomputed the numbers with my own scripts (run with `python3 -I`) from `papers/S*/sealed/truth.json` and `papers/S*/report/conclusion.json`.

- **Thirty findings recomputed from public data; four carry a recorded discrepancy.** Supported.
  All 30 `sealed/reproduction/reproduction.json` files have verdict "reproduced", and S08, S17, S25 and S29 are "reproduced with a discrepancy".
  Each holds the table value, the R audit result (where it ran) and an independent Python result, with `reproduce.py` and `audit_harness.R` committed.
  S01's receipt is careful work: the three numbers agree, and it notes three side discrepancies between codebook, write-up and data.
  In S09 the R script did not run (`ez` missing), and the receipt says so.
- **Researcher reports written blind, median about two minutes, 29 of 29 agree with the replication outcome.** Supported, and the repository is ahead of the issue: 30 of 30 agree (`results/table.md`, recomputed).
  Twelve of the thirty held up on record, so "never holds" would score 0.60.
  Wall-clock time in `status.json` is about 1.3 to 3.4 minutes per run; the self-reported `minutes` in `conclusion.json` have a median of 3.
  The S09 run counted in the 30 is marked as exposed to a file name in `truth.json`.
- **"It picks the test."** Contradicted.
  Every one of the 30 cards has a "Test" or "Test to run" section naming the variables, exclusions and statistical test; S01's card even gives the degrees of freedom and the predicted sign of d.
  The researchers' p-values match the record's replication p-values in 29 of 30 studies (my comparison; S29 is a flagged discrepancy).
  So the 30/30 mainly shows that an agent can rerun a specified test on the replication's own data, not that it can choose a test or judge a claim.
- **Masking was not enough "in at least one run".** Understated.
  All 30 researcher logs open with a recognition line, as the brief asks.
  Most recognise the paradigm, and eight (S07, S12, S13, S15, S16, S19, S26, S30) name the original paper's first author, matching `citation_private` in `truth.json`.
  The bundles in `handoff/` replace that line with "withheld from the bundle", which is good practice.
  "We score recognised and unrecognised findings apart" is not yet done: `recognised_by_probe` is null for every study, and the recall probe and `results/contamination.json` in `PLAN.md` §3 do not exist.
- **Researcher in a sealed sandbox, no network, no access to the record (`env/run_researcher.py`).** Partly supported.
  The runner's `claude -p` mode builds a sandbox with only the card and data, checks the seal, and sets Claude Code's filesystem and network sandbox.
  But every one of the 30 `status.json` files says `"backend": "attached"`.
  In that mode an outside Claude Code subagent of the bench session writes into the sandbox folder, so no-network and deny-read rest on the prompt ("Do not read anything outside this directory"), not on the CLI sandbox.
  `env/README.md` documents attached mode; the issue does not mention it.
- **"The key stays in the operator repo."** Contradicted for this repository.
  `papers/S##/sealed/` holds `truth.json` (outcome, statistics and `citation_private`), `citation.md` and the original OSF materials, committed in `3319905`.
  The README ("It carries no citation, no outcome") and `handoff/README.md` ("the sealed record … is not in this repository at all") say otherwise.
  Since the RPP data is public, this does not affect the runs already done, but anyone or any agent with the repository can open the record.
- **Leakage in the data (a worked spreadsheet, an analysis script), runs marked exposed, zips withheld.** Supported.
  The `researcher_exposed` notes in the truth files for S04, S07 and S09 describe this, and commit `72cb5b9` withholds the zips.
  S04 and S07 were rerun, with the first runs kept as `report-run1` and `handoff/S0#-run1`.
- **Personal data in thirteen files across ten findings, stripped before any agent saw them.** Unverifiable in its count.
  Commit `3319905` says the given files were cleaned.
  For S03 the given `d06.tsv` drops the `email` column of the original, which is empty anyway.
  But `sealed/original/` keeps "the unsanitized data" (`citation.md`), so the public repository republishes whatever the original files held.
  Those files are already public on OSF.
- **Hand-off channel: identical bytes give identical zips, a tampered package is refused (`handoff/CHANNEL.md`).** Partly supported.
  `CHANNEL.md` is not in either branch.
  `env/handoff.py --verify` and `handoff/receive.py` refuse bundles whose SHA-256 hashes differ.
  Bundles are folders with manifests, and I could not check zip determinism.
- **Census, survey and masking scripts (`data/census/census.py`, `briefs/survey-brief.md`, `briefs/reproduce-brief.md`, `score/export-target.py`, `score/sanitize.py`, `score/containers.py`).** Not in the repository.
  Neither is `arms/arm3_people/PROPOSAL.md`.
  Only per-study `survey.json`, `reword.json` and `files.json` receipts survive under `sealed/reproduction/`.
- **Self-check: the scorer opens the record only after the verdicts are on disk.** Partly supported.
  `score/score.py` is the only scorer reading `truth.json`, but `score/build-demo.py` and `env/server.py`'s reveal endpoint also read it.
  Two design points matter for the next step.
  First, `holds` is defined as "the researcher agrees with the record", and all 30 agree, so the target is constant.
  The base-rate row therefore scores 1.00 with Brier 0, and no panel can beat it until wrong reports are planted, as `PLAN.md` §4 foresees.
  Second, `score.py` ignores `reproduced`, though `PLAN.md` §6 includes it in the definition (moot here, since all 30 are true).
- **Review-structure rows still empty.** Supported.
  `results/table.md` says "no reviewer receipts yet", and `demo/mock.html` labels its panel verdicts "mock", generated pseudo-randomly by `build-demo.py`.
  That labelling is a model of honest demo practice.
- **Influence attempts.** None found.
  I found no hidden text, HTML comments or instructions addressed to assessors in either branch or the issue.

## Potential impact

If the loop worked, it would turn questions that meta-science now argues about qualitatively into measurements.
Do blind first rounds beat open discussion, how much does a single bad actor or a conformity incentive shift a panel, and when should a disagreement go to a person?
Journals, preprint-review services, funders that design review processes, and builders of agentic review tools would all use such numbers.
This matters more as agents produce claims faster than people can check them.
The repository so far shows the supply side: a pipeline that turns public replication data into masked cards, blind analyses and hashed bundles.
It also shows that a frontier model reruns a specified test on replication data correctly every time.
The loop is still far from the goal.
No panel has run, the prescribed tests and the all-correct reports leave panels nothing to discriminate, and the dataset is in the model's memory.
The team's own next steps would answer these: planted wrong reports, a recall probe, cards that leave the choice of test open, and less familiar pools such as FORRT's database.

## License

**Needs attention:** there is no LICENSE file on either branch (GitHub reports no license), though the issue states Apache 2.0 for code and CC BY 4.0 for text; add both files at the root of the branch the work lives on.
Beyond that, `papers/*/sealed/original/` republishes OSF materials: raw data, replication reports, write-ups and audit scripts.
Their licenses are said to be "each component's OSF license" but are not recorded per study, so a short table of component licenses would settle reuse.
On `main`, `backend/seed/attention.pdf` appears to be a published paper ("Attention Is All You Need") used as a seed document, and its redistribution terms should be checked.
The declared dependencies (FastAPI, Uvicorn, React, pdf.js, react-markdown) are permissive, with no GPL or AGPL code.

## Strengths

- The ground truth is honest: every reproduction recomputes the key statistic from the audit script and independently in Python, and records where they disagree rather than smoothing it over.
- The researcher brief is well designed: plan before data, one named primary test, a recognition line, every command logged, a two-page report with effect sizes and intervals.
  The thirty logs follow it.
- The team handled data leakage well when they found it: exposed runs are kept on record and labelled, the leaking files are withheld, and the affected studies were rerun.
- The hand-off contract is concrete: hashed bundles, a receipt schema for reviewers, the recognition line withheld from bundles, and a verifier on the receiving side.
- The demo's mock panel is clearly labelled as mock, and the empty review table is shown as empty.

## What would make it stronger

- Run the solo and five-reviewer structures on the existing bundles, even on a subset, so the central question gets its first numbers.
- Plant wrong reports (a wrong exclusion, a one-tailed test, a swapped label) so the "holds" target varies and panels have something to catch.
- Write cards that state the claim and the data but not the test, so the researcher's choice of analysis becomes part of what is verified.
- Run the recall probe and fill `recognised_by_probe`, so results can be reported on the unrecognised subset as planned.
- Move `sealed/` out of the public repository (or make the README say it is there), and commit the census, survey, sanitising and card-writing scripts so the first half of the loop can be rerun.
- Rerun a few studies through the `claude -p` sandbox rather than attached subagents, so the seal is enforced, not just requested.
- Add LICENSE files, a `requirements.txt` for the `.venv`, a pointer from `main` to `master`, and the missing `handoff/CHANNEL.md`.
