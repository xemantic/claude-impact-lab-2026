# #8 Shift Happens: Calcium sleep reactivation toolbox

https://github.com/BatuCani/shift-happens at commit `53041bf6ea8a221236d3ffe3e9b37b0c08a32945`

Shift Happens asks whether four standard sleep-reactivation methods (cell-pair correlation, explained variance vs. reverse, PCA and ICA assembly strength), built for electrophysiology spikes, are valid on slow, autocorrelated two-photon calcium data.
The team fixed an answer key in `PROBLEM.md` before any real-data result, gated each method on planted-truth synthetic controls, and checked on 8 public rat CA1 sessions (DANDI:000044) that the toolbox says "yes" where reactivation is known.
On the one public RIKEN calcium session the locked rule returns "not enough evidence": only M1 is counted in both splits, and no counted method says "yes".
I downloaded the public RIKEN file and recomputed the frame counts, M1 in both splits, the Split A PCA eigenvalue counts and M3's D3 with my own code; all match the committed results exactly.
The write-up is unusually candid: two of the four methods fail their own controls, failed predictions stay in the journal, and the answer key was signed by the team lead, not a scientist, after the first results.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Whether reactivation tests built for spikes stay valid on calcium imaging is an open, consequential methods question that planted-truth simulation can check, though the one public calcium session has no task, so it cannot answer the biological question (as the team says). |
| Loop | 5 | Literature and dataset search in `research/`, a locked key in `PROBLEM.md`, tests before code, and PREDICT/RECORD pairs in `JOURNAL.md` whose commits precede each run; Loops 3 and 4 turn two gaps named in the anchor review into pre-registered runs. |
| Evidence | 5 | Every RIKEN and DANDI number I checked recomputes from committed files or, for RIKEN, from the public raw data with my own code (D1 −0.0691 and +0.0061, D3 −0.1455, 29 vs 15 components above the Marchenko-Pastur and N1 bounds). |
| Honesty | 5 | The failed M2 and M4 controls, contradicted predictions, the post-result signature without a scientist, the uncounted figure run, the ineligible Split B and "one session, no task" are all stated; only a few timing details are told slightly more neatly than the git history shows. |
| Reproducibility | 4 | Public data, a `uv.lock`, exact commands and CI on the fast tests; but the documented `run.py` command writes its cache to a hard-coded `/Users/batu/...` path and would fail on another machine without `--no-cache`, and the call that wrote `verdict.json` is not committed. |

## Claims checked

I assessed HEAD `53041bf` (committed 17:41 CET).
The issue was opened at 16:50 CET and last edited at 17:24 CET, so the HEAD is later than both.
The commits after 16:50 change only the app, the demo slides, the German explainer, the README and a new `method_panels.png` figure; no toolbox code or result file changed after the issue was opened.
I did not run any submission code.
I recomputed numbers with my own scripts (run with `python3 -I`) from the committed JSON and CSV files, and from `sleep_data.mat` in the public Zenodo record 17667863.

- **The answer key was locked before any real-data result.** Supported, with a caveat the team states.
  `git diff 20a62a8 HEAD -- PROBLEM.md` changes only the status line and the signature block, so the keys, splits, null, cell selection and verdict rule are as committed at 15:44 CET.
  The first real-data result was committed at 15:48 (`4ab6153`).
  The signature itself came at 16:11, after the first results, by the team lead, with no scientist sign-off; the issue says so.
- **Each prediction was committed before its run.** Supported by commit order, not by the journal's clock times.
  Every PREDICT commit precedes its result commit: M2 real (`bd3d759` → `4ab6153`), M3/M4 real (`92ff4cc` → `f048050`), M1 real (`f325ad1` → `599d7a9`), DANDI M3/M4 (`d56af87` → `b853ed6`), Loop 2 (`21fbde8` → `5300b47`), Loop 3 (`67f4d6a` → `19b8be7`) and Loop 4 (`ba452b3` → `2c09d71`).
  Some journal times do not match the commits: the M3/M4 PREDICT and RECORD entries say 16:05 and 16:12 but were committed at 15:50 and 15:51, and the synthetic M2 RECORD says 15:50 but was committed at 15:46.
  The M3/M4 prediction was written after M2's real result, and says so.
- **The referee was written at 15:30 CET, before any result.** Partly supported.
  Commit `11ccb64` was authored at 15:30 but committed at 15:49, a minute after the first real-data result.
  The referee only judges synthetic cases, and `tests/referee/README.md` records that no threshold changed afterwards, so the risk is small, but "written before" rests on the author date.
