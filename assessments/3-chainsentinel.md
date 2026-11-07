# #3 ChainSentinel: Recovering FBI-listed laundering addresses of the Binance theft from 20% seeds

https://github.com/fdddf/chainsentinel at commit `4133808f78980b97cc135561dd54c731d53a5512`

ChainSentinel turns the FBI's list of 608 Ethereum addresses tied to the 2026-10-29 Binance theft into a held-out benchmark:
122 addresses are given as seeds, and four explainable rules over public Etherscan transfers try to recover the other 486.
Every headline number in the issue matches the committed candidate files, and an independent reimplementation of the iteration-2 rule reproduces its ranking exactly.
The best rules put 49 FBI-listed addresses in the top 50 and reach 343 of 486 held-out addresses (71%).
The write-up is unusually candid about its limits: the literature step was never used, the 0.15 goal was unreachable by construction, and the list is circular with investigators' own tracing.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 4 | Recovering held-out FBI-listed addresses from 20% seeds is a concrete, computationally checkable benchmark for open tracing heuristics, though (as the team says) it measures re-deriving investigators' tracing rather than finding new actors. |
| Loop | 4 | Hypothesis, test, rule, dev scoring and reflection are recorded in `JOURNAL.md`, `PROMPT.md` and `TASKS.md` across two sessions, and the loop diagnosed its own unreachable goal; but no iteration read literature, which the team states. |
| Evidence | 5 | All results-table figures, the 49/50 top-50 count, the base rates and the 343/486 reach recompute exactly from committed CSVs, and my own reimplementation of iteration 2 reproduces `candidates_iter_2.csv` exactly. |
| Honesty | 5 | Three failed iterations, the split ceiling, circularity, dev selection over 11 uncommitted variants, a non-test-first iteration 4 and the missing literature step are all disclosed; only the iteration 3–4 base-rate framing is a little generous. |
| Reproducibility | 5 | The transfers needed for every rule are committed, and the README gives exact offline commands with an expected `git diff` check; the only weak points are unpinned dependencies and a cache whose redistribution may have to be revisited (see License). |

## Claims checked

I assessed HEAD `4133808` (committed 15:45 CET, before the issue was opened at 16:18 CET), which is the commit the issue pins; nothing was committed after it.
I did not run any submission code.
I recomputed the numbers with my own scripts (run with `python -I`) from `data/labels.csv`, `data/seeds.csv`, `data/holdout.csv`, the edge files and `results/candidates_iter_N.csv`.

- **Ground truth: 628 addresses, 608 ETH; parsed by `labels.py` from an archived FBI alert.** Supported.
  `data/labels.csv` has 608 ETH, 19 BTC and 1 SOL addresses.
  A plain regex over the committed HTML finds exactly 608 distinct `0x` addresses, all of them in the labels.
  The Wayback Machine availability API confirms a snapshot at `20261107060018`.
  The committed file is the raw page without the Wayback toolbar, so its provenance rests on that API result and the file name.
  "Counts tested against press reports" is partly supported: `tests/test_labels.py` asserts 608/19/1, but the press source for those counts is not cited.
- **Split: 122 seeds and 486 held out, held-out set split by hash into 243 dev and 243 test.** Supported.
  `random.Random(42).sample` over the sorted addresses reproduces `seeds.csv`.
  Seeds and held-out addresses are disjoint and together equal the 608 labels.
  The SHA-256 first-byte parity split in `evaluate.py` gives exactly 243/243.
- **Rules never see labels.** Supported.
  `run_iteration.py` passes rules only `data/seeds.csv` and the edge files.
  The modules in `rules/` import only each other and the standard library.
  The fetch scripts choose what to download from the seeds, the funders and the rules' own candidates, and never read `holdout.csv` or `labels.csv`.
  Only `evaluate.py`, `final_report.py` and `recount.py` read the held-out set.
  Excluding funders as candidates was informed by iteration 0's dev result, which dev is there for.
- **Results table, iterations 0–4: dev/test r@50 and r@all.** Supported.
  Every cell matches `results/final.json` and `results/iter_N.json`, and my recount matches too.
  For example, iteration 3/4 gives dev r@50 0.095 (23/243), test 0.107 (26/243), dev r@all 0.687 (167/243) and test 0.724 (176/243).
- **49 of the top 50 are FBI-listed (iterations 2–4).** Supported.
  The single unlisted address is at rank 2 (`0x93b4…be64`).
- **Base rates: about 38 of 50 in iteration 2 (pool 76% listed), about 9 of 50 in iterations 3–4 (pool 17%).** Supported numerically (38.2 and 8.6 in `results/recount.json`, which I recomputed).
  The conclusion that in iterations 3–4 "the ranking, not the pool, does the work" is partly supported.
  The top 50 of iterations 3–4 is identical to iteration 2's, because `cousins.py` places all 331 siblings first.
  So most of the lift over 8.6 comes from ranking the sibling pool ahead of the cousins.
  The lift from scoring within the siblings is 49 vs 38.
- **Reach: 343 of 486 (71%).** Supported (`holdout_reached` in `recount.json`, recomputed).
- **"None of the 118 addresses that paid the seeds is a dev address."** Supported, and stronger than stated: none of them is on the list at all, since test is also 0.
  I confirmed that all 244 hop-1 edges point into a seed and come from 118 distinct senders.
- **Every ERC-20 event is a spoofed "ETH" token mirroring a real transfer (JOURNAL 13:20).** Supported.
  There are 64 ERC-20 rows from 26 contracts, all with the symbol "ETH", and every one has a native transfer with the same from, to and value.
