# #4 Plov: Agents build the SSH mapper — two-harness differential state machine learning of 12 implementations

https://github.com/Lumberj3ck/agentic-protocol-state-learning at commit `e9bf9a6ffa60444dc42609519674a7664189e4e5`

Plov asks whether agents can build the *mapper* for protocol state machine learning, the adapter that usually costs experts weeks per implementation, and runs the experiment twice.
In one arm, Codex wrote an SSH mapper from the RFCs against tests Claude wrote first, then onboarded SSH servers and learned their models; in the other, the published ssh-fuzzer mapper was patched, validated against its authors' own traces and used on three servers.
Almost every headline number recomputes from committed files: the 10 learned models, the 19 confirmed and 4 refuted catalogue hits, the 192/127/65 cross-harness replay, the 32 model-disagreement classes, the 62/62 witnesses and the 39 divergence points.
The wolfSSH RFC 4253 §7.1 violation (CANDIDATE-003) is backed by deterministic packet traces, a source trace, and a check against current wolfSSH master, and it is also visible in the learned model.
The write-up is candid about refuted hits, mapper bugs, prior work and severity; a few secondary statements are looser than the data, and the vendored Paramiko code needs a license fix.

| Criterion | Score | Evidence |
|---|---|---|
| Problem | 5 | Mapper cost is the bottleneck that limits protocol model-learning studies to a handful of implementations, and every claim can be checked by computation: handshakes complete or not, replays agree or not, and both are recorded. |
| Loop | 5 | RFCs and prior work became a 15-pattern catalogue and predictions (`literature/`, `catalogue/ssh/`); agents wrote and ran the code; every catalogue hit was replayed on a live server, refuted witnesses were fed back as seeds (Go `v3vm` → `v4vm`), a second harness cross-checked the first, and state is kept in `TASKS.md`, `JOURNAL.md` and `PROMPT.md`. |
| Evidence | 4 | `results/SUMMARY.md`, the cross-validation counts and the reference arm's 39 divergence points all recompute exactly from committed JSON, model files and query logs; a few side claims are looser (OpenSSH "defers" in CANDIDATE-003, "nine" implementations disconnect, the "2 mapper" faults, post-fix validation logs for three targets). |
| Honesty | 5 | Refuted hits, three bugs in the team's own mapper, two over-strict patterns, non-converging Dropbear/AsyncSSH models, overlap with CCS 2025, a safeguard-stopped agent run and a corrected onboarding count are all disclosed, and severities are kept low or "not assessed". |
| Reproducibility | 4 | `uv.lock`, pinned Docker targets, the exact commands and the raw `queries.jsonl` for every model are committed, so the offline analysis can be redone; learning needs Docker for 12 builds and a large VM, onboarding needs the Codex CLI, and the reference arm runs through a host-specific `./gx` wrapper. |

## Claims checked

I assessed HEAD `e9bf9a6` (committed 17:34 CET).
The issue was opened at 16:43 CET (15:43 UTC) and last edited at 16:52 CET.
The four commits after it was opened add a demo page, two model drawings and a demo script, and correct the onboarding count in README, SYNTHESIS and the issue (`69d0b85`).
They change no results.
I did not run any submission code.
I recomputed numbers with my own scripts (run with `python3 -I`) from `results/runs/*/learn.json`, `model.dot` and `queries.jsonl`, `results/catalogue/verified-*.json`, `results/seqnr/*.txt` and `reference-harness/results/`.

**Agent-built arm**

- **Literature turned into 15 bug patterns as automata, each with a quoted MUST/SHOULD.** Supported.
  `catalogue/ssh/` holds 15 patterns; 14 are marked MUST and `UA-BEFORE-SR-AUTH` SHOULD, which the README correctly calls a modelling choice rather than an RFC SHOULD.
  `literature/ssh-rfc-notes.md` and `literature/ssh-ground-truth.md` (about 600 lines together) are there.