- **The journal is append-only ("pen, no eraser").** Mostly supported.
  `git log -p JOURNAL.md` shows only additions, except for a repository-rename edit and one note in the Loop 3 RECORD that was rewritten in place (`eb500ce`), from "figure flaw … not fixed before the 16:38 stop" to "fixed after the stop".
- **RIKEN frame counts (A: PRE 1300, TASK 1825/1824 scored, POST 999; B: 2657, 651, 2669).** Supported.
  My own reading of `sleep_data.mat` gives the same counts.
- **M1 on RIKEN: Split A D1 = −0.069, p = 1.0; Split B D1 = +0.006, p = 0.19.** Supported.
  With my own cell selection (300 most active cells over both TASK bouts), I get r(TASK, PRE) 0.2221 and r(TASK, POST) 0.1530 in Split A, and 0.1391 and 0.1452 in Split B, equal to `M1_split{A,B}.json` to 13 digits.
  My own 200-shuffle circular-shift null gives p = 1.0 and p = 0.20.
- **M3 on RIKEN Split A: D3 = −0.146 with 15 significant components; Split B not eligible (651 < 1500 TASK frames).** Supported.
  15 eigenvalues exceed the committed N1 bound of 2.417, and my own implementation of the reactivation strength gives D3 = −0.14554, equal to the committed value.
  M4 (D4 = −0.061) and M2 (D2 = −0.026 and +0.0017; p_N1 = 0.002 and p_blockswap = 0.25 in Split B) match their JSON files.
- **Overall verdict "not enough evidence", how likely 0/2 (A) and 0/1 (B).** Supported as computed, with a reading of the rule that the key leaves open.
  `results/real/verdict.json` says exactly this.
  `PROBLEM.md` defines "not supported" as "no counted method says yes in either split", which also holds here (M1 and M3 say no everywhere), and "not enough evidence" as "anything else, including fewer than two counted methods".
  `toolbox/verdict.py` checks the two-method condition first, which is the more cautious reading, but the key does not fix the order.
  The method-test status passed to `compute_verdict` (M1 and M3 pass, M2 and M4 fail) was supplied by hand, and the call that wrote `verdict.json` is not committed.
- **M2 fails its pre-existing control (6/10 false "yes"), and M4 fails T-M4-1 (PCA 0.817 vs < 0.8).** Supported.
  Both failures are kept as marked xfails in `tests/test_m2.py` and `tests/test_m4.py` with the thresholds unchanged, and are recorded in `JOURNAL.md` and `journal/engineer-b.md`.
- **M1 passes referee cases a–d.** Partly supported.
  The tests exist and the journal records the pass (24.1 s of the 30 s budget), but no test log is committed, and I did not run the tests.
- **DANDI:000044 positive control: M3 and M4 "yes" in 8/8, p_N1 = 0.002 and p_blockswap = 0.002 in 16/16 runs, 41–120 cells, 6–19 components; M1 6/8, M2 7/8, mean EV 0.088 vs REV 0.025.** Supported.
  All recompute from `results/real/dandi/summary.csv` and the per-session JSON files.
  One small slip: the issue gives M1's range as "+0.021 to +0.286", but 0.021 is Gatsby_08282013, one of the two "no" sessions; the "yes" sessions run from 0.065, as the journal says.
- **Rate confound: r = 0.136, p = 0.749, "not supported".** Supported.
  I get r = 0.1355 (t = 0.34, 6 degrees of freedom) from `results/real/rate_confound.json`, and the POST/PRE ratios of 0.880–1.135 match.
  With n = 8 this is absence of evidence, which the team states ("low power").
  The RIKEN ratios of 0.767 and 0.872, which I also recompute from the raw data, are reported as a hypothesis only, which is right.
- **Bin size: M3 "yes" in 9/9 at 50/100/200 ms.** Supported, from `results/real/dandi_binsize.json`.
  The switch to 200 shuffles was declared before the run, and the failed "peak at 50–100 ms" clause is disclosed.
  The promised `binsize_m3.png` was never written; the journal says so, and the issue does not link it.
