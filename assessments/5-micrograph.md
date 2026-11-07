# #5 micrograph: an agent loop that tunes classical grain segmentation on optical micrographs of metals

https://github.com/VanishJr/micrograph-impact-lab at commit `91758551f37d54d94130ab69cd00a8ee68ac0d40`

The team built a two-level loop in which Claude plans, reviews and extends a scikit-image watershed pipeline, while code alone measures the grains.
It was scored against expert masks of 316L stainless steel and a synthetic testbed with exact labels.
On real steel the loop brought the dev error from 1290% to 12.6%, and to 17.4% on 165 unseen holdout images, so it misses its own 10% target, as the team says plainly.
I downloaded the public 316L masks from Zenodo and recomputed every 316L number in the issue exactly from them and the committed predictions.
The write-up is candid about the missed target, the hand-set final configuration, the missing noise sweep and the bugs.
Its weakest points are a literature step that ended up mostly working from memory, and synthetic and defect results that nobody outside the team can check.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Automatic grain sizing without per-material hand-tuning is a real, recurring metallography need, and it is checked here against public expert masks with a fixed dev/holdout split; the noise part of the question was not addressed, and the issue widens the problem to orientation, which the loop does not measure. |
| Loop | 4 | Plan, literature, execute, verify (with contour drawings) and record leave one directory per iteration plus `state.json`, `JOURNAL.md` and `TASKS.md`, and the outer loop added h-maxima markers and defect detectors with tests in response to reviews; but the 316L literature step fell back to memory, and the final 316L configuration was set by the outer loop, not by the planner. |
| Evidence | 4 | Every 316L figure (baseline, iterations 6–8, 11, 12 and holdout) recomputes exactly from the Zenodo masks and `outputs/predictions.csv`; the synthetic and defect numbers agree with the committed per-image records, but their ground truth is not public, and the scripts behind the figures are not committed. |
| Honesty | 4 | The missed target, the dev–holdout gap, the hand-set iteration 11, the missing noise sweep, the bugs and the pre-fix medians are all disclosed; but the 316L literature notes saying that they come "from memory, not retrieved sources" are not surfaced, and the per-image pass rates that the medians hide are not reported. |
| Reproducibility | 4 | There are clear `uv` commands, a lock file, 42 offline tests, a dry-run mode and a public 316L dataset; but the synthetic half cannot be rerun by others, the dataset folder layout has to be built by hand from Zenodo's `Grain.zip`, and live planner runs are not deterministic. |

## Claims checked

