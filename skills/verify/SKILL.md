---
name: verify
description: "Validate completed implementation against PLAN.md Exit Criteria and IMPLEMENT.md design intent, or against SPEC.md for feature-level work. Runs in independent context. Outputs approved/rejected with evidence. Triggers after every non-trivial implementation."
---

## Context Loading
1. If `$ARGUMENTS` points to a SPEC.md (or a path under `features/*/`): SPEC mode. Use SPEC.md §2 Exit Criteria as validation baseline and §4 Architecture/Implementation as design intent reference. Do not cross-update IMPLEMENT.md.
2. If `$ARGUMENTS` is provided (non-SPEC): target that specific Task/Unit.
3. If `$ARGUMENTS` is empty:
   - Read PLAN.md if it exists. Use the relevant Task's Exit Criteria as the validation baseline.
   - Read IMPLEMENT.md if it exists. Use design intent (structure, flow, rationale) as supplementary validation reference.
   - If neither exists, verify based on the request scope and code diff only. Target the most recently implemented change.

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

## Completion
- Verifier does not modify files. On approved, return a check-ready signal to main agent indicating which Task/Unit was approved; main agent updates PLAN.md or SPEC.md §5 progress tracking at the Task/Unit level.
- Partial verification (some Exit Criteria met within a Task, others pending) is recorded in this output only, not in document checkboxes.

## Guidelines
- Minimum evidence: code diff. Preferred evidence: code diff + test result. If tests exist for the changed scope but were not run, note as limitation.
- For pure logic changes where the diff clearly shows correctness, diff-based reasoning is acceptable evidence.
- If tests were modified as part of this change, do not rely on those tests alone as evidence (see CLAUDE.md Test).
- Reject when correctness cannot be established from available evidence.
- If evidence is missing, state the limitation explicitly.
