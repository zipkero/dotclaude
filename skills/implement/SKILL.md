---
name: implement
description: >-
  Execute the next Task from features/<feature-dir>/implement.md. For Per-Request prompts without a feature directory, execute the requested change
  directly.
---

## 컨텍스트 로딩
`$ARGUMENTS`나 대화가 특정 feature를 가리키면 Phased mode이고, 그 feature를 활성 feature라고 한다.
가리킨다는 건 인자가 `features/<feature-dir>/`나 그 implement.md이거나, 이 대화에서 그 feature로 init command를 실행했거나, `/context-restore`가 `현재 작업 문서`로 복원했거나, 사용자나 위임 프롬프트가 그 feature를 짚은 경우다.
그 밖에는 Per-Request mode이며, `features/`를 만들지 않고 요청한 변경을 한다.

Phased mode에서는:
1. implement.md, design.md, spec.md를 읽는다.
2. 위임 프롬프트나 사용자가 짚은 Task, 없으면 위에서부터 첫 `[ ]` Task를 잡아 목적·접근·검증 조건·최근 reject를 기준으로 삼는다.
3. Task가 밖에서 볼 수 있는 동작 하나를 완성하지 못하는 조각이면 구현하지 않고 Task를 다시 나눠야 한다고 `blocked`로 알린다.
4. 이미 목적과 검증 조건이 만족되면 코드를 고치지 않고 그렇다고 적는다.

## 범위 원칙
- 새 public API나 다른 패키지·프로세스·사용자가 쓰는 경계가 필요하면 코드를 쓰기 전에 묻는다.
- 추상화와 확장 포인트는 design.md(Per-Request는 요청이나 `docs/design.md`)가 정한 것만 만든다.
- 범위 밖에서 발견한 문제는 고치지 않고 비고에 적되, 그 때문에 이미 `[x]`인 Task가 깨졌거나 지금 Task를 끝낼 수 없으면 `blocked`로 알린다.
- design.md §5의 정해지지 않은 Decision Point가 지금 Task에 걸려도 `blocked`로 알린다.

## 재작업
verify가 reject한 Task를 다시 할 때는 전에 되던 동작, 앞선 `[x]` Task의 동작, 기존 테스트·빌드가 깨지지 않았는지 확인하고, 설계를 바꿔야 고칠 수 있으면 `blocked`로 알린다.

## implementer 위임 기준
위임 프롬프트에는 `<feature-dir>`, 대상 `task-<nnn>`, Phased mode라는 것을, 재작업이면 직전 verify의 문제 항목을 적는다.

## 코드와 테스트
- 같은 디렉토리의 이름·구조·에러 처리 방식과, 이미 있는 함수·라이브러리·의존성을 쓴다.
- 이번 변경으로 안 쓰이게 된 코드는 지운다.
- 테스트는 Phased에서는 Task가 요구할 때만(고친 버그의 회귀 테스트 하나는 허용), Per-Request에서는 요청할 때만 쓰고, 부족해 보이면 비고에 적는다.
- 구조를 바꿔 깨지는 기존 테스트는 다루던 경우를 유지한 채 같이 고친다.
- 테스트가 실패하면 목적 기준으로 틀린 쪽을 고치고, 실패 입력만 피하는 분기나 완료 조건을 약하게 만드는 수정은 하지 않는다.

## 출력 구조
없는 항목은 뺀다.
1. 상태(Phased만) — `completed` 또는 `blocked`. `blocked`면 막힌 이유와 필요한 결정을 적는다.
2. 대상 — `task-<nnn>` 제목이나 사용자 요청 인용.
3. 변경 내용 — 무엇을 바꿨는지 글로, 고친 파일 경로와 새로 만든 이름.
4. 비고 — 범위 밖 발견, 확인 못 한 것, 미룬 것.
5. 접근 이탈 — Task 접근이나 요청과 다르게 정했거나 둘 다 정하지 않아 직접 정한 것, 이유와 버린 대안, `file:line`. 문서는 고치지 않고 여기에만 적는다.
6. 실행한 검증 — 돌린 명령과 결과.

## 완료
main이 하는 일이다.
- Phased에서 `completed`면 같은 턴에 `verify`를 부르고, 사용자가 구현만 요청했으면 verify를 권한다.
- `blocked`면 사용자에게 막힌 이유를 알린다.
- verify 뒤 기록은 `skills/verify/SKILL.md` §verify 후처리를 따른다.
