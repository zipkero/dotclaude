---
description: Run features/<feature-dir>/implement.md Tasks in a loop - implement, verify, advance, and stop when a decision needs the user
argument-hint: "<feature-dir>"
disable-model-invocation: true
---

Feature directory: $ARGUMENTS

## 역할
- `implement` → `verify` → 체크박스 바꾸기를 사용자 개입 없이 반복한다.
- 구현은 `skills/implement/SKILL.md`, 판단은 `skills/verify/SKILL.md`, 판단 뒤 기록은 같은 파일 §verify 후처리를 따른다.
- 이 command는 반복, 재시도, 멈출 조건만 정한다.

## 실행 주체
main이 루프를 돌리고, 매번 `implement`는 implementer agent에 맡긴다.

## 전제 조건
`features/<feature-dir>/implement.md`가 없으면 멈추고 `/implement-init`을 안내한다.

## 루프
1. implement.md 위에서부터, 이번 루프에서 미루지 않은 첫 `[ ]` Task를 잡는다.
   §수동 확인 Task에 해당하면 멈추거나 미룬다.
   남은 Task가 없으면 끝낸다.
2. `implement`를 돌린다.
   `blocked`면 §정지 조건으로 간다.
3. `verify`를 돌린다.
4. `approved`면 §verify 후처리를 하고 1로 돌아간다.
   `rejected`면 §verify 후처리대로 `최근 reject`를 쓰고 §재시도로 간다.

## 재시도
- 분류가 `evidence`면 다시 구현하지 않는다.
  - main이 해소 조건에 필요한 입력·환경을 준비하고, 준비한 내용과 직전 해소 조건을 넘겨 3번부터 다시 한다.
  - 이 재검증은 Task당 2번까지다.
    구현 재시도와 따로 센다.
  - 준비할 수 없거나 2번을 다 쓰면 정지 조건 7로 간다.
- `수정 소유 단계`가 `implement`이고 분류가 `design/scope`가 아니면, 같은 Task를 2번부터 다시 맡긴다(`skills/implement/SKILL.md` §implementer 위임 기준).
  - 체크박스는 `[ ]`로 둔다.
  - 구현 재시도는 Task당 2번까지다(구현은 최대 3번).
  - 다 쓰면 정지 조건 3으로 간다.
- 나머지 reject는 재시도하지 않고 정지 조건 1로 간다.

## 수동 확인 Task
- 수동 확인이 이미 확인한 동작을 다른 OS·실기기에서 다시 보는 것뿐이면, 그 Task를 `[ ]`로 두고 다음 Task로 넘어간다.
  확인할 항목은 §보고에 모은다.
- 그 밖의 수동 확인이 있는 Task에서는 멈추고 사용자에게 알린다.

## 정지 조건
아래 중 하나에 걸리면 멈추고 §보고를 낸다.
1. 문서를 고칠지 사용자가 정해야 한다.
   - §재시도에서 넘어온 reject
   - spec.md·design.md·implement.md를 고쳐야 한다는 `blocked`(Task를 다시 나눠야 한다는 것 포함)
   - 지금 Task에 걸린 정해지지 않은 Decision Point(`skills/implement/SKILL.md` §정해지지 않은 설계)
   - 완료 조건끼리 충돌하거나, 지금 설계로는 지금 Task를 끝낼 수 없다는 `blocked`
   - `매핑 누락`을 맡을 Task가 없어 미매핑 처리로 넘어간 approve
2. 이미 `[x]`인 Task의 동작이 깨졌다는 `blocked`가 나왔다(`skills/implement/SKILL.md` §범위 원칙).
3. 재시도 횟수를 다 썼다.
4. §수동 확인 Task가 멈추라고 한 Task를 만났다.
5. 그 밖의 이유로 implement가 `blocked`를, verify가 `판정 불가`를 돌려줬다.
6. 되돌리기 어렵거나 외부에 영향을 주는 일이 필요하다(CLAUDE.md §사전 확인).
7. 근거를 더 채울 수 없다.
   해소 조건을 준비할 수 없거나 재검증 2번을 다 썼다.

루프가 고치는 문서는 implement.md와 feature README뿐이다.
implement.md 필드는 §verify 후처리가 시킬 때만 고친다.

## 보고
1. 진행 결과 — 이번 루프에서 `[x]`가 된 Task.
2. 멈춘 곳 — 대상 `task-<nnn>`, 걸린 정지 조건 번호, 그렇게 본 근거.
   조건 7이면 해소 조건도 적는다.
   코드를 고친 뒤 멈췄으면 검증받지 않은 파일 목록도 적는다.
   끝까지 갔으면 뺀다.
3. 재시도 이력 — Task별 구현 재시도·재검증 횟수와 verify가 낸 문제 한 줄. 없으면 뺀다.
4. 다음 할 일
   - 정지 조건 2면 깨진 동작, 그 Task, 확인한 근거만 적는다.
   - 그 밖에는 `수정 소유 단계`가 있고 `implement`가 아니면 그 단계의 문서를 짚는다.
   - 아니면 멈춘 이유가 가리키는 곳(implement.md의 Task, design.md의 Decision Point, spec.md 완료 조건)을 짚는다.
   - 여러 문서면 `rules/feature-docs.md`의 순서를 따른다.
5. 미룬 확인 — §수동 확인 Task로 미룬 Task와 확인할 항목. 없으면 뺀다.
6. 남은 발견 — 승인된 Task의 범위 밖 발견, `docs/design.md` 반영 후보, verify의 남은 위험, 프로젝트 루트 문서 갱신 후보. 없으면 뺀다.
