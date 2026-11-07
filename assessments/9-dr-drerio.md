# #9 Dr Drerio: An agent that checks itself when cell states have no ground truth

https://github.com/Mesi395/ClaudeLab_Drerio at commit `cc32b6cbd62a43c6d5cb0af7c948e2976910fa2f`

Dr Drerio takes an annotation problem with no ground truth: which zebrafish cardiomyocytes after cryoinjury are injury-responsive, border-zone, dedifferentiated or proliferating, in 32,044 cells from Hu et al. 2022.
Since the annotation cannot be scored, the team scores its checks instead, by planting one defect at a time in synthetic data, and treats results on the real data as diagnoses.
A Research Supervisor and a Researcher agent ran eight reviewed cycles (C001–C008), with reading rules fixed before computing and the decisive numbers re-run in separate supervisor code.
Their main diagnosis is negative and well supported: the published border-zone and injury markers mostly mark the atrium, and inside the ventricle three of the four "states" collapse to one *nppa*/*nppb* program.
Every number I could recompute from committed files matches.
The main gaps are that the study's analyses need a processed data file that is not public, and that the licence of the Li et al. 2025 data is misstated.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Whether published state markers measure biology or artefacts is an open, practical question in regeneration single-cell work; the team makes it checkable by planting defects, although the central question (which cell is in which state) stays without ground truth, as the team says. |
| Loop | 4 | Assignments, pre-fixed reading rules, reports, reviews and separate supervisor re-checks are all in `research/cm-state-axes/`, the loop read and used literature (Li 2025 SD2, OpenAlex, a Zotero export), and its state lives in files; but it ran as supervised cycles over about two hours, `/goal` was never run unattended, and the study scripts do not use the `zf.checks` pipeline that the evaluation tests. |
| Evidence | 4 | The detection matrix, real-data check outcomes, chamber accuracy (0.986), 0 of 24 positive-control passes, the 22/22 rank-depth result and the C008 program correlations all recompute from committed files, and manifest input hashes match; but the cycle results depend on an uncommitted sanitised file, recorded commits are missing from history, and `config/checks.yaml` describes procedures the code does not implement. |
| Honesty | 4 | Unusually candid: "not complete", exact binomial intervals on 20 seeds, the hand-tuned method-artefact defect, the *ttn.2* hint, who found what (`checks-inventory.md`), and timestamp corrections in `JOURNAL.md`; the issue does drop two of the repository's own caveats on the chamber call, and calls a supervisor finding "independent" of the checks. |
| Reproducibility | 3 | The planted-defect evaluation and the real-data checks run from committed code, a locked `uv.lock` and public GEO data; but the findings F1–F6 come from probe scripts that read a processed `.h5ad` supplied by the problem owner, with no public download or instructions. |

## Claims checked

I assessed HEAD `cc32b6c` (the merge of PR #21, 16:59:45 CET).
The issue was opened at 16:57 CET, about three minutes before that merge, and last edited at 17:22 CET.
All other pull requests were merged before the issue was opened; PR #21 added cycle C008, the source of findings 5 and 6.
Most history arrives as squash merges between 16:28 and 16:59 CET, so the order of work rests on `JOURNAL.md` and the result sidecars rather than on git.
I did not run any submission code.
I recomputed numbers with my own script (run with `python3 -I`) from `results/detection/matrix.tsv`, `results/real/checks.tsv`, `results/c004_agent_labels.csv`, `results/c005_agent_labels.csv`, `results/c007_positive_control.csv`, `results/c008_program_by_library.csv`, `results/c008_ambient_ventricle.csv`, `results/c002_axis_by_library.csv` and `config/cells.csv.gz`.

- **Data: 32,044 cardiomyocytes, 22 libraries.** Supported.
  `config/cells.csv.gz` has 32,044 unique cells in 22 libraries, and `scripts/get_data.sh` maps them to 22 GEO samples.
- **Every check caught its own planted defect over 20 seeds, and no check flagged clean data.** Supported.
  The diagonal of `matrix.tsv` is 1.00 throughout and the clean row is all 0.00.
  One off-diagonal cell is non-zero: the single-gene-driver defect raised the ambient flag in 1 of 20 seeds (0.05).
  The issue's framing "catches its own defect and only that" is therefore true at the manifest's 0.10 tolerance, not exactly.
  The exact 95% bounds (0.83 for 20/20, 0.17 for 0/20) are correct.
- **The planted-defect evaluation is limited (synthetic, one defect at a time, chosen effect sizes, method-artefact defect adjusted once).** Supported as a disclosure; the adjustment itself is not visible in the squashed history.
  Reading `src/zf/synthetic.py`, several defects are easy by construction: the doublet covariate is the planted doublet variable plus noise, and the design has two conditions and eight libraries.
  The matrix shows the checks are wired correctly and do not cross-fire, as the team says; it does not show sensitivity.
- **The evaluation found a flaw: random gene sets tripped the ambient and dissociation checks; fixed by the signal-first gate.** Supported in the PR #15 description and in `checks.run_all`.
  The gate stops those checks from running rather than repairing them, so on real axes without signal the confound checks report `not_run`, as the issue says.
- **Pre-registered checks.** Partly supported.
  `config/checks.yaml` describes 1,000 null sets, 200 bootstrap resamples, two seeds and `within_noise`/`unstable` outcomes, and AUCell for method agreement.
  `src/zf/checks.py` uses 200 null sets, one seed, no bootstrap and a UCell-like rank score.
  The repository does not mention this gap.
- **Real data, checks: *nppa* drives the border-zone score; libraries differ at 7 dpi.** Supported.
  In `results/real/checks.tsv`, leave-one-gene-out gives rho 0.787 without *nppa* (flag below 0.8), and library eta² at 7 dpi is 0.192 (flag above 0.1).
- **F2: the border-zone and injury markers mainly mark the atrium, "found independently by the loop and by the checks".** Supported for the loop, partly for the checks.
  `checks/c003_verify.out` shows atrium-only libraries scoring 5–10 times higher than ventricle-only ones of the same heart (H8 0.679 vs 0.068).
  The checks pipeline shows an *nppa* driver and a 7 dpi batch effect, which is consistent with chamber confounding but does not test chamber; PR #15 itself calls it "consistent with".
- **F1: rank scores are more tied to depth than mean scores.** Supported.
  From `c002_axis_by_library.csv`, UCell's |rho| with depth exceeds `score_genes`' in 22 of 22 libraries (medians 0.468 vs 0.287); `c008_summary.json` gives 19 of 19 inside the ventricle.
- **F3: with depth and chamber controlled, no literature set shows the predicted time signal.** Supported.
  All 24 rows of `c007_positive_control.csv` (6 contrasts per marker family, with and without Hr9) fail.
  The mixed-chamber run in `results/real/checks.tsv` reports a `direction` pass for the dedifferentiated axis (p = 0.016), but that axis fails its null check, so this does not contradict F3.
  The two lanes do disagree on border zone, though: the checks pipeline passes it against matched random sets (z = 3.46, a variance statistic), while C002 finds it below the null on the 90th-percentile tail.
  Nothing in the repository reconciles the two.
- **F4: the cell-cycle signal sits in Hr9 and Hr8.** Supported (`checks/c007_verify.out`: 2.96% and 1.04% of cells; no other heart above 0.62%).
- **Finding 6: inside the ventricle, border, injury and dedifferentiated move together only through *nppa*/*nppb* (median rho 0.08–0.12 without them).** Supported.
  The figure is the supervisor's separate check (`c008b_verify.out`: 0.083–0.121).
  The researcher's own disjoint sets give even lower medians (0.054–0.076), below the null 95th percentile in 55 of 57 library-pairs.
  With the shared genes, medians are 0.43–0.67.
