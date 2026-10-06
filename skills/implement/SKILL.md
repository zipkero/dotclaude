---
name: implement
description: >-
  Execute the next Task from features/<feature-dir>/implement.md. For Per-Request prompts without a feature directory, execute the requested change
  directly.
---

## 컨텍스트 로딩
1. Phased mode — `$ARGUMENTS`가 `features/<feature-dir>/`나 그 implement.md를 가리키거나, 현재 대화가 활성 `features/<feature-dir>/` 범위를 가리킬 때 들어간다.
   활성 범위는 이 대화에서 그 feature에 `/spec-init` / `/design-init` / `/implement-init`이 실행되었거나, 이번 요청에서 사용자가 implement 뜻으로 그 feature를 콕 집어 가리킨 경우다.
   `/implement-loop`이 부르면 판정 없이 Phased mode다.
   - implement.md·design.md(설계 기준)·spec.md(완료 조건 매핑)를 읽는다.
     implement.md가 없으면 멈추고 `/implement-init` 실행을 안내한다.
   - implement.md 위에서부터 첫 미완료 Task를 잡고(위치가 의존 순서다) 목적 / 접근 / 검증 조건을 실행 기준으로 삼는다.
     그 Task가 외부에서 관찰할 수 있는 동작 하나를 완성하거나 보존하지 못하는 코드 조각이면, 구현하지 않고 Task 경계를 다시 잡아야 한다고 `blocked`로 보고한다.
   - 코드를 쓰기 전에 목적·검증 조건이 이미 성립하는지 확인한다.
     상위 문서 재작성으로 초기화된 Task는 구현이 코드에 남아 있으므로 현재 spec.md·design.md 기준으로 어긋난 자리만 고치고, 어긋난 곳이 없으면 코드를 고치지 않고 그 사실을 변경 내용에 적는다.
2. Per-Request mode — 그 밖의 경우다.
   `features/<feature-dir>/`를 만들지 않고 요청 범위에 §비확장 기본 원칙대로 변경을 적용한다.

## 비확장 기본 원칙
- 새 public API·외부 계약·모듈 밖 소비자(다른 패키지·프로세스·사용자)가 쓰는 경계가 필요하면 코드를 쓰기 전에 묻는다.
- 모듈 안에서 끝나는 helper·함수 경계와 요청한 변경에 반드시 필요한 설정 항목은 만들고 변경 내용에 밝힌다.
- 추상화·확장 포인트는 design.md §5가 채택한 것만 둔다.
- 현재 Task(Per-Request는 요청) 범위 밖에서 찾은 문제는 고치지 않고 비고·한계에 적는다.
  다만 그 문제로 이미 `[x]`인 Task의 `목적`이 깨졌거나 현재 Task의 `목적`을 이룰 수 없으면 `blocked`로 내고 성립하지 않는 동작·그 Task·근거를 상태 항목에 적는다.
  고칠지와 어느 Task의 범위로 볼지는 사용자가 정한다.

## 미결정 분석 시 중단
design.md §5의 미해결 Decision Point(뜻은 `commands/implement-init.md` §전제 조건)가 현재 Task에 걸리면 코드를 쓰지 않고 필요한 결정을 `blocked`로 보고한다.

## 재작업 시 파급 점검
verify가 reject한 Task를 다시 구현할 때는 앞선 시도에서 성립했던 동작, 이미 `[x]`인 Task가 만든 동작, 변경 범위에 걸리는 기존 테스트·빌드가 그대로인지 확인한다.
영향이 있으면 같은 재작업에서 고치고, 설계 변경이 필요하면 고치지 않고 `blocked`로 보고하며, 확인하지 못한 항목은 비고·한계에 밝힌다.

## 출력 구조
Phased mode 반환의 첫 줄은 `<!-- prowl-workflow: v1 implement -->`다.
해당하지 않는 항목은 뺀다.
1. 상태 — Phased mode 반환에만 둔다.
   - `completed`: 구현을 마쳤다.
     검증 조건을 확인하지 못했어도 포함한다.
   - `blocked`: 이 문서가 `blocked`로 내라고 한 경우다.
     막힌 사유와 필요한 결정을 함께 적는다.
2. 변경 내용 — 무엇을 바꿨는지 글로 적고 코드 블록을 다시 붙이지 않는다.
3. 핵심 — 실행한 Task 식별자(Phased: `task-<nnn>` 제목, Per-Request: 사용자 요청 인용)와 핵심 변경점.
4. 고친 파일 — 고친 경로 목록. 다음 `verify`의 변경 범위로 쓰인다.
5. 비고·한계 — 범위 밖에서 찾은 것, 확인 못 한 부분, 미룬 작업.
6. 접근 이탈 — 구현이 Task 접근 필드와 달라졌거나(Phased) 요청에 없던 판단을 정했을 때(Per-Request).
   무엇을 왜 정했는지와 `file:line`을 적고, 이번 변경 밖에서도 성립하는 결정이면 `docs/design.md` 반영 후보로 밝힌다.
   설계 결정을 벗어났는지는 verify가 판정한다.

## 완료
main 전용 절차다.
implementer agent는 문서를 고치지 않으며, 정정할 것을 접근 이탈로 보고한 뒤 멈춘다.

- Phased mode에서 `상태`가 `completed`이면 `verify`를 같은 턴에 이어서 부르고, 그 턴의 최종 응답은 verify §출력 구조로 낸다.
  사용자가 구현만 요청했으면 부르지 않고 `verify`를 권한다.
  `blocked`이면 부르지 않고 막힌 사유를 사용자에게 올린다.
- 체크박스와 접근 필드는 verify가 `approved`를 돌려준 뒤 main이 바꾼다(`skills/verify/SKILL.md` §verify 후처리).
  `rejected`이면 접근 필드를 그대로 두고, 구현과 design.md 중 무엇을 고칠지는 verify가 낸 `수정 소유 단계`를 따른다.

## 테스트 코드 작성
- 테스트 코드는 Task의 제목·접근·`확인`이 테스트 작성을 가리킬 때만 쓴다.
- 고친 버그를 재현하는 회귀 테스트 하나는 함께 넣을 수 있다.
- 기존 코드의 구조·이름·시그니처를 바꿔 깨지는 기존 테스트는 함께 고친다.
  합치거나 나눠도 되지만 다루던 경우와 검증 강도는 남기고, 남길 수 없으면 이유를 비고·한계에 적는다.
- Per-Request mode에서는 테스트를 조용히 더하지 않는다.
  회귀 위험이 있거나 기존 테스트가 변경 범위에 비해 모자라 보이면 비고·한계에 밝히고, 더할지는 사용자가 정한다.
- 구현의 근거는 테스트가 아니라 `목적`·`참조(SPEC §5)`다.
  테스트가 실패하면 `목적` 기준으로 구현과 테스트 중 틀린 쪽을 가리며, 어느 쪽도 spec.md 완료 조건을 약하게 만드는 방향으로 고치지 않는다.

## 지침
- 같은 디렉토리 기존 파일의 이름 짓기·구조·에러 처리 패턴을 따르고, 파일 배치·분리가 Task 접근 필드의 힌트와 부딪히면 디렉토리 관례를 먼저 따른다.
- 같은 일을 하는 함수가 있으면 그것을 쓰고, 같은 대상을 검증하는 테스트가 있으면 그 테스트에 경우를 더한다.
- 이번 변경으로 쓰이지 않게 된 코드는 같은 변경에서 지운다.
