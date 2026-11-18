---
paths:
  - "**/features/**/*.md"
---

# feature 문서 작업 기준

- 한국어로 쓰고, 한 줄에 한 문장을 쓴다.
- 요구사항이 바뀌면 spec.md → design.md → implement.md 순서로 고친다.
- spec.md·design.md에서 다음 단계 문서가 근거로 삼는 내용이 바뀌면, 바뀐 문서를 그 문서의 command(`/spec-init`·`/design-init`)로 전체를 다시 쓴다.
- 그 밖의 수정과 implement.md·feature `README.md`·체크박스는 main이 필요한 부분만 고치고, Task ID와 체크박스 항목은 지우지 않는다.
- Task의 목적·검증 조건은 참조한 `SPEC §5.N` 문장의 뜻을 바꾸지 않는 범위에서 main이 고치고 `- 검증 조건 변경: <yyyy-MM-dd> <바꾼 점> — <이유>`를 남기며, 뜻을 바꿔야 하면 사용자에게 묻는다.
- spec.md §5의 `[철회]` 조건은 design.md 연결, Task 매핑, verify 판정 대상에서 뺀다.
- design.md의 §1 모듈 경계·의존 방향·불변 조건, §3 인터페이스, §5 채택은 구현이 지켜야 할 결정이고, 그 밖의 서술은 구현이 더 나은 방식을 찾으면 접근 이탈로 바꿀 수 있는 기본안이다.

## 승인 전 확인
spec.md·design.md의 `## 승인 전 확인`은 사용자 판단이 필요한 질문이 있을 때만 둔다.
- 답을 받으면 본문에 반영하고 항목을 지운다.
- 사용자가 보류하면 `- (보류) <질문>. 관련 본문: §N`으로 남긴다.

## 작성 후 검토
`/spec-init`·`/design-init`·`/implement-init`이 문서를 쓰거나 다시 쓰면, main은 README·작업 히스토리를 고치기 전에 아래를 한다.
1. doc-reviewer agent에 `<feature-dir>`, 대상 문서, 그 문서를 쓴 command 경로를 넘기고, 대화 내용은 넘기지 않는다.
2. main은 문서가 이번 대화에서 사용자가 확정한 내용·요청 의도와 어긋나는지 직접 본다.
3. doc-reviewer나 main이 낸 지적의 `수정 소유 단계`가 대상 문서의 command이면 작성자가 고치고, doc-reviewer의 남은 지적은 넘기지 않는다.
   - spec.md는 main이 고치고, design.md·implement.md는 같은 analyzer에 지적을 넘겨 이어서 맡기며, 이어 갈 수 없으면 새 analyzer에 문서 경로와 지적을 넘긴다.
   - 고친 뒤 새 doc-reviewer에 직전 지적을 함께 넘겨 1·2를 다시 하며, 고치기는 문서마다 최대 2회다.
4. 아래면 멈추고 지적, 근거, 선택지를 사용자에게 알린다.
   - `수정 소유 단계`가 앞 단계 command이거나 `사용자 판단`이다.
   - 2회 고친 뒤에도 지적이 남는다.
   사용자가 답하면 main이 답을 반영하고(앞 단계 문서는 그 command로 다시 쓴다) 1부터 다시 하며, 고치기 횟수는 새로 센다.
5. doc-reviewer가 `pass`이고 main의 지적도 없으면 doc-reviewer의 남은 지적을 사용자에게 알리고 그 command의 남은 절차를 한다.

## 재작성 시 승인 취소
`/spec-init`·`/design-init`·`/implement-init`으로 기존 문서를 다시 쓸 때, implement.md에 `[x]` Task가 있으면 `[ ]`로 되돌아갈 수 있는 Task를 알리고 먼저 묻는다.
다시 쓰면 main이 아래를 한다.
- 뜻이 바뀐 `SPEC §5.N`·`DESIGN §N`을 참조하거나 목적·검증 조건이 바뀐 Task와, 그 Task에 의존하는 뒤쪽 Task를 `[ ]`로 되돌리고 `승인 근거`를 지운다.
- 영향 범위를 알 수 없으면 모두 되돌린다.
- Task를 하나라도 되돌리면 README의 `IMPLEMENT`를 `[ ]`로 되돌리고, `/spec-init` 재작성이면 `DESIGN`을 `[ ]`로 되돌린다.
- 다시 쓰는 문서보다 뒤 단계인 design.md·implement.md는 지우지 않고, Task의 내용·ID·순서는 `/implement-init` 재작성이 아니면 그대로 둔다.
- 작업 히스토리에 `- <yyyy-MM-dd>: <SPEC|DESIGN|IMPLEMENT> 재작성`과 되돌린 Task를 적는다.
