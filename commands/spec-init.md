---
description: Create spec.md (requirements + completion criteria) under docs/<feature-name>/ and initialize the feature README
---

> When to use: First step of the Phased flow. Produces the SPEC that `/plan-init` and `/implement-init` reference downstream.

Create `docs/<feature-name>/spec.md` and initialize `docs/<feature-name>/README.md`. SPEC captures **what must exist** at the requirement level — scope, goals, constraints, exclusions, and completion criteria. No design, no implementation ordering.

Feature name: $ARGUMENTS

## Role
- Upstream reference for plan.md and implement.md. Static — not modified by implementer or verifier.
- Completion criteria are requirement-level ("feature is delivered when X is observable"), distinct from implement.md's per-item Unit-level DoD.

## Prerequisites
- If feature name is empty, stop.
  - Guide: "Pass the feature name as argument. Example: `/spec-init payment-integration`"

## Output Paths
- `docs/<feature-name>/spec.md`
- `docs/<feature-name>/README.md` (created or updated)
- Create `docs/<feature-name>/` directory if missing.

## Overwrite Rule
See CLAUDE.md §Revision & Rollback. Confirm before overwriting `spec.md`.

## spec.md Structure

### 1. 범위 (Scope)
- What this feature covers. The boundary of the work.

### 2. 목표 (Goals)
- Why this work exists. What outcome it produces for users/stakeholders.

### 3. 제약 (Constraints)
- Hard limits: performance, compatibility, regulatory, platform, timeline, dependencies.

### 4. 제외 범위 (Exclusions)
- What is explicitly out of scope. Prevents scope creep during plan/implement.

### 5. 완료 조건 (Completion Criteria)
- Observable conditions that signal the feature is delivered.
- Requirement-level, not Unit-level. Example (in Korean artifact): "로그인한 사용자가 주문 내역을 확인할 수 있다" — not "OrderListService가 DB에서 주문 목록을 가져온다". Requirement-level describes observable user/system behavior; Unit-level describes internal execution.
- Each criterion must be verifiable by observing behavior.
- verify.md will cite these criteria directly to record pass/fail.

## Feature README Structure (initialize here, at `docs/<feature-name>/README.md`)
```markdown
# <feature-name>

## Summary
<1-2 line description derived from spec.md §1–§2>

## Status
- [x] SPEC
- [ ] PLAN
- [ ] IMPLEMENT
- [ ] VERIFY

## 관련 문서
- spec.md
- plan.md
- implement.md
- verify.md

## 작업 히스토리
- <yyyy-MM-dd>: SPEC 작성
```

If the feature README already exists, update `[ ] SPEC` → `[x] SPEC` and append a new history line rather than overwriting the history.

## Prohibited
- Progress markers (`- [ ]` / `- [x]`) inside spec.md — SPEC carries no state (the feature README Status is the only checklist at this stage).

## Core Question
> What problem are we solving, and under what observable conditions is it considered solved — independent of how it is built?
