---
name: implement
description: >-
  Execute the next Task from features/<feature-dir>/implement.md. For Per-Request prompts without a feature directory, execute the requested change
  directly.
---

## 컨텍스트 로딩
### Phased mode
아래 중 하나면 Phased mode다.
- `$ARGUMENTS`가 `features/<feature-dir>/`나 그 implement.md를 가리킨다.
- 이 대화에서 그 feature로 `/spec-init`·`/design-init`·`/implement-init`을 실행했다.
- `/context-restore`가 그 feature를 `현재 작업 문서`로 복원했다.
- 사용자가 이번 요청에서 그 feature를 구현하라고 짚었다.
- 위임 프롬프트에 Phased mode라고 적혀 있다.

이 조건으로 잡힌 feature를 활성 feature라고 한다.

1. implement.md, design.md, spec.md를 읽는다.
   implement.md가 없으면 멈추고 `/implement-init`을 안내한다.
2. implement.md 위에서부터 첫 `[ ]` Task를 잡는다.
   문서 안의 순서가 곧 의존 순서다.
3. 그 Task의 목적, 접근, 검증 조건, 최근 reject를 기준으로 삼는다.
4. Task가 밖에서 볼 수 있는 동작 하나를 완성하지 못하는 조각이면 구현하지 않는다.
   Task를 다시 나눠야 한다고 `blocked`로 알린다.
5. 코드를 쓰기 전에 목적과 검증 조건이 이미 만족되는지 본다.
   상위 문서 재작성으로 승인이 취소된 Task는 코드가 이미 있으므로, 지금 spec.md·design.md와 어긋난 곳만 고친다.
   어긋난 곳이 없으면 코드를 고치지 않고 그렇다고 적는다.

### Per-Request mode
그 밖의 경우다.
`features/<feature-dir>/`를 만들지 않고, 요청한 변경을 §범위 원칙대로 한다.

## 범위 원칙
- 새 public API, 외부 계약, 다른 패키지·프로세스·사용자가 쓰는 경계가 필요하면 코드를 쓰기 전에 묻는다.
- 모듈 안의 helper와, 실제로 다른 값이 들어오는 설정·인자는 만들어도 된다.
  만들었으면 변경 내용에 적는다.
- 추상화와 확장 포인트는 design.md §5(Per-Request는 요청이나 `docs/design.md`)가 정한 것만 만든다.
- 범위 밖에서 발견한 문제는 고치지 않고 비고·한계에 적는다.
- 그 문제 때문에 이미 `[x]`인 Task의 목적이 깨졌거나 지금 Task를 끝낼 수 없으면 `blocked`로 알린다.
  고칠지와 어느 Task에서 고칠지는 사용자가 정한다.

## 정해지지 않은 설계
design.md §5에 아직 정해지지 않은 Decision Point(`commands/implement-init.md` §전제 조건)가 지금 Task에 걸리면 코드를 쓰지 않는다.
필요한 결정을 `blocked`로 알린다.

## 재작업
verify가 reject한 Task를 다시 구현할 때는 아래가 깨지지 않았는지 확인한다.
- 앞선 시도에서 되던 동작
- 이미 `[x]`인 Task가 만든 동작
- 변경 범위의 기존 테스트와 빌드

깨졌으면 같이 고친다.
설계를 바꿔야 고칠 수 있으면 고치지 않고 `blocked`로 알린다.
확인하지 못한 것은 비고·한계에 적는다.

## implementer 위임 기준
위임 프롬프트에는 `<feature-dir>`와 Phased mode라는 것을 적는다.
재작업이면 직전 verify의 문제 항목도 적는다.

## 테스트 코드 작성
- Phased에서는 Task의 제목·접근·`확인`이 테스트를 요구할 때만 테스트를 쓴다.
  고친 버그를 재현하는 회귀 테스트 하나는 같이 넣어도 된다.
- Per-Request에서는 요청하지 않은 테스트를 넣지 않는다.
  테스트가 부족해 보이면 비고·한계에 적고, 넣을지는 사용자가 정한다.
- 구조·이름·시그니처를 바꿔서 깨지는 기존 테스트는 같이 고친다.
  합치거나 나눠도 되지만 다루던 경우와 검증 강도는 유지하고, 못 하면 이유를 적는다.
- 테스트가 실패하면 목적을 기준으로 구현과 테스트 중 틀린 쪽을 고친다.
  실패하는 입력만 피해 가는 분기를 넣거나 완료 조건을 약하게 만들지 않는다.

## 코드 작성
- 같은 디렉토리의 이름 짓기, 구조, 에러 처리 방식을 따른다.
- 파일 배치가 Task 접근과 다르면 디렉토리 관례를 따른다.
- 같은 일을 하는 기존 함수, 표준 라이브러리, 이미 쓰는 의존성이 있으면 그걸 쓴다.
- 같은 대상을 검증하는 테스트가 있으면 거기에 경우를 더한다.
- 이번 변경으로 안 쓰이게 된 코드는 지운다.

## 출력 구조
해당 없는 항목은 뺀다.
1. 상태 — Phased에서만 쓴다.
   - `completed`: 구현을 마쳤다.
     검증 조건을 확인하지 못했어도 이 값이다.
   - `blocked`: 이 문서가 `blocked`로 알리라고 한 경우다.
     어느 절 때문인지, 무엇에 막혔는지, 어떤 결정이 필요한지 적는다.
2. 대상 — Phased는 `task-<nnn>` 제목, Per-Request는 사용자 요청 인용.
3. 변경 내용 — 무엇을 바꿨는지 글로 적는다.
   코드를 다시 붙이지 않는다.
4. 고친 파일 — 경로별 추가/삭제 줄 수, 새로 만든 파일·함수·타입 이름.
5. 비고·한계 — 범위 밖에서 발견한 것, 확인 못 한 것, 미룬 것.
6. 접근 이탈 — 구현이 Task의 접근과 달라졌거나, Per-Request에서 요청에 없던 판단을 했을 때.
   무엇을 왜 정했는지와 `file:line`을 적는다.
   이번 변경 밖에서도 통하는 결정이면 `docs/design.md`에 반영할 후보라고 적는다.
   implementer는 문서를 고치지 않고 여기에만 적는다.
7. 실행한 검증 — 돌린 명령과 결과.

## 완료
main이 하는 일이다.
- Phased에서 상태가 `completed`면 같은 턴에 `verify`를 부른다.
  사용자가 구현만 요청했으면 부르지 않고 verify를 권한다.
- `blocked`면 verify를 부르지 않고 사용자에게 막힌 이유를 알린다.
- verify 뒤 implement.md·README 갱신은 `skills/verify/SKILL.md` §verify 후처리를 따른다.
