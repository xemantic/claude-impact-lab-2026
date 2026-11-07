# #7 BauCode: a wider lens on material use in sustainability and well-being for engineers, architects and researchers

https://github.com/veterdney/claude-impact-lab-2026 at commit `8a067728d73008dc31a64bcf6f598e6ffaf74056`

BauCode built two loops around embodied carbon in German residential construction.
Loop A scores six structural systems at three levels (layer, building part, whole building) from the Ökobaudat 2024-II export and a 40-material property dataset, and ranks timber frame with straw infill and clay plaster first (68.6 of 100, lowest life-cycle carbon at 140 kgCO₂e/m²).
Loop B is a small, boundary-aware wall calculator on synthetic data, with a regression harness and a deliberate fault injection.
The committed results are internally consistent: the totals recompute from the layer and part CSVs, my own Glaser implementation reproduces the straw-wall moisture result, and the Loop B numbers match a hand calculation.
The team is candid that the ranking is "a structured hypothesis" resting mostly on assumed ratings; the main gaps are that the Ökobaudat export is not committed, one headline moisture figure in the issue is from before the dataset fill, and the two loops are not yet connected.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 3 | Making life-cycle carbon boundaries explicit in early design is a real and timely problem (GModG life-cycle reporting from 2027), and question B is checkable; but question A is a weighted multi-criteria ranking whose non-carbon half rests on assumed ratings, so only part of it can be settled by computation. |
| Loop | 3 | Five rounds wrote and ran code, caught their own data and wording errors, and test-first checks tie the loop page to the CSVs; but state files, a task list and a journal only started in round 4, no step reads literature (stated), and Loop B is a software-QA harness rather than a research loop. |
| Evidence | 4 | Scores, ranks, life-cycle GWP and sensitivity results are committed as CSV/JSON and recompute consistently, the Glaser result and the Loop B totals reproduce independently; but the Ökobaudat-derived inputs are not committed, and the issue's 1.055 kg/m² condensation figure is the pre-fill value (the current report says 1.842). |
| Honesty | 4 | Confidence levels, the mostly ASSUMED property data, ignoring `RESEARCH-LOOPS.md` in rounds 1–3, the known harness failure and agent-written expectations are all stated; a few statements are slightly generous (steel "always" top three is 399 of 400, the straw wall is no longer "on the boundary" after the fill). |
| Reproducibility | 4 | Loop B runs on the Python standard library from committed inputs with committed expected outputs, and Loop A has exact commands; but Loop A needs a 51.5 MB Ökobaudat export saved under a hard-coded file name with no checksum, and the repository's root README is still the event's, not the project's. |

## Claims checked

I assessed HEAD `8a06772` (committed 17:21 CET).
The issue was opened at 16:49 CET and last edited at 17:14 CET, so HEAD is later than both.
Three commits came after the issue was opened: the golden eval set (`87ac530`, 16:51), its merge (`aee18b1`), and the slide PDF (`8a06772`).
The issue does not mention them, and I did not credit them in the scores.
I did not run any submission code.
I recomputed numbers with my own scripts (run with `python3 -I`, kept outside the clone) from the committed CSV and JSON files, and reimplemented the Glaser check from `analysis/levels/engine.py`.

**Loop A**

- **Timber frame + straw + clay plaster ranks first with 68.6 (67.0 before the dataset fill).** Supported.
  `analysis/levels/report/scores_alternatives.csv` gives 68.57 and `analysis/levels/baseline/scores_alternatives.csv` gives 67.01.
  The volume-weighted mean of the part scores in `scores_parts.csv` reproduces every alternative's weighted and unweighted total to within 0.01.
- **First in 98 % of 400 draws; the steel frame is always in the top three.** Supported, with a small rounding.
  `report/sensitivity.json` records 391 of 400 wins for alternative 6 (97.75 %) and 399 of 400 top-three placings for steel (99.75 %, which the report rounds to 100 %).
  The draws vary cost and service life ±20 % per material and four 1–5 ratings by ±1 (`report.py`, seed 7); compatibility ratings and GWP are not varied.
- **Life-cycle carbon 140 / 243 / 288 kgCO₂e/m² for timber-straw, masonry and RC + EPS.** Supported as internally consistent.
  Summing `life_gwp_kgCO2e_m2` in `scores_layers.csv` times the part areas in `builds.py` gives 140.4, 243.5 and 288.1, matching `scores_alternatives.csv`.
  The per-layer GWP values themselves come from `analysis/products.csv`, which is derived from the uncommitted export, so I could not recompute them.
  The part areas per m² floor area are the team's own assumption (section 6 of the report).
