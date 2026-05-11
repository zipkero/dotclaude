---
description: Create implement.md (execution checklist with per-Task verification criteria) under docs/<feature-dir>/ from analysis.md
---

> 사용 시점: `/analyze-init` 이후. `implement`가 실행하고 `verify`가 검증하는 체크리스트를 만든다.
> 선행 조건: `/analyze-init`

`docs/<feature-dir>/implement.md`를 작성한다. IMPLEMENT는 **순수 실행 체크리스트**이며, 각 항목은 자체 Task-level 검증 조건을 가진 검증 가능한 Task다. 설계 근거는 analysis.md에 두고, 요구사항 레벨 완료 조건은 spec.md §5에 둔다.

Feature directory: $ARGUMENTS

## 역할
- 구현 단계의 단독 진행 상황 트래커다.
- 각 Task는 (a) analysis.md 설계와 (b) 최소 1개의 spec.md §5 완료 조건에 매핑된다.
- Task-level 검증 조건은 좁다 — "이 Task는 X가 일어나면 done." spec.md §5(feature 레벨)와는 구분한다.

## 전제 조건
- feature directory가 비어 있으면 중단한다.
  - 안내: "feature directory(`<yyyyMMdd>-<nnn>-<feature-name>`)를 인자로 전달하세요. 예: `/implement-init 20260506-001-payment-integration`"
- `docs/<feature-dir>/analysis.md`가 없으면 중단하고 `/analyze-init`을 먼저 실행하도록 안내한다.
- analysis.md §5 Decision Points에 미해결 항목이 있으면 진행 전에 경고하며, 사용자가 강제로 진행할 수 있다.
  - "미해결" = 채택 옵션이 없거나 채택 옵션이 TBD / 미정 / 보류로 표기된 Decision Point.
- 작성 전에 analysis.md와 spec.md §5 전체를 읽는다.

## 덮어쓰기 규칙
- `implement.md`가 이미 있으면 덮어쓰기 전에 사용자 확인을 받는다. 덮어쓰기 시 기존 Task 체크박스는 폐기된다.

## implement.md 구조

### Task 형식 (한국어 산출물 템플릿)
각 Task는 한 번에 구현하고 검증할 수 있는 최소 단위이며, 검증 기준이 다른 작업(도메인 모델, 저장소 경계, 서비스 흐름, API/UI, 테스트 등)은 필요할 때 분리한다.

각 Task는 네 필드를 가진 체크리스트 항목으로, 다른 필드는 두지 않는다.

```
- [ ] task-<nnn>: <Task 제목>
  - 목적: <이 Task가 만들거나 보존하는 외부 관찰 가능한 동작 한 줄, 평문>
  - 접근: 1-2줄 구현 방식
  - 검증 조건:
    - 결과: Task 완료 후 성립해야 하는 동작·출력·파일 내용·상태
    - 확인: 그 결과를 검증하는 방법 (테스트 / 빌드 / lint / diff / 수동 확인)
  - 참조: SPEC §5.N (1개 이상 필수) / ANALYSIS §X.Y (설계 결정이 적용될 때)
```

Task ID 규칙:
- 모든 Task에 전역 일련번호 prefix `task-<nnn>`을 붙인다 (`task-001`, `task-002`, ...). 그룹(`## Section:`)이 있어도 번호는 리셋하지 않고 문서 전체에서 연속한다.
- ID는 영구 식별자다. 새 Task는 현재 가장 큰 ID의 다음 번호를 사용하고, 삭제·병합된 ID는 재사용하지 않는다. 의존성 순서가 바뀌어도 ID는 재번호하지 않는다.
- 의존성 순서는 implement.md 안의 위치(line order)로 표현한다 — 위치가 곧 순서이며, 별도 의존성 필드를 두지 않는다. ID 숫자와 위치는 무관할 수 있다.

목적 필드 작성 규칙:
- **평문 동작 진술**로 적는다 — "X가 Y를 할 수 있다", "기존 Z 동작이 변경 전후 동일하다" 등. 사용자·호출자·외부 관찰자가 무엇을 보게 되는지를 한 줄로 표현한다.
- 매핑 식별자(`SPEC §...`, `ANALYSIS §...`)를 목적 필드에 넣지 않는다. 식별자는 참조 필드에 둔다.
- "Task가 self-contained하게 읽혀야 한다"가 기준이다 — 처음 보는 사람이 다른 문서를 펴지 않고도 이 Task가 무엇을 만드는지 알 수 있어야 한다.

참조 필드 작성 규칙:
- `SPEC §5.N`: 이 Task가 기여하는 spec.md §5 완료 조건. 최소 1개 이상 필수. 여러 개일 때는 쉼표로 나열한다.
- `ANALYSIS §X.Y`: 이 Task가 따르는 analysis.md 구조·설계 (설계 결정이 적용될 때만, 그 외에는 생략).

구체 예시:
```
- [ ] task-003: OrderService.fetchOrders 구현
  - 목적: 로그인 사용자가 본인 주문 목록을 페이지 단위로 조회할 수 있다
  - 접근: DB 조회 서비스 메서드 추가, pagination은 기존 QueryBuilder 활용
  - 검증 조건:
    - 결과: 로그인 사용자가 본인 주문 목록을 20개 단위로 조회 가능
    - 확인: 단위 테스트로 페이지 경계·빈 결과 케이스 검증, 수동 호출로 응답 형태 확인
  - 참조: SPEC §5.2, ANALYSIS §1.3
```

