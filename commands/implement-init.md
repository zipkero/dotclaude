---
description: Create implement.md (execution checklist with per-Task verification criteria) under features/<feature-dir>/ from design.md
argument-hint: "<feature-dir>"
---

`features/<feature-dir>/implement.md`를 쓴다.
implement.md는 Task 체크리스트이며, 구현 진행 상황은 이 문서로만 관리한다.

Feature directory: $ARGUMENTS

## 실행 주체
- analyzer agent가 implement.md를 쓴다(`agents/analyzer.md` §하는 일).
- main은 맡기기 전에 §덮어쓰기 확인을 받는다.
- 다 쓰면 main이 읽고 검토한 뒤 §매핑의 미매핑 처리와 §README 갱신을 한다.

## 전제 조건
- design.md가 없으면 멈추고 `/design-init`을 안내한다.
- design.md와 spec.md §5를 전부 읽는다.
- analyzer는 아래 경우 implement.md를 쓰지 않고 목록을 main에 돌려준다.
  - design.md 승인 전 확인에 `(보류)`가 아닌 항목이 남아 있다.
    main이 사용자에게 묻고, 설계가 바뀌면 design.md를 고친 뒤 다시 맡긴다.
  - design.md §5에 정해지지 않은 Decision Point가 있다.
    채택이 없거나 TBD·미정·보류로 적힌 것이다.
    main이 사용자에게 알리고, 사용자가 원하면 그대로 진행한다.
  - 해석에 따라 Task 범위나 검증 조건이 달라진다.
    main이 사용자에게 묻고 진행한다.

## 덮어쓰기
- implement.md가 이미 있으면 묻는다.
- 영향받는 Task의 승인이 취소된다는 것도 알린다.

## implement.md 구조
`<…>`는 채울 자리, `|`는 그중 하나를 고른다는 뜻이다.

```markdown
# <feature-name> 구현

- [ ] task-<nnn>: <Task 제목>
  - 목적: <이 Task가 만들거나 유지하는, 밖에서 볼 수 있는 동작 한 줄>
  - 접근: <구현 방식 1-2줄>
  - 검증 조건:
    - 결과: <Task를 마친 뒤 성립해야 하는 동작·출력·파일 내용·상태 | 목적과 동일>
    - 확인: <그 결과를 확인하는 방법: 테스트 | 빌드 | lint | diff | 수동 확인>
  - 참조: SPEC §5.<N>, §5.<M> / DESIGN §<N>
```

- analyzer는 위 필드만 쓴다.
- `최근 reject`·`승인 근거`는 `skills/verify/SKILL.md` §verify 후처리가 `참조` 아래에 `- <필드 이름>: <값>`으로 더한다.
- 재작성이면 기존 Task의 체크박스, `최근 reject`, `승인 근거`를 그대로 옮긴다.
  어떤 Task를 되돌릴지는 main이 `rules/feature-docs.md` §재작성 시 승인 취소대로 정한다.
- `SPEC §5.N`은 이 Task가 기여하는 완료 조건이며 하나 이상 쓴다.
- `DESIGN §N`은 설계 결정이 적용될 때만 쓴다.

## Task 나누기
- Task 하나는 verify 한 번으로 판단하는 단위다.
  밖에서 볼 수 있는 동작 하나와 그 회귀 방지가 기준이다.
- 실패의 의미나 검증 기준이 달라지는 곳에서만 나눈다.
  그 동작에 꼭 필요한 기반 작업과 연결 작업은 같은 Task에 넣는다.
- 빌드·정적 검사·기존 검증 유지만 확인하는 작업은 따로 Task로 만들지 않는다.
- 목적은 다른 문서 없이 읽어도 누가 무엇을 보게 되는지 알 수 있게 쓴다.
  참조 표기는 참조 필드에만 쓴다.
- spec.md §3에서 사용자가 지정한 검증 방법(테스트·명령·확인 방법)은 관련 Task의 `확인`에 빠짐없이 넣는다.
- 수동 확인은 사람이 직접 보고 판단해야 하거나 모델이 접근할 수 없는 환경에서만 쓴다.
- 다른 OS·실기기에서 같은 동작을 다시 보는 확인은 별도 Task로 둔다.
- 설계 설명과 파일 배치 지정은 넣지 않는다.
- spec.md §5 완료 조건을 바꾸지 않는다.

## Task ID와 그룹
- ID는 `task-001`부터 문서 전체에서 이어진다.
  `## Section: <name>` 그룹이 있어도 처음부터 다시 세지 않는다.
- 재작성 때 뜻이 같은 Task는 기존 ID를 유지한다.
- 새 Task는 지금까지 쓴 가장 큰 번호의 다음을 쓴다.
- 빠진 번호는 다시 쓰지 않고, 순서가 바뀌어도 번호를 다시 매기지 않는다.
- 작은 feature는 목록 하나로, 하위 영역이 여럿이면 `## Section: <name>`으로 묶는다.

## 테스트 Task
- design.md에 회귀 위험(상태 변화, 외부 I/O, 동시성, 새 경계, 동작을 유지하는 구조 변경)이 보일 때만 테스트를 넣는다.
- 회귀 테스트는 구현 Task의 `확인`에 넣는다.
- 테스트가 여러 구현에 걸치거나 그 자체가 독립 산출물(e2e 등)일 때만 `<대상> 테스트 작성` Task를 따로 만든다.
  접근에 테스트 종류(unit / integration / e2e)와 범위를 적는다.

## 순서
- 문서 안의 위치가 곧 의존 순서다.
- "이걸 하려면 무엇이 먼저 있어야 하나"로만 정렬하고, 의존성 필드는 따로 두지 않는다.
- 가능한 순서가 여럿이고 그 선택이 정확성에 영향을 주면 design.md §5에서 정할 일이다.

## 매핑
- `SPEC §5.N`은 매핑된 Task가 모두 `[x]`가 될 때 완료된다.
- 그 조건의 모든 문장이 매핑된 Task 중 하나의 목적이나 검증 조건에 들어 있어야 한다.
- `[철회]` 조건은 매핑하지 않는다.
- 완료 시점이 마지막 Task 하나에 몰리면 매핑을 다시 잡는다.
  다시 잡을 수 없으면 그 Task와 이유를 main에 넘겨 사용자 판단을 받는다.
- 매핑되지 않은 §5 조건이 있으면 analyzer는 implement.md를 쓰지 않고 목록을 돌려준다.
- main은 조건마다 사용자에게 셋 중 하나를 받는다: 새 Task 추가 / spec.md §5에서 철회 / spec.md §4 제외 범위로 보류.

## README 갱신
- `[ ] IMPLEMENT`는 그대로 둔다.
  `[x]`로 바꾸는 건 `skills/verify/SKILL.md` §verify 후처리가 한다.
- 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`을 더한다.
- 재작성이면 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.

## 다음 단계
사용자가 한 Task씩 `implement` → `verify`를 부르거나, `/implement-loop <feature-dir>`로 남은 Task를 이어서 돌린다.
