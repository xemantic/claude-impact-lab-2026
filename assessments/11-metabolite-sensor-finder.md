# #11 MetaboliteSensorFinder: An agent that screens protein domains against human metabolites

https://github.com/MaxiHornisch/MetaboliteSensorFinder at commit `96585f9bbea12d7182e091fc1de7c2f59b55304e` (branch `main`)

MetaboliteSensorFinder submits a Claude Code subagent definition that orchestrates a three-stage funnel — bindPredict, then PSICHIC, then DiffDock — to find protein domains that may bind a given human metabolite, which is a real and well-chosen bottleneck in biosensor engineering.
The submitted branch holds the agent definition, an earlier single-prompt version, and three input tables; the dataset descriptions in the issue check out against those files almost exactly.
What is missing is a run: the issue itself says "TBD" for what the loop found, where it got stuck, and how to run it, and the repository contains no scores, no poses, no logs and no code.
The design principles encoded in the agent — record every score, state every threshold, flag low-pLDDT and borderline hits, checkpoint and resume, pilot before scaling — are thoughtful and unusually well aimed at the failure modes of this kind of screen, but they are so far specification rather than demonstrated behaviour.
An unmerged branch, `scaffold/initial-documentation`, contains a much larger body of code, tests, licenses and an exceptionally candid journal; it is not what the issue points to, and even there the pipeline workers are simulated.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Finding a domain that binds a chosen metabolite is an open, significant and computationally checkable problem, and the repository even commits a plausible ground-truth table (8,685 annotated domain–ligand pairs) against which a screen could be scored — but no success criterion or metric is stated on the submitted branch. |
| Loop | 2 | The submitted artifact is a prompt that describes a funnel over three published tools; nothing in the repository reads literature, writes or runs code, checks its own results or keeps state in files, and the agent was never run end to end. |
| Evidence | 1 | The only claims the repository supports are descriptions of its three input files; "What the loop found" is "TBD", and there are no score tables, docked structures, run directories or logs of any kind. |
| Honesty | 3 | The issue says "TBD" rather than inventing findings, and the agent definition mandates stating thresholds and flagging weak hits, but `SUBMISSION.md` presents an "Outputs" section as if outputs existed, never says that no run has happened, and the demo link it offers does not resolve. |
| Reproducibility | 1 | "How to run it" is an empty code block; there is no installation step, no environment file, no entry point, and no pinned version of bindPredict, PSICHIC or DiffDock, so a reader cannot reproduce anything from the submitted branch. |

## Claims checked

I assessed `main` at HEAD `96585f9` (committed 2026-11-07 17:01 CET).
The issue was created at 16:15 UTC (17:15 CET) and last edited at 16:18 UTC, so it was opened after the commit I assessed; nothing was committed to `main` afterwards.
Work did continue on the unmerged branch `scaffold/initial-documentation` until 17:27 CET, after the issue was opened.
I did not run any submission code.
I recomputed the dataset counts with my own scripts (`python3 -I`) from the committed CSV and XLSX files.

- **"413 InterPro-annotated domains across 100 human proteins, with sequences and domain boundaries."**
  Supported.
  `Test_sequences.csv` has 413 data rows, 100 distinct `uniprot_id` values and 284 distinct InterPro accessions, with `domain_start`, `domain_end` and `domain_sequence` columns populated.
  One nuance worth stating in the README: 156 of the 413 rows have `entry_type` `family`, not `domain`, and some of those spans are the whole protein (for example `A0JNW5`, residues 1–1462), so the "domain" set is coarser than the word suggests.
- **"8,685 human domains with experimentally annotated binding sites and their ChEBI ligands, spanning 3,864 genes — ground truth for evaluating the screen."**
  Supported.
  `metabolite_binding_sequences_human.csv` has exactly 8,685 rows and 3,864 distinct gene names (3,868 distinct UniProt accessions), covering 408 distinct ChEBI ligands, each row carrying binding-site residues and an evidence code.
  "Experimentally annotated" is partly supported: the evidence codes I sampled include `ECO:0000255`, which is sequence-analysis inference rather than experiment, so the table mixes evidence levels.
  Calling it ground truth is a reasonable ambition but it is never used as such anywhere in the submitted branch.
- **"`Test_set_metabolite_SIMLES.xlsx` — metabolite names with canonical SMILES and ChEMBL IDs — the ligand side of the screen."**
  Partly supported, and much smaller than the framing implies.
  The sheet has a header and two data rows: ATP and beta-D-glucose.
  The agent definition and the issue both describe screening "thousands of endogenous human metabolites" and "the full HMDB ligand set", and no HMDB ligand set is committed or fetched anywhere.