- **Tests and spec written before mapper code; `logs/protected.sha256` shows Codex never edited them.** Partly supported.
  The prompts in `logs/agents/codex-ssh-mapper*.prompt.md` forbid edits to the tests, spec and testbed, and the hashes match the files at HEAD.
  But the tests, spec, mapper and hash file all arrive in one commit (`487f975`), so git cannot show the order.
  The spec was later changed by the orchestrator for mapper fix 2 and the hash file regenerated in the same commit (`3506b29`), so the hash file is a snapshot, not an independent check.
  The Codex reports (`*.last.md`) say only the mapper and `tests/test_ssh_wire.py` were edited.
- **Mapper in about 330 lines, no SSH library.** Supported: `src/smlearn/ssh/` has 322 lines, using `cryptography` only.
- **12 implementations pass one validation suite; 8 onboarded by one Codex agent each, 4 set up by Claude.** Mostly supported.
  There are 12 targets in `targets/` and 8 onboarding logs in `logs/agents/onboard-*`.
  The 12 are 10 distinct implementations: OpenSSH (9.2p1 and 10.6p2) and Erlang/OTP (29 and 27.3.2) are counted twice, as the README lists.
  Committed passing pytest output exists for Erlang ×2, MINA, russh and wolfSSH.
  For Go, libssh and Paramiko, the committed logs show failures from before mapper fix 2; the later pass rests on the Codex report ("202 passed, 7 skipped") and the JOURNAL.
  No test output is committed for the four Claude-set-up targets.
- **10 models learned, results in `results/SUMMARY.md`.** Supported.
  States, learning time, queries and zero nondeterminism match `learn.json` for all 10 rows.
  The MQ+EQ counts match the number of lines in each `queries.jsonl`.
  One small mismatch: `libssh-v3vm/model.dot` declares 17 states, while `learn.json` and the table say 18.
- **23 catalogue hits, 19 confirmed and 4 refuted by replay.** Supported.
  Counting the current verdicts gives 19 confirmed and 3 refuted for libssh plus the refuted Go "auth bypass" on the superseded `golang-xcrypto-v3vm`.
  The Go relearn with the refuted witness as a seed (`v4vm`, 16 states) has no hits.
  `verified-all.json` and `verified-all.txt` are stale for libssh: they still show `STRICT-KEX-FIRST-KEXINIT` as confirmed, while `verified-libssh-erlang-rev2.json` refutes it.
  `scripts/summarize.py` chooses between the two by file modification time, which is arbitrary in a fresh clone, so regenerating the table may not reproduce the libssh row.
  The libssh relearn with its refuted witnesses was started but stopped (JOURNAL), so its listed model still has the three known errors.
- **Calibration: CCS 2025 Dropbear strict-KEX violation, Terrapin on/off control, Erlang/OTP 27.3.2 flagged blind, patched OTP 29 not.** Supported.
  `results/ground-truth/checks.json` shows Dropbear accepting IGNORE in the late strict-KEX window while OpenSSH and AsyncSSH disconnect, each in strict and non-strict mode.
  The catalogue (committed 14:24) predates the 27.3.2 target (15:23); 27.3.2 gets `STRICT-KEX-NON-KEX-MSG` and `CONN-BEFORE-AUTH`, OTP 29 neither, and `results/seqnr/erlang-control-vs-patched.txt` shows the difference.
  The pattern was revised later (16:15) after the libssh replays, and 27.3.2 stayed confirmed.