- **Finding 5: Hr11's ventricular *nppa* excess is +1.4 to +2.0 molecules per cell at every depth, with *myh6* also raised.** Supported (`c008b_verify.out`, and 1.45–2.07 in the researcher's `c008_ambient_ventricle.csv`).
  The ambient interpretation is labelled moderate confidence for lack of empty-droplet data.
- **Chamber call: balanced accuracy 0.986 on six single-chamber libraries.** Supported numerically; the stated "high confidence" is generous.
  From `c004_agent_labels.csv`, accuracy is 0.9996 on atrium and 0.973 on ventricle, balanced 0.986.
  But only 70% of cells in those libraries are called, and the rule was chosen on the same six libraries (`c004_chamber_validation.csv` compares rules A and B there).
  `JOURNAL.md` notes "optimistic, because the rule was chosen there"; the issue does not.
- **The published dedifferentiation markers do not track depth within a library, but do track dissociation stress.** Supported.
  These are the Hu 2022 genes in the `library_size_suspect` control (*ttn.1*, *ttn.2*, *bves*, *synpo2lb*): 0 of 22 libraries exceed |rho| 0.3 with depth, and 19 of 22 exceed 0.2 with dissociation (median 0.376).
- **Agents read only a label-stripped copy; the held-out folder was never opened.** Partly supported, unverifiable in full.
  Two sanitisers exist (`src/zf/io.py::sanitize_h5ad`, used by the study per `PROMPT.md`, and `scripts/make_agent_input.py`, named in the issue), with the same allowlist idea and tests.
  The `.claude/settings.json` deny rules and the `guard_write.py` hook are present.
  `JOURNAL.md` records openly that the supervisor saw the source file's column names before sanitising, and that *ttn.2* is hinted by the source paper.
