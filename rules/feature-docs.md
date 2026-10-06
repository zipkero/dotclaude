---
paths:
  - "**/features/**/*.md"
---

# feature 문서 작업 기준

- `design.md`는 `features/<feature-dir>/design.md`를, `docs/design.md`는 프로젝트 루트 문서를 가리킨다.
- 요구사항이 바뀌면 spec.md를 먼저 고치고 영향받는 design.md → implement.md 순서로 반영한다.
- spec.md·design.md는 하위 문서가 기대는 내용이 바뀌면 그 문서를 쓰는 주체가 전문을 다시 쓰고, 그 밖의 정정은 main이 바뀐 자리만 고친다.
- implement.md와 feature `README.md`는 main이 영향받은 자리만 고치고, Task ID와 체크박스 항목은 지우거나 다시 번호 매기지 않는다.
- 진행 상태(implement.md 체크박스, feature README 상태판)는 main이 소유한다.

## 재작성 시 승인 취소
`/spec-init`·`/design-init`·`/implement-init`으로 기존 산출물을 다시 쓰면 main이 다음과 같이 한다.
- 영향받는 Task는 `[ ]`로 되돌리고 `승인 근거`를 지우며, 나머지 Task의 `[x]`·`승인 근거`는 유지한다.
  영향받는 Task는 뜻이 바뀐 `SPEC §5.N`·`DESIGN §X.Y`를 참조하거나 `목적`·검증 조건이 바뀐 Task와, 그 Task의 동작을 전제로 하는 뒤쪽 Task다.
- 영향 범위를 정할 수 없으면 모든 Task를 되돌린다.
- Task를 하나라도 되돌리면 `IMPLEMENT`를, `/spec-init` 재작성이면 `DESIGN`도 `[ ]`로 되돌린다.
- implement.md·design.md 파일은 지우지 않고, `/spec-init`·`/design-init` 재작성은 각 Task의 내용·ID·순서를 보존한다.
- 작업 히스토리에 `- <yyyy-MM-dd>: <SPEC|DESIGN|IMPLEMENT> 재작성` 한 줄과 되돌린 Task·유지한 Task를 남긴다.