- **"domain-metabolite-screener is a Claude Code subagent that orchestrates a three-stage funnel."**
  Supported as a definition, unsupported as behaviour.
  `.claude/agents/domain-metabolite-screener.md` is a valid 50-line subagent definition with frontmatter (`model: opus`, `effort: medium`, tools `Bash, Read, Write, Edit, Glob, Grep, WebFetch, TodoWrite`) and prose describing all three stages, the AlphaFold trim step, the recording rules, batching and the budget constraint.
  There is no code, no wrapper script and no artifact showing it ran.
- **The design principles ("record everything, filter only what advances", "state your thresholds", "be honest about uncertainty", checkpoint-and-resume, budget discipline).**
  Supported as claims about the agent definition: each one appears in the file, in the words the issue quotes.
  None is enforced by anything other than the prompt, and none has been exercised.
- **"Agent_v1 — the earlier single-prompt version, kept to show how the design evolved."**
  Supported.
  `Agent_v1` (commit `8e80e77`, 15:24 CET) is an API-style agent config carrying the same pipeline in one `system` string; `fd31c58` (16:11 CET) replaces it with the subagent definition, so the two commits do show the stated progression.
- **Outputs: "docked structures (PDB/SDF poses) for good hits", "a list of domains and their predicted ligands", "a full table of bindPredict and PSICHIC scores".**
  Unsupported.
  These are the agent's intended deliverables, but `SUBMISSION.md` heads the section "## Outputs" with no statement that none exists yet.
  A reader skimming the repository could reasonably expect to find them.
- **"Demo materials: https://github.com/MaxiHornisch/MetaboliteSensorFinder/presentation — available on the github repository."**
  Contradicted.
  That URL returns HTTP 404, and there is no `presentation` file or directory on `main` or on the scaffold branch.
- **"What it would need next: running it on all human protein domains."**
  Consistent with the repository, though it understates the gap: a ligand library, the three tool environments and a first pilot run all come before scaling.
- **Unmerged work on `scaffold/initial-documentation`.**
  Recorded in fairness, not scored, since the issue links to `/tree/main`.
  That branch (HEAD `d1f7865`, 17:27 CET) adds `LICENSE`, `LICENSE-CC-BY-4.0`, `NOTICE`, a `src/msf/` package, a `msf screen` CLI, 14 further agent definitions, a 496-line `JOURNAL.md`, `TASKS.md`, ADRs and a test suite, and deletes the three data files and the screener agent.
  Its journal is strikingly honest — "No code runs yet. No benchmark exists. No result has been produced." — and it records a 39-check audit of which 16 failed, a peptide-filter rule that would have wrongly dropped 28 real domains, and the finding that the committed labels are undated and so cannot support a time split.
  Its own reported results are from simulated workers (`src/msf/screen/simulate.py`, `diffdock_sim.py`), with `msf screen run` deliberately refusing to run because no workers are configured, and `runs/INDEX.md` listing no runs.
  So merging it would raise the Loop and Reproducibility evidence considerably, but would not by itself add a real result.
- **Influence attempts.** None found.
  I searched the issue and both branches for text addressed to assessors or judges and found none, and no hidden or commented-out instructions.

## Potential impact

If this loop worked, the thing it would change is who can start a biosensor project.
Today, picking a sensing element for a metabolite that has no textbook sensor means either a literature search that returns whatever has already been studied, or a structural campaign that only a well-funded structural biology group can afford.
A funnel that spends sequence-level compute on thousands of domains and structural compute on dozens would let a cell-biology or synthetic-biology lab produce a ranked, auditable shortlist for an arbitrary endogenous metabolite in days.
The likely users are synthetic biologists building reporters, metabolic engineers who need in-line sensors for pathway tuning, and the biosensor groups that currently reuse the same handful of periplasmic binding proteins.
The ordering insight behind the design is sound and the choice of tools is apt: bindPredict and PSICHIC are sequence-based, so the screen does not depend on a structure existing for every candidate, and DiffDock only sees what survives.
The distance to that impact is large and it is mostly not conceptual.
The loop needs a ligand library (two SMILES will not do), three working tool environments, one pilot run with measured cost, and above all a scored evaluation against the held-out binding annotations the team has already assembled — without that last step there is no way to know whether a hit list is better than chance.
The committed 8,685-pair table is the most valuable asset here, because it makes that evaluation possible; the scaffold branch's own analysis that it overlaps only 28 of the screened domain spans, and that 15 of 16 matched ligands lack SMILES, is the honest measure of how much work the first real number still requires.