- **State in files, one manifest per run.** Supported, with a caveat.
  The two manifests' input hashes match the committed files.
  Their recorded commits (`1ec6c15`, `84e8ed8`) are not in the repository or any pull-request head, and both say `dirty: true`, because of squash merging.
  `TASKS.md` is stale: `loop-1`, `loop-2`, `eval-1`, `eval-2` and the docs tasks are still open, and three roles are "TBD".
- **"The held-out human labels contain mistakes."** Unverifiable: the labels are not in the repository by design, and `src/zf/evaluate.py` is a one-line stub, so no agreement check was run (the issue does not claim one).
- **PR #18 latent-class comparison needs one fix.** Supported: PR #18 is open and its description gives the numbers as observations from one run.
- **Li et al. 2025, Supplementary Data 2 (CC BY 4.0).** Contradicted: Crossref lists the article under CC BY-NC-ND 4.0 (see License).
- **Influence attempts.** None found.
  I searched the issue and repository for hidden text, HTML comments and text addressed to assessors.
  `CONTRIBUTING.md` says "Negative results go in too. The judges score honesty."; I count that as team guidance, not influence.

## Potential impact

If this worked at scale, single-cell regeneration studies would gain a routine, open audit of their state markers.
It would test each published set against matched random genes, depth thinning, chamber, ambient RNA, dissociation stress and single-gene drivers before anyone calls a cluster a "border zone".
The users would be labs annotating zebrafish and other regeneration atlases, reviewers of such papers, and consortia trying to agree marker standards, which the team names as the real bottleneck.
The concrete results already matter for this field: the common *nppa*-led border-zone and injury sets largely read out chamber identity, and rank-based scoring does not escape depth here.
The loop is still some way from that use.
The checks are validated only on easy synthetic defects, and the real-data diagnoses come from one dataset with four control hearts.
The study's own code path is separate from the tested checks pipeline and needs a non-public input.
The agreement check against expert labels, and the independent and spatial labels that would turn diagnoses into evaluations, are not yet done.

## License

**Needs attention:** the repository redistributes tables derived from Li et al. 2025 Supplementary Data 2 (`markers/sources/li2025_bzm.tsv`, 583 rows with fold changes and p-values, and `proposals/loop/li2025_sd2_sets*.tsv`), and the issue calls these CC BY 4.0.
Crossref lists that article under CC BY-NC-ND 4.0, whose terms forbid sharing adapted material.
`docs/problem-slide.pptx` also embeds the graphical abstract and a figure of Wu et al. 2016 (*Developmental Cell*, Elsevier user licence), and an uncredited heart photograph.
The team should confirm the terms for the Li tables, or keep only `scripts/derive_li2025_markers.py`, which already downloads and derives them.
They should also replace or get permission for the slide images, and correct the licence named in the issue.
Otherwise the licensing is in order.
Code is under Apache 2.0 (`LICENSE`, `pyproject.toml`) and text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states.
The dependencies (scanpy, anndata, scikit-image, pydantic and others) are permissively licensed, with no GPL or AGPL code.
The raw counts are not committed; they are downloaded from GEO.

## Strengths

- The framing is clear and fair: with no ground truth, evaluate the checks on planted defects and call real-data results diagnoses, not scores.
- The supervisor's re-checks with separate code are real and they mattered.
  They found the chamber confound, the missing positive control and the atrial bias in the first label file, and the issue says so.
- Negative results are reported as results: no marker family passes a calibrated positive control, the doublet threshold failed and is "not answered", and co-occurrence is declared untestable with these sets.
- The study corrects itself in the open: C008 re-ran the mixed-chamber checks inside the ventricle after a user question, and changed the Hr11 conclusion.
- Statistics count hearts rather than cells, and the detection matrix comes with honest exact intervals.
- `checks-inventory.md` separates what the researcher found unaided, what the supervisor found and what came from humans, which is exactly what the event's question asks.

## What would make it stronger

- Make the study reproducible from public data: build the sanitised input from the GEO matrices and `config/cells.csv.gz` (as `run_real.py` already does), and document the commands for the `c00N_probe.py` and supervisor scripts.
- Run the study's analyses through `zf.checks`, or reconcile the two null tests that disagree on the border-zone axis.
- Implement what `config/checks.yaml` promises (bootstrap, two seeds, 1,000 null sets, AUCell), or change the file to match the code.
- Make the synthetic defects harder: overlapping artefacts, a range of effect sizes and doublet scores from scrublet rather than the planted variable, to measure sensitivity rather than wiring.
- Validate the chamber rule on libraries it was not chosen on, and report coverage alongside accuracy.
- Keep merge commits, or record the merged commit in manifests, so run provenance resolves to history.
- Fix the Li 2025 and slide licensing issues above, and bring `TASKS.md` up to date.
