# #10 KaAnOm: Three AI-agent approaches to speaker profiling: what they found and how far to trust it

https://github.com/panndabea/french_language_lab at commit `e7ac598e2f766f23917ab300f8d64a2b9083bb72`

KaAnOm compared three ways of using AI agents to infer the age, sex and recording wave of speakers in 192 blinded interviews from the ESLO corpus (Orléans, 1968–71 and 2008–12).
The issue points to an attached slide deck for its loop, findings and next steps, and to "the code of the third approach" for running it; the repository contains only that third approach (C), a grounded LLM evidence loop with a deterministic rule fallback.
For approach C, every headline figure I could recompute from the committed `evidence_frozen.json` and `evaluation/evaluation.json` matches: gender and wave 100% on the 99 interviews the LLM completed, and age 86.8% exact (59/68) with all nine errors in the adjacent bracket.
The write-up is exemplary in separating measured results from interpretation and hypothesis, and in recording its own mistakes.
Approaches A and B, which carry most of the slides' linguistic findings, are not in the repository, and the committed quotes from the corpus raise licensing and data-protection questions (see License).

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 3 | Recovering speaker metadata from blinded transcripts is computationally checkable against the speaker table and bears on how well such corpora can be blinded, but the issue states the open problem only loosely, and the task is a set exercise rather than a question the field has open. |
| Loop | 4 | Approach C has test-first code, a dated `JOURNAL.md`, `TASKS.md` and `PROMPT.md` for resumption, verbatim quote checks, and predictions frozen and hashed before labels were read; it does not read literature, and the other two loops are not in the repository. |
| Evidence | 3 | Approach C's LLM results recompute exactly from committed files and its frozen code hashes match the snapshot, but the rules-fallback figures, costs and the "+1 year" finding depend on uncommitted files, and the slides' findings from approaches A and B have no artifacts in the repository. |
| Honesty | 5 | Every statement in `FINAL_RESEARCH_REPORT.md` is tagged measured, interpretation or hypothesis; the hard stop, selection bias, in-sample pilot tuning, single run, the S118 rule bug and the author's own wrong manual check (S002) are all disclosed, and the slides rate each finding's trustworthiness. |
| Reproducibility | 2 | The 96 unit tests need only the standard library, but the transcripts, `predictions_frozen.csv`, the `outputs/` run records and the ground truth are not committed, the README still describes the earlier starter, and the issue's run instruction is "see code of the third approach, produced with /goal". |

## Claims checked

I assessed HEAD `e7ac598` (the only commit, "complete", 17:03 CET, two minutes before the issue was opened at 17:05 CET); the issue has not been edited.
Because there is a single commit, git history cannot show the order of work, so test-first claims rest on `JOURNAL.md`.
I did not run any submission code.
I read the slides as text from the attached `presentation_v2.html` (with tags stripped; its one script is slide navigation), and recomputed approach C's numbers with my own script (run with `python3 -I`) from `evidence_frozen.json` and the error list in `evaluation/evaluation.json`.
The ground truth is not committed, so accuracy is recomputed as answered minus listed errors.

- **Approach C on the 99 LLM-completed interviews: gender 100%, wave 100%, age 86.8% exact (95% CI 76.7–92.9%) at 68.7% coverage, 100% within one bracket.** Supported.
  `evidence_frozen.json` has 99 `llm` rows, all with gender and wave answered, and 68 with an age bracket.
  The error list has no gender or wave errors for LLM rows and nine adjacent-bracket age errors, giving 59/68; my Wilson interval is 76.7–92.9%.
  Seven errors are one bracket too young and two too old, as reported.
- **Run status: 99 completed, 3 failed (S036, S074, S099), 90 unprocessed.** Supported by `llm_status` in `evidence_frozen.json` and by `REPRODUCIBILITY_SNAPSHOT.json`.
  The LLM rows are S001–S101 plus the pilot interview S163.
- **Age accuracy by self-reported confidence: high 26/29, medium 19/19, low 14/20 with 31 abstentions; abstaining on low would give 45/48.** Supported, recomputed exactly.
- **Recording years estimated by the LLM: 1968–1972 for all 59 ESLO1 interviews, 2008–2012 for all 40 ESLO2 interviews (27 at 2010).** Supported as the LLM's estimates.
  That ESLO2 was "recorded around 2008–2012" (slide 6) is the model's inference from quotes such as `on est en deux mille dix`; the ground truth has no recording years to check it against, as the report says.
- **Whole-corpus figures: gender 99.5% at 96.4% coverage, wave 100% at 77.1%, age 88.2% at 39.6%.** Partly supported.
  The rules-fallback predictions for the 93 other interviews are in the gitignored `predictions_frozen.csv`, not in `evidence_frozen.json`, so only the LLM part can be recomputed.
  The figures are consistent with the error list (one rules-fallback gender error, S118; no wave errors) and with `evaluation/results_table.md`.
- **Gold sex f 100 / m 92 and wave ESLO1 117 / ESLO2 75.** Consistent: the processed and unprocessed counts in the selection-bias table add up to these totals.
- **Predictions frozen before the ground truth was opened.** Supported as far as the repository can show.
  `evidence_frozen.json` and every source, prompt and test file listed in `REPRODUCIBILITY_SNAPSHOT.json` match their recorded SHA-256 hashes.
  The files that read labels (`evaluate_full.py`, `make_charts.py`, `results_table.py`) are absent from the snapshot, consistent with being written after the freeze.
  The inference and merge code never reads a label file.
  The journal's account (ground truth found at 16:06, after the 16:03 freeze) cannot be checked from the repository.
