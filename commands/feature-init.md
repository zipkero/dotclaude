---
description: Create a feature doc (Exit Criteria + implementation strategy combined) from a SPEC document
---

> When to use: When adding an independent feature during a project. Can be used independently of PLAN.md. Run after `/spec-init`.
> Prerequisite: `/spec-init`

Create a feature doc. Combines completion criteria and implementation strategy in a single file per feature, derived from the provided SPEC.

SPEC path: $ARGUMENTS

## Role
- Define "what must work" + "how to implement" for features added mid-project, derived from a SPEC document.
- Operates independently from project-level PLAN.md/IMPLEMENT.md.

## Prerequisites
- If SPEC path is empty, stop.
  - Guide: "Pass the SPEC path as argument. Example: `/feature-init spec/20260420_payment-integration.md`"
- If the SPEC file does not exist, stop and request `/spec-init` first.
- Read SPEC in full before writing. Feature doc scope is bounded by SPEC §2 Feature Definition.
- If PLAN.md exists at project root, read it first and apply the Phase-misuse guard below.

## Phase-Misuse Guard
- Feature doc is for **independent features that PLAN.md does not cover**. It is NOT a tool for subdividing PLAN Phases.
- If the requested scope falls inside an existing PLAN Phase/Task boundary, stop. Use `/implement-init` to expand that Phase in IMPLEMENT.md, not a feature doc.
- An optional mapping `→ PLAN: Phase X > Task Y` is allowed in §1 Overview only when the feature complements an existing Task from outside its boundary (e.g., PLAN Task defines a target state, feature doc adds an adjacent capability the Task depends on but does not itself cover). If the feature simply *is* the Task, it belongs in IMPLEMENT.md.

## Output Path
- `features/<yyyyMMdd>_<title>.md`
- Filename stem (`<yyyyMMdd>_<title>`) **must match the SPEC filename stem** for traceability.
  - Example: `spec/20260420_payment-integration.md` → `features/20260420_payment-integration.md`
- Create `features/` directory if missing. Confirm before overwriting existing file.

## Document Structure

### 1. Overview
- Feature purpose in 1-2 sentences, derived from SPEC §1 Requirements.
- SPEC reference: `→ SPEC: <spec-path>`
- PLAN mapping (if applicable): `→ PLAN: Phase X > Task Y`

### 2. Exit Criteria
- Derive from SPEC §2 Feature Definition, translated into verification observation points.
- Follow the same rules as PLAN.md Task writing (see `/plan-init`).
- Describe as "what state is working." No implementation steps.
- No checkboxes. §2 is a static specification; progress is tracked in §4 only.

### 3. Decision Points
- All design / structure / order / strategy choices live here. Same scope as PLAN.md Decision Point.
- List options + trade-offs.
- Unresolved Decision Points block their corresponding implementation items.

### 4. Implementation
- Pure checklist. Follow the same rules as IMPLEMENT.md Units (see `/implement-init`).
- Per item: `- [ ]` + Purpose (`→ EC: #N`) + 1-2 line Approach. Nothing else.
- Design / architecture / trade-off content must live in §3 Decision Points, not §4.
- §4 is the sole progress tracker for this feature doc.

### 5. Progress Tracking
- §4 is the sole progress tracker: `- [ ]` → `- [x]` on implementation done.
- On verify reject, main agent reverts the §4 item checkbox `[x]` → `[ ]`.
- §2 Exit Criteria carries no state markers. Verification approval is communicated to the user via conversation output only.

## Verification Baseline
- When no PLAN.md exists, feature doc §2 Exit Criteria serves as the sole verification baseline for the verifier.
- When PLAN mapping exists, verifier uses feature doc §2 and the mapped PLAN Task as combined baseline. No marker is applied to either document — verification state is not persisted.

## Prohibited
- Using feature doc to subdivide a PLAN.md Phase — if the scope is inside an existing PLAN boundary, use IMPLEMENT.md instead (see Phase-Misuse Guard)
- Architecture / Execution flow / State model sections in §4 — those decisions live in §3 Decision Points
- §4 items with sub-fields other than Purpose and Approach (Design, Responsibility, Rationale, Failure/Exception) — such content belongs in §3
- Mechanical Tasks (file creation / function addition only)
- Exit Criteria without implementation items — if unavoidable, mark the EC with `<!-- gap: <reason> -->` (see `/implement-init`)
- Implementation items without Exit Criteria
- Low-level coding detail listings
- Expanding scope beyond SPEC §2 Feature Definition — update SPEC first

## Core Question
> How do we confirm this feature works, and what structure and order produces that state?