- **wolfSSH auth-before-service-request rediscovered, fixed upstream on 2026-10-12.** Supported by the side-by-side replay of 1.6.0 and master `d043c69` in `results/seqnr/wolfssh-release-vs-master.txt`; I did not check the upstream commit.
- **CANDIDATE-003, wolfSSH 1.6.0 and master send USERAUTH and CHANNEL_OPEN replies during a rekey, before their NEWKEYS.** Supported.
  The finding gives full packet traces over three runs, with OpenSSH and Go as controls, and a line-referenced source trace of `IsMessageAllowedServer`.
  Walking the learned `wolfssh-v3vm` model on `... UA_PW_OK KEXINIT CH_OPEN` gives `KEXINIT`, then `CH_OPEN_SUCCESS` before the server's NEWKEYS.
  The comparison "OpenSSH and MINA defer, Go and russh disconnect" is partly supported.
  The replay outputs behind it are not committed (JOURNAL line 126 only).
  On the learned models, MINA defers (`KEX31+NEWKEYS+CH_OPEN_SUCCESS`) and Go and russh close, as stated.
  But the team's own OpenSSH 9.2p1 model never shows the channel reply, and the OpenSSH 10.6 model closes the connection; deferral appears only in the teammate-harness model of OpenSSH 10.0p1 (`reference-harness/results/v2/A/tm_models/openssh_strict/`).
  The finding also states that the client's stimulus itself breaks §7.1, which is fair.
- **CANDIDATE-001 (OpenSSH stray NEWKEYS resets the receive sequence number under strict KEX) and CANDIDATE-002 (libssh silent error state).** Supported as conformance observations.
  `results/seqnr/openssh*.txt` and `libssh*.txt` show the A/B/C variants deterministic over three runs, and the source verifications by Codex are committed.
  Both are rated informational/low, with reasons.
- **CANDIDATE-004, MINA SSHD orphans open channels after a post-auth SERVICE_REQUEST(ssh-connection).** Supported.
  The finding has replays on four servers, and the learned `mina-sshd-v3vm` model gives `SERVICE_ACCEPT` and then no reply to CH_CLOSE, where OpenSSH answers UNIMPLEMENTED and closes the channel.
- **A NEWKEYS outside a key exchange gets four different reactions across the 12 implementations.** Supported: OpenSSH ×2 reset and continue, russh ignores it, libssh goes silent, and 8 disconnect.
  The README says "nine implementations disconnect"; the files and the JOURNAL show eight.

**Published-mapper arm and cross-validation**

- **ssh-fuzzer mapper with 5 documented patches, validated symbol for symbol against the original authors' traces.** Supported.
  `vendor/PATCHES.md` documents P1–P5.
  All four counterexamples in the authors' `statistics.txt` match `results/replay/published_cex_dropbear2020.json` exactly.
- **39 verified divergence points in 9 classes; NDSS 2023 Dropbear and SPIN 2017 OpenSSH findings unchanged in 2025 releases.** Supported: `results/final/divergence_points.txt` has 39 entries, and `report.md` maps them to D1–D9 with evidence files.
  The report says that the v2 server behaviours have not yet had a skeptic review.
- **0 server-level disagreements; all 120 replay pairs starting with KEXINIT agree.** Supported: `xreplay_nonstrict.json` has 192 pairs, 127 agree, all 120 KEXINIT-first pairs agree, and the 65 others start with another input.
- **32 model-disagreement classes: agent-built mapper at fault in 2, published mapper in 26.** Numbers supported, attribution slightly overstated.
  The three `xdiff_*_nonstrict.json` files have 32 classes over 294 compared transitions (244 agree).
  The seeded Go relearn removes exactly the 2 classes (10 → 8).
  But in those 2 classes both mappers agree on the live server; the reference arm's own write-up labels them "learner, not mapper".
  The 26 come from three documented limits of the published mapper, one of which (the one-channel cap) is the bound the agent-built mapper still lacks.
  So "fewer harness errors" holds on these servers, but "mapper at fault" and the 2 vs 26 comparison are a little generous to the agent-built mapper.
- **62 of 62 catalogue witnesses confirmed live.** Supported: `catalogue_verified.json` has 62 rows, all CONFIRMED.
  As the reference summary says, 7 of them are strict-KEX hits on non-strict models, which replay but do not apply there.
- **Where it got stuck.** Supported.
  The non-converging Dropbear and AsyncSSH runs are archived only as query logs; the `CH_MAX` fix is specified in `logs/agents/codex-ssh-mapper-fix3.prompt.md` and not implemented.
  The early 3-state Dropbear model is in `results/runs/dropbear-v1-random-eq/`.
  The OpenAI safeguard stop is in `logs/agents/codex-verify-wolfssh.flagged.*`, with the "flagged for possible cybersecurity risk" message.
