---
description: Create implement.md (execution checklist with per-Task verification criteria) under docs/<feature-name>/ from analysis.md
---

> When to use: After `/analyze-init`. Produces the checklist that `implement` executes and `verify` checks against.
> Prerequisite: `/analyze-init`

Create `docs/<feature-name>/implement.md`. IMPLEMENT is a **pure execution checklist**. Each entry is a verifiable Task with its own Task-level verification criteria. Design rationale lives in analysis.md; requirement-level completion criteria live in spec.md §5.

Feature name: $ARGUMENTS

## Role
- Sole progress tracker during implementation.
- Each Task maps to (a) analysis.md design and (b) at least one spec.md §5 completion criterion.
- Task-level verification criteria are narrow — "this Task is done when X happens." Distinct from spec.md §5 (feature-level).

## Prerequisites
- If feature name is empty, stop.
  - Guide: "Pass the feature name as argument. Example: `/implement-init payment-integration`"
- If `docs/<feature-name>/analysis.md` does not exist, stop and request `/analyze-init` first.
- If analysis.md §6 Decision Points contains unresolved entries, warn before proceeding. User may override.
  - "unresolved" = a Decision Point with no selected option, or the selected option is marked as TBD / 미정 / 보류.
- Read analysis.md and spec.md §5 in full before writing.

## Overwrite Rule
- If `implement.md` already exists, confirm before overwriting. Existing Task checkboxes are discarded on overwrite.

## implement.md Structure

### Task Format (Korean artifact template)
Each Task is a checklist entry with three fields. Nothing else.

```
- [ ] <Task title — 작업 단위 제목>
  - 목적: → SPEC §5.N / → ANALYSIS §X.Y
  - 접근: 1-2줄 구현 방식
  - 검증 조건: 이 Task가 완료되었음을 판별할 관찰 가능한 기준 (1-3줄)
```

Notation for 목적 field:
- `→ SPEC §5.N` → this Task satisfies spec.md §5 완료 조건 criterion N (required).
- `→ ANALYSIS §X.Y` → this Task follows the structure/design committed in analysis.md §X subsection Y (required when a design decision applies; omit otherwise).
- `/` → AND. When both references are present they apply together.

Concrete example:
```
- [ ] OrderService.fetchOrders 구현
  - 목적: → SPEC §5.2 / → ANALYSIS §1.3
  - 접근: DB 조회 서비스 메서드 추가, pagination은 기존 QueryBuilder 활용
  - 검증 조건: 로그인 사용자가 본인 주문 목록을 20개 단위로 조회 가능
```

Field meanings (for command author reference; the artifact itself uses Korean labels above):
- 목적 (Purpose): upstream mapping per notation above.
- 접근 (Approach): brief implementation approach. If more depth is needed, that depth belongs in analysis.md — update analysis.md first.
- 검증 조건 (Verification criteria): Task-level DoD. Narrow and observable. When the Task maps 1:1 to a spec criterion, shorthand is allowed: `→ SPEC §5.N 동일`.

### Structure Options
- Flat list: a sequence of `- [ ]` Tasks. Use for small features.
- Grouped: Tasks under `## Section: <name>` headings when the feature has multiple distinct sub-areas. Each Task inside follows the same format.

Both forms are allowed. Choose based on analysis.md structure size.

## Test Task Inclusion
Test rules are owned by the verify skill — see `skills/verify/SKILL.md` §Test Rules for when a test Task is required and for the bug-fix exception. Do not duplicate the rules here.

Template when a test Task is added:

```
- [ ] <대상> 테스트 작성
  - 목적: → SPEC §5.N 회귀 방지
  - 접근: test layer + coverage target (unit / integration / e2e)
  - 검증 조건: 테스트가 CI/로컬에서 통과한다
```

## Ordering
- By dependency only: "what must exist before the next is possible." No chronological ordering.
- If multiple orderings are viable and the choice matters for correctness, that decision belongs in analysis.md §6 Decision Points, not here.

## Mapping
- Every Task must map to at least one spec.md §5 completion criterion via `→ SPEC §5.N`.
- Before finalizing implement.md, list any spec.md §5 criterion that has **no** matching Task. Unmapped criteria are unreachable by this checklist — do not silently drop. For each unmapped criterion the user chooses one of:
  - add a new Task covering it,
  - remove the criterion from spec.md §5, or
  - defer it explicitly via spec.md §4 Exclusions.
- If the unmapped set is non-empty, surface it to the user and wait for judgment before saving implement.md.

## Progress Tracking
Checkbox flip is verify-gated — see CLAUDE.md §Verify Handoff for the approved/rejected protocol. The `implement` skill does not touch the checkbox under any condition.

## README Update
On completion of `/implement-init` (Tasks listed, not yet executed):
- Flip README.md Status `[ ] IMPLEMENT` → `[x] IMPLEMENT` (meaning: checklist has been written).
- Append history line: `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`.

See CLAUDE.md §Feature README Ownership for feature completion semantics.

## Prohibited
- Decision Points inside implement.md — all decisions live in analysis.md §6
- Task sub-fields other than 목적 / 접근 / 검증 조건
- Concept explanations, structural diagrams — belong in analysis.md
- Tasks without a SPEC §5 mapping
- Modifying, weakening, or extending spec.md §5 completion criteria

## Core Question
> In what order do we execute, what does "done" look like for each Task, and where are we now?
