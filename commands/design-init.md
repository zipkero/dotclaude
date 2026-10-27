---
description: Create design.md (design decisions) under features/<feature-dir>/ from spec.md
argument-hint: "<feature-dir>"
---

`features/<feature-dir>/design.md`를 쓴다.

Feature directory: $ARGUMENTS

## 쓰는 방법
- main은 analyzer agent에 맡기고, design.md가 이미 있으면 `rules/feature-docs.md` §재작성 시 승인 취소를 따른다.
- analyzer는 spec.md를 전부 읽고, §1 입력 맥락에서부터 코드를 조사하며, 요구사항을 더하거나 약하게 바꾸지 않는다.
- spec.md §5는 옮기지 않고 `SPEC §5.N`으로 가리키며, `/clear` 뒤에도 spec.md와 design.md만으로 implement.md를 만들 수 있게 쓴다.
- analyzer는 아래 경우 쓰지 않고 main에 돌려주며, main이 사용자에게 묻는다.
  - spec.md 승인 전 확인에 `(보류)`가 아닌 항목이 남아 있다.
  - spec.md 안에 설계에 영향을 주는 모순이 있다.
  - 외부 계약이나 사용자가 보는 동작을 바꾸는 결정을 spec.md로 정할 수 없다.

## main 검토
- spec.md §5의 모든 조건이 본문에 `SPEC §5.N`으로 연결됐는지 보고, 설계가 다루지 않는 조건이 있으면 analyzer에 다시 맡긴다.
- README를 `[x] DESIGN`으로 바꾸고 작업 히스토리에 `- <yyyy-MM-dd>: DESIGN 작성`을 더한다(재작성이면 `rules/feature-docs.md` §재작성 시 승인 취소).

## design.md 구조
```markdown
# <feature-name> 설계

## 승인 전 확인
- <채택안이 의도와 맞는지 묻는 질문>. 관련 본문: §N

## 근거
<읽은 spec.md 범위와 코드에서 확인한 사실>

## 1. 구조
<모듈·레이어를 어떻게 나누는지 경계 단위로, 깨지면 안 되는 의존 방향과 불변 조건>

## 2. 데이터 흐름
<진입점부터 결과까지, 상태 변화, 외부 연동, 실패 경로>

## 3. 인터페이스
<외부 계약: API 시그니처, 이벤트·저장·설정 형식 등>

## 4. 영향 범위
<건드리는 기존 모듈, 실제로 깨지는 호환성·마이그레이션, 갱신할 프로젝트 루트 문서. 없으면 `없음`>

## 5. Decision Points
**<판단이 갈린 지점>**
- <옵션>: <얻는 것>. <대가>.
- 채택: <고른 옵션>. <이유>.
```
- 승인 전 확인은 `rules/feature-docs.md` §승인 전 확인을 따른다.
- §3 인터페이스, §1의 모듈 경계·의존 방향·불변 조건, §5의 채택은 구현이 지켜야 할 결정이고, 그 밖의 서술은 구현이 더 나은 방식을 찾으면 접근 이탈로 바꿀 수 있는 기본안이다.
- §5에는 실제로 검토한 설계 선택과 위험만 두고, 없으면 `없음`이다.
- 외부 계약·모듈 경계처럼 나중에 바꾸기 비싼 결정은 기존 구조를 그대로 쓰는 안을 포함해 옵션을 둘 이상 적는다.
- 사용자가 보류한 결정만 `채택: 미정`으로 남긴다.
- Task 목록, 세부 코딩 내용, 근거 없는 일반론은 넣지 않는다.
