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
- If only a name is given without sufficient context about what to build, ask before writing.
- If PLAN.md exists at project root, read it. Map to relevant Phase/Task if applicable. Otherwise proceed as independent feature.

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

### 3. Decision Points
- Design choices + trade-offs.
- Unresolved Decision Points block their corresponding implementation items.

### 4. Architecture / Implementation
- Follow the same rules as IMPLEMENT.md units (see /implement-init).
- Every item maps to an Exit Criteria (`→ EC: #N`).

### 5. Progress Tracking
- `- [ ]` checkboxes.
- Implementation done → check implementation item. Verification done → check Exit Criteria.
- These are separate events.

## Prohibited
- Mechanical Tasks (file creation / function addition only)
- Exit Criteria without implementation items
- Implementation items without Exit Criteria (mark as gap)
- Low-level coding detail listings

## Core Question
> How do we confirm this feature works, and what structure and order produces that state?
