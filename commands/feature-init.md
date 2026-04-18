---
description: Create a feature-level SPEC document (Exit Criteria + implementation strategy combined)
---

> When to use: When adding an independent feature during a project. Can be used independently of PLAN.md.

Create a feature SPEC document. Combines completion criteria and implementation strategy in a single document per feature.

Feature name: $ARGUMENTS

## Role
- Define "what must work" + "how to implement" for features added mid-project.
- Operates independently from project-level PLAN.md/IMPLEMENT.md.

## Prerequisites
- If feature name is empty, stop.
  - Reason: the name determines the output path (`features/<name>/SPEC.md`) and document identifier.
  - Guide: "Pass the feature name as argument. Example: `/feature-init payment-integration`"
- If intent is unclear, ask before writing.
- If PLAN.md exists at project root, read it. If this feature's purpose and deliverable are equivalent to a PLAN.md Task's purpose and deliverable, include the mapping in §1 Overview as `→ PLAN: Phase X > Task Y` (required). Otherwise proceed as an independent feature.

## Output Path
- `features/<feature-name>/SPEC.md`
- Create directory if missing. Confirm before overwriting existing file.

## Document Structure

### 1. Overview
- Feature purpose in 1-2 sentences.
- PLAN mapping (if applicable): `→ PLAN: Phase X > Task Y`

### 2. Exit Criteria
- Follow the same rules as PLAN.md Task writing (see /plan-init).
- Describe as "what state is working." No implementation steps.
- No checkboxes. Verification marker is `✓` prefix (added by main agent on verify approval). See §5.

### 3. Decision Points
- Design choices + trade-offs.
- Unresolved Decision Points block their corresponding implementation items.

### 4. Architecture / Implementation
- Follow the same rules as IMPLEMENT.md units (see /implement-init).
- Every item maps to an Exit Criteria (`→ EC: #N`).
- Use `- [ ]` checkboxes for implementation items. This is the sole progress tracker.

### 5. Progress Tracking
- Two separate tracks, two separate markers:
  - Implementation (§4): `- [ ]` → `- [x]` on implementation done.
  - Verification (§2): plain bullet → `- ✓ <EC>` on verify approval.
- These are separate events tracked in different sections. Do not conflate.

## Verification Baseline
- When no PLAN.md exists, SPEC.md §2 Exit Criteria serves as the sole verification baseline for the verifier.
- When PLAN mapping exists, the main agent also adds `✓` to the mapped PLAN Task upon marking a SPEC §2 Exit Criteria verified. Without mapping, only SPEC is updated.

## Prohibited
- Mechanical Tasks (file creation / function addition only)
- Exit Criteria without implementation items — if unavoidable, mark the EC with `<!-- gap: <reason> -->` (see /implement-init)
- Implementation items without Exit Criteria
- Low-level coding detail listings

## Core Question
> How do we confirm this feature works, and what structure and order produces that state?