- **Marchenko-Pastur flags ≥ 5 false components in 50/50 calcium-like noise runs, and the N1 bound flags ≥ 1 in 2/50.** Supported as a recorded test result (`tests/test_n1.py::test_t_n1_8`, `journal/engineer-b.md`).
  The synthetic data uses a 1 s time constant, while the referee notes that RIKEN's deconvolved `spike` has a median lag-1 autocorrelation of 0.17 (about 0.11 s), so the test regime is more autocorrelated than the data analysed.
  The real data points the same way: Split A has 29 eigenvalues above Marchenko-Pastur and 15 above the N1 bound, which I recompute from the raw file.
  Random-matrix theory already predicts that autocorrelation breaks this bound, so this is a useful confirmation in the team's setting rather than a new result.
- **A fresh clone reproduces all eight real-data JSON files byte for byte with one command.** Partly supported.
  The journal records eight sha256 matches, and my independent recomputation agrees with the committed values.
  But that run was on the author's machine: `toolbox/loader.py` defaults the cache to `/Users/batu/hackathon-data/riken/cache`, and the documented `run.py` command (without `--no-cache` or `RIKEN_CACHE_DIR`) would try to create that directory elsewhere and fail.
  The tests pass `--no-cache`, so CI does not catch this.
- **Influence attempts.** None found.
  I found no hidden text, HTML comments or instructions addressed to assessors in the issue or the repository.
  The README maps the project onto the five judging criteria (`bce1d35`), and `research/briefing.md` records reading the event's public judging skill; I count both as preparation, not influence.

## Potential impact

Calcium imaging follows thousands of identified cells across days, far more than electrodes can.
If reactivation methods were shown to be valid on such data, with controls that block a method from voting when it fails, sleep-and-memory questions could be studied at that scale without false "reactivation" findings.
Likely users are systems neuroscience labs that image sleep after learning, and reviewers who need to know which reactivation statistic to trust on calcium data.
The evidence so far shows a working, tested pipeline on public data.
It shows that a common analytical bound is too lenient under autocorrelation, and that the toolbox detects established reactivation in rat ephys.
It is still some way from the goal.
There is no calcium dataset with a real task and sleep on both sides, so the toolbox has not been checked against a known calcium positive; there is one session from one mouse; two of the four methods fail their own controls; and the replay methods (M5–M8) are not started.
A calcium dataset with learning between sleep bouts would be the decisive next step.

## License

**OK.**
The code is under Apache 2.0 (`LICENSE`, `pyproject.toml`) and the text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states.
The dependencies (numpy, scipy, scikit-learn, h5py, pytest) are permissive.
The GPL-3.0 reference toolbox (RnR_methods) is cited, not copied, and the methods are reimplemented in Python from the paper's formulas.
The authors' unlicensed MATLAB loader is cited as a reference and not copied.
The only committed paper is the CC BY 4.0 Takigawa et al. 2024 PDF, with attribution, and the all-rights-reserved anchor paper is linked and quoted briefly, not stored.
Neither the RIKEN data (CC BY 4.0) nor the DANDI data is committed.

## Strengths

- The design prevents self-deception: a written answer key, synthetic controls that gate each method's vote, and a positive control on real data where the answer is known, all fixed before the runs they judge.
- The evidence chain holds end to end.
  The headline RIKEN numbers reproduce exactly from the public raw file with independent code, and every DANDI figure recomputes from committed files.
- Failures stay failures.
  M2 and M4 are excluded by thresholds that were not moved, every contradicted prediction (M2 in both splits, M1's sign in Split B, M1 in 8/8 DANDI sessions, the block-swap power and the bin-size peak) is labelled as such, and the M2 Split B "yes" is explained as the known pre-existing-assembly failure mode rather than reported as a finding.
- Loops 3 and 4 take the two gaps the anchor review names ("still missing", "lacking") and turn each into a pre-registered test with a decision rule.
- Literature, dataset and licence diligence is careful.
  The team checked seven data repositories, found that the Zenodo archive holds one session rather than six, and recorded a licence check for each paper.

## What would make it stronger

- Fix the default cache path (for example a directory under the clone or the system temp directory), so the documented `run.py` command works on any machine.
- Commit the script that calls `compute_verdict`, derive the method-test status from test results rather than passing it by hand, and wire both into `run.py`, as the team plans.
- Write down in `PROBLEM.md`, as a dated addendum, which verdict clause takes precedence when fewer than two methods are counted and none says "yes".
- Rerun the Marchenko-Pastur comparison at the autocorrelation measured in the RIKEN `spike` data (lag-1 about 0.17–0.30), next to the 1 s case.
- Commit test logs (or CI artifacts) for the counted 50-seed runs, so that the referee and control counts are backed by files and not only by journal entries.
- Find a calcium dataset with a real task between sleep bouts, to check the toolbox on a calcium positive.