- **Two of 142 interfaces are critical: render on EPS and lime plaster on straw.** Supported.
  `scores_interfaces.csv` has 142 rows (67 good, 73 caution, 2 critical); the EPS/render interface is critical on disassembly and the straw/lime-plaster interface on moisture.
- **Lime plaster on straw: condensation 1.055 kg/m² against a 1.0 limit; dries out in summer.** Partly supported; the figure is stale.
  The current report (`alt-6.md`) states 1.842 kg/m² condensing and 2.214 kg/m² evaporating.
  1.055 appears only in the round-3 card of `loop.html`, before the dataset fill.
  My reimplementation of `engine.glaser` for this wall gives 1.055 with the baseline inputs (U target 0.20, lime plaster μ 10, 280 mm straw) and 1.842 / 2.214 with the filled inputs (U target 0.28, μ 25, 200 mm straw).
  Both changes contribute about equally.
  So it does dry out in summer, but after the fill it exceeds the limit by 84 %, not by a small margin, and "sits on the caution/critical boundary" in *Where it got stuck* no longer holds.
- **The dataset fill changed 83 values, kept the winner and swapped places 5 and 6.** Supported.
  `dataset_fill_log.csv` has 148 rows, 83 marked `changed`, covering 23 materials mapped to 22 dataset rows (M02–M38).
  Of the changed values, 47 are tagged ASSUMED, 34 CITED and 2 UNVERIFIED-STD.
  RC + EPS and solid timber swap 5th and 6th (55.84 vs 55.26, a 0.6-point gap).
- **Every score, rank and sensitivity result is regenerated from the export and checked against the written report by a test.** Partly supported.
  `report.py` does write the README tables from computed values, which addresses the stale hand-written text the team caught earlier.
  But `test_loop.mjs` checks the loop page (`loop.html`) against the CSVs, not the written report.
  Its 14 checks are four structure checks and ten that tie page figures to files; I counted them and they match the claim of 14.
  One template label in `report.py` still says "[A] life, ratings, cost" in every layer table, although those values now come from the dataset.
- **Unit and category errors in the raw data (rock wool at 1,353 kgCO₂e/m³, concrete at 45,279), fixed with filters.** Supported as recorded in the round-1 catches of `loop.html` and in the density caps in `analysis/compare6/compare6.py` and `materials.py`; I could not inspect the raw rows.
- **The export holds 4,308 products.** Consistent with `analysis/01-data-and-scope.md` (44,973 rows, 4,308 UUIDs) and with the row check in `analysis/eval/obd_data.py`, but unverifiable without the export.
- **Rounds 1–3 ignored `RESEARCH-LOOPS.md`; goal, task list, journal and test-first started in round 4; two subagents in round 4.** Supported.
  `analysis/loop/JOURNAL.md` says so, and the T1–T4 commits (`b05823f` failing test, then `2f9bdf2`, `f319997`) follow the stated order.
  The journal also says round 5 used no subagent, which the page records.
- **Neither loop runs a literature search.** Supported.
  The property dataset's `.md` is itself a sourced review (BNB, EN ISO 10456, AgBB, GModG and others), but it was supplied by the team, not produced by the loop.

**Loop B**

- **Changing L2 from 100 to 160 mm moves A1–A3 from 185 to 230 and the known C1–C4 subtotal from 21.2 to 30.2; D stays separate at −2.** Supported.
  I recomputed these by hand from `demo/input/synthetic_wall.json` and its replacement: the board layer uses the median of three products (300 kgCO₂e/m³ × 0.2 m³), the insulation is 1.5 kgCO₂e/kg × 50 or 80 kg, and the coating is 5 kgCO₂e/m² × 10 m².
  `demo/output/*/result.json` match, including the known mass of 150 kg with `mass_complete: false`, because the coating has no density.
- **The injected density fault is caught and the harness exits 1.** Supported, with a caveat.
  In `tests/results_landscape_final_fault_20261107.json`, case C07 fails with 1200 against the expected 600.
  But the unfaulted run also exits 1, because of the known C19 failure, so the exit code alone does not show the fault; the C07 failure does.
  `tests/INTEGRATION_REPORT.md` says this plainly.
