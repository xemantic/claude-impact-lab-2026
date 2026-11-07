# #15 llm-lying-detection: Lie detectors that generalize to unseen kinds of lies

https://github.com/msverma101/LLM_Lie_detector at commit `d7878245e1b3a955baa2424a2babc5ae14ac810c` (branch `presentation/three-minute-show`)

Issue #14 ("llm-lie-busters") points to the same repository and is treated here as the same submission, most likely filed twice by two team members; the differences between the two issues are listed under Claims checked.
The team asks whether activation lie probes, trained on Qwen3.5-2B activations for the FIBS dataset, detect kinds of lies they never saw, and splits the data by lie family so that every score answers that question.
In Loop 1, Claude Opus 5.5 rewrote the probe 15 times against a fixed harness that hides the test families from it, and test macro-AUROC rose from 0.806 to 0.845; in Loop 2, Claude edited a trained probe's weights directly, and that gain did not survive the sealed test set.
Every summary number I could check recomputes from the committed tables, and the keep rule replays exactly, but the activations, per-example scores, candidate files and transcripts stayed in Colab, so the results rest on transcribed summaries.
The fuller issue (#15) is admirably candid about the single seed, the two-standard-error margin, the classic-ML nature of the winning idea and the negative weight-editing result.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Whether deception probes transfer to unseen kinds of lies is open and matters for AI monitoring, and the family-disjoint split makes it checkable by computation; one small model and short conversations limit what it can show, as the team says. |
| Loop | 4 | `loop.py` has Claude write each `probe.py`, a fixed `eval.py` scores it on validation families only, a keep/revert rule decides, and `wsp.py` / `wsp_loop.py` add a carefully partitioned weight-edit arm; the literature was read by the team, not the loop, and the loop's state in `runs/` was not committed. |
| Evidence | 3 | `results.tsv`, the per-family tables and the run-1 summaries are internally consistent (macro means recompute, the keep rule replays, the refit arm reproduces the Loop 1 baseline family by family), but no per-example scores, candidates or transcripts are committed, the robustness and random-search controls were not run, and #14 reports selection-only numbers as findings. |
| Honesty | 4 | #15 and `RESULTS.md` state the one seed, the ≈2 SE margin, the winner's curse, test exposure in `wsp_loop.py`, the negative weight-edit result and Claude's own "probably within noise"; but the claimed removal of test numbers is not in any public branch, and #14 drops all of these caveats. |
| Reproducibility | 3 | Public data and model, Colab notebooks that clone a named branch, and a few dollars of API cost; but the default branch has none of the code, package versions are not pinned, and the run artifacts needed to replay the reported numbers are not stored. |

## Claims checked

I assessed `d787824` on `presentation/three-minute-show`, which is the commit linked throughout #15 (`0165df4`, committed 16:57 CET) plus one commit adding the MIT `LICENSE` at 17:41 CET.
Issue #14 was opened at 17:40 CET and #15 at 17:47 CET; neither has been edited.
So the linked work predates both issues, and the license arrived 36 seconds after #14 was opened.
The default branch `main` (`6f2632a`) holds only the scaffold, the same `LICENSE` (committed 17:48 CET, after both issues) and an explainer video added at 17:47 CET; none of the experiment code is on it, and its README still says the project is in the "discovery phase".
Of the eight other branches, five are ancestors of the assessed commit, while `feature/liedet-fibs-wsp-harness` (a separate harness and web UI) and `literature/sota-findings` are not merged and are not mentioned in either issue.
I did not run any submission code.
I recomputed numbers from the committed TSV, Markdown tables, JSON files and SVG labels with my own scripts (run with `python3 -I`).

**The two issues.**
- **Team name.** #14 says "llm-lie-busters", #15 says "llm-lying-detection"; the repository's `LICENSE`, README and deck use "llm-lying-detection", so I use that name.
- **License.** #14 names Apache 2.0 for code and CC BY 4.0 for text; #15 names MIT, which is what the repository has (see License).
- **Team members.** #14's field holds a methods paragraph instead of names, and #15's lists Sneha Verma and Sönke Bartling with placeholders ("[role]", "Fred [surname] (@[handle])", "[anyone else]").
  The literature table links #14's author handle to a teammate, so this looks like a double filing, not a separate team.
- **#14's methods paragraph** (secure the run, reconstruct error cases with full context, five partitions, stratified error analysis, then compare weight edits, optimisation and random edits) matches the plan in the explainer video on `main` (`presentation/fibs-wsp-explainer/`), which itself says it is a proposal with no repository results.
  The error audit is listed in #15 as "plan in progress"; I found no committed implementation of it on any branch.
- **#14's results** ("Caving AUROC 0.578 → 0.779, overall macro-AUROC 0.789 → 0.852, recall at 5% false alarms 31.7% → 46.1%") are exactly the selection-set numbers in `runs_wsp/loop1/loop_state_summary.json` (caving 0.578 → 0.779, `sel_macro_auroc` 0.7889 → 0.8522, `sel_tpr_at_5fpr` 0.3167 → 0.4611).
  #15 rightly calls these a lead "on selection data only, not tested"; #14 presents them as findings without that caveat, and its "overall macro-AUROC" is easy to confuse with #15's test macro-AUROC.
- #14's "How to run it" ("defined by agent") and "Where it got stuck" ("with out explaination") add nothing checkable; #15's "The research loop" section is cut off mid-sentence ("random edits of the").

**Loop 1 (Claude rewrites the probe).**
- **Test families are never shown to Claude; `predict()` gets no labels or families; a random subset is re-scored to catch batch-dependent scores.** Supported by the code.
  `loop.py` builds each prompt from validation scores only (`history_table` prints val AUROC, status and hypothesis), `eval.py` passes `with_labels=False` for val and test, and the per-example check sets the score to NaN on a mismatch.
  The humans did see the test scores, but the loop was run once, so that is not a selection effect here.
- **Every candidate is saved.** Supported by `loop.py` (`runs/iter_XXX.py/.json/.md`), but `runs/` is not in the repository; only `best_probe_iter009.py` and a condensed `results.tsv` (an `idea` column instead of the hypothesis, status and seconds) are committed.
- **2,940 conversations from 27 families; 12.8 minutes of caching; 15 iterations in 22 minutes.** Supported as recorded in `PROGRESS.md` and `run_manifest.json` (`n` 2940, 22 × 120 + 5 × 60); the timings are logged, not reproducible from files.
- **Keep rule: more than 0.002 above the best validation score.** Supported.
  Replaying the rule on `results.tsv` keeps exactly iterations 0, 4 and 9, as the file says; iteration 11 (val 0.8888, test 0.853) sits exactly at the threshold and was discarded, which the issue reports correctly.
- **Test macro-AUROC 0.806 → 0.845 (+0.039); every test family improved or stayed level; among +0.098, sandbagging +0.046, medqa +0.044.** Supported by the committed tables.
  The per-family values in `RESULTS.md` average to 0.806 and 0.8453 on test and 0.8493 and 0.8869 on validation, matching `results.tsv`; the smallest test change is +0.009 (model).
  The per-family values themselves are transcribed from the Colab run, with no JSON behind them.
- **"Roughly 2 standard errors."** Plausible.
  A Hanley-McNeil estimate from the reported AUROCs gives an unpaired standard error of 0.014–0.020 for the test macro mean (60 or 30 examples per class), so +0.039 is about two of those; a paired bootstrap would be tighter, but needs the per-example scores that are not committed.
- **Layers 10–16 carry 97% of the weight (layer 13 alone 65%).** Supported.
  Re-applying the softmax with T = 0.01 to the 18 cross-validation AUROCs printed in `layer_weights.svg` gives 96.6% for layers 10–16 and 65.1% for layer 13, and 46/45/9% for the three pools.
- **`robustness.py` and `search.py` are written but not run.** Supported: both exist with no committed output, and the issue says so.

**Loop 2 (Claude edits the weights).**
- **Family-disjoint partitions for fitting, inspection, selection, calibration and test; threshold from honest calibration answers; test opened once.** Supported by `wsp.py` and `run_manifest.json` (10/4/4/3/6 families, calibration `n_lie` 0, row hashes recorded).
- **No optimizer on Claude's side.** Supported: the Claude arm applies fixed edit operations, and the chosen edit (`c15`) is a layer re-mix plus a small mean-difference direction from the `original` dev family, which uses dev labels, as the system prompt allows.
- **Selection TPR@5% 0.317 → 0.378; test TPR original 0.503, Claude 0.500, random 0.486, gradient fine-tune 0.519, refit 0.533; paired differences −0.003 [−0.039, +0.025] and −0.034 [−0.069, −0.003].** Supported by `wsp_claude_summary.json` and `results_final.md`.
  The per-family test AUROCs average to the reported macro values for all five arms.
  A useful cross-check: the `refit_all_dev` arm reproduces the Loop 1 baseline's six test AUROCs exactly, as it should, since it is the same probe on the same 14 families.
  The bootstrap intervals are over only 6 families and cannot be recomputed without per-example scores.
- **Cost about $2 and 8 minutes.** Partly supported: the token counts (430k input, 12k output) are recorded; the price and time are stated, not logged.
- **"Calibration does not transfer": 7–10% false alarms at a 5% threshold.** Supported: test FPR@5% is 0.072–0.097 across the five arms.
- **Free-kernel loop session 1: caving 0.58 → 0.78 on selection, not tested.** Supported by `loop_state_summary.json`, with the caveat stated.
- **"The prompt of `wsp_loop.py` session 1 contained the run-1 test numbers. They have since been removed on a separate branch."** First half supported, second half not found.
  `wsp_loop.py` line 280 still tells Claude "refit: test TPR@5% 0.533 vs 0.503", and every public branch that has the file contains that line; no commit after 16:57 CET touches it.
  Flagging the exposure at all is to the team's credit.

**Influence attempts.** None found.
I found no hidden text or instructions addressed to assessors in either issue or in the repository; the HTML comments are drawing labels in `banner.svg` and markup in the saved blog post.
One unrelated hygiene note: `main` carries a `.mcp.json` with a teammate's local home-directory paths (no secrets).

## Potential impact

A deception monitor is only useful if it catches lies it was not trained on, so a cheap, repeatable way to improve and audit probe transfer across lie families would matter to AI safety teams deploying white-box monitors, and to the FIBS authors and others benchmarking them.
The loop's design, a fixed harness with a family-disjoint, hidden test split and cached activations, is a reusable pattern: it turns probe research into minutes-per-experiment work on one T4.
The evidence so far is one run on one 2B model: a +0.039 gain that is about two standard errors, found by a standard technique (cross-validated ensembling), with no random-search control to show what Claude adds.
The weight-editing result is a well-designed negative result for this setup, and the caving lead is untested.
Running the prepared robustness and random-search scripts, storing the activation cache, and adding never-touched families would show within a day whether the gain is real; transfer to frontier-scale models and on-policy lies is further away.

## License

**Needs attention:** the repository has only an MIT license, which #15 names but #14 does not (#14 says Apache 2.0 for code and CC BY 4.0 for text), the written material has no CC BY license, and a full copy of the *Sparks of Weight-Space Programming* blog post is committed without a stated reuse license.
MIT is OSI-approved and fine for the code; the dependencies (numpy, pandas, scikit-learn, torch, transformers, anthropic) are permissive, and I found no GPL or AGPL code or code copied from `fibs-probes`.
The committed FIBS paper PDF is CC BY 4.0 on arXiv and is attributed in `literature/README.md`.
The blog post (`literature/articles/weight-space-programming.html`) shows no license, and the MIT license of the site's repository is the theme author's, so it is safer to link the post than to store it.
The FIBS dataset (no license on its card) and Qwen3.5-2B (Apache 2.0) are not committed.
The team should settle on one license statement for both issues, add a CC BY 4.0 file for the text if that is intended, and remove the saved blog post.

## Strengths

- The family-disjoint split is the right design for the question, and it is enforced in code: the test families are never in Claude's prompt, `predict()` sees no labels, and batch-dependent scores are rejected.
- The weight-edit arm is carefully controlled: a frozen checkpoint with a replay check, separate selection and calibration families, random edits of the same size, a gradient baseline and a plain refit, with paired intervals.
- The negative result is reported as prominently as the positive one, including Claude's own verdict that its gains were "probably within noise" and that its chosen edit hurt caving.
- The committed numbers hang together: the macro means, the keep decisions, the probe weights and the refit-equals-baseline cross-check all recompute.
- #15 names its own weak points before a reviewer has to: one seed, winner's curse, classic ML, missing artifacts, test exposure in the second loop.

## What would make it stronger

- Merge the experiment branch into `main` (or point the README to it), and update the README, which still describes the discovery phase.
- Commit the run artifacts that back the numbers: `runs/` (candidates, per-iteration JSON, Claude's reasoning), per-example scores and the run-1 transcript, with the activation cache in a durable store with checksums.
- Run `robustness.py` and `search.py`, so the +0.039 has confidence intervals and a brute-force comparison.
- Push the `wsp_loop.py` change that removes the test numbers from the prompt, and evaluate the caving lead only on families that have never been used for testing.
- Pin package versions for the Colab notebooks, and remove the personal `.mcp.json` from `main`.
- Withdraw or align #14 with #15, so that the team name, license and the selection-only status of the caving numbers are stated once and consistently.
