---
paths:
  - "**/features/**/*.md"
---

# feature 문서 작업 기준

- 한국어로 쓰고, 한 줄에 한 문장을 쓴다.
- `design.md`는 `features/<feature-dir>/design.md`, `docs/design.md`는 프로젝트 루트 문서다.
- 요구사항이 바뀌면 spec.md → design.md → implement.md 순서로 고친다.
- spec.md·design.md에서 다음 문서가 기대는 내용이 바뀌면, 그 문서를 만드는 command로 전체를 다시 쓴다.
- 그 밖의 수정과 implement.md, feature `README.md`, 체크박스·상태판은 main이 필요한 부분만 고친다.
- Task ID와 체크박스 항목은 지우거나 번호를 다시 매기지 않는다.

## 재작성 시 승인 취소
`/spec-init`·`/design-init`·`/implement-init`으로 기존 문서를 다시 쓰면 main이 아래를 한다.
- 영향받는 Task를 `[ ]`로 되돌리고 `승인 근거`를 지운다.
  나머지 Task는 그대로 둔다.
- 영향받는 Task는 뜻이 바뀐 `SPEC §5.N`·`DESIGN §N`을 참조하는 Task, `목적`이나 검증 조건이 바뀐 Task, 그리고 그 Task들에 기대는 뒤쪽 Task다.
- 영향 범위를 알 수 없으면 모두 되돌린다.
- Task를 하나라도 되돌리면 README의 `IMPLEMENT`를 `[ ]`로 되돌린다.
  `/spec-init` 재작성이면 `DESIGN`도 되돌린다.
- implement.md·design.md는 지우지 않는다.
- `/spec-init`·`/design-init` 재작성 때 Task의 내용·ID·순서는 그대로 둔다.
- 작업 히스토리에 `- <yyyy-MM-dd>: <SPEC|DESIGN|IMPLEMENT> 재작성`과 되돌린 Task·유지한 Task를 적는다.