필드 의미 (command 작성자 참조용; 산출물 자체는 위의 한국어 라벨을 사용한다):
- 목적 (Purpose): 외부 관찰 가능한 동작 한 줄. 매핑 식별자가 아니라 행동·상태로 적는다.
- 접근 (Approach): 짧은 구현 방식. 더 깊은 내용이 필요하다면 그 깊이는 analysis.md 소관이므로 analysis.md를 먼저 갱신한다.
- 검증 조건 (Verification criteria): Task-level DoD를 두 줄로 분리한다.
  - 결과: 좁고 관찰 가능해야 한다. 목적이 결과와 동일하다면 `결과: 목적과 동일`로 약식 표기 가능.
  - 확인: 그 결과를 검증할 구체적 방법. verify가 evidence 종류를 결정하는 1차 입력이 된다.
- 참조 (References): spec.md §5 매핑(필수)과 analysis.md 결정(해당 시). 이 필드는 closure check와 추적용 메타데이터이며, verify의 1차 evidence가 아니다.

### 구조 옵션
- 평면 리스트: `- [ ]` Task의 단일 시퀀스로, 작은 feature에 쓴다.
- 그룹: `## Section: <name>` 아래에 Task를 배치하며, feature가 별개의 하위 영역을 여러 개 가질 때 쓴다. 내부 Task 포맷은 동일하다.

둘 다 허용하며, analysis.md 구조 크기에 맞춰 선택한다.

## 테스트 Task 포함 기준
테스트 룰은 verify skill이 단독으로 소유한다 — 테스트 Task가 필요한 시점과 버그 수정 예외는 `skills/verify/SKILL.md` §테스트 규칙에서 본다. 여기서 룰을 중복 기술하지 않는다.

테스트 Task를 추가할 때의 템플릿:

```
- [ ] task-<nnn>: <대상> 테스트 작성
  - 목적: <보존하려는 기존 동작 한 줄> 회귀 방지
  - 접근: test layer + coverage target (unit / integration / e2e)
  - 검증 조건:
    - 결과: 추가된 테스트가 의도한 회귀 케이스를 커버한다
    - 확인: CI/로컬에서 해당 테스트가 통과한다
  - 참조: SPEC §5.N
```

## 순서
- 의존성 기준만 사용한다 — "다음이 가능하기 위해 무엇이 먼저 존재해야 하는가." 시간 순서는 사용하지 않는다.
- 정렬은 implement.md 안의 위치로 표현하며, ID와는 무관하다. 순서를 바꿀 때 위치만 옮기고 ID는 보존한다.
- 가능한 순서가 여럿이고 그 선택이 정확성에 영향을 준다면, 그 결정은 여기가 아니라 analysis.md §5 Decision Points 소관이다.

## 매핑
- 모든 Task는 참조 필드에서 최소 1개의 spec.md §5 완료 조건(`SPEC §5.N`)에 매핑되어야 한다.
- implement.md를 확정하기 전에 매핑되지 않은 spec.md §5 기준이 있는지 나열한다. 미매핑 기준은 이 체크리스트로 도달할 수 없으므로 조용히 누락시키지 않는다. 각 미매핑 기준에 대해 사용자가 다음 중 하나를 선택한다.
  - 해당 기준을 다루는 새 Task 추가
  - spec.md §5에서 해당 기준 제거
  - spec.md §4 Exclusions로 명시적 보류
- 미매핑 목록이 비어 있지 않으면 사용자에게 드러내고, 판단을 받기 전에는 implement.md를 저장하지 않는다.

## 진행 상황 추적
체크박스 전환은 verify가 `approved`로 판단한 뒤에만 main이 수행하며, 절차는 CLAUDE.md §verify 후처리에 따른다. `implement` skill은 어떤 조건에서도 체크박스를 건드리지 않는다.

## README 갱신
`/implement-init` 완료 시 (Task가 나열되었을 뿐 실행은 아직 시작하지 않은 상태):
- README.md Status `[ ] IMPLEMENT`는 그대로 둔다. 이 체크박스는 implement.md의 모든 Task가 `[x]`가 된 시점에 main이 verify Approved 후속으로 전환한다(CLAUDE.md §verify 후처리).
- history 라인을 추가한다 — `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`.

feature 완료의 의미와 `[x] IMPLEMENT` 전환 규칙은 CLAUDE.md §verify 후처리 및 §Feature README 소유에 둔다.

## 금지
- implement.md 안에 Decision Point를 두지 않는다 (모든 결정은 analysis.md §5에 둔다).
- 목적 / 접근 / 검증 조건 / 참조 외의 Task 하위 필드는 두지 않는다.
- 목적 필드를 매핑 식별자(`SPEC §...`, `ANALYSIS §...`)만으로 채우지 않는다 — 평문 동작 진술이어야 한다. 식별자는 참조 필드에 둔다.
- 개념 설명·구조 다이어그램은 두지 않는다 (analysis.md 소관).
- 참조 필드에 SPEC §5 매핑이 없는 Task는 두지 않는다.
- spec.md §5 완료 조건을 수정·약화·확장하지 않는다.

## 핵심 질문
> 어떤 순서로 실행하고, 각 Task의 "done"은 무엇이며, 우리는 지금 어디인가?
