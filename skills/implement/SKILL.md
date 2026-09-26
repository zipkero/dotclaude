---
name: implement
description: >-
  Execute the next Task from features/<feature-dir>/implement.md. For Per-Request prompts without a feature directory, execute the requested change
  directly.
---

## 컨텍스트 로딩
1. Phased mode — 다음 둘 중 하나일 때 들어간다.
   - `$ARGUMENTS`가 `features/<feature-dir>/` 또는 `features/<feature-dir>/implement.md`와 매치하거나,
   - 현재 대화가 활성 `features/<feature-dir>/` 범위를 가리키는 경우. 이 범위의 뜻은 다음과 같다 — 이 대화에서 해당 feature에 대해 `/spec-init` /
     `/design-init` / `/implement-init`이 실행되었거나, 이번 요청에서 사용자가 implement 뜻으로 해당 feature를 콕 집어 가리킨 경우.

   예외: `/implement-loop`이 부른 경우는 판정 없이 Phased mode로 고정된다(`commands/implement-loop.md` §전제 조건).

   동작:
   - implement.md·design.md(설계 기준)·spec.md(완료 조건 매핑)를 읽는다.
     implement.md가 없으면 멈추고 사용자에게 `/implement-init`을 실행하도록 안내한다.
   - implement.md 위에서부터 첫 미완료 Task를 잡는다 — 자리가 곧 의존 순서다(`commands/implement-init.md` §순서). 그 Task의 목적 / 접근 / 검증 조건
     필드를 실행 기준으로 삼는다. 잡은 Task가 외부에서 관찰할 수 있는 동작 하나를 완성하거나 보존하지 못하고 코드 조각 수준에 그치면,
     구현하지 말고 Task 경계를 다시 잡아야 한다고 `blocked`로 보고한다 — 대개 뒤따르는 Task와 합쳐야 한다는 뜻이다.
   - 코드를 쓰기 전에 그 Task의 목적·검증 조건이 이미 성립하는지 확인한다. 상위 문서 재작성으로 초기화된 Task는 구현 결과가 코드에 남아 있으므로,
     처음부터 다시 만들지 않고 현재 spec.md·design.md 기준으로 어긋난 자리만 고친다. 어긋난 곳이 없으면 코드를 고치지 않고 그 사실을
     §출력 구조 변경 내용에 적는다.
2. Per-Request mode — Phased mode의 어느 조건도 맞지 않을 때 들어간다.
   - `features/<feature-dir>/`를 만들지 않는다.
   - 정리된 요청 범위에 변경을 적용한다. §비확장 기본 원칙을 따른다.

## 비확장 기본 원칙
범위 기준은 CLAUDE.md §범위를 따르며, 구현에서는 여기에 새 public API·외부 계약·모듈 밖으로 드러나는 경계를 더한다.
이 중 하나가 필요하면 코드를 쓰지 말고 먼저 묻는다.
모듈 안에서 끝나는 helper·함수 경계와, 요청한 변경이 성립하는 데 반드시 필요한 설정 항목은 그대로 만들고 §출력 구조 변경 내용에 밝힌다.
추상화·확장 포인트 도입은 `commands/design-init.md` §5가 소유한다.

또한 현재 Task(Per-Request에서는 사용자 요청) 범위 밖에서 찾은 문제(기존 버그, 잘못된 주석, dead code 등)는 같은 응답에서 고치지 않고 §출력 구조의
비고·한계 항목에 보고만 한다.

예외 — 범위 밖에서 찾은 것이 이미 `[x]`인 Task의 `목적`에 적힌 동작이 성립하지 않는 증거이거나, 현재 Task의 `목적`이 그 문제 때문에 성립할 수 없는
증거이면 비고·한계에 두지 않는다. 상태를 `blocked`로 내고, 성립하지 않는 동작과 그것이 속한 Task, 그렇게 판단한 근거를
§출력 구조 상태 항목에 함께 적는다.
고칠지와 어느 Task의 범위로 볼지는 사용자가 정한다.

## 미결정 분석 시 중단
design.md §5에 미해결 Decision Point("미해결" 뜻은 `commands/implement-init.md` §전제 조건)가 있고 그것이 현재 Task에 영향을 주면,
코드를 쓰지 말고 필요한 결정을 `blocked`로 보고한다.

## 재작업 시 파급 점검
verify가 reject한 Task를 다시 구현할 때는 지적받은 자리만 고치고 끝내지 않는다. 앞선 시도에 이미 성립했던 동작과
이미 `[x]`인 Task가 만든 동작이 그대로인지, 변경 범위에 걸리는 기존 테스트·빌드가 여전히 통과하는지 확인한다.
영향이 있으면 같은 재작업 안에서 함께 고치고, 설계 변경이 필요하면 고치지 않고 §출력 구조 상태에 `blocked`로 보고한다.
확인하지 못한 항목은 §출력 구조 비고·한계에 밝힌다.

