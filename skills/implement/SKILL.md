---
name: implement
description: "Execute the next implementation unit from IMPLEMENT.md or SPEC.md. Requires IMPLEMENT.md or a SPEC.md path as argument. For project-level work, run /implement-init first if IMPLEMENT.md doesn't exist."
---

## Context Loading

### SPEC.md Path
1. If `$ARGUMENTS` points to a SPEC.md, use its §4 Architecture/Implementation as the implementation baseline.
2. SPEC is an independent unit — do not cross-update IMPLEMENT.md checkboxes.

### IMPLEMENT.md Path
1. Read IMPLEMENT.md. If it does not exist, stop and guide the user to run `/implement-init` first.
2. Check the "next task" section or find the first incomplete Unit whose prerequisites are met.
3. If `$ARGUMENTS` is provided (non-SPEC), target that specific Unit. Otherwise, target the next eligible Unit.
4. Use the target Unit's design (structure, flow, rationale, failure/exception handling) as the implementation baseline.

## Output Structure
1. Approach
2. Code or logic
3. Key points
4. Notes or limitations (if any)

## Completion
- SPEC.md mode: check the Unit's checkbox in SPEC.md §5 Progress Tracking.
- IMPLEMENT.md mode: check the Unit's checkbox in IMPLEMENT.md (`[ ]` -> `[x]`).
- Do NOT modify PLAN.md (verification is a separate event).

## Guidelines
- Keep implementation minimal and within scope
- Follow existing conventions: match naming, structure, and error handling patterns of existing files in the same directory.
  - If lint/format config exists, it takes precedence.
  - When uncertain, use the most recently modified file of the same type as reference.
- Explain briefly only when necessary
