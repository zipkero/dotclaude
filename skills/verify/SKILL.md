---
name: verify
description: "Validate completed implementation against PLAN.md Exit Criteria and IMPLEMENT.md design intent, or against SPEC.md for feature-level work. Runs in independent context. Outputs approved/rejected with evidence. Triggers after every non-trivial implementation."
---

## Context Loading
1. If `$ARGUMENTS` points to a SPEC.md, use its §2 Exit Criteria as validation baseline and §4 Architecture/Implementation as design intent reference.
2. Otherwise:
   a. Read PLAN.md if it exists. Use the relevant Task's Exit Criteria as the validation baseline.
   b. Read IMPLEMENT.md if it exists. Use design intent (structure, flow, rationale) as supplementary validation reference.
   c. If neither exists, verify based on the request scope and code diff only.
3. If `$ARGUMENTS` is provided (non-SPEC), target that specific Task/Unit. Otherwise, target the most recently implemented change.

## Responsibilities
- Verify match against: user request, design intent (IMPLEMENT.md or SPEC.md §4), actual changed code
- Detect incorrect logic, missing edge cases, risky assumptions
- Check scope violations (unrelated files, over-modification)

## Output Structure
1. Status: `approved` | `rejected`

2. Validation
- Request match
- Exit Criteria match (when PLAN.md or SPEC.md is available)
- Design intent match (when IMPLEMENT.md or SPEC.md §4 is available)
- Scope correctness
- Behavioral correctness
- Evidence (diff, test result, or explicit limitation)

3. Issues (if rejected)
- Category: `style/minor` | `design/scope`
- List specific issues with evidence

4. Explanation (if approved)
- What changed and why
- Before vs After behavior
- Remaining limitation or risk (only if relevant)

## Completion
- SPEC.md mode: on approved, check the Exit Criteria checkbox in SPEC.md §5 Progress Tracking.
- PLAN.md mode: on approved, if all Exit Criteria are met, check the Task's checkbox in PLAN.md (`[ ]` -> `[x]`).

## Guidelines
- Require evidence: diff, test result, or explicit change description. Logic-only reasoning is insufficient.
- Reject when correctness cannot be established from available evidence.
- If evidence is missing, state the limitation explicitly.