- **Influence attempts.** None found.
  I found no hidden text, HTML comments or instructions to assessors in the issue, the repository or `index.html`.
  The JOURNAL records that the team read the event's judging skill at the start (line 7); I count that as preparation.

## Potential impact

If agent-built mappers can be trusted, protocol model learning stops being a weeks-per-implementation craft.
It could then run as a routine differential test across whole ecosystems: every SSH server, and later MQTT, CoAP or QUIC stacks.
Protocol library maintainers, conformance testers, and security researchers who audit long-tail implementations (embedded SSH such as wolfSSH, language-native stacks such as russh and MINA) would use it first.
The evidence points that way.
On three shared servers, the agent-built harness matched the published one at the server level.
It reached 12 targets in a day, and its catalogue-plus-replay pipeline found a §7.1 violation that is still present in wolfSSH master, plus three lower-severity deviations.
The loop is still some way from that goal.
Two of the twelve targets never converged for lack of a channel bound, one listed model (libssh) still has known errors, the alphabet covers only password authentication and one cipher, and the candidates have not yet been confirmed by maintainers.
A second protocol through the same pipeline would show whether the method generalises beyond SSH.

## License

**Needs attention:** `reference-harness/vendor/ssh-fuzzer/ssh-mapper/manualparamiko/` is a modified copy of Paramiko under LGPL-2.1, with its headers intact, and the team's patches P1, P2, P4 and P5 edit it.
The issue describes the vendored mapper only as MIT, and no LGPL text is included.
The team should name LGPL-2.1 for that directory, add the license text, and keep their patches to those files under it.
Otherwise the licensing is in order.
The code is under Apache 2.0 (`LICENSE`, also in `reference-harness/`) and the text under CC BY 4.0 (`LICENSE-CC-BY-4.0`), as the issue states.
The rest of ssh-fuzzer is MIT with its notice kept.
The Python dependencies (AALpy, cryptography, pytest) are permissive.
The SSH servers under test, including GPL-licensed wolfSSH, are downloaded and built in Docker from pinned releases, not copied into the repository; the findings quote only short source excerpts.
I found no committed private keys.

## Strengths

- The experiment is designed so that the agents' work can fail visibly: tests come before code, agents are told to stop rather than edit tests, every model claim is replayed live, and a second, independently built harness checks the first.
- The evidence chain is unusually complete.
  Raw query logs, learned models, replay transcripts with packet hex and source-line traces are all committed, and the numbers I recomputed match.
- It self-corrects in the open: a false "auth bypass" in Go was refuted and relearned away, two catalogue patterns were relaxed when replays showed they were too strict, and the onboarding count was corrected in the README and the issue.
- Calibration is taken seriously: a known-vulnerable Erlang/OTP version beside a patched one, a strict-KEX on/off control, and the original authors' published traces replayed exactly.
- Security findings are handled responsibly: severities are kept low or "not assessed", and the team explains why each candidate cannot be triggered by an on-path attacker.

## What would make it stronger

- Fix the vendored Paramiko license notice (see License).
- Implement the `CH_MAX` one-channel bound and finish the Dropbear, AsyncSSH and libssh relearns, so all 12 targets have verified models.
- Make `scripts/summarize.py` choose verification files deterministically (by name or recorded time, not mtime), and remove or update the stale libssh verdicts in `verified-all.*`.
- Commit the replay outputs behind the CANDIDATE-003 cross-server comparison, and reconcile them with the team's own OpenSSH models.
- Commit post-fix validation output for every target, including the four set up by Claude.
- Describe the 2 Go classes as a learner/oracle error rather than a mapper fault, and give the 2 vs 26 comparison alongside its causes.
- Report CANDIDATE-003 and CANDIDATE-004 to the wolfSSH and Apache MINA maintainers, and record their responses.