- **19 of 20 cases pass (known failure C19); the gallery checker passes 28 of 29.** Supported.
  Both failures are "originals unchanged since the frozen base commit" checks.
  They fail because human changes were merged afterwards, not because of a calculation error, as `tests/INTEGRATION_REPORT.md` explains.
- **A guard fix raised malformed-input probes from 2/15 to 15/15.** Supported by `tests/P2_REPORT.md` and `tests/repro_p2_before.txt`; not rerun.

**Other checks**

- **Consistency between rounds.** In round 2 (`analysis/compare6/scores.csv`), the steel frame ranks last (39.0) and masonry second.
  In rounds 3 and 5 steel ranks second.
  The scope and criteria differ between the two models, but neither the issue nor the report discusses this swing.
  It is a useful signal of how model-dependent the ranking is.
- **Influence attempts.** None found.
  The `.claude/skills/judge-submissions/SKILL.md` in the fork is byte-identical to the event repository's copy.
  The HTML comments in `demo/presentation/index.html` are only slide timing notes, and the slides contain no instructions to assessors.

## Potential impact

Germany's GModG introduces life-cycle greenhouse-gas reporting for buildings from 2027.
Architects and engineers will need early-design comparisons that state their system boundary (area, layers, reference unit, modules).
A transparent tool that keeps module D separate, never treats an unknown as zero, and flags moisture and disassembly problems at layer interfaces would help them.
Researchers, design teams and teaching would use it, and so might public clients that want to set comparable boundaries.
The wall calculator's strict handling of reference units and unknowns addresses a real source of error in EPD-based comparisons.
The team found such errors in Ökobaudat itself.
The loops are still some way from that goal.
Loop A's ranking depends on weights and on property values that are mostly assumed.
It is model-dependent: steel moves from last in round 2 to second in round 3.
Its generic datasets expire at the end of 2026, and the moisture check is steady-state Glaser.
Loop B has not yet been run on any real wall.
Connecting the loops and testing against real, documented walls would be the first steps toward decision support.
Hygrothermal simulation of the straw build-up and cited cost and service-life sources would come next.

## License

**OK.**
The code is under Apache 2.0 (`LICENSE`) and the text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states; both files are identical to the event repository's.
The analysis and demo use only the Python standard library and Node.js.
The eval set adds `anthropic` (MIT) and `pandas` (BSD), and the pages load Google Fonts (OFL) externally; none of these is GPL or AGPL.
The Ökobaudat export is not redistributed.
The property dataset quotes a few Ökobaudat indicator values and dataset UUIDs per material, with the source named.

## Strengths

- The accounting boundary is explicit throughout: modules are named, D is kept separate, unknowns stay UNKNOWN, and every assumption is tagged and listed in section 6 of the report.
- The results are internally consistent, and the moisture check is implemented faithfully: an independent reimplementation reproduces both the before and after values.
- The before/after design of the dataset fill (`MATERIAL_DATASET=0`, the baseline CSVs and a per-value log with provenance tags) makes the effect of each new data source auditable.
- The loop caught real problems in its own work and the data: Ökobaudat unit and category errors, six unsupported report sentences, a sensitivity scenario that min–max scoring made invisible, and a stale headline.
- Loop B's fixed expected values, malformed-input probes and negative control show careful thinking about what a test can and cannot show.
  Its reports refuse to turn known failures into passes.
- The write-up states its confidence level by layer and does not overclaim health or accuracy.

## What would make it stronger

- Update the issue and the loop page to the current straw-wall result (1.842 vs 1.0 kg/m²).
  Note that the dataset fill made this interface clearly critical.
- Explain why steel moves from last (round 2) to second (rounds 3–5).
  Report rank stability under different criterion weights, not only under input noise.
- Commit a SHA-256 of the Ökobaudat export, or `analysis/products.csv` if its redistribution is allowed, so Loop A's carbon figures can be checked without re-downloading.
- Replace the event README at the repository root with a short project README that gives the run commands.
  Mark the round-1 `analysis/README.md` ("Preferred system", with POCP as the health proxy) as superseded; the team's own harness flags it as unvalidated.
- Give the regression harness a passing baseline, for example by versioning the preservation baseline as the team proposes, so that the fault injection is visible in the exit code too.
- Connect the loops as planned: run Loop B's boundary checks on Loop A's real build-ups, then compare against one real wall with sourced EPDs.
- Add a literature step to the loop, for example checking straw-bale hygrothermal studies against the Glaser result before relying on it.
