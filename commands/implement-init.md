---
description: Create or rewrite IMPLEMENT.md according to rules
---

> When to use: When PLAN.md exists and execution order / progress tracking is needed.
> Prerequisite: /plan-init

Create IMPLEMENT.md. This is a progress checklist for executing PLAN.md, not a design or strategy document.

Scope: $ARGUMENTS

## Role
- Track "in what order Units run, and which are done / remaining."
- Sole progress tracker during implementation.
- Always operates alongside PLAN.md. Not a self-contained document — every Unit references PLAN for verification criteria and design rationale.
- Current state and next task must be determinable from this document alone by checkbox state; no separate progress log.
- Design / structure / strategy / ordering decisions live in PLAN.md Decision Points. IMPLEMENT.md never holds decisions.

## Scope Handling
- Empty: cover the entire PLAN.md.
- Provided: matching PLAN items only. If the provided scope is unclear, interpret as narrowly as possible — do not expand beyond the literal target.

## Prerequisites
- Read PLAN.md first; use as baseline.
- Do not modify, weaken, or add to PLAN.md Exit Criteria.
- If PLAN.md does not exist, stop and request it first.
- If PLAN.md has unresolved Decision Points that block the target scope, stop and request resolution first.

## Global Rules
- Every Unit maps to a specific PLAN.md Exit Criteria.
- Unit body is minimal: Purpose + Approach only.
- No low-level coding details.

## Unit Size
- One verifiable behavioral boundary or PR-sized unit.
- Mixed Exit Criteria mappings → split. Pure file/function listing → merge.

## Unit Format
- Start with `- [ ]`. Write as behavioral structure units.

Required per Unit (nothing else):
- Purpose: which Exit Criteria + PLAN inline reference (`→ PLAN: Phase X > Task Y`)
- Approach: 1-2 line summary of how this Unit is implemented.

If a Unit seems to need more (design options, trade-offs, failure modes, architecture notes), that content belongs in PLAN.md Decision Point. Add or refine the DP in PLAN first, then return here. Do not inline design content in the Unit body.

## Ordering
- By dependency: "what must exist before the next is possible." One-line prerequisite per step when non-obvious.
- No chronological ordering.
- If multiple orderings are viable and the choice requires judgment, that is a PLAN Decision Point, not an IMPLEMENT note.

## PLAN Mapping
- Every Unit → Exit Criteria link. Remove unmapped Units.
- PLAN items without mapping are marked as gaps using `<!-- gap: <reason> -->` inline comments.

## Progress Tracking
- Implementation done → check the Unit's checkbox in IMPLEMENT.md (`[ ]` → `[x]`). IMPLEMENT is the sole progress tracker.
- Verification done → main agent prepends `✓ ` to the matching PLAN.md Task (see verify skill). PLAN.md does not use checkboxes.
- When a PLAN Task has multiple IMPLEMENT Units mapped to it, `✓` is applied only after all mapped Units are both implemented (`[x]`) AND verified. Partial verification stays in verify output only.
- On verify reject, main agent reverts the Unit's checkbox `[x]` → `[ ]`. The same Unit becomes the next incomplete target on re-implementation.
- These are separate events on separate documents. Do not conflate.

## Prohibited
- Document Structure section at the top (Architecture / Execution flow / State model) — these belong in PLAN Decision Point
- Decision Point sections inside IMPLEMENT.md — all decisions live in PLAN
- Unit sub-fields other than Purpose and Approach (Design, Responsibility, Rationale, Failure/Exception) — such content belongs in PLAN DP
- Modifying / weakening / extending PLAN Exit Criteria
- Concept-only explanations, unjustified structure choices
- Task-level decomposition, units that only list files / functions / classes

## Output
- Project root `IMPLEMENT.md`. If file exists, confirm before overwriting.

## Core Question
> In what order do we execute PLAN's Tasks, where are we now, and what comes next?
