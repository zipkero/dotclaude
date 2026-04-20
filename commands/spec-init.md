---
description: Create a SPEC document (requirements + feature definition) that downstream /plan-init or /feature-init references
---

> When to use: Before `/plan-init` or `/feature-init`. SPEC is the upstream reference that both phased flows consume.

Create a SPEC document. SPEC captures "what must exist" at the requirements and behavioral-feature level. No Exit Criteria, no design decisions, no implementation detail.

Title: $ARGUMENTS

## Role
- Define "what is needed and what features satisfy it" as the upstream reference for PLAN.md or feature doc generation.
- SPEC is a static reference; it is not a progress tracker and is not modified by verifier.
- Design decisions, Exit Criteria, and implementation ordering live downstream (PLAN or feature doc), not in SPEC.

## Prerequisites
- If title is empty, stop.
  - Reason: the title determines the output path (`spec/<yyyyMMdd>_<title>.md`) and downstream commands reference this path.
  - Guide: "Pass the title as argument. Example: `/spec-init payment-integration`"
- If intent is unclear, ask before writing.

## Output Path
- `spec/<yyyyMMdd>_<title>.md`
- `yyyyMMdd` = today's date (UTC or local; match project convention).
- Create `spec/` directory if missing. Confirm before overwriting existing file.

## Document Structure

### 1. Requirements
- Purpose: why this work exists.
- Audience / Stakeholder: who benefits or depends on it.
- Constraints: hard limits (performance, compatibility, regulatory, platform, timeline).
- No solution framing — describe the problem space only.

### 2. Feature Definition
- List features that satisfy §1 Requirements.
- Describe at **behavioral** level: what the feature does, not how it is built.
- Input / Output per feature when relevant.
- No file / module / interface / type / function naming. No ordering. No design trade-offs.

## Prohibited
- Exit Criteria or verification observation points — those belong in PLAN.md Task or feature doc §2
- Design / architecture / data-flow / state-model content — those belong in PLAN.md Decision Point or feature doc §3
- Implementation ordering, dependency graphs, checklists — those belong in IMPLEMENT.md or feature doc §4
- File / type / interface / function listings — low-level detail is out of scope for any upstream document
- Progress markers (`- [ ]` / `- [x]`) — SPEC carries no state

## Downstream Contract
- `/plan-init <spec-path>` reads this SPEC and produces PLAN.md. PLAN derives Exit Criteria from §2 Feature Definition.
- `/feature-init <spec-path>` reads this SPEC and produces `features/<yyyyMMdd>_<title>.md` (same filename stem as SPEC). Feature doc derives §2 Exit Criteria from §2 Feature Definition.

## Core Question
> What problem are we solving, and what features must exist to solve it — independent of how they are built?
