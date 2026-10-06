---
description: Create implement.md (execution checklist with per-Task verification criteria) under features/<feature-dir>/ from design.md
argument-hint: "<feature-dir>"
---

> 사용 시점: `/design-init` 이후. `implement`가 실행하고 `verify`가 검증하는 체크리스트를 만든다.

`features/<feature-dir>/implement.md`를 작성한다.
IMPLEMENT는 Task-level 검증 조건을 가진 Task들의 실행 체크리스트이며, 구현 단계 진행을 추적하는 유일한 문서다.
설계 근거는 design.md에, 요구사항 수준 완료 조건은 spec.md §5에 둔다.

Feature directory: $ARGUMENTS

## 실행 주체
analyzer agent가 아래 구조대로 implement.md를 작성하고 직접 기록한다(기록 계약은 `agents/analyzer.md` §동작).
main은 위임 전에 §덮어쓰기 규칙의 확인을 받고, 기록된 파일을 읽어 검토한 뒤 §매핑의 미매핑 결정과 §README 갱신을 한다.

## 전제 조건
- design.md가 없으면 중단하고 `/design-init`을 먼저 실행하도록 안내한다.
- design.md와 spec.md §5 전체를 읽는다.
- analyzer는 다음이면 implement.md를 기록하지 않고 목록을 main에 돌려준다.
  - design.md 승인 전 확인에 `(보류)`가 아닌 항목이 남아 있다.
    main이 사용자에게 묻고, 답으로 설계가 바뀌면 `rules/feature-docs.md`대로 design.md를 고친 뒤 진행한다.
  - design.md §5에 미해결 Decision Point가 있다.
    main이 사용자에게 경고하며, 사용자는 강제로 진행할 수 있다.
    "미해결"은 채택 옵션이 없거나 채택이 TBD / 미정 / 보류로 표기된 Decision Point다.
  - 해석 차이가 Task 범위나 검증 조건을 실제로 바꾼다.
    main이 사용자에게 물은 뒤 진행한다.

## 덮어쓰기 규칙
- implement.md가 이미 있으면 확인받고, 영향받는 Task의 승인이 취소된다는 것을 함께 알린다.

## implement.md 구조
`<…>`는 채울 자리, `|`는 그중 하나다.
analyzer가 쓰는 Task 필드는 아래 넷이며, `최근 reject`·`승인 근거`는 `skills/verify/SKILL.md` §verify 후처리가 더한다.
두 필드는 `참조` 아래에 `- <필드 이름>: <값>`으로 둔다.
재작성이면 기존 Task의 체크박스·`최근 reject`·`승인 근거`를 그대로 옮기고, 되돌릴 Task는 main이 `rules/feature-docs.md` §재작성 시 승인 취소대로 정한다.

```markdown
<!-- prowl-workflow: v1 -->
# <feature-name> 구현

- [ ] task-<nnn>: <Task 제목>
  - 목적: <이 Task가 만들거나 보존하는 외부 관찰 가능한 동작 한 줄, 평문>
  - 접근: <1-2줄 구현 방식>
  - 검증 조건:
    - 결과: <Task 완료 후 성립해야 하는 동작·출력·파일 내용·상태 | 목적과 동일>
    - 확인: <그 결과를 검증하는 방법: 테스트 | 빌드 | lint | diff | 수동 확인>
  - 참조: SPEC §5.<N>, §5.<M> / DESIGN §<X.Y>
```

- 참조의 `SPEC §5.N`은 이 Task가 기여하는 완료 조건이며 하나 이상 둔다.
  `DESIGN §X.Y`는 설계 결정이 적용될 때만 둔다.

- 각 Task는 한 verify 사이클로 평가하는 단위이며, 외부 관찰 가능한 동작 하나와 그 회귀 보호가 기준이다.
  실패 의미나 검증 기준이 실제로 달라지는 지점에서만 나누고, 그 동작에 필수인 기반 변경·연결 작업은 같은 Task에 둔다.
  확인이 빌드·정적검사·기존 검증 유지뿐인 작업은 독립 Task로 만들지 않는다.
