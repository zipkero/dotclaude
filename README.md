# .claude

Claude Code 개인 설정 저장소.

## 워크플로우

### 프로젝트 레벨 (대규모 작업 / 초기 설계)

```
analyze → plan-init(PLAN.md) → implement-init(IMPLEMENT.md) → implement → review
```

- **analyze**: 코드베이스/문제 분석. Blocker 발견 시 흐름 중단, 사용자와 상의.
- **plan-init**: 분석 결과를 기반으로 PLAN.md(완료 판정 체크포인트) 작성.
- **implement-init**: PLAN.md를 기반으로 IMPLEMENT.md(실행 전략) 작성.
- **implement**: IMPLEMENT.md의 다음 Unit을 구현.
- **review**: 독립 컨텍스트에서 PLAN.md Exit Criteria + IMPLEMENT.md 설계 의도 대비 검증.

### 피처 레벨 (소규모 작업)

```
feature-init(SPEC.md) → analyze → implement → review
```

- **feature-init**: Exit Criteria + 구현 전략을 하나의 SPEC.md로 통합 작성.
- 이후 skill들은 `$ARGUMENTS`에 SPEC.md 경로를 받아 피처 모드로 동작.

> **미결**: feature-init과 기존 skill 플로우의 통합 방식은 검토 중. 아래 "열린 고민" 참조.

## 구조

```
CLAUDE.md          # 프로젝트/글로벌 공통 규칙 (Korean, agent orchestration 등)
config.json        # Claude Code 기본 설정
```

### agents/ — 커스텀 서브에이전트 정의

별도 컨텍스트에서 실행되며, skill을 바인딩하여 사용.

- `analyzer.md` — 분석 에이전트 (analyze skill)
- `implementer.md` — 구현 에이전트 (implement skill)
- `reviewer.md` — 리뷰 에이전트 (review skill)

**역할 분리**: Agent는 경계 규칙(Boundary — 뭘 하면 안 되는가), Skill은 실행 규칙(Guidelines — 어떻게 해야 하는가).

### commands/ — 슬래시 커맨드 정의

- `plan-init.md` — PLAN.md 작성 (`/plan-init`)
- `implement-init.md` — IMPLEMENT.md 작성 (`/implement-init`)
- `feature-init.md` — 피처 SPEC.md 작성 (`/feature-init <feature-name>`)

### skills/ — 스킬 정의

- `analyze` — 분석, 디버깅, 설계 판단. Analysis Trigger 조건에 의해 자동 발동.
- `implement` — IMPLEMENT.md 또는 SPEC.md 기반 구현 실행.
- `review` — Exit Criteria + 설계 의도 대비 독립 검증. 비-trivial 구현 후 항상 실행.

## 열린 고민

### feature-init 통합 방식

프로젝트 레벨은 PLAN.md/IMPLEMENT.md 2파일 체계, 피처 레벨은 SPEC.md 1파일 체계.
현재 skill들의 Context Loading에 SPEC.md 분기를 추가해뒀지만, 아직 확정되지 않은 부분:

- **진입점 판별**: `$ARGUMENTS`에 SPEC.md 경로를 명시적으로 넘겨야 하는가, 아니면 자동 감지할 수 있는가?
- **analyze 위치**: 프로젝트 레벨은 analyze가 최초(plan-init 전)인데, 피처 레벨은 feature-init 후에 analyze가 오는 게 자연스러운가? 아니면 feature-init 전에 analyze를 먼저 돌려야 하는가?
- **진행 추적**: SPEC.md 내 §5 Progress Tracking이 IMPLEMENT.md + PLAN.md의 이원 추적을 하나로 합치는데, 구현 완료/검증 완료 구분이 충분히 명확한가?
- **규모 경계**: "소규모"의 기준이 뭔가? 어느 시점에서 feature-init 대신 프로젝트 레벨 플로우를 써야 하는가?

## 관리 방침

- `.gitignore`에서 화이트리스트 방식으로 추적 대상 관리
- 세션 데이터, 캐시, credentials 등은 추적 제외
