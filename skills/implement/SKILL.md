---
name: implement
description: Use for non-trivial implementation tasks.
---

## Context Loading
1. Read IMPLEMENT.md. If it does not exist, stop and guide the user to run `/implement-init` first.
2. Check the "next task" section or find the first incomplete Unit whose prerequisites are met.
3. If `$ARGUMENTS` is provided, target that specific Unit. Otherwise, target the next eligible Unit.
4. Use the target Unit's design (structure, flow, rationale, failure/exception handling) as the implementation baseline.

## Output Structure
1. Approach
2. Code or logic
3. Key points
4. Notes or limitations (if any)

## Completion
- On implementation complete, check the Unit's checkbox in IMPLEMENT.md (`[ ]` -> `[x]`).
- Do NOT modify PLAN.md (verification is a separate event).

## Guidelines
- Keep implementation minimal and within scope
- Follow existing conventions
- Avoid unrelated changes
- Explain briefly only when necessary