- **Test agrees with dev within 6 points.** Supported: the largest recall gap is at r@200 (0.403 vs 0.346).
- **Rerunning iteration 4 reproduces `candidates_iter_4.csv` byte for byte.** Not run, by policy; indirectly supported.
  My own reimplementation of `similarity` from its docstring reproduces `candidates_iter_2.csv` exactly.
  `candidates_iter_3.csv` begins with that list.
  `candidates_iter_4.csv` equals a stable demotion of iteration 3's 819 senders, computed from the committed edges.
  `cousins.py` was not reimplemented.
- **27 tests.** Supported: 27 `test_` functions across 9 files, with no parametrisation.
- **Test-first for iterations 1–3, not for iteration 4.** Unverifiable from git, but not contradicted.
  Each rule was committed together with its test, so the history cannot show the order; the claim rests on the JOURNAL.
  `sinks.py` and `tests/test_sinks.py` first appear in the iteration-3 commit (14:24), which fits the admission that its tests were written with the rule.
- **JOURNAL timestamps 13:20, 13:37, 13:38, 14:49, 15:55.** All entries exist with the cited content.
  The `iter_N.json` `run_at` times match the 13:21–14:50 entries.
  Two timing details stand out.
  First, the 15:35 and 15:55 entries carry times 8–10 minutes later than the commits that contain them (15:27 and 15:45 CET), so those labels are approximate.
  Second, session 2 started at 13:36, and by the 13:39 commit it had done the ceiling analysis, scored 11 prototype variants and written iteration 2 test-first.
  That is fast but possible for an agent; the prototype script is not committed, as the team says.
- **11 variants compared on dev for iteration 2 (JOURNAL 13:38).** Partly supported: the table is there, but the script that produced it was not committed (disclosed).
- **The 0.15 goal ceiling (≈ 25/243 ≈ 0.103).** Supported: the reasoning is correct for any rule that cannot see the hash split.
- **`refs/README.md` lists clustering papers and incident reports, but no iteration used them.** Supported: two papers, the FBI alert and two press articles, and no JOURNAL entry cites them.
- **Binance hot wallet at rank 367 in iteration 3.** Supported: rank 367 in iteration 3, demoted to 1215 in iteration 4.
- **Reproduction instructions.** Supported as written.
  `run_iteration.py`, `evaluate --final`, `final_report.py` and `recount.py` need only committed files.
  The gzipped large files are handled by `edges.open_text`.
  The `requests`, `pytest` and `matplotlib` dependencies are unpinned.
- **Influence attempts.** None found.
  I found no hidden text, HTML comments or instructions addressed to assessors in the repository or the issue.
  The team ran a mock review with the event's public judging skill and recorded the resulting fixes (JOURNAL 15:55).
  I count that as preparation, not influence.

## Potential impact

If the loop worked well, it would give open, explainable baselines for tracing stolen funds.
Today that work is done mostly with closed commercial tools.
It would also give a way to score new heuristics against law-enforcement lists without trusting a vendor.
Likely users are academic researchers of blockchain forensics, open-source analytics projects, and smaller exchanges or DeFi front-ends that need to screen addresses quickly after an advisory.
The evidence shows that two simple, auditable rules ("siblings paid like the seeds" and "demote senders") recover a large share of the list within days.
That is useful as a fast candidate queue.
The loop is still far from that goal: one incident, one seed split, a five-day window, and a target that is itself the output of similar tracing.
Its numbers therefore measure agreement with investigators, not discovery.
Variance over seed samples, other incidents' labels, and the literature heuristics it planned would show whether these results generalise.

## License

**Needs attention:** about 380 MB of raw Etherscan API responses are committed in `data/raw/etherscan/`.
Etherscan's API terms (etherscan.io/apiterms) prohibit archiving its datasets and redistributing API content "in raw or substantially similar form".
The team should remove the raw cache, or get Etherscan's permission, and should consider whether the derived `data/edges*.csv` files count as "substantially similar".
Otherwise the licensing is in order.
The code is under Apache 2.0 (`LICENSE`, `pyproject.toml`) and the text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states.
The dependencies are permissive, with no GPL or AGPL code.
The FBI alert is a US government work, archived via the Wayback Machine.
The Etherscan attribution ("Powered by Etherscan.io APIs") is given in the README and the issue.

## Strengths

- The benchmark design is clean: the seed split is fixed before any rule, dev and test are separated by hash, the test half was scored once, and precision is consistently reported as a lower bound.
- The evidence chain is sound.
  Every number recomputes from committed files, and the iteration-2 ranking is reproducible from the rule's own docstring.
- The loop caught its own mis-specified goal.
  It derived that dev recall@50 ≥ 0.15 is unreachable for any honest rule, and switched to reach (recall@all) instead of gaming the metric.
- It made data observations before writing rules: the seeds are pure sinks, the ERC-20 events are spoofed "ETH" tokens, and vanity-address poisoning appears among the funders.
  All of these hold up in the data.
- It catches its own process problems: the Etherscan 1000-row paging bug, candidate edges leaking into the graph in iteration 4, wrong ranks from CSV line numbers, and the `code_commit` bookkeeping caveat.

## What would make it stronger

- Make the literature step real: run the deposit-address-reuse or peel-chain heuristic from `refs/` as an iteration, as planned.
- Report the iteration 3–4 base rate against the sibling pool (49 vs about 38) as well as the full pool.
  Recall@k over the whole held-out set would remove the per-half cap from the headline metric.
- Rerun with `seed=1..5` to show how much the results depend on the seed split.
- Commit the iteration-2 prototype script so the 11-variant selection table can be reproduced.
- Replace the committed raw Etherscan responses with a fetch-and-verify step, for example published hashes of the responses, so reproduction does not depend on redistributing Etherscan data.
- Pin dependency versions.
