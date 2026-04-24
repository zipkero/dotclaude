---
description: Create analysis.md (analysis + design) under docs/<feature-name>/ from spec.md
---

> When to use: After `/spec-init`, before `/implement-init`. Produces the design baseline that `/implement-init` consumes.

Create `docs/<feature-name>/analysis.md`. ANALYSIS captures how the feature decomposes and which design choices were committed to.

Feature name: $ARGUMENTS

## Role
- Design baseline derived from spec.md. Holds structural and design decisions so implement.md can stay a pure checklist.
- Static document. Not a progress tracker.
- Self-contained: a fresh session (after `/clear`) must be able to produce implement.md from `spec.md + analysis.md` alone.
- Reference spec.md §5 completion criteria by number (`→ SPEC §5.N`); never copy them.

## Prerequisites
- If feature name is empty, stop. Guide: "Pass the feature name as argument. Example: `/analyze-init payment-integration`"
- If `docs/<feature-name>/spec.md` does not exist, stop and request `/spec-init` first.
- Read spec.md in full before writing. Scope is bounded by spec.md §1 and may not add requirements.

## Overwrite Rule
- If `analysis.md` already exists, confirm before overwriting.
- If `implement.md` exists, warn that overwriting ANALYSIS may invalidate downstream content. Proceed only on explicit confirmation. Remind the user to refresh affected sections of implement.md afterward.

## analysis.md Structure

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
- Existing modules / files / DB tables that this change actually touches, verified by reading the call site or schema.
- Backward-compatibility / migration items only when an existing caller, stored data, or external contract in this repo actually breaks. Hypothetical concerns are out of scope.
- If nothing verified, write "해당 없음".

### 5. Decision Points
- All design choices that required judgment. Each entry: options considered, trade-offs, selected option, rationale.
- Design-blocking risks belong here, paired with the option chosen to resolve them.
- Scope (so implement.md never inherits decisions):
  - Structural choice (module shape, layering, split/merge)
  - Data model / state model choice
  - Interface shape when multiple are viable
  - Execution order when the order is non-obvious and affects correctness
- Small features with no judgment calls may write "해당 없음" and move on.

## README Update
On completion:
- Flip README.md Status `[ ] ANALYSIS` → `[x] ANALYSIS`.
- Append history line: `- <yyyy-MM-dd>: ANALYSIS 작성`.

## Prohibited
- Checkboxes (`- [ ]` / `- [x]`) — ANALYSIS is static
- Implementation checklists, per-file TODOs, Task ordering — belong in implement.md
- Low-level coding details (variable names, loop bodies, private helpers)
- Scope expansion beyond spec.md
- Speculative items — generic security / performance / compliance / contract checklists, hypothetical failure modes, unrequested compatibility or migration concerns without evidence from spec.md, code, or the user's prompt

## Downstream Contract
- `/implement-init <feature-name>` reads analysis.md (structure + decisions) and spec.md §5 (completion-criteria mapping) to produce implement.md.

## Core Question
> How does this feature decompose, where does data flow, and which design choices did we commit to?
