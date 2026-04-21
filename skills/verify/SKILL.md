---
name: verify
description: "Validate completed implementation against spec.md completion criteria and implement.md per-item verification criteria. Runs in independent context. Returns approved/rejected with evidence. Main agent writes the result into verify.md."
---

## Context Loading
1. `$ARGUMENTS` matches `docs/<feature-name>/` or any file under it → Phased mode.
   - Read spec.md completion criteria (requirement-level baseline).
   - Read implement.md (find items most recently marked `[x]` — those are the verification targets; use each item's 검증 조건 field as the Unit-level baseline).
   - Read plan.md Decision Points when design-intent match is in question.
   - Read verify.md if it exists — prior failure sections inform what regressions to check.
2. `$ARGUMENTS` empty → Per-Request mode. Verify from request scope + code diff only (working tree diff if uncommitted, otherwise `HEAD~1..HEAD`). No documents are written.

## Output Structure (returned to main agent)
1. Status: `approved` | `rejected`

2. Validation
   - Request match
   - spec.md completion-criteria match (cite section number and state observed behavior)
   - implement.md per-item verification-criteria match (cite item title)
   - Design intent match (cite plan.md Decision Point when relevant)
   - Scope correctness
   - Behavioral correctness
   - Evidence (diff, test result, or explicit limitation)

3. If rejected — Issues
   - Category: `style/minor` | `correctness` | `design/scope`
   - List specific issues with evidence

4. If approved — Explanation
   - What changed and why (2-3 sentences)
   - Remaining risk (include only if notable)

## Reject Categories
- `style/minor`: naming, comments, formatting, or other non-behavioral issues. Does not block correctness. Fix is optional from verifier's standpoint.
- `correctness`: behavior does not satisfy spec.md completion criteria or implement.md verification criteria, contains a bug, breaks an invariant, or produces wrong output. Must fix before approval.
- `design/scope`: implementation departs from plan.md Decision Points, exceeds or falls short of requested scope, or violates agreed boundary. Requires decision — fix implementation or revise plan.md.

## Completion (verifier handoff)
Verifier does not modify any file. Return the result to main agent. Main agent performs all document updates per CLAUDE.md Verify Handoff.

## Test Handling (authoritative — verifier ownership)
- Verifier executes tests as part of gathering evidence. Verifier never modifies test code, production code, or documents.
- Minimum evidence: code diff. Preferred: diff + test result. If tests exist for the changed scope but were not run, note as a limitation.
- When the change modifies only internal computation, conditions, or transformations (no external state, I/O, or dependency changes), diff-based reasoning is acceptable evidence if correctness is visible in the diff.
- If tests were modified by the same change being verified, do not rely on those tests alone as evidence. If the modification looks test-gaming (assertions loosened, cases removed without justification), reject under `correctness` and route back to implementer.
- Reject when correctness cannot be established from available evidence. State the limitation explicitly.

## verify.md Format (written by main agent based on verifier result)
First write initializes the document with a header. Each verify invocation appends one section.

```markdown
# <feature-name> — Verification Log

## 시도 1 — 실패 (yyyy-MM-dd HH:mm)
- 대상: <implement.md 항목 제목>
- 범주: correctness
- 이슈: <요약>
- 근거: <diff / test result / observation>

## 시도 2 — 통과 (yyyy-MM-dd HH:mm)
- 대상: <implement.md 항목 제목>
- 충족된 완료 조건: → SPEC §N
- 근거: <diff / test result / observation>
- 잔여 리스크: <있다면 한 줄>
```

## Guidelines
- Items marked `<!-- gap: <reason> -->` in implement.md are excluded from the baseline. Note exclusions in the Explanation. Gap resolution is a document update (re-run `/implement-init`), not a verification event.
- Per-Request mode writes no file. Return the result as conversation output only.