I assessed HEAD `9175855` (committed 16:47:42 CET).
The issue was opened one minute later, at 16:48:43 CET, and edited at 16:53 CET.
The repository link in the issue is not pinned to a commit, and nothing was committed after HEAD.
I did not run any submission code.
I downloaded `Grain.zip` from Zenodo record 22039777 (its MD5 matches the record's `archive_checksums.csv`).
I then recomputed the 316L ground truth with my own script (4-connected components of mask = 1, interior grains by bounding box, run with `python3 -I`), and combined it with each iteration's committed `predictions.csv`.

- **316L table: baseline 1290%, iteration 7 23.5%, iteration 11 12.6%, holdout 17.4%.** Supported exactly.
  My recomputation gives the recorded `n_true` and `n_pred` for all 40 dev and 165 holdout images, and the recorded `max_rel_error` for every run: 12.885, 0.2353, 0.1259 and 0.1739.
  Count and size errors match too: iteration 11 is 11.1% count (+6.5%) and 12.6% size (−8.9%), and the holdout is 17.4% (+9.1%) and 16.3% (−10.7%).
  The split files match the dataset's `val` (40) and `test` (165) folders exactly.
- **Iteration 8 (28.2%) and iteration 12 (16.7%).** Supported.
- **Pre-fix size medians (README).** Supported, and a nice check of the team's own correction.
  My NaN-free recomputation gives 69.2%, 43.6%, 10.7% and 11.0% for the baseline and iterations 6–8, exactly the corrected values in the README.
- **Iteration 11 was set by the outer loop on the reviewer's suggestion.** Supported.
  The reviews of iterations 7 and 8 both propose `fill_boundaries=false` (`verify.json`), and the JOURNAL entry of 15:21 records `run.py --params`.
- **The 4.8-point dev–holdout gap suggests partial fit to dev.** The claim is plausible, and the README rightly adds that the holdout may simply be harder.
  The holdout's true grains are somewhat larger (median 86 px against 81 px) and come from a different mix of image series, so these data cannot separate the two explanations.
- **Synthetic: 33.3% → 6.1% dev, 4.6% holdout.** Supported by the records.
  The medians recompute from `per_image` in each `execute.json`, and the grain counts per image match `predictions.csv`.
  The ground truth is not redistributed, so I could not check it independently; the team discloses this.
- **"Two of six grain morphologies stay above 10% (worst: 15.0% dev, 12.8% holdout)."** Partly supported.
  On dev (iteration 10), elongated (15.0%) and equiaxed (13.5%) are above 10%.
  On the holdout only equiaxed is (12.8%), while elongated is at 9.3% with two images per family.
- **Scratches 47% found (precision 39%), pores 64% (precision 17%).** Supported (iteration 9 `defects` in `execute.json`).
  These numbers mix measures: the percentages found are object detection rates (104 of 219, 148 of 233), while the precisions are pixel-level.
  At object level, 1,763 of the 1,911 predicted pores touch no true pore.
- **Scratch filter on 316L: 1,233 false "scratches", error rose to 16.7%.** Supported (`iter_012/outputs/defects.csv` and `execute.json`).
  "False" rests on the reviewer's reading of the overlays, since 316L has no defect ground truth; the README says so.
- **Bugs: NaN median, a parameter copied from a docstring, a planner-set threshold, uncaptured URLs.** Supported.
  Iteration 3 failed on `overlay`, iteration 2 records `target <= 0.2`, and iteration 1's `literature.md` lists no sources.
- **Literature: "the URLs the librarian retrieved are listed in each `literature.md`".** Partly supported.
  Only two literature steps ran, in iterations 1 and 6; the other files point back to them.
  Iteration 1's notes draw on sources (including h-maxima for over-segmentation, which the loop later adopted), but no URLs were captured.
  Iteration 6 lists 36 retrieved URLs, but its own text begins: "I couldn't do the literature search for this step … these notes come from memory, not retrieved sources", and it ends "None of the above is literature-backed".
  The JOURNAL presents iteration 6 as "the sources fix works live" without mentioning this, and neither the README nor the issue does either.
  The iteration 8 reviewer did flag that the ASTM figures were unverified.
- **42 tests.** Supported: 37 test functions, plus two parametrisations, give 42.
  "42 tests on a Voronoi micrograph" is loose: the leakage, split, LLM and loop tests do not use the fixture.
- **Leakage guard and fixed split.** Supported.
  `tests/test_leakage.py` scans `src/methods/` for ground-truth and split tokens, and the methods take only image paths.
  `src/evaluate.py` is the only reader of masks, CSVs and `artifact_mask`.
- **The holdout was touched once.** Consistent with the repository.
  `final.json` and both `final_*` directories appear in a single commit (`974e9af`, 15:22), and `run.py --final` refuses to run a second time.
- **Figures.** Supported.
  The 156/20/19 counts for U_03_03 and the 877/383/236/236 counts for columnar_duplex_00 match `execute.json`.
  All ten per-image labels in `docs/ten_random_316L_holdout.png` match `final_316L/execute.json`.
  The scripts that drew the figures are not committed.
- **API spend of about $3.10.** Supported.
  Pricing every `usage.json` at the JOURNAL's stated rates gives $2.99, plus up to 10 web searches.
- **SEM image result (38 vs 113 grains).** Unverifiable: neither the image nor the run is in the repository, as the team says.
- **Open-problem paragraph.** The issue text differs from `SUBMISSION.md`, which the scientist checked.
  It adds that orientation affects "electromagnetic properties" and predictability, which the loop does not study, and it misspells Hall–Petch as "Hall–Patch".
- **Influence attempts.** None found.
  The repository's `CLAUDE.md` repeats the public judging criteria as guidance for its own sessions, which I count as preparation.
  I found no hidden text, HTML comments or instructions addressed to assessors in the issue or the repository.

## Potential impact

If a loop like this reached about 10% on count and mean size without hand-tuning, metallographers could get an ASTM-style grain size from a few labelled images of a new alloy or etch.
That would remove one of the most repetitive manual steps in materials QA.
It would also give classical, explainable pipelines a reported error against ground truth, which the team rightly notes is rare.
Likely users are materials labs and process engineers who already have optical micrographs and a handful of annotated images.
Learned segmenters that need much more training data would be the comparison point.
The evidence puts the loop a clear step short of that.
One global scale cannot fit fine-grained and coarse-grained images at once.
On the holdout only 24 of 165 images have both count and size within 10%, and the tuned settings did not transfer to an SEM image.
Per-image scale estimation and a learned baseline, which the team names, are the obvious next tests of whether the approach can close the gap.

## License

**OK.**
The code is under Apache 2.0 (`LICENSE`, `pyproject.toml`) and the text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states.
The dependencies in `uv.lock` are permissive, with no GPL or AGPL code.
The two sample images and masks in `data/sample/` are byte-identical to `Grain/train/` in Zenodo record 22039777.
That record's metadata licence is CC BY 4.0, and the 316L overlays and figures carry that attribution.
The synthetic images are kept out of the repository, and the one synthetic figure is published with the scientist's consent.
One small refinement: the Zenodo record is a curated 2026 benchmark by WUT-AI-AI4Mat, derived from Warren et al. (2024), and its README says some masks were "manually annotated or corrected".
So the attribution "Warren et al. 2024, Zenodo …" should also credit the deposit's creators.

## Strengths

- The real-data result is fully checkable.
  Every 316L number recomputes exactly from a public dataset and the committed per-grain predictions, and the holdout was used once.
- It is an honest negative result: the 10% target is missed on dev and holdout, and the README leads with that.
- The two-level design works as intended.
  The reviewer read contour drawings, diagnosed "ladder" over-segmentation, and the outer loop added h-maxima markers test-first.
  That cut the columnar error from 51% to about 5%.
- It corrects itself.
  The loop caught a planner that set its own looser threshold and a pooled metric that hid failing morphologies (it added `worst_family_rel_error`).
  It also caught a NaN in the evaluator, and correctly traced suspected "broken masks" to edge grains instead of excluding them.
- Data provenance is handled with care: the synthetic set is treated as a testbed, not evidence, and is not redistributed.

## What would make it stronger

- Say in the README and the issue that the 316L literature step fell back to memory, and rerun it so that its claims carry citations.
- Report per-image pass rates next to the medians: 8 of 40 dev and 24 of 165 holdout images have both count and size within 10%.
- Commit the scripts that draw the figures, and a small helper that turns Zenodo's `Grain.zip` into the expected dataset layout.
- Run the planned controlled noise sweep, for example on the 316L images with added noise, so the second question can be answered on data others can reuse.
- Try per-image scale estimation, and a learned segmenter as a baseline.
- Keep the issue text in line with the scientist-checked `SUBMISSION.md`, and credit the Zenodo deposit's creators.
