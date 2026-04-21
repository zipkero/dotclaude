---
description: Create plan.md (design document) under docs/<feature-name>/ from spec.md
---

> When to use: After `/spec-init`, before `/implement-init`. Produces the design baseline that `/implement-init` consumes.
> Prerequisite: `/spec-init`

Create `docs/<feature-name>/plan.md`. PLAN captures **how** the feature will be structured — structure, data flow, interfaces, impact, risks, and design decisions. PLAN does **not** repeat SPEC's completion criteria and does **not** define execution order or checklists.

Feature name: $ARGUMENTS

## Role
- Design blueprint derived from spec.md. Holds all structural and design decisions (implement.md is a pure checklist and carries none).
- Static — not a progress tracker. Does not duplicate SPEC; references §5 criteria by `→ SPEC §5.N` only when a design choice directly satisfies one.

## Prerequisites
- If feature name is empty, stop.
  - Guide: "Pass the feature name as argument. Example: `/plan-init payment-integration`"
- If `docs/<feature-name>/spec.md` does not exist, stop and request `/spec-init` first.
- Read spec.md in full before writing. PLAN scope is bounded by spec.md §1 Scope and may not add requirements.

## Overwrite Rule
See CLAUDE.md §Revision & Rollback. Confirm before overwriting `plan.md`.

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

## Post-Write Check
After writing plan.md, inspect §6 Decision Points. If any entry is unresolved (options listed without a selected option, or rationale missing):
- Explicitly warn the user: `§6 Decision Points 미해결 항목이 있다. 해결 전까지 /implement-init 실행 금지.`
- List the unresolved entries by title so the user can act on them.
- Do NOT suggest `/implement-init` as the next step. The next natural suggestion is resolving the Decision Points (user updates plan.md, or re-runs `/plan-init`).

README Status flip (`[x] PLAN`) still applies — it marks document creation, not design readiness. The `/implement-init` gate enforces readiness separately.

## README Update
On completion:
- Flip README.md Status `[ ] PLAN` → `[x] PLAN`.
- Append history line: `- <yyyy-MM-dd>: PLAN 작성`.

## Prohibited
- Checkboxes (`- [ ]` / `- [x]`) — PLAN is static.
- Duplication of spec.md §5 completion criteria — reference, don't copy.

## Core Question
> How does this feature decompose, where does data flow, and which design choices did we commit to?
