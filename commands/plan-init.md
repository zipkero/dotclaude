---
description: Create plan.md (design document) under docs/<feature-name>/ from spec.md
---

> When to use: After `/spec-init`, before `/implement-init`. Produces the design baseline that `/implement-init` consumes.
> Prerequisite: `/spec-init`

Create `docs/<feature-name>/plan.md`. PLAN captures **how** the feature will be structured — structure, data flow, interfaces, impact, risks, and design decisions. PLAN does **not** repeat SPEC's completion criteria and does **not** define execution order or checklists.

Feature name: $ARGUMENTS

## Role
- Design blueprint derived from spec.md.
- Hold all structural and design decisions. implement.md is a pure checklist and does not carry decisions.
- Static document. Not a progress tracker.
- PLAN does not duplicate SPEC. Completion criteria live in spec.md §5; plan.md references them by number (`→ SPEC §5.N`) only when a design choice directly satisfies one.

## Prerequisites
- If feature name is empty, stop.
  - Guide: "Pass the feature name as argument. Example: `/plan-init payment-integration`"
- If `docs/<feature-name>/spec.md` does not exist, stop and request `/spec-init` first.
- Read spec.md in full before writing. PLAN scope is bounded by spec.md §1 Scope and may not add requirements.

## Overwrite Rule
- If `plan.md` already exists, confirm before overwriting.
- If `implement.md` or `verify.md` exists, warn that overwriting PLAN may invalidate downstream content. Proceed only on explicit confirmation. Remind the user to refresh affected sections of implement.md / verify.md afterward.

## plan.md Structure

### 1. 구조 (Structure)
- Module / component / layer layout. How the feature decomposes.
- Focus on boundaries, not files. Name types/interfaces only when the boundary is non-obvious.

### 2. 데이터 흐름 (Data Flow)
- Request → processing → response path. State transitions. External integration points.
- Diagrams in prose or Mermaid when flow is non-linear.

### 3. 인터페이스 (Interfaces)
- Public boundaries: API signatures, event shapes, contracts with adjacent modules.
- Include only interfaces that cross a boundary. Internal helper signatures are out of scope.

### 4. 영향 범위 (Impact)
- Existing modules/files/DB tables affected.
- Backward-compatibility concerns. Migration considerations.

### 5. 리스크 (Risks)
- Known failure modes, uncertain assumptions, open questions that do not block design but require attention during implement.
- If a risk blocks design itself, escalate as a Decision Point (below) and wait for resolution.

### 6. Decision Points
- All design choices that required judgment. Each entry: options considered, trade-offs, selected option, rationale.
- Scope covered here (so implement.md never inherits decisions):
  - Structural choice (module shape, layering, split/merge)
  - Data model / state model choice
  - Interface shape when multiple are viable
  - Execution order when the order is non-obvious and affects correctness
- Unresolved Decision Points block `/implement-init`.

## Global Rules
- Do not invent requirements beyond spec.md. New requirements require updating spec.md first.
- Do not write checkboxes, TODO lists, or per-item ordering. Those belong in implement.md.
- Do not redefine SPEC completion criteria. Reference them by `→ SPEC §5.N` when a design element directly supports one.

## README Update
On completion:
- Flip README.md Status `[ ] PLAN` → `[x] PLAN`.
- Append history line: `- <yyyy-MM-dd>: PLAN 작성`.

## Prohibited
- Checkboxes (`- [ ]` / `- [x]`) — PLAN is static
- Implementation checklists, per-file TODOs, task ordering — belong in implement.md
- Duplication of spec.md §5 completion criteria — reference, don't copy
- Low-level coding details (variable names, loop bodies, private helpers)
- Scope expansion beyond spec.md

## Downstream Contract
- `/implement-init <feature-name>` reads plan.md (structure + decisions) and spec.md §5 (completion-criteria mapping) to produce implement.md.

## Core Question
> How does this feature decompose, where does data flow, and which design choices did we commit to?