- **96 unit tests pass.** Partly supported: there are 96 `test_` functions, and the tests use only inline fixtures; I did not run them.
- **Cost $42.18 measured, median $0.39 per interview; 285 calls, 11 retries.** Unverifiable: the cache, run log and cost records in `outputs/llm_full/` are not committed.
  The completed rows record 10 retries in their provenance; the failed interviews may account for the eleventh.
- **Gold age is one year above self-reported age in 14 of 22 cases.** Unverifiable from committed files, since the rule evidence for the LLM-processed rows and the ground truth are not committed; it is labelled a hypothesis where it explains errors.
- **Approach A (linguistic features: wave 86.5% rule, 93.2% k-means; sex 100% of 190; age 37% against a 41% baseline) and approach B (wave AUC .979; sex 78%, 160/192).** Unsupported by the repository: no code, data or results for A or B are committed.
  The slides say themselves that "figures for approaches B and C are taken from their own reports and were not recomputed here".
- **Language-change findings (slide 6: `ne` retention .34 → .14, `nous` share .11 → .04, `voilà` reversing, `moi je` rising with age).** Unsupported by the repository; they come from approaches A and B.
  The slides rate the single-pipeline ones "low–med." and call their detectors unvalidated, which is a fair framing.
- **Data and anonymization.** Partly supported.
  The slides describe how the transcripts were blinded (files renamed and shuffled, speaker IDs relabelled, headers stripped, spoken speaker codes masked, text unchanged), and the corpus itself masks surnames as `NPERS`.
  No transcripts are committed (`.gitignore` excludes `*.trs` and `data/`), and I found no API key in the repository.
  But `evidence_frozen.json` holds 3,824 verbatim quotes (about 158,000 characters) and, for each LLM row, an "exploratory" profile of occupation, residence and life moves, some detailed enough to be identifying together with age and sex.
  The team's own `REPORT.md` says these outputs "contain raw transcript text; treat output files with the same access controls as the corpus", and §9 of the final report says the same, so publishing them sits uneasily with the issue's confirmation of "no non-anonymized private data".
  The journal records the user's permission to send transcripts to the Anthropic API; it does not record permission to republish quotes.
- **"It didn't got stuck."** Contradicted in part by the repository: the LLM run was hard-stopped at 101 of 192 interviews, which the report and slides state clearly.
- **Influence attempts.** None found.
  I found no hidden text or instructions addressed to assessors in the issue, the slides or the repository.

## Potential impact

If the loop worked well, it would give sociolinguists and corpus maintainers a measured answer to how much speaker information leaks through "blinded" transcripts.
That matters for the anonymization of spoken corpora shared under data-protection rules, and for metadata recovery in archives where the speaker table is incomplete.
The comparison of three ways of using agents, from writing feature code to letting the model judge the text, is itself useful to researchers deciding how much to trust agent-produced corpus findings.
The evidence so far shows that sex and wave are almost fully recoverable, and age to the decade for about two thirds of speakers, with every decision traceable to a checked quote.
It is still some way from a robust result: one corpus, one LLM run on the first 99 IDs with pilot interviews in the evaluation, a probable mismatch in how the gold age is defined, and linguistic findings from two pipelines that are not published.
Finishing the 90 untouched interviews as a held-out set, and committing approaches A and B, would show which of these findings hold.

## License

**Needs attention:** add licence files at the root, and remove or relicense the committed ESLO transcript quotes, which the slides say are under CC BY-NC-SA 3.0 and so cannot be published under the CC BY 4.0 named in the issue.
The repository has no `LICENSE` file, although the issue names Apache 2.0 for code and CC BY 4.0 for text.
`evidence_frozen.json` and the French examples in the reports copy text from the ESLO transcripts, which the slides attribute to Université d'Orléans/LLL under CC BY-NC-SA 3.0; the slides themselves are declared "shared under the same licence, for non-commercial use only", which contradicts the issue's CC BY 4.0 confirmation.
The data-protection point under Claims checked argues for the same fix.
The code depends only on the standard library, `anthropic` and `matplotlib`, all permissively licensed, and I found no copied third-party code.

## Strengths

- The evaluation protocol is sound: predictions and evidence were frozen and hashed before labels were read, and the committed hashes match.
- Every LLM claim is grounded by code: quotes must be verbatim substrings of the cited segment, with the right speaker and range, and failures are retried once and then fall back to rules.
- The report is a model of calibrated reporting, with measured, interpretation and hypothesis tags, coverage reported separately from accuracy, confidence intervals and a selection-bias check.
- The loop noticed early, from transcripts alone, that the "2005" label could not be a literal recording year, and kept a strict year field and a cohort field apart instead of forcing the label.
- It records its own mistakes, including the manual check that wrongly faulted the model on S002, and a lesson drawn from it.
- Spending was approval-gated, budget-guarded and cached, and the cost of each design option is estimated.
- The slides compare the three approaches candidly, including where an agent saw labels too early (A) and where pipelines disagree (sex 78% vs 100%, speech rate).

## What would make it stronger

- Add `LICENSE` files and resolve the quote licensing: either remove `evidence_frozen.json` and quoted examples from the public repository or publish them under the corpus's terms.
- Commit approaches A and B, or link to them, with their outputs, so the slides' linguistic findings can be checked.
- Run C on S102–S192 as a held-out set, with repeated runs to estimate variance, as the next steps propose.
- Commit the run records needed to recompute the remaining figures (rules-fallback predictions, cost ledger), within what the data licence allows.
- Update the README to describe the final pipeline and how to run and evaluate it, with pinned dependencies.
- Write the issue sections in full rather than "see slides", so the submission stands on its own.
