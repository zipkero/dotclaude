---
description: Create spec.md (requirements + completion criteria) under docs/<feature-name>/ and initialize the feature README
---

> When to use: First step of the Phased flow. Produces the SPEC that `/analyze-init` and `/implement-init` reference downstream.

Create `docs/<feature-name>/spec.md` and initialize `docs/<feature-name>/README.md`. SPEC captures **what must exist** at the requirement level — scope, goals, constraints, exclusions, and completion criteria. No design, no implementation ordering.

Feature name: $ARGUMENTS

## Role
- Upstream reference for analysis.md and implement.md.
- Static document. SPEC is not a progress tracker and is not modified by implement or verify.
- Completion criteria at the requirement level — "the feature is considered delivered when X, Y, Z are observable." Do not confuse with implement.md's per-item verification criteria (narrower Task-level DoD).

## Prerequisites
- If feature name is empty, stop.
  - Reason: the feature name determines the output path (`docs/<feature-name>/`) and is reused by downstream commands.
  - Guide: "Pass the feature name as argument. Example: `/spec-init payment-integration`"
- If intent is unclear, ask before writing.

## Output Paths
- `docs/<feature-name>/spec.md`
- `docs/<feature-name>/README.md` (created or updated)
- Create `docs/<feature-name>/` directory if missing.

## Overwrite Rule
- If `spec.md` already exists, confirm before overwriting.
- If any downstream document exists (`analysis.md`, `implement.md`), warn the user that overwriting SPEC may invalidate downstream content. Proceed only on explicit confirmation. Remind the user that affected sections of analysis.md / implement.md must be refreshed afterward (per CLAUDE.md Revision & Rollback).

## spec.md Structure

### 1. 범위 (Scope)
- What this feature covers. The boundary of the work.

### 2. 목표 (Goals)
- Why this work exists. What outcome it produces for users/stakeholders.

### 3. 제약 (Constraints)
- Hard limits: performance, compatibility, regulatory, platform, timeline, dependencies.

### 4. 제외 범위 (Exclusions)
- What is explicitly out of scope. Prevents scope creep during analyze/implement.

### 5. 완료 조건 (Completion Criteria)
- Observable conditions that signal the feature is delivered.
- Requirement-level, not Task-level. Requirement-level describes externally observable behavior; Task-level describes internal execution.
- "Observable" scales with the target type — the observer is not always a human:
  - UI → user-visible screen/interaction
  - Library/SDK → return value / exception raised to caller
  - CLI → stdout/stderr/exit code
  - Backend API → HTTP response / status code
  - Data pipeline → DB row / event / file artifact for downstream
  - Infra/ops → health endpoint / metric / log signal
- Each criterion must be verifiable by observing behavior.
- `verify` cites these criteria directly when judging each Task.

Examples (in Korean artifact, grouped by target type):
- UI: "로그인한 사용자가 주문 내역을 확인할 수 있다"
- Library: "parseConfig()가 유효하지 않은 YAML 입력에 대해 SchemaError를 던진다"
- CLI: "deploy --dry-run 실행 시 변경 계획을 stdout에 출력하고 exit 0으로 종료한다"
- Infra: "/health 엔드포인트가 정상 시 200, DB 장애 시 503을 반환한다"

Counter-examples (internal execution — belongs in analysis.md / implement.md, not spec.md):
- "OrderListService가 DB에서 주문 목록을 가져온다"
- "YAMLParser.parse()가 호출된다"
- "healthcheck handler가 DB.ping()을 수행한다"

## README.md Structure (initialize here)
```markdown
# <feature-name>

## Summary
<1-2 line description derived from spec.md §1–§2>

## Status
- [x] SPEC
- [ ] ANALYSIS
- [ ] IMPLEMENT

## 작업 히스토리
- <yyyy-MM-dd>: SPEC 작성
```

If README.md already exists, update `[ ] SPEC` → `[x] SPEC` and append a new history line rather than overwriting the history.

## Prohibited
- Design / architecture / data-flow / interface content — belongs in analysis.md
- File / module / type / function listings — low-level detail is out of scope
- Implementation ordering, checklists, TODOs — belongs in implement.md
- Progress markers (`- [ ]` / `- [x]`) inside spec.md — SPEC carries no state (README.md Status is the only checklist at this stage)

## Downstream Contract
- `/analyze-init <feature-name>` reads this spec.md and produces analysis.md in the same directory.
- `/implement-init <feature-name>` reads analysis.md (and spec.md for completion-criteria mapping) to produce implement.md.

## Core Question
> What problem are we solving, and under what observable conditions is it considered solved — independent of how it is built?