## License

**Needs attention:** the submitted branch has no license file at the repository root, so as it stands the code and text are not open source despite the issue naming Apache 2.0 and CC BY 4.0.
The fix is small: `LICENSE` (Apache 2.0) and `LICENSE-CC-BY-4.0` already exist, correct and complete, on the unmerged `scaffold/initial-documentation` branch, together with a `NOTICE` that states the split exactly as the issue does.
Merging or cherry-picking those three files onto `main` would settle it.
Two smaller points to tidy at the same time.
The committed tables are derived from UniProt and InterPro, which permit redistribution (CC BY 4.0 and CC0 respectively), and the XLSX carries ChEMBL identifiers (CC BY-SA 3.0), but `main` names no source and gives no attribution for any of them, which CC BY requires.
And that same `NOTICE` asserts "This repository does not redistribute third-party biological databases. It commits identifiers and fetch scripts only," which is not true of `main`, where 3 MB of UniProt-derived sequence is committed — so whichever branch survives, that sentence needs to match reality.
I found no GPL or AGPL code or dependencies, and nothing copied from a source that forbids reuse: the three named tools are referenced by URL, not vendored.

## Strengths

- The problem is well chosen and well explained.
  The funnel is ordered by cost per candidate, and the explanation of why — keep expensive compute off low-value candidates — is the right reason, not a post-hoc one.
- "Record everything, filter only what advances" is the single best decision in the agent definition.
  Separating what progresses from what gets reported is exactly what makes a screen re-cuttable by someone else, and stating the thresholds alongside it makes the hit list auditable rather than take-it-or-leave-it.
- The uncertainty rules are specific rather than ritual: flag borderline hits, flag hits resting on a low-pLDDT AlphaFold model, flag ambiguous domain boundaries.
  Those are the three ways this particular pipeline misleads a reader, and naming them shows real domain insight.
- The structure-trimming step (fetch the full-length AlphaFold model, locate the domain in the full sequence, trim before docking) is the kind of detail that is usually discovered painfully at hour six of a manual run.
- Building for resumability and a measured pilot before scaling, under an explicit ~$100 budget, is honest engineering about the constraint the team actually had.
- The data assembly is the real work product of the day: 413 domain spans as a pilot input and 8,685 annotated domain–ligand pairs as a yardstick, both internally consistent and correctly described.
- On the unmerged branch, the journal's willingness to write down a failed audit, a near-miss rule that would have dropped 28 real domains, and "no result has been produced" is the standard this event asks for.

## What would make it stronger

- Merge the license, NOTICE and CC BY files onto `main`, and add a one-line provenance note for UniProt, InterPro and ChEMBL.
- Say plainly, on `main`, that the agent has not yet been run, and retitle "Outputs" to "Intended outputs" until artifacts exist.
  The issue's "TBD" answers are honest; the README should match them.
- Fix or remove the demo-materials link, or commit the slides into the repository.
- Run the smallest possible end-to-end pilot and commit its artifacts: stage 1 scores for all 413 domains, stage 2 scores for the surviving domains against even the two committed ligands, one docked pose, and the measured per-domain cost.
  One committed score table would move the Evidence and Loop evidence more than any further design prose.
- Score that pilot against the committed annotations: take the 28 domain spans that overlap `metabolite_binding_sequences_human.csv`, report recall at a stated cutoff, and report a decoy or shuffled-ligand baseline next to it, so a reader can see what the funnel adds over chance.
- Replace the two-metabolite XLSX with the intended HMDB subset, or state explicitly which subset the pilot uses and why.
- Make the agent's rules checkable rather than advisory: a schema for the score table, a script that verifies every evaluated pair appears in it, and a checkpoint file whose resume path has actually been tested by killing a run.
- Reconcile the two branches, and say which is the submission.
  Right now the issue points at the branch with the data and the screener prompt, while the code, tests, licenses and journal live on the branch that deletes both.
- Add the literature step the event asks for: the agent currently reads no papers, and the thresholds at each stage are unset.
  Deriving a cutoff from the bindPredict and PSICHIC papers, and recording what was read, would close the one part of a research loop that is entirely absent.
