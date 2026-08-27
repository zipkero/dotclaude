---
description: Create implement.md (execution checklist with per-Task verification criteria) under features/<feature-dir>/ from design.md
argument-hint: "<feature-dir>"
disable-model-invocation: true
---

> 사용 시점: `/design-init` 이후. `implement`가 실행하고 `verify`가 검증하는 체크리스트를 만든다.

`features/<feature-dir>/implement.md`를 작성한다. IMPLEMENT는 **순수 실행 체크리스트**이며, 각 항목은 자체 Task-level 검증 조건을 가진 검증 가능한
Task다. 설계 근거는 design.md에 두고, 요구사항 수준 완료 조건은 spec.md §5에 둔다.

Feature directory: $ARGUMENTS

## 실행 주체
analyzer agent가 아래 구조·규칙대로 `features/<feature-dir>/implement.md`를 작성하고 직접 기록한다(기록 계약은 `agents/analyzer.md` §산출물 기록
의무).
main은 위임 전에 아래 §덮어쓰기 규칙의 확인을 받고, 기록된 파일을 읽어 검토한 뒤 §매핑의 미매핑 결정·§README 갱신을 수행한다.

## 역할
- 구현 단계의 진행 상황을 추적하는 단 하나의 문서다.
- 각 Task는 (a) design.md 설계와 (b) 최소 1개의 spec.md §5 완료 조건에 매핑된다.
- Task-level 검증 조건은 좁다 — "이 Task는 X가 일어나면 완료." spec.md §5(feature 수준)와는 구분한다.

## 전제 조건
- feature directory가 비어 있으면 중단한다.
  - 안내: "feature directory를 인자로 전달하세요. 예: `/implement-init 20260506-001-payment-integration`"
- `features/<feature-dir>/design.md`가 없으면 중단하고 `/design-init`을 먼저 실행하도록 안내한다.
- design.md 승인 전 확인 섹션에 남아 있는 항목은 아직 사용자 답을 받지 못한 질문으로 본다(`(보류)` 표기 항목은 제외). analyzer는 그런 항목을 찾으면
  implement.md를 기록하지 않고 목록을 main에 넘기고, main이 질문으로 정리한다.
  `(보류)` 표기 항목은 그 항목이 영향을 주지 않는 Task까지 작성한다.
- 승인 전 확인 항목의 답으로 설계 결정이 바뀌면 `/design-init`으로 design.md를 다시 쓴 뒤 implement.md를 작성한다(CLAUDE.md §문서 구조).
- design.md §5 Decision Points에 미해결 항목이 있으면 analyzer가 목록을 main에 넘기고 main이 사용자에게 경고하며, 사용자가 강제로 진행할 수 있다.
  - "미해결" = 채택 옵션이 없거나 채택 옵션이 TBD / 미정 / 보류로 표기된 Decision Point.
- 작성 전에 design.md와 spec.md §5 전체를 읽는다.
- 완료 기준·Task 경계·검증 조건의 해석 차이가 Task 범위나 검증 조건을 실제로 바꾸면 analyzer는 기록하지 않고 main에 결정을 위임하며, main은
  질문으로 정리한 뒤 진행한다(방식은 CLAUDE.md §요청 해석).
- 정해지지 않은 판단을 마음대로 Task 범위나 검증 조건으로 바꾸지 않는다.

## 덮어쓰기 규칙
- `implement.md`가 이미 있으면 main이 위임 전에 사용자 확인을 받는다. 진행 시 기존 Task 체크박스가 버려짐을 함께 알린다.

## implement.md 구조

### Task 형식 (한국어 산출물 템플릿)
각 Task는 한 verify 사이클로 평가 가능한 단위다 — **외부 관찰 가능한 동작 하나와 그 회귀 보호**가 기준이며, 코드 조각 단위로 쪼개지 않는다.