- 목적은 사용자·호출자·외부 관찰자가 무엇을 보게 되는지를 다른 문서 없이 알 수 있는 평문으로 쓰고, 참조 식별자는 참조 필드에만 둔다.
- Task ID는 문서 전체에서 `task-001`부터 이어지며 `## Section: <name>` 그룹이 있어도 리셋하지 않는다.
  `/implement-init`으로 다시 쓰기 전까지 영구 식별자이므로, 새 Task는 가장 큰 ID의 다음 번호를 쓰고 순서가 바뀌어도 재번호하지 않는다.
- 작은 feature는 평면 목록으로, 별개 하위 영역이 여럿이면 `## Section: <name>` 그룹으로 둔다.
- spec.md §3에 사용자가 지정한 검증 근거(특정 테스트·명령·확인 방법)는 관련 Task `확인`에 빠짐없이 넣는다.
- 수동 확인은 사람의 지각·판단이 필요하거나 모델이 닿을 수 없는 환경에서만 확인되는 것으로 한정한다.
  다른 OS·실기기에서 같은 동작을 다시 보는 확인은 그 동작을 만든 Task와 나눠 별도 Task로 둔다.
- implement.md에는 설계 결정·개념 설명, 접근 필드의 파일 배치 지정(구현 시점 디렉토리 관례 소관)을 두지 않고, spec.md §5 완료 조건을 바꾸지 않는다.

## 테스트 Task 포함 기준
- design.md에 의미 있는 회귀 위험(상태 변화, 외부 I/O, 동시성, 새 경계, 기존 동작을 유지한 구조 변경)이 드러날 때만 테스트를 더한다.
- 회귀 테스트는 구현 Task의 `확인`에 둔다.
  테스트가 여러 구현에 걸치거나 그 자체로 독립 검증 산출물(여러 흐름을 묶는 e2e 등)일 때만 `<대상> 테스트 작성` Task를 따로 두고, 접근에 테스트 계층(unit / integration / e2e)과 커버 범위를 적는다.

## 순서
- 위치가 곧 의존 순서다.
  "다음이 가능하려면 무엇이 먼저 있어야 하는가"로만 정렬하고 별도 의존성 필드를 두지 않는다.
- 가능한 순서가 여럿이고 그 선택이 정확성에 영향을 주면 design.md §5 소관이다.

## 매핑
- 각 `SPEC §5.N`은 매핑된 Task가 전부 `[x]`가 되는 자리에서 완성되며, 그 조건의 모든 문장이 매핑 Task 중 하나의 `목적`·검증 조건에 들어 있어야 한다.
  `[철회]` 조건은 매핑하지 않는다.
- 완성 자리가 마지막 Task 하나에 몰리면 매핑을 다시 잡는다.
  `skills/verify/SKILL.md` §완료되는 요구사항 판정이 마지막 Task에서만 돌아 중간 Task에 요구사항 수준 판정이 걸리지 않기 때문이다.
  다시 잡을 수 없으면 그 Task와 사유를 main에 넘겨 사용자 판단을 받는다.
- 매핑되지 않은 spec.md §5 기준이 있으면 analyzer는 기록하지 않고 목록을 돌려준다.
  main은 기준마다 새 Task 추가 / spec.md §5에서 철회 / spec.md §4 제외 범위로 보류 중 하나를 사용자에게 받은 뒤 진행한다.

## README 갱신
- `[ ] IMPLEMENT`는 그대로 둔다.
  `[x] IMPLEMENT` 전환은 `skills/verify/SKILL.md` §verify 후처리가 소유한다.
- 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`을 더하고, 재작성이면 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.

## 후속 단계
implement.md가 준비되면 사용자가 한 Task씩 자연어 `implement` → `verify`를 부르거나, `/implement-loop <feature-dir>`으로 남은 Task를 이어서 돌린다.
