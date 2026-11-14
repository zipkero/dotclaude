---
name: implement
description: >-
  Execute the next Task from features/[feature-dir]/implement.md. For Per-Request prompts without a feature directory, execute the requested change
  directly.
---

## 컨텍스트 로딩
`$ARGUMENTS`나 이번 요청이 특정 feature의 작업이면 Phased mode이고, 그 feature를 활성 feature라고 한다.
인자가 `features/<feature-dir>/`나 그 implement.md이거나, 사용자·위임 프롬프트가 feature나 Task를 짚었거나, 이 대화의 init command·`/context-restore`로 잡힌 feature를 이어 가는 요청이 그렇다.
그 밖에는 Per-Request mode이며, `features/`를 만들지 않고 요청한 변경을 한다.

Phased mode에서는:
1. implement.md, design.md, spec.md를 읽는다.
2. 위임 프롬프트나 사용자가 짚은 Task, 없으면 위에서부터 첫 `[ ]` Task를 잡아 목적·접근·검증 조건·최근 reject를 기준으로 삼는다.
3. 이미 목적과 검증 조건이 만족되면 코드를 고치지 않고 그렇다고 적는다.

## 범위 원칙
Per-Request에서는 아래의 design.md를 요청이나 `docs/design.md`로, 지켜야 할 결정을 그 책임 경계·의존 방향·불변 조건으로 읽는다.
아래에서 멈출 때 Phased는 `blocked`로 알린다.
- design.md가 정하지 않은 외부 계약을 만들거나 바꿔야 하거나, design.md의 지켜야 할 결정을 바꾸거나 §5의 정해지지 않은 Decision Point를 정해야 하면 코드를 쓰기 전에 멈추고 묻는다.
- 범위 안 리팩터링도 외부 계약과 다른 모듈의 동작은 바꾸지 않고, design.md가 정한 추상화·확장 포인트는 만든다.
- 범위 밖에서 발견한 문제는 고치지 않고 비고에 적되, 그 때문에 이미 `[x]`인 Task가 깨졌거나 지금 작업을 끝낼 수 없으면 멈추고 묻는다.

## implementer 위임 기준
main은 Phased를 implementer agent에 맡기고, Per-Request는 직접 구현한다.
Task를 처음 위임하기 전에 `features/<feature-dir>/` 밖에 커밋 안 된 변경이 있으면 커밋·stash·그대로 두기 중 무엇을 할지 사용자에게 묻는다.
위임 프롬프트에는 `<feature-dir>`, 대상 `task-<nnn>`, 재작업이면 직전 verify의 문제 항목, 사용자가 이번 대화에서 프로젝트 `CLAUDE.md` §검증 환경과 다르게 정한 외부 호출 범위를 적는다.

## 코드와 테스트
- 테스트는 Phased에서는 `확인`이 테스트인 Task의 `결과`를, Per-Request에서는 요청한 것과 핵심 동작을 확인하는 만큼 쓴다.
- 어느 쪽이든 고친 버그의 회귀 테스트와, 기능 테스트로 경우를 다 볼 수 없는 판단 로직(규칙·계산·상태 전이)의 직접 테스트는 더한다.
- Phased 테스트는 `결과` 대상마다 그 대상만 어기는 변경(지키는 검사·분기·진입점 연결 하나를 지우는 것 등)에 실패하게 쓰고, 위반이 최종 출력에 드러나지 않으면 그 단계를 직접 assert한다.
- 테스트를 둘 수 없는 대상은 이유와 함께 비고에 적는다.
- 두 구현의 판정을 맞춰야 하면 한 곳에서 판정하게 모으고, 그럴 수 없으면 실제로 들어오는 입력 범위에서 비교해 그 범위를 비고에 적는다.
- 결과를 내기 전에 프로젝트 검증 명령(프로젝트 `CLAUDE.md`, 루트 `README.md` §검증 명령, CI 설정에 있는 것)의 build·typecheck·lint와 바뀐 범위의 테스트를 돌린다.
- 구조나 구현을 바꾸면 깨지는 기존 테스트는 다루던 경우를 유지한 채 같이 고친다.
- 리팩터링이나 공유 코드 수정처럼 그대로여야 하는 기존 동작을 건드렸는데 테스트가 덮지 않으면, 바꾸기 전 코드의 작업 트리 밖 사본(`git worktree add`·임시 디렉토리)에서 같은 입력(경계 입력 포함)으로 돌려 비교하고 실행한 검증에 적는다.
- 실패는 바꾸기 전 코드에서 같은 명령으로 같은 실패가 날 때만(편집 전 실행 결과나 사본으로 확인) 이번 변경과 무관하다고 보고 실행한 검증에 적는다.
- 실패·verify 지적은 목적 기준으로 틀린 쪽(코드나 테스트)을 고치고, 원인 수정이 design 결정을 넘으면 그 수정안을 선택지에 넣어 멈춘다.

## 출력 구조
없는 항목은 뺀다.
1. 상태(Phased만) — `completed` 또는 `blocked`
   `blocked`면 막힌 이유와 필요한 결정을 선택지·근거와 함께 적는다.
2. 대상 — `task-<nnn>` 제목이나 사용자 요청 인용.
3. 변경 내용 — 무엇을 바꿨는지 글로, 고친 파일 경로와 새로 만든 이름.
4. 비고 — 범위 밖 발견, 확인 못 한 것, 미룬 것.
5. 접근 이탈 — Task 접근·design.md 기본안·요청과 다르게 정했거나 이들이 정하지 않아 직접 정한 것(범위 안 리팩터링 포함), 이유와 버린 대안, 원래 방식이 지키던 성질이 유지되는 근거, `file:line`
   문서는 고치지 않고 여기에만 적는다.
6. 실행한 검증 — 돌린 명령과 결과, 확인 수단을 바꿨으면 `대체: <조건의 수단> → <쓴 수단> — <이유>`, Phased에서 `확인`이 테스트면 `결과` 대상마다 그 대상만 어기는 변경에 실패하는 테스트(`파일:이름`, 여러 대상이 한 테스트를 가리켜도 된다).

## 완료
main이 하는 일이다.
- Phased에서는 결과를 받으면 대상 Task 참조 아래에 `- 진행: <yyyy-MM-dd> <completed|blocked> — <`git status`로 본 `features/<feature-dir>/` 밖 변경 파일 중 위임 전에 그대로 두기로 한 것을 뺀 전체>; <접근 이탈이나 막힌 이유 한 줄>`을 쓰거나 고친다.
- `completed`면 같은 턴에 `verify`를 부르고(사용자가 빼 달라고 했으면 권하기만 한다), `blocked`면 막힌 이유와 선택지를 사용자에게 묻는다.
- verify 뒤 기록은 `~/.claude/skills/verify/SKILL.md` §verify 후처리를 따른다.