분리 기준:
- 실패 의미나 검증 기준이 실제로 달라지는 지점에서만 Task를 분리한다.
- 한 외부 동작을 완성하는 데 필수인 기반 변경·연결 작업은 그 동작 Task에 함께 둔다.
- 확인 방법이 빌드·정적검사·기존 검증 유지뿐인 작업은 독립 Task로 만들지 않는다.

각 Task는 네 필드를 가진 체크리스트 항목으로, 다른 필드는 두지 않는다.

```
- [ ] task-<nnn>: <Task 제목>
  - 목적: <이 Task가 만들거나 보존하는 외부 관찰 가능한 동작 한 줄, 평문>
  - 접근: 1-2줄 구현 방식
  - 검증 조건:
    - 결과: Task 완료 후 성립해야 하는 동작·출력·파일 내용·상태
    - 확인: 그 결과를 검증하는 방법 (테스트 / 빌드 / lint / diff / 수동 확인)
  - 참조: SPEC §5.N (1개 이상 필수) / DESIGN §X.Y (설계 결정이 적용될 때)
```

Task ID 규칙:
- 모든 Task에 전역 일련번호 prefix `task-<nnn>`을 붙인다 (`task-001`, `task-002`, ...). 그룹(`## Section:`)이 있어도 번호는 리셋하지 않고 문서
  전체에서 연속한다.
- ID는 영구 식별자다. 새 Task는 현재 가장 큰 ID의 다음 번호를 사용하고, 삭제·병합된 ID는 재사용하지 않는다. 의존성 순서가 바뀌어도 ID는 재번호하지
  않는다.

목적 필드 작성 규칙:
- **평문 동작 진술**로 적는다 — "X가 Y를 할 수 있다", "기존 Z 동작이 변경 전후 동일하다" 등.
  사용자·호출자·외부 관찰자가 무엇을 보게 되는지를 한 줄로 표현한다.
- 참조 식별자(`SPEC §...`, `DESIGN §...`)를 목적 필드에 넣지 않는다. 식별자는 참조 필드에 둔다.
- 처음 보는 사람이 다른 문서를 펴지 않고도 이 Task가 무엇을 만드는지 알 수 있어야 한다.

참조 필드 작성 규칙:
- 참조 필드는 SPEC §5 매핑 누락 점검과 추적용 표시이며 verify의 1차 근거가 아니다.
- `SPEC §5.N`: 이 Task가 기여하는 spec.md §5 완료 조건. 최소 1개 이상 필수. 여러 개일 때는 쉼표로 나열한다.
- `DESIGN §X.Y`: 이 Task가 따르는 design.md 구조·설계 (설계 결정이 적용될 때만, 그 외에는 생략).

검증 조건 작성 규칙:
- 결과가 목적과 같으면 `결과: 목적과 동일`로 약식 표기할 수 있다.
- spec.md §3 제약에 사용자가 지정한 검증 근거(특정 테스트·명령·확인 방법)가 있으면
  관련 Task의 `확인` 필드에 빠짐없이 반영한다.
- 실행 가능한 근거(테스트·빌드·lint·명령 출력)로 바꿀 수 있는 확인은 수동 확인으로 적지 않는다.
  수동 확인이 남은 Task는 `/implement-loop`의 자동 진행 대상에서 빠진다(`commands/implement-loop.md` §자동 진행 제외).

### 구조 옵션
- 평면 목록: `- [ ]` Task를 한 줄기로 늘어놓으며, 작은 feature에 쓴다.
- 그룹: `## Section: <name>` 아래에 Task를 배치하며, feature가 별개의 하위 영역을 여러 개 가질 때 쓴다. 안쪽 Task 형식은 같다.

둘 다 허용하며, design.md 구조 크기에 맞춰 선택한다.

## 테스트 Task 포함 기준
design.md에 의미 있는 회귀 위험(상태 변화, 외부 I/O, 동시성, 새 경계, 기존 동작을 유지한 구조 변경)이 드러날 때만 테스트를 더한다.
테스트 코드 작성 범위·예외는 `skills/implement/SKILL.md` §테스트 코드 작성이 소유한다.

