---
name: verify
description: "Judge whether the most recent implement Task satisfies spec.md completion criteria and its implement.md verification criteria. Invoked directly by main. Returns approved/rejected with evidence."
---

## Role
Verify is a **Task-level judgment tool**. It runs after an `implement` turn and answers one question: did the Task that was just built meet its DoD?

- No file writes. Verify returns judgment only. Main is the sole writer of the implement.md checkbox (both directions) — see CLAUDE.md §Verify Handoff.
- There is no feature-level verification pass and no `verify.md`.

## Evidence Discipline
Judgment must cite **files, diff, or test results** — not conversation memory. Even though main runs verify inline, the skill deliberately sets aside conversational reasoning accumulated during implement and re-derives its conclusion from artifacts:
- Phased mode: spec.md, analysis.md, implement.md, code diff, test results.
- Per-Request mode: user request (as originally stated), code diff, test results.

If an argument for correctness relies on "we discussed this earlier", it is not valid evidence. Re-read the file or run the test.

## Context Loading
1. `$ARGUMENTS` matches `docs/<feature-name>/` or any file under it, **or** the conversation indicates an active `docs/<feature-name>/` scope (same definition as in `implement` skill §Context Loading) → Phased mode.
   - Read spec.md completion criteria (requirement-level baseline).
   - Read implement.md. The verification target is the Task most recently executed by `implement` (still `[ ]`, awaiting judgment). Use its 검증 조건 field as the Task-level baseline.
   - Read analysis.md Decision Points when design-intent match is in question.
2. Otherwise → Per-Request mode. Verify from request scope + code diff only.
   - Diff source: working tree (uncommitted changes from the most recent implement turn). If already committed, main passes the diff range explicitly when invoking this skill (commit SHAs, or the Files touched list from implement's output).
   - No documents are read or written.

If the target Task cannot be identified unambiguously (multiple pending, or no single Task identifiable as the most recent implement target), ask the user to specify before judging.

## Output Structure
1. Status: `approved` | `rejected`
2. Target Task: cite the implement.md Task title (Phased) or the user's stated change (Per-Request).
3. Validation
   - Request/Task match
   - spec.md completion-criteria match (cite section number and state observed behavior) — Phased only
   - Task 검증 조건 match — Phased only
   - Design intent match (cite analysis.md Decision Point when relevant) — Phased only
   - Scope correctness
   - Behavioral correctness
   - Evidence (diff, test result, or explicit limitation)
4. If rejected — Issues
   - Category: `style/minor` | `correctness` | `design/scope`
   - List specific issues with evidence
5. If approved — Explanation
   - What changed and why (2-3 sentences)
   - Remaining risk (include only if notable)

## Reject Categories
All reject categories block Task approval equally — the checkbox does not flip to `[x]` until resolved. Categories exist only to help the user decide next steps.
- `style/minor`: naming, comments, formatting, or other non-behavioral issues. Does not break correctness.
- `correctness`: behavior does not satisfy spec.md completion criteria or implement.md verification criteria, contains a bug, breaks an invariant, or produces wrong output.
- `design/scope`: implementation departs from analysis.md Decision Points, exceeds or falls short of requested scope, or violates agreed boundary. Requires decision — fix implementation or revise analysis.md.

## Test Rules (authoritative — verify skill ownership)
Other documents reference these rules; do not duplicate them elsewhere.

### When implement.md includes a test Task (referenced by `/implement-init`)
Add an explicit test Task to implement.md when analysis.md §2 Data Flow or §5 Decision Points indicates meaningful regression risk: state change, external I/O, concurrency, or new boundary.

### When implement writes test code (referenced by `implement` skill)
Implement writes test code **only** for test Tasks. A Task qualifies as a test Task when any of the following holds:
- Task title or 접근 field explicitly names it as a test (e.g., "…테스트 작성", "unit/integration/e2e test").
- 검증 조건 asserts test execution (e.g., "테스트가 CI/로컬에서 통과한다").

No other implicit test additions.

Bug-fix exception: a single regression test that reproduces the fixed bug may be included with the fix itself. Feature additions do not qualify for this exception.

Per-Request mode: never add tests silently. If the change carries meaningful regression risk, `implement` states the gap in its approach note and lets the user decide whether to add tests in a follow-up.

If existing tests look missing or insufficient for the changed scope, `implement` states the gap in Notes. Do not silently add.

### Test evidence during verify
- Verify executes tests as part of gathering evidence. Never modifies test code, production code, or documents.
- Minimum evidence: code diff. Preferred: diff + test result. If tests exist for the changed scope but were not run, note as a limitation.
- When the change modifies only internal computation, conditions, or transformations (no external state, I/O, or dependency changes), diff-based reasoning is acceptable evidence if correctness is visible in the diff.
- If tests were modified by the same change being verified, do not rely on those tests alone as evidence. If the modification looks test-gaming (assertions loosened, cases removed without justification), reject under `correctness`.
- Reject when correctness cannot be established from available evidence. State the limitation explicitly.

## Guidelines
- Judge only the current Task. Do not opine on other pending Tasks or future work.
- Per-Request mode returns conversation output only — no file writes, no checkbox flips.
