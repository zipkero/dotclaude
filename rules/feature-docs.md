---
paths:
  - "**/features/**/*.md"
---

# feature 문서 작업 기준

- `design.md`는 `features/<feature-dir>/design.md`를 가리킨다.
  프로젝트 루트 문서는 `docs/design.md`로 적는다.
- feature 산출물 구조와 `<feature-dir>` 만들기·재사용 규칙은 `commands/spec-init.md`가 소유한다.
- 요구사항이 바뀌면 spec.md를 먼저 고치고, 영향받는 design.md → implement.md 순서로 반영한다.
- spec.md·design.md는 하위 문서가 기대는 내용이 바뀌면 그 문서를 쓰는 주체가 전문을 다시 쓰고, 그 밖의 정정은 main이 바뀐 자리만 고친다.
- implement.md와 feature `README.md`는 main이 영향받은 자리만 고치고, Task ID와 체크박스 항목은 지우거나 다시 번호 매기지 않는다.
- 진행 상태(implement.md 체크박스, feature README 상태판)는 main이 소유한다.

## 재작성 시 하위 승인 상태 초기화
`/spec-init`·`/design-init`·`/implement-init`으로 기존 산출물을 다시 쓸 때 하위 승인 상태를 다음 규칙으로 초기화한다.
- 초기화 대상: feature README.md 상태판의 `IMPLEMENT`를 `[ ]`로, implement.md의 모든 Task 체크박스를 `[ ]`로 되돌린다.
  `/spec-init` 재작성이면 `DESIGN`도 `[ ]`로 되돌린다.
  `/implement-init` 재작성은 implement.md를 새로 쓰므로 `IMPLEMENT`만 되돌린다.
- 보존 대상: implement.md·design.md 파일 자체와, `/spec-init`·`/design-init` 재작성일 때 각 Task의 내용·ID·순서.
  README.md 상태판의 `SPEC`은 이 규칙이 건드리지 않는다.
- 작업 히스토리에 `- <yyyy-MM-dd>: <SPEC|DESIGN|IMPLEMENT> 재작성으로 하위 승인 상태 초기화` 한 줄을 남기고 되돌린 항목을 함께 적는다.
- 각 체크박스가 뜻하는 불변식은 `[x] DESIGN`은 `commands/design-init.md` §역할이,
  Task 체크박스는 `skills/verify/SKILL.md` §역할이, `[x] IMPLEMENT`는 같은 파일 §verify 후처리가 정의한다.
