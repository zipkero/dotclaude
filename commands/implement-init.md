---
description: Create implement.md (execution checklist with per-Task verification criteria) under features/<feature-dir>/ from design.md
argument-hint: "<feature-dir>"
---

`features/<feature-dir>/implement.md`를 쓴다.

Feature directory: $ARGUMENTS

## 쓰는 방법
- main은 analyzer agent에 맡기고, implement.md가 이미 있으면 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.
- analyzer는 design.md와 spec.md를 전부 읽고, 아래 경우 쓰지 않고 main에 돌려주며, main이 사용자에게 묻는다.
  - design.md 승인 전 확인에 `(보류)`가 아닌 항목이 남아 있다.
  - design.md §5에 채택이 없거나 TBD인 Decision Point가 있다.
  - 해석에 따라 Task 범위나 검증 조건이 달라진다.
  - `SPEC §5.N` 중 매핑되지 않은 것이 있다.
- 재작성이면 기존 Task의 체크박스와 `최근 reject`·`승인 근거`를 옮기고, 되돌릴 Task는 main이 `rules/feature-docs.md` §재작성 시 승인 취소대로 정한다.

## implement.md 구조
```markdown
# <feature-name> 구현

- [ ] task-<nnn>: <Task 제목>
  - 목적: <이 Task가 만들거나 유지하는, 밖에서 볼 수 있는 동작 한 줄>
  - 접근: <구현 방식 1-2줄>
  - 검증 조건:
    - 결과: <마친 뒤 성립해야 하는 동작·출력·상태 | 목적과 동일>
    - 확인: <테스트 | 실행 | 빌드 | lint | diff | 수동 확인>
  - 참조: SPEC §5.<N> / DESIGN §<N>
```
- `최근 reject`·`승인 근거`는 verify 후처리가 참조 아래에 더한다.
- 참조에는 이 Task가 기여하는 `SPEC §5.N`을 하나 이상, 적용되는 설계가 있으면 `DESIGN §N`을 쓴다.

## Task 나누기
- Task 하나는 verify 한 번으로 판단하는 단위이며, 같은 확인으로 함께 판정할 수 있는 동작은 한 Task로 묶고 실패 원인을 따로 봐야 할 때만 나눈다.
- 동작에 필요한 기반·연결 작업은 같은 Task에 넣고, 빌드·정적 검사만 확인하는 작업은 따로 Task로 만들지 않는다.
- 목적은 다른 문서 없이 읽어도 누가 무엇을 보게 되는지 알 수 있게 쓴다.
- `확인`은 목적의 동작을 직접 돌려 보는 방법으로 고르고, 빌드·lint·diff만으로 끝내는 건 동작이 바뀌지 않는 Task뿐이다.
- spec.md §3에 사용자가 지정한 검증 방법은 관련 Task의 `확인`에 넣는다.
- 수동 확인은 사람이 봐야 하거나 모델이 닿을 수 없는 환경에만 쓰고, 다른 OS·실기기 재확인은 별도 Task로 둔다.
- 회귀 테스트는 기존 동작을 바꾸거나 기존 동작이 기대는 코드를 고치는 Task의 `확인`에만 넣는다.
- 여러 구현에 걸치는 e2e 같은 테스트만 따로 Task로 만든다.
- 문서 안의 순서가 의존 순서이며, "이걸 하려면 무엇이 먼저 있어야 하나"로 정렬한다.
- ID는 `task-001`부터 문서 전체에서 이어지고, 재작성 때도 뜻이 같은 Task는 ID를 유지하며 빠진 번호를 다시 쓰거나 번호를 다시 매기지 않는다.
- 하위 영역이 여럿이면 `## Section: <name>`으로 묶는다.

## 매핑
- 각 `SPEC §5.N`(`[철회]` 제외)의 모든 문장이 매핑된 Task 중 하나의 목적이나 검증 조건에 들어 있어야 한다.
- 매핑되지 않은 조건은 main이 사용자에게 새 Task 추가 / §5에서 철회 / §4 제외 범위로 보류 중 하나를 받는다.

## main 마무리
- README의 `[ ] IMPLEMENT`는 그대로 두고, 작업 히스토리에 `- <yyyy-MM-dd>: IMPLEMENT 체크리스트 작성`을 더한다.
- 다음은 한 Task씩 `implement` → `verify`를 부르거나 `/implement-loop <feature-dir>`로 이어서 돌린다.
