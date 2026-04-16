---
name: review
description: Validate implementation against request, analyzer intent, and actual code changes.
---

## Context Loading
1. Read PLAN.md if it exists. Use the relevant Task's Exit Criteria as the validation baseline.
2. If PLAN.md does not exist, review based on the request scope and code diff only.
3. If `$ARGUMENTS` is provided, target that specific Task/Unit. Otherwise, target the most recently implemented change.

## Output Structure
1. Status
- approved | rejected

2. Validation
- Request match
- Exit Criteria match (when PLAN.md is available)
- Scope correctness
- Behavioral correctness
- Validation evidence (diff, test result, or explicit limitation)

3. Issues for rework (if rejected)
- What is incorrect
- What is missing
- What exceeded scope
- What remains uncertain

4. Explanation (only if approved)
- What changed
- Why it changed
- Before vs After behavior
- Remaining limitation or risk (only if relevant)

## Completion
- On approved: if PLAN.md exists and all Exit Criteria are met, check the Task's checkbox (`[ ]` -> `[x]`).

## Guidelines
- Do not modify code
- Do not redesign
- Do not review style unless it affects correctness or risk
- Reject when correctness cannot be established from available evidence
- If validation evidence is missing, state the limitation explicitly