회귀 테스트는 구현 Task의 `확인` 필드 안에 둔다. 별도 테스트 Task는 테스트가 여러 구현에 걸치거나 그 자체로 독립된 검증 산출물(예: 여러 흐름을 묶는
e2e)일 때만 둔다.

테스트 Task도 §Task 형식의 네 필드를 그대로 쓰며, 제목은 `<대상> 테스트 작성` 형태로 둔다. 목적은 보존하려는 기존 동작의 회귀 방지, 접근은 테스트
계층(unit / integration / e2e 중 하나)과 커버 범위, 결과는 추가된 테스트가 의도한 회귀 케이스를 커버한다, 확인은 CI/로컬에서 해당 테스트가
통과한다를 적는다.

## 순서
- 의존성 기준만 사용한다 — "다음이 가능하기 위해 무엇이 먼저 존재해야 하는가." Task ID 숫자 순이나 작성 순으로 정렬하지 않는다.
- 정렬은 implement.md 안의 위치(line order)로 표현하며 별도 의존성 필드를 두지 않는다 — 위치가 곧 순서다. ID 숫자와 위치는 무관하며, 순서를 바꿀 때
  위치만 옮기고 ID는 보존한다.
- 가능한 순서가 여럿이고 그 선택이 정확성에 영향을 준다면, 그 결정은 여기가 아니라 design.md §5 Decision Points 소관이다.

## 매핑
- 모든 Task는 참조 필드에서 최소 1개의 spec.md §5 완료 조건(`SPEC §5.N`)에 매핑되어야 한다.
- implement.md를 확정하기 전에 매핑되지 않은 spec.md §5 기준을 모두 나열한다. 각 미매핑 기준에 대해 사용자가 다음 중 하나를 선택한다.
  - 해당 기준을 다루는 새 Task 추가
  - spec.md §5에서 해당 기준 제거
  - spec.md §4 제외 범위로 명시적 보류
- 미매핑 목록이 비어 있지 않으면 analyzer가 기록하지 않고 목록을 main에 넘긴다. main은 사용자에게 드러내고 판단을 받은 뒤 진행한다.

## README 갱신
`/implement-init` 완료 시 (Task가 나열되었을 뿐 실행은 아직 시작하지 않은 상태. analyzer는 아래 갱신 내용을 반환만 하고, 기록은 main이 한다):
- README.md 상태 `[ ] IMPLEMENT`는 그대로 둔다. `[x] IMPLEMENT` 전환은 `skills/verify/SKILL.md` §verify 후처리가 소유한다.
- 작업 히스토리 줄을 추가한다 — `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`.

## 금지
- implement.md 안에 Decision Point를 두지 않는다 (모든 결정은 design.md §5에 둔다).
- 접근 필드에 파일 배치·분리를 지정하지 않는다 — 구현 시점의 디렉토리 관례 소관 (`skills/implement/SKILL.md` §지침).
- 목적 / 접근 / 검증 조건 / 참조 외의 Task 하위 필드는 두지 않는다.
- 개념 설명·구조 다이어그램은 두지 않는다 (design.md 소관).
- 참조 필드에 SPEC §5 매핑이 없는 Task는 두지 않는다.
- spec.md §5 완료 조건을 수정·약화·확장하지 않는다.

## 후속 단계 계약
- implement.md가 준비되면 실행 경로는 둘이며, 어느 쪽으로 갈지는 사용자가 정한다.
  - 한 Task씩 자연어 `implement` → `verify`를 부른다.
  - `/implement-loop <feature-dir>`으로 남은 Task를 이어서 돌린다.
    반복·재시도·정지 조건은 `commands/implement-loop.md`가 소유한다.

## 핵심 질문
> 어떤 순서로 실행하고, 각 Task의 완료는 무엇이며, 우리는 지금 어디인가?
