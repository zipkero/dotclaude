---
name: verify
description: "Validate completed implementation against PLAN.md Exit Criteria + Decision Points, or against SPEC.md for feature-level work. Runs in independent context. Outputs approved/rejected with evidence. Triggers after each implementation in the standard flow."
---

## Context Loading
1. `$ARGUMENTS` ends with `SPEC.md` → SPEC mode. Use SPEC.md §2 Exit Criteria as validation baseline and §3 Decision Points as design-intent reference. §4 Implementation provides the execution scope (which items were just worked on). Target items recently marked `[x]` in §4 and verify their corresponding §2 Exit Criteria.
2. `$ARGUMENTS` empty or otherwise → PLAN mode. Read PLAN.md if it exists (use the relevant Task's Exit Criteria as validation baseline and Decision Points as design-intent reference) and IMPLEMENT.md if it exists (use Unit Approach to locate execution scope — IMPLEMENT carries no design content). Target the Unit(s) just implemented. If neither PLAN.md nor IMPLEMENT.md exists, verify from request scope + code diff only — working tree diff if uncommitted changes exist, otherwise `HEAD~1..HEAD`.

## Output Structure
1. Status: `approved` | `rejected`

2. Validation
- Request match
- Exit Criteria match (when PLAN.md or SPEC.md is available)
- Design intent match (when PLAN.md Decision Points or SPEC.md §3 is available)
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
- `correctness`: behavior does not satisfy Exit Criteria, contains a bug, breaks an invariant, or produces wrong output. Must fix before approval.
- `design/scope`: implementation departs from PLAN.md Decision Points / SPEC.md §3 design intent, exceeds or falls short of requested scope, or violates agreed boundary. Requires decision — fix implementation or revise plan.

## Completion
- Verifier does not modify files. Return `approved` or `rejected` result with category and evidence. Document updates are the main agent's responsibility.
- On `approved`: no document change. Main agent notifies the user. Verification state is not persisted in PLAN.md / IMPLEMENT.md / SPEC.md.
- On `rejected`: main agent reverts the IMPLEMENT.md Unit or SPEC.md §4 item checkbox (`[x]` → `[ ]`).
- Implementation checkboxes are not touched by verification approval — those are updated by the implementer on completion and by main agent on verify reject.
- When neither PLAN.md nor SPEC.md exists, verify from request scope + code diff only.

## Guidelines
- Minimum evidence: code diff. Preferred evidence: code diff + test result. If tests exist for the changed scope but were not run, note as limitation.
- When the change modifies only internal computation, conditions, or transformations (no external state, I/O, or dependency changes), diff-based reasoning is acceptable evidence if correctness is visible in the diff.
- If tests were modified as part of this change, do not rely on those tests alone as evidence (see CLAUDE.md Test).
- Reject when correctness cannot be established from available evidence.
- If evidence is missing, state the limitation explicitly.
- Items marked `<!-- gap: <reason> -->` in PLAN.md / IMPLEMENT.md / SPEC.md are excluded from the verification baseline. Note excluded items in Explanation. Gap resolution is a document update (re-run `/plan-init` / `/implement-init` / `/feature-init`), not a verification event.
