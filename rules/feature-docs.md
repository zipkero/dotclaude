---
paths:
  - "**/features/**/*.md"
---

# feature 문서 작업 기준

- 한국어로 쓰고, 한 줄에 한 문장을 쓴다.
- `design.md`는 `features/<feature-dir>/design.md`, `docs/design.md`는 프로젝트 루트 문서다.
- 요구사항이 바뀌면 spec.md → design.md → implement.md 순서로 고친다.
- spec.md·design.md에서 다음 문서가 기대는 내용이 바뀌면 바뀐 문서를 자기 command(`/spec-init`·`/design-init`)로 전체를 다시 쓴다.
- 그 밖의 수정과 implement.md·feature `README.md`·체크박스는 main이 필요한 부분만 고친다.
- Task ID와 체크박스 항목은 지우거나 번호를 다시 매기지 않는다.
- Task의 목적·검증 조건은 참조한 `SPEC §5.N` 문장의 뜻을 바꾸지 않는 범위에서 main이 고치고 `- 검증 조건 변경: <yyyy-MM-dd> <바꾼 점> — <이유>`를 남기며, 뜻을 바꿔야 하면 사용자에게 묻는다.

## 승인 전 확인
spec.md·design.md의 `## 승인 전 확인`은 사용자 판단이 필요한 질문이 있을 때만 둔다.
- 답을 받으면 본문에 반영하고 항목을 지운다.
- 사용자가 보류하면 `- (보류) <질문>. 관련 본문: §N`으로 남긴다.
- `(보류)`가 아닌 항목이 남아 있으면 다음 단계로 넘어가지 않는다.

## 재작성 시 승인 취소
`/spec-init`·`/design-init`·`/implement-init`으로 기존 문서를 다시 쓸 때, 뒤 단계인 design.md·implement.md가 있으면 되돌릴 수 있는 Task를 알리고 먼저 묻는다.
다시 쓰면 main이 아래를 한다.
- 뜻이 바뀐 `SPEC §5.N`·`DESIGN §N`을 참조하거나 목적·검증 조건이 바뀐 Task와, 그 Task에 기대는 뒤쪽 Task를 `[ ]`로 되돌리고 `승인 근거`를 지운다.
- 영향 범위를 알 수 없으면 모두 되돌린다.
- 하나라도 되돌리면 README의 `IMPLEMENT`를 `[ ]`로 되돌린다.
- `/spec-init` 재작성이면 README의 `DESIGN`을 `[ ]`로 되돌린다.
- 다시 쓰는 문서보다 뒤 단계인 design.md·implement.md는 지우지 않고, Task의 내용·ID·순서는 `/implement-init` 재작성이 아니면 그대로 둔다.
- 작업 히스토리에 `- <yyyy-MM-dd>: <SPEC|DESIGN|IMPLEMENT> 재작성`과 되돌린 Task를 적는다.