## 출력 구조
아래 항목은 해당하지 않으면 뺀다.
1. 상태 — Phased mode 반환에 빠짐없이 적고, Per-Request에는 두지 않는다. 값은 `completed` 또는 `blocked`.
   `blocked`이면 막힌 사유와 필요한 결정을 같은 항목 안에 함께 적는다.
2. 변경 내용 — 무엇을 바꿨는지 글로 적고, 코드 블록을 다시 붙여넣지 않는다.
3. 핵심 — 실행한 Task 식별자(Phased: `task-<nnn>` 제목, Per-Request: 사용자 요청 인용)와 핵심 변경점.
4. 고친 파일 — 고친 경로 목록. 다음 `verify` 호출의 변경 범위로 쓰인다.
5. 비고·한계 — 범위 밖에서 찾은 것, 확인 못 한 부분, 미룬 작업이 있을 때만.
6. 접근 이탈 — Phased mode에서 실제 구현이 Task 접근 필드와 달라졌을 때만.
   무엇이 어떻게 달라졌는지와 그렇게 구현한 이유를 적는다.
   설계 결정에서 벗어났는지는 `skills/verify/SKILL.md` §판단 순서 넷째 기준이 판정하므로 여기서 미리 가르지 않는다.

## 완료
main 전용 절차다. implementer agent는 문서를 고치지 않으며, 아래 정정 대상을 §출력 구조 접근 이탈로 보고한 뒤 멈춘다.

- Phased mode: 체크박스 바꾸기는 verify가 `approved`를 돌려준 뒤 main이 한다 (`skills/verify/SKILL.md` §verify 후처리).
  `상태`가 `completed`이면 다음 단계로 `verify`를 권한다.
  사용자가 구현과 검증 전체를 명시 요청한 경우에만 `verify`를 같은 턴에 이어서 부른다.
  `상태`가 `blocked`이면 `verify`를 부르지 않고 막힌 사유를 사용자에게 올린다.
- Phased mode에서 접근 이탈이 보고되면 main은 verify가 `approved`를 돌려준 뒤 그 Task의 접근 필드를 실제 구현 방식으로 고친다.
  `rejected`이면 접근 필드를 고치지 않으며, 구현과 design.md 중 무엇을 고칠지는 `skills/verify/SKILL.md` §reject 분류가 낸
  `수정 소유 단계`를 따른다.
- Per-Request mode: 문서를 고치지 않는다.

## 테스트 코드 작성
implement는 **테스트 Task에 한해서만** 테스트 코드를 쓴다. 다음 중 하나에 해당하면 테스트 Task로 본다.
- Task 제목·접근 필드가 테스트를 명시적으로 가리키는 경우 ("…테스트 작성", "unit/integration/e2e test").
- 검증 조건 `확인` 필드가 테스트 실행을 밝히는 경우 (예: "CI/로컬에서 해당 테스트가 통과한다").

버그 수정 예외: 고친 버그를 다시 재현하는 회귀 테스트 하나는 함께 넣을 수 있다. feature 추가는 이 예외에 해당하지 않는다.

구조 변경 예외: Task가 기존 코드의 구조·이름·시그니처를 바꾸면 깨지는 기존 테스트를 함께 고친다.
합치거나 나눠도 되지만 다루던 경우와 검증 강도는 남기고, 남길 수 없으면 이유를 §출력 구조 비고·한계에 적는다.

Per-Request mode에서는 조용히 테스트를 더하지 않는다. 의미 있는 회귀 위험이 있으면 §출력 구조 비고·한계 항목에 빠진 것을 밝히고, 더할지는 사용자가
다음 응답에서 정한다. 기존 테스트가 변경 범위에 비해 모자라 보일 때도 똑같이 한다.

구현의 근거는 테스트가 아니라 `목적`·`참조(SPEC §5)`다. 테스트가 실패하면 `목적` 기준으로 구현과 테스트 중 무엇이 틀렸는지 가려내며,
어느 쪽도 spec.md 완료 조건을 약하게 만드는 방향으로는 고치지 않는다.

## 지침
- 기존 관례를 따른다 — 같은 디렉토리 기존 파일의 이름 짓기·구조·에러 처리 패턴에 맞춘다.
  lint·format 설정이 있으면 그 설정을 먼저 따른다.
- 파일 배치·분리가 Task 접근 필드의 힌트와 부딪히면 디렉토리 관례를 먼저 따른다.
