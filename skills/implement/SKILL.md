---
name: implement
description: "Execute the next implementation unit from IMPLEMENT.md or a feature doc. For project-level work, run /implement-init first if IMPLEMENT.md doesn't exist."
---

## Context Loading
1. `$ARGUMENTS` matches a feature doc path (`features/<yyyyMMdd>_<title>.md`) → feature-doc mode. Read the feature doc. Find the first incomplete item in §4 Implementation whose prerequisites are met. Use §4 Approach + §3 Decision Points as the implementation baseline.
2. `$ARGUMENTS` empty or otherwise → IMPLEMENT mode. Read IMPLEMENT.md; if absent, stop and guide the user to run `/implement-init`. Also read PLAN.md — IMPLEMENT.md is a checklist and never standalone. Find the first incomplete Unit whose prerequisites are met. Use the Unit's Approach + the mapped PLAN Task + relevant PLAN Decision Points as the implementation baseline.

## Per-Request flow
When invoked via natural prompt (not through Phased commands or a feature-doc path), state a brief approach note in 1-3 sentences before execution — scope, risky points. This is not PLAN.md creation.

## Output Structure
1. Approach
2. Code or logic
3. Key points
4. Notes or limitations (if any)

## Completion
- feature-doc mode: check the implementation item's checkbox in the feature doc §4 Implementation (`[ ]` → `[x]`). Do not touch §2 Exit Criteria — verification is a separate event.
- IMPLEMENT mode: check the Unit's checkbox in IMPLEMENT.md (`[ ]` → `[x]`).
- Do NOT modify PLAN.md or the upstream SPEC. PLAN is a static specification; progress lives in IMPLEMENT.md only. SPEC is an upstream reference and is never modified here.

## Guidelines
- Keep implementation minimal and within scope
- Follow existing conventions: match naming, structure, and error handling patterns of existing files in the same directory.
  - If lint/format config exists, it takes precedence.
  - When uncertain, use the most recently modified file of the same type as reference.
- Explain briefly only when necessary
