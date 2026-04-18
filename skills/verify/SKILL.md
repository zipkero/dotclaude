---
name: verify
description: "Validate completed implementation against PLAN.md Exit Criteria and IMPLEMENT.md design intent, or against SPEC.md for feature-level work. Runs in independent context. Outputs approved/rejected with evidence. Triggers after every non-trivial implementation."
---

## Context Loading
1. `$ARGUMENTS` ends with `SPEC.md` → SPEC mode. Use SPEC.md §2 Exit Criteria as validation baseline and §4 Architecture/Implementation as design intent reference. Target items recently marked `[x]` in §4 and verify their corresponding §2 Exit Criteria.
2. `$ARGUMENTS` empty or otherwise → PLAN mode. Read PLAN.md if it exists (use the relevant Task's Exit Criteria as validation baseline) and IMPLEMENT.md if it exists (use design intent as supplementary reference). Target the Unit(s) just implemented. If neither PLAN.md nor IMPLEMENT.md exists, verify from request scope + code diff only — working tree diff if uncommitted changes exist, otherwise `HEAD~1..HEAD`.

## Output Structure
1. Status: `approved` | `rejected`

2. Validation
- Request match
- Exit Criteria match (when PLAN.md or SPEC.md is available)
- Design intent match (when IMPLEMENT.md or SPEC.md §4 is available)
- Scope correctness
- Behavioral correctness
- Evidence (diff, test result, or explicit limitation)

3. If rejected — Issues
- Category: `style/minor` | `correctness` | `design/scope`
- List specific issues with evidence

4. If approved — Explanation
- What changed and why (2-3 sentences)
- Remaining risk (only if non-trivial)

## Reject Categories
- `style/minor`: naming, comments, formatting, or other non-behavioral issues. Does not block correctness. Fix is optional from verifier's standpoint.
- `correctness`: behavior does not satisfy Exit Criteria, contains a bug, breaks an invariant, or produces wrong output. Must fix before approval.
- `design/scope`: implementation departs from IMPLEMENT.md / SPEC.md §4 design, exceeds or falls short of requested scope, or violates agreed boundary. Requires decision — fix implementation or revise plan.

## Completion
- Verifier does not modify files. On approval, return a verified signal to main agent identifying the Task (PLAN.md) or Exit Criteria (SPEC.md §2). On rejection, return category and issues.
- Main agent applies document updates:
  - On approval: prepend `✓ ` to PLAN.md Task line or SPEC.md §2 Exit Criteria line (no checkbox — PLAN/SPEC §2 use markers, not checkboxes). When a PLAN Task has multiple IMPLEMENT Units mapped to it, `✓` is applied only after all mapped Units are both implemented (`[x]`) AND verified. Same rule for SPEC.md §2 ↔ §4 within one SPEC, and for PLAN Task ↔ mapped SPEC.
  - On rejection: revert the IMPLEMENT.md Unit or SPEC.md §4 item checkbox (`[x]` → `[ ]`).
- Implementation checkboxes are not touched by verification approval — those are updated by the implementer on completion and by main agent on verify reject.
- Partial verification (some Exit Criteria met within a Task, others pending) is recorded in verify output only, not in document markers.
- When neither PLAN.md nor SPEC.md exists, skip document updates. Return the `approved` result only.

## Guidelines
- Minimum evidence: code diff. Preferred evidence: code diff + test result. If tests exist for the changed scope but were not run, note as limitation.
- When the change modifies only internal computation, conditions, or transformations (no external state, I/O, or dependency changes), diff-based reasoning is acceptable evidence if correctness is visible in the diff.
- If tests were modified as part of this change, do not rely on those tests alone as evidence (see CLAUDE.md Test).
- Reject when correctness cannot be established from available evidence.
- If evidence is missing, state the limitation explicitly.
- Items marked `<!-- gap: <reason> -->` in PLAN.md / IMPLEMENT.md / SPEC.md are excluded from the verification baseline. Note excluded items in Explanation. Gap resolution is a document update (re-run `/plan-init` / `/implement-init` / `/feature-init`), not a verification event.
