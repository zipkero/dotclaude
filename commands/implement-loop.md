---
description: Run features/[feature-dir]/implement.md Tasks in a loop - implement, verify, advance, and stop when a decision needs the user
argument-hint: "<feature-dir>"
disable-model-invocation: true
---

Feature directory: $ARGUMENTS

## 역할
- main이 `implement`(implementer agent) → `verify` → `skills/verify/SKILL.md` §verify 후처리를 사용자 개입 없이 반복하고, 문서는 그 후처리와 `skills/implement/SKILL.md` §완료가 고치는 것만 고친다.

## 루프
1. 위에서부터 이번 루프에서 미루지 않은 첫 `[ ]` Task를 잡고, 없으면 끝낸다.
   `확인`이 다른 Task에서 확인한 동작을 다른 OS·실기기에서 수동으로 다시 보는 것뿐인 Task는 미뤄 두고 보고에 모은다.
2. `implement`를 돌린다.
3. `verify`를 돌린다.
4. `approved`면 후처리를 하고 1로, `rejected`면 후처리를 하고 §재시도로 간다.

## 재시도
- `evidence`면 다시 구현하지 않고, main이 해소 조건의 입력·환경을 갖춰 §루프 3단계부터 다시 한다(Task당 최대 2회).
- 분류가 `correctness`이고 `수정 소유 단계`가 `implement`면 §루프 2단계부터 다시 맡긴다(Task당 최대 2회, 위 횟수와 따로 센다).

## 정지
아래에서 멈추고 §보고를 낸다.
- `blocked`, `판정 불가`, 재시도하지 않는 reject, 재시도 횟수 소진, 해소 조건을 갖출 수 없는 `evidence`

## 보고
1. 이번 루프에서 `[x]`가 된 Task
2. 멈춘 Task, 멈춘 이유와 근거, 검증받지 않은 채 남은 변경 파일
3. Task별 재시도 횟수와 verify가 낸 문제 한 줄
4. 다음 할 일 — 고쳐야 할 문서(`수정 소유 단계`가 있으면 그 단계)나 사용자가 정할 것
5. 미룬 수동 확인, 승인된 Task의 `미확인`·`판정 방법 변경`, 이번 루프에서 남긴 `검증 조건 변경`, 승인된 Task·멈춘 Task의 verify가 남긴 범위 밖 발견·남은 지적·문서 갱신 후보
6. 규칙 후보 — 같은 원인의 문제가 재시도나 다른 Task에서 다시 나왔거나 결함이 아닌데 reject가 났으면, 그 원인을 다루는 기존 규칙에서 고칠 문장(없으면 한 줄 규칙과 넣을 곳 `~/.claude/rules/<파일>` 또는 프로젝트 `CLAUDE.md`, 설정·도구로 막을 수 있으면 그 방법)
   사용자가 승인해야 넣는다.

없는 항목은 뺀다.
