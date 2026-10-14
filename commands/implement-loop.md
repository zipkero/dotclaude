---
description: Run features/<feature-dir>/implement.md Tasks in a loop - implement, verify, advance, and stop when a decision needs the user
argument-hint: "<feature-dir>"
disable-model-invocation: true
---

Feature directory: $ARGUMENTS

## 역할
- main이 `implement`(implementer agent) → `verify` → `skills/verify/SKILL.md` §verify 후처리를 사용자 개입 없이 반복한다.
- 구현·판정·기록 규칙은 `skills/implement/SKILL.md`와 `skills/verify/SKILL.md`를 따르고, 이 command는 반복·재시도·정지만 정한다.
- 루프가 고치는 문서는 implement.md와 feature README뿐이다.
- implement.md가 없으면 멈추고 `/implement-init`을 안내한다.

## 루프
1. 위에서부터 이번 루프에서 미루지 않은 첫 `[ ]` Task를 잡고, 없으면 끝낸다.
   수동 확인이 이미 확인한 동작을 다른 OS·실기기에서 다시 보는 것뿐인 Task는 미뤄 두고 보고에 모으며, 그 밖의 수동 확인 Task에서는 멈춘다.
2. `implement`를 돌리고, `blocked`면 멈춘다.
3. `verify`를 돌린다.
4. `approved`면 후처리를 하고 1로, `rejected`면 후처리를 하고 §재시도로 간다.

## 재시도
- `evidence`면 다시 구현하지 않고, main이 해소 조건의 입력·환경을 갖춰 3번부터 다시 한다(Task당 2번).
- `수정 소유 단계`가 `implement`이고 분류가 `design/scope`가 아니면 2번부터 다시 맡긴다(Task당 2번).
- 그 밖의 reject, 횟수 소진, 해소 조건을 갖출 수 없으면 멈춘다.

## 정지
아래에서 멈추고 §보고를 낸다.
- `blocked`, `판정 불가`, 재시도하지 않는 reject, 재시도 횟수 소진
- `매핑 누락`을 맡을 Task가 없는 approve
- 미루지 않는 수동 확인 Task
- 되돌리기 어렵거나 외부에 영향을 주는 일이 필요할 때(CLAUDE.md §사전 확인)

## 보고
1. 이번 루프에서 `[x]`가 된 Task
2. 멈춘 Task, 멈춘 이유와 근거, 검증받지 않은 채 남은 변경 파일
3. Task별 재시도 횟수와 verify가 낸 문제 한 줄
4. 다음 할 일 — 고쳐야 할 문서(`수정 소유 단계`가 있으면 그 단계)나 사용자가 정할 것
5. 미룬 수동 확인과 승인된 Task들이 남긴 범위 밖 발견·남은 위험·문서 갱신 후보

없는 항목은 뺀다.
