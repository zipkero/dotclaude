---
description: Create implement.md (execution checklist with per-item verification criteria) under docs/<feature-name>/ from plan.md
---

> When to use: After `/plan-init`. Produces the checklist that implementer executes and verifier checks against.
> Prerequisite: `/plan-init`

Create `docs/<feature-name>/implement.md`. IMPLEMENT is a **pure execution checklist**. Each item is a verifiable work unit with its own Unit-level verification criteria. Design rationale lives in plan.md; requirement-level completion criteria live in spec.md §5.

Feature name: $ARGUMENTS

## Role
- Sole progress tracker during implementation.
- Each item maps to (a) plan.md design and (b) at least one spec.md §5 completion criterion.
- Unit-level verification criteria are narrow — "this Unit is done when X happens." Distinct from spec.md §5 (feature-level) and verify.md (cross-cutting verification log).

## Prerequisites
- If feature name is empty, stop.
  - Guide: "Pass the feature name as argument. Example: `/implement-init payment-integration`"
- If `docs/<feature-name>/plan.md` does not exist, stop and request `/plan-init` first.
- If plan.md §6 Decision Points contains unresolved entries that block the target scope, stop and request resolution first.
- Read plan.md and spec.md §5 in full before writing.

## Overwrite Rule
See CLAUDE.md §Revision & Rollback. Confirm before overwriting `implement.md`.

## implement.md Structure

### Item Format (Korean artifact template)
Each item is a checklist entry with three fields. Nothing else.

```
- [ ] <Unit title — 작업 단위 제목>
  - 목적: → SPEC §5.N / → PLAN §X.Y
  - 접근: 1-2줄 구현 방식
  - 검증 조건: 이 Unit이 완료되었음을 판별할 관찰 가능한 기준 (1-3줄)
```

Field meanings (for command author reference; the artifact itself uses Korean labels above):
- 목적 (Purpose): explicit mapping to spec.md completion criterion (required) and plan.md section (required when design decision applies).
- 접근 (Approach): brief implementation approach. If more depth is needed, that depth belongs in plan.md — update plan.md first.
- 검증 조건 (Verification criteria): Unit-level DoD. Narrow and observable. Does NOT restate spec.md §5 verbatim; expresses what observable change proves this Unit works.

### Structure Options
- Flat list: single `- [ ]` items. Use for small features.
- Unit sections: group items under `## Unit: <name>` when the feature has multiple distinct sub-areas. Each item inside follows the same format.

Both forms are allowed. Choose based on plan.md structure size.

## Test Items
Authoritative test rules live in the implement and verify skills. This section only defines when a test **item** is added to the checklist.

Include an explicit test item when plan.md §5 Risks or §2 Data Flow indicates meaningful regression risk (state change, external I/O, concurrency, new boundary). Template:

```
- [ ] <대상> 테스트 작성
  - 목적: → SPEC §5.N 회귀 방지
  - 접근: test layer + coverage target (unit / integration / e2e)
  - 검증 조건: 테스트가 CI/로컬에서 통과한다
```

Bug-fix feature may fold the regression test into the fix item itself — see implement skill Test Handling for the exception rule.

## Ordering
- By dependency only: "what must exist before the next is possible." No chronological ordering.
- If multiple orderings are viable and the choice matters for correctness, that decision belongs in plan.md §6 Decision Points, not here.

## Mapping
- Every implement.md item must map to at least one spec.md §5 completion criterion via `→ SPEC §5.N`.
- If a spec.md §5 criterion has no corresponding implement.md item, mark it in a trailing "Gaps" section with `<!-- gap: <reason> -->` — do not silently drop coverage.

## Progress Tracking
- On implementation completion: implementer flips `[ ]` → `[x]` on the item.
- On verify reject: main agent reverts `[x]` → `[ ]`. Same item becomes the next incomplete target.
- Verify approval is not written to implement.md — it is recorded in verify.md and reflected in the feature README Status.

## Feature README Update
See CLAUDE.md §Feature README Status Ownership. `/implement-init` populates the checklist only; do not touch `[ ] IMPLEMENT`. Append history line: `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`.

## Prohibited
- Decision Points inside implement.md — all decisions live in plan.md §6.
- Item sub-fields other than 목적 / 접근 / 검증 조건.
- Items without a SPEC §5 mapping (except explicit `gap` entries).
- Restating spec.md §5 verbatim inside a 검증 조건 — the Unit DoD is narrower.

## Core Question
> In what order do we execute, what does "done" look like for each Unit, and where are we now?
