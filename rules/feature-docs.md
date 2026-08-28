---
paths:
  - "**/features/**/*.md"
---

# feature 문서 작업 기준

- `design.md`는 `features/<feature-dir>/design.md`를 가리킨다.
  프로젝트 루트 문서는 `docs/design.md`로 적는다.
- feature 산출물 구조와 `<feature-dir>` 만들기·재사용 규칙은 `commands/spec-init.md`가 소유한다.
- 요구사항이 바뀌면 spec.md를 먼저 고치고, 영향받는 design.md → implement.md 순서로 반영한다.
- spec.md·design.md는 부분 수정하지 않고 그 문서를 쓰는 주체가 전문을 다시 쓴다.
  예외는 `commands/design-init.md` §실행 주체가 main에 맡긴 검토 후 정정뿐이다.
- implement.md와 feature `README.md`는 main이 영향받은 자리만 고치고, Task ID와 체크박스 항목은 지우거나 다시 번호 매기지 않는다.
- 진행 상태(implement.md 체크박스, feature README 상태판)는 main이 소유한다.
